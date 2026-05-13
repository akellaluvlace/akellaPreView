"use client";

// Sidebar shell. Owns:
//   1. Open/close state (delegated up via the existing onToggle prop —
//      Workspace's Cmd/Ctrl+J shortcut and the collapsed strip both keep
//      working unchanged).
//   2. The 5-tab top strip (Components / Media / Icons / Style / Palettes).
//   3. Persisting the active top-tab in localStorage so the user returns to
//      the same tab next session. Sub-tabs persist inside their own panels.
//
// Each top-tab renders one of the five panels in `./asset-panels/`
// (Palettes lives at `./PalettesSection`).
//
// Phase 5 / Phase C — `insertContext` / `swapContext` props let the Insert
// and Swap tools repurpose the existing tile click handler into structural
// edits via `applyInsertChild` / `applySwap`. When a context is active,
// the header reads "Insert into <tag>" / "Swap <tag>" and the click on a
// tile routes through `onInsertInto` / `onSwapWith` instead of the legacy
// Monaco cursor insert.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PreviewKind } from "@/lib/preview";
import type { SlotEnvelope } from "@/lib/swap/slot-capacity";
import ComponentsPanel from "./asset-panels/ComponentsPanel";
import MediaPanel from "./asset-panels/MediaPanel";
import IconsPanel from "./asset-panels/IconsPanel";
import StylePanel from "./asset-panels/StylePanel";
import PalettesSection from "./PalettesSection";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:LibrarySidebar] ${msg}`, data ?? "");
}

type TopTab = "components" | "media" | "icons" | "style" | "palettes";
const TAB_KEY = "dropin:sidebar:tab";
const OPEN_KEY = "dropin:sidebar:open";

const TABS: Array<{ id: TopTab; label: string }> = [
  { id: "components", label: "Components" },
  { id: "media",      label: "Media" },
  { id: "icons",      label: "Icons" },
  { id: "style",      label: "Style" },
  { id: "palettes",   label: "Palettes" },
];

export interface SidebarInsertContext {
  parentOid: string;
  targetTag: string;
  // Phase 6 ramp — additional accumulated targets from shift-click in
  // Insert mode. When non-empty, the Sidebar's header reads "Insert
  // into N elements" and tile clicks dispatch `onInsertIntoMulti`
  // with `[parentOid, ...additionalParentOids]` instead of single-target
  // `onInsertInto`. Caller is responsible for keeping the array deduped
  // and excluding `parentOid`.
  additionalParentOids?: string[];
}

export interface SidebarSwapContext {
  targetOid: string;
  targetTag: string;
  // Thirty-third-pass — Swap auto-category routing. When the target's
  // tag (or class signal) maps to a recognised library category, the
  // builder pre-fills these so the Sidebar can open to the right tab
  // + filter without the user having to re-select. Computed JIT in
  // Workspace via `lib/swap-category-hint`. Both null when no hint is
  // confident — Sidebar falls through to its existing default tab
  // (Components, no filter override).
  suggestedPanel?: "components" | "media" | "icons" | null;
  suggestedCategory?: string | null;
  // Phase E proper — slot envelope (parent's content-box + AR) for
  // the LibraryModal compatibility filter. When set, ComponentsPanel
  // computes per-asset fit verdicts via `classifyAssets` and renders
  // a "N of M fit" chip + dims incompatibles + supports a "fits only"
  // toggle. Null when the iframe hasn't measured yet — panel falls
  // back to its existing browse UX (every asset compatible).
  slotEnvelope?: SlotEnvelope | null;
}

export interface SidebarProps {
  mode: PreviewKind;
  // `opts.position` lets page-level inserts (palette / gradient / global font)
  // request prepend-to-top instead of insert-at-cursor — those need to land
  // somewhere stable so they affect the whole page, not appear as a "random
  // section" wherever the user's cursor happens to be.
  onInsert: (text: string, opts?: { position?: "cursor" | "top" }) => void;
  open: boolean;
  onToggle: (next: boolean) => void;
  onWarn?: (message: string) => void;
  // Phase 5 / Phase C — Insert tool wiring. When `insertContext` is set,
  // tile clicks fire `onInsertInto(parentOid, assetText)` instead of the
  // legacy cursor-position `onInsert`. The `targetTag` is for the header
  // label only ("Insert into <main>"); the engine looks up the parent by
  // its OID, not its tag. Cancel button restores the legacy mode.
  insertContext?: SidebarInsertContext | null;
  onInsertInto?: (parentOid: string, assetText: string) => void;
  // Phase 6 ramp — multi-target Insert. When `additionalParentOids` is
  // non-empty on the insertContext, the Sidebar dispatches this instead
  // of `onInsertInto`. Routes through Workspace's `handleInsertIntoMulti`
  // for one-undo-entry batching.
  onInsertIntoMulti?: (parentOids: string[], assetText: string) => void;
  onCancelInsert?: () => void;
  // Phase 5 / Phase C — Swap tool wiring. Same shape as insertContext but
  // routes to `applySwap` instead of `applyInsertChild`. Triggered from
  // the toolbar (W key / Swap button); requires a pre-existing selection
  // because the engine bails on the document root.
  swapContext?: SidebarSwapContext | null;
  // Twenty-third pass — Phase 6 ramp from `phase5-tools-isolation.md`
  // §5 ("Swap with preserve-children — Alt-click variant, deferred").
  // The third argument is the optional preserve-children flag from
  // the Sidebar's swap-context "Keep children" toggle. Workspace
  // routes it through to `applySwap`. Default false → existing
  // discard-children behaviour.
  onSwapWith?: (
    targetOid: string,
    assetText: string,
    preserveChildren?: boolean
  ) => void;
  onCancelSwap?: () => void;
  // Phase 5 / Phase C — Library Palettes section. When `onApplyPalette` is
  // wired AND the user clicks a palette tile, the host runs `applyPalette`
  // with the appropriate scope (FocusEditor mode → isolated subtree;
  // workspace mode → "all"). Sidebar doesn't own the scope decision.
  onApplyPalette?: (paletteId: string) => void;
  // Twenty-third pass — palette-only mount path. When true (always in
  // tandem with the LibraryModal's matching prop, never in workspace
  // canvas mode) the active tab is forced to "palettes" and the
  // header reads "Palettes" instead of "Library". Insert/swap context
  // takes precedence (a structural-edit flow is always more specific
  // than a palette browse), so callers pass `paletteOnly = true` only
  // when neither context is set.
  paletteOnly?: boolean;
}

function readSavedTab(): TopTab {
  if (typeof window === "undefined") return "components";
  const v = window.localStorage.getItem(TAB_KEY);
  if (
    v === "components" ||
    v === "media" ||
    v === "icons" ||
    v === "style" ||
    v === "palettes"
  )
    return v;
  return "components";
}

function readSavedOpen(): boolean | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(OPEN_KEY);
  if (v === "1") return true;
  if (v === "0") return false;
  return null;
}

function writeSavedOpen(open: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OPEN_KEY, open ? "1" : "0");
  } catch {}
}

export default function ComponentLibrarySidebar({
  mode,
  onInsert,
  open,
  onToggle,
  onWarn,
  insertContext,
  onInsertInto,
  onInsertIntoMulti,
  onCancelInsert,
  swapContext,
  onSwapWith,
  onCancelSwap,
  onApplyPalette,
  paletteOnly,
}: SidebarProps) {
  const [tab, setTab] = useState<TopTab>(() => readSavedTab());
  const hydratedRef = useRef(false);
  // Twenty-third pass — preserve-children toggle for swap context.
  // Default false (existing behaviour). Reset whenever the swap target
  // changes so a new swap session starts with the safer default and
  // the user must explicitly opt in again.
  const [preserveChildrenSwap, setPreserveChildrenSwap] = useState(false);
  useEffect(() => {
    setPreserveChildrenSwap(false);
  }, [swapContext?.targetOid ?? null]);

  // Phase 5 / Phase C — when an insert / swap context arrives, force the
  // Components tab so the user sees asset cards. The other tabs (Media /
  // Icons / Style / Palettes) don't all support structural insert (Style
  // and Palettes apply to existing elements), so guiding the user to
  // Components avoids dead clicks. Once they cancel or commit, they
  // return to whatever tab they had before.
  //
  // Twenty-third pass — palette-only mount (FocusEditor library entry)
  // forces the Palettes tab. The two forces are mutually exclusive at
  // the modal layer (LibraryModal already gates `paletteOnly` on the
  // absence of a structural context), but check both here in stable
  // priority order so a future caller that sets both can't surprise us.
  //
  // Thirty-third-pass — Swap auto-category routing. When the swap
  // context has a `suggestedPanel`, route to that panel (e.g. an
  // `<img>` swap goes to Media instead of Components). Insert context
  // ignores the suggestion since insert-into-img would be unusual;
  // future revisions may extend if needed.
  useEffect(() => {
    if (insertContext) {
      setTab("components");
      return;
    }
    if (swapContext) {
      const panel = swapContext.suggestedPanel;
      if (panel === "media") setTab("media");
      else if (panel === "icons") setTab("icons");
      else setTab("components");
      return;
    }
    if (paletteOnly) {
      setTab("palettes");
    }
  }, [insertContext, swapContext, paletteOnly]);

  // Phase 5 / Phase C — wrap the legacy `onInsert` so the click handlers
  // inside ComponentsPanel / MediaPanel / IconsPanel can stay shape-stable.
  // When a structural context is active, the wrapped handler routes
  // through the new structural callbacks; otherwise it forwards to the
  // legacy cursor-position insert.
  const wrappedInsert = useCallback(
    (text: string, opts?: { position?: "cursor" | "top" }) => {
      if (insertContext) {
        const additionals = insertContext.additionalParentOids ?? [];
        if (additionals.length > 0 && onInsertIntoMulti) {
          // Phase 6 ramp — multi-target: dispatch the batched handler.
          // The host's handleInsertIntoMulti owns iterate-and-batch +
          // single setCode + count-aware toast.
          onInsertIntoMulti([insertContext.parentOid, ...additionals], text);
          return;
        }
        if (onInsertInto) {
          onInsertInto(insertContext.parentOid, text);
          return;
        }
      }
      if (swapContext && onSwapWith) {
        // Twenty-third pass — pass the toggle state as the preserve-
        // children flag. When false (default), routes through the
        // existing v1 discard-children path; when true, applySwap
        // splices the source's children into the asset's root.
        onSwapWith(swapContext.targetOid, text, preserveChildrenSwap);
        return;
      }
      onInsert(text, opts);
    },
    [
      insertContext,
      swapContext,
      onInsertInto,
      onInsertIntoMulti,
      onSwapWith,
      onInsert,
      preserveChildrenSwap,
    ]
  );

  const headerLabel = useMemo(() => {
    if (insertContext) {
      const additionals = insertContext.additionalParentOids ?? [];
      if (additionals.length > 0) {
        // Multi-target — show the count instead of a single tag.
        const total = additionals.length + 1;
        return `Insert into ${total} elements`;
      }
      return `Insert into <${insertContext.targetTag}>`;
    }
    if (swapContext) return `Swap <${swapContext.targetTag}>`;
    if (paletteOnly) return "Palettes";
    return "Library";
  }, [insertContext, swapContext, paletteOnly]);

  const contextActive = !!(insertContext || swapContext);

  // Hydrate persisted open state on first mount, mirroring the previous
  // Sidebar's behavior so a saved-closed sidebar stays closed across reloads.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const saved = readSavedOpen();
    if (saved !== null && saved !== open) onToggle(saved);
  }, [onToggle, open]);

  // Persist open state.
  useEffect(() => {
    if (!hydratedRef.current) return;
    writeSavedOpen(open);
  }, [open]);

  // Persist active top-tab.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(TAB_KEY, tab);
    } catch {}
  }, [tab]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          log("click Open (collapsed strip)");
          onToggle(true);
        }}
        aria-label="Open asset library"
        className="flex h-full w-10 shrink-0 flex-col items-center justify-start gap-2 border-l-2 border-ink bg-paper px-0 py-3 font-mono text-[9px] uppercase tracking-[0.3em] text-ink hover:bg-soft"
      >
        <span className="mt-1 text-lg" aria-hidden>
          ⬚
        </span>
        <span className="origin-center rotate-180 [writing-mode:vertical-rl]">
          Library
        </span>
      </button>
    );
  }

  return (
    <aside
      className="flex h-full w-full shrink-0 flex-col border-l-2 border-ink bg-paper"
      aria-label="Asset library"
    >
      <header className="flex shrink-0 flex-col gap-1 border-b-2 border-ink px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-base leading-none">
            {headerLabel}
          </span>
          <button
            type="button"
            onClick={() => {
              log("click Close");
              onToggle(false);
            }}
            aria-label="Close library"
            className="border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-ink hover:text-paper"
          >
            ×
          </button>
        </div>
        {contextActive && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-coral">
              {insertContext ? "Pick an element to insert" : "Pick a replacement"}
            </span>
            <button
              type="button"
              onClick={() => {
                log("click cancel context", { insert: !!insertContext, swap: !!swapContext });
                if (insertContext) onCancelInsert?.();
                if (swapContext) onCancelSwap?.();
              }}
              className="border border-ink bg-paper px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper"
            >
              Cancel
            </button>
            {/* Twenty-third pass — preserve-children toggle. Visible
                only during swap context (insert-into doesn't carry an
                existing children slot to preserve). When checked, the
                next tile click triggers applySwap with preserveChildren
                true, splicing the source element's children into the
                asset's root. Default unchecked. Resets each time the
                swap target changes (see useEffect above). */}
            {swapContext && (
              <label
                className="ml-auto flex shrink-0 cursor-pointer items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink"
                title="Splice the source element's children into the asset's root"
              >
                <input
                  type="checkbox"
                  checked={preserveChildrenSwap}
                  onChange={(e) => {
                    log("toggle keep children", { next: e.target.checked });
                    setPreserveChildrenSwap(e.target.checked);
                  }}
                  className="h-3 w-3 cursor-pointer accent-coral"
                />
                Keep children
              </label>
            )}
          </div>
        )}
      </header>

      <div
        role="tablist"
        aria-label="Library sections"
        className="grid shrink-0 grid-cols-5 border-b-2 border-ink bg-paper"
      >
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => {
                log("switch tab", { tab: t.id });
                setTab(t.id);
              }}
              className={
                "border-r border-ink px-2 py-2 font-mono text-[9px] uppercase tracking-[0.15em] last:border-r-0 transition-colors " +
                (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1">
        {tab === "components" && (
          <ComponentsPanel
            mode={mode}
            onInsert={wrappedInsert}
            onWarn={onWarn}
            // Thirty-third-pass — Swap auto-category. When the swap
            // context's suggestedCategory is set AND the components
            // panel is the active tab, pre-fill the category filter
            // for this swap session. Insert context doesn't pass a
            // suggestion; future revisions may extend.
            initialCategory={
              swapContext?.suggestedCategory ?? null
            }
            // Reset the panel's filter override when the swap target
            // changes (e.g. user cancels swap, picks a different
            // element, re-enters swap). The targetOid is the natural
            // session boundary.
            initialCategoryKey={swapContext?.targetOid ?? null}
            // Phase E proper — slot envelope drives the compatibility
            // filter. Null when iframe hasn't measured yet OR the
            // user is browsing without an active swap context (panel
            // shows its standard grid in that case).
            slotEnvelope={swapContext?.slotEnvelope ?? null}
          />
        )}
        {tab === "media" && <MediaPanel mode={mode} onInsert={wrappedInsert} />}
        {tab === "icons" && <IconsPanel mode={mode} onInsert={wrappedInsert} />}
        {tab === "style" && <StylePanel mode={mode} onInsert={wrappedInsert} />}
        {tab === "palettes" && (
          <PalettesSection
            onApplyPalette={onApplyPalette}
            disabled={contextActive}
          />
        )}
      </div>
    </aside>
  );
}
