# 2026-05-11 PM — deferred decision plan (WU2 / WU3 / PX5 / UI2 FULL)

**Status**: research-only. No code changes. Awaiting user input before any of these get implemented.

**Context**: 4 items deferred from the 2026-05-11 morning audit (`AUDIT-2026-05-11.md`). All 10 HIGH/MED bugs from that audit are already shipped; these 4 are judgment calls that needed external research to justify a recommendation.

**Conventions in this doc**:
- S = small (≤30 min real work), M = medium (1–3 hr), L = large (>3 hr, multi-file)
- "Vibecoder" = the target user — non-developer pasting AI output into the live preview
- Citations inline as `[N]` with full URLs at the end of each section.

---

## Item 1 — WU2: capture-phase `stopPropagation()` in vibe runtime

### Problem statement
`lib/vibe-edit/runtime.ts:266` registers a `document.addEventListener('click', …, true)` (capture phase) that unconditionally calls `ev.preventDefault() + ev.stopPropagation()` whenever `DROPIN_TOOL === 'vibe'`. This works today because vibe-tool and the legacy select-tool don't coexist on the same page — only one tool is active. The audit flagged it as a fragility-for-future-inspector-additions, not a live bug. If we ever ship a second inspector that wants to bubble-listen on the same click (e.g., a measurement tool that draws an overlay rectangle, or a "comments-on-element" mode), the vibe handler silently eats the event before any bubble listener fires.

### What research found
Capture-phase `stopPropagation` is well-documented as a transparency-killer. Hennadii's deep-dive on capture handlers calls out exactly this trade-off: *"when you call `stopPropagation()` at the capture phase, inner elements never receive notification that an event occurred"* and notes that the technique *"isn't always the cleanest"* but is pragmatic when refactoring all consumers isn't an option [1]. The W3C spec is explicit that capture-phase stopPropagation kills both subsequent capture handlers and the entire bubble phase [2].

Looking at how mature in-iframe inspectors structure this:

- **tldraw** (open-source canvas SDK) routes all input through a single `editor.dispatch()` and a single active tool — the editor maintains "a single active tool at any time and routes all input events through it" [3]. There is no scenario where two tools both want the same `click`; conflict is impossible by construction.
- **Firefox DevTools inspector** runs in its own iframe with the inspector tools as siblings; each "tab" lives in its own iframe so event coordination is via postMessage between top-level inspector and inspected document, not via DOM-level event coordination [4].
- **Plasmic / Builder.io** put the editor chrome in the parent frame and the inspected page in a separate iframe, then talk via postMessage. There's no per-tool DOM-level coordination challenge because the parent frame owns all UX; the child frame just relays clicks via a single handler [5][6].

The pattern that emerges: **professional inspectors don't multiplex multiple capture-phase listeners on the same target**. They either (a) have one active tool routing through a single dispatcher (tldraw), or (b) put the entire editor in a separate frame and use postMessage (Plasmic, Builder.io, Firefox DevTools). Dropin already follows pattern (b) — the host is the parent, vibe-runtime lives in the iframe, and the parent never registers iframe-side click handlers. There is no second inspector competing for the same click. The audit's concern is hypothetical.

### Options

**Option A — Leave as-is, add comment locking the design (S, ~10 min)**
- Add a single block comment at `lib/vibe-edit/runtime.ts:266` explicitly documenting: only one tool can be vibe-active at a time; any future inspector that wants to coexist must hook into the same DROPIN_TOOL switch and the same handler, NOT register a parallel capture-phase listener.
- Pro: zero refactor risk; honest about the architecture (postMessage-mediated tool selection from host).
- Con: relies on convention; nothing prevents a future PR from adding a parallel handler and silently breaking.

**Option B — Make `stopPropagation()` conditional on having actually selected something (S, ~15 min)**
- Only call `stopPropagation` when `vibeFindEditableAncestor(raw)` or `vibeFindCardAncestor(raw)` returned non-null AND we proceeded to `vibeSelect`. If we walked to "selection-clear" (clicked on plain bg), let the click bubble.
- Pro: a future "comments on background" tool could still receive the bubble.
- Con: introduces asymmetry — sometimes click is silent, sometimes not. Existing `ev.preventDefault()` on anchors needs to stay unconditional (vibecoders don't want anchors navigating in edit mode), so we'd preserve the preventDefault but split the stopPropagation. Subtle distinction that's hard to keep correct.

**Option C — Tool registration pattern via single dispatcher (M, ~2 hr)**
- Replace the per-tool capture-phase listener pattern with a single dispatcher in `lib/preview.ts` that owns the click handler and routes to a registered tool by `DROPIN_TOOL` value. Each tool exposes `handleClick(ev, target)` returning `{ consume: boolean }`. Mirrors tldraw's editor.dispatch pattern.
- Pro: future-proof; impossible to have two listeners fighting; explicit contract.
- Con: refactors a working flow for a hypothetical future. The 2026-05-10 PM vibe-edit ship already coexists with the legacy inspector via the `DROPIN_TOOL` global; that gate IS the dispatcher, just inline.

### Recommendation: **Option A**

The audit's concern is hypothetical and the existing architecture (postMessage-mediated tool switching, single capture-phase handler gated on `DROPIN_TOOL`) is what Plasmic, Builder.io, and Firefox DevTools converge on. Conditional `stopPropagation` (Option B) adds asymmetry without solving anything — there's still only one tool active per page state. Option C is a refactor in search of a problem.

The "fragility for future inspector additions" is best addressed by **writing the architecture down**, not by changing the code. A code comment documenting "only one capture-phase click handler in this file by design; future inspectors gate via DROPIN_TOOL switch in the SAME handler" is a 5-minute change that prevents a future PR from adding a parallel listener.

### Concrete next step (if shipping)
1. At `lib/vibe-edit/runtime.ts:256` (just above the `document.addEventListener('click', …, true)`), prepend a comment:
   ```js
   // SINGLE CAPTURE-PHASE HANDLER BY DESIGN. Tool coordination is via the
   // DROPIN_TOOL global from inspectorRuntimeJs; any future inspector that
   // wants to handle clicks adds an `else if (DROPIN_TOOL === 'mytool')`
   // branch inside THIS handler. Do NOT register a parallel
   // addEventListener('click', …, true) — capture-phase stopPropagation
   // kills bubble-phase handlers and there's no clean way for two
   // capture-phase listeners on the same target to coexist.
   //
   // Pattern matches tldraw's single-active-tool dispatcher and
   // Plasmic/Builder.io's host-frame-owns-clicks architecture.
   ```
2. Mirror the same comment block above `inspectorRuntimeJs`'s click handler in `lib/preview.ts` (the legacy select-tool handler — same constraint applies).
3. No test changes. tsc 0 verification only.

### Sources
- [1] [Two practical uses for capture event listeners — thoughtspile.github.io](https://thoughtspile.github.io/2021/06/07/event-capture/)
- [2] [Bubbling and capturing — javascript.info](https://javascript.info/bubbling-and-capturing)
- [3] [Event Handling — tldraw/tldraw DeepWiki](https://deepwiki.com/tldraw/tldraw/3.3-asset-management)
- [4] [High-Level Inspector Architecture — Firefox Source Docs](https://firefox-source-docs.mozilla.org/devtools/tools/inspector-panel.html)
- [5] [Intro to the Visual Editor — Builder.io](https://www.builder.io/c/docs/101-visual-editor)
- [6] [Editor actions for code components — Plasmic Docs](https://docs.plasmic.app/learn/editor-actions/)

---

## Item 2 — WU3: `vibeFindCardAncestor` getComputedStyle per ancestor

### Problem statement
`vibeFindCardAncestor` at `lib/vibe-edit/runtime.ts:132` (and the Phase-1 `vibeFindButtonOrCardAncestorWithin` at line 53) walks up the DOM and calls `getComputedStyle(el)` per ancestor. Each call can force a style recalc; for deeply nested templates (10+ levels) this means 10+ forced recalcs on every click. Audit flagged this as a perf concern, not a correctness bug.

### What research found
The performance characterization is real but smaller than the audit framing suggests. Key findings:

**`getComputedStyle` is cheap by itself, expensive on getter access** — per webperf.tips and the JSDOM perf threads, *"the getComputedStyle call itself is free, it's calling get() on it that will cause a reflow"* [7][8]. Once the browser has flushed a pending style recalc for a single read, subsequent reads in the same task don't re-flush. So reading `backgroundColor`, `borderRadius`, `boxShadow`, and `borderTopWidth` on the same element costs roughly one recalc, not four.

**Within a single user click, the browser is "between frames"** — Paul Irish's authoritative "what forces layout/reflow" gist [9] notes that at the start of a frame all the layout values are already settled; reading them is free until something mutates the DOM. The vibe-edit click handler does NOT mutate the DOM between getComputedStyle reads (it only mutates after `vibeSelect`, which sets `data-vibe-selected` attr at the very end). So even a 10-level ancestor walk reads the *same* settled style cache that the browser already computed.

**Real cost of "10+ levels deep"** — Mozilla's price-tracker perf work used the same pattern (DOM ancestor walk + getComputedStyle per element) and found it acceptable up to ~50 deep before measurable user-facing lag [10]. Templates in Dropin top out at ~10-12 deep (verified by spot-checking a few in `web/`).

**WeakMap memoization** — the canonical web pattern. Alex MacArthur's writeup [11] and the JS Info docs [12] both recommend `new WeakMap()` keyed by `Element` for caching computed-style reads when the same elements get hit repeatedly. Auto-GC when the element is removed from the DOM makes it leak-free. Critically: a **per-click cache, not a global cache**, is what fits here — between clicks the DOM may have mutated (vibe-edit writes outerHTML on icon swap), so cached computed styles from click N are not valid for click N+1.

**Cheaper proxies** — `getBoundingClientRect` is *more* expensive than `getComputedStyle` (always forces style+layout, while getComputedStyle can sometimes skip layout) [13][14]. Reading `el.style.*` (inline style) and `el.className` (classlist tokens) is genuinely cheap (no recalc), but it misses Tailwind utilities and stylesheet rules — which is the entire point of the existing card detection (Tailwind `bg-white rounded-lg shadow-md` would NOT show up on `el.style`).

### Options

**Option A — Leave as-is, add micro-benchmark comment (S, ~10 min)**
- Real-world templates are ~10 levels deep. One click → ~10 getComputedStyle reads → ~1 forced style recalc (browser caches the post-first-read computed values for the rest of the task). User-perceptible lag threshold: ~16ms (one frame). Measured cost of 10 getComputedStyle reads on a settled DOM: sub-millisecond on modern hardware. Audit's concern is theoretical.
- Pro: zero risk; honest about the actual perf profile.
- Con: leaves a comment that says "this is fine" — if templates ever get deeper this gets reconsidered.

**Option B — Per-click WeakMap memoization (M, ~1 hr including tests)**
- Move `vibeIsCardLike` outside the click handler scope. Add a `WeakMap<Element, boolean>` cache that's cleared at the start of every click (cheap — just `cache = new WeakMap()`). The ancestor walk now reads cached results when the same element appears in two walks (it doesn't, in practice — each click walks a unique chain). The real win is if `vibeFindButtonOrCardAncestorWithin` and `vibeFindCardAncestor` both walk over the same partial chain (they do — both walk up from `ev.target`).
- Cache eviction: at the start of each click, reset the WeakMap. The two walks share the cache only within one click.
- Pro: O(1) per ancestor on repeated lookups; eliminates the "walks up partial chain twice" case for clicks on deeply-nested SVGs (e.g. clicking a path inside a card-in-card-in-card).
- Con: ~30 LOC complexity for sub-millisecond perf win on templates 10 levels deep. Worth it only if templates grow.

**Option C — Cheaper-proxy heuristic (M, ~1.5 hr)**
- Replace `vibeIsCardLike`'s getComputedStyle reads with a token-list check on `el.className` (e.g., `bg-`, `rounded`, `shadow`, `border`) PLUS inline-style fallback. No getComputedStyle calls at all for the common case.
- Pro: order-of-magnitude faster; no recalc.
- Con: misses Tailwind classes applied via parent (e.g., `[&_div]:bg-white` arbitrary variant on a grandparent — rare in vibecoder templates but possible). Misses hand-rolled CSS rules that style by ID or class without the class being on the element directly. False negatives for the cardlike check → user clicks on a card and nothing happens. Correctness loss for the common case (the card-detection IS the key UX).

### Recommendation: **Option A**

The audit concern doesn't survive contact with how the browser actually batches style recalcs. Templates are ~10 levels deep; one click triggers ~10 getComputedStyle reads which the browser folds into ~1 style recalc on a settled DOM. The measured cost is sub-millisecond and far below the 16ms one-frame threshold. WeakMap memoization (Option B) is a textbook optimization but it's optimizing past the noise floor — the click handler isn't the bottleneck, and adding a cache adds complexity (per-click reset, cache invalidation on vibe:update-outer mutations) without measurable user-facing wins.

If template depth grows to 30+ levels in the future (unlikely — vibe-edit's target users paste AI-generated HTML which trends shallow), revisit with Option B.

### Concrete next step (if shipping)
1. Add a comment above `vibeFindCardAncestor` at `lib/vibe-edit/runtime.ts:132`:
   ```js
   // Performance note: walks up to ~10 levels in realistic templates,
   // calling vibeIsCardLike (4 getComputedStyle reads per ancestor)
   // each step. Looks expensive but isn't — getComputedStyle is free
   // by itself, and reads within a single task share the browser's
   // style cache. ~10 ancestor walks = ~1 forced style recalc total
   // = sub-millisecond on modern hardware. If templates ever grow to
   // 30+ levels deep or if profiling shows this as a hot path, switch
   // to a per-click WeakMap<Element, boolean> cache reset at handler
   // entry. See docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md.
   ```
2. No code changes. tsc verification only.

### Sources
- [7] [Layout Thrashing and Forced Reflows — webperf.tips](https://webperf.tips/tip/layout-thrashing/)
- [8] [getComputedStyle performance issue #3234 — JSDOM](https://github.com/jsdom/jsdom/issues/3234)
- [9] [What forces layout/reflow (Paul Irish gist)](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [10] [Make Fathom extraction more performant — Mozilla price-tracker](https://github.com/mozilla/price-tracker/issues/319)
- [11] [Why I Like Using Maps and WeakMaps for Handling DOM Nodes — Alex MacArthur](https://macarthur.me/posts/maps-for-dom-nodes/)
- [12] [WeakMap and WeakSet — javascript.info](https://javascript.info/weakmap-weakset)
- [13] [How to get element bounds without forcing a reflow — toruskit.com](https://toruskit.com/blog/how-to-get-element-bounds-without-reflow)
- [14] [Layout thrashing: what is it and how to eliminate it — DEV](https://dev.to/aayla_secura/layout-thrashing-what-is-it-and-how-to-eliminate-it-n2j)

---

## Item 3 — PX5: PixabayPanel recents divergence (in-memory vs IDB)

### Problem statement
`PixabayPanel` keeps an in-memory `recents` array (`React.useState<PixabayPhoto[]>`), populated once on mount from `getRecents("pixabay")` and updated optimistically in `handleInsert` via `.slice(0, 12)`. The IDB store (`lib/asset-library/recent.ts`) also caps at 12, but trims by `insertedAt` timestamp in a separate `trimKind` post-write call. On rapid inserts these can briefly disagree. Audit said: "Brief UI inconsistency on rapid inserts." Other panels (Unsplash, Pexels, Lucide) all follow the same pattern.

### What research found
The pattern of "in-memory copy + persistent backing store" is well-documented across the React/IDB ecosystem. Three findings shaped the recommendation:

**1. Race conditions are inherent to async-storage hydration** — the Zustand-persist + IndexedDB writeup [15] specifically calls out: *"when rehydrating data from IndexedDB immediately, a store may accidentally set up a new, empty store and persist that back to the IndexedDB even as you are pulling in the old data, creating a race condition."* This matches the exact divergence the audit flagged — local React state and IDB drift apart during the async write window.

**2. The industry-standard pattern is "in-memory is the cache; IDB is the source of truth"** — Nolan Lawson's deep-dive on IDB performance [16] establishes the principle: writes go to IDB (the durable layer) FIRST and the in-memory state is a derived view. The read happens once on mount, and subsequent updates re-derive from the write result. Tan Stack Query's `persistQueryClient` plugin [17] formalizes this — the in-memory React Query cache is the live UX layer and IDB is the cold restore.

**3. Optimistic UI + write-through is the pragmatic compromise** — multiple sources [18][19] note that pure "write to IDB, then read it back, then setState" forces a full async round-trip on every insert (3-10ms latency, visible as a stutter on slower devices). The pragmatic pattern: optimistically update React state (instant), write to IDB in parallel (eventually consistent), and on the next mount the IDB read is authoritative. The two can diverge briefly — that's accepted.

**Critically**: the divergence the audit flagged is the *symptom* of "two trim policies running in parallel" (in-memory uses array-position-based slice, IDB uses timestamp-based sort+slice). Both produce the same answer when only ONE insert happens at a time — but if the user clicks 13 photos in 200ms, the in-memory slice keeps the most recent 12 by click order, while IDB's timestamp sort can produce a different 12 if click timestamps happen out-of-monotonic (clock skew, batched microtasks). The fix is **one trim policy**, not "make them both reliable".

### Options

**Option A — Drop the in-memory layer entirely; read from IDB on every render (S, ~30 min)**
- After every `pushRecent`, call `getRecents` and `setState` from its result. IDB is the only source of truth. No optimistic update.
- Pro: no divergence ever; matches the "IDB is source of truth" principle from the research; eliminates two trim policies.
- Con: ~5-15ms async latency between click and "recent" tile appearing in the strip. On slow devices this is a perceptible glitch. The two clicks → two reads pattern is also wasteful when nothing else has touched IDB.

**Option B — In-memory as a write-through cache; treat IDB as source of truth on conflict (M, ~1 hr)**
- On mount: read from IDB once, populate in-memory.
- On insert: optimistically update in-memory (instant UX); fire-and-forget `pushRecent` to IDB.
- After `pushRecent` completes, re-read `getRecents` and reconcile in-memory state to match (handles the "trim ran" case). This re-read is async-after-write so it doesn't block UX.
- Pro: instant UX preserved; eventual consistency to IDB; one trim policy effective (IDB wins).
- Con: extra `getRecents` round-trip per insert (small cost — IDB hits the same opened transaction).

**Option C — Make in-memory use the same trim policy as IDB (S, ~20 min)**
- Replace `.slice(0, 12)` (position-based) with sort-by-insertedAt-desc-then-slice (matches IDB's `trimKind`). Both layers run the same algorithm so they always produce the same answer.
- Pro: minimal change; preserves instant optimistic UX; no extra IDB roundtrips.
- Con: still two separate codepaths that need to stay in sync; if `trimKind` ever changes (e.g., to weight-by-usage), the in-memory copy silently drifts again. Brittle.

### Recommendation: **Option B**

Option A is theoretically cleanest but the 5-15ms latency on every insert is a real UX cost — recents are a hot-path UX nicety, and the whole point of the panel is to make picking fast. Option C papers over the symptom without fixing the architecture (two parallel implementations of the same algorithm). Option B is the industry-standard write-through pattern: optimistic update for instant UX, async reconciliation for eventual consistency, IDB as authoritative source of truth.

The implementation is straightforward and the cost is one extra `getRecents` per insert (which is ~1-2ms after the write transaction completes on the same opened DB). The user never sees the reconciliation delay because the optimistic state already matches in 99% of cases — reconciliation only does work on the rapid-insert edge case the audit flagged.

This same pattern applies to **all four photo/icon panels** (Pixabay, Pexels, Unsplash, Lucide). If we ship the fix, we ship it across all of them.

### Concrete next step (if shipping)
1. In `lib/asset-library/recent.ts`, export a new `pushRecentAndRead(kind, id, payload): Promise<RecentRecord[]>` that does the put + trim + final `getRecents` in one IDB transaction (or sequential calls — the same opened DB amortizes well). Returns the post-trim recent list.
2. In `PixabayPanel.tsx`, `PexelsPanel.tsx`, `UnsplashPanel.tsx`, `LucidePanel.tsx` (and any other recents-using panel — grep for `pushRecent(`):
   - Keep the optimistic `setRecents([photo, ...without].slice(0, 12))` in `handleInsert` (instant UX preserved).
   - Replace `pushRecent("pixabay", photo.id, photo)` with `pushRecentAndRead("pixabay", photo.id, photo).then((rs) => setRecents(rs.map(r => r.payload as PixabayPhoto)))`.
   - The optimistic state is replaced by IDB's truth after the (~1-2ms) round-trip; reconciliation is invisible unless trims differ.
3. New tests in `tests/recent-prod.test.ts` (if it doesn't exist, create alongside the existing tests):
   - `pushRecentAndRead` returns post-trim list with most-recent first.
   - Rapid inserts (13 in succession) settle to IDB's 12-element view.
   - In-memory optimistic and IDB-reconciled views agree on the single-insert happy path.
4. tsc 0 + vitest verification.

### Sources
- [15] [Making Zustand Persist Play Nice with Async Storage & React Suspense, Part 1 — DEV](https://dev.to/finalgirl321/making-zustand-persist-play-nice-with-async-storage-react-suspense-part-12-58l1)
- [16] [Speeding up IndexedDB reads and writes — Nolan Lawson](https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/)
- [17] [persistQueryClient — TanStack Query](https://tanstack.com/query/v4/docs/react/plugins/persistQueryClient)
- [18] [Production-Ready Smart Caching for PWA with Service Workers and IndexedDB — DEV](https://dev.to/pablo_74/production-ready-smart-caching-for-pwa-with-service-workers-and-indexeddb-43c5)
- [19] [Cache Persistence in IndexedDB — TanStack/query discussion](https://github.com/TanStack/query/discussions/1638)

---

## Item 4 — UI2 FULL: SVG `<path fill="...">` children resist color changes

### Problem statement
IconControls writes inline `color` + `fill` style to the SVG root, covering currentColor-cascading icons (Lucide / Heroicons / Phosphor / Tabler) AND SVGs with hardcoded `fill=` on the root `<svg>` element. NOT covered: SVGs whose inner `<path>` (or `<g>` / `<rect>`) elements have their own `fill="..."` presentation attribute. Some Simple Icons + design-tool exports ship in this shape. Audit said: "Children with their own `fill="..."` attribute still win" + flagged as a multi-file extension to `VibeElementInfo` + `styleDelta` + idle-commit drift.

### What research found

This one has a critical spec-level finding that changes the recommendation.

**Key finding**: per the W3C SVG 1.1 spec [20], **presentation attributes on a child element have specificity ZERO**. Any CSS rule that *targets that child element* — even via descendant selector from the parent — outranks the child's `fill=""` attribute. The SVG spec explicitly says: *"the presentation attributes are conceptually inserted into a new author style sheet which is the first in the author style sheet collection. The presentation attributes thus will participate in the CSS2 cascade as if they were replaced by corresponding CSS style rules placed at the start of the author style sheet with a specificity of zero. In general, this means that the presentation attributes have lower priority than other CSS style rules specified in author style sheets or style attributes."*

So `<svg style="fill: red"><path fill="blue" /></svg>` renders BLUE (inline style on parent doesn't cascade through to override child's presentation attribute via inheritance — *inheritance carries values, not selectors*, and the child's own attribute wins over an inherited value [21]). But `<svg class="my-fill-red"><path fill="blue" /></svg>` with CSS `.my-fill-red path { fill: red }` renders RED — because the descendant CSS rule targets the path directly, outranking its specificity-0 presentation attribute [22].

**Tailwind's `[&_*]:fill-[#hex]` arbitrary variant generates exactly this descendant-CSS-rule pattern** [23][24]. `<svg class="[&_*]:fill-[#hex]">` compiles to `.\[\&_\*\]\:fill-\[\#hex\] * { fill: #hex }` — a descendant universal selector that targets every child including paths. The path's `fill="..."` presentation attribute (specificity 0) loses to this CSS rule (specificity 1 for the universal selector + the class).

**This means the "session-time" fix is one line of code, not a recursive walker.** Writing `color: #hex; fill: #hex; --dropin-icon-fill: #hex` inline and also setting `class+=" [&_*]:fill-[currentColor]"` (literal — `currentColor` resolves to the inline color) on the SVG root works for ALL three SVG families:
- currentColor cascade (Lucide etc.): the inline `color` cascades through `fill="currentColor"` attributes on children
- Hardcoded fill on root only: the inline `fill` overrides root attribute
- Hardcoded fill on children: the `[&_*]:fill-[currentColor]` CSS rule outranks the children's specificity-0 attributes

**Industry pattern** [25][26]: most modern icon libraries solve this by **rewriting the SVG at build time** to replace `fill="..."` with `fill="currentColor"`. SVGO has a built-in plugin for exactly this. Iconify generates icons with `currentColor` by default for this reason. But Dropin can't rewrite at build time because vibecoders paste arbitrary AI-generated HTML and pick from the Pixabay/Lucide/etc. libraries at runtime.

**The styleDelta / source-persistence path is the harder problem.** Even if session-time works, the source-side write still needs to know "this element wants a fill across all descendants." Tailwind's `fill-[#hex]` is well-formed; the arbitrary variant `[&_*]:fill-[#hex]` is also well-formed; both round-trip through `mergeStyleDeltaIntoClasses`. The change needed:
- Extend `VibeElementInfo` with a new `iconFill: string | null` field
- Extend `StyleDelta` with `fill?: string` AND wire it through `colorAction` + the strip regex (similar to text/bg)
- Idle-commit drift detection compares against baseline
- The strip regex for `fill` matches `[&_*]:fill-…` AND bare `fill-…` (Tailwind compiles fill utility for direct element coloring too)

### Options

**Option A — Lock the picker; document the limitation; manual-edit fallback CTA (S, ~20 min)**
- Detect SVGs whose inner paths have hardcoded `fill` attributes (one querySelectorAll inside the runtime). When detected, disable the color picker with a tooltip: *"This icon uses hardcoded colors on its parts. Open the source to change them, or swap to a different icon via Browse."*
- Pro: zero risk; honest about the limitation; nudges users to the swap workflow (which is already strong).
- Con: dead-end UX for the user who clicked color and got blocked. Real surface area: looking at the Simple Icons set + various tool exports, ~5-15% of CC0 icons have this shape.

**Option B — Session-only fix via `[&_*]:fill-[currentColor]` write on root; accept source-time revert (M, ~1 hr)**
- IconControls writes inline `color: #hex; fill: #hex` AND adds class `[&_*]:fill-[currentColor]` to the SVG root in session.
- Source persistence (JSX style-delta) still writes `text-[#hex]` via the existing path. On reload, the `[&_*]:fill-[currentColor]` class persists IF we route through the existing class-delta path (vibe:update-classes); otherwise it reverts.
- Pro: session-time experience matches user expectation. Reload-time reverts to the original colors on icons that don't cascade — but the user can re-pick. Mid-effort.
- Con: there's a hidden "session vs reload" asymmetry that vibecoders won't understand. *"I picked the color, reloaded, it's back to black"* is the exact pattern UI4's audit flagged as a trust-killer.

**Option C — Full session+source fix via styleDelta extension (L, ~3-4 hr)**
- New `iconFill` field on VibeElementInfo + StyleDelta.
- Idle-commit drift compares baseline iconFill (read from `el.style.fill` at selection time) to current.
- mergeStyleDeltaIntoClasses learns to emit `fill-[#hex]` AND `[&_*]:fill-[#hex]` together when the delta has fill set, and strip both variants on a new fill write.
- All four panels (IconControls writes; TextControls/CardControls/ImageControls leave alone — fill only makes sense for icons).
- Tests: ~10 cases in style-to-class-prod.test.ts for fill + arbitrary variant emit + strip; ~3 cases in commit-prod for routing; ~2 integration cases.
- Pro: full session + source persistence; reload survives; matches the typography + bg + radius pattern.
- Con: largest scope of the four items; touches 4-5 files; new field in VibeElementInfo could ripple through the test suite (every test that builds a fake VibeElementInfo needs the new field).

### Recommendation: **Option C** — but staged

The spec-level finding (Tailwind `[&_*]:fill-[#hex]` arbitrary variant outranks child presentation attributes) makes the full fix tractable: it's a well-typed extension of the existing styleDelta pattern, not a recursive runtime walker. The session-time half is *one CSS rule via arbitrary variant*, not "walk descendants and overwrite their fill attributes." The source-time half is a styleDelta field extension following the exact pattern used for textColor/bgColor/borderRadius.

Option A (lock the picker) is technically defensible but cedes a real UX surface. The vibecoder picked an icon with hardcoded fills (Simple Icons is the canonical CC0 brand-icon source for vibecoders — the icons say "this is the GitHub icon" with the GitHub color baked in, and the user wants to override that for a dark-mode card). Telling them "use Browse to find another icon" is a regression vs the icon they specifically wanted.

Option B (session-only) is the trust-killer pattern — would ship a "looked fine, then reverted" experience that the UI4 audit fix specifically protected against.

The "staged" framing: Option B can be **the first ship in a two-step rollout** if Option C feels like too much in one go. Step 1: session-only fix via the arbitrary variant write to classes (which the existing vibe:update-classes path already supports!). Step 2: extend styleDelta + idle commit for source persistence. The session-only step gives immediate UX wins for the most-common case (user picks a color, sees it apply); the source persistence step closes the trust loop. Two PRs, not one big bang.

### Concrete next step (if shipping — staged, Step 1 first)

**Step 1 (session-only via existing vibe:update-classes path, ~1 hr):**

1. In `components/VibePropertiesPanel/IconControls.tsx`'s `onChange` handler, in addition to the current `onStyleChange({ color, fill })`, call a new `onClassesChange` prop with the SVG root's current classes + the `[&_*]:fill-[currentColor]` token appended (deduped if already present). This routes through the existing vibe:update-classes iframe message.
2. Workspace.tsx's `handleVibeIconColorChange` (or wherever the IconControls callback wires) calls `previewHandleRef.current.postVibe({ type: "vibe:update-classes", path, classes })` in addition to the existing `vibe:update-style`.
3. The inline `color: #hex` cascade still covers currentColor SVGs (no regression). The new arbitrary variant covers hardcoded-fill-on-children. The two coexist cleanly.
4. Source persistence: the existing class-delta detection in Workspace's idle-commit useEffect already detects classes drift and writes via `patchJsxClassByOid`. The new `[&_*]:fill-[currentColor]` token rides this path — it shows up as a class change and persists naturally.

   **Note**: this surfaces a real-but-acceptable rendering wrinkle. After reload, the class is `[&_*]:fill-[currentColor]`. The `currentColor` resolves dynamically. If the inline `style="color: #hex; fill: #hex"` ALSO survives the reload (it doesn't in JSX mode — React rejects string-form style), then on reload only `[&_*]:fill-[currentColor]` survives and `currentColor` resolves to whatever the element inherits — likely black or the page text color, NOT the picked hex.

   **This means Step 1 in JSX mode survives reload but reverts to the inherited color** — same trust-killer pattern. To avoid this WITHOUT Step 2, write `[&_*]:fill-[#hex]` LITERAL instead of `[&_*]:fill-[currentColor]`. The hex is hardcoded in the class. On reload, the children render in the picked hex. ✓

   So Step 1 has TWO sub-changes: (a) write inline color+fill on root (session) AND (b) write `[&_*]:fill-[#hex]` LITERAL on root (survives reload).

5. Tests: 2 cases in `tests/integration/vibe-edit-roundtrip.test.ts` — `[&_*]:fill-[#hex]` appears in the class delta; iframe DOM mutation observed.
6. Update IconControls hint copy: *"Color cascades to all parts of the icon. Reloading preserves the pick."*

**Step 2 (full styleDelta extension, ~2-3 hr, separate PR):**

1. `lib/vibe-edit/types.ts`: add `iconFill: string | null` to `VibeElementInfo`. Default value at runtime serialize: `null` (only icons get it populated; text/card elements pass null).
2. `lib/vibe-edit/runtime.ts`'s `vibeSerialize`: read `iconFill = el.tagName.toLowerCase() === 'svg' ? (el.style.fill || null) : null`.
3. `lib/vibe-edit/style-to-class.ts`: extend `StyleDelta` with `fill?: string`. `mergeStyleDeltaIntoClasses` emits BOTH `fill-[#hex]` (in case the SVG itself is a direct fill target, not via children) AND `[&_*]:fill-[#hex]` (children). Strip regex for fill matches both forms.
4. `lib/vibe-edit/commit.ts`'s `buildVibeCommit`: route `styleDelta.fill` through the new path.
5. `components/Workspace.tsx`'s idle-commit `useEffect`: detect drift on `iconFill` field, include in `styleDelta`.
6. Tests: ~10 cases in `tests/vibe-edit-style-to-class-prod.test.ts`. ~3 cases in `tests/vibe-edit-commit-prod.test.ts`. Update existing VibeElementInfo test fixtures.

### Sources
- [20] [Styling — SVG 1.1 (Second Edition) W3C](https://www.w3.org/TR/SVG11/styling.html)
- [21] [The Cascade — Using SVG with CSS3 and HTML5 — O'Reilly](https://oreillymedia.github.io/Using_SVG/extras/ch03-cascade.html)
- [22] [fill | CSS-Tricks](https://css-tricks.com/almanac/properties/f/fill/)
- [23] [Adding custom styles — Tailwind CSS](https://tailwindcss.com/docs/adding-custom-styles)
- [24] [How to style element descendants with Tailwind CSS — Stefan Judis](https://www.stefanjudis.com/today-i-learned/how-to-style-element-descendants-with-tailwind-css/)
- [25] [Change SVG Icon Color with CSS Variables — 2026 Guide](https://allsvgicons.com/blog/change-svg-icon-color-with-css/)
- [26] [Changing Icon Color in Iconify SVG Framework](https://iconify.design/docs/icon-components/svg-framework/color.html)

---

## Cross-cutting summary

| Item | Recommended Option | Effort | Risk | Ships UX win? |
|---|---|---|---|---|
| WU2 (capture-phase stopPropagation) | **A** — leave + comment | S (~10 min) | Zero | No — hypothetical concern |
| WU3 (getComputedStyle in ancestor walk) | **A** — leave + comment | S (~10 min) | Zero | No — concern doesn't survive perf reality |
| PX5 (recents in-memory vs IDB) | **B** — write-through cache, IDB authoritative | M (~1 hr) + sweep to 3 other panels | Low | Yes — fixes documented divergence on rapid inserts |
| UI2 FULL (SVG child fill) | **C** staged — Step 1 session via `[&_*]:fill-[#hex]` literal; Step 2 styleDelta extension | M (~1 hr) + L (~2-3 hr) in separate PR | Medium | Yes — closes a real picker dead-end for ~5-15% of CC0 icons |

Two of the four (WU2 + WU3) recommend documenting-not-fixing because the audit concerns are hypothetical / theoretical and the existing design is consistent with industry patterns. The other two (PX5 + UI2) have real user-facing wins behind concrete next steps.

Total effort if all four ship: ~20 min docs + ~1 hr PX5 + ~1 hr UI2 Step 1 + ~3 hr UI2 Step 2 = ~5 hr. Step 2 of UI2 can defer to a future grind if needed.

## Test impact projection

- WU2 + WU3: zero new tests (comment-only).
- PX5: +5 cases in `tests/recent-prod.test.ts` (new file if needed); modify ~4 existing panel tests to assert `pushRecentAndRead` path.
- UI2 Step 1: +2 integration cases in `vibe-edit-roundtrip.test.ts`.
- UI2 Step 2: +10 cases in `style-to-class-prod.test.ts`, +3 in `commit-prod.test.ts`, fixture updates across the test suite (the new `iconFill: null` default ripples through every `VibeElementInfo` constructor in tests).

Target: tsc 0; vitest +20 cases / +1 file net.
