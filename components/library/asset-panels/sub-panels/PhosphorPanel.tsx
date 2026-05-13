"use client";

// Phosphor sub-panel. Six weights, lazy-loaded per weight (each weight is a
// 600-870KB JSON). Initial mount fetches just the regular weight; switching
// weights triggers a fetch the first time. ViewBox is Phosphor's 0 0 256 256.

import { useEffect, useMemo, useRef, useState } from "react";
import MiniSearch from "minisearch";
import type { Mode } from "@/lib/asset-library/types";
import { buildSvgIconInsert } from "@/lib/asset-library/insert-svg-icon";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:PhosphorPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

interface PhosphorIcon { name: string; body: string }
type Weight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

const WEIGHTS: Weight[] = ["thin", "light", "regular", "bold", "fill", "duotone"];
const SEARCH_KEY = "dropin:phosphor:search";
const WEIGHT_KEY = "dropin:phosphor:weight";
const SIZE_KEY = "dropin:phosphor:size";
const SIZES = [16, 20, 24, 32];

// Per-weight cache keyed by weight name.
const _cache: Partial<Record<Weight, PhosphorIcon[]>> = {};
const _searchCache: Partial<Record<Weight, MiniSearch<PhosphorIcon>>> = {};

function buildSearch(icons: PhosphorIcon[]) {
  const ms = new MiniSearch<PhosphorIcon>({
    fields: ["name"],
    storeFields: ["name"],
    idField: "name",
    searchOptions: { prefix: true, fuzzy: 0.15 },
  });
  ms.addAll(icons);
  return ms;
}

export default function PhosphorPanel({ mode, onInsert }: Props) {
  const [weight, setWeight] = useState<Weight>(() => {
    if (typeof window === "undefined") return "regular";
    const v = window.localStorage.getItem(WEIGHT_KEY);
    return WEIGHTS.includes(v as Weight) ? (v as Weight) : "regular";
  });
  const [icons, setIcons] = useState<PhosphorIcon[] | null>(_cache[weight] ?? null);
  const searchRef = useRef<MiniSearch<PhosphorIcon> | null>(_searchCache[weight] ?? null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [size, setSize] = useState<number>(() => {
    if (typeof window === "undefined") return 24;
    return Number(window.localStorage.getItem(SIZE_KEY) || 24);
  });
  const [recents, setRecents] = useState<Array<PhosphorIcon & { weight: Weight }>>([]);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(WEIGHT_KEY, weight);
    if (_cache[weight]) {
      setIcons(_cache[weight]!);
      searchRef.current = _searchCache[weight] ?? null;
      return;
    }
    setIcons(null);
    setError(null);
    fetch(`/data/assets/phosphor-${weight}.json`)
      .then((r) => r.json())
      .then((d: PhosphorIcon[]) => {
        _cache[weight] = d;
        _searchCache[weight] = buildSearch(d);
        searchRef.current = _searchCache[weight]!;
        setIcons(d);
      })
      .catch((e) => setError(String(e)));
  }, [weight]);

  useEffect(() => {
    getRecents("phosphor").then((rs) =>
      setRecents(rs.map((r) => r.payload as PhosphorIcon & { weight: Weight }))
    );
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(SIZE_KEY, String(size));
  }, [size]);

  const filtered = useMemo<PhosphorIcon[]>(() => {
    if (!icons) return [];
    const q = query.trim();
    if (!q) return icons;
    const ms = searchRef.current;
    if (!ms) return icons;
    const hits = ms.search(q, { prefix: true, fuzzy: 0.15 });
    const map = new Map(icons.map((i) => [i.name, i]));
    const out: PhosphorIcon[] = [];
    for (const h of hits) {
      const i = map.get(h.id as string);
      if (i) out.push(i);
    }
    return out;
  }, [icons, query]);

  function handleInsert(icon: PhosphorIcon) {
    log("insert", { name: icon.name, weight });
    // Phosphor "fill" and most non-stroke weights use fill mode; the
    // outline-y weights (thin/light/regular/bold) use stroke. We simplify:
    // all phosphor weights render via fill mode since the package's SVG
    // bodies bake in the stroke-vs-fill choice.
    onInsert(
      buildSvgIconInsert(icon, mode, {
        size,
        viewBox: "0 0 256 256",
        mode: "fill",
        classPrefix: "ph",
      })
    );
    pushRecent("phosphor", `${icon.name}:${weight}`, { ...icon, weight });
    setRecents((prev) => {
      const without = prev.filter((x) => !(x.name === icon.name && x.weight === weight));
      return [{ ...icon, weight }, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search phosphor…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-ink/30 bg-paper px-2 py-1.5">
        {WEIGHTS.map((w) => {
          const active = w === weight;
          return (
            <button
              key={w}
              type="button"
              onClick={() => setWeight(w)}
              className={
                "shrink-0 border-2 border-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {w}
            </button>
          );
        })}
      </div>
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-paper px-2 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Size</span>
        <div className="inline-flex overflow-hidden border-2 border-ink">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={
                "px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors " +
                (s === size ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {error && <p className="p-2 text-coral">{error}</p>}
        {!icons && !error && (
          <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Loading {weight} weight…
          </p>
        )}
        {icons && (
          <>
            {recents.length > 0 && !query && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
                <Grid icons={recents} onPick={(i) => handleInsert(i)} />
              </div>
            )}
            <Grid icons={filtered.slice(0, 240)} onPick={handleInsert} />
            {filtered.length > 240 && (
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Showing 240 of {filtered.length.toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Grid({ icons, onPick }: { icons: PhosphorIcon[]; onPick: (i: PhosphorIcon) => void }) {
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
            viewBox="0 0 256 256"
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: icon.body }}
          />
        </button>
      ))}
    </div>
  );
}
