// Thirtieth-pass — pure-logic bench for `collectExpandToDepth` exported
// from `components/ElementTree.tsx`. The helper takes a tree + maxDepth
// and returns the set of `nodeKey(n)` values that should be in the
// `expanded` set so the rail shows down to depth `maxDepth`. A depth of
// N expands containers at depths 0..N-1 (their children become visible
// at depth N). depth=0 → empty set (nothing expanded; tree shows only
// top-level rows). depth=∞ (e.g. 99) → expand-all.
//
// Mirrors the exported helper's logic exactly so the bench is hermetic.

function locKey(loc) {
  if (loc.kind === "jsx") {
    return `jsx:${loc.startLine}:${loc.startCol}`;
  }
  return `html:${loc.path.join(".")}`;
}

function nodeKey(n) {
  return n.oid ? `oid:${n.oid}` : locKey(n.loc);
}

function collectExpandToDepth(nodes, maxDepth) {
  const out = new Set();
  if (maxDepth <= 0) return out;
  function walk(arr, depth) {
    if (depth >= maxDepth) return;
    for (const n of arr) {
      if (n.children.length > 0) {
        out.add(nodeKey(n));
        walk(n.children, depth + 1);
      }
    }
  }
  walk(nodes, 0);
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
function assertSameSet(label, got, want) {
  // Order-independent set comparison.
  const ga = [...got].sort();
  const wa = [...want].sort();
  assertEq(label, ga, wa);
}

const jsxLoc = (line, col) => ({ kind: "jsx", startLine: line, startCol: col });
function makeNode(oid, line, col, children = []) {
  return { tag: "div", oid, classes: [], children, loc: jsxLoc(line, col) };
}

// ---- Fixture: 4-level deep tree ---------------------------------------
//
// R (root, depth 0)
//   ├ A (depth 1) [container]
//   │   ├ A1 (depth 2) [container]
//   │   │   ├ A1a (depth 3) [container]
//   │   │   │   └ A1a-x (depth 4, leaf)
//   │   │   └ A1b (depth 3, leaf)
//   │   └ A2 (depth 2, leaf)
//   └ B (depth 1) [container]
//       └ B1 (depth 2, leaf)
//
// Container nodes: R, A, A1, A1a, B
// Leaf nodes: A1a-x, A1b, A2, B1

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

const KEY = {
  R: "oid:R",
  A: "oid:A",
  A1: "oid:A1",
  A1a: "oid:A1a",
  A1ax: "oid:A1a-x",
  A1b: "oid:A1b",
  A2: "oid:A2",
  B: "oid:B",
  B1: "oid:B1",
};

// 1. depth = 0 → empty set (everything collapsed; only top-level rows
//    visible). Top-level rows themselves don't need to be in the
//    expanded set — they're always rendered.
assertSameSet("1: depth=0 → empty set", collectExpandToDepth(tree, 0), []);

// 2. depth = 1 → expand R only (its children A, B become visible).
assertSameSet("2: depth=1 → R only", collectExpandToDepth(tree, 1), [KEY.R]);

// 3. depth = 2 → expand R + A + B (their children visible at depth 2).
assertSameSet(
  "3: depth=2 → R + A + B",
  collectExpandToDepth(tree, 2),
  [KEY.R, KEY.A, KEY.B],
);

// 4. depth = 3 → adds A1 (container at depth 2). B1 is a leaf — not added.
assertSameSet(
  "4: depth=3 → R + A + A1 + B (B1 leaf excluded)",
  collectExpandToDepth(tree, 3),
  [KEY.R, KEY.A, KEY.A1, KEY.B],
);

// 5. depth = 4 → adds A1a (container at depth 3).
assertSameSet(
  "5: depth=4 → adds A1a",
  collectExpandToDepth(tree, 4),
  [KEY.R, KEY.A, KEY.A1, KEY.A1a, KEY.B],
);

// 6. depth = 5 → no new containers (A1a-x is leaf). Same as depth=4.
assertSameSet(
  "6: depth=5 → no new containers (cap)",
  collectExpandToDepth(tree, 5),
  [KEY.R, KEY.A, KEY.A1, KEY.A1a, KEY.B],
);

// 7. depth = 99 → fully expanded (every container).
assertSameSet(
  "7: depth=99 → expand-all (every container)",
  collectExpandToDepth(tree, 99),
  [KEY.R, KEY.A, KEY.A1, KEY.A1a, KEY.B],
);

// 8. Negative depth → empty set (early return before walk).
assertSameSet(
  "8: depth=-1 → empty",
  collectExpandToDepth(tree, -1),
  [],
);

// 9. depth fractional → behaves like floor (Math.floor on natural number
//    truncation; depth >= maxDepth check). 1.9 truncates ops only at
//    `>=` so 1.9 expands depth=0, depth=1 but not depth=2 (since 2>=1.9
//    bails). Same as depth=2.
assertSameSet(
  "9: depth=1.9 → like depth=2 (since 0 and 1 are both < 1.9)",
  collectExpandToDepth(tree, 1.9),
  [KEY.R, KEY.A, KEY.B],
);

// 10. Empty tree → empty set regardless of depth.
assertSameSet(
  "10: empty tree → empty",
  collectExpandToDepth([], 5),
  [],
);

// 11. Single-node tree (no children) → empty set (nothing to expand).
assertSameSet(
  "11: single leaf → empty",
  collectExpandToDepth([makeNode("X", 1, 0)], 5),
  [],
);

// 12. Single-node tree (one child) → root is expanded for depth>=1.
assertSameSet(
  "12: single container with one child, depth=1 → root only",
  collectExpandToDepth(
    [makeNode("X", 1, 0, [makeNode("Y", 2, 2)])],
    1,
  ),
  ["oid:X"],
);

// 13. Multi-root tree — both roots expanded at depth>=1.
{
  const multi = [
    makeNode("R1", 1, 0, [makeNode("a", 2, 2)]),
    makeNode("R2", 3, 0, [makeNode("b", 4, 2)]),
  ];
  assertSameSet(
    "13: multi-root depth=1 → both roots expanded",
    collectExpandToDepth(multi, 1),
    ["oid:R1", "oid:R2"],
  );
}

// 14. Top-level leaf node alongside container — container expanded,
//     leaf gets nothing.
{
  const mixed = [
    makeNode("X", 1, 0), // leaf
    makeNode("Y", 2, 0, [makeNode("Y1", 3, 2)]), // container
  ];
  assertSameSet(
    "14: top-level leaf + container — only container in set",
    collectExpandToDepth(mixed, 1),
    ["oid:Y"],
  );
}

// 15. Asymmetric depths — branches at different depths each follow
//     their own depth count.
{
  // R [A [A1 [A1a]] B]
  //   - A1 is depth 2; its child A1a is depth 3.
  //   - B is depth 1 (leaf).
  // depth=2 expands R+A only; A1 (depth 2) is NOT in set (would need
  // depth>=3 to reveal A1a).
  const asym = [
    makeNode("R", 1, 0, [
      makeNode("A", 2, 2, [
        makeNode("A1", 3, 4, [makeNode("A1a", 4, 6)]),
      ]),
      makeNode("B", 5, 2),
    ]),
  ];
  assertSameSet(
    "15: asymmetric branches — depth=2 stops before A1",
    collectExpandToDepth(asym, 2),
    ["oid:R", "oid:A"],
  );
  assertSameSet(
    "15b: asymmetric branches — depth=3 includes A1",
    collectExpandToDepth(asym, 3),
    ["oid:R", "oid:A", "oid:A1"],
  );
}

// 16. Nodes without OID get loc-based key. depth=2 → use locKey for the
//     OID-less container.
{
  const noOid = [
    makeNode(null, 1, 0, [makeNode("a", 2, 2)]),
  ];
  assertSameSet(
    "16: oid-less container → loc-keyed expansion",
    collectExpandToDepth(noOid, 1),
    ["jsx:1:0"],
  );
}

// 17. Nested oid-less containers — both get loc-keyed.
{
  const noOid = [
    makeNode(null, 1, 0, [makeNode(null, 2, 2, [makeNode("X", 3, 4)])]),
  ];
  assertSameSet(
    "17: nested oid-less → all loc-keyed at depth>=2",
    collectExpandToDepth(noOid, 2),
    ["jsx:1:0", "jsx:2:2"],
  );
}

// 18. Helper does not mutate the input tree.
{
  const before = JSON.stringify(tree);
  collectExpandToDepth(tree, 0);
  collectExpandToDepth(tree, 5);
  collectExpandToDepth(tree, 99);
  const after = JSON.stringify(tree);
  assertEq("18: non-mutating", before, after);
}

// 19. Idempotence — same args give equal sets.
{
  const r1 = collectExpandToDepth(tree, 3);
  const r2 = collectExpandToDepth(tree, 3);
  assertEq("19: idempotent", [...r1].sort(), [...r2].sort());
}

// 20. Returns a fresh Set each call (not aliased internally).
{
  const r1 = collectExpandToDepth(tree, 3);
  const r2 = collectExpandToDepth(tree, 3);
  // Mutate r1; r2 should be unaffected.
  r1.add("garbage");
  assertEq(
    "20: returns fresh Set per call",
    [...r2].sort(),
    [KEY.R, KEY.A, KEY.A1, KEY.B].sort(),
  );
}

// 21. Default expand depth (DEFAULT_EXPAND_DEPTH = 2) parity — calling
//     with maxDepth=2 should produce the same set as the existing
//     auto-expand-on-first-tree effect would.
//     For the fixture tree, default expand at depth=2 → R + A + B.
assertSameSet(
  "21: matches DEFAULT_EXPAND_DEPTH behavior (depth=2)",
  collectExpandToDepth(tree, 2),
  [KEY.R, KEY.A, KEY.B],
);

// 22. Containers count = the result set size (every node in the result
//     is a container; vice versa).
{
  const r = collectExpandToDepth(tree, 99);
  // Total containers in the fixture: R, A, A1, A1a, B = 5.
  assertEq("22: result-set size matches container count at full expand", r.size, 5);
}

// 23. Sub-tree containment — depth=N's set is a subset of depth=(N+1)'s.
{
  const d1 = collectExpandToDepth(tree, 1);
  const d2 = collectExpandToDepth(tree, 2);
  const d3 = collectExpandToDepth(tree, 3);
  const isSubset = (a, b) => {
    for (const x of a) if (!b.has(x)) return false;
    return true;
  };
  assertEq("23a: d1 ⊆ d2", isSubset(d1, d2), true);
  assertEq("23b: d2 ⊆ d3", isSubset(d2, d3), true);
}

// 24. Wide tree — root with 5 children, all leaves. depth=1 → root only.
{
  const wide = [
    makeNode("R", 1, 0, [
      makeNode("a", 2, 2),
      makeNode("b", 3, 2),
      makeNode("c", 4, 2),
      makeNode("d", 5, 2),
      makeNode("e", 6, 2),
    ]),
  ];
  assertSameSet(
    "24: wide tree, depth=1 → root only (no leaf children get added)",
    collectExpandToDepth(wide, 1),
    ["oid:R"],
  );
}

// 25. Container under leaf chain — nope, each child can be either, mix.
//     R [A (leaf) B [B1 (leaf) B2 [B2a]]]. depth=2 → R + B. depth=3 → +B2.
{
  const mix = [
    makeNode("R", 1, 0, [
      makeNode("A", 2, 2),
      makeNode("B", 3, 2, [
        makeNode("B1", 4, 4),
        makeNode("B2", 5, 4, [makeNode("B2a", 6, 6)]),
      ]),
    ]),
  ];
  assertSameSet(
    "25: mixed leaf+container at depth 1 → only container expanded",
    collectExpandToDepth(mix, 2),
    ["oid:R", "oid:B"],
  );
  assertSameSet(
    "25b: depth=3 adds B2 (only container at depth 2)",
    collectExpandToDepth(mix, 3),
    ["oid:R", "oid:B", "oid:B2"],
  );
}

// 26. depth=Infinity behaves like fully-expanded. Verifies the comparison
//     `depth >= maxDepth` doesn't overflow with non-finite numbers.
assertSameSet(
  "26: depth=Infinity → expand-all",
  collectExpandToDepth(tree, Infinity),
  [KEY.R, KEY.A, KEY.A1, KEY.A1a, KEY.B],
);

// ---- Thirtieth-pass (j) — row-scoped wrapper composition --------------
//
// The row-scoped variant lives in ElementTree as a thin wrapper around
// `collectExpandToDepth([rootNode], depth)` plus a union with the
// existing expanded set. Bench cases below mirror the wrapper's logic
// inline so the contract is locked.

function findNodeByOid(arr, oid) {
  for (const n of arr) {
    if (n.oid === oid) return n;
    if (n.children.length > 0) {
      const r = findNodeByOid(n.children, oid);
      if (r) return r;
    }
  }
  return null;
}

function expandSubtreeToDepth(tree, rootOid, depth, existing) {
  const root = findNodeByOid(tree, rootOid);
  if (!root) return new Set(existing);
  const additions = collectExpandToDepth([root], depth);
  return new Set([...existing, ...additions]);
}

// 27. Subtree expand from a mid-level node — should include the root
//     and one level of its children. depth=2 from root A: A + A1 (the
//     containers within A's subtree at depth<=1). A2 is a leaf.
assertSameSet(
  "27: subtree from A depth=2 → A + A1",
  expandSubtreeToDepth(tree, "A", 2, new Set()),
  ["oid:A", "oid:A1"],
);

// 28. Subtree expand from leaf → empty (no containers in subtree).
assertSameSet(
  "28: subtree from leaf A2 → empty",
  expandSubtreeToDepth(tree, "A2", 5, new Set()),
  [],
);

// 29. Subtree expand from A depth=1 → A only.
assertSameSet(
  "29: subtree from A depth=1 → A only",
  expandSubtreeToDepth(tree, "A", 1, new Set()),
  ["oid:A"],
);

// 30. Subtree expand preserves existing user expansions outside the
//     subtree. existing={B} + subtree-from-A-depth=2 = {A, A1, B}.
assertSameSet(
  "30: subtree expand is additive (preserves existing outside)",
  expandSubtreeToDepth(tree, "A", 2, new Set(["oid:B"])),
  ["oid:A", "oid:A1", "oid:B"],
);

// 31. Subtree expand on already-expanded subtree is a no-op vs existing.
//     existing={A, A1, B} + subtree-from-A-depth=2 = same set.
{
  const before = new Set(["oid:A", "oid:A1", "oid:B"]);
  const after = expandSubtreeToDepth(tree, "A", 2, before);
  assertSameSet("31: idempotent on already-expanded subtree", after, [
    "oid:A",
    "oid:A1",
    "oid:B",
  ]);
}

// 32. Subtree expand with stale rootOid (not in tree) → preserves
//     existing unchanged. Important for the right-click-after-rebuild
//     edge case.
assertSameSet(
  "32: stale rootOid → existing preserved (no crash)",
  expandSubtreeToDepth(tree, "MISSING", 3, new Set(["oid:R", "oid:B"])),
  ["oid:R", "oid:B"],
);

// 33. Subtree expand from the root itself (R) at depth=99 → full
//     expansion (matches tree-wide expand at depth=99).
assertSameSet(
  "33: subtree from R depth=99 → equivalent to tree-wide expand-all",
  expandSubtreeToDepth(tree, "R", 99, new Set()),
  [KEY.R, KEY.A, KEY.A1, KEY.A1a, KEY.B],
);

// 34. Subtree expand — only adds containers within subtree, never above.
//     existing={} + subtree-from-A1a-depth=99 = {A1a} (just the root of
//     the subtree, since A1a-x is its only child and is a leaf). A1's
//     parent A is NOT added — subtree expand doesn't walk upward.
assertSameSet(
  "34: subtree never walks ancestors",
  expandSubtreeToDepth(tree, "A1a", 99, new Set()),
  ["oid:A1a"],
);

console.log(`\nbench-tree-expand-depth: ${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
