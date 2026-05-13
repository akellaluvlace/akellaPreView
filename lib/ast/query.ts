// AST query API keyed by `data-dropin-id` (the OIDs `lib/ast/oids.ts` mints).
//
// This is the Layer 1 query surface from `maniuplation.md`:
//
//   ast.findById(id) → node
//   ast.parent(id)   → node
//   ast.children(id) → node[]
//   ast.siblings(id) → node[]    (excludes self, matches Onlook semantics)
//   ast.ancestors(id)→ node[]    (root → immediate parent)
//
// `computedClasses` and `appliedRules` need PostCSS + the resolved Tailwind
// theme — those land in Layer 2 (Layout Inspector) work. Phase 1 ships only
// the structural queries; the styling-aware queries get added when their
// downstream consumer (the Layer 2 inspector context object) goes in.
//
// Building the index is `O(N)` over the AST. Re-build on every parse —
// don't try to update incrementally; the parse itself is the cheap part
// (<5 ms p99 for our largest 1000-line templates per the spec's perf budget).

import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR } from "./oids";

const PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

export interface QueryNode {
  oid: string;
  // The JSXElement node — wraps openingElement, children, closingElement.
  // Typed loosely as `unknown` at the boundary so callers can either narrow
  // with their own Babel type imports or treat it as opaque AST data.
  element: unknown;
  parentOid: string | null;
  childrenOids: string[];
  // Element name as it appears in the source (e.g. `div`, `Foo`, `Foo.Bar`).
  // Lowercased intrinsics are HTML; capitalized are React components. We
  // expose both so the Layer 2 inspector and Layer 3 intent resolver can
  // make their own decisions about how to handle each.
  tagName: string;
}

export interface AstIndex {
  findById(oid: string): QueryNode | null;
  parent(oid: string): QueryNode | null;
  children(oid: string): QueryNode[];
  siblings(oid: string): QueryNode[];
  ancestors(oid: string): QueryNode[];
  // All OIDs in document order (depth-first, opening-tag-first).
  all(): QueryNode[];
}

export function buildIndex(source: string): AstIndex {
  const map = new Map<string, QueryNode>();
  const ordered: string[] = [];

  let ast: unknown;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch {
    return makeIndex(map, ordered);
  }

  visit(ast, null, map, ordered);
  return makeIndex(map, ordered);
}

// Recursive visitor that tracks the parent OID. JSXElement nodes mint a
// QueryNode and become the new parent context for their children; everything
// else (Program, function bodies, ConditionalExpressions, etc.) recurses
// while preserving the outer parent context.
//
// JSXFragment (`<>...</>`) has no opening tag with attributes → no OID; its
// children inherit the fragment's parent. This matches what users expect:
// fragments are layout-invisible.
function visit(
  node: unknown,
  parentOid: string | null,
  map: Map<string, QueryNode>,
  ordered: string[]
): void {
  if (!node || typeof node !== "object") return;
  const n = node as any;

  if (n.type === "JSXElement") {
    const opening = n.openingElement;
    const oid = readOidAttr(opening);
    const tagName = readTagName(opening);
    let myOid: string | null = null;
    if (oid) {
      myOid = oid;
      if (!map.has(oid)) {
        // First occurrence wins. Duplicates are dropped from the index — the
        // injector regenerates them on the next inject pass anyway.
        const node: QueryNode = {
          oid,
          element: n,
          parentOid,
          childrenOids: [],
          tagName,
        };
        map.set(oid, node);
        ordered.push(oid);
        if (parentOid) {
          const p = map.get(parentOid);
          if (p) p.childrenOids.push(oid);
        }
      }
    }
    const childParent = myOid ?? parentOid;
    for (const child of n.children || []) {
      visit(child, childParent, map, ordered);
    }
    return;
  }

  if (n.type === "JSXFragment") {
    for (const child of n.children || []) {
      visit(child, parentOid, map, ordered);
    }
    return;
  }

  // Generic descent. Skip metadata keys, the openingElement / closingElement
  // (we already touched them via the JSXElement branch above), and the loc
  // bookkeeping keys.
  for (const key in n) {
    if (
      key === "loc" ||
      key === "start" ||
      key === "end" ||
      key === "tokens" ||
      key === "comments" ||
      key === "extra" ||
      key === "leadingComments" ||
      key === "trailingComments" ||
      key === "openingElement" ||
      key === "closingElement" ||
      key === "openingFragment" ||
      key === "closingFragment"
    ) {
      continue;
    }
    const child = n[key];
    if (Array.isArray(child)) {
      for (const c of child) visit(c, parentOid, map, ordered);
    } else if (child && typeof child === "object" && child.type) {
      visit(child, parentOid, map, ordered);
    }
  }
}

function readOidAttr(opening: any): string | null {
  for (const a of opening?.attributes || []) {
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

function readTagName(opening: any): string {
  const name = opening?.name;
  if (!name) return "";
  if (name.type === "JSXIdentifier") return name.name;
  if (name.type === "JSXMemberExpression") {
    return readMemberName(name);
  }
  if (name.type === "JSXNamespacedName") {
    // `<svg:circle>` — uncommon in our world but cheap to handle.
    return `${name.namespace?.name ?? ""}:${name.name?.name ?? ""}`;
  }
  return "";
}

function readMemberName(node: any): string {
  const left =
    node.object?.type === "JSXMemberExpression"
      ? readMemberName(node.object)
      : node.object?.name ?? "";
  const right = node.property?.name ?? "";
  return left && right ? `${left}.${right}` : left || right;
}

function makeIndex(map: Map<string, QueryNode>, ordered: string[]): AstIndex {
  return {
    findById(oid) {
      return map.get(oid) ?? null;
    },
    parent(oid) {
      const n = map.get(oid);
      if (!n || !n.parentOid) return null;
      return map.get(n.parentOid) ?? null;
    },
    children(oid) {
      const n = map.get(oid);
      if (!n) return [];
      return n.childrenOids
        .map((id) => map.get(id))
        .filter((x): x is QueryNode => Boolean(x));
    },
    siblings(oid) {
      const n = map.get(oid);
      if (!n || !n.parentOid) return [];
      const p = map.get(n.parentOid);
      if (!p) return [];
      return p.childrenOids
        .filter((id) => id !== oid)
        .map((id) => map.get(id))
        .filter((x): x is QueryNode => Boolean(x));
    },
    ancestors(oid) {
      const out: QueryNode[] = [];
      let cur = map.get(oid);
      while (cur && cur.parentOid) {
        const p = map.get(cur.parentOid);
        if (!p) break;
        out.unshift(p);
        cur = p;
      }
      return out;
    },
    all() {
      return ordered
        .map((id) => map.get(id))
        .filter((x): x is QueryNode => Boolean(x));
    },
  };
}
