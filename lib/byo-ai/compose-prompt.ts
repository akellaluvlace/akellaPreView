// 2026-05-21 — Compose the BYO-AI swap prompt.
//
// Strategy: send the FULL source file + the target element's outerHtml
// snippet + the reference HTML + clear instructions. AI returns the
// full updated file in a single code block. Dropin pastes the result
// back via setCode after light validation.
//
// Why full-page instead of a marker-comment approach:
//   - Drops the patch pipeline entirely (no patchHtmlOuter /
//     patchJsxOuterByOid). `setCode(response)` after validation.
//   - Frontier models match the target by pattern (outerHtml snippet
//     in the prompt) more reliably than by tracking a marker.
//   - Cascade case (`.map()` rendering N siblings) is handled in
//     context — the AI sees the source and decides whether to detach.
//
// Why no editable prompt textarea in the modal:
//   - Vibecoders don't want to think about prompt engineering.
//   - The template here is good enough for frontier models. Power
//     users can copy + edit before pasting in their AI.

export interface ComposeSwapPromptOptions {
  // Full source code of the current template (HTML or JSX/TSX).
  fullSource: string;
  // Detected mode — drives the code-fence language hint + the file
  // type description in the prompt.
  kind: "html" | "jsx";
  // outerHTML of the element being swapped (used by AI to identify
  // the target within fullSource).
  targetOuterHtml: string;
  // HTML of the reference design (typically from a library tile).
  referenceHtml: string;
}

// Cap on how much reference HTML we embed. Library tiles can be 3-8KB
// of deeply-nested marketing markup; past ~6KB it just bloats the
// prompt + risks the model over-copying the reference's structure
// instead of treating it as a style template. Truncate at a tag
// boundary near the cap with a clear note.
const REFERENCE_HTML_CAP = 6000;

// Strip HTML comments from the reference before embedding — library
// captures sometimes carry attribution / tooling comments that are
// noise to the model.
function cleanReferenceHtml(raw: string): string {
  let html = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (html.length > REFERENCE_HTML_CAP) {
    // Truncate at the last '>' before the cap so we don't cut mid-tag.
    const slice = html.slice(0, REFERENCE_HTML_CAP);
    const lastTagEnd = slice.lastIndexOf(">");
    html =
      (lastTagEnd > 0 ? slice.slice(0, lastTagEnd + 1) : slice) +
      "\n<!-- reference truncated for length; the style above is enough -->";
  }
  return html;
}

export function composeSwapPrompt(opts: ComposeSwapPromptOptions): string {
  const kindLabel = opts.kind === "html" ? "HTML" : "JSX";
  const fenceLang = opts.kind === "html" ? "html" : "jsx";
  const referenceClean = cleanReferenceHtml(opts.referenceHtml);

  // JSX-specific guardrails. These keep frontier models from doing the
  // two things that silently break web/*.jsx templates:
  //   1. adding TypeScript syntax (iframe Babel is JSX-preset-only)
  //   2. touching the load-bearing <style> / tailwind.config <script> /
  //      font <link>s / top-level const data that drive the theme
  const jsxGuards =
    opts.kind === "jsx"
      ? [
          "- This is PLAIN JSX, not TypeScript. Do NOT add type " +
            "annotations, `interface`, `type`, `as const`, `satisfies`, " +
            "or generics.",
          "- Do NOT modify the <style> blocks, the tailwind config " +
            "<script>, font <link> tags, or any top-level `const` data. " +
            "Only change the one target element.",
        ]
      : [
          "- Do NOT modify the <style> blocks, <script> tags, or " +
            "<link> tags. Only change the one target element.",
        ];

  // The prompt is plain text — providers' UI textareas preserve it
  // verbatim. Triple-backtick fences are intentional (the model needs
  // the code-fence boundaries to understand the structure).
  return [
    `I have a ${kindLabel} file. Please replace ONE element in it.`,
    "",
    "THE ELEMENT TO REPLACE (find it in the file below):",
    "```" + fenceLang,
    opts.targetOuterHtml.trim(),
    "```",
    "",
    "THE REFERENCE DESIGN (use this as your style template — it may " +
      "include a <style> block showing how its classes look):",
    "```html",
    referenceClean,
    "```",
    "",
    "INSTRUCTIONS:",
    "- Keep my element's text content (the visible words inside).",
    "- Keep meaningful attributes (href, src, alt, type, name).",
    "- Otherwise, make the element look like the reference — colors, " +
      "layout, shape, sizing, classes.",
    "- If the reference includes a <style> block, translate that look " +
      "into the styling convention my file already uses (Tailwind " +
      "utility classes, or inline style). Do NOT paste the reference's " +
      "raw CSS rules into my file.",
    "- Leave ALL other elements in the file untouched.",
    ...jsxGuards,
    "- Return the COMPLETE file as a single code block. Include EVERY " +
      "line — do NOT use placeholder comments like `// ... rest " +
      "unchanged ...` or omit any section. No explanation needed.",
    "",
    "THE FULL FILE:",
    "```" + fenceLang,
    opts.fullSource,
    "```",
  ].join("\n");
}
