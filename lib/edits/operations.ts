// Phase C / B.1 — Pure operations on Edit / FileDiff.
//
// Same conventions as `lib/files/operations.ts`: every function is immutable,
// failures return `{ ok: false; error }` instead of throwing, identity-equal
// returns on no-op for hot paths.
//
// Pure: no React, no DOM, no IndexedDB. The React hook (Phase B.2) wraps
// these in `useEditHistory` to give Workspace a familiar setCode / undo /
// redo surface. The pure layer here is what the host-side undo stack runs on.

import {
  type EditId,
  type FileDiff,
  type Edit,
  type EditApplyResult,
  COALESCE_WINDOW_MS,
  BULK_EDIT_THRESHOLD,
} from "./types";
import { updateFileSource } from "../files/operations";
import type { FileId, Project } from "../files/types";

// ────────────────────────────────────────────────────────────────────────────
// ID generation
// ────────────────────────────────────────────────────────────────────────────

// Same pattern as `createFileId` — base-36 timestamp + 6 random chars (split
// across two calls so a Math.random spike doesn't repeat). Sortable for
// debugging. Not cryptographic.
function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 5).padEnd(3, "0");
}

export function createEditId(): EditId {
  return (Date.now().toString(36) + randomSuffix() + randomSuffix()) as EditId;
}

// ────────────────────────────────────────────────────────────────────────────
// Edit construction
// ────────────────────────────────────────────────────────────────────────────

export interface CreateEditOpts {
  readonly diffs: readonly FileDiff[];
  readonly reason?: string;
  // Override for `Date.now()` — tests pass an explicit `ts` so coalesce-
  // window tests are deterministic without fake-timers infra. Production
  // never sets it.
  readonly ts?: number;
}

export type CreateEditResult =
  | { ok: true; edit: Edit }
  | { ok: false; error: string };

export function createEdit(opts: CreateEditOpts): CreateEditResult {
  if (opts.diffs.length === 0) {
    return { ok: false, error: "edit must contain at least one diff" };
  }
  // Reject duplicate fileIds — see types.ts FileDiff invariant docblock.
  // Linear scan is fine; multi-file edits in v1 will rarely exceed 5 diffs.
  const seen = new Set<FileId>();
  for (const d of opts.diffs) {
    if (seen.has(d.fileId)) {
      return {
        ok: false,
        error: `duplicate fileId in diffs: ${d.fileId}`,
      };
    }
    seen.add(d.fileId);
  }
  return {
    ok: true,
    edit: {
      id: createEditId(),
      ts: opts.ts ?? Date.now(),
      reason: opts.reason,
      diffs: opts.diffs,
    },
  };
}

// Common 1-diff convenience: build an Edit from "this file's source is now
// `newSource`". Reads the current `before` from the project; if the source is
// identical, returns a "no-op" result (the caller can skip pushing onto the
// undo stack). If the file is missing, returns a hard error — Workspace's
// state should never have a stale fileId at this layer.
export type EditFromSourceChangeResult =
  | { ok: true; edit: Edit }
  | { ok: true; edit: null /* no-op */ }
  | { ok: false; error: string };

export function editFromSourceChange(
  project: Project,
  fileId: FileId,
  newSource: string,
  opts?: { reason?: string; ts?: number },
): EditFromSourceChangeResult {
  const file = project.files.get(fileId);
  if (!file) return { ok: false, error: `file not found: ${fileId}` };
  if (file.source === newSource) return { ok: true, edit: null };
  const r = createEdit({
    diffs: [{ fileId, before: file.source, after: newSource }],
    reason: opts?.reason,
    ts: opts?.ts,
  });
  if (!r.ok) return r;
  return { ok: true, edit: r.edit };
}

// ────────────────────────────────────────────────────────────────────────────
// Apply / revert (forward / inverse)
// ────────────────────────────────────────────────────────────────────────────

// Apply forward: every diff's `after` becomes the file's new source. Validates
// each fileId exists AND its current source matches `before` — a mismatch
// means concurrent state divergence (something else modified the file) and
// the apply is unsafe to proceed with. Returns the validation error so the
// caller can surface it via showWarn rather than silently corrupting.
export function applyEdit(project: Project, edit: Edit): EditApplyResult {
  // Validate every diff first so we don't half-apply on the second diff's
  // failure. Atomicity: either every diff applies or none.
  for (const d of edit.diffs) {
    const file = project.files.get(d.fileId);
    if (!file) {
      return {
        ok: false,
        error: `apply failed: file not found in project: ${d.fileId}`,
      };
    }
    if (file.source !== d.before) {
      return {
        ok: false,
        error: `apply failed: ${d.fileId} source diverged from edit's "before" snapshot`,
      };
    }
  }
  // All diffs valid — apply in order. updateFileSource short-circuits when
  // before === after (which can't happen here since createEdit rejects
  // empty diffs, but it does happen on re-applies of an already-applied
  // edit — defensive identity preservation).
  let next = project;
  for (const d of edit.diffs) {
    const r = updateFileSource(next, d.fileId, d.after);
    if (!r.ok) return r;
    next = r.project;
  }
  return { ok: true, project: next };
}

// Revert (undo): every diff's `before` becomes the file's source. Mirror
// validation — current source must match `after` for the revert to be safe.
export function revertEdit(project: Project, edit: Edit): EditApplyResult {
  for (const d of edit.diffs) {
    const file = project.files.get(d.fileId);
    if (!file) {
      return {
        ok: false,
        error: `revert failed: file not found in project: ${d.fileId}`,
      };
    }
    if (file.source !== d.after) {
      return {
        ok: false,
        error: `revert failed: ${d.fileId} source diverged from edit's "after" snapshot`,
      };
    }
  }
  let next = project;
  for (const d of edit.diffs) {
    const r = updateFileSource(next, d.fileId, d.before);
    if (!r.ok) return r;
    next = r.project;
  }
  return { ok: true, project: next };
}

// ────────────────────────────────────────────────────────────────────────────
// Coalesce
// ────────────────────────────────────────────────────────────────────────────

export interface CoalesceOpts {
  readonly windowMs?: number;        // defaults to COALESCE_WINDOW_MS
  readonly bulkThreshold?: number;   // defaults to BULK_EDIT_THRESHOLD
}

// tryCoalesce: when sequential same-fileId single-file edits fire fast (300ms
// window) and stay below the bulk threshold (50-char delta), merge into a
// single undo entry. Typing for 2 seconds becomes one Cmd-Z, not 60.
//
// Returns null when the edits should NOT coalesce (different fileIds, multi-
// file edits, outside time window, or bulk delta). The caller then pushes
// `next` as a fresh entry.
//
// The merged edit preserves prev's `before` (the original state) and takes
// next's `after` (the latest state) — undoing it rewinds all the way past
// every coalesced keystroke in one step.
export function tryCoalesce(
  prev: Edit,
  next: Edit,
  opts?: CoalesceOpts,
): Edit | null {
  const windowMs = opts?.windowMs ?? COALESCE_WINDOW_MS;
  const bulkThreshold = opts?.bulkThreshold ?? BULK_EDIT_THRESHOLD;

  // Multi-file edits are explicit gestures. They never coalesce, regardless
  // of timing — even rapid library inserts deserve their own undo step.
  if (prev.diffs.length !== 1 || next.diffs.length !== 1) return null;
  const pd = prev.diffs[0];
  const nd = next.diffs[0];

  // Different file → no coalesce. (Single-file at this point; tabbed editing
  // can produce alternating-file edits within the window.)
  if (pd.fileId !== nd.fileId) return null;

  // Outside the time window → no coalesce.
  if (next.ts - prev.ts >= windowMs) return null;

  // Bulk delta on the NEW edit → no coalesce. We measure on the new edit's
  // own delta (not the cumulative coalesced delta) because the bulk-edit
  // semantics are about the size of THIS gesture, not the typing run.
  // A long typing run of small keystrokes coalesces fine; a single big
  // paste opens its own entry.
  const delta = Math.abs(nd.after.length - nd.before.length);
  if (delta > bulkThreshold) return null;

  // Continuity check: the coalesce only makes sense if next's `before`
  // matches prev's `after`. Otherwise we'd be merging two diverged edit
  // chains. Defensive — production should never produce this shape, but
  // catching it here surfaces invariant-violating callers.
  if (nd.before !== pd.after) return null;

  return {
    id: next.id,           // keep next's id — most recent gesture wins for sorting
    ts: next.ts,           // most recent timestamp keeps the rolling window open
    reason: prev.reason ?? next.reason,
    diffs: [
      {
        fileId: pd.fileId,
        before: pd.before, // preserve the original state
        after: nd.after,   // jump to the latest state
      },
    ],
  };
}
