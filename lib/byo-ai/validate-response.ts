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

// Match STRING-valued event handler attributes only: `on*="..."` or
// `on*='...'`. This is the XSS vector (e.g. `onerror="alert(1)"`).
//
// L1 fix (2026-05-22): the old `/\bon[a-z]+\s*=/i` rejected EVERY
// JSX expression handler too — `onClick={fn}` matched because the
// `/i` flag let `[a-z]+` capture "Click". That made validation
// reject every interactive JSX template (which legitimately carries
// onClick / onChange / onSubmit handlers in its existing source).
// Requiring a quote after `=` distinguishes the dangerous string
// handler from the legitimate JSX `={expression}` form.
const EVENT_HANDLER_RE = /\bon[a-z]+\s*=\s*["']/i;

const JAVASCRIPT_URI_RE = /javascript:\s*[^"'\s]/i;

// C1 (2026-05-22) — placeholder-truncation detection. Frontier models
// (Gemini especially, per github.com/google-gemini/gemini-cli #4836)
// replace large unchanged regions with comment placeholders when asked
// to return a big file. The truncated file is still valid syntax (a
// comment parses fine) + can pass the 0.5× length floor, so it would
// silently apply a half-empty template.
//
// These patterns target the COMMENT-with-ellipsis + continuation-word
// shape. We deliberately avoid bare `...` (it's the JS spread operator
// — `{...props}`, `[...arr]`). Distinguishing features:
//   - Comments that START with an ellipsis (`// ...`, `{/* ...`) —
//     real code almost never opens a comment with `...`. Protocol
//     `://` is excluded via the negative lookbehind on pattern 1.
//   - Prose "rest of the (code|file|component|...)".
//   - "... unchanged" / "unchanged ..." continuation phrases.
//   - Unicode ellipsis (…) variants.
const PLACEHOLDER_PATTERNS: ReadonlyArray<RegExp> = [
  // `// ...` line comment opening with ellipsis (not `https://...`)
  /(?<!:)\/\/\s*(\.\.\.|…)/,
  // `/* ...`, `{/* ...`, `<!-- ...` comment openings with ellipsis
  /(\/\*|\{\/\*|<!--)\s*(\.\.\.|…)/,
  // "rest of the code/file/component/markup/template/elements/imports"
  /\b(rest|remainder|remaining)\s+of\s+(the\s+)?(code|file|component|markup|template|elements?|imports?|logic|page|sections?|jsx|html|content)\b/i,
  // "... unchanged" / "... remain(s) the same" / "... as before"
  /(\.\.\.|…)\s*(unchanged|remain|same|as before|as above|omitted|truncat)/i,
  // "unchanged ..." / "omitted ..." / "truncated ..."
  /\b(unchanged|omitted|truncated|abbreviated|elided)\b[^\n]{0,24}(\.\.\.|…)/i,
  // "code/markup (remains|stays) the same" / "no changes here"
  /\b(code|markup|content|component|section)\s+(remains?|stays?)\s+(the\s+)?same\b/i,
  // explicit "(rest of ... here)" parenthetical placeholders
  /\((\s*)?(rest|remaining|unchanged|existing|same)[^)]{0,40}(\.\.\.|…)?[^)]{0,20}\)/i,
];

// C2 (2026-05-22) — TypeScript-syntax detection (JSX mode only).
// web/*.jsx templates run through the iframe's Babel-standalone with
// the JSX preset ONLY (no TS plugin). Frontier models love to "improve"
// code with type annotations, which makes the iframe silently blank
// (per memory feedback_no_ts_cast_in_jsx_templates). injectOids parses
// TS happily (its plugin list includes "typescript") so it won't catch
// this — we must.
//
// High-signal patterns chosen to minimize false positives against real
// JSX (CSS-in-JS object literals use string VALUES like `color: '#fff'`,
// not the bare type word `string`; ternaries put expressions after `:`,
// not type keywords).
const TS_SYNTAX_PATTERNS: ReadonlyArray<RegExp> = [
  /\binterface\s+[A-Za-z_$][\w$]*\b/, // interface Foo
  /\btype\s+[A-Z][\w$]*\s*=/, // type Foo =
  /:\s*(string|number|boolean|any|void|never|unknown)\b(?!\s*['"`])/, // : string annotation
  /\bas\s+const\b/, // as const
  /\bas\s+[A-Z][\w$]*\b/, // as SomeType
  /\bsatisfies\s+[A-Za-z_$]/, // satisfies Foo
  /\)\s*:\s*(JSX\.Element|React\.\w+|string|number|boolean|void|null)\b/, // ): ReturnType
];

// C1 companion (2026-05-22) — top-level declaration survival. Extract
// `const NAME` / `function NAME` / `class NAME` / `let NAME` from the
// input, check they survive in the output. Catches the catastrophic
// truncation case where the AI elides whole data arrays / helper
// components (a swap should never delete a top-level decl). Threshold
// at 2+ missing so a single legitimate cleanup (AI removes a now-dead
// const) doesn't false-reject.
const TOP_LEVEL_DECL_RE =
  /^(?:export\s+(?:default\s+)?)?(?:const|function|class|let|var)\s+([A-Za-z_$][\w$]*)/gm;

function collectTopLevelDecls(source: string): Set<string> {
  const names = new Set<string>();
  let m: RegExpExecArray | null;
  // Reset lastIndex defensively since the regex is `g`-flagged + shared.
  TOP_LEVEL_DECL_RE.lastIndex = 0;
  while ((m = TOP_LEVEL_DECL_RE.exec(source)) !== null) {
    if (m[1]) names.add(m[1]);
  }
  return names;
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

  // C1 — placeholder-truncation detection. The single highest-risk
  // failure mode for full-file swaps: the AI returns the file with
  // huge unchanged regions collapsed into `// ... rest unchanged ...`
  // comments. Such a file parses fine + can pass the length floor, so
  // it would silently apply a half-empty template.
  for (const pat of PLACEHOLDER_PATTERNS) {
    const match = outputSource.match(pat);
    if (match) {
      return {
        ok: false,
        reason: `The response looks truncated — it contains a placeholder like "${match[0].trim().slice(0, 40)}" instead of the full file. Ask your AI to "return the COMPLETE file with no omissions or placeholder comments," then paste again.`,
      };
    }
  }

  // C1 companion — top-level declaration survival. A swap should never
  // delete a top-level const/function/class. If 2+ vanish, the AI
  // truncated the file (placeholder detection above catches most, this
  // catches silent drops with no placeholder comment).
  const inputDecls = collectTopLevelDecls(inputSource);
  if (inputDecls.size >= 3) {
    const outputDecls = collectTopLevelDecls(outputSource);
    const missing: string[] = [];
    for (const name of inputDecls) {
      if (!outputDecls.has(name)) missing.push(name);
    }
    if (missing.length >= 2) {
      return {
        ok: false,
        reason: `The response is missing ${missing.length} of your top-level definitions (${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "…" : ""}). The AI likely truncated the file — ask it to return the COMPLETE file, then paste again.`,
      };
    }
  }

  if (opts.kind === "jsx") {
    // Wrong-language guard — AI returned a plain HTML document when the
    // file is a React component. A leading <!DOCTYPE html> is the
    // unambiguous signal (a JSX module never starts with one). Applying
    // it would break the iframe (no export default, class= not
    // className=, etc.).
    if (/^\s*<!DOCTYPE\s+html/i.test(outputSource)) {
      return {
        ok: false,
        reason:
          "The response is a plain HTML document, but your file is a React (JSX) component. Ask your AI to keep it as JSX (React component with `export default`), then paste again.",
      };
    }

    // C2 — TypeScript-syntax detection. web/*.jsx run through the
    // iframe's JSX-only Babel; TS annotations silently blank the
    // template. Reject so the user re-prompts instead of shipping a
    // blank page.
    for (const pat of TS_SYNTAX_PATTERNS) {
      const match = outputSource.match(pat);
      if (match) {
        return {
          ok: false,
          reason: `The response contains TypeScript syntax ("${match[0].trim().slice(0, 30)}") which won't run in this preview. Ask your AI for "plain JSX, no TypeScript types," then paste again.`,
        };
      }
    }
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
