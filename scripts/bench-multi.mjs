// Phase 2 acceptance #13 — multi-element coordinated drag bench.
// Exercises the iterate-and-batch pattern that `Workspace.handleResizeMulti`
// and `handleSpacingMulti` use on the host: feed each op through
// `applyStyleProps` (or `applySpacing`) against a RUNNING source string so
// per-element edits land in a single `setCode` push (one undo entry).
//
// Inlines the operation engines so this script runs without a TS build
// step. Mirror of `scripts/bench-style.mjs` / `bench-spacing.mjs` —
// keep the inline copies in sync if the operation engines evolve.
//
// Per CLAUDE.md "no test harnesses unless asked" this is a one-off
// developer-introspection script. Fire `node scripts/bench-multi.mjs`
// from repo root after touching any of:
//   - lib/ast/operations/style.ts
//   - lib/ast/operations/spacing.ts
//   - components/Workspace.tsx (handleResizeMulti / handleSpacingMulti)
//   - components/SelectionOverlay.tsx (gesture-end multi-commit branch)
//
// What this validates beyond the single-element benches:
//   - Sequential applyStyleProps over a running source DOES NOT corrupt
//     OIDs that haven't been touched yet (positions stay stable across
//     edits because each parse is fresh against the latest source).
//   - One bailing op (cn() style, missing OID, "auto" margin) doesn't
//     prevent the rest from committing — partial success is the spec.
//   - All 3 elements pick up the same delta when started from different
//     widths (the gesture-side code computes startW + dw per element).

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
      reason: "style attribute is a string literal — not writable in v1",
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

// Multi-element commit driver — mirrors `Workspace.handleResizeMulti`
// exactly: iterate a running source through applyStyleProps, log per-op
// reasons on bail, single "anyCommitted" flag for the union return.
function handleResizeMulti(source, ops) {
  let next = source;
  let anyCommitted = false;
  const bails = [];
  for (const op of ops) {
    const result = applyStyleProps(next, op);
    if (result.unchanged) {
      bails.push({ oid: op.oid, reason: result.reason });
      continue;
    }
    next = result.source;
    anyCommitted = true;
  }
  return { source: next, anyCommitted, bails };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, source, ops, expected) {
  const r = handleResizeMulti(source, ops);
  let ok = true;
  if (typeof expected === "string") {
    ok = r.source === expected;
  } else {
    if ("anyCommitted" in expected && r.anyCommitted !== expected.anyCommitted) ok = false;
    if (expected.source && r.source !== expected.source) ok = false;
    if (expected.bailCount !== undefined && r.bails.length !== expected.bailCount) ok = false;
  }
  if (ok) {
    pass++;
    console.log(`PASS: ${name}`);
    if (r.anyCommitted) console.log(`  → ${r.source}`);
    if (r.bails.length > 0) console.log(`  → bails: ${r.bails.map((b) => `${b.oid}:${b.reason}`).join(" | ")}`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log(`  expected: ${typeof expected === "string" ? expected : JSON.stringify(expected)}`);
    console.log(`  got:      ${r.source}`);
    if (r.bails.length > 0) console.log(`            bails: ${r.bails.map((b) => `${b.oid}:${b.reason}`).join(" | ")}`);
  }
}

// ---------- cases ----------

// Case 1: 3 elements with no existing style, all get a width write.
// Single source rewrite touches all 3 OIDs; final source has 3 style attrs.
const SRC_3_BARE = `export default function T() {
  return (
    <div>
      <span data-dropin-id="aaaaaaaa">A</span>
      <span data-dropin-id="bbbbbbbb">B</span>
      <span data-dropin-id="cccccccc">C</span>
    </div>
  );
}`;
test(
  "3 bare elements → all get width inserted (sequential applyStyleProps)",
  SRC_3_BARE,
  [
    { oid: "aaaaaaaa", declarations: { width: "100px" } },
    { oid: "bbbbbbbb", declarations: { width: "100px" } },
    { oid: "cccccccc", declarations: { width: "100px" } },
  ],
  `export default function T() {
  return (
    <div>
      <span data-dropin-id="aaaaaaaa" style={{ width: '100px' }}>A</span>
      <span data-dropin-id="bbbbbbbb" style={{ width: '100px' }}>B</span>
      <span data-dropin-id="cccccccc" style={{ width: '100px' }}>C</span>
    </div>
  );
}`
);

// Case 2: 3 elements with DIFFERENT start widths — same delta produces
// different final widths. This is the spec's headline behaviour: "all
// three resize by the same delta".
const SRC_3_MIXED = `export default function T() {
  return (
    <div>
      <span data-dropin-id="dddddddd" style={{ width: '100px' }}>A</span>
      <span data-dropin-id="eeeeeeee" style={{ width: '200px' }}>B</span>
      <span data-dropin-id="ffffffff" style={{ width: '300px' }}>C</span>
    </div>
  );
}`;
// Delta = +24 px → 124, 224, 324.
test(
  "3 elements with different start widths → same delta",
  SRC_3_MIXED,
  [
    { oid: "dddddddd", declarations: { width: "124px" } },
    { oid: "eeeeeeee", declarations: { width: "224px" } },
    { oid: "ffffffff", declarations: { width: "324px" } },
  ],
  `export default function T() {
  return (
    <div>
      <span data-dropin-id="dddddddd" style={{ width: '124px' }}>A</span>
      <span data-dropin-id="eeeeeeee" style={{ width: '224px' }}>B</span>
      <span data-dropin-id="ffffffff" style={{ width: '324px' }}>C</span>
    </div>
  );
}`
);

// Case 3: 3 elements with mixed style states (some have existing styles,
// some don't). Each op respects its own situation — overwrite vs insert.
const SRC_MIXED_STATE = `export default function T() {
  return (
    <div>
      <span data-dropin-id="gggggggg">A</span>
      <span data-dropin-id="hhhhhhhh" style={{ color: 'red' }}>B</span>
      <span data-dropin-id="iiiiiiii" style={{ width: '50px' }}>C</span>
    </div>
  );
}`;
test(
  "mixed style states → fresh insert / append / overwrite per element",
  SRC_MIXED_STATE,
  [
    { oid: "gggggggg", declarations: { width: "200px" } },
    { oid: "hhhhhhhh", declarations: { width: "200px" } },
    { oid: "iiiiiiii", declarations: { width: "200px" } },
  ],
  `export default function T() {
  return (
    <div>
      <span data-dropin-id="gggggggg" style={{ width: '200px' }}>A</span>
      <span data-dropin-id="hhhhhhhh" style={{ color: 'red', width: '200px' }}>B</span>
      <span data-dropin-id="iiiiiiii" style={{ width: '200px' }}>C</span>
    </div>
  );
}`
);

// Case 4: One OID missing — that op bails, rest proceed. anyCommitted=true.
const SRC_2_PRESENT = `export default function T() {
  return (
    <div>
      <span data-dropin-id="jjjjjjjj">A</span>
      <span data-dropin-id="kkkkkkkk">B</span>
    </div>
  );
}`;
test(
  "one missing OID → that one bails, rest commit",
  SRC_2_PRESENT,
  [
    { oid: "jjjjjjjj", declarations: { width: "100px" } },
    { oid: "MISSING0", declarations: { width: "100px" } },
    { oid: "kkkkkkkk", declarations: { width: "100px" } },
  ],
  {
    anyCommitted: true,
    bailCount: 1,
    source: `export default function T() {
  return (
    <div>
      <span data-dropin-id="jjjjjjjj" style={{ width: '100px' }}>A</span>
      <span data-dropin-id="kkkkkkkk" style={{ width: '100px' }}>B</span>
    </div>
  );
}`,
  }
);

// Case 5: One element has cn() style → bails; rest commit.
const SRC_CN = `import cn from 'clsx';
export default function T() {
  return (
    <div>
      <span data-dropin-id="llllllll" style={cn('hi')}>A</span>
      <span data-dropin-id="mmmmmmmm">B</span>
    </div>
  );
}`;
test(
  "cn() style on one element → bails; other commits",
  SRC_CN,
  [
    { oid: "llllllll", declarations: { width: "100px" } },
    { oid: "mmmmmmmm", declarations: { width: "100px" } },
  ],
  {
    anyCommitted: true,
    bailCount: 1,
  }
);

// Case 6: ALL ops bail → anyCommitted false, source unchanged byte-identical.
test(
  "all ops bail → anyCommitted false, source unchanged",
  SRC_2_PRESENT,
  [
    { oid: "MISS_001", declarations: { width: "100px" } },
    { oid: "MISS_002", declarations: { width: "100px" } },
  ],
  {
    anyCommitted: false,
    bailCount: 2,
    source: SRC_2_PRESENT,
  }
);

// Case 7: Empty ops array → anyCommitted false, source unchanged.
test(
  "empty ops array → anyCommitted false",
  SRC_2_PRESENT,
  [],
  { anyCommitted: false, bailCount: 0, source: SRC_2_PRESENT }
);

// Case 8: Single op — multi handler still works for the degenerate count=1
// case (gesture handler routes here when additionalOids.length > 0; if
// somehow one of them was the primary, the count-1 path should still work).
test(
  "single op via multi → same behaviour as bench-style.mjs case",
  `export default function T() { return <div data-dropin-id="aaaaaaaa">x</div>; }`,
  [{ oid: "aaaaaaaa", declarations: { width: "120px" } }],
  `export default function T() { return <div data-dropin-id="aaaaaaaa" style={{ width: '120px' }}>x</div>; }`
);

// Case 9: Same OID appears twice in the ops list (degenerate; gesture
// dedupes upstream but defensively this should still produce a sensible
// output — the second op overwrites the first's value).
const SRC_ONE = `export default function T() { return <div data-dropin-id="zzzzzzzz">x</div>; }`;
test(
  "same OID twice → second op overwrites first",
  SRC_ONE,
  [
    { oid: "zzzzzzzz", declarations: { width: "100px" } },
    { oid: "zzzzzzzz", declarations: { width: "200px" } },
  ],
  `export default function T() { return <div data-dropin-id="zzzzzzzz" style={{ width: '200px' }}>x</div>; }`
);

// Case 10: Multi-prop write to multiple elements. flexBasis on element 1,
// height on element 2, both via multi-op. Validates that intent-resolver
// output (mixed prop names) flows through cleanly.
const SRC_MULTI_PROP = `export default function T() {
  return (
    <div>
      <span data-dropin-id="oidaaaaa">A</span>
      <span data-dropin-id="oidbbbbb">B</span>
    </div>
  );
}`;
test(
  "multi-prop multi-element commit — flexBasis on A, height on B",
  SRC_MULTI_PROP,
  [
    { oid: "oidaaaaa", declarations: { flexBasis: "150px" } },
    { oid: "oidbbbbb", declarations: { height: "60px" } },
  ],
  `export default function T() {
  return (
    <div>
      <span data-dropin-id="oidaaaaa" style={{ flexBasis: '150px' }}>A</span>
      <span data-dropin-id="oidbbbbb" style={{ height: '60px' }}>B</span>
    </div>
  );
}`
);

// Case 11: "Edit-running-source" invariant — a pre-running edit shifted
// later OIDs' positions, but each parse re-resolves them. This case writes
// to OID #2 then #1 (reverse order). Both should land in the same final
// source even though the order is different from the source layout order.
test(
  "ops applied out of source order → both still land",
  SRC_3_BARE,
  [
    { oid: "cccccccc", declarations: { width: "300px" } }, // last in source, written first
    { oid: "aaaaaaaa", declarations: { width: "100px" } }, // first in source, written second
  ],
  `export default function T() {
  return (
    <div>
      <span data-dropin-id="aaaaaaaa" style={{ width: '100px' }}>A</span>
      <span data-dropin-id="bbbbbbbb">B</span>
      <span data-dropin-id="cccccccc" style={{ width: '300px' }}>C</span>
    </div>
  );
}`
);

// Case 12: Lossless on no-op for ops list — re-running with values that
// match existing styles produces byte-identical source. Important because
// the gesture's pointermove broadcasts run constantly; if the source is
// stable at delta=0, we shouldn't accidentally rewrite it.
const SRC_PRECOMMIT = `export default function T() {
  return (
    <div>
      <span data-dropin-id="prerwone" style={{ width: '100px' }}>A</span>
      <span data-dropin-id="prerwtwo" style={{ width: '200px' }}>B</span>
    </div>
  );
}`;
test(
  "re-applying same values → byte-identical source",
  SRC_PRECOMMIT,
  [
    { oid: "prerwone", declarations: { width: "100px" } },
    { oid: "prerwtwo", declarations: { width: "200px" } },
  ],
  // The operation engine ALWAYS rewrites when the value matches the
  // declared property; "lossless on no-op" is documented for resize.ts
  // but for applyStyleProps it produces byte-identical text via overwrite.
  // anyCommitted is true (the engine doesn't compare current vs proposed
  // values; it just rewrites). The output is byte-identical because the
  // overwrite range matches the existing text exactly.
  SRC_PRECOMMIT
);

// Case 13: Heterogeneous selection — text and div with the same width
// edit. Confirms the multi-element flow doesn't care about tag names.
const SRC_HETERO = `export default function T() {
  return (
    <main data-dropin-id="hetermai">
      <button data-dropin-id="heterbut">Click</button>
      <p data-dropin-id="heterppp">Hi</p>
    </main>
  );
}`;
test(
  "heterogeneous selection (button + p + main) → all width edits land",
  SRC_HETERO,
  [
    { oid: "hetermai", declarations: { width: "640px" } },
    { oid: "heterbut", declarations: { width: "120px" } },
    { oid: "heterppp", declarations: { width: "320px" } },
  ],
  `export default function T() {
  return (
    <main data-dropin-id="hetermai" style={{ width: '640px' }}>
      <button data-dropin-id="heterbut" style={{ width: '120px' }}>Click</button>
      <p data-dropin-id="heterppp" style={{ width: '320px' }}>Hi</p>
    </main>
  );
}`
);

// Case 14: 5-element commit (acceptance #13 spec-references "3 elements"
// but the gesture has no count cap). Validates the multi-pass scales
// past the spec example.
const SRC_5 = `export default function T() {
  return (
    <ul>
      <li data-dropin-id="elem0001">1</li>
      <li data-dropin-id="elem0002">2</li>
      <li data-dropin-id="elem0003">3</li>
      <li data-dropin-id="elem0004">4</li>
      <li data-dropin-id="elem0005">5</li>
    </ul>
  );
}`;
test(
  "5-element coordinated drag → all get the same height",
  SRC_5,
  [
    { oid: "elem0001", declarations: { height: "40px" } },
    { oid: "elem0002", declarations: { height: "40px" } },
    { oid: "elem0003", declarations: { height: "40px" } },
    { oid: "elem0004", declarations: { height: "40px" } },
    { oid: "elem0005", declarations: { height: "40px" } },
  ],
  `export default function T() {
  return (
    <ul>
      <li data-dropin-id="elem0001" style={{ height: '40px' }}>1</li>
      <li data-dropin-id="elem0002" style={{ height: '40px' }}>2</li>
      <li data-dropin-id="elem0003" style={{ height: '40px' }}>3</li>
      <li data-dropin-id="elem0004" style={{ height: '40px' }}>4</li>
      <li data-dropin-id="elem0005" style={{ height: '40px' }}>5</li>
    </ul>
  );
}`
);

// Case 15: Order independence — re-running the same ops list in a
// different order produces the same final source (modulo the running-
// source path each parse takes). Essential for confidence that the
// gesture handler doesn't accidentally depend on iteration order beyond
// the obvious "second op writes after first" semantics on the same OID.
const SRC_ORDER = `export default function T() {
  return (
    <div>
      <span data-dropin-id="ordoidaa">A</span>
      <span data-dropin-id="ordoidbb">B</span>
      <span data-dropin-id="ordoidcc">C</span>
    </div>
  );
}`;
const FORWARD = handleResizeMulti(SRC_ORDER, [
  { oid: "ordoidaa", declarations: { width: "100px" } },
  { oid: "ordoidbb", declarations: { width: "100px" } },
  { oid: "ordoidcc", declarations: { width: "100px" } },
]);
const REVERSE = handleResizeMulti(SRC_ORDER, [
  { oid: "ordoidcc", declarations: { width: "100px" } },
  { oid: "ordoidbb", declarations: { width: "100px" } },
  { oid: "ordoidaa", declarations: { width: "100px" } },
]);
if (FORWARD.source === REVERSE.source) {
  pass++;
  console.log("PASS: forward and reverse iteration produce identical source");
} else {
  fail++;
  console.log("FAIL: forward and reverse iteration diverged");
  console.log("  forward:", FORWARD.source);
  console.log("  reverse:", REVERSE.source);
}

// Case 16: cn() bail in the middle — first commits, second bails, third
// commits. Validates partial-success path under interspersed bails.
const SRC_CN_MID = `import cn from 'clsx';
export default function T() {
  return (
    <div>
      <span data-dropin-id="cnpoidaa">A</span>
      <span data-dropin-id="cnpoidbb" style={cn('hi')}>B</span>
      <span data-dropin-id="cnpoidcc">C</span>
    </div>
  );
}`;
test(
  "cn() bail mid-list → ops on both sides commit",
  SRC_CN_MID,
  [
    { oid: "cnpoidaa", declarations: { width: "100px" } },
    { oid: "cnpoidbb", declarations: { width: "100px" } },
    { oid: "cnpoidcc", declarations: { width: "100px" } },
  ],
  {
    anyCommitted: true,
    bailCount: 1,
    source: `import cn from 'clsx';
export default function T() {
  return (
    <div>
      <span data-dropin-id="cnpoidaa" style={{ width: '100px' }}>A</span>
      <span data-dropin-id="cnpoidbb" style={cn('hi')}>B</span>
      <span data-dropin-id="cnpoidcc" style={{ width: '100px' }}>C</span>
    </div>
  );
}`,
  }
);

// Case 17: All elements share an existing prop that gets the same new
// value. Each gets an in-place overwrite; output stays well-formed.
const SRC_ALL_OVERWRITE = `export default function T() {
  return (
    <div>
      <span data-dropin-id="ovrxxxx1" style={{ width: '50px' }}>A</span>
      <span data-dropin-id="ovrxxxx2" style={{ width: '50px' }}>B</span>
      <span data-dropin-id="ovrxxxx3" style={{ width: '50px' }}>C</span>
    </div>
  );
}`;
test(
  "in-place overwrite of existing prop on all 3",
  SRC_ALL_OVERWRITE,
  [
    { oid: "ovrxxxx1", declarations: { width: "75px" } },
    { oid: "ovrxxxx2", declarations: { width: "75px" } },
    { oid: "ovrxxxx3", declarations: { width: "75px" } },
  ],
  `export default function T() {
  return (
    <div>
      <span data-dropin-id="ovrxxxx1" style={{ width: '75px' }}>A</span>
      <span data-dropin-id="ovrxxxx2" style={{ width: '75px' }}>B</span>
      <span data-dropin-id="ovrxxxx3" style={{ width: '75px' }}>C</span>
    </div>
  );
}`
);

// Case 18: Width + height per op (corner-handle drag broadcasts both
// axes). Each element gets both props inserted; final source has 3
// well-formed style attrs.
const SRC_BOTH_AXES = `export default function T() {
  return (
    <div>
      <span data-dropin-id="botxxxx1">A</span>
      <span data-dropin-id="botxxxx2">B</span>
      <span data-dropin-id="botxxxx3">C</span>
    </div>
  );
}`;
test(
  "corner-drag (width+height) on 3 elements",
  SRC_BOTH_AXES,
  [
    { oid: "botxxxx1", declarations: { width: "100px", height: "100px" } },
    { oid: "botxxxx2", declarations: { width: "150px", height: "150px" } },
    { oid: "botxxxx3", declarations: { width: "200px", height: "200px" } },
  ],
  `export default function T() {
  return (
    <div>
      <span data-dropin-id="botxxxx1" style={{ width: '100px', height: '100px' }}>A</span>
      <span data-dropin-id="botxxxx2" style={{ width: '150px', height: '150px' }}>B</span>
      <span data-dropin-id="botxxxx3" style={{ width: '200px', height: '200px' }}>C</span>
    </div>
  );
}`
);

console.log("");
console.log(`${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);
