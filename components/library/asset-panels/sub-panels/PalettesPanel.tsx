"use client";

// Palettes sub-panel. Loads the static `/data/assets/palettes.json` once,
// renders mood-filterable cards, and emits an insert payload built by
// `lib/asset-library/insert-palette.ts` (a `<style>` block that sets the
// 7-token CSS variables on `:root`).

import { useEffect, useMemo, useState } from "react";
import type { Mode, Palette } from "@/lib/asset-library/types";
import { buildPaletteInsert } from "@/lib/asset-library/insert-palette";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:PalettesPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string, opts?: { position?: "cursor" | "top" }) => void;
}

const MOODS: Array<{ id: Palette["mood"] | "all"; label: string }> = [
  { id: "all",     label: "All" },
  { id: "vibrant", label: "Vibrant" },
  { id: "muted",   label: "Muted" },
  { id: "dark",    label: "Dark" },
  { id: "pastel",  label: "Pastel" },
];

const SEARCH_KEY = "dropin:palettes:search";

export default function PalettesPanel({ mode, onInsert }: Props) {
  const [palettes, setPalettes] = useState<Palette[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [mood, setMood] = useState<Palette["mood"] | "all">("all");
  const [recents, setRecents] = useState<Palette[]>([]);

  useEffect(() => {
    fetch("/data/assets/palettes.json")
      .then((r) => r.json())
      .then((data: Palette[]) => setPalettes(data))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    getRecents("palette").then((rs) =>
      setRecents(rs.map((r) => r.payload as Palette))
    );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SEARCH_KEY, query);
    }
  }, [query]);

  const filtered = useMemo(() => {
    if (!palettes) return [];
    const q = query.trim().toLowerCase();
    return palettes.filter((p) => {
      if (mood !== "all" && p.mood !== mood) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.tags.join(" ")} ${p.mood}`.toLowerCase();
      return q.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [palettes, query, mood]);

  function handleInsert(p: Palette) {
    log("insert palette", { id: p.id, mode });
    // Palettes affect the whole page — prepend to top so they sit cleanly
    // above any user content rather than landing as a "random section"
    // wherever the cursor happens to be.
    onInsert(buildPaletteInsert(p, mode), { position: "top" });
    pushRecent("palette", p.id, p);
    setRecents((prev) => {
      const without = prev.filter((x) => x.id !== p.id);
      return [p, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search palettes…"
        aria-label="Search palettes"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b-2 border-ink bg-paper px-2 py-2">
        {MOODS.map((m) => {
          const active = m.id === mood;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMood(m.id)}
              className={
                "shrink-0 border-2 border-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {error && (
          <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-coral">
            Failed to load: {error}
          </p>
        )}
        {!palettes && !error && (
          <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Loading palettes…
          </p>
        )}
        {palettes && (
          <>
            {recents.length > 0 && !query && mood === "all" && (
              <div className="border-b border-ink/30 px-3 py-2">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                  Recent
                </p>
                <div className="space-y-2">
                  {recents.map((p) => (
                    <PaletteCard key={`recent-${p.id}`} palette={p} onInsert={handleInsert} />
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2 p-3">
              {filtered.map((p) => (
                <PaletteCard key={p.id} palette={p} onInsert={handleInsert} />
              ))}
              {filtered.length === 0 && (
                <p className="px-2 py-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  No palettes match
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PaletteCard({
  palette,
  onInsert,
}: {
  palette: Palette;
  onInsert: (p: Palette) => void;
}) {
  const order: Array<keyof Palette["colors"]> = [
    "background",
    "muted",
    "border",
    "secondary",
    "primary",
    "accent",
    "foreground",
  ];
  return (
    <button
      type="button"
      onClick={() => onInsert(palette)}
      className="block w-full border-2 border-ink bg-paper p-2 text-left transition-colors hover:bg-soft"
      title={`Apply palette "${palette.name}"`}
    >
      <div className="flex h-7 overflow-hidden rounded-sm border border-ink/30">
        {order.map((k) => (
          <div
            key={k}
            className="flex-1"
            style={{ backgroundColor: palette.colors[k] }}
            aria-hidden
          />
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="font-display text-sm leading-tight">{palette.name}</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
          {palette.mood}
        </span>
      </div>
    </button>
  );
}
