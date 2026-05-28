import Link from "next/link";
import HeroWatermark from "@/components/HeroWatermark";
import TasteCarousel from "@/components/TasteCarousel";
import {
  getAllTemplates,
  getCategories,
  getStyles,
  getThumbSlugs,
  type TemplateKind,
  type TemplateStyle,
  type TemplateSummary,
} from "@/lib/templates";

type Kind = TemplateKind;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://dropin.akellainmotion.com";

const FOUNDER_LINKEDIN =
  "https://www.linkedin.com/in/nikita-akella-41b728368/";
const COMPANY_LINKEDIN = "https://www.linkedin.com/company/akella-inmotion/";
const STUDIO_URL = "https://akellainmotion.com";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { kind?: string };
}) {
  const kindPref: Kind = searchParams?.kind === "html" ? "html" : "jsx";
  const [templates, categories, styles, thumbSet] = await Promise.all([
    getAllTemplates({ preferKind: kindPref }),
    getCategories(),
    getStyles(),
    getThumbSlugs(),
  ]);

  // Strip `source` before crossing the server→client boundary; the carousel
  // only needs metadata, and shipping ~111 source bodies would balloon the
  // RSC payload by several hundred KB.
  const summaries: TemplateSummary[] = templates.map(
    ({ source: _source, ...meta }) => meta,
  );
  const withThumbs = summaries.filter((t) => thumbSet.has(t.slug));
  const carouselSource = withThumbs.length >= 12 ? withThumbs : summaries;
  const rows = splitIntoLanes(carouselSource, 3);
  const thumbsArray = Array.from(thumbSet);

  // Precompute counts for BOTH functional categories (Marketing,
  // Portfolio, etc.) AND visual styles (Retro, Cyber, Brutal,
  // Editorial, Stylish). Both lists render as chips on the strip with
  // their counts visible — vibecoders can scan total density per
  // axis before deciding what to browse.
  const categoryCounts: { name: string; count: number }[] = categories.map(
    (name) => ({
      name,
      count: summaries.filter((t) => t.category === name).length,
    }),
  );
  const styleCounts: { name: string; count: number }[] = styles.map(
    (name) => ({
      name,
      count: summaries.filter((t) => t.style === name).length,
    }),
  );

  return (
    <main className="w-full min-h-screen font-sans text-ink">
      <JsonLd templateCount={templates.length} />
      {/* Masthead + Hero share a 100dvh flex container so the Hero's
          `flex-1` fills EXACTLY the remaining viewport below the
          masthead — no calc(100dvh - assumed-px), no peek-through of
          the section below. Works on both mobile and desktop. */}
      <div className="flex min-h-[100dvh] w-full flex-col">
        <Masthead />
        <Hero templateCount={templates.length} />
      </div>
      <HowItWorks />
      <CategoryStrip categories={categoryCounts} styles={styleCounts} />
      <TasteCarousel
        rows={rows}
        thumbs={thumbsArray}
        kindPref={kindPref}
        total={templates.length}
      />
      <Footer />
    </main>
  );
}

// Round-robin split so each lane gets a varied mix of categories rather than
// a contiguous alphabetical slice. Order within a lane is preserved.
function splitIntoLanes(
  templates: TemplateSummary[],
  laneCount: number,
): TemplateSummary[][] {
  const lanes: TemplateSummary[][] = Array.from({ length: laneCount }, () => []);
  templates.forEach((t, i) => {
    lanes[i % laneCount].push(t);
  });
  return lanes;
}

function JsonLd({ templateCount }: { templateCount: number }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: "Akella inMotion",
        url: STUDIO_URL,
        logo: `${SITE_URL}/assets/logo.svg`,
        sameAs: [STUDIO_URL, COMPANY_LINKEDIN, FOUNDER_LINKEDIN],
        founder: {
          "@type": "Person",
          name: "Nikita Akella",
          url: FOUNDER_LINKEDIN,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#site`,
        url: SITE_URL,
        name: "AiM Dropin",
        description:
          "Paste AI-generated HTML or JSX and watch it render live. No install, no terminal, no sign-in.",
        publisher: { "@id": `${SITE_URL}/#org` },
        inLanguage: "en-US",
      },
      {
        "@type": "WebApplication",
        name: "AiM Dropin Playground",
        url: `${SITE_URL}/playground`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${SITE_URL}/#org` },
        description: `Live preview for AI-generated HTML and JSX. ${templateCount} ready-to-ship templates included.`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function Masthead() {
  return (
    // Clean cream masthead; w-screen guarantees full viewport width.
    // The decorative volume chip is dropped — "no fluff": every chip in
    // the Hero already speaks to what Dropin is. The wordmark + CTA is
    // all the masthead needs to do.
    <header className="w-screen border-b-2 border-ink bg-white/70">
      {/* Tight vertical padding (py-2 md:py-2.5) so the 1.7x-bigger
          logo doesn't push the navbar down — total bar height stays
          ~same as before. The wordmark is just "Dropin" because the
          SVG logo carries the coral "AiM" inside it; no need to
          duplicate "AiM" as separate text. */}
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-2 md:gap-4 md:px-6 md:py-2.5 lg:px-10">
        <Link
          href="/"
          aria-label="AiM Dropin — home"
          className="flex items-center gap-2 font-display text-2xl leading-none tracking-tight md:gap-2.5 md:text-3xl"
        >
          <img
            src="/assets/logo.svg"
            alt=""
            aria-hidden="true"
            className="h-12 w-12 md:h-14 md:w-14"
          />
          <span>Drop In</span>
        </Link>
        <nav className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] md:gap-6 md:text-[11px] md:tracking-[0.2em]">
          {/* Mobile (<sm): only Gallery is surfaced — the hero CTAs
              already lead the user into the playground / templates,
              and the masthead stays minimal. Desktop (sm+): full
              triad (Gallery + Playground + the Open playground CTA). */}
          <Link href="/gallery" className="hover:text-coral">Gallery</Link>
          <Link href="/playground" className="hidden hover:text-coral sm:inline">Playground</Link>
          <Link href="/playground" className="btn btn-accent hidden sm:inline-flex">
            Open playground
          </Link>
        </nav>
      </div>
    </header>
  );
}

// How-it-works step icons — DUOTONE, 48x48. Phosphor-style two-layer
// duotone: ink stroke for the outline + a strong coral fill on the
// body shapes. Bumped fill opacity (0.48) so the coral reads clearly
// as the brand accent instead of disappearing into a faint tint.
// Inline SVGs (locked stack — no icon-library deps).
const ICON_ACCENT = "#FF4D2E";
const ICON_ACCENT_OPACITY = 0.48;

function PasteIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Clipboard body — duotone fill + ink stroke */}
      <rect x="11" y="10" width="26" height="32" rx="2" fill={ICON_ACCENT} fillOpacity={ICON_ACCENT_OPACITY} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Clip tab — duotone */}
      <rect x="18" y="6" width="12" height="8" rx="1.5" fill={ICON_ACCENT} fillOpacity={ICON_ACCENT_OPACITY} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Content lines (stroke only) */}
      <path d="M17 25h14M17 32h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Pencil body — duotone */}
      <path d="M30 8l10 10L18 40H8v-10L30 8z" fill={ICON_ACCENT} fillOpacity={ICON_ACCENT_OPACITY} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Ferrule seam (stroke only) */}
      <path d="M26 12l10 10" stroke="currentColor" strokeWidth="2" />
      {/* Tip mark (stroke only) */}
      <path d="M8 30l10 10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Down arrow shaft + head — stroke only */}
      <path d="M24 8v22M14 22l10 10 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Base tray — duotone */}
      <rect x="8" y="36" width="32" height="6" rx="1.5" fill={ICON_ACCENT} fillOpacity={ICON_ACCENT_OPACITY} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Main four-pointed sparkle — duotone */}
      <path d="M24 8l4.5 11.5L40 24l-11.5 4.5L24 40l-4.5-11.5L8 24l11.5-4.5L24 8z" fill={ICON_ACCENT} fillOpacity={ICON_ACCENT_OPACITY} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Small accent sparkle top-right — stroke only */}
      <path d="M38 6l1.5 3.5L43 11l-3.5 1.5L38 16l-1.5-3.5L33 11l3.5-1.5L38 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// Hero chip icons — 11x11, sit before the chip label. Keeps chips
// compact but adds a glance-readable visual anchor per chip. Inline
// SVGs (locked stack — no icon-library deps).
function EyeChipIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BoltChipIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

function BracketsChipIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 6L3 12l5 6M16 6l5 6-5 6" />
    </svg>
  );
}

// Shared step list. Consumed by both the desktop Hero aside (lg+
// 4-col aside) and the mobile HowItWorks section (below the Hero
// on <lg). Single source — copy can't drift between mobile and
// desktop renders.
const HOW_IT_WORKS_STEPS: ReadonlyArray<{
  n: string;
  title: string;
  body: string;
  Icon: () => JSX.Element;
}> = [
  { n: "01", title: "Paste or pick", body: "Drop your HTML/JSX or grab a template.", Icon: PasteIcon },
  { n: "02", title: "Edit live", body: "Tweak it. Preview updates in 250ms.", Icon: EditIcon },
  { n: "03", title: "Copy or download", body: "Ship it. No sign-in, no backend.", Icon: DownloadIcon },
  { n: "04", title: "Yours to keep", body: "Host it, remix it, change it — free.", Icon: SparkIcon },
];

function Hero({ templateCount }: { templateCount: number }) {
  return (
    // Full-viewport hero. Section uses `flex-1` to fill the
    // remaining height of the masthead+hero wrapper above (which is
    // exactly 100dvh tall). Result: hero perfectly fits the visible
    // viewport with NO peek-through of the section below.
    //
    // Mobile: single column. Left column is a flex-col with chips
    // pinned to the top, h1+caption+body just below, and CTAs pushed
    // to the bottom via mt-auto (centered horizontally).
    //
    // Desktop (lg+): 2-column grid. Left column (8/12) holds the
    // hero content (chips / h1 / body / CTAs in natural top-down
    // flow — `lg:flex-none` disables the mobile bottom-push). Right
    // column (4/12) holds the How-it-works card list.
    <section className="flex w-screen flex-1 flex-col border-b-2 border-ink">
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-8 px-4 pb-6 pt-10 sm:gap-10 sm:px-6 sm:pb-10 sm:pt-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-10 lg:py-16">
        {/* On mobile this column is a 3-zone vertical layout:
              [chips]                              ← top
              [h1 + sub-caption + body]            ← centered middle
              [CTAs]                               ← bottom
            The middle zone uses `flex-1 justify-center` so the H1
            block sits centered in the empty space between the chips
            and the CTAs. On desktop the column flows naturally
            top-down (lg:contents on the middle wrapper removes the
            flex centering).
            `relative isolate` creates a stacking context for the
            sketched watermark (next child) so its `-z-10` sits
            behind the column's content but stays inside this
            column's box. */}
        <div className="relative isolate flex flex-col lg:col-span-8">
          {/* Sketched watermark — same wolf silhouette, same
              left-column placement and ~30% white-on-cream tone as
              the previous inverted PNG; only the reveal is new
              (125deg mask-wipe outline → fill, then outline fades).
              Inline SVG so the animation timing is reliable on first
              paint. */}
          <HeroWatermark />
          {/* Chips lead with a glance-readable icon. gap-2 stays
              tight; icons sit at 11px to preserve the chip's compact
              all-caps tracking. Staggered reveal pairs with the
              watermark wipe — chips first, then h1, sub-caption,
              body, CTAs. Mirrors the right column's per-card cascade. */}
          <div
            className="dropin-step-reveal flex flex-wrap items-center gap-2"
            style={{ animationDelay: "0ms" }}
          >
            <span className="chip gap-1.5"><EyeChipIcon />Live preview</span>
            <span className="chip gap-1.5"><BoltChipIcon />Zero install</span>
            <span className="chip gap-1.5"><BracketsChipIcon />HTML · JSX</span>
          </div>
          {/* Middle zone — vertically AND horizontally centered on
              mobile via flex-1 + justify-center + text-center. The
              body paragraph has max-w-xl + mx-auto so its block
              centers within the column. `lg:contents` + lg:text-left
              + lg:mx-0 revert all of this for desktop, so the inner
              h1/captions participate in the parent column's normal
              left-aligned top-down flow. */}
          <div className="flex flex-1 flex-col justify-center text-center lg:contents lg:text-left">
            {/* Templates-led headline — Dropin's whole point: the
                {templateCount}-template gallery + the freedom to edit
                and keep them, AND a free asset library bundled in. */}
            <h1
              className="dropin-step-reveal mt-8 font-display text-[52px] leading-[0.95] sm:mt-10 sm:text-[60px] md:text-[68px] lg:mt-7 lg:text-display-xl"
              style={{ animationDelay: "140ms" }}
            >
              {templateCount} templates.
              <br />
              <em className="not-italic text-coral" style={{ fontStyle: "italic" }}>
                Edit anything.
              </em>
              <br />
              Free assets.
            </h1>
            {/* Sub-caption split into two lines for graceful wrap on
                mobile — line 1 holds the visual asset types, line 2
                surfaces "Our library" as the call-out. */}
            <p
              className="dropin-step-reveal mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted sm:text-xs"
              style={{ animationDelay: "280ms" }}
            >
              <span className="block">Images · Components · Icons</span>
              <span className="block">Videos · Our library</span>
            </p>
            {/* Body anchors the freedom angle — free, editable, no
                install — and surfaces the live-preview mechanic as a
                "plus, also" benefit instead of the lead. */}
            <p
              className="dropin-step-reveal mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/80 sm:mt-7 sm:text-lg lg:mx-0"
              style={{ animationDelay: "420ms" }}
            >
              <strong className="font-semibold text-ink">Free to remix. Free to keep.</strong>
              {" "}No install, no sign-in. Plus a live playground for any AI-generated HTML or JSX.
            </p>
          </div>
          {/* CTAs pinned to the bottom on mobile via `mt-auto` (the
              column fills its grid cell, so mt-auto pushes against
              the bottom edge). Centered horizontally on mobile
              (`justify-center`), left-aligned on desktop
              (`lg:justify-start`). */}
          <div
            className="dropin-step-reveal mt-auto flex flex-wrap justify-center gap-3 pt-10 lg:mt-8 lg:justify-start lg:pt-0"
            style={{ animationDelay: "560ms" }}
          >
            <Link href="/playground" className="btn btn-accent">
              Open playground →
            </Link>
            <Link href="/gallery" className="btn">
              Browse {templateCount} templates
            </Link>
          </div>
        </div>

        {/* Desktop aside — single-column stack of 4 cards. Each card
            holds the SAME row layout that was there before (numeral
            top-left, icon top-right, title + body below). No border;
            the card reads as a subtle lighter cream zone on top of
            the Hero's bg-paper + dot pattern (the body's radial-
            gradient dots show through the semi-transparent white
            overlay). Seamless — feels like the same surface, just
            with a faint lift per step. Mobile keeps the unboxed
            vertical step list via <HowItWorks /> — untouched. */}
        <aside className="hidden lg:col-span-4 lg:block lg:pl-6">
          <p className="font-mono text-2xl font-bold uppercase tracking-[0.12em] text-coral">
            How it works
          </p>
          <ol className="mt-5 space-y-3">
            {HOW_IT_WORKS_STEPS.map((s, i) => (
              <StepCard key={s.n} step={s} index={i} />
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

// Mobile-only How-it-works section. Renders below the full-viewport
// Hero on <lg. Hidden on lg+ where the Hero's right-column aside
// takes over. The eyebrow is the section heading (coral bold, 2x+
// the prior size); no separate h2 needed.
function HowItWorks() {
  return (
    <section
      className="w-screen border-b-2 border-ink bg-white/70 lg:hidden"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-14">
        <h2
          id="how-it-works-heading"
          className="font-mono text-2xl font-bold uppercase tracking-[0.12em] text-coral sm:text-3xl"
        >
          How it works
        </h2>
        <ol className="mt-4">
          {HOW_IT_WORKS_STEPS.map((s, i) => (
            <StepRow key={s.n} step={s} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

// DESKTOP step card — single-column stack of 4 in the Hero's right
// aside. Card chrome is INTENTIONALLY soft: no border, just a
// semi-transparent white overlay (`bg-white/55`) that creates a
// faint lighter-cream zone on top of the body's bg-paper + radial
// dot pattern. The body's pattern stays visible through the
// overlay — seamless transition with the Hero's surface, the card
// only reads as a faint "lift" per step.
//
// Content layout mirrors what the rows had before this card pass:
// numeral top-left, duotone icon top-right (justify-between), title
// + body below. Staggered animation-delay cascades the 4 cards in
// on first paint.
function StepCard({
  step,
  index,
}: {
  step: {
    n: string;
    title: string;
    body: string;
    Icon: () => JSX.Element;
  };
  index: number;
}) {
  return (
    <li
      // Semi-transparent white overlay (~70%) lifts the card a shade
      // or two LIGHTER than the Hero's bg-paper, just enough to read
      // as a distinct lighter cream surface. Body's dot pattern still
      // shows through the 30% transparency so the cards stay
      // continuous with the page texture — seamless.
      className="dropin-step-reveal bg-white/70 px-5 py-4"
      style={{ animationDelay: `${index * 140}ms` }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-5xl leading-none text-coral">
          {step.n}
        </span>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-ink">
          <step.Icon />
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl leading-[1.15] tracking-tight">
        {step.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink/80">
        {step.body}
      </p>
    </li>
  );
}

// MOBILE step row — used by the mobile <HowItWorks /> section below
// the Hero. UNTOUCHED per the user's "dont touch mobile section
// anymore" instruction. Premium magazine layout, NO divider lines.
// Numeral and icon on opposite ends of the top row (justify-between):
// big coral numeral on the left, duotone icon mirrored on the right.
// Title + body stack below. Staggered animation-delay matches the
// desktop card cascade.
function StepRow({
  step,
  index,
}: {
  step: {
    n: string;
    title: string;
    body: string;
    Icon: () => JSX.Element;
  };
  index: number;
}) {
  return (
    <li
      className="dropin-step-reveal py-5"
      style={{ animationDelay: `${index * 140}ms` }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-5xl leading-none text-coral">
          {step.n}
        </span>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-ink">
          <step.Icon />
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl leading-[1.15] tracking-tight">
        {step.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink/80">
        {step.body}
      </p>
    </li>
  );
}

// Sections / Styles inventory column rendered at the bottom of the
// desktop Hero. Each row: name (display font) + count (coral mono),
// hairline divider between. Premium feel via tight rhythm + bold
// coral counters that actually read.
function InventoryColumn({
  label,
  items,
}: {
  label: string;
  items: { name: string; count: number }[];
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {label}
      </p>
      <ul className="mt-4 divide-y divide-ink/15 border-t border-ink/20">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-baseline justify-between py-2.5"
          >
            <span className="font-display text-base leading-none">
              {item.name}
            </span>
            <span className="font-mono text-sm font-semibold text-coral">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}


function CategoryStrip({
  categories,
  styles,
}: {
  categories: { name: string; count: number }[];
  styles: { name: string; count: number }[];
}) {
  if (categories.length === 0 && styles.length === 0) return null;
  return (
    // Inventory section — shows below the Hero on BOTH mobile and
    // desktop. Two columns: Sections (functional categories) +
    // Styles (visual aesthetics). Each row name + count with a
    // hairline divider between — counts in coral so the eye reads
    // density at a glance. Two-column grid even on phones (~166px
    // per column at 390px viewport is enough for "Editorial" + a
    // 2-digit count).
    <section className="w-screen border-b-2 border-ink bg-white/70">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12 lg:gap-x-16">
          <InventoryColumn label="Sections" items={categories} />
          <InventoryColumn label="Styles" items={styles} />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-screen bg-white/70">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 md:items-center md:gap-6 lg:px-10">
        {/* Left: wolf icon + product nav */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            aria-label="AiM Dropin — back to home"
            className="shrink-0 inline-flex"
          >
            <img
              src="/assets/logo.png"
              alt="AiM Dropin · a project by Akella inMotion"
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
              className="h-28 w-28 object-contain"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <p className="font-display text-xl leading-tight">
              <em className="not-italic text-coral" style={{ fontStyle: "normal" }}>AiM</em>{" "}Dropin
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              © 2026 · Built for vibecoders
            </p>
            <nav
              aria-label="Footer product navigation"
              className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              <Link href="/gallery" className="hover:text-coral">
                Gallery
              </Link>
              <Link href="/playground" className="hover:text-coral">
                Playground
              </Link>
              <a
                href="https://github.com/akellaluvlace/akellaPreView"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-coral"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>

        {/* Right: studio attribution + socials */}
        <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Made by
          </p>
          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Akella inMotion — opens in a new tab"
            className="link-thick font-display text-3xl leading-tight tracking-tight transition-colors hover:text-coral md:text-4xl"
          >
            Akella inMotion
            <span aria-hidden="true" className="ml-2 inline-block">
              ↗
            </span>
          </a>
          <nav
            aria-label="Akella inMotion social links"
            className="flex flex-wrap items-center gap-3 md:justify-end"
          >
            <a
              href={COMPANY_LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Akella inMotion on LinkedIn — company page"
              className="inline-flex items-center gap-2 border-2 border-ink bg-white/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper"
            >
              <LinkedInGlyph />
              Company
            </a>
            <a
              href={FOUNDER_LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nikita Akella on LinkedIn — founder profile"
              className="inline-flex items-center gap-2 border-2 border-ink bg-white/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper"
            >
              <LinkedInGlyph />
              Founder
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

// Inline SVG so the footer doesn't pull in an icon library and the glyph
// inherits currentColor — matches the brutalist border-on-paper look without
// a network round-trip.
function LinkedInGlyph() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.451 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.355V9h3.414v1.561h.05c.476-.9 1.637-1.852 3.37-1.852 3.6 0 4.266 2.37 4.266 5.455v6.288zM5.337 7.433a2.062 2.062 0 0 1-2.062-2.062c0-1.139.923-2.062 2.062-2.062 1.139 0 2.063.923 2.063 2.062 0 1.139-.924 2.062-2.063 2.062zM7.119 20.452H3.554V9H7.12v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}
