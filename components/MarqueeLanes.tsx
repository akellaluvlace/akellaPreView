"use client";

import { useEffect, useRef } from "react";
import TemplateTile from "./TemplateTile";
import type { TemplateKind, TemplateSummary } from "@/lib/templates";

interface MarqueeLanesProps {
  rows: TemplateSummary[][];
  thumbs: ReadonlySet<string>;
  kindPref: TemplateKind;
  // Lane indices (0-based) that scroll right instead of left.
  reverseLanes?: number[];
  // Animation durations cycled per-lane (longer = slower). Falls back to 80s.
  durations?: string[];
  // Class applied to the wrapper that holds the lanes (vertical spacing only
  // by default — callers control padding/width).
  className?: string;
  // Card width override (px). Defaults to 240 to keep stride uniform for the
  // seamless-loop math (every tile contributes W+16, total = 2N·(W+16)).
  tileWidthPx?: number;
}

const DEFAULT_DURATIONS = ["80s", "95s", "110s", "85s", "100s", "120s"];
const DEFAULT_TILE_WIDTH_PX = 240;

export default function MarqueeLanes({
  rows,
  thumbs,
  kindPref,
  reverseLanes,
  durations = DEFAULT_DURATIONS,
  className,
  tileWidthPx = DEFAULT_TILE_WIDTH_PX,
}: MarqueeLanesProps) {
  const reverseSet = new Set(reverseLanes ?? []);
  return (
    <div className={className ?? "space-y-3"}>
      {rows.map((row, i) => (
        <Lane
          key={i}
          templates={row}
          thumbs={thumbs}
          kindPref={kindPref}
          reverse={reverseSet.has(i)}
          duration={durations[i % durations.length] ?? "80s"}
          tileWidthPx={tileWidthPx}
        />
      ))}
    </div>
  );
}

function Lane({
  templates,
  thumbs,
  kindPref,
  reverse,
  duration,
  tileWidthPx,
}: {
  templates: TemplateSummary[];
  thumbs: ReadonlySet<string>;
  kindPref: TemplateKind;
  reverse: boolean;
  duration: string;
  tileWidthPx: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const cycleSec = parseFloat(duration);
    if (!Number.isFinite(cycleSec) || cycleSec <= 0) return;
    el.style.animationDelay = `${-(Math.random() * cycleSec)}s`;
  }, [duration]);

  if (templates.length === 0) return null;

  return (
    <div
      // overflow-x-clip clips the marquee's horizontal overflow (the track is
      // 2× viewport width) without spilling into the next column. overflow-y
      // stays visible so per-tile hover effects — `-translate-y-1` plus the
      // 6px coral shadow — aren't sheared off at the lane's top/bottom edge.
      // overflow-x: clip (Overflow Level 3) lets the two axes act
      // independently; the older `overflow-hidden` shorthand forces both.
      className="dropin-marquee-viewport relative overflow-x-clip overflow-y-visible"
      role="group"
      aria-label="Template carousel lane"
    >
      <div
        ref={rowRef}
        className={`dropin-marquee ${reverse ? "dropin-marquee-r" : ""}`}
        style={
          {
            ["--dropin-marquee-duration"]: duration,
          } as React.CSSProperties
        }
      >
        <Track
          templates={templates}
          thumbs={thumbs}
          kindPref={kindPref}
          ariaHidden={false}
          tileWidthPx={tileWidthPx}
        />
        <Track
          templates={templates}
          thumbs={thumbs}
          kindPref={kindPref}
          ariaHidden
          tileWidthPx={tileWidthPx}
        />
      </div>
    </div>
  );
}

function Track({
  templates,
  thumbs,
  kindPref,
  ariaHidden,
  tileWidthPx,
}: {
  templates: TemplateSummary[];
  thumbs: ReadonlySet<string>;
  kindPref: TemplateKind;
  ariaHidden: boolean;
  tileWidthPx: number;
}) {
  // Per-tile margin-right (16px) instead of `gap-4` on the ul. With two
  // tracks rendered as siblings inside the marquee flex container, a
  // ul-level `gap` doesn't apply across tracks — so the boundary between
  // the last tile of copy 1 and the first tile of copy 2 collapsed to 0.
  // mr-4 on every tile guarantees a uniform 16px gap at every seam, and
  // keeps the seamless-loop math intact (each tile contributes W+16, so the
  // -50% translation lands exactly N·(W+16) past the start).
  return (
    <ul
      className="flex shrink-0 list-none"
      aria-hidden={ariaHidden || undefined}
    >
      {templates.map((t) => (
        <li
          key={t.slug + (ariaHidden ? "-dup" : "")}
          className="mr-4 shrink-0"
        >
          <TemplateTile
            template={t}
            hasThumb={thumbs.has(t.slug)}
            kindPref={kindPref}
            tabbable={!ariaHidden}
            widthPx={tileWidthPx}
          />
        </li>
      ))}
    </ul>
  );
}
