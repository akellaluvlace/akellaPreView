// 2026-05-18 — AI Edit swap-mode prompt (Phase 6).
//
// User picks a reference component from the library. Model fuses:
//   target's content (text, images, links, dimensions)
//   + reference's design DNA (colors, typography, spacing, structure).
//
// Pattern 3 from the prompt-engineering research: INVERTED framing —
// start from the REFERENCE markup and transplant TARGET's content into
// it. The naive framing ("edit target to match reference") triggered
// the no-op trap on qwen-coder; the inversion forces the model to
// commit to the reference's visual identity from the first token.
//
// XML-delimited inputs because (a) all 4 candidate models tokenize tags
// consistently, (b) JSON-string wrapping for HTML inflates token count
// ~15% via escape characters, (c) parse-fragility on coder models when
// strings contain unescaped quotes (which happens constantly in HTML
// attribute values).
//
// Custom delimiter names (`<dropin_target>`, `<dropin_reference>`) per
// OWASP LLM prompt-injection cheatsheet — defensive against a malicious
// template containing literal `</target>` strings in its content.

import type { AiEditRequest } from "@/lib/ai-edit/parse-request";

export const AI_SWAP_SYSTEM_PROMPT = `You are a senior front-end engineer specializing in Tailwind CSS. You perform a COMPONENT SWAP.

USER WANTS: replace their element (TARGET) with a different design (REFERENCE), but keep their actual content + dimensions.

INPUTS:
  <dropin_target>...</dropin_target>      User's current element. Source of: visible text, <img src>, <a href>, <svg> icons, sizing classes (w-*, h-*, max-w-*, aspect-*, etc.). ITS STYLING IS DISCARDED.
  <dropin_reference>...</dropin_reference> Curated design pattern. Source of: root tag, internal structure, ALL Tailwind classes (color, typography, spacing, borders, shadows, hover/focus states). ITS PLACEHOLDER TEXT/IMAGES ARE DISCARDED.

EXECUTION RECIPE (follow literally, do not deviate):

  STEP 1: COPY <dropin_reference>'s outer HTML verbatim as your starting buffer.
  STEP 2: Walk through TARGET. For each visible text node in TARGET, find the most-similar placeholder text in your buffer and replace it. For each <img src=...> in TARGET, find the corresponding <img> in your buffer and replace its src. For each <a href=...> in TARGET, find the corresponding <a> in your buffer and replace its href. For each <svg> in TARGET, replace the corresponding <svg> in your buffer.
  STEP 3: Append TARGET's sizing classes (w-*, h-*, max-w-*, min-w-*, min-h-*, aspect-*, grow, shrink, basis-*, col-span-*, row-span-*) to your buffer's ROOT element's class list. If reference has its own w-/h- they get overridden.
  STEP 4: If reference's typography/spacing looks oversized for target's footprint, scale down (text-3xl→text-lg, p-8→p-3). Vice versa for upsize.
  STEP 5: Return your buffer.

IMPORTANT: Step 1 is literal. You start with REFERENCE's markup, not TARGET's. Do not "edit TARGET to look like REFERENCE" — that produces no-op outputs. You COPY REFERENCE and SLOT IN TARGET's content.

OUTPUT'S ROOT TAG MUST EQUAL REFERENCE'S ROOT TAG.

If TARGET is <button> and REFERENCE is <div class="pricing-card">, your output starts with <div class="pricing-card"...>. The whole point of "swap" is to replace the element type.

CONTENT MAPPING when slot counts differ:
- More TARGET text than REFERENCE slots: longest text → biggest visual slot, short labels → small slots.
- Fewer TARGET text nodes: populate available slots with TARGET's text + leave reference's static labels ("$", "/mo", "Get started") intact.
- Same count: 1:1 map by visual prominence.

SAFETY:
- No <script>, <iframe>, <object>, <embed>.
- No on* event handler attributes.
- No javascript: URLs. Image data: URLs are fine in <img src>.

OUTPUT FORMAT — raw JSON, no markdown fences, no prose before/after:
  { "html": "...result of step 5...", "notes": "one sentence on what visual style you adopted from reference" }

FAILURE MODES (these are auto-rejected by the server):
- Output's root tag equals TARGET's root tag. You forgot to COPY reference's markup in step 1.
- Output is nearly identical to TARGET. You "edited" target instead of copying reference. Restart from step 1.
- Output is nearly identical to REFERENCE (placeholder text intact). You skipped step 2.`;

/**
 * Build the swap-mode user message. Combines target outerHTML +
 * reference outerHTML + optional user refinement prompt into XML-tagged
 * sections the system prompt expects.
 */
export function buildSwapUserMessage(req: AiEditRequest): string {
  if (!req.referenceHtml) {
    // Defensive — parse-request.ts already rejects swap without
    // referenceHtml, but typed-narrow here so callers get a sensible
    // error if they bypass the validator.
    throw new Error("buildSwapUserMessage requires referenceHtml");
  }
  const parts: string[] = [];
  parts.push("Fuse the following TARGET and REFERENCE.");
  parts.push("");
  parts.push("<dropin_target>");
  parts.push(req.targetHtml);
  parts.push("</dropin_target>");
  parts.push("");
  parts.push("<dropin_reference>");
  parts.push(req.referenceHtml);
  parts.push("</dropin_reference>");
  if (req.userPrompt && req.userPrompt.trim().length > 0) {
    parts.push("");
    parts.push("<dropin_user_refinement>");
    parts.push(req.userPrompt.trim());
    parts.push("</dropin_user_refinement>");
  }
  return parts.join("\n");
}
