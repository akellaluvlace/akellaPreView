// Phase E proper — companion read for `patchJsxClassByOid` (sibling
// `lib/ast/patch-class-by-oid.ts`). Workspace's swap handler needs the
// swapped element's classes after `applySwap` lands so it can feed
// `applySwapFit` for the auto-fit transformation. Rather than having
// callers parse + walk the AST manually, this returns the literal
// className string in one call.
//
// Returns:
//   string  — literal className (or `class`) value, including inner
//             whitespace verbatim. Empty string is a valid return for
//             `className=""`.
//   null    — element not found, no className/class attribute,
//             expression-form value (`className={cn(...)}`), boolean
//             shorthand, or parse failure.
//
// Pure-logic only — no DOM, no React.

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

export function readJsxClassByOid(source: string, oid: string): string | null {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch {
    return null;
  }
  const el = findJsxElementByOid(ast, oid);
  if (!el) return null;
  return readClassFromOpeningAttrs(el.openingElement?.attributes || []);
}

function readClassFromOpeningAttrs(attrs: any[]): string | null {
  for (const a of attrs || []) {
    if (
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      (a.name.name === "className" || a.name.name === "class")
    ) {
      if (a.value?.type === "StringLiteral") return a.value.value;
      // Expression / boolean-shorthand — no literal to return.
      return null;
    }
  }
  return null;
}

// Phase F — read the root className of a fresh JSX asset (no OIDs yet).
// Wraps the input in a fragment so multi-root assets parse, finds the
// first top-level JSXElement under the fragment, and returns its
// className. Mirrors `applySwap`'s asset-parsing convention so the same
// asset text consumed by the swap engine and the capacity inference is
// always interpreted the same way.
//
// Returns:
//   string  — root element's className/class literal
//   null    — parse failure, no JSX content, no className attribute,
//             or expression-form className
export function readAssetRootClass(jsxAssetText: string): string | null {
  const trimmed = String(jsxAssetText ?? "").trim();
  if (!trimmed) return null;
  const wrapped = `(<>${trimmed}</>);`;
  let ast: any;
  try {
    ast = parse(wrapped, PARSE_OPTS);
  } catch {
    return null;
  }
  // Find the wrapper fragment, then the first top-level JSXElement under it.
  const root = findFirstFragmentChild(ast);
  if (!root) return null;
  return readClassFromOpeningAttrs(root.openingElement?.attributes || []);
}

function findFirstFragmentChild(node: any): any | null {
  if (!node || typeof node !== "object") return null;
  if (node.type === "JSXFragment") {
    for (const c of node.children || []) {
      if (c?.type === "JSXElement") return c;
    }
    return null;
  }
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        const r = findFirstFragmentChild(c);
        if (r) return r;
      }
    } else if (child && typeof child === "object" && child.type) {
      const r = findFirstFragmentChild(child);
      if (r) return r;
    }
  }
  return null;
}
