# 2026-05-16 post-dinner polish plan

**Goal**: Lock in vibecoder value via low-risk polish, not new features. User direction: "what would actually add value without complicating things to the point you struggle to fix them."

**Cadence**: One step at a time. Manual-test after each. Stop on anything that surprises.

---

## Phase 0 — Test the existing surface first (~30-60 min, USER drives)

Before any new code. Walk every shipped feature on a real template:

1. **Per-image Shuffle** — click image → see `[dropin:Shuffle]` chain in console → image visibly changes.
2. **Background-image Shuffle** — click card → bg-image section → Shuffle → bg visibly changes.
3. **Save now ✓** — edit text, wait 1s, see blink, hit Undo → reverts. Click Save Now → toast "All saved ✓".
4. **Undo / Redo / Reset** — visible buttons, work as expected.
5. **Text-case transforms** — ALL CAPS / Title / Sentence / lowercase on selected text.
6. **Copy this section's code** — pastes stripped JSX into clipboard.
7. **"What's next?" modal** — opens, prompts copy, hosting links work.

Goal: catch any "shipped but not actually tested end-to-end" failures BEFORE building more on top. Per `memory/feedback_proper_research_is_non_negotiable.md`.

---

## Phase 1 — Refresh FirstOpenTour (existing component is STALE) — ~20 min, LOW risk

`components/FirstOpenTour.tsx` already exists + auto-shows on first workspace mount. Storage key `dropin:tour-completed-v2`. But the 4 steps still describe the OLD tool model (Select / Move / Insert / Swap), all retired.

**Action**: rewrite the `STEPS` array. New tour reflects current reality:

```ts
const STEPS: Step[] = [
  {
    title: "Click anything to edit it",
    body: "Pick the Edit tool (or press E). Click any text, image, icon, or section. The right rail shows what you can change.",
  },
  {
    title: "Shuffle for fresh images",
    body: "Click an image → hit Shuffle ↻. We'll find a new photo matching your alt text. Works on background images on cards too.",
  },
  {
    title: "Save now or wait",
    body: "Your edits auto-save every second. Hit Save now ✓ to lock in immediately. Undo (⌘Z) walks back through every save point.",
  },
  {
    title: "What's next?",
    body: "Hit the coral 'What's next?' button up top — copy your code, get AI prompts for further edits, and hosting walkthroughs.",
  },
];
```

**Storage key**: bump to `dropin:tour-completed-v3` so existing v2-completed users see the refreshed tour exactly once.

**Risk**: zero — pure content swap in an isolated component.

---

## Phase 2 — Polish toast surface for Shuffle / bg-Shuffle / Save — ~30 min, LOW risk

The toast system (`showInfo` ↪ / `showWarn` ⚠) already works. Currently per-image Shuffle is SILENT on success. User has no positive feedback that the swap landed.

**Action**: add success toasts at the right moments.

- ImageControls Shuffle success → `showInfo` via new `onInfo` prop: `"Photo updated · Undo to revert"`
- CardControls bg-image Shuffle success → same: `"Background updated · Undo to revert"`
- Text-case transform → no toast (transformation is visible)
- Reset confirmation → already has `"Template restored to original"`

Plumb `onInfo` through VibePropertiesPanel like `onWarn` already is. Single new prop, ~5 sites.

**Risk**: very low. Adding console-like feedback to existing successful paths.

---

## Phase 3 — Shuffle button micro-animation — ~20 min, LOW risk

Current Shuffle button shows "Shuffling…" text during the 200-500ms fetch. No spinner / pulse. Feels static.

**Action**: rotate the `↻` glyph on the button while `shuffling === true`. Pure CSS via Tailwind `animate-spin` (already in default tw config).

```jsx
<span className={shuffling ? "inline-block animate-spin" : ""}>↻</span>
```

Apply same to bg-image Shuffle button.

**Risk**: zero — pure presentational.

---

## Phase 4 — Figure-bg-image overlay fix — ~30 min, MEDIUM-LOW risk

When user clicks a `<figure>` that contains an inner `<img>`, picking a bg-image on the figure stacks the new bg under the existing inner img. Visual mess.

### Design lock

**Approach (a) — Hide bg-image picker when inner img exists, redirect with friendly message** ← CHOSEN

Why: minimal surgery, honest UX. Auto-routing (approach b) hides what's happening; warning (approach c) doesn't actually fix the click. Hiding the picker AND telling the user where to click instead is the cleanest.

### Implementation

1. **Iframe runtime** (`lib/vibe-edit/runtime.ts vibeSerialize`): add `hasInnerImg: boolean` field. Computed as `!!el.querySelector('img')` — only `true` when the selected element has an `<img>` descendant.
2. **VibeElementInfo type** (`lib/vibe-edit/types.ts`): add `hasInnerImg?: boolean` (optional for backwards-compat).
3. **CardControls.tsx**: render bg-image section ONLY when `!info.hasInnerImg`. When `info.hasInnerImg`, render a small advisory:
   ```
   This card has an image inside — click the image itself to swap it.
   ```
4. No source mutation, no engine surgery. Pure conditional render.

### Risk
- The `el.querySelector('img')` runs on every selection. For deeply-nested cards (rare), could be slow. Mitigation: cap by `el.querySelectorAll('img').length > 0` short-circuits at first hit anyway.
- Edge case: card with an `<svg>` only (no `<img>`) — still shows bg-image picker correctly. ✓
- Edge case: nested cards-with-images inside other cards-with-images — the OUTER card hides bg picker (correct: there ARE imgs inside); the user clicks the inner img directly. ✓

### Tests
None added. tsc 0 covers structural correctness. Manual: click a figure with inner img → see advisory not picker → click the inner img → image vibe panel opens with Shuffle.

---

## Phase 5 — Lighter / Darker slider via CSS filter injection — ~1 hr, MEDIUM risk

**The one new feature** that earned its slot per the research doc (`docs/research/2026-05-16-shuffle-features-research.md` Section 3.2 Path B).

### Design lock

1. **UI**: slider in `WorkspaceActions` row, between Viewport selector and Undo group. Label: `Mood` with `←Dark · Light→`. Default position: center (no effect).
2. **Slider range**: `-50` (max dark) ↔ `+50` (max light), step 1.
3. **CSS mapping**: slider value `v` →
   - `brightness = 1 + (v / 100)` (clamped `[0.5, 1.5]`)
   - `saturate = 1 - Math.abs(v) / 200` (slight desaturation at extremes; full sat at center)
4. **Apply mechanism**: maintain a `<style id="dropin-mood">body { filter: brightness(...) saturate(...) }</style>` block in source. Inject into the template's first `<style>` block OR after `<head>` opening.
5. **State**: slider value persists in localStorage per template (`dropin:mood:<filename>`).
6. **Undo integration**: every slider release fires through `setCode` (history-aware), so undo walks back through mood changes.

### Where to write

For JSX templates (the active surface): the `<style>` block lives wherever the template's first `<style>` tag is. If no `<style>` exists, inject one at the top of the JSX return.

For HTML templates: same, but inject inside `<head>`.

### Implementation pieces

1. **`lib/mood/mood-filter.ts`** (new file, ~50 LOC):
   - `buildMoodCss(value: number): string` — returns the CSS string
   - `injectMoodStyle(source: string, kind: PreviewKind, css: string): { source: string }` — inserts or replaces the dropin-mood style block
   - Pure functions, easily testable
2. **`components/WorkspaceActions`**: new slider element + state hook
3. **`components/Workspace.tsx handleMoodChange(value: number)`**: computes CSS via helper, calls `injectMoodStyle`, `setCode`, persists to localStorage
4. **Persisted-mood restoration**: on workspace mount, read localStorage, apply if non-zero

### Risk
- The filter affects EVERYTHING including photos. At brightness 0.7, photos look slightly muddy. Mitigation: clamp keeps it subtle. Slider doesn't go below 0.5 / above 1.5.
- Templates with their own `<style>{` ... `}</style>` blocks (rare but exist in iframe-flagged templates) — the injector needs to find OR insert ours uniquely. Identifier `id="dropin-mood"` keeps the block findable.
- JSX templates with `<style jsx>` — Next.js doesn't apply to iframe srcdoc rendering, but to be safe, use plain `<style>{` to match existing template patterns.

### Edge cases handled
- Template already has a `<style>` block at the top: replace any prior `dropin-mood` block, append if absent.
- Source contains no `<style>` at all: inject `<style id="dropin-mood">...</style>` right after `<head>` (HTML) or at top of `return (` (JSX).
- Slider returns to center (value === 0): emit empty `<style>` block or REMOVE the dropin-mood block entirely.

### Pre-work
- Read 2 JSX templates with existing `<style>` blocks to confirm injection placement won't conflict (e.g. `web/55-y2k-web-1-0.jsx`, `web/93-casette-futurism.jsx` — both have heavy custom CSS).
- Read 1 HTML template with `<head>` to confirm the HTML-mode injection.

### Tests
- tsc 0
- 3 vitest cases for `injectMoodStyle`: empty source / existing dropin-mood block / template with other `<style>` blocks
- Manual: pull slider on a clean template, see it darken/lighten; reload, see persisted value; undo restores prior value.

### Honest expectation

Vibecoders may or may not discover the slider. If they don't use it after a week, it's a graveyard feature — fine to retire same as Move / Try Variations. Ship it small, measure (informally), keep or kill.

---

## Phase 6 — Empty-state messaging on vibe panel — ~15 min, LOW risk

When `info === null` (no selection), the vibe panel already shows: "Click anything on the page to edit it." That's fine.

**Action**: add a small "Press E to enter Edit mode" hint when the tool is `view` AND no selection exists. Discoverability for users who load a template and don't realize they need to enter Edit mode.

**Risk**: very low.

---

## Total time + risk summary

| Phase | Effort | Risk | New code? |
|---|---|---|---|
| 0. Test existing | 30-60 min (user) | None | No |
| 1. Refresh tour | 20 min | None | No (content) |
| 2. Polish toasts | 30 min | Very low | Minimal |
| 3. Spin animation | 20 min | None | Trivial |
| 4. Figure-bg fix | 30 min | Low-Medium | Yes (1 iframe field + 1 conditional render) |
| 5. Mood slider | 1 hr | Medium | Yes (~80 LOC + 3 tests) |
| 6. Empty-state hint | 15 min | None | Trivial |

**Realistic order**: 0 → 1 → 2 → 3 → 4 → 6 → STOP. Add Phase 5 (mood slider) only if Phase 0 reveals no other surprises + after manual test of Phases 1-4.

**Total without Phase 5**: ~1.5 hr coding + 30-60 min user testing. Closes out a clean polish session.

**With Phase 5**: ~2.5 hr coding. Acceptable if appetite holds.

---

## What's NOT in this plan (per user direction)

- Font pair picker — researched, real but tractable; deferred until lighter/darker proves out the "vibecoder reaches for new UI" hypothesis.
- AI text rewrite — user explicit no.
- Section duplicate / cascade detach / palette swap — high-risk cascade features.
- Anything that needs new pattern detection across templates.

---

## Post-execution

After whichever phases ship:
- `git commit -m "polish: refresh tour + shuffle toasts + figure-bg fix [+ mood slider]"`
- Update CLAUDE.md status block with what landed
- New memory entry only if a NON-OBVIOUS gotcha surfaces during execution

If a surprise hits mid-phase, STOP. Surface to user. No more "ship a fix without reading the relevant file" — that's Rule 7 in CLAUDE.md.
