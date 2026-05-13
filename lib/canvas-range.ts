// Thirty-first-pass — pure helper for canvas shift-click range-select.
// Symmetric extension of the thirtieth-pass tree range-select
// (`collectShiftClickRangeOids` in components/ElementTree.tsx). Where the
// tree variant operates on a precomputed visibleRows list (post-collapse
// DFS), this canvas variant flattens the whole TreeNode tree to a DFS-
// ordered oid list — the canvas doesn't have an "expanded" notion; every
// addressable element is a candidate range member regardless of its tree-
// rail expansion state.
//
// Semantic: when the user shift-clicks an element in the canvas AND a
// current primary selection exists, the dispatcher computes the
// inclusive range between the primary's oid (anchor) and the clicked
// oid using DFS order over the iframe-emitted tree. Output is
// [clickedOid, ...rest in DFS order] so the caller can promote
// clickedOid to primary and demote the rest to additionalOids — matching
// the canvas's existing "shift-click promotes clicked to primary, prior
// primary becomes additional" gesture, just batched.
//
// Falls through to empty array when:
//   • Anchor or clicked oid is missing from the tree (caller falls
//     through to additive single-add — pre-31st-pass behavior).
//   • clicked === anchor (zero-length range; caller treats as no-op /
//     already-selected; specifically the dispatcher returns early
//     before this helper for that case via the existing
//     `prevPrimaryOid === newOid` guard).
//
// Pure for bench coverage in `scripts/bench-canvas-range.mjs`. The bench
// inlines this exact logic plus a TreeNode-shape fixture; if this
// helper diverges from the bench, vitest's bench wrapper catches it.

import type { TreeNode } from "@/lib/iframe-bridge";

export function collectCanvasShiftClickRangeOids(
  tree: ReadonlyArray<TreeNode>,
  anchorOid: string,
  clickedOid: string,
): string[] {
  // Flatten the tree to a DFS-ordered oid list. Non-OID nodes (top-level
  // root in HTML mode etc.) are skipped — the canvas's selection model
  // only addresses OID-bearing nodes, so a non-OID node can't be a range
  // member.
  const oids: string[] = [];
  function walk(arr: ReadonlyArray<TreeNode>) {
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
  // Clicked first (becomes the new primary), remaining range members in
  // DFS order. Skip the clicked oid in the in-range loop so it doesn't
  // duplicate.
  const out: string[] = [clickedOid];
  for (let i = lo; i <= hi; i++) {
    const o = oids[i]!;
    if (o === clickedOid) continue;
    out.push(o);
  }
  return out;
}
