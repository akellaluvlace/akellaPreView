// Phase C / B.1 — Edit + FileDiff types for the multi-file undo/redo stack.
//
// Replaces the string-snapshot history kept by `lib/use-source-history.ts`.
// One `Edit` may touch N files atomically — Phase D's cross-file className
// propagation produces multi-file edits that must undo as one Cmd-Z. v1
// single-file gestures produce 1-diff edits; the shape is the same so the
// hot path (typing) doesn't pay a price for the multi-file capability.
//
// Locked decisions:
//   - **Snapshot model** (before / after full strings, NOT patches with
//     {pos, deleteLen, insertText}). 50 entries × ~50 KB worst-case = ~2.5 MB
//     in browser memory — well below any concern. Snapshots compose trivially
//     (apply-then-revert = identity), patches need careful ordering. Phase
//     B.1 ships snapshots; a future memory-pressure optimization could
//     introduce patches without breaking the shape.
//   - **Branded EditId** for the same reason `FileId` is branded
//     (`lib/files/types.ts`): cross-API confusion stops at the type system,
//     not at runtime.
//   - **Coalesce constants colocated**: `COALESCE_WINDOW_MS = 300` and
//     `BULK_EDIT_THRESHOLD = 50` move out of the React hook into the pure
//     logic where they're testable + reusable. Same numbers as the legacy
//     hook so user-visible undo behavior stays identical when Phase B.2
//     swaps the implementation.

import type { FileId } from "../files/types";

declare const EDIT_ID_BRAND: unique symbol;
export type EditId = string & { readonly [EDIT_ID_BRAND]: true };

// FileDiff is the unit of a multi-file change. `before` is the state of the
// file at the moment the edit started; `after` is the state when the edit
// committed. Both are full source strings — see "snapshot model" above.
//
// Invariant: a single Edit must not contain two FileDiffs with the same
// `fileId`. The constructor enforces this. Phase D's cross-file ops produce
// one FileDiff per affected file; if a file ends up changed twice in a
// single gesture, the caller must merge them first.
export interface FileDiff {
  readonly fileId: FileId;
  readonly before: string;
  readonly after: string;
}

export interface Edit {
  readonly id: EditId;
  readonly ts: number;
  // Optional human-readable label. Used by the (future) Phase B undo-toast
  // ("Undid 'Library insert'") and by debugging — never compared against,
  // never serialized into IDB shape canaries. Free-form.
  readonly reason?: string;
  readonly diffs: readonly FileDiff[];
}

// Discriminated union for operations that can fail. Same convention as
// `FileOpResult` in `lib/files/types.ts`. Operations compose without try/catch.
export type EditApplyResult =
  | { ok: true; project: import("../files/types").Project }
  | { ok: false; error: string };

// Coalesce policy. Sequential same-file edits within the window AND below
// the size threshold merge into a single undo entry — typing for 2 seconds
// becomes one Cmd-Z, not 60. Multi-file edits never coalesce (they're
// explicit gestures); bulk edits never coalesce (one big paste deserves
// its own undo step even if it lands within the window).
export const COALESCE_WINDOW_MS = 300;
export const BULK_EDIT_THRESHOLD = 50;

// Ring-buffer cap for the past + future stacks. Same number as the legacy
// `lib/use-source-history.ts` so user-visible behavior is preserved when
// Phase B.2 swaps the hook implementation. Balances "deep enough to recover
// from a session of mistakes" against "shallow enough to bound memory" —
// 50 × ~5KB-50KB snapshots = 250KB to 2.5MB worst case, fine for browsers.
export const MAX_HISTORY = 50;

// History stack pair. Past = undoable; future = redoable. Forward edits
// clear future (standard linear-undo semantics; branching is out of scope).
// Both lists are immutable — operations return new History values rather
// than mutating in place, mirroring the rest of `lib/edits/`.
export interface History {
  readonly past: readonly Edit[];
  readonly future: readonly Edit[];
  // Coalesce barrier flag. Set true after any `noCoalesce: true` push (the
  // legacy `commit()` semantic — close the rolling typing window so the next
  // edit also opens its own undo step). Also set true after undo/redo so a
  // forward edit after rewinding history doesn't merge into the entry being
  // restored. Cleared on the next non-noCoalesce push that lands as a fresh
  // entry. Pure read — consumers usually don't touch this directly.
  readonly nextSkipCoalesce: boolean;
}

export const EMPTY_HISTORY: History = {
  past: [],
  future: [],
  nextSkipCoalesce: false,
};
