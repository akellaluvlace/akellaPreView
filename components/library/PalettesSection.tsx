"use client";

// Phase 5 / Phase C4.3 — Library Palettes section. Replaces the Phase A
// DiceBar's palette roller with a deterministic, click-to-apply tile
// grid mounted as the 5th tab inside the library sidebar.
//
// Each tile shows the palette's three role colors (primary / accent /
// neutral) over a paper / ink preview surface. Click → host runs
// `applyPalette` with the appropriate scope (FocusEditor isolated mode
// → subtree only; workspace mode → "all"). The scope decision lives in
// the Workspace handler; this component only fires the palette id.

import { useCallback, useState } from "react";
import { PALETTES, type Palette } from "@/lib/palettes";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:PalettesSection] ${msg}`, data ?? "");
}

export interface PalettesSectionProps {
  // When omitted, the section renders disabled tiles with a tooltip —
  // happens during the brief Workspace mount window before the handler
  // is wired up. Wired callers always supply this.
  onApplyPalette?: (paletteId: string) => void;
  // True when an insert / swap context is active. Palettes don't apply
  // during a structural pick (Insert / Swap); we visually disable them
  // so the user knows the row is currently a no-op.
  disabled?: boolean;
}

export default function PalettesSection({
  onApplyPalette,
  disabled,
}: PalettesSectionProps) {
  const [pending, setPending] = useState<string | null>(null);

  const handleClick = useCallback(
    (paletteId: string) => {
      if (disabled || !onApplyPalette) return;
      log("apply palette", { paletteId });
      setPending(paletteId);
      onApplyPalette(paletteId);
      // Clear the spinner shortly — applyPalette is synchronous on the
      // host but the iframe rebuild settles ~250ms later. Holding the
      // pending state for that window gives a visible "I clicked" cue.
      window.setTimeout(() => setPending(null), 350);
    },
    [disabled, onApplyPalette]
  );

  const effectivelyDisabled = disabled || !onApplyPalette;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b-2 border-ink bg-paper px-3 py-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
          {PALETTES.length} palettes
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 p-3">
          {PALETTES.map((p) => (
            <PaletteTile
              key={p.id}
              palette={p}
              pending={pending === p.id}
              disabled={effectivelyDisabled}
              onClick={() => handleClick(p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PaletteTileProps {
  palette: Palette;
  pending: boolean;
  disabled: boolean;
  onClick: () => void;
}

function PaletteTile({ palette, pending, disabled, onClick }: PaletteTileProps) {
  const swatch = palette.swatch;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={
        disabled
          ? "Cancel the current insert/swap to apply a palette"
          : `Apply ${palette.name} palette`
      }
      className={
        "flex flex-col items-stretch gap-1.5 border-2 border-ink bg-paper p-2 text-left transition-colors " +
        (disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:bg-soft active:bg-ink active:text-paper") +
        (pending ? " ring-2 ring-coral ring-offset-1 ring-offset-paper" : "")
      }
      aria-label={`Apply ${palette.name} palette — ${palette.vibe}`}
    >
      {/* Surface preview chip — paper bg, ink fg, plus three color stripes. */}
      <div
        className="h-12 border border-ink"
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
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-[12px] leading-tight text-ink">
          {palette.name}
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
          {palette.vibe}
        </span>
      </div>
    </button>
  );
}
