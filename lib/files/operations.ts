// Phase C / A.1 — Pure operations on Project / FileRecord.
//
// Every operation is immutable: returns a new Project (never mutates input).
// Failure modes return `{ ok: false; error }` instead of throwing, so callers
// compose operations without try/catch. Same shape as `applyResize` / etc.
//
// Pure: no React, no DOM, no IndexedDB. The IDB persistence layer wraps these
// in `lib/files/storage.ts`. The Workspace state owner (Phase A.2) calls these
// to mutate its in-memory `Project` and then persists via the storage layer.

import { FILE_KINDS } from "./types";
import type { FileId, FileKind, FileRecord, Project, FileOpResult } from "./types";

// ────────────────────────────────────────────────────────────────────────────
// ID generation
// ────────────────────────────────────────────────────────────────────────────

// 12-char base-36 id: first 9 chars are millisecond timestamp (sortable, ~70+
// year range), last 3 chars are random for sub-millisecond collision safety
// (~46k possible suffixes — enough to avoid collisions for a single-user
// session, the only consumer). Not cryptographic; not security-sensitive.
function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 5).padEnd(3, "0");
}

export function createFileId(): FileId {
  return (Date.now().toString(36) + randomSuffix() + randomSuffix()) as FileId;
}

export function createProjectId(): string {
  return Date.now().toString(36) + randomSuffix() + randomSuffix();
}

// ────────────────────────────────────────────────────────────────────────────
// Path normalization
// ────────────────────────────────────────────────────────────────────────────

const KIND_BY_EXT: Readonly<Record<string, FileKind>> = {
  jsx: "jsx",
  tsx: "tsx",
  js: "js",
  ts: "ts",
  html: "html",
};

export function kindFromPath(path: string): FileKind | null {
  const dot = path.lastIndexOf(".");
  if (dot < 0) return null;
  const ext = path.slice(dot + 1).toLowerCase();
  return KIND_BY_EXT[ext] ?? null;
}

// Result shape so callers see WHY a path was rejected — used by the
// future "create file" UX to render an inline error chip.
export type NormalizePathResult =
  | { ok: true; path: string; kind: FileKind }
  | { ok: false; error: string };

export function normalizePath(input: string): NormalizePathResult {
  if (typeof input !== "string") return { ok: false, error: "path must be a string" };
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "path is empty" };

  // Split on any forward / backslash mix so `components\Card.tsx` (Windows
  // paste) lifts to `components/Card.tsx`. Filter empties to collapse `//` and
  // strip leading `/`.
  const rawSegments = trimmed.split(/[\\/]+/).filter((s) => s.length > 0);

  // Resolve `.` (drop) and `..` (pop). Going above root is rejected — file
  // pools have no "above root" concept, and import resolution would be
  // ambiguous.
  const segments: string[] = [];
  for (const seg of rawSegments) {
    if (seg === ".") continue;
    if (seg === "..") {
      if (segments.length === 0) {
        return { ok: false, error: "path escapes project root" };
      }
      segments.pop();
      continue;
    }
    // No bare reserved names. Tests for invalid identifier chars happen at
    // the file-tree UX level; the storage layer is permissive about names.
    if (seg.includes("\0")) {
      return { ok: false, error: "path contains null character" };
    }
    segments.push(seg);
  }

  if (segments.length === 0) {
    return { ok: false, error: "path is empty after normalization" };
  }

  const normalized = segments.join("/");
  const kind = kindFromPath(normalized);
  if (kind === null) {
    return {
      ok: false,
      error: `unsupported extension (allowed: ${FILE_KINDS.join(", ")})`,
    };
  }
  return { ok: true, path: normalized, kind };
}

// ────────────────────────────────────────────────────────────────────────────
// Project / file operations
// ────────────────────────────────────────────────────────────────────────────

export interface CreateProjectOpts {
  name: string;
  entryPath: string;     // raw, will be normalized
  entrySource: string;
  // When provided, the new project's id is exactly this string instead of a
  // freshly generated one. Used by Phase A.2's IDB hydration path so a given
  // template/playground always lands at the same IDB key, and reloading the
  // page picks up the user's last save. Callers are responsible for namespacing
  // (`dropin:project:<filename>:<kind>`); the file pool itself doesn't enforce
  // a format.
  idOverride?: string;
}

export type CreateProjectResult =
  | { ok: true; project: Project; entryFileId: FileId }
  | { ok: false; error: string };

export function createProject(opts: CreateProjectOpts): CreateProjectResult {
  const norm = normalizePath(opts.entryPath);
  if (!norm.ok) return { ok: false, error: norm.error };

  const id = opts.idOverride ?? createProjectId();
  const entryFileId = createFileId();
  const now = Date.now();
  const entry: FileRecord = {
    id: entryFileId,
    path: norm.path,
    kind: norm.kind,
    source: opts.entrySource,
  };
  const files = new Map<FileId, FileRecord>([[entryFileId, entry]]);
  const project: Project = {
    id,
    name: opts.name,
    files,
    entryFileId,
    createdAt: now,
    updatedAt: now,
  };
  return { ok: true, project, entryFileId };
}

export interface AddFileOpts {
  path: string;     // raw, will be normalized
  source: string;
}

export function addFile(project: Project, opts: AddFileOpts): FileOpResult {
  const norm = normalizePath(opts.path);
  if (!norm.ok) return { ok: false, error: norm.error };

  // Duplicate-path guard. Paths are the user-facing identity AND the import-
  // resolution target — a duplicate would make `./components/Card` ambiguous.
  for (const f of project.files.values()) {
    if (f.path === norm.path) {
      return { ok: false, error: `path already exists: ${norm.path}` };
    }
  }

  const id = createFileId();
  const record: FileRecord = {
    id,
    path: norm.path,
    kind: norm.kind,
    source: opts.source,
  };
  const next = new Map(project.files);
  next.set(id, record);
  return {
    ok: true,
    project: {
      ...project,
      files: next,
      updatedAt: Date.now(),
    },
  };
}

export function removeFile(project: Project, fileId: FileId): FileOpResult {
  if (fileId === project.entryFileId) {
    return { ok: false, error: "cannot remove the entry file" };
  }
  if (!project.files.has(fileId)) {
    return { ok: false, error: `file not found: ${fileId}` };
  }
  const next = new Map(project.files);
  next.delete(fileId);
  return {
    ok: true,
    project: {
      ...project,
      files: next,
      updatedAt: Date.now(),
    },
  };
}

// updateFileSource is the hot path — it fires on every keystroke (debounced
// at the Workspace layer). Two early-return optimizations:
//   1. Same source string → identity-equal project returned, no Date.now() call.
//   2. Missing fileId → error shape (defensive against stale Workspace state).
export function updateFileSource(
  project: Project,
  fileId: FileId,
  source: string,
): FileOpResult {
  const existing = project.files.get(fileId);
  if (!existing) return { ok: false, error: `file not found: ${fileId}` };
  if (existing.source === source) return { ok: true, project };

  const next = new Map(project.files);
  next.set(fileId, { ...existing, source });
  return {
    ok: true,
    project: {
      ...project,
      files: next,
      updatedAt: Date.now(),
    },
  };
}

export function renameFile(
  project: Project,
  fileId: FileId,
  newPath: string,
): FileOpResult {
  const existing = project.files.get(fileId);
  if (!existing) return { ok: false, error: `file not found: ${fileId}` };

  const norm = normalizePath(newPath);
  if (!norm.ok) return { ok: false, error: norm.error };
  if (norm.path === existing.path) return { ok: true, project };

  // Duplicate-path guard. Excludes the file being renamed (otherwise it would
  // collide with itself when the rename is a no-op).
  for (const f of project.files.values()) {
    if (f.id !== fileId && f.path === norm.path) {
      return { ok: false, error: `path already exists: ${norm.path}` };
    }
  }

  const next = new Map(project.files);
  next.set(fileId, { ...existing, path: norm.path, kind: norm.kind });
  return {
    ok: true,
    project: {
      ...project,
      files: next,
      updatedAt: Date.now(),
    },
  };
}

export function setEntryFile(project: Project, fileId: FileId): FileOpResult {
  if (!project.files.has(fileId)) {
    return { ok: false, error: `file not found: ${fileId}` };
  }
  if (fileId === project.entryFileId) return { ok: true, project };
  return {
    ok: true,
    project: {
      ...project,
      entryFileId: fileId,
      updatedAt: Date.now(),
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Read-only queries
// ────────────────────────────────────────────────────────────────────────────

export function getEntryFile(project: Project): FileRecord {
  const entry = project.files.get(project.entryFileId);
  if (!entry) {
    // Invariant violation. createProject + setEntryFile + removeFile all
    // maintain the invariant — the only way to land here is hand-constructed
    // bad input. Surface immediately rather than silently corrupting.
    throw new Error(
      `Project invariant violation: entryFileId ${project.entryFileId} not in files`,
    );
  }
  return entry;
}

export function getFile(project: Project, fileId: FileId): FileRecord | null {
  return project.files.get(fileId) ?? null;
}

export function findFileByPath(project: Project, path: string): FileRecord | null {
  const norm = normalizePath(path);
  if (!norm.ok) return null;
  for (const f of project.files.values()) {
    if (f.path === norm.path) return f;
  }
  return null;
}

// Returns files sorted by path so the file-tree UX renders deterministically.
// Bytewise (`<` / `>`) sort, NOT `localeCompare` — `localeCompare` collates
// case-insensitively in some runtimes ('a' before 'A' on V8/macOS, opposite
// on others). Bytewise gives the same order on every machine: ASCII uppercase
// before lowercase; identical projects always render the same tree.
// Future Phase B: groupings (folders) computed from path segments at the UI
// layer; the storage layer stays flat.
export function listFiles(project: Project): readonly FileRecord[] {
  return Array.from(project.files.values()).sort((a, b) =>
    a.path < b.path ? -1 : a.path > b.path ? 1 : 0,
  );
}

// Used by the future Phase C bundler. Walks `import "./foo"` strings and
// resolves relative-to-this-file. Returns null for non-relative imports
// (the bundler then routes through `SUPPORTED_PKGS` curated-npm path).
export function resolveRelativeImport(
  project: Project,
  fromPath: string,
  importSpec: string,
): FileRecord | null {
  if (!importSpec.startsWith(".")) return null;

  // Combine the importing file's directory with the import specifier, then
  // normalize. The file's own path is `components/Card.tsx`, so its
  // "directory" is `components/`.
  const fromDir = fromPath.includes("/")
    ? fromPath.slice(0, fromPath.lastIndexOf("/"))
    : "";
  const combined = fromDir ? `${fromDir}/${importSpec}` : importSpec;

  // Try a direct match first, then with each supported extension. Mirrors
  // Node / esbuild "extensionless import" resolution.
  const direct = findFileByPath(project, combined);
  if (direct) return direct;

  for (const ext of FILE_KINDS) {
    const withExt = findFileByPath(project, `${combined}.${ext}`);
    if (withExt) return withExt;
  }
  return null;
}
