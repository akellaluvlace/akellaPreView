// Phase F foundation — Pre-flight envelope check across all instances.
//
// Composition layer: ties Phase F's `findAllInstancesOfDefinition`
// (`lib/ast/instance-graph.ts`) to Phase E's `slotCapacityFits`
// (`lib/swap/slot-capacity.ts`).
//
// Q10 locked-decision context: when the user invokes "Apply: everywhere"
// Swap on `<Card />`, the new asset's capacity must satisfy EVERY call
// site's slot envelope. If any single call site fails, the swap aborts
// atomically. This module implements that "all or nothing" check; the
// caller (Phase F Workspace wiring) decides whether to surface failures
// in a toast and prompt for confirmation, or just hard-abort silently.
//
// The caller provides envelopes via callback because computing them
// requires the iframe's bounding-rect machinery (see `envelope-from-bbox.ts`).
// This module stays pure — it never touches the DOM or postMessage.
//
// Pure-logic only — no React, no DOM, no fetch.

import {
  findAllInstancesOfDefinition,
  type InstanceRef,
} from "../ast/instance-graph";
import {
  slotCapacityFits,
  type SlotCapacity,
  type SlotEnvelope,
} from "./slot-capacity";
import type { FileId, Project } from "../files/types";

export interface InstanceFitFailure {
  readonly instance: InstanceRef;
  readonly reasons: string[];
}

export type PreflightResult =
  | {
      ok: true;
      instances: InstanceRef[];
      okCount: number;
    }
  | {
      ok: false;
      // Top-level error (e.g., def file not in project, parse error).
      // When this arm is set, no instance walk happened.
      topLevelReason?: string;
      // Per-instance failures (envelope-doesn't-fit reasons).
      failures: InstanceFitFailure[];
      // Instances that DID fit — included so the UI can show "12 of 13
      // fit" details if it wants to (the spec says hard-abort, but the
      // info doesn't hurt).
      okInstances: InstanceRef[];
      // Instances where the caller couldn't compute an envelope. Caller
      // decides: skip (warn) or treat as failure (abort). Default
      // recommendation per Q10: treat as failure for safety.
      missingEnvelope: InstanceRef[];
    };

// Caller hands us a per-instance envelope lookup. Returns null when the
// caller can't compute (e.g., the call site isn't currently rendered in
// the iframe — multi-page projects or hidden conditional renders).
export type EnvelopeLookup = (instance: InstanceRef) => SlotEnvelope | null;

export function preflightSwapAcrossInstances(
  project: Project,
  defFileId: FileId,
  defRootOid: string,
  newCapacity: SlotCapacity,
  envelopeFor: EnvelopeLookup,
): PreflightResult {
  const graph = findAllInstancesOfDefinition(project, defFileId, defRootOid);
  if (!graph.ok) {
    return {
      ok: false,
      topLevelReason: graph.reason,
      failures: [],
      okInstances: [],
      missingEnvelope: [],
    };
  }

  const okInstances: InstanceRef[] = [];
  const failures: InstanceFitFailure[] = [];
  const missingEnvelope: InstanceRef[] = [];

  for (const inst of graph.instances) {
    const env = envelopeFor(inst);
    if (env === null) {
      missingEnvelope.push(inst);
      continue;
    }
    const verdict = slotCapacityFits(env, newCapacity);
    if (verdict.ok) {
      okInstances.push(inst);
    } else {
      failures.push({ instance: inst, reasons: verdict.reasons });
    }
  }

  if (failures.length === 0 && missingEnvelope.length === 0) {
    return {
      ok: true,
      instances: okInstances,
      okCount: okInstances.length,
    };
  }

  return {
    ok: false,
    failures,
    okInstances,
    missingEnvelope,
  };
}

// Compose a human-readable summary for the toast. Empty result-arms are
// omitted. Format example:
//   "3 of 5 instances fit. Failures: App.jsx OID-foo (needs ≥ 320px width); ..."
export function summarizePreflightResult(result: PreflightResult): string {
  if (result.ok) {
    return `All ${result.okCount} instances fit; ready to swap.`;
  }

  if (result.topLevelReason) {
    return `Pre-flight failed: ${result.topLevelReason}`;
  }

  const parts: string[] = [];
  const total = result.failures.length + result.okInstances.length + result.missingEnvelope.length;
  parts.push(`${result.okInstances.length} of ${total} instances fit.`);

  if (result.failures.length > 0) {
    const failDescs = result.failures.slice(0, 3).map(
      (f) => `${f.instance.oid} (${f.reasons.join("; ")})`,
    );
    if (result.failures.length > 3) {
      failDescs.push(`+${result.failures.length - 3} more`);
    }
    parts.push(`Failures: ${failDescs.join("; ")}.`);
  }

  if (result.missingEnvelope.length > 0) {
    parts.push(
      `${result.missingEnvelope.length} instance(s) couldn't be measured (call sites not currently rendered).`,
    );
  }

  return parts.join(" ");
}
