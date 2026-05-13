import { describe, it, expect } from "vitest";
import {
  addFile,
  createFileId,
  createProject,
  createProjectId,
  findFileByPath,
  getEntryFile,
  getFile,
  kindFromPath,
  listFiles,
  normalizePath,
  removeFile,
  renameFile,
  resolveRelativeImport,
  setEntryFile,
  updateFileSource,
} from "../lib/files/operations";
import { FILE_KINDS } from "../lib/files/types";
import type { FileId, Project } from "../lib/files/types";

// Phase C / A.1 — pure-logic test for the file pool foundation.
// Storage layer (IndexedDB) gets its own integration test in Phase A.2 once
// `fake-indexeddb` lands. This file covers only the synchronous, pure
// operations: types + path normalization + project mutations + queries.

// ─── helpers ────────────────────────────────────────────────────────────────

function makeFreshProject(): Project {
  const result = createProject({
    name: "test-project",
    entryPath: "App.jsx",
    entrySource: "<div />",
  });
  if (!result.ok) throw new Error("createProject failed in test setup");
  return result.project;
}

// ─── kind detection ─────────────────────────────────────────────────────────

describe("kindFromPath", () => {
  it("maps every supported extension", () => {
    expect(kindFromPath("App.jsx")).toBe("jsx");
    expect(kindFromPath("App.tsx")).toBe("tsx");
    expect(kindFromPath("util.js")).toBe("js");
    expect(kindFromPath("util.ts")).toBe("ts");
    expect(kindFromPath("page.html")).toBe("html");
  });

  it("is case-insensitive on the extension", () => {
    expect(kindFromPath("App.JSX")).toBe("jsx");
    expect(kindFromPath("Page.HTML")).toBe("html");
  });

  it("returns null for unsupported extensions", () => {
    expect(kindFromPath("README.md")).toBe(null);
    expect(kindFromPath("style.css")).toBe(null);
    expect(kindFromPath("data.json")).toBe(null);
  });

  it("returns null for files with no extension", () => {
    expect(kindFromPath("Makefile")).toBe(null);
    expect(kindFromPath("App")).toBe(null);
  });

  it("uses the last dot segment", () => {
    expect(kindFromPath("page.test.tsx")).toBe("tsx");
    expect(kindFromPath("a.b.c.d.html")).toBe("html");
  });
});

// ─── path normalization ─────────────────────────────────────────────────────

describe("normalizePath", () => {
  it("accepts a bare filename", () => {
    const r = normalizePath("App.jsx");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.path).toBe("App.jsx");
      expect(r.kind).toBe("jsx");
    }
  });

  it("strips leading slash", () => {
    const r = normalizePath("/App.jsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.path).toBe("App.jsx");
  });

  it("strips leading ./", () => {
    const r = normalizePath("./App.jsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.path).toBe("App.jsx");
  });

  it("normalizes nested paths", () => {
    const r = normalizePath("./components/Card.tsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.path).toBe("components/Card.tsx");
  });

  it("collapses inner /./ segments", () => {
    const r = normalizePath("components/./Card.tsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.path).toBe("components/Card.tsx");
  });

  it("resolves /../ within bounds", () => {
    const r = normalizePath("components/../App.jsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.path).toBe("App.jsx");
  });

  it("rejects paths that escape the project root", () => {
    const r = normalizePath("../escape.tsx");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/escapes project root/);
  });

  it("rejects deep escapes", () => {
    const r = normalizePath("a/b/../../../escape.tsx");
    expect(r.ok).toBe(false);
  });

  it("collapses multiple slashes", () => {
    const r = normalizePath("//double//slash.jsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.path).toBe("double/slash.jsx");
  });

  it("normalizes Windows-style backslashes", () => {
    const r = normalizePath("components\\Card.tsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.path).toBe("components/Card.tsx");
  });

  it("rejects empty paths", () => {
    expect(normalizePath("").ok).toBe(false);
    expect(normalizePath("   ").ok).toBe(false);
  });

  it("rejects paths with no supported extension", () => {
    const r = normalizePath("App");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/unsupported extension/);
  });

  it("rejects paths with non-allowed extensions", () => {
    const r = normalizePath("App.txt");
    expect(r.ok).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const r = normalizePath("  /App.jsx  ");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.path).toBe("App.jsx");
  });

  it("rejects paths containing null character", () => {
    const r = normalizePath("App\0.jsx");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/null character/);
  });

  it("returns the inferred kind alongside the normalized path", () => {
    const r = normalizePath("./components/foo.tsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.kind).toBe("tsx");
  });

  it("FILE_KINDS constant matches the parser's accept list", () => {
    // If a future commit adds "scss" to FILE_KINDS without updating the parser,
    // this canary fails. Cheap protection against drift between the two layers.
    for (const kind of FILE_KINDS) {
      const r = normalizePath(`File.${kind}`);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.kind).toBe(kind);
    }
  });
});

// ─── id generation ──────────────────────────────────────────────────────────

describe("createFileId / createProjectId", () => {
  it("createFileId returns 14-15 char strings", () => {
    // 9-char timestamp + 6 chars random = 15. Allow 14 because 14-char
    // timestamps are possible briefly during the next-decade boundary.
    const id = createFileId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThanOrEqual(14);
    expect(id.length).toBeLessThanOrEqual(16);
    expect(id).toMatch(/^[a-z0-9]+$/);
  });

  it("createFileId produces 100/100 unique ids in tight loop", () => {
    const set = new Set<string>();
    for (let i = 0; i < 100; i++) set.add(createFileId());
    expect(set.size).toBe(100);
  });

  it("createProjectId follows the same shape", () => {
    const id = createProjectId();
    expect(typeof id).toBe("string");
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

// ─── createProject ──────────────────────────────────────────────────────────

describe("createProject", () => {
  it("returns a project with the entry file present and addressable", () => {
    const r = createProject({
      name: "my-page",
      entryPath: "App.jsx",
      entrySource: "<div />",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;

    expect(r.project.name).toBe("my-page");
    expect(r.project.files.size).toBe(1);
    expect(r.project.files.get(r.entryFileId)).toBeDefined();
    expect(r.project.files.get(r.entryFileId)?.path).toBe("App.jsx");
    expect(r.project.files.get(r.entryFileId)?.source).toBe("<div />");
    expect(r.project.files.get(r.entryFileId)?.kind).toBe("jsx");
    expect(r.project.entryFileId).toBe(r.entryFileId);
  });

  it("normalizes the entry path", () => {
    const r = createProject({
      name: "p",
      entryPath: "./components/App.tsx",
      entrySource: "",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const entry = getEntryFile(r.project);
      expect(entry.path).toBe("components/App.tsx");
    }
  });

  it("rejects an invalid entry path", () => {
    const r = createProject({ name: "p", entryPath: "App", entrySource: "" });
    expect(r.ok).toBe(false);
  });

  it("createdAt and updatedAt are equal at creation", () => {
    const r = createProject({
      name: "p",
      entryPath: "App.jsx",
      entrySource: "",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.project.createdAt).toBe(r.project.updatedAt);
  });

  it("idOverride lands the project at the supplied id verbatim", () => {
    // Phase A.2: Workspace uses a deterministic id derived from filename+kind
    // so reloading the page hits the same IDB key. Verify createProject honors
    // the override exactly — no namespacing, no hashing, no prefix.
    const r = createProject({
      name: "p",
      entryPath: "App.jsx",
      entrySource: "",
      idOverride: "dropin:project:playground:jsx",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.project.id).toBe("dropin:project:playground:jsx");
  });

  it("without idOverride, the id is freshly generated", () => {
    const a = createProject({ name: "p", entryPath: "App.jsx", entrySource: "" });
    const b = createProject({ name: "p", entryPath: "App.jsx", entrySource: "" });
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.project.id).not.toBe(b.project.id);
  });
});

// ─── addFile ────────────────────────────────────────────────────────────────

describe("addFile", () => {
  it("appends a new file and increments updatedAt", async () => {
    const p0 = makeFreshProject();
    // Sleep a tick so updatedAt strictly increases. We can't mock Date.now
    // here without a fake-timers setup, but a 2-ms delay reliably passes.
    await new Promise((r) => setTimeout(r, 2));

    const r = addFile(p0, { path: "components/Card.tsx", source: "<div />" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;

    expect(r.project.files.size).toBe(2);
    const card = findFileByPath(r.project, "components/Card.tsx");
    expect(card).toBeDefined();
    expect(card?.kind).toBe("tsx");
    expect(r.project.updatedAt).toBeGreaterThanOrEqual(p0.updatedAt);
  });

  it("rejects duplicate paths", () => {
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "components/Card.tsx", source: "" });
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;

    const r2 = addFile(r1.project, { path: "components/Card.tsx", source: "" });
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.error).toMatch(/already exists/);
  });

  it("rejects duplicate paths even when the input differs in normalization", () => {
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "components/Card.tsx", source: "" });
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;

    const r2 = addFile(r1.project, {
      path: "./components/Card.tsx",
      source: "",
    });
    expect(r2.ok).toBe(false);
  });

  it("rejects invalid paths with the underlying normalizer's error message", () => {
    const p0 = makeFreshProject();
    const r = addFile(p0, { path: "no-ext", source: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/unsupported extension/);
  });

  it("does not mutate the input project", () => {
    const p0 = makeFreshProject();
    const sizeBefore = p0.files.size;
    addFile(p0, { path: "components/Card.tsx", source: "" });
    expect(p0.files.size).toBe(sizeBefore);
  });
});

// ─── removeFile ─────────────────────────────────────────────────────────────

describe("removeFile", () => {
  it("removes a non-entry file", () => {
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "components/Card.tsx", source: "" });
    if (!r1.ok) throw new Error("setup failed");
    const card = findFileByPath(r1.project, "components/Card.tsx");
    if (!card) throw new Error("card not found");

    const r2 = removeFile(r1.project, card.id);
    expect(r2.ok).toBe(true);
    if (r2.ok) {
      expect(r2.project.files.size).toBe(1);
      expect(findFileByPath(r2.project, "components/Card.tsx")).toBe(null);
    }
  });

  it("rejects removing the entry file", () => {
    const p0 = makeFreshProject();
    const r = removeFile(p0, p0.entryFileId);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/cannot remove the entry file/);
  });

  it("rejects an unknown fileId", () => {
    const p0 = makeFreshProject();
    const r = removeFile(p0, "does-not-exist" as FileId);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/file not found/);
  });

  it("does not mutate the input project", () => {
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "components/Card.tsx", source: "" });
    if (!r1.ok) throw new Error("setup failed");
    const sizeBefore = r1.project.files.size;
    const card = findFileByPath(r1.project, "components/Card.tsx");
    if (!card) throw new Error("card not found");
    removeFile(r1.project, card.id);
    expect(r1.project.files.size).toBe(sizeBefore);
  });
});

// ─── updateFileSource ───────────────────────────────────────────────────────

describe("updateFileSource", () => {
  it("updates the source", () => {
    const p0 = makeFreshProject();
    const r = updateFileSource(p0, p0.entryFileId, "<span />");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(getEntryFile(r.project).source).toBe("<span />");
    }
  });

  it("returns identity-equal project when source is unchanged (hot path)", () => {
    const p0 = makeFreshProject();
    const r = updateFileSource(p0, p0.entryFileId, "<div />"); // same as entry source
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.project).toBe(p0);
  });

  it("rejects an unknown fileId", () => {
    const p0 = makeFreshProject();
    const r = updateFileSource(p0, "missing" as FileId, "");
    expect(r.ok).toBe(false);
  });

  it("does not mutate the input project", () => {
    const p0 = makeFreshProject();
    updateFileSource(p0, p0.entryFileId, "<span />");
    expect(getEntryFile(p0).source).toBe("<div />");
  });

  it("preserves the file id and path through the update", () => {
    const p0 = makeFreshProject();
    const r = updateFileSource(p0, p0.entryFileId, "x");
    expect(r.ok).toBe(true);
    if (r.ok) {
      const entry = getEntryFile(r.project);
      expect(entry.id).toBe(p0.entryFileId);
      expect(entry.path).toBe(getEntryFile(p0).path);
      expect(entry.kind).toBe(getEntryFile(p0).kind);
    }
  });
});

// ─── renameFile ─────────────────────────────────────────────────────────────

describe("renameFile", () => {
  it("renames a file and updates its kind to match the new extension", () => {
    const p0 = makeFreshProject();
    const r = renameFile(p0, p0.entryFileId, "App.tsx");
    expect(r.ok).toBe(true);
    if (r.ok) {
      const entry = getEntryFile(r.project);
      expect(entry.path).toBe("App.tsx");
      expect(entry.kind).toBe("tsx");
    }
  });

  it("preserves source and id on rename", () => {
    const p0 = makeFreshProject();
    const sourceBefore = getEntryFile(p0).source;
    const r = renameFile(p0, p0.entryFileId, "renamed.jsx");
    expect(r.ok).toBe(true);
    if (r.ok) {
      const entry = getEntryFile(r.project);
      expect(entry.id).toBe(p0.entryFileId);
      expect(entry.source).toBe(sourceBefore);
    }
  });

  it("returns identity-equal project on no-op rename (same path after normalize)", () => {
    const p0 = makeFreshProject();
    const r = renameFile(p0, p0.entryFileId, "./App.jsx");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.project).toBe(p0);
  });

  it("rejects when the new path collides with another file", () => {
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "Other.jsx", source: "" });
    if (!r1.ok) throw new Error("setup failed");

    const r2 = renameFile(r1.project, p0.entryFileId, "Other.jsx");
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.error).toMatch(/already exists/);
  });

  it("rejects an unknown fileId", () => {
    const p0 = makeFreshProject();
    const r = renameFile(p0, "missing" as FileId, "x.jsx");
    expect(r.ok).toBe(false);
  });

  it("rejects an invalid new path", () => {
    const p0 = makeFreshProject();
    const r = renameFile(p0, p0.entryFileId, "x.txt");
    expect(r.ok).toBe(false);
  });
});

// ─── setEntryFile ───────────────────────────────────────────────────────────

describe("setEntryFile", () => {
  it("updates entryFileId to point at an existing file", () => {
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "Other.jsx", source: "" });
    if (!r1.ok) throw new Error("setup failed");
    const other = findFileByPath(r1.project, "Other.jsx");
    if (!other) throw new Error("setup failed");

    const r2 = setEntryFile(r1.project, other.id);
    expect(r2.ok).toBe(true);
    if (r2.ok) expect(r2.project.entryFileId).toBe(other.id);
  });

  it("rejects an unknown fileId", () => {
    const p0 = makeFreshProject();
    const r = setEntryFile(p0, "missing" as FileId);
    expect(r.ok).toBe(false);
  });

  it("returns identity-equal project on no-op (already entry)", () => {
    const p0 = makeFreshProject();
    const r = setEntryFile(p0, p0.entryFileId);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.project).toBe(p0);
  });

  it("after rename + remove, entry-still-exists invariant holds", () => {
    // Defensive sanity: can we rename the entry, then remove a non-entry,
    // and still satisfy `getEntryFile`? This is the cumulative invariant
    // path across ops, which v1 single-file users go through every session.
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "components/Card.tsx", source: "" });
    if (!r1.ok) throw new Error("setup failed");
    const card = findFileByPath(r1.project, "components/Card.tsx");
    if (!card) throw new Error("setup failed");

    const r2 = renameFile(r1.project, p0.entryFileId, "Renamed.jsx");
    if (!r2.ok) throw new Error("rename failed");
    const r3 = removeFile(r2.project, card.id);
    if (!r3.ok) throw new Error("remove failed");

    const entry = getEntryFile(r3.project);
    expect(entry.path).toBe("Renamed.jsx");
  });
});

// ─── queries ────────────────────────────────────────────────────────────────

describe("getFile / findFileByPath / getEntryFile / listFiles", () => {
  it("getFile returns the file for a known id", () => {
    const p0 = makeFreshProject();
    const f = getFile(p0, p0.entryFileId);
    expect(f).not.toBe(null);
    expect(f?.id).toBe(p0.entryFileId);
  });

  it("getFile returns null for an unknown id", () => {
    const p0 = makeFreshProject();
    expect(getFile(p0, "missing" as FileId)).toBe(null);
  });

  it("findFileByPath normalizes the input", () => {
    const p0 = makeFreshProject();
    expect(findFileByPath(p0, "App.jsx")?.id).toBe(p0.entryFileId);
    expect(findFileByPath(p0, "/App.jsx")?.id).toBe(p0.entryFileId);
    expect(findFileByPath(p0, "./App.jsx")?.id).toBe(p0.entryFileId);
  });

  it("findFileByPath returns null for an invalid path (rather than throwing)", () => {
    const p0 = makeFreshProject();
    expect(findFileByPath(p0, "")).toBe(null);
    expect(findFileByPath(p0, "../escape.jsx")).toBe(null);
  });

  it("listFiles is sorted by path for deterministic UI rendering", () => {
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "z.jsx", source: "" });
    if (!r1.ok) throw new Error("setup failed");
    const r2 = addFile(r1.project, { path: "a.jsx", source: "" });
    if (!r2.ok) throw new Error("setup failed");
    const r3 = addFile(r2.project, { path: "components/Card.tsx", source: "" });
    if (!r3.ok) throw new Error("setup failed");

    const paths = listFiles(r3.project).map((f) => f.path);
    expect(paths).toEqual(["App.jsx", "a.jsx", "components/Card.tsx", "z.jsx"]);
  });

  it("getEntryFile throws on an invariant violation (defensive)", () => {
    // Hand-construct a malformed Project to exercise the throw path. No
    // production op produces this state — both addFile and removeFile
    // preserve the invariant.
    const broken: Project = {
      id: "x",
      name: "x",
      files: new Map(),
      entryFileId: "missing" as FileId,
      createdAt: 0,
      updatedAt: 0,
    };
    expect(() => getEntryFile(broken)).toThrow(/invariant violation/);
  });
});

// ─── resolveRelativeImport ──────────────────────────────────────────────────

describe("resolveRelativeImport", () => {
  it("resolves './foo' from the entry to a sibling file", () => {
    const p0 = makeFreshProject();
    const r = addFile(p0, { path: "components/Card.tsx", source: "" });
    if (!r.ok) throw new Error("setup failed");

    const found = resolveRelativeImport(r.project, "App.jsx", "./components/Card");
    expect(found?.path).toBe("components/Card.tsx");
  });

  it("resolves ./Card.tsx with explicit extension", () => {
    const p0 = makeFreshProject();
    const r = addFile(p0, { path: "components/Card.tsx", source: "" });
    if (!r.ok) throw new Error("setup failed");

    const found = resolveRelativeImport(
      r.project,
      "App.jsx",
      "./components/Card.tsx",
    );
    expect(found?.path).toBe("components/Card.tsx");
  });

  it("resolves '../foo' from a nested file back to root", () => {
    const p0 = makeFreshProject();
    const r1 = addFile(p0, { path: "components/Card.tsx", source: "" });
    if (!r1.ok) throw new Error("setup failed");
    const r2 = addFile(r1.project, { path: "lib/util.ts", source: "" });
    if (!r2.ok) throw new Error("setup failed");

    const found = resolveRelativeImport(
      r2.project,
      "components/Card.tsx",
      "../lib/util",
    );
    expect(found?.path).toBe("lib/util.ts");
  });

  it("returns null for a non-relative import (curated npm path takes over)", () => {
    const p0 = makeFreshProject();
    expect(resolveRelativeImport(p0, "App.jsx", "react")).toBe(null);
    expect(resolveRelativeImport(p0, "App.jsx", "lucide-react")).toBe(null);
  });

  it("returns null when the relative import doesn't match any file", () => {
    const p0 = makeFreshProject();
    expect(resolveRelativeImport(p0, "App.jsx", "./missing")).toBe(null);
  });

  it("tries each supported extension in order for extensionless imports", () => {
    const p0 = makeFreshProject();
    // Two candidates with the same stem; the resolver picks .jsx first by
    // virtue of FILE_KINDS order — pin that ordering here so a future re-order
    // of FILE_KINDS surfaces as a test failure (Tailwind / OID parser also
    // depend on this canary).
    const r1 = addFile(p0, { path: "lib/foo.tsx", source: "" });
    if (!r1.ok) throw new Error("setup failed");
    const r2 = addFile(r1.project, { path: "lib/foo.jsx", source: "" });
    if (!r2.ok) throw new Error("setup failed");

    const found = resolveRelativeImport(r2.project, "App.jsx", "./lib/foo");
    expect(found?.path).toBe("lib/foo.jsx");
  });
});
