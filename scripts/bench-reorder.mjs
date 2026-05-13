// Ad-hoc smoke test for `lib/ast/operations/reorder.ts applyReorder`.
// Inlines the module so the script runs without a TS build step.
// Mirrors the layout of `bench-style.mjs` / `bench-resize.mjs`.
//
// Run from repo root: `node scripts/bench-reorder.mjs`. A regression
// here would silently break the Phase 3 reorder gesture's source-
// rewrite step (the gesture dispatches `onReorderCommit(oid, parent,
// toIndex)` which routes through `Workspace.handleReorder` →
// `applyReorder`).

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

function applyReorder(source, op) {
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
    return {
      source,
      unchanged: true,
      reason: "parent has no real children",
    };
  }

  const fromIndex = realChildren.findIndex((rc) => rc.oid === op.oid);
  if (fromIndex === -1) {
    return {
      source,
      unchanged: true,
      reason: `oid "${op.oid}" is not a direct child of parent "${op.parentOid}"`,
    };
  }
  if (op.toIndex < 0 || op.toIndex > realChildren.length - 1) {
    return {
      source,
      unchanged: true,
      reason: `toIndex ${op.toIndex} out of range [0, ${
        realChildren.length - 1
      }]`,
    };
  }
  if (op.toIndex === fromIndex) {
    return { source, unchanged: true, reason: null };
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
  const moved = rows.splice(fromIndex, 1)[0];
  rows.splice(op.toIndex, 0, moved);

  const s = new MagicString(source);
  s.overwrite(openingEnd, closingStart, rows.join("") + trailing);

  return { source: s.toString(), unchanged: false, reason: null };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, source, op, expected) {
  const r = applyReorder(source, op);
  const got = r.unchanged
    ? `unchanged${r.reason ? `(${r.reason})` : ""}`
    : r.source;
  let ok;
  if (typeof expected === "string") ok = !r.unchanged && r.source === expected;
  else ok = r.unchanged === expected.unchanged;
  if (ok) {
    pass++;
    console.log(`PASS: ${name}`);
    if (!r.unchanged) console.log(`  → ${JSON.stringify(r.source)}`);
    else if (r.reason) console.log(`  → unchanged (${r.reason})`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  got:      ${JSON.stringify(got)}`);
  }
}

const P = "pppppppp"; // parent oid
const A = "aaaaaaaa";
const B = "bbbbbbbb";
const C = "cccccccc";
const D = "dddddddd";
const E = "eeeeeeee";

// 1. Forward move: 3 elements, move first to last
test(
  "3 elements, move first to last",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: A, parentOid: P, toIndex: 2 },
  `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <a data-dropin-id="${A}"/>
</div>`
);

// 2. Backward move: 3 elements, move last to first
test(
  "3 elements, move last to first",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: C, parentOid: P, toIndex: 0 },
  `<div data-dropin-id="${P}">
  <c data-dropin-id="${C}"/>
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`
);

// 3. Middle swap: 4 elements, move index 1 → index 2
test(
  "4 elements, move idx 1 to idx 2",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <d data-dropin-id="${D}"/>
</div>`,
  { oid: B, parentOid: P, toIndex: 2 },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <c data-dropin-id="${C}"/>
  <b data-dropin-id="${B}"/>
  <d data-dropin-id="${D}"/>
</div>`
);

// 4. No-op: same fromIndex/toIndex returns unchanged
test(
  "fromIndex === toIndex → unchanged no-op",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A, parentOid: P, toIndex: 0 },
  { unchanged: true }
);

// 5. Parent not found
test(
  "parent oid not found → bail",
  `<div data-dropin-id="${A}"><b data-dropin-id="${B}"/></div>`,
  { oid: B, parentOid: "zzzzzzzz", toIndex: 0 },
  { unchanged: true }
);

// 6. oid not in parent's real children
test(
  "oid not a direct child of parent → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { oid: B, parentOid: P, toIndex: 0 },
  { unchanged: true }
);

// 7. toIndex out of range (too high)
test(
  "toIndex beyond list → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A, parentOid: P, toIndex: 5 },
  { unchanged: true }
);

// 8. toIndex out of range (negative)
test(
  "toIndex negative → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A, parentOid: P, toIndex: -1 },
  { unchanged: true }
);

// 9. Parent has non-whitespace text → bail
test(
  "parent has interleaved text → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  hello
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A, parentOid: P, toIndex: 1 },
  { unchanged: true }
);

// 10. Parent is self-closing → bail
test(
  "self-closing parent → bail",
  `<div><img data-dropin-id="${P}"/></div>`,
  { oid: A, parentOid: P, toIndex: 0 },
  { unchanged: true }
);

// 11. Parent has JSXExpressionContainer child → bail
test(
  "parent has expression-container child → bail",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  {x && <b data-dropin-id="${B}"/>}
</div>`,
  { oid: A, parentOid: P, toIndex: 1 },
  { unchanged: true }
);

// 12. Lossless on no-op: same source after move + same op = no-op
{
  const src1 = `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`;
  const r1 = applyReorder(src1, { oid: A, parentOid: P, toIndex: 1 });
  const r2 = applyReorder(r1.source, { oid: A, parentOid: P, toIndex: 1 });
  if (r2.unchanged && r2.reason === null) {
    pass++;
    console.log(`PASS: lossless on re-apply at landed position`);
  } else {
    fail++;
    console.log(`FAIL: lossless on re-apply (got unchanged=${r2.unchanged}, reason=${r2.reason})`);
  }
}

// 13. Element with attributes preserved
test(
  "preserve attributes on moved element",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}" className="x" style={{ color: 'red' }}/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A, parentOid: P, toIndex: 1 },
  `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
  <a data-dropin-id="${A}" className="x" style={{ color: 'red' }}/>
</div>`
);

// 14. Element with children preserved
test(
  "preserve nested children on moved element",
  `<div data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <h1>Title</h1>
    <p>body</p>
  </section>
  <footer data-dropin-id="${B}"/>
</div>`,
  { oid: A, parentOid: P, toIndex: 1 },
  `<div data-dropin-id="${P}">
  <footer data-dropin-id="${B}"/>
  <section data-dropin-id="${A}">
    <h1>Title</h1>
    <p>body</p>
  </section>
</div>`
);

// 15. Mixed indentation preserved per element
test(
  "asymmetric indentation rides with element",
  `<div data-dropin-id="${P}">
    <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A, parentOid: P, toIndex: 1 },
  `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
    <a data-dropin-id="${A}"/>
</div>`
);

// 16. 5-element rotate: move idx 0 → idx 4
test(
  "5-element rotate first to last",
  `<ul data-dropin-id="${P}">
  <li data-dropin-id="${A}"/>
  <li data-dropin-id="${B}"/>
  <li data-dropin-id="${C}"/>
  <li data-dropin-id="${D}"/>
  <li data-dropin-id="${E}"/>
</ul>`,
  { oid: A, parentOid: P, toIndex: 4 },
  `<ul data-dropin-id="${P}">
  <li data-dropin-id="${B}"/>
  <li data-dropin-id="${C}"/>
  <li data-dropin-id="${D}"/>
  <li data-dropin-id="${E}"/>
  <li data-dropin-id="${A}"/>
</ul>`
);

// 17. Reorder with deeply-nested parent (parent itself is someone's child)
test(
  "nested parent — outer untouched",
  `<main data-dropin-id="oooooooo">
  <header/>
  <section data-dropin-id="${P}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
  </section>
</main>`,
  { oid: B, parentOid: P, toIndex: 0 },
  `<main data-dropin-id="oooooooo">
  <header/>
  <section data-dropin-id="${P}">
    <b data-dropin-id="${B}"/>
    <a data-dropin-id="${A}"/>
  </section>
</main>`
);

// 18. Single-element parent → toIndex 0 same as fromIndex → no-op
test(
  "single child → only valid toIndex is 0 → no-op",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, parentOid: P, toIndex: 0 },
  { unchanged: true }
);

// 19. Parse failure → bail
test(
  "parse failure → bail",
  `not <valid {jsx`,
  { oid: A, parentOid: P, toIndex: 0 },
  { unchanged: true }
);

// 20. Empty parent → bail (no real children)
test(
  "empty parent → bail",
  `<div data-dropin-id="${P}"></div>`,
  { oid: A, parentOid: P, toIndex: 0 },
  { unchanged: true }
);

// 21. Reorder via TypeScript file with leading import / export default wrapper
test(
  "tsx-wrapped source",
  `export default function T() { return (
  <div data-dropin-id="${P}">
    <a data-dropin-id="${A}"/>
    <b data-dropin-id="${B}"/>
    <c data-dropin-id="${C}"/>
  </div>
); }`,
  { oid: B, parentOid: P, toIndex: 0 },
  `export default function T() { return (
  <div data-dropin-id="${P}">
    <b data-dropin-id="${B}"/>
    <a data-dropin-id="${A}"/>
    <c data-dropin-id="${C}"/>
  </div>
); }`
);

// 22. Move to current position - 1 (subtle off-by-one verification)
test(
  "move idx 2 → idx 1",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: C, parentOid: P, toIndex: 1 },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <c data-dropin-id="${C}"/>
  <b data-dropin-id="${B}"/>
</div>`
);

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);
