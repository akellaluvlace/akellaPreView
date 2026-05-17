# Dropin AI Edit: Element + Section Mode

**Status:** Locked design. Awaiting implementation greenlight.
**Locked:** 2026-05-17 by user. Sequenced AFTER component-library swap retirement.
**Owner:** Nikita / Akella inMotion
**Target:** Dropin template editing surface
**Provider:** Tensorix (OpenAI-compatible, EU-hosted)

> **Context for future Claude sessions:** This plan replaces the broken
> component-library swap feature (retired separately). The library-tile
> swap couldn't preserve content + dimensions because library assets are
> rigid hand-authored tiles, not adaptive content. AI Edit element mode
> handles "swap this for something better" natively: prompt → adapted
> markup that inherits original content + sizing context. See section
> 1 + 2 below for goals/non-goals.
>
> Prior session research that grounds this plan:
> - `docs/research/2026-05-16-shuffle-features-research.md` — industry
>   pattern survey (Plasmic / Onlook / Webflow are converging on
>   AI-element-edit, not library tiles).
> - `memory/feedback_proper_research_is_non_negotiable.md` — Rule 7
>   discipline; read every helper/proxy before code edits.
> - Retired surfaces (Move tool, Try Variations, component swap from
>   library) follow the same "drop button + keep code on disk" pattern
>   per CLAUDE.md status blocks.

## 1. Overview

Add AI-powered editing to Dropin templates with two scopes of intervention: click a single element to edit it, or expand the selection to its containing semantic section. Both modes route to Tensorix using minimax-m2 as the default model. The interaction model is "click, prompt, apply" with optimistic preview and one-step undo.

This is not a full-page regenerator. It is a scalpel for vibecoders iterating on landing page sections.

## 2. Goals and non-goals

**Goals**

- Let users edit any visible element or section by clicking it and describing a change in plain language.
- Keep median edit latency under 6 seconds.
- Keep median edit cost under €0.005 per action.
- Preserve template integrity: no broken markup, no lost script tags, no dropped Tailwind utilities outside the edited scope.
- Work across the existing template library (HTML and JSX flavors) without per-template config.

**Non-goals**

- Full-page rewrites or "change the whole vibe" prompts. Out of scope for v1.
- Backend-aware edits (forms, data fetching, auth). Pure presentational layer only.
- Multi-step agentic flows. One prompt, one response, one apply.
- Real-time collaborative editing.

## 3. User experience

### 3.1 Selection

When the user hovers any element in the preview iframe, render a 2px outline using the Dropin accent color and a small floating chip in the top-left of the bounding box showing the element's tag and class fingerprint (e.g. `section.hero`, `button.cta-primary`).

Click selects the element. Selection persists until the user clicks outside the preview, presses Escape, or applies an edit.

### 3.2 Scope expansion

Selection has two states: **element** and **section**.

- Default state on click is **element**.
- Pressing Tab (or Shift+click on the same target) expands to **section** by walking up the DOM to the nearest semantic boundary (see 4.1).
- Pressing Shift+Tab collapses back to element if currently in section mode.
- Escape clears selection.

The scope chip updates to reflect the active mode and shows an approximate token count: `Editing: hero section · ~2.3k tokens`.

### 3.3 Prompt input

A floating prompt bar appears anchored to the bottom of the selection bounding box (or the viewport bottom if the selection extends beyond view). It contains:

- Mode toggle (Element / Section) reflecting current scope, clickable to switch.
- Single-line textarea with placeholder hinting at scope: `"Change the headline to..."` for element, `"Redesign this section as..."` for section.
- Submit button (Enter to fire, Shift+Enter for newline).
- Cancel (Escape).

### 3.4 Applying the edit

On submit:

1. Prompt bar shows a shimmer state with the active model name (`minimax-m2`).
2. Request fires to Tensorix.
3. On response, the new markup replaces the selected node in the preview iframe via a single `outerHTML` swap.
4. A toast appears bottom-right: `Edit applied · Undo (⌘Z)`.
5. The edit is pushed onto a session history stack for undo/redo.

If the response is malformed or the swap fails validation (see 6.2), the original markup is restored and an error toast surfaces: `Edit failed. Try again or rephrase.`

### 3.5 History

Maintain a per-session edit stack of up to 50 actions. Each entry stores: scope mode, selector path, original outerHTML, new outerHTML, prompt text, timestamp, model used, token usage.

⌘Z / Ctrl+Z reverts the last edit. ⌘⇧Z / Ctrl+Shift+Z redoes it. A "History" side panel (collapsed by default) lists actions with their prompts, allowing jump-to-state.

## 4. Technical architecture

### 4.1 Section boundary detection

Walk up from the clicked element. Return the first ancestor matching any of:

- Semantic tags: `section`, `header`, `footer`, `nav`, `aside`, `main`, `article`.
- `role="region"` or `role="banner"` or `role="contentinfo"`.
- Class fingerprints common in Dropin templates: classes containing `hero`, `features`, `pricing`, `cta`, `testimonial`, `bento`, `footer`, `navbar`, `faq`.
- Direct children of `<body>` if no semantic ancestor matches before reaching it.

If none match, fall back to the element itself (section mode collapses to element mode silently, chip updates).

```js
const SECTION_TAGS = new Set(['SECTION', 'HEADER', 'FOOTER', 'NAV', 'ASIDE', 'MAIN', 'ARTICLE'])
const SECTION_ROLES = new Set(['region', 'banner', 'contentinfo'])
const SECTION_CLASS_RX = /\b(hero|features?|pricing|cta|testimonial|bento|footer|navbar|nav-|faq|stats?|logos?|gallery)\b/i

function findSectionScope(el) {
  let node = el
  while (node && node !== document.body) {
    if (SECTION_TAGS.has(node.tagName)) return node
    const role = node.getAttribute('role')
    if (role && SECTION_ROLES.has(role)) return node
    if (node.className && SECTION_CLASS_RX.test(node.className)) return node
    if (node.parentElement === document.body) return node
    node = node.parentElement
  }
  return el
}
```

### 4.2 Payload construction

For both modes, payload = scope outerHTML + minimal styling context + user prompt.

**Element mode** payload:

```json
{
  "scope": "element",
  "target_html": "<button class='...'>...</button>",
  "parent_context": "<div class='hero-cta-wrapper'>...</div>",
  "user_prompt": "make it darker and add an arrow icon",
  "tailwind_config_excerpt": "[only color tokens referenced in target]"
}
```

`parent_context` is the outerHTML of the parent, with the target's content replaced by a `{{TARGET}}` placeholder. This gives the model styling context without bloating tokens.

**Section mode** payload:

```json
{
  "scope": "section",
  "target_html": "<section class='hero'>...</section>",
  "user_prompt": "redesign as a split layout with image right",
  "tailwind_config_excerpt": "[full color and typography tokens]",
  "design_system_hints": {
    "primary_font": "Inter",
    "spacing_unit": "8px",
    "border_radius_default": "rounded-xl"
  }
}
```

Design system hints are extracted at template load time by parsing the `tailwind.config` block embedded in each template.

### 4.3 API call

Tensorix is OpenAI-compatible:

```js
const response = await fetch('https://api.tensorix.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TENSORIX_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'minimax/minimax-m2',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserMessage(payload) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: scope === 'element' ? 1500 : 6000,
    stream: false
  })
})
```

Use `stream: true` in v1.1 to render token-by-token in the prompt bar for perceived speed. For v1 keep it simple.

### 4.4 Response handling

Expected response shape (model returns JSON):

```json
{
  "html": "<button class='...'>...</button>",
  "notes": "Added arrow-right icon from Lucide, increased background opacity"
}
```

Pipeline:

1. Parse JSON. If parse fails, retry once with a stricter prompt suffix: `Your previous response was not valid JSON. Return only valid JSON matching the schema.`
2. Validate HTML with a sandboxed parser (DOMParser). Reject if it contains script tags not present in the original, iframes, or event handler attributes (`onclick`, `onload`, etc.) not in the original.
3. Validate that the root tag of `html` matches the root tag of the original `target_html`. (Prevents the model from returning a different element type that would break parent layout.)
4. Swap `outerHTML` on the live preview node.
5. Push to history.

### 4.5 Frontend module structure

```
dropin/
  ai-edit/
    selector.ts        // hover, click, scope expansion
    scope.ts           // findSectionScope, token estimation
    payload.ts         // payload construction
    client.ts          // Tensorix API wrapper, retry, streaming
    apply.ts           // validation + DOM swap
    history.ts         // undo/redo stack
    prompts/
      system.ts        // system prompt constants
      element.ts       // element-mode user message builder
      section.ts       // section-mode user message builder
```

## 5. Model and prompts

### 5.1 Model selection

- **Default:** `minimax/minimax-m2` (€0.25/€1.00 per 1M tokens, 197K context, reasoning).
- **Fallback on rate limit or error:** `qwen/qwen3-coder-30b-a3b-instruct` (€0.06/€0.25, fast, coding-specific). Used silently with a small "Fast mode" indicator.
- **Power user override (settings):** `z-ai/glm-5` or `minimax/minimax-m2.5` for users who report quality issues.

### 5.2 System prompt

```
You are a precision HTML editor for Dropin, a landing page template tool. You
receive a fragment of HTML, optional context, and a natural language change
request. You return a single JSON object: { "html": "...", "notes": "..." }.

Rules:
- The "html" field must contain valid HTML with the same root tag as the input.
- Preserve all unrelated content, classes, attributes, and child elements.
- Use only Tailwind utility classes that exist in the standard Tailwind v3 set
  plus the custom tokens listed in tailwind_config_excerpt.
- Do not add inline styles unless the input already had them.
- Do not add script tags, iframes, or event handler attributes.
- Match the design system hints if provided.
- Keep the same overall information hierarchy unless explicitly asked to change it.
- The "notes" field is a short human-readable summary of what you changed.

Return JSON only. No markdown fences, no preamble.
```

### 5.3 User message builders

**Element mode:**

```
Edit the following HTML element based on the user's request.

Parent context (for styling reference, do not modify):
{parent_context}

Target element:
{target_html}

Available Tailwind tokens:
{tailwind_config_excerpt}

User request: {user_prompt}
```

**Section mode:**

```
Redesign or modify the following HTML section based on the user's request.
Keep the section's role and overall purpose intact unless explicitly told otherwise.

Section HTML:
{target_html}

Available Tailwind tokens:
{tailwind_config_excerpt}

Design system:
{design_system_hints}

User request: {user_prompt}
```

### 5.4 Prompt caching

Tensorix supports prompt caching. Cache the system prompt and the per-template `tailwind_config_excerpt + design_system_hints` block as a stable prefix. Cached tokens are billed at a reduced rate (verify exact discount in Tensorix docs at integration time). This is meaningful for users iterating on the same template repeatedly.

## 6. Guardrails and failure modes

### 6.1 Token budget enforcement

Before firing the request, estimate tokens from the payload character count (rough heuristic: chars / 3.5 for HTML). If section mode exceeds 8k input tokens, show a warning chip: `Large section · this may take 10+ seconds` and require explicit confirmation. This protects against absurdly large sections (entire bento grids with embedded SVGs) hitting expensive territory.

### 6.2 Response validation

Reject and surface error if:

- JSON parse fails twice.
- Root tag mismatch between input and output.
- Output contains forbidden elements (script, iframe) or handlers not in the input.
- Output is suspiciously short (less than 20% of input length) on section mode, suggesting truncation.
- Output exceeds 1.5x input length on element mode, suggesting hallucinated additions.

On rejection, restore the original markup and log the failure (model, prompt, response) to the local session for debugging. Optionally surface a "Report bad edit" button that sends the trace to Akella inMotion telemetry.

### 6.3 Rate limiting

Client-side: 1 in-flight request per session, queue subsequent. Show queue position in the prompt bar.

Server-side (when proxying through your backend): per-user limit of 60 edits per hour on free tier, 600 per hour on paid. Adjust after observing real usage.

### 6.4 Cost protection

Hard ceiling per session: 200 edits. After that, show a friendly modal: "You've made 200 edits this session. Take a break or upgrade." This is both a cost cap and a UX intervention against thrash.

## 7. Cost model

Working assumptions:

- Element edit: ~1.5k input, ~0.8k output.
- Section edit: ~4k input, ~2.5k output.
- Mix: 70% element, 30% section (estimate, refine after telemetry).

Per-edit cost on minimax-m2:

| Scope | Input cost | Output cost | Total |
|---|---|---|---|
| Element | €0.000375 | €0.0008 | ~€0.001 |
| Section | €0.001 | €0.0025 | ~€0.004 |

Weighted average per edit at 70/30 mix: **€0.002**.

Projected cost per user session (20 edits average): **€0.04**.

Monthly projection at 1,000 active users, 5 sessions/week each: **~€800/month** in raw API cost. Comfortable margin if Dropin paid tier sits at €9-19/mo.

Add ~20% headroom for retries, design system caching misses, and validation failures. Budget €1,000/month for 1k active users.

## 8. Telemetry

Capture per edit (anonymized):

- Scope (element/section).
- Template ID.
- Model used.
- Input tokens, output tokens.
- Latency end-to-end.
- Success (applied) / failure (validation rejected) / aborted (user cancelled).
- Time-to-first-edit per session (proxy for discoverability).
- Edits-per-session distribution.

This data feeds three things: cost optimization, model selection tuning, and a future "popular edits" feature suggesting common transformations.

## 9. Implementation phases

**Phase 0 (week 0, pre-implementation): retire component-library swap**

- Drop "Browse components" button from VibePropertiesPanel / TextControls / LinkControls / CardControls.
- Mark `InlineComponentBrowser.tsx`, `lib/component-library/preserve-content.ts`, `lib/component-library/insert.ts`, related routes as retired-on-disk (comment headers, no UI mount).
- Same pattern as Move + Try Variations.
- Frees the "swap component" mental model so AI Edit can claim it cleanly.

**Phase 1 (week 1): selection layer**

- Hover outline, click selection, scope chip.
- DOM walker for section boundary.
- Tab/Shift+Tab/Escape keybindings.
- No AI yet, just selection working in the preview iframe.
- Reuse existing `lib/vibe-edit/runtime.ts` selection infrastructure where possible (already has OID-based + path-based selection from the retired vibe-edit flow).

**Phase 2 (week 2): API integration**

- Tensorix client with key from env (decision: BYO-key like `/api/llm-rewrite/route.ts` OR server-paid). See Open Questions.
- System prompt and message builders.
- Element mode end-to-end with the bento grid template as the test case.
- Manual JSON validation and DOM swap.

**Phase 3 (week 3): section mode + polish**

- Section payload builder with design system hints extraction.
- Response validation pipeline.
- Undo/redo stack (or integrate with existing `useEditHistory` if mode-compatible).
- Toast and error UX (reuse `showInfo` / `showWarn` from Workspace).

**Phase 4 (week 4): hardening**

- Telemetry pipeline.
- Rate limiting (client-side first).
- Fallback model wiring.
- Prompt caching wired up.
- Manual QA across all four uploaded templates.

**Phase 5 (post-launch): refinement**

- Streaming responses for perceived speed.
- "Report bad edit" feedback loop.
- Model A/B based on telemetry.
- History side panel.

## 10. Open questions

1. **Diff vs full-replace for section mode?** Full-replace is simpler to validate. Diff is cheaper but adds a second validation pass. Recommendation: ship full-replace in v1, add diff as an optimization in v1.1 if telemetry shows section mode dominating cost.

2. **JSX templates: rendered DOM or source JSX?** Recommendation: operate on rendered DOM (simpler, model-agnostic to framework) and provide a separate "Copy as JSX" export that runs an HTML-to-JSX transform on the final state. We already have `lib/component-library/html-to-jsx.ts` from the retired component swap — reusable for export. The "Copy this section's code" feature shipped 2026-05-15 also already does this for selection-scoped JSX export.

3. **Model picker in UI?** Recommendation: hidden in v1, settings-flag in v1.1 once we have usage data on quality complaints.

4. **Free tier limits: hard 60/hour or daily?** Watch telemetry, decide after 2 weeks of paid beta.

5. **NEW — Key management.** Existing `app/api/llm-rewrite/route.ts` is BYO-key (user supplies OpenAI/Anthropic key from localStorage; key flows through a relay route, never persisted server-side). Should AI Edit follow BYO-key (zero billing risk, friction for adoption) or server-paid Tensorix (smooth UX, billing risk + the 200-edits/session + 60-edits/hour caps from section 6.4)? Recommendation: server-paid via Tensorix per the plan; reuse the BYO-key path's IP rate-limit + body-sanitization patterns from `lib/rate-limit.ts` + `lib/llm-rewrite-parser.ts`.

6. **NEW — Selection layer reuse.** The existing vibe-edit selection infra (`lib/vibe-edit/runtime.ts`, `lib/vibe-edit/path.ts`, `lib/vibe-edit/kind.ts`) handles hover outline, click selection, OID resolution, and per-element-type panel routing. Phase 1's selection layer should LAYER on top, not replace. The scope chip + section expansion are additions; the underlying click-resolution + path generation are stable. Saves ~1 week of Phase 1.

## 11. Success criteria

- 80% of edit attempts result in an applied change (no validation failure, no user-initiated undo within 30 seconds).
- Median latency under 6 seconds for section mode, under 3 seconds for element mode.
- Average cost per active user per month under €1.
- 50%+ of users who try the feature make a second edit within the same session.
- Net positive feedback in the first 100 collected "edit quality" ratings.

---

## Locking notes (2026-05-17)

- This plan SUPERSEDES the component-library swap feature, which had multiple compounding bugs (rigid library tiles, OID injection misses on JSX fragments, content/dimension preservation never landed cleanly). Retirement is Phase 0.
- "Swap this card to a different style" — the user's original request that motivated the component library — is naturally expressed as an element-mode AI Edit prompt: `"redesign this card with a darker chrome and rounded corners"`. The AI returns adapted markup that inherits content + dimensions by construction (the LLM reads the input HTML, modifies styling, preserves the rest). This is the "Path C" recommended in 2026-05-17 conversation: AI does the structural work that rigid library tiles can't.
- Pre-existing infrastructure to leverage:
  - `app/api/llm-rewrite/route.ts` — BYO-key relay pattern for reference; rate-limit + body-validation reusable.
  - `lib/rate-limit.ts` — IP-bucket rate limiter (extracted from audit Domain 2).
  - `lib/llm-rewrite-parser.ts` — parse-don't-validate request validator pattern.
  - `lib/vibe-edit/runtime.ts` — selection layer (hover, click, OID resolution, scope detection) — can be augmented for Phase 1.
  - `lib/vibe-edit/path.ts` — selector path generation, round-trip tested.
  - `lib/component-library/html-to-jsx.ts` — HTML → JSX converter (32-entry SVG_TAG_MAP + 50+-entry SVG_ATTR_MAP). Reusable for "Copy as JSX" export (Open Question #2).
  - `showInfo` / `showWarn` toast surface in `Workspace.tsx` — reusable for AI Edit feedback.
  - `useEditHistory` hook — may or may not satisfy AI Edit's 50-action stack with optimistic-replace semantics. Evaluate in Phase 3.
- The vibe-edit panel surfaces (TextControls / LinkControls / CardControls / ImageControls / IconControls) STAY as the per-element-type fine-grained edit path. AI Edit is for "describe a change"; vibe-edit panel is for "tweak a specific field." Both modes coexist; complementary.
