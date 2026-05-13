// Phase 6 ramp — bench for `resolveTreeDropMulti` (lib/ast/tree-dnd.ts).
//
// Multi-target tree DnD: maps a (tree, dragOids[], target, position)
// onto a coordinated REPARENT batch when every dragged oid lands at the
// same target parent from a DIFFERENT source parent. v1 falls back to
// single-drag when ANY op is same-parent reorder (the per-op detach +
// insert math doesn't generalize cleanly for mixed-parent batches).
//
// Bench inlines a clone of resolveTreeDropMulti so it runs without a
// build step. Same convention as bench-tree-dnd.mjs. (An earlier copy of
// resolveTreeDrop also lived here for reference but was unused by both
// the tests below and the multi classifier — the production lib +
// tests/tree-dnd-prod.test.ts cover the single-drag function directly.)

function makeNode(oid, children = []) {
  return { tag: "div", oid, classes: [], children, loc: null };
}

function findNodeByOid(arr, oid, parent) {
  for (let i = 0; i < arr.length; i++) {
    const n = arr[i];
    if (n.oid === oid) return { node: n, parent, index: i };
    if (n.children.length > 0) {
      const r = findNodeByOid(n.children, oid, n);
      if (r) return r;
    }
  }
  return null;
}

function isSelfOrDescendant(candidate, ofNode) {
  if (candidate === ofNode) return true;
  for (const c of ofNode.children) {
    if (isSelfOrDescendant(candidate, c)) return true;
  }
  return false;
}

function computeDfsIndex(tree) {
  const map = new Map();
  let i = 0;
  function walk(arr) {
    for (const n of arr) {
      if (n.oid) map.set(n.oid, i++);
      if (n.children.length > 0) walk(n.children);
    }
  }
  walk(tree);
  return map;
}

function resolveTreeDropMulti(tree, dragOids, targetOid, position) {
  if (dragOids.length === 0) return { kind: "noop", reason: "no drag oids" };
  const seen = new Set();
  const unique = [];
  for (const o of dragOids) {
    if (!o || seen.has(o)) continue;
    seen.add(o);
    unique.push(o);
  }
  if (unique.length === 0) return { kind: "noop", reason: "no valid drag oids" };
  if (unique.length === 1) {
    return { kind: "fall-back", reason: "single drag oid — caller should use resolveTreeDrop" };
  }
  // Twenty-seventh-pass refactor: bypass per-op resolveTreeDrop and
  // classify directly so dragged oids that happen to be adjacent to
  // target ("no index change" pseudo-noop) still participate in the
  // batch.
  const tgtLoc = findNodeByOid(tree, targetOid, null);
  if (!tgtLoc) return { kind: "noop", reason: `target oid "${targetOid}" not in tree` };
  let dropParent;
  let anchorIdx;
  if (position === "inside") {
    dropParent = tgtLoc.node;
    anchorIdx = -1;
  } else {
    if (!tgtLoc.parent) return { kind: "noop", reason: "target is top-level — drop before/after needs a parent" };
    dropParent = tgtLoc.parent;
    anchorIdx = tgtLoc.index;
  }
  const dropParentOid = dropParent.oid;
  if (!dropParentOid) return { kind: "noop", reason: "drop parent has no oid — can't address" };

  const sameParent = [];
  const crossParent = [];
  for (const oid of unique) {
    if (oid === targetOid) {
      return { kind: "noop", reason: "drag and target are the same element" };
    }
    const loc = findNodeByOid(tree, oid, null);
    if (!loc) return { kind: "noop", reason: `drag oid "${oid}" not in tree` };
    if (!loc.parent) return { kind: "noop", reason: "drag element is top-level — can't move" };
    if (!loc.parent.oid) return { kind: "noop", reason: "drag element's parent has no oid — can't address" };
    if (isSelfOrDescendant(dropParent, loc.node)) {
      return { kind: "noop", reason: "would create a cycle — can't drop into self or descendant" };
    }
    if (loc.parent === dropParent) sameParent.push({ oid, srcIdx: loc.index });
    else crossParent.push({ oid, node: loc.node });
  }

  if (sameParent.length > 0 && crossParent.length > 0) {
    if (position === "inside") {
      // Twenty-ninth-pass mixed inside-drop. Same-parent items
      // reorder to end of target (sameToIndex = N - K); cross items
      // append after via per-op bumping from baseInsertIndex = N.
      sameParent.sort((a, b) => a.srcIdx - b.srcIdx);
      const sortedSameOidsIn = sameParent.map((p) => p.oid);
      const sameToIndexIn = dropParent.children.length - sameParent.length;
      const baseInsertIndexIn = dropParent.children.length;
      const dfsIndexIn = computeDfsIndex(tree);
      const sortedCrossIn = [...crossParent].sort(
        (a, b) => (dfsIndexIn.get(a.oid) ?? 0) - (dfsIndexIn.get(b.oid) ?? 0),
      );
      const crossOpsIn = sortedCrossIn.map((e, i) => ({
        oid: e.oid,
        newParentOid: dropParentOid,
        insertIndex: baseInsertIndexIn + i,
      }));
      return {
        kind: "mixed-multi",
        parentOid: dropParentOid,
        sameParentOids: sortedSameOidsIn,
        sameParentToIndex: sameToIndexIn,
        crossParentOps: crossOpsIn,
      };
    }
    sameParent.sort((a, b) => a.srcIdx - b.srcIdx);
    const sortedSameOids = sameParent.map((p) => p.oid);
    const sortedSrcIndicesM = sameParent.map((p) => p.srcIdx);
    let leftDetachesM = 0;
    for (const idx of sortedSrcIndicesM) {
      if (idx < anchorIdx) leftDetachesM++;
    }
    const sameToIndex =
      position === "before"
        ? anchorIdx - leftDetachesM
        : anchorIdx - leftDetachesM + 1;
    const baseInsertIndex = sameToIndex + sortedSameOids.length;
    const dfsIndexM = computeDfsIndex(tree);
    const sortedCrossM = [...crossParent].sort(
      (a, b) => (dfsIndexM.get(a.oid) ?? 0) - (dfsIndexM.get(b.oid) ?? 0),
    );
    const crossOpsM = sortedCrossM.map((e, i) => ({
      oid: e.oid,
      newParentOid: dropParentOid,
      insertIndex: baseInsertIndex + i,
    }));
    return {
      kind: "mixed-multi",
      parentOid: dropParentOid,
      sameParentOids: sortedSameOids,
      sameParentToIndex: sameToIndex,
      crossParentOps: crossOpsM,
    };
  }

  if (sameParent.length > 0) {
    if (position === "inside") {
      // Twenty-ninth-pass — pure same-parent inside-drop. Drop into
      // own parent → reorder block to end.
      sameParent.sort((a, b) => a.srcIdx - b.srcIdx);
      const sortedOidsIn = sameParent.map((p) => p.oid);
      const toIndexIn = dropParent.children.length - sameParent.length;
      return {
        kind: "reorder-multi",
        parentOid: dropParentOid,
        oids: sortedOidsIn,
        toIndex: toIndexIn,
      };
    }
    sameParent.sort((a, b) => a.srcIdx - b.srcIdx);
    const sortedOids = sameParent.map((p) => p.oid);
    const sortedSrcIndices = sameParent.map((p) => p.srcIdx);
    let leftDetaches = 0;
    for (const idx of sortedSrcIndices) {
      if (idx < anchorIdx) leftDetaches++;
    }
    const toIndex =
      position === "before"
        ? anchorIdx - leftDetaches
        : anchorIdx - leftDetaches + 1;
    const isContiguous = sortedSrcIndices.every(
      (v, i) => v === sortedSrcIndices[0] + i,
    );
    if (isContiguous && sortedSrcIndices[0] === toIndex) {
      return { kind: "noop", reason: "no index change" };
    }
    return { kind: "reorder-multi", parentOid: dropParentOid, oids: sortedOids, toIndex };
  }

  if (crossParent.length === 0) {
    return { kind: "noop", reason: "no operations resolved" };
  }
  const baseInsertIndex =
    position === "before"
      ? anchorIdx
      : position === "after"
        ? anchorIdx + 1
        : dropParent.children.length;
  const dfsIndex = computeDfsIndex(tree);
  const sortedCross = [...crossParent].sort(
    (a, b) => (dfsIndex.get(a.oid) ?? 0) - (dfsIndex.get(b.oid) ?? 0),
  );
  const ops = sortedCross.map((e, i) => ({
    oid: e.oid,
    newParentOid: dropParentOid,
    insertIndex: baseInsertIndex + i,
  }));
  return { kind: "reparent-multi", newParentOid: dropParentOid, ops };
}

let pass = 0;
let fail = 0;
function ok(name, cond, info) {
  if (cond) {
    console.log(`PASS: ${name}`);
    pass++;
  } else {
    console.log(`FAIL: ${name}${info ? ` — ${info}` : ""}`);
    fail++;
  }
}

// Test trees.
//
// T_THREE_PARENTS:
//   root [
//     P1 [A, B],
//     P2 [C, D],
//     P3 [E, F]
//   ]
const T_THREE_PARENTS = [
  makeNode("root", [
    makeNode("P1", [makeNode("A"), makeNode("B")]),
    makeNode("P2", [makeNode("C"), makeNode("D")]),
    makeNode("P3", [makeNode("E"), makeNode("F")]),
  ]),
];

// T_TWO_PARENTS:
//   root [
//     P1 [A, B, C],
//     P2 [D, E, F]
//   ]
const T_TWO_PARENTS = [
  makeNode("root", [
    makeNode("P1", [makeNode("A"), makeNode("B"), makeNode("C")]),
    makeNode("P2", [makeNode("D"), makeNode("E"), makeNode("F")]),
  ]),
];

// T_NESTED:
//   root [
//     P1 [A [X]],
//     P2 [D]
//   ]
const T_NESTED = [
  makeNode("root", [
    makeNode("P1", [makeNode("A", [makeNode("X")])]),
    makeNode("P2", [makeNode("D")]),
  ]),
];

// T_EMPTY_TARGET:
//   root [
//     P1 [A, B],
//     P2 []
//   ]
const T_EMPTY_TARGET = [
  makeNode("root", [
    makeNode("P1", [makeNode("A"), makeNode("B")]),
    makeNode("P2", []),
  ]),
];

// (1) Two cross-parent oids → reparent-multi, bumped insertIndex.
{
  // dragOids [A, E] dropped before D (in P2). A is in P1, E is in P3.
  // Both reparent into P2. D's anchor in P2 = idx 1.
  // DFS order: A first (visited before E), so sorted [A, E].
  // Bumped insertIndex: A=1, E=2.
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["A", "E"], "D", "before");
  ok(
    "(1) two cross-parent oids → reparent-multi",
    r.kind === "reparent-multi" &&
      r.ops.length === 2 &&
      r.newParentOid === "P2" &&
      r.ops[0].oid === "A" &&
      r.ops[0].newParentOid === "P2" &&
      r.ops[0].insertIndex === 1 &&
      r.ops[1].oid === "E" &&
      r.ops[1].newParentOid === "P2" &&
      r.ops[1].insertIndex === 2,
    JSON.stringify(r),
  );
}

// (2) DFS-order preservation when input is reverse: [E, A] → sorted [A, E].
{
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["E", "A"], "D", "before");
  ok(
    "(2) DFS-order preservation when input reversed",
    r.kind === "reparent-multi" &&
      r.ops[0].oid === "A" &&
      r.ops[0].insertIndex === 1 &&
      r.ops[1].oid === "E" &&
      r.ops[1].insertIndex === 2,
    JSON.stringify(r),
  );
}

// (3) Three cross-parent oids → ops bumped 1, 2, 3.
{
  // dragOids [A, B, F] before D. A,B in P1; F in P3. All reparent into P2.
  // DFS: A, B, F. Bumped: 1, 2, 3.
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["A", "B", "F"], "D", "before");
  ok(
    "(3) three cross-parent oids → bumped ops",
    r.kind === "reparent-multi" &&
      r.ops.length === 3 &&
      r.ops[0].oid === "A" &&
      r.ops[0].insertIndex === 1 &&
      r.ops[1].oid === "B" &&
      r.ops[1].insertIndex === 2 &&
      r.ops[2].oid === "F" &&
      r.ops[2].insertIndex === 3,
    JSON.stringify(r),
  );
}

// (4) Drop "after" target → insertIndex starts at anchor+1.
{
  // dragOids [A, E] after D (anchor=1 → insertIndex base=2).
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["A", "E"], "D", "after");
  ok(
    "(4) drop after target → insertIndex base = anchor+1",
    r.kind === "reparent-multi" &&
      r.ops[0].insertIndex === 2 &&
      r.ops[1].insertIndex === 3,
    JSON.stringify(r),
  );
}

// (5) Drop "inside" target → insertIndex starts at target.children.length.
{
  // dragOids [A, E] inside P2. P2.children = [C, D] → length 2.
  // Both insertIndex base = 2; bumped 2, 3.
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["A", "E"], "P2", "inside");
  ok(
    "(5) drop inside target → insertIndex base = target.children.length",
    r.kind === "reparent-multi" &&
      r.newParentOid === "P2" &&
      r.ops[0].insertIndex === 2 &&
      r.ops[1].insertIndex === 3,
    JSON.stringify(r),
  );
}

// (6) Single oid → fall-back.
{
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["A"], "D", "before");
  ok(
    "(6) single oid → fall-back",
    r.kind === "fall-back" && /single/.test(r.reason),
    JSON.stringify(r),
  );
}

// (7) Empty oids → noop.
{
  const r = resolveTreeDropMulti(T_THREE_PARENTS, [], "D", "before");
  ok(
    "(7) empty oids → noop",
    r.kind === "noop" && /no drag/.test(r.reason),
    JSON.stringify(r),
  );
}

// (8) Duplicate oids dedupe to single → fall-back.
{
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["A", "A"], "D", "before");
  ok(
    "(8) duplicate oids dedupe to single → fall-back",
    r.kind === "fall-back" && /single/.test(r.reason),
    JSON.stringify(r),
  );
}

// (9) Cycle: drop into descendant of one of the dragged oids → noop.
{
  // T_NESTED: A has child X. Drag {A, X}, target P2, position inside.
  // X's resolveTreeDrop: dragParent=A, dropParent=P2. Cross-parent reparent. OK.
  // A's resolveTreeDrop: dragParent=P1, dropParent=P2. Reparent. OK.
  // No cycle for this combo. Cycle would be: drag A, drop into X (X is A's
  // descendant). Test that scenario instead.
  const r = resolveTreeDropMulti(T_NESTED, ["A", "D"], "X", "inside");
  ok(
    "(9) drop into descendant of dragged oid → noop (cycle)",
    r.kind === "noop" && /cycle/.test(r.reason),
    JSON.stringify(r),
  );
}

// (10) Mixed reorder + reparent → mixed-multi (twenty-eighth pass).
//   dragOids [D, A] before C in P2. D is in P2 (same-parent reorder).
//   A is in P1 (cross-parent reparent).
//   anchorIdx (C) = 0, leftDetaches = 0 (D is at idx 1, not < 0).
//   sameToIndex (before) = 0 - 0 = 0.
//   baseInsertIndex = sameToIndex + 1 = 1.
//   Cross DFS-sorted: just [A].
{
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["D", "A"], "C", "before");
  ok(
    "(10) mixed reorder + reparent → mixed-multi",
    r.kind === "mixed-multi" &&
      r.parentOid === "P2" &&
      r.sameParentOids.length === 1 &&
      r.sameParentOids[0] === "D" &&
      r.sameParentToIndex === 0 &&
      r.crossParentOps.length === 1 &&
      r.crossParentOps[0].oid === "A" &&
      r.crossParentOps[0].newParentOid === "P2" &&
      r.crossParentOps[0].insertIndex === 1,
    JSON.stringify(r),
  );
}

// (11) All same-parent reorder — drag {B, C} BEFORE A in P1 (P1 = [A, B, C]).
//   anchorIdx = 0 (A's pos), leftDetaches = 0 (B and C are after A),
//   toIndex (before) = 0 - 0 = 0.
//   sortedOids = [B, C] (sorted by srcIdx 1, 2).
{
  const r = resolveTreeDropMulti(T_TWO_PARENTS, ["B", "C"], "A", "before");
  ok(
    "(11) same-parent {B, C} before A → reorder-multi toIndex 0",
    r.kind === "reorder-multi" &&
      r.parentOid === "P1" &&
      r.oids.length === 2 &&
      r.oids[0] === "B" &&
      r.oids[1] === "C" &&
      r.toIndex === 0,
    JSON.stringify(r),
  );
}

// (12) Missing oid in tree → hard noop.
{
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["A", "ZZ"], "D", "before");
  ok(
    "(12) missing oid in tree → hard noop",
    r.kind === "noop" && /not in tree/.test(r.reason),
    JSON.stringify(r),
  );
}

// (13) Drop into empty target — insertIndex base = 0.
{
  // dragOids [A, B] inside P2 (empty). P2.children.length = 0.
  // DFS: A, B. Bumped: 0, 1.
  const r = resolveTreeDropMulti(T_EMPTY_TARGET, ["A", "B"], "P2", "inside");
  ok(
    "(13) drop into empty target → insertIndex base 0",
    r.kind === "reparent-multi" &&
      r.ops.length === 2 &&
      r.ops[0].oid === "A" &&
      r.ops[0].insertIndex === 0 &&
      r.ops[1].oid === "B" &&
      r.ops[1].insertIndex === 1,
    JSON.stringify(r),
  );
}

// (14) Drag oid is top-level → noop hard bail.
{
  // dragOids [root, A], target D, before. root has no parent → noop.
  const r = resolveTreeDropMulti(T_THREE_PARENTS, ["root", "A"], "D", "before");
  ok(
    "(14) drag oid top-level → noop",
    r.kind === "noop" && /top-level/.test(r.reason),
    JSON.stringify(r),
  );
}

// (15) Same-parent reorder, drag {D, F} BEFORE A in
//   T_FIVE_LIST = [A, B, C, D, E, F, G]. The "reversal" case from the
//   user's report: naive sequential applyReorder reverses to [F, D, ...]
//   but applyReorderMulti via reorder-multi produces [D, F, A, B, C, E, G].
//   anchorIdx = 0, leftDetaches = 0 (D, F both > 0), toIndex = 0.
//   sortedOids = [D, F].
const T_FIVE_LIST = [
  makeNode("root", [
    makeNode("P1", [
      makeNode("A"),
      makeNode("B"),
      makeNode("C"),
      makeNode("D"),
      makeNode("E"),
      makeNode("F"),
      makeNode("G"),
    ]),
  ]),
];
{
  const r = resolveTreeDropMulti(T_FIVE_LIST, ["D", "F"], "A", "before");
  ok(
    "(15) same-parent {D, F} before A — no reversal",
    r.kind === "reorder-multi" &&
      r.parentOid === "P1" &&
      r.oids[0] === "D" &&
      r.oids[1] === "F" &&
      r.toIndex === 0,
    JSON.stringify(r),
  );
}

// (16) Same-parent reorder, drag {B, C} AFTER E in P1 [A, B, C, D, E].
//   anchorIdx = 4, leftDetaches = 2 (B and C both < 4),
//   toIndex (after) = 4 - 2 + 1 = 3.
//   collapsed [A, D, E] (length 3); insert at 3 → [A, D, E, B, C].
const T_FIVE_AE = [
  makeNode("root", [
    makeNode("P1", [
      makeNode("A"),
      makeNode("B"),
      makeNode("C"),
      makeNode("D"),
      makeNode("E"),
    ]),
  ]),
];
{
  const r = resolveTreeDropMulti(T_FIVE_AE, ["B", "C"], "E", "after");
  ok(
    "(16) same-parent {B, C} after E — toIndex 3",
    r.kind === "reorder-multi" &&
      r.parentOid === "P1" &&
      r.oids[0] === "B" &&
      r.oids[1] === "C" &&
      r.toIndex === 3,
    JSON.stringify(r),
  );
}

// (17) Same-parent reorder, target between dragged. Drag {B, D} AFTER C
// in [A, B, C, D, E].
//   anchorIdx = 2, leftDetaches = 1 (B<2; D>2),
//   toIndex (after) = 2 - 1 + 1 = 2.
//   collapsed [A, C, E]; insert at 2 → [A, C, B, D, E].
{
  const r = resolveTreeDropMulti(T_FIVE_AE, ["B", "D"], "C", "after");
  ok(
    "(17) target between dragged → toIndex 2",
    r.kind === "reorder-multi" &&
      r.parentOid === "P1" &&
      r.oids[0] === "B" &&
      r.oids[1] === "D" &&
      r.toIndex === 2,
    JSON.stringify(r),
  );
}

// (18) Same-parent reorder no-op: dragged block already at slot. Drag
// {A, B} BEFORE C in [A, B, C, D]. sortedSrcIndices=[0,1] contiguous;
// toIndex (before) = 2 - 2 = 0. Block already at [0, 1] starting at 0
// → noop "no index change".
const T_FOUR_AB = [
  makeNode("root", [
    makeNode("P1", [
      makeNode("A"),
      makeNode("B"),
      makeNode("C"),
      makeNode("D"),
    ]),
  ]),
];
{
  const r = resolveTreeDropMulti(T_FOUR_AB, ["A", "B"], "C", "before");
  ok(
    "(18) block already at slot → noop",
    r.kind === "noop" && /no index change/.test(r.reason),
    JSON.stringify(r),
  );
}

// (19) Same-parent reorder DFS sort with mixed input order. Drag
// [F, D] (caller order, but D precedes F in tree) BEFORE A. sortedOids
// must be [D, F] regardless of input order.
{
  const r = resolveTreeDropMulti(T_FIVE_LIST, ["F", "D"], "A", "before");
  ok(
    "(19) DFS sort regardless of input order",
    r.kind === "reorder-multi" && r.oids[0] === "D" && r.oids[1] === "F",
    JSON.stringify(r),
  );
}

// (20) Drag-target is in dragged set → noop hard bail (per-oid
// resolveTreeDrop's "drag and target are the same element").
{
  const r = resolveTreeDropMulti(T_FIVE_AE, ["B", "C"], "B", "before");
  ok(
    "(20) target in dragged set → noop",
    r.kind === "noop" && /same element/.test(r.reason),
    JSON.stringify(r),
  );
}

// === Twenty-eighth pass — mixed-multi cases ===

// (21) Mixed before-anchor: drag {a1, a3, b1} before a4. P_A=[a1,a2,a3,a4],
// P_B=[b1, b2]. anchorIdx=3, sameParent=[a1@0, a3@2], leftDetaches=2,
// sameToIndex(before)=1. baseInsertIndex=1+2=3. Cross DFS=[b1] insertIndex=3.
const T_MIXED_AB = [
  makeNode("root", [
    makeNode("P_A", [
      makeNode("a1"),
      makeNode("a2"),
      makeNode("a3"),
      makeNode("a4"),
    ]),
    makeNode("P_B", [makeNode("b1"), makeNode("b2")]),
  ]),
];
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "a3", "b1"], "a4", "before");
  ok(
    "(21) mixed {a1, a3, b1} before a4 → mixed-multi",
    r.kind === "mixed-multi" &&
      r.parentOid === "P_A" &&
      r.sameParentOids.length === 2 &&
      r.sameParentOids[0] === "a1" &&
      r.sameParentOids[1] === "a3" &&
      r.sameParentToIndex === 1 &&
      r.crossParentOps.length === 1 &&
      r.crossParentOps[0].oid === "b1" &&
      r.crossParentOps[0].newParentOid === "P_A" &&
      r.crossParentOps[0].insertIndex === 3,
    JSON.stringify(r),
  );
}

// (22) Mixed after-anchor: drag {a1, a3, b1} after a4. anchorIdx=3,
// leftDetaches=2, sameToIndex(after)=3-2+1=2. baseInsertIndex=2+2=4.
// Cross DFS=[b1] insertIndex=4.
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "a3", "b1"], "a4", "after");
  ok(
    "(22) mixed after-anchor → toIndex 2, cross insertIdx 4",
    r.kind === "mixed-multi" &&
      r.sameParentToIndex === 2 &&
      r.crossParentOps[0].insertIndex === 4,
    JSON.stringify(r),
  );
}

// (23) Mixed multi-cross: drag {a1, b1, b2} before a4. P_B=[b1, b2] both cross.
// sameParent=[a1@0], anchorIdx=3, leftDetaches=1, sameToIndex(before)=2.
// baseInsertIndex=2+1=3. Cross DFS=[b1, b2] (b1 first in DFS). insertIndices=[3, 4].
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "b1", "b2"], "a4", "before");
  ok(
    "(23) mixed multi-cross before-anchor → DFS-bumped cross ops",
    r.kind === "mixed-multi" &&
      r.sameParentOids.length === 1 &&
      r.sameParentOids[0] === "a1" &&
      r.sameParentToIndex === 2 &&
      r.crossParentOps.length === 2 &&
      r.crossParentOps[0].oid === "b1" &&
      r.crossParentOps[0].insertIndex === 3 &&
      r.crossParentOps[1].oid === "b2" &&
      r.crossParentOps[1].insertIndex === 4,
    JSON.stringify(r),
  );
}

// (24) Twenty-ninth-pass — mixed inside-target now resolves to
// mixed-multi (was fall-back). Drag {a1, b1} inside P_A. P_A initial
// children = [a1, a2, a3, a4]. K=1 (a1 only), N=4. sameToIndex = 4-1 = 3.
// baseInsertIndex = N = 4. Cross b1 → insertIdx = 4.
// Sim outcome: detach a1 → [a2, a3, a4]. Insert at 3 → [a2, a3, a4, a1].
// Step 2: insert b1 at 4 → [a2, a3, a4, a1, b1]. ✓ both at end of P_A.
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "b1"], "P_A", "inside");
  ok(
    "(24) mixed inside-target → mixed-multi",
    r.kind === "mixed-multi" &&
      r.parentOid === "P_A" &&
      r.sameParentOids.length === 1 &&
      r.sameParentOids[0] === "a1" &&
      r.sameParentToIndex === 3 &&
      r.crossParentOps.length === 1 &&
      r.crossParentOps[0].oid === "b1" &&
      r.crossParentOps[0].insertIndex === 4,
    JSON.stringify(r),
  );
}

// (25) Mixed: input oid order doesn't affect output. Drag [b1, a3, a1]
// before a4 → same shape as (21).
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["b1", "a3", "a1"], "a4", "before");
  ok(
    "(25) mixed input order doesn't affect classification",
    r.kind === "mixed-multi" &&
      r.sameParentOids[0] === "a1" &&
      r.sameParentOids[1] === "a3" &&
      r.sameParentToIndex === 1 &&
      r.crossParentOps[0].oid === "b1" &&
      r.crossParentOps[0].insertIndex === 3,
    JSON.stringify(r),
  );
}

// (26) Mixed with three same-parent items that span anchor. Drag {a1, a3, b1}
// after a2 in P_A=[a1, a2, a3, a4]. Same=[a1@0, a3@2], anchorIdx=1 (a2),
// leftDetaches=1 (a1<1; a3>1). sameToIndex(after)=1-1+1=1. base=1+2=3.
// After step1: P_A=[a2, a1, a3, a4]. cross b1 lands at idx 3 → P_A=[a2, a1, a3, b1, a4].
// User intent: all 3 dragged items adjacent after a2 in DFS order. ✓
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "a3", "b1"], "a2", "after");
  ok(
    "(26) mixed three-item span anchor",
    r.kind === "mixed-multi" &&
      r.sameParentToIndex === 1 &&
      r.crossParentOps[0].insertIndex === 3,
    JSON.stringify(r),
  );
}

// (27) Mixed with cross items DFS-sorted across two foreign parents. Tree:
// P_A=[a1, a2], P_B=[b1, b2], P_C=[c1]. Drag {a1, b1, c1} before a2.
// Same=[a1@0]. Cross=[b1, c1] (DFS: b1 visited before c1).
// anchorIdx=1, leftDetaches=1, sameToIndex(before)=0. base=0+1=1.
// Cross insertIndices: b1=1, c1=2.
const T_MIXED_TRI = [
  makeNode("root", [
    makeNode("P_A", [makeNode("a1"), makeNode("a2")]),
    makeNode("P_B", [makeNode("b1"), makeNode("b2")]),
    makeNode("P_C", [makeNode("c1")]),
  ]),
];
{
  const r = resolveTreeDropMulti(T_MIXED_TRI, ["a1", "b1", "c1"], "a2", "before");
  ok(
    "(27) mixed cross DFS across two foreign parents",
    r.kind === "mixed-multi" &&
      r.sameParentOids[0] === "a1" &&
      r.sameParentToIndex === 0 &&
      r.crossParentOps.length === 2 &&
      r.crossParentOps[0].oid === "b1" &&
      r.crossParentOps[0].insertIndex === 1 &&
      r.crossParentOps[1].oid === "c1" &&
      r.crossParentOps[1].insertIndex === 2,
    JSON.stringify(r),
  );
}

// (28) Mixed where same-parent block is a single item, cross item count
// drives the bump. Drag {a4, b1, b2} before a1. Same=[a4@3], anchor=0,
// leftDetaches=0, sameToIndex(before)=0. base=0+1=1. Cross=[b1, b2] →
// insertIndices=[1, 2].
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a4", "b1", "b2"], "a1", "before");
  ok(
    "(28) mixed single-same multi-cross before-first",
    r.kind === "mixed-multi" &&
      r.sameParentOids.length === 1 &&
      r.sameParentOids[0] === "a4" &&
      r.sameParentToIndex === 0 &&
      r.crossParentOps.length === 2 &&
      r.crossParentOps[0].insertIndex === 1 &&
      r.crossParentOps[1].insertIndex === 2,
    JSON.stringify(r),
  );
}

// (29) Mixed cycle bail: drag {nested, a1, b1} into descendant. T_NESTED_MX:
// P_A has nested=[c1]. Drag includes nested. Drop inside c1 (descendant of
// nested) → cycle.
const T_NESTED_MX = [
  makeNode("root", [
    makeNode("P_A", [makeNode("nested", [makeNode("c1")]), makeNode("a1")]),
    makeNode("P_B", [makeNode("b1")]),
  ]),
];
{
  // Drop position before c1: dropParent = nested (c1's parent). nested IS
  // dragged, so isSelfOrDescendant(nested, nested) = true → noop cycle.
  const r = resolveTreeDropMulti(T_NESTED_MX, ["nested", "a1", "b1"], "c1", "before");
  ok(
    "(29) mixed cycle (drop into descendant) → noop",
    r.kind === "noop" && /cycle/.test(r.reason),
    JSON.stringify(r),
  );
}

// (30) Mixed where target is in dragged set → noop. Drag {a4, a1, b1}
// before a4 (target a4 IS in set).
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a4", "a1", "b1"], "a4", "before");
  ok(
    "(30) mixed target in dragged set → noop",
    r.kind === "noop" && /same element/.test(r.reason),
    JSON.stringify(r),
  );
}

// (31) Mixed end-to-end simulation: trace step1 + step2 produces expected
// final state. Engine is "applyReorderMulti then per-op applyReparent".
// Mock: array.splice via plain JS to verify the math composes correctly.
function simulateMixed({ parentChildren, sameOids, sameToIndex, crossOps }) {
  // Step 1: detach sameOids in DFS-sorted order, then reinsert as a block
  // at sameToIndex (collapsed-list index).
  const detached = [];
  const remaining = [];
  for (const child of parentChildren) {
    if (sameOids.includes(child)) detached.push(child);
    else remaining.push(child);
  }
  // Insert detached as a block at sameToIndex in remaining
  const afterStep1 = [
    ...remaining.slice(0, sameToIndex),
    ...detached,
    ...remaining.slice(sameToIndex),
  ];
  // Step 2: insert cross ops at their insertIndex (post-step1)
  let working = [...afterStep1];
  for (const op of crossOps) {
    // Each op's insertIndex is computed against the running source after
    // previous ops. Naive: insert at op.insertIndex.
    working = [
      ...working.slice(0, op.insertIndex),
      op.oid,
      ...working.slice(op.insertIndex),
    ];
  }
  return working;
}

// Verify (21) outcome: P_A=[a1, a2, a3, a4], drag {a1, a3, b1} before a4.
// Resolver: same=[a1, a3] @ idx 1, cross=[b1] @ idx 3.
// step 1: detach a1, a3 → [a2, a4]. Insert at 1 → [a2, a1, a3, a4].
// step 2: insert b1 at 3 → [a2, a1, a3, b1, a4]. ✓ DFS-ordered adjacent.
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "a3", "b1"], "a4", "before");
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(31) sim mixed-multi (21) outcome — DFS adjacent before a4",
    JSON.stringify(final) === JSON.stringify(["a2", "a1", "a3", "b1", "a4"]),
    JSON.stringify(final),
  );
}

// (32) Verify (22) outcome: drag {a1, a3, b1} after a4.
// Resolver: same=[a1, a3] @ idx 2, cross=[b1] @ idx 4.
// step 1: detach a1, a3 → [a2, a4]. Insert at 2 → [a2, a4, a1, a3].
// step 2: insert b1 at 4 → [a2, a4, a1, a3, b1]. ✓ DFS-ordered after a4.
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "a3", "b1"], "a4", "after");
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(32) sim mixed-multi (22) outcome — DFS adjacent after a4",
    JSON.stringify(final) === JSON.stringify(["a2", "a4", "a1", "a3", "b1"]),
    JSON.stringify(final),
  );
}

// (33) Verify (26) outcome: drag {a1, a3, b1} after a2.
// Resolver: same=[a1, a3] @ idx 1, cross=[b1] @ idx 3.
// step 1: detach a1, a3 → [a2, a4]. Insert at 1 → [a2, a1, a3, a4].
// step 2: insert b1 at 3 → [a2, a1, a3, b1, a4]. ✓
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "a3", "b1"], "a2", "after");
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(33) sim mixed-multi (26) outcome — adjacent after a2",
    JSON.stringify(final) === JSON.stringify(["a2", "a1", "a3", "b1", "a4"]),
    JSON.stringify(final),
  );
}

// (34) Verify (28) outcome: drag {a4, b1, b2} before a1. After step1
// (detach a4 → [a1, a2, a3]; insert at 0 → [a4, a1, a2, a3]). Step 2:
// insert b1 at 1 → [a4, b1, a1, a2, a3]; insert b2 at 2 → [a4, b1, b2, a1, a2, a3].
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a4", "b1", "b2"], "a1", "before");
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(34) sim mixed-multi (28) outcome — block before a1",
    JSON.stringify(final) === JSON.stringify(["a4", "b1", "b2", "a1", "a2", "a3"]),
    JSON.stringify(final),
  );
}

// (35) Mixed with anchorIdx=0 (drop before first child). Drag {a3, b1}
// before a1. Same=[a3@2], anchorIdx=0, leftDetaches=0 (a3 not <0),
// sameToIndex(before)=0. base=0+1=1. Cross b1 at insertIdx 1.
// Sim: detach a3 → [a1, a2, a4]. Insert at 0 → [a3, a1, a2, a4].
// Step2: insert b1 at 1 → [a3, b1, a1, a2, a4]. ✓
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a3", "b1"], "a1", "before");
  ok(
    "(35) mixed anchor=0 → block lands at start",
    r.kind === "mixed-multi" &&
      r.sameParentToIndex === 0 &&
      r.crossParentOps[0].insertIndex === 1,
    JSON.stringify(r),
  );
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(35b) sim mixed anchor=0 outcome",
    JSON.stringify(final) === JSON.stringify(["a3", "b1", "a1", "a2", "a4"]),
    JSON.stringify(final),
  );
}

// === Twenty-ninth pass — mixed-bucket inside-drop cases ===

// (36) Mixed inside, two same + one cross. Drag {a1, a3, b1} inside P_A.
// N=4, K=2. sameToIndex = 4-2 = 2. baseInsertIndex = 4. b1 at idx 4.
// Sim: detach a1, a3 → [a2, a4]. Insert at 2 → [a2, a4, a1, a3]. Step 2:
// b1 at 4 → [a2, a4, a1, a3, b1]. All three dragged at end. ✓
{
  const r = resolveTreeDropMulti(
    T_MIXED_AB,
    ["a1", "a3", "b1"],
    "P_A",
    "inside",
  );
  ok(
    "(36) mixed inside, 2 same + 1 cross → block at end",
    r.kind === "mixed-multi" &&
      r.parentOid === "P_A" &&
      r.sameParentOids.length === 2 &&
      r.sameParentOids[0] === "a1" &&
      r.sameParentOids[1] === "a3" &&
      r.sameParentToIndex === 2 &&
      r.crossParentOps.length === 1 &&
      r.crossParentOps[0].oid === "b1" &&
      r.crossParentOps[0].insertIndex === 4,
    JSON.stringify(r),
  );
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(36b) sim mixed inside outcome — block at end of P_A",
    JSON.stringify(final) ===
      JSON.stringify(["a2", "a4", "a1", "a3", "b1"]),
    JSON.stringify(final),
  );
}

// (37) Mixed inside with multi-cross. Drag {a1, b1, b2} inside P_A.
// Same=[a1@0], cross=[b1, b2] (DFS). N=4, K=1. sameToIndex = 3.
// baseInsertIndex = 4. b1=4, b2=5.
// Sim: detach a1 → [a2, a3, a4]. Insert at 3 → [a2, a3, a4, a1].
// Step 2: b1 at 4 → [a2, a3, a4, a1, b1]; b2 at 5 → [a2, a3, a4, a1, b1, b2]. ✓
{
  const r = resolveTreeDropMulti(
    T_MIXED_AB,
    ["a1", "b1", "b2"],
    "P_A",
    "inside",
  );
  ok(
    "(37) mixed inside multi-cross",
    r.kind === "mixed-multi" &&
      r.sameParentOids[0] === "a1" &&
      r.sameParentToIndex === 3 &&
      r.crossParentOps.length === 2 &&
      r.crossParentOps[0].insertIndex === 4 &&
      r.crossParentOps[1].insertIndex === 5,
    JSON.stringify(r),
  );
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(37b) sim mixed inside multi-cross outcome",
    JSON.stringify(final) ===
      JSON.stringify(["a2", "a3", "a4", "a1", "b1", "b2"]),
    JSON.stringify(final),
  );
}

// (38) Mixed inside where ALL same-parent items are dragged (K === N).
// P_A=[a1, a2, a3, a4]; drag {a1, a2, a3, a4, b1} inside P_A.
// Same=all 4, cross=[b1]. N=4, K=4. sameToIndex = 0. baseInsertIndex = 4.
// Sim: detach all → []. Insert at 0 → [a1, a2, a3, a4]. Step 2: b1 at 4
// → [a1, a2, a3, a4, b1]. All at end (well, the same-parent block is at
// "end of nothing" which equals start, then cross appends).
{
  const r = resolveTreeDropMulti(
    T_MIXED_AB,
    ["a1", "a2", "a3", "a4", "b1"],
    "P_A",
    "inside",
  );
  ok(
    "(38) mixed inside K===N → sameToIndex 0",
    r.kind === "mixed-multi" &&
      r.sameParentOids.length === 4 &&
      r.sameParentToIndex === 0 &&
      r.crossParentOps.length === 1 &&
      r.crossParentOps[0].insertIndex === 4,
    JSON.stringify(r),
  );
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(38b) sim mixed inside K===N outcome",
    JSON.stringify(final) ===
      JSON.stringify(["a1", "a2", "a3", "a4", "b1"]),
    JSON.stringify(final),
  );
}

// (39) Mixed inside, dragged set adjacent to other unrelated children.
// Drag {a2, b1} inside P_A. Same=[a2@1], cross=[b1]. N=4, K=1.
// sameToIndex = 3. baseInsertIndex = 4. b1 at 4.
// Sim: detach a2 → [a1, a3, a4]. Insert at 3 → [a1, a3, a4, a2].
// Step 2: b1 at 4 → [a1, a3, a4, a2, b1].
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a2", "b1"], "P_A", "inside");
  ok(
    "(39) mixed inside same@1 + cross",
    r.kind === "mixed-multi" &&
      r.sameParentOids[0] === "a2" &&
      r.sameParentToIndex === 3 &&
      r.crossParentOps[0].insertIndex === 4,
    JSON.stringify(r),
  );
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(39b) sim mixed inside same@1 outcome",
    JSON.stringify(final) ===
      JSON.stringify(["a1", "a3", "a4", "a2", "b1"]),
    JSON.stringify(final),
  );
}

// (40) Mixed inside with cross items from two foreign parents — DFS
// preserved. T_MIXED_TRI: P_A=[a1, a2], P_B=[b1, b2], P_C=[c1].
// Drag {a1, b1, c1} inside P_A. Same=[a1@0], cross=[b1, c1] (DFS).
// N=2, K=1. sameToIndex = 1. baseInsertIndex = 2. b1=2, c1=3.
// Sim: detach a1 → [a2]. Insert at 1 → [a2, a1]. Step 2: b1 at 2 →
// [a2, a1, b1]; c1 at 3 → [a2, a1, b1, c1].
{
  const r = resolveTreeDropMulti(
    T_MIXED_TRI,
    ["a1", "b1", "c1"],
    "P_A",
    "inside",
  );
  ok(
    "(40) mixed inside DFS across foreign parents",
    r.kind === "mixed-multi" &&
      r.sameParentToIndex === 1 &&
      r.crossParentOps[0].oid === "b1" &&
      r.crossParentOps[0].insertIndex === 2 &&
      r.crossParentOps[1].oid === "c1" &&
      r.crossParentOps[1].insertIndex === 3,
    JSON.stringify(r),
  );
  const final = simulateMixed({
    parentChildren: ["a1", "a2"],
    sameOids: r.sameParentOids,
    sameToIndex: r.sameParentToIndex,
    crossOps: r.crossParentOps,
  });
  ok(
    "(40b) sim mixed inside DFS-cross outcome",
    JSON.stringify(final) === JSON.stringify(["a2", "a1", "b1", "c1"]),
    JSON.stringify(final),
  );
}

// (41) Mixed inside with input order shuffle — same DFS-sorted result.
// Drag {b1, a3, a1} inside P_A. Output order should be DFS [a1, a3] for
// same and [b1] for cross, sameToIndex same as (36).
{
  const r = resolveTreeDropMulti(
    T_MIXED_AB,
    ["b1", "a3", "a1"],
    "P_A",
    "inside",
  );
  ok(
    "(41) mixed inside input-order doesn't matter",
    r.kind === "mixed-multi" &&
      r.sameParentOids[0] === "a1" &&
      r.sameParentOids[1] === "a3" &&
      r.sameParentToIndex === 2 &&
      r.crossParentOps[0].oid === "b1" &&
      r.crossParentOps[0].insertIndex === 4,
    JSON.stringify(r),
  );
}

// (42) Mixed inside cycle — drop {nested, a1} inside descendant. Should
// noop because dropParent is a descendant of `nested` (one of the
// dragged items).
{
  // T_NESTED_MX has nested=[c1]. Drop inside c1 with nested in dragSet
  // → cycle.
  const r = resolveTreeDropMulti(
    T_NESTED_MX,
    ["nested", "a1"],
    "c1",
    "inside",
  );
  ok(
    "(42) mixed inside cycle → noop",
    r.kind === "noop" && /cycle/.test(r.reason),
    JSON.stringify(r),
  );
}

// (43) Mixed inside where target IS in dragged set → noop (target
// classification fires before bucketing).
{
  const r = resolveTreeDropMulti(
    T_MIXED_AB,
    ["P_A", "b1"],
    "P_A",
    "inside",
  );
  ok(
    "(43) mixed inside target-in-set → noop",
    r.kind === "noop" && /same element/.test(r.reason),
    JSON.stringify(r),
  );
}

// === Twenty-ninth pass — same-parent inside-drop cases ===

// (44) Pure same-parent inside-drop. Drag {a1, a3} inside P_A.
// All sameParent. K=2, N=4. toIndex = 4-2 = 2.
// Sim: detach [a1, a3] → [a2, a4]. Insert at 2 → [a2, a4, a1, a3].
// Block at end of P_A. ✓
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "a3"], "P_A", "inside");
  ok(
    "(44) same-parent inside → reorder to end",
    r.kind === "reorder-multi" &&
      r.parentOid === "P_A" &&
      r.oids.length === 2 &&
      r.oids[0] === "a1" &&
      r.oids[1] === "a3" &&
      r.toIndex === 2,
    JSON.stringify(r),
  );
  // Sim via simulateMixed with empty crossOps
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.oids,
    sameToIndex: r.toIndex,
    crossOps: [],
  });
  ok(
    "(44b) sim same-parent inside outcome",
    JSON.stringify(final) === JSON.stringify(["a2", "a4", "a1", "a3"]),
    JSON.stringify(final),
  );
}

// (45) Same-parent inside K===N → block already at end, no-op via fast path.
// Drag {a1, a2, a3, a4} inside P_A. K=N=4. toIndex = 0.
// sortedSrcIndices = [0, 1, 2, 3], consecutive starting at 0=toIndex.
// Engine fast-path returns unchanged. The resolver still produces the
// op (engine is the no-op detector, not resolver).
{
  const r = resolveTreeDropMulti(
    T_MIXED_AB,
    ["a1", "a2", "a3", "a4"],
    "P_A",
    "inside",
  );
  ok(
    "(45) same-parent inside K===N → toIndex 0",
    r.kind === "reorder-multi" &&
      r.oids.length === 4 &&
      r.toIndex === 0,
    JSON.stringify(r),
  );
}

// (46) Same-parent inside, contiguous block already at end → engine
// detects no-op. Drag {a3, a4} inside P_A. K=2, N=4. toIndex=2.
// sortedSrcIndices = [2, 3], consecutive starting at 2=toIndex →
// engine fast-path no-op.
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a3", "a4"], "P_A", "inside");
  ok(
    "(46) same-parent inside block-already-at-end",
    r.kind === "reorder-multi" && r.toIndex === 2,
    JSON.stringify(r),
  );
}

// (47) Same-parent inside, non-contiguous selection. Drag {a1, a4}
// inside P_A. K=2, N=4. toIndex=2.
// Sim: detach a1, a4 → [a2, a3]. Insert at 2 → [a2, a3, a1, a4]. ✓
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a1", "a4"], "P_A", "inside");
  ok(
    "(47) same-parent inside non-contiguous",
    r.kind === "reorder-multi" &&
      r.oids[0] === "a1" &&
      r.oids[1] === "a4" &&
      r.toIndex === 2,
    JSON.stringify(r),
  );
  const final = simulateMixed({
    parentChildren: ["a1", "a2", "a3", "a4"],
    sameOids: r.oids,
    sameToIndex: r.toIndex,
    crossOps: [],
  });
  ok(
    "(47b) sim same-parent inside non-contiguous outcome",
    JSON.stringify(final) === JSON.stringify(["a2", "a3", "a1", "a4"]),
    JSON.stringify(final),
  );
}

// (48) Same-parent inside with input order shuffled. Drag {a3, a1}
// inside P_A. Sorted by srcIdx → [a1, a3]. Same outcome as (44).
{
  const r = resolveTreeDropMulti(T_MIXED_AB, ["a3", "a1"], "P_A", "inside");
  ok(
    "(48) same-parent inside DFS-sorted regardless of input",
    r.kind === "reorder-multi" &&
      r.oids[0] === "a1" &&
      r.oids[1] === "a3" &&
      r.toIndex === 2,
    JSON.stringify(r),
  );
}

const total = pass + fail;
console.log(`bench-tree-dnd-multi: ${pass}/${total} passed`);
process.exit(fail === 0 ? 0 : 1);
