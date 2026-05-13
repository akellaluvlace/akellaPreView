"use client";

// Mockups sub-panel. Loads /data/assets/mockups.json. Cards preview the
// frame around a tiny placeholder image. Click → emits the mockup template
// with `{{IMAGE_SRC}}` replaced by either a user-supplied URL or a default
// Unsplash sample.

import { useEffect, useMemo, useState } from "react";
import type { Mode } from "@/lib/asset-library/types";
import { buildMockupInsert, type MockupFrame } from "@/lib/asset-library/insert-decorative";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:MockupsPanel] ${msg}`, data ?? "");
}

interface Props { mode: Mode; onInsert: (text: string) => void }

const SEARCH_KEY = "dropin:mockups:search";
const URL_KEY = "dropin:mockups:url";
const KIND_KEY = "dropin:mockups:kind";

export default function MockupsPanel({ mode, onInsert }: Props) {
  const [items, setItems] = useState<MockupFrame[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [imageUrl, setImageUrl] = useState<string>(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(URL_KEY) || ""
  );
  const [kind, setKind] = useState<MockupFrame["kind"] | "all">(() => {
    if (typeof window === "undefined") return "all";
    const v = window.localStorage.getItem(KIND_KEY) as MockupFrame["kind"] | null;
    return v && ["browser", "phone", "tablet", "laptop", "watch"].includes(v) ? v : "all";
  });
  const [recents, setRecents] = useState<MockupFrame[]>([]);

  useEffect(() => {
    fetch("/data/assets/mockups.json")
      .then((r) => r.json())
      .then((d: MockupFrame[]) => setItems(d))
      .catch((e) => setError(String(e)));
  }, []);
  useEffect(() => {
    getRecents("mockup").then((rs) => setRecents(rs.map((r) => r.payload as MockupFrame)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(URL_KEY, imageUrl);
  }, [imageUrl]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(KIND_KEY, kind);
  }, [kind]);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((m) => {
      if (kind !== "all" && m.kind !== kind) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return `${m.name} ${m.kind}`.toLowerCase().includes(q);
    });
  }, [items, query, kind]);

  function handleInsert(m: MockupFrame) {
    log("insert", { id: m.id });
    onInsert(buildMockupInsert(m, mode, imageUrl ? { imageUrl } : undefined));
    pushRecent("mockup", m.id, m);
    setRecents((prev) => {
      const without = prev.filter((x) => x.id !== m.id);
      return [m, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search mockups…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-ink/30 bg-paper px-2 py-1.5">
        {(["all", "browser", "phone", "tablet", "laptop", "watch"] as const).map((k) => {
          const active = k === kind;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={
                "shrink-0 border-2 border-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {k}
            </button>
          );
        })}
      </div>
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-paper px-3 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Image URL</span>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="(optional — uses sample)"
          className="min-w-0 flex-1 border border-ink bg-paper px-2 py-1 font-mono text-[9px] text-ink placeholder:text-muted focus:outline-none"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-soft p-3">
        {error && <p className="text-coral">{error}</p>}
        {!items && !error && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Loading…</p>}
        {items && (
          <>
            {recents.length > 0 && !query && kind === "all" && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
                <List items={recents} onPick={handleInsert} />
              </div>
            )}
            <List items={filtered} onPick={handleInsert} />
          </>
        )}
      </div>
    </div>
  );
}

function List({ items, onPick }: { items: MockupFrame[]; onPick: (m: MockupFrame) => void }) {
  return (
    <div className="space-y-2">
      {items.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onPick(m)}
          className="flex w-full items-center justify-between border-2 border-ink bg-paper px-3 py-2.5 text-left transition-colors hover:bg-soft"
        >
          <div>
            <p className="font-display text-sm leading-tight">{m.name}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{m.kind}</p>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">Insert →</span>
        </button>
      ))}
    </div>
  );
}
