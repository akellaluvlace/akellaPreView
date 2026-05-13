// WCAG 2.1 contrast helpers. Pure module — no DOM, no globals.
//
// `contrastRatio(fg, bg)` returns the WCAG contrast ratio (1..21) per
// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio. Both inputs accept
// 3-, 6-, or 8-digit hex (with or without leading `#`); 8-digit hex is
// composited over white (the editor's neutral assumption — see roadmap
// §4.1 #6) so a 50% opaque swatch over the page paper still produces a
// meaningful number.
//
// `wcagBucket(ratio)` reports the strongest tier the ratio satisfies:
//   - "AAA"        ≥ 7
//   - "AA"         ≥ 4.5
//   - "AA Large"   ≥ 3 (≥ 18pt or ≥ 14pt bold body text)
//   - "Fail"       otherwise
//
// `wcagSummary(ratio)` formats the chip label, e.g. "AA · 4.71:1".

const COMPOSITE_WHITE = { r: 255, g: 255, b: 255 };

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseHexFlexible(hex: string): Rgb | null {
  if (!hex) return null;
  const raw = hex.startsWith("#") ? hex.slice(1) : hex;
  if (!/^[0-9a-fA-F]+$/.test(raw)) return null;
  let r: number, g: number, b: number, a = 1;
  if (raw.length === 3) {
    r = parseInt(raw[0] + raw[0], 16);
    g = parseInt(raw[1] + raw[1], 16);
    b = parseInt(raw[2] + raw[2], 16);
  } else if (raw.length === 6) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
  } else if (raw.length === 8) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
    a = parseInt(raw.slice(6, 8), 16) / 255;
  } else {
    return null;
  }
  if (a < 1) {
    // Composite over the editor's neutral white background. Matches the
    // typical preview iframe paint for un-themed elements.
    r = Math.round(r * a + COMPOSITE_WHITE.r * (1 - a));
    g = Math.round(g * a + COMPOSITE_WHITE.g * (1 - a));
    b = Math.round(b * a + COMPOSITE_WHITE.b * (1 - a));
  }
  return { r, g, b };
}

function srgbToLinear(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

export function relativeLuminance({ r, g, b }: Rgb): number {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(fgHex: string, bgHex: string): number | null {
  const fg = parseHexFlexible(fgHex);
  const bg = parseHexFlexible(bgHex);
  if (!fg || !bg) return null;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagTier = "AAA" | "AA" | "AA Large" | "Fail";

export function wcagBucket(ratio: number): WcagTier {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

export function wcagSummary(fgHex: string, bgHex: string): {
  ratio: number;
  tier: WcagTier;
  label: string;
} | null {
  const r = contrastRatio(fgHex, bgHex);
  if (r === null) return null;
  const tier = wcagBucket(r);
  return {
    ratio: r,
    tier,
    label: `${tier} · ${r.toFixed(2)}:1`,
  };
}
