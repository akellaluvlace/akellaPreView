// 2026-05-23 — Design-system context for the BYO-AI element prompt.
//
// The element-only swap prompt sends just the target + reference. That
// keeps it small + truncation-proof, but it loses the page's design
// system — so a restyled element can come back in colors that clash
// with the rest of the site. (This is exactly why Claude's full-file
// rewrites looked more coherent: with the whole file, Claude saw the
// palette + fonts.)
//
// This module extracts a COMPACT design-system summary from the full
// source — color tokens / families + fonts — so we can hand the AI
// just enough context to make the element fit in, without the cost +
// truncation risk of the whole file. Mirrors Webflow's "AI Assistant
// adds sections matching your existing design system" approach.
//
// Everything here is regex-based + bounded (caps on counts) so it
// stays cheap + can't blow up the prompt size.

import { ALL_FAMILIES } from "../palettes";

const SHADES = "(?:50|100|200|300|400|500|600|700|800|900|950)";
const FAMILY_ALT = ALL_FAMILIES.join("|");

// Tailwind utility prefixes that carry a color (bg-, text-, border-,
// gradient stops, ring). Used to tally which palette families the
// template actually uses when there's no explicit config block.
const COLOR_PREFIX = "(?:bg|text|border|from|via|to|ring|fill|stroke|decoration|outline|shadow|accent|caret|divide)";

const MAX_TOKENS = 12;
const MAX_FAMILIES = 5;
const MAX_FONTS = 4;

// Extract named color tokens from an embedded tailwind config
// `colors: { "name": "#hex", ... }` block. Returns "name=#hex" strings.
// Quoted or unquoted keys; hex or rgb/hsl values (we keep hex only for
// brevity). Capped at MAX_TOKENS.
function extractColorTokens(source: string): string[] {
  const blockMatch = source.match(/["']?colors["']?\s*:\s*\{/);
  if (!blockMatch || blockMatch.index === undefined) return [];
  const start = blockMatch.index + blockMatch[0].length;
  // Walk a bounded window; the config block is near the top of the file.
  const window = source.slice(start, start + 8000);
  const entryRe =
    /["']?([a-zA-Z][\w-]*)["']?\s*:\s*["'](#[0-9a-fA-F]{3,8})["']/g;
  const out: string[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(window)) !== null) {
    const name = m[1];
    const hex = m[2];
    if (seen.has(name)) continue;
    seen.add(name);
    out.push(`${name}=${hex}`);
    if (out.length >= MAX_TOKENS) break;
  }
  return out;
}

// Tally the most-used Tailwind palette families across className
// strings. Fallback when there's no config block (most HTML/Tailwind
// templates). Returns family names ordered by frequency.
function topColorFamilies(source: string): string[] {
  const re = new RegExp(`\\b${COLOR_PREFIX}-(${FAMILY_ALT})-${SHADES}\\b`, "g");
  const counts = new Map<string, number>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_FAMILIES)
    .map(([family]) => family);
}

// Extract font family names from: `font-['Name']` arbitrary classes,
// Google Fonts <link> hrefs (`family=Name`), and `font-family:` CSS.
function extractFonts(source: string): string[] {
  const fonts = new Set<string>();
  const add = (raw: string) => {
    const name = raw.replace(/\+/g, " ").replace(/['"]/g, "").trim();
    // Drop weight/style suffixes Google appends (`:wght@400`).
    const clean = name.split(":")[0].trim();
    if (clean && clean.length < 40) fonts.add(clean);
  };
  // font-['Playfair_Display'] / font-[Inter]
  for (const m of source.matchAll(/font-\[['"]?([^'"\]]+)['"]?\]/g)) {
    add(m[1].replace(/_/g, " "));
  }
  // Google Fonts: ...family=Playfair+Display:wght@400&family=Inter
  for (const m of source.matchAll(/[?&]family=([^&"'\s]+)/g)) {
    add(m[1]);
  }
  // font-family: 'Inter', sans-serif;  → capture the first family,
  // tolerating an optional leading quote + stopping before the comma.
  for (const m of source.matchAll(/font-family:\s*['"]?([^;{}"',]+)/gi)) {
    const first = m[1].trim();
    if (first && !/^(sans-serif|serif|monospace|system-ui|ui-\w+|inherit)$/i.test(first)) {
      add(first);
    }
  }
  return [...fonts].slice(0, MAX_FONTS);
}

// Build the compact design-system summary string, or null when nothing
// useful was found (the prompt then omits the section entirely).
export function extractDesignContext(fullSource: string): string | null {
  const parts: string[] = [];

  const tokens = extractColorTokens(fullSource);
  if (tokens.length > 0) {
    parts.push(`- Color tokens (Tailwind theme): ${tokens.join(", ")}`);
  } else {
    const families = topColorFamilies(fullSource);
    if (families.length > 0) {
      parts.push(
        `- Color families in use (Tailwind): ${families.join(", ")}`,
      );
    }
  }

  const fonts = extractFonts(fullSource);
  if (fonts.length > 0) {
    parts.push(`- Fonts: ${fonts.join(", ")}`);
  }

  if (parts.length === 0) return null;
  return parts.join("\n");
}
