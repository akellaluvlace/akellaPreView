// Phase 2 Step 5 — Track B drift detection (`phase2-manipulation.md` line
// 124-130). Pure function. Compares the optimistic Track A rect (the one
// the user last saw painted by the live stylesheet) against the canonical
// Track B rect (what the source rewrite actually produced after iframe
// rebuild). Returns the (dx, dy, sx, sy) tuple needed to FLIP-animate
// the element from `last` (canonical) back to `from` (optimistic) and
// then to identity, or `null` when the drift is below the threshold and
// no animation is warranted.
//
// Threshold rationale (per spec line 128 "> ~1 px on any side"): we
// compare ALL FOUR sides — left (x), top (y), right (x+width), bottom
// (y+height) — and trigger only when at least one side differs by more
// than `FLIP_THRESHOLD_PX`. This catches both pure translations (the
// element moved) and pure scale changes (an edge moved while another
// stayed put). Avoids the percentage-scale alternative because that
// hides 1 px drift on small elements (1 px on a 50 px element is 2%
// scale but visually still just 1 px of motion).
//
// Coordinate system: both rects are iframe-VIEWPORT coords from
// `getBoundingClientRect()` inside the iframe. The host receives them via
// `dropin:bbox` postMessage. Same origin both sides — no translation
// needed.
//
// FLIP basics: First-Last-Invert-Play. We're given First (`from`, where
// the element was) and Last (`last`, where it ended up). The Inverse
// transform that places Last at First is `translate(dx, dy) scale(sx,
// sy)` with `transform-origin: top left` and:
//   dx = from.x - last.x          (translate Last's left → First's left)
//   dy = from.y - last.y          (translate Last's top → First's top)
//   sx = from.width / last.width  (scale Last's width up/down to First's)
//   sy = from.height / last.height
// Iframe applies that, forces a reflow, then transitions transform → none
// over 150 ms ease-out → element animates back from First to Last.

export interface RectLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FlipDeltas {
  dx: number;
  dy: number;
  sx: number;
  sy: number;
}

export const FLIP_THRESHOLD_PX = 1;

export function detectDrift(
  from: RectLike,
  last: RectLike
): FlipDeltas | null {
  // Vanished canonical: element rendered at zero size. FLIP can't animate
  // a 0×0 box (sx/sy would be undefined or infinite), and visually the
  // element isn't there to be animated anyway. Caller treats null as
  // "no animation needed" — the rebuild whiteout absorbs the disappearance.
  if (last.width <= 0 || last.height <= 0) return null;

  const dxLeft = from.x - last.x;
  const dyTop = from.y - last.y;
  const dxRight = from.x + from.width - (last.x + last.width);
  const dyBottom = from.y + from.height - (last.y + last.height);

  const stable =
    Math.abs(dxLeft) <= FLIP_THRESHOLD_PX &&
    Math.abs(dyTop) <= FLIP_THRESHOLD_PX &&
    Math.abs(dxRight) <= FLIP_THRESHOLD_PX &&
    Math.abs(dyBottom) <= FLIP_THRESHOLD_PX;

  if (stable) return null;

  return {
    dx: dxLeft,
    dy: dyTop,
    sx: from.width / last.width,
    sy: from.height / last.height,
  };
}
