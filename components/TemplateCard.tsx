"use client";
import Link from "next/link";
import type { TemplateKind, TemplateSummary } from "@/lib/templates";

function log(msg: string, data?: unknown) {
  if (typeof window === "undefined") return;
  console.log(`[dropin:TemplateCard] ${msg}`, data ?? "");
}

interface TemplateCardProps {
  template: TemplateSummary;
  index: number;
  kindPref: TemplateKind;
  // Pre-computed set of slugs that have a public/thumbs/<slug>.webp on disk.
  // Passed in from the gallery so we don't re-stat per card.
  hasThumb?: boolean;
}

const HOVER_MOTION = [
  "group-hover:-rotate-1 group-hover:-translate-y-1",
  "group-hover:rotate-1 group-hover:-translate-y-2",
  "group-hover:-rotate-1 group-hover:-translate-y-1",
  "group-hover:rotate-0 group-hover:-translate-y-2",
];

export default function TemplateCard({
  template,
  index,
  kindPref,
  hasThumb,
}: TemplateCardProps) {
  const motion = HOVER_MOTION[index % HOVER_MOTION.length];
  const number = String(index + 1).padStart(3, "0");
  const href =
    kindPref === "html"
      ? `/t/${template.slug}?kind=html`
      : `/t/${template.slug}`;

  return (
    <Link
      href={href}
      className="group block"
      aria-label={`Open template: ${template.title}`}
      onClick={() => log("click card", { slug: template.slug, href })}
    >
      <div
        className={
          "card overflow-hidden transition duration-300 ease-out " +
          "group-hover:shadow-[10px_10px_0_0_#FF4D2E] " +
          motion
        }
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-soft">
          {hasThumb ? (
            // Real screenshot from scripts/gen-thumbs.mjs. Captured at 1280×800,
            // shown in a 4:3 tile — `object-top` keeps the hero in frame.
            <img
              src={`/thumbs/${template.slug}.webp`}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-8 text-center">
              <h3 className="font-display text-3xl leading-[0.95] tracking-tight md:text-4xl">
                {template.title}
              </h3>
            </div>
          )}

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span
              className={`chip ${template.kind === "jsx" ? "chip-accent" : ""}`}
            >
              {template.kind.toUpperCase()}
            </span>
          </div>
          <span className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            № {number}
          </span>
        </div>

        <div className="border-t-2 border-ink bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {template.category}
          </p>
          <h4 className="mt-2 font-display text-xl leading-tight">
            {template.title}
          </h4>
          <p className="mt-2 line-clamp-2 text-sm text-ink/70">
            {template.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
