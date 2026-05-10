"use client";

// Vibe-edit icon controls: color only in v1. Icon kind = SVG
// element. The runtime applies `color` to el.style.color, which
// SVGs inherit via `currentColor` for stroke and fill on most
// icon-library outputs (Lucide, Heroicons, Phosphor, Tabler,
// Simple Icons all use currentColor).
//
// Swap-from-library is a planned follow-up — needs LibraryModal
// integration with a "select-icon-and-replace-svg" callback that
// rewrites both the iframe DOM (innerHTML/outerHTML) and the source
// (patchJsxOuterByOid, which doesn't exist yet). Hint text in the
// panel says "Swap" is coming so the user isn't confused.

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface IconControlsProps {
  info: VibeElementInfo;
  onStyleChange: (styles: Record<string, string>) => void;
}

export default function IconControls({
  info,
  onStyleChange,
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
          Swap (coming soon)
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink">
          Picking a different icon from the library is the next step.
          For now, edit the source directly to change the SVG.
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
