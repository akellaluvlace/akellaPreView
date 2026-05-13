// Insert a Google Font into the user's code. Three application modes:
//
//   global  → emit a <link> + <style> block; sets `body { font-family: ... }`
//   var     → emit a <link> + <style> block; sets `:root { --font-...: ... }`
//   ref     → emit just `font-family: '...';` (caller drops it on a selected
//             element's inline style — currently only "global" and "var" are
//             wired into the panel; "ref" is reserved for the future
//             selection-aware insert path)
//
// We never use Next's `next/font` here — that's build-time, but the preview
// iframe runs the user's snippet at runtime via Babel. Plain Google Fonts
// CSS link is the universal route and works without an API key.

import type { FontDescriptor, Mode } from "./types";

export type FontApplyMode = "global" | "var";

function buildLinkHref(font: FontDescriptor, weights?: string[]): string {
  // `family=Inter:wght@400;500;700` for variable weights or weight-only families.
  const w = (weights && weights.length ? weights : font.weights).join(";");
  const fam = encodeURIComponent(font.family).replace(/%20/g, "+");
  const tail = w ? `:wght@${w}` : "";
  return `https://fonts.googleapis.com/css2?family=${fam}${tail}&display=swap`;
}

// Wrap the body in JSX-friendly comment delimiters or HTML-style.
function comment(mode: Mode, text: string): string {
  return mode === "jsx" ? `{/* ${text} */}` : `<!-- ${text} -->`;
}

// JSX renders <style> with dangerouslySetInnerHTML so React doesn't choke on
// the CSS curly braces; HTML uses a normal <style>.
function styleBlock(mode: Mode, css: string): string {
  if (mode === "jsx") {
    // Escape backticks defensively (none expected in font CSS but safe).
    const escaped = css.replace(/`/g, "\\`");
    return `<style dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />`;
  }
  return `<style>${css}</style>`;
}

function linkTag(mode: Mode, href: string): string {
  if (mode === "jsx") {
    return `<link href="${href}" rel="stylesheet" />`;
  }
  return `<link href="${href}" rel="stylesheet" />`;
}

export interface FontInsertOptions {
  applyMode: FontApplyMode;
  weights?: string[]; // subset; defaults to all listed weights
  cssVarName?: string; // for applyMode='var', e.g. '--font-sans'
}

export function buildFontInsert(
  font: FontDescriptor,
  mode: Mode,
  opts: FontInsertOptions
): string {
  const href = buildLinkHref(font, opts.weights);
  const fontStack =
    font.category === "monospace"
      ? `'${font.family}', ui-monospace, monospace`
      : font.category === "serif"
        ? `'${font.family}', Georgia, serif`
        : `'${font.family}', system-ui, sans-serif`;

  const parts: string[] = [];
  parts.push(comment(mode, `Google Font: ${font.family}`));
  parts.push(linkTag(mode, href));
  if (opts.applyMode === "global") {
    parts.push(styleBlock(mode, `body { font-family: ${fontStack}; }`));
  } else {
    const v = opts.cssVarName || "--font-custom";
    parts.push(styleBlock(mode, `:root { ${v}: ${fontStack}; }`));
  }
  return parts.join("\n");
}
