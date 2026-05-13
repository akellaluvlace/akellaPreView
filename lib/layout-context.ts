// Phase 1 Layer 2 Layout Inspector — what the host learns about the rendered
// world. This is the contract between the iframe-side queryer (lives inside
// `inspectorRuntimeJs` in `lib/preview.ts`) and host consumers (Layer 3 intent
// resolver, future drag handles, the inspector's "this element is a flex
// child" badge, etc.).
//
// The full LayoutContext shape spec'd in `maniuplation.md` Layer 2 is rich —
// `computed: { ...all resolved CSS }` and `inheritedFrom: { ...provenance per
// property }` are heavy enough that nothing in Phase 1 needs them. Phase 1
// ships the structural fields (bounds, padding, margin, layoutRole, parent
// context, flex/grid constraints, siblings). The full computed-CSS dump and
// per-property provenance lookup are deferred until a consumer actually needs
// them — there's no point paying the postMessage payload cost for data nobody
// reads.
//
// Coordinate system: all `bounds` and `contentBounds` rectangles are in iframe
// viewport coordinates (`getBoundingClientRect` semantics). Host code that
// projects them into host viewport coords adds the iframe's own
// `getBoundingClientRect().{top,left}`.

export type LayoutRole =
  | "block"
  | "inline"
  | "inline-block"
  | "flex-item"
  | "grid-cell"
  | "absolute"
  | "fixed";

// Parent-side role. "Inline-container" handles `<span>` / `<a>` / etc. with
// `display: inline*` whose children render inline-flow. We only distinguish
// this from "block" when the difference matters for intent resolution — e.g.
// a child of a flex-container is a `flex-item`, child of inline-container is
// just `inline`. Keep the partition aligned with `LayoutRole` so child →
// parent role lookups don't need additional translation.
export type ParentLayoutRole =
  | "block"
  | "inline-container"
  | "flex-container"
  | "grid-container";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoxOffsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ParentContext {
  // Parent's OID if it has one; null when the parent is the body, an
  // OID-less fragment-rendered element, or otherwise outside the OID scope.
  oid: string | null;
  layoutRole: ParentLayoutRole;
  // Flex/grid direction. `null` for non-flex/grid parents.
  direction: "row" | "column" | null;
  wrap: boolean;
  gap: { row: number; column: number };
  // `justify-content` / `align-items` raw computed values. Strings rather
  // than enums because grid `justify-items` etc. accept arbitrary keywords
  // and the consumer (intent resolver) already string-matches.
  justify: string;
  align: string;
  bounds: Bounds;
  // Inside the parent's padding box — the area children actually flow in.
  contentBounds: Bounds;
}

export interface LayoutConstraints {
  // True when `flex-grow > 0` AND parent is a flex-container. The combined
  // condition is what intent resolution actually wants: a `flex-grow: 1`
  // element with a non-flex parent has no growing behaviour, so reporting
  // "isFlexGrowing: true" off raw computed style would mislead Layer 3.
  isFlexGrowing: boolean;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  isGridSpanning: boolean;
  gridColumnSpan: number;
  gridRowSpan: number;
  // Numeric aspect ratio (width/height) when set; null when `auto`.
  aspectRatio: number | null;
  isImage: boolean;
  isText: boolean;
  isLeafNode: boolean;
}

export interface SiblingInfo {
  oid: string | null;
  bounds: Bounds;
  layoutRole: LayoutRole;
}

// Phase 2 (Step 6 cross-section) — visible OID-bearing elements on the page
// other than the queried element, its parent ancestor chain, its
// descendants, and its direct siblings (already in `siblings`). Provides
// snap candidates for "align with the column heading three rows up" /
// "match the hero's height" intents that aren't sibling-relative. Bounded
// host-side to keep postMessage cheap; viewport-clipped iframe-side so
// off-screen elements don't pollute the candidate space.
export interface CrossSectionElement {
  oid: string | null;
  bounds: Bounds;
}

// Phase 3 — drop-target enumeration. Used by the reparent gesture at
// pointerdown: the iframe walks every visible OID-bearing element on
// the page, filters out the moved element, its descendants, and any
// container that can't accept children (void elements, leaf media,
// `<select>` / `<textarea>`, etc.), and returns one entry per eligible
// candidate. The host caches the array for the gesture's lifetime and
// hit-tests cursor → target on every pointermove (no per-frame RPC).
//
// `direction` describes the candidate's flow direction so the gesture
// knows how to interpret cursor → child midpoint comparisons:
//   - "row"     — flex/inline children laid out horizontally;
//                 insertion index is determined by cursor.x vs child mid.x.
//   - "column"  — flex children laid out vertically.
//   - "block"   — normal flow (most divs); insertion by cursor.y vs mid.y.
//   - "grid"    — CSS grid; gesture treats as nearest-by-distance.
//
// `children` lists the candidate's CURRENT real children with bounds.
// When the gesture computes insertIndex on hover, it walks `children`
// in order and returns the first index where cursor crosses the
// child's perpendicular-axis midpoint — or `children.length` if cursor
// is past the last child.
export interface DropTargetChild {
  oid: string | null;
  bounds: Bounds;
}

export type DropTargetDirection = "row" | "column" | "block" | "grid";

export interface DropTarget {
  oid: string;
  // Lowercased tag name (e.g. "main", "section", "div"). Used by the
  // commit toast to read like "Moved to <main>". Always present —
  // iframe walker reads `element.tagName` which exists for every
  // element it could possibly enumerate.
  tag: string;
  // Outer bounds (border-box) in iframe-viewport coordinates.
  bounds: Bounds;
  // Inside the candidate's padding box — usable area where children flow.
  contentBounds: Bounds;
  direction: DropTargetDirection;
  children: DropTargetChild[];
}

// Phase 3 polish — drop-eligibility feedback (`phase2-manipulation.md` line
// 547). The walker returns OID-bearing elements that the gesture should
// treat as REJECT-on-drop alongside the eligible `DropTarget` list. Each
// carries a reason code; the gesture renders a red outline + small tooltip
// when the cursor sits over one. Reasons:
//   - "leaf"       — element is a void / media / form-control container that
//                    can't accept arbitrary block children (img, input,
//                    select, video, etc.). Walker skips on the eligible
//                    pass; pushes here for visual feedback.
//   - "descendant" — element is inside the moved element's subtree. Dropping
//                    here would create a structural cycle. Engine bails too
//                    (belt-and-braces).
export type IneligibleDropReason = "leaf" | "descendant";

export interface IneligibleDropTarget {
  oid: string;
  tag: string;
  bounds: Bounds;
  reason: IneligibleDropReason;
}

export interface LayoutContext {
  oid: string;
  // Element's bounding rectangle in iframe-viewport coordinates.
  bounds: Bounds;
  // `getComputedStyle().padding{Top,...}` resolved to px.
  padding: BoxOffsets;
  // `getComputedStyle().margin{Top,...}` resolved to px.
  margin: BoxOffsets;
  layoutRole: LayoutRole;
  // Null when the element has no addressable parent (e.g. it IS body, or it
  // was queried before the iframe's React tree mounted).
  parent: ParentContext | null;
  constraints: LayoutConstraints;
  // Siblings in source order, EXCLUDING the queried element. Bounded to
  // `MAX_SIBLINGS_REPORTED` (see `lib/preview.ts inspectorRuntimeJs`) so a
  // 200-item product grid doesn't choke postMessage.
  siblings: SiblingInfo[];
  // (Step 6 cross-section snap) Visible OID-bearing elements on the page
  // OUTSIDE the immediate sibling/ancestor/descendant tree. Used by the
  // snap engine to align the dragged element's edges to elements
  // elsewhere on the page (e.g. a CTA button matching a card column edge
  // on a different row). Bounded to `MAX_CROSS_SECTION_REPORTED` and
  // viewport-clipped to keep payload small. Empty when no candidates
  // qualify or when the query failed to enumerate the DOM.
  crossSection: CrossSectionElement[];
}
