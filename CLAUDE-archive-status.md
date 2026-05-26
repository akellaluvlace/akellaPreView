# CLAUDE-archive-status.md

Archived "Current status" blocks from CLAUDE.md, ordered newest-first. Trimmed periodically to keep CLAUDE.md lean (~30k chars). The live status blocks in CLAUDE.md are 2026-05-16 (post-research polish plan locked) and 2026-05-15 (Move tool retired + 6 vibecoder wins).

See also: `CLAUDE-archive.md` (AST engines / stack / template playbook) and `~/.claude/projects/C--Users-nikit-akellaPreView/memory/MEMORY.md` (auto-memory index).

---

## Prior status (2026-05-24/25 — modal UI overhaul + cascade group-swap choice + iframe handshake fix)

- **Iframe handshake "editing dead after refresh/navigation" — FIXED.** Root cause (found via lifecycle tracers): the iframe's one-shot `dropin:ready` (setTimeout(0)) raced React attaching the window listener (missed), and `onLoad` is unreliable for srcDoc → `readyRef` stuck false → `set-tool` never sent → `DROPIN_TOOL` stuck `'view'` → clicks ignored. Fix: host POLLS `dropin:request-ready` until the iframe answers; `markReadyAndReplay` re-syncs on EVERY ready/onLoad (idempotent — no de-dupe guard, which had caused a follow-on regression where a post-apply rebuild's live iframe got starved). Added `dropin:request-ready` + `dropin:request-tree`. Preview + IsolatedPreview.
- **Cascade group-swap choice.** Modal offers "All N cards" vs "Just this one" when an element renders N times via `.map()`. Pre-checks detachability (dry-run `applyDetachFromMap`); if a `.map()` can't be isolated (e.g. index `i` used outside `key=`), disables "Just this one" + forces group mode. "All N" sends the callback's JSX SOURCE (`getJsxOuterByOid`) so the restyle keeps each card's `{expr}` bindings; binding-preservation guard rejects a baked-all-literals reply. `detach-from-map` newOid fix: points at the IIFE ROOT, not the deepest descendant (was nesting the swap onto a trailing `<span>`).
- **Validation:** regex TS-detection (false-rejected "Export as PDF", "downtime: never") replaced by strict JSX-only parser (`parsesAsPlainJsx`). Anti-nesting prompt instruction.
- **Modal UI:** full-screen square, full-step-fill layout, fat coral scrollbar, squarer grid tiles, two-column step-2, bigger header copy.

---

## Prior status (2026-05-23 — BYO-AI swap evolved to DUAL-MODE (element + full-file) + design-system context + free-form prompt. 116 prod-import tests. tsc 0. vitest 6612/6614 — 2 pre-existing envelope flakes. Latest commit `bebf5ec`.)

### BYO-AI swap — 2026-05-22/23 evolution (post-ship)

After manual testing surfaced issues, the swap evolved significantly:

- **Clipboard-before-window.open** (`5c0fffd`): opening the AI tab first blurred the doc → Clipboard API silently refused the copy. Copy first, then open.
- **Reference-tile selection feedback** (`e08316b`): the pick worked but gave no visual feedback (no tile highlight) → users thought it was broken. Added coral ring + "✓ Picked" badge + scroll-to-providers.
- **Provider buttons off-screen** (`94ed18d`): the 1257-tile grid had no internal scroll → pushed steps 2+3 down. Added `overflow-y-auto max-h-[40vh]`.
- **DUAL-MODE** (`88aa440`, `de4f580`): accept BOTH element-only AND full-file responses. `detectResponseShape()` routes element → patch by OID (cascade-detach first!), full-file → setCode. Element-only is the default prompt (smaller, no truncation, surgical). detectResponseShape only inspects the response START (text like `<button>Export</button>` was misclassified).
- **Design-system context** (`8ad...`): `lib/byo-ai/design-context.ts` injects the page's color tokens/families + fonts into the element prompt so the restyle matches the site (recovers full-file coherence without the whole file).
- **Free-form prompt** (`bebf5ec`): "Describe a change" text input alongside the reference picker. composeSwapPrompt referenceHtml optional + userPrompt added.

Research validated targeted-edit-over-full-rewrite (Framer/v0/Webflow + Aider/Cursor focused-context). Remaining gaps (lower priority): iterative refinement, section/multi-element editing, screenshot reference, diff preview.

---

## Prior status (2026-05-22 — BYO-AI swap shipped + 6 hardening rounds)

Full-file in/out via user's own ChatGPT/Claude/Gemini, clipboard round-trip. Commit `1ed3604`.

### BYO-AI component swap — SHIPPED 2026-05-22

User's pivot from the failed Tensorix Phase 6: instead of Dropin paying for an AI vendor, the user sends a prompt to their OWN ChatGPT/Claude/Gemini and pastes the reply back. Zero AI cost to Dropin, frontier-model quality. Plan + 6-round hardening log: `docs/superpowers/plans/2026-05-20-byo-ai-swap.md`.

**Flow**: vibe panel → "✨ Swap with AI" → modal (pick reference → click provider → paste reply → Apply). Full-file in / full-file out — no patch pipeline, just `setCode` after validation. Clipboard-only (URL prefill dropped: full-page payloads exceed provider caps + Claude removed `?q=` Oct 2025).

**Files**: `lib/byo-ai/{providers,compose-prompt,extract-code,validate-response}.ts` + `components/ByoAiSwapModal.tsx`. Entry: VibePropertiesPanel button (gated to component kinds, not image/icon). Workspace `handleByoAiSwapOpen` + `handleByoAiApply`.

**The validation pipeline is the reliability core** — full-file swaps have many silent-breakage modes. `validate-response.ts` catches: placeholder-truncation (`// ... rest unchanged ...`, the #1 frontier failure mode), top-level decl-survival, TS-syntax (JSX Babel blanks on it), wrong-language (HTML returned in JSX mode), cascade-aware no-op (count not binary), NEW-script/iframe injection (count-based), string-valued event handlers (NOT JSX onClick — the regex MUST require a quote after `=`), js: URIs, length sanity max(1.5×, +2000). Apply does stripOids→injectOids in JSX mode. Reference picker bundles `full.css` as a `<style>` block.

**6 hardening rounds** (commits): `ada9a30` round-1, `65aff07` round-2, `f84903a` round-3, `e0d8536` round-4, `1ed3604` round-5, round-6 docs. Full per-round log in the plan file.

---

## Prior status (2026-05-20 PM — AI tool retired from UI + Publish flow + toolbar refactor)

AI feature retired entirely from UI + Publish flow shipped + Palette/Code/Tree moved to top toolbar + sidebar gone + BYO-AI swap plan LOCKED. Commit `357e542 refactor(toolbar)`.

### Today's deliverables (2026-05-20)

1. **Palette dark-theme fix** (`f338219`) — `isDarkTheme` regex was matching `surface` inside `on-surface` entries, averaging light text hex with dark bg hex, misclassifying dark templates as light. Added word-boundary negative lookbehind/lookahead.

2. **Publish flow** (`a76bdfe` + `a593608` bug-hunt sweep) — One-click "publish to Netlify Drop." Builds zip (hand-rolled STORED-only writer with CRC32 + UTF-8 flag), captures iframe snapshot for JSX mode + sanitizes dropin internals, downloads + opens Netlify Drop tab synchronously (popup-blocker-safe), README inside zip explains folder-vs-zip + alternative hosts. 42 prod-import tests covering zip format, sanitizer false-positive guard, build-package orchestration.

3. **Toolbar refactor** (`357e542`) —
   - **AI swap removed from UI everywhere** (vibe panel button + modal mount + `onComponentSwap` prop chain). Handlers/state kept as dead code in Workspace.tsx for future revival; `lib/ai-edit/*` + `detach-from-map.ts` on disk.
   - **Palette button + popover** (`components/PalettePopover.tsx`) — new top-toolbar affordance with 12-tile grid, outside-click + Escape dismiss, replaces the right-sidebar Palettes tab.
   - **JSX/HTML toggle removed** — was eating row width + forcing wrap. Templates open in their own mode; toggle was power-user crossover anyway.
   - **WorkspaceLeftRail removed** — Code/Tree toggles moved to top toolbar's new `extraTools` slot via `ChromeToggleButton` helper. Library button has no UI surface anymore (state + sidebar component on disk per user's hold-on-library directive).
   - **Single-line toolbar** — `flex-nowrap` + `min-w-0` truncate on hint + `shrink-0` on every group + `xl:flex` on hint (hides below 1280px). All chrome stays on one row at common laptop widths.

### Next: BYO-AI component swap (PLAN LOCKED, READY TO EXECUTE)

User pivot: instead of Dropin paying for an AI vendor, let user pick their own (ChatGPT/Claude/Gemini). Browse component library → pick reference → Dropin composes prompt → clipboard-copy + new tab to user's AI → user pastes reply back → Dropin applies via existing patchHtmlOuter / patchJsxOuterByOid pipeline.

Full plan: `docs/superpowers/plans/2026-05-20-byo-ai-swap.md`.

**Key research findings**:
- ChatGPT `?q=` URL prefill works (~1800 char cap for browser compat).
- Claude.ai `?q=` was **removed Oct 2025** for prompt-injection security. Web URL prefill is dead.
- Gemini has no native URL prefill (only Chrome extensions).
- Clipboard-primary, URL prefill best-effort is the locked pattern.

**Why this design**: Zero AI cost to Dropin (same model as Publish). Frontier models (Claude 4.6 Sonnet / GPT-5 / Gemini 3 Pro) ~10× better than coder fine-tunes on this task. No vendor lock-in. Reuses 90% of Phase 6 infrastructure (validate-response, cascade-detach, iframe ai:apply-outer, patch pipelines).

**Estimated effort**: One session, ~600-800 LOC + ~30-50 prod-import tests. New files: `components/ByoAiSwapModal.tsx`, `lib/byo-ai/{compose-prompt,providers,extract-code}.ts`.

---

### Phase 9 — Cascade detach (committed today)

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

## Current status (2026-05-14 PM — inline Browse Components grid + JSX-safety + same-dim swap wrap. User signed off: "not perfect but working better")

Same-day follow-up after the morning's 5-phase simplification. User flagged 3 problems in sequence — each got a real fix (instrumented first, then targeted patch).

### Tailwind comment-scan trap (dev-server 500)

`Workspace.tsx:2422,2454` had `bg-[url('…')]` literal strings in COMMENTS describing the bg-image flow. Tailwind's content scanner regex-matches class candidates anywhere in `./components/**/*.{ts,tsx}` (doesn't strip comments) and emitted `background-image: url('…')` CSS. webpack's css-loader tried to resolve `'…'` as a relative module → "Module not found: Can't resolve './…'" at `globals.css:4:1`. Rewrote both comments to describe the class semantically without writing it in `bg-[...]` form. **Generic gotcha** — never put Tailwind-class-shaped strings inside comments in scanned dirs.

### Inline Browse Components grid (LibraryModal-for-components retired)

User's spec: "click → components appear below that button. user can hover over them and either preview or select - preview being modal showing them in full". Implemented as the picker for component swap; icon / image / bg-image modals stay on LibraryModal.

- **New**: `components/VibePropertiesPanel/InlineComponentBrowser.tsx`. Fetches `ComponentIndex` lazily, filters by `category` prop, renders 2-col `<button>` thumb grid. Hover → fixed-position popover to the left with larger thumb + title + source/category/author. Click tile → `getComponentFull(slug)` → `buildInsertPayload(full, mode)` → `onPick(text, opts)`.
- **Kind-aware filtering**: `Workspace.tsx vibeComponentSwapContext` memo runs Layer 1 (`inferSwapCategory` tag+class tokens) then Layer 2 fallback for utility-Tailwind cases the token heuristic misses: `kind === "button"` → `buttons`; `kind === "container" + isCardLike(info)` → `cards`. New diagnostic field `categorySource`: `hint` / `kind:button` / `kind:container+cardLike` / `none`.
- **Toggle**: `handleVibeComponentSwapOpen` flips with `setVibeComponentSwapOpen(p => !p)` — second click on Browse components collapses the grid.
- **Modal mount retired** at `Workspace.tsx:3538` — comment marks the location.

### Same-dimension wrap on component swap (the "doesn't move neighbors" fix)

Component swaps were resizing the slot → surrounding layout shifted. Fix: capture original bbox at selection time, wrap swapped asset in a same-dim container.

- `lib/vibe-edit/runtime.ts vibeSerialize` extended: `bbox: { width, height, display, marginTop, marginRight, marginBottom, marginLeft }` from `getBoundingClientRect()` + `getComputedStyle()` (integer-rounded px; margins parsed via `parseFloat`).
- `VibeElementInfo.bbox?` field added.
- `InlineComponentBrowser.handlePick` wraps asset in `<div style={{ width, height, display, overflow: "hidden", margin... }}>` (JSX) or HTML `style="..."` form before calling `onPick`. JSX uses React `style={{}}` object literal; HTML uses semicolon-delimited.
- **Trade-off chosen**: `overflow: hidden` (layout stays, oversized content clips visually). Alternative `overflow: visible` would let neighbors overlap.
- **Not handled**: flex `flex-grow/shrink/basis` and grid `grid-column/row` from the original element. If the original was `flex: 1` in a flex container, wrapper takes absolute px instead — neighbors don't shift but the slot also won't auto-fill remaining space. Easy to layer in (capture + apply) if it shows up.

### JSX safety layer (3 fixes)

CSS-bearing Uiverse components + SVG-heavy ones broke JSX-mode swaps:

1. **Fragment wrap for multi-root assets**. `buildInsertPayload` emits comment + `<style>{`...`}</style>` + scoped `<div>` for components with CSS — three top-level JSX siblings, but outer-swap replaces ONE JSXElement → babel "Unexpected token (n:8)". `InlineComponentBrowser.handlePick` wraps in `<>...</>` for JSX mode only (HTML accepts sibling outerHTML natively).

2. **forceRebuild flag** on component swaps. JSX comments `{/* */}` and `<style>{`...`}</style>` template literals don't render via `el.outerHTML = jsxString` in the iframe — DOM ends up with literal text. New `opts.forceRebuild` parameter on `handleVibeOuterSwap` routes through `setCode` (rebuild) instead of `setCodeSilent` (no rebuild). InlineComponentBrowser passes `{ forceRebuild: mode === "jsx" }`; icon/image modals don't pass it → fast path preserved.

3. **`html-to-jsx` converter SVG fixes**. Uiverse cards with SVG icons broke twice:
   - **Colon-namespaced attrs** (`xmlns:xlink`, `xml:space`, `xlink:href`) → JSX rejects colons in attr names. Added `:([a-z])` → camelCase: `xmlnsXlink`, `xmlSpace`, `xlinkHref`. React maps these to namespaced DOM attrs at render.
   - **SVG element recasing** — HTML parser lowercases all tags but React requires camelCase for SVG: `lineargradient` → `linearGradient`, `clippath` → `clipPath`, `foreignobject` → `foreignObject`, all `fe*` filter primitives, `animateMotion`, `animateTransform`, etc. 32-entry `SVG_TAG_MAP`.
   - **SVG attribute recasing** — `viewbox` → `viewBox`, `stopcolor` → `stopColor`, `gradientunits` → `gradientUnits`, etc. 50+ entry `SVG_ATTR_MAP`. Without this React passes them lowercase to DOM and SVG ignores them silently (gradient stops without colors, viewBox unconstrained).

### Diagnostic instrumentation (kept in place — don't remove without reason)

When the swap-category bug initially looked unfixable, added always-on `track()` / `console.log()` at every decision point:
- `[dropin:Workspace] setTool { next }` — tool button click reached state setter
- `[dropin:Workspace] vibe:selected { tag, kind, oid, path, classes }` — iframe selection reached host
- `[dropin:Workspace] vibe:component-swap-toggle { vibeInfoPresent, tag, oid, classes }` — Browse-components clicked
- `[dropin:Workspace] vibe:component-swap-context { tag, kind, classList, hint, suggestedCategory, categorySource, targetOid }` — heuristic decision visible
- `[dropin:ComponentsPanel] override-effect-fired { hydrated, initialCategory, initialCategoryKey, currentCategory }`
- `[dropin:iframe-vibe-click] tool=X target=Y` then `hit atom` / `hit card` / `no editable + no card ancestor → clear`

### Files touched

**New**:
- `components/VibePropertiesPanel/InlineComponentBrowser.tsx` (~170 LOC — fetches index, filters by category, renders grid, hover popover, click→pick with Fragment wrap + bbox wrap + forceRebuild flag routing)

**Edited**:
- `components/Workspace.tsx` — CSS comment fix; `inferSwapCategory` import + `isCardLike` import; `vibeComponentSwapContext` memo with Layer 1 + Layer 2 fallback; `handleVibeOuterSwap` accepts `opts.forceRebuild`; toggle on `handleVibeComponentSwapOpen`; component-swap LibraryModal mount removed; diagnostic `track()` calls
- `components/VibePropertiesPanel.tsx` — accepts `componentBrowserOpen`/`componentBrowserCategory`/`onComponentPick`/`onWarn`/`mode` props; renders `<InlineComponentBrowser preserveBbox={info.bbox ?? null}>`
- `components/library/asset-panels/ComponentsPanel.tsx` — `console.log` on override-effect-fired
- `lib/vibe-edit/runtime.ts` — `vibeSerialize` extended with `bbox`; iframe-side click handler logs every click + walk-up branch result
- `lib/vibe-edit/types.ts` — `VibeElementInfo.bbox?` field with margin × 4
- `lib/component-library/html-to-jsx.ts` — `SVG_TAG_MAP` (32 entries) + `SVG_ATTR_MAP` (50+ entries) + colon-attr handler in `mapAttrName`

### What's NOT working perfectly (per user "not perfect but working better")

- **Flex/grid context not preserved on swap** — Wrapper takes abs-px width even when original was `flex: 1`.
- **Existing in-source picks pre-fix don't auto-heal** — anything swapped during the broken-converter window is literal text in user-source.jsx now. Won't fix itself; user re-picks to clean up.
- **Single-root JSX components also get Fragment-wrapped + forceRebuild** — harmless but a tiny unnecessary rebuild.

---

## Current status (2026-05-14 — vibecoder simplification SHIPPED: toggle gone, Insert hidden, swap-anywhere wired, BG-image control for cards + sections, Plasmic-style cascade badge. 6291/6293 vitest, tsc 0.)

User-driven simplification of the no-code edit flow. Five surgical phases, all green tsc, no regressions. Scope: "we want to remove everywhere/instance toggle... insert feature as well... then any element should have swap function... every element where it makes sense should have background image replacement... fix the bug that if 3 cards in a same section and we change one icon it changes all".

### Phase 1 — Everywhere/Instance toggle REMOVED, locked to instance mode

- `propagationMode` state + localStorage persistence + setter all deleted from `Workspace.tsx`.
- Phase D cross-file branch + Phase F multi-instance preflight branch deleted from `handleClassChange` + `handleSwap`. Both code paths only fired when toggle === "everywhere".
- Imports of `findCrossFileDefinition` / `findInlineComponentDefRootOid` / `findAllInstancesOfDefinition` / `planEverywhereSwap` / `patchJsxClassByOid` / `createEdit` dropped from Workspace. `applyEditDirect` removed from `useEditHistory` destructure (no consumers left).
- `WorkspaceActions` segmented control + props (`propagationMode` / `onPropagationModeChange`) gone.
- **NB**: The Phase D/F **pure-logic libs** (`lib/swap/plan-everywhere-swap.ts`, `lib/ast/instance-graph.ts`, `lib/ast/cross-file-query.ts`, `lib/ast/component-def.ts`, `lib/edits/operations.ts` `createEdit` half, `lib/ast/patch-class-by-oid.ts` `patchJsxClassByOid` only) + their ~150 prod-import tests REMAIN. Dead-but-tested.

### Phase 2 — Insert tool HIDDEN

- `TOOL_LIST` in `components/ToolBar.tsx` now `["view", "vibe", "move"]`.
- `'i'` keyboard shortcut removed.
- Persisted `dropin:tool === "insert"` migrates to `"view"` on next mount.
- `Tool` union member + `insert` message type stay (internal callers still emit).
- All `lib/ast/operations/insert.ts` + insert-target tracking + LibraryModal insertContext code paths intact and untouched.

### Phase 3 — Kind-aware Swap, everywhere

- New `vibeComponentSwapOpen` state. `handleVibeComponentSwapOpen` / `Close` / `Pick` callbacks (kind-agnostic).
- Third `LibraryModal` mount with `suggestedPanel: "components"`. Same outer-replacement flow as the existing icon + image modals.
- New shared `SwapComponentButton` exported from `components/VibePropertiesPanel.tsx`. Rendered at the bottom of `TextControls` (text/heading/button), `LinkControls`, `CardControls`.
- Closes on pick + on selection-path change + on tool exit.

### Phase 4 — Background-image control for cards + semantic sections

- `VibeElementInfo.bgImage?: string | null` field added.
- Iframe runtime's `vibeSerialize` reads `cs.backgroundImage`, parses `url("…")` → URL string OR null.
- Iframe runtime `vibeIsCardLike` split into two predicates: **`vibeHasCardChrome`** (bg / rounded / shadow / border) used by the span-override walk-up; **`vibeIsCardLike`** = `vibeIsSemanticSection(el) || vibeHasCardChrome(el)` used by the post-editable-atom card-ancestor fallback.
- Host-side `lib/vibe-edit/detect.ts isCardLike` extends with `SECTION_TAGS` Set so the panel routes section elements to CardControls.
- `StyleDelta.bgImageUrl?: string | null` added to `lib/vibe-edit/style-to-class.ts`. null/"" = strip; string = strip + add `bg-[url('…')] bg-cover bg-center bg-no-repeat`. `encodeBgImageUrl` helper encodes `'` and `]`; rejects `javascript:` / `data:` / `vbscript:` URL prefixes (XSS guard).
- Workspace idle-commit drift detector extended with `bgImage` field check + `styleDelta.bgImageUrl` emission.
- `handleVibeBgImagePick` extracts URL from Media-panel asset block, posts `vibe:update-style`.
- `handleVibeBgImageRemove` clears the bg.
- `CardControls` gets a new "Background image" section with Pick/Replace + Remove buttons.

### Phase 5 — Plasmic-style "Editing all N copies" badge for cascading edits

Research finding before locking the design: industry-best-practice in mature React visual editors **is** cascade. Plasmic's docs explicitly: "edits are applied to the first replica only, those edits automatically propagate to all other replicas in the loop". Onlook (the visual editor the OID system was modelled on per `lib/ast/oids.ts`) has the same limitation.

- Iframe runtime: new `vibeInstanceCount(oid)` does `document.querySelectorAll('[data-dropin-id="<oid>"]').length`.
- `vibeSerialize` emits `instanceCount`. `VibeElementInfo.instanceCount?: number` optional field.
- `VibePropertiesPanel` renders coral info chip when `instanceCount > 1`: "**Editing all N copies** — This element appears N times."
- No AST surgery. No auto-expansion.
- **Trap caught + recorded**: chip-comment used backticks (`` `.map()` ``) inside the runtime template literal block → backtick closed the outer TS template at parse time. Per `memory: ts_template_backtick_trap`.

### Files touched (Phase 1-5)

- `components/Workspace.tsx` — net -147 LOC (Phase D/F branches + toggle UI + propagation state/setter), +180 LOC (3 swap-state lifecycles + bgImage flow)
- `components/ToolBar.tsx` — TOOL_LIST minus `insert`
- `components/VibePropertiesPanel.tsx` — onComponentSwap + onBgImagePick + onBgImageRemove props; SwapComponentButton; instance-count chip; section-tag routing to CardControls
- `components/VibePropertiesPanel/TextControls.tsx` + `LinkControls.tsx` + `CardControls.tsx` — Browse-components button. CardControls also gets the bg-image section
- `lib/vibe-edit/types.ts` — bgImage? + instanceCount? on VibeElementInfo
- `lib/vibe-edit/runtime.ts` — vibeParseBgImageUrl + vibeHasCardChrome + vibeIsSemanticSection + vibeInstanceCount + extended vibeSerialize
- `lib/vibe-edit/detect.ts` — SECTION_TAGS Set + extended isCardLike
- `lib/vibe-edit/style-to-class.ts` — bgImageUrl on StyleDelta + bg-image regex constants + encodeBgImageUrl URL guard

### Tests: tsc 0; vitest 6291/6293 across 114 files. Zero regressions.

---

## Current status (2026-05-11 PM — audit shipped 10 HIGH/MED fixes, 5-phase follow-up plan locked in. 6256/6258 vitest, tsc 0.)

Comprehensive audit run by 7 parallel specialized agents over the freshly shipped 2026-05-10 PM + morning vibe-edit work. **10 HIGH/MED bugs shipped fixed in-session** (+18 new tests, zero regressions, tsc 0 throughout). Full audit report at repo-root `AUDIT-2026-05-11.md`. Plan for the 5-phase follow-up at `docs/superpowers/plans/2026-05-11-edit-flow-hardening.md`.

### Fixed this session (10)

1. **H1** — variant-prefixed colour classes (`hover:text-red-500`, `md:bg-blue-500`, chained `md:hover:...`, hyphenated `group-hover:`) survived the strip pass in `lib/vibe-edit/style-to-class.ts`. Replaced the imported `colorMatch` (anchors at unprefixed only by design) with a local `colorVariantMatcher` allowing `(?:[\w-]+:)*` leading prefix segments. Same broadening to `ROUNDED_MATCH`. Tailwind opacity-slash form (`text-red-500/50`) also now strips. +8 tests.
2. **PX1+PX7** — Pixabay XSS via photographer-name `-->` / `*/` in attribution comments + `"` in `alt="…"` fallback. New `sanitizeForComment` + `sanitizeForAttr` helpers in `lib/asset-library/insert-pixabay.ts`. Photographer name + profileUrl + pageUrl all routed through the sanitizers before joining into the comment lines. Author-name alt fallback now strips `"`. Also fixed `small` resolution → `previewURL` (was mapping to webformat = same as medium). +6 tests.
3. **SF-H3** — `app/api/assets/pixabay/route.ts` returned `detail: String(e)` on fetch failure. Node's undici fetch error message format may include the full URL with `key=PIXABAY_KEY` in the query string → API key leak path. Replaced with static `"Could not reach Pixabay…"` + `console.error` server-side. Same idiom for the new defensive `res.json()` try/catch.
4. **SF-M7** — Pixabay 400-not-invalid-key fall-through double-consumed the response body via `res.text()` → next `res.json()` threw → generic 500. 400-branch now always returns (401 for invalid-key match, 400 with bounded `text.slice(0, 200)` detail otherwise).
5. **UI1+UI5** — `code` in dep arrays reset the 600ms idle-commit timer per Monaco keystroke + recreated `handleVibeOuterSwap` on every render. Added `codeRef: useRef<string>("")` + sync `useEffect([code])` mirroring `code → codeRef.current`. Both consumers read `codeRef.current` at fire time + dropped `code` from deps. Same ref-on-write pattern as the existing `previewHandleRef` / `lastVibeCommitRef`.
6. **UI3** — Swap modal stayed open when user clicked a different element after opening it → pick from library mutated the new element, not the originally-intended one. `handleVibeSelected` now compares `prev.path !== info.path` and closes both `vibeIconSwapOpen` / `vibeImageSwapOpen` on a path-changing selection. The vibe runtime's own re-emits after our mutations carry the same path so this only fires on genuine user-driven changes.
7. **GP1** — Our Picks filter broken by `viewMode === "list"` override. `ListView` rendered the 18 picks in a responsive 4-column grid, destroying the 1D curated editorial read order. Render-priority gate now `viewMode === "list" && activeFilter?.kind !== "picks"`. Picks always falls through to `StaticTemplateGrid` (matches the marquee guard pattern).
8. **GP2** — Sort dropdown silent no-op on picks (picks's filter memo short-circuits to curated order regardless of `sort`). Added `disabled` + `title` props to `SortSelect` + `ViewSelect`. Both visibly disable with `opacity-50 cursor-not-allowed` + tooltip on picks.
9. **UI4** — TextTypographyExtras slider initialized to 0 when `currentIndex` returned -1. If `detectTypographyProps` matched an arbitrary class like `text-[12px]`, dragging the slider one notch would silently overwrite with `text-xs`. Now: slider disables (opacity-40 + cursor-not-allowed) when `idx < 0` with title `"Remove the custom value (×) to use the scale slider"`; remove (×) button always renders; display label changes from `"—"` to `"custom"`.
10. **M2 + WU6 + SF-H2 + SF-H4** — Runtime hardening: (a) `patchJsxOuterByOid` + `runtime.ts` vibe:update-outer handler both strip foreign `data-dropin-id` from asset markup before injecting target OID (preserves OID continuity on assets that ship pre-stamped); (b) OID char-scan whitespace skip now includes LF (10) + CR (13) for multi-line asset markup; (c) empty catches at `el.outerHTML = stamped` and `el.style[prop] = v` now `console.warn` instead of swallowing CSP / sandbox / parse-rejection errors. +2 tests for the foreign-OID strip.

### Files touched (10 production files + 3 test files)

**Production:**
- `lib/vibe-edit/style-to-class.ts` (H1 — broader strip regex)
- `lib/asset-library/insert-pixabay.ts` (PX1+PX7 sanitizers + PX3 small→preview)
- `app/api/assets/pixabay/route.ts` (SF-H3 + SF-M7 + JSON parse guard)
- `components/Workspace.tsx` (UI1+UI5 codeRef + UI3 modal close)
- `components/GalleryView.tsx` (GP1 list-picks override + GP2 disable)
- `components/VibePropertiesPanel/TextTypographyExtras.tsx` (UI4 arbitrary-class guard)
- `lib/vibe-edit/runtime.ts` (WU6 + SF-H2 + SF-H4 + M2 mirror)
- `lib/ast/patch-class-by-oid.ts` (M2 foreign-OID strip)

**Tests (+18 cases):**
- `tests/vibe-edit-style-to-class-prod.test.ts` (+8 variant-prefixed cases)
- `tests/insert-pixabay-prod.test.ts` (+6 XSS-defence cases, +1 fallback case, -1 obsolete resolution-confirmed-broken-mapping case → net +6)
- `tests/patch-by-oid-prod.test.ts` (+2 foreign-OID-strip cases)

### What's deferred — 5-phase plan at `docs/superpowers/plans/2026-05-11-edit-flow-hardening.md`

After user discussion ("we want this for vibecoders easy, i'm mostly concerned with edit feature… swap is now redundant since we're swapping basically in edit mode"), three audit findings + two LOW items got triaged into a phased follow-up:

| Phase | Item | Time | Why |
|---|---|---|---|
| 1 | WU1 — span walk-up: `<button><span>Label</span></button>` selects span, not button (34 occurrences in 20/108 templates) | 1 hr | Edit-flow BLOCKER for the most common interaction |
| 2 | SF-M6 — `buildVibeCommit` returns `unchanged:true` for 2 silent bails + 1 legit no-op; discriminated union + bail toast | 2 hr | Silent-failure trust killer; mirrors F1/F9/parseServerStreamPayload pattern |
| 3 | SF-M2 — opacity dropped silently on `#ffffff80` / `rgba(255,0,0,0.5)`; emit Tailwind `text-[#hex]/N` slash form | 45 min | "Editor ate my change" pattern |
| 4 | TextControls 80ms keystroke debounce | 30 min | Typing lag at 80wpm = 10 msgs/sec to iframe each forcing getComputedStyle reflow |
| 5 | Extract `rgbToHex` to `lib/vibe-edit/rgb-to-hex.ts` with `transparentFallback` param (kill divergence: TextControls returns white, IconControls black) | 30 min | Prevent future weird-color bugs from a future "DRY" refactor |
| 6 (parking lot) | Kill standalone Swap tool — swap-from-library lives inside vibe mode now | 1-1.5 hr | Mental-model simplification; ask user before executing |

**Total Phases 1-5: ~5 hours.** Final target ~6285/6258+ baseline. Plan file has line-level changes, helper code, test cases, definition-of-done, and locked research findings (span-pattern frequency, buildVibeCommit's 3 unchanged paths, rgbToHex divergence, keystroke-flood evidence, swap-tool surface area).

### Defer-don't-fix (14 LOW items)

Documented in `AUDIT-2026-05-11.md` under "NOT FIXED". 11 don't impact vibecoders (a11y labels, copy stale, perf-minor, defensive logging). 3 do but live in the Phase 4-5 plan above. Worth clearing in a quiet week (~3-4hr total).

## Current status (2026-05-11 morning — all 4 vibe-edit follow-ups SHIPPED + walk-up click fix + view default + Pixabay default + Our Picks default filter. 6238/6240 vitest, tsc 0.)

Session continued from the 2026-05-10 PM scaffold. All four open follow-ups from the prior session's status block closed end-to-end, in order:

1. **Icon → swap from library.** New patchers `patchJsxOuterByOid` (re-injects existing OID into new outer's first opening tag, so OID-addressing survives the wholesale element replacement) + `patchHtmlOuter` (parse5 byte-range overwrite). New iframe message `vibe:update-outer` (carries `path` + `oid` + `newOuter`); runtime handler does manual char-scan to inject OID, sets `el.outerHTML`, re-finds element at same path, re-emits `vibe:selected`. `buildVibeCommit.next.outer` routes per mode. `IconControls.tsx` got "Browse icon library" button → `onSwapClick`. Workspace: `vibeIconSwapOpen` state + `handleVibeIconPick` + `LibraryModal` mount with `swapContext.suggestedPanel: "icons"`.

2. **Image → Unsplash picker.** Mirrors icon swap exactly. `ImageControls.tsx` got "Open media library" button. `vibeImageSwapOpen` + `handleVibeImagePick` + second `LibraryModal` mount with `suggestedPanel: "media"`. Both icon and image picks route through shared `handleVibeOuterSwap` helper.

3. **Text → typography sliders.** New `lib/vibe-edit/typography.ts` — `detectTypographyProps(classes)` returns flags for fontSize / fontWeight / lineHeight / tracking / textAlign present in unprefixed Tailwind class set (17 tests). New `vibe:update-classes` iframe message → runtime overwrites `class` attr + re-emits selected. `buildVibeCommit.next.classes` routes to `patchJsxClassByOid` / `patchHtmlClass`. New `components/VibePropertiesPanel/TextTypographyExtras.tsx` renders ONLY sliders for props detected on the element (per the user's "show what knobs exist" framing). Reuses `currentIndex` / `setScale` / `unsetScale` / `setToken` + `TEXT_ALIGN_MATCH` from `lib/tailwind-slider-maps.ts`. TextAlign as segmented control. Idle commit useEffect drift now includes `vibeInfo.classes` against baseline so slider drags reconcile after 600ms.

4. **JSX style persistence.** New `lib/vibe-edit/style-to-class.ts` — `mergeStyleDeltaIntoClasses({color?, backgroundColor?, borderRadius?}, currentClasses) → {classes, changed}` strips conflicting Tailwind palette/arbitrary/named classes (uses `colorMatch("text"|"bg")` from `tailwind-slider-maps`), adds `text-[#hex]` / `bg-[#hex]` / `rounded-[Npx]`. `transparent` / `0px` strip without adding. Colour values normalize from `rgb(r,g,b)` / `rgba(...)` / 3-6-8-digit hex to canonical `#rrggbb`. Radius parses `Npx` / `Nrem` / multi-value (first wins) / plain numbers; `calc(...)` returns null (caller no-op). 26 tests. `buildVibeCommit.next.styleDelta` field — JSX branch routes through merger → `patchJsxClassByOid`; HTML branch ignores (continues using `next.style` for direct inline-style writeback — HTML survives reloads natively without translation). Workspace idle commit now compares per-property style drift (`textColor` / `bgColor` / `borderRadius`) on top of `inlineStyle` and builds `styleDelta` with only the changed props.

### Bug fix: walk-up click resolution for icons / buttons / cards

User reported clicks on icons/buttons/cards did nothing. Root cause: vibe runtime's click handler did `if (!vibeIsEditable(ev.target)) return;`. `ev.target` is the DEEPEST hit element — for SVG icons that's a `<path>`, for buttons-with-children it's the inner span/svg, for card padding clicks it's the wrapping div. None match the editable selector. Fix in `lib/vibe-edit/runtime.ts`: added `vibeFindEditableAncestor(el)` (walks up to first editable atom) + `vibeFindCardAncestor(el)` (walks up to first card-like container; computed-style check for bg / rounded / shadow / non-zero border-width). Click handler order: editable atom → card → clear. +3 integration tests (svg-path → svg; button-child → button; card-div → container kind).

### Default tool reverted to `view`

User flipped during this session: `useState<Tool>("view")` (was `"vibe"`). Persisted-`select` migration now lands on `"view"` instead of `"vibe"`. First-time visitors land on rendered preview with no editing chrome; they click "Edit" (vibe) when ready.

### Pixabay added as default photo source

User wanted Unsplash but registration is days-to-weeks for Production tier. Pixabay instant-key (`PIXABAY_API_KEY=55811267-…` in `.env.local`), 100 req/60s, 4M+ CC0-equivalent photos. New `app/api/assets/pixabay/route.ts` (key in query param), `lib/asset-library/insert-pixabay.ts` (`buildPixabayInsert` with attribution comment + 4-tier resolution mapping), `components/library/asset-panels/sub-panels/PixabayPanel.tsx` (UI clone of UnsplashPanel; 250ms debounced search, IndexedDB recents). `MediaPanel.tsx` `PhotoSource` union now `pixabay | pexels | unsplash` — Pixabay is the default for new users (existing localStorage choices preserved). `lib/asset-library/types.ts` extended with `PixabayPhoto` + `PixabaySearchResponse` + `"pixabay"` `RecentKind`. 10 prod-import tests. Unsplash and Pexels remain wired; Unsplash shows "API not configured" empty state when `UNSPLASH_ACCESS_KEY` is missing (still missing — user not registered yet).

### Our Picks default filter on /gallery

18 curated slugs (8 user-locked + 10 from the parallel image-audit terminal) seeded in `OUR_PICKS_SLUGS` at the top of `components/GalleryView.tsx`. `OUR_PICKS_INDEX` Map for O(1) lookup. New `{ kind: "picks" }` arm on `ActiveFilter`. Default `activeFilter` is `{ kind: "picks" }`. "Our picks" pill renders FIRST in the FilterSidebar (above All), uses existing `FilterButton` so it inherits the `lg:flex-1 lg:basis-0` stretch — sidebar height unchanged. Count chip reflects how many of 18 match the current search. When picks active, the sort dropdown is IGNORED and order locks to the curated sequence. Render: picks always use `StaticTemplateGrid` (240px tiles, flex-wrap, 6-per-row at desktop = 3 rows for 18) — bypasses `useMarquee` threshold (would otherwise fire at 18 ≥ 15). Render switch: `useMarquee && activeFilter?.kind !== "picks"` for marquee.

### Files touched this session

**New (untracked at session close):**
- `lib/vibe-edit/typography.ts` + `style-to-class.ts`
- `lib/asset-library/insert-pixabay.ts`
- `app/api/assets/pixabay/route.ts`
- `components/VibePropertiesPanel/TextTypographyExtras.tsx`
- `components/library/asset-panels/sub-panels/PixabayPanel.tsx`
- `tests/vibe-edit-typography-prod.test.ts` (17 cases)
- `tests/vibe-edit-style-to-class-prod.test.ts` (26 cases)
- `tests/insert-pixabay-prod.test.ts` (10 cases)

**Edited (mostly untracked but include tracked-modified files):**
- `lib/vibe-edit/runtime.ts` (walk-up + vibe:update-outer + vibe:update-classes handlers)
- `lib/vibe-edit/types.ts` (vibe:update-outer + vibe:update-classes message variants)
- `lib/iframe-bridge.ts` (host→iframe message union extension)
- `lib/vibe-edit/commit.ts` (next.outer + next.classes + next.styleDelta routing) — **tracked modified**
- `lib/ast/patch-class-by-oid.ts` (patchJsxOuterByOid added)
- `lib/source-patch-html.ts` (patchHtmlOuter added)
- `lib/asset-library/types.ts` (PixabayPhoto + Pixabay search response)
- `components/VibePropertiesPanel.tsx` (forwards onIconSwap / onImageSwap / onClassesChange)
- `components/VibePropertiesPanel/IconControls.tsx` + `ImageControls.tsx` + `TextControls.tsx` (Browse buttons + onSwapClick / typography slot)
- `components/Workspace.tsx` (vibe modal state + handlers + idle-commit drift extension + tool default flip) — **tracked modified**
- `components/library/asset-panels/MediaPanel.tsx` (Pixabay as 3rd source + default)
- `components/GalleryView.tsx` (Our Picks filter + curated-order sort + StaticGrid override)
- `tests/patch-by-oid-prod.test.ts` + `tests/source-patch-html-prod.test.ts` + `tests/vibe-edit-commit-prod.test.ts` (+28 cases for new patchers + commit fields) — **last one tracked modified**
- `tests/integration/vibe-edit-roundtrip.test.ts` (+5 cases for walk-up + vibe:update-classes + vibe:update-outer)
- `.env.local` (`PIXABAY_API_KEY` + `PEXELS_API_KEY` filled; `UNSPLASH_ACCESS_KEY` empty) — gitignored, never committed
- `.env.example` (Pixabay key template added)

### Parallel image-audit terminal — 9 commits (web/ only, no overlap)

Another terminal ran in parallel this morning. Image-context-fit audit across all 108 templates. Commit list (top-down): `2804e61` / `4ac1fa7` / `60efb3d` / `215c2b9` / `dec08e9` / `ab87cbd` / `6ac82b8` / `b194939` / `c659862` (wip snapshot, grabbed this session's prior uncommitted work — see `project_vibe_edit_session.md` for full file list). Backup `backup/pre-master-id-sweep-2026-05-10` points at `c659862`. All 11 wrong-subject offender IDs (4 master + 7 secondary) = **0 residuals** across `web/`. All `cdn.simpleicons.org` + `api.iconify.design` URLs HEAD 200. None of these commits touch `components/`, `lib/`, `app/`, `tests/`, or any non-`web/` path — zero overlap with vibe-edit work.

**Note:** `templates/coming-soon/source.{html,jsx}` got master-ID swaps applied but the `templates/` folder is still untracked in git. Working-tree-only; decision pending.

### Test totals at session close

tsc 0. vitest **6238/6240** across **112** test files (was 6146/100 baseline pre-session → +92 tests / +3 test files net). Only the documented `tests/integration/envelope-channel.test.ts` jsdom flake fails (1-3 fluctuates per run, pre-existing, unrelated to any vibe-edit code).

### Next session pre-flight

User scheduled manual browser testing post-lunch 2026-05-11. Surfaces NOT yet validated end-to-end in a real browser:
- Icon swap via library: pick icon → outerHTML mutation → source commit → reload survival
- Image swap via Pixabay: pick photo → outerHTML mutation → attribution comment in source → reload survival
- Typography sliders: drag font-size / weight / leading / tracking → DOM updates → idle commit class write → reload preserves
- JSX style persistence: pick colour / bg / radius → translates to `text-[#hex]` / `bg-[#hex]` / `rounded-[Npx]` in source → reload preserves
- Walk-up click: click SVG path → selects parent svg; click inner span of button → selects button; click card padding → selects card div
- View default: first visit lands on view (no editing chrome); click "Edit" to enter vibe mode
- Our Picks default: gallery lands on curated 18 in locked order; 6×3 static grid (no marquee); switching to All / category / style returns to marquee for ≥15 items

## Current status (2026-05-10 PM — vibe-edit no-code flow SHIPPED through Phases 1-4 + card/icon kinds. Plan at `docs/superpowers/plans/2026-05-10-vibecoder-edit-flow.md`.)

After the morning's many small fixes (props panel filtering / iframe lib loading / log noise / view-mode default / etc.), user redirected to a **structural** rework: mirror MoodScape's `editorScript.ts` approach (branch `step-3b-modes-advanced-ai`) since "we did it right at moodscape". Plan written, then 4 phases shipped end-to-end this afternoon.

**Branch `audit-phase2-cascade-ids`. 11 commits this session. tsc 0. vitest 6146/6148 (the 2 fails are the documented envelope-channel jsdom flake from `project_manipulation_phase1_progress.md` — unchanged by this work).**

### Architectural pivot (vs the old FocusEditor flow)

| Concern | Old | New (vibe-edit) |
|---|---|---|
| Source of truth at edit time | Source file → AST rewrite → bundle → srcDoc rebuild on every keystroke (visible flicker) | **Iframe DOM is the truth.** Mutations land via `postMessage(vibe:update-*)`. Source reconciled lazily after 600ms idle via `buildVibeCommit`. **No iframe rebuild on edit = no flicker.** |
| Editable scope | Universal (any DOM node) | Constrained: `h1-h6, p, span, li, blockquote, small, figcaption, td, th, label, strong, em, code, pre, a, button, img, svg`. Plain wrapper containers inert; card-like containers (have bg/rounded/shadow/border) get `CardControls`. |
| Selection UX | Click → fullscreen FocusEditor modal opens with a SECOND iframe + focus chrome that hides/dims siblings | In-place coral outline. Side panel populates on the right. No modal. |
| Props panel | 12 sections regardless of selection | **Per-kind controls only:** text/heading/button → text+colors; image → src+alt; link → text+href; icon → color; card → bg+corners; plain wrapper → inert hint |
| Default tool | `view` | `vibe` (vibecoders land on click-to-edit on first visit). Returning users on `select` migrate to `vibe`. |

### Files added this session

**Pure-logic (`lib/vibe-edit/`):**
- `path.ts` — CSS-selector path round-trip (12 prod-import tests)
- `kind.ts` — 7-bucket classifier `heading|text|image|icon|link|button|container` (13 tests)
- `types.ts` — `VibeElementInfo` + `VibeMessage` + `VibeCommand` shapes
- `commit.ts` — `buildVibeCommit({mode,source,old,next})` translates DOM → source via existing byte patchers (12 tests)
- `detect.ts` — per-element prop detection: `isCardLike`, `hasBackground`, `hasRounding`, `hasShadow`, `hasBorder`, `parseRadiusPx` (17 tests)
- `runtime.ts` — iframe-side script emitted into `inspectorRuntimeJs`'s template; constrained editable set, click-select, 4 direct-mutation handlers + select/clear commands

**Iframe-bridge extensions (`lib/iframe-bridge.ts`):**
- `Tool` union extended with `vibe`. `components/ToolBar.tsx` now re-exports `Tool` from iframe-bridge (was duplicated → drift risk eliminated).
- `IframeToHostMessage`: `vibe:ready` / `vibe:selected` / `vibe:cleared` (+ exhaustiveness array).
- `HostToIframeMessage`: `vibe:update-content` / `-style` / `-image` / `-link` / `vibe:select` / `vibe:clear`.
- `vibe:update-style.styles` is open-shape `Record<string, string>` (camelCase CSS prop names) for future panel extensions without protocol bumps.

**JSX patchers (`lib/ast/patch-class-by-oid.ts`):**
- `patchJsxTextByOid` — rewrites text content; bails on self-closing / non-text children.
- `patchJsxAttrByOid` — sets/inserts string-literal attribute; bails on expression-form values.
- 17 prod-import tests in `tests/patch-by-oid-prod.test.ts`.

**Host components:**
- `components/VibePropertiesPanel.tsx` — kind-routing orchestrator; close button; empty-state hint.
- `components/VibePropertiesPanel/TextControls.tsx` — content textarea + text/bg color (text/heading/button).
- `components/VibePropertiesPanel/ImageControls.tsx` — src + alt URL fields (image).
- `components/VibePropertiesPanel/LinkControls.tsx` — text + href fields (link).
- `components/VibePropertiesPanel/CardControls.tsx` — bg color + corner radius slider 0-48px (card-like container).
- `components/VibePropertiesPanel/IconControls.tsx` — color picker + "swap coming soon" hint (svg).

**Workspace wiring (`components/Workspace.tsx`):**
- `vibeInfo` + `lastVibeCommitRef` state.
- 5 callbacks routing edits to `previewHandleRef.current.postVibe`.
- Tool-change cleanup: leaving vibe mode posts `vibe:clear` and resets state.
- 600ms idle-debounce effect calling `buildVibeCommit` on detected drift; `setCodeSilent` writes through without iframe rebuild.
- `<VibePropertiesPanel>` rendered alongside Code/Tree/Library on the right when `tool === "vibe"`.
- Default `tool` flipped from `view` → `vibe`. Persisted `select` migrates to `vibe`. Toolbar's `TOOL_LIST` no longer surfaces Select (lives in the union for internal callers / cancel handlers).

**Preview surface (`components/Preview.tsx`):**
- `PreviewHandle.postVibe(cmd)` typed wrapper over `postToIframe` constrained to `vibe:*` commands.
- `onVibeSelected` / `onVibeCleared` optional props fed from new message branches.

**Tests added: +95 cases, +6 files** (`tests/vibe-edit-{path,kind,detect,commit}-prod.test.ts` + `tests/patch-by-oid-prod.test.ts` + `tests/integration/vibe-edit-roundtrip.test.ts`).

### Decisions locked this session

- **D1**: Iframe DOM is source of truth at edit time. Direct postMessage mutation. **No srcDoc rebuild per edit.**
- **D2**: Per-kind panel routing — no "show all sections always".
- **D3**: Card detection heuristic (`isCardLike` checks classes + computed styles). Plain wrapper containers stay inert.
- **D4**: HTML mode source writeback for inline style attribute works. **JSX mode is a documented no-op in v1** (React rejects string-valued style; expression-form writeback needs a new patcher → deferred). JSX users get session-only style edits.
- **D5**: jsdom postMessage round-trip needs ≥100ms wait for the runtime's re-emit-after-mutation. Captured in integration tests as `waitMs(100)` for update-* assertions.
- **D6**: Select tool is hidden but kept in the `Tool` union — internal callers (cancel handlers, FocusEditor close) still emit it. `TOOL_LIST` doesn't include it; persisted `select` migrates to `vibe`.
- **D7**: Power editor (FocusEditor) stays available — `Select` still auto-opens it for power users. Vibe is **additive, not destructive.**

### Open follow-ups (start here next session)

User explicitly asked for these, in rough effort order:

1. **Image → replace via Unsplash picker.** Wire existing `LibraryModal`'s Unsplash/Pexels panels as a "Browse" button next to the URL field in `ImageControls`. Click photo → set `src` in iframe + commit to source. **Medium effort.**
2. **Icon → swap from library.** Same shape — wire icon panels (Lucide / Heroicons / Phosphor / Tabler / Simple Icons) as a "Swap" button in `IconControls`. Replace `<svg>` outerHTML in iframe DOM + source. Need new patcher `patchJsxOuterByOid` (and HTML equivalent). **Medium-high effort.**
3. **Text → expose typography props that already exist.** When a text element has `text-2xl font-bold leading-tight` etc., show font-size / weight / line-height sliders. Reuse existing `lib/tailwind-slider-maps.ts` logic (already used by FocusEditor). Render only when matching classes are present. **Medium effort.**
4. **JSX style persistence.** Translate inline-style writes to Tailwind arbitrary-class writes (e.g., `borderRadius: 12px` → append `rounded-[12px]` class) so they survive reload in JSX mode. Pure-logic helper + class-merger that strips conflicts. **High effort.**

User's framing (verbatim from last message before this status update):
> "if its text - what props text already has? then we can change manioulate them, if its icon, card - the same, so it depends on what kind of item we click on. if we click on image - we can replace it with unspalsh for example, icon we can replace and change colour maybe"

So: panel detects what knobs the element already has and shows ONLY those. Card detection is the first instance of this pattern. Items 1-3 above extend it.

### Files NOT touched this session (intentional)

- `components/FocusEditor.tsx` — power editor stays for users who need the full inspector
- `components/IsolatedPreview.tsx` — only used by FocusEditor
- `lib/ast/**` (apart from the new patchers) — used by both flows

### Traps caught + fixed

- **Backtick-in-comment** trap (per `memory/project_ts_template_backtick_trap.md`) — almost hit it again in `runtime.ts`. Used single quotes throughout the JS template literal.
- **HTML patcher signature** — `patchHtmlText`/`patchHtmlAttr` take `path: number[]` (parse5 element-index chain), NOT a CSS selector string. Plan originally wrong on this; added `htmlPath: number[] | null` field to `VibeElementInfo`; iframe runtime computes via `vibeGetHtmlPath`.
- **JSDOM postMessage timing** — runtime's re-emit lands ~50-100ms after the test's own postMessage. 10ms wait was too short; integration tests use 100ms.
- **`Tool` type duplicated** between `lib/iframe-bridge.ts` and `components/ToolBar.tsx`. Switched ToolBar to re-export from iframe-bridge.

---

## Current status (2026-05-10 — UI/UX redesign across landing / gallery / template workspace / preview SHIPPED. Functionality phase is next.)

Multi-day UI/UX pass refactoring every public surface. Engineering tests untouched: tsc 0 throughout; vitest still passing (no library logic changed). After this, the user is moving to **functionality work** — clear context and re-read this section to start there.

### What shipped (high-level, by surface)

- **Landing (`app/page.tsx`)** — added card 04 ("Do whatever you want — host, change, remix, free") to the Hero rail. Replaced the 6-card grid with **`<TasteCarousel>`** (3 marquee lanes, middle reverses, full-bleed). Footer redesigned: wolf logo (`/assets/logo.png`) on the left, **Akella inMotion** as a big display link on the right + LinkedIn (Founder + Company) buttons. Full SEO baseline: `metadataBase`, OG/Twitter, robots directives, icons; new **`app/sitemap.ts`** + **`app/robots.ts`**; inline JSON-LD (Organization + WebSite + WebApplication) on the landing.
- **Gallery (`app/gallery/page.tsx`, `components/GalleryView.tsx`)** — heading moved into navbar, body became a sticky-sidebar + bounded-viewport layout. Single sidebar (no double-pane): toolbar items (KindToggle / SortSelect / ViewSelect / SearchToggle) + one flat filter list (All + 7 functional categories + 5 styles). Filter is single-select (clicking any pill replaces the previous). **`ListView`** mode added next to `Carousel` (hover popover with thumb + Select/Preview). Sidebar buttons stretch (`flex-1 min-h-9`) to fill available height so the bottom of RETRO aligns with the bottom of the carousel column. Carousel's 3 lanes use `lg:flex lg:flex-1 lg:flex-col lg:justify-between` so lane 3's bottom matches the sidebar's bottom across viewports. Below `MARQUEE_THRESHOLD` (15) → static flex-wrap grid via `<TemplateTile>` instead of half-empty marquee. Adaptive lane reversals; round-robin lane split.
- **Template style assignment (`lib/templates.ts`)** — added `TemplateStyle = "Stylish" | "Cyber" | "Brutal" | "Editorial" | "Retro"`. **`STYLE_BY_SLUG`** maps 107 of 111 templates by hand (54 Stylish, 13 Cyber, 6 Brutal, 21 Editorial, 13 Retro). Untagged on purpose: `15-artisan-handmade-store`, `94-solarpunk`, `coming-soon`, `product-card`. New `getStyles()` returns the present styles in canonical order.
- **Template tile (`components/TemplateTile.tsx`)** — single source of truth for the card. **No longer a single Link**: hovering / focus-within reveals an overlay with two buttons — **Select** → `/t/[slug]` (editor) and **Preview** → `/preview/[slug]` (fullscreen). Used by both the gallery's MarqueeLanes / StaticGrid / ListView and the landing's TasteCarousel.
- **Fullscreen preview (`components/PreviewModal.tsx`, new `components/PreviewRoute.tsx`, new route `app/preview/[slug]/page.tsx`)** — PreviewModal redesigned: bar in its own flex row (no overlap with iframe), iframe takes the rest. New `/preview/[slug]` route uses the same modal as a full page (close → `router.back()` with `/gallery` fallback). Workspace's ⤢ Expand button uses the same component.
- **Workspace top chrome (`components/Workspace.tsx`)** — minimal navbar (`← Dropin | Title / Subtitle` only). All action buttons consolidated into the existing **ToolBar** via a new `children` slot. ToolBar has 4 button groups separated by `gap-4`: **JSX/HTML** · **INSTANCE/EVERYWHERE** (disabled in HTML mode with explanatory tooltip) · **DESKTOP/TABLET/MOBILE** (with monitor/tablet/phone glyphs) · **EXPAND · COPY · DOWNLOAD** (each wrapped in the same `inline-flex border-2` shell as segmented groups so all outer boxes match). Removed the duplicate breakpoint chooser; `setViewportSynced` now drives both iframe viewport AND inspector breakpoint. Tool button group `border-x-2` only (active coral fills h-12 fully top-to-bottom). `WorkspaceActions` outer carries no chrome — ToolBar's parent supplies bg + padding.
- **Workspace body layout** — new **`<WorkspaceLeftRail>`** with three vertical icon buttons (Code / Tree / Library, 64px wide). All three panels open on the **RIGHT** of the preview. Order from left to right: `Rail (64px) | Preview (flex-1) | Code (resizable, handle="left") | Tree (ElementTree, internal resize flipped to left edge) | Library (resizable, handle="left")`. New shared **`<ResizablePanel>`** with localStorage-persisted widths.
- **Default panel state** — `editorHidden` defaults to **`true`** with localStorage persistence (key `dropin:editor:hidden`). First-time visitors land on the rendered preview with all panels closed; LeftRail is the only chrome. Tips/`FirstOpenTour` still pop on first open.
- **Template edits are ephemeral** — new `persistEdits?: boolean` prop on Workspace, defaults to **`false`**. The `/t/[slug]` page doesn't pass it, so edits live only in React state for the current window — survive Copy/Download but vanish on refresh. Hook honors via `useEditHistory({ disablePersistence: !persistEdits })`. Pre-existing IDB records sit unused; harmless.
- **`lib/preview.ts` view-mode anchor click guard** — clicking `<a href>` inside the iframe in View / Insert / Swap modes now `preventDefault`s. Closes the "double Workspace chrome" bug (template's own anchor was navigating the srcdoc iframe to `localhost:3001/`, which rendered the gallery inside the preview).
- **ElementTree** — moved to right side. `border-r-2` → `border-l-2`. Drag handle moved from `right: -3` → `left: -3`; drag math negated (`startWidth - dx`) so dragging LEFT grows the panel. Header `flex-wrap` so depth/subtree controls don't overflow at narrow widths.
- **`components/library/Sidebar.tsx`** — width fixed → `w-full` (parent ResizablePanel controls actual width). Border switched to `border-l-2` (now sits on right, not far-right).

### Known follow-ups for the functionality phase

- Pre-existing IDB records for templates aren't cleaned up — they're skipped on read but stay in browser storage. Add a one-shot cleanup if the user cares.
- Mobile (`<lg`) layout for the workspace right-side panels isn't perfected — fine on desktop, the bounded-viewport layout falls back to natural flow on mobile but the ResizablePanel widths ignore mobile.
- `MANUAL-TEST-CHECKLIST.md` is from before this UI/UX pass — the surfaces have changed enough that it's stale for click-through testing of the redesigned flows. Worth refreshing if a manual QA pass happens.
- Landing OG image is the wolf logo (1024×1024 square). Replace with a proper 1200×630 designed asset before public launch.
- `NEXT_PUBLIC_SITE_URL` env var defaults to `https://dropin.akellainmotion.com` — set this when the production domain is locked.

### Files touched in this UI/UX phase

**New**:
- `components/TasteCarousel.tsx`
- `components/MarqueeLanes.tsx`
- `components/TemplateTile.tsx`
- `components/WorkspaceLeftRail.tsx`
- `components/ResizablePanel.tsx`
- `components/PreviewRoute.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/preview/[slug]/page.tsx`

**Heavily edited**:
- `app/layout.tsx` (full SEO metadata)
- `app/page.tsx` (hero card 04, TasteCarousel, JSON-LD, footer with Akella inMotion + LinkedIn)
- `app/gallery/page.tsx` (sticky footer + bounded viewport, slim masthead)
- `components/GalleryView.tsx` (single sidebar, View toggle, filter unification, list mode, lane fill)
- `components/Workspace.tsx` (LeftRail wiring, ToolBar children slot, panels-on-right, ephemeral default)
- `components/PreviewModal.tsx` (flex-column layout, no iframe overlap)
- `components/ElementTree.tsx` (right-side placement + flipped resize handle)
- `components/library/Sidebar.tsx` (w-full + border-l)
- `components/ToolBar.tsx` (children prop, vertical-borders-only on tool group, items-center)
- `components/KindToggle.tsx` (h-9 small + block size variants for sidebar/toolbar)
- `lib/templates.ts` (TemplateStyle + STYLE_BY_SLUG + getStyles)
- `lib/preview.ts` (anchor-click guard in non-edit modes)

## Current status (2026-05-08 — second-grind: parseServerStreamPayload union + F5/F6/F7/F8 + Domain 1/2/5 MEDs + ~14 export demotions SHIPPED: 6066/103, +16/+0 since the morning's 6050/103)

**Same-day second-grind across 11 wins** (audit-2026-05-06 MED+LOW close-out, all type-design + Domain-5 cleanup):

1. **Domain 4 MED — `parseServerStreamPayload` discriminated union** (+5) — `lib/sse.ts`: return type changed from `ServerStreamPayload | null` to `{ kind: "ok"; value } | { kind: "skip" } | { kind: "malformed"; reason }`. Splits the FOUR null-collapse failure modes (JSON parse fail / root-not-object / unknown envelope `type` / shape mismatch within known type) into two intents: `skip` (forward-compat — silent, e.g. future `{type:"warning"}` envelope) vs `malformed` (genuine shape error — `console.warn`'d). Same drift-hiding pattern as the iframe `relativeImports` cascade. Consumers in `components/FocusEditor.tsx` (2 sites — main read loop + tail flush) updated; `scripts/bench-sse.mjs` mirror updated; 5 new tests in `tests/sse-prod.test.ts §6` (+ 6 existing tests rewritten to assert the new shape) for skip/malformed/ok distinction, kind-discriminator canary, reason-string stability.

2. **Audit F5 — Delete legacy `parseStoragePanelExportJson` null-returning shape** (no test delta — refactor + 2 tests rewritten) — `lib/storage-panel.ts`: collapsed two parser bodies (one returning `T | null`, one returning `{ kind: "ok" | "error" }` with a hand-off back to the legacy for entry validation) into a single `parseStoragePanelExportJsonDetail` that owns the full validation pipeline. Per-entry validation now reports `entries[i].key/value/bytes/category` failure indexes by index. `parseStoragePanelExportJson` deleted; consumers in `StorageHealthPanel.tsx` migrated to derive the success-only preview from `storagePanelImportDetail.kind === "ok" ? .value : null`. Removed import in tests.

3. **Audit F6 — Extract `StoragePanelStateKnobs` shared type** (+3) — `lib/storage-panel.ts`: new `StoragePanelStateKnobs { scope, filter, sort, collapsedOther }` interface near the StoragePanelScope/Sort definitions. `StoragePanelExport.panelState` + `StoragePanelRecentImport.panelState` + `buildStoragePanelExport`'s `panelState` parameter all reference this single shape. Future fields (e.g. `prettyPrint`, `valueTruncation`) automatically propagate to every persisted shape that mirrors live panel state. 3 new tests in §14 lock the round-trip + reject-invalid-knob + multi-knob-default invariants.

4. **Audit F8 — Brand `versionedKey` return type** (+3) — `lib/tree-persistence.ts`: new `DropinTreeKey<Name extends string>` brand (compile-time-only, structurally `string`). `versionedKey<Name extends string>(name: Name): DropinTreeKey<Name>`. Each `versionedKey("depth")` is now distinct from `versionedKey("query")` at the type level. Web Storage APIs accept the brand transparently (structural string). 3 new tests pin the runtime-string-coercion invariant + name-distinctness + determinism.

5. **Audit Domain 5 MED — Demote `describeStoredTreeStateEntries` + `describeAllStoredEntries` exports** (no test delta) — `lib/tree-persistence.ts`: both helpers had no external callers (verified via repo-wide grep). Demoted to internal `function`. Consumers `listStoredTreeStateEntries` / `listAllStoredEntries` reference them locally.

6. **Audit Domain 5 MED — Derive `clearAllStoredStoragePanelPreferences` wipe list** (+3) — `lib/storage-panel.ts`: new `STORAGE_PANEL_PREFERENCE_KEYS` tuple is the single source of truth for the panel-side preference key set. Wipe iterator + `STORAGE_PANEL_CONSTANTS` both reference it. Pre-fix the wipe list was a parallel hard-coded `removeItem(...)` enumeration that could drift from new key additions. 3 new §15 tests verify (a) every `*_KEY` value in the constants surface appears in the wipe tuple, (b) every wipe-tuple entry lives in the dropin namespace, (c) no duplicates.

7. **Audit Domain 2 MED — `stopRewrite` redundant `setLoading(false)` + comment fix** (no test delta) — `components/FocusEditor.tsx`: stopRewrite reduced to `abortRef.current?.abort();`. The `runRewrite` finally block now owns ALL state cleanup symmetrically across stop / network-error / success / completion paths. Pre-fix there was a sub-millisecond window where `loading=false` was visible while the reader was mid-teardown. Comment at the `releaseLock` swallow rewritten — pre-fix it claimed "controller cancel already tore the reader down" which was misleading (releaseLock IS still required; the swallow is for the in-flight-read case only).

8. **Audit Domain 1 LOW — `aOver` algebraic identity in `dropinResolveBgColor`** (no test delta) — `lib/preview.ts`: `aOver = color.a + (1 - color.a)` always equals 1 (alpha-over-opaque convention). Replaced with literal `1` + comment.

9. **Audit Domain 2 MED — Rate-limit response Content-Type for non-streaming clients** (no test delta) — `app/api/llm-rewrite/route.ts`: body parsing now happens BEFORE the rate-limit check. The 429 response Content-Type matches the caller's expected mode — `text/event-stream` for `stream: true`, `application/json` for `stream: false`. Pre-fix the 429 always emitted SSE, breaking the contract for JSON callers (their parser saw `data: {...}` instead of structured JSON).

10. **~14 unused-externally export demotions** (no test delta) — `lib/tree-persistence.ts` (`clearStoredSubtreeDepths`, `parseDragGhostFormat`) + `lib/storage-panel.ts` (`StoredEntryCategorySummary`, `StoredEntriesCategorizedSummary`, `MatchedSubstringSegment`, `CollapsibleAllEntriesViewByCategory`, `StoragePanelCategoryCollapseState`, `StoragePanelSnapshotEntry`, `StoragePanelSnapshotDiffEntry`, `StoragePanelSnapshotDiffChanged`, `StoragePanelSnapshotDiff`, `SharedStoragePanelState`, `parseStoragePanelRecentImports`, `parseStoragePanelRecentImportsSort`, `parseStoragePanelFilterMode`). All verified via repo-wide grep to have no consumers outside their declaring lib file. Public API surface tightened; future renames don't have to worry about external break.

11. **Audit Domain 6 LOW-F7 — Recompute imported `bytes` from key+value length** (+2) — `lib/storage-panel.ts`: `parseStoragePanelExportJsonDetail` now computes `bytes: er.key.length + er.value.length` instead of accepting the JSON-supplied value verbatim. The `bytes` field is derived (every live writer sets `key.length + value.length` per `describeStoredTreeStateEntries` / `describeAllStoredEntries`); accepting it from the import let a tampered export carry an inconsistent value through. The summary recomputation now sums consistent per-entry bytes. Tests: existing tampered-summary test extended to also check per-entry bytes; 2 new tests for multi-entry recompute + empty-string edge case.

**Verified at session close**: tsc 0; vitest **6066/6066** across **103** files (was 6050/103 → +16/+0). bench-sse 53/53 PASS standalone. rate-limit-prod 18/18 PASS. The earlier transient 1-2 fails on `tests/integration/envelope-channel.test.ts` are jsdom timing flakes unrelated to today's changes (existing 1000ms timeout test).

**Audit close-out at this session**: All 5 audit type-design HIGHs (F1/F2/F3/F4/F9) shipped earlier today's morning. Plus 4 audit MED bugs/silent-failures shipped morning. Plus Phase A→F + LibraryModal fully delivered earlier days. **Today's afternoon grind closes the type-design MEDs (F5/F6/F7/F8) + Domain 1/2/5 MEDs + 14 export demotions.** Remaining are LOW items: ElementTree rail-width localStorage swallow (~30 sites — defer, low value), tryFormatJsonValue null indistinguishable, F10 `useCoarsePointer` "lying for one render" (small), F11 provider-delta cascade (deprioritized — server-internal symmetry only), F12 `CompiledFilter` discriminated union (~80 LOC for ~4-line consumer simplification, not worth), ~75 attribution-comment sweep (substance-loss risk, deferred per user). Codebase is fully audit-cleaned; ready for manual testing.

## Current status (2026-05-08 — LibraryModal compat filter + audit F1/F2/F3/F4/F9 + 3 audit MEDs SHIPPED: 6050/103, +90/+3 since 2026-05-07 evening's 5960/100)

**Same-day grind across 10 wins**:
1. **LibraryModal compatibility filter** (+22/+1) — see detailed block below.
2. **Audit F4 schemaVersion tightening** (+15) — `lib/storage-panel.ts`: `StoragePanelSnapshot.schemaVersion: number → 1`; both Export+Snapshot got discriminated-union scaffolds. `STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION = 1 as const`. 15 new invariant tests.
3. **Audit F1 parseRewriteRequest validator** (+35/+1) — extracted to `lib/llm-rewrite-parser.ts` (~100 LOC pure-logic). Replaced unsafe cast at `app/api/llm-rewrite/route.ts:418`. Validator strips attacker-controlled junk (only emits validated fields). 35 prod-import tests.
4. **Audit F2 typed success path** (no test delta — pure type tightening) — `route.ts:458` non-streaming success branch now uses `NextResponse.json<RewriteResponse>(okPayload)`.
5. **Audit F3 assertNever ServerStreamPayload** (no test delta) — `components/FocusEditor.tsx:1104` exhaustive switch + `assertNeverServerPayload` helper. Future variant added to `ServerStreamPayload` (chunk/complete/error) will fail tsc instead of silently dropping.
6. **SSE onApply timing fix** (no test delta) — `FocusEditor.tsx`: complete branch now calls `ac.abort()` + `return` immediately after onApply. Closes the few-hundred-ms gap where canvas was updated but spinner stayed active waiting for TCP FIN. ac.abort() also propagates to server's cancel callback for upstream provider billing stop.
7. **Clipboard rejection silent-failure parity** (no test delta) — `components/StorageHealthPanel.tsx`: both `handleCopyStoragePanel` + `handleCopyStoragePanelPresetUrl` now surface rejection via new `onWarn?` prop. Wired through `components/ElementTree.tsx` (added `onWarn?` prop) and `components/Workspace.tsx` (passes `showWarn`). Closes the 8th of the 7 multi-op handlers fixed in 2026-05-04 audit (this one was missed when StorageHealthPanel was extracted).
8. **Audit F9 ProviderResult discriminated union** (no test delta) — `route.ts:98` from `{ ok: boolean; status: number; text?; error? }` to `{ ok: true; text: string } | { ok: false; status: number; error?: 'network' }`. tsc now enforces the implicit "ok=true implies text defined" invariant.
9. **Domain 1 MED — Duplicate dropin:error postMessage in JSX mode** (no test delta) — `lib/preview.ts:2087-2106`: gated the inspector runtime's `window.error` + `unhandledrejection` listeners on `DROPIN_MODE === 'html'`. Pre-fix, JSX mode had BOTH the inspector handler AND `buildJsxDoc`'s outer-IIFE `showError` handler firing for every uncaught error → duplicate host toasts. Trap caught + recorded mid-fix: backticks inside iframe-runtime template comments collapse the outer TS template literal at parse time (per `memory: project_ts_template_backtick_trap`).
10. **Domain 2 MED — Rate-limit bucket unbounded-growth fix** (+18/+1) — extracted `lib/rate-limit.ts` (~100 LOC pure-logic) with `createRateLimiter({ limit, windowMs, sweepEveryCalls })`. Opportunistic sweep: every Nth `allow()` call walks the Map and deletes expired entries (default sweepEveryCalls=64). Pure-logic `now` parameter so tests drive deterministic time. Route singleton `defaultRateLimiter` preserves the per-process state. 18 prod-import tests cover allow/deny per window, sweep cadence, mixed-state buckets, opts merge, instance independence.

**Verified at session close**: tsc 0; vitest **6050/6050** across **103** files (was 5960/100 → +90/+3). Bundle smoke (curl on user's port 3001): served `_next/static/chunks/app/playground/page.js` shows 14× compatById, 6× fitsOnly, 5× each of `filterAndSortLibrary` / `rootClassName` / `fitReasonsTooltip`, 3× swapEnvelope, 2× each "Fits only" / "won't fit". The route changes (parser/rate-limiter/F2/F9) live server-side and don't surface in the playground bundle (expected).

## Current status (2026-05-08 — LibraryModal compatibility filter + audit follow-ups F1 + F2 + F4 SHIPPED: 6032/102, +72/+2 since 2026-05-07 evening's 5960/100)

**Same-day grind across 4 wins**:
1. **LibraryModal compatibility filter** (5982/101, +22/+1) — see detailed block below.
2. **Audit F4 schemaVersion tightening** (5997/101, +15) — `lib/storage-panel.ts`: `StoragePanelSnapshot.schemaVersion: number → 1`; both Export+Snapshot got discriminated-union scaffolds. `STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION = 1 as const` so the literal flows through builders. 15 new tests in `tests/storage-panel-prod.test.ts §13` covering buildSnapshot stamps + parseSnapshot rejection of `schemaVersion: 99/0/missing/non-numeric` + bytes flooring + non-finite skip + null/malformed-JSON paths.
3. **Audit F1 parseRewriteRequest validator** (6032/102, +35/+1) — extracted to `lib/llm-rewrite-parser.ts` (~100 LOC pure-logic). Replaced unsafe `(await req.json()) as RewriteRequest` cast at `app/api/llm-rewrite/route.ts:418` + the inline 5-block field-guard chain with a parse-don't-validate flow. Validator strips attacker-controlled junk (only emits validated fields). Validation order: provider → apiKey → prompt → elementSource → classes → optional model/stream. RewriteRequest + RewriteProvider types now live in the parser module. 35 prod-import tests in `tests/llm-rewrite-parser-prod.test.ts` cover every reject path + optional-field handling + attacker-junk stripping + validation order + constants pin.
4. **Audit F2 typed success path** (no test delta — pure type tightening) — `app/api/llm-rewrite/route.ts:458`'s non-streaming success branch now uses `NextResponse.json<RewriteResponse>(okPayload)` matching `bad()`'s envelope-type annotation. A future edit that drops `ok: true` or mistypes `classes` fails to compile.

**Verified at session close**: tsc 0; vitest **6032/6032** across **102** files (was 5960/100 → +72/+2). Bundle smoke (curl on user's port 3001 dev server): served `_next/static/chunks/app/playground/page.js` shows 3× swapEnvelope, 14× compatById, 6× fitsOnly, 5× each filterAndSortLibrary / rootClassName for the LibraryModal wiring; the parser/route changes are server-side and don't surface in the client bundle (expected).

## Current status (2026-05-08 — LibraryModal compatibility filter visualization SHIPPED: 5982/101, +22/+1 since 2026-05-07 evening's 5960/100)

**Phase E proper close-out: the deferred Task 2 from the 2026-05-07 evening session shipped end-to-end.** New ingest-pipeline field + Workspace envelope cache + Sidebar/Panel/Grid/Card threading + per-card dim + tooltip + counts chip + "fits only" toggle all in production bundle. Files touched (in order):

1. **`scripts/ingest/extract-root-class.mjs`** (NEW, ~50 LOC pure) — body-level HTML → first top-level Element's `class` attr → string-or-null. parse5 already a dep (used in `scripts/html-to-jsx.mjs`). Skips leading whitespace text nodes / comments. Returns null for empty/missing/text-only input. **Key insight that unblocked Phase E proper** — the `inferCapacityFromClasses` pure-logic analyzer already handles the static-analysis fallback path inside `lookupCapacity`'s 3-tier resolution, so the puppeteer-driven `data/component-capacities.json` is NOT a hard prerequisite. We just need each component's root className surfaced into the index. parse5 string extraction at ingest time + runtime TS analyzer inference is enough.
2. **`scripts/ingest/extract-root-class.d.mts`** (NEW) — type declaration for the .mjs export. Required because tsconfig has `allowJs: false` and the .mjs file lives outside the `**/*.ts` include glob; the bundler-resolution sibling-`.d.mts` lookup picks it up automatically.
3. **`scripts/ingest/uiverse.mjs`** + **`scripts/ingest/hyperui.mjs`** — wire the new extractor into both meta builders. Uiverse style-stripped fragment → first element's class. HyperUI fragment → top-level wrapper's class (typically `bg-white` / `grid grid-cols-…`). One-line additions per file.
4. **`lib/component-library/types.ts`** — `ComponentMeta` gets `rootClassName?: string | null`. Optional for backward-compat with index.json files generated before this field shipped (when absent, every asset classifies as "unknown" = default-allow per `classifyAssets`).
5. **`components/Workspace.tsx`** — added `swapEnvelope: SlotEnvelope | null` state + a useEffect watching `[tool, selection?.oid]` that fetches via `previewHandleRef.current.requestEnvelope(targetOid)` when entering Swap with a selection. Both `swapContext` IIFE blocks (workspace + FocusEditor mount points) now include `slotEnvelope: swapEnvelope`. Cleared on tool exit / selection change. Best-effort: null on iframe not ready / read failure / parent unmeasurable.
6. **`components/library/Sidebar.tsx`** — `SidebarSwapContext` gets `slotEnvelope?: SlotEnvelope | null`. Passed through to `<ComponentsPanel slotEnvelope={...} />`.
7. **`components/library/asset-panels/ComponentsPanel.tsx`** — accepts `slotEnvelope` prop. New `classification` memo runs `filterAndSortLibrary(ids, null, envelope, { fallbackClasses, assetCategories: 'components', strategy: 'compatible-first' })` against `filtered` (the search/category/source filtered set). New `compatById` Map for grid prop. New `sortedFiltered` memo re-orders `filtered` per the classification's compatible-first ordering. New `fitsOnly` toggle state + `visibleList` filter. Header chip reads "{N} fit · {U}?" with per-bucket tooltip. Pagination switched from `filtered` to `visibleList`. Empty state surfaces "No components fit this slot" when fitsOnly is the cause; Reset filters also clears fitsOnly.
8. **`components/library/ComponentGrid.tsx`** — accepts `compatById?: ReadonlyMap<string, AssetCompat> | null`. Forwards `compat={compatById?.get(c.id) ?? null}` to each card.
9. **`components/library/ComponentCard.tsx`** — accepts `compat` prop. Article-level wrapper applies `opacity-50 grayscale` for incompatible / `ring-1 ring-coral/40` for compatible. Title attr surfaces `fitReasonsTooltip` output (e.g. `"Won't fit: needs ≥ 320px width"`). Two new badges: `"✕ won't fit"` for incompatible, `"?"` for unknown.

**Tests (TDD: tests-first, all green):**
- **`tests/extract-root-class-prod.test.ts`** (NEW, 22 cases) — single-root happy paths, verbatim whitespace, nested children (only root read), void elements (`<input class="…" />`), leading whitespace + comments + multi-sibling first-wins. Null fallback paths: empty / null / undefined / non-string / no-class / empty-class / text-only / whitespace-only / comments-only. Real-world Uiverse + HyperUI shapes. Malformed-input tolerance (no throw on garbled input).

**Verified at close-out**: tsc 0; vitest **5982/5982** across **101** files (+22/+1 since 2026-05-07 evening 5960/100). Bundle smoke (curl on user's port 3001 dev server): served `_next/static/chunks/app/playground/page.js` contains 15 hits for `slotEnvelope`, 14 for `compatById`, 6 for `fitsOnly`, 5 each for `filterAndSortLibrary` / `rootClassName` / `fitReasonsTooltip`, 3 for `swapEnvelope`, 2 each for `Fits only` / `won't fit`, 1 for `AssetCompat` type. All wiring shipped to production bundle.

**User-visible behavior**: when user enters Swap mode with a selected element, the LibraryModal opens with the Components panel showing a "{N} fit · {U}?" chip in the header and a "Fits only" checkbox. Compatible cards land first with a subtle coral ring; incompatibles dim to 50% opacity + grayscale + show a "✕ won't fit" badge with hover tooltip (`"Won't fit: needs ≥ 320px width; aspect ratio 1.50 vs slot's 0.75 (50% drift)"`). Unknown cards (no rootClassName signal in index — happens when index was generated pre-this-field) show "?" badge. Toggling "Fits only" hides incompatibles entirely; resetting filters also clears it. **NB**: until the user re-runs `node scripts/ingest-components.mjs --no-thumbs`, the existing `public/data/components/index.json` lacks `rootClassName` and every card classifies as "unknown" — the chip will read "0 fit · {N}?". Re-running the ingest is the only step needed to flip on the full UX.

## Current status (2026-05-07 evening — Phase E proper UI/wiring + Phase F proper UI/wiring SHIPPED: 5960/100, +41/+5 since the PM 5919/95 close-out)

**Evening grind delivered the user-visible swap UX upgrade. New iframe envelope channel + Workspace handleSwap rewrite + Phase F everywhere-mode preflight all in the production bundle.** Files touched (in order): (1) `lib/iframe-bridge.ts` — added `dropin:get-envelope` (host→iframe) + `dropin:envelope-result` (iframe→host) message variants + exhaustiveness-list update + `EnvelopeReadback` payload interface (parent's CSSOM-shaped fields ready for `parentBoxFromRect` + child's bbox for drift-baseline). (2) `lib/preview.ts` — added `dropinComputeEnvelope(oid)` runtime function (mode-agnostic; reads parent rect + computed style + child rect; returns null when oid missing or no parentElement) + the request handler in the message router. (3) `components/Preview.tsx` — added `requestEnvelope(oid): Promise<EnvelopeReadback | null>` to `PreviewHandle` + correlated request/response infrastructure (pendingEnvelopeRef + nextEnvelopeIdRef + on-rebuild flush + result router) + onReady wiring. (4) `components/Workspace.tsx` — added `previewHandleRef` + `handlePreviewReady` + `<Preview onReady={handlePreviewReady} />` + completely rewrote `handleSwap` (now async): pre-swap envelope read for active selection → `applySwapWithFit` orchestrator (atomic single-source mutation = single undo entry for swap+fit) → post-swap drift toast (700ms after setCode, best-effort, null readback skips). Added Phase F everywhere-mode branch: when `propagationMode === "everywhere"` + capitalized tag, resolve def (inline → cross-file fallback) → fetch all instance envelopes in parallel → call `planEverywhereSwap` → on `ok` build multi-file Edit + commit via `applyEditDirect`; on `abort-preflight` showWarn + setTool("select") + return; on `abort-bail` showWarn + setTool + return; on `skip` falls through to single-instance flow.

**5 new pure-logic modules + helpers landed alongside (TDD: tests-first, all green):**

1. **`lib/ast/read-class-by-oid.ts`** — exports `readJsxClassByOid(source, oid)` (read className-or-class string-literal, null on miss/expression/parse-fail) + `readAssetRootClass(jsxAssetText)` (parses fragment-wrapped asset, returns first top-level JSXElement's className). 19 prod-import tests across two test files.
2. **`lib/swap/swap-with-fit.ts`** — pure orchestrator composing `applySwap` + `readJsxClassByOid` + `applySwapFit` + `patchJsxClassByOid`. Returns `{ unchanged, source, swappedOid, fitChanges, fitApplied }`. Atomic single-source-mutation contract (no half-state). 9 prod-import tests.
3. **`lib/swap/plan-everywhere-swap.ts`** — Phase F orchestrator. Composes `findInlineComponentDefRootOid` (in-file fallback) + `findCrossFileDefinition` (cross-file resolution) + `findAllInstancesOfDefinition` + `preflightSwapAcrossInstances` + `applySwap` (with `allowRootSwap: true`) + `createEdit`. Returns 4 plan kinds: `skip` (caller falls through to single-instance) / `abort-preflight` (envelope failure or missingEnvelope, atomic abort per Q10) / `abort-bail` (applySwap failed) / `ok` (multi-file Edit ready for `applyEditDirect`). 8 prod-import tests covering all 4 outcomes + inline-vs-cross-file def resolution + multi-page proxy missingEnvelope abort.
4. **`lib/ast/operations/swap.ts`** — added `allowRootSwap?: boolean` opt to `SwapOperation`. Bypasses the "Can't swap the root element" bail for the def-root replacement use case. Default `false` keeps single-instance flow's existing safety net intact. Existing 35 swap tests unchanged.
5. **`tests/integration/envelope-channel.test.ts`** — first integration test for the new request/response pair via jsdom. Validates: response keyed by requestId; non-null result with parent + childRect shape; null result for missing oid; parallel queries don't collide; documentElement returns null (no parentElement). 5 cases.

**Bundle smoke (curl on user's port 3001 dev server)**: served `_next/static/chunks/app/playground/page.js` contains 6 hits each for `requestEnvelope` / `composeEnvelopeFromBbox` / `assessBboxDrift` / `everywhere-swap`, 5 hits each for `applySwapWithFit` / `readJsxClassByOid`, 4 each for `readAssetRootClass` / `planEverywhereSwap`, 3 each for `dropin:get-envelope` / `dropin:envelope-result` / `allowRootSwap`, 2 each for `dropinComputeEnvelope` / `handlePreviewReady`. All wiring in production bundle, not just source.

**What's left to ship the FULL Phase E proper experience**: ✅ **SHIPPED 2026-05-08** — see top status block. The two deferred Tasks 2 + ingest-pipeline extension turned out to share a cleaner solution than originally planned: the static-analysis fallback in `lookupCapacity`'s 3-tier resolution doesn't need the puppeteer-driven `data/component-capacities.json` JSON file at all. We just expose each component's root className as a new `ComponentMeta.rootClassName` field at ingest-time (parse5 string extraction in `scripts/ingest/extract-root-class.mjs`, ~50 LOC pure), and the runtime TS analyzer infers capacity at modal-open time. No `.mjs ↔ TS` build-step issue. No puppeteer. User runs `node scripts/ingest-components.mjs --no-thumbs` once and the full UX flips on.

## Current status (2026-05-07 PM — Phase E-proper pure-logic + Phase F foundation SHIPPED on top of A.1 + A.2 + audit F4 + B.1 ops + B.1 history + B.2 + C-1 + C-2 + C-3 e2e + Phase D-foundation + Phase D-proper Workspace wiring + Phase E-foundation slot-capacity: 5919/95, +297/+8 since 2026-05-07 morning's 5622/87 close-out)

**Same-day post-resume grind shipped 8 new pure-logic modules covering Phase E proper (the user-visible swap dimension matching) and Phase F foundation (cross-instance preflight check):**

1. **`lib/swap/swap-fit.ts`** (45 tests, ~220 LOC) — auto-fit transformation. Three conservative repair rules applied to a swapped element's classNames: (1) `w-[Npx]` overflow → `w-full`; (2) height under-fill is no-op (vertical rhythm tolerates more drift); (3) AR drift > 10% → `aspect-[X.YY/1]` matching slot. Operates on className string + envelope, returns new classes + change list. `summarizeSwapFitChanges` composes the warn-toast message. Breakpoint-prefixed classes (`md:w-[800px]`) left alone — they represent intent at a different breakpoint than the slot envelope's anchor.
2. **`lib/swap/capacity-from-source.ts`** (86 tests, ~320 LOC) — DOM-free static capacity inference. Detects fill/fit-content/fixed flexBehavior + extracts min/max width/height bounds from class names. Handles arbitrary-px (`w-[800px]`), arbitrary-rem (`min-w-[20rem]` → 320px via 16px base), AND the full Tailwind 3.4 named scale: spacing (`w-80` = 320px), max-width sizes (`max-w-md` = 448px, `max-w-7xl` = 1280px, `max-w-prose` = 520px, `max-w-screen-lg` = 1024px). Source = "user-extracted" so consumer knows it's heuristic vs measured. Used as fallback when ingest-pipeline JSON doesn't yet exist or for "Make Component" assets (Phase G).
3. **`lib/swap/capacity-loader.ts`** (38 tests, ~220 LOC) — Pure JSON parser for `data/component-capacities.json`. Schema-versioned via phantom-typed `schemaVersion: 1` literal (audit F4 lesson reapplied at v1). Validates every record's category/flexBehavior/source/intrinsic shape; rejects duplicate assetIds; surfaces error message with record index. `lookupCapacity` does 3-tier resolution: records → static analysis → null. `serializeCapacityFile` round-trips with bytewise-sorted assetIds for deterministic git diffs.
4. **`lib/swap/bbox-drift.ts`** (29 tests, ~130 LOC) — Post-swap drift assessment. Compares pre/post bboxes, returns `ok: false` + axis-specific message when either dimension drifts beyond 10% (Figma's published instance-swap behaviour threshold). Symmetric for grow vs shrink. Handles null/zero-dimension/Infinity inputs defensively. `failOnZeroDimension` opt for strict callers. Format: `"Layout shifted: width 320px → 800px (150% drift); height ..."`
5. **`lib/ast/instance-graph.ts`** (21 tests, ~350 LOC) — Phase F foundation. Inverse of cross-file-query: given (defFileId, defRootOid), walks every project file's AST and returns the call sites that resolve to this definition. Identifies which export(s) wrap the OID by subtree-contains-oid check; tracks local binding names per file's import (default + named + alias-importer + alias-exporter all supported); also detects in-file calls (`<Card />` inside the same file's other functions). Returns `defExports[]` so caller knows the canonical name(s). Bails on parse errors of OTHER files (best-effort).
6. **`lib/swap/envelope-from-bbox.ts`** (34 tests, ~130 LOC) — Pure helper composing a `SlotEnvelope` from iframe-side bbox + computed style snapshot. `parseCssAspectRatio` handles `auto` / `"16 / 9"` / `"1 / 1"` / `"1.5"` (single-number) / malformed → null. `parentBoxFromRect` subtracts padding + border from rectWidth/rectHeight (border-box → content-box). `composeEnvelopeFromBbox` clamps negative content dims to zero (degenerate parent collapsed-box case).
7. **`lib/swap/preflight.ts`** (19 tests, ~150 LOC) — Phase F composition module. `preflightSwapAcrossInstances(project, defFileId, defRootOid, newCapacity, envelopeFor)` walks every instance via instance-graph + checks each via slotCapacityFits. Returns either `{ ok: true, instances, okCount }` (atomic green light) OR `{ ok: false, failures, okInstances, missingEnvelope, topLevelReason? }` (per Q10: caller hard-aborts the multi-instance swap atomically). `summarizePreflightResult` composes a toast: `"3 of 5 instances fit. Failures: oid-foo (≥ 320px)..."` Caller-provided envelopeFor returns null when iframe can't measure (call site not currently rendered) — tracked in `missingEnvelope` bucket.
8. **`lib/swap/library-filter.ts`** (25 tests, ~200 LOC) — Pure decision layer for LibraryModal grid. `classifyAssets(assetIds, records, envelope, opts)` classifies each as compatible/incompatible/unknown; preserves input id order. `sortClassifiedAssets` reorders compatible→unknown→incompatible (stable within bucket). `filterAndSortLibrary` is the convenience wrapper: returns sorted array + counts (`"142 of 500 fit"`). `fitReasonsTooltip` composes the per-asset hover text. The 3-tier resolution from capacity-loader composes through here automatically — records hit → static-analysis fallback → unknown (default-allow).

**Cumulative across both 2026-05-07 sessions**: 5919/95 (was 5412/77 at A.1 baseline → +507 tests / +18 files). The pure-logic universe of Phase A through Phase F foundation is now COMPLETE. What remains for shipping Phase E proper + Phase F: UI wiring (LibraryModal filter chip + dim + tooltip), iframe envelope-channel (parent rect + computed-style postMessage), Workspace swap-handler integration, and the puppeteer-driven ingest pipeline run. None of those need new pure-logic modules.

## Current status (2026-05-07 — earlier same-day baseline pre-PM-grind: 5622/87)

Phase 1–5 of the manipulation system shipped. Phase 6 panel polish ran 26 chunks (39th–42nd passes) before the user called out unsustainable bloat. **Full audit + cleanup landed 2026-05-04**. Three sessions on 2026-05-05: morning shipped **§5(b) AI rewrite SSE streaming + doc-drift sweep + first prod-import surge** (7 files / ~188 cases) + iframe cascade root-cause fix. Afternoon shipped the **mobile/touch gestures HIGH backlog item** + **second prod-import surge** (4 files / +114 cases). Evening shipped the **third prod-import surge** (2 files / +101 cases). 2026-05-06 shipped the **fourth prod-import surge** (3 files / +110: contrast 37, canvas-range 22, swap-category-hint 51), **fifth prod-import surge** (7 files / +205: style-source-read 16, scope 14, component-def 20, patch-class-by-oid 20, query 30, tailwind-palette 47, style-presets 58), **sixth prod-import surge** (1 file / +61: tree-dnd 61 — the largest remaining lib/ast module at 609 LOC, covering both `resolveTreeDrop` and `resolveTreeDropMulti`), **seventh prod-import surge** (5 files / +194: fonts 15, palettes 25, source-patch-html 32, patterns 61, tailwind-slider-maps 61 — sweeps the lib/ tier including HTML byte patcher + pattern/gradient class builders + Tailwind scale registry), and **eighth prod-import surge** (5 files / +233: spacing 11, asset-library 79 covering 10 build* helpers, component-library 18 scope+insert, sse 54, storage-panel 71 covering 12+ pure-logic surfaces — sweeps the asset-library + component-library + storage-panel tier). Net cumulative since 2026-05-04 baseline: **+1024 vitest tests / +28 files** (4317/47 → 5341/75). Pure-logic-via-prod-import coverage now spans **34 files / ~1212 cases** — highest-quality signal in the suite per audit `02-tests.md`. All major lib/ pure-logic surface is now covered.

### Decisions locked (2026-05-06 post-bench-cleanup, pre-manual-test audit)

- **Pure-logic prod-import surge series CLOSED**: 8 surges over 2 days, 34 files / ~1212 cases, all major `lib/` pure surface covered + the lone localized drift fixed. Marginal value of further pure-logic test coverage is low. No more surges.
- ✅ **jsdom devDep ADDED 2026-05-07** + first integration test shipped (`tests/integration/iframe-click-to-select.test.ts`, 6 cases). HTML mode + `runScripts: 'dangerously'` exercises the real `inspectorRuntimeJs` (~700 LOC: click handler / target resolver / message router / serializer / breadcrumb walker) against a real DOM, not mocks. Covers: dropin:ready emission on mount, dropin:tree snapshot, click→select payload contract (tag/loc/classes/breadcrumb/text/hasOnlyTextChildren), DROPIN_TOOL='view' bail (regression test for 2026-05-06 audit fix #3), nested-element dropinResolveTarget walk, Escape→dropin:clear-selection. Offline (withTailwind:false skips CDN), <1s wall-clock. Tests-only devDep, NOT a locked-stack violation. **JSX mode click-to-select is the natural follow-up** — needs CDN-script stubs (React/ReactDOM/Babel UMDs) to run in jsdom; deferred until something forces it.
- **(c) Multi-file component-instance propagation DEFERRED** to spec-design pass per `maniuplation.md` §4.5 — gate is yours to open whenever ready.
- **LOW-backlog DEFERRED**: ~75 attribution-comment strip (substance-loss risk) + ~20 export demotions (some now imported by prod-import tests, can't blanket-demote). Clutter, not progress.
- **Pre-manual-test audit COMPLETE** (2026-05-06): 6 parallel specialized agents (4× `feature-dev:code-reviewer` on iframe-runtime / SSE / mobile-touch / storage-extraction; `pr-review-toolkit:silent-failure-hunter` repo-wide; `pr-review-toolkit:type-design-analyzer`). 44 findings total (HIGH=10, MED=20, LOW=14). **9 fixes shipped this session**: (1) `lib/preview.ts:2174` `extractTailwindConfig` `</script>` injection guard — escapes via `<\/script>` (HTML-parser-safe, JS-string-equivalent); (2) `lib/preview.ts:2198` same guard for `extractTailwindCssStyles` JSX-form `</style>` injection; (3) `lib/preview.ts:1881` `dblclick` handler now gates on `DROPIN_TOOL === 'select'` — view-mode clicks no longer hijacked; (4) `lib/preview.ts:1487/1501` `dropinHoverPreview/Clear` querySelectors now use `dropinCssEscape(id)` matching `dropinFindByOid`; (5) `components/SelectionOverlay.tsx:1119` tool-switch effect now calls `teardownRef.current?.()` so the 8 window/document listeners actually release (was leaking O(8) listeners per tool-switch since they only became inert via `gestureRef` null-gate, not removed); (6) `components/ElementTree.tsx:1140` `onRowPointerDown` now calls `setPointerCapture` matching the rail-width pattern — fast touch-drag past row bounds no longer drops the pointer stream; (7) `app/globals.css:137-145` slider thumb 32→44px (Apple HIG / Material) + recentered `margin-top: -20px`; (8) `components/Workspace.tsx:1241-1262` `handleTreeDndMixed` cross-parent loop now tracks bailCount + showWarn — was the missing 8th of the audit-2026-05-04 multi-op fixes (mixed-multi handler was 29th-pass, post-audit); (9) `app/api/llm-rewrite/route.ts:236-362` upstream-provider AbortController threaded through `fetchOpenAIStream`/`fetchAnthropicStream` and aborted from `cancel()` — was a real billing leak (client disconnect didn't stop upstream tokens). Plus `console.error` in `start()`'s catch distinguishing client-disconnect from genuine stream failures. **Verified**: tsc 0, vitest **5341/5341** unchanged across 75 files. **Skipped (over-claimed)**: agent flagged FocusEditor `runRewrite` early-return paths as HIGH "loading=true leak" but careful tracing showed `stopRewrite()` already clears state pre-AbortError; the catch's `return` is correct. **Deferred to follow-up**: 3 type-design HIGHs (F1 `parseRewriteRequest` validator, F2 typed `RewriteResponse` for streaming/non-streaming, F4 phantom-typed `schemaVersion`) — refactors not bugs. The remaining MED/LOW items are documented in agent reports above for future sessions.

- **Audit conclusion**: codebase is hardened for manual testing. Real bugs fixed: 2 srcdoc-corruption injection vectors (script + style), 1 tool-isolation regression (dblclick), 1 listener leak (tool-switch), 1 billing leak (upstream-fetch abort), 1 silent-bail UX gap (mixed-multi handler), 1 querySelector encoding inconsistency (hover preview), 1 touch-drag pointer drop, 1 sub-tap-target slider thumb. None of these were bench-detectable — all were behavior-of-handlers / cleanup-on-unmount / encoding-of-untrusted-input issues that pure-logic test coverage would never have caught.

- **Audit reports**: `audit-2026-05-04/` — 7 reports (architecture, tests, silent failures, code quality, doc drift, tools/runtime, synthesis). **Read `audit-2026-05-04/00-synthesis.md` first** before continuing any work.
- **Refactors shipped**: `components/StorageHealthPanel.tsx` extracted (2803 LOC) — `ElementTree.tsx` dropped 7077 → 3795 LOC. `lib/storage-panel.ts` extracted (2144 LOC) — `lib/tree-persistence.ts` dropped 3358 → 1248 LOC.
- **Bug fixes (2026-05-04 audit cleanup)**: `predictStoredTreeStateBytes` purity violation (cap now a parameter); 4 silent UX failures (relative-import strip in `lib/preview.ts` now throws clear error; clipboard rejections in `Workspace.tsx` now showWarn; 7 multi-op handlers now surface partial-bail count + reason).
- **Bug fixes (2026-05-06 pre-manual-test audit)**: 9 fixes across 6 files. (1) `lib/preview.ts:2174` `extractTailwindConfig` `</script>` injection guard via `<\/script>` (HTML-parser-safe, JS-string-equivalent). (2) `lib/preview.ts:2198` same guard for `extractTailwindCssStyles` JSX-form `</style>`. (3) `lib/preview.ts:1881` `dblclick` gates on `DROPIN_TOOL === 'select'` (no more hijacking view-mode clicks). (4) `lib/preview.ts:1487/1501` `dropinHoverPreview/Clear` use `dropinCssEscape(id)` matching `dropinFindByOid`. (5) `components/SelectionOverlay.tsx:1119` tool-switch effect calls `teardownRef.current?.()` (was leaking O(8) window/document listeners per tool-switch since the previous code only inerted them via gestureRef-null-gate, never removed). (6) `components/ElementTree.tsx:1140` `onRowPointerDown` calls `setPointerCapture` matching the rail-width pattern (touch-drag past row bounds no longer drops the pointer stream). (7) `app/globals.css:137-145` slider thumb 32→44px (Apple HIG / Material 44pt) + `margin-top: -20px` recenter. (8) `components/Workspace.tsx:1241-1262` `handleTreeDndMixed` cross-parent loop tracks `bailCount` + `firstBailReason` + `showWarn` — was the missing 8th of the 7 multi-op handlers fixed in the 2026-05-04 audit (the mixed-multi handler was 29th-pass, post-audit). (9) `app/api/llm-rewrite/route.ts:236-362` upstream-provider `AbortController` threaded through `fetchOpenAIStream`/`fetchAnthropicStream`; `cancel()` calls `upstreamAc.abort()` — closes a real billing leak (client disconnect didn't stop OpenAI/Anthropic generation). Plus `console.error` in `start()`'s catch distinguishing client-disconnect from genuine stream failures.
- **Patch bump**: `next` 14.2.33 → 14.2.35 (latest in locked 14.2.x — does NOT lift the open advisories; 16.x bump would, but violates locked stack).
- **Phase 5 §5(b) AI rewrite SSE streaming (2026-05-05)**: `lib/sse.ts` (pure SSE primitives, ~145 LOC) + streaming variant in `app/api/llm-rewrite/route.ts` (gated on `stream: true`; legacy JSON path preserved) + `AIRewriteSection` in `components/FocusEditor.tsx` rewritten to consume the stream with live partial-text preview + Stop button + AbortController on unmount. Bench `scripts/bench-sse.mjs` 53/53. Runtime smoke confirms route emits `data: {"type":"error",...}` SSE frames with correct envelope shape.
- **Doc-drift sweep (2026-05-05)**: `phase5-tools-isolation.md:3` updated to SHIPPED with §5(b) note; `plan.md`, `phase1.md`, `phase2.md` got ARCHIVED headers (don't trust their pins/status — frozen at v1-ship); `CLAUDE-archive.md:286` `DiceBar.tsx` reference replaced with `ToolBar.tsx`.
- **Production-import test surge (2026-05-05)**: 7 new test files import lib functions directly instead of going through the `runBench` subprocess + inlined-mirror path. ~188 new direct-import test cases covering: `applyResize` (14), tree-persistence pure helpers (85), `applyStyleProps` (17), `applyDelete` + `applyDuplicate` (17), `applyInsertChild` + `applySwap` (16), `applyReorder` + `applyReparent` + `applyPalette` (17), `source-patch-jsx` byte patcher (22: jsxSpans, patchJsxClass, patchJsxAttr, patchJsxRemoveAttr, patchJsxText, isClassNameDynamic, extractJsxElement, duplicateJsxElement, deleteJsxElement). The benches still inline their own copies (audit's "import benches from production" refactor still on MEDIUM backlog), but production code now has independent test signal — drift between the bench's inlined mirror and the actual lib will be caught here.
- **Dead-code + audit Issues 1, 3, 8, 11, 14, 15 cleared (2026-05-05)**: `partitionAllEntriesByOtherCollapse` + `CollapsibleAllEntriesView` deleted (Issue 11). `measureStoredTreeStateBytes` deleted (Issue 1 — audit-confirmed never called; superseded by `predictStoredTreeStateBytes`). `clearStoredDepth` + `clearStoredQuery` demoted from `export` (Issue 3 — only called by composite `clearAllStoredTreeState`). `ElementTree.tsx` file header rewritten (Issue 8) + stale "eighteenth pass" reference removed (Issue 15). All `measureStoredTreeStateBytes` mentions in docblocks/comments scrubbed across 4 files. `predictStoredTreeStateBytes` purity violation was already fixed in audit cleanup (Issue 14). ~5 representative chunk-attribution comments stripped from `ElementTree.tsx`; ~75 remain (full sweep deferred to avoid substance-loss risk).
- **Iframe cascade root-cause fix (2026-05-05)**: `lib/preview.ts processModuleSyntax` had two early-return paths (Babel.parse missing + parse-error catch) returning a partial shape missing `relativeImports`. Caller's `processed.relativeImports.length` threw `TypeError: Cannot read properties of undefined`, masking the real error (Babel UMD CORS flake OR template parse error). Fixed by adding `relativeImports: []` to both bail paths. User confirmed working. Trap recorded in `memory/project_iframe_processed_field_cascade.md`.
- **Mobile/touch gestures (2026-05-05 afternoon)**: HIGH backlog item closed. Three pieces:
  - **ElementTree gesture lifecycle compliance** — both pointerdown sites (tree drag + rail-width drag) now register the full `pointermove + pointerup + pointercancel + lostpointercapture + keydown(Esc) + blur + visibilitychange` listener set per spec line 1188-1196. Closes the #1 stuck-drag bug class (alt-tab mid-drag, browser drag-and-drop hijack).
  - **44×44 touch hit areas on canvas handles** — new `lib/touch.ts` (~50 LOC) exports `useCoarsePointer()` (matchMedia hook) + `hitAreaFor(visualPx, coarse)`. SelectionOverlay's resize / move / spacing handles now grow hit areas 16/28→44 on coarse pointers via `Math.max`; visual sizes unchanged. Spacing handles also bypass cursor-proximity gating on coarse since touch can't hover. Prod-import test at `tests/touch-prod.test.ts` (6 cases). Spec ref: maniuplation.md line ~377.
  - **Iframe-side touch tap** — `lib/preview.ts` migrated `addEventListener('mousemove', ...)` → `pointermove` and `mouseleave` → `pointerleave`. Touch slide-tap now updates hover preview during slide; click handler unchanged (click fires on tap natively). Confirmed via curl: served `playground/page.js` chunk has 0 `mousemove` / 1 `pointermove`.
  - **Cover technique was already wired** — Preview.tsx:956-959 `setIframePointerEventsDisabled` toggles `frame.style.pointerEvents='none'` during gestures; all 3 binding sets (resize/spacing/move) wire it; cleanup at SelectionOverlay:1136-1142 restores on tool change. Spec-compliant per maniuplation.md line 1175-1181.
- **Second prod-import surge (2026-05-05 afternoon-extension)** — 4 more lib/ast modules covered: `tests/flip-prod.test.ts` (16, detectDrift + FLIP_THRESHOLD_PX), `tests/gesture-math-prod.test.ts` (44, applyElasticDim/captureAspect/computeDims/computeSpacing + corner/edge/handleAxes + Alt mirror + Shift aspect-lock + ELASTIC_COEFFICIENT), `tests/intent-resolver-prod.test.ts` (31, resolveResizeIntent flex-basis detection + spacing handle helpers + basisToStyleProp), `tests/oids-prod.test.ts` (23, makeOid determinism + injectOids idempotency + stripOids round-trip). +114 prod-import tests total across these 4 files.
- **Mobile slider/segmented/color-chip CSS @media overrides (2026-05-05 afternoon)** — `app/globals.css` got `@media (pointer: coarse)` rules for `.dropin-slider` (thumb 16→32, h-5→h-11 to give the bigger thumb room), `.seg-btn` (min-h-44 + py-2.5 + larger text), `.dropin-color` (h-7 w-10 → h-11 w-14). Visual identity preserved on desktop; touch users get tap-friendly controls.
- **Third prod-import surge (2026-05-05 evening)** — 2 more lib/ast modules covered: `tests/snap-prod.test.ts` (44, snap algorithm with hysteresis-in/out + acquire + steal + grid fallback + tie-break by KIND_PRIORITY + buildResizeCandidates per-axis edge math + buildSpacingCandidates kind labels), `tests/constraints-prod.test.ts` (57, evaluateSoftConstraints all 5 categories + relativeLuminance + contrastRatio sRGB→linear→luminance + compositeRgba alpha math + parseRgbColor + wcagThreshold large-text rules + canonical warning order). +101 prod-import tests this surge.
- **Verified (2026-05-05 evening close-out)**: tsc 0, 40 benches green, vitest **4538/4538** across 54 test files (was 4317/47 baseline → +221/+7 across the day: touch-prod 6 + flip-prod 16 + gesture-math-prod 44 + intent-resolver-prod 31 + oids-prod 23 + snap-prod 44 + constraints-prod 57), runtime smoke clean on 3000 — `/`, `/playground`, `/gallery` all 200; iframe pointermove migration confirmed via served-bundle curl inspection.
- **Fourth prod-import surge (2026-05-06)** — 3 more lib modules covered direct prod-import (no production code touched, pure additive test coverage):
  - `tests/contrast-prod.test.ts` (37): `parseHexFlexible` 3/6/8-digit + alpha-over-white compositing + invalid-input rejection; `relativeLuminance` (WCAG sRGB coefficients, mid-gray 0.21586 for #808080); `contrastRatio` (21:1 black/white, symmetric, formula lock); `wcagBucket` (AAA/AA/AA Large/Fail with inclusive lower bounds); `wcagSummary` — **only signal in suite** since bench omits it (label format `TIER · X.XX:1`, cross-checked vs primitive composition).
  - `tests/canvas-range-prod.test.ts` (22): `collectCanvasShiftClickRangeOids` DFS flatten order, range inclusivity (clicked-first, anchor-included, symmetric direction, same-oid no-op), non-OID-node skip, missing-oid fallthrough (returns `[]`), cross-subtree + ancestor↔descendant ranges, output shape invariants (no clicked-duplicate, exact range size).
  - `tests/swap-category-hint-prod.test.ts` (51): `inferSwapCategory` TAG_HINTS lookup (form/control/layout/media/svg), tag-and-class case insensitivity, tag-wins precedence, CLASS_HINTS regex anchoring (`card`/`card-*`/`*-card` matches; `discard`/`card_foo`/`my-card-extras` rejected), all category mappings (modals, alerts, badges, breadcrumbs, tabs, stats, loaders, switches, accordions, dropdowns, tooltips, pricing, pagination), btn/button/lucide/heroicon/fa/fas/far/fab/bi class fallback, first-match-wins iteration order, null/empty/non-Array input handling, `SWAP_CATEGORY_HINT_CONSTANTS` table-size canary (TAG_HINT_COUNT=14, CLASS_HINT_COUNT=33).
- **Verified (2026-05-06 close-out)**: tsc 0, 40 benches green via vitest bridge, vitest **4648/4648** across 57 test files (+110/+3 from 2026-05-05 evening). No runtime smoke needed — no production code changed.
- **Fifth prod-import surge (2026-05-06 evening)** — 7 more lib modules covered direct prod-import (no production code touched, pure additive test coverage). Sweeps the major remaining MEDIUM-backlog uncovered modules:
  - `tests/style-source-read-prod.test.ts` (16): `readSourceStyle` from JSX `style={{...}}` — string/numeric literals, identifier/string-literal keys, multi-prop source order, all bail paths (parse fail, oid not found, no-style-attr, string style attr, identifier expression, function-call expression), value-type filtering (template literals + spread + computed identifiers skipped). **Bench-omitted module — prod-import is the only signal.**
  - `tests/scope-prod.test.ts` (14): `collectDescendantOids` DFS pre-order subtree walk — root-only, deep nesting, scope-from-non-root, intermediate non-OID elements walked through, fragments walked through, sibling isolation, first-occurrence on duplicate-OID. **Bench-omitted.**
  - `tests/component-def-prod.test.ts` (20): `findInlineComponentDefRootOid` — 4 supported shapes (function decl, arrow expr body, arrow block body, function expression), exports (`export function/default/const`), fragment root (FIRST inner JSXElement returned), naming conventions (lowercase rejected, empty rejected), bail paths (no def, returns null/string, no return, root w/o OID), multi-definition disambiguation. **Bench-omitted.**
  - `tests/patch-class-by-oid-prod.test.ts` (20): `patchJsxClassByOid` — overwrite/no-change/insert/remove paths, expression-className bail (`{...}` / `{cn(...)}`), oid-not-found, parse-fail, quote escaping (`&quot;`), multi-class verbatim whitespace preservation, multi-element scope. **Bench-omitted.**
  - `tests/query-prod.test.ts` (30): `buildIndex` AstIndex contract — `findById`/`parent`/`children`/`siblings`/`ancestors`/`all()` covered with edge cases (root null parent, leaf empty children, only-child empty siblings, root [] ancestors, fragments layout-invisible, JSXMemberExpression `Card.Header` tag formatting, nested `A.B.C`, parse-fail empty-shell index). **Surfaced a real quirk**: duplicate-OID first-occurrence wins for the entry, but second-dup's children still link to the FIRST dup's `childrenOids` because `childParent = myOid ?? parentOid` is set BEFORE the `map.has(oid)` skip-create check — exactly the kind of thing prod-import catches that bench inline-mirror would not. **Bench-omitted.**
  - `tests/tailwind-palette-prod.test.ts` (47): pinned-Tailwind-3.4 hex map (244 entries: 22×11 families/shades + black + white; locked canaries: slate-500=#64748B, sky-500=#0EA5E9; uppercase-format invariant; full coverage check), `parsePaletteClass` (all 16 supported prefixes, opacity slash captured, transparent/current/inherit fallback, arbitrary-hex `bg-[#abc]` rejected, unknown families/shades rejected), `findPaletteClass` (first-match by prefix), `closestPaletteName` (squared-RGB distance, exact-match=0, 1-byte-off=1, lowercase + 3-digit + 8-digit hex inputs, invalid null), `nearbyPaletteName` (default + custom + zero thresholds). **Bench-omitted.**
  - `tests/style-presets-prod.test.ts` (58): `STYLE_PRESETS` 4-category structure (Button×4, Card×3, Heading×3, Input×2 with locked match-tag lists; globally-unique ids), `getPresetCategoriesForTag` (case-insensitive tag→category), `isPresetStripClass` (full strip-rule coverage: bg/border/rounded/shadow/p?/text-color/text-size/font/tracking/leading/decoration/underline/italic/display/items/justify/content/place/gap; preserved: text-alignment, w/h/m sizing, relative/absolute), `applyPreset` + `applyPresetVariant` (append + strip + dedup + alignment-preserved + non-mutating + idx-clamping), `presetVariantCount`/`presetVariantClasses` invariants, `inferShapeForTag` fallback to "card", `extractPresetClasses` keep-strip-domain-only, `customToStylePreset` `custom:`-prefix + shape preserved, `loadCustomPresets`/`saveCustomPresets` SSR-safety in node env. **Bench-omitted.**
- **Verified (2026-05-06 evening close-out)**: tsc 0, 40 benches green via vitest bridge, vitest **4853/4853** across 64 test files (+205/+7 from 2026-05-06 morning). 2 test bugs caught + fixed during writes (top-level adjacent JSX in patch-class-by-oid fixture; query-prod duplicate-OID assumption was wrong direction — actual quirk now documented). No runtime smoke needed — no production code changed.
- **Sixth prod-import surge (2026-05-06 late evening)** — `lib/ast/tree-dnd.ts` (609 LOC, the largest uncovered pure-logic module) covered direct prod-import. New file `tests/tree-dnd-prod.test.ts` (61 cases across 9 sections):
  - `resolveTreeDrop` bails (11): empty oids, drag/target not in tree, drag === target, drag is top-level, target is top-level for before/after, top-level target with inside (works), drag's parent has no oid, drop parent has no oid (uses null-oid wrapper fixture).
  - same-parent reorder before/after (8): all four srcIdx vs anchorIdx directions + adjacent-no-op for both before/after + first/last boundary indices.
  - same-parent inside-drop post-30th-pass (4): drag into own parent multi-child (toIndex = N-1) / already-last noop / middle child / single-child noop.
  - cross-parent reparent (6): before/after/inside + inside-empty (insertIndex=0) + deep-nested target + last-sibling boundary (insertIndex = N).
  - cycle detection (3): drop into descendant, drop before sibling where dropParent IS dragNode, drop self via inside (same-element guard fires first).
  - `resolveTreeDropMulti` bails (11): empty array / all-falsy / single-oid fall-back / dup-collapses-to-1 fall-back / target-not-in-tree / target top-level / target in dragged set / drag oid not in tree / drag oid top-level / cycle on dragged-oid descendant.
  - cross-parent reparent-multi (6): DFS sort regardless of input order + per-op insertIndex bumping + before/after/inside-empty + 3-oid bumped chain.
  - same-parent reorder-multi (7): leftDetaches collapsed-list math (before/after) + target-between-dragged + contiguous-block-already-at-slot noop + non-contiguous srcIndices proceeds + inside-drop (toIndex = N-K) + DFS sort.
  - mixed-multi (4): before/after with sameParent + crossParent buckets + inside (dropParent IS target, base = N) + multi-cross-DFS-sorted-bumped. **Bench-omitted in part** — the multi-bench's inline `resolveTreeDrop` clone at line 68 already drifts from production (returns "inside-same-parent unreachable", a pre-30th-pass shape). Direct-import tests catch this kind of drift; the bench can keep passing against itself indefinitely while the real lib changes underneath.
- **Verified (2026-05-06 late-evening close-out)**: tsc 0, vitest **4914/4914** across 65 test files (+61/+1 from evening). No production code touched.
- **Seventh prod-import surge (2026-05-06 night)** — 5 lib/ helper modules covered direct prod-import. Pure additive coverage (no production code changed):
  - `tests/fonts-prod.test.ts` (15): `FONTS` 15-pair list shape (id/name/display/body/vibe required, weights optional + semicolon-list format, unique ids, locked canaries: editorial=Fraunces / classic=Playfair Display / modern=Space Grotesk), `fontById` (hit/miss/case-sensitive), `buildFontPreloadUrl` (Google Fonts CSS2 endpoint, family= for every unique font name across display+body, URI-encoded spaces, `:wght@<list>` suffix per family, default `400;500;700` weights for fontless pairs, deterministic output).
  - `tests/palettes-prod.test.ts` (25): `ALL_FAMILIES` (22 families, neutrals 0-4 in slate/gray/zinc/neutral/stone order, red at idx 5, rose at idx 21, no duplicates), `NEUTRAL_FAMILIES` (5 strict subset), `PALETTES` 12-palette registry (kebab-case ids, `swatch.bg = PAPER #F5F1EA` invariant, `swatch.fg = INK #18141C` invariant, `swatch.{primary,neutral,accent} === FAMILY_500[families.x]` cross-validation, `families.neutral ∈ NEUTRAL_FAMILIES`, locked canaries: warm-paper primary=orange/#f97316, ocean primary=sky/#0ea5e9, mono uses zinc for all 3 roles), `getPaletteById` (case-sensitive, null on miss).
  - `tests/source-patch-html-prod.test.ts` (32): parse5-driven HTML byte patcher — `patchHtmlClass` overwrite/insert/void-element/&quot;&lt;&gt;&amp;-escape/stale-path bails; `patchHtmlAttr` overwrite/insert/case-insensitive name match (parse5 lowercases); `patchHtmlRemoveAttr` removes attr + leading whitespace, "not present" bail; `extractHtmlElement` full-element source for normal + void elements, null on bad path; `duplicateHtmlElement` appends clone after closing tag, void → repeats start tag; `deleteHtmlElement` removes start→end byte range; `patchHtmlText` replaces inner text + 3-entity escape (no quote — that's an attr concern), already-up-to-date no-op, void-element bails. **Bench-omitted module — prod-import is the only signal.**
  - `tests/patterns-prod.test.ts` (61): `PATTERNS` 6-pattern registry (dots/grid/diagonal/horizontal/vertical/cross order); each pattern's `css(opts)` canary regex check; `tailwindClassesForPattern` (image-only / image+length / image+length+baseColor; whitespace stripped to underscores per arbitrary-value contract); `tailwindClassesForImage` (overlay layering before url, fit→cover/contain/auto class, all 9 position→class mappings incl. corners' inverted naming `top-left → bg-left-top`, always bg-no-repeat); `hexWithAlpha` (3-digit expansion #abc→#aabbcc, 6-digit + alpha byte, alpha clamp [0,1], uppercase output); `parseHex8` (valid + invalid + case-insensitive); `GRADIENT_DIRECTIONS` 8-entry compass-order; `tailwindClassesForGradient` (alpha=100 inline `bg-[#hex]`, alpha<100 slash form `bg-[#hex]/N` with rounded N, via optional + via-alpha defaults to 100, uppercase hex); `parseGradientClasses` (3/6/8-digit hex, palette-named stops via tailwind-palette, explicit /N overrides 8-digit alpha byte, /N clamped [0,100], malformed stops skipped, missing direction/from/to → null); `parsePatternClasses` round-trip per all 6 patterns + baseHex preservation + custom non-pattern → null + mismatched X/Y length → null. **Bench-omitted.**
  - `tests/tailwind-slider-maps-prod.test.ts` (61): scale constants — SPACING/FONT_SIZES (xs..9xl 13)/FONT_WEIGHTS (thin..black 9)/LINE_HEIGHTS (6)/TRACKINGS (6)/TEXT_ALIGNS (4)/RADII (with '' shorthand placeholder)/BORDER_WIDTHS (with '' shorthand)/SHADOWS (with '' shorthand)/OPACITIES (15)/DISPLAYS (8)/FLEX_DIRECTIONS (4)/JUSTIFY (6)/ALIGN (5)/WIDTH_PRESETS+HEIGHT_PRESETS (9 each); ScaleProp regex match + toClass round-trips per prop incl. shorthand-emit semantics for `rounded`/`border`/`shadow`; `spacingProp` factory (matches plain numbers + px + decimals + arbitrary `[12rem]`, escapes regex-special prefix chars for negative-margin `-m`); `breakpointPrefix` (mobile→sm:, tablet→md:, desktop→""); `colorMatch` (palette colors at all 11 shades 50..950, transparent/current/black/white keywords, arbitrary `bg-[#abc]`, bp-prefixed variants); `currentIndex`/`setScale`/`unsetScale` (bp prefers prefixed, falls back to unprefixed, redundant prefix suppressed when unprefixed cascades); `setToken` segmented-control replacement; `pickArbitraryHex` (extracts from `bg-[#abc]` / 3 + 6-digit, null on palette-only, bp-prefer-prefixed); `stripAllBg` (removes bg-* + from/via/to but PRESERVES bg-blend-* / bg-clip-* / bg-origin-* compositing modifiers); `setColorClass`/`unsetColorClass` (full strip-then-append + bp prefix prepended). **Bench-omitted.**
- **Verified (2026-05-06 night close-out)**: tsc 0, vitest **5108/5108** across 70 test files (+194/+5 from late-evening). No production code touched.
- **Eighth prod-import surge (2026-05-06 late-night)** — 5 lib/ + lib/ast/operations/ + lib/asset-library/ + lib/component-library/ helpers covered direct prod-import. Pure additive coverage; no production code changed:
  - `tests/spacing-prod.test.ts` (11): `applySpacing` thin-wrapper-over-applyStyleProps engine. Padding + margin kind × all 4 sides camelCase mapping (paddingTop/Right/Bottom/Left + marginTop/Right/Bottom/Left), all-undefined no-op (unchanged: true, reason: null), missing OID + parse-fail bails routed through, longhand-coexists-with-shorthand cascade verification, exhaustive (kind, side) → key parametric.
  - `tests/asset-library-prod.test.ts` (79): All 10 `build*Insert` helpers — `buildEmojiInsert` (5 fitzpatrick tones × supportsTone gating), `buildImageInsert` (Unsplash 4 resolutions, HTML/JSX comment delimiters, alt fallback chain, 200-char alt truncation, double-quote escape), `buildIconInsert` (Lucide HTML kebab vs JSX camelCase, defaults size=24/strokeWidth=2/color=currentColor, partial opts merge), `buildIllustrationInsert` (unDraw #6c63ff swap + var(--primary) default + JSX kebab→camel), `buildSvgIconInsert` (stroke vs fill modes, classPrefix yielding 'hi hi-arrow' shape), `buildPexelsPhotoInsert` (4 resolutions + alt fallback), `buildPexelsVideoInsert` (file picker exact-quality + nearest-height fallback, autoplay/loop/muted/playsinline attrs, JSX camelCase autoPlay/playsInline/className), `buildFontInsert` (Google Fonts URL with `+`-separated family + `:wght@N;M` suffix, global vs var modes + custom cssVarName, font-stack varies by category serif/sans/mono, JSX `dangerouslySetInnerHTML`), `buildPaletteInsert` (`@layer dropin-palette` + 7 CSS custom properties + `html, body !important` override + `#root > *` selector NOT `> * > *` anti-carpet-bomb), `buildGradientInsert` + `buildShadowInsert` + `buildDecorativeInsert` (pattern/wave/blob × asBackground data-URI vs inline + #6c63ff color swap + preserveAspectRatio threading) + `buildMockupInsert` ({{IMAGE_SRC}} substitution + Unsplash placeholder fallback + HTML→JSX class+self-closing img conversion).
  - `tests/component-library-prod.test.ts` (18): `mintScopeId` ('ak-' prefix + 8-hex-char suffix + collision-resistant + no internal dashes), `applyScope` (placeholder substitution incl. multiple occurrences + idempotent on no-placeholder + empty input passthrough), `SCOPE_PLACEHOLDER` constant locked to `__UIV_SCOPE__`, `buildInsertPayload` HTML mode (Uiverse: attribution + scoped <style> + wrapper div with scope class; HyperUI: no-css path → no <style>, no wrapper, plain body; attribution falls back to license-only when author null; requiredPlugins propagates from tailwindPlugins; trailing newline invariant). Skip JSX path (htmlToJsx requires DOMParser → needs jsdom).
  - `tests/sse-prod.test.ts` (54): Full SSE primitive coverage — `splitSseFrames` (LF + CRLF boundaries, earlier-boundary tie-break, partial trailing buffer, empty buffer + lone-terminator edge cases), `parseSseFrame` (data-only, event+data, multi-line data joined with \n, leading-space stripping, comment + id + retry fields skipped, CRLF inside frame, null on no-data), `extractOpenAIDelta` ([DONE] sentinel, malformed JSON no-throw, missing choices, finish_reason → done=true, non-string content defensive, [DONE] with surrounding whitespace), `extractAnthropicDelta` (content_block_delta + text_delta happy path, message_stop → done, ping/message_start → no text/no done, non-text_delta type, malformed JSON, missing delta), `encodeServerFrame` (chunk/complete/error envelope shapes + JSON-escaped quotes), `parseServerStreamPayload` (round-trip with encodeServerFrame for all 3 types, malformed JSON null, unknown type null, non-string text/error null, non-array classes null, non-object root null), end-to-end pipeline (split → parse → extract for both OpenAI and Anthropic streams). Surfaces drift between bench-sse.mjs's inline mirror (per the lib's own line-9 contract: "keep in sync if any algorithm here moves").
  - `tests/storage-panel-prod.test.ts` (71): Pure-logic surface of the 2144-LOC storage panel module — `summarizeStoredEntriesByCategory` (3 buckets always returned), `filterStoredEntries` (case-insensitive substring on key OR value, trim, fresh-array no-mutation), `sortStoredEntries` (bytes-desc + name-asc with deterministic case-folded + case-sensitive tie-break), simple parsers (Scope/Sort/Filter/CollapsedOther/CollapsedTree/CollapsedDropin/PrettyPrint/HideValues — all default-fallback semantics + null/empty handling), `parseStoragePanelValueTruncation` (clamp [50, 5000] + floor + null/empty/non-finite → default 200), `splitOnMatchedSubstring` (alternating match/non-match segments, original-case preserved, multi-match, no-match), `buildStoragePanelExport` + `serializeStoragePanelExport` + `parseStoragePanelExportJson` round-trip + summary RE-DERIVED from entries (NOT trusted from input — anti-tamper invariant) + metadata shallow-copy + omit-when-undefined, `parseStoragePanelExportJsonDetail` error reasons (empty / malformed JSON / non-object root / wrong schemaVersion / panelState shape errors), `sanitizeStoragePanelExportFilename` (strip path separators + control chars + trim leading/trailing dots/whitespace + cap 64 chars + idempotent + empty-falls-back-to-default 'dropin-tree-storage'), `tryFormatJsonValue` (returns null on primitives + malformed + empty; pretty-prints objects + arrays with indent=2), `partitionAllEntriesByCategoryCollapse` (per-category collapse with hidden summary), `parseStoragePanelFilterHistory` + `serializeStoragePanelFilterHistory` (case-fold dedupe first-seen wins, cap-8 entries + cap-256-chars-per-entry, empty/non-string/malformed-JSON skip).
- **Verified (2026-05-06 late-night close-out)**: tsc 0, vitest **5341/5341** across 75 test files (+233/+5 from night). No production code touched.

## What's left — prioritized

**High — Phase C (multi-file component-instance propagation) — PLAN LOCKED 2026-05-07:**

Research doc at `phase-c-research.md`. 6 phases, ~14 days of focused work. Build order: A → B → C → E → D → F (multi-file foundation + single-file swap-fit FIRST, then cross-file propagation for className then swap).

- ✅ **Phase A.1 — pure-logic foundation shipped 2026-05-07.** New `lib/files/` (3 files, ~440 LOC): `types.ts` (branded `FileId`, `FileKind` 5-variant union, `FileRecord`, `Project { files: ReadonlyMap, entryFileId, … }`, `FileOpResult` discriminated union); `operations.ts` (12 pure functions: `createFileId`, `createProjectId`, `kindFromPath`, `normalizePath`, `createProject`, `addFile`, `removeFile`, `updateFileSource`, `renameFile`, `setEntryFile`, `getFile`, `findFileByPath`, `getEntryFile`, `listFiles`, `resolveRelativeImport`); `storage.ts` (IndexedDB via existing `idb` dep, single object store `dropin-files`, serialize-as-array for forward-compat with future "export project to JSON"). Path normalizer handles `./`, `../`, `\\`, multi-slash, null-char rejection, escape-root rejection, extension validation. Hot-path `updateFileSource` returns identity-equal project on no-op. `listFiles` uses bytewise sort (NOT `localeCompare`) for cross-runtime determinism. New `tests/files-prod.test.ts` (65 cases) covers every operation + every error path + immutability invariants + entry-preservation invariants + extensionless-import resolution + collision-detection on duplicate paths. Storage layer's IDB tests deferred to Phase A.2 (need `fake-indexeddb` or jsdom integration fixture).
- ✅ **Phase A.2 + audit F4 mini-fix for file-pool storage shipped 2026-05-07.** (After A.2 main wiring)
- ✅ **Audit F4 follow-up applied to NEW storage layer (NOT the deferred storage-panel one).** `lib/files/storage.ts` now phantom-types `schemaVersion: 1` as a literal (audit F4 lesson — see backlog). Discriminated-union scaffold via `type StoredProject = SerializedProjectV1` ready for v2: future schema bumps must add a `SerializedProjectV2` arm + a deserialize branch keyed on `schemaVersion`, and tsc enforces the discrimination instead of letting `schemaVersion: 99` silently pass. Backcompat via `asV1(raw)` normalization: pre-versioned records (the morning's first IDB writes during A.2 testing) load through the same path as v1 records. New `LegacyUnversionedProject` type explicitly NOT exported and NOT allowed in writes — this is read-only legacy. 2 new integration tests: (a) save writes `schemaVersion: 1` to disk; (b) load accepts a pre-versioned record as v1. Final totals: tsc 0, vitest **5423/78**.
- ✅ **Phase A.2 main wiring shipped 2026-05-07.** `Workspace.tsx:108-160` now owns a `useState<Project>` initialized via `createProject({…, idOverride: 'dropin:project:<filename>:<kind>'})` — deterministic id so reloads hit the same IDB record. `useSourceHistory` lazy initializer reads from `getEntryFile(project).source` (was `injectOids(initialCode).source` directly). Three new effects right after `showWarn`/`showInfo`: (1) **mirror** — `[code]` dep, propagates history.code → project.entryFile.source via `updateFileSource` with identity-equal short-circuit (no extra render on no-op); (2) **hydration** — once on mount, `loadProject(projectId)` resolves; if found, `setProject(stored) + setCodeSilent(stored.entrySource)`; flips `hydratedRef.current = true` regardless of outcome; uses `justHydratedRef` to skip the immediate post-hydration save (since the just-loaded project would otherwise re-write the same data 500ms later); error path surfaces via `showWarn`; (3) **persistence** — debounced 500ms `setTimeout(saveProject, 500)` on `[project]` dep; cleanup clears the pending timer so rapid typing only fires one save after the user stops; gated on `hydratedRef`. Added `idOverride?: string` to `CreateProjectOpts` + 2 prod-import tests (3 total +2 from baseline). Made `__resetDbPromiseForTests` async (closes the underlying connection so test `deleteDatabase` calls don't block). New `tests/integration/file-pool-hydration.test.ts` (7 cases via `// @vitest-environment jsdom` + `fake-indexeddb/auto`): save→load round-trip preserves shape + entry source + Map deserialization; null on absent id; subsequent save overwrites at same id; corrupted record throws (entryFileId not in files); listProjects sorted by updatedAt desc; deleteProject removes the record; multi-file project round-trips with all FileRecords intact. **Verified**: tsc 0; vitest **5421/5421** across **78** files (+9/+1 since A.1 baseline of 5412/77); curl smoke on dev-server's `/playground` shows `loadProject` + `saveProject` + `createProject` all in the served `playground/page.js` chunk; Workspace + "Loading editor" in the SSR HTML; IsolatedPreview unchanged (still receives `code: string`). New devDep: `fake-indexeddb@^6.2.5` (tests-only, NOT a locked-stack violation per same precedent as `jsdom`). User-visible behavior unchanged: single-file editing, undo/redo, Monaco onChange, dice roll / inspector / library inserts all work exactly as before — IDB persistence is purely additive.
- ✅ **Phase B.1 — Edit + FileDiff + History stack pure-logic foundation shipped 2026-05-07.** Parallel to A.1's pattern: pure types + pure operations + comprehensive prod-import tests; zero React, zero DOM, zero IDB. New `lib/edits/` (3 files, ~340 LOC):
  - `types.ts`: branded `EditId` via `unique symbol` matching `FileId`'s pattern; `FileDiff { fileId, before, after }` snapshot model NOT patches; `Edit { id, ts, reason?, diffs }`; `EditApplyResult` discriminated union; `COALESCE_WINDOW_MS = 300` and `BULK_EDIT_THRESHOLD = 50` and `MAX_HISTORY = 50` constants moved out of the legacy hook for testability + reuse; `History { past, future, nextSkipCoalesce }` shape; `EMPTY_HISTORY` factory.
  - `operations.ts` (5 pure functions): `createEditId` 12-char base-36; `createEdit` validates non-empty diffs + rejects duplicate fileIds; `editFromSourceChange` 1-diff convenience builder with no-op short-circuit; `applyEdit` validates ALL diffs before mutating ANY — atomic forward apply with concurrent-state divergence detection; `revertEdit` mirror-validation backward apply; `tryCoalesce` merges sequential same-file edits within window + below bulk threshold + with continuity check, preserves prev's `before` and takes next's `after` so undo rewinds the whole typing run in one step.
  - `history.ts` (5 pure functions): `pushEdit` (try-coalesce-then-append with ring-buffer cap + future clear + barrier propagation); `popUndo` / `popRedo` (LIFO with ring-buffer cap on the destination side); `canUndo` / `canRedo` (read-only flags). `nextSkipCoalesce` flag on `History` is set after any `noCoalesce: true` push AND after every undo/redo — matches legacy `useSourceHistory.commit()` semantics and `lastTsRef = 0` reset, preserving user-visible behavior when Phase B.2 swaps the hook.
- New tests: `tests/edits-prod.test.ts` (38 cases — operations) + `tests/edits-history-prod.test.ts` (24 cases — stack semantics). Coverage: every operation + every error path + multi-file atomicity (validation-before-apply on partially valid diff list) + apply→revert roundtrip identity + coalesce window/bulk/continuity edges + custom override threading + ring-buffer cap on past + future + barrier-after-undo (typing after undo doesn't merge with prior entry) + barrier-after-redo + commit-style barrier (typing → noCoalesce barrier → typing yields 3 entries with both runs internally coalesced).
- **Verified**: tsc 0; vitest **5485/80** (was 5423/78 after the F4 follow-up → +62/+2). Pure additive — no production code outside `lib/edits/` touched. Phase B.2 will replace `lib/use-source-history.ts` with a `useEditHistory` hook that wraps the operations + the History stack.
- ✅ **Phase B.2 — Multi-file Monaco UX shipped 2026-05-07.** New `lib/use-edit-history.ts` (~340 LOC) wraps B.1's `applyEdit/revertEdit/pushEdit/popUndo/popRedo` behind a backwards-compat hook surface (`code, setCode, setCodeSilent, undo, redo, canUndo, canRedo, commit`) so the **50+ Workspace.tsx setCode call sites needed zero rewrite**. The hook owns project state + History stack + IDB hydration + debounced persistence in one place — Workspace's 3 ad-hoc effects (mirror/hydration/persistence from A.2) collapse into a single `useEditHistory(...)` call. New surface for multi-file consumers: `project, setProject, activeFileId, setActiveFileId, applyEditDirect`. Trap caught + fixed mid-session: in a typing run within one React batch, `projectRef.current = project` at render-time is too late — the second `setCode` reads stale `before`, breaks tryCoalesce's continuity check, every keystroke lands as its own undo entry. Fix: synchronously write to `projectRef.current` + `historyRef.current` inside each setter via a `commitState(p, h)` helper, BEFORE the React state setter fires. Same ref-on-write pattern as the legacy `useSourceHistory`'s `codeRef.current = value`.
- **Workspace.tsx surgery**: import block trimmed (5 lines deleted: `useSourceHistory`, `getEntryFile`, `updateFileSource`, `loadProject`, `saveProject`, `Project` type). 30-line `useState<Project>` + `hydratedRef` + `useSourceHistory` block collapsed into one `useEditHistory({...})` call. The 3 ad-hoc effects (mirror at L436, hydration at L458, persistence at L489) — 70+ lines total — DELETED. New `errorHandlerRef` bridges `onError` → `showWarn` (the latter declared after the hook so a direct closure reference would TDZ; the ref is assigned during render after showWarn lands, hook reads `.current` from inside its later-firing effects). Net: Workspace **net -50 LOC** despite adding tab strip + new-file/delete UX.
- **Tab strip + multi-file UX**: editor pane header replaced with `listFiles(project)` rendered as a tab strip. Active tab highlighted; entry file marked with ★; non-entry tabs have a × delete button (entry-file removal blocked at the op layer per A.1, defended again in `handleRemoveFile`). "+ file" button uses `prompt()` for v1 path entry → `normalizePath` → `addFile`. New file becomes active; viewState save fires for the outgoing tab. Tabs overflow horizontally (overflow-x-auto) when project grows. **Critical multi-file safety**: `Preview` now consumes `entryCode` (entry file's source) NOT `code` (active file's source) — Phase C's bundler will walk imports, but until then non-entry files are edit-only and the iframe always renders the entry. Switching to a non-entry tab no longer crashes the iframe. Inspector ops continue to target the active file (silently bail when active !== entry — no corruption, just no-op; documented limitation pending Phase C/D).
- **Per-file Monaco viewState**: `Editor.tsx` got `path` prop (threaded to `MonacoEditor`'s `path` for model swap) + 2 new `EditorHandle` methods (`getViewState` / `restoreViewState`, opaque-typed `unknown` so consumers don't depend on Monaco's `IViewState` shape). Workspace owns a `Map<filePath, ViewState>` cache: `handleTabSwitch(id)` saves the OUTGOING file's viewState BEFORE setActiveFileId triggers re-render (editor still has the outgoing model bound at that moment); a `useEffect([activeFile])` restores the INCOMING file's cached state AFTER Monaco's path-swap effect runs (children-before-parents commit order means Workspace's effect lands after MonacoEditor's). Cache key is path (not fileId) so a future rename preserves position.
- **Active file's kind drives Editor language**: `language` derivation now reads `activeFile?.kind` instead of the workspace-level `kind`, so JSX/HTML/TS/TSX/JS files all get the right Monaco tokenizer. The workspace-level `kind` still drives Preview (which shows the entry file).
- **Integration tests added (`tests/integration/use-edit-history.test.ts`, 19 cases)**: jsdom env + `react-dom/client` + React 18's `act` (no RTL devDep added — vanilla `createRoot` + a Probe component is enough for hook integration). Sets `globalThis.IS_REACT_ACT_ENVIRONMENT = true` to opt into act warnings. Coverage: initial state (code=entry, canUndo/canRedo=false, lazy initializer called once); setCode (value/updater forms, no-op short-circuit, push to history, flips canUndo); undo/redo round-trip; typing-run-coalesces-to-1; setCodeSilent (project updates, history doesn't, no-op preserves project identity); commit barrier (`commit()` flips nextSkipCoalesce, the next setCode lands fresh, subsequent pushes resume normal coalescing — matches legacy `lastTsRef = 0` semantic, NOT the docblock's "3 entries" scenario which is for noCoalesce-stamped pushes); applyEditDirect with `noCoalesce: true` creates a hard 3-entry boundary; multi-file (setProject doesn't push history but does update project; setActiveFileId switches code source + closes coalesce window; applyEditDirect pushes hand-built multi-file Edits with atomic undo); error reporting (setCode on bad active fileId surfaces via onError, doesn't crash); IDB hydration replaces state when stored project exists; persistence saves debounced after the user stops; hydration error surfaces via onError without crashing.
- **Verified**: tsc 0; vitest **5504/5504** across 81 test files (was 5485/80 → +19/+1). Runtime smoke (curl on user's existing 3001 dev server): `/playground` returns 200, served HTML contains `Workspace`, `Loading editor`, `+ file` (the new tab strip's button text), `dropin`. The served `_next/static/chunks/app/playground/page.js` chunk contains 13 hits for `useEditHistory`, 16 for `setActiveFileId`, 5 for `applyEditDirect`, 4 for `errorHandlerRef`, 2 for `handleTabSwitch`, 1 each for `getViewState` / `restoreViewState`. Multi-file UX is wired into the production bundle, not just source.
- **Phase C — Iframe bundler + import resolution SHIPPED 2026-05-07.** New `lib/preview-bundler.ts` (~440 LOC pure-logic, zero React/DOM/IDB). Algorithm: iterative DFS from entry walks relative imports via `resolveRelativeImport` (already shipped in A.1), parses each file with `@babel/parser` + `errorRecovery: false` (we want clean parse-error surfacing per-file), tracks white/gray/black coloring for cycle detection, builds topological order. Single-file projects short-circuit to entry source verbatim — zero overhead vs pre-Phase-C. For multi-file projects, the bundler:
  - **Hoists ALL imports** out of every file (relative AND npm). Required because `import` statements are top-level-only under `sourceType: 'module'`; an import buried inside a module IIFE is a SyntaxError.
  - **Strips relative imports** entirely (resolved via the IIFE module table) and **dedupes + re-emits npm imports** at the bundle top. The iframe's existing `processModuleSyntax` then turns the hoisted top-level npm imports into `var X = window.__pkgs[name]...` preamble bindings — no change needed in `lib/preview.ts`.
  - **Wraps each non-entry file** in `var __dropin_mod_<topoIdx> = (function () { ... return { default: __dropin_default, named1: local1, ... }; })();`. Topological-index naming avoids the path-derived collision class (`components/Card.tsx` vs `components/Card_tsx` mapping to same identifier).
  - **Rewrites the importer's relative-import bindings** via `magic-string` to `var X = __dropin_mod_<idx>.default;` / `var X = __dropin_mod_<idx>["name"];` / `var X = __dropin_mod_<idx>;` (default / named-or-aliased / namespace). Handles `import { Foo as Bar } from './x'` shape via the AST's `local`/`imported` Identifier pair. Side-effect-only `import './x'` produces no binding (the IIFE runs at top thanks to topo order, side effects fire).
  - **Handles all default-export shapes**: `export default function Foo() {}`, `export default function() {}` (anonymous), `export default class Foo {}`, `export default <expr>` — all rewrite to `var __dropin_default = <whatever>` for uniform IIFE-return shape. Named exports (`export const`, `export function`, `export class`, `export { Foo, Bar as Baz }` non-source-form) get their `export ` keyword stripped + tracked in the IIFE return.
  - **Bails atomically** on cycle (gray-on-gray DFS), unresolved relative import, `export * from './x'` re-export, `export { Foo } from './x'` re-export-with-source, or per-file parse error. All bails return `{ ok: false; error }` — caller (Workspace) falls back to entry source verbatim and surfaces the error string via `showWarn` with identity-based throttling so a sticky cycle doesn't spam toasts.
  - **Entry file's `export default` is LEFT INTACT** so the iframe runtime's existing `processModuleSyntax` continues to convert it into `return` for the IIFE wrapping that turns the bundle into a callable function returning the App component.
- **Workspace.tsx wiring**: `entryCode` useMemo now derives from `bundleProject(project)` instead of just `getFile(project, project.entryFileId).source`. Single-file path is byte-identical to pre-C. Bundle errors surface via a new `useEffect` watching the result, throttled by error-string identity. `PreviewModal` consumer at L2826 also switched from `code={code}` to `code={entryCode}` so the fullscreen preview gets the bundled output for multi-file projects. `FocusEditor` left alone (per-element isolation iframe is an unsolved problem for multi-file v1).
- **Tests added** (+49/+2):
  - `tests/preview-bundler-prod.test.ts` — 44 cases, prod-import. Covers single-file passthrough (3), default imports (4: anonymous, named-fn, arrow-expr, class-decl), named imports (4: simple, alias, multi-name, specifier-only `export {}`), namespace imports (1), side-effect imports (1), npm-mixed-with-relative + dedup (3), transitive (5: 3-file chain, diamond, extensionless, nested, parent-folder), error paths (6: cycle, self-import, unresolved, `export *`, `export { } from`, parse error), structural invariants (10), entry override (2), additional invariants (4: no-mutate, deterministic, single-file zero offset, setEntryFile reassignment).
  - `tests/preview-bundler-iframe-shape.test.ts` — 5 cases. Validates the bundle's TOP-LEVEL statement shape obeys the iframe runtime's expectations: ImportDeclarations come first (hoisted npm), VariableDeclaration with `__dropin_mod_*` id comes next, `ExportDefaultDeclaration` is the last statement (so `processModuleSyntax`'s keyword-strip → `return` works). Anchored regex test confirms the IIFE `var __dropin_mod_0 = (function () { ... return { default: __dropin_default }; })();` shape exactly. Diamond-chain test confirms the IMPORTER's relative bindings live INSIDE its IIFE (not hoisted to bundle top — that would break encapsulation + re-execution semantics).
- **Verified at close-out**: tsc 0; vitest **5553/5553** across 83 test files (was 5504/81 after B.2 → +49/+2). 40 benches green via `tests/_runBench.ts` bridge. Runtime smoke on user's existing 3001 dev server: `/playground` returns 200, served HTML contains `Workspace` + `Loading editor` + `App.jsx ★` (the entry tab marker) + `+ file`. The served `_next/static/chunks/app/playground/page.js` chunk contains 6 hits for `bundleProject`, 6 for `preview-bundler`, 1 for `__dropin_mod_`, 3 for `cannot resolve` (the bundler's error-message string). Phase C bundler is wired into the production bundle, not just source.
- **Known v1 limitation**: the iframe's `dropin-loc` plugin tags JSX with bundle-relative line numbers and applies a hardcoded `(line - 1)` offset to map back to user-source. With bundling, the entry file no longer starts at bundle line 2; the offset is wrong by N lines (where N = preamble + module IIFEs). Inspector resolution by OID (`data-dropin-id`) is unaffected — OIDs are unique across the bundle and DOM lookup finds the right element. The "scroll Monaco to clicked line" hint is degraded for multi-file in v1 (lands on roughly-correct lines for single-file, off-by-N for multi-file). The bundler returns `entryLineOffset` so a future iframe-runtime pass can subtract this; deferred until Phase D's cross-file inspector wiring needs it.

- **Phase C end-to-end test SHIPPED 2026-05-07** — `tests/preview-bundler-buildpreviewdocument.test.ts` (4 cases). Validates the chain `bundleProject → buildPreviewDocument`: multi-file bundle's `__dropin_mod_*` IIFE shape lands in iframe srcDoc; single-file passthrough emits ZERO bundler artifacts (regression guard against accidentally-always-IIFE shape); bundle errors fail fast for caller-side fallback; HTML branch never invokes JSX runtime. +4/+1.

- **Phase D foundation — cross-file definition query SHIPPED 2026-05-07.** New `lib/ast/cross-file-query.ts` (~340 LOC pure-logic). Exports `findCrossFileDefinition(project, callSiteFileId, tagName) → { ok: true; def: { fileId, rootOid } } | { ok: false; reason: string }`. Resolution order: (1) in-file via existing `findInlineComponentDefRootOid`; (2) walk top-level imports in call-site file for one whose LOCAL binding name matches `tagName`; (3) resolve relative spec via Phase A.1's `resolveRelativeImport`; (4) recurse-once into resolved file: find declaration whose EXPORTED name matches caller's imported name; (5) read OID off that declaration's JSX root.
  - **Default-export handling**: `export default function Foo()` (named decl), `export default function() {}` (anonymous — Babel parses as FunctionDeclaration with `id: null`, NOT FunctionExpression — caught + fixed mid-test), `export default () => ...`, `export default Identifier;` form (looks up the identifier's binding via in-file resolver), arrow-block-body. **Bails** on `export default class Foo {}` (class component v2+), `export default withAuth(Card)` (HOC, locked decision Q4).
  - **Named-export handling**: `export const Foo = ...` / `export function Foo() {}` (with-declaration form), `export { Foo, Bar as Baz }` (specifier-only). Handles both no-rename + rename in importer (`import { Foo as MyFoo }`) AND in exporter (`export { Internal as Card }`). **Bails** on `export { Foo } from './bar'` re-export (locked decision D4) and missing named export.
  - **Error reasons (caller surfaces in toast)**: lowercase tag (HTML element); call-site file not in project; parse error in call-site OR resolved file; tag not imported (caller treats as "no cross-file work needed", quiet fallback); non-relative import (curated npm has no inspectable JSX root); unresolvable relative; namespace import (`import * as`) usage as JSX tag; anonymous default arrow / function with no JSX root.
  - **27 prod-import tests** (`tests/cross-file-query-prod.test.ts`): in-file fallback (3), default imports (9 — named-fn + rename + identifier-ref + arrow-expr + anonymous-fn + arrow-block-body + HOC bail + class-component bail + missing-default), named imports (6 — direct-decl + alias-importer + alias-exporter + specifier-only + re-export bail + missing-named), error paths (5 — not-imported quiet fallback + non-relative npm + unresolvable + parse error + namespace-import bail), invariants (4 — no-mutate + deterministic + correct-fileId-on-cross-file-hit + ...).
  - **One trap caught + fixed**: anonymous `export default function() {}` Babel-parses as FunctionDeclaration with `id: null`, not FunctionExpression. My initial check for FunctionExpression-or-Arrow only didn't catch it. Added explicit branch for "FunctionDeclaration with no id" → walk body for JSX root.
  - **Pure additive — zero production code outside `lib/ast/cross-file-query.ts` touched.** Phase D-proper (extending `applyStyleProps` to multi-file shape, wiring to existing `propagationMode === "everywhere"` toggle, packaging both edits into one `Edit { diffs: FileDiff[] }` via `applyEditDirect`) consumes this foundation.

- **Phase D-proper (cross-file className propagation wired into Workspace) SHIPPED 2026-05-07.** Extends `handleClassChange` in Workspace.tsx with a cross-file branch:
  - When `propagationMode === "everywhere"` AND the call-site is JSX AND the tag is capitalized AND `findInlineComponentDefRootOid` MISSES (no inline def in the same file), call `findCrossFileDefinition(project, activeFileId, tag)` from the new `lib/ast/cross-file-query.ts`.
  - **On hit**: read the def file's source, run `patchJsxClassByOid(defSource, defRootOid, newClass)`. Build a multi-file `Edit { diffs: [callSiteDiff, defDiff], reason: "everywhere-cross-file:<Card>" }` via `createEdit`. Commit through the new `applyEditDirect` (now destructured from `useEditHistory`). One Cmd+Z reverts BOTH files atomically per Phase B.1's `revertEdit` semantics.
  - **On miss**: surface the resolver's reason via `showWarn` for actionable bails (HOC / class component / re-export / non-relative / namespace-import / unresolvable). The "tag not imported" reason is filtered out from the toast — that's the common quiet fallback case where the user is editing a top-level element with no cross-file resolution to do; the in-file inline patch already happened.
  - **Critical no-double-write**: a new `crossFileApplied` flag gates the trailing `setCode(nextSource)` so the cross-file branch's `applyEditDirect` is the ONLY write. Without this, the call-site would land on the history stack twice (once via the multi-file Edit, once via setCode's single-file Edit).
  - **`useEditHistory` destructure extended**: added `applyEditDirect` to the Workspace consumer block. The hook already exposed it (Phase B.2); Workspace just hadn't claimed it until now.
- **Phase D scenario test (`tests/cross-file-propagation-scenario.test.ts`, 6 cases)**: end-to-end via the pure ops (no jsdom needed — the chain is `findCrossFileDefinition → patchJsxClassByOid → createEdit → applyEdit`, all pure). Coverage: full happy-path (App.jsx imports Card from './Card'; edit on `<Card />` ripples to both files atomically; revertEdit rolls both back), in-file def takes precedence over cross-file lookup, HOC bail surfaces with reason, re-export bail surfaces with reason, multi-file Edit's two-phase atomicity REJECTS the whole edit if either diff's `before` mismatches project state (no partial mutation), named-import (`import { Card } from './lib'`) cross-file works.
- **Verified after D-proper close-out**: tsc 0; vitest **5590/5590** across 86 test files (was 5584/85 → +6/+1). 40 benches green. Runtime smoke on user's existing 3001 dev server: served `_next/static/chunks/app/playground/page.js` chunk contains 5 hits for `findCrossFileDefinition`, 5 for `cross-file-query`, 3 for `crossFileApplied`, 1 each for `Everywhere mode` (toast prefix) + `everywhere-cross-file` (Edit reason string). Phase D wiring is in the production bundle, not just source.

- **Phase E foundation (slot capacity types + fit comparison) SHIPPED 2026-05-07.** New `lib/swap/slot-capacity.ts` (~135 LOC pure-logic). Same A.1/B.1/D-foundation pattern: types + pure functions, no consumer wiring yet. Phase E proper (ingest pipeline, LibraryModal filter, swap-fit transformation) consumes this foundation in subsequent sessions.
  - **Types**: `SlotCategory` (reuses existing `SwapHintPanel` from `swap-category-hint.ts` so the existing categorizer composes), `SlotIntrinsic { minWidthPx, minHeightPx, maxWidthPx, maxHeightPx, aspectRatio }` (all nullable per the "grows to fill" / "no cap" semantics), `SlotFlexBehavior` ("fill" | "fit-content" | "fixed"), `SlotCapacitySource` ("library" — ingest computed | "user-extracted" — Make Component live computed), `SlotEnvelope { availableWidthPx, availableHeightPx, preferredAspectRatio }` (the slot the swap target lives in), `FitVerdict = { ok: true } | { ok: false; reasons: string[] }`.
  - **Comparison `slotCapacityFits(envelope, capacity) → FitVerdict`**: 4 checks in fixed order. (1) `minWidthPx > envelope.availableWidthPx` → "needs ≥ Npx width". (2) `minHeightPx > envelope.availableHeightPx` → "needs ≥ Npx height". (3) `flexBehavior === "fixed" && maxWidthPx > envelope.availableWidthPx` → "fixed-width Npx exceeds slot's Mpx" (only fires for fixed flex; reflowing assets shrink). (4) AR drift: when BOTH capacity AND envelope have an aspectRatio, compute `|cap - env| / env`. If > AR_DRIFT_TOLERANCE (locked at 0.1 = 10% per Figma's instance-swap published behaviour), surface "aspect ratio X.XX vs slot's Y.YY (P% drift)". Multiple violations all surface — caller renders the full reasons list in a tooltip.
  - **Convenience helpers**: `unconstrainedEnvelope()` (Infinity/Infinity/null — for browse-mode in LibraryModal where there's no selected slot); `unconstrainedCapacity(category?)` (all-null intrinsic + fill behavior + user-extracted source — for Make Component assets whose capacity isn't computed yet).
  - **Tests** (`tests/slot-capacity-prod.test.ts`, **32 cases**): happy paths (8), width violation (3 — fail / 1px boundary / exact-match passes), height violation (2), fixed-flex maxWidth violation (2 — fails for `fixed`, doesn't fire for `fill`/`fit-content`), AR drift (3 — fails on >tolerance, passes just-under tolerance, fails just-over), multi-reason (2 — collects all 4 violations + preserves canonical order width→height→fixed→AR), `unconstrainedEnvelope` (2), `unconstrainedCapacity` (5), invariants (4 — AR_DRIFT_TOLERANCE=0.1 locked + no-mutate + deterministic + ok-shape canary).
  - **One trap caught + fixed**: floating-point precision at the AR-tolerance boundary. Test "does NOT fail at exactly the tolerance boundary" expected `1.0 * 1.1 - 1.0` to equal exactly 0.1; in IEEE 754 it's 0.10000000000000009. Adjusted test to use `1 + AR_DRIFT_TOLERANCE - 0.001` to stay just under the strict-`>` boundary; the exact-boundary case is documented as flaky and not asserted. Implementation behavior unchanged.
  - **Pure additive — zero production code outside `lib/swap/slot-capacity.ts` touched.** No imports added to Workspace. The wiring lands in Phase E proper.

- **Final close-out (2026-05-07)**: tsc 0; vitest **5622/87** across 87 test files (was 5590/86 after D-proper → +32/+1: 32 slot-capacity tests). 40 benches green via `tests/_runBench.ts` bridge. Net since the morning's A.1 baseline (5412/77): **+210 vitest tests / +10 test files**. Pure-logic universe expanded by 5 new modules (`lib/files/`, `lib/edits/`, `lib/preview-bundler.ts`, `lib/ast/cross-file-query.ts`, `lib/swap/slot-capacity.ts`). Three new Workspace-level wirings (multi-file Project state via `useEditHistory`, multi-file iframe bundling via `bundleProject`, cross-file className propagation via `findCrossFileDefinition` + `applyEditDirect`). Production bundle confirmed to ship every layer.
- **Phase E — Swap dimension-matching: PURE-LOGIC SHIPPED 2026-05-07 PM**. `lib/swap/swap-fit.ts` (auto-fit), `lib/swap/capacity-from-source.ts` (static analyzer with Tailwind named scale), `lib/swap/capacity-loader.ts` (JSON parser, schema-versioned), `lib/swap/bbox-drift.ts` (drift assertion), `lib/swap/envelope-from-bbox.ts` (compose envelope from iframe bbox), `lib/swap/library-filter.ts` (LibraryModal classify+sort). 251 prod-import tests across 6 files. **Remaining for E proper to ship to user**: (a) `scripts/ingest-components.mjs` extension to compute `data/component-capacities.json` via puppeteer (~0.5d), (b) LibraryModal compatibility filter chip + dim + tooltip wiring (~0.5d), (c) iframe-side parent-bbox + computed-style channel via existing `dropin:bbox` watch (~0.5d), (d) Workspace swap-handler integration (compute envelope on selection → call `filterAndSortLibrary` → call `applySwapFit` post-swap → call `assessBboxDrift` post-render) (~0.5d). All UI/wiring; no pure-logic modules left to write.
- **Phase D — Cross-file className propagation.** Already SHIPPED 2026-05-07 morning. Pure-logic foundation in `lib/ast/cross-file-query.ts` + Workspace `handleClassChange` cross-file branch using `applyEditDirect` for atomic multi-file Edits.
- **Phase F — Cross-instance swap propagation: PURE-LOGIC SHIPPED 2026-05-07 PM**. `lib/ast/instance-graph.ts` (find all call sites of a definition; covers default + named + alias-importer + alias-exporter + in-file calls; bails on parse errors of OTHER files best-effort) + `lib/swap/preflight.ts` (composes instance-graph + slotCapacityFits; atomic ok/fail + missing-envelope bucket per Q10). 40 prod-import tests across 2 files. **Remaining for F proper**: Workspace integration — when `propagationMode === "everywhere"` AND user invokes Swap, call `preflightSwapAcrossInstances`; on `ok: true` build a multi-file Edit via `applyEditDirect`; on `ok: false` show summary toast + abort. ~2 days.

**Locked decisions (defaults from research §4 + §8 — no overrides requested by user)**:
- **D1 storage**: IndexedDB via `idb`. Single object store `dropin-files` keyed by `projectId/path`. Migration is greenfield — no existing source-state localStorage to migrate.
- **D2 granularity**: per-page projects. Each existing template = 1-file project on lift. New blank project CTA creates `App.{jsx|html}`.
- **D3 imports**: relative + curated npm only in v1. CSS / asset / `framer-motion` / `@radix-ui/*` / `@heroicons/react` / `sonner` / `react-hot-toast` / `date-fns` deferred.
- **D4 definition resolution**: direct named + default exports only. HOCs, barrel re-exports, `export default withAuth(Card)` shapes bail with clear toast.
- **D5 diff model**: `Edit { id, ts, reason, diffs: FileDiff[] }`. One undo entry can span N files. Atomic.
- **Q1**: explicit "Edit a copy" CTA; templates stay read-only.
- **Q2**: free-form file paths (UX nudges via starter templates).
- **Q3**: `Make Component` generates default exports.
- **Q4**: HOC / re-export bail in v1.
- **Q5**: asset capacity computed ingest-time, stored `data/component-capacities.json`.
- **Q6**: "Make Component" right-click extraction deferred to Phase G post-MVP.
- **Q7**: only the active file has selection. Switching files clears selection.
- **Q8**: attribution stays as comment-in-source (no separate ATTRIBUTIONS.md file).
- **Q9**: full iframe rebuild on any edit (optimize later — `dropin:live-style` optimistic-paint already handles class-only edits without rebuild).
- **Q10**: cross-file dimension-mismatch hard-aborts the multi-instance swap. Atomic. User picks a compatible variant or accepts that one site needs manual touch-up.

- ✅ **(e/f/s) Mobile/touch gestures** — shipped 2026-05-05 afternoon.

**Audit follow-up — type-design HIGHs from 2026-05-06 audit (refactors, not bugs):**
- ✅ **F1 SHIPPED 2026-05-08** — Extracted `parseRewriteRequest(raw: unknown) → ParseRewriteRequestResult` to new `lib/llm-rewrite-parser.ts` (~100 LOC pure-logic, types + validator). Replaced the unsafe `(await req.json()) as RewriteRequest` cast at `app/api/llm-rewrite/route.ts:418` (and the inline 5-block field-guard chain) with a parse-don't-validate flow: `parseRewriteRequest(raw)` returns `{ ok: true; value }` (typed) or `{ ok: false; error }`; the route narrows on `parsed.ok` and never sees an under-typed value. Validator strips attacker-controlled extra properties (only emits the validated fields, no `__proto__` spread leak). Validation order locked: provider → apiKey → prompt → elementSource → classes → optional model/stream. `RewriteRequest` + `RewriteProvider` types now live in the parser module; `route.ts` re-exports them through a single import. 35 new prod-import tests in `tests/llm-rewrite-parser-prod.test.ts` cover every reject path, optional-field handling, attacker-junk stripping, validation order (first-error-wins), constants pin (`MIN_API_KEY_LEN = 8`).
- ✅ **F2 SHIPPED 2026-05-08** — `app/api/llm-rewrite/route.ts:458`: non-streaming success branch now uses `NextResponse.json<RewriteResponse>(okPayload)` with an explicit `RewriteResponse` typed local, matching `bad()`'s envelope-type annotation. A future edit that drops `ok: true` or mistypes `classes` fails to compile. Streaming branch already has its own envelope (text/event-stream Response) and stays out of the discriminated union by design.
- ✅ **F4 SHIPPED 2026-05-08** — `lib/storage-panel.ts`: `StoragePanelSnapshot.schemaVersion: number` → `readonly schemaVersion: 1`; `StoragePanelExport.schemaVersion: 1` made `readonly`; both types got discriminated-union scaffold (`StoredStoragePanelExport` / `StoredStoragePanelSnapshot` aliases) for future v2 extension. `STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION` constant pinned `1 as const` so the literal flows through builders without widening. 15 new prod-import tests in `tests/storage-panel-prod.test.ts §13` covering buildSnapshot stamps + parseSnapshot rejection of `schemaVersion: 99/0/missing/non-numeric` + bytes flooring + non-finite skip + null/malformed-JSON paths.

**Medium — cleanup that prevents drift:**
- **Refactor benches to import from production.** Benches still inline their own copies of every lib algorithm; if the lib refactors and the bench doesn't, the bench is testing dead code. **Counterweight shipped across 8 surges (2026-05-05 + 2026-05-06)**: **34 prod-import test files (~1212 cases)** covering all major pure-logic lib/ast modules + the lib/ helpers + lib/asset-library/ + lib/component-library/ + lib/ast/operations/spacing — `applyResize`, `applyStyleProps`, `applyDelete`, `applyDuplicate`, `applyInsertChild`, `applySwap`, `applyReorder`, `applyReparent`, `applyPalette`, **`applySpacing`**, tree-persistence pure helpers, source-patch-jsx byte patcher, `lib/touch.ts`, `lib/ast/flip.ts`, `lib/ast/gesture-math.ts`, `lib/ast/intent-resolver.ts`, `lib/ast/oids.ts`, `lib/ast/snap.ts`, `lib/ast/constraints.ts`, `lib/contrast.ts`, `lib/canvas-range.ts`, `lib/swap-category-hint.ts`, `lib/ast/style-source-read.ts`, `lib/ast/scope.ts`, `lib/ast/component-def.ts`, `lib/ast/patch-class-by-oid.ts`, `lib/ast/query.ts`, `lib/tailwind-palette.ts`, `lib/style-presets.ts`, `lib/ast/tree-dnd.ts`, `lib/fonts.ts`, `lib/palettes.ts`, `lib/source-patch-html.ts`, `lib/patterns.ts`, `lib/tailwind-slider-maps.ts`, **`lib/asset-library/*` 10 build helpers (emoji/image/icon/illustration/svg-icon/pexels-photo/pexels-video/font/palette/decorative)**, **`lib/component-library/scope.ts` + `insert.ts` HTML mode**, **`lib/sse.ts` (SSE primitives — was bench-only, exact drift-risk pattern)**, **`lib/storage-panel.ts` (12+ pure-logic surfaces incl. export round-trip + filter/sort/sanitize/tryFormatJsonValue/partition + filter history + parsers)**. Drift between bench-inlined and prod will now show as one-side-fails. **Surfaced during 6th surge**: bench-tree-dnd-multi.mjs's inline `resolveTreeDrop` mirror at line 68 returned "inside-same-parent unreachable" — a pre-30th-pass shape, drifted from production. **Resolved 2026-05-06 (post-8th-surge)**: turned out the inline single-clone was dead code in the multi-bench (49 calls to `resolveTreeDropMulti`, 0 to `resolveTreeDrop`; the multi classifier bypasses it per its own twenty-seventh-pass refactor comment). Deleted the dead clone (~50 LOC) and updated the bench docstring; vitest 5341/5341 unchanged. The single-bench `bench-tree-dnd.mjs` was already in sync with thirtieth-pass. **Systematic dead-code sweep across all 40 benches** then ran: only 2 additional dead functions found, both bench-internal helpers (NOT lib mirrors) — `approxRatio` in `bench-constraints.mjs:168` (5 LOC, defined but never called) and `checkKind` in `bench-tree-dnd.mjs:177` (9 LOC, an alternate assertion helper that fell out of use; `check`/`checkReason` are still actively used). Both deleted; vitest still 5341/5341. **Audit conclusion**: the inline-mirror-drift concern raised by `02-tests.md` turned out to be a single specific instance, not a widespread pattern — the prod-import counterweight tests are the right approach for ongoing protection, not a wholesale bench refactor. Remaining: refactor the 40 `.mjs` benches themselves to import from the lib (requires `.ts` runner change OR build-step). Highest-priority remaining inline-mirror appeared to be `bench-tree-persistence.mjs`, but on inspection it inlines ~3000 LOC across `lib/tree-persistence.ts` (1199 LOC) AND `lib/storage-panel.ts` (2098 LOC) — far above the ~500 LOC originally estimated. The prod-import counterweight at `tests/tree-persistence-prod.test.ts` (554 LOC) already provides drift detection for the pure surface, so the value of the broader refactor is now lower than the infra-change cost. Still uncovered: `lib/templates.ts` (server-only `import "server-only"` + node:fs — not pure logic; needs fs mocks or jsdom), `lib/iframe-bridge.ts` (mostly types + postMessage helpers — limited pure surface), `lib/use-source-history.ts` (React hook — needs jsdom + RTL), `lib/layout-context.ts` (types-only — no runtime), `lib/preview.ts` (iframe-runtime — needs jsdom for proper coverage), `lib/asset-library/recent.ts` (IndexedDB-coupled), `lib/component-library/{client,html-to-jsx,search}.ts` (fetch + DOMParser + MiniSearch state — needs jsdom). **The pure-logic universe is now fully covered.**
- ✅ **jsdom integration tests — first one shipped 2026-05-07.** `tests/integration/iframe-click-to-select.test.ts` (6 cases) exercises the real `inspectorRuntimeJs` against a real DOM in HTML mode. Validates dropin:ready, dropin:tree, click→select payload contract, view-mode tool gating (regression for 2026-05-06 audit fix #3), nested-element resolveTarget walk, Escape→clear-selection. Vitest stays on `environment: "node"` — the integration test imports `JSDOM` from `jsdom` and instantiates per-test, so the rest of the 5341-case suite doesn't pay the env startup cost. **Follow-ups**: (a) JSX-mode click test needs CDN-script stubs (React/ReactDOM/Babel UMDs from unpkg) — deferred until forced; (b) extend the integration suite when manual-testing surfaces new regression-prone seams.

**Low — code-quality cleanup, can wait:**
- Strip remaining ~75 `// Thirty-N-pass chunk (xxx) —` attribution comments from `components/ElementTree.tsx` and `components/StorageHealthPanel.tsx`. Pass-history belongs in commits / archive, not function bodies. (~5 stripped 2026-05-05 as a representative sample.)
- Demote ~20 unused-externally exports from `lib/tree-persistence.ts` + `lib/storage-panel.ts` (parsers + serializers only called internally).
- ✅ Delete dead `partitionAllEntriesByOtherCollapse` — done 2026-05-05.
- ✅ Verify `components/ElementTree.tsx` file header — header rewritten 2026-05-05.

**Known gaps (require rule changes / hard tradeoffs — defer):**
- Bundle size + Tailwind purge correctness — verifying needs `next build` which is rule-5-banned.
- Next.js advisories — `npm audit` recommends 16.2.4 (SemVer-major), would break locked stack.
- Known bugs: view-mode click → double Workspace chrome; React duplicate-key warning from duplicate OIDs. Both deferred per user 2026-05-04.

