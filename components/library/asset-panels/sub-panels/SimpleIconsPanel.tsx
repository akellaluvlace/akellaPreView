"use client";

// Simple Icons sub-panel. ~3400 brand logos. Renders by default at the
// brand's official hex; a "monochrome" toggle swaps fill to currentColor
// for use against dark sections. ViewBox 0 0 24 24.

import { useEffect, useMemo, useRef, useState } from "react";
import MiniSearch from "minisearch";
import type { Mode } from "@/lib/asset-library/types";
import { buildSvgIconInsert } from "@/lib/asset-library/insert-svg-icon";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:SimpleIconsPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

interface SimpleIcon { slug: string; title: string; hex: string; body: string }

const SEARCH_KEY = "dropin:simple-icons:search";
const MONO_KEY = "dropin:simple-icons:mono";
const SIZE_KEY = "dropin:simple-icons:size";
const SIZES = [16, 20, 24, 32];

let _cache: SimpleIcon[] | null = null;
let _search: MiniSearch<SimpleIcon> | null = null;

function buildSearch(icons: SimpleIcon[]) {
  const ms = new MiniSearch<SimpleIcon>({
    fields: ["title", "slug"],
    storeFields: ["slug"],
    idField: "slug",
    searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 3 } },
  });
  ms.addAll(icons);
  return ms;
}

export default function SimpleIconsPanel({ mode, onInsert }: Props) {
  const [icons, setIcons] = useState<SimpleIcon[] | null>(_cache);
  const searchRef = useRef<MiniSearch<SimpleIcon> | null>(_search);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [mono, setMono] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(MONO_KEY) === "1";
  });
  const [size, setSize] = useState<number>(() => {
    if (typeof window === "undefined") return 24;
    return Number(window.localStorage.getItem(SIZE_KEY) || 24);
  });
  const [recents, setRecents] = useState<SimpleIcon[]>([]);

  useEffect(() => {
    if (_cache) return;
    fetch("/data/assets/simple-icons.json")
      .then((r) => r.json())
      .then((d: SimpleIcon[]) => {
        _cache = d;
        _search = buildSearch(d);
        searchRef.current = _search;
        setIcons(d);
      })
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    getRecents("simple-icons").then((rs) => setRecents(rs.map((r) => r.payload as SimpleIcon)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(MONO_KEY, mono ? "1" : "0");
  }, [mono]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(SIZE_KEY, String(size));
  }, [size]);

  const filtered = useMemo<SimpleIcon[]>(() => {
    if (!icons) return [];
    const q = query.trim();
    if (!q) return icons;
    const ms = searchRef.current;
    if (!ms) return icons;
    const hits = ms.search(q, { prefix: true, fuzzy: 0.2 });
    const map = new Map(icons.map((i) => [i.slug, i]));
    const out: SimpleIcon[] = [];
    for (const h of hits) {
      const i = map.get(h.id as string);
      if (i) out.push(i);
    }
    return out;
  }, [icons, query]);

  function handleInsert(icon: SimpleIcon) {
    log("insert", { slug: icon.slug, mono });
    const color = mono ? "currentColor" : `#${icon.hex}`;
    onInsert(
      buildSvgIconInsert(
        { name: icon.slug, body: icon.body },
        mode,
        { size, viewBox: "0 0 24 24", mode: "fill", color, classPrefix: "si" }
      )
    );
    pushRecent("simple-icons", icon.slug, icon);
    setRecents((prev) => {
      const without = prev.filter((x) => x.slug !== icon.slug);
      return [icon, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search brand logos…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-ink bg-paper px-2 py-2">
        <button
          type="button"
          onClick={() => setMono((m) => !m)}
          aria-pressed={mono}
          className={
            "border-2 border-ink px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
            (mono ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
          }
        >
          {mono ? "Monochrome ON" : "Brand color"}
        </button>
        <div className="flex items-center gap-1">
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
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {error && <p className="p-2 text-coral">{error}</p>}
        {!icons && !error && <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Loading…</p>}
        {icons && (
          <>
            {recents.length > 0 && !query && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
                <Grid icons={recents} mono={mono} onPick={handleInsert} />
              </div>
            )}
            <Grid icons={filtered.slice(0, 200)} mono={mono} onPick={handleInsert} />
            {filtered.length > 200 && (
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Showing 200 of {filtered.length.toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Grid({ icons, mono, onPick }: { icons: SimpleIcon[]; mono: boolean; onPick: (i: SimpleIcon) => void }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-1">
      {icons.map((icon) => (
        <button
          key={icon.slug}
          type="button"
          onClick={() => onPick(icon)}
          title={icon.title}
          className="flex aspect-square items-center justify-center border border-transparent transition-colors hover:border-ink hover:bg-soft"
          style={{ color: mono ? undefined : `#${icon.hex}` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={26}
            height={26}
            viewBox="0 0 24 24"
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: icon.body }}
          />
        </button>
      ))}
    </div>
  );
}
