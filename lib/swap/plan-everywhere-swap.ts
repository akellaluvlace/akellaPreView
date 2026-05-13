// Phase F — Everywhere-mode swap orchestrator.
//
// Composes Phase D's `findCrossFileDefinition` (cross-file def lookup),
// Phase F's `findAllInstancesOfDefinition` + `preflightSwapAcrossInstances`
// (cross-instance envelope check), the existing `applySwap` engine
// (def file source mutation), and `createEdit` (multi-file Edit
// construction) into a single pure decision for the Workspace handler.
//
// The Workspace layer:
//   1. Captures the active selection's tag + project + activeFileId
//   2. Pre-fetches the per-instance envelopes via the iframe channel
//      (async; can't be done in pure logic)
//   3. Calls this helper with the resolved envelopes
//   4. Applies the returned plan: showWarn + abort, applyEditDirect,
//      or fall through to single-instance swap
//
// Q10 locked-decision: if any single instance fails preflight, the
// swap aborts atomically. The helper enforces this by returning
// `kind: "abort-preflight"` whenever preflight returns `ok: false`.

import { applySwap } from "../ast/operations/swap";
import { findCrossFileDefinition } from "../ast/cross-file-query";
import { findInlineComponentDefRootOid } from "../ast/component-def";
import { findAllInstancesOfDefinition, type InstanceRef } from "../ast/instance-graph";
import { createEdit } from "../edits/operations";
import type { Edit, FileDiff } from "../edits/types";
import { getFile } from "../files/operations";
import {
  preflightSwapAcrossInstances,
  summarizePreflightResult,
} from "./preflight";
import { readAssetRootClass } from "../ast/read-class-by-oid";
import { inferCapacityFromClasses } from "./capacity-from-source";
import {
  unconstrainedCapacity,
  type SlotCategory,
  type SlotEnvelope,
} from "./slot-capacity";
import type { FileId, Project } from "../files/types";

export type EverywhereSwapPlan =
  | {
      kind: "skip";
      // Why we skipped — surfaced as a log entry, not a toast (caller
      // falls through to single-instance swap path).
      reason: string;
    }
  | {
      kind: "abort-preflight";
      // Toast text composed via summarizePreflightResult.
      summary: string;
      affectedCount: number;
    }
  | {
      kind: "abort-bail";
      // Toast text — applySwap on the def file bailed (parse fail,
      // self-closing asset for preserveChildren, etc.).
      reason: string;
    }
  | {
      kind: "ok";
      edit: Edit;
      // Number of instances that fit (informational; the caller may
      // include it in the success toast).
      affectedCount: number;
      // Tag the user invoked on (for toast composition).
      tag: string;
      // The new oid the def's root acquired (for selection update).
      swappedDefOid: string;
    };

export interface PlanEverywhereSwapOpts {
  // Per-instance envelope lookup. Caller pre-fetched these via the
  // iframe envelope channel; instances in non-current files (multi-page
  // projects) return null → preflight reports them in `missingEnvelope`
  // and aborts atomically per Q10.
  readonly envelopeForInstance: (instance: InstanceRef) => SlotEnvelope | null;
  // The asset's slot category (from `inferSwapCategory` at the call
  // site). Used to resolve the static-analysis capacity. Defaults to
  // "unknown" — compatible-by-default.
  readonly assetCategory?: SlotCategory;
}

export function planEverywhereSwap(
  project: Project,
  activeFileId: FileId,
  activeFileSource: string,
  selectedOid: string,
  selectedTag: string,
  jsx: string,
  preserveChildren: boolean,
  opts: PlanEverywhereSwapOpts,
): EverywhereSwapPlan {
  // Skip when the selection isn't a component instance — only
  // capitalized tags resolve to a definition (`<Card />`, `<MyButton />`).
  if (!selectedTag || !/^[A-Z]/.test(selectedTag)) {
    return { kind: "skip", reason: "tag is not a component instance" };
  }

  // Resolution order matches the className-everywhere flow: in-file
  // inline def first, then cross-file via `findCrossFileDefinition`.
  // Inline def: the def lives in the active file, so the multi-file
  // Edit is actually a single diff. Cross-file def: separate file.
  const inlineDefOid = findInlineComponentDefRootOid(
    activeFileSource,
    selectedTag,
  );
  let defFileId: FileId;
  let defRootOid: string;
  let defSource: string;
  if (inlineDefOid) {
    // Skip when the user invoked swap on the def root itself — that's
    // the single-instance flow's job (no cross-instance check needed
    // because the root IS the def).
    if (inlineDefOid === selectedOid) {
      return { kind: "skip", reason: "selected element is the def root itself" };
    }
    defFileId = activeFileId;
    defRootOid = inlineDefOid;
    defSource = activeFileSource;
  } else {
    const cross = findCrossFileDefinition(project, activeFileId, selectedTag);
    if (!cross.ok) {
      return {
        kind: "skip",
        reason: cross.reason ?? "cross-file def not found",
      };
    }
    const defFile = getFile(project, cross.def.fileId);
    if (!defFile) {
      return { kind: "skip", reason: "def file not in project" };
    }
    defFileId = cross.def.fileId;
    defRootOid = cross.def.rootOid;
    defSource = defFile.source;
  }

  // Compute the new asset's capacity from its root className.
  const assetClasses = readAssetRootClass(jsx);
  const newCapacity =
    assetClasses === null
      ? unconstrainedCapacity(opts.assetCategory ?? "unknown")
      : inferCapacityFromClasses(assetClasses, {
          category: opts.assetCategory ?? "unknown",
        });

  // Pre-flight: every instance's envelope must accept newCapacity.
  // Atomic per Q10 — any failure (or missing envelope) aborts.
  const preflight = preflightSwapAcrossInstances(
    project,
    defFileId,
    defRootOid,
    newCapacity,
    opts.envelopeForInstance,
  );
  if (!preflight.ok) {
    const total =
      preflight.failures.length +
      preflight.okInstances.length +
      preflight.missingEnvelope.length;
    return {
      kind: "abort-preflight",
      summary: summarizePreflightResult(preflight),
      affectedCount: total,
    };
  }

  // All instances fit → apply swap to def file's body. The def root
  // is the topmost JSX in its function — applySwap's "Can't swap the
  // root element" bail would block us; use the allowRootSwap opt.
  const swapResult = applySwap(defSource, {
    oid: defRootOid,
    jsx,
    preserveChildren,
    allowRootSwap: true,
  });
  if (swapResult.unchanged) {
    return {
      kind: "abort-bail",
      reason: swapResult.reason ?? "swap produced no change",
    };
  }
  if (!swapResult.swappedOid) {
    return {
      kind: "abort-bail",
      reason: "swap returned no swappedOid",
    };
  }

  // Build the multi-file Edit. Single-diff when def is in active file;
  // cross-file diff otherwise. The diff's `before` is the file's
  // current source (active code or stored project file source); the
  // `after` is the post-swap source.
  const diff: FileDiff = {
    fileId: defFileId,
    before: defSource,
    after: swapResult.source,
  };
  const editResult = createEdit({
    diffs: [diff],
    reason: `everywhere-swap:<${selectedTag}>`,
  });
  if (!editResult.ok) {
    return {
      kind: "abort-bail",
      reason: editResult.error,
    };
  }

  return {
    kind: "ok",
    edit: editResult.edit,
    affectedCount: preflight.okCount,
    tag: selectedTag,
    swappedDefOid: swapResult.swappedOid,
  };
}

// Re-export for convenience.
export type { InstanceRef } from "../ast/instance-graph";
