// Named CSS patterns for the Background → Pattern mode in the inspector.
//
// Each pattern is a CSS background-image string parameterised by colour and
// scale. We keep two parallel representations:
//   • `css(...)` returns a value with normal spaces — used to preview the
//     pattern in a live thumbnail via inline style.
//   • `tailwindClasses(...)` returns class tokens with underscores substituted
//     for spaces, which is Tailwind's arbitrary-value syntax.
//
// Patterns are intentionally simple (just gradients) so they render instantly
// with no external assets and work inside the sandboxed preview iframe.

import { TAILWIND_PALETTE } from "./tailwind-palette";

export interface PatternOpts {
  color: string;      // 6- or 8-digit hex, e.g. #0F0F0F33
  scale: number;      // px
  baseColor?: string; // underlying bg-color (optional)
}

export interface PatternDef {
  id: string;
  label: string;
  css(opts: PatternOpts): { image: string; size: string };
}

function dots({ color, scale }: PatternOpts) {
  return {
    image: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`,
    size: `${scale}px ${scale}px`,
  };
}

function grid({ color, scale }: PatternOpts) {
  return {
    image:
      `linear-gradient(${color} 1px, transparent 1px),` +
      `linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    size: `${scale}px ${scale}px`,
  };
}

function diagonal({ color, scale }: PatternOpts) {
  return {
    image:
      `repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${scale}px)`,
    size: "auto",
  };
}

function horizontal({ color, scale }: PatternOpts) {
  return {
    image:
      `repeating-linear-gradient(0deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${scale}px)`,
    size: "auto",
  };
}

function vertical({ color, scale }: PatternOpts) {
  return {
    image:
      `repeating-linear-gradient(90deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${scale}px)`,
    size: "auto",
  };
}

function cross({ color, scale }: PatternOpts) {
  return {
    image:
      `repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${scale}px),` +
      `repeating-linear-gradient(-45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${scale}px)`,
    size: "auto",
  };
}

export const PATTERNS: PatternDef[] = [
  { id: "dots", label: "Dots", css: dots },
  { id: "grid", label: "Grid", css: grid },
  { id: "diagonal", label: "Diagonal", css: diagonal },
  { id: "horizontal", label: "Horizontal", css: horizontal },
  { id: "vertical", label: "Vertical", css: vertical },
  { id: "cross", label: "Cross", css: cross },
];

export function getPattern(id: string): PatternDef | undefined {
  return PATTERNS.find((p) => p.id === id);
}

// Build the Tailwind class tokens for a given pattern. Returns multiple
// classes: the image (arbitrary gradient), the size (when non-auto), and
// optionally a base colour layered under the pattern.
export function tailwindClassesForPattern(
  pattern: PatternDef,
  opts: PatternOpts
): string[] {
  const { image, size } = pattern.css(opts);
  const classes: string[] = [];
  classes.push(`bg-[${toArbitraryValue(image)}]`);
  if (size !== "auto") classes.push(`bg-[length:${toArbitraryValue(size)}]`);
  if (opts.baseColor) classes.push(`bg-[color:${opts.baseColor}]`);
  return classes;
}

// Build Tailwind classes for an image background (optionally with a coloured
// overlay rendered via a layered linear-gradient so the user controls both
// tint and opacity via one hex value with an alpha byte).
export interface ImageBgOpts {
  url: string;
  fit: "cover" | "contain" | "auto";
  position:
    | "center"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  overlayHex8?: string; // 8-digit hex (#RRGGBBAA); omit for no overlay
}

export function tailwindClassesForImage(opts: ImageBgOpts): string[] {
  const { url, fit, position, overlayHex8 } = opts;
  const classes: string[] = [];
  const image = overlayHex8
    ? `linear-gradient(${overlayHex8},${overlayHex8}),url('${url}')`
    : `url('${url}')`;
  classes.push(`bg-[${toArbitraryValue(image)}]`);
  if (fit === "cover") classes.push("bg-cover");
  else if (fit === "contain") classes.push("bg-contain");
  else classes.push("bg-auto");
  classes.push(positionToClass(position));
  classes.push("bg-no-repeat");
  return classes;
}

function positionToClass(p: ImageBgOpts["position"]): string {
  switch (p) {
    case "top":
      return "bg-top";
    case "right":
      return "bg-right";
    case "bottom":
      return "bg-bottom";
    case "left":
      return "bg-left";
    case "top-left":
      return "bg-left-top";
    case "top-right":
      return "bg-right-top";
    case "bottom-left":
      return "bg-left-bottom";
    case "bottom-right":
      return "bg-right-bottom";
    case "center":
    default:
      return "bg-center";
  }
}

// Tailwind arbitrary-value syntax requires no literal whitespace. We also
// strip tabs / newlines just in case a pattern definition grows to multi-line.
function toArbitraryValue(css: string): string {
  return css.replace(/[\s\n\t]+/g, "_");
}

// Pack a 6-digit hex + 0..1 alpha into an 8-digit hex (#RRGGBBAA), the
// most compact form that works across browsers and survives Tailwind's
// arbitrary-value parser.
export function hexWithAlpha(hex: string, alpha: number): string {
  const clean = hex.startsWith("#") ? hex.slice(1) : hex;
  const a = Math.max(0, Math.min(1, alpha));
  const aByte = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
  if (clean.length === 3) {
    const r = clean[0] + clean[0];
    const g = clean[1] + clean[1];
    const b = clean[2] + clean[2];
    return `#${r}${g}${b}${aByte}`;
  }
  return `#${clean.slice(0, 6).toUpperCase()}${aByte}`;
}

export function parseHex8(hex: string): { base: string; alpha: number } | null {
  const m = hex.match(/^#([0-9a-fA-F]{8})$/);
  if (!m) return null;
  const raw = m[1];
  const base = `#${raw.slice(0, 6).toUpperCase()}`;
  const alpha = parseInt(raw.slice(6, 8), 16) / 255;
  return { base, alpha };
}

// --- gradient (Tailwind native bg-gradient-to-*) ---------------------------

export const GRADIENT_DIRECTIONS = [
  "t", "tr", "r", "br", "b", "bl", "l", "tl",
] as const;

export type GradientDirection = (typeof GRADIENT_DIRECTIONS)[number];

export interface GradientOpts {
  direction: GradientDirection;
  fromHex: string;
  fromAlpha: number; // 0..100
  viaHex?: string;
  viaAlpha?: number; // 0..100
  toHex: string;
  toAlpha: number; // 0..100
}

// Encode a hex+alpha pair as a Tailwind arbitrary stop value: prefer the
// `from-[#hex]/N` shorthand when alpha is 0..100 (renders with Tailwind's
// alpha blender) but inline 8-digit hex when alpha already came in as
// 100 to keep the source compact.
function stopClass(prefix: "from" | "via" | "to", hex: string, alpha: number): string {
  const upper = hex.toUpperCase();
  if (alpha >= 100) return `${prefix}-[${upper}]`;
  return `${prefix}-[${upper}]/${Math.round(alpha)}`;
}

export function tailwindClassesForGradient(opts: GradientOpts): string[] {
  const out: string[] = [`bg-gradient-to-${opts.direction}`];
  out.push(stopClass("from", opts.fromHex, opts.fromAlpha));
  if (opts.viaHex) {
    out.push(stopClass("via", opts.viaHex, opts.viaAlpha ?? 100));
  }
  out.push(stopClass("to", opts.toHex, opts.toAlpha));
  return out;
}

export interface DetectedGradient {
  direction: GradientDirection;
  fromHex: string;   // 6-digit, uppercase, leading #
  fromAlpha: number; // 0..100
  viaHex: string | null;
  viaAlpha: number;
  toHex: string;
  toAlpha: number;
}

// Stop class shapes accepted on the way in:
//   from-[#hex]               6 or 8 digit, alpha defaults to 100 / 8th byte
//   from-[#hex]/N             with explicit /N suffix (overrides 8th byte)
//   from-<palette>-<shade>    palette names — resolved via tailwind-palette
//   from-<palette>-<shade>/N  palette + alpha
const STOP_RE = /^(from|via|to)-(?:\[#([0-9a-fA-F]{3,8})\]|([a-z]+(?:-\d+)?))(?:\/(\d+))?$/;

function decodeStop(cls: string): {
  pos: "from" | "via" | "to";
  hex: string;
  alpha: number;
} | null {
  const m = cls.match(STOP_RE);
  if (!m) return null;
  const pos = m[1] as "from" | "via" | "to";
  const arbHex = m[2];
  const palette = m[3];
  const suffix = m[4];

  let hex: string;
  let alpha = 100;
  if (arbHex) {
    let raw = arbHex;
    if (raw.length === 3) raw = raw.split("").map((c) => c + c).join("");
    if (raw.length === 8) {
      hex = `#${raw.slice(0, 6).toUpperCase()}`;
      alpha = Math.round((parseInt(raw.slice(6, 8), 16) / 255) * 100);
    } else if (raw.length === 6) {
      hex = `#${raw.toUpperCase()}`;
    } else {
      return null;
    }
  } else if (palette) {
    const lookup = TAILWIND_PALETTE[palette];
    if (!lookup) return null;
    hex = lookup;
  } else {
    return null;
  }

  if (suffix) {
    const n = Number(suffix);
    if (Number.isFinite(n)) alpha = Math.max(0, Math.min(100, n));
  }
  return { pos, hex, alpha };
}

export function parseGradientClasses(
  classes: ReadonlyArray<string>
): DetectedGradient | null {
  let direction: GradientDirection | null = null;
  let from: { hex: string; alpha: number } | null = null;
  let via: { hex: string; alpha: number } | null = null;
  let to: { hex: string; alpha: number } | null = null;

  for (const c of classes) {
    const dirM = c.match(/^bg-gradient-to-(t|tr|r|br|b|bl|l|tl)$/);
    if (dirM) {
      direction = dirM[1] as GradientDirection;
      continue;
    }
    const stop = decodeStop(c);
    if (!stop) continue;
    if (stop.pos === "from") from = { hex: stop.hex, alpha: stop.alpha };
    else if (stop.pos === "via") via = { hex: stop.hex, alpha: stop.alpha };
    else if (stop.pos === "to") to = { hex: stop.hex, alpha: stop.alpha };
  }

  if (!direction || !from || !to) return null;

  return {
    direction,
    fromHex: from.hex,
    fromAlpha: from.alpha,
    viaHex: via?.hex ?? null,
    viaAlpha: via?.alpha ?? 100,
    toHex: to.hex,
    toAlpha: to.alpha,
  };
}

// --- pattern round-trip ---------------------------------------------------

export interface DetectedPattern {
  patternId: PatternDef["id"];
  /** Always 6-digit (#RRGGBB) — alpha lives in `strokeAlpha`. */
  strokeHex: string;
  /** 0..100 (matches the slider scale used by the editor). */
  strokeAlpha: number;
  /** px size shown in the editor's scale slider. Patterns without an
   * explicit `bg-[length:...]` (diagonal / horizontal / vertical / cross)
   * report the value parsed from inside the gradient itself. */
  scale: number;
  /** 6- or 8-digit hex if a `bg-[color:#abc]` class accompanied the
   * pattern. Always uppercase. */
  baseHex: string | null;
}

// Hex bytes inside a gradient may show up as 6-digit (`#0F0F0F`) or
// 8-digit (`#0F0F0F33`). Either is normalized to {hex6, alpha0to100}.
function normalizeColor(raw: string): { hex: string; alpha: number } | null {
  const s = raw.startsWith("#") ? raw : `#${raw}`;
  const m = s.match(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (!m) return null;
  const hex = m[1];
  if (hex.length === 6) {
    return { hex: `#${hex.toUpperCase()}`, alpha: 100 };
  }
  const base = `#${hex.slice(0, 6).toUpperCase()}`;
  const alpha = Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100);
  return { hex: base, alpha };
}

// Each entry below mirrors a function in `PATTERNS` above. Build regexes
// against the underscore-flavored arbitrary-value form (since that's what
// ends up in source after `toArbitraryValue` strips whitespace). Captures:
//   1: color literal (6- or 8-digit hex)
//   2: scale (px) — only for the inline-scale patterns; `null` for grid
//   `lengthFromSize` flag controls whether the `bg-[length:...]` class is
//   the source of truth for `scale` instead.
const HEX = "#[0-9a-fA-F]{6,8}";
const PATTERN_MATCHERS: ReadonlyArray<{
  id: PatternDef["id"];
  re: RegExp;
  scaleFromSize: boolean;
}> = [
  {
    id: "dots",
    re: new RegExp(
      "^radial-gradient\\(circle_at_1px_1px,_(" + HEX + ")_1px,_transparent_0\\)$"
    ),
    scaleFromSize: true,
  },
  {
    id: "grid",
    re: new RegExp(
      "^linear-gradient\\((" + HEX + ")_1px,_transparent_1px\\)," +
        "linear-gradient\\(90deg,_(" + HEX + ")_1px,_transparent_1px\\)$"
    ),
    scaleFromSize: true,
  },
  {
    id: "cross",
    re: new RegExp(
      "^repeating-linear-gradient\\(45deg,_(" + HEX + ")_0,_" + HEX + "_1px,_transparent_1px,_transparent_(\\d+)px\\)," +
        "repeating-linear-gradient\\(-45deg,_" + HEX + "_0,_" + HEX + "_1px,_transparent_1px,_transparent_\\d+px\\)$"
    ),
    scaleFromSize: false,
  },
  {
    id: "diagonal",
    re: new RegExp(
      "^repeating-linear-gradient\\(45deg,_(" + HEX + ")_0,_" + HEX + "_1px,_transparent_1px,_transparent_(\\d+)px\\)$"
    ),
    scaleFromSize: false,
  },
  {
    id: "horizontal",
    re: new RegExp(
      "^repeating-linear-gradient\\(0deg,_(" + HEX + ")_0,_" + HEX + "_1px,_transparent_1px,_transparent_(\\d+)px\\)$"
    ),
    scaleFromSize: false,
  },
  {
    id: "vertical",
    re: new RegExp(
      "^repeating-linear-gradient\\(90deg,_(" + HEX + ")_0,_" + HEX + "_1px,_transparent_1px,_transparent_(\\d+)px\\)$"
    ),
    scaleFromSize: false,
  },
];

const BG_LENGTH_RE = /^bg-\[length:(\d+)px_(\d+)px\]$/;
const BG_COLOR_RE = /^bg-\[color:(#[0-9a-fA-F]{3,8})\]$/;

/**
 * Reverse of `tailwindClassesForPattern`. Walks a class list, finds the
 * `bg-[<gradient>]` + matching `bg-[length:...]` + optional `bg-[color:...]`
 * trio, and returns the editor state needed to re-display them in the
 * Pattern tab. ROADMAP §4.3 #17 — without this, opening a template with a
 * custom pattern reverts to "dots" on first interaction.
 *
 * Returns null when nothing in the class list looks like a known pattern.
 * Custom user-written gradients (i.e. patterns that don't match one of our
 * 6 templates byte-for-byte) also return null — the editor then falls back
 * to the "dots" default and any subsequent edit will overwrite the custom
 * gradient. That's acceptable v1 (and matches today's behaviour).
 */
export function parsePatternClasses(
  classes: ReadonlyArray<string>
): DetectedPattern | null {
  let imageInner: string | null = null;
  let sizeScale: number | null = null;
  let baseHex: string | null = null;
  for (const c of classes) {
    // bg-[<gradient or color>] vs bg-[length:...] vs bg-[color:...]. The
    // bracketed form is layered: first match wins for image, separate
    // captures for length and color modifiers. Note the order — match
    // length / color forms BEFORE the bare bracketed form so we don't
    // misclassify them as gradients.
    const lenM = c.match(BG_LENGTH_RE);
    if (lenM) {
      const a = Number(lenM[1]);
      const b = Number(lenM[2]);
      if (a === b) sizeScale = a;
      continue;
    }
    const colM = c.match(BG_COLOR_RE);
    if (colM) {
      baseHex = colM[1].toUpperCase();
      continue;
    }
    if (c.startsWith("bg-[") && c.endsWith("]")) {
      const inner = c.slice(4, -1);
      // Bare colors (`bg-[#hex]`) and url-image patterns aren't gradients.
      if (inner.startsWith("#")) continue;
      if (inner.startsWith("url(")) continue;
      if (imageInner === null) imageInner = inner;
    }
  }
  if (!imageInner) return null;

  for (const matcher of PATTERN_MATCHERS) {
    const m = imageInner.match(matcher.re);
    if (!m) continue;
    const colorRaw = m[1];
    const color = normalizeColor(colorRaw);
    if (!color) continue;
    let scale: number;
    if (matcher.scaleFromSize) {
      if (sizeScale === null) continue;
      scale = sizeScale;
    } else {
      scale = Number(m[2]);
      if (!Number.isFinite(scale)) continue;
    }
    return {
      patternId: matcher.id,
      strokeHex: color.hex,
      strokeAlpha: color.alpha,
      scale,
      baseHex,
    };
  }
  return null;
}
