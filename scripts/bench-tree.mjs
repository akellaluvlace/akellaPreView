// Pure-logic bench for `dropinSerializeTree` — the iframe-side tree walker
// (lib/preview.ts). The walker runs inside the iframe over real DOM nodes,
// but the algorithm is straightforward: visit each Element under <body>,
// emit a TreeNode for addressable elements, recurse children. Non-
// addressable wrappers are transparent — their children hoist to the
// nearest addressable ancestor on the call stack.
//
// This bench builds a tiny synthetic-DOM that supports the subset the
// walker uses (`tagName`, `children`, `nodeType`, `getAttribute`) and
// re-implements the walker against it. Keeps the test isolated from
// the real iframe-side runtime build path.

const MAX = 500;

function makeElement(tag, opts = {}) {
  const el = {
    nodeType: 1,
    tagName: tag.toUpperCase(),
    children: [],
    _attrs: opts.attrs || {},
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this._attrs, name)
        ? this._attrs[name]
        : null;
    },
  };
  if (opts.children) {
    for (const c of opts.children) el.children.push(c);
  }
  return el;
}

function isAddressable(el) {
  if (!el || el.nodeType !== 1) return false;
  return el.getAttribute("data-dropin-loc") !== null;
}

function readOid(el) {
  return el.getAttribute("data-dropin-id");
}

function readLoc(el) {
  const raw = el.getAttribute("data-dropin-loc");
  if (!raw) return null;
  const parts = raw.split(":").map(Number);
  if (parts.length !== 6) return null;
  return {
    kind: "jsx",
    startLine: parts[0],
    startCol: parts[1],
    endLine: parts[2],
    endCol: parts[3],
    openEndLine: parts[4],
    openEndCol: parts[5],
  };
}

function readClasses(el) {
  const c = el.getAttribute("class");
  return c ? c.split(/\s+/).filter(Boolean) : [];
}

function walk(root) {
  const roots = [];
  const stack = [];
  let visited = 0;
  function visit(el) {
    if (!el || el.nodeType !== 1) return;
    if (visited >= MAX) return;
    let pushed = false;
    if (isAddressable(el)) {
      const loc = readLoc(el);
      if (loc) {
        const node = {
          tag: el.tagName.toLowerCase(),
          loc,
          oid: readOid(el),
          classes: readClasses(el).slice(0, 3),
          children: [],
        };
        const parent = stack.length > 0 ? stack[stack.length - 1] : null;
        if (parent) parent.children.push(node);
        else roots.push(node);
        stack.push(node);
        pushed = true;
        visited++;
      }
    }
    for (const c of el.children) {
      if (visited >= MAX) break;
      visit(c);
    }
    if (pushed) stack.pop();
  }
  visit(root);
  return { roots, visited };
}

let passed = 0;
let failed = 0;
function check(label, cond, detail) {
  if (cond) passed++;
  else {
    failed++;
    console.log(`FAIL ${label}${detail ? ` :: ${detail}` : ""}`);
  }
}
function eq(label, got, want) {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  check(label, a === b, `\n  got:  ${a}\n  want: ${b}`);
}

const ATTR_LOC = (l) => ({ "data-dropin-loc": l });
const ATTR_LOC_OID = (l, o) => ({ "data-dropin-loc": l, "data-dropin-id": o });

// 1. Empty body → empty tree
{
  const body = makeElement("body");
  eq("empty body", walk(body).roots, []);
}

// 2. Body itself is non-addressable; one addressable child
{
  const div = makeElement("div", { attrs: ATTR_LOC("1:1:2:1:1:5") });
  const body = makeElement("body", { children: [div] });
  const r = walk(body).roots;
  eq("single addressable child", r.length, 1);
  eq("tag", r[0].tag, "div");
  eq("loc", r[0].loc.startLine, 1);
}

// 3. Nested: section > h1 + p
{
  const h1 = makeElement("h1", {
    attrs: ATTR_LOC_OID("3:3:3:20:3:7", "AAAAAAAA"),
  });
  const p = makeElement("p", {
    attrs: ATTR_LOC_OID("4:3:4:30:4:6", "BBBBBBBB"),
  });
  const section = makeElement("section", {
    attrs: ATTR_LOC_OID("2:1:5:1:2:10", "CCCCCCCC"),
    children: [h1, p],
  });
  const body = makeElement("body", { children: [section] });
  const r = walk(body).roots;
  eq("nested root count", r.length, 1);
  eq("section tag", r[0].tag, "section");
  eq("section children count", r[0].children.length, 2);
  eq("first child tag", r[0].children[0].tag, "h1");
  eq("second child tag", r[0].children[1].tag, "p");
  eq("section oid", r[0].oid, "CCCCCCCC");
}

// 4. Non-addressable wrapper transparency: <div WITHOUT loc> wrapping <p WITH loc>
{
  const p = makeElement("p", { attrs: ATTR_LOC("3:3:3:20:3:6") });
  const wrapper = makeElement("div", { children: [p] });
  const body = makeElement("body", { children: [wrapper] });
  const r = walk(body).roots;
  eq("wrapper transparent — p hoists to root", r.length, 1);
  eq("hoisted p tag", r[0].tag, "p");
}

// 5. Two-level wrapper: body > non-addressable > non-addressable > addressable
{
  const target = makeElement("span", {
    attrs: ATTR_LOC("5:5:5:20:5:8"),
  });
  const w2 = makeElement("div", { children: [target] });
  const w1 = makeElement("article", { children: [w2] });
  const body = makeElement("body", { children: [w1] });
  const r = walk(body).roots;
  eq("two non-addressable wrappers transparent", r.length, 1);
  eq("hoisted span tag", r[0].tag, "span");
}

// 6. Addressable parent + non-addressable child + addressable grandchild
//    The grandchild should attach to the parent, NOT to a fictive child.
{
  const grand = makeElement("h2", {
    attrs: ATTR_LOC("6:6:6:30:6:8"),
  });
  const wrapper = makeElement("div", { children: [grand] });
  const parent = makeElement("section", {
    attrs: ATTR_LOC("4:1:7:1:4:10"),
    children: [wrapper],
  });
  const body = makeElement("body", { children: [parent] });
  const r = walk(body).roots;
  eq("parent count", r.length, 1);
  eq("parent direct children count", r[0].children.length, 1);
  eq("grandchild attached to parent", r[0].children[0].tag, "h2");
}

// 7. Multiple top-level addressables
{
  const h1 = makeElement("h1", { attrs: ATTR_LOC("1:1:1:10:1:4") });
  const p = makeElement("p", { attrs: ATTR_LOC("2:1:2:10:2:3") });
  const div = makeElement("div", { attrs: ATTR_LOC("3:1:3:10:3:5") });
  const body = makeElement("body", { children: [h1, p, div] });
  const r = walk(body).roots;
  eq("multi-top count", r.length, 3);
  eq("multi-top order", [r[0].tag, r[1].tag, r[2].tag], ["h1", "p", "div"]);
}

// 8. Cap respects MAX. We can't realistically build 501 nodes, but we can
//    drop MAX to a small value and reuse the walker. Re-implement with
//    cap=3.
{
  function walkCap(root, cap) {
    const roots = [];
    const stack = [];
    let visited = 0;
    function visit(el) {
      if (!el || el.nodeType !== 1) return;
      if (visited >= cap) return;
      let pushed = false;
      if (isAddressable(el)) {
        const loc = readLoc(el);
        if (loc) {
          const node = {
            tag: el.tagName.toLowerCase(),
            loc,
            oid: readOid(el),
            classes: readClasses(el).slice(0, 3),
            children: [],
          };
          const parent = stack.length > 0 ? stack[stack.length - 1] : null;
          if (parent) parent.children.push(node);
          else roots.push(node);
          stack.push(node);
          pushed = true;
          visited++;
        }
      }
      for (const c of el.children) {
        if (visited >= cap) break;
        visit(c);
      }
      if (pushed) stack.pop();
    }
    visit(root);
    return { roots, visited };
  }
  const e1 = makeElement("a", { attrs: ATTR_LOC("1:1:1:5:1:2") });
  const e2 = makeElement("b", { attrs: ATTR_LOC("2:1:2:5:2:2") });
  const e3 = makeElement("c", { attrs: ATTR_LOC("3:1:3:5:3:2") });
  const e4 = makeElement("d", { attrs: ATTR_LOC("4:1:4:5:4:2") });
  const e5 = makeElement("e", { attrs: ATTR_LOC("5:1:5:5:5:2") });
  const body = makeElement("body", { children: [e1, e2, e3, e4, e5] });
  const r = walkCap(body, 3);
  eq("cap respected count", r.roots.length, 3);
  eq("cap visited", r.visited, 3);
}

// 9. Classes payload truncated to first 3
{
  const div = makeElement("div", {
    attrs: {
      "data-dropin-loc": "1:1:2:1:1:5",
      class: "a b c d e f",
    },
  });
  const body = makeElement("body", { children: [div] });
  const r = walk(body).roots;
  eq("classes truncated to 3", r[0].classes, ["a", "b", "c"]);
}

// 10. Loc parse failure on malformed attr → element skipped
{
  const div = makeElement("div", {
    attrs: { "data-dropin-loc": "not-valid" },
  });
  const body = makeElement("body", { children: [div] });
  const r = walk(body).roots;
  eq("malformed loc → skipped", r, []);
}

// 11. OID present on parent only — children that lack data-dropin-id still
//     get oid: null without throwing.
{
  const child = makeElement("p", { attrs: ATTR_LOC("3:3:3:6:3:4") });
  const parent = makeElement("section", {
    attrs: ATTR_LOC_OID("2:1:5:1:2:9", "OOOOOOOO"),
    children: [child],
  });
  const body = makeElement("body", { children: [parent] });
  const r = walk(body).roots;
  eq("parent has oid", r[0].oid, "OOOOOOOO");
  eq("child oid null", r[0].children[0].oid, null);
}

// 12. Order preserved: walker emits in DOM order
{
  const items = [];
  for (let i = 0; i < 5; i++) {
    items.push(
      makeElement("li", {
        attrs: ATTR_LOC(`${i + 1}:1:${i + 1}:5:${i + 1}:3`),
      }),
    );
  }
  const ul = makeElement("ul", {
    attrs: ATTR_LOC("0:1:6:1:0:3"),
    children: items,
  });
  const body = makeElement("body", { children: [ul] });
  const r = walk(body).roots;
  eq(
    "order DOM-preserved",
    r[0].children.map((c) => c.loc.startLine),
    [1, 2, 3, 4, 5],
  );
}

// 13. Nested wrapper with mixed addressable + non-addressable siblings
{
  const direct = makeElement("p", { attrs: ATTR_LOC("3:3:3:6:3:4") });
  const wrapped = makeElement("span", {
    attrs: ATTR_LOC("5:7:5:20:5:8"),
  });
  const wrapper = makeElement("strong", { children: [wrapped] });
  const parent = makeElement("section", {
    attrs: ATTR_LOC("2:1:7:1:2:9"),
    children: [direct, wrapper],
  });
  const body = makeElement("body", { children: [parent] });
  const r = walk(body).roots;
  eq("section has 2 children (direct + hoisted)", r[0].children.length, 2);
  eq("first child is direct p", r[0].children[0].tag, "p");
  eq("second child is hoisted span", r[0].children[1].tag, "span");
}

// 14. Section -> non-addr wrapper -> addr child -> non-addr wrapper -> addr
//     grandchild. Grandchild should attach to addr child, not skip up.
{
  const grand = makeElement("em", { attrs: ATTR_LOC("8:7:8:20:8:5") });
  const wInner = makeElement("strong", { children: [grand] });
  const child = makeElement("p", {
    attrs: ATTR_LOC("4:5:9:1:4:7"),
    children: [wInner],
  });
  const wOuter = makeElement("div", { children: [child] });
  const parent = makeElement("section", {
    attrs: ATTR_LOC("2:1:11:1:2:9"),
    children: [wOuter],
  });
  const body = makeElement("body", { children: [parent] });
  const r = walk(body).roots;
  eq("p attached to section", r[0].children.length, 1);
  eq("p tag", r[0].children[0].tag, "p");
  eq("em attached to p", r[0].children[0].children.length, 1);
  eq("em tag", r[0].children[0].children[0].tag, "em");
}

// 15. Deep nesting (10 levels) walks without stack issues
{
  let cur = makeElement("leaf", {
    attrs: ATTR_LOC("10:1:10:5:10:5"),
  });
  for (let depth = 9; depth >= 0; depth--) {
    cur = makeElement(`l${depth}`, {
      attrs: ATTR_LOC(`${depth}:1:${depth + 1}:1:${depth}:5`),
      children: [cur],
    });
  }
  const body = makeElement("body", { children: [cur] });
  const r = walk(body).roots;
  let walker = r[0];
  let depth = 0;
  while (walker.children.length > 0) {
    walker = walker.children[0];
    depth++;
  }
  eq("10-deep nesting", depth, 10);
}

// 16. Sibling order under non-addressable wrapper preserves DOM order
{
  const a = makeElement("a", { attrs: ATTR_LOC("3:1:3:5:3:2") });
  const b = makeElement("b", { attrs: ATTR_LOC("4:1:4:5:4:2") });
  const wrapper = makeElement("div", { children: [a, b] });
  const body = makeElement("body", { children: [wrapper] });
  const r = walk(body).roots;
  eq("hoisted order", [r[0].tag, r[1].tag], ["a", "b"]);
}

// 17. countNodes (host-side helper)
function countNodes(nodes) {
  let n = 0;
  for (const node of nodes) n += 1 + countNodes(node.children);
  return n;
}
{
  const tree = [
    {
      tag: "section",
      children: [
        { tag: "h1", children: [] },
        { tag: "p", children: [{ tag: "span", children: [] }] },
      ],
    },
    { tag: "footer", children: [] },
  ];
  eq("countNodes", countNodes(tree), 5);
}

// 18. pickClassHint host helper (skip layout, prefer style)
function pickClassHint(classes) {
  const SKIP = [
    "flex",
    "grid",
    "block",
    "inline",
    "items-",
    "justify-",
    "content-",
    "place-",
    "gap-",
    "self-",
    "absolute",
    "relative",
    "fixed",
    "sticky",
    "static",
    "z-",
    "overflow-",
    "min-",
    "max-",
    "w-",
    "h-",
    "m-",
    "mx-",
    "my-",
    "mt-",
    "mr-",
    "mb-",
    "ml-",
    "p-",
    "px-",
    "py-",
    "pt-",
    "pr-",
    "pb-",
    "pl-",
  ];
  for (const c of classes) {
    if (!SKIP.some((p) => c === p || c.startsWith(p))) return c;
  }
  return classes[0] ?? null;
}
eq("hint skips flex", pickClassHint(["flex", "bg-blue-500", "px-4"]), "bg-blue-500");
eq("hint skips margin", pickClassHint(["mx-auto", "max-w-lg", "text-center"]), "text-center");
eq("hint falls back to first when all skipped", pickClassHint(["flex", "items-center"]), "flex");
eq("hint empty list", pickClassHint([]), null);
eq("hint single non-skip", pickClassHint(["bg-rose-500"]), "bg-rose-500");

// 19. findAncestorKeys host helper. Pure tree walk: returns the chain of
//     keys from root → parent of target. Empty when target not found.
function nodeKeyHelper(n) {
  return n.oid ? `oid:${n.oid}` : `loc:${n.tag}`;
}
function findAncestorKeys(nodes, targetKey) {
  const path = [];
  function dfs(arr, trail) {
    for (const n of arr) {
      const key = nodeKeyHelper(n);
      if (key === targetKey) {
        path.push(...trail);
        return true;
      }
      if (n.children.length > 0) {
        trail.push(key);
        if (dfs(n.children, trail)) return true;
        trail.pop();
      }
    }
    return false;
  }
  dfs(nodes, []);
  return path;
}

const sampleTree = [
  {
    tag: "section",
    oid: "S1",
    children: [
      { tag: "h1", oid: "H1", children: [] },
      {
        tag: "p",
        oid: "P1",
        children: [{ tag: "span", oid: "SP1", children: [] }],
      },
    ],
  },
  { tag: "footer", oid: "F1", children: [] },
];

eq(
  "ancestor of span",
  findAncestorKeys(sampleTree, "oid:SP1"),
  ["oid:S1", "oid:P1"],
);
eq(
  "ancestor of h1",
  findAncestorKeys(sampleTree, "oid:H1"),
  ["oid:S1"],
);
eq(
  "ancestor of section (top-level — no ancestors)",
  findAncestorKeys(sampleTree, "oid:S1"),
  [],
);
eq(
  "ancestor of footer (top-level — no ancestors)",
  findAncestorKeys(sampleTree, "oid:F1"),
  [],
);
eq(
  "ancestor not in tree → empty",
  findAncestorKeys(sampleTree, "oid:NOTHERE"),
  [],
);
eq(
  "ancestor on empty tree → empty",
  findAncestorKeys([], "oid:X"),
  [],
);

// 20. Deep ancestor chain (5 levels)
{
  const deepest = { tag: "deep", oid: "D5", children: [] };
  let cur = deepest;
  for (let i = 4; i >= 0; i--) {
    cur = { tag: `n${i}`, oid: `D${i}`, children: [cur] };
  }
  const ancestors = findAncestorKeys([cur], "oid:D5");
  eq(
    "deep ancestor chain",
    ancestors,
    ["oid:D0", "oid:D1", "oid:D2", "oid:D3", "oid:D4"],
  );
}

// 21. Ancestor walk under a non-first sibling
{
  const tree = [
    { tag: "a", oid: "A", children: [] },
    {
      tag: "b",
      oid: "B",
      children: [
        {
          tag: "c",
          oid: "C",
          children: [{ tag: "d", oid: "D", children: [] }],
        },
      ],
    },
  ];
  eq(
    "ancestor d (under second sibling)",
    findAncestorKeys(tree, "oid:D"),
    ["oid:B", "oid:C"],
  );
}

// 22. Ancestor walks for a target in the FIRST tree, then SECOND tree.
//     Verifies trail is properly reset on backtrack.
{
  const tree = [
    {
      tag: "first",
      oid: "X",
      children: [{ tag: "f-child", oid: "FC", children: [] }],
    },
    {
      tag: "second",
      oid: "Y",
      children: [{ tag: "s-child", oid: "SC", children: [] }],
    },
  ];
  eq(
    "ancestors in second tree don't leak from first",
    findAncestorKeys(tree, "oid:SC"),
    ["oid:Y"],
  );
}

console.log(`bench-tree: ${passed}/${passed + failed} passed`);
process.exit(failed === 0 ? 0 : 1);
