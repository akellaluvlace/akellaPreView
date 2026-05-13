// Pure-logic bench for the ElementTree filter helpers
// (`nodeMatchesQuery` + `buildVisibleKeys`). Inlines the helpers so the
// bench doesn't have to ts-load the React component module.

function locKey(loc) {
  if (loc.kind === "jsx") return `jsx:${loc.startLine}:${loc.startCol}`;
  return `html:${loc.path.join(".")}`;
}

function nodeKey(n) {
  return n.oid ? `oid:${n.oid}` : locKey(n.loc);
}

function nodeMatchesQuery(node, q) {
  if (!q) return true;
  const ql = q.toLowerCase().trim();
  if (!ql) return true;
  if (node.tag.toLowerCase().includes(ql)) return true;
  for (const c of node.classes) {
    if (c.toLowerCase().includes(ql)) return true;
  }
  if (node.oid && node.oid.toLowerCase() === ql) return true;
  return false;
}

function buildVisibleKeys(nodes, query) {
  if (!query.trim()) return null;
  const keep = new Set();
  const matches = new Set();
  function dfs(arr, ancestors) {
    let anyMatch = false;
    for (const n of arr) {
      const k = nodeKey(n);
      const direct = nodeMatchesQuery(n, query);
      const childHit =
        n.children.length > 0 ? dfs(n.children, [...ancestors, k]) : false;
      if (direct) {
        matches.add(k);
        keep.add(k);
        for (const a of ancestors) keep.add(a);
        anyMatch = true;
      }
      if (childHit) {
        keep.add(k);
        for (const a of ancestors) keep.add(a);
        anyMatch = true;
      }
    }
    return anyMatch;
  }
  dfs(nodes, []);
  return { keep, matches };
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

const J = (line, col) => ({
  kind: "jsx",
  startLine: line,
  startCol: col,
  endLine: line,
  endCol: col + 10,
  openEndLine: line,
  openEndCol: col + 5,
});

function n(tag, opts = {}) {
  return {
    tag,
    loc: opts.loc ?? J(opts.line ?? 1, opts.col ?? 0),
    oid: opts.oid ?? null,
    classes: opts.classes ?? [],
    children: opts.children ?? [],
  };
}

// 1. nodeMatchesQuery — empty query matches
assertTrue("empty query matches", nodeMatchesQuery(n("div"), ""));
// 2. whitespace-only query treated as empty
assertTrue("whitespace query matches", nodeMatchesQuery(n("div"), "   "));
// 3. tag prefix match
assertTrue("tag prefix", nodeMatchesQuery(n("button"), "but"));
// 4. tag substring match
assertTrue("tag substr", nodeMatchesQuery(n("button"), "ton"));
// 5. case-insensitive tag
assertTrue("tag CASE-INSENSITIVE", nodeMatchesQuery(n("BUTTON"), "but"));
// 6. tag that doesn't match
assertTrue("tag nomatch", !nodeMatchesQuery(n("div"), "btn"));
// 7. class substring
assertTrue(
  "class substring",
  nodeMatchesQuery(n("div", { classes: ["bg-blue-500"] }), "blue"),
);
// 8. class case-insensitive
assertTrue(
  "class case-insensitive",
  nodeMatchesQuery(n("div", { classes: ["BG-Blue"] }), "blue"),
);
// 9. multi-class match second class
assertTrue(
  "multi-class second",
  nodeMatchesQuery(
    n("div", { classes: ["flex", "items-center", "rounded-md"] }),
    "rounded",
  ),
);
// 10. no classes, no match
assertTrue("no class no match", !nodeMatchesQuery(n("div"), "blue"));
// 11. OID exact match
assertTrue(
  "oid exact",
  nodeMatchesQuery(n("div", { oid: "abc12345" }), "abc12345"),
);
// 12. OID partial does NOT match (we only do exact for OID)
assertTrue(
  "oid partial no",
  !nodeMatchesQuery(n("div", { oid: "abc12345" }), "abc"),
);
// 13. OID case-insensitive exact
assertTrue(
  "oid case",
  nodeMatchesQuery(n("div", { oid: "Abc12345" }), "abc12345"),
);

// --- buildVisibleKeys ---

// 14. Empty query returns null
assertEq("buildVisibleKeys empty", buildVisibleKeys([n("div")], ""), null);

// 15. Whitespace query returns null (no filter)
assertEq("buildVisibleKeys whitespace", buildVisibleKeys([n("div")], "  "), null);

// 16. Single-level match
{
  const tree = [n("div"), n("button"), n("p")];
  const r = buildVisibleKeys(tree, "but");
  assertTrue("single-level match", r !== null && r.matches.size === 1);
  assertTrue("single-level keep", r !== null && r.keep.size === 1);
}

// 17. Match in deeply nested child expands ancestor chain
{
  const target = n("button", { line: 5, col: 0 });
  const tree = [
    n("div", {
      line: 1,
      children: [n("section", { line: 2, children: [n("nav", { line: 3, children: [target] })] })],
    }),
  ];
  const r = buildVisibleKeys(tree, "but");
  assertTrue("deep keep includes all ancestors", r !== null && r.keep.size === 4);
  assertTrue("deep matches just one", r !== null && r.matches.size === 1);
}

// 18. Multiple matches, distinct ancestor chains
{
  const tree = [
    n("div", {
      line: 1,
      children: [n("button", { line: 2 })],
    }),
    n("section", {
      line: 3,
      children: [n("button", { line: 4 })],
    }),
  ];
  const r = buildVisibleKeys(tree, "but");
  assertTrue("multi keep size", r !== null && r.keep.size === 4);
  assertTrue("multi matches size", r !== null && r.matches.size === 2);
}

// 19. No matches
{
  const tree = [n("div", { children: [n("p", { line: 2 })] })];
  const r = buildVisibleKeys(tree, "xyz");
  assertTrue("no matches keep empty", r !== null && r.keep.size === 0);
  assertTrue("no matches set empty", r !== null && r.matches.size === 0);
}

// 20. Match by class — ancestor chain still expanded
{
  const tree = [
    n("div", {
      line: 1,
      children: [n("p", { line: 2, classes: ["text-blue-500"] })],
    }),
  ];
  const r = buildVisibleKeys(tree, "blue");
  assertTrue("class match keep parent", r !== null && r.keep.size === 2);
  assertTrue("class match in matches", r !== null && r.matches.size === 1);
}

// 21. Match by OID
{
  const tree = [
    n("div", {
      line: 1,
      oid: "rootabcd",
      children: [n("p", { line: 2, oid: "innerxyz" })],
    }),
  ];
  const r = buildVisibleKeys(tree, "innerxyz");
  assertTrue("oid match", r !== null && r.matches.size === 1);
  assertTrue("oid match keep parent", r !== null && r.keep.size === 2);
}

// 22. Sibling of a match is NOT visible (only the match's ancestors)
{
  const tree = [
    n("div", {
      line: 1,
      children: [
        n("button", { line: 2 }),
        n("p", { line: 3 }),
      ],
    }),
  ];
  const r = buildVisibleKeys(tree, "but");
  assertTrue("sibling filter keep size", r !== null && r.keep.size === 2);
}

// 23. Match at root level (no ancestors)
{
  const tree = [n("button", { line: 1 })];
  const r = buildVisibleKeys(tree, "but");
  assertTrue("root match keep", r !== null && r.keep.size === 1);
}

// 24. Tag-substring respects case
{
  const tree = [n("DIV", { line: 1 }), n("Button", { line: 2 })];
  const r = buildVisibleKeys(tree, "div");
  assertTrue("uppercase tag matches lowercase q", r !== null && r.matches.size === 1);
}

// 25. Match the parent and a deeply nested child
{
  const tree = [
    n("div", {
      line: 1,
      classes: ["flex"],
      children: [
        n("section", {
          line: 2,
          children: [n("p", { line: 3, classes: ["flex-grow"] })],
        }),
      ],
    }),
  ];
  const r = buildVisibleKeys(tree, "flex");
  // Both div (matches "flex" exact) and p (matches "flex-grow") match
  assertTrue("two matches", r !== null && r.matches.size === 2);
  // Keep set: div + section + p
  assertTrue("two-match keep", r !== null && r.keep.size === 3);
}

// 26. Empty children array doesn't crash
{
  const tree = [n("div")];
  const r = buildVisibleKeys(tree, "div");
  assertTrue("empty children no crash", r !== null && r.keep.size === 1);
}

// 27. Match only at deeper levels — top-level non-match is still kept
//     because of descendant
{
  const tree = [
    n("div", {
      line: 1,
      children: [
        n("section", {
          line: 2,
          children: [
            n("nav", {
              line: 3,
              children: [
                n("ul", {
                  line: 4,
                  children: [n("button", { line: 5 })],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];
  const r = buildVisibleKeys(tree, "button");
  assertTrue("very deep keep size", r !== null && r.keep.size === 5);
  assertTrue("very deep matches", r !== null && r.matches.size === 1);
}

// 28. Two trees at top, match in one only
{
  const tree = [
    n("aside", { line: 1 }),
    n("main", {
      line: 2,
      children: [n("button", { line: 3 })],
    }),
  ];
  const r = buildVisibleKeys(tree, "but");
  // aside not kept; main + button kept
  assertTrue("two trees one matches", r !== null && r.keep.size === 2);
}

// 29. Multiple matches in same subtree
{
  const tree = [
    n("div", {
      line: 1,
      children: [
        n("section", {
          line: 2,
          children: [
            n("button", { line: 3 }),
            n("button", { line: 4 }),
          ],
        }),
      ],
    }),
  ];
  const r = buildVisibleKeys(tree, "button");
  assertTrue("two-button matches", r !== null && r.matches.size === 2);
  // div + section + 2 buttons
  assertTrue("two-button keep", r !== null && r.keep.size === 4);
}

// 30. Trim handling — leading/trailing spaces ignored
{
  const tree = [n("button", { line: 1 })];
  const r = buildVisibleKeys(tree, "  button  ");
  assertTrue("trim query", r !== null && r.matches.size === 1);
}

// 31. Each ancestor counted once across multiple matching children
{
  const tree = [
    n("div", {
      line: 1,
      children: [
        n("button", { line: 2 }),
        n("button", { line: 3 }),
        n("button", { line: 4 }),
      ],
    }),
  ];
  const r = buildVisibleKeys(tree, "button");
  // div + 3 buttons = 4 unique keep entries (no double-counting div)
  assertTrue("ancestor unique", r !== null && r.keep.size === 4);
}

// 32. Self-match doesn't add the matched node's own key as an ancestor
{
  const tree = [n("div", { line: 1, oid: "selfmatch" })];
  const r = buildVisibleKeys(tree, "selfmatch");
  assertTrue("self-match keep is just self", r !== null && r.keep.size === 1);
  assertTrue("self-match matches is just self", r !== null && r.matches.size === 1);
}

console.log(`bench-tree-filter: ${passed}/${passed + failed} passed`);
process.exit(failed === 0 ? 0 : 1);
