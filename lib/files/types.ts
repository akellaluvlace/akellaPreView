// Phase C / A.1 — File pool types.
//
// Replaces the single `code: string` source-state model with a `Project` of
// many `FileRecord`s, addressed by a branded `FileId`. v1 single-file projects
// keep working unchanged: a 1-file project has one file and `entryFileId`
// points at it. Phase B adds the file-tree UI; Phase C adds the iframe-side
// import resolution that follows relative imports across the file pool.
//
// Locked decisions (see `phase-c-research.md` §4):
//   - D1 storage: IndexedDB via the existing `idb` dep. Single store
//     `projects` keyed by project id.
//   - D2 granularity: per-page projects. Each existing template lifts to
//     a 1-file project on first run.
//   - D3 imports: relative + curated npm only in v1; CSS / asset / arbitrary
//     npm imports deferred. (Enforced inside `lib/preview-bundler.ts` in
//     Phase C, not here.)
//
// Why branded `FileId` and not just `string`: cross-file operations
// (`patchClassByOidInFile(project, fileId, oid, ...)`) accept a path-shaped
// argument and an id-shaped argument; making `FileId` distinct from `string`
// stops a future caller from accidentally swapping them. Same pattern as
// React's branded `OpaqueRoot`. Compile-time only — at runtime they're plain
// strings.

// 'unique symbol' is namespace-local — every importer sees the same brand.
// Without 'unique', `string & { __fileId: symbol }` would erase to `string`
// because TS can't tell two same-named branded shapes apart.
declare const FILE_ID_BRAND: unique symbol;
export type FileId = string & { readonly [FILE_ID_BRAND]: true };

export const FILE_KINDS = ["jsx", "tsx", "js", "ts", "html"] as const;
export type FileKind = (typeof FILE_KINDS)[number];

export interface FileRecord {
  readonly id: FileId;
  // Normalized — no leading slash, no `./`, no `../`. See
  // `operations.ts#normalizePath`. The path is the user-facing label and the
  // import-resolution target ("./components/Card" → match by path).
  readonly path: string;
  readonly kind: FileKind;
  readonly source: string;
}

export interface Project {
  // Project ids are NOT branded — they're a level above files and don't have
  // a cross-API confusion risk. Created via `createProjectId()`.
  readonly id: string;
  readonly name: string;
  readonly files: ReadonlyMap<FileId, FileRecord>;
  // Invariant: `entryFileId` is always present in `files`. Operations that
  // could break this invariant (`removeFile` on the entry) return an error
  // shape rather than mutating to a broken state.
  readonly entryFileId: FileId;
  readonly createdAt: number;
  readonly updatedAt: number;
}

// Operation result shape. Operations that can fail return one of these so
// callers can pattern-match on `.ok`. Avoids both throwing (which makes
// composition awkward) and returning bare `null` (which throws away the
// failure reason). Same shape used by `applyResize`, `applyStyleProps`, etc.
// in `lib/ast/operations/*` — keeping it consistent across the codebase.
export type FileOpResult =
  | { ok: true; project: Project }
  | { ok: false; error: string };
