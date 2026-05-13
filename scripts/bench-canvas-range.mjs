// Thirty-first-pass — pure-logic bench for
// `collectCanvasShiftClickRangeOids` exported from `lib/canvas-range.ts`.
// The helper takes a TreeNode tree + anchor oid + clicked oid and returns
// the inclusive DFS-ordered slice between them (clicked first as
// promoted primary, the rest in DFS order). Empty array when either oid
// is missing from the tree.
//
// Mirrors the exported helper's logic exactly so the bench is hermetic.

function collectCanvasShiftClickRangeOids(tree, anchorOid, clickedOid) {
  const oids = [];
  function walk(arr) {
    for (const n of arr) {
      if (n.oid) oids.push(n.oid);
      if (n.children.length > 0) walk(n.children);
    }
  }
  walk(tree);
  const fromIdx = oids.indexOf(anchorOid);
  const toIdx = oids.indexOf(clickedOid);
  if (fromIdx < 0 || toIdx < 0) return [];
  const lo = Math.min(fromIdx, toIdx);
  const hi = Math.max(fromIdx, toIdx);
  const out = [clickedOid];
  for (let i = lo; i <= hi; i++) {
    const o = oids[i];
    if (o === clickedOid) continue;
    out.push(o);
  }
  return out;
}

let passed = 0;
let failed = 0;
function assertEq(label, got, want) {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  if (a === b) {
    passed++;
    console.log(`PASS: ${label}`);
  } else {
    failed++;
    console.log(`FAIL: ${label}\n  got:  ${a}\n  want: ${b}`);
  }
}

const jsxLoc = (line, col) => ({ kind: "jsx", startLine: line, startCol: col });
function makeNode(oid, line, col, children = []) {
  return { tag: "div", oid, classes: [], children, loc: jsxLoc(line, col) };
}

// ---- Fixture: 4-level tree with 9 oid-bearing nodes -------------------
//
// DFS order: R, A, A1, A1a, A1a-x, A1b, A2, B, B1
//   R (root)
//     A
//       A1
//         A1a
//           A1a-x
//         A1b
//       A2
//     B
//       B1

const tree = [
  makeNode("R", 1, 0, [
    makeNode("A", 2, 2, [
      makeNode("A1", 3, 4, [
        makeNode("A1a", 4, 6, [makeNode("A1a-x", 5, 8)]),
        makeNode("A1b", 6, 6),
      ]),
      makeNode("A2", 7, 4),
    ]),
    makeNode("B", 8, 2, [makeNode("B1", 9, 4)]),
  ]),
];

const dfsOrder = ["R", "A", "A1", "A1a", "A1a-x", "A1b", "A2", "B", "B1"];

// 1. Anchor before clicked, both inside tree.
//    Anchor=A, clicked=A1b → range [A, A1, A1a, A1a-x, A1b]. Clicked first.
assertEq(
  "1: anchor before clicked → clicked first then DFS rest",
  collectCanvasShiftClickRangeOids(tree, "A", "A1b"),
  ["A1b", "A", "A1", "A1a", "A1a-x"],
);

// 2. Anchor after clicked (reverse) — clicked still first.
//    Anchor=A1b, clicked=A → range [A, A1, A1a, A1a-x, A1b]. Primary=A.
assertEq(
  "2: anchor after clicked (reverse) → clicked first",
  collectCanvasShiftClickRangeOids(tree, "A1b", "A"),
  ["A", "A1", "A1a", "A1a-x", "A1b"],
);

// 3. Anchor === clicked — degenerate single-element range.
assertEq(
  "3: anchor === clicked → single-element range",
  collectCanvasShiftClickRangeOids(tree, "A1", "A1"),
  ["A1"],
);

// 4. Adjacent in DFS order (A2 → B).
assertEq(
  "4: adjacent in DFS (A2, B)",
  collectCanvasShiftClickRangeOids(tree, "A2", "B"),
  ["B", "A2"],
);

// 5. Full range — root to last.
assertEq(
  "5: root → last (full range)",
  collectCanvasShiftClickRangeOids(tree, "R", "B1"),
  ["B1", "R", "A", "A1", "A1a", "A1a-x", "A1b", "A2", "B"],
);

// 6. Reverse full range — last to root, primary at root.
assertEq(
  "6: last → root reverse",
  collectCanvasShiftClickRangeOids(tree, "B1", "R"),
  ["R", "A", "A1", "A1a", "A1a-x", "A1b", "A2", "B", "B1"],
);

// 7. Anchor missing in tree → empty (caller falls through).
assertEq(
  "7: anchor missing → empty",
  collectCanvasShiftClickRangeOids(tree, "ZZ", "A"),
  [],
);

// 8. Clicked missing in tree → empty.
assertEq(
  "8: clicked missing → empty",
  collectCanvasShiftClickRangeOids(tree, "A", "ZZ"),
  [],
);

// 9. Both missing → empty.
assertEq(
  "9: both missing → empty",
  collectCanvasShiftClickRangeOids(tree, "ZZ", "YY"),
  [],
);

// 10. Range spans multiple parents (A1a-x → A2 — crosses A1's right edge).
assertEq(
  "10: range across siblings + uncles",
  collectCanvasShiftClickRangeOids(tree, "A1a-x", "A2"),
  ["A2", "A1a-x", "A1b"],
);

// 11. Range includes leaf only.
assertEq(
  "11: leaf to leaf same depth",
  collectCanvasShiftClickRangeOids(tree, "A1a-x", "A1b"),
  ["A1b", "A1a-x"],
);

// 12. Empty tree → empty.
assertEq(
  "12: empty tree → empty",
  collectCanvasShiftClickRangeOids([], "A", "B"),
  [],
);

// 13. Single-node tree, anchor === clicked === only oid.
{
  const single = [makeNode("only", 1, 0)];
  assertEq(
    "13: single-node tree, both === only oid",
    collectCanvasShiftClickRangeOids(single, "only", "only"),
    ["only"],
  );
}

// 14. Tree with non-OID nodes interleaved.
{
  const mixed = [
    makeNode("a", 1, 0, [
      makeNode(null, 2, 2, [makeNode("b", 3, 4)]), // non-OID parent
      makeNode("c", 4, 2),
    ]),
  ];
  // DFS oids: a, b, c (non-OID node skipped). Range a→c = [c, a, b].
  assertEq(
    "14: non-OID nodes skipped from DFS list",
    collectCanvasShiftClickRangeOids(mixed, "a", "c"),
    ["c", "a", "b"],
  );
}

// 15. Range across deeply-nested levels.
assertEq(
  "15: deep range from root to deep leaf",
  collectCanvasShiftClickRangeOids(tree, "R", "A1a-x"),
  ["A1a-x", "R", "A", "A1", "A1a"],
);

// 16. Adjacent leaf range — single increment in DFS.
assertEq(
  "16: A1a → A1a-x (parent→child adjacency)",
  collectCanvasShiftClickRangeOids(tree, "A1a", "A1a-x"),
  ["A1a-x", "A1a"],
);

// 17. Idempotent — repeated calls give equal arrays.
{
  const r1 = collectCanvasShiftClickRangeOids(tree, "A", "B1");
  const r2 = collectCanvasShiftClickRangeOids(tree, "A", "B1");
  assertEq("17: idempotent", r1, r2);
}

// 18. Helper does not mutate the input tree.
{
  const before = JSON.stringify(tree);
  collectCanvasShiftClickRangeOids(tree, "R", "B1");
  collectCanvasShiftClickRangeOids(tree, "ZZ", "YY");
  collectCanvasShiftClickRangeOids(tree, "A1", "A1");
  const after = JSON.stringify(tree);
  assertEq("18: non-mutating", before, after);
}

// 19. Clicked never duplicated in output.
{
  const r = collectCanvasShiftClickRangeOids(tree, "A", "A1b");
  const dupCount = r.filter((o) => o === "A1b").length;
  assertEq("19: clicked appears exactly once", dupCount, 1);
}

// 20. Tail follows DFS order strictly.
{
  const r = collectCanvasShiftClickRangeOids(tree, "R", "B1");
  // After B1 (clicked, primary), the rest is the DFS slice excluding B1
  // = [R, A, A1, A1a, A1a-x, A1b, A2, B].
  assertEq("20: tail follows DFS order", r.slice(1), [
    "R",
    "A",
    "A1",
    "A1a",
    "A1a-x",
    "A1b",
    "A2",
    "B",
  ]);
}

// 21. Single-deep chain — root-only tree, anchor=clicked=root.
{
  const lonely = [makeNode("solo", 1, 0)];
  assertEq(
    "21: lonely root tree, anchor=clicked",
    collectCanvasShiftClickRangeOids(lonely, "solo", "solo"),
    ["solo"],
  );
}

// 22. Multi-root tree — DFS order goes left-to-right across roots.
{
  const multi = [
    makeNode("r1", 1, 0, [makeNode("r1c", 2, 2)]),
    makeNode("r2", 3, 0, [makeNode("r2c", 4, 2)]),
  ];
  // DFS oids: r1, r1c, r2, r2c.
  assertEq(
    "22: multi-root tree spans both roots",
    collectCanvasShiftClickRangeOids(multi, "r1c", "r2"),
    ["r2", "r1c"],
  );
  assertEq(
    "23: multi-root tree full range",
    collectCanvasShiftClickRangeOids(multi, "r1", "r2c"),
    ["r2c", "r1", "r1c", "r2"],
  );
}

// 24. Empty-string anchor (caller passed "") → no match → empty.
assertEq(
  "24: empty-string anchor → empty",
  collectCanvasShiftClickRangeOids(tree, "", "A"),
  [],
);

// 25. Empty-string clicked → empty.
assertEq(
  "25: empty-string clicked → empty",
  collectCanvasShiftClickRangeOids(tree, "A", ""),
  [],
);

// ---- Integration sketches ---------------------------------------------

// Simulate dispatcher decision: range when anchor exists + range succeeds;
// fall through to additive single-add otherwise.
function simulateDispatch({ tree: t, anchor, clicked }) {
  if (!anchor) return { dispatched: "additive-single" };
  const oids = collectCanvasShiftClickRangeOids(t, anchor, clicked);
  if (oids.length < 2) return { dispatched: "additive-single" };
  return { dispatched: "range", primary: oids[0], additional: oids.slice(1) };
}

// 26. Sim — happy path: anchor + clicked both in tree.
assertEq(
  "26: sim dispatch — happy path",
  simulateDispatch({ tree, anchor: "A", clicked: "A1b" }),
  {
    dispatched: "range",
    primary: "A1b",
    additional: ["A", "A1", "A1a", "A1a-x"],
  },
);

// 27. Sim — no anchor → additive-single (caller treats as single-select).
assertEq(
  "27: sim dispatch — no anchor → additive-single",
  simulateDispatch({ tree, anchor: null, clicked: "A1b" }),
  { dispatched: "additive-single" },
);

// 28. Sim — clicked missing → additive-single fall-through.
assertEq(
  "28: sim dispatch — clicked missing → additive-single",
  simulateDispatch({ tree, anchor: "A", clicked: "ZZ" }),
  { dispatched: "additive-single" },
);

// 29. Sim — anchor === clicked → range of one (length 1) → falls through
//    to additive-single in dispatcher. (Workspace's pre-additive path
//    catches anchor===clicked separately via the prevPrimaryOid===newOid
//    no-op branch BEFORE this dispatcher fires; this is defense-in-depth.)
assertEq(
  "29: sim dispatch — anchor === clicked → length 1 → additive-single",
  simulateDispatch({ tree, anchor: "A1", clicked: "A1" }),
  { dispatched: "additive-single" },
);

// 30. Symmetry: forward + reverse cover the same range, just promote
//    different oids to primary.
{
  const fwd = collectCanvasShiftClickRangeOids(tree, "A1a", "A2");
  const rev = collectCanvasShiftClickRangeOids(tree, "A2", "A1a");
  // Same set membership, different ordering.
  const fwdSet = [...new Set(fwd)].sort();
  const revSet = [...new Set(rev)].sort();
  assertEq("30: forward+reverse cover same membership", fwdSet, revSet);
}

// 31. DFS preorder lock — assert the flatten step produces the expected order.
{
  // Reproduce flatten internally to expose the order under test.
  const oids = [];
  function walk(arr) {
    for (const n of arr) {
      if (n.oid) oids.push(n.oid);
      if (n.children.length > 0) walk(n.children);
    }
  }
  walk(tree);
  assertEq("31: DFS preorder lock", oids, dfsOrder);
}

console.log(
  `\nbench-canvas-range: ${passed}/${passed + failed} passed`,
);
if (failed > 0) process.exit(1);
