"use client";

// Vibe-edit icon controls. v1: color only — the runtime applies
// `color` to el.style.color which SVGs inherit via `currentColor` on
// most icon-library outputs (Lucide, Heroicons, Phosphor, Tabler,
// Simple Icons all use currentColor).
//
// v2 adds Swap: clicking Swap asks the host to open a LibraryModal in
// icon-only mode. When the user picks a new icon, the host posts
// vibe:update-outer (iframe DOM mutation) AND reconciles source through
// buildVibeCommit's new outer-replacement path. No iframe rebuild.

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface IconControlsProps {
  info: VibeElementInfo;
  onStyleChange: (styles: Record<string, string>) => void;
  // Open the icon-library modal. The host owns the modal mount + the
  // pick → postMessage routing; this control just signals intent.
  onSwapClick?: () => void;
}

export default function IconControls({
  info,
  onStyleChange,
  onSwapClick,
}: IconControlsProps) {
  const [color, setColor] = useState(rgbToHex(info.textColor));

  useEffect(() => {
    setColor(rgbToHex(info.textColor));
  }, [info.path, info.textColor]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Color
        </span>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              onStyleChange({ color: e.target.value });
            }}
            className="h-10 w-10 cursor-pointer border-2 border-ink"
            aria-label="Icon color"
          />
          <span className="font-mono text-[11px] text-ink">{color}</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted">
          Most icon libraries use currentColor — text color cascades.
        </p>
      </label>

      <div className="border-t-2 border-ink/15 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Swap icon
        </p>
        <button
          type="button"
          onClick={onSwapClick}
          disabled={!onSwapClick}
          className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Browse icon library
        </button>
        <p className="mt-1 font-mono text-[10px] text-muted">
          Lucide, Heroicons, Phosphor, Tabler, Brands.
        </p>
      </div>
    </div>
  );
}

function rgbToHex(rgb: string): string {
  if (!rgb) return "#000000";
  if (rgb.startsWith("#")) {
    return rgb.length === 4
      ? "#" +
          rgb
            .slice(1)
            .split("")
            .map((c) => c + c)
            .join("")
            .toLowerCase()
      : rgb.toLowerCase();
  }
  if (
    rgb === "transparent" ||
    /^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/.test(rgb)
  ) {
    return "#000000";
  }
  const m = rgb.match(/\d+(?:\.\d+)?/g);
  if (!m || m.length < 3) return "#000000";
  return (
    "#" +
    m
      .slice(0, 3)
      .map((n) => Math.max(0, Math.min(255, Math.round(Number(n)))))
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
  );
}
