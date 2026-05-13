// Phase C / B.1 — Direct prod-import coverage for `lib/edits/`.
//
// Same testing convention as `tests/files-prod.test.ts`: import the actual lib
// functions, not a bench-inlined mirror. Drift between bench and prod surfaces
// as one-side-fails. v1 has no bench for this module yet (Phase B.2 + the
// host hook are what consume the operations); the prod-import test is the
// only signal until then.

import { describe, it, expect } from "vitest";
import {
  createEditId,
  createEdit,
  editFromSourceChange,
  applyEdit,
  revertEdit,
  tryCoalesce,
} from "../lib/edits/operations";
import {
  COALESCE_WINDOW_MS,
  BULK_EDIT_THRESHOLD,
  type Edit,
  type FileDiff,
} from "../lib/edits/types";
import {
  createProject,
  addFile,
  getEntryFile,
  getFile,
} from "../lib/files/operations";
import type { FileId, Project } from "../lib/files/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeProject(): {
  project: Project;
  fileA: FileId;
  fileB: FileId;
  fileC: FileId;
} {
  const r = createProject({
    name: "edit-test",
    entryPath: "App.jsx",
    entrySource: "// A v1",
    idOverride: "edit-test-base",
  });
  if (!r.ok) throw new Error("makeProject: createProject failed");
  const r1 = addFile(r.project, { path: "B.jsx", source: "// B v1" });
  if (!r1.ok) throw new Error("makeProject: addFile B failed");
  const r2 = addFile(r1.project, { path: "C.jsx", source: "// C v1" });
  if (!r2.ok) throw new Error("makeProject: addFile C failed");

  const fileA = r.entryFileId;
  const fileB = Array.from(r1.project.files.keys()).find((k) => k !== fileA);
  const fileC = Array.from(r2.project.files.keys()).find(
    (k) => k !== fileA && k !== fileB,
  );
  if (!fileB || !fileC) throw new Error("makeProject: id resolution failed");
  return { project: r2.project, fileA, fileB, fileC };
}

function makeDiff(fileId: FileId, before: string, after: string): FileDiff {
  return { fileId, before, after };
}

// ─── createEditId ───────────────────────────────────────────────────────────

describe("createEditId", () => {
  it("returns a non-empty string", () => {
    const id = createEditId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("yields unique ids across rapid calls", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) ids.add(createEditId());
    // ≥ 99 unique out of 100 — same-millisecond random collisions are rare
    // but possible with 3-char random suffix; 6 chars total = ~46k * 46k.
    expect(ids.size).toBeGreaterThanOrEqual(99);
  });
});

// ─── createEdit ─────────────────────────────────────────────────────────────

describe("createEdit", () => {
  it("rejects an empty diff list", () => {
    const r = createEdit({ diffs: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/at least one/);
  });

  it("rejects duplicate fileIds in diffs", () => {
    const { fileA } = makeProject();
    const r = createEdit({
      diffs: [makeDiff(fileA, "x", "y"), makeDiff(fileA, "y", "z")],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/duplicate fileId/);
  });

  it("happy path: builds an Edit with id + ts + diffs", () => {
    const { fileA } = makeProject();
    const r = createEdit({
      diffs: [makeDiff(fileA, "before", "after")],
      reason: "test",
      ts: 1000,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.edit.diffs.length).toBe(1);
    expect(r.edit.reason).toBe("test");
    expect(r.edit.ts).toBe(1000);
    expect(typeof r.edit.id).toBe("string");
  });

  it("multi-file diffs accepted (cross-file edits in Phase D)", () => {
    const { fileA, fileB, fileC } = makeProject();
    const r = createEdit({
      diffs: [
        makeDiff(fileA, "a1", "a2"),
        makeDiff(fileB, "b1", "b2"),
        makeDiff(fileC, "c1", "c2"),
      ],
      reason: "cross-file",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.edit.diffs.length).toBe(3);
  });

  it("default ts uses Date.now if not provided", () => {
    const { fileA } = makeProject();
    const before = Date.now();
    const r = createEdit({ diffs: [makeDiff(fileA, "x", "y")] });
    const after = Date.now();
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.edit.ts).toBeGreaterThanOrEqual(before);
      expect(r.edit.ts).toBeLessThanOrEqual(after);
    }
  });

  it("preserves diff insertion order", () => {
    const { fileA, fileB, fileC } = makeProject();
    const r = createEdit({
      diffs: [
        makeDiff(fileC, "c1", "c2"),
        makeDiff(fileA, "a1", "a2"),
        makeDiff(fileB, "b1", "b2"),
      ],
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.edit.diffs[0].fileId).toBe(fileC);
      expect(r.edit.diffs[1].fileId).toBe(fileA);
      expect(r.edit.diffs[2].fileId).toBe(fileB);
    }
  });
});

// ─── editFromSourceChange ───────────────────────────────────────────────────

describe("editFromSourceChange", () => {
  it("builds a 1-diff Edit from project's current state", () => {
    const { project, fileA } = makeProject();
    const r = editFromSourceChange(project, fileA, "// A v2");
    expect(r.ok).toBe(true);
    if (!r.ok || !r.edit) return;
    expect(r.edit.diffs.length).toBe(1);
    expect(r.edit.diffs[0].fileId).toBe(fileA);
    expect(r.edit.diffs[0].before).toBe("// A v1");
    expect(r.edit.diffs[0].after).toBe("// A v2");
  });

  it("returns null edit on no-op (source unchanged)", () => {
    const { project, fileA } = makeProject();
    const r = editFromSourceChange(project, fileA, "// A v1");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.edit).toBeNull();
  });

  it("rejects unknown fileId", () => {
    const { project } = makeProject();
    const ghost = "ghost-id" as FileId;
    const r = editFromSourceChange(project, ghost, "anything");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/file not found/);
  });

  it("threads reason + ts through", () => {
    const { project, fileA } = makeProject();
    const r = editFromSourceChange(project, fileA, "// A v2", {
      reason: "dice roll",
      ts: 2000,
    });
    expect(r.ok).toBe(true);
    if (r.ok && r.edit) {
      expect(r.edit.reason).toBe("dice roll");
      expect(r.edit.ts).toBe(2000);
    }
  });
});

// ─── applyEdit ──────────────────────────────────────────────────────────────

describe("applyEdit", () => {
  it("happy path: forward apply updates the file's source", () => {
    const { project, fileA } = makeProject();
    const e = createEdit({ diffs: [makeDiff(fileA, "// A v1", "// A v2")] });
    if (!e.ok) throw new Error("createEdit failed");
    const r = applyEdit(project, e.edit);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(getEntryFile(r.project).source).toBe("// A v2");
    }
  });

  it("multi-file apply: every diff applied atomically in input order", () => {
    const { project, fileA, fileB, fileC } = makeProject();
    const e = createEdit({
      diffs: [
        makeDiff(fileA, "// A v1", "// A v2"),
        makeDiff(fileB, "// B v1", "// B v2"),
        makeDiff(fileC, "// C v1", "// C v2"),
      ],
    });
    if (!e.ok) throw new Error("createEdit failed");
    const r = applyEdit(project, e.edit);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(getFile(r.project, fileA)?.source).toBe("// A v2");
      expect(getFile(r.project, fileB)?.source).toBe("// B v2");
      expect(getFile(r.project, fileC)?.source).toBe("// C v2");
    }
  });

  it("rejects when fileId not in project", () => {
    const { project } = makeProject();
    const ghost = "ghost-id" as FileId;
    const e = createEdit({ diffs: [makeDiff(ghost, "x", "y")] });
    if (!e.ok) throw new Error("createEdit failed");
    const r = applyEdit(project, e.edit);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/file not found/);
  });

  it("rejects when before-snapshot diverged (concurrent state)", () => {
    const { project, fileA } = makeProject();
    // Edit thinks the file was "// A v1" but the project has it that way too.
    // Construct a divergent before string.
    const e = createEdit({
      diffs: [makeDiff(fileA, "// A NOT v1", "// A v2")],
    });
    if (!e.ok) throw new Error("createEdit failed");
    const r = applyEdit(project, e.edit);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/diverged/);
  });

  it("does NOT mutate input project on failure", () => {
    const { project, fileA } = makeProject();
    const e = createEdit({
      diffs: [makeDiff(fileA, "// A NOT v1", "// A v2")],
    });
    if (!e.ok) throw new Error("createEdit failed");
    applyEdit(project, e.edit); // expected to fail
    // Original project unchanged
    expect(getEntryFile(project).source).toBe("// A v1");
  });

  it("multi-file: validates ALL fileIds before applying first (atomicity)", () => {
    const { project, fileA, fileB } = makeProject();
    const ghost = "ghost-id" as FileId;
    const e = createEdit({
      diffs: [
        makeDiff(fileA, "// A v1", "// A v2"), // valid
        makeDiff(fileB, "// B v1", "// B v2"), // valid
        makeDiff(ghost, "x", "y"), // INVALID — would land third
      ],
    });
    if (!e.ok) throw new Error("createEdit failed");
    const r = applyEdit(project, e.edit);
    expect(r.ok).toBe(false);
    // Importantly: even though A and B were valid, none were applied because
    // validation failed before any updateFileSource call.
    expect(getFile(project, fileA)?.source).toBe("// A v1");
    expect(getFile(project, fileB)?.source).toBe("// B v1");
  });
});

// ─── revertEdit ─────────────────────────────────────────────────────────────

describe("revertEdit", () => {
  it("happy path: backward apply restores the file's source", () => {
    const { project, fileA } = makeProject();
    const e = createEdit({ diffs: [makeDiff(fileA, "// A v1", "// A v2")] });
    if (!e.ok) throw new Error("createEdit failed");
    const applied = applyEdit(project, e.edit);
    if (!applied.ok) throw new Error("apply failed");
    const r = revertEdit(applied.project, e.edit);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(getEntryFile(r.project).source).toBe("// A v1");
    }
  });

  it("rejects when after-snapshot diverged (concurrent state)", () => {
    const { project, fileA } = makeProject();
    // Project still has "// A v1"; revert expects it to be "// A v2"
    // (the after of an edit that was never applied or has been undone again).
    const e = createEdit({ diffs: [makeDiff(fileA, "// A v1", "// A v2")] });
    if (!e.ok) throw new Error("createEdit failed");
    const r = revertEdit(project, e.edit);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/diverged/);
  });

  it("multi-file revert mirrors multi-file apply", () => {
    const { project, fileA, fileB } = makeProject();
    const e = createEdit({
      diffs: [
        makeDiff(fileA, "// A v1", "// A v2"),
        makeDiff(fileB, "// B v1", "// B v2"),
      ],
    });
    if (!e.ok) throw new Error("createEdit failed");
    const applied = applyEdit(project, e.edit);
    if (!applied.ok) throw new Error("apply failed");
    const reverted = revertEdit(applied.project, e.edit);
    expect(reverted.ok).toBe(true);
    if (reverted.ok) {
      expect(getFile(reverted.project, fileA)?.source).toBe("// A v1");
      expect(getFile(reverted.project, fileB)?.source).toBe("// B v1");
    }
  });

  it("apply→revert is the identity on entry-file source", () => {
    const { project, fileA } = makeProject();
    const original = getEntryFile(project).source;
    const e = createEdit({ diffs: [makeDiff(fileA, original, "modified")] });
    if (!e.ok) throw new Error("createEdit failed");
    const applied = applyEdit(project, e.edit);
    if (!applied.ok) throw new Error("apply failed");
    const reverted = revertEdit(applied.project, e.edit);
    expect(reverted.ok).toBe(true);
    if (reverted.ok) {
      expect(getEntryFile(reverted.project).source).toBe(original);
    }
  });

  it("rejects unknown fileId in any diff", () => {
    const { project, fileA } = makeProject();
    const ghost = "ghost-id" as FileId;
    const e = createEdit({
      diffs: [
        makeDiff(fileA, "// A v1", "// A v2"),
        makeDiff(ghost, "x", "y"),
      ],
    });
    if (!e.ok) throw new Error("createEdit failed");
    const applied = applyEdit(project, e.edit);
    expect(applied.ok).toBe(false); // ghost makes apply fail too
    // For revert, manually construct a project where fileA is at v2 then try
    // to revert with a bad fileId.
    const partApply = applyEdit(project, {
      ...e.edit,
      diffs: [e.edit.diffs[0]], // only fileA
    });
    if (!partApply.ok) throw new Error("partial apply failed");
    const r = revertEdit(partApply.project, e.edit);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/file not found/);
  });
});

// ─── tryCoalesce ────────────────────────────────────────────────────────────

describe("tryCoalesce", () => {
  function buildEdit(
    fileId: FileId,
    before: string,
    after: string,
    ts: number,
  ): Edit {
    const r = createEdit({ diffs: [makeDiff(fileId, before, after)], ts });
    if (!r.ok) throw new Error("buildEdit failed");
    return r.edit;
  }

  it("merges sequential same-file edits within window", () => {
    const { fileA } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    const b = buildEdit(fileA, "v2", "v3", 1100); // 100ms later, within 300ms
    const merged = tryCoalesce(a, b);
    expect(merged).not.toBeNull();
    if (merged) {
      expect(merged.diffs[0].before).toBe("v1");
      expect(merged.diffs[0].after).toBe("v3");
      expect(merged.ts).toBe(1100); // most recent
    }
  });

  it("rejects when ts delta >= window (boundary)", () => {
    const { fileA } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    const b = buildEdit(fileA, "v2", "v3", 1000 + COALESCE_WINDOW_MS); // exactly at window
    expect(tryCoalesce(a, b)).toBeNull();
  });

  it("merges when ts delta == window-1 (just inside)", () => {
    const { fileA } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    const b = buildEdit(fileA, "v2", "v3", 1000 + COALESCE_WINDOW_MS - 1);
    expect(tryCoalesce(a, b)).not.toBeNull();
  });

  it("rejects different fileIds", () => {
    const { fileA, fileB } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    const b = buildEdit(fileB, "v1", "v2", 1100);
    expect(tryCoalesce(a, b)).toBeNull();
  });

  it("rejects when bulk delta exceeds threshold", () => {
    const { fileA } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    // Big after — delta = 100 chars, > BULK_EDIT_THRESHOLD (50)
    const big = "x".repeat(100);
    const b = buildEdit(fileA, "v2", big, 1100);
    expect(tryCoalesce(a, b)).toBeNull();
  });

  it("merges at the bulk threshold boundary (delta == threshold)", () => {
    const { fileA } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    // delta = exactly BULK_EDIT_THRESHOLD chars (additive); merge boundary = > threshold
    const justAtThreshold = "v2" + "x".repeat(BULK_EDIT_THRESHOLD);
    const b = buildEdit(fileA, "v2", justAtThreshold, 1100);
    expect(tryCoalesce(a, b)).not.toBeNull();
  });

  it("rejects when prev is multi-file (explicit gesture)", () => {
    const { fileA, fileB } = makeProject();
    const ra = createEdit({
      diffs: [
        makeDiff(fileA, "a1", "a2"),
        makeDiff(fileB, "b1", "b2"),
      ],
      ts: 1000,
    });
    if (!ra.ok) throw new Error("ra failed");
    const b = buildEdit(fileA, "a2", "a3", 1100);
    expect(tryCoalesce(ra.edit, b)).toBeNull();
  });

  it("rejects when next is multi-file", () => {
    const { fileA, fileB } = makeProject();
    const a = buildEdit(fileA, "a1", "a2", 1000);
    const rb = createEdit({
      diffs: [
        makeDiff(fileA, "a2", "a3"),
        makeDiff(fileB, "b1", "b2"),
      ],
      ts: 1100,
    });
    if (!rb.ok) throw new Error("rb failed");
    expect(tryCoalesce(a, rb.edit)).toBeNull();
  });

  it("rejects when next.before doesn't match prev.after (continuity check)", () => {
    const { fileA } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    const b = buildEdit(fileA, "v2.5-DIVERGED", "v3", 1100); // before mismatch
    expect(tryCoalesce(a, b)).toBeNull();
  });

  it("preserves prev.reason if both have reasons", () => {
    const { fileA } = makeProject();
    const ra = createEdit({
      diffs: [makeDiff(fileA, "v1", "v2")],
      reason: "first",
      ts: 1000,
    });
    const rb = createEdit({
      diffs: [makeDiff(fileA, "v2", "v3")],
      reason: "second",
      ts: 1100,
    });
    if (!ra.ok || !rb.ok) throw new Error("create failed");
    const merged = tryCoalesce(ra.edit, rb.edit);
    expect(merged).not.toBeNull();
    if (merged) expect(merged.reason).toBe("first");
  });

  it("falls back to next.reason if prev has none", () => {
    const { fileA } = makeProject();
    const ra = createEdit({
      diffs: [makeDiff(fileA, "v1", "v2")],
      ts: 1000,
    });
    const rb = createEdit({
      diffs: [makeDiff(fileA, "v2", "v3")],
      reason: "second",
      ts: 1100,
    });
    if (!ra.ok || !rb.ok) throw new Error("create failed");
    const merged = tryCoalesce(ra.edit, rb.edit);
    expect(merged).not.toBeNull();
    if (merged) expect(merged.reason).toBe("second");
  });

  it("respects custom windowMs override", () => {
    const { fileA } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    const b = buildEdit(fileA, "v2", "v3", 1500); // 500ms apart
    expect(tryCoalesce(a, b)).toBeNull(); // default window
    expect(tryCoalesce(a, b, { windowMs: 1000 })).not.toBeNull(); // custom larger
  });

  it("respects custom bulkThreshold override", () => {
    const { fileA } = makeProject();
    const a = buildEdit(fileA, "v1", "v2", 1000);
    const big = "v2" + "x".repeat(60);
    const b = buildEdit(fileA, "v2", big, 1100);
    expect(tryCoalesce(a, b)).toBeNull(); // delta 60 > default 50
    expect(tryCoalesce(a, b, { bulkThreshold: 100 })).not.toBeNull();
  });
});

// ─── Cumulative invariant ───────────────────────────────────────────────────

describe("cumulative invariants", () => {
  it("apply+revert chain: 5 edits forward, 5 reverts back, lands at original", () => {
    const { project, fileA } = makeProject();
    let cur = project;
    const edits: Edit[] = [];

    // Apply 5 edits forward
    for (let i = 1; i <= 5; i++) {
      const before = getFile(cur, fileA)!.source;
      const after = `// A v${i + 1}`;
      const r = createEdit({ diffs: [makeDiff(fileA, before, after)] });
      if (!r.ok) throw new Error("createEdit failed");
      const a = applyEdit(cur, r.edit);
      if (!a.ok) throw new Error("apply failed");
      cur = a.project;
      edits.push(r.edit);
    }
    expect(getFile(cur, fileA)?.source).toBe("// A v6");

    // Revert in reverse order
    for (const e of edits.slice().reverse()) {
      const r = revertEdit(cur, e);
      if (!r.ok) throw new Error("revert failed");
      cur = r.project;
    }

    expect(getFile(cur, fileA)?.source).toBe("// A v1");
  });

  it("coalesced typing run reverts to original in one step", () => {
    const { project, fileA } = makeProject();

    // Simulate 5 keystrokes within 300ms each
    let prev: Edit | null = null;
    let curSource = "// A v1";
    for (let i = 0; i < 5; i++) {
      const next = curSource + "x";
      const e = createEdit({
        diffs: [makeDiff(fileA, curSource, next)],
        ts: 1000 + i * 50, // 50ms apart
      });
      if (!e.ok) throw new Error("createEdit failed");
      curSource = next;
      if (prev) {
        const merged = tryCoalesce(prev, e.edit);
        if (!merged) throw new Error("coalesce should have worked");
        prev = merged;
      } else {
        prev = e.edit;
      }
    }

    expect(prev).not.toBeNull();
    if (!prev) return;
    expect(prev.diffs[0].before).toBe("// A v1"); // original
    expect(prev.diffs[0].after).toBe("// A v1xxxxx"); // 5 keystrokes worth

    // Apply the merged edit, then revert; lands at original.
    const a = applyEdit(project, prev);
    if (!a.ok) throw new Error("apply failed");
    expect(getFile(a.project, fileA)?.source).toBe("// A v1xxxxx");
    const r = revertEdit(a.project, prev);
    if (!r.ok) throw new Error("revert failed");
    expect(getFile(r.project, fileA)?.source).toBe("// A v1");
  });
});
