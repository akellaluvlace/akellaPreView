"use client";

// Vibe-edit icon controls. Three-layer color application so ALL icon
// families recolor cleanly (UI2 FULL Step 1, 2026-05-12):
//
//   Layer 1 — inline `color` on the SVG root: cascades through paths
//     that use `fill="currentColor"` (Lucide / Heroicons / Phosphor /
//     Tabler / most Iconify CC0). Session-only — JSX mode strips
//     string-form style attrs on reload.
//
//   Layer 2 — inline `fill` on the SVG root: overrides hardcoded
//     `fill="..."` on the root <svg> element itself. Same session-only
//     reload caveat as Layer 1.
//
//   Layer 3 — Tailwind class `[&_*]:fill-[#hex]` LITERAL on the SVG
//     root: a descendant CSS rule (`.foo * { fill: #hex }`) that beats
//     hardcoded `fill="..."` on inner <path> / <g> / <rect> children
//     because W3C SVG 1.1 spec says presentation attributes have
//     specificity ZERO and the descendant CSS selector outranks them.
//     This is what catches Simple Icons + design-tool exports that
//     bake their brand color into inner paths.
//
//   Survival: Layer 3 rides the existing vibe:update-classes path →
//     Workspace's idle-commit detects classes drift → patchJsxClassByOid
//     writes the new className. Survives reload natively. Layers 1+2
//     are belt-and-suspenders for session-time visual feedback before
//     the 600ms idle commit fires.
//
// See docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md for
// the spec-level justification + alternatives considered.
//
// Swap: clicking Browse asks the host to open a LibraryModal in
// icon-only mode. When the user picks a new icon, the host posts
// vibe:update-outer (iframe DOM mutation) AND reconciles source through
// buildVibeCommit's outer-replacement path. No iframe rebuild.

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import { rgbToHex } from "@/lib/vibe-edit/rgb-to-hex";
import { applyIconFillClass } from "@/lib/vibe-edit/icon-fill-class";

interface IconControlsProps {
  info: VibeElementInfo;
  onStyleChange: (styles: Record<string, string>) => void;
  // Open the icon-library modal. The host owns the modal mount + the
  // pick → postMessage routing; this control just signals intent.
  onSwapClick?: () => void;
  // Class-list mutation routed through to Workspace's handleVibeClasses.
  // Optional so panels that don't wire this still work (color cascade
  // degrades to Layers 1+2 only — currentColor + root fill).
  onClassesChange?: (newClasses: string) => void;
}

export default function IconControls({
  info,
  onStyleChange,
  onSwapClick,
  onClassesChange,
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
              const nextHex = e.target.value;
              setColor(nextHex);
              // Layers 1+2 (inline style). Instant session-time visual
              // for currentColor SVGs (color) and root-attribute SVGs
              // (fill). See file docblock.
              onStyleChange({ color: nextHex, fill: nextHex });
              // Layer 3 (Tailwind descendant arbitrary variant).
              // Survives reload via the class-delta source-persistence
              // path. Catches inner-path hardcoded fills.
              if (onClassesChange) {
                const nextClasses = applyIconFillClass(
                  info.classes ?? "",
                  nextHex,
                );
                onClassesChange(nextClasses);
              }
            }}
            className="h-10 w-10 cursor-pointer border-2 border-ink"
            aria-label="Icon color"
          />
          <span className="font-mono text-[11px] text-ink">{color}</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted">
          Color cascades to every part of the icon. Reloading preserves
          the pick.
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
