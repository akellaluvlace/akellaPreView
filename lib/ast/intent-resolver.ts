// Phase 2 Layer 3 — Intent Resolver. Per `maniuplation.md` §"Layer 3" and
// `phase2-manipulation.md` Step 2. Pure function: given (handle role, current
// layout context, modifier keys) → typed `Intent`. Phase 2 (4b) implements the
// size-handle path only; padding / margin / radius / font-size / position /
// reorder / reparent / rotate / skew are stubbed in the type space so future
// chunks land additively.
//
// The resolver does NOT touch source. It picks the *kind* of edit; the
// operation engine in `lib/ast/operations/` decides which CSS property + unit
// to write. Splitting the two layers means the unit choice (px vs rem vs %)
// can later peek at the user's existing style values without complicating the
// resolver, and the resolver can be unit-tested with deterministic input.
//
// "Basis" in `ResizeWidth` / `ResizeHeight` is the spec's primary axis pick:
//   - `width` / `height`         — static block / inline-block elements
//   - `flex-basis`               — flex children whose parent runs in the same
//                                  axis as the resize (Phase 2 4c+)
//   - `grid-span`                — grid cells (Phase 2 4c+)
//   - `min-width` / `max-width`  — modifier-key escape hatches (Phase 2 4c+)
//   - `aspect-ratio`             — Shift+drag corner with image (Phase 2 4c+)
//
// (4b) v1: the resolver only ever returns `basis: 'width'` / `'height'` and
// `unit: 'px'`. The type space is wider so adding a flex-basis branch in the
// future doesn't churn callers.

import type { LayoutContext } from "../layout-context";

// 8 handle keys per `phase2-manipulation.md` Step 1 / `SelectionOverlay.tsx
// HANDLE_POSITIONS`. These name the corner / midpoint that the user grabbed
// and double as the resize-axis hint (e.g. `tl` resizes both axes from the
// top-left).
export type SizeHandle =
  | "tl"
  | "t"
  | "tr"
  | "r"
  | "br"
  | "b"
  | "bl"
  | "l";

// Phase 2 (4d) spacing handle keys. Lowercase "p"/"m" prefix names the kind
// (padding / margin); the second letter names the edge midpoint. Padding
// handles render JUST INSIDE the bbox edge, margin handles JUST OUTSIDE —
// see `SelectionOverlay.tsx HANDLE_POSITIONS_PADDING / _MARGIN`. Single-axis
// per handle: top/bottom drag along Y, left/right along X.
export type SpacingHandle =
  | "pt"
  | "pr"
  | "pb"
  | "pl"
  | "mt"
  | "mr"
  | "mb"
  | "ml";

export type SpacingSide = "top" | "right" | "bottom" | "left";

// Maps the second-letter of a SpacingHandle to its CSS side name. Pure
// lookup — kept as an object so future SpacingHandle additions (e.g.
// "ptr" for top-right corner radius) don't need a switch refactor.
export function spacingHandleSide(handle: SpacingHandle): SpacingSide {
  switch (handle) {
    case "pt":
    case "mt":
      return "top";
    case "pr":
    case "mr":
      return "right";
    case "pb":
    case "mb":
      return "bottom";
    case "pl":
    case "ml":
      return "left";
  }
}

// Padding vs margin distinction from the handle key. Operation engine
// (`lib/ast/operations/spacing.ts`) takes the kind explicitly so this is
// the bridge from "handle the user grabbed" → "what we write to source".
export function spacingHandleKind(
  handle: SpacingHandle
): "padding" | "margin" {
  return handle === "pt" || handle === "pr" || handle === "pb" || handle === "pl"
    ? "padding"
    : "margin";
}

// Opposite-side helper. Used by Alt-symmetric to mirror the value to the
// matching side. Phase 2 (4d) v1 only emits the active side without Alt,
// or active + opposite with Alt.
export function oppositeSpacingSide(side: SpacingSide): SpacingSide {
  switch (side) {
    case "top":
      return "bottom";
    case "right":
      return "left";
    case "bottom":
      return "top";
    case "left":
      return "right";
  }
}

// Modifier keys held during the drag. Spec §"Drag lifecycle → Drag move":
// Shift = aspect-ratio lock, Alt = resize from center, Cmd = disable snap.
// Aspect lock + center-resize affect the resolver's output; Cmd is consumed
// by the snap system (Phase 2 4c+) and ignored here.
export interface DragModifiers {
  shift: boolean;
  alt: boolean;
  cmd: boolean; // (4c+) snap disable, no resolver effect today
}

// Resolver input. Phase 2 (4b) consumers pass a minimal `LayoutContext`
// (the iframe-side `dropinComputeLayoutContext` output) plus the handle key
// and modifier keys. Phase 2 (4c+) widens with `existingStyleValues` so the
// resolver can preserve the user's `rem` vs `px` choice.
export interface ResizeInput {
  handle: SizeHandle;
  context: LayoutContext;
  modifiers: DragModifiers;
}

// Phase 2 (4d) spacing-resolver input. Mirrors `ResizeInput` shape but with
// a SpacingHandle. Layout context is required because the resolver needs
// the existing per-side values to decide unit (4c+) and to drive the
// "auto" → numeric coercion for margin (a future `auto` → `0` rewrite when
// Alt symmetric is held on a side that's currently "auto"). v1 (4d) doesn't
// use it — gesture path bypasses to `applySpacing` directly — but the
// type space is set up so the wiring lands additively.
export interface SpacingInput {
  handle: SpacingHandle;
  context: LayoutContext;
  modifiers: DragModifiers;
}

export type ResizeBasis =
  | "width"
  | "height"
  | "flex-basis"
  | "grid-span"
  | "min-width"
  | "min-height"
  | "max-width"
  | "max-height"
  | "aspect-ratio";

export type ResizeUnit = "px" | "rem" | "em" | "%" | "auto";

export interface ResizeWidthIntent {
  kind: "resize-width";
  basis: ResizeBasis;
  unit: ResizeUnit;
  preserveAspect: boolean;
  // Whether the resize anchors at the opposite edge (default) or the center
  // (Alt-drag). The operation engine reads this to mirror the delta on the
  // other side. (4b) v1 always emits `from: 'opposite-edge'` regardless of
  // Alt — center-resize is a Phase 2 (4c+) concern.
  from: "opposite-edge" | "center";
}

export interface ResizeHeightIntent {
  kind: "resize-height";
  basis: ResizeBasis;
  unit: ResizeUnit;
  preserveAspect: boolean;
  from: "opposite-edge" | "center";
}

// Spec variants stubbed for future phases. Keeping them in the union means
// the operation engine's switch statement has an exhaustive default case
// to flag missing handlers as soon as a new variant is added.
export interface AdjustPaddingIntent {
  kind: "adjust-padding";
  sides: ReadonlyArray<"top" | "right" | "bottom" | "left">;
  unit: ResizeUnit;
  symmetric: boolean;
}
export interface AdjustMarginIntent {
  kind: "adjust-margin";
  sides: ReadonlyArray<"top" | "right" | "bottom" | "left">;
  unit: ResizeUnit;
  symmetric: boolean;
}
export interface AdjustRadiusIntent {
  kind: "adjust-radius";
  corners: ReadonlyArray<"tl" | "tr" | "br" | "bl">;
  uniform: boolean;
  unit: ResizeUnit;
}
export interface AdjustFontSizeIntent {
  kind: "adjust-font-size";
  unit: ResizeUnit;
}

export type Intent =
  | ResizeWidthIntent
  | ResizeHeightIntent
  | AdjustPaddingIntent
  | AdjustMarginIntent
  | AdjustRadiusIntent
  | AdjustFontSizeIntent;

// Which axes a given size handle resizes. The corner handles (tl/tr/br/bl)
// touch both axes; the edge midpoints (t/r/b/l) touch only their parallel
// axis. Used by the gesture handler to decide which intents to compose into
// a single drag (a corner drag emits both ResizeWidth + ResizeHeight intents
// on commit).
export function resizeAxesFor(handle: SizeHandle): {
  width: boolean;
  height: boolean;
} {
  if (handle === "l" || handle === "r") return { width: true, height: false };
  if (handle === "t" || handle === "b") return { width: false, height: true };
  return { width: true, height: true };
}

// Returns true when Shift's aspect-lock is meaningful for this handle. (4c-ii)
// supports lock on both corners and edges (matches Figma); only thing that
// disqualifies aspect-lock is "no handle that affects either axis" (which
// can't happen with our 8 handle keys). Kept as a function so future
// per-handle policy (e.g. only-corner-lock) lands in one place.
function aspectLockApplies(handle: SizeHandle): boolean {
  // Every handle affects at least one axis, so Shift always has somewhere
  // to lock the aspect. Kept as a function for symmetry with the other
  // semantic checks below.
  return resizeAxesFor(handle).width || resizeAxesFor(handle).height;
}

// Phase 2 (4b + 4c-ii + twelfth-pass) resolver. Returns one or two
// `ResizeWidthIntent` / `ResizeHeightIntent` items, picking `basis` based on
// the element's layout context:
//
//   - **Flex-row child with `flex-grow > 0`** → width intent gets
//     `basis: 'flex-basis'`. The main axis IS width for `flex-direction:
//     row`, and writing `flex-basis` (rather than `width`) is the
//     semantically correct way to size flex-growing children. Acceptance
//     criterion #11 from `phase2-manipulation.md` line 273 explicitly
//     requires this.
//   - **Flex-column child with `flex-grow > 0`** → height intent gets
//     `basis: 'flex-basis'`. Symmetric.
//   - **Anything else** → `basis: 'width' | 'height'` per axis. Static
//     blocks, plain inline-blocks, grid cells (until grid-span lands),
//     non-flex-growing flex children all fall through here.
//
// Unit is still always `px` in v1 — Phase 4+ will read `existingStyleValues`
// from `input.context` to preserve the user's `rem` / `%` / `em` choice.
//
// `preserveAspect` (Shift) and `from` (Alt center-resize) are populated from
// modifiers regardless of basis — flex-basis flex children can still
// aspect-lock (the gesture math derives the perpendicular axis the same way
// regardless of which CSS prop the operation engine writes).
//
// Pure function — same input always produces same output. Bench:
// `scripts/bench-resolver.mjs`.
export function resolveResizeIntent(
  input: ResizeInput
): ReadonlyArray<ResizeWidthIntent | ResizeHeightIntent> {
  const axes = resizeAxesFor(input.handle);
  const preserveAspect =
    input.modifiers.shift && aspectLockApplies(input.handle);
  const from: "opposite-edge" | "center" = input.modifiers.alt
    ? "center"
    : "opposite-edge";

  // `LayoutConstraints.isFlexGrowing` is pre-computed: true ONLY when
  // `flex-grow > 0` AND parent is flex-container (per `lib/layout-context.ts`
  // doc). When true, the parent's `direction` ('row' | 'column') tells us
  // which axis flex-basis controls. Outside that condition flex-basis is a
  // no-op for sizing, so we keep the plain width/height path.
  const flexAxis: "row" | "column" | null =
    input.context.constraints.isFlexGrowing &&
    input.context.parent &&
    input.context.parent.direction !== null
      ? input.context.parent.direction
      : null;

  const intents: Array<ResizeWidthIntent | ResizeHeightIntent> = [];
  if (axes.width) {
    intents.push({
      kind: "resize-width",
      basis: flexAxis === "row" ? "flex-basis" : "width",
      unit: "px",
      preserveAspect,
      from,
    });
  }
  if (axes.height) {
    intents.push({
      kind: "resize-height",
      basis: flexAxis === "column" ? "flex-basis" : "height",
      unit: "px",
      preserveAspect,
      from,
    });
  }
  return intents;
}

// Maps a resolved `ResizeBasis` to the camelCase JSX inline-style property
// name we write through `applyStyleProps`. The gesture path uses this in
// onUp to build the declaration map for `onResizeCommit`. Kept here (rather
// than in SelectionOverlay) because the basis → property mapping is a
// resolver concern: when a future basis ('grid-span', 'min-width', etc.)
// lands, only this function needs updating. Returns null for bases we
// don't yet have an operation engine for ('grid-span', 'aspect-ratio'),
// signalling "skip this intent". v1: width / height / flex-basis /
// min-width / min-height / max-width / max-height all map cleanly.
export function basisToStyleProp(basis: ResizeBasis): string | null {
  switch (basis) {
    case "width":
      return "width";
    case "height":
      return "height";
    case "flex-basis":
      return "flexBasis";
    case "min-width":
      return "minWidth";
    case "min-height":
      return "minHeight";
    case "max-width":
      return "maxWidth";
    case "max-height":
      return "maxHeight";
    case "grid-span":
    case "aspect-ratio":
      return null;
  }
}

// Phase 2 (4d) spacing-resolver. Returns either an AdjustPaddingIntent or
// AdjustMarginIntent based on the handle's kind. `sides` is always a
// single-element array containing the handle's edge side; with Alt held,
// the opposite side is included too (`symmetric: true`). Unit is always
// `px` in v1 — Phase 2 (4c+) will read existingStyleValues from
// `input.context` to preserve the user's rem vs px choice.
//
// As with `resolveResizeIntent`, the gesture handler currently bypasses
// this resolver and calls `applySpacing` directly with primitive sides.
// Resolver remains for future consumers (snap system, properties panel
// commit path, multi-element coordinated drag).
export function resolveSpacingIntent(
  input: SpacingInput
): AdjustPaddingIntent | AdjustMarginIntent {
  const side = spacingHandleSide(input.handle);
  const kind = spacingHandleKind(input.handle);
  const sides: ReadonlyArray<SpacingSide> = input.modifiers.alt
    ? [side, oppositeSpacingSide(side)]
    : [side];
  if (kind === "padding") {
    return {
      kind: "adjust-padding",
      sides,
      unit: "px",
      symmetric: input.modifiers.alt,
    };
  }
  return {
    kind: "adjust-margin",
    sides,
    unit: "px",
    symmetric: input.modifiers.alt,
  };
}
