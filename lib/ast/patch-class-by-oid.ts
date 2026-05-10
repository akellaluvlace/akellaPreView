// Phase 5 / Phase C / C3 — OID-keyed className patcher used by the
// propagation toggle's "everywhere" mode. The host already has a
// loc-based patcher (`patchJsxClass` in `lib/source-patch-jsx.ts`)
// that drives the inspector's per-edit className rewrites; that
// patcher wants line/col coordinates Monaco hands us. The propagation
// path doesn't have a loc — we resolve the definition's root via OID
// only — so we need a parallel, OID-keyed patcher that writes the
// same className value.
//
// Behaviour mirrors `patchJsxClass`'s contract: when the element has
// no className attribute and `newClass` is empty, the source stays
// unchanged. When `newClass` is empty and an attribute exists, the
// attribute is removed (consistent with the inspector's "clear all"
// path). When `newClass` is non-empty, the attribute's value is
// rewritten verbatim (whitespace inside is preserved as-typed).

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR } from "./oids";

export interface PatchClassResult {
  source: string;
  changed: boolean;
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

export function patchJsxClassByOid(
  source: string,
  oid: string,
  newClass: string
): PatchClassResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, changed: false, reason: `parse failed: ${String(e)}` };
  }

  const el = findJsxElementByOid(ast, oid);
  if (!el) {
    return { source, changed: false, reason: `oid "${oid}" not found` };
  }

  // Look for an existing className attribute. If the element uses an
  // expression form (`className={...}`) we bail — patching expression
  // attribute values would change runtime semantics. Same restriction
  // as the loc-based `patchJsxClass`.
  let classAttr: any = null;
  for (const a of el.openingElement?.attributes || []) {
    if (
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      (a.name.name === "className" || a.name.name === "class")
    ) {
      if (a.value?.type === "StringLiteral") {
        classAttr = a;
      } else if (a.value?.type === "JSXExpressionContainer") {
        return {
          source,
          changed: false,
          reason: "className uses an expression — propagation skipped",
        };
      } else if (a.value === null) {
        // Boolean-shorthand `<X className />` — unusual but valid JSX.
        // Treat as "exists, empty"; we'll overwrite to a string.
        classAttr = a;
      }
      break;
    }
  }

  const trimmed = newClass.trim();

  if (!classAttr) {
    if (!trimmed) {
      return {
        source,
        changed: false,
        reason: "no className attribute and newClass is empty",
      };
    }
    // Insert a new className attribute right after the opening tag's
    // name. Mirrors `injectOids`'s insertion convention.
    const nameEnd = el.openingElement?.name?.end;
    if (typeof nameEnd !== "number") {
      return {
        source,
        changed: false,
        reason: "opening tag missing position info",
      };
    }
    const s = new MagicString(source);
    s.appendLeft(nameEnd, ` className="${trimmed.replace(/"/g, "&quot;")}"`);
    return { source: s.toString(), changed: true, reason: null };
  }

  if (typeof classAttr.start !== "number" || typeof classAttr.end !== "number") {
    return {
      source,
      changed: false,
      reason: "className attribute missing position info",
    };
  }

  const s = new MagicString(source);
  if (!trimmed) {
    // Remove the attribute including its leading whitespace so we
    // don't leave a stray space in `<div  data-x="...">`.
    let removeStart = classAttr.start;
    while (removeStart > 0 && /\s/.test(source[removeStart - 1])) {
      removeStart--;
    }
    s.remove(removeStart, classAttr.end);
    return { source: s.toString(), changed: true, reason: null };
  }

  if (classAttr.value?.type === "StringLiteral") {
    const valStart = classAttr.value.start;
    const valEnd = classAttr.value.end;
    if (typeof valStart !== "number" || typeof valEnd !== "number") {
      return {
        source,
        changed: false,
        reason: "className value missing position info",
      };
    }
    const existing = source.slice(valStart + 1, valEnd - 1);
    if (existing === trimmed) {
      return { source, changed: false, reason: "no change" };
    }
    s.overwrite(
      valStart,
      valEnd,
      `"${trimmed.replace(/"/g, "&quot;")}"`
    );
    return { source: s.toString(), changed: true, reason: null };
  }

  // Boolean-shorthand `<X className />` (a.value === null). Replace
  // the bare `className` with `className="trimmed"` by overwriting
  // [name.end, attr.end] (effectively appending the value bytes).
  const nameEnd = classAttr.name?.end;
  if (typeof nameEnd !== "number") {
    return { source, changed: false, reason: "className missing name end" };
  }
  s.overwrite(
    nameEnd,
    classAttr.end,
    `="${trimmed.replace(/"/g, "&quot;")}"`
  );
  return { source: s.toString(), changed: true, reason: null };
}

// =============================================================================
// Vibe-edit additions: text + arbitrary-attr OID-keyed patchers.
//
// The vibe-edit flow commits user edits back to source on idle.
// The change shapes it can produce are: text content (heading /
// paragraph / button label), image src + alt, and link href. All of
// those route through these two patchers, OID-keyed so they survive
// any source edit that doesn't delete the element.
//
// Result-shape mirrors patchJsxClassByOid above: { source, changed,
// reason }. Same parse + AST-walk + magic-string overwrite pattern.
// =============================================================================

function escapeJsxText(s: string): string {
  return s.replace(/[&<>{}]/g, (c) => {
    if (c === "&") return "&amp;";
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    if (c === "{") return "&#123;";
    if (c === "}") return "&#125;";
    return c;
  });
}

export function patchJsxTextByOid(
  source: string,
  oid: string,
  newText: string
): PatchClassResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, changed: false, reason: `parse failed: ${String(e)}` };
  }

  const el = findJsxElementByOid(ast, oid);
  if (!el) {
    return { source, changed: false, reason: `oid "${oid}" not found` };
  }

  // Self-closing has no text slot — `<img />` doesn't carry text.
  if (el.openingElement?.selfClosing) {
    return { source, changed: false, reason: "self-closing element has no text slot" };
  }

  // Bail if any child is not a JSXText node. Replacing element /
  // expression children would silently delete user code; vibecoders
  // don't reason about those, so we drop the edit and let the user
  // open the power editor for non-trivial structures.
  const children = el.children || [];
  for (const c of children) {
    if (c?.type !== "JSXText") {
      return {
        source,
        changed: false,
        reason: "non-text children present (use power editor for nested markup)",
      };
    }
  }

  const openEnd = el.openingElement?.end;
  const closeStart = el.closingElement?.start;
  if (typeof openEnd !== "number" || typeof closeStart !== "number") {
    return {
      source,
      changed: false,
      reason: "element missing position info",
    };
  }
  if (closeStart < openEnd) {
    return {
      source,
      changed: false,
      reason: "malformed element boundaries",
    };
  }

  const escaped = escapeJsxText(newText);
  const existing = source.slice(openEnd, closeStart);
  if (existing === escaped) {
    return { source, changed: false, reason: "text already up to date" };
  }

  const s = new MagicString(source);
  s.overwrite(openEnd, closeStart, escaped);
  return { source: s.toString(), changed: true, reason: null };
}

export function patchJsxAttrByOid(
  source: string,
  oid: string,
  attrName: string,
  newValue: string
): PatchClassResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, changed: false, reason: `parse failed: ${String(e)}` };
  }

  const el = findJsxElementByOid(ast, oid);
  if (!el) {
    return { source, changed: false, reason: `oid "${oid}" not found` };
  }

  let existingAttr: any = null;
  for (const a of el.openingElement?.attributes || []) {
    if (
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      a.name.name === attrName
    ) {
      if (a.value?.type === "JSXExpressionContainer") {
        return {
          source,
          changed: false,
          reason: `attribute "${attrName}" uses an expression — vibe-edit skipped`,
        };
      }
      existingAttr = a;
      break;
    }
  }

  const escapedValue = newValue.replace(/"/g, "&quot;");

  if (!existingAttr) {
    // Insert after the opening tag's name. Mirrors patchJsxClassByOid.
    const nameEnd = el.openingElement?.name?.end;
    if (typeof nameEnd !== "number") {
      return {
        source,
        changed: false,
        reason: "opening tag missing position info",
      };
    }
    const s = new MagicString(source);
    s.appendLeft(nameEnd, ` ${attrName}="${escapedValue}"`);
    return { source: s.toString(), changed: true, reason: null };
  }

  if (existingAttr.value?.type === "StringLiteral") {
    const valStart = existingAttr.value.start;
    const valEnd = existingAttr.value.end;
    if (typeof valStart !== "number" || typeof valEnd !== "number") {
      return {
        source,
        changed: false,
        reason: "attribute value missing position info",
      };
    }
    const existing = source.slice(valStart + 1, valEnd - 1);
    if (existing === escapedValue) {
      return { source, changed: false, reason: "no change" };
    }
    const s = new MagicString(source);
    s.overwrite(valStart, valEnd, `"${escapedValue}"`);
    return { source: s.toString(), changed: true, reason: null };
  }

  // Boolean-shorthand `<X disabled />` — overwrite into a string form.
  const nameEnd = existingAttr.name?.end;
  if (typeof nameEnd !== "number") {
    return { source, changed: false, reason: "attribute missing name end" };
  }
  const s = new MagicString(source);
  s.overwrite(nameEnd, existingAttr.end, `="${escapedValue}"`);
  return { source: s.toString(), changed: true, reason: null };
}

// Outer-replacement patcher used by the vibe-edit icon-swap flow. The
// user picks a different icon from the library; we replace the
// JSXElement at `oid` with the asset markup verbatim. To keep OID-based
// addressing alive across the swap, we inject the OID into the new
// outer's first opening tag (unless the asset already carries one).
//
// Bails on parse error / oid missing / empty newOuter / element missing
// position info. Returns no-change when the post-injection bytes equal
// the existing element source (so a "swap to identical SVG" doesn't
// dirty the buffer).

function injectOidIntoOuter(newOuter: string, oid: string): string {
  if (newOuter.indexOf("data-dropin-id") >= 0) return newOuter;
  // Insert right after the first opening tag's name. The match handles
  // leading whitespace, optional ws between < and tagName, and any tag
  // name (svg, div, span, etc). Hyphens are allowed in custom-element
  // names. The injected attr has a leading space so it never collides
  // with whatever comes next (`>`, `/>`, an existing attr, etc).
  return newOuter.replace(
    /^(\s*<\s*[a-zA-Z][\w-]*)/,
    `$1 ${OID_ATTR}="${oid}"`,
  );
}

export function patchJsxOuterByOid(
  source: string,
  oid: string,
  newOuter: string,
): PatchClassResult {
  const trimmed = newOuter.trim();
  if (!trimmed) {
    return { source, changed: false, reason: "newOuter is empty" };
  }

  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, changed: false, reason: `parse failed: ${String(e)}` };
  }

  const el = findJsxElementByOid(ast, oid);
  if (!el) {
    return { source, changed: false, reason: `oid "${oid}" not found` };
  }

  if (typeof el.start !== "number" || typeof el.end !== "number") {
    return {
      source,
      changed: false,
      reason: "element missing position info",
    };
  }

  const stamped = injectOidIntoOuter(newOuter, oid);
  const existing = source.slice(el.start, el.end);
  if (existing === stamped) {
    return { source, changed: false, reason: "no change" };
  }

  const s = new MagicString(source);
  s.overwrite(el.start, el.end, stamped);
  return { source: s.toString(), changed: true, reason: null };
}
