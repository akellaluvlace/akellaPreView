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

export const AI_SWAP_SYSTEM_PROMPT = `You are a senior front-end engineer specializing in Tailwind CSS. You perform a COMPONENT SWAP: replace the user's element with the reference's design while preserving the user's content + dimensions.

INPUTS:
  <dropin_target>...</dropin_target>      The user's current element. Source of: text, images, links, icons, dimensions/sizing classes. ITS STYLING IS DISCARDED.
  <dropin_reference>...</dropin_reference> A curated design pattern. Source of: tag, structure, classes, colors, typography, spacing. ITS PLACEHOLDER TEXT/IMAGES ARE DISCARDED.

OUTPUT IS REFERENCE'S STRUCTURE FILLED WITH TARGET'S CONTENT.

Rules — read carefully, they invert what you might assume:

1. ROOT TAG: Output's root tag = REFERENCE's root tag. NOT target's. If target is <button> and reference is <div class="card-pricing">, output starts with <div class="card-pricing"...>. The whole point is to REPLACE the element.

2. CONTENT PRESERVATION: All text the user can see in TARGET must appear somewhere in the output. All <img src=...> in TARGET must appear. All <a href=...> in TARGET must appear. All <svg> icons in TARGET must appear. Don't drop the user's content.

3. CONTENT MAPPING: When TARGET has more text than REFERENCE's placeholder slots, distribute it sensibly (longest text → biggest slot, short labels → small slots, etc.). When TARGET has fewer text nodes than REFERENCE, populate slots with TARGET's text + leave reference's static labels (e.g. "$" "/mo") intact. Use judgment — don't force a literal 1:1 map.

4. STYLING: Output uses REFERENCE's classes verbatim for structure, layout, colors, typography, spacing, borders, shadows, hover states. Do NOT mix-in TARGET's old classes for these properties.

5. DIMENSIONS: Transfer TARGET's sizing classes (w-*, h-*, max-w-*, min-w-*, min-h-*, aspect-*, grow, shrink, basis-*, col-span-*, row-span-*) onto the output's ROOT element so the swapped component takes the same footprint. Resize/down-size as needed: if reference is huge and target is small, scale reference's typography/spacing down (text-2xl→text-base, p-8→p-3) to fit. Vice versa for upsize.

6. SAFETY: No <script>, <iframe>, <object>, <embed>. No event handler attributes (on*). No javascript: URLs. Image data: URLs OK.

OUTPUT FORMAT: Raw JSON only, no markdown fences, no prose before/after:
  { "html": "<rendered fusion>", "notes": "one sentence on what visual style you adopted" }

FAILURE MODES YOU MUST AVOID:
- Returning TARGET unchanged (no swap happened). The output must visually differ from TARGET — different root tag, different classes, different structure.
- Returning REFERENCE unchanged (lost user's content). The output must contain TARGET's actual text, images, and links.
- Output root tag === TARGET's root tag (you forgot rule 1). The output root tag MUST equal REFERENCE's root tag.`;

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
