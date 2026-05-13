import { parse } from "parse5";
import type { DefaultTreeAdapterMap } from "parse5";
import type { PatchResult } from "./source-patch-types";

// HTML source patcher. Given a DOM path (element-only index chain relative to
// <html>) we locate the parse5 Element and rewrite class / attribute / text
// using its sourceCodeLocation — preserving the user's original formatting
// (indentation, comments, quote style) around the change. Every mutator
// returns `PatchResult` so callers can surface silent no-ops.

type Node = DefaultTreeAdapterMap["node"];
type ElementNode = DefaultTreeAdapterMap["element"];

function isElement(n: Node): n is ElementNode {
  return (n as { tagName?: string }).tagName !== undefined;
}

function findElement(html: string, path: number[]): ElementNode | null {
  const doc = parse(html, { sourceCodeLocationInfo: true }) as unknown as {
    childNodes: Node[];
  };
  const htmlEl = doc.childNodes.find(isElement);
  if (!htmlEl) return null;
  let cur: ElementNode = htmlEl;
  for (const idx of path) {
    const elChildren = cur.childNodes.filter(isElement) as ElementNode[];
    if (idx < 0 || idx >= elChildren.length) return null;
    cur = elChildren[idx];
  }
  return cur;
}

function unchanged(source: string, reason: string): PatchResult {
  return { source, changed: false, reason };
}

function changed(source: string): PatchResult {
  return { source, changed: true };
}

export function patchHtmlClass(
  html: string,
  path: number[],
  newClassString: string
): PatchResult {
  return patchHtmlAttr(html, path, "class", newClassString);
}

export function patchHtmlAttr(
  html: string,
  path: number[],
  key: string,
  value: string
): PatchResult {
  const el = findElement(html, path);
  if (!el) return unchanged(html, "could not locate HTML element at path (stale?)");
  const loc = el.sourceCodeLocation;
  if (!loc || !loc.startTag) return unchanged(html, "element has no source-location info");

  const attrLocs = loc.attrs as
    | Record<string, { startOffset: number; endOffset: number }>
    | undefined;
  const attrLoc = attrLocs ? attrLocs[key.toLowerCase()] : undefined;

  if (attrLoc) {
    return changed(
      html.slice(0, attrLoc.startOffset) +
        `${key}="${escapeAttrValue(value)}"` +
        html.slice(attrLoc.endOffset)
    );
  }

  const tagEnd = loc.startTag.endOffset;
  let insertPos = tagEnd - 1;
  if (html[insertPos - 1] === "/") insertPos -= 1;
  const insertion = ` ${key}="${escapeAttrValue(value)}"`;
  return changed(html.slice(0, insertPos) + insertion + html.slice(insertPos));
}

export function patchHtmlRemoveAttr(
  html: string,
  path: number[],
  key: string
): PatchResult {
  const el = findElement(html, path);
  if (!el) return unchanged(html, "could not locate HTML element at path (stale?)");
  const loc = el.sourceCodeLocation;
  if (!loc) return unchanged(html, "element has no source-location info");
  const attrLocs = loc.attrs as
    | Record<string, { startOffset: number; endOffset: number }>
    | undefined;
  const attrLoc = attrLocs ? attrLocs[key.toLowerCase()] : undefined;
  if (!attrLoc) return unchanged(html, `attribute ${key} not present`);

  let start = attrLoc.startOffset;
  while (start > 0 && /\s/.test(html[start - 1])) start--;
  return changed(html.slice(0, start) + html.slice(attrLoc.endOffset));
}

export function extractHtmlElement(html: string, path: number[]): string | null {
  const el = findElement(html, path);
  if (!el) return null;
  const loc = el.sourceCodeLocation;
  if (!loc) return null;
  const start = loc.startTag ? loc.startTag.startOffset : loc.startOffset;
  const end = loc.endTag
    ? loc.endTag.endOffset
    : loc.startTag
    ? loc.startTag.endOffset
    : loc.endOffset;
  return html.slice(start, end);
}

export function duplicateHtmlElement(
  html: string,
  path: number[]
): PatchResult {
  const el = findElement(html, path);
  if (!el) return unchanged(html, "could not locate HTML element at path (stale?)");
  const loc = el.sourceCodeLocation;
  if (!loc) return unchanged(html, "element has no source-location info");
  const start = loc.startTag ? loc.startTag.startOffset : loc.startOffset;
  const end = loc.endTag
    ? loc.endTag.endOffset
    : loc.startTag
    ? loc.startTag.endOffset
    : loc.endOffset;
  const elementSrc = html.slice(start, end);
  return changed(html.slice(0, end) + "\n" + elementSrc + html.slice(end));
}

export function deleteHtmlElement(html: string, path: number[]): PatchResult {
  const el = findElement(html, path);
  if (!el) return unchanged(html, "could not locate HTML element at path (stale?)");
  const loc = el.sourceCodeLocation;
  if (!loc) return unchanged(html, "element has no source-location info");
  const start = loc.startTag ? loc.startTag.startOffset : loc.startOffset;
  const end = loc.endTag
    ? loc.endTag.endOffset
    : loc.startTag
    ? loc.startTag.endOffset
    : loc.endOffset;
  return changed(html.slice(0, start) + html.slice(end));
}

export function patchHtmlText(
  html: string,
  path: number[],
  newText: string
): PatchResult {
  const el = findElement(html, path);
  if (!el) return unchanged(html, "could not locate HTML element at path (stale?)");
  const loc = el.sourceCodeLocation;
  if (!loc || !loc.startTag || !loc.endTag) {
    return unchanged(html, "element is void / self-closing (no text slot)");
  }
  const textStart = loc.startTag.endOffset;
  const textEnd = loc.endTag.startOffset;
  if (textStart > textEnd) return unchanged(html, "malformed element boundaries");
  const next =
    html.slice(0, textStart) + escapeHtmlText(newText) + html.slice(textEnd);
  if (next === html) return unchanged(html, "text already up to date");
  return changed(next);
}

function escapeAttrValue(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Outer-replacement patcher used by the vibe-edit icon-swap flow in
// HTML mode. Replaces the element's full byte range (startTag start →
// endTag end, falling back to startOffset/endOffset for void elements
// or location-incomplete records) with the supplied newOuter verbatim.
//
// HTML mode addresses elements by parse5 path so no OID injection is
// required — the next selection round-trip resolves through the same
// element-index chain. Returns no-change when newOuter equals the
// existing bytes; bails on stale path / missing location info / empty
// newOuter.
export function patchHtmlOuter(
  html: string,
  path: number[],
  newOuter: string,
): PatchResult {
  if (!newOuter.trim()) {
    return unchanged(html, "newOuter is empty");
  }
  const el = findElement(html, path);
  if (!el) return unchanged(html, "could not locate HTML element at path (stale?)");
  const loc = el.sourceCodeLocation;
  if (!loc) return unchanged(html, "element has no source-location info");
  const start = loc.startTag ? loc.startTag.startOffset : loc.startOffset;
  const end = loc.endTag
    ? loc.endTag.endOffset
    : loc.startTag
    ? loc.startTag.endOffset
    : loc.endOffset;
  const existing = html.slice(start, end);
  if (existing === newOuter) {
    return unchanged(html, "outer already up to date");
  }
  return changed(html.slice(0, start) + newOuter + html.slice(end));
}
