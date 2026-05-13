"use client";

import type { ComponentMeta } from "@/lib/component-library/types";
import type { AssetCompat } from "@/lib/swap/library-filter";
import { fitReasonsTooltip } from "@/lib/swap/library-filter";

interface ComponentCardProps {
  meta: ComponentMeta;
  onSelect: (slug: string) => void;
  onInsert: (slug: string) => void;
  // Phase E proper — compatibility classification for the active swap
  // session. When status === "incompatible", the card visually dims
  // and the title attr surfaces the verdict's reasons (e.g.
  // "needs >= 320px width; aspect ratio 1.50 vs slot's 0.75 (50%
  // drift)"). Compatible / unknown / null = standard appearance.
  compat?: AssetCompat | null;
}

export default function ComponentCard({
  meta,
  onSelect,
  onInsert,
  compat,
}: ComponentCardProps) {
  const status = compat?.status ?? null;
  const isIncompatible = status === "incompatible";
  const isCompatible = status === "compatible";

  // Tooltip text. fitReasonsTooltip already returns null for compatibles
  // and "Fit unknown (no capacity data)" for unknowns. We surface both
  // on the article-level title attr so the user sees them on hover.
  const tooltip = compat ? fitReasonsTooltip(compat) : null;

  return (
    <article
      className={
        "group flex h-full flex-col border-2 border-ink bg-card transition-shadow hover:shadow-[3px_3px_0_0_#FF4D2E] " +
        (isIncompatible
          ? "opacity-50 grayscale"
          : isCompatible
          ? "ring-1 ring-coral/40"
          : "")
      }
      title={tooltip ?? undefined}
      data-compat-status={status ?? undefined}
    >
      <button
        type="button"
        onClick={() => onSelect(meta.slug)}
        aria-label={`Open ${meta.title}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-soft"
      >
        {/* Static WebP thumbnail from /public/component-thumbs — generated
            during `npm run ingest`. Falls back to a readable placeholder if
            the ingest hasn't produced it yet. */}
        <img
          src={meta.thumbUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted opacity-0 group-[&:has(img[style*=none])]:opacity-100">
            {meta.title}
          </span>
        </div>
        <div className="absolute left-1.5 top-1.5 flex gap-1">
          <span
            className={
              "border border-ink bg-paper px-1 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] " +
              (meta.source === "uiverse" ? "bg-coral text-paper border-coral" : "")
            }
          >
            {meta.source}
          </span>
          {meta.darkVariant && (
            <span className="border border-ink bg-ink px-1 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-paper">
              dark
            </span>
          )}
          {/* Phase E proper — compatibility badge. Visible only when
              we have a verdict. Compatible cards already get a coral
              ring; the badge is the explicit affordance for incompatible
              + unknown so users have a quick scan signal. */}
          {isIncompatible && (
            <span className="border border-ink bg-paper px-1 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-ink">
              ✕ won't fit
            </span>
          )}
          {status === "unknown" && (
            <span className="border border-ink bg-paper px-1 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
              ?
            </span>
          )}
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-2 border-t-2 border-ink bg-paper p-2">
        <button
          type="button"
          onClick={() => onSelect(meta.slug)}
          className="text-left font-display text-sm leading-tight hover:text-coral"
        >
          {meta.title}
        </button>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
          {meta.category}
        </p>
        <div className="mt-auto flex gap-1">
          <button
            type="button"
            onClick={() => onInsert(meta.slug)}
            className="flex-1 border-2 border-ink bg-coral px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-paper hover:bg-ink"
          >
            + Insert
          </button>
          <button
            type="button"
            onClick={() => onSelect(meta.slug)}
            className="border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-ink hover:text-paper"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
