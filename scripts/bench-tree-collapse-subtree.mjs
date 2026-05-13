// Thirty-first-pass — pure-logic bench for `collectCollapseSubtreeKeys`
// exported from `components/ElementTree.tsx`. The helper takes a tree
// + rootOid and returns the set of `nodeKey(n)` values to REMOVE from
// the existing `expanded` set so the entire subtree under (and
// including) rootOid collapses. Symmetric with the chunk-j additive
// expand-subtree but destructive (caller does set-difference instead of
// set-union).
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

function collectCollapseSubtreeKeys(tree, rootOid) {
  let rootNode = null;
  function walk(arr) {
    for (const n of arr) {
      if (rootNode) return;
      if (n.oid === rootOid) {
        rootNode = n;
        return;
      }
      if (n.children.length > 0) walk(n.children);
    }
  }
  walk(tree);
  if (!rootNode) return new Set();
  return collectExpandToDepth([rootNode], Number.POSITIVE_INFINITY);
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
  const ga = [...got].sort();
  const wa = [...want].sort();
  assertEq(label, ga, wa);
}

const jsxLoc = (line, col) => ({ kind: "jsx", startLine: line, startCol: col });
function makeNode(oid, line, col, children = []) {
  return { tag: "div", oid, classes: [], children, loc: jsxLoc(line, col) };
}

// ---- Fixture: 4-level tree --------------------------------------------
//
// R (root, container)
//   ├ A [container]
//   │   ├ A1 [container]
//   │   │   ├ A1a [container]
//   │   │   │   └ A1a-x (leaf)
//   │   │   └ A1b (leaf)
//   │   └ A2 (leaf)
//   └ B [container]
//       └ B1 (leaf)
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

// 1. Collapse subtree under A1a → only A1a is a container in that
//    subtree (its only child A1a-x is a leaf), so result = {oid:A1a}.
assertSameSet(
  "1: collapse leaf-parent subtree (A1a) → just root container",
  collectCollapseSubtreeKeys(tree, "A1a"),
  ["oid:A1a"],
);

// 2. Collapse subtree under A1 → A1, A1a (A1b leaf, A2 leaf are skipped).
assertSameSet(
  "2: collapse mid-level subtree (A1) → A1 + A1a",
  collectCollapseSubtreeKeys(tree, "A1"),
  ["oid:A1", "oid:A1a"],
);

// 3. Collapse subtree under A → A, A1, A1a (A2 is leaf).
assertSameSet(
  "3: collapse A subtree → A + A1 + A1a",
  collectCollapseSubtreeKeys(tree, "A"),
  ["oid:A", "oid:A1", "oid:A1a"],
);

// 4. Collapse subtree under R (root) → everything: R, A, A1, A1a, B.
assertSameSet(
  "4: collapse from root → every container key",
  collectCollapseSubtreeKeys(tree, "R"),
  ["oid:R", "oid:A", "oid:A1", "oid:A1a", "oid:B"],
);

// 5. Collapse subtree under B → just B (B1 is leaf).
assertSameSet(
  "5: collapse single-child container B",
  collectCollapseSubtreeKeys(tree, "B"),
  ["oid:B"],
);

// 6. Collapse subtree under a LEAF node (A1a-x) → empty (no containers
//    in a leaf's subtree).
assertEq(
  "6: collapse leaf node → empty set",
  [...collectCollapseSubtreeKeys(tree, "A1a-x")],
  [],
);

// 7. Stale rootOid (no match in tree) → empty set.
assertEq(
  "7: stale rootOid → empty set",
  [...collectCollapseSubtreeKeys(tree, "ZZ")],
  [],
);

// 8. Empty tree → empty set.
assertEq(
  "8: empty tree → empty set",
  [...collectCollapseSubtreeKeys([], "A")],
  [],
);

// 9. Empty-string oid → no match → empty.
assertEq(
  "9: empty-string oid → empty set",
  [...collectCollapseSubtreeKeys(tree, "")],
  [],
);

// ---- Symmetry with collectExpandToDepth -------------------------------

// 10. Collapse-subtree-from-root === collectExpandToDepth(tree, Infinity)
//     EXCEPT only when there's a single root with oid. Locks the
//     equivalence: collapsing from R should give the same set as expand-all.
{
  const collapse = collectCollapseSubtreeKeys(tree, "R");
  const expandAll = collectExpandToDepth(tree, Number.POSITIVE_INFINITY);
  assertSameSet(
    "10: collapse-from-root === expand-all keyset",
    [...collapse],
    [...expandAll],
  );
}

// ---- Set-difference simulation (caller pattern) ----------------------

// 11. Apply a fresh `expanded` (everything expanded) minus
//     collectCollapseSubtreeKeys(tree, "A") → only R + B + A1a remain
//     after subtraction (subtree A1, A1a were under A; B is sibling).
//     Wait — let me think. Initial expanded = {R, A, A1, A1a, B}.
//     Subtree under A (including A) = {A, A1, A1a}. Result = {R, B}.
{
  const initialExpanded = new Set([
    "oid:R",
    "oid:A",
    "oid:A1",
    "oid:A1a",
    "oid:B",
  ]);
  const subtract = collectCollapseSubtreeKeys(tree, "A");
  const result = new Set(initialExpanded);
  for (const k of subtract) result.delete(k);
  assertSameSet("11: set-difference removes A subtree only", [...result], [
    "oid:R",
    "oid:B",
  ]);
}

// 12. Set-difference is destructive (collapse from root removes everything).
{
  const initialExpanded = new Set([
    "oid:R",
    "oid:A",
    "oid:A1",
    "oid:A1a",
    "oid:B",
  ]);
  const subtract = collectCollapseSubtreeKeys(tree, "R");
  const result = new Set(initialExpanded);
  for (const k of subtract) result.delete(k);
  assertEq("12: collapse-from-root subtraction empties expanded", [...result], []);
}

// 13. Collapse subtree under A leaves R + B's subtree intact (B was
//     already expanded; subtract doesn't touch it).
{
  const initialExpanded = new Set(["oid:R", "oid:B"]);
  const subtract = collectCollapseSubtreeKeys(tree, "A"); // {A, A1, A1a}
  const result = new Set(initialExpanded);
  for (const k of subtract) result.delete(k);
  assertSameSet(
    "13: collapsing A doesn't touch R or B (already-expanded outsiders)",
    [...result],
    ["oid:R", "oid:B"],
  );
}

// ---- Stability + non-mutation ----------------------------------------

// 14. Helper does not mutate input tree.
{
  const before = JSON.stringify(tree);
  collectCollapseSubtreeKeys(tree, "A");
  collectCollapseSubtreeKeys(tree, "ZZ");
  collectCollapseSubtreeKeys(tree, "R");
  const after = JSON.stringify(tree);
  assertEq("14: non-mutating", before, after);
}

// 15. Idempotent — repeated calls return equal sets.
{
  const r1 = collectCollapseSubtreeKeys(tree, "A");
  const r2 = collectCollapseSubtreeKeys(tree, "A");
  assertSameSet("15: idempotent", [...r1], [...r2]);
}

// 16. Fresh Set returned per call — caller can mutate freely.
{
  const r1 = collectCollapseSubtreeKeys(tree, "A");
  const r2 = collectCollapseSubtreeKeys(tree, "A");
  if (r1 === r2) {
    failed++;
    console.log(`FAIL: 16: fresh Set per call — got same reference`);
  } else {
    passed++;
    console.log(`PASS: 16: fresh Set per call`);
  }
}

// ---- Edge-case branches -----------------------------------------------

// 17. Single-leaf tree (one root with no children) → empty for any oid.
{
  const single = [makeNode("solo", 1, 0)];
  assertEq(
    "17: single-leaf root → empty set",
    [...collectCollapseSubtreeKeys(single, "solo")],
    [],
  );
}

// 18. Single-container tree (root with one leaf child).
{
  const small = [makeNode("p", 1, 0, [makeNode("c", 2, 2)])];
  assertSameSet(
    "18: single-container root + leaf child",
    [...collectCollapseSubtreeKeys(small, "p")],
    ["oid:p"],
  );
}

// 19. Multi-root tree, oid matches second root.
{
  const multi = [
    makeNode("r1", 1, 0, [makeNode("r1c", 2, 2)]),
    makeNode("r2", 3, 0, [makeNode("r2c", 4, 2, [makeNode("r2cc", 5, 4)])]),
  ];
  assertSameSet(
    "19: multi-root, target r2 subtree → r2 + r2c",
    [...collectCollapseSubtreeKeys(multi, "r2")],
    ["oid:r2", "oid:r2c"],
  );
}

// 20. Multi-root tree, oid matches deep node in second root.
{
  const multi = [
    makeNode("r1", 1, 0, [makeNode("r1c", 2, 2)]),
    makeNode("r2", 3, 0, [makeNode("r2c", 4, 2, [makeNode("r2cc", 5, 4)])]),
  ];
  assertSameSet(
    "20: multi-root, target r2c → just r2c",
    [...collectCollapseSubtreeKeys(multi, "r2c")],
    ["oid:r2c"],
  );
}

// 21. OID-less containers — the helper uses nodeKey() so loc-based keys
//     work too. Locks that the helper doesn't crash on null oid containers.
{
  const noOid = [
    makeNode("a", 1, 0, [
      makeNode(null, 2, 2, [makeNode("c", 3, 4)]), // OID-less mid-tree
    ]),
  ];
  // Walks past the OID-less container (it doesn't match rootOid="a") into
  // its descendants; collapsing under "a" includes BOTH "a" + the OID-less
  // mid container (it's a container with children).
  assertSameSet(
    "21: OID-less containers contribute loc keys to subtree",
    [...collectCollapseSubtreeKeys(noOid, "a")],
    ["oid:a", "jsx:2:2"],
  );
}

// 22. Walk-bail-on-found: helper finds rootNode and returns immediately;
//     doesn't walk siblings of the matching node. This is a behaviour
//     lock — the helper should be O(n) at worst.
{
  // Deeply nested tree where the target is on the LEFT branch.
  // If the helper kept walking after finding, it'd accumulate B's keys
  // too (which it shouldn't).
  const t = [
    makeNode("root", 1, 0, [
      makeNode("L", 2, 2, [makeNode("L1", 3, 4)]),
      makeNode("R", 4, 2, [makeNode("R1", 5, 4)]),
    ]),
  ];
  assertSameSet(
    "22: walk bails on first match (L not R)",
    [...collectCollapseSubtreeKeys(t, "L")],
    ["oid:L"],
  );
}

console.log(
  `\nbench-tree-collapse-subtree: ${passed}/${passed + failed} passed`,
);
if (failed > 0) process.exit(1);
