// Ad-hoc smoke test for `lib/ast/operations/insert.ts applyInsertChild`.
// Inlines the module so the script runs without a TS build step.
// Mirrors the layout of `bench-duplicate.mjs` / `bench-reparent.mjs`.
//
// Run from repo root: `node scripts/bench-insert.mjs`. A regression
// here would silently break the Phase C Insert tool flow that wires
// Workspace `handleInsertInto` → `applyInsertChild`.

import { parse } from "@babel/parser";
import MagicString from "magic-string";

const OID_ATTR = "data-dropin-id";
const PARSE_OPTS = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

const SKIP_KEYS = new Set([
  "loc", "tokens", "comments", "extra", "start", "end",
  "leadingComments", "trailingComments",
]);

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const OID_LEN = 8;
const OID_REGEX = /^[A-Za-z0-9]{8}$/;
const OID_ATTR_RE = /(\sdata-dropin-id=")([A-Za-z0-9]{8})(")/g;

const DROPIN_LEAF_TAGS_LOWER = new Set([
  "img", "input", "br", "hr", "area", "base", "col", "embed",
  "link", "meta", "param", "source", "track", "wbr",
  "iframe", "object", "script", "style", "noscript",
  "textarea", "select", "option", "optgroup", "progress", "meter",
  "canvas", "video", "audio", "picture", "svg",
]);

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

function collectOpenings(node, into) {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") into.push(node);
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) collectOpenings(c, into);
    } else if (child && typeof child === "object" && child.type) {
      collectOpenings(child, into);
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

function tagNameOf(opening) {
  const n = opening?.name;
  if (n?.type === "JSXIdentifier" && typeof n.name === "string") {
    return n.name.toLowerCase();
  }
  return "";
}

function parseAsset(jsx) {
  const trimmed = jsx.trim();
  if (!trimmed) return null;
  const wrapped = `(<>${trimmed}</>);`;
  try {
    return parse(wrapped, PARSE_OPTS);
  } catch {
    return null;
  }
}

function findAssetRange(wrapAst) {
  function findFragment(node) {
    if (!node || typeof node !== "object") return null;
    if (node.type === "JSXFragment") return node;
    for (const key in node) {
      if (SKIP_KEYS.has(key)) continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const c of child) {
          const r = findFragment(c);
          if (r) return r;
        }
      } else if (child && typeof child === "object" && child.type) {
        const r = findFragment(child);
        if (r) return r;
      }
    }
    return null;
  }
  const frag = findFragment(wrapAst);
  if (!frag) return null;
  const start = frag.openingFragment?.end;
  const end = frag.closingFragment?.start;
  if (typeof start !== "number" || typeof end !== "number") return null;
  return { start, end };
}

function applyInsertChild(source, op) {
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}`, insertedOid: null };
  }

  const parent = findJsxElementByOid(ast, op.parentOid);
  if (!parent) {
    return { source, unchanged: true, reason: `parent oid "${op.parentOid}" not found`, insertedOid: null };
  }

  if (parent.openingElement?.selfClosing || !parent.closingElement) {
    return { source, unchanged: true, reason: "Can't insert into self-closing element", insertedOid: null };
  }

  const parentTag = tagNameOf(parent.openingElement);
  if (parentTag && DROPIN_LEAF_TAGS_LOWER.has(parentTag)) {
    return { source, unchanged: true, reason: `Can't insert into <${parentTag}>`, insertedOid: null };
  }

  const closingStart = parent.closingElement?.start;
  const openingEnd = parent.openingElement?.end;
  if (typeof closingStart !== "number" || typeof openingEnd !== "number") {
    return { source, unchanged: true, reason: "parent missing opening/closing position info", insertedOid: null };
  }

  const assetAst = parseAsset(op.jsx);
  if (!assetAst) {
    return { source, unchanged: true, reason: "asset failed to parse as JSX", insertedOid: null };
  }
  const assetRange = findAssetRange(assetAst);
  if (!assetRange) {
    return { source, unchanged: true, reason: "asset wrapper produced no fragment node", insertedOid: null };
  }

  const wrapped = `(<>${op.jsx.trim()}</>);`;
  const assetText = wrapped.slice(assetRange.start, assetRange.end);
  if (!assetText.trim()) {
    return { source, unchanged: true, reason: "asset had no JSX content", insertedOid: null };
  }

  const openings = [];
  collectOpenings(assetAst, openings);
  openings.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));

  const seen = new Set();
  collectAllOids(ast, seen);

  const edits = [];
  let insertedOid = null;

  for (let i = 0; i < openings.length; i++) {
    const opening = openings[i];
    const fresh = mintFresh(closingStart + i * 7919, seen);
    seen.add(fresh);
    if (i === 0) insertedOid = fresh;

    let replacedExisting = false;
    for (const a of opening.attributes || []) {
      if (
        a?.type === "JSXAttribute" &&
        a.name?.type === "JSXIdentifier" &&
        a.name.name === OID_ATTR &&
        a.value?.type === "StringLiteral" &&
        typeof a.value.start === "number" &&
        typeof a.value.end === "number"
      ) {
        const valStart = a.value.start - assetRange.start;
        const valEnd = a.value.end - assetRange.start;
        edits.push({ start: valStart, end: valEnd, text: `"${fresh}"` });
        replacedExisting = true;
        break;
      }
    }
    if (!replacedExisting) {
      const nameEnd = opening.name?.end;
      if (typeof nameEnd !== "number") continue;
      const insertPos = nameEnd - assetRange.start;
      edits.push({
        start: insertPos,
        end: insertPos,
        text: ` ${OID_ATTR}="${fresh}"`,
      });
    }
  }

  edits.sort((a, b) => b.start - a.start);
  let stamped = assetText;
  for (const e of edits) {
    stamped = stamped.slice(0, e.start) + e.text + stamped.slice(e.end);
  }

  const children = parent.children || [];
  let indent = "\n  ";
  let appendPos = closingStart;
  let foundLastChild = false;
  let lastReal = null;
  let lastRealPrevEnd = openingEnd;
  let runningPrevEnd = openingEnd;
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c.type === "JSXText") {
      const v = typeof c.value === "string" ? c.value : "";
      if (v.trim() === "") continue;
    }
    lastReal = c;
    lastRealPrevEnd = runningPrevEnd;
    if (typeof c.end === "number") runningPrevEnd = c.end;
    foundLastChild = true;
  }
  if (foundLastChild && lastReal && typeof lastReal.start === "number") {
    indent = source.slice(lastRealPrevEnd, lastReal.start);
    appendPos = typeof lastReal.end === "number" ? lastReal.end : closingStart;
  } else {
    appendPos = openingEnd;
  }

  const insertText = indent + stamped;

  const s = new MagicString(source);
  s.appendLeft(appendPos, insertText);

  return {
    source: s.toString(),
    unchanged: false,
    reason: null,
    insertedOid,
  };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, source, op, expected) {
  const r = applyInsertChild(source, op);
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
    if (!r.unchanged) console.log(`  -> ${JSON.stringify(r.source)}`);
    else if (r.reason) console.log(`  -> unchanged (${r.reason})`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  got: ${JSON.stringify({
      unchanged: r.unchanged,
      reason: r.reason,
      source: r.unchanged ? null : r.source,
      insertedOid: r.insertedOid,
    })}`);
  }
}

const P = "pppppppp";
const A = "aaaaaaaa";
const B = "bbbbbbbb";
const C = "cccccccc";

// 1. Empty parent — asset lands as first child with default \n  indent
test(
  "insert into empty parent",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: P, jsx: `<span/>` },
  (r) => {
    if (r.unchanged) return false;
    if (!r.insertedOid) return false;
    if (!isValidOid(r.insertedOid)) return false;
    return r.source === `<div data-dropin-id="${P}">\n  <span data-dropin-id="${r.insertedOid}"/></div>`;
  }
);

// 2. Single-child parent — asset appended after, indent inherited
test(
  "insert appended after single existing child",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { parentOid: P, jsx: `<span/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <span data-dropin-id="${r.insertedOid}"/>
</div>`;
  }
);

// 3. Many-children parent — asset appended after the last
test(
  "insert appended after many existing children",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { parentOid: P, jsx: `<span/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
  <span data-dropin-id="${r.insertedOid}"/>
</div>`;
  }
);

// 4. Nested asset — every nested element gets a fresh, unique OID
test(
  "insert nested asset — all OIDs fresh + unique",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  {
    parentOid: P,
    jsx: `<section><h1>Hi</h1><p>There</p></section>`,
  },
  (r) => {
    if (r.unchanged) return false;
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    // Original: P + A. Asset: section + h1 + p = 3. Total = 5.
    return counts.size === 5 && counts.has(P) && counts.has(A);
  }
);

// 5. Self-closing parent — bail
test(
  "self-closing parent → bail",
  `<div data-dropin-id="${P}"><img data-dropin-id="${A}"/></div>`,
  { parentOid: A, jsx: `<span/>` },
  { unchanged: true }
);

// 6. Leaf-tag parent (input) → bail
test(
  "<input> parent → bail",
  `<div data-dropin-id="${P}"><input data-dropin-id="${A}"/></div>`,
  { parentOid: A, jsx: `<span/>` },
  { unchanged: true }
);

// 7. Leaf-tag parent (select) → bail
test(
  "<select> parent → bail (leaf tag)",
  `<div data-dropin-id="${P}"><select data-dropin-id="${A}"></select></div>`,
  { parentOid: A, jsx: `<option/>` },
  { unchanged: true }
);

// 8. Asset that fails to parse → bail
test(
  "asset fails to parse → bail",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: P, jsx: `<<<not jsx>>>` },
  { unchanged: true }
);

// 9. Parent oid not found → bail
test(
  "parent oid not found → bail",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: "missing00", jsx: `<span/>` },
  { unchanged: true }
);

// 10. Source doesn't parse → bail
test(
  "source fails to parse → bail",
  `<div data-dropin-id="${P}"><<<<<broken`,
  { parentOid: P, jsx: `<span/>` },
  { unchanged: true }
);

// 11. Insert with attributes preserved verbatim
test(
  "asset attributes preserved",
  `<div data-dropin-id="${P}"></div>`,
  {
    parentOid: P,
    jsx: `<button className="primary" onClick={fn}>Click</button>`,
  },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<button data-dropin-id="${r.insertedOid}" className="primary" onClick={fn}>Click</button>`);
  }
);

// 12. Asset already has stale OIDs — they get replaced (not duplicated)
test(
  "asset with pre-existing OIDs — values replaced",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  {
    parentOid: P,
    jsx: `<span data-dropin-id="${A}"/>`,
  },
  (r) => {
    if (r.unchanged) return false;
    if (r.insertedOid === A) return false;
    // The original `<a data-dropin-id="A"/>` stays; the asset's old
    // `A` gets replaced with the fresh root oid.
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    return counts.has(A) && counts.has(P) && counts.has(r.insertedOid);
  }
);

// 13. Insert preserves the closing tag's leading newline / indent
test(
  "indent preserved for closing tag",
  `<main data-dropin-id="${P}">
  <p data-dropin-id="${A}"/>
</main>`,
  { parentOid: P, jsx: `<span/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.endsWith(`</main>`) && r.source.includes(`\n</main>`);
  }
);

// 14. Empty parent gets default indent
test(
  "empty parent — asset lands inline (compact)",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: P, jsx: `<span/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.startsWith(`<div data-dropin-id="${P}">`);
  }
);

// 15. Round-trip: 2 inserts produce 2 appended children, fresh OIDs
test(
  "two inserts compose — both visible, OIDs unique",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: P, jsx: `<span/>` },
  (r1) => {
    if (r1.unchanged) return false;
    const r2 = applyInsertChild(r1.source, { parentOid: P, jsx: `<em/>` });
    if (r2.unchanged) return false;
    const oids = [...r2.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    return counts.size === 3 && counts.has(P);
  }
);

// 16. tsx-wrapped parent
test(
  "insert into tsx-wrapped parent",
  `export default function App() {
  return (
    <div data-dropin-id="${P}">
      <a data-dropin-id="${A}"/>
    </div>
  );
}`,
  { parentOid: P, jsx: `<span/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<a data-dropin-id="${A}"/>\n      <span data-dropin-id="${r.insertedOid}"/>`);
  }
);

// 17. Deeply nested target — empty parent uses default indent
test(
  "deeply nested target receives insert",
  `<main data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <article data-dropin-id="${B}">
    </article>
  </section>
</main>`,
  { parentOid: B, jsx: `<p/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<article data-dropin-id="${B}">\n  <p data-dropin-id="${r.insertedOid}"/>`);
  }
);

// 18. Asset with children (nested) — nested OIDs all unique
test(
  "asset with own nested children — all OIDs unique",
  `<div data-dropin-id="${P}"></div>`,
  {
    parentOid: P,
    jsx: `<section><div><h1>A</h1><h2>B</h2></div><p>C</p></section>`,
  },
  (r) => {
    if (r.unchanged) return false;
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    // P + asset (section + div + h1 + h2 + p) = 6 unique OIDs.
    return counts.size === 6 && counts.has(P);
  }
);

// 19. <a> parent allowed (not in leaf-tags) — accepts children
test(
  "<a> parent accepts children (not leaf-tag)",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}" href="/x"></a></div>`,
  { parentOid: A, jsx: `<span>label</span>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<a data-dropin-id="${A}" href="/x">`)
      && r.source.includes(`<span data-dropin-id="${r.insertedOid}">label</span>`);
  }
);

// 20. <button> parent allowed (not in leaf-tags) — empty parent default indent
test(
  "<button> parent accepts children",
  `<div data-dropin-id="${P}"><button data-dropin-id="${A}"></button></div>`,
  { parentOid: A, jsx: `<span>txt</span>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<button data-dropin-id="${A}">\n  <span data-dropin-id="${r.insertedOid}">txt</span></button>`);
  }
);

// 21. Multi-element asset (siblings inside fragment-shaped) — only the
// first becomes root; OIDs all unique. Vibecoder might paste multiple.
test(
  "multi-root asset — first opening becomes insertedOid",
  `<div data-dropin-id="${P}"></div>`,
  {
    parentOid: P,
    jsx: `<h1>Title</h1><p>Body</p>`,
  },
  (r) => {
    if (r.unchanged) return false;
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    return counts.size === 3 && counts.has(P) && counts.has(r.insertedOid);
  }
);

// 22. Verify insertedOid is null on bail
test(
  "insertedOid is null on bail (oid not found)",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: "missing00", jsx: `<span/>` },
  (r) => r.unchanged && r.insertedOid === null
);

// 23. Verify insertedOid passes isValidOid on success
test(
  "insertedOid passes isValidOid",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: P, jsx: `<span/>` },
  (r) => !r.unchanged && isValidOid(r.insertedOid)
);

// 24. Asset's own OID collision — fresh values do not match seen
test(
  "asset OID seen-set: collision with existing OID is bumped",
  `<div data-dropin-id="${P}"></div>`,
  {
    parentOid: P,
    // Asset already has the same OID as the parent — engine must replace
    // it with something distinct from P.
    jsx: `<span data-dropin-id="${P}"/>`,
  },
  (r) => {
    if (r.unchanged) return false;
    if (r.insertedOid === P) return false;
    return isValidOid(r.insertedOid);
  }
);

// 25. Whitespace asset → bail (no JSX content)
test(
  "whitespace-only asset → bail",
  `<div data-dropin-id="${P}"></div>`,
  { parentOid: P, jsx: `   ` },
  { unchanged: true }
);

console.log(`\n${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
