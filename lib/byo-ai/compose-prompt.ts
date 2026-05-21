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

export function composeSwapPrompt(opts: ComposeSwapPromptOptions): string {
  const kindLabel = opts.kind === "html" ? "HTML" : "JSX";
  const fenceLang = opts.kind === "html" ? "html" : "jsx";

  // The prompt is plain text — providers' UI textareas will preserve
  // it verbatim when pasted. Triple-backtick fences inside the prompt
  // are part of the spec (we want the AI to see code-fence boundaries
  // so it understands the structure).
  return [
    `I have a ${kindLabel} file. Please replace ONE element in it.`,
    "",
    "THE ELEMENT TO REPLACE (find it in the file below):",
    "```" + fenceLang,
    opts.targetOuterHtml.trim(),
    "```",
    "",
    "THE REFERENCE DESIGN (use this as your style template):",
    "```html",
    opts.referenceHtml.trim(),
    "```",
    "",
    "INSTRUCTIONS:",
    "- Keep my element's text content (the visible words inside).",
    "- Keep meaningful attributes (href, src, alt, type, name).",
    "- Otherwise, make the element look like the reference — colors, " +
      "layout, shape, sizing, classes.",
    "- Leave ALL other elements in the file untouched.",
    "- Return the FULL UPDATED FILE as a single code block. No " +
      "explanation needed.",
    "",
    "THE FULL FILE:",
    "```" + fenceLang,
    opts.fullSource,
    "```",
  ].join("\n");
}
