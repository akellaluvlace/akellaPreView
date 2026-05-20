// 2026-05-20 — Cascade detach. Per plan
// `docs/superpowers/plans/2026-05-15-cascade-detach.md`.
//
// User clicks one card in a 3-card grid. Cards come from
// `items.map((x) => <Card .../>)`. The JSX inside the callback has
// ONE source OID — so AI edits by OID hit all 3 rendered instances.
// User reported 2026-05-20: "ai changed all 3 cards when I wanted one."
//
// Fix: source rewrite. Split the .map() at index K into three siblings:
//   {arrayExpr.slice(0, K).map(callback)}         ← left slice (unchanged callback)
//   {((param0) => bodyExpr)(arrayExpr[K])}         ← detached IIFE: fresh OIDs
//   {arrayExpr.slice(K+1).map(rewrittenCallback)} ← right slice (callback w/ key shift if param1)
//
// The middle IIFE invokes the same callback shape but with arrayExpr[K]
// passed directly — preserves closure over outer variables, handles
// destructured params, sidesteps callback-body substitution edge cases.
// After the byte-rewrite, we strip OIDs from the middle range only and
// re-inject globally so the detached copy gets fresh OIDs and the
// remaining cascade keeps its original ones.
//
// Heavy bail-when-uncertain: full auto-loop-expansion is NOT the goal.
// We handle the ~80% common case (Identifier / MemberExpression /
// ArrayExpression sources, arrow callbacks with 1-2 args, single JSX
// root body, key={i} or no second-param) and bail with clear reasons
// for the harder cases (filter chains, named-fn refs, multi-root
// bodies, param1 used outside key).

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { injectOids, OID_ATTR } from "../oids";

export interface DetachFromMapOp {
  // OID shared across all rendered instances (source location key).
  oid: string;
  // DOM-index K — which rendered copy the user clicked (0-based).
  index: number;
}

export interface DetachFromMapResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
  // 2026-05-20 — When detach succeeds, the freshly-minted OID on the
  // detached middle JSX root. Host uses this to target the detached
  // instance for subsequent edits (patchJsxOuterByOid against this
  // new OID instead of the cascade-shared old one). Null on bail.
  newOid?: string | null;
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
  "innerComments",
]);

function ok(source: string): DetachFromMapResult {
  return { source, unchanged: false, reason: null };
}

function bail(source: string, reason: string): DetachFromMapResult {
  return { source, unchanged: true, reason };
}

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

// Walk the AST and return the full path-from-root to the JSXElement
// carrying the target OID. The path is used to walk UP from the
// element to find the enclosing .map() CallExpression.
function findJsxByOidWithPath(ast: any, oid: string): any[] | null {
  const stack: any[] = [];
  function walk(node: any): any[] | null {
    if (!node || typeof node !== "object") return null;
    stack.push(node);
    if (
      node.type === "JSXElement" &&
      getOidFromAttrs(node.openingElement?.attributes || []) === oid
    ) {
      return stack.slice();
    }
    for (const key in node) {
      if (SKIP_KEYS.has(key)) continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const c of child) {
          const r = walk(c);
          if (r) return r;
        }
      } else if (child && typeof child === "object") {
        const r = walk(child);
        if (r) return r;
      }
    }
    stack.pop();
    return null;
  }
  return walk(ast);
}

// Check that param1's Identifier is referenced ONLY as a bare
// JSXExpressionContainer wrapping just that identifier, inside a
// JSXAttribute named "key". Other uses (onClick handlers, computed
// keys, etc.) would break under our right-slice key shift.
function isParam1UsedOnlyAsBareKey(
  callbackBody: any,
  paramName: string,
): boolean {
  let violated = false;
  function walk(node: any, parent: any, grandparent: any): void {
    if (violated || !node || typeof node !== "object") return;
    if (node.type === "Identifier" && node.name === paramName) {
      const okPlacement =
        parent?.type === "JSXExpressionContainer" &&
        parent.expression === node &&
        grandparent?.type === "JSXAttribute" &&
        grandparent.name?.name === "key";
      if (!okPlacement) {
        violated = true;
      }
      return;
    }
    for (const key in node) {
      if (SKIP_KEYS.has(key)) continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const c of child) walk(c, node, parent);
      } else if (child && typeof child === "object") {
        walk(child, node, parent);
      }
      if (violated) return;
    }
  }
  walk(callbackBody, null, null);
  return !violated;
}

// Extract the single JSX root from an arrow callback body. Handles
// both shorthand (`() => <X/>`) and block (`() => { return <X/> }`).
// Returns null when body returns multiple statements or non-JSX.
function extractJsxRoot(arrowBody: any): any | null {
  if (!arrowBody || typeof arrowBody !== "object") return null;
  if (arrowBody.type === "JSXElement" || arrowBody.type === "JSXFragment") {
    return arrowBody;
  }
  if (arrowBody.type === "BlockStatement") {
    const stmts = arrowBody.body || [];
    let lastReturn: any = null;
    let returnCount = 0;
    for (const s of stmts) {
      if (s.type === "ReturnStatement") {
        returnCount++;
        lastReturn = s;
      }
    }
    if (returnCount !== 1 || !lastReturn) return null;
    const arg = lastReturn.argument;
    if (arg?.type === "JSXElement" || arg?.type === "JSXFragment") {
      return lastReturn.argument;
    }
  }
  return null;
}

function rewriteRightSliceKey(
  callbackSource: string,
  param1Name: string,
  shift: number,
): string {
  // Match `key={ <param1Name> }` with optional whitespace. Other key
  // shapes (string concat, ternary, etc.) were filtered out by
  // isParam1UsedOnlyAsBareKey earlier — only bare-identifier keys
  // remain to rewrite.
  const escaped = param1Name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`key=\\{\\s*${escaped}\\s*\\}`, "g");
  return callbackSource.replace(re, `key={${param1Name} + ${shift}}`);
}

export function applyDetachFromMap(
  source: string,
  op: DetachFromMapOp,
): DetachFromMapResult {
  if (!op.oid) return bail(source, "missing oid");
  if (!Number.isInteger(op.index) || op.index < 0) {
    return bail(source, "invalid index");
  }

  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return bail(source, `parse failed: ${String(e)}`);
  }

  const path = findJsxByOidWithPath(ast, op.oid);
  if (!path) return bail(source, `oid "${op.oid}" not found`);

  // Walk UP from the target JSXElement to find the nearest enclosing
  // `.map()` CallExpression. Stop at the first match — handles nested
  // maps correctly (innermost wins, which is what the click selected).
  let callExpr: any = null;
  for (let i = path.length - 1; i >= 0; i--) {
    const node = path[i];
    if (
      node?.type === "CallExpression" &&
      node.callee?.type === "MemberExpression" &&
      node.callee.property?.name === "map"
    ) {
      callExpr = node;
      break;
    }
  }
  if (!callExpr) {
    return bail(source, "element isn't rendered by a .map() call");
  }

  const arrExprNode = callExpr.callee.object;
  if (!arrExprNode) return bail(source, "map call has no source array");
  if (
    arrExprNode.type !== "Identifier" &&
    arrExprNode.type !== "MemberExpression" &&
    arrExprNode.type !== "ArrayExpression"
  ) {
    return bail(
      source,
      `can't detach from ${arrExprNode.type} source (filter/sort chains unsupported)`,
    );
  }
  if (
    typeof arrExprNode.start !== "number" ||
    typeof arrExprNode.end !== "number"
  ) {
    return bail(source, "array expression has no source position");
  }

  const callback = callExpr.arguments?.[0];
  if (!callback || callback.type !== "ArrowFunctionExpression") {
    return bail(
      source,
      "callback isn't an arrow function (named refs unsupported)",
    );
  }
  if (typeof callback.start !== "number" || typeof callback.end !== "number") {
    return bail(source, "callback has no source position");
  }
  const params = callback.params || [];
  if (params.length < 1 || params.length > 2) {
    return bail(source, "callback must take 1 or 2 args");
  }
  const param0 = params[0];
  const param1 = params[1] || null;
  if (
    typeof param0.start !== "number" ||
    typeof param0.end !== "number"
  ) {
    return bail(source, "first arg has no source position");
  }

  if (param1) {
    if (param1.type !== "Identifier" || !param1.name) {
      return bail(source, "second arg must be a plain identifier");
    }
    if (!isParam1UsedOnlyAsBareKey(callback.body, param1.name)) {
      return bail(
        source,
        `index var "${param1.name}" used outside key= (rewrite would change runtime behavior)`,
      );
    }
  }

  const bodyRoot = extractJsxRoot(callback.body);
  if (!bodyRoot) {
    return bail(source, "callback body must return a single JSX element");
  }
  if (
    typeof bodyRoot.start !== "number" ||
    typeof bodyRoot.end !== "number"
  ) {
    return bail(source, "callback body has no source position");
  }

  if (typeof callExpr.start !== "number" || typeof callExpr.end !== "number") {
    return bail(source, "map call has no source position");
  }

  const arrSrc = source.slice(arrExprNode.start, arrExprNode.end);
  const param0Src = source.slice(param0.start, param0.end);
  const callbackSrc = source.slice(callback.start, callback.end);
  const bodySrc = source.slice(bodyRoot.start, bodyRoot.end);

  const K = op.index;
  const shift = K + 1;
  const rightCallback = param1
    ? rewriteRightSliceKey(callbackSrc, param1.name, shift)
    : callbackSrc;

  // Build replacement string. The CallExpression is wrapped in a
  // JSXExpressionContainer like `{items.map(...)}` — we replace the
  // CallExpression bytes (NOT the surrounding `{}`) with three
  // expressions stitched by `}{` boundaries that close + reopen the
  // host JSXExpressionContainer, turning one container into three.
  const leftPart = `${arrSrc}.slice(0, ${K}).map(${callbackSrc})`;
  const middlePart = `((${param0Src}) => ${bodySrc})(${arrSrc}[${K}])`;
  const rightPart = `${arrSrc}.slice(${shift}).map(${rightCallback})`;
  const replacement = `${leftPart}}{${middlePart}}{${rightPart}`;

  const ms = new MagicString(source);
  ms.overwrite(callExpr.start, callExpr.end, replacement);
  let rewritten = ms.toString();

  // Strip OIDs from the middle IIFE's source bytes only, then
  // re-inject globally. The middle is the only place in `rewritten`
  // where we want fresh OIDs — the left/right slices keep the
  // original OID (their callback source is unchanged structurally).
  // Compute byte offsets in the rewritten source.
  const replaceStart = callExpr.start;
  const middleStart = replaceStart + leftPart.length + 2; // skip the }{
  const middleEnd = middleStart + middlePart.length;

  const before = rewritten.slice(0, middleStart);
  const middleBytes = rewritten.slice(middleStart, middleEnd);
  const after = rewritten.slice(middleEnd);
  const middleStripped = middleBytes.replace(/\s*data-dropin-id="[^"]*"/g, "");
  rewritten = before + middleStripped + after;

  // Re-inject OIDs globally. injectOids is idempotent — existing OIDs
  // stay (so left+right slices retain their cascade OID), and the
  // OID-less middle gets fresh ones.
  const reinjected = injectOids(rewritten);

  // Sanity: ensure the rewrite parses.
  try {
    parse(reinjected.source, PARSE_OPTS);
  } catch (e) {
    return bail(source, `rewrite produced invalid syntax: ${String(e)}`);
  }

  // Locate the new OID assigned to the detached middle IIFE. The
  // middle bytes were OID-less when we passed them to injectOids,
  // so it minted a fresh OID at the first JSX opening. We anchor on
  // the IIFE's distinctive `)(arrSrc[K])` argument injection — that
  // pattern is unique to the middle (the left/right slices use
  // `.map(...)` not `(...)(arr[K])`). Then walk BACKWARDS to find
  // the last OID attribute before the argument call, which sits on
  // the middle's root JSX element.
  let newOid: string | null = null;
  const finalSrc = reinjected.source;
  const iifeCallSig = `)(${arrSrc}[${K}])`;
  const iifeCallPos = finalSrc.indexOf(iifeCallSig, replaceStart);
  if (iifeCallPos >= 0) {
    // Find the last data-dropin-id attribute in [replaceStart, iifeCallPos].
    // Use a backwards lastIndexOf scan via a global regex bound to that range.
    const middleRangeText = finalSrc.slice(replaceStart, iifeCallPos);
    const re = /data-dropin-id="([^"]+)"/g;
    let lastMatch: RegExpExecArray | null = null;
    let m: RegExpExecArray | null;
    while ((m = re.exec(middleRangeText)) !== null) {
      lastMatch = m;
    }
    if (lastMatch) newOid = lastMatch[1];
  }
  // If lastMatch happens to be from the LEFT slice (its closing tag
  // came before the IIFE arg), filter out OIDs already shared by
  // left+right slices — those keep the original OID; the middle's
  // OID is the unique one.
  if (newOid && newOid === op.oid) {
    // Walk forward instead: find first OID inside the middle that
    // differs from op.oid. The middle starts AFTER the left slice's
    // closing `}{` boundary.
    const middleBlockStart = finalSrc.indexOf("}{", replaceStart);
    if (middleBlockStart >= 0 && middleBlockStart < iifeCallPos) {
      const middleOnly = finalSrc.slice(middleBlockStart, iifeCallPos);
      const re2 = /data-dropin-id="([^"]+)"/g;
      let m2: RegExpExecArray | null;
      while ((m2 = re2.exec(middleOnly)) !== null) {
        if (m2[1] !== op.oid) {
          newOid = m2[1];
          break;
        }
      }
    }
  }

  return { source: reinjected.source, unchanged: false, reason: null, newOid };
}
