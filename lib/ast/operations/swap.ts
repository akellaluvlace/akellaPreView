// Phase 5 / Phase C — Operation engine for swap. Sibling to
// `insert.ts` / `duplicate.ts` / `delete.ts`. Replaces the element
// identified by `oid` wholesale with a parsed library asset.
//
// Default behaviour: children of the original element are DISCARDED
// (locked decision §1.9 of `phase5-tools-isolation.md` — preserve-
// children was named "v2" in §5).
//
// Twenty-third pass — `preserveChildren: true` opts into the v2
// behaviour. The asset's root element provides the new shell (tag,
// className, attributes, OIDs) but its INNER CONTENT is replaced with
// the original element's children verbatim (preserving each child's
// OID — they're the user's existing source bytes, not the asset's).
// Use case: "swap this <a> for a <button> but keep the label text +
// nested icons". Triggered from the UI by Alt-click on a swap-context
// tile. Default false → existing behaviour unchanged.
//
// Bail rules:
//   - Source doesn't parse → bail.
//   - oid not found → bail.
//   - Element has no JSX parent (it's the document/JSX root) → bail
//     with reason "Can't swap the root element".
//   - Asset doesn't parse as JSX (wrapped in a synthetic fragment) →
//     bail.
//   - Element missing position info (defensive) → bail.
//   - `preserveChildren` AND asset has multiple top-level elements →
//     bail with reason "asset has multiple roots — preserve-children
//     needs a single wrapper" (preserve-children is only meaningful
//     when there's exactly one shell to preserve INTO).
//   - `preserveChildren` AND asset's root is self-closing → bail with
//     reason "asset root is self-closing — can't preserve children"
//     (no slot to put the children into).
//
// OID strategy: identical to `insert.ts`. We walk every
// JSXOpeningElement in the parsed asset and either replace its
// existing `data-dropin-id="..."` attribute value with a fresh mint
// OR insert a new attribute right after the opening tag's name. Mints
// are seeded by `srcEl.start + counter * 7919`. Seen-set is built
// from the entire pre-swap source (including the element being
// removed — that's fine because the new asset replaces those bytes
// wholesale, so collision against an OID that disappears is harmless).
// Under `preserveChildren`, OID edits inside the asset's preserved-
// children range are filtered out (they'd touch bytes we're about to
// replace with the source's children) — the seen-set bumps still
// happen but the resulting OIDs go unused. Cosmetically wasteful, no
// correctness impact.
//
// Returns `swappedOid`: the freshly-minted OID of the asset's root
// element. Null only on bail.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR, makeOid, isValidOid } from "../oids";

export interface SwapOperation {
  oid: string;
  jsx: string;
  // Twenty-third pass — opt into preserve-children semantics. See the
  // header comment for the full contract. Default `false` (or omitted)
  // keeps the v1 discard-children behaviour every existing caller
  // depends on.
  preserveChildren?: boolean;
  // Phase F — allow swapping a root JSX element (no JSX parent). Used
  // by the everywhere-mode flow to replace a component definition's
  // body. Default `false`: keeps the existing "Can't swap the root
  // element" bail for the single-instance path (where swapping the
  // page root would empty the source). When `true`, the engine writes
  // the byte range as usual; the function around the JSX root is
  // unaffected.
  allowRootSwap?: boolean;
}

export interface SwapResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
  swappedOid: string | null;
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

function parseAsset(jsx: string): any | null {
  const trimmed = jsx.trim();
  if (!trimmed) return null;
  const wrapped = `(<>${trimmed}</>);`;
  try {
    return parse(wrapped, PARSE_OPTS);
  } catch {
    return null;
  }
}

function findAssetRange(wrapAst: any): { start: number; end: number; fragment: any } | null {
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
  return { start, end, fragment: frag };
}

export function applySwap(
  source: string,
  op: SwapOperation
): SwapResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return {
      source,
      unchanged: true,
      reason: `parse failed: ${String(e)}`,
      swappedOid: null,
    };
  }

  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl) {
    return {
      source,
      unchanged: true,
      reason: `oid "${op.oid}" not found`,
      swappedOid: null,
    };
  }

  const parentMap = buildParentMap(ast);
  const parent = parentMap.get(srcEl) ?? null;
  if (!parent && !op.allowRootSwap) {
    return {
      source,
      unchanged: true,
      reason: "Can't swap the root element",
      swappedOid: null,
    };
  }

  if (typeof srcEl.start !== "number" || typeof srcEl.end !== "number") {
    return {
      source,
      unchanged: true,
      reason: "source element missing position info",
      swappedOid: null,
    };
  }

  const assetAst = parseAsset(op.jsx);
  if (!assetAst) {
    return {
      source,
      unchanged: true,
      reason: "asset failed to parse as JSX",
      swappedOid: null,
    };
  }
  const assetRange = findAssetRange(assetAst);
  if (!assetRange) {
    return {
      source,
      unchanged: true,
      reason: "asset wrapper produced no fragment node",
      swappedOid: null,
    };
  }

  const wrapped = `(<>${op.jsx.trim()}</>);`;
  const assetText = wrapped.slice(assetRange.start, assetRange.end);
  if (!assetText.trim()) {
    return {
      source,
      unchanged: true,
      reason: "asset had no JSX content",
      swappedOid: null,
    };
  }

  const openings: any[] = [];
  collectOpenings(assetAst, openings);
  openings.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));

  // Twenty-third pass — preserve-children precondition checks. We
  // need a single asset root with a closing element so we have a
  // unique slot to splice the source's children into. Both checks
  // run BEFORE any mints happen so a bail leaves the seen-set
  // untouched and the source unchanged.
  let preserveChildren = false;
  let assetRootInner: { start: number; end: number } | null = null;
  if (op.preserveChildren) {
    const fragChildren: any[] = Array.isArray(assetRange.fragment?.children)
      ? assetRange.fragment.children
      : [];
    const topElements = fragChildren.filter(
      (c: any) => c && c.type === "JSXElement"
    );
    if (topElements.length === 0) {
      return {
        source,
        unchanged: true,
        reason: "asset has no JSX root to preserve children into",
        swappedOid: null,
      };
    }
    if (topElements.length > 1) {
      return {
        source,
        unchanged: true,
        reason:
          "asset has multiple roots — preserve-children needs a single wrapper",
        swappedOid: null,
      };
    }
    const root = topElements[0];
    if (!root.closingElement) {
      return {
        source,
        unchanged: true,
        reason: "asset root is self-closing — can't preserve children",
        swappedOid: null,
      };
    }
    const innerStart = root.openingElement?.end;
    const innerEnd = root.closingElement?.start;
    if (typeof innerStart !== "number" || typeof innerEnd !== "number") {
      return {
        source,
        unchanged: true,
        reason: "asset root missing inner-range position info",
        swappedOid: null,
      };
    }
    preserveChildren = true;
    assetRootInner = {
      start: innerStart - assetRange.start,
      end: innerEnd - assetRange.start,
    };
  }

  const seen = new Set<string>();
  collectAllOids(ast, seen);
  // The element being swapped will disappear from the source — its
  // OIDs collide harmlessly with any fresh mint we hand out. We could
  // walk srcEl's subtree and remove its OIDs from `seen` to shrink
  // the search space, but the seen-set is unbounded anyway and the
  // mint loop is cheap. Skip the optimisation.
  //
  // For preserve-children we ALSO add srcEl's subtree OIDs to the
  // seen-set BEFORE we start minting fresh OIDs for the asset's
  // openings. The preserved children carry their existing OIDs into
  // the new shell, so a fresh OID that happens to collide with one
  // of those would create a duplicate-OID source. The bump loop
  // already guarantees uniqueness against `seen`; we just need it
  // populated with the OIDs that will SURVIVE the swap.
  if (preserveChildren) {
    collectAllOids(srcEl, seen);
  }

  type Edit = { start: number; end: number; text: string };
  const edits: Edit[] = [];
  let swappedOid: string | null = null;

  for (let i = 0; i < openings.length; i++) {
    const opening = openings[i];
    const fresh = mintFresh(srcEl.start + i * 7919, seen);
    seen.add(fresh);
    if (i === 0) swappedOid = fresh;

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

  // Twenty-third pass — preserve-children edit set. Filter OID edits
  // whose original-coord position lies inside the asset's root inner
  // range (those edits touch the bytes we're about to replace). Add
  // a single replacement edit that swaps the asset's inner content
  // for srcEl's children verbatim. srcChildrenText is empty when
  // srcEl is self-closing — that's a deliberate "preserve nothing"
  // outcome the caller opted into.
  let stagedEdits = edits;
  if (preserveChildren && assetRootInner) {
    const innerStart = assetRootInner.start;
    const innerEnd = assetRootInner.end;
    let srcChildrenText = "";
    const srcOpening = srcEl.openingElement;
    const srcClosing = srcEl.closingElement;
    if (
      srcOpening &&
      srcClosing &&
      typeof srcOpening.end === "number" &&
      typeof srcClosing.start === "number"
    ) {
      srcChildrenText = source.slice(srcOpening.end, srcClosing.start);
    }
    stagedEdits = edits.filter(
      (e) => e.start < innerStart || e.start >= innerEnd
    );
    stagedEdits.push({
      start: innerStart,
      end: innerEnd,
      text: srcChildrenText,
    });
  }

  stagedEdits.sort((a, b) => b.start - a.start);
  let stamped = assetText;
  for (const e of stagedEdits) {
    stamped = stamped.slice(0, e.start) + e.text + stamped.slice(e.end);
  }

  const s = new MagicString(source);
  s.overwrite(srcEl.start, srcEl.end, stamped);

  return {
    source: s.toString(),
    unchanged: false,
    reason: null,
    swappedOid,
  };
}
