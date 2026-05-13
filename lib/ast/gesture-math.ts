// Phase 2 (4b + 4c-i + 4c-ii) gesture math. Pure functions extracted from
// `components/SelectionOverlay.tsx` so the cursor→dimensions math is
// node-testable (`scripts/bench-gesture.mjs`) and the React component stays
// focused on lifecycle + DOM events.
//
// (4b) baseline: per-handle dx/dy mapping, edges single-axis, corners both,
// negative dims clamped at zero.
// (4c-i) min-content elastic resistance: `applyElasticDim` rubberbands a
// desired dim that's below the bound, returning `min - (min-desired)*0.15`.
// Coefficient matches tldraw / @use-gesture / iOS scrollViews.
// (4c-ii) modifier-key support:
//   - Alt held: cursor delta is mirrored on the opposite edge → effective
//     delta is doubled. For corners both axes double; for edges only the
//     parallel axis doubles. Same effect as "resize from center" for
//     absolutely-positioned elements; for in-flow elements the resize is
//     still anchored by the layout (we don't touch position) but the
//     dimensions grow / shrink twice as fast as the cursor moves —
//     accepted v1 trade-off (a true center-anchor would require an
//     `AdjustPosition` operation engine, deferred to (4c+)).
//   - Shift held: aspect ratio is locked. For corner drags the dominant
//     axis (the one the user moved more in raw px) drives, the other is
//     derived from the start-aspect. For edge drags the lone moving axis
//     drives, the perpendicular axis is derived. Skipped if start aspect
//     is null (degenerate startW or startH = 0).
//   - Order: Alt mirror first (extends the raw delta), then Shift lock
//     (couples the axes). Both can be active simultaneously.
//
// What this module does NOT do: it doesn't talk to the iframe, doesn't read
// React state, doesn't mutate any ref. Caller does all of that.

import type { DragModifiers, SizeHandle } from "./intent-resolver";

export interface ComputeDimsInput {
  handle: SizeHandle;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  // Aspect ratio (`startW / startH`) captured at pointerdown. Stays
  // constant for the lifetime of the gesture even if the visible dims
  // are mutated by the live stylesheet — the user's "preserve THIS
  // aspect" intent locks at gesture-start. `null` when start dims are
  // zero (degenerate aspect — Shift no-ops).
  aspect: number | null;
}

export interface ComputeDimsResult {
  // `null` for an axis the handle doesn't touch. Edge midpoints emit
  // single-axis deltas; corners emit both. With Shift held, edge handles
  // also emit BOTH axes (the perpendicular is derived from aspect) — so
  // the `null` shape is a (4b) baseline that (4c-ii) softens.
  w: number | null;
  h: number | null;
}

// iOS-style rubberband coefficient. tldraw / @use-gesture / Apple
// scrollViews all converge on ~0.15. Below this the constraint feels
// rigid; above it the user can drag through the bound too easily and
// the visual snap-back at pointerup feels jarring.
export const ELASTIC_COEFFICIENT = 0.15;

// (4c-i) Apply rubberband resistance to a desired dimension if it's below
// the bound. Above the bound this is a no-op. Returns the desired value
// dampened toward the bound — the further past, the more resistance.
export function applyElasticDim(desired: number, min: number): number {
  if (desired >= min) return desired;
  const overshoot = min - desired;
  return min - overshoot * ELASTIC_COEFFICIENT;
}

export function isCornerHandle(handle: SizeHandle): boolean {
  return (
    handle === "tl" ||
    handle === "tr" ||
    handle === "bl" ||
    handle === "br"
  );
}

// Returns the axes that a given handle resizes. Re-exported here (and
// resizeAxesFor lives in intent-resolver) so consumers that only need the
// gesture-math view don't have to import from intent-resolver. Identical
// behavior; if these ever diverge that's a bug.
export function handleAxes(handle: SizeHandle): {
  width: boolean;
  height: boolean;
} {
  if (handle === "l" || handle === "r") return { width: true, height: false };
  if (handle === "t" || handle === "b") return { width: false, height: true };
  return { width: true, height: true };
}

// Phase 2 (4b + 4c-ii) gesture math entry point. Given a started gesture
// and the current cursor position + modifier state, returns the dims to
// emit through the live stylesheet. Caller layers (4c-i) elastic on top
// (per-axis check + applyElasticDim) — that part lives in the consumer
// because it depends on the gesture's async-loaded `minContent` and on
// React state for the constraint chip.
export function computeDims(
  input: ComputeDimsInput,
  clientX: number,
  clientY: number,
  modifiers: DragModifiers
): ComputeDimsResult {
  const { handle, startX, startY, startW, startH, aspect } = input;
  const dx = clientX - startX;
  const dy = clientY - startY;
  // (4c-ii) Alt mirror. With center-anchor semantics, every pixel the
  // cursor moves outward grows the element by 2 px (1 on the cursor
  // side, 1 on the opposite). For an in-flow element we can't actually
  // shift the opposite edge — but the dimension grows by 2*delta either
  // way, which is the right source-rewrite even if the visual anchor
  // doesn't perfectly match the cursor. Documented limitation.
  const mul = modifiers.alt ? 2 : 1;
  let w: number | null = null;
  let h: number | null = null;
  switch (handle) {
    case "tl":
      w = startW - dx * mul;
      h = startH - dy * mul;
      break;
    case "tr":
      w = startW + dx * mul;
      h = startH - dy * mul;
      break;
    case "bl":
      w = startW - dx * mul;
      h = startH + dy * mul;
      break;
    case "br":
      w = startW + dx * mul;
      h = startH + dy * mul;
      break;
    case "t":
      h = startH - dy * mul;
      break;
    case "r":
      w = startW + dx * mul;
      break;
    case "b":
      h = startH + dy * mul;
      break;
    case "l":
      w = startW - dx * mul;
      break;
  }
  // Negative dims clamp at 0. Both v1 width: 0px and height: 0px are
  // valid CSS — the element collapses but doesn't crash. The (4c-i)
  // elastic constraint kicks in above this for elements that have
  // measurable min-content; for elements with no intrinsic minimum
  // (a bare `<div></div>`), this 0-clamp is the bound.
  if (w !== null) w = Math.max(0, w);
  if (h !== null) h = Math.max(0, h);
  // (4c-ii) Shift-locked aspect ratio. Three cases:
  //   - Corner + both axes set → pick the dominant axis (larger raw
  //     delta) and derive the other from start-aspect.
  //   - Horizontal edge (l/r) + width set → derive height from aspect.
  //   - Vertical edge (t/b) + height set → derive width from aspect.
  // Skipped when aspect is null (degenerate start dims) — Shift no-ops
  // gracefully rather than producing NaN dims.
  if (modifiers.shift && aspect !== null) {
    if (isCornerHandle(handle) && w !== null && h !== null) {
      const dw = Math.abs(w - startW);
      const dh = Math.abs(h - startH);
      if (dw >= dh) {
        h = w / aspect;
      } else {
        w = h * aspect;
      }
    } else if ((handle === "r" || handle === "l") && w !== null) {
      h = w / aspect;
    } else if ((handle === "t" || handle === "b") && h !== null) {
      w = h * aspect;
    }
    // Re-clamp after derivation — the divide could produce a tiny
    // negative if start dims were zero (and aspect happened to be
    // non-null somehow), or if the user dragged far enough past zero
    // that the derived dim went negative.
    if (w !== null && w < 0) w = 0;
    if (h !== null && h < 0) h = 0;
  }
  return {
    w: w !== null ? Math.round(w) : null,
    h: h !== null ? Math.round(h) : null,
  };
}

// Capture the start aspect for a gesture. Returns null when either
// dimension is zero (degenerate aspect — Shift will no-op). Caller
// stores this on the gesture state once at pointerdown; we don't
// recompute mid-gesture because the user's "preserve THIS aspect"
// intent is captured at the moment of grabbing the handle.
export function captureAspect(startW: number, startH: number): number | null {
  if (startW <= 0 || startH <= 0) return null;
  return startW / startH;
}

// Phase 2 (4d) spacing gesture math. Single-axis: top/bottom handles read
// dy, left/right handles read dx. `signMul` flips the sign so "drag in the
// natural increase direction" maps to positive value-delta:
//   - Padding (inside edge): drag toward element center increases value.
//     `pt` axis="y" signMul=+1 (drag down = +dy = increase top).
//     `pb` axis="y" signMul=-1 (drag up = -dy = increase bottom).
//     `pl` axis="x" signMul=+1 (drag right = +dx = increase left).
//     `pr` axis="x" signMul=-1 (drag left = -dx = increase right).
//   - Margin (outside edge): drag away from element increases value.
//     `mt` axis="y" signMul=-1 (drag up = -dy = increase top).
//     `mb` axis="y" signMul=+1 (drag down = +dy = increase bottom).
//     `ml` axis="x" signMul=-1 (drag left = -dx = increase left).
//     `mr` axis="x" signMul=+1 (drag right = +dx = increase right).
//
// `kind` drives the clamp: padding can't go negative (CSS treats it as 0
// anyway), margin allows any value (negative margin = overlap, valid CSS).
//
// Alt held: `opposite` is set to the matching delta applied to the
// `startOppositeValue`. Caller writes both sides to the live stylesheet.
// Without Alt, `opposite` is null — caller writes only the active side.
//
// Shift/Cmd: not consumed by spacing v1. Shift could later mean "all 4
// sides" (Figma-style); for now it's a no-op so the user discovers the
// behaviour via the inspector / properties panel instead.
export interface ComputeSpacingInput {
  axis: "x" | "y";
  signMul: 1 | -1;
  kind: "padding" | "margin";
  startX: number;
  startY: number;
  // Active side's resolved px value at gesture-start. Captured from
  // `LayoutContext.padding` / `LayoutContext.margin` after the iframe
  // resolves the layout query. Until that lands, caller suppresses
  // pointermove writes — see SelectionOverlay's `contextReady` gate.
  startValue: number;
  // Opposite side's resolved px value at gesture-start. Used when Alt
  // is held: the active delta is added to BOTH sides' starts.
  startOppositeValue: number;
}

export interface ComputeSpacingResult {
  active: number;
  opposite: number | null;
}

export function computeSpacing(
  input: ComputeSpacingInput,
  clientX: number,
  clientY: number,
  modifiers: DragModifiers
): ComputeSpacingResult {
  const dx = clientX - input.startX;
  const dy = clientY - input.startY;
  const cursorDelta = input.axis === "x" ? dx : dy;
  const valueDelta = cursorDelta * input.signMul;
  let active = input.startValue + valueDelta;
  let opposite: number | null = null;
  if (modifiers.alt) {
    opposite = input.startOppositeValue + valueDelta;
  }
  if (input.kind === "padding") {
    if (active < 0) active = 0;
    if (opposite !== null && opposite < 0) opposite = 0;
  }
  return {
    active: Math.round(active),
    opposite: opposite !== null ? Math.round(opposite) : null,
  };
}
