// Build the insert payload for a Lucide icon. We always emit inline SVG
// (never `import { ArrowRight } from 'lucide-react'`) because the preview
// iframe runs Babel-standalone with no module resolution — `import` would
// crash. Inline SVG is portable, requires no build step, and copies cleanly
// into any user codebase later.

import type { LucideIcon, Mode } from "./types";

export interface IconInsertOptions {
  size: number; // px, default 24
  strokeWidth: number; // default 2
  color?: string; // CSS color; defaults to currentColor so it inherits
}

const DEFAULT_OPTS: IconInsertOptions = {
  size: 24,
  strokeWidth: 2,
};

// HTML mode: standard SVG with kebab-case attrs.
function buildHtmlSvg(icon: LucideIcon, opts: IconInsertOptions): string {
  const { size, strokeWidth, color } = opts;
  const stroke = color ?? "currentColor";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ` +
    `stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${icon.name}">` +
    `${icon.body}` +
    `</svg>`
  );
}

// JSX mode: camelCase attrs (strokeWidth, strokeLinecap, etc.) and inline
// className uses double quotes that won't conflict with JSX attribute syntax.
function buildJsxSvg(icon: LucideIcon, opts: IconInsertOptions): string {
  const { size, strokeWidth, color } = opts;
  const stroke = color ?? "currentColor";
  // Convert kebab-case attrs in the icon body to camelCase so React doesn't
  // warn. Lucide icon bodies only use a handful of attrs, all standard SVG
  // names — a small targeted swap is enough.
  const body = icon.body
    .replace(/\bstroke-linecap=/g, "strokeLinecap=")
    .replace(/\bstroke-linejoin=/g, "strokeLinejoin=")
    .replace(/\bstroke-width=/g, "strokeWidth=")
    .replace(/\bstroke-dasharray=/g, "strokeDasharray=")
    .replace(/\bstroke-dashoffset=/g, "strokeDashoffset=")
    .replace(/\bclip-path=/g, "clipPath=")
    .replace(/\bclip-rule=/g, "clipRule=")
    .replace(/\bfill-rule=/g, "fillRule=");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `viewBox="0 0 24 24" fill="none" stroke="${stroke}" strokeWidth={${strokeWidth}} ` +
    `strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-${icon.name}">` +
    `${body}` +
    `</svg>`
  );
}

export function buildIconInsert(
  icon: LucideIcon,
  mode: Mode,
  opts?: Partial<IconInsertOptions>
): string {
  const merged: IconInsertOptions = { ...DEFAULT_OPTS, ...(opts || {}) };
  return mode === "jsx"
    ? buildJsxSvg(icon, merged)
    : buildHtmlSvg(icon, merged);
}
