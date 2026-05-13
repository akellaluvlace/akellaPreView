// @vitest-environment jsdom
//
// Phase C / B.2 — useEditHistory integration tests.
//
// Pure-logic primitives (Edit/FileDiff/History) are covered by tests/edits-prod
// and tests/edits-history-prod (62 cases). What this file adds: the React
// wiring layer — that the hook's setState calls fire correctly, that effects
// sequence in the right order, and that the IDB hydration + persistence
// round-trip behaves end-to-end.
//
// We render the hook into a real DOM (jsdom) via a probe component, NOT
// react-testing-library — RTL would be a new devDep. Vanilla createRoot +
// React 18's `act` is enough here. The harness exposes the hook's return
// value through a closure so each `act(...)` block can assert the post-state.
//
// Why fake-indexeddb-auto: jsdom doesn't ship IDB. The auto subpath installs
// indexedDB + IDBKeyRange on globalThis on import — the real storage layer
// works against it transparently.

import "fake-indexeddb/auto";
// React 18 requires opting into act() via this global. Without it, every
// state update logs a "current testing environment is not configured to
// support act(...)" warning. Set BEFORE importing React-touching modules.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import { act } from "react";

import { useEditHistory, type EditHistory, type UseEditHistoryOpts } from "../../lib/use-edit-history";
import { createProject, addFile } from "../../lib/files/operations";
import {
  loadProject,
  saveProject,
  __resetDbPromiseForTests,
} from "../../lib/files/storage";
import { createEdit } from "../../lib/edits/operations";
import type { FileId, Project } from "../../lib/files/types";

const DB_NAME = "dropin-files";

async function wipeDb(): Promise<void> {
  await __resetDbPromiseForTests();
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () =>
      reject(new Error("deleteDatabase blocked — connection still open"));
  });
}

interface Harness {
  result: { current: EditHistory };
  rerender: () => void;
  unmount: () => Promise<void>;
}

// Render a small probe component that calls useEditHistory and stashes the
// result on a closure object. Each act(...) block flushes effects + state
// updates; the harness's `result.current` then reflects the post-state.
function renderHook(opts: UseEditHistoryOpts): Harness {
  const result = { current: null as EditHistory | null };

  function Probe(): React.ReactElement | null {
    result.current = useEditHistory(opts);
    return null;
  }

  const container = document.createElement("div");
  document.body.appendChild(container);
  let root: ReactDOMClient.Root | null = null;

  act(() => {
    root = ReactDOMClient.createRoot(container);
    root.render(React.createElement(Probe));
  });

  return {
    result: result as { current: EditHistory },
    rerender() {
      act(() => {
        root!.render(React.createElement(Probe));
      });
    },
    async unmount() {
      await act(async () => {
        root!.unmount();
      });
      container.remove();
    },
  };
}

function makeProject(opts?: { source?: string; idOverride?: string }): Project {
  const r = createProject({
    name: "test",
    entryPath: "App.jsx",
    entrySource: opts?.source ?? "<div>initial</div>",
    idOverride: opts?.idOverride,
  });
  if (!r.ok) throw new Error(`createProject failed: ${r.error}`);
  return r.project;
}

describe("useEditHistory — initial state", () => {
  it("exposes code === entry file source on first render", async () => {
    const initial = makeProject({ source: "<p>hello</p>" });
    const h = renderHook({
      initialProject: initial,
      disablePersistence: true,
    });
    expect(h.result.current.code).toBe("<p>hello</p>");
    expect(h.result.current.canUndo).toBe(false);
    expect(h.result.current.canRedo).toBe(false);
    expect(h.result.current.activeFileId).toBe(initial.entryFileId);
    await h.unmount();
  });

  it("accepts a lazy initializer (called once)", async () => {
    let invocations = 0;
    const h = renderHook({
      initialProject: () => {
        invocations++;
        return makeProject({ source: "<p>lazy</p>" });
      },
      disablePersistence: true,
    });
    expect(invocations).toBe(1);
    expect(h.result.current.code).toBe("<p>lazy</p>");
    h.rerender();
    expect(invocations).toBe(1); // not re-invoked on re-render
    await h.unmount();
  });
});

describe("useEditHistory — setCode + history", () => {
  it("setCode updates code + flips canUndo true", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "a" }),
      disablePersistence: true,
    });
    expect(h.result.current.canUndo).toBe(false);
    act(() => {
      h.result.current.setCode("b");
    });
    expect(h.result.current.code).toBe("b");
    expect(h.result.current.canUndo).toBe(true);
    expect(h.result.current.canRedo).toBe(false);
    await h.unmount();
  });

  it("setCode supports updater fn form", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "x" }),
      disablePersistence: true,
    });
    act(() => {
      h.result.current.setCode((prev) => prev + "y");
    });
    expect(h.result.current.code).toBe("xy");
    await h.unmount();
  });

  it("setCode no-op (same value) doesn't push history", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "same" }),
      disablePersistence: true,
    });
    act(() => {
      h.result.current.setCode("same");
    });
    expect(h.result.current.canUndo).toBe(false);
    await h.unmount();
  });

  it("undo restores prior code, flips canRedo true", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "v1" }),
      disablePersistence: true,
    });
    act(() => {
      h.result.current.setCode("v2");
    });
    act(() => {
      h.result.current.undo();
    });
    expect(h.result.current.code).toBe("v1");
    expect(h.result.current.canUndo).toBe(false);
    expect(h.result.current.canRedo).toBe(true);
    await h.unmount();
  });

  it("redo restores undone code", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "v1" }),
      disablePersistence: true,
    });
    act(() => {
      h.result.current.setCode("v2");
    });
    act(() => {
      h.result.current.undo();
    });
    act(() => {
      h.result.current.redo();
    });
    expect(h.result.current.code).toBe("v2");
    expect(h.result.current.canUndo).toBe(true);
    expect(h.result.current.canRedo).toBe(false);
    await h.unmount();
  });

  it("typing run coalesces into one undo entry", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "" }),
      disablePersistence: true,
    });
    // 5 setCode calls — the underlying tryCoalesce uses Date.now() for
    // window check; in a synchronous test these all land within microseconds
    // of each other, well under COALESCE_WINDOW_MS=300.
    act(() => {
      h.result.current.setCode("a");
      h.result.current.setCode("ab");
      h.result.current.setCode("abc");
      h.result.current.setCode("abcd");
      h.result.current.setCode("abcde");
    });
    expect(h.result.current.code).toBe("abcde");
    // Should be 1 undo entry (coalesced typing run). Single undo restores
    // all the way back to the original.
    act(() => {
      h.result.current.undo();
    });
    expect(h.result.current.code).toBe("");
    expect(h.result.current.canUndo).toBe(false);
    await h.unmount();
  });
});

describe("useEditHistory — setCodeSilent", () => {
  it("updates code without pushing history", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "before" }),
      disablePersistence: true,
    });
    act(() => {
      h.result.current.setCodeSilent("after");
    });
    expect(h.result.current.code).toBe("after");
    expect(h.result.current.canUndo).toBe(false);
    await h.unmount();
  });

  it("no-op (same value) doesn't churn project identity", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "x" }),
      disablePersistence: true,
    });
    const projectBefore = h.result.current.project;
    act(() => {
      h.result.current.setCodeSilent("x");
    });
    expect(h.result.current.project).toBe(projectBefore);
    await h.unmount();
  });
});

describe("useEditHistory — commit barrier", () => {
  it("commit closes coalesce window so the boundary push lands fresh", async () => {
    const h = renderHook({
      initialProject: makeProject({ source: "" }),
      disablePersistence: true,
    });
    // Typing run 1 — coalesces into one entry.
    act(() => {
      h.result.current.setCode("a");
      h.result.current.setCode("ab");
    });
    // commit() flips nextSkipCoalesce so the NEXT setCode skips coalesce
    // and lands as a fresh entry. Subsequent pushes resume normal coalescing
    // (matches legacy useSourceHistory's `lastTsRef = 0` semantic).
    act(() => {
      h.result.current.commit();
    });
    // Typing run 2 — first push skips coalesce (barrier active), second
    // push merges with the first since the barrier auto-clears.
    act(() => {
      h.result.current.setCode("abc"); // fresh entry (barrier blocks coalesce)
      h.result.current.setCode("abcd"); // coalesces with abc — barrier cleared
    });
    // Result: 2 undo entries: ["" → "ab"], ["ab" → "abcd"].
    // First undo brings us to "ab".
    act(() => {
      h.result.current.undo();
    });
    expect(h.result.current.code).toBe("ab");
    // Second undo brings us to "".
    act(() => {
      h.result.current.undo();
    });
    expect(h.result.current.code).toBe("");
    expect(h.result.current.canUndo).toBe(false);
    await h.unmount();
  });

  it("applyEditDirect with noCoalesce: true creates a hard boundary", async () => {
    const initial = makeProject({ source: "" });
    const h = renderHook({
      initialProject: initial,
      disablePersistence: true,
    });
    // Typing run 1
    act(() => {
      h.result.current.setCode("a");
      h.result.current.setCode("ab");
    });
    // Build a fresh Edit with noCoalesce — the boundary push itself.
    const editR = createEdit({
      diffs: [{ fileId: initial.entryFileId, before: "ab", after: "ab-MARK" }],
      reason: "save point",
    });
    if (!editR.ok) throw new Error(editR.error);
    act(() => {
      h.result.current.applyEditDirect(editR.edit, { noCoalesce: true });
    });
    // Typing run 2 — first push skips coalesce (barrier propagated from
    // the noCoalesce boundary), second push merges.
    act(() => {
      h.result.current.setCode("ab-MARK-x");
      h.result.current.setCode("ab-MARK-xy");
    });
    // 3 entries now: typing run 1, boundary, typing run 2.
    // 1st undo: → "ab-MARK"
    act(() => h.result.current.undo());
    expect(h.result.current.code).toBe("ab-MARK");
    // 2nd undo: → "ab"
    act(() => h.result.current.undo());
    expect(h.result.current.code).toBe("ab");
    // 3rd undo: → ""
    act(() => h.result.current.undo());
    expect(h.result.current.code).toBe("");
    await h.unmount();
  });
});

describe("useEditHistory — multi-file", () => {
  it("setProject (structural) updates project but doesn't push history", async () => {
    const initial = makeProject({ source: "entry" });
    const h = renderHook({
      initialProject: initial,
      disablePersistence: true,
    });
    expect(h.result.current.project.files.size).toBe(1);
    act(() => {
      h.result.current.setProject((prev) => {
        const r = addFile(prev, { path: "components/Card.jsx", source: "card" });
        if (!r.ok) throw new Error(r.error);
        return r.project;
      });
    });
    expect(h.result.current.project.files.size).toBe(2);
    expect(h.result.current.canUndo).toBe(false); // structural ops bypass history
    await h.unmount();
  });

  it("setActiveFileId switches code to the new file's source", async () => {
    const initial = makeProject({ source: "entry-source" });
    const h = renderHook({
      initialProject: initial,
      disablePersistence: true,
    });
    let secondFileId: FileId | null = null;
    act(() => {
      h.result.current.setProject((prev) => {
        const r = addFile(prev, { path: "components/Card.jsx", source: "card-source" });
        if (!r.ok) throw new Error(r.error);
        // Find the new file's id
        for (const [id, f] of r.project.files) {
          if (f.path === "components/Card.jsx") {
            secondFileId = id;
            break;
          }
        }
        return r.project;
      });
    });
    expect(secondFileId).not.toBeNull();
    expect(h.result.current.code).toBe("entry-source");
    act(() => {
      h.result.current.setActiveFileId(secondFileId!);
    });
    expect(h.result.current.code).toBe("card-source");
    expect(h.result.current.activeFileId).toBe(secondFileId);
    // Setting active file also closes the coalesce window — typing on the
    // new file shouldn't merge with prior typing on the old file.
    act(() => {
      h.result.current.setCode("card-edited");
    });
    expect(h.result.current.code).toBe("card-edited");
    expect(h.result.current.canUndo).toBe(true);
    await h.unmount();
  });

  it("applyEditDirect pushes a hand-built multi-file Edit", async () => {
    const initial = makeProject({ source: "a-source" });
    let twoFileProject: Project = initial;
    let secondId: FileId | null = null;
    {
      const r = addFile(initial, { path: "B.jsx", source: "b-source" });
      if (!r.ok) throw new Error(r.error);
      twoFileProject = r.project;
      for (const [id, f] of twoFileProject.files) {
        if (f.path === "B.jsx") secondId = id;
      }
    }
    const h = renderHook({
      initialProject: twoFileProject,
      disablePersistence: true,
    });
    expect(h.result.current.code).toBe("a-source");
    expect(secondId).not.toBeNull();

    const editR = createEdit({
      diffs: [
        {
          fileId: twoFileProject.entryFileId,
          before: "a-source",
          after: "a-source-NEW",
        },
        {
          fileId: secondId!,
          before: "b-source",
          after: "b-source-NEW",
        },
      ],
      reason: "test cross-file",
    });
    if (!editR.ok) throw new Error(editR.error);

    let returned = false;
    act(() => {
      returned = h.result.current.applyEditDirect(editR.edit);
    });
    expect(returned).toBe(true);
    expect(h.result.current.canUndo).toBe(true);

    // Verify both files updated atomically
    let aSource: string | null = null;
    let bSource: string | null = null;
    for (const [id, f] of h.result.current.project.files) {
      if (id === twoFileProject.entryFileId) aSource = f.source;
      if (id === secondId!) bSource = f.source;
    }
    expect(aSource).toBe("a-source-NEW");
    expect(bSource).toBe("b-source-NEW");

    // Undo reverts both files atomically
    act(() => {
      h.result.current.undo();
    });
    aSource = null;
    bSource = null;
    for (const [id, f] of h.result.current.project.files) {
      if (id === twoFileProject.entryFileId) aSource = f.source;
      if (id === secondId!) bSource = f.source;
    }
    expect(aSource).toBe("a-source");
    expect(bSource).toBe("b-source");
    await h.unmount();
  });
});

describe("useEditHistory — error reporting", () => {
  it("calls onError when setCode is invoked with no active file", async () => {
    const initial = makeProject({ source: "x" });
    const errors: string[] = [];
    const h = renderHook({
      initialProject: initial,
      disablePersistence: true,
      onError: (msg) => errors.push(msg),
    });
    // Force activeFileId to a fake id by setActiveFileId then setProject to
    // remove the file. (In production this can't happen; the test exercises
    // the defensive error path.)
    const fakeFileId = "definitely-not-a-real-file" as FileId;
    act(() => {
      h.result.current.setActiveFileId(fakeFileId);
    });
    expect(errors.length).toBe(0);
    act(() => {
      h.result.current.setCode("y");
    });
    expect(errors.length).toBe(1);
    expect(errors[0]).toMatch(/active file not found/);
    await h.unmount();
  });
});

describe("useEditHistory — IDB hydration + persistence", () => {
  beforeEach(async () => {
    await wipeDb();
  });
  afterEach(async () => {
    await wipeDb();
  });

  it("hydration replaces state when stored project exists", async () => {
    // Pre-seed IDB with a project that differs from the in-memory default.
    const stored = makeProject({
      source: "stored-source",
      idOverride: "dropin:project:hydration-test:jsx",
    });
    await saveProject(stored);

    const initial = makeProject({
      source: "memory-default",
      idOverride: "dropin:project:hydration-test:jsx",
    });
    let hydrationOk = false;
    const h = renderHook({
      initialProject: initial,
      // Use a 1ms debounce so the post-hydration save (if any) doesn't race
      // the unmount. Actually the justHydratedRef guard skips that save —
      // this is just defense.
      persistenceDebounceMs: 1,
    });

    expect(h.result.current.code).toBe("memory-default");
    // Wait for hydration effect to resolve
    await act(async () => {
      // Yield a microtask for the loadProject promise to flush
      await new Promise<void>((r) => setTimeout(r, 50));
    });
    expect(h.result.current.code).toBe("stored-source");
    hydrationOk = true;
    expect(hydrationOk).toBe(true);
    await h.unmount();
  });

  it("persistence saves project after debounce window", async () => {
    const initial = makeProject({
      source: "v0",
      idOverride: "dropin:project:persist-test:jsx",
    });
    const h = renderHook({
      initialProject: initial,
      persistenceDebounceMs: 5,
    });

    // Wait for hydration to settle (no stored project — flips hydratedRef)
    await act(async () => {
      await new Promise<void>((r) => setTimeout(r, 50));
    });

    act(() => {
      h.result.current.setCode("v1-saved");
    });

    // Wait for the debounce to fire + the IDB write to complete
    await act(async () => {
      await new Promise<void>((r) => setTimeout(r, 60));
    });

    const loaded = await loadProject("dropin:project:persist-test:jsx");
    expect(loaded).not.toBeNull();
    if (loaded) {
      const entry = Array.from(loaded.files.values()).find(
        (f) => f.id === loaded.entryFileId,
      );
      expect(entry?.source).toBe("v1-saved");
    }
    await h.unmount();
  });

  it("hydration error surfaces via onError but doesn't crash", async () => {
    // Plant a corrupted record (entryFileId not in files)
    const stored = makeProject({
      source: "x",
      idOverride: "dropin:project:corrupt-test:jsx",
    });
    // Force corruption by overwriting via raw IDB
    // The simpler path: saveProject fine, then mutate stored project's entryFileId
    // before save. Easiest: build a project with a fake entry by hand-bypassing
    // saveProject (saveProject doesn't validate).
    await saveProject({
      ...stored,
      entryFileId: "fake-id-not-in-files" as FileId,
    });

    const initial = makeProject({
      source: "memory",
      idOverride: "dropin:project:corrupt-test:jsx",
    });
    const errors: string[] = [];
    const h = renderHook({
      initialProject: initial,
      onError: (msg) => errors.push(msg),
      persistenceDebounceMs: 1,
    });

    await act(async () => {
      await new Promise<void>((r) => setTimeout(r, 50));
    });

    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors[0]).toMatch(/Failed to load saved project/);
    // State stays at the in-memory default since hydration errored
    expect(h.result.current.code).toBe("memory");
    await h.unmount();
  });
});
