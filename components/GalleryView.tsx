"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import KindToggle from "./KindToggle";
import MarqueeLanes from "./MarqueeLanes";
import TemplateTile from "./TemplateTile";
import type {
  TemplateKind,
  TemplateStyle,
  TemplateSummary,
} from "@/lib/templates";

const DEBUG_LOGS = false;
function log(msg: string, data?: unknown) {
  if (DEBUG_LOGS) console.log(`[dropin:GalleryView] ${msg}`, data ?? "");
}

type SortKey = "az" | "za" | "num-asc" | "num-desc";
type ViewMode = "carousel" | "list";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "az", label: "A → Z" },
  { id: "za", label: "Z → A" },
  { id: "num-asc", label: "№ asc" },
  { id: "num-desc", label: "№ desc" },
];

const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: "carousel", label: "Carousel" },
  { id: "list", label: "List" },
];

// Below this count the marquee feels redundant — each lane would only loop
// 1–2 unique cards on itself. Fall through to a static grid instead.
const MARQUEE_THRESHOLD = 15;
const MARQUEE_LANES = 3;
const LANE_DURATIONS = ["90s", "110s", "80s"];
const LANE_REVERSALS = [1]; // middle lane runs counter-flow

// Mobile-only: below this count, render templates as a centered vertical
// stack (each tile gets full attention). At or above this count, switch
// to a horizontally-swipeable carousel (no auto-scroll — user drives it
// with their finger). Threshold matches "Our picks" (18 curated tiles)
// so the picks view always falls into the swipeable-carousel branch on
// mobile and the user can flip through them with one hand.
const MOBILE_CAROUSEL_THRESHOLD = 18;


// Hand-curated "Our picks" — the templates we surface above All as the
// default landing view. Order is meaningful: the picks render in this
// exact sequence regardless of the sort dropdown (this filter is the
// editorial choice, sort is the "show me everything alphabetically"
// escape hatch — they shouldn't fight). Add / remove a slug here only;
// the count + filter + ordering follow automatically.
const OUR_PICKS_SLUGS: ReadonlyArray<string> = [
  "4-ai-product-landing",
  "50-cyberpunk-high-tech",
  "60-aurora-gradients",
  "22-photographer-portfolio",
  "3-saas-dark",
  "51-glassmorphism",
  "58-oled",
  "72-high-luxury",
  "89-editorial-magazine",
  "106-neo-classical-editorial",
  "53-claymorphism",
  "65-typographic-swiss-poster",
  "45-real-estate-listing",
  "17-single-product-dtc",
  "84-game-studio",
  "109-dark-luxury-occult",
  "88-fitness-wellness",
  "96-wabi-sabi-imperfect",
];
const OUR_PICKS_INDEX: ReadonlyMap<string, number> = new Map(
  OUR_PICKS_SLUGS.map((s, i) => [s, i]),
);

// Dev-only sanity check: every picks slug must resolve to a real template.
// Without this a `web/` rename silently breaks the picks filter (the slug
// is still in the array but no template carries it → picks shows N-1
// cards, no console signal). Returns the list of missing slugs.
function findUnresolvedPicks(
  templates: ReadonlyArray<{ slug: string }>,
): string[] {
  const slugs = new Set(templates.map((t) => t.slug));
  return OUR_PICKS_SLUGS.filter((s) => !slugs.has(s));
}

// Single active filter — clicking any sidebar pill replaces the previous
// selection. Style, Category, and Picks share one selection slot so the
// user can't end up in a "Marketing × Cyber × Picks" state with
// confusing empty lanes; they switch lenses by tapping a different pill.
type ActiveFilter =
  | { kind: "picks" }
  | { kind: "category"; value: string }
  | { kind: "style"; value: TemplateStyle }
  | null;

interface GalleryViewProps {
  templates: TemplateSummary[];
  categories: string[];
  styles: TemplateStyle[];
  thumbSlugs: string[]; // serialised Set (plain array crosses the RSC boundary)
  kindPref: TemplateKind;
}

function makeHaystack(t: TemplateSummary): string {
  return (
    t.title +
    " " +
    t.slug +
    " " +
    t.category +
    " " +
    (t.tags || []).join(" ") +
    " " +
    t.description
  ).toLowerCase();
}

export default function GalleryView({
  templates,
  categories,
  styles,
  thumbSlugs,
  kindPref,
}: GalleryViewProps) {
  // Dev-only fast-fail when a template rename leaves OUR_PICKS_SLUGS
  // pointing at a stale slug. Runs once per mount; production builds
  // skip it entirely so end-users never see the noise.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const missing = findUnresolvedPicks(templates);
    if (missing.length > 0 && typeof console !== "undefined" && console.warn) {
      console.warn(
        "[GalleryView] OUR_PICKS_SLUGS contains unresolved slugs (template renamed or removed?):",
        missing,
      );
    }
  }, [templates]);

  const [query, setQuery] = useState("");
  // Land on the curated "Our picks" view by default — surfaces the 18
  // editorial-quality templates first. User can click All / a category /
  // a style to switch to the full set.
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>({ kind: "picks" });
  const [sort, setSort] = useState<SortKey>("az");
  const [searchOpen, setSearchOpen] = useState(false);
  // Mobile-only hamburger sheet. The desktop sidebar (`aside`) is
  // hidden on <lg via Tailwind; tapping the mobile bar's hamburger
  // opens this full-screen sheet that wraps the same controls
  // (KindToggle / SortSelect / ViewSelect / Search / FilterSidebar).
  // Closes on any filter pick, on the explicit × close, or on Escape.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);
  // Hydration-safe: start with the default ("carousel") so SSR and the
  // client's first render produce identical trees. After mount, sync the
  // user's persisted preference. The viewModeHydrated ref gates the WRITE
  // effect so the post-mount read doesn't immediately echo back as a write
  // before we've applied the stored value.
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const viewModeHydratedRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      viewModeHydratedRef.current = true;
      return;
    }
    try {
      const stored = window.localStorage.getItem("dropin:gallery:view");
      if (stored === "list" || stored === "carousel") {
        setViewMode(stored);
      }
    } catch {
      // private mode → state-only persistence
    }
    viewModeHydratedRef.current = true;
  }, []);
  useEffect(() => {
    if (!viewModeHydratedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("dropin:gallery:view", viewMode);
    } catch {
      // private mode → state-only persistence
    }
  }, [viewMode]);

  const setQueryLog = (v: string) => { log("search input", { q: v }); setQuery(v); };
  const setSortLog = (v: SortKey) => { log("sort change", { sort: v }); setSort(v); };
  const setFilterLog = (f: ActiveFilter) => { log("filter pick", { filter: f }); setActiveFilter(f); };
  const setViewModeLog = (v: ViewMode) => { log("view change", { view: v }); setViewMode(v); };

  const deferredQuery = useDeferredValue(query);
  const thumbSet = useMemo(() => new Set(thumbSlugs), [thumbSlugs]);

  // Counts respect ONLY the text query (and not the active filter), since
  // exactly one pill is active at a time — clicking a pill replaces the
  // filter rather than narrowing within it. Each pill therefore shows "what
  // would I land on" without surprise.
  const counts = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    const matches = (t: TemplateSummary) => {
      if (!tokens.length) return true;
      return tokens.every((tok) => makeHaystack(t).includes(tok));
    };
    const byCategory = new Map<string, number>();
    categories.forEach((c) => byCategory.set(c, 0));
    const byStyle = new Map<TemplateStyle, number>();
    styles.forEach((s) => byStyle.set(s, 0));
    let all = 0;
    let picks = 0;
    for (const t of templates) {
      if (!matches(t)) continue;
      all += 1;
      if (OUR_PICKS_INDEX.has(t.slug)) picks += 1;
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + 1);
      if (t.style) byStyle.set(t.style, (byStyle.get(t.style) ?? 0) + 1);
    }
    return { all, picks, byCategory, byStyle };
  }, [templates, categories, styles, deferredQuery]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    const out = templates.filter((t) => {
      if (activeFilter?.kind === "picks" && !OUR_PICKS_INDEX.has(t.slug)) return false;
      if (activeFilter?.kind === "category" && t.category !== activeFilter.value) return false;
      if (activeFilter?.kind === "style" && t.style !== activeFilter.value) return false;
      if (!tokens.length) return true;
      return tokens.every((tok) => makeHaystack(t).includes(tok));
    });

    // Picks lock to the curated order regardless of the sort dropdown —
    // the editorial sequence IS the point of the picks. Sort applies to
    // every other filter (All / category / style).
    if (activeFilter?.kind === "picks") {
      out.sort(
        (a, b) =>
          (OUR_PICKS_INDEX.get(a.slug) ?? Infinity) -
          (OUR_PICKS_INDEX.get(b.slug) ?? Infinity),
      );
      return out;
    }

    out.sort((a, b) => {
      switch (sort) {
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        case "num-asc":
          return slugNumber(a.slug) - slugNumber(b.slug);
        case "num-desc":
          return slugNumber(b.slug) - slugNumber(a.slug);
      }
    });
    return out;
  }, [templates, deferredQuery, activeFilter, sort]);

  const useMarquee = filtered.length >= MARQUEE_THRESHOLD;
  // Picks always renders via StaticTemplateGrid (preserves editorial
  // 1D order), never via the marquee. Skip the lane computation entirely
  // when picks is active so we don't allocate 3 empty rows just to throw
  // them away.
  const picksActive = activeFilter?.kind === "picks";

  const lanes = useMemo(() => {
    if (!useMarquee || picksActive) return [];
    const rows: TemplateSummary[][] = Array.from(
      { length: MARQUEE_LANES },
      () => [],
    );
    filtered.forEach((t, i) => rows[i % MARQUEE_LANES].push(t));
    return rows;
  }, [filtered, useMarquee, picksActive]);

  // Click handlers used by both desktop sidebar AND mobile drawer.
  // The mobile drawer closes itself on filter pick so the user sees
  // the result immediately without dismissing manually. Sort / view /
  // search live in the bar itself on mobile so don't trigger close.
  const setFilterAndCloseMobile = (f: ActiveFilter) => {
    setFilterLog(f);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile top bar — hamburger + sort + view + search. Hidden on
          lg+ where the desktop sidebar takes over. Sticky so it stays
          accessible while scrolling templates. */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b-2 border-ink bg-paper px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => { log("mobile menu toggle", { open: !mobileMenuOpen }); setMobileMenuOpen(true); }}
          aria-label="Open filters menu"
          aria-expanded={mobileMenuOpen}
          className="inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] hover:bg-ink hover:text-paper"
        >
          {/* Hamburger — 3 horizontal bars. Inline SVG avoids icon-lib
              dependency (locked stack). */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <span>Filters</span>
          {activeFilter !== null && (
            <span
              className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-bold text-paper"
              aria-label="Active filter indicator"
            >
              •
            </span>
          )}
        </button>
        {/* Sort + View sit immediately next to Filters (not pushed to
            the right edge) so the three controls read as one grouped
            cluster. wrap-aware: if a third one doesn't fit they reflow
            to a second row naturally. */}
        <SortSelect
          value={sort}
          onChange={setSortLog}
          disabled={activeFilter?.kind === "picks"}
          title={
            activeFilter?.kind === "picks"
              ? "Sort is fixed to the curated order for Our picks"
              : undefined
          }
        />
        <ViewSelect
          value={viewMode}
          onChange={setViewModeLog}
        />
      </div>

      {/* Mobile drawer — full-screen sheet with all filter controls
          inside. Mounts only when open so unrendered components don't
          pay layout costs. */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-paper lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery filters"
        >
          <header className="sticky top-0 flex items-center justify-between border-b-2 border-ink bg-paper px-4 py-3">
            <span className="font-display text-xl">Filters</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close filters"
              className="font-mono text-2xl leading-none text-ink hover:text-coral"
            >
              ×
            </button>
          </header>
          <div className="space-y-3 p-4">
            <KindToggle current={kindPref} size="block" />
            <SearchToggle
              open={searchOpen}
              value={query}
              hasQuery={query.length > 0}
              onToggle={() => {
                const next = !searchOpen;
                log("search toggle (mobile)", { open: next });
                setSearchOpen(next);
                if (!next) setQuery("");
              }}
            />
            {searchOpen && (
              <SearchInput
                value={query}
                onChange={setQueryLog}
                onClose={() => {
                  log("search close via input (mobile)");
                  setSearchOpen(false);
                  setQuery("");
                }}
              />
            )}
            <p className="mb-1 px-1 pt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              Browse
            </p>
            <FilterSidebar
              categories={categories}
              styles={styles}
              counts={counts}
              active={activeFilter}
              onSelect={setFilterAndCloseMobile}
            />
          </div>
        </div>
      )}

    <div className="grid h-full w-full grid-cols-1 gap-y-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-x-0">
      <aside
        aria-label="Gallery filters"
        // On lg+ the page is bounded to viewport. Sidebar takes the grid
        // row height (= available viewport-minus-chrome) and is compact
        // enough that its content fits without scrolling. No overflow-auto
        // here so no scrollbar ever shows; if a future addition pushes the
        // content past available height, the last buttons would clip — re-
        // tighten the toolbar/buttons or drop a row instead of letting a
        // scrollbar appear. Hidden on mobile — the hamburger above owns
        // filter UX at <lg.
        className="hidden px-6 lg:block lg:px-0 lg:pb-3 lg:pl-6 lg:pr-3"
      >
        <div className="flex flex-col gap-1 pt-4 lg:h-full lg:min-h-0">
          <KindToggle current={kindPref} size="block" />
          {/* When picks is the active filter the curated order is the
              point of the view — sort + view-mode become semantic
              no-ops. Surface that visibly so users don't toggle them
              and wonder why nothing changed. */}
          <SortSelect
            value={sort}
            onChange={setSortLog}
            disabled={activeFilter?.kind === "picks"}
            title={
              activeFilter?.kind === "picks"
                ? "Sort is fixed to the curated order for Our picks"
                : undefined
            }
          />
          <ViewSelect
            value={viewMode}
            onChange={setViewModeLog}
          />
          <SearchToggle
            open={searchOpen}
            value={query}
            hasQuery={query.length > 0}
            onToggle={() => {
              const next = !searchOpen;
              log("search toggle", { open: next });
              setSearchOpen(next);
              if (!next) setQuery("");
            }}
          />
          {searchOpen && (
            <SearchInput
              value={query}
              onChange={setQueryLog}
              onClose={() => {
                log("search close via input");
                setSearchOpen(false);
                setQuery("");
              }}
            />
          )}

          <SidebarDivider />

          <p className="mb-1 px-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Browse
          </p>

          <FilterSidebar
            categories={categories}
            styles={styles}
            counts={counts}
            active={activeFilter}
            onSelect={setFilterLog}
          />
        </div>
      </aside>

      <div className="min-w-0 pb-14 lg:flex lg:flex-col lg:overflow-y-auto lg:pb-3 lg:pr-0">
        <div className="pt-4 lg:flex lg:flex-1 lg:flex-col lg:min-h-0">
          {filtered.length === 0 ? (
            <div className="mx-6 lg:mx-0">
              <div className="card p-10 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  Nothing matches
                </p>
                <p className="mt-3 font-display text-2xl">
                  {/*
                    Tailor the suggestion to which axis caused the empty:
                    picks + search → search is what's narrowing (the editorial
                    filter intent is the WHOLE point), so suggest clearing
                    just the search. Filter + no search → broaden the filter
                    (the "loosen filters" wording). Search only → clear it.
                  */}
                  {activeFilter?.kind === "picks" && deferredQuery.trim()
                    ? "No picks match your search. Try clearing it."
                    : activeFilter && !deferredQuery.trim()
                      ? "Try a different filter or pick All."
                      : !activeFilter && deferredQuery.trim()
                        ? "Try clearing the search."
                        : "Try loosening your filters or clearing the search."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    log("click Reset filters");
                    setQuery("");
                    setActiveFilter(null);
                    setSearchOpen(false);
                  }}
                  className="btn mt-6"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile-only: centered list under threshold, swipeable
                  carousel at or above. Replaces the desktop List /
                  Marquee / StaticGrid branches entirely on <lg so the
                  user gets a touch-native browsing experience. */}
              <div className="lg:hidden">
                <MobileTemplateView
                  templates={filtered}
                  thumbs={thumbSet}
                  kindPref={kindPref}
                  viewMode={viewMode}
                />
              </div>
              {/* Desktop branches (lg+) — `lg:contents` makes the wrapper
                  invisible to layout so the inner ListView /
                  MarqueeLanes / StaticTemplateGrid still participate in
                  the parent flex chain (their flex-1 / lane height
                  logic depends on this). */}
              <div className="hidden lg:contents">
                {viewMode === "list" ? (
                  // List view works for any filter — picks included.
                  // The filtered memo's curated-order sort still
                  // applies to picks, so the list renders the 18
                  // curated tiles in their editorial order, just
                  // as compact title+chip rows instead of cards.
                  <ListView
                    templates={filtered}
                    thumbs={thumbSet}
                    kindPref={kindPref}
                  />
                ) : useMarquee && activeFilter?.kind !== "picks" ? (
                  <MarqueeLanes
                    rows={lanes}
                    thumbs={thumbSet}
                    kindPref={kindPref}
                    reverseLanes={LANE_REVERSALS}
                    durations={LANE_DURATIONS}
                    // Override default `space-y-3`: on lg+, become a flex column
                    // with `justify-between` so the 3 lanes distribute the
                    // available column height — top of lane 1 at column top,
                    // bottom of lane 3 at column bottom (= sidebar's bottom).
                    className="space-y-3 lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:space-y-0"
                  />
                ) : (
                  // Static flex-wrap grid for both:
                  //  - sub-threshold filters (count < MARQUEE_THRESHOLD)
                  //  - "Our picks" (always, regardless of count — the curated
                  //    18 should sit still as an editorial grid; a marquee
                  //    would scroll them past the viewer's eye).
                  // The 240px tile width naturally lays out 6-per-row at the
                  // standard desktop content width, matching RETRO's layout.
                  <StaticTemplateGrid
                    templates={filtered}
                    thumbs={thumbSet}
                    kindPref={kindPref}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

// Extract the leading numeric prefix from a slug like "42-boutique-hotel" →
// 42, or `Number.POSITIVE_INFINITY` when none. Infinity pushes un-numbered
// slugs to the end of the numeric sort so folder templates (hero-landing,
// product-card, coming-soon) don't win the #1 slot.
function slugNumber(slug: string): number {
  const m = slug.match(/^(\d+)/);
  if (!m) return Number.POSITIVE_INFINITY;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

function SidebarDivider() {
  return <div className="my-1 border-t-2 border-ink" aria-hidden="true" />;
}

function SearchToggle({
  open,
  hasQuery,
  value,
  onToggle,
}: {
  open: boolean;
  hasQuery: boolean;
  value: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Close search" : "Open search"}
      title={hasQuery ? `Search: "${value}"` : "Search"}
      className={
        "flex h-9 w-full items-center justify-between gap-2 border-2 border-ink px-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors " +
        (open || hasQuery
          ? "bg-ink text-paper hover:bg-coral hover:text-paper"
          : "bg-paper text-ink hover:bg-soft")
      }
    >
      <span className="flex items-center gap-2">
        <SearchGlyph />
        <span>Search</span>
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-[10px] tracking-[0.2em]"
      >
        {open ? "Close" : "/"}
      </span>
    </button>
  );
}

function SearchGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="20" y1="20" x2="15.5" y2="15.5" />
    </svg>
  );
}

function SearchInput({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        /
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onClose();
          }
        }}
        placeholder="Search…"
        className="h-9 w-full border-2 border-ink bg-paper px-8 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-coral"
        aria-label="Search templates"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 border border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted hover:bg-ink hover:text-paper"
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
    </label>
  );
}

function SortSelect({
  value,
  onChange,
  disabled,
  title,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <div className="relative" title={title}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        aria-label="Sort templates"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={`h-9 w-full appearance-none border-2 border-ink bg-paper px-3 pr-9 font-mono text-[11px] uppercase tracking-[0.18em] text-ink focus:outline-none focus:ring-2 focus:ring-coral${
          disabled ? " cursor-not-allowed opacity-50" : ""
        }`}
      >
        {SORTS.map((s) => (
          <option key={s.id} value={s.id}>
            Sort · {s.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.2em]"
      >
        ▾
      </span>
    </div>
  );
}

function ViewSelect({
  value,
  onChange,
  disabled,
  title,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <div className="relative" title={title}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ViewMode)}
        aria-label="View mode"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={`h-9 w-full appearance-none border-2 border-ink bg-paper px-3 pr-9 font-mono text-[11px] uppercase tracking-[0.18em] text-ink focus:outline-none focus:ring-2 focus:ring-coral${
          disabled ? " cursor-not-allowed opacity-50" : ""
        }`}
      >
        {VIEW_MODES.map((v) => (
          <option key={v.id} value={v.id}>
            View · {v.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.2em]"
      >
        ▾
      </span>
    </div>
  );
}

function FilterSidebar({
  categories,
  styles,
  counts,
  active,
  onSelect,
}: {
  categories: string[];
  styles: TemplateStyle[];
  counts: {
    all: number;
    picks: number;
    byCategory: Map<string, number>;
    byStyle: Map<TemplateStyle, number>;
  };
  active: ActiveFilter;
  onSelect: (f: ActiveFilter) => void;
}) {
  // One flat list: Our picks (default), All, every functional category,
  // then every style — no internal labels, no group dividers. The user
  // picks any pill; selecting one replaces the previous selection. On
  // lg+ the nav grows (flex-1) inside the bounded sidebar height, and
  // each pill grows proportionally so the bottom of the last button
  // aligns with the bottom of the carousel column instead of leaving
  // empty space below RETRO. Adding the Our picks pill keeps the total
  // sidebar height fixed — every pill shrinks proportionally to fit.
  return (
    <nav
      aria-label="Filter templates"
      className="flex flex-col gap-1 lg:flex-1 lg:min-h-0"
    >
      <FilterButton
        label="Our picks"
        count={counts.picks}
        selected={active?.kind === "picks"}
        onClick={() => onSelect({ kind: "picks" })}
      />
      <FilterButton
        label="All"
        count={counts.all}
        selected={active === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((c) => (
        <FilterButton
          key={`cat-${c}`}
          label={c}
          count={counts.byCategory.get(c) ?? 0}
          selected={active?.kind === "category" && active.value === c}
          onClick={() => onSelect({ kind: "category", value: c })}
        />
      ))}
      {styles.map((s) => (
        <FilterButton
          key={`style-${s}`}
          label={s}
          count={counts.byStyle.get(s) ?? 0}
          selected={active?.kind === "style" && active.value === s}
          onClick={() => onSelect({ kind: "style", value: s })}
        />
      ))}
    </nav>
  );
}

function FilterButton({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        "flex min-h-9 w-full items-center justify-between gap-3 border-2 border-ink px-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors lg:flex-1 lg:basis-0 " +
        (selected
          ? "bg-ink text-paper"
          : "bg-paper text-ink hover:bg-soft")
      }
    >
      <span className="truncate text-left">{label}</span>
      <span
        className={
          "shrink-0 font-mono text-[10px] tabular-nums tracking-[0.1em] " +
          (selected ? "text-paper/70" : "text-muted")
        }
      >
        {count}
      </span>
    </button>
  );
}

// Mobile-only render. Below MOBILE_CAROUSEL_THRESHOLD (18) renders a
// vertical stack with each tile centered (full attention per tile).
// At or above, renders a TWO-ROW horizontally-swipeable carousel —
// no auto-scroll, the user holds and drags to flip through. Banner
// above the carousel tells them this is a swipe-driven surface so
// they don't stare at a static row wondering why nothing animates.
//
// Layout (carousel):
//   - CSS grid with grid-flow-col + grid-rows-2 → first tile lands
//     at (row 1, col 1), second at (row 2, col 1), third at (row 1,
//     col 2), etc. Each "column" is a vertical pair the user sees
//     at the same scroll position. Total grid width grows with the
//     template count; overflow-x-auto + snap-x makes the user drive
//     the scroll with their finger.
//   - Tile width 70vw (cap 280px) so the next column peeks in from
//     the right edge as a "more here" affordance.
//   - pl-5 / pr-5 + scroll-pl-5: both initial visual padding AND
//     snap-padding so the first column has breathing room from the
//     screen edge instead of flush-left.
function MobileTemplateView({
  templates,
  thumbs,
  kindPref,
  viewMode,
}: {
  templates: TemplateSummary[];
  thumbs: Set<string>;
  kindPref: TemplateKind;
  viewMode: ViewMode;
}) {
  // LIST mode — compact text-led rows. No thumbnails (those live in
  // the carousel/stack view). Tap a row to open the template in the
  // editor. Works for any filter including picks (curated order
  // preserved by the filtered memo's picks-specific sort).
  if (viewMode === "list") {
    return (
      <ul className="flex list-none flex-col px-4 pb-10">
        {templates.map((t) => (
          <MobileListRow key={t.slug} template={t} kindPref={kindPref} />
        ))}
      </ul>
    );
  }
  // CAROUSEL mode (default). Under threshold → centered vertical
  // stack of full tiles. At or above threshold → 2-row horizontal
  // swipeable carousel.
  if (templates.length < MOBILE_CAROUSEL_THRESHOLD) {
    return (
      <div className="flex flex-col items-center gap-4 px-5 pb-10">
        {templates.map((t) => (
          <div key={t.slug} className="w-full max-w-[400px]">
            <TemplateTile
              template={t}
              hasThumb={thumbs.has(t.slug)}
              kindPref={kindPref}
            />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <div
        aria-hidden="true"
        className="flex items-center justify-center gap-2 px-4 pb-2 pt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted"
      >
        <span aria-hidden="true">←</span>
        <span>Hold and swipe to scroll</span>
        <span aria-hidden="true">→</span>
      </div>
      <div
        className="grid snap-x snap-mandatory grid-flow-col grid-rows-2 gap-3 overflow-x-auto scroll-pl-5 pb-10 pl-5 pr-5"
        style={{
          // -webkit-overflow-scrolling kept as a defensive hint for older
          // iOS WebKit; modern iOS handles touch-pan natively but the
          // attribute is still respected and doesn't cost anything.
          WebkitOverflowScrolling: "touch",
        }}
      >
        {templates.map((t) => (
          <div
            key={t.slug}
            className="w-[70vw] max-w-[280px] snap-start"
          >
            <TemplateTile
              template={t}
              hasThumb={thumbs.has(t.slug)}
              kindPref={kindPref}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Mobile list-mode row — single tap-target per template. Title +
// category text, JSX/HTML chip on the right edge. Hairline divider
// between rows. Compact, text-led, no thumbnails.
function MobileListRow({
  template,
  kindPref,
}: {
  template: TemplateSummary;
  kindPref: TemplateKind;
}) {
  const editorHref =
    kindPref === "html"
      ? `/t/${template.slug}?kind=html`
      : `/t/${template.slug}`;
  return (
    <li>
      <Link
        href={editorHref}
        className="flex items-center justify-between gap-3 border-b border-ink/15 py-3.5 transition-colors hover:bg-ink/5"
      >
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-display text-base leading-tight">
            {template.title}
          </span>
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            {template.category}
          </span>
        </div>
        <span
          className={`chip shrink-0 ${template.kind === "jsx" ? "chip-accent" : ""}`}
        >
          {template.kind.toUpperCase()}
        </span>
      </Link>
    </li>
  );
}

// Below MARQUEE_THRESHOLD a marquee would loop on itself with no fresh
// content — flex-wrap grid of fixed-width tiles is the cleaner read.
function StaticTemplateGrid({
  templates,
  thumbs,
  kindPref,
}: {
  templates: TemplateSummary[];
  thumbs: ReadonlySet<string>;
  kindPref: TemplateKind;
}) {
  return (
    <ul className="flex list-none flex-wrap gap-4 px-1">
      {templates.map((t) => (
        <li key={t.slug} className="shrink-0">
          <TemplateTile
            template={t}
            hasThumb={thumbs.has(t.slug)}
            kindPref={kindPref}
            widthPx={240}
          />
        </li>
      ))}
    </ul>
  );
}


// List view — compact grid of name buttons, hover/focus reveals a floating
// TemplateTile popover with the thumbnail + Select / Preview actions.
// Cheap on initial paint (no thumbs decoded until the user hovers a row),
// great for skimming names.
function ListView({
  templates,
  thumbs,
  kindPref,
}: {
  templates: TemplateSummary[];
  thumbs: ReadonlySet<string>;
  kindPref: TemplateKind;
}) {
  return (
    <ul className="grid list-none grid-cols-1 gap-2 px-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {templates.map((t) => (
        <ListItem
          key={t.slug}
          template={t}
          hasThumb={thumbs.has(t.slug)}
          kindPref={kindPref}
        />
      ))}
    </ul>
  );
}

function ListItem({
  template,
  hasThumb,
  kindPref,
}: {
  template: TemplateSummary;
  hasThumb: boolean;
  kindPref: TemplateKind;
}) {
  return (
    <li className="group relative">
      <div
        tabIndex={0}
        aria-label={`${template.title} — hover for actions`}
        className="flex h-12 w-full cursor-default items-center justify-between gap-2 border-2 border-ink bg-paper px-3 transition-colors hover:bg-soft group-focus-within:bg-soft"
      >
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-display text-sm leading-tight">
            {template.title}
          </span>
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            {template.category}
          </span>
        </div>
        <span
          className={`chip shrink-0 ${template.kind === "jsx" ? "chip-accent" : ""}`}
        >
          {template.kind.toUpperCase()}
        </span>
      </div>

      {/* Hover/focus popover — anchored at the row's TOP-LEFT (top-0
          left-0) so it overlays the trigger button rather than sitting
          below it. With a below-the-button position the cursor had to
          cross an 8px gap (mt-2) to reach the popover, dropping the
          group-hover state mid-traverse and making the Select/Preview
          buttons unclickable. Anchored on the button, the popover area
          and the trigger area form one continuous hover region. */}
      <div className="pointer-events-none invisible absolute left-0 top-0 z-30 w-[260px] opacity-0 shadow-[6px_6px_0_0_rgba(15,15,15,0.18)] transition-opacity duration-150 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <TemplateTile
          template={template}
          hasThumb={hasThumb}
          kindPref={kindPref}
          widthPx={260}
        />
      </div>
    </li>
  );
}
