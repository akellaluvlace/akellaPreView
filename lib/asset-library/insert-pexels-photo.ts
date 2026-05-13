// Pexels photo insertion. Pexels appreciates attribution but doesn't strictly
// require it; we still emit a comment block to keep the registry honest and
// to give users a quick path to credit the photographer. Same shape as
// `insert-image.ts` (Unsplash) so the panel UI is uniform.

import type { Mode } from "./types";

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;          // page URL on Pexels.com
  photographer: string;
  photographerUrl: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export type PexelsResolution = "small" | "medium" | "large" | "original";

const RES_TO_URL = (p: PexelsPhoto, res: PexelsResolution): string => {
  switch (res) {
    case "small":    return p.src.small;
    case "medium":   return p.src.medium;
    case "large":    return p.src.large;
    case "original": return p.src.original;
  }
};

function altText(p: PexelsPhoto): string {
  return (p.alt || `Photo by ${p.photographer} on Pexels`).replace(/"/g, "'").slice(0, 200);
}

export function buildPexelsPhotoInsert(
  photo: PexelsPhoto,
  mode: Mode,
  opts?: { resolution?: PexelsResolution }
): string {
  const res = opts?.resolution ?? "medium";
  const src = RES_TO_URL(photo, res);
  const alt = altText(photo);

  if (mode === "html") {
    return [
      `<!--`,
      `  Photo by ${photo.photographer} (${photo.photographerUrl}) on Pexels`,
      `  ${photo.url}`,
      `-->`,
      `<img src="${src}" alt="${alt}" width="${photo.width}" height="${photo.height}" loading="lazy" />`,
    ].join("\n");
  }
  return [
    `{/*`,
    `  Photo by ${photo.photographer} (${photo.photographerUrl}) on Pexels`,
    `  ${photo.url}`,
    `*/}`,
    `<img src="${src}" alt="${alt}" width={${photo.width}} height={${photo.height}} loading="lazy" />`,
  ].join("\n");
}
