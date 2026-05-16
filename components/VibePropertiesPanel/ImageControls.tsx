"use client";

// Vibe-edit image controls: src + alt direct edit, plus a Browse
// button that opens the host-owned LibraryModal in media mode. The
// library's Unsplash / Pexels panels emit a full <img> string; the
// host pick-handler swaps the element's outerHTML wholesale (same
// patcher path as the icon swap — patchJsxOuterByOid for JSX,
// patchHtmlOuter for HTML).

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";

interface ImageControlsProps {
  info: VibeElementInfo;
  onImageChange: (next: { src?: string; alt?: string }) => void;
  // Open the media-library modal. Host owns the modal mount + the
  // pick → postMessage routing; this control just signals intent.
  onSwapClick?: () => void;
  // 2026-05-15 — surface a Shuffle button alongside Browse. Calls the
  // host's onWarn for empty-alt + network-error feedback so toasts
  // route through the existing notification system.
  onWarn?: (msg: string) => void;
}

// 2026-05-16 — Matches the SLIMMED shape returned by
// `app/api/assets/pixabay/route.ts` (which renames upstream Pixabay
// fields: `webformatURL → webformat`, `largeImageURL → large`).
// Previous v1 of this interface used the raw upstream names; the
// per-shuffle `pick.webformatURL` lookup always returned undefined,
// fell through to the current `src` fallback, and every "shuffle"
// silently re-applied the same URL. That's the bug user reported as
// "shuffle doesn't do nothing."
interface PixabayHit {
  id: string;
  webformat: string;
  large: string;
  tags: string;
}

export default function ImageControls({
  info,
  onImageChange,
  onSwapClick,
  onWarn,
}: ImageControlsProps) {
  const [src, setSrc] = useState(typeof info.src === "string" ? info.src : "");
  const [alt, setAlt] = useState(typeof info.alt === "string" ? info.alt : "");
  // 2026-05-15 — Shuffle button state. `loading` gates double-clicks
  // during the in-flight fetch. `recentSrcs` keeps the last 5 picks so
  // back-to-back shuffles don't repeat — Pixabay's per-query results
  // are stable so without dedup the user would see the same photo on
  // repeat clicks until the random page-pick hops far enough.
  const [shuffling, setShuffling] = useState(false);
  const [recentSrcs, setRecentSrcs] = useState<readonly string[]>([]);

  useEffect(() => {
    // 2026-05-16 — Always coerce to string. The VibeElementInfo type
    // says `src: string | null` but iframe payloads have occasionally
    // arrived with `undefined` (older runtime emit shape) — which
    // would flip the controlled <input> to uncontrolled and trigger
    // React's "changing a controlled input to be uncontrolled"
    // warning. Coercing to "" here AND at handleShuffle's setSrc
    // belt-and-braces guards against both code paths.
    setSrc(typeof info.src === "string" ? info.src : "");
    setAlt(typeof info.alt === "string" ? info.alt : "");
  }, [info.path, info.src, info.alt]);

  async function handleShuffle() {
    console.log("[dropin:Shuffle] click entry", {
      shuffling,
      altState: alt,
      altInfo: info.alt,
      srcState: src,
      srcInfo: info.src,
    });
    if (shuffling) {
      console.log("[dropin:Shuffle] bailed — already shuffling");
      return;
    }
    // 2026-05-16 — Query chain. Earlier v1/v2 had a single query and
    // bailed on 0 hits, even though "almost all images have descriptive
    // text" (user). The right move is to TRY the descriptive text
    // first, then progressively fall back until Pixabay returns
    // SOMETHING. Chain (stop at first non-empty response):
    //   1. Literal alt text (best: vibecoder's words, exact)
    //   2. First 3 alpha-only words from alt (strips punctuation /
    //      numerals like "PLATE · I" → "PLATE")
    //   3. First alpha word from alt (the conceptual hook)
    //   4. Filename slug parsed from current src
    //   5. "abstract texture" (last-ditch — Pixabay will return SOMETHING)
    const altText = (alt || info.alt || "").trim();
    const alphaWords = altText
      .split(/\s+/)
      .filter((w) => /[a-zA-Z]/.test(w));
    const filenameQuery = queryFromImageUrl(src || info.src || "");
    const queries: string[] = [];
    if (altText.length >= 3) queries.push(altText);
    if (alphaWords.length >= 3) queries.push(alphaWords.slice(0, 3).join(" "));
    if (alphaWords.length >= 1) queries.push(alphaWords[0]!);
    if (filenameQuery && filenameQuery.length >= 3) queries.push(filenameQuery);
    queries.push("abstract texture");
    const uniqueQueries = Array.from(new Set(queries));
    console.log("[dropin:Shuffle] query chain", {
      altText,
      alphaWords,
      filenameQuery,
      queries: uniqueQueries,
    });
    setShuffling(true);
    try {
      for (const query of uniqueQueries) {
        // Random page 1..5 per attempt so consecutive shuffles with
        // the same query still rotate through different hits.
        const page = 1 + Math.floor(Math.random() * 5);
        const params = new URLSearchParams({
          q: query,
          per_page: "20",
          page: String(page),
          orientation: "horizontal",
        });
        const url = `/api/assets/pixabay?${params.toString()}`;
        console.log("[dropin:Shuffle] trying", { query, url });
        const res = await fetch(url);
        console.log("[dropin:Shuffle] response", {
          query,
          ok: res.ok,
          status: res.status,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const detail =
            body && typeof body.detail === "string"
              ? body.detail
              : `${res.status}`;
          console.log("[dropin:Shuffle] bail — non-OK response", {
            query,
            detail,
          });
          onWarn?.(`Shuffle: ${detail}`);
          return;
        }
        const body = await res.json();
        const hits: PixabayHit[] = Array.isArray(body?.hits) ? body.hits : [];
        console.log("[dropin:Shuffle] hits", {
          query,
          hitCount: hits.length,
        });
        if (hits.length === 0) continue; // try next query in chain
        // Pick a hit that isn't in recentSrcs. If every result was recent
        // (cycled through all options), accept any.
        const fresh = hits.filter((h) => !recentSrcs.includes(h.webformat));
        const pool = fresh.length > 0 ? fresh : hits;
        const pick = pool[Math.floor(Math.random() * pool.length)]!;
        // 2026-05-16 — proxy field names are `webformat` / `large`,
        // not `webformatURL` / `largeImageURL`. The OLD code's `|| src`
        // tail silently set "next" = "current" → no visible change.
        // Drop the `|| src` fallback entirely so failures surface
        // explicitly instead of being papered over.
        const nextSrc = pick.webformat || pick.large || "";
        console.log("[dropin:Shuffle] picked", {
          query,
          nextSrc,
          usingFresh: fresh.length > 0,
        });
        if (!nextSrc) continue;
        setSrc(nextSrc);
        onImageChange({ src: nextSrc });
        console.log("[dropin:Shuffle] applied", { query, nextSrc });
        setRecentSrcs((prev) => {
          const next = [nextSrc, ...prev.filter((s) => s !== nextSrc)];
          return next.slice(0, 5);
        });
        return;
      }
      // All queries in the chain returned 0 hits — extraordinary.
      onWarn?.("Shuffle: couldn't find any matching photos. Try different alt text.");
    } catch (e) {
      console.log("[dropin:Shuffle] caught error", {
        message: e instanceof Error ? e.message : String(e),
      });
      onWarn?.(
        e instanceof Error
          ? `Shuffle: ${e.message}`
          : "Shuffle: network error",
      );
    } finally {
      setShuffling(false);
      console.log("[dropin:Shuffle] done — shuffling reset");
    }
  }

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Image URL
        </span>
        <input
          type="text"
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
            onImageChange({ src: e.target.value });
          }}
          placeholder="https://..."
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
        <p className="mt-1 font-mono text-[10px] text-muted">
          Tip: paste any image URL.
        </p>
      </label>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Alt text
        </span>
        <input
          type="text"
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value);
            onImageChange({ alt: e.target.value });
          }}
          placeholder="Describe the image"
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>

      <div className="border-t-2 border-ink/15 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Find a different photo
        </p>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={handleShuffle}
            disabled={shuffling}
            title={
              shuffling
                ? "Finding another photo…"
                : "Shuffle — fetch a random photo matching the alt text"
            }
            className="flex-1 border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            {shuffling ? "Shuffling…" : "Shuffle ↻"}
          </button>
          <button
            type="button"
            onClick={onSwapClick}
            disabled={!onSwapClick}
            className="flex-1 border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            Browse
          </button>
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted">
          Shuffle picks a random photo matching your alt text. Browse opens the full library.
        </p>
      </div>
    </div>
  );
}

// 2026-05-16 — Derive a Pixabay search term from an image URL when no
// alt text is available. Strips host/extension/query, splits on
// dash/underscore/dot, drops numeric/uuid tokens, returns first 4
// alpha-leading words ≥3 chars. Returns null when the filename has no
// meaningful terms (e.g. Unsplash's `photo-1234abcd-…` IDs).
function queryFromImageUrl(url: string): string | null {
  if (!url) return null;
  let path: string;
  try {
    const parsed = new URL(url, "https://example.com");
    path = parsed.pathname;
  } catch {
    path = url;
  }
  const lastSlash = path.lastIndexOf("/");
  let leaf = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;
  leaf = leaf.replace(/\.[a-z0-9]{1,5}$/i, "");
  const words = leaf.replace(/[-_.+%]/g, " ").replace(/\s+/g, " ").trim();
  const cleaned = words
    .split(" ")
    .filter((w) => /^[a-zA-Z][a-zA-Z]{2,}/.test(w))
    .slice(0, 4)
    .join(" ");
  return cleaned.length >= 3 ? cleaned : null;
}
