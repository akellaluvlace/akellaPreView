// Phase 6 ramp (twenty-seventh pass) — batched same-parent reorder.
// Sibling to applyReorder. Where applyReorder moves ONE element to a new
// index, applyReorderMulti detaches a *set* of elements from one parent
// and re-inserts them as a contiguous block at a target slot. The shape
// `{ parentOid, oids, toIndex }` makes the math composable in a way the
// per-op-bumping over applyReorder never quite is — naive sequential
// applyReorder calls reverse adjacent-sibling drops because each detach
// + insert shifts subsequent toIndex anchors. See the resolver
// (`lib/ast/tree-dnd.ts resolveTreeDropMulti`) for the pre-engine
// translation from (tree, dragOids, target, position) to this op.
//
// Semantics:
//   • op.parentOid: the shared parent oid for every dragged oid.
//   • op.oids: the dragged set, in the order they should appear at the
//     drop slot. The resolver sorts by parent's DFS order so the
//     visual result matches the tree-row order the user grabbed from.
//   • op.toIndex: the index in the POST-DETACH (collapsed) child list
//     where the moved block lands. 0 = drop at the very front. Equal
//     to collapsedLen = (realChildren − dragged) means append at the
//     end. Out-of-range bails.
//
// Bail rules mirror applyReorder, plus:
//   • Empty oids → bail (caller should not invoke).
//   • Duplicate oid in op.oids → bail (caller should dedupe).
//   • Any oid not a direct child of parentOid → bail (engine bails
//     fast; caller relays to user via Reorder toast).
//   • toIndex out of [0, collapsedLen] → bail.
//
// No-op detection:
//   • If the sorted source indices form a consecutive run starting at
//     toIndex AND the caller's oids order matches that ascending order,
//     the moved block is already at the target slot — return unchanged
//     with reason: null (intentional no-op, matching applyReorder's
//     no-op contract).
//   • Defensive byte-comparison after the rewrite catches any edge the
//     fast-path missed.
//
// Whitespace handling matches applyReorder: each row's bytes include the
// whitespace immediately preceding the element (back to the previous
// real child's end, or to the parent opening's end for the first row).
// So an element indented `\n    ` keeps that indent at its new slot.
// Trailing whitespace between the last real child and the parent's
// closing tag is preserved verbatim.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR } from "../oids";

export interface ReorderMultiOperation {
  parentOid: string;
  oids: ReadonlyArray<string>;
  toIndex: number;
}

export interface ReorderMultiResult {
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

export function applyReorderMulti(
  source: string,
  op: ReorderMultiOperation
): ReorderMultiResult {
  if (op.oids.length === 0) {
    return { source, unchanged: true, reason: "no oids to reorder" };
  }

  const seenOids = new Set<string>();
  for (const o of op.oids) {
    if (seenOids.has(o)) {
      return {
        source,
        unchanged: true,
        reason: `duplicate oid "${o}" in reorder set`,
      };
    }
    seenOids.add(o);
  }

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

  const fromIndices: number[] = [];
  for (const oid of op.oids) {
    const idx = realChildren.findIndex((rc) => rc.oid === oid);
    if (idx === -1) {
      return {
        source,
        unchanged: true,
        reason: `oid "${oid}" is not a direct child of parent "${op.parentOid}"`,
      };
    }
    fromIndices.push(idx);
  }

  const collapsedLen = realChildren.length - op.oids.length;
  if (op.toIndex < 0 || op.toIndex > collapsedLen) {
    return {
      source,
      unchanged: true,
      reason: `toIndex ${op.toIndex} out of range [0, ${collapsedLen}]`,
    };
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

  const rows: string[] = [];
  let cursor = openingEnd;
  for (const rc of realChildren) {
    rows.push(source.slice(cursor, rc.end));
    cursor = rc.end;
  }
  const trailing = source.slice(cursor, closingStart);

  // Caller's op.oids order drives the moved block layout. The resolver
  // hands oids sorted by parent-DFS so the visual result matches the
  // tree's row order. A caller passing [B, A] when A precedes B in the
  // tree gets [B, A] at the drop slot — that's a valid "flip" request.
  const fromSet = new Set(fromIndices);
  const moved: string[] = op.oids.map(
    (_, i) => rows[fromIndices[i]!]!,
  );
  const remaining: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (!fromSet.has(i)) remaining.push(rows[i]!);
  }

  // No-op fast-path. The block is "already at the slot" iff
  //  (a) source indices form a consecutive run [s, s+1, ..., s+k-1], AND
  //  (b) caller's order matches that ascending order, AND
  //  (c) collapsed_toIndex equals s.
  // Caller-out-of-order ([B, A] when A precedes B) is a real shuffle
  // and bypasses the fast-path so the rewrite re-orders the block.
  const sortedFrom = [...fromIndices].sort((a, b) => a - b);
  const isContiguous = sortedFrom.every((v, i) => v === sortedFrom[0]! + i);
  const isCallerSorted = fromIndices.every((v, i) => v === sortedFrom[i]);
  if (isContiguous && isCallerSorted && sortedFrom[0] === op.toIndex) {
    return { source, unchanged: true, reason: null };
  }

  const newRows = [
    ...remaining.slice(0, op.toIndex),
    ...moved,
    ...remaining.slice(op.toIndex),
  ];

  const s = new MagicString(source);
  s.overwrite(openingEnd, closingStart, newRows.join("") + trailing);
  const out = s.toString();
  if (out === source) {
    return { source, unchanged: true, reason: null };
  }
  return { source: out, unchanged: false, reason: null };
}
