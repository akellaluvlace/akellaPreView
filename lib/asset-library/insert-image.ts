// Build the insert payload for an Unsplash image.
//
// Unsplash's API guidelines REQUIRE attribution wherever the image is shown.
// We satisfy that by prepending a comment block — comment-style depends on
// mode (HTML uses `<!-- -->`, JSX uses `{/* */}`). The comment links back
// to both the photo's page and the photographer's profile, the two pieces
// Unsplash audits for.
//
// Resolution choices map to Unsplash's URL-arg sizing:
//   small   → ?w=640
//   medium  → ?w=1080  (default)
//   large   → ?w=1600
//   original → no resize (full URL)

import type { Mode, UnsplashPhoto } from "./types";

export type Resolution = "small" | "medium" | "large" | "original";

const RES_TO_URL = (p: UnsplashPhoto, res: Resolution): string => {
  switch (res) {
    case "small": return p.small;
    case "medium": return p.regular; // ~1080w
    case "large": return p.full;     // ~1600w (paid/app dependent)
    case "original": return p.full;
  }
};

function altText(p: UnsplashPhoto): string {
  const desc = (p.description || "").trim();
  if (desc) return desc.replace(/"/g, "'").slice(0, 200);
  return `Photo by ${p.author.name} on Unsplash`;
}

export interface ImageInsertOptions {
  resolution?: Resolution;
}

export function buildImageInsert(
  photo: UnsplashPhoto,
  mode: Mode,
  opts?: ImageInsertOptions
): string {
  const res = opts?.resolution ?? "medium";
  const src = RES_TO_URL(photo, res);
  const alt = altText(photo);

  if (mode === "html") {
    return [
      `<!--`,
      `  Photo by ${photo.author.name} (${photo.author.profileUrl}) on Unsplash`,
      `  ${photo.pageUrl}`,
      `-->`,
      `<img src="${src}" alt="${alt}" width="${photo.width}" height="${photo.height}" loading="lazy" />`,
    ].join("\n");
  }
  // JSX
  return [
    `{/*`,
    `  Photo by ${photo.author.name} (${photo.author.profileUrl}) on Unsplash`,
    `  ${photo.pageUrl}`,
    `*/}`,
    `<img src="${src}" alt="${alt}" width={${photo.width}} height={${photo.height}} loading="lazy" />`,
  ].join("\n");
}
