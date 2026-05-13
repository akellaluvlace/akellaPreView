import { describe, it, expect } from "vitest";
import { collectCanvasShiftClickRangeOids } from "../lib/canvas-range";
import type { TreeNode } from "../lib/iframe-bridge";

// Prod-import test for lib/canvas-range.ts. Counterweight to the bench
// inline-mirror anti-pattern (scripts/bench-canvas-range.mjs inlines
// its own copy of the DFS flatten + range slice).
//
// The helper takes a tree (post-iframe-emit shape from Workspace's
// tree state), an anchor oid (current primary selection), and a
// clicked oid (the shift-click target). It returns
// [clickedOid, ...rest in DFS order between anchor and clicked
// inclusive], so the dispatcher can promote `clicked` to primary and
// demote the rest to additionalOids.

const tn = (
  oid: string | null,
  children: TreeNode[] = [],
  tag = "div",
): TreeNode => ({
  tag,
  loc: { kind: "html", path: [] },
  oid,
  classes: [],
  children,
});

describe("lib/canvas-range — DFS flatten order", () => {
  it("treats parent as preceding its children", () => {
    // tree: A → [B, C]
    // DFS: A, B, C.
    const tree = [tn("a", [tn("b"), tn("c")])];
    expect(collectCanvasShiftClickRangeOids(tree, "a", "c")).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("descends left subtree fully before moving to right sibling", () => {
    // tree: root → [A → [A1, A2], B → [B1]]
    // DFS: root, A, A1, A2, B, B1.
    const tree = [
      tn("root", [
        tn("A", [tn("A1"), tn("A2")]),
        tn("B", [tn("B1")]),
      ]),
    ];
    // Range root..B1 = the full DFS list.
    expect(collectCanvasShiftClickRangeOids(tree, "root", "B1")).toEqual([
      "B1",
      "root",
      "A",
      "A1",
      "A2",
      "B",
    ]);
  });

  it("works on multi-root trees (forest input)", () => {
    // Forest: [A, B]
    // DFS: A, B.
    const tree = [tn("A"), tn("B")];
    expect(collectCanvasShiftClickRangeOids(tree, "A", "B")).toEqual(["B", "A"]);
  });
});

describe("lib/canvas-range — range inclusivity + ordering", () => {
  it("places clicked first in the output, prior anchor follows", () => {
    // Spec: "Clicked first (becomes the new primary), remaining range
    // members in DFS order."
    const tree = [tn("p", [tn("c1"), tn("c2"), tn("c3"), tn("c4")])];
    const out = collectCanvasShiftClickRangeOids(tree, "c1", "c3");
    expect(out[0]).toBe("c3");
    // c1 (anchor) and c2 (in between) follow in DFS order, clicked
    // skipped from that loop.
    expect(out).toEqual(["c3", "c1", "c2"]);
  });

  it("includes anchor as a range member (inclusive)", () => {
    const tree = [tn("p", [tn("a"), tn("b")])];
    const out = collectCanvasShiftClickRangeOids(tree, "a", "b");
    expect(out).toContain("a");
    expect(out).toContain("b");
  });

  it("symmetric direction: anchor after clicked in DFS order", () => {
    const tree = [tn("p", [tn("a"), tn("b"), tn("c")])];
    // Forward: anchor=a, clicked=c → [c, a, b].
    const fwd = collectCanvasShiftClickRangeOids(tree, "a", "c");
    // Backward: anchor=c, clicked=a → [a, b, c].
    const bwd = collectCanvasShiftClickRangeOids(tree, "c", "a");
    // Same set, different lead element.
    expect(fwd[0]).toBe("c");
    expect(bwd[0]).toBe("a");
    expect(new Set(fwd)).toEqual(new Set(bwd));
  });

  it("returns [clicked] when anchor === clicked (zero-length range)", () => {
    // Spec: caller's prevPrimaryOid===newOid guard usually short-
    // circuits before this helper, but the helper itself handles it
    // sanely — output is just [clicked], the in-range loop's dedupe
    // skips the clicked oid.
    const tree = [tn("a"), tn("b")];
    expect(collectCanvasShiftClickRangeOids(tree, "a", "a")).toEqual(["a"]);
  });

  it("returns [clicked, anchor] for adjacent oids", () => {
    const tree = [tn("a"), tn("b")];
    expect(collectCanvasShiftClickRangeOids(tree, "a", "b")).toEqual(["b", "a"]);
  });
});

describe("lib/canvas-range — non-OID nodes excluded", () => {
  it("skips parents that have null oid in DFS list (children are still walked)", () => {
    // Mirrors the spec line: "Non-OID nodes ... are skipped — the
    // canvas's selection model only addresses OID-bearing nodes."
    // tree: nullRoot → [a, b]
    const tree = [tn(null, [tn("a"), tn("b")])];
    // The nullRoot is not in the oid list; DFS = [a, b].
    expect(collectCanvasShiftClickRangeOids(tree, "a", "b")).toEqual(["b", "a"]);
  });

  it("traverses through null-oid intermediates without including them", () => {
    // tree: A → [nullMid → [B, C]]
    // DFS oid list (skipping nullMid): A, B, C.
    const tree = [tn("A", [tn(null, [tn("B"), tn("C")])])];
    expect(collectCanvasShiftClickRangeOids(tree, "A", "C")).toEqual([
      "C",
      "A",
      "B",
    ]);
  });

  it("returns [] when both targets are null-oid intermediates", () => {
    // Both anchor and clicked names point at oids that don't exist.
    const tree = [tn(null, [tn("real")])];
    expect(collectCanvasShiftClickRangeOids(tree, "missing-a", "missing-b")).toEqual(
      [],
    );
  });
});

describe("lib/canvas-range — missing oid fallthrough", () => {
  it("returns [] when anchor oid is not in the tree", () => {
    const tree = [tn("a"), tn("b")];
    expect(collectCanvasShiftClickRangeOids(tree, "missing", "b")).toEqual([]);
  });

  it("returns [] when clicked oid is not in the tree", () => {
    const tree = [tn("a"), tn("b")];
    expect(collectCanvasShiftClickRangeOids(tree, "a", "missing")).toEqual([]);
  });

  it("returns [] when both are missing", () => {
    const tree = [tn("a"), tn("b")];
    expect(collectCanvasShiftClickRangeOids(tree, "x", "y")).toEqual([]);
  });

  it("returns [] for an empty tree", () => {
    expect(collectCanvasShiftClickRangeOids([], "a", "b")).toEqual([]);
  });
});

describe("lib/canvas-range — cross-subtree ranges", () => {
  it("spans across siblings of different subtrees", () => {
    // tree: root → [A → [A1, A2], B → [B1, B2]]
    // DFS: root, A, A1, A2, B, B1, B2.
    // Range A2..B1 = [A2, B, B1].
    const tree = [
      tn("root", [
        tn("A", [tn("A1"), tn("A2")]),
        tn("B", [tn("B1"), tn("B2")]),
      ]),
    ];
    const out = collectCanvasShiftClickRangeOids(tree, "A2", "B1");
    expect(out[0]).toBe("B1");
    // In-range loop produces A2, B (then skips B1, the clicked).
    expect(out).toEqual(["B1", "A2", "B"]);
  });

  it("spans ancestor → descendant", () => {
    // tree: root → [A → [A1 → [A1a]]]
    // DFS: root, A, A1, A1a.
    // Range root..A1a = full list.
    const tree = [
      tn("root", [tn("A", [tn("A1", [tn("A1a")])])]),
    ];
    expect(collectCanvasShiftClickRangeOids(tree, "root", "A1a")).toEqual([
      "A1a",
      "root",
      "A",
      "A1",
    ]);
  });

  it("spans descendant → ancestor (reverse)", () => {
    const tree = [
      tn("root", [tn("A", [tn("A1", [tn("A1a")])])]),
    ];
    // Anchor=A1a, clicked=root.
    expect(collectCanvasShiftClickRangeOids(tree, "A1a", "root")).toEqual([
      "root",
      "A",
      "A1",
      "A1a",
    ]);
  });
});

describe("lib/canvas-range — output shape invariants", () => {
  it("never duplicates the clicked oid", () => {
    // Sanity: even when clicked is in the middle of the range, it
    // appears exactly once (as the lead element).
    const tree = [tn("p", [tn("a"), tn("b"), tn("c"), tn("d")])];
    const out = collectCanvasShiftClickRangeOids(tree, "a", "c");
    const clickedCount = out.filter((o) => o === "c").length;
    expect(clickedCount).toBe(1);
  });

  it("produces exactly (range size) elements when range is contiguous", () => {
    const tree = [tn("p", [tn("a"), tn("b"), tn("c"), tn("d"), tn("e")])];
    // Range b..d is 3 elements wide (b, c, d).
    const out = collectCanvasShiftClickRangeOids(tree, "b", "d");
    expect(out.length).toBe(3);
  });

  it("does NOT include out-of-range siblings", () => {
    const tree = [tn("p", [tn("a"), tn("b"), tn("c"), tn("d"), tn("e")])];
    const out = collectCanvasShiftClickRangeOids(tree, "b", "d");
    expect(out).not.toContain("a");
    expect(out).not.toContain("e");
  });

  it("preserves DFS order of in-range members past the clicked lead", () => {
    // Lead = clicked; rest must be in DFS order matching the tree.
    const tree = [tn("p", [tn("a"), tn("b"), tn("c"), tn("d")])];
    const out = collectCanvasShiftClickRangeOids(tree, "a", "d");
    expect(out).toEqual(["d", "a", "b", "c"]);
  });
});
