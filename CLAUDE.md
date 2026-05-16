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

## Current status (2026-05-16 PM — post-dinner polish shipped: tour refresh, success toasts, spinner, figure-bg fix, empty-state hint. CLAUDE.md cleaned + 2026-05-14 archived. tsc 0.)

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
- **2026-05-16 post-dinner polish** — `docs/superpowers/plans/2026-05-16-post-dinner-polish.md`. **CURRENT NEXT PLAN.** Six phases ranked by (value × safety): test-existing-surface (P0), refresh stale FirstOpenTour (P1), add success toasts on Shuffle/bg-Shuffle (P2), spinner animation on Shuffle button (P3), figure-bg-image overlay fix via `hasInnerImg` field (P4), lighter/darker slider via CSS filter injection (P5 — the one new feature), vibe-panel empty-state hint (P6). User direction: "what would actually add value without complicating things." Realistic ~1.5 hr without P5, ~2.5 hr with. STOP after each phase, manual-test, then proceed.
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
