// 2026-05-17 — Content-preservation transform for component-library swaps.
//
// Problem: when a vibecoder swaps a "Sign up" button with a different
// button from the library, the new markup arrives with the LIBRARY'S
// hardcoded label (e.g. "Click me", "Buy now"). The vibecoder has to
// re-type their text every time. Same for href on links, src/alt on
// images. This makes the swap "useless" (user's word) — it should
// adapt content, only the structural style should change.
//
// Solution: BEFORE handing the markup to the iframe outer-replace
// path, transform it in-place:
//   - Replace the longest visible text node with the original's text
//   - Replace the first literal href="…" with the original's href
//   - Replace the first literal src="…" / alt="…" with the original's
//
// Heuristic, not AST-perfect. Library components have predictable
// shapes (one label per button, one heading per card, etc.) so a
// longest-text-wins replacement covers the realistic cases. Cases
// it does NOT handle in v1:
//   - Multi-text components (card with heading + body) — only one text
//     swap; longest wins. Body text from the original is lost.
//   - JSX expression hrefs / srcs (`src={var}`) — left alone since
//     there's no literal to swap.
//   - Components with NO text (icon-only buttons) — leave as-is.
//   - Component-internal CSS class state (e.g. "primary" variant
//     classes) — these stay as library-defined.
//
// Implementation reads the markup as a flat string. Stripping JSX
// comments + <style> blocks before text-node matching prevents the
// library's attribution comment ("Component: HyperUI Button…") from
// winning the longest-text contest.

export interface PreserveContent {
  text?: string;
  href?: string | null;
  src?: string | null;
  alt?: string | null;
}

const HTML_COMMENT_REGEX = /<!--[\s\S]*?-->/g;
const JSX_COMMENT_REGEX = /\{\/\*[\s\S]*?\*\/\}/g;
// <style>...</style> AND <style>{`...`}</style> — both shapes.
const STYLE_BLOCK_REGEX = /<style\b[^>]*>[\s\S]*?<\/style>/g;
// Text between `>` and `<` — captures all candidate text nodes.
// Doesn't try to parse JSX expressions; `{foo}` interior remains in
// the match but is filtered later (text matches must look like prose,
// not be JSX expressions).
const TEXT_NODE_REGEX = />([^<>]+)</g;

// Skip text candidates that are purely JSX expressions, structural
// whitespace, or arbitrary symbols. Real text content has at least
// two alphabetic word chars in a row.
function looksLikeProse(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed.length < 2) return false;
  // Pure JSX expression like "{foo}" — skip.
  if (/^\{[^}]*\}$/.test(trimmed)) return false;
  // Must have at least one alphabetic sequence ≥ 2 chars.
  return /[a-zA-Z][a-zA-Z]/.test(trimmed);
}

// Find the LONGEST visible text node in the markup, ignoring comments
// + <style> blocks (which often contain longer "text" than the actual
// component label).
function findLongestTextNode(
  markup: string,
): { full: string; trimmed: string } | null {
  // Strip comments + style blocks by REPLACING with placeholder of
  // the same length so original string offsets stay aligned (we don't
  // use those offsets here, but cleaner if we ever do).
  const stripped = markup
    .replace(HTML_COMMENT_REGEX, (m) => " ".repeat(m.length))
    .replace(JSX_COMMENT_REGEX, (m) => " ".repeat(m.length))
    .replace(STYLE_BLOCK_REGEX, (m) => " ".repeat(m.length));
  TEXT_NODE_REGEX.lastIndex = 0;
  let best: { full: string; trimmed: string } | null = null;
  let m: RegExpExecArray | null;
  while ((m = TEXT_NODE_REGEX.exec(stripped)) !== null) {
    const full = m[1]!;
    const trimmed = full.trim();
    if (!looksLikeProse(trimmed)) continue;
    if (!best || trimmed.length > best.trimmed.length) {
      best = { full, trimmed };
    }
  }
  return best;
}

// Escape a string for safe inclusion as a literal attribute value or
// text. v1 just escapes the bare-minimum chars that would break the
// surrounding context: " for attribute values, < for text.
function escapeForAttr(s: string): string {
  return s.replace(/"/g, "&quot;");
}

function escapeForText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Replace the first occurrence of `>${full}<` in markup with the new
// text wrapped the same way. Using the FULL captured text (including
// its leading/trailing whitespace) as the haystack guards against
// false positives where a substring of the longest text appears
// elsewhere.
function replaceLongestTextNode(
  markup: string,
  longest: { full: string; trimmed: string },
  newText: string,
): string {
  const escaped = escapeForText(newText);
  const haystack = `>${longest.full}<`;
  const needle = `>${escaped}<`;
  const idx = markup.indexOf(haystack);
  if (idx < 0) return markup; // shouldn't happen — we found it in the same string
  return markup.slice(0, idx) + needle + markup.slice(idx + haystack.length);
}

// Replace the first LITERAL `attr="..."` with the new value. JSX
// expressions (`attr={...}`) are left alone — there's no literal to
// swap. Single-quoted attribute values aren't emitted by buildInsertPayload
// so this only handles the double-quoted shape.
function replaceFirstLiteralAttr(
  markup: string,
  attr: string,
  newValue: string,
): string {
  // Anchored regex: `attr="..."` with non-greedy capture. The capture
  // group is the value; we replace the whole match preserving the
  // attribute name + quotes.
  const re = new RegExp(`\\b${attr}\\s*=\\s*"([^"]*)"`);
  const escaped = escapeForAttr(newValue);
  return markup.replace(re, `${attr}="${escaped}"`);
}

export function applyPreservedContent(
  markup: string,
  content: PreserveContent,
): string {
  let result = markup;

  // Text first — the longest text node wins. Skip when there's no
  // original text to transfer (e.g. an icon-only original button).
  if (content.text && content.text.trim().length > 0) {
    const longest = findLongestTextNode(result);
    if (longest) {
      result = replaceLongestTextNode(result, longest, content.text);
    }
  }

  // href / src / alt — replace the FIRST literal occurrence. Caller
  // passes `null` (not undefined) to explicitly clear, but in practice
  // we just skip null/undefined and leave the library's default.
  if (content.href != null && content.href.length > 0) {
    result = replaceFirstLiteralAttr(result, "href", content.href);
  }
  if (content.src != null && content.src.length > 0) {
    result = replaceFirstLiteralAttr(result, "src", content.src);
  }
  if (content.alt != null && content.alt.length > 0) {
    result = replaceFirstLiteralAttr(result, "alt", content.alt);
  }

  return result;
}
