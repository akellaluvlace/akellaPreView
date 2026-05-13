# Phase 5 — Tools, Isolation, and the Read-Only-First Workspace

> **Status: SHIPPED (Phase A + B + C complete; §5 backlog (b) streaming shipped 2026-05-05).** This file is now reference, not a forward-looking spec. The §6 acceptance criteria checklist is fully met (see `audit-2026-05-04/` for the post-implementation audit + structural cleanup, and `memory/project_manipulation_phase1_progress.md` for the rolling status). §5 forward-looking items: (b) AI rewrite SSE streaming = SHIPPED 2026-05-05 (lib/sse.ts + streaming variant in app/api/llm-rewrite/route.ts + AIRewriteSection live preview); remaining items (multi-file propagation, swap-preserve-children, tool stickiness, mobile gestures, etc.) are still deferred. Read this AFTER `CLAUDE.md`, `plan.md`, and `maniuplation.md`.

> **Toolchain stays locked** (per `CLAUDE.md` rule 3 + `phase2-manipulation.md` line 5-15). No new top-level dependencies for the UX restructure itself. Dev-only additions for the infrastructure batch (Phase A): **Vitest** + **Prettier**. AI rewrite (Phase A5) uses the user's own OpenAI / Anthropic SDK call — no SDK pinned in `package.json`; we POST to the provider HTTP API directly with `fetch`.

---

## 0. Why this phase exists

Today's workspace is "always-on": every click selects, every drag triggers a gesture, every stroke in Monaco rewrites source. New visitors who land on the site and click around can accidentally rewrite an element before they understand the model. The goal of this phase is to flip the default to **view-only** and gate every edit behavior behind an explicit tool selection — Figma / Sketch / Photoshop's `V` for select, `M` for move, etc.

A second, equally important goal: **isolation as a first-class mode**. When the user picks an element, they aren't just adding a side-pane inspector — they're transported to a centered isolated edit context where the rest of the page dims away. The current `FocusEditor` already implements this; Phase 5 makes it the **only** edit context, removes the always-on canvas inspector, and centers the isolated element so working on it doesn't fight scroll.

Third goal: **swap and insert** as headline tools. Currently the only way to add a library asset is via the Editor's cursor position. Phase 5 introduces tool-mediated insert + swap so users can compose pages by clicking + picking, with no Monaco interaction.

The DiceBar is replaced by a horizontal **ToolBar** sitting in the same slot. The dice-as-mechanic concept is dropped; only the **palette swap** survives, relocated to the existing right-side library sidebar as a new "Palettes" section that respects the current scope (full page vs isolated subtree).

---

## 1. Locked decisions (do not relitigate)

User-confirmed in the planning conversation that produced this doc:

1. **Toolbar layout = horizontal strip** rendered between `WorkspaceHeader` and `PaneTabs`. Replaces `DiceBar` in the same slot. No floating left-rail palette. No header-internal placement.

2. **Tool set = exactly 5**: View · Select · Move · Insert · Swap.

3. **Default tool = View** on workspace mount. Persists across reloads via `localStorage["dropin:tool"]`. New visitors land on View.

4. **View tool = full-page-only.** Inside isolated mode (FocusEditor), the toolbar shows only the other 4 (Select, Move, Insert, Swap). View doesn't apply when the user is explicitly there to edit.

5. **Select tool = current click-to-FocusEditor flow.** Select active + click element = FocusEditor opens isolated. The element is **centered** (vertical + horizontal) instead of scrolling to top. This fixes the existing centering bug in `IsolatedPreview.tsx applyFocusChrome`.

6. **Move tool = current Phase 3 flow.** Drag-to-reorder + drag-to-reparent. Position handle visible only when Move is active; size/spacing/radius handles hidden in Move mode.

7. **Insert flow = (a)** — click Insert tool → cursor becomes "+" → click container on canvas → library sidebar opens scoped to "insert into <tag>" → user picks asset → asset lands as last child of the targeted container, fresh OIDs minted, new element selected, tool reverts to Select.

8. **Swap flow = (a)** — element must already be selected (precondition; toolbar disables Swap with a tooltip "Select an element first" otherwise) → click Swap → library opens scoped to "swap <tag>" → user picks replacement → element's byte range is replaced wholesale, fresh OIDs minted, new element selected, tool reverts to Select.

9. **Swap default semantics = discard children** of the swapped element. The library asset is opinionated about its own children. Preserve-children variant (Alt-click on library tile) is **deferred to v2** — non-trivial because it requires merging an asset's outer wrapper around the original element's children and the conflict cases (asset is self-closing, asset has its own required children) are messy. Re-evaluate when users actually request it.

10. **DiceBar removed entirely.** `<DiceBar />` is unmounted from `Workspace.tsx` and the `components/DiceBar.tsx` file is deleted. The dice mechanic is dropped as a UI pattern.

11. **Palette is the only roller mechanic surviving.** Moves into the existing library sidebar (`components/library/Sidebar.tsx`) as a new "Palettes" tab/section beside Components. Each palette tile applies that exact palette deterministically — no low/medium/high extremity (dropped).

12. **Palette scope respects current mode**: full-page swap when in normal workspace; **isolated subtree only** when user is inside FocusEditor's isolated mode. The palette engine accepts a `scope: { oids: string[] | "all" }` parameter.

13. **Font / Spacing / Radius dice DROPPED.** Per-element sliders (already shipped in FocusEditor) cover those edits at higher fidelity. The `lib/dice/fonts.ts`, `lib/dice/spacing.ts`, `lib/dice/radius.ts` modules are deleted.

14. **Phase 5 instance/everywhere = tool toggle**, not per-edit prompt. Header switch labelled `Apply: [instance · everywhere]` above the canvas. Persists per-session in localStorage. When everywhere is active AND the edit targets a known component instance (capitalized JSX tag with an inline definition in the same file), the patch propagates to the definition's JSX root. Multi-file pages: warn + fall back to instance.

15. **Custom preset delete = inline two-step confirm** (first × shows "Delete?" inline, second confirms). No `window.confirm` modal — too jarring.

16. **Breakpoint tabs = option (a)** — show only the active BP's value. Header gets `[Mobile · sm:][Tablet · md:][Desktop]` segmented (Desktop = no prefix). Inspector reads strip the prefix; writes prepend it.

17. **AI rewrite = BYO key.** User pastes their own OpenAI / Anthropic key into a one-time settings prompt; key persists in `localStorage` only (never sent to our server, never logged). A single `app/api/llm-rewrite/route.ts` endpoint relays the request to the provider's HTTP API (we don't pin an SDK to keep the bundle clean). The user owns the cost.

18. **CI hygiene scope** = **Prettier + Vitest only** for now. Lighthouse and bundle-size budgets fail PRs and need green-lit thresholds; defer until the team has set those numbers explicitly. Lint/ESLint also deferred — `tsc --noEmit` covers the major signal.

19. **Next bump 14.2.5 → 14.2.33** is a drop-in patch. API unchanged. Lifts the disclosed advisory.

---

## 2. Sub-phases

Phase 5 is split into three sequential sub-phases. **A blocks B blocks C.** Do not reorder. Each is one full session of focused work.

### Phase A — Infrastructure batch

Mechanical, low-risk changes that unblock the bigger UX shifts in B and C without touching the workspace UX itself. Most acceptance criteria here are "tests / typecheck pass".

#### A1. Bump Next 14.2.5 → 14.2.33

- Edit `package.json`: `"next": "14.2.33"`. Update `package-lock.json` via `npm install`.
- Verify `npx tsc --noEmit` clean (zero new errors).
- Smoke-check `app/layout.tsx` + `app/page.tsx` still build under the patch's new types (rare but possible).
- No code changes elsewhere.

#### A2. Vitest port

- Add devDeps: `vitest@^1`, `@vitest/coverage-v8` (optional, defer).
- Add `vitest.config.ts`:
  ```ts
  import { defineConfig } from "vitest/config";
  export default defineConfig({
    test: { include: ["tests/**/*.test.ts"], environment: "node" },
  });
  ```
- Port each `scripts/bench-*.mjs` to `tests/<name>.test.ts`. Each `assertEq` / `assertTrue` becomes a `it("...", () => { expect(got).toEqual(want); })`. Inlined helpers stay (don't import `lib/` — keep tests isolated like the bench tradition). 24 test files = 24 source bench files at parity.
- Add npm scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.
- **Bench scripts stay**. `scripts/bench-*.mjs` continue to work as parallel one-offs until Phase B fully retires them. Don't mass-delete in A — the parallel-bench tradition catches drift between Vitest's port and the inlined bench logic.

#### A3. Prettier

- Add devDep: `prettier@^3`.
- Add `.prettierrc.json` (read 3-5 existing files first to choose options that match):
  ```json
  {
    "semi": true,
    "singleQuote": false,
    "tabWidth": 2,
    "trailingComma": "all",
    "printWidth": 80,
    "endOfLine": "lf"
  }
  ```
  (Adjust based on what the existing code actually uses. The above matches what I observed in `components/FocusEditor.tsx` and `lib/style-presets.ts`.)
- Add `.prettierignore`: `node_modules/`, `.next/`, `web/` (templates), `public/`, `package-lock.json`.
- Add npm scripts: `"format": "prettier --write ."`, `"format:check": "prettier --check ."`.
- **Do NOT** run `prettier --write .` and commit the resulting reformat in this phase. That's a noisy diff. Run `format:check` once to see what would change, write the result to `phase5-prettier-diff-preview.txt`, surface to the user. Reformat happens only when the user explicitly says go.
- **No CI hook yet.** This phase ships the tooling; CI integration waits until the user is happy with the format.

#### A4. Custom preset delete confirm

- In `components/FocusEditor.tsx` `PresetTile` component (the variant added in eighteenth-pass).
- Replace the immediate `onRemove()` call with a two-step inline confirm. Local state `confirmingDelete: boolean` per tile (component-local, ephemeral — no persistence).
- First × click: `setConfirmingDelete(true)`. The × button swaps to a "Delete?" label with a 4-second auto-revert timer.
- Second click within the 4-second window: actually `onRemove()`.
- Click anywhere else (or Esc): cancel. Re-enable × button.
- Fire-and-forget — no toast.

#### A5. BYO-key AI rewrite

Two pieces. Implement in this order so the API route is testable before the UI calls it.

##### A5.1. `app/api/llm-rewrite/route.ts`

- Single POST handler. Body shape:
  ```ts
  type RewriteRequest = {
    provider: "openai" | "anthropic";
    apiKey: string;        // user's key, passed from client
    model?: string;        // optional override; sane defaults per provider
    prompt: string;        // user's freeform "make this better" text
    elementSource: string; // the selected element's source bytes
    classes: string[];     // current classes
  };
  type RewriteResponse =
    | { ok: true; classes: string[]; explanation?: string }
    | { ok: false; error: string };
  ```
- Provider defaults: `openai` → `gpt-4o-mini`; `anthropic` → `claude-haiku-4-5-20251001`. Cheapest model per provider that produces solid Tailwind class output.
- The route forwards to the provider's HTTP API (no SDK):
  - **OpenAI**: `POST https://api.openai.com/v1/chat/completions` with `Authorization: Bearer ${apiKey}`. Body shape per provider docs. Use `response_format: { type: "json_object" }` so the LLM returns parseable `{ classes: [...], explanation: "..." }`.
  - **Anthropic**: `POST https://api.anthropic.com/v1/messages` with `x-api-key: ${apiKey}` and `anthropic-version: 2023-06-01`. Use a system prompt that requires JSON-only output.
- Server prompt (kept here so it's pinned and reviewable):
  ```
  You are a Tailwind CSS class rewriting assistant. Given the user's element
  source, current Tailwind classes, and a freeform prompt, return ONLY a JSON
  object with `classes` (string[]) — the new full class list to apply. No
  prose, no markdown fences.

  Constraints:
  - Use ONLY Tailwind 3.4 utility classes.
  - Preserve layout-critical classes (display, flex/grid alignment, gap,
    width, height, position) unless the prompt explicitly asks to change
    them.
  - Match the surrounding template's palette family if the prompt doesn't
    specify a different one.
  - Prefer arbitrary-value classes (`bg-[#hex]`) only when palette tokens
    can't express it.
  ```
- **Hard rule**: the user's API key is in the request body, never logged on the server, never persisted. Add a `console.log` redactor for safety: `apiKey: "[redacted]"` if anything in this route ever logs.
- Rate limit at the route level: max 5 requests per IP per minute. Use a small in-memory map keyed by `req.headers.get("x-forwarded-for")`. (Per Vercel's docs, `x-forwarded-for` is reliable on their platform.)
- Errors: 401 from provider → return `{ ok: false, error: "Invalid API key" }`. 429 → `"Rate limited by provider"`. Network failure → `"Provider unreachable"`. Unparseable JSON response → `"Provider returned non-JSON output"`.

##### A5.2. UI

- New section in `FocusEditor.tsx` right pane: "AI Rewrite" — collapsed by default (use the existing `<Section label="…">` pattern with a click-to-expand chevron).
- First-open flow: section renders a "Set your API key" panel asking for provider toggle (OpenAI / Anthropic) + key input. Key + provider persist to `localStorage["dropin:ai-key"]` and `localStorage["dropin:ai-provider"]`. After save, section flips to the rewrite UI.
- Rewrite UI: textarea ("What would you like to change?") + "Rewrite" button. On submit:
  - `extractJsxElement(code, loc)` to get the source bytes for the selected element.
  - POST to `/api/llm-rewrite` with the body above.
  - On success: `applyClasses(response.classes)` — single Monaco edit, Cmd+Z reverts.
  - On error: showWarn toast.
- "Change my key" link in the rewrite UI footer to re-open the key input.

#### A6. Breakpoint tabs

- New segmented in `WorkspaceHeader`: `[Mobile · sm:][Tablet · md:][Desktop]`. Three buttons.
- New state in Workspace: `breakpoint: "mobile" | "tablet" | "desktop"`. Default `"desktop"`. Persists in `localStorage["dropin:breakpoint"]`.
- The breakpoint controls TWO things:
  1. **Inspector writes**: every Tailwind class change auto-prefixes with `sm:` (mobile) or `md:` (tablet). Desktop = no prefix (already the implicit "all sizes" / largest case in mobile-first).
  2. **Inspector reads**: when displaying current values (slider positions, color picker pre-fill, etc.), strip the active prefix before reading. So if the source has `sm:bg-blue-500 md:bg-red-500 bg-green-500` and the active BP is mobile, the slider shows blue.
- Mechanics: `tailwind-slider-maps.ts` `currentIndex`, `setScale`, `setToken`, `colorMatch`, etc. all gain an optional `prefix` arg. `prefix === ""` (default) preserves today's behaviour. `prefix === "sm:"` filters classes to only those starting with `sm:` for reads, and prepends `sm:` on writes.
- Viewport segmented (the existing one in `Toolbar.tsx`) and the breakpoint segmented are **independent** by default but the obvious UX nudge is to keep them in sync. Implementation: when breakpoint changes, viewport follows (mobile→`mobile` viewport, tablet→`tablet`, desktop→`desktop`). Inverse coupling (changing viewport drives breakpoint) is **deferred** — viewport may be used to test responsive layouts at a different BP than where edits target.
- Edge case: existing element classes might have `sm:` prefixed already AND also unprefixed. The slider should report the prefixed value when BP is active and fall back to unprefixed when no prefixed class exists. Same for writes — if the source has `bg-blue-500` and BP=mobile, writing red produces `bg-blue-500 sm:bg-red-500` (additive), not `sm:bg-red-500` only.
- One exception: when the slider's new value MATCHES the unprefixed value, drop the prefixed class entirely (it's redundant).

#### A7. IsolatedPreview centering bug fix

- Today: `applyFocusChrome` in `components/IsolatedPreview.tsx` (~line 121) calls `selected.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })` after 80 ms and 300 ms timeouts. This positions the element at viewport center BUT only if the document is tall enough — for short documents, the element ends up at the natural top because there's nothing above it to scroll past.
- Fix: in addition to scrollIntoView, when in **isolated mode** (`mode === "isolated"`), inject CSS that turns the iframe body into a flex centering container:
  ```css
  body {
    background: #F5F1EA !important;
    min-height: 100vh !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 24px !important;
    box-sizing: border-box !important;
  }
  body > *:not([data-dropin-hidden]):not([data-dropin-dimmed]) {
    margin: auto !important;
  }
  ```
  This makes the un-hidden elements naturally center even in a short document.
- For **in-page mode** (`mode === "in-page"`), keep today's behaviour — the dimmed siblings provide the visual context the user wants, scrolling to center via scrollIntoView is fine.
- Dynamic-height edge case: if the user resizes the iframe (window resize, viewport change), the centering should re-apply. Today's effect handles re-runs via the `mode` dep in the useEffect; that's already correct since mode changes trigger applyFocusChrome.
- Test by opening the navbar element on the hero-landing template — it's at the document top, currently lands at top of iframe; should land at center after fix.

#### A8. Drop the DiceBar shell

- Remove `<DiceBar code={code} onRoll={handleDiceRoll} />` from `Workspace.tsx` (around line 1457).
- Remove the `import DiceBar from "./DiceBar"` line.
- Remove `handleDiceRoll` callback (no longer used).
- Delete `components/DiceBar.tsx` entirely.
- **Keep** `lib/dice/palettes.ts` and `lib/dice/rng.ts` for Phase C reuse (Library Palettes section will pull from `palettes.ts`).
- **Delete** `lib/dice/fonts.ts`, `lib/dice/spacing.ts`, `lib/dice/radius.ts`, `lib/dice/roller.ts`, `lib/dice/roller-types.ts`.
- Update memory file pointer if it references DiceBar.

#### A9 (optional). Memory + bench cleanup

- Update `memory/project_phase4_polish_session.md` "Still pending" to mark which items Phase A clears.
- Re-run `for b in scripts/bench-*.mjs; do node "$b"; done` and confirm 693/693 still passes.
- Run `npm run test` (Vitest) and confirm same count.
- Run `npx tsc --noEmit` exit 0.
- Run `npm run format:check` — write the diff preview to `phase5-prettier-diff-preview.txt`, surface to user.

#### Acceptance criteria — Phase A

- [ ] `package.json` shows `"next": "14.2.33"`.
- [ ] `npx tsc --noEmit` exit 0 (no new errors from Next bump).
- [ ] `npm run test` (Vitest) green at parity with `bench-*.mjs` (24 files).
- [ ] `npm run format:check` runs without crash; diff preview captured.
- [ ] All 24 `bench-*.mjs` still pass (parallel until Phase B).
- [ ] Workspace renders without DiceBar; no console errors about missing components.
- [ ] BYO-key AI rewrite section appears in FocusEditor; first-open prompts for key; subsequent uses bypass prompt.
- [ ] AI rewrite end-to-end with a real OpenAI key produces a class change Monaco edit.
- [ ] Rate limit on `/api/llm-rewrite` rejects request 6 within a minute window.
- [ ] Breakpoint tabs in header switch between desktop/tablet/mobile; sliders auto-prefix `sm:` / `md:` on edit; reads strip prefix.
- [ ] FocusEditor isolated mode centers elements vertically + horizontally for both top-of-document elements (navbar) and bottom-of-document elements (footer).
- [ ] Custom preset × delete shows inline "Delete?" confirm; second click within 4 s deletes.
- [ ] `lib/dice/fonts.ts`, `spacing.ts`, `radius.ts`, `roller.ts`, `roller-types.ts` deleted.

---

### Phase B — Tool toolbar + tool-mode state machine

Adds the headline UX shift: read-only-by-default workspace, tool-gated interactions, and the new ToolBar component.

#### B1. `components/ToolBar.tsx`

- New component, ~120 LOC.
- Horizontal strip rendered between `WorkspaceHeader` and `PaneTabs` (replaces the DiceBar slot from Phase A).
- 5 buttons in a row: View · Select · Move · Insert · Swap.
- Each button: 36×36 icon + label below at desktop, icon-only with tooltip at sub-768 px.
- Active tool: coral fill (#FF4D2E) + paper text. Inactive: paper bg + ink text + subtle border.
- Disabled state: e.g. Swap when no selection — opacity 0.4, cursor not-allowed, tooltip "Select an element first".
- Keyboard shortcuts (bound at window level via Workspace, NOT inside the component): `V` view, `S` select, `M` move, `I` insert, `W` swap. Skips when `document.activeElement` is in Monaco / contenteditable / `<input>` / `<textarea>`.
- Icons: inline SVG only (don't add `lucide-react` etc — locked stack). Hand-craft 5 simple icons:
  - **View**: eye outline
  - **Select**: arrow cursor
  - **Move**: 4-way directional arrows
  - **Insert**: square + plus
  - **Swap**: two arrows in opposite directions

#### B2. Tool state in Workspace

- `type Tool = "view" | "select" | "move" | "insert" | "swap"`.
- `[tool, setTool] = useState<Tool>(...)` initialized from `localStorage["dropin:tool"]` (default `"view"`).
- `useEffect` persists tool changes back to localStorage.
- Selecting a tool:
  - Clears any in-flight gesture state via existing `gestureRef.current = null` machinery (or a new `clearAllGestures()` helper that ToolBar calls).
  - Closes the FocusEditor only when leaving Select/Move (Insert/Swap shouldn't close it — those tools may invoke flows from inside the focus context too).
  - Switching FROM insert/swap mid-flow with no completed action should bail the flow (clear `insertTargetOid`, clear swap target).

#### B3. Gate Preview interactions

- `Preview.tsx` accepts new prop `tool: Tool`.
- The `<SelectionOverlay>` wrapper renders only when `tool === "select" || tool === "move"`. Otherwise the overlay is unmounted entirely.
- `SelectionOverlay` accepts `tool: "select" | "move"` (narrowed):
  - `tool === "select"`: paints the bbox + size handles + spacing handles, position handle HIDDEN.
  - `tool === "move"`: paints the bbox + position handle visible, size/spacing handles HIDDEN.
- Iframe-side gating: the iframe runtime needs to know the current tool to gate its own click handler (today's `dropin:select` post on click). Add new host→iframe message:
  ```ts
  | { type: "dropin:set-tool"; tool: Tool }
  ```
  Iframe stores the current tool in a module-level var `var DROPIN_TOOL = 'view';`. Click handler bails when `DROPIN_TOOL === 'view'` (no select post). Hover-target outline only paints when `DROPIN_TOOL === 'select' || DROPIN_TOOL === 'move'`.
- Insert/Swap tools have their own iframe-side hover behaviours — see C1/C2.
- Replays the tool message on every `dropin:ready` so iframe rebuilds (srcDoc swaps) re-receive the current tool.

#### B4. Tool toolbar inside FocusEditor

- FocusEditor's existing header (back arrow + breadcrumb + Done) gets a tool toolbar row INSIDE it (between the header bar and the main content).
- The toolbar inside FocusEditor shows ONLY 4 tools: Select · Move · Insert · Swap. View is omitted.
- Tool state is shared with Workspace (single source of truth). Switching tools inside FocusEditor updates Workspace's `tool` state. When user exits FocusEditor (via Done / Esc / Back), tool resets to View by default — UNLESS the user explicitly wants to keep the tool sticky. **Default: reset to View on exit.** If users complain, flip to "stick to last tool". Add a memory note for follow-up.

#### B5. Gesture state cleanup on tool change

- The existing gesture state machinery in `SelectionOverlay.tsx` has multiple per-gesture refs (`pendingFlipRef`, `moveTargetSnapshot`, `additionalRectsRef`, etc.). Add a `useEffect` that watches `tool` and clears all of them on change:
  ```ts
  useEffect(() => {
    pendingFlipRef.current = null;
    setMoveTargetSnapshot(null);
    // etc.
  }, [tool]);
  ```
- Test: start a Move drag, hit `S` mid-drag — the drag should snap back to canonical position without committing.

#### B6. FirstOpenTour update

- The existing `components/FirstOpenTour.tsx` has 3 steps describing today's always-on model. Rewrite the steps for the tool-mediated model:
  1. "Pick a tool" — tooltip points at ToolBar
  2. "Each tool does one thing" — explain View / Select / Move briefly
  3. "Press V anytime to return to View" — escape hatch
- Keep the localStorage `dropin:tour-completed` key but bump version: `dropin:tour-completed-v2`. So existing users who completed the v1 tour see the v2 tour once.

#### B7. Tool tooltips

- Each ToolBar button has a `title` attribute or a custom tooltip that appears on hover after 500 ms.
- Tooltip text:
  - **View** — "Look around. No edits." (V)
  - **Select** — "Click an element to edit it." (S)
  - **Move** — "Drag elements to reorder or move them." (M)
  - **Insert** — "Click a container to add a new element from the library." (I)
  - **Swap** — "Replace the selected element with one from the library." (W)

#### Acceptance criteria — Phase B

- [ ] Default workspace state = View; clicking the canvas does NOTHING (no selection, no FocusEditor open, no chrome paint).
- [ ] Pressing `V` / `S` / `M` / `I` / `W` switches tools (when focus is not in a text field).
- [ ] ToolBar's active tool has coral fill; inactive tools paper.
- [ ] Select tool: click element on canvas → FocusEditor opens isolated; element centered (Phase A's fix in play).
- [ ] Move tool: SelectionOverlay paints with position handle visible; size/spacing handles hidden. Drag works.
- [ ] Tool persists across page reloads.
- [ ] FocusEditor header shows the tool toolbar with View omitted.
- [ ] Switching tools mid-gesture cleans up the in-flight gesture state.
- [ ] First-open tour fires once per user with the new v2 steps.
- [ ] Phase A acceptance still passes.

---

### Phase C — Insert, Swap, Phase 5 toggle, library Palettes

The headline new behaviors. Heaviest sub-phase. Likely splits into C1+C2 if context constrains it.

#### C1. Insert tool wiring

##### C1.1. AST operation engine — `lib/ast/operations/insert.ts`

- Pure module, ~180 LOC. Mirrors the structure of `applyDuplicate` and `applyReparent`.
- Signature: `applyInsertChild(source: string, op: { parentOid: string; jsx: string }): { source: string; unchanged: boolean; reason: string | null; insertedOid: string | null }`.
- Algorithm:
  1. Parse source via `@babel/parser`.
  2. Find parent JSXElement by `parentOid`. Bail if not found.
  3. Reject self-closing parents (`<img/>`). Bail with reason "Can't insert into self-closing element".
  4. Reject leaf-tag parents per Phase 3's `DROPIN_LEAF_TAGS` set. Bail with reason "Can't insert into <input>".
  5. Parse the asset (`op.jsx`) as a JSX expression. If parse fails, bail.
  6. Mint fresh OIDs across every element in the asset subtree (mirror `applyDuplicate`'s `mintFresh` logic — seen-set built from the entire pre-insert source via `collectAllOids`).
  7. Capture the asset's root OID into `insertedOid`.
  8. Determine indent: take the leading whitespace pattern of `parent.children[parent.children.length - 1]` (last child) and reuse it. If parent has no children, use `"\n  "` default.
  9. Magic-string `s.appendLeft(parent.closingElement.start, indent + assetWithFreshOids)`.
  10. Return.
- Bench: `scripts/bench-insert.mjs` + `tests/insert.test.ts`. ~25 cases: empty parent / one-child parent / many-children parent / nested asset / fresh OID uniqueness / self-closing parent bail / leaf-tag parent bail / parse-fail asset bail / parent-not-found bail / round-trip preservation.

##### C1.2. Iframe-side hover hit-testing

- The existing Phase 3 `dropinComputeDropTargets(excludeOids)` walker (in `lib/preview.ts`) already does most of the work. Insert mode reuses it with `excludeOids: []` (no element to exclude — we're not moving anything).
- New iframe runtime function `dropinSetInsertHover(targetOid: string | null)`:
  - Stash a per-OID outline rule in the live stylesheet keyed by `[data-dropin-id="${oid}"]` with green dashed outline + green-tinted fill.
  - Clear on null.
- Host-side: when `tool === "insert"` AND not inside an isolated context, every iframe pointermove emits a hit-test → host posts `dropin:insert-hover { oid }` to update the green outline.
- Click in insert mode: host posts `dropin:insert-target-confirmed { oid }` (this is just the hit-tested oid). Workspace stores it as `insertTargetOid`, opens the library sidebar with a "Insert into <tag>" header.

##### C1.3. Library sidebar Insert flow

- `components/library/Sidebar.tsx` accepts a new `insertContext?: { mode: "insert"; targetTag: string }` prop.
- When non-null, sidebar header changes to "Insert into <tag>" and the asset cards' click handler fires the new `onInsert(parentOid, assetSource)` instead of the existing `onInsert(text, opts)`.
- Workspace's new handler:
  ```ts
  const handleInsertInto = useCallback(
    (assetSource: string) => {
      if (!insertTargetOid) return;
      const result = applyInsertChild(code, { parentOid: insertTargetOid, jsx: assetSource });
      if (result.unchanged) { showWarn(`Insert: ${result.reason}`); return; }
      setCode(result.source);
      if (result.insertedOid) {
        setSelection(s => ({ ...s, oid: result.insertedOid! /* re-fetched on rebuild */ }));
      }
      setInsertTargetOid(null);
      setTool("select"); // bump back to Select after insert
    },
    [insertTargetOid, code]
  );
  ```

##### C1.4. Insert in isolated mode

- When user is in FocusEditor's isolated view AND tool === "insert", the same flow applies but the iframe is the IsolatedPreview iframe.
- IsolatedPreview gains `tool: Tool` prop + the same `dropin:set-tool` message routing as Preview.
- Hit-testing happens against the isolated subtree's OIDs only — the `applyFocusChrome` already hides non-isolated elements via `data-dropin-hidden`, so the walker's natural filter (only visible OIDs) excludes them.
- Library sidebar in isolated mode... wait: FocusEditor doesn't currently mount the library sidebar. Decision: in isolated mode, when Insert is clicked, open the library sidebar AS A MODAL overlaid on the FocusEditor. New component `<LibraryModal>` reuses the Sidebar's tile rendering but sized as a 600×800 modal at the right edge of the focus view.

#### C2. Swap tool wiring

##### C2.1. AST operation engine — `lib/ast/operations/swap.ts`

- Pure module, ~150 LOC.
- Signature: `applySwap(source: string, op: { oid: string; jsx: string }): { source: string; unchanged: boolean; reason: string | null; swappedOid: string | null }`.
- Algorithm:
  1. Parse source. Find element by OID. Bail if not found.
  2. Top-level bail: if the element is the JSX root (no parent JSXElement), bail with reason "Can't swap the root element".
  3. Capture byte range `[srcEl.start, srcEl.end]`.
  4. Parse the asset. Bail on parse failure.
  5. Mint fresh OIDs for the asset subtree.
  6. Capture asset's root OID into `swappedOid`.
  7. Magic-string `s.overwrite(srcEl.start, srcEl.end, assetWithFreshOids)`.
  8. Return.
- **Discard children semantics**: the asset replaces the entire element including its children. No merging.
- Bench: `scripts/bench-swap.mjs` + `tests/swap.test.ts`. ~22 cases: simple swap, nested-children-discarded, nested asset / fresh OID uniqueness, top-level bail, oid-not-found bail, parse-fail bail, attribute preservation (asset's attrs win), neighbour preservation (siblings untouched), round-trip.

##### C2.2. Library sidebar Swap flow

- Sidebar accepts `swapContext?: { mode: "swap"; targetTag: string; targetOid: string } | null`.
- Header reads "Swap <tag>" when active.
- Cards' click handler fires `onSwap(targetOid, assetSource)`.
- Workspace handler:
  ```ts
  const handleSwap = useCallback(
    (oid: string, assetSource: string) => {
      const result = applySwap(code, { oid, jsx: assetSource });
      if (result.unchanged) { showWarn(`Swap: ${result.reason}`); return; }
      setCode(result.source);
      if (result.swappedOid) setSelection(s => ({ ...s, oid: result.swappedOid! }));
      setTool("select");
    },
    [code]
  );
  ```

##### C2.3. Swap in isolated mode

- Same as Insert in isolated — if user is in FocusEditor and triggers Swap, the LibraryModal opens with swap context.
- The swapped element re-isolates: the FocusEditor's selection updates to the new `swappedOid`, and the IsolatedPreview re-applies focus chrome on the new element.

#### C3. Phase 5 instance/everywhere toggle

- New segmented in `WorkspaceHeader` (or above the canvas?): `[Apply: instance · everywhere]`.
- State `propagationMode: "instance" | "everywhere"` in Workspace. Persists in `localStorage["dropin:propagation"]`.
- Default `"instance"` (current behaviour).
- Detection: an element is a "component instance" iff its tag matches a capitalized identifier that has an inline JSX function definition in the same source file. Reuse `groupRootOids` machinery from Workspace.
- When `propagationMode === "everywhere"` AND the user edits a className on a component instance:
  1. The patch fires normally on the call site.
  2. Then a SECOND patch fires on the component definition's JSX root element in the same file. The definition lookup uses `@babel/parser`'s scope to find the matching `function ComponentName() { return ( <...> ) }` or `const ComponentName = () => <...>`.
  3. The two edits are squashed into a single Monaco setCode (one undo entry).
- Multi-file pages: defer. If the import statement points outside the current file, fall back to instance + show a warn toast: "everywhere mode requires single-file definitions today".

#### C4. Library Palettes section

##### C4.1. `lib/palettes.ts` (cleaned-up registry)

- Drop the dice-shape `roller.ts` dependency.
- Export `PALETTES: ReadonlyArray<Palette>` where `Palette = { id, name, families: { primary: string; neutral: string; accent: string }, swatch: { primary: string; neutral: string; accent: string; bg: string; fg: string } }`.
- Migrate existing palettes from `lib/dice/palettes.ts` (12 palettes — warm / cool / monochrome / retro / neon / pastel / earth / cyberpunk / etc.).

##### C4.2. `lib/ast/operations/palette.ts`

- Pure module. `applyPalette(source: string, op: { palette: Palette; scope: { oids: string[] } | "all" }): { source: string; unchanged: boolean; reason: string | null }`.
- Algorithm:
  1. Walk `source` token-by-token (no AST needed — class swaps are atomic Tailwind tokens inside `className="..."` attribute values; reuse the regex pattern from the old `lib/dice/roller.ts`).
  2. For each `bg-{family}-{shade}`, `text-{family}-{shade}`, `border-{family}-{shade}` token: if the family is one of the palette's source families AND (scope is "all" OR the token is inside an OID-bearing element whose oid is in scope.oids), rewrite it to the destination family at the same shade.
  3. Skip arbitrary-value classes (`bg-[#hex]`).
  4. Skip neutral-family swaps when destination palette's neutral is also neutral (preserves text readability — locked decision from the old dice spec).
- Bench: `scripts/bench-palette-apply.mjs` + `tests/palette-apply.test.ts`. ~30 cases.

##### C4.3. `components/library/PalettesSection.tsx`

- New component, ~100 LOC.
- Renders inside the existing `Sidebar.tsx` between Search and ComponentGrid (or as a tab).
- Tile grid (3 cols on desktop, 2 on mobile). Each tile shows the 5-color swatch + palette name.
- Click → `onApplyPalette(paletteId, scope)`. Workspace handler routes through `applyPalette`.
- Scope determined by Workspace state: if FocusEditor is open, scope = `{ oids: visibleIsolatedOids }`; else scope = `"all"`.
- The "visibleIsolatedOids" is built from the iframe's tree under the focused element. New iframe-side helper `dropinCollectSubtreeOids(rootOid)` returns the OIDs in the subtree.

#### C5. Final cleanup

- Delete remaining `lib/dice/` files (only `palettes.ts` and `rng.ts` survived from Phase A). Now `palettes.ts` migrates to `lib/palettes.ts` (top-level), and `rng.ts` is no longer needed (palette swap is deterministic — drop). Result: `lib/dice/` directory removed entirely.
- Update `MEMORY.md` and `project_phase4_polish_session.md` to note Phase 5 completion.

#### Acceptance criteria — Phase C

- [ ] Insert tool: View workspace → press `I` → click a `<section>` → library sidebar header reads "Insert into section" → click a Card asset → Card lands as last child of the section, fresh OIDs minted, new element selected, tool reverts to Select.
- [ ] Insert into self-closing parent: pre-hit-test bail with red ineligible feedback (reuses Phase 3 polish's red-dashed outline).
- [ ] Swap tool: Select tool first, click an element to select it → press `W` → library opens "Swap <tag>" → pick a Hero asset → original element replaced wholesale, children discarded, new element selected, tool reverts to Select.
- [ ] Swap with no selection: Swap button disabled with tooltip "Select an element first".
- [ ] Phase 5 toggle: in `instance` mode, edit a `<Card>` instance's bg color → only that one card changes. In `everywhere` mode, same edit propagates to the `Card` definition; all cards in the page change.
- [ ] Library Palettes section renders 12 palette tiles. Click → page palette swaps. In FocusEditor isolated mode, palette swap touches only the isolated subtree's OIDs.
- [ ] Insert + Swap work in isolated mode via LibraryModal.
- [ ] `lib/dice/` directory deleted; no broken imports.
- [ ] `npm run test` green.
- [ ] Phases A + B acceptance still passes.

---

## 3. File map (additions, modifications, deletions)

### Phase A

**Added**:
- `app/api/llm-rewrite/route.ts`
- `tests/<24 files>.test.ts`
- `vitest.config.ts`
- `.prettierrc.json`
- `.prettierignore`
- `phase5-prettier-diff-preview.txt` (transient — surface to user; remove after they decide)

**Modified**:
- `package.json` (Next bump, vitest+prettier devDeps, scripts)
- `package-lock.json` (regenerated)
- `components/Workspace.tsx` (drop DiceBar, add breakpoint state, AI rewrite handler, custom-preset confirm propagation)
- `components/FocusEditor.tsx` (AI rewrite section, custom-preset two-step confirm)
- `components/IsolatedPreview.tsx` (centering CSS injection in isolated mode)
- `components/Toolbar.tsx` (header — breakpoint segmented added)

**Deleted**:
- `components/DiceBar.tsx`
- `lib/dice/fonts.ts`
- `lib/dice/spacing.ts`
- `lib/dice/radius.ts`
- `lib/dice/roller.ts`
- `lib/dice/roller-types.ts`

### Phase B

**Added**:
- `components/ToolBar.tsx`

**Modified**:
- `components/Workspace.tsx` (tool state, ToolBar mount, gating logic, keyboard shortcuts at window level)
- `components/Preview.tsx` (tool prop, gate handlers, dropin:set-tool replay on ready)
- `components/IsolatedPreview.tsx` (tool prop, dropin:set-tool replay)
- `components/SelectionOverlay.tsx` (gate gesture handlers + handle visibility by tool)
- `components/FocusEditor.tsx` (tool toolbar in header — 4 tools, no View)
- `components/FirstOpenTour.tsx` (v2 steps for tools model)
- `lib/preview.ts` (DROPIN_TOOL var, gate click handler + hover outline by tool)
- `lib/iframe-bridge.ts` (new `dropin:set-tool` host→iframe message)

### Phase C

**Added**:
- `lib/ast/operations/insert.ts`
- `lib/ast/operations/swap.ts`
- `lib/ast/operations/palette.ts`
- `lib/palettes.ts` (clean registry, replaces `lib/dice/palettes.ts`)
- `components/library/PalettesSection.tsx`
- `components/library/LibraryModal.tsx` (modal-mode wrapper for the Sidebar reused inside FocusEditor)
- `scripts/bench-insert.mjs` + `tests/insert.test.ts`
- `scripts/bench-swap.mjs` + `tests/swap.test.ts`
- `scripts/bench-palette-apply.mjs` + `tests/palette-apply.test.ts`

**Modified**:
- `components/Workspace.tsx` (insertTargetOid state, propagationMode toggle, handleInsertInto, handleSwap, handleApplyPalette, scope resolver)
- `components/library/Sidebar.tsx` (insertContext + swapContext props, header swap, click handler dispatch)
- `components/Preview.tsx` + `components/IsolatedPreview.tsx` (dropin:insert-hover wire)
- `lib/preview.ts` (dropinSetInsertHover, dropinCollectSubtreeOids)
- `lib/iframe-bridge.ts` (dropin:insert-hover, dropin:insert-target-confirmed)
- `components/FocusEditor.tsx` (LibraryModal mount when insert/swap active inside isolated)

**Deleted**:
- `lib/dice/palettes.ts` (migrated to `lib/palettes.ts`)
- `lib/dice/rng.ts`
- `lib/dice/` directory (now empty)

---

## 4. Architecture decisions (locked)

### 4.1. Tool state lives in Workspace, propagated via props

No React Context, no Zustand, no Redux (locked stack rule). The `tool` state is a single `useState` in Workspace, passed as a prop to `Preview`, `IsolatedPreview`, `ToolBar`, `FocusEditor`. This is the pattern used today for `selection`, `kind`, `viewport` etc — Phase 5 stays in line.

### 4.2. Iframe receives the tool via a postMessage

The iframe's runtime (`lib/preview.ts` IIFE block) runs in its own context — it can't read React state directly. A new `dropin:set-tool` message synchronizes the host's tool state to a module-level var inside the iframe. The host re-sends the message on every `dropin:ready` so iframe rebuilds catch up.

### 4.3. Insert and Swap reuse the existing library sidebar — they don't fork

The library sidebar (`components/library/Sidebar.tsx`) already renders asset tiles with click-to-insert behaviour. Phase C adds context props (`insertContext`, `swapContext`) that change the header label and rebind the click handler — no parallel UI for insert/swap.

Inside FocusEditor, the sidebar is mounted as a modal (`LibraryModal`) since the focus view doesn't have room for a side rail.

### 4.4. AI rewrite uses fetch to the provider HTTP API directly

No `openai` or `@anthropic-ai/sdk` package added — those would balloon the bundle and we only need `fetch`. The user's API key never lands on our server in any persistent form (no logs, no DB, redacted in any error path).

### 4.5. Phase 5 propagation is single-file in v1

Multi-file component-instance propagation (where `<Card>` is imported from `./components/Card.tsx`) requires multi-file edits, multi-file Monaco editor support, and a story for what happens when the definition file is checked-in vs ephemeral. That's its own multi-session phase. v1 supports inline definitions only — file-internal `function Card() { return <div>...</div> }`.

### 4.6. Swap discards children, no exceptions in v1

The "preserve children" variant (Alt-click swap) is deferred. The conflict cases (asset is self-closing, asset has its own opinionated children) make it non-trivial. Re-evaluate after users actually use Swap and ask for it.

### 4.7. Palette extremity (low/medium/high) dropped

Each palette tile applies that palette deterministically — same input source produces same output. The dice's "extremity" was a randomness knob that doesn't fit a click-to-apply UI.

### 4.8. View tool is full-page-only

Inside FocusEditor's isolated mode, the user is explicitly there to edit. Adding a "view" tool inside isolated would be a distraction — the user can hit Done / Esc / Back to exit and return to View at the workspace level.

---

## 5. Open questions / future work (DO NOT SHIP IN PHASE 5)

- **Multi-file component instance propagation** — a Phase 6 candidate.
- **Swap with preserve-children** — Alt-click variant, deferred.
- **Tool stickiness on FocusEditor exit** — currently resets to View on exit; users may prefer it to stick.
- **Lighthouse / bundle-size CI hygiene** — needs explicit thresholds before adding to CI; deferred.
- **Lint / ESLint config** — `tsc --noEmit` covers the major signal today; deferred.
- **Palette extremity revisit** — only re-add if users explicitly ask for "shuffle within a palette family".
- **Tool drag-to-reorder in tree** — the tree's row-DnD ask is a Phase 6 candidate; today's Move tool covers the canvas case.
- **Multi-element insert** — Insert tool currently single-target. If a user wants to "insert N copies of this asset into N containers", that's a v2.
- **AI rewrite streaming** — current design is request/response. SSE streaming would let the user see the model's class output appear progressively. Defer.

---

## 6. Acceptance criteria (overall — Phase 5 complete when ALL pass)

1. Default workspace = View tool, no canvas interaction.
2. Switching to Select + click → enters FocusEditor isolated; element centered vertically + horizontally.
3. Move tool drag → reorder/reparent (Phase 3 behaviour, gated behind tool).
4. Insert tool: click container → library opens scoped to "Insert into <tag>" → pick asset → child added with fresh OIDs.
5. Swap tool: selection precondition → click Swap → library opens scoped to "Swap <tag>" → pick asset → element replaced (children discarded), fresh OIDs.
6. Library has Palettes section; click swaps page palette.
7. Palette scope respects mode: full-page in workspace; isolated subtree only in FocusEditor.
8. Phase 5 propagation toggle: instance vs everywhere works for inline component definitions in the same file.
9. AI rewrite gated behind user-supplied API key (OpenAI or Anthropic); key persists in localStorage only.
10. Breakpoint tabs `[Mobile · sm:][Tablet · md:][Desktop]` prefix slider edits; reads strip prefix.
11. Custom preset delete confirms before removing (inline two-step).
12. Vitest test suite green.
13. Prettier passes (or diff preview surfaced — reformat happens only on explicit user go).
14. Next 14.2.33 in `package.json`.
15. `lib/dice/` directory deleted; no broken imports.
16. All previous phase acceptance still passes (Phase 1, 2, 3, 4 polish).

---

## 7. Build sequence summary

```
Phase A (1 session)
  A1. Next bump
  A2. Vitest
  A3. Prettier
  A4. Custom preset two-step confirm
  A5. AI rewrite (route + UI)
  A6. Breakpoint tabs
  A7. IsolatedPreview centering fix
  A8. Drop DiceBar shell
  A9. Cleanup + verify

Phase B (1 session — depends on A)
  B1. ToolBar component
  B2. Tool state in Workspace
  B3. Gate Preview interactions by tool
  B4. ToolBar inside FocusEditor
  B5. Gesture cleanup on tool change
  B6. FirstOpenTour v2
  B7. Tool tooltips

Phase C (1 session — depends on B; may split into C1+C2 if heavy)
  C1. Insert tool (operation + iframe wire + sidebar context)
  C2. Swap tool (operation + sidebar context)
  C3. Phase 5 propagation toggle
  C4. Library Palettes section
  C5. Final cleanup (lib/dice/ deletion)
```

---

## 8. Glossary

- **Tool** — one of {View, Select, Move, Insert, Swap}. Workspace-scoped state. Gates which canvas interactions fire.
- **Isolated mode** — FocusEditor's view where the rest of the page is hidden / dimmed and one element is centered + editable.
- **Scope** — for palette swaps: either `"all"` (every OID in the page) or `{ oids: string[] }` (specific subtree).
- **Insert** — adding a library asset as a child of an existing container.
- **Swap** — replacing an existing element wholesale with a library asset (children of original discarded).
- **Propagation mode** — `instance` (current behaviour, edit applies only to clicked element) or `everywhere` (edit also propagates to the component definition for all instances).
- **BYO key** — bring-your-own API key. User pastes their own OpenAI / Anthropic key for the AI rewrite feature; never persisted server-side.
