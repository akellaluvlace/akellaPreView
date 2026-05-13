# Phase C — Multi-File Component-Instance Propagation: Research

> Status: research, not spec. No code yet. Open design questions at the end.
> Audience: nikita.akella13@gmail.com (project owner), Claude (next session).
> Date: 2026-05-07.

This doc maps the design space for the only HIGH-tier item left on the manipulation backlog: **multi-file component-instance propagation** (per `maniuplation.md` §"Component Instance System" + `phase5-tools-isolation.md` §C3 + §4.5). The user added a new constraint on 2026-05-07: **swap operations across linked instances must dimension-match** (you can't swap a card-A for a card-B if card-B is twice as tall and breaks the surrounding grid).

The research below covers (a) what shipped, (b) what's missing, (c) how Figma / Webflow / Onlook / v0 solve this, (d) what the industry's 2026 direction implies (container queries, slots, intrinsic design), (e) concrete subsystem breakdown, (f) phasing recommendation, (g) open design questions that block writing the spec.

---

## 1. Problem statement

The user inserts the same component (a `<Card>`) 6 times across a landing page. They edit one card's bg-color from white to slate-50 and expect all six to update — that's the **propagation** half. They also want to swap one card design for a totally different card design and expect all six to swap together, **without the new design tearing the surrounding grid layout** — that's the **dimension-matching** half.

In a single source file with an inline `function Card()` definition, propagation already ships (`phase5-tools-isolation.md` §C3, `Workspace.tsx:269-300`, toggle = "Apply: instance · everywhere"). It walks the AST, finds the matching definition root, and applies the same className patch to both call site and definition. Both edits squash into one undo entry.

Multi-file is a different beast:

```jsx
// page.tsx
import Card from "./components/Card";
function App() { return <><Card /><Card /><Card /></>; }

// components/Card.tsx
export default function Card() {
  return <div className="bg-white p-6 rounded-2xl">…</div>;
}
```

To propagate a className change from `<Card />` in `page.tsx` to the JSX root in `components/Card.tsx`, Dropin needs:

1. A **multi-file source pool** (today: one `code: string` in `Workspace.tsx`).
2. A **multi-file Monaco UX** (tabs / file tree / persistence).
3. **Cross-file import resolution** (`./components/Card` → which file in the pool?).
4. **Cross-file AST query** (find `function Card` in file B from a `<Card />` reference in file A).
5. **Atomic multi-file diffs** (one undo for two-file edit; both apply or neither).
6. **Multi-file iframe bundling** (preview pipeline takes one file today; needs to resolve imports across the pool).

And separately, for **swap with dimension-matching**:

7. **Slot capacity metadata** on every asset in the component library (intrinsic min/max width/height + aspect ratio + can-stretch flags).
8. **Hit-testable compatibility filter** at swap time (only show assets whose slot envelope fits the current element's container).
9. **Optional auto-fit transformation** at swap-apply time (re-tune Tailwind sizing classes so the swapped asset honors the original container).

That's 9 distinct subsystems. The original spec gated (c) on items 1–6 only; the user's 2026-05-07 wrinkle adds 7–9. This doc treats all nine.

---

## 2. Industry prior art

### Figma (2025-2026 rebuild — Materializer + push-based reactivity)

Figma rebuilt the foundation of component instances this year, replacing a self-contained "Instance Updater" runtime with a generic system called **Materializer** that operates on the document tree and creates **derived subtrees** from blueprints. The blueprint for an instance describes "how an instance resolves itself from its main component — what properties it inherits, which overrides apply, and which children should exist." (`figma.com/blog/how-we-rebuilt-the-foundations-of-component-instances`)

Three takeaways for Dropin:

1. **Implicit dependency tracking**: as nodes read data during materialization, Materializer records dependencies automatically. Developers don't declare them. When a source changes, only nodes that read it get marked dirty. Figma reports 40-50% perf improvement for variable-mode changes in large files.
2. **Push-based invalidation with explicit dep graph**: source change → mark dependents dirty → recompute later (lazy). The old "update everything" pull model didn't scale.
3. **Granular invalidation**: only the parts of the tree that actually changed update. Old behavior cascaded thousands of nodes.

**Dropin equivalent**: a multi-file edit dirties a small set of files (caller + definition + transitively any file that imports the definition). The iframe rebuilds only when dirtied files affect the preview; class-only edits route through the existing `dropin:live-style` optimistic-paint path before any rebuild.

### Figma propagation rules (concrete)

What CAN be pushed from instance → main (`figma.com/hc/en-us/articles/360039150733`):
- Text: font, weight, size, line height, letter spacing, resizing
- Fill / stroke: type, value, opacity on any layer
- Effects: shadows, blur (add/edit/remove)
- Layout guides
- **Nested instance swaps** (swap a nested component for another)
- Export settings, layer naming

What can NOT be pushed (instance-only, structural):
- Layer ordering / z-index
- Position
- Constraints
- Text layer bounds

What survives a swap to a different variant / instance:
- Override survives if the **layer name matches** in both source and target
- Variants additionally require the **original property value** matched
- **Text overrides** have looser preservation rules (name + similar hierarchy is enough)

**Aspect-ratio lock has a known bug**: it doesn't preserve across swap. Figma's own engineering team is working on it (Figma Forum thread). Even Figma — the gold standard for this feature — has not solved swap-dimension-matching robustly.

**For Dropin** this maps to: classnames are the equivalent of "layer name + property value." Propagate Tailwind classes globally (style category). Don't try to propagate AST structure, child reorder, or per-element position. Match-by-OID is our equivalent of match-by-layer-name.

### Webflow components (renamed from Symbols, expanded)

Webflow models things three ways: **components** (the master), **variants** (a single property whose values switch the design), **instances** (call sites). Variants are siblings of a base; the base styles cascade down, and per-variant overrides win. Per-instance overrides exist for "component properties" (typed: text / image / link / etc.), and the layered priority order is: base variant → variant → instance override.

Crucially: **slots**. A component can declare slot regions where the user fills content; the component's structural skeleton stays put. Webflow's blog explicitly frames slots as the answer to "stop creating 17 variants of the same card, just slot the content in" (`webflow.com/blog/component-slots`).

**For Dropin**: slots map cleanly to placeholder JSX nodes in the definition. Implementing them is non-trivial (we'd need a `<Slot>` marker), so v1 should defer slots and just do "edit class → propagate class." Slots are a v3+ feature.

### Onlook (the spec's MIT-licensed reference for OIDs)

Onlook uses the same `data-oid` approach as Dropin's `data-dropin-id` (Dropin's `lib/ast/oids.ts:1-13` cites Onlook explicitly). Architecture: WebContainer + CodeSandbox SDK + Bun runtime, multi-file via the file tree. They ship cross-file AI rewrites via Morph Fast-Apply + diff-match-patch streaming, and edits trigger HMR rather than a full srcdoc swap.

What's NOT visible from public docs: their specific propagation policy for instances, override preservation semantics on swap, and how multi-file undo works. Their architecture docs are at docs.onlook.com (not pulled in this research).

**Insight for Dropin**: Onlook chose the heavyweight WebContainer route for multi-file. Dropin can't — the locked stack rules out a full sandbox. Dropin must do multi-file **client-side only**, with the iframe consuming a bundled output rather than a real filesystem. That's a constraint Onlook didn't have.

### v0 (Vercel)

v0 supports multi-page generation (2026): "ask for a SaaS dashboard with auth + settings + analytics" → full project structure with routing, layouts, placeholder data. Component swaps happen via chat-follow-ups ("switch the color palette to slate and emerald") or inline element selection ("change one button's variant"). Built on shadcn/ui — class-based variants on top of Tailwind.

The 2026 reality acknowledged in v0 reviews: *"UI that must match a custom design system exactly should use v0 as a sketch generator, then adapt by hand."* In other words: v0 doesn't fully solve the hard cross-component-system propagation problem either. They lean on shadcn's variants + Tailwind classes as the propagation primitive — which is exactly Dropin's pasted-output reality.

### Monaco multi-model

Monaco's data model: **one model per file**. Not multiple files in one model. The TypeScript / JS language service syncs models to a web worker, and `setEagerModelSync(true)` ensures cross-file IntelliSense (import resolution, go-to-def, find-refs) works without per-keystroke worker round-trips. Model URIs matter: TypeScript uses the URI to resolve imports. Each model owns its own scroll, cursor, undo stack. `model.dispose()` is required when files are deleted to free worker memory.

Performance: Monaco itself handles 2000+ models. The TS compiler is the bottleneck, not the editor. For projects > 1000 files, the recommendation is to consolidate ambient `.d.ts` declarations into single files. Dropin's user files will be 1-50, so we're nowhere near limits.

**For Dropin**: this is the easy part. `@monaco-editor/react`'s `Editor` component takes a `path` prop and a `value` prop; pass the active file's path + content, and it'll create / reuse the model under the hood. We don't need to touch Monaco's internals.

### Container queries (the 2026 industry direction)

The CSS world's answer to "components must be intrinsically adaptive" is container queries (95%+ browser support in 2026; Chrome 105+, Firefox 110+, Safari 16+). Components author themselves with `@container (min-width: 320px) { … }` rules so they adapt to whatever surroundings they're placed in. Industry refrain: **"the death of the breakpoint" → "intrinsic design."**

**Crucial caveat for Dropin**: container queries require `container-type: inline-size` (or `size`) on the parent, which removes intrinsic sizing — an unsized container inside a flex/grid layout will collapse to zero width. So container queries are a v3+ asset-authoring upgrade, not a v1 swap-dimension solution.

The Uiverse + HyperUI assets in Dropin's library today are NOT container-query authored. They use viewport breakpoints + fixed widths. Dropin must solve dimension-matching at swap time, in the asset metadata + at-apply transformation, NOT by relying on intrinsic component design.

---

## 3. Current Dropin state (codebase audit, 2026-05-07)

Dispatched an Explore agent to map the existing single-file architecture. Findings (file:line specifics, all paths relative to repo root):

| Concern | Location | Single-file shape |
|---|---|---|
| Source state owner | `lib/use-source-history.ts:91-188` + `Workspace.tsx:132-135` | Single `useState<string>(initialCode)`; ring-buffer undo (50 entries, 300ms / 50-char coalescing) |
| Monaco wiring | `Editor.tsx:3+70+88-89` via `@monaco-editor/react` | Single model per editor instance, managed internally; `value` + `onChange` props sync with Workspace |
| Iframe rebuild | `IsolatedPreview.tsx:87-90` + `Preview.tsx` | `useMemo` over `debouncedCode` (250ms) → `buildPreviewDocument({code, kind})` → `srcDoc` swap |
| Templates | `lib/templates.ts:16-19, 37-68, 108-121` | Each template = single `source: string` + `kind: 'jsx' \| 'html'` |
| Component library insert | `lib/component-library/insert.ts:35-85` | Returns `{ text, scopeId, requiredPlugins }` — fully inlined into source buffer; no import statements |
| Instance/everywhere toggle | `Workspace.tsx:269-300`, `lib/ast/patch-class-by-oid.ts:80+` | Already shipped for inline definitions in same file; persists via `localStorage["dropin:propagation"]` |
| AST helpers | `lib/ast/{oids,query,operations/*}.ts` | All take `source: string`, return `source: string`; 20+ engines |
| Storage keys | `lib/tree-persistence.ts` + `lib/storage-panel.ts` | `dropin:tree:*`, `dropin:tool`, `dropin:propagation`, `dropin:breakpoint` — none for files |
| Selection state | `Workspace.tsx` | One `selectedOids: string[]` for the active source |

**What's already built that helps**:
- OID system is collision-safe (offset-seeded base-62, deterministic, SSR-safe). Will scale to N files trivially if we mint OIDs per `(fileId, parseOffset)` instead of just `parseOffset`.
- AST index + query is pure (`buildIndex`, `findById`, `parent`, `children`, `siblings`). Refactor to accept a `Map<fileId, AstIndex>` and the cross-file search becomes one extra index lookup.
- Source-history coalescing logic is reusable per-file.
- Operation engines are pure functions — will scale to a `(fileId, op)` shape with thin adapters.
- `patchJsxClassByOid`'s definition-walk already shows the path for "everywhere" semantics; extending to a remote AST is a parameter change.
- Component library insert payload's `scopeId` already isolates CSS — this gives us the primitive for "don't bleed scope across files."

**What's strictly single-file today and would need replacement**:
- `code: string` state in Workspace → `Map<fileId, string>` + `activeFileId: string`
- All 20+ AST operations: signature change to `(files, op) → files`
- `useSourceHistory` single stack → either per-file stacks OR a global stack of multi-file diffs (recommended: global, see §6.4)
- `buildPreviewDocument(code)` → `buildPreviewDocument(files, entryFileId)` with import resolution
- Templates: single-source field → multi-file manifest (gated; might keep current templates as 1-file and only allow user to add files)
- Component library insert: stays single-file (inserts into active file). Multi-file inserts (e.g. "Make Component" extracts the selection to a new file) is a follow-up.
- Monaco: passing dynamic `path` + `value` props to `@monaco-editor/react` reroutes models automatically. No manual `createModel` needed for v1.

---

## 4. The big decisions

Five upstream decisions shape every downstream subsystem. None of these have a single right answer; the user's preferences will drive the spec.

### D1. Persistence model for the file pool

Three options:

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| **a) localStorage only** | No new dependency; offline; works today | 5MB total budget shared with everything else; serialization cost on every edit | Reject for v2+. Already strained by storage panel. |
| **b) IndexedDB via existing `idb` dep** | Multi-MB budget; structured; we already ship `idb` for asset library `recent.ts` | Async API; needs migration story from existing localStorage source state | **Recommended.** Reuse existing infrastructure. Single new schema. |
| **c) Server-backed** | Cross-device sync; tied to user accounts | Requires user accounts (don't have); changes the threat model; reaches outside locked stack | Defer to "v2 of the product" — not v2 of this feature. |

**Locked decision proposal**: IndexedDB via `idb`. Single object store `dropin-files` keyed by `projectId + filePath`. Migration: on first load post-feature-ship, lift the existing single-source from `useSourceHistory`'s in-memory state into a new "default" project with one file. No data loss; users see their work in a tabbed UI on next session.

### D2. File pool granularity

What's a "file" in this system?

- **Per-template** = each gallery template is its own multi-file project. Adding an `import` brings in another sibling file.
- **Per-session** = one shared file pool across all templates. Bad — Card from Template A would conflict with Card from Template B.
- **Per-page** = each `<page>` you author is one project; project has 1-50 files.

**Locked decision proposal**: per-page projects (option 3). Each existing single-file template becomes a 1-file project on migration. New "blank project" CTA creates an empty project with `App.jsx` + `App.html` (kind-aware). User can add `components/Card.jsx`, `lib/util.js`, etc.

### D3. Import resolution ruleset

Three classes of import string:

- **Relative** (`./components/Card`, `../lib/util`): resolve to a file in the project pool by path normalization.
- **Curated npm** (`react`, `lucide-react`, `recharts`): already handled by `SUPPORTED_PKGS` in `lib/preview.ts:49`; no change.
- **Other npm** (`framer-motion`, `@radix-ui/*`): unsupported in v1; clear error toast same as today.

CSS imports (`./styles/foo.css`) and asset imports (`./images/hero.png`) need a separate decision. v1 proposal: skip — only `.jsx`, `.tsx`, `.js`, `.ts` files.

### D4. Definition resolution algorithm

Given a `<Card />` JSXElement at OID `X` in `page.tsx`, find the JSX root in `components/Card.tsx` whose containing function/component is named `Card`.

Algorithm (pure, no runtime):

1. From the call site's AST, walk to the enclosing module.
2. Find the import statement whose specifier's local name is `Card`. Read its source string.
3. Resolve the source string to a file in the pool (D3 rule).
4. Parse the target file. Find the matching exported declaration (`function Card` / `const Card = …` / `export default function Card` / `export default <expr>`).
5. From that declaration, find the JSX root (first JSXElement returned). Get its OID.
6. Run the same `applyX` operation on the target file, scoped to that OID.

**Edge cases** (open question pile in §8):
- Default vs named imports (the local binding name might not match the file's exported name)
- Re-exports through index files (`components/index.ts` re-exports `./Card`)
- Same component imported under different aliases in different files
- HOCs (`export default withAuth(Card)`) — definition root is unclear
- Generic components (`function Card<T>(…)`) — TS generics don't affect JSX
- Conditional renders inside the definition (`if (kind === 'a') return <X /> else return <Y />`) — multiple roots

v1 proposal: support direct named exports + default exports. Bail with a clear toast on HOCs / conditionals / re-exports. Document the scope.

### D5. Diff model for cross-file edits

Today: each AST operation returns a new `source: string`, and `useSourceHistory.setCode(newSource)` makes a new undo entry.

For multi-file:

```ts
type FileDiff = { fileId: string; before: string; after: string };
type Edit = { id: string; ts: number; reason: string; diffs: FileDiff[] };
```

One `Edit` may touch N files. Undo / redo applies all diffs atomically. Coalescing: same-OID-class-edit-within-300ms collapses (whether single-file or multi-file).

This gives us:
- Atomic multi-file undo (one Cmd+Z reverses both call site + definition)
- Visible-to-user "this edit touched 2 files" indicator (post-MVP toast)
- Path forward to async multi-file edits (future LLM rewrites that touch many files)

---

## 5. The swap-dimension-matching wrinkle

The user's 2026-05-07 ask: "if we change one card instance, all instances must swap to that same card design — and the new design must dimensionally fit." This is harder than propagation alone. Three sub-problems:

### 5a. What does "dimension-match" actually mean?

Three honest sub-meanings, each requiring different machinery:

1. **The new asset doesn't break the surrounding grid.** A 6-card grid with `grid-cols-3` expects each card to take ~1/3 of the row. Swapping in a card with `w-[800px]` literal width violates that.
2. **Aspect ratio preserved.** A card that's 4:3 swapped for a 16:9 card visibly disrupts the rhythm.
3. **Vertical rhythm preserved.** A short card swapped for a tall card pushes everything below it down.

Figma's lesson: **even Figma can't fully solve this**. They preserve overrides only when layer-names match, and aspect-ratio-lock famously doesn't preserve on swap (open bug). The honest approach: surface the constraint to the user, give them a filter at swap time, and let auto-fit transformations clean up the rest.

### 5b. Slot capacity metadata on assets

Every asset in the component library (Uiverse, HyperUI, plus any "Make Component"-derived assets) gets a metadata object alongside its existing `text` payload:

```ts
type SlotCapacity = {
  category: "card" | "button" | "hero" | "form" | …;  // already in `swap-category-hint.ts`
  intrinsic: {
    minWidthPx: number | null;       // null = grows to fill
    minHeightPx: number | null;
    maxWidthPx: number | null;       // null = no cap
    maxHeightPx: number | null;
    aspectRatio: number | null;      // null = no AR constraint
  };
  flexBehavior: "fill" | "fit-content" | "fixed";
  responsive: {
    breakpointSensitivity: "none" | "viewport" | "container";
  };
  // For "Make Component" later: derived from the source element at extract time
  source: "library" | "user-extracted";
};
```

We already have `swap-category-hint.ts` (51 cases of prod-import test coverage) — extend it. Computing intrinsic dimensions for library assets is a one-time ingest step (`scripts/ingest-components.mjs` already exists and does similar work).

### 5c. Compatibility filter at swap time

When user invokes Swap on element `E` in container `C`:

1. Read `E`'s current bounding rect from the iframe (already implemented via `dropin:bbox` watch).
2. Read `C`'s computed style + bounding rect (same iframe channel).
3. Compute the **slot envelope**: the available width/height/AR window the new asset must fit in.
4. Filter the swap library to assets whose `SlotCapacity` envelope intersects the slot envelope.
5. Render compatible assets normally; render incompatible assets dimmed with a tooltip ("Won't fit: needs ≥ 320px width").

This is a sort + filter on top of the existing library UI. Not a new UI surface.

### 5d. Auto-fit transformation at swap-apply time

When user picks a compatible asset:

1. Apply the swap (existing `applySwap` engine).
2. Inspect the new element's classNames vs the slot envelope. Three repair rules:
   - If the new element has `w-[…]` literal that overflows, replace with `w-full`.
   - If the new element has `h-[…]` literal that under-fills, leave it (let it be smaller — vertical rhythm is less brittle than horizontal).
   - If the new element has `aspect-[X/Y]` that mismatches the slot's AR, prefer the slot AR — replace.
3. Re-fire the bbox watch and assert the post-swap rect is within ±10% of the pre-swap rect on both axes; if not, emit a `showWarn` ("Layout shifted: 23% taller"). User keeps the swap or undoes.

This is a `lib/ast/operations/swap-fit.ts` follow-up to `applySwap`. Pure-logic, easy to test.

### 5e. Propagation across instances

Once dimension-matching works on a single swap, propagation is the same machinery as className propagation: when user swaps `<Card />` instance and `propagationMode === "everywhere"`, swap also fires on the definition file. All other call sites re-render with the new shape on next iframe rebuild. The pre-flight compatibility check runs against the **most-constrained** caller (the smallest container any caller is in), so we don't propagate a swap that breaks one of the call sites silently. If any call site fails the fit check, the multi-instance swap aborts with a toast listing the affected sites.

---

## 6. Subsystem breakdown

Eight subsystems. Sequenced in build order — each blocks the next.

### 6.1 File pool data structure (lib/files)

New module `lib/files/index.ts` (~200 LOC):
```ts
type FileId = string & { __fileId: true };  // branded
type FileRecord = {
  id: FileId;
  path: string;        // "components/Card.tsx"
  kind: "jsx" | "tsx" | "js" | "ts" | "html";
  source: string;
  isEntry: boolean;    // exactly one entry per project
};
type Project = {
  id: string;
  files: Map<FileId, FileRecord>;
  entryFileId: FileId;
};
```
Persistence: IndexedDB via existing `idb` dep. One object store, key = `projectId/filePath`. Hydration on Workspace mount.

### 6.2 Multi-file Monaco UX

Tabbed editor replaces the single Monaco editor. Tab bar above the editor, file tree as a collapsible side panel (left of editor, right of canvas chrome). Active file's path becomes the Monaco `path` prop; @monaco-editor/react takes care of model creation / disposal.

- New: `components/FileTree.tsx`, `components/FileTabs.tsx`, modify `Workspace.tsx`
- Per-file scroll/cursor state lives in Monaco's per-model state (free)
- Drag-to-reorder tabs, right-click → close/rename/delete
- Ctrl+P / Cmd+P file picker (fuzzy search across path) — power user

### 6.3 Multi-file iframe bundling

`buildPreviewDocument` extends to `buildPreviewDocument({ project, entryFileId })`. New module `lib/preview-bundler.ts`:

1. Walk the entry file's import statements.
2. For each relative import, resolve via path normalization to a sibling file.
3. Recursively walk imports in resolved files.
4. Concatenate all source files into a single bundle string with import statements rewritten to inline references.
5. Hand to existing iframe runtime.

For HTML mode: same single-file behavior (HTML doesn't import). Only JSX mode uses the bundler.

Babel (already shipped) handles JSX transformation. No esbuild / SWC needed.

### 6.4 Cross-file AST query (lib/ast/cross-file-query.ts)

```ts
type ProjectIndex = Map<FileId, AstIndex>;
function buildProjectIndex(project: Project): ProjectIndex;
function findDefinitionFile(
  callSite: { fileId: FileId; oid: string },
  projectIndex: ProjectIndex,
  project: Project,
): { fileId: FileId; rootOid: string } | { error: string };
```

Pure, testable. Uses existing `findInlineComponentDefRootOid` from `lib/ast/component-def.ts` (already prod-import-tested) plus a new "follow the import" step.

### 6.5 Cross-file diff model (lib/edits/cross-file-edit.ts)

Replaces `useSourceHistory.setCode(newSource)` with `applyEdit(edit: Edit)` where `Edit.diffs: FileDiff[]`. Single global undo/redo stack of `Edit` records. Coalescing: identical OID + same property + within 300ms collapses.

### 6.6 Slot capacity metadata + compatibility filter

Extend `lib/swap-category-hint.ts` → `lib/swap/slot-capacity.ts` (the existing file is a minimal categorizer; this is the dimension cousin). Run `scripts/ingest-components.mjs` to compute capacity once per asset.

UI: existing `LibraryModal` adds a "fits this slot" filter chip (auto-on when invoked from Swap with a selected element). Incompatible assets render dimmed with a tooltip.

### 6.7 Auto-fit transformation engine

`lib/ast/operations/swap-fit.ts`. Pure: takes pre-swap rect + post-swap source + slot envelope, applies the 3 repair rules, returns new source + warnings. Fires after `applySwap`.

### 6.8 Cross-instance propagation for swap

Wire `propagationMode === "everywhere"` to fire `applySwap` on the definition file too. Pre-flight: check **all** call site slot envelopes; abort if any fails. Use the existing single-file propagation toggle UI; the multi-file path is a backend extension behind it.

---

## 7. Phasing recommendation

Six phases. Each is one focused multi-day session. Phases A-D are required. Phases E-F are post-shipping polish.

### Phase A — File pool foundation (no UX change yet)

**Goal**: replace `code: string` with `Project` everywhere, behind a flag. Single-file projects keep working with no visible change.

- New `lib/files/` module + IndexedDB persistence
- Migrate `Workspace.tsx` source state to `Project` shape; entry file = the only file
- Migrate `useSourceHistory` to operate on the entry file's source (1-file pool, 1-stack — temporary equivalent)
- `buildPreviewDocument` keeps single-file signature; takes entry file content from project
- Templates stay single-file
- All 5341+ tests still pass

Risk: medium. Touches Workspace state + iframe pipeline + storage. ~2 days.

### Phase B — Multi-file Monaco UX

**Goal**: user-visible "I have 2 files now" experience.

- File tree + tab bar UI
- Per-file Monaco model swap via `path` prop
- New project CTA, "add file" / "delete file" / "rename file" actions
- Per-file selection, undo, scroll preserved (Monaco handles scroll/cursor)
- Single global undo stack of `Edit` records (multi-file ready, even if no edit touches >1 file yet)
- HTML / JSX kind detection per-file; mixed-kind projects allowed
- Templates remain 1-file (could let user "add file" from a template)

Risk: medium-low. Mostly UI work. ~2 days.

### Phase C — Cross-file iframe bundling + import resolution

**Goal**: a 2-file project actually renders.

- `lib/preview-bundler.ts` walks imports, concatenates / rewrites
- Curated npm (React, lucide-react, etc.) routing unchanged
- Bail with clear error on unresolvable imports
- Iframe rebuild trigger now considers any file in the import graph

Risk: medium. The bundler is the new system component. ~2-3 days.

### Phase D — Cross-file propagation (className only)

**Goal**: `propagationMode === "everywhere"` works across files.

- `lib/ast/cross-file-query.ts`
- Extend `applyStyleProps` / `applyClass` to accept `(project, callSiteFileId, definitionFileId, op)` shape
- Wire into existing `propagationMode` toggle
- Fall back to instance-only if definition file not resolvable; surface via toast (matches existing single-file fallback toast)
- Single Edit record spans 2 files; one undo

Risk: medium. Logic-heavy but pure. ~3 days.

### Phase E — Swap with slot-capacity matching (single-file)

**Goal**: dimension-aware swap on a single instance (not yet propagating).

- Extend `lib/swap-category-hint.ts` with capacity metadata
- Re-run `scripts/ingest-components.mjs` to compute capacity for ~500 library assets (one-time)
- Compatibility filter in LibraryModal
- `lib/ast/operations/swap-fit.ts` auto-fit transformation
- Post-swap bbox assertion + showWarn on layout shift
- Tested in single-file mode first

Risk: medium. New asset metadata + new transformation engine. ~3 days.

### Phase F — Swap propagation across instances + dimension-safety pre-flight

**Goal**: swap-everywhere with all-call-site fit guarantee.

- Extend Phase D's cross-file query to support swap (not just className)
- Pre-flight check across all call sites' slot envelopes
- Abort + listing toast if any site fails fit
- Squash into one Edit record across N files

Risk: medium. Builds on D + E. ~2 days.

**Total**: ~14 days of focused work across 6 phases. Each phase has clear acceptance criteria and ships independently.

---

## 8. Open design questions

These need user input before writing the spec. Each has a default answer for "if not addressed, here's what we'd do."

### Q1. Project model: per-template-cloned vs explicit "create new project"

When a user opens Template 12 (gallery), do they get a copy of Template 12's files into a new project automatically? Or does Template 12 stay shared and they must explicitly clone before editing?

- **Default**: explicit "Edit a copy" CTA; Templates stay read-only. Avoids users accidentally mutating gallery state via localStorage / IndexedDB.

### Q2. File path conventions: free-form vs strict

Can users name files anything? Or do we constrain (`/^components\/[A-Z][a-zA-Z0-9]+\.tsx$/` etc.)?

- **Default**: free-form, but UX nudges (template starter projects use conventions; right-click → "Extract to file" auto-suggests `components/<TagName>.tsx`).

### Q3. Default vs named imports preference

When user does "Make Component" on a `<Card>` selection, do we generate a default export or a named export?

- **Default**: default export. Matches v0 / shadcn / most React idioms. Named export is a v3 power-user toggle.

### Q4. HOC / re-export support in v1

Phase D's definition-resolver bails on HOCs (`export default withAuth(Card)`) and barrel re-exports. Is that acceptable for v1?

- **Default**: yes, bail with toast: *"Component definition is wrapped or re-exported; everywhere mode requires direct exports today."* Cover in v3.

### Q5. Asset capacity computation: build-time vs ingest-time vs runtime

To compute slot capacity for ~500 library assets, we can: (a) run an ingest script offline, store results in JSON; (b) compute on first-use and cache; (c) measure on every render.

- **Default**: (a) — ingest-time. Stored in `data/component-capacities.json`. Re-runs on `npm run build:assets`. Same model as existing thumb generation. Offline + deterministic + reviewable.

### Q6. "Make Component" auto-extraction

In Phase E or beyond, right-click → Make Component should extract the selection to a new file with a default-named export. Wire-through complexity?

- **Default**: deferred to a Phase G post-MVP. Spec it; don't build until v1 of multi-file ships and gets miles.

### Q7. Multi-file selection / undo across files

If user has selections in file A and file B simultaneously (rare; likely impossible in current UI), what happens?

- **Default**: only the active file has selection. Switching files clears the selection. Undo always replays the saved state regardless of active file (the `Edit` record self-describes which file(s) it touched).

### Q8. Asset library origin attribution

Uiverse / HyperUI components are MIT/CC0-licensed but require attribution. Today, we inject attribution into the source as a comment. With multi-file + Make Component, the attribution lives once at extract time. Do we also write an `ATTRIBUTIONS.md` file in the project? Or stay with comment-in-source?

- **Default**: comment-in-source. Generating an extra file complicates the model.

### Q9. iframe rebuild scope on multi-file edit

When user edits `components/Card.tsx`, the iframe must rebuild because `page.tsx` (entry) consumes Card. When user edits `lib/util.js`, same. Does the bundler flag dirty files, or does the iframe always fully rebuild?

- **Default**: always fully rebuild on any edit (cheaper to think about). Optimize later if perf hurts. The existing `dropin:live-style` optimistic-paint path handles class-only edits without rebuild already; that stays.

### Q10. Cross-file dimension-mismatch propagation: hard-abort vs warn

If user swaps `<Card />` in `everywhere` mode and one of the 6 call sites' containers can't fit the new shape, do we (a) abort the whole swap, (b) swap everywhere except the offending site, (c) swap everywhere with a warn toast?

- **Default**: (a) abort. Atomic multi-file diff. User picks a compatible variant or accepts that one site won't fit (manual edit afterward). Predictability > convenience.

---

## 9. Risk register

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Bundler complexity blows up scope | High | Medium | Phase C is gated to relative imports + curated npm only. Defer everything else (CSS imports, asset imports, JSON imports). |
| IndexedDB migration loses single-file user state | High | Low | Migration runs once; old localStorage source state is read-then-imported, not deleted. Reversible for one session. |
| Asset capacity wrong → swap looks broken | Medium | Medium | Ingest script outputs are reviewable; manual override per-asset for outliers; bbox assertion catches runtime miss. |
| Cross-file undo edge cases (delete file mid-history) | Medium | Medium | `Edit.diffs: FileDiff[]` carries before+after for each file. If a file no longer exists at undo time, recreate it from the `before` state. Documented as feature. |
| HOC / re-export users bail to single-file fallback | Low | Medium | Clear toast; graceful degradation matches today's behavior. |
| Locked-stack constraint blocks proper bundler | Medium | Low | We're using Babel-standalone for JSX already; same for the bundler. No esbuild/SWC needed. |
| Performance on 50-file projects | Low | Low | Monaco handles 2000+; Babel-standalone is the bottleneck. Cap project size at 50 files in v1; warn user if exceeded. |
| Swap-fit auto-transform breaks the asset's own design | Medium | Medium | Bbox post-assertion catches >10% drift; user sees `showWarn` and can undo. Auto-fit transform is conservative (only width-coercion is required; height stays). |
| OIDs collide across files | High | Low | Refactor `makeOid` to seed on `(fileId.length << 24) ^ parseOffset`. Tested in oids-prod.test.ts post-extension. |
| User pastes new code into Monaco that imports a file we don't have | Medium | High | Parse on save; surface "import not resolvable" inline-marker; no iframe-rebuild attempted. Existing single-file behavior for unresolvable JSX already does similar. |

---

## 10. Recommendation

Phases A → D ship the propagation half (the spec's original (c)).
Phases E → F ship the swap-dimension-matching half (the user's 2026-05-07 wrinkle).

Suggested sequencing: ship A → B → C → E first (in that order — get multi-file working AND make swap dimension-aware in single-file mode), THEN D → F (cross-file propagation for both className and swap, in that order).

Why this order: Phase E (swap-fit metadata + filter) delivers user-visible value even if multi-file propagation is still single-file, because today the asset library's swap doesn't dimension-check at all. Shipping E before D means users see immediate quality improvement; D adds the multi-file scaling on top.

**Estimated effort**: ~14 days of focused work. Comparable in scale to the manipulation-Phase-1 grind from earlier sessions. Largely additive (no major refactor of existing surface), so rollback per-phase is feasible.

**Hard prerequisites before starting**:
1. User answers Q1-Q10 (or accepts defaults).
2. Decide on the project-vs-template ownership model (D2 + Q1 jointly).
3. Decide whether the `phase-c-research.md` becomes the Phase C spec doc, or whether we produce a separate `phase-c-spec.md` once Q1-Q10 are locked.

**Soft prerequisites**:
1. Manual testing (in progress) shouldn't surface regressions in the existing single-file flow that need fixing first.
2. The 2026-05-06 audit's deferred F1/F2/F4 type-design refactors don't block this; can land in parallel.

---

## Appendix — Sources

### Figma component instance architecture
- [How We Rebuilt the Foundations of Component Instances](https://www.figma.com/blog/how-we-rebuilt-the-foundations-of-component-instances/)
- [Apply changes to instances (Figma Help)](https://help.figma.com/hc/en-us/articles/360039150733-Apply-changes-to-instances)
- [Swap components and instances (Figma Help)](https://help.figma.com/hc/en-us/articles/360039150413-Swap-components-and-instances)
- [Figma Forum: Aspect ratio lock instance swap bug](https://forum.figma.com/report-a-problem-6/aspect-ratio-lock-instance-swap-bug-37399)
- [How to Supercharge your Design System with Slots (Figma Blog)](https://www.figma.com/blog/supercharge-your-design-system-with-slots/)

### Webflow
- [Symbols evolved to Components (Webflow Updates)](https://webflow.com/updates/symbols-evolved-to-components)
- [Component variants (Webflow Help)](https://help.webflow.com/hc/en-us/articles/51307110086547-Component-variants)
- [Embracing more composability with component slots (Webflow Blog)](https://webflow.com/blog/component-slots)

### Onlook
- [onlook-dev/onlook (GitHub)](https://github.com/onlook-dev/onlook)
- [Onlook: A React visual editor (LogRocket)](https://blog.logrocket.com/onlook-react-visual-editor/)

### Monaco multi-model
- [Monaco editor IntelliSense from multiple files (Copy Programming)](https://copyprogramming.com/howto/monaco-editor-intellisense-from-multiple-files)
- [microsoft/monaco-editor Discussion 5087: Keeping models in separate projects](https://github.com/microsoft/monaco-editor/discussions/5087)
- [microsoft/monaco-editor Discussion 3718: multi-file autocompletion / IntelliSense / goto-def](https://github.com/microsoft/monaco-editor/discussions/3718)
- [@monaco-editor/react (npm)](https://www.npmjs.com/package/@monaco-editor/react)

### v0
- [v0 Templates / Components](https://v0.app/templates/components)
- [Introducing the new v0 (Vercel)](https://vercel.com/blog/introducing-the-new-v0)

### Container queries (2026 industry direction)
- [Container queries in 2026: Powerful, but not a silver bullet (LogRocket)](https://blog.logrocket.com/container-queries-2026/)
- [The Ultimate Guide to CSS Container Queries in 2026 (DEV)](https://dev.to/nickbenksim/the-ultimate-guide-to-css-container-queries-in-2026-1ndi)
- [CSS container queries (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)

### Design systems / slots / composability
- [Cards and Composability in Design Systems (EightShapes / Nathan Curtis)](https://medium.com/eightshapes-llc/cards-and-composability-in-design-systems-8845ecbee50e)
- [Slot Components in Figma (UXMisfit)](https://uxmisfit.com/2022/03/14/slot-components-how-to-create-them-in-figma/)
