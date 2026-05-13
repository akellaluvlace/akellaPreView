"use client";

// Lucide sub-panel. Loads `/data/assets/lucide.json` once (~575KB). Search
// uses minisearch (already a dep) so 1500+ icons stay responsive across
// keystrokes. Click an icon → emit inline SVG built by `insert-icon.ts`.
//
// Keeps the icon JSON in module scope after first load so re-mounting the
// panel (tab switch) doesn't re-fetch.

import { useEffect, useMemo, useRef, useState } from "react";
import MiniSearch from "minisearch";
import type { LucideIcon, Mode } from "@/lib/asset-library/types";
import { buildIconInsert } from "@/lib/asset-library/insert-icon";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:LucidePanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

const SEARCH_KEY = "dropin:lucide:search";
const SIZE_KEY = "dropin:lucide:size";
const STROKE_KEY = "dropin:lucide:stroke";
const SIZES = [16, 20, 24, 32];
const STROKES = [1, 1.5, 2, 2.5];

let _iconsCache: LucideIcon[] | null = null;
let _searchCache: MiniSearch<LucideIcon> | null = null;

function buildSearch(icons: LucideIcon[]): MiniSearch<LucideIcon> {
  const ms = new MiniSearch<LucideIcon>({
    fields: ["name", "tags"],
    storeFields: ["name"],
    idField: "name",
    extractField: (doc, fieldName) => {
      if (fieldName === "tags") return (doc.tags || []).join(" ");
      // @ts-expect-error narrow access
      return doc[fieldName];
    },
    searchOptions: {
      prefix: true,
      fuzzy: 0.15,
      boost: { name: 3 },
    },
  });
  ms.addAll(icons);
  return ms;
}

export default function LucidePanel({ mode, onInsert }: Props) {
  const [icons, setIcons] = useState<LucideIcon[] | null>(_iconsCache);
  const searchRef = useRef<MiniSearch<LucideIcon> | null>(_searchCache);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [size, setSize] = useState<number>(() => {
    if (typeof window === "undefined") return 24;
    return Number(window.localStorage.getItem(SIZE_KEY) || 24);
  });
  const [stroke, setStroke] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return Number(window.localStorage.getItem(STROKE_KEY) || 2);
  });
  const [recents, setRecents] = useState<LucideIcon[]>([]);

  useEffect(() => {
    if (_iconsCache) return;
    fetch("/data/assets/lucide.json")
      .then((r) => r.json())
      .then((data: LucideIcon[]) => {
        _iconsCache = data;
        _searchCache = buildSearch(data);
        searchRef.current = _searchCache;
        setIcons(data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    getRecents("lucide").then((rs) =>
      setRecents(rs.map((r) => r.payload as LucideIcon))
    );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem(SIZE_KEY, String(size));
  }, [size]);
  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem(STROKE_KEY, String(stroke));
  }, [stroke]);

  const filtered = useMemo<LucideIcon[]>(() => {
    if (!icons) return [];
    const q = query.trim();
    if (!q) return icons;
    const ms = searchRef.current;
    if (!ms) return icons;
    const hits = ms.search(q, { prefix: true, fuzzy: 0.15 });
    const map = new Map(icons.map((i) => [i.name, i]));
    const out: LucideIcon[] = [];
    for (const h of hits) {
      const i = map.get(h.id as string);
      if (i) out.push(i);
    }
    return out;
  }, [icons, query]);

  function handleInsert(icon: LucideIcon) {
    log("insert lucide", { name: icon.name, mode, size, stroke });
    onInsert(buildIconInsert(icon, mode, { size, strokeWidth: stroke }));
    pushRecent("lucide", icon.name, icon);
    setRecents((prev) => {
      const without = prev.filter((x) => x.name !== icon.name);
      return [icon, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search icons…"
        aria-label="Search Lucide icons"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />

      <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-ink bg-paper px-2 py-2">
        <SegmentRow
          label="Size"
          values={SIZES.map(String)}
          value={String(size)}
          onChange={(v) => setSize(Number(v))}
        />
        <SegmentRow
          label="Stroke"
          values={STROKES.map(String)}
          value={String(stroke)}
          onChange={(v) => setStroke(Number(v))}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {error && (
          <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-coral">
            Failed to load: {error}
          </p>
        )}
        {!icons && !error && (
          <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Loading icons…
          </p>
        )}
        {icons && (
          <>
            {recents.length > 0 && !query && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                  Recent
                </p>
                <IconGrid icons={recents} size={size} stroke={stroke} onPick={handleInsert} />
              </div>
            )}
            <IconGrid
              icons={filtered.slice(0, 240)}
              size={size}
              stroke={stroke}
              onPick={handleInsert}
            />
            {filtered.length > 240 && (
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Showing 240 of {filtered.length.toLocaleString()} — refine search to narrow.
              </p>
            )}
            {filtered.length === 0 && (
              <p className="px-2 py-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                No icons match
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SegmentRow({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
        {label}
      </span>
      <div className="inline-flex overflow-hidden border-2 border-ink">
        {values.map((v) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={active}
              className={
                "px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IconGrid({
  icons,
  size: _size,
  stroke,
  onPick,
}: {
  icons: LucideIcon[];
  size: number;
  stroke: number;
  onPick: (i: LucideIcon) => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-1">
      {icons.map((icon) => (
        <button
          key={icon.name}
          type="button"
          onClick={() => onPick(icon)}
          title={icon.name}
          className="flex aspect-square items-center justify-center border border-transparent text-ink transition-colors hover:border-ink hover:bg-soft"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            // Inline icon body is trusted (built from lucide-static at build time).
            dangerouslySetInnerHTML={{ __html: icon.body }}
          />
        </button>
      ))}
    </div>
  );
}
