// Phase 2 Step 9 (Properties Panel) — Reads CURRENT inline-style
// declarations from a JSX opening element's `style={{...}}` ObjectExpression
// for a given OID. The Properties Panel uses this to populate its numeric
// inputs with whatever values the user has typed in source.
//
// Limitations (v1):
//   - Only reads ObjectExpression. `style={cn(...)}` / `style={var}` /
//     `style="..."` → returns an empty record (matches `applyStyleProps`'
//     bail behaviour — the panel can't write to those either, so showing
//     them in the inputs would be misleading).
//   - Only reads StringLiteral / NumericLiteral values. Computed
//     expressions (`width: variable`, `` width: `${n}px` ``) → not surfaced.
//     The panel displays empty for those; user can type a new value
//     and overwrite (which `applyStyleProps` will do via in-place
//     valueStart/valueEnd overwrite, replacing whatever expression was
//     there with a string literal).
//   - No fallback to `getComputedStyle` / Layout Inspector — that's a
//     future enhancement (would surface values inherited from Tailwind
//     classes / cascade). v1 only shows what's directly in source so
//     the inputs reflect "what changing this number rewrites in the file".

import { parse, type ParserOptions } from "@babel/parser";
import { walkJsxOpenings, OID_ATTR } from "./oids";

const PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

export function readSourceStyle(
  source: string,
  oid: string
): Record<string, string> {
  let ast: unknown;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch {
    return {};
  }

  let target: any = null;
  walkJsxOpenings(ast, (opening: any) => {
    if (target) return;
    for (const a of opening?.attributes || []) {
      if (
        a?.type === "JSXAttribute" &&
        a.name?.type === "JSXIdentifier" &&
        a.name.name === OID_ATTR &&
        a.value?.type === "StringLiteral" &&
        a.value.value === oid
      ) {
        target = opening;
        return;
      }
    }
  });

  if (!target) return {};

  const styleAttr = (target.attributes || []).find(
    (a: any) =>
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      a.name.name === "style"
  );
  if (!styleAttr || !styleAttr.value) return {};
  if (styleAttr.value.type !== "JSXExpressionContainer") return {};
  const expr = styleAttr.value.expression;
  if (!expr || expr.type !== "ObjectExpression") return {};

  const result: Record<string, string> = {};
  for (const p of expr.properties || []) {
    if (p?.type !== "ObjectProperty") continue;
    let propName: string | null = null;
    if (p.key?.type === "Identifier") propName = p.key.name;
    else if (p.key?.type === "StringLiteral") propName = p.key.value;
    if (!propName) continue;
    let value: string | null = null;
    if (p.value?.type === "StringLiteral") value = p.value.value;
    else if (p.value?.type === "NumericLiteral") value = String(p.value.value);
    if (value === null) continue;
    result[propName] = value;
  }
  return result;
}
