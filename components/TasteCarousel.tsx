"use client";

import Link from "next/link";
import { useMemo } from "react";
import MarqueeLanes from "./MarqueeLanes";
import type { TemplateKind, TemplateSummary } from "@/lib/templates";

interface TasteCarouselProps {
  rows: TemplateSummary[][];
  thumbs: string[];
  kindPref: TemplateKind;
  total: number;
}

const REVERSE_LANES = [1]; // middle lane drifts the other way
// Doubled from the original 80/95/110s — at the previous speed the
// marquee felt aggressive on phones; slower feels premium and lets
// the user actually register individual tiles as they pass.
const DURATIONS = ["160s", "190s", "220s"];

export default function TasteCarousel({
  rows,
  thumbs,
  kindPref,
  total,
}: TasteCarouselProps) {
  const thumbSet = useMemo(() => new Set(thumbs), [thumbs]);

  return (
    <section className="border-b-2 border-ink" aria-labelledby="taste-heading">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 lg:px-10 lg:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              Featured
            </p>
            <h2
              id="taste-heading"
              className="mt-3 font-display text-display-lg"
            >
              A taste of the gallery
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink/70">
              All {total} templates, split across three lanes. The middle lane
              drifts the other way. Hover to pause; click any tile to open it.
            </p>
          </div>
          <Link href="/gallery" className="btn">
            Browse all {total} →
          </Link>
        </div>
      </div>

      {/* Full-bleed lanes: the marquee escapes the 1400px container so the
          tracks run from edge to edge. We rely on the section being naturally
          100% of its parent — using w-screen would over-extend by the OS
          scrollbar width and trigger a horizontal scroll. */}
      <div className="mt-12 w-full">
        <MarqueeLanes
          rows={rows}
          thumbs={thumbSet}
          kindPref={kindPref}
          reverseLanes={REVERSE_LANES}
          durations={DURATIONS}
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-10 lg:pb-24">
        <div className="mt-12 flex justify-center">
          <Link href="/gallery" className="btn btn-accent">
            Explore the full gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
