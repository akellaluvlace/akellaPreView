// 2026-05-20 — Extend applyPalette to rewrite design-system tokens in
// the template's embedded `tailwind.config.theme.extend.colors` block.
//
// Background: many templates ship a `tailwind.config = { theme: extend:
// colors: { ... } }` block with Material 3-style design tokens like
// "primary", "primary-container", "surface", "surface-container-low",
// "on-surface-variant", "outline", etc. The class tokens then look like
// `bg-primary-container` / `text-on-surface` rather than `bg-blue-500`.
//
// `applyPalette` only matches standard Tailwind family names (slate,
// gray, indigo, ...). On these templates it found 0 matching tokens
// and bailed silently. The visible effect: user clicks a palette tile,
// iframe rebuilds, nothing changes.
//
// This module re-colors the EMBEDDED config block by classifying each
// token's name (primary→primary role, surface→neutral role, etc.) and
// assigning a hex from the chosen palette at a shade appropriate to
// the name suffix (-container-low → 100, -container-highest → 400, on-
// → 900 or 50, etc.).
//
// Uses string/regex parsing (not babel AST) because the embedded config
// lives inside a `<script>{` template-literal or `<script>` tag — both
// awkward to AST-parse uniformly. The regex anchors on `colors: {` and
// reads until the matching `}` via brace-depth counting.

import {
  lookupFamilyHex,
  type Palette,
} from "../../palettes";

export interface PaletteConfigResult {
  source: string;
  unchanged: boolean;
  tokensRewritten: number;
}

// Token-name → (role, shade) classification. Role picks which family
// from the palette (primary / accent / neutral). Shade picks how dark.
// Mapping follows Material 3 conventions but is forgiving on naming.
//
// Order matters: more specific patterns first (on-surface-variant before
// on-surface).
interface RoleAssignment {
  role: "primary" | "accent" | "neutral";
  shade: "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950";
}

function classifyToken(name: string): RoleAssignment | null {
  const n = name.toLowerCase();

  // Inverse / dark-mode tokens — keep contrast logic intact.
  // "on-X" means foreground on the X background; needs to invert.
  if (n.startsWith("on-")) {
    const base = n.slice(3); // strip "on-"
    // on-primary, on-secondary, on-tertiary → light text on dark colored bg
    if (
      base.startsWith("primary") ||
      base.startsWith("secondary") ||
      base.startsWith("tertiary") ||
      base.startsWith("accent")
    ) {
      // For *-container suffixes, the text is on a LIGHT container, so
      // text should be DARK.
      if (base.includes("container") || base.includes("fixed")) {
        return { role: "primary", shade: "900" };
      }
      return { role: "neutral", shade: "50" };
    }
    if (
      base.startsWith("surface") ||
      base.startsWith("background") ||
      base.startsWith("foreground")
    ) {
      // Text on surface → dark text.
      return { role: "neutral", shade: "900" };
    }
    if (base.startsWith("error") || base.startsWith("warning") || base.startsWith("success") || base.startsWith("info")) {
      // Leave semantic-color foregrounds alone.
      return null;
    }
    // Default: assume light text on a dark colored background.
    return { role: "neutral", shade: "50" };
  }

  // Primary brand colors.
  if (n.startsWith("primary")) {
    if (n.includes("container-lowest")) return { role: "primary", shade: "50" };
    if (n.includes("container-low")) return { role: "primary", shade: "100" };
    if (n.includes("container-high")) return { role: "primary", shade: "300" };
    if (n.includes("container-highest")) return { role: "primary", shade: "400" };
    if (n.includes("container")) return { role: "primary", shade: "200" };
    if (n.includes("fixed-dim")) return { role: "primary", shade: "700" };
    if (n.includes("fixed")) return { role: "primary", shade: "100" };
    if (n === "primary") return { role: "primary", shade: "500" };
    return { role: "primary", shade: "500" };
  }

  // Secondary / tertiary / accent → accent role.
  if (n.startsWith("secondary") || n.startsWith("tertiary") || n.startsWith("accent")) {
    if (n.includes("container-lowest")) return { role: "accent", shade: "50" };
    if (n.includes("container-low")) return { role: "accent", shade: "100" };
    if (n.includes("container-high")) return { role: "accent", shade: "300" };
    if (n.includes("container-highest")) return { role: "accent", shade: "400" };
    if (n.includes("container")) return { role: "accent", shade: "200" };
    if (n.includes("fixed-dim")) return { role: "accent", shade: "700" };
    if (n.includes("fixed")) return { role: "accent", shade: "100" };
    return { role: "accent", shade: "500" };
  }

  // Neutral surfaces.
  if (n.startsWith("surface") || n.startsWith("background") || n === "foreground") {
    if (n.includes("container-lowest")) return { role: "neutral", shade: "50" };
    if (n.includes("container-low")) return { role: "neutral", shade: "100" };
    if (n.includes("container-high")) return { role: "neutral", shade: "300" };
    if (n.includes("container-highest")) return { role: "neutral", shade: "400" };
    if (n.includes("container")) return { role: "neutral", shade: "200" };
    if (n.includes("dim")) return { role: "neutral", shade: "300" };
    if (n.includes("bright")) return { role: "neutral", shade: "50" };
    if (n.includes("variant")) return { role: "neutral", shade: "200" };
    if (n.includes("inverse")) return { role: "neutral", shade: "900" };
    return { role: "neutral", shade: "100" };
  }

  if (n.startsWith("outline")) {
    if (n.includes("variant")) return { role: "neutral", shade: "200" };
    return { role: "neutral", shade: "400" };
  }

  if (n.startsWith("scrim") || n.startsWith("shadow")) {
    return { role: "neutral", shade: "900" };
  }

  // Leave semantic colors alone: error, warning, success, info.
  // These convey state, not brand identity — recoloring them confuses
  // users (red errors becoming green is harmful).
  return null;
}

export function applyPaletteToConfigColors(
  source: string,
  palette: Palette,
): PaletteConfigResult {
  // Find the `colors: {` block (with optional whitespace) anywhere in
  // the source. Some templates have multiple colors blocks (light /
  // dark themes); we rewrite all of them.
  const blockRe = /colors\s*:\s*\{/g;
  const matches: Array<{ openIdx: number; closeIdx: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(source)) !== null) {
    const openIdx = m.index + m[0].length - 1; // index of "{"
    // Walk forward, tracking brace depth, to find matching "}".
    let depth = 1;
    let i = openIdx + 1;
    while (i < source.length && depth > 0) {
      const c = source[i];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      i++;
    }
    if (depth === 0) {
      matches.push({ openIdx, closeIdx: i - 1 });
    }
  }
  if (matches.length === 0) {
    return { source, unchanged: true, tokensRewritten: 0 };
  }

  let out = source;
  let tokensRewritten = 0;
  // Walk matches in REVERSE so byte-offset edits don't shift later ranges.
  for (let mi = matches.length - 1; mi >= 0; mi--) {
    const { openIdx, closeIdx } = matches[mi];
    const block = out.slice(openIdx + 1, closeIdx);
    // Match entries like:  "primary-container": "#abcdef",
    // Also bare:           primary: '#abcdef',
    // Both quote styles, both key forms (quoted or bare), optional trailing comma.
    const entryRe = /(["']?)([a-zA-Z][\w-]*)\1\s*:\s*(["'])(#[0-9a-fA-F]{3,8})\3/g;
    let newBlock = "";
    let lastIndex = 0;
    let e: RegExpExecArray | null;
    while ((e = entryRe.exec(block)) !== null) {
      const fullMatch = e[0];
      const tokenName = e[2];
      const hex = e[4];
      const assignment = classifyToken(tokenName);
      if (!assignment) {
        // Untouched — append from lastIndex up to and including the match.
        continue;
      }
      const destFamily =
        assignment.role === "primary"
          ? palette.families.primary
          : assignment.role === "accent"
            ? palette.families.accent
            : palette.families.neutral;
      const destHex = lookupFamilyHex(destFamily, assignment.shade);
      if (!destHex) continue;
      if (destHex.toLowerCase() === hex.toLowerCase()) continue;
      // Splice the replacement into newBlock buffer.
      newBlock += block.slice(lastIndex, e.index);
      // Reconstruct entry with new hex (preserve key style + quote style).
      const keyQuote = e[1] ?? "";
      const valQuote = e[3];
      newBlock += `${keyQuote}${tokenName}${keyQuote}: ${valQuote}${destHex}${valQuote}`;
      lastIndex = e.index + fullMatch.length;
      tokensRewritten++;
    }
    if (lastIndex > 0) {
      newBlock += block.slice(lastIndex);
      out = out.slice(0, openIdx + 1) + newBlock + out.slice(closeIdx);
    }
  }

  return {
    source: out,
    unchanged: tokensRewritten === 0,
    tokensRewritten,
  };
}
