"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type {
  Bounds,
  DropTarget,
  IneligibleDropTarget,
  LayoutContext,
  ParentContext,
  SiblingInfo,
} from "@/lib/layout-context";
import type { Tool } from "@/lib/iframe-bridge";
import {
  applyElasticDim,
  captureAspect,
  computeDims,
  computeSpacing,
} from "@/lib/ast/gesture-math";
import {
  basisToStyleProp,
  oppositeSpacingSide,
  resolveResizeIntent,
  spacingHandleKind,
  spacingHandleSide,
  type DragModifiers,
  type SizeHandle,
  type SpacingHandle,
  type SpacingSide,
} from "@/lib/ast/intent-resolver";
import {
  buildResizeCandidates,
  buildSpacingCandidates,
  candidateId,
  DEFAULT_GRID_SIZE,
  snap,
  type SnapCandidate,
  type SnapState,
} from "@/lib/ast/snap";
import { detectDrift } from "@/lib/ast/flip";
import type { SoftConstraintWarning } from "@/lib/ast/constraints";
import { hitAreaFor, useCoarsePointer } from "@/lib/touch";

// Phase 2 (4a + 4b + 4c-i + 4c-ii + 4d) host-side selection overlay
// (`maniuplation.md` Layer 5 + `phase2-manipulation.md` Steps 1 + 4-5 +
// Step 7 constraints).
// The host overlay OWNS the visible selection chrome for OID-having
// elements: a 2px coral outline + 8 corner/edge handle markers, plus the
// resize gesture that mutates source on commit. The in-iframe
// `[data-dropin-selected]` outline rule (`lib/preview.ts`) is scoped via
// `:not([data-dropin-id])` so it ONLY draws for HTML mode + pre-OID JSX
// paste — no double-stacking.
//
// (4d) adds 8 spacing handles: 4 dashed coral 6×6 INSIDE the bbox edge
// (padding) + 4 dashed gray 6×6 OUTSIDE (margin), each at the edge
// midpoint. They render alongside the resize handles when the `spacing`
// binding is wired. Hit areas are 16×16 (matching resize), positioned
// 12 px inside / outside so the overlap with the resize edge handle's
// hit area is a 4 px sliver — and spacing handles render LAST so they
// win pointer events in that sliver (which is the right intent: aiming
// at the element's interior is "I want to adjust spacing, not resize").
//
// Coordinate system: `Bounds.{x,y}` are iframe-VIEWPORT coords from
// `getBoundingClientRect()` inside the iframe. Render the overlay inside a
// `position: relative` wrapper that shares the iframe's containing block
// (Preview.tsx puts both inside the same wrapper) — then `translate3d(x, y, 0)`
// lands the box exactly on the rendered element. We do NOT add the iframe's
// host-page offset because the overlay is positioned relative to the iframe
// element, not the host viewport.
//
// `transform: translate3d(...)` (not `top`/`left`) — keeps the overlay on the
// GPU compositor layer, no per-frame layout.
//
// Hide states:
//   - `selectedOid == null` → host overlay can't subscribe (HTML mode, or JSX
//     elements pasted mid-session before re-inject). Renders nothing — the
//     in-iframe outline still draws for these because the CSS rule's
//     `:not([data-dropin-id])` filter lets them through.
//   - `rect == null` → element has an OID in source but isn't currently
//     mounted (conditional render, not yet hydrated). Sub stays alive — the
//     element may return; until then, render nothing.
//   - `w === 0 && h === 0` → mobile pane hidden via `display: none`, or
//     element is conditionally rendered to an empty fragment. A 0px coral
//     dot is more confusing than nothing.
//
// (4a) is render-only when `resize` prop is undefined: handles render but
// don't react to pointer events. Wrapper keeps `pointer-events: none`.
//
// (4b) flips `pointer-events: auto` on the 8 size-handle hit areas only when
// `resize` is provided. The wrapper itself stays `none` so iframe clicks
// outside the handle areas pass through. The corner deltas always emit BOTH
// width AND height; edge midpoints emit only their parallel axis. On
// `pointerup` we call `resize.onResizeCommit` which runs `applyResize` in
// Workspace and returns a `committed: boolean`. If `false` (the operation
// engine bailed — e.g. style is `cn(...)`-flavored), we clear the live
// stylesheet ourselves so the visual snaps back. If `true`, we leave the
// live rule alone — the next iframe rebuild (250 ms after `setCode`) wipes
// the live stylesheet and the canonical source rewrite takes over.
//
// (4c-i) Min-content elastic resistance — see ResizeBindings.requestMinContent.
//
// (4c-ii) Modifier keys for resize. Shift = aspect lock; Alt = center-resize
// (delta doubled per axis). Modifiers track LIVE during the drag — a window-
// level keydown / keyup re-fires the move math at the last cursor position so
// pressing or releasing Shift / Alt updates the visual without requiring a
// mouse move.
//
// (4d) Spacing gestures. At pointerdown we fire an async
// `requestLayoutContext(oid)` to read the element's resolved
// padding/margin per side; until that resolves, pointermoves are
// suppressed (typically <20 ms on local iframes — invisible to the user).
// Math: single-axis per handle. Padding clamps at 0; margin allows
// negatives (negative margin = overlap, valid CSS). Alt held = symmetric
// (the same delta is applied to the opposite side too) — useful for
// "balance the spacing" gestures. Shift / Cmd are no-ops in v1.
//
// (4c-iii) Snap system. Both resize and spacing gestures run a snap
// pass between the gesture-math output and the live stylesheet write:
//   computeDims/computeSpacing → snap → elastic → setLiveStyle
// Hysteresis (4 px in / 8 px out) prevents chatter at threshold. Cmd
// held disables snap entirely; resolved per-frame from `readModifiers
// (ev).cmd`. For resize, candidates are sourced from layout context
// (sibling edges, parent + parent-content edges) plus common widths /
// heights and a grid fallback (8 px). For spacing, candidates are the
// common scale (Tailwind-like) plus the same grid. Snap state lives on
// the gesture state (per-axis for resize) and is recomputed at every
// pointermove — the candidate list updates each frame because
// `requestLayoutContext` resolves async (typically <20 ms after
// pointerdown), and once it lands the snap candidates appear.
// Visual feedback: 1 px coral guide lines for sibling/parent snaps
// (drawn outside the bbox, in iframe-viewport coords); a chip below
// the bbox shows the snapped value (shares the slot with the (4c-i)
// constraint chip — they're mutually exclusive in practice because
// snapping below min-content doesn't produce any candidates).

export interface ResizeBindings {
  setLiveStyle: (oid: string, decl: Record<string, string>) => void;
  clearLiveStyle: (oid: string) => void;
  // Toggles `iframe.style.pointerEvents` so iframe-internal hover/click
  // states don't fight the gesture. Passed as a setter rather than the raw
  // iframe ref so the overlay doesn't need to know how Preview manages its
  // iframe element. Restored by the caller's lifecycle if the overlay
  // unmounts mid-drag (handled by the cleanup effect below).
  setIframePointerEventsDisabled: (disabled: boolean) => void;
  // Commit the gesture's final style declarations. Returns true iff the
  // operation produced a real source change (the operation engine
  // returned `unchanged: false`). A false return means the gesture had no
  // effect — we clear the live stylesheet so the visual snaps back to
  // the canonical pre-gesture state. A true return means the source has
  // been pushed through `setCode`; the live stylesheet stays painted
  // until the debounced iframe rebuild (~250 ms) wipes it and the new
  // source's `style={{...}}` takes over.
  //
  // (Twelfth-pass refactor) The signature is now a flat declaration map
  // instead of (width, height) numbers. The caller (SelectionOverlay's
  // onUp) runs `resolveResizeIntent` to pick the right CSS prop name per
  // axis (`width` / `height` / `flexBasis` / `minWidth` / etc.) and
  // packs them into the map. `null` values in the map remove that prop
  // from source — currently unused by the gesture path but accepted by
  // the underlying `applyStyleProps`. Phase 2 acceptance criterion #11
  // (flex children → flex-basis, not width) lives in this routing.
  onResizeCommit: (
    oid: string,
    declarations: Record<string, string | null>
  ) => boolean;
  // Phase 2 acceptance #13 — multi-element coordinated commit. Optional
  // (single-element flow stays on `onResizeCommit`); when provided AND
  // additionalOids is non-empty at gesture-end, the gesture hands the
  // full per-element op list to the multi handler instead. One setCode,
  // one undo entry. Returns the union "any-op-committed" boolean for
  // the same Track A-clear-on-bail decision.
  onResizeMultiCommit?: (
    ops: Array<{
      oid: string;
      declarations: Record<string, string | null>;
    }>
  ) => boolean;
  // (4c-i) Pre-fetch the element's intrinsic min-content dimensions at
  // pointerdown. Resolves null when the iframe doesn't respond within
  // 1s (rebuild mid-flight, OID not currently rendered, etc.) — in that
  // case the gesture proceeds without any constraint, which matches the
  // (4b)-only behaviour. Optional so consumers that don't care about
  // constraints can keep the (4b) shape.
  requestMinContent?: (
    oid: string
  ) => Promise<{
    minWidth: number;
    minHeight: number;
    hasTextChildren: boolean;
  } | null>;
  // (4c-iii) Pre-fetch the element's layout context (parent + siblings)
  // at pointerdown for snap candidate sourcing. Resolves null on
  // timeout / OID not currently rendered. Optional so consumers without
  // snap interest can keep the (4b)/(4c-i)/(4c-ii) shape — gesture runs
  // unsnapped when omitted (Cmd-disable behaviour for everyone).
  requestLayoutContext?: (oid: string) => Promise<LayoutContext | null>;
  // Step 5 (Track B FLIP). Fire-and-forget request to animate from
  // `fromRect` (where the user last saw the element under Track A) to
  // its current canonical position. Optional for the same staged-rollout
  // reason as the others — gesture commits without animation when
  // omitted, which is the (4b)/(4c)/(4d) baseline behaviour.
  requestFlip?: (oid: string, fromRect: Bounds) => void;
}

// Phase 2 (4d) Spacing gesture bindings. Wired in by Preview.tsx when
// Workspace passes an `onSpacing` handler. Mirrors the ResizeBindings
// shape but with the spacing-specific commit signature and the
// layout-context async fetch (used to read the start-of-gesture
// per-side padding / margin in resolved px).
export interface SpacingBindings {
  setLiveStyle: (oid: string, decl: Record<string, string>) => void;
  clearLiveStyle: (oid: string) => void;
  setIframePointerEventsDisabled: (disabled: boolean) => void;
  // Commit the spacing gesture. `sides` is a partial { top?, right?,
  // bottom?, left? } map of CSS values (e.g. `'12px'`). v1 always sends
  // the active side; with Alt held, also sends the opposite side. Returns
  // true iff `applySpacing` produced a real source change.
  onSpacingCommit: (
    oid: string,
    kind: "padding" | "margin",
    sides: { top?: string; right?: string; bottom?: string; left?: string }
  ) => boolean;
  // Phase 2 acceptance #13 — multi-element coordinated spacing commit.
  // Same shape as onResizeMultiCommit but with the spacing side bag.
  onSpacingMultiCommit?: (
    ops: Array<{
      oid: string;
      kind: "padding" | "margin";
      sides: { top?: string; right?: string; bottom?: string; left?: string };
    }>
  ) => boolean;
  // Async fetch for the resolved layout context. The gesture reads
  // `padding[side]` / `margin[side]` to seed startValue / startOppositeValue.
  // Resolves null on timeout (1s) or when the OID isn't currently rendered.
  // Until it lands, the gesture suppresses pointermove writes (no live
  // update) — typical resolve is <20 ms on local iframes, invisible.
  requestLayoutContext: (oid: string) => Promise<LayoutContext | null>;
  // Step 5 (Track B FLIP). See ResizeBindings.requestFlip — same shape,
  // same semantics, same Preview-side implementation. Optional for
  // staged rollout.
  requestFlip?: (oid: string, fromRect: Bounds) => void;
}

// Phase 3 — move (reorder + reparent) bindings. Wired in by Preview.tsx
// when Workspace passes `onReorder` / `onReparent` handlers. The position
// handle (circle in element center) is render-only when this prop is
// undefined; when provided, it becomes the gesture entrypoint for
// reorder-within-parent (drop on a sibling slot) AND reparent-across-
// container (drop on a different parent's content area).
//
// The gesture itself routes commits two ways:
//   - same parent → onReorderCommit(oid, parentOid, toIndex)
//   - different parent → onReparentCommit(oid, newParentOid, insertIndex)
// Caller (Workspace) routes through `applyReorder` / `applyReparent`.
//
// `requestDropTargets` populates a target cache at pointerdown — one
// RPC per gesture, then per-frame hit-testing is local. `requestLayoutContext`
// is also fired at pointerdown so the gesture knows the element's CURRENT
// parent OID (used to discriminate reorder vs reparent at commit time).
export interface MoveBindings {
  setLiveStyle: (oid: string, decl: Record<string, string>) => void;
  clearLiveStyle: (oid: string) => void;
  setIframePointerEventsDisabled: (disabled: boolean) => void;
  // Same-parent reorder commit. Returns true iff `applyReorder` produced
  // a real source change. Caller is `Workspace.handleReorder`.
  onReorderCommit: (
    oid: string,
    parentOid: string,
    toIndex: number
  ) => boolean;
  // Cross-parent reparent commit. `propsToRemove` carries flex-only / grid-
  // only props the gesture decided to drop based on the destination's
  // direction. `newParentTag` is the lowercased tag of the drop target
  // (e.g. "main"); Workspace uses it in the success toast. Returns true
  // iff `applyReparent` landed source.
  onReparentCommit: (
    oid: string,
    newParentOid: string,
    insertIndex: number,
    propsToRemove?: string[],
    newParentTag?: string
  ) => boolean;
  // (Phase 3 polish — multi-element) Multi-element reorder commit.
  // Workspace iterates `applyReorder` over a running source string —
  // one undo entry covers all elements. Ops are pre-ordered by the
  // gesture so insertion indices land each element adjacent to the
  // prior one at the destination. Optional: when omitted, gesture
  // falls back to single-element commit on `onReorderCommit`.
  onReorderMultiCommit?: (
    ops: Array<{ oid: string; parentOid: string; toIndex: number }>
  ) => boolean;
  // Multi-element reparent commit. Same iterate-and-batch pattern as
  // reorder; per-op propsToRemove follows the primary's policy. Single
  // setCode → one undo entry. `newParentTag` for the success toast.
  onReparentMultiCommit?: (
    ops: Array<{
      oid: string;
      newParentOid: string;
      insertIndex: number;
      propsToRemove?: string[];
    }>,
    newParentTag?: string
  ) => boolean;
  // Per-gesture cache. Resolves null on timeout / iframe rebuild — gesture
  // bails gracefully (no live drag visual since we have no targets to
  // hit-test against). Returns BOTH eligible (`targets`) and ineligible
  // (`ineligible`) lists; ineligible candidates render with a red outline
  // + reason tooltip when the cursor hovers them, but never commit.
  // Multi-element selections pass every participant in `excludeOids` so
  // the iframe walker filters the entire moving set out of candidates.
  requestDropTargets: (
    excludeOids: string[]
  ) => Promise<{
    targets: DropTarget[];
    ineligible: IneligibleDropTarget[];
  } | null>;
  // Same shape as the resize/spacing variants — used to read the moved
  // element's CURRENT parent OID at pointerdown (needed for reorder
  // routing). Optional: when omitted, gesture treats every drop as
  // reparent.
  requestLayoutContext?: (oid: string) => Promise<LayoutContext | null>;
  // Step 5 (Track B FLIP) for move. Arms a flip on successful reorder/
  // reparent commit so canonical-vs-optimistic drift (the dropped slot
  // is layout-snapped a few px from the cursor's release point, the
  // destination flex container redistributes children, etc.) animates
  // smoothly instead of snapping. Same shape as resize / spacing
  // variants — both end up calling Preview.requestFlip.
  requestFlip?: (oid: string, fromRect: Bounds) => void;
}

// Phase 3 polish (seventeenth pass) — duplicate + delete action
// bindings. When provided, the overlay renders a small two-button
// toolbar above the bbox with "duplicate" and "delete" affordances
// for trackpad-only users (keyboard shortcuts Cmd+D / Backspace
// handle the common case directly in Workspace). Multi-element
// callers wire `onDuplicateMulti` / `onDeleteMulti` so a multi-select
// commits in a single setCode → one undo entry. Each callback returns
// true on success; the overlay uses the boolean to clear selection
// after a successful delete (the deleted element no longer exists,
// so leaving the selection pinned would point at empty bytes).
export interface ElementActionBindings {
  onDuplicate: (oid: string) => boolean;
  onDelete: (oid: string) => boolean;
  onDuplicateMulti?: (oids: ReadonlyArray<string>) => boolean;
  onDeleteMulti?: (oids: ReadonlyArray<string>) => boolean;
  // Called after a successful delete so the overlay's parent state
  // (selection / additionalOids in Workspace) drops the now-stale
  // OIDs. Optional: the overlay still calls onDelete; if this is
  // omitted, the parent is responsible for noticing the OID is gone
  // (e.g. via the next bbox subscription returning null).
  onDeleteCompleted?: () => void;
}

// Phase 2 Step 7 — passive inspection bindings. Soft constraints only for
// now; future computed-css / a11y queries can land here without churning
// the gesture binding shapes. Always optional; the overlay degrades
// silently when the prop is omitted (no warning chips render, but the
// rest of the UI is untouched).
export interface InspectBindings {
  // Returns the warning list for the OID's current canonical render.
  // Resolves null on timeout or when the OID isn't currently rendered.
  // The overlay caches the most recent response and re-fires on
  // selection change + on rect changes (debounced) so the warnings
  // track the canonical render through resize / rebuild / scroll.
  requestSoftConstraints: (
    oid: string
  ) => Promise<SoftConstraintWarning[] | null>;
}

interface SelectionOverlayProps {
  // Phase 5 / Phase B — active tool. Narrowed to the two tools where
  // the overlay actually renders (Preview gates the other three by not
  // mounting this component at all). Inside the overlay, the prop
  // gates which handles paint:
  //   · 'select' → size + spacing + duplicate/delete toolbar
  //   · 'move'   → position handle only (size/spacing hidden)
  // Both modes paint the bbox outline.
  tool: Extract<Tool, "select" | "move">;
  selectedOid: string | null;
  // Phase 2 acceptance #13 — additional OIDs in the multi-select set.
  // Each gets its own bbox subscription + thin secondary outline.
  // Gestures broadcast the same delta to every participating element
  // (primary + additionals); on commit, the multi-* handler is invoked
  // when this is non-empty. Empty array (default) = single-select.
  additionalOids: ReadonlyArray<string>;
  // Subscribe-by-OID hook. Lives in Preview.tsx as a useCallback. Returns
  // an unsubscriber. Iframe rebuilds are transparent — the same sub is
  // replayed by Preview after `dropin:ready`, so the overlay doesn't need
  // to re-subscribe on every srcDoc swap.
  watchBbox: (oid: string, cb: (rect: Bounds | null) => void) => () => void;
  // Optional label text — typically `${tag}` from the current ElementSelection.
  // Dimensions are appended from the live rect, so the label refreshes itself
  // as the element resizes. Pass null to skip the badge entirely.
  tag?: string | null;
  // (4b) Optional gesture bindings. When undefined, handles are render-only.
  // Caller must wire all four methods together — Preview.tsx composes them
  // from its own state.
  resize?: ResizeBindings;
  // (4d) Optional spacing-gesture bindings. When provided, the 8 spacing
  // handles (4 padding + 4 margin) become interactive. Independent of the
  // resize bindings — passing one without the other is supported (e.g. a
  // future read-only inspector view could wire spacing-only).
  spacing?: SpacingBindings;
  // Step 7 — passive inspection. When provided, soft constraints are
  // queried and rendered as warning chips below the bbox. Independent
  // of any gesture binding.
  inspect?: InspectBindings;
  // Phase 3 — move (reorder + reparent) bindings. Optional: when undefined
  // the position handle doesn't render. When provided, the handle becomes
  // a draggable circle in the element's center; the gesture commits a
  // reorder (same parent) or reparent (different parent) on release.
  move?: MoveBindings;
  // Phase 3 polish (seventeenth pass) — duplicate / delete toolbar.
  // Optional: when provided, a two-button toolbar renders above the
  // bbox top-right edge for trackpad-only users.
  actions?: ElementActionBindings;
}

interface ResizeGestureState {
  kind: "resize";
  oid: string;
  handle: SizeHandle;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  pointerId: number;
  // Populated by the async `requestMinContent` after pointerdown. Stays
  // null until the response lands (or forever if the iframe didn't
  // respond / wasn't asked). `pointermove` reads this each frame —
  // mutation-after-the-fact is intentional and safe because the gesture
  // identity is checked before mutation (see handlePointerDown).
  // (Twelfth-pass-plus) `hasTextChildren` carries through the
  // "(text wrap)" qualifier on the constraint chip — when the element
  // wraps text the chip shows "Min: 80px (text wrap)" per acceptance
  // criterion #7.
  minContent: {
    minWidth: number;
    minHeight: number;
    hasTextChildren: boolean;
  } | null;
  // (4c-ii) Aspect ratio captured at pointerdown. Frozen for the
  // gesture's lifetime — the user's "preserve THIS aspect" intent
  // anchors at handle-grab. `null` when start dims are zero (degenerate
  // — Shift no-ops gracefully). Read by `computeDims` whenever Shift
  // is held.
  aspect: number | null;
  // (4c-ii) Last cursor position the gesture saw. Updated every
  // pointermove and on the keydown/keyup re-fire. Used so a Shift /
  // Alt press WITHOUT a mouse move can recompute dims at the cursor's
  // current location — the user expects the visual to update the
  // moment they press the key, not on the next mouse jiggle.
  lastClientX: number;
  lastClientY: number;
  // (4c-iii) Element bounds frozen at pointerdown. Used as the snap
  // anchor + perpendicular-guide range source. Same shape as the rect
  // the bbox subscription emits, but captured once so post-pointerdown
  // resize-driven bbox changes don't drift the snap candidates'
  // anchor mid-drag. The element bounds DO move (because we're
  // resizing it), but the snap candidates are about edges of OTHER
  // elements; we want the anchor (the unmoving edge) frozen.
  elementBounds: Bounds;
  // (4c-iii) Parent + siblings for snap candidate sourcing. Populated
  // async by `requestLayoutContext` after pointerdown. Stays empty
  // until response lands — until then snap is a no-op (only grid
  // fallback can fire) which is the right behaviour for the sub-frame
  // before context arrives. Identity check on gestureRef guards
  // against stale mutations.
  parent: ParentContext | null;
  siblings: ReadonlyArray<SiblingInfo>;
  // (twelfth-pass) Full LayoutContext, populated alongside parent /
  // siblings in the same async fetch. Used by `resolveResizeIntent` at
  // commit time to pick `basis` (width vs flex-basis vs grid-span). When
  // null (response not back yet, or fetch failed), the resolver falls
  // back to plain width/height — same behaviour as Phase 2 (4b).
  context: LayoutContext | null;
  // (4c-iii) Per-axis snap state. Mutated each pointermove with the
  // result.active. Mutable on purpose (matches minContent / lastClient*
  // pattern) — the snap module is a pure function over (state,
  // desired, candidates), so the caller owns the state container.
  snapStateW: SnapState;
  snapStateH: SnapState;
  // Phase 2 acceptance #13 — start sizes for ADDITIONAL participants
  // (primary's startW/startH live in the fields above). Captured from
  // the live bbox map at pointerdown so each element receives the
  // delta against ITS OWN starting size, not the primary's. Map omits
  // entries for additionals whose bbox wasn't available at gesture-
  // start (rare race; that element silently sits out the gesture
  // until it has a bbox to anchor against). Stable for the gesture's
  // lifetime — bbox changes during the drag don't update this.
  additionalStarts: ReadonlyMap<string, { width: number; height: number }>;
}

interface SpacingGestureState {
  kind: "spacing";
  oid: string;
  handle: SpacingHandleSpec;
  startX: number;
  startY: number;
  pointerId: number;
  // Per-side baseline values in px. Captured async via
  // `requestLayoutContext` after pointerdown. Until `contextReady`,
  // applyMove suppresses live writes (no premature flicker from a
  // `delta-only` baseline).
  startValue: number;
  startOppositeValue: number;
  contextReady: boolean;
  // Same lastClient* role as ResizeGestureState — supports Alt re-fire
  // without a mouse move (toggling Alt re-runs applyMove at the cached
  // cursor pos so the symmetric write appears/disappears immediately).
  lastClientX: number;
  lastClientY: number;
  // (4c-iii) Snap state for the active spacing axis. Spacing is 1D so
  // a single state suffices. Same pure-function-with-mutable-container
  // pattern as resize.
  snapState: SnapState;
  // Phase 2 acceptance #13 — per-element baselines for additional
  // participants. Each entry is the additional element's resolved
  // padding/margin per side, fetched async via requestLayoutContext at
  // pointerdown (parallel to the primary's fetch). `contextReady` flag
  // tracks "all participants resolved at least once" so the gesture's
  // pointermove writes don't fire before the additional baselines land.
  // additionalStarts is keyed by OID; the value is a 4-side map.
  additionalStarts: ReadonlyMap<
    string,
    { top: number; right: number; bottom: number; left: number }
  >;
}

// Phase 3 — move (reorder + reparent) gesture state. Owns the drop-target
// cache (fetched once at pointerdown), the tracked "current target +
// insertion index" derived from cursor hit-testing each pointermove, and
// the OLD parent OID (so `onUp` can discriminate reorder vs reparent).
//
// `oldParentOid` is captured async via `requestLayoutContext`. Until it
// resolves, every drop is treated as reparent (worst case: a same-parent
// drop routes through `applyReparent` which will bail with "newParent ===
// oldParent" — gesture path falls back to no-op on bail). In practice
// the layout-context fetch resolves in <20 ms; users almost never drop
// within that window.
//
// `dropTargets` is the cached array; null means the fetch is in flight
// (or failed). The gesture suppresses live visual + commit until the
// cache lands. `currentTarget` is the most recent hit (null when cursor
// is outside every target's contentBounds OR when the gesture is in
// "no-target" mode — element snapping back to origin on release).
interface MoveGestureState {
  kind: "move";
  oid: string;
  pointerId: number;
  // Cursor at pointerdown, in HOST viewport coords (clientX/clientY).
  // Drop-target hit-testing translates incoming clientX/Y into iframe-
  // viewport coords using `wrapperRef.current.getBoundingClientRect()`.
  startX: number;
  startY: number;
  // Element bounds at pointerdown (iframe-viewport coords). Used to
  // render the "lifted" preview at the cursor offset and to seed the
  // visual feedback.
  elementBounds: Bounds;
  // Drop-target cache. Null until requestDropTargets resolves; empty
  // array means "iframe returned no targets" (gesture is effectively
  // no-op until release).
  dropTargets: DropTarget[] | null;
  // (Phase 3 polish) Parallel ineligible list — leaf-tag containers,
  // descendants of the moved element, etc. Null until resolved; empty
  // array when no ineligibles are visible. Hit-tested AFTER eligible
  // misses so a legitimate green target nested inside a (theoretically)
  // ineligible parent always wins.
  ineligibleTargets: IneligibleDropTarget[] | null;
  // OID of the moved element's parent at gesture-start, captured async
  // via `requestLayoutContext`. Null until resolved (or when the fetch
  // fails — gesture treats all commits as reparent in that case).
  oldParentOid: string | null;
  // Per-frame hit-test result. `target` is the DropTarget the cursor
  // currently sits over (highest-z first hit, smallest-area tiebreak);
  // `insertIndex` is computed by walking target.children and finding
  // the first child past cursor's perpendicular-axis midpoint.
  // Cleared (null) when cursor leaves all targets.
  currentTarget: { target: DropTarget; insertIndex: number } | null;
  // (Phase 3 polish) Active ineligible-hit, when the cursor is over a
  // red-feedback element (leaf tag, moved-element descendant). Never set
  // simultaneously with `currentTarget` — eligible always wins on hit-
  // test priority, so this is only set when the cursor is OUTSIDE every
  // eligible target but INSIDE an ineligible one. On drop, the gesture
  // bails (no commit) but the visual is "snapped back to origin" — same
  // as a drop on empty space.
  currentIneligible: IneligibleDropTarget | null;
  // Last cursor position seen (HOST viewport coords). Drives the live
  // translate transform on the moved element.
  lastClientX: number;
  lastClientY: number;
  // Phase 2 acceptance #13 / Phase 3 — additional participants in the
  // multi-select set. Empty when the gesture is single-element. Each
  // entry receives the same translate delta + the same source rewrite
  // intent on commit. v1 ships single-target drop only — all elements
  // land at the same drop slot, in source order, with insertIndex
  // incrementing per element so they sit adjacent at the destination.
  additionalOids: ReadonlyArray<string>;
}

type GestureState =
  | ResizeGestureState
  | SpacingGestureState
  | MoveGestureState;

const HANDLE_POSITIONS: Array<{
  fx: number;
  fy: number;
  cursor: string;
  key: SizeHandle;
}> = [
  { fx: 0, fy: 0, cursor: "nwse-resize", key: "tl" },
  { fx: 0.5, fy: 0, cursor: "ns-resize", key: "t" },
  { fx: 1, fy: 0, cursor: "nesw-resize", key: "tr" },
  { fx: 1, fy: 0.5, cursor: "ew-resize", key: "r" },
  { fx: 1, fy: 1, cursor: "nwse-resize", key: "br" },
  { fx: 0.5, fy: 1, cursor: "ns-resize", key: "b" },
  { fx: 0, fy: 1, cursor: "nesw-resize", key: "bl" },
  { fx: 0, fy: 0.5, cursor: "ew-resize", key: "l" },
];

// (4d) Spacing handle spec. fx/fy place the handle at an edge midpoint;
// offsetX/offsetY shift it perpendicular to the edge (positive = inward
// for padding, outward for margin — see HANDLE_POSITIONS_PADDING /
// HANDLE_POSITIONS_MARGIN). axis + signMul drive `computeSpacing`'s math
// per the gesture-math.ts comments: signMul flips the cursor delta so
// "drag in the natural increase direction" maps to +value-delta.
interface SpacingHandleSpec {
  key: SpacingHandle;
  side: SpacingSide;
  spacingKind: "padding" | "margin";
  fx: number;
  fy: number;
  offsetX: number;
  offsetY: number;
  cursor: string;
  axis: "x" | "y";
  signMul: 1 | -1;
}

// Padding handles: 12 px INSIDE the bbox edge (toward element center).
// 12 px chosen so the 16×16 hit area's overlap with the resize edge handle's
// hit area is a 4 px sliver only. Spacing handles render after resize so they
// win clicks in the sliver (correct intent — interior-aimed click is "adjust
// spacing", not "resize").
const HANDLE_POSITIONS_PADDING: SpacingHandleSpec[] = [
  {
    key: "pt",
    side: "top",
    spacingKind: "padding",
    fx: 0.5,
    fy: 0,
    offsetX: 0,
    offsetY: 12,
    cursor: "ns-resize",
    axis: "y",
    signMul: 1,
  },
  {
    key: "pr",
    side: "right",
    spacingKind: "padding",
    fx: 1,
    fy: 0.5,
    offsetX: -12,
    offsetY: 0,
    cursor: "ew-resize",
    axis: "x",
    signMul: -1,
  },
  {
    key: "pb",
    side: "bottom",
    spacingKind: "padding",
    fx: 0.5,
    fy: 1,
    offsetX: 0,
    offsetY: -12,
    cursor: "ns-resize",
    axis: "y",
    signMul: -1,
  },
  {
    key: "pl",
    side: "left",
    spacingKind: "padding",
    fx: 0,
    fy: 0.5,
    offsetX: 12,
    offsetY: 0,
    cursor: "ew-resize",
    axis: "x",
    signMul: 1,
  },
];

// Margin handles: 12 px OUTSIDE the bbox edge (away from element).
const HANDLE_POSITIONS_MARGIN: SpacingHandleSpec[] = [
  {
    key: "mt",
    side: "top",
    spacingKind: "margin",
    fx: 0.5,
    fy: 0,
    offsetX: 0,
    offsetY: -12,
    cursor: "ns-resize",
    axis: "y",
    signMul: -1,
  },
  {
    key: "mr",
    side: "right",
    spacingKind: "margin",
    fx: 1,
    fy: 0.5,
    offsetX: 12,
    offsetY: 0,
    cursor: "ew-resize",
    axis: "x",
    signMul: 1,
  },
  {
    key: "mb",
    side: "bottom",
    spacingKind: "margin",
    fx: 0.5,
    fy: 1,
    offsetX: 0,
    offsetY: 12,
    cursor: "ns-resize",
    axis: "y",
    signMul: 1,
  },
  {
    key: "ml",
    side: "left",
    spacingKind: "margin",
    fx: 0,
    fy: 0.5,
    offsetX: -12,
    offsetY: 0,
    cursor: "ew-resize",
    axis: "x",
    signMul: -1,
  },
];

// camelCase CSS prop name from a (kind, side) pair. Matches what
// `lib/ast/operations/spacing.ts styleKeyFor` writes — the live
// stylesheet must use the same key the source rewrite will produce so
// the cascade stays consistent. We could import that helper but the
// duplication is 8 strings; a circular import isn't worth avoiding.
function spacingStyleKey(
  kind: "padding" | "margin",
  side: SpacingSide
): string {
  switch (side) {
    case "top":
      return `${kind}Top`;
    case "right":
      return `${kind}Right`;
    case "bottom":
      return `${kind}Bottom`;
    case "left":
      return `${kind}Left`;
  }
}

// (4c-iii) Per-handle X-anchor: the iframe-viewport coordinate of the
// edge that doesn't move during the resize. For right-side handles (r,
// tr, br) the unmoving edge is the LEFT edge → anchor = bounds.x. For
// left-side (l, tl, bl) it's the RIGHT edge. Top / bottom edge handles
// don't move the X axis at all → returns null. Used as input to
// `buildResizeCandidates` which converts iframe-viewport edge positions
// to dimension-snap candidates ("snap to width 320 because that lands
// the right edge on sibling X=420").
function handleAnchorX(handle: SizeHandle, bounds: Bounds): number | null {
  if (handle === "t" || handle === "b") return null;
  if (handle === "r" || handle === "tr" || handle === "br") return bounds.x;
  return bounds.x + bounds.width;
}

// (4c-iii) X-direction: +1 when moving edge extends positively from
// anchor (right-side handles), -1 when negatively (left-side handles).
function handleDirectionX(handle: SizeHandle): 1 | -1 | null {
  if (handle === "t" || handle === "b") return null;
  if (handle === "r" || handle === "tr" || handle === "br") return 1;
  return -1;
}

function handleAnchorY(handle: SizeHandle, bounds: Bounds): number | null {
  if (handle === "l" || handle === "r") return null;
  if (handle === "b" || handle === "bl" || handle === "br") return bounds.y;
  return bounds.y + bounds.height;
}

function handleDirectionY(handle: SizeHandle): 1 | -1 | null {
  if (handle === "l" || handle === "r") return null;
  if (handle === "b" || handle === "bl" || handle === "br") return 1;
  return -1;
}

// (Step 7) Color per soft-constraint kind for the warning chip. Overflow
// gets a stronger red because it's a layout-broken signal — the others
// are advisory amber. Single source of truth for both the chip background
// and the overflow indicator outline below.
function softConstraintColor(kind: SoftConstraintWarning["kind"]): string {
  return kind === "overflow" ? "#E63B2E" : "#F4A700";
}

// Shorter prefix label used in the warning chip — the message field
// already carries the metric ("Touch target 24×24px (min 32px)") so the
// chip title just disambiguates between kinds. Keeps the chip width
// bounded.
function softConstraintTitle(kind: SoftConstraintWarning["kind"]): string {
  switch (kind) {
    case "touch-target":
      return "TAP";
    case "text-size":
      return "TXT";
    case "aspect-distorted":
      return "ASP";
    case "contrast":
      return "WCAG";
    case "overflow":
      return "OVF";
  }
}

// (4c-iii) Color per snap kind for guide lines + chips. Sibling = green,
// parent = blue, parent-content = same blue (same priority tier),
// common = coral (matches the brand accent), grid = ink/muted gray.
// Spec line 147 calls these out; we map them once here so consumers
// don't repeat the table.
function snapColor(kind: SnapCandidate["kind"]): string {
  switch (kind) {
    case "sibling":
      return "#3CB371"; // green
    case "parent":
    case "parent-content":
      return "#4F8DC2"; // blue
    case "cross-section":
      return "#F4A700"; // amber — distinguishes "elsewhere on the page"
                       // from sibling/parent (which are layout-relative)
                       // and from recent/common (which are dim values)
    case "recent":
      return "#9B5DE5"; // purple — picked from the spec's "purple baseline"
                       // slot since recent acts similarly (a learned hint
                       // distinct from layout-derived sibling/parent and
                       // from the canonical common scale)
    case "common":
      return "#FF4D2E"; // coral
    case "grid":
      return "#8C847A"; // muted
  }
}

export default function SelectionOverlay({
  tool,
  selectedOid,
  additionalOids,
  watchBbox,
  tag,
  resize,
  spacing,
  inspect,
  move,
  actions,
}: SelectionOverlayProps) {
  // Phase 5 / Phase B — narrow gates. Resize / spacing / action
  // toolbar render in `select`; position handle renders in `move`.
  // Both tools paint the primary bbox outline + the secondary
  // outlines for additionals.
  const showResizeHandles = tool === "select";
  const showSpacingHandles = tool === "select";
  const showActionToolbar = tool === "select";
  const showMoveHandle = tool === "move";
  // Mobile/touch — handle hit areas expand to 44×44 on coarse pointers
  // per platform conventions (Apple HIG / Material). Visual size is
  // unchanged; only the invisible hit area grows.
  const coarsePointer = useCoarsePointer();
  const [rect, setRect] = useState<Bounds | null>(null);
  // Phase 2 acceptance #13 — bbox map for the additionals. Each OID has
  // its own subscription; we render a thin outline per entry and capture
  // start sizes from the latest snapshot at gesture pointerdown.
  // Updates during a gesture are intentionally NOT reflected in
  // `additionalStarts` (frozen at pointerdown) — those entries are
  // shown via the live stylesheet broadcast, which the canonical bbox
  // change reflects in real time.
  const [additionalRects, setAdditionalRects] = useState<
    ReadonlyMap<string, Bounds | null>
  >(() => new Map());
  const additionalRectsRef = useRef<ReadonlyMap<string, Bounds | null>>(
    new Map()
  );
  // Memoized stable string key so the effect below only refires when the
  // SET of additionals actually changes (not on render-driven array
  // identity churn). React's exhaustive-deps would also trigger on a
  // fresh array reference each render, even when the contents match.
  const additionalsKey = additionalOids
    .slice()
    .sort()
    .join("|");
  // Step 7 — soft constraint warnings for the currently selected element.
  // Refreshed on selection change AND debounced after rect changes
  // (post-rebuild reconciliation, post-commit settle, viewport scroll).
  // Cleared during gestures (live stylesheet overrides canonical styles —
  // warnings would be wrong). Null = "not yet queried" or "iframe didn't
  // respond"; empty array = "queried, no warnings". Distinguishing the
  // two lets the chip slot collapse cleanly when no warnings apply.
  const [softConstraints, setSoftConstraints] = useState<
    SoftConstraintWarning[] | null
  >(null);
  const gestureRef = useRef<GestureState | null>(null);
  // (eleventh-pass) Cursor-proximity flag for spacing handles. True when
  // the host cursor sits within `PROXIMITY_PX` of the selected element's
  // bbox (computed in iframe-viewport coords by translating cursor
  // position via the wrapper's getBoundingClientRect). Drives the
  // spacing handles' base opacity — far cursor = invisible, near cursor
  // = 0.7, hover = 1. CSS transitions handle the 100 ms ease between
  // states so we only flip a discrete boolean per crossing.
  // Always-true while a spacing gesture is active so handles stay
  // visible during the drag even if the cursor wanders just outside
  // the bbox edge (which it does whenever the user pulls a margin
  // handle further out).
  const [cursorNear, setCursorNear] = useState(false);
  // Wrapper for the host overlay; we measure its `getBoundingClientRect`
  // to translate host-viewport cursor coords into the iframe-viewport
  // space `rect` lives in. The ref attaches to the OUTER pointer-events:
  // none div, which fills the relative-positioned wrapper Preview.tsx
  // wraps around the iframe — same coord origin.
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // (eleventh-pass) Session-level recent-value caches for snap. Keyed by
  // gesture kind because the numeric scales differ — recent resize
  // values cluster around 100–1024 px, recent spacing values around
  // 0–96 px. Each cache holds the LAST 5 distinct committed values
  // (LRU; newest at the end). Stored on refs so a 60 fps drag pushing
  // values into the cache doesn't churn React state. Persists across
  // selection changes within the overlay's lifetime — moving from
  // element A to B keeps element A's recent values available.
  const RECENT_CAP = 5;
  const recentResizeRef = useRef<number[]>([]);
  const recentSpacingRef = useRef<number[]>([]);
  function pushRecent(cache: { current: number[] }, value: number) {
    if (!Number.isFinite(value)) return;
    const v = Math.round(value);
    const arr = cache.current.filter((x) => x !== v);
    arr.push(v);
    if (arr.length > RECENT_CAP) arr.splice(0, arr.length - RECENT_CAP);
    cache.current = arr;
  }
  // Track the listeners attached for the active gesture so we can tear them
  // down from the unmount cleanup effect even if a `pointerup` / cancel
  // never arrives (rare — happens if the host overlay unmounts mid-drag,
  // e.g. selection cleared while dragging). Stored as a single function so
  // the cleanup is a one-liner.
  const teardownRef = useRef<(() => void) | null>(null);
  // (4c-i) Constraint-active state — drives the "Min: Xpx" chip render.
  // Toggled in `pointermove` when the desired (raw) dim drops below the
  // gesture's cached min-content; cleared in `teardown`. The actual min
  // values render from `gestureRef.current.minContent` directly so a
  // single state flag suffices (no need to mirror them into useState).
  const [constraintAxis, setConstraintAxis] = useState<
    "width" | "height" | "both" | null
  >(null);
  // (4c-iii) Active snap candidates for guide rendering and the snap
  // chip. Resize tracks two (one per axis); spacing tracks one. Updated
  // via functional setState with id-based dedupe so a 60fps drag doesn't
  // dispatch 60 state changes per second when the active candidate
  // hasn't changed. Cleared in teardown.
  const [activeSnaps, setActiveSnaps] = useState<{
    w: SnapCandidate | null;
    h: SnapCandidate | null;
    spacing: SnapCandidate | null;
  }>({ w: null, h: null, spacing: null });

  // Phase 3 — move-gesture visual state. `moveActive` toggles the
  // position handle highlight + suppresses other handle visibility
  // during a drag. `moveTargetSnapshot` mirrors the live gesture's
  // currentTarget so the JSX render has a stable React snapshot to
  // draw the drop-target outline + insertion indicator from. Both
  // cleared on teardown (commit / bail / Esc).
  const [moveActive, setMoveActive] = useState(false);
  const [moveTargetSnapshot, setMoveTargetSnapshot] = useState<{
    targetOid: string;
    insertIndex: number;
    target: DropTarget;
  } | null>(null);
  // (Phase 3 polish) Mirror of the live ineligible hit, when the cursor
  // is over a red-feedback element. Drives a red outline + reason
  // tooltip render in the move JSX. Cleared (null) when cursor leaves
  // the ineligible OR moves to an eligible target. Set/cleared from the
  // pointermove handler.
  const [moveIneligibleSnapshot, setMoveIneligibleSnapshot] = useState<
    IneligibleDropTarget | null
  >(null);

  // Step 5 (Track B FLIP). `lastRectRef` mirrors the latest bbox push so
  // the gesture's onUp handler can capture the optimistic rect without
  // closing over the React `rect` state (which is one render behind by
  // definition). `pendingFlipRef` parks an arm at gesture commit; the
  // bbox watcher fires the flip when the post-rebuild canonical rect
  // arrives — single-shot consumption, expires after 2 s if the rebuild
  // doesn't land (defensive against an iframe that never reloads).
  const lastRectRef = useRef<Bounds | null>(null);
  const pendingFlipRef = useRef<{
    oid: string;
    fromRect: Bounds;
    expiresAt: number;
  } | null>(null);

  // Phase 2 acceptance #13 — subscribe to bbox for each additional OID.
  // Iterate the stable key, not the array, so a new identity from the
  // parent doesn't re-subscribe when contents are equal. Each sub
  // updates a single entry in the additionalRects map; the map is
  // keyed by OID and replaces wholesale per push (React state ID
  // dedupe — the snapshot IS the new map). Cleanup unsubs everything
  // on unmount or when the additionals key changes.
  useEffect(() => {
    if (additionalOids.length === 0) {
      setAdditionalRects(new Map());
      additionalRectsRef.current = new Map();
      return;
    }
    const unsubs: Array<() => void> = [];
    // Seed entries to null so renders before the first push don't
    // produce phantom missing-element states.
    setAdditionalRects((prev) => {
      const next = new Map<string, Bounds | null>();
      for (const oid of additionalOids) {
        next.set(oid, prev.get(oid) ?? null);
      }
      additionalRectsRef.current = next;
      return next;
    });
    for (const oid of additionalOids) {
      const unsub = watchBbox(oid, (next) => {
        setAdditionalRects((prev) => {
          const updated = new Map(prev);
          updated.set(oid, next);
          additionalRectsRef.current = updated;
          return updated;
        });
      });
      unsubs.push(unsub);
    }
    return () => {
      for (const u of unsubs) u();
      setAdditionalRects(new Map());
      additionalRectsRef.current = new Map();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [additionalsKey, watchBbox]);

  useEffect(() => {
    if (!selectedOid) {
      setRect(null);
      lastRectRef.current = null;
      // Selection change invalidates any pending flip — the new selection's
      // bbox pushes are for a different OID, but a stale entry could fire
      // if the user re-selects the same OID later in the lifecycle.
      pendingFlipRef.current = null;
      return;
    }
    const unsubscribe = watchBbox(selectedOid, (next) => {
      setRect(next);
      lastRectRef.current = next;
      // Track B drift detection: when a pending flip exists for this OID
      // and a new rect arrives, compare to the armed `fromRect`. If drift
      // exceeds the threshold (1 px positional or 1% scale), fire the
      // flip animation. Single-shot — clear the pending entry whether or
      // not we fired (no-op flips are still consumed so a later bbox
      // push doesn't trigger them stale).
      const pending = pendingFlipRef.current;
      if (pending && next && pending.oid === selectedOid) {
        if (Date.now() > pending.expiresAt) {
          pendingFlipRef.current = null;
          return;
        }
        const drift = detectDrift(pending.fromRect, next);
        // requestFlip is plumbed on every binding that can arm a flip
        // (resize / spacing / move). All three pass the same Preview-
        // side function so any accessor lands the postMessage.
        const fire =
          resize?.requestFlip ?? spacing?.requestFlip ?? move?.requestFlip;
        if (drift && fire) {
          fire(pending.oid, pending.fromRect);
        }
        pendingFlipRef.current = null;
      }
    });
    return () => {
      unsubscribe();
      setRect(null);
      lastRectRef.current = null;
      pendingFlipRef.current = null;
    };
  }, [selectedOid, watchBbox, resize, spacing, move]);

  // Phase 5 / Phase B / B5 — clear in-flight gesture state whenever
  // the active tool changes. Test: start a Move drag, hit `S`
  // mid-drag — the drag snaps back to canonical position without
  // committing.
  //
  // Why dep is just `[tool]` (not also `[resize, spacing, move]`):
  // Preview.tsx composes `resizeBindings` / `spacingBindings` /
  // `moveBindings` as fresh object literals on every render, so
  // including them in deps would fire this teardown on every parent
  // re-render — which would CLOBBER an in-flight gesture (Workspace
  // re-renders during a drag because liveBbox updates flow through
  // its state). `tool` only changes when the user picks a different
  // tool — exactly when we want to bail. Bindings are accessed via
  // closure for the cleanup helpers; their inner methods
  // (`clearLiveStyle`, `setIframePointerEventsDisabled`) are
  // useCallback-stable so closure capture is fine.
  //
  // Refs (gestureRef, pendingFlipRef) are mutated directly; state
  // setters are stable identity per React semantics.
  useEffect(() => {
    // Tool-switch mid-gesture path. The previous shape inlined a partial
    // cleanup (gestureRef null + clearLiveStyle + restorePE) but left the
    // 8 window/document listeners (pointermove/up/cancel/lostpointercapture
    // /keydown/keyup/blur/visibilitychange) bound to the prior gesture's
    // closures. They became inert (each gates on gestureRef.current), but
    // accumulated O(8) per tool-switch until the overlay unmounted. The
    // existing per-gesture `teardown(clearLive)` (e.g. line 1780+) already
    // removes every listener AND nulls gestureRef AND restores iframe
    // pointer events AND clears live styles per kind — call it directly so
    // tool-switch tears down the same way as a normal gesture release.
    if (teardownRef.current) {
      teardownRef.current();
      teardownRef.current = null;
    }
    pendingFlipRef.current = null;
    setMoveActive(false);
    setMoveTargetSnapshot(null);
    setMoveIneligibleSnapshot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see comment above
  }, [tool]);

  // Step 7 — soft constraint refresh. Two effects:
  //   1. Immediate fire on selection change. Fresh selections should
  //      show their warnings without waiting.
  //   2. Debounced re-fire on rect changes (200 ms). Post-rebuild
  //      reconciliation, post-commit settle, scroll. The debounce
  //      coalesces a burst of bbox pushes into one query.
  // Both paths skip during gestures: a live stylesheet override would
  // make the canonical styles invisible to the iframe; warnings during
  // a drag would be wrong. Cleared when bindings disappear.
  const requestSoftConstraints = inspect?.requestSoftConstraints;
  // Effect 1: immediate fire on selection change (clears the previous
  // selection's warnings on the way through so the chip slot doesn't
  // briefly show stale warnings for the wrong element).
  useEffect(() => {
    setSoftConstraints(null);
    if (!requestSoftConstraints || !selectedOid) return;
    if (gestureRef.current !== null) return;
    let cancelled = false;
    const oidAtFire = selectedOid;
    requestSoftConstraints(oidAtFire).then(
      (result) => {
        if (cancelled) return;
        if (oidAtFire !== selectedOid) return;
        setSoftConstraints(result);
      },
      () => {
        // Promise never rejects today (resolves null on timeout); defensive.
      }
    );
    return () => {
      cancelled = true;
    };
  }, [selectedOid, requestSoftConstraints]);
  // Effect 2: debounced re-fire on rect changes. The rect state is the
  // dep; whenever the bbox watcher pushes a new rect, this effect's
  // cleanup cancels the previous timer and a fresh one schedules a
  // refire 200 ms out. So a steady stream of bbox pushes (active
  // gesture, rapid scroll) collapses to "one query 200 ms after the
  // last push." Selection-change is handled by Effect 1 above —
  // Effect 2's gate skips the initial fire by checking that softConstraints
  // is non-null (Effect 1 ran successfully) OR rect was already non-null
  // before this effect's dep changed. Cheaper: just fire every time, the
  // host's pendingMap dedupe handles in-flight overlap.
  useEffect(() => {
    if (!requestSoftConstraints || !selectedOid || !rect) return;
    if (gestureRef.current !== null) return;
    const oidAtFire = selectedOid;
    const timeoutId = setTimeout(() => {
      requestSoftConstraints(oidAtFire).then(
        (result) => {
          if (oidAtFire !== selectedOid) return;
          setSoftConstraints(result);
        },
        () => {}
      );
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [selectedOid, requestSoftConstraints, rect]);

  // Tear down any active gesture if the overlay unmounts. Without this, an
  // in-flight drag whose pointer events flow through window listeners would
  // leak its listeners + leave `iframe.style.pointerEvents = 'none'` behind.
  useEffect(() => {
    return () => {
      if (teardownRef.current) {
        teardownRef.current();
        teardownRef.current = null;
      }
    };
  }, []);

  // (eleventh-pass) Cursor-proximity tracker. When spacing bindings are
  // wired AND a bbox is rendered, attach a window-level pointermove
  // listener that updates `cursorNear` based on cursor distance to the
  // bbox. rAF-coalesced so a fast 60+ Hz mouse can't dispatch more than
  // one setState per frame; further dedupe via discrete boolean state
  // (no churn when the cursor hovers within the same proximity zone).
  // Skipped entirely when spacing isn't wired or no element is selected.
  useEffect(() => {
    if (!spacing || !rect) {
      // Reset when bindings or selection vanish so a stale near-state
      // doesn't paint handles for a now-unselected element on the next
      // mount.
      setCursorNear(false);
      return;
    }
    const PROXIMITY_PX = 60;
    let scheduled = false;
    let lastClientX = 0;
    let lastClientY = 0;

    function compute() {
      scheduled = false;
      const wrapper = wrapperRef.current;
      if (!wrapper || !rect) return;
      // The wrapper fills the relative container that also houses the
      // iframe, so its top-left in host viewport coords IS the iframe-
      // viewport's origin. Subtracting that from the client cursor
      // position gives cursor coords in iframe-viewport space.
      const wb = wrapper.getBoundingClientRect();
      const ix = lastClientX - wb.left;
      const iy = lastClientY - wb.top;
      // Distance from cursor to bbox: 0 when inside, otherwise the
      // straight-line distance to the nearest edge.
      const dx = Math.max(0, rect.x - ix, ix - (rect.x + rect.width));
      const dy = Math.max(0, rect.y - iy, iy - (rect.y + rect.height));
      const distance = Math.hypot(dx, dy);
      const next = distance < PROXIMITY_PX;
      setCursorNear((prev) => (prev === next ? prev : next));
    }

    function onMove(ev: PointerEvent) {
      lastClientX = ev.clientX;
      lastClientY = ev.clientY;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(compute);
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [spacing, rect]);

  // While a spacing gesture is in flight, force `cursorNear: true` so the
  // handles remain at full opacity even if the user drags so far that
  // the proximity tracker would otherwise flip to false. The proximity
  // listener stays attached and will resume normal updates the moment
  // the gesture ends.
  const spacingGestureActive =
    gestureRef.current?.kind === "spacing";
  const handlesNear = cursorNear || spacingGestureActive;

  function readModifiers(ev: { shiftKey: boolean; altKey: boolean; metaKey: boolean; ctrlKey: boolean }): DragModifiers {
    return {
      shift: ev.shiftKey,
      alt: ev.altKey,
      cmd: ev.metaKey || ev.ctrlKey,
    };
  }

  // (4c-iii) Run the snap pass for a resize gesture. Per axis:
  //   1. Build candidates from the cached parent + siblings + element bounds.
  //   2. Call snap() with the gesture's per-axis state + grid fallback.
  //   3. Mutate the gesture's snap state with the new active candidate
  //      (the snap module is pure; the caller owns the state container).
  // Publishes the active candidate to React state for guide rendering /
  // chip with id-based dedupe so a 60fps drag doesn't churn setState.
  // Returns the (possibly snapped) dims to feed into the elastic pass.
  function applySnap(
    g: ResizeGestureState,
    dims: { w: number | null; h: number | null },
    modifiers: DragModifiers
  ): { w: number | null; h: number | null } {
    const enabled = !modifiers.cmd;
    let outW = dims.w;
    let outH = dims.h;
    let activeW: SnapCandidate | null = null;
    let activeH: SnapCandidate | null = null;
    if (outW !== null) {
      const anchor = handleAnchorX(g.handle, g.elementBounds);
      const direction = handleDirectionX(g.handle);
      if (enabled && anchor !== null && direction !== null) {
        const cands = buildResizeCandidates({
          axis: "x",
          anchor,
          direction,
          parent: g.parent,
          siblings: g.siblings,
          elementBounds: g.elementBounds,
          recentValues: recentResizeRef.current,
          crossSection: g.context?.crossSection ?? [],
        });
        const r = snap(g.snapStateW, outW, cands, {
          enabled: true,
          gridSize: DEFAULT_GRID_SIZE,
        });
        outW = r.value;
        activeW = r.active;
        g.snapStateW.active = r.active;
      } else {
        g.snapStateW.active = null;
      }
    } else {
      g.snapStateW.active = null;
    }
    if (outH !== null) {
      const anchor = handleAnchorY(g.handle, g.elementBounds);
      const direction = handleDirectionY(g.handle);
      if (enabled && anchor !== null && direction !== null) {
        const cands = buildResizeCandidates({
          axis: "y",
          anchor,
          direction,
          parent: g.parent,
          siblings: g.siblings,
          elementBounds: g.elementBounds,
          recentValues: recentResizeRef.current,
          crossSection: g.context?.crossSection ?? [],
        });
        const r = snap(g.snapStateH, outH, cands, {
          enabled: true,
          gridSize: DEFAULT_GRID_SIZE,
        });
        outH = r.value;
        activeH = r.active;
        g.snapStateH.active = r.active;
      } else {
        g.snapStateH.active = null;
      }
    } else {
      g.snapStateH.active = null;
    }
    publishActiveSnaps(activeW, activeH, null);
    return { w: outW, h: outH };
  }

  // ID-based dedupe for activeSnaps state. Without this, a 60 fps drag
  // dispatches a setState per frame with the same logical content (the
  // active candidate hasn't actually changed) and React re-renders the
  // overlay needlessly, dropping the gesture latency budget.
  function publishActiveSnaps(
    w: SnapCandidate | null,
    h: SnapCandidate | null,
    spacing: SnapCandidate | null
  ) {
    setActiveSnaps((prev) => {
      const prevW = prev.w ? candidateId(prev.w) : null;
      const prevH = prev.h ? candidateId(prev.h) : null;
      const prevS = prev.spacing ? candidateId(prev.spacing) : null;
      const nextW = w ? candidateId(w) : null;
      const nextH = h ? candidateId(h) : null;
      const nextS = spacing ? candidateId(spacing) : null;
      if (prevW === nextW && prevH === nextH && prevS === nextS) return prev;
      return { w, h, spacing };
    });
  }

  function handleResizePointerDown(
    e: ReactPointerEvent<HTMLDivElement>,
    handleKey: SizeHandle
  ) {
    if (!selectedOid || !rect || !resize) return;
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // setPointerCapture can throw if the pointer isn't currently active —
      // proceed anyway, the window-level listeners pick up the rest.
    }

    // Step 5 — clear any stale Track B pending flip from a prior commit.
    // Without this, the live stylesheet's first bbox change in this new
    // gesture would trigger the prior commit's flip with the wrong rect.
    pendingFlipRef.current = null;
    // Step 7 — clear soft-constraint warnings during the gesture. They'd
    // be wrong (live stylesheet overrides canonical styles); Effect 2
    // re-queries on the post-commit rect settle and re-populates.
    setSoftConstraints(null);

    resize.setIframePointerEventsDisabled(true);

    // Phase 2 acceptance #13 — capture per-element start sizes for the
    // additionals from the latest bbox snapshot. Entries with a missing
    // bbox (rare race; element was unsubscribed mid-mount) are omitted —
    // those participants sit out the gesture cleanly.
    const additionalStarts = new Map<string, { width: number; height: number }>();
    for (const aoid of additionalOids) {
      const aRect = additionalRectsRef.current.get(aoid);
      if (aRect) {
        additionalStarts.set(aoid, {
          width: aRect.width,
          height: aRect.height,
        });
      }
    }
    const localG: ResizeGestureState = {
      kind: "resize",
      oid: selectedOid,
      handle: handleKey,
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
      pointerId: e.pointerId,
      minContent: null,
      // (4c-ii) Capture aspect at gesture-start. Frozen for the gesture's
      // lifetime — see ResizeGestureState.aspect comment for rationale.
      aspect: captureAspect(rect.width, rect.height),
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      // (4c-iii) Snap inputs — element bounds frozen so anchor stays
      // stable through the drag, parent + siblings populated async by
      // requestLayoutContext below.
      elementBounds: { ...rect },
      parent: null,
      siblings: [],
      context: null,
      snapStateW: { active: null },
      snapStateH: { active: null },
      additionalStarts,
    };
    gestureRef.current = localG;

    // (4c-i) Fire the async min-content fetch. Don't await — gesture starts
    // now; constraint kicks in once the response lands. Identity-check
    // against the live gestureRef so a stale resolution from a previous
    // gesture (or one that's already been canceled) can't mutate a fresh
    // gesture's state.
    if (resize.requestMinContent) {
      resize.requestMinContent(localG.oid).then(
        (result) => {
          if (gestureRef.current === localG && result) {
            localG.minContent = result;
          }
        },
        () => {
          // requestMinContent never rejects today (resolves null on
          // timeout) but a future reshape shouldn't break the gesture.
        }
      );
    }

    // (4c-iii) Fire the async layout-context fetch for snap candidates.
    // Same fire-and-forget shape as requestMinContent. Until this lands,
    // snap can only fire grid fallback (no enumerated candidates) — that's
    // the right behaviour for the sub-frame before context arrives. The
    // typical resolve is <20 ms so the user rarely notices the gap.
    if (resize.requestLayoutContext) {
      resize.requestLayoutContext(localG.oid).then(
        (ctx) => {
          if (gestureRef.current !== localG || !ctx) return;
          localG.parent = ctx.parent;
          localG.siblings = ctx.siblings;
          // (twelfth-pass) Full context cached so onUp can pass it to the
          // intent resolver. Snap path (per-axis) keeps reading the
          // narrower parent / siblings refs above for legacy reasons; the
          // resolver path uses the full LayoutContext shape.
          localG.context = ctx;
        },
        () => {
          // requestLayoutContext never rejects today (resolves null on
          // timeout) but defensive — snap stays grid-only without it.
        }
      );
    }

    // (4c-ii) Shared move math. Reused by the pointermove handler AND by
    // the keydown / keyup handlers when Shift / Alt toggles change the
    // visual without a mouse move.
    function applyMove(
      clientX: number,
      clientY: number,
      modifiers: DragModifiers
    ) {
      const g = gestureRef.current;
      if (!g || g.kind !== "resize") return;
      g.lastClientX = clientX;
      g.lastClientY = clientY;
      const dims = computeDims(
        {
          handle: g.handle,
          startX: g.startX,
          startY: g.startY,
          startW: g.startW,
          startH: g.startH,
          aspect: g.aspect,
        },
        clientX,
        clientY,
        modifiers
      );
      // (4c-iii) Snap pass — applies before elastic so the snap value is
      // canonical and elastic only fires when desired is below min-content
      // (snap candidates with values below min are filtered out by virtue
      // of being out of range; elastic kicks in only for desired values
      // smaller than every candidate, which would already be below min in
      // practice). Cmd held disables snap entirely. Each axis gets its
      // own snap state + candidate list so they're independent.
      const snapped = applySnap(g, dims, modifiers);
      let wOut = snapped.w;
      let hOut = snapped.h;
      let wConstrained = false;
      let hConstrained = false;
      if (g.minContent) {
        if (wOut !== null) {
          if (wOut < g.minContent.minWidth) wConstrained = true;
          wOut = applyElasticDim(wOut, g.minContent.minWidth);
        }
        if (hOut !== null) {
          if (hOut < g.minContent.minHeight) hConstrained = true;
          hOut = applyElasticDim(hOut, g.minContent.minHeight);
        }
      }
      const decl: Record<string, string> = {};
      if (wOut !== null) decl.width = `${Math.round(wOut)}px`;
      if (hOut !== null) decl.height = `${Math.round(hOut)}px`;
      resize?.setLiveStyle(g.oid, decl);

      // Phase 2 acceptance #13 — broadcast the delta to additional
      // participants. Each receives the SAME delta against its own
      // start size, not the primary's snapped value. Compute deltas
      // post-snap so visually all elements move in lockstep with the
      // primary's snapped-and-elasticated value.
      if (g.additionalStarts.size > 0) {
        const dw =
          wOut !== null && wOut !== g.startW ? wOut - g.startW : null;
        const dh =
          hOut !== null && hOut !== g.startH ? hOut - g.startH : null;
        g.additionalStarts.forEach((start, aoid) => {
          const aDecl: Record<string, string> = {};
          if (dw !== null) {
            const v = Math.max(0, start.width + dw);
            aDecl.width = `${Math.round(v)}px`;
          }
          if (dh !== null) {
            const v = Math.max(0, start.height + dh);
            aDecl.height = `${Math.round(v)}px`;
          }
          if (Object.keys(aDecl).length > 0) {
            resize?.setLiveStyle(aoid, aDecl);
          }
        });
      }

      const nextAxis: "width" | "height" | "both" | null =
        wConstrained && hConstrained
          ? "both"
          : wConstrained
            ? "width"
            : hConstrained
              ? "height"
              : null;
      setConstraintAxis((prev) => (prev === nextAxis ? prev : nextAxis));
    }

    function onMove(ev: PointerEvent) {
      applyMove(ev.clientX, ev.clientY, readModifiers(ev));
    }

    function onUp(ev: PointerEvent) {
      const g = gestureRef.current;
      let committed = false;
      if (g && g.kind === "resize" && resize) {
        const dims = computeDims(
          {
            handle: g.handle,
            startX: g.startX,
            startY: g.startY,
            startW: g.startW,
            startH: g.startH,
            aspect: g.aspect,
          },
          ev.clientX,
          ev.clientY,
          readModifiers(ev)
        );
        // (4c-iii) Snap on commit too, so the canonical source value
        // matches the visible drag-end value. The snap state already
        // tracks the active candidate from the last applyMove; a fresh
        // snap call here just re-evaluates at the release cursor pos
        // (the user might have nudged 1-2 px between the last move and
        // the release; snap absorbs it).
        const snapped = applySnap(g, dims, readModifiers(ev));
        // (4c-i) Snap to min-content on commit. Visual was elastic during
        // the drag; the canonical source value commits at the bound — never
        // below.
        let wCommit = snapped.w;
        let hCommit = snapped.h;
        if (g.minContent) {
          if (wCommit !== null && wCommit < g.minContent.minWidth) {
            wCommit = g.minContent.minWidth;
          }
          if (hCommit !== null && hCommit < g.minContent.minHeight) {
            hCommit = g.minContent.minHeight;
          }
        }
        if (wCommit !== null || hCommit !== null) {
          // (Twelfth-pass) Route through the intent resolver so flex
          // children edit `flex-basis` instead of `width` (acceptance
          // criterion #11). When `g.context` is null (layout-context
          // fetch not yet back, or fetched as null), the resolver fills
          // in the default block-layout context internally and returns
          // basis='width'/'height' — same behaviour as pre-resolver.
          const intents = g.context
            ? resolveResizeIntent({
                handle: g.handle,
                context: g.context,
                modifiers: readModifiers(ev),
              })
            : null;
          // Build the PRIMARY declarations map. Track which CSS prop the
          // intent resolver chose per axis so additionals can mirror it
          // (single-element flow doesn't need this; it's only the
          // multi-broadcast that has to know which key to write under).
          const decl: Record<string, string | null> = {};
          let primaryWidthProp: string | null = null;
          let primaryHeightProp: string | null = null;
          if (intents) {
            for (const intent of intents) {
              const cssProp = basisToStyleProp(intent.basis);
              if (cssProp === null) continue;
              if (intent.kind === "resize-width" && wCommit !== null) {
                decl[cssProp] = `${wCommit}px`;
                primaryWidthProp = cssProp;
              } else if (intent.kind === "resize-height" && hCommit !== null) {
                decl[cssProp] = `${hCommit}px`;
                primaryHeightProp = cssProp;
              }
            }
          } else {
            // Pre-context fallback: plain width/height per axis. Same as
            // (4b) when the resolver wasn't wired.
            if (wCommit !== null) {
              decl.width = `${wCommit}px`;
              primaryWidthProp = "width";
            }
            if (hCommit !== null) {
              decl.height = `${hCommit}px`;
              primaryHeightProp = "height";
            }
          }
          // Phase 2 acceptance #13 — multi-element commit when additionals
          // exist AND the multi handler is wired. Additionals reuse the
          // primary's per-axis CSS prop names (we don't re-run
          // resolveResizeIntent per additional because we'd need each
          // additional's LayoutContext — extra fetches we haven't done).
          // For homogeneous selections (3 sibling divs) the prop name is
          // exactly right; heterogeneous selections may get suboptimal
          // prop choice but the visual delta still applies. The
          // gesture's headline behaviour ("all three resize by the same
          // delta") holds. Single-element flow stays on `onResizeCommit`
          // so existing acceptance criteria don't regress.
          if (
            g.additionalStarts.size > 0 &&
            resize.onResizeMultiCommit &&
            Object.keys(decl).length > 0
          ) {
            const dw =
              wCommit !== null && wCommit !== g.startW ? wCommit - g.startW : null;
            const dh =
              hCommit !== null && hCommit !== g.startH ? hCommit - g.startH : null;
            const ops: Array<{
              oid: string;
              declarations: Record<string, string | null>;
            }> = [{ oid: g.oid, declarations: decl }];
            g.additionalStarts.forEach((start, aoid) => {
              const aDecl: Record<string, string | null> = {};
              if (dw !== null && primaryWidthProp) {
                const v = Math.max(0, Math.round(start.width + dw));
                aDecl[primaryWidthProp] = `${v}px`;
              }
              if (dh !== null && primaryHeightProp) {
                const v = Math.max(0, Math.round(start.height + dh));
                aDecl[primaryHeightProp] = `${v}px`;
              }
              if (Object.keys(aDecl).length > 0) {
                ops.push({ oid: aoid, declarations: aDecl });
              }
            });
            committed = resize.onResizeMultiCommit(ops);
          } else if (Object.keys(decl).length > 0) {
            committed = resize.onResizeCommit(g.oid, decl);
          }
        }
        // (eleventh-pass) On a successful commit, remember the values
        // for future snap candidates. Pushed AFTER the commit returns
        // true so a bailed engine (style={cn(...)}, etc.) doesn't
        // pollute the cache with values that never landed in source.
        if (committed) {
          if (wCommit !== null) pushRecent(recentResizeRef, wCommit);
          if (hCommit !== null) pushRecent(recentResizeRef, hCommit);
          // Step 5 — arm Track B FLIP from the user's last optimistic
          // rect. The bbox watcher fires it when the post-rebuild
          // canonical rect lands. 2 s expiry guards against an iframe
          // that never reloads (rare, but bail-safe).
          const lastRect = lastRectRef.current;
          if (lastRect && resize.requestFlip) {
            pendingFlipRef.current = {
              oid: g.oid,
              fromRect: {
                x: lastRect.x,
                y: lastRect.y,
                width: lastRect.width,
                height: lastRect.height,
              },
              expiresAt: Date.now() + 2000,
            };
          }
        }
      }
      teardown(!committed);
    }

    function onCancel() {
      teardown(true);
    }

    function onKeyDown(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        teardown(true);
        return;
      }
      if (ev.key === "Shift" || ev.key === "Alt") {
        const g = gestureRef.current;
        if (!g || g.kind !== "resize") return;
        applyMove(g.lastClientX, g.lastClientY, readModifiers(ev));
      }
    }

    function onKeyUp(ev: KeyboardEvent) {
      if (ev.key === "Shift" || ev.key === "Alt") {
        const g = gestureRef.current;
        if (!g || g.kind !== "resize") return;
        applyMove(g.lastClientX, g.lastClientY, readModifiers(ev));
      }
    }

    function onVisChange() {
      if (document.visibilityState === "hidden") teardown(true);
    }

    function teardown(clearLive: boolean) {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("lostpointercapture", onCancel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onCancel);
      document.removeEventListener("visibilitychange", onVisChange);
      const g = gestureRef.current;
      gestureRef.current = null;
      teardownRef.current = null;
      setConstraintAxis(null);
      // (4c-iii) Clear active snap chip + guide lines.
      setActiveSnaps({ w: null, h: null, spacing: null });
      if (resize) {
        resize.setIframePointerEventsDisabled(false);
        if (clearLive && g && g.kind === "resize") {
          resize.clearLiveStyle(g.oid);
          // Phase 2 acceptance #13 — also clear the additionals' live
          // rules. Each was painted via setLiveStyle during the gesture
          // and won't be wiped by a Track B rebuild on bail (no rebuild
          // happens on bail).
          g.additionalStarts.forEach((_, aoid) => {
            resize.clearLiveStyle(aoid);
          });
        }
      }
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("lostpointercapture", onCancel);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onCancel);
    document.addEventListener("visibilitychange", onVisChange);
    teardownRef.current = () => teardown(true);
  }

  // (4d) Spacing pointerdown handler. Parallel to handleResizePointerDown
  // — same lifecycle (capture pointer, disable iframe events, attach 8
  // window listeners, teardown on cancel) but with spacing-specific math
  // and commit shape.
  function handleSpacingPointerDown(
    e: ReactPointerEvent<HTMLDivElement>,
    spec: SpacingHandleSpec
  ) {
    if (!selectedOid || !rect || !spacing) return;
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // setPointerCapture can throw if the pointer isn't currently active —
      // proceed anyway.
    }

    // Step 5 — clear any stale Track B pending flip from a prior commit.
    pendingFlipRef.current = null;
    // Step 7 — clear soft-constraint warnings during the gesture.
    setSoftConstraints(null);

    spacing.setIframePointerEventsDisabled(true);

    const localG: SpacingGestureState = {
      kind: "spacing",
      oid: selectedOid,
      handle: spec,
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      // Initial baselines are 0; corrected once requestLayoutContext lands.
      // contextReady gates pointermove writes until then.
      startValue: 0,
      startOppositeValue: 0,
      contextReady: false,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      // (4c-iii) Snap state — single 1D state for the active spacing axis.
      snapState: { active: null },
      // Phase 2 acceptance #13 — additional baselines (4-side per OID).
      // Populated as each additional's requestLayoutContext resolves.
      // contextReady on the gesture stays false until the PRIMARY's
      // baseline lands; additionals fill in opportunistically and any
      // that haven't resolved by gesture-end sit out the commit.
      additionalStarts: new Map(),
    };
    gestureRef.current = localG;

    // Phase 2 acceptance #13 — fire layout-context fetches for every
    // additional. Each resolution updates the Map entry. The map mutates
    // in place; gesture state container is mutable on purpose (matches
    // resize's minContent / parent / context fields). Identity-checked
    // against gestureRef.current so stale resolutions from canceled
    // gestures don't leak into a fresh gesture's state.
    for (const aoid of additionalOids) {
      spacing.requestLayoutContext(aoid).then(
        (ctx) => {
          if (gestureRef.current !== localG || !ctx) return;
          const offsets =
            spec.spacingKind === "padding" ? ctx.padding : ctx.margin;
          const updated = new Map(localG.additionalStarts);
          updated.set(aoid, {
            top: offsets.top,
            right: offsets.right,
            bottom: offsets.bottom,
            left: offsets.left,
          });
          // Re-assigning to a readonly field is fine — the readonly is
          // an external API contract; we own the gesture state. Cast
          // through unknown because Map<K,V> is invariant in V.
          (localG as unknown as {
            additionalStarts: ReadonlyMap<
              string,
              { top: number; right: number; bottom: number; left: number }
            >;
          }).additionalStarts = updated;
        },
        () => {}
      );
    }

    // Fetch the resolved padding/margin per side. Don't await — gesture
    // starts immediately; pointermove suppresses its writes until ready.
    // Identity-check guards against stale resolutions from canceled gestures.
    spacing.requestLayoutContext(localG.oid).then(
      (ctx) => {
        if (gestureRef.current !== localG || !ctx) return;
        const offsets = spec.spacingKind === "padding" ? ctx.padding : ctx.margin;
        const oppositeSide = oppositeSpacingSide(spec.side);
        localG.startValue = offsets[spec.side];
        localG.startOppositeValue = offsets[oppositeSide];
        localG.contextReady = true;
        // Don't pre-emptively re-paint — typical resolve is sub-20 ms,
        // before the user has moved a pixel. Next pointermove / Alt re-fire
        // applies the correct delta with the freshly-loaded baseline.
      },
      () => {
        // requestLayoutContext shouldn't reject (resolves null on timeout)
        // but defensive — leaves contextReady=false so writes stay
        // suppressed and the gesture cancels cleanly on pointerup.
      }
    );

    function applyMove(
      clientX: number,
      clientY: number,
      modifiers: DragModifiers
    ) {
      const g = gestureRef.current;
      if (!g || g.kind !== "spacing") return;
      g.lastClientX = clientX;
      g.lastClientY = clientY;
      if (!g.contextReady) return;
      const result = computeSpacing(
        {
          axis: g.handle.axis,
          signMul: g.handle.signMul,
          kind: g.handle.spacingKind,
          startX: g.startX,
          startY: g.startY,
          startValue: g.startValue,
          startOppositeValue: g.startOppositeValue,
        },
        clientX,
        clientY,
        modifiers
      );
      // (4c-iii) Snap the active value to common spacing scale + grid
      // fallback. Cmd held disables. When Alt is held (symmetric), the
      // snapped delta cascades to the opposite side too — re-derive
      // opposite from the snapped active so both sides stay in sync.
      const cands = buildSpacingCandidates({
        kind: g.handle.spacingKind,
        recentValues: recentSpacingRef.current,
      });
      const snapped = snap(g.snapState, result.active, cands, {
        enabled: !modifiers.cmd,
        gridSize: DEFAULT_GRID_SIZE,
      });
      g.snapState.active = snapped.active;
      publishActiveSnaps(null, null, snapped.active);
      const finalActive = snapped.value;
      let finalOpposite = result.opposite;
      if (finalOpposite !== null && finalActive !== result.active) {
        // Cascade the snapped delta. opposite = startOpposite +
        // (finalActive - startValue). Re-derived to keep Alt-symmetric
        // semantics consistent: whatever snap did to the active side's
        // delta also applies to the opposite side's delta.
        finalOpposite = g.startOppositeValue + (finalActive - g.startValue);
        if (g.handle.spacingKind === "padding" && finalOpposite < 0) {
          finalOpposite = 0;
        }
      }
      const decl: Record<string, string> = {};
      const activeKey = spacingStyleKey(g.handle.spacingKind, g.handle.side);
      decl[activeKey] = `${Math.round(finalActive)}px`;
      if (finalOpposite !== null) {
        const oppKey = spacingStyleKey(
          g.handle.spacingKind,
          oppositeSpacingSide(g.handle.side)
        );
        decl[oppKey] = `${Math.round(finalOpposite)}px`;
      }
      spacing?.setLiveStyle(g.oid, decl);

      // Phase 2 acceptance #13 — broadcast the snapped delta to
      // additional participants. Each additional that has a resolved
      // baseline gets the same delta against ITS OWN start value; the
      // padding clamp at 0 also applies per element. Additionals
      // without a resolved baseline are skipped silently (their
      // requestLayoutContext is in flight or failed).
      if (g.additionalStarts.size > 0) {
        const delta = finalActive - g.startValue;
        const oppDelta =
          finalOpposite !== null
            ? finalOpposite - g.startOppositeValue
            : null;
        g.additionalStarts.forEach((sides, aoid) => {
          const aDecl: Record<string, string> = {};
          let activeVal = sides[g.handle.side] + delta;
          if (g.handle.spacingKind === "padding" && activeVal < 0) {
            activeVal = 0;
          }
          aDecl[activeKey] = `${Math.round(activeVal)}px`;
          if (oppDelta !== null) {
            const oppSide = oppositeSpacingSide(g.handle.side);
            let oppVal = sides[oppSide] + oppDelta;
            if (g.handle.spacingKind === "padding" && oppVal < 0) {
              oppVal = 0;
            }
            const oppKey = spacingStyleKey(g.handle.spacingKind, oppSide);
            aDecl[oppKey] = `${Math.round(oppVal)}px`;
          }
          spacing?.setLiveStyle(aoid, aDecl);
        });
      }
    }

    function onMove(ev: PointerEvent) {
      applyMove(ev.clientX, ev.clientY, readModifiers(ev));
    }

    function onUp(ev: PointerEvent) {
      const g = gestureRef.current;
      let committed = false;
      if (g && g.kind === "spacing" && spacing && g.contextReady) {
        const mods = readModifiers(ev);
        const result = computeSpacing(
          {
            axis: g.handle.axis,
            signMul: g.handle.signMul,
            kind: g.handle.spacingKind,
            startX: g.startX,
            startY: g.startY,
            startValue: g.startValue,
            startOppositeValue: g.startOppositeValue,
          },
          ev.clientX,
          ev.clientY,
          mods
        );
        // (4c-iii) Snap on commit too — canonical source value matches the
        // visible drag-end value.
        const cands = buildSpacingCandidates({
        kind: g.handle.spacingKind,
        recentValues: recentSpacingRef.current,
      });
        const snapped = snap(g.snapState, result.active, cands, {
          enabled: !mods.cmd,
          gridSize: DEFAULT_GRID_SIZE,
        });
        const finalActive = snapped.value;
        let finalOpposite = result.opposite;
        if (finalOpposite !== null && finalActive !== result.active) {
          finalOpposite = g.startOppositeValue + (finalActive - g.startValue);
          if (g.handle.spacingKind === "padding" && finalOpposite < 0) {
            finalOpposite = 0;
          }
        }
        const sides: {
          top?: string;
          right?: string;
          bottom?: string;
          left?: string;
        } = {};
        const activePx = Math.round(finalActive);
        sides[g.handle.side] = `${activePx}px`;
        if (finalOpposite !== null) {
          sides[oppositeSpacingSide(g.handle.side)] = `${Math.round(finalOpposite)}px`;
        }
        // Phase 2 acceptance #13 — multi-element commit when additionals
        // have resolved baselines AND the multi handler is wired.
        if (
          g.additionalStarts.size > 0 &&
          spacing.onSpacingMultiCommit
        ) {
          const delta = finalActive - g.startValue;
          const oppDelta =
            finalOpposite !== null
              ? finalOpposite - g.startOppositeValue
              : null;
          const ops: Array<{
            oid: string;
            kind: "padding" | "margin";
            sides: {
              top?: string;
              right?: string;
              bottom?: string;
              left?: string;
            };
          }> = [
            {
              oid: g.oid,
              kind: g.handle.spacingKind,
              sides,
            },
          ];
          g.additionalStarts.forEach((aSides, aoid) => {
            const aOpSides: typeof sides = {};
            let activeVal = aSides[g.handle.side] + delta;
            if (g.handle.spacingKind === "padding" && activeVal < 0) {
              activeVal = 0;
            }
            aOpSides[g.handle.side] = `${Math.round(activeVal)}px`;
            if (oppDelta !== null) {
              const oppSide = oppositeSpacingSide(g.handle.side);
              let oppVal = aSides[oppSide] + oppDelta;
              if (g.handle.spacingKind === "padding" && oppVal < 0) {
                oppVal = 0;
              }
              aOpSides[oppSide] = `${Math.round(oppVal)}px`;
            }
            ops.push({
              oid: aoid,
              kind: g.handle.spacingKind,
              sides: aOpSides,
            });
          });
          committed = spacing.onSpacingMultiCommit(ops);
        } else {
          committed = spacing.onSpacingCommit(g.oid, g.handle.spacingKind, sides);
        }
        // (eleventh-pass) Cache the committed value for future snaps.
        // Only pushes the active side's value — pushing the symmetric
        // opposite would double-record the same number, and Alt-symmetric
        // is a "what I want here" signal, not "two distinct values".
        if (committed) {
          pushRecent(recentSpacingRef, activePx);
          // Step 5 — arm Track B FLIP. Same pattern as resize. Spacing
          // commits typically produce a much smaller rect delta (the
          // element's outer-bbox width changes by `padding-delta`, not
          // the much larger `width-delta`), so most spacing commits
          // won't trigger an animation — but they should when the
          // canonical render produces drift, e.g. a flex parent
          // re-distributes space.
          const lastRect = lastRectRef.current;
          if (lastRect && spacing.requestFlip) {
            pendingFlipRef.current = {
              oid: g.oid,
              fromRect: {
                x: lastRect.x,
                y: lastRect.y,
                width: lastRect.width,
                height: lastRect.height,
              },
              expiresAt: Date.now() + 2000,
            };
          }
        }
      }
      teardown(!committed);
    }

    function onCancel() {
      teardown(true);
    }

    function onKeyDown(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        teardown(true);
        return;
      }
      // Alt toggles symmetric — re-fire applyMove so the opposite-side
      // write appears/disappears immediately without waiting for the next
      // mouse move. Shift / Cmd are no-ops in v1 but we still want the
      // gesture to react to Alt being released mid-drag.
      if (ev.key === "Alt") {
        const g = gestureRef.current;
        if (!g || g.kind !== "spacing") return;
        applyMove(g.lastClientX, g.lastClientY, readModifiers(ev));
      }
    }

    function onKeyUp(ev: KeyboardEvent) {
      if (ev.key === "Alt") {
        const g = gestureRef.current;
        if (!g || g.kind !== "spacing") return;
        // On Alt-release the opposite-side write needs to disappear from the
        // live stylesheet. The iframe's `dropinSetLiveStyle` is REPLACE-not-
        // merge per call (lib/preview.ts), so applyMove emits an active-only
        // declarations object and the iframe drops the opposite-side rule
        // automatically — no clearLiveStyle + re-paint dance needed
        // (which would flash the element for a frame).
        applyMove(g.lastClientX, g.lastClientY, readModifiers(ev));
      }
    }

    function onVisChange() {
      if (document.visibilityState === "hidden") teardown(true);
    }

    function teardown(clearLive: boolean) {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("lostpointercapture", onCancel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onCancel);
      document.removeEventListener("visibilitychange", onVisChange);
      const g = gestureRef.current;
      gestureRef.current = null;
      teardownRef.current = null;
      // (4c-iii) Clear active snap chip + guide lines.
      setActiveSnaps({ w: null, h: null, spacing: null });
      if (spacing) {
        spacing.setIframePointerEventsDisabled(false);
        if (clearLive && g && g.kind === "spacing") {
          spacing.clearLiveStyle(g.oid);
          // Phase 2 acceptance #13 — clear additionals' live rules too.
          g.additionalStarts.forEach((_, aoid) => {
            spacing.clearLiveStyle(aoid);
          });
        }
      }
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("lostpointercapture", onCancel);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onCancel);
    document.addEventListener("visibilitychange", onVisChange);
    teardownRef.current = () => teardown(true);
  }

  // Phase 3 — move (reorder + reparent) pointerdown handler. Position
  // handle drag → drop-target hit-testing → reorder/reparent commit on
  // release. Mirrors the spacing/resize handler pattern: pointerdown
  // sets up state + listeners, pointermove updates the live visual,
  // pointerup commits or bails.
  function handleMovePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!selectedOid || !rect || !move) return;
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // setPointerCapture can throw if the pointer isn't currently active —
      // proceed anyway.
    }

    pendingFlipRef.current = null;
    setSoftConstraints(null);

    move.setIframePointerEventsDisabled(true);

    const additionalsAtStart = additionalOids.slice();

    const localG: MoveGestureState = {
      kind: "move",
      oid: selectedOid,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
      elementBounds: rect,
      dropTargets: null,
      ineligibleTargets: null,
      oldParentOid: null,
      currentTarget: null,
      currentIneligible: null,
      additionalOids: additionalsAtStart,
    };
    gestureRef.current = localG;
    setMoveActive(true);

    // Fire drop-targets fetch. Identity check on resolution to drop stale
    // results from a canceled gesture. Walker returns BOTH eligible and
    // ineligible lists; we cache both so the per-frame hit-test can fall
    // through to red feedback when cursor misses every eligible target.
    // Multi-element selections pass every participant so the iframe
    // walker filters the entire moving set out of candidates (and any
    // descendant of any moving element gets red-feedback as 'descendant').
    const moveExclude = [localG.oid, ...additionalsAtStart];
    move.requestDropTargets(moveExclude).then(
      (result) => {
        if (gestureRef.current !== localG) return;
        if (result) {
          localG.dropTargets = result.targets;
          localG.ineligibleTargets = result.ineligible;
        } else {
          localG.dropTargets = [];
          localG.ineligibleTargets = [];
        }
      },
      () => {
        if (gestureRef.current !== localG) return;
        localG.dropTargets = [];
        localG.ineligibleTargets = [];
      }
    );

    // Fire layout-context fetch for the moved element's CURRENT parent OID.
    // Until this resolves, every drop is treated as reparent (even when
    // the user is dropping back into the same parent — applyReparent will
    // bail with newParent === oldParent and the gesture path will then
    // try the reorder route as a fallback).
    if (move.requestLayoutContext) {
      move.requestLayoutContext(localG.oid).then(
        (ctx) => {
          if (gestureRef.current !== localG || !ctx) return;
          localG.oldParentOid = ctx.parent?.oid ?? null;
        },
        () => {}
      );
    }

    function hostToIframeCoords(clientX: number, clientY: number): {
      x: number;
      y: number;
    } | null {
      const wrap = wrapperRef.current;
      if (!wrap) return null;
      const wrapBox = wrap.getBoundingClientRect();
      return { x: clientX - wrapBox.left, y: clientY - wrapBox.top };
    }

    function rectContains(b: Bounds, x: number, y: number): boolean {
      return (
        x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
      );
    }

    function rectArea(b: Bounds): number {
      return b.width * b.height;
    }

    // Hit-test cursor against drop targets. Picks the SMALLEST area
    // target that contains the cursor (innermost wins) — so a cursor
    // over a card inside a section picks the card, not the section.
    // Returns null when cursor is outside every target.
    function hitTest(
      targets: DropTarget[],
      ix: number,
      iy: number
    ): DropTarget | null {
      let best: DropTarget | null = null;
      let bestArea = Infinity;
      for (const t of targets) {
        if (!rectContains(t.bounds, ix, iy)) continue;
        const area = rectArea(t.bounds);
        if (area < bestArea) {
          best = t;
          bestArea = area;
        }
      }
      return best;
    }

    // Same innermost-by-area policy for ineligible candidates. Called
    // only when the eligible hit-test misses (eligible always wins on
    // cursor priority). Returns null when cursor is outside every
    // ineligible too — at that point the gesture renders no feedback
    // and a release would just snap the element back.
    function hitTestIneligible(
      candidates: IneligibleDropTarget[],
      ix: number,
      iy: number
    ): IneligibleDropTarget | null {
      let best: IneligibleDropTarget | null = null;
      let bestArea = Infinity;
      for (const c of candidates) {
        if (!rectContains(c.bounds, ix, iy)) continue;
        const area = rectArea(c.bounds);
        if (area < bestArea) {
          best = c;
          bestArea = area;
        }
      }
      return best;
    }

    // Resolve insertion index within a target's children based on cursor.
    // For row direction: compare cursor.x against each child's mid.x.
    // For column / block direction: compare cursor.y against mid.y.
    // For grid: nearest child by Euclidean distance, then "before/after"
    // by which half of that child's bbox the cursor falls in.
    function resolveInsertIndex(
      target: DropTarget,
      ix: number,
      iy: number
    ): number {
      const kids = target.children;
      if (kids.length === 0) return 0;
      if (target.direction === "row") {
        for (let i = 0; i < kids.length; i++) {
          const mid = kids[i]!.bounds.x + kids[i]!.bounds.width / 2;
          if (ix < mid) return i;
        }
        return kids.length;
      }
      if (target.direction === "column" || target.direction === "block") {
        for (let i = 0; i < kids.length; i++) {
          const mid = kids[i]!.bounds.y + kids[i]!.bounds.height / 2;
          if (iy < mid) return i;
        }
        return kids.length;
      }
      // grid
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < kids.length; i++) {
        const cx = kids[i]!.bounds.x + kids[i]!.bounds.width / 2;
        const cy = kids[i]!.bounds.y + kids[i]!.bounds.height / 2;
        const d = (ix - cx) * (ix - cx) + (iy - cy) * (iy - cy);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      // Round up if cursor is past midpoint of the nearest child.
      const nearest = kids[bestIdx]!.bounds;
      const midX = nearest.x + nearest.width / 2;
      const past = ix > midX;
      return past ? bestIdx + 1 : bestIdx;
    }

    function onMove(ev: PointerEvent) {
      if (gestureRef.current !== localG) return;
      if (ev.pointerId !== localG.pointerId) return;
      localG.lastClientX = ev.clientX;
      localG.lastClientY = ev.clientY;

      const dx = ev.clientX - localG.startX;
      const dy = ev.clientY - localG.startY;

      // Track A — visual translate of the moved element via setLiveStyle.
      // We use `transform: translate(dx, dy)` plus a subtle elevation
      // shadow + opacity so the element reads as "lifted." Pointer-events:
      // none keeps the original from intercepting cursor while dragging.
      // For multi-element gestures, every participant gets the SAME
      // delta (matches multi-resize / multi-spacing — additionals follow
      // the primary). Each setLiveStyle is its own postMessage; the
      // iframe live stylesheet keys on [data-dropin-id="..."] so all
      // rules coexist.
      const liveDecl: Record<string, string> = {
        transform: `translate(${Math.round(dx)}px, ${Math.round(dy)}px)`,
        opacity: "0.85",
        "box-shadow": "0 8px 24px rgba(0,0,0,0.20)",
        "pointer-events": "none",
        "z-index": "9999",
      };
      move!.setLiveStyle(localG.oid, liveDecl);
      for (const aoid of localG.additionalOids) {
        move!.setLiveStyle(aoid, liveDecl);
      }

      // Hit-test cursor in iframe-viewport coords.
      const iframeCoords = hostToIframeCoords(ev.clientX, ev.clientY);
      if (!iframeCoords || !localG.dropTargets) {
        // No targets resolved yet, or wrapper missing. Just paint the
        // translate; defer hit-testing to the next frame.
        return;
      }
      const target = hitTest(
        localG.dropTargets,
        iframeCoords.x,
        iframeCoords.y
      );
      if (target) {
        // Eligible hit — promote to currentTarget, clear any active
        // ineligible feedback (eligible always wins).
        const insertIndex = resolveInsertIndex(
          target,
          iframeCoords.x,
          iframeCoords.y
        );
        const prev = localG.currentTarget;
        if (
          !prev ||
          prev.target.oid !== target.oid ||
          prev.insertIndex !== insertIndex
        ) {
          localG.currentTarget = { target, insertIndex };
          setMoveTargetSnapshot({ targetOid: target.oid, insertIndex, target });
        }
        if (localG.currentIneligible !== null) {
          localG.currentIneligible = null;
          setMoveIneligibleSnapshot(null);
        }
        return;
      }
      // No eligible hit — clear any prior eligible state, then check
      // ineligible candidates so the user gets red feedback over an
      // <img> / <input> / descendant of the moved element.
      if (localG.currentTarget !== null) {
        localG.currentTarget = null;
        setMoveTargetSnapshot(null);
      }
      const ineligible =
        localG.ineligibleTargets &&
        hitTestIneligible(
          localG.ineligibleTargets,
          iframeCoords.x,
          iframeCoords.y
        );
      if (ineligible) {
        const prev = localG.currentIneligible;
        if (!prev || prev.oid !== ineligible.oid) {
          localG.currentIneligible = ineligible;
          setMoveIneligibleSnapshot(ineligible);
        }
      } else if (localG.currentIneligible !== null) {
        localG.currentIneligible = null;
        setMoveIneligibleSnapshot(null);
      }
    }

    function onUp(ev: PointerEvent) {
      if (gestureRef.current !== localG) return;
      if (ev.pointerId !== localG.pointerId) return;

      const ct = localG.currentTarget;
      let committed = false;
      if (ct && move) {
        const sameParent =
          localG.oldParentOid !== null &&
          ct.target.oid === localG.oldParentOid;
        // Multi vs single decision: when additionalOids is populated
        // AND the binding wired the multi callbacks, the gesture
        // commits the entire moving set in one batch. Otherwise it
        // falls back to single-element commit on the primary only.
        const isMulti = localG.additionalOids.length > 0;
        const altHeld = ev.altKey;
        // Order ops by source position. v1 approximation: preserve the
        // selection order (primary first, then additionals in their
        // selection order). The applyReorder/applyReparent engines walk
        // a running source so their AST-based lookup tolerates
        // out-of-source-order ops, but landing them adjacent at the
        // destination requires a stable sort by the original DOM order
        // — which we don't have host-side without another fetch. v1
        // accepts the tradeoff: drag a heterogeneous selection and the
        // elements still all reparent, just possibly in selection order
        // rather than original-source order. Acceptable since multi-
        // select itself is selection-order keyed.
        const movingOids: string[] = [localG.oid, ...localG.additionalOids];
        if (sameParent) {
          // Reorder. Translate the gesture's insertIndex (which counts
          // ALL DOM children) into the realChildren index applyReorder
          // expects — but since the iframe walker filters out the moved
          // element from `children` and the AST walker filters JSXText,
          // the indices align in practice. v1 ships this assumption;
          // edge cases (mixed JSXText) bail at the engine level.
          if (isMulti && move.onReorderMultiCommit) {
            // Multi-element reorder. Each successive op shifts the
            // insertion point by one so the moving group lands adjacent
            // at the destination. From-index adjustment per op handles
            // forward-move-within-parent correctly: the engine sees the
            // source after prior removes, so toIndex lines up.
            const ops: Array<{
              oid: string;
              parentOid: string;
              toIndex: number;
            }> = [];
            let target = ct.insertIndex;
            for (const moid of movingOids) {
              const fromIdx = ct.target.children.findIndex(
                (c) => c.oid === moid
              );
              let to = target;
              if (fromIdx !== -1 && fromIdx < to) to -= 1;
              if (fromIdx === -1 || fromIdx !== to) {
                ops.push({ oid: moid, parentOid: ct.target.oid, toIndex: to });
              }
              target += 1;
            }
            if (ops.length > 0) {
              committed = move.onReorderMultiCommit(ops);
            }
          } else {
            const fromIndex = ct.target.children.findIndex(
              (c) => c.oid === localG.oid
            );
            // Adjust insertIndex when we're moving forward within the same
            // parent: removing the source first shifts subsequent indices
            // down by one. The bench's "from idx 1 → idx 2" test would
            // produce toIndex=2 here — the engine sees 2 with the source
            // already extracted, which lands at the correct slot.
            let toIndex = ct.insertIndex;
            if (fromIndex !== -1 && fromIndex < toIndex) {
              toIndex -= 1;
            }
            if (fromIndex !== toIndex) {
              committed = move.onReorderCommit(
                localG.oid,
                ct.target.oid,
                toIndex
              );
            }
          }
        } else {
          // Reparent. Determine prop cleanup based on direction change.
          // If old parent was flex and new parent isn't, drop flex-only
          // props (`flexBasis`, `flexGrow`, `flexShrink`). Conservative:
          // we don't have the old parent's direction without another
          // requestLayoutContext; v1 always strips flex props on reparent
          // (stale flex props on a non-flex parent are inert anyway, so
          // the worst case is "user moved to another flex parent and
          // their flexBasis was dropped" — they can re-set via the
          // Properties Panel).
          //
          // Alt-keep-all-props modifier (`phase2-manipulation.md` line
          // 559): when the user releases the drop with Alt held, skip
          // the strip pass entirely. Useful when intentionally moving a
          // flex child to a block parent and wanting to keep `flex-basis`
          // for round-trip back to flex (or because the user knows it's
          // inert and prefers source stability over auto-cleanup).
          const propsToRemove =
            altHeld ||
            ct.target.direction === "row" ||
            ct.target.direction === "column"
              ? []
              : ["flexBasis", "flexGrow", "flexShrink"];
          if (isMulti && move.onReparentMultiCommit) {
            // Multi-element reparent. Insertion index increments per op
            // so the moving group lands adjacent at the destination in
            // selection order. propsToRemove applies to every op
            // identically — destination's direction governs the strip
            // for the entire batch.
            const ops: Array<{
              oid: string;
              newParentOid: string;
              insertIndex: number;
              propsToRemove?: string[];
            }> = [];
            let insertAt = ct.insertIndex;
            for (const moid of movingOids) {
              ops.push({
                oid: moid,
                newParentOid: ct.target.oid,
                insertIndex: insertAt,
                propsToRemove,
              });
              insertAt += 1;
            }
            committed = move.onReparentMultiCommit(ops, ct.target.tag);
          } else {
            committed = move.onReparentCommit(
              localG.oid,
              ct.target.oid,
              ct.insertIndex,
              propsToRemove,
              ct.target.tag
            );
            // Engine bails when newParent === oldParent (race:
            // layout-context hadn't resolved at gesture-end so we
            // treated same-parent drop as reparent). Fall back to
            // reorder.
            if (
              !committed &&
              localG.oldParentOid === null &&
              ct.target.oid
            ) {
              const fromIndex = ct.target.children.findIndex(
                (c) => c.oid === localG.oid
              );
              if (fromIndex !== -1) {
                let toIndex = ct.insertIndex;
                if (fromIndex < toIndex) toIndex -= 1;
                if (fromIndex !== toIndex) {
                  committed = move.onReorderCommit(
                    localG.oid,
                    ct.target.oid,
                    toIndex
                  );
                }
              }
            }
          }
        }
      }
      // On bail / no-target / no-op: clear the live stylesheet so the
      // element (and any multi-select participants) snap back to origin.
      if (!committed) {
        move?.clearLiveStyle(localG.oid);
        for (const aoid of localG.additionalOids) {
          move?.clearLiveStyle(aoid);
        }
      } else {
        // Step 5 — arm Track B FLIP from the user's last optimistic
        // rect (the rect with the live `transform: translate(...)`
        // applied). When the iframe rebuild lands and the canonical
        // post-move rect differs by > 1 px on any side, the bbox
        // watcher fires `requestFlip` to animate smoothly from
        // canonical back to optimistic and forward to identity over
        // 150 ms ease-out. 2 s expiry guards an iframe that never
        // reloads. `lastRectRef.current` reflects the latest bbox
        // push for the moved element — at this point in the gesture
        // it's the live-translated rect (the bbox watcher saw the
        // setLiveStyle transform mutate the bounds).
        const lastRect = lastRectRef.current;
        if (lastRect && move?.requestFlip) {
          pendingFlipRef.current = {
            oid: localG.oid,
            fromRect: {
              x: lastRect.x,
              y: lastRect.y,
              width: lastRect.width,
              height: lastRect.height,
            },
            expiresAt: Date.now() + 2000,
          };
        }
      }
      // On commit: leave live painted; the iframe rebuild (~250 ms after
      // setCode) wipes it. Pending flip armed above smooths the
      // canonical-vs-optimistic transition.
      teardown(!committed);
    }

    function onCancel() {
      if (gestureRef.current !== localG) return;
      move?.clearLiveStyle(localG.oid);
      for (const aoid of localG.additionalOids) {
        move?.clearLiveStyle(aoid);
      }
      teardown(true);
    }

    function onKeyDown(ev: KeyboardEvent) {
      if (gestureRef.current !== localG) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        onCancel();
      }
    }

    function teardown(clearLive: boolean) {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("lostpointercapture", onCancel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onCancel);
      document.removeEventListener("visibilitychange", onVisChange);
      gestureRef.current = null;
      teardownRef.current = null;
      setMoveTargetSnapshot(null);
      setMoveIneligibleSnapshot(null);
      setMoveActive(false);
      if (move) {
        move.setIframePointerEventsDisabled(false);
        if (clearLive) {
          move.clearLiveStyle(localG.oid);
          for (const aoid of localG.additionalOids) {
            move.clearLiveStyle(aoid);
          }
        }
      }
    }

    function onVisChange() {
      if (document.visibilityState === "hidden") onCancel();
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("lostpointercapture", onCancel);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onCancel);
    document.addEventListener("visibilitychange", onVisChange);
    teardownRef.current = () => teardown(true);
  }

  if (!selectedOid || !rect) return null;

  const x = Math.round(rect.x);
  const y = Math.round(rect.y);
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);

  if (w === 0 && h === 0) return null;

  // Phase 2 acceptance #13 — multi-element label format. While a resize
  // gesture is active and additionalOids are participating, swap the
  // tag-and-dims label for the spec's "Width: +Δpx (N elements)" cue.
  // Choose the dominant axis by absolute delta. In static state (no
  // gesture), append " +Nmore" to the primary's label so users can
  // see at a glance how many extra elements are in the multi-select.
  // Falls back to the single-element label when additionals is empty.
  let labelText: string | null = tag ? `${tag} ${w}×${h}` : null;
  const totalSelected = additionalOids.length + 1;
  if (totalSelected > 1 && gestureRef.current === null && tag) {
    labelText = `${tag} ${w}×${h} +${additionalOids.length} more`;
  }
  if (
    totalSelected > 1 &&
    gestureRef.current?.kind === "resize"
  ) {
    const g = gestureRef.current;
    const dw = w - g.startW;
    const dh = h - g.startH;
    if (Math.abs(dw) >= Math.abs(dh) && dw !== 0) {
      const sign = dw >= 0 ? "+" : "−";
      labelText = `Width: ${sign}${Math.abs(dw)}px (${totalSelected} elements)`;
    } else if (dh !== 0) {
      const sign = dh >= 0 ? "+" : "−";
      labelText = `Height: ${sign}${Math.abs(dh)}px (${totalSelected} elements)`;
    } else {
      labelText = `${totalSelected} elements`;
    }
  } else if (
    totalSelected > 1 &&
    gestureRef.current?.kind === "spacing"
  ) {
    const g = gestureRef.current;
    if (g.contextReady) {
      // Compute dominant delta from the live stylesheet's last write.
      // We don't keep the snapped value in state, so derive from
      // current rect vs. start rect for an approximate delta.
      // Acceptable v1: the label refreshes once the rect settles.
      labelText = `${g.handle.spacingKind === "padding" ? "Padding" : "Margin"} (${totalSelected} elements)`;
    } else {
      labelText = `${totalSelected} elements`;
    }
  } else if (totalSelected > 1) {
    labelText = `${totalSelected} elements`;
  }

  // Step 7 — overflow indicator. When the soft-constraints query found
  // an overflow warning, swap the bbox outline from a coral solid line
  // to a red dashed one. The red dashed style is the spec's "Element
  // overflowing parent → red dashed indicator" cue (line 168). Suppressed
  // during gestures because the live stylesheet would make any overflow
  // judgement unreliable mid-drag — the warning chip + outline both
  // re-appear post-commit.
  const hasOverflowWarning =
    gestureRef.current === null &&
    softConstraints !== null &&
    softConstraints.some((warning) => warning.kind === "overflow");
  const outlineStyle = hasOverflowWarning
    ? "2px dashed #E63B2E"
    : "2px solid #FF4D2E";

  // (4c-iii) Decide what the chip should show. Snap takes precedence
  // over min-content constraint (snap is an active alignment, constraint
  // is a passive limit; in practice they're mutually exclusive because
  // snap candidates below min-content are filtered out by being out of
  // range). A spacing snap shows the spacing chip; a resize width/height
  // snap shows whichever axis is currently snapped (priority W > H when
  // both are snapped — arbitrary tie-break that usually picks the
  // dominant drag axis since width handles are more common).
  const snapChip: SnapCandidate | null =
    activeSnaps.spacing ?? activeSnaps.w ?? activeSnaps.h ?? null;
  const showSnapChip = snapChip !== null;
  const showConstraintChip =
    !showSnapChip &&
    constraintAxis !== null &&
    gestureRef.current?.kind === "resize" &&
    gestureRef.current.minContent !== null;

  // (4c-iii) Guide lines for sibling / parent / parent-content edge
  // snaps. The guide.position is in iframe-viewport coords; same
  // coordinate space as rect.x/rect.y. Lines render OUTSIDE the bbox
  // div so they can extend past the element's edges (e.g. a vertical
  // guide line connecting the element's right edge to a sibling's
  // right edge spans both rects' Y range). Common-value and grid
  // snaps don't carry a guide (no visible reference rect to align to)
  // — they surface via the chip only.
  const guides: SnapCandidate[] = [];
  if (activeSnaps.w?.guide) guides.push(activeSnaps.w);
  if (activeSnaps.h?.guide) guides.push(activeSnaps.h);

  // Wrapping div pattern (not React fragment): SWC's parser in some Next.js
  // 14 versions gets tripped by `<>` at the top of a parenthesized return
  // when the next token is `<div` indented at the same column ("Expression
  // expected" at the `>` of the fragment opener). Wrapping in an
  // `absolute inset-0` div sidesteps the issue cleanly — the wrapper fills
  // the parent's relative container so absolute-positioned children
  // (bbox + guide lines) keep the same iframe-viewport coord space, and
  // `pointer-events: none` on the wrapper preserves the iframe-pass-through
  // behaviour (handles still set their own `pointer-events: auto`).
  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0">
    {/* Phase 2 acceptance #13 — secondary outlines for additional
        members. Each gets a thin coral dashed outline (no handles, no
        chip) so users see what's in the multi-select set. The primary
        outline above stays solid coral with handles. Suppressed when
        the additional's bbox isn't currently subscribed (rare race). */}
    {additionalOids.map((aoid) => {
      const aRect = additionalRects.get(aoid);
      if (!aRect) return null;
      const aw = Math.round(aRect.width);
      const ah = Math.round(aRect.height);
      if (aw === 0 && ah === 0) return null;
      return (
        <div
          key={`add-${aoid}`}
          className="pointer-events-none absolute left-0 top-0"
          style={{
            transform: `translate3d(${Math.round(aRect.x)}px, ${Math.round(aRect.y)}px, 0)`,
            width: aw,
            height: ah,
            outline: "1px dashed #FF4D2E",
            outlineOffset: "1px",
            willChange: "transform",
            zIndex: 9,
          }}
          aria-hidden
        />
      );
    })}
    {/* Phase 3 polish (seventeenth pass) — duplicate / delete toolbar.
        Only renders when `actions` binding is wired AND no gesture is
        in progress (toolbar would just get in the way during resize /
        move). Positioned at the top-right of the primary bbox, lifted
        ~4 px so it doesn't overlap the bbox outline. Two square icon
        buttons; SVGs (no font dep) keep parity with the position
        handle's inline-SVG approach. */}
    {actions && showActionToolbar && gestureRef.current === null && (
      <div
        className="pointer-events-none absolute left-0 top-0"
        style={{
          transform: `translate3d(${Math.round(x + w - 56)}px, ${Math.round(y - 32)}px, 0)`,
          willChange: "transform",
          zIndex: 12,
          display: "flex",
          gap: 4,
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const oid = selectedOid;
            if (!oid) return;
            const all =
              additionalOids.length > 0 ? [oid, ...additionalOids] : null;
            if (all && actions.onDuplicateMulti) {
              actions.onDuplicateMulti(all);
            } else {
              actions.onDuplicate(oid);
            }
          }}
          aria-label="Duplicate element"
          title="Duplicate (Cmd+D)"
          style={{
            pointerEvents: "auto",
            width: 26,
            height: 26,
            border: "1px solid #0F0F0F",
            background: "#FAF6EC",
            color: "#0F0F0F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <rect
              x="6"
              y="6"
              width="7"
              height="7"
              fill="#FAF6EC"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const oid = selectedOid;
            if (!oid) return;
            const all =
              additionalOids.length > 0 ? [oid, ...additionalOids] : null;
            const ok =
              all && actions.onDeleteMulti
                ? actions.onDeleteMulti(all)
                : actions.onDelete(oid);
            if (ok) actions.onDeleteCompleted?.();
          }}
          aria-label="Delete element"
          title="Delete (⌫)"
          style={{
            pointerEvents: "auto",
            width: 26,
            height: 26,
            border: "1px solid #0F0F0F",
            background: "#FAF6EC",
            color: "#E63B2E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M3.5 4.5 H10.5 L10 12 H4 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 3.5 H11.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M5.5 3.5 V2.5 H8.5 V3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    )}
    <div
      className="pointer-events-none absolute left-0 top-0 z-10"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width: w,
        height: h,
        outline: outlineStyle,
        outlineOffset: "1px",
        willChange: "transform",
      }}
      aria-hidden
    >
      {showResizeHandles &&
        HANDLE_POSITIONS.map((hp) => (
          <div
            key={hp.key}
            onPointerDown={
              resize ? (e) => handleResizePointerDown(e, hp.key) : undefined
            }
            style={{
              position: "absolute",
              left: `${hp.fx * 100}%`,
              top: `${hp.fy * 100}%`,
              transform: "translate(-50%, -50%)",
              width: hitAreaFor(16, coarsePointer),
              height: hitAreaFor(16, coarsePointer),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: hp.cursor,
              // (4b) only enable hit-testing on handles when gesture bindings
              // are wired. (4a) leaves them at the wrapper's `none` so handle
              // marks render but iframe clicks under them still register.
              pointerEvents: resize ? "auto" : "none",
              // touch-action: none stops the browser from interpreting the
              // first move as a scroll/zoom gesture before our handler kicks
              // in. Required for trackpad + touchscreen.
              touchAction: resize ? "none" : undefined,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#FF4D2E",
                boxShadow: "0 0 0 1px #0F0F0F",
              }}
            />
          </div>
        ))}
      {/* Phase 3 — Position handle. Renders only when `move` binding
          is wired AND the active tool is Move (Phase 5 / Phase B
          gate). 22×22 visible disc with a 4-way arrow icon, accent
          color, centered on the element. 28×28 hit area for easier
          grabbing. During a move gesture, the handle dims to 0.4 so it
          doesn't compete visually with the cursor's drag preview. */}
      {move && showMoveHandle && (
        <div
          onPointerDown={handleMovePointerDown}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: hitAreaFor(28, coarsePointer),
            height: hitAreaFor(28, coarsePointer),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "move",
            pointerEvents: "auto",
            touchAction: "none",
            zIndex: 11,
            opacity: moveActive ? 0.4 : 1,
            transition: "opacity 100ms ease-out",
          }}
          aria-label="Move element"
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: "#FF4D2E",
              boxShadow: "0 0 0 2px #0F0F0F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 12,
              lineHeight: 1,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontWeight: 700,
              userSelect: "none",
            }}
          >
            {/* Compact 4-way arrow rendered as an inline SVG so the icon
                tracks color + size without a font dependency. */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              aria-hidden
              style={{ display: "block" }}
            >
              <path
                d="M7 1.5 L9 3.5 H7.6 V6.4 H10.5 V5 L12.5 7 L10.5 9 V7.6 H7.6 V10.5 H9 L7 12.5 L5 10.5 H6.4 V7.6 H3.5 V9 L1.5 7 L3.5 5 V6.4 H6.4 V3.5 H5 Z"
                fill="currentColor"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        </div>
      )}
      {/* (4d) Padding handles — dashed coral 6×6 inside the bbox edge.
          Rendered AFTER resize handles so the 4 px hit-area sliver
          (where padding hit area overlaps with resize-edge hit area)
          resolves to padding. (eleventh-pass) Cursor-proximity fade
          per `phase2-manipulation.md` Step 1 line 53: handles are
          invisible when the cursor is far away, fade to base opacity
          when within ~60 px of the bbox, and lift to 1 on hover. */}
      {spacing && showSpacingHandles &&
        HANDLE_POSITIONS_PADDING.map((sp) => (
          <SpacingHandleMark
            key={sp.key}
            spec={sp}
            color="#FF4D2E"
            cursorNear={handlesNear}
            coarse={coarsePointer}
            onPointerDown={(e) => handleSpacingPointerDown(e, sp)}
          />
        ))}
      {/* (4d) Margin handles — dashed gray 6×6 outside the bbox edge.
          The gray (vs coral) distinguishes them from padding at a
          glance; the dashed border distinguishes both spacing kinds
          from the solid resize handles. */}
      {spacing && showSpacingHandles &&
        HANDLE_POSITIONS_MARGIN.map((sp) => (
          <SpacingHandleMark
            key={sp.key}
            spec={sp}
            color="#8C847A"
            cursorNear={handlesNear}
            coarse={coarsePointer}
            onPointerDown={(e) => handleSpacingPointerDown(e, sp)}
          />
        ))}
      {labelText && (
        <div
          className="absolute left-0 top-0 inline-flex items-center whitespace-nowrap border-2 border-ink bg-coral px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.1em] text-paper"
          style={{ transform: "translate3d(0, calc(-100% - 1px), 0)" }}
        >
          {labelText}
        </div>
      )}
      {/* (4c-iii) Snap chip — wins over constraint chip when both apply.
          Background color tinted by snap kind: sibling=green, parent=
          blue, common=coral, grid=muted. Rest of the styling matches the
          constraint chip's slot below the bbox. */}
      {showSnapChip && snapChip && (
        <div
          className="absolute left-0 inline-flex items-center whitespace-nowrap border-2 border-ink px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.1em] text-paper"
          style={{
            top: "100%",
            transform: "translate3d(0, 1px, 0)",
            backgroundColor: snapColor(snapChip.kind),
          }}
        >
          {snapChip.label ?? `${snapChip.value}px`}
        </div>
      )}
      {/* (4c-i) Constraint chip — falls back when no snap is active.
          (Step 7 closes acceptance #7) Adds a "(text wrap)" qualifier
          when the element wraps text content directly so the user
          knows WHY the min-content bound is what it is. */}
      {showConstraintChip &&
        gestureRef.current?.kind === "resize" &&
        gestureRef.current.minContent && (
          <div
            className="absolute left-0 inline-flex items-center whitespace-nowrap border-2 border-ink bg-paper px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.1em] text-ink"
            style={{ top: "100%", transform: "translate3d(0, 1px, 0)" }}
          >
            {(() => {
              const mc = gestureRef.current.minContent;
              const qualifier = mc.hasTextChildren ? " (text wrap)" : "";
              if (constraintAxis === "width")
                return `Min: ${mc.minWidth}px${qualifier}`;
              if (constraintAxis === "height")
                return `Min: ${mc.minHeight}px${qualifier}`;
              return `Min: ${mc.minWidth}×${mc.minHeight}px${qualifier}`;
            })()}
          </div>
        )}
      {/* Step 7 — soft-constraint warning stack. Renders below the
          snap/constraint chip slot when no gesture is active and the
          host's last query produced warnings. Multiple warnings stack
          vertically. The overflow warning gets a stronger red; the
          others use amber. Snap and constraint chips take precedence
          (mutually exclusive in practice — those are gesture-time chips,
          warnings are settled-state chips). */}
      {gestureRef.current === null && softConstraints && softConstraints.length > 0 && (
        <div
          className="pointer-events-none absolute left-0 flex flex-col gap-[1px]"
          style={{ top: "100%", transform: "translate3d(0, 1px, 0)" }}
          aria-live="polite"
        >
          {softConstraints.map((warning) => (
            <div
              key={`${warning.kind}-${warning.axis ?? ""}`}
              className="inline-flex items-center whitespace-nowrap border-2 border-ink px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.1em] text-paper"
              style={{ backgroundColor: softConstraintColor(warning.kind) }}
            >
              <span className="font-bold">{softConstraintTitle(warning.kind)}</span>
              <span className="ml-1 normal-case">{warning.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
    {/* Phase 3 — Drop target outline. Rendered when a move gesture is
        active AND the cursor is over an eligible drop target. Outline
        is 2px solid green (#00B86B) on accept; the insertion indicator
        below shows the precise drop slot. Drawn outside the primary
        bbox div so it can sit anywhere on the page (the drop target is
        often a different parent in a different section). */}
    {moveActive && moveTargetSnapshot && (
      <>
        <div
          className="pointer-events-none absolute left-0 top-0 z-[6]"
          style={{
            transform: `translate3d(${Math.round(
              moveTargetSnapshot.target.bounds.x
            )}px, ${Math.round(moveTargetSnapshot.target.bounds.y)}px, 0)`,
            width: Math.round(moveTargetSnapshot.target.bounds.width),
            height: Math.round(moveTargetSnapshot.target.bounds.height),
            outline: "2px solid #00B86B",
            outlineOffset: "1px",
            backgroundColor: "rgba(0, 184, 107, 0.06)",
            willChange: "transform",
          }}
          aria-hidden
        />
        {/* Insertion indicator: 1 px line at the drop slot. Position
            depends on direction — between two children for row/column,
            spanning the full width above/below for block. */}
        {(() => {
          const t = moveTargetSnapshot.target;
          const idx = moveTargetSnapshot.insertIndex;
          const kids = t.children;
          // Compute a line { x, y, width, height } for the indicator.
          let line: {
            x: number;
            y: number;
            width: number;
            height: number;
          } | null = null;
          if (kids.length === 0) {
            // Empty target — show a horizontal line in the middle of contentBounds.
            const cb = t.contentBounds;
            line = {
              x: cb.x,
              y: cb.y + cb.height / 2,
              width: cb.width,
              height: 2,
            };
          } else if (t.direction === "row") {
            // Vertical line at the boundary between children.
            let xPos: number;
            if (idx === 0) xPos = kids[0]!.bounds.x - 2;
            else if (idx >= kids.length) {
              const last = kids[kids.length - 1]!;
              xPos = last.bounds.x + last.bounds.width;
            } else {
              const prev = kids[idx - 1]!.bounds;
              const next = kids[idx]!.bounds;
              xPos = (prev.x + prev.width + next.x) / 2 - 1;
            }
            line = {
              x: xPos,
              y: t.contentBounds.y,
              width: 2,
              height: t.contentBounds.height,
            };
          } else {
            // column / block / grid — horizontal line.
            let yPos: number;
            if (idx === 0) yPos = kids[0]!.bounds.y - 2;
            else if (idx >= kids.length) {
              const last = kids[kids.length - 1]!;
              yPos = last.bounds.y + last.bounds.height;
            } else {
              const prev = kids[idx - 1]!.bounds;
              const next = kids[idx]!.bounds;
              yPos = (prev.y + prev.height + next.y) / 2 - 1;
            }
            line = {
              x: t.contentBounds.x,
              y: yPos,
              width: t.contentBounds.width,
              height: 2,
            };
          }
          if (!line) return null;
          return (
            <div
              className="pointer-events-none absolute left-0 top-0 z-[7]"
              style={{
                transform: `translate3d(${Math.round(line.x)}px, ${Math.round(line.y)}px, 0)`,
                width: Math.round(line.width),
                height: Math.round(line.height),
                backgroundColor: "#00B86B",
                willChange: "transform",
              }}
              aria-hidden
            />
          );
        })()}
      </>
    )}
    {/* (Phase 3 polish) Drop-eligibility feedback. When the cursor is
        over a leaf-tag container (img/input/select/...) or a descendant
        of the moved element, paint a red outline + a small ink-on-paper
        tooltip explaining why the drop won't land. Mutually exclusive
        with the green eligible feedback above (the hit-test routes the
        cursor to one or the other, never both). Tooltip sits at the
        bottom-left of the bounds so it doesn't bury under the cursor. */}
    {moveActive && moveIneligibleSnapshot && !moveTargetSnapshot && (
      <>
        <div
          className="pointer-events-none absolute left-0 top-0 z-[6]"
          style={{
            transform: `translate3d(${Math.round(
              moveIneligibleSnapshot.bounds.x
            )}px, ${Math.round(moveIneligibleSnapshot.bounds.y)}px, 0)`,
            width: Math.round(moveIneligibleSnapshot.bounds.width),
            height: Math.round(moveIneligibleSnapshot.bounds.height),
            outline: "2px dashed #E63B2E",
            outlineOffset: "1px",
            backgroundColor: "rgba(230, 59, 46, 0.06)",
            willChange: "transform",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-0 top-0 z-[8] inline-flex items-center whitespace-nowrap border-2 border-ink bg-paper px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.1em] text-ink"
          style={{
            transform: `translate3d(${Math.round(
              moveIneligibleSnapshot.bounds.x
            )}px, ${Math.round(
              moveIneligibleSnapshot.bounds.y +
                moveIneligibleSnapshot.bounds.height +
                4
            )}px, 0)`,
            willChange: "transform",
          }}
          role="status"
          aria-live="polite"
        >
          <span
            style={{ backgroundColor: "#E63B2E", color: "#FAF9F6" }}
            className="-mx-1.5 -my-0.5 mr-1 px-1 py-0.5 font-bold"
          >
            ✕
          </span>
          {moveIneligibleSnapshot.reason === "leaf"
            ? `<${moveIneligibleSnapshot.tag}> can't have children`
            : `Can't drop into itself`}
        </div>
      </>
    )}
    {/* (4c-iii) Guide lines for sibling / parent edge snaps. Drawn
        outside the bbox div so they can extend past the element's edges,
        connecting it visually to the snapped reference rect. Each line
        is 1 px on its primary axis, color-coded by snap kind, with
        pointer-events: none so iframe events still pass through. */}
    {guides.map((c) => {
      const guide = c.guide!;
      const color = snapColor(c.kind);
      // Default perpendicular range falls back to the bbox's range if
      // the guide didn't carry one (defensive — buildResizeCandidates
      // always populates from/to today, but a future caller might not).
      const from = guide.from ?? (guide.axis === "x" ? y : x);
      const to = guide.to ?? (guide.axis === "x" ? y + h : x + w);
      const perpStart = Math.min(from, to);
      const perpLen = Math.max(1, Math.abs(to - from));
      if (guide.axis === "x") {
        // Vertical line at iframe-viewport x = guide.position.
        return (
          <div
            key={`guide-${candidateId(c)}`}
            className="pointer-events-none absolute z-[5]"
            style={{
              left: Math.round(guide.position),
              top: Math.round(perpStart),
              width: 1,
              height: Math.round(perpLen),
              backgroundColor: color,
              willChange: "transform",
            }}
            aria-hidden
          />
        );
      }
      // Horizontal line at iframe-viewport y = guide.position.
      return (
        <div
          key={`guide-${candidateId(c)}`}
          className="pointer-events-none absolute z-[5]"
          style={{
            left: Math.round(perpStart),
            top: Math.round(guide.position),
            width: Math.round(perpLen),
            height: 1,
            backgroundColor: color,
            willChange: "transform",
          }}
          aria-hidden
        />
      );
    })}
    </div>
  );
}

// (4d) Spacing handle visual. 16×16 hit area, 6×6 visible mark with
// dashed border. `color` distinguishes padding (coral) from margin (gray).
// Three-stage opacity ladder (eleventh-pass): cursor far away → 0
// (handles invisible, no workspace clutter), cursor within ~60 px of
// the bbox → 0.7 (subtle "I'm interactive" cue), pointer hovering the
// handle itself → 1 (full visibility for precise grab targeting). CSS
// `transition: opacity 100ms ease-out` smooths every crossing, so we
// can flip the underlying boolean states without staircase artifacts.
function SpacingHandleMark({
  spec,
  color,
  cursorNear,
  coarse,
  onPointerDown,
}: {
  spec: SpacingHandleSpec;
  color: string;
  cursorNear: boolean;
  coarse: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const [hover, setHover] = useState(false);
  // Coarse pointers can't hover, so we ignore `cursorNear` (which
  // depends on host pointermove tracking) and always render the
  // handles at base visibility. Touch users see the dashed marks at
  // 0.7 by default and grab via the expanded hit area.
  const opacity = coarse ? 0.7 : hover ? 1 : cursorNear ? 0.7 : 0;
  // When the handles are fully faded out (cursor far from the bbox),
  // disable hit-testing so a stray click in the area doesn't grab a
  // ghost handle. Re-enables the moment the cursor approaches and the
  // proximity flag flips. On coarse pointers, always interactive.
  const interactive = coarse || cursorNear || hover;
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      style={{
        position: "absolute",
        left: `${spec.fx * 100}%`,
        top: `${spec.fy * 100}%`,
        transform: `translate(calc(-50% + ${spec.offsetX}px), calc(-50% + ${spec.offsetY}px))`,
        width: hitAreaFor(16, coarse),
        height: hitAreaFor(16, coarse),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: spec.cursor,
        pointerEvents: interactive ? "auto" : "none",
        touchAction: "none",
        opacity,
        transition: "opacity 100ms ease-out",
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          border: `1.5px dashed ${color}`,
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
