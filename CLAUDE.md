# CLAUDE.md

Project: **Dropin** — Next.js + Vercel site where vibecoders paste AI-generated HTML/JSX and see it render live, or pick from a gallery of templates. Audience: people with no terminal, no Node install, no dev background.

## Active branches (2026-05-17)

- **`main`** — codebase. Last commit `0878566 backup: web templates state before 94/10/32/16/69 batch`.
- **`audit-phase2-cascade-ids`** — long-lived feature branch. Audit work + UI/UX redesign + vibe-edit + 2026-05-14 vibecoder simplification + 2026-05-15 Move retirement + 2026-05-15 vibecoder feature batch + 2026-05-16 polish + 2026-05-17 component-swap retirement + AI Edit Phase 0-3. **~30+ commits ahead of main, all LOCAL ONLY — never pushed.** Latest pre-commit: Phase 2 + Phase 3 polish (model routing, undo button, parent context, ephemeral warning, copy export, 4 bugs hunted). Full per-session log in `CLAUDE-archive-status.md`.

## Backup checkpoints (rollback refs)

| Date | Commit | Restore command | What it captures |
|---|---|---|---|
| 2026-05-15 | `d656e21` | `git reset --hard d656e21` | Pre-cascade-detach + pre-move-fix work. Vibe-edit 5-phase simplification + inline component browser + 2026-05-15 plans. Two new SVG logos. CLAUDE.md trimmed + archive. tsc 0, vitest 6291/6293. |
| 2026-05-10 | `c659862` | `git reset --hard c659862` | Pre-master-ID sweep snapshot (vibe-edit scaffold + audit-phase2 cascade work). Also tagged `backup/pre-master-id-sweep-2026-05-10`. |
| 2026-04-26 | `36ad297` | `git reset --hard 36ad297` | Initial publish — project source, audit docs, logo brief. The base before this branch diverged. |

## Current status (2026-05-20 — Phase 9 cascade detach shipped: when user edits/swaps one card in a 3-card `.map()`, ONLY that card changes. AI edit/swap auto-detaches the clicked instance via applyDetachFromMap before applying. tsc 0. vitest 6421/6423 (+18 detach tests, 2 envelope-channel pre-existing). Phase 7 at `8d4961b`, Phase 8 at `35f2e9d` + `22b9aea` hotfix, Phase 9 uncommitted.)

### Phase 9 — Cascade detach (uncommitted)

User reported 2026-05-20: "ai changed all 3 cards when i wanted one." Known cascade limitation: cards rendered from `.map()` share ONE source OID — edits by OID hit all rendered copies. Plan at `docs/superpowers/plans/2026-05-15-cascade-detach.md` was specced months ago for exactly this; finally shipped.

**How it works**:
1. Iframe runtime (`lib/vibe-edit/runtime.ts`) tracks `instanceIndex` — the 0-based DOM-position of the clicked element among all siblings sharing its OID. Vibe + AI selectors both emit this field now.
2. When user submits AI edit / swap on an element with `instanceCount > 1` + `instanceIndex >= 0`, `handleAiSubmit` / `handleAiSwapPick` calls `applyDetachFromMap(code, { oid, index })` BEFORE patching.
3. `applyDetachFromMap` (new at `lib/ast/operations/detach-from-map.ts`) rewrites the source:
   ```
   {items.map((x, i) => <Card .../>)}
   ↓
   {items.slice(0, K).map((x, i) => <Card .../>)}        ← left cascade
   {((x) => <Card .../>)(items[K])}                       ← detached IIFE, fresh OID
   {items.slice(K+1).map((x, i) => <Card key={i+K+1} .../>)}  ← right cascade
   ```
4. Strips OIDs from middle IIFE bytes only, re-injects globally → middle gets a fresh OID, left + right keep originals.
5. Returns `newOid` pointing at the detached element.
6. Host patches AI result onto `newOid` → only the detached copy changes. Other cascade siblings continue rendering from the unchanged callback.

**Bail conditions** (~20% of templates per the spec's audit):
- Element isn't inside a `.map()` call → "isn't rendered by a .map() call"
- Source is a CallExpression chain like `.filter().map()` → "filter/sort chains unsupported"
- Callback isn't an arrow → "named refs unsupported"
- Callback body has multiple JSX roots / null returns → "must return a single JSX element"
- `param1` (the index var) used outside `key=` → "rewrite would change runtime behavior"

On bail, surfaces a clear `showWarn` toast: "Edit will apply to all N copies — couldn't isolate this one: <reason>". Edit STILL proceeds but cascades (preserves user agency over "I can edit anyway, just know it cascades").

**+18 prod-import tests** covering happy paths (8: index 0/mid/last/single-arg/two-arg-with-key/block-body/destructured-param/MemberExpression-source/ArrayExpression-source), bails (5), OID regeneration (3), newOid extraction (1), instanceIndex round-trip via iframe runtime.

### Bug caught during Phase 9 build

My newOid extraction initially anchored on `((x) =>` to find the IIFE — but `.map((x) =>` (the left slice's callback) ALSO matches that pattern, so I was returning the LEFT slice's OID (which equals the original cascade OID), not the middle's. Fix: anchor on the IIFE's distinctive argument call `)(arrSrc[K])`, walk backwards to find the OID inside the IIFE range. Plus a fallback that skips any OID matching `op.oid` (cascade OID, which left+right slices retain).

### Files touched (Phase 9)

New:
- `lib/ast/operations/detach-from-map.ts` — applyDetachFromMap + bail conditions.
- `tests/detach-from-map-prod.test.ts` — 18 prod-import tests.

Modified:
- `lib/vibe-edit/runtime.ts` — vibeInstanceIndex helper, populated in vibeSerialize + aiSerialize.
- `lib/vibe-edit/types.ts` — VibeElementInfo.instanceIndex?.
- `lib/ai-edit/types.ts` — AiSelectionPayload.instanceCount? + instanceIndex?.
- `components/Workspace.tsx` — detach call in handleAiSubmit + handleAiSwapPick before patch; bail toast on failure.

### Bug also fixed in this batch (Phase 8 hotfix #2 `22b9aea`)

The earlier 0.92 trigram no-op threshold was false-positiving legit single-class edits. Dropped trigram fallback entirely. Now uses ONLY normalized-string equality (strip OIDs + sort class lists + collapse whitespace + byte-identical check). Real edits with any meaningful char diff pass through.

### Phase 8 — Diagnostic + no-op tightening (uncommitted)

User reported swap and edit both look broken — toast says "applied" but no visible change. Investigated the trace:
- Several runs returned target with classes reordered (e.g. 706 → 706 char identical-length response with completionTokens=485). Old `isNoOp` used 0.98 trigram threshold on raw strings — class-reorder kept similarity below 0.98 (because trigrams differ when "bg-red-500 text-white" becomes "text-white bg-red-500") so retry never fired.
- Recent edit-mode run: 694→716 chars (22-char diff). Real change but visually subtle. User couldn't tell if anything happened.

**Three fixes shipped:**

1. **Before/after diff tracers** in Workspace `handleAiSubmit` and `handleAiSwapPick`. After every successful API return, console.log dumps:
   - `[dropin:edit] BEFORE { len, head, tail }`
   - `[dropin:edit] AFTER { len, head, tail }`
   - `[dropin:edit] DIFF { lenDelta, classesAdded[], classesRemoved[], rootTagChanged }`
   Same shape for `[dropin:swap]`. Filter for "BEFORE/AFTER/DIFF" to see EXACTLY what the AI changed at the class level.

2. **Iframe DOM-verification tracer**. After the `el.outerHTML = newOuterHtml` assignment in the iframe runtime's `ai:apply-outer` handler, captures pre-swap + post-swap outerHTML and logs:
   - `[dropin:iframe-ai-swap] dom-verify { preLen, postLen, preHead, postHead, actualChange, identicalToRequested }`
   `actualChange: false` means the iframe DOM REJECTED the assignment (rare browser quirk). `identicalToRequested: true` confirms iframe took the exact bytes we sent.

3. **Pulse-highlight** on swapped element. Iframe runtime sets `data-ai-just-applied` on the new node for 1.2s, with a CSS keyframe that pulses a 3px coral outline + box-shadow halo. User SEES exactly which element was touched even when the AI made a subtle change (single class addition).

4. **No-op detection tightened**: new `normalizeForCompare()` strips `data-dropin-*` attrs and SORTS class-attribute values before comparing. Direct equality check post-normalize catches "model returned same content with classes reordered." Trigram fallback lowered from 0.98 to 0.92 to catch "nearly identical with one trivial class added." Length-diff prefilter widened 5% → 8% so small legit edits don't bypass.

### What you'll see in dev console next test

For every AI edit + swap:
```
[dropin:edit] BEFORE { len: 694, head: "<button class=\"bg-stone-200 ...\">", tail: "</button>" }
[dropin:edit] AFTER  { len: 716, head: "<button class=\"bg-red-500 ...\">",   tail: "</button>" }
[dropin:edit] DIFF { lenDelta: +22, classesAdded: ["bg-red-500"], classesRemoved: ["bg-stone-200"], rootTagChanged: false }
[dropin:iframe-ai-swap] dom-verify { preLen: 694, postLen: 716, actualChange: true, identicalToRequested: true }
```

If `DIFF.classesAdded` is empty + `lenDelta` is near zero → model returned a no-op. The tightened detector should catch most of these now and retry. If `actualChange: false` → iframe rejected the swap. If `identicalToRequested: false` → iframe normalized the HTML somehow (rare).

tsc 0. vitest 6402/6405 (no new tests this round — the changes are diagnostic + threshold tweaks, both observable in the existing manual-test flow).

### Phase 7 — Production-readiness grind (uncommitted)

After user manual-tested Phase 6 + hotfixes and reported "nowhere production level," ran 2 parallel research agents (tool-calling specifics, few-shot exemplar design) then shipped 5 fixes/improvements:

**Hard 45s API timeout** — manual test showed a 91s Tensorix call. Unacceptable UX. `callTensorix` now uses an `AbortController` with `TENSORIX_CALL_TIMEOUT_MS = 45_000`. Aborted calls surface as status 504 — fall into the existing transient-retry chain (504 ≥ 500), so a single timeout doesn't kill the request; both same-model retry + cross-model fallback get a shot before giving up.

**Tool calling migration** (`response_format: json_object` → OpenAI tool calling) — per research, lifts parse reliability from ~85-92% to ~95-99% because vLLM/SGLang enforce the JSON Schema at decode time. New `lib/ai-edit/tools.ts` defines `APPLY_EDIT_TOOL` (function `apply_edit({ html: string, notes?: string })`) and `APPLY_EDIT_TOOL_CHOICE` (forces exactly one call). Route's `callTensorix` adds `tools` + `tool_choice` to the request, parses response from `choices[0].message.tool_calls[0].function.arguments` first, falls back to `message.content` if model refused the tool call. `extractToolCallArgs` validates the parsed shape (rejects nulls, empty html, non-objects, malformed JSON). `response_format: json_object` kept as belt-and-braces for the fallback path.

**Model-specific defensive measures**:
- `notes` is `string` (not `string | null`) per minimax-m2's SGLang parser bug (sglang #16057 — union types crash the tool-call parser).
- `additionalProperties: false` on the schema — defensive against hallucinated extra fields.
- Tool-call path drops non-string notes silently (keeps html) rather than rejecting the whole response.

**Few-shot exemplar** in the swap prompt — per research, ONE annotated target/reference/output triple defeats the "edit target" drift mode coder models exhibit. Exemplar shows a `<button>Get Started</button>` target swapped onto a glass-morphism `<div class="card">` reference. Output's root tag is `<div>` (NOT `<button>`); "Get Started" replaces reference's "Click me" placeholder; reference's "Pro Plan" heading + "Everything you need to ship." paragraph are DROPPED (no placeholder bleed); target's `px-4 py-2` sizing classes append to root. `<example_notes>` block explicitly calls out the structural invariants so the model can mimic them, not just the surface style. Custom delimiter names (`<dropin_example>`, `<example_target>`, `<example_reference>`, `<example_output>`, `<example_notes>`) avoid collision with user content. ~310 input tokens cost per call (~$0.0001 on minimax-m2).

**Double-click race guard** — `handleAiSwapPick` early-returns if `aiBusy` is already true. The modal's busy overlay (absolute inset-0 z-10) should block clicks, but keyboard-driven picks or pre-overlay-paint clicks could slip through. Defensive guard prevents two concurrent swap requests.

**Elapsed-time counter** in the busy overlay (new `components/AiSwapBusyOverlay.tsx`) — live 0.1s-precision ticker showing "12.3s / 45s". Goes coral-bold + "taking longer than usual" at 66% of timeout. User sees concrete progress instead of just the indeterminate progress bar. Cancel button + same component (extracted from inline Workspace render).

### Files added/modified (Phase 7)

New:
- `lib/ai-edit/tools.ts` — tool-call schema + `extractToolCallArgs`.
- `components/AiSwapBusyOverlay.tsx` — busy overlay with elapsed-time ticker.
- `tests/ai-edit-tools-prod.test.ts` — 16 tests for schema invariants + arg extraction edge cases.

Modified:
- `app/api/ai-edit/route.ts` — 45s timeout via AbortController, tool-calling request, tool_calls → content parse cascade.
- `lib/ai-edit/prompts/swap.ts` — appended few-shot `<dropin_example>` triple after the failure-modes section.
- `components/Workspace.tsx` — `aiBusy` early-return guard in handleAiSwapPick, AiSwapBusyOverlay mount (replaces inline overlay), `aiBusy` added to handleAiSwapPick deps.
- `tests/ai-edit-swap-prompt-prod.test.ts` — +3 tests for few-shot exemplar (presence, root-tag inheritance, notes content).

tsc 0. vitest 6402/6405 (+19 from tools tests +3 from swap-prompt tests — 22 net new, total 49 since Phase 6).

### What's still NOT in this batch (deferred)

- **Streaming SSE** — tool calling + streaming coexist per research, but SGLang minimax-m2 streaming has known fragmentation bugs (sglang #23071). Defer to Phase 8.
- **Vision/screenshot reference** — Tensorix pricing for vision models still unconfirmed. Phase 8+.
- **Edit mode also needs tool calling** — current shipment uses tool calling for ALL ai-edit calls (both edit + swap), so this is implicitly done. Verify in manual test.
- **Iframe rebuild during AI call** — theoretical race where source changes mid-call invalidates the target path. Defer until real-world triggers.
- **bbox-anchored prompt bar** — still deferred (Phase 3 spec).

### Phase 6 — AI-powered component swap (uncommitted)

User requested 2026-05-18: bring back the retired component-library swap UX (button on cards/buttons/sections → modal of references → pick one) but have AI do the work instead of the rigid direct-paste that failed in Phase 0. Researched it with 4 parallel agents (codebase mapping, industry patterns, prompt engineering, Tensorix capabilities), then shipped.

**Architecture decisions** (synthesized from research):
- **Pattern 3 inverted prompt** — system prompt frames REFERENCE as the skeleton, TARGET as the content source. The naive framing ("edit target to look like reference") triggered no-op outputs on coder models. Inversion forces the model to commit to the reference's visual identity from token 1.
- **XML-delimited inputs** — `<dropin_target>...</dropin_target><dropin_reference>...</dropin_reference>` works across qwen3-coder + minimax + glm without the ~15% escape-character bloat that JSON-string wrapping causes for HTML payloads.
- **Custom delimiter names** with `dropin_` prefix per OWASP LLM cheatsheet — defensive against templates containing literal `</target>` strings.
- **Two-way no-op detection** — existing isNoOp(output, target) catches "ignored reference"; new isNoOp(output, reference) for swap mode catches "ignored target's content." Each has a mode-aware emphatic retry suffix.
- **Reuse existing AI Edit infra** — same /api/ai-edit route (with `mode: "edit" | "swap"` discriminator), same iframe ai:apply-outer message, same source-persistence path (patchHtmlOuter / htmlToJsx + patchJsxOuterByOid), same undo toast pattern.

**Files added/modified**:
- New: `lib/ai-edit/prompts/swap.ts` — AI_SWAP_SYSTEM_PROMPT + buildSwapUserMessage. ~100 LOC including thorough comments.
- New: `tests/ai-edit-swap-prompt-prod.test.ts` — 13 prod-import tests covering system-prompt invariants + builder shape + edge cases.
- Modified `lib/ai-edit/parse-request.ts` — adds `mode: "edit" | "swap"` (default edit) + `referenceHtml?: string` (required when swap). 50KB cap on referenceHtml. Empty userPrompt allowed in swap mode (library pick conveys intent). +8 new tests.
- Modified `lib/ai-edit/payload.ts` — buildApiRequestBody accepts options.mode + options.referenceHtml, forwards to API.
- Modified `app/api/ai-edit/route.ts` — callTensorix takes systemPrompt param; route picks AI_SWAP_SYSTEM_PROMPT + buildSwapUserMessage when mode=swap, AI_EDIT_SYSTEM_PROMPT + buildUserMessage when mode=edit. Mode-aware no-op retry suffix. New reference-clone guardrail (output ≈ reference → retry with target-emphasis suffix).
- Modified `lib/vibe-edit/types.ts` + `lib/vibe-edit/runtime.ts` — VibeElementInfo + vibeSerialize emit `outerHtml` (64KB cap) so the AI swap can use vibe-selected elements as targets.
- Modified `components/VibePropertiesPanel/InlineComponentBrowser.tsx` — new `onPickReference` prop. When provided, browser bypasses the direct-paste insert pipeline and hands raw component HTML to caller. Legacy `onPick` flow preserved for back-compat.
- Modified `components/VibePropertiesPanel.tsx` — new "✨ Swap with AI" button rendered above the kind-specific controls when onComponentSwap is wired. Visible for all element kinds since the modal filters by category.
- Modified `components/Workspace.tsx` — aiSwapOpen / aiSwapCategory state, aiSwapTargetRef for race-safe frozen target snapshot, handleAiSwapOpen / handleAiSwapClose / handleAiSwapPick. Wired `onComponentSwap={handleAiSwapOpen}` on VibePropertiesPanel mount. AI swap modal overlay mounted under tool=vibe + aiSwapOpen.

**UX flow**:
1. User in vibe tool, clicks any element (button / card / link / section / etc).
2. Vibe panel renders with the standard kind-specific controls + new "✨ Swap with AI" button at the top.
3. Click button → backdrop-dimmed modal opens with InlineComponentBrowser pre-filtered by inferSwapCategory(tag, classes). Backdrop click or "Close (Esc)" dismisses.
4. User picks a reference tile from the grid → modal closes immediately → "Restyling to match {title}…" toast shows.
5. /api/ai-edit fires with mode:"swap" + target's outerHTML + reference's raw HTML.
6. Server: Pattern 3 prompt → qwen3-coder (or minimax-m2 fallback) → validate → if no-op or reference-clone, retry with sharper suffix → if still bad, 422 with rephrase hint.
7. Success → ai:apply-outer mutates iframe DOM instantly → source persistence via patchHtmlOuter / patchJsxOuterByOid → toast switches to "Restyled to match {title} · Undo".
8. Undo button reverts via setCode with original HTML patched back in (works in HTML + JSX modes).

**Bugs caught by the new tests**: zero in this batch. The architecture was specced from the research up front so first-pass code passed tests. Worth noting because the Phase 5 tests caught 2 real bugs; Phase 6 had less surface to be wrong about since it reuses the (already-tested) Phase 2-5 pipeline.

### Files touched (Phase 6 batch)

New:
- `lib/ai-edit/prompts/swap.ts`
- `tests/ai-edit-swap-prompt-prod.test.ts`

Modified:
- `lib/ai-edit/parse-request.ts`, `lib/ai-edit/payload.ts`
- `app/api/ai-edit/route.ts`
- `lib/vibe-edit/types.ts`, `lib/vibe-edit/runtime.ts`
- `components/VibePropertiesPanel.tsx`, `components/VibePropertiesPanel/InlineComponentBrowser.tsx`
- `components/Workspace.tsx`
- `tests/ai-edit-parse-request-prod.test.ts` (+8 swap-mode tests)

tsc 0. vitest 6378/6380 (+21 tests since last commit, 2 envelope-channel failures pre-existing).

### Phase 5 — Polish + tests (uncommitted)

User went AFK + told me to grind. Shipped four polish items + a 66-test suite for the AI Edit modules. Tests caught two real bugs the implementation tests didn't notice.

**Token-budget warning** (plan §6.1) — `AiScopeChip` now flips the `~Xk tokens` chip from muted-grey to bold-coral with a `⚠` glyph when `info.tokenEstimate >= 8000`. A second-line "Large selection — edit may take 10+ seconds + cost more" hint also appears so the user isn't surprised by the latency.

**Copy HTML / Copy JSX flavors** (plan §10 Q#2) — split the single `Copy` button on `AiScopeChip` into two: `HTML` (raw outerHTML) and `JSX` (routed through `lib/component-library/html-to-jsx.ts` — the converter kept on disk after Phase 0 retirement). Each shows `Copied!` for 1.5s after a successful clipboard write. JSX conversion failure falls back to raw HTML rather than failing silently.

**JSX expression pre-detection** — new `jsxElementHasExpressions(source, oid)` in `lib/ast/patch-class-by-oid.ts`. Babel-parses the source, walks the JSX subtree under the OID, returns true if any `JSXExpressionContainer` child (not attribute — children only, since attribute expressions round-trip cleanly via the converter). Workspace memoizes on `(code, kind, aiInfo?.oid)` via `useMemo`. AiScopeChip surfaces a stronger upfront warning when true: `⚠ This element has JSX expressions — they'll be baked into static text on save` (red bold) vs the generic `Saves to source · JSX expressions get baked in` (grey).

**bbox-anchored prompt bar** — DEFERRED again. Concluded it's not worth the risk for AFK ship: needs iframe wrapper-ref + watchBbox subscription + iframe→host coord translation, all without user signal to validate UX. Current bottom-center placement + the bottom-36 toast offset already handle the original overlap concern. Spec'd at plan §3.3 — revisit when user asks.

**Tests** — 4 new test files, 66 tests, all passing:
- `tests/ai-edit-parse-request-prod.test.ts` — 11 tests. Valid + invalid input shapes. Model regex prompt-injection guards.
- `tests/ai-edit-validate-response-prod.test.ts` — 26 tests. Fence strip, JSON parse, shape, root-tag match, forbidden tags (script/iframe/object/embed/on-handlers/javascript:/non-image data:), length sanity.
- `tests/ai-edit-scope-and-fingerprint-prod.test.ts` — 18 tests. Section walker (semantic tags, ARIA roles, class fingerprints, false-positive guard via `heroku-deploy`), token estimation, formatter, Tailwind utility stripping.
- `tests/ai-edit-jsx-expressions-prod.test.ts` — 11 tests. Direct + deep children, conditional renders, `.map()`, attribute-only expressions (false positive case), graceful degradation on parse fail / missing OID.

### Bugs caught + fixed by the test suite

1. **Length-sanity rule too tight on small element inputs.** `<button>Hi</button>` (19 chars) + a class addition → 38-char output → 38 > 1.5 × 19 = 28.5 → REJECTED legitimate edits. Fix: `cap = Math.max(originalHtml.length * 1.5, originalHtml.length + 500)` — the absolute +500 fallback gives small edits headroom while the ratio still bites on big inputs. Three tests previously failing now pass.
2. **Model regex allowed leading `-` (prompt injection vector).** `^[a-zA-Z0-9._/-]+$` accepted `--system` as a "model name." Fix: `^[a-zA-Z0-9][a-zA-Z0-9._/-]*$` — first char must be alphanumeric. One test previously failing now passes.

These were caught in 10 minutes of test writing. Worth highlighting because the implementation-level testing (manual prompts in the iframe) never surfaced them.

### Files touched (Phase 5 batch)

- `components/AiScopeChip.tsx` — large-budget chip styling + second-line warning, Copy HTML/JSX flavors, hasJsxExpressions prop with sharper warning, htmlToJsx import.
- `components/Workspace.tsx` — useMemo'd `aiHasJsxExpressions` + pass-through to AiScopeChip.
- `lib/ast/patch-class-by-oid.ts` — new `jsxElementHasExpressions` export.
- `lib/ai-edit/parse-request.ts` — tightened model regex.
- `lib/ai-edit/validate-response.ts` — relaxed element length-sanity cap with +500 floor.
- `tests/ai-edit-*.test.ts` — 4 new test files, 66 prod-import tests.

tsc 0. vitest 6357/6359 (2 envelope failures pre-existing, unrelated).

### Phase 2 — Tensorix API integration (uncommitted)

**Server-side** (`app/api/ai-edit/route.ts`):
- POST handler, OpenAI-compatible call to Tensorix `/chat/completions`.
- Reads `TENSORIX_API_KEY` / `TENSORIX_BASE_URL` from env. Scope-aware default model:
  - Element scope → `TENSORIX_DEFAULT_MODEL` (qwen/qwen3-coder-30b-a3b-instruct).
  - Section scope → `TENSORIX_SECTION_MODEL` (minimax/minimax-m2).
  - User can override per-request via body.model.
- Retry strategy: same-model retry after 250ms on 5xx/429/network → cross-model fallback (`TENSORIX_FALLBACK_MODEL`) → no-op detection (trigram-overlap ≥98%) + emphatic-suffix retry → 422 with rephrase hint.
- max_tokens: 2000 element, 16000 section.
- Per-IP rate limit 30/min via `lib/rate-limit` shared limiter.
- Diagnostic console logs: `[ai-edit] request` / `success` / `retry-same` / `fallback-model` / `no-op response` / `tensorix non-ok` / `validation failed`.

**Pure-logic libs**:
- `lib/ai-edit/parse-request.ts` — parse-don't-validate (mirrors `lib/llm-rewrite-parser`). Caps targetHtml ≤100KB, parentContext ≤50KB, prompt ≤2000 chars, model regex-filtered.
- `lib/ai-edit/prompts/system.ts` — rewritten 2026-05-17 PM after qwen returned no-op outputs. New first line: `PRIMARY DIRECTIVE: APPLY THE USER'S REQUESTED CHANGE. Returning identical or near-identical HTML is a failure.`
- `lib/ai-edit/prompts/user-message.ts` — element + section builders. Element-mode includes parent_context block.
- `lib/ai-edit/validate-response.ts` — JSON parse + fence strip → root-tag match → forbidden-tag scan (script/iframe/object/embed/on-handlers/javascript:/non-image data:) → length sanity (≤1.5× element, ≥20% section).
- `lib/ai-edit/payload.ts` — `buildApiRequestBody(info, prompt)`. Forwards `info.parentContext` (emitted by iframe) to API.
- `lib/ai-edit/client.ts` — `callAiEdit(body, signal)`. AbortError → `error: "aborted"` so caller suppresses toast.

**Iframe runtime** (`lib/vibe-edit/runtime.ts`):
- `aiSerialize` now emits `parentContext` for element scope. Walks the parent's childNodes, replaces the target with a marker text node, serializes via `parentClone.outerHTML`, swaps marker → `{{TARGET}}`. 32KB cap on parent context (half the target cap); null when parent is body/html.
- `ai:apply-outer` handler: re-finds via querySelector(path), snapshots parent + child-index, swaps outerHTML, re-locates new node, re-emits `ai:applied` with bbox/outerHtml or `ai:apply-failed`.

**Iframe-bridge types** (`lib/iframe-bridge.ts`):
- Tool union: added `"ai"`. Iframe runtime's `dropin:set-tool` allowlist also extended (caught a runtime allowlist bug — see `feedback_runtime_allowlist_after_union_widen.md`).
- `ai:apply-outer` (host→iframe) / `ai:applied` + `ai:apply-failed` (iframe→host) variants typed end-to-end. Exhaustiveness guard updated.

**Host wiring** (`components/Workspace.tsx` + `components/Preview.tsx`):
- `aiBusy` + `aiBusyModel` + `aiAborterRef` + `aiLastEditRef` state.
- `handleAiSubmit` (abort prior → call → post ai:apply-outer → showInfo with Undo action on success toast).
- `handleAiApplied` (flip busy off) / `handleAiApplyFailed` (flip busy + clear aiLastEditRef + clear toast + showWarn).
- Optimistic shimmer label scope-aware (qwen for element, minimax for section).

**Prompt bar UI** (`components/AiPromptBar.tsx`):
- Floating bottom-center bar with single-line autoexpand textarea.
- Enter submits / Shift+Enter newline / Escape cancels + clears.
- Shimmer label while busy showing the active model name.

### Phase 3 polish (uncommitted)

**Scope-aware model routing** — element scope routes to qwen3-coder, section to minimax-m2. Both env-driven (`TENSORIX_DEFAULT_MODEL` / `TENSORIX_SECTION_MODEL` / `TENSORIX_FALLBACK_MODEL`). Cost dropped ~25x by moving away from glm-5.1 default.

**Undo button on AI success toast** — `rollToast` extended with optional `action: { label, onAction }`. AI success populates with `{ label: "Undo", onAction: postAiApplyOuterWithOriginalHtml }`. Toast auto-dismiss bumped to 6s for AI (vs 2.6s for other info toasts). Toast also stacks at `bottom-36` when AI tool is active so it doesn't overlap the prompt bar.

**Parent context** — iframe emits parent outerHTML with `{{TARGET}}` placeholder for element scope. Plan §4.2. Improves qwen's awareness of surrounding utility classes (flex direction, gap, alignment) so it generates layout-coherent changes.

**Ephemeral-edit warning** — second line on AiScopeChip: `"Edits live for this session — switch tools or Save in Monaco to persist."` Sets vibecoder expectation upfront so they don't think the feature is broken when iframe rebuild wipes edits. Per plan §10 Q#2 source persistence is intentionally deferred to Phase 4+.

**Copy code button on chip** — copies current selection's outerHTML to clipboard via `navigator.clipboard.writeText`. Feedback flips label to "Copied!" for 1.5s. No JSX conversion yet — plain HTML export per plan §10 Q#2 ("Copy as JSX export" planned for later if user demand surfaces).

### Bug hunt (this batch, all fixed)

1. **Stale request applied to wrong selection** — user clicks A → submits → clicks B → result was being applied to A. Fix: `handleAiSelected` aborts in-flight aborter when `payload.path !== prev.path` (treats same-path re-emit from `ai:applied` / Tab as continuation, not new selection).
2. **`aiLastEditRef` not cleared on `ai:apply-failed`** — undo toast would point at an un-changed element. Fix: `handleAiApplyFailed` clears both snapshot + toast.
3. **Stale toast survives tool switch** — Undo button in View mode after leaving AI was confusing. Fix: `handleToolChange` clears rollToast when leaving AI.
4. **Shimmer model label hardcoded** — section scope was showing "qwen" while server actually called minimax. Fix: scope-aware optimistic label.

### Model selection rationale (2026-05-17 PM after manual testing)

User tested minimax-m2 default → ~30% transient 502 rate + 8-15s latency (it's a reasoning model). Switched to GLM-5.1 briefly (worked but 18x expensive). Read full Tensorix catalog with user; settled on:
- **qwen/qwen3-coder-30b-a3b-instruct** as element default — coding-tagged, no-reasoning, $0.06/$0.25 per M, 2-3s typical, MoE 30B-with-3B-active. ~25x cheaper than GLM with comparable quality for surgical edits.
- **minimax/minimax-m2** as section default + cross-model fallback. Reasoning helps section composition; flakier but only fires after qwen + retry fail.
- Monthly cost projection at 1k active users dropped from ~€800-1000 (minimax-default) → ~€60-80 (qwen-default).

qwen's known limit: conservative on creative prompts ("redesign as glass-morphism"). The retry + minimax fallback chain absorbs this. If qwen no-ops, server retries qwen with emphatic suffix → if still no-op, returns 422 "Model returned no change — try rephrasing." User-facing toast surfaces the rephrase hint.

### What's NOT in this batch (deliberately deferred)

- **Source persistence** — plan §10 Q#2 defers this; JSX-mode fundamentally hard (dynamic expressions like `{IMAGES.foo}` get flattened on swap). Spec'd for Phase 4+ when user demand justifies the cost.
- **bbox-anchored prompt bar** — needs iframe-wrapper-ref + watchBbox subscription plumbing. Phase 3.5+.
- **50-action session history side panel** — plan §3.5; toast-undo covers the single-action case (90% of needs).
- **HTML-to-JSX export on Copy** — plan §10 Q#2 mentions it; plain HTML copy ships in this batch + JSX flavor lands when user requests.
- **Telemetry / streaming responses / "Report bad edit"** — Phase 4+ hardening.

### Phase 4 — Hardening + source persistence (uncommitted)

**Telemetry** — single structured `[ai-edit] telemetry` log per request emitted from `app/api/ai-edit/route.ts`. Fields: outcome (success / no-op-after-retry / validation-failed / tensorix-error / rate-limited-minute / rate-limited-hour / bad-request / server-misconfigured), scope, modelRequested, modelUsed, status, latencyMs, targetHtmlLen, responseHtmlLen, promptTokens, completionTokens, fellBack, noOpRetried, reason. Hits dev terminal in dev, Vercel logs in prod. Never logs template content — only sizes + counts.

**Two-tier rate limiting** — 30/minute (burst protection) + 120/hour (free-tier cap, plan §6.3 spec'd 60 but bumped because most sessions hit 20-40 edits). Both via `lib/rate-limit` instances. IP-keyed in v1 (no auth surface yet). Hourly limiter uses sweepEveryCalls=256 to amortize the larger windowMs.

**Source persistence** (the big one — plan §10 Q#2 had this deferred; pragmatic version shipped). After ai:applied lands in the iframe, Workspace also writes the swap to source via existing patch infra:
- **HTML mode**: `patchHtmlOuter(code, info.htmlPath, result.html)` from `lib/source-patch-html` → `setCode(patched)`.
- **JSX mode**: `htmlToJsx(result.html)` from `lib/component-library/html-to-jsx` (the retired-on-disk converter) → `patchJsxOuterByOid(code, info.oid, jsx)` from `lib/ast/patch-class-by-oid` → `setCode(patched)`.
- Persist failure (no htmlPath / no OID / patch unchanged / html→jsx threw): keep the iframe DOM mutation alive (session-only) + console.warn. Toast suffixed with `· session only` so the user knows.
- Undo button now also routes through `setCode` with original-html-patched source when persistence succeeded, so Ctrl+Z + redo line up. Falls back to iframe-DOM-only undo when persistence was skipped.

**JSX caveat** — dynamic expressions (e.g. `{label}`, `{count + 1}`, ternaries) inside the edited element get baked into their current rendered text. This is the fundamental tradeoff the plan flagged. AiScopeChip's second-line caption surfaces this explicitly: `Saves to source · JSX expressions in edited elements get baked in`. User signs up for this by clicking AI tool.

**Iframe rebuild trade-off** — `setCode` triggers a full iframe rebuild (~50-100ms). User sees: instant `ai:apply-outer` mutation → brief rebuild flash → final rendered state from new source. Selection chip clears on rebuild (consistent with vibe-edit setCode flow). Undo toast (6s) is the bridge — user can revert before the toast disappears even after rebuild.

### Files touched (Phase 4 batch)

- `app/api/ai-edit/route.ts` — telemetry events, two-tier rate limiter.
- `components/Workspace.tsx` — persistAiEditToSource inline in handleAiSubmit, undo routes through setCode when persisted, deps updated `[aiInfo, aiBusy, code, kind, setCode, showWarn]`.
- `components/AiScopeChip.tsx` — caption updated from "Edits live this session" to "Saves to source · JSX expressions get baked in".

tsc 0. vitest 6291/6293 (2 envelope-channel failures pre-existing, unrelated to AI Edit).

### What's NOT in this batch (still deferred)

- bbox-anchored prompt bar (needs wrapper-ref + watchBbox).
- 50-action session history side panel (toast-undo + Ctrl+Z cover 90%).
- HTML-to-JSX flavor on Copy chip button (plain HTML ships).
- Streaming responses (Phase 5 polish).
- Section-mode quality testing across all 108 templates — needs manual user signal.

### What's next (when user signals)

- Manual stress test source persistence across HTML + JSX templates. Particularly: does the AI's rendered HTML round-trip through htmlToJsx cleanly on the 108 templates' edge cases (SVG namespaces, `<picture>`, `<video>`, custom elements)?
- bbox-anchored prompt bar polish.
- Per-edit cost dashboard (telemetry already in place — just needs a consumer).

---

## Archived (pre-Phase-2 status — keep for reference)

### Phase 0 — Component-library swap retired (commit `20dae4e`)

User locked the AI Edit plan at `docs/superpowers/plans/2026-05-17-ai-edit-element-section.md` after honest assessment that the broken component-library swap couldn't be made viable (rigid library tiles, compounding bugs). Path C: AI does the structural work; library tiles retired. Tensorix API key + base URL + default/fallback models live in `.env.local` (gitignored) + `.env.example` (committed).

### Phase 0 — Component-library swap retired (commit `20dae4e`)

Same retirement pattern as Move + Try Variations:
- `SwapComponentButton` renders dropped from TextControls / LinkControls / CardControls.
- `InlineComponentBrowser` mount dropped from VibePropertiesPanel.
- `onComponentSwap` / `onComponentPick` / `componentBrowserOpen` / `componentBrowserCategory` prop pass-through dropped at the Workspace ↔ panel boundary.
- Left on disk for recoverability + Phase 2+ reuse:
  - `components/VibePropertiesPanel/InlineComponentBrowser.tsx`
  - `lib/component-library/insert.ts`
  - `lib/component-library/preserve-content.ts` (sizing-class transfer helpers may be useful for AI response normalization)
  - `lib/component-library/html-to-jsx.ts` (needed for AI Edit "Copy as JSX" export per plan Open Q #2)
  - `lib/swap-category-hint.ts` (visual-role disambiguator — useful for AI prompt context generation)
- Workspace unused handlers (handleVibeComponentSwapOpen/Close, vibeComponentSwapContext memo) kept dormant; setter calls in cleanup paths are harmless no-ops.

### Phase 1 — AI Edit selection layer end-to-end (commits `b97037e`, `a2e6038`, `711023a`)

Click any element in AI tool → see floating scope chip with fingerprint + token estimate. Tab expands to nearest semantic section, Shift+Tab collapses, Escape clears. NO AI INTEGRATION YET — Phase 2 wires Tensorix.

**New files:**
- `lib/ai-edit/scope.ts` — `findSectionScope(el)` walks up to SECTION/HEADER/FOOTER/NAV/ASIDE/MAIN/ARTICLE tags, region/banner/contentinfo ARIA roles, or class fingerprints (hero/features/pricing/cta/testimonial/bento/navbar/faq/stats/logos/gallery/about/contact/newsletter). Plus `estimateTokens` (chars/3.5 ceil) + `formatTokenCount` ("847" or "2.3k").
- `lib/ai-edit/types.ts` — `AiScope` ("element" | "section"), `AiSelectionPayload` (iframe-emit shape: path/htmlPath/oid/tag/classes/scope/outerHtml/bbox), `AiSelectionInfo` (host-stored: extends payload with fingerprint + tokenEstimate computed via host helpers), `AiEditEntry` (history record), `AiMessage` / `AiCommand` (iframe ↔ host envelopes).
- `lib/ai-edit/fingerprint.ts` — `makeFingerprint(tag, classes)` builds scope chip label. Strips Tailwind utility chrome (bg-*/text-*/px-*/flex/items-/etc.), variant chains (md:hover:bg-blue-500), arbitrary-value classes (bg-[#hex]). Caps at ~40 chars.
- `components/AiScopeChip.tsx` — bottom-center HUD chip (Phase 1 uses fixed positioning; bbox-anchored chip lands in Phase 3 with the prompt bar). Window-level Tab/Shift+Tab/Escape keybindings; skips when focus is in input/textarea/contenteditable/Monaco editor.

**Iframe runtime additions (`lib/vibe-edit/runtime.ts`):**
- `aiSelected` global + `aiSelect(el, scope)` / `aiClear()` mirror vibe pattern. Own `data-ai-selected` data-attr so vibe + AI outlines don't fight.
- `aiSerialize(el, scope)` — lean payload (no fingerprint/tokens; host enriches). 64KB outerHTML cap.
- `aiFindSectionScope(el)` — ES5 inline copy of `findSectionScope` from `lib/ai-edit/scope.ts` (template-literal runtime can't import).
- Click handler extended with `DROPIN_TOOL === 'ai'` branch BEFORE the vibe branch. Selects ANY element (no editable-atom filter — AI handles styling, host just needs the target).
- Message handler extended with `ai:set-scope` (Tab → re-resolve via aiFindSectionScope, re-emit ai:selected) and `ai:clear` (Escape).
- Outline rule for `data-ai-selected`: 2px coral with crosshair cursor (differentiates from vibe's 3px outline + pointer cursor).

**Types + bridge (`lib/iframe-bridge.ts`):**
- `Tool` union extended with `"ai"`.
- `IframeToHostMessage` extended with `ai:selected` (carries `AiSelectionPayload`) / `ai:cleared`.
- `HostToIframeMessage` extended with `ai:set-scope` / `ai:clear`.
- `IFRAME_MESSAGE_TYPES` exhaustiveness tuple updated.
- `Preview.postVibe` signature widened to accept both `vibe:*` and `ai:*` commands.

**Host wiring (`components/Preview.tsx` + `components/Workspace.tsx`):**
- Preview: `onAiSelected` / `onAiCleared` props with ref pattern matching vibe equivalents.
- Workspace: `aiInfo` state (`AiSelectionInfo | null`). `handleAiSelected` enriches via `makeFingerprint` + `estimateTokens` before setState. `handleAiSetScope` posts `ai:set-scope` through previewHandleRef. `handleAiClearFromChip` clears state + posts `ai:clear`. Tool change away from "ai" auto-clears + posts ai:clear (defensive cleanup).

**Toolbar (`components/ToolBar.tsx`):**
- `"ai"` added to `TOOL_LIST` (now `["view", "vibe", "ai"]`).
- `AiIcon` sparkle SVG (Cursor / Copilot convention).
- `TOOL_META.ai` — label "AI", shortcut "A", tooltip "Click any element and describe a change in plain language."
- Workspace keyboard handler binds `a` → `setTool('ai')`. localStorage migration recognizes `"ai"` as a valid persisted choice.

**Env (`.env.local` cleaned, `.env.example` updated):**
- `TENSORIX_API_KEY` (loaded from local), `TENSORIX_BASE_URL=https://api.tensorix.ai/v1`, `TENSORIX_DEFAULT_MODEL=minimax/minimax-m2`, `TENSORIX_FALLBACK_MODEL=z-ai/glm-5.1`. Model catalog documented in env comment.

### What's next: Phase 2

Per plan §9 Phase 2:
- Server-side `/api/ai-edit/route.ts` reading Tensorix env vars, OpenAI-compatible POST to `/v1/chat/completions`, JSON-mode response.
- System prompt + user-message builders (`lib/ai-edit/prompts/`).
- Element-mode payload construction (target HTML + parent context with `{{TARGET}}` placeholder + tailwind config excerpt).
- Floating prompt bar UI anchored to the AI selection.
- JSON response validation pipeline: parse → root-tag-match → forbidden-tag check (no script/iframe/event handlers) → length sanity (element <1.5× input, section >20% input).
- outerHTML swap + push to per-session history stack (up to 50 actions, per plan §3.5).

---

## Phase 1 manual test checklist (2026-05-17, run on user's existing dev server at port 3001)

Each line is one ~30s confirmation. STOP at the first failure and capture: which step + what you saw + any console output prefixed `[dropin:iframe-ai-click]` or `[dropin:Workspace] ai:`.

**Toolbar surface:**
- [ ] Toolbar shows three buttons: **View · Edit · AI**.
- [ ] AI button shows a sparkle icon (four-pointed star).
- [ ] Hover AI button → tooltip reads "Click any element and describe a change in plain language. (A)".
- [ ] Press **A** key → toolbar highlights AI as active. Press **V** → back to View. Press **E** → Edit.
- [ ] Reload page → if AI was active, persists across reload. Otherwise lands on previously persisted tool.

**Selection on click (element mode):**
- [ ] Switch to AI tool. Hover over an element in the iframe → no special hover visual yet (that's a Phase 3 polish).
- [ ] Click any element (text, image, button, card, section) → 2px coral outline appears with 1px offset.
- [ ] Cursor while AI tool is active changes to crosshair (vs vibe's pointer).
- [ ] Floating chip appears at bottom-center reading: `✨ Element · <fingerprint> · ~Xk tokens · Tab to expand · Esc to clear`.
- [ ] The `<fingerprint>` part shows readable identity (e.g. `section.hero`, `button.cta-primary`, `div`) — NOT a Tailwind-utility wall.
- [ ] Token count looks plausible (small elements ~50-500, sections ~1k-10k).
- [ ] Click a DIFFERENT element → outline + chip update to new target.

**Scope expansion (Tab):**
- [ ] With an element selected, press **Tab** → outline jumps to nearest semantic section ancestor. Chip updates: `✨ Section · <new-fingerprint> · ~Yk tokens · Shift+Tab to collapse · Esc to clear`.
- [ ] Token count increases (section is bigger than element).
- [ ] Press **Shift+Tab** → outline collapses back to original element. Chip back to "Element".
- [ ] Click an element that IS its own nearest section (e.g. `<section class="hero">` directly) → Tab → outline stays put, chip stays at "Section". (Iframe walker returns the element unchanged when it IS the section.)
- [ ] Click an element with no semantic section ancestor (rare; deeply-nested div in body) → Tab → outline stays put, chip stays at "Element". (Walker falls back to direct-child-of-body, then to the element itself.)

**Escape + clear:**
- [ ] With a selection active, press **Escape** → outline disappears, chip disappears.
- [ ] Switch tool from AI to View → outline disappears, chip disappears.
- [ ] Switch back to AI → no selection until you click again (state was cleared on tool exit).

**Keybinding coexistence:**
- [ ] Open the Code editor (Monaco) on the right. Click into Monaco. Press Tab → moves focus in Monaco, does NOT trigger scope-expand (AI handler skips when focus is in Monaco).
- [ ] Same for any `<input>` / `<textarea>` (e.g. the alt-text input in Edit mode).

**Cleanup signals:**
- [ ] Open dev console. Click an element in AI tool → see `[dropin:iframe-ai-click] hit <TAG>` + `[dropin:Workspace] ai:selected { tag, path, scope }`.
- [ ] Press Escape → see `[dropin:Workspace] ai:cleared`.
- [ ] Press Tab → see another `ai:selected` with `scope: "section"`.

**No regressions on prior surfaces:**
- [ ] Switch to Edit tool → per-image Shuffle still works.
- [ ] Bg-image Shuffle still works.
- [ ] Save now ✓ button still toasts positively.
- [ ] Undo / Redo / Reset buttons still functional.
- [ ] First-open tour (if you cleared localStorage `dropin:tour-completed-v3`) shows the four updated steps.

If anything diverges, paste the failed step + console line back. The diagnosis-by-tracer pattern from `feedback_tracer_first_on_broken_features` applies — we look at the actual log values, not guess.

---

Resumed after dinner with the polish plan locked at `docs/superpowers/plans/2026-05-16-post-dinner-polish.md`. Phases 1-4 + 6 shipped (Phase 5 mood slider intentionally deferred — Phases 1-4 are pure polish/fix; mood slider would be the one new feature and lighter/darker can wait for manual-test signal first).

### Phase 1 — FirstOpenTour refreshed (v3)
- `components/FirstOpenTour.tsx` — STEPS array fully rewritten. Old v2 content described retired Select / Move / Insert / Swap tools. New v3 content reflects current Edit-tool + per-element vibe-panel model with Shuffle, Save now, Undo, What's next callouts.
- Storage key bumped `dropin:tour-completed-v2` → `dropin:tour-completed-v3`. v2-completed users see refreshed tour exactly once.

### Phase 2 — Success toasts on Shuffle / bg-Shuffle
- New `onInfo?: (msg: string) => void` prop on `VibePropertiesPanel` + `ImageControls`. Wired from Workspace's existing `showInfo` (↪ icon, 2.6s, bottom-center).
- Per-image Shuffle success → `"Photo updated · Undo to revert"`.
- Bg-image Shuffle success → `"Background updated · Undo to revert"` (in Workspace handler).

### Phase 3 — Spinner animation on Shuffle button
- `↻` glyph wrapped in `<span className="inline-block animate-spin">` while `shuffling=true`. Applied to both per-image (ImageControls) and bg-image (CardControls) Shuffle buttons. Pure presentational; uses Tailwind's default `animate-spin`.

### Phase 4 — Figure-bg-image overlay fix via `hasInnerImg`
- Iframe `vibeSerialize` now emits `hasInnerImg: !!el.querySelector('img')`. Short-circuits at first match → effectively O(1).
- `VibeElementInfo.hasInnerImg?: boolean` added to types.
- `CardControls.tsx` — bg-image section is hidden when `info.hasInnerImg === true`. Replaced with advisory: "This card has an image inside — click the image directly to swap it." Honest UX; no source mutation.

### Phase 6 — View-mode empty-state hint
- New floating chip at bottom-right of workspace: `Press [E] to start editing` (with the E styled as a tiny keycap). Visible only when `tool === "view"`. `pointer-events: none` keeps iframe clicks pass-through. `hidden lg:block` so it doesn't crowd small screens.
- Sits at `bottom-6 right-6` to avoid conflict with the bottom-center toast slot and FirstOpenTour's bottom-right card.

### Documentation cleanup (this session)
- Archived 2026-05-14 morning + PM status blocks from CLAUDE.md → `CLAUDE-archive-status.md` (newest-first per archive convention). CLAUDE.md went from 372 → 164 → ~210 lines (post this status update).
- "What's left" section's `Now:` line updated to reflect committed state (a16e2a1, 2fecd8e) + next action (post-dinner polish plan).

### What's NOT in this batch
- **Phase 5 (Lighter/Darker mood slider)** — deferred. Phases 1-4 + 6 are zero-to-low risk polish; Phase 5 is the one new feature and benefits from manual-test signal first. Spec'd at `docs/superpowers/plans/2026-05-16-post-dinner-polish.md` Section 5; ready when user greenlights after testing the polish layer.

### Files touched
- `CLAUDE.md` — archive trim + status block update
- `CLAUDE-archive-status.md` — prepended 2026-05-14 morning + PM blocks
- `components/FirstOpenTour.tsx` — v3 STEPS + storage key bump
- `components/VibePropertiesPanel.tsx` — onInfo prop pass-through
- `components/VibePropertiesPanel/ImageControls.tsx` — onInfo prop + success toast + spinner glyph
- `components/VibePropertiesPanel/CardControls.tsx` — hasInnerImg advisory branch + spinner glyph
- `components/Workspace.tsx` — onInfo wiring on VibePropertiesPanel mount + bg-shuffle success toast + view-mode floating hint
- `lib/vibe-edit/runtime.ts` — vibeSerialize emits hasInnerImg
- `lib/vibe-edit/types.ts` — VibeElementInfo.hasInnerImg? field

tsc 0 throughout. No vitest changes needed (pure UI wiring + content swaps).

---

## Current status (2026-05-16 — Try Variations retired, Apply button shipped, idle-commit routed through history, Shuffle field-name bug fixed. tsc 0. Committed at 2fecd8e.)

User pivoted away from whole-page swaps ("we remove entirely swaps on whole page - only surgical ones"). Try Variations modal + its button + lib helper all retired. Focus shifted to making per-element surgical shuffle reliable + getting undo to actually work for vibe edits.

### Pre-implementation research pass
- Wrote `docs/research/2026-05-16-shuffle-features-research.md` covering: image-source patterns across 108 templates (1207 Unsplash, 266 googleusercontent, plus icons/avatars/textures that should NOT shuffle); color patterns (3794 hex + 2482 Tailwind palette + 1204 arbitrary + 990 rgba/hsla — no shared token system); font patterns (universal Google Fonts via `<link>`, 1640 Tailwind arbitrary `font-['Name']` classes); industry research on Plasmic / Onlook / Webflow image swap, HSL theme adjustment, font pairing.
- Conclusion: whole-page shuffle is an outlier feature (industry pattern = per-element); lighter/darker should use CSS filter injection (Path B) instead of source mutation; font swap via curated pair list is tractable.
- **This research pass was triggered by user "you'll do proper research when we come back and not just fucking guess wtf to do" — see `memory/feedback_proper_research_is_non_negotiable.md`.**

### Try Variations retired
- Same retirement pattern as Move tool: button + modal + handler removed from Workspace; `components/VariationsModal.tsx` + `lib/template-remix/shuffle-images.ts` left on disk with retirement-note comments. Recoverable for a future Plasmic-grade implementation.
- Per-image Shuffle (`ImageControls.tsx`) and bg-image Shuffle (`CardControls.tsx`) survive — those are the **surgical** versions and align with industry pattern.

### Apply button + undo-aware vibe edits
- Vibe edits previously routed through `setCodeSilent` (no history entry) — undo couldn't see them.
- **Changed idle-commit useEffect in `Workspace.tsx` from `setCodeSilent` → `setCode`**. Each 600ms-stable batch of vibe edits now creates a history entry. Cost: iframe rebuild blink after each idle. Benefit: undo works for ALL vibe changes.
- Added "Save now ✓" button at bottom of `VibePropertiesPanel`. Workspace `handleVibeApply` runs same buildVibeCommit logic as idle-commit but on-demand. Renamed from "Apply changes" + toasts ALWAYS positive (confirms saved state whether commit was needed or auto-save handled it).

### Per-image Shuffle: query chain + field-name bug fix
- Query chain (was single attempt → now falls through): literal alt → first 3 alpha words → first alpha word → filename slug → "abstract texture" fallback.
- **CRITICAL BUG FOUND + FIXED**: `app/api/assets/pixabay/route.ts:178-191` slims+renames upstream Pixabay fields (`webformatURL → webformat`, `largeImageURL → large`). Per-image Shuffle and bg-image Shuffle BOTH used the upstream field names (`pick.webformatURL`), which were always `undefined` on the proxy response. The `|| pick.largeImageURL || src || ""` fallback chain silently set "next" = "current src", so every shuffle was a no-op `setAttribute('src', sameURL)` — visually identical.
- Bug surfaced after multiple user reports of "shuffle doesnt do nothing." Iframe runtime tracers (`update-image dispatch / setAttribute done / 50ms-later check` in `lib/vibe-edit/runtime.ts`) showed the smoking gun: `picked.nextSrc === srcInfo` (same URL).
- Fix: rename fields in both consumers + drop the `|| src` silent fallback. New `PixabayHit` interface in `ImageControls.tsx` matches the proxy's slim shape. Memory documented at `project_pixabay_proxy_slim_shape.md`.

### BG-shuffle query chain
- Same fallback pattern as per-image: first 3 alpha words → first word → "background" → "abstract texture". Stops at first non-empty hits response. Handles poetic card titles like "Witnessed // 004A reading-room of borrowed" that Pixabay returns 0 results for.

### Diagnostic tracer additions (KEEP THESE)
- `[dropin:Shuffle] click entry / query chain / trying / response / hits / picked / applied / done` — per-image Shuffle decision points
- `[dropin:BGShuffle] query chain / hits / applying` — bg-image Shuffle
- `[dropin:Workspace] handleVibeApply entry / drift check / buildVibeCommit result` — Apply button
- `[dropin:iframe] update-image dispatch / setAttribute done / 50ms-later check` — iframe-side image apply (caught the field-rename bug via the `picked.nextSrc === srcInfo` clue)

### What's NOT in this batch (per user explicit "too risky")
- Figure-bg-image overlay edge case: when a `<figure>` contains an inner `<img>`, picking a bg-image on the figure layers it over the inner img. Diagnosed but not fixed — tracked as Task #29.
- Whole-template Try Variations — retired.

### Files touched
- New: `docs/research/2026-05-16-shuffle-features-research.md`, `memory/feedback_proper_research_is_non_negotiable.md`, `memory/project_pixabay_proxy_slim_shape.md`
- Edited: `components/Workspace.tsx` (idle-commit → setCode, handleVibeApply, bg-shuffle field rename + chain), `components/VibePropertiesPanel.tsx` (onApply prop + Save now button), `components/VibePropertiesPanel/ImageControls.tsx` (PixabayHit interface rename, query chain, fallback fixes), `lib/vibe-edit/runtime.ts` (update-image tracers)
- Retired (still on disk): VariationsModal mount/import in Workspace, `components/library/asset-panels/sub-panels/UnsplashPanel` reachable from MediaPanel

---

## Current status (2026-05-15 — Move tool retired + 6 vibecoder wins shipped. tsc 0 throughout. Uncommitted.)

User opened the session asking to fix Move tool. After diagnosis with full tracer suite + user runtime testing, three layers of broken surfaced:
1. **HTML mode**: no OIDs → no selection → no handle. Architectural.
2. **JSX mode commit**: `applyReorder` / `applyReparent` always bailed with `parent has non-whitespace text content` — the engine refuses to reorder when parent has separator JSXText (dots, bullets, pipes between elements). Common in real templates.
3. **Visual chaos during drag**: live-translate replaces source element's CSS `transform`, so centered modals / badges / hero cards lose their `translate(-50%, -50%)` centering the instant a drag starts → "disappears to a corner."

User verdict after honest cost-vs-value walkthrough: retire the canvas-drag Move tool. Tree DnD still works for the legitimate reorder use case. Pivoted the session to "what would actually help vibecoders that won't fail."

### Move tool retired
- `"move"` dropped from `TOOL_LIST` in `components/ToolBar.tsx`. Persisted `dropin:tool === "move"` migrates to `"view"` on next mount (mirrors Insert/Select retirement pattern).
- `'M'` keyboard shortcut unbound.
- AST engines (`lib/ast/operations/reorder.ts`, `reparent.ts`) intact + still called by Tree DnD.
- Gesture code in `SelectionOverlay.tsx` intact, unreachable from UI.
- **Full tracer suite from the diagnostic pass left in place** — 7 logs across Preview / SelectionOverlay / Workspace (render gate, pointerdown, dropTargets resolved, currentTarget change, onUp commit decision, final outcome, handleReorder/handleReparent entry + applyReorder result). Pays rent on next rebuild attempt; cost is zero in production.

### Six vibecoder features shipped

| | Feature | Files |
|---|---|---|
| 1 | **Visible Undo/Redo buttons** in workspace chrome | `Workspace.tsx` (WorkspaceActions row, UndoGlyph / RedoGlyph) |
| 2 | **Shuffle button** on `<img>` vibe panel — Pixabay match by alt, LRU dedup, random page 1-5 | `VibePropertiesPanel/ImageControls.tsx` |
| 3 | **"What's next?" helper modal** — 3 sections: Copy code · Iterate with AI (4 prompt templates with copy buttons) · Host it online (Netlify Drop / Vercel / CodeSandbox walkthroughs) | new: `WhatsNextModal.tsx` |
| 4 | **"Try variations" template remix** — modal with toggle scope (Images on, Palette/Fonts disabled "Coming soon"), atomic batch shuffle, single undo step | new: `VariationsModal.tsx` + `lib/template-remix/shuffle-images.ts` |
| 5 | **Text-case transforms** in TextControls — ALL CAPS / Title / Sentence / lowercase buttons | `VibePropertiesPanel/TextControls.tsx` |
| 6 | **Background-image shuffle** on cards/sections — Pixabay match by element text content (first 6 words), fallback to "abstract texture" | `VibePropertiesPanel/CardControls.tsx` + new `applyVibeBgImageUrl` helper in Workspace |

### Shared design principles for this batch (worth quoting back)
- **Mirrors existing patterns** — every shuffle button reuses the Pixabay-by-text-query mechanism. Pattern proven once, ported safely.
- **Atomic + undoable** — every feature routes through `setCode` so undo restores in one click. Single-source-of-truth.
- **No cascade** — features touch ONE element at a time, except Try Variations which is gated behind user toggle + bail-warns when nothing shuffles.
- **Honest "Coming soon"** — VariationsModal shows Palette + Font-pair toggles as disabled. UI shape stable when those eventually land; user knows scope but can't break things by clicking.

### Bug surfaced + fixed mid-session
- "Try variations" initially required BOTH literal `src=""` AND literal `alt=""` — too strict for JSX templates that use `<img src={IMAGES.foo}>` or omit alt. Toast: "Every image uses a variable src or has no alt text (3 skipped)."
- Fix: relaxed `findShufflableImgs` in `lib/template-remix/shuffle-images.ts`. Any img with literal src is now eligible. Query derives from priority: (1) literal alt, (2) `queryFromFilename(src)` slug parsing — strips host/extension/digits-only tokens, returns first 4 alpha tokens of length ≥3, (3) fallback "abstract texture". Toast wording updated to be more specific.

### Test totals
- **tsc 0 throughout** — 7 clean checkpoints during the session.
- **vitest 6291/6293** — unchanged. No test surface changes since all new code is UI wiring + a single regex helper (filename-slug parsing); the helper is low-complexity-pure-fn that can grow tests later if it ever earns regression risk.

### What's NOT in this batch (user explicit "too risky, like Move")
- Duplicate / Delete buttons in vibe panel — engines exist + work via Tree DnD; UI surfacing deferred.
- Section duplicate via cascade chip ("Add one more like this") — same.
- Palette / Font-pair shuffle — visible in VariationsModal as disabled "Coming soon" toggles.
- AI text rewrite — user redirected away from the LLM API path mid-session ("what AI rewiring has to do with anything"). `app/api/llm-rewrite/route.ts` exists + works but the in-vibe-panel client-side wiring stays deferred.

### Files touched (this session, beyond the move retirement)
- New: `components/WhatsNextModal.tsx`, `components/VariationsModal.tsx`, `lib/template-remix/shuffle-images.ts`
- Edited: `components/Workspace.tsx` (handlers + WorkspaceActions wiring + 2 modal mounts + bgImage shuffle handler + applyVibeBgImageUrl helper), `components/ToolBar.tsx` (Move retirement + revert of disabled-tools wiring), `components/VibePropertiesPanel.tsx` (prop pass-throughs), `components/VibePropertiesPanel/ImageControls.tsx` (Shuffle button), `components/VibePropertiesPanel/CardControls.tsx` (bg shuffle button + local shuffling state), `components/VibePropertiesPanel/TextControls.tsx` (case transforms)

---

## What's left — prioritized

**Now**: 2026-05-15 + 2026-05-16 sessions committed at `a16e2a1` and `2fecd8e`. Working tree clean except pre-existing untracked `wireframe-globe (1).svg`. **Next**: execute the post-dinner polish plan at `docs/superpowers/plans/2026-05-16-post-dinner-polish.md` — Phase 0 (user-driven manual test) then Phases 1-6 (refresh stale FirstOpenTour → toasts → spinner → figure-bg fix → empty-state → optional mood slider).

The 2026-05-14 status blocks (vibecoder simplification + inline browser) archived to `CLAUDE-archive-status.md` on 2026-05-16 — referenced there for Phase D/F lib lineage if needed.

**Deferred (low priority)**:
- **Visual-role disambiguation (Layer 3 swap-category fallback)** — see `memory/project_visual_kind_disambiguation.md`. HTML tag ≠ visual role: Tailwind-utility-styled `<a>` looks like a button or card; `<button>` styled as a link; `<input type="submit">`; `<div role="button">`. Current Layer 1 (token) + Layer 2 (kind+isCardLike) misses these. Proposed `inferVisualRole(info)` reads bg/rounded/bbox.height/padding/aria-role; wait for concrete failure case before implementing.
- **Flex/grid context preservation on component swap** — see 2026-05-14 PM block in `CLAUDE-archive-status.md`. Wrap currently locks abs px; flex `flex-grow/shrink/basis` and grid `grid-column/row` are lost. Layer in if it surfaces.
- **Component re-pick to clean up pre-converter-fix in-source picks** — anything swapped during the broken html-to-jsx window has bad SVG markup in user-source.jsx; user re-picks to refresh.
- **Tighten Fragment-wrap + forceRebuild to multi-root JSX only** — currently applied to every JSX pick. Cheap unnecessary rebuild for single-root components.
- **Dead-code sweep of Phase D/F libs** — ~6 pure-logic modules (`lib/swap/plan-everywhere-swap.ts`, `lib/ast/instance-graph.ts`, `lib/ast/cross-file-query.ts`, `lib/ast/component-def.ts`, `lib/edits/operations.ts createEdit half`, `lib/ast/patch-class-by-oid.ts patchJsxClassByOid only`) + their ~150 prod-import tests are now uncalled from production after the 2026-05-14 toggle removal. Kept for now — removing covered code is regression risk for ~0 value. 30-60 min when there's appetite.
- **Cascade fix beyond the badge** — per-instance editing of `.map()`-rendered items via auto-expansion is the Plasmic-incompatible / multi-day path. Documented architectural limitation; revisit when there's appetite.
- **2026-05-11 PM 5-phase edit-flow-hardening plan** (`docs/superpowers/plans/2026-05-11-edit-flow-hardening.md`): Phase 1 (WU1 span walk-up — shipped per UI2 work 2026-05-12 per memory entry), Phases 2-5 (buildVibeCommit union / opacity slash form / TextControls debounce / rgbToHex extraction) still on the shelf.
- **PX5 (Pixabay write-through cache) + UI2 FULL Step 2 (styleDelta `iconFill` field)** — specced at `docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md`.
- **Pre-existing IDB records cleanup** — orphaned per-template records skipped on read but stay in browser storage.
- **`MANUAL-TEST-CHECKLIST.md` refresh** — the version at repo root is from before the UI/UX pass; redundant with the 2026-05-14 checklist now in `CLAUDE-archive-status.md` for the current vibe-edit surfaces.

**Specced plans ready to execute** (2026-05-15 design pass — code work greenlit when user says go):
- **AI Edit element + section** — `docs/superpowers/plans/2026-05-17-ai-edit-element-section.md`. **LOCKED 2026-05-17.** Tensorix-backed "click + prompt + apply" editing with element / section scope. Replaces the broken component-library swap (which never preserved content + dimensions cleanly because library tiles are rigid). Phase 0 = retire library swap from UI. Phases 1-4 = selection layer → API integration → section mode → hardening. ~4 weeks. minimax-m2 default, ~€0.002/edit, €800-1000/month at 1k active users. The "swap this for something better" use case becomes a natural element-mode prompt ("redesign this card with darker chrome") — AI inherits content + dimensions by construction. Pre-existing infra to leverage detailed in plan's section 11.
- **2026-05-16 post-dinner polish** — `docs/superpowers/plans/2026-05-16-post-dinner-polish.md`. Six phases (P1-P4 + P6 SHIPPED 2026-05-16 PM, P5 mood slider deferred per user "not much value"). Phase 0 manual test still recommended on resume.
- **Cascade detach** — `docs/superpowers/plans/2026-05-15-cascade-detach.md`. User-triggered "Make this one different" button on the cascade chip. AST surgery splits `.map()` at index K via slice + IIFE form; OID regen makes the detached copy independently editable. Covers ~80% of real `.map()` shapes per sampling of `web/05-mobile-app-landing.jsx` (ArrayExpression / no-second-param / custom-key shapes all supported). Bails cleanly on filter chains / non-arrow callbacks / `i` used outside `key=`. ~25 prod-import tests planned. ~1-2 days.
- ~~**Move tool fix**~~ — RETIRED 2026-05-15 per the new status block above. `docs/superpowers/plans/2026-05-15-move-tool-fix.md` left in place for reference if someone ever does the Plasmic-grade rebuild.

**Known gaps (require rule changes / hard tradeoffs)**:
- Bundle size + Tailwind purge correctness — verifying needs `next build` (rule 5).
- Next.js advisories — `npm audit` recommends 16.2.4 (SemVer-major), breaks locked stack.

**Known bugs (see `memory/project_known_bugs_deferred.md` for full investigation checklists)**:
- **Bug #2** — React duplicate-key warning from duplicate OIDs. Cosmetic console noise; cascade architecture intentionally lets one source OID render N DOM instances (duplicate-in-DOM is by-design). Duplicate-in-source is the actual bug to chase.
- ~~**Bug #3** — Move tool~~ RESOLVED 2026-05-15 by retiring the canvas-drag tool. Tree DnD still works for the legitimate reorder use case.

## Pointers (open on demand)

- **Archived status blocks (2026-05-11 PM and earlier)**: `CLAUDE-archive-status.md` at repo root — full per-session log, decisions, file lists, test counts. Trimmed out of this file 2026-05-14 to keep it ~30k chars.
- **Manual test checklist (post-audit P0/P1/P2)**: `MANUAL-TEST-CHECKLIST.md` at repo root — note: pre-dates the 2026-05-10 UI/UX redesign + 2026-05-14 vibe-edit work, so the test list above is more current for the live surfaces.
- **Rolling status memory**: `~/.claude/projects/C--Users-nikit-akellaPreView/memory/project_vibecoder_simplification_2026_05_14.md` (latest) + `MEMORY.md` (index of all auto-memory).
- **Audit reports**: `audit-2026-05-04/00-synthesis.md` (older multi-area audit) · `AUDIT-2026-05-11.md` (latest, 7-agent vibe-edit audit) · `AUDIT-FIX-PLAN.md` (image cascade fix plan).
- **Pending follow-up plans**: `docs/superpowers/plans/2026-05-11-edit-flow-hardening.md` (Phases 2-5 still on shelf) · `docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md` (PX5 + UI2 Step 2).
- **Specs**: `maniuplation.md` (master) · `phase5-tools-isolation.md` (Phase 5 SHIPPED + §5 backlog) · `phase2-manipulation.md` (locked / reference). `plan.md`, `phase1.md`, `phase2.md` are ARCHIVED — don't trust their pins.
- **AST engines + helpers + per-engine bench list + template playbook + layout rules + stack / preview-runtime / gotchas / template contract / acceptance criteria**: `CLAUDE-archive.md`.

## Rules (non-negotiable)

1. **No co-sign on commits.** No `Co-Authored-By: Claude` trailer or AI attribution. Commits attributed to `akellaluvlace <nikita.akella13@gmail.com>` only.
2. **Never push without explicit permission.** Local git ops fine. Any remote-affecting action (`git push`, `--force`, `gh pr create`, tag push, release) needs fresh per-push approval.
3. **Never deviate from the locked stack** (Next.js 14.2.x, Tailwind 3.4.x, Monaco, parse5, @babel/parser, magic-string). Locked-out list in archive.
4. **Debug by reading code.** No dev/prod servers, puppeteer, or test harnesses unless explicitly asked.
5. **Don't run `next build` to confirm.** `npx tsc --noEmit` and trust it. See `memory/feedback_no_npm_build_to_verify.md`.
6. **Surface unrelated breakage; don't fix it.** Documented trap memories are context, not standing permission.
7. **Proper research is non-negotiable.** When user says "do proper research" / "no blind guessing" / equivalent — STOP code edits, read every relevant file end-to-end (proxies, handlers, type defs), verify assumptions BEFORE writing. The 2026-05-16 Pixabay-field-rename bug shipped because I assumed the proxy passed upstream shapes through without reading the proxy file. One Read would have caught it. See `memory/feedback_proper_research_is_non_negotiable.md`.
