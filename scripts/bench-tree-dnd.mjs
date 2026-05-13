// Phase 6 ramp — bench for `resolveTreeDrop` (lib/ast/tree-dnd.ts).
// Pure-function tests. The resolver maps a (tree, dragOid, targetOid,
// position) triple onto a {reorder|reparent|noop} op. It never touches
// source bytes — applyReorder/applyReparent do that, and they have
// their own benches (bench-reorder, bench-reparent).
//
// Why a separate bench: the index math (before/after/inside on either
// the same or different parent) has enough off-by-one foot-guns that
// shipping it without coverage would be irresponsible. Cycle detection
// is also a critical safety check.
//
// Inlines a clone of resolveTreeDrop. Build a small synthetic TreeNode
// shape (just oid + children — the resolver doesn't read tag, loc, or
// classes).

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

function resolveTreeDrop(tree, dragOid, targetOid, position) {
  if (!dragOid) return { kind: "noop", reason: "drag oid missing" };
  if (!targetOid) return { kind: "noop", reason: "target oid missing" };
  if (dragOid === targetOid) {
    return { kind: "noop", reason: "drag and target are the same element" };
  }

  const dragLoc = findNodeByOid(tree, dragOid, null);
  if (!dragLoc) {
    return { kind: "noop", reason: `drag oid "${dragOid}" not in tree` };
  }
  const tgtLoc = findNodeByOid(tree, targetOid, null);
  if (!tgtLoc) {
    return { kind: "noop", reason: `target oid "${targetOid}" not in tree` };
  }

  if (!dragLoc.parent) {
    return { kind: "noop", reason: "drag element is top-level — can't move" };
  }
  const dragParent = dragLoc.parent;
  const dragParentOid = dragParent.oid;
  if (!dragParentOid) {
    return {
      kind: "noop",
      reason: "drag element's parent has no oid — can't address",
    };
  }

  let dropParent;
  let anchorIdx;
  if (position === "inside") {
    dropParent = tgtLoc.node;
    anchorIdx = -1;
  } else {
    if (!tgtLoc.parent) {
      return {
        kind: "noop",
        reason: "target is top-level — drop before/after needs a parent",
      };
    }
    dropParent = tgtLoc.parent;
    anchorIdx = tgtLoc.index;
  }

  const dropParentOid = dropParent.oid;
  if (!dropParentOid) {
    return {
      kind: "noop",
      reason: "drop parent has no oid — can't address",
    };
  }

  if (isSelfOrDescendant(dropParent, dragLoc.node)) {
    return {
      kind: "noop",
      reason: "would create a cycle — can't drop into self or descendant",
    };
  }

  const sameParent = dropParent === dragParent;

  if (sameParent) {
    const srcIdx = dragLoc.index;
    if (position === "inside") {
      // Thirtieth-pass — single-drag mirror of multi same-parent
      // inside-drop. toIndex = N - 1 (post-detach append slot).
      const toIndex = dropParent.children.length - 1;
      if (toIndex === srcIdx) {
        return { kind: "noop", reason: "no index change" };
      }
      return { kind: "reorder", oid: dragOid, parentOid: dropParentOid, toIndex };
    }
    let toIndex;
    if (position === "before") {
      if (srcIdx === anchorIdx) {
        return { kind: "noop", reason: "drop before self — same slot" };
      }
      toIndex = srcIdx < anchorIdx ? anchorIdx - 1 : anchorIdx;
    } else {
      if (srcIdx === anchorIdx) {
        return { kind: "noop", reason: "drop after self — same slot" };
      }
      toIndex = srcIdx < anchorIdx ? anchorIdx : anchorIdx + 1;
    }
    if (toIndex === srcIdx) {
      return { kind: "noop", reason: "no index change" };
    }
    return { kind: "reorder", oid: dragOid, parentOid: dropParentOid, toIndex };
  }

  let insertIndex;
  if (position === "before") {
    insertIndex = anchorIdx;
  } else if (position === "after") {
    insertIndex = anchorIdx + 1;
  } else {
    insertIndex = dropParent.children.length;
  }

  return {
    kind: "reparent",
    oid: dragOid,
    newParentOid: dropParentOid,
    insertIndex,
  };
}

let passed = 0;
let failed = 0;

function eq(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object") return false;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (!eq(a[k], b[k])) return false;
  }
  return true;
}

function check(name, got, want) {
  const ok = eq(got, want);
  if (ok) {
    passed++;
    console.log(`PASS: ${name}`);
  } else {
    failed++;
    console.log(`FAIL: ${name}`);
    console.log("  got:  ", JSON.stringify(got));
    console.log("  want: ", JSON.stringify(want));
  }
}

function checkReason(name, got, reasonRe) {
  if (got && got.kind === "noop" && reasonRe.test(got.reason)) {
    passed++;
    console.log(`PASS: ${name}`);
  } else {
    failed++;
    console.log(
      `FAIL: ${name} (expected noop with reason matching ${reasonRe}, got ${JSON.stringify(got)})`,
    );
  }
}

// ---- Fixtures ----------------------------------------------------------

// Tree A: <root R> [<a A>, <b B>, <c C>, <d D>]
const treeA = [
  makeNode("R", [
    makeNode("A"),
    makeNode("B"),
    makeNode("C"),
    makeNode("D"),
  ]),
];

// Tree B: <root R> [<box1 P> [<x X>, <y Y>], <box2 Q> [<z Z>]]
const treeB = [
  makeNode("R", [
    makeNode("P", [makeNode("X"), makeNode("Y")]),
    makeNode("Q", [makeNode("Z")]),
  ]),
];

// Tree C: <root R> [<a A> [<a1 A1>, <a2 A2>], <b B>]
const treeC = [
  makeNode("R", [
    makeNode("A", [makeNode("A1"), makeNode("A2")]),
    makeNode("B"),
  ]),
];

// Tree D: multi-root [<r1 R1> [<a A>], <r2 R2> [<b B>]]
const treeD = [
  makeNode("R1", [makeNode("A")]),
  makeNode("R2", [makeNode("B")]),
];

// Tree E: <R> [<A>, <B null-oid>, <C>] — middle child has no OID
const treeE = [
  makeNode("R", [makeNode("A"), makeNode(null), makeNode("C")]),
];

// ---- Tests -------------------------------------------------------------

// 1. Same parent, before later sibling.
// Drag A (idx 0) before C (idx 2) → toIndex = 2 - 1 = 1.
check(
  "1: same parent, drag A before C → toIndex=1",
  resolveTreeDrop(treeA, "A", "C", "before"),
  { kind: "reorder", oid: "A", parentOid: "R", toIndex: 1 },
);

// 2. Same parent, after later sibling.
// Drag A (idx 0) after C (idx 2) → toIndex = 2 (after splice C@2 → 1, after = 2).
check(
  "2: same parent, drag A after C → toIndex=2",
  resolveTreeDrop(treeA, "A", "C", "after"),
  { kind: "reorder", oid: "A", parentOid: "R", toIndex: 2 },
);

// 3. Same parent, before earlier sibling.
// Drag D (idx 3) before B (idx 1) → toIndex = 1.
check(
  "3: same parent, drag D before B → toIndex=1",
  resolveTreeDrop(treeA, "D", "B", "before"),
  { kind: "reorder", oid: "D", parentOid: "R", toIndex: 1 },
);

// 4. Same parent, after earlier sibling.
// Drag D (idx 3) after B (idx 1) → toIndex = 2.
check(
  "4: same parent, drag D after B → toIndex=2",
  resolveTreeDrop(treeA, "D", "B", "after"),
  { kind: "reorder", oid: "D", parentOid: "R", toIndex: 2 },
);

// 5. Same parent, drag before self → noop.
checkReason(
  "5: drag A before A → noop",
  resolveTreeDrop(treeA, "A", "A", "before"),
  /same element/i,
);

// 6. Same parent, drag before adjacent right sibling — reorder no-op.
// Drag A (idx 0) before B (idx 1) → toIndex = 1 - 1 = 0 == srcIdx → noop.
checkReason(
  "6: drag A before adjacent-right B → no index change noop",
  resolveTreeDrop(treeA, "A", "B", "before"),
  /no index change/i,
);

// 7. Same parent, drag after adjacent left sibling — reorder no-op.
// Drag B (idx 1) after A (idx 0) → toIndex = 0 + 1 = 1 == srcIdx → noop.
checkReason(
  "7: drag B after adjacent-left A → no index change noop",
  resolveTreeDrop(treeA, "B", "A", "after"),
  /no index change/i,
);

// 8. Cross parent before — reparent.
// Drag X (in P) before Z (in Q) → reparent into Q at insertIndex=0.
check(
  "8: cross parent, drag X before Z → reparent insertIndex=0",
  resolveTreeDrop(treeB, "X", "Z", "before"),
  { kind: "reparent", oid: "X", newParentOid: "Q", insertIndex: 0 },
);

// 9. Cross parent after — reparent.
// Drag X (in P) after Z (in Q, idx 0) → insertIndex = 1.
check(
  "9: cross parent, drag X after Z → reparent insertIndex=1",
  resolveTreeDrop(treeB, "X", "Z", "after"),
  { kind: "reparent", oid: "X", newParentOid: "Q", insertIndex: 1 },
);

// 10. Cross parent inside — reparent into target node, append at end.
// Drag X (in P) inside Q → insertIndex = Q.children.length = 1.
check(
  "10: cross parent, drag X inside Q → reparent insertIndex=Q.children.length",
  resolveTreeDrop(treeB, "X", "Q", "inside"),
  { kind: "reparent", oid: "X", newParentOid: "Q", insertIndex: 1 },
);

// 11. Cycle: drop into self.
checkReason(
  "11: drop X into X (inside) → cycle bail",
  resolveTreeDrop(treeB, "X", "X", "inside"),
  /same element/i,
);

// 12. Cycle: drop A into descendant A1.
checkReason(
  "12: drop A inside A1 (descendant) → cycle bail",
  resolveTreeDrop(treeC, "A", "A1", "inside"),
  /cycle/i,
);

// 13. Cycle: drop A before A2 (where A2 is descendant of A — drop parent
// would be A itself which IS the drag node).
checkReason(
  "13: drop A before A2 (drop parent=A=drag) → cycle bail",
  resolveTreeDrop(treeC, "A", "A2", "before"),
  /cycle/i,
);

// 14. Top-level drag: dragging the root R bails.
checkReason(
  "14: drag root R before X → top-level bail",
  resolveTreeDrop(treeB, "R", "X", "before"),
  /top-level/i,
);

// 15. Top-level target with before/after — bails because drop parent
// would be tree (no oid). Use treeD (multi-root) so the target is
// genuinely top-level.
checkReason(
  "15: drop A before R2 (top-level target, before) → bail",
  resolveTreeDrop(treeD, "A", "R2", "before"),
  /top-level/i,
);

// 16. Top-level target with inside — fine, drop parent is the root.
check(
  "16: drag A inside R2 → reparent into R2",
  resolveTreeDrop(treeD, "A", "R2", "inside"),
  { kind: "reparent", oid: "A", newParentOid: "R2", insertIndex: 1 },
);

// 17. dragOid not in tree → bail.
checkReason(
  "17: drag missing-oid before A → bail",
  resolveTreeDrop(treeA, "MISSING", "A", "before"),
  /not in tree/i,
);

// 18. targetOid not in tree → bail.
checkReason(
  "18: drag A before missing-oid → bail",
  resolveTreeDrop(treeA, "A", "MISSING", "before"),
  /not in tree/i,
);

// 19. Empty oid args.
checkReason(
  "19: empty drag oid → bail",
  resolveTreeDrop(treeA, "", "A", "before"),
  /missing/i,
);
checkReason(
  "20: empty target oid → bail",
  resolveTreeDrop(treeA, "A", "", "before"),
  /missing/i,
);

// 21. Same-parent before at index 0 boundary.
// Drag C (idx 2) before A (idx 0) → toIndex = 0.
check(
  "21: drag C before first sibling A → toIndex=0",
  resolveTreeDrop(treeA, "C", "A", "before"),
  { kind: "reorder", oid: "C", parentOid: "R", toIndex: 0 },
);

// 22. Same-parent after at last-index boundary.
// Drag A (idx 0) after D (idx 3) → toIndex = 3 (after splice D shifts to 2; insert after = 3).
check(
  "22: drag A after last sibling D → toIndex=3",
  resolveTreeDrop(treeA, "A", "D", "after"),
  { kind: "reorder", oid: "A", parentOid: "R", toIndex: 3 },
);

// 23. Cross-parent before at index 0 boundary.
// treeC: drag B (in R) before A1 (in A) → reparent into A at insertIndex=0.
check(
  "23: cross-parent, drag B before A1 → reparent into A insertIndex=0",
  resolveTreeDrop(treeC, "B", "A1", "before"),
  { kind: "reparent", oid: "B", newParentOid: "A", insertIndex: 0 },
);

// 24. Cross-parent after last sibling.
// treeC: drag B (in R) after A2 (in A, idx 1) → reparent into A insertIndex=2 (== A.children.length).
check(
  "24: cross-parent, drag B after A2 (last child of A) → insertIndex=A.children.length",
  resolveTreeDrop(treeC, "B", "A2", "after"),
  { kind: "reparent", oid: "B", newParentOid: "A", insertIndex: 2 },
);

// 25. Cross-parent inside empty target — append at insertIndex=0.
// Build a small ad-hoc tree where target has no children.
const treeF = [
  makeNode("R", [
    makeNode("P", [makeNode("X")]),
    makeNode("Q"), // empty container
  ]),
];
check(
  "25: drag X inside empty Q → reparent insertIndex=0",
  resolveTreeDrop(treeF, "X", "Q", "inside"),
  { kind: "reparent", oid: "X", newParentOid: "Q", insertIndex: 0 },
);

// 26. Drop into sibling's children (cross-parent inside) for an OID-bearing
// nested target several levels deep.
// treeC: drag B inside A1 → reparent into A1, insertIndex=0.
check(
  "26: drag B inside A1 (deep) → reparent insertIndex=0",
  resolveTreeDrop(treeC, "B", "A1", "inside"),
  { kind: "reparent", oid: "B", newParentOid: "A1", insertIndex: 0 },
);

// 27. drag and target both top-level in multi-root tree → bails because
// drag is top-level. Even if "inside" target.
checkReason(
  "27: drag top-level R1 inside R2 → top-level drag bail",
  resolveTreeDrop(treeD, "R1", "R2", "inside"),
  /top-level/i,
);

// 28. Parent without OID: in treeE, the middle child has null oid; we can't
// drop "before" / "after" it because targetOid is null. We pass empty
// string explicitly to mimic a HTML-mode caller that ignores null-OID
// rows. (The real ElementTree gates drag/drop to OID-bearing rows so
// this branch is defensive.)
checkReason(
  "28: missing target oid (HTML-mode row) → bail",
  resolveTreeDrop(treeE, "A", "", "before"),
  /missing/i,
);

// 29. Drop "after" the drag's own neighbour at the same index it would
// take post-detach is a no-op. Specifically, drag B (idx 1) after A
// (idx 0): srcIdx=1, anchor=0, srcIdx > anchor → toIndex = 0+1 = 1 ===
// srcIdx → noop. Already covered by #7 but adding the symmetric case
// to lock the math: drag A after B is NOT a noop (toIndex = 1 since
// srcIdx<anchor → anchorIdx). Drag A (0) after B (1) → 1 != 0 → reorder.
check(
  "29: drag A after B (asymmetric to #7) → toIndex=1 reorder",
  resolveTreeDrop(treeA, "A", "B", "after"),
  { kind: "reorder", oid: "A", parentOid: "R", toIndex: 1 },
);

// 30. Reorder and then "before" the freshly-vacated slot: drag B (1)
// before D (3) → toIndex = 3 - 1 = 2.
check(
  "30: drag B before D (skipping C) → toIndex=2",
  resolveTreeDrop(treeA, "B", "D", "before"),
  { kind: "reorder", oid: "B", parentOid: "R", toIndex: 2 },
);

// ---- Thirtieth-pass — single-drag same-parent inside-drop -------------

// 31. Same-parent inside-drop: drag A (idx 0) into its parent R
// (which has 4 children). Expected: reorder, toIndex = N-1 = 3.
check(
  "31: same-parent inside, drag A inside R (own parent) → toIndex=3",
  resolveTreeDrop(treeA, "A", "R", "inside"),
  { kind: "reorder", oid: "A", parentOid: "R", toIndex: 3 },
);

// 32. Same-parent inside-drop where the dragged row is already last:
// drag D (idx 3) inside R → toIndex = 3 = srcIdx → noop.
checkReason(
  "32: same-parent inside, drag last child D inside R (already at end) → noop",
  resolveTreeDrop(treeA, "D", "R", "inside"),
  /no index change/i,
);

// 33. Same-parent inside-drop in a multi-child parent (treeC.A has 2
// children A1, A2). Drag A1 (idx 0) inside A → toIndex = 1.
check(
  "33: same-parent inside, drag A1 inside parent A (2 children) → toIndex=1",
  resolveTreeDrop(treeC, "A1", "A", "inside"),
  { kind: "reorder", oid: "A1", parentOid: "A", toIndex: 1 },
);

// 34. Same-parent inside-drop where parent has only one child (the
// dragged row itself). N=1, srcIdx=0, toIndex=0 → noop. Synth tree:
// <R> [<P> [<X>]] — drag X inside P.
const treeG = [
  makeNode("R", [
    makeNode("P", [makeNode("X")]),
  ]),
];
checkReason(
  "34: same-parent inside, single-child parent (drag self → noop)",
  resolveTreeDrop(treeG, "X", "P", "inside"),
  /no index change/i,
);

// 35. Cross-parent inside-drop UNCHANGED — sibling target stays
// reparent. treeC: drag A1 inside B (sibling) → reparent into B at
// insertIndex=B.children.length=0.
check(
  "35: cross-parent inside (sibling target) still routes to reparent",
  resolveTreeDrop(treeC, "A1", "B", "inside"),
  { kind: "reparent", oid: "A1", newParentOid: "B", insertIndex: 0 },
);

// 36. Cycle preserved — inside-drop into self-as-target still bails
// "same element" before any branching. (Asymmetric to #11 but locks
// that the new inside-reorder branch doesn't accidentally leak past
// the same-element guard.)
checkReason(
  "36: cycle — drop A inside A (self-target) → same-element bail",
  resolveTreeDrop(treeA, "A", "A", "inside"),
  /same element/i,
);

// 37. Cycle preserved — inside-drop where dragParent has dropParent
// as a descendant (parent IS dragNode). treeC: drag A inside A1
// (descendant of A) — A's parent is R, but dropParent=A1 is INSIDE A,
// so cycle bail still fires. Already covered by #12 but adding the
// explicit "dropParent === dragNode after thirtieth-pass refactor"
// case for symmetry.
checkReason(
  "37: cycle — drop A1 inside A1's own subtree (self) → same-element",
  resolveTreeDrop(treeC, "A1", "A1", "inside"),
  /same element/i,
);

console.log(`\nbench-tree-dnd: ${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
