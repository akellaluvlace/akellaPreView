"use client";

// Patterns sub-panel. Loads /data/assets/decorative-svgs.json and splits
// into three internal sub-tabs: Patterns / Waves / Blobs. Each filters by
// the `kind` field. Click → emits the appropriate insert per kind via
// `buildDecorativeInsert`.

import { useEffect, useMemo, useState } from "react";
import type { Mode } from "@/lib/asset-library/types";
import {
  buildDecorativeInsert,
  type DecorativeSvg,
} from "@/lib/asset-library/insert-decorative";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:PatternsPanel] ${msg}`, data ?? "");
}

interface Props { mode: Mode; onInsert: (text: string) => void }

const KIND_KEY = "dropin:patterns:kind";
const SEARCH_KEY = "dropin:patterns:search";
type Kind = "pattern" | "wave" | "blob";
const TABS: Array<{ id: Kind; label: string }> = [
  { id: "pattern", label: "Patterns" },
  { id: "wave",    label: "Waves" },
  { id: "blob",    label: "Blobs" },
];

export default function PatternsPanel({ mode, onInsert }: Props) {
  const [items, setItems] = useState<DecorativeSvg[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>(() => {
    if (typeof window === "undefined") return "pattern";
    const v = window.localStorage.getItem(KIND_KEY);
    return (v === "wave" || v === "blob") ? v : "pattern";
  });
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [color, setColor] = useState<string>("#6c63ff");
  const [recents, setRecents] = useState<DecorativeSvg[]>([]);

  useEffect(() => {
    fetch("/data/assets/decorative-svgs.json")
      .then((r) => r.json())
      .then((d: DecorativeSvg[]) => setItems(d))
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    getRecents("pattern").then((rs) => setRecents(rs.map((r) => r.payload as DecorativeSvg)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(KIND_KEY, kind);
  }, [kind]);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((s) => {
      if (s.kind !== kind) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const hay = `${s.name} ${(s.tags || []).join(" ")}`.toLowerCase();
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
  }, [items, kind, query]);

  function handleInsert(svg: DecorativeSvg) {
    log("insert", { id: svg.id, kind: svg.kind });
    onInsert(buildDecorativeInsert(svg, mode, { color, asBackground: svg.kind === "pattern" }));
    pushRecent("pattern", svg.id, svg);
    setRecents((prev) => {
      const without = prev.filter((x) => x.id !== svg.id);
      return [svg, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1 border-b-2 border-ink bg-paper px-2 py-1.5">
        {TABS.map((t) => {
          const active = t.id === kind;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setKind(t.id)}
              className={
                "border-2 border-ink px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${kind}s…`}
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 items-center gap-2 border-b border-ink/30 bg-paper px-3 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Color</span>
        <input
          type="color"
          value={color.startsWith("#") ? color : "#6c63ff"}
          onChange={(e) => setColor(e.target.value)}
          aria-label="Pattern color"
          className="h-5 w-8 cursor-pointer border-2 border-ink p-0"
        />
        <button
          type="button"
          onClick={() => setColor("var(--primary, #6c63ff)")}
          className="border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] hover:bg-ink hover:text-paper"
        >
          Use palette
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {error && <p className="p-2 text-coral">{error}</p>}
        {!items && !error && <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Loading…</p>}
        {items && (
          <>
            {recents.length > 0 && !query && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
                <Grid items={recents.filter((r) => r.kind === kind)} color={color} onPick={handleInsert} />
              </div>
            )}
            <Grid items={filtered} color={color} onPick={handleInsert} />
          </>
        )}
      </div>
    </div>
  );
}

function Grid({
  items,
  color,
  onPick,
}: {
  items: DecorativeSvg[];
  color: string;
  onPick: (s: DecorativeSvg) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((svg) => {
        const recolored = svg.body.replace(/#6c63ff/gi, color.startsWith("var(") ? "#6c63ff" : color);
        return (
          <button
            key={svg.id}
            type="button"
            onClick={() => onPick(svg)}
            title={svg.name}
            className="block w-full overflow-hidden border-2 border-ink bg-paper p-1 transition-shadow hover:shadow-[3px_3px_0_0_#FF4D2E]"
          >
            <div className="aspect-[4/3] w-full bg-soft">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={svg.viewBox}
                preserveAspectRatio={svg.preserveAspectRatio || undefined}
                className="h-full w-full"
                dangerouslySetInnerHTML={{ __html: recolored }}
              />
            </div>
            <p className="mt-1 truncate px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{svg.name}</p>
          </button>
        );
      })}
    </div>
  );
}
