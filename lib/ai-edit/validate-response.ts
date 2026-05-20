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

// Extract the root tag's first 3 class tokens as a "signature." Used
// by detectNestedRootDuplicate to spot hallucinated nested copies of
// the root element. Returns null when root has no class attribute or
// fewer than 3 distinctive classes.
function extractRootClassSignature(html: string): string | null {
  const m = html.match(/^<[a-zA-Z][\w-]*\b[^>]*\bclass="([^"]*)"/);
  if (!m) return null;
  const classes = m[1].split(/\s+/).filter(Boolean);
  if (classes.length < 1) return null;
  // Use the first distinctive class (skip generic Tailwind utilities
  // that appear everywhere). If none are distinctive, take any.
  const generic = new Set([
    "flex",
    "block",
    "inline",
    "grid",
    "relative",
    "absolute",
    "fixed",
    "static",
    "p-0",
    "p-1",
    "p-2",
    "p-3",
    "p-4",
    "p-5",
    "p-6",
    "p-8",
    "m-0",
    "m-1",
    "m-2",
    "m-4",
  ]);
  for (const c of classes) {
    if (!generic.has(c) && c.length >= 4) return c;
  }
  return classes[0];
}

// Count how many times the given root signature (tag + distinctive
// class) appears in `html`, starting from the FIRST opening tag (the
// root itself counts as 1). Returns total count.
function countRootSignature(html: string, signature: string): number {
  // Match `<tag ... class="...signature...">` anywhere in the html.
  // Build a regex that escapes regex specials in the class name.
  const escaped = signature.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Match the class attribute containing the signature as a whole token.
  const re = new RegExp(
    `<[a-zA-Z][\\w-]*\\b[^>]*\\bclass="[^"]*\\b${escaped}\\b[^"]*"`,
    "g",
  );
  let count = 0;
  while (re.exec(html) !== null) count++;
  return count;
}

function detectNestedRootDuplicate(
  html: string,
  original: string,
): string | null {
  const sig = extractRootClassSignature(html);
  if (!sig) return null;
  const newCount = countRootSignature(html, sig);
  if (newCount < 2) return null;
  // Allow legitimate cases where the ORIGINAL already had this many.
  const originalCount = countRootSignature(original, sig);
  if (newCount <= originalCount) return null;
  return `Output contains ${newCount} elements with class "${sig}" — likely nested-duplicate hallucination`;
}

// 2026-05-20 — Detect JSX expressions leaking into rendered-HTML output.
// User session caught `cardCls is not defined` runtime error after the
// AI emitted `<div className={cardCls}>` as if writing JSX. Such output
// breaks the iframe when patched into source (the identifier doesnt
// exist in the JSX scope). Reject any attribute value or text node that
// looks like a bare JSX expression: `{identifier}` or `{`template`}`.
//
// False-positive guard: legitimate CSS arbitrary-value classes use
// curly braces inside square brackets (`bg-[url('x')]`, `text-[14px]`)
// but those are INSIDE class="..." attribute values, surrounded by `[`
// and `]`. The detection regex matches `{...}` OUTSIDE square brackets.
function findJsxExpressionLeak(html: string): string | null {
  // Match unquoted `{...}` patterns that look like JSX expressions.
  // Patterns to catch:
  //   className={foo}
  //   class="{cardCls}"           (model confused HTML with JSX in string)
  //   {expression} as text node
  //   attr={`template ${x}`}
  //
  // What to allow:
  //   bg-[url(...)] inside class="..."
  //   text-[14px] inside class="..."
  //   {{ in inline style (rare CSS escape)
  //
  // Conservative: flag `attr={...}` (any attribute with unquoted curly
  // braces) and any `="{...}"` (string-quoted curly braces in attr).
  if (/=\{[^}]+\}/.test(html)) {
    return "Output contains JSX expression attribute (use class=, not className={...})";
  }
  // Check for quoted-string attributes containing { not within square brackets.
  // Match: ="..." or '...' where the value contains {ident}
  const attrMatches = html.match(/=["']([^"']+)["']/g);
  if (attrMatches) {
    for (const am of attrMatches) {
      const inner = am.slice(2, -1);
      // Skip if all braces are inside square brackets (Tailwind arbitrary)
      const stripped = inner.replace(/\[[^\]]*\]/g, "");
      if (/\{[a-zA-Z_$][\w$]*\}/.test(stripped)) {
        return `Output contains JSX-expression-like literal "${am.slice(0, 60)}..." — model emitted JSX syntax in HTML output`;
      }
    }
  }
  return null;
}

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
  mode: "edit" | "swap" = "edit",
  referenceHtml?: string,
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
  if (!outputRoot) {
    return { ok: false, error: "Could not determine output root tag" };
  }
  // Phase 6 (2026-05-18) BUGFIX — root tag match is ONLY for edit mode.
  // In swap mode the whole POINT is to replace the element with the
  // reference's structure, so the output root tag should match the
  // REFERENCE's root tag, not the target's. Without this exception
  // the swap silently fails on every reference whose tag differs from
  // the target (e.g. button → div.card swap).
  if (mode === "edit") {
    if (!inputRoot) {
      return {
        ok: false,
        error: "Could not determine input root tag for comparison",
      };
    }
    if (inputRoot !== outputRoot) {
      return {
        ok: false,
        error: `Root tag changed: <${inputRoot}> → <${outputRoot}>`,
      };
    }
  } else if (mode === "swap" && referenceHtml) {
    // Swap-mode root tag check: output must match REFERENCE's root.
    // Skipped silently when reference root can't be determined (rare;
    // would only happen on malformed reference HTML).
    const refRoot = extractRootTag(referenceHtml);
    if (refRoot && refRoot !== outputRoot) {
      return {
        ok: false,
        error: `Swap output root <${outputRoot}> does not match reference root <${refRoot}>`,
      };
    }
  }
  const forbidden = findForbidden(html, originalHtml);
  if (forbidden) {
    return { ok: false, error: forbidden };
  }
  const jsxLeak = findJsxExpressionLeak(html);
  if (jsxLeak) {
    return { ok: false, error: jsxLeak };
  }
  // 2026-05-20 — Nested-duplicate-root detection. Manual test caught
  // qwen-coder hallucinating a NESTED <div class="glass-card"> inside
  // the user's existing <div class="glass-card"> when the prompt was
  // ambiguous ("change background to patterned one"). The model
  // interpreted "patterned" as a decorative card nested inside. Reject
  // any output where the root element's distinctive class signature
  // appears MORE than once in the output's tree — unless the original
  // ALREADY had multiple of that signature (rare; templates with
  // intentional nested same-class elements exist).
  const dupCheck = detectNestedRootDuplicate(html, originalHtml);
  if (dupCheck) {
    return { ok: false, error: dupCheck };
  }
  // Length sanity. SWAP MODE NEVER FALLS THROUGH TO ELEMENT/SECTION
  // bounds — the target-relative caps are meaningless when the
  // reference is the structural template. If a swap call arrives
  // without referenceHtml (shouldn't happen — parser rejects it),
  // skip length checks entirely rather than misapply the element
  // rule that triggered the Phase 6 hotfix #1 manual-test failure.
  if (mode === "swap") {
    if (referenceHtml) {
      const ref = referenceHtml.length;
      if (html.length < ref * 0.3) {
        return {
          ok: false,
          error: "Swap output is much smaller than reference — likely truncated",
        };
      }
      if (html.length > ref * 3) {
        return {
          ok: false,
          error: "Swap output is much larger than reference — likely hallucinated",
        };
      }
    } else {
      console.warn("[ai-edit:validator] swap mode without referenceHtml — length check skipped");
    }
  } else if (scope === "element") {
    const cap = Math.max(originalHtml.length * 1.5, originalHtml.length + 500);
    if (html.length > cap) {
      return {
        ok: false,
        error: "Element response is much larger than input — likely hallucinated",
      };
    }
  } else if (scope === "section" && html.length < originalHtml.length * 0.2) {
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
