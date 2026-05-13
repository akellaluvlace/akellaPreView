// Thirtieth-pass — pure-logic bench for `collectShiftClickRangeOids`
// exported from `components/ElementTree.tsx`. The helper takes the
// visibleRows shape (key + oid) plus an anchor key (current primary in
// tree) plus a clicked key (the just-shift-clicked row) and returns the
// inclusive DFS-ordered slice of oids — clicked first (promoted to
// primary), the rest in DFS order — filtered to OID-bearing rows. Falls
// back to empty when either key isn't in the visible rows OR the
// clicked row has no oid (HTML-mode rows etc.).
//
// Mirrors the exported helper's logic exactly so the bench is hermetic.

function collectShiftClickRangeOids(visibleRows, anchorKey, clickedKey) {
  const fromIdx = visibleRows.findIndex((r) => r.key === anchorKey);
  const toIdx = visibleRows.findIndex((r) => r.key === clickedKey);
  if (fromIdx < 0 || toIdx < 0) return [];
  const clickedOid = visibleRows[toIdx].oid;
  if (!clickedOid) return [];
  const lo = Math.min(fromIdx, toIdx);
  const hi = Math.max(fromIdx, toIdx);
  const out = [clickedOid];
  for (let i = lo; i <= hi; i++) {
    const r = visibleRows[i];
    if (r.key === clickedKey) continue;
    if (!r.oid) continue;
    out.push(r.oid);
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

// ---- Fixture: 6 visible rows, all oid-bearing -------------------------

const rowsAllOid = [
  { key: "oid:a", oid: "a" },
  { key: "oid:b", oid: "b" },
  { key: "oid:c", oid: "c" },
  { key: "oid:d", oid: "d" },
  { key: "oid:e", oid: "e" },
  { key: "oid:f", oid: "f" },
];

// 1. Anchor before clicked — typical "select forward" gesture.
//    Anchor=B, clicked=E → range [B, C, D, E]. Clicked first.
assertEq(
  "1: anchor before clicked → clicked first then DFS rest",
  collectShiftClickRangeOids(rowsAllOid, "oid:b", "oid:e"),
  ["e", "b", "c", "d"],
);

// 2. Anchor after clicked — reverse gesture.
//    Anchor=E, clicked=B → range [B, C, D, E]. Clicked first.
assertEq(
  "2: anchor after clicked (reverse) → clicked first",
  collectShiftClickRangeOids(rowsAllOid, "oid:e", "oid:b"),
  ["b", "c", "d", "e"],
);

// 3. Anchor === clicked — degenerate range of one row.
//    Output = [clickedOid] alone.
assertEq(
  "3: anchor === clicked → single-element range",
  collectShiftClickRangeOids(rowsAllOid, "oid:c", "oid:c"),
  ["c"],
);

// 4. Adjacent rows.
assertEq(
  "4: adjacent rows (anchor B, clicked C)",
  collectShiftClickRangeOids(rowsAllOid, "oid:b", "oid:c"),
  ["c", "b"],
);

// 5. First-to-last range — entire visible list.
assertEq(
  "5: first → last (entire range)",
  collectShiftClickRangeOids(rowsAllOid, "oid:a", "oid:f"),
  ["f", "a", "b", "c", "d", "e"],
);

// 6. Last-to-first reverse — entire visible list, primary at first.
assertEq(
  "6: last → first reverse → primary at first",
  collectShiftClickRangeOids(rowsAllOid, "oid:f", "oid:a"),
  ["a", "b", "c", "d", "e", "f"],
);

// 7. Anchor not in visible rows → empty (caller falls through).
assertEq(
  "7: anchor missing → empty",
  collectShiftClickRangeOids(rowsAllOid, "oid:zz", "oid:c"),
  [],
);

// 8. Clicked not in visible rows → empty.
assertEq(
  "8: clicked missing → empty",
  collectShiftClickRangeOids(rowsAllOid, "oid:c", "oid:zz"),
  [],
);

// 9. Both missing → empty.
assertEq(
  "9: both missing → empty",
  collectShiftClickRangeOids(rowsAllOid, "oid:zz", "oid:yy"),
  [],
);

// ---- Fixture: oid-less rows interleaved (HTML-mode-style) -------------

const rowsMixed = [
  { key: "oid:a", oid: "a" },
  { key: "html:1.0", oid: null }, // oid-less row in middle of range
  { key: "oid:c", oid: "c" },
  { key: "html:2.0", oid: null },
  { key: "oid:e", oid: "e" },
];

// 10. Range over oid-less rows — only oid-bearing rows in output.
assertEq(
  "10: range crosses oid-less rows → filtered out",
  collectShiftClickRangeOids(rowsMixed, "oid:a", "oid:e"),
  ["e", "a", "c"],
);

// 11. Clicked row has no oid → empty (can't promote to primary).
assertEq(
  "11: clicked row has no oid → empty",
  collectShiftClickRangeOids(rowsMixed, "oid:a", "html:1.0"),
  [],
);

// 12. Anchor row has no oid but clicked has oid → range still computes.
//     Anchor=html:1.0, clicked=C → range [html:1.0, C]. Clicked first.
//     Filter drops html:1.0; output = [C].
assertEq(
  "12: anchor oid-less, clicked oid-bearing → only oid-bearing rows",
  collectShiftClickRangeOids(rowsMixed, "html:1.0", "oid:c"),
  ["c"],
);

// 13. Reverse: anchor C, clicked html:1.0 (no oid) → empty.
assertEq(
  "13: clicked oid-less reversed → empty",
  collectShiftClickRangeOids(rowsMixed, "oid:c", "html:1.0"),
  [],
);

// ---- Empty / boundary cases -------------------------------------------

// 14. Empty visible rows list.
assertEq(
  "14: empty rows → empty",
  collectShiftClickRangeOids([], "oid:a", "oid:b"),
  [],
);

// 15. Single-row visible list, anchor === clicked === only row.
assertEq(
  "15: single-row list → returns that one row",
  collectShiftClickRangeOids([{ key: "oid:x", oid: "x" }], "oid:x", "oid:x"),
  ["x"],
);

// 16. Single-row visible list, anchor matches but clicked doesn't.
assertEq(
  "16: single-row list, clicked missing → empty",
  collectShiftClickRangeOids(
    [{ key: "oid:x", oid: "x" }],
    "oid:x",
    "oid:y",
  ),
  [],
);

// ---- Stability & dedupe -----------------------------------------------

// 17. Idempotent — repeated calls give equal arrays.
{
  const r1 = collectShiftClickRangeOids(rowsAllOid, "oid:b", "oid:e");
  const r2 = collectShiftClickRangeOids(rowsAllOid, "oid:b", "oid:e");
  assertEq("17: idempotent", r1, r2);
}

// 18. Helper does not mutate the input rows.
{
  const before = JSON.stringify(rowsAllOid);
  collectShiftClickRangeOids(rowsAllOid, "oid:a", "oid:f");
  collectShiftClickRangeOids(rowsAllOid, "oid:c", "oid:d");
  collectShiftClickRangeOids(rowsAllOid, "oid:zz", "oid:yy");
  const after = JSON.stringify(rowsAllOid);
  assertEq("18: non-mutating", before, after);
}

// 19. Clicked oid never duplicated in output (the for loop skips it).
{
  const r = collectShiftClickRangeOids(rowsAllOid, "oid:b", "oid:d");
  // r = [d, b, c]. Count occurrences of "d".
  const dupCount = r.filter((o) => o === "d").length;
  assertEq("19: clicked appears exactly once", dupCount, 1);
}

// 20. Order is DFS — middle rows preserved between primary and rest.
//     Anchor=A, clicked=F → output [F, A, B, C, D, E]. Locks order.
{
  const r = collectShiftClickRangeOids(rowsAllOid, "oid:a", "oid:f");
  // After F (primary), the rest should be A B C D E in row-index order.
  const tail = r.slice(1);
  assertEq("20: tail follows DFS order", tail, ["a", "b", "c", "d", "e"]);
}

// ---- Integration sketches ---------------------------------------------

// 21. Simulate dispatcher decision: range when both keys present + clicked has oid.
function simulateDispatch({ rows, anchor, clicked, hasRangeHandler }) {
  if (!hasRangeHandler || !anchor) return { dispatched: "additive-single" };
  const oids = collectShiftClickRangeOids(rows, anchor, clicked);
  if (oids.length === 0) return { dispatched: "additive-single" };
  return { dispatched: "range", oids };
}

assertEq(
  "21: sim dispatch — happy path",
  simulateDispatch({
    rows: rowsAllOid,
    anchor: "oid:b",
    clicked: "oid:e",
    hasRangeHandler: true,
  }),
  { dispatched: "range", oids: ["e", "b", "c", "d"] },
);

// 22. Sim dispatch — no range handler wired (HTML mode) → additive-single.
assertEq(
  "22: sim dispatch — no range handler → fallthrough",
  simulateDispatch({
    rows: rowsAllOid,
    anchor: "oid:b",
    clicked: "oid:e",
    hasRangeHandler: false,
  }),
  { dispatched: "additive-single" },
);

// 23. Sim dispatch — no current primary anchor → additive-single (caller
//     would replace with a single-select).
assertEq(
  "23: sim dispatch — no anchor → fallthrough",
  simulateDispatch({
    rows: rowsAllOid,
    anchor: null,
    clicked: "oid:e",
    hasRangeHandler: true,
  }),
  { dispatched: "additive-single" },
);

// 24. Sim dispatch — clicked has no oid → fallthrough to additive-single
//     (the additive-single path also no-ops at oid-check, but the dispatcher
//     uniformly returns "additive-single" so the behavior is observable).
assertEq(
  "24: sim dispatch — clicked oid-less → fallthrough",
  simulateDispatch({
    rows: rowsMixed,
    anchor: "oid:a",
    clicked: "html:1.0",
    hasRangeHandler: true,
  }),
  { dispatched: "additive-single" },
);

// 25. Sim dispatch — anchor === clicked → range of one row, dispatched.
//     Caller then sets selection to [clickedOid] alone (single-select effect).
assertEq(
  "25: sim dispatch — anchor === clicked → range of one",
  simulateDispatch({
    rows: rowsAllOid,
    anchor: "oid:c",
    clicked: "oid:c",
    hasRangeHandler: true,
  }),
  { dispatched: "range", oids: ["c"] },
);

// ---- DFS-with-collapsed semantics (visible rows respect expand state) -

// 26. visibleRows is the post-collapse DFS list; collapsed children are
//     simply absent. We don't test that here (the helper takes pre-
//     filtered rows), but case #26 locks the contract: helper trusts
//     the input row order, doesn't re-sort.
{
  // Simulate a tree where C and D are inside a collapsed parent — they
  // simply aren't in visibleRows. Anchor=B, clicked=E → range = [B, E]
  // (no C/D since they're collapsed-hidden).
  const collapsedRows = [
    { key: "oid:a", oid: "a" },
    { key: "oid:b", oid: "b" },
    // C and D collapsed under some parent — absent from visible rows.
    { key: "oid:e", oid: "e" },
    { key: "oid:f", oid: "f" },
  ];
  assertEq(
    "26: collapsed children absent from range",
    collectShiftClickRangeOids(collapsedRows, "oid:b", "oid:e"),
    ["e", "b"],
  );
}

// 27. Empty anchor key (caller passed "") → not found in rows → empty.
assertEq(
  "27: empty anchor key → empty",
  collectShiftClickRangeOids(rowsAllOid, "", "oid:c"),
  [],
);

// 28. Empty clicked key → not found → empty.
assertEq(
  "28: empty clicked key → empty",
  collectShiftClickRangeOids(rowsAllOid, "oid:c", ""),
  [],
);

console.log(`\nbench-tree-range-select: ${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
