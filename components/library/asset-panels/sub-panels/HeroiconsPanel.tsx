"use client";

// Heroicons sub-panel. ~324 icons × 2 styles (outline + solid).
// Outline icons render with stroke (sw=1.5 per Heroicons convention);
// solid icons render with fill.

import { useEffect, useMemo, useRef, useState } from "react";
import MiniSearch from "minisearch";
import type { Mode } from "@/lib/asset-library/types";
import { buildSvgIconInsert } from "@/lib/asset-library/insert-svg-icon";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:HeroiconsPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

interface HeroIcon {
  name: string;
  style: "outline" | "solid";
  body: string;
}

const SEARCH_KEY = "dropin:heroicons:search";
const STYLE_KEY = "dropin:heroicons:style";
const SIZE_KEY = "dropin:heroicons:size";
const SIZES = [16, 20, 24, 32];

let _cache: HeroIcon[] | null = null;
let _search: MiniSearch<HeroIcon> | null = null;

function buildSearch(icons: HeroIcon[]) {
  const ms = new MiniSearch<HeroIcon>({
    fields: ["name"],
    storeFields: ["name", "style"],
    idField: "id",
    extractField: (doc, f) => (f === "id" ? `${doc.name}:${doc.style}` : doc.name),
    searchOptions: { prefix: true, fuzzy: 0.15 },
  });
  ms.addAll(icons);
  return ms;
}

export default function HeroiconsPanel({ mode, onInsert }: Props) {
  const [icons, setIcons] = useState<HeroIcon[] | null>(_cache);
  const searchRef = useRef<MiniSearch<HeroIcon> | null>(_search);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [style, setStyle] = useState<"outline" | "solid">(() => {
    if (typeof window === "undefined") return "outline";
    const v = window.localStorage.getItem(STYLE_KEY);
    return v === "solid" ? "solid" : "outline";
  });
  const [size, setSize] = useState<number>(() => {
    if (typeof window === "undefined") return 24;
    return Number(window.localStorage.getItem(SIZE_KEY) || 24);
  });
  const [recents, setRecents] = useState<HeroIcon[]>([]);

  useEffect(() => {
    if (_cache) return;
    fetch("/data/assets/heroicons.json")
      .then((r) => r.json())
      .then((d: HeroIcon[]) => {
        _cache = d;
        _search = buildSearch(d);
        searchRef.current = _search;
        setIcons(d);
      })
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    getRecents("heroicons").then((rs) => setRecents(rs.map((r) => r.payload as HeroIcon)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(STYLE_KEY, style);
  }, [style]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(SIZE_KEY, String(size));
  }, [size]);

  const filtered = useMemo(() => {
    if (!icons) return [];
    let base = icons.filter((i) => i.style === style);
    const q = query.trim();
    if (!q) return base;
    const ms = searchRef.current;
    if (!ms) return base;
    const hits = ms.search(q, { prefix: true, fuzzy: 0.15 });
    const wantedNames = new Set(hits.map((h) => (h.name as string)));
    return base.filter((i) => wantedNames.has(i.name));
  }, [icons, style, query]);

  function handleInsert(icon: HeroIcon) {
    log("insert", { name: icon.name, style: icon.style });
    onInsert(
      buildSvgIconInsert(
        icon,
        mode,
        icon.style === "outline"
          ? { size, viewBox: "0 0 24 24", mode: "stroke", strokeWidth: 1.5, classPrefix: "hi" }
          : { size, viewBox: "0 0 24 24", mode: "fill", classPrefix: "hi" }
      )
    );
    pushRecent("heroicons", `${icon.name}:${icon.style}`, icon);
    setRecents((prev) => {
      const without = prev.filter((x) => !(x.name === icon.name && x.style === icon.style));
      return [icon, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search heroicons…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-ink bg-paper px-2 py-2">
        <Segment label="Style" values={["outline", "solid"]} value={style} onChange={(v) => setStyle(v as "outline" | "solid")} />
        <Segment label="Size" values={SIZES.map(String)} value={String(size)} onChange={(v) => setSize(Number(v))} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {error && <p className="p-2 text-coral">{error}</p>}
        {!icons && !error && <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Loading…</p>}
        {icons && (
          <>
            {recents.length > 0 && !query && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
                <Grid icons={recents} style={style} onPick={handleInsert} />
              </div>
            )}
            <Grid icons={filtered.slice(0, 240)} style={style} onPick={handleInsert} />
            {filtered.length > 240 && (
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Showing 240 of {filtered.length}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Segment({ label, values, value, onChange }: { label: string; values: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">{label}</span>
      <div className="inline-flex overflow-hidden border-2 border-ink">
        {values.map((v) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
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

function Grid({ icons, style, onPick }: { icons: HeroIcon[]; style: "outline" | "solid"; onPick: (i: HeroIcon) => void }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-1">
      {icons.map((icon) => (
        <button
          key={`${icon.name}:${icon.style}`}
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
            fill={style === "solid" ? "currentColor" : "none"}
            stroke={style === "outline" ? "currentColor" : "none"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: icon.body }}
          />
        </button>
      ))}
    </div>
  );
}
