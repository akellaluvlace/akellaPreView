// 2026-05-15 — Element-source extraction for the "Copy this section"
// vibe-panel button. Given a full source string + an OID, returns the
// JSXElement's source bytes with OIDs stripped — clean code ready for
// the vibecoder to paste into ChatGPT/Claude for focused iteration on
// just that section.
//
// JSX mode only. HTML mode users still have the chrome-level Copy button
// for the full template (HTML mode has no per-element addressing that's
// useful to a vibecoder anyway — they don't think in element trees).
//
// Falls back to null when:
//   - Source doesn't parse (mid-typing edge case)
//   - OID not found in AST (e.g. selection landed on an OID-less element)
//   - Babel returns position info we can't use

import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR, stripOids } from "../ast/oids";

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

export interface GetElementSourceResult {
  ok: boolean;
  source: string | null;
  reason: string | null;
}

export function getJsxElementSource(
  source: string,
  oid: string,
): GetElementSourceResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { ok: false, source: null, reason: `parse failed: ${String(e)}` };
  }
  const el = findJsxElementByOid(ast, oid);
  if (!el) {
    return {
      ok: false,
      source: null,
      reason: `OID "${oid}" not found in source`,
    };
  }
  if (typeof el.start !== "number" || typeof el.end !== "number") {
    return {
      ok: false,
      source: null,
      reason: "element missing position info",
    };
  }
  const slice = source.slice(el.start, el.end);
  // Strip OIDs from the slice so the vibecoder pastes clean code into
  // their AI chat. `stripOids` operates on a full source string but
  // works fine on a JSXElement fragment (it's a regex-y pass, not a
  // full re-parse).
  const stripped = stripOids(slice).source;
  // Light dedent: find the smallest leading-whitespace common to every
  // non-empty line and trim it off. The JSXElement's source bytes
  // include whatever indentation it had at its source position (often
  // 4-8 spaces deep), which makes the pasted snippet look "off-center"
  // in the AI chat. Dedenting normalizes to 0-indent — vibecoder gets
  // a clean code block.
  const lines = stripped.split("\n");
  let minIndent = Infinity;
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i]!;
    if (line.trim().length === 0) continue;
    const lead = line.match(/^[ \t]*/);
    if (lead) minIndent = Math.min(minIndent, lead[0].length);
  }
  if (minIndent > 0 && minIndent !== Infinity) {
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i]!;
      if (line.length >= minIndent) lines[i] = line.slice(minIndent);
    }
  }
  return { ok: true, source: lines.join("\n"), reason: null };
}
