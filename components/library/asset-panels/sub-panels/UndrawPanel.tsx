"use client";

// unDraw illustrations sub-panel. Hand-curated set in
// /public/data/assets/undraw.json. Each illustration uses #6c63ff as the
// swappable accent color (unDraw's actual convention); a color picker swaps
// it at insert time. Defaults to var(--primary) so a palette change recolors.

import { useEffect, useMemo, useState } from "react";
import type { Mode } from "@/lib/asset-library/types";
import {
  buildIllustrationInsert,
  type UndrawIllustration,
} from "@/lib/asset-library/insert-illustration";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:UndrawPanel] ${msg}`, data ?? "");
}

interface Props { mode: Mode; onInsert: (text: string) => void }

const SEARCH_KEY = "dropin:undraw:search";
const COLOR_KEY = "dropin:undraw:color";

export default function UndrawPanel({ mode, onInsert }: Props) {
  const [items, setItems] = useState<UndrawIllustration[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [color, setColor] = useState<string>(() => {
    if (typeof window === "undefined") return "#6c63ff";
    return window.localStorage.getItem(COLOR_KEY) || "#6c63ff";
  });
  const [recents, setRecents] = useState<UndrawIllustration[]>([]);

  useEffect(() => {
    fetch("/data/assets/undraw.json")
      .then((r) => r.json())
      .then((d: UndrawIllustration[]) => setItems(d))
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    getRecents("undraw").then((rs) => setRecents(rs.map((r) => r.payload as UndrawIllustration)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(COLOR_KEY, color);
  }, [color]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => {
      const hay = `${i.title} ${i.tags.join(" ")} ${i.slug}`.toLowerCase();
      return q.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [items, query]);

  function handleInsert(illo: UndrawIllustration) {
    log("insert", { slug: illo.slug, color });
    onInsert(buildIllustrationInsert(illo, mode, { color }));
    pushRecent("undraw", illo.slug, illo);
    setRecents((prev) => {
      const without = prev.filter((x) => x.slug !== illo.slug);
      return [illo, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search illustrations…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-paper px-3 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Color</span>
        <input
          type="color"
          value={color.startsWith("#") ? color : "#6c63ff"}
          onChange={(e) => setColor(e.target.value)}
          aria-label="Accent color"
          className="h-6 w-10 cursor-pointer border-2 border-ink bg-paper p-0"
        />
        <button
          type="button"
          onClick={() => setColor("var(--primary, #6c63ff)")}
          className="border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] hover:bg-ink hover:text-paper"
        >
          Use palette
        </button>
        <span className="font-mono text-[9px] text-muted">{color}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {error && <p className="p-2 text-coral">{error}</p>}
        {!items && !error && (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Loading…</p>
        )}
        {items && (
          <>
            {recents.length > 0 && !query && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
                <Grid items={recents} onPick={handleInsert} />
              </div>
            )}
            <Grid items={filtered} onPick={handleInsert} />
            {filtered.length === 0 && (
              <p className="px-2 py-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                No illustrations match
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Grid({ items, onPick }: { items: UndrawIllustration[]; onPick: (i: UndrawIllustration) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((illo) => (
        <button
          key={illo.slug}
          type="button"
          onClick={() => onPick(illo)}
          title={illo.title}
          className="block w-full overflow-hidden border-2 border-ink bg-paper p-2 text-left transition-shadow hover:shadow-[3px_3px_0_0_#FF4D2E]"
        >
          <div className="aspect-[4/3] bg-soft">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={illo.viewBox}
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: illo.body }}
            />
          </div>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            {illo.title}
          </p>
        </button>
      ))}
    </div>
  );
}
