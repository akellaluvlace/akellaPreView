# 2026-05-11 PM — Edit flow hardening (post-audit fixes)

**Status**: SHIPPED 2026-05-11 PM (same-day). All 5 phases + Phase 6 DONE.
**Branch**: `audit-phase2-cascade-ids` (19 commits ahead of main, never pushed).
**Baseline at plan write**: tsc 0; vitest 6256/6258 (2 pre-existing envelope-channel jsdom flakes, unrelated).
**Final state**: tsc 0; vitest 6275-6276/6278 across 113 files (+20 tests / +1 file; envelope-channel flake fluctuates 1-3 per run, unchanged).

## Why this plan exists

The 2026-05-11 morning audit (see `AUDIT-2026-05-11.md`) shipped 10 HIGH/MED fixes and surfaced 3 deferred bugs + 14 LOW items. After discussion with the user, the priorities crystallized around **the edit experience for vibecoders**:

> "we want this for vibecoders easy, i'm mostly concerned with edit feature, for then to make easy edits, swaps assets, etc. then insert, and move features as well are important. swap is now redundant since we're swapping basically in edit mode"

So the deferred items get triaged by their impact on the edit flow:

| Item | Impact on edit flow | Fix decision |
|---|---|---|
| WU1 — span walks up but stops at the span inside button/card | **BLOCKER**. User can't click "Sign up" button without selecting the inner span. Card padding clicks miss. | Phase 1 |
| SF-M6 — `buildVibeCommit` returns `unchanged:true` for 3 distinct reasons including 2 silent bails | **HIGH**. Vibecoder swaps an icon, sees it appear, reloads → reverts. Trust killer. | Phase 2 |
| SF-M2 — opacity dropped silently when rgba/8-digit hex normalizes | **MED**. Less common (vibecoders pick solid colors) but the "editor ate my change" pattern. | Phase 3 |
| 14 LOW items | 3 hit the edit flow (TextControls keystroke flood, rgbToHex drift, missing JSDOM test) — 11 don't (a11y, copy, perf-minor, defensive logging) | Phase 4-5 cherry-pick 3 |
| Swap tool removal | "Swap is now redundant since we're swapping basically in edit mode" | Phase 6 (parking lot) |

Total estimated work: **~4-5 hours of focused execution.**

## Research findings (lock-in before grinding)

Done during plan-write — facts that inform the execution.

### F1. Span-in-button pattern is COMMON in real templates

Grep across `web/*.{jsx,html}`:
- `<button[^>]*>[\s\n]*<span` → 34 occurrences across 20 files in the first 20 sampled (108 templates total)
- Plain `<span>foo</span></button>` (no classes) → 8 occurrences (rare standalone form)
- `<span\s[^>]*>` (with classes) → 560 across 8 sampled files (most spans carry Tailwind classes)
- `<span>` total → 100+ in first 15 files

Conclusion: the dominant case for `<span>` is "label-with-classes inside a button or card". Standalone editable spans (`<span class="text-6xl">42%</span>`) exist but are the minority. The walk-up should default to "parent wins for spans" with the rare standalone case as the exception.

### F2. `buildVibeCommit` has 3 distinct `unchanged:true` paths at `lib/vibe-edit/commit.ts`:

- Line 122-124: HTML mode + `old.htmlPath` null → `return { unchanged: true, source }` (silent bail #1)
- Line 151-153: JSX mode + `old.oid` null → `return { unchanged: true, source }` (silent bail #2)
- Line 201: `return { unchanged: !anyChanged, source }` (legit no-op when no fields drifted OR all patchers reported no diff)

The two silent bails are the SF-M6 problem. The legit no-op is fine.

Call sites of `buildVibeCommit`:
- `components/Workspace.tsx:2674` (handleVibeOuterSwap — outer-swap path)
- `components/Workspace.tsx:2784` (idle-commit useEffect — drift path)
- `tests/vibe-edit-commit-prod.test.ts` (~70+ assertions on `.unchanged`)

### F3. `rgbToHex` is duplicated with a subtle divergence

- `components/VibePropertiesPanel/TextControls.tsx:125-151` — transparent fallback returns `#ffffff` (text on white card → invisible black-on-black is the bad UX, so we default to white)
- `components/VibePropertiesPanel/IconControls.tsx:79-108` — transparent fallback returns `#000000` (icon color)

Same logic everywhere else. The divergence is intentional but easy to lose in a future "let's DRY this" refactor.

### F4. `TextControls.onContentChange` fires per keystroke

`components/VibePropertiesPanel/TextControls.tsx:54-59` — every `onChange` posts a `vibe:update-content` message. At 80wpm that's ~10 messages/sec, each running:
- `document.querySelector(d.path)` in iframe runtime
- `el.textContent = newText`
- `vibeSerialize(el)` which calls `getComputedStyle` (forced reflow)
- re-emit `vibe:selected` with new info → Workspace re-renders the panel

This is the kind of thing that makes editors "feel laggy" without an obvious cause.

### F5. Swap tool surface area (for Phase 6)

- `components/ToolBar.tsx:34, 39, 212, 247` — TOOL_LIST + option config + disable condition
- `components/Workspace.tsx:321` — persistence allowlist includes "swap"
- `components/Workspace.tsx:518, 2133-2152, 3117-3164, 3542-3667` — selection routing + keyboard shortcut "w" + LibraryModal swap-context mounts (3 mount points)

Killing Swap means removing 5 distinct code paths. Easy mechanically; needs a migration entry for persisted `"swap"` users.

---

## Phase 1 — WU1: span walk-up parent precedence (DONE)

**Goal**: clicking on a `<span>` inside a `<button>` or card-like container selects the parent instead of the span. Standalone spans (no card-like ancestor within 3 levels) still get selected.

**Files**:
- `lib/vibe-edit/runtime.ts` — modify the walk-up logic in `vibeFindEditableAncestor` + add helper
- `tests/integration/vibe-edit-roundtrip.test.ts` — add 3 cases for the new heuristic

**Approach** (iframe runtime JS, single-quote-strings only, no backticks per `memory/project_ts_template_backtick_trap.md`):

```js
// New helper: walk up from an element looking for a button or card-
// like ancestor within `maxDepth` levels. Returns the ancestor or
// null. Used to decide whether a clicked span should bubble up to a
// parent that's the user's likely intent.
function vibeFindButtonOrCardAncestorWithin(el, maxDepth) {
  var cur = el && el.parentElement;
  var depth = 0;
  while (cur && depth < maxDepth && cur !== document.body && cur !== document.documentElement) {
    if (cur.tagName === 'BUTTON') return cur;
    if (vibeIsCardLike(cur)) return cur;
    cur = cur.parentElement;
    depth++;
  }
  return null;
}

// Modify vibeFindEditableAncestor: when the first editable match is a
// <span>, check for a button/card ancestor within 3 levels and prefer
// THAT if found. Other editable atoms (h1-h6, p, button, a, img, svg)
// keep their existing behaviour — only spans get this override.
function vibeFindEditableAncestor(el) {
  var cur = el;
  while (cur && cur !== document.body && cur !== document.documentElement) {
    if (vibeIsEditable(cur)) {
      if (cur.tagName === 'SPAN') {
        var parent = vibeFindButtonOrCardAncestorWithin(cur, 3);
        if (parent) return parent;
      }
      return cur;
    }
    cur = cur.parentElement;
  }
  return null;
}
```

Why 3 levels: tight nesting (`<button><span>Label</span></button>` = 1) and one wrapper (`<button><span><svg/>Label</span></button>` reads as 1 level too) plus card patterns like `<div class="card"><div class="flex"><span>Badge</span></div></div>` = 2 levels. 3 covers >99% of realistic templates; deeper nesting falls through to "span IS the intent".

**Test cases** (in `tests/integration/vibe-edit-roundtrip.test.ts`):
1. `<button><span>Sign up</span></button>` → click span → selects button (kind=button)
2. `<div class="bg-white rounded-2xl shadow-md p-6"><span class="badge">NEW</span></div>` → click span → selects card div (kind=container with cardLike)
3. `<div><span class="text-6xl">42%</span></div>` → click span → selects span (standalone, no card parent)

**Verification**: `npx vitest run tests/integration/vibe-edit-roundtrip.test.ts` + full vitest + tsc.

**Estimated effort**: 1 hour. Pure-logic change in one file + 3 integration tests.

---

## Phase 2 — SF-M6: `buildVibeCommit` discriminated union for silent-bail surfacing (DONE)

**Goal**: distinguish "legit no-op" from "silent bail" so the host can show a useful toast when a swap couldn't reach source.

**Files**:
- `lib/vibe-edit/commit.ts` — return type change
- `tests/vibe-edit-commit-prod.test.ts` — migrate all `.unchanged` assertions to the new shape
- `components/Workspace.tsx` — 2 call sites switch on `result.kind` + showWarn on bail

**New return shape**:

```ts
export type VibeCommitResult =
  | { kind: "ok"; source: string }
  | { kind: "no-op" }                                    // legit — nothing drifted, OR all patchers reported clean no-diff
  | { kind: "bail"; reason: "missing-oid" | "missing-html-path" };

// Helper for tests / consumers that just want the source if any:
export function commitSourceOr(result: VibeCommitResult, fallback: string): string {
  return result.kind === "ok" ? result.source : fallback;
}
```

**Migration in `commit.ts`**:
- Replace `return { unchanged: true, source }` at HTML-bail → `return { kind: "bail", reason: "missing-html-path" }`
- Replace `return { unchanged: true, source }` at JSX-bail → `return { kind: "bail", reason: "missing-oid" }`
- Replace final `return { unchanged: !anyChanged, source }` → `return anyChanged ? { kind: "ok", source } : { kind: "no-op" }`

**Migration in `Workspace.tsx`**:

For `handleVibeOuterSwap` (~line 2674):
```ts
const result = buildVibeCommit({...});
if (result.kind === "ok") {
  setCodeSilent(result.source);
} else if (result.kind === "bail") {
  showWarn(
    result.reason === "missing-oid"
      ? "Couldn't swap — element has no ID yet. Save the file and try again."
      : "Couldn't swap — element location not tracked. Try selecting again."
  );
}
// "no-op" path = silent, expected (idempotent swap)
```

Same shape for the idle-commit useEffect (~line 2813). On `bail` it's quieter because idle-commit fires invisibly — log to console instead of toast. Optional: rate-limit the toast to once per minute (`useRef<number>(0)` for last-toast timestamp).

**Migration in tests**:
- `tests/vibe-edit-commit-prod.test.ts` — search/replace `.unchanged).toBe(true)` → `.kind).toBe("no-op")` for the no-drift cases; `.unchanged).toBe(false)` → `.kind).toBe("ok")` + `.source).toContain(...)` for the change cases
- Add 2 new tests asserting the bail kinds: `"returns bail when JSX mode lacks oid"`, `"returns bail when HTML mode lacks htmlPath"`

**Verification**: full vitest + tsc.

**Estimated effort**: 2 hours. Most of the time is migrating ~70 test assertions; the production code change is ~10 minutes.

---

## Phase 3 — SF-M2: opacity slash-form emission (DONE)

**Goal**: when iframe's `getComputedStyle` returns a color with alpha (`#ffffff80` or `rgba(255,0,0,0.5)`), emit `text-[#ffffff]/50` instead of dropping alpha.

**Files**:
- `lib/vibe-edit/style-to-class.ts` — `normalizeToHex` returns `{ hex; opacityPct }` instead of plain string; `colorAction` consumes the new shape and emits the slash form when opacity < 100
- `tests/vibe-edit-style-to-class-prod.test.ts` — add 5 new cases

**New shape**:

```ts
interface NormalizedColor {
  hex: string;          // "#rrggbb" lowercase
  opacityPct: number;   // 0-100 integer, 100 = fully opaque
}

function normalizeToHex(input: string): NormalizedColor | null {
  // 3-digit hex
  // 6-digit hex
  // 8-digit hex → { hex: rrggbb, opacityPct: round(aa/255 * 100) }
  // rgb() → { hex, opacityPct: 100 }
  // rgba(r, g, b, a) → { hex, opacityPct: round(a * 100) }
}

function colorAction(input: string, prefix: "text" | "bg" = "text"): Action {
  // ...
  const norm = normalizeToHex(trimmed);
  if (!norm) return "skip";
  const cls =
    norm.opacityPct >= 100
      ? `${prefix}-[${norm.hex}]`
      : `${prefix}-[${norm.hex}]/${norm.opacityPct}`;
  return { kind: "add", cls };
}
```

**Test cases** (add to `tests/vibe-edit-style-to-class-prod.test.ts`):
1. `{ color: "rgba(255, 0, 0, 0.5)" }` → produces `text-[#ff0000]/50`
2. `{ color: "#FFFFFF80" }` → produces `text-[#ffffff]/50` (0x80/0xff ≈ 50.196% → 50)
3. `{ color: "#80808040" }` → produces `text-[#808080]/25` (0x40/0xff ≈ 25.098% → 25)
4. `{ backgroundColor: "rgba(0, 0, 0, 0.75)" }` → produces `bg-[#000000]/75`
5. `{ color: "rgba(255, 255, 255, 1)" }` → produces `text-[#ffffff]` (full opacity, no slash)

**Verification**: full vitest + tsc.

**Estimated effort**: 45 minutes. The colorVariantMatcher regex already accepts `(?:\/[0-9]+)?` from the H1 fix, so the strip side is already correct. Only the emission side needs change.

---

## Phase 4 — TextControls keystroke debounce (DONE)

**Goal**: text-editing in the vibe panel stops feeling laggy. Don't spam the iframe with `vibe:update-content` messages on every keystroke.

**Files**:
- `components/VibePropertiesPanel/TextControls.tsx` — wrap `onContentChange` calls in an 80ms debounce while keeping `setText` instant for input responsiveness

**Approach**:

```tsx
import { useEffect, useState, useRef } from "react";

export default function TextControls({ info, onContentChange, ... }) {
  const [text, setText] = useState(info.text);
  // ... existing color state ...

  const debouncedPostRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postText = useCallback((v: string) => {
    if (debouncedPostRef.current !== null) {
      clearTimeout(debouncedPostRef.current);
    }
    debouncedPostRef.current = setTimeout(() => {
      onContentChange(v);
      debouncedPostRef.current = null;
    }, 80);
  }, [onContentChange]);

  // Cleanup pending timer on unmount + selection change. Without this
  // a fast-typing user who clicks a new element gets one stale post
  // arriving after the new element is selected, mutating the wrong
  // path.
  useEffect(() => {
    return () => {
      if (debouncedPostRef.current !== null) {
        clearTimeout(debouncedPostRef.current);
        debouncedPostRef.current = null;
      }
    };
  }, [info.path]);

  // Inside the textarea onChange:
  onChange={(e) => {
    setText(e.target.value);   // instant local state
    postText(e.target.value);  // debounced iframe post
  }}
}
```

**Why 80ms**: typing at 80wpm is ~6.7 chars/sec, one char every ~150ms. An 80ms debounce coalesces back-to-back fast keystrokes but lets normal typing rhythms through. Lower than 80ms isn't useful (single-keystroke timing); higher feels laggy on the preview.

**No tests added** — debouncing is a useEffect/setTimeout interaction that needs RTL+jsdom which isn't wired in this codebase. The integration tests for vibe-edit-roundtrip don't exercise the panel UI. Document the intent in the comment.

**Verification**: full vitest + tsc (should pass with zero test changes); manual smoke when the user post-lunch.

**Estimated effort**: 30 minutes.

---

## Phase 5 — Extract `rgbToHex` to shared util (DONE)

**Goal**: kill the duplication between `TextControls.tsx` and `IconControls.tsx` while preserving the divergent transparent fallback (one returns white, one black).

**Files**:
- `lib/vibe-edit/rgb-to-hex.ts` — new shared util with parameterized fallback
- `components/VibePropertiesPanel/TextControls.tsx` — replace local rgbToHex with import (white fallback)
- `components/VibePropertiesPanel/IconControls.tsx` — replace local rgbToHex with import (black fallback)
- `tests/vibe-edit-rgb-to-hex-prod.test.ts` — new test file, 10 prod-import cases

**Shared util**:

```ts
// lib/vibe-edit/rgb-to-hex.ts

// Convert any computed-style colour string the iframe might emit to
// a 6-digit lowercase hex. The browser's getComputedStyle returns
// colours as rgb()/rgba() or named — we normalize so the vibe-edit
// color picker (which only speaks hex) can display them.
//
// transparentFallback distinguishes the two callers:
//   - TextControls (bg picker): white, so a transparent bg doesn't
//     show as a black square indistinguishable from a black text
//     colour swatch.
//   - IconControls (icon color): black, matching the default visual
//     for "no color set" on an icon.

export function rgbToHex(
  rgb: string,
  opts: { transparentFallback: "#ffffff" | "#000000" } = {
    transparentFallback: "#000000",
  },
): string {
  if (!rgb) return "#000000";
  if (rgb.startsWith("#")) {
    return rgb.length === 4
      ? "#" + rgb.slice(1).split("").map((c) => c + c).join("").toLowerCase()
      : rgb.toLowerCase();
  }
  if (rgb === "transparent" || /^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/.test(rgb)) {
    return opts.transparentFallback;
  }
  const m = rgb.match(/\d+(?:\.\d+)?/g);
  if (!m || m.length < 3) return "#000000";
  return (
    "#" +
    m
      .slice(0, 3)
      .map((n) => Math.max(0, Math.min(255, Math.round(Number(n)))))
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
  );
}
```

**Consumer changes**:

`TextControls.tsx`:
```ts
import { rgbToHex } from "@/lib/vibe-edit/rgb-to-hex";
// ...
const [color, setColor] = useState(rgbToHex(info.textColor, { transparentFallback: "#ffffff" }));
const [bg, setBg] = useState(rgbToHex(info.bgColor, { transparentFallback: "#ffffff" }));
// (Delete the local rgbToHex function definition at the bottom of the file)
```

`IconControls.tsx`:
```ts
import { rgbToHex } from "@/lib/vibe-edit/rgb-to-hex";
// (Delete the local rgbToHex function definition at the bottom of the file)
// (No call-site change needed since the default fallback is #000000 which matches the previous local default)
```

**Test cases** (10 cases in new `tests/vibe-edit-rgb-to-hex-prod.test.ts`):
1. Empty string → `#000000`
2. `#abc` (3-digit) → `#aabbcc`
3. `#aabbcc` (6-digit) → `#aabbcc` (lowercased)
4. `#AABBCC` (uppercase 6-digit) → `#aabbcc`
5. `transparent` with default fallback → `#000000`
6. `transparent` with white fallback opt → `#ffffff`
7. `rgba(0, 0, 0, 0)` with white fallback opt → `#ffffff`
8. `rgb(255, 128, 0)` → `#ff8000`
9. `rgba(255, 128, 0, 0.5)` → `#ff8000` (alpha dropped — picker is hex-only, Phase 3 handles opacity-aware emission separately)
10. `rgb(300, 400, 500)` (out of range) → `#ffffff` (clamped)

**Verification**: full vitest + tsc.

**Estimated effort**: 30 minutes.

---

## Phase 6 — Kill the Swap tool (SHIPPED 2026-05-11 PM)

**Not in this session's scope.** Logged for future grind. The user said:

> "swap is now redundant since we're swapping basically in edit mode"

So swap-from-library lives inside vibe mode via the "Browse icon library" + "Open media library" buttons in the panel. The standalone Swap tool button + keyboard shortcut + LibraryModal swap-context mounts can be removed.

**When ready, the plan is**:

1. `components/ToolBar.tsx:34, 39, 212` — remove "swap" from `TOOL_LIST` + option config
2. `components/ToolBar.tsx:247` — remove the swap-specific disabled condition
3. `components/Workspace.tsx:321` — remove `stored === "swap" ||` from the persistence allowlist
4. `components/Workspace.tsx:308-316` — extend the existing select→view migration to also migrate `"swap" → "view"`
5. `components/Workspace.tsx:518, 2133-2152, 3117-3164, 3542-3667` — remove swap-tool render paths + keyboard shortcut "w" + 3 LibraryModal swap-context mounts (leave vibe-mode icon/image swap modals intact — those use vibeIconSwapOpen / vibeImageSwapOpen)
6. Update Workspace tool-change cleanup effect — remove the `prev === "swap"` branch

**Risk**: some users may have a workflow that uses the Swap tool for non-icon/non-image swaps (general element swap). The vibe-mode swap only handles icons + images. If users do "swap a card with a different layout", that path goes away. Mitigation: keep the Swap tool but DEFAULT to View; deprecate via UI label "Swap (legacy)" for one release; remove next session.

**Estimated effort**: 1-1.5 hours. Surface to user as a separate decision before executing.

---

## Execution order (when grinding starts)

1. **Phase 1 — WU1 span walk-up** (1hr) — most user-facing
2. **Phase 2 — SF-M6 discriminated union** (2hr) — most silent-failure-killing
3. **Phase 3 — SF-M2 opacity slash** (45min) — completes the colour-edit trust story
4. **Phase 4 — TextControls debounce** (30min) — typing latency
5. **Phase 5 — rgbToHex extract** (30min) — debt cleanup, prevents future weird-color bugs
6. **Phase 6 — Swap tool kill** (parking lot, ask user first)

Between phases: `npx tsc --noEmit` + `npx vitest run --reporter=dot` to confirm 6256/6258 baseline holds. After all 5 phases: target is approximately **6280-6290/6256+ (target +25-30 new tests)** — Phase 1 adds 3 integration cases, Phase 2 adds 2 bail tests + migrates 70+ existing, Phase 3 adds 5 opacity cases, Phase 5 adds 10 rgbToHex cases. Phase 4 adds none.

## Rules (locked, non-negotiable)

1. No commits unless user asks.
2. No push.
3. No `next build` / dev server / puppeteer.
4. tsc + vitest only for verification.
5. No deviation from locked stack.
6. Surface unrelated breakage; don't unilaterally fix.
7. Backtick-in-iframe-runtime trap: NO backticks inside `lib/vibe-edit/runtime.ts` or `lib/preview.ts`'s inspectorRuntimeJs template — they close the outer TS template literal at parse time (see `memory/project_ts_template_backtick_trap.md`).
8. TS template backslash-escape trap: literal backslashes inside emitted regex literals in iframe runtime templates need `\\\\` (4 backslashes in source → 2 in emitted JS → 1 in regex). See `memory/project_ts_template_backslash_trap.md`.

## Files map (cheat sheet)

```
lib/vibe-edit/
  runtime.ts          ← Phase 1 (walk-up)
  commit.ts           ← Phase 2 (discriminated union)
  style-to-class.ts   ← Phase 3 (opacity slash)
  rgb-to-hex.ts       ← Phase 5 (NEW — shared util)

components/
  Workspace.tsx                                ← Phase 2 (call-site migration)
  VibePropertiesPanel/TextControls.tsx         ← Phase 4 (debounce) + Phase 5 (import)
  VibePropertiesPanel/IconControls.tsx         ← Phase 5 (import)

tests/
  integration/vibe-edit-roundtrip.test.ts      ← Phase 1 (+3 cases)
  vibe-edit-commit-prod.test.ts                ← Phase 2 (migrate ~70 + add 2 bail tests)
  vibe-edit-style-to-class-prod.test.ts        ← Phase 3 (+5 cases)
  vibe-edit-rgb-to-hex-prod.test.ts            ← Phase 5 (NEW, 10 cases)
```

## Definition of done

- All 5 phases shipped.
- `npx tsc --noEmit` exit 0.
- `npx vitest run` shows 6280+ passing (only the documented envelope-channel jsdom flake fails).
- `AUDIT-2026-05-11.md` updated to mark each fix as `SHIPPED`.
- Plan file (`docs/superpowers/plans/2026-05-11-edit-flow-hardening.md`) updated to mark each phase `DONE`.
- No commits unless the user explicitly asks.

## On clearing

After /clear: this plan + the `project_audit_2026_05_11_followup` memory entry + the existing `project_vibe_edit_session` memory entry + CLAUDE.md's status block are the entry points. Read in this order:
1. CLAUDE.md (auto-loaded)
2. `memory/MEMORY.md` index → `project_audit_2026_05_11_followup.md` (the next-step pointer)
3. `AUDIT-2026-05-11.md` (what was already fixed this morning)
4. This plan file (what's left to grind)

Then start Phase 1.
