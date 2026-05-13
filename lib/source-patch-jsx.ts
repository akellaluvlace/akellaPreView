import type { JsxLoc } from "./iframe-bridge";
import type { PatchResult } from "./source-patch-types";

// JSX source patcher. Given a JsxLoc (which came from the in-iframe Babel loc
// plugin — lines 1-based, columns 0-based, user-source coordinates), we rewrite
// the user's source string in place: class string, arbitrary attributes, and
// text content between opening and closing tags.
//
// We do NOT parse the whole source. We locate the opening tag via the loc,
// then run a small one-pass attribute tokenizer on that substring only. Text
// content is derived from the element loc and the known closing-tag length.
//
// Every mutating function returns a `PatchResult` so callers can distinguish
// "nothing changed" (e.g. regex miss, stale loc) from "applied the change".

export interface JsxSpans {
  openingStart: number;
  openingEnd: number;
  elementEnd: number;
  tagName: string;
  isSelfClosing: boolean;
}

export function jsxSpans(source: string, loc: JsxLoc): JsxSpans | null {
  const openingStart = offsetOf(source, loc.startLine, loc.startCol);
  const openingEnd = offsetOf(source, loc.openEndLine, loc.openEndCol);
  const elementEnd = offsetOf(source, loc.endLine, loc.endCol);
  if (openingStart < 0 || openingEnd < 0 || elementEnd < 0) return null;
  if (
    openingStart >= source.length ||
    openingEnd > source.length ||
    elementEnd > source.length
  )
    return null;
  const opening = source.slice(openingStart, openingEnd);
  const tagMatch = opening.match(/^<\s*([A-Za-z][A-Za-z0-9_.-]*)/);
  if (!tagMatch) return null;
  const tagName = tagMatch[1];
  const isSelfClosing = openingEnd === elementEnd || /\/>\s*$/.test(opening);
  return { openingStart, openingEnd, elementEnd, tagName, isSelfClosing };
}

function offsetOf(source: string, line: number, col: number): number {
  if (line < 1) return -1;
  let off = 0;
  for (let ln = 1; ln < line; ln++) {
    const nl = source.indexOf("\n", off);
    if (nl < 0) return -1;
    off = nl + 1;
  }
  return off + col;
}

function unchanged(source: string, reason: string): PatchResult {
  return { source, changed: false, reason };
}

function changed(source: string): PatchResult {
  return { source, changed: true };
}

export function patchJsxClass(
  source: string,
  loc: JsxLoc,
  newClassString: string
): PatchResult {
  return patchJsxAttr(source, loc, "className", newClassString);
}

// Probe whether the JSX element at `loc` has a dynamic-expression
// `className={...}`. Roadmap §4.2 #13 — surfacing this lets the
// inspector render a "edits won't apply" banner BEFORE the user
// drags a slider and is silently refused. Returns false on stale
// loc (treat as static — reading is always safe; refusal still
// fires on the write path).
export function isClassNameDynamic(source: string, loc: JsxLoc): boolean {
  const spans = jsxSpans(source, loc);
  if (!spans) return false;
  const opening = source.slice(spans.openingStart, spans.openingEnd);
  const attrs = parseOpeningAttrs(opening);
  const cls = attrs.find((a) => a.name === "className");
  return cls?.kind === "expr";
}

export function patchJsxAttr(
  source: string,
  loc: JsxLoc,
  key: string,
  value: string
): PatchResult {
  const spans = jsxSpans(source, loc);
  if (!spans) return unchanged(source, "could not locate JSX element (stale loc?)");
  const opening = source.slice(spans.openingStart, spans.openingEnd);
  const newOpening = setAttrInOpening(opening, key, value);
  if (newOpening === opening) {
    return unchanged(source, `attribute ${key} not writable (dynamic expression?)`);
  }
  return changed(
    source.slice(0, spans.openingStart) +
      newOpening +
      source.slice(spans.openingEnd)
  );
}

export function patchJsxRemoveAttr(
  source: string,
  loc: JsxLoc,
  key: string
): PatchResult {
  const spans = jsxSpans(source, loc);
  if (!spans) return unchanged(source, "could not locate JSX element (stale loc?)");
  const opening = source.slice(spans.openingStart, spans.openingEnd);
  const newOpening = removeAttrInOpening(opening, key);
  if (newOpening === opening) {
    return unchanged(source, `attribute ${key} not present`);
  }
  return changed(
    source.slice(0, spans.openingStart) +
      newOpening +
      source.slice(spans.openingEnd)
  );
}

export function extractJsxElement(source: string, loc: JsxLoc): string | null {
  const spans = jsxSpans(source, loc);
  if (!spans) return null;
  return source.slice(spans.openingStart, spans.elementEnd);
}

export function duplicateJsxElement(
  source: string,
  loc: JsxLoc
): PatchResult {
  const spans = jsxSpans(source, loc);
  if (!spans) return unchanged(source, "could not locate JSX element (stale loc?)");
  const elementSrc = source.slice(spans.openingStart, spans.elementEnd);
  return changed(
    source.slice(0, spans.elementEnd) +
      " " +
      elementSrc +
      source.slice(spans.elementEnd)
  );
}

export function deleteJsxElement(source: string, loc: JsxLoc): PatchResult {
  const spans = jsxSpans(source, loc);
  if (!spans) return unchanged(source, "could not locate JSX element (stale loc?)");
  return changed(
    source.slice(0, spans.openingStart) + source.slice(spans.elementEnd)
  );
}

export function patchJsxText(
  source: string,
  loc: JsxLoc,
  newText: string
): PatchResult {
  const spans = jsxSpans(source, loc);
  if (!spans) return unchanged(source, "could not locate JSX element (stale loc?)");
  if (spans.isSelfClosing) return unchanged(source, "self-closing element has no text slot");
  const closingTagLen = 3 + spans.tagName.length; // `</tag>`
  const closingStart = spans.elementEnd - closingTagLen;
  if (closingStart < spans.openingEnd) return unchanged(source, "malformed element boundaries");
  const escaped = escapeJsxText(newText);
  const next =
    source.slice(0, spans.openingEnd) + escaped + source.slice(closingStart);
  if (next === source) return unchanged(source, "text already up to date");
  return changed(next);
}

// --- attribute tokenizer scoped to a single opening tag ---

// Discriminated union. `kind: "bare"` means the attribute has no `=` (e.g.
// `<input disabled>`); every other variant carries the value span. Collapses
// what used to be three fields (`hasValue` + `valueType` + sentinel
// `valueStart === -1`) that all encoded the same bit differently.
type ParsedAttr = {
  name: string;
  nameStart: number;
  nameEnd: number;
} & (
  | { kind: "bare" }
  | {
      kind: "string" | "expr" | "unquoted";
      valueStart: number;
      valueEnd: number;
      valueInner: string;
    }
);

function parseOpeningAttrs(opening: string): ParsedAttr[] {
  const attrs: ParsedAttr[] = [];
  if (opening[0] !== "<") return attrs;
  let i = 1;
  while (i < opening.length && /\s/.test(opening[i])) i++;
  while (i < opening.length && /[A-Za-z0-9_.:-]/.test(opening[i])) i++;

  while (i < opening.length) {
    while (i < opening.length && /\s/.test(opening[i])) i++;
    if (i >= opening.length) break;
    if (opening[i] === "/" || opening[i] === ">") break;

    const nameStart = i;
    while (i < opening.length && /[A-Za-z0-9_:-]/.test(opening[i])) i++;
    const nameEnd = i;
    if (nameEnd === nameStart) {
      i++;
      continue;
    }
    const name = opening.slice(nameStart, nameEnd);

    let j = i;
    while (j < opening.length && /\s/.test(opening[j])) j++;

    if (opening[j] !== "=") {
      attrs.push({ kind: "bare", name, nameStart, nameEnd });
      i = nameEnd;
      continue;
    }

    j++;
    while (j < opening.length && /\s/.test(opening[j])) j++;

    const c = opening[j];
    const valueStart = j;

    if (c === '"' || c === "'") {
      const endIdx = opening.indexOf(c, j + 1);
      if (endIdx < 0) break;
      const valueEnd = endIdx + 1;
      attrs.push({
        kind: "string",
        name,
        nameStart,
        nameEnd,
        valueStart,
        valueEnd,
        valueInner: opening.slice(j + 1, endIdx),
      });
      i = valueEnd;
    } else if (c === "{") {
      const endIdx = findMatchingBrace(opening, j);
      if (endIdx < 0) break;
      const valueEnd = endIdx + 1;
      attrs.push({
        kind: "expr",
        name,
        nameStart,
        nameEnd,
        valueStart,
        valueEnd,
        valueInner: opening.slice(j + 1, endIdx),
      });
      i = valueEnd;
    } else if (c !== undefined) {
      while (j < opening.length && !/[\s/>]/.test(opening[j])) j++;
      const valueEnd = j;
      attrs.push({
        kind: "unquoted",
        name,
        nameStart,
        nameEnd,
        valueStart,
        valueEnd,
        valueInner: opening.slice(valueStart, valueEnd),
      });
      i = valueEnd;
    } else {
      break;
    }
  }
  return attrs;
}

function findMatchingBrace(source: string, startIdx: number): number {
  if (source[startIdx] !== "{") return -1;
  let depth = 0;
  let inString: '"' | "'" | "`" | null = null;
  let templateBraceStack: number[] = [];

  for (let i = startIdx; i < source.length; i++) {
    const c = source[i];
    const prev = i > 0 ? source[i - 1] : "";

    if (inString === "`") {
      if (c === "`" && prev !== "\\") {
        inString = null;
      } else if (c === "$" && source[i + 1] === "{") {
        templateBraceStack.push(depth);
        depth++;
        i++;
      }
    } else if (inString) {
      if (c === inString && prev !== "\\") inString = null;
    } else if (c === '"' || c === "'" || c === "`") {
      inString = c;
    } else if (c === "{") {
      depth++;
    } else if (c === "}") {
      depth--;
      if (
        templateBraceStack.length > 0 &&
        depth === templateBraceStack[templateBraceStack.length - 1]
      ) {
        templateBraceStack.pop();
        inString = "`";
      }
      if (depth === 0) return i;
    }
  }
  return -1;
}

function setAttrInOpening(opening: string, key: string, value: string): string {
  const attrs = parseOpeningAttrs(opening);
  const existing = attrs.find((a) => a.name === key);

  if (!existing) return insertAttr(opening, key, value);

  switch (existing.kind) {
    case "string":
      // Hot path: preserve quotes and surrounding whitespace exactly.
      return (
        opening.slice(0, existing.valueStart + 1) +
        escapeAttrValue(value) +
        opening.slice(existing.valueEnd - 1)
      );
    case "expr": {
      // Phase 1 expression-aware stub (maniuplation.md gap #5 / Phase 1):
      // when the user clicks a class on an element whose className is a
      // dynamic expression (`className={cn("base", isOn && "extra")}`,
      // `className={`bg-${variant}-500`}`, `className={styles.card}`,
      // `className={props.className}`), the previous behaviour rewrote
      // the whole attr to `className="..."` — silently destroying the
      // cn() conditional, the template-literal slots, the CSS-Modules
      // reference, or the prop-forward. Refuse to write; the caller
      // surfaces the PatchResult.reason to the user as a non-blocking
      // warning. Full classifier (cn() argument append, conditional /
      // TemplateLiteral / Opaque taxonomy with chip UI) ships in Phase 4.
      if (key === "className") return opening;
      // Other expression-valued attrs (style={{...}}, onClick={...}) keep
      // the destructive normalize-to-string behaviour for now — those
      // edits are usually intentional (the user is replacing a dynamic
      // handler with a static one). Phase 4 widens the protection.
      return (
        opening.slice(0, existing.nameStart) +
        `${key}="${escapeAttrValue(value)}"` +
        opening.slice(existing.valueEnd)
      );
    }
    case "unquoted":
      // Replace whole attr span, normalise to a double-quoted string form.
      return (
        opening.slice(0, existing.nameStart) +
        `${key}="${escapeAttrValue(value)}"` +
        opening.slice(existing.valueEnd)
      );
    case "bare":
      // Boolean-style attr → upgrade to valued.
      return (
        opening.slice(0, existing.nameStart) +
        `${key}="${escapeAttrValue(value)}"` +
        opening.slice(existing.nameEnd)
      );
  }
}

function removeAttrInOpening(opening: string, key: string): string {
  const attrs = parseOpeningAttrs(opening);
  const existing = attrs.find((a) => a.name === key);
  if (!existing) return opening;

  const end = existing.kind === "bare" ? existing.nameEnd : existing.valueEnd;
  let start = existing.nameStart;
  while (start > 0 && /\s/.test(opening[start - 1])) start--;
  return opening.slice(0, start) + opening.slice(end);
}

function insertAttr(opening: string, key: string, value: string): string {
  const insertion = ` ${key}="${escapeAttrValue(value)}"`;
  const selfCloseMatch = opening.match(/\s*\/>\s*$/);
  if (selfCloseMatch) {
    const idx = selfCloseMatch.index!;
    return opening.slice(0, idx) + insertion + opening.slice(idx);
  }
  const closeMatch = opening.match(/\s*>\s*$/);
  if (closeMatch) {
    const idx = closeMatch.index!;
    return opening.slice(0, idx) + insertion + opening.slice(idx);
  }
  return opening;
}

function escapeAttrValue(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeJsxText(s: string): string {
  return s.replace(/[&<>{}]/g, (c) => {
    if (c === "&") return "&amp;";
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    if (c === "{") return "&#123;";
    if (c === "}") return "&#125;";
    return c;
  });
}
