"use client";

// Pexels Videos sub-panel. Same scaffolding as PexelsPhotos. Each result
// shows a poster image; click → emits an `<video autoplay loop muted ...>`
// snippet at the chosen quality (sd/hd/uhd).

import { useEffect, useMemo, useRef, useState } from "react";
import type { Mode, NotConfigured } from "@/lib/asset-library/types";
import {
  buildPexelsVideoInsert,
  type PexelsVideo,
  type PexelsVideoResolution,
} from "@/lib/asset-library/insert-pexels-video";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:PexelsVideosPanel] ${msg}`, data ?? "");
}

interface Props { mode: Mode; onInsert: (text: string) => void }

const SEARCH_KEY = "dropin:pexels-videos:search";
const RES_KEY = "dropin:pexels-videos:res";
const RESOLUTIONS: PexelsVideoResolution[] = ["sd", "hd", "uhd"];

type FetchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; videos: PexelsVideo[]; total: number }
  | { kind: "empty" }
  | { kind: "rate-limited" }
  | { kind: "unauthorized" }
  | { kind: "error"; detail: string }
  | { kind: "not-configured"; info: NotConfigured };

export default function PexelsVideosPanel({ mode, onInsert }: Props) {
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [resolution, setResolution] = useState<PexelsVideoResolution>(() => {
    if (typeof window === "undefined") return "hd";
    const v = window.localStorage.getItem(RES_KEY);
    return (RESOLUTIONS.includes(v as PexelsVideoResolution) ? (v as PexelsVideoResolution) : "hd");
  });
  const [state, setState] = useState<FetchState>({ kind: "idle" });
  const [recents, setRecents] = useState<PexelsVideo[]>([]);
  const inflightRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(RES_KEY, resolution);
  }, [resolution]);
  useEffect(() => {
    getRecents("pexels-video").then((rs) => setRecents(rs.map((r) => r.payload as PexelsVideo)));
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setState({ kind: "idle" }); return; }
    const id = setTimeout(() => doSearch(q), 250);
    return () => clearTimeout(id);
  }, [query]);

  async function doSearch(q: string) {
    if (inflightRef.current) inflightRef.current.abort();
    const ctrl = new AbortController();
    inflightRef.current = ctrl;
    setState({ kind: "loading" });

    try {
      const res = await fetch(`/api/assets/pexels-videos?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
      const body = await res.json();
      if (res.status === 503 && body.configured === false) {
        setState({ kind: "not-configured", info: body as NotConfigured });
        return;
      }
      if (res.status === 401) { setState({ kind: "unauthorized" }); return; }
      if (res.status === 429) { setState({ kind: "rate-limited" }); return; }
      if (!res.ok) { setState({ kind: "error", detail: `${res.status}` }); return; }
      const videos = (body.videos || []) as PexelsVideo[];
      if (!videos.length) { setState({ kind: "empty" }); return; }
      setState({ kind: "ready", videos, total: body.total });
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setState({ kind: "error", detail: e instanceof Error ? e.message : String(e) });
    }
  }

  function handleInsert(video: PexelsVideo) {
    log("insert", { id: video.id, resolution });
    onInsert(buildPexelsVideoInsert(video, mode, { resolution }));
    pushRecent("pexels-video", String(video.id), video);
    setRecents((prev) => {
      const without = prev.filter((x) => x.id !== video.id);
      return [video, ...without].slice(0, 12);
    });
  }

  const showRecents = useMemo(
    () => state.kind === "idle" && recents.length > 0,
    [state.kind, recents.length]
  );

  return (
    <div className="flex h-full flex-col">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Pexels videos…"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-paper px-2 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Quality</span>
        <div className="inline-flex overflow-hidden border-2 border-ink">
          {RESOLUTIONS.map((r) => {
            const active = r === resolution;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setResolution(r)}
                className={
                  "px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors " +
                  (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
                }
              >
                {r}
              </button>
            );
          })}
        </div>
        {resolution === "uhd" && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-coral">Large file</span>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {state.kind === "not-configured" && <SetupCard info={state.info} />}
        {state.kind === "unauthorized" && <Notice tone="error" title="Pexels API key rejected" body="Re-check PEXELS_API_KEY in .env.local." />}
        {state.kind === "rate-limited" && <Notice tone="warn" title="Rate limit reached" body="Pexels free tier: 200 req/hour. Wait and retry." />}
        {state.kind === "error" && <Notice tone="error" title="Search failed" body={state.detail} />}
        {state.kind === "loading" && <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Searching…</p>}
        {state.kind === "empty" && <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">No matches.</p>}
        {state.kind === "idle" && !showRecents && (
          <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Type to search Pexels videos.</p>
        )}
        {showRecents && (
          <div className="border-b border-ink/30 px-3 py-2">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">Recent</p>
            <Grid videos={recents} onPick={handleInsert} />
          </div>
        )}
        {state.kind === "ready" && (
          <div className="p-2">
            <Grid videos={state.videos} onPick={handleInsert} />
          </div>
        )}
      </div>
    </div>
  );
}

function Grid({ videos, onPick }: { videos: PexelsVideo[]; onPick: (v: PexelsVideo) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {videos.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onPick(v)}
          title={`Video by ${v.user.name} · ${v.duration}s`}
          className="group block overflow-hidden border-2 border-ink bg-paper text-left transition-shadow hover:shadow-[3px_3px_0_0_#FF4D2E]"
        >
          <div className="relative aspect-[16/9] bg-soft">
            <img src={v.image} alt={`Video by ${v.user.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute bottom-1 right-1 bg-ink/80 px-1.5 py-0.5 font-mono text-[9px] text-paper">{v.duration}s</span>
          </div>
          <div className="px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">by {v.user.name}</div>
        </button>
      ))}
    </div>
  );
}

function SetupCard({ info }: { info: NotConfigured }) {
  return (
    <div className="m-3 border-2 border-ink bg-soft p-4">
      <p className="font-display text-base leading-tight">API not configured</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Provider: {info.provider}</p>
      <p className="mt-3 text-xs text-ink/80">{info.setupNote}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={info.signupUrl} target="_blank" rel="noreferrer" className="border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-ink hover:text-paper">Get a key →</a>
        {info.docsUrl && <a href={info.docsUrl} target="_blank" rel="noreferrer" className="border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-ink hover:text-paper">Docs</a>}
      </div>
    </div>
  );
}

function Notice({ tone, title, body }: { tone: "warn" | "error"; title: string; body: string }) {
  const accent = tone === "error" ? "text-coral" : "text-ink";
  return (
    <div className="m-3 border-2 border-ink bg-paper p-4">
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${accent}`}>{title}</p>
      <p className="mt-2 text-xs text-ink/80">{body}</p>
    </div>
  );
}
