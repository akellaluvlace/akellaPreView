// Phase E proper — swap orchestration with auto-fit.
//
// Composes `applySwap` (structural element replacement) with
// `applySwapFit` (className auto-repair) and `patchJsxClassByOid`
// (className byte patcher) so the Workspace swap handler can land both
// edits as ONE source mutation = ONE undo entry.
//
// Pure-logic only. The Workspace layer fetches the slot envelope via
// the iframe channel (Phase E proper #1) and feeds it here; this module
// owns the AST work + fit decision + class-patch composition.
//
// Bail semantics:
//   - `applySwap` bails → propagate `unchanged: true` with the same reason
//   - `applySwap` succeeds + envelope null → no fit, return swap result
//   - `applySwap` succeeds + envelope set + `readJsxClassByOid` fails
//     (no className, expression form, etc.) → no fit, return swap result
//   - `applySwap` succeeds + `applySwapFit` no-op → return swap result
//   - `applySwap` succeeds + `applySwapFit` changes → patch via
//     `patchJsxClassByOid`, return final source

import { applySwap, type SwapOperation } from "../ast/operations/swap";
import { readJsxClassByOid } from "../ast/read-class-by-oid";
import { patchJsxClassByOid } from "../ast/patch-class-by-oid";
import { applySwapFit, type SwapFitChange } from "./swap-fit";
import type { SlotEnvelope } from "./slot-capacity";

export type SwapWithFitResult =
  | { unchanged: true; reason: string | null }
  | {
      unchanged: false;
      source: string;
      swappedOid: string;
      fitChanges: ReadonlyArray<SwapFitChange>;
      fitApplied: boolean;
    };

export function applySwapWithFit(
  source: string,
  op: SwapOperation,
  envelope: SlotEnvelope | null,
): SwapWithFitResult {
  const r = applySwap(source, op);
  if (r.unchanged) {
    return { unchanged: true, reason: r.reason };
  }
  // Defensive: a successful swap normally yields a swappedOid. If the
  // engine returned null (older/edge case), we can't fit — return as-is.
  if (!r.swappedOid) {
    return {
      unchanged: false,
      source: r.source,
      swappedOid: "",
      fitChanges: [],
      fitApplied: false,
    };
  }
  // No envelope → can't decide fit. Return swap result unchanged.
  if (envelope === null) {
    return {
      unchanged: false,
      source: r.source,
      swappedOid: r.swappedOid,
      fitChanges: [],
      fitApplied: false,
    };
  }
  // Read the swapped element's classes from the post-swap source.
  const cls = readJsxClassByOid(r.source, r.swappedOid);
  if (cls === null) {
    return {
      unchanged: false,
      source: r.source,
      swappedOid: r.swappedOid,
      fitChanges: [],
      fitApplied: false,
    };
  }
  const fit = applySwapFit(cls, envelope);
  if (!fit.changed) {
    return {
      unchanged: false,
      source: r.source,
      swappedOid: r.swappedOid,
      fitChanges: [],
      fitApplied: false,
    };
  }
  // Patch the fitted classes back into the source via the byte patcher.
  // If the patch path also bails (e.g. expression form — shouldn't happen
  // since we just read a literal, but defend anyway), surface the swap
  // result without the fit so the user still gets the new element.
  const patched = patchJsxClassByOid(r.source, r.swappedOid, fit.classes);
  if (!patched.changed) {
    return {
      unchanged: false,
      source: r.source,
      swappedOid: r.swappedOid,
      fitChanges: [],
      fitApplied: false,
    };
  }
  return {
    unchanged: false,
    source: patched.source,
    swappedOid: r.swappedOid,
    fitChanges: fit.changes,
    fitApplied: true,
  };
}
