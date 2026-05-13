// Storage health panel persistence + pure helpers. Owns every
// localStorage key and pure helper that exists exclusively to power
// the StorageHealthPanel UI (panel scope/sort/filter knobs, category
// collapse, export/import JSON, recent-imports / filter-history rings,
// pinned snapshot + diff, shareable preset URL encoding, regex / substring
// filter helpers, value-truncation override, single-key edit/delete).
//
// Companion to `lib/tree-persistence.ts`, which owns the tree state
// itself (depth/query/expanded/subtree-depths) plus the cross-cutting
// telemetry primitives (predictStoredTreeStateBytes,
// classifyStorageBytes, formatStoredBytes,
// listStoredTreeStateEntries, listAllStoredEntries, categorizeStoredKey,
// subscribeStoredTreeStateChanges, schema migration, drag-ghost format,
// subtree-depth cap + storage byte-threshold overrides). Both modules
// share `KEY_NAMESPACE` / `STORAGE_SCHEMA_VERSION` / `versionedKey`
// imported from `lib/tree-persistence.ts` so the entire dropin:tree:*
// namespace stays consistent under a single schema version.
//
// Boundary rationale: tree state is consumed by ElementTree's footer
// telemetry pill + DnD ghost; the storage panel is a power-user debug
// surface. They evolve at different cadences, have very different data
// shapes (tree state is small + structured; panel state is many small
// preference flags + a few JSON ring buffers), and the panel module is
// the larger of the two — splitting keeps each file focused.
//
// SSR safety: every reader / writer guards `typeof window === "undefined"`
// to short-circuit Next.js App Router SSR. Pure helpers (parsers,
// builders, filters, diff) have no window access at all and are
// bench-tested via `scripts/bench-tree-persistence.mjs`. The bench is
// hermetic — it inlines its own copies of the helpers, so this module
// can move freely without touching the bench.

import {
  KEY_NAMESPACE,
  versionedKey,
  type StoredTreeStateEntry,
  type StoredEntryCategorized,
  type StoredEntryCategory,
} from "./tree-persistence";

// ----- Per-category summary -----------------------------------------------

// Per-category storage summary for the broadened "all keys" panel
// footer. Always returns all three categories (count: 0, bytes: 0 for
// empty ones) so the UI can render a stable layout without conditional
// presence checks. Bytes use the same key.length + value.length formula
// as the entries themselves so the per-category total always sums to
// the panel's overall total.
interface StoredEntryCategorySummary {
  count: number;
  bytes: number;
}

interface StoredEntriesCategorizedSummary {
  tree: StoredEntryCategorySummary;
  dropin: StoredEntryCategorySummary;
  other: StoredEntryCategorySummary;
}

export function summarizeStoredEntriesByCategory(
  entries: ReadonlyArray<StoredEntryCategorized>,
): StoredEntriesCategorizedSummary {
  const out: StoredEntriesCategorizedSummary = {
    tree: { count: 0, bytes: 0 },
    dropin: { count: 0, bytes: 0 },
    other: { count: 0, bytes: 0 },
  };
  for (const e of entries) {
    const bucket = out[e.category];
    bucket.count++;
    bucket.bytes += e.bytes;
  }
  return out;
}

// ----- Substring filter ---------------------------------------------------

// Substring filter for the entries lists. Case-insensitive match
// against EITHER the key OR the value. Empty / whitespace-only query
// returns a copy of the input unchanged (no filter applied). The
// generic preserves the exact element type so both StoredTreeStateEntry[]
// and StoredEntryCategorized[] flow through with their narrowing intact.
//
// Why match value too: heavy entries (e.g. expanded:v1 with hundreds
// of OIDs) are common; finding a specific OID or fragment of the JSON
// payload is a frequent debug action. Substring (not regex) keeps the
// UX simple and predictable; users typing literal characters don't
// need to escape them.
//
// Pure: returns a fresh array; does NOT mutate the input.
export function filterStoredEntries<T extends StoredTreeStateEntry>(
  entries: ReadonlyArray<T>,
  query: string,
): T[] {
  const trimmed = query.trim();
  if (trimmed === "") return entries.slice() as T[];
  const needle = trimmed.toLowerCase();
  const out: T[] = [];
  for (const e of entries) {
    if (e.key.toLowerCase().includes(needle)) {
      out.push(e);
      continue;
    }
    if (e.value.toLowerCase().includes(needle)) {
      out.push(e);
    }
  }
  return out;
}

// ----- Sort ---------------------------------------------------------------

// Sort order toggle for the entries lists. "bytes-desc" matches the
// chunk-nn / chunk-qq default (descending byte cost, alphabetic
// tie-break); "name-asc" sorts by key ascending (case-insensitive, with
// a stable case-sensitive tie-break on collision) for users
// investigating a specific key family. Sort is applied AFTER the
// filter so users see the sorted view of their search.
//
// Pure: returns a fresh array; does NOT mutate the input. Generic so
// both StoredTreeStateEntry[] and StoredEntryCategorized[] preserve
// their element types.
export type StoragePanelSort = "bytes-desc" | "name-asc";

export function sortStoredEntries<T extends StoredTreeStateEntry>(
  entries: ReadonlyArray<T>,
  sort: StoragePanelSort,
): T[] {
  const out = entries.slice() as T[];
  if (sort === "name-asc") {
    out.sort((a, b) => {
      const ka = a.key.toLowerCase();
      const kb = b.key.toLowerCase();
      if (ka < kb) return -1;
      if (ka > kb) return 1;
      // Two keys differing only in case (e.g. "Foo" vs "foo") tie on
      // the case-folded compare; fall through to a deterministic
      // case-sensitive compare so the sort is stable across runs.
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });
  } else {
    // "bytes-desc" — matches describeStoredTreeStateEntries /
    // describeAllStoredEntries default ordering exactly.
    out.sort((a, b) => {
      if (a.bytes !== b.bytes) return b.bytes - a.bytes;
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });
  }
  return out;
}

// ----- Persisted scope preference ----------------------------------------

// Persisted storage panel scope preference. The chunk-qq broadened
// scope toggle was originally ephemeral (every reload flipped back to
// "tree"); persisting it removes that friction for power users
// investigating quota issues across the whole app.
//
// Mirrors the drag-ghost-format pattern: 2-element string union,
// strict literal parser, default "tree" preserves chunk-qq behavior.
const STORAGE_PANEL_SCOPE_KEY = versionedKey("storage-panel-scope");

export type StoragePanelScope = "tree" | "all";
const STORAGE_PANEL_SCOPE_DEFAULT: StoragePanelScope = "tree";

// Audit F6 — the live panel-state knobs (scope, filter, sort,
// collapsedOther) appeared as duplicated inline type literals on
// `StoragePanelExport.panelState` and `StoragePanelRecentImport.panelState`.
// Future fields (e.g. `prettyPrint`, `valueTruncation`) wouldn't propagate
// to both call sites without manual sync. Single shared type now —
// every persisted shape that mirrors the live panel state references this.
export interface StoragePanelStateKnobs {
  scope: StoragePanelScope;
  filter: string;
  sort: StoragePanelSort;
  collapsedOther: boolean;
}

export function parseStoragePanelScope(raw: string | null): StoragePanelScope {
  if (raw === "tree") return "tree";
  if (raw === "all") return "all";
  return STORAGE_PANEL_SCOPE_DEFAULT;
}

export function readStoredStoragePanelScope(): StoragePanelScope {
  if (typeof window === "undefined") return STORAGE_PANEL_SCOPE_DEFAULT;
  try {
    return parseStoragePanelScope(
      window.localStorage.getItem(STORAGE_PANEL_SCOPE_KEY),
    );
  } catch {
    return STORAGE_PANEL_SCOPE_DEFAULT;
  }
}

export function writeStoredStoragePanelScope(scope: StoragePanelScope): void {
  if (typeof window === "undefined") return;
  try {
    if (scope === STORAGE_PANEL_SCOPE_DEFAULT) {
      // Default → remove the key; fresh tab reads canonical default
      // rather than a redundant explicit "tree" entry. Matches the
      // drag-ghost-format convention.
      window.localStorage.removeItem(STORAGE_PANEL_SCOPE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_PANEL_SCOPE_KEY, scope);
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Persisted sort preference -----------------------------------------

const STORAGE_PANEL_SORT_KEY = versionedKey("storage-panel-sort");
const STORAGE_PANEL_SORT_DEFAULT: StoragePanelSort = "bytes-desc";

export function parseStoragePanelSort(raw: string | null): StoragePanelSort {
  if (raw === "bytes-desc") return "bytes-desc";
  if (raw === "name-asc") return "name-asc";
  return STORAGE_PANEL_SORT_DEFAULT;
}

export function readStoredStoragePanelSort(): StoragePanelSort {
  if (typeof window === "undefined") return STORAGE_PANEL_SORT_DEFAULT;
  try {
    return parseStoragePanelSort(
      window.localStorage.getItem(STORAGE_PANEL_SORT_KEY),
    );
  } catch {
    return STORAGE_PANEL_SORT_DEFAULT;
  }
}

export function writeStoredStoragePanelSort(sort: StoragePanelSort): void {
  if (typeof window === "undefined") return;
  try {
    if (sort === STORAGE_PANEL_SORT_DEFAULT) {
      // Default → remove the key; fresh tab reads canonical default
      // rather than a redundant explicit "bytes-desc" entry.
      window.localStorage.removeItem(STORAGE_PANEL_SORT_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_PANEL_SORT_KEY, sort);
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Persisted filter input --------------------------------------------

// The filter input was originally ephemeral ("clear on reload");
// persistence removes the friction for users investigating a specific
// OID across reloads. Mirrors the sort / scope / drag-ghost-format
// pattern: writer removes the key on default-equivalence (empty string)
// so a fresh tab reads the canonical default. Length capped both on
// read and on write to defend against hand-edited mega-values blowing
// up the input box.
const STORAGE_PANEL_FILTER_KEY = versionedKey("storage-panel-filter");
const STORAGE_PANEL_FILTER_DEFAULT = "";
// Same cap as the tree filter input. Storage-panel filter targets keys +
// values which are shorter than component-name filters; 256 chars is
// generous either way.
const STORAGE_PANEL_FILTER_MAX_LEN = 256;

export function parseStoragePanelFilter(raw: string | null): string {
  if (raw === null) return STORAGE_PANEL_FILTER_DEFAULT;
  if (raw.length > STORAGE_PANEL_FILTER_MAX_LEN) {
    return raw.slice(0, STORAGE_PANEL_FILTER_MAX_LEN);
  }
  return raw;
}

export function readStoredStoragePanelFilter(): string {
  if (typeof window === "undefined") return STORAGE_PANEL_FILTER_DEFAULT;
  try {
    return parseStoragePanelFilter(
      window.localStorage.getItem(STORAGE_PANEL_FILTER_KEY),
    );
  } catch {
    return STORAGE_PANEL_FILTER_DEFAULT;
  }
}

export function writeStoredStoragePanelFilter(filter: string): void {
  if (typeof window === "undefined") return;
  try {
    if (filter === STORAGE_PANEL_FILTER_DEFAULT) {
      // Empty filter → remove the key. A fresh tab reads canonical
      // empty default rather than an explicit empty-string entry.
      window.localStorage.removeItem(STORAGE_PANEL_FILTER_KEY);
      return;
    }
    const clamped =
      filter.length > STORAGE_PANEL_FILTER_MAX_LEN
        ? filter.slice(0, STORAGE_PANEL_FILTER_MAX_LEN)
        : filter;
    window.localStorage.setItem(STORAGE_PANEL_FILTER_KEY, clamped);
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Substring + regex match-highlight helpers --------------------------

// Splits a piece of text into alternating match / non-match segments
// against a substring filter query. Pure: returns a fresh array; does
// NOT mutate inputs. Case-insensitive match on the needle but the
// segments preserve the ORIGINAL case from `text` so the UI can render
// the matched substring with its real casing wrapped in a <mark> tag.
//
// Edge cases:
//   - Empty / whitespace-only query → single non-match segment with
//     the full text. Callers can render this as plain text and the
//     <mark> branch never fires.
//   - Empty text → single non-match segment with empty string. UI
//     renders nothing visible.
//   - Query found at offset 0 → first segment is a match.
//   - Multiple non-overlapping matches → alternating segments.
//   - Adjacent matches (rare; needle === substring of itself) → only
//     non-overlapping advances are emitted (cursor jumps by needle.length
//     after each match).
interface MatchedSubstringSegment {
  text: string;
  match: boolean;
}

export function splitOnMatchedSubstring(
  text: string,
  query: string,
): MatchedSubstringSegment[] {
  const trimmed = query.trim();
  if (trimmed === "" || text === "") {
    return [{ text, match: false }];
  }
  const haystack = text.toLowerCase();
  const needle = trimmed.toLowerCase();
  const out: MatchedSubstringSegment[] = [];
  let cursor = 0;
  while (cursor <= text.length) {
    const idx = haystack.indexOf(needle, cursor);
    if (idx === -1) {
      if (cursor < text.length) {
        out.push({ text: text.slice(cursor), match: false });
      }
      break;
    }
    if (idx > cursor) {
      out.push({ text: text.slice(cursor, idx), match: false });
    }
    out.push({ text: text.slice(idx, idx + needle.length), match: true });
    cursor = idx + needle.length;
  }
  if (out.length === 0) {
    // Defensive: the loop exits on `idx === -1` or by cursor advancing
    // past `text.length`; no path should empty the array, but guard
    // against future regressions so callers always get a renderable
    // shape.
    return [{ text, match: false }];
  }
  return out;
}

// ----- Collapse "other" category -----------------------------------------

// Persisted preference for the "other" collapse toggle. Default true:
// most users investigating dropin storage don't care about non-dropin
// keys; collapsing them by default keeps the panel focused without
// losing the "all" lens.
const STORAGE_PANEL_COLLAPSED_OTHER_KEY = versionedKey(
  "storage-panel-collapsed-other",
);
const STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT = true;

export function parseStoragePanelCollapsedOther(raw: string | null): boolean {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT;
}

export function readStoredStoragePanelCollapsedOther(): boolean {
  if (typeof window === "undefined")
    return STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT;
  try {
    return parseStoragePanelCollapsedOther(
      window.localStorage.getItem(STORAGE_PANEL_COLLAPSED_OTHER_KEY),
    );
  } catch {
    return STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT;
  }
}

export function writeStoredStoragePanelCollapsedOther(
  collapsed: boolean,
): void {
  if (typeof window === "undefined") return;
  try {
    if (collapsed === STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT) {
      // Default → remove the key; fresh tab reads canonical default.
      window.localStorage.removeItem(STORAGE_PANEL_COLLAPSED_OTHER_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_COLLAPSED_OTHER_KEY,
      collapsed ? "1" : "0",
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Export panel state as JSON ----------------------------------------

// Export the storage panel state as a JSON string for sharing repro
// states / archiving snapshots / pasting into bug reports. Two-step
// pipeline so the data shape is independently testable from the JSON
// formatting:
//
//   1. `buildStoragePanelExport(entries, panelState, exportedAt)` —
//      pure builder; takes a categorized entries list (the
//      already-filtered+sorted view the user is looking at) plus the
//      panel state knobs and an ISO timestamp; returns a typed
//      StoragePanelExport object. Computes per-category summary +
//      total via `summarizeStoredEntriesByCategory`.
//
//   2. `serializeStoragePanelExport(exp)` — pure stringify; runs
//      JSON.stringify with indent=2.
//
// The export uses the user's CURRENT filtered+sorted view (not the
// raw localStorage) so a user investigating a specific OID can
// share exactly what they see. The panelState record lets a reader
// understand the lens (scope=all + filter="oid:abc" + sort=name-asc
// → "this is what their panel was looking at").
//
// Environment metadata (Dropin schema version, browser UA, app version)
// is OPTIONAL on the type so existing callers and older imports still
// parse cleanly via the importer; new live exports always populate it.
export interface StoragePanelExportMetadata {
  dropinSchemaVersion: number;
  userAgent: string;
  appVersion: string | null;
}

// Audit F4 — `schemaVersion` is a literal `1` type, not `number`. Future
// v2 must add a `StoragePanelExportV2` arm + an explicit deserialize
// branch keyed on schemaVersion. Same pattern as `lib/files/storage.ts`.
//
// Live consumers of `StoragePanelExport` get a v1-only type today. When
// v2 ships, change `StoredStoragePanelExport` below to a union AND add
// a v2 arm to the type alias — every reader that destructures version-
// specific fields will fail tsc until they switch on schemaVersion.
export interface StoragePanelExport {
  readonly schemaVersion: 1;
  exportedAt: string;
  // Optional. When undefined, the export came from a pre-metadata
  // source or a caller that didn't provide environment info.
  // Importer tolerates missing or malformed metadata.
  metadata?: StoragePanelExportMetadata;
  panelState: StoragePanelStateKnobs;
  entries: ReadonlyArray<{
    key: string;
    value: string;
    bytes: number;
    category: StoredEntryCategory;
  }>;
  summary: {
    total: { count: number; bytes: number };
    byCategory: StoredEntriesCategorizedSummary;
  };
}

// Discriminated-union scaffold for the audit F4 lesson. Today this is
// just `StoragePanelExport`, but the alias creates a single edit-point
// for adding a v2 arm. NOT exported — readers should use the public
// `StoragePanelExport` until they need to handle multiple versions
// explicitly.
type StoredStoragePanelExport = StoragePanelExport;

export function buildStoragePanelExport(
  entries: ReadonlyArray<StoredEntryCategorized>,
  panelState: StoragePanelStateKnobs,
  exportedAt: string,
  metadata?: StoragePanelExportMetadata,
): StoragePanelExport {
  const total = entries.reduce(
    (acc, e) => {
      acc.count++;
      acc.bytes += e.bytes;
      return acc;
    },
    { count: 0, bytes: 0 },
  );
  const result: StoragePanelExport = {
    schemaVersion: 1,
    exportedAt,
    panelState: {
      scope: panelState.scope,
      filter: panelState.filter,
      sort: panelState.sort,
      collapsedOther: panelState.collapsedOther,
    },
    entries: entries.map((e) => ({
      key: e.key,
      value: e.value,
      bytes: e.bytes,
      category: e.category,
    })),
    summary: {
      total,
      byCategory: summarizeStoredEntriesByCategory(entries),
    },
  };
  if (metadata !== undefined) {
    // Shallow-copy so a caller mutating their metadata object
    // post-build doesn't propagate into the result.
    result.metadata = {
      dropinSchemaVersion: metadata.dropinSchemaVersion,
      userAgent: metadata.userAgent,
      appVersion: metadata.appVersion,
    };
  }
  return result;
}

export function serializeStoragePanelExport(exp: StoragePanelExport): string {
  return JSON.stringify(exp, null, 2);
}

// ----- Import panel state from JSON --------------------------------------

// Pure parser for storage-panel exports. Returns a discriminated union
// (`kind: "ok" | "error"`) rather than a `T | null` shape so the caller
// can render the failure reason in the import textarea's tooltip / chip
// without re-walking the JSON.
//
// Audit 2026-05-06 F5 — the previous design had this AND a sibling
// `parseStoragePanelExportJson` returning `T | null`; the two carried
// non-overlapping validation logic and `Detail` delegated entry-shape
// validation back to the legacy null-returning shape. Drift waiting to
// happen. Single-source-of-truth now.
//
// Lenient on optional / forward-compatible fields (metadata may be
// absent or malformed; summary is re-derived rather than asserted — the
// export's summary is just a convenience for human-readable inspection,
// not load-bearing on import). Strict on the panelState knobs since
// they're applied directly to live state by the caller.
//
// Why "summary re-derived": the imported summary may be stale (a
// hand-edited export, a cross-version mismatch). Re-deriving from the
// entries guarantees the imported result is internally consistent.
//
// Why "metadata optional": pre-metadata exports lack metadata entirely;
// rejecting them on missing metadata would break backwards compatibility.
// Malformed metadata (wrong type, missing fields) is also forgiven —
// drop it and continue with the rest of the import.
export type StoragePanelExportParseResult =
  | { kind: "ok"; value: StoragePanelExport }
  | { kind: "error"; reason: string };

export function parseStoragePanelExportJsonDetail(
  raw: string,
): StoragePanelExportParseResult {
  if (typeof raw !== "string") {
    return { kind: "error", reason: "raw input is not a string" };
  }
  if (raw.trim() === "") {
    return { kind: "error", reason: "input is empty" };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const msg =
      err instanceof Error && typeof err.message === "string"
        ? err.message
        : "JSON.parse failed";
    return { kind: "error", reason: `malformed JSON: ${msg}` };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      kind: "error",
      reason: "root must be a JSON object (got null / array / primitive)",
    };
  }
  const obj = parsed as Record<string, unknown>;
  if (obj.schemaVersion !== 1) {
    return {
      kind: "error",
      reason: `schemaVersion: expected 1, got ${JSON.stringify(obj.schemaVersion)}`,
    };
  }
  if (typeof obj.exportedAt !== "string") {
    return { kind: "error", reason: "exportedAt: expected string" };
  }
  if (
    obj.panelState === null ||
    typeof obj.panelState !== "object" ||
    Array.isArray(obj.panelState)
  ) {
    return { kind: "error", reason: "panelState: expected object" };
  }
  const ps = obj.panelState as Record<string, unknown>;
  if (ps.scope !== "tree" && ps.scope !== "all") {
    return {
      kind: "error",
      reason: `panelState.scope: expected "tree" or "all", got ${JSON.stringify(ps.scope)}`,
    };
  }
  if (ps.sort !== "bytes-desc" && ps.sort !== "name-asc") {
    return {
      kind: "error",
      reason: `panelState.sort: expected "bytes-desc" or "name-asc", got ${JSON.stringify(ps.sort)}`,
    };
  }
  if (typeof ps.filter !== "string") {
    return { kind: "error", reason: "panelState.filter: expected string" };
  }
  if (typeof ps.collapsedOther !== "boolean") {
    return {
      kind: "error",
      reason: "panelState.collapsedOther: expected boolean",
    };
  }
  // Cap the imported filter at the same length the live writer caps to,
  // so a hand-edited export with a 1MB filter doesn't lock the input.
  const importedFilter =
    ps.filter.length > STORAGE_PANEL_FILTER_MAX_LEN
      ? ps.filter.slice(0, STORAGE_PANEL_FILTER_MAX_LEN)
      : ps.filter;
  if (!Array.isArray(obj.entries)) {
    return { kind: "error", reason: "entries: expected array" };
  }
  // entries — strict since they're surfaced to the user as the imported
  // view. Drop the entire import on malformed entries rather than
  // silently filtering them out (would mask real corruption). Track the
  // failing index in the reason so a user can locate the bad entry.
  const entries: Array<{
    key: string;
    value: string;
    bytes: number;
    category: StoredEntryCategory;
  }> = [];
  for (let i = 0; i < obj.entries.length; i++) {
    const e = obj.entries[i];
    if (e === null || typeof e !== "object" || Array.isArray(e)) {
      return { kind: "error", reason: `entries[${i}]: expected object` };
    }
    const er = e as Record<string, unknown>;
    if (typeof er.key !== "string") {
      return { kind: "error", reason: `entries[${i}].key: expected string` };
    }
    if (typeof er.value !== "string") {
      return { kind: "error", reason: `entries[${i}].value: expected string` };
    }
    if (typeof er.bytes !== "number" || !Number.isFinite(er.bytes)) {
      return {
        kind: "error",
        reason: `entries[${i}].bytes: expected finite number`,
      };
    }
    if (
      er.category !== "tree" &&
      er.category !== "dropin" &&
      er.category !== "other"
    ) {
      return {
        kind: "error",
        reason: `entries[${i}].category: expected "tree" | "dropin" | "other"`,
      };
    }
    // Audit Domain 6 LOW-F7 — `bytes` is a DERIVED field (always
    // `key.length + value.length` per `describeStoredTreeStateEntries` /
    // `describeAllStoredEntries`). The importer used to accept the JSON-
    // supplied value verbatim, which let a tampered export (or a stale
    // pre-derivation export from an old writer) carry an inconsistent
    // bytes value through the import. The summary recomputation below
    // would then sum the tampered bytes. Recomputing on import keeps
    // the imported entries internally consistent with the same invariant
    // the live writers honor.
    entries.push({
      key: er.key,
      value: er.value,
      bytes: er.key.length + er.value.length,
      category: er.category,
    });
  }
  // metadata — optional + lenient. Drop malformed silently rather than
  // failing the entire import (forward-compat for v2 readers who care
  // less about the exact metadata shape).
  let metadata: StoragePanelExportMetadata | undefined;
  if (
    obj.metadata !== null &&
    typeof obj.metadata === "object" &&
    !Array.isArray(obj.metadata)
  ) {
    const mr = obj.metadata as Record<string, unknown>;
    if (
      typeof mr.dropinSchemaVersion === "number" &&
      Number.isFinite(mr.dropinSchemaVersion) &&
      typeof mr.userAgent === "string" &&
      (mr.appVersion === null || typeof mr.appVersion === "string")
    ) {
      metadata = {
        dropinSchemaVersion: mr.dropinSchemaVersion,
        userAgent: mr.userAgent,
        appVersion: mr.appVersion,
      };
    }
  }
  // summary — re-derive from entries so the result is internally
  // consistent regardless of what the export said.
  const total = entries.reduce(
    (acc, e) => {
      acc.count++;
      acc.bytes += e.bytes;
      return acc;
    },
    { count: 0, bytes: 0 },
  );
  const categorized: StoredEntryCategorized[] = entries.map((e) => ({
    key: e.key,
    value: e.value,
    bytes: e.bytes,
    category: e.category,
  }));
  const out: StoragePanelExport = {
    schemaVersion: 1,
    exportedAt: obj.exportedAt,
    panelState: {
      scope: ps.scope,
      filter: importedFilter,
      sort: ps.sort,
      collapsedOther: ps.collapsedOther,
    },
    entries,
    summary: {
      total,
      byCategory: summarizeStoredEntriesByCategory(categorized),
    },
  };
  if (metadata !== undefined) {
    out.metadata = metadata;
  }
  return { kind: "ok", value: out };
}

// ----- Persisted custom export filename ----------------------------------

// Persisted custom filename prefix for the export download. Default
// "dropin-tree-storage" matches the original filename. User can
// customize so a multi-app vibecoder investigating two Dropin instances
// side-by-side ends up with distinguishable downloads (e.g.
// "blogA-storage", "shopB-storage").
//
// Sanitization is critical: the filename ends up as the value of an
// anchor's `download` attribute. Browsers vary on which characters they
// accept — Windows rejects `/\:*?"<>|`, Linux only rejects `/`, macOS
// rejects `:` and `/`. To get a consistent UX, we strip the
// intersection-conservative set on write (preserving the user's intent
// up to the point a character would break the download). Control
// characters and leading dots are also stripped (leading dots create
// hidden files on Unix).
//
// The runtime filename is `${prefix}-${Date.now()}.json` (the suffix
// keeps multiple back-to-back exports distinct); the user only
// customizes the prefix.
const STORAGE_PANEL_EXPORT_FILENAME_KEY = versionedKey(
  "storage-panel-export-filename",
);
const STORAGE_PANEL_EXPORT_FILENAME_DEFAULT = "dropin-tree-storage";
const STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN = 64;

// Pure sanitizer: applied on read AND write so a hand-edited
// localStorage entry with a path separator can't break the download.
// Returns the sanitized string; if sanitization empties the string,
// returns the default. Idempotent: sanitize(sanitize(x)) === sanitize(x).
export function sanitizeStoragePanelExportFilename(raw: string): string {
  // Strip path separators / OS-rejected metachars.
  let s = raw.replace(/[/\\:*?"<>|]/g, "");
  // Strip control characters (ASCII < 32 + DEL).
  s = s.replace(/[\x00-\x1f\x7f]/g, "");
  // Trim leading dots (hidden files on Unix) + leading whitespace.
  s = s.replace(/^[.\s]+/, "");
  // Trim trailing whitespace + dots (Windows quirk: trailing dots
  // get stripped at the OS level anyway, but stripping early gives a
  // consistent downloaded name).
  s = s.replace(/[.\s]+$/, "");
  // Cap length to keep the rendered input compact + the resulting
  // filename reasonable. Apply AFTER strip-passes so the cap counts
  // visible characters, not stripped noise.
  if (s.length > STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN) {
    s = s.slice(0, STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN);
  }
  if (s.length === 0) return STORAGE_PANEL_EXPORT_FILENAME_DEFAULT;
  return s;
}

export function parseStoragePanelExportFilename(raw: string | null): string {
  if (raw === null) return STORAGE_PANEL_EXPORT_FILENAME_DEFAULT;
  return sanitizeStoragePanelExportFilename(raw);
}

export function readStoredStoragePanelExportFilename(): string {
  if (typeof window === "undefined")
    return STORAGE_PANEL_EXPORT_FILENAME_DEFAULT;
  try {
    return parseStoragePanelExportFilename(
      window.localStorage.getItem(STORAGE_PANEL_EXPORT_FILENAME_KEY),
    );
  } catch {
    return STORAGE_PANEL_EXPORT_FILENAME_DEFAULT;
  }
}

export function writeStoredStoragePanelExportFilename(name: string): void {
  if (typeof window === "undefined") return;
  try {
    const sanitized = sanitizeStoragePanelExportFilename(name);
    if (sanitized === STORAGE_PANEL_EXPORT_FILENAME_DEFAULT) {
      // Default → remove the key. Note: we compare AFTER sanitize so
      // that hand-edits which sanitize to default also remove the key,
      // keeping localStorage tidy.
      window.localStorage.removeItem(STORAGE_PANEL_EXPORT_FILENAME_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_EXPORT_FILENAME_KEY,
      sanitized,
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Pretty-print JSON values toggle ------------------------------------

// Pretty-print JSON-parseable values in the panel rows. Dropin's
// persisted state values are all JSON (subtree-depths is an object,
// expanded is an array, etc.); when investigating "what's in this 4KB
// entry", a 4KB single-line blob is useless but a pretty-printed
// multi-line view is readable. Toggle defaults to OFF since changing
// render mid-investigation is jarring; users who want the format opt in.
//
// Pure helper: returns null when the value is not valid JSON OR is a
// JSON primitive (string / number / boolean / null) — those are
// already maximally compact in their stored form, so reformatting
// adds nothing. Only OBJECTS and ARRAYS get pretty-printed.
//
// The match-highlight downstream operates on the rendered text
// regardless of format, so a user filtering for "depth" finds matches
// in either single-line or pretty-printed form.
export function tryFormatJsonValue(value: string): string | null {
  if (typeof value !== "string") return null;
  if (value.trim() === "") return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }
  // Skip primitives — JSON-stringifying them just re-quotes the input,
  // adding noise without readability. Only render objects + arrays.
  if (parsed === null) return null;
  if (typeof parsed !== "object") return null;
  return JSON.stringify(parsed, null, 2);
}

const STORAGE_PANEL_PRETTY_PRINT_KEY = versionedKey(
  "storage-panel-pretty-print",
);
const STORAGE_PANEL_PRETTY_PRINT_DEFAULT = false;

export function parseStoragePanelPrettyPrint(raw: string | null): boolean {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return STORAGE_PANEL_PRETTY_PRINT_DEFAULT;
}

export function readStoredStoragePanelPrettyPrint(): boolean {
  if (typeof window === "undefined") return STORAGE_PANEL_PRETTY_PRINT_DEFAULT;
  try {
    return parseStoragePanelPrettyPrint(
      window.localStorage.getItem(STORAGE_PANEL_PRETTY_PRINT_KEY),
    );
  } catch {
    return STORAGE_PANEL_PRETTY_PRINT_DEFAULT;
  }
}

export function writeStoredStoragePanelPrettyPrint(pretty: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (pretty === STORAGE_PANEL_PRETTY_PRINT_DEFAULT) {
      window.localStorage.removeItem(STORAGE_PANEL_PRETTY_PRINT_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_PRETTY_PRINT_KEY,
      pretty ? "1" : "0",
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Hide values toggle -------------------------------------------------

// Toggle to hide the value column in the panel rows. Long values (e.g.
// an `expanded:v1` array with 200 OIDs) eat vertical space even with
// the `max-h-20` clamp. Power users investigating a key family by name
// don't always need the value preview — hiding it makes the panel a
// tighter scan. Default OFF; persisted so the preference sticks across
// reloads.
const STORAGE_PANEL_HIDE_VALUES_KEY = versionedKey(
  "storage-panel-hide-values",
);
const STORAGE_PANEL_HIDE_VALUES_DEFAULT = false;

export function parseStoragePanelHideValues(raw: string | null): boolean {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return STORAGE_PANEL_HIDE_VALUES_DEFAULT;
}

export function readStoredStoragePanelHideValues(): boolean {
  if (typeof window === "undefined") return STORAGE_PANEL_HIDE_VALUES_DEFAULT;
  try {
    return parseStoragePanelHideValues(
      window.localStorage.getItem(STORAGE_PANEL_HIDE_VALUES_KEY),
    );
  } catch {
    return STORAGE_PANEL_HIDE_VALUES_DEFAULT;
  }
}

export function writeStoredStoragePanelHideValues(hidden: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (hidden === STORAGE_PANEL_HIDE_VALUES_DEFAULT) {
      window.localStorage.removeItem(STORAGE_PANEL_HIDE_VALUES_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_HIDE_VALUES_KEY,
      hidden ? "1" : "0",
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Value truncation override -----------------------------------------

// User-overridable value truncation cap. Original hardcoded 200-char
// preview cap on the value rendering is the default. Power users
// investigating a 4KB JSON value want to see more of it inline (lifting
// to 1000+); users on a small screen want less. Range [50, 5000] —
// below 50 the preview becomes useless, above 5000 the panel scrolls
// forever (pretty-print is the better path past that).
//
// Pure helpers + persisted preference. Mirrors the cap-override
// pattern (parse with clamp + floor; null-or-default → removeItem).
const STORAGE_PANEL_VALUE_TRUNCATION_KEY = versionedKey(
  "storage-panel-value-truncation",
);
const STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT = 200;
const STORAGE_PANEL_VALUE_TRUNCATION_MIN = 50;
const STORAGE_PANEL_VALUE_TRUNCATION_MAX = 5000;

export function parseStoragePanelValueTruncation(raw: string | null): number {
  if (raw === null) return STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT;
  // Empty / whitespace-only → treat as missing entry. Without this guard
  // `Number("")` and `Number("   ")` both coerce to 0 which then
  // clamps to MIN, hiding what's clearly a corrupted-or-missing entry
  // behind a non-default value.
  if (raw.trim() === "") return STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT;
  const n = Number(raw);
  if (!Number.isFinite(n)) return STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT;
  if (n < STORAGE_PANEL_VALUE_TRUNCATION_MIN) {
    return STORAGE_PANEL_VALUE_TRUNCATION_MIN;
  }
  if (n > STORAGE_PANEL_VALUE_TRUNCATION_MAX) {
    return STORAGE_PANEL_VALUE_TRUNCATION_MAX;
  }
  return Math.floor(n);
}

export function readEffectiveStoragePanelValueTruncation(): number {
  if (typeof window === "undefined")
    return STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT;
  try {
    return parseStoragePanelValueTruncation(
      window.localStorage.getItem(STORAGE_PANEL_VALUE_TRUNCATION_KEY),
    );
  } catch {
    return STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT;
  }
}

export function writeStoragePanelValueTruncationOverride(
  value: number | null,
): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.localStorage.removeItem(STORAGE_PANEL_VALUE_TRUNCATION_KEY);
      return;
    }
    if (!Number.isFinite(value)) return;
    if (value < 0) return;
    const clamped =
      value < STORAGE_PANEL_VALUE_TRUNCATION_MIN
        ? STORAGE_PANEL_VALUE_TRUNCATION_MIN
        : value > STORAGE_PANEL_VALUE_TRUNCATION_MAX
          ? STORAGE_PANEL_VALUE_TRUNCATION_MAX
          : Math.floor(value);
    if (clamped === STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT) {
      // Default-equivalence remove.
      window.localStorage.removeItem(STORAGE_PANEL_VALUE_TRUNCATION_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_VALUE_TRUNCATION_KEY,
      String(clamped),
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Per-category collapse (tree + dropin + other) ---------------------

// Partitions a categorized list into a visible slice plus a per-category
// summary of hidden entries (count + bytes per bucket). Each of the
// three categories (tree / dropin / other) can be collapsed
// independently via `collapsed.{tree,dropin,other}`. The UI uses the
// hidden summary to render "show N <category> entries (NNN bytes)"
// toggles at the bottom of the list.
//
// Returns `{ visible, hidden: { tree, dropin, other } }` where each
// hidden bucket has `{ count, bytes }`. Default order of `visible` is
// the input order (sort + filter happen upstream). Pure: no input
// mutation; returns a fresh array.
interface CollapsibleAllEntriesViewByCategory<
  T extends StoredEntryCategorized,
> {
  visible: T[];
  hidden: {
    tree: { count: number; bytes: number };
    dropin: { count: number; bytes: number };
    other: { count: number; bytes: number };
  };
}

interface StoragePanelCategoryCollapseState {
  tree: boolean;
  dropin: boolean;
  other: boolean;
}

export function partitionAllEntriesByCategoryCollapse<
  T extends StoredEntryCategorized,
>(
  entries: ReadonlyArray<T>,
  collapsed: StoragePanelCategoryCollapseState,
): CollapsibleAllEntriesViewByCategory<T> {
  const hidden = {
    tree: { count: 0, bytes: 0 },
    dropin: { count: 0, bytes: 0 },
    other: { count: 0, bytes: 0 },
  };
  const visible: T[] = [];
  for (const e of entries) {
    if (collapsed[e.category]) {
      hidden[e.category].count++;
      hidden[e.category].bytes += e.bytes;
    } else {
      visible.push(e);
    }
  }
  return { visible, hidden };
}

// Persisted booleans for tree + dropin collapse. Default false (NOT
// collapsed) for both — opposite of the "other" default (which IS
// collapsed). Rationale: tree + dropin are the categories the user is
// most likely investigating in the panel; collapsing them by default
// would make the all-keys view feel broken.
const STORAGE_PANEL_COLLAPSED_TREE_KEY = versionedKey(
  "storage-panel-collapsed-tree",
);
const STORAGE_PANEL_COLLAPSED_TREE_DEFAULT = false;

const STORAGE_PANEL_COLLAPSED_DROPIN_KEY = versionedKey(
  "storage-panel-collapsed-dropin",
);
const STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT = false;

export function parseStoragePanelCollapsedTree(raw: string | null): boolean {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return STORAGE_PANEL_COLLAPSED_TREE_DEFAULT;
}

export function readStoredStoragePanelCollapsedTree(): boolean {
  if (typeof window === "undefined")
    return STORAGE_PANEL_COLLAPSED_TREE_DEFAULT;
  try {
    return parseStoragePanelCollapsedTree(
      window.localStorage.getItem(STORAGE_PANEL_COLLAPSED_TREE_KEY),
    );
  } catch {
    return STORAGE_PANEL_COLLAPSED_TREE_DEFAULT;
  }
}

export function writeStoredStoragePanelCollapsedTree(collapsed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (collapsed === STORAGE_PANEL_COLLAPSED_TREE_DEFAULT) {
      window.localStorage.removeItem(STORAGE_PANEL_COLLAPSED_TREE_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_COLLAPSED_TREE_KEY,
      collapsed ? "1" : "0",
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

export function parseStoragePanelCollapsedDropin(raw: string | null): boolean {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT;
}

export function readStoredStoragePanelCollapsedDropin(): boolean {
  if (typeof window === "undefined")
    return STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT;
  try {
    return parseStoragePanelCollapsedDropin(
      window.localStorage.getItem(STORAGE_PANEL_COLLAPSED_DROPIN_KEY),
    );
  } catch {
    return STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT;
  }
}

export function writeStoredStoragePanelCollapsedDropin(
  collapsed: boolean,
): void {
  if (typeof window === "undefined") return;
  try {
    if (collapsed === STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT) {
      window.localStorage.removeItem(STORAGE_PANEL_COLLAPSED_DROPIN_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_COLLAPSED_DROPIN_KEY,
      collapsed ? "1" : "0",
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Persisted filter history (datalist autocomplete) ------------------

// Persisted recent search history for the panel filter input. A small
// ring buffer of the most-recent N=8 non-empty queries (most recent
// first; case-folded dedupe). Surfaced via a `<datalist>` dropdown so
// the browser's native autocomplete picks them up — no custom UI needed.
//
// Stored as JSON array of strings under
// `dropin:tree:storage-panel-filter-history:v1`. Each entry is bounded
// by STORAGE_PANEL_FILTER_MAX_LEN so a hand-edited mega-string can't
// blow up the dropdown either.
const STORAGE_PANEL_FILTER_HISTORY_KEY = versionedKey(
  "storage-panel-filter-history",
);
const STORAGE_PANEL_FILTER_HISTORY_MAX_ENTRIES = 8;

export function parseStoragePanelFilterHistory(raw: string | null): string[] {
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: string[] = [];
    const seen = new Set<string>();
    for (const item of parsed) {
      if (typeof item !== "string") continue;
      if (item.length === 0) continue;
      // Cap each entry; oversized hand-edits get truncated rather than
      // dropped (preserves the user's intent in the common case).
      const capped =
        item.length > STORAGE_PANEL_FILTER_MAX_LEN
          ? item.slice(0, STORAGE_PANEL_FILTER_MAX_LEN)
          : item;
      const folded = capped.toLowerCase();
      if (seen.has(folded)) continue;
      seen.add(folded);
      out.push(capped);
      if (out.length >= STORAGE_PANEL_FILTER_HISTORY_MAX_ENTRIES) break;
    }
    return out;
  } catch {
    return [];
  }
}

export function serializeStoragePanelFilterHistory(
  entries: ReadonlyArray<string>,
): string {
  return JSON.stringify(entries);
}

export function readStoredStoragePanelFilterHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return parseStoragePanelFilterHistory(
      window.localStorage.getItem(STORAGE_PANEL_FILTER_HISTORY_KEY),
    );
  } catch {
    return [];
  }
}

export function writeStoredStoragePanelFilterHistory(
  entries: ReadonlyArray<string>,
): void {
  if (typeof window === "undefined") return;
  try {
    if (entries.length === 0) {
      window.localStorage.removeItem(STORAGE_PANEL_FILTER_HISTORY_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_FILTER_HISTORY_KEY,
      serializeStoragePanelFilterHistory(entries),
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// Pure: prepend `query` to `existing`, dedupe case-folded, cap at
// MAX_ENTRIES. Empty / whitespace-only queries are no-ops (return
// existing as-is). Returns a fresh array; does NOT mutate input.
export function appendStoragePanelFilterHistoryEntry(
  existing: ReadonlyArray<string>,
  query: string,
): string[] {
  const trimmed = query.trim();
  if (trimmed === "") return existing.slice();
  const capped =
    trimmed.length > STORAGE_PANEL_FILTER_MAX_LEN
      ? trimmed.slice(0, STORAGE_PANEL_FILTER_MAX_LEN)
      : trimmed;
  const folded = capped.toLowerCase();
  const out: string[] = [capped];
  for (const e of existing) {
    if (e.toLowerCase() === folded) continue;
    out.push(e);
    if (out.length >= STORAGE_PANEL_FILTER_HISTORY_MAX_ENTRIES) break;
  }
  return out;
}

// ----- Persisted recent imports list -------------------------------------

// Persisted recent imports list. When import succeeds, stash a SUMMARY
// of the import so the user can re-apply the panel state later without
// pasting the JSON again. Stores ONLY the panel state knobs + entry
// count + bytes total + addedAt timestamp — the entries themselves are
// big and re-applying the entries is intentionally unsupported (state-
// only restore policy preserved here too).
//
// Why a separate ring (not just filter history): the user's search query
// and their import history serve different intents. A search-history
// entry is "what did I look for"; a recent-import is "what panel state
// did I restore". Keeping them separate avoids the "import this query"
// confusion in the datalist.
const STORAGE_PANEL_RECENT_IMPORTS_KEY = versionedKey(
  "storage-panel-recent-imports",
);
const STORAGE_PANEL_RECENT_IMPORTS_MAX_ENTRIES = 5;

export interface StoragePanelRecentImport {
  exportedAt: string;
  panelState: StoragePanelStateKnobs;
  entryCount: number;
  totalBytes: number;
  addedAt: string;
}

// Audit Domain 5 — internal parser, consumed by readStored* wrapper
// below. Demoted from export.
function parseStoragePanelRecentImports(
  raw: string | null,
): StoragePanelRecentImport[] {
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: StoragePanelRecentImport[] = [];
    for (const item of parsed) {
      if (item === null || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      if (typeof o.exportedAt !== "string") continue;
      if (typeof o.addedAt !== "string") continue;
      if (typeof o.entryCount !== "number") continue;
      if (typeof o.totalBytes !== "number") continue;
      if (!Number.isFinite(o.entryCount)) continue;
      if (!Number.isFinite(o.totalBytes)) continue;
      const ps = o.panelState as Record<string, unknown> | null;
      if (ps === null || typeof ps !== "object") continue;
      const scope = ps.scope === "all" ? "all" : ps.scope === "tree" ? "tree" : null;
      const sort =
        ps.sort === "name-asc"
          ? "name-asc"
          : ps.sort === "bytes-desc"
            ? "bytes-desc"
            : null;
      if (scope === null) continue;
      if (sort === null) continue;
      if (typeof ps.filter !== "string") continue;
      if (typeof ps.collapsedOther !== "boolean") continue;
      out.push({
        exportedAt: o.exportedAt,
        panelState: {
          scope,
          filter: ps.filter,
          sort,
          collapsedOther: ps.collapsedOther,
        },
        entryCount: Math.floor(o.entryCount),
        totalBytes: Math.floor(o.totalBytes),
        addedAt: o.addedAt,
      });
      if (out.length >= STORAGE_PANEL_RECENT_IMPORTS_MAX_ENTRIES) break;
    }
    return out;
  } catch {
    return [];
  }
}

export function readStoredStoragePanelRecentImports(): StoragePanelRecentImport[] {
  if (typeof window === "undefined") return [];
  try {
    return parseStoragePanelRecentImports(
      window.localStorage.getItem(STORAGE_PANEL_RECENT_IMPORTS_KEY),
    );
  } catch {
    return [];
  }
}

export function writeStoredStoragePanelRecentImports(
  entries: ReadonlyArray<StoragePanelRecentImport>,
): void {
  if (typeof window === "undefined") return;
  try {
    if (entries.length === 0) {
      window.localStorage.removeItem(STORAGE_PANEL_RECENT_IMPORTS_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_RECENT_IMPORTS_KEY,
      JSON.stringify(entries),
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// Pure: prepend `incoming` to `existing`, dedupe by exportedAt (the
// natural identity of an export), cap at MAX_ENTRIES. Returns a fresh
// array; does NOT mutate input.
export function appendStoragePanelRecentImportEntry(
  existing: ReadonlyArray<StoragePanelRecentImport>,
  incoming: StoragePanelRecentImport,
): StoragePanelRecentImport[] {
  const out: StoragePanelRecentImport[] = [incoming];
  for (const e of existing) {
    if (e.exportedAt === incoming.exportedAt) continue;
    out.push(e);
    if (out.length >= STORAGE_PANEL_RECENT_IMPORTS_MAX_ENTRIES) break;
  }
  return out;
}

// ----- Recent imports sort toggle ----------------------------------------

// The recent imports list is normally rendered in insertion order
// (most-recent import first), which works fine for "I just imported and
// want to re-apply" but breaks for "which import is the freshest by
// addedAt" when the user has been bouncing between imports of older
// snapshots. Add a "by-date" alternative that sorts by `addedAt`
// descending with `exportedAt` descending as the tiebreaker — addedAt is
// the moment the user clicked restore, exportedAt is when the snapshot
// was originally taken; tiebreaker matters when the same snapshot has
// been restored from clipboard at the exact same instant via a scripted
// paste.
const STORAGE_PANEL_RECENT_IMPORTS_SORT_KEY = versionedKey(
  "storage-panel-recent-imports-sort",
);
export type StoragePanelRecentImportsSort = "insertion" | "added-desc";
const STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT: StoragePanelRecentImportsSort =
  "insertion";

// Audit Domain 5 — internal parser, consumed by readStored* wrapper
// below. Demoted from export.
function parseStoragePanelRecentImportsSort(
  raw: string | null,
): StoragePanelRecentImportsSort {
  if (raw === "insertion") return "insertion";
  if (raw === "added-desc") return "added-desc";
  return STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT;
}

export function readStoredStoragePanelRecentImportsSort(): StoragePanelRecentImportsSort {
  if (typeof window === "undefined") {
    return STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT;
  }
  try {
    return parseStoragePanelRecentImportsSort(
      window.localStorage.getItem(STORAGE_PANEL_RECENT_IMPORTS_SORT_KEY),
    );
  } catch {
    return STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT;
  }
}

export function writeStoredStoragePanelRecentImportsSort(
  sort: StoragePanelRecentImportsSort,
): void {
  if (typeof window === "undefined") return;
  try {
    if (sort === STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT) {
      window.localStorage.removeItem(STORAGE_PANEL_RECENT_IMPORTS_SORT_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_PANEL_RECENT_IMPORTS_SORT_KEY, sort);
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// Pure: sort the recent-imports list per `sort` policy. "insertion"
// returns a fresh shallow copy preserving input order. "added-desc"
// sorts by addedAt descending with exportedAt descending tiebreaker.
// Returns a fresh array; does NOT mutate input.
export function sortStoragePanelRecentImports(
  entries: ReadonlyArray<StoragePanelRecentImport>,
  sort: StoragePanelRecentImportsSort,
): StoragePanelRecentImport[] {
  if (sort === "insertion") return entries.slice();
  const out = entries.slice();
  out.sort((a, b) => {
    if (a.addedAt < b.addedAt) return 1;
    if (a.addedAt > b.addedAt) return -1;
    if (a.exportedAt < b.exportedAt) return 1;
    if (a.exportedAt > b.exportedAt) return -1;
    return 0;
  });
  return out;
}

// ----- Snapshot pinning + diff -------------------------------------------

// Snapshot pinning for diff-vs-live compare. The copy/export flows give
// the user a way to grab a point-in-time JSON of the panel state.
// Snapshot pinning goes further: pin the entries themselves into a
// sidecar localStorage key, then diff vs. the live entries to surface
// "what changed since I pinned" without leaving the panel.
//
// Snapshot shape: pinnedAt (ISO), plus a flat list of {key, value,
// bytes} captured at pin time. The diff reports added / removed /
// changed against the live state (matched by key). Cap snapshot
// entries at 200 — pinning a runaway 1000-entry localStorage is rare
// and the pin itself would eat ~50% of the 5MB quota.
//
// Pure: parse, build, diff. Impure: read/write/clear. The write
// returns boolean so the caller can surface "snapshot too large" /
// "quota exceeded" feedback (separate from the silent-fail policy of
// the persistence prefs).
const STORAGE_PANEL_SNAPSHOT_KEY = versionedKey("storage-panel-snapshot");
const STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES = 200;
// Audit F4 — `as const` preserves the literal type so the
// `StoragePanelSnapshot.schemaVersion: 1` field can flow through builders
// without a widening cast. Same pattern as `lib/files/storage.ts`.
const STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION = 1 as const;

interface StoragePanelSnapshotEntry {
  key: string;
  value: string;
  bytes: number;
}

// Audit F4 — `schemaVersion` is the literal `1`, not `number`. Pre-fix
// the field accepted `schemaVersion: 99` (and any other integer) at the
// type level — the runtime parser correctly rejected non-1 values, but
// constructed-in-TS values could carry an arbitrary version and TS would
// happily flow them through. Now: future v2 must add a
// `StoragePanelSnapshotV2` arm + a deserialize branch.
export interface StoragePanelSnapshot {
  readonly schemaVersion: 1;
  pinnedAt: string;
  entries: StoragePanelSnapshotEntry[];
}

// Discriminated-union scaffold. v2 will append a new arm to this alias
// AND add a new branch in `parseStoragePanelSnapshot` keyed on the
// version literal. The point of the scaffold is to keep the wire-format
// type at one edit-point so adding v2 is forced through here.
type StoredStoragePanelSnapshot = StoragePanelSnapshot;

export function parseStoragePanelSnapshot(
  raw: string | null,
): StoragePanelSnapshot | null {
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const o = parsed as Record<string, unknown>;
    if (o.schemaVersion !== STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION) return null;
    if (typeof o.pinnedAt !== "string") return null;
    if (!Array.isArray(o.entries)) return null;
    const entries: StoragePanelSnapshotEntry[] = [];
    for (const item of o.entries) {
      if (item === null || typeof item !== "object") continue;
      const e = item as Record<string, unknown>;
      if (typeof e.key !== "string") continue;
      if (typeof e.value !== "string") continue;
      if (typeof e.bytes !== "number") continue;
      if (!Number.isFinite(e.bytes)) continue;
      entries.push({
        key: e.key,
        value: e.value,
        bytes: Math.floor(e.bytes),
      });
      if (entries.length >= STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES) break;
    }
    return {
      schemaVersion: STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION,
      pinnedAt: o.pinnedAt,
      entries,
    };
  } catch {
    return null;
  }
}

export function buildStoragePanelSnapshot(
  liveEntries: ReadonlyArray<StoragePanelSnapshotEntry>,
  pinnedAt: string,
): StoragePanelSnapshot {
  const cappedEntries =
    liveEntries.length > STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES
      ? liveEntries.slice(0, STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES)
      : liveEntries.slice();
  return {
    schemaVersion: STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION,
    pinnedAt,
    entries: cappedEntries.map((e) => ({
      key: e.key,
      value: e.value,
      bytes: e.bytes,
    })),
  };
}

export function readStoredStoragePanelSnapshot(): StoragePanelSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    return parseStoragePanelSnapshot(
      window.localStorage.getItem(STORAGE_PANEL_SNAPSHOT_KEY),
    );
  } catch {
    return null;
  }
}

// Write returns boolean (unlike the void pref writers) so the UI can
// surface "snapshot too large" / "quota exceeded" without a side-channel.
export function writeStoredStoragePanelSnapshot(
  snapshot: StoragePanelSnapshot | null,
): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (snapshot === null) {
      window.localStorage.removeItem(STORAGE_PANEL_SNAPSHOT_KEY);
      return true;
    }
    window.localStorage.setItem(
      STORAGE_PANEL_SNAPSHOT_KEY,
      JSON.stringify(snapshot),
    );
    return true;
  } catch {
    return false;
  }
}

interface StoragePanelSnapshotDiffEntry {
  key: string;
  bytes: number;
}

interface StoragePanelSnapshotDiffChanged {
  key: string;
  oldBytes: number;
  newBytes: number;
}

interface StoragePanelSnapshotDiff {
  added: StoragePanelSnapshotDiffEntry[];
  removed: StoragePanelSnapshotDiffEntry[];
  changed: StoragePanelSnapshotDiffChanged[];
  unchanged: number;
}

// Pure: diff live entries against a pinned snapshot. Matched by key.
// "added" = key present in live but not snapshot. "removed" = key
// present in snapshot but not live. "changed" = key in both, but
// value differs. "unchanged" = count of keys present in both with
// equal values (no per-key list — count alone tells the user how much
// of the snapshot is still stable). Returns fresh arrays; does NOT
// mutate input.
export function diffStoredEntriesAgainstSnapshot(
  live: ReadonlyArray<StoragePanelSnapshotEntry>,
  snapshot: StoragePanelSnapshot,
): StoragePanelSnapshotDiff {
  const liveMap = new Map<string, StoragePanelSnapshotEntry>();
  for (const e of live) liveMap.set(e.key, e);
  const snapshotMap = new Map<string, StoragePanelSnapshotEntry>();
  for (const e of snapshot.entries) snapshotMap.set(e.key, e);
  const added: StoragePanelSnapshotDiffEntry[] = [];
  const removed: StoragePanelSnapshotDiffEntry[] = [];
  const changed: StoragePanelSnapshotDiffChanged[] = [];
  let unchanged = 0;
  for (const [key, liveEntry] of liveMap) {
    const snapEntry = snapshotMap.get(key);
    if (snapEntry === undefined) {
      added.push({ key, bytes: liveEntry.bytes });
      continue;
    }
    if (snapEntry.value !== liveEntry.value) {
      changed.push({
        key,
        oldBytes: snapEntry.bytes,
        newBytes: liveEntry.bytes,
      });
      continue;
    }
    unchanged++;
  }
  for (const [key, snapEntry] of snapshotMap) {
    if (!liveMap.has(key)) {
      removed.push({ key, bytes: snapEntry.bytes });
    }
  }
  return { added, removed, changed, unchanged };
}

// ----- Shareable preset URL encoding -------------------------------------

// Shareable panel-state preset URLs. The user opens an investigation
// lens (e.g. "all entries, regex filter ^dropin:tree:cap-, bytes-desc
// sort, dropin collapsed"), then wants to share that exact view with a
// teammate without making them flip seven knobs by hand. Encode the
// seven panel-state knobs into a URLSearchParams-shaped query string;
// teammate pastes the URL, app's mount effect decodes the query,
// applies via existing handlers, strips the hash so reload doesn't
// re-apply.
//
// Encoding policy: ONLY non-default fields are emitted, so a default
// state produces the empty string. Compact short keys (s/o/f/fm/co/
// ct/cd) keep the URL under typical 2KB limits even with a 256-char
// filter. Booleans encode as "1" / "0".
//
// Decoding policy: STRICT on each field — invalid → fall back to
// default for that field, not "reject the whole preset". A typo in
// one knob shouldn't blank the rest. Filter is capped at
// STORAGE_PANEL_FILTER_MAX_LEN (256) on decode just like the write
// path so a hand-edited 10MB filter blob in the URL doesn't blow the
// input.
//
// NOTE: this is intentionally a separate concept from the import JSON.
// Import JSON carries the full ENTRIES; preset URLs carry only the
// LENS — what to look at, not the data being looked at. Two distinct
// sharing flows.
interface SharedStoragePanelState {
  scope: StoragePanelScope;
  sort: StoragePanelSort;
  filter: string;
  filterMode: StoragePanelFilterMode;
  collapsedOther: boolean;
  collapsedTree: boolean;
  collapsedDropin: boolean;
}

export function encodeStoragePanelStateQuery(
  state: SharedStoragePanelState,
): string {
  const parts: string[] = [];
  if (state.scope !== STORAGE_PANEL_SCOPE_DEFAULT) {
    parts.push("s=" + encodeURIComponent(state.scope));
  }
  if (state.sort !== STORAGE_PANEL_SORT_DEFAULT) {
    parts.push("o=" + encodeURIComponent(state.sort));
  }
  if (state.filter !== STORAGE_PANEL_FILTER_DEFAULT) {
    parts.push("f=" + encodeURIComponent(state.filter));
  }
  if (state.filterMode !== STORAGE_PANEL_FILTER_MODE_DEFAULT) {
    parts.push("fm=" + encodeURIComponent(state.filterMode));
  }
  if (state.collapsedOther !== STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT) {
    parts.push("co=" + (state.collapsedOther ? "1" : "0"));
  }
  if (state.collapsedTree !== STORAGE_PANEL_COLLAPSED_TREE_DEFAULT) {
    parts.push("ct=" + (state.collapsedTree ? "1" : "0"));
  }
  if (state.collapsedDropin !== STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT) {
    parts.push("cd=" + (state.collapsedDropin ? "1" : "0"));
  }
  return parts.join("&");
}

// Pure: parse the query string back into a fully-populated state.
// Missing fields fall back to defaults; per-field invalid values fall
// back to defaults too (so one typo doesn't blank the rest of the
// preset). Returns null only if the input is unparseable as a query
// string at all (e.g. URLSearchParams construction throws — rare).
export function decodeStoragePanelStateQuery(
  query: string,
): SharedStoragePanelState | null {
  if (typeof query !== "string") return null;
  let trimmed = query.trim();
  if (trimmed.startsWith("?") || trimmed.startsWith("#")) {
    trimmed = trimmed.slice(1);
  }
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(trimmed);
  } catch {
    return null;
  }
  const rawScope = params.get("s");
  const scope: StoragePanelScope =
    rawScope === "tree" || rawScope === "all"
      ? rawScope
      : STORAGE_PANEL_SCOPE_DEFAULT;
  const rawSort = params.get("o");
  const sort: StoragePanelSort =
    rawSort === "bytes-desc" || rawSort === "name-asc"
      ? rawSort
      : STORAGE_PANEL_SORT_DEFAULT;
  const rawFilter = params.get("f");
  let filter = STORAGE_PANEL_FILTER_DEFAULT;
  if (typeof rawFilter === "string") {
    filter =
      rawFilter.length > STORAGE_PANEL_FILTER_MAX_LEN
        ? rawFilter.slice(0, STORAGE_PANEL_FILTER_MAX_LEN)
        : rawFilter;
  }
  const rawMode = params.get("fm");
  const filterMode: StoragePanelFilterMode =
    rawMode === "substring" || rawMode === "regex"
      ? rawMode
      : STORAGE_PANEL_FILTER_MODE_DEFAULT;
  const rawCollapsedOther = params.get("co");
  const collapsedOther =
    rawCollapsedOther === "1"
      ? true
      : rawCollapsedOther === "0"
        ? false
        : STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT;
  const rawCollapsedTree = params.get("ct");
  const collapsedTree =
    rawCollapsedTree === "1"
      ? true
      : rawCollapsedTree === "0"
        ? false
        : STORAGE_PANEL_COLLAPSED_TREE_DEFAULT;
  const rawCollapsedDropin = params.get("cd");
  const collapsedDropin =
    rawCollapsedDropin === "1"
      ? true
      : rawCollapsedDropin === "0"
        ? false
        : STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT;
  return {
    scope,
    sort,
    filter,
    filterMode,
    collapsedOther,
    collapsedTree,
    collapsedDropin,
  };
}

// ----- Per-key edit / delete --------------------------------------------

// Surgical single-key remove. The wipe-prefs covers the bulk-reset
// case; this surfaces a per-row delete inside the panel for users
// investigating a specific runaway key. SSR-safe + try/catch; returns
// boolean to signal whether the remove succeeded (writes that throw
// because localStorage is unavailable get reported back to the caller
// as `false`).
export function removeSingleStoredKey(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// Companion to removeSingleStoredKey for the per-row edit flow. Writes
// the new value verbatim (no JSON parse / re-serialize) so a user
// inspecting a corrupted JSON value can still hand-edit it. Caller is
// responsible for validation — the panel surfaces the SyntaxError
// indirectly when a downstream consumer fails to parse the new value,
// but the WRITE itself is unconditional. Same boolean return contract:
// false on SSR / quota errors, true on success.
export function setSingleStoredKeyValue(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

// ----- Filter mode + regex helpers ---------------------------------------

// Filter mode toggle. The substring filter is the right default for
// casual investigation; power users want regex (`^dropin:tree:cap-` /
// `\\bdepth\\b`). Toggle persisted under
// `dropin:tree:storage-panel-filter-mode:v1`. Strict 2-element string
// union (substring | regex). Default "substring" preserves the
// original behavior.
//
// Why a regex compile-on-each-call helper: the caller wants to compile
// once and bail to substring on SyntaxError, then thread the compiled
// regex into both `filterStoredEntries` and `splitOnMatchedSubstring`'s
// regex sibling. Centralizing the try/catch here keeps the call sites
// clean.
const STORAGE_PANEL_FILTER_MODE_KEY = versionedKey("storage-panel-filter-mode");
export type StoragePanelFilterMode = "substring" | "regex";
const STORAGE_PANEL_FILTER_MODE_DEFAULT: StoragePanelFilterMode = "substring";

// Audit Domain 5 — internal parser; consumed by readStored* below.
function parseStoragePanelFilterMode(
  raw: string | null,
): StoragePanelFilterMode {
  if (raw === "substring") return "substring";
  if (raw === "regex") return "regex";
  return STORAGE_PANEL_FILTER_MODE_DEFAULT;
}

export function readStoredStoragePanelFilterMode(): StoragePanelFilterMode {
  if (typeof window === "undefined") return STORAGE_PANEL_FILTER_MODE_DEFAULT;
  try {
    return parseStoragePanelFilterMode(
      window.localStorage.getItem(STORAGE_PANEL_FILTER_MODE_KEY),
    );
  } catch {
    return STORAGE_PANEL_FILTER_MODE_DEFAULT;
  }
}

export function writeStoredStoragePanelFilterMode(
  mode: StoragePanelFilterMode,
): void {
  if (typeof window === "undefined") return;
  try {
    if (mode === STORAGE_PANEL_FILTER_MODE_DEFAULT) {
      // Default → remove the key (canonical default reads cleanly on a
      // fresh tab without an explicit "substring" entry).
      window.localStorage.removeItem(STORAGE_PANEL_FILTER_MODE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_PANEL_FILTER_MODE_KEY, mode);
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// Pure: compile `query` into a case-insensitive regex; return null on
// any RegExp-construction throw (invalid syntax, unsupported flag).
// The caller falls back to substring match silently — invalid regex
// shouldn't blank the entire entries list.
export function tryCompileFilterRegex(query: string): RegExp | null {
  const trimmed = query.trim();
  if (trimmed === "") return null;
  try {
    return new RegExp(trimmed, "i");
  } catch {
    return null;
  }
}

// Detailed variant. Returns a discriminated union so the caller can
// surface the specific syntax error reason inline (e.g. "Invalid
// regular expression: /[invalid/: Unterminated character class").
// Companion to tryCompileFilterRegex — the legacy null-returning helper
// is preserved for call sites that don't need the reason (e.g. the
// filter+highlight memos), keeping the bench cases for the legacy
// null-shape green without modification.
export type FilterRegexCompileResult =
  | { kind: "ok"; regex: RegExp }
  | { kind: "empty" }
  | { kind: "error"; reason: string };

export function tryCompileFilterRegexDetail(
  query: string,
): FilterRegexCompileResult {
  const trimmed = query.trim();
  if (trimmed === "") return { kind: "empty" };
  try {
    return { kind: "ok", regex: new RegExp(trimmed, "i") };
  } catch (err: unknown) {
    // Browser SyntaxError messages vary across engines but follow
    // the pattern "Invalid regular expression: /<source>/<flags>: <reason>".
    // We surface the raw message verbatim — power users investigating
    // a regex bug benefit from seeing the engine's actual phrasing.
    if (err !== null && typeof err === "object" && "message" in err) {
      const msg = (err as { message: unknown }).message;
      if (typeof msg === "string" && msg.length > 0) {
        return { kind: "error", reason: msg };
      }
    }
    return { kind: "error", reason: "invalid regex" };
  }
}

// Pure: regex-mode filter. Mirrors filterStoredEntries's substring
// branch but tests the compiled regex against key + value. Returns a
// fresh array; does NOT mutate input. Caller has already compiled the
// regex via tryCompileFilterRegex; null regex falls through to a full
// copy (matches the substring "empty query → all" semantics).
export function filterStoredEntriesByRegex<T extends StoredTreeStateEntry>(
  entries: ReadonlyArray<T>,
  regex: RegExp | null,
): T[] {
  if (regex === null) return entries.slice() as T[];
  const out: T[] = [];
  for (const e of entries) {
    if (regex.test(e.key)) {
      out.push(e);
      continue;
    }
    if (regex.test(e.value)) {
      out.push(e);
    }
  }
  return out;
}

// Pure: regex variant of splitOnMatchedSubstring. Produces alternating
// match / non-match segments using the global form of `regex` so we
// walk every match. Empty regex / empty text → single non-match
// segment. Defends against zero-width matches by advancing the cursor
// at least 1 char per iteration (otherwise an empty pattern loops
// forever).
export function splitOnMatchedRegex(
  text: string,
  regex: RegExp | null,
): MatchedSubstringSegment[] {
  if (regex === null || text === "") {
    return [{ text, match: false }];
  }
  // Force global + case-insensitive flags. `regex.flags` already
  // includes "i" (set by tryCompileFilterRegex) but we add "g" for
  // multi-match iteration. Strip "y" if the caller passed a sticky
  // regex — the iteration logic below relies on global semantics.
  const flags = regex.flags.replace(/[gy]/g, "") + "g";
  let walker: RegExp;
  try {
    walker = new RegExp(regex.source, flags);
  } catch {
    return [{ text, match: false }];
  }
  const out: MatchedSubstringSegment[] = [];
  let cursor = 0;
  // Cap iterations so a pathological regex (zero-width on every char)
  // can't lock the panel render. text.length + 1 is a safe upper bound.
  const maxIter = text.length + 1;
  for (let iter = 0; iter < maxIter; iter++) {
    const m = walker.exec(text);
    if (m === null) {
      if (cursor < text.length) {
        out.push({ text: text.slice(cursor), match: false });
      }
      break;
    }
    if (m.index > cursor) {
      out.push({ text: text.slice(cursor, m.index), match: false });
    }
    if (m[0].length === 0) {
      // Zero-width match — emit nothing for the match (no text to
      // highlight), advance past the position, and continue. Without
      // the bump, walker.lastIndex stays at the same offset and we
      // loop indefinitely.
      walker.lastIndex = m.index + 1;
      cursor = m.index + 1;
      if (cursor > text.length) break;
      continue;
    }
    out.push({ text: m[0], match: true });
    cursor = m.index + m[0].length;
    if (cursor >= text.length) break;
  }
  if (out.length === 0) return [{ text, match: false }];
  return out;
}

// ----- Wipe all panel-side preferences -----------------------------------

// Audit Domain 5 — derive the wipe list from a single tuple of all
// panel-side preference keys. Pre-fix this function maintained a parallel
// hard-coded `removeItem(...)` list separate from the constants object;
// adding a new key to the panel meant remembering to update the wipe
// list separately. The tuple below is the single source of truth — both
// the wipe iterator and the public constants object reference it.
//
// Invariant verified by `tests/storage-panel-prod.test.ts §15`: every
// `*_KEY` value in `STORAGE_PANEL_CONSTANTS` appears in this list. A
// new persisted preference that doesn't get wiped on "clear all" will
// fail that test.
const STORAGE_PANEL_PREFERENCE_KEYS = [
  STORAGE_PANEL_SCOPE_KEY,
  STORAGE_PANEL_SORT_KEY,
  STORAGE_PANEL_FILTER_KEY,
  STORAGE_PANEL_COLLAPSED_OTHER_KEY,
  STORAGE_PANEL_EXPORT_FILENAME_KEY,
  STORAGE_PANEL_PRETTY_PRINT_KEY,
  STORAGE_PANEL_HIDE_VALUES_KEY,
  STORAGE_PANEL_VALUE_TRUNCATION_KEY,
  STORAGE_PANEL_COLLAPSED_TREE_KEY,
  STORAGE_PANEL_COLLAPSED_DROPIN_KEY,
  STORAGE_PANEL_FILTER_HISTORY_KEY,
  STORAGE_PANEL_RECENT_IMPORTS_KEY,
  STORAGE_PANEL_FILTER_MODE_KEY,
  STORAGE_PANEL_RECENT_IMPORTS_SORT_KEY,
  STORAGE_PANEL_SNAPSHOT_KEY,
] as const;

// Wipe ONLY the storage-panel preference keys, leaving the tree-state
// preferences (subtree-depth cap, byte thresholds, drag-ghost format)
// alone. Symmetric counterpart to `clearAllStoredTreePreferences` in
// `lib/tree-persistence.ts` — that one wipes tree-side prefs; this one
// wipes panel-side prefs. Callers that want to wipe both call both.
export function clearAllStoredStoragePanelPreferences(): void {
  if (typeof window === "undefined") return;
  try {
    for (const key of STORAGE_PANEL_PREFERENCE_KEYS) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// ----- Constants exported for the bench ----------------------------------

// Locks key names + cap defaults for bench cross-checks. Tree-state
// constants live in TREE_PERSISTENCE_CONSTANTS in lib/tree-persistence.ts.
export const STORAGE_PANEL_CONSTANTS = {
  KEY_NAMESPACE,
  STORAGE_PANEL_SCOPE_KEY,
  STORAGE_PANEL_SCOPE_DEFAULT,
  STORAGE_PANEL_SORT_KEY,
  STORAGE_PANEL_SORT_DEFAULT,
  STORAGE_PANEL_FILTER_KEY,
  STORAGE_PANEL_FILTER_DEFAULT,
  STORAGE_PANEL_FILTER_MAX_LEN,
  STORAGE_PANEL_COLLAPSED_OTHER_KEY,
  STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT,
  STORAGE_PANEL_EXPORT_FILENAME_KEY,
  STORAGE_PANEL_EXPORT_FILENAME_DEFAULT,
  STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN,
  STORAGE_PANEL_PRETTY_PRINT_KEY,
  STORAGE_PANEL_PRETTY_PRINT_DEFAULT,
  STORAGE_PANEL_HIDE_VALUES_KEY,
  STORAGE_PANEL_HIDE_VALUES_DEFAULT,
  STORAGE_PANEL_VALUE_TRUNCATION_KEY,
  STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT,
  STORAGE_PANEL_VALUE_TRUNCATION_MIN,
  STORAGE_PANEL_VALUE_TRUNCATION_MAX,
  STORAGE_PANEL_COLLAPSED_TREE_KEY,
  STORAGE_PANEL_COLLAPSED_TREE_DEFAULT,
  STORAGE_PANEL_COLLAPSED_DROPIN_KEY,
  STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT,
  STORAGE_PANEL_FILTER_HISTORY_KEY,
  STORAGE_PANEL_FILTER_HISTORY_MAX_ENTRIES,
  STORAGE_PANEL_RECENT_IMPORTS_KEY,
  STORAGE_PANEL_RECENT_IMPORTS_MAX_ENTRIES,
  STORAGE_PANEL_FILTER_MODE_KEY,
  STORAGE_PANEL_FILTER_MODE_DEFAULT,
  STORAGE_PANEL_RECENT_IMPORTS_SORT_KEY,
  STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT,
  STORAGE_PANEL_SNAPSHOT_KEY,
  STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES,
  STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION,
  STORAGE_PANEL_PREFERENCE_KEYS,
} as const;
