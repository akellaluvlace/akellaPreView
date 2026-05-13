"use client";

// Emoji sub-panel. Loads `/data/assets/emoji.json` once, renders the full
// set in a tight grid grouped by category. Click → insert at cursor.
// Skin-tone modifier picker for emoji that support it (small palette
// row that appears when one is selected).

import { useEffect, useMemo, useState } from "react";
import type { EmojiRecord, Mode } from "@/lib/asset-library/types";
import {
  buildEmojiInsert,
  type SkinTone,
} from "@/lib/asset-library/insert-emoji";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:EmojiPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

const SEARCH_KEY = "dropin:emoji:search";
const TONE_KEY = "dropin:emoji:tone";
const TONES: Array<{ id: SkinTone | null; swatch: string; label: string }> = [
  { id: null,            swatch: "transparent", label: "default" },
  { id: "light",         swatch: "#f7d6b4",     label: "light" },
  { id: "medium-light",  swatch: "#e0bb95",     label: "medium-light" },
  { id: "medium",        swatch: "#bf8f6a",     label: "medium" },
  { id: "medium-dark",   swatch: "#8d5a3c",     label: "medium-dark" },
  { id: "dark",          swatch: "#52332b",     label: "dark" },
];

export default function EmojiPanel({ mode: _mode, onInsert }: Props) {
  const [emojis, setEmojis] = useState<EmojiRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [tone, setTone] = useState<SkinTone | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(TONE_KEY);
    if (!raw || raw === "null") return null;
    return raw as SkinTone;
  });
  const [recents, setRecents] = useState<EmojiRecord[]>([]);

  useEffect(() => {
    fetch("/data/assets/emoji.json")
      .then((r) => r.json())
      .then((data: EmojiRecord[]) => setEmojis(data))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    getRecents("emoji").then((rs) =>
      setRecents(rs.map((r) => r.payload as EmojiRecord))
    );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem(TONE_KEY, tone || "null");
  }, [tone]);

  const groups = useMemo(() => {
    if (!emojis) return [] as Array<{ slug: string; name: string }>;
    const seen = new Set<string>();
    const out: Array<{ slug: string; name: string }> = [];
    for (const e of emojis) {
      if (seen.has(e.group)) continue;
      seen.add(e.group);
      out.push({ slug: e.group, name: e.groupName });
    }
    return out;
  }, [emojis]);

  const filtered = useMemo(() => {
    if (!emojis) return [];
    const q = query.trim().toLowerCase();
    return emojis.filter((e) => {
      if (activeGroup && e.group !== activeGroup) return false;
      if (!q) return true;
      const hay = `${e.name} ${e.slug}`.toLowerCase();
      return q.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [emojis, query, activeGroup]);

  function handleInsert(e: EmojiRecord) {
    const text = buildEmojiInsert(e.char, { tone, supportsTone: e.skinTone });
    log("insert emoji", { char: e.char, tone, withTone: text });
    onInsert(text);
    pushRecent("emoji", e.char, e);
    setRecents((prev) => {
      const without = prev.filter((x) => x.char !== e.char);
      return [e, ...without].slice(0, 12);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(ev) => setQuery(ev.target.value)}
        placeholder="Search emoji…"
        aria-label="Search emoji"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />

      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-ink/30 bg-paper px-2 py-1.5">
        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
          Tone
        </span>
        {TONES.map((t) => {
          const active = t.id === tone;
          const isDefault = t.id === null;
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => setTone(t.id)}
              title={t.label}
              aria-pressed={active}
              className={
                "h-5 w-5 shrink-0 border-2 transition-colors " +
                (active ? "border-ink" : "border-transparent") +
                (isDefault ? " bg-paper text-[9px] font-bold text-ink/60" : "")
              }
              style={isDefault ? undefined : { backgroundColor: t.swatch }}
            >
              {isDefault ? "—" : ""}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 gap-1 overflow-x-auto border-b-2 border-ink bg-paper px-2 py-2">
        <button
          type="button"
          onClick={() => setActiveGroup(null)}
          className={
            "shrink-0 border-2 border-ink px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] " +
            (activeGroup === null
              ? "bg-ink text-paper"
              : "bg-paper text-ink hover:bg-soft")
          }
        >
          All
        </button>
        {groups.map((g) => {
          const active = activeGroup === g.slug;
          return (
            <button
              key={g.slug}
              type="button"
              onClick={() => setActiveGroup(g.slug)}
              className={
                "shrink-0 border-2 border-ink px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {g.name}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {error && (
          <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-coral">
            Failed to load: {error}
          </p>
        )}
        {!emojis && !error && (
          <p className="p-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Loading emoji…
          </p>
        )}
        {emojis && (
          <>
            {recents.length > 0 && !query && !activeGroup && (
              <div className="mb-3 border-b border-ink/30 pb-3">
                <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                  Recent
                </p>
                <Grid emojis={recents} onPick={handleInsert} />
              </div>
            )}
            <Grid emojis={filtered.slice(0, 600)} onPick={handleInsert} />
            {filtered.length > 600 && (
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Showing first 600 — refine search to narrow.
              </p>
            )}
            {filtered.length === 0 && (
              <p className="px-2 py-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                No emoji match
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Grid({
  emojis,
  onPick,
}: {
  emojis: EmojiRecord[];
  onPick: (e: EmojiRecord) => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(28px,1fr))] gap-0.5">
      {emojis.map((e, i) => (
        <button
          key={`${e.char}-${i}`}
          type="button"
          onClick={() => onPick(e)}
          title={e.name}
          className="flex h-8 items-center justify-center rounded-sm text-xl leading-none transition-colors hover:bg-soft"
        >
          {e.char}
        </button>
      ))}
    </div>
  );
}
