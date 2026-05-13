# Dropin Architecture Audit — 2026-05-04

## 1. Top 15 Source Files by LOC

| Rank | File | LOC | One-line responsibility |
|------|------|-----|------------------------|
| 1 | `components/ElementTree.tsx` | 7,076 | Collapsible element-tree sidebar — plus a fully-featured localStorage debug panel bolted on |
| 2 | `components/SelectionOverlay.tsx` | 3,519 | Host-side selection chrome: resize/spacing/move gesture controllers, snap/FLIP/constraint display |
| 3 | `lib/tree-persistence.ts` | 3,358 | localStorage read/write for tree state AND every preference/config knob for the debug storage panel |
| 4 | `components/Workspace.tsx` | 2,815 | Top-level coordinator: owns all edit callbacks, routes source mutations, wires child components |
| 5 | `components/FocusEditor.tsx` | 2,644 | Floating inspector panel: style presets, properties sections, AI rewrite, attributes |
| 6 | `lib/preview.ts` | 2,531 | Builds the iframe `srcDoc` HTML: Tailwind CDN, UMD shims, Babel transform runtime, bridge script |
| 7 | `components/Preview.tsx` | 1,087 | iframe host + postMessage bridge: manages bbox subs, layout context queries, tool-binding assembly |
| 8 | `lib/ast/tree-dnd.ts` | 609 | Pure resolvers for drag-and-drop reorder/reparent over the tree (single + multi) |
| 9 | `lib/ast/snap.ts` | 583 | Snap-to-grid and snap-to-element candidates: nearest-candidate resolution for resize/move |
| 10 | `lib/style-presets.ts` | 515 | Static preset registry and matching logic (background, shadow, radius, etc.) |
| 11 | `lib/ast/operations/swap.ts` | 483 | AST operation: replaces a JSX element subtree with a library component, preserving OIDs |
| 12 | `lib/ast/operations/insert.ts` | 455 | AST operation: inserts a library component as a child at a target OID |
| 13 | `components/library/Sidebar.tsx` | 447 | Library modal's primary navigation shell: tab routing to asset/component sub-panels |
| 14 | `components/ast/PropertiesPanel/shared.tsx` | 442 | Shared Tailwind-aware controls (sliders, segment groups, pickers) used by all PropertiesPanel sections |
| 15 | `lib/ast/operations/reparent.ts` | 384 | AST operation: moves a JSX element to a new parent OID, adjusting source offsets |

## 2. Top 5 Oversized Files — Responsibilities and Extraction Plan

### File 1: `components/ElementTree.tsx` (7,076 LOC)

**Responsibilities currently inside:**

1. Tree core — collapsible/expandable OID-keyed tree rows, depth tracking, DnD gesture handlers, keyboard nav, shift-click range select, ancestor expansion. Roughly lines 726–4005.
2. Storage health panel — a complete second feature: ~30 `useState` hooks, ~20 `useMemo` computations, ~15 `useCallback` handlers, and ~1,800 lines of JSX (lines 4360–6171).
3. Pure tree utilities — exported `collectExpandToDepth`, `collectCollapseSubtreeKeys`, `nodeMatchesQuery`, `buildVisibleKeys`, `collectShiftClickRangeOids`, `buildDragGhostLabel`, `buildDropPlaceholderCaption`, `pickClassHint`, `shouldRouteThroughMulti`. Currently exported from a "use client" component file.
4. Sub-components — `ContextMenu`, `TreeRow`, `DragPlaceholder`, `HighlightedText`, `renderTree` defined at file bottom.

**Extractions:**

| New file | What moves there |
|----------|-----------------|
| `components/StorageHealthPanel.tsx` | All `storageHealth*` / `storagePanel*` state, refs, effects, and the JSX block from line 4360 to 6171. Props: `open`, `onClose`. Consumes `lib/tree-persistence` directly. |
| `lib/ast/tree-utils.ts` | All 8 exported pure helpers. Depend only on `lib/iframe-bridge` types. |
| `components/tree/TreeRow.tsx` | `TreeRow`, `DragPlaceholder`, `HighlightedText`. |
| `components/tree/ContextMenu.tsx` | `ContextMenu` function. |

After extraction `ElementTree.tsx` shrinks to roughly 2,200 LOC.

### File 2: `lib/tree-persistence.ts` (3,358 LOC)

**Responsibilities currently inside:**

1. Tree state persistence — depth, query, expanded set, subtree-depths, schema migration, cross-tab subscription, defaults predicate, byte measurement (~lines 1–975).
2. Storage panel preferences — scope, sort, filter, filter mode, collapsed-other/tree/dropin, export filename, pretty-print, hide-values, value-truncation (~lines 976–2286).
3. Storage panel data — listing, categorization, filtering, sorting, partitioning helpers.
4. Import/export serialization — build/serialize/parse + filename sanitization + JSON pretty-format.
5. Advanced panel features — filter history, recent imports, snapshot/diff, encode/decode preset URL, per-key remove/write, regex helpers (~lines 2411–3358).

**Extractions:**

| New file | What moves there |
|----------|-----------------|
| `lib/storage-panel.ts` | Everything from responsibility 2 onward (~2,400 LOC). |

`tree-persistence.ts` becomes ~960 LOC focused on tree state only.

### File 3: `components/SelectionOverlay.tsx` (3,519 LOC)

Three gesture controllers (resize, spacing, move) sharing one component. Each is ~500 LOC.

**Extractions:**
- `components/overlay/ResizeController.tsx`
- `components/overlay/SpacingController.tsx`
- `components/overlay/MoveController.tsx`
- `lib/ast/overlay-geometry.ts` (pure helpers)

After extraction `SelectionOverlay.tsx` becomes a thin coordinator (~500 LOC).

### File 4: `components/Workspace.tsx` (2,815 LOC)

**Responsibilities:** mutation dispatchers (25+ callbacks), selection state machine, tool state machine, UI shell layout, toast queue, keyboard shortcuts.

**Extractions:**
- `lib/use-edit-dispatch.ts` — the 25 mutation handlers
- `components/ToastBanner.tsx` — toast queue

These two alone would cut Workspace.tsx by ~1,000 LOC.

### File 5: `lib/preview.ts` (2,531 LOC)

**Responsibilities:** iframe HTML builder, supported-package registry, in-iframe runtime script (~1,800-line JavaScript string embedded as TS template literal).

**Extractions:**
- `lib/preview-runtime.ts` — the bridge script string as a single exported constant
- `lib/preview-pkgs.ts` — `SUPPORTED_PKGS` registry

## 3. Module Dependency Overview

```
app/                      (Next.js pages — RSC or "use client")
components/               ("use client" boundary)
  Workspace.tsx           → lib/* + components/*
  ElementTree.tsx         → lib/iframe-bridge, lib/ast/tree-dnd, lib/tree-persistence
  Preview.tsx             → lib/preview, lib/iframe-bridge, lib/layout-context, lib/ast/constraints
                          → components/SelectionOverlay
  SelectionOverlay.tsx    → lib/layout-context, lib/iframe-bridge, lib/ast/{gesture-math, intent-resolver, snap, flip, constraints}
  FocusEditor.tsx         → lib/* (10+ modules)
lib/                      (pure TS, no "use client")
  tree-persistence.ts     → no lib/ imports (self-contained)
  ast/*                   → @babel/parser, magic-string, internal lib/ast/*
  canvas-range.ts         → lib/iframe-bridge (type-only)
  preview.ts              → lib/fonts
  templates.ts            → node:fs, node:path (server-only)
```

**Observations:**
- The lib layer has zero imports from components. Clean.
- Strict DAG: app → components → lib → external packages.
- No circular imports.

## 4. Circular Import Check

No circular imports found in the sampled paths. The dependency graph is a strict DAG.

## 5. Responsibility Split Problems

**Problem A (highest severity):** Debug panel living inside the tree component. `ElementTree.tsx` contains two entirely separate features — element tree and localStorage health inspector — sharing one component function with interleaved state.

**Problem B:** `lib/tree-persistence.ts` owns two unrelated domains. ~960 LOC tree-state vs ~2,400 LOC storage-panel feature.

**Problem C:** `scripts/bench-tree-persistence.mjs` duplicates ~500 LOC from `lib/tree-persistence.ts` rather than importing it. Logic bugs may not be caught.

**Problem D:** Pure tree utilities exported from a "use client" component file. Forces consumers to pull the entire 7,076-LOC tree.

**Problem E:** `SelectionOverlay.tsx` is three gesture controllers in one.

**Problem F:** `Workspace.tsx` co-locates operation dispatchers with layout.

## 6. Suggested Refactor Sequence — Ranked by Cost/Benefit

1. **Extract `StorageHealthPanel` from `ElementTree.tsx`.** Cost: medium. Benefit: very high. Cuts ElementTree.tsx from 7,076 → ~2,200 LOC.
2. **Split `lib/tree-persistence.ts` into tree state + storage panel.** Cost: low-medium. Benefit: high.
3. **Extract pure tree utilities from `ElementTree.tsx` to `lib/ast/tree-utils.ts`.** Cost: very low. Benefit: medium-high.
4. **Extract `lib/preview-runtime.ts` from `lib/preview.ts`.** Cost: very low. Benefit: medium.
5. **Extract `useEditDispatch` hook from `Workspace.tsx`.** Cost: medium. Benefit: medium.
6. **Split `SelectionOverlay.tsx` into gesture controllers.** Cost: high. Benefit: medium.

## Top 3 Actionable Findings (Summary)

1. **`ElementTree.tsx` is two features in a trench coat.** Extract `StorageHealthPanel` to its own file. Highest-ROI change.
2. **`lib/tree-persistence.ts` mixed two unrelated domains.** Split into `lib/storage-panel.ts`. Low-risk module split.
3. **`scripts/bench-tree-persistence.mjs` duplicates ~500 LOC from the module it benches.** Bench may not catch logic bugs. Refactor to import production helpers directly.
