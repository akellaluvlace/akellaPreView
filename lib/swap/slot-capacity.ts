// Phase E foundation — Slot capacity metadata + fit comparison.
//
// The user's swap operation today doesn't dimension-check at all. Asset A
// might be 200×80 (a button), asset B might be 800×400 (a hero card).
// Swapping A → B in a 1/3-column grid breaks the surrounding layout.
//
// Phase E proper will:
//   1. Compute SlotCapacity for every library asset at ingest time
//      (`scripts/ingest-components.mjs` extension; output to
//      `data/component-capacities.json`). Headless browser measures the
//      asset's intrinsic min/max + aspect ratio.
//   2. At swap time, query the iframe for the target slot's available
//      envelope (existing `dropin:bbox` watch + parent computed style).
//   3. Filter the LibraryModal grid to assets whose `slotCapacityFits` is
//      ok; render incompatible assets dimmed with a reason tooltip.
//   4. Auto-fit transformation (`lib/ast/operations/swap-fit.ts`) tweaks
//      the post-swap source's classNames per 3 conservative repair rules.
//   5. Post-swap bbox assertion + showWarn on >10% drift.
//
// This module is the FOUNDATION: the types every downstream piece reads,
// plus the pure comparison function. Pure-logic only — no React, no DOM,
// no IDB, no fetch. Tested via prod-import; consumers (the ingest pipeline,
// the LibraryModal filter, the swap-fit engine) will land in their own
// chunks per the Phase E plan.

import type { SwapHintPanel } from "../swap-category-hint";

// Category mirrors `SwapCategoryHint.panel` from swap-category-hint.ts so
// the existing categorizer's output composes with capacity comparison
// without a translation layer. "unknown" covers user-extracted components
// (Phase G post-MVP) where category isn't known at extract time.
export type SlotCategory = SwapHintPanel | "unknown";

// Intrinsic dimensions an asset needs from its slot. Pixel values are at
// the asset's authored display density (no DPR scaling — that's a render-
// time concern). All four bounds are nullable:
//   - null minWidth/minHeight  = "grows to fill" — the asset uses w-full /
//     h-full or shrinks under flex pressure. No lower bound to enforce.
//   - null maxWidth/maxHeight  = "no cap" — the asset is perfectly happy
//     in arbitrarily large slots.
// aspectRatio:
//   - null = no AR constraint. The asset reflows freely.
//   - >0   = the asset's authored design assumes this AR. Slots whose
//     preferredAspectRatio (when set) deviates by >10% trigger a "drift"
//     reason in the comparison.
export interface SlotIntrinsic {
  readonly minWidthPx: number | null;
  readonly minHeightPx: number | null;
  readonly maxWidthPx: number | null;
  readonly maxHeightPx: number | null;
  readonly aspectRatio: number | null;
}

// How the asset behaves in flex / grid containers.
//   - "fill"        — uses w-full / flex-1 / similar; happy in any width
//   - "fit-content" — sizes to its own intrinsic content (most cards)
//   - "fixed"       — has a literal pixel/rem width that won't budge;
//     incompatible with any slot smaller than maxWidthPx
export type SlotFlexBehavior = "fill" | "fit-content" | "fixed";

// Origin of the capacity record. Library assets have capacities computed
// once at ingest (deterministic, reviewable). User-extracted "Make
// Component" assets compute on-the-fly at extract time (Phase G); they
// carry the source so the swap UI can warn about lower-confidence data.
export type SlotCapacitySource = "library" | "user-extracted";

export interface SlotCapacity {
  readonly category: SlotCategory;
  readonly intrinsic: SlotIntrinsic;
  readonly flexBehavior: SlotFlexBehavior;
  readonly source: SlotCapacitySource;
}

// The available container window the swap target lives in. Computed
// host-side from iframe bbox + parent computed style at swap-invoke time.
export interface SlotEnvelope {
  readonly availableWidthPx: number;
  readonly availableHeightPx: number;
  // The slot's preferred AR, if the parent enforces one (e.g., a 16:9
  // video frame, a 1:1 square). Null when the parent reflows freely.
  readonly preferredAspectRatio: number | null;
}

// Comparison result. `ok: true` means the asset fits; `ok: false` carries
// human-readable reasons the swap UI surfaces in a tooltip ("Won't fit:
// needs ≥ 320px width" — caller composes the prefix).
export type FitVerdict =
  | { ok: true }
  | { ok: false; reasons: string[] };

// Aspect-ratio drift threshold. Beyond this, the swap meaningfully changes
// the asset's vertical rhythm in the slot. Picked from Figma's published
// instance-swap behaviour (their AR-lock bug also surfaces past ~10% AR
// mismatch). Tunable; if Phase E user-testing surfaces false positives we
// can raise to 0.15.
export const AR_DRIFT_TOLERANCE = 0.1;

export function slotCapacityFits(
  envelope: SlotEnvelope,
  capacity: SlotCapacity,
): FitVerdict {
  const reasons: string[] = [];

  // Width — the most layout-breaking constraint. A min-width violation
  // means the asset OVERFLOWS the slot horizontally; modern browsers
  // reflow under flex/grid, but only when the asset's CSS allows
  // shrinking. "fixed" + minWidth > envelope is a hard fail.
  if (
    capacity.intrinsic.minWidthPx !== null &&
    capacity.intrinsic.minWidthPx > envelope.availableWidthPx
  ) {
    reasons.push(
      `needs ≥ ${capacity.intrinsic.minWidthPx}px width (slot has ${envelope.availableWidthPx}px)`,
    );
  }

  // Height — less layout-breaking (vertical rhythm tolerates more drift)
  // but still a fit concern. Fixed-height heroes shouldn't get swapped
  // into 100px slots.
  if (
    capacity.intrinsic.minHeightPx !== null &&
    capacity.intrinsic.minHeightPx > envelope.availableHeightPx
  ) {
    reasons.push(
      `needs ≥ ${capacity.intrinsic.minHeightPx}px height (slot has ${envelope.availableHeightPx}px)`,
    );
  }

  // Fixed-behavior + max-width > envelope: the asset's literal width
  // CANNOT shrink. This is the most common failure for swaps from
  // wide-card-into-grid-cell layouts.
  if (
    capacity.flexBehavior === "fixed" &&
    capacity.intrinsic.maxWidthPx !== null &&
    capacity.intrinsic.maxWidthPx > envelope.availableWidthPx
  ) {
    reasons.push(
      `fixed-width ${capacity.intrinsic.maxWidthPx}px exceeds slot's ${envelope.availableWidthPx}px`,
    );
  }

  // Aspect-ratio drift — only checked when BOTH sides have an AR
  // constraint. A free-reflowing asset in an AR slot is fine; an AR
  // asset in a free-reflowing slot is fine too. Drift fires only when
  // both pin a ratio AND those ratios diverge by >AR_DRIFT_TOLERANCE.
  if (
    capacity.intrinsic.aspectRatio !== null &&
    envelope.preferredAspectRatio !== null
  ) {
    const drift = Math.abs(
      capacity.intrinsic.aspectRatio - envelope.preferredAspectRatio,
    ) / envelope.preferredAspectRatio;
    if (drift > AR_DRIFT_TOLERANCE) {
      const pct = Math.round(drift * 100);
      reasons.push(
        `aspect ratio ${capacity.intrinsic.aspectRatio.toFixed(2)} vs slot's ${envelope.preferredAspectRatio.toFixed(2)} (${pct}% drift)`,
      );
    }
  }

  return reasons.length === 0 ? { ok: true } : { ok: false, reasons };
}

// Convenience: an "unconstrained" envelope. Used by the LibraryModal's
// filter UI when the user invokes Swap WITHOUT a selected element (e.g.,
// just browsing the library). Every capacity fits an unconstrained
// envelope; the comparison short-circuits to ok:true.
export function unconstrainedEnvelope(): SlotEnvelope {
  return {
    availableWidthPx: Number.POSITIVE_INFINITY,
    availableHeightPx: Number.POSITIVE_INFINITY,
    preferredAspectRatio: null,
  };
}

// Convenience: a "no-constraint" capacity. Used by user-extracted assets
// before their actual capacity is computed (Phase G). Always fits anywhere.
export function unconstrainedCapacity(
  category: SlotCategory = "unknown",
): SlotCapacity {
  return {
    category,
    intrinsic: {
      minWidthPx: null,
      minHeightPx: null,
      maxWidthPx: null,
      maxHeightPx: null,
      aspectRatio: null,
    },
    flexBehavior: "fill",
    source: "user-extracted",
  };
}
