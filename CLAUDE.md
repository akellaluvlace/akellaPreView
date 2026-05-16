# CLAUDE.md

Project: **Dropin** — Next.js + Vercel site where vibecoders paste AI-generated HTML/JSX and see it render live, or pick from a gallery of templates. Audience: people with no terminal, no Node install, no dev background.

## Active branches (2026-05-15)

- **`main`** — codebase. Last commit `0878566 backup: web templates state before 94/10/32/16/69 batch`.
- **`audit-phase2-cascade-ids`** — long-lived feature branch. Audit work + UI/UX redesign + vibe-edit + image-context-fit audit + 2026-05-14 vibecoder simplification + 2026-05-14 PM inline browser + 2026-05-15 Move retirement + 2026-05-15 vibecoder feature batch (6 features). **20 commits ahead of main + 1 uncommitted session, all LOCAL ONLY — never pushed.** Full per-session log in `CLAUDE-archive-status.md`.

## Backup checkpoints (rollback refs)

| Date | Commit | Restore command | What it captures |
|---|---|---|---|
| 2026-05-15 | `d656e21` | `git reset --hard d656e21` | Pre-cascade-detach + pre-move-fix work. Vibe-edit 5-phase simplification + inline component browser + 2026-05-15 plans. Two new SVG logos. CLAUDE.md trimmed + archive. tsc 0, vitest 6291/6293. |
| 2026-05-10 | `c659862` | `git reset --hard c659862` | Pre-master-ID sweep snapshot (vibe-edit scaffold + audit-phase2 cascade work). Also tagged `backup/pre-master-id-sweep-2026-05-10`. |
| 2026-04-26 | `36ad297` | `git reset --hard 36ad297` | Initial publish — project source, audit docs, logo brief. The base before this branch diverged. |

## Current status (2026-05-16 — Try Variations retired, Apply button shipped, idle-commit routed through history, Shuffle field-name bug fixed. tsc 0. Uncommitted.)

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

## Current status (2026-05-14 — vibecoder simplification SHIPPED: toggle gone, Insert hidden, swap-anywhere wired, BG-image control for cards + sections, Plasmic-style cascade badge. 6291/6293 vitest, tsc 0.)

User-driven simplification of the no-code edit flow. Five surgical phases, all green tsc, no regressions. Scope: "we want to remove everywhere/instance toggle... insert feature as well... then any element should have swap function... every element where it makes sense should have background image replacement... fix the bug that if 3 cards in a same section and we change one icon it changes all".

### Phase 1 — Everywhere/Instance toggle REMOVED, locked to instance mode

- `propagationMode` state + localStorage persistence + setter all deleted from `Workspace.tsx`.
- Phase D cross-file branch + Phase F multi-instance preflight branch deleted from `handleClassChange` + `handleSwap`. Both code paths only fired when toggle === "everywhere".
- Imports of `findCrossFileDefinition` / `findInlineComponentDefRootOid` / `findAllInstancesOfDefinition` / `planEverywhereSwap` / `patchJsxClassByOid` / `createEdit` dropped from Workspace. `applyEditDirect` removed from `useEditHistory` destructure (no consumers left).
- `WorkspaceActions` segmented control + props (`propagationMode` / `onPropagationModeChange`) gone.
- **NB**: The Phase D/F **pure-logic libs** (`lib/swap/plan-everywhere-swap.ts`, `lib/ast/instance-graph.ts`, `lib/ast/cross-file-query.ts`, `lib/ast/component-def.ts`, `lib/edits/operations.ts` `createEdit` half, `lib/ast/patch-class-by-oid.ts` `patchJsxClassByOid` only) + their ~150 prod-import tests REMAIN. Dead-but-tested. Easy cleanup pass later — kept for now because removing covered code is regression risk for ~0 value.

### Phase 2 — Insert tool HIDDEN

- `TOOL_LIST` in `components/ToolBar.tsx` now `["view", "vibe", "move"]`.
- `'i'` keyboard shortcut removed; doc comment notes the retirement reason.
- Persisted `dropin:tool === "insert"` migrates to `"view"` on next mount (mirrors the existing `select` → `view` + `swap` → `view` migration path; consolidated to one if-arm).
- `Tool` union member + `insert` message type stay (internal callers still emit; matches `select`'s permanent-but-hidden status).
- All `lib/ast/operations/insert.ts` + insert-target tracking + LibraryModal insertContext code paths intact and untouched — only the visible button + keyboard binding hide.

### Phase 3 — Kind-aware Swap, everywhere

- New `vibeComponentSwapOpen` state. `handleVibeComponentSwapOpen` / `Close` / `Pick` callbacks (kind-agnostic — fires whatever element is currently selected).
- Third `LibraryModal` mount with `suggestedPanel: "components"`. Same outer-replacement flow as the existing icon + image modals (routes through `handleVibeOuterSwap`).
- New shared `SwapComponentButton` exported from `components/VibePropertiesPanel.tsx`. Rendered at the bottom of `TextControls` (text/heading/button), `LinkControls`, `CardControls`. Also replaces the inert plain-container hint with a Browse Components affordance.
- Icons + Images keep their kind-specific Browse buttons (icon library + media library). The new Components button is additive for the other kinds, not a replacement.
- Closes on pick + on selection-path change + on tool exit (all four modals: icon / image / component / bgImage).

### Phase 4 — Background-image control for cards + semantic sections

- `VibeElementInfo.bgImage?: string | null` field added (optional for backwards-compat with test fixtures).
- Iframe runtime's `vibeSerialize` reads `cs.backgroundImage`, parses `url("…")` / `url('…')` / `url(…)` → URL string OR null. Gradients / patterns return null (picker doesn't claim ownership). New helper `vibeParseBgImageUrl` next to vibeSerialize.
- Iframe runtime `vibeIsCardLike` split into two predicates: **`vibeHasCardChrome`** (bg / rounded / shadow / border — same as old vibeIsCardLike) used by the span-override walk-up; **`vibeIsCardLike`** = `vibeIsSemanticSection(el) || vibeHasCardChrome(el)` used by the post-editable-atom card-ancestor fallback. Decoupling avoids the regression where `<main><div><span>` would have its span hijacked into selecting `<main>` (kept the "standalone-span selects itself" integration test).
- Host-side `lib/vibe-edit/detect.ts isCardLike` extends with `SECTION_TAGS` Set (section / header / footer / main / aside / article / nav) so the panel routes section elements to CardControls instead of the inert hint.
- `StyleDelta.bgImageUrl?: string | null` added to `lib/vibe-edit/style-to-class.ts`. null/"" = strip; string = strip + add `bg-[url('…')] bg-cover bg-center bg-no-repeat`. New regex constants `BG_IMAGE_MATCH` / `BG_SIZE_MATCH` / `BG_POSITION_MATCH` / `BG_REPEAT_MATCH` strip conflicting Tailwind classes on rewrite. `encodeBgImageUrl` helper encodes `'` and `]` for safe Tailwind arbitrary-class wrapping; rejects `javascript:` / `data:` / `vbscript:` URL prefixes (XSS guard belt-and-suspenders).
- Workspace idle-commit drift detector extended with `bgImage` field check + `styleDelta.bgImageUrl` emission.
- New `handleVibeBgImagePick` extracts URL from Media-panel asset block via `/\bsrc=("…"|'…')/` regex, posts `vibe:update-style` with `backgroundImage` + `backgroundSize: 'cover'` + `backgroundPosition: 'center'` + `backgroundRepeat: 'no-repeat'`. Iframe instant visual update → idle commit picks up the drift → styleDelta lands in className. No iframe rebuild on edit.
- `handleVibeBgImageRemove` posts the same shape with empty values; drift detector → styleDelta.bgImageUrl=null → merger strips classes.
- `CardControls` gets a new "Background image" section with `info.bgImage` truncated current-value preview, Pick/Replace button, and Remove button (only renders when there's a current image). All routed via new `onBgImagePick` + `onBgImageRemove` props through `VibePropertiesPanel`.
- New BG-image `LibraryModal` mount with `suggestedPanel: "media"` + `onSwapWith={handleVibeBgImagePick}` (the standard outer-replace handler is bypassed — bg-image is NOT an outerHTML swap).

### Phase 5 — Plasmic-style "Editing all N copies" badge for cascading edits

Research finding before locking the design: industry-best-practice in mature React visual editors **is** cascade. Plasmic's docs explicitly: "edits are applied to the first replica only, those edits automatically propagate to all other replicas in the loop". Onlook (the visual editor the OID system was modelled on per `lib/ast/oids.ts`) has the same limitation. Auto-loop-expansion (the user's first instinct) would be multi-day AST surgery with brittle edge cases on `item.foo` references / nested maps / dynamic data / conditional keys — even mature tools don't ship it.

- Iframe runtime: new `vibeInstanceCount(oid)` does `document.querySelectorAll('[data-dropin-id="<oid>"]').length`. OIDs are 8 alphanumeric chars per `lib/ast/oids.ts` → safe to interpolate without escape. Returns 1 on no-OID / querySelector throw.
- `vibeSerialize` emits `instanceCount`. `VibeElementInfo.instanceCount?: number` optional field.
- `VibePropertiesPanel` renders coral info chip when `instanceCount > 1`: "**Editing all N copies** — This element appears N times. Changes apply to every copy." Hover title explains the architecture in vibecoder terms.
- No AST surgery. No auto-expansion. Vibecoder informed before editing instead of after reload-reverts everything.
- **Trap caught + recorded**: my chip-comment used backticks (`` `.map()` ``) inside the runtime template literal block → backtick closed the outer TS template at parse time, tsc threw `Property 'map' does not exist on type "…"` referencing the runtime emit string. Per `memory: ts_template_backtick_trap`. Stripped backticks from the comment + added a TODO-style warning at the top of the comment block.

### Files touched

**Production:**
- `components/Workspace.tsx` — toggle removal + 3 new swap-modal-state-handler-mount blocks + bgImage handlers + idle-commit extension. **Net diff**: -147 LOC removed (Phase D/F branches + toggle UI + propagation state/setter), +180 LOC added (3 swap-state lifecycles + bgImage flow). Single file, surgical changes.
- `components/ToolBar.tsx` — TOOL_LIST minus `insert` + comment update.
- `components/VibePropertiesPanel.tsx` — `onComponentSwap` + `onBgImagePick` + `onBgImageRemove` props; new `SwapComponentButton` shared component (exported); new instance-count chip; section-tag routing to CardControls.
- `components/VibePropertiesPanel/TextControls.tsx` + `LinkControls.tsx` + `CardControls.tsx` — Browse-components button wired. CardControls also gets the bg-image section.
- `lib/vibe-edit/types.ts` — `bgImage?` + `instanceCount?` fields on VibeElementInfo.
- `lib/vibe-edit/runtime.ts` — `vibeParseBgImageUrl` + `vibeHasCardChrome` extracted + `vibeIsSemanticSection` + `vibeInstanceCount` + extended vibeSerialize.
- `lib/vibe-edit/detect.ts` — `SECTION_TAGS` Set + extended `isCardLike`.
- `lib/vibe-edit/style-to-class.ts` — `bgImageUrl` field on StyleDelta + bg-image regex constants + merge branch + `encodeBgImageUrl` URL guard.

### Test totals at session close

- tsc 0 throughout (after the one backtick-trap fix mid-Phase-5).
- vitest **6291/6293** across **114** test files (was 6291/6293 at session start — same number, same documented envelope-channel jsdom flake fails). **Zero regressions**, zero new tests needed (pure UI/wiring changes + small pure-logic extensions covered by existing infrastructure).

### What's deferred

- **Dead-code sweep**: ~6 pure-logic lib modules + their ~150 prod-import tests are now uncalled from production. Listed in Phase 1 above. Estimated 30-60 min cleanup pass; low value vs the test-coverage-loss risk.
- **Cascade fix beyond the badge**: SPECCED 2026-05-15 — see `docs/superpowers/plans/2026-05-15-cascade-detach.md`. "Make this one different" user-triggered detach pattern. ~1-2 days when greenlit.
- **Manual browser testing**: scheduled post-lunch 2026-05-14. Surfaces to validate on user's existing 3001 dev server — checklist below.

### Post-lunch 2026-05-14 manual test checklist

User confirmed they're clearing context + testing manually after lunch. Run through these on the live preview at port 3001. Each line is one ~30s confirmation.

**Toolbar / chrome (Phases 1+2):**
- [ ] Workspace top chrome shows ONLY View / Edit / Move (no Insert button).
- [ ] No "Instance / Everywhere" segmented control next to the kind toggle.
- [ ] Pressing `i` does nothing (was Insert shortcut, now retired).
- [ ] If you had Insert as your persisted tool from before, opening a template lands you on View.

**Swap-anywhere (Phase 3):**
- [ ] Edit a template. Click any **heading** — properties panel shows text + colors + typography + **Browse components** button at the bottom.
- [ ] Click a **paragraph / text** — same: text + colors + Browse components.
- [ ] Click a **button** — same: text + colors + Browse components.
- [ ] Click a **link** — text + href + Browse components.
- [ ] Click a **card** (anything with bg/rounded/shadow/border) — bg color + corners + bg-image section + Browse components.
- [ ] Click a **plain wrapper div** — "this is just a wrapper" hint + Browse components.
- [ ] Click an **icon** — color picker + Browse icon library (unchanged behaviour).
- [ ] Click an **image** — src + alt + Open media library (unchanged behaviour).
- [ ] Browse-components button opens LibraryModal on the Components tab (not Icons / Media / Palettes).
- [ ] Picking a Components tile swaps the selected element's outerHTML in the iframe + persists to source after the 600ms idle commit.

**Background image (Phase 4):**
- [ ] Pick a card → "Background image" section shows "Pick image" button.
- [ ] Click "Pick image" → LibraryModal opens on Media tab.
- [ ] Pick a photo → card's background updates instantly in the iframe (cover + centered + no-repeat).
- [ ] CardControls now shows "Current: <url>" + "Replace" + "Remove" buttons.
- [ ] Click "Remove" → card's background image goes away.
- [ ] **Reload the page** → bg image is preserved in JSX mode (look for `bg-[url('...')] bg-cover bg-center bg-no-repeat` class in the source).
- [ ] Click an empty area of a `<section>` (any template's hero is a good candidate) → properties panel shows CardControls (NOT the inert hint).
- [ ] Section bg-image picker works the same way as card bg-image.
- [ ] Selecting a `<span>` inside `<main><div><span>` still selects the span (regression check — semantic-section detection didn't hijack the span-override walk-up).

**Plasmic cascade chip (Phase 5):**
- [ ] Open a `.map()`-heavy template (any of `05`, `07`, `10`, `11`, `12`, `13`, `14`, `16`, `18`, `19`, `20`, `100`, `101`, etc. — 30+ templates have heavy `.map()` use).
- [ ] Click a card / icon / image that appears multiple times in the rendered preview.
- [ ] Properties panel shows a **coral info chip** at the top: "Editing all N copies — This element appears N times. Changes apply to every copy."
- [ ] Hovering the chip surfaces the explanatory tooltip about `.map()` rendering.
- [ ] Click a singleton element (e.g. the H1 of a page) → chip does NOT appear.
- [ ] Edit a `.map()`-rendered icon → all N instances change (cascade is the intended behaviour; the chip just informs).

**Pre-existing functionality (regression check):**
- [ ] Typography sliders still work on text/heading.
- [ ] Icon color picker still cascades through inner paths (UI2 work from 2026-05-12).
- [ ] Pixabay tab is still the default Media source.
- [ ] Gallery still defaults to "Our Picks" filter.
- [ ] Undo / Redo still works.
- [ ] Tree / Code / Library panels still mount on the right rail.

**If anything fails:** capture the slug + the exact click sequence. Next session can diagnose without re-doing the setup.

### User-visible behavior changes

| Before | After |
|---|---|
| Edit mode shows segmented "Instance / Everywhere" toggle (disabled in HTML mode) | Toggle gone. Always instance. |
| Toolbar: View / Edit / Move / Insert | Toolbar: View / Edit / Move |
| Icon panel: Browse icon library | Same (unchanged) |
| Image panel: Open media library | Same (unchanged) |
| Text / heading / button: text + colors + typography sliders | Same + **Browse components** button at bottom |
| Link: text + href | Same + **Browse components** button |
| Card-like: bg color + corners | Same + **Background image** section (Pick/Remove) + **Browse components** button |
| Section / header / footer / main / aside / article / nav | Treated as card-like — get the FULL CardControls panel including bg-image |
| Plain container | "This is just a wrapper" hint | "This is just a wrapper" hint + **Browse components** button |
| Element rendered by `.map()`, edit it | Edit applies to all rendered copies (no warning) | Coral chip: **Editing all N copies** with explanation |

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

When the swap-category bug initially looked unfixable, added always-on `track()` / `console.log()` at every decision point. They proved useful for nailing the heuristic-vs-fallback gap and stay in for the next mysterious "doesn't always do anything" report:
- `[dropin:Workspace] setTool { next }` — tool button click reached state setter
- `[dropin:Workspace] vibe:selected { tag, kind, oid, path, classes }` — iframe selection reached host
- `[dropin:Workspace] vibe:component-swap-toggle { vibeInfoPresent, tag, oid, classes }` — Browse-components clicked
- `[dropin:Workspace] vibe:component-swap-context { tag, kind, classList, hint, suggestedCategory, categorySource, targetOid }` — heuristic decision visible
- `[dropin:ComponentsPanel] override-effect-fired { hydrated, initialCategory, initialCategoryKey, currentCategory }` + `setCategory →` (the OLD LibraryModal flow's ComponentsPanel still gets these logs; deprecated but the LibraryModal-for-icons/images still mounts it)
- `[dropin:iframe-vibe-click] tool=X target=Y` then `hit atom` / `hit card` / `no editable + no card ancestor → clear` — every iframe click logs which walk-up branch fired, including bail reason

### Files touched

**New**:
- `components/VibePropertiesPanel/InlineComponentBrowser.tsx` (~170 LOC — fetches index, filters by category, renders grid, hover popover, click→pick with Fragment wrap + bbox wrap + forceRebuild flag routing)
- `CLAUDE-archive-status.md` (145k) — older status blocks archived out of CLAUDE.md to keep it ~20k

**Edited**:
- `components/Workspace.tsx` — CSS comment fix (lines 2422, 2454); `inferSwapCategory` import + `isCardLike` import; `vibeComponentSwapContext` memo with Layer 1 + Layer 2 fallback; `handleVibeOuterSwap` accepts `opts.forceRebuild`; toggle (not just open) on `handleVibeComponentSwapOpen`; component-swap LibraryModal mount removed; new props passed to VibePropertiesPanel; diagnostic `track()` calls
- `components/VibePropertiesPanel.tsx` — accepts `componentBrowserOpen`/`componentBrowserCategory`/`onComponentPick`/`onWarn`/`mode` props; renders `<InlineComponentBrowser preserveBbox={info.bbox ?? null}>` at the panel bottom when open; SwapComponentButton `console.log` on click
- `components/library/asset-panels/ComponentsPanel.tsx` — `console.log` on override-effect-fired (legacy flow, still mounted via icon/image/bg LibraryModals)
- `lib/vibe-edit/runtime.ts` — `vibeSerialize` extended with `bbox`; iframe-side click handler logs every click + walk-up branch result
- `lib/vibe-edit/types.ts` — `VibeElementInfo.bbox?` field with margin × 4
- `lib/component-library/html-to-jsx.ts` — `SVG_TAG_MAP` (32 entries) + `SVG_ATTR_MAP` (50+ entries) + colon-attr handler in `mapAttrName`; recase applied at render time in `nodeToJsx`

### What's NOT working perfectly (per user "not perfect but working better")

- **Flex/grid context not preserved on swap** — see Same-dimension wrap section above. Wrapper takes abs-px width even when original was `flex: 1`.
- **Existing in-source picks pre-fix don't auto-heal** — any component already swapped to source.jsx during the broken-converter window is literal text in user-source.jsx now (with colon-attrs / lowercase SVG tags). Won't fix itself; user re-picks to clean up.
- **Single-root JSX components also get Fragment-wrapped + forceRebuild** — harmless but a tiny unnecessary rebuild. Could tighten the condition to only wrap when payload has multiple roots, but lossless wrap is cheaper than maintaining the branch.

## What's left — prioritized

**Now**: 2026-05-15 session work is uncommitted. Manual browser test of the 6 new vibecoder features + the relaxed shuffle-images filename fallback before commit.

**Deferred (low priority)**:
- **Visual-role disambiguation (Layer 3 swap-category fallback)** — see `memory/project_visual_kind_disambiguation.md`. HTML tag ≠ visual role: Tailwind-utility-styled `<a>` looks like a button or card; `<button>` styled as a link; `<input type="submit">`; `<div role="button">`. Current Layer 1 (token) + Layer 2 (kind+isCardLike) misses these. Proposed `inferVisualRole(info)` reads bg/rounded/bbox.height/padding/aria-role; wait for concrete failure case before implementing.
- **Flex/grid context preservation on component swap** — see PM session above. Wrap currently locks abs px; flex `flex-grow/shrink/basis` and grid `grid-column/row` are lost. Layer in if it surfaces.
- **Component re-pick to clean up pre-converter-fix in-source picks** — anything swapped during the broken html-to-jsx window has bad SVG markup in user-source.jsx; user re-picks to refresh.
- **Tighten Fragment-wrap + forceRebuild to multi-root JSX only** — currently applied to every JSX pick. Cheap unnecessary rebuild for single-root components.
- **Dead-code sweep of Phase D/F libs** — ~6 pure-logic modules (`lib/swap/plan-everywhere-swap.ts`, `lib/ast/instance-graph.ts`, `lib/ast/cross-file-query.ts`, `lib/ast/component-def.ts`, `lib/edits/operations.ts createEdit half`, `lib/ast/patch-class-by-oid.ts patchJsxClassByOid only`) + their ~150 prod-import tests are now uncalled from production after the 2026-05-14 toggle removal. Kept for now — removing covered code is regression risk for ~0 value. 30-60 min when there's appetite.
- **Cascade fix beyond the badge** — per-instance editing of `.map()`-rendered items via auto-expansion is the Plasmic-incompatible / multi-day path. Documented architectural limitation; revisit when there's appetite.
- **2026-05-11 PM 5-phase edit-flow-hardening plan** (`docs/superpowers/plans/2026-05-11-edit-flow-hardening.md`): Phase 1 (WU1 span walk-up — shipped per UI2 work 2026-05-12 per memory entry), Phases 2-5 (buildVibeCommit union / opacity slash form / TextControls debounce / rgbToHex extraction) still on the shelf.
- **PX5 (Pixabay write-through cache) + UI2 FULL Step 2 (styleDelta `iconFill` field)** — specced at `docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md`.
- **Pre-existing IDB records cleanup** — orphaned per-template records skipped on read but stay in browser storage.
- **`MANUAL-TEST-CHECKLIST.md` refresh** — the version at repo root is from before the UI/UX pass; redundant with the 2026-05-14 checklist above for the current vibe-edit surfaces.

**Specced plans ready to execute** (2026-05-15 design pass — code work greenlit when user says go):
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
