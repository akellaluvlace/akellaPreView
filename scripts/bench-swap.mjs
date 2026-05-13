// Ad-hoc smoke test for `lib/ast/operations/swap.ts applySwap`.
// Inlines the module so the script runs without a TS build step.
// Mirrors the layout of `bench-insert.mjs`.

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
  return { start, end, fragment: frag };
}

function applySwap(source, op) {
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}`, swappedOid: null };
  }

  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl) {
    return { source, unchanged: true, reason: `oid "${op.oid}" not found`, swappedOid: null };
  }

  const parentMap = buildParentMap(ast);
  const parent = parentMap.get(srcEl) ?? null;
  if (!parent) {
    return { source, unchanged: true, reason: "Can't swap the root element", swappedOid: null };
  }

  if (typeof srcEl.start !== "number" || typeof srcEl.end !== "number") {
    return { source, unchanged: true, reason: "source element missing position info", swappedOid: null };
  }

  const assetAst = parseAsset(op.jsx);
  if (!assetAst) {
    return { source, unchanged: true, reason: "asset failed to parse as JSX", swappedOid: null };
  }
  const assetRange = findAssetRange(assetAst);
  if (!assetRange) {
    return { source, unchanged: true, reason: "asset wrapper produced no fragment node", swappedOid: null };
  }

  const wrapped = `(<>${op.jsx.trim()}</>);`;
  const assetText = wrapped.slice(assetRange.start, assetRange.end);
  if (!assetText.trim()) {
    return { source, unchanged: true, reason: "asset had no JSX content", swappedOid: null };
  }

  const openings = [];
  collectOpenings(assetAst, openings);
  openings.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));

  let preserveChildren = false;
  let assetRootInner = null;
  if (op.preserveChildren) {
    const fragChildren = Array.isArray(assetRange.fragment?.children)
      ? assetRange.fragment.children
      : [];
    const topElements = fragChildren.filter((c) => c && c.type === "JSXElement");
    if (topElements.length === 0) {
      return { source, unchanged: true, reason: "asset has no JSX root to preserve children into", swappedOid: null };
    }
    if (topElements.length > 1) {
      return { source, unchanged: true, reason: "asset has multiple roots — preserve-children needs a single wrapper", swappedOid: null };
    }
    const root = topElements[0];
    if (!root.closingElement) {
      return { source, unchanged: true, reason: "asset root is self-closing — can't preserve children", swappedOid: null };
    }
    const innerStart = root.openingElement?.end;
    const innerEnd = root.closingElement?.start;
    if (typeof innerStart !== "number" || typeof innerEnd !== "number") {
      return { source, unchanged: true, reason: "asset root missing inner-range position info", swappedOid: null };
    }
    preserveChildren = true;
    assetRootInner = {
      start: innerStart - assetRange.start,
      end: innerEnd - assetRange.start,
    };
  }

  const seen = new Set();
  collectAllOids(ast, seen);
  if (preserveChildren) {
    collectAllOids(srcEl, seen);
  }

  const edits = [];
  let swappedOid = null;

  for (let i = 0; i < openings.length; i++) {
    const opening = openings[i];
    const fresh = mintFresh(srcEl.start + i * 7919, seen);
    seen.add(fresh);
    if (i === 0) swappedOid = fresh;

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

  let stagedEdits = edits;
  if (preserveChildren && assetRootInner) {
    const innerStart = assetRootInner.start;
    const innerEnd = assetRootInner.end;
    let srcChildrenText = "";
    const srcOpening = srcEl.openingElement;
    const srcClosing = srcEl.closingElement;
    if (
      srcOpening && srcClosing &&
      typeof srcOpening.end === "number" &&
      typeof srcClosing.start === "number"
    ) {
      srcChildrenText = source.slice(srcOpening.end, srcClosing.start);
    }
    stagedEdits = edits.filter((e) => e.start < innerStart || e.start >= innerEnd);
    stagedEdits.push({ start: innerStart, end: innerEnd, text: srcChildrenText });
  }

  stagedEdits.sort((a, b) => b.start - a.start);
  let stamped = assetText;
  for (const e of stagedEdits) {
    stamped = stamped.slice(0, e.start) + e.text + stamped.slice(e.end);
  }

  const s = new MagicString(source);
  s.overwrite(srcEl.start, srcEl.end, stamped);

  return {
    source: s.toString(),
    unchanged: false,
    reason: null,
    swappedOid,
  };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, source, op, expected) {
  const r = applySwap(source, op);
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
      swappedOid: r.swappedOid,
    })}`);
  }
}

const P = "pppppppp";
const A = "aaaaaaaa";
const B = "bbbbbbbb";
const C = "cccccccc";

// 1. Simple swap: replace <a/> with <button/>
test(
  "simple swap, self-closing target",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { oid: A, jsx: `<button>Click</button>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">
  <button data-dropin-id="${r.swappedOid}">Click</button>
</div>`;
  }
);

// 2. Swap with children → children DISCARDED
test(
  "swap discards original children",
  `<div data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <h1 data-dropin-id="${B}">Old title</h1>
    <p data-dropin-id="${C}">Old body</p>
  </section>
</div>`,
  { oid: A, jsx: `<aside>New</aside>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">
  <aside data-dropin-id="${r.swappedOid}">New</aside>
</div>`;
  }
);

// 3. Top-level: bail (no JSX parent)
test(
  "top-level <div/> → bail",
  `<div data-dropin-id="${A}"/>`,
  { oid: A, jsx: `<span/>` },
  { unchanged: true }
);

// 4. Top-level returned from arrow → bail
test(
  "top-level returned from arrow → bail",
  `const App = () => <div data-dropin-id="${A}"/>`,
  { oid: A, jsx: `<span/>` },
  { unchanged: true }
);

// 5. oid not found → bail
test(
  "oid not found → bail",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: "missing00", jsx: `<span/>` },
  { unchanged: true }
);

// 6. Asset parse failure → bail
test(
  "asset parse failure → bail",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, jsx: `<<<not jsx` },
  { unchanged: true }
);

// 7. Source parse failure → bail
test(
  "source parse failure → bail",
  `<div data-dropin-id="${P}"><<<<<broken`,
  { oid: A, jsx: `<span/>` },
  { unchanged: true }
);

// 8. Asset has nested children — all OIDs minted fresh
test(
  "asset with nested children — all OIDs unique",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
</div>`,
  { oid: A, jsx: `<section><h1>Hello</h1><p>World</p></section>` },
  (r) => {
    if (r.unchanged) return false;
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    // Original P stays. A is gone (swapped out). Asset adds 3 new OIDs.
    return counts.size === 4 && counts.has(P) && !counts.has(A);
  }
);

// 9. Neighbor preservation — siblings untouched
test(
  "siblings untouched after swap",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`,
  { oid: B, jsx: `<x/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<a data-dropin-id="${A}"/>`)
      && r.source.includes(`<c data-dropin-id="${C}"/>`)
      && !r.source.includes(`data-dropin-id="${B}"`);
  }
);

// 10. Asset attributes preserved
test(
  "asset's attributes win",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}" className="old">Old</a>
</div>`,
  { oid: A, jsx: `<button className="new" type="submit">New</button>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<button data-dropin-id="${r.swappedOid}" className="new" type="submit">New</button>`);
  }
);

// 11. Whitespace asset → bail
test(
  "whitespace-only asset → bail",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, jsx: `   ` },
  { unchanged: true }
);

// 12. Self-closing target swapped with non-self-closing asset
test(
  "self-closing target → non-self-closing asset",
  `<div data-dropin-id="${P}">
  <img data-dropin-id="${A}"/>
</div>`,
  { oid: A, jsx: `<div>I'm a div now</div>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">
  <div data-dropin-id="${r.swappedOid}">I'm a div now</div>
</div>`;
  }
);

// 13. tsx-wrapped target
test(
  "tsx-wrapped target",
  `export default function App() {
  return (
    <div data-dropin-id="${P}">
      <a data-dropin-id="${A}"/>
    </div>
  );
}`,
  { oid: A, jsx: `<span/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<span data-dropin-id="${r.swappedOid}"/>`)
      && !r.source.includes(`data-dropin-id="${A}"`);
  }
);

// 14. Asset with own OID — replaced by fresh
test(
  "asset with stale OID — value replaced",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, jsx: `<span data-dropin-id="${A}"/>` },
  (r) => {
    if (r.unchanged) return false;
    if (r.swappedOid === A) return false;
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    return counts.has(P) && counts.has(r.swappedOid);
  }
);

// 15. Round-trip: 2 swaps in a row work
test(
  "two swaps compose",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, jsx: `<span/>` },
  (r1) => {
    if (r1.unchanged) return false;
    const r2 = applySwap(r1.source, { oid: r1.swappedOid, jsx: `<em/>` });
    if (r2.unchanged) return false;
    return r2.source === `<div data-dropin-id="${P}"><em data-dropin-id="${r2.swappedOid}"/></div>`;
  }
);

// 16. swappedOid is null on bail
test(
  "swappedOid is null on bail",
  `<div data-dropin-id="${A}"/>`,
  { oid: A, jsx: `<span/>` },
  (r) => r.unchanged && r.swappedOid === null
);

// 17. swappedOid passes isValidOid
test(
  "swappedOid passes isValidOid",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, jsx: `<span/>` },
  (r) => !r.unchanged && isValidOid(r.swappedOid)
);

// 18. Deeply nested target swapped
test(
  "deeply nested target swap",
  `<main data-dropin-id="${P}">
  <section>
    <article data-dropin-id="${A}">
      <p data-dropin-id="${B}">Body</p>
    </article>
  </section>
</main>`,
  { oid: A, jsx: `<aside>New</aside>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<aside data-dropin-id="${r.swappedOid}">New</aside>`)
      && !r.source.includes(`data-dropin-id="${A}"`)
      && !r.source.includes(`data-dropin-id="${B}"`);
  }
);

// 19. Multi-element asset (multiple top-level openings) — first wins as root
test(
  "multi-element asset — first opening becomes root",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, jsx: `<h1>Title</h1><p>Body</p>` },
  (r) => {
    if (r.unchanged) return false;
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    return counts.size === 3 && counts.has(P);
  }
);

// 20. Compact siblings (no whitespace)
test(
  "compact siblings — swap preserves layout",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/><b data-dropin-id="${B}"/></div>`,
  { oid: A, jsx: `<x/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}"><x data-dropin-id="${r.swappedOid}"/><b data-dropin-id="${B}"/></div>`;
  }
);

// 21. Text-content sibling preserved
test(
  "text-content sibling preserved",
  `<div data-dropin-id="${P}">Hello <a data-dropin-id="${A}"/> World</div>`,
  { oid: A, jsx: `<x/>` },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">Hello <x data-dropin-id="${r.swappedOid}"/> World</div>`;
  }
);

// 22. Asset's nested OIDs all unique
test(
  "asset with deep nested children — every OID unique",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, jsx: `<section><div><h1>A</h1><h2>B</h2></div><p>C</p></section>` },
  (r) => {
    if (r.unchanged) return false;
    const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
    const counts = new Map();
    for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
    for (const [, count] of counts) if (count !== 1) return false;
    // P + asset (5 elements) = 6 OIDs.
    return counts.size === 6 && counts.has(P);
  }
);

// --- preserveChildren v2 (twenty-third pass) ---
//
// 23. preserveChildren — text body kept across shell swap
test(
  "preserveChildren: <a>Click me</a> → <button>Click me</button>",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}">Click me</a></div>`,
  { oid: A, jsx: `<button className="new">PLACEHOLDER</button>`, preserveChildren: true },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}"><button data-dropin-id="${r.swappedOid}" className="new">Click me</button></div>`;
  }
);

// 24. preserveChildren — nested children with their existing OIDs intact
test(
  "preserveChildren: nested children keep their OIDs",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"><span data-dropin-id="${B}">Label</span><i data-dropin-id="${C}">x</i></a></div>`,
  { oid: A, jsx: `<button>asset original inner</button>`, preserveChildren: true },
  (r) => {
    if (r.unchanged) return false;
    // Children kept: span + i with original OIDs B, C.
    if (!r.source.includes(`<span data-dropin-id="${B}">Label</span>`)) return false;
    if (!r.source.includes(`<i data-dropin-id="${C}">x</i>`)) return false;
    // Asset root replaced wrapper.
    if (!r.source.includes(`<button data-dropin-id="${r.swappedOid}">`)) return false;
    if (r.source.includes("asset original inner")) return false;
    return true;
  }
);

// 25. preserveChildren — self-closing asset → bail
test(
  "preserveChildren: self-closing asset bail",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}">Hi</a></div>`,
  { oid: A, jsx: `<input/>`, preserveChildren: true },
  (r) => r.unchanged && r.reason === "asset root is self-closing — can't preserve children"
);

// 26. preserveChildren — multi-rooted asset → bail
test(
  "preserveChildren: multi-rooted asset bail",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}">Hi</a></div>`,
  { oid: A, jsx: `<h1>Title</h1><p>Body</p>`, preserveChildren: true },
  (r) => r.unchanged && /multiple roots/.test(r.reason || "")
);

// 27. preserveChildren — source self-closing → asset becomes empty (deliberate)
test(
  "preserveChildren: self-closing source → asset content becomes empty",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"/></div>`,
  { oid: A, jsx: `<button>Original asset text</button>`, preserveChildren: true },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}"><button data-dropin-id="${r.swappedOid}"></button></div>`;
  }
);

// 28. preserveChildren=false explicitly → identical to default behavior
test(
  "preserveChildren=false explicit equals default",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}">Old</a></div>`,
  { oid: A, jsx: `<button>New</button>`, preserveChildren: false },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}"><button data-dropin-id="${r.swappedOid}">New</button></div>`;
  }
);

// 29. preserveChildren — deeply nested children with mixed JSXText preserved verbatim
test(
  "preserveChildren: mixed text+element children preserved verbatim",
  `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}">
    Hello <span data-dropin-id="${B}">world</span>!
  </a>
</div>`,
  { oid: A, jsx: `<button>placeholder</button>`, preserveChildren: true },
  (r) => {
    if (r.unchanged) return false;
    return r.source === `<div data-dropin-id="${P}">
  <button data-dropin-id="${r.swappedOid}">
    Hello <span data-dropin-id="${B}">world</span>!
  </button>
</div>`;
  }
);

// 30. preserveChildren — round-trip stable (apply twice with different shells)
test(
  "preserveChildren: round-trip across two shell swaps",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"><span data-dropin-id="${B}">Label</span></a></div>`,
  { oid: A, jsx: `<button>x</button>`, preserveChildren: true },
  (r1) => {
    if (r1.unchanged) return false;
    if (!r1.source.includes(`<span data-dropin-id="${B}">Label</span>`)) return false;
    const r2 = applySwap(r1.source, { oid: r1.swappedOid, jsx: `<a>z</a>`, preserveChildren: true });
    if (r2.unchanged) return false;
    // Original B-OID children survive both swaps.
    if (!r2.source.includes(`<span data-dropin-id="${B}">Label</span>`)) return false;
    return r2.source === `<div data-dropin-id="${P}"><a data-dropin-id="${r2.swappedOid}"><span data-dropin-id="${B}">Label</span></a></div>`;
  }
);

// 31. preserveChildren — asset's own children are dropped (not pasted alongside src children)
test(
  "preserveChildren: asset's original inner content is dropped",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}">SRC</a></div>`,
  { oid: A, jsx: `<button><i>asset icon</i> asset label</button>`, preserveChildren: true },
  (r) => {
    if (r.unchanged) return false;
    if (r.source.includes("asset label")) return false;
    if (r.source.includes("asset icon")) return false;
    return r.source === `<div data-dropin-id="${P}"><button data-dropin-id="${r.swappedOid}">SRC</button></div>`;
  }
);

// 32. preserveChildren — top-level srcEl bail still wins (preserveChildren doesn't override structure rules)
test(
  "preserveChildren: top-level srcEl still bails",
  `<div data-dropin-id="${A}">Body</div>`,
  { oid: A, jsx: `<button>x</button>`, preserveChildren: true },
  (r) => r.unchanged && r.reason === "Can't swap the root element"
);

// 33. preserveChildren — fresh OID still issued for the new shell (not stale from asset)
test(
  "preserveChildren: shell OID is fresh",
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}">X</a></div>`,
  { oid: A, jsx: `<button data-dropin-id="${A}">y</button>`, preserveChildren: true },
  (r) => {
    if (r.unchanged) return false;
    if (r.swappedOid === A) return false;
    return isValidOid(r.swappedOid);
  }
);

// 34. preserveChildren — preserved child's OID excluded from fresh-mint collisions
test(
  "preserveChildren: shell OID never collides with preserved child",
  // Reuse a known seed shape — A is the source root, B is the child whose
  // OID survives. The shell mint is seeded by srcEl.start; we want to
  // assert the bump loop avoids B even if B happened to be the candidate.
  `<div data-dropin-id="${P}"><a data-dropin-id="${A}"><span data-dropin-id="${B}">child</span></a></div>`,
  { oid: A, jsx: `<button>x</button>`, preserveChildren: true },
  (r) => {
    if (r.unchanged) return false;
    if (r.swappedOid === B) return false;
    if (r.swappedOid === A) return false;
    if (r.swappedOid === P) return false;
    return true;
  }
);

console.log(`\n${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
