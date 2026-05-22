// 2026-05-21 — Compose the BYO-AI swap prompt.
//
// 2026-05-22 — ELEMENT-ONLY pivot. Originally sent the full file + asked
// for the full file back. In practice the AI (and the user) naturally
// returns just the restyled element — and that's strictly better:
//   - No truncation risk (the #1 full-file failure mode is moot)
//   - The AI literally cannot touch other parts of the page
//   - Tiny clipboard payload, fast response
//   - We patch it into the source by OID (JSX) / htmlPath (HTML)
//
// So we now send the target element + the reference + a short note about
// the file's styling convention, and ask for JUST the restyled element.
// The apply path patches it in surgically (see handleByoAiApply). A
// full-file paste is still accepted as a fallback (the validator +
// apply path detect which shape was pasted).
//
// Why no editable prompt textarea in the modal: vibecoders don't want to
// think about prompt engineering; the template is good enough for
// frontier models, and power users can edit before pasting in their AI.

export interface ComposeSwapPromptOptions {
  // Full source code of the current template. Kept in the options shape
  // for callers + the prompt-size estimate, but the element-only prompt
  // no longer embeds it (the AI only needs the target + reference).
  fullSource: string;
  // Detected mode — drives the code-fence language hint.
  kind: "html" | "jsx";
  // outerHTML of the element being swapped — this is what the AI
  // restyles + returns.
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

  const jsxGuards =
    opts.kind === "jsx"
      ? [
          "- Write PLAIN JSX, not TypeScript. Use `className` (not " +
            "`class`). No type annotations, `interface`, `as const`, or " +
            "generics.",
          "- If my element has a `data-dropin-id` attribute, keep it " +
            "exactly as-is on the returned element.",
        ]
      : [
          "- Keep it valid HTML (use `class`, not `className`).",
        ];

  // The prompt is plain text — providers' UI textareas preserve it
  // verbatim. Triple-backtick fences are intentional (the model needs
  // the code-fence boundaries to understand the structure).
  return [
    "I want to restyle ONE UI element to match a reference design.",
    "",
    "MY ELEMENT (restyle this one):",
    "```" + fenceLang,
    opts.targetOuterHtml.trim(),
    "```",
    "",
    "THE REFERENCE DESIGN (match this look — it may include a <style> " +
      "block showing how its classes look):",
    "```html",
    referenceClean,
    "```",
    "",
    "INSTRUCTIONS:",
    "- Keep MY element's text content (the visible words inside).",
    "- Keep MY element's meaningful attributes (href, src, alt, type, " +
      "name, and data-* attributes).",
    "- Restyle it to look like the reference — colors, shape, padding, " +
      "shadow, hover effects, etc.",
    "- If the reference uses custom CSS, translate that look into " +
      "Tailwind utility classes (or inline style). Don't paste raw CSS.",
    ...jsxGuards,
    "- Return ONLY the single restyled element in one code block — just " +
      "the one tag, NOT a full file or page. No explanation.",
  ].join("\n");
}
