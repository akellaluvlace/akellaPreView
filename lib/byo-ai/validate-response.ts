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

import { isParseable } from "../ast/oids";

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
  // 2026-05-22 — which shape the response is. The apply path uses this:
  //   "element"   → patch into source via OID (JSX) / htmlPath (HTML)
  //   "full-file" → setCode the whole thing
  // null when validation failed before the shape mattered.
  mode: "element" | "full-file" | null;
  // 2026-05-24 — the cleaned code to actually apply. For element mode
  // this is the markup sliced from the first `<` to the last `>` (so
  // leading prose like "Here's your element:" or a trailing "Let me
  // know!" is stripped). For full-file it's the trimmed source. The
  // modal applies THIS, not the raw paste.
  appliedCode?: string;
}

// 2026-05-22 — detect whether a pasted response is a single element or
// a full file. 2026-05-24 — now SIZE-AWARE: a response dramatically
// smaller than the source is an element/fragment, never a full rewrite,
// even if it leads with prose or an extracted `const` (which is why a
// 787-char reply was wrongly classified full-file + rejected as a
// "truncated 83879-char file").
//
//   - HTML document (<!DOCTYPE / <html) → full-file (it's a document)
//   - response << source size → element (a rewrite is ~source-sized)
//   - starts with a tag `<` → element
//   - else (import/export/const/comment) → full-file
export function detectResponseShape(
  source: string,
  sourceLength?: number,
): "element" | "full-file" {
  const trimmed = source.trim();
  if (/^<!DOCTYPE/i.test(trimmed) || /^<html[\s>]/i.test(trimmed)) {
    return "full-file";
  }
  // Size signal — dominant when we know the source size. A full-file
  // rewrite comes back roughly source-sized; anything under 40% of a
  // non-trivial source is an element/fragment. Requires a `<` somewhere
  // so we don't misroute a genuinely-truncated full file that lost its
  // tags (that should still fail the full-file length check).
  if (
    typeof sourceLength === "number" &&
    sourceLength > 2000 &&
    trimmed.length < sourceLength * 0.4 &&
    trimmed.includes("<")
  ) {
    return "element";
  }
  if (trimmed.startsWith("<")) return "element";
  return "full-file";
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

const normalize = (s: string) =>
  s.replace(/\sdata-dropin-id="[^"]*"/g, "").replace(/\s+/g, " ").trim();

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

// 2026-05-24 — for element mode, produce clean element markup from the
// AI reply. Handles two real-world mangle modes:
//
//   1. Prose wrapper (no code fence): "Here's your element:\n<a…>Go</a>
//      \nLet me know!" → slice first `<` to last `>` → "<a…>Go</a>".
//
//   2. HEADLESS element — the opening `<tag` was dropped (a frequent
//      copy-paste artifact: a multi-line element's first line `<a` gets
//      lost, or a chat renderer eats it). The reply then looks like
//      `data-dropin-id="…" href="#" …>Get App</a>` — starts with
//      attributes, the first `<` is the CLOSING tag. We reconstruct the
//      opening tag from the closing tag's name + prepend it.
//
// `fallbackTag` (the target element's tag) is used when there's no
// closing tag to read the name from.
function sliceElementMarkup(text: string, fallbackTag?: string): string {
  let t = text.trim();

  // Headless repair — doesn't start with a tag, but ends with a
  // closing tag and the head before the first `>` is attribute-like
  // (no `<`, so it's not prose-wrapping an intact element).
  if (!t.startsWith("<")) {
    const close = t.match(/<\/([a-zA-Z][\w-]*)\s*>\s*$/);
    const firstGt = t.indexOf(">");
    const head = firstGt === -1 ? "" : t.slice(0, firstGt);
    if (firstGt !== -1 && !head.includes("<")) {
      const tag = close?.[1] ?? fallbackTag;
      if (tag) t = `<${tag} ${t}`;
    }
  }

  const first = t.indexOf("<");
  const last = t.lastIndexOf(">");
  if (first === -1 || last === -1 || last <= first) return t.trim();
  return t.slice(first, last + 1).trim();
}

// Security checks shared by both shapes. Returns a reason string on
// failure, null when clean. `scriptBaseline` is the count of dangerous
// tags allowed (the input's count for full-file; 0 for element).
function runSecurityChecks(
  outputSource: string,
  scriptBaselines: Record<string, number>,
): string | null {
  if (EVENT_HANDLER_RE.test(outputSource)) {
    const sample = outputSource.match(EVENT_HANDLER_RE)?.[0] ?? 'on*="..."';
    return `Response contains a string event-handler attribute (${sample.trim()}) — refusing for security. Edit it out before applying.`;
  }
  if (JAVASCRIPT_URI_RE.test(outputSource)) {
    return "Response contains a `javascript:` URI — refusing for security. Edit it out before applying.";
  }
  const countTag = (src: string, tag: string): number =>
    (src.match(new RegExp(`<${tag}\\b`, "gi")) ?? []).length;
  for (const tag of ["script", "iframe", "object", "embed"]) {
    const baseline = scriptBaselines[tag] ?? 0;
    if (countTag(outputSource, tag) > baseline) {
      return `Response adds a new <${tag}> tag that wasn't in your element — refusing for security. Edit it out, or re-prompt your AI.`;
    }
  }
  return null;
}

// JSX-only syntax guards (TS detection). Returns a reason on failure.
function runJsxSyntaxChecks(outputSource: string): string | null {
  for (const pat of TS_SYNTAX_PATTERNS) {
    const match = outputSource.match(pat);
    if (match) {
      return `Response contains TypeScript syntax ("${match[0].trim().slice(0, 30)}") which won't run in this preview. Ask your AI for "plain JSX, no TypeScript types," then paste again.`;
    }
  }
  return null;
}

export function validateResponse(
  opts: ValidateResponseOptions,
): ValidateResponseResult {
  const { inputSource, outputSource, targetOuterHtml } = opts;
  const trimmed = (outputSource ?? "").trim();

  if (!trimmed || trimmed.length < 8) {
    return {
      ok: false,
      mode: null,
      reason: "Response is empty. Paste the AI's reply first.",
    };
  }

  // Placeholder-truncation is invalid in ANY shape (a clean element
  // never contains `// ... rest unchanged ...`; a full file with it is
  // truncated). Check globally BEFORE shape routing so the size rule
  // can't reroute a placeholder-bearing stub into element mode +
  // silently apply half a page. (2026-05-24 — moved up from full-file.)
  for (const pat of PLACEHOLDER_PATTERNS) {
    const match = trimmed.match(pat);
    if (match) {
      return {
        ok: false,
        mode: null,
        reason: `The response looks truncated — it contains a placeholder like "${match[0].trim().slice(0, 40)}" instead of the full content. Ask your AI to return the COMPLETE element/file with no omissions, then paste again.`,
      };
    }
  }

  // Size-aware shape detection — pass the source length so a tiny
  // response can't be mistaken for a truncated full file.
  const shape = detectResponseShape(trimmed, inputSource.length);

  // ── ELEMENT MODE ─────────────────────────────────────────────────
  // The AI returned just the restyled element (possibly wrapped in
  // prose). Slice out the markup, then validate: not a no-op vs the
  // target, no injected scripts/handlers, JSX syntax sane. No full-file
  // checks (length-vs-source / placeholder / decl-survival don't apply).
  if (shape === "element") {
    // Derive the target's tag (e.g. "a", "button") as a fallback for
    // headless-element repair.
    const targetTag = targetOuterHtml.match(/^\s*<([a-zA-Z][\w-]*)/)?.[1];
    const element = sliceElementMarkup(trimmed, targetTag);
    if (!element.startsWith("<") || element.length < 4) {
      return {
        ok: false,
        mode: "element",
        reason:
          "Couldn't find an element in the reply. Paste just the one restyled element (e.g. the <button>…</button>), or paste the full file.",
      };
    }
    // No-op: is the element byte-identical to the target after
    // normalizing OIDs + whitespace? Then nothing changed.
    if (normalize(element) === normalize(targetOuterHtml)) {
      return {
        ok: false,
        mode: "element",
        reason:
          "The pasted element is identical to your original — the AI didn't change anything. Try a different reference or re-prompt.",
      };
    }
    // The element shouldn't carry ANY script/iframe/etc. (baseline 0).
    const sec = runSecurityChecks(element, {});
    if (sec) return { ok: false, mode: "element", reason: sec };
    if (opts.kind === "jsx") {
      const ts = runJsxSyntaxChecks(element);
      if (ts) return { ok: false, mode: "element", reason: ts };
      // Well-formedness — the sliced element must parse as valid JSX.
      // Catches the AI returning an unbalanced/duplicate tag (e.g.
      // `<a>Log In</a></a>`), which would otherwise blank the preview
      // once patched in. 2026-05-24 field bug.
      if (!isParseable(element)) {
        return {
          ok: false,
          mode: "element",
          reason:
            "The pasted element isn't valid JSX — usually an unbalanced or duplicate tag (like an extra </a>). Re-prompt your AI for ONE clean element, or fix the reply.",
        };
      }
    }
    // Sanity: a single restyled element shouldn't be enormous. Cap at
    // 24KB — comfortably above an SVG-heavy card, well below a file.
    if (element.length > 24576) {
      return {
        ok: false,
        mode: "element",
        reason:
          "That looks too large to be a single element. If your AI returned the whole file, paste all of it — otherwise paste just the one restyled element.",
      };
    }
    return { ok: true, mode: "element", reason: null, appliedCode: element };
  }

  // ── FULL-FILE MODE ───────────────────────────────────────────────
  // The AI rewrote the whole file (e.g. Claude). setCode the result
  // (caller). Validation guards the full-file failure modes.

  // Wrong-language guard — a JSX file should never come back as a plain
  // HTML document (no export default, class= not className=, etc.).
  if (opts.kind === "jsx" && /^\s*<!DOCTYPE\s+html/i.test(trimmed)) {
    return {
      ok: false,
      mode: "full-file",
      reason:
        "The response is a plain HTML document, but your file is a React (JSX) component. Ask your AI to keep it as JSX (a React component), then paste again.",
    };
  }

  if (outputSource.length < 50) {
    return {
      ok: false,
      mode: "full-file",
      reason:
        "Response looks too short to be your full file. Paste the complete reply.",
    };
  }

  // Use RAW lengths for the ratio (not the trimmed body) so the
  // comparison is like-for-like with the un-trimmed inputSource.
  const inLen = inputSource.length;
  const outLen = outputSource.length;
  const ratio = outLen / Math.max(inLen, 1);
  if (ratio < 0.5) {
    return {
      ok: false,
      mode: "full-file",
      reason: `Response is suspiciously short (${outLen} chars vs ${inLen} in your source). The AI may have truncated the file — ask it to return the COMPLETE file.`,
    };
  }
  const upperCap = Math.max(inLen * 1.5, inLen + 2000);
  if (outLen > upperCap) {
    return {
      ok: false,
      mode: "full-file",
      reason: `Response is suspiciously long (${outLen} chars vs ${inLen}). The AI may have added extra content beyond the swap.`,
    };
  }

  // (Placeholder-truncation is now checked globally above, before shape
  // routing — see the top of validateResponse.)

  // Top-level declaration survival.
  const inputDecls = collectTopLevelDecls(inputSource);
  if (inputDecls.size >= 3) {
    const outputDecls = collectTopLevelDecls(trimmed);
    const missing: string[] = [];
    for (const name of inputDecls) {
      if (!outputDecls.has(name)) missing.push(name);
    }
    if (missing.length >= 2) {
      return {
        ok: false,
        mode: "full-file",
        reason: `The response is missing ${missing.length} of your top-level definitions (${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "…" : ""}). The AI likely truncated the file — ask it to return the COMPLETE file.`,
      };
    }
  }

  if (opts.kind === "jsx") {
    const ts = runJsxSyntaxChecks(trimmed);
    if (ts) return { ok: false, mode: "full-file", reason: ts };
  }

  // No-op detection (count-based — survives cascade swaps).
  const targetNorm = normalize(targetOuterHtml);
  if (targetNorm.length > 20) {
    const inputCount = countOccurrences(normalize(inputSource), targetNorm);
    const outputCount = countOccurrences(normalize(trimmed), targetNorm);
    if (inputCount > 0 && outputCount >= inputCount) {
      return {
        ok: false,
        mode: "full-file",
        reason:
          "The element you wanted to swap is still in the response unchanged. The AI may have ignored the swap — try a different reference or rephrase.",
      };
    }
  }

  // Security: count NEW dangerous tags relative to the input.
  const countTag = (src: string, tag: string): number =>
    (src.match(new RegExp(`<${tag}\\b`, "gi")) ?? []).length;
  const baselines: Record<string, number> = {};
  for (const tag of ["script", "iframe", "object", "embed"]) {
    baselines[tag] = countTag(inputSource, tag);
  }
  const sec = runSecurityChecks(trimmed, baselines);
  if (sec) return { ok: false, mode: "full-file", reason: sec };

  for (const tag of FORBIDDEN_TAGS) {
    if (trimmed.toLowerCase().includes(`<${tag}`)) {
      return {
        ok: false,
        mode: "full-file",
        reason: `Response contains a forbidden <${tag}> tag.`,
      };
    }
  }

  return { ok: true, mode: "full-file", reason: null, appliedCode: trimmed };
}
