"use client";

// Shadows sub-panel. Loads /data/assets/shadows.json. Cards preview the
// shadow on a small swatch. Click → emits a `<style>` block + sample
// `<div>` styled with the shadow.

import { useEffect, useMemo, useState } from "react";
import type { Mode } from "@/lib/asset-library/types";
import { buildShadowInsert, type ShadowPreset } from "@/lib/asset-library/insert-decorative";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:ShadowsPanel] ${msg}`, data ?? "");
}

interface Props { mode: Mode; onInsert: (text: string) => void }

const SEARCH_KEY = "dropin:shadows:search";

export default function ShadowsPanel({ mode, onInsert }: Props) {
  const [items, setItems] = useState<ShadowPreset[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [recents, setRecents] = useState<ShadowPreset[]>([]);

  useEffect(() => {
    fetch("/data/assets/shadows.json")
      .then((r) => r.json())
      .then((d: ShadowPreset[]) => setItems(d))
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    getRecents("shadow").then((rs) => setRecents(rs.map((r) => r.payload as ShadowPreset)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => {
      const hay = `${s.name} ${s.tags.join(" ")}`.toLowerCase();
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
  }, [items, query]);

  function handleInsert(s: ShadowPreset) {
    log("insert", { id: s.id });
    onInsert(buildShadowInsert(s, mode));
    pushRecent("shadow", s.id, s);
    setRecents((prev) => {
      const without = prev.filter((x) => x.id !== s.id);
      return [s, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search shadows…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="min-h-0 flex-1 overflow-y-auto bg-soft p-3">
        {error && <p className="text-coral">{error}</p>}
        {!items && !error && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Loading…</p>}
        {items && (
          <>
            {recents.length > 0 && !query && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
                <Grid items={recents} onPick={handleInsert} />
              </div>
            )}
            <Grid items={filtered} onPick={handleInsert} />
          </>
        )}
      </div>
    </div>
  );
}

function Grid({ items, onPick }: { items: ShadowPreset[]; onPick: (s: ShadowPreset) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onPick(s)}
          title={s.name}
          className="flex flex-col items-center gap-2 border-2 border-ink bg-paper p-3 transition-colors hover:bg-soft"
        >
          <div className="h-16 w-16 rounded-md bg-white" style={{ boxShadow: s.css }} aria-hidden />
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{s.name}</p>
        </button>
      ))}
    </div>
  );
}
