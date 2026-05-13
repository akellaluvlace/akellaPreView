// Phase 5 / Phase C — host-side scope resolver. When the user runs a
// palette swap inside FocusEditor's isolated mode, the swap should
// affect ONLY the focused element + its descendants, not the entire
// page (locked decision §1.12 of `phase5-tools-isolation.md`).
//
// The host owns the canonical source string, so we resolve the scope
// by walking the AST: find the element whose `data-dropin-id` matches
// the focused root, then collect every nested OID. Returns null on
// parse failure or unknown root — caller falls back to "all" scope.

import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR } from "./oids";

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

function collectAllOids(node: any, into: string[]): void {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") {
    const oid = getOidFromAttrs(node.attributes || []);
    if (oid) into.push(oid);
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

// Returns the ordered list of OIDs that fall within the subtree rooted
// at `rootOid` (inclusive). Source order. Empty when `rootOid` isn't
// found or the source doesn't parse — callers should treat empty as
// "scope unresolvable" and fall back to a sensible default.
export function collectDescendantOids(
  source: string,
  rootOid: string
): string[] {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch {
    return [];
  }
  const root = findJsxElementByOid(ast, rootOid);
  if (!root) return [];
  const out: string[] = [];
  collectAllOids(root, out);
  return out;
}
