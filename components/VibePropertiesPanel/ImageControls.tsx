"use client";

// Vibe-edit image controls: src + alt direct edit, plus a Browse
// button that opens the host-owned LibraryModal in media mode. The
// library's Unsplash / Pexels panels emit a full <img> string; the
// host pick-handler swaps the element's outerHTML wholesale (same
// patcher path as the icon swap — patchJsxOuterByOid for JSX,
// patchHtmlOuter for HTML).

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface ImageControlsProps {
  info: VibeElementInfo;
  onImageChange: (next: { src?: string; alt?: string }) => void;
  // Open the media-library modal. Host owns the modal mount + the
  // pick → postMessage routing; this control just signals intent.
  onSwapClick?: () => void;
}

export default function ImageControls({
  info,
  onImageChange,
  onSwapClick,
}: ImageControlsProps) {
  const [src, setSrc] = useState(info.src ?? "");
  const [alt, setAlt] = useState(info.alt ?? "");

  useEffect(() => {
    setSrc(info.src ?? "");
    setAlt(info.alt ?? "");
  }, [info.path, info.src, info.alt]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Image URL
        </span>
        <input
          type="text"
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
            onImageChange({ src: e.target.value });
          }}
          placeholder="https://..."
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
        <p className="mt-1 font-mono text-[10px] text-muted">
          Tip: free photos at unsplash.com, paste any URL.
        </p>
      </label>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Alt text
        </span>
        <input
          type="text"
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value);
            onImageChange({ alt: e.target.value });
          }}
          placeholder="Describe the image"
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>

      <div className="border-t-2 border-ink/15 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Browse free photos
        </p>
        <button
          type="button"
          onClick={onSwapClick}
          disabled={!onSwapClick}
          className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Open media library
        </button>
        <p className="mt-1 font-mono text-[10px] text-muted">
          Unsplash + Pexels — click any photo to swap.
        </p>
      </div>
    </div>
  );
}
