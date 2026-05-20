// Strip Dropin-internal markers from a rendered iframe HTML snapshot so
// the resulting document is publishable as-is. Used by the Publish flow
// for JSX-mode templates where the user's source has to be compiled
// (Babel-standalone + React UMD inside the iframe) to produce the
// hostable page — we capture the post-render DOM and clean it.
//
// What gets stripped:
//   1. data-dropin-id        — internal OID tracking primitive
//   2. data-dropin-loc       — JSX source loc tag injected by injectOids
//   3. data-dropin-hover     — selection-overlay hover marker
//   4. data-dropin-selected  — selection-overlay active marker
//   5. data-dropin-editing   — inline-edit marker
//   6. data-dropin-insert-hover — Insert tool hover marker
//   7. data-dropin-group     — group-root marker (template-author attr too,
//                              but it's an editor primitive — drop it from
//                              the published site).
//   8. data-vibe-selected, data-vibe-style — Edit-tool markers.
//   9. data-ai-selected, data-ai-just-applied — AI-tool markers.
//  10. <script> tags that contain the dropin runtime (heuristic: any
//      <script> whose textContent references DROPIN_MODE or DROPIN_RUNTIME
//      or window.__dropin).
//  11. Any <style> inside the iframe with id starting `dropin-` (we use
//      dropin-outline / dropin-live / dropin-debug for editor chrome).
//
// What stays:
//   - All user-authored markup, text, attributes, classes.
//   - All <link rel="stylesheet"> entries (Tailwind CDN, fonts).
//   - All user-authored <style> / <script> from the template source.
//
// Uses the browser's DOMParser. Server-side execution is NOT supported
// (the function lives in the publish flow's client-only path); we never
// import it from a `use client = false` boundary.

const DROPIN_DATA_ATTRS = [
  "data-dropin-id",
  "data-dropin-loc",
  "data-dropin-hover",
  "data-dropin-selected",
  "data-dropin-editing",
  "data-dropin-insert-hover",
  "data-dropin-group",
  "data-vibe-selected",
  "data-vibe-style",
  "data-ai-selected",
  "data-ai-just-applied",
] as const;

// Heuristic markers that identify the in-iframe runtime <script>. The
// runtime declares these globals at the top; any user-authored script
// that happens to mention DROPIN_MODE would be a deliberate collision
// (vanishingly unlikely — `DROPIN_` is a Dropin-internal namespace).
const DROPIN_RUNTIME_NEEDLES = [
  "DROPIN_MODE",
  "DROPIN_RESTORE_SCROLL",
  "var DROPIN_VOID_TAGS",
  "DROPIN_TOOL",
];

export interface SanitizeResult {
  html: string;
  strippedAttrs: number;
  strippedScripts: number;
  strippedStyles: number;
}

export function sanitizeIframeHtml(iframeHtml: string): SanitizeResult {
  if (typeof DOMParser === "undefined") {
    // SSR / Node guard. Caller should only invoke from the browser.
    return { html: iframeHtml, strippedAttrs: 0, strippedScripts: 0, strippedStyles: 0 };
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(iframeHtml, "text/html");
  if (!doc || !doc.documentElement) {
    return { html: iframeHtml, strippedAttrs: 0, strippedScripts: 0, strippedStyles: 0 };
  }

  let strippedAttrs = 0;
  let strippedScripts = 0;
  let strippedStyles = 0;

  // 1-9 — walk every element, drop each tracked data-attr if present.
  const all = doc.querySelectorAll("*");
  for (const el of Array.from(all)) {
    for (const attr of DROPIN_DATA_ATTRS) {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
        strippedAttrs++;
      }
    }
  }

  // 10 — runtime <script> tags. Inline scripts only (those with src
  // pointing at unpkg / esm.sh for React + Babel are user-visible deps
  // and must stay).
  const scripts = doc.querySelectorAll("script:not([src])");
  for (const script of Array.from(scripts)) {
    const text = script.textContent ?? "";
    const isDropinRuntime = DROPIN_RUNTIME_NEEDLES.some((needle) => text.includes(needle));
    if (isDropinRuntime) {
      script.parentNode?.removeChild(script);
      strippedScripts++;
    }
  }

  // 11 — <style id="dropin-*"> chrome stylesheets.
  const dropinStyles = doc.querySelectorAll('style[id^="dropin-"]');
  for (const style of Array.from(dropinStyles)) {
    style.parentNode?.removeChild(style);
    strippedStyles++;
  }

  // Serialize. Preserve doctype manually since outerHTML on documentElement
  // drops it. (DOMParser preserves it on doc.doctype if it was present in
  // the input; we re-emit the canonical HTML5 form.)
  const doctype = doc.doctype
    ? `<!DOCTYPE ${doc.doctype.name}>\n`
    : "<!DOCTYPE html>\n";
  const html = doctype + doc.documentElement.outerHTML;

  return { html, strippedAttrs, strippedScripts, strippedStyles };
}
