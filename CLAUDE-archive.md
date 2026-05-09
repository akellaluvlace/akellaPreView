# CLAUDE-archive.md

Verbose context that was previously inlined in `CLAUDE.md` but turned read-only as features shipped. CLAUDE.md keeps short summaries + pointers; the long-form rationale and historical chronology live here. Read only when the relevant work is touched.

---

## Pointer details (moved 2026-05-02 from CLAUDE.md)

### Manipulation system progress

Rolling status — Phase 1 + Phase 2 + Phase 3 + Phase 4 polish + duplicate/delete + Phase 5 / Phase A+B+C + Phase 5 / C1.4+C2.3 (Insert/Swap inside FocusEditor isolated mode) + Phase 5 / palette-only modal entry from FocusEditor + Phase 6 ramps (Swap-with-preserve-children @23rd, Tree-DnD reorder/reparent @24th, Multi-element insert engine + LIVE UI + Tree-DnD keyboard accel @25th) all shipped; tsc 0, 29/29 benches, 867/867 vitest tests.

Source of truth: `~/.claude/projects/C--Users-nikit-akellaPreView/memory/project_manipulation_phase1_progress.md`. The "START HERE" block at the top names the recommended next sub-chunk and what's already in.

### AST operation engines

Pure modules under `lib/ast/operations/`:

- `style.ts` — `applyStyleProps` set/remove CSS via Tailwind arbitrary classes.
- `resize.ts` — `applyResize` width / height with intent-resolved basis.
- `spacing.ts` — `applySpacing` padding / margin.
- `reorder.ts` — `applyReorder` same-parent index change.
- `reparent.ts` — `applyReparent` cross-parent move + propsToRemove cleanup.
- `duplicate.ts` — `applyDuplicate` verbatim copy with fresh-OID minting; returns `newRootOid`.
- `delete.ts` — `applyDelete` element + leading-WS removal.
- `insert.ts` — `applyInsertChild` append asset under a parent OID; returns `insertedOid`.
- `swap.ts` — `applySwap` replace element with asset; default discard-children, opt-in `preserveChildren` splices source's children into asset root; returns `swappedOid`.
- `palette.ts` — `applyPalette` page or subtree color-family swap.

Helpers: `lib/ast/component-def.ts`, `lib/ast/patch-class-by-oid.ts`, `lib/ast/scope.ts` (Phase 5 propagation toggle + palette scope), `lib/ast/tree-dnd.ts` (pure `resolveTreeDrop(tree, dragOid, targetOid, position)` — maps DnD events to reorder|reparent|noop ops; consumed by ElementTree's row DnD).

Contract: every engine takes a source string + an op, returns `{ source, unchanged, reason }` plus operation-specific extras. Each has a sibling `scripts/bench-<name>.mjs` (29 benches total). Multi-element batched composition lives at the Workspace handler level (`handleReorderMulti`, `handleDuplicateMulti`, `handleSpacingMulti`, `handleInsertIntoMulti`, etc.) — covered by `bench-multi*.mjs` and `bench-insert-multi.mjs`.

### Phase 2 spec

`phase2-manipulation.md` — 9 steps + 14 acceptance criteria all green per seventeenth-pass status. Kept for reference.

### Phase 5 spec

`phase5-tools-isolation.md` — FULLY SHIPPED through twenty-third pass + Phase 6 ramps through 25th. Tools (View · Select · Move · Insert · Swap), read-only-first workspace, isolation centering, library Palettes section, BYO-key AI rewrite, breakpoint tabs, instance/everywhere toggle, Vitest+Prettier infrastructure, Next 14.2.33 bump — all 16 acceptance criteria green. Open `§5 (Open questions / future work)` when picking the next Phase 6 ramp.

### Direct-manipulation master spec

`maniuplation.md` — layers 1–6, toolchain, locked-out decisions.

### Template upgrade playbook

`template-upgrade-playbook.md` — when user pastes a batch of `http://localhost:3001/t/<NN>-<slug>` URLs and asks to add sections / make premium. Read `§O` first for the parallel-batch workflow (6 parallel subagents per batch, self-contained briefs, §A trap inoculation, audit greps, NOVEL LAYOUT MENU). Memory pointer: `~/.claude/projects/C--Users-nikit-akellaPreView/memory/project_template_upgrade_2026_05_01.md` lists templates already touched + what to skip on resume.

### Layout rule — sticky-photo + scrolling-text columns must bottom-align (moved 2026-05-04 from CLAUDE.md rule 7)

When `md:col-span-5 md:sticky md:top-32` sits beside a long `md:col-span-7` text column, drop sticky and use `flex flex-col h-full md:justify-between gap-N` with 3–5 children (image + spec card + image + ledger panel). "Fill the empty space" = align the column bottoms — adding a card *inside* a still-sticky wrapper doesn't fix it. See playbook `§B.4.1` for the canonical fix recipe.

---

## JSX template hand-conversion — full per-file checklist

> Status as of 2026-04-27: hand-conversion is **complete** for `web/1-*` … `web/100-*`, JSX↔HTML parity confirmed by the user. Treat any single-file mismatch as a localized bug in that one file — do not assume the auto-converter drifted, do not re-run `scripts/html-to-jsx.mjs`.

### Why the auto-converter output is unusable

`scripts/html-to-jsx.mjs` runs across every `web/*.html` and emits a 200 KB+ `web/*.jsx` that compiles but is unusable as a Dropin template. It expands every Tailwind config color into a giant compensating CSS block (one rule per `bg-/text-/border-/from-/via-/to-/fill-/stroke-/...` × every color × every opacity). The auto-output also keeps `<title>`, duplicate `<link>` tags, and a `{/* head: ... */}` placeholder comment, and writes `function Name() { ... } export default Name;` instead of `export default function ...`.

A "completed" file is a hand-rewrite the user has signed off on. Reference completed files: `web/1-aether.jsx`, `web/2-saas-light.jsx`, `web/4-ai-product-landing.jsx`, `web/05-mobile-app-landing.jsx`, `web/06-product-launch-page.jsx`, `web/08-apple-style-hero.jsx`, `web/09-video-background-style.jsx`, `web/10-split-screen.jsx`, `web/11-long-form-sales-letter.jsx`, `web/12-minimalist-product-store.jsx`, `web/13-editorial-fashion-style.jsx`, `web/14-tech-gadget-store.jsx`. Match their shape exactly.

### Per-file conversion checklist

1. Read `web/<NN>-<slug>.html` (the source of truth — the auto-jsx is mostly noise).
2. Read the first ~5 lines of the auto-generated `web/<NN>-<slug>.jsx` to confirm the auto-name (you'll replace it).
3. Write a fresh JSX with this shape:
   - `export default function T<NN><PascalCaseSlug>() { ... }` (numeric NN preserves order; `T` prefix avoids leading-digit identifiers).
   - At the top of the function body, hoist repeated structures (nav links, products, testimonials, footer links, table rows, color/size options, comparison rows, etc.) into local `const arr = [...]` arrays. The body then renders them with `.map(item => ...)`. This is what shrinks 200 KB of repetition into a readable component.
   - Return a fragment containing: the `<link>` tags for fonts (preconnect + Google Fonts + Material Symbols if used), the Tailwind CDN `<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries">` if the source had it, the tailwind config as `<script type="text/plain" dangerouslySetInnerHTML={{ __html: \`...\` }} />`, optional `<style dangerouslySetInnerHTML=...>` for any author CSS, then the body wrapped in a `<div>` carrying the original `<body>` classes.
4. Tailwind config compression: keep entries on tight single lines (e.g. `"on-error": "#ffffff", "on-primary": "#ffffff", ...`); drop the deep `{ "lineHeight": "...", ... }` indentation. Drop colors / spacing / fontFamily entries that the body never references — when in doubt keep them.
5. **Delete the giant compensating `<style>` CSS block** the auto-converter emits. The Tailwind CDN reads the inline config script and generates the utilities at runtime.
6. Drop the `{/* head: preserved styles/scripts/links/titles */}` placeholder comment, the `<title>`, and any duplicate `<link>` tags.
7. HTML entity → real character: `&amp;` → `&`, `&#123;` → `{`, `&#125;` → `}`, etc. Keep raw `{` / `}` only when they are JSX expression delimiters.
8. `class=` is already `className=` in the auto-output, but inline `style="..."` needs to be a JSX object — the auto-converter handles this; just sanity-check.
9. Self-closing void elements (`<img />`, `<input />`, `<link />`, `<br />`) — already correct in auto-output; preserve.
10. Drop empty / no-op CSS classes the auto-converter passed through verbatim that aren't real Tailwind (e.g. `flat`, `no shadows`, `docked`, `tonal shift from zinc-950 to black with 1px stroke`, `full-width`) — these are AI-comment noise that snuck into the source.
11. `<html class="...">` classes (e.g. `dark`, `scroll-smooth`, `snap-y`) belong on your outer wrapping `<div>` along with the `<body>` classes — the iframe preview wraps everything in its own `<html>` so they would otherwise be dropped.
12. When the same JSX shape repeats with non-trivial markup (e.g. case-study tiles with images + captions + meta), define a small inner component (`const Tile = ({ p }) => (...)`) and `.map(p => <Tile key={p.id} p={p} />)` instead of inlining a multi-line template inside `.map`. The plain-array + `.map` pattern from step 3 still applies for short repeated nodes; the inner component is for when the rendered chunk is long enough that inlining hurts readability. See `web/19-minimalist-portfolio.jsx` for the pattern.
13. Same trick at finer granularity: if a tiny shape repeats many times across the body (e.g. a section heading + `<hr>` rendered 7 times across a résumé, or a bullet `<li>` with a leading em-dash), define a one-line `const SectionHead = ({ children }) => (...)` / `const Bullet = ({ children }) => (...)` and reuse it. See `web/25-resume-cv-site.jsx`.
14. For optional external-link attrs, prefer per-attribute conditional values that fall back to `undefined` (React skips an attribute when its value is `undefined`): `<a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined}>`. **Do NOT use the JSX spread form** `{...(cond ? { target: "_blank", rel: "noopener noreferrer" } : {})}` — under Babel-standalone (the preview iframe runtime) the spread can trigger a `_extends` infinite-recursion / "Maximum call stack size exceeded" the moment that JSX neighborhood gets rich enough. Templates 48 and 50 hit it; 25 / 26 / 32 / 98 were rewritten preemptively on 2026-04-27 to use the conditional-attribute form.
15. Inline init scripts (`<script dangerouslySetInnerHTML={{ __html: ... }} />`) **must NOT wrap their body in `document.addEventListener('DOMContentLoaded', ...)`** — `lib/preview.ts` re-emits these scripts only after React has mounted, by which point the iframe's `DOMContentLoaded` has long since fired and the listener silently never runs. Run the body directly in an IIFE: `(function () { ... })();`. If the script depends on a UMD that may still be loading (lucide, AOS, Chart.js), use a small `setTimeout(init, 50)` or a polling pattern (`if (typeof lib !== 'undefined') run(); else setTimeout(loop, 50);`). 72 / 76 / 79 / 80 were fixed on 2026-04-27 — see `web/68-bento-grid-dev.jsx` for the polling shape.

**Do NOT** ingest these into `templates/<slug>/` yet. The hand-conversion happens in-place in `web/`. Ingest is a separate later step (it reads `web/*.jsx`, builds the `templates/` registry, and renders thumbs).

### Pacing notes (when this is recurring work)

Each file consumes ~30–50 K tokens (read HTML + write JSX). A single session realistically fits 4–8 files before approaching context-window risk. When you've used roughly 70 % of the context window, stop, write a checkpoint message in the exact format the user expects, and tell the user to `/clear` and ask "continue converting auto-converted JSX templates from where you left off". Re-detect via:

```bash
ls -lt web/*.jsx | tail -n +1
# Files dated Apr 24 09:56 with size > 100 KB are unconverted.
# Files with newer mtime + size 15–60 KB are completed.
```

The mtime+size heuristic is not 100 % reliable. The auto-memory `project_jsx_template_conversion.md` is the authoritative list. When they disagree, ask before re-doing work.

---

## Manipulation-system chronology (Phase 1 + Phase 2 4a–4d)

Detailed chronology lives in the auto-memory file `~/.claude/projects/C--Users-nikit-akellaPreView/memory/project_manipulation_phase1_progress.md` — read it FIRST before touching the manipulation system. Its top "START HERE" block names the next concrete chunk.

**Tenth-pass status (2026-04-29):** Phase 1 + polish #1/#2 + Phase 2 (4a) visual handles + (4b) single-handle resize gesture + (4c-i) min-content elastic + (4c-ii) aspect-lock (Shift) + center-resize (Alt) + (4c-iii) snap system + (4d) padding/margin handles ALL shipped.

**What works visually:** every selected JSX element with a `data-dropin-id` shows the coral outline + 8 size handles + 4 padding handles (dashed coral inside) + 4 margin handles (dashed gray outside). Drag any size handle: element resizes live with `style={{ width, height }}` rewrite on commit (Shift = aspect lock, Alt = center-resize, Cmd = disable snap). Drag any padding/margin handle: per-side longhand `style={{ paddingTop, ... }}` rewrite on commit (Alt = symmetric). Snap engages within 4 px of any candidate (sibling edge / parent edge / parent-content edge / common width-or-height / 8-px grid multiple); active snap shows a color-tinted chip below the bbox + 1 px guide lines for sibling/parent edges. Below intrinsic min-content the resize drag rubberbands. Press / release modifiers mid-drag without moving the mouse — visual updates immediately. Esc / window blur / pointer cancel all teardown cleanly. Cmd-Z reverts.

**Bench coverage:** 86/86 cases passing across five benches — `scripts/bench-resize.mjs` (8/8), `scripts/bench-spacing.mjs` (12/12), `scripts/bench-gesture.mjs` (29/29), `scripts/bench-snap.mjs` (25/25), `scripts/bench-oids.mjs` (12/12).

**Module map (don't re-implement what's already shipped):**

- `lib/ast/oids.ts` — `injectOids` / `stripOids` / `makeOid` (offset-seeded base-62, deterministic for SSR/hydration parity).
- `lib/ast/query.ts` — `buildIndex(source) → AstIndex` (findById / parent / children / siblings / ancestors / all).
- `lib/ast/index.ts` — public surface.
- `lib/ast/intent-resolver.ts` — Phase 2 Layer 3. `SizeHandle` / `SpacingHandle` types + `resolveResizeIntent` / `resolveSpacingIntent` (still scaffolding; gesture handler bypasses to call `applyResize` / `applySpacing` directly).
- `lib/ast/gesture-math.ts` — pure cursor→dim / cursor→spacing math. `computeDims` (resize), `applyElasticDim`, `captureAspect`, `isCornerHandle`, `handleAxes`, `computeSpacing` (4d).
- `lib/ast/snap.ts` — pure snap module. `snap(state, desired, candidates, opts)` + `buildResizeCandidates` + `buildSpacingCandidates`. Hysteresis 4/8 px, kind-priority sibling > parent > common > grid, Cmd-disable, grid fallback.
- `lib/ast/operations/resize.ts` — `applyResize(source, op)` magic-string byte-overwrite that adds/updates inline `style={{ width, height }}`. Bails on `style={cn(...)}` / missing OID / parse failure.
- `lib/ast/operations/spacing.ts` — `applySpacing(source, op)` per-side `paddingTop/Right/Bottom/Left` or `marginTop/...`. Coexists with `padding` / `margin` shorthand (longhand wins in cascade).
- `lib/use-source-history.ts` — `useSourceHistory` hook. 50-entry ring buffer with time+size coalescing (300 ms / 50 char). Single source of truth — Monaco's internal undo bound to host stack via `editor.addCommand`.
- `lib/layout-context.ts` — Phase 1 `LayoutContext` shape (bounds + padding/margin + layoutRole + parent + constraints + ≤50 siblings).
- `components/SelectionOverlay.tsx` — host-side bbox-tracked overlay. Coral outline + 8 size handles + 4 padding (inside, dashed coral) + 4 margin (outside, dashed gray). Pointerdown captures pointer + disables iframe pointer-events + fires async pre-fetches (`requestMinContent` + `requestLayoutContext`). Per-frame `setLiveStyle` paints optimistic preview. Pointerup runs `applyResize` / `applySpacing`. Single chip below bbox shows snap label OR "Min: Xpx" constraint. Cancel paths (Esc / pointercancel / lostpointercapture / blur / visibilitychange / unmount) clear live stylesheet + chip + active snap.
- `components/Preview.tsx` — `PreviewHandle` exposes `requestLayoutContext` / `requestMinContent` / `watchBbox` / `setLiveStyle` / `clearLiveStyle` via `onReady` callback. `resizeBindings` / `spacingBindings` composed and passed to SelectionOverlay only when `onResize` / `onSpacing` props are wired.
- `components/Workspace.tsx` — owns `code` state (via `useSourceHistory`), source-state init lazy-injects OIDs (deterministic — SSR-safe), mid-session paste re-inject debounced 300 ms, group-roots auto-detect (`/^[A-Z]/.test(tagName)`), Cmd+Z window handler.
- `lib/preview.ts inspectorRuntimeJs` — iframe runtime. `dropinComputeLayoutContext`, `dropinComputeMinContent`, `dropinAddWatch` / `dropinFlushAllWatches` (rAF-coalesced ResizeObserver + MutationObserver + capture-scroll + window-resize), Track A managed `<style id="dropin-live">` with `dropinSetLiveStyle` (replace-not-merge per call).

**Modifier reference:**

| Modifier | Resize gesture | Spacing gesture |
|---|---|---|
| Shift | Aspect lock — corners pick dominant axis, edges derive perpendicular from start aspect | No-op in v1 |
| Alt | Center-resize — doubles cursor delta on each affected axis | Symmetric — opposite side gets same delta (and snapped delta cascades to opposite) |
| Cmd / Ctrl | Disables snap | Disables snap |

All three stack. Window-level keydown/keyup re-fires the move math at the gesture's cached `lastClientX/Y` so modifier toggles update the visual without a mouse move.

**Snap visual cues:** color-tinted chip below bbox: green=sibling, blue=parent / parent-content, coral=common, muted=grid. Sibling/parent edge snaps draw a 1 px guide line in iframe-viewport coords spanning both rects' perpendicular range. Common/grid snaps surface via chip only.

**Known limitations carried forward:**

1. Shift+snap aspect break by 1-2 px (snap runs after computeDims; perpendicular axis already derived). Cmd is the v1 escape.
2. Alt center-resize on in-flow elements grows / shrinks 2× faster than cursor but doesn't truly center-anchor visually (we don't write `position` adjustments). A future `AdjustPosition` operation engine would close the gap.
3. `auto` margin → numeric coercion not yet supported (LayoutContext.margin reports 0 for `auto`).
4. Sub-20 ms `requestLayoutContext` race: gestures that release before context lands snap to grid only / spacing gesture is a no-op.
5. Recent values, baselines, cross-section, multi-element snap are all spec'd (`phase2-manipulation.md` Step 6 line 138-141) but deferred. v1 covers grid + common + sibling + parent + parent-content.
6. Cursor-proximity fade-in for spacing handles deferred (always 0.7 default opacity, hover lifts to 1).

---

## Click-to-edit inspector (extension beyond plan.md) — full architecture details

The condensed summary lives in CLAUDE.md. This is the long-form rationale.

### JSX loc protocol

A Babel plugin registered inside the preview iframe walks every `JSXElement` and injects `data-dropin-loc="startLine:startCol:endLine:endCol:openEndLine:openEndCol"` into the opening tag. React passes `data-*` props through, so every rendered element carries its exact source range. Babel lines are 1-based on the wrapped source (`(function(){\n` + userSrc + `\n})()`) and the plugin subtracts 1 to land on user-source lines. Stripping of `import` / `export default` / `export` is **length-preserving** so Babel's columns still match the user's source.

### HTML loc protocol

No loc attr. Iframe reports clicked element by DOM path (element-only child indices from `<html>` down). Host re-parses with `parse5({ sourceCodeLocationInfo: true })` to get exact `startTag` / `endTag` / per-attribute source offsets.

### Bridge

`postMessage` only; sandbox stays `allow-scripts allow-same-origin allow-popups allow-forms`. Messages are tagged with `__dropin: true`.

### Selection persistence

The host remembers the last loc; on each iframe reload it posts `dropin:reselect` once the iframe sends `dropin:ready`. Phase 1 OID-keyed: `ElementSelection` carries `oid: string | null`; iframe's `dropinApplyReselect` tries `document.querySelector('[data-dropin-id="..."]')` first and falls back to the existing line:col prefix matcher only when OID lookup misses. HTML mode + JSX elements that pre-date OID injection use the loc fallback unchanged.

### Inline text editing

Double-click an element with only text children → `contenteditable` + select-all. Commits on blur / Enter / Esc, posts `dropin:text-commit`, host patches source.

### Inspector writes for `className`-on-dynamic-expression are blocked at the patch layer

Editing a class on `className={cn(...)}`, `` className={`bg-${x}-500`} ``, `className={styles.card}`, or `className={props.className}` returns `unchanged()` with reason `"attribute className not writable (dynamic expression?)"` so the inspector can surface a non-blocking warning. Other expression-valued attrs (`style={{...}}`, `onClick={...}`) still get the destructive normalize-to-string behaviour — that's intentional. Full classifier (cn() argument append, conditional / TemplateLiteral / Opaque taxonomy, chip UI) ships in Phase 4.

### `data-dropin-id` host-side AST modules

`lib/ast/{oids,query,index}.ts`. `injectOids(source)` parses with `@babel/parser`, walks every `JSXOpeningElement`, and length-preserving-splices ` data-dropin-id="<8 alnum>"` after the tag name where missing. Idempotent. `stripOids(source)` is the inverse for the future "Download clean source" / "Show source to LLM" paths. `buildIndex(source)` produces an `AstIndex` with `findById / parent / children / siblings / ancestors / all`.

`Workspace.tsx` lazy-inits its `code` state with `injectOids(initialCode).source` when `initialKind === "jsx"`, so OIDs flow into Monaco on mount and survive re-renders. Copy / Download / Copy-element strip OIDs on the way out via `stripOids` so users never see them in exported source. The `data-dropin-id` attribute coexists with the existing `data-dropin-loc` for the entire Phase 1 → Phase 4 window; loc stays volatile and owned by the existing Inspector / `lib/source-patch-jsx.ts` path.

### Layer 2 Layout Inspector iframe-side query

`lib/preview.ts inspectorRuntimeJs` exposes `dropinComputeLayoutContext(oid)` which returns the `LayoutContext` shape from `lib/layout-context.ts`. Driven by a `dropin:get-layout-context { oid, requestId }` request; iframe responds with `dropin:layout-context { requestId, context }`. `Preview.tsx` exposes a `requestLayoutContext(oid): Promise<LayoutContext | null>` helper via `onReady` callback (PreviewHandle pattern). 1s timeout fallback resolves null. Pending requests are flushed on srcDoc rebuild.

### Source-level undo/redo

`lib/use-source-history.ts` replaces the Workspace's raw `useState<string>` for `code`. Every host-side `setCode` enters a 50-entry ring-buffer past stack with time+size coalescing: edits within 300 ms AND under 50-char source-length delta merge into one entry; larger or later edits open new entries. **Two reach paths to host undo**: window-level Cmd+Z handler in Workspace (gated via `isTextEditField`), AND a Monaco-internal `editor.addCommand` registration in `Editor.tsx handleMount` that overrides Monaco's default Cmd+Z. **Single source of truth = host stack**; Monaco's internal undo stack is ignored because it's reset every time the host pushes a state update via `setValue`.

### Group-roots host-side auto-detect

`Workspace.tsx` walks `buildIndex(code).all()`, filters for nodes whose `tagName` starts with an uppercase letter (React component boundaries), maps to OIDs, memoizes on `[code, kind]`. Posted via `dropin:set-group-roots { oids: string[] }`. Iframe maintains a `dropinGroupRootOids` Set and `dropinFindGroupRoot(el)` walks ancestors checking BOTH `data-dropin-group` attribute AND OID-set membership; closer ancestor wins.

### OID-primary selection state

`Preview.tsx`'s `lastReselectKeyRef: string | null`. Dedupe key is `oid:<id>` when an OID is available, else `jloc:<encoded-loc>` / `hloc:<dot-path>`. Avoids redundant reselect post when a source edit shifts the element's loc but not its identity.

### Live bbox subscription

`lib/preview.ts inspectorRuntimeJs` adds a per-frame rAF-coalesced bbox push system: `dropinAddWatch / dropinRemoveWatch / dropinFlushAllWatches`. First watch attaches a single `ResizeObserver(document.body)` + `MutationObserver` + capture-phase scroll listener + window resize listener. All four feed `dropinScheduleWatchFlush()` which `requestAnimationFrame`s a single `dropinFlushAllWatches` call per frame; the flush iterates every sub, re-resolves the element by OID, computes `getBoundingClientRect()`, and posts `dropin:bbox` only when the rect changed (per-component dedupe via `lastRect` cache). `PreviewHandle.watchBbox(oid, callback)` returns an unsubscribe.

### Mid-session paste re-inject

`Workspace.tsx` adds a debounced (300 ms) effect that calls `injectOids(code)` and applies any resulting `insertions` array via `EditorHandle.applyEditsByOffset(edits, label)` on Monaco. JSX-mode-only. The Monaco edit goes through `executeEdits` so it adds ONE entry to Monaco's internal undo stack. The HOST undo stack skips the re-inject entirely via `setCodeSilent` gated by `suppressHistoryRef`. **Result: pasted JSX is selectable / overlayable / group-rootable within ~550 ms** of the user pausing typing.

### Host-side selection overlay

`components/SelectionOverlay.tsx` consumes `previewHandle.watchBbox(selectedOid, cb)` and renders a positioned label badge anchored to the selected element. `Preview.tsx` wraps the iframe in a `<div className="relative h-full w-full overflow-hidden">` so iframe and overlay share a (0,0) origin. Hide states: `selectedOid == null` (HTML mode + pre-OID JSX → no host overlay, in-iframe outline still works), `rect == null` (OID exists in source but not in DOM), `w === 0 && h === 0` (mobile pane hidden via `display: none`).

### Phase 2 stages — already shipped

(4a) visual handles only — coral outline + 8 size handles. In-iframe outline rule scoped to `[data-dropin-selected]:not([data-dropin-id])` to avoid double-stacking.

(4b) single-handle resize gesture — full pointer→source pipeline with Track A managed stylesheet.

(4c-i) min-content elastic resistance — `requestMinContent` async fetch at pointerdown, rubberband below the bound, snap-to-bound on commit, "Min: Xpx" chip while constrained.

(4c-ii) aspect-lock + center-resize — Shift on corners + edges locks aspect (matches Figma); Alt doubles delta. Both stack with live keydown/keyup re-fire.

(4c-iii) snap system — pure module + gesture wiring + visual feedback. Hysteresis 4/8 px, kind-priority, Cmd-disable, grid fallback. Color-tinted chip + 1 px guide lines.

(4d) padding/margin handles — full pointer→source pipeline for spacing. 4 padding (inside) + 4 margin (outside) dashed handles. Alt symmetric. Async baseline via `requestLayoutContext`.

### Known failure modes

Structural edits in Monaco (adding/removing lines that shift the selected element) drop the selection — user re-clicks. Multi-line import handling is fixed (the import handler uses `Babel.parse` per `lib/preview.ts processModuleSyntax`).

---

## Locked stack

- Next.js **14.2.5**, App Router
- TypeScript strict
- Tailwind **3.4.x**
- `@monaco-editor/react` **4.6.x**, lazy-loaded client-only via `next/dynamic({ ssr: false })`
- Google Fonts via `next/font/google`: **Fraunces** (display), **Instrument Sans** (body), **JetBrains Mono** (mono). CSS vars: `--font-fraunces`, `--font-instrument`, `--font-jetbrains`
- Preview runtime: iframe with `srcDoc`, loading React 18 UMD + Babel standalone + Tailwind CDN from unpkg/cdn.tailwindcss.com
- **parse5** for HTML source-range mapping in the inspector (host-side only, not loaded in the iframe)
- Deploy: Vercel, zero config
- **No** backend / DB / auth / API routes. Static is fine.

### Pins for the manipulation / inspector stack

- **`@babel/parser` ^7.29.2** + **`@babel/types` ^7.29.0** — already installed. The AST layer for the new direct-manipulation system (`maniuplation.md` Layer 1) is Babel, **not swc**. Sync, ~78 KB gzip, parses our largest templates in <5 ms.
- **`tailwind-merge` MUST pin to `2.6.0`** when added (Phase 4 of `maniuplation.md`). Version 3.x targets Tailwind v4 only; we are on Tailwind 3.4.x. Do **not** auto-upgrade.
- **`magic-string` ^0.30.x** — the byte-overwrite serializer for source rewrites. Lossless on no-op edits. Reserve `recast` for the rare structural rewrite (extract component, wrap in parent, move subtree); it has documented JSX whitespace bugs that disqualify it as the default printer.

### Locked OUT (do NOT add)

- **No SWC plugins.** Stable IDs are minted at parse-time in the editor runtime via `@babel/parser` + `@babel/types`, in pure JS. Reasons: paste-JSX-into-textarea has no user build pipeline; SWC plugins can't run in the browser; Onlook (the only OSS peer) does it via Babel walk too.
- **No CRDT / Yjs.** Multi-user editing is not on the 12-month roadmap. Permanent complexity tax for a feature that may never ship.
- **No host-side ghost overlay for the dragged element.** Selection chrome is host-side overlay. The element itself is mutated in-iframe via `<style id="dropin-live">` managed stylesheet.
- **No AI in the gesture handlers.** Drag, click, keypress on a property — pure deterministic Layer 3 → 4 → 5. AI lives in Layer 6 (Cmd-K palette, chat lane), invoked explicitly.
- **No custom Tailwind class engine** beyond `tailwind-merge` + `clsx` + a thin AST-aware wrapper.

## Palette (Tailwind)

```
paper  #F5F1EA   warm cream bg
ink    #0F0F0F   near-black for type and borders
coral  #FF4D2E   the one accent — use sparingly
muted  #8C847A   subdued text
soft   #EDE6D9   slightly darker than paper, for panels
card   #FFFFFF   pure white for cards + iframe backdrop
```

Aesthetic: editorial brutalist — independent magazine, not SaaS dashboard. Heavy black borders, serif display paired with mono labels.

## File layout

```
app/
  layout.tsx
  globals.css
  page.tsx                    # Landing + gallery
  playground/page.tsx         # Blank paste-your-own
  t/[slug]/page.tsx           # Template editor
components/
  Editor.tsx     Preview.tsx     PreviewModal.tsx
  TemplateCard.tsx   Workspace.tsx
  FocusEditor.tsx   ToolBar.tsx   KindToggle.tsx
  SelectionOverlay.tsx           # host-side bbox-tracked overlay (coral outline + 8 size + 8 spacing handles)
  ast/PropertiesPanel/           # Phase 2 Step 9 — pixel-precise spacing/sizing/radius sections (Figma-style, OID-based)
  library/                       # Asset library — Sidebar shell + 4-tab + 15 sub-panels
lib/
  templates.ts          server-only, uses fs — never import from a client component
  preview.ts            builds preview iframe doc + embeds Babel loc plugin + inspector runtime
  iframe-bridge.ts      postMessage protocol types
  layout-context.ts     Layer 2 LayoutContext shape (bounds + padding/margin + layoutRole + parent + constraints + siblings)
  source-patch-jsx.ts   class / attr / text patchers keyed by JsxLoc
  source-patch-html.ts  same, uses parse5 sourceCodeLocationInfo keyed by DOM-path
  use-source-history.ts useSourceHistory hook — host-side undo/redo, time+size coalescing, MAX 50 entries
  ast/                  manipulation system Layer 1+3+4 — host-side AST modules
    oids.ts             injectOids / stripOids / makeOid (offset-seeded base-62, deterministic)
    query.ts            buildIndex(source) → AstIndex
    index.ts            public surface
    intent-resolver.ts  Phase 2 Layer 3 typed Intent space + resolveResize / resolveSpacing
    gesture-math.ts     pure cursor→dim / cursor→spacing math
    snap.ts             pure snap module (hysteresis 4/8 px, kind-priority, grid fallback)
    operations/style.ts    applyStyleProps — generic single-element style-prop rewrite (write/remove/leave-alone)
    operations/resize.ts   applyResize — thin wrapper over applyStyleProps for width/height
    operations/spacing.ts  applySpacing — thin wrapper over applyStyleProps for per-side padding/margin
  style-source-read.ts  readSourceStyle(code, oid) — parses source, returns OID's current inline-style declarations
templates/
  hero-landing/   product-card/   coming-soon/
    meta.json   source.{jsx,html}
```

## Click-to-edit inspector — condensed summary

A third workspace pane lets the user click any rendered element and edit it. Mechanism in brief (full details earlier in this archive):

- **JSX loc**: a Babel plugin in the iframe injects `data-dropin-loc` on every JSXElement (line:col source range).
- **HTML loc**: iframe reports clicked element by DOM path; host re-parses with `parse5` for source offsets.
- **OIDs**: `data-dropin-id` (8-char base-62) injected at parse-time by `lib/ast/oids.ts injectOids`. Deterministic (offset-seeded) — SSR/hydration safe. Coexists with `data-dropin-loc`.
- **Bridge**: `postMessage` only; sandbox `allow-scripts allow-same-origin allow-popups allow-forms`.
- **Selection persistence**: OID-keyed reselect on iframe reload; loc fallback for HTML / pre-OID JSX.
- **Inline text editing**: double-click → contenteditable → `dropin:text-commit`.
- **Inspector blocks `className`-on-dynamic-expression** writes (`cn(...)`, template literal, prop-forward) at the patch layer. Other expression-valued attrs still get destructive normalize-to-string.
- **Layer 2 layout query**: `dropinComputeLayoutContext(oid)` returns the `LayoutContext` shape (bounds + padding/margin + layoutRole + parent + constraints + ≤50 siblings). Driven by `dropin:get-layout-context`.
- **Live bbox subscription**: rAF-coalesced ResizeObserver + MutationObserver + capture-scroll fed into `dropin:bbox` per-sub. Host's `PreviewHandle.watchBbox(oid, cb)` returns an unsubscribe.
- **Source-level undo/redo**: `useSourceHistory` 50-entry ring with 300 ms / 50-char coalescing. Cmd+Z works inside Monaco (rebound via `editor.addCommand`) AND outside (window handler gated on `isTextEditField`).
- **Group-roots auto-detect**: capitalized JSX tag names → OIDs → posted via `dropin:set-group-roots`. Iframe walks ancestors checking BOTH `data-dropin-group` AND OID-set membership.
- **Mid-session paste re-inject**: 300 ms debounced; commits via `applyEditsByOffset` on Monaco (one Monaco-undo entry, host-stack skipped via `suppressHistoryRef`).
- **Host-side SelectionOverlay** subscribes to `watchBbox` and renders coral outline + 8 size handles + 8 spacing handles. Phase 2 (4b) wires resize gesture; (4c-i) min-content elastic; (4c-ii) Shift aspect-lock + Alt center-resize; (4c-iii) snap system; (4d) padding/margin gesture; eleventh-pass cursor-proximity fade-in for spacing handles.
- **Properties Panel (Phase 2 Step 9)**: pixel-precise sizing/spacing/radius sections inside FocusEditor. Numeric inputs with px/rem/em/%/auto unit dropdowns. 4-side / 4-corner visual controls with link toggles. Reads via `readSourceStyle`, commits via `applyStyleProps` through `Workspace.handleSetStyleProps`.

## Gotchas that WILL bite

1. **Monaco breaks SSR.** Always `dynamic(() => import("./Editor"), { ssr: false })`. Never static-import Monaco from a Server Component or a SSR'd Client Component.
2. **`JSON.stringify` the user code when embedding into the preview doc.** Do not hand-escape backticks / quotes / `</script>`.
3. **Don't include `templates/**` in `tailwind.config.ts`'s `content`.** Templates run in the iframe with their own CDN Tailwind.
4. **Server Components cannot import client-only libs.** `templates.ts` (fs) is server-only. `Editor/Preview/Workspace/PreviewModal` and the entire `components/library/` tree are `"use client"`.
5. **`/t/[slug]/page.tsx` must export `generateStaticParams`** so every template route prerenders at build.
6. **Debounce preview updates by 250ms.** Resetting `srcDoc` on every keystroke is laggy. Do not reach for `postMessage` — `srcDoc` reset is simpler and fast enough.
7. **Define the Monaco theme inside `onMount`**, not at module load. `monaco` isn't available earlier.
8. **Preview script uses `React.createElement(Component)`** after Babel compiles the template — React 18 UMD expects that, not JSX.
9. **The `export default` → `return` regex only replaces the first occurrence — intentional.** Multiple default exports is malformed source anyway.
10. **Iframe needs `sandbox="allow-scripts allow-same-origin allow-popups allow-forms"`.** React dev mode throws without `allow-same-origin`; nothing runs without `allow-scripts`.
11. **Viewport toggle:** animate via inline style on the wrapper, not the iframe's `width` attribute — CSS transitions won't run on the attribute.
12. **Backslash escaping inside `inspectorRuntimeJs` (and any TS template literal that emits JS source).** TS backtick templates collapse `\\` → one backslash, so any **regex literal** or **string literal containing backslashes** in the iframe-side JS needs *twice as many* backslashes in the TS source. Example: regex matching a literal backslash, replacement emitting two — iframe wants `replace(/\\/g, '\\\\')`, TS source must be `replace(/\\\\/g, '\\\\\\\\')`. Under-escaping kills the iframe `<script>` parse entirely (chunk #28 bug 2026-04-29). When in doubt: write the iframe JS by itself first, then hand-double every `\` for the TS template.
13. **Never call `Math.random()` / `Date.now()` / `crypto.randomUUID()` inside a `"use client"` component's render path or `useState` lazy initializer.** Next.js 14 App Router runs `"use client"` components TWICE on initial page load (SSR + hydration). Non-deterministic values diverge between server and client → React 18 attribute-mismatch warning OR (intermittently) a hard `Hydration failed` error. The recurring instance was `lib/ast/oids.ts makeOid()` calling `Math.random()` (resolved tenth pass — `makeOid` now takes an offset seed and base-62-encodes deterministically). General rule: any new render-time non-determinism needs deterministic-by-seed OR moved into a post-hydration `useEffect`. **Defensive companion**: when a child uses `dynamic(() => import("X"), { ssr: false })`, gate it with a `useState(false)` + `useEffect(() => setMounted(true), [])` mount flag in the parent. See `~/.claude/projects/C--Users-nikit-akellaPreView/memory/project_hydration_random_in_render_trap.md`.

## Preview runtime (`lib/preview.ts`) — signature

```ts
export type PreviewKind = "jsx" | "html";
export function buildPreviewDocument(opts: {
  code: string; kind: PreviewKind; withTailwind?: boolean;
}): string;
```

- `kind === "html"`: if `cdn.tailwindcss.com` already in code, return unchanged. Otherwise inject `<script src="https://cdn.tailwindcss.com"></script>` into `<head>`, or wrap in a full doc if no `<head>`. CSP `frame-ancestors 'self'` meta also injected.
- `kind === "jsx"`: full doc with CSP meta + Tailwind CDN + React 18 UMD + ReactDOM 18 UMD + curated package UMDs (see allowlist below) + Babel standalone, `<div id="root">`, fixed-bottom `#__err` coral-on-ink console. Inline script: walk user source via `Babel.parse({ sourceType: 'module', plugins: ['jsx'] })`, classify imports/exports, build a destructure preamble for known-package imports, throw with the supported-packages list for unknown imports, replace `export default ` → `return ` (length-preserving), strip other `export` keywords (length-preserving), Babel.transform with react preset, render with `createRoot`.

### Playground supported imports (curated UMD allowlist)

Source of truth: `SUPPORTED_PKGS` in `lib/preview.ts`. Update both this list and that constant when adding a package.

| Package | Source | Notes |
|---|---|---|
| `react` | pre-loaded React UMD | `React.useState` etc. |
| `react-dom` | pre-loaded ReactDOM UMD | |
| `react-dom/client` | derived from ReactDOM | exposes `createRoot`, `hydrateRoot` |
| `clsx` | unpkg `clsx@2.1.1` | conditional class composition |
| `recharts` | unpkg `recharts@2.13.3` | charting |
| `chart.js` | unpkg `chart.js@4.4.6` | charting (alternative) |
| `lucide-react` | unpkg `lucide-react@0.468.0` | icon components |

**ESM-only packages** (lucide-react ESM build ≥0.500, framer-motion ≥11, all `@radix-ui/react-*`, `@heroicons/react`, `sonner`, `react-hot-toast`, `date-fns`, `class-variance-authority`) are **NOT** supported in v1. They need the esm.sh `<script type="module">` async-loading path.

**Side-effect imports** (`import 'pkg'`) and **relative-path imports** (`import X from './local'`) are silently stripped.

## Template contract

Each `templates/<slug>/` has `meta.json` + `source.jsx` **or** `source.html`.
`meta.kind` drives which source file is read. Valid categories: `Landing | Ecommerce | Portfolio | Marketing | Utility | Dashboard | Blog`.
JSX templates: exactly one `export default` as a React functional component, no npm imports (stripped), no local-path images (use absolute URLs).

### Seed templates

1. `hero-landing/` — SaaS landing, kind `jsx`. Nav, gradient hero, feature grid, CTAs.
2. `product-card/` — Ecommerce detail, kind `jsx`. 2-col image + brand/title/price/rating/variants/CTA.
3. `coming-soon/` — Pre-launch, kind `html`. Dark theme, centered, email capture, countdown via `setInterval`.

## Build order (follow top-to-bottom to avoid import errors)

1. `package.json` / `tsconfig.json` / `next.config.js` / `postcss.config.js` / `tailwind.config.ts`
2. `app/globals.css`
3. `app/layout.tsx`
4. `lib/templates.ts`
5. `lib/preview.ts`
6. Three seed templates
7. `components/Editor.tsx`
8. `components/Preview.tsx`
9. `components/TemplateCard.tsx`
10. `components/Workspace.tsx` (header consolidates Viewport / Expand / Copy / Download / kind toggle in `WorkspaceHeader`)
11. `app/page.tsx`
12. `app/playground/page.tsx`
13. `app/t/[slug]/page.tsx`
14. `README.md`
15. `npm install && npm run build`, fix errors, done.

Verify typecheck with `npx tsc --noEmit` if unsure.

## Commands

```
npm install
npm run dev      # http://localhost:3000
npm run build    # must pass zero errors, zero warnings to be "done"
npm start
```

## Acceptance (from plan.md §13 — short list)

- `npm run build` — zero errors, zero warnings
- Landing shows all seed templates, 3-col on desktop, 1-col on mobile
- Template route renders correctly within ~1s
- Editor → preview within ~500ms (250ms debounce + paint)
- JSX syntax error shows in bottom coral console, doesn't break the editor
- Viewport toggle visibly shrinks to 390 / 768 / 100%
- Copy shows "Copied" for 1.8s; Download produces correct extension
- `/playground` loads with starter + JSX/HTML toggle
- No browser console errors on any page
- Lighthouse Performance ≥ 85 on landing
