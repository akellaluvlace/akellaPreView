# Direct Manipulation Editing System

## Goal

The vibecoder points at a thing, drags, and the thing changes the way they meant. Every gesture has one obvious meaning, executed correctly across every layout context, with code that stays clean afterward. No surprises, no broken layouts, no lost work.

This is the editing layer that turns the tool from "live preview with a code editor" into "I can build my site by manipulating it directly." It is the moat.

## The user the system serves

A vibecoder is not a designer (they don't think in terms of grids, baselines, or design tokens) and not a developer (they don't think in terms of `flex-basis` vs `width` or CSS specificity). They think in terms of what they see and what they want. "This is too small." "These are uneven." "Move this to here." "Make the corners rounder."

Every interaction in this system has to translate that mental model into correct code without the user knowing or caring how. They never see flex-basis. They never type a CSS variable name. They never debug a cascade. The system handles all of it.

The only signal they should ever get from the editor is: my intention, executed.

## The five-layer architecture

The system is built in five layers. Each has one job. Bugs in one layer don't leak into others. New features extend at the layer they belong in.

### Layer 1: Source of Truth (AST)

The user's code is parsed into an Abstract Syntax Tree the moment it enters the editor. The AST, not the string code, is the source of truth. The string code on disk is a serialized projection of the AST.

Three parsers, all production-grade, all preserve formatting losslessly:

- **`@babel/parser`** for JSX/TSX (revised 2026-04-28 — earlier draft called for swc; see Implementation Toolchain → "Parser" for why Babel won. tl;dr: swc-wasm-web's mandatory async `await init()` is fatal for keystroke-grain re-parse; Babel parser is sync, 78 KB gzip, parses our largest templates in <5 ms; Onlook ships the same way.)
- **PostCSS** for CSS (industry standard, plugin ecosystem, source maps)
- **parse5** for HTML (already installed; handles real-world ugly HTML; the existing inspector uses its `sourceCodeLocationInfo` for byte-precise spans)

Every node in the AST gets a stable identity assigned at parse time. The ID is a deterministic hash of the node's structural path (parent type, sibling index, tag, key attributes). Same code parses to same IDs. Edits preserve IDs through diff matching.

When the AST changes, it serializes back to source code with original formatting preserved. The user's spaces, line breaks, comments, attribute order, all retained exactly. This is non-negotiable: edits must be invisible to the user when they look at the code.

The AST exposes a query API:
```
ast.findById(id) → node
ast.parent(id) → node
ast.children(id) → node[]
ast.siblings(id) → node[]
ast.ancestors(id) → node[]
ast.computedClasses(id) → string[]
ast.appliedRules(id) → CssRule[]
```

Every other layer uses these queries. None of them touch the string source.

### Layer 2: Layout Inspector

When the iframe renders, the browser performs a full layout calculation. The Layout Inspector service interrogates this calculation to understand what the browser actually decided.

For any element, the inspector returns a complete layout context:

```
{
  bounds: { x, y, width, height },              // actual rendered rectangle
  inset: { top, right, bottom, left },          // computed offset values
  computed: { ...all resolved CSS },            // every property as the browser sees it
  layoutRole: 'flex-item' | 'grid-cell' | 'block' | 'inline' | 'absolute' | 'fixed',
  parent: {
    layoutRole: 'flex-container' | 'grid-container' | 'block' | 'inline-container',
    direction: 'row' | 'column' | null,
    wrap: boolean,
    gap: { row: number, column: number },
    justify: '...',
    align: '...',
    bounds: { x, y, width, height },
    contentBounds: { x, y, width, height }     // inside parent's padding
  },
  constraints: {
    minContentWidth: number,                    // smallest the content allows
    maxContentWidth: number,                    // largest the content needs
    parentAvailableWidth: number,               // room parent gives
    parentAvailableHeight: number,
    isFlexGrowing: boolean,
    flexGrow: number,
    flexShrink: number,
    flexBasis: string,
    isGridSpanning: boolean,
    gridColumnSpan: number,
    gridRowSpan: number,
    aspectRatio: number | null,
    isImage: boolean,
    isText: boolean,
    isLeafNode: boolean,
    hasOverflowChildren: boolean
  },
  siblings: Array<{ id, bounds, layoutRole }>,
  inheritedFrom: {                              // where each style comes from
    width: { source: 'inline' | 'class' | 'inherited' | 'default', selector?: string },
    padding: { source: ..., selector?: ... },
    // for every relevant property
  }
}
```

The inspector watches the iframe with `ResizeObserver`, `MutationObserver`, and a custom intersection layer. It invalidates and recomputes context for affected elements when the layout changes.

This layer is where the system understands the world. Without it, every other layer is guessing.

### Layer 3: Intent Resolver

The user grabs a handle and starts dragging. Before any visual change, the resolver decides what this gesture *means* in layout terms.

Inputs:
- The grabbed handle's role (size, padding, margin, position, radius, rotate)
- The grabbed handle's location (which side, which corner)
- The element's full layout context (Layer 2)
- Modifier keys held at drag start (Shift, Cmd, Alt, Ctrl)
- The element's existing style values (in particular: which units, which sources)

Output: a single typed `Intent` describing what should change.

```
Intent =
  | ResizeWidth { basis: 'width' | 'flex-basis' | 'grid-span' | 'min-width' | 'max-width' | 'aspect-ratio'; unit: 'px' | '%' | 'rem' | 'em' | 'vw' | 'fr'; preserveAspect: boolean }
  | ResizeHeight { basis: 'height' | 'min-height' | 'max-height' | 'aspect-ratio'; unit: 'px' | '%' | 'rem' | 'em' | 'vh' | 'fr' }
  | AdjustPadding { sides: ('top' | 'right' | 'bottom' | 'left')[]; unit: 'px' | 'rem'; symmetric: boolean }
  | AdjustMargin { sides: ('top' | 'right' | 'bottom' | 'left')[]; unit: 'px' | 'rem'; symmetric: boolean }
  | RepositionAbsolute { axes: ('x' | 'y')[]; basis: 'inset' | 'transform'; anchor: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' }
  | ReorderSibling { axis: 'horizontal' | 'vertical' }
  | Reparent { acceptedTargets: AstId[] }
  | AdjustRadius { corners: ('tl' | 'tr' | 'bl' | 'br')[]; uniform: boolean }
  | AdjustFontSize { unit: 'px' | 'rem' | 'em' }
  | Rotate
  | Skew { axis: 'x' | 'y' }
```

The resolver is a pure function. Given the same inputs, it always returns the same intent. This makes it testable and debuggable: any "drag did the wrong thing" bug is reproduced by replaying the inputs.

The resolver's logic is encoded in a decision table that handles every layout context the system understands. A few examples of how it decides:

**Right-edge handle dragged on element**:
- If element is `<img>`, `<video>`, or has `aspect-ratio` set: `ResizeWidth { basis: 'width', preserveAspect: true }` (Shift to break)
- Else if element is text-only: `AdjustFontSize` (text width is meaningless to resize)
- Else if parent is grid-container and element spans cells: offer choice between `ResizeWidth { basis: 'grid-span' }` (extend cells) and `ResizeWidth { basis: 'width' }` (override). Heuristic: if drag distance approaches column gutter, prefer span; if smaller, prefer width.
- Else if parent is flex-container and element has `flex-grow > 0`: `ResizeWidth { basis: 'flex-basis', unit: original-unit-or-px }`
- Else if element has explicit `width: N%`: `ResizeWidth { basis: 'width', unit: '%' }` (preserve percentage)
- Else if element has explicit `width: Npx`: `ResizeWidth { basis: 'width', unit: 'px' }`
- Else (no explicit width): `ResizeWidth { basis: 'width', unit: 'px' }` (introduces width, with notice)
- If Shift held: lock aspect ratio
- If Alt held: resize from center (mirror to opposite edge)
- If Cmd held: ignore snapping, free drag

**Center-of-element handle dragged**:
- If element is `flex-item` or `grid-cell` or `block` in normal flow: `ReorderSibling { axis: parent-direction }` (move within parent's order)
- If element is `absolute` or `fixed`: `RepositionAbsolute { axes: ['x', 'y'], basis: 'inset', anchor: detected-anchor }` (move position values)
- If drag crosses parent boundary: switch to `Reparent { acceptedTargets: compatibleParents }` mid-drag
- If element has `transform: translate(...)`: option to use transform basis (preserves layout) via Cmd-drag

The resolver also computes side effects of the intent:
- Properties that will be auto-removed (e.g., `flex: 1` removed when reparenting out of flex)
- Properties that will be auto-converted (e.g., `clamp()` converted to fixed when overridden)
- Constraints that will be hit (min-content, parent edge)

These accompany the Intent so the user-facing label can warn before the drag commits.

### Layer 4: Operation Engine

Intent in. AST diff out.

Each intent kind has a dedicated handler that knows the AST mutations required:

```
applyIntent(ast, intent, value, modifiers) → AstDiff
```

The diff is structured, not a blob:

```
AstDiff {
  changes: Change[]
  description: string                          // "Resize button width to 248px" for undo UI
  affectedNodeIds: AstId[]                     // for selection persistence
  warnings: Warning[]                          // soft constraints hit, conversions made
  reversible: boolean                          // some operations can't be cleanly undone
}

Change =
  | SetStyle { node: AstId; property: string; value: string; unit: string }
  | RemoveStyle { node: AstId; property: string }
  | ReplaceStyle { node: AstId; oldProperty: string; newProperty: string; value: string }
  | AddClass { node: AstId; class: string }
  | RemoveClass { node: AstId; class: string }
  | ReplaceClass { node: AstId; oldClass: string; newClass: string }
  | SetAttribute { node: AstId; name: string; value: string }
  | RemoveAttribute { node: AstId; name: string }
  | MoveNode { node: AstId; newParent: AstId; index: number }
  | InsertNode { node: AstNode; parent: AstId; index: number }
  | RemoveNode { node: AstId }
  | WrapNode { node: AstId; wrapper: AstNode }
  | UnwrapNode { node: AstId }
  | UpdateCssRule { selector: string; property: string; value: string }
  | InsertCssRule { selector: string; declarations: Record<string, string> }
  | RemoveCssRule { selector: string }
```

Diffs compose. A single drag can produce a diff with multiple changes (resize a flex child can produce: SetStyle on the child, RemoveStyle clearing flex-basis if conflicting, UpdateCssRule on a class definition if the user's setting was inherited from a class). The whole diff is one operation, one undo entry.

Diffs are reversible: each Change has a defined inverse. The undo stack stores forward diffs; undo applies their inverses.

The Operation Engine never reads the source string. It only reads and writes the AST. This isolates correctness: if the AST is right, the source is right.

Application order matters when changes interact. The engine sorts changes within a diff to apply in safe order: removes before inserts, parent changes before children, attribute changes before structural changes. Tested via property-based testing on randomized diffs.

### Layer 5: Renderer (Two Tracks)

The system has two rendering paths, running on different timescales.

**Track A: Optimistic in-iframe paint via a managed stylesheet (NOT inline `element.style.*`, NOT a host-side ghost)**

During a drag, the iframe element being manipulated is **never** mutated via `element.style.width = '248px'` — that races with React's next reconcile and gets clobbered the moment any prop, state, or parent re-render fires (which happens on every Monaco keystroke). Instead, a single dedicated stylesheet is injected at iframe boot:

```html
<style id="dropin-live"></style>
```

…and during the drag, the host posts per-rAF messages `dropin:live-style { id, declarations }`. The iframe runtime maintains a CSS rule keyed by the element's stable `data-dropin-id` selector inside that stylesheet — adding, replacing, and deleting the rule as the drag progresses. React doesn't touch foreign stylesheets, the cascade wins, and the optimistic paint is stable across reconciles.

This is what makes drags feel native-fast: sub-frame latency, no jank, full 120fps on capable displays. Track A is fire-and-forget during the drag. Visual state may diverge from canonical AST state momentarily — fine, it's how the user sees their drag in real-time.

**Why not the direct-DOM-mutation pattern (the original draft of this spec):** React reconciliation will overwrite inline `element.style.*` on the next render. The managed-stylesheet pattern sidesteps the reconciler entirely. **Why not a host-side ghost overlay:** four catastrophic failure modes —
1. Visual fidelity is unsolvable in general. A ghost needs the same fonts, backgrounds, gradients, shadows, transforms, blur, mask, mix-blend-mode, and inherited cascade. Cloning DOM into the host strips inheritance. `html2canvas` snapshots are 50-200 ms/frame, fatal at 60 fps.
2. Layout context is lost. A `flex` / `grid` child cloned into a host `<div>` recomputes against host layout, not iframe layout. Wrong size the moment the element isn't a free-floating block.
3. Siblings don't reflow. Drag a flex item wider — neighbors should shrink. Ghost overlay leaves the real iframe layout untouched, so siblings don't move. The WYSIWYG promise breaks.
4. FLIP has nothing to animate from because the iframe element never moved.

Reference: Onlook's [`apps/web/preload/script/api/style/css-manager.ts`](https://github.com/onlook-dev/onlook/blob/main/apps/web/preload/script/api/style/css-manager.ts) (uses `css-tree` for in-iframe stylesheet AST; `getDomIdSelector(...)` keys rules by stable id) and [`apps/web/preload/script/api/elements/move/drag.ts`](https://github.com/onlook-dev/onlook/blob/main/apps/web/preload/script/api/elements/move/drag.ts).

**Narrow inline-style exception** — `transform`, `zIndex`, `position: fixed` are written directly during translate/move drags only. React almost never sets these from props, so the reconciliation race doesn't bite for this narrow subset. Same compromise Onlook makes.

**Stub placeholder for non-absolute drag** — when the user moves a flow child of `flex` / `grid` / `block`, the real element gets `position: fixed` + transform to follow the cursor, and a `display: none` "stub" of the same dimensions takes its layout slot so siblings don't collapse. Direct port of Onlook's [`move/stub.ts`](https://github.com/onlook-dev/onlook/blob/main/apps/web/preload/script/api/elements/move/stub.ts).

**rAF-throttled writes** — `pointermove` events buffer to a single `dropin:live-style` per rAF tick. One stylesheet rewrite per frame max, never per-event.

**Cancel path (Esc / pointercancel / lostpointercapture / window blur)** — host posts `dropin:live-clear { id }`. Iframe deletes the rule from `#dropin-live` and restores any temporarily-touched inline `cssText` from a snapshot taken at drag start. No source patch, no AST diff, no undo entry.

**Track B: Canonical AST commit**

On drag end (and on every non-drag operation: keypress in properties panel, sidebar action, code edit), the diff applies to the AST. `magic-string` overwrites the affected source bytes. The new source flows back into Monaco and the iframe re-renders.

**FLIP only on dragend → commit.** First-position is the rectangle the element occupied at drag end (still painted via `#dropin-live`). Last-position is the rectangle after the iframe has rebuilt from the new source. If they match (the optimistic paint guessed correctly): delete the rule from `#dropin-live`, drop the FLIP, no animation needed. If they differ (rare, complex layout): apply a 150 ms `transform` ease-out on the host overlay that bridges First → Last, then delete the rule. **Don't try FLIP from a never-moved element** — there is no First position.

For incremental updates, Track B computes a minimal DOM patch from the AST diff and only re-renders affected elements. Full iframe rebuild is the fallback for changes that ripple globally (CSS variable changes, class-rule rewrites, structural changes).

**Stable identity for Track A keying — `data-dropin-id` alongside the existing `data-dropin-loc`.** The two attributes coexist for the entire Phase 1 → Phase 4 window:
- `data-dropin-id` — opaque per-mount nanoid injected by the Babel plugin during the OID walk (Layer 1). Stable across edits because it's part of the source. Owned by the new system. Used to key rules in `#dropin-live`, the new selection model, and the source-patch addressing path once parity is reached.
- `data-dropin-loc` — volatile (`startLine:startCol:...:openEndCol` shifts on every text edit). Owned by the existing `Inspector.tsx` / `lib/source-patch-jsx.ts`. Stays for compatibility until the new system covers all of its functionality.

### Layer 6: AI Commands (separate lane, NOT inside the Operation Engine)

**Two principles, locked:**

1. **AI never runs from a gesture.** Drag, click, keypress on a property handle, slider, or arrow-key nudge — none of these touch an LLM. They go through the deterministic Layer 3 → Layer 4 → Layer 5 path. The same input always produces the same diff. This is why the editor *feels precise*.
2. **AI always runs from explicit user invocation.** `Cmd-K` command palette, "Generate hover state" button, "Make this section more compact" prompt, chat lane. The user types intent in language and accepts an explicit latency budget.

This is the architecture every shipping production editor converged on (verified, April 2026): Onlook routes Morph Fast-Apply through its AI chat agent only, never through resize handles. v0 by Vercel explicitly: "Design Mode immediately updates the code without using any AI tokens." Cursor's `cursor-fast` is the agent's tool-calling loop, not an IDE handle. Bolt and Lovable's full-file rewrites live in the chat lane. Nobody routes `mousemove` through an LLM.

**Latency math, locked:**
- Drag handle hot path: <16 ms per frame. Anything slower than that kills the precise feel. Hard ceiling.
- Morph Fast-Apply (specialized 7B model, OpenAI-compatible at `api.morphllm.com/v1/chat/completions`): ~10,500 tok/s, ~0.8 s for a 500-line file, ~1.3 s for 1000 lines. Pricing: morph-v3-fast $0.80/$1.20 per M tokens (in/out). Production-ready.
- Anthropic Claude Sonnet 4.6 / Opus 4.7: 2-5 s+ to first token, 4-10 s for a full rewrite. Variable. No "fast apply" specialized model exists in Anthropic's lineup as of April 2026.

Routing any of these through a drag handle is unusable. They're the right tools for *explicit user invocation* on the AI Commands lane.

**Pipeline (Cmd-K command path):**

```
user prompt + selected node + surrounding source (Babel parser cuts a focused window)
  → Sonnet 4.6 generates a "lazy edit" snippet with `// ... existing code ...` markers
  → Morph Fast-Apply merges the lazy snippet into the full file (~0.8-1.3 s)
  → re-parse with @babel/parser to validate (no syntax errors, file parses)
  → diff preview (host overlay) shows the proposed change
  → user accepts → swap source on commit; user rejects → discard
```

Validation is **failure-detection, not correctness-proof**: re-parse to confirm the file parses; if it doesn't, retry the apply step with the parser error as additional context (max 2 retries). Don't try AST-equivalence checking against an intent spec — that requires formalizing the intent, which is the hard problem the LLM was supposed to make go away.

**Two-stack undo with kind tags.** Same undo/redo UI, but each entry tags its lineage:
- `{kind: "intent", reversible: true, diff: AstDiff}` — surgical Layer 4 diff, inverse-applies cleanly.
- `{kind: "ai", reversible: false, prevSource: string, description: string}` — full file snapshot before the AI edit. Reverting an AI edit is `swap source ← prevSource`. Cheap, predictable.

The history panel labels them so the user can tell at a glance: "Resize button width to 248px" vs "✨ AI: Make hero more compact".

**Affordance separation in the UI.** Handles snap and feel mechanical (Layer 5 pure-DOM). The ✨ palette feels deliberately like submitting a prompt — small spinner, "Working…" text, 1-2 s budget visible. Users tolerate latency they explicitly invoked. They will not tolerate jitter on a drag they're holding under their finger.

**Phasing.** Layer 6 ships as a separate track, parallel to Phase 5-6. Adds 2-3 weeks (Sonnet API client + Morph integration + diff preview UI + separate undo lane). Not on Phase 1's critical path.

**Reference implementations:**
- Onlook chat agent: `apps/web/client/src/components/store/editor/chat/`
- Morph Fast-Apply SDK: https://docs.morphllm.com/sdk/components/fast-apply
- Cursor Composer 2 architecture: https://cursor.com/blog/composer-2

## Selection Model

Selection is semantic, not positional. When user clicks an element, the system stores the AST ID, not coordinates. Selection persists through:
- Code edits (looked up by ID in the new AST)
- Iframe re-renders
- Page scrolls
- Undo/redo
- Switching between projects (selection clears, but recent selection is remembered for restore)

Multi-selection is a list of AST IDs. Operations apply to all. The selection state lives in the editor shell, not the iframe.

### Hit testing

The iframe has an injected event listener layer that captures clicks before they reach the rendered elements. The listener:

1. Reads the event target's `data-dropin-id` attribute
2. If the target is a child of a "selectable group" (defined below), promotes the target to the group's root on first click
3. Sends a postMessage to the parent with the resolved selection ID

**Selectable groups** are AST nodes that the user thinks of as one thing even though they're composed of many elements. Examples: a card with image, title, description, and button is one "card" to the user, even though it has 4+ children. The system tags selectable groups during AST parse based on heuristics:
- Components inserted from the library are groups (the whole component is one selection unit)
- Any element with a `role="..."` attribute that suggests a unit (article, region, banner)
- Any element matching common patterns (a parent with multiple children where the parent has visible styling and children fill it)

First click selects the group. Second click on the same area selects the deepest element under the cursor (drill in). Third click drills further. Each click goes one level deeper, until the user reaches a leaf.

Escape key always goes one level shallower. Cmd+A selects siblings of current selection. Tab goes to next sibling. Shift+Tab to previous.

This is the Figma model and it's correct. Vibecoders click the obvious thing first, drill in only if needed.

### Selection feedback

The selected element gets a precise visual treatment:

- 2px solid outline in the editor's accent color, exactly on the element's bounding box (not 1px off due to anti-aliasing)
- Outline is rendered via an overlay in the editor shell, not via CSS on the element. This means selection styling never affects the actual rendered design.
- Element's name floats above the outline: "Button" or "section.hero" or component name if from a library. Truncates to 200px max width. Anchored to top-left of selection, but switches to bottom-left if selection is at top of viewport.
- Toolbar appears anchored to the selection (described below).

Hover (no click) shows a subtle 1px outline in a lighter shade. Different from selected so the user can distinguish. Hover outline disappears immediately on mouse leave.

Multi-selection shows the same outline on each, plus a bounding box around the entire selection group with a different stroke pattern (dashed).

## Handle System

When an element is selected, handles appear. Different handles do different things, visually distinct, contextually appropriate.

### Handle types and visual language

Each handle type has a specific shape and color so users learn to recognize them:

**Size handles**: solid filled squares, accent color, 8x8px, at the four corners and four edge-midpoints of the element. Corners resize both dimensions. Edges resize one dimension.

**Padding handles**: dashed-border squares (no fill), accent color, 6x6px, just inside the element's edges. Visible only when cursor is near the element's interior. Drag inward decreases padding, outward increases.

**Margin handles**: dashed-border squares, gray, 6x6px, just outside the element's edges. Visible only when cursor is near the element's exterior. Drag inward decreases margin, outward increases.

**Position handle**: a circle with a 4-way arrow icon, accent color, in the center of the element. Visible only for elements that can be repositioned (absolute, fixed, or normal-flow elements that support reorder).

**Radius handles**: small filled circles, accent color, 5x5px, at corners. Drag toward center to increase radius, outward to decrease. Smaller than size handles to avoid conflict; appear only when cursor is in close proximity to corner.

**Rotation handle**: a curved arrow icon above the top-edge midpoint, only visible for elements with explicit transform support (overlay graphics, decorative elements). Drag in arc to rotate.

**Aspect lock toggle**: a chain icon next to size handles. Click to toggle aspect ratio lock. Visual state: linked (aspect locked) vs broken (free).

### Handle visibility logic

Showing all handles always is overwhelming. The system fades handles in and out based on cursor proximity and modifier keys:

- Cursor far from element: only size handles at corners and edges (the "default" state)
- Cursor near element interior: padding handles fade in
- Cursor near element exterior (within 24px): margin handles fade in
- Cursor near a corner: radius handle fades in (replaces or sits next to size corner)
- Cmd held: position handle highlighted, others dimmed (move mode)
- Alt held: symmetric modifier indicators on padding/margin handles
- Shift held: aspect-lock indicator on size handles

Fade in/out is 100ms ease, fast enough to feel responsive, slow enough to avoid flicker.

### Handle hit areas

The visual handle is small (5-8px). The hit area is larger (16x16px minimum) for easier grabbing. This is the standard Figma move and necessary for usability. The visual stays small to avoid obscuring content; the hit area expands invisibly.

On touch devices, hit areas expand further (44x44px) per platform conventions.

## Drag Lifecycle

A complete drag, with every detail:

### Drag start (mousedown on a handle)

1. System records initial cursor position, initial element state, modifier key state.
2. Layer 2 fetches full layout context for the element and all siblings.
3. Layer 3 resolves the intent. The intent is locked for the duration of this drag (modifier key changes mid-drag don't change intent type, only modify behavior within it).
4. Snap targets computed and cached: element-specific (matching siblings, parent edges) and global (multiples of 8, common values).
5. Drag overlay appears: cursor label, axis guide line, sibling/parent boundary indicators.
6. Element gets a slight elevation (subtle shadow) for visual feedback.
7. Other elements drop to 70% opacity to focus attention.
8. Cursor changes to match drag type (`ew-resize`, `ns-resize`, `move`, custom for padding).
9. Pointer is captured (`element.setPointerCapture`) so the drag continues even if cursor leaves the iframe.

### Drag move (mousemove)

1. Cursor delta computed from drag-start position.
2. New value calculated based on delta and intent (with modifiers applied).
3. Snap check: if value is within 4px of a snap target, snap to it. Set "currentSnap" reference.
4. Constraint check: if value violates a hard constraint (below min-content, exceeds parent), clamp to constraint.
5. Track A applies: direct DOM mutation in iframe with new value.
6. Cursor label updates: "Width: 248px (snapped to sibling)"
7. Snap guide lines render if snapped.
8. Constraint warnings render if hit.
9. Properties panel pulses on the affected property (synchronizes side panel state).

This entire loop runs in under 16ms per frame, every frame, no skipped frames.

### Drag end (mouseup)

1. Final value committed.
2. Layer 4 produces the AST diff.
3. Layer 5 Track B applies diff to AST, re-serializes, updates source.
4. Iframe verifies: re-renders the affected portion from the new source. Compares to Track A optimistic state. If match: done, no visible change. If mismatch (rare): smoothly animates from Track A state to canonical state over 150ms.
5. Undo stack: single new entry pushed with the diff and its description.
6. Toast: "Width: 200 → 248" briefly visible (1.5s).
7. Visual feedback fades: drag overlay, opacity dimming, elevation, all return to selected state.
8. Pointer capture released.

### Drag cancel (Escape during drag)

1. Track A reverts: direct DOM mutation restores element to drag-start state.
2. No diff produced. No AST change. No undo entry.
3. Visual feedback fades immediately.
4. User is back exactly where they started.

This is critical and frequently broken in editors. Test it specifically.

### Drag interrupt (code edited mid-drag, very rare)

1. Track A reverts to drag-start state.
2. Drag aborts.
3. User sees a small notice: "Drag canceled, code was edited."
4. New AST is processed normally.

## Snapping System

Snapping is the difference between "feels precise" and "feels sloppy."

### Snap target categories

Computed at drag-start, cached:

**Grid snaps**: multiples of 4 and 8 (most design systems use these scales). Always available for size/position drags.

**Common values**: 16, 24, 32, 48, 64, 96, 128, 160, 192, 240, 256, 320, 384, 480, 512, 640, 768, 1024. Always available for size drags.

**Sibling snaps**: every edge of every visible sibling becomes a target. Top, right, bottom, left, plus center horizontal and center vertical. For size drags: sibling widths and heights (so user can match a sibling exactly).

**Parent snaps**: parent's content area edges (inside padding), parent's full edges (outside padding). 25%, 33%, 50%, 66%, 75%, 100% of parent.

**Cross-section snaps**: edges of any visible element on the page, not just siblings. Useful for aligning to elements in different sections.

**Recent value snaps**: the last 5 values the user resized to in this session. "Sticky" so repeated similar resizes lock to consistent values.

**Baseline snaps**: text baseline alignment with adjacent text elements. Subtle but transformative for typography precision.

### Snap visual feedback

When a snap is active:

- A 1px guide line renders showing what was snapped to
- Color codes: green for sibling snaps, blue for parent snaps, gray for grid snaps, purple for baseline snaps
- The cursor label shows the snap reason: "Width: 320px (matches sibling)" or "Width: 256px (8 × 32)"
- Single guide at a time, the strongest snap. Don't confuse with multiple visible snaps simultaneously.

### Snap strength

- Snap zone: 4px. Within 4px of a target, value snaps.
- Unsnap zone: 8px. To leave a snap, must drag 8px past it.
- This asymmetry creates a "click into place" feeling without being frustrating.

Cmd held during drag disables all snapping. Free positioning. Standard escape hatch.

### Smart snap suggestions

When user drags near multiple snap targets, the system picks the most likely intended one based on:
- Distance (closest wins, with hysteresis)
- Recency (recently used snap targets weighted higher)
- Type priority: sibling > parent > common value > grid

Single primary snap shown. Secondary snaps available via Tab during drag (advanced, optional, not required for usability).

## Constraint System

Constraints prevent the user from accidentally creating broken layouts.

### Hard constraints (system enforces, with feedback)

Width below min-content (text would overflow): cursor stops, label shows "Min: 80px (text wrap)", element bumps with subtle elastic resistance. User can't push past unless they remove the offending content.

Padding negative: impossible, value clamps at 0.

Margin negative collapse: allowed (negative margin is valid CSS), but shown with warning indicator.

Element fully obscured (width or height = 0): allowed temporarily during drag, but on release if zero, snaps back to minimum visible size. Prevents lost elements.

Element dragged outside viewport: tracking continues, label shows "Off-canvas: -200, 50". On release, if element is fully off-canvas with no way to retrieve, system asks: "Element is hidden. Keep position?" with revert option.

### Soft constraints (system warns, allows override)

Touch target below 32px on interactive elements (buttons, links): warning indicator on element, label note "Small touch target".

Text below 12px: warning, label note "May be hard to read".

Image aspect ratio distorted significantly: warning indicator, label note "Aspect distorted (was 16:9)".

Color contrast below WCAG AA: when changing colors, contrast warning if dropped below 4.5:1 against background.

Element overflowing parent: visual indicator (red dashed outline) but allowed.

### Constraint configuration

Each user can adjust constraint thresholds in settings. Some users want strict accessibility constraints (touch target 44px); others don't care. Defaults are sensible (industry-standard accessibility), but configurable.

Per-element override: right-click → Properties → "Disable constraints" for elements where the user knows what they're doing (a decorative spacer doesn't need touch-target warnings).

## Reorder and Reparent System

Moving elements is hard. Most editors get this wrong. Here's the robust version.

### Reorder (within same parent)

User drags the position handle of a flex/grid/block child. System detects: drag is constrained to the parent's flow direction. Sibling elements display "ghost" insertion zones between them.

As cursor moves, the ghost zone closest to cursor highlights. Other siblings smoothly animate to make space at that position. The dragging element follows cursor with a slight offset, showing it's "lifted."

On drop:
- AST diff: MoveNode change, element repositioned to target index in parent's children
- Element drops into position with smooth landing animation
- Layout recalculates, settles within ~200ms

If user releases over no valid drop zone: drag cancels, element returns to origin.

### Reparent (across containers)

User drags the position handle, mouse crosses a parent boundary. System detects: drag has left the original parent's bounds.

Eligible drop targets highlight as cursor moves over them. Eligibility is determined by:
- Container can accept children (not a leaf node)
- No deep nesting issues (can't drop element into one of its own descendants)
- No semantic conflicts (can't drop a `<section>` inside a `<button>`)

Each eligible target shows:
- Outline in green (accept) or red (reject with reason)
- Insertion indicator showing where in the target's children the element will land
- Tooltip if conflicts: "Layout will change: flex-grow removed (parent is not flex)"

On drop:
- AST diff includes:
  - MoveNode: element moves to new parent at insertion index
  - RemoveStyle: properties incompatible with new parent context (e.g., `flex: 1` if new parent isn't flex)
  - SetStyle: properties needed to maintain reasonable behavior in new context
- A multi-step undo entry: "Move card from Hero to Features"
- Visual notification briefly summarizes changes: "Moved to Features section. Removed: flex-grow."

Notification has a "details" expansion that lists every property change made. Power users can verify; vibecoders can ignore.

If user wants to keep all properties even if they don't apply: hold Alt during drop. System keeps every property, even if some become inert. Useful when user knows they'll restructure further.

### Cross-document moves (Phase 2 of reparent)

User drags an element to the page navigator panel, drops on a different page. Element moves to that page's tree. AST is multi-page; this is supported but requires the page navigator UI which is a separate spec.

## Multi-Element Operations

Selection of multiple elements enables coordinated edits. Two primary modes:

### Coordinated drag

User has 3 elements selected, drags one of their size handles. By default, all 3 elements get the same delta (move +24px on width). Cursor label: "Width: +24px (3 elements)".

Hold Shift: all selected elements become the same value (all 248px). Label: "Width: 248px (3 elements, matching)".

Hold Cmd+Shift: proportional. Each scales by the same ratio. Label: "Scale: 120% (3 elements)".

The dragged element is the "anchor" (the one whose value the user is directly setting). Other selected elements derive their values from the anchor's behavior + mode.

### Distribute and align (non-drag)

Right-click on multi-selection:
- Align: left, right, center horizontal, top, bottom, center vertical
- Distribute: evenly horizontal, evenly vertical, equal gaps horizontal, equal gaps vertical
- Match: width, height, both

Each operation is one diff with multiple SetStyle changes. Single undo entry.

### Group operations

Right-click → Group: wraps selected elements in a parent `<div>` (or `<section>` if at top level). Diff: WrapNode for each, MoveNode to new wrapper, InsertNode for the wrapper.

Right-click → Ungroup: opposite. UnwrapNode: parent is removed, children take its place in grandparent's children list.

Right-click → Make Component: converts selection to a reusable component. The component is added to the user's library (in Phase 3 with persistence; in Phase 1 of this system, lives in session). Future inserts of this component create linked instances.

## Component Instance System

When user inserts the same component multiple times, the system can link the instances so editing one edits all. Inspired by Figma components.

### Linking model

When a component is inserted from the library:
- The component's structure is added to the AST as a tree
- A `data-dropin-component` attribute marks the root with the component's library ID
- An additional `data-dropin-instance` attribute marks the root with a unique instance ID

If the user inserts the same component again, both instances share the component ID but have different instance IDs.

The user can choose: "Linked instances" (default for components) or "Standalone copies" (default for ad-hoc duplicates).

For linked instances, edits propagate based on a per-property propagation policy:
- Layout edits (position, in some cases size): per-instance (each instance can be in a different layout)
- Style edits (color, font, radius): propagate to all instances
- Content edits (text, image src): per-instance (different cards have different content, that's the point)

The propagation policy is configurable per instance: user can right-click → "Detach from component" to make the instance standalone, or "Push changes to component" to update the component definition with current local edits.

Visual indicator: linked instance shows a small icon in the corner of its outline. Color indicates state:
- Green: in sync with component
- Yellow: has local overrides
- Red: drifted significantly from component

Click the indicator to inspect overrides and push/pull changes.

### Symbol vs Instance distinction

Inspired by Figma's main component vs instance distinction. There's one "primary" instance (the one the user dragged into the library, or the first instance) which is the source of truth for the component. Other instances inherit from it.

Editing the primary updates all instances (style propagation policy). Editing a non-primary creates local overrides on that instance only.

User can promote any instance to primary via right-click. Clear explicit action, no surprises.

This is the highest-leverage feature for site editing. Vibecoders building landing pages reuse cards, buttons, and sections everywhere; component instancing means edit-once, apply-everywhere.

## Undo, Redo, and History

Single source of truth: a stack of AstDiffs with their inverses.

### Undo behavior

- Cmd+Z: pop top diff, apply its inverse
- Cmd+Shift+Z: re-apply the popped diff (redo)
- Stack depth: 200 entries default, configurable to 500 max
- Each user gesture creates one entry, regardless of internal complexity (a drag with snapping is one entry, not 50)
- Direct code edits create one entry per "save" event (debounced 1s after last keystroke)

### Coalescing rules

Some entries combine if they meet criteria:
- Same property, same element, within 500ms: coalesce into one (rapid clicks on a number stepper, multiple drags for fine adjustment)
- Different properties on same element within a single drag: one entry (multi-property drag)
- Different elements: never coalesce (independent operations)

### History panel (optional, advanced users)

Off by default. When enabled, shows the diff stack as a list. Each entry shows description and timestamp. User can click any entry to revert to that point. Clicking entry N applies the inverses of entries N+1, N+2, ... back to current. Clicking again restores.

This panel is for users who want time-travel debugging. Most vibecoders never need it. Cmd+Z is enough.

### Branched history (post-MVP)

Advanced: when user undoes several steps and then makes a new change, the redone branch is preserved. Tree structure rather than linear stack. UI shows the branches and lets user switch. Inspired by Emacs/Vim. Skip for MVP, plan as future addition for power users.

## Keyboard System

Comprehensive keyboard shortcuts. The keyboard is faster than the mouse for power users, and vibecoders learn shortcuts faster than tutorials suggest.

### Selection

- Click: select
- Shift+click: add to selection
- Cmd+click: toggle in selection
- Tab: next sibling
- Shift+Tab: previous sibling
- Escape: parent (climb tree)
- Cmd+A: select all siblings
- Cmd+Shift+A: select all on page

### Movement (with element selected)

- Arrow keys: move element by 1px in direction (or reorder if in flex/grid)
- Shift+arrow: move by 8px (grid step)
- Cmd+arrow: move by 32px (large step)
- Cmd+Shift+arrow: send to edge of parent

### Sizing

- =/+: increase size by 1px (last drag axis)
- -: decrease by 1px
- Shift+=: increase by 8px
- Shift+-: decrease by 8px

### Operations

- Cmd+C: copy element to clipboard (as JSON, with optional HTML/CSS export)
- Cmd+V: paste at cursor position
- Cmd+X: cut
- Cmd+D: duplicate (places copy adjacent to original, with smart offset)
- Cmd+G: group selection
- Cmd+Shift+G: ungroup
- Delete/Backspace: remove selected
- Cmd+Z / Cmd+Shift+Z: undo / redo
- Cmd+S: save (auto-saves usually, this forces and confirms)

### View

- Space+drag: pan canvas
- Cmd+0: fit page to viewport
- Cmd+1: 100% zoom
- Cmd+2: fit selection
- Cmd+/: toggle layers panel
- Cmd+': toggle code panel
- Cmd+.: toggle properties panel
- Cmd+Shift+P: command palette (typeahead all commands)

### Modes

- E: switch to edit mode
- P: preview mode (no chrome)
- F: full screen preview

### Tools (during drag)

- Shift: aspect lock / additive selection / grid step
- Alt/Option: symmetric resize / duplicate-on-drag / detach-from-component
- Cmd: free positioning (disable snap) / inspect mode
- Ctrl: alternate behavior per tool

All shortcuts are configurable in settings. Vim users get Vim-style nav as a built-in alternative scheme.

## Properties Panel

The right panel showing properties of the selected element. Designed for vibecoder cognition: 6-8 essential controls visible, "More" expanding to power-user options.

### Default sections per element type

**Text element**:
- Content (inline editor preview)
- Font (family selector with live preview)
- Size (slider + number)
- Weight (visual weight picker)
- Color (palette swatches + picker)
- Alignment (left/center/right/justify icons)
- Spacing (line-height + letter-spacing sliders)
- More: text-transform, text-decoration, font-variant, white-space, word-break

**Container element (div, section)**:
- Layout (flex/grid/block toggle, live preview)
- Direction (row/column for flex, columns/rows for grid)
- Gap (slider)
- Alignment (justify + align visual grid)
- Padding (4-direction visual control)
- Background (color/gradient/image picker)
- Border (width + style + color)
- Radius (4-corner visual control with link toggle)
- Shadow (preset row + custom)
- More: overflow, position, z-index, transform

**Button**:
- Text content (inline editor)
- Link (URL field with autocomplete from page anchors)
- Background (color/gradient)
- Text color
- Padding (visual)
- Radius
- Hover state (toggle to edit hover styles separately)
- More: cursor, transition, focus state, disabled state

**Image**:
- Source (with replace button → opens Media panel)
- Alt text
- Object fit (cover/contain/fill icons)
- Aspect ratio
- Filter (presets + custom)
- More: lazy loading, srcset, decoding

**Icon (SVG)**:
- Icon source (with replace button → opens Icons panel)
- Size (slider)
- Stroke width
- Color (uses currentColor by default, can override)

**Video**:
- Source (with replace button → opens Media panel)
- Poster image
- Controls (autoplay, loop, muted, controls toggles)
- Object fit

### Visual controls

Every control is visual-first, numerical-fallback. Examples:

- **Padding/margin**: 4-sided visual control. Click a side to focus, drag a slider, or type. Center has "all sides" master control. Link icon to toggle symmetric/independent.
- **Color**: row of swatches showing current palette + recent + favorites. Click any to apply. Click "more" for full picker (HSL/RGB/Hex tabs, eyedropper).
- **Shadow**: row of preset thumbnails (each a tiny box with the shadow rendered). Click to apply. "Custom" opens a builder with offset, blur, spread, color sliders.
- **Border radius**: 4-corner visual control with linked/unlinked toggle. Slider per corner or per pair.
- **Font picker**: typeahead with live preview rendered for each option. Recent fonts at top. Filter by category (sans/serif/mono/display).
- **Spacing scales**: where appropriate, controls snap to design tokens (4, 8, 12, 16, 24, 32...). Override with custom values.

### Mixed values

When multiple elements selected, each control shows the value if all elements share it, or "Mixed" placeholder if they differ. Editing the control sets the value on all selected.

### Advanced toggle

"More" expansion in each section reveals the full CSS surface for power users. Hidden by default. Persists per-user-per-element-type (if user opens "More" on text, it stays open for all text elements).

### Inline editing in canvas

For text content, font, color, and size: inline editing in the canvas is preferred over panel editing. Double-click text to edit content. Click and start typing. Use floating toolbar that follows cursor for font/color/size changes.

This is the bypass for users who don't want to look at the panel. The panel is always available; the canvas-inline path is faster for common edits.

## Code Panel Coexistence

The code panel is a sliding panel, not a separate mode. Always available, off by default.

When open:
- Shows the source code synced with the AST
- Edits in the code panel parse to AST changes (incremental)
- Edits in the visual canvas serialize to code (described in Layer 5)
- Both views are live-synced

### Synchronization

A single AST is the truth. Both views are projections.

When code panel changes:
- Incremental parse runs as user types (debounced 100ms)
- AST diff between old and new is computed
- IDs preserved by structural matching
- Selection persists if selected element still exists in new AST
- Iframe re-renders affected portions

When visual canvas changes:
- Diff applied to AST
- Source serialized
- Code panel highlights changed lines briefly (subtle background flash)
- User sees the connection: "I dragged that, here's what changed in code"

This bidirectional sync is the Webflow trick that makes the tool feel coherent. Most editors break it; doing it right takes care.

### Conflict handling

Rare but possible: user is dragging in canvas while code panel has focus and types. Drag wins (drag is in progress, has priority). Code panel changes queue until drag ends, then apply.

Or: user clicks in code panel while canvas has a selected element with active inline editor. Canvas commits its changes first, then code panel takes focus.

Predictable rules: whichever surface received the most recent gesture has priority for the next operation.

## Visual Polish

A list of details that distinguish robust from sloppy:

### During selection

- Outlines render at exact pixel boundaries (no anti-aliasing fuzz)
- Element label uses a precise font (system UI font at 11px, slightly bolder, with a subtle background pill so it's readable on any element)
- Hover outline appears within 50ms of mouseover, disappears instantly on mouseout
- Selection outline animates in (50ms ease-out scale from 0.95 to 1.0)
- Multi-selection bounding box uses dashed stroke at 4px dash, 2px gap pattern, slow march animation (3s per cycle, subtle)

### During drag

- Element being dragged has a subtle elevation: 0 4px 12px rgba(0,0,0,0.12) shadow
- Dimming of non-dragged elements: opacity 0.7 with 100ms transition
- Cursor label has a subtle background blur and slight drop shadow for readability over any content
- Snap guide lines: exactly 1px width (no Retina doubling), accent color at 90% opacity
- Constraint warnings flash briefly when first hit, then settle to persistent indicator

### During reorder/reparent

- Ghost outline of element follows cursor with 8px offset (so cursor doesn't obscure it)
- Insertion zones smoothly grow when cursor approaches, smoothly shrink when cursor leaves
- Sibling elements animate with spring physics (slight overshoot and settle) when making space
- Drop target outline pulses subtly to confirm "yes, drop here works"

### During property change

- The affected element pulses briefly when a property changes from the panel
- The properties panel highlights the changed control (1s background fade)
- If the change resulted from a constraint trip, a small icon appears next to the control with hover details

### Transitions everywhere

Every state change animates. Selection appears smoothly. Handles fade in/out. Snap lines slide into position. The whole tool feels alive without being noisy.

Standard timing curve: cubic-bezier(0.2, 0, 0, 1), 150ms for most things, 100ms for fast feedback, 250ms for camera/zoom changes. Consistency across the tool.

## Performance Targets

For the system to feel native:

- Click to selection visible: under 50ms
- Hover to outline visible: under 50ms
- Drag start to first visual update: under 16ms (single frame)
- Mouse move to visual update during drag: under 16ms (every frame, 60fps minimum, 120fps on capable displays)
- Drag end to AST commit: under 100ms
- AST commit to code panel update: under 200ms
- Property panel control change to canvas update: under 50ms
- Tab switch in property panel: under 100ms
- Iframe re-render after structural change: under 500ms (acceptable, but rare)

To hit these:
- Track A optimistic updates never wait on AST work
- AST diffs apply incrementally; full re-render is the exception
- Hit testing uses a spatial index (R-tree) for elements, updated on layout changes
- Snap targets are precomputed and cached at drag-start
- Layer 2 layout context is cached per-element, invalidated on layout events only

The system runs at 120fps on a 2020 MacBook Pro with a 1000-element page. That's the minimum bar for "feels professional."

## Telemetry and Observability

The system logs:

- Every drag's intent (resolved Intent object) for replay
- Every snap hit (which target type, which value)
- Every constraint trip (which constraint, which value, whether soft or hard)
- Every AST diff applied (operation, elements affected)
- Track A vs Track B mismatches (these are bugs)
- User cancellations (Escape during drag) – measures confusion
- Undo invocations within 5s of an operation – measures regret
- Property panel control opens, expands of "More" – measures discoverability

This data goes to a self-hosted analytics endpoint. Used to find UX failures, layout edge cases, and bugs in production. Not optional. Without telemetry, you can't fix what you can't see.

User can opt out in settings. Default is on, with clear privacy disclosure.

## Accessibility

The editor itself must be accessible:

- All shortcuts have non-modifier alternatives accessible from keyboard
- Selection state is announced to screen readers (live region updates)
- Property panel controls all have proper labels and ARIA attributes
- Color picker has hex input as primary (works for users who can't see colors well)
- Constraint warnings include text descriptions, not just visual indicators
- Drag operations have keyboard equivalents (arrow keys for nudge, modifiers for size)
- Focus management: Tab cycles through panels, controls, then handles in canvas
- Focus visible at all times, custom focus styles match the editor's accent color

Beyond the editor's own accessibility, the editor encourages accessible output: contrast warnings, touch target warnings, alt text prompts on image insertion, semantic HTML suggestions.

## What This System Avoids

A list of things explicitly NOT built, because they cause more problems than they solve:

- **A free-form canvas where elements can be positioned absolutely with no layout context.** This is the Figma model and it's wrong for web. Web is constrained by responsive layout. Free positioning produces beautiful designs that break on every screen size. The system enforces layout-awareness; absolute positioning is supported but not encouraged.

- **Auto-layout suggestions that the user didn't ask for.** No "should this be flex?" prompts. The user picks layout in the property panel; the system doesn't second-guess.

- **AI-generated layouts triggered by drag operations.** Drag does what drag means. AI is a separate, opt-in feature. Mixing them creates unpredictable behavior.

- **Snap-to-everything by default.** Snapping helps when targets are intentional. Too many snaps create chatter (cursor jumping between targets unpredictably). Curated snap targets only.

- **Live collaboration in the same canvas (multi-cursor).** Out of scope for the editing system. Belongs in a versioning/sync layer if added later.

- **Time-based animations as part of editing.** Animation editing is a separate tool. The editor handles static states; animation is configured via property panel for transitions, but not "playable" in the canvas.

- **A separate "design mode" vs "code mode."** Both are always available. The user is always editing the same artifact through different views.

- **Hidden or implicit conversions.** When the system converts a property (clamp() to fixed, % to px, class to inline), it tells the user. Always. Silent conversions are how trust dies.

## Phasing

Realistic phased delivery:

**Phase 1: Foundation (8-10 weeks)**
- Layer 1 (AST): `@babel/parser` + `@babel/types` for JSX/TSX (NOT swc), PostCSS for CSS, parse5 for HTML (already installed). `data-dropin-id` OID injection via parse-time Babel walk per "Stable node identity" above.
- Layer 2 (LayoutInspector): full implementation. ResizeObserver/MutationObserver hooks.
- Layer 5 (Renderer): Track B only — Track A is deferred to Phase 2 (no drag yet, so the optimistic-paint path isn't exercised).
- Selection model keyed by `data-dropin-id`.
- Basic hit testing with selectable groups.
- Undo stack with `magic-string`-based diff history.
- **Multi-line `import` statement stripping** in the iframe IIFE wrapper. Currently broken (`lib/preview.ts` only strips single-line imports; multi-line imports cause a Babel parse error). Phase 1 fixes this as part of the AST work because the OID walker already handles imports correctly.
- **Parse perf budget** measured and documented. Target: <30 ms p99 for `@babel/parser` on JSX files up to 1000 lines. Benchmark against the existing 30 shipped templates; the slowest gets a specific call-out. Fallback strategy: if the parse runs over budget twice in a row during hot typing, switch to `onBlur` parsing with a visible indicator ("Parsing paused while typing…"). **Visible degradation, not silent.**
- **CSP for the preview iframe.** Inject `<meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self'">` into `srcDoc`. Prevents the playground iframe from being framed elsewhere or escaping the parent shell. Document XSS-in-the-playground as accepted risk: vibecoders paste arbitrary code, the iframe runs it, that's the entire product. The CSP is about isolating the preview from third parties, not sanitizing the user's own code.
- **Expression-aware selection — cheap Phase 1 stub (~30 LOC).** In `lib/source-patch-jsx.ts` `setAttrInOpening`'s `case "expr":` branch: when `key === "className"`, short-circuit to `unchanged(source, "className is dynamic — edit not applied")`. Inspector surfaces the `PatchResult.reason` as a non-blocking warning toast. Stops the silent destruction of `cn(...)` / template-literal / CSS-Modules expressions today. Full classifier ships in Phase 4.

End of Phase 1: user can select elements, see them, do non-destructive single-attribute edits on static expressions, and undo. Multi-line imports work. Parse perf is measured and bounded. No drag yet.

**Phase 2: Resize and Spacing (4-6 weeks)**
- Size handles (corners and edges)
- Padding handles
- Margin handles
- Intent resolver for these handle types
- Snap system (grid, common values, sibling, parent)
- Constraint system (min-content, parent edges, touch target)
- Drag lifecycle with all visual feedback
- Properties panel sections for spacing and sizing

End of Phase 2: user can resize elements and adjust spacing with full robust handling.

**Phase 3: Position and Reorder (4-6 weeks)**
- Position handles
- Reorder within parent (flex, grid, block)
- Reparent across containers
- Drop targets and indicators
- Property cleanup on reparent
- Multi-select coordinated drag

End of Phase 3: user can move elements anywhere, robustly.

**Phase 4: Properties, Class Engine, Asset Insertion, Polish (6-8 weeks)**

- Full properties panel for all element types
- Inline canvas editing (text, font, color)
- Visual controls (4-direction padding, swatch picker, shadow presets)
- Color picker with palette integration
- Code panel bidirectional sync
- Keyboard shortcuts comprehensive

**Tailwind class manipulation (the "Class Engine" — built on `tailwind-merge`, NOT a custom 5-stage pipeline):**

The custom lex/resolve/merge/generate/JIT pipeline pitched in earlier drafts duplicates work mature libraries already do. Three of the five stages are free:

- **lex / merge / conflict resolution** — `tailwind-merge` handles every utility-group conflict (`p-4` + `p-6`), modifier conflict (`hover:bg-red-500` + `hover:bg-blue-500`), arbitrary-value conflict (`bg-[#fff]` + `bg-[#000]`), `!important` postfix, stacked modifiers. ~7-8 KB gzipped, built-in 500-entry LRU cache.
- **JIT for utility classes** — Tailwind CDN's `MutationObserver` (`{ attributes: true, attributeFilter: ['class'], childList: true, subtree: true }`) auto-detects new classes added to the DOM at runtime and generates CSS for them. Free.

What we actually build (~300 LOC total):

1. **`cn` helper** — five lines: `function cn(...inputs) { return twMerge(clsx(inputs)) }`. shadcn pattern.
2. **AST-aware className patcher** (extension of `lib/source-patch-jsx.ts`) — Onlook's [`packages/parser/src/code-edit/style.ts`](https://github.com/onlook-dev/onlook/blob/main/packages/parser/src/code-edit/style.ts) `addClassToNode` pattern. Recognizes `StringLiteral`, `JSXExpressionContainer > StringLiteral`, and `CallExpression` where `callee.name ∈ {cn, clsx, classnames, cx, cva, twMerge, tw}`. For `CallExpression` it pushes the new class as an additional `t.stringLiteral(...)` argument — preserves the cn() call structure and any conditional logic. ~150-300 LOC of `@babel/types` glue.
3. **Theme token reader** — call `resolveConfig()` from `tailwindcss/resolveConfig` host-side once, expose `getColor('brand')`, `getSpacing('4')`, etc. for the color picker / spacing slider. ~40 LOC. **Required for the token-first style path** (see "Three style paths" below).

**Hard pin: `tailwind-merge@2.6.0`.** Version 3.x targets Tailwind v4 only; we are pinned to Tailwind 3.4.x (`package.json:42`). Do not auto-upgrade. Tailwind v4 migration is its own decision, separately scoped.

**Three CDN gotchas — documented constraints, not bugs to fix:**
1. **FOUC on first paint of any newly-introduced class.** The CDN's MutationObserver detects the class then async-generates CSS — there's a frame or two of unstyled paint before the rule lands. There's no preempt-from-outside-the-iframe API. If we ever need flash-free runtime class additions, the alternative is host-side compile (`postcss + tailwindcss` programmatically, ~50-200 ms per unique class) and inject the resulting rule into the iframe via postMessage. Heavier, but eliminates FOUC. Defer until it actually bites.
2. **"Seen-class" race condition** (`tailwindlabs/tailwindcss#14486`) — under heavy initial mount, a class can be marked "seen" while never producing a rule. Document; don't fix (upstream issue).
3. **`<style type="text/tailwindcss">` `@apply` / `@layer` runtime injection does NOT trigger.** Already handled at boot in `lib/preview.ts:541-595` (`extractTailwindCssStyles`). Runtime addition of new `@apply` blocks won't generate CSS. **The properties panel can generate utility classes, NOT `@apply` rules at runtime.** Hard constraint.

**Three style paths (rename of the v1 scope chip — same architecture, cleaner labels):**

The chip "This change applies to: [▾]" exposes three paths:
- **token-first** — edit a CSS variable / Tailwind theme token (`--primary`, `colors.brand`). Affects every consumer. The palette use case lives here.
- **class-first** — edit the rule for a class (`.btn-primary`). Affects every element with that class.
- **override-first** — write an inline `style="..."` on this element only. The default for vibecoders ("I changed *this* card").

Default is **override-first**. The expression-aware selection classifier (below) determines which of the three are *enabled* for the currently-selected element — see "Expression-aware selection" for the disabled-with-explanation logic.

**Expression-aware className selection — full classifier (~120 LOC):**

The Phase 1 stub stops silent destruction. Phase 4 ships the real classifier. AST taxonomy:
- **Static** — `StringLiteral` or `JSXExpressionContainer > StringLiteral` or `TemplateLiteral` with no `expressions`. All three style paths enabled. Default writes className.
- **TemplateDynamic** — `TemplateLiteral` with `expressions.length > 0`. Editable iff user only changes static quasis.
- **UtilityCall** — `CallExpression` where `callee.name ∈ {cn, clsx, classnames, cx, cva, twMerge, tw}`. **"override-first" enabled and means "append to cn()".** "class-first" disabled (no single class to edit).
- **Conditional** — `ConditionalExpression` or `LogicalExpression`. Classify both branches recursively.
- **CssModules** — `MemberExpression` where `object.name === 'styles'`. Read-only — the actual class is in a `.module.css` file.
- **Opaque** — `Identifier` / `MemberExpression` referring to props / state / function calls. **"override-first" enabled and means "inline style override".** Other paths disabled with hover text "This element's class is computed dynamically — only inline overrides apply."

**One chip, two-axis information** (scope path × expression shape) encoded as enabled/disabled options + tooltip. Not two stacked chips.

**Asset Insertion (promoted to a named Phase 4 deliverable, builds on existing implementation):**

The asset library is already 80% built — `lib/asset-library/` (12 insert helpers), `components/library/` (4-tab Sidebar shell with 15 sub-panels), `public/data/assets/` (pre-bundled JSONs: lucide 576KB, emoji 211KB, heroicons 297KB, phosphor ~600-870KB per weight, tabler 2.3MB, simple-icons 4.8MB, palettes 50, fonts ~100, gradients 50, shadows 30, mockups 8, undraw 15, decorative-svgs 17). API proxies for Unsplash/Pexels with structured 503 + `setupNote` empty-state. IndexedDB recents via `idb`. Phase 4 finishes the polish:

- Universal `Cmd+K` search across all asset panels (was backlog item #2)
- Click-to-replace mode wiring (selected element's `<img>` / `<svg>` / icon → replace from panel)
- Favorites / pinning per asset kind
- Registry pattern refactor for the 5 icon panels (Lucide / Heroicons / Phosphor / Tabler / Simple-Icons share boilerplate)
- Cross-asset-kind global recents
- AI Generate tab (gated on Layer 6 shipping; "Generate icon: [prompt]" → Sonnet → preview → insert)

End of Phase 4: full editing capability, vibecoder ready. The properties panel has token-first / class-first / override-first chips wired correctly per element. The Class Engine handles every Tailwind manipulation through `tailwind-merge` + AST-aware className patching. Asset insertion is `Cmd+K`-fast across all panels.

**Phase 5: Components and Symbols (3-4 weeks)**
- Component instance system
- Linked instances with override tracking
- Per-property propagation policies
- Make Component / Detach / Push Changes flows

End of Phase 5: user can build with reusable components, edit-once-applies-everywhere.

**Phase 6: Multi-Element Operations (2-3 weeks)**
- Distribute and align
- Group / ungroup
- Match width/height/both
- Multi-element coordinated drag modes

End of Phase 6: power-user operations available, page-level editing efficient.

**Phase 7: Edge Cases and Polish (ongoing, 6+ months minimum)**
- Text font-size handles (vs width)
- Image aspect ratio handling
- CSS variable awareness
- Locked elements, hidden elements, pseudo-elements
- Grid spanning, complex grid layouts
- Inheritance handling (class vs instance edits)
- Telemetry-driven bug fixes

End of Phase 7: edge cases handled, the system is "robust" in the real-world sense.

**Total: 6-9 months for the full system. Less if scope is reduced; more if quality bar is raised.**

This is the realistic timeline for a Figma-grade editing system. There is no shortcut. Anyone selling "live editor" features in less time is shipping the broken version that handles 60% of cases and falls apart on the rest.

## What This Gets You

When this is done:

- A vibecoder lands on the editor and can build a site by manipulating it directly. They never see broken code. They never lose work. They never wonder what just happened.
- A developer using the same tool can edit code freely; their edits coexist with visual edits without conflict.
- Edge cases that break other editors (flex-grow children, grid spanning, percentage widths, inherited properties, CSS variables) work correctly here.
- Performance is native-feeling. No lag, no jank, no waiting.
- The tool is unique. No other "live preview editor" in the consumer/vibecoder space has this level of robustness. Webflow is in the design tool space; Framer is design-first; v0 is generation-first; this would be vibecoder-first with the polish of professional tools.

The moat is not a feature. It's the polish at the edges. Most teams don't ship this because most teams underestimate it. Shipping this is the differentiator.

## Implementation Toolchain (2026-04-28, revised after research)

The original draft of this spec called for swc, structural-path hash IDs, and raw `postMessage` tagging. After researching production direct-manipulation editors (Onlook, Plasmic, Builder.io, Webflow, Figma, Tempo Labs, tldraw, react-moveable, Floating UI) the toolchain is **revised**. The locked configuration in the next section still stands; what changed is the libraries/approaches that satisfy it.

### Parser: `@babel/parser`, NOT `@swc/wasm-web`

- **Why the spec called for swc:** "Rust, fastest in class."
- **Why the actual choice is Babel:** swc-wasm-web is ~5-10 MB WASM with a mandatory `await init()` before first parse — fatal for a keystroke-grain re-parse loop. Babel parser is 78 KB gzip, **synchronous**, ships with `plugins: ['typescript', 'jsx', 'decorators']`, and parses a 200-800 line component in <5 ms. Already in `package.json` (`@babel/parser`, `@babel/types` added 2026-04-27).
- **Reference:** Onlook (`github.com/onlook-dev/onlook`) is the only OSS direct peer (open-source AI visual editor for React). Their `packages/parser/package.json` ships `@babel/standalone` + `@babel/types` — no swc, no recast, no tree-sitter.
- **Fallback if perf demands it later:** swc is a Phase 3+ swap if and only if profiling shows Babel is the bottleneck on real templates. Bet against it.

### Serialization: `magic-string` for the write layer (recast only for structural rewrites)

- **The hard rule:** the round-trip `print(parse(src)) === src` MUST hold for no-op edits, or the user sees their formatting "scrambled" after every interaction.
- **What does NOT satisfy this:**
  - `swc`'s printer — full reformat, drops formatting.
  - `@babel/generator` even with `retainLines: true` — still reformats unmodified subtrees.
  - `recast` — best-in-class for structural codemods, but has documented JSX whitespace bugs (recast issues #365, #167, #1386). The roundtrip identity does not hold when JSX has internal comments.
  - `tree-sitter` — has no pretty-printer at all (concrete syntax tree, designed for highlighting/incremental edit).
- **What does:** `magic-string` (6 KB gzip, by Rich Harris). Operates on byte ranges from `node.start` / `node.end` (Babel adds these natively). No-op = empty patch list = original string returned literally. This is what Vite, Svelte, Vue, Rollup all use for HMR transforms.
- **Hybrid pattern:** parse with `@babel/parser` to locate the edit target (gets `.start` / `.end` offsets) → `magicString.overwrite(start, end, newText)` → `toString()` returns source with all unedited bytes byte-identical. Reserve full AST-mutation + recast for the rare "extract component / wrap in parent / move subtree" operations. Even then, scope recast to the *single function body* being rewritten — never the whole file.

### Stable node identity: parse-time Babel walk, NOT a build-time SWC plugin

- **The hard rule:** an element's identity must survive source edits that don't delete it (rename, sibling insert, attribute change, formatter pass).
- **What fails:**
  - **Structural-path hash** (`Program.body[2].div[0].p[3]`) — fragile: any sibling insert renumbers every neighbor.
  - **Content hash** — collides on duplicate elements (`<li>` × 5).
  - **Source-range IDs** like the existing `data-dropin-loc="line:col:line:col:openEndLine:openEndCol"` — invalidated by every keystroke that shifts offsets. The current inspector mitigates with a 12-retry × 40 ms reselect, which is a hack around the wrong primitive.
- **What works:** **inject opaque random IDs as JSX attributes during parse, in the editor runtime, in pure JS.** A `@babel/parser` + `@babel/traverse` walk visits every `JSXOpeningElement`; if it has no `data-dropin-id`, generates a nanoid and pushes a new `JSXAttribute(JSXIdentifier('data-dropin-id'), StringLiteral(oid))`; if it has an invalid/duplicate one, regenerates. The OID is **part of the source** — survives re-parse trivially because it's literally a JSX attribute now. React passes `data-*` through, so the rendered DOM also carries the OID. Same string identifies the source node AND the rendered element. ~150 LOC of pure JS.
- **Strip OIDs** before exporting source for download or showing it to an LLM (`removeOidsFromAst`).
- **Reference implementation:** Onlook's [`packages/parser/src/ids.ts`](https://github.com/onlook-dev/onlook/blob/main/packages/parser/src/ids.ts) — 267 lines, ~8 KB, runs in editor runtime, uses `@babel/types` and `traverse`. Apache-2.0. Verified by direct file read 2026-04-28; their `packages/parser/package.json` ships `@babel/standalone` + `@babel/types` only — no `@swc/*` deps, and a recursive `git/trees` search of the repo returns zero `swc-plugin*` directories.
- **Migration path from existing `data-dropin-loc`:** the two attributes coexist for the entire Phase 1 → Phase 4 window. New system uses `data-dropin-id`; existing inspector continues using `data-dropin-loc`. Existing inspector retires only when the new system covers all of its functionality (Phase 4+).

#### Explicitly rejected: build-time SWC plugin OID injection

Pitched in earlier drafts as "what Onlook does." It is not what Onlook does (verified above), and it is structurally impossible for Dropin's primary path:

1. **No user-side build pipeline.** Dropin's flow is: user pastes JSX into a `<textarea>` → host parses it → preview iframe renders it via `Babel.transform`. There is no `next build` step the user ever runs. A build-time injector has no event to fire on for pasted code.
2. **SWC plugins can't run in the browser.** They are `.wasm` binaries loaded by `@swc/core`'s native host. They don't execute in a freestanding browser context the way Babel-standalone does. Running one server-side per paste means shipping a Rust-built WASM blob plus an `@swc/core` Node binding into a Vercel function, paying cold-start + memory cost, just to do `traverse + push attribute` — which the pure-JS Babel walker does in <5 ms in-browser.
3. **Pre-baking OIDs into our ~30 shipped templates is a non-fix.** Even if we did, the paste path (`/playground` and AI-generated source dropped into `/t/[slug]`) still needs the runtime injector. We'd be shipping and maintaining two implementations, strictly more code than today.
4. **SWC plugin ecosystem is still flagged "experimental"** in Next.js 16.2.4 (April 2026) under `experimental.swcPlugins`. ABI churn documented in `swc-project/swc#8315` ("Can't select a universal `swc_core` version") and recurring `vercel/next.js#89251` ("Mismatching @next/swc version"). Pinning the exact toolchain remains the official mitigation. Babel-standalone has been ABI-stable for years.
5. **Hidden cost:** a 150-LOC JS visitor is ~300 LOC of Rust crate (`Cargo.toml`, `lib.rs`, `swc_core::ecma::visit::VisitMut` boilerplate, `wasm32-wasi` target, prebuilt-binary cache management, new CI matrix entry). All to do what Babel already does in <5 ms.

If we ever want OIDs pre-baked into shipped templates to skip the first parse on `/t/[slug]`, do it as a `scripts/inject-oids.mjs` Node script that runs the same Babel walker over `templates/*/source.jsx` at build time and writes back. **Same code path, no SWC, no WASM, no experimental flag.**

### Iframe RPC: `penpal`, NOT raw tagged postMessage

- **The pain:** raw `postMessage` with `__akella: true` discriminators forces every caller to write request-response correlation by hand and every responder to write a switch-on-message-type.
- **The fix:** [`penpal`](https://github.com/Aaronius/penpal) (Aaronius), 3 KB MIT. Promise-based RPC: parent calls `iframe.someMethod(args)` and awaits a value. Onlook wraps it in their own `packages/penpal/` package "to facilitate rpc-style calls between preload and iframe." Plasmic, Builder.io, Figma Code Layers all moved past raw postMessage to typed RPC.
- Replace `lib/iframe-bridge.ts`'s `__dropin: true` tagging during Phase 1 implementation.

### Cross-iframe overlay positioning

- **Reference implementation:** [Floating UI's `autoUpdate`](https://floating-ui.com/docs/autoUpdate). Single shared rAF scheduler. `ResizeObserver` on tracked elements + iframe body invalidates the cached rect. `MutationObserver` filtered to layout-affecting attrs. Scroll listeners on `iframe.contentWindow` and every scrollable ancestor (passive, capture). Inside the rAF tick: read all rects in batch first, then apply all transforms — never interleave (layout thrashing).
- **Use `transform: translate3d(x, y, 0)`** (not `top/left`) to position overlays — GPU compositing, no per-frame layout. Round only for crisp 1px borders.
- **Coordinate combination:** `iframeRect.left + (elRect.left - iframeScrollLeft) * iframeScale`. The iframe's own `getBoundingClientRect` already accounts for any host-side `transform: scale()` on the iframe element — don't double-apply.
- **`position: fixed` inside iframe** is pinned to iframe viewport, not host. Walk ancestors detecting `getComputedStyle(el).position === 'fixed'` and skip the iframe scroll offset for those (or just use `getBoundingClientRect` from inside the iframe directly, which already returns iframe-viewport coords).

### Pointer capture across iframe boundary (Phase 2 prep)

The "cover technique," standard pattern:

```
on pointerdown (host overlay handle):
  handle.setPointerCapture(e.pointerId)
  iframe.style.pointerEvents = 'none'   // events sail past iframe to host overlays
on pointerup / pointercancel / lostpointercapture:
  handle.releasePointerCapture(e.pointerId)
  iframe.style.pointerEvents = 'auto'
```

Edge case: if the user `pointerdown`s on something *inside* the iframe (not a host handle), capture is iframe-side and you cannot bridge mid-gesture. Pre-place transparent host overlays with `pointer-events: auto` over hit zones for resize handles before drag starts.

### Drag robustness checklist (Phase 2)

The canonical bug catalog (MDN, javascript.info, openseadragon #1962, babylon #19424, taye/interact.js #220):

- Always use **Pointer Events + `setPointerCapture`** on `pointerdown`. Single biggest fix.
- Listen for **all four**: `pointermove`, `pointerup`, `pointercancel`, `lostpointercapture`. Browser drag-and-drop hijack fires `pointercancel` — must handle.
- **`touch-action: none`** in CSS on the drag target.
- **Window blur / `visibilitychange`** listener — #1 cause of "stuck drag" reports (user alt-tabs mid-drag, mouseup never fires).
- **Modifier keys** subscribed on `window`, not on element — element loses focus.
- **Escape cancel** registered on `window` in `pointerdown`, removed in cleanup. The "broken in editors" issue is usually a listener attached to the canvas which has no focus once dragging.
- **Drag state in `useRef`**, not `useState`. Commit to state only at end. tldraw, excalidraw both follow this.

### Performance budget (Phase 2)

- `getBoundingClientRect()`: ~5-50µs clean, **0.5-5ms when forcing layout flush** (worst observed: 200ms freezes per [react-native-reanimated #7673](https://github.com/software-mansion/react-native-reanimated/issues/7673)). One batched read per rAF tick = ~free. One read per element with intervening writes = catastrophe.
- `postMessage`: ~0.5ms one-way (Surma's "Is postMessage slow?"). OK for selection events. NOT OK for per-frame position sync — keep position math host-side reading via `getBoundingClientRect` on the iframe document directly (works because we have `allow-same-origin`).
- Per-frame budget at 60fps: 16.6ms total, ~10ms practical. ~500 tracked elements is the realistic ceiling before falling off, IF batching strictly. Above that, virtualize via IntersectionObserver gating the working set.

### Phase 2: don't reinvent handles + snap

- **`react-moveable`** (`daybrush/moveable`, MIT) ships handles, sibling/grid/element snap guidelines, gap-snap, bounds, group operations. Most feature-complete OSS option. Build *on top of* it for Phase 2 rather than from scratch — wire its handles to our intent resolver and AST diff system.
- **`tldraw`'s `SnapManager`** is the best architectural reference for snap internals: split into `BoundsSnaps` (edges/centers, alignment) and `HandleSnaps` (point connections). 8 screen pixels threshold / zoom level. **Brute-force traversal at <100 elements scales fine — no R-tree/quadtree needed**. Add hysteresis (4px in / 8px out) on top.
- **`@use-gesture/react`'s `rubberband: true`** for elastic resistance when constraint hit (default coefficient 0.15).
- **Track A → B drift animation:** FLIP technique (Paul Lewis). Compare bounding boxes (not computed style trees — too noisy), animate `transform 150ms ease-out`.
- **Undo coalescing during drag:** `zundo` (Zustand middleware, <700B) with `pause()` at `pointerdown` / `resume()` + push snapshot at `pointerup`. ProseMirror's `newGroupDelay: 500ms` pattern for typing.

### Source-attribution for computed CSS (Phase 4)

- `Element.getMatchedCSSRules()` was removed in Chrome 64 (2017). No standardized replacement exists for web pages.
- **The community pattern:** walk `document.styleSheets` → each `sheet.cssRules` → recurse into `CSSImportRule.styleSheet.cssRules` and `CSSMediaRule.cssRules` (gated on `matchMedia(rule.conditionText).matches`) → for each `CSSStyleRule`, test `el.matches(rule.selectorText)` → compute specificity per matched rule (4-tuple `[!important, IDs, classes/attrs/pseudo, elements]`) → track winners per property. See [stracker-phil's gist](https://gist.github.com/stracker-phil/4ba0b9b9ad67dff268c9130f2fdbb473).
- **Cross-origin gotcha:** `sheet.cssRules` throws `SecurityError` on cross-origin sheets without CORS — Tailwind CDN sheet WILL throw in our iframe. Wrap each access in try/catch, mark unreadable sheets as "unknown source."
- **v1 realism:** ship "rule selector + stylesheet href + inline + inherited-from {parent}". Skip `@layer`/`@container` cascade replication (rabbit hole).

### Direct-study OSS references (Apache 2.0 / MIT)

Ranked by relevance to what we're building:

1. **Onlook** `packages/parser/src/{ids,parse}.ts` — closest analog. OID injection, magic-string-style edits, dynamic-className-becomes-static fallback handling.
2. **Onlook** `packages/penpal/src/` — RPC over postMessage wrapper.
3. **Aaronius/penpal** — the primitive itself. 3 KB MIT.
4. **Floating UI** `@floating-ui/dom/src/autoUpdate.ts` — the cross-frame position-tracking pattern.
5. **tldraw** `packages/editor/src/lib/editor/managers/SnapManager` — Phase 2 snap reference.
6. **react-moveable** `packages/react-moveable/src/MoveableGroup.tsx` — multi-element coordinated drag (default "all delta same" pattern, modifiers).
7. **xyflow/xyflow** (React Flow) — node-drag commit choreography; FLIP-style animations on layout reconciliation.
8. **Plasmic** `platform/sub/` — host-side bridge for the registered-component model (relevant Phase 5).

### Things explicitly RULED OUT after research

- ❌ `@swc/wasm-web` — async init kills keystroke-grain parse.
- ❌ **Build-time SWC plugin for OID injection** (added 2026-04-28 after v2 review) — Onlook does it via Babel walk in editor runtime, not via SWC plugin (verified by direct source read). Our paste-JSX-into-textarea path has no user build pipeline; SWC plugin is architecturally impossible regardless. See "Stable node identity" → "Explicitly rejected" for full breakdown.
- ❌ `tree-sitter` — no pretty-printer; concrete syntax tree wrong shape for serialize-back.
- ❌ swc's printer / `@babel/generator` (even `retainLines: true`) — both reformat unmodified subtrees.
- ❌ recast as default printer — JSX whitespace bugs.
- ❌ Structural-path-hash IDs — fragile to sibling inserts.
- ❌ Content-hash IDs — collide on duplicate elements.
- ❌ R-tree / quadtree for snap targets at <100 elements — tldraw confirms brute-force scales fine.
- ❌ Style-tree diff for Track A/B drift detection — too noisy. Use bounding boxes.
- ❌ Per-frame `getBoundingClientRect()` from inside a per-element loop with intervening DOM writes — guaranteed layout thrashing.
- ❌ CRDT/Yjs (already locked out, research reconfirmed: Onlook also doesn't ship it).
- ❌ **Host-side ghost overlay for the dragged element** (added 2026-04-28 after v2 review) — visual fidelity unsolvable in general, layout context lost, siblings don't reflow, FLIP origin missing. Use the in-iframe `#dropin-live` managed-stylesheet pattern instead.
- ❌ **AI inside the Operation Engine / gesture handlers** (added 2026-04-28 after v2 review) — Sonnet 4.6 is 2-5 s+ first-token, Morph Fast-Apply is 0.8-1.3 s; both unusable on a 16ms-per-frame hot path. AI lives in Layer 6 (Cmd-K palette, chat lane), invoked explicitly with explicit latency budget. v0 / Cursor / Onlook all converged on the same separation.
- ❌ **Custom Tailwind "Class Engine" with bespoke lex/resolve/merge/generate/JIT** (added 2026-04-28 after v2 review) — `tailwind-merge` (pinned `2.6.0` for Tailwind 3.4.x) handles every conflict-resolution case; CDN MutationObserver handles JIT for utility classes. Three of five "stages" are free. Build only the cn helper + AST-aware className patcher + theme token reader (~300 LOC total).
- ❌ **`element.style.*` direct mutation as Track A** (added 2026-04-28) — races with React reconciliation and gets clobbered. Use the `#dropin-live` managed-stylesheet pattern keyed by `data-dropin-id`. Narrow inline-style exception only for `transform` / `zIndex` / `position: fixed` during translate drags.

---

## Locked Configuration (2026-04-27)

The five open questions below are locked. The recommendations from earlier drafts are SUPERSEDED where the user's call differs. Do not relitigate without explicit user instruction.

**1. Target language: JSX-first.** Spec's earlier HTML-first recommendation overridden. Dropin's existing strength is JSX (web/*.jsx templates, the click-to-edit inspector targets JSX nodes via `data-dropin-loc`). The "heavier AST" cost is real but it's complexity we'd hit in Phase 2 anyway when registry components arrive as TSX. Pay it now.

Concrete implication: the AST layer uses **`@babel/parser` with the JSX/TSX plugin** (revised 2026-04-28 — see Implementation Toolchain → "Parser" for why swc was rejected: async WASM init kills keystroke-grain parse). HTML mode (if it stays as a separate concept at all) is a downgrade path, not the primary target.

**2. Style cascade: inline-by-default with explicit class-edit toggle.** Vibecoder mental model: "I changed *this* card." If the change ripples to every card with the same class, that's surprising; surprises kill trust faster than missing features.

The palette use case is solved separately and better via CSS variables: palette tokens (`--primary`, `--background`, etc.) live at `:root`, components reference them with `var(--primary)`. Changing the palette is one class-level edit on `:root`. Changing one button's color is an inline edit on that button. Different intents, different paths, neither surprising.

The "edit class" toggle is a small chip in the properties panel: "This change applies to: [This element only ▾]" with options *This element only* / *All elements with this class* / *Edit :root variable*. Default to *This element only*. Power users discover the toggle, vibecoders never need it.

Phase 1 ships the chip's UI stub (always reads "This element only", no functional alternatives). Class-edit and root-variable paths are Phase 4 work.

**3. Parse location: host-side.** The 5-10 MB `@swc/wasm-web` cost is unacceptable in the iframe (per-template render compounds; vibecoders on weak laptops). PostMessage traffic per drag-end commit is the right tradeoff: drags are infrequent (low single-digit per minute even for active users), each diff is small (kilobytes), the channel handles it trivially.

Architecture: AST lives in the **editor shell**. Iframe holds the rendered DOM with `data-dropin-id` attributes injected during render. Layer 5 Track A still works: optimistic paint happens via postMessage to the iframe (`dropin:live-style { id, declarations }`), iframe maintains a CSS rule keyed by `[data-dropin-id="..."]` inside the host-managed `#dropin-live` stylesheet — see "Layer 5: Renderer (Two Tracks)" above for the full mechanism. Track B postMessages the new source on commit.

This also makes the editor inspectable in dev tools without iframe juggling, which is a quality-of-life win during development.

**4. Track A (optimistic DOM): deferred to Phase 2.** Phase 1 has no drag, so Track A isn't exercised. When Phase 2 lands, Track A goes in then. Phase 1's interactions (click select, keyboard navigation, undo, code edits) all go through Track B with no perceived lag because they're discrete, not continuous.

**5. CRDT / Yjs: skipped.** Multi-user editing is not on the 12-month roadmap. Vibecoders building landing pages aren't collaborating in real-time; they're solo, optionally with an AI assistant. Adding Yjs now is permanent complexity tax for a feature that may never ship.

If multi-user becomes a priority later, retrofitting CRDTs onto the AST layer is hard but not impossible: the diff system is already structured, which is half the battle. The other half is ID stability across concurrent edits, which is its own research project. Punt it.

The earlier "Yjs-from-day-one" recommendation in the spec was over-cautious. Withdrawn.

---

### Additional locked decisions

**Coexistence with existing inspector.** The current `Inspector.tsx` / `FocusEditor.tsx` / `lib/source-patch-jsx.ts` system is NOT thrown out. Strategy:

- New AST + selection + undo system runs in parallel for Phase 1.
- Existing inspector continues to handle click-to-edit-text/attr/class via `data-dropin-loc`.
- Phase 1 deliverable injects `data-dropin-id` attributes ALONGSIDE the existing `data-dropin-loc` attributes — no conflict, both attribute systems present.
- Phase 2 (drag) builds on the new system; existing inspector still owns its scope.
- Phase 3+ migrates inspector functionality to the new system gradually as parity is proven, feature by feature.
- Existing inspector retires when the new system covers everything it does. Could be 3-4 months out. Fine.

This means Phase 1 has a "two world" period. Acceptable. Each system handles its own scope cleanly.

**Component instance system: Phase 5, not Phase 1 dependency.** Component instances are 2-3 months of focused work. Not blocking anything earlier. When Phase 5 arrives, the AST already has stable IDs and structured diffs (both prerequisites); the new work is propagation policies and override tracking on top.

**Telemetry: deferred.** Dropin is static-deploy; adding a backend just for telemetry is out of scope. Phase 1 ships with console-level logging for development debugging and nothing else. When telemetry becomes valuable (sometime around Phase 3-4), pick a managed service (PostHog, or Vercel Analytics with custom events) rather than building infra. The spec's "not optional" was overstated. It's not optional eventually. Phase 1 doesn't need it.

**Audience fit: moat version, staged delivery.** Building the moat. Reasoning: scoped MVP (basic select + drag + a few properties) is already a commodity — Cursor IDE has live preview, v0 has live preview, every Replit-style tool has live preview. The thing that doesn't exist is the polished-to-the-edges version where every drag does the right thing and every edge case works.

But "building the moat" doesn't mean "shipping all of it before launch." It means committing to the architecture that supports the moat (the five layers) and shipping phases that each work standalone while building toward it. Phase 1 alone is genuinely useful (clean selection, breadcrumb nav, robust undo) even before any drag arrives. Phase 2 alone (drag + handles + spacing) makes the editor feel professional. Phase 3+ deepens the moat over time.

The wrong move is to ship a half-baked drag system in week one because "vibecoders need drag." Better to ship clean foundation first, then layer drag on top correctly. Users will tolerate "drag isn't here yet" if select-and-edit works perfectly. They won't tolerate "drag exists but breaks half the time."

---

### What ships per session

Each phase from §"Phasing" above is its own session. **No compression.** Phase 1 is genuinely Phase-1-sized; trying to fit Phase 2 into the same session ships fragile drag.

Phase-by-phase deferred specs live next to this file as `phaseN-manipulation.md` for any phase that has been pre-scoped beyond what §"Phasing" alone captures. Phase 2's deferred spec is the next file to read after this one.

---

## Known gaps surfaced during the v2 review (2026-04-28)

Things neither v1 nor v2 addressed but that are real risks. Each is filed against a specific phase to make sure they don't get dropped.

1. **Multi-line `import` statement stripping (Phase 1).** Currently `lib/preview.ts` only strips single-line imports; multi-line imports cause a Babel parse error in the iframe IIFE. The OID walker has to handle imports correctly anyway, so the fix lands as part of Phase 1's AST work. Already added to Phase 1's bullet list.
2. **Hot keystroke parse perf budget (Phase 1).** Target <30 ms p99 on `@babel/parser` for files up to 1000 lines. Benchmark against the existing 30 templates; the slowest gets a specific call-out. Visible degradation fallback (`onBlur`-only parse with a "Parsing paused while typing…" indicator), not silent. Already added to Phase 1's bullet list and acceptance criteria.
3. **Tailwind config evaluation (Phase 4 product decision, NOT engineering).** Templates ship configs as `<script type="text/plain">` text. Three options: JSON5 parse (works for static, fails on computed), sandboxed `Function()` eval (works for everything, security risk on hostile pasted configs), or *don't read template configs at all* and use a default config for token resolution. Phase 1 doesn't need this (no property panel). By Phase 4, decide between sandboxed eval (with explicit XSS-in-playground risk acknowledgment) and a "templates must ship JSON-only configs going forward" policy. Product decision; flag it on the calendar at Phase 4 kickoff.
4. **CSP for the preview iframe (Phase 1).** Inject `<meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self'">` into `srcDoc`. XSS-in-the-playground is accepted risk (vibecoders paste arbitrary code, the iframe runs it, that's the entire product). The CSP isolates the preview from third-party framing and parent-shell escape — not from the user's own pasted code. Already added to Phase 1's bullet list.

5. **Auto-resolve common npm imports in pasted JSX (near-term, ships before/with Phase 1).** Currently `lib/preview.ts` strips every `import` line before Babel transform, so any pasted JSX that references `lucide-react`, `framer-motion`, `@radix-ui/react-*`, etc. compiles fine but crashes at runtime when the destructured variable is undefined. The manipulation system can't operate on a crashed preview, so this gates the practical usefulness of Phase 1 onward.

   **Approach (curated UMD allowlist, the "A" path):** pre-load the top ~15 packages AI generators reach for as UMD scripts in the preview doc, expose them as globals on `window.__pkgs`, and rewrite the user's `import { X } from 'pkg'` to `const { X } = window.__pkgs['pkg']` before Babel transform (extends the existing import-stripping logic in `lib/preview.ts`). ~50 KB extra per page load, zero runtime resolution, instant. Crashes on packages NOT in the list with a clear inline error ("package `foo-bar` not supported in playground; supported list: …") rather than a cryptic `undefined is not a function`.

   **Draft supported package list (tune before implementing):**
   - **Icons** — `lucide-react`, `@heroicons/react/24/outline`, `@heroicons/react/24/solid`, `react-icons` (subset)
   - **Animation** — `framer-motion`, `motion/react` (the new umbrella package)
   - **UI primitives** — `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-popover`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-accordion`
   - **Class utilities** — `clsx`, `tailwind-merge`, `class-variance-authority`
   - **Charts** — `recharts`
   - **Notifications** — `react-hot-toast`, `sonner`
   - **Forms** — `react-hook-form`
   - **Date** — `date-fns` (subset)

   **Implementation notes:**
   - Each entry in the allowlist is `{ name, umdUrl, globalName, exports?: string[] }`. UMD URLs from unpkg or jsdelivr; pin major versions to avoid silent breakage.
   - For packages with named exports the UMD doesn't expose well (Radix), use the package's ESM build via esm.sh and wrap in a small `<script type="module">` shim that assigns to `window.__pkgs[name]`.
   - Babel plugin walks `ImportDeclaration` nodes, builds the destructure preamble, removes the original import. Same length-preserving rewrite pattern the existing `data-dropin-loc` plugin uses, so source coordinates stay correct.
   - Document the supported list in `CLAUDE.md` "Locked stack" section and surface it in the playground UI as an "ℹ Supported imports" affordance so users know what's available before they paste.

   **Phase 2 fallback if needed (the "B" path):** when a user imports an unsupported package, prompt: "Try fetching `pkg` from esm.sh? (slower, requires network)" with a one-click upgrade. Rewrite to `const X = (await import('https://esm.sh/pkg')).default` in an async preamble. Universal coverage but adds 100-500 ms first-paint per unique import and makes the preview depend on network. Defer until users actually hit the wall.

   **Owner note:** filed as a Phase 1 prerequisite, not Phase 4 work — manipulation needs reliable preview, and reliable preview means imports don't silently disappear. Sequence it before the OID walker since both touch the same `lib/preview.ts` import-handling region.

---

## What this spec is NOT

Explicit rejections so future reviewers don't have to re-litigate the same dead-ends. If a future revision re-pitches any of these, the burden of proof is "what's different now," not "have we considered this."

- **NOT a CRDT-based system.** Multi-user editing is not on the 12-month roadmap. Vibecoders building landing pages aren't collaborating in real-time. Yjs introduces permanent complexity tax for a feature that may never ship. If multi-user becomes a priority later, retrofitting CRDTs onto the structured-diff layer is hard but possible — punt it. (Locked Configuration #5.)
- **NOT a build-time injector for stable IDs.** No SWC plugin, no Babel plugin shipped as a Next.js compiler config, no codegen step run from `next.config.js`. Stable IDs are minted at parse-time in the editor runtime, in pure JS, via `@babel/parser` + `@babel/types`. Onlook does it this way (verified, not hearsay), and our paste-JSX-into-textarea path makes build-time injection architecturally impossible regardless. (See "Stable node identity" above.)
- **NOT a host-side ghost overlay system for the dragged element.** Selection chrome (outlines, handles, snap guides, measurement labels) is host-side overlay — that part is right. But the element itself is mutated in-iframe via the `#dropin-live` managed stylesheet. Ghost overlay for the dragged element fails on visual fidelity, layout context, sibling reflow, and FLIP origin. (See "Layer 5" above.)
- **NOT an AI-driven gesture handler.** AI never runs from a `mousedown` / `mousemove` / arrow-key / property-handle event. Drag handles are pure deterministic Layer 3 → 4 → 5. AI lives in Layer 6 (Cmd-K command palette, "Generate hover state" buttons, chat lane), invoked explicitly with an explicit latency budget. The `applyIntent(ast, intent, value, modifiers) → AstDiff` contract stays a pure function. (See "Layer 6: AI Commands" above.)
- **NOT a custom Tailwind class engine.** No bespoke lex/resolve/merge/generate pipeline. `tailwind-merge` (pinned to `2.6.0` for Tailwind 3.4.x) handles every conflict-resolution case. The CDN's `MutationObserver` handles JIT for utility classes. We add a `cn` helper, an AST-aware className patcher (~150-300 LOC of `@babel/types` glue, modeled on Onlook's `style.ts`), and a theme token reader (`resolveConfig`, ~40 LOC). That's the entire Class Engine.
- **NOT a host-side parser-in-the-iframe.** Parser runs in the editor shell, not loaded into the iframe. Iframe holds rendered DOM with `data-dropin-id` attributes; postMessage carries diffs and live-style updates. (Locked Configuration #3.)
- **NOT recast-printed for the property-edit hot path.** `magic-string` byte-overwrite is the default printer — preserves user's formatting losslessly. Recast is reserved for the rare structural rewrite (extract component, wrap in parent, move subtree) and even there, scoped to a single function body. JSX whitespace bugs in recast (`recast#365`, `#167`, `#1386`) are known and contained.
- **NOT a separate "design mode" vs "code mode."** Both surfaces are always available, both always live, both projecting from the same AST. (See "Code Panel Coexistence".)
- **NOT a free-form absolute-positioning canvas.** Web is constrained by responsive layout. Free positioning produces beautiful designs that break on every screen size. Absolute positioning is supported but not encouraged. (See "What This System Avoids".)