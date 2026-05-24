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
  // Direct-paste mode (legacy / pre-AI-Edit). Fires with the full
  // insert payload (attribution + style block + body, content-preserved).
  // When `onPickReference` is provided, this callback is NOT used.
  onPick?: (
    assetText: string,
    opts?: { forceRebuild?: boolean },
  ) => void;
  // Phase 6 — AI swap mode. When provided, the browser bypasses the
  // direct-paste insert pipeline entirely and fires this callback with
  // the RAW component HTML (no insert payload, no content preservation —
  // the AI does the fusion server-side). `onPick` is ignored in this
  // mode.
  onPickReference?: (component: ComponentMeta, rawHtml: string) => void;
  // 2026-05-22 — slug of the currently-selected reference (BYO-AI swap
  // mode). When set, the matching tile gets a coral ring + "✓ Selected"
  // badge so the user has unmistakable feedback that their pick
  // registered. Without this the tile looked identical after clicking
  // and users thought "nothing happened".
  selectedSlug?: string | null;
  // 2026-05-24 — grid column count. The 320px vibe-sidebar wants 2; the
  // full-screen BYO-AI modal wants many more (the old hardcoded 2 showed
  // ~4 huge tiles total — useless for browsing). Viewport breakpoints
  // can't be used (the sidebar would also widen), so the caller sets it.
  columns?: 2 | 3 | 4 | 5 | 6;
  // 2026-05-24 — hover behavior. "popover" (default, sidebar): a fixed
  // preview card to the left of the tile. "scale": the tile itself
  // zooms ~1.7x in place (full-screen BYO-AI grid) — no popover.
  hoverPreview?: "popover" | "scale";
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

// Static grid-cols classes (Tailwind can't see dynamic ones).
const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export default function InlineComponentBrowser({
  mode,
  category,
  onPick,
  onPickReference,
  selectedSlug,
  columns = 2,
  hoverPreview = "popover",
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
      // BYO-AI swap mode (2026-05-21). Skip the insert pipeline; hand
      // the reference markup to the caller, who composes it into the
      // prompt sent to the user's AI.
      //
      // 2026-05-22 — bundle the component's CSS with its HTML. Uiverse
      // components carry their styling in `full.css` (custom CSS, not
      // just Tailwind utilities); passing only `full.html` gave the AI
      // class names with no visual definition. We prepend the CSS as a
      // <style> block + strip the `__UIV_SCOPE__` descendant-prefix so
      // the rules read directly against the HTML's class names. HyperUI
      // components have null css (Tailwind-only) → html alone is enough.
      if (onPickReference) {
        const html = full.html ?? "";
        const css = full.css
          ? full.css.replace(/__UIV_SCOPE__\s*/g, "")
          : null;
        const referenceMarkup = css
          ? `<style>\n${css}\n</style>\n${html}`
          : html;
        onPickReference(full, referenceMarkup);
        return;
      }
      if (!onPick) {
        onWarn?.("Component browser misconfigured — no pick handler");
        return;
      }
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
        <div className={`grid gap-2 ${GRID_COLS[columns] ?? "grid-cols-2"}`}>
          {filtered.map((c) => {
            const isSelected = selectedSlug === c.slug;
            return (
            <button
              type="button"
              key={c.slug}
              disabled={picking !== null}
              onClick={() => handlePick(c.slug)}
              onMouseEnter={(ev) => {
                hoverRectRef.current = (
                  ev.currentTarget as HTMLElement
                ).getBoundingClientRect();
                setHoveredSlug(c.slug);
                forceRender((n) => n + 1);
              }}
              onMouseLeave={() => setHoveredSlug((s) => (s === c.slug ? null : s))}
              aria-pressed={isSelected}
              className={
                "group relative overflow-hidden border-2 bg-white text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 " +
                // 2026-05-24 — scale mode uses SHORT fixed-height tiles so
                // 3 rows × 4 cols fit. The hover zoom is a fixed-position
                // preview (below) that escapes the scroll container — an
                // in-place CSS scale would be clipped by overflow-y-auto.
                (hoverPreview === "scale" ? "h-32 " : "aspect-[4/3] ") +
                (isSelected
                  ? "border-coral ring-2 ring-coral ring-offset-2 ring-offset-paper"
                  : "border-ink hover:border-coral")
              }
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
              {/* 2026-05-22 — explicit "selected" badge. The pick was
                  registering correctly all along but gave no per-tile
                  feedback, so users thought clicking did nothing. */}
              {isSelected && (
                <span className="absolute right-1 top-1 flex items-center gap-0.5 bg-coral px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-paper">
                  ✓ Picked
                </span>
              )}
              {picking === c.slug && (
                <span className="absolute inset-0 flex items-center justify-center bg-paper/80 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                  Loading…
                </span>
              )}
            </button>
            );
          })}
        </div>
      )}

      {/* Hover preview — a single fixed-position card (escapes the
          scroll container's clip, so the enlarged view is never cut
          off). Two placements:
          - "scale": enlarged ~1.8x + CENTERED over the hovered tile, so
            it reads as the tile zooming out of the grid.
          - "popover": to the LEFT of the tile (narrow sidebar). */}
      {hovered && hoverRectRef.current && (() => {
        const r = hoverRectRef.current;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (hoverPreview === "scale") {
          // Enlarge the tile's footprint ~1.8x, centered on it, clamped
          // to the viewport so it's fully visible (never cut off).
          const w = Math.min(r.width * 1.9, vw - 32);
          const imgH = Math.round(w * 0.62); // shorter, gallery-ish
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const left = Math.max(12, Math.min(vw - w - 12, cx - w / 2));
          const top = Math.max(12, Math.min(vh - imgH - 56, cy - imgH / 2));
          return (
            <div
              className="pointer-events-none fixed z-[120] border-2 border-ink bg-white shadow-2xl"
              style={{ left, top, width: w }}
            >
              {hovered.thumbUrl && (
                <img
                  src={hovered.thumbUrl}
                  alt={hovered.title}
                  style={{ height: imgH }}
                  className="w-full bg-white object-contain"
                />
              )}
              <div className="border-t-2 border-ink bg-paper px-3 py-1.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink">
                  {hovered.title}
                </p>
              </div>
            </div>
          );
        }
        return (
          <div
            className="pointer-events-none fixed z-[120] border-2 border-ink bg-paper shadow-xl"
            style={{
              top: Math.max(8, Math.min(vh - 320, r.top - 40)),
              left: Math.max(8, r.left - 360),
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
        );
      })()}
    </div>
  );
}
