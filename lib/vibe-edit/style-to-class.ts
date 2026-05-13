// JSX-mode style persistence translator. Converts vibe-edit's inline-
// style mutations (color / bg / radius) into Tailwind arbitrary-value
// class writes so the edit survives a reload — React rejects string-
// valued style props, so the style attribute we write to the iframe
// DOM via `vibe:update-style` doesn't make it through to the source.
//
// The flow:
//   1. User picks a colour / drags a slider → iframe DOM updates inline
//      style + re-emits info with new computed values.
//   2. Workspace's idle commit detects drift on textColor / bgColor /
//      borderRadius vs the baseline, builds a delta, and calls
//      buildVibeCommit({mode:"jsx", styleDelta}).
//   3. buildVibeCommit calls mergeStyleDeltaIntoClasses to produce the
//      new className value, then patches via patchJsxClassByOid.
//
// Strip rules:
//   - color → strip palette text colours, named (current / transparent
//     / black / white), and existing arbitrary text-[#...] tokens.
//     Preserves text-{size}, text-{align}, text-balance / text-pretty.
//   - backgroundColor → strip palette bg colours + named + arbitrary
//     bg-[#...]. Preserves bg-cover / bg-contain / bg-no-repeat /
//     bg-{position} / bg-clip-* / bg-blend-* / bg-origin-*.
//   - borderRadius → strip every rounded* class (named + arbitrary +
//     directional) since the user's intent is "set all corners".
//
// transparent / 0px → strip without adding (the absence of the class
// IS the no-styling state).

export interface StyleDelta {
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
}

export interface MergeResult {
  classes: string;
  changed: boolean;
}

// Match a color class regardless of variant prefixes (sm:, hover:,
// dark:, group-hover:, md:hover:, …). The vibecoder picks a single
// colour from the unprefixed picker and expects ALL state/breakpoint
// variants to follow — otherwise the new base colour gets overridden
// by a leftover `hover:text-red-500` on hover, which is exactly the
// "wrong colour" failure mode users were hitting. `colorMatch` from
// tailwind-slider-maps anchors on the unprefixed form only (it's
// built for the FocusEditor's per-breakpoint flow); we need a broader
// strip here so it lives locally.
const PALETTE_FAMILIES =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const PALETTE_SHADES = "50|100|200|300|400|500|600|700|800|900|950";

function colorVariantMatcher(prefix: "text" | "bg"): RegExp {
  return new RegExp(
    `^(?:[\\w-]+:)*${prefix}-(?:transparent|current|black|white|` +
      `(?:${PALETTE_FAMILIES})-(?:${PALETTE_SHADES})|` +
      `\\[[^\\]]+\\])(?:\\/[0-9]+)?$`,
  );
}

const TEXT_COLOR_MATCH = colorVariantMatcher("text");
const BG_COLOR_MATCH = colorVariantMatcher("bg");
// Anything starting with `rounded` (bare, named, directional, corner,
// arbitrary), with optional leading variant prefixes. Caller's intent
// on a borderRadius write is "set all corners to N", so we wipe every
// rounded* token including hover:/md:/dark: variants.
const ROUNDED_MATCH = /^(?:[\w-]+:)*rounded(?:-[\w[\]#%./-]+)*$/;

const REM_TO_PX = 16;

export function mergeStyleDeltaIntoClasses(
  delta: StyleDelta,
  currentClasses: string,
): MergeResult {
  const tokens = (currentClasses || "")
    .split(/\s+/)
    .filter((t) => t.length > 0);
  let next = tokens.slice();
  let changed = false;

  // Color → text-[#hex]
  if (typeof delta.color === "string") {
    const action = colorAction(delta.color);
    if (action !== "skip") {
      const before = next.length;
      next = next.filter((c) => !TEXT_COLOR_MATCH.test(c));
      if (action.kind === "add") next.push(action.cls);
      if (next.length !== before || action.kind === "add") {
        // Strip + add: changed iff any token was removed OR a new one
        // was appended that wasn't already present.
        changed = changed || next.length !== before;
        if (action.kind === "add" && !tokens.includes(action.cls)) {
          changed = true;
        }
      }
    }
  }

  // Background → bg-[#hex]
  if (typeof delta.backgroundColor === "string") {
    const action = colorAction(delta.backgroundColor, "bg");
    if (action !== "skip") {
      const before = next.length;
      next = next.filter((c) => !BG_COLOR_MATCH.test(c));
      if (action.kind === "add") next.push(action.cls);
      changed = changed || next.length !== before;
      if (action.kind === "add" && !tokens.includes(action.cls)) {
        changed = true;
      }
    }
  }

  // Border radius → rounded-[Npx]
  if (typeof delta.borderRadius === "string") {
    const action = radiusAction(delta.borderRadius);
    if (action !== "skip") {
      const before = next.length;
      next = next.filter((c) => !ROUNDED_MATCH.test(c));
      if (action.kind === "add") next.push(action.cls);
      changed = changed || next.length !== before;
      if (action.kind === "add" && !tokens.includes(action.cls)) {
        changed = true;
      }
    }
  }

  return {
    classes: next.join(" "),
    changed,
  };
}

// ---- helpers ----------------------------------------------------------

type Action =
  | "skip"            // unparseable / empty input — leave classes alone
  | { kind: "strip" } // value was transparent / 0 — remove existing, add nothing
  | { kind: "add"; cls: string };

function colorAction(input: string, prefix: "text" | "bg" = "text"): Action {
  if (!input) return "skip";
  const trimmed = input.trim();
  if (!trimmed) return "skip";
  if (
    trimmed === "transparent" ||
    /^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/i.test(trimmed)
  ) {
    return { kind: "strip" };
  }
  const norm = normalizeToHex(trimmed);
  if (!norm) {
    // Named CSS colors ('red', 'currentColor', 'inherit'), CSS variables
    // (var(--brand)), and any non-hex/non-rgb string fall here. The
    // picker shows the colour visually but the source never picks it up.
    // console.debug gives devs a breadcrumb without surfacing a toast to
    // vibecoders.
    debugSkip("colour", trimmed);
    return "skip";
  }
  // Tailwind's arbitrary-color-with-opacity form is `text-[#hex]/N`
  // where N is the opacity percentage (0-100). For full opacity we
  // emit the bare arbitrary class — adding `/100` works but reads as
  // noise. Pre-Phase-3 the alpha was dropped silently which gave the
  // vibecoder the "editor ate my opacity" pattern (SF-M2).
  const cls =
    norm.opacityPct >= 100
      ? `${prefix}-[${norm.hex}]`
      : `${prefix}-[${norm.hex}]/${norm.opacityPct}`;
  return { kind: "add", cls };
}

function radiusAction(input: string): Action {
  if (!input) return "skip";
  const trimmed = input.trim();
  if (!trimmed) return "skip";
  const px = parseRadiusPx(trimmed);
  if (px === null) {
    // calc(), em, %, vh, and any other non-px/non-rem unit fall here.
    // Computed-style from the iframe usually emits px, but a hand-edited
    // inline style could send `2em` through. Surface for diagnosis.
    debugSkip("radius", trimmed);
    return "skip";
  }
  if (px === 0) return { kind: "strip" };
  return { kind: "add", cls: `rounded-[${px}px]` };
}

function debugSkip(kind: "colour" | "radius", value: string): void {
  if (typeof console !== "undefined" && console.debug) {
    console.debug(`[vibe-edit:style-to-class] unparseable ${kind}, skipping:`, value);
  }
}

interface NormalizedColor {
  hex: string;        // "#rrggbb" lowercase, 6 digits, no alpha byte
  opacityPct: number; // 0-100 integer, 100 = fully opaque
}

function normalizeToHex(input: string): NormalizedColor | null {
  // 3-digit hex
  let m = input.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (m) {
    return {
      hex: ("#" + m[1] + m[1] + m[2] + m[2] + m[3] + m[3]).toLowerCase(),
      opacityPct: 100,
    };
  }
  // 6-digit hex
  m = input.match(/^#([0-9a-f]{6})$/i);
  if (m) return { hex: ("#" + m[1]).toLowerCase(), opacityPct: 100 };
  // 8-digit hex (rgba). Alpha byte → opacity percent. 0xff = 255 = 100%.
  m = input.match(/^#([0-9a-f]{6})([0-9a-f]{2})$/i);
  if (m) {
    const alphaByte = parseInt(m[2], 16);
    return {
      hex: ("#" + m[1]).toLowerCase(),
      opacityPct: clamp0to100(Math.round((alphaByte / 255) * 100)),
    };
  }
  // rgb (3 components, no alpha — fully opaque)
  m = input.match(
    /^rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/i,
  );
  if (m) {
    return {
      hex: rgbHex(Number(m[1]), Number(m[2]), Number(m[3])),
      opacityPct: 100,
    };
  }
  // rgba (4 components — alpha is float 0..1)
  m = input.match(
    /^rgba\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/i,
  );
  if (m) {
    return {
      hex: rgbHex(Number(m[1]), Number(m[2]), Number(m[3])),
      opacityPct: clamp0to100(Math.round(Number(m[4]) * 100)),
    };
  }
  return null;
}

function rgbHex(r: number, g: number, b: number): string {
  return (
    "#" +
    clamp255(r).toString(16).padStart(2, "0") +
    clamp255(g).toString(16).padStart(2, "0") +
    clamp255(b).toString(16).padStart(2, "0")
  ).toLowerCase();
}

function clamp0to100(n: number): number {
  if (!Number.isFinite(n)) return 100;
  return Math.max(0, Math.min(100, n));
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parseRadiusPx(input: string): number | null {
  // Multi-corner radius (e.g. "8px 12px 16px 4px") — parse first value
  // only. browsers report one shorthand for symmetric and four-value
  // expanded for asymmetric.
  const headMatch = input.match(/^(-?\d+(?:\.\d+)?)px(?:\s|$)/i);
  if (headMatch) {
    const n = Math.round(Number(headMatch[1]));
    return n < 0 ? 0 : n;
  }
  const mPlain = input.match(/^(-?\d+(?:\.\d+)?)$/);
  if (mPlain) {
    const n = Math.round(Number(mPlain[1]));
    return n < 0 ? 0 : n;
  }
  const mRem = input.match(/^(-?\d+(?:\.\d+)?)rem$/i);
  if (mRem) {
    const n = Math.round(Number(mRem[1]) * REM_TO_PX);
    return n < 0 ? 0 : n;
  }
  return null;
}
