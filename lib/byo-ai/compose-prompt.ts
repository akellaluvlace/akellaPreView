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

import { extractDesignContext } from "./design-context";

export interface ComposeSwapPromptOptions {
  // Full source code of the current template. Kept in the options shape
  // for callers + the prompt-size estimate + design-context extraction,
  // but the element-only prompt doesn't embed it.
  fullSource: string;
  // Detected mode — drives the code-fence language hint.
  kind: "html" | "jsx";
  // outerHTML of the element being swapped — this is what the AI
  // restyles + returns.
  targetOuterHtml: string;
  // HTML of the reference design (typically from a library tile).
  // Optional — omitted when the user is describing a change in words
  // (free-form mode) instead of picking a reference.
  referenceHtml?: string;
  // 2026-05-23 — free-form change description (e.g. "make it bigger
  // with a blue gradient"). Optional — omitted when the user picks a
  // reference. At least one of referenceHtml / userPrompt should be
  // present; both can be combined ("match this reference, but bigger").
  userPrompt?: string;
  // 2026-05-25 — "convert all N cards" mode. When true, `targetOuterHtml`
  // is actually the JSX SOURCE of a `.map()` callback element (it contains
  // `{expr}` bindings like `{p.title}`), NOT rendered HTML. The element is
  // a TEMPLATE rendered once per list item, so the AI must restyle it while
  // keeping every `{…}` expression verbatim — otherwise all N cards would
  // show the same baked-in literal text. Only set in JSX mode.
  isGroupTemplate?: boolean;
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
  const fenceLang = opts.kind === "html" ? "html" : "jsx";
  const hasReference = !!opts.referenceHtml && opts.referenceHtml.trim().length > 0;
  const hasUserPrompt = !!opts.userPrompt && opts.userPrompt.trim().length > 0;
  // Group-template mode is JSX-only (cascades come from `.map()`).
  const groupMode = !!opts.isGroupTemplate && opts.kind === "jsx";

  // 2026-05-23 — design-system context. A compact summary of the page's
  // color tokens/families + fonts so the AI's restyled element matches
  // the rest of the site. Omitted when nothing useful is extractable.
  const designContext = extractDesignContext(opts.fullSource);
  const designSection = designContext
    ? [
        "",
        "YOUR SITE'S DESIGN SYSTEM (use these so the element fits in" +
          (hasReference
            ? " — prefer the reference's SHAPE/layout but the site's " +
              "COLORS/fonts where they conflict"
            : "") +
          "):",
        designContext,
      ]
    : [];

  // The "what to do" block adapts to the inputs:
  //   reference only → match this design
  //   description only → apply this change
  //   both → match this design + also apply this change
  const referenceSection = hasReference
    ? [
        "",
        "THE REFERENCE DESIGN (match this look — it may include a " +
          "<style> block showing how its classes look):",
        "```html",
        cleanReferenceHtml(opts.referenceHtml!),
        "```",
      ]
    : [];
  const changeSection = hasUserPrompt
    ? [
        "",
        "THE CHANGE I WANT:",
        opts.userPrompt!.trim(),
      ]
    : [];

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

  // Intro + the style-instruction line adapt to which inputs exist.
  const intro = groupMode
    ? hasReference
      ? "I want to restyle a repeated UI element — a JSX template that renders " +
        "several cards from a list — to match a reference design."
      : "I want to restyle a repeated UI element — a JSX template that renders " +
        "several cards from a list."
    : hasReference
      ? "I want to restyle ONE UI element to match a reference design."
      : "I want to restyle ONE UI element.";
  const styleInstruction = hasReference
    ? "- Restyle it to look like the reference — colors, shape, " +
      "padding, shadow, hover effects, etc." +
      (hasUserPrompt ? " Then apply the change described above." : "")
    : "- Apply the change described above. Keep everything else about " +
      "the element the same.";

  // The prompt is plain text — providers' UI textareas preserve it
  // verbatim. Triple-backtick fences are intentional (the model needs
  // the code-fence boundaries to understand the structure).
  return [
    intro,
    "",
    groupMode
      ? "MY ELEMENT — a JSX template rendered once per card (the `{...}` " +
        "parts get filled in with each card's own content):"
      : "MY ELEMENT (restyle this one):",
    "```" + fenceLang,
    opts.targetOuterHtml.trim(),
    "```",
    ...referenceSection,
    ...changeSection,
    ...designSection,
    "",
    "INSTRUCTIONS:",
    groupMode
      ? "- KEEP every `{...}` expression EXACTLY as written (e.g. `{p.title}`, " +
        "`{item.body}`, `{f.icon}`). They fill in each card's own content — " +
        "NEVER replace a `{...}` with literal text, or every card becomes " +
        "identical. Restyle ONLY the wrapper/markup around them."
      : "- Keep MY element's text content (the visible words inside).",
    "- Keep MY element's meaningful attributes (href, src, alt, type, " +
      "name, and data-* attributes).",
    styleInstruction,
    ...(hasReference
      ? [
          "- If the reference uses custom CSS, translate that look into " +
            "Tailwind utility classes (or inline style). Don't paste raw CSS.",
        ]
      : []),
    ...jsxGuards,
    // Anti-nesting guard (2026-05-24). Frontier models sometimes KEEP the
    // original element and place the new design INSIDE it (so the page
    // renders the old card with a new card nested in it). Be explicit: the
    // returned element REPLACES mine; the new design IS the element.
    "- Your returned element REPLACES mine completely. Do NOT keep my " +
      "element's old wrapper/structure and nest the new design inside it. " +
      "Output the new design as the element itself, with my text/content " +
      "placed directly in it.",
    "- Return EXACTLY ONE top-level element in one code block — just that " +
      "one tag (with its children), NOT a full file or page, and NOT my " +
      "old element wrapping a new one. No explanation.",
  ].join("\n");
}
