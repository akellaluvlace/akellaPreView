// @vitest-environment jsdom
//
// Phase C / A.2 — IDB persistence integration test.
//
// What this covers that the pure-logic tests don't: the actual round-trip
// through IndexedDB. `lib/files/storage.ts` serializes Map → Array on the way
// in and Array → Map on the way out; `tests/files-prod.test.ts` exercises the
// pure operations but never crosses the structured-clone boundary. Real
// shape preservation across that boundary is the contract Workspace.tsx
// depends on (it expects `getEntryFile(loaded).source` to equal the source
// it last persisted).
//
// Why jsdom env: `lib/files/storage.ts` rejects with a clear error when
// `typeof window === "undefined"` (file-pool is client-only). The
// `// @vitest-environment jsdom` directive switches THIS file's runtime so
// `window` is defined; the rest of the suite stays on the cheaper node env.
//
// Why fake-indexeddb: jsdom does NOT ship an IndexedDB implementation. Without
// fake-indexeddb, `indexedDB.open(...)` would be undefined. The `auto`
// subpath installs `indexedDB` + `IDBKeyRange` on globalThis on import.
import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import {
  createProject,
  getEntryFile,
  updateFileSource,
} from "../../lib/files/operations";
import {
  loadProject,
  saveProject,
  deleteProject,
  listProjects,
  __resetDbPromiseForTests,
} from "../../lib/files/storage";

const DB_NAME = "dropin-files";

// Wipe IDB between tests so each case starts with a clean store. The reset
// helper closes any open db handle first; deleteDatabase then completes
// without blocking.
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

describe("file pool — IDB round-trip", () => {
  beforeEach(async () => {
    await wipeDb();
  });

  it("save → load preserves project shape and entry source", async () => {
    const r = createProject({
      name: "test",
      entryPath: "App.jsx",
      entrySource: "<div>hi</div>",
      idOverride: "dropin:project:playground:jsx",
    });
    if (!r.ok) throw new Error(`create failed: ${r.error}`);

    await saveProject(r.project);
    const loaded = await loadProject("dropin:project:playground:jsx");

    expect(loaded).not.toBeNull();
    if (!loaded) return;
    expect(loaded.id).toBe("dropin:project:playground:jsx");
    expect(loaded.name).toBe("test");
    expect(loaded.entryFileId).toBe(r.project.entryFileId);
    expect(loaded.files.size).toBe(1);
    expect(loaded.files instanceof Map).toBe(true);
    expect(loaded.createdAt).toBe(r.project.createdAt);
    expect(loaded.updatedAt).toBe(r.project.updatedAt);

    const entry = getEntryFile(loaded);
    expect(entry.id).toBe(r.project.entryFileId);
    expect(entry.path).toBe("App.jsx");
    expect(entry.kind).toBe("jsx");
    expect(entry.source).toBe("<div>hi</div>");
  });

  it("returns null for an absent project id", async () => {
    const loaded = await loadProject("dropin:does-not-exist");
    expect(loaded).toBeNull();
  });

  it("subsequent save overwrites the prior record at the same id", async () => {
    const v1 = createProject({
      name: "test",
      entryPath: "App.jsx",
      entrySource: "<div>v1</div>",
      idOverride: "dropin:overwrite",
    });
    if (!v1.ok) throw new Error("create v1 failed");
    await saveProject(v1.project);

    const v2 = updateFileSource(
      v1.project,
      v1.project.entryFileId,
      "<div>v2</div>",
    );
    if (!v2.ok) throw new Error("updateFileSource failed");
    await saveProject(v2.project);

    const loaded = await loadProject("dropin:overwrite");
    expect(loaded).not.toBeNull();
    if (loaded) expect(getEntryFile(loaded).source).toBe("<div>v2</div>");
  });

  it("rejects a corrupted record (entryFileId not in files)", async () => {
    // Bypass saveProject to plant a corrupted record. saveProject would never
    // emit one — the on-disk shape always reflects an in-memory project that
    // satisfies the entryFileId invariant — but a future schema migration
    // might leave a record half-rewritten, so loadProject's defensive check
    // surfaces the issue rather than crashing on first read.
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("projects");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("projects", "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore("projects").put(
        {
          id: "corrupt",
          name: "corrupt",
          files: [
            { id: "real-file-id", path: "App.jsx", kind: "jsx", source: "" },
          ],
          entryFileId: "ghost-id-not-in-files",
          createdAt: 0,
          updatedAt: 0,
        },
        "corrupt",
      );
    });
    db.close();
    await __resetDbPromiseForTests();

    await expect(loadProject("corrupt")).rejects.toThrow(/corrupted/);
  });

  it("listProjects returns ProjectSummary[] sorted by updatedAt desc", async () => {
    const a = createProject({
      name: "older",
      entryPath: "App.jsx",
      entrySource: "",
      idOverride: "dropin:older",
    });
    if (!a.ok) throw new Error("a failed");
    await saveProject(a.project);
    // Bump newer's updatedAt so the sort is deterministic across machines.
    await new Promise((r) => setTimeout(r, 5));
    const b = createProject({
      name: "newer",
      entryPath: "App.jsx",
      entrySource: "",
      idOverride: "dropin:newer",
    });
    if (!b.ok) throw new Error("b failed");
    await saveProject(b.project);

    const list = await listProjects();
    expect(list.length).toBe(2);
    expect(list[0].name).toBe("newer");
    expect(list[1].name).toBe("older");
    expect(list[0].fileCount).toBe(1);
    expect(list[0].id).toBe("dropin:newer");
  });

  it("deleteProject removes the record from the store", async () => {
    const r = createProject({
      name: "test",
      entryPath: "App.jsx",
      entrySource: "",
      idOverride: "dropin:delete-test",
    });
    if (!r.ok) throw new Error("create failed");
    await saveProject(r.project);

    await deleteProject("dropin:delete-test");
    const loaded = await loadProject("dropin:delete-test");
    expect(loaded).toBeNull();
  });

  it("save writes schemaVersion: 1 to disk", async () => {
    // Phantom-typed schemaVersion exists so future v2 readers can discriminate.
    // Verify writes embed the literal so existing IDB records can be inspected
    // by Phase B+ code without a runtime bridge.
    const r = createProject({
      name: "v",
      entryPath: "App.jsx",
      entrySource: "",
      idOverride: "dropin:version-write",
    });
    if (!r.ok) throw new Error("create failed");
    await saveProject(r.project);

    // Read the raw record (bypassing loadProject's deserialize) to inspect
    // the on-disk shape.
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const raw = await new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction("projects", "readonly");
      const req = tx.objectStore("projects").get("dropin:version-write");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    expect(raw).toBeDefined();
    expect((raw as { schemaVersion: unknown }).schemaVersion).toBe(1);
  });

  it("load accepts a pre-versioned record (no schemaVersion field) as v1", async () => {
    // Backcompat: records written before the schemaVersion field landed must
    // still load. Plant a raw record without the field, then loadProject
    // should read it without complaint.
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore("projects");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("projects", "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore("projects").put(
        {
          // Note: NO schemaVersion field — this is the morning's pre-version shape.
          id: "legacy",
          name: "legacy",
          files: [
            { id: "f1", path: "App.jsx", kind: "jsx", source: "<div />" },
          ],
          entryFileId: "f1",
          createdAt: 0,
          updatedAt: 0,
        },
        "legacy",
      );
    });
    db.close();
    await __resetDbPromiseForTests();

    const loaded = await loadProject("legacy");
    expect(loaded).not.toBeNull();
    if (loaded) expect(getEntryFile(loaded).source).toBe("<div />");
  });

  it("multi-file project round-trips with all FileRecords intact", async () => {
    // v1 ships single-file, but storage MUST already round-trip multi-file
    // since Phase B will exercise that path. Asserting it here surfaces any
    // future serialization regression before the UI catches it.
    const r = createProject({
      name: "multi",
      entryPath: "App.jsx",
      entrySource: "import Card from './Card'; export default () => <Card />",
      idOverride: "dropin:multi",
    });
    if (!r.ok) throw new Error("create failed");
    // Add two more files via addFile composed in.
    const { addFile } = await import("../../lib/files/operations");
    const r1 = addFile(r.project, {
      path: "Card.tsx",
      source: "export default () => <div />",
    });
    if (!r1.ok) throw new Error("addFile Card failed");
    const r2 = addFile(r1.project, {
      path: "lib/utils.ts",
      source: "export const noop = () => {};",
    });
    if (!r2.ok) throw new Error("addFile utils failed");

    await saveProject(r2.project);
    const loaded = await loadProject("dropin:multi");
    expect(loaded).not.toBeNull();
    if (!loaded) return;

    expect(loaded.files.size).toBe(3);
    const paths = Array.from(loaded.files.values())
      .map((f) => f.path)
      .sort();
    expect(paths).toEqual(["App.jsx", "Card.tsx", "lib/utils.ts"]);

    const entry = getEntryFile(loaded);
    expect(entry.path).toBe("App.jsx");
    expect(entry.source).toContain("import Card");
  });
});
