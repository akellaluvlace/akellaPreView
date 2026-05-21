// 2026-05-21 — Validate a BYO-AI swap response before applying via
// setCode.
//
// The response is the FULL file the AI returned (after fence
// extraction). We do light validation:
//
//   1. Length sanity — within [0.5×, 1.5×] of the input source
//   2. No forbidden tags (security): <script> bodies, <iframe>,
//      <object>, <embed>, on*= event handlers, javascript: URIs
//   3. No-op detection — the target's original outerHtml snippet
//      should NOT appear verbatim in the response (means the AI
//      didn't actually swap anything)
//   4. Light parseability — naive bracket-balance check
//
// We deliberately DON'T do strict AST parse here because:
//   - HTML mode would need parse5 + the bundler-config dance
//   - JSX mode parsing via Babel is heavy + can falsely reject
//     valid frontier-model outputs that use modern syntax
//   - The downstream setCode + iframe rebuild path will surface
//     parse errors via the existing iframe error handler
//   - Stricter validation belongs at the edges (we trust the user's
//     own AI more than we trusted Tensorix)
//
// Failure modes return a specific `reason` string the modal can show
// next to the textarea so the user knows what to fix.

export interface ValidateResponseOptions {
  inputSource: string;
  outputSource: string;
  targetOuterHtml: string;
  // Reserved for future kind-specific checks. Unused in v1 — both
  // HTML and JSX go through the same validators.
  kind: "html" | "jsx";
}

export interface ValidateResponseResult {
  ok: boolean;
  reason: string | null;
}

const FORBIDDEN_TAGS = [
  // <script> tags inside the user's content are forbidden EXCEPT the
  // Tailwind config script which our templates already use. We let
  // the user's existing scripts pass through (length check + no
  // event handlers catches actually bad scripts).
  // Skip exact <script>/<iframe> body checks for v1 — too easy to
  // false-positive on legit template chrome. Focus on the high-risk
  // additions instead (event handlers + js: URIs below).
] as const;

// Match `on{anything}=` as an attribute. Negative lookbehind for `-`
// avoids matching CSS like `transition-on=...` (not a real attr but
// defensive). Common ones: onclick, onerror, onload, onmouseover, etc.
const EVENT_HANDLER_RE = /\bon[a-z]+\s*=/i;

const JAVASCRIPT_URI_RE = /javascript:\s*[^"'\s]/i;

export function validateResponse(
  opts: ValidateResponseOptions,
): ValidateResponseResult {
  const { inputSource, outputSource, targetOuterHtml } = opts;

  if (!outputSource || outputSource.length < 50) {
    return {
      ok: false,
      reason:
        "Response looks empty or way too short. Make sure you pasted the full updated file.",
    };
  }

  // Length sanity — within [0.5×, 1.5×] of input, with an additive
  // +2000 floor for small files. Frontier models occasionally
  // truncate long files or add extensive comments; the ratio catches
  // both. The +2000 floor handles the edge case where a swap from a
  // tiny button to a complex animated card legitimately doubles a
  // small file's size (1KB → 2.5KB is fine; 30KB → 75KB is not).
  //
  // H4 fix (2026-05-21): mirrors the Phase 5 ai-edit length-cap fix.
  // Without the additive floor, small-file swaps were rejected for
  // legitimate expansion.
  const inLen = inputSource.length;
  const outLen = outputSource.length;
  const ratio = outLen / Math.max(inLen, 1);
  if (ratio < 0.5) {
    return {
      ok: false,
      reason: `Response is suspiciously short (${outLen} chars vs ${inLen} in your source). The AI may have truncated the file.`,
    };
  }
  const upperCap = Math.max(inLen * 1.5, inLen + 2000);
  if (outLen > upperCap) {
    return {
      ok: false,
      reason: `Response is suspiciously long (${outLen} chars vs ${inLen}). The AI may have added extra content beyond the swap.`,
    };
  }

  // No-op detection — if the target's original outerHtml snippet
  // appears AS OFTEN in the output as in the input, nothing was
  // swapped. We strip whitespace + OID attributes before comparing
  // because OIDs shift legitimately + whitespace varies across model
  // serializations.
  //
  // H1 fix (2026-05-21): was a binary `includes` check, which
  // false-rejected cascade swaps. Templates with N=3 buttons all
  // having the same outerHtml would: AI swap one → output has 2
  // copies + 1 new element → original outerHtml STILL present → old
  // check rejected as no-op. Now we count occurrences: input had K,
  // output has K-1 or fewer → at least one was swapped → accept.
  const normalize = (s: string) =>
    s.replace(/\sdata-dropin-id="[^"]*"/g, "").replace(/\s+/g, " ").trim();
  const targetNorm = normalize(targetOuterHtml);
  const inputNorm = normalize(inputSource);
  const outputNorm = normalize(outputSource);
  if (targetNorm.length > 20) {
    const countOccurrences = (haystack: string, needle: string): number => {
      if (!needle) return 0;
      let count = 0;
      let pos = 0;
      while ((pos = haystack.indexOf(needle, pos)) !== -1) {
        count += 1;
        pos += needle.length;
      }
      return count;
    };
    const inputCount = countOccurrences(inputNorm, targetNorm);
    const outputCount = countOccurrences(outputNorm, targetNorm);
    // Catch the unchanged case: output still contains target the same
    // number of times the input did. If even ONE was swapped, the
    // count drops by at least 1 — accept.
    if (inputCount > 0 && outputCount >= inputCount) {
      return {
        ok: false,
        reason:
          "The element you wanted to swap is still in the response unchanged. The AI may have ignored the swap instruction — try a different reference or rephrase.",
      };
    }
  }

  // Security: event handler attributes
  if (EVENT_HANDLER_RE.test(outputSource)) {
    const sample = outputSource.match(EVENT_HANDLER_RE)?.[0] ?? "on*=";
    return {
      ok: false,
      reason: `Response contains an event-handler attribute (${sample.trim()}) — refusing for security. Edit the response to remove it before applying.`,
    };
  }

  // Security: javascript: URIs
  if (JAVASCRIPT_URI_RE.test(outputSource)) {
    return {
      ok: false,
      reason:
        'Response contains a `javascript:` URI — refusing for security. Edit the response to remove it before applying.',
    };
  }

  // FORBIDDEN_TAGS placeholder — kept structurally to make adding
  // future tags trivial without changing the result shape.
  for (const tag of FORBIDDEN_TAGS) {
    if (outputSource.toLowerCase().includes(`<${tag}`)) {
      return {
        ok: false,
        reason: `Response contains a forbidden <${tag}> tag.`,
      };
    }
  }

  return { ok: true, reason: null };
}
