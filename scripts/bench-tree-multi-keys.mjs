// Twenty-eighth pass — pure-logic bench for the tree multi-key router.
// Mirrors the predicate exported from `components/ElementTree.tsx` so the
// keyboard-handler routing decision (single-row delete/duplicate vs
// multi-row delete/duplicate) is locked against drift.
//
// The predicate fans Backspace/Delete + Cmd/Ctrl+D out across the
// multi-set when ALL of:
//   1. a multi-handler (onDeleteMulti / onDuplicateMulti) is wired,
//   2. selectedOidsForDrag has 2+ entries, AND
//   3. the focused row's oid is included in that set.
// Otherwise the action stays on the focused row only — mirrors the
// canvas behaviour where keyboard actions follow focus, not selection,
// when the actor isn't part of the set.

function shouldRouteThroughMulti(focusedOid, selectedOidsForDrag, hasMultiHandler) {
  if (!hasMultiHandler) return false;
  if (!selectedOidsForDrag) return false;
  if (selectedOidsForDrag.length < 2) return false;
  if (!focusedOid) return false;
  return selectedOidsForDrag.includes(focusedOid);
}

let passed = 0;
let failed = 0;
function assertEq(label, got, want) {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  if (a === b) {
    passed++;
  } else {
    failed++;
    console.log(`FAIL ${label}\n  got:  ${a}\n  want: ${b}`);
  }
}
function assertTrue(label, cond) {
  if (cond) passed++;
  else {
    failed++;
    console.log(`FAIL ${label}`);
  }
}

// 1. No multi-handler wired → never multi
assertEq(
  "no multi handler",
  shouldRouteThroughMulti("a", ["a", "b", "c"], false),
  false,
);

// 2. selectedOidsForDrag undefined → never multi
assertEq(
  "set undefined",
  shouldRouteThroughMulti("a", undefined, true),
  false,
);

// 3. Empty set → never multi
assertEq(
  "empty set",
  shouldRouteThroughMulti("a", [], true),
  false,
);

// 4. Single-element set → never multi (length < 2)
assertEq(
  "single-element set",
  shouldRouteThroughMulti("a", ["a"], true),
  false,
);

// 5. Focused oid not in set → single-row (focus matters, not set)
assertEq(
  "focused not in set",
  shouldRouteThroughMulti("z", ["a", "b", "c"], true),
  false,
);

// 6. Focused oid in set, length 2 → multi
assertEq(
  "in set length 2",
  shouldRouteThroughMulti("a", ["a", "b"], true),
  true,
);

// 7. Focused oid in set, length 3 → multi
assertEq(
  "in set length 3",
  shouldRouteThroughMulti("b", ["a", "b", "c"], true),
  true,
);

// 8. Primary (first) oid → multi
assertEq(
  "first in set",
  shouldRouteThroughMulti("a", ["a", "b", "c"], true),
  true,
);

// 9. Last oid in set → multi
assertEq(
  "last in set",
  shouldRouteThroughMulti("c", ["a", "b", "c"], true),
  true,
);

// 10. Middle oid in set → multi
assertEq(
  "middle in set",
  shouldRouteThroughMulti("b", ["a", "b", "c", "d", "e"], true),
  true,
);

// 11. Empty focused oid → single-row (no row to actually act on, the
//     caller's downstream guard catches this; the predicate just refuses)
assertEq(
  "empty focused",
  shouldRouteThroughMulti("", ["a", "b"], true),
  false,
);

// 12. null focused oid → single-row
assertEq(
  "null focused",
  shouldRouteThroughMulti(null, ["a", "b"], true),
  false,
);

// 13. undefined focused oid → single-row
assertEq(
  "undefined focused",
  shouldRouteThroughMulti(undefined, ["a", "b"], true),
  false,
);

// 14. set has duplicate, focused matches one → still routes multi (the
//     downstream multi-handler is responsible for de-duping its input;
//     the predicate just answers the routing question)
assertEq(
  "duplicate in set",
  shouldRouteThroughMulti("a", ["a", "a", "b"], true),
  true,
);

// 15. Length is exactly 2 boundary
assertEq(
  "boundary length 2 yes",
  shouldRouteThroughMulti("a", ["a", "b"], true),
  true,
);
assertEq(
  "boundary length 1 no",
  shouldRouteThroughMulti("a", ["a"], true),
  false,
);

// 16. handler false but set length 5 → still no multi
assertEq(
  "handler false big set",
  shouldRouteThroughMulti("c", ["a", "b", "c", "d", "e"], false),
  false,
);

// 17. handler true but set has only the focused oid → single
assertEq(
  "set is only focused",
  shouldRouteThroughMulti("a", ["a"], true),
  false,
);

// 18. case-sensitive comparison (oids are base-62 case sensitive)
assertEq(
  "case sensitive",
  shouldRouteThroughMulti("Abc", ["abc", "def"], true),
  false,
);

// 19. exact case match
assertEq(
  "case exact match",
  shouldRouteThroughMulti("Abc", ["Abc", "def"], true),
  true,
);

// 20. set has many entries, focused at very end
assertEq(
  "large set focused last",
  shouldRouteThroughMulti("z", ["a", "b", "c", "d", "e", "f", "g", "z"], true),
  true,
);

// 21. set has many entries, focused not in set
assertEq(
  "large set focused not in",
  shouldRouteThroughMulti("zz", ["a", "b", "c", "d", "e", "f", "g", "z"], true),
  false,
);

// 22. integration sketch: simulating Backspace dispatch
function simulateBackspace({
  focusedOid,
  selectedOidsForDrag,
  hasOnDelete,
  hasOnDeleteMulti,
}) {
  if (!focusedOid || !hasOnDelete) return { dispatched: "none" };
  if (
    shouldRouteThroughMulti(
      focusedOid,
      selectedOidsForDrag,
      hasOnDeleteMulti,
    )
  ) {
    return { dispatched: "multi", oids: selectedOidsForDrag };
  }
  return { dispatched: "single", oid: focusedOid };
}

assertEq(
  "sim backspace single (no multi handler)",
  simulateBackspace({
    focusedOid: "a",
    selectedOidsForDrag: ["a", "b"],
    hasOnDelete: true,
    hasOnDeleteMulti: false,
  }),
  { dispatched: "single", oid: "a" },
);

// 23. sim backspace multi
assertEq(
  "sim backspace multi",
  simulateBackspace({
    focusedOid: "a",
    selectedOidsForDrag: ["a", "b", "c"],
    hasOnDelete: true,
    hasOnDeleteMulti: true,
  }),
  { dispatched: "multi", oids: ["a", "b", "c"] },
);

// 24. sim backspace single because focused not in set
assertEq(
  "sim backspace single not in set",
  simulateBackspace({
    focusedOid: "z",
    selectedOidsForDrag: ["a", "b", "c"],
    hasOnDelete: true,
    hasOnDeleteMulti: true,
  }),
  { dispatched: "single", oid: "z" },
);

// 25. sim backspace none (no onDelete wired)
assertEq(
  "sim backspace none",
  simulateBackspace({
    focusedOid: "a",
    selectedOidsForDrag: ["a", "b"],
    hasOnDelete: false,
    hasOnDeleteMulti: true,
  }),
  { dispatched: "none" },
);

// 26. Cmd+D path is symmetric — same predicate. Sim with hasOnDuplicate
function simulateCmdD({
  focusedOid,
  selectedOidsForDrag,
  hasOnDuplicate,
  hasOnDuplicateMulti,
}) {
  if (!focusedOid || !hasOnDuplicate) return { dispatched: "none" };
  if (
    shouldRouteThroughMulti(
      focusedOid,
      selectedOidsForDrag,
      hasOnDuplicateMulti,
    )
  ) {
    return { dispatched: "multi", oids: selectedOidsForDrag };
  }
  return { dispatched: "single", oid: focusedOid };
}

assertEq(
  "sim cmd-d multi",
  simulateCmdD({
    focusedOid: "b",
    selectedOidsForDrag: ["a", "b", "c"],
    hasOnDuplicate: true,
    hasOnDuplicateMulti: true,
  }),
  { dispatched: "multi", oids: ["a", "b", "c"] },
);

assertEq(
  "sim cmd-d single",
  simulateCmdD({
    focusedOid: "b",
    selectedOidsForDrag: ["a", "b"],
    hasOnDuplicate: true,
    hasOnDuplicateMulti: false,
  }),
  { dispatched: "single", oid: "b" },
);

// 27. Order in selectedOidsForDrag is preserved — primary first
//     (matches the Workspace contract: [selection.oid, ...additionalOids]).
{
  const set = ["primary", "extra1", "extra2"];
  const r = simulateBackspace({
    focusedOid: "primary",
    selectedOidsForDrag: set,
    hasOnDelete: true,
    hasOnDeleteMulti: true,
  });
  assertEq(
    "multi preserves primary-first order",
    r.oids,
    ["primary", "extra1", "extra2"],
  );
}

// 28. Predicate is read-only — calling repeatedly gives same result
{
  const set = ["a", "b"];
  const r1 = shouldRouteThroughMulti("a", set, true);
  const r2 = shouldRouteThroughMulti("a", set, true);
  assertEq("predicate idempotent", r1, r2);
  assertTrue("predicate didn't mutate set", set.length === 2);
}

// --- buildDragGhostLabel coverage (twenty-eighth pass / Feature B) ---

// Thirty-fifth-pass chunk (mm) — accepts optional `format` param.
// Default "with-count" preserves the historical behavior. New
// "no-count" / "count-only" formats power the chunk-mm preference.
// Final string assembly delegated to applyDragGhostFormat — keeps
// the format-vs-output mapping testable independent of tree shape.
function applyDragGhostFormat(tag, setSize, format) {
  const isMulti = setSize > 1;
  if (format === "count-only") {
    return isMulti ? `${setSize}` : "1";
  }
  if (format === "no-count") {
    return tag ? `<${tag}>` : isMulti ? `${setSize} elements` : "1 element";
  }
  if (!isMulti) {
    return tag ? `<${tag}>` : "1 element";
  }
  return tag ? `<${tag}> · ${setSize}` : `${setSize} elements`;
}

function buildDragGhostLabel(tree, primaryOid, setSize, format = "with-count") {
  let primaryTag;
  function walk(arr) {
    for (const n of arr) {
      if (primaryTag) return;
      if (n.oid === primaryOid) {
        primaryTag = n.tag;
        return;
      }
      if (n.children && n.children.length > 0) walk(n.children);
    }
  }
  walk(tree);
  return applyDragGhostFormat(primaryTag ?? null, setSize, format);
}

const N = (tag, oid, children) => ({
  tag,
  oid: oid ?? null,
  children: children ?? [],
  classes: [],
  loc: { kind: "jsx", startLine: 1, startCol: 0, endLine: 1, endCol: 1 },
});

// 29. Single drag, primary tag found
assertEq(
  "single drag with tag",
  buildDragGhostLabel([N("section", "a")], "a", 1),
  "<section>",
);

// 30. Multi drag, primary tag found
assertEq(
  "multi drag with tag",
  buildDragGhostLabel([N("section", "a"), N("article", "b"), N("aside", "c")], "a", 3),
  "<section> · 3",
);

// 31. Multi drag, primary tag found in a deep subtree
assertEq(
  "multi drag deep tag",
  buildDragGhostLabel(
    [N("body", "root", [N("main", "m", [N("button", "btn")])])],
    "btn",
    4,
  ),
  "<button> · 4",
);

// 32. Primary tag NOT found (mid-drag tree mutation), single — fallback
assertEq(
  "single drag no tag",
  buildDragGhostLabel([N("section", "a")], "missing", 1),
  "1 element",
);

// 33. Primary tag NOT found, multi — fallback
assertEq(
  "multi drag no tag",
  buildDragGhostLabel([N("section", "a")], "missing", 5),
  "5 elements",
);

// 34. setSize 0 still treated as single (defensive)
assertEq(
  "setSize 0",
  buildDragGhostLabel([N("section", "a")], "a", 0),
  "<section>",
);

// 35. setSize negative (defensive — never happens but predicate is robust)
assertEq(
  "setSize negative",
  buildDragGhostLabel([N("section", "a")], "a", -1),
  "<section>",
);

// 36. Empty tree, missing oid → fallback
assertEq(
  "empty tree single",
  buildDragGhostLabel([], "x", 1),
  "1 element",
);
assertEq(
  "empty tree multi",
  buildDragGhostLabel([], "x", 4),
  "4 elements",
);

// 37. Tag matches first match in DFS — siblings with same tag don't
//     conflate (the predicate uses oid)
assertEq(
  "two same-tag siblings, second selected",
  buildDragGhostLabel([N("li", "li1"), N("li", "li2"), N("li", "li3")], "li2", 3),
  "<li> · 3",
);

// 38. Custom tag (capitalized component-style)
assertEq(
  "custom tag",
  buildDragGhostLabel([N("Card", "card1")], "card1", 1),
  "<Card>",
);

// 39. Multi label uses middle dot separator
{
  const out = buildDragGhostLabel([N("p", "p1")], "p1", 2);
  assertTrue("middle dot present", out.includes("·"));
}

// 40. Walk stops at first match (early-return short-circuit doesn't
//     pick up later same-oid duplicates)
{
  // Pathological tree with two nodes claiming the same oid — first
  // hit wins. Defensive: real trees enforce oid uniqueness via
  // applyDuplicate / applyInsertChild's seen-set, but the predicate
  // shouldn't crash.
  const out = buildDragGhostLabel(
    [N("first", "dup"), N("second", "dup")],
    "dup",
    1,
  );
  assertEq("first match wins", out, "<first>");
}

// --- Thirty-fifth-pass chunk (mm) — format preference -------------

// Defaults — 3-arg call still produces historical "with-count" output.
assertEq(
  "mm-1: 3-arg single drag (default with-count)",
  buildDragGhostLabel([N("div", "a")], "a", 1),
  "<div>",
);
assertEq(
  "mm-2: 3-arg multi drag (default with-count)",
  buildDragGhostLabel([N("div", "a"), N("p", "b"), N("span", "c")], "a", 3),
  "<div> · 3",
);

// Explicit "with-count" — same as default.
assertEq(
  "mm-3: explicit with-count single",
  buildDragGhostLabel([N("button", "a")], "a", 1, "with-count"),
  "<button>",
);
assertEq(
  "mm-4: explicit with-count multi",
  buildDragGhostLabel([N("button", "a"), N("a", "b")], "a", 2, "with-count"),
  "<button> · 2",
);

// "no-count" — drops the count suffix from multi-drag.
assertEq(
  "mm-5: no-count single (tag preserved)",
  buildDragGhostLabel([N("li", "a")], "a", 1, "no-count"),
  "<li>",
);
assertEq(
  "mm-6: no-count multi (count dropped)",
  buildDragGhostLabel([N("li", "a"), N("li", "b"), N("li", "c")], "a", 3, "no-count"),
  "<li>",
);
assertEq(
  "mm-7: no-count multi with no resolved tag → fallback (count + 'elements')",
  buildDragGhostLabel([N("li", "a")], "missing", 5, "no-count"),
  "5 elements",
);

// "count-only" — numeric-only output.
assertEq(
  "mm-8: count-only single → '1'",
  buildDragGhostLabel([N("div", "a")], "a", 1, "count-only"),
  "1",
);
assertEq(
  "mm-9: count-only multi → '<N>' (no tag)",
  buildDragGhostLabel([N("div", "a"), N("p", "b")], "a", 2, "count-only"),
  "2",
);
assertEq(
  "mm-10: count-only with no resolved tag still numeric",
  buildDragGhostLabel([], "missing", 7, "count-only"),
  "7",
);

// Format-vs-output direct (applyDragGhostFormat without tree walk).
assertEq("mm-11: applyDragGhostFormat with-count single tag", applyDragGhostFormat("div", 1, "with-count"), "<div>");
assertEq("mm-12: applyDragGhostFormat with-count multi tag", applyDragGhostFormat("div", 4, "with-count"), "<div> · 4");
assertEq("mm-13: applyDragGhostFormat with-count single null tag", applyDragGhostFormat(null, 1, "with-count"), "1 element");
assertEq("mm-14: applyDragGhostFormat with-count multi null tag", applyDragGhostFormat(null, 5, "with-count"), "5 elements");
assertEq("mm-15: applyDragGhostFormat no-count single tag", applyDragGhostFormat("div", 1, "no-count"), "<div>");
assertEq("mm-16: applyDragGhostFormat no-count multi tag", applyDragGhostFormat("div", 4, "no-count"), "<div>");
assertEq("mm-17: applyDragGhostFormat no-count single null tag", applyDragGhostFormat(null, 1, "no-count"), "1 element");
assertEq("mm-18: applyDragGhostFormat no-count multi null tag", applyDragGhostFormat(null, 4, "no-count"), "4 elements");
assertEq("mm-19: applyDragGhostFormat count-only single", applyDragGhostFormat("div", 1, "count-only"), "1");
assertEq("mm-20: applyDragGhostFormat count-only multi", applyDragGhostFormat("div", 3, "count-only"), "3");
assertEq("mm-21: applyDragGhostFormat count-only null tag single", applyDragGhostFormat(null, 1, "count-only"), "1");

// setSize edge cases — 0 and negative folded to single (defensive).
assertEq("mm-22: setSize 0 → single tag", applyDragGhostFormat("div", 0, "with-count"), "<div>");
assertEq("mm-23: setSize 0 with count-only → '1' (defensive)", applyDragGhostFormat("div", 0, "count-only"), "1");
assertEq("mm-24: setSize -1 with no-count → single tag", applyDragGhostFormat("div", -1, "no-count"), "<div>");

// Idempotent.
{
  const a = buildDragGhostLabel([N("p", "a")], "a", 2, "no-count");
  const b = buildDragGhostLabel([N("p", "a")], "a", 2, "no-count");
  assertEq("mm-25: buildDragGhostLabel idempotent (no-count)", a, b);
}

// --- collectSelectAllOids coverage (twenty-ninth pass / Feature A) ---

// Mirror of components/ElementTree.tsx#collectSelectAllOids. Pure
// helper: returns the oid list to feed `onSelectAllInTree(oids)`. Order:
// focused row first (when in tree), then remaining siblings in DFS
// order. When focusedOid is null OR not found, flatten everything in
// DFS order. visibleOidSet (when set) intersects every candidate oid.
function collectSelectAllOids(tree, focusedOid, visibleOidSet) {
  const passes = (oid) => {
    if (!oid) return false;
    if (!visibleOidSet) return true;
    return visibleOidSet.has(oid);
  };
  let foundSiblings = null;
  if (focusedOid) {
    const walk = (arr) => {
      for (const n of arr) {
        if (n.oid === focusedOid) {
          foundSiblings = arr;
          return true;
        }
        if (n.children && n.children.length > 0 && walk(n.children)) return true;
      }
      return false;
    };
    walk(tree);
  }
  if (foundSiblings) {
    const out = [];
    if (focusedOid && passes(focusedOid)) out.push(focusedOid);
    for (const n of foundSiblings) {
      if (n.oid === focusedOid) continue;
      if (passes(n.oid)) out.push(n.oid);
    }
    return out;
  }
  const out = [];
  const flatten = (arr) => {
    for (const n of arr) {
      if (passes(n.oid)) out.push(n.oid);
      if (n.children && n.children.length > 0) flatten(n.children);
    }
  };
  flatten(tree);
  return out;
}

// Sample tree:
//   <body oid=root>
//     <header oid=h>
//       <h1 oid=h1/>
//       <nav oid=nav/>
//     </header>
//     <main oid=m>
//       <section oid=s1>
//         <p oid=p1/>
//         <p oid=p2/>
//         <p oid=p3/>
//       </section>
//       <section oid=s2/>
//     </main>
//     <footer oid=f/>
//   </body>
const sample = [
  N("body", "root", [
    N("header", "h", [N("h1", "h1"), N("nav", "nav")]),
    N("main", "m", [
      N("section", "s1", [N("p", "p1"), N("p", "p2"), N("p", "p3")]),
      N("section", "s2"),
    ]),
    N("footer", "f"),
  ]),
];

// 41. Focused on h1 → siblings = [h1, nav]; primary first
assertEq(
  "siblings: focused leaf",
  collectSelectAllOids(sample, "h1", null),
  ["h1", "nav"],
);

// 42. Focused on p2 (middle of three) → primary p2 first, then p1, p3
assertEq(
  "siblings: focused middle, primary first",
  collectSelectAllOids(sample, "p2", null),
  ["p2", "p1", "p3"],
);

// 43. Focused on s1 → siblings = [s1, s2]; primary first
assertEq(
  "siblings: section level",
  collectSelectAllOids(sample, "s1", null),
  ["s1", "s2"],
);

// 44. Focused on root (top-level) → siblings = [root]
assertEq(
  "siblings: top-level focused → just self",
  collectSelectAllOids(sample, "root", null),
  ["root"],
);

// 45. Focused oid not in tree → flatten everything in DFS order
assertEq(
  "no match: flatten DFS",
  collectSelectAllOids(sample, "missing", null),
  ["root", "h", "h1", "nav", "m", "s1", "p1", "p2", "p3", "s2", "f"],
);

// 46. Null focused → flatten everything (no focus)
assertEq(
  "null focused: flatten all",
  collectSelectAllOids(sample, null, null),
  ["root", "h", "h1", "nav", "m", "s1", "p1", "p2", "p3", "s2", "f"],
);

// 47. Empty string focused → flatten (treated as null)
assertEq(
  "empty focused: flatten all",
  collectSelectAllOids(sample, "", null),
  ["root", "h", "h1", "nav", "m", "s1", "p1", "p2", "p3", "s2", "f"],
);

// 48. Empty tree, any input → []
assertEq("empty tree", collectSelectAllOids([], "anything", null), []);

// 49. Filter set restricts siblings to only filter-passing oids
assertEq(
  "filter restricts siblings",
  collectSelectAllOids(sample, "p2", new Set(["p2", "p3"])),
  ["p2", "p3"],
);

// 50. Filter excludes the focused row itself → focused dropped from out
assertEq(
  "filter excludes focused",
  collectSelectAllOids(sample, "p2", new Set(["p1", "p3"])),
  ["p1", "p3"],
);

// 51. Filter set has zero overlap with siblings → []
assertEq(
  "filter zero overlap",
  collectSelectAllOids(sample, "p2", new Set(["nav", "f"])),
  [],
);

// 52. Filter is broad on flatten path
assertEq(
  "no focus, filter to leaves",
  collectSelectAllOids(sample, null, new Set(["h1", "p1", "p2", "p3", "f"])),
  ["h1", "p1", "p2", "p3", "f"],
);

// 53. Empty filter set → returns [] (Set with 0 entries)
assertEq(
  "empty filter set excludes everything",
  collectSelectAllOids(sample, "p2", new Set()),
  [],
);

// 54. Tree with non-OID leaves — non-oid nodes skipped on flatten
{
  const treeWithGap = [
    N("body", "root", [
      N("text-only-no-oid", null),
      N("section", "s", [N("p", "p1")]),
    ]),
  ];
  assertEq(
    "skips non-oid rows on flatten",
    collectSelectAllOids(treeWithGap, "missing", null),
    ["root", "s", "p1"],
  );
}

// 55. Non-oid focused → falls into flatten path
{
  const treeWithNoOidLeaf = [
    N("body", "root", [N("text-only", null), N("p", "p1")]),
  ];
  assertEq(
    "non-oid focused → flatten",
    collectSelectAllOids(treeWithNoOidLeaf, null, null),
    ["root", "p1"],
  );
}

// 56. Focused row has children — siblings still computed correctly
{
  // Focused on header (a parent with children); its siblings are root's
  // OTHER children: m, f. But wait — in `sample`, header's parent is
  // root; root's children are [h, m, f]. So siblings are [h, m, f] with
  // h primary first.
  assertEq(
    "focused parent with children",
    collectSelectAllOids(sample, "h", null),
    ["h", "m", "f"],
  );
}

// 57. Filter passes ancestors only — Cmd+A on a deep leaf still selects
//     all visible siblings (post-filter).
assertEq(
  "filter on deep leaf",
  collectSelectAllOids(sample, "p3", new Set(["p1", "p3"])),
  ["p3", "p1"],
);

// 58. Order preserved: input tree order drives DFS; focused first when
//     in siblings — verifies we don't accidentally sort.
{
  const t = [
    N("ul", "u", [
      N("li", "li-c"),
      N("li", "li-a"),
      N("li", "li-b"),
    ]),
  ];
  assertEq(
    "preserves insertion order",
    collectSelectAllOids(t, "li-a", null),
    ["li-a", "li-c", "li-b"],
  );
}

// 59. focusedOid present at multiple depths (defensive — first-match wins).
//     Tree shouldn't have duplicate oids in production, but the helper
//     should consistently return whichever level it hit first.
{
  const dupTree = [
    N("body", "root", [
      N("section", "s", [N("p", "dup")]),
      N("aside", "a", [N("p", "dup")]),
    ]),
  ];
  // Focused dup → first match's parent is `s`, siblings = [dup]
  assertEq(
    "first dup wins for siblings",
    collectSelectAllOids(dupTree, "dup", null),
    ["dup"],
  );
}

// 60. Idempotence — calling twice with same args gives same array.
{
  const r1 = collectSelectAllOids(sample, "p2", null);
  const r2 = collectSelectAllOids(sample, "p2", null);
  assertEq("idempotent", r1, r2);
}

// 61. Helper does not mutate the input tree.
{
  const before = JSON.stringify(sample);
  collectSelectAllOids(sample, "p2", null);
  collectSelectAllOids(sample, null, new Set(["root"]));
  const after = JSON.stringify(sample);
  assertEq("non-mutating", before, after);
}

// 62. Integration: simulate dispatch decision (helper + skip-if-empty)
function simulateCmdA({ tree, focusedOid, visibleOidSet, hasHandler }) {
  if (!hasHandler) return { dispatched: false };
  const oids = collectSelectAllOids(tree, focusedOid, visibleOidSet);
  if (oids.length === 0) return { dispatched: false };
  return { dispatched: true, oids };
}

assertEq(
  "sim cmd-a no handler",
  simulateCmdA({
    tree: sample,
    focusedOid: "p2",
    visibleOidSet: null,
    hasHandler: false,
  }),
  { dispatched: false },
);

assertEq(
  "sim cmd-a with handler",
  simulateCmdA({
    tree: sample,
    focusedOid: "p2",
    visibleOidSet: null,
    hasHandler: true,
  }),
  { dispatched: true, oids: ["p2", "p1", "p3"] },
);

assertEq(
  "sim cmd-a empty filter result skipped",
  simulateCmdA({
    tree: sample,
    focusedOid: "p2",
    visibleOidSet: new Set(),
    hasHandler: true,
  }),
  { dispatched: false },
);

console.log(`bench-tree-multi-keys: ${passed}/${passed + failed} passed`);
process.exit(failed === 0 ? 0 : 1);
