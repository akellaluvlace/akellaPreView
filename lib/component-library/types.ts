// Shared types for the component-library feature. Authored by the client side
// (for typing fetch results) and produced by the Node-side ingestion scripts
// (keyed off the same shapes via JSDoc in the .mjs files — no codegen needed).

export type ComponentSource = "uiverse" | "hyperui" | (string & {});

// Lightweight card-friendly metadata — the array of these lives in
// `/public/data/components/index.json` and is what the sidebar loads on first
// open. `html` and `css` are intentionally omitted here; fetch them lazily
// from `/public/data/components/<slug>.json` on detail view / insert.
export interface ComponentMeta {
  id: string;
  slug: string;
  title: string;
  category: string;
  source: ComponentSource;
  tags: string[];
  author: string | null;
  authorUrl: string | null;
  sourceUrl: string;
  license: string;
  // Informational only — the preview iframe always has Tailwind available, so
  // this doesn't drive any runtime logic. Kept for badge display + phase-2
  // filtering (e.g. "Tailwind required" chip on HyperUI cards).
  tailwindRequired: boolean;
  // Subset of Tailwind plugins an insert needs (`forms`, `typography`,
  // `container-queries`, etc). Empty array = vanilla Tailwind is enough.
  tailwindPlugins: string[];
  thumbUrl: string;
  hasCss: boolean;
  // HyperUI's "dark variant" flag — both dark and light variants exist as
  // independent records; this just tags which one this is. Rendered as a badge.
  darkVariant: boolean;
  // Phase E proper — root element's class attribute, captured at ingest
  // time. The runtime LibraryModal compatibility filter feeds this through
  // `inferCapacityFromClasses` to compute width/height bounds + flex
  // behavior + aspect-ratio so the "fits this slot" decision is consistent
  // across the pipeline. Optional for backward-compat with index.json
  // versions ingested before this field was added — when absent the
  // filter falls back to "unknown" classification (default-allow). null
  // means "ingest ran but no class signal" (e.g., bare `<button>` with no
  // class).
  rootClassName?: string | null;
}

export interface ComponentFull extends ComponentMeta {
  html: string;
  // CSS pre-scoped at ingest time with `__UIV_SCOPE__` as the prefix
  // placeholder. `scope.ts` swaps it for a random per-insert id at runtime so
  // two inserts of the same Uiverse component never collide.
  css: string | null;
}

export interface ComponentIndex {
  generatedAt: string;
  components: ComponentMeta[];
  // Per-source count, e.g. `{ uiverse: 3421, hyperui: 342 }`. Used by the
  // source filter to show the "N in source" hint.
  sources: Record<string, number>;
  // Full taxonomy present in the data — the UI builds category pills off this
  // so we don't have to hardcode the list on the client.
  categories: string[];
  // Sorted list of Tailwind plugins encountered across every variant — used
  // if we ever want a plugin-filter chip.
  tailwindPlugins: string[];
}
