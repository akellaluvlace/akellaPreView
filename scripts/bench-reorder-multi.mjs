// Bench for `lib/ast/operations/reorder-multi.ts applyReorderMulti`.
// Inlines the engine so the script runs without a TS build step. Mirrors
// the layout of bench-reorder.mjs (single-op sibling).
//
// Run from repo root: `node scripts/bench-reorder-multi.mjs`. Failure
// here would silently break the twenty-seventh-pass batched same-parent
// multi-target tree DnD path (resolveTreeDropMulti → applyReorderMulti).

import { parse } from "@babel/parser";
import MagicString from "magic-string";

const OID_ATTR = "data-dropin-id";
const PARSE_OPTS = {
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

function getOidFromAttrs(attrs) {
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

function findJsxElementByOid(node, oid) {
  if (!node || typeof node !== "object") return null;
  if (node.type === "JSXElement") {
    const got = getOidFromAttrs(node.openingElement?.attributes || []);
    if (got === oid) return node;
  }
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
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

function applyReorderMulti(source, op) {
  if (op.oids.length === 0) {
    return { source, unchanged: true, reason: "no oids to reorder" };
  }
  const seen = new Set();
  for (const o of op.oids) {
    if (seen.has(o))
      return {
        source,
        unchanged: true,
        reason: `duplicate oid "${o}" in reorder set`,
      };
    seen.add(o);
  }
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
  }
  const parentEl = findJsxElementByOid(ast, op.parentOid);
  if (!parentEl) {
    return {
      source,
      unchanged: true,
      reason: `parent oid "${op.parentOid}" not found`,
    };
  }
  if (parentEl.openingElement?.selfClosing || !parentEl.closingElement) {
    return {
      source,
      unchanged: true,
      reason: "parent is self-closing — no children to reorder",
    };
  }
  const children = parentEl.children || [];
  const realChildren = [];
  for (const c of children) {
    if (c.type === "JSXText") {
      if (typeof c.value === "string" && c.value.trim() === "") continue;
      return {
        source,
        unchanged: true,
        reason:
          "parent has non-whitespace text content — reorder not supported",
      };
    }
    if (c.type !== "JSXElement") {
      return {
        source,
        unchanged: true,
        reason: `parent has non-element child (${c.type}) — reorder not supported in v1`,
      };
    }
    if (typeof c.start !== "number" || typeof c.end !== "number") {
      return {
        source,
        unchanged: true,
        reason: "child element missing position info",
      };
    }
    const oid = getOidFromAttrs(c.openingElement?.attributes || []);
    realChildren.push({ oid, end: c.end });
  }
  if (realChildren.length === 0) {
    return { source, unchanged: true, reason: "parent has no real children" };
  }
  const fromIndices = [];
  for (const oid of op.oids) {
    const idx = realChildren.findIndex((rc) => rc.oid === oid);
    if (idx === -1) {
      return {
        source,
        unchanged: true,
        reason: `oid "${oid}" is not a direct child of parent "${op.parentOid}"`,
      };
    }
    fromIndices.push(idx);
  }
  const collapsedLen = realChildren.length - op.oids.length;
  if (op.toIndex < 0 || op.toIndex > collapsedLen) {
    return {
      source,
      unchanged: true,
      reason: `toIndex ${op.toIndex} out of range [0, ${collapsedLen}]`,
    };
  }
  const openingEnd = parentEl.openingElement?.end;
  const closingStart = parentEl.closingElement?.start;
  if (typeof openingEnd !== "number" || typeof closingStart !== "number") {
    return {
      source,
      unchanged: true,
      reason: "parent missing opening/closing position info",
    };
  }
  const rows = [];
  let cursor = openingEnd;
  for (const rc of realChildren) {
    rows.push(source.slice(cursor, rc.end));
    cursor = rc.end;
  }
  const trailing = source.slice(cursor, closingStart);
  const fromSet = new Set(fromIndices);
  const moved = op.oids.map((_, i) => rows[fromIndices[i]]);
  const remaining = [];
  for (let i = 0; i < rows.length; i++) {
    if (!fromSet.has(i)) remaining.push(rows[i]);
  }
  const sortedFrom = [...fromIndices].sort((a, b) => a - b);
  const isContiguous = sortedFrom.every((v, i) => v === sortedFrom[0] + i);
  const isCallerSorted = fromIndices.every((v, i) => v === sortedFrom[i]);
  if (isContiguous && isCallerSorted && sortedFrom[0] === op.toIndex) {
    return { source, unchanged: true, reason: null };
  }
  const newRows = [
    ...remaining.slice(0, op.toIndex),
    ...moved,
    ...remaining.slice(op.toIndex),
  ];
  const s = new MagicString(source);
  s.overwrite(openingEnd, closingStart, newRows.join("") + trailing);
  const out = s.toString();
  if (out === source) return { source, unchanged: true, reason: null };
  return { source: out, unchanged: false, reason: null };
}

// ---------- harness ----------
let pass = 0;
let fail = 0;
function test(name, source, op, expected) {
  const r = applyReorderMulti(source, op);
  let ok;
  if (typeof expected === "string") ok = !r.unchanged && r.source === expected;
  else ok = r.unchanged === expected.unchanged;
  if (ok) {
    pass++;
    console.log(`PASS: ${name}`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(
      `  got:      ${
        r.unchanged ? `unchanged${r.reason ? `(${r.reason})` : ""}` : r.source
      }`,
    );
  }
}

const P = "pppppppp";
const A = "aaaaaaaa";
const B = "bbbbbbbb";
const C = "cccccccc";
const D = "dddddddd";
const E = "eeeeeeee";
const F = "ffffffff";

// (1) Two adjacent siblings drop AFTER target on the right — DFS order
// preserved at slot. Realistic case from the user's reversal report.
//   Original: [A, B, C, D, E]
//   Drag {B, C} after D → expected [A, D, B, C, E]
//   collapsed (post-detach) = [A, D, E] (length 3); toIndex=2
test(
  "(1) drag {B, C} after D — block preserves DFS order",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
  <e data-dropin-id="${E}"/>
</div>`,
  { parentOid: P, oids: [B, C], toIndex: 2 },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <d data-dropin-id="${D}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <e data-dropin-id="${E}"/>
</div>`,
);

// (2) Drop two siblings BEFORE the head — the prior-pass reversal case.
//   Original: [A, B, C, D, E, F, G] but using A..F here.
//   Drag {D, F} BEFORE A (drop at the very front).
//   collapsed (post-detach) = [A, B, C, E] (length 4); toIndex=0
test(
  "(2) drag {D, F} before A — no reversal",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
  <e data-dropin-id="${E}"/>
  <f data-dropin-id="${F}"/>
</div>`,
  { parentOid: P, oids: [D, F], toIndex: 0 },
  `<div data-dropin-id="${P}">
  <d data-dropin-id="${D}"/>
  <f data-dropin-id="${F}"/>
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <e data-dropin-id="${E}"/>
</div>`,
);

// (3) Three-element block move. Drag {A, B, C} AFTER E.
//   Original: [A, B, C, D, E, F]
//   collapsed = [D, E, F] (length 3); toIndex=2 (after E in collapsed)
test(
  "(3) three-element block move",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
  <e data-dropin-id="${E}"/>
  <f data-dropin-id="${F}"/>
</div>`,
  { parentOid: P, oids: [A, B, C], toIndex: 2 },
  `<div data-dropin-id="${P}">
  <d data-dropin-id="${D}"/>
  <e data-dropin-id="${E}"/>
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <f data-dropin-id="${F}"/>
</div>`,
);

// (4) Non-contiguous drag. {B, D} BEFORE F.
//   Original: [A, B, C, D, E, F]
//   collapsed = [A, C, E, F] (length 4); toIndex=3 (before F in collapsed)
test(
  "(4) non-contiguous drag {B, D} before F",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
  <e data-dropin-id="${E}"/>
  <f data-dropin-id="${F}"/>
</div>`,
  { parentOid: P, oids: [B, D], toIndex: 3 },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <c data-dropin-id="${C}"/>
  <e data-dropin-id="${E}"/>
  <b data-dropin-id="${B}"/>
  <d data-dropin-id="${D}"/>
  <f data-dropin-id="${F}"/>
</div>`,
);

// (5) Block already at the slot — no-op.
//   Original: [A, B, C, D]. Drag {A, B} with toIndex=0.
//   sortedFrom=[0,1] contiguous; sortedFrom[0]==0==toIndex → no-op.
test(
  "(5) block already at slot → no-op",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
</div>`,
  { parentOid: P, oids: [A, B], toIndex: 0 },
  { unchanged: true },
);

// (6) Mid-list contiguous block already at slot — no-op.
//   Original: [A, B, C, D]. Drag {B, C}, toIndex=1 (post-detach [A, D],
//   inserting at index 1 puts {B, C} between A and D, matching original).
test(
  "(6) mid-list block already at slot → no-op",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
</div>`,
  { parentOid: P, oids: [B, C], toIndex: 1 },
  { unchanged: true },
);

// (7) Caller-out-of-order DOES re-shuffle. {B, A} ([B, A] passed) at
// toIndex=0 produces [B, A, C, D] from [A, B, C, D] — a flip even
// though sortedFrom is [0, 1] contiguous.
test(
  "(7) caller-out-of-order is a real shuffle, not no-op",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
</div>`,
  { parentOid: P, oids: [B, A], toIndex: 0 },
  `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
  <a data-dropin-id="${A}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
</div>`,
);

// (8) Empty oids → bail.
test(
  "(8) empty oids → bail",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { parentOid: P, oids: [], toIndex: 0 },
  { unchanged: true },
);

// (9) Duplicate oid in input → bail.
test(
  "(9) duplicate oid → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { parentOid: P, oids: [A, A], toIndex: 0 },
  { unchanged: true },
);

// (10) Parent oid not found → bail.
test(
  "(10) parent oid not found → bail",
  `<div data-dropin-id="${A}"><b data-dropin-id="${B}"/></div>`,
  { parentOid: "zzzzzzzz", oids: [B], toIndex: 0 },
  { unchanged: true },
);

// (11) oid not direct child → bail.
test(
  "(11) oid not direct child → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { parentOid: P, oids: [A, B], toIndex: 0 },
  { unchanged: true },
);

// (12) toIndex out of range too-high.
test(
  "(12) toIndex too high → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { parentOid: P, oids: [A], toIndex: 99 },
  { unchanged: true },
);

// (13) toIndex negative → bail.
test(
  "(13) toIndex negative → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { parentOid: P, oids: [A], toIndex: -1 },
  { unchanged: true },
);

// (14) Self-closing parent → bail.
test(
  "(14) self-closing parent → bail",
  `<div><img data-dropin-id="${P}"/></div>`,
  { parentOid: P, oids: [A], toIndex: 0 },
  { unchanged: true },
);

// (15) Non-whitespace text in parent → bail.
test(
  "(15) interleaved text → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  hello
  <b data-dropin-id="${B}"/>
</div>`,
  { parentOid: P, oids: [A], toIndex: 0 },
  { unchanged: true },
);

// (16) Expression-container child → bail.
test(
  "(16) expression-container child → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  {x && <b data-dropin-id="${B}"/>}
</div>`,
  { parentOid: P, oids: [A], toIndex: 0 },
  { unchanged: true },
);

// (17) Parse failure → bail.
test(
  "(17) parse failure → bail",
  `not <valid {jsx`,
  { parentOid: P, oids: [A], toIndex: 0 },
  { unchanged: true },
);

// (18) Single oid (k=1) — works as a 1-element batch.
//   Original: [A, B, C]. Drag {B} with toIndex=2 (post-detach [A, C]
//   length 2; toIndex=2 == collapsedLen → append at end).
test(
  "(18) single-oid batch lands at end",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { parentOid: P, oids: [B], toIndex: 2 },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <c data-dropin-id="${C}"/>
  <b data-dropin-id="${B}"/>
</div>`,
);

// (19) Asymmetric indentation rides with element.
//   Drag {A} from idx 0 (4-space indent) to last (collapsedLen=1 → idx 1).
test(
  "(19) asymmetric indentation rides with element",
  `<div data-dropin-id="${P}">
    <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { parentOid: P, oids: [A], toIndex: 1 },
  `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
    <a data-dropin-id="${A}"/>
</div>`,
);

// (20) Round-trip: apply once, then apply the inverse → byte-identical
// with original. Sanity check the rewrite is lossless.
{
  const src = `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
</div>`;
  // Move {A, B} to end → [C, D, A, B]
  const r1 = applyReorderMulti(src, { parentOid: P, oids: [A, B], toIndex: 2 });
  // Inverse: from [C, D, A, B], move {A, B} back to front
  const r2 = applyReorderMulti(r1.source, {
    parentOid: P,
    oids: [A, B],
    toIndex: 0,
  });
  if (!r1.unchanged && !r2.unchanged && r2.source === src) {
    pass++;
    console.log(`PASS: (20) round-trip restores original`);
  } else {
    fail++;
    console.log(`FAIL: (20) round-trip restores original`);
  }
}

// (21) Element with nested children — nested subtree rides intact.
test(
  "(21) nested-children element rides intact",
  `<div data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <h1>Title</h1>
    <p>Body</p>
  </section>
  <footer data-dropin-id="${B}"/>
  <aside data-dropin-id="${C}"/>
</div>`,
  { parentOid: P, oids: [A, B], toIndex: 1 },
  `<div data-dropin-id="${P}">
  <aside data-dropin-id="${C}"/>
  <section data-dropin-id="${A}">
    <h1>Title</h1>
    <p>Body</p>
  </section>
  <footer data-dropin-id="${B}"/>
</div>`,
);

// (22) Drop at very end: collapsedLen ≤ toIndex ≤ collapsedLen.
//   Drag {A, B} from [A, B, C, D, E], toIndex=collapsedLen=3 (append).
test(
  "(22) toIndex == collapsedLen → append at end",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
  <e data-dropin-id="${E}"/>
</div>`,
  { parentOid: P, oids: [A, B], toIndex: 3 },
  `<div data-dropin-id="${P}">
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
  <e data-dropin-id="${E}"/>
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
);

// (23) Empty parent (no real children) → bail (oid-not-found fires
// first since realChildren list is empty).
test(
  "(23) empty parent → bail",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: P, oids: [A], toIndex: 0 },
  { unchanged: true },
);

// (24) tsx-wrapped source — multi-element move inside an exported
// component body.
test(
  "(24) tsx-wrapped source",
  `export default function T() { return (
  <div data-dropin-id="${P}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </div>
); }`,
  { parentOid: P, oids: [A, B], toIndex: 1 },
  `export default function T() { return (
  <div data-dropin-id="${P}">
    <c data-dropin-id="${C}"/>
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
  </div>
); }`,
);

// (25) Nested parent — outer block untouched.
test(
  "(25) nested parent — outer untouched",
  `<main data-dropin-id="oooooooo">
  <header/>
  <section data-dropin-id="${P}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </section>
</main>`,
  { parentOid: P, oids: [A, B], toIndex: 1 },
  `<main data-dropin-id="oooooooo">
  <header/>
  <section data-dropin-id="${P}">
    <c data-dropin-id="${C}"/>
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
  </section>
</main>`,
);

console.log(`\nbench-reorder-multi: ${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);
