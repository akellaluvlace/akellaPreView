// Phase 3 Layer 4 — Operation engine for duplicate. Sibling to
// `reorder.ts` / `reparent.ts` / `resize.ts` / `spacing.ts` /
// `style.ts` / `delete.ts`. Same magic-string + Babel pattern; this
// engine inserts a verbatim copy of a JSX element as the next sibling
// of the original, with fresh OIDs minted across the duplicated subtree
// so no two elements in the resulting source share a `data-dropin-id`.
//
// Bail rules:
//   - Source doesn't parse → bail.
//   - oid not found → bail.
//   - srcEl has no JSXElement parent (top-level / Program-level JSX,
//     e.g. `export default () => <div/>` where <div/> is the function
//     body's return root) → bail. Top-level duplicates would need to
//     know what wrapper to insert into, which the caller doesn't tell
//     us.
//   - Parent missing opening/closing position info (defensive) → bail.
//
// Whitespace handling: the duplicate inherits srcEl's leading
// whitespace verbatim. We walk parent.children backwards from srcEl,
// treating whitespace-only JSXText as part of the indent, and stop at
// the previous non-whitespace child (or parent.openingElement.end for
// first child). The indent string runs from that stop position to
// srcEl.start. Same indent is prepended to the duplicated element
// text, then inserted right after srcEl.end. Result:
//   <div>\n  <a/>\n</div>  →  <div>\n  <a/>\n  <a/>\n</div>
//
// OID re-mint: the duplicated element text is captured verbatim from
// source, including any nested `data-dropin-id="..."` attributes.
// Inserting that verbatim would yield two elements with the same OID,
// breaking the unique-OID invariant. We rewrite each OID occurrence
// inside the duplicate region with a fresh unique value, seeded
// deterministically from srcEl.end so the same input always produces
// the same output. Seen set is built from the entire pre-insert
// source to avoid colliding with any existing OID.
//
// Returns `newRootOid`: the freshly-minted OID of the duplicate's root
// element. Useful to the gesture path so it can re-select the new
// element after the iframe rebuild settles. Null only on bail.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR, makeOid, isValidOid } from "../oids";

export interface DuplicateOperation {
  oid: string;
}

export interface DuplicateResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
  newRootOid: string | null;
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

// Match a `data-dropin-id="<8 alnum>"` attribute. Leading `\s` ensures
// we're inside a tag's attribute list, not a value-position string
// literal that happens to embed the substring (vibecoder unlikely but
// the lookbehind is cheap).
const OID_ATTR_RE = /(\sdata-dropin-id=")([A-Za-z0-9]{8})(")/g;

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

function buildParentMap(ast: any): Map<any, any | null> {
  const map = new Map<any, any | null>();
  function walk(node: any, parentJsx: any | null): void {
    if (!node || typeof node !== "object") return;
    if (node.type === "JSXElement") {
      map.set(node, parentJsx);
      parentJsx = node;
    }
    for (const key in node) {
      if (SKIP_KEYS.has(key)) continue;
      const child = (node as any)[key];
      if (Array.isArray(child)) {
        for (const c of child) walk(c, parentJsx);
      } else if (child && typeof child === "object" && child.type) {
        walk(child, parentJsx);
      }
    }
  }
  walk(ast, null);
  return map;
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

// Deterministic mint with collision-bumping. Mirrors `mintUnique` in
// `lib/ast/oids.ts` (which isn't exported); we duplicate the small
// helper here to keep this module's import surface focused.
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

export function applyDuplicate(
  source: string,
  op: DuplicateOperation
): DuplicateResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return {
      source,
      unchanged: true,
      reason: `parse failed: ${String(e)}`,
      newRootOid: null,
    };
  }

  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl) {
    return {
      source,
      unchanged: true,
      reason: `oid "${op.oid}" not found`,
      newRootOid: null,
    };
  }

  const parentMap = buildParentMap(ast);
  const parent = parentMap.get(srcEl) ?? null;
  if (!parent) {
    return {
      source,
      unchanged: true,
      reason: "element has no JSX parent (top-level) — cannot duplicate",
      newRootOid: null,
    };
  }

  const parentOpeningEnd = parent.openingElement?.end;
  if (typeof parentOpeningEnd !== "number") {
    return {
      source,
      unchanged: true,
      reason: "parent missing opening position info",
      newRootOid: null,
    };
  }
  if (typeof srcEl.start !== "number" || typeof srcEl.end !== "number") {
    return {
      source,
      unchanged: true,
      reason: "source element missing position info",
      newRootOid: null,
    };
  }

  // Find srcEl's leading-whitespace start. Walk parent.children up to
  // (but not including) srcEl. Treat whitespace-only JSXText as part
  // of the indent (don't advance the WS-start); any other child kind
  // (JSXElement, JSXFragment, JSXExpressionContainer, non-whitespace
  // JSXText) advances the WS-start past it.
  let leadingWsStart = parentOpeningEnd;
  const children = parent.children || [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c === srcEl) break;
    if (c.type === "JSXText") {
      const v = typeof c.value === "string" ? c.value : "";
      if (v.trim() === "") continue;
    }
    if (typeof c.end === "number") {
      leadingWsStart = c.end;
    }
  }
  const indent = source.slice(leadingWsStart, srcEl.start);

  // Capture the verbatim source for the element to duplicate.
  const elText = source.slice(srcEl.start, srcEl.end);

  // Build the seen set from the original source so re-minted OIDs
  // don't collide with anything already there (including the
  // originals we're about to leave intact).
  const seen = new Set<string>();
  collectAllOids(ast, seen);

  // Rewrite OIDs in the duplicate region, in source order. The first
  // match is the root element's `data-dropin-id` attribute (root is
  // the outermost element, its opening tag is leftmost in the byte
  // stream). counter === 0 captures it as `newRootOid`.
  let counter = 0;
  let newRootOid: string | null = null;
  const rewrittenElText = elText.replace(
    OID_ATTR_RE,
    (_m, prefix: string, _oldOid: string, suffix: string) => {
      const fresh = mintFresh(srcEl.end + counter * 7919, seen);
      seen.add(fresh);
      if (counter === 0) newRootOid = fresh;
      counter++;
      return prefix + fresh + suffix;
    }
  );

  // Defensive: if the source element somehow lacked a `data-dropin-id`
  // attribute (impossible because findJsxElementByOid located it via
  // OID, but cover it anyway) we'd return `newRootOid: null`. Callers
  // can fall back to "select the duplicate by source-position lookup".
  // Not worth bailing — the duplicate insert still lands.

  const insertText = indent + rewrittenElText;

  const s = new MagicString(source);
  s.appendLeft(srcEl.end, insertText);

  return {
    source: s.toString(),
    unchanged: false,
    reason: null,
    newRootOid,
  };
}
