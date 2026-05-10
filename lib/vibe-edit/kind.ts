// Classify a DOM element into one of six edit-flow kinds. The
// VibePropertiesPanel uses the kind to pick which control set to
// render. Containers are LAST resort — vibecoders rarely want to
// edit "the wrapping div" directly. Mirrors MoodScape's tag set.
//
// Precedence (top → bottom):
//   1. role="button" on any element  → button
//   2. <h1>..<h6>                    → heading
//   3. text-bearing tags             → text
//   4. <img>                         → image
//   5. <a>                           → link
//   6. <button>                      → button
//   7. anything else                 → container

export type VibeKind =
  | "heading"
  | "text"
  | "image"
  | "link"
  | "button"
  | "icon"
  | "container";

const HEADING_TAGS: ReadonlySet<string> = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

const TEXT_TAGS: ReadonlySet<string> = new Set([
  "p",
  "span",
  "li",
  "blockquote",
  "small",
  "figcaption",
  "td",
  "th",
  "label",
  "strong",
  "em",
  "code",
  "pre",
]);

export function inferKind(tag: string, role?: string | null): VibeKind {
  const t = (tag || "").toLowerCase();
  const r = (role || "").toLowerCase();
  // role="button" wins — common pattern for div-as-button.
  if (r === "button") return "button";
  if (HEADING_TAGS.has(t)) return "heading";
  if (TEXT_TAGS.has(t)) return "text";
  if (t === "img") return "image";
  if (t === "svg") return "icon";
  if (t === "a") return "link";
  if (t === "button") return "button";
  return "container";
}
