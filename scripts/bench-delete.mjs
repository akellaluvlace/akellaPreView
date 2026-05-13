// Ad-hoc smoke test for `lib/ast/operations/delete.ts applyDelete`.
// Inlines the module so the script runs without a TS build step.
// Mirrors the layout of `bench-reorder.mjs` / `bench-reparent.mjs`.
//
// Run from repo root: `node scripts/bench-delete.mjs`.

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

function buildParentMap(ast) {
  const map = new Map();
  function walk(node, parentJsx) {
    if (!node || typeof node !== "object") return;
    if (node.type === "JSXElement") {
      map.set(node, parentJsx);
      parentJsx = node;
    }
    for (const key in node) {
      if (SKIP_KEYS.has(key)) continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const c of child) walk(c, parentJsx);
      } else if (child && typeof child === "object" && child.type) {
        walk(child, parentJsx);
      }
    }
  }
  walk(ast, null);
  return map;
}

function applyDelete(source, op) {
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
  }

  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl) {
    return { source, unchanged: true, reason: `oid "${op.oid}" not found` };
  }

  const parentMap = buildParentMap(ast);
  const parent = parentMap.get(srcEl) ?? null;
  if (!parent) {
    return {
      source,
      unchanged: true,
      reason: "element has no JSX parent (top-level) — cannot delete",
    };
  }

  const directChildIdx = (parent.children || []).indexOf(srcEl);
  if (directChildIdx === -1) {
    return {
      source,
      unchanged: true,
      reason:
        "element is inside a non-JSXElement wrapper (e.g. {cond && <X/>}) — delete the wrapper instead",
    };
  }

  const parentOpeningEnd = parent.openingElement?.end;
  if (typeof parentOpeningEnd !== "number") {
    return {
      source,
      unchanged: true,
      reason: "parent missing opening position info",
    };
  }

  let leadingWsStart = parentOpeningEnd;
  const children = parent.children || [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c === srcEl) break;
    if (c.type === "JSXText") {
      const v = typeof c.value === "string" ? c.value : "";
      if (v.trim() === "") continue;
    }
    if (typeof c.end === "number") {
      leadingWsStart = c.end;
    }
  }

  const s = new MagicString(source);
  s.remove(leadingWsStart, srcEl.end);

  return { source: s.toString(), unchanged: false, reason: null };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, source, op, expected) {
  const r = applyDelete(source, op);
  let ok;
  if (typeof expected === "string") {
    ok = !r.unchanged && r.source === expected;
  } else if (typeof expected === "function") {
    ok = expected(r);
  } else {
    ok = r.unchanged === expected.unchanged;
  }
  if (ok) {
    pass++;
    console.log(`PASS: ${name}`);
    if (!r.unchanged) console.log(`  → ${JSON.stringify(r.source)}`);
    else if (r.reason) console.log(`  → unchanged (${r.reason})`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  got: ${JSON.stringify({
      unchanged: r.unchanged,
      reason: r.reason,
      source: r.unchanged ? null : r.source,
    })}`);
  }
}

const P = "pppppppp";
const A = "aaaaaaaa";
const B = "bbbbbbbb";
const C = "cccccccc";
const D = "dddddddd";

// 1. Delete first of 3 — leading WS + element gone
test(
  "delete first of 3",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`
);

// 2. Delete middle of 3
test(
  "delete middle of 3",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: B },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <c data-dropin-id="${C}"/>
</div>`
);

// 3. Delete last of 3 — surrounding still well-formed
test(
  "delete last of 3",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: C },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`
);

// 4. Delete only child — parent left empty (no orphan WS)
test(
  "delete only child of parent",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">
</div>`
);

// 5. Delete top-level element — bail
test(
  "delete top-level element → bail",
  `<div data-dropin-id="${A}"/>`,
  { oid: A },
  { unchanged: true }
);

// 6. oid not found
test(
  "oid not found → bail",
  `<div data-dropin-id="${A}"><b data-dropin-id="${B}"/></div>`,
  { oid: "zzzzzzzz" },
  { unchanged: true }
);

// 7. Delete with nested children — entire subtree gone
test(
  "delete element with nested subtree",
  `<div data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <h1 data-dropin-id="${B}">Hi</h1>
    <p data-dropin-id="${C}">There</p>
  </section>
  <footer data-dropin-id="${D}"/>
</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">
  <footer data-dropin-id="${D}"/>
</div>`
);

// 8. Compact siblings — delete keeps neighbours adjacent
test(
  "compact siblings — delete first",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/><b data-dropin-id="${B}"/></div>`,
  { oid: A },
  `<div data-dropin-id="${P}"><b data-dropin-id="${B}"/></div>`
);

// 9. Compact siblings — delete second
test(
  "compact siblings — delete second",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/><b data-dropin-id="${B}"/></div>`,
  { oid: B },
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`
);

// 10. Sibling beside text content — text preserved
test(
  "delete element with text-content siblings",
  `<div data-dropin-id="${P}">Hello <a data-dropin-id="${A}"/> World</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">Hello  World</div>`
);

// 11. Delete inside expression wrapper — bail
test(
  "delete element wrapped in {cond && ...} → bail",
  `<div data-dropin-id="${P}">
  {cond && <a data-dropin-id="${A}"/>}
</div>`,
  { oid: A },
  { unchanged: true }
);

// 12. Multiple deletes in sequence
test(
  "delete first, then delete what was originally second",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    const r2 = applyDelete(r.source, { oid: B });
    if (r2.unchanged) return false;
    return r2.source === `<div data-dropin-id="${P}">
  <c data-dropin-id="${C}"/>
</div>`;
  }
);

// 13. tsx-wrapped (function returning JSX)
test(
  "delete inside tsx wrapper",
  `export default function App() {
  return (
    <div data-dropin-id="${P}">
      <a data-dropin-id="${A}"/>
      <b data-dropin-id="${B}"/>
    </div>
  );
}`,
  { oid: A },
  `export default function App() {
  return (
    <div data-dropin-id="${P}">
      <b data-dropin-id="${B}"/>
    </div>
  );
}`
);

// 14. Deeply nested target
test(
  "delete deeply nested element",
  `<main data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <article data-dropin-id="${B}">
      <p data-dropin-id="${C}"/>
      <p data-dropin-id="${D}"/>
    </article>
  </section>
</main>`,
  { oid: C },
  `<main data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <article data-dropin-id="${B}">
      <p data-dropin-id="${D}"/>
    </article>
  </section>
</main>`
);

// 15. Attributes preserved on remaining siblings
test(
  "remaining siblings keep attributes after delete",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}" className="x"/>
  <b data-dropin-id="${B}" className="y" id="b"/>
</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}" className="y" id="b"/>
</div>`
);

// 16. parse failure
test(
  "parse failure → bail",
  `<div data-dropin-id="${P}"><<<< not jsx`,
  { oid: A },
  { unchanged: true }
);

// 17. Delete first sibling when first child is whitespace JSXText
test(
  "delete first when leading whitespace before is JSXText",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">
</div>`
);

// 18. Delete with JSXFragment sibling
test(
  "delete element with fragment sibling",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <>
    <b data-dropin-id="${B}"/>
  </>
</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">
  <>
    <b data-dropin-id="${B}"/>
  </>
</div>`
);

// 19. Delete element after another element on the same line (compact + indented)
test(
  "delete after compact peer",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/><b data-dropin-id="${B}"/>
</div>`,
  { oid: B },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`
);

// 20. Round-trip: delete the duplicate created by applyDuplicate-style
//     (just verifying structural integrity, not OID)
test(
  "delete element preceded by another with extra blank line",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>

  <b data-dropin-id="${B}"/>
</div>`,
  { oid: B },
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`
);

// 21. Delete with an only-child whose body is text
test(
  "delete only child with text body",
  `<div data-dropin-id="${P}">
  <h1 data-dropin-id="${A}">Hello</h1>
</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">
</div>`
);

// 22. Delete element that has spread attribute — preserves on parent
test(
  "delete element with spread props",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}" {...rest}/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A },
  `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
</div>`
);

console.log(`\n${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
