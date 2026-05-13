// Pexels video insertion. Hero video backgrounds are the killer use case:
// `autoplay loop muted playsinline` is the standard combo for autoplay
// without user-gesture blocks; `poster` paints fast on first load.
//
// Pexels videos come with multiple file qualities. We default to "hd"
// (1080p) — small uploads fast, large uploads on slow networks; users can
// override via the resolution dropdown.

import type { Mode } from "./types";

export interface PexelsVideoFile {
  id: number;
  quality: "hd" | "sd" | "uhd" | string;
  file_type: string;     // "video/mp4"
  width: number | null;
  height: number | null;
  link: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  user: { name: string; url: string };
  image: string;         // poster image
  duration: number;
  video_files: PexelsVideoFile[];
}

export type PexelsVideoResolution = "sd" | "hd" | "uhd";

function pickFile(video: PexelsVideo, res: PexelsVideoResolution): PexelsVideoFile | null {
  const candidates = video.video_files.filter((f) => f.file_type === "video/mp4");
  // Try exact match first.
  let match = candidates.find((f) => f.quality === res);
  if (match) return match;
  // Fall back to nearest height target.
  const targets: Record<PexelsVideoResolution, number> = { sd: 540, hd: 1080, uhd: 2160 };
  const want = targets[res];
  candidates.sort((a, b) => Math.abs((a.height || 0) - want) - Math.abs((b.height || 0) - want));
  return candidates[0] || video.video_files[0] || null;
}

export function buildPexelsVideoInsert(
  video: PexelsVideo,
  mode: Mode,
  opts?: { resolution?: PexelsVideoResolution }
): string {
  const file = pickFile(video, opts?.resolution ?? "hd");
  const src = file?.link ?? video.url;
  const poster = video.image;
  const author = video.user.name;
  const authorUrl = video.user.url;

  if (mode === "html") {
    return [
      `<!--`,
      `  Video by ${author} (${authorUrl}) on Pexels`,
      `  ${video.url}`,
      `-->`,
      `<video autoplay loop muted playsinline poster="${poster}" class="w-full h-full object-cover">`,
      `  <source src="${src}" type="video/mp4" />`,
      `</video>`,
    ].join("\n");
  }
  return [
    `{/*`,
    `  Video by ${author} (${authorUrl}) on Pexels`,
    `  ${video.url}`,
    `*/}`,
    `<video autoPlay loop muted playsInline poster="${poster}" className="w-full h-full object-cover">`,
    `  <source src="${src}" type="video/mp4" />`,
    `</video>`,
  ].join("\n");
}
