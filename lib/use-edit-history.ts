"use client";

// Phase C / B.2 — useEditHistory hook backed by lib/edits/{operations,history}.
//
// Replaces lib/use-source-history.ts. Same user-visible undo behaviour
// (300ms time-coalescing, 50-char bulk threshold, MAX_HISTORY=50 ring
// buffer) but operates on a Project of N files instead of a single source
// string. v1 single-file projects keep the existing UX exactly — `code` is
// the active file's source, `setCode` builds a 1-diff Edit on the active
// file and pushes it onto the history stack, `undo`/`redo` revert/re-apply.
//
// Backwards-compat surface (drop-in for useSourceHistory consumers):
//   code, setCode, setCodeSilent, undo, redo, canUndo, canRedo, commit
//
// New surface for the multi-file UX (Phase B.2 tabs/tree, Phase D cross-file):
//   project, setProject, activeFileId, setActiveFileId, applyEditDirect
//
// Why one hook owning project + history + IDB instead of three separate
// effects living in Workspace:
//   - The ad-hoc Workspace effects (mirror, hydration, persistence) had a
//     race window where typing within ~50ms of mount would be stomped by
//     the post-hydration setProject. Centralising the state ownership lets
//     the hook gate writes correctly (justHydratedRef pattern).
//   - Phase B.2's tab UI needs to swap which file `code` points at without
//     touching the 50+ Workspace setCode call sites — a hook-internal
//     activeFileId state makes that a single setActiveFileId call.
//   - Phase D's cross-file edits need a primitive that pushes a multi-file
//     Edit atomically; that primitive (applyEditDirect) only makes sense
//     inside the hook that owns history state.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  applyEdit,
  editFromSourceChange,
  revertEdit,
} from "./edits/operations";
import {
  EMPTY_HISTORY,
  canUndo as canUndoFn,
  canRedo as canRedoFn,
  popRedo,
  popUndo,
  pushEdit,
  type PushEditOpts,
} from "./edits/history";
import type { Edit, History } from "./edits/types";
import {
  getFile,
  updateFileSource,
} from "./files/operations";
import type { FileId, Project } from "./files/types";
import { loadProject as defaultLoadProject, saveProject as defaultSaveProject } from "./files/storage";

export interface EditHistory {
  // Project state — the source of truth for everything else here. Never
  // mutated in place; setProject (or any of the Edit-producing setters)
  // returns a new Project. Phase B.2's file-tree UI consumes this for
  // listFiles(project).
  readonly project: Project;
  // Raw setter for structural project mutations (addFile, removeFile,
  // renameFile, setEntryFile). These are NOT undoable in v1 (the user
  // doesn't expect Cmd-Z on "delete a file" to bring it back) so they
  // bypass the history stack. Triggers IDB persistence.
  readonly setProject: (updater: (prev: Project) => Project) => void;

  // Active file. Defaults to project.entryFileId. Phase B.2's tab UI bumps
  // this when the user clicks a tab. Switching files clears the in-progress
  // coalesce window so the next setCode opens a fresh undo entry on the
  // newly-active file (matches the historical setCode behaviour after every
  // undo / redo / commit).
  readonly activeFileId: FileId;
  readonly setActiveFileId: (id: FileId) => void;

  // Active file's source. Convenience accessor — equivalent to
  // getFile(project, activeFileId)?.source ?? "". Identity tracks content
  // (string identity is content-based) so React `useMemo` short-circuits
  // when the source is unchanged.
  readonly code: string;
  // Set active file's source. Builds an Edit, applies it to the project,
  // pushes onto the history stack with coalescing. Same signature as
  // useState's setter so callers can pass a value or an updater fn.
  readonly setCode: (next: string | ((prev: string) => string)) => void;
  // Set active file's source WITHOUT pushing onto the history stack. Used
  // by the OID re-inject path (Workspace) — the user shouldn't see "OIDs
  // got stamped" as a separate Cmd-Z step. Still updates project AND
  // persists; only the history layer is bypassed.
  readonly setCodeSilent: (next: string) => void;

  // Apply a hand-built Edit (e.g. a multi-file cross-file className
  // propagation from Phase D). Returns true on success, false on failure
  // (error already surfaced via onError). PushEditOpts threads through to
  // the history layer (e.g. noCoalesce: true to force a save-point boundary).
  readonly applyEditDirect: (edit: Edit, opts?: PushEditOpts) => boolean;

  readonly undo: () => void;
  readonly redo: () => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  // Force-commit a coalesce boundary. The next setCode opens a fresh undo
  // entry even if it lands within the time window. Reserved for "save
  // point" UX (focus-editor commit, future explicit save markers).
  readonly commit: () => void;
}

export interface UseEditHistoryOpts {
  // Initial project. Lazy form recommended — the eager form runs createProject
  // on every render before React discards it. The lazy initializer runs once
  // at mount.
  readonly initialProject: Project | (() => Project);
  // Surface IDB load/save and apply-edit failures. The hook never throws
  // and never re-renders the consumer just to show an error — onError is
  // the single sink. Optional; defaults to console.warn.
  readonly onError?: (msg: string) => void;
  // Storage layer override for tests. Defaults to the real lib/files/storage
  // module. Tests pass in-memory stubs to skip the fake-indexeddb dance for
  // hook-only assertions; the file-pool-hydration suite still covers the
  // real IDB round-trip.
  readonly storage?: {
    loadProject: typeof defaultLoadProject;
    saveProject: typeof defaultSaveProject;
  };
  // Disable IDB hydration + persistence entirely. Defaults to false. Tests
  // that don't care about persistence pass true to short-circuit both
  // effects, avoiding the need to mock the storage layer at all.
  readonly disablePersistence?: boolean;
  // Override the persistence debounce window. Defaults to 500ms. Tests that
  // exercise the persistence effect set this to 0 so the timer fires
  // synchronously after the next microtask (`vi.runAllTimersAsync()` works
  // either way; explicit override is for tests that don't want fake timers).
  readonly persistenceDebounceMs?: number;
}

const DEFAULT_PERSIST_DEBOUNCE_MS = 500;

export function useEditHistory(opts: UseEditHistoryOpts): EditHistory {
  // ───────────────────────────────────────────────────────────────────────
  // State
  // ───────────────────────────────────────────────────────────────────────

  // Project. Lazy initializer so createProject runs once.
  const [project, setProjectState] = useState<Project>(opts.initialProject);
  // History stack (past + future + nextSkipCoalesce barrier flag).
  const [history, setHistory] = useState<History>(EMPTY_HISTORY);
  // Active file. Null sentinel = "use project.entryFileId" (lets us derive
  // the active file without re-running the project initializer to read
  // entryFileId; also auto-recovers when the entry file changes via
  // setEntryFile structural op).
  const [activeFileIdState, setActiveFileIdState] = useState<FileId | null>(
    null,
  );

  const activeFileId = activeFileIdState ?? project.entryFileId;

  // ───────────────────────────────────────────────────────────────────────
  // Refs (latest-value mirrors so callbacks stay identity-stable)
  // ───────────────────────────────────────────────────────────────────────

  // Stash latest opts on a ref so effects pick up the freshest onError /
  // storage / debounce without forcing the caller to memoize the opts
  // object. Standard pattern for "callbacks that close over opts".
  const optsRef = useRef(opts);
  optsRef.current = opts;

  // Latest-value mirrors. Two reasons we keep refs alongside state:
  //   1. Callbacks (setCode / setCodeSilent / undo / redo / applyEditDirect /
  //      setActiveFileId) read the ref to stay identity-stable across
  //      renders. Listing project/history/activeFileId as deps would churn
  //      the callbacks every time those change, which would re-invalidate
  //      every memoised consumer (e.g. Editor's onChange prop).
  //   2. Within a single React batch (e.g. `setCode("a"); setCode("ab"); ...`),
  //      the ref is updated SYNCHRONOUSLY at the top of each setter so the
  //      next setter call sees the post-state. Without this, the second
  //      `setCode` in a typing run reads a stale `before` from the OLD
  //      project, breaks tryCoalesce's continuity check, and every keystroke
  //      lands as its own undo entry. Same ref-on-write pattern as legacy
  //      useSourceHistory's `codeRef.current = value`.
  // The render-time assignment (projectRef.current = project) is the
  // backstop — keeps refs aligned with state across re-renders / external
  // setProject mutations / hydration replacements / undo/redo. The
  // in-setter sync handles the within-batch case.
  const projectRef = useRef(project);
  projectRef.current = project;

  const activeFileIdRef = useRef(activeFileId);
  activeFileIdRef.current = activeFileId;

  const historyRef = useRef(history);
  historyRef.current = history;

  // Hydration / persistence sequencing. hydratedRef flips true once the IDB
  // load resolves (success OR not-found OR error); persistence effect waits
  // for this so the in-memory default doesn't race-overwrite stored data.
  // justHydratedRef skips ONE persist trigger so the post-hydration setProject
  // doesn't immediately rewrite the same data we just loaded.
  const hydratedRef = useRef(false);
  const justHydratedRef = useRef(false);

  // ───────────────────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────────────────

  const reportError = useCallback((msg: string) => {
    const handler = optsRef.current.onError;
    if (handler) handler(msg);
    else console.warn(`[dropin:useEditHistory] ${msg}`);
  }, []);

  // ───────────────────────────────────────────────────────────────────────
  // Effects
  // ───────────────────────────────────────────────────────────────────────

  // Hydration — run once on mount. project.id is deterministic (Workspace
  // sets idOverride), so a reload of the same template/playground hits the
  // same IDB key. Cancellation flag for the unmount-during-load case.
  //
  // Note: this useEffect has a single-shot intent — using an empty dep
  // array would be misleading since we DO read project.id, but stabilising
  // it via a ref avoids the eslint warning while preserving "run once" semantics.
  // We capture the project.id at mount because callers may legitimately
  // change project later (file ops); hydration is a one-shot.
  const initialProjectIdRef = useRef(project.id);
  useEffect(() => {
    if (optsRef.current.disablePersistence) {
      hydratedRef.current = true;
      return;
    }
    let cancelled = false;
    const load = optsRef.current.storage?.loadProject ?? defaultLoadProject;
    load(initialProjectIdRef.current)
      .then((stored) => {
        if (cancelled) return;
        if (stored) {
          // Mark BEFORE the setProject call so the persistence effect's
          // dep-firing (which is async, microtask-after-setState) sees the
          // flag set and skips that one save.
          justHydratedRef.current = true;
          setProjectState(stored);
          // Reset history — the loaded project's pre-save undo stack is gone.
          setHistory(EMPTY_HISTORY);
          // Reset active file. null sentinel re-derives entryFileId from the
          // freshly-loaded project (which may have a different entryFileId).
          setActiveFileIdState(null);
        }
        hydratedRef.current = true;
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        reportError(`Failed to load saved project: ${msg}`);
        // Still flip hydratedRef so persistence isn't permanently gated on a
        // load that errored. The user keeps their in-memory default and can
        // save fresh data over the (corrupted) stored copy.
        hydratedRef.current = true;
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportError]);

  // Persistence — debounced 500ms after the last project change. Cleanup
  // clears the pending timer on every re-run so rapid setProject (typing,
  // multi-op handlers) only schedules ONE save after the user stops.
  useEffect(() => {
    if (optsRef.current.disablePersistence) return;
    if (!hydratedRef.current) return;
    if (justHydratedRef.current) {
      justHydratedRef.current = false;
      return;
    }
    const debounceMs =
      optsRef.current.persistenceDebounceMs ?? DEFAULT_PERSIST_DEBOUNCE_MS;
    const save = optsRef.current.storage?.saveProject ?? defaultSaveProject;
    const id = setTimeout(() => {
      save(project).catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        reportError(`Failed to save project: ${msg}`);
      });
    }, debounceMs);
    return () => clearTimeout(id);
  }, [project, reportError]);

  // ───────────────────────────────────────────────────────────────────────
  // Code accessors
  // ───────────────────────────────────────────────────────────────────────

  // Active file's source. Memoised on (project, activeFileId) — string
  // identity is content-based, so consumers diffing on `code` see stable
  // identity when the source is unchanged.
  const code = useMemo(() => {
    const f = getFile(project, activeFileId);
    return f?.source ?? "";
  }, [project, activeFileId]);

  // ───────────────────────────────────────────────────────────────────────
  // Mutators (stable identities — refs read latest values)
  // ───────────────────────────────────────────────────────────────────────

  // Inline helper — apply a project + history update atomically. Mutates
  // the refs synchronously SO subsequent calls within the same React batch
  // see the post-state (e.g. multi-keystroke typing run feeds tryCoalesce
  // the correct continuity-checked `before`/`after` chain). Then schedules
  // the React state setters; the render-time `projectRef.current = project`
  // backstop reaffirms after the next render.
  const commitState = useCallback(
    (nextProject: Project, nextHistory: History | null): void => {
      projectRef.current = nextProject;
      setProjectState(nextProject);
      if (nextHistory !== null) {
        historyRef.current = nextHistory;
        setHistory(nextHistory);
      }
    },
    [],
  );

  const setCode = useCallback(
    (next: string | ((prev: string) => string)) => {
      const p = projectRef.current;
      const fid = activeFileIdRef.current;
      const file = getFile(p, fid);
      if (!file) {
        reportError(`setCode: active file not found: ${fid}`);
        return;
      }
      const value =
        typeof next === "function"
          ? (next as (prev: string) => string)(file.source)
          : next;
      // Short-circuit on no-op BEFORE constructing an Edit. editFromSourceChange
      // also handles this, but skipping the createEditId allocation on every
      // unchanged keystroke keeps the hot path cheap.
      if (value === file.source) return;

      const editR = editFromSourceChange(p, fid, value);
      if (!editR.ok) {
        reportError(editR.error);
        return;
      }
      // Defensive — editFromSourceChange returns null edit only if no-op,
      // which we already short-circuited above. This branch shouldn't fire
      // but keeps the type-narrowing exhaustive.
      if (editR.edit === null) return;

      const applyR = applyEdit(p, editR.edit);
      if (!applyR.ok) {
        reportError(applyR.error);
        return;
      }
      // pushEdit reads historyRef.current — synchronously updated at the
      // bottom of commitState — so a typing run inside one React batch
      // chains correctly through tryCoalesce instead of all 5 reads
      // collapsing onto stale state.
      const nextHistory = pushEdit(historyRef.current, editR.edit);
      commitState(applyR.project, nextHistory);
    },
    [reportError, commitState],
  );

  const setCodeSilent = useCallback(
    (next: string) => {
      const p = projectRef.current;
      const fid = activeFileIdRef.current;
      const file = getFile(p, fid);
      if (!file) {
        reportError(`setCodeSilent: active file not found: ${fid}`);
        return;
      }
      if (next === file.source) return;
      const r = updateFileSource(p, fid, next);
      if (!r.ok) {
        reportError(r.error);
        return;
      }
      // Project changes; history doesn't (silent edits skip the undo stack).
      commitState(r.project, null);
    },
    [reportError, commitState],
  );

  const applyEditDirect = useCallback(
    (edit: Edit, pushOpts?: PushEditOpts): boolean => {
      const p = projectRef.current;
      const r = applyEdit(p, edit);
      if (!r.ok) {
        reportError(r.error);
        return false;
      }
      const nextHistory = pushEdit(historyRef.current, edit, pushOpts);
      commitState(r.project, nextHistory);
      return true;
    },
    [reportError, commitState],
  );

  const undo = useCallback(() => {
    const popped = popUndo(historyRef.current);
    if (!popped) return;
    const r = revertEdit(projectRef.current, popped.undone);
    if (!r.ok) {
      reportError(r.error);
      return;
    }
    commitState(r.project, popped.history);
  }, [reportError, commitState]);

  const redo = useCallback(() => {
    const popped = popRedo(historyRef.current);
    if (!popped) return;
    const r = applyEdit(projectRef.current, popped.redone);
    if (!r.ok) {
      reportError(r.error);
      return;
    }
    commitState(r.project, popped.history);
  }, [reportError, commitState]);

  const commit = useCallback(() => {
    const h = historyRef.current;
    if (h.nextSkipCoalesce) return;
    const next = { ...h, nextSkipCoalesce: true };
    historyRef.current = next;
    setHistory(next);
  }, []);

  const setProject = useCallback(
    (updater: (prev: Project) => Project) => {
      const prev = projectRef.current;
      const next = updater(prev);
      // Identity short-circuit so structural ops that bail (e.g. removeFile
      // on the entry file returning the same project) don't trigger a save.
      if (next === prev) return;
      commitState(next, null);
    },
    [commitState],
  );

  const setActiveFileId = useCallback((id: FileId) => {
    const prev = activeFileIdRef.current;
    if (prev === id) return;
    activeFileIdRef.current = id;
    setActiveFileIdState(id);
    // Cross-file switch closes the coalesce window so a typing run on the
    // old file doesn't merge with a subsequent typing run on the new file.
    // Matches the semantic of undo/redo (which also set nextSkipCoalesce).
    const h = historyRef.current;
    if (!h.nextSkipCoalesce) {
      const nextH = { ...h, nextSkipCoalesce: true };
      historyRef.current = nextH;
      setHistory(nextH);
    }
  }, []);

  return {
    project,
    setProject,
    activeFileId,
    setActiveFileId,
    code,
    setCode,
    setCodeSilent,
    applyEditDirect,
    undo,
    redo,
    canUndo: canUndoFn(history),
    canRedo: canRedoFn(history),
    commit,
  };
}
