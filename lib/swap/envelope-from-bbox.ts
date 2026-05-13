// Phase E proper — Slot envelope composer.
//
// At swap-invoke time, the host needs a `SlotEnvelope` describing the
// container the swap target lives in. That envelope feeds
// `slotCapacityFits` (slot-capacity.ts) so the LibraryModal filter can
// dim incompatible assets.
//
// Iframe-side gathers the raw inputs (parent's bounding rect + the
// padding/border/aspectRatio CSS values) and posts them to the host via
// the existing `dropin:bbox` channel. This module's job is the PURE
// MATH that turns those inputs into a typed `SlotEnvelope`:
//
//   - subtract horizontal padding/border to get the asset's available
//     width (the asset paints in the content box, not the border box)
//   - same for vertical
//   - inherit the parent's aspect-ratio if it has one set explicitly
//   - clamp at zero (negative envelopes are degenerate)
//
// Pure-logic only — no React, no DOM, no fetch.

import type { SlotEnvelope } from "./slot-capacity";

// Subset of CSSStyleDeclaration values the iframe sends. Pixel values
// are pre-resolved to numbers (iframe converts via getComputedStyle's
// px-suffixed strings or `getBoundingClientRect`'s subpixel rect math).
// `aspectRatioCss` is the raw CSS value ("auto", "16/9", "1.5", "1 / 1",
// etc.); this module parses it.
export interface ParentBox {
  readonly contentWidthPx: number;   // border-box width minus padding-l/r minus border-l/r
  readonly contentHeightPx: number;
  // CSS aspect-ratio value as it would appear in `getComputedStyle(parent).aspectRatio`.
  // Common values: "auto" (no AR), "16 / 9", "1 / 1", or a single number "1.5".
  readonly aspectRatioCss: string | null;
}

// Parse a CSS aspect-ratio value. Handles:
//   "auto"            → null
//   "16 / 9", "16/9"  → 16/9
//   "1.5"             → 1.5
//   "1 / 1"           → 1
//   ""                → null
//   any malformed     → null
//
// Pure function exported for testing + future reuse.
export function parseCssAspectRatio(raw: string | null | undefined): number | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "auto") return null;

  // "X / Y" or "X/Y" form.
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/").map((s) => s.trim());
    if (parts.length !== 2) return null;
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    if (!isFinite(x) || !isFinite(y) || x <= 0 || y <= 0) return null;
    return x / y;
  }

  // Single-number form.
  const n = parseFloat(trimmed);
  if (!isFinite(n) || n <= 0) return null;
  return n;
}

export function composeEnvelopeFromBbox(parent: ParentBox): SlotEnvelope {
  // Clamp at zero — a parent with negative content dimensions is
  // pathological (browser collapsed the box) and the consumer should
  // treat as zero space, not negative.
  const w = Math.max(0, parent.contentWidthPx);
  const h = Math.max(0, parent.contentHeightPx);
  const ar = parseCssAspectRatio(parent.aspectRatioCss);

  return {
    availableWidthPx: w,
    availableHeightPx: h,
    preferredAspectRatio: ar,
  };
}

// Convenience: build a ParentBox from raw CSSOM-shaped inputs (the
// iframe might send those instead of pre-computed content dims).
// Subtracts padding + border from border-box rect.
export interface ParentBoxFromRectInput {
  readonly rectWidthPx: number;     // getBoundingClientRect().width
  readonly rectHeightPx: number;    // getBoundingClientRect().height
  readonly paddingLeftPx: number;
  readonly paddingRightPx: number;
  readonly paddingTopPx: number;
  readonly paddingBottomPx: number;
  readonly borderLeftPx: number;
  readonly borderRightPx: number;
  readonly borderTopPx: number;
  readonly borderBottomPx: number;
  readonly aspectRatioCss: string | null;
}

export function parentBoxFromRect(input: ParentBoxFromRectInput): ParentBox {
  const horizontalChrome =
    input.paddingLeftPx +
    input.paddingRightPx +
    input.borderLeftPx +
    input.borderRightPx;
  const verticalChrome =
    input.paddingTopPx +
    input.paddingBottomPx +
    input.borderTopPx +
    input.borderBottomPx;
  return {
    contentWidthPx: input.rectWidthPx - horizontalChrome,
    contentHeightPx: input.rectHeightPx - verticalChrome,
    aspectRatioCss: input.aspectRatioCss,
  };
}
