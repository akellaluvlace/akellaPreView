"use client";

// Tabler sub-panel. ~5000 outline + ~1000 filled. ViewBox 0 0 24 24.
// Outline → stroke mode (default Tabler stroke=2). Filled → fill mode.

import { useEffect, useMemo, useRef, useState } from "react";
import MiniSearch from "minisearch";
import type { Mode } from "@/lib/asset-library/types";
import { buildSvgIconInsert } from "@/lib/asset-library/insert-svg-icon";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:TablerPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

interface TablerIcon { name: string; style: "outline" | "filled"; body: string }

const SEARCH_KEY = "dropin:tabler:search";
const STYLE_KEY = "dropin:tabler:style";
const SIZE_KEY = "dropin:tabler:size";
const SIZES = [16, 20, 24, 32];

let _cache: TablerIcon[] | null = null;
let _search: MiniSearch<TablerIcon> | null = null;

function buildSearch(icons: TablerIcon[]) {
  const ms = new MiniSearch<TablerIcon>({
    fields: ["name"],
    storeFields: ["name", "style"],
    idField: "id",
    extractField: (doc, f) => (f === "id" ? `${doc.name}:${doc.style}` : doc.name),
    searchOptions: { prefix: true, fuzzy: 0.15 },
  });
  ms.addAll(icons);
  return ms;
}

export default function TablerPanel({ mode, onInsert }: Props) {
  const [icons, setIcons] = useState<TablerIcon[] | null>(_cache);
  const searchRef = useRef<MiniSearch<TablerIcon> | null>(_search);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [style, setStyle] = useState<"outline" | "filled">(() => {
    if (typeof window === "undefined") return "outline";
    const v = window.localStorage.getItem(STYLE_KEY);
    return v === "filled" ? "filled" : "outline";
  });
  const [size, setSize] = useState<number>(() => {
    if (typeof window === "undefined") return 24;
    return Number(window.localStorage.getItem(SIZE_KEY) || 24);
  });
  const [recents, setRecents] = useState<TablerIcon[]>([]);

  useEffect(() => {
    if (_cache) return;
    fetch("/data/assets/tabler.json")
      .then((r) => r.json())
      .then((d: TablerIcon[]) => {
        _cache = d;
        _search = buildSearch(d);
        searchRef.current = _search;
        setIcons(d);
      })
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    getRecents("tabler").then((rs) => setRecents(rs.map((r) => r.payload as TablerIcon)));
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

  const filtered = useMemo<TablerIcon[]>(() => {
    if (!icons) return [];
    let base = icons.filter((i) => i.style === style);
    const q = query.trim();
    if (!q) return base;
    const ms = searchRef.current;
    if (!ms) return base;
    const hits = ms.search(q, { prefix: true, fuzzy: 0.15 });
    const wanted = new Set(hits.map((h) => h.name as string));
    return base.filter((i) => wanted.has(i.name));
  }, [icons, style, query]);

  function handleInsert(icon: TablerIcon) {
    log("insert", { name: icon.name, style: icon.style });
    onInsert(
      buildSvgIconInsert(
        icon,
        mode,
        icon.style === "outline"
          ? { size, viewBox: "0 0 24 24", mode: "stroke", strokeWidth: 2, classPrefix: "tabler" }
          : { size, viewBox: "0 0 24 24", mode: "fill", classPrefix: "tabler" }
      )
    );
    pushRecent("tabler", `${icon.name}:${icon.style}`, icon);
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
        placeholder="Search tabler…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-ink bg-paper px-2 py-2">
        <Segment label="Style" values={["outline", "filled"]} value={style} onChange={(v) => setStyle(v as "outline" | "filled")} />
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
                Showing 240 of {filtered.length.toLocaleString()}
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
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={
              "px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors " +
              (v === value ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
            }
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

function Grid({ icons, style, onPick }: { icons: TablerIcon[]; style: "outline" | "filled"; onPick: (i: TablerIcon) => void }) {
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
            fill={style === "filled" ? "currentColor" : "none"}
            stroke={style === "outline" ? "currentColor" : "none"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: icon.body }}
          />
        </button>
      ))}
    </div>
  );
}
