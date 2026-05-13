// Phase C / A.1 — IndexedDB persistence for the file pool.
//
// Locked decision (D1 in `phase-c-research.md`): IndexedDB via the existing
// `idb` dep, single object store `projects` keyed by project id. Mirrors the
// pattern in `lib/asset-library/recent.ts` so we don't introduce a third
// async-storage style.
//
// Why IDB and not localStorage:
//   - localStorage is 5MB total budget shared across the whole app. The
//     storage panel + tree-state already strain it.
//   - localStorage values are strings, so we'd JSON-stringify on every
//     write. IDB stores structured values natively.
//   - For a multi-file project with N files of source code each, IDB scales
//     to project sizes localStorage would brick.
//
// SSR/server-side: every export rejects with a clear error. File-pool state
// is client-only — the host page renders Workspace as `"use client"` so the
// SSR pass never reaches these.

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { FileId, FileRecord, Project } from "./types";

const DB_NAME = "dropin-files";
const DB_VERSION = 1;
const STORE = "projects";

// IDB structured-clone DOES support `Map`, but we serialize to an array of
// FileRecords because:
//   1. Easier to inspect in the browser DevTools IDB viewer (sees an array,
//      not opaque Map internals).
//   2. Forward-compatible with a future "export project to JSON" feature
//      (the wire format already matches).
//   3. Easier migration when v2 of the schema lands (transformation runs on
//      a plain object, not a Map<branded-id, …>).
//
// Schema versioning (audit F4 lesson — see CLAUDE.md backlog):
// `schemaVersion` is a literal `1` type, NOT `number`. A future v2 must add
// a new discriminated arm (`SerializedProjectV1 | SerializedProjectV2`) so
// every reader is forced to switch on the version. A `number` field would
// silently accept future versions, leading to "TypeScript said this was a
// v1 but it was actually v3" runtime corruption. Records written before this
// field landed (the morning's IDB writes during initial A.2 testing) survive:
// the deserialize path treats `undefined` as v1.
interface SerializedProjectV1 {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly name: string;
  readonly files: readonly FileRecord[];
  readonly entryFileId: FileId;
  readonly createdAt: number;
  readonly updatedAt: number;
}

// Discriminated union over the version literal. v2 will add a SerializedProjectV2
// arm + a deserialize branch keyed on schemaVersion. Add the new type to
// `StoredProject` so existing reader code fails to compile until updated.
type StoredProject = SerializedProjectV1;

// Pre-versioning shape — what the morning's first IDB writes used. Reading
// such a record fills in `schemaVersion: 1` so the rest of the load path
// uses the same code path for both. NOT exported; not allowed in writes.
type LegacyUnversionedProject = Omit<SerializedProjectV1, "schemaVersion">;

interface Schema extends DBSchema {
  projects: {
    key: string; // project id
    value: StoredProject | LegacyUnversionedProject;
  };
}

let dbPromise: Promise<IDBPDatabase<Schema>> | null = null;

function getDb(): Promise<IDBPDatabase<Schema>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("lib/files/storage.ts only runs in the browser"));
  }
  if (!dbPromise) {
    dbPromise = openDB<Schema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      },
    });
  }
  return dbPromise;
}

function serialize(project: Project): SerializedProjectV1 {
  return {
    schemaVersion: 1,
    id: project.id,
    name: project.name,
    files: Array.from(project.files.values()),
    entryFileId: project.entryFileId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

// Brand-narrowing: a record without `schemaVersion` came from a pre-version
// write and is safe to treat as v1. A record with `schemaVersion: 1` is v1
// directly. Anything else is unknown — the future-version arm gets added here
// when v2 lands. Keeping the assertion explicit (rather than just casting in
// loadProject) means a future PR adding v2 must update this function and gets
// a tsc error if the discriminated union grows without a matching arm.
function asV1(
  raw: StoredProject | LegacyUnversionedProject,
): SerializedProjectV1 {
  if ("schemaVersion" in raw) {
    // schemaVersion is the literal 1 today; tsc enforces the narrowing.
    return raw;
  }
  return { schemaVersion: 1, ...raw };
}

function deserialize(s: SerializedProjectV1): Project {
  const map = new Map<FileId, FileRecord>();
  for (const f of s.files) map.set(f.id, f);
  return {
    id: s.id,
    name: s.name,
    files: map,
    entryFileId: s.entryFileId,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

export async function loadProject(projectId: string): Promise<Project | null> {
  const db = await getDb();
  const raw = await db.get(STORE, projectId);
  if (!raw) return null;
  // Defensive: a corrupted project (entry file missing from `files`) would
  // throw downstream. Detect here so the UX can recover (offer to delete +
  // fall back to a fresh project) rather than crash on first selection.
  if (!raw.files.some((f) => f.id === raw.entryFileId)) {
    throw new Error(
      `corrupted project ${projectId}: entryFileId ${raw.entryFileId} not in files`,
    );
  }
  // Schema-version normalization (see asV1 docblock). Pre-versioned records
  // and v1 records both flow through the same deserialize.
  return deserialize(asV1(raw));
}

export async function saveProject(project: Project): Promise<void> {
  const db = await getDb();
  await db.put(STORE, serialize(project), project.id);
}

export async function deleteProject(projectId: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, projectId);
}

// Lightweight metadata for project list UIs (Phase B switcher / picker).
// Avoids loading every file's source — listings can be 50+ projects.
export interface ProjectSummary {
  readonly id: string;
  readonly name: string;
  readonly fileCount: number;
  readonly updatedAt: number;
  readonly createdAt: number;
}

export async function listProjects(): Promise<readonly ProjectSummary[]> {
  const db = await getDb();
  const all = await db.getAll(STORE);
  return all
    .map((s) => ({
      id: s.id,
      name: s.name,
      fileCount: s.files.length,
      updatedAt: s.updatedAt,
      createdAt: s.createdAt,
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

// Test-only escape hatch. Resets the cached db promise AND closes the
// underlying connection so a subsequent `indexedDB.deleteDatabase` call (used
// by tests to wipe state between cases) doesn't block waiting for an open
// handle. NOT used by any production path.
export async function __resetDbPromiseForTests(): Promise<void> {
  const cur = dbPromise;
  dbPromise = null;
  if (!cur) return;
  try {
    const db = await cur;
    db.close();
  } catch {
    // Open failed; nothing to close.
  }
}
