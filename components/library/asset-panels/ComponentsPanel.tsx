"use client";

// Phase-1 component library, extracted into its own panel so the new
// Sidebar shell can host it as one of four top-level tabs (Components /
// Media / Icons / Style). Behavior is unchanged — just the surrounding
// chrome (open/close, tab strip) lives in Sidebar.tsx now.
//
// All search / filter / detail-modal / pagination logic is the same as the
// original `Sidebar.tsx`; we only stripped the open-button and the outer
// `<aside>` wrapper, since both are owned by the parent shell now.

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ComponentIndex,
  ComponentMeta,
} from "@/lib/component-library/types";
import {
  getComponentIndex,
  getSearchJson,
  getComponentFull,
} from "@/lib/component-library/client";
import { loadSearchEngine, searchIds } from "@/lib/component-library/search";
import { buildInsertPayload } from "@/lib/component-library/insert";
import SearchBar from "../SearchBar";
import SourceFilter from "../SourceFilter";
import CategoryPills from "../CategoryPills";
import ComponentGrid from "../ComponentGrid";
import DetailModal from "../DetailModal";
import type { PreviewKind } from "@/lib/preview";
import type { SlotEnvelope } from "@/lib/swap/slot-capacity";
import {
  filterAndSortLibrary,
  type AssetCompat,
} from "@/lib/swap/library-filter";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:ComponentsPanel] ${msg}`, data ?? "");
}

const STATE_KEY = "dropin:component-sidebar:v1";
const PAGE_SIZE = 60;

type SourceFilterValue = "all" | string;
type SidebarStateSerialised = {
  source: SourceFilterValue;
  category: string | null;
};

interface Props {
  mode: PreviewKind;
  onInsert: (text: string) => void;
  onWarn?: (message: string) => void;
  // Thirty-third-pass — Swap auto-category routing. When set, the
  // panel's category filter is pre-applied to this value (overriding
  // the persisted user choice) on first mount AND every time
  // `initialCategoryKey` changes. The override does NOT write back to
  // the persisted state — when the swap context unmounts, the user's
  // regular browsing filter is restored. `initialCategoryKey` should
  // be the swap target's OID so a new swap session re-applies the
  // override against the latest target.
  initialCategory?: string | null;
  initialCategoryKey?: string | null;
  // Phase E proper — slot envelope drives the compatibility filter.
  // When set, the panel:
  //   1. Computes per-asset fit verdicts via `classifyAssets` using
  //      `rootClassName` from each component's index meta as the
  //      static-analysis fallback (records=null since we don't ship
  //      the puppeteer-measured `data/component-capacities.json` yet).
  //   2. Renders a "N of M fit" chip in the header.
  //   3. Sorts compatibles to the front of the grid.
  //   4. Dims incompatible cards via the `compatById` prop on the grid.
  //   5. Optional "fits only" toggle filters out incompatibles entirely.
  // Null when the iframe hasn't measured yet OR no swap is active —
  // panel renders its standard browse UI in that case.
  slotEnvelope?: SlotEnvelope | null;
}

function readSavedState(): SidebarStateSerialised | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SidebarStateSerialised;
    return parsed;
  } catch {
    return null;
  }
}

function writeSavedState(s: SidebarStateSerialised): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(s));
  } catch {}
}

export default function ComponentsPanel({
  mode,
  onInsert,
  onWarn,
  initialCategory,
  initialCategoryKey,
  slotEnvelope,
}: Props) {
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [index, setIndex] = useState<ComponentIndex | null>(null);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [source, setSource] = useState<SourceFilterValue>("all");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Hydrate persisted filter state once on mount.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const saved = readSavedState();
    if (!saved) return;
    if (saved.source) setSource(saved.source);
    if (saved.category !== undefined) setCategory(saved.category);
  }, []);

  // Thirty-third-pass — Swap auto-category override. When the host
  // (Sidebar) provides an `initialCategory` (driven by a swap context's
  // `suggestedCategory`), apply it as a one-shot override that does NOT
  // write back to localStorage. Re-applies whenever `initialCategoryKey`
  // changes — i.e. a new swap target — so the user can swap a button,
  // cancel, swap a card, and the panel filters appropriately for each.
  // The persisted-state write effect below would normally clobber the
  // override on next render; we guard it via `overrideActiveRef` so the
  // override read doesn't propagate to storage.
  const overrideActiveRef = useRef(false);
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof initialCategory === "undefined") return;
    if (initialCategoryKey === null || initialCategoryKey === undefined) return;
    // Mark the override active for this render cycle. The next
    // category change (user-initiated) will clear the flag so writes
    // resume normally.
    overrideActiveRef.current = true;
    setCategory(initialCategory);
    // Reset the override flag after the same effect's next render —
    // letting the persisted-write effect skip ONE write, then resume.
    // We use a queueMicrotask so the flag clear lands AFTER React
    // batches our setCategory + the write effect's read.
    queueMicrotask(() => {
      overrideActiveRef.current = false;
    });
  }, [initialCategory, initialCategoryKey]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (overrideActiveRef.current) return;
    writeSavedState({ source, category });
  }, [source, category]);

  // Lazy data fetch on first mount.
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    setLoadState("loading");
    (async () => {
      try {
        const [idx, searchJson] = await Promise.all([
          getComponentIndex(),
          getSearchJson(),
        ]);
        loadSearchEngine(searchJson);
        setIndex(idx);
        setLoadState("ready");
      } catch (e) {
        hasLoadedRef.current = false;
        setLoadError(e instanceof Error ? e.message : String(e));
        setLoadState("error");
      }
    })();
  }, []);

  useEffect(() => {
    if (!index) return;
    if (source !== "all" && !(source in index.sources)) setSource("all");
    if (category && !index.categories.includes(category)) setCategory(null);
  }, [index, source, category]);

  const filteredIds = useMemo(() => {
    if (!index) return new Set<string>();
    const src = index.components;
    let base: ComponentMeta[] = src;
    if (source !== "all") base = base.filter((c) => c.source === source);
    if (category) base = base.filter((c) => c.category === category);

    if (deferredQuery.trim()) {
      const ids = new Set(searchIds(deferredQuery.trim(), 500));
      const kept: ComponentMeta[] = [];
      for (const c of base) if (ids.has(c.id)) kept.push(c);
      base = kept;
    }
    return new Set(base.map((c) => c.id));
  }, [index, source, category, deferredQuery]);

  const filtered = useMemo(() => {
    if (!index) return [] as ComponentMeta[];
    const out: ComponentMeta[] = [];
    for (const c of index.components) {
      if (filteredIds.has(c.id)) out.push(c);
    }
    return out;
  }, [index, filteredIds]);

  // Phase E proper — compatibility classification. Pure-logic call to
  // `filterAndSortLibrary` against each filtered component's
  // `rootClassName` (set during `npm run ingest`). When the index was
  // generated before the rootClassName field shipped, every component's
  // fallback class is missing → everything classifies as "unknown" =
  // default-allow (the user can still pick anything, just no UX hint).
  // Sorted by "compatible-first" so the user's eye lands on usable
  // assets first.
  const classification = useMemo(() => {
    if (!slotEnvelope || filtered.length === 0) return null;
    const ids = filtered.map((c) => c.id);
    const fallbackClasses = new Map<string, string>();
    const assetCategories = new Map<string, "components">();
    for (const c of filtered) {
      if (typeof c.rootClassName === "string" && c.rootClassName.length > 0) {
        fallbackClasses.set(c.id, c.rootClassName);
      }
      // Every asset on this panel is a "components"-category slot for
      // the slot-capacity model. Refines static-analysis output's
      // `category` field for downstream tooltips.
      assetCategories.set(c.id, "components");
    }
    return filterAndSortLibrary(ids, null, slotEnvelope, {
      fallbackClasses,
      assetCategories,
      strategy: "compatible-first",
    });
  }, [filtered, slotEnvelope]);

  // id → AssetCompat lookup for ComponentGrid. Memoized off the
  // classification result so the dim/tooltip prop is stable across
  // renders that don't change the envelope or filtered list.
  const compatById = useMemo(() => {
    if (!classification) return null;
    const m = new Map<string, AssetCompat>();
    for (const c of classification.ordered) m.set(c.assetId, c);
    return m;
  }, [classification]);

  // Re-order `filtered` per the classification's compatible-first
  // ordering. Without an envelope this is a passthrough — the index's
  // natural alphabetical-by-source order is preserved.
  const sortedFiltered = useMemo<ComponentMeta[]>(() => {
    if (!classification) return filtered;
    const byId = new Map<string, ComponentMeta>(filtered.map((c) => [c.id, c]));
    const out: ComponentMeta[] = [];
    for (const c of classification.ordered) {
      const meta = byId.get(c.assetId);
      if (meta) out.push(meta);
    }
    return out;
  }, [filtered, classification]);

  // Phase E proper — "Fits only" toggle. Hides incompatibles entirely
  // when on. Default off so the user always sees the full library and
  // the dim treatment alone is the primary UX. Resets when the swap
  // session ends (envelope clears).
  const [fitsOnly, setFitsOnly] = useState(false);
  useEffect(() => {
    if (!slotEnvelope) setFitsOnly(false);
  }, [slotEnvelope]);

  const visibleList = useMemo(() => {
    if (!fitsOnly || !compatById) return sortedFiltered;
    return sortedFiltered.filter((c) => {
      const compat = compatById.get(c.id);
      return compat?.status !== "incompatible";
    });
  }, [sortedFiltered, fitsOnly, compatById]);

  useEffect(() => {
    setPage(1);
  }, [source, category, deferredQuery, slotEnvelope, fitsOnly]);

  const paginated = visibleList.slice(0, page * PAGE_SIZE);
  const hasMore = visibleList.length > paginated.length;

  const selected = useMemo(
    () =>
      selectedSlug && index
        ? index.components.find((c) => c.slug === selectedSlug) || null
        : null,
    [selectedSlug, index]
  );

  const handleInsert = useCallback(
    async (slug: string) => {
      log("click Insert", { slug, mode });
      try {
        const full = await getComponentFull(slug);
        const payload = buildInsertPayload(full, mode);
        log("inserted", { slug, bytes: payload.text.length });
        onInsert(payload.text);
        if (payload.requiredPlugins.length && onWarn) {
          onWarn(
            `Inserted component uses Tailwind plugins: ${payload.requiredPlugins.join(
              ", "
            )}. Preview uses vanilla Tailwind; custom plugins may not render.`
          );
        }
      } catch (e) {
        if (onWarn)
          onWarn(`Insert failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    },
    [mode, onInsert, onWarn]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b-2 border-ink bg-paper px-3 py-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
          {index
            ? `${filtered.length.toLocaleString()} / ${index.components.length.toLocaleString()} components`
            : "Components"}
        </span>
        {/* Phase E proper — compatibility chip + fits-only toggle.
            Visible only during a swap session WITH a measured envelope.
            The chip reads "N fit / U unknown" so users know how many
            assets are explicitly compatible vs un-classifiable (no
            rootClassName signal in the ingested index). The toggle
            hides incompatibles when the user wants to focus only on
            usable options. */}
        {classification && (
          <div className="flex shrink-0 items-center gap-2">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-coral"
              title={
                `${classification.counts.compatible} compatible · ${classification.counts.unknown} unknown · ${classification.counts.incompatible} won't fit`
              }
            >
              {classification.counts.compatible} fit
              {classification.counts.unknown > 0 &&
                ` · ${classification.counts.unknown}?`}
            </span>
            <label className="flex shrink-0 cursor-pointer items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink">
              <input
                type="checkbox"
                checked={fitsOnly}
                onChange={(e) => {
                  log("toggle fits-only", { next: e.target.checked });
                  setFitsOnly(e.target.checked);
                }}
                className="h-3 w-3 cursor-pointer accent-coral"
              />
              Fits only
            </label>
          </div>
        )}
      </div>

      <SearchBar
        value={query}
        onChange={(v) => {
          log("search", { q: v });
          setQuery(v);
        }}
      />

      <SourceFilter
        value={source}
        sources={index?.sources ?? {}}
        onChange={(v) => {
          log("source filter", { v });
          setSource(v);
        }}
      />

      <CategoryPills
        active={category}
        categories={index?.categories ?? []}
        onSelect={(c) => {
          log("category filter", { c });
          setCategory(c);
        }}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loadState === "loading" && (
          <p className="p-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Loading library…
          </p>
        )}
        {loadState === "error" && (
          <div className="p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-coral">
              Library failed to load
            </p>
            <p className="mt-2 text-xs text-ink/70">{loadError}</p>
            <p className="mt-4 text-xs text-ink/70">
              Run <code className="font-mono text-coral">npm run ingest</code> to
              build <code className="font-mono">/public/data/components</code>.
            </p>
          </div>
        )}
        {loadState === "ready" && (
          <>
            <ComponentGrid
              components={paginated}
              onSelect={(slug) => {
                log("click View (open detail)", { slug });
                setSelectedSlug(slug);
              }}
              onInsert={handleInsert}
              compatById={compatById}
            />
            {hasMore && (
              <div className="flex items-center justify-center px-4 py-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="border-2 border-ink bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper"
                >
                  Load more ({visibleList.length - paginated.length} left)
                </button>
              </div>
            )}
            {visibleList.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {fitsOnly && filtered.length > 0
                    ? "No components fit this slot"
                    : "No components match"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSource("all");
                    setCategory(null);
                    setFitsOnly(false);
                  }}
                  className="mt-4 border-2 border-ink bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper"
                >
                  Reset filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <DetailModal
          meta={selected}
          mode={mode}
          onClose={() => setSelectedSlug(null)}
          onInsert={async () => {
            await handleInsert(selected.slug);
            setSelectedSlug(null);
          }}
        />
      )}
    </div>
  );
}
