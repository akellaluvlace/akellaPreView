// Phase E proper — Library asset compatibility filter / sort.
//
// At swap-time the LibraryModal grid renders ~500 components. When the
// user invokes Swap WITH a selected element, the modal needs to know
// which assets fit the slot, dim the rest, and (optionally) move
// compatibles to the front. This module is the pure decision layer.
//
// Inputs:
//   - asset list (just ids — the modal already has full metadata loaded)
//   - capacity source (records map from `parseCapacityFile` + per-asset
//     fallback class strings for static analysis)
//   - slot envelope (from `composeEnvelopeFromBbox`)
//   - sort strategy ("compatible-first" or "as-given")
//
// Output:
//   - per-asset classification with fit reasons
//   - sort key for the modal's render order
//
// Pure-logic only — no React, no DOM, no fetch.

import {
  slotCapacityFits,
  unconstrainedCapacity,
  type FitVerdict,
  type SlotCapacity,
  type SlotCategory,
  type SlotEnvelope,
} from "./slot-capacity";
import { lookupCapacity } from "./capacity-loader";

export type AssetCompatStatus =
  | "compatible"     // Capacity exists AND envelope fits
  | "incompatible"   // Capacity exists AND envelope DOESN'T fit
  | "unknown";       // No capacity available + no fallback classes (treat as compatible
                     // for safety; user can still swap, just at their own risk)

export interface AssetCompat {
  readonly assetId: string;
  readonly status: AssetCompatStatus;
  readonly verdict: FitVerdict;
  // The capacity used for the fit check. Useful for "how do I know" tooltip.
  readonly capacity: SlotCapacity;
}

export interface ClassifyAssetsOpts {
  // Per-asset fallback class string, used when `records` doesn't have the
  // assetId. Missing in this map means "no fallback available" → unknown.
  readonly fallbackClasses?: ReadonlyMap<string, string>;
  // Per-asset category for static-analysis fallback. Missing → "unknown".
  readonly assetCategories?: ReadonlyMap<string, SlotCategory>;
}

// Classify each asset's compatibility against the given envelope.
// Returns one entry per input id, in input order.
export function classifyAssets(
  assetIds: ReadonlyArray<string>,
  records: ReadonlyMap<string, SlotCapacity> | null,
  envelope: SlotEnvelope,
  opts: ClassifyAssetsOpts = {},
): AssetCompat[] {
  const fallbackClasses = opts.fallbackClasses ?? new Map<string, string>();
  const assetCategories = opts.assetCategories ?? new Map<string, SlotCategory>();
  const out: AssetCompat[] = [];

  for (const id of assetIds) {
    const fallback = fallbackClasses.get(id) ?? null;
    const category = assetCategories.get(id) ?? "unknown";
    const capacity = lookupCapacity(records, id, fallback, category);

    if (capacity === null) {
      // No capacity at all. Treat as unknown (default-allow). The
      // caller may render unknown assets with a "?" badge and skip the
      // tooltip "fits this slot" claim.
      const safeCap = unconstrainedCapacity(category);
      const verdict = slotCapacityFits(envelope, safeCap);
      out.push({ assetId: id, status: "unknown", verdict, capacity: safeCap });
      continue;
    }

    const verdict = slotCapacityFits(envelope, capacity);
    out.push({
      assetId: id,
      status: verdict.ok ? "compatible" : "incompatible",
      verdict,
      capacity,
    });
  }

  return out;
}

export type SortStrategy = "compatible-first" | "as-given";

// Sort the classified assets per strategy. Stable: preserves the
// original order within each compatibility bucket.
//
//   "compatible-first" → compatibles first, then unknowns, then incompatibles.
//   "as-given" → no reorder; same order as input.
//
// Most LibraryModal flows want "compatible-first" when invoked from a
// selected slot, so the user's eye lands on usable options first.
export function sortClassifiedAssets(
  classified: ReadonlyArray<AssetCompat>,
  strategy: SortStrategy,
): AssetCompat[] {
  if (strategy === "as-given") return classified.slice();

  const compatible: AssetCompat[] = [];
  const unknown: AssetCompat[] = [];
  const incompatible: AssetCompat[] = [];

  for (const c of classified) {
    if (c.status === "compatible") compatible.push(c);
    else if (c.status === "unknown") unknown.push(c);
    else incompatible.push(c);
  }

  return [...compatible, ...unknown, ...incompatible];
}

// Convenience: classify + sort in one call, plus return aggregated counts
// for the filter-chip badge ("142 of 500 fit").
export function filterAndSortLibrary(
  assetIds: ReadonlyArray<string>,
  records: ReadonlyMap<string, SlotCapacity> | null,
  envelope: SlotEnvelope,
  opts: ClassifyAssetsOpts & { strategy?: SortStrategy } = {},
): {
  ordered: AssetCompat[];
  counts: { compatible: number; unknown: number; incompatible: number };
} {
  const classified = classifyAssets(assetIds, records, envelope, opts);
  const ordered = sortClassifiedAssets(classified, opts.strategy ?? "compatible-first");
  let compatible = 0;
  let unknown = 0;
  let incompatible = 0;
  for (const c of classified) {
    if (c.status === "compatible") compatible++;
    else if (c.status === "unknown") unknown++;
    else incompatible++;
  }
  return { ordered, counts: { compatible, unknown, incompatible } };
}

// Compose a tooltip string for a single asset's incompatibility reasons.
// Returns null when the asset is compatible.
export function fitReasonsTooltip(compat: AssetCompat): string | null {
  if (compat.status === "compatible") return null;
  if (compat.status === "unknown") return "Fit unknown (no capacity data)";
  if (!compat.verdict.ok) return `Won't fit: ${compat.verdict.reasons.join("; ")}`;
  return null;
}
