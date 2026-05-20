"use client";

// 2026-05-20 — Palette button + popover. Pulled the Palettes section
// out of the right-side library sidebar and made it a top-toolbar
// affordance. Click the button → small popover anchored below shows
// the 12 PALETTES tiles. Click a tile → host runs applyPalette(id, "all").
// Click outside / press Esc → closes.
//
// Self-contained presentation: outside-click + Escape dismiss + first-
// tile focus management. The Workspace passes the onApplyPalette
// callback verbatim (same one the sidebar used to wire); only the
// shell of the UI changed.

import { useCallback, useEffect, useRef, useState } from "react";
import { PALETTES, type Palette } from "@/lib/palettes";

interface PalettePopoverProps {
  onApplyPalette: (paletteId: string) => void;
}

function PaletteIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Stylized artist palette outline + thumb hole */}
      <path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1.5 1-2.5s-.5-2.5 1-2.5h2a4 4 0 0 0 4-4 9 9 0 0 0-8-9Z" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="12" cy="7" r="1" />
      <circle cx="16" cy="10" r="1" />
      <circle cx="8" cy="15" r="1" />
    </svg>
  );
}

export default function PalettePopover({ onApplyPalette }: PalettePopoverProps) {
  const [open, setOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Outside-click + Escape dismiss. Click-listener attached to document
  // only while open so we don't pay an event-tick when the popover
  // isn't mounted.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (popoverRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        // Restore focus to the trigger so keyboard users can press
        // Enter again to reopen without re-finding the button.
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleTileClick = useCallback(
    (paletteId: string) => {
      setPendingId(paletteId);
      onApplyPalette(paletteId);
      // Close after the click — palette swap is a one-shot intent.
      // Brief pendingId hold gives the tile a visible "I clicked"
      // affordance before the popover unmounts.
      window.setTimeout(() => {
        setPendingId(null);
        setOpen(false);
      }, 250);
    },
    [onApplyPalette],
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Apply a color palette to the entire site"
        className={
          "flex h-12 min-w-[64px] cursor-pointer flex-col items-center justify-center gap-0.5 border-2 border-ink px-3 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors " +
          (open
            ? "bg-coral text-paper"
            : "bg-paper text-ink hover:bg-soft")
        }
      >
        <span aria-hidden="true" className="leading-none">
          <PaletteIcon />
        </span>
        <span className="hidden leading-none md:inline">Palette</span>
      </button>
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Choose a color palette"
          className="absolute left-0 top-full z-50 mt-2 w-[min(420px,90vw)] border-2 border-ink bg-paper shadow-[6px_6px_0_0_#FF4D2E]"
        >
          <div className="border-b-2 border-ink bg-soft px-3 py-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
              {PALETTES.length} palettes
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
            {PALETTES.map((p) => (
              <PaletteTile
                key={p.id}
                palette={p}
                pending={pendingId === p.id}
                onClick={() => handleTileClick(p.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface PaletteTileProps {
  palette: Palette;
  pending: boolean;
  onClick: () => void;
}

function PaletteTile({ palette, pending, onClick }: PaletteTileProps) {
  const swatch = palette.swatch;
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Apply ${palette.name} — ${palette.vibe}`}
      className={
        "flex flex-col items-stretch gap-1 border-2 border-ink bg-paper p-1.5 text-left transition-colors hover:bg-soft active:bg-ink active:text-paper " +
        (pending ? "ring-2 ring-coral ring-offset-1 ring-offset-paper" : "")
      }
      aria-label={`Apply ${palette.name} palette — ${palette.vibe}`}
    >
      <div
        className="h-10 border border-ink"
        style={{ background: swatch.bg }}
      >
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          <div style={{ background: swatch.primary }} />
          <div style={{ background: swatch.accent }} />
          <div style={{ background: swatch.neutral }} />
        </div>
      </div>
      <span className="font-display text-[11px] leading-tight text-ink">
        {palette.name}
      </span>
    </button>
  );
}
