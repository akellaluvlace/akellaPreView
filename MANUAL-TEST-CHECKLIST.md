# Manual Test Checklist — 2026-05-08

State: codebase fully audit-cleaned (audit-2026-05-04 + audit-2026-05-06 backlog
shipped). 6066/103 vitest, tsc 0. Ready for browser-side verification of
features whose pure-logic + bundle smoke tests pass but haven't been clicked
through end-to-end.

This file is the source of truth. CLAUDE.md + memory point here; don't
duplicate.

## Pre-test setup

1. Dev server already running on the user's port (`npm run dev` if not).
2. **Required for P0-1 (LibraryModal compat filter)**: re-run
   `node scripts/ingest-components.mjs --no-thumbs` ONCE so
   `public/data/components/index.json` gets the new `rootClassName` field. Without
   this, every component classifies as "unknown" → the chip reads "0 fit · {N}?"
   and dimming/sorting do nothing visible. The runtime + Workspace wiring is
   already in the bundle; only the data file needs refreshing.
3. Open `/playground` and `/gallery` in a browser, plus
   `/playground?mode=jsx` for any JSX-mode tests.

## How to read this checklist

Each test block follows: **WHAT** (feature), **HOW** (steps), **EXPECT** (pass
signal), **REGRESSION** (what failure looks like).

P0 = recently shipped, must verify before declaring done.
P1 = older fixes that should be sanity-checked.
P2 = invisible refactors, only test if doing thorough audit.

---

## P0 — Must test (recently shipped, end-to-end unverified)

### P0-1 — LibraryModal compatibility filter (Phase E close-out, 2026-05-08)

**WHAT**: When user enters Swap mode with a selected element, the Components
panel filters/sorts library entries by whether each component's root className
fits the slot envelope (parent's content box + AR).

**HOW**:
1. Re-run ingest (see Pre-test setup #2). Confirm the served
   `index.json` now contains `"rootClassName"` keys (curl + grep).
2. Open `/playground`. Paste any template into the editor.
3. Click an element on canvas to select it.
4. Click the Swap tool button.
5. LibraryModal opens with Components tab.

**EXPECT**:
- Header chip reads `"{N} fit · {U}?"` with N = compatible count, U = unknown count.
- "Fits only" checkbox visible next to the chip.
- Compatible cards land first; have a subtle coral ring (`ring-1 ring-coral/40`).
- Incompatible cards: 50% opacity + grayscale; `"✕ won't fit"` badge bottom-right.
- Unknown cards: `"?"` badge.
- Hover an incompatible card: tooltip says e.g. `"Won't fit: needs ≥ 320px width;
  aspect ratio 1.50 vs slot's 0.75 (50% drift)"`.
- Toggle "Fits only" → incompatibles disappear entirely; chip stays.
- Click any compatible card → swap fires (P0-3 path).
- Click "Reset filters" → fitsOnly clears AND search/category resets.

**REGRESSION**:
- Chip reads `"0 fit · {N}?"` even after re-running ingest → `rootClassName` not
  read by the panel. Check served playground JS chunk for `rootClassName` ref.
- All cards show `?` badge → ingest didn't write the field.
- Clicking Swap with no selection should NOT crash; panel should still open (no
  envelope, no compat data, all cards default-allow).

---

### P0-2 — Phase D cross-file className propagation (2026-05-07)

**WHAT**: Editing className on a `<Card />` JSX call site with `propagationMode
=== "everywhere"` ripples to BOTH the call site AND the imported component's
definition file. One Cmd+Z reverts both files atomically.

**HOW**:
1. Open `/playground`. Create a new project via the "+ file" tab strip.
2. Add `Card.jsx` containing a simple component:
   ```jsx
   export default function Card() {
     return <div className="bg-white p-4">card</div>;
   }
   ```
3. In `App.jsx` (entry), import it: `import Card from './Card';` and render `<Card />`.
4. Switch propagationMode toggle to "everywhere" (top of editor, if exposed).
5. Select the rendered `<Card />` element on canvas.
6. Change a className via the inspector (e.g. add `bg-blue-500`).

**EXPECT**:
- Both `App.jsx` AND `Card.jsx` get edited in one operation.
- The change in `Card.jsx` is on the inner `<div>` (the def's root JSX element).
- One Cmd+Z reverts BOTH files simultaneously.
- One Cmd+Y redoes both.

**REGRESSION**:
- Only `App.jsx` updates (cross-file resolution missed).
- Two undo entries instead of one (atomic `applyEditDirect` not threaded through).
- Toast says "everywhere mode" but no second file edit.

**Bails (each should show a toast with a reason, no edit applied to def file)**:
- HOC wrapper: `export default withAuth(Card)`.
- Class component: `export default class Card extends React.Component { ... }`.
- Re-export: `export { Card } from './lib';`.
- Namespace import: `import * as Lib from './lib';` then `<Lib.Card />`.
- Non-relative import: `import Card from 'some-pkg';`.

---

### P0-3 — Phase E swap dimension-matching (auto-fit + drift toast, 2026-05-07 evening)

**WHAT**: When swapping an asset onto a selected slot, the new element's classes
get auto-adjusted to fit the slot (overflow → w-full, AR drift → aspect-[X/Y]).
After the iframe re-renders, if bbox drift > 10%, show a warn toast.

**HOW**:
1. `/playground`. Paste any template with a card-like element.
2. Click to select. Click Swap. Pick a card from LibraryModal.
3. Watch the iframe rebuild + the toast tray.

**EXPECT**:
- The new element renders in roughly the same dimensions as the selected slot.
- If the asset was wider than the slot, its `w-[800px]` (or similar) became `w-full`.
- If the AR was off > 10%, an `aspect-[X.YY/1]` class was added.
- ONE undo entry covers both swap + fit (atomic).
- Drift toast appears ONLY if post-render bbox still drifts > 10% (e.g. asset
  has its own intrinsic min-width that the fit transformations couldn't relax).

**REGRESSION**:
- Two undo entries (swap + fit not atomic).
- New element renders WAY larger / smaller than slot, no fit applied.
- Drift toast on every swap (10% threshold misconfigured).
- No toast on a clearly-busted swap.

---

### P0-4 — Phase F everywhere-mode swap preflight (2026-05-07 evening)

**WHAT**: With `propagationMode === "everywhere"`, swapping a component-tag
instance walks ALL call sites of the resolved definition, runs preflight against
each instance's slot envelope, and either commits a multi-file Edit (def root
swapped) or atomically aborts with a per-instance failure summary.

**HOW**:
1. Multi-file project: `App.jsx` imports `Card` from `./Card`; renders multiple
   `<Card />` instances on the page.
2. Set propagationMode = "everywhere".
3. Click a `<Card />` instance, click Swap, pick a different card.

**EXPECT (success path)**:
- Toast: e.g. `"5 of 5 instances fit. Swapped def root."`
- All `<Card />` rendered instances reflect the new shape.
- ONE Cmd+Z reverts all instances + the def.

**EXPECT (preflight failure path — incompatible asset for one instance)**:
- Construct a case where one of the rendered instances has a smaller slot than
  the chosen asset's min-width.
- Toast: e.g. `"3 of 5 instances fit. Failures: oid-foo (≥ 320px); oid-bar
  (≥ 320px)."` Atomic — NO files modified.
- Tool resets to select.

**EXPECT (missingEnvelope path)**:
- A `<Card />` rendered behind a hidden tab / off-screen / inside a Multi-page
  proxy that's not currently mounted → envelope readback returns null →
  preflight aborts.
- Toast surfaces the abort reason.

**REGRESSION**:
- Partial mutation (some files written, some not) on preflight failure.
- Silent abort with no toast.
- Cmd+Z reverts only the def, not the instances (or vice-versa).

---

### P0-5 — AI Rewrite SSE streaming (2026-05-08 morning + today's tightenings)

**WHAT**: BYO-key LLM rewrite via `/api/llm-rewrite`. Streaming variant + Stop
button + rate limit + malformed-payload distinction.

**HOW**:
1. `/playground`. Open Focus Editor for some element.
2. Set provider + paste API key.
3. Type a prompt, click Rewrite.

**EXPECT (happy path)**:
- Spinner ON; partial text streams into the partial-display preview.
- On `complete` envelope: classes apply to canvas IMMEDIATELY; spinner OFF
  immediately. NO sub-millisecond flash.
- Stop button visible while streaming.

**EXPECT (Stop button)**:
- Click Stop mid-stream → spinner OFF; abort propagates; upstream provider
  fetch is aborted (server console: `[llm-rewrite] stream interrupted ...
  reason="client-disconnect"`).
- Click Rewrite again → fresh stream starts.

**EXPECT (network errors)**:
- Wrong API key → toast / inline error: "Invalid API key" (401).
- Rate-limited (5+ requests in 60s) → toast: "Rate limited locally (5 / minute)".
  Status 429.
- For `stream: false` (legacy JSON) calls: 429 returns `application/json`
  `{ ok: false, error: "..." }` (NOT SSE).
- For `stream: true` calls: 429 returns `text/event-stream` with one error frame.

**EXPECT (forward-compat / malformed SSE handling)**:
- (Hard to trigger manually; trust the unit tests.) Server emits unknown
  envelope `{type:"warning",...}` → client silently skips. No console.warn.
- Server emits malformed JSON in a frame → client `console.warn`s with reason
  string: `"[llm-rewrite] malformed SSE payload: json-parse-failed"`.

**REGRESSION**:
- Spinner stays after `complete` → `ac.abort()` not propagating to finally.
- Stop button doesn't clear spinner → stopRewrite still trying to setLoading
  itself, finally not firing.
- Upstream provider keeps generating after Stop (server billing leak) →
  `upstreamAc.abort()` not in cancel callback.
- 429 on `stream: false` returns SSE format → body wasn't parsed before
  rate-limit check.

---

### P0-6 — Storage panel import/export round-trip (today's F5/F6/F7)

**WHAT**: Storage health panel's Export → Import flow with the new
single-source-of-truth `parseStoragePanelExportJsonDetail` parser, the shared
`StoragePanelStateKnobs` type, and the F7 bytes-recompute invariant.

**HOW**:
1. `/playground`. Open the Storage Health Panel (debug surface;
   keyboard shortcut: open via tree-rail bottom button).
2. Adjust panel state (filter, sort, scope, collapsedOther).
3. Click Export → JSON downloads.
4. Open the JSON in a text editor; tamper with one entry's `bytes` field
   (set to e.g. `99999`).
5. Paste the tampered JSON into the Import textarea.
6. Click Restore.

**EXPECT**:
- Validation chip: `"valid · N entries"` while pasting.
- After Restore: panel state knobs (scope/filter/sort/collapsedOther) applied.
- Status line: `"imported N entries"`.
- Recent imports list gains a new entry.
- The tampered `bytes` field is RECOMPUTED to `key.length + value.length` on
  import — NOT persisted as 99999 anywhere visible.

**EXPECT (error paths)**:
- Empty paste → "paste exported json first".
- Malformed JSON → chip: `"invalid json"`; tooltip: `"malformed JSON: ..."`.
- Wrong schemaVersion (e.g. `99`) → tooltip: `"schemaVersion: expected 1, got 99"`.
- Tampered panelState.scope (e.g. `"bogus"`) → tooltip:
  `"panelState.scope: expected "tree" or "all", got "bogus""`.
- Per-entry error: tooltip names the failing index, e.g.
  `entries[3].bytes: expected finite number`.

**REGRESSION**:
- Validation chip never updates → memo not subscribed to raw input change.
- Tampered bytes get summed into the displayed total (F7 not applied).

---

### P0-7 — Multi-file project + IndexedDB persistence (Phase A.2 + B.2 + C, 2026-05-07)

**WHAT**: Tab strip, per-file viewState, IDB persistence, bundler resolves
relative imports, iframe shows entry's bundled output.

**HOW**:
1. `/playground`. Click "+ file" tab; type `Card.jsx` at the prompt.
2. Edit Card.jsx; switch back to App.jsx.
3. Add `import Card from './Card';` and `<Card />` in App.jsx.
4. Reload the page.
5. Click a non-entry tab; click ×; confirm cannot delete entry tab.

**EXPECT**:
- Tab strip shows both files; entry has ★ marker; non-entry has × button.
- Switching tabs preserves Monaco viewState (cursor position, scroll, fold).
- After reload, the project comes back: tabs, entry, file contents intact.
- Iframe renders `<Card />` correctly (bundler resolved the relative import).
- Cycle: `A imports B; B imports A` → toast "cycle detected"; iframe falls back
  to entry-only render.
- Delete attempt on entry tab: blocked (no × button on entry, double-defended at
  op layer).

**REGRESSION**:
- Tab switch resets cursor / scroll → viewState cache not threading.
- Reload loses files → IDB write debounce never fired or hydration didn't run.
- Iframe shows raw `import` syntax / undefined Card → bundler not invoked.

---

## P1 — Should sanity-check (older fixes)

### P1-1 — Mobile/touch gestures (2026-05-05)

**WHAT**: 44×44 hit areas on coarse pointers; pointer capture on tree drag;
slider/segmented/color-chip CSS overrides.

**HOW (DevTools touch emulation OR real device)**:
1. Open canvas with selected element.
2. Try resize / move / spacing gestures via touch.
3. Try tree drag past row bounds (drag a tree row down out of its parent).
4. Try sliders + segmented buttons + color chips in style panel.

**EXPECT**:
- Resize / spacing / move handles are easy to grab (44×44 hit area).
- Tree drag continues smoothly past row bounds (pointer capture survives).
- Slider thumb is large enough to grab on touch (32×32; track is h-11 = 44).
- Segmented controls are min-h-44.
- Color chips are h-11 w-14.

**REGRESSION**:
- Visual handle size changed on desktop (we ONLY grew the hit area, not visual).
- Tree drag drops mid-drag on touch.

---

### P1-2 — Iframe srcdoc injection guards (2026-05-06)

**WHAT**: User templates with literal `</script>` or `</style>` in string
literals shouldn't break the iframe rebuild.

**HOW**:
1. Paste a template with `tailwind.config = { theme: { content: "</script>foo" } }`.
2. Paste a template with `<style type="text/tailwindcss">{`@layer { content: "</style>foo" }`}</style>`.

**EXPECT**:
- Iframe renders cleanly. No raw scriptlet leak; no parser break.

**REGRESSION**:
- Iframe goes blank or shows raw text from the head.
- DevTools console shows scripts not executed past the injection point.

---

### P1-3 — Tool isolation (2026-05-06)

**WHAT**: dblclick should only enter text-edit in select mode; tool-switch
mid-gesture should clean up listeners.

**HOW**:
1. Switch to View tool. Double-click any link or button on canvas.
2. Mid-resize gesture, switch to Move tool.

**EXPECT**:
- View-mode dblclick: native interaction (link follow, button action) — NOT
  text-edit mode hijack.
- Tool-switch mid-gesture: gesture clean teardown; no stuck overlay; no
  console errors about leaked listeners.

**REGRESSION**:
- View-mode dblclick enters contenteditable.
- After tool-switch mid-gesture, mouse-move continues to drive the previous
  gesture on hover (window-level listener leak).

---

### P1-4 — Multi-op partial bail UX (2026-05-06)

**WHAT**: Mixed-multi reparent (cross-parent + same-parent ops) should surface
"N of M bailed" toast with first reason.

**HOW**:
1. Shift-select multiple tree rows from different parents.
2. Drag-drop to a new parent that allows only some of them (e.g. some are
   already children, some would create cycle).

**EXPECT**:
- Success toast: "Moved 3 elements".
- Warn toast immediately after: "Reparent: 2 of 5 bailed (would-create-cycle)".

**REGRESSION**:
- Only success toast appears (silent partial bail — pre-fix behavior).

---

### P1-5 — Error toast deduplication (2026-05-08 morning)

**WHAT**: JSX mode runtime error should produce ONE host toast, not two.

**HOW**:
1. `/playground?mode=jsx`. Paste a JSX template that throws at render time
   (e.g. `<div>{undefined.foo}</div>`).

**EXPECT**:
- ONE error toast.

**REGRESSION**:
- Two stacked toasts with the same error.

---

### P1-6 — Clipboard rejection feedback (2026-05-08 morning)

**WHAT**: StorageHealthPanel copy-to-clipboard rejection (e.g. denied
permission, unfocused tab, Safari Private mode) surfaces a toast.

**HOW (hard to trigger):**
- Block clipboard via DevTools → Application → Clipboard policies.
- Or test in Safari Private mode.
- Click the panel's Copy or Copy URL button.

**EXPECT**:
- Toast: "Copy blocked. Try Export instead." (or equivalent).
- No silent-success; no clipboard contains stale data.

**REGRESSION**:
- Copy click does nothing visible; clipboard unchanged.

---

## P2 — Nice-to-test (mostly invisible refactors)

These have no user-visible behavior change unless something regresses; the
unit tests + tsc cover them. Skip unless doing thorough audit.

- **F1/F2/F4/F9 type tightenings**: invisible. tsc enforces invariants.
- **F3 assertNever exhaustive switch**: invisible.
- **F5 single-source detail parser**: covered by P0-6.
- **F6 StoragePanelStateKnobs**: covered by P0-6.
- **F7 bytes recompute**: covered by P0-6 step 4.
- **F8 branded versionedKey**: pure compile-time, no runtime difference.
- **Domain 1 LOW aOver**: pure refactor (algebraic identity).
- **stopRewrite finally-only cleanup**: covered by P0-5.
- **Rate-limit Content-Type**: covered by P0-5.
- **~14 export demotions**: pure API surface tightening.

---

## Known issues (deferred — won't fix as part of this audit cycle)

See `~/.claude/projects/.../memory/project_known_bugs_deferred.md` for context.

1. **View-mode click → double Workspace chrome**. Likely HMR stale-mount; can't
   diagnose from code alone. Deferred per user 2026-05-04.
2. **React duplicate-key warning from duplicate `data-dropin-id`**. Upstream in
   injectOids/template; deferred per user 2026-05-04.
3. **ElementTree rail-width localStorage write swallow** + ~30 other sites in
   `lib/storage-panel.ts`. Safari Private mode users see panel state silently
   revert with no signal. Audit recommended `safeLocalStorageSet` helper +
   one-time `console.warn`. Deferred (low value; only affects Private mode).
4. **next@14.2.x advisories**. `npm audit` recommends 16.2.4 (SemVer-major).
   Locked stack rule says no. Re-evaluate when product goes to public production.
5. **dompurify (via monaco-editor) advisories**. monaco-editor is locked.
   Bump path needs verification.
6. **~75 chunk-attribution comments** in `ElementTree.tsx` +
   `StorageHealthPanel.tsx`. Substance-loss risk per user feedback; deferred.
7. **JSX-mode click-to-select integration test**. Needs CDN-script stubs
   (React/ReactDOM/Babel UMDs). Deferred until something forces it.
8. **F11 provider-delta discriminated union**. Pure server-internal symmetry
   with parseServerStreamPayload's fix; low user-facing value. Deferred.
9. **F12 `CompiledFilter` discriminated union**. ~80 LOC for ~4-line consumer
   simplification; not worth.

---

## Done — no test needed

Everything ELSE on the audit-2026-05-04 + audit-2026-05-06 backlog is closed:
- All 5 type-design HIGHs (F1/F2/F3/F4/F9).
- All 4 type-design MEDs that ship today (F5/F6/F7/F8).
- All Domain 1/2/4/5 MEDs flagged in audit-2026-05-06.
- Phase A→F multi-file foundation + UI wiring, all the way to LibraryModal
  compatibility filter + cross-file className propagation + everywhere-mode
  swap preflight.

If a feature isn't on this checklist or in "Known issues", it's covered by
unit tests + tsc and doesn't need browser verification.
