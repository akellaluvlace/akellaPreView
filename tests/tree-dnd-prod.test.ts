// Phase 6 ramp / audit-2026-05-04 medium-fix — direct-import tests for
// `resolveTreeDrop` + `resolveTreeDropMulti` (lib/ast/tree-dnd.ts).
// Companion benches `bench-tree-dnd.mjs` + `bench-tree-dnd-multi.mjs`
// inline 1888 LOC of clones; this file imports production directly. The
// multi-bench's inline `resolveTreeDrop` clone is already known-stale
// (returns "inside-same-parent unreachable" — pre-30th-pass shape). The
// bench can pass against itself indefinitely while production drifts;
// these prod-import cases are the counterweight signal.
//
// The resolver maps a (tree, dragOid(s), targetOid, position) onto either
// a structural op for applyReorder/applyReparent or a noop with a
// reason. It never touches source bytes.
//
// TreeNode fixtures use the iframe-bridge shape (tag/loc/oid/classes/
// children). The resolver only reads `oid` and `children`, so the rest
// gets minimal valid stubs.
//
// Test surface:
//   §1 resolveTreeDrop bails (missing oids, top-level, drop-parent oid-less)
//   §2 same-parent reorder before/after (4 directions + adjacent no-ops + self)
//   §3 same-parent inside-drop (post-30th-pass branch — drop into own parent)
//   §4 cross-parent reparent (before/after/inside + boundaries)
//   §5 cycle detection
//   §6 resolveTreeDropMulti bails + dedupe + single-oid fall-back
//   §7 cross-parent reparent-multi (DFS sort + insertIndex bumping)
//   §8 same-parent reorder-multi (leftDetaches collapsed-list math)
//   §9 mixed-multi (sameParent + crossParent in one batch)

import { describe, it, expect } from "vitest";
import {
  resolveTreeDrop,
  resolveTreeDropMulti,
} from "../lib/ast/tree-dnd";
import type { TreeNode } from "../lib/iframe-bridge";

function makeNode(
  oid: string | null,
  children: TreeNode[] = [],
): TreeNode {
  return {
    tag: "div",
    oid,
    classes: [],
    children,
    loc: { kind: "html", path: [] },
  };
}

// -- Common fixtures -----------------------------------------------------

// Tree A: <R> [A, B, C, D]
const treeA = (): TreeNode[] => [
  makeNode("R", [makeNode("A"), makeNode("B"), makeNode("C"), makeNode("D")]),
];

// Tree B: <R> [<P> [X, Y], <Q> [Z]]
const treeB = (): TreeNode[] => [
  makeNode("R", [
    makeNode("P", [makeNode("X"), makeNode("Y")]),
    makeNode("Q", [makeNode("Z")]),
  ]),
];

// Tree C: <R> [<A> [A1, A2], B]
const treeC = (): TreeNode[] => [
  makeNode("R", [
    makeNode("A", [makeNode("A1"), makeNode("A2")]),
    makeNode("B"),
  ]),
];

// Multi-root tree D: [<R1>[A], <R2>[B]]
const treeD = (): TreeNode[] => [
  makeNode("R1", [makeNode("A")]),
  makeNode("R2", [makeNode("B")]),
];

// Tree W (null-wrapper): <R> [<P>[<wrap null>[<W /> ]], <T />]
// W's parent is the null-oid wrapper.
// Used to exercise "drag element's parent has no oid" + "drop parent has no oid".
const treeWrap = (): TreeNode[] => [
  makeNode("R", [
    makeNode("P", [makeNode(null, [makeNode("W")])]),
    makeNode("T"),
  ]),
];

describe("§1 resolveTreeDrop — bails", () => {
  it("empty drag oid → noop 'drag oid missing'", () => {
    const r = resolveTreeDrop(treeA(), "", "A", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/missing/i);
  });

  it("empty target oid → noop 'target oid missing'", () => {
    const r = resolveTreeDrop(treeA(), "A", "", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/missing/i);
  });

  it("drag === target → noop 'same element'", () => {
    const r = resolveTreeDrop(treeA(), "A", "A", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/same element/i);
  });

  it("drag oid not in tree → noop 'not in tree'", () => {
    const r = resolveTreeDrop(treeA(), "MISSING", "A", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/not in tree/i);
  });

  it("target oid not in tree → noop 'not in tree'", () => {
    const r = resolveTreeDrop(treeA(), "A", "MISSING", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/not in tree/i);
  });

  it("drag is top-level → noop 'top-level'", () => {
    const r = resolveTreeDrop(treeB(), "R", "X", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/top-level/i);
  });

  it("target is top-level for before → noop 'top-level'", () => {
    // treeD is multi-root; R2 is a top-level target.
    const r = resolveTreeDrop(treeD(), "A", "R2", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/top-level/i);
  });

  it("target is top-level for after → noop 'top-level'", () => {
    const r = resolveTreeDrop(treeD(), "A", "R2", "after");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/top-level/i);
  });

  it("target is top-level for inside is OK (drop parent IS target)", () => {
    const r = resolveTreeDrop(treeD(), "A", "R2", "inside");
    expect(r).toEqual({
      kind: "reparent",
      oid: "A",
      newParentOid: "R2",
      insertIndex: 1, // R2.children = [B] → append at end
    });
  });

  it("drag's parent has no oid → noop 'parent has no oid'", () => {
    // W is inside the null-oid wrapper inside P. Drag W → W's parent is
    // the null-wrapper (not top-level — parent has children).
    const r = resolveTreeDrop(treeWrap(), "W", "T", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/parent has no oid/i);
  });

  it("drop parent has no oid (before/after on null-oid-parent target) → noop", () => {
    // Drop T (oid present) before W. Target is W; W's parent is the
    // null-oid wrapper. Drag T (in R)... wait — for this to fire, the
    // DRAG must be addressable but the DROP parent must be null-oid'd.
    // Build alt tree: T at top of R; W under null-wrapper; drag T before
    // W. T's parent is R (oid present); drop parent is null-wrapper (oid
    // missing) — drop parent oid bail fires.
    const r = resolveTreeDrop(treeWrap(), "T", "W", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/drop parent has no oid/i);
  });
});

describe("§2 resolveTreeDrop — same-parent reorder before/after", () => {
  it("before later sibling (srcIdx<anchor) → toIndex = anchor - 1", () => {
    // Drag A(0) before C(2) → toIndex = 1
    expect(resolveTreeDrop(treeA(), "A", "C", "before")).toEqual({
      kind: "reorder",
      oid: "A",
      parentOid: "R",
      toIndex: 1,
    });
  });

  it("after later sibling (srcIdx<anchor) → toIndex = anchor", () => {
    // Drag A(0) after C(2) → toIndex = 2
    expect(resolveTreeDrop(treeA(), "A", "C", "after")).toEqual({
      kind: "reorder",
      oid: "A",
      parentOid: "R",
      toIndex: 2,
    });
  });

  it("before earlier sibling (srcIdx>anchor) → toIndex = anchor", () => {
    // Drag D(3) before B(1) → toIndex = 1
    expect(resolveTreeDrop(treeA(), "D", "B", "before")).toEqual({
      kind: "reorder",
      oid: "D",
      parentOid: "R",
      toIndex: 1,
    });
  });

  it("after earlier sibling (srcIdx>anchor) → toIndex = anchor + 1", () => {
    // Drag D(3) after B(1) → toIndex = 2
    expect(resolveTreeDrop(treeA(), "D", "B", "after")).toEqual({
      kind: "reorder",
      oid: "D",
      parentOid: "R",
      toIndex: 2,
    });
  });

  it("before adjacent right sibling → noop 'no index change'", () => {
    // Drag A(0) before B(1) → toIndex = 1 - 1 = 0 = srcIdx → noop
    const r = resolveTreeDrop(treeA(), "A", "B", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/no index change/i);
  });

  it("after adjacent left sibling → noop 'no index change'", () => {
    // Drag B(1) after A(0) → toIndex = 0 + 1 = 1 = srcIdx → noop
    const r = resolveTreeDrop(treeA(), "B", "A", "after");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/no index change/i);
  });

  it("before first sibling (anchor=0 boundary) → toIndex = 0", () => {
    // Drag C(2) before A(0) → toIndex = 0
    expect(resolveTreeDrop(treeA(), "C", "A", "before")).toEqual({
      kind: "reorder",
      oid: "C",
      parentOid: "R",
      toIndex: 0,
    });
  });

  it("after last sibling (anchor=N-1 boundary) → toIndex = N - 1 (post-detach insert-after)", () => {
    // Drag A(0) after D(3) → toIndex = 3 (in original 4-list)
    expect(resolveTreeDrop(treeA(), "A", "D", "after")).toEqual({
      kind: "reorder",
      oid: "A",
      parentOid: "R",
      toIndex: 3,
    });
  });
});

describe("§3 resolveTreeDrop — same-parent inside-drop (post-30th-pass)", () => {
  it("drag into own parent (multi-child) → reorder to N-1", () => {
    // Drag A(0) inside R (R.children = [A,B,C,D] N=4) → toIndex = 3
    expect(resolveTreeDrop(treeA(), "A", "R", "inside")).toEqual({
      kind: "reorder",
      oid: "A",
      parentOid: "R",
      toIndex: 3,
    });
  });

  it("drag last child inside own parent → noop (already at end)", () => {
    // Drag D(3) inside R (last) → toIndex = 3 = srcIdx → noop
    const r = resolveTreeDrop(treeA(), "D", "R", "inside");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/no index change/i);
  });

  it("drag middle child inside own parent → toIndex = N-1", () => {
    // treeC.A has [A1, A2]. Drag A1(0) inside A → toIndex = 1
    expect(resolveTreeDrop(treeC(), "A1", "A", "inside")).toEqual({
      kind: "reorder",
      oid: "A1",
      parentOid: "A",
      toIndex: 1,
    });
  });

  it("single-child parent inside-drop → noop (drag self → toIndex 0 === srcIdx)", () => {
    const tree: TreeNode[] = [
      makeNode("R", [makeNode("P", [makeNode("X")])]),
    ];
    const r = resolveTreeDrop(tree, "X", "P", "inside");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/no index change/i);
  });
});

describe("§4 resolveTreeDrop — cross-parent reparent", () => {
  it("before target (anchor=0) → insertIndex = 0", () => {
    // Drag X (in P) before Z (in Q, idx 0) → insertIndex = 0
    expect(resolveTreeDrop(treeB(), "X", "Z", "before")).toEqual({
      kind: "reparent",
      oid: "X",
      newParentOid: "Q",
      insertIndex: 0,
    });
  });

  it("after target → insertIndex = anchor + 1", () => {
    // Drag X (in P) after Z (in Q, idx 0) → insertIndex = 1
    expect(resolveTreeDrop(treeB(), "X", "Z", "after")).toEqual({
      kind: "reparent",
      oid: "X",
      newParentOid: "Q",
      insertIndex: 1,
    });
  });

  it("inside target → insertIndex = target.children.length (append)", () => {
    // Drag X (in P) inside Q (Q.children = [Z]) → insertIndex = 1
    expect(resolveTreeDrop(treeB(), "X", "Q", "inside")).toEqual({
      kind: "reparent",
      oid: "X",
      newParentOid: "Q",
      insertIndex: 1,
    });
  });

  it("inside empty target → insertIndex = 0", () => {
    const tree: TreeNode[] = [
      makeNode("R", [
        makeNode("P", [makeNode("X")]),
        makeNode("Q"), // empty
      ]),
    ];
    expect(resolveTreeDrop(tree, "X", "Q", "inside")).toEqual({
      kind: "reparent",
      oid: "X",
      newParentOid: "Q",
      insertIndex: 0,
    });
  });

  it("inside deep nested target → reparent into nested target", () => {
    // treeC: drag B inside A1 (deep) → reparent into A1, insertIndex=0
    expect(resolveTreeDrop(treeC(), "B", "A1", "inside")).toEqual({
      kind: "reparent",
      oid: "B",
      newParentOid: "A1",
      insertIndex: 0,
    });
  });

  it("after last sibling in cross-parent target → insertIndex = N", () => {
    // treeC: drag B after A2 (in A, last child idx 1) → insertIndex = 2
    expect(resolveTreeDrop(treeC(), "B", "A2", "after")).toEqual({
      kind: "reparent",
      oid: "B",
      newParentOid: "A",
      insertIndex: 2,
    });
  });
});

describe("§5 resolveTreeDrop — cycle detection", () => {
  it("drop into descendant (inside) → cycle bail", () => {
    // treeC: drop A inside A1 (descendant of A) → cycle
    const r = resolveTreeDrop(treeC(), "A", "A1", "inside");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/cycle/i);
  });

  it("drop before descendant where dropParent IS dragNode → cycle bail", () => {
    // treeC: drop A before A2. dropParent = A (since A2's parent is A);
    // dragNode = A. dropParent === dragLoc.node → cycle.
    const r = resolveTreeDrop(treeC(), "A", "A2", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/cycle/i);
  });

  it("drop self into self via inside → fires same-element bail FIRST", () => {
    // dragOid === targetOid hits "same element" before cycle check.
    const r = resolveTreeDrop(treeA(), "A", "A", "inside");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/same element/i);
  });
});

describe("§6 resolveTreeDropMulti — bails + dedupe + fall-back", () => {
  it("empty array → noop 'no drag'", () => {
    const r = resolveTreeDropMulti(treeA(), [], "A", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/no drag/i);
  });

  it("all-falsy oids → noop 'no valid'", () => {
    const r = resolveTreeDropMulti(treeA(), ["", ""], "A", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/no valid/i);
  });

  it("single oid → fall-back (caller should use single-drag resolver)", () => {
    const r = resolveTreeDropMulti(treeA(), ["A"], "C", "before");
    expect(r.kind).toBe("fall-back");
    if (r.kind === "fall-back") expect(r.reason).toMatch(/single/i);
  });

  it("duplicates dedupe to single → fall-back", () => {
    const r = resolveTreeDropMulti(treeA(), ["A", "A"], "C", "before");
    expect(r.kind).toBe("fall-back");
    if (r.kind === "fall-back") expect(r.reason).toMatch(/single/i);
  });

  it("dedupe + drop empties + DFS-sorts (['', 'B', 'A', 'B'] → unique=[B,A] → sorted [A,B])", () => {
    // unique=[B, A] after filter+dedupe. Then same-parent reorder-multi
    // sorts by srcIdx → [A, B]. Use 'after C' to dodge the no-op fast
    // path: anchor=2, leftDetaches=2, toIndex(after)=2-2+1=1; the block
    // [A,B] has sortedSrcIndices=[0,1] contiguous, but starts at 0 ≠ 1
    // so reorder proceeds.
    const r = resolveTreeDropMulti(treeA(), ["", "B", "A", "B"], "C", "after");
    expect(r.kind).toBe("reorder-multi");
    if (r.kind === "reorder-multi") {
      expect(r.oids).toEqual(["A", "B"]);
      expect(r.toIndex).toBe(1);
    }
  });

  it("duplicate dragOid is collapsed (load-bearing — would double-count if not)", () => {
    // ['B', 'B', 'D'] → unique=[B, D] (second B dropped).
    // Without dedupe, sameParent=[{B,1},{B,1},{D,3}] → sortedOids=[B,B,D]
    // and the engine would re-insert B twice. Verify dedupe.
    const r = resolveTreeDropMulti(treeA(), ["B", "B", "D"], "A", "before");
    expect(r.kind).toBe("reorder-multi");
    if (r.kind === "reorder-multi") {
      expect(r.oids).toEqual(["B", "D"]);
    }
  });

  it("target not in tree → noop", () => {
    const r = resolveTreeDropMulti(treeA(), ["A", "B"], "MISSING", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/not in tree/i);
  });

  it("target is top-level (before) → noop 'top-level'", () => {
    const r = resolveTreeDropMulti(treeD(), ["A", "B"], "R2", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/top-level/i);
  });

  it("target in dragged set → noop 'same element'", () => {
    const r = resolveTreeDropMulti(treeA(), ["A", "B"], "B", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/same element/i);
  });

  it("drag oid not in tree → noop", () => {
    const r = resolveTreeDropMulti(treeA(), ["A", "MISSING"], "C", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/not in tree/i);
  });

  it("drag oid is top-level → noop 'top-level'", () => {
    const r = resolveTreeDropMulti(treeB(), ["R", "X"], "Z", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/top-level/i);
  });

  it("cycle: drop into descendant of dragged oid → noop 'cycle'", () => {
    // treeC: drag {A, B} inside A1 (A1 is descendant of A) → cycle on A
    const r = resolveTreeDropMulti(treeC(), ["A", "B"], "A1", "inside");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/cycle/i);
  });
});

describe("§7 resolveTreeDropMulti — cross-parent reparent-multi", () => {
  // Tree with three parents: <root>[<P1>[A,B], <P2>[C,D], <P3>[E,F]]
  const T_THREE_PARENTS = (): TreeNode[] => [
    makeNode("root", [
      makeNode("P1", [makeNode("A"), makeNode("B")]),
      makeNode("P2", [makeNode("C"), makeNode("D")]),
      makeNode("P3", [makeNode("E"), makeNode("F")]),
    ]),
  ];

  it("two cross-parent oids before target → DFS-sorted ops, insertIndex bumped", () => {
    // Drag {A, E} (in P1, P3) before D (in P2, anchor=1). Both reparent into P2.
    // baseInsertIndex = anchorIdx = 1. DFS order: A, E. Bumped: 1, 2.
    const r = resolveTreeDropMulti(T_THREE_PARENTS(), ["A", "E"], "D", "before");
    expect(r.kind).toBe("reparent-multi");
    if (r.kind === "reparent-multi") {
      expect(r.newParentOid).toBe("P2");
      expect(r.ops.length).toBe(2);
      expect(r.ops[0]!).toEqual({ oid: "A", newParentOid: "P2", insertIndex: 1 });
      expect(r.ops[1]!).toEqual({ oid: "E", newParentOid: "P2", insertIndex: 2 });
    }
  });

  it("DFS sort regardless of input order (input [E, A] → output [A, E])", () => {
    const r = resolveTreeDropMulti(T_THREE_PARENTS(), ["E", "A"], "D", "before");
    expect(r.kind).toBe("reparent-multi");
    if (r.kind === "reparent-multi") {
      expect(r.ops.map((o) => o.oid)).toEqual(["A", "E"]);
    }
  });

  it("after target → insertIndex base = anchor + 1", () => {
    const r = resolveTreeDropMulti(T_THREE_PARENTS(), ["A", "E"], "D", "after");
    expect(r.kind).toBe("reparent-multi");
    if (r.kind === "reparent-multi") {
      expect(r.ops[0]!.insertIndex).toBe(2);
      expect(r.ops[1]!.insertIndex).toBe(3);
    }
  });

  it("inside target → insertIndex base = target.children.length", () => {
    // Drag {A, E} inside P2 (P2.children = [C, D] → length 2)
    const r = resolveTreeDropMulti(T_THREE_PARENTS(), ["A", "E"], "P2", "inside");
    expect(r.kind).toBe("reparent-multi");
    if (r.kind === "reparent-multi") {
      expect(r.newParentOid).toBe("P2");
      expect(r.ops[0]!.insertIndex).toBe(2);
      expect(r.ops[1]!.insertIndex).toBe(3);
    }
  });

  it("inside empty target → insertIndex base = 0", () => {
    const tree: TreeNode[] = [
      makeNode("root", [
        makeNode("P1", [makeNode("A"), makeNode("B")]),
        makeNode("P2"), // empty
      ]),
    ];
    const r = resolveTreeDropMulti(tree, ["A", "B"], "P2", "inside");
    expect(r.kind).toBe("reparent-multi");
    if (r.kind === "reparent-multi") {
      expect(r.ops[0]!.insertIndex).toBe(0);
      expect(r.ops[1]!.insertIndex).toBe(1);
    }
  });

  it("three cross-parent oids → ops bumped 1, 2, 3", () => {
    // Drag {A, B, F} before D. A,B in P1; F in P3. Reparent into P2 anchor=1.
    // DFS: A, B, F. Bumped: 1, 2, 3.
    const r = resolveTreeDropMulti(T_THREE_PARENTS(), ["A", "B", "F"], "D", "before");
    expect(r.kind).toBe("reparent-multi");
    if (r.kind === "reparent-multi") {
      expect(r.ops.map((o) => [o.oid, o.insertIndex])).toEqual([
        ["A", 1],
        ["B", 2],
        ["F", 3],
      ]);
    }
  });
});

describe("§8 resolveTreeDropMulti — same-parent reorder-multi", () => {
  // Single parent with 5 children: [A, B, C, D, E]
  const T_FIVE = (): TreeNode[] => [
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

  it("before target with leftDetaches (drag {B,C} before A)", () => {
    // anchorIdx=0 (A), leftDetaches=0, toIndex(before) = 0 - 0 = 0
    // sortedOids = [B, C] (sorted by srcIdx 1, 2)
    const r = resolveTreeDropMulti(T_FIVE(), ["B", "C"], "A", "before");
    expect(r.kind).toBe("reorder-multi");
    if (r.kind === "reorder-multi") {
      expect(r.parentOid).toBe("P1");
      expect(r.oids).toEqual(["B", "C"]);
      expect(r.toIndex).toBe(0);
    }
  });

  it("after target with leftDetaches (drag {B,C} after E)", () => {
    // anchorIdx=4 (E), leftDetaches=2 (B,C both <4),
    // toIndex(after) = 4 - 2 + 1 = 3. Result: [A, D, E, B, C].
    const r = resolveTreeDropMulti(T_FIVE(), ["B", "C"], "E", "after");
    expect(r.kind).toBe("reorder-multi");
    if (r.kind === "reorder-multi") {
      expect(r.toIndex).toBe(3);
      expect(r.oids).toEqual(["B", "C"]);
    }
  });

  it("target between dragged (drag {B,D} after C)", () => {
    // anchorIdx=2 (C), leftDetaches=1 (B<2; D>2),
    // toIndex(after) = 2 - 1 + 1 = 2. Collapsed [A, C, E]; insert at 2.
    const r = resolveTreeDropMulti(T_FIVE(), ["B", "D"], "C", "after");
    expect(r.kind).toBe("reorder-multi");
    if (r.kind === "reorder-multi") {
      expect(r.toIndex).toBe(2);
      expect(r.oids).toEqual(["B", "D"]);
    }
  });

  it("contiguous block already at slot → noop 'no index change'", () => {
    // Drag {A, B} before C in [A, B, C, D, E].
    // anchorIdx=2, leftDetaches=2, toIndex(before) = 0.
    // sortedSrcIndices=[0,1] contiguous; starts at 0 = toIndex → noop.
    const r = resolveTreeDropMulti(T_FIVE(), ["A", "B"], "C", "before");
    expect(r.kind).toBe("noop");
    if (r.kind === "noop") expect(r.reason).toMatch(/no index change/i);
  });

  it("non-contiguous srcIndices DO NOT trigger no-op fast path", () => {
    // Drag {A, C} before D in [A, B, C, D, E].
    // anchorIdx=3, leftDetaches=2, toIndex(before) = 1.
    // sortedSrcIndices=[0,2] NOT contiguous → reorder-multi proceeds.
    const r = resolveTreeDropMulti(T_FIVE(), ["A", "C"], "D", "before");
    expect(r.kind).toBe("reorder-multi");
    if (r.kind === "reorder-multi") {
      expect(r.oids).toEqual(["A", "C"]);
      expect(r.toIndex).toBe(1);
    }
  });

  it("inside-drop (target IS dragParent) → reorder-multi toIndex = N - K", () => {
    // Drag {A, B} inside P1 (parent of both). N=5, K=2 → toIndex=3.
    const r = resolveTreeDropMulti(T_FIVE(), ["A", "B"], "P1", "inside");
    expect(r.kind).toBe("reorder-multi");
    if (r.kind === "reorder-multi") {
      expect(r.parentOid).toBe("P1");
      expect(r.oids).toEqual(["A", "B"]);
      expect(r.toIndex).toBe(3);
    }
  });

  it("DFS sort regardless of input order (input [D, B] → output [B, D])", () => {
    const r = resolveTreeDropMulti(T_FIVE(), ["D", "B"], "C", "after");
    expect(r.kind).toBe("reorder-multi");
    if (r.kind === "reorder-multi") {
      expect(r.oids).toEqual(["B", "D"]);
    }
  });
});

describe("§9 resolveTreeDropMulti — mixed-multi (sameParent + crossParent)", () => {
  // Tree: <root>[<P_A>[a1, a2, a3, a4], <P_B>[b1, b2]]
  const T_MIXED = (): TreeNode[] => [
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

  it("before target: sameParent reorder + crossParent reparent bumped", () => {
    // Drag {a1, a3, b1} before a4 (in P_A, anchor=3).
    // sameParent=[a1@0, a3@2], leftDetaches=2,
    // sameToIndex(before)=3-2=1. baseInsertIndex=1+2=3.
    // Cross DFS=[b1] insertIndex=3.
    const r = resolveTreeDropMulti(T_MIXED(), ["a1", "a3", "b1"], "a4", "before");
    expect(r.kind).toBe("mixed-multi");
    if (r.kind === "mixed-multi") {
      expect(r.parentOid).toBe("P_A");
      expect(r.sameParentOids).toEqual(["a1", "a3"]);
      expect(r.sameParentToIndex).toBe(1);
      expect(r.crossParentOps.length).toBe(1);
      expect(r.crossParentOps[0]!).toEqual({
        oid: "b1",
        newParentOid: "P_A",
        insertIndex: 3,
      });
    }
  });

  it("after target: insertIndex base = sameToIndex + same-block length", () => {
    // Drag {a1, a3, b1} after a4. anchorIdx=3, leftDetaches=2,
    // sameToIndex(after)=3-2+1=2. baseInsertIndex=2+2=4.
    // Cross DFS=[b1] insertIndex=4.
    const r = resolveTreeDropMulti(T_MIXED(), ["a1", "a3", "b1"], "a4", "after");
    expect(r.kind).toBe("mixed-multi");
    if (r.kind === "mixed-multi") {
      expect(r.sameParentToIndex).toBe(2);
      expect(r.crossParentOps[0]!.insertIndex).toBe(4);
    }
  });

  it("inside target: dropParent IS target, sameToIndex = N-K, base = N", () => {
    // Drag {a1, b1} inside P_A. P_A.children = [a1,a2,a3,a4] N=4.
    // sameParent=[a1@0], K=1. sameToIndex = 4 - 1 = 3.
    // baseInsertIndex = 4 (the count BEFORE step 2; reorder doesn't change count).
    // Cross DFS=[b1] insertIndex=4.
    const r = resolveTreeDropMulti(T_MIXED(), ["a1", "b1"], "P_A", "inside");
    expect(r.kind).toBe("mixed-multi");
    if (r.kind === "mixed-multi") {
      expect(r.parentOid).toBe("P_A");
      expect(r.sameParentOids).toEqual(["a1"]);
      expect(r.sameParentToIndex).toBe(3);
      expect(r.crossParentOps[0]!).toEqual({
        oid: "b1",
        newParentOid: "P_A",
        insertIndex: 4,
      });
    }
  });

  it("multiple cross-parent ops in mixed-multi are DFS-sorted + bumped", () => {
    // Drag {a1, b1, b2} before a4. a1 stays in P_A; b1, b2 move from P_B.
    // sameParent=[a1@0]. anchorIdx=3, leftDetaches=1, sameToIndex(before)=2.
    // baseInsertIndex = 2 + 1 = 3.
    // Cross DFS: b1, b2. Bumped: 3, 4.
    const r = resolveTreeDropMulti(T_MIXED(), ["a1", "b1", "b2"], "a4", "before");
    expect(r.kind).toBe("mixed-multi");
    if (r.kind === "mixed-multi") {
      expect(r.sameParentOids).toEqual(["a1"]);
      expect(r.sameParentToIndex).toBe(2);
      expect(r.crossParentOps.map((o) => [o.oid, o.insertIndex])).toEqual([
        ["b1", 3],
        ["b2", 4],
      ]);
    }
  });
});
