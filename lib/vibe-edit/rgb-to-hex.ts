// Convert any computed-style colour string the iframe might emit to a
// 6-digit lowercase hex. The browser's getComputedStyle returns
// colours as rgb()/rgba() — we normalize so the vibe-edit colour
// pickers (which only speak hex) can display them.
//
// transparentFallback distinguishes the two callers:
//   - TextControls's bg picker: white, so a transparent bg doesn't
//     show as a black square indistinguishable from a black text
//     colour swatch.
//   - IconControls's color picker: black, matching the default visual
//     for "no color set" on an icon.
//
// Pre-Phase-5 the two consumers had near-identical inline functions
// with diverging transparent fallbacks. A future "let's DRY this"
// refactor would lose the divergence; parameterizing the fallback at
// extraction time records the intent.
//
// Alpha is intentionally dropped — picker UIs are hex-only in v1.
// The opacity-aware path lives in lib/vibe-edit/style-to-class.ts
// (normalizeToHex's slash-form emission for source persistence), not
// here.

const TRANSPARENT_RGBA = /^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/;

export interface RgbToHexOpts {
  transparentFallback: "#ffffff" | "#000000";
}

const DEFAULT_OPTS: RgbToHexOpts = { transparentFallback: "#000000" };

export function rgbToHex(
  rgb: string,
  opts: RgbToHexOpts = DEFAULT_OPTS,
): string {
  if (!rgb) return "#000000";
  if (rgb.startsWith("#")) {
    return rgb.length === 4
      ? "#" +
          rgb
            .slice(1)
            .split("")
            .map((c) => c + c)
            .join("")
            .toLowerCase()
      : rgb.toLowerCase();
  }
  if (rgb === "transparent" || TRANSPARENT_RGBA.test(rgb)) {
    return opts.transparentFallback;
  }
  const m = rgb.match(/\d+(?:\.\d+)?/g);
  if (!m || m.length < 3) return "#000000";
  return (
    "#" +
    m
      .slice(0, 3)
      .map((n) => Math.max(0, Math.min(255, Math.round(Number(n)))))
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
  );
}
