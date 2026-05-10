"use client";

// Vibe-edit card controls: bg color + corner radius. Used when the
// selected container has card-like styling (any of bg / rounding /
// shadow / border). Plain wrapper containers route to a hint
// instead.
//
// Style writes go through onStyleChange (camelCase CSS prop names
// matching CSSStyleDeclaration). The runtime applies via
// el.style[prop] = value; iframe DOM updates instantly. Source
// reconciliation in Workspace writes the inline style attr after
// 600ms idle (HTML mode); JSX mode preserves the visual change for
// the session but doesn't yet persist style edits to source.

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import { parseRadiusPx } from "@/lib/vibe-edit/detect";

interface CardControlsProps {
  info: VibeElementInfo;
  onStyleChange: (styles: Record<string, string>) => void;
}

export default function CardControls({
  info,
  onStyleChange,
}: CardControlsProps) {
  const [bg, setBg] = useState(rgbToHex(info.bgColor));
  const [radius, setRadius] = useState(parseRadiusPx(info.borderRadius));

  useEffect(() => {
    setBg(rgbToHex(info.bgColor));
    setRadius(parseRadiusPx(info.borderRadius));
  }, [info.path, info.bgColor, info.borderRadius]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Background
        </span>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            value={bg}
            onChange={(e) => {
              setBg(e.target.value);
              onStyleChange({ backgroundColor: e.target.value });
            }}
            className="h-10 w-10 cursor-pointer border-2 border-ink"
            aria-label="Background color"
          />
          <span className="font-mono text-[11px] text-ink">{bg}</span>
        </div>
      </label>

      <label className="block">
        <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          <span>Corners</span>
          <span className="text-ink">{radius}px</span>
        </span>
        <input
          type="range"
          min={0}
          max={48}
          step={1}
          value={radius}
          onChange={(e) => {
            const v = Number(e.target.value);
            setRadius(v);
            onStyleChange({ borderRadius: `${v}px` });
          }}
          className="dropin-slider mt-2 w-full"
          aria-label="Corner radius"
        />
      </label>
    </div>
  );
}

function rgbToHex(rgb: string): string {
  if (!rgb) return "#ffffff";
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
    return "#ffffff";
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
