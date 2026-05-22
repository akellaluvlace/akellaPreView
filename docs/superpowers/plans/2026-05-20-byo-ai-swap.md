# BYO-AI Component Swap

**Date**: 2026-05-20 · **Revised**: 2026-05-21 (full-page payload, simpler modal)
**Status**: LOCKED — executing now
**Replaces**: Phase 6 Tensorix-backed AI swap (retired 2026-05-20)
**Estimated effort**: One session, ~400–600 LOC + ~30 prod-import tests

## Why this design

Tensorix Phase 6 failed because qwen-coder-30b returned no-op / root-tag-changed outputs ~40% of the time, 502 rates were high, and Dropin paid ~€60-80/mo at 1k users for unreliable quality.

User's pivot (locked 2026-05-20, refined 2026-05-21):

1. **Browse component library** → pick reference design
2. **Click provider button** → clipboard gets prompt + new tab opens to ChatGPT/Claude/Gemini
3. **Paste the AI's reply** (full file, from its code box)
4. **Click Apply** → `setCode(response)` after light validation

Zero AI cost to Dropin (user pays own provider). Frontier model quality (Claude 4.6 Sonnet / GPT-5 / Gemini 3 Pro ~10× better than coder fine-tunes). Reuses 90% of Phase 6's iframe + source persistence infrastructure.

## Key research findings

| Provider | URL prefill | Notes |
|---|---|---|
| ChatGPT | `?q=` works at ~1800 char cap | **Not usable for full-page** (30–60KB) — must use clipboard |
| Claude.ai | `?q=` removed Oct 2025 | Security fix (prompt injection) — gone from web |
| Gemini | No native URL prefill | Chrome extensions only — unreliable |
| Perplexity | `?q=` works | Search-focused, weak for code gen |

**Implication for v1**: clipboard-only, always. URL prefill is technically possible for ChatGPT with short payloads but our full-page payloads always exceed the cap. Skip URL prefill entirely.

## Full-page payload — the key simplification

Instead of sending just the target element + reference (Tensorix Phase 6 approach), send **the FULL source code** + target element snippet + reference + clear instructions. AI returns the full updated file.

**Consequences**:
- No `patchHtmlOuter` / `patchJsxOuterByOid` math — `setCode(response)` after re-injecting OIDs
- No cascade-detach needed — AI sees the whole `.map()` and handles in-context (or user picks a non-cascade element)
- No root-tag-match validation — AI returns the full file, root tag stays correct by definition
- AI matches the target by pattern (target.outerHtml as a quoted snippet in the prompt)
- 10× simpler apply pipeline; much less risk of broken patches

**Tradeoff**: payload is bigger (30–60KB vs 1–5KB). Frontier models handle this trivially; only the URL-prefill optimization dies (which we already gave up because of Claude's removal).

## Modal UX — 4 actions inside the modal

```
┌─ Swap with AI ─────────────────────────────────┐
│                                                │
│ 1. Pick a design          [grid of references] │
│                                                │
│ 2. Send to your AI                             │
│    [Open ChatGPT] [Open Claude] [Open Gemini]  │
│    [Just copy]                                 │
│    Paste in your AI → copy its reply → come    │
│    back & paste below.                         │
│                                                │
│ 3. Paste the AI's reply here                   │
│    ┌──────────────────────────────────────┐    │
│    │ (textarea — paste full response)     │    │
│    └──────────────────────────────────────┘    │
│    [ Apply to my site ]                        │
│                                                │
└────────────────────────────────────────────────┘
```

**Action count**: (1) pick reference → (2) click provider button → (3) paste → (4) click Apply. **No stepper, no progressive disclosure, no disabled states.** Trust the user to do them top-to-bottom.

### Locked UX decisions

- **All 3 sections always visible.** Simpler mental model than progressive disclosure.
- **No editable prompt textarea.** Vibecoders don't need to see the prompt details — provider buttons just do the right thing.
- **Provider buttons: 4-in-a-row.** ChatGPT, Claude, Gemini, Just copy. localStorage remembers the last-clicked button and floats it left on next open.
- **Paste anywhere in modal routes to textarea.** If user pastes in section 2 area by accident, we catch the paste and forward it to section 3's textarea.
- **sessionStorage silently saves textarea contents.** Accidental modal close doesn't lose the AI reply. Restored quietly on reopen — no "Resume?" banner.
- **Subtle success pulse.** After Apply, reuse `data-ai-just-applied` from Phase 6 → 1.2s coral pulse on the swapped element so user sees what changed.
- **Failure recovery in-place.** If Apply rejects (length cap, forbidden tag, parse error), keep response in textarea + show specific reason. User can edit manually + retry. No "go back to ChatGPT" dead-end.

## Prompt template

```
I have a [HTML/JSX/TSX] file. Please replace ONE element in it.

THE ELEMENT TO REPLACE (find it in the file below):
```[html or jsx]
[target.outerHtml]
```

THE REFERENCE DESIGN (use this as your style template):
```html
[reference HTML]
```

INSTRUCTIONS:
- Keep my element's text content (the visible words inside).
- Keep meaningful attributes (href, src, alt, type, name).
- Otherwise, make the element look like the reference — colors, layout, shape, sizing, classes.
- Leave ALL other elements in the file untouched.
- Return the FULL UPDATED FILE as a single code block. No explanation.

THE FULL FILE:
```[html or jsx]
[full source code]
```
```

Typical payload: 15-60KB. Fits well within frontier-model context windows.

## Apply pipeline

1. User pastes AI's full reply in textarea
2. Click Apply
3. **Extract code fence** (`lib/byo-ai/extract-code.ts`):
   - First try: `/```(?:jsx|tsx|html|javascript|js)?\n([\s\S]*?)```/` — first fenced block
   - Fallback: entire textarea contents (trimmed)
4. **Validate** (`lib/byo-ai/validate-response.ts`):
   - Length within `[0.5×, 1.5×]` of original source length
   - No `<script>` (other than user-original `<script type="tailwindcss">` style), `<iframe>`, `<object>`, `<embed>`
   - No `on*=` event handler attributes
   - No `javascript:` URIs
   - Parses without throwing (Babel for JSX/TSX, parse5 for HTML)
   - Target's `outerHtml` snippet is NO LONGER present in response (proves AI did the swap — no-op detection)
5. **Re-inject OIDs** via existing `injectOids` (idempotent — adds OIDs to elements without them)
6. **`setCode(result)`** — history-aware via `useEditHistory`; undo works via Ctrl+Z + the toast button
7. Subtle pulse on the swapped element (reuse `data-ai-just-applied` CSS rule from `lib/preview.ts`)

## Files

### New

- `lib/byo-ai/compose-prompt.ts` — `composeSwapPrompt({ fullSource, kind, targetOuterHtml, referenceHtml }) → string`
- `lib/byo-ai/providers.ts` — provider registry: `{ id, name, openUrl, color }`. ChatGPT → `https://chatgpt.com/`, Claude → `https://claude.ai/new`, Gemini → `https://gemini.google.com/app`, just-copy → no open.
- `lib/byo-ai/extract-code.ts` — `extractCodeFence(text) → { code, hadFence }` (hadFence false → returned raw input)
- `lib/byo-ai/validate-response.ts` — `validateResponse({ input, output, kind, targetOuterHtml }) → { ok, reason?: string }`
- `components/ByoAiSwapModal.tsx` — the modal
- Tests: `byo-ai-compose-prompt-prod.test.ts`, `byo-ai-extract-code-prod.test.ts`, `byo-ai-validate-response-prod.test.ts`, `byo-ai-providers-prod.test.ts`

### Modified

- `components/VibePropertiesPanel.tsx` — re-add `onComponentSwap?: () => void` prop + button at top of panel ("✨ Swap with AI")
- `components/VibePropertiesPanel/{TextControls,LinkControls,CardControls}.tsx` — re-add `onComponentSwap` prop pass-through if needed (just for the kind-specific paths). Actually NOT needed — the button lives in the parent panel, not the sub-controls.
- `components/Workspace.tsx`:
  - New `handleByoAiSwapOpen` (just opens modal — captures the current vibeInfo)
  - New `handleByoAiApply(rawResponse: string)` (extract → validate → setCode)
  - Re-wire `onComponentSwap={handleByoAiSwapOpen}` on `<VibePropertiesPanel>`
  - Mount `<ByoAiSwapModal>` (replaces the dead Phase 6 modal block)
  - **Clean up dead AI swap state** while we're here: remove `aiSwapOpen`, `aiSwapCategory`, `aiSwapTargetRef`, `handleAiSwapOpen`, `handleAiSwapClose`, `handleAiSwapPick` (they were left as dead code in toolbar refactor commit `357e542` — finally deleting now). Also `handleAiSubmit` and AI-tool selection state if they're not referenced elsewhere.

### Reuse without changes

- `InlineComponentBrowser` — reference picker (already supports `onPickReference` mode)
- `injectOids` from `lib/ast/oids.ts`
- `useEditHistory` (host owns history)
- `data-ai-just-applied` CSS rule from `lib/preview.ts`
- Vibe panel's `onComponentSwap` plumbing (we removed it yesterday; re-adding)

## Open decisions — LOCKED 2026-05-21

| Decision | Choice | Why |
|---|---|---|
| Payload shape | **Full source + target snippet + reference + instructions** | Drops the patch pipeline entirely; AI does the work |
| Target identification | Prose ("find this element in the file") | No marker comments needed; frontier models match by pattern |
| Provider count (MVP) | 4: ChatGPT, Claude, Gemini, Just copy | 90% market coverage + universal fallback |
| URL prefill | None | Full page exceeds any provider's cap; clipboard-only |
| Modal layout | All 3 sections visible, no stepper | Vibecoder UX: trust them to do steps in order |
| Persistence | sessionStorage on textarea only, silent restore | Saves AI reply across accidental close, no "Resume?" banner |
| Failure UX | Keep response in textarea, show reason, allow manual edit | No dead-end → back-to-AI |
| Action count target | 4 actions inside modal | (1) pick reference (2) click provider (3) paste (4) apply |

## Hardening rounds (2026-05-21 → 2026-05-22)

Shipped + audited across 6 rounds after the initial build. Commits on
`audit-phase2-cascade-ids`.

- **Round 1** (`ada9a30`): OID re-injection (JSX), toast auto-dismiss +
  pre-swap-state Undo, cascade-aware no-op (count occurrences not
  binary), additive length-cap floor, empty-outerHtml guard,
  popup-block warning.
- **Round 2** (`65aff07`): placeholder-truncation detection (the #1
  full-file risk — `// ... rest unchanged ...`), TypeScript-syntax
  detection (JSX-only Babel blanks on TS), event-handler false-positive
  fix (was rejecting every JSX onClick), top-level decl-survival check,
  reference HTML cap + comment-strip, prompt guards (no TS, don't touch
  style/config/consts, return COMPLETE file), stripOids-before-inject.
- **Round 3** (`f84903a`): JSX-mode wrong-language guard (reject HTML
  doc when file is JSX), CRLF/CR normalization, source-changed notice,
  kind-gating (no AI-swap button on image/icon), reset-on-new-target,
  modal focus management.
- **Round 4** (`e0d8536`): clipboard fallback (manual-copy textarea
  when the API is blocked), diagnostic `[dropin:byo-ai]` tracers,
  tab-return focus nudge.
- **Round 5** (`1ed3604`): block AI-injected `<script>`/`<iframe>`/
  `<object>`/`<embed>` (count-based — preview iframe runs scripts),
  bundle reference CSS (`full.css` was being dropped — Uiverse refs
  reached the AI styleless).
- **Round 6**: prompt-size display (KB + est. tokens so users know it
  fits their AI's context), this documentation pass.

94 prod-import tests across the 4 lib modules. tsc 0 throughout.

## Manual test checklist

- [ ] Click any element → vibe panel → "✨ Swap with AI" button visible
- [ ] Click button → modal opens with reference grid filtered by element kind
- [ ] Pick a reference → reference highlights, prompt is composed silently
- [ ] Click "Just copy" → clipboard has prompt, NO tab opens, toast confirms
- [ ] Click "Open ChatGPT" → new tab to chatgpt.com, clipboard has prompt, toast
- [ ] Click "Open Claude" → new tab to claude.ai/new, clipboard has prompt
- [ ] Click "Open Gemini" → new tab to gemini.google.com/app, clipboard has prompt
- [ ] localStorage remembers last-clicked provider across browser sessions
- [ ] Paste AI reply (with chatty preamble + code fence) → click Apply → only code fence content applied
- [ ] Paste raw code (no fence) → Apply → whole textarea applied (with validation)
- [ ] AI returns response with `<script>` tag → Apply rejects with specific reason
- [ ] AI returns response with same content as input (no-op) → Apply rejects "looks identical"
- [ ] AI returns valid response → iframe rebuilds, source persists, swapped element pulses coral
- [ ] Ctrl+Z restores prior code (history-aware setCode)
- [ ] Accidentally close modal mid-flow → reopen on same element → textarea contents restored
- [ ] Paste outside the textarea (e.g. in section 2 area) → still routes to textarea
- [ ] Apply rejects → response stays in textarea + reason shown → user edits + retries
- [ ] Cascade element (one of N from `.map()`) → AI sees the .map() and either detaches or restyles all — user has Undo if they don't like the cascade behavior

## Why this is the right design

1. **Zero AI cost to Dropin** — same model as Publish (user pays own host)
2. **Frontier-model quality** — Claude 4.6 / GPT-5 / Gemini 3 Pro ~10× better than coder fine-tunes
3. **Simpler apply pipeline** — `setCode(response)` after light validation; no patch math
4. **No vendor lock-in** — Dropin works if any individual AI provider is down
5. **User can iterate freely** — if they don't like the first AI's output, paste a different one or switch providers
6. **Honest about the round-trip** — vibecoder sees exactly what's happening; no opaque "AI magic"
7. **BYO-LLM is a validated 2026 pattern** — n8n, Budibase, Kodus, AnythingLLM all ship variants

## What we deliberately punt to v2

- Free-form prompt (no reference picker) — if user demand surfaces
- `claude://` desktop protocol shortcut — requires installed app
- Auto-paste from clipboard on tab-refocus — requires permission prompt
- Streaming UI for the AI's response — out of scope (user pastes the full reply)
- "Edit the prompt" mode — vibecoders don't need it; power users can copy + edit before pasting in AI
