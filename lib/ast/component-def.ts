// Phase 5 / Phase C / C3 — Inline component definition lookup.
//
// The propagation toggle's "everywhere" mode patches a component
// instance's className AND the corresponding inline definition's JSX
// root in the same source file. This module owns the scope-walk:
// given a tag name (e.g. "Card"), find the function definition's
// returned JSXElement and return its OID.
//
// Supported definition shapes (v1):
//   1. function Card() { return (<...>); }
//   2. const Card = () => <...>;
//   3. const Card = function() { return <...>; };
//   4. const Card = () => { return <...>; };
//
// Multi-file definitions (Card imported from `./Card`) are out of
// scope per locked decision §4.5; caller falls back to instance-only
// mode in that case.

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

// Given a function/arrow body, return the FIRST JSXElement we meet.
// For arrow expression bodies (`() => <X/>`) that's the body itself;
// for block bodies (`function() { return <X/>; }`) we walk to the
// return statement and inspect its argument. Returns null when the
// definition doesn't render a JSX element directly (returns null,
// returns a string, conditional render with no static root, etc.).
function findReturnedJsxElement(body: any): any | null {
  if (!body) return null;
  // Arrow expression body — the body IS the expression.
  if (body.type === "JSXElement") return body;
  if (body.type === "JSXFragment") {
    // Fragment root — find first JSXElement inside.
    for (const child of body.children || []) {
      if (child.type === "JSXElement") return child;
    }
    return null;
  }
  // Block body — walk top-level statements for ReturnStatement.
  if (body.type === "BlockStatement") {
    for (const stmt of body.body || []) {
      if (stmt.type === "ReturnStatement" && stmt.argument) {
        const arg = stmt.argument;
        if (arg.type === "JSXElement") return arg;
        if (arg.type === "JSXFragment") {
          for (const child of arg.children || []) {
            if (child.type === "JSXElement") return child;
          }
        }
        // Parenthesized expression → unwrap.
        if (arg.type === "ParenthesizedExpression") {
          return findReturnedJsxElement(arg.expression);
        }
      }
    }
  }
  return null;
}

// Walk top-level program body (and ExportNamedDeclaration / Default)
// for definitions matching the tag name.
function findDefinition(programBody: any[], name: string): any | null {
  for (const stmt of programBody) {
    if (!stmt) continue;
    let inner = stmt;
    // Unwrap exports (`export function X() {}`, `export default function X() {}`,
    // `export const X = () => ...`).
    if (
      stmt.type === "ExportNamedDeclaration" ||
      stmt.type === "ExportDefaultDeclaration"
    ) {
      inner = stmt.declaration;
      if (!inner) continue;
    }
    // function X() { ... }
    if (
      inner.type === "FunctionDeclaration" &&
      inner.id?.type === "Identifier" &&
      inner.id.name === name
    ) {
      const root = findReturnedJsxElement(inner.body);
      if (root) return root;
    }
    // const X = ... (var, let, const)
    if (inner.type === "VariableDeclaration") {
      for (const d of inner.declarations || []) {
        if (
          d.id?.type === "Identifier" &&
          d.id.name === name &&
          d.init
        ) {
          const init = d.init;
          if (
            init.type === "ArrowFunctionExpression" ||
            init.type === "FunctionExpression"
          ) {
            const root = findReturnedJsxElement(init.body);
            if (root) return root;
          }
        }
      }
    }
  }
  return null;
}

// Returns the OID on the JSX root of `<TagName>`'s inline definition, or
// null if the definition isn't found / doesn't have a JSX root with an
// OID. Caller uses null as "fall back to instance-only propagation".
export function findInlineComponentDefRootOid(
  source: string,
  tagName: string
): string | null {
  // Cheap reject: tag must start with a capital letter to be a
  // component (lowercase tags are HTML elements; not propagating).
  if (!tagName || !/^[A-Z]/.test(tagName)) return null;
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch {
    return null;
  }
  const programBody = ast?.program?.body ?? ast?.body ?? [];
  const root = findDefinition(programBody, tagName);
  if (!root) return null;
  const oid = getOidFromAttrs(root.openingElement?.attributes || []);
  return oid;
}
