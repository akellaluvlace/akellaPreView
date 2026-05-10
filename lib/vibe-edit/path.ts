// CSS-selector path round-trip helpers. Two responsibilities:
//   1. getElementPath(el) - produce a stable selector that uniquely
//      identifies `el` within its document.
//   2. findElementByPath(doc, path) - resolve the selector back to
//      the element (or null if structure changed underneath).
//
// We deliberately avoid OIDs here. The use case is the vibe-edit
// flow, which mutates the live iframe DOM rather than the source
// tree. Stable across one edit session is enough; cross-session
// stability is a source-side concern (handled by the OID path).
//
// Mirrors MoodScape's editor-script approach (web/src/lib/editorScript.ts
// on branch step-3b-modes-advanced-ai). We deliberately keep the
// shape identical so future refinements there are easy to port.

export function getElementPath(el: Element | null): string {
  if (!el) return "";
  if (el === el.ownerDocument?.documentElement) return "";
  if (el.tagName === "BODY") return "body";

  const parts: string[] = [];
  let cur: Element | null = el;
  const body = el.ownerDocument?.body ?? null;
  const root = el.ownerDocument?.documentElement ?? null;

  while (cur && cur !== body && cur !== root) {
    let segment = cur.tagName.toLowerCase();
    const id = cur.id;
    if (id) {
      segment += "#" + cssEscape(id);
      parts.unshift(segment);
      return parts.join(" > ");
    }
    const parent: Element | null = cur.parentElement;
    if (parent) {
      // Filter siblings to same tag — nth-of-type counts within tag,
      // not within all children. Matches the CSS spec semantics so
      // querySelector finds the right one on round-trip.
      const sameTag: Element[] = [];
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (child.tagName === cur.tagName) sameTag.push(child);
      }
      if (sameTag.length > 1) {
        const idx = sameTag.indexOf(cur) + 1;
        segment += `:nth-of-type(${idx})`;
      }
    }
    parts.unshift(segment);
    cur = parent;
  }

  return parts.join(" > ");
}

export function findElementByPath(
  doc: Document,
  path: string,
): Element | null {
  if (!path) return null;
  if (path === "body") return doc.body;
  try {
    return doc.querySelector(path);
  } catch {
    return null;
  }
}

// CSS.escape polyfill for environments without it. The browser
// (Chromium 88+, Firefox 63+, Safari 14+) all ship CSS.escape so
// this is a defensive fallback for old jsdom or test contexts.
function cssEscape(s: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(s);
  }
  // Conservative fallback — escape every char the CSS spec marks
  // as needing escape in identifiers. Won't pass every edge case
  // CSS.escape covers but handles the common id chars (`:` `.` `-` etc.)
  return s.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
