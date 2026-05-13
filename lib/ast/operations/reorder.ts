// Phase 3 Layer 4 — Operation engine for reorder. Per `maniuplation.md`
// §"Reorder and Reparent System" (line 522). Sibling to `reparent.ts`,
// `resize.ts`, `spacing.ts`, `style.ts`. Same magic-string + Babel
// pattern; this engine moves a JSX element to a new index within the
// SAME parent's children list.
//
// Bail rules:
//   - Source doesn't parse → bail.
//   - parentOid not found → bail.
//   - Parent is self-closing (no children) → bail.
//   - Parent has non-whitespace JSXText interleaved between real
//     children → bail. Reorder needs clean whitespace separators so
//     "moving an element" doesn't accidentally drag adjacent text with
//     it. Vibecoders rarely hit this; the gesture path surfaces the
//     bail reason as a warn toast.
//   - Parent has a non-JSXElement real child (e.g. JSXExpressionContainer
//     `{cond && <X/>}` or JSXFragment) → bail. v1 only reorders pure
//     element lists.
//   - oid is not a direct JSXElement child of parentOid → bail.
//   - toIndex out of range [0, realChildren.length-1] → bail.
//   - toIndex === fromIndex → intentional no-op (`unchanged: true`,
//     reason: null).
//
// Lossless on no-op: re-running with the post-move state at the same
// fromIndex/toIndex returns byte-identical source (no-op branch above).
//
// Whitespace handling: each "row" composed for the rewrite is the
// element's source bytes plus the whitespace immediately preceding it
// (all the way back to the previous real child's end, or to the
// parent's opening tag end for the first row). When rows reshuffle,
// each element's leading whitespace travels with it. So an element
// originally indented with "\n  " stays indented with "\n  " in its
// new slot.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR } from "../oids";

export interface ReorderOperation {
  oid: string;
  parentOid: string;
  // 0-based target index within parent's real (JSXElement) children,
  // post-move. `fromIndex === toIndex` is an intentional no-op.
  toIndex: number;
}

export interface ReorderResult {
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

export function applyReorder(
  source: string,
  op: ReorderOperation
): ReorderResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
  }

  const parentEl = findJsxElementByOid(ast, op.parentOid);
  if (!parentEl) {
    return {
      source,
      unchanged: true,
      reason: `parent oid "${op.parentOid}" not found`,
    };
  }
  if (parentEl.openingElement?.selfClosing || !parentEl.closingElement) {
    return {
      source,
      unchanged: true,
      reason: "parent is self-closing — no children to reorder",
    };
  }

  const children = parentEl.children || [];
  type RealChild = { oid: string | null; end: number };
  const realChildren: RealChild[] = [];
  for (const c of children) {
    if (c.type === "JSXText") {
      if (typeof c.value === "string" && c.value.trim() === "") continue;
      return {
        source,
        unchanged: true,
        reason:
          "parent has non-whitespace text content — reorder not supported",
      };
    }
    if (c.type !== "JSXElement") {
      return {
        source,
        unchanged: true,
        reason: `parent has non-element child (${c.type}) — reorder not supported in v1`,
      };
    }
    if (typeof c.start !== "number" || typeof c.end !== "number") {
      return {
        source,
        unchanged: true,
        reason: "child element missing position info",
      };
    }
    const oid = getOidFromAttrs(c.openingElement?.attributes || []);
    realChildren.push({ oid, end: c.end });
  }

  if (realChildren.length === 0) {
    return {
      source,
      unchanged: true,
      reason: "parent has no real children",
    };
  }

  const fromIndex = realChildren.findIndex((rc) => rc.oid === op.oid);
  if (fromIndex === -1) {
    return {
      source,
      unchanged: true,
      reason: `oid "${op.oid}" is not a direct child of parent "${op.parentOid}"`,
    };
  }
  if (op.toIndex < 0 || op.toIndex > realChildren.length - 1) {
    return {
      source,
      unchanged: true,
      reason: `toIndex ${op.toIndex} out of range [0, ${
        realChildren.length - 1
      }]`,
    };
  }
  if (op.toIndex === fromIndex) {
    return { source, unchanged: true, reason: null };
  }

  const openingEnd = parentEl.openingElement?.end;
  const closingStart = parentEl.closingElement?.start;
  if (typeof openingEnd !== "number" || typeof closingStart !== "number") {
    return {
      source,
      unchanged: true,
      reason: "parent missing opening/closing position info",
    };
  }

  // Compose rows. Row i = source.slice(prevEnd, child[i].end). Leading
  // whitespace of child[0] runs from openingEnd; subsequent rows run
  // from the previous child's end. Trailing whitespace (from last
  // child's end to parent's closing tag start) is preserved verbatim.
  const rows: string[] = [];
  let cursor = openingEnd;
  for (const rc of realChildren) {
    rows.push(source.slice(cursor, rc.end));
    cursor = rc.end;
  }
  const trailing = source.slice(cursor, closingStart);

  // Splice-and-reinsert.
  const moved = rows.splice(fromIndex, 1)[0]!;
  rows.splice(op.toIndex, 0, moved);

  const s = new MagicString(source);
  s.overwrite(openingEnd, closingStart, rows.join("") + trailing);

  return { source: s.toString(), unchanged: false, reason: null };
}
