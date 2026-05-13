// Ad-hoc smoke test for `lib/ast/operations/spacing.ts applySpacing`.
// Inlines the module so the script runs without a TS build step. Mirror
// of `scripts/bench-resize.mjs` — keep them in sync if the operation
// engine evolves.
//
// Per CLAUDE.md "no test harnesses unless asked" this is a one-off
// developer-introspection script, not a CI gate. Fire `node scripts/
// bench-spacing.mjs` from repo root after touching spacing.ts.

import { parse } from "@babel/parser";
import MagicString from "magic-string";

const OID_ATTR = "data-dropin-id";
const PARSE_OPTS = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

function walkJsxOpenings(node, onOpening) {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") onOpening(node);
  for (const key in node) {
    if (
      key === "loc" ||
      key === "tokens" ||
      key === "comments" ||
      key === "extra" ||
      key === "start" ||
      key === "end" ||
      key === "leadingComments" ||
      key === "trailingComments"
    ) {
      continue;
    }
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) walkJsxOpenings(c, onOpening);
    } else if (child && typeof child === "object" && child.type) {
      walkJsxOpenings(child, onOpening);
    }
  }
}

function styleKeyFor(kind, side) {
  switch (side) {
    case "top": return `${kind}Top`;
    case "right": return `${kind}Right`;
    case "bottom": return `${kind}Bottom`;
    case "left": return `${kind}Left`;
  }
}

function applySpacing(source, op) {
  if (
    op.top === undefined &&
    op.right === undefined &&
    op.bottom === undefined &&
    op.left === undefined
  ) {
    return { source, unchanged: true, reason: null };
  }
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
  }
  let target = null;
  walkJsxOpenings(ast, (opening) => {
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
    (a) =>
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      a.name.name === "style"
  );
  const desired = new Map();
  const sides = ["top", "right", "bottom", "left"];
  for (const side of sides) {
    const v = op[side];
    if (v !== undefined) desired.set(styleKeyFor(op.kind, side), `'${v}'`);
  }
  if (!styleAttr) {
    const attrs = target.attributes || [];
    const insertPos =
      attrs.length > 0 ? attrs[attrs.length - 1].end : target.name?.end ?? null;
    if (typeof insertPos !== "number") {
      return {
        source,
        unchanged: true,
        reason: "missing position info on opening tag",
      };
    }
    const props = [];
    for (const [name, value] of desired) props.push(`${name}: ${value}`);
    s.appendLeft(insertPos, ` style={{ ${props.join(", ")} }}`);
    return { source: s.toString(), unchanged: false, reason: null };
  }
  const value = styleAttr.value;
  if (
    !value ||
    (value.type !== "JSXExpressionContainer" && value.type !== "StringLiteral")
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
        "style attribute is a string literal — string styles aren't writable in v1",
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
  const existingMap = new Map();
  for (const p of expr.properties || []) {
    if (p?.type !== "ObjectProperty") continue;
    let propName = null;
    if (p.key?.type === "Identifier") propName = p.key.name;
    else if (p.key?.type === "StringLiteral") propName = p.key.value;
    if (!propName || !desired.has(propName)) continue;
    if (
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
      valueStart: p.value.start,
      valueEnd: p.value.end,
    });
  }
  const toAppend = [];
  for (const [name, val] of desired) {
    const existing = existingMap.get(name);
    if (existing) s.overwrite(existing.valueStart, existing.valueEnd, val);
    else toAppend.push({ name, value: val });
  }
  if (toAppend.length > 0) {
    const propsArr = expr.properties || [];
    if (propsArr.length > 0) {
      const lastProp = propsArr[propsArr.length - 1];
      if (typeof lastProp?.end !== "number") {
        return {
          source,
          unchanged: true,
          reason: "missing position info on last style property",
        };
      }
      const insertText = toAppend
        .map(({ name, value }) => `, ${name}: ${value}`)
        .join("");
      s.appendLeft(lastProp.end, insertText);
    } else {
      if (typeof expr.start !== "number") {
        return {
          source,
          unchanged: true,
          reason: "missing position info on style ObjectExpression",
        };
      }
      const insertText =
        " " +
        toAppend.map(({ name, value }) => `${name}: ${value}`).join(", ") +
        " ";
      s.appendLeft(expr.start + 1, insertText);
    }
  }
  return { source: s.toString(), unchanged: false, reason: null };
}

// --- Cases ---

const cases = [
  {
    name: "padding: no style attr → insert with paddingTop",
    source: `export default function T() { return <div data-dropin-id="aaaaaaaa">x</div>; }`,
    op: { oid: "aaaaaaaa", kind: "padding", top: "16px" },
    expectChange: true,
  },
  {
    name: "padding: existing style with no padding props → append paddingTop",
    source: `export default function T() { return <div data-dropin-id="bbbbbbbb" style={{ color: 'red' }}>x</div>; }`,
    op: { oid: "bbbbbbbb", kind: "padding", top: "12px" },
    expectChange: true,
  },
  {
    name: "padding: existing paddingTop → overwrite in place",
    source: `export default function T() { return <div data-dropin-id="cccccccc" style={{ paddingTop: '4px' }}>x</div>; }`,
    op: { oid: "cccccccc", kind: "padding", top: "16px" },
    expectChange: true,
  },
  {
    name: "padding: existing padding shorthand → leave shorthand, append paddingTop",
    source: `export default function T() { return <div data-dropin-id="dddddddd" style={{ padding: '8px' }}>x</div>; }`,
    op: { oid: "dddddddd", kind: "padding", top: "16px" },
    expectChange: true,
  },
  {
    name: "padding: cn() expression → bail",
    source: `export default function T() { return <div data-dropin-id="eeeeeeee" style={someStyle()}>x</div>; }`,
    op: { oid: "eeeeeeee", kind: "padding", top: "16px" },
    expectChange: false,
    expectReason: /CallExpression/,
  },
  {
    name: "padding: empty object {} → insert paddingTop into braces",
    source: `export default function T() { return <div data-dropin-id="ffffffff" style={{}}>x</div>; }`,
    op: { oid: "ffffffff", kind: "padding", top: "16px" },
    expectChange: true,
  },
  {
    name: "margin: no style attr → insert marginTop + marginRight",
    source: `export default function T() { return <div data-dropin-id="gggggggg">x</div>; }`,
    op: { oid: "gggggggg", kind: "margin", top: "8px", right: "16px" },
    expectChange: true,
  },
  {
    name: "padding: all 4 sides at once → 4 props inserted",
    source: `export default function T() { return <div data-dropin-id="hhhhhhhh">x</div>; }`,
    op: {
      oid: "hhhhhhhh",
      kind: "padding",
      top: "8px",
      right: "12px",
      bottom: "8px",
      left: "12px",
    },
    expectChange: true,
  },
  {
    name: "padding: missing oid → bail with reason",
    source: `export default function T() { return <div data-dropin-id="iiiiiiii">x</div>; }`,
    op: { oid: "00000000", kind: "padding", top: "16px" },
    expectChange: false,
    expectReason: /not found/,
  },
  {
    name: "padding: no sides specified → intentional no-op",
    source: `export default function T() { return <div data-dropin-id="jjjjjjjj">x</div>; }`,
    op: { oid: "jjjjjjjj", kind: "padding" },
    expectChange: false,
    expectReason: null,
  },
  {
    name: "padding: mix overwrite + append (top exists, right new)",
    source: `export default function T() { return <div data-dropin-id="kkkkkkkk" style={{ paddingTop: '4px', color: 'red' }}>x</div>; }`,
    op: { oid: "kkkkkkkk", kind: "padding", top: "16px", right: "12px" },
    expectChange: true,
  },
  {
    name: "margin: existing marginLeft 'auto' overwritten",
    source: `export default function T() { return <div data-dropin-id="llllllll" style={{ marginLeft: 'auto' }}>x</div>; }`,
    op: { oid: "llllllll", kind: "margin", left: "0" },
    expectChange: true,
  },
];

let passed = 0;
let failed = 0;
for (const c of cases) {
  const r = applySpacing(c.source, c.op);
  const changed = !r.unchanged;
  let ok = changed === c.expectChange;
  if (ok && c.expectReason) {
    if (c.expectReason instanceof RegExp) {
      ok = r.reason !== null && c.expectReason.test(r.reason);
    } else {
      ok = r.reason === c.expectReason;
    }
  }
  if (ok && c.expectReason === null && r.reason !== null) ok = false;
  console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
  if (!ok) {
    console.log(`  expected change=${c.expectChange}, got change=${changed}`);
    console.log(`  reason: ${r.reason}`);
  }
  if (changed) console.log(`  → ${r.source}`);
  if (ok) passed++;
  else failed++;
}

console.log(`\n${passed}/${cases.length} passed${failed ? `, ${failed} FAILED` : ""}`);
process.exit(failed > 0 ? 1 : 0);
