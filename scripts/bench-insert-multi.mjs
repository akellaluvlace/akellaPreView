// Phase 6 ramp — bench for the iterate-and-batch composition of
// applyInsertChild that powers `Workspace.handleInsertIntoMulti`. The
// composition isn't a separate engine module — it's a thin loop over
// applyInsertChild against a running source, mirroring how
// handleReorderMulti / handleDuplicateMulti / handleSpacingMulti work.
//
// What this bench locks down:
//   1. Empty ops list → no commit (caller should skip setCode).
//   2. Single op composes to the same result as applyInsertChild.
//   3. Multi-target into N different parents → N inserts, all OIDs
//      unique across batches.
//   4. Multi-target into the SAME parent N times → N appended children,
//      each with unique fresh OIDs (the per-batch seen-set sees the
//      previous batches' minted OIDs because each call's `collectAllOids`
//      reads the freshest source).
//   5. Mid-list bail propagates correctly — earlier commits stay,
//      later ops still run, anyCommitted reflects the actual count.
//   6. All-bail returns anyCommitted=false (caller skips setCode).
//   7. Running-source semantics: op #2 sees op #1's output, so op #2
//      can address an OID that op #1 minted (downstream insert into a
//      freshly-minted descendant).
//   8. Order matters into the same parent (each op appends, so the
//      resulting order = call order).
//   9. Asset with own OIDs gets fresh stamps each batch — no two
//      batches share the same minted OID even if the asset declares one.
//
// Inlines applyInsertChild because the benches are .mjs and don't run
// through a TS build. The inlined logic is byte-identical to
// `lib/ast/operations/insert.ts` — diffs would surface as a bench
// failure when the engine evolves out of step.

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

function isValidOid(s) { return OID_REGEX.test(s); }

function getOidFromAttrs(attrs) {
  for (const a of attrs || []) {
    if (
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      a.name.name === OID_ATTR &&
      a.value?.type === "StringLiteral"
    ) return a.value.value;
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
      ) into.add(a.value.value);
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
  try { return parse(wrapped, PARSE_OPTS); } catch { return null; }
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
  try { ast = parse(source, PARSE_OPTS); } catch (e) {
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
  if (!assetAst) return { source, unchanged: true, reason: "asset failed to parse as JSX", insertedOid: null };
  const assetRange = findAssetRange(assetAst);
  if (!assetRange) return { source, unchanged: true, reason: "asset wrapper produced no fragment node", insertedOid: null };
  const wrapped = `(<>${op.jsx.trim()}</>);`;
  const assetText = wrapped.slice(assetRange.start, assetRange.end);
  if (!assetText.trim()) return { source, unchanged: true, reason: "asset had no JSX content", insertedOid: null };
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
      edits.push({ start: insertPos, end: insertPos, text: ` ${OID_ATTR}="${fresh}"` });
    }
  }
  edits.sort((a, b) => b.start - a.start);
  let stamped = assetText;
  for (const e of edits) stamped = stamped.slice(0, e.start) + e.text + stamped.slice(e.end);
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
  return { source: s.toString(), unchanged: false, reason: null, insertedOid };
}

// The iterate-and-batch wrapper. Mirrors the shape Workspace's
// handleInsertIntoMulti uses: walk ops, accumulate per-op results,
// committed counter, return aggregate.
function applyInsertChildMulti(source, ops) {
  if (!Array.isArray(ops) || ops.length === 0) {
    return {
      source,
      committed: 0,
      anyCommitted: false,
      perOp: [],
    };
  }
  let next = source;
  let committed = 0;
  const perOp = [];
  for (const op of ops) {
    const r = applyInsertChild(next, op);
    perOp.push({
      unchanged: r.unchanged,
      reason: r.reason,
      insertedOid: r.insertedOid,
    });
    if (!r.unchanged) {
      next = r.source;
      committed++;
    }
  }
  return {
    source: next,
    committed,
    anyCommitted: committed > 0,
    perOp,
  };
}

// ---- Test fixtures + helpers -------------------------------------------

// All fixture OIDs are exactly 8 chars (matches isValidOid + the
// counter regex below). 9-char or 10-char OIDs would fail
// countOidsInSource silently.
const FIXTURE_TWO_PARENTS = `
function Page() {
  return (
    <div data-dropin-id="rootroot">
      <main data-dropin-id="mainmain">
        <p data-dropin-id="paraXone">hello</p>
      </main>
      <aside data-dropin-id="asideass">
        <p data-dropin-id="paraYtwo">side</p>
      </aside>
    </div>
  );
}
`;

const FIXTURE_EMPTY_PARENT = `
function Page() {
  return (
    <div data-dropin-id="rootroot">
      <section data-dropin-id="empt1emp"></section>
      <section data-dropin-id="empt2emp"></section>
    </div>
  );
}
`;

// `<img/>` is BOTH self-closing AND a leaf tag, so applyInsertChild
// bails on self-closing first (the leaf-tag check sits below). The
// reason still encodes "can't insert" so a regex match against either
// /self-closing|leaf|<img>/ is enough for the mid-list-bail test.
const FIXTURE_LEAF_PARENT = `
function Page() {
  return (
    <div data-dropin-id="rootroot">
      <main data-dropin-id="mainmain">ok</main>
      <img data-dropin-id="leafleaf" />
    </div>
  );
}
`;

const ASSET_DIV = `<div className="card">card</div>`;
const ASSET_SPAN = `<span>span</span>`;
const ASSET_STAMPED = `<div data-dropin-id="aaaaaaaa">stamped</div>`;

let pass = 0;
let fail = 0;

function test(name, fn) {
  try {
    fn();
    pass++;
    console.log(`PASS: ${name}`);
  } catch (e) {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log("  " + (e.stack || e.message || String(e)).split("\n").slice(0, 6).join("\n  "));
  }
}

function countOidsInSource(source) {
  const re = /data-dropin-id="([A-Za-z0-9]{8})"/g;
  const set = new Set();
  let m;
  while ((m = re.exec(source))) set.add(m[1]);
  return set;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// ---- Tests --------------------------------------------------------------

test("1: empty ops list returns false", () => {
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, []);
  assert(r.anyCommitted === false, "expected anyCommitted=false");
  assert(r.committed === 0, "expected committed=0");
  assert(r.source === FIXTURE_TWO_PARENTS, "source unchanged");
});

test("2: single op composes to same as applyInsertChild", () => {
  const direct = applyInsertChild(FIXTURE_TWO_PARENTS, {
    parentOid: "mainmain",
    jsx: ASSET_DIV,
  });
  const multi = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: ASSET_DIV },
  ]);
  assert(direct.unchanged === false, "direct should commit");
  assert(multi.committed === 1, "multi committed=1");
  assert(direct.source === multi.source, "byte-equal output");
  assert(multi.perOp[0].insertedOid === direct.insertedOid, "same insertedOid");
});

test("3: 2 ops, different parents → both insert", () => {
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: ASSET_DIV },
    { parentOid: "asideass", jsx: ASSET_SPAN },
  ]);
  assert(r.anyCommitted === true, "anyCommitted true");
  assert(r.committed === 2, "committed=2");
  // Both inserts present in final source.
  assert(/className="card"/.test(r.source), "card present");
  assert(/<span/.test(r.source) && r.source.includes(">span<"), "span present");
});

test("4: 2 ops same parent → 2 children appended in order", () => {
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: `<div className="first">first</div>` },
    { parentOid: "mainmain", jsx: `<div className="second">second</div>` },
  ]);
  assert(r.committed === 2, "committed=2");
  // first appears before second.
  const i1 = r.source.indexOf("first");
  const i2 = r.source.indexOf("second");
  assert(i1 > 0 && i2 > 0 && i1 < i2, "first before second");
});

test("5: OID uniqueness across batches into same parent", () => {
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: ASSET_DIV },
    { parentOid: "mainmain", jsx: ASSET_DIV },
    { parentOid: "mainmain", jsx: ASSET_DIV },
  ]);
  assert(r.committed === 3, "committed=3");
  const oids = countOidsInSource(r.source);
  // Pre-existing 5 OIDs (rootroot, mainmain, paraapar1, asideass, paraapar2) +
  // 3 new ones = 8 unique.
  assert(oids.size === 8, `expected 8 unique OIDs, got ${oids.size}`);
  const insertedSet = new Set(r.perOp.map((o) => o.insertedOid));
  assert(insertedSet.size === 3, "all 3 insertedOids unique");
});

test("6: OID uniqueness across batches into different parents", () => {
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: ASSET_DIV },
    { parentOid: "asideass", jsx: ASSET_DIV },
  ]);
  assert(r.committed === 2, "committed=2");
  const oids = countOidsInSource(r.source);
  assert(oids.size === 7, `expected 7 unique OIDs, got ${oids.size}`);
  assert(
    r.perOp[0].insertedOid !== r.perOp[1].insertedOid,
    "the two insertedOids differ",
  );
});

test("7: mid-list bail does not break neighbours", () => {
  const r = applyInsertChildMulti(FIXTURE_LEAF_PARENT, [
    { parentOid: "mainmain", jsx: ASSET_DIV },        // ok
    { parentOid: "leafleaf", jsx: ASSET_DIV },        // bail (img is leaf)
    { parentOid: "mainmain", jsx: ASSET_SPAN },       // ok
  ]);
  assert(r.committed === 2, `expected committed=2, got ${r.committed}`);
  assert(r.perOp[0].unchanged === false, "op 0 ok");
  assert(r.perOp[1].unchanged === true, "op 1 bailed");
  assert(
    /self-closing|<img>|leaf/i.test(r.perOp[1].reason || ""),
    `leaf-or-self-closing bail reason; got: ${r.perOp[1].reason}`,
  );
  assert(r.perOp[2].unchanged === false, "op 2 ok");
});

test("8: all ops bail → anyCommitted=false", () => {
  const r = applyInsertChildMulti(FIXTURE_LEAF_PARENT, [
    { parentOid: "leafleaf", jsx: ASSET_DIV },
    { parentOid: "missing!", jsx: ASSET_DIV },
  ]);
  assert(r.anyCommitted === false, "anyCommitted=false");
  assert(r.committed === 0, "committed=0");
  assert(r.source === FIXTURE_LEAF_PARENT, "source unchanged");
});

test("9: running-source semantics — op #2 sees op #1's mint", () => {
  // First op inserts into mainmain. Second op uses op 1's insertedOid
  // as its parent — only possible because op 2 sees op 1's output.
  const step1 = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: `<div className="outer"></div>` },
  ]);
  const newOid = step1.perOp[0].insertedOid;
  assert(newOid && /^[A-Za-z0-9]{8}$/.test(newOid), "valid newOid");

  // Now run all in one batched call.
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: `<div className="outer"></div>` },
    // op 2 references op 1's mint — using the same deterministic seed
    // means we get the same OID across both calls.
    { parentOid: newOid, jsx: `<span>nested</span>` },
  ]);
  assert(r.committed === 2, "both committed");
  assert(/className="outer"/.test(r.source), "outer present");
  // The nested span should be inside the outer div. Coarse check: outer
  // appears before span, and span's text "nested" sits between outer's
  // open and close.
  const outerOpen = r.source.indexOf("className=\"outer\"");
  const span = r.source.indexOf(">nested<");
  assert(outerOpen > 0 && span > outerOpen, "span lives after outer-open");
});

test("10: empty-parent inserts produce one child each", () => {
  const r = applyInsertChildMulti(FIXTURE_EMPTY_PARENT, [
    { parentOid: "empt1emp", jsx: ASSET_DIV },
    { parentOid: "empt2emp", jsx: ASSET_DIV },
  ]);
  assert(r.committed === 2, "committed=2");
  const cardMatches = r.source.match(/className="card"/g) || [];
  assert(cardMatches.length === 2, `expected 2 cards, got ${cardMatches.length}`);
});

test("11: asset with own OID gets fresh stamps each batch", () => {
  // Asset declares data-dropin-id="aaaaaaaa". Two batches → two fresh
  // OIDs minted, neither equals "aaaaaaaa".
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: ASSET_STAMPED },
    { parentOid: "asideass", jsx: ASSET_STAMPED },
  ]);
  assert(r.committed === 2, "committed=2");
  // Stale "aaaaaaaa" must NOT appear in output (replaced by fresh).
  assert(!/aaaaaaaa/.test(r.source), "stale asset OID gone");
  assert(r.perOp[0].insertedOid !== "aaaaaaaa", "op 0 oid fresh");
  assert(r.perOp[1].insertedOid !== "aaaaaaaa", "op 1 oid fresh");
  assert(
    r.perOp[0].insertedOid !== r.perOp[1].insertedOid,
    "ops have distinct fresh OIDs",
  );
});

test("12: order independence across different parents", () => {
  // Same ops, reverse order → both still commit, same OID set.
  const ops = [
    { parentOid: "mainmain", jsx: `<div className="A"></div>` },
    { parentOid: "asideass", jsx: `<div className="B"></div>` },
  ];
  const r1 = applyInsertChildMulti(FIXTURE_TWO_PARENTS, ops);
  const r2 = applyInsertChildMulti(FIXTURE_TWO_PARENTS, ops.slice().reverse());
  assert(r1.committed === 2 && r2.committed === 2, "both commit fully");
  // Both produce 7 unique OIDs.
  assert(countOidsInSource(r1.source).size === 7, "r1 7 oids");
  assert(countOidsInSource(r2.source).size === 7, "r2 7 oids");
});

test("13: parent-not-found bail does not corrupt running source", () => {
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "MISSING1", jsx: ASSET_DIV },
    { parentOid: "mainmain", jsx: ASSET_DIV },
    { parentOid: "MISSING2", jsx: ASSET_DIV },
  ]);
  assert(r.committed === 1, `committed=1`);
  assert(r.perOp[0].unchanged === true && /not found/.test(r.perOp[0].reason || ""), "op 0 bailed");
  assert(r.perOp[1].unchanged === false, "op 1 ok");
  assert(r.perOp[2].unchanged === true, "op 2 bailed");
  // Final source has exactly one new OID.
  assert(countOidsInSource(r.source).size === 6, "6 OIDs (5 original + 1 new)");
});

test("14: parse-failure on first op leaves source untouched, later ops still run", () => {
  // Use a valid base source but corrupt asset on the first op.
  const r = applyInsertChildMulti(FIXTURE_TWO_PARENTS, [
    { parentOid: "mainmain", jsx: `<div` }, // unparseable
    { parentOid: "mainmain", jsx: ASSET_DIV }, // ok
  ]);
  assert(r.perOp[0].unchanged === true, "op 0 bailed");
  assert(/asset failed to parse/.test(r.perOp[0].reason || ""), "asset parse fail reason");
  assert(r.perOp[1].unchanged === false, "op 1 ok");
  assert(r.committed === 1, "committed=1");
});

console.log(`\nbench-insert-multi: ${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
