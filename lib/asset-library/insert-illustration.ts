// unDraw illustration insert. Each unDraw illustration uses #6c63ff as the
// swappable accent color (this is the actual unDraw convention). At insert
// time we replace every occurrence of #6c63ff with the user's chosen color
// (or default to var(--primary, #6c63ff) so a palette swap recolors it).

import type { Mode } from "./types";

export interface UndrawIllustration {
  slug: string;
  title: string;
  tags: string[];
  viewBox: string;
  body: string; // inner SVG body referencing #6c63ff for swappable color
}

export interface IllustrationInsertOptions {
  // Hex color or CSS color value. Defaults to `var(--primary, #6c63ff)` so
  // it picks up the active palette automatically.
  color?: string;
  width?: string; // e.g. "100%", "320px"
}

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

function comment(mode: Mode, text: string): string {
  return mode === "jsx" ? `{/* ${text} */}` : `<!-- ${text} -->`;
}

export function buildIllustrationInsert(
  illo: UndrawIllustration,
  mode: Mode,
  opts?: IllustrationInsertOptions
): string {
  const color = opts?.color ?? "var(--primary, #6c63ff)";
  const width = opts?.width ?? "100%";

  // Swap the swap-color in two places: hex and CSS color literal — unDraw
  // uses #6c63ff exclusively, but accept variations defensively.
  let body = illo.body
    .replace(/#6c63ff/gi, color)
    .replace(/#6C63FF/g, color);

  if (mode === "jsx") body = jsxify(body);

  const head = comment(mode, `unDraw illustration: ${illo.title}`);
  if (mode === "html") {
    return (
      `${head}\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${illo.viewBox}" ` +
      `width="${width}" role="img" aria-label="${illo.title}">${body}</svg>`
    );
  }
  return (
    `${head}\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${illo.viewBox}" ` +
    `width="${width}" role="img" aria-label="${illo.title}">${body}</svg>`
  );
}
