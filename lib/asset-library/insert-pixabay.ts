// Build the insert payload for a Pixabay image. Mirrors
// `insert-image.ts` (Unsplash) — attribution comment + <img> with
// width/height. Pixabay's license is CC0-equivalent (attribution
// preferred, not required) so we keep the comment as courtesy.
//
// Resolution choices (the PixabayPhoto type uses short names — see
// asset-library/types.ts — Pixabay's raw API field names in parens):
//   small    → preview (Pixabay previewURL, ≤150w). Falls back to
//              webformat when preview is empty (Pixabay returns "" for
//              very small uploads). Pre-audit this case routed to
//              webformat directly, so "small" was indistinguishable
//              from "medium" — fixed post-2026-05-11 audit (PX3).
//   medium   → webformat (Pixabay webformatURL, ≤640w, default)
//   large    → large (Pixabay largeImageURL, ≤1280w)
//   original → large (Pixabay's full `imageURL` is premium-only, so
//              this falls back to the largest publicly-available URL)
//
// Untrusted-input handling: photo.author.name / .profileUrl / .pageUrl
// come from Pixabay user accounts. We sanitize them at the join sites
// so a malicious display name can't break out of the HTML comment
// (`-->`), the JSX comment (`*/`), or the alt attribute (`"`). Without
// this, a username like `evil --><script>alert(1)</script><!--` would
// inject live HTML into the user's source.

import type { Mode, PixabayPhoto } from "./types";
import type { Resolution } from "./insert-image";

const RES_TO_URL = (p: PixabayPhoto, res: Resolution): string => {
  switch (res) {
    case "small": return p.preview || p.webformat;
    case "medium": return p.webformat;
    case "large": return p.large;
    case "original": return p.large;
  }
};

// Strip comment-terminators + angle brackets + ampersands so a Pixabay
// display name can't escape an HTML or JSX comment context.
function sanitizeForComment(s: string): string {
  if (!s) return "";
  return s
    .replace(/-->/g, "")
    .replace(/<!--/g, "")
    .replace(/\*\//g, "")
    .replace(/\/\*/g, "")
    .replace(/--/g, "-") // collapse stray `--` runs (HTML5 quirk)
    .replace(/[<>]/g, "")
    .slice(0, 200); // bound length so a 10MB display name can't bloat source
}

// Strip the attribute-breaking double-quote + HTML-active chars so a
// fallback alt text built from a display name can't break out of
// alt="...".
function sanitizeForAttr(s: string): string {
  if (!s) return "";
  return s
    .replace(/"/g, "'")
    .replace(/[<>]/g, "")
    .slice(0, 200);
}

function altText(p: PixabayPhoto): string {
  const tags = (p.tags || "").trim();
  if (tags) {
    // Pixabay returns "blossom, bloom, flower" — first comma segment
    // is usually the canonical noun. Truncate to 200 chars to match
    // the Unsplash builder's cap.
    return sanitizeForAttr(tags);
  }
  const name = sanitizeForAttr(p.author.name || "");
  return name ? `Photo by ${name} on Pixabay` : "Photo on Pixabay";
}

export interface PixabayInsertOptions {
  resolution?: Resolution;
}

export function buildPixabayInsert(
  photo: PixabayPhoto,
  mode: Mode,
  opts?: PixabayInsertOptions,
): string {
  const res = opts?.resolution ?? "medium";
  const src = RES_TO_URL(photo, res);
  const alt = altText(photo);
  const safeName = sanitizeForComment(photo.author.name || "");
  const safeProfile = sanitizeForComment(photo.author.profileUrl || "");
  const safePage = sanitizeForComment(photo.pageUrl || "");

  if (mode === "html") {
    return [
      `<!--`,
      `  Photo by ${safeName} (${safeProfile}) on Pixabay`,
      `  ${safePage}`,
      `-->`,
      `<img src="${src}" alt="${alt}" width="${photo.width}" height="${photo.height}" loading="lazy" />`,
    ].join("\n");
  }
  // JSX
  return [
    `{/*`,
    `  Photo by ${safeName} (${safeProfile}) on Pixabay`,
    `  ${safePage}`,
    `*/}`,
    `<img src="${src}" alt="${alt}" width={${photo.width}} height={${photo.height}} loading="lazy" />`,
  ].join("\n");
}
