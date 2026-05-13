"use client";

// Unsplash sub-panel. Hits `/api/assets/unsplash` (proxied so the access
// key never leaves the server). When the env var is missing, the route
// returns 503 + a structured `NotConfigured` payload that this panel
// renders as a friendly setup card with the signup link.
//
// Insert behavior is delegated to `lib/asset-library/insert-image.ts`
// which prepends the Unsplash-required attribution comment.

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Mode,
  NotConfigured,
  UnsplashPhoto,
  UnsplashSearchResponse,
} from "@/lib/asset-library/types";
import {
  buildImageInsert,
  type Resolution,
} from "@/lib/asset-library/insert-image";
import { pushRecent, getRecents } from "@/lib/asset-library/recent";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:UnsplashPanel] ${msg}`, data ?? "");
}

interface Props {
  mode: Mode;
  onInsert: (text: string) => void;
}

const SEARCH_KEY = "dropin:unsplash:search";
const ORIENT_KEY = "dropin:unsplash:orient";
const RES_KEY = "dropin:unsplash:res";
const ORIENTATIONS: Array<{ id: "" | "landscape" | "portrait" | "squarish"; label: string }> = [
  { id: "",          label: "All" },
  { id: "landscape", label: "Landscape" },
  { id: "portrait",  label: "Portrait" },
  { id: "squarish",  label: "Square" },
];
const RESOLUTIONS: Resolution[] = ["small", "medium", "large", "original"];

type FetchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; results: UnsplashPhoto[]; total: number }
  | { kind: "empty" }
  | { kind: "rate-limited" }
  | { kind: "unauthorized" }
  | { kind: "error"; detail: string }
  | { kind: "not-configured"; info: NotConfigured };

export default function UnsplashPanel({ mode, onInsert }: Props) {
  const [query, setQuery] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SEARCH_KEY) || ""
  );
  const [orientation, setOrientation] = useState<"" | "landscape" | "portrait" | "squarish">(() => {
    if (typeof window === "undefined") return "";
    const v = window.sessionStorage.getItem(ORIENT_KEY) || "";
    return (v as "" | "landscape" | "portrait" | "squarish") || "";
  });
  const [resolution, setResolution] = useState<Resolution>(() => {
    if (typeof window === "undefined") return "medium";
    const v = window.localStorage.getItem(RES_KEY);
    return (RESOLUTIONS.includes(v as Resolution) ? (v as Resolution) : "medium");
  });
  const [state, setState] = useState<FetchState>({ kind: "idle" });
  const [recents, setRecents] = useState<UnsplashPhoto[]>([]);
  const inflightRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.sessionStorage.setItem(SEARCH_KEY, query);
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined")
      window.sessionStorage.setItem(ORIENT_KEY, orientation);
  }, [orientation]);
  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem(RES_KEY, resolution);
  }, [resolution]);

  useEffect(() => {
    getRecents("unsplash").then((rs) =>
      setRecents(rs.map((r) => r.payload as UnsplashPhoto))
    );
  }, []);

  // Debounced search — fire 250ms after the user stops typing or after
  // orientation changes.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setState({ kind: "idle" });
      return;
    }
    const id = setTimeout(() => doSearch(q, orientation), 250);
    return () => clearTimeout(id);
  }, [query, orientation]);

  async function doSearch(
    q: string,
    orient: "" | "landscape" | "portrait" | "squarish"
  ) {
    if (inflightRef.current) inflightRef.current.abort();
    const ctrl = new AbortController();
    inflightRef.current = ctrl;

    setState({ kind: "loading" });
    const params = new URLSearchParams({ q });
    if (orient) params.set("orientation", orient);

    try {
      const res = await fetch(`/api/assets/unsplash?${params.toString()}`, {
        signal: ctrl.signal,
      });
      const body = await res.json();
      if (res.status === 503 && body && body.configured === false) {
        setState({ kind: "not-configured", info: body as NotConfigured });
        return;
      }
      if (res.status === 401) {
        setState({ kind: "unauthorized" });
        return;
      }
      if (res.status === 429) {
        setState({ kind: "rate-limited" });
        return;
      }
      if (!res.ok) {
        setState({ kind: "error", detail: `${res.status}` });
        return;
      }
      const data = body as UnsplashSearchResponse;
      if (!data.results.length) {
        setState({ kind: "empty" });
        return;
      }
      setState({ kind: "ready", results: data.results, total: data.total });
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setState({ kind: "error", detail: e instanceof Error ? e.message : String(e) });
    }
  }

  function handleInsert(photo: UnsplashPhoto) {
    log("insert unsplash", { id: photo.id, mode, resolution });
    onInsert(buildImageInsert(photo, mode, { resolution }));
    // Track download per Unsplash ToS (fire-and-forget).
    fetch("/api/assets/unsplash/track-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ downloadLocation: photo.downloadLocation }),
    }).catch(() => {});
    pushRecent("unsplash", photo.id, photo);
    setRecents((prev) => {
      const without = prev.filter((x) => x.id !== photo.id);
      return [photo, ...without].slice(0, 12);
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
        placeholder="Search photos…"
        aria-label="Search Unsplash"
        className="border-b-2 border-ink bg-paper px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink placeholder:text-muted focus:bg-soft focus:outline-none"
      />

      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-ink/30 bg-paper px-2 py-1.5">
        <div className="flex items-center gap-1 overflow-x-auto">
          {ORIENTATIONS.map((o) => {
            const active = o.id === orientation;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setOrientation(o.id)}
                className={
                  "shrink-0 border-2 border-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
                  (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
                }
              >
                {o.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
            Res
          </span>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value as Resolution)}
            aria-label="Insert resolution"
            className="border-2 border-ink bg-paper px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-ink focus:outline-none"
          >
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {state.kind === "not-configured" && <SetupCard info={state.info} />}
        {state.kind === "unauthorized" && (
          <Notice
            tone="error"
            title="Unsplash access key rejected"
            body="The configured UNSPLASH_ACCESS_KEY appears invalid. Re-check the key in .env.local and restart the dev server."
          />
        )}
        {state.kind === "rate-limited" && (
          <Notice
            tone="warn"
            title="Rate limit reached"
            body="Unsplash dev tier allows 50 requests/hour. Wait a minute and retry, or apply for production access (5000/hr)."
          />
        )}
        {state.kind === "error" && (
          <Notice tone="error" title="Search failed" body={state.detail} />
        )}
        {state.kind === "loading" && (
          <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Searching…
          </p>
        )}
        {state.kind === "empty" && (
          <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            No matches.
          </p>
        )}
        {state.kind === "idle" && !showRecents && (
          <p className="p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Type to search Unsplash photos.
          </p>
        )}
        {showRecents && (
          <div className="border-b border-ink/30 px-3 py-2">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
              Recent
            </p>
            <PhotoGrid photos={recents} onPick={handleInsert} />
          </div>
        )}
        {state.kind === "ready" && (
          <div className="p-2">
            <PhotoGrid photos={state.results} onPick={handleInsert} />
            {state.total > state.results.length && (
              <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                {state.results.length} of {state.total.toLocaleString()} — refine search to narrow.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoGrid({
  photos,
  onPick,
}: {
  photos: UnsplashPhoto[];
  onPick: (p: UnsplashPhoto) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPick(p)}
          title={p.description || `Photo by ${p.author.name}`}
          className="group block overflow-hidden border-2 border-ink bg-paper text-left transition-shadow hover:shadow-[3px_3px_0_0_#FF4D2E]"
        >
          <div className="relative aspect-[4/3] bg-soft">
            <img
              src={p.thumb}
              alt={p.description || `Photo by ${p.author.name}`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            by {p.author.name}
          </div>
        </button>
      ))}
    </div>
  );
}

function SetupCard({ info }: { info: NotConfigured }) {
  return (
    <div className="m-3 border-2 border-ink bg-soft p-4">
      <p className="font-display text-base leading-tight">API not configured</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Provider: {info.provider}
      </p>
      <p className="mt-3 text-xs text-ink/80">{info.setupNote}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={info.signupUrl}
          target="_blank"
          rel="noreferrer"
          className="border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-ink hover:text-paper"
        >
          Get a key →
        </a>
        {info.docsUrl && (
          <a
            href={info.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-ink hover:text-paper"
          >
            Docs
          </a>
        )}
      </div>
    </div>
  );
}

function Notice({
  tone,
  title,
  body,
}: {
  tone: "warn" | "error";
  title: string;
  body: string;
}) {
  const accent = tone === "error" ? "text-coral" : "text-ink";
  return (
    <div className="m-3 border-2 border-ink bg-paper p-4">
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${accent}`}>
        {title}
      </p>
      <p className="mt-2 text-xs text-ink/80">{body}</p>
    </div>
  );
}
