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
// 2026-05-17 — SwapComponentButton retired with the component-library
// swap. Import dropped; the button no longer renders. See
// `docs/superpowers/plans/2026-05-17-ai-edit-element-section.md` Phase 0.

interface CardControlsProps {
  info: VibeElementInfo;
  onStyleChange: (styles: Record<string, string>) => void;
  // Opens the Components library modal so the user can swap the card
  // for a different tile. Optional.
  onComponentSwap?: () => void;
  // Opens the Media library modal so the user can pick a background
  // image. The pick handler at the host treats the URL as CSS bg,
  // NOT an outerHTML swap. Optional.
  onBgImagePick?: () => void;
  // Clears the current background image (both inline style + the
  // corresponding Tailwind arbitrary class via idle-commit drift).
  onBgImageRemove?: () => void;
  // 2026-05-15 — Fire a Pixabay-driven shuffle that derives the query
  // from the card's text content. Async at the host level; this
  // control just invokes it and lets the host toast on error.
  onBgImageShuffle?: () => void;
}

export default function CardControls({
  info,
  onStyleChange,
  onComponentSwap,
  onBgImagePick,
  onBgImageRemove,
  onBgImageShuffle,
}: CardControlsProps) {
  // 2026-05-15 — local shuffling flag prevents back-to-back clicks
  // while the network call is in flight. Resets after the handler
  // resolves (even on error).
  const [shuffling, setShuffling] = useState(false);
  async function handleShuffle() {
    if (!onBgImageShuffle || shuffling) return;
    setShuffling(true);
    try {
      await onBgImageShuffle();
    } finally {
      setShuffling(false);
    }
  }
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

      {/* 2026-05-16 — Background-image section. When the card already
          has an <img> descendant, hide the picker entirely and show a
          redirect message. Picking a bg-image on a card with an inner
          img stacks the new bg under the inner img → visual overlay
          mess. The honest UX: tell the user where to click instead. */}
      {info.hasInnerImg ? (
        <div className="border-t-2 border-ink/15 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Background image
          </p>
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink/70">
            This card has an image inside — click the image directly to swap it.
          </p>
        </div>
      ) : (
        <div className="border-t-2 border-ink/15 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Background image
          </p>
          {info.bgImage && (
            <p
              className="mt-1 truncate font-mono text-[10px] text-ink"
              title={info.bgImage}
            >
              Current: {info.bgImage}
            </p>
          )}
          <div className="mt-1 flex gap-2">
            {/* 2026-05-15 — Shuffle uses Pixabay to fetch a fresh photo
                matching the card's text content. Sits BEFORE Pick so the
                vibecoder can try a random match first and only open the
                full library if they want fine-grained control. */}
            {onBgImageShuffle && (
              <button
                type="button"
                onClick={handleShuffle}
                disabled={shuffling}
                title={
                  shuffling
                    ? "Finding a background…"
                    : "Shuffle — fetch a random photo matching the card's text"
                }
                className="flex-1 border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
              >
                {shuffling ? (
                  <>
                    <span className="inline-block animate-spin">↻</span> Shuffling…
                  </>
                ) : (
                  "Shuffle ↻"
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onBgImagePick}
              disabled={!onBgImagePick}
              className="flex-1 border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
            >
              {info.bgImage ? "Replace" : "Browse"}
            </button>
            {info.bgImage && (
              <button
                type="button"
                onClick={onBgImageRemove}
                disabled={!onBgImageRemove}
                className="border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1 font-mono text-[10px] text-muted">
            Shuffle picks a random photo from Pixabay. Browse opens the full library.
          </p>
        </div>
      )}

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
