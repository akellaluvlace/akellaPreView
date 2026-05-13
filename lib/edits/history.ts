// Phase C / B.1 — Pure History stack management.
//
// Wraps the past/future ring-buffers that `useSourceHistory` (legacy) tracks
// internally as React state, but as pure functions over a `History` value.
// Phase B.2's `useEditHistory` hook will own a `useState<History>` and call
// these — the pure layer is what makes the stack semantics testable without
// React, and gives Phase D's cross-file Edits a consistent push/pop contract.
//
// Stack semantics (same as legacy):
//   - `pushEdit` tries to coalesce with the top of past. If coalesced, the
//     past's top is replaced with the merged Edit. If not, the new Edit is
//     appended.
//   - Either way, `future` is cleared — a forward edit invalidates redo.
//   - `popUndo` removes the top of past, returns it, and pushes it onto
//     future so the user can redo.
//   - `popRedo` does the inverse.
//   - All three respect MAX_HISTORY ring-buffer cap.

import { tryCoalesce, type CoalesceOpts } from "./operations";
import {
  type Edit,
  type History,
  MAX_HISTORY,
  EMPTY_HISTORY,
} from "./types";

export interface PushEditOpts extends CoalesceOpts {
  // When true, skip the coalesce attempt entirely — the new edit always lands
  // as a fresh past entry. Used by the future hook's `commit()` (a "save
  // point" UX that closes the rolling coalesce window so the next edit opens
  // its own undo step) and by anything that wants to force a boundary even
  // for fast-typed sequential edits.
  readonly noCoalesce?: boolean;
}

// Push a new edit onto past. Returns the new History. Caller is responsible
// for already having applied the edit to the project — the history layer
// only tracks the edit log, not the project state itself.
//
// Barrier semantics (matches legacy `useSourceHistory.commit()`): after a
// `noCoalesce: true` push, the History flips `nextSkipCoalesce: true`. The
// SUBSEQUENT push (even without its own noCoalesce flag) also skips coalesce,
// landing as a fresh entry and clearing the barrier. This makes "save points"
// behave intuitively: typing run → commit boundary → typing run produces 3
// undo entries even though all the typing is in coalesce range, because the
// barrier separates the runs.
export function pushEdit(
  history: History,
  edit: Edit,
  opts?: PushEditOpts,
): History {
  const skipCoalesce = !!opts?.noCoalesce || history.nextSkipCoalesce;
  // Try coalesce only when allowed AND there's a top entry. Coalesce returns
  // null when shapes don't merge (different files, multi-file edits, outside
  // window, bulk delta, continuity break).
  if (!skipCoalesce && history.past.length > 0) {
    const top = history.past[history.past.length - 1];
    const merged = tryCoalesce(top, edit, opts);
    if (merged) {
      return {
        past: [...history.past.slice(0, -1), merged],
        future: [],
        // Successful coalesce ALSO clears any pending barrier — this push
        // is now part of the previous typing run, so the next push should
        // also resume normal coalesce. (Practically, the barrier path
        // forces skipCoalesce=true above so a coalesce can't happen on
        // a barrier push; but defensively reset here in case future
        // semantics shift.)
        nextSkipCoalesce: false,
      };
    }
  }
  // Fresh entry: append + ring-buffer cap + clear future.
  const next = [...history.past, edit];
  return {
    past:
      next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next,
    future: [],
    // Carry the barrier forward only if THIS push opted out. A normal push
    // that landed as a fresh entry (e.g. due to bulk delta or continuity
    // break) doesn't propagate the barrier — typing after a paste should
    // coalesce normally among itself.
    nextSkipCoalesce: !!opts?.noCoalesce,
  };
}

// Pop the top of past. Returns null when past is empty. The popped Edit
// goes onto future for redo. Capacity-cap on future too — a long undo run
// past MAX_HISTORY entries drops the oldest redo (acceptable: the user
// already undid past their own coalesce horizon).
//
// Sets `nextSkipCoalesce: true` so a forward edit after the undo doesn't
// merge into a stale entry — matches legacy `useSourceHistory.undo()`'s
// `lastTsRef = 0` reset. Without this, undoing then typing would coalesce
// the new keystroke into the entry above the one just undone, yielding an
// unintuitive "the undo got reverted plus my new typing" merged shape.
export function popUndo(
  history: History,
): { history: History; undone: Edit } | null {
  if (history.past.length === 0) return null;
  const undone = history.past[history.past.length - 1];
  const future = [...history.future, undone];
  return {
    undone,
    history: {
      past: history.past.slice(0, -1),
      future:
        future.length > MAX_HISTORY
          ? future.slice(future.length - MAX_HISTORY)
          : future,
      nextSkipCoalesce: true,
    },
  };
}

// Mirror of popUndo. The popped Edit goes back onto past so further redos
// no-op once future is exhausted. Same nextSkipCoalesce: true reset for
// the same reason — typing after a redo should open a fresh entry, not
// merge with the redone one.
export function popRedo(
  history: History,
): { history: History; redone: Edit } | null {
  if (history.future.length === 0) return null;
  const redone = history.future[history.future.length - 1];
  const past = [...history.past, redone];
  return {
    redone,
    history: {
      past:
        past.length > MAX_HISTORY
          ? past.slice(past.length - MAX_HISTORY)
          : past,
      future: history.future.slice(0, -1),
      nextSkipCoalesce: true,
    },
  };
}

// Read-only flags for "is undo/redo available". Exposed so React consumers
// can disable Cmd-Z / Cmd-Shift-Z buttons without poking at the array
// lengths directly. Stable identity — pass to React as a value, not a fn.
export function canUndo(history: History): boolean {
  return history.past.length > 0;
}

export function canRedo(history: History): boolean {
  return history.future.length > 0;
}

// Re-export EMPTY_HISTORY for ergonomic init: `useState(EMPTY_HISTORY)`
// instead of `useState({ past: [], future: [] })`.
export { EMPTY_HISTORY };
