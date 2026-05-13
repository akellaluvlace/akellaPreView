// Phase C / B.1 — Direct prod-import coverage for `lib/edits/history.ts`.
//
// Tests the pure stack semantics that Phase B.2's `useEditHistory` hook will
// own: push (with coalesce), undo, redo, future-clear-on-forward-edit, ring-
// buffer cap. No React, no DOM — same convention as files-prod / edits-prod.

import { describe, it, expect } from "vitest";
import {
  pushEdit,
  popUndo,
  popRedo,
  canUndo,
  canRedo,
  EMPTY_HISTORY,
} from "../lib/edits/history";
import { createEdit } from "../lib/edits/operations";
import { MAX_HISTORY, type Edit, type FileDiff } from "../lib/edits/types";
import { createProject, addFile } from "../lib/files/operations";
import type { FileId } from "../lib/files/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeFileIds(): { fileA: FileId; fileB: FileId } {
  const r = createProject({
    name: "h",
    entryPath: "App.jsx",
    entrySource: "",
    idOverride: "history-test",
  });
  if (!r.ok) throw new Error("createProject failed");
  const r2 = addFile(r.project, { path: "B.jsx", source: "" });
  if (!r2.ok) throw new Error("addFile failed");
  const fileA = r.entryFileId;
  const fileB = Array.from(r2.project.files.keys()).find((k) => k !== fileA);
  if (!fileB) throw new Error("file id resolution failed");
  return { fileA, fileB };
}

function makeEdit(
  fileId: FileId,
  before: string,
  after: string,
  ts: number,
  reason?: string,
): Edit {
  const r = createEdit({
    diffs: [{ fileId, before, after }],
    ts,
    reason,
  });
  if (!r.ok) throw new Error("createEdit failed");
  return r.edit;
}

// ─── EMPTY_HISTORY ──────────────────────────────────────────────────────────

describe("EMPTY_HISTORY", () => {
  it("is a frozen empty pair with no barrier", () => {
    expect(EMPTY_HISTORY.past).toEqual([]);
    expect(EMPTY_HISTORY.future).toEqual([]);
    expect(EMPTY_HISTORY.nextSkipCoalesce).toBe(false);
  });
});

// ─── canUndo / canRedo ──────────────────────────────────────────────────────

describe("canUndo / canRedo", () => {
  it("both false for empty history", () => {
    expect(canUndo(EMPTY_HISTORY)).toBe(false);
    expect(canRedo(EMPTY_HISTORY)).toBe(false);
  });

  it("canUndo true after a push", () => {
    const { fileA } = makeFileIds();
    const e = makeEdit(fileA, "v1", "v2", 1000);
    const h = pushEdit(EMPTY_HISTORY, e);
    expect(canUndo(h)).toBe(true);
    expect(canRedo(h)).toBe(false);
  });

  it("canRedo true after an undo", () => {
    const { fileA } = makeFileIds();
    const e = makeEdit(fileA, "v1", "v2", 1000);
    const h1 = pushEdit(EMPTY_HISTORY, e);
    const u = popUndo(h1);
    expect(u).not.toBeNull();
    if (u) {
      expect(canUndo(u.history)).toBe(false);
      expect(canRedo(u.history)).toBe(true);
    }
  });
});

// ─── pushEdit ───────────────────────────────────────────────────────────────

describe("pushEdit", () => {
  it("appends to past on first push", () => {
    const { fileA } = makeFileIds();
    const e = makeEdit(fileA, "v1", "v2", 1000);
    const h = pushEdit(EMPTY_HISTORY, e);
    expect(h.past.length).toBe(1);
    expect(h.past[0]).toBe(e);
    expect(h.future.length).toBe(0);
  });

  it("clears future on forward edit (linear-undo invariant)", () => {
    const { fileA } = makeFileIds();
    // Build a history with something in future via undo-then-push.
    const e1 = makeEdit(fileA, "v1", "v2", 1000);
    const e2 = makeEdit(fileA, "v2", "v3", 2000);
    let h = pushEdit(EMPTY_HISTORY, e1);
    h = pushEdit(h, e2, { noCoalesce: true });
    const undone = popUndo(h);
    if (!undone) throw new Error("popUndo failed");
    expect(undone.history.future.length).toBe(1);
    // Now push a new edit; future should clear.
    const e3 = makeEdit(fileA, "v2", "v3-NEW-BRANCH", 3000);
    const h2 = pushEdit(undone.history, e3, { noCoalesce: true });
    expect(h2.future.length).toBe(0);
  });

  it("coalesces same-file within window into one entry", () => {
    const { fileA } = makeFileIds();
    const e1 = makeEdit(fileA, "v1", "v2", 1000);
    const e2 = makeEdit(fileA, "v2", "v3", 1100); // 100ms later
    let h = pushEdit(EMPTY_HISTORY, e1);
    h = pushEdit(h, e2);
    expect(h.past.length).toBe(1); // merged
    expect(h.past[0].diffs[0].before).toBe("v1");
    expect(h.past[0].diffs[0].after).toBe("v3");
  });

  it("doesn't coalesce when noCoalesce is set", () => {
    const { fileA } = makeFileIds();
    const e1 = makeEdit(fileA, "v1", "v2", 1000);
    const e2 = makeEdit(fileA, "v2", "v3", 1100);
    let h = pushEdit(EMPTY_HISTORY, e1);
    h = pushEdit(h, e2, { noCoalesce: true });
    expect(h.past.length).toBe(2);
  });

  it("doesn't coalesce different files", () => {
    const { fileA, fileB } = makeFileIds();
    const e1 = makeEdit(fileA, "v1", "v2", 1000);
    const e2 = makeEdit(fileB, "w1", "w2", 1100);
    let h = pushEdit(EMPTY_HISTORY, e1);
    h = pushEdit(h, e2);
    expect(h.past.length).toBe(2);
  });

  it("respects MAX_HISTORY ring-buffer cap", () => {
    const { fileA } = makeFileIds();
    let h = EMPTY_HISTORY;
    let prevSource = "v0";
    // Push MAX_HISTORY + 5 edits with noCoalesce so each is a fresh entry.
    for (let i = 1; i <= MAX_HISTORY + 5; i++) {
      const next = `v${i}`;
      const e = makeEdit(fileA, prevSource, next, 1000 + i * 1000);
      h = pushEdit(h, e, { noCoalesce: true });
      prevSource = next;
    }
    expect(h.past.length).toBe(MAX_HISTORY);
    // Oldest entries dropped: first survivor's before = "v5" (we pushed v0→v1
    // through v55→v55, so the first 5 are dropped; survivors are 6 through 55).
    expect(h.past[0].diffs[0].before).toBe("v5");
    expect(h.past[h.past.length - 1].diffs[0].after).toBe(`v${MAX_HISTORY + 5}`);
  });

  it("custom windowMs threads through to coalesce", () => {
    const { fileA } = makeFileIds();
    const e1 = makeEdit(fileA, "v1", "v2", 1000);
    const e2 = makeEdit(fileA, "v2", "v3", 1500); // 500ms apart
    let h = pushEdit(EMPTY_HISTORY, e1);
    h = pushEdit(h, e2); // default 300ms window — should NOT merge
    expect(h.past.length).toBe(2);
    // Reset and try with custom window
    let h2 = pushEdit(EMPTY_HISTORY, e1);
    h2 = pushEdit(h2, e2, { windowMs: 1000 });
    expect(h2.past.length).toBe(1);
  });
});

// ─── popUndo ────────────────────────────────────────────────────────────────

describe("popUndo", () => {
  it("returns null on empty history", () => {
    expect(popUndo(EMPTY_HISTORY)).toBeNull();
  });

  it("removes top of past, returns it, pushes onto future", () => {
    const { fileA } = makeFileIds();
    const e = makeEdit(fileA, "v1", "v2", 1000);
    const h = pushEdit(EMPTY_HISTORY, e);
    const r = popUndo(h);
    expect(r).not.toBeNull();
    if (!r) return;
    expect(r.undone).toBe(e);
    expect(r.history.past.length).toBe(0);
    expect(r.history.future.length).toBe(1);
    expect(r.history.future[0]).toBe(e);
  });

  it("multiple undos pop in LIFO order", () => {
    const { fileA } = makeFileIds();
    const e1 = makeEdit(fileA, "v1", "v2", 1000);
    const e2 = makeEdit(fileA, "v2", "v3", 2000);
    const e3 = makeEdit(fileA, "v3", "v4", 3000);
    let h = pushEdit(EMPTY_HISTORY, e1, { noCoalesce: true });
    h = pushEdit(h, e2, { noCoalesce: true });
    h = pushEdit(h, e3, { noCoalesce: true });

    const u1 = popUndo(h);
    if (!u1) throw new Error("u1 null");
    expect(u1.undone).toBe(e3);
    const u2 = popUndo(u1.history);
    if (!u2) throw new Error("u2 null");
    expect(u2.undone).toBe(e2);
    const u3 = popUndo(u2.history);
    if (!u3) throw new Error("u3 null");
    expect(u3.undone).toBe(e1);
    expect(popUndo(u3.history)).toBeNull();
  });

  it("future caps at MAX_HISTORY (long undo run)", () => {
    const { fileA } = makeFileIds();
    let h = EMPTY_HISTORY;
    let prev = "v0";
    for (let i = 1; i <= MAX_HISTORY + 2; i++) {
      const next = `v${i}`;
      h = pushEdit(h, makeEdit(fileA, prev, next, 1000 + i * 1000), {
        noCoalesce: true,
      });
      prev = next;
    }
    // History past has been trimmed by the push cap. Now undo until empty.
    let cur = h;
    while (cur.past.length > 0) {
      const r = popUndo(cur);
      if (!r) break;
      cur = r.history;
    }
    expect(cur.future.length).toBe(MAX_HISTORY);
  });
});

// ─── popRedo ────────────────────────────────────────────────────────────────

describe("popRedo", () => {
  it("returns null on empty future", () => {
    expect(popRedo(EMPTY_HISTORY)).toBeNull();
  });

  it("undo + redo restores original past length", () => {
    const { fileA } = makeFileIds();
    const e = makeEdit(fileA, "v1", "v2", 1000);
    const h0 = pushEdit(EMPTY_HISTORY, e);
    const u = popUndo(h0);
    if (!u) throw new Error("undo null");
    const r = popRedo(u.history);
    if (!r) throw new Error("redo null");
    expect(r.redone).toBe(e);
    expect(r.history.past.length).toBe(1);
    expect(r.history.future.length).toBe(0);
  });

  it("multiple undos + multiple redos preserves order (LIFO undo, FIFO-from-future redo)", () => {
    const { fileA } = makeFileIds();
    const e1 = makeEdit(fileA, "v1", "v2", 1000);
    const e2 = makeEdit(fileA, "v2", "v3", 2000);
    let h = pushEdit(EMPTY_HISTORY, e1, { noCoalesce: true });
    h = pushEdit(h, e2, { noCoalesce: true });
    const u1 = popUndo(h)!;          // undoes e2
    const u2 = popUndo(u1.history)!; // undoes e1
    expect(u2.history.future).toEqual([e2, e1]);
    const r1 = popRedo(u2.history)!; // redoes e1 (top of future)
    expect(r1.redone).toBe(e1);
    const r2 = popRedo(r1.history)!; // redoes e2
    expect(r2.redone).toBe(e2);
  });
});

// ─── Cumulative invariants ──────────────────────────────────────────────────

describe("history cumulative invariants", () => {
  it("push N → undo N → redo N lands at the N-pushed state", () => {
    const { fileA } = makeFileIds();
    let h = EMPTY_HISTORY;
    const edits: Edit[] = [];
    for (let i = 1; i <= 5; i++) {
      const e = makeEdit(fileA, `v${i - 1}`, `v${i}`, 1000 + i * 1000);
      h = pushEdit(h, e, { noCoalesce: true });
      edits.push(e);
    }
    // Undo 5
    let cur = h;
    for (let i = 0; i < 5; i++) {
      const r = popUndo(cur);
      if (!r) throw new Error(`undo ${i} failed`);
      cur = r.history;
    }
    expect(cur.past.length).toBe(0);
    expect(cur.future.length).toBe(5);
    // Redo 5
    for (let i = 0; i < 5; i++) {
      const r = popRedo(cur);
      if (!r) throw new Error(`redo ${i} failed`);
      cur = r.history;
    }
    expect(cur.past.length).toBe(5);
    expect(cur.future.length).toBe(0);
    // Verify the order matches the original push order
    for (let i = 0; i < 5; i++) {
      expect(cur.past[i]).toBe(edits[i]);
    }
  });

  it("typing run of 10 keystrokes coalesces into 1 entry, undoes in 1 step", () => {
    const { fileA } = makeFileIds();
    let h = EMPTY_HISTORY;
    let prev = "v";
    for (let i = 1; i <= 10; i++) {
      const next = prev + "x";
      const e = makeEdit(fileA, prev, next, 1000 + i * 50); // 50ms apart
      h = pushEdit(h, e); // default coalesce
      prev = next;
    }
    expect(h.past.length).toBe(1); // all coalesced
    expect(h.past[0].diffs[0].before).toBe("v");
    expect(h.past[0].diffs[0].after).toBe("v" + "x".repeat(10));

    const u = popUndo(h);
    if (!u) throw new Error("undo failed");
    expect(u.history.past.length).toBe(0);
    expect(u.history.future.length).toBe(1);
  });

  it("undo sets nextSkipCoalesce so typing after undo opens a fresh entry", () => {
    const { fileA } = makeFileIds();
    // Push two coalesce-eligible edits → merged into 1.
    let h = pushEdit(EMPTY_HISTORY, makeEdit(fileA, "v1", "v2", 1000));
    h = pushEdit(h, makeEdit(fileA, "v2", "v3", 1100));
    expect(h.past.length).toBe(1);
    // Undo → 0 in past.
    const u = popUndo(h);
    if (!u) throw new Error("undo failed");
    expect(u.history.past.length).toBe(0);
    expect(u.history.nextSkipCoalesce).toBe(true);
    // Typing immediately after undo: should NOT coalesce into the redo entry
    // even though it would otherwise satisfy continuity. (Past has 0, future
    // has 1; the test is about whether typing PUSHES fresh or tries to
    // coalesce with future — coalesce only ever looks at past, so this is
    // tautologically fresh; but the barrier flag matters once past is
    // non-empty after a partial-undo.)
    const next = pushEdit(u.history, makeEdit(fileA, "v3", "v4", 1200));
    expect(next.past.length).toBe(1);
    // Continue typing: now coalesces normally (barrier cleared by the prior push).
    const next2 = pushEdit(next, makeEdit(fileA, "v4", "v5", 1250));
    expect(next2.past.length).toBe(1); // coalesced into top
  });

  it("partial undo + typing doesn't merge with the entry above the undone one", () => {
    const { fileA } = makeFileIds();
    // 3 separate runs.
    let h = pushEdit(EMPTY_HISTORY, makeEdit(fileA, "v0", "v1", 1000), {
      noCoalesce: true,
    });
    h = pushEdit(h, makeEdit(fileA, "v1", "v2", 5000), { noCoalesce: true });
    expect(h.past.length).toBe(2);
    // Undo the second run.
    const u = popUndo(h);
    if (!u) throw new Error("undo failed");
    expect(u.history.past.length).toBe(1);
    expect(u.history.nextSkipCoalesce).toBe(true);
    // Type immediately. Without the barrier, this could coalesce with the
    // first run if ts diff happens to be small. With barrier=true, it pushes
    // fresh.
    const next = pushEdit(u.history, makeEdit(fileA, "v1", "v2-NEW", 1050));
    expect(next.past.length).toBe(2);
    expect(next.past[1].diffs[0].after).toBe("v2-NEW");
  });

  it("redo sets nextSkipCoalesce so typing after redo opens a fresh entry", () => {
    const { fileA } = makeFileIds();
    let h = pushEdit(EMPTY_HISTORY, makeEdit(fileA, "v1", "v2", 1000));
    const u = popUndo(h);
    if (!u) throw new Error("undo failed");
    const r = popRedo(u.history);
    if (!r) throw new Error("redo failed");
    expect(r.history.nextSkipCoalesce).toBe(true);
    // Type immediately — push fresh, not coalesced into the redone entry.
    const next = pushEdit(r.history, makeEdit(fileA, "v2", "v3", 1050));
    expect(next.past.length).toBe(2);
  });

  it("noCoalesce barrier: typing then noCoalesce-push then typing → 3 entries", () => {
    const { fileA } = makeFileIds();
    let h = EMPTY_HISTORY;
    // Run 1: 3 fast keystrokes coalesce
    let prev = "v0";
    for (let i = 1; i <= 3; i++) {
      const next = `v${i}`;
      h = pushEdit(h, makeEdit(fileA, prev, next, 1000 + i * 50));
      prev = next;
    }
    expect(h.past.length).toBe(1);
    // Barrier: noCoalesce push
    const barrier = makeEdit(fileA, "v3", "v3-COMMIT", 1300);
    h = pushEdit(h, barrier, { noCoalesce: true });
    expect(h.past.length).toBe(2);
    // Run 2: 3 more fast keystrokes — should coalesce among themselves but
    // not into the barrier.
    prev = "v3-COMMIT";
    for (let i = 1; i <= 3; i++) {
      const next = `v3-COMMIT-${i}`;
      h = pushEdit(h, makeEdit(fileA, prev, next, 1400 + i * 50));
      prev = next;
    }
    expect(h.past.length).toBe(3);
  });
});
