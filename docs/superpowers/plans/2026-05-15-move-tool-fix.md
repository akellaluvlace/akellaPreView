# Move tool — diagnosis + fix

**Status**: DESIGN ONLY. Not implemented.
**Reported**: 2026-05-15 by user — "mark that move doesnt work at all".
**Effort**: ~1-2 hr after runtime verification.

## Code-only audit (this session)

Mechanically traced toolbar → click → drag → commit. **All wires intact**:

1. **Toolbar** — `components/ToolBar.tsx:36` — `TOOL_LIST = ["view", "vibe", "move"]`. Move button renders. Click → `onToolChange("move")` → `Workspace.setTool("move")` (already logs via `track("setTool", { next })` from 2026-05-14 PM instrumentation).
2. **State persistence** — `setTool` writes to `localStorage["dropin:tool"]` and triggers a `dropin:set-tool` postMessage to the iframe.
3. **Iframe receiver** — `lib/preview.ts:2130` accepts `tool: "move"` in the set-tool handler; updates `DROPIN_TOOL = "move"`; logs `[dropin:iframe] tool updated { tool: "move" }`.
4. **Iframe click handler** — `lib/preview.ts:1887` bails for non-`select`-non-`move` tools but ALLOWS `move`. Click on canvas → resolves target → posts `dropin:select` to host.
5. **Host selection state** — `handleSelectionChange` at `Workspace.tsx:745` sets `selection` state. The `selectedOid`/`selectedLoc`/`selectedTag` props derive from it and pass to Preview.
6. **SelectionOverlay mount gate** — `components/Preview.tsx:1184` — mounts when `tool === "select" || tool === "move"` AND a selection exists.
7. **Move handle render** — `components/SelectionOverlay.tsx:877` — `showMoveHandle = tool === "move"`; line 3086 renders the position handle when `move` binding wired AND `showMoveHandle` true.
8. **Move bindings** — `components/Preview.tsx:1106` — `moveBindings = onReorder && onReparent ? {...} : undefined`. Both handlers are passed from Workspace:3294-3295 (`onReorder={handleReorder} onReparent={handleReparent}`). Handlers exist at `Workspace.tsx:1386, 1648` calling `applyReorder` / `applyReparent`.
9. **Drag handler** — `SelectionOverlay.tsx:2229 handleMovePointerDown` does pointerdown → setPointerCapture → drop-target fetch → pointermove updates live visual → pointerup commits.

**No code-level regression found.** The 2026-05-14 morning Phase 1 toggle removal didn't touch any of these handlers (verified — that pass deleted `propagationMode` state + Phase D/F cross-file branches, none of which intersect with Move).

## The most likely user-visible bug — UX gap

**Hypothesis** (high confidence): The Select tool was hidden from the toolbar in the 2026-05-14 morning Phase 2 simplification. Before that, the workflow was:
1. Click Select tool
2. Click element on canvas → SelectionOverlay appears
3. Click Move tool
4. Drag the move handle

After 2026-05-14, Select is hidden. The Move tool still requires a prior selection to render the handle. With Select gone, the user has no obvious way to **create** that selection — they click Move, try to drag an element directly, nothing happens (the move handle isn't visible without a selection).

The Move tooltip — "Drag elements to reorder or move them. (M)" — implies direct-drag, reinforcing the wrong mental model.

But: the iframe click handler DOES accept clicks in Move tool (gates on `select || move`). So a Move-tool click IS routed back as a selection. The user just doesn't know they're meant to click-first-then-drag-the-handle, because the handle is a coral disc that's only visible after click.

## Confirming the hypothesis (runtime — needs user)

Diagnostic logs from 2026-05-14 PM are still in place. Single user round-trip will confirm:

1. Open template. Open dev tools console.
2. Click Move in toolbar. Expect:
   - `[dropin:Workspace] setTool { next: "move" }`
   - `[dropin:iframe] ← host: dropin:set-tool { tool: "move" }`
   - `[dropin:iframe] tool updated { tool: "move" }`
3. Click an element on canvas. Expect:
   - `[dropin:iframe] click raw target { ..., tool: "move" }`
   - `[dropin:iframe] resolved selection { resolved: ..., wasDirectTarget: true }`
   - `[dropin:iframe] → posting dropin:select to host`
   - SelectionOverlay should now visibly mount with a **coral disc move handle** centered on the clicked element.
4. Drag the coral disc. Expect drag → drop-target highlight → release → reorder commit.

**If step 3 lands the disc**: hypothesis confirmed — fix is UX-only.

**If step 3 doesn't land the disc**: SelectionOverlay isn't mounting OR `move` binding is undefined. Trace via:
- Add temp log to Preview.tsx after `moveBindings = ...`: `console.log('[dropin:Preview] moveBindings =', !!moveBindings)`. Expect `true`. If `false`, one of `onReorder`/`onReparent` is undefined → check Workspace prop wiring at :3294-3295.
- If `moveBindings` is true but disc doesn't appear: check `showMoveHandle` gate in SelectionOverlay — could a recent CSS change have hidden it (z-index, opacity)?

## Fix proposals (pick one)

### Option A — Auto-select + drag in one tool (recommended)

Move tool becomes a single-gesture tool: pointerdown on any addressable element triggers BOTH selection AND immediate drag start. No separate click-then-drag steps.

**Implementation sketch**:
1. Iframe-side (`lib/preview.ts`): when `DROPIN_TOOL === "move"`, on pointerdown:
   - Resolve target (same as click)
   - Post `dropin:select` immediately
   - The host renders SelectionOverlay
   - Pointerdown gesture continues — the overlay's move handle should pick up subsequent pointermove
2. Or simpler: on Move-tool click, dispatch a synthetic pointerdown event on the SelectionOverlay's move handle after a one-tick delay so the overlay has time to mount. Browsers don't always replay the original pointerdown after a new element mounts → may need user to drag separately the first time.

**Cleanest implementation**: skip the synthetic-event hack. Instead:
- Move-tool **click** selects (existing behavior).
- After selection mounts the overlay, the move handle has `cursor: move` — user knows to grab it.
- Reduce the perceived friction: enlarge the move handle so it covers more of the element (not just a 22×22 disc), or render an invisible drag area covering the full element when tool is move.

### Option B — Hint overlay before selection

When tool is Move and no selection exists, render a centered hint: "Click an element first, then drag to move."

Less invasive but doesn't solve "I clicked Move and tried to drag — nothing happened."

### Option C — Re-add Select tool

Bring back the Select button. Move flow goes back to the pre-2026-05-14 two-tool dance.

User explicitly hid Select for simplicity — adding it back regresses that decision. Skip.

### Recommendation

**A + B combined**, framed as: "click to grab; drag to move". The first Move-tool click selects + makes the move handle obvious (large hit area, animate-in, maybe pulse for the first second). If user doesn't click first, the hint at the top of the canvas says "Click an element, then drag it."

## Implementation budget

- Option A core (enlarge move handle hit area, animate-in on selection): **~30 min**
- Option B hint overlay: **~30 min**
- Combined: **~1 hr**
- + runtime verification (needs user dev-server access): **~30 min**

## Tests

UX behavior — hard to unit-test. Verify via:
1. tsc 0 (covers structural correctness).
2. Existing vitest cases for `applyReorder` / `applyReparent` already cover the commit math — no new tests needed.
3. Manual: open template, click Move, click an element, observe handle, drag, release.

## Done when

- User clicks Move tool, clicks an element, sees an obvious move handle (Option A: enlarged + animated), drags it, element commits to new position.
- "Doesn't work at all" feedback resolved by user testing.

## NOT in this fix

- Multi-element move (already works via shift-click to additionals — separate code path).
- Tree-side DnD (works regardless of tool — separate code path).
- Cross-template move (out of scope).
