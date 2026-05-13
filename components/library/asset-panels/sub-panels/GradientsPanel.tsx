"use client";

// Gradients sub-panel. Loads /data/assets/gradients.json. Each card is a
// live preview of the gradient. Click → emits a self-contained `<style>` +
// `<div>` block applying the gradient.

import { useEffect, useMemo, useState } from "react";
import type { Mode } from "@/lib/asset-library/types";
import { buildGradientInsert, type Gradient } from "@/lib/asset-library/insert-decorative";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:GradientsPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string, opts?: { position?: "cursor" | "top" }) => void;
}

const SEARCH_KEY = "dropin:gradients:search";
const KIND_KEY = "dropin:gradients:kind";

export default function GradientsPanel({ mode, onInsert }: Props) {
  const [items, setItems] = useState<Gradient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [kind, setKind] = useState<Gradient["kind"] | "all">(() => {
    if (typeof window === "undefined") return "all";
    const v = window.localStorage.getItem(KIND_KEY);
    return (v === "linear" || v === "radial" || v === "mesh") ? v : "all";
  });
  const [recents, setRecents] = useState<Gradient[]>([]);

  useEffect(() => {
    fetch("/data/assets/gradients.json")
      .then((r) => r.json())
      .then((d: Gradient[]) => setItems(d))
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    getRecents("gradient").then((rs) => setRecents(rs.map((r) => r.payload as Gradient)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(KIND_KEY, kind);
  }, [kind]);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((g) => {
      if (kind !== "all" && g.kind !== kind) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const hay = `${g.name} ${g.tags.join(" ")} ${g.kind}`.toLowerCase();
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
  }, [items, query, kind]);

  function handleInsert(g: Gradient) {
    log("insert", { id: g.id });
    // Gradients become the page background — prepend to top so the user's
    // existing content shows ON TOP of it rather than getting a random
    // gradient block dropped mid-document.
    onInsert(buildGradientInsert(g, mode), { position: "top" });
    pushRecent("gradient", g.id, g);
    setRecents((prev) => {
      const without = prev.filter((x) => x.id !== g.id);
      return [g, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search gradients…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 gap-1 border-b-2 border-ink bg-paper px-2 py-2">
        {(["all", "linear", "radial", "mesh"] as const).map((k) => {
          const active = k === kind;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={
                "border-2 border-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {k}
            </button>
          );
        })}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {error && <p className="p-2 text-coral">{error}</p>}
        {!items && !error && <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Loading…</p>}
        {items && (
          <>
            {recents.length > 0 && !query && kind === "all" && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
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

function Grid({ items, onPick }: { items: Gradient[]; onPick: (g: Gradient) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((g) => (
        <button
          key={g.id}
          type="button"
          onClick={() => onPick(g)}
          title={g.name}
          className="block w-full overflow-hidden border-2 border-ink p-1 transition-shadow hover:shadow-[3px_3px_0_0_#FF4D2E]"
        >
          <div className="aspect-[4/3] w-full" style={{ background: g.css }} aria-hidden />
          <p className="mt-1 truncate px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{g.name}</p>
        </button>
      ))}
    </div>
  );
}
