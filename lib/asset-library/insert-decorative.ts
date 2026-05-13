// Insert helpers for the Tier 3 decorative panels: gradients, shadows,
// SVG patterns / waves / blobs, and mockup frames. Each returns a snippet
// the user can drop at the cursor.
//
// All four share the same "wrap a CSS rule in a <style> block" or "drop a
// self-contained <svg>" shape, with mode-aware comment delimiters.

import type { Mode } from "./types";

function comment(mode: Mode, text: string): string {
  return mode === "jsx" ? `{/* ${text} */}` : `<!-- ${text} -->`;
}

function styleBlock(mode: Mode, css: string): string {
  if (mode === "jsx") {
    const escaped = css.replace(/`/g, "\\`");
    return `<style dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />`;
  }
  return `<style>${css}</style>`;
}

// JSX-safe attr renaming for raw SVG bodies.
function jsxify(body: string): string {
  return body
    .replace(/\bstroke-linecap=/g, "strokeLinecap=")
    .replace(/\bstroke-linejoin=/g, "strokeLinejoin=")
    .replace(/\bstroke-width=/g, "strokeWidth=")
    .replace(/\bstroke-dasharray=/g, "strokeDasharray=")
    .replace(/\bclip-path=/g, "clipPath=")
    .replace(/\bclip-rule=/g, "clipRule=")
    .replace(/\bfill-rule=/g, "fillRule=")
    .replace(/\bfill-opacity=/g, "fillOpacity=")
    .replace(/\bstop-color=/g, "stopColor=")
    .replace(/\bstop-opacity=/g, "stopOpacity=");
}

// ============================================================================
// Gradients
// ============================================================================

export interface Gradient {
  id: string;
  name: string;
  css: string;       // e.g. "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)"
  tags: string[];
  kind: "linear" | "radial" | "mesh";
}

export function buildGradientInsert(g: Gradient, mode: Mode): string {
  // Page-level gradient. Same selector pattern as palettes (see
  // `insert-palette.ts` for the full rationale): in JSX the wrapper div
  // lives inside `#root`, which is owned by lib/preview.ts. We target
  // `#root > *` (the wrapper) but NOT `#root > * > *` — grandchildren
  // are sections/cards with their own backgrounds; carpet-bombing them
  // would break templates with mixed dark/light sections.
  // `background-attachment: fixed` keeps the gradient in place during
  // scroll (typical hero-bg behavior). Wrapped in `@layer dropin-palette`
  // (same layer as palette overrides) so they share cascade priority.
  // Pre-condition: `#root` should be transparent (set in INSPECTOR_CSS)
  // so the body gradient propagates through.
  const css = [
    `@layer dropin-palette {`,
    `  html, body {`,
    `    background: ${g.css} !important;`,
    `    background-attachment: fixed !important;`,
    `    min-height: 100vh; margin: 0;`,
    `  }`,
    `  #root > * {`,
    `    background: ${g.css} !important;`,
    `    background-attachment: fixed !important;`,
    `  }`,
    `}`,
  ].join("\n");
  return [comment(mode, `Gradient: ${g.name}`), styleBlock(mode, css)].join("\n");
}

// ============================================================================
// Shadows
// ============================================================================

export interface ShadowPreset {
  id: string;
  name: string;
  css: string; // valid box-shadow value
  tags: string[];
}

export function buildShadowInsert(s: ShadowPreset, mode: Mode): string {
  // Shadow needs an element to apply to. We emit a styled <div> sample so
  // the user sees the shadow render right away; they swap the CSS rule
  // into their own selector later.
  const css = `.dropin-shadow-${s.id} { box-shadow: ${s.css}; padding: 2rem; background: #fff; border-radius: 12px; }`;
  return [
    comment(mode, `Shadow: ${s.name}`),
    styleBlock(mode, css),
    mode === "jsx"
      ? `<div className="dropin-shadow-${s.id}">Shadowed element</div>`
      : `<div class="dropin-shadow-${s.id}">Shadowed element</div>`,
  ].join("\n");
}

// ============================================================================
// SVG Patterns / Waves / Blobs (single helper covers all three — they're
// all SVGs that take an optional accent color and are dropped as either an
// inline SVG or a CSS background-image.)
// ============================================================================

export interface DecorativeSvg {
  id: string;
  name: string;
  kind: "pattern" | "wave" | "blob";
  viewBox: string;
  body: string;            // inner SVG using #6c63ff for the swap color
  tags?: string[];
  preserveAspectRatio?: string;
}

export interface DecorativeOptions {
  color?: string;          // defaults to var(--primary, #6c63ff)
  // Pattern: emit as `background-image: url('data:image/svg+xml,...')`
  // Wave: emit as a top-level <svg> divider
  // Blob: emit as absolutely-positioned background <svg>
  asBackground?: boolean;  // pattern only
}

function dataUriOf(svgBody: string, viewBox: string, color: string): string {
  const colored = svgBody.replace(/#6c63ff/gi, color);
  const wrapped = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'>${colored}</svg>`;
  // Encode characters that can't appear in a CSS url(...) literal directly.
  return `data:image/svg+xml;utf8,${encodeURIComponent(wrapped)}`;
}

export function buildDecorativeInsert(
  svg: DecorativeSvg,
  mode: Mode,
  opts?: DecorativeOptions
): string {
  const color = opts?.color ?? "var(--primary, #6c63ff)";
  let body = svg.body.replace(/#6c63ff/gi, color);
  if (mode === "jsx") body = jsxify(body);
  const par = svg.preserveAspectRatio ? ` preserveAspectRatio="${svg.preserveAspectRatio}"` : "";

  if (svg.kind === "pattern" && opts?.asBackground) {
    const uri = dataUriOf(svg.body, svg.viewBox, color);
    const css = `.dropin-pattern-${svg.id} { background-image: url("${uri}"); background-repeat: repeat; min-height: 320px; }`;
    return [
      comment(mode, `Pattern: ${svg.name}`),
      styleBlock(mode, css),
      mode === "jsx"
        ? `<div className="dropin-pattern-${svg.id}" />`
        : `<div class="dropin-pattern-${svg.id}"></div>`,
    ].join("\n");
  }

  if (svg.kind === "wave") {
    return [
      comment(mode, `Wave: ${svg.name}`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}"${par} ` +
        (mode === "jsx"
          ? `className="w-full h-auto block">${body}</svg>`
          : `class="w-full h-auto block">${body}</svg>`),
    ].join("\n");
  }

  if (svg.kind === "blob") {
    return [
      comment(mode, `Blob: ${svg.name}`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}"${par} ` +
        (mode === "jsx"
          ? `className="absolute inset-0 -z-10 pointer-events-none w-full h-full">${body}</svg>`
          : `class="absolute inset-0 -z-10 pointer-events-none w-full h-full">${body}</svg>`),
    ].join("\n");
  }

  // Default: inline pattern as SVG
  return [
    comment(mode, `Pattern: ${svg.name}`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox}"${par} ` +
      (mode === "jsx"
        ? `className="w-full h-full">${body}</svg>`
        : `class="w-full h-full">${body}</svg>`),
  ].join("\n");
}

// ============================================================================
// Mockup frames
// ============================================================================

export interface MockupFrame {
  id: string;
  name: string;
  kind: "browser" | "phone" | "tablet" | "laptop" | "watch";
  // Inner template uses {{IMAGE_SRC}} as the placeholder for the user's
  // image URL. If they don't have one in mind we drop a 1024×640 unsplash
  // sample.
  template: string;
}

export interface MockupOptions {
  imageUrl?: string;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1280&auto=format&fit=crop";

export function buildMockupInsert(
  mockup: MockupFrame,
  mode: Mode,
  opts?: MockupOptions
): string {
  const url = opts?.imageUrl || PLACEHOLDER_IMAGE;
  let body = mockup.template.replace(/\{\{IMAGE_SRC\}\}/g, url);
  if (mode === "jsx") {
    body = body
      .replace(/ class="/g, ' className="')
      .replace(/<img([^>]*)>/g, (m) => (m.endsWith("/>") ? m : m.replace(/>$/, " />")));
  }
  return [comment(mode, `Mockup: ${mockup.name}`), body].join("\n");
}
