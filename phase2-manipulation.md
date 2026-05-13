# Phase 2 — Resize, Spacing, and Drag Foundation

> **Status: deferred.** Phase 1 ships first (AST + selection + undo + coexistence). This file captures Phase 2 in detail so the next session can start without re-deriving anything. Read this AFTER `maniuplation.md` and after Phase 1 is in.

> **Toolchain locked (2026-04-28, post-research):** The `maniuplation.md` "Implementation Toolchain" section supersedes earlier draft choices. Phase 2 builds on:
> - **`@babel/parser`** for AST queries (NOT swc).
> - **`magic-string`** for source rewrites (NOT recast as default printer).
> - **`data-dropin-id`** persistent OIDs from Phase 1 (NOT structural-path hash, NOT line:col ranges). Coexists with the existing `data-dropin-loc` until the new system reaches parity (Phase 4+).
> - **`penpal`** for iframe RPC (NOT raw `postMessage` tagging).
> - **`react-moveable`** as the handle/snap engine — wire its handles to our intent resolver and AST diff system rather than building from scratch.
> - **`tldraw`'s `SnapManager`** as architectural reference for snap internals (8px/zoom threshold, brute-force traversal, no spatial index needed at <100 elements).
> - **`@use-gesture/react`** for elastic resistance (`rubberband: true`).
> - **`zundo`** for undo coalescing during drag (`pause()`/`resume()`).
> - **FLIP technique** for Track A → B drift animation.
> - **Floating UI's `autoUpdate`** as the reference pattern for cross-iframe overlay tracking (single shared rAF, ResizeObserver invalidation, batched rect reads).

## Scope of this phase

Per the master spec's §"Phasing → Phase 2": resize and spacing handles, intent resolver, snap system, constraint system, drag lifecycle, and the spacing-and-sizing sections of the properties panel. **4-6 weeks of focused work** per the original timeline. One full session minimum.

End state: user can grab any selected element by an edge, corner, padding handle, or margin handle, drag, and the resulting code is correct across every layout context the system understands. Snapping helps without chattering. Constraints prevent broken layouts. Track A optimistic updates make drags feel native-fast.

## Prerequisites (must already be live from Phase 1)

- AST layer: parser, stable `data-dropin-id` OIDs, query API (`findById`, `parent`, `children`, `siblings`, `ancestors`).
- iframe runtime: every rendered JSX element carries a `data-dropin-id` attribute matching its AST node.
- Selection model: a single `data-dropin-id` can be marked "selected"; host overlay renders an outline anchored to its bounding box.
- Undo stack: typed `AstDiff` with structured `Change`s, inverses, application order. Single-entry-per-gesture coalescing.
- Layout Inspector (Layer 2): basic context exposed (bounds, layoutRole, parent context, computed CSS for the affected properties).
- PostMessage protocol between host and iframe with `data-dropin-id`-based selection messages.
- `<style id="dropin-live">` injected at iframe boot — the host-managed stylesheet Track A writes into.
- Multi-line `import` stripping in the iframe IIFE wrapper. Parse perf benchmarked at <30 ms p99 on 1000-line files.

If any of those is incomplete or buggy, do NOT start Phase 2 — fix Phase 1 first. The foundation must hold.

## Build sequence (within this session)

The order matters. Earlier steps unblock later ones; doing them out of order causes rework.

### Step 1 — Handle rendering layer

A new component (`components/ast/HandleLayer.tsx` or similar) that wraps **`react-moveable`** to render handles as overlays on top of the iframe, anchored to the selected element's bounding box.

**Why react-moveable:** ships every handle type the spec calls for (size corners + edges, rotation, group), gap-snap, sibling/grid/element snap guidelines, bounds, group operations. MIT-licensed. We supply the AST-diff layer underneath; moveable handles the visual + gesture mechanics.

**Things we DON'T let moveable do** (because we own them):
- Final commit. Moveable's `onResizeEnd` fires our intent resolver → AST diff → magic-string write.
- Snap target sourcing. We feed it our snap candidates (sibling rects from the iframe DOM, computed at drag-start).
- Cross-iframe positioning. Wrap moveable's target reference with a `VirtualElement` (Floating UI pattern) that returns iframe-relative coords mapped to host coords.

Handle types per master spec §"Handle types and visual language":
- **Size handles**: solid filled squares, accent color, 8×8px. 4 corners + 4 edge-midpoints.
- **Padding handles**: dashed border, accent color, 6×6px. Just inside element edges. Visible on cursor proximity.
- **Margin handles**: dashed border, gray, 6×6px. Just outside element edges. Visible on cursor proximity.
- **Position handle**: circle with 4-way arrow icon, accent color, center. Visible only for repositionable elements (Phase 3 implementation, but stub the handle slot now).
- **Radius handles**: small filled circles, accent color, 5×5px, at corners.
- **Aspect lock toggle**: chain icon next to size handles.

Hit areas larger than visual (16×16 minimum). Touch devices: 44×44.

Visibility logic per master spec §"Handle visibility logic": cursor-proximity fade in/out at 100ms ease.

### Step 2 — Intent Resolver (Layer 3)

`lib/ast/intent-resolver.ts`. Pure function: given (handle role, handle location, element layout context, modifier keys, existing style values), returns a typed `Intent`.

Intent variants per master spec §"Layer 3":
```
Intent =
  | ResizeWidth { basis: 'width' | 'flex-basis' | 'grid-span' | 'min-width' | 'max-width' | 'aspect-ratio'; unit; preserveAspect }
  | ResizeHeight { basis; unit }
  | AdjustPadding { sides; unit; symmetric }
  | AdjustMargin { sides; unit; symmetric }
  | RepositionAbsolute { ... }   // Phase 3
  | ReorderSibling { ... }        // Phase 3
  | Reparent { ... }              // Phase 3
  | AdjustRadius { corners; uniform }
  | AdjustFontSize { unit }
  | Rotate                         // Phase 7
  | Skew { axis }                  // Phase 7
```

Phase 2 implements: `ResizeWidth`, `ResizeHeight`, `AdjustPadding`, `AdjustMargin`, `AdjustRadius`, `AdjustFontSize`. Position/reorder/reparent are Phase 3.

Decision table per master spec §"Layer 3 → A few examples". Encode each branch in code, with comments tying each branch back to the spec line. Test with property-based testing on randomized layout contexts.

The resolver also returns side effects (properties auto-removed, conversions made, constraints that will be hit). These accompany the Intent so the cursor label can warn before commit.

### Step 3 — Operation Engine (Layer 4)

`lib/ast/operations/`. Per-intent handlers that take an Intent and produce an `AstDiff`. One handler file per intent kind.

Diff shape per master spec §"Layer 4". `Change` variants for Phase 2:
- `SetStyle`, `RemoveStyle`, `ReplaceStyle`
- `AddClass`, `RemoveClass`, `ReplaceClass`
- `SetAttribute`, `RemoveAttribute`
- `UpdateCssRule`, `InsertCssRule`, `RemoveCssRule`

Structural changes (`MoveNode`, `InsertNode`, `RemoveNode`, `WrapNode`, `UnwrapNode`) are Phase 3.

Application order per master spec: removes before inserts, parent before children, attribute before structural. Property-based testing on randomized diffs.

### Step 4 — Track A (Optimistic in-iframe paint via managed stylesheet)

`components/Preview.tsx` extension. **Per the maniuplation.md Layer 5 rewrite (2026-04-28), Track A does NOT mutate `element.style.*` directly** — that races with React reconciliation. Instead:

- At iframe boot, inject `<style id="dropin-live"></style>` into `<head>`.
- During drag, host sends per-rAF postMessage: `{ type: 'dropin:live-style', id, declarations }`. `id` is the element's stable `data-dropin-id` (NOT `data-dropin-loc` — loc shifts on text edits). `declarations` is a flat object: `{ width: '248px', padding: '16px' }`.
- Iframe runtime maintains a CSS rule keyed by `[data-dropin-id="${id}"]` inside `#dropin-live`, adding / replacing / deleting it as the drag progresses. Use `css-tree` for the in-iframe stylesheet AST (Onlook's pattern in [`apps/web/preload/script/api/style/css-manager.ts`](https://github.com/onlook-dev/onlook/blob/main/apps/web/preload/script/api/style/css-manager.ts)) so the rule update doesn't have to re-parse the whole stylesheet on every frame.
- React doesn't touch foreign stylesheets. The cascade wins. Optimistic paint stays stable across reconciles.

**Narrow inline-style exception** — `transform`, `zIndex`, `position: fixed` are written directly during translate/move drags only. React almost never sets these from props, so the reconciliation race doesn't bite. Same compromise Onlook makes in `move/drag.ts`. **Snapshot the original `cssText` at drag start** so `pointercancel` / Esc can restore.

**Stub for non-absolute drag** — direct port of [`apps/web/preload/script/api/elements/move/stub.ts`](https://github.com/onlook-dev/onlook/blob/main/apps/web/preload/script/api/elements/move/stub.ts). When the user moves a flow child of `flex` / `grid` / `block`, the real element gets `position: fixed` + transform, and a `display: none` stub of the same dimensions takes its layout slot.

**rAF throttle** — coalesce `pointermove` events to one stylesheet write per frame max. Every frame must complete in <16ms; reading `getBoundingClientRect()` once per tick + writing the rule is well under budget.

**Cancel path** (Esc / `pointercancel` / `lostpointercapture` / `window.blur` / `visibilitychange`) — host posts `dropin:live-clear { id }`. Iframe deletes the rule from `#dropin-live` and restores any temporarily-touched inline `cssText`. No source patch, no AST diff, no undo entry.

Track A is fire-and-forget during drag. Visual state may diverge from canonical AST momentarily — expected.

### Step 5 — Track B reconciliation

On drag end, Track B applies the diff to the AST, serializes back to source, pushes to Monaco, iframe re-renders from the new source. Compares re-rendered DOM to Track A optimistic state. If match: nothing visible changes. If mismatch (rare, complex layouts): smooth animation from Track A state to canonical state over 150ms via **FLIP** (First, Last, Invert, Play — Paul Lewis's technique).

**Serialization is solved (post-research):** use the `magic-string` + `@babel/parser` hybrid pattern — parse to find `node.start`/`node.end`, `magicString.overwrite(start, end, newText)`, `toString()` returns the source byte-identical except where mutated. No `recast` for the property-edit path (recast has documented JSX whitespace bugs — see `maniuplation.md` "Implementation Toolchain → Serialization"). Reserve recast / full AST mutation for genuinely structural rewrites in Phase 3 (move subtree, wrap in parent, extract component).

**Drift detection:** compare bounding boxes of selected element + parent + immediate siblings before and after Track B re-render. If any rect differs by > ~1 px on any side, animate. Don't diff computed style trees (too noisy — browser normalization causes false positives).

**Animation:** `transform 150ms ease-out` applied during the brief reconciliation window, then removed. Computes a transform that maps Track-A position to Track-B position using FLIP. xyflow/xyflow's node-drag commit choreography is the reference.

### Step 6 — Snap system

`lib/ast/snap.ts`. Snap targets categories per master spec §"Snap target categories":
- Grid snaps (multiples of 4 and 8)
- Common values (16, 24, 32, 48, 64, 96, 128, 160, 192, 240, 256, 320, 384, 480, 512, 640, 768, 1024)
- Sibling snaps (every edge of every visible sibling)
- Parent snaps (parent's content area, full edges, percentage of parent)
- Cross-section snaps (any visible element on the page)
- Recent value snaps (last 5 values from this session)
- Baseline snaps (text alignment with adjacent text)

**Architecture reference:** tldraw's `SnapManager` (`packages/editor/src/lib/editor/managers/SnapManager`). Split into `BoundsSnaps` (edges/centers, alignment) and `HandleSnaps` (point connections). Brute-force traversal at <100 elements scales fine — **no spatial index (R-tree/quadtree) needed** at our scale (research-confirmed). Add hysteresis on top of tldraw's pattern (4 px in to acquire, 8 px out to release — produces the "click into place" feel). Cmd held disables all snapping.

**moveable already ships sibling/grid/element snap guidelines and gap-snap** — feed it our snap candidate list and let it handle the visual guides + threshold math. Override only what we need beyond default behavior (recent-value memory, baseline snaps, hysteresis).

Visual feedback: 1px guide line, color-coded by snap type (green sibling, blue parent, gray grid, purple baseline). Single guide at a time.

Smart snap suggestions when multiple targets are near: closest wins with hysteresis, recently-used weighted higher, type priority sibling > parent > common > grid.

### Step 7 — Constraint system

`lib/ast/constraints.ts`. Hard constraints per master spec §"Hard constraints":
- Width below min-content: cursor stops, label shows reason, elastic resistance.
- Padding negative: clamped at 0.
- Element fully obscured (w/h = 0): allowed temporarily, snaps back to minimum on release.
- Element off-canvas: confirm dialog on release.

**Min-content measurement:** pre-compute at drag-start, cache, recompute on `MutationObserver` only (children changed). Reading `getComputedStyle` per move is fine; computing `min-content` requires temporarily setting `width: min-content` and reading `offsetWidth`, which forces synchronous reflow — too expensive per frame. Pattern: clone the element off-screen at drag-start with `width: min-content`, measure, store, discard.

**Elastic resistance UX:** `@use-gesture/react`'s `rubberband: true` (with `bounds`) is the ready-made implementation — default coefficient 0.15. Math is `displacement * coefficient` past the bound. Pair with `react-spring` for the snap-back animation when the user releases past the constraint.

Soft constraints per master spec §"Soft constraints":
- Touch target below 32px on interactives → warning indicator.
- Text below 12px → warning.
- Image aspect ratio distorted → warning.
- WCAG AA contrast drop → warning.
- Element overflowing parent → red dashed indicator.

Per-element override via right-click → Properties → "Disable constraints". Configurable thresholds in settings (defer settings UI to a later phase; Phase 2 hardcodes defaults).

### Step 8 — Drag lifecycle

`lib/ast/drag.ts` orchestrates Steps 1-7. Lifecycle phases per master spec §"Drag lifecycle":

- **Drag start (mousedown on a handle)**: record initial state, fetch layout context, resolve intent, lock intent for the duration, compute and cache snap targets, show drag overlay (cursor label + axis guides + boundaries), elevate dragged element, dim others to 70%, set cursor type, capture pointer.
- **Drag move (mousemove)**: compute delta, apply intent + modifiers, snap check, constraint check, Track A apply, label update, snap guides, constraint warnings, properties panel pulse on affected property. Per-frame budget: 16ms.
- **Drag end (mouseup)**: commit final value, Layer 4 produces diff, Track B applies diff to AST + re-serializes + updates source, iframe verifies, undo entry pushed, brief toast, drag overlay fades, pointer released.
- **Drag cancel (Escape during drag, `pointercancel`, `lostpointercapture`, `window.blur`, `visibilitychange`)**: host posts `dropin:live-clear { id }`. Iframe deletes the per-element rule from `#dropin-live` and restores any temporarily-touched inline `cssText` from a snapshot. No diff produced, no AST change, no undo entry, immediate fade.
- **Drag interrupt (code edited mid-drag)**: same `dropin:live-clear` revert. Drag aborts, small notice "Drag canceled, code was edited", new AST processed normally.

The cancel path is critical and frequently broken in editors. Test it specifically with automated tests, not just manual.

### Step 9 — Properties Panel: spacing and sizing sections

`components/ast/PropertiesPanel/` extension. Per master spec §"Properties Panel → Default sections per element type → Container element":
- Padding (4-direction visual control with link toggle)
- Margin (same shape as padding)
- Width / Height with unit selector
- Min/max width/height (under "More")
- Border radius (4-corner visual control with link toggle)

Visual controls per master spec §"Visual controls" — visual-first, numerical fallback. Padding/margin = 4-sided control with focus-per-side and master "all sides" + link icon for symmetric/independent.

Mixed values: when multi-selection, control shows "Mixed" placeholder if values differ; editing applies to all.

Phase 1 stubs the chip "This change applies to: [This element only]" — Phase 2 keeps it as a stub still (no class-edit, no root-variable). Class-edit toggle is Phase 4 work.

## Files expected to land

```
lib/ast/
  intent-resolver.ts            new
  operations/
    resize-width.ts             new
    resize-height.ts            new
    adjust-padding.ts           new
    adjust-margin.ts            new
    adjust-radius.ts            new
    adjust-font-size.ts         new
  snap.ts                       new
  constraints.ts                new
  drag.ts                       new
  serialize.ts                  extended (diff → source, lossless formatting)

components/ast/
  HandleLayer.tsx               new
  DragOverlay.tsx               new
  SnapGuides.tsx                new
  ConstraintIndicators.tsx      new
  PropertiesPanel/
    SpacingSection.tsx          new
    SizingSection.tsx           new
    RadiusSection.tsx           new

components/Preview.tsx          extended (Track A postMessage handler)
lib/preview.ts                  extended (iframe runtime: akella:set-style listener)
lib/iframe-bridge.ts            extended (Track A message types)

components/Workspace.tsx        wires drag lifecycle, properties panel
```

Total: ~15-20 new files, 4-5 extensions. Realistic for one focused session if Phase 1 is solid.

## Risks specific to Phase 2

- ~~**swc printer formatting fidelity**~~ **Solved.** Use `magic-string` + `@babel/parser` hybrid; no printer needed for the property-edit path.
- **Track A / Track B reconciliation drift on complex layouts.** Some flex/grid combinations behave non-obviously. Animation on mismatch needs to be smooth or it feels glitchy. FLIP technique handles the visual; the harder part is the bounding-box comparison's tolerance threshold.
- **Snap target precomputation cost.** tldraw confirms brute-force scales fine at <100 elements. Multi-select with cross-section snaps could be expensive at >500 elements; virtualize via IntersectionObserver if it bites.
- **Per-frame Track A latency under heavy iframes.** Templates with hundreds of elements may make every-frame DOM mutation more expensive than 16ms. Per-frame budget at 60fps is ~10ms practical. Reading 100 element rects in a clean batch ≈ 1-2ms; applying 100 transforms ≈ <1ms. Headroom for ~500 tracked elements before falling off, IF batching strictly. Real risk is layout thrashing from intermixed reads/writes — not raw count.
- **Pointer capture across iframe boundary.** **Solved pattern (research-confirmed):** `setPointerCapture` on host overlay handle + `iframe.style.pointerEvents = 'none'` during drag; restore on `pointerup`/`pointercancel`/`lostpointercapture`. Pre-place transparent host overlays with `pointer-events: auto` over hit zones so the user's `pointerdown` lands on the host, not the iframe. Always listen for ALL FOUR events (most "stuck drag" bugs are missing `pointercancel` or `lostpointercapture` listeners).
- **Window blur / `visibilitychange` mid-drag** — #1 cause of "stuck drag" in production editors. Add listeners that cancel drag when user alt-tabs.
- **`recast` JSX whitespace bugs** if used outside the structural-rewrite path. Keep recast scoped to the `lib/ast/operations/` files that handle wrap/extract/move; never run it on a property-edit path. Document in code comments.

## What is explicitly NOT in Phase 2

Hold the line on these to keep scope contained:

- **Position handle / reorder / reparent.** Phase 3.
- **Multi-element coordinated drag.** Phase 3.
- **Component-instance edit propagation.** Phase 5.
- **Color picker, font picker, shadow picker.** Phase 4.
- **Inline canvas editing for text content.** Phase 4.
- **Code panel bidirectional sync polish (highlight changed lines etc).** Phase 4.
- **Branched undo history, history panel.** Post-MVP.
- **Telemetry endpoint.** Phase 3-4.
- **Real keyboard shortcut for arrow-key nudge.** Stub the keymap; the resize-by-keystroke path is its own thing — Phase 2 handles drag-by-mouse only.

## Acceptance criteria for Phase 2

When Phase 2 is "done":

1. Click any element → see size handles at corners and edges. Drag any one → element resizes correctly.
2. Drag near interior → padding handles fade in. Drag one → element padding adjusts; the diff modifies the right CSS property in the right unit (preserves user's existing px vs rem choice).
3. Drag near exterior → margin handles fade in. Same rules.
4. Drag a corner with Shift → aspect ratio locked.
5. Drag a corner with Alt → resize from center (mirror to opposite edge).
6. Drag with Cmd → snapping disabled.
7. Drag width below min-content → cursor stops with elastic resistance, label shows "Min: 80px (text wrap)".
8. Snap guides render in correct color when snapped (green sibling / blue parent / gray grid / purple baseline).
9. Drag end: undo stack gets one new entry with description like "Resize button width to 248px → 320px". Cmd+Z reverts.
10. Drag with Escape mid-flight: no commit, no undo entry, no visible state change.
11. Resize a flex child whose parent is `flex-direction: row` and child has `flex-grow: 1`: the diff edits `flex-basis`, not `width` (intent resolver picked the right basis).
12. Properties panel's spacing section reflects current values, edits propagate to the canvas in <50ms.
13. Multi-select 3 elements + drag width handle of one: all three resize by the same delta; cursor label "Width: +24px (3 elements)".
14. Phase 1's selection + breadcrumb + undo + code edit all continue working unchanged.

## After Phase 2

- Phase 3 (position + reorder + reparent) is the next session.
- Phase 4 (full properties panel + inline canvas editing) follows.
- Phase 5 (component instances) is several sessions out.

This file gets updated/extended ONLY if Phase 2's scope is renegotiated. Otherwise, treat it as the implementation contract.
