// Generic SVG-icon inserter shared by Heroicons / Phosphor / Tabler / Simple
// Icons. Each icon set ships with a different base viewBox and a different
// stroke-vs-fill convention; the caller passes the right shape via opts.
//
// Always emits inline SVG (same reasoning as Lucide — preview iframe can't
// resolve module imports).

import type { Mode } from "./types";

export interface SvgIconShape {
  // The icon's inner SVG body (paths, circles, etc.) — no outer <svg>.
  body: string;
  // Stable identifier used as a CSS class suffix and for log lines.
  name: string;
}

export interface SvgIconStyleOptions {
  size: number;          // px
  viewBox: string;       // "0 0 24 24" / "0 0 256 256" etc.
  // "stroke" → outline icons (Heroicons outline, Tabler outline, Lucide).
  // "fill" → solid icons (Heroicons solid, Phosphor, Simple Icons).
  mode: "stroke" | "fill";
  strokeWidth?: number;  // stroke mode only
  color?: string;        // CSS color; defaults to currentColor
  classPrefix?: string;  // e.g. "hi" for Heroicons, "ph" for Phosphor
}

// Convert kebab-case SVG attrs → camelCase for JSX. Bounded list so we don't
// accidentally rewrite arbitrary user content.
function jsxify(body: string): string {
  return body
    .replace(/\bstroke-linecap=/g, "strokeLinecap=")
    .replace(/\bstroke-linejoin=/g, "strokeLinejoin=")
    .replace(/\bstroke-width=/g, "strokeWidth=")
    .replace(/\bstroke-dasharray=/g, "strokeDasharray=")
    .replace(/\bstroke-dashoffset=/g, "strokeDashoffset=")
    .replace(/\bstroke-miterlimit=/g, "strokeMiterlimit=")
    .replace(/\bclip-path=/g, "clipPath=")
    .replace(/\bclip-rule=/g, "clipRule=")
    .replace(/\bfill-rule=/g, "fillRule=")
    .replace(/\bfill-opacity=/g, "fillOpacity=")
    .replace(/\bstroke-opacity=/g, "strokeOpacity=");
}

export function buildSvgIconInsert(
  icon: SvgIconShape,
  outputMode: Mode,
  style: SvgIconStyleOptions
): string {
  const color = style.color ?? "currentColor";
  const cls = style.classPrefix
    ? `${style.classPrefix} ${style.classPrefix}-${icon.name}`
    : icon.name;

  if (style.mode === "stroke") {
    const sw = style.strokeWidth ?? 2;
    if (outputMode === "html") {
      return (
        `<svg xmlns="http://www.w3.org/2000/svg" width="${style.size}" height="${style.size}" ` +
        `viewBox="${style.viewBox}" fill="none" stroke="${color}" stroke-width="${sw}" ` +
        `stroke-linecap="round" stroke-linejoin="round" class="${cls}">${icon.body}</svg>`
      );
    }
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${style.size}" height="${style.size}" ` +
      `viewBox="${style.viewBox}" fill="none" stroke="${color}" strokeWidth={${sw}} ` +
      `strokeLinecap="round" strokeLinejoin="round" className="${cls}">${jsxify(icon.body)}</svg>`
    );
  }
  // fill mode
  if (outputMode === "html") {
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${style.size}" height="${style.size}" ` +
      `viewBox="${style.viewBox}" fill="${color}" class="${cls}">${icon.body}</svg>`
    );
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${style.size}" height="${style.size}" ` +
    `viewBox="${style.viewBox}" fill="${color}" className="${cls}">${jsxify(icon.body)}</svg>`
  );
}
