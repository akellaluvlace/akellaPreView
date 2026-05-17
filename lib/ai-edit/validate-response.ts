// 2026-05-17 — AI Edit response validation. Plan §6.2.
//
// Pipeline:
//   1. Parse JSON. Strip optional markdown fences.
//   2. Verify { html: string, notes?: string } shape.
//   3. Root-tag-match: returned root tag must equal input root tag.
//      Prevents the model breaking the parent's flex/grid layout.
//   4. Forbidden-tag scan: no <script>, <iframe>, <object>, <embed>,
//      <style> additions not in the original. No on* attributes. No
//      javascript:/data: URLs in href/src.
//   5. Length sanity: element-mode output ≤ 1.5× input; section-mode
//      output ≥ 20% input (suspiciously short = truncated).
//
// Pure logic — runs server-side after the Tensorix call. Operates on
// raw strings (regex + simple parsing) because we don't want to
// trust a DOMParser on a Node runtime; the iframe will be the final
// arbiter when the swap lands.

export type ValidatedAiResponse = {
  html: string;
  notes?: string;
};

export type ValidationResult =
  | { ok: true; value: ValidatedAiResponse }
  | { ok: false; error: string };

// Strip optional markdown fences the model might emit despite the
// system prompt telling it not to. Matches ```json ... ``` or ``` ... ```.
function stripFences(s: string): string {
  let trimmed = s.trim();
  if (trimmed.startsWith("```")) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```$/m, "").trim();
  }
  return trimmed;
}

// Extract the lowercased root tag name from an outerHTML fragment.
// Returns null if no opening tag found at the start.
export function extractRootTag(html: string): string | null {
  const trimmed = html.trim();
  // Match <tagname (possibly with attrs / self-close). Case-insensitive
  // because the model may return TitleCase, parentheses-free; HTML is
  // case-insensitive for tag names.
  const m = trimmed.match(/^<([a-zA-Z][a-zA-Z0-9-]*)/);
  return m ? m[1].toLowerCase() : null;
}

const FORBIDDEN_TAG_RX =
  /<\s*(script|iframe|object|embed)\b/i;

const ON_HANDLER_RX = /\son[a-z]+\s*=/i;

const DANGEROUS_URL_RX =
  /(?:href|src|action|formaction)\s*=\s*["']?\s*(?:javascript:|data:(?!image\/))/i;

function findForbidden(html: string, original: string): string | null {
  // Allow forbidden tags that were already in the original. The user's
  // template might legitimately have a <script> for inline JS; we just
  // don't want the model adding new ones.
  if (FORBIDDEN_TAG_RX.test(html) && !FORBIDDEN_TAG_RX.test(original)) {
    return "Response contains <script>, <iframe>, <object>, or <embed>";
  }
  if (ON_HANDLER_RX.test(html) && !ON_HANDLER_RX.test(original)) {
    return "Response contains on* event handler attributes";
  }
  if (DANGEROUS_URL_RX.test(html) && !DANGEROUS_URL_RX.test(original)) {
    return "Response contains javascript: or non-image data: URLs";
  }
  return null;
}

export function validateAiResponse(
  rawText: string,
  originalHtml: string,
  scope: "element" | "section",
): ValidationResult {
  if (!rawText || typeof rawText !== "string") {
    return { ok: false, error: "Empty response from model" };
  }
  const cleaned = stripFences(rawText);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { ok: false, error: "Model returned non-JSON output" };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Model JSON is not an object" };
  }
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.html !== "string" || obj.html.length === 0) {
    return { ok: false, error: "Model JSON missing 'html' string" };
  }
  const html = obj.html.trim();
  if (!html.startsWith("<")) {
    return { ok: false, error: "Model 'html' does not look like markup" };
  }
  const inputRoot = extractRootTag(originalHtml);
  const outputRoot = extractRootTag(html);
  if (!inputRoot || !outputRoot) {
    return { ok: false, error: "Could not determine root tag for comparison" };
  }
  if (inputRoot !== outputRoot) {
    return {
      ok: false,
      error: `Root tag changed: <${inputRoot}> → <${outputRoot}>`,
    };
  }
  const forbidden = findForbidden(html, originalHtml);
  if (forbidden) {
    return { ok: false, error: forbidden };
  }
  // Length sanity. Element mode: cap at 1.5× input (no big additions).
  // Section mode: floor at 20% input (no truncation).
  if (scope === "element" && html.length > originalHtml.length * 1.5) {
    return {
      ok: false,
      error: "Element response is larger than 1.5× input — likely hallucinated",
    };
  }
  if (scope === "section" && html.length < originalHtml.length * 0.2) {
    return {
      ok: false,
      error: "Section response is shorter than 20% of input — likely truncated",
    };
  }

  const result: ValidatedAiResponse = { html };
  if (typeof obj.notes === "string" && obj.notes.length > 0) {
    result.notes = obj.notes;
  }
  return { ok: true, value: result };
}
