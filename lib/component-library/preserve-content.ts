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
  // 2026-05-17 — Full class string from the original element. We
  // extract the SIZING / LAYOUT classes (w-, h-, max-w-, max-h-,
  // mx-, my-, m-, mt-, etc.) and append them to the new component's
  // first opening tag. Reason: the library button might be 280px
  // wide by default; the original might have been `w-full max-w-sm
  // mx-auto`. Transferring those keeps the swapped element in the
  // same flow position + footprint. We DON'T transfer chrome classes
  // (bg-, text-, rounded-, shadow-, border-) — those are what the
  // user is swapping FOR. Optional. Empty string skips the transfer.
  classes?: string;
}

// 2026-05-17 — Tailwind utility class prefixes that affect sizing
// and layout placement. Transferred from the original element onto
// the new component's root so swaps preserve "this is the full-width
// CTA in this container" semantics. Chrome (color/radius/shadow/
// border/padding) is intentionally NOT in this list — those are
// what the user is changing by swapping.
const SIZING_CLASS_PREFIXES = [
  "w-",
  "h-",
  "max-w-",
  "max-h-",
  "min-w-",
  "min-h-",
  "m-",
  "mx-",
  "my-",
  "mt-",
  "mr-",
  "mb-",
  "ml-",
  "grow",
  "shrink",
  "basis-",
  "col-",
  "row-",
  "self-",
  "place-self-",
  "justify-self-",
];

function isSizingClass(token: string): boolean {
  for (const prefix of SIZING_CLASS_PREFIXES) {
    // Exact match (e.g. "grow" / "shrink") OR prefix match (e.g.
    // "w-full", "max-w-sm"). Variant-prefixed forms ("md:w-full",
    // "hover:mt-2") also count — strip the variant chain first.
    const bare = token.replace(/^(?:[a-z-]+:)+/, "");
    if (bare === prefix) return true;
    if (bare.startsWith(prefix) && prefix.endsWith("-")) return true;
  }
  return false;
}

function extractSizingClasses(classes: string): string[] {
  if (!classes) return [];
  const tokens = classes.split(/\s+/).filter(Boolean);
  const sizing: string[] = [];
  const seen = new Set<string>();
  for (const t of tokens) {
    if (seen.has(t)) continue;
    if (isSizingClass(t)) {
      sizing.push(t);
      seen.add(t);
    }
  }
  return sizing;
}

// Find the first real opening tag in markup (skipping comments, style
// blocks, JSX fragments, and the attribution comment). Returns the
// tag's position info so caller can splice an attribute into it.
// Returns null when no real opening tag is found (markup is all
// comments / styles / empty).
function findFirstOpeningTag(markup: string): {
  tagStart: number; // index of `<`
  tagNameEnd: number; // index AFTER the tag name (next is whitespace or `>` or `/`)
  tagEnd: number; // index of `>`
} | null {
  // Strip masking for comments + style blocks: replace content with
  // same-length spaces so subsequent indexOf scans on the ORIGINAL
  // string still hit at the right offsets.
  const stripped = markup
    .replace(HTML_COMMENT_REGEX, (m) => " ".repeat(m.length))
    .replace(JSX_COMMENT_REGEX, (m) => " ".repeat(m.length))
    .replace(STYLE_BLOCK_REGEX, (m) => " ".repeat(m.length));
  // Skip JSX fragment open `<>` — it has no attrs. Same for the
  // matching `</>`.
  // Match the first `<tagname`. Tag name must start with a letter
  // (skips fragments which start with `<>`).
  const re = /<([a-zA-Z][a-zA-Z0-9]*)/g;
  const m = re.exec(stripped);
  if (!m) return null;
  const tagStart = m.index;
  const tagNameEnd = tagStart + 1 + m[1]!.length;
  // Find the matching `>` (handles attributes with `>` inside quoted
  // values — find first `>` not inside a quoted attr value).
  let i = tagNameEnd;
  let inQuote: '"' | "'" | null = null;
  while (i < markup.length) {
    const ch = markup[i];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === ">") {
      return { tagStart, tagNameEnd, tagEnd: i };
    }
    i += 1;
  }
  return null;
}

// Append sizing classes onto the first opening tag's className /
// class attribute. Detects JSX (`className`) vs HTML (`class`) by
// looking for which is present, defaulting to JSX style if neither
// is found (mode parameter from caller).
function appendClassesToFirstTag(
  markup: string,
  sizingClasses: string[],
  mode: "jsx" | "html",
): string {
  if (sizingClasses.length === 0) return markup;
  const loc = findFirstOpeningTag(markup);
  if (!loc) return markup;
  const tagText = markup.slice(loc.tagStart, loc.tagEnd + 1);
  const sizingStr = sizingClasses.join(" ");
  const attrName = mode === "jsx" ? "className" : "class";
  // Does the tag already have a className/class attribute?
  const classAttrRegex = new RegExp(`\\b${attrName}\\s*=\\s*"([^"]*)"`);
  const existing = classAttrRegex.exec(tagText);
  if (existing) {
    // Append to existing class string. Don't dedupe against the
    // existing — both sets coexist; sizing classes override chrome
    // for the same property because they're added later in the
    // string (the cascade still resolves by specificity though, so
    // some duplication can happen; Tailwind tolerates this).
    const newClassValue = `${existing[1]} ${sizingStr}`;
    const replacedTag = tagText.replace(
      classAttrRegex,
      `${attrName}="${newClassValue}"`,
    );
    return (
      markup.slice(0, loc.tagStart) + replacedTag + markup.slice(loc.tagEnd + 1)
    );
  }
  // No class attribute exists — inject one right after the tag name.
  const before = markup.slice(0, loc.tagNameEnd);
  const after = markup.slice(loc.tagNameEnd);
  return `${before} ${attrName}="${sizingStr}"${after}`;
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
  mode: "jsx" | "html" = "jsx",
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

  // 2026-05-17 — Sizing class transfer. Replaces the OLD bbox `<div
  // style="width:Xpx">` wrapper approach which caused nested-wrapper
  // duplication on sequential swaps (each swap added another wrapper
  // INSIDE the prior because vibeClick selected the inner element,
  // not the wrapper). New approach: copy w-/h-/max-/mx-/etc. classes
  // from original directly onto the new component's root tag. No
  // wrapper, no nesting, sizing context preserved.
  if (content.classes) {
    const sizing = extractSizingClasses(content.classes);
    if (sizing.length > 0) {
      result = appendClassesToFirstTag(result, sizing, mode);
    }
  }

  return result;
}
