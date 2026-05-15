import Link from "next/link";
import GalleryView from "@/components/GalleryView";
import {
  getAllTemplates,
  getCategories,
  getStyles,
  getThumbSlugs,
  type TemplateKind,
  type TemplateSummary,
} from "@/lib/templates";

export const metadata = {
  title: "Gallery — AiM Dropin",
  description:
    "Browse every ready-to-ship HTML / JSX template. Filter by category, search by name, sort by order.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams?: { kind?: string };
}) {
  const kindPref: TemplateKind =
    searchParams?.kind === "html" ? "html" : "jsx";

  const [all, categories, styles, thumbs] = await Promise.all([
    getAllTemplates({ preferKind: kindPref }),
    getCategories(),
    getStyles(),
    getThumbSlugs(),
  ]);

  // Strip `source` before crossing the RSC boundary — each file is ~10-30KB
  // and we'd otherwise ship the whole Tailwind-CDN dump × 99 to the client.
  const summaries: TemplateSummary[] = all.map(({ source: _s, ...rest }) => rest);
  const thumbSlugs = Array.from(thumbs);

  return (
    // Bounded viewport on lg+: page height locked to viewport so the footer
    // always pins to the bottom regardless of how short the list/carousel
    // content is. The right column scrolls internally instead of pushing
    // the footer down (the source of the "empty strip below footer" gap
    // you'd see in list view with few rows). Mobile keeps natural flow.
    <main className="flex min-h-screen flex-col font-sans text-ink lg:h-screen lg:min-h-0 lg:overflow-hidden">
      <GalleryMasthead />
      <div className="flex-1 lg:min-h-0 lg:overflow-hidden">
        <GalleryView
          templates={summaries}
          categories={categories}
          styles={styles}
          thumbSlugs={thumbSlugs}
          kindPref={kindPref}
        />
      </div>
      <GalleryFooter />
    </main>
  );
}

function GalleryMasthead() {
  return (
    <header className="border-b-2 border-ink bg-white/70">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 md:gap-x-4 md:px-6 md:py-2.5 lg:px-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-4">
          <Link
            href="/"
            aria-label="AiM Dropin — home"
            className="flex items-center gap-2 font-display text-2xl leading-none tracking-tight hover:text-coral md:gap-2.5 md:text-3xl"
          >
            <img
              src="/assets/logo.svg"
              alt=""
              aria-hidden="true"
              className="h-12 w-12 md:h-14 md:w-14"
            />
            <span>Dropin</span>
          </Link>
          <span
            aria-hidden="true"
            className="hidden h-6 w-px self-center bg-ink/40 md:block"
          />
          {/* Subtitle is decorative — hide on very small phones so the
              CTA never wraps to a second row. */}
          <h1 className="hidden font-display text-xl leading-none tracking-tight sm:inline md:text-2xl">
            Ready-to-ship pages
          </h1>
        </div>
        <nav className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] md:gap-6 md:text-[11px] md:tracking-[0.2em]">
          {/* Text-only links collapse on small phones — user reaches
              Home via the Dropin wordmark; Playground via the CTA. */}
          <Link href="/" className="hidden hover:text-coral sm:inline">
            Home
          </Link>
          <Link href="/playground" className="hidden hover:text-coral sm:inline">
            Playground
          </Link>
          <Link href="/playground" className="btn btn-accent">
            <span className="sm:hidden">Open</span>
            <span className="hidden sm:inline">Open playground</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function GalleryFooter() {
  return (
    <footer className="border-t-2 border-ink bg-white/70">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted lg:px-10">
        <p>© 2026 AiM Dropin · Made for vibecoders</p>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-coral">
            Home
          </Link>
          <Link href="/playground" className="hover:text-coral">
            Playground
          </Link>
          <a
            href="https://github.com/akellaluvlace/akellaPreView"
            target="_blank"
            rel="noreferrer"
            className="hover:text-coral"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
