"use client";

// Media tab. Sub-tabs: Photos (Unsplash + Pexels source toggle), Videos
// (Pexels), Illustrations (unDraw), Mockups (frame templates).

import { useEffect, useState } from "react";
import type { Mode } from "@/lib/asset-library/types";
import UnsplashPanel from "./sub-panels/UnsplashPanel";
import PexelsPhotosPanel from "./sub-panels/PexelsPhotosPanel";
import PexelsVideosPanel from "./sub-panels/PexelsVideosPanel";
import PixabayPanel from "./sub-panels/PixabayPanel";
import UndrawPanel from "./sub-panels/UndrawPanel";
import MockupsPanel from "./sub-panels/MockupsPanel";

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

type SubTab = "photos" | "videos" | "illustrations" | "mockups";
type PhotoSource = "pixabay" | "pexels" | "unsplash";

const SUB_KEY = "dropin:media:subtab";
const PHOTO_SRC_KEY = "dropin:media:photo-source";
const SUBS: Array<{ id: SubTab; label: string }> = [
  { id: "photos",        label: "Photos" },
  { id: "videos",        label: "Videos" },
  { id: "illustrations", label: "Illos" },
  { id: "mockups",       label: "Mockups" },
];

const PHOTO_SOURCES: PhotoSource[] = ["pixabay", "pexels", "unsplash"];

export default function MediaPanel({ mode, onInsert }: Props) {
  const [sub, setSub] = useState<SubTab>(() => {
    if (typeof window === "undefined") return "photos";
    const v = window.localStorage.getItem(SUB_KEY);
    return SUBS.some((s) => s.id === v) ? (v as SubTab) : "photos";
  });
  const [photoSrc, setPhotoSrc] = useState<PhotoSource>(() => {
    // Default to Pixabay — instant API key, generous rate limit, no
    // production-tier gating. Existing users who picked Unsplash or
    // Pexels keep their choice.
    if (typeof window === "undefined") return "pixabay";
    const v = window.localStorage.getItem(PHOTO_SRC_KEY);
    return PHOTO_SOURCES.includes(v as PhotoSource) ? (v as PhotoSource) : "pixabay";
  });

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(SUB_KEY, sub);
  }, [sub]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(PHOTO_SRC_KEY, photoSrc);
  }, [photoSrc]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1 border-b-2 border-ink bg-paper px-2 py-1.5">
        {SUBS.map((s) => {
          const active = s.id === sub;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSub(s.id)}
              className={
                "border-2 border-ink px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
              aria-pressed={active}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {sub === "photos" && (
        <div className="flex shrink-0 items-center gap-1 border-b border-ink/30 bg-paper px-2 py-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Source</span>
          {PHOTO_SOURCES.map((src) => {
            const active = src === photoSrc;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setPhotoSrc(src)}
                className={
                  "border border-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
                  (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
                }
              >
                {src}
              </button>
            );
          })}
        </div>
      )}

      <div className="min-h-0 flex-1">
        {sub === "photos" && photoSrc === "pixabay"  && <PixabayPanel mode={mode} onInsert={onInsert} />}
        {sub === "photos" && photoSrc === "pexels"   && <PexelsPhotosPanel mode={mode} onInsert={onInsert} />}
        {sub === "photos" && photoSrc === "unsplash" && <UnsplashPanel mode={mode} onInsert={onInsert} />}
        {sub === "videos"        && <PexelsVideosPanel mode={mode} onInsert={onInsert} />}
        {sub === "illustrations" && <UndrawPanel mode={mode} onInsert={onInsert} />}
        {sub === "mockups"       && <MockupsPanel mode={mode} onInsert={onInsert} />}
      </div>
    </div>
  );
}
