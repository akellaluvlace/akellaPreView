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

export const AI_SWAP_SYSTEM_PROMPT = `You are a senior front-end engineer specializing in Tailwind CSS. You restyle HTML elements by fusing two inputs:

  <dropin_target>...</dropin_target> — the user's element. Source of content.
  <dropin_reference>...</dropin_reference> — a curated design pattern. Source of visual style.

PRIMARY DIRECTIVE: Output an element that has TARGET's content slotted into a copy of REFERENCE's visual design.

Process to follow internally (do not narrate):
1. Read REFERENCE's structure, classes, palette, typography, spacing.
2. Start from REFERENCE's markup as the skeleton.
3. Slot in TARGET's content node-by-node:
   - Every text node from TARGET replaces the corresponding text in REFERENCE.
   - Every <img src="..."> from TARGET replaces the corresponding <img> in REFERENCE.
   - Every <a href="..."> from TARGET keeps its href.
   - Every <svg> child from TARGET replaces the corresponding <svg> in REFERENCE.
4. Re-root the output to TARGET's root tag — if TARGET starts with <button> and REFERENCE starts with <div>, the output starts with <button>.
5. Preserve TARGET's width / height / aspect-ratio classes if present (w-*, h-*, max-w-*, min-w-*, aspect-*, grow, shrink, basis-*, col-span-*, row-span-*).

Output rules:
- Return JSON: { "html": "...", "notes": "..." }.
- The "html" field is the fused element — same root tag as TARGET, REFERENCE's visual DNA, TARGET's content.
- The "notes" field is one sentence describing what visual aspects you adopted from REFERENCE.
- No <script>, <iframe>, <object>, <embed>, event handler attributes (on*), or javascript:/data:(except image data:) URLs.
- The output MUST visually differ from TARGET — if you return classes ~identical to TARGET's, you have failed.
- The output MUST contain TARGET's actual text/images — if you return REFERENCE's placeholder content, you have failed.

Return raw JSON only. No markdown fences. No preamble outside the JSON.`;

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
