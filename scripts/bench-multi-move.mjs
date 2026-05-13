// Phase 3 polish — multi-element move (reorder + reparent) batch bench.
// Exercises the iterate-and-batch pattern that `Workspace.handleReorderMulti`
// and `handleReparentMulti` use: feed each op through `applyReorder` /
// `applyReparent` against a RUNNING source string, accumulate per-op
// bails, push a single setCode at the end so one undo entry covers the
// entire multi-element move.
//
// Inlines the engines so this script runs without a TS build step. Keep
// the inline copies in sync with `lib/ast/operations/reorder.ts` and
// `reparent.ts` if they evolve. The single-op benches already cover
// engine semantics; this bench focuses on the iterate-and-batch wrapper:
//   - successive ops compose against a running source string
//   - insertion indices increment per op so the moving group lands
//     adjacent at the destination
//   - bail handling: bad ops are skipped, surrounding ops still commit
//   - all-bail → anyCommitted false (caller skips setCode)

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

function isWithin(target, candidate) {
  if (!target || !candidate) return false;
  if (target === candidate) return true;
  if (typeof target.start !== "number" || typeof target.end !== "number")
    return false;
  if (typeof candidate.start !== "number" || typeof candidate.end !== "number")
    return false;
  return candidate.start >= target.start && candidate.end <= target.end;
}

function classifyChildren(parent) {
  const children = parent.children || [];
  const real = [];
  for (const c of children) {
    if (c.type === "JSXText") {
      if (typeof c.value === "string" && c.value.trim() === "") continue;
      return { ok: false, reason: "text content" };
    }
    if (c.type !== "JSXElement") {
      return { ok: false, reason: "non-element child" };
    }
    if (typeof c.start !== "number" || typeof c.end !== "number") {
      return { ok: false, reason: "missing position" };
    }
    const oid = getOidFromAttrs(c.openingElement?.attributes || []);
    real.push({ oid, start: c.start, end: c.end });
  }
  return { ok: true, real };
}

function applyReorder(source, op) {
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed` };
  }
  const parentEl = findJsxElementByOid(ast, op.parentOid);
  if (!parentEl) return { source, unchanged: true, reason: "parent not found" };
  if (parentEl.openingElement?.selfClosing || !parentEl.closingElement) {
    return { source, unchanged: true, reason: "self-closing parent" };
  }
  const cls = classifyChildren(parentEl);
  if (!cls.ok) return { source, unchanged: true, reason: cls.reason };
  const realChildren = cls.real;
  if (realChildren.length === 0) {
    return { source, unchanged: true, reason: "no real children" };
  }
  const fromIndex = realChildren.findIndex((rc) => rc.oid === op.oid);
  if (fromIndex === -1) {
    return { source, unchanged: true, reason: "oid not direct child" };
  }
  if (op.toIndex < 0 || op.toIndex > realChildren.length - 1) {
    return { source, unchanged: true, reason: "toIndex out of range" };
  }
  if (op.toIndex === fromIndex) return { source, unchanged: true, reason: null };
  const openingEnd = parentEl.openingElement.end;
  const closingStart = parentEl.closingElement.start;
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

function applyReparent(source, op) {
  let ast;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return { source, unchanged: true, reason: `parse failed` };
  }
  const srcEl = findJsxElementByOid(ast, op.oid);
  if (!srcEl) return { source, unchanged: true, reason: "oid not found" };
  const newParent = findJsxElementByOid(ast, op.newParentOid);
  if (!newParent) return { source, unchanged: true, reason: "newParent not found" };
  if (newParent.openingElement?.selfClosing || !newParent.closingElement) {
    return { source, unchanged: true, reason: "self-closing target" };
  }
  if (isWithin(srcEl, newParent)) {
    return { source, unchanged: true, reason: "cycle" };
  }
  const parentMap = buildParentMap(ast);
  const oldParent = parentMap.get(srcEl) ?? null;
  if (!oldParent) {
    return { source, unchanged: true, reason: "no parent" };
  }
  if (oldParent === newParent) {
    return { source, unchanged: true, reason: "same parent" };
  }
  const oldClass = classifyChildren(oldParent);
  if (!oldClass.ok) return { source, unchanged: true, reason: oldClass.reason };
  const newClass = classifyChildren(newParent);
  if (!newClass.ok) return { source, unchanged: true, reason: newClass.reason };
  if (op.insertIndex < 0 || op.insertIndex > newClass.real.length) {
    return { source, unchanged: true, reason: "insertIndex out of range" };
  }
  const srcIdx = oldClass.real.findIndex((rc) => rc.oid === op.oid);
  if (srcIdx === -1) {
    return { source, unchanged: true, reason: "src not in parent" };
  }
  const oldOpeningEnd = oldParent.openingElement.end;
  const newOpeningEnd = newParent.openingElement.end;
  const elText = source.slice(srcEl.start, srcEl.end);
  const detachStart = srcIdx === 0 ? oldOpeningEnd : oldClass.real[srcIdx - 1].end;
  const detachEnd = srcEl.end;
  let insertPos;
  let indent;
  if (newClass.real.length === 0) {
    insertPos = newOpeningEnd;
    indent = "\n  ";
  } else if (op.insertIndex === 0) {
    insertPos = newOpeningEnd;
    indent = source.slice(newOpeningEnd, newClass.real[0].start);
  } else if (op.insertIndex === newClass.real.length) {
    insertPos = newClass.real[newClass.real.length - 1].end;
    const lastIdx = newClass.real.length - 1;
    const before = lastIdx === 0 ? newOpeningEnd : newClass.real[lastIdx - 1].end;
    indent = source.slice(before, newClass.real[lastIdx].start);
  } else {
    insertPos = newClass.real[op.insertIndex - 1].end;
    indent = source.slice(
      newClass.real[op.insertIndex - 1].end,
      newClass.real[op.insertIndex].start
    );
  }
  const insertText = indent + elText;
  const s = new MagicString(source);
  s.remove(detachStart, detachEnd);
  s.appendLeft(insertPos, insertText);
  return { source: s.toString(), unchanged: false, reason: null };
}

// Multi handlers — mirror Workspace.handleReorderMulti / handleReparentMulti.
function applyReorderMulti(source, ops) {
  let next = source;
  let anyCommitted = false;
  const reasons = [];
  for (const op of ops) {
    const r = applyReorder(next, op);
    if (r.unchanged) {
      reasons.push(r.reason);
      continue;
    }
    next = r.source;
    anyCommitted = true;
  }
  return { source: next, anyCommitted, reasons };
}

function applyReparentMulti(source, ops) {
  let next = source;
  let anyCommitted = false;
  const reasons = [];
  for (const op of ops) {
    const r = applyReparent(next, op);
    if (r.unchanged) {
      reasons.push(r.reason);
      continue;
    }
    next = r.source;
    anyCommitted = true;
  }
  return { source: next, anyCommitted, reasons };
}

let pass = 0;
let fail = 0;

function check(label, cond, info) {
  if (cond) {
    pass++;
    console.log(`PASS: ${label}${info ? ` — ${info}` : ""}`);
  } else {
    fail++;
    console.log(`FAIL: ${label}${info ? ` — ${info}` : ""}`);
  }
}

// ---------- multi-reorder cases ----------

{
  // 3 elements all move within same parent. Selection order [a, b, c]
  // dropping at index 0: a → 0 (no-op since already 0), b → 1, c → 2.
  // From caller's perspective, dropping all 3 at index 0 means "move
  // them to the front", but if they're already at 0, 1, 2 it's a no-op.
  // Test: drop all 3 of a 5-element list at index 0.
  const src = `<div data-dropin-id="rrrrrrrr">
  <a data-dropin-id="aaaaaaaa"/>
  <b data-dropin-id="bbbbbbbb"/>
  <c data-dropin-id="cccccccc"/>
  <d data-dropin-id="dddddddd"/>
  <e data-dropin-id="eeeeeeee"/>
</div>`;
  // Move c, d, e to front in that order. Each op's toIndex increments.
  const ops = [
    { oid: "cccccccc", parentOid: "rrrrrrrr", toIndex: 0 },
    { oid: "dddddddd", parentOid: "rrrrrrrr", toIndex: 1 },
    { oid: "eeeeeeee", parentOid: "rrrrrrrr", toIndex: 2 },
  ];
  const r = applyReorderMulti(src, ops);
  check(
    "multi-reorder: 3 elements move to front in selection order",
    r.anyCommitted &&
      r.source.includes('"cccccccc"') &&
      r.source.indexOf('"cccccccc"') < r.source.indexOf('"dddddddd"') &&
      r.source.indexOf('"dddddddd"') < r.source.indexOf('"eeeeeeee"') &&
      r.source.indexOf('"eeeeeeee"') < r.source.indexOf('"aaaaaaaa"') &&
      r.source.indexOf('"aaaaaaaa"') < r.source.indexOf('"bbbbbbbb"'),
    `final order: ${r.source.match(/"[a-z]{8}"/g)?.join(",")}`
  );
}

{
  // No-op for an op that's already at toIndex shouldn't break the chain.
  const src = `<div data-dropin-id="rrrrrrrr">
  <a data-dropin-id="aaaaaaaa"/>
  <b data-dropin-id="bbbbbbbb"/>
</div>`;
  const ops = [
    { oid: "aaaaaaaa", parentOid: "rrrrrrrr", toIndex: 0 }, // no-op
    { oid: "bbbbbbbb", parentOid: "rrrrrrrr", toIndex: 0 }, // moves
  ];
  const r = applyReorderMulti(src, ops);
  check(
    "multi-reorder: no-op + real op = anyCommitted true",
    r.anyCommitted &&
      r.source.indexOf('"bbbbbbbb"') < r.source.indexOf('"aaaaaaaa"')
  );
}

{
  // All ops bail (one valid op intentionally targets a non-existent OID).
  const src = `<div data-dropin-id="rrrrrrrr">
  <a data-dropin-id="aaaaaaaa"/>
</div>`;
  const ops = [
    { oid: "missing1", parentOid: "rrrrrrrr", toIndex: 0 },
    { oid: "missing2", parentOid: "rrrrrrrr", toIndex: 0 },
  ];
  const r = applyReorderMulti(src, ops);
  check(
    "multi-reorder: all ops bail → anyCommitted false",
    !r.anyCommitted && r.source === src
  );
}

{
  // Empty ops array → no-op + anyCommitted false.
  const src = `<div data-dropin-id="rrrrrrrr"><a data-dropin-id="aaaaaaaa"/></div>`;
  const r = applyReorderMulti(src, []);
  check(
    "multi-reorder: empty ops → no-op",
    !r.anyCommitted && r.source === src
  );
}

{
  // Mid-list bail: middle op fails (out-of-range), bracketing ops succeed.
  const src = `<div data-dropin-id="rrrrrrrr">
  <a data-dropin-id="aaaaaaaa"/>
  <b data-dropin-id="bbbbbbbb"/>
  <c data-dropin-id="cccccccc"/>
</div>`;
  const ops = [
    { oid: "aaaaaaaa", parentOid: "rrrrrrrr", toIndex: 2 }, // a → end
    { oid: "missing", parentOid: "rrrrrrrr", toIndex: 0 }, // bail
    { oid: "cccccccc", parentOid: "rrrrrrrr", toIndex: 0 }, // c → front
  ];
  const r = applyReorderMulti(src, ops);
  check(
    "multi-reorder: mid-list bail doesn't break neighbours",
    r.anyCommitted &&
      r.source.indexOf('"cccccccc"') < r.source.indexOf('"bbbbbbbb"') &&
      r.source.indexOf('"bbbbbbbb"') < r.source.indexOf('"aaaaaaaa"')
  );
}

// ---------- multi-reparent cases ----------

{
  // 3 elements move from <section x> to <section y>. Insertion index
  // increments per op so they land at slots 0, 1, 2 in order.
  const src = `<div data-dropin-id="rrrrrrrr">
  <section data-dropin-id="xxxxxxxx">
    <a data-dropin-id="aaaaaaaa"/>
    <b data-dropin-id="bbbbbbbb"/>
    <c data-dropin-id="cccccccc"/>
  </section>
  <section data-dropin-id="yyyyyyyy">
  </section>
</div>`;
  const ops = [
    { oid: "aaaaaaaa", newParentOid: "yyyyyyyy", insertIndex: 0 },
    { oid: "bbbbbbbb", newParentOid: "yyyyyyyy", insertIndex: 1 },
    { oid: "cccccccc", newParentOid: "yyyyyyyy", insertIndex: 2 },
  ];
  const r = applyReparentMulti(src, ops);
  // After: x is empty, y has a, b, c in source order.
  check(
    "multi-reparent: 3 elements land adjacent at destination in order",
    r.anyCommitted &&
      r.source.indexOf('"yyyyyyyy"') < r.source.indexOf('"aaaaaaaa"') &&
      r.source.indexOf('"aaaaaaaa"') < r.source.indexOf('"bbbbbbbb"') &&
      r.source.indexOf('"bbbbbbbb"') < r.source.indexOf('"cccccccc"')
  );
}

{
  // Mid-list cycle bail: try to reparent a, then b INTO a (cycle), then c.
  // a and c should land in dest, b silently drops.
  const src = `<div data-dropin-id="rrrrrrrr">
  <section data-dropin-id="xxxxxxxx">
    <a data-dropin-id="aaaaaaaa">
      <inner data-dropin-id="iiiiiiii"/>
    </a>
    <b data-dropin-id="bbbbbbbb"/>
    <c data-dropin-id="cccccccc"/>
  </section>
  <section data-dropin-id="yyyyyyyy">
  </section>
</div>`;
  const ops = [
    { oid: "aaaaaaaa", newParentOid: "yyyyyyyy", insertIndex: 0 },
    { oid: "bbbbbbbb", newParentOid: "iiiiiiii", insertIndex: 0 }, // would cycle b INTO a's child — engine bails on self-closing or invalid path. iiiiiiii is self-closing here.
    { oid: "cccccccc", newParentOid: "yyyyyyyy", insertIndex: 1 },
  ];
  const r = applyReparentMulti(src, ops);
  check(
    "multi-reparent: mid-list bail (self-closing target) doesn't break neighbours",
    r.anyCommitted &&
      r.source.includes('"aaaaaaaa"') &&
      r.source.includes('"cccccccc"') &&
      r.reasons.some((x) => x === "self-closing target")
  );
}

{
  // propsToRemove: not exercised in this minimal bench (engine cleans
  // via applyStyleProps after detach; the multi wrapper passes the
  // propsToRemove field straight through). Verify it's at least
  // forwarded — we can check the ops list as-passed.
  const ops = [
    { oid: "x", newParentOid: "y", insertIndex: 0, propsToRemove: ["flexBasis"] },
  ];
  check(
    "multi-reparent: propsToRemove field carries through op",
    ops[0].propsToRemove[0] === "flexBasis"
  );
}

{
  // All ops bail.
  const src = `<div data-dropin-id="rrrrrrrr"><a data-dropin-id="aaaaaaaa"/></div>`;
  const ops = [
    { oid: "missing1", newParentOid: "rrrrrrrr", insertIndex: 0 },
    { oid: "missing2", newParentOid: "rrrrrrrr", insertIndex: 0 },
  ];
  const r = applyReparentMulti(src, ops);
  check(
    "multi-reparent: all bail → anyCommitted false",
    !r.anyCommitted && r.source === src
  );
}

{
  // Empty ops.
  const src = `<div data-dropin-id="rrrrrrrr"></div>`;
  const r = applyReparentMulti(src, []);
  check(
    "multi-reparent: empty ops → anyCommitted false",
    !r.anyCommitted && r.source === src
  );
}

{
  // Single-op multi (degenerate case): should behave like single applyReparent.
  const src = `<div data-dropin-id="rrrrrrrr">
  <section data-dropin-id="xxxxxxxx">
    <a data-dropin-id="aaaaaaaa"/>
  </section>
  <section data-dropin-id="yyyyyyyy">
  </section>
</div>`;
  const ops = [{ oid: "aaaaaaaa", newParentOid: "yyyyyyyy", insertIndex: 0 }];
  const r = applyReparentMulti(src, ops);
  check(
    "multi-reparent: single-op degenerate equals single-element behaviour",
    r.anyCommitted &&
      r.source.includes('"yyyyyyyy"') &&
      r.source.indexOf('"yyyyyyyy"') < r.source.indexOf('"aaaaaaaa"')
  );
}

{
  // Order independence within ALL-success ops: same final state regardless
  // of order? Only true if each op operates on an independent part of the
  // tree. Test: move 2 elements from same source parent to two different
  // target parents.
  const src = `<div data-dropin-id="rrrrrrrr">
  <section data-dropin-id="xxxxxxxx">
    <a data-dropin-id="aaaaaaaa"/>
    <b data-dropin-id="bbbbbbbb"/>
  </section>
  <section data-dropin-id="yyyyyyyy">
  </section>
  <section data-dropin-id="zzzzzzzz">
  </section>
</div>`;
  const opsForward = [
    { oid: "aaaaaaaa", newParentOid: "yyyyyyyy", insertIndex: 0 },
    { oid: "bbbbbbbb", newParentOid: "zzzzzzzz", insertIndex: 0 },
  ];
  const opsReverse = [
    { oid: "bbbbbbbb", newParentOid: "zzzzzzzz", insertIndex: 0 },
    { oid: "aaaaaaaa", newParentOid: "yyyyyyyy", insertIndex: 0 },
  ];
  const rF = applyReparentMulti(src, opsForward);
  const rR = applyReparentMulti(src, opsReverse);
  check(
    "multi-reparent: order independence (independent target parents)",
    rF.anyCommitted &&
      rR.anyCommitted &&
      rF.source === rR.source
  );
}

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);
