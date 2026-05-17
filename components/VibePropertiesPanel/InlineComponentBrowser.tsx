"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ComponentIndex,
  ComponentMeta,
} from "@/lib/component-library/types";
import {
  getComponentIndex,
  getComponentFull,
} from "@/lib/component-library/client";
import { buildInsertPayload } from "@/lib/component-library/insert";
import {
  applyPreservedContent,
  type PreserveContent,
} from "@/lib/component-library/preserve-content";
import type { PreviewKind } from "@/lib/preview";

interface Props {
  mode: PreviewKind;
  category: string | null;
  onPick: (
    assetText: string,
    opts?: { forceRebuild?: boolean },
  ) => void;
  onWarn?: (message: string) => void;
  // Pre-swap visual footprint of the target element. When provided,
  // the swapped asset gets wrapped in a same-dimension container so
  // the surrounding layout doesn't shift on swap. Null = no wrap
  // (caller can opt out via passing null; bbox absent on the
  // VibeElementInfo also lands here as null).
  preserveBbox?: {
    width: number;
    height: number;
    display: string;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  } | null;
  // 2026-05-17 — Original element's content (text, href, src, alt).
  // Applied to the library asset BEFORE outer-replace so the swap
  // adapts to the vibecoder's existing text instead of clobbering it
  // with the library's hardcoded label. Null/undefined skips the
  // transform (asset retains its library defaults). See
  // lib/component-library/preserve-content.ts for the heuristic.
  preserveContent?: PreserveContent | null;
}

export default function InlineComponentBrowser({
  mode,
  category,
  onPick,
  onWarn,
  preserveBbox,
  preserveContent,
}: Props) {
  const [index, setIndex] = useState<ComponentIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [picking, setPicking] = useState<string | null>(null);
  const hoverRectRef = useRef<DOMRect | null>(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getComponentIndex()
      .then((idx) => {
        if (!cancelled) setIndex(idx);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message ?? e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!index) return [];
    const all = index.components;
    if (!category) return all;
    return all.filter((c) => c.category === category);
  }, [index, category]);

  const hovered = useMemo<ComponentMeta | null>(() => {
    if (!hoveredSlug) return null;
    return filtered.find((c) => c.slug === hoveredSlug) ?? null;
  }, [hoveredSlug, filtered]);

  const handlePick = async (slug: string) => {
    if (picking) return;
    setPicking(slug);
    try {
      const full = await getComponentFull(slug);
      const payload = buildInsertPayload(full, mode);
      // 2026-05-17 — Preserve original content (text label, href, src,
      // alt, sizing classes) by transforming the library asset BEFORE
      // wrapping. The longest visible text node wins; first literal
      // href/src/alt swap; sizing classes (w-, h-, max-w-, mx-, etc.)
      // get appended to the new component's first opening tag. See
      // lib/component-library/preserve-content.ts.
      const adaptedText = preserveContent
        ? applyPreservedContent(payload.text, preserveContent, mode)
        : payload.text;
      // Outer-swap replaces a single JSX element. buildInsertPayload
      // emits multiple top-level siblings when the component has CSS
      // (attribution comment + `<style>{`...`}</style>` + scoped
      // wrapper div). JSX parents only accept ONE child where the
      // swapped element was — multi-root assets break the parse:
      //   "Unexpected token (n:8)" at the inner `<style>{` line.
      // HTML mode tolerates this natively (sibling Comment+Element
      // nodes), so wrap only for JSX. The fragment marker
      // `<>...</>` collapses at render time and adds no DOM bloat.
      const innerText =
        mode === "jsx" ? `<>\n${adaptedText}\n</>` : adaptedText;

      // 2026-05-17 — bbox `<div style="width:Xpx">` wrapper REMOVED.
      // The wrapper was meant to lock the asset's footprint to the
      // original element's dimensions, but it caused a real bug user
      // reported as "post another component on top of another instead
      // of replacing it" — every sequential swap added a new wrapper
      // INSIDE the previous because vibeClick selected the inner
      // element (atom-rule), not the wrapper (which had the OID).
      // Nesting accumulated per swap.
      //
      // New approach: drop the wrapper entirely. Component takes its
      // natural size. Sizing context (w-full / max-w-sm / mx-auto)
      // is preserved by transferring those classes from the original
      // onto the new component's root via applyPreservedContent above.
      // No wrapper → no nesting → no duplication. Layout may shift if
      // the new component is intrinsically wider/taller than the
      // original (e.g. swapping a tiny nav link for a big hero card);
      // accepted as the trade-off for a working swap.
      const finalText = innerText;
      // preserveBbox is intentionally unused now (kept as a prop for
      // future use if a smaller, non-wrapper-based sizing constraint
      // becomes needed). Acknowledge to satisfy unused-arg lint without
      // changing the prop shape.
      void preserveBbox;

      // JSX assets carry JSX-only syntax ({/* */} comments, template
      // literals inside <style>) that the iframe's outerHTML write
      // can't evaluate — request a full iframe rebuild so React/Babel
      // re-render the new source correctly. HTML assets render fine
      // via outerHTML and skip the rebuild for the no-flicker path.
      onPick(finalText, { forceRebuild: mode === "jsx" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      onWarn?.(`Couldn't load component: ${msg}`);
    } finally {
      setPicking(null);
    }
  };

  return (
    <div className="border-t-2 border-ink/15 p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {category ? `${category}` : "Components"}
        </p>
        <p className="font-mono text-[10px] text-muted">
          {index ? `${filtered.length}` : "…"}
        </p>
      </div>

      {error && (
        <p className="font-mono text-[11px] text-red-600">
          Couldn&apos;t load components: {error}
        </p>
      )}

      {!index && !error && (
        <p className="font-mono text-[11px] text-muted">Loading…</p>
      )}

      {index && filtered.length === 0 && (
        <p className="font-mono text-[11px] text-muted">
          No {category ?? "components"} found.
        </p>
      )}

      {index && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((c) => (
            <button
              type="button"
              key={c.slug}
              disabled={picking !== null}
              onClick={() => handlePick(c.slug)}
              onMouseEnter={(ev) => {
                hoverRectRef.current = (ev.currentTarget as HTMLElement).getBoundingClientRect();
                setHoveredSlug(c.slug);
                forceRender((n) => n + 1);
              }}
              onMouseLeave={() => setHoveredSlug((s) => (s === c.slug ? null : s))}
              className="group relative aspect-[4/3] overflow-hidden border-2 border-ink bg-white text-left transition-colors hover:border-coral disabled:cursor-not-allowed disabled:opacity-40"
              title={c.title}
            >
              {c.thumbUrl && (
                <img
                  src={c.thumbUrl}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 truncate bg-ink/80 px-1 py-0.5 font-mono text-[9px] text-paper">
                {c.title}
              </span>
              {picking === c.slug && (
                <span className="absolute inset-0 flex items-center justify-center bg-paper/80 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                  Swapping…
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Hover popover — fixed position to the left of the hovered tile.
          Pure-CSS would require absolute positioning relative to each tile;
          using a single portal-like fixed div + the hover rect ref keeps the
          popover above the panel scrollbar without per-tile DOM bloat. */}
      {hovered && hoverRectRef.current && (
        <div
          className="pointer-events-none fixed z-50 border-2 border-ink bg-paper shadow-xl"
          style={{
            top: Math.max(
              8,
              Math.min(
                window.innerHeight - 320,
                hoverRectRef.current.top - 40,
              ),
            ),
            left: Math.max(8, hoverRectRef.current.left - 360),
            width: 340,
          }}
        >
          {hovered.thumbUrl && (
            <img
              src={hovered.thumbUrl}
              alt={hovered.title}
              className="aspect-[4/3] w-full bg-white object-cover"
            />
          )}
          <div className="border-t-2 border-ink p-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink">
              {hovered.title}
            </p>
            <p className="mt-0.5 font-mono text-[9px] text-muted">
              {hovered.source} · {hovered.category}
              {hovered.author ? ` · ${hovered.author}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
