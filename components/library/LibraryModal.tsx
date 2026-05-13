"use client";

// Phase 5 / Phase C1.4 + C2.3 — Library overlay for FocusEditor's
// isolated mode. The workspace renders the library as a side rail
// (Sidebar.tsx); inside FocusEditor there's no rail, so insert / swap
// flows mount the same Sidebar component as a modal overlay at the
// right edge of the focus view.
//
// Twenty-third pass — palette-only mode. Spec §C4.3 expects palette
// access from isolated mode, but Phase C / C4.3 only opened the modal
// on insert/swap context. To reach palettes from FocusEditor users had
// to enter Insert or Swap first, which is wrong (palette is a
// page-/subtree-level visual change, not a structural edit). The
// modal now also opens when `paletteOnly` is true. The Sidebar has a
// matching prop that forces the Palettes tab when active.

import type {
  PreviewKind,
} from "@/lib/preview";
import ComponentLibrarySidebar, {
  type SidebarInsertContext,
  type SidebarSwapContext,
} from "./Sidebar";

export interface LibraryModalProps {
  mode: PreviewKind;
  // Same wired callbacks as the workspace Sidebar — handlers come from
  // Workspace state and route to applyInsertChild / applySwap /
  // applyPalette under the hood.
  insertContext?: SidebarInsertContext | null;
  swapContext?: SidebarSwapContext | null;
  onInsertInto?: (parentOid: string, assetText: string) => void;
  // Phase 6 ramp — multi-target Insert dispatch. Sidebar uses this when
  // `insertContext.additionalParentOids` is non-empty. Routes through
  // Workspace's `handleInsertIntoMulti`.
  onInsertIntoMulti?: (parentOids: string[], assetText: string) => void;
  // Twenty-third pass — third arg pipes through the Sidebar's
  // "Keep children" toggle. See `lib/ast/operations/swap.ts` for the
  // engine's preserve-children semantics.
  onSwapWith?: (
    targetOid: string,
    assetText: string,
    preserveChildren?: boolean
  ) => void;
  onApplyPalette?: (paletteId: string) => void;
  // Cancel handlers close the modal by clearing the underlying context.
  onCancelInsert?: () => void;
  onCancelSwap?: () => void;
  onWarn?: (message: string) => void;
  // Twenty-third pass — palette-only entry from FocusEditor. When true
  // (and no insert/swap context), the modal opens to the Palettes tab
  // so users can apply a subtree-scoped palette without entering
  // Insert/Swap first. `onClosePaletteOnly` is invoked when the user
  // clicks the backdrop / the Sidebar close button while in this mode.
  paletteOnly?: boolean;
  onClosePaletteOnly?: () => void;
}

export default function LibraryModal({
  mode,
  insertContext,
  swapContext,
  onInsertInto,
  onInsertIntoMulti,
  onSwapWith,
  onApplyPalette,
  onCancelInsert,
  onCancelSwap,
  onWarn,
  paletteOnly,
  onClosePaletteOnly,
}: LibraryModalProps) {
  // Insert / swap context wins over palette-only when both are set
  // (shouldn't happen in practice — Workspace's tool state machine
  // never toggles paletteOnly while Insert/Swap is active — but the
  // precedence guard keeps the modal coherent if a future caller
  // sets both).
  const structuralActive = !!(insertContext || swapContext);
  const open = structuralActive || !!paletteOnly;
  if (!open) return null;

  function handleClose() {
    if (insertContext) {
      onCancelInsert?.();
      return;
    }
    if (swapContext) {
      onCancelSwap?.();
      return;
    }
    if (paletteOnly) {
      onClosePaletteOnly?.();
    }
  }

  const ariaLabel = insertContext
    ? `Insert into ${insertContext.targetTag}`
    : swapContext
    ? `Swap ${swapContext.targetTag}`
    : paletteOnly
    ? "Palettes"
    : "Library";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-stretch justify-end pointer-events-none"
      role="dialog"
      aria-label={ariaLabel}
    >
      {/* Backdrop — translucent paper layer over the focus view. Pointer
          events catch clicks outside the rail to dismiss the modal. */}
      <button
        type="button"
        aria-label="Close library"
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-paper/40 pointer-events-auto"
      />
      {/* Rail — same width as the workspace Sidebar so users get
          familiar layout. Sits right-edge with a hard border to read
          as a panel rather than an overlay. */}
      <div className="relative pointer-events-auto h-full">
        <ComponentLibrarySidebar
          mode={mode}
          // Modal-mode never falls back to the legacy cursor insert —
          // either a structural context is active, or paletteOnly mode
          // is active and the only meaningful tile click is on a
          // palette tile. The legacy onInsert is a no-op safety net.
          onInsert={() => {}}
          open={true}
          onToggle={(next) => {
            if (!next) handleClose();
          }}
          onWarn={onWarn}
          insertContext={insertContext ?? null}
          onInsertInto={onInsertInto}
          onInsertIntoMulti={onInsertIntoMulti}
          onCancelInsert={onCancelInsert}
          swapContext={swapContext ?? null}
          onSwapWith={onSwapWith}
          onCancelSwap={onCancelSwap}
          onApplyPalette={onApplyPalette}
          paletteOnly={!structuralActive && !!paletteOnly}
        />
      </div>
    </div>
  );
}
