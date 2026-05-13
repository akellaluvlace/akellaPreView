// Phase 2 Step 7 — Soft constraints (`phase2-manipulation.md` line 163-170 +
// `maniuplation.md` "Constraints → Soft constraints"). Pure module — no DOM,
// no React, no postMessage. Caller (iframe-side `dropinComputeSoftConstraints`
// in `lib/preview.ts`) gathers raw measurements per element and feeds them
// in; this module returns the structured warning list. Host receives the
// warnings via `dropin:soft-constraints-result` and surfaces them through
// the SelectionOverlay UI.
//
// Hard constraints (min-content elastic, padding clamp at 0) are ALREADY
// enforced via Phase 2 (4c-i) — those bound the gesture math directly. Soft
// constraints don't bound anything; they surface as advisory warnings on
// the selected element. The user is free to ignore them. Per-element
// override and configurable thresholds are deferred to a later phase.
//
// Severity is informational ("warning") for v1. The render layer uses one
// chip style for all kinds; future revisions might split critical (e.g.
// off-canvas) from advisory (touch-target close to threshold).
//
// Categories implemented (mapping to the spec):
//   - touch-target: interactive element with bbox < 32px on either axis.
//   - text-size: element with direct text content + font-size < 12px.
//   - aspect-distorted: <img> rendered at a different ratio than its
//     naturalWidth / naturalHeight (5% tolerance).
//   - contrast: text element where the foreground/background pair fails
//     WCAG AA — 4.5:1 for normal text, 3:1 for large text (>=18px or
//     >=14px bold).
//   - overflow: element bbox extends outside its parent's bbox by > 1 px
//     on either axis. Most common cause: width pulled past parent or
//     padding pushed content out of an overflow:hidden container.
//
// Per-element override and configurable thresholds are deferred (spec line
// 170 calls them out as later-phase work).

export type SoftConstraintKind =
  | "touch-target"
  | "text-size"
  | "aspect-distorted"
  | "contrast"
  | "overflow";

export type SoftConstraintSeverity = "warning";

export interface SoftConstraintWarning {
  kind: SoftConstraintKind;
  severity: SoftConstraintSeverity;
  // Short, plaintext message for the chip. Format is "<value> (<threshold>)"
  // when relevant so the user sees both numbers without opening a tooltip.
  message: string;
  // Optional axis hint for visualization (e.g. an overflow indicator can
  // tint only the affected edges). Null when the warning isn't axis-specific
  // (touch-target uses both, aspect-distorted is a 2D phenomenon, etc.).
  axis?: "x" | "y" | "both" | null;
}

// RGBA in [0..255] for r/g/b and [0..1] for a. Matches what
// `getComputedStyle().color` reports after parsing rgb()/rgba()/named-color.
export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

// Raw measurements gathered from the iframe DOM. The iframe-side `dropin
// ComputeSoftConstraints` (in `lib/preview.ts`) fills this struct from
// getBoundingClientRect / getComputedStyle / naturalWidth-naturalHeight,
// then either calls `evaluateSoftConstraints` OR — equivalently — runs an
// inlined copy of the same logic and ships the warning list directly.
//
// We expose the host-side path mainly so the bench can verify the
// thresholds are correct without spinning up an iframe.
export interface SoftConstraintInput {
  // Element bbox (iframe-viewport coords; only width / height matter for
  // the soft constraints, but we carry x/y too so the parent-overflow
  // check has both halves). Width / height in resolved px.
  bounds: { x: number; y: number; width: number; height: number };
  // Parent bbox; null when the element IS the body or there's no
  // addressable parent. Used only by the overflow check.
  parentBounds: { x: number; y: number; width: number; height: number } | null;
  // Resolved font-size in px (from getComputedStyle).
  fontSizePx: number;
  // Numeric font-weight (400 normal, 700 bold). Mapped from CSS by the
  // iframe-side gather.
  fontWeight: number;
  // True when the element interactively responds to clicks (anchor,
  // button, input, select, textarea, label, [role=button|link]). The
  // iframe-side gather uses tagName + role attribute lookup.
  isInteractive: boolean;
  // True when the element has at least one non-whitespace text child node
  // directly (not just nested elements with text). Matches the heuristic
  // CSS text-overflow / white-space styling apply to.
  hasDirectText: boolean;
  // True for IMG / VIDEO / PICTURE / CANVAS / SVG. Same predicate as
  // LayoutContext.constraints.isImage.
  isImage: boolean;
  // <img> natural aspect ratio (naturalWidth / naturalHeight) when both
  // are positive; null for non-IMG, for SVG without intrinsic ratio, and
  // for elements with broken/loading sources.
  naturalAspect: number | null;
  // Resolved foreground color (computed style 'color'). null when parsing
  // failed.
  fgColor: Rgba | null;
  // Resolved opaque background color, walked up through ancestors until an
  // opaque-enough rule was found. null when the chain hit an ancestor with
  // a backgroundImage we can't reason about (gradient, url()) or when the
  // chain reached the body without finding any background.
  bgColor: Rgba | null;
}

// --- Thresholds --------------------------------------------------------
// Centralized so the iframe-side inline copy + bench fixtures + host
// renderer all reference one table. Spec values from `phase2-manipulation
// .md` line 163-170 + WCAG AA.
export const TOUCH_TARGET_MIN_PX = 32;
export const TEXT_SIZE_MIN_PX = 12;
// Tolerance for image aspect distortion. Browsers can stretch images by
// 1-2% on subpixel rounding alone, so we use 5% which corresponds to the
// "obvious to the eye" threshold designers care about.
export const ASPECT_DISTORTION_TOLERANCE = 0.05;
// Per WCAG 2.1: large text is >= 18 px OR (>= 14 px AND bold >= 700).
// The thresholds for AA are 4.5:1 (normal) and 3:1 (large).
export const WCAG_LARGE_FONT_PX = 18;
export const WCAG_LARGE_BOLD_FONT_PX = 14;
export const WCAG_BOLD_WEIGHT = 700;
export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3.0;
// Overflow tolerance — 1 px to absorb subpixel rounding when an element
// is intentionally flush with parent edges.
export const OVERFLOW_TOLERANCE_PX = 1;

// --- Color math --------------------------------------------------------
// Standard sRGB → linear conversion + WCAG luminance + contrast ratio.
// Pure functions, no dependence on element / context; used by both the
// host module + the iframe-side inline copy.

export function relativeLuminance(c: Rgba): number {
  function ch(v: number): number {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}

export function contrastRatio(a: Rgba, b: Rgba): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

// Standard "source-over" alpha compositing: top over bg, returning an
// RGBA with the resolved alpha. When fg is fully opaque the call is a
// no-op (returns top); when fg is fully transparent it returns bg.
export function compositeRgba(top: Rgba, bg: Rgba): Rgba {
  const a = top.a + bg.a * (1 - top.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (top.r * top.a + bg.r * bg.a * (1 - top.a)) / a,
    g: (top.g * top.a + bg.g * bg.a * (1 - top.a)) / a,
    b: (top.b * top.a + bg.b * bg.a * (1 - top.a)) / a,
    a,
  };
}

// Parse the typical `getComputedStyle` color string: rgb(r, g, b) or
// rgba(r, g, b, a). Browsers normalize named colors (`red`) and hex
// (`#ff0000`) to one of these on read; we don't have to handle the raw
// CSS surface area. Returns null on parse failure.
export function parseRgbColor(s: string): Rgba | null {
  if (typeof s !== "string") return null;
  const m =
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/.exec(s);
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  const a = m[4] === undefined ? 1 : Number(m[4]);
  if (![r, g, b, a].every(Number.isFinite)) return null;
  return { r, g, b, a };
}

// Returns the WCAG AA threshold for a given font-size + weight.
// Large text (>= 18 px OR >= 14 px bold) gets the relaxed 3:1 threshold;
// otherwise 4.5:1 applies.
export function wcagThreshold(fontSizePx: number, fontWeight: number): number {
  if (fontSizePx >= WCAG_LARGE_FONT_PX) return WCAG_AA_LARGE;
  if (fontSizePx >= WCAG_LARGE_BOLD_FONT_PX && fontWeight >= WCAG_BOLD_WEIGHT) {
    return WCAG_AA_LARGE;
  }
  return WCAG_AA_NORMAL;
}

// Pure evaluation: given an input struct, returns a deterministic list
// of warnings in canonical order (touch-target, text-size, aspect, contrast,
// overflow). Order matters for the host's chip render — when multiple
// warnings stack we show the highest-priority one first.
export function evaluateSoftConstraints(
  input: SoftConstraintInput
): SoftConstraintWarning[] {
  const out: SoftConstraintWarning[] = [];

  // 1. Touch target — interactive elements below 32 px on EITHER axis.
  // We don't gate on visibility because that's a hard constraint
  // (display:none / opacity:0 → element wouldn't be selectable by the
  // user in the first place).
  if (input.isInteractive) {
    const w = input.bounds.width;
    const h = input.bounds.height;
    const tooSmall = w < TOUCH_TARGET_MIN_PX || h < TOUCH_TARGET_MIN_PX;
    if (tooSmall && (w > 0 || h > 0)) {
      out.push({
        kind: "touch-target",
        severity: "warning",
        axis:
          w < TOUCH_TARGET_MIN_PX && h < TOUCH_TARGET_MIN_PX
            ? "both"
            : w < TOUCH_TARGET_MIN_PX
              ? "x"
              : "y",
        message: `Touch target ${Math.round(w)}×${Math.round(h)}px (min ${TOUCH_TARGET_MIN_PX}px)`,
      });
    }
  }

  // 2. Text size — only fires for elements that own text directly. A wrapper
  // <div> with a small font-size doesn't generate a warning unless one of
  // its children also has direct text below the threshold.
  if (
    input.hasDirectText &&
    input.fontSizePx > 0 &&
    input.fontSizePx < TEXT_SIZE_MIN_PX
  ) {
    out.push({
      kind: "text-size",
      severity: "warning",
      message: `Font size ${input.fontSizePx.toFixed(1)}px (min ${TEXT_SIZE_MIN_PX}px)`,
    });
  }

  // 3. Aspect ratio distortion — image rendered at a meaningfully different
  // ratio than its natural. Skip when natural is unknown (not yet loaded,
  // svg without ratio, video without dimensions).
  if (
    input.isImage &&
    input.naturalAspect !== null &&
    input.naturalAspect > 0 &&
    input.bounds.width > 0 &&
    input.bounds.height > 0
  ) {
    const current = input.bounds.width / input.bounds.height;
    const ratio = current / input.naturalAspect;
    if (
      ratio < 1 - ASPECT_DISTORTION_TOLERANCE ||
      ratio > 1 + ASPECT_DISTORTION_TOLERANCE
    ) {
      const naturalLabel = input.naturalAspect.toFixed(2);
      const currentLabel = current.toFixed(2);
      out.push({
        kind: "aspect-distorted",
        severity: "warning",
        message: `Aspect ${currentLabel}:1 (natural ${naturalLabel}:1)`,
      });
    }
  }

  // 4. WCAG AA contrast — only fires when we have BOTH a parsable foreground
  // AND an opaque background (chain resolution succeeded). Walks-up
  // resolution that hit a backgroundImage returns null bg → skipped (we
  // can't reason about gradients / images for v1).
  if (input.hasDirectText && input.fgColor && input.bgColor) {
    const composedFg =
      input.fgColor.a < 1
        ? compositeRgba(input.fgColor, input.bgColor)
        : input.fgColor;
    const ratio = contrastRatio(composedFg, input.bgColor);
    const threshold = wcagThreshold(input.fontSizePx, input.fontWeight);
    if (ratio + 0.001 < threshold) {
      // The +0.001 absorbs floating-point error so a "4.499:1 vs 4.5"
      // comparison doesn't fire a warning that's invisible to the human
      // eye. Won't matter for any case where the user really cares.
      out.push({
        kind: "contrast",
        severity: "warning",
        message: `Contrast ${ratio.toFixed(1)}:1 (WCAG AA ${threshold.toFixed(1)}:1)`,
      });
    }
  }

  // 5. Overflow vs parent. Fires when the element's bbox extends past the
  // parent's bbox by more than OVERFLOW_TOLERANCE_PX on either axis. We
  // don't differentiate "parent has overflow:hidden" from "parent has
  // overflow:visible" — either way the layout is broken in a way the
  // user almost certainly didn't intend.
  if (input.parentBounds) {
    const e = input.bounds;
    const p = input.parentBounds;
    const tol = OVERFLOW_TOLERANCE_PX;
    const overflowX = e.x < p.x - tol || e.x + e.width > p.x + p.width + tol;
    const overflowY = e.y < p.y - tol || e.y + e.height > p.y + p.height + tol;
    if (overflowX || overflowY) {
      out.push({
        kind: "overflow",
        severity: "warning",
        axis: overflowX && overflowY ? "both" : overflowX ? "x" : "y",
        message: "Overflows parent",
      });
    }
  }

  return out;
}
