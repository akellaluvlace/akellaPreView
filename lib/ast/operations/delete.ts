// Phase 3 Layer 4 — Operation engine for delete. Sibling to
// `duplicate.ts` / `reorder.ts` / `reparent.ts` / `resize.ts` /
// `spacing.ts` / `style.ts`. Removes a JSX element from its parent
// along with the leading whitespace separator that precedes it, so
// the surrounding source stays clean.
//
// Bail rules:
//   - Source doesn't parse → bail.
//   - oid not found → bail.
//   - Element is top-level (no JSXElement parent) → bail. The caller
//     would need to know how to drop the surrounding `return ...;` /
//     `const X = ...` scaffold; out of scope here.
//   - Element is wrapped in a non-JSXElement structure inside its
//     parent (e.g. `{cond && <X/>}` JSXExpressionContainer or
//     LogicalExpression operand) → bail. We can't safely remove the
//     wrapper too because that would change runtime behaviour.
//   - Parent missing opening position info (defensive) → bail.
//
// Whitespace handling: the removal range starts at the end of the
// previous "thing" — the most recent non-whitespace child (JSXElement,
// non-whitespace JSXText, JSXExpressionContainer, JSXFragment) or the
// parent's openingElement.end if srcEl is the first non-whitespace
// child — and ends at srcEl.end. Whitespace-only JSXText between
// (newlines + indent) is consumed with the deleted element so the
// remaining source has no orphaned indent line. Mirrors the detach
// step in `applyReparent`.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR } from "../oids";

export interface DeleteOperation {
  oid: string;
}

export interface DeleteResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
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

export function applyDelete(
  source: string,
  op: DeleteOperation
): DeleteResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
  }

  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl) {
    return { source, unchanged: true, reason: `oid "${op.oid}" not found` };
  }

  const parentMap = buildParentMap(ast);
  const parent = parentMap.get(srcEl) ?? null;
  if (!parent) {
    return {
      source,
      unchanged: true,
      reason: "element has no JSX parent (top-level) — cannot delete",
    };
  }

  // Direct-child check: srcEl must appear in parent.children. If it's
  // wrapped in `{cond && <X/>}` etc., it's not a direct child and we
  // bail — removing the wrapper would change runtime behaviour.
  const directChildIdx = (parent.children || []).indexOf(srcEl);
  if (directChildIdx === -1) {
    return {
      source,
      unchanged: true,
      reason:
        "element is inside a non-JSXElement wrapper (e.g. {cond && <X/>}) — delete the wrapper instead",
    };
  }

  const parentOpeningEnd = parent.openingElement?.end;
  if (typeof parentOpeningEnd !== "number") {
    return {
      source,
      unchanged: true,
      reason: "parent missing opening position info",
    };
  }
  if (typeof srcEl.start !== "number" || typeof srcEl.end !== "number") {
    return {
      source,
      unchanged: true,
      reason: "source element missing position info",
    };
  }

  // Find leading-WS start: walk children up to (not including) srcEl.
  // Whitespace-only JSXText is "transparent" (treat as part of the
  // indent that should be consumed); other child kinds advance the
  // start position past them. Same logic as `duplicate.ts`.
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

  const s = new MagicString(source);
  s.remove(leadingWsStart, srcEl.end);

  return { source: s.toString(), unchanged: false, reason: null };
}
