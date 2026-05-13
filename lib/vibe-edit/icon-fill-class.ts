// Tailwind arbitrary-variant class emission for icon color cascade
// (UI2 FULL Step 1, 2026-05-12). Produces `[&_*]:fill-[#hex]` which
// compiles to a descendant CSS rule (`.foo * { fill: #hex }`). The
// rule outranks hardcoded `fill="..."` presentation attributes on
// inner <path> / <g> / <rect> children because W3C SVG 1.1 says
// presentation attributes have specificity ZERO (see
// docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md item 4).
//
// Strip + add semantics: the picker fires per-tick of the color
// input, so we need to strip any existing token of this shape (with
// or without variant prefixes like `md:` / `hover:`) before adding
// the new one, otherwise the class attribute would balloon with
// every drag.

const ICON_FILL_VARIANT_MATCH =
  /^(?:[\w-]+:)*\[&_\*\]:fill-\[#[0-9a-fA-F]+\]$/;

export function applyIconFillClass(
  currentClasses: string,
  hex: string,
): string {
  const cleanHex = hex.trim().toLowerCase();
  const tokens = (currentClasses || "")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !ICON_FILL_VARIANT_MATCH.test(t));
  tokens.push(`[&_*]:fill-[${cleanHex}]`);
  return tokens.join(" ");
}
