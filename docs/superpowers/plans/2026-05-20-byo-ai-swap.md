# BYO-AI Component Swap

**Date**: 2026-05-20
**Status**: LOCKED — ready to execute
**Replaces**: Phase 6 Tensorix-backed AI swap (retired 2026-05-20)
**Estimated effort**: One session, ~600–800 LOC + ~30–50 prod-import tests

## Why this design

The Tensorix-backed AI swap (Phase 6) failed because:
- qwen-coder-30b returned no-op or root-tag-changed outputs ~40% of the time
- Tensorix uptime + 502 rates made the UX unreliable
- Dropin paid ~€60–80/month at 1k users
- We were stuck with whatever model Tensorix offered

User's pivot: **Browse component library → compose prompt → send to user's own AI (ChatGPT/Claude/Gemini) → paste response back → apply.** Zero cost to Dropin. User picks frontier model (10× smarter than coder fine-tunes). No vendor lock-in.

This is the same pattern Publish uses (user's own Netlify, zero cost to Dropin) — applied to AI.

## Research findings that constrain the design

| Provider | URL prefill | Works in 2026 | Notes |
|---|---|---|---|
| ChatGPT | `https://chatgpt.com/?q=<encoded>` | YES | URL-encoded; browser ~2K–8K char cap |
| Claude.ai | `claude.ai/new?q=<encoded>` | **NO — removed Oct 2025** | Prompt-injection vulnerability fix |
| Claude desktop | `claude://?q=<encoded>` | Yes if installed | Requires desktop app; skip for MVP |
| Gemini | No native support | No | Chrome extensions only — unreliable |
| Perplexity | `https://www.perplexity.ai/?q=<encoded>` | YES | Search-focused; weak for code gen |

**Implication**: Clipboard copy must be the PRIMARY mechanism. URL prefill is a best-effort optimization for ChatGPT only when payload is short enough.

## Architecture

### Entry point

"Swap with your AI" button returns to `VibePropertiesPanel` (above the kind-specific controls). Same surface as the retired AI Swap button. Visible for every element kind (modal filters references by category via existing `inferSwapCategory`).

### Modal layout — single modal, 3 stacked sections

```
┌─ Swap with your AI ──────────────────────────────┐
│                                                  │
│ STEP 1 — Pick a reference design                 │
│  ┌──────────────────────────────────────────┐    │
│  │ [InlineComponentBrowser, filtered]       │    │
│  │ [Hover preview popover stays]            │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│ STEP 2 — Send to your AI                         │
│  Edit prompt if you want (default works):       │
│  ┌──────────────────────────────────────────┐    │
│  │ I have a <button> in my code. Restyle it │    │
│  │ to match the reference below while       │    │
│  │ keeping my content + tags. Return ONE    │    │
│  │ ```jsx code block.                       │    │
│  │                                          │    │
│  │ MY ELEMENT: <button class="…">Submit…    │    │
│  │ REFERENCE:  <button class="…">…</button> │    │
│  └──────────────────────────────────────────┘    │
│  [ChatGPT] [Claude] [Gemini] [Just copy]         │
│                                                  │
│ STEP 3 — Paste the AI's reply                    │
│  ┌──────────────────────────────────────────┐    │
│  │ (paste here)                             │    │
│  └──────────────────────────────────────────┘    │
│  [Apply to my site]                              │
│                                                  │
└──────────────────────────────────────────────────┘
```

Single modal, NOT three pages. The user can move backward (re-pick reference, re-edit prompt, re-send to a different AI) without losing context.

### Payload structure

The composed prompt sent to the user's AI is **NOT the full file** — only:
- Static prompt template (~200 chars) explaining the task + return format
- Target element's outerHTML (typically 200–2000 chars)
- Reference component's HTML (typically 500–3000 chars)

**Typical total: 1000–5000 chars.** Most fit ChatGPT's URL cap.

Example:
```
I have an element in my code. Please restyle it to match the design of
the reference, while KEEPING my element's text content, attributes
(like href, src, alt), and root tag. Return ONE code block (```html or
```jsx, whichever matches the input) with the restyled element. No
explanation needed — just the code block.

MY ELEMENT:
<button class="bg-stone-200 px-4 py-2">Get Started</button>

REFERENCE DESIGN (use this as the style template):
<button class="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 text-white shadow-xl">Click me</button>
```

### Provider button strategy

Each button:
1. Copies the composed prompt to clipboard (always, regardless of provider)
2. Opens the provider URL in a new tab — synchronously, before any await (popup-blocker rules)
3. For ChatGPT: if `payload.length < 1800` (conservative cap for IE/Edge legacy + modern margin), uses URL prefill `?q=`; otherwise opens homepage
4. For Claude/Gemini: always opens homepage (URL prefill unsupported)
5. Shows toast: "Prompt copied. Paste it in {Provider} → copy the response → come back to paste below."

URL length cutoff: **1800 chars**. Sources: Chrome ~32K, Firefox unlimited but server-side ~8K, Edge ~2083 (IE legacy). 1800 keeps every browser happy with margin for URL encoding overhead (~2.5× for special chars).

**localStorage**: `dropin:byo-ai:preferred-provider` ∈ `{chatgpt, claude, gemini, copy}`. The remembered provider's button moves to first position on next open.

### Apply pipeline (Receive stage)

1. User pastes raw response in textarea
2. Click "Apply to my site"
3. **Code extraction** (`lib/byo-ai/extract-code.ts`):
   - First try: `/```(?:jsx|tsx|html|javascript)?\n([\s\S]*?)```/` — match first fenced code block
   - Fallback: entire textarea contents (trimmed)
4. **Validation** (reuse `lib/ai-edit/validate-response.ts`):
   - Parse as HTML via DOMParser
   - Verify root tag matches target's root tag (reject root-tag-changed outputs)
   - Reject `<script>`, `<iframe>`, `<object>`, `<embed>`, on-handlers, `javascript:`, non-image `data:` URIs
   - Length sanity: output should be within `max(originalLen * 4, originalLen + 2000)` (4× because frontier models may add more chrome than coder models did)
5. **Apply** (reuse Phase 6 infrastructure):
   - HTML mode: `patchHtmlOuter(code, target.htmlPath, response)` → `setCode`
   - JSX mode: `htmlToJsx(response)` → `patchJsxOuterByOid(code, target.oid, jsx)` → `setCode`
   - Cascade-detach if applicable (reuse `applyDetachFromMap`)
   - Iframe live-apply via `previewHandleRef.current?.postVibe({ type: "ai:apply-outer", ... })`
   - Toast with Undo

## Files

### New
- `components/ByoAiSwapModal.tsx` — the 3-section modal
- `lib/byo-ai/compose-prompt.ts` — `composeSwapPrompt(target, reference)` → prompt string
- `lib/byo-ai/providers.ts` — provider registry + URL builders
- `lib/byo-ai/extract-code.ts` — first-code-fence extractor with fallback
- `tests/byo-ai-compose-prompt-prod.test.ts`
- `tests/byo-ai-providers-prod.test.ts`
- `tests/byo-ai-extract-code-prod.test.ts`
- `tests/byo-ai-swap-modal-prod.test.ts` (integration — modal flow without network)

### Modified
- `components/VibePropertiesPanel.tsx` — re-add "Swap with your AI" button (similar shape to retired Phase 6 button)
- `components/VibePropertiesPanel/{TextControls,LinkControls,CardControls}.tsx` — re-add `onComponentSwap` prop
- `components/Workspace.tsx`:
  - Re-wire `onComponentSwap={handleByoAiSwapOpen}` on VibePropertiesPanel mount
  - New `handleByoAiSwapOpen` (just opens modal; no API call) + `handleByoAiApply` (the receive-side apply)
  - Mount `<ByoAiSwapModal>` (replaces the retired AI swap modal block)
  - Remove old `aiSwap*` dead-code state

### Removed (dead code from old AI swap, finally)
- `handleAiSwapOpen`, `handleAiSwapClose`, `handleAiSwapPick` from Workspace
- `aiSwapOpen`, `aiSwapCategory`, `aiSwapTargetRef` state
- AI swap retired modal block (already removed in toolbar refactor)
- Other AI-tool-only handlers (`handleAiSubmit`, AI selection state, etc.) — assess in a separate cleanup pass

Keep on disk (still useful):
- `lib/ai-edit/validate-response.ts` — reused for BYO validation
- `lib/ast/operations/detach-from-map.ts` — reused for cascade detach
- `app/api/ai-edit/route.ts` — leave for now, decide on cleanup later

## Open decisions — LOCKED

| Decision | Choice | Why |
|---|---|---|
| Provider list (MVP) | ChatGPT + Claude + Gemini + Just copy | 90% market coverage; "Just copy" is universal fallback |
| Entry point | VibePropertiesPanel "Swap with your AI" button | Matches retired Phase 6; user knows where to find it |
| Free-form prompt (no reference) | Defer to v2 | MVP focuses on component-first flow per user idea |
| Persist provider preference | Yes, in localStorage | First-button surface adapts to user habit |
| URL prefill threshold | 1800 chars | Conservative cap covering all browsers |
| Code extraction | Regex first fence, fallback to whole textarea | Robust against chatty preambles + plain-paste edge case |
| Validation | Reuse `validate-response.ts` | Battle-tested via 26 tests; length cap loosened to 4× for frontier outputs |
| Round-trip UX | Single modal, 3 stacked sections | User stays in one place; no menu hunting after pasting |
| Mobile support | Same modal renders; provider tabs open + user can use mobile AI apps | Drag-paste works on mobile (unlike Publish flow) |

## Manual test checklist (pre-ship)

- [ ] Click any element → vibe panel → "Swap with your AI" button visible
- [ ] Click button → modal opens with reference grid populated, filtered by element kind
- [ ] Pick a reference → Step 2 prompt textarea populates with composed prompt
- [ ] Verify prompt contains: instruction template, MY ELEMENT block, REFERENCE block
- [ ] Click "Just copy" → clipboard contains the prompt, no tab opens, toast shows
- [ ] Click "ChatGPT" with short prompt → new tab opens at `chatgpt.com/?q=...` with prefill, clipboard also populated
- [ ] Click "ChatGPT" with long prompt (>1800 chars) → tab opens at homepage, clipboard populated
- [ ] Click "Claude" → tab opens at `claude.ai/new`, clipboard populated (no URL prefill)
- [ ] Click "Gemini" → tab opens at `gemini.google.com/app`, clipboard populated
- [ ] Last-used provider remembered across sessions (close + reopen browser → first button is what user clicked last)
- [ ] Paste AI's full response (with chatty preamble + code fence) → click Apply → only the code fence content gets applied
- [ ] Paste raw code with no fence → click Apply → whole textarea applies (with validation)
- [ ] AI returns a response with `<script>` tag → Apply rejects with clear warn toast
- [ ] AI changes root tag (`<button>` → `<div>`) → Apply rejects
- [ ] AI returns valid response → iframe updates instantly, source persists, undo toast appears
- [ ] Undo works (single click reverts the swap, both iframe + source)
- [ ] Cascade-detach fires when target is one of N cascade instances (only the clicked instance swaps)

## Why this is the right design

1. **Zero AI cost to Dropin** — same pattern as Publish (user pays own host)
2. **Frontier-model quality** — Claude 4.6 Sonnet / GPT-5 / Gemini 3 Pro are ~10× better than coder fine-tunes on this task
3. **Pragmatic about provider URL limits** — clipboard-primary handles every provider reliably; URL prefill is a bonus for ChatGPT
4. **Reuses 90% of Phase 6 infrastructure** — validation, apply, undo, cascade-detach, iframe runtime, toast — all existing
5. **User stays in one modal** — round-trip is more steps than the failed one-click, but the modal-as-home design minimizes context loss
6. **Honest UX** — user sees the exact prompt being sent, edits it if they want, knows what's happening
7. **BYO-LLM is validated as a 2026 pattern** — n8n, Budibase, Kodus, AnythingLLM all ship variants
