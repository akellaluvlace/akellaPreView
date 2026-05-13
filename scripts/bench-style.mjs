// Ad-hoc smoke test for `lib/ast/operations/style.ts applyStyleProps`.
// Inlines the module so the script runs without a TS build step.
// Mirror of `scripts/bench-resize.mjs` / `scripts/bench-spacing.mjs` —
// keep them in sync if the operation engine evolves.
//
// Per CLAUDE.md "no test harnesses unless asked" this is a one-off
// developer-introspection script, not a CI gate. Fire `node scripts/
// bench-style.mjs` from repo root after touching style.ts. Properties
// Panel commits (radius corners, sizing including min/max, padding/
// margin per-side) all flow through this engine, so a regression here
// would silently break the panel's commit pipeline.

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

function applyStyleProps(source, op) {
  const decls = Object.entries(op.declarations).filter(([, v]) => v !== undefined);
  if (decls.length === 0) return { source, unchanged: true, reason: null };

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

  const writes = [];
  const removes = [];
  for (const [name, value] of decls) {
    if (value === null) removes.push(name);
    else writes.push([name, value]);
  }

  if (!styleAttr) {
    if (writes.length === 0) return { source, unchanged: true, reason: null };
    const attrs = target.attributes || [];
    const insertPos =
      attrs.length > 0 ? attrs[attrs.length - 1].end : target.name?.end ?? null;
    if (typeof insertPos !== "number") {
      return { source, unchanged: true, reason: "missing position info on opening tag" };
    }
    const props = writes.map(([n, v]) => `${n}: '${v}'`);
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
      reason: `style attribute has unexpected value type ${value ? value.type : "null"}`,
    };
  }
  if (value.type === "StringLiteral") {
    return {
      source,
      unchanged: true,
      reason: "style attribute is a string literal — string styles aren't writable in v1",
    };
  }
  const expr = value.expression;
  if (!expr || expr.type !== "ObjectExpression") {
    return {
      source,
      unchanged: true,
      reason: `style expression is ${expr ? expr.type : "null"} — only ObjectExpression supported in v1`,
    };
  }

  const wantedNames = new Set([...writes.map(([n]) => n), ...removes]);
  const existingMap = new Map();
  for (const p of expr.properties || []) {
    if (p?.type !== "ObjectProperty") continue;
    let propName = null;
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

  const toAppend = [];
  for (const [name, val] of writes) {
    const existing = existingMap.get(name);
    if (existing) s.overwrite(existing.valueStart, existing.valueEnd, `'${val}'`);
    else toAppend.push([name, val]);
  }

  const propsArr = expr.properties || [];
  const removedStarts = new Set();
  for (const name of removes) {
    const ex = existingMap.get(name);
    if (ex) removedStarts.add(ex.propStart);
  }
  const remainingProps = propsArr.filter(
    (p) => typeof p?.start === "number" && !removedStarts.has(p.start)
  );

  if (remainingProps.length === 0 && propsArr.length > 0) {
    // All pre-existing props removed — single overwrite of the interior
    // gives clean whitespace regardless of original source spacing.
    const innerText =
      toAppend.length > 0
        ? " " + toAppend.map(([n, v]) => `${n}: '${v}'`).join(", ") + " "
        : "";
    if (typeof expr.start !== "number" || typeof expr.end !== "number") {
      return { source, unchanged: true, reason: "missing position info on style ObjectExpression" };
    }
    s.overwrite(expr.start + 1, expr.end - 1, innerText);
    return { source: s.toString(), unchanged: false, reason: null };
  }

  const removalSorted = [];
  for (const name of removes) {
    const ex = existingMap.get(name);
    if (ex) removalSorted.push(ex);
  }
  removalSorted.sort((a, b) => b.propStart - a.propStart);

  for (const ep of removalSorted) {
    const idx = propsArr.findIndex(
      (p) => typeof p?.start === "number" && p.start === ep.propStart
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

  if (toAppend.length > 0) {
    if (remainingProps.length > 0) {
      const lastProp = remainingProps[remainingProps.length - 1];
      if (typeof lastProp?.end !== "number") {
        return { source, unchanged: true, reason: "missing position info on last style property" };
      }
      const insertText = toAppend.map(([n, v]) => `, ${n}: '${v}'`).join("");
      s.appendLeft(lastProp.end, insertText);
    } else {
      if (typeof expr.start !== "number") {
        return { source, unchanged: true, reason: "missing position info on style ObjectExpression" };
      }
      const insertText = " " + toAppend.map(([n, v]) => `${n}: '${v}'`).join(", ") + " ";
      s.appendLeft(expr.start + 1, insertText);
    }
  }

  return { source: s.toString(), unchanged: false, reason: null };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, source, op, expected) {
  const r = applyStyleProps(source, op);
  const got = r.unchanged
    ? `unchanged${r.reason ? `(${r.reason})` : ""}`
    : r.source;
  const exp = typeof expected === "string" ? expected : JSON.stringify(expected);
  const ok = typeof expected === "string" ? r.source === expected : r.unchanged === expected.unchanged;
  if (ok) {
    pass++;
    console.log(`PASS: ${name}`);
    if (!r.unchanged) console.log(`  → ${r.source}`);
    else if (r.reason) console.log(`  → unchanged (${r.reason})`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log(`  expected: ${exp}`);
    console.log(`  got:      ${got}`);
  }
}

// ---------- cases ----------

// 1. No-op when declarations empty
test(
  "empty declarations → unchanged no-op",
  `export default function T() { return <div data-dropin-id="aaaaaaaa">x</div>; }`,
  { oid: "aaaaaaaa", declarations: {} },
  { unchanged: true }
);

// 2. All-undefined → unchanged
test(
  "all undefined declarations → unchanged",
  `export default function T() { return <div data-dropin-id="aaaaaaaa">x</div>; }`,
  { oid: "aaaaaaaa", declarations: { width: undefined, height: undefined } },
  { unchanged: true }
);

// 3. Insert into element with no style attr → fresh style attribute
test(
  "no style attr → insert with all 4 corner radii",
  `export default function T() { return <div data-dropin-id="bbbbbbbb">x</div>; }`,
  {
    oid: "bbbbbbbb",
    declarations: {
      borderTopLeftRadius: "12px",
      borderTopRightRadius: "12px",
      borderBottomRightRadius: "12px",
      borderBottomLeftRadius: "12px",
    },
  },
  `export default function T() { return <div data-dropin-id="bbbbbbbb" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', borderBottomLeftRadius: '12px' }}>x</div>; }`
);

// 4. Overwrite existing prop in place
test(
  "overwrite existing width",
  `export default function T() { return <div data-dropin-id="cccccccc" style={{ width: '100px' }}>x</div>; }`,
  { oid: "cccccccc", declarations: { width: "248px" } },
  `export default function T() { return <div data-dropin-id="cccccccc" style={{ width: '248px' }}>x</div>; }`
);

// 5. Append new prop after existing
test(
  "append height after existing width",
  `export default function T() { return <div data-dropin-id="dddddddd" style={{ width: '248px' }}>x</div>; }`,
  { oid: "dddddddd", declarations: { height: "120px" } },
  `export default function T() { return <div data-dropin-id="dddddddd" style={{ width: '248px', height: '120px' }}>x</div>; }`
);

// 6. Mix: overwrite + append in one call
test(
  "mix overwrite (width) + append (height) — preserves user's other props",
  `export default function T() { return <div data-dropin-id="eeeeeeee" style={{ width: '100px', color: 'red' }}>x</div>; }`,
  { oid: "eeeeeeee", declarations: { width: "248px", height: "120px" } },
  `export default function T() { return <div data-dropin-id="eeeeeeee" style={{ width: '248px', color: 'red', height: '120px' }}>x</div>; }`
);

// 7. Remove a prop (null value)
test(
  "remove paddingTop (null value)",
  `export default function T() { return <div data-dropin-id="ffffffff" style={{ paddingTop: '12px', paddingLeft: '8px' }}>x</div>; }`,
  { oid: "ffffffff", declarations: { paddingTop: null } },
  `export default function T() { return <div data-dropin-id="ffffffff" style={{ paddingLeft: '8px' }}>x</div>; }`
);

// 8. Remove the LAST prop — consume preceding comma+whitespace
test(
  "remove last prop — consume preceding comma",
  `export default function T() { return <div data-dropin-id="gggggggg" style={{ paddingTop: '12px', paddingLeft: '8px' }}>x</div>; }`,
  { oid: "gggggggg", declarations: { paddingLeft: null } },
  `export default function T() { return <div data-dropin-id="gggggggg" style={{ paddingTop: '12px' }}>x</div>; }`
);

// 9. Remove the only prop → empty object literal
test(
  "remove the only prop → empty object literal",
  `export default function T() { return <div data-dropin-id="hhhhhhhh" style={{ width: '100px' }}>x</div>; }`,
  { oid: "hhhhhhhh", declarations: { width: null } },
  `export default function T() { return <div data-dropin-id="hhhhhhhh" style={{}}>x</div>; }`
);

// 10. Remove + append in one call (clear width, set height)
test(
  "remove width + append height in same call",
  `export default function T() { return <div data-dropin-id="iiiiiiii" style={{ width: '100px' }}>x</div>; }`,
  { oid: "iiiiiiii", declarations: { width: null, height: "120px" } },
  `export default function T() { return <div data-dropin-id="iiiiiiii" style={{ height: '120px' }}>x</div>; }`
);

// 11. style={cn(...)} expression → bail with reason
test(
  "style={cn(...)} expression — bail",
  `export default function T() { return <div data-dropin-id="jjjjjjjj" style={cn('foo', 'bar')}>x</div>; }`,
  { oid: "jjjjjjjj", declarations: { width: "100px" } },
  { unchanged: true }
);

// 12. Missing oid → bail with reason
test(
  "missing oid — bail",
  `export default function T() { return <div data-dropin-id="kkkkkkkk">x</div>; }`,
  { oid: "zzzzzzzz", declarations: { width: "100px" } },
  { unchanged: true }
);

// 13. Empty {} → insert into braces
test(
  "empty object literal — insert into braces",
  `export default function T() { return <div data-dropin-id="llllllll" style={{}}>x</div>; }`,
  { oid: "llllllll", declarations: { width: "248px" } },
  `export default function T() { return <div data-dropin-id="llllllll" style={{ width: '248px' }}>x</div>; }`
);

// 14. All-removes when no style attr → unchanged no-op (nothing to remove)
test(
  "all removes when no style attr → unchanged no-op",
  `export default function T() { return <div data-dropin-id="mmmmmmmm">x</div>; }`,
  { oid: "mmmmmmmm", declarations: { width: null, height: null } },
  { unchanged: true }
);

// 15. self-closing tag with no attrs → fresh style attribute
test(
  "self-closing tag without attrs — insert style",
  `export default function T() { return <img data-dropin-id="nnnnnnnn" />; }`,
  { oid: "nnnnnnnn", declarations: { width: "300px", height: "200px" } },
  `export default function T() { return <img data-dropin-id="nnnnnnnn" style={{ width: '300px', height: '200px' }} />; }`
);

// 16. Coexist with shorthand: write borderTopLeftRadius alongside borderRadius
test(
  "coexist with borderRadius shorthand — longhand wins in cascade",
  `export default function T() { return <div data-dropin-id="oooooooo" style={{ borderRadius: '4px' }}>x</div>; }`,
  { oid: "oooooooo", declarations: { borderTopLeftRadius: "12px" } },
  `export default function T() { return <div data-dropin-id="oooooooo" style={{ borderRadius: '4px', borderTopLeftRadius: '12px' }}>x</div>; }`
);

// 17. Multiple props in one call — typical "linked" Properties Panel commit
test(
  "linked padding commit: 4 sides at once via applyStyleProps",
  `export default function T() { return <div data-dropin-id="pppppppp">x</div>; }`,
  {
    oid: "pppppppp",
    declarations: {
      paddingTop: "12px",
      paddingRight: "12px",
      paddingBottom: "12px",
      paddingLeft: "12px",
    },
  },
  `export default function T() { return <div data-dropin-id="pppppppp" style={{ paddingTop: '12px', paddingRight: '12px', paddingBottom: '12px', paddingLeft: '12px' }}>x</div>; }`
);

// 18. write "auto" string value (margin: auto pattern)
test(
  "write 'auto' as a value (margin: auto)",
  `export default function T() { return <div data-dropin-id="qqqqqqqq">x</div>; }`,
  { oid: "qqqqqqqq", declarations: { marginLeft: "auto", marginRight: "auto" } },
  `export default function T() { return <div data-dropin-id="qqqqqqqq" style={{ marginLeft: 'auto', marginRight: 'auto' }}>x</div>; }`
);

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);
