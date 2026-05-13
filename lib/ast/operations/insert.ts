// Phase 5 / Phase C — Operation engine for insert. Sibling to
// `duplicate.ts` / `delete.ts` / `reorder.ts` / `reparent.ts` /
// `resize.ts` / `spacing.ts` / `style.ts` / `swap.ts`. Adds a library
// asset (parsed JSX string) as the LAST child of the targeted parent
// element, with fresh OIDs minted across every element of the asset
// subtree so no two elements in the resulting source share a
// `data-dropin-id`.
//
// Bail rules:
//   - Source doesn't parse → bail.
//   - parentOid not found → bail.
//   - Parent is self-closing or has no closing tag (e.g. `<img/>`) → bail.
//   - Parent is a leaf-tag (img / input / br / etc., per
//     DROPIN_LEAF_TAGS_LOWER below — mirrors lib/preview.ts walker's
//     leaf-tag set) → bail.
//   - Asset doesn't parse as JSX (we wrap in a synthetic tsx body to
//     allow fragments / multiple top-level expressions to come back as
//     one tree) → bail.
//   - Parent missing opening / closing position info (defensive) → bail.
//
// Whitespace handling: derives an indent string from the parent's
// existing children — the leading whitespace of the LAST child is
// reused so the inserted asset matches the surrounding indentation.
// If the parent has no children, falls back to a default `"\n  "`
// indent. Same pattern reorder.ts uses for "append at end".
//
// OID strategy: the asset comes from the library; its source may or
// may not have OIDs (today's library tiles don't). We walk every
// JSXOpeningElement in the parsed asset and either:
//   - Replace an existing `data-dropin-id="..."` attribute value with
//     a fresh mint, OR
//   - Insert a new `data-dropin-id="..."` attribute right after the
//     opening tag's name (mirrors `injectOids` in `lib/ast/oids.ts`).
// Mints are seeded by `parent.closingElement.start + counter * 7919`
// so the same input always produces the same output. Seen-set is
// built from the full pre-insert source via `collectAllOids` so fresh
// OIDs never collide with anything already in the document.
//
// Returns `insertedOid`: the freshly-minted OID of the asset's root
// element (first JSXOpeningElement in source order). Useful to the
// gesture path so it can re-select the new element after the iframe
// rebuild settles. Null only on bail.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR, makeOid, isValidOid } from "../oids";

export interface InsertChildOperation {
  parentOid: string;
  jsx: string;
}

export interface InsertChildResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
  insertedOid: string | null;
}

const PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

const SKIP_KEYS = new Set([
  "loc",
  "tokens",
  "comments",
  "extra",
  "start",
  "end",
  "leadingComments",
  "trailingComments",
]);

// Lowercase mirror of DROPIN_LEAF_TAGS in lib/preview.ts. AST gives us
// the JSXOpeningElement name as-typed (lowercase for HTML tags), so we
// compare lowercase here. <a>, <button>, <label> CAN have children so
// they are intentionally NOT in this set — permissive in v1.
const DROPIN_LEAF_TAGS_LOWER = new Set([
  "img", "input", "br", "hr", "area", "base", "col", "embed",
  "link", "meta", "param", "source", "track", "wbr",
  "iframe", "object", "script", "style", "noscript",
  "textarea", "select", "option", "optgroup", "progress", "meter",
  "canvas", "video", "audio", "picture", "svg",
]);

function getOidFromAttrs(attrs: any[]): string | null {
  for (const a of attrs || []) {
    if (
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      a.name.name === OID_ATTR &&
      a.value?.type === "StringLiteral"
    ) {
      return a.value.value;
    }
  }
  return null;
}

function findJsxElementByOid(node: any, oid: string): any | null {
  if (!node || typeof node !== "object") return null;
  if (node.type === "JSXElement") {
    const got = getOidFromAttrs(node.openingElement?.attributes || []);
    if (got === oid) return node;
  }
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        const r = findJsxElementByOid(c, oid);
        if (r) return r;
      }
    } else if (child && typeof child === "object" && child.type) {
      const r = findJsxElementByOid(child, oid);
      if (r) return r;
    }
  }
  return null;
}

function collectAllOids(node: any, into: Set<string>): void {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") {
    for (const a of node.attributes || []) {
      if (
        a?.type === "JSXAttribute" &&
        a.name?.type === "JSXIdentifier" &&
        a.name.name === OID_ATTR &&
        a.value?.type === "StringLiteral" &&
        isValidOid(a.value.value)
      ) {
        into.add(a.value.value);
      }
    }
  }
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      for (const c of child) collectAllOids(c, into);
    } else if (child && typeof child === "object" && child.type) {
      collectAllOids(child, into);
    }
  }
}

// Collect every JSXOpeningElement in source order. Used to walk the
// asset AST after parsing so we can stamp / replace OIDs deterministically.
function collectOpenings(node: any, into: any[]): void {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") into.push(node);
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      for (const c of child) collectOpenings(c, into);
    } else if (child && typeof child === "object" && child.type) {
      collectOpenings(child, into);
    }
  }
}

// Deterministic mint with collision-bumping. Same shape as duplicate.ts.
function mintFresh(baseSeed: number, seen: Set<string>): string {
  let candidate = makeOid(baseSeed);
  if (!seen.has(candidate)) return candidate;
  for (let bump = 1; bump < 1000; bump++) {
    candidate = makeOid(baseSeed + bump * 7919);
    if (!seen.has(candidate)) return candidate;
  }
  let id = makeOid() + makeOid();
  while (seen.has(id)) id = makeOid() + makeOid();
  return id;
}

// Get the lowercase tag name from a JSXOpeningElement. Returns "" for
// member expression / namespaced names (we never special-case those).
function tagNameOf(opening: any): string {
  const n = opening?.name;
  if (n?.type === "JSXIdentifier" && typeof n.name === "string") {
    return n.name.toLowerCase();
  }
  return "";
}

// Parse the asset string. Wrap in a tsx fragment so fragments + raw
// JSX expressions both come back as a single tree. Returns null on
// failure (caller bails).
function parseAsset(jsx: string): any | null {
  // Wrap in a return statement inside a function to coerce into a
  // single JSX expression position. Trim then drop any trailing
  // semicolons so whatever the asset author wrote stays valid.
  const trimmed = jsx.trim();
  if (!trimmed) return null;
  const wrapped = `(<>${trimmed}</>);`;
  try {
    return parse(wrapped, PARSE_OPTS);
  } catch {
    return null;
  }
}

// Find the innermost text-equivalent JSX element list out of the
// fragment wrapper produced by `parseAsset`. Returns the byte range
// [start, end] inside the WRAPPED source that covers the user-supplied
// asset content (between `<>` and `</>`).
function findAssetRange(wrapAst: any): { start: number; end: number } | null {
  // Structure: ExpressionStatement → ParenthesizedExpression / Expression →
  //   JSXFragment(openingFragment, children, closingFragment)
  // We want the byte range AFTER `openingFragment.end` and BEFORE
  // `closingFragment.start`.
  function findFragment(node: any): any | null {
    if (!node || typeof node !== "object") return null;
    if (node.type === "JSXFragment") return node;
    for (const key in node) {
      if (SKIP_KEYS.has(key)) continue;
      const child = (node as any)[key];
      if (Array.isArray(child)) {
        for (const c of child) {
          const r = findFragment(c);
          if (r) return r;
        }
      } else if (child && typeof child === "object" && child.type) {
        const r = findFragment(child);
        if (r) return r;
      }
    }
    return null;
  }
  const frag = findFragment(wrapAst);
  if (!frag) return null;
  const start = frag.openingFragment?.end;
  const end = frag.closingFragment?.start;
  if (typeof start !== "number" || typeof end !== "number") return null;
  return { start, end };
}

export function applyInsertChild(
  source: string,
  op: InsertChildOperation
): InsertChildResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return {
      source,
      unchanged: true,
      reason: `parse failed: ${String(e)}`,
      insertedOid: null,
    };
  }

  const parent = findJsxElementByOid(ast, op.parentOid);
  if (!parent) {
    return {
      source,
      unchanged: true,
      reason: `parent oid "${op.parentOid}" not found`,
      insertedOid: null,
    };
  }

  if (parent.openingElement?.selfClosing || !parent.closingElement) {
    return {
      source,
      unchanged: true,
      reason: "Can't insert into self-closing element",
      insertedOid: null,
    };
  }

  const parentTag = tagNameOf(parent.openingElement);
  if (parentTag && DROPIN_LEAF_TAGS_LOWER.has(parentTag)) {
    return {
      source,
      unchanged: true,
      reason: `Can't insert into <${parentTag}>`,
      insertedOid: null,
    };
  }

  const closingStart = parent.closingElement?.start;
  const openingEnd = parent.openingElement?.end;
  if (typeof closingStart !== "number" || typeof openingEnd !== "number") {
    return {
      source,
      unchanged: true,
      reason: "parent missing opening/closing position info",
      insertedOid: null,
    };
  }

  // Parse the asset into its own AST.
  const assetAst = parseAsset(op.jsx);
  if (!assetAst) {
    return {
      source,
      unchanged: true,
      reason: "asset failed to parse as JSX",
      insertedOid: null,
    };
  }
  const assetRange = findAssetRange(assetAst);
  if (!assetRange) {
    return {
      source,
      unchanged: true,
      reason: "asset wrapper produced no fragment node",
      insertedOid: null,
    };
  }

  // Build the asset string we'll inject by stamping fresh OIDs onto
  // every JSXOpeningElement in the asset subtree.
  const wrapped = `(<>${op.jsx.trim()}</>);`;
  const assetText = wrapped.slice(assetRange.start, assetRange.end);
  // Bail if the asset wrapper had any non-element / non-whitespace
  // content (e.g. `Hello` raw text at the top level). Vibecoders' use
  // case is always JSX elements; skipping this would mint OIDs for
  // nothing and silently insert text-only content. Cheaper to bail.
  if (!assetText.trim()) {
    return {
      source,
      unchanged: true,
      reason: "asset had no JSX content",
      insertedOid: null,
    };
  }

  // Walk the asset's openings and produce a list of
  // (positionInAssetText, replacement) edits. Two cases:
  //   - existing `data-dropin-id="<oid>"` attribute → replace its
  //     value bytes with a fresh OID (range [valStart, valEnd]).
  //   - no attribute → insert ` data-dropin-id="<oid>"` right after
  //     the JSXIdentifier name's end (range [pos, pos] — pure insert).
  // Asset positions are relative to `wrapped`, which begins with `(<>`
  // (3 chars), so we subtract `assetRange.start` to convert them into
  // assetText coordinates.
  const openings: any[] = [];
  collectOpenings(assetAst, openings);
  // Sort source-order (already source-order from collectOpenings, but
  // belt-and-braces). The first opening in source order is the asset's
  // root; subsequent are descendants.
  openings.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));

  const seen = new Set<string>();
  collectAllOids(ast, seen);

  type Edit = { start: number; end: number; text: string };
  const edits: Edit[] = [];
  let insertedOid: string | null = null;

  for (let i = 0; i < openings.length; i++) {
    const opening = openings[i];
    const fresh = mintFresh(closingStart + i * 7919, seen);
    seen.add(fresh);
    if (i === 0) insertedOid = fresh;

    let replacedExisting = false;
    for (const a of opening.attributes || []) {
      if (
        a?.type === "JSXAttribute" &&
        a.name?.type === "JSXIdentifier" &&
        a.name.name === OID_ATTR &&
        a.value?.type === "StringLiteral" &&
        typeof a.value.start === "number" &&
        typeof a.value.end === "number"
      ) {
        // Replace the value bytes (preserve the surrounding `"..."`).
        const valStart = a.value.start - assetRange.start;
        const valEnd = a.value.end - assetRange.start;
        edits.push({
          start: valStart,
          end: valEnd,
          text: `"${fresh}"`,
        });
        replacedExisting = true;
        break;
      }
    }
    if (!replacedExisting) {
      const nameEnd = opening.name?.end;
      if (typeof nameEnd !== "number") continue;
      const insertPos = nameEnd - assetRange.start;
      edits.push({
        start: insertPos,
        end: insertPos,
        text: ` ${OID_ATTR}="${fresh}"`,
      });
    }
  }

  // Apply edits in reverse position order so earlier offsets stay valid.
  edits.sort((a, b) => b.start - a.start);
  let stamped = assetText;
  for (const e of edits) {
    stamped = stamped.slice(0, e.start) + e.text + stamped.slice(e.end);
  }

  // Determine indent. Walk parent.children backwards from closingStart
  // looking for the LAST non-whitespace JSXText that runs up to
  // closingStart, OR the leading WS of the last real child. Same pattern
  // reorder.ts uses for "insert at end".
  const children = parent.children || [];
  let indent = "\n  ";
  let appendPos = closingStart;
  let foundLastChild = false;
  // Find the last non-whitespace child (real content). Capture its
  // leading-WS — the bytes between the previous-real-child's end (or
  // openingEnd) and the last child's start.
  let lastReal: any = null;
  let lastRealPrevEnd: number = openingEnd;
  let runningPrevEnd: number = openingEnd;
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c.type === "JSXText") {
      const v = typeof c.value === "string" ? c.value : "";
      if (v.trim() === "") continue;
    }
    lastReal = c;
    lastRealPrevEnd = runningPrevEnd;
    if (typeof c.end === "number") runningPrevEnd = c.end;
    foundLastChild = true;
  }
  if (foundLastChild && lastReal && typeof lastReal.start === "number") {
    indent = source.slice(lastRealPrevEnd, lastReal.start);
    // Insert just after the last real child so we land before the
    // closing tag's leading whitespace. This preserves the existing
    // source's "\n</div>" terminator.
    appendPos =
      typeof lastReal.end === "number" ? lastReal.end : closingStart;
  } else {
    // Empty parent — use default indent + a trailing newline so the
    // closing tag stays on its own line. We append right after the
    // opening tag's end.
    appendPos = openingEnd;
  }

  const insertText = indent + stamped;

  const s = new MagicString(source);
  s.appendLeft(appendPos, insertText);

  return {
    source: s.toString(),
    unchanged: false,
    reason: null,
    insertedOid,
  };
}
