// Phase 3 Layer 4 — Operation engine for reparent. Per `maniuplation.md`
// §"Reparent (across containers)" (line 535). Sibling to `reorder.ts`.
// Moves a JSX element OUT of its current parent and INTO a different
// parent at a target child index. Optionally applies a property cleanup
// pass (e.g. drop `flexBasis` if new parent isn't flex; this engine
// doesn't decide which props need cleanup — the gesture path does, and
// passes the cleanup intent in via `propsToRemove` / `propsToSet`).
//
// Bail rules:
//   - Source doesn't parse → bail.
//   - oid not found → bail.
//   - newParentOid not found → bail.
//   - newParent is the same JSX node as oid's current direct parent
//     → bail with reason "newParent === oldParent" (caller should use
//     reorder, not reparent).
//   - newParent is oid itself or a descendant of oid → bail (would
//     create a cycle).
//   - newParent is self-closing OR has no closing tag → bail.
//   - newParent has a non-JSXElement / non-whitespace JSXText child
//     interleaved with real children → bail. Same restriction as
//     `applyReorder`. Vibecoders rarely hit this.
//   - oid's old parent has interleaved non-whitespace text → bail
//     (need clean leading-WS to detach cleanly).
//   - insertIndex out of [0, newRealChildren.length] → bail. Note
//     the inclusive upper bound — appending past the last child is
//     valid (insertIndex === N appends at the end).
//
// Whitespace handling on detach: removes the moved element AND the
// whitespace between the previous real sibling's end (or old parent's
// opening end, if it's the first) and the moved element's start. So
// the moved element's leading "\n  " is consumed with it.
//
// Whitespace handling on insert: derives an indent string from the
// new parent's existing children:
//   - newParent has children → use the leading whitespace of the
//     real child at `insertIndex` (when inserting before it) or the
//     last child (when appending past the end).
//   - newParent has no real children → use "\n  ".
//
// The leading indent is prepended to the moved element's text. The
// element text itself is captured AS-IS from the source (preserves
// internal indentation, attributes, nested OIDs).
//
// Property cleanup: if `propsToRemove` and/or `propsToSet` are
// non-empty, the engine runs a follow-up `applyStyleProps` pass on
// the post-reparent source, targeting the same OID (which now lives
// in its new location). Two parses, one source rewrite returned.
// Callers that don't want cleanup pass empty arrays / undefined.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR } from "../oids";
import { applyStyleProps } from "./style";

export interface ReparentOperation {
  oid: string;
  newParentOid: string;
  // 0-based target index within newParent's real children, post-insert.
  // Equal to newRealChildren.length means "append at the end".
  insertIndex: number;
  // Optional cleanup pass — props to remove (`null` semantics in
  // applyStyleProps) and props to set after the move. Both are
  // applied on the moved element via a second-pass applyStyleProps.
  propsToRemove?: string[];
  propsToSet?: Record<string, string>;
}

export interface ReparentResult {
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

// Walk that records each visited JSXElement's parent. Returns a Map
// keyed by JSXElement → its containing JSXElement (or null for root).
// Built once; consulted by oldParent lookup + ancestry checks.
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

// Returns true if `candidate` is `target` itself or a descendant of
// `target`. Used to reject reparent operations that would create a
// cycle (drop element into its own descendant).
function isWithin(target: any, candidate: any): boolean {
  if (!target || !candidate) return false;
  if (target === candidate) return true;
  if (typeof target.start !== "number" || typeof target.end !== "number")
    return false;
  if (typeof candidate.start !== "number" || typeof candidate.end !== "number")
    return false;
  return candidate.start >= target.start && candidate.end <= target.end;
}

interface RealChildInfo {
  oid: string | null;
  start: number;
  end: number;
}

// Validate a parent's children are reorder-friendly (only JSXElement +
// whitespace JSXText). Returns the real-children list on success, or
// a bail reason on failure.
function classifyChildren(
  parent: any
):
  | { ok: true; real: RealChildInfo[] }
  | { ok: false; reason: string } {
  const children = parent.children || [];
  const real: RealChildInfo[] = [];
  for (const c of children) {
    if (c.type === "JSXText") {
      if (typeof c.value === "string" && c.value.trim() === "") continue;
      return {
        ok: false,
        reason:
          "parent has non-whitespace text content — reparent not supported",
      };
    }
    if (c.type !== "JSXElement") {
      return {
        ok: false,
        reason: `parent has non-element child (${c.type}) — reparent not supported in v1`,
      };
    }
    if (typeof c.start !== "number" || typeof c.end !== "number") {
      return { ok: false, reason: "child element missing position info" };
    }
    const oid = getOidFromAttrs(c.openingElement?.attributes || []);
    real.push({ oid, start: c.start, end: c.end });
  }
  return { ok: true, real };
}

export function applyReparent(
  source: string,
  op: ReparentOperation
): ReparentResult {
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
  const newParent = findJsxElementByOid(ast, op.newParentOid);
  if (!newParent) {
    return {
      source,
      unchanged: true,
      reason: `newParent oid "${op.newParentOid}" not found`,
    };
  }

  if (newParent.openingElement?.selfClosing || !newParent.closingElement) {
    return {
      source,
      unchanged: true,
      reason: "newParent is self-closing — cannot accept children",
    };
  }
  if (isWithin(srcEl, newParent)) {
    return {
      source,
      unchanged: true,
      reason: "newParent is the moved element or its descendant — cycle",
    };
  }

  const parentMap = buildParentMap(ast);
  const oldParent = parentMap.get(srcEl) ?? null;
  if (!oldParent) {
    return {
      source,
      unchanged: true,
      reason: "moved element has no JSX parent (top-level)",
    };
  }
  if (oldParent === newParent) {
    return {
      source,
      unchanged: true,
      reason:
        "newParent === oldParent — use reorder, not reparent",
    };
  }

  // Classify both parents' children. Old parent must be reorder-friendly
  // (so the detach removes only what we expect); new parent must accept
  // children (already partly checked above) AND be reorder-friendly so
  // the insert lands at a predictable index.
  const oldClass = classifyChildren(oldParent);
  if (!oldClass.ok) {
    return { source, unchanged: true, reason: `old parent: ${oldClass.reason}` };
  }
  const newClass = classifyChildren(newParent);
  if (!newClass.ok) {
    return { source, unchanged: true, reason: `new parent: ${newClass.reason}` };
  }

  if (op.insertIndex < 0 || op.insertIndex > newClass.real.length) {
    return {
      source,
      unchanged: true,
      reason: `insertIndex ${op.insertIndex} out of range [0, ${newClass.real.length}]`,
    };
  }

  // Find srcEl's index within oldParent.
  const srcIdx = oldClass.real.findIndex((rc) => rc.oid === op.oid);
  if (srcIdx === -1) {
    // Fallback identity check by node start position (when OID isn't on
    // the source element — shouldn't happen since findJsxElementByOid
    // located it via OID, but defensively cover it).
    return {
      source,
      unchanged: true,
      reason:
        "moved element not found among old parent's real children (likely interleaved JSXExpressionContainer or similar)",
    };
  }

  const oldOpeningEnd = oldParent.openingElement?.end;
  const oldClosingStart = oldParent.closingElement?.start;
  const newOpeningEnd = newParent.openingElement?.end;
  const newClosingStart = newParent.closingElement?.start;
  if (
    typeof oldOpeningEnd !== "number" ||
    typeof oldClosingStart !== "number" ||
    typeof newOpeningEnd !== "number" ||
    typeof newClosingStart !== "number"
  ) {
    return {
      source,
      unchanged: true,
      reason: "parent missing opening/closing position info",
    };
  }

  // Element text — verbatim from source.
  const elText = source.slice(srcEl.start, srcEl.end);

  // Removal range from old parent: from previous real child's end (or
  // openingEnd if first) up to srcEl.end. This consumes the leading
  // separator (whitespace between prev child and srcEl, or between
  // openingEnd and srcEl).
  const detachStart =
    srcIdx === 0 ? oldOpeningEnd : oldClass.real[srcIdx - 1]!.end;
  const detachEnd = srcEl.end;

  // Insertion position + indent in newParent.
  // - insertIndex === 0 with no children → insert just after openingEnd
  //   with default indent.
  // - insertIndex === 0 with children → insert just after openingEnd
  //   with the same leading indent as the existing first child.
  // - insertIndex === N (mid) → insert just after real[N-1].end with
  //   the leading indent of the real[N] (sibling we're inserting before).
  // - insertIndex === realChildren.length (end) → insert just after
  //   real[N-1].end with the leading indent of real[N-1] (the last
  //   sibling, mirrored).
  let insertPos: number;
  let indent: string;
  if (newClass.real.length === 0) {
    insertPos = newOpeningEnd;
    indent = "\n  ";
  } else if (op.insertIndex === 0) {
    insertPos = newOpeningEnd;
    indent = source.slice(newOpeningEnd, newClass.real[0]!.start);
  } else if (op.insertIndex === newClass.real.length) {
    insertPos = newClass.real[newClass.real.length - 1]!.end;
    // Use the same indent as the last child (extracted from BEFORE it).
    const lastIdx = newClass.real.length - 1;
    const before =
      lastIdx === 0 ? newOpeningEnd : newClass.real[lastIdx - 1]!.end;
    indent = source.slice(before, newClass.real[lastIdx]!.start);
  } else {
    insertPos = newClass.real[op.insertIndex - 1]!.end;
    indent = source.slice(
      newClass.real[op.insertIndex - 1]!.end,
      newClass.real[op.insertIndex]!.start
    );
  }

  const insertText = indent + elText;

  // Apply both operations.
  const s = new MagicString(source);
  s.remove(detachStart, detachEnd);
  s.appendLeft(insertPos, insertText);
  let out = s.toString();

  // Optional cleanup pass.
  const removes = op.propsToRemove ?? [];
  const sets = op.propsToSet ?? {};
  if (removes.length > 0 || Object.keys(sets).length > 0) {
    const decls: Record<string, string | null | undefined> = {};
    for (const k of removes) decls[k] = null;
    for (const [k, v] of Object.entries(sets)) decls[k] = v;
    const cleaned = applyStyleProps(out, { oid: op.oid, declarations: decls });
    if (!cleaned.unchanged) {
      out = cleaned.source;
    }
    // If applyStyleProps unchanged with a real reason (parse failure
    // post-move shouldn't happen — we just produced it — but if it does,
    // the move still landed; we just skip cleanup. unchanged: null reason
    // means "nothing to clean up", which is fine.)
  }

  return { source: out, unchanged: false, reason: null };
}
