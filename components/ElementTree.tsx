"use client";

// ROADMAP §3.3 — element tree sidebar. Renders the iframe-emitted
// `dropin:tree` payload as a collapsible nested list. Click a node =
// select it (Workspace builds a stub ElementSelection; iframe's reselect
// echo replaces with the full payload). Tree comes pre-collapsed past
// depth 2 so a 200-element page doesn't paint as a wall of text.
//
// Selection key: prefer OID (jsx mode) over loc-string (html mode). The
// OID is unique and stable across edits; loc-strings work for HTML but
// can drift on structural rewrites — same as the rest of the
// inspector's keying choices.
//
// Persistence: tree state (lastAppliedDepth + query + manual-mode
// expanded set + per-OID subtree depths) survives iframe rebuilds
// AND tab reloads via `lib/tree-persistence.ts`. The original "no
// persistence" v1 invariant was relaxed in the thirty-second pass when
// users started losing collapse state on every iframe rebuild. See
// `lib/tree-persistence.ts` for the full schema (versioned keys under
// `dropin:tree:*`).
//
// Companion modules (extracted post-audit 2026-05-04):
//   - `components/StorageHealthPanel.tsx` — the localStorage debug
//     panel originally embedded here. Split out when the file crossed
//     the "two distinct concerns" line during the chunk-polish run.
//   - `lib/storage-panel.ts` — the panel's persistence + parsers
//     (originally mixed into `lib/tree-persistence.ts`).
//
// UX surface: search box at the top, resizable rail width (persisted),
// right-click row → context menu (Duplicate / Delete via the existing
// applyDuplicate / applyDelete engines through Workspace handlers),
// shift-click multi-select mirroring the canvas's additive selection,
// keyboard nav (arrow keys + Cmd/Ctrl+A), spring-loaded folder expand
// on drag-hover, hover highlight echoed to the canvas.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ElementLoc, TreeNode } from "@/lib/iframe-bridge";
import {
  resolveTreeDrop,
  resolveTreeDropMulti,
  type DropPosition,
  type ReparentMultiOp,
} from "@/lib/ast/tree-dnd";
import StorageHealthPanel from "./StorageHealthPanel";
// Tree-state persistence: depth + query + manual-mode expanded set +
// per-OID subtree depths + cross-tab storage subscription + schema
// migration. The `expanded` set is gated on `lastAppliedDepth === null`
// (manual mode) so depth-mode users get fresh depth-derived expansion
// on each tree push instead of a stale stored set clobbering it.
// Storage telemetry helpers (`predictStoredTreeStateBytes`,
// `formatStoredBytes`, `classifyStorageBytes`) power the footer
// pill + the StorageHealthPanel.
import {
  readStoredDepth,
  writeStoredDepth,
  readStoredQuery,
  writeStoredQuery,
  readStoredExpanded,
  writeStoredExpanded,
  clearStoredExpanded,
  clearAllStoredTreeState,
  readStoredSubtreeDepths,
  writeStoredSubtreeDepths,
  mergeStoredSubtreeDepth,
  migrateLegacyStoredTreeState,
  subscribeStoredTreeStateChanges,
  isStoredTreeStateAtDefaults,
  predictStoredTreeStateBytes,
  formatStoredBytes,
  classifyStorageBytes,
  readStoredDragGhostFormat,
  writeStoredDragGhostFormat,
  applyDragGhostFormat,
  type DragGhostFormat,
  readEffectiveSubtreeDepthCap,
  writeSubtreeDepthCapOverride,
  readEffectiveStorageWarnBytes,
  readEffectiveStorageDangerBytes,
  writeStorageWarnBytesOverride,
  writeStorageDangerBytesOverride,
  clearAllStoredTreePreferences,
  TREE_PERSISTENCE_CONSTANTS,
} from "@/lib/tree-persistence";

// Phase 6 ramp — auto-scroll constants for tree DnD. When the pointer
// enters EDGE_BAND_PX of the scroll container's top or bottom edge during
// an active drag, the rail auto-scrolls so the user can reach hidden
// rows without releasing. Speed ramps linearly from 1 px/frame at the
// band's outer edge to MAX_AUTOSCROLL_SPEED_PX_PER_FRAME at the very
// container edge.
const EDGE_BAND_PX = 36;
const MAX_AUTOSCROLL_SPEED_PX_PER_FRAME = 12;
// Spring-loaded folder expand on drag-hover. When the user holds a
// drag inside a collapsed row for this long, auto-expand so they can
// drop into nested children. 700ms matches macOS Finder's default
// spring delay closely enough.
const SPRING_LOAD_DELAY_MS = 700;

function locKey(loc: ElementLoc): string {
  if (loc.kind === "jsx") {
    return `jsx:${loc.startLine}:${loc.startCol}`;
  }
  return `html:${loc.path.join(".")}`;
}

function nodeKey(n: TreeNode): string {
  return n.oid ? `oid:${n.oid}` : locKey(n.loc);
}

// Walk the tree to find every ancestor of the node that matches
// `targetKey`. Returns the chain of keys (root → … → parent of target)
// so the caller can union them into the expanded set. Empty array when
// the target isn't in the tree (deleted, or not yet emitted).
function findAncestorKeys(
  nodes: ReadonlyArray<TreeNode>,
  targetKey: string,
): string[] {
  const path: string[] = [];
  function dfs(arr: ReadonlyArray<TreeNode>, trail: string[]): boolean {
    for (const n of arr) {
      const key = nodeKey(n);
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

// Pre-expand the first 2 depths by default. Past that the rail would be
// a wall of <div> nodes for a complex page; users can drill down on
// demand.
const DEFAULT_EXPAND_DEPTH = 2;

// Thirty-first-pass — sentinel for "expand all" applied through the
// `lastAppliedDepth` persistence mechanism. Any depth >= this expands
// every container; `collectExpandToDepth(_, Infinity)` walks the whole
// tree without ever hitting `depth >= maxDepth`. Use a finite Number
// so JSON debug logging stays readable; Infinity would also work.
const EXPAND_ALL_DEPTH = Number.POSITIVE_INFINITY;

// Thirtieth-pass — expand-to-depth helper, exported for the right-click
// context menu's "Expand depth: 1 2 3 4 5" row + the bench at
// scripts/bench-tree-expand.mjs. `maxDepth` is the deepest level to
// SHOW (i.e. expand container keys at depths 0..maxDepth-1). depth=0 →
// empty set (everything collapsed); depth=∞ → every container key (full
// expansion). Pure for bench coverage.
export function collectExpandToDepth(
  nodes: ReadonlyArray<TreeNode>,
  maxDepth: number,
): Set<string> {
  const out = new Set<string>();
  if (maxDepth <= 0) return out;
  function walk(arr: ReadonlyArray<TreeNode>, depth: number) {
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

// Phase 6 ramp — Alt+ArrowUp/Down keyboard reorder. Walks the tree to
// find the row's parent + sibling list + index. Returns null when oid
// not found or oid is top-level (no parent). Used by the keyboard
// handler to fire onTreeReorder with `currentIdx ± 1`. Mirror of the
// resolveTreeDrop walker; kept inline rather than importing because
// the data shape (TreeNode) is already in scope and a 12-line walk
// reads more clearly than a generic resolver call.
function findSiblingInfo(
  tree: ReadonlyArray<TreeNode>,
  oid: string,
): { parentOid: string; index: number; siblingsCount: number } | null {
  function walk(
    arr: ReadonlyArray<TreeNode>,
    parent: TreeNode | null,
  ): { parentOid: string; index: number; siblingsCount: number } | null {
    for (let i = 0; i < arr.length; i++) {
      const n = arr[i]!;
      if (n.oid === oid) {
        if (!parent || !parent.oid) return null;
        return { parentOid: parent.oid, index: i, siblingsCount: arr.length };
      }
      const r = walk(n.children, n);
      if (r) return r;
    }
    return null;
  }
  return walk(tree, null);
}

function collectDefaultExpanded(out: Set<string>, tree: ReadonlyArray<TreeNode>) {
  // Thin wrapper around `collectExpandToDepth(tree, DEFAULT_EXPAND_DEPTH)`
  // so the auto-expand-on-first-tree effect + collapseAll keep their
  // existing shape (mutating `out` in-place) without duplicating the
  // depth math.
  for (const k of collectExpandToDepth(tree, DEFAULT_EXPAND_DEPTH)) {
    out.add(k);
  }
}

// Thirty-first-pass — pure helper for "Collapse subtree" context-menu
// action (n in the 30th-pass next-session list). Walks the tree to find
// the root node by oid; if found, collects every container key in that
// subtree (root + descendants with children) via
// `collectExpandToDepth([rootNode], Infinity)`. Caller subtracts these
// from the existing expanded set so the entire subtree (root included)
// collapses. Falls through to empty when oid not found (stale right-click
// after iframe rebuild evicts the row). Pure for bench coverage in
// scripts/bench-tree-collapse-subtree.mjs.
export function collectCollapseSubtreeKeys(
  tree: ReadonlyArray<TreeNode>,
  rootOid: string,
): Set<string> {
  let rootNode: TreeNode | null = null;
  const walk = (arr: ReadonlyArray<TreeNode>) => {
    for (const n of arr) {
      if (rootNode) return;
      if (n.oid === rootOid) {
        rootNode = n;
        return;
      }
      if (n.children.length > 0) walk(n.children);
    }
  };
  walk(tree);
  if (!rootNode) return new Set();
  return collectExpandToDepth(
    [rootNode as TreeNode],
    Number.POSITIVE_INFINITY,
  );
}

// Match logic for the tree filter. Tag prefix is the most useful match
// (`but` matches `<button>`); class substring + OID equality round it
// out. Case-insensitive. Empty query = match everything (treated as
// "no filter active" by the caller).
export function nodeMatchesQuery(node: TreeNode, q: string): boolean {
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

// For an active filter, collect every key that is either a direct
// match OR an ancestor of a match. The renderer then drops nodes that
// aren't in the keep-set, while ancestors stay visible (a leaf match
// 5 levels deep needs every parent up to root visible). Returns null
// when the query is empty (caller skips filtering entirely).
export function buildVisibleKeys(
  nodes: ReadonlyArray<TreeNode>,
  query: string,
): { keep: ReadonlySet<string>; matches: ReadonlySet<string> } | null {
  if (!query.trim()) return null;
  const keep = new Set<string>();
  const matches = new Set<string>();
  function dfs(arr: ReadonlyArray<TreeNode>, ancestors: string[]): boolean {
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

// Twenty-eighth-pass — pure predicate for "should this keyboard action
// fan out across the multi-select set, or stay on the focused row?".
// Multi handler must be wired AND the multi-set must have 2+ entries
// AND the focused row's oid must be in the set. Exported for bench
// coverage in scripts/bench-tree-multi-keys.mjs.
export function shouldRouteThroughMulti(
  focusedOid: string | null | undefined,
  selectedOidsForDrag: ReadonlyArray<string> | undefined,
  hasMultiHandler: boolean,
): boolean {
  if (!hasMultiHandler) return false;
  if (!selectedOidsForDrag) return false;
  if (selectedOidsForDrag.length < 2) return false;
  if (!focusedOid) return false;
  return selectedOidsForDrag.includes(focusedOid);
}

// Twenty-ninth-pass — pure helper for Cmd/Ctrl+A in the tree. Returns
// the oid list to feed to `onSelectAllInTree(oids)`. Semantics:
//   • If focusedOid is set AND in tree → select its siblings (parent's
//     children with oids). Focused row is FIRST in the output so the
//     caller can promote it to primary; other siblings follow in DFS
//     order. Top-level focused row falls into "all top-level oids"
//     since the synthetic tree root has no oid.
//   • If focusedOid is null OR not found → flatten every oid-bearing
//     row in DFS order. Primary is the first DFS visible oid.
//   • `visibleOidSet` (when non-null) intersects every candidate oid
//     so a filter-active tree never selects rows the user can't see.
//     null = no filter; pass everything.
// Mirrors the "siblings of focused" semantic of macOS Finder Cmd+A
// (the front-most container's contents) plus the "all visible" fallback
// for unfocused rails. Pure for bench coverage in
// scripts/bench-tree-multi-keys.mjs.
export function collectSelectAllOids(
  tree: ReadonlyArray<TreeNode>,
  focusedOid: string | null,
  visibleOidSet: ReadonlySet<string> | null,
): string[] {
  const passes = (oid: string | null | undefined): boolean => {
    if (!oid) return false;
    if (!visibleOidSet) return true;
    return visibleOidSet.has(oid);
  };
  // Step 1 — look up focused's siblings array if focusedOid is in tree.
  let foundSiblings: ReadonlyArray<TreeNode> | null = null;
  if (focusedOid) {
    const walk = (arr: ReadonlyArray<TreeNode>): boolean => {
      for (const n of arr) {
        if (n.oid === focusedOid) {
          foundSiblings = arr;
          return true;
        }
        if (n.children.length > 0 && walk(n.children)) return true;
      }
      return false;
    };
    walk(tree);
  }
  if (foundSiblings) {
    // Primary first (the focused row), then remaining siblings in DFS
    // order. Filter out non-passing rows (oid missing OR filtered out).
    const out: string[] = [];
    if (focusedOid && passes(focusedOid)) out.push(focusedOid);
    const siblings = foundSiblings as ReadonlyArray<TreeNode>;
    for (const n of siblings) {
      if (n.oid === focusedOid) continue;
      if (passes(n.oid)) out.push(n.oid as string);
    }
    return out;
  }
  // No focus / focused not in tree → flatten everything visible.
  const out: string[] = [];
  const flatten = (arr: ReadonlyArray<TreeNode>) => {
    for (const n of arr) {
      if (passes(n.oid)) out.push(n.oid as string);
      if (n.children.length > 0) flatten(n.children);
    }
  };
  flatten(tree);
  return out;
}

// Thirtieth-pass — pure helper for shift-click range-select. Computes
// the inclusive DFS-ordered slice of visibleRows between `anchorKey`
// (current primary's tree key) and `clickedKey` (the just-shift-clicked
// row's tree key), filtered to OID-bearing rows. Returns the list of
// oids with `clickedOid` FIRST so the caller can promote it to primary
// (mirrors the canvas's shift-click semantic where the clicked row
// becomes primary and previously-selected rows demote to additionals).
//
// Returns empty array when:
//   • Either key not in visibleRows (caller should fall through to the
//     existing additive single-add path).
//   • Clicked row has no oid (HTML mode rows etc. — primary needs an oid).
//
// Note this respects the active filter (visibleRows excludes filtered-
// out rows) AND collapsed children (range = visible only, not the full
// DFS — Finder semantic). Callers that want "everything between
// regardless of expand state" should compute against the full tree;
// the current callers all want visible-only.
//
// Pure for bench coverage in scripts/bench-tree-range-select.mjs.
export function collectShiftClickRangeOids(
  visibleRows: ReadonlyArray<{ key: string; oid: string | null }>,
  anchorKey: string,
  clickedKey: string,
): string[] {
  const fromIdx = visibleRows.findIndex((r) => r.key === anchorKey);
  const toIdx = visibleRows.findIndex((r) => r.key === clickedKey);
  if (fromIdx < 0 || toIdx < 0) return [];
  const clickedOid = visibleRows[toIdx]!.oid;
  if (!clickedOid) return [];
  const lo = Math.min(fromIdx, toIdx);
  const hi = Math.max(fromIdx, toIdx);
  const out: string[] = [clickedOid];
  for (let i = lo; i <= hi; i++) {
    const r = visibleRows[i]!;
    if (r.key === clickedKey) continue;
    if (!r.oid) continue;
    out.push(r.oid);
  }
  return out;
}

// Twenty-eighth-pass — label builder for the floating drag-ghost
// tooltip. Walks the tree once for the primary oid (the user-grabbed
// row) so the ghost reads as `<tag> · N` for a multi-drag and `<tag>`
// for a single-drag. Falls back to a plain count when the tag can't be
// resolved (mid-drag tree mutation, missing oid). Pure for bench
// coverage in scripts/bench-tree-multi-keys.mjs.
//
// Thirty-fifth-pass chunk (mm) — accepts an optional `format`
// preference (DragGhostFormat) defaulting to "with-count". Existing
// callers pass three args and get the historical behavior; the new
// 4-arg form lets the user persist a "no-count" or "count-only"
// preference via lib/tree-persistence's drag-ghost-format key. The
// final string assembly lives in `applyDragGhostFormat` (in
// lib/tree-persistence) so the format-vs-output mapping is bench-
// testable without depending on tree shape.
export function buildDragGhostLabel(
  tree: ReadonlyArray<TreeNode>,
  primaryOid: string,
  setSize: number,
  format: DragGhostFormat = "with-count",
): string {
  let primaryTag: string | undefined;
  function walk(arr: ReadonlyArray<TreeNode>) {
    for (const n of arr) {
      if (primaryTag) return;
      if (n.oid === primaryOid) {
        primaryTag = n.tag;
        return;
      }
      if (n.children.length > 0) walk(n.children);
    }
  }
  walk(tree);
  return applyDragGhostFormat(primaryTag ?? null, setSize, format);
}

// Thirty-second-pass — pure helper for the drop-placeholder caption.
// Builds a short verb-prefix annotation that pairs with the dragGhost
// label inside the placeholder row. Output reads like
// "↳ drop before <div>" / "↳ drop after <div> · 3" / "↳ drop into <ul>"
// so the placeholder communicates BOTH the action and the target slot,
// not just the dragged label. Pure for bench coverage.
export function buildDropPlaceholderCaption(
  dragGhostLabel: string,
  position: "before" | "after" | "inside",
): string {
  const verb =
    position === "before"
      ? "before"
      : position === "after"
        ? "after"
        : "into";
  return `↳ drop ${verb} ${dragGhostLabel}`;
}

const RAIL_WIDTH_MIN = 200;
const RAIL_WIDTH_MAX = 480;
const RAIL_WIDTH_DEFAULT = 240;
const RAIL_WIDTH_STORAGE_KEY = "dropin:tree:width";

function readStoredRailWidth(): number {
  if (typeof window === "undefined") return RAIL_WIDTH_DEFAULT;
  try {
    const raw = window.localStorage.getItem(RAIL_WIDTH_STORAGE_KEY);
    if (!raw) return RAIL_WIDTH_DEFAULT;
    const n = Number(raw);
    if (!Number.isFinite(n)) return RAIL_WIDTH_DEFAULT;
    return Math.min(RAIL_WIDTH_MAX, Math.max(RAIL_WIDTH_MIN, Math.round(n)));
  } catch {
    return RAIL_WIDTH_DEFAULT;
  }
}

// Thirty-third-pass chunk (z) — schema migration / GC, run once per
// page load. The flag lives at module scope so multiple ElementTree
// mounts (e.g. preview swap) don't re-scan localStorage every time.
// Idempotent in practice — every subsequent call would be a no-op
// since the first call removed mismatched keys — but the flag avoids
// even the empty Object.keys scan.
let didRunSchemaMigration = false;
function ensureSchemaMigration(): void {
  if (didRunSchemaMigration) return;
  didRunSchemaMigration = true;
  migrateLegacyStoredTreeState();
}

interface ContextMenuState {
  oid: string;
  tag: string;
  x: number;
  y: number;
  // Twenty-ninth-pass — multi-set snapshot captured at right-click
  // time. When non-null + length >= 2 AND the corresponding multi-
  // handler (onDuplicateMulti / onDeleteMulti) is wired, the menu
  // offers "Duplicate N" / "Delete N" actions instead of single-row.
  // Snapshot at open time so a mid-menu canvas selection change can't
  // shift the affected set out from under the user.
  multiOids: ReadonlyArray<string> | null;
}

export interface ElementTreeProps {
  tree: ReadonlyArray<TreeNode>;
  selectedKey: string | null;
  // `additive=true` → caller should treat this as a shift-click (extend
  // multi-select); plain click resets to single. Mirrors the canvas
  // shift-click semantics so a tree-driven multi-select is identical to
  // a canvas-driven one.
  onSelect: (node: TreeNode, additive: boolean) => void;
  open: boolean;
  onToggleOpen: () => void;
  // OID-based context-menu actions. Wired only in jsx mode; html mode
  // passes undefined and the menu skips the relevant entries (or hides
  // entirely if nothing is wired).
  onDuplicate?: (oid: string) => void;
  onDelete?: (oid: string) => void;
  // Eighteenth-pass — hover-highlight in the canvas. ElementTree calls
  // this with the row's OID on mouseenter, null on leave. Workspace
  // pipes it down to Preview's `hoverHighlightOid` prop. Skipped for
  // OID-less rows (HTML mode).
  onRowHover?: (oid: string | null) => void;
  // Phase 6 ramp — drag-and-drop reorder/reparent. Both callbacks must
  // be wired together (Workspace passes both in jsx mode, both undefined
  // in html mode); ElementTree infers DnD enablement from `onTreeReorder
  // && onTreeReparent`. The same callbacks Workspace already exposes to
  // SelectionOverlay (handleReorder / handleReparent) — return value is
  // a boolean reporting whether the source actually changed; ElementTree
  // ignores it (Workspace surfaces success/bail toasts).
  onTreeReorder?: (oid: string, parentOid: string, toIndex: number) => boolean;
  onTreeReparent?: (
    oid: string,
    newParentOid: string,
    insertIndex: number,
    propsToRemove?: string[],
    newParentTag?: string,
  ) => boolean;
  // Surface a noop reason from the resolver as a warn toast. When unset,
  // bails are silent (ElementTree just doesn't fire the callback).
  onTreeDropBail?: (reason: string) => void;
  // Phase 6 ramp — multi-target tree DnD. The full multi-select set
  // (selection.oid + additionalOids in canvas terms) so a drag of any
  // selected row applies the move to all. When the dragged row's OID
  // isn't in this set, ElementTree falls back to single-drag automatically.
  // Workspace passes [primary, ...additionals] in jsx mode, undefined in
  // html mode. ElementTree captures the array at pointerdown so a mid-drag
  // selection change doesn't disturb the active drag.
  selectedOidsForDrag?: ReadonlyArray<string>;
  // Multi-target reparent commit. Wired to Workspace's existing
  // handleReparentMulti (the canvas's same-named handler also drives this
  // path).
  onTreeReparentMulti?: (
    ops: ReparentMultiOp[],
    newParentTag?: string,
  ) => boolean;
  // Twenty-seventh-pass — multi-target same-parent reorder commit. The
  // resolver returns a single batched op (parentOid + DFS-sorted oids +
  // post-detach toIndex); the engine `applyReorderMulti` applies it
  // atomically so the moved block lands in the user-expected order
  // without the per-op-detach reversal that naive sequential applyReorder
  // hits. When unset, the resolver still returns reorder-multi but
  // ElementTree falls through to single-drag for the user's grabbed row.
  onTreeReorderMulti?: (
    parentOid: string,
    oids: string[],
    toIndex: number,
  ) => boolean;
  // Twenty-eighth-pass — multi-row keyboard delete + duplicate. When
  // `selectedOidsForDrag` is non-empty (length >= 2) AND includes the
  // focused row's oid, pressing Backspace/Delete routes through
  // `onDeleteMulti(selectedOidsForDrag)` instead of `onDelete(focusedOid)`,
  // and Cmd/Ctrl+D routes through `onDuplicateMulti(selectedOidsForDrag)`
  // instead of `onDuplicate(focusedOid)`. When the focused row is NOT in
  // the multi-set (e.g. user arrow-keyed away from the multi-selected
  // rows), the single-row handler still fires for the focused row only —
  // mirrors the canvas's keyboard behaviour where the focus matters,
  // not the selection set, when the actor isn't part of the set.
  onDuplicateMulti?: (oids: ReadonlyArray<string>) => boolean;
  onDeleteMulti?: (oids: ReadonlyArray<string>) => boolean;
  // Twenty-eighth-pass — mixed-bucket multi-DnD commit. Caller composes
  // applyReorderMulti (sameParentOids at sameParentToIndex) followed by
  // a sequential applyReparent for each crossParentOps op against the
  // running source. Single setCode → one undo entry. When unset, the
  // resolver still returns mixed-multi but ElementTree falls through to
  // single-drag for the user's grabbed row.
  onTreeDndMixed?: (
    parentOid: string,
    sameParentOids: string[],
    sameParentToIndex: number,
    crossParentOps: ReparentMultiOp[],
    newParentTag?: string,
  ) => boolean;
  // Twenty-ninth-pass — Cmd/Ctrl+A in tree. Caller (Workspace) receives
  // the oids list (primary first) and applies it as the new selection
  // (selection.oid = oids[0], additionalOids = oids.slice(1)). When the
  // tree is empty or yields zero passing oids, ElementTree skips the
  // dispatch silently. JSX-only — Workspace passes undefined in HTML
  // mode so the keyboard shortcut falls through to the browser's
  // native select-all (which is not useful in the tree but won't be
  // intercepted).
  onSelectAllInTree?: (oids: string[]) => void;
  // Thirtieth-pass — shift-click range-select. When the user shift-
  // clicks a tree row AND there's an existing primary in the visible
  // rows, ElementTree dispatches the inclusive DFS-ordered slice of oids
  // (clicked first, then the rest in DFS order). Caller (Workspace)
  // applies it as the new selection: oids[0] becomes selection.oid,
  // oids.slice(1) becomes additionalOids — same shape as
  // onSelectAllInTree. When unset (HTML mode), shift-click falls
  // through to the existing additive single-add path.
  onSelectRangeInTree?: (oids: string[]) => void;
  // Audit MED (Domain 4) — warn-toast handler forwarded to
  // StorageHealthPanel for clipboard rejection paths. Optional;
  // falls through to silent no-op when unset.
  onWarn?: (msg: string) => void;
}

export default function ElementTree({
  tree,
  selectedKey,
  onSelect,
  open,
  onToggleOpen,
  onDuplicate,
  onDelete,
  onRowHover,
  onTreeReorder,
  onTreeReparent,
  onTreeDropBail,
  selectedOidsForDrag,
  onTreeReparentMulti,
  onTreeReorderMulti,
  onDuplicateMulti,
  onDeleteMulti,
  onTreeDndMixed,
  onSelectAllInTree,
  onSelectRangeInTree,
  onWarn,
}: ElementTreeProps) {
  const dndEnabled = Boolean(onTreeReorder && onTreeReparent);
  // Thirty-second-pass — lazy-init `expanded` from localStorage when
  // the user was last in manual mode (stored depth is null). For
  // depth-mode users (stored depth is a number or Infinity), the
  // depth re-apply effect at line ~1190 will overwrite this on the
  // first non-empty tree push, so we skip the storage read to avoid
  // a brief flash of stale state. Reads `readStoredDepth` to check
  // mode WITHOUT applying it — `lastAppliedDepth`'s own lazy-init
  // below also reads `readStoredDepth`, but that's a sub-millisecond
  // read; clean separation is worth the duplicate call.
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => {
    if (typeof window === "undefined") return new Set();
    // Thirty-third-pass chunk (z) — first reader on the page wins the
    // migration sweep. Subsequent reads (lastAppliedDepth lazy-init,
    // query lazy-init, subtree-depths lazy-init) all see a clean
    // namespace.
    ensureSchemaMigration();
    const storedDepth = readStoredDepth(DEFAULT_EXPAND_DEPTH);
    if (storedDepth !== null) return new Set();
    const stored = readStoredExpanded();
    return stored ? new Set(stored) : new Set();
  });
  // Thirty-first-pass — track the user's last "global depth" choice so
  // an iframe rebuild (which may reseed OIDs, making the existing
  // `expanded` set's keys stale) can re-apply the same depth against the
  // new tree. `null` = "user has manual mods, leave alone". Default to
  // DEFAULT_EXPAND_DEPTH so the first tree push auto-applies depth 2.
  // Set by: header Depth dropdown, header expandAll/collapseAll, context-
  // menu Depth N row. Cleared by: chevron toggle, ArrowLeft/Right keyboard
  // collapse/expand. NOT touched by: subtree-depth (additive override),
  // selection-ancestor expansion (transparent), filter-keep expansion
  // (transparent).
  // Thirty-second-pass — lazy-init from localStorage so the user's
  // previous depth choice survives a page reload. Mirrors the rail-width
  // pattern below. SSR-safe via the `typeof window` guard inside
  // `readStoredDepth`. The write side (effect below) commits on every
  // state change.
  const [lastAppliedDepth, setLastAppliedDepth] = useState<number | null>(
    () => readStoredDepth(DEFAULT_EXPAND_DEPTH),
  );
  // Thirty-first-pass — toolbar "Depth ▾" popover open state. Lives here
  // so the document-level click-outside handler can close it; same pattern
  // as the right-click context menu.
  const [depthMenuOpen, setDepthMenuOpen] = useState(false);
  // Thirty-third-pass chunk (p) — toolbar "Subtree ▾" popover open state.
  // Same shape as depthMenuOpen but bound to a different button. The
  // popover acts on the currently-focused row (focusedKey + the resolved
  // OID); when no row is focused or the focused row has no OID, the
  // button renders disabled.
  const [subtreeMenuOpen, setSubtreeMenuOpen] = useState(false);
  // Thirty-third-pass chunk (q) — per-OID subtree-depth replay. Lazy-init
  // from localStorage so a previous session's chunk-(j) actions
  // (right-click → Subtree | N) are replayed against the live tree on
  // mount. Persisted via the matching write effect; updated by chunk-q
  // wrapper around expandSubtreeToDepth.
  const [subtreeDepths, setSubtreeDepths] = useState<Record<string, number>>(
    () => (typeof window === "undefined" ? {} : readStoredSubtreeDepths() ?? {}),
  );
  // Thirty-third-pass chunk (aa) — Reset-button confirm prompt. First
  // click sets `confirmingReset = true` and starts a 3-second timer;
  // second click within the window confirms and runs the wipe. After
  // the timer expires (or the user clicks anywhere else), the prompt
  // collapses back to its idle state. The rationale for adding the
  // confirm: the chunk-x reset is bounded but irreversible (filter +
  // depth + manual expansion all wiped in one click), and a few users
  // had hit it accidentally while reaching for the count badge. A
  // two-step tap-to-confirm is cheaper than a modal and matches the
  // prevailing palette ("undo via redo" as a primary, no confirm
  // dialogs anywhere else in the app).
  const [confirmingReset, setConfirmingReset] = useState(false);
  const confirmResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedTreeRef = useRef(false);
  const selectedRowRef = useRef<HTMLDivElement | null>(null);
  const focusedRowRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const treeListRef = useRef<HTMLUListElement | null>(null);

  // Thirty-second-pass — lazy-init filter from localStorage so a user's
  // active query survives a page reload. The input box re-renders the
  // raw value so the user sees what's filtering the tree on first paint.
  const [query, setQuery] = useState<string>(() => readStoredQuery());
  const [width, setWidth] = useState<number>(() => readStoredRailWidth());
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Phase 6 ramp — drag-and-drop machinery. Two pieces of React state
  // drive the visual indicator (`dragSetOids` paints every row in the
  // drag set dimmed; `dropTarget` paints the indicator on the hovered
  // row). A ref tracks the transient pointer state (start coords,
  // listener identity) so the 5-px activation threshold doesn't trigger
  // a render on every move.
  //
  // dragSetOids is null when not dragging; an array of length 1 (single
  // drag) or 2+ (multi drag) when active. The first element is always
  // the user-grabbed row. The hover gate `if (dragSetOids) return;`
  // doubles as the "is a drag in progress?" check.
  const [dragSetOids, setDragSetOids] = useState<ReadonlyArray<string> | null>(
    null,
  );
  const [dropTarget, setDropTarget] = useState<{
    oid: string;
    position: DropPosition;
  } | null>(null);
  // Twenty-eighth-pass — floating ghost tooltip near the cursor during
  // drag. Set on activation (after the 5-px threshold) and cleared on
  // pointerup / pointercancel / Esc. Position updates per pointermove
  // alongside hitTestRow so React renders the ghost as a fixed-position
  // overlay tracking the cursor. The label captures count + primary tag
  // at activation, so a mid-drag tree shape change can't relabel the
  // ghost (the user's intent is fixed at grab time).
  const [dragGhost, setDragGhost] = useState<{
    x: number;
    y: number;
    label: string;
  } | null>(null);
  // Thirty-fifth-pass chunk (mm) — persisted drag-ghost label format
  // preference. Lazy-init from localStorage; persisted on change.
  // Default "with-count" matches historical behavior so users without
  // an explicit override see no diff. Power-user knob — set via
  // DevTools `localStorage.setItem("dropin:tree:drag-ghost-format:v1",
  // "no-count")` (or "count-only"). The label that's already pinned
  // into a live dragGhost.label is intentionally NOT recomputed when
  // this preference changes mid-drag — the user's intent is fixed at
  // pointer-down, so a mid-drag toggle would be jarring; the next
  // drag picks up the new format.
  const [dragGhostFormat, setDragGhostFormat] = useState<DragGhostFormat>(
    () => readStoredDragGhostFormat(),
  );
  // Thirty-fifth-pass chunk (ss) — exposed setter for the chunk-nn
  // debug panel's preferences section. Composes the local setState
  // with the persistence write so the preference is reflected in
  // localStorage immediately. Other tabs pick it up via chunk-y.
  const handleSetDragGhostFormat = useCallback(
    (format: DragGhostFormat) => {
      setDragGhostFormat(format);
      writeStoredDragGhostFormat(format);
    },
    [],
  );
  // Thirty-sixth-pass chunk (jj) — persisted subtree-depth cap override
  // (chunk-hh). Lazy-init resolves the effective value (default 50, or
  // the clamped override). The number-input UI in the chunk-nn debug
  // panel preferences fieldset writes via handleSetSubtreeDepthCap.
  const [subtreeDepthCap, setSubtreeDepthCap] = useState<number>(
    () => readEffectiveSubtreeDepthCap(),
  );
  const handleSetSubtreeDepthCap = useCallback(
    (value: number | null) => {
      // The writer normalizes default-equivalence (null OR build-time
      // default 50 → removeItem); the post-write read here always
      // reflects the effective value (in case a clamp happened).
      writeSubtreeDepthCapOverride(value);
      setSubtreeDepthCap(readEffectiveSubtreeDepthCap());
    },
    [],
  );
  // Thirty-sixth-pass chunk (rr) — persisted storage telemetry warn /
  // danger byte thresholds. Lazy-init resolves the effective values
  // (defaults 4096 / 16384, or clamped overrides). Two separate state
  // slices because the writes are independent — chunk-rr's classifier
  // handles the degenerate warn >= danger case defensively.
  const [storageWarnBytes, setStorageWarnBytes] = useState<number>(
    () => readEffectiveStorageWarnBytes(),
  );
  const [storageDangerBytes, setStorageDangerBytes] = useState<number>(
    () => readEffectiveStorageDangerBytes(),
  );
  const handleSetStorageWarnBytes = useCallback(
    (value: number | null) => {
      writeStorageWarnBytesOverride(value);
      setStorageWarnBytes(readEffectiveStorageWarnBytes());
    },
    [],
  );
  const handleSetStorageDangerBytes = useCallback(
    (value: number | null) => {
      writeStorageDangerBytesOverride(value);
      setStorageDangerBytes(readEffectiveStorageDangerBytes());
    },
    [],
  );
  // Thirty-sixth-pass chunk (tt) — wipe all preferences (chunks
  // hh/mm/rr) without touching state. Composes the persistence-layer
  // wiper with local-state resets so the panel reflects the new
  // defaults immediately. Other tabs pick the wipes up via chunk-y per
  // changed key.
  const handleResetTreePreferences = useCallback(() => {
    // clearAllStoredTreePreferences clears EVERY stored panel +
    // tree-side preference key (cap, thresholds, drag-ghost, scope,
    // sort, filter, collapse, filename, pretty-print, hide-values,
    // truncation, recent-imports, filter-history, filter-mode,
    // recent-imports-sort). The panel handles its own internal-state
    // reset locally inside StorageHealthPanel; we only sync the
    // tree-side prefs here.
    clearAllStoredTreePreferences();
    setSubtreeDepthCap(TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_MAX_ENTRIES);
    setStorageWarnBytes(TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_WARN_THRESHOLD);
    setStorageDangerBytes(
      TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_DANGER_THRESHOLD,
    );
    setDragGhostFormat(TREE_PERSISTENCE_CONSTANTS.DRAG_GHOST_FORMAT_DEFAULT);
  }, []);
  // `lastDropEndAt` is consulted by row click handlers — if a click
  // arrives within ~150ms of a drag end, the click is suppressed (the
  // drag is what the user meant). Pointer events typically swallow
  // clicks past the threshold, but Safari has been inconsistent.
  const lastDropEndAtRef = useRef<number>(0);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    srcOid: string;
    // Captured at pointerdown so a mid-drag prop change doesn't shift
    // the set. For single-drag this is just [srcOid]; for multi-drag
    // it's the entire selectedOidsForDrag set.
    dragSet: ReadonlyArray<string>;
    activated: boolean;
    onMove: (e: PointerEvent) => void;
    onUp: (e: PointerEvent) => void;
    onKey: (e: KeyboardEvent) => void;
    onCancel: (e: PointerEvent) => void;
    onLostCap: (e: PointerEvent) => void;
    onBlur: () => void;
    onVisChange: () => void;
  } | null>(null);
  const treeForDndRef = useRef(tree);
  // Keep the ref in sync with the latest tree so pointermove's hit-test
  // resolves against the freshest shape (tree pushes from the iframe
  // mid-drag are rare but possible during HMR). Using a ref keeps the
  // pointer handler identity stable.
  useEffect(() => {
    treeForDndRef.current = tree;
  }, [tree]);
  // Thirty-fifth-pass chunk (mm) — ref-tracked drag-ghost format. The
  // pointer event handler is registered once at activation; reading
  // through a ref lets a same-session preference change (rare; cross-
  // tab DevTools edit) be picked up by the NEXT drag without re-
  // binding the handler. The currently-active dragGhost.label is
  // intentionally NOT recomputed mid-drag (intent is fixed at pointer-
  // down).
  const dragGhostFormatRef = useRef(dragGhostFormat);
  useEffect(() => {
    dragGhostFormatRef.current = dragGhostFormat;
  }, [dragGhostFormat]);
  // The pointermove handler reads dropTarget mid-drag to compare against
  // the freshly hit-tested row, so the reference lives in a ref the
  // closure can read without re-binding. Declared BEFORE `onRowPointerDown`
  // to keep TypeScript's "used before declaration" pass happy and to make
  // the lifecycle obvious.
  const dropTargetRef = useRef(dropTarget);
  useEffect(() => {
    dropTargetRef.current = dropTarget;
  }, [dropTarget]);

  // Phase 6 ramp — tree DnD auto-scroll. When the pointer is held in
  // the top or bottom edge band of the scroll container during a drag,
  // a rAF loop scrolls the rail so the user can reach off-screen rows
  // without releasing. State lives in a ref so per-frame scroll updates
  // don't cause re-renders.
  const autoScrollStateRef = useRef<{
    rafId: number;
    speed: number; // signed: negative = scroll up, positive = scroll down
    lastClientX: number;
    lastClientY: number;
  } | null>(null);
  // Twenty-eighth pass — spring-loaded folder expand timer state. Lives
  // in a ref so changing the timer doesn't trigger re-renders. Cleared
  // by drag end (onUp / cancelDrag), dropTarget change to a different
  // row, or unmount.
  const springTimerRef = useRef<{
    timerId: ReturnType<typeof setTimeout>;
    targetOid: string;
  } | null>(null);

  const stopAutoScroll = useCallback(() => {
    const st = autoScrollStateRef.current;
    if (!st) return;
    cancelAnimationFrame(st.rafId);
    autoScrollStateRef.current = null;
  }, []);

  // Twenty-eighth pass — clear the spring-load timer. Called on drag
  // end, dropTarget change to a different row, or unmount.
  const stopSpringTimer = useCallback(() => {
    const cur = springTimerRef.current;
    if (!cur) return;
    clearTimeout(cur.timerId);
    springTimerRef.current = null;
  }, []);

  // Twenty-eighth pass — spring-loaded folder expand. When a drag is
  // active AND dropTarget points to a row with position "inside" AND
  // the row is currently collapsed AND has children to expand,
  // schedule a SPRING_LOAD_DELAY_MS timer that adds the row's key to
  // the `expanded` set. Clear on row change, drag end, or unmount.
  // React re-runs this on every dropTarget / dragSetOids change.
  useEffect(() => {
    if (!dragSetOids || !dropTarget) {
      stopSpringTimer();
      return;
    }
    if (dropTarget.position !== "inside") {
      stopSpringTimer();
      return;
    }
    // Walk the tree to verify target has children AND is currently
    // collapsed. If not, no spring-load to do.
    let targetNode: TreeNode | null = null;
    function walk(arr: ReadonlyArray<TreeNode>) {
      for (const n of arr) {
        if (targetNode) return;
        if (n.oid === dropTarget!.oid) {
          targetNode = n;
          return;
        }
        if (n.children.length > 0) walk(n.children);
      }
    }
    walk(treeForDndRef.current);
    if (!targetNode) {
      stopSpringTimer();
      return;
    }
    const node = targetNode as TreeNode;
    if (node.children.length === 0) {
      stopSpringTimer();
      return;
    }
    const key = nodeKey(node);
    if (expanded.has(key)) {
      stopSpringTimer();
      return;
    }
    // Already armed for this oid? Leave timer alone.
    const cur = springTimerRef.current;
    if (cur && cur.targetOid === dropTarget.oid) return;
    // Different target → reset and re-arm.
    stopSpringTimer();
    const targetOidSnapshot = dropTarget.oid;
    const timerId = setTimeout(() => {
      springTimerRef.current = null;
      setExpanded((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        return next;
      });
    }, SPRING_LOAD_DELAY_MS);
    springTimerRef.current = { timerId, targetOid: targetOidSnapshot };
  }, [dropTarget, dragSetOids, expanded, stopSpringTimer]);
  // Clear timer on unmount.
  useEffect(() => {
    return () => {
      stopSpringTimer();
    };
  }, [stopSpringTimer]);

  // Hit-test the row under (clientX, clientY) and update `dropTarget`.
  // Extracted from the pointermove handler so the auto-scroll rAF tick
  // can re-test under the LAST known pointer position as rows scroll
  // past — without that, a held-still pointer in the edge band would
  // scroll the list but the indicator would stay frozen on a row that
  // has scrolled out of view.
  const hitTestRow = useCallback((clientX: number, clientY: number) => {
    const elt = document.elementFromPoint(clientX, clientY);
    const rowEl =
      elt && elt instanceof Element
        ? (elt.closest("[data-tree-row-oid]") as HTMLElement | null)
        : null;
    if (!rowEl) {
      setDropTarget(null);
      return;
    }
    const targetOid = rowEl.getAttribute("data-tree-row-oid");
    if (!targetOid) {
      setDropTarget(null);
      return;
    }
    const rect = rowEl.getBoundingClientRect();
    const yRel = (clientY - rect.top) / Math.max(1, rect.height);
    // Top quarter = before; bottom quarter = after; middle half =
    // inside. Tighter "before/after" zones prevent accidental
    // sibling drops when the user means to nest.
    let position: DropPosition;
    if (yRel < 0.25) position = "before";
    else if (yRel > 0.75) position = "after";
    else position = "inside";
    setDropTarget((prev) => {
      if (prev && prev.oid === targetOid && prev.position === position) {
        return prev;
      }
      return { oid: targetOid, position };
    });
  }, []);

  const tickAutoScroll = useCallback(() => {
    const st = autoScrollStateRef.current;
    const container = scrollRef.current;
    if (!st || !container) return;
    const before = container.scrollTop;
    container.scrollTop += st.speed;
    // Hit the scrollable extent — kill the rAF. A future pointermove
    // can re-arm if the user drags away from the edge and back.
    if (container.scrollTop === before) {
      autoScrollStateRef.current = null;
      return;
    }
    hitTestRow(st.lastClientX, st.lastClientY);
    st.rafId = requestAnimationFrame(tickAutoScroll);
  }, [hitTestRow]);

  // Read the pointer's distance to the scroll container's top/bottom
  // edges. Inside the band → arm or update the rAF loop with a speed
  // that ramps linearly (1 px/frame at the band's outer edge → MAX at
  // the container edge). Outside the band → stop the rAF.
  const updateAutoScroll = useCallback(
    (clientX: number, clientY: number) => {
      const container = scrollRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const yFromTop = clientY - rect.top;
      const yFromBottom = rect.bottom - clientY;
      let speed = 0;
      if (yFromTop >= 0 && yFromTop < EDGE_BAND_PX) {
        const t = 1 - yFromTop / EDGE_BAND_PX; // 0..1, 1 at the very top
        speed = -Math.max(
          1,
          Math.round(t * MAX_AUTOSCROLL_SPEED_PX_PER_FRAME),
        );
      } else if (yFromBottom >= 0 && yFromBottom < EDGE_BAND_PX) {
        const t = 1 - yFromBottom / EDGE_BAND_PX;
        speed = Math.max(
          1,
          Math.round(t * MAX_AUTOSCROLL_SPEED_PX_PER_FRAME),
        );
      }
      if (speed === 0) {
        stopAutoScroll();
        return;
      }
      const cur = autoScrollStateRef.current;
      if (cur) {
        cur.speed = speed;
        cur.lastClientX = clientX;
        cur.lastClientY = clientY;
      } else {
        autoScrollStateRef.current = {
          rafId: requestAnimationFrame(tickAutoScroll),
          speed,
          lastClientX: clientX,
          lastClientY: clientY,
        };
      }
    },
    [stopAutoScroll, tickAutoScroll],
  );

  const cancelDrag = useCallback(() => {
    stopAutoScroll();
    stopSpringTimer();
    const st = dragStateRef.current;
    if (!st) return;
    window.removeEventListener("pointermove", st.onMove);
    window.removeEventListener("pointerup", st.onUp);
    window.removeEventListener("pointercancel", st.onCancel);
    window.removeEventListener("lostpointercapture", st.onLostCap);
    window.removeEventListener("keydown", st.onKey);
    window.removeEventListener("blur", st.onBlur);
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", st.onVisChange);
    }
    dragStateRef.current = null;
    setDragSetOids(null);
    setDropTarget(null);
    setDragGhost(null);
  }, [stopAutoScroll, stopSpringTimer]);

  // Per-row pointerdown — kicks off a drag candidate. The drag doesn't
  // activate until the pointer crosses the 5-px threshold; below that
  // it's a click. This means touching a row to select it (or to scroll
  // the list) doesn't accidentally start a drag.
  const onRowPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, oid: string | null) => {
      if (!dndEnabled) return;
      if (!oid) return;
      // Ignore right/middle clicks (left=0). Pen / touch report 0 too.
      if (e.button !== 0) return;
      // Don't start a drag if the user is invoking the chevron toggle
      // (the chevron <button> sits inside the row; e.target is the
      // button in that case). Same for the row's text button — clicks
      // on it should be selects, not drags. We allow the drag from the
      // padding area around them. Short-circuit if e.target is a
      // <button> or <input>.
      const target = e.target as HTMLElement | null;
      if (target && target.closest("button, input")) return;
      // Pointer capture — match the rail-width drag pattern (see
      // `onResizeDown` later in this file). Without it, a fast drag past
      // the row's bounding box on touch/stylus can hand the pointer
      // stream to whatever's underneath, leaving our window-level
      // listeners with no follow-up events. The `lostpointercapture`
      // listener registered below routes through `cancelDrag` if the OS
      // steals capture (e.g. browser drag-and-drop hijack).
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Some browsers throw if the pointer is no longer active by the
        // time we get here (e.g. user already released). Safe to ignore;
        // the gesture won't proceed past the threshold check anyway.
      }
      // Capture the drag set at pointerdown — a mid-drag prop change
      // (user adjusts selection in the canvas while holding pointer)
      // shouldn't shift the active set. Multi only kicks in when there's
      // a real multi-selection AND the grabbed row is part of it; else
      // single-drag of just this row.
      const dragSet: ReadonlyArray<string> =
        selectedOidsForDrag &&
        selectedOidsForDrag.length > 1 &&
        selectedOidsForDrag.includes(oid)
          ? [...selectedOidsForDrag]
          : [oid];
      const st = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        srcOid: oid,
        dragSet,
        activated: false,
        onMove: (() => {}) as (ev: PointerEvent) => void,
        onUp: (() => {}) as (ev: PointerEvent) => void,
        onKey: (() => {}) as (ev: KeyboardEvent) => void,
        onCancel: (() => {}) as (ev: PointerEvent) => void,
        onLostCap: (() => {}) as (ev: PointerEvent) => void,
        onBlur: (() => {}) as () => void,
        onVisChange: (() => {}) as () => void,
      };

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== st.pointerId) return;
        if (!st.activated) {
          const dx = ev.clientX - st.startX;
          const dy = ev.clientY - st.startY;
          if (dx * dx + dy * dy < 5 * 5) return;
          st.activated = true;
          setDragSetOids(st.dragSet);
          // Twenty-eighth pass — initialize the floating ghost tooltip
          // at activation. Label captures count + primary tag once;
          // mid-drag tree mutations don't relabel.
          const label = buildDragGhostLabel(
            treeForDndRef.current,
            st.srcOid,
            st.dragSet.length,
            // Thirty-fifth-pass chunk (mm) — apply the persisted
            // format preference (default "with-count" preserves
            // historical behavior).
            dragGhostFormatRef.current,
          );
          setDragGhost({ x: ev.clientX, y: ev.clientY, label });
        } else {
          // Active drag — track cursor for the ghost. setState is
          // skipped when the position hasn't moved, but pointer events
          // by definition fire on movement so this is the rare case.
          setDragGhost((prev) =>
            prev && (prev.x !== ev.clientX || prev.y !== ev.clientY)
              ? { ...prev, x: ev.clientX, y: ev.clientY }
              : prev,
          );
        }
        // Hit-test the row under the pointer. hitTestRow clears the
        // drop target if elementFromPoint returns null (cursor left
        // the document) so a stale indicator doesn't linger.
        hitTestRow(ev.clientX, ev.clientY);
        // Auto-scroll when the pointer enters the rail's top/bottom
        // edge band — lets the user reach hidden rows without
        // releasing. Outside the band this kills any in-flight rAF.
        updateAutoScroll(ev.clientX, ev.clientY);
      };

      const onUp = (ev: PointerEvent) => {
        if (ev.pointerId !== st.pointerId) return;
        // Capture state BEFORE we clear it.
        const wasActivated = st.activated;
        const cur = dropTargetRef.current;
        const src = st.srcOid;
        const dragSetSnap = st.dragSet;
        // Tear down listeners first so a synchronous setCode-driven
        // re-render doesn't see stale state.
        stopAutoScroll();
        stopSpringTimer();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        window.removeEventListener("lostpointercapture", onLostCap);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("blur", onBlur);
        if (typeof document !== "undefined") {
          document.removeEventListener("visibilitychange", onVisChange);
        }
        dragStateRef.current = null;
        setDragSetOids(null);
        setDropTarget(null);
        setDragGhost(null);
        if (!wasActivated || !cur) return;
        lastDropEndAtRef.current = Date.now();
        // Look up the destination tag for the success toast.
        const tagOf = (oid: string): string | undefined => {
          let found: string | undefined;
          const walk = (arr: ReadonlyArray<TreeNode>) => {
            for (const n of arr) {
              if (n.oid === oid) {
                found = n.tag;
                return;
              }
              if (n.children.length > 0) walk(n.children);
              if (found) return;
            }
          };
          walk(treeForDndRef.current);
          return found;
        };
        // Multi-target dispatch: if the user grabbed a row that's part of
        // a multi-select, try the multi-resolver first. On
        // `reparent-multi`, route to onTreeReparentMulti. On
        // `reorder-multi` (twenty-seventh pass), route to
        // onTreeReorderMulti. On `fall-back` we drop through to the
        // single resolver below using the user's grabbed row only. Hard
        // `noop` surfaces a bail and stops. Missing handler for a given
        // multi-kind also drops through (degrades gracefully to
        // single-drag of the grabbed row).
        // Twenty-eighth pass — auto-expand the drop target when the
        // user dropped "inside" it. The freshly-inserted / reparented
        // children would otherwise be hidden under a collapsed row.
        // Only inside drops need this — before/after drops anchor on
        // a target whose PARENT must already be expanded (else the
        // target wouldn't be visible to drop on).
        const maybeExpandInside = (success: boolean) => {
          if (!success) return;
          if (cur.position !== "inside") return;
          const key = `oid:${cur.oid}`;
          setExpanded((prev) => {
            if (prev.has(key)) return prev;
            const next = new Set(prev);
            next.add(key);
            return next;
          });
        };
        if (
          dragSetSnap.length > 1 &&
          (onTreeReparentMulti || onTreeReorderMulti || onTreeDndMixed)
        ) {
          const multi = resolveTreeDropMulti(
            treeForDndRef.current,
            dragSetSnap,
            cur.oid,
            cur.position,
          );
          if (multi.kind === "reparent-multi" && onTreeReparentMulti) {
            const ok = onTreeReparentMulti(multi.ops, tagOf(multi.newParentOid));
            maybeExpandInside(ok);
            return;
          }
          if (multi.kind === "reorder-multi" && onTreeReorderMulti) {
            // Twenty-ninth-pass — reorder-multi can now fire with
            // position=inside (drop into own parent → reorder to end).
            // Auto-expand the target so the moved items show under it
            // even on the rare case where the user collapsed mid-drag.
            const ok = onTreeReorderMulti(
              multi.parentOid,
              multi.oids,
              multi.toIndex,
            );
            maybeExpandInside(ok);
            return;
          }
          if (multi.kind === "mixed-multi" && onTreeDndMixed) {
            // Twenty-ninth-pass — mixed-multi covers before / after AND
            // inside (the inside fall-back was lifted). For inside-drop,
            // auto-expand the target so the user sees the freshly-placed
            // children. Before/after lands in the target's PARENT (which
            // is necessarily expanded since the user could see the
            // target row); no auto-expand needed.
            const ok = onTreeDndMixed(
              multi.parentOid,
              multi.sameParentOids,
              multi.sameParentToIndex,
              multi.crossParentOps,
              tagOf(multi.parentOid),
            );
            maybeExpandInside(ok);
            return;
          }
          if (multi.kind === "noop") {
            if (onTreeDropBail) onTreeDropBail(multi.reason);
            return;
          }
          // multi.kind === "fall-back" OR matching handler missing —
          // drop through to single resolver.
        }
        const result = resolveTreeDrop(
          treeForDndRef.current,
          src,
          cur.oid,
          cur.position,
        );
        if (result.kind === "noop") {
          if (onTreeDropBail) onTreeDropBail(result.reason);
          return;
        }
        if (result.kind === "reorder") {
          // Thirtieth-pass — reorder can now fire with position=inside
          // (single-drag mirror of multi same-parent inside-drop: drop
          // own child INTO own parent → reorder to end). Defense-in-
          // depth maybeExpandInside: the parent must already be
          // expanded for the user to have grabbed the child, but a
          // collapsed-mid-drag edge case could leave it shut.
          const ok =
            onTreeReorder?.(result.oid, result.parentOid, result.toIndex) ??
            false;
          maybeExpandInside(ok);
        } else {
          const ok =
            onTreeReparent?.(
              result.oid,
              result.newParentOid,
              result.insertIndex,
              undefined,
              tagOf(result.newParentOid),
            ) ?? false;
          maybeExpandInside(ok);
        }
      };
      const onCancel = (ev: PointerEvent) => {
        if (ev.pointerId !== st.pointerId) return;
        cancelDrag();
      };
      const onLostCap = (ev: PointerEvent) => {
        if (ev.pointerId !== st.pointerId) return;
        cancelDrag();
      };
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          cancelDrag();
        }
      };
      const onBlur = () => cancelDrag();
      const onVisChange = () => {
        if (typeof document !== "undefined" && document.hidden) cancelDrag();
      };
      st.onMove = onMove;
      st.onUp = onUp;
      st.onCancel = onCancel;
      st.onLostCap = onLostCap;
      st.onKey = onKey;
      st.onBlur = onBlur;
      st.onVisChange = onVisChange;
      dragStateRef.current = st;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
      window.addEventListener("lostpointercapture", onLostCap);
      window.addEventListener("keydown", onKey);
      window.addEventListener("blur", onBlur);
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", onVisChange);
      }
    },
    [
      dndEnabled,
      cancelDrag,
      onTreeReorder,
      onTreeReparent,
      onTreeDropBail,
      hitTestRow,
      updateAutoScroll,
      stopAutoScroll,
      selectedOidsForDrag,
      onTreeReparentMulti,
      onTreeReorderMulti,
    ],
  );

  // Cleanup on unmount — drop dangling window listeners if the user
  // navigates away mid-drag.
  useEffect(() => {
    return () => {
      cancelDrag();
    };
  }, [cancelDrag]);

  // Eighteenth-pass — tree row keyboard navigation. Tracks the row
  // that has visual + DOM focus separately from `selectedKey`. Arrow
  // keys move focus, Enter selects, Backspace/Cmd+D fire context-menu
  // actions. Defaults to selection on open so screen-reader users
  // start where their last interaction left off.
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  // Thirty-first-pass — auto-expand on tree change. Replaces the prior
  // "first-mount only" effect with a tree+depth-keyed effect so iframe
  // rebuilds (template swap, AI rewrite, in-place edits that reseed OIDs)
  // re-apply the user's last "global depth" choice against the fresh tree.
  // When `lastAppliedDepth` is null (user toggled rows manually), the
  // existing `expanded` set is preserved — stale keys for departed OIDs
  // are harmless (no row to render against), and surviving OIDs keep
  // their toggle state. The `initializedTreeRef` guard now only marks
  // first-tree-seen; the actual application is gated on lastAppliedDepth.
  useEffect(() => {
    if (tree.length === 0) return;
    if (!initializedTreeRef.current) {
      initializedTreeRef.current = true;
    }
    if (lastAppliedDepth !== null) {
      setExpanded(collectExpandToDepth(tree, lastAppliedDepth));
    }
  }, [tree, lastAppliedDepth]);

  // Thirty-second-pass — persist `lastAppliedDepth` to localStorage.
  // Writes on every change (depth changes are rare + user-initiated:
  // Depth dropdown click, ExpandAll/CollapseAll, ArrowLeft|Right) so no
  // debounce needed. Mirrors the rail-width persistence pattern below
  // but committed on state change instead of pointerup. SSR-safe via
  // `typeof window` guard inside `writeStoredDepth`. Idempotent — same
  // value writes the same string, no-op for the underlying storage.
  useEffect(() => {
    writeStoredDepth(lastAppliedDepth);
  }, [lastAppliedDepth]);

  // Thirty-second-pass — persist filter `query` to localStorage.
  // Writes on every keystroke; localStorage.setItem is sync but cheap
  // (<1ms typical), and a debounce risks losing the last keystroke if
  // the user reloads before the trailing-edge timer fires. Empty query
  // removes the key (see writeStoredQuery) so a fresh tab doesn't see
  // a lingering filter from a previous session.
  useEffect(() => {
    writeStoredQuery(query);
  }, [query]);

  // Thirty-second-pass chunk (t) — persist `expanded` to localStorage
  // ONLY when in manual mode (lastAppliedDepth === null). Depth-mode
  // users have their expanded set rebuilt by the depth re-apply effect
  // on every tree push, so persisting the depth-derived set would
  // clobber the next manual-mode session with stale data. Empty
  // manual-mode set is also persisted as "clear key" via
  // writeStoredExpanded so a fresh tab on a deliberately-collapsed
  // session restores correctly. Writes on every expanded change in
  // manual mode — chevron clicks are rare so no debounce.
  useEffect(() => {
    if (lastAppliedDepth !== null) return;
    writeStoredExpanded(expanded);
  }, [expanded, lastAppliedDepth]);

  // Thirty-second-pass chunk (t-fix) — proactive stale-expanded cleanup
  // on transition INTO depth mode. The lazy-init's depth-gate already
  // prevents loading stale entries (storedDepth !== null → return
  // empty Set), so functionally the stale entry is dormant. But if a
  // future change accidentally bypasses the depth-gate, the stale
  // entry would resurrect. This effect proactively clears it on every
  // depth-mode entry so storage stays tidy. Fires only on lastAppliedDepth
  // change (not on expanded change) — separate from the write effect
  // above so the depth-mode skip doesn't accidentally clear on every
  // tree push (which fires the depth re-apply, which mutates expanded).
  useEffect(() => {
    if (lastAppliedDepth !== null) {
      clearStoredExpanded();
    }
  }, [lastAppliedDepth]);

  // Thirty-third-pass chunk (q) — persist subtreeDepths to localStorage.
  // Writes on every change. Empty map removes the key (matches the
  // pattern in writeStoredExpanded — a fresh-tab read returning null
  // is preferable to "literally empty object" since the latter is
  // truthy and would skip the lazy-init's `?? {}` fallback).
  useEffect(() => {
    writeStoredSubtreeDepths(subtreeDepths);
  }, [subtreeDepths]);

  // Thirty-third-pass chunk (q) — replay subtreeDepths against the
  // live tree on every tree push, depth re-apply, OR subtreeDepths
  // change. For each (oid, depth) pair where the OID still resolves
  // to a node in the current tree, union the subtree's depth-N
  // expansion into `expanded`. Stale OIDs are silently skipped (their
  // entries persist in storage so a later tree push that DOES re-emit
  // the same OID — e.g. an undo bringing back a deleted element —
  // can still replay). Additive — never removes existing expansions.
  //
  // Three trigger sources:
  //   1. Tree change (iframe rebuild) — re-resolve OIDs against the
  //      fresh tree shape.
  //   2. lastAppliedDepth change — the depth-re-apply effect above
  //      REPLACES expanded with the depth-N grid, wiping subtree
  //      expansions; this effect re-unions them on top so depth-mode
  //      users keep their per-subtree drill-downs across global
  //      depth changes.
  //   3. subtreeDepths change — chunk-y cross-tab storage listener
  //      OR expandSubtreeToDepth firing here. The setExpanded call
  //      is idempotent (mutated-check returns the previous reference
  //      if no new keys would be added), so re-firing when the local
  //      expandSubtreeToDepth already did the work is a free no-op.
  useEffect(() => {
    if (tree.length === 0) return;
    const oidKeys = Object.keys(subtreeDepths);
    if (oidKeys.length === 0) return;
    // Build oid → node lookup once; saves O(N*M) walks where N is the
    // saved-OID count and M is the tree size.
    const oidNodeMap = new Map<string, TreeNode>();
    const walk = (arr: ReadonlyArray<TreeNode>) => {
      for (const n of arr) {
        if (n.oid) oidNodeMap.set(n.oid, n);
        if (n.children.length > 0) walk(n.children);
      }
    };
    walk(tree);
    const additions = new Set<string>();
    for (const oid of oidKeys) {
      const node = oidNodeMap.get(oid);
      if (!node) continue;
      const depth = subtreeDepths[oid];
      const subtreeExpansion = collectExpandToDepth([node], depth);
      for (const k of subtreeExpansion) additions.add(k);
    }
    if (additions.size === 0) return;
    setExpanded((prev) => {
      let mutated = false;
      const next = new Set(prev);
      for (const k of additions) {
        if (!next.has(k)) {
          next.add(k);
          mutated = true;
        }
      }
      return mutated ? next : prev;
    });
  }, [tree, lastAppliedDepth, subtreeDepths]);

  // Thirty-third-pass chunk (y) — multi-tab synchronization. When
  // another tab writes to dropin:tree:* (e.g. user changes depth in
  // tab A), this tab's listener re-reads the persisted state. The
  // listener is filtered to the dropin:tree:* namespace so unrelated
  // localStorage writes (auth tokens, other apps) don't trigger
  // re-reads. Storage events fire only in OTHER tabs (the originating
  // tab's listener doesn't fire — by spec), so there's no risk of a
  // self-feedback loop.
  //
  // The re-read is selective per key — querying a depth change only
  // refreshes the depth state — which keeps the cross-tab sync from
  // accidentally clobbering an in-progress local edit (e.g. a user
  // typing in the filter input in tab B while tab A's depth changes
  // shouldn't blow away tab B's typed query).
  //
  // For `e.key === null` (called when another tab does
  // localStorage.clear()), every state slice resets to its lazy-init
  // value. This case is rare but well-defined.
  useEffect(() => {
    const unsubscribe = subscribeStoredTreeStateChanges((key) => {
      if (key === null) {
        // Whole-storage wipe — reset every tree-side slice to its
        // lazy-init default. Panel-only keys are handled by
        // StorageHealthPanel's own subscription.
        setLastAppliedDepth(DEFAULT_EXPAND_DEPTH);
        setQuery("");
        setExpanded(new Set());
        setSubtreeDepths({});
        setDragGhostFormat(readStoredDragGhostFormat());
        setSubtreeDepthCap(readEffectiveSubtreeDepthCap());
        setStorageWarnBytes(readEffectiveStorageWarnBytes());
        setStorageDangerBytes(readEffectiveStorageDangerBytes());
        return;
      }
      if (key === TREE_PERSISTENCE_CONSTANTS.KEY_DEPTH) {
        setLastAppliedDepth(readStoredDepth(DEFAULT_EXPAND_DEPTH));
      } else if (key === TREE_PERSISTENCE_CONSTANTS.KEY_QUERY) {
        setQuery(readStoredQuery());
      } else if (key === TREE_PERSISTENCE_CONSTANTS.KEY_EXPANDED) {
        const stored = readStoredExpanded();
        setExpanded(stored ? new Set(stored) : new Set());
      } else if (key === TREE_PERSISTENCE_CONSTANTS.KEY_SUBTREE_DEPTHS) {
        setSubtreeDepths(readStoredSubtreeDepths() ?? {});
      } else if (key === TREE_PERSISTENCE_CONSTANTS.DRAG_GHOST_FORMAT_KEY) {
        // Cross-tab sync of the format preference. The next drag picks
        // up the new format; the currently-pinned dragGhost.label is
        // intentionally NOT recomputed (mid-drag intent is fixed at
        // pointer-down).
        setDragGhostFormat(readStoredDragGhostFormat());
      } else if (
        key === TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_CAP_USER_OVERRIDE_KEY
      ) {
        setSubtreeDepthCap(readEffectiveSubtreeDepthCap());
      } else if (
        key === TREE_PERSISTENCE_CONSTANTS.STORAGE_WARN_BYTES_USER_OVERRIDE_KEY
      ) {
        // The pill's severity recomputes on the next render
        // (storedBytesSeverity useMemo deps include the threshold).
        setStorageWarnBytes(readEffectiveStorageWarnBytes());
      } else if (
        key ===
        TREE_PERSISTENCE_CONSTANTS.STORAGE_DANGER_BYTES_USER_OVERRIDE_KEY
      ) {
        setStorageDangerBytes(readEffectiveStorageDangerBytes());
      }
    });
    return unsubscribe;
  }, []);

  // Auto-expand the chain to the selected node so its row is visible
  // even if the user collapsed the parent chain previously. Re-runs on
  // every selection change. Doesn't mutate when ancestors are already
  // open (no-op set update).
  useEffect(() => {
    if (!selectedKey) return;
    if (tree.length === 0) return;
    const ancestors = findAncestorKeys(tree, selectedKey);
    if (ancestors.length === 0) return;
    setExpanded((prev) => {
      let mutated = false;
      const next = new Set(prev);
      for (const k of ancestors) {
        if (!next.has(k)) {
          next.add(k);
          mutated = true;
        }
      }
      return mutated ? next : prev;
    });
  }, [selectedKey, tree]);

  // Filter — when the user types in the search box, expand every
  // ancestor of every match so the matching rows are visible without
  // clicking through. Doesn't blow away the user's manual
  // expand/collapse state because we only union into the existing set.
  // The `visibleKeys.keep` is also used by TreeRow to skip non-matching
  // branches entirely.
  const visible = useMemo(() => buildVisibleKeys(tree, query), [tree, query]);
  useEffect(() => {
    if (!visible) return;
    if (visible.keep.size === 0) return;
    setExpanded((prev) => {
      let mutated = false;
      const next = new Set(prev);
      for (const k of visible.keep) {
        if (!next.has(k)) {
          next.add(k);
          mutated = true;
        }
      }
      return mutated ? next : prev;
    });
  }, [visible]);

  // Scroll the selected row into view if it's outside the visible area.
  // `block: 'nearest'` keeps a centered selection from jumping; only
  // off-screen rows scroll. Defer one frame so the auto-expand effect
  // above has a chance to mount the row first.
  useEffect(() => {
    if (!open) return;
    if (!selectedKey) return;
    const id = requestAnimationFrame(() => {
      const el = selectedRowRef.current;
      const scroller = scrollRef.current;
      if (!el || !scroller) return;
      const rowRect = el.getBoundingClientRect();
      const scRect = scroller.getBoundingClientRect();
      if (rowRect.top < scRect.top || rowRect.bottom > scRect.bottom) {
        el.scrollIntoView({ block: "nearest" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [selectedKey, expanded, open]);

  // Flat list of currently-visible rows in DOM order. Used by the
  // arrow-key handlers to compute "next row" / "previous row" and to
  // map a focusedKey to its parent / first-child for Left/Right.
  // Mirrors the render walk so the order stays in sync.
  const visibleRows = useMemo(() => {
    type Row = {
      key: string;
      node: TreeNode;
      depth: number;
      hasChildren: boolean;
      isOpen: boolean;
      parentKey: string | null;
    };
    const rows: Row[] = [];
    function walk(
      arr: ReadonlyArray<TreeNode>,
      depth: number,
      parentKey: string | null,
    ) {
      for (const n of arr) {
        const k = nodeKey(n);
        if (visible && !visible.keep.has(k)) continue;
        const isOpen = expanded.has(k);
        const hasChildren = n.children.length > 0;
        rows.push({
          key: k,
          node: n,
          depth,
          hasChildren,
          isOpen,
          parentKey,
        });
        if (hasChildren && isOpen) walk(n.children, depth + 1, k);
      }
    }
    walk(tree, 0, null);
    return rows;
  }, [tree, expanded, visible]);

  // Twenty-ninth-pass — set of visible oids for Cmd/Ctrl+A. When filter
  // is active, includes every node whose key is in `visible.keep` (i.e.
  // direct match OR ancestor of a match) AND has an oid. Note this is
  // broader than visibleRows — it includes nodes under collapsed-but-
  // matching parents, because Cmd+A should select every "filter-passing"
  // sibling not just the currently-rendered ones. When no filter, null
  // (the helper treats null as "no constraint, accept any oid").
  const visibleOidSet = useMemo<ReadonlySet<string> | null>(() => {
    if (!visible) return null;
    const s = new Set<string>();
    const walk = (arr: ReadonlyArray<TreeNode>) => {
      for (const n of arr) {
        const k = nodeKey(n);
        if (visible.keep.has(k) && n.oid) s.add(n.oid);
        if (n.children.length > 0) walk(n.children);
      }
    };
    walk(tree);
    return s;
  }, [tree, visible]);

  // Sync focused-row DOM focus when focusedKey changes — gives screen
  // readers + visual focus rings + keyboard handlers something to bite
  // on. rAF defer so the row mounts first when an arrow press both
  // moves focus AND expands the parent.
  useEffect(() => {
    if (!open) return;
    if (!focusedKey) return;
    const id = requestAnimationFrame(() => {
      focusedRowRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [focusedKey, open]);

  // Thirty-third-pass chunk (p) — derive the focused row's OID + tag
  // for the toolbar "Subtree ▾" dropdown. Resolves against visibleRows
  // (the same DFS-flattened list the keyboard nav uses), so a focused
  // OID-less row (HTML-mode) yields null and disables the button.
  // Falls back to the selected row when no row is focused — a
  // selection that's currently scrolled out of focus is still a
  // meaningful subtree-target. Memoised on visibleRows + focusedKey
  // + selectedKey so it re-derives only when one of those changes.
  const subtreeMenuTarget = useMemo<{ oid: string; tag: string } | null>(() => {
    const targetKey = focusedKey ?? selectedKey;
    if (!targetKey) return null;
    const row = visibleRows.find((r) => r.key === targetKey);
    if (!row) return null;
    if (!row.node.oid) return null;
    return { oid: row.node.oid, tag: row.node.tag };
  }, [visibleRows, focusedKey, selectedKey]);

  // When the rail opens, default focus to the selected row (or first
  // visible row when nothing's selected). Cleared on close so re-open
  // doesn't carry stale focus across sessions.
  useEffect(() => {
    if (!open) {
      setFocusedKey(null);
      return;
    }
    setFocusedKey((cur) => {
      if (cur && visibleRows.some((r) => r.key === cur)) return cur;
      if (selectedKey && visibleRows.some((r) => r.key === selectedKey)) {
        return selectedKey;
      }
      return visibleRows[0]?.key ?? null;
    });
  }, [open, visibleRows, selectedKey]);

  // Thirtieth-pass — shift-click range-select dispatcher. Wraps the row
  // click → onSelect path with a range computation when the user holds
  // shift AND the active selection has a primary in the visible rows.
  // Falls through to the original additive `onSelect(node, true)` when
  // any of: range handler not wired (HTML mode), no current primary, or
  // the helper produces an empty result (clicked row has no oid). The
  // helper itself respects the active filter via visibleRows. Also bound
  // to Shift+Enter in the keyboard handler so range-select works without
  // the mouse.
  const handleRowShiftClick = useCallback(
    (node: TreeNode) => {
      if (!onSelectRangeInTree || !selectedKey) {
        onSelect(node, true);
        return;
      }
      const clickedKey = nodeKey(node);
      const rows = visibleRows.map((r) => ({ key: r.key, oid: r.node.oid }));
      const oids = collectShiftClickRangeOids(rows, selectedKey, clickedKey);
      if (oids.length === 0) {
        onSelect(node, true);
        return;
      }
      onSelectRangeInTree(oids);
    },
    [onSelectRangeInTree, selectedKey, visibleRows, onSelect],
  );

  // Keyboard handler bound to the tree's <ul>. Up/Down/Left/Right move
  // focus through visibleRows; Enter selects; Cmd+D / Backspace fire
  // context actions. We bind to the <ul> instead of window to avoid
  // stealing keys from the search box, the rest of the workspace, or
  // Monaco. The handler ignores modifier-laden combos that aren't
  // explicitly recognised so it doesn't shadow browser shortcuts.
  const onTreeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (!focusedKey) return;
      const idx = visibleRows.findIndex((r) => r.key === focusedKey);
      if (idx < 0) return;
      const row = visibleRows[idx];

      const k = e.key;
      // Phase 6 ramp — Alt+ArrowUp/Down moves the focused row within
      // its parent via onTreeReorder. JSX-only (skipped when no oid /
      // no DnD callbacks). Boundary checks bail silently — no toast,
      // no beep — so the user doesn't get feedback noise from arrow-
      // hold repeat. Only the within-parent direction is exposed via
      // keyboard; cross-parent reparent stays mouse-driven (no obvious
      // arrow gesture for it). The row's own parent must have an oid;
      // top-level rows can't be reordered (their parent is the
      // synthetic tree root).
      if (
        e.altKey &&
        (k === "ArrowDown" || k === "ArrowUp") &&
        row.node.oid &&
        onTreeReorder
      ) {
        e.preventDefault();
        const info = findSiblingInfo(tree, row.node.oid);
        if (!info) return;
        const dir = k === "ArrowDown" ? 1 : -1;
        const newIdx = info.index + dir;
        if (newIdx < 0 || newIdx > info.siblingsCount - 1) return;
        onTreeReorder(row.node.oid, info.parentOid, newIdx);
        return;
      }
      if (k === "ArrowDown") {
        e.preventDefault();
        const next = visibleRows[idx + 1];
        if (next) setFocusedKey(next.key);
      } else if (k === "ArrowUp") {
        e.preventDefault();
        const prev = visibleRows[idx - 1];
        if (prev) setFocusedKey(prev.key);
      } else if (k === "ArrowLeft") {
        e.preventDefault();
        if (row.hasChildren && row.isOpen) {
          // Thirty-first-pass — manual ArrowLeft collapse drops depth
          // tracking so iframe rebuilds don't re-snap to a depth grid.
          setLastAppliedDepth(null);
          // Collapse the current row.
          setExpanded((prev) => {
            const next = new Set(prev);
            next.delete(row.key);
            return next;
          });
        } else if (row.parentKey) {
          // Move focus up to parent.
          setFocusedKey(row.parentKey);
        }
      } else if (k === "ArrowRight") {
        e.preventDefault();
        if (row.hasChildren && !row.isOpen) {
          // Same depth-untrack as ArrowLeft — once the user touches a
          // row's expand state by hand, depth-grid snaps stop firing.
          setLastAppliedDepth(null);
          // Expand the current row.
          setExpanded((prev) => {
            const next = new Set(prev);
            next.add(row.key);
            return next;
          });
        } else if (row.hasChildren && row.isOpen) {
          // Move focus to first child.
          const first = visibleRows[idx + 1];
          if (first && first.depth === row.depth + 1) {
            setFocusedKey(first.key);
          }
        }
      } else if (k === "Enter" || k === " ") {
        e.preventDefault();
        // Thirtieth-pass — Shift+Enter routes through the range-select
        // dispatcher so keyboard users can extend selection to focused
        // row from the existing primary.
        if (e.shiftKey) handleRowShiftClick(row.node);
        else onSelect(row.node, false);
      } else if (k === "Home") {
        e.preventDefault();
        if (visibleRows.length > 0) setFocusedKey(visibleRows[0].key);
      } else if (k === "End") {
        e.preventDefault();
        if (visibleRows.length > 0) {
          setFocusedKey(visibleRows[visibleRows.length - 1].key);
        }
      } else if ((k === "Backspace" || k === "Delete") && row.node.oid && onDelete) {
        e.preventDefault();
        // Twenty-eighth pass — multi-row delete via keyboard. The
        // predicate `shouldRouteThroughMulti` decides; otherwise fall
        // back to single-row delete for the focused row.
        if (
          shouldRouteThroughMulti(
            row.node.oid,
            selectedOidsForDrag,
            !!onDeleteMulti,
          )
        ) {
          onDeleteMulti!(selectedOidsForDrag!);
        } else {
          onDelete(row.node.oid);
        }
      } else if (
        (e.metaKey || e.ctrlKey) &&
        (k === "a" || k === "A") &&
        onSelectAllInTree
      ) {
        // Twenty-ninth-pass — Cmd/Ctrl+A. Selects siblings of the
        // focused row (or all visible oids when no focus). preventDefault
        // stops the browser's native "select all text" inside the rail.
        // Skip the dispatch if the helper produced zero candidates so
        // an empty filter result doesn't clobber the existing selection.
        // Cmd/Ctrl+Shift+A escalates to "all visible" — same helper
        // called with focusedOid=null so the flatten branch fires.
        e.preventDefault();
        const focusedOid = e.shiftKey ? null : (row.node.oid ?? null);
        const oids = collectSelectAllOids(tree, focusedOid, visibleOidSet);
        if (oids.length > 0) onSelectAllInTree(oids);
      } else if (
        (e.metaKey || e.ctrlKey) &&
        (k === "d" || k === "D") &&
        row.node.oid &&
        onDuplicate
      ) {
        e.preventDefault();
        if (
          shouldRouteThroughMulti(
            row.node.oid,
            selectedOidsForDrag,
            !!onDuplicateMulti,
          )
        ) {
          onDuplicateMulti!(selectedOidsForDrag!);
        } else {
          onDuplicate(row.node.oid);
        }
      } else if (
        // Thirty-fourth-pass chunk (gg) — keyboard shortcuts for the
        // toolbar dropdowns. `d` toggles the Depth ▾ popover; `s`
        // toggles the Subtree ▾ popover for the focused row. Both
        // require zero modifiers (Cmd+D is already wired above for
        // duplicate; Cmd+S is the browser's save-page and we
        // intentionally don't shadow it). Toggles, not open-only, so
        // tapping the same key twice closes the popover without
        // requiring Esc or click-outside. Subtree shortcut bails when
        // the focused row has no OID — same disabled semantic as the
        // toolbar button.
        (k === "d" || k === "D") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        setSubtreeMenuOpen(false);
        setDepthMenuOpen((v) => !v);
      } else if (
        (k === "s" || k === "S") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey &&
        row.node.oid
      ) {
        e.preventDefault();
        setDepthMenuOpen(false);
        setSubtreeMenuOpen((v) => !v);
      } else if (
        // `g` toggles the storage health debug panel. Mnemonic:
        // "graph"/"storage". No modifiers — Cmd+G is the browser's
        // "find next" and we intentionally don't shadow it. Closes the
        // depth/subtree popovers first so only one chrome surface is
        // open at a time. The `t`/`a`/`f` shortcuts that activate when
        // the panel is open live inside StorageHealthPanel.
        (k === "g" || k === "G") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        setDepthMenuOpen(false);
        setSubtreeMenuOpen(false);
        setStorageHealthOpen((v) => !v);
      }
    },
    [
      focusedKey,
      visibleRows,
      tree,
      onSelect,
      onDuplicate,
      onDelete,
      onDuplicateMulti,
      onDeleteMulti,
      selectedOidsForDrag,
      onTreeReorder,
      onSelectAllInTree,
      visibleOidSet,
      handleRowShiftClick,
    ],
  );

  // Persist rail width on commit (pointerup). We don't write per-frame
  // during the drag — that would be wasteful and could fight with other
  // tabs using the same key. Width state IS updated per-frame so the
  // visual lands smoothly; only the localStorage write is batched.
  const persistWidth = useCallback((w: number) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(RAIL_WIDTH_STORAGE_KEY, String(w));
    } catch {
      // localStorage unavailable; in-memory only.
    }
  }, []);

  // Pointer-driven resize. The handle is a 6-px-wide vertical strip
  // anchored to the right edge of the rail. pointerdown captures, the
  // window listeners drive width updates, pointerup commits + clears
  // listeners. Cancel on Esc / blur / tab-hide / lostpointercapture.
  const onResizeDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = width;
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      let lastWidth = startWidth;
      const onMove = (ev: PointerEvent) => {
        // Tree rail anchors to the RIGHT side of the workspace — handle is on
        // the panel's left edge. Dragging LEFT (dx < 0) grows the panel.
        const dx = ev.clientX - startX;
        const next = Math.min(
          RAIL_WIDTH_MAX,
          Math.max(RAIL_WIDTH_MIN, Math.round(startWidth - dx)),
        );
        if (next !== lastWidth) {
          lastWidth = next;
          setWidth(next);
        }
      };
      const cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        window.removeEventListener("lostpointercapture", onCancel);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("blur", onCancel);
        if (typeof document !== "undefined") {
          document.removeEventListener("visibilitychange", onVisChange);
        }
        try {
          target.releasePointerCapture(e.pointerId);
        } catch {}
      };
      const onUp = () => {
        cleanup();
        persistWidth(lastWidth);
      };
      const onCancel = () => {
        cleanup();
        // Cancel = revert to the start width so partial drags don't
        // half-resize the rail.
        setWidth(startWidth);
      };
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          onCancel();
        }
      };
      const onVisChange = () => {
        if (typeof document !== "undefined" && document.hidden) onCancel();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
      window.addEventListener("lostpointercapture", onCancel);
      window.addEventListener("keydown", onKey);
      window.addEventListener("blur", onCancel);
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", onVisChange);
      }
    },
    [persistWidth, width],
  );

  // Reset to default width on double-click — the only way to recover
  // from a "I dragged it too far" mistake without opening DevTools or
  // localStorage by hand.
  const onResizeDoubleClick = useCallback(() => {
    setWidth(RAIL_WIDTH_DEFAULT);
    persistWidth(RAIL_WIDTH_DEFAULT);
  }, [persistWidth]);

  // Thirty-second-pass chunk (x) — Reset tree state. Wipes every
  // dropin:tree:* key (depth, query, expanded; rail-width and
  // tree-open are intentionally preserved since those are workspace
  // layout choices, not tree state) AND resets in-memory state to
  // defaults. Useful when:
  //   - User has corrupted persisted state via DevTools
  //   - Storage from an old session has stale data and user wants a
  //     fresh slate
  //   - Future schema bumps where users want to clear v1 data
  // No confirmation dialog — chevron clicks are cheap to rebuild and
  // the cost of an accidental click is low (worst case the user
  // re-expands a few rows). Adding a confirm modal would be
  // gold-plating for what's essentially a "fresh-tab" affordance.
  const performResetTreeState = useCallback(() => {
    clearAllStoredTreeState();
    setLastAppliedDepth(DEFAULT_EXPAND_DEPTH);
    setQuery("");
    setExpanded(collectExpandToDepth(tree, DEFAULT_EXPAND_DEPTH));
    setSubtreeDepths({});
  }, [tree]);

  // Thirty-third-pass chunk (aa) — two-step tap-to-confirm. First
  // click arms the prompt with a 3-second timer; second click within
  // the window confirms and runs the wipe. After the timer fires
  // OR a parent click-outside disarms the state, the next click
  // re-arms instead of confirming. Cancels the timer on every
  // re-arm so the 3-second window always restarts from the latest
  // tap.
  const RESET_CONFIRM_TIMEOUT_MS = 3000;
  const disarmResetConfirm = useCallback(() => {
    if (confirmResetTimerRef.current !== null) {
      clearTimeout(confirmResetTimerRef.current);
      confirmResetTimerRef.current = null;
    }
    setConfirmingReset(false);
  }, []);
  const handleResetTreeState = useCallback(() => {
    if (confirmingReset) {
      // Confirm tap — run the wipe and disarm.
      disarmResetConfirm();
      performResetTreeState();
      return;
    }
    // First tap — arm the prompt.
    setConfirmingReset(true);
    if (confirmResetTimerRef.current !== null) {
      clearTimeout(confirmResetTimerRef.current);
    }
    confirmResetTimerRef.current = setTimeout(() => {
      confirmResetTimerRef.current = null;
      setConfirmingReset(false);
    }, RESET_CONFIRM_TIMEOUT_MS);
  }, [confirmingReset, disarmResetConfirm, performResetTreeState]);
  // Cleanup the timer on unmount so a fast unmount doesn't leak the
  // timeout (which would call setState on an unmounted component).
  useEffect(() => {
    return () => {
      if (confirmResetTimerRef.current !== null) {
        clearTimeout(confirmResetTimerRef.current);
        confirmResetTimerRef.current = null;
      }
    };
  }, []);

  const totalNodes = useMemo(() => countNodes(tree), [tree]);
  const visibleCount = useMemo(() => {
    if (!visible) return totalNodes;
    return visible.matches.size;
  }, [visible, totalNodes]);

  // Thirty-fourth-pass chunk (dd) — predicate gating the Reset button.
  // True when every persisted state slice is at its lazy-init default
  // (depth=DEFAULT_EXPAND_DEPTH, query="", subtreeDepths={}). Hides the
  // Reset button when there's nothing to reset — first-time users never
  // see a "confirm reset of nothing" dead-end. The expanded set is NOT
  // independently checked because the chunk-t write effect skips
  // persisting it when lastAppliedDepth !== null (see lib/tree-
  // persistence.ts isStoredTreeStateAtDefaults docs for the full
  // rationale).
  const isPersistedTreeStateDefault = useMemo(
    () =>
      isStoredTreeStateAtDefaults({
        lastAppliedDepth,
        defaultDepth: DEFAULT_EXPAND_DEPTH,
        query,
        subtreeDepths,
      }),
    [lastAppliedDepth, query, subtreeDepths],
  );

  // Storage telemetry — predict byte cost from in-memory state, not
  // from localStorage. A render-time localStorage read would see the
  // previous tick's value because the write effects commit AFTER
  // render; the prediction mirrors the same gating rules so the
  // post-write number is what shows. Cross-tab writes are covered by
  // the storage-event subscription, which setState's here and
  // re-triggers this useMemo.
  const storedBytes = useMemo(
    () =>
      predictStoredTreeStateBytes({
        lastAppliedDepth,
        query,
        expanded,
        subtreeDepths,
        subtreeDepthCap,
      }),
    [lastAppliedDepth, query, expanded, subtreeDepths, subtreeDepthCap],
  );
  const storedBytesLabel = useMemo(
    () => formatStoredBytes(storedBytes.bytes),
    [storedBytes.bytes],
  );
  // Thirty-fifth-pass chunk (kk) — quota-proximity severity for the
  // storage telemetry pill. "ok" → muted text (default), "warn" →
  // coral text, "danger" → coral background + paper text. Memoized off
  // the same byte count so the className string is stable across
  // unrelated state ticks.
  // Thirty-sixth-pass chunk (rr) — pass effective thresholds (build-
  // time defaults OR user-override values) into the classifier. Deps
  // expand to include the threshold state so a same-tab preference
  // change re-renders the pill.
  const storedBytesSeverity = useMemo(
    () =>
      classifyStorageBytes(storedBytes.bytes, {
        warnAt: storageWarnBytes,
        dangerAt: storageDangerBytes,
      }),
    [storedBytes.bytes, storageWarnBytes, storageDangerBytes],
  );

  // Storage health debug panel open/close state. The panel itself
  // lives in StorageHealthPanel; the parent owns this so the footer
  // pill button + the `g` keyboard shortcut can toggle it. Mounting
  // the panel only when open keeps the panel's lazy-init reads off
  // the critical path until the user actually opens it.
  const [storageHealthOpen, setStorageHealthOpen] = useState(false);

  // Thirty-fourth-pass chunk (dd) — auto-disarm the Reset confirm
  // prompt when state transitions back to default while the prompt is
  // armed. Without this, a re-modification within the 3-second window
  // would re-show the button in armed state without the user having
  // tapped it again.
  useEffect(() => {
    if (isPersistedTreeStateDefault && confirmingReset) {
      if (confirmResetTimerRef.current !== null) {
        clearTimeout(confirmResetTimerRef.current);
        confirmResetTimerRef.current = null;
      }
      setConfirmingReset(false);
    }
  }, [isPersistedTreeStateDefault, confirmingReset]);

  const toggle = useCallback(
    (key: string) => {
      // Thirty-first-pass — manual chevron toggle drops out of "global
      // depth" tracking so a future iframe rebuild doesn't snap the
      // user's bespoke expansion state back to a depth grid.
      setLastAppliedDepth(null);
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    },
    [],
  );

  // Expand every node in the tree. Thirty-first-pass — also marks the
  // global-depth tracker so iframe rebuilds preserve the user's "show
  // me everything" choice across template swaps. EXPAND_ALL_DEPTH is
  // Infinity — `collectExpandToDepth(_, Infinity)` walks every level.
  const expandAll = useCallback(() => {
    setLastAppliedDepth(EXPAND_ALL_DEPTH);
    setExpanded(collectExpandToDepth(tree, EXPAND_ALL_DEPTH));
  }, [tree]);

  // Collapse all back to the default 2-depth state. Reuses
  // collectExpandToDepth so the post-collapse view matches what the user
  // sees on initial open. Thirty-first-pass — also marks the depth
  // tracker so iframe rebuilds keep the same "default depth" view.
  const collapseAll = useCallback(() => {
    setLastAppliedDepth(DEFAULT_EXPAND_DEPTH);
    setExpanded(collectExpandToDepth(tree, DEFAULT_EXPAND_DEPTH));
  }, [tree]);

  // Thirtieth-pass — context-menu "Expand depth: 1 2 3 4 5". Replaces the
  // existing `expanded` set with `collectExpandToDepth(tree, depth)`. Also
  // bound to a header button row so the action is discoverable without
  // right-click. d=0 maps to "everything collapsed" — same as a hard
  // collapse-to-root; d=∞ maps to expand-all (use the existing ⤓ button
  // for that semantic since "depth 5" caps at 5).
  // Thirty-first-pass — also marks the global-depth tracker so iframe
  // rebuilds re-apply the user's "depth N" choice instead of snapping
  // back to default.
  const expandToDepth = useCallback(
    (depth: number) => {
      setLastAppliedDepth(depth);
      setExpanded(collectExpandToDepth(tree, depth));
    },
    [tree],
  );

  // Thirtieth-pass — context-menu "Subtree depth: 1 2 3 4 5". Row-scoped
  // variant of the tree-wide expandToDepth. Walks the tree to find the
  // root node by oid, then calls `collectExpandToDepth([root], depth)`
  // to compute the subtree's additions. Unions with existing expanded so
  // the user's other expansions are preserved (additive — Finder's "open
  // this folder to depth N" semantic). Falls through silently when oid
  // not found (stale right-click after a tree rebuild).
  const expandSubtreeToDepth = useCallback(
    (rootOid: string, depth: number) => {
      let rootNode: TreeNode | null = null;
      const walk = (arr: ReadonlyArray<TreeNode>) => {
        for (const n of arr) {
          if (rootNode) return;
          if (n.oid === rootOid) {
            rootNode = n;
            return;
          }
          if (n.children.length > 0) walk(n.children);
        }
      };
      walk(tree);
      if (!rootNode) return;
      const additions = collectExpandToDepth([rootNode as TreeNode], depth);
      setExpanded((prev) => {
        let mutated = false;
        const next = new Set(prev);
        for (const k of additions) {
          if (!next.has(k)) {
            next.add(k);
            mutated = true;
          }
        }
        return mutated ? next : prev;
      });
      // Thirty-third-pass chunk (q) — record the (oid, depth) pair so
      // a future tree push (iframe rebuild) replays the same expansion.
      // mergeStoredSubtreeDepth bumps recency by removing-and-reinserting
      // existing entries; the FIFO cap is enforced on serialize.
      setSubtreeDepths((prev) => mergeStoredSubtreeDepth(prev, rootOid, depth));
    },
    [tree],
  );

  // Thirty-first-pass (n) — destructive subtree collapse. Removes the
  // root key + every descendant container key from `expanded`, leaving
  // the rest of the tree (siblings + ancestors) untouched. Stale
  // rootOid (no match in tree) silently no-ops. Unlike
  // `expandSubtreeToDepth(rootOid, 0)` which is also destructive, this
  // one is symmetric with the expand-subtree action — single click,
  // explicit "collapse this branch" semantic. Doesn't touch
  // lastAppliedDepth (manual user action, but the global-depth tracker
  // stays whatever it was — same logic as expandSubtreeToDepth).
  const collapseSubtree = useCallback(
    (rootOid: string) => {
      const keysToRemove = collectCollapseSubtreeKeys(tree, rootOid);
      if (keysToRemove.size === 0) return;
      setExpanded((prev) => {
        let mutated = false;
        const next = new Set(prev);
        for (const k of keysToRemove) {
          if (next.delete(k)) mutated = true;
        }
        return mutated ? next : prev;
      });
      // Thirty-third-pass chunk (q) — drop the stored subtree-depth
      // entry. If the user collapses a subtree they'd previously
      // expanded via the chunk-(j) action, the replay effect would
      // re-expand it on the next tree push (frustrating). Dropping
      // the entry on explicit collapse matches "collapsed wins over
      // remembered" Finder semantic.
      setSubtreeDepths((prev) => {
        if (!(rootOid in prev)) return prev;
        const next = { ...prev };
        delete next[rootOid];
        return next;
      });
    },
    [tree],
  );

  // Thirty-third-pass chunk (cc) — Forget just the stored subtree-
  // depth entry without collapsing the live expansion. Used by the
  // context menu's "Forget subtree depth" item.
  const forgetSubtreeDepth = useCallback((rootOid: string) => {
    setSubtreeDepths((prev) => {
      if (!(rootOid in prev)) return prev;
      const next = { ...prev };
      delete next[rootOid];
      return next;
    });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  // Close the context menu on any click outside it OR on Esc. Bound at
  // the document level because the menu is positioned absolutely and
  // the user's next interaction could land anywhere.
  useEffect(() => {
    if (!contextMenu) return;
    const onDown = () => closeContextMenu();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContextMenu();
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [contextMenu, closeContextMenu]);

  // Thirty-first-pass — same click-outside / Esc handling for the toolbar
  // Depth dropdown. The popover's own onPointerDown stopPropagation gates
  // these listeners so a click ON the popover doesn't auto-close it.
  useEffect(() => {
    if (!depthMenuOpen) return;
    const onDown = () => setDepthMenuOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDepthMenuOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [depthMenuOpen]);

  // Thirty-third-pass chunk (p) — same click-outside / Esc handling
  // for the toolbar Subtree dropdown. Mirrors the Depth dropdown's
  // listener but with its own state hook.
  useEffect(() => {
    if (!subtreeMenuOpen) return;
    const onDown = () => setSubtreeMenuOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSubtreeMenuOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [subtreeMenuOpen]);

  // Thirty-third-pass chunk (p) — auto-close the Subtree dropdown
  // when the focused row changes to one without an OID (or no row
  // focused). Prevents a stale dropdown from acting on a target
  // that no longer makes sense.
  useEffect(() => {
    if (subtreeMenuOpen && subtreeMenuTarget === null) {
      setSubtreeMenuOpen(false);
    }
  }, [subtreeMenuOpen, subtreeMenuTarget]);

  const onRowContextMenu = useCallback(
    (node: TreeNode, x: number, y: number) => {
      // Menu only useful for OID-bearing nodes; html-mode nodes have no
      // OID so applyDuplicate / applyDelete can't address them.
      if (!node.oid) return;
      if (!onDuplicate && !onDelete) return;
      // Twenty-ninth-pass — snapshot the multi-set at open time so the
      // ContextMenu's "Duplicate N" / "Delete N" actions act on a fixed
      // target list, not whatever's selected when the menu item finally
      // gets clicked. Mirrors `dragSet` capture in onRowPointerDown.
      let multiOids: ReadonlyArray<string> | null = null;
      if (
        selectedOidsForDrag &&
        selectedOidsForDrag.length >= 2 &&
        selectedOidsForDrag.includes(node.oid)
      ) {
        multiOids = [...selectedOidsForDrag];
      }
      setContextMenu({ oid: node.oid, tag: node.tag, x, y, multiOids });
    },
    [onDuplicate, onDelete, selectedOidsForDrag],
  );

  // Hover handlers: per-row mouseenter sends OID, mouseleave clears.
  // Wrapping in callbacks so the inner row identity-checks the
  // function reference for memoisation purposes (currently TreeRow
  // doesn't memoize but a future React.memo wrap would benefit).
  const onRowEnter = useCallback(
    (oid: string | null) => {
      if (!onRowHover) return;
      onRowHover(oid);
    },
    [onRowHover],
  );
  const onRowLeave = useCallback(() => {
    if (!onRowHover) return;
    onRowHover(null);
  }, [onRowHover]);

  // Clear the highlight when the rail closes — otherwise a sticky
  // highlight could leak into the iframe with no obvious source.
  useEffect(() => {
    if (!open && onRowHover) onRowHover(null);
  }, [open, onRowHover]);

  if (!open) {
    return (
      <aside
        className="hidden shrink-0 flex-col border-r-2 border-ink bg-paper lg:flex"
        style={{ width: 32 }}
        aria-label="Element tree (collapsed)"
      >
        <button
          type="button"
          onClick={onToggleOpen}
          aria-label={`Open element tree (${totalNodes} elements)`}
          title={`Open element tree · ${totalNodes} ${totalNodes === 1 ? "element" : "elements"}`}
          className="flex h-full w-full items-start justify-center gap-2 border-none bg-transparent pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted hover:text-ink"
        >
          <span
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            className="flex items-center gap-2"
          >
            <span>Tree</span>
            {totalNodes > 0 && (
              <span
                aria-hidden
                className="rounded-sm border border-ink/30 bg-soft px-1 py-0.5 text-[9px] tracking-normal text-ink"
              >
                {totalNodes}
              </span>
            )}
          </span>
        </button>
      </aside>
    );
  }

  const filterActive = Boolean(query.trim());

  return (
    <aside
      className="hidden shrink-0 min-h-0 flex-col border-l-2 border-ink bg-paper lg:flex"
      style={{ width, position: "relative" }}
      aria-label="Element tree"
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b-2 border-ink bg-paper px-3 py-2">
        <span className="font-display text-base leading-none">Tree</span>
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={expandAll}
            aria-label="Expand all"
            title="Expand all"
            className="inline-flex h-6 w-6 items-center justify-center border border-ink/30 bg-paper font-mono text-[12px] leading-none text-ink hover:bg-ink hover:text-paper"
          >
            ⤓
          </button>
          <button
            type="button"
            onClick={collapseAll}
            aria-label="Collapse all"
            title="Collapse to default depth"
            className="inline-flex h-6 w-6 items-center justify-center border border-ink/30 bg-paper font-mono text-[12px] leading-none text-ink hover:bg-ink hover:text-paper"
          >
            ⤒
          </button>
          {/* Thirty-first-pass — toolbar "Depth ▾" dropdown. Discoverable
              alternative to the right-click context menu's Depth row.
              Click → 1-5 numeric buttons appear in a popover. The popover
              closes on click-outside (handled in the effect below) or on
              picking a depth. */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDepthMenuOpen((v) => !v);
              }}
              aria-label="Choose expand depth"
              aria-expanded={depthMenuOpen}
              aria-haspopup="menu"
              title="Expand to depth… · press D"
              className={
                "inline-flex h-6 items-center justify-center gap-1 border border-ink/30 bg-paper px-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink hover:bg-ink hover:text-paper " +
                (depthMenuOpen ? "bg-ink text-paper" : "")
              }
            >
              <span>Depth</span>
              <span style={{ fontSize: 8 }}>▾</span>
            </button>
            {depthMenuOpen && (
              <div
                role="menu"
                aria-label="Tree depth"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  zIndex: 60,
                }}
                className="border-2 border-ink bg-paper py-1 font-mono text-[10px] shadow-[3px_3px_0_0_rgba(15,15,15,0.18)]"
              >
                <div className="flex items-center gap-1 px-2 py-1">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        expandToDepth(d);
                        setDepthMenuOpen(false);
                      }}
                      title={`Expand tree to depth ${d}`}
                      aria-label={`Expand tree to depth ${d}`}
                      className={
                        "inline-flex h-5 w-5 items-center justify-center border border-ink/30 bg-paper font-mono text-[10px] leading-none text-ink hover:bg-ink hover:text-paper " +
                        (lastAppliedDepth === d
                          ? "bg-ink text-paper"
                          : "")
                      }
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Thirty-third-pass chunk (p) — toolbar "Subtree ▾"
              dropdown. Symmetric with chunk-l's "Depth ▾" but
              row-scoped: acts on the currently-focused (or
              selected) row's OID. Disabled (visually muted +
              inert) when no resolvable target exists — keeps the
              affordance discoverable in the empty state without
              promising functionality the user can't use. */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!subtreeMenuTarget) return;
                setSubtreeMenuOpen((v) => !v);
              }}
              disabled={!subtreeMenuTarget}
              aria-label={
                subtreeMenuTarget
                  ? `Expand subtree under <${subtreeMenuTarget.tag}>…`
                  : "Expand subtree (no row focused)"
              }
              aria-expanded={subtreeMenuOpen}
              aria-haspopup="menu"
              title={
                subtreeMenuTarget
                  ? `Expand subtree under <${subtreeMenuTarget.tag}> to depth… · press S`
                  : "Focus or select a row first"
              }
              className={
                "inline-flex h-6 items-center justify-center gap-1 border border-ink/30 bg-paper px-1.5 font-mono text-[10px] uppercase tracking-[0.1em] " +
                (subtreeMenuTarget
                  ? "text-ink hover:bg-ink hover:text-paper "
                  : "cursor-not-allowed text-muted/60 ") +
                (subtreeMenuOpen && subtreeMenuTarget ? "bg-ink text-paper" : "")
              }
            >
              <span>Subtree</span>
              <span style={{ fontSize: 8 }}>▾</span>
            </button>
            {subtreeMenuOpen && subtreeMenuTarget && (
              <div
                role="menu"
                aria-label={`Subtree depth for <${subtreeMenuTarget.tag}>`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  zIndex: 60,
                }}
                className="border-2 border-ink bg-paper py-1 font-mono text-[10px] shadow-[3px_3px_0_0_rgba(15,15,15,0.18)]"
              >
                <div className="px-2 pt-1 pb-0.5 text-[9px] uppercase tracking-[0.15em] text-muted">
                  {`<${subtreeMenuTarget.tag}>`}
                </div>
                <div className="flex items-center gap-1 px-2 py-1">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        expandSubtreeToDepth(subtreeMenuTarget.oid, d);
                        setSubtreeMenuOpen(false);
                      }}
                      title={`Expand subtree under <${subtreeMenuTarget.tag}> to depth ${d}`}
                      aria-label={`Expand subtree to depth ${d}`}
                      className={
                        "inline-flex h-5 w-5 items-center justify-center border border-ink/30 bg-paper font-mono text-[10px] leading-none text-ink hover:bg-ink hover:text-paper " +
                        (subtreeDepths[subtreeMenuTarget.oid] === d
                          ? "bg-ink text-paper"
                          : "")
                      }
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggleOpen}
            aria-label="Hide element tree"
            title="Hide element tree"
            className="ml-1 border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-ink hover:text-paper"
          >
            ×
          </button>
        </div>
      </header>
      <div className="shrink-0 border-b border-ink/15 px-2 py-2">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter by tag / class…"
            aria-label="Filter tree by tag or class name"
            className="block w-full rounded-sm border border-ink/30 bg-paper px-2 py-1 pr-6 font-mono text-[11px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
          {filterActive && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear filter"
              className="absolute right-1 top-1/2 -translate-y-1/2 border-none bg-transparent p-0.5 font-mono text-[10px] text-muted hover:text-ink"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto py-1 font-mono text-[11px] leading-tight"
      >
        {tree.length === 0 ? (
          <p className="px-3 py-2 text-muted">no addressable elements yet</p>
        ) : visible && visible.matches.size === 0 ? (
          <p className="px-3 py-2 text-muted">no matches for &ldquo;{query}&rdquo;</p>
        ) : (
          <ul
            ref={treeListRef}
            role="tree"
            tabIndex={-1}
            onKeyDown={onTreeKeyDown}
            className="m-0 list-none p-0 outline-none"
          >
            {tree.map((n) =>
              renderTree({
                node: n,
                depth: 0,
                selectedKey,
                focusedKey,
                expanded,
                onToggle: toggle,
                onSelect,
                onContextMenu: onRowContextMenu,
                onFocusRow: setFocusedKey,
                onRowEnter,
                onRowLeave,
                selectedRowRef,
                focusedRowRef,
                visible,
                query,
                dndEnabled,
                dragSetOids,
                selectedOidsForDrag,
                dropTarget,
                onRowPointerDown,
                lastDropEndAtRef,
                onRowShiftClick: handleRowShiftClick,
                dragGhostLabel: dragGhost?.label ?? null,
                subtreeDepths,
              }),
            )}
          </ul>
        )}
      </div>
      <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-ink/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-muted">
        <span className="truncate">
          {filterActive
            ? `${visibleCount} ${visibleCount === 1 ? "match" : "matches"} · ${totalNodes} total`
            : `${totalNodes} ${totalNodes === 1 ? "element" : "elements"}`}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {/* Thirty-fourth-pass chunk (ff) — storage telemetry pill.
              Tiny passive readout of how much localStorage the
              dropin:tree:* namespace is consuming. Hidden when zero
              (every key removed → no telemetry to show). The byte
              count is approximate (uses character length, not UTF-16
              byte length); the order of magnitude is what matters to
              a user wondering whether their persisted state is
              healthy. Sits to the LEFT of the Reset button so it
              shares the same right-aligned cluster but reads first. */}
          {storedBytes.bytes > 0 && (
            // Thirty-fifth-pass chunk (nn) — pill is now a button that
            // toggles the storage health debug panel. The button shape
            // is suppressed with `border-0 bg-transparent p-0` so the
            // visual identity stays a "pill" (the chunk-kk severity
            // background still applies for warn/danger). The
            // `cursor-pointer` is implicit via <button>.
            <button
              type="button"
              onClick={() => setStorageHealthOpen((v) => !v)}
              onPointerDown={(e) => e.stopPropagation()}
              title={
                storedBytesSeverity === "danger"
                  ? `${storedBytes.keyCount} ${storedBytes.keyCount === 1 ? "key" : "keys"} · ${storedBytes.bytes} chars · heavy persisted state — Reset to clear · click for details`
                  : storedBytesSeverity === "warn"
                    ? `${storedBytes.keyCount} ${storedBytes.keyCount === 1 ? "key" : "keys"} · ${storedBytes.bytes} chars · approaching the typical comfort range · click for details`
                    : `${storedBytes.keyCount} ${storedBytes.keyCount === 1 ? "key" : "keys"} · ${storedBytes.bytes} chars · click for details`
              }
              aria-label={`Tree state storage: ${storedBytes.keyCount} ${storedBytes.keyCount === 1 ? "key" : "keys"}, ${storedBytes.bytes} characters${storedBytesSeverity === "danger" ? ", heavy" : storedBytesSeverity === "warn" ? ", approaching limit" : ""}. Click to ${storageHealthOpen ? "hide" : "show"} storage health details.`}
              aria-expanded={storageHealthOpen}
              aria-haspopup="dialog"
              data-storage-severity={storedBytesSeverity}
              className={
                "font-mono text-[9px] uppercase tracking-[0.15em] cursor-pointer " +
                (storedBytesSeverity === "danger"
                  ? "border border-coral bg-coral px-1 text-paper hover:bg-ink hover:text-paper"
                  : storedBytesSeverity === "warn"
                    ? "border-0 bg-transparent p-0 text-coral hover:text-ink"
                    : "border-0 bg-transparent p-0 text-muted/70 hover:text-ink")
              }
            >
              {storedBytesLabel}
            </button>
          )}
          {/* Chunk x — Reset tree state. Tiny right-aligned button so it
              doesn't compete with the count readout. Clicking wipes
              persisted depth/query/expanded keys + resets in-memory state
              to defaults (DEFAULT_EXPAND_DEPTH, empty filter, depth-derived
              expanded set). Two-step tap-to-confirm (chunk aa) prevents
              accidental wipe.
              Thirty-fourth-pass chunk (dd) — additionally hidden when
              `isPersistedTreeStateDefault` is true (state already at
              defaults; nothing to reset → no point offering the action). */}
          {totalNodes > 0 && !isPersistedTreeStateDefault && (
            <button
              type="button"
              onClick={handleResetTreeState}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={
                confirmingReset
                  ? "Click again to confirm reset"
                  : "Reset tree state (depth, filter, expanded)"
              }
              title={
                confirmingReset
                  ? "Click again within 3s to confirm"
                  : "Reset tree state · clears depth/filter/expanded across reloads"
              }
              className={
                "shrink-0 border-none p-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
                (confirmingReset
                  ? "border border-coral bg-coral/15 px-1 text-coral"
                  : "bg-transparent text-muted hover:text-ink")
              }
            >
              {confirmingReset ? "confirm?" : "reset"}
            </button>
          )}
        </div>
      </footer>
      {/* Storage health debug panel — extracted into its own
          component. The panel reads localStorage entries directly
          and owns its own scope/sort/filter/snapshot/import state;
          tree-side prefs (subtreeDepthCap, storageWarn/DangerBytes,
          dragGhostFormat) are owned here so the footer pill + tree
          DnD ghost see the same values, and passed in for the
          panel to render edit controls. */}
      <StorageHealthPanel
        open={storageHealthOpen}
        onClose={() => setStorageHealthOpen(false)}
        subtreeDepthCap={subtreeDepthCap}
        onSubtreeDepthCapChange={handleSetSubtreeDepthCap}
        storageWarnBytes={storageWarnBytes}
        onStorageWarnBytesChange={handleSetStorageWarnBytes}
        storageDangerBytes={storageDangerBytes}
        onStorageDangerBytesChange={handleSetStorageDangerBytes}
        dragGhostFormat={dragGhostFormat}
        onDragGhostFormatChange={handleSetDragGhostFormat}
        onWipeTreePrefs={handleResetTreePreferences}
        onWarn={onWarn}
      />
      {/* Resize handle. Pointer-events on a 6px strip that overlaps the
          right border for a comfortable hit target. Visible on hover via
          a faint coral hairline so the affordance is discoverable. */}
      <div
        role="separator"
        aria-label="Resize tree rail"
        aria-orientation="vertical"
        onPointerDown={onResizeDown}
        onDoubleClick={onResizeDoubleClick}
        title="Drag to resize · Double-click to reset"
        style={{
          position: "absolute",
          top: 0,
          left: -3,
          width: 6,
          height: "100%",
          cursor: "col-resize",
          touchAction: "none",
          zIndex: 5,
        }}
        className="group"
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 2,
            width: 2,
            height: "100%",
            background: "transparent",
          }}
          className="group-hover:bg-coral group-active:bg-coral"
        />
      </div>
      {contextMenu && (
        <ContextMenu
          state={contextMenu}
          onClose={closeContextMenu}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onDuplicateMulti={onDuplicateMulti}
          onDeleteMulti={onDeleteMulti}
          onExpandToDepth={expandToDepth}
          onExpandSubtreeToDepth={expandSubtreeToDepth}
          onCollapseSubtree={collapseSubtree}
          onForgetSubtreeDepth={forgetSubtreeDepth}
          storedSubtreeDepth={
            contextMenu.oid in subtreeDepths
              ? subtreeDepths[contextMenu.oid]
              : null
          }
        />
      )}
      {dragGhost && (
        <div
          aria-hidden
          // pointer-events:none is critical — without it, the ghost
          // would cover elementFromPoint and the hit-test would always
          // resolve to the ghost itself, freezing the drop indicator.
          style={{
            position: "fixed",
            left: dragGhost.x + 14,
            top: dragGhost.y + 14,
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className="rounded-sm border border-ink bg-coral px-1.5 py-0.5 font-mono text-[10px] text-ink shadow-[2px_2px_0_0_rgba(0,0,0,0.85)]"
        >
          {dragGhost.label}
        </div>
      )}
    </aside>
  );
}

function ContextMenu({
  state,
  onClose,
  onDuplicate,
  onDelete,
  onDuplicateMulti,
  onDeleteMulti,
  onExpandToDepth,
  onExpandSubtreeToDepth,
  onCollapseSubtree,
  onForgetSubtreeDepth,
  storedSubtreeDepth,
}: {
  state: ContextMenuState;
  onClose: () => void;
  onDuplicate?: (oid: string) => void;
  onDelete?: (oid: string) => void;
  onDuplicateMulti?: (oids: ReadonlyArray<string>) => boolean;
  onDeleteMulti?: (oids: ReadonlyArray<string>) => boolean;
  // Thirty-third-pass chunk (cc) — drop just the stored subtree-depth
  // entry for this row WITHOUT collapsing the live expansion. Symmetric
  // with `onCollapseSubtree` (which also drops the entry but DOES
  // collapse). Useful when a user wants to keep the branch expanded
  // for the current session but stop persisting the depth choice
  // across reloads. Only rendered when `storedSubtreeDepth` is non-null.
  onForgetSubtreeDepth?: (rootOid: string) => void;
  // Thirty-third-pass chunk (cc) — passed through so the menu can
  // (a) gate the Forget entry on whether there's anything to forget,
  // and (b) print the depth value in the entry's label so the user
  // sees what they're forgetting.
  storedSubtreeDepth?: number | null;
  // Thirtieth-pass — "Expand depth" inline row. When wired (jsx mode),
  // the menu shows 1-5 buttons that snap the rail to that max-visible
  // depth. depth=1 → only top-level containers expanded; depth=5 → most
  // realistic trees fully expanded. Always-on (rather than gated on
  // node having children) — even leaf rows can act as the trigger
  // since the action is tree-wide, not row-scoped.
  onExpandToDepth?: (depth: number) => void;
  // Thirtieth-pass — row-scoped variant. When wired AND the right-clicked
  // row has an oid, the menu adds a second "Subtree depth" row that
  // expands ONLY this row's subtree to the chosen depth (additive, doesn't
  // disturb the user's other expansions). Useful when a vibecoder wants
  // to drill into one branch without unfolding the whole tree.
  onExpandSubtreeToDepth?: (rootOid: string, depth: number) => void;
  // Thirty-first-pass (n) — destructive subtree collapse. Removes the
  // root key + every descendant container key from the expanded set.
  // Symmetric with `onExpandSubtreeToDepth` (additive); single button
  // since "depth 0 collapse" is the only meaningful destination.
  onCollapseSubtree?: (rootOid: string) => void;
}) {
  // Position via fixed coordinates relative to the viewport. The
  // pointerdown handler that opens the menu reads ev.clientX/Y which
  // are viewport-relative, so `position: fixed` is correct.
  // Stop propagation so a click on a menu item doesn't trigger the
  // outer document onPointerDown that would close the menu first.
  const stop = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
  };
  // Twenty-ninth-pass — per-action multi vs single decision. The
  // snapshot on state.multiOids tells us "this row was part of a multi-
  // set at right-click time". Each action separately checks its multi-
  // handler since one might be wired (onDeleteMulti) without the other
  // (onDuplicateMulti). Falls through to single when handler missing.
  const multi = state.multiOids;
  const multiCount = multi ? multi.length : 0;
  const showDuplicateMulti = !!multi && multiCount >= 2 && !!onDuplicateMulti;
  const showDeleteMulti = !!multi && multiCount >= 2 && !!onDeleteMulti;
  // Header reads as "<tag> · N" when right-click landed on a multi-set
  // member, mirroring the drag-ghost label so the user can't be
  // confused about scope.
  const headerLabel =
    multi && multiCount >= 2
      ? `<${state.tag}> · ${multiCount}`
      : `<${state.tag}>`;
  return (
    <div
      role="menu"
      aria-label="Element actions"
      onPointerDown={stop}
      onClick={stop}
      style={{
        position: "fixed",
        top: state.y,
        left: state.x,
        zIndex: 70,
        minWidth: 200,
      }}
      className="border-2 border-ink bg-paper py-1 font-mono text-[11px] shadow-[3px_3px_0_0_rgba(15,15,15,0.18)]"
    >
      <div className="px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-muted">
        {headerLabel}
      </div>
      <div className="my-1 border-t border-ink/15" />
      {showDuplicateMulti ? (
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            onDuplicateMulti!(multi!);
            onClose();
          }}
          className="flex w-full items-center justify-between gap-3 border-none bg-transparent px-3 py-1.5 text-left text-ink hover:bg-soft"
        >
          <span>{`Duplicate ${multiCount} elements`}</span>
          <kbd className="rounded-sm border border-ink/30 bg-paper px-1 text-[9px] text-muted">
            ⌘D
          </kbd>
        </button>
      ) : (
        onDuplicate && (
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onDuplicate(state.oid);
              onClose();
            }}
            className="flex w-full items-center justify-between gap-3 border-none bg-transparent px-3 py-1.5 text-left text-ink hover:bg-soft"
          >
            <span>Duplicate</span>
            <kbd className="rounded-sm border border-ink/30 bg-paper px-1 text-[9px] text-muted">
              ⌘D
            </kbd>
          </button>
        )
      )}
      {showDeleteMulti ? (
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            onDeleteMulti!(multi!);
            onClose();
          }}
          className="flex w-full items-center justify-between gap-3 border-none bg-transparent px-3 py-1.5 text-left hover:bg-soft"
        >
          <span style={{ color: "#E63B2E" }}>
            {`Delete ${multiCount} elements`}
          </span>
          <kbd className="rounded-sm border border-ink/30 bg-paper px-1 text-[9px] text-muted">
            ⌫
          </kbd>
        </button>
      ) : (
        onDelete && (
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onDelete(state.oid);
              onClose();
            }}
            className="flex w-full items-center justify-between gap-3 border-none bg-transparent px-3 py-1.5 text-left text-ink hover:bg-soft"
          >
            <span style={{ color: "#E63B2E" }}>Delete</span>
            <kbd className="rounded-sm border border-ink/30 bg-paper px-1 text-[9px] text-muted">
              ⌫
            </kbd>
          </button>
        )
      )}
      {onExpandToDepth && (
        // Thirtieth-pass — inline "Expand depth" row. Five small numeric
        // buttons (1-5). The current "max-visible depth" isn't tracked
        // (would require comparing the current `expanded` set against
        // the target set per-button, which is more bookkeeping than
        // value), so all five always render unhighlighted. Tooltip per
        // button explains the action.
        <>
          <div className="my-1 border-t border-ink/15" />
          <div className="flex items-center justify-between gap-2 px-3 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted">
              Depth
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onExpandToDepth(d);
                    onClose();
                  }}
                  title={`Expand tree to depth ${d}`}
                  aria-label={`Expand tree to depth ${d}`}
                  className="inline-flex h-5 w-5 items-center justify-center border border-ink/30 bg-paper font-mono text-[10px] leading-none text-ink hover:bg-ink hover:text-paper"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {onExpandSubtreeToDepth && (
        // Thirtieth-pass (j) — row-scoped variant. Additive — preserves
        // the user's other expansions. Useful for drilling into one
        // branch (e.g. a deeply nested form section) without unfolding
        // the whole tree. Same 1-5 grid as the tree-wide row above.
        <div className="flex items-center justify-between gap-2 px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted">
            Subtree
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                role="menuitem"
                onClick={() => {
                  onExpandSubtreeToDepth(state.oid, d);
                  onClose();
                }}
                title={`Expand subtree under <${state.tag}> to depth ${d}`}
                aria-label={`Expand subtree under <${state.tag}> to depth ${d}`}
                className="inline-flex h-5 w-5 items-center justify-center border border-ink/30 bg-paper font-mono text-[10px] leading-none text-ink hover:bg-ink hover:text-paper"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
      {onCollapseSubtree && (
        // Thirty-first-pass (n) — single-button "Collapse subtree" row.
        // Mirrors the chunk-j additive expand-subtree, but destructive:
        // removes the row's key + every descendant container key from
        // the expanded set so the user can hide a deep branch in one
        // click. Useful when a vibecoder unfolded a complex section and
        // wants to re-collapse without scrolling back up to the chevron.
        <>
          <div className="my-1 border-t border-ink/15" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onCollapseSubtree(state.oid);
              onClose();
            }}
            title={`Collapse subtree under <${state.tag}>`}
            aria-label={`Collapse subtree under <${state.tag}>`}
            className="flex w-full items-center justify-between gap-3 border-none bg-transparent px-3 py-1.5 text-left text-ink hover:bg-soft"
          >
            <span>Collapse subtree</span>
            <span className="font-mono text-[9px] text-muted">⤒</span>
          </button>
        </>
      )}
      {onForgetSubtreeDepth &&
        storedSubtreeDepth !== null &&
        storedSubtreeDepth !== undefined && (
          // Thirty-third-pass chunk (cc) — Forget the persisted
          // subtree-depth entry for this row WITHOUT collapsing the
          // current expansion. Only renders when an entry actually
          // exists; the depth value's printed in the label so the
          // user knows what they're forgetting. Symmetric with
          // Collapse subtree but non-destructive of the live view.
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onForgetSubtreeDepth(state.oid);
              onClose();
            }}
            title={`Forget remembered subtree depth ${storedSubtreeDepth} for <${state.tag}>`}
            aria-label={`Forget remembered subtree depth ${storedSubtreeDepth}`}
            className="flex w-full items-center justify-between gap-3 border-none bg-transparent px-3 py-1.5 text-left text-ink hover:bg-soft"
          >
            <span>{`Forget subtree depth (${storedSubtreeDepth})`}</span>
            <span className="font-mono text-[9px] text-muted">⌫</span>
          </button>
        )}
    </div>
  );
}

function countNodes(nodes: ReadonlyArray<TreeNode>): number {
  let n = 0;
  for (const node of nodes) {
    n += 1 + countNodes(node.children);
  }
  return n;
}

interface RenderTreeArgs {
  node: TreeNode;
  depth: number;
  selectedKey: string | null;
  focusedKey: string | null;
  expanded: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onSelect: (n: TreeNode, additive: boolean) => void;
  onContextMenu: (n: TreeNode, x: number, y: number) => void;
  onFocusRow: (key: string) => void;
  onRowEnter: (oid: string | null) => void;
  onRowLeave: () => void;
  selectedRowRef: React.MutableRefObject<HTMLDivElement | null>;
  focusedRowRef: React.MutableRefObject<HTMLDivElement | null>;
  visible: { keep: ReadonlySet<string>; matches: ReadonlySet<string> } | null;
  query: string;
  // Phase 6 ramp — drag-and-drop visual + hit-test props.
  dndEnabled: boolean;
  dragSetOids: ReadonlyArray<string> | null;
  // Multi-select set (primary + additionalOids). Used to paint "also
  // selected" rows distinctly from primary even when no drag is active.
  selectedOidsForDrag?: ReadonlyArray<string>;
  dropTarget: { oid: string; position: DropPosition } | null;
  onRowPointerDown: (
    e: React.PointerEvent<HTMLDivElement>,
    oid: string | null,
  ) => void;
  // Suppress the synthetic click that follows a drag so the row doesn't
  // also re-select after a successful drop. Read in TreeRow's button
  // onClick handlers.
  lastDropEndAtRef: React.MutableRefObject<number>;
  // Thirtieth-pass — shift-click range-select dispatcher. Wraps
  // onSelect(node, true) when range can be resolved against the
  // current primary; falls through otherwise.
  onRowShiftClick: (node: TreeNode) => void;
  // Thirty-second-pass — drag-ghost label captured at activation, used
  // by the drop-placeholder rows so the user sees a translucent
  // preview of what's about to land at the drop slot. Null when no
  // drag is in progress (placeholder rendering bails). Source-of-truth
  // is the parent's `dragGhost` state (28th pass); we just thread the
  // label through so per-row rendering can show it without duplicating
  // the label-building logic.
  dragGhostLabel: string | null;
  // Thirty-third-pass chunk (bb) — passed through to child rows so
  // each TreeRow can render a small dot marker next to its chevron
  // when its OID has a stored subtree-depth entry. Per-row lookup is
  // O(1) on the Record; the alternative of pre-computing per-row at
  // each call site would either require pre-walking the tree
  // (duplicate work) or losing the marker on recursive child renders.
  subtreeDepths: Readonly<Record<string, number>>;
}

function renderTree(args: RenderTreeArgs): JSX.Element | null {
  const k = nodeKey(args.node);
  // Filter active: drop nodes that aren't in the keep set (no match
  // and no descendant match).
  if (args.visible && !args.visible.keep.has(k)) return null;
  return <TreeRow key={k} {...args} />;
}

function TreeRow({
  node,
  depth,
  selectedKey,
  focusedKey,
  expanded,
  onToggle,
  onSelect,
  onContextMenu,
  onFocusRow,
  onRowEnter,
  onRowLeave,
  selectedRowRef,
  focusedRowRef,
  visible,
  query,
  dndEnabled,
  dragSetOids,
  selectedOidsForDrag,
  dropTarget,
  onRowPointerDown,
  lastDropEndAtRef,
  onRowShiftClick,
  dragGhostLabel,
  subtreeDepths,
}: RenderTreeArgs) {
  const key = nodeKey(node);
  const hasChildren = node.children.length > 0;
  const isOpen = expanded.has(key);
  const isSelected = selectedKey === key;
  const isFocused = focusedKey === key;
  const isMatch = visible ? visible.matches.has(key) : false;
  // DnD signals — only meaningful for OID-bearing rows. The "isDragSrc"
  // flag dims every row that's being moved (for multi-drag, the entire
  // selection set is dimmed); "drop hint" classes paint the top/bottom/
  // inset coral indicator on the hovered drop target.
  const isDragSrc =
    dndEnabled && !!node.oid && (dragSetOids?.includes(node.oid) ?? false);
  const dropHint =
    dndEnabled && !!node.oid && dropTarget && dropTarget.oid === node.oid
      ? dropTarget.position
      : null;
  // Thirty-third-pass chunk (bb) — the row's stored subtree-depth, if
  // any. Lookup is O(1) on the Record. Null when the row is OID-less
  // (HTML mode, no oid key) OR no entry. The marker renders only when
  // non-null AND the row has children (the marker is a hint that
  // "this branch has remembered depth"; leaves can't have one).
  const storedSubtreeDepth =
    node.oid && node.oid in subtreeDepths ? subtreeDepths[node.oid] : null;
  // Twenty-seventh-pass — paint additional multi-select rows distinctly
  // from the primary so the user sees the full multi-set in the tree
  // (previously only the primary lit up; additionalOids were invisible
  // until drag started). `selectedOidsForDrag` is `[primary,
  // ...additionalOids]` when set, so isAdditional means "in the multi-
  // set but not the primary". The primary still wins (`isSelected →
  // bg-coral`); additionals get a softer coral wash to read as "also
  // selected, secondary focus".
  const isAdditional =
    !!node.oid &&
    !isSelected &&
    (selectedOidsForDrag?.includes(node.oid) ?? false);
  const dndCursor = dndEnabled && node.oid ? "grab" : undefined;
  // Suppress the synthetic click that follows a drag end. Pointer events
  // typically already swallow it, but Safari has been quirky. 200ms is
  // generous; a real click+select is sub-50ms typical.
  const consumeStaleClick = (): boolean => {
    if (Date.now() - lastDropEndAtRef.current < 200) return true;
    return false;
  };

  // Indent: 12px per depth level + 12 for the toggle/no-toggle column.
  // Use inline style instead of class names so deep depths don't blow up
  // the JIT class set.
  const indent = depth * 12;

  // Class hint: take the first class that's NOT a layout/spacing utility
  // (those rarely identify the element). Fall back to first class.
  const classHint = pickClassHint(node.classes);

  // Set BOTH refs when applicable so the row can serve as the
  // scroll-into-view target AND the keyboard-nav focus target. Either
  // ref can win (selectedRowRef takes precedence when both apply).
  const setRowRef = (el: HTMLDivElement | null) => {
    if (isSelected) selectedRowRef.current = el;
    if (isFocused) focusedRowRef.current = el;
  };

  // Thirty-second-pass — dropPlaceholder controls the translucent row
  // that previews where the drop will land. Renders only when a drag
  // is active AND the dragGhost label has been captured (pointermove
  // crossed the 5-px activation threshold) AND this row is the current
  // dropTarget. Position-specific placement: `before` renders at top of
  // the row's `<li>`, `after` renders between the row's `<div>` and the
  // children's `<ul>` so it's adjacent to the user's cursor (matches
  // the existing 2px coral after-bar placement at `bottom-0` of the
  // row's `<div>`). `inside` (chunk v) renders as the FIRST CHILD of
  // the children's `<ul>` ONLY when the target is expanded — collapsed
  // targets keep the existing inset-ring as the indicator (avoids a
  // forced expansion just to show the placeholder; spring-load handles
  // expansion after 700ms hover).
  const showPlaceholder =
    dndEnabled && !!dragSetOids && !!dragGhostLabel && dropHint !== null;
  // Inside placeholder is only visible when the target is open — for
  // collapsed targets the inset-ring is the indicator. Captured here so
  // the JSX below can short-circuit cleanly.
  const showInsidePlaceholder = showPlaceholder && dropHint === "inside" && isOpen;

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isOpen : undefined}>
      {showPlaceholder && dropHint === "before" && (
        <DragPlaceholder
          caption={buildDropPlaceholderCaption(dragGhostLabel!, "before")}
          indent={indent}
          position="before"
        />
      )}
      <div
        ref={setRowRef}
        tabIndex={isFocused ? 0 : -1}
        data-tree-row-oid={node.oid ?? undefined}
        onContextMenu={(e) => {
          if (!node.oid) return;
          e.preventDefault();
          onContextMenu(node, e.clientX, e.clientY);
        }}
        onPointerDown={(e) => onRowPointerDown(e, node.oid)}
        onMouseDown={() => onFocusRow(key)}
        onClick={() => {
          if (consumeStaleClick()) return;
          onFocusRow(key);
        }}
        onMouseEnter={() => {
          // Skip hover-highlight while a drag is in progress so the
          // canvas doesn't strobe with every row the user passes over
          // mid-drag.
          if (dragSetOids) return;
          node.oid && onRowEnter(node.oid);
        }}
        onMouseLeave={onRowLeave}
        className={
          "relative flex items-center gap-1 px-2 py-0.5 transition-colors " +
          (isSelected
            ? "bg-coral text-paper"
            : isAdditional
              ? "bg-coral/25 text-ink ring-1 ring-inset ring-coral/60 hover:bg-coral/35"
              : isFocused
                ? "bg-soft text-ink ring-1 ring-inset ring-ink/40"
                : isMatch
                  ? "bg-amber-100 text-ink hover:bg-amber-200"
                  : "text-ink hover:bg-soft") +
          (isDragSrc ? " opacity-50" : "") +
          (dropHint === "inside"
            ? " ring-2 ring-coral ring-inset"
            : "")
        }
        style={{
          paddingLeft: indent + 8,
          outline: "none",
          cursor: dndCursor,
          touchAction: dndEnabled && node.oid ? "none" : undefined,
        }}
      >
        {dropHint === "before" && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 h-0.5 bg-coral"
          />
        )}
        {dropHint === "after" && (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 bg-coral"
          />
        )}
        {dropHint && dragSetOids && dragSetOids.length > 1 && (
          // Twenty-seventh-pass — multi-row drop count badge. Tells the
          // user how many rows the drop will move (otherwise the single
          // 2px coral indicator looks identical to a single-row drop).
          // Position mirrors the indicator slot: before → top edge,
          // after → bottom edge, inside → center-right.
          <span
            aria-hidden
            className="pointer-events-none absolute right-1 z-10 inline-flex h-3.5 min-w-[14px] items-center justify-center rounded-full border border-ink bg-coral px-1 font-mono text-[8px] font-bold leading-none text-paper"
            style={{
              top:
                dropHint === "before"
                  ? "-7px"
                  : dropHint === "inside"
                    ? "50%"
                    : undefined,
              bottom: dropHint === "after" ? "-7px" : undefined,
              transform: dropHint === "inside" ? "translateY(-50%)" : undefined,
            }}
          >
            {dragSetOids.length}
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            if (consumeStaleClick()) return;
            if (hasChildren) onToggle(key);
          }}
          tabIndex={hasChildren ? 0 : -1}
          aria-label={hasChildren ? (isOpen ? "Collapse" : "Expand") : ""}
          className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center border-none bg-transparent p-0 text-current"
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
          title={
            storedSubtreeDepth !== null && hasChildren
              ? `Subtree depth ${storedSubtreeDepth} remembered for this row`
              : undefined
          }
        >
          <span style={{ fontSize: 9, lineHeight: 1 }}>
            {isOpen ? "▼" : "▶"}
          </span>
          {/* Chunk (bb) — coral dot indicating this row has a
              persisted subtree-depth entry. Positioned top-right of
              the chevron so it overlaps minimally with the chevron
              glyph. Only rendered for rows with children (leaves
              can't have a meaningful subtree-depth). The dot is 4×4
              so it reads as a hint, not a UI control — the click
              target stays the chevron itself. */}
          {storedSubtreeDepth !== null && hasChildren && (
            <span
              aria-hidden
              data-stored-subtree-depth={storedSubtreeDepth}
              style={{
                position: "absolute",
                top: 1,
                right: 0,
                width: 4,
                height: 4,
                borderRadius: 999,
                background: "var(--coral, #E63B2E)",
                pointerEvents: "none",
              }}
            />
          )}
        </button>
        <button
          type="button"
          onClick={(e) => {
            if (consumeStaleClick()) return;
            // Thirtieth-pass — shift-click routes through the range
            // dispatcher. Plain click stays single-select.
            if (e.shiftKey) onRowShiftClick(node);
            else onSelect(node, false);
          }}
          className="flex min-w-0 flex-1 items-center gap-1 truncate border-none bg-transparent px-0 py-0.5 text-left text-current"
          title={`${node.tag}${classHint ? `.${classHint}` : ""}${
            node.oid
              ? dndEnabled
                ? "  (drag to reorder · right-click for actions · shift-click multi-select)"
                : "  (right-click for actions, shift-click to multi-select)"
              : ""
          }`}
        >
          <span className={isSelected ? "text-paper/70" : "text-muted"}>
            {"<"}
          </span>
          <HighlightedText
            text={node.tag}
            query={query}
            isSelected={isSelected}
            className="font-medium"
          />
          {classHint && (
            <span
              className={
                "truncate " +
                (isSelected ? "text-paper/80" : "text-muted")
              }
            >
              .<HighlightedText text={classHint} query={query} isSelected={isSelected} />
            </span>
          )}
          <span className={isSelected ? "text-paper/70" : "text-muted"}>
            {">"}
          </span>
        </button>
      </div>
      {showPlaceholder && dropHint === "after" && (
        <DragPlaceholder
          caption={buildDropPlaceholderCaption(dragGhostLabel!, "after")}
          indent={indent}
          position="after"
        />
      )}
      {hasChildren && isOpen && (
        <ul role="group" className="m-0 list-none p-0">
          {/* Chunk v — inside placeholder rendered as first child when
              target is expanded. Indent: depth+1 worth (12px more than
              the row's own indent) so the placeholder visually nests
              under the target row. Collapsed targets fall back to the
              existing inset-ring (no first child to render into). */}
          {showInsidePlaceholder && (
            <li>
              <DragPlaceholder
                caption={buildDropPlaceholderCaption(dragGhostLabel!, "inside")}
                indent={indent + 12}
                position="inside"
              />
            </li>
          )}
          {node.children.map((c) =>
            renderTree({
              node: c,
              depth: depth + 1,
              selectedKey,
              focusedKey,
              expanded,
              onToggle,
              onSelect,
              onContextMenu,
              onFocusRow,
              onRowEnter,
              onRowLeave,
              selectedRowRef,
              focusedRowRef,
              visible,
              query,
              dndEnabled,
              dragSetOids,
              selectedOidsForDrag,
              dropTarget,
              onRowPointerDown,
              lastDropEndAtRef,
              onRowShiftClick,
              dragGhostLabel,
              subtreeDepths,
            }),
          )}
        </ul>
      )}
    </li>
  );
}

// Thirty-second-pass — translucent drop-placeholder row. Renders an
// arrow + verb-prefixed caption (e.g. "↳ drop before <div>") at the
// drop slot during an active tree DnD so the user sees a preview of
// where the dragged element(s) will land BEFORE committing. Pairs
// with the existing 2px coral indicator (28th pass) and count badge
// (27th pass): the bar shows the precise insertion line, the badge
// shows the count for multi-drag, and this placeholder shows the
// dragged tag at the drop slot. Pointer-events:none so it doesn't
// hijack the hit-test mid-drag (same reason the floating drag-ghost
// has it). Indent matches the row above so the placeholder visually
// occupies the same column as the moved row would.
function DragPlaceholder({
  caption,
  indent,
  position,
}: {
  caption: string;
  indent: number;
  position: "before" | "after" | "inside";
}) {
  // Chunk w — fade-in transition. CSS-only via opacity state flipped
  // in a post-mount effect so the first render is opacity:0 and the
  // browser paints the transition to opacity:1. 120ms is short enough
  // that rapid pointermove cycling between drop targets doesn't feel
  // stuttery (each target's placeholder is a fresh mount with its own
  // fade), long enough to read as intentional rather than instant.
  // Avoids framer-motion (locked-out per the Tailwind+CDN locked
  // stack) and tailwind's unconfigured animate-* utilities. Important:
  // the requestAnimationFrame nudge ensures the opacity:0 paint lands
  // BEFORE the transition target is set — without it, React might
  // batch the opacity:1 update with the initial paint and skip the
  // transition entirely.
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const r = requestAnimationFrame(() => setOpacity(1));
    return () => cancelAnimationFrame(r);
  }, []);

  // Position-specific data attribute for any future styling hooks
  // (e.g. a fade-in keyframe gated on position). Aria-hidden because
  // the placeholder is decorative — the live drag-ghost tooltip and
  // 2px coral indicator already convey the gesture state.
  return (
    <div
      aria-hidden
      data-drop-position={position}
      className="pointer-events-none mx-2 my-0.5 flex items-center gap-1 truncate rounded-sm border border-dashed border-coral/70 bg-coral/15 px-2 py-0.5 font-mono text-[10px] tracking-[0.05em] text-coral"
      style={{
        paddingLeft: indent + 8,
        opacity,
        transition: "opacity 120ms ease-out",
      }}
    >
      {caption}
    </div>
  );
}

// Highlights the matching substring of `text` against the user's query
// (case-insensitive). Bold + amber underline so it reads against both
// the coral selected-row background and the default soft hover row. On
// a no-match call, returns plain text — keeps the JSX shape consistent
// so React doesn't churn keys when filter clears.
function HighlightedText({
  text,
  query,
  isSelected,
  className,
}: {
  text: string;
  query: string;
  isSelected: boolean;
  className?: string;
}) {
  const ql = query.trim().toLowerCase();
  if (!ql) {
    return <span className={className}>{text}</span>;
  }
  const lower = text.toLowerCase();
  const idx = lower.indexOf(ql);
  if (idx < 0) return <span className={className}>{text}</span>;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + ql.length);
  const after = text.slice(idx + ql.length);
  const matchStyle: React.CSSProperties = isSelected
    ? { background: "rgba(245, 241, 234, 0.35)", textDecoration: "underline" }
    : { background: "rgba(244, 167, 0, 0.45)", fontWeight: 600 };
  return (
    <span className={className}>
      {before}
      <span style={matchStyle}>{match}</span>
      {after}
    </span>
  );
}

// Skip layout/positioning prefixes when picking the class hint so a
// `flex items-center justify-center bg-blue-500` div labels as
// `bg-blue-500` instead of `flex` (which doesn't help identify it).
const HINT_SKIP_PREFIXES = [
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

export function pickClassHint(classes: ReadonlyArray<string>): string | null {
  for (const c of classes) {
    if (!HINT_SKIP_PREFIXES.some((p) => c === p || c.startsWith(p))) {
      return c;
    }
  }
  return classes[0] ?? null;
}
