// Ad-hoc smoke test for the iterate-and-batch composition used by
// `Workspace.handleDuplicateMulti` / `handleDeleteMulti`. Inlines
// applyDuplicate + applyDelete so we can verify:
//   - Single setCode after N ops (caller's job, but we exercise the
//     composition: each op runs against a running source string).
//   - OID uniqueness preserved across multi-duplicate (each duplicate
//     mints fresh OIDs against the running source's `seen` set, so
//     OIDs from earlier-in-the-batch duplicates are visible to later
//     ops and avoided).
//   - All-bail short-circuits to anyCommitted=false (caller skips
//     setCode).
//   - Empty ops list returns false.
//   - Mid-list bail doesn't break neighbours.
//   - Order independence for delete-multi (deletes commute since OIDs
//     are stable across the unaffected siblings).

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
  if (!srcEl)
    return {
      source,
      unchanged: true,
      reason: `oid "${op.oid}" not found`,
      newRootOid: null,
    };
  const parentMap = buildParentMap(ast);
  const parent = parentMap.get(srcEl) ?? null;
  if (!parent)
    return {
      source,
      unchanged: true,
      reason: "element has no JSX parent (top-level) — cannot duplicate",
      newRootOid: null,
    };
  const parentOpeningEnd = parent.openingElement?.end;
  if (typeof parentOpeningEnd !== "number")
    return {
      source,
      unchanged: true,
      reason: "parent missing opening position info",
      newRootOid: null,
    };
  let leadingWsStart = parentOpeningEnd;
  const children = parent.children || [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c === srcEl) break;
    if (c.type === "JSXText") {
      const v = typeof c.value === "string" ? c.value : "";
      if (v.trim() === "") continue;
    }
    if (typeof c.end === "number") leadingWsStart = c.end;
  }
  const indent = source.slice(leadingWsStart, srcEl.start);
  const elText = source.slice(srcEl.start, srcEl.end);

  const seen = new Set();
  collectAllOids(ast, seen);

  let counter = 0;
  let newRootOid = null;
  const rewritten = elText.replace(OID_ATTR_RE, (_m, prefix, _oldOid, suffix) => {
    const fresh = mintFresh(srcEl.end + counter * 7919, seen);
    seen.add(fresh);
    if (counter === 0) newRootOid = fresh;
    counter++;
    return prefix + fresh + suffix;
  });
  const insertText = indent + rewritten;
  const s = new MagicString(source);
  s.appendLeft(srcEl.end, insertText);
  return { source: s.toString(), unchanged: false, reason: null, newRootOid };
}

function applyDelete(source, op) {
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed: ${String(e)}` };
  }
  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl)
    return { source, unchanged: true, reason: `oid "${op.oid}" not found` };
  const parentMap = buildParentMap(ast);
  const parent = parentMap.get(srcEl) ?? null;
  if (!parent)
    return {
      source,
      unchanged: true,
      reason: "element has no JSX parent (top-level) — cannot delete",
    };
  const idx = (parent.children || []).indexOf(srcEl);
  if (idx === -1)
    return {
      source,
      unchanged: true,
      reason:
        "element is inside a non-JSXElement wrapper (e.g. {cond && <X/>}) — delete the wrapper instead",
    };
  const parentOpeningEnd = parent.openingElement?.end;
  if (typeof parentOpeningEnd !== "number")
    return {
      source,
      unchanged: true,
      reason: "parent missing opening position info",
    };
  let leadingWsStart = parentOpeningEnd;
  const children = parent.children || [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c === srcEl) break;
    if (c.type === "JSXText") {
      const v = typeof c.value === "string" ? c.value : "";
      if (v.trim() === "") continue;
    }
    if (typeof c.end === "number") leadingWsStart = c.end;
  }
  const s = new MagicString(source);
  s.remove(leadingWsStart, srcEl.end);
  return { source: s.toString(), unchanged: false, reason: null };
}

// ---------- the multi handlers (Workspace's iterate-and-batch shape) ----------

function handleDuplicateMulti(source, oids) {
  if (oids.length === 0) return { changed: false, source, committed: 0 };
  let next = source;
  let committed = 0;
  for (const oid of oids) {
    const r = applyDuplicate(next, { oid });
    if (r.unchanged) continue;
    next = r.source;
    committed++;
  }
  return { changed: committed > 0, source: next, committed };
}

function handleDeleteMulti(source, oids) {
  if (oids.length === 0) return { changed: false, source, committed: 0 };
  let next = source;
  let committed = 0;
  for (const oid of oids) {
    const r = applyDelete(next, { oid });
    if (r.unchanged) continue;
    next = r.source;
    committed++;
  }
  return { changed: committed > 0, source: next, committed };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, fn) {
  try {
    const ok = fn();
    if (ok) {
      pass++;
      console.log(`PASS: ${name}`);
    } else {
      fail++;
      console.log(`FAIL: ${name}`);
    }
  } catch (e) {
    fail++;
    console.log(`FAIL: ${name} — ${e.message}`);
  }
}

const P = "pppppppp";
const A = "aaaaaaaa";
const B = "bbbbbbbb";
const C = "cccccccc";
const D = "dddddddd";

const SRC_3 = `<div data-dropin-id="${P}">
  <a data-dropin-id="${A}"/>
  <b data-dropin-id="${B}"/>
  <c data-dropin-id="${C}"/>
</div>`;

// 1. Multi-duplicate of 3 elements: each gets its own fresh OIDs
test("multi-duplicate 3 → 6 elements + all OIDs unique", () => {
  const r = handleDuplicateMulti(SRC_3, [A, B, C]);
  if (!r.changed || r.committed !== 3) return false;
  const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
  const counts = new Map();
  for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
  for (const [, c] of counts) if (c !== 1) return false;
  // P + (A,B,C originals) + 3 freshly minted = 7
  return counts.size === 7;
});

// 2. Multi-duplicate where one oid bails — others still commit
test("multi-duplicate with one bad oid → 2 of 3 commit", () => {
  const r = handleDuplicateMulti(SRC_3, [A, "missing0", C]);
  if (!r.changed || r.committed !== 2) return false;
  const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
  const counts = new Map();
  for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
  // 4 originals + 2 fresh = 6
  return counts.size === 6;
});

// 3. Multi-duplicate with all bails → no change
test("multi-duplicate all-bail → unchanged", () => {
  const r = handleDuplicateMulti(SRC_3, ["zzz00000", "yyy00000"]);
  return !r.changed && r.committed === 0 && r.source === SRC_3;
});

// 4. Multi-duplicate empty list
test("multi-duplicate empty → unchanged", () => {
  const r = handleDuplicateMulti(SRC_3, []);
  return !r.changed && r.committed === 0 && r.source === SRC_3;
});

// 5. Multi-delete 3 elements → empty parent
test("multi-delete all children → empty parent body", () => {
  const r = handleDeleteMulti(SRC_3, [A, B, C]);
  if (!r.changed || r.committed !== 3) return false;
  return r.source === `<div data-dropin-id="${P}">
</div>`;
});

// 6. Multi-delete 2 of 3 — middle stays
test("multi-delete first + last → middle remains", () => {
  const r = handleDeleteMulti(SRC_3, [A, C]);
  if (!r.changed || r.committed !== 2) return false;
  return r.source === `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
</div>`;
});

// 7. Multi-delete with mid-list bail
test("multi-delete with one bad oid → others still commit", () => {
  const r = handleDeleteMulti(SRC_3, [A, "missing0", C]);
  if (!r.changed || r.committed !== 2) return false;
  return r.source === `<div data-dropin-id="${P}">
  <b data-dropin-id="${B}"/>
</div>`;
});

// 8. Multi-delete order independence (A then C vs C then A)
test("multi-delete order independence", () => {
  const r1 = handleDeleteMulti(SRC_3, [A, C]);
  const r2 = handleDeleteMulti(SRC_3, [C, A]);
  return r1.source === r2.source;
});

// 9. Multi-delete empty list
test("multi-delete empty → unchanged", () => {
  const r = handleDeleteMulti(SRC_3, []);
  return !r.changed && r.committed === 0;
});

// 10. Multi-delete all-bail
test("multi-delete all-bail → unchanged", () => {
  const r = handleDeleteMulti(SRC_3, ["zzzzzzzz"]);
  return !r.changed && r.committed === 0 && r.source === SRC_3;
});

// 11. Sequential duplicate → delete batch yields original
test("multi-duplicate then multi-delete the duplicates returns to base", () => {
  const r1 = handleDuplicateMulti(SRC_3, [A]);
  if (!r1.changed) return false;
  // Find the new OID in r1.source by diffing OID sets
  const before = new Set([...SRC_3.matchAll(OID_ATTR_RE)].map((m) => m[2]));
  const after = [...r1.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
  const newOid = after.find((o) => !before.has(o));
  if (!newOid) return false;
  const r2 = handleDeleteMulti(r1.source, [newOid]);
  return r2.source === SRC_3;
});

// 12. Multi-duplicate of nested elements: fresh OIDs across subtrees
test("multi-duplicate nested subtrees → all unique OIDs", () => {
  const SRC = `<main data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <h1 data-dropin-id="${B}">Hi</h1>
  </section>
  <section data-dropin-id="${C}">
    <h1 data-dropin-id="${D}">There</h1>
  </section>
</main>`;
  const r = handleDuplicateMulti(SRC, [A, C]);
  if (!r.changed || r.committed !== 2) return false;
  const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
  const counts = new Map();
  for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
  for (const [, c] of counts) if (c !== 1) return false;
  // P + (A,B,C,D originals) + 4 fresh (2 sections + 2 h1s) = 9
  return counts.size === 9;
});

// 13. Delete order with running source: deleting A then B from SRC_3
//     should produce same result as deleting [A, B] together.
test("running-source semantics: A then B == [A, B]", () => {
  const r1 = applyDelete(SRC_3, { oid: A });
  if (r1.unchanged) return false;
  const r2 = applyDelete(r1.source, { oid: B });
  if (r2.unchanged) return false;
  const rMulti = handleDeleteMulti(SRC_3, [A, B]);
  return r2.source === rMulti.source;
});

// 14. Duplicate twice composes — second duplicate sees first's OID in seen
test("duplicate-multi composes: 2nd duplicate sees 1st's OID", () => {
  const r = handleDuplicateMulti(SRC_3, [A, A]);
  if (!r.changed || r.committed !== 2) return false;
  const oids = [...r.source.matchAll(OID_ATTR_RE)].map((m) => m[2]);
  const counts = new Map();
  for (const o of oids) counts.set(o, (counts.get(o) ?? 0) + 1);
  for (const [, c] of counts) if (c !== 1) return false;
  return counts.size === 6; // P + A + B + C + 2 fresh
});

// 15. Multi-duplicate single oid → degenerates to applyDuplicate
test("multi-duplicate single oid == applyDuplicate", () => {
  const single = applyDuplicate(SRC_3, { oid: B });
  const multi = handleDuplicateMulti(SRC_3, [B]);
  if (!multi.changed || multi.committed !== 1) return false;
  // Source bytes should match (same seed → same fresh OID)
  return multi.source === single.source;
});

// 16. Multi-delete single oid → degenerates to applyDelete
test("multi-delete single oid == applyDelete", () => {
  const single = applyDelete(SRC_3, { oid: B });
  const multi = handleDeleteMulti(SRC_3, [B]);
  return multi.source === single.source;
});

// 17. Delete-multi where first delete removes the parent of the
//     remaining oid → second op bails, anyCommitted still true.
test("multi-delete: remove parent first, child op bails", () => {
  const SRC = `<div data-dropin-id="${P}">
  <section data-dropin-id="${A}">
    <h1 data-dropin-id="${B}"/>
  </section>
</div>`;
  const r = handleDeleteMulti(SRC, [A, B]);
  if (!r.changed || r.committed !== 1) return false;
  // After deleting A, B is gone too (was inside A). Result is parent
  // with no children.
  return r.source === `<div data-dropin-id="${P}">
</div>`;
});

// 18. Duplicate-multi where ops touch the same parent
test("multi-duplicate same-parent siblings yields well-formed source", () => {
  const r = handleDuplicateMulti(SRC_3, [A, C]);
  if (!r.changed || r.committed !== 2) return false;
  // Re-parse should succeed
  try {
    parse(r.source, PARSE_OPTS);
    return true;
  } catch {
    return false;
  }
});

console.log(`\n${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
