// Phase 6 ramp — pure resolver for tree drag-and-drop. Maps a (tree,
// dragOid, targetOid, position) triple onto either an `applyReorder` or
// an `applyReparent` operation, OR a no-op with a reason. Lives next to
// scope.ts / patch-class-by-oid.ts since it operates on the
// iframe-emitted tree shape, not on source bytes — the actual edit
// engine is still applyReorder / applyReparent.
//
// Position semantics:
//   - "before" / "after" anchor relative to `targetOid`: drop slot is
//     in target's PARENT, indexed by target's position.
//   - "inside" anchors inside `targetOid` itself: drop slot is the LAST
//     child of target (append-at-end). v1 doesn't expose a precise
//     between-children indicator inside a target — vibecoders can drop
//     onto a row to "make this its parent" and then nudge with
//     before/after to land at a specific slot.
//
// The resolver does NOT touch source bytes. It just produces the
// structural op the caller should hand to applyReorder / applyReparent.
// The engines bail again on their own invariants (interleaved text,
// self-closing parent, etc.) — defense in depth.
//
// Reorder vs reparent: when the drop's effective parent equals the
// drag's current parent, the move stays inside one children list →
// reorder. Otherwise → reparent.
//
// Cycle detection: when the drop's effective parent is the drag node
// itself OR any descendant of it, the move would re-parent the drag
// into its own subtree. Bail. (applyReparent also catches this, but the
// resolver's bail is cheaper and produces a cleaner reason for the
// gesture-side toast.)
//
// Index math (reorder, same parent):
//   - "before Y" at original index t, src at original index s:
//     · s < t → splice removes src and Y shifts left → toIndex = t - 1
//     · s > t → Y unchanged → toIndex = t
//     · s = t → src and Y are the same row → no-op
//   - "after Y" at original index t, src at original index s:
//     · s < t → splice removes src and Y shifts left → toIndex = t
//     · s > t → Y unchanged → toIndex = t + 1
//     · s = t → "after self" is the same slot src already occupies → no-op
//   - "inside Y" with same parent only fires when Y has no children AND
//     Y === target's parent's child at idx that === src; defensive — we
//     route to reparent for "inside" so this branch never lands here.
//
// Index math (reparent, different parent):
//   - "before Y" → insertIndex = t (Y's index in new parent)
//   - "after Y"  → insertIndex = t + 1
//   - "inside Y" → insertIndex = Y.children-with-OIDs count (append)

import type { TreeNode } from "../iframe-bridge";

export type DropPosition = "before" | "after" | "inside";

export type ResolveTreeDropResult =
  | {
      kind: "reorder";
      oid: string;
      parentOid: string;
      toIndex: number;
    }
  | {
      kind: "reparent";
      oid: string;
      newParentOid: string;
      insertIndex: number;
    }
  | { kind: "noop"; reason: string };

interface NodeLocator {
  node: TreeNode;
  parent: TreeNode | null;
  index: number;
}

function findNodeByOid(
  arr: ReadonlyArray<TreeNode>,
  oid: string,
  parent: TreeNode | null,
): NodeLocator | null {
  for (let i = 0; i < arr.length; i++) {
    const n = arr[i]!;
    if (n.oid === oid) return { node: n, parent, index: i };
    if (n.children.length > 0) {
      const r = findNodeByOid(n.children, oid, n);
      if (r) return r;
    }
  }
  return null;
}

function isSelfOrDescendant(
  candidate: TreeNode,
  ofNode: TreeNode,
): boolean {
  if (candidate === ofNode) return true;
  for (const c of ofNode.children) {
    if (isSelfOrDescendant(candidate, c)) return true;
  }
  return false;
}

export function resolveTreeDrop(
  tree: ReadonlyArray<TreeNode>,
  dragOid: string,
  targetOid: string,
  position: DropPosition,
): ResolveTreeDropResult {
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

  // Compute "effective drop parent" + "anchor index" based on position.
  // For "inside": the drop parent IS the target.
  // For "before"/"after": the drop parent is the target's parent.
  let dropParent: TreeNode;
  let anchorIdx: number; // target's index in its own parent's children — only used for before/after
  if (position === "inside") {
    dropParent = tgtLoc.node;
    anchorIdx = -1; // unused
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

  // Cycle: dropping into a node that IS or is INSIDE the drag's subtree.
  if (isSelfOrDescendant(dropParent, dragLoc.node)) {
    return {
      kind: "noop",
      reason: "would create a cycle — can't drop into self or descendant",
    };
  }

  // Same parent → reorder. Different parent → reparent.
  const sameParent = dropParent === dragParent;

  if (sameParent) {
    // Index math against the EXISTING children list, oid-aware (we index
    // the same list applyReorder's "real children" enumeration uses;
    // applyReorder itself bails if interleaved text or non-elements
    // appear, so we don't need to filter here — we trust the tree shape).
    const srcIdx = dragLoc.index;
    if (position === "inside") {
      // Thirtieth-pass — single-drag mirror of the multi same-parent
      // inside-drop landed in twenty-ninth pass. User dragged X into
      // its own parent Y (target IS dragParent). Intent: move X to
      // the end of Y. Engine `applyReorder` catches the no-op case
      // (fromIndex === toIndex when X is already last) but we report
      // it here too so the gesture-side bail toast surfaces. Math
      // matches the multi K=1 case: toIndex = N - 1 (post-detach
      // append slot, where N = dropParent.children.length).
      //
      // Note this branch was previously bailed "unreachable" — that
      // analysis missed the case where the target IS dragParent (not
      // a sibling). Sibling inside-drop still routes through the
      // reparent branch below since dropParent !== dragParent there.
      const toIndex = dropParent.children.length - 1;
      if (toIndex === srcIdx) {
        return { kind: "noop", reason: "no index change" };
      }
      return {
        kind: "reorder",
        oid: dragOid,
        parentOid: dropParentOid,
        toIndex,
      };
    }
    let toIndex: number;
    if (position === "before") {
      if (srcIdx === anchorIdx) {
        return {
          kind: "noop",
          reason: "drop before self — same slot",
        };
      }
      toIndex = srcIdx < anchorIdx ? anchorIdx - 1 : anchorIdx;
    } else {
      // "after"
      if (srcIdx === anchorIdx) {
        return {
          kind: "noop",
          reason: "drop after self — same slot",
        };
      }
      toIndex = srcIdx < anchorIdx ? anchorIdx : anchorIdx + 1;
    }
    if (toIndex === srcIdx) {
      return { kind: "noop", reason: "no index change" };
    }
    return {
      kind: "reorder",
      oid: dragOid,
      parentOid: dropParentOid,
      toIndex,
    };
  }

  // Reparent. insertIndex math is post-detach, but applyReparent
  // computes the detach itself — we just hand it the new parent's
  // pre-state index.
  let insertIndex: number;
  if (position === "before") {
    insertIndex = anchorIdx;
  } else if (position === "after") {
    insertIndex = anchorIdx + 1;
  } else {
    // "inside" — append at end. Use the dropParent's children count;
    // applyReparent's range check is `[0, newRealChildren.length]`
    // (inclusive upper bound for append).
    insertIndex = dropParent.children.length;
  }

  return {
    kind: "reparent",
    oid: dragOid,
    newParentOid: dropParentOid,
    insertIndex,
  };
}

// Phase 6 ramp — multi-target resolver. Maps a (tree, dragOids[], target,
// position) onto either a coordinated REPARENT batch (cross-parent) or
// a coordinated REORDER batch (same-parent). Twenty-seventh pass added
// the same-parent reorder branch on top of the twenty-sixth-pass cross-
// parent reparent branch.
//
// Cross-parent reparent (every dragged oid lives in a DIFFERENT parent
// than the drop's effective parent): the resolver produces one
// `ReparentMultiOp` per oid, all with the same `newParentOid`. Sorting
// by tree-DFS + bumping insertIndex_i = baseInsertIndex + i preserves
// the dragged set's original ordering at the drop slot when the engine
// applies ops sequentially against a running source.
//
// Same-parent reorder (every dragged oid lives in the SAME parent as
// the target): the resolver produces a SINGLE `reorder-multi` op
// describing the moved block. Per-op bumping doesn't compose for
// reorder because each `applyReorder` detach + insert against the
// running source rewrites the parent's child list — a naive pair like
// `{D, F} BEFORE A` reverses to `{F, D, A, ...}`. The batched engine
// (`applyReorderMulti`) detaches the entire dragged set first, then
// re-inserts the block at one collapsed-list index, which avoids the
// reversal. The collapsed-list math:
//
//     leftDetaches = count of (srcIdx < anchorIdx)
//     position === "before" → toIndex = anchorIdx - leftDetaches
//     position === "after"  → toIndex = anchorIdx - leftDetaches + 1
//
// where anchorIdx is the target's index in the shared parent. The
// dragged oids are sorted by their srcIdx (which is parent-DFS) so the
// engine can splice the moved block in the user's expected order.
//
// Hard noops (cycle, missing oid, top-level drag, target lost on re-
// resolve) propagate as kind: "noop" and abort the whole batch. Mixed
// reorder + reparent batches (some dragged oids share parent with
// target, others don't) return kind: "fall-back" so the caller routes
// the user's grabbed row through the single-drag path. The
// `reorder-multi` no-op (block already at the drop slot — sorted
// srcIndices form a consecutive run starting at toIndex) returns
// kind: "noop" with reason "no index change", matching the single-op
// `resolveTreeDrop`'s contract.

export interface ReparentMultiOp {
  oid: string;
  newParentOid: string;
  insertIndex: number;
}

export type ResolveTreeDropMultiResult =
  | {
      kind: "reparent-multi";
      newParentOid: string;
      ops: ReparentMultiOp[];
    }
  | {
      kind: "reorder-multi";
      parentOid: string;
      oids: string[];
      toIndex: number;
    }
  | {
      // Twenty-eighth pass — mixed-bucket multi-DnD. Some dragged oids
      // share the drop parent (need reorder), others live elsewhere
      // (need reparent). The engine layer applies reorder-multi FIRST
      // (against the original source) then sequentially reparents each
      // cross item with insertIndex bumped so all dragged items land as
      // a single contiguous DFS-sorted block adjacent to the drop slot.
      // Same-parent items occupy the front of the block (their srcIdx
      // ordering becomes block-internal order); cross-parent items
      // occupy the back of the block (DFS order across all dragged
      // oids' parents). Caller should run via Workspace's
      // handleTreeDndMixed which composes applyReorderMulti +
      // applyReparent under one setCode → one undo entry.
      kind: "mixed-multi";
      parentOid: string;
      sameParentOids: string[];
      sameParentToIndex: number;
      crossParentOps: ReparentMultiOp[];
    }
  | { kind: "fall-back"; reason: string }
  | { kind: "noop"; reason: string };

function computeDfsIndex(
  tree: ReadonlyArray<TreeNode>,
): Map<string, number> {
  const map = new Map<string, number>();
  let i = 0;
  function walk(arr: ReadonlyArray<TreeNode>) {
    for (const n of arr) {
      if (n.oid) map.set(n.oid, i++);
      if (n.children.length > 0) walk(n.children);
    }
  }
  walk(tree);
  return map;
}

export function resolveTreeDropMulti(
  tree: ReadonlyArray<TreeNode>,
  dragOids: ReadonlyArray<string>,
  targetOid: string,
  position: DropPosition,
): ResolveTreeDropMultiResult {
  if (dragOids.length === 0) {
    return { kind: "noop", reason: "no drag oids" };
  }
  // De-dupe while preserving first-seen order. A duplicate in the input
  // would otherwise count twice in the index-bumping math.
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const o of dragOids) {
    if (!o || seen.has(o)) continue;
    seen.add(o);
    unique.push(o);
  }
  if (unique.length === 0) {
    return { kind: "noop", reason: "no valid drag oids" };
  }
  if (unique.length === 1) {
    return {
      kind: "fall-back",
      reason: "single drag oid — caller should use resolveTreeDrop",
    };
  }
  // Twenty-seventh-pass refactor: bypass per-op `resolveTreeDrop` for
  // the bucketing step. The single-op resolver returns kind: "noop" with
  // reason "no index change" for dragged oids that happen to be adjacent
  // to the target (e.g. drag {B, D} after C — D is already directly
  // after C, single-op says "no change", but D is still a participant in
  // the batch). Treating that as a hard batch-aborting noop is wrong —
  // we'd refuse perfectly valid multi-reorders. So instead, classify
  // each dragged oid against the drop's effective parent directly via
  // tree lookups, and only fail on hard errors (cycle, missing, top-
  // level, target-in-set).
  const tgtLoc = findNodeByOid(tree, targetOid, null);
  if (!tgtLoc) {
    return {
      kind: "noop",
      reason: `target oid "${targetOid}" not in tree`,
    };
  }
  let dropParent: TreeNode;
  let anchorIdx: number;
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

  type SameParentEntry = { oid: string; srcIdx: number };
  type CrossParentEntry = { oid: string; node: TreeNode };
  const sameParent: SameParentEntry[] = [];
  const crossParent: CrossParentEntry[] = [];
  for (const oid of unique) {
    if (oid === targetOid) {
      return { kind: "noop", reason: "drag and target are the same element" };
    }
    const loc = findNodeByOid(tree, oid, null);
    if (!loc) {
      return { kind: "noop", reason: `drag oid "${oid}" not in tree` };
    }
    if (!loc.parent) {
      return {
        kind: "noop",
        reason: "drag element is top-level — can't move",
      };
    }
    if (!loc.parent.oid) {
      return {
        kind: "noop",
        reason: "drag element's parent has no oid — can't address",
      };
    }
    if (isSelfOrDescendant(dropParent, loc.node)) {
      return {
        kind: "noop",
        reason: "would create a cycle — can't drop into self or descendant",
      };
    }
    if (loc.parent === dropParent) {
      sameParent.push({ oid, srcIdx: loc.index });
    } else {
      crossParent.push({ oid, node: loc.node });
    }
  }

  // Mixed buckets — same-parent + cross-parent in one batch. Twenty-
  // eighth pass: split into two sequential sub-batches that compose into
  // a single user-visible move. Twenty-ninth pass: inside-drop now
  // composes too (was fall-back).
  if (sameParent.length > 0 && crossParent.length > 0) {
    if (position === "inside") {
      // Twenty-ninth-pass mixed inside-drop. Drop parent IS the target;
      // sameParent items are already direct children of target (just
      // need to be reordered to the end), cross items get reparented in
      // sequentially after them. Final layout in target:
      //   [unchanged-children..., sameParent-block-DFS, cross-block-DFS].
      //
      // Math:
      //   sameToIndex = N - K  (post-detach append slot, K = sameParent.length, N = dropParent.children.length)
      //   baseInsertIndex = N (after step 1 the parent has N children
      //     again; per-op bumping fans cross items out from N onwards
      //     since each applyReparent against the running source sees one
      //     more child after the previous insertion).
      sameParent.sort((a, b) => a.srcIdx - b.srcIdx);
      const sortedSameOidsIn = sameParent.map((p) => p.oid);
      const sameToIndexIn = dropParent.children.length - sameParent.length;
      const baseInsertIndexIn = dropParent.children.length;
      const dfsIndexIn = computeDfsIndex(tree);
      const sortedCrossIn = [...crossParent].sort(
        (a, b) => (dfsIndexIn.get(a.oid) ?? 0) - (dfsIndexIn.get(b.oid) ?? 0),
      );
      const crossOpsIn: ReparentMultiOp[] = sortedCrossIn.map((e, i) => ({
        oid: e.oid,
        newParentOid: dropParentOid,
        insertIndex: baseInsertIndexIn + i,
      }));
      return {
        kind: "mixed-multi",
        parentOid: dropParentOid,
        sameParentOids: sortedSameOidsIn,
        sameParentToIndex: sameToIndexIn,
        crossParentOps: crossOpsIn,
      };
    }
    sameParent.sort((a, b) => a.srcIdx - b.srcIdx);
    const sortedSameOids = sameParent.map((p) => p.oid);
    const sortedSrcIndices = sameParent.map((p) => p.srcIdx);
    let leftDetaches = 0;
    for (const idx of sortedSrcIndices) {
      if (idx < anchorIdx) leftDetaches++;
    }
    const sameToIndex =
      position === "before"
        ? anchorIdx - leftDetaches
        : anchorIdx - leftDetaches + 1;
    // Cross-parent items land adjacent to the same-parent block, AT
    // the slot the user pointed at. After step 1 (reorder-multi), the
    // moved block occupies [sameToIndex, sameToIndex + length - 1] in
    // the drop parent. The drop target X is at:
    //   "before X": sameToIndex + length  (block sits before X)
    //   "after X":  sameToIndex - 1       (X sits before block)
    // In both cases the block's right edge is at sameToIndex + length.
    // Cross items should land just past the block's right edge so the
    // entire dragged set stays contiguous and DFS-ordered. With per-op
    // bumping (i = 0..N-1), they fan out from baseInsertIndex.
    const baseInsertIndex = sameToIndex + sortedSameOids.length;
    const dfsIndex = computeDfsIndex(tree);
    const sortedCross = [...crossParent].sort(
      (a, b) => (dfsIndex.get(a.oid) ?? 0) - (dfsIndex.get(b.oid) ?? 0),
    );
    const crossOps: ReparentMultiOp[] = sortedCross.map((e, i) => ({
      oid: e.oid,
      newParentOid: dropParentOid,
      insertIndex: baseInsertIndex + i,
    }));
    return {
      kind: "mixed-multi",
      parentOid: dropParentOid,
      sameParentOids: sortedSameOids,
      sameParentToIndex: sameToIndex,
      crossParentOps: crossOps,
    };
  }

  if (sameParent.length > 0) {
    if (position === "inside") {
      // Twenty-ninth-pass — pure same-parent inside-drop. User dragged
      // a multi-set of children INTO their own parent (target IS
      // dragParent). Intent: move them to the end of that parent.
      // Math mirrors the inside-mixed branch (no cross items here):
      // toIndex = N - K (post-detach append slot in collapsed list).
      // The engine's no-op fast path catches "already at end"
      // (sortedSrcIndices is consecutive starting at toIndex when the
      // block already occupies the parent's tail).
      sameParent.sort((a, b) => a.srcIdx - b.srcIdx);
      const sortedOidsIn = sameParent.map((p) => p.oid);
      const toIndexIn = dropParent.children.length - sameParent.length;
      return {
        kind: "reorder-multi",
        parentOid: dropParentOid,
        oids: sortedOidsIn,
        toIndex: toIndexIn,
      };
    }
    sameParent.sort((a, b) => a.srcIdx - b.srcIdx);
    const sortedOids = sameParent.map((p) => p.oid);
    const sortedSrcIndices = sameParent.map((p) => p.srcIdx);
    let leftDetaches = 0;
    for (const idx of sortedSrcIndices) {
      if (idx < anchorIdx) leftDetaches++;
    }
    const toIndex =
      position === "before"
        ? anchorIdx - leftDetaches
        : anchorIdx - leftDetaches + 1;
    // No-op: dragged block already at the slot. Mirrors single-op
    // `resolveTreeDrop`'s "no index change" bail. (The engine has its
    // own no-op fast-path; we still report here so the caller's
    // gesture-bail toast surfaces.)
    const isContiguous = sortedSrcIndices.every(
      (v, i) => v === sortedSrcIndices[0]! + i,
    );
    if (isContiguous && sortedSrcIndices[0] === toIndex) {
      return { kind: "noop", reason: "no index change" };
    }
    return {
      kind: "reorder-multi",
      parentOid: dropParentOid,
      oids: sortedOids,
      toIndex,
    };
  }

  // All cross-parent reparent. Aggregate.
  if (crossParent.length === 0) {
    // Both buckets empty after a non-zero unique → unreachable.
    return { kind: "noop", reason: "no operations resolved" };
  }
  // baseInsertIndex math mirrors single-op `resolveTreeDrop`'s reparent
  // branch: insertIndex is in the new parent's PRE-state index space
  // (`applyReparent`'s range check is `[0, newRealChildren.length]`).
  const baseInsertIndex =
    position === "before"
      ? anchorIdx
      : position === "after"
        ? anchorIdx + 1
        : dropParent.children.length; // inside → append-at-end
  const dfsIndex = computeDfsIndex(tree);
  const sortedCross = [...crossParent].sort(
    (a, b) => (dfsIndex.get(a.oid) ?? 0) - (dfsIndex.get(b.oid) ?? 0),
  );
  const ops: ReparentMultiOp[] = sortedCross.map((e, i) => ({
    oid: e.oid,
    newParentOid: dropParentOid,
    insertIndex: baseInsertIndex + i,
  }));
  return { kind: "reparent-multi", newParentOid: dropParentOid, ops };
}
