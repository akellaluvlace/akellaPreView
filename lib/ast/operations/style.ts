// Phase 2 Step 9 (Properties Panel) — Generic single-element style-prop
// rewrite. Sibling to `resize.ts` and `spacing.ts` — same magic-string
// byte-overwrite pattern but takes an arbitrary declarations map keyed
// by camelCase JSX style prop names. Used by the Properties Panel to
// commit numeric/unit edits for radius (4 corners), sizing (width /
// height / min-* / max-*), and any other CSS prop that doesn't fit
// resize's (width/height) or spacing's (padding/margin per-side) shapes.
//
// Differences from resize / spacing:
//
// 1. `null` value semantics — passing `null` for a prop REMOVES it from
//    the style ObjectExpression. Matches the user's "clear back to
//    cascade" intent in the Properties Panel (×-button next to a numeric
//    input). `undefined` still means "leave alone". Resize / spacing
//    only support write — they never need to remove because the gesture
//    is always producing a value.
//
// 2. The bail rules match `applyResize` / `applySpacing` exactly:
//    `style={cn(...)}` / `style="..."` / parse failure / OID-not-in-
//    source all return `{ unchanged: true, reason }` with no source
//    mutation. The panel surfaces the reason as a non-blocking warn
//    toast (same pipeline `handleResize` / `handleSpacing` use).
//
// 3. Lossless on no-op — re-running with the same declarations as
//    already in source produces byte-identical output.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { walkJsxOpenings, OID_ATTR } from "../oids";

export interface StylePropsOperation {
  oid: string;
  // Map of camelCase JSX style prop names → CSS values. Three semantics:
  //   string → write the value (will overwrite an existing prop or insert
  //            a new one at the end of the ObjectExpression's properties).
  //   null   → remove the prop from the ObjectExpression entirely. Matches
  //            the panel's ×-button "clear" affordance.
  //   undef  → leave the prop alone (no read, no write). Lets callers
  //            build partial declaration maps without sprinkling deletes.
  declarations: Record<string, string | null | undefined>;
}

export interface StylePropsResult {
  source: string;
  unchanged: boolean;
  // Populated when `unchanged: true` and the bail wasn't a clean no-op
  // (e.g. expression-valued style attr, OID not found). `null` reason on
  // `unchanged: true` means "intentional no-op" (caller passed an empty
  // or all-undefined declaration map).
  reason: string | null;
}

const PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

export function applyStyleProps(
  source: string,
  op: StylePropsOperation
): StylePropsResult {
  // Filter out undefined entries — those are "leave alone" sentinels.
  const decls = Object.entries(op.declarations).filter(
    ([, v]) => v !== undefined
  ) as Array<[string, string | null]>;
  if (decls.length === 0) {
    return { source, unchanged: true, reason: null };
  }

  let ast: unknown;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
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
        a.value.value === op.oid
      ) {
        target = opening;
        return;
      }
    }
  });

  if (!target) {
    return {
      source,
      unchanged: true,
      reason: `oid "${op.oid}" not found in source`,
    };
  }

  const s = new MagicString(source);

  const styleAttr = (target.attributes || []).find(
    (a: any) =>
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      a.name.name === "style"
  );

  // Partition into writes (string value) and removes (null).
  const writes: Array<[string, string]> = [];
  const removes: string[] = [];
  for (const [name, value] of decls) {
    if (value === null) removes.push(name);
    else writes.push([name, value]);
  }

  // Case 1: no style attribute. Removes are no-ops (nothing to remove);
  // writes go into a fresh style attribute. If everything was a remove,
  // we end up with no writes and bail as unchanged.
  if (!styleAttr) {
    if (writes.length === 0) {
      return { source, unchanged: true, reason: null };
    }
    const attrs = target.attributes || [];
    const insertPos =
      attrs.length > 0
        ? attrs[attrs.length - 1].end
        : target.name?.end ?? null;
    if (typeof insertPos !== "number") {
      return {
        source,
        unchanged: true,
        reason: "missing position info on opening tag",
      };
    }
    const props = writes.map(([name, value]) => `${name}: '${value}'`);
    s.appendLeft(insertPos, ` style={{ ${props.join(", ")} }}`);
    return { source: s.toString(), unchanged: false, reason: null };
  }

  // Case 2: existing style attribute. Inspect its value.
  const value = styleAttr.value;
  if (
    !value ||
    (value.type !== "JSXExpressionContainer" &&
      value.type !== "StringLiteral")
  ) {
    return {
      source,
      unchanged: true,
      reason: `style attribute has unexpected value type ${
        value ? value.type : "null"
      }`,
    };
  }
  if (value.type === "StringLiteral") {
    return {
      source,
      unchanged: true,
      reason:
        "style attribute is a string literal — string styles aren't writable in v1 (rewrite as object literal first)",
    };
  }

  const expr = value.expression;
  if (!expr || expr.type !== "ObjectExpression") {
    return {
      source,
      unchanged: true,
      reason: `style expression is ${
        expr ? expr.type : "null"
      } — only ObjectExpression supported in v1`,
    };
  }

  // Walk existing properties — gather position info for the props the
  // caller wants to touch (writes overwrite, removes splice).
  const wantedNames = new Set([
    ...writes.map(([n]) => n),
    ...removes,
  ]);
  type ExistingProp = {
    name: string;
    propStart: number;
    propEnd: number;
    valueStart: number;
    valueEnd: number;
  };
  const existingMap = new Map<string, ExistingProp>();
  for (const p of expr.properties || []) {
    if (p?.type !== "ObjectProperty") continue;
    let propName: string | null = null;
    if (p.key?.type === "Identifier") propName = p.key.name;
    else if (p.key?.type === "StringLiteral") propName = p.key.value;
    if (!propName || !wantedNames.has(propName)) continue;
    if (
      typeof p.start !== "number" ||
      typeof p.end !== "number" ||
      typeof p.value?.start !== "number" ||
      typeof p.value?.end !== "number"
    ) {
      return {
        source,
        unchanged: true,
        reason: `existing "${propName}" property is missing position info`,
      };
    }
    existingMap.set(propName, {
      name: propName,
      propStart: p.start,
      propEnd: p.end,
      valueStart: p.value.start,
      valueEnd: p.value.end,
    });
  }

  // Apply in-place writes first (overwrite an existing prop's value).
  // Removed props are NOT in writes (decls map keys are unique), so
  // there's no overlap concern. Appends — writes whose name doesn't
  // already exist — are queued for the append pass below.
  const toAppend: Array<[string, string]> = [];
  for (const [name, val] of writes) {
    const existing = existingMap.get(name);
    if (existing) {
      s.overwrite(existing.valueStart, existing.valueEnd, `'${val}'`);
    } else {
      toAppend.push([name, val]);
    }
  }

  // Compute which existing props will survive after removes are applied.
  // "Remaining" = in propsArr AND not in the removal set. This includes
  // untouched props (caller didn't reference them at all) AND overwritten-
  // in-place props (their position bounds are unchanged; only the value
  // text changed).
  const propsArr = expr.properties || [];
  const removedStarts = new Set<number>();
  for (const name of removes) {
    const ex = existingMap.get(name);
    if (ex) removedStarts.add(ex.propStart);
  }
  const remainingProps = propsArr.filter(
    (p: any) =>
      typeof p?.start === "number" && !removedStarts.has(p.start)
  );

  if (remainingProps.length === 0 && propsArr.length > 0) {
    // All pre-existing props are being removed (or there were no
    // existing matches to remove because propsArr is empty — handled
    // by the second-arm `propsArr.length > 0` check). Take the
    // "rewrite-the-interior" branch so we get clean whitespace
    // regardless of the original source's spacing. A single
    // `s.overwrite(expr.start+1, expr.end-1, innerText)` replaces
    // whatever was between the braces.
    const innerText =
      toAppend.length > 0
        ? " " +
          toAppend
            .map(([name, value]) => `${name}: '${value}'`)
            .join(", ") +
          " "
        : "";
    if (typeof expr.start !== "number" || typeof expr.end !== "number") {
      return {
        source,
        unchanged: true,
        reason: "missing position info on style ObjectExpression",
      };
    }
    s.overwrite(expr.start + 1, expr.end - 1, innerText);
    return { source: s.toString(), unchanged: false, reason: null };
  }

  // Per-property splice (consume the surrounding comma + whitespace so
  // the resulting ObjectExpression stays syntactically valid). Walk by
  // descending propStart so earlier offsets remain consistent as splices
  // accumulate. A property's "removal range" extends to:
  //   - the next property's start, if there's one after (consumes the
  //     trailing comma + whitespace before the next property), OR
  //   - the previous property's end, if this is the last one in the
  //     list (consumes the preceding comma + whitespace).
  const removalSorted: ExistingProp[] = [];
  for (const name of removes) {
    const existing = existingMap.get(name);
    if (existing) removalSorted.push(existing);
  }
  removalSorted.sort((a, b) => b.propStart - a.propStart);

  for (const ep of removalSorted) {
    const idx = propsArr.findIndex(
      (p: any) => typeof p?.start === "number" && p.start === ep.propStart
    );
    let removeStart = ep.propStart;
    let removeEnd = ep.propEnd;
    if (idx !== -1 && idx < propsArr.length - 1) {
      const next = propsArr[idx + 1];
      if (typeof next?.start === "number") removeEnd = next.start;
    } else if (idx > 0) {
      const prev = propsArr[idx - 1];
      if (typeof prev?.end === "number") removeStart = prev.end;
    }
    s.remove(removeStart, removeEnd);
  }

  // Append new props. Anchor depends on what's left:
  //   - remainingProps non-empty → append after the last surviving prop.
  //   - remainingProps empty (only happens when propsArr started empty)
  //     → insert into the empty braces.
  if (toAppend.length > 0) {
    if (remainingProps.length > 0) {
      const lastProp = remainingProps[remainingProps.length - 1];
      if (typeof lastProp?.end !== "number") {
        return {
          source,
          unchanged: true,
          reason: "missing position info on last style property",
        };
      }
      const insertText = toAppend
        .map(([name, value]) => `, ${name}: '${value}'`)
        .join("");
      s.appendLeft(lastProp.end, insertText);
    } else {
      // propsArr was empty (`style={{}}`). Insert into the braces.
      if (typeof expr.start !== "number") {
        return {
          source,
          unchanged: true,
          reason: "missing position info on style ObjectExpression",
        };
      }
      const insertText =
        " " +
        toAppend
          .map(([name, value]) => `${name}: '${value}'`)
          .join(", ") +
        " ";
      s.appendLeft(expr.start + 1, insertText);
    }
  }

  return { source: s.toString(), unchanged: false, reason: null };
}
