"use client";

// Vibe-edit image controls: src + alt only. The vibecoder either
// pastes a URL (Unsplash, their own host, a CDN) or types alt text.
// No size, position, layout — those belong to the surrounding
// container's spacing controls in the power editor.

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface ImageControlsProps {
  info: VibeElementInfo;
  onImageChange: (next: { src?: string; alt?: string }) => void;
}

export default function ImageControls({
  info,
  onImageChange,
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
    </div>
  );
}
