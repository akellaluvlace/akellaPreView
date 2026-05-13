// Phase 2 (4c-iii) Snap system. Pure module — no DOM, no React, no
// postMessage. Caller (the gesture handler in `components/SelectionOverlay
// .tsx`) feeds in a desired numeric value (a width, height, or spacing
// value in px) and a list of candidates; this module returns the snapped
// value and the active candidate (for guide rendering / chip display).
//
// Architecture reference: tldraw's `SnapManager` (`packages/editor/src/lib/
// editor/managers/SnapManager`) — split into BoundsSnaps + HandleSnaps. We
// don't separate them because at our problem size (resize edges + dim
// values + spacing values) one unified candidate list per gesture-axis is
// simpler. Brute-force traversal scales fine at <100 candidates per axis.
//
// Hysteresis: 4 px in to acquire, 8 px out to release — produces the
// "click into place" feel without chatter at the threshold. Active
// candidate stays sticky within the release threshold even if a slightly-
// closer-but-not-stronger candidate appears mid-drag (a candidate has to
// be both closer AND within HYSTERESIS_IN to "steal" the snap).
//
// Cmd held → snap is disabled entirely. The opts flag flows from the
// gesture's `readModifiers(ev).cmd` (PointerEvent.metaKey / ctrlKey).
//
// Grid is handled as a fallback rather than enumerated — at gridSize=8
// with up to 2000 px of viewport, a candidate list of 250 items would
// dominate brute-force scans on every pointermove. Instead we ask
// "is desired close to a grid multiple?" and synthesize that single
// candidate. Hysteresis-out behavior for grid: once active, stay snapped
// to the same grid value until desired exits HYSTERESIS_OUT around it;
// then either re-acquire the new nearest grid multiple or release. This
// keeps grid feeling solid without chattering between adjacent multiples.

import type {
  Bounds,
  CrossSectionElement,
  ParentContext,
  SiblingInfo,
} from "../layout-context";

export const HYSTERESIS_IN = 4;
export const HYSTERESIS_OUT = 8;

// Per-spec common values from `phase2-manipulation.md` Step 6 line 138.
// Width/height candidates — also used for a "common value" snap when the
// dragged dimension is close to one of these.
export const COMMON_RESIZE_VALUES: ReadonlyArray<number> = [
  16, 24, 32, 48, 64, 96, 128, 160, 192, 240, 256, 320, 384, 480, 512, 640,
  768, 1024,
];

// Per-spec common spacings (Tailwind's gap/padding scale + a few extras).
// Smaller values dominate because spacing is usually small; resize values
// extend to 1024 because page-width resizes are common.
export const COMMON_SPACING_VALUES: ReadonlyArray<number> = [
  0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96,
];

export const DEFAULT_GRID_SIZE = 8;

export type SnapKind =
  | "sibling"
  | "parent"
  | "parent-content"
  | "cross-section"
  | "recent"
  | "common"
  | "grid";

// Iframe-viewport coords for a guide line. Drawn by SelectionOverlay in
// the same coordinate space the bbox lives in (Preview wraps both the
// iframe and the overlay in a shared positioning container).
export interface SnapGuide {
  // Which axis the guide is perpendicular to. 'x' draws a vertical line
  // (constant x, varying y); 'y' draws a horizontal line.
  axis: "x" | "y";
  // Iframe-viewport coordinate the line sits on.
  position: number;
  // Optional perpendicular range. For sibling snaps we typically span from
  // min(element edge, sibling edge) to max — visually showing the line
  // connecting the two. For parent snaps we span the parent's content
  // bounds. When omitted, the consumer can default to the bbox's range.
  from?: number;
  to?: number;
  kind: SnapKind;
}

export interface SnapCandidate {
  kind: SnapKind;
  // The numeric value desired should snap to. For resize this is a width
  // or height in px; for spacing it's the padding/margin value in px.
  value: number;
  // Short label for the chip render. Format depends on use site; e.g.
  // "Width: 320 (sibling)" or "Padding: 16".
  label?: string;
  // Visual guide for sibling/parent edge snaps. Grid/common candidates
  // typically have no guide (just a chip).
  guide?: SnapGuide;
  // Stable identity for hysteresis: when state.active.id matches a new
  // candidate's id, the candidate replaces state.active. Used so swap-
  // between-equal-priority candidates doesn't bounce. Auto-derived from
  // (kind, value, label) when omitted; explicit id is for cases where
  // value can drift but the candidate identity is logically stable
  // (e.g. an active grid candidate's value can change as desired moves —
  // we don't want hysteresis to compare against the previous frame's
  // grid value).
  id?: string;
}

export interface SnapState {
  active: SnapCandidate | null;
}

export interface SnapResult {
  value: number;
  active: SnapCandidate | null;
}

export interface SnapOpts {
  enabled: boolean;
  // When set, fold a synthesized "nearest grid multiple" candidate into
  // the snap loop. Per the module header, grid is a fallback — only used
  // when no enumerated candidate is in range.
  gridSize?: number;
}

// Kind priority for tie-break when multiple candidates are equally close
// to desired. Higher wins. Sibling > parent > cross-section ≈ recent >
// common > grid — extends the spec's `phase2-manipulation.md` line 149
// priority list. Cross-section (any visible element on the page) sits at
// the same tier as recent values — both are "weak hints" relative to
// the strict layout-relative targets (sibling / parent), and acquire-
// path tie-break (closer wins) selects between them naturally. Parent
// content edges are equal to parent edges (both are parent-relative).
const KIND_PRIORITY: Record<SnapKind, number> = {
  sibling: 5,
  parent: 4,
  "parent-content": 4,
  "cross-section": 3,
  recent: 3,
  common: 2,
  grid: 1,
};

export function candidateId(c: SnapCandidate): string {
  if (c.id) return c.id;
  // Default identity: kind+value+label. Two siblings with the same edge
  // value would collide here; if that becomes a real problem the caller
  // should set an explicit id.
  return `${c.kind}:${c.value}:${c.label ?? ""}`;
}

// Snap `desired` to the closest candidate within threshold, with
// hysteresis driven by `state.active`. Caller mutates `state.active`
// based on the returned `active` for the next call.
//
// Algorithm:
//   1. If `enabled === false` (Cmd held), return desired unchanged with
//      active = null.
//   2. If state has an active candidate, check whether desired stayed
//      within HYSTERESIS_OUT of its value. If yes, look for a candidate
//      that's strictly closer AND within HYSTERESIS_IN — only then steal
//      the snap. Otherwise hold the active candidate's value.
//   3. If no active candidate (or it just released), look for the
//      closest candidate within HYSTERESIS_IN. Tie-break by kind priority.
//   4. Grid fallback: if still no active candidate, check whether
//      desired is within HYSTERESIS_IN of the nearest gridSize multiple.
//      If yes, synthesize and return a grid candidate.
export function snap(
  state: SnapState,
  desired: number,
  candidates: ReadonlyArray<SnapCandidate>,
  opts: SnapOpts
): SnapResult {
  if (!opts.enabled) {
    return { value: desired, active: null };
  }
  // Hysteresis-out check: the active candidate sticks within HYSTERESIS_OUT
  // of its value.
  if (state.active) {
    const activeId = candidateId(state.active);
    // Re-find the active candidate in the new candidate list (the caller
    // typically rebuilds the list per frame — bounds can shift if the
    // element resizes mid-drag). Match by id; if it's gone, we've lost
    // the snap.
    let stillThere: SnapCandidate | null = null;
    for (const c of candidates) {
      if (candidateId(c) === activeId) {
        stillThere = c;
        break;
      }
    }
    // Grid is also auto-recomputed: if the active candidate is grid, the
    // "still there" candidate is the new nearest grid multiple. The
    // hysteresis out-check uses the OLD active value; if desired is still
    // within HYSTERESIS_OUT of it, hold. Otherwise release.
    if (stillThere) {
      const dActive = Math.abs(desired - stillThere.value);
      if (dActive <= HYSTERESIS_OUT) {
        // Try to find a stronger candidate within HYSTERESIS_IN that
        // strictly beats the active by distance OR by priority at equal
        // distance.
        const stronger = findStronger(stillThere, desired, candidates);
        if (stronger) {
          return { value: stronger.value, active: stronger };
        }
        return { value: stillThere.value, active: stillThere };
      }
    }
    // Active candidate released. Fall through to fresh acquisition.
  }
  const acquired = acquire(desired, candidates);
  if (acquired) {
    return { value: acquired.value, active: acquired };
  }
  // Grid fallback. The synthesized grid candidate's id is "grid:<v>" so
  // hysteresis re-anchors as desired moves between multiples — once
  // anchored to grid:128 the user has to pull desired outside HYSTERESIS_OUT
  // of 128 before snapping to grid:120 or grid:136.
  if (opts.gridSize) {
    const grid = nearestGridCandidate(desired, opts.gridSize);
    if (grid) return { value: grid.value, active: grid };
  }
  return { value: desired, active: null };
}

function acquire(
  desired: number,
  candidates: ReadonlyArray<SnapCandidate>
): SnapCandidate | null {
  let best: SnapCandidate | null = null;
  let bestDist = HYSTERESIS_IN;
  for (const c of candidates) {
    const d = Math.abs(desired - c.value);
    if (d > bestDist) continue;
    if (best === null || d < bestDist) {
      best = c;
      bestDist = d;
    } else if (d === bestDist) {
      // Same distance — pick higher kind priority. Fall through if equal.
      if (KIND_PRIORITY[c.kind] > KIND_PRIORITY[best.kind]) {
        best = c;
      }
    }
  }
  return best;
}

function findStronger(
  active: SnapCandidate,
  desired: number,
  candidates: ReadonlyArray<SnapCandidate>
): SnapCandidate | null {
  const activeId = candidateId(active);
  const activeDist = Math.abs(desired - active.value);
  const activePrio = KIND_PRIORITY[active.kind];
  let best: SnapCandidate | null = null;
  let bestDist = HYSTERESIS_IN;
  for (const c of candidates) {
    if (candidateId(c) === activeId) continue;
    const d = Math.abs(desired - c.value);
    if (d > bestDist) continue;
    // Steal-condition: strictly closer than active AND within HYSTERESIS_IN.
    // Equal distance is not enough (would chatter on horizontal drags
    // through aligned siblings).
    if (d < activeDist) {
      if (best === null || d < bestDist) {
        best = c;
        bestDist = d;
      } else if (d === bestDist && KIND_PRIORITY[c.kind] > KIND_PRIORITY[best.kind]) {
        best = c;
      }
    } else if (d === activeDist && KIND_PRIORITY[c.kind] > activePrio) {
      // Equal distance but strictly higher priority — also a steal.
      if (best === null || d < bestDist) {
        best = c;
        bestDist = d;
      }
    }
  }
  return best;
}

function nearestGridCandidate(
  desired: number,
  gridSize: number
): SnapCandidate | null {
  if (gridSize <= 0) return null;
  const nearest = Math.round(desired / gridSize) * gridSize;
  if (Math.abs(desired - nearest) > HYSTERESIS_IN) return null;
  return {
    kind: "grid",
    value: nearest,
    label: `${nearest}px (grid)`,
    id: `grid:${nearest}`,
  };
}

// Phase 2 (4c-iii) Resize candidate builder.
//
// Given the gesture's anchor (the element edge that doesn't move during
// the drag — opposite the dragged handle in the (4b) `from: 'opposite-
// edge'` semantic) and the moving direction (+1 if the moving edge
// extends positively from anchor, -1 otherwise), produces a SnapCandidate
// list whose `value` is the WIDTH (or HEIGHT) the element should have
// when its moving edge lands at a particular iframe-viewport coordinate.
//
// Sibling candidates: every visible sibling's matching axis edges (left
// + right for x-axis snaps; top + bottom for y). Bounded by Phase 1's
// `MAX_SIBLINGS_REPORTED` cap (50) so a 200-row product grid doesn't
// produce a candidate-explosion.
//
// Parent candidates: parent bounds + parent content bounds (inside its
// padding box). Both axes get edge candidates; on the moving axis we
// produce 4 candidates (parent left/right or top/bottom of bounds + same
// of contentBounds). The parent content bounds is what most users
// actually want to align to (their element shouldn't extend into the
// parent's padding); parent bounds catches "fill the parent" intent.
//
// Common dim candidates: each value in `commonValues` is a direct
// dimension candidate — `value` = the common width directly. No guide
// (no visible reference rect to draw a line at).
//
// Element-bounds is needed to compute the perpendicular guide range
// (e.g. for an x-axis sibling snap, the vertical line spans from
// min(element.top, sibling.top) to max(element.bottom, sibling.bottom)).
export interface ResizeCandidateOpts {
  axis: "x" | "y";
  // Iframe-viewport coord of the unmoving edge.
  anchor: number;
  // +1 when moving edge extends positively from anchor, -1 otherwise.
  // Right/bottom-side handles → +1; left/top-side → -1.
  direction: 1 | -1;
  parent: ParentContext | null;
  siblings: ReadonlyArray<SiblingInfo>;
  elementBounds: Bounds;
  commonValues?: ReadonlyArray<number>;
  // Phase 2 (4c-iii ext, eleventh-pass) recent-value snap candidates.
  // Session-level cache of width/height values the user committed
  // earlier in this editing flow. Surface as `kind: "recent"` with
  // priority between `parent` and `common`. Only positive values make
  // sense for resize (negative dim candidates are filtered downstream
  // by the same `value > 0` guard sibling/parent edges use).
  recentValues?: ReadonlyArray<number>;
  // (Step 6 cross-section) Visible elements elsewhere on the page —
  // i.e. NOT direct siblings (already in `siblings`), NOT in the
  // ancestor chain, NOT in the descendant subtree. Caller (the iframe
  // layout-context query) does the filtering; this builder just emits
  // 2 candidates per element on the moving axis (left+right edges for
  // x; top+bottom for y) with kind="cross-section". Surface with a
  // visual guide so the user sees which element they're aligning to.
  crossSection?: ReadonlyArray<CrossSectionElement>;
}

export function buildResizeCandidates(
  opts: ResizeCandidateOpts
): SnapCandidate[] {
  const out: SnapCandidate[] = [];
  const elemMinPerp =
    opts.axis === "x" ? opts.elementBounds.y : opts.elementBounds.x;
  const elemMaxPerp =
    opts.axis === "x"
      ? opts.elementBounds.y + opts.elementBounds.height
      : opts.elementBounds.x + opts.elementBounds.width;
  // Sibling edges. Each sibling contributes two candidates per axis
  // (the matching-axis pair of edges). For the moving axis, we add
  // both — the user might be aligning the moving edge to either sibling
  // edge.
  for (const sib of opts.siblings) {
    const sb = sib.bounds;
    const edges =
      opts.axis === "x"
        ? [
            { pos: sb.x, sideLabel: "left" },
            { pos: sb.x + sb.width, sideLabel: "right" },
          ]
        : [
            { pos: sb.y, sideLabel: "top" },
            { pos: sb.y + sb.height, sideLabel: "bottom" },
          ];
    for (const edge of edges) {
      const candidate = edgeToDimCandidate({
        axis: opts.axis,
        edgePosition: edge.pos,
        anchor: opts.anchor,
        direction: opts.direction,
        kind: "sibling",
        label: `${opts.axis === "x" ? "W" : "H"}: ${formatEdgeLabel(opts, edge.pos)} (sibling ${edge.sideLabel})`,
        guide: {
          axis: opts.axis,
          position: edge.pos,
          // Range covers both rects so the user sees the alignment.
          from: Math.min(
            elemMinPerp,
            opts.axis === "x" ? sb.y : sb.x
          ),
          to: Math.max(
            elemMaxPerp,
            opts.axis === "x" ? sb.y + sb.height : sb.x + sb.width
          ),
          kind: "sibling",
        },
      });
      // Skip negative or zero-width candidates — they'd snap the element
      // to a 0/-N px size on the moving axis, which is meaningless.
      if (candidate.value > 0) out.push(candidate);
    }
  }
  // (Step 6) Cross-section edges. Same shape as sibling candidates but
  // pulled from elements outside the immediate sibling/ancestor/descendant
  // tree. Lower priority than sibling but with a guide so the user sees
  // which element they're aligning to. Negative-dim candidates are
  // filtered the same way sibling candidates are.
  const crossSection = opts.crossSection ?? [];
  for (const xs of crossSection) {
    const xb = xs.bounds;
    const edges =
      opts.axis === "x"
        ? [
            { pos: xb.x, sideLabel: "left" },
            { pos: xb.x + xb.width, sideLabel: "right" },
          ]
        : [
            { pos: xb.y, sideLabel: "top" },
            { pos: xb.y + xb.height, sideLabel: "bottom" },
          ];
    for (const edge of edges) {
      const candidate = edgeToDimCandidate({
        axis: opts.axis,
        edgePosition: edge.pos,
        anchor: opts.anchor,
        direction: opts.direction,
        kind: "cross-section",
        label: `${opts.axis === "x" ? "W" : "H"}: ${formatEdgeLabel(opts, edge.pos)} (page ${edge.sideLabel})`,
        guide: {
          axis: opts.axis,
          position: edge.pos,
          from: Math.min(
            elemMinPerp,
            opts.axis === "x" ? xb.y : xb.x
          ),
          to: Math.max(
            elemMaxPerp,
            opts.axis === "x" ? xb.y + xb.height : xb.x + xb.width
          ),
          kind: "cross-section",
        },
      });
      if (candidate.value > 0) out.push(candidate);
    }
  }
  // Parent edges + parent content edges.
  if (opts.parent) {
    const pb = opts.parent.bounds;
    const cb = opts.parent.contentBounds;
    const parentEdges =
      opts.axis === "x"
        ? [
            { pos: pb.x, sideLabel: "parent left", kind: "parent" as const },
            { pos: pb.x + pb.width, sideLabel: "parent right", kind: "parent" as const },
            { pos: cb.x, sideLabel: "content left", kind: "parent-content" as const },
            { pos: cb.x + cb.width, sideLabel: "content right", kind: "parent-content" as const },
          ]
        : [
            { pos: pb.y, sideLabel: "parent top", kind: "parent" as const },
            { pos: pb.y + pb.height, sideLabel: "parent bottom", kind: "parent" as const },
            { pos: cb.y, sideLabel: "content top", kind: "parent-content" as const },
            { pos: cb.y + cb.height, sideLabel: "content bottom", kind: "parent-content" as const },
          ];
    for (const edge of parentEdges) {
      const candidate = edgeToDimCandidate({
        axis: opts.axis,
        edgePosition: edge.pos,
        anchor: opts.anchor,
        direction: opts.direction,
        kind: edge.kind,
        label: `${opts.axis === "x" ? "W" : "H"}: ${formatEdgeLabel(opts, edge.pos)} (${edge.sideLabel})`,
        guide: {
          axis: opts.axis,
          position: edge.pos,
          from:
            opts.axis === "x" ? pb.y : pb.x,
          to:
            opts.axis === "x" ? pb.y + pb.height : pb.x + pb.width,
          kind: edge.kind,
        },
      });
      if (candidate.value > 0) out.push(candidate);
    }
  }
  // Recent dimension values — direct dim candidates, no guide. Higher
  // priority than common (the user just used these values, more likely
  // intentional). Skip non-positive values defensively.
  const recent = opts.recentValues ?? [];
  for (const v of recent) {
    if (!(v > 0)) continue;
    out.push({
      kind: "recent",
      value: v,
      label: `${opts.axis === "x" ? "W" : "H"}: ${v} (recent)`,
      id: `recent:${opts.axis}:${v}`,
    });
  }
  // Common dimension values — direct dim candidates, no guide.
  const common = opts.commonValues ?? COMMON_RESIZE_VALUES;
  for (const v of common) {
    out.push({
      kind: "common",
      value: v,
      label: `${opts.axis === "x" ? "W" : "H"}: ${v}`,
      id: `common:${opts.axis}:${v}`,
    });
  }
  return out;
}

function formatEdgeLabel(opts: ResizeCandidateOpts, edgePos: number): string {
  const dim =
    opts.direction === 1 ? edgePos - opts.anchor : opts.anchor - edgePos;
  return Math.round(dim).toString();
}

interface EdgeToDimOpts {
  axis: "x" | "y";
  edgePosition: number;
  anchor: number;
  direction: 1 | -1;
  kind: SnapKind;
  label: string;
  guide: SnapGuide;
}

function edgeToDimCandidate(o: EdgeToDimOpts): SnapCandidate {
  const dim = o.direction === 1 ? o.edgePosition - o.anchor : o.anchor - o.edgePosition;
  return {
    kind: o.kind,
    value: dim,
    label: o.label,
    guide: o.guide,
    id: `${o.kind}:${o.axis}:${o.edgePosition}`,
  };
}

// Phase 2 (4c-iii) Spacing candidate builder. Spacing values are 1D and
// snap directly to (a) the common scale (Tailwind-like) and (b) grid
// multiples (handled via the snap()'s gridSize fallback). No edge guide
// — spacing snaps surface as a chip ("Padding: 16px") only.
export interface SpacingCandidateOpts {
  commonValues?: ReadonlyArray<number>;
  kind: "padding" | "margin";
  // Recent-value cache for spacing — separate from resize because the
  // numeric scales differ (spacing is typically <100, resize commonly
  // >100). Caller maintains two independent caches, passes the matching
  // one for each kind of gesture.
  recentValues?: ReadonlyArray<number>;
}

export function buildSpacingCandidates(
  opts: SpacingCandidateOpts
): SnapCandidate[] {
  const out: SnapCandidate[] = [];
  // Recent first (higher priority — see KIND_PRIORITY).
  const recent = opts.recentValues ?? [];
  for (const v of recent) {
    // For margin, negative values are valid (overlap effects). Keep them.
    // For padding, gesture-math.ts clamps at 0 anyway, so negatives can't
    // arrive here from a valid commit — but if a future caller sends one
    // we don't filter; the snap just won't fire (out of range).
    out.push({
      kind: "recent",
      value: v,
      label: `${opts.kind === "padding" ? "Padding" : "Margin"}: ${v}px (recent)`,
      id: `recent:${opts.kind}:${v}`,
    });
  }
  const common = opts.commonValues ?? COMMON_SPACING_VALUES;
  for (const v of common) {
    out.push({
      kind: "common",
      value: v,
      label: `${opts.kind === "padding" ? "Padding" : "Margin"}: ${v}px`,
      id: `common:${opts.kind}:${v}`,
    });
  }
  return out;
}
