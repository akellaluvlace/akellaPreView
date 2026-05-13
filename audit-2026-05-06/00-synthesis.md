# Pre-Manual-Test Audit — 2026-05-06

Sister doc to `audit-2026-05-04/00-synthesis.md`. Six parallel specialized agents dispatched after all 8 prod-import surges shipped, immediately before the user begins manual testing. Goal: surface any real bugs, race conditions, silent failures, listener leaks, or encoding traps introduced by the recent 2026-05-05 work (§5(b) AI rewrite SSE + mobile/touch gestures + iframe cascade fix + storage panel extraction).

**TL;DR**: 44 findings (HIGH=10, MED=20, LOW=14). 9 fixes shipped this session — all 6 actual-bug HIGHs from Domains 1-4 + 3 MED quick-wins. The 3 type-design HIGHs (F1/F2/F4) are deferred as refactors. Domain 2 HIGH-1+2 was verified as agent over-claim and skipped. tsc 0, vitest 5341/5341 unchanged.

---

## Decisions locked at audit close

1. **Pure-logic prod-import surge series CLOSED**. 8 surges over 2 days, 34 files / ~1212 cases, all major `lib/` pure surface covered + the lone localized drift fixed. Marginal value of further pure-logic test coverage is low.
2. **jsdom devDep APPROVED for next session.** First integration test exercising paste→injectOids→iframe→render→click→edit per audit `02-tests.md` recommendation. Tests-only devDep, NOT a locked-stack violation (locked stack is runtime only: Next 14.2.x, Tailwind 3.4.x, parse5, Babel, magic-string).
3. **(c) Multi-file component-instance propagation DEFERRED** to spec-design pass per `maniuplation.md` §4.5.
4. **LOW-backlog DEFERRED**: ~75 attribution-comment strip (substance-loss risk per prior user caution) + ~20 export demotions (some now imported by prod-import tests, can't blanket-demote).
5. **Manual testing begins next session.** Codebase is hardened.

---

## Audit dispatch summary

| Domain | Agent | Files audited | LOC | Findings |
|---|---|---|---|---|
| 1 | feature-dev:code-reviewer | `lib/preview.ts` | 2560 | HIGH=2 MED=2 LOW=1 |
| 2 | feature-dev:code-reviewer | `lib/sse.ts` + `app/api/llm-rewrite/route.ts` + `FocusEditor.tsx` AIRewriteSection | ~1400 (subset) | HIGH=2 MED=4 LOW=3 |
| 3 | feature-dev:code-reviewer | `lib/touch.ts` + `SelectionOverlay.tsx` + `ElementTree.tsx` pointer sites + `globals.css` | ~7400 (subset) | HIGH=1 MED=2 LOW=0 |
| 4 | pr-review-toolkit:silent-failure-hunter | repo-wide focus on changed files | n/a | HIGH=2 MED=4 LOW=3 |
| 5 | feature-dev:code-reviewer | `lib/storage-panel.ts` + `lib/tree-persistence.ts` + `StorageHealthPanel.tsx` | 6100 | HIGH=0 MED=3 LOW=3 |
| 6 | pr-review-toolkit:type-design-analyzer | recently-added types across all above | n/a | HIGH=3 MED=5 LOW=4 |
| **Total** | | | | **HIGH=10 MED=20 LOW=14** |

---

## Fixes shipped this session (9)

### HIGH bug fixes (6)

**Fix #1 — `extractTailwindConfig` `</script>` injection guard** (`lib/preview.ts:2174`)
- **What**: User-controlled string literals inside the Tailwind config (e.g. theme tokens like `content: "</script>"`) were embedded raw into `<script>tailwind.config = ${body};</script>`. The HTML parser would terminate the script tag at the literal `</script>` and convert every following head element (Tailwind CDN, React, ReactDOM, Babel) into raw text — completely broken iframe.
- **Fix**: `body.replace(/<\/script>/gi, "<\\/script>")` before injection. HTML parser doesn't see `<\` as tag-end; JS sees `\/` as a literal `/` (string semantics survive).
- **Severity in agent report**: HIGH (Domain 1, confidence 88).

**Fix #2 — `extractTailwindCssStyles` `</style>` JSX-form guard** (`lib/preview.ts:2198`)
- **What**: Same pattern as Fix #1 but for the `<style type="text/tailwindcss">` extraction. Raw form is regex-bounded at `[\s\S]*?</style>` so safe by construction; JSX form takes a string-literal body that could contain literal `</style>`.
- **Fix**: `body.replace(/<\/style>/gi, "<\\/style>")` after the existing decoder. CSS treats `\/` as escaped `/` (string semantics survive); HTML doesn't see `<\` as tag-end.

**Fix #3 — `dblclick` tool-gate** (`lib/preview.ts:1881`)
- **What**: The dblclick handler activated text-edit mode (`contenteditable=true`, `dropinEditing = t`) regardless of `DROPIN_TOOL`. In `view` mode this hijacked native interactions (link follow, button action) because the handler also called `ev.preventDefault()` + `ev.stopPropagation()`. The click handler at line 1804 correctly gates on `DROPIN_TOOL !== 'select' && DROPIN_TOOL !== 'move'`; dblclick had no equivalent gate.
- **Fix**: Added `if (DROPIN_TOOL !== 'select') return;` at top of handler.
- **Severity in agent report**: HIGH (Domain 1, confidence 91).

**Fix #5 — SelectionOverlay tool-switch listener leak** (`components/SelectionOverlay.tsx:1119-1150`)
- **What**: The `useEffect(..., [tool])` ran when user switched tools mid-gesture. It nulled `gestureRef.current` (making dangling handlers inert via gateguard) and called `setIframePointerEventsDisabled(false)`, but it never called `teardownRef.current()` — so all 8 window/document listeners (`pointermove`, `pointerup`, `pointercancel`, `lostpointercapture`, `keydown`, `keyup`, `blur`, `visibilitychange`) registered by the interrupted gesture stayed attached. They were inert (gestureRef-null gate), but the underlying leak was real. On long sessions with frequent tool-switching mid-gesture, the window accumulated O(8 × N) dangling listeners. Bounded by overlay lifetime, not session.
- **Fix**: Replaced the manual partial cleanup with `if (teardownRef.current) { teardownRef.current(); teardownRef.current = null; }` — the existing per-gesture `teardown(true)` (e.g. line 1780) already removes every listener AND nulls gestureRef AND restores iframe pointer events AND clears live styles per kind. Tool-switch now tears down identically to a normal gesture release.
- **Severity in agent report**: HIGH (Domain 3, confidence 92).

**Fix #8 — `handleTreeDndMixed` partial-bail count** (`components/Workspace.tsx:1241-1262`)
- **What**: This NEW multi-op handler (twenty-ninth-pass mixed-multi case, post-2026-05-04-audit) iterated `crossParentOps` and only `log()`'d individual bails to dev console; the user-facing `showInfo("Moved 3 elements")` toast never mentioned that 2 of 5 ops bailed. The 2026-05-04 audit had fixed 7 multi-op handlers to surface partial-bail count via `showWarn`; this handler was the missing 8th.
- **Fix**: Added `bailCount` + `firstBailReason` tracking to the cross-parent loop, plus `showWarn(\`Reparent: ${bailCount} of ${crossParentOps.length} bailed (${firstBailReason})\`)` after the success toast — same pattern as `handleReorderMulti` at line 1352-1356.
- **Severity in agent report**: HIGH (Domain 4 silent-failures).

**Fix #9 — Upstream-provider AbortController billing leak** (`app/api/llm-rewrite/route.ts:236-362`)
- **What**: `fetchOpenAIStream` / `fetchAnthropicStream` didn't accept an AbortSignal. The `ReadableStream`'s `cancel()` callback claimed "no per-request resources to free" but the upstream HTTP connection to OpenAI/Anthropic stayed open after client disconnect (Stop button, unmount, route nav), still consuming/billing tokens until the provider closed the body. The user's `loading=false` resolved instantly client-side, but server-side billing continued for tens of seconds.
- **Fix**: Added `signal: AbortSignal` parameter to both `fetchOpenAIStream` + `fetchAnthropicStream`, threaded into the `fetch()` call. Created `upstreamAc = new AbortController()` in `streamProvider`; `cancel()` callback now does `upstreamAc.abort()`. Plus changed the `start()` body's `catch {}` to `catch (e)` and added `console.error("[llm-rewrite] stream interrupted", { reason, err })` distinguishing client-disconnect (signal aborted, silent) from genuine stream errors (logged) — closes Domain 4 MED-4 silent-failure simultaneously.
- **Severity in agent report**: HIGH (Domain 4 silent-failures).

### MED quick-wins (3)

**Fix #4 — `dropinHoverPreview/Clear` OID escape** (`lib/preview.ts:1487`, `:1501`)
- **What**: Both functions built attribute selectors via raw string concat: `'[data-dropin-id="' + id + '"]'`. The sibling `dropinFindByOid` (line 304) and `dropinRebuildLiveStylesheet` (line 1446) both apply CSS escaping (`dropinCssEscape(oid)`/`safeId`) at this position. If the OID alphabet ever widens to include `"`, the selector becomes syntactically invalid and `querySelector` throws. Inconsistency was a latent landmine.
- **Fix**: Replaced raw `id` with `dropinCssEscape(id)` at both sites.
- **Severity in agent report**: MED (Domain 1, confidence 82).

**Fix #6 — `onRowPointerDown` setPointerCapture** (`components/ElementTree.tsx:1140`)
- **What**: The tree-row drag handler registered the full 7-listener set per spec (pointermove/up/cancel/lostpointercapture/keydown/blur/visibilitychange) but never called `e.currentTarget.setPointerCapture(e.pointerId)` — unlike the rail-width drag (`onResizeDown` at line 2083) and every gesture in SelectionOverlay. Without pointer capture, fast drag past element bounds on touch/stylus (the explicit target of the mobile work) could let the OS steal the pointer stream. Window-level listeners partially mask this on desktop; on touch they don't.
- **Fix**: Added `try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}` immediately after the `e.button !== 0` early-bail, matching the rail-width pattern.
- **Severity in agent report**: MED (Domain 3, confidence 85).

**Fix #7 — Slider coarse thumb 32→44px** (`app/globals.css:137-145`)
- **What**: The coarse-pointer override set webkit + moz slider thumbs to 32×32. The project's own `TOUCH_HIT_AREA_PX = 44` constant in `lib/touch.ts` and the comment at line 128 both describe the intention as enabling finger-tipped use; 32px misses the Apple HIG / Material 44pt target. Track container correctly grows to `h-11` (44px), so the thumb is reachable via the wider track hit zone — but the visual + interactive target on the knob itself was 32px.
- **Fix**: Bumped both webkit + moz thumbs to 44×44 with `margin-top: -20px` to recenter (math: -(thumb-track)/2 = -(44-4)/2 = -20).
- **Severity in agent report**: MED (Domain 3, confidence 80).

### Skipped (verified agent over-claim)

**Domain 2 HIGH-1 + HIGH-2 — FocusEditor `runRewrite` early-return paths "leak loading=true"**

- **Agent claim**: When `fetch()` throws AbortError or `!res.body`, the early-return paths at lines 1132-1145 don't call `setLoading(false)` or clear `abortRef.current` — UI stays frozen "permanently".
- **Verification**: Traced through the cases:
  - **Case 1: Stop button**. `stopRewrite()` synchronously calls `abortRef.current?.abort(); abortRef.current = null; setLoading(false);`. THEN the abort propagates as an async rejection. By the time the catch block runs, state is already cleared. The bare `return` is correct.
  - **Case 2: Unmount**. Component is going away; state doesn't matter.
  - **Case 3: Network error (non-AbortError)**. The catch DOES call `setError(...) + setLoading(false) + return`. Only `abortRef` leaks the dead controller, but next runRewrite calls `.abort()` on it (no-op) before replacing it. Benign.
  - **Case 4 (Stop while at reader.read())**: catch → ac.signal.aborted → return → finally runs → cleanup.
- **Conclusion**: Agent missed that `stopRewrite` owns the cleanup, not the catch. Recorded so future audits don't re-flag.

---

## Deferred to follow-up (3 type-design HIGHs)

These are real concerns but require type-shape refactors, not bug fixes. Recorded in CLAUDE.md "Audit follow-up — type-design HIGHs deferred from 2026-05-06 audit" backlog.

### F1 — `parseRewriteRequest(raw: unknown)` validator
- **Location**: `app/api/llm-rewrite/route.ts:384`
- **Issue**: `body = (await req.json()) as RewriteRequest` is a pure type assertion. Field-by-field validation runs after the cast (lines 389-407), so any future edit moving a property access above the validators won't be caught by tsc.
- **Redesign**: Define `RewriteRequest` fields as `unknown` in the inferred-from-JSON shape, and gate access through `parseRewriteRequest(raw: unknown): RewriteRequest | { error: string }`.

### F2 — Type the route's success path
- **Location**: `app/api/llm-rewrite/route.ts:429` (success), `:50-53` (`RewriteResponse` definition)
- **Issue**: `RewriteResponse = { ok: true; classes; explanation? } | { ok: false; error }` is exemplary, but only `bad()` is annotated `NextResponse<RewriteResponse>`. The success path returns plain `NextResponse.json({ ok: true, classes })` with no annotation, AND `streamErrorResponse` returns a different envelope (`encodeServerFrame`) that doesn't conform to `RewriteResponse` at all. Two response shapes share one route with zero type linkage.
- **Redesign**: Split the route's return type explicitly: `Response<RewriteResponse>` for `stream: false` and `Response<EventStream<ServerStreamPayload>>` (a phantom-typed brand around `Response`) for `stream: true`, then narrow at the route boundary.

### F4 — Phantom-typed `schemaVersion`
- **Location**: `lib/storage-panel.ts:434-457` (`StoragePanelExport`), `:1514-1518` (`StoragePanelSnapshot`)
- **Issue**: `StoragePanelExport.schemaVersion: 1` is a literal type but only one type — a v2 export shape would be a different interface entirely; nothing links v1 and v2 as siblings of a discriminated union over `schemaVersion`. Worse, `StoragePanelSnapshot.schemaVersion: number` lost the literal narrowing entirely; corrupted localStorage with `schemaVersion: 99` satisfies the type.
- **Redesign**: Discriminated unions: `type StoragePanelExport = StoragePanelExportV1 | StoragePanelExportV2`, and tighten `StoragePanelSnapshot.schemaVersion: 1` to the literal so future bumps must add a new union arm explicitly.

---

## Other non-fixed findings worth knowing about

These were NOT fixed this session. Either they're low-priority, deferred, or require larger refactors than fit in a hardening pass.

### Domain 1 (lib/preview.ts) — additional findings

- **MED**: Duplicate `dropin:error` postMessage in JSX mode (`lib/preview.ts:2040-2045` and `:2270-2271`). The inspector runtime's `window.addEventListener('error', ...)` AND the outer IIFE's same handler both post `dropin:error` for uncaught post-mount runtime errors. Caught errors only post once via `showError`. Fix: mode-gate the inspector's listener to HTML mode only, or remove it from JSX mode.
- **LOW**: `aOver` dead-computation in `dropinResolveBgColor` (`lib/preview.ts:1205`). `var aOver = color.a + (1 - color.a)` is always exactly `1.0` (algebraic identity). Misleading name implies real alpha-compositing math; replace with literal `1` + comment.

### Domain 2 (SSE pipeline) — additional findings

- **MED**: `onApply(payload.classes)` fires inside the read loop while the stream is still open (`FocusEditor.tsx:1166-1168`). User sees classes applied to canvas while loading spinner stays active for a few hundred ms (until TCP FIN). Fix: `setLoading(false) + clear abortRef + break` immediately after `onApply` in the `complete` branch.
- **MED**: `stopRewrite()` does `setLoading(false)` redundantly with the `finally` block (`FocusEditor.tsx:1098-1102` + `:1196-1204`). Sub-millisecond window where loading=false is visible while reader is mid-teardown. Fix: remove `setLoading(false)` from `stopRewrite`; let `finally` own all state cleanup.
- **MED**: Rate-limit `buckets` Map grows unbounded (`route.ts:59`, `:61-71`). One entry per unique IP for the lifetime of the Node.js process. Single-region single-process deployment is fine; many-IP traffic (scanners, broad user base) accumulates. Fix: `setInterval` sweep deleting expired entries, or LRU cap.
- **MED**: Rate-limit response Content-Type for non-streaming clients (`route.ts:374-380`). 429 returns `text/event-stream` even for `stream: false` callers. Comment acknowledges this as "fine"; if not intentional, branch on `body.stream` before the rate-limit return.
- **LOW**: Comment at `FocusEditor.tsx:1199-1202` is misleading — says "controller cancel already tore the reader down" but `releaseLock()` IS still required. Fix: update comment.
- **LOW**: `streamProvider` ignores `delta.done` flag (`route.ts:312-315`). Intentional per comment; keeps reading until provider closes body. Document explicitly.
- **LOW**: `STREAM_HEADERS.Connection: keep-alive` is a no-op on HTTP/2 (Vercel's edge layer). Document or remove.

### Domain 3 (mobile/touch) — additional findings

- (LOW): No additional findings beyond the 3 fixed.

### Domain 4 (silent failures) — additional findings

- **MED**: Two clipboard rejection paths in StorageHealthPanel silently no-op (`components/StorageHealthPanel.tsx:618-622` `handleCopyStoragePanel`, `:864-866` `handleCopyStoragePanelPresetUrl`). Same defect the 2026-05-04 audit fixed in `Workspace.tsx`; wasn't carried over when StorageHealthPanel was extracted. Fix: add `showWarn`-style rejection branch. Requires threading a toast helper through the component (not currently imported).
- **MED**: `parseServerStreamPayload` returns `null` on FOUR distinct failure modes (JSON parse fails / root not object / unknown envelope type / shape mismatch within known type) — `lib/sse.ts:175-205`. Consumer collapses all four into "ignore and read more" — same pattern that caused the relativeImports cascade. Fix: discriminated `{ kind: "ok" | "skip" | "malformed" }` return.
- **MED**: `releaseLock()` swallow at `FocusEditor.tsx:1199-1202` (and symmetric at `route.ts:348-352`) — documented but masks any future reader-state corruption. Fix: bind `catch (e)` and `console.warn` if abort signal isn't set.
- **LOW**: ElementTree rail-width persist swallows localStorage write failure silently (`components/ElementTree.tsx:2065-2069`). Symmetric pattern in ~30 sites in `lib/storage-panel.ts`. Cumulatively: a Safari Private mode user's entire panel state is volatile with no global signal. Fix: centralize through `safeLocalStorageSet` helper that fires one-time `console.warn` on first failure per page-load.
- **LOW**: `tryFormatJsonValue` returns `null` indistinguishably for "primitive input" vs "malformed JSON" (`lib/storage-panel.ts:865-873`). Truly corrupted JSON shows up identically to a number value. Fix: discriminated return or `wasMalformed` flag.

### Domain 5 (storage panel extraction) — additional findings

- **MED**: `describeStoredTreeStateEntries` + `describeAllStoredEntries` exported but no callers outside `lib/tree-persistence.ts` itself (no test imports either). Confirmed `~20 unused-externally exports` per CLAUDE.md backlog. Fix: remove `export` from both.
- **MED**: `bytes` cap policy is display-only — `predictStoredTreeStateBytes` runs in a `useMemo` to drive footer telemetry, but no write effect checks predicted bytes before writing. Fix or accept as known-gap-deferred.
- **MED**: `clearAllStoredStoragePanelPreferences` maintains a parallel hard-coded `removeItem` list; not enforced by type. Future new keys could be missed. Fix: derive wipe list from `STORAGE_PANEL_CONSTANTS`.
- **LOW**: StorageHealthPanel.tsx still 2803 LOC after extraction — sub-extraction opportunities (snapshot/diff, import/export, per-key edit, recent-imports ring). Not correctness; defer to LOW backlog.
- **LOW**: 10 parse/serialize helpers in `lib/tree-persistence.ts` exported only because tests import them for prod-import drift detection. If tests ever migrate to bench-internal mirrors, exports could drop. Document as intentional.
- **LOW**: Single shared `STORAGE_SCHEMA_VERSION` for both panel + tree keys. Bumping affects both. Future-evolution risk; not current bug.

### Domain 6 (type design) — additional findings

- **MED-F3**: `ServerStreamPayload` consumer doesn't enforce exhaustiveness (`FocusEditor.tsx:1164-1171`). Uses `if/else if/else if` without a final `assertNever`. Adding a fourth variant ("warning", "progress") to the union would silently drop the new case. Fix: `switch (payload.type)` + `default: assertNever(payload)`.
- **MED-F5**: `parseStoragePanelExportJson` legacy shape returns `T | null` but file already has the better `StoragePanelExportParseResult { kind: "ok" | "error" }` shape. Two parser bodies → drift risk. Fix: delete the legacy null-returning shape.
- **MED-F6**: `StoragePanelRecentImport.panelState` shape duplicated inline rather than referenced (`lib/storage-panel.ts:1305-1310` vs `:441-446`). Future fields won't propagate. Fix: extract `StoragePanelStateKnobs` shared type.
- **MED-F8**: `versionedKey` returns `string`, no key-name brand. Cross-key reads possible without compile-time error. Fix: `DropinTreeKey<Name extends string>` brand.
- **MED-F9**: `ProviderResult` mixes success and failure as flags + optional fields. Implicit invariant ("`ok: true` implies `text` defined"). Fix: discriminated union.
- **LOW-F7**: `StoredTreeStateEntry.bytes` is derived but not validated as such — importer accepts any `bytes` from imported JSON unchallenged. Fix: recompute on import or assert.
- **LOW-F10**: `useCoarsePointer` returns `boolean` but documents "SSR + first client render always return false". Type doesn't surface the "I might be lying for one render" invariant. Fix: `{ value: boolean; ready: boolean }` or accept as-is.
- **LOW-F11**: SSE `extractOpenAIDelta`/`extractAnthropicDelta` swallow malformed JSON to `{ text: "", done: false }` — indistinguishable from valid no-text frames. Fix: discriminated `ProviderDelta`.
- **LOW-F12**: `StoragePanelFilterMode` consumers thread substring vs regex paths manually. Fix: `CompiledFilter` discriminated union with single applier.

---

## Verification

- `npx tsc --noEmit` → 0 errors
- `npm run test` → **5341/5341** vitest tests pass across **75 test files** (unchanged from pre-audit baseline; fixes are surgical)
- `node scripts/bench-tree-dnd-multi.mjs` → 56/56 PASS standalone (post-clone-deletion)
- `node scripts/bench-constraints.mjs` → 33/33 PASS standalone (post-`approxRatio`-deletion)
- `node scripts/bench-tree-dnd.mjs` → 37/37 PASS standalone (post-`checkKind`-deletion)

---

## Files modified this session

Earlier same-day cleanup (3 bench files — dead-clone deletions; scripts/ is git-untracked):
- `scripts/bench-tree-dnd-multi.mjs` (1332 → 1284, -48 LOC)
- `scripts/bench-constraints.mjs` (542 → 536, -6 LOC)
- `scripts/bench-tree-dnd.mjs` (556 → 546, -10 LOC)

Audit fixes (production code):
- `lib/preview.ts` (2 srcdoc-injection guards + dblclick tool-gate + 2 OID escape sites)
- `app/api/llm-rewrite/route.ts` (upstream AbortController + console.error in catch)
- `components/SelectionOverlay.tsx` (tool-switch teardownRef call)
- `components/ElementTree.tsx` (onRowPointerDown setPointerCapture)
- `components/Workspace.tsx` (handleTreeDndMixed bail count + showWarn)
- `app/globals.css` (slider thumb 32→44px)

Documentation:
- `CLAUDE.md` (Decisions locked + Pre-manual-test audit COMPLETE entry + 9-fix bullet + Audit follow-up section)
- `~/.claude/projects/.../memory/project_manipulation_phase1_progress.md` (TL;DR + new dated section)
- `audit-2026-05-06/00-synthesis.md` (this file)

---

## Resume guide for next session

1. Read this file first if you need detail on the unfixed MED/LOW findings.
2. Read `CLAUDE.md` "Pre-manual-test audit COMPLETE" entry for the at-a-glance summary.
3. Read `audit-2026-05-04/00-synthesis.md` for the prior audit's context.
4. Manual testing is the next thing on the user's plate — they will start without prompting; just respond to whatever surfaces.
5. If the user wants to start the jsdom integration test before manual testing: it's pre-approved per the locked decisions. Add `jsdom` (or `happy-dom`) as a devDep and write the first end-to-end test.
6. Type-design refactors F1/F2/F4 are recorded in CLAUDE.md backlog — pick up if user wants.
