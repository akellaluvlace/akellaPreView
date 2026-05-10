"use client";

// Vibe-edit text controls: content + text/bg color pickers. Used
// for kind in {text, heading, button} — buttons are styled text
// from a vibecoder's POV (the underlying <button> tag's behaviour
// stays).
//
// onContentChange / onStyleChange fire on every keystroke / colour
// pick. Workspace pipes them through to the iframe via direct
// vibe:update-* postMessages so the user sees changes instantly
// without any source rebuild. Source reconciliation happens lazily
// in Workspace via buildVibeCommit on idle.

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface TextControlsProps {
  info: VibeElementInfo;
  onContentChange: (text: string) => void;
  onStyleChange: (styles: { color?: string; backgroundColor?: string }) => void;
}

export default function TextControls({
  info,
  onContentChange,
  onStyleChange,
}: TextControlsProps) {
  const [text, setText] = useState(info.text);
  const [color, setColor] = useState(rgbToHex(info.textColor));
  const [bg, setBg] = useState(rgbToHex(info.bgColor));

  // Sync local input state with whatever the iframe last reported.
  // Keyed on path so switching to a different element reseeds; text
  // / colour deps reseed when an external edit changes the element.
  useEffect(() => {
    setText(info.text);
    setColor(rgbToHex(info.textColor));
    setBg(rgbToHex(info.bgColor));
  }, [info.path, info.text, info.textColor, info.bgColor]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Text
        </span>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onContentChange(e.target.value);
          }}
          rows={3}
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
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
              aria-label="Text color"
            />
            <span className="font-mono text-[11px] text-ink">{color}</span>
          </div>
        </label>

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
      </div>
    </div>
  );
}

// Convert any computed-style colour string the iframe might emit to
// a 6-digit hex. Edge cases:
//   - empty / nullish → black
//   - 'transparent' / rgba(0,0,0,0) → white (so the picker isn't a
//     misleading black square the user can't tell from text colour)
//   - rgb(r,g,b) / rgba(r,g,b,a) → '#rrggbb' (alpha dropped)
//   - '#xxx' / '#xxxxxx' → returned as-is (lowercase'd)
//
// The vibecoder doesn't reason about RGB; the picker just wants a
// hex value. If we ever need alpha we can extend this later.
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
  if (rgb === "transparent" || /^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/.test(rgb)) {
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
