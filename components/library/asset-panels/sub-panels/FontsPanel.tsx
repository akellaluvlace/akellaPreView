"use client";

// Fonts sub-panel. Loads the curated `/data/assets/fonts.json` allowlist.
// Each card live-previews the actual font (lazy-loaded via a single global
// Google Fonts <link> rel="stylesheet" once the card scrolls into view).
// No API key needed for browse/preview — only the upstream catalog API
// requires one, and we ship the curated list to skip that.

import { useEffect, useMemo, useRef, useState } from "react";
import type { FontDescriptor, Mode } from "@/lib/asset-library/types";
import {
  buildFontInsert,
  type FontApplyMode,
} from "@/lib/asset-library/insert-font";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:FontsPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

const SEARCH_KEY = "dropin:fonts:search";
const APPLY_KEY = "dropin:fonts:apply";

const CATEGORIES: Array<{ id: FontDescriptor["category"] | "all"; label: string }> = [
  { id: "all",         label: "All" },
  { id: "sans-serif",  label: "Sans" },
  { id: "serif",       label: "Serif" },
  { id: "display",     label: "Display" },
  { id: "handwriting", label: "Script" },
  { id: "monospace",   label: "Mono" },
];

// Font preview elements on the host page need the font itself loaded; we
// inject a single <link> per family the first time a card mounts. The set
// dedupes so scrolling quickly past 100 cards doesn't append 100 <link>s.
const _loadedFonts = new Set<string>();

function ensureFontLoaded(family: string) {
  if (typeof document === "undefined") return;
  if (_loadedFonts.has(family)) return;
  _loadedFonts.add(family);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  const fam = encodeURIComponent(family).replace(/%20/g, "+");
  link.href = `https://fonts.googleapis.com/css2?family=${fam}:wght@400;700&display=swap`;
  link.dataset.dropinFont = family;
  document.head.appendChild(link);
}

export default function FontsPanel({ mode, onInsert }: Props) {
  const [fonts, setFonts] = useState<FontDescriptor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [category, setCategory] = useState<FontDescriptor["category"] | "all">("all");
  const [applyMode, setApplyMode] = useState<FontApplyMode>(() => {
    if (typeof window === "undefined") return "global";
    const v = window.localStorage.getItem(APPLY_KEY);
    return v === "var" ? "var" : "global";
  });
  const [recents, setRecents] = useState<FontDescriptor[]>([]);

  useEffect(() => {
    fetch("/data/assets/fonts.json")
      .then((r) => r.json())
      .then((data: FontDescriptor[]) => setFonts(data))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);
  useEffect(() => {
    getRecents("font").then((rs) =>
      setRecents(rs.map((r) => r.payload as FontDescriptor))
    );
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined")
      window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem(APPLY_KEY, applyMode);
  }, [applyMode]);

  const filtered = useMemo(() => {
    if (!fonts) return [];
    const q = query.trim().toLowerCase();
    return fonts.filter((f) => {
      if (category !== "all" && f.category !== category) return false;
      if (!q) return true;
      return f.family.toLowerCase().includes(q);
    });
  }, [fonts, query, category]);

  function handleInsert(font: FontDescriptor) {
    log("insert font", { family: font.family, applyMode, mode });
    onInsert(buildFontInsert(font, mode, { applyMode }));
    pushRecent("font", font.family, font);
    setRecents((prev) => {
      const without = prev.filter((x) => x.family !== font.family);
      return [font, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search fonts…"
        aria-label="Search Google Fonts"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />

      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-ink/30 bg-paper px-2 py-1.5">
        {CATEGORIES.map((c) => {
          const active = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={
                "shrink-0 border-2 border-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-paper px-2 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
          Apply
        </span>
        <div className="inline-flex overflow-hidden border-2 border-ink">
          {(["global", "var"] as FontApplyMode[]).map((m) => {
            const active = m === applyMode;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setApplyMode(m)}
                aria-pressed={active}
                className={
                  "px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors " +
                  (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
                }
              >
                {m === "global" ? "Global (body)" : "CSS variable"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {error && (
          <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-coral">
            Failed to load: {error}
          </p>
        )}
        {!fonts && !error && (
          <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Loading fonts…
          </p>
        )}
        {fonts && (
          <>
            {recents.length > 0 && !query && category === "all" && (
              <div className="border-b border-ink/30 px-3 py-2">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                  Recent
                </p>
                {recents.map((f) => (
                  <FontCard key={`recent-${f.family}`} font={f} onInsert={handleInsert} />
                ))}
              </div>
            )}
            <div className="p-2">
              {filtered.map((f) => (
                <FontCard key={f.family} font={f} onInsert={handleInsert} />
              ))}
              {filtered.length === 0 && (
                <p className="px-2 py-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  No fonts match
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FontCard({
  font,
  onInsert,
}: {
  font: FontDescriptor;
  onInsert: (f: FontDescriptor) => void;
}) {
  // Lazy-load the font CSS only when this card scrolls into view, to avoid
  // injecting 100 Google Fonts <link>s on initial mount.
  const ref = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      ensureFontLoaded(font.family);
      setLoaded(true);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          ensureFontLoaded(font.family);
          setLoaded(true);
          obs.disconnect();
          break;
        }
      }
    }, { root: null, rootMargin: "100px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [font.family]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onInsert(font)}
      className="block w-full border-2 border-ink bg-paper px-3 py-2.5 text-left transition-colors hover:bg-soft"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          className="text-base"
          style={{
            fontFamily: loaded ? `'${font.family}', ${fallbackFor(font.category)}` : undefined,
          }}
        >
          {font.family}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
          {font.category}
        </span>
      </div>
      <div
        className="mt-1 text-lg leading-tight"
        style={{
          fontFamily: loaded ? `'${font.family}', ${fallbackFor(font.category)}` : undefined,
        }}
      >
        The quick brown fox jumps
      </div>
    </button>
  );
}

function fallbackFor(category: FontDescriptor["category"]): string {
  switch (category) {
    case "serif":       return "Georgia, serif";
    case "monospace":   return "ui-monospace, monospace";
    case "display":     return "system-ui, sans-serif";
    case "handwriting": return "cursive";
    default:            return "system-ui, sans-serif";
  }
}
