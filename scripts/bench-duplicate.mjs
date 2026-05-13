// Ad-hoc smoke test for `lib/ast/operations/duplicate.ts applyDuplicate`.
// Inlines the module so the script runs without a TS build step.
// Mirrors the layout of `bench-reorder.mjs` / `bench-reparent.mjs`.
//
// Run from repo root: `node scripts/bench-duplicate.mjs`. A regression
// here would silently break the Cmd+D / duplicate-button keyboard
// shortcut wired in `Workspace.tsx` → `handleDuplicate` → `applyDuplicate`.

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

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const OID_LEN = 8;
const OID_REGEX = /^[A-Za-z0-9]{8}$/;
const OID_ATTR_RE = /(\sdata-dropin-id=")([A-Za-z0-9]{8})(")/g;

function makeOid(seed) {
  if (typeof seed === "number" && Number.isFinite(seed) && seed >= 0) {
    const N = ALPHA.length;
    let n = Math.floor(seed) >>> 0;
    let s = "";
    for (let i = 0; i < OID_LEN; i++) {
      s = ALPHA[n % N] + s;
      n = Math.floor(n / N);
    }
    return s;
  }
  let id = "";
  for (let i = 0; i < OID_LEN; i++) {
    id += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  }
  return id;
}

function isValidOid(s) {
  return OID_REGEX.test(s);
}

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

function collectAllOids(node, into) {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") {
    for (const a of node.attributes || []) {
      if (
        a?.type === "JSXAttribute" &&
        a.name?.type === "JSXIdentifier" &&
        a.name.name === OID_ATTR &&
        a.value?.type === "StringLiteral" &&
        isValidOid(a.value.value)
      ) {
        into.add(a.value.value);
      }
    }
  }
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) collectAllOids(c, into);
    } else if (child && typeof child === "object" && child.type) {
      collectAllOids(child, into);
    }
  }
}

function mintFresh(baseSeed, seen) {
  let candidate = makeOid(baseSeed);
  if (!seen.has(candidate)) return candidate;
  for (let bump = 1; bump < 1000; bump++) {
    candidate = makeOid(baseSeed + bump * 7919);
    if (!seen.has(candidate)) return candidate;
  }
  let id = makeOid() + makeOid();
  while (seen.has(id)) id = makeOid() + makeOid();
  return id;
}

function applyDuplicate(source, op) {
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return {
      source,
      unchanged: true,
      reason: `parse failed: ${String(e)}`,
      newRootOid: null,
    };
  }

  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl) {
    return {
      source,
      unchanged: true,
      reason: `oid "${op.oid}" not found`,
      newRootOid: null,
    };
  }

  const parentMap = buildParentMap(ast);
  const parent = parentMap.get(srcEl) ?? null;
  if (!parent) {
    return {
      source,
      unchanged: true,
      reason: "element has no JSX parent (top-level) — cannot duplicate",
      newRootOid: null,
    };
  }

  const parentOpeningEnd = parent.openingElement?.end;
  if (typeof parentOpeningEnd !== "number") {
    return {
      source,
      unchanged: true,
      reason: "parent missing opening position info",
      newRootOid: null,
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
  const indent = source.slice(leadingWsStart, srcEl.start);
  const elText = source.slice(srcEl.start, srcEl.end);

  const seen = new Set();
  collectAllOids(ast, seen);

  let counter = 0;
  let newRootOid = null;
  const rewrittenElText = elText.replace(
    OID_ATTR_RE,
    (_m, prefix, _oldOid, suffix) => {
      const fresh = mintFresh(srcEl.end + counter * 7919, seen);
      seen.add(fresh);
      if (counter === 0) newRootOid = fresh;
      counter++;
      return prefix + fresh + suffix;
    }
  );

  const insertText = indent + rewrittenElText;
  const s = new MagicString(source);
  s.appendLeft(srcEl.end, insertText);

  return {
    source: s.toString(),
    unchanged: false,
    reason: null,
    newRootOid,
  };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, source, op, expected) {
  const r = applyDuplicate(source, op);
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
      newRootOid: r.newRootOid,
    })}`);
  }
}

const P = "pppppppp";
const A = "aaaaaaaa";
const B = "bbbbbbbb";
const C = "cccccccc";
const D = "dddddddd";
const E = "eeeeeeee";
const F = "ffffffff";

// 1. Single self-closing element, indented
test(
  "duplicate single child (self-closing, indented)",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    if (!r.newRootOid || r.newRootOid === A) return false;
    return r.source === `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <a data-dropin-id="${r.newRootOid}"/>
</div>`;
  }
);

// 2. Middle of 3 → duplicate after itself
test(
  "duplicate middle of 3 → inserted after",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: B },
  (r) => {
    if (r.unchanged) return false;
    if (!r.newRootOid || r.newRootOid === B) return false;
    return r.source === `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <b data-dropin-id="${r.newRootOid}"/>
  <c data-dropin-id="${C}"/>
</div>`;
  }
);

// 3. Last sibling — duplicate appended at end
test(
  "duplicate last sibling",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: B },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <b data-dropin-id="${r.newRootOid}"/>
</div>`;
  }
);

// 4. First sibling — duplicate inserted between
test(
  "duplicate first sibling",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <a data-dropin-id="${r.newRootOid}"/>
  <b data-dropin-id="${B}"/>
</div>`;
  }
);

// 5. Element with children — entire subtree duplicated, all OIDs fresh
test(
  "duplicate element with nested children — fresh OIDs throughout",
  `<div data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <h1 data-dropin-id="${B}">Hi</h1>
    <p data-dropin-id="${C}">There</p>
  </section>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    // Every OID in the duplicate must be fresh — none of A/B/C reused.
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) {
      if (count !== 1) return false;
    }
    // Original A/B/C still present; three fresh oids added.
    return (
      counts.has(A) &&
      counts.has(B) &&
      counts.has(C) &&
      counts.size === 3 + 3 + 1 // P + A,B,C + 3 fresh
    );
  }
);

// 6. Top-level element — bail
test(
  "top-level <div/> with no JSX parent → bail",
  `<div data-dropin-id="${A}"/>`,
  { oid: A },
  { unchanged: true }
);

// 7. Top-level wrapped in tsx export
test(
  "top-level returned from arrow function → bail",
  `const App = () => <div data-dropin-id="${A}"/>`,
  { oid: A },
  { unchanged: true }
);

// 8. oid not found
test(
  "oid not found → bail",
  `<div data-dropin-id="${A}"><b data-dropin-id="${B}"/></div>`,
  { oid: "zzzzzzzz" },
  { unchanged: true }
);

// 9. Element with attributes preserved
test(
  "attributes preserved verbatim in duplicate",
  `<div data-dropin-id="${P}">
  <button data-dropin-id="${A}" className="primary" onClick={fn}>Click</button>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`className="primary" onClick={fn}>Click</button>`);
  }
);

// 10. Nested children: re-mint preserves text content
test(
  "duplicate preserves inner text content",
  `<div data-dropin-id="${P}">
  <h1 data-dropin-id="${A}">Hello, world</h1>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    // Two h1's, both with "Hello, world".
    const matches = [...r.source.matchAll(/Hello, world/g)];
    return matches.length === 2;
  }
);

// 11. JSX inside expression (parent has JSXExpressionContainer sibling)
test(
  "duplicate sibling beside {expr} container",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  {cond && <span/>}
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<a data-dropin-id="${A}"/>\n  <a data-dropin-id="${r.newRootOid}"/>`);
  }
);

// 12. tsx-wrapped (function returning JSX)
test(
  "duplicate inside tsx wrapper",
  `export default function App() {
  return (
    <div data-dropin-id="${P}">
      <a data-dropin-id="${A}"/>
    </div>
  );
}`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<a data-dropin-id="${A}"/>\n      <a data-dropin-id="${r.newRootOid}"/>`);
  }
);

// 13. Compact siblings (no whitespace between)
test(
  "compact siblings — duplicate inherits empty leading WS",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/><b data-dropin-id="${B}"/></div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/><a data-dropin-id="${r.newRootOid}"/><b data-dropin-id="${B}"/></div>`;
  }
);

// 14. Text-content sibling preserved
test(
  "text-content sibling preserved",
  `<div data-dropin-id="${P}">Hello <a data-dropin-id="${A}"/> World</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    // After duplicate insertion: "Hello <a/><a/> World"
    return r.source === `<div data-dropin-id="${P}">Hello <a data-dropin-id="${A}"/><a data-dropin-id="${r.newRootOid}"/> World</div>`;
  }
);

// 15. Lossless re-apply: duplicate twice → 3 copies, all unique OIDs
test(
  "duplicate twice composes — 3 unique OIDs",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    const r2 = applyDuplicate(r.source, { oid: A });
    if (r2.unchanged) return false;
    const oids = [...r2.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, c] of counts) if (c !== 1) return false;
    return counts.size === 4; // P + A + r.newRootOid + r2.newRootOid
  }
);

// 16. Deeply nested target
test(
  "deeply nested element duplicates correctly",
  `<main data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <article data-dropin-id="${B}">
      <p data-dropin-id="${C}"/>
    </article>
  </section>
</main>`,
  { oid: C },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<p data-dropin-id="${C}"/>\n      <p data-dropin-id="${r.newRootOid}"/>`);
  }
);

// 17. Self-closing parent: bail not needed (srcEl wouldn't exist
// inside, so findJsxElementByOid bails first). Confirm with a
// self-closing element targeted directly with its own oid.
test(
  "self-closing target with no JSX parent → bail",
  `const X = () => <a data-dropin-id="${A}" className="solo"/>;`,
  { oid: A },
  { unchanged: true }
);

// 18. parse failure
test(
  "parse failure → bail",
  `<div data-dropin-id="${P}"><<<< not valid jsx`,
  { oid: A },
  { unchanged: true }
);

// 19. New OIDs do not collide with siblings
test(
  "new OIDs avoid collision with siblings",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <a data-dropin-id="${B}"/>
  <a data-dropin-id="${C}"/>
  <a data-dropin-id="${D}"/>
  <a data-dropin-id="${E}"/>
  <a data-dropin-id="${F}"/>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    const seen = new Set([A, B, C, D, E, F, P]);
    return !seen.has(r.newRootOid);
  }
);

// 20. Duplicate with JSXFragment as sibling
test(
  "fragment sibling stays put after duplicate",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <>
    <b data-dropin-id="${B}"/>
  </>
</div>`,
  { oid: A },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<a data-dropin-id="${A}"/>\n  <a data-dropin-id="${r.newRootOid}"/>`)
      && r.source.includes("<>") && r.source.includes("</>");
  }
);

// 21. newRootOid present on success, null on bail
test(
  "newRootOid is null on bail (oid not found)",
  `<div data-dropin-id="${P}"/>`,
  { oid: "missing00" },
  (r) => r.unchanged && r.newRootOid === null
);

// 22. Verifies new OID is valid 8-char alphanumeric
test(
  "newRootOid passes isValidOid",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { oid: A },
  (r) => !r.unchanged && isValidOid(r.newRootOid)
);

console.log(`\n${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
