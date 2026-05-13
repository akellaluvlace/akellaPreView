// Scale maps and class helpers for the slider-based inspector.
//
// Each "ScaleProp" describes one Tailwind property:
//   scale    — ordered list of scale values (slider indices map 1:1 to these)
//   match    — regex/predicate that identifies a class as belonging to this
//              property (used to remove the old class before applying the new)
//   toClass  — builds the class string from a scale value
//
// The inspector computes the current slider index by scanning `classes` for
// anything matching `match` and finding its position in `scale`. Dragging the
// slider produces a new classes array: old match removed, new class pushed.

export interface ScaleProp {
  scale: string[];
  match: RegExp;
  toClass: (value: string) => string;
}

// --- spacing (padding / margin / gap) -----------------------------------

// Full Tailwind spacing scale. Values with "." need to be written as-is
// (p-0.5, m-1.5). Negative values are added as a separate sign toggle for
// margin sliders.
export const SPACING = [
  "0",
  "px",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
];

function spacingRe(prefix: string): RegExp {
  // Matches prefix-0, prefix-px, prefix-0.5, prefix-[12px], etc.
  return new RegExp(`^${escapeRe(prefix)}-(?:px|\\d+(?:\\.\\d+)?|\\[[^\\]]+\\])$`);
}

export function spacingProp(prefix: string): ScaleProp {
  return {
    scale: SPACING,
    match: spacingRe(prefix),
    toClass: (v) => `${prefix}-${v}`,
  };
}

// --- typography ---------------------------------------------------------

export const FONT_SIZES = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];

export const FONT_SIZE: ScaleProp = {
  scale: FONT_SIZES,
  match: /^text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
  toClass: (v) => `text-${v}`,
};

export const FONT_WEIGHTS = [
  "thin",
  "extralight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
];

export const FONT_WEIGHT: ScaleProp = {
  scale: FONT_WEIGHTS,
  match: /^font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  toClass: (v) => `font-${v}`,
};

export const LINE_HEIGHTS = ["none", "tight", "snug", "normal", "relaxed", "loose"];

export const LINE_HEIGHT: ScaleProp = {
  scale: LINE_HEIGHTS,
  match: /^leading-(?:none|tight|snug|normal|relaxed|loose|\d+(?:\.\d+)?)$/,
  toClass: (v) => `leading-${v}`,
};

export const TRACKINGS = ["tighter", "tight", "normal", "wide", "wider", "widest"];

export const TRACKING: ScaleProp = {
  scale: TRACKINGS,
  match: /^tracking-(?:tighter|tight|normal|wide|wider|widest)$/,
  toClass: (v) => `tracking-${v}`,
};

export const TEXT_ALIGNS = ["left", "center", "right", "justify"] as const;
export type TextAlign = (typeof TEXT_ALIGNS)[number];

export const TEXT_ALIGN_MATCH = /^text-(?:left|center|right|justify)$/;
export const textAlignClass = (v: TextAlign) => `text-${v}`;

// --- border & effects ---------------------------------------------------

// Radius: "" placeholder means plain `rounded`; "none" is `rounded-none`.
export const RADII = [
  "none",
  "sm",
  "",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "full",
];

export const RADIUS: ScaleProp = {
  scale: RADII,
  match: /^rounded(?:-(?:none|sm|md|lg|xl|2xl|3xl|full))?$/,
  toClass: (v) => (v === "" ? "rounded" : `rounded-${v}`),
};

// Border width: "" means plain `border` (1px); numeric values 0/2/4/8.
export const BORDER_WIDTHS = ["0", "", "2", "4", "8"];

export const BORDER_WIDTH: ScaleProp = {
  scale: BORDER_WIDTHS,
  match: /^border(?:-(?:0|2|4|8))?$/,
  toClass: (v) => (v === "" ? "border" : `border-${v}`),
};

export const SHADOWS = [
  "none",
  "sm",
  "",
  "md",
  "lg",
  "xl",
  "2xl",
  "inner",
];

export const SHADOW: ScaleProp = {
  scale: SHADOWS,
  match: /^shadow(?:-(?:none|sm|md|lg|xl|2xl|inner))?$/,
  toClass: (v) => (v === "" ? "shadow" : `shadow-${v}`),
};

export const OPACITIES = [
  "0",
  "5",
  "10",
  "20",
  "25",
  "30",
  "40",
  "50",
  "60",
  "70",
  "75",
  "80",
  "90",
  "95",
  "100",
];

export const OPACITY: ScaleProp = {
  scale: OPACITIES,
  match: /^opacity-(?:0|5|10|15|20|25|30|40|50|60|70|75|80|90|95|100)$/,
  toClass: (v) => `opacity-${v}`,
};

// --- layout -------------------------------------------------------------

export const DISPLAYS = [
  "block",
  "inline-block",
  "inline",
  "flex",
  "inline-flex",
  "grid",
  "inline-grid",
  "hidden",
] as const;
export type Display = (typeof DISPLAYS)[number];

export const DISPLAY_MATCH = /^(?:block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden)$/;
export const displayClass = (v: Display) => v;

export const FLEX_DIRECTIONS = ["row", "row-reverse", "col", "col-reverse"] as const;
export type FlexDirection = (typeof FLEX_DIRECTIONS)[number];

export const FLEX_DIRECTION_MATCH = /^flex-(?:row|row-reverse|col|col-reverse)$/;
export const flexDirectionClass = (v: FlexDirection) => `flex-${v}`;

export const JUSTIFY = ["start", "center", "end", "between", "around", "evenly"] as const;
export type Justify = (typeof JUSTIFY)[number];

export const JUSTIFY_MATCH = /^justify-(?:start|center|end|between|around|evenly)$/;
export const justifyClass = (v: Justify) => `justify-${v}`;

export const ALIGN = ["start", "center", "end", "baseline", "stretch"] as const;
export type Align = (typeof ALIGN)[number];

export const ALIGN_MATCH = /^items-(?:start|center|end|baseline|stretch)$/;
export const alignClass = (v: Align) => `items-${v}`;

// --- size presets -------------------------------------------------------

export const WIDTH_PRESETS = [
  "auto",
  "1/4",
  "1/3",
  "1/2",
  "2/3",
  "3/4",
  "full",
  "fit",
  "screen",
] as const;
export type WidthPreset = (typeof WIDTH_PRESETS)[number];

export const WIDTH_MATCH = /^w-(?:auto|full|fit|screen|min|max|\d+|\d+\/\d+|\[[^\]]+\])$/;
export const widthClass = (v: WidthPreset) => `w-${v}`;

export const HEIGHT_PRESETS = [
  "auto",
  "1/4",
  "1/3",
  "1/2",
  "2/3",
  "3/4",
  "full",
  "fit",
  "screen",
] as const;
export type HeightPreset = (typeof HEIGHT_PRESETS)[number];

export const HEIGHT_MATCH = /^h-(?:auto|full|fit|screen|min|max|\d+|\d+\/\d+|\[[^\]]+\])$/;
export const heightClass = (v: HeightPreset) => `h-${v}`;

// --- breakpoint helpers --------------------------------------------------

// Phase 5 / A6: every read/write helper here accepts an optional `bp` prefix
// like "sm:" or "md:". When non-empty, READS look at prefixed classes first
// and fall back to unprefixed (Tailwind cascades unprefixed to all sizes).
// WRITES prepend the prefix; if the resulting prefixed value matches an
// existing unprefixed class verbatim, the write is suppressed (redundant).
// Default `""` preserves today's behaviour for callers that don't know about
// breakpoints (BackgroundEditor's `stripAllBg`, etc).
export type Breakpoint = "mobile" | "tablet" | "desktop";

export function breakpointPrefix(bp: Breakpoint): string {
  if (bp === "mobile") return "sm:";
  if (bp === "tablet") return "md:";
  return "";
}

function bpStrip(cls: string, bp: string): string | null {
  if (!bp) return cls;
  return cls.startsWith(bp) ? cls.slice(bp.length) : null;
}

// --- color prefix matchers (for the color pickers) ----------------------

// Match any class that assigns the given prefix to a palette or arbitrary hex.
// We strip ALL of them when the user picks a new color, then push the new one.
// `bp` (e.g. "sm:") restricts the match to that breakpoint's variants only.
export function colorMatch(
  prefix: "bg" | "text" | "border" | "ring",
  bp: string = ""
): RegExp {
  const bpPart = bp ? escapeRe(bp) : "";
  return new RegExp(
    `^${bpPart}${prefix}-(?:transparent|current|black|white|` +
      `(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)` +
      `-(?:50|100|200|300|400|500|600|700|800|900|950)|` +
      `\\[[^\\]]+\\])$`,
  );
}

// --- helpers: read / set / unset a ScaleProp on a classes array ---------

export function currentIndex(
  classes: string[],
  prop: ScaleProp,
  bp: string = "",
): number {
  if (bp) {
    for (const c of classes) {
      const body = bpStrip(c, bp);
      if (body === null) continue;
      if (!prop.match.test(body)) continue;
      const idx = prop.scale.findIndex((v) => prop.toClass(v) === body);
      if (idx >= 0) return idx;
    }
  }
  for (const c of classes) {
    if (!prop.match.test(c)) continue;
    const idx = prop.scale.findIndex((v) => prop.toClass(v) === c);
    if (idx >= 0) return idx;
  }
  return -1;
}

export function setScale(
  classes: string[],
  prop: ScaleProp,
  idx: number,
  bp: string = "",
): string[] {
  if (idx < 0 || idx >= prop.scale.length) {
    return unsetScale(classes, prop, bp);
  }
  const body = prop.toClass(prop.scale[idx]);
  if (!bp) {
    const filtered = classes.filter((c) => !prop.match.test(c));
    filtered.push(body);
    return filtered;
  }
  // Strip only the prefixed variant; leave unprefixed cascade intact.
  const filtered = classes.filter((c) => {
    const stripped = bpStrip(c, bp);
    if (stripped === null) return true;
    return !prop.match.test(stripped);
  });
  // Redundancy: if an unprefixed class already encodes the same value,
  // a prefixed write would be no-op. Suppress.
  if (filtered.includes(body)) return filtered;
  filtered.push(bp + body);
  return filtered;
}

export function unsetScale(
  classes: string[],
  prop: ScaleProp,
  bp: string = "",
): string[] {
  if (!bp) return classes.filter((c) => !prop.match.test(c));
  return classes.filter((c) => {
    const stripped = bpStrip(c, bp);
    if (stripped === null) return true;
    return !prop.match.test(stripped);
  });
}

// Generic "replace any class matching this regex with <newClass>" for
// segmented controls (align, display, etc).
export function setToken(
  classes: string[],
  match: RegExp,
  newClass: string | null,
  bp: string = "",
): string[] {
  if (!bp) {
    const filtered = classes.filter((c) => !match.test(c));
    if (newClass) filtered.push(newClass);
    return filtered;
  }
  const filtered = classes.filter((c) => {
    const stripped = bpStrip(c, bp);
    if (stripped === null) return true;
    return !match.test(stripped);
  });
  if (newClass) {
    if (!filtered.includes(newClass)) filtered.push(bp + newClass);
  }
  return filtered;
}

// Pick a hex (or null) from any "bg-[#abc]" / "text-[#abcdef]" arbitrary class
// at the given prefix. Returns null if the current class is a palette value
// (the color picker still works; it just won't pre-fill).
export function pickArbitraryHex(
  classes: string[],
  prefix: "bg" | "text" | "border" | "ring",
  bp: string = "",
): string | null {
  const candidates = bp ? [bp + prefix, prefix] : [prefix];
  for (const head of candidates) {
    for (const c of classes) {
      const m = c.match(
        new RegExp(`^${escapeRe(head)}-\\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\]$`),
      );
      if (m) return `#${m[1]}`;
    }
  }
  return null;
}

// Broad match for anything that contributes to the element's painted
// background (colour, image, gradient, pattern, size, position, repeat,
// attachment, gradient stops). We keep `bg-blend-*`, `bg-clip-*` and
// `bg-origin-*` because those are compositing modifiers, not the paint itself,
// and a user likely wants them preserved when they swap between solid colour
// / pattern / image modes.
function bgRelatedClass(c: string): boolean {
  if (c.startsWith("bg-blend-") || c.startsWith("bg-clip-") || c.startsWith("bg-origin-")) return false;
  if (c.startsWith("bg-")) return true;
  if (/^from-[\w\[#/.\]-]+$/.test(c)) return true;
  if (/^via-[\w\[#/.\]-]+$/.test(c)) return true;
  if (/^to-[\w\[#/.\]-]+$/.test(c)) return true;
  return false;
}

// Exported so the BackgroundEditor can swap modes cleanly (strip everything
// the previous mode added, then push its own classes). `bp` filters to a
// breakpoint variant — passing "" (default) keeps today's whole-cascade
// strip used by BackgroundEditor mode swaps.
export function stripAllBg(classes: string[], bp: string = ""): string[] {
  if (!bp) return classes.filter((c) => !bgRelatedClass(c));
  return classes.filter((c) => {
    const stripped = bpStrip(c, bp);
    if (stripped === null) return true;
    return !bgRelatedClass(stripped);
  });
}

function stripColor(
  classes: string[],
  prefix: "bg" | "text" | "border" | "ring",
  bp: string = "",
): string[] {
  if (prefix === "bg") return stripAllBg(classes, bp);
  return classes.filter((c) => !colorMatch(prefix, bp).test(c));
}

export function setColorClass(
  classes: string[],
  prefix: "bg" | "text" | "border" | "ring",
  hex: string,
  bp: string = "",
): string[] {
  const filtered = stripColor(classes, prefix, bp);
  const body = `${prefix}-[${hex}]`;
  if (bp) {
    if (filtered.includes(body)) return filtered;
    filtered.push(bp + body);
  } else {
    filtered.push(body);
  }
  return filtered;
}

export function unsetColorClass(
  classes: string[],
  prefix: "bg" | "text" | "border" | "ring",
  bp: string = "",
): string[] {
  return stripColor(classes, prefix, bp);
}

// --- misc ---------------------------------------------------------------

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
