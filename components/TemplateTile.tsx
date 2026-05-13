"use client";

import Link from "next/link";
import type { TemplateKind, TemplateSummary } from "@/lib/templates";

interface TemplateTileProps {
  template: TemplateSummary;
  hasThumb: boolean;
  kindPref: TemplateKind;
  // false on duplicated marquee tracks so screen readers + tab key only see
  // the first copy. Defaults to true for normal callers (static grid).
  tabbable?: boolean;
  // When set, fixes the tile width in pixels (used by the marquee to
  // guarantee uniform stride). When omitted, the tile fills its container.
  widthPx?: number;
}

// Single source of truth for the card design. Both the marquee lane and the
// static-grid fallback render this — only the wrapping layout differs. The
// card itself is no longer a single Link; instead, hovering reveals two
// explicit actions (Select → editor, Preview → fullscreen) so a single
// click can't accidentally take the user away from the gallery when they
// just wanted to glance at a page.
export default function TemplateTile({
  template,
  hasThumb,
  kindPref,
  tabbable = true,
  widthPx,
}: TemplateTileProps) {
  const editorHref =
    kindPref === "html"
      ? `/t/${template.slug}?kind=html`
      : `/t/${template.slug}`;
  const previewHref =
    kindPref === "html"
      ? `/preview/${template.slug}?kind=html`
      : `/preview/${template.slug}`;

  return (
    <article
      style={widthPx ? { width: widthPx } : undefined}
      className={
        "group relative block overflow-hidden border-2 border-ink bg-card transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#FF4D2E] focus-within:-translate-y-1 focus-within:shadow-[6px_6px_0_0_#FF4D2E] " +
        (widthPx ? "" : "w-full")
      }
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        {hasThumb ? (
          <img
            src={`/thumbs/${template.slug}.webp`}
            alt={`${template.title} — ${template.category} template`}
            loading="lazy"
            decoding="async"
            width={1280}
            height={800}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center">
            <span className="font-display text-xl leading-tight">
              {template.title}
            </span>
          </div>
        )}
        <span className="absolute left-2 top-2 z-10">
          <span
            className={`chip ${
              template.kind === "jsx" ? "chip-accent" : ""
            }`}
          >
            {template.kind.toUpperCase()}
          </span>
        </span>

        <div
          aria-hidden="true"
          // Mobile (<lg): actions always visible — the hover-reveal
          // pattern doesn't work on touch and would otherwise leave
          // tiles completely un-tappable on phones. Lighter dim (35%)
          // so the thumbnail stays readable. Desktop (lg+): keep the
          // hover-reveal with full dim (65%) for the editorial feel.
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-ink/35 backdrop-blur-[1px] transition-opacity duration-150 lg:pointer-events-none lg:bg-ink/65 lg:opacity-0 lg:backdrop-blur-[2px] lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:opacity-100"
        >
          <Link
            href={editorHref}
            tabIndex={tabbable ? 0 : -1}
            aria-label={`Open ${template.title} in editor`}
            className="min-w-[6.5rem] border-2 border-paper bg-paper px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-coral hover:text-paper focus-visible:bg-coral focus-visible:text-paper focus-visible:outline-none"
          >
            Select
          </Link>
          <Link
            href={previewHref}
            tabIndex={tabbable ? 0 : -1}
            aria-label={`Preview ${template.title} fullscreen`}
            className="min-w-[6.5rem] border-2 border-paper bg-coral px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-paper hover:text-coral focus-visible:bg-paper focus-visible:text-coral focus-visible:outline-none"
          >
            Preview
          </Link>
        </div>
      </div>
      <div className="border-t-2 border-ink px-3 py-2">
        <p className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
          {template.category}
        </p>
        <p className="mt-1 truncate font-display text-sm leading-tight">
          {template.title}
        </p>
      </div>
    </article>
  );
}
