// localStorage persistence for ElementTree state across page reloads
// plus the cross-cutting telemetry + preference primitives the tree
// footer pill, DnD ghost, and storage health panel all share. Mirrors
// the existing rail-width persistence pattern (`dropin:tree:width` key,
// lazy-init read, on-change write, namespaced + version-tagged keys).
//
// What this module owns:
//   - Tree state proper: lastAppliedDepth, query, expanded set,
//     subtree-depth map. Read / write / parse / serialize / clear.
//   - Cross-tab subscription via the storage event.
//   - Schema version + migration GC for stale dropin:tree:* entries.
//   - Storage telemetry: live + predicted byte counts, severity classifier,
//     human-friendly byte formatter.
//   - listStoredTreeStateEntries / listAllStoredEntries / categorizeStoredKey
//     — the localStorage walkers that power both the inspector debug
//     hooks and the storage health panel.
//   - Power-user override prefs: subtree-depth cap, storage byte
//     warn/danger thresholds, drag-ghost label format.
//   - clearAllStoredTreePreferences — wipe the override prefs above
//     (panel-only prefs live in `lib/storage-panel.ts` and have a
//     separate wipe).
//
// What lives in the companion `lib/storage-panel.ts`:
//   - Every STORAGE_PANEL_* localStorage key (scope, sort, filter,
//     collapse, export filename, pretty-print, hide-values, value
//     truncation, filter history, recent imports, filter mode, snapshot,
//     etc.) and its read / write / parse helpers.
//   - Pure helpers exclusive to the panel UI: filterStoredEntries,
//     sortStoredEntries, partitionAllEntriesBy*, summarizeStoredEntriesByCategory,
//     splitOnMatchedSubstring, splitOnMatchedRegex, build/parse storage
//     panel export JSON, snapshot diff, preset URL encode/decode, etc.
//
// Both modules share `KEY_NAMESPACE`, `STORAGE_SCHEMA_VERSION`, and
// `versionedKey` exported from this module so the entire dropin:tree:*
// namespace stays under a single schema version.
//
// Tree state intentionally NOT persisted:
//   - selection / additionalOids — canvas-driven, not tree-driven.
//   - subtree-depth choices — additive overrides; ephemeral by design.
//
// SSR safety: every reader / writer guards `typeof window === "undefined"`
// to short-circuit Next.js App Router SSR. The lazy-init useState
// pattern (`useState(() => readStored...)`) tolerates a default-vs-
// localStorage divergence — React 18 reconciles benignly. Same pattern
// already in use for the rail-width key (predates this module).
//
// Pure helpers (parsers / serializers / classifiers / formatters)
// covered by `scripts/bench-tree-persistence.mjs`. The bench is hermetic
// — it inlines its own copies, so this module can move freely without
// touching the bench.

// Schema version — every dropin:tree:* key is suffixed with
// `:v${STORAGE_SCHEMA_VERSION}`. Bumping this number triggers
// `migrateLegacyStoredTreeState` (called once per ElementTree mount) to
// garbage-collect entries from older schemas — they're left dormant by
// the version-mismatched key suffix (readers look for the current-
// version key only) but accumulating dead keys would chip away at the
// ~5MB localStorage quota over many schema bumps.
//
// Why versioned-key + GC instead of in-place migration: the data shapes
// here are simple enough that a v2 reader would either (a) accept a v1
// payload as-is (additive bump — no migration needed, just rename) or
// (b) reject v1 entries entirely (breaking shape change — no clean
// migration path). Garbage-collecting dead versions keeps storage
// hygienic without any per-shape migration code.
export const STORAGE_SCHEMA_VERSION = 1;
export const KEY_NAMESPACE = "dropin:tree:";

// Audit F8 — brand the return type so a function expecting a specific
// key-name (e.g. `readDepth(key: DropinTreeKey<"depth">)`) can't be
// called with a different key. The runtime value is just `string`; the
// brand exists only at compile time. Two consequences:
//
//  • Each `versionedKey("depth")` call is typed `DropinTreeKey<"depth">`,
//    distinct from `DropinTreeKey<"query">` etc.
//  • Where consumers pass a key into `localStorage.getItem` /
//    `setItem` / `removeItem`, the brand string-coerces transparently
//    (Web platform APIs take `string`, and `DropinTreeKey<X>` is
//    structurally a `string`).
//
// Adding the brand is defense-in-depth: today every read/write hardcodes
// its key constant, so no cross-key read is possible. But any refactor
// that parameterizes a reader by key (e.g. for testing) will inherit
// the discriminator without extra type wiring.
export type DropinTreeKey<Name extends string = string> = string & {
  readonly __dropinTreeKeyBrand: Name;
};

// Compose a namespaced + version-tagged key. Exported so the companion
// `lib/storage-panel.ts` module can use the same suffix convention for
// its own keys without duplicating the constants.
export function versionedKey<Name extends string>(
  name: Name,
): DropinTreeKey<Name> {
  return `${KEY_NAMESPACE}${name}:v${STORAGE_SCHEMA_VERSION}` as DropinTreeKey<Name>;
}

const KEY_DEPTH = versionedKey("depth");
const KEY_QUERY = versionedKey("query");
// Manual-mode `expanded` set persistence. Stored as JSON-encoded array
// of nodeKey strings (e.g. `oid:abc12345` / `jsx:5:8` / `html:0.1.2`).
// Only written when ElementTree is in manual mode
// (`lastAppliedDepth === null`). For depth-mode users the depth re-apply
// effect rebuilds expanded on every tree push, so persisting would just
// clobber the next session with a stale snapshot. The versioned key lets
// a future schema bump (e.g. `:v2` adding template signatures for
// OID-vs-template gating) silently ignore v1 entries.
const KEY_EXPANDED = versionedKey("expanded");
// Per-OID subtree-depth persistence. Stored as JSON-encoded
// `Record<string, number>` mapping a tree row's OID → the last subtree
// depth the user picked for that row. Replayed on every tree push for
// OIDs that still resolve. Capped to SUBTREE_DEPTH_MAX_ENTRIES so a
// long session of opening many subtrees doesn't grow the store without
// bound — when the cap is hit, the LEAST recently inserted entry is
// dropped (insertion-order from the JS object preserves recency since
// rewrites delete + reinsert).
const KEY_SUBTREE_DEPTHS = versionedKey("subtree-depths");

// Sane upper bound on a UI filter input. Caps both reads and writes so
// a hand-edited localStorage value can't blow up the input box. 256
// chars is generous — even verbose component tags (Material UI etc.)
// are well under 50.
const QUERY_MAX_LEN = 256;
// Cap for the persisted expanded set size. Even a fully-expanded
// 500-element tree fits in ~6KB JSON. The cap defends against runaway
// growth — if a user adds + deletes elements over many sessions, stale
// OID keys for deleted elements could accumulate. localStorage caps
// total quota at ~5MB; 1000 entries × ~12 chars each = ~12KB, well
// under quota and well under any reasonable working tree size.
const EXPANDED_MAX_ENTRIES = 1000;

// Cap for the per-OID subtree-depth map. 50 entries is generous —
// realistic users open maybe a dozen subtrees in one session. Cap math:
// 50 × ~24 chars (oid + depth + JSON overhead) = ~1.2KB. The eviction
// policy is FIFO: when adding a new entry would exceed the cap, the
// oldest entry (object's first key by insertion order) is dropped.
const SUBTREE_DEPTH_MAX_ENTRIES = 50;

// Serialized depth representation:
//   "null"     → user has manual mods (lastAppliedDepth: null)
//   "Infinity" → expand-all sentinel (EXPAND_ALL_DEPTH = +Infinity)
//   <integer>  → finite depth (e.g. "2", "3")
// Anything else → fallback (caller-supplied — matches the in-memory
// default of DEFAULT_EXPAND_DEPTH=2).
export function parseStoredDepth(
  raw: string | null,
  fallback: number | null,
): number | null {
  if (raw === null) return fallback;
  if (raw === "null") return null;
  if (raw === "Infinity") return Number.POSITIVE_INFINITY;
  // Number("") and Number("   ") both coerce to 0 — NOT valid depth
  // representations, so reject them explicitly before the Number()
  // coercion. Without this guard a corrupted localStorage entry of ""
  // would silently pin the tree to depth 0 (collapse-all) instead of
  // falling back to default.
  if (raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  // Negative depths have no UI; fold to fallback so a hand-edit can't
  // poison state. Zero is allowed (collapse-all-children semantic).
  if (n < 0) return fallback;
  return Math.floor(n);
}

export function serializeStoredDepth(depth: number | null): string {
  if (depth === null) return "null";
  if (!Number.isFinite(depth)) return "Infinity";
  return String(Math.floor(depth));
}

export function readStoredDepth(fallback: number | null): number | null {
  if (typeof window === "undefined") return fallback;
  try {
    return parseStoredDepth(
      window.localStorage.getItem(KEY_DEPTH),
      fallback,
    );
  } catch {
    return fallback;
  }
}

export function writeStoredDepth(depth: number | null): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_DEPTH, serializeStoredDepth(depth));
  } catch {
    // localStorage unavailable (private mode / quota); state stays
    // in-memory and the next session reverts to default. No throw.
  }
}

export function parseStoredQuery(raw: string | null): string {
  if (raw === null) return "";
  // Cap length on read so a hand-edited 10MB value can't lock the input.
  if (raw.length > QUERY_MAX_LEN) return raw.slice(0, QUERY_MAX_LEN);
  return raw;
}

export function readStoredQuery(): string {
  if (typeof window === "undefined") return "";
  try {
    return parseStoredQuery(window.localStorage.getItem(KEY_QUERY));
  } catch {
    return "";
  }
}

export function writeStoredQuery(q: string): void {
  if (typeof window === "undefined") return;
  try {
    if (q.length === 0) {
      // Clear the key entirely when filter is empty — a fresh tab
      // shouldn't see a "0" or empty-string flicker; it should see no
      // entry at all and fall through to default-empty parsing.
      window.localStorage.removeItem(KEY_QUERY);
      return;
    }
    const clamped = q.length > QUERY_MAX_LEN ? q.slice(0, QUERY_MAX_LEN) : q;
    window.localStorage.setItem(KEY_QUERY, clamped);
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// Manual-mode `expanded` set persistence.
//
// Stored as JSON-encoded `string[]`. Returns null on missing / parse
// failure / shape mismatch — caller falls back to "no restore" (an
// empty Set in ElementTree's lazy-init). Caps the parsed length to
// EXPANDED_MAX_ENTRIES on read so a hand-edited 100k-entry value can't
// stall the tree's render loop. `keys` may be a Set or a ReadonlyArray
// — caller picks whichever's convenient.
//
// IMPORTANT: this is intentionally lossy on OID-staleness. A node key
// of `oid:abc12345` for an OID that no longer exists in the current
// tree is silently a no-match in `expanded.has(nodeKey(node))`, so
// stale entries rot harmlessly. The cap prevents unbounded growth from
// add/delete churn over many sessions.
export function parseStoredExpanded(raw: string | null): string[] | null {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    // All entries must be strings — corrupt JSON shapes (objects /
    // numbers / nested arrays) fall through to null. Caller treats
    // null as "no stored state" so the tree starts empty-expanded.
    if (!parsed.every((s) => typeof s === "string")) return null;
    if (parsed.length > EXPANDED_MAX_ENTRIES) {
      return parsed.slice(0, EXPANDED_MAX_ENTRIES);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function serializeStoredExpanded(
  keys: ReadonlyArray<string> | ReadonlySet<string>,
): string {
  const arr = Array.isArray(keys) ? keys : Array.from(keys as ReadonlySet<string>);
  // Cap on serialize too — write-time defense matches read-time so a
  // future deserialize won't surprise with truncation.
  const capped =
    arr.length > EXPANDED_MAX_ENTRIES ? arr.slice(0, EXPANDED_MAX_ENTRIES) : arr;
  return JSON.stringify(capped);
}

export function readStoredExpanded(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    return parseStoredExpanded(window.localStorage.getItem(KEY_EXPANDED));
  } catch {
    return null;
  }
}

export function writeStoredExpanded(
  keys: ReadonlyArray<string> | ReadonlySet<string>,
): void {
  if (typeof window === "undefined") return;
  try {
    // Empty set: clear the entry entirely. A fresh-tab read of an
    // empty-array stored value would return [] (truthy non-null), so
    // the lazy-init path would skip the depth-derived auto-expansion
    // and start the user with literally nothing expanded. Clearing
    // instead lets the read return null, restoring depth-derived
    // expansion as the default for first-time users.
    const len = Array.isArray(keys)
      ? keys.length
      : (keys as ReadonlySet<string>).size;
    if (len === 0) {
      window.localStorage.removeItem(KEY_EXPANDED);
      return;
    }
    window.localStorage.setItem(KEY_EXPANDED, serializeStoredExpanded(keys));
  } catch {
    // localStorage unavailable / quota; in-memory only.
  }
}

// Explicit clear helpers for storage hygiene. Two consumers:
//   1. ElementTree's mode-transition effect calls `clearStoredExpanded`
//      when lastAppliedDepth flips from null → non-null (user enters
//      depth mode). The lazy-init's depth-gate already prevents loading
//      stale entries, but proactive cleanup keeps storage tidy and
//      shrinks the surface for any future schema bugs.
//   2. The Reset button in the tree footer calls
//      `clearAllStoredTreeState` to wipe every dropin:tree:* state key
//      in one shot. Useful when a user has corrupted their persisted
//      state via DevTools or wants a fresh slate.
//
// All single-key clear helpers are SSR-safe and try/catch around
// localStorage access (private mode / quota errors silently no-op).
// `clearAllStoredTreeState` simply composes them.
function clearStoredDepth(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY_DEPTH);
  } catch {}
}

function clearStoredQuery(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY_QUERY);
  } catch {}
}

export function clearStoredExpanded(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY_EXPANDED);
  } catch {}
}

// Audit Domain 5 — internal-only. No external callers; demoted from
// `export`. Composed by `clearAllStoredTreeState` below.
function clearStoredSubtreeDepths(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY_SUBTREE_DEPTHS);
  } catch {}
}

export function clearAllStoredTreeState(): void {
  clearStoredDepth();
  clearStoredQuery();
  clearStoredExpanded();
  clearStoredSubtreeDepths();
}

// Per-OID subtree-depth persistence.
//
// Stored as JSON-encoded `Record<string, number>` mapping a tree row's
// OID → the depth the user picked when last invoking the
// expand-subtree-to-depth action on that row. Replayed on every tree
// push for OIDs that still resolve. Stored object's insertion order
// determines eviction order on FIFO cap (oldest entry dropped). The
// shape is intentionally a plain Record (not Map) so JSON round-trip is
// trivial and the Record's own iteration order (insertion-order in
// modern JS engines per ES2015 spec) is the durable hint.
//
// Validation rules on parse:
//   - Top-level must be a plain object (not array, not null)
//   - Every value must be a finite non-negative integer (depth)
//   - Keys are not validated for OID shape — caller filters against
//     the live tree, so stale or corrupt keys silently miss the lookup
//   - Capped at SUBTREE_DEPTH_MAX_ENTRIES on read AND write
//
// `maxEntries` is an optional override. Defaults to
// SUBTREE_DEPTH_MAX_ENTRIES (50) for backwards compatibility with
// existing benches; the impure read/write helpers resolve the
// user-override value via readEffectiveSubtreeDepthCap() before calling
// these pure helpers.
export function parseStoredSubtreeDepths(
  raw: string | null,
  maxEntries: number = SUBTREE_DEPTH_MAX_ENTRIES,
): Record<string, number> | null {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const out: Record<string, number> = {};
    let count = 0;
    for (const k of Object.keys(parsed)) {
      if (count >= maxEntries) break;
      const v = (parsed as Record<string, unknown>)[k];
      if (typeof v !== "number") continue;
      if (!Number.isFinite(v)) continue;
      if (v < 0) continue;
      out[k] = Math.floor(v);
      count++;
    }
    return out;
  } catch {
    return null;
  }
}

export function serializeStoredSubtreeDepths(
  map: Readonly<Record<string, number>>,
  maxEntries: number = SUBTREE_DEPTH_MAX_ENTRIES,
): string {
  // Cap on serialize too. Object.keys preserves insertion order so the
  // OLDEST entry (smallest insertion index) is dropped on overflow.
  const keys = Object.keys(map);
  if (keys.length <= maxEntries) {
    return JSON.stringify(map);
  }
  const trimmed: Record<string, number> = {};
  // Drop the leading (oldest) entries; keep the most-recent
  // `maxEntries`.
  const startIdx = keys.length - maxEntries;
  for (let i = startIdx; i < keys.length; i++) {
    const k = keys[i];
    trimmed[k] = Math.floor(map[k]);
  }
  return JSON.stringify(trimmed);
}

export function readStoredSubtreeDepths(): Record<string, number> | null {
  if (typeof window === "undefined") return null;
  try {
    const cap = readEffectiveSubtreeDepthCap();
    return parseStoredSubtreeDepths(
      window.localStorage.getItem(KEY_SUBTREE_DEPTHS),
      cap,
    );
  } catch {
    return null;
  }
}

export function writeStoredSubtreeDepths(
  map: Readonly<Record<string, number>>,
): void {
  if (typeof window === "undefined") return;
  try {
    if (Object.keys(map).length === 0) {
      window.localStorage.removeItem(KEY_SUBTREE_DEPTHS);
      return;
    }
    const cap = readEffectiveSubtreeDepthCap();
    window.localStorage.setItem(
      KEY_SUBTREE_DEPTHS,
      serializeStoredSubtreeDepths(map, cap),
    );
  } catch {
    // localStorage unavailable / quota; in-memory only.
  }
}

// Pure helper: insert (or update) an OID → depth mapping while
// preserving FIFO recency semantics. New entries land at the end of
// insertion order; existing keys are removed-then-reinserted so a
// re-set bumps recency. Returns a fresh object (input never mutated).
//
// Capping happens on serialize, not here — keeping merge cheap. The
// merge keeps the input map readable; serialize handles the
// truncation. Two-step is intentional: callers can introspect the
// post-merge map (e.g. for tests or in-memory mirrors) without seeing
// the truncated form.
export function mergeStoredSubtreeDepth(
  prev: Readonly<Record<string, number>>,
  oid: string,
  depth: number,
): Record<string, number> {
  const next: Record<string, number> = {};
  // Copy all entries EXCEPT the one being updated — reinsertion at the
  // end of the new object's insertion order makes this the freshest
  // entry for FIFO cap purposes.
  for (const k of Object.keys(prev)) {
    if (k === oid) continue;
    next[k] = prev[k];
  }
  next[oid] = Math.floor(depth);
  return next;
}

// Schema migration / GC.
//
// Scans `localStorage` for any key starting with `dropin:tree:` whose
// trailing `:vN` suffix doesn't match `STORAGE_SCHEMA_VERSION` and
// removes them. Idempotent — repeated calls are no-ops once the
// migration's run. Safe to call on every mount: when there's nothing
// to migrate it's just one Object.keys + a regex test per matching
// key (and the dropin:tree:* namespace is small enough that this is
// sub-millisecond).
//
// Returns the count of keys removed so callers (or telemetry) can
// detect when migration actually fired vs. a no-op pass.
//
// SSR-safe via the `typeof window` guard. Wraps localStorage access in
// try/catch (private mode / quota); failure returns 0.
export function migrateLegacyStoredTreeState(): number {
  if (typeof window === "undefined") return 0;
  try {
    // Snapshot keys first — mutating localStorage mid-iteration is
    // technically defined (lengths shift) but easy to misread; the
    // array snapshot keeps the loop linear in its size.
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k !== null) keys.push(k);
    }
    let removed = 0;
    for (const key of keys) {
      if (!key.startsWith(KEY_NAMESPACE)) continue;
      const version = parseSchemaVersionFromKey(key);
      // Preserve unversioned legacy keys. The migrator only GCs
      // version-MISMATCHED schema entries; unversioned keys live
      // outside the versioning system entirely (rail-width, future
      // "settings"-shape keys, etc.) and should be left alone.
      if (version === null) continue;
      if (version === STORAGE_SCHEMA_VERSION) continue;
      window.localStorage.removeItem(key);
      removed++;
    }
    return removed;
  } catch {
    return 0;
  }
}

// Pure helper: extract the trailing `:vN` integer from a versioned
// key. Returns null when no suffix or non-integer suffix. Tested via
// bench cases.
export function parseSchemaVersionFromKey(key: string): number | null {
  const m = /:v(\d+)$/.exec(key);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  return n;
}

// Multi-tab synchronization via the browser's `storage` event. The
// event fires in OTHER tabs (not the originating tab) when localStorage
// mutates. Subscribing lets a tab re-read its persisted state when the
// user makes changes in a separate tab — without this, two tabs would
// silently diverge until page reload.
//
// `onChange` receives the changed key (or null on `localStorage.clear()`)
// so the caller can decide whether to re-read state. The callback is
// only invoked for keys in the dropin:tree:* namespace — the listener
// filters first to avoid spurious work for unrelated keys (auth tokens,
// other apps' storage, etc.).
//
// Used by both ElementTree (for tree-state keys) and StorageHealthPanel
// (for panel keys); the namespace filter covers both since panel keys
// also live under dropin:tree:*.
//
// Returns an unsubscribe function. SSR-safe — when window is undefined
// returns a no-op unsubscriber so the caller's cleanup always works.
export function subscribeStoredTreeStateChanges(
  onChange: (key: string | null) => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (e: StorageEvent) => {
    // `e.key === null` happens on `localStorage.clear()` — every key
    // changes, so propagate as a "wipe everything" signal. Otherwise
    // filter to our namespace.
    if (e.key === null) {
      onChange(null);
      return;
    }
    if (!e.key.startsWith(KEY_NAMESPACE)) return;
    onChange(e.key);
  };
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("storage", listener);
  };
}

// Predicate for "no persisted state to reset". Returns true when every
// persisted slice is at its lazy-init default. Used by ElementTree to
// hide the Reset button when there's nothing to reset — first-time
// users never see a "confirm reset of nothing" dead-end. The defaults
// are passed in (rather than imported from this module) so the caller —
// not the persistence layer — owns the "what counts as default"
// decision; this module just compares.
//
// `expanded` is NOT independently checked. When
// `lastAppliedDepth === defaultDepth` the depth re-apply effect in
// ElementTree rebuilds expanded on every tree push, so expanded is
// intrinsically default-derived (and the manual-mode write effect skips
// persisting it in non-manual mode). When `lastAppliedDepth !==
// defaultDepth` the predicate returns false anyway.
//
// Pure — no localStorage / window access. The React caller is
// responsible for sourcing the values from useState; the bench passes
// them directly as args.
export function isStoredTreeStateAtDefaults(args: {
  lastAppliedDepth: number | null;
  defaultDepth: number;
  query: string;
  subtreeDepths: Readonly<Record<string, number>>;
}): boolean {
  if (args.lastAppliedDepth !== args.defaultDepth) return false;
  if (args.query.length > 0) return false;
  if (Object.keys(args.subtreeDepths).length > 0) return false;
  return true;
}

// Storage telemetry — pure, render-deterministic. Computes the
// byte count that WILL be in localStorage once the write effects
// commit, given the current in-memory state. Mirrors the write-side
// gating rules:
//   - Depth: ALWAYS persisted (writeStoredDepth never removes), so
//     contributes KEY_DEPTH.length + serializeStoredDepth(depth).length.
//   - Query: persisted only when non-empty (writeStoredQuery removes
//     the key on empty input). When empty, contributes 0.
//   - Expanded: persisted ONLY in manual mode (lastAppliedDepth ===
//     null) AND when non-empty (writeStoredExpanded removes key on
//     empty). The write effect in ElementTree gates the call itself on
//     lastAppliedDepth === null.
//   - SubtreeDepths: persisted when non-empty
//     (writeStoredSubtreeDepths removes key on empty).
//
// Off-namespace keys (rail-width, tree-open) are intentionally NOT
// counted — they're outside the dropin:tree:* persistence layer this
// helper telemeters.
//
// Computed from in-memory state (not from localStorage), so the
// footer pill renders synchronously without the one-render lag a
// localStorage read would have (write effects commit AFTER render).
//
// Pure: no localStorage / window access. The active subtree-depth cap
// (override-aware) MUST be passed as `args.subtreeDepthCap`; caller
// threads it from React state populated via
// `readEffectiveSubtreeDepthCap()`. Defaults to the static
// `SUBTREE_DEPTH_MAX_ENTRIES` if omitted so benches and ad-hoc callers
// behave predictably without touching localStorage.
export function predictStoredTreeStateBytes(args: {
  lastAppliedDepth: number | null;
  query: string;
  expanded: ReadonlySet<string>;
  subtreeDepths: Readonly<Record<string, number>>;
  subtreeDepthCap?: number;
}): { bytes: number; keyCount: number } {
  let bytes = 0;
  let keyCount = 0;
  // Depth — always written.
  const depthVal = serializeStoredDepth(args.lastAppliedDepth);
  bytes += KEY_DEPTH.length + depthVal.length;
  keyCount++;
  // Query — only when non-empty.
  if (args.query.length > 0) {
    const clamped =
      args.query.length > QUERY_MAX_LEN
        ? args.query.slice(0, QUERY_MAX_LEN)
        : args.query;
    bytes += KEY_QUERY.length + clamped.length;
    keyCount++;
  }
  // Expanded — only in manual mode AND when non-empty.
  if (args.lastAppliedDepth === null && args.expanded.size > 0) {
    // Mirror serializeStoredExpanded's cap at write time.
    const arr = Array.from(args.expanded);
    const capped =
      arr.length > EXPANDED_MAX_ENTRIES ? arr.slice(0, EXPANDED_MAX_ENTRIES) : arr;
    const expandedVal = JSON.stringify(capped);
    bytes += KEY_EXPANDED.length + expandedVal.length;
    keyCount++;
  }
  // Subtree depths — only when non-empty.
  if (Object.keys(args.subtreeDepths).length > 0) {
    const cap = args.subtreeDepthCap ?? SUBTREE_DEPTH_MAX_ENTRIES;
    const sdVal = serializeStoredSubtreeDepths(args.subtreeDepths, cap);
    bytes += KEY_SUBTREE_DEPTHS.length + sdVal.length;
    keyCount++;
  }
  return { bytes, keyCount };
}

// Quota proximity classifier for the storage telemetry pill. The
// dropin:tree:* namespace is bounded (depth + query + expanded +
// subtree-depths, all capped) so total storage rarely exceeds ~16KB
// even for power users. The thresholds chosen here are NOT about the
// 5MB localStorage tab cap (the namespace can't realistically approach
// it); they're a "your persisted state has grown enough to be worth
// noticing" signal so users with degraded localStorage perf can see why.
//
//   "ok"     — under 4KB (most users; default muted text)
//   "warn"   — 4KB–16KB (heavy tree state; coral text)
//   "danger" — 16KB+ (very heavy; coral background + paper text)
//
// The 4KB warn threshold matches the candidate spec ("coral text when
// bytes > 4KB"). The 16KB danger threshold is empirical — past 16KB,
// either the expanded set has rotted with stale OIDs (a Reset would
// help) or the tree itself is unusually large. Either way, the
// stronger visual signal nudges the user to look at it.
//
// Pure — bench-tested for boundary cases (0, just-under, at-threshold,
// just-over, way-over) and corruption (negative, NaN, Infinity).
//
// Accepts optional override thresholds. Power users can adjust via the
// preferences fieldset (or directly via DevTools on
// `dropin:tree:storage-warn-bytes:v1` /
// `dropin:tree:storage-danger-bytes:v1`). Defaults preserve the
// historical behavior exactly. Defensive ordering: if the caller
// passes warnAt >= dangerAt (configuration error or DevTools mishap),
// the danger threshold dominates — anything at-or-above dangerAt
// classifies as "danger", and everything else falls through to "ok"
// (warn is unreachable in that degenerate case). This keeps the
// worst-case signal visible rather than silently demoting it.
const STORAGE_BYTES_WARN_THRESHOLD = 4 * 1024;
const STORAGE_BYTES_DANGER_THRESHOLD = 16 * 1024;

export type StorageBytesSeverity = "ok" | "warn" | "danger";

export function classifyStorageBytes(
  bytes: number,
  options?: { warnAt?: number; dangerAt?: number },
): StorageBytesSeverity {
  if (!Number.isFinite(bytes) || bytes <= 0) return "ok";
  const warnAt = options?.warnAt ?? STORAGE_BYTES_WARN_THRESHOLD;
  const dangerAt = options?.dangerAt ?? STORAGE_BYTES_DANGER_THRESHOLD;
  if (bytes >= dangerAt) return "danger";
  // When warnAt >= dangerAt (degenerate config), warn is unreachable.
  // We've already returned "danger" for bytes >= dangerAt, so any
  // remaining bytes must be < dangerAt. The next gate ensures we don't
  // mis-classify bytes in the [warnAt, dangerAt) range as "warn" when
  // the user has set warnAt above dangerAt — they go to "ok" instead.
  if (warnAt < dangerAt && bytes >= warnAt) return "warn";
  return "ok";
}

// Pure helper: format a byte count for the storage telemetry pill.
// Returns "0 B" for zero, "<N> B" for under 1KB, "<N.N>K" for KB. No
// MB tier — dropin:tree:* never approaches 1MB (caps at ~50KB for the
// largest realistic tree state), so the K tier is the only step needed.
// Bench-tested for the boundary cases.
export function formatStoredBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.floor(bytes)} B`;
  // Two-decimal-place K, trimmed of trailing zeros (e.g. "1.5K" not
  // "1.50K", "12K" not "12.00K"). The formatter rounds to 2 dp first
  // so ` 12345 / 1024 → 12.0556... → "12.06" → "12.06K"` becomes
  // "12.06K" not "12.05K".
  const k = bytes / 1024;
  const rounded = Math.round(k * 100) / 100;
  // Strip trailing zeros: 1.50 → "1.5", 12.00 → "12".
  const str = rounded.toFixed(2).replace(/\.?0+$/, "");
  return `${str}K`;
}

// User-overridable subtree-depth cap. SUBTREE_DEPTH_MAX_ENTRIES is the
// build-time default (50). Power users with massive trees can override
// via a localStorage key `dropin:tree:cap-subtree-depths:v1` to anything
// in [10, 5000]. Below the floor falls back to the floor; above the
// ceiling clamps to the ceiling. The override is read on every parse /
// serialize, so changing the value via DevTools takes effect on the
// next tree push.
const SUBTREE_DEPTH_CAP_USER_OVERRIDE_KEY = versionedKey(
  "cap-subtree-depths",
);
const SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN = 10;
const SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX = 5000;

// Pure: parses a stringified cap value into a clamped integer.
// Validation rules:
//   - null / non-numeric / NaN / Infinity / negative → fallback (default cap)
//   - below min → clamp up to min
//   - above max → clamp down to max
//   - fractional → floor
// Bench-tested for boundary + corruption cases.
export function parseSubtreeDepthCapOverride(
  raw: string | null,
  fallback: number,
): number {
  if (raw === null) return fallback;
  if (raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  if (n < 0) return fallback;
  const floored = Math.floor(n);
  if (floored < SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN) {
    return SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN;
  }
  if (floored > SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX) {
    return SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX;
  }
  return floored;
}

// Read the effective cap. Returns SUBTREE_DEPTH_MAX_ENTRIES when no
// override is set or storage is unavailable; otherwise the clamped
// override value. SSR-safe + try/catch.
export function readEffectiveSubtreeDepthCap(): number {
  if (typeof window === "undefined") return SUBTREE_DEPTH_MAX_ENTRIES;
  try {
    return parseSubtreeDepthCapOverride(
      window.localStorage.getItem(SUBTREE_DEPTH_CAP_USER_OVERRIDE_KEY),
      SUBTREE_DEPTH_MAX_ENTRIES,
    );
  } catch {
    return SUBTREE_DEPTH_MAX_ENTRIES;
  }
}

// Writer for the cap-override key. Was DevTools-only originally; the
// preferences UI surfaces it inside the debug panel as a number input.
// The writer accepts any number; the parser does the clamping on read
// so even a hand-edited out-of-range value resolves correctly. Passing
// `null` (or the build-time default) removes the key entirely so a
// fresh tab reads the canonical default rather than a redundant
// explicit entry.
export function writeSubtreeDepthCapOverride(value: number | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null || value === SUBTREE_DEPTH_MAX_ENTRIES) {
      window.localStorage.removeItem(SUBTREE_DEPTH_CAP_USER_OVERRIDE_KEY);
      return;
    }
    if (!Number.isFinite(value) || value < 0) return;
    window.localStorage.setItem(
      SUBTREE_DEPTH_CAP_USER_OVERRIDE_KEY,
      String(Math.floor(value)),
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// User-overridable storage telemetry thresholds.
// STORAGE_BYTES_WARN_THRESHOLD (4KB) and STORAGE_BYTES_DANGER_THRESHOLD
// (16KB) are build-time defaults. Power users with degraded
// localStorage perf or unusually large trees might want to nudge the
// warn point down (alert sooner) or the danger point up (lots of
// intentional state). Persisted via the
// `dropin:tree:storage-warn-bytes:v1` and
// `dropin:tree:storage-danger-bytes:v1` localStorage keys.
//
// Bounds: [256, 1MB] — below 256B the pill would always show warn for
// even a fresh tree; above 1MB it'd never trigger since dropin:tree:*
// realistically caps at ~50KB. Below the floor clamps to floor; above
// the ceiling clamps to ceiling. NaN/Infinity/negative → fallback
// (build-time default).
//
// IMPORTANT: this module does NOT enforce warn < danger consistency
// at write time. The classifier (`classifyStorageBytes`) handles the
// degenerate warn >= danger case defensively (warn becomes
// unreachable; danger still works). Forcing consistency at write time
// would require either coupling the two writes or rejecting one
// pre-emptively — both add complexity for a power-user knob that the
// classifier already absorbs.
const STORAGE_WARN_BYTES_USER_OVERRIDE_KEY = versionedKey("storage-warn-bytes");
const STORAGE_DANGER_BYTES_USER_OVERRIDE_KEY = versionedKey(
  "storage-danger-bytes",
);
const STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN = 256;
const STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX = 1024 * 1024;

// Pure: parses a stringified threshold value into a clamped integer.
// Validation rules:
//   - null / non-numeric / NaN / Infinity / negative → fallback
//   - below min → clamp up to min
//   - above max → clamp down to max
//   - fractional → floor
export function parseStorageBytesThresholdOverride(
  raw: string | null,
  fallback: number,
): number {
  if (raw === null) return fallback;
  if (raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  if (n < 0) return fallback;
  const floored = Math.floor(n);
  if (floored < STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN) {
    return STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN;
  }
  if (floored > STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX) {
    return STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX;
  }
  return floored;
}

export function readEffectiveStorageWarnBytes(): number {
  if (typeof window === "undefined") return STORAGE_BYTES_WARN_THRESHOLD;
  try {
    return parseStorageBytesThresholdOverride(
      window.localStorage.getItem(STORAGE_WARN_BYTES_USER_OVERRIDE_KEY),
      STORAGE_BYTES_WARN_THRESHOLD,
    );
  } catch {
    return STORAGE_BYTES_WARN_THRESHOLD;
  }
}

export function readEffectiveStorageDangerBytes(): number {
  if (typeof window === "undefined") return STORAGE_BYTES_DANGER_THRESHOLD;
  try {
    return parseStorageBytesThresholdOverride(
      window.localStorage.getItem(STORAGE_DANGER_BYTES_USER_OVERRIDE_KEY),
      STORAGE_BYTES_DANGER_THRESHOLD,
    );
  } catch {
    return STORAGE_BYTES_DANGER_THRESHOLD;
  }
}

export function writeStorageWarnBytesOverride(value: number | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null || value === STORAGE_BYTES_WARN_THRESHOLD) {
      window.localStorage.removeItem(STORAGE_WARN_BYTES_USER_OVERRIDE_KEY);
      return;
    }
    if (!Number.isFinite(value) || value < 0) return;
    window.localStorage.setItem(
      STORAGE_WARN_BYTES_USER_OVERRIDE_KEY,
      String(Math.floor(value)),
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

export function writeStorageDangerBytesOverride(value: number | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null || value === STORAGE_BYTES_DANGER_THRESHOLD) {
      window.localStorage.removeItem(STORAGE_DANGER_BYTES_USER_OVERRIDE_KEY);
      return;
    }
    if (!Number.isFinite(value) || value < 0) return;
    window.localStorage.setItem(
      STORAGE_DANGER_BYTES_USER_OVERRIDE_KEY,
      String(Math.floor(value)),
    );
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// Drag-ghost label format preference.
//
// The buildDragGhostLabel helper (in components/ElementTree.tsx) emits
// `<tag> · N` for multi-drag and `<tag>` for single. Power users who
// run heavy multi-element drags often want to suppress the count
// suffix (the tag alone reads cleaner; the count is already
// discoverable via the dot indicator + the row's own selection state).
// This preference is persisted via localStorage
// `dropin:tree:drag-ghost-format:v1` so a one-time set survives
// reloads.
//
// Values:
//   "with-count"  — default; `<tag>` for single, `<tag> · N` for multi
//   "no-count"    — `<tag>` for both single and multi (tag-only)
//   "count-only"  — `1` for single, `N` for multi (numeric-only — for
//                   users who'd rather see a count badge sans tag)
const DRAG_GHOST_FORMAT_KEY = versionedKey("drag-ghost-format");

export type DragGhostFormat = "with-count" | "no-count" | "count-only";
const DRAG_GHOST_FORMAT_DEFAULT: DragGhostFormat = "with-count";

// Pure: validates a stored format string against the enum. Anything
// outside the three legal values falls back to "with-count".
// Audit Domain 5 — internal-only parser; consumed by readStored* below.
function parseDragGhostFormat(raw: string | null): DragGhostFormat {
  if (raw === "with-count") return "with-count";
  if (raw === "no-count") return "no-count";
  if (raw === "count-only") return "count-only";
  return DRAG_GHOST_FORMAT_DEFAULT;
}

export function readStoredDragGhostFormat(): DragGhostFormat {
  if (typeof window === "undefined") return DRAG_GHOST_FORMAT_DEFAULT;
  try {
    return parseDragGhostFormat(
      window.localStorage.getItem(DRAG_GHOST_FORMAT_KEY),
    );
  } catch {
    return DRAG_GHOST_FORMAT_DEFAULT;
  }
}

export function writeStoredDragGhostFormat(format: DragGhostFormat): void {
  if (typeof window === "undefined") return;
  try {
    if (format === DRAG_GHOST_FORMAT_DEFAULT) {
      // Default → remove the key so a fresh tab reads the canonical
      // default rather than a redundant explicit "with-count" entry.
      window.localStorage.removeItem(DRAG_GHOST_FORMAT_KEY);
      return;
    }
    window.localStorage.setItem(DRAG_GHOST_FORMAT_KEY, format);
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// Pure helper — applies a format preference to the
// `<tag>` / `<tag> · N` / numeric-only / fallback combinations
// produced by buildDragGhostLabel's tag+count logic. Centralized so
// tests can lock the format-vs-output mapping without depending on
// React state shape.
//
// Inputs are the result of buildDragGhostLabel's tag-resolution:
//   tag       — the resolved primary tag (e.g. "div"), or null when
//               unresolved (mid-drag tree mutation, missing oid)
//   setSize   — the multi-drag count (>= 1 in practice; 0/negative
//               folded to 1 by buildDragGhostLabel itself)
//   format    — one of the three DragGhostFormat values
//
// Output mirrors buildDragGhostLabel's existing strings for the
// "with-count" path so a default-preference user sees no change.
export function applyDragGhostFormat(
  tag: string | null,
  setSize: number,
  format: DragGhostFormat,
): string {
  const isMulti = setSize > 1;
  if (format === "count-only") {
    return isMulti ? `${setSize}` : "1";
  }
  if (format === "no-count") {
    return tag ? `<${tag}>` : isMulti ? `${setSize} elements` : "1 element";
  }
  // "with-count" (default) — preserves the historical strings exactly.
  if (!isMulti) {
    return tag ? `<${tag}>` : "1 element";
  }
  return tag ? `<${tag}> · ${setSize}` : `${setSize} elements`;
}

// Storage health entries enumerator.
//
// Power-user / debug affordance: shows every dropin:tree:* key + its
// raw value + its byte cost in one place, so a user investigating
// runaway storage growth can see what's there without DevTools. The
// enumeration is split into a pure helper (`describeStoredTreeStateEntries`,
// taking a list of [key, value] pairs) + an impure wrapper
// (`listStoredTreeStateEntries`, walking live localStorage). The pure
// helper is bench-testable; the impure wrapper just adapts.
//
// Returned shape:
//   {
//     key: "dropin:tree:depth:v1",
//     value: "3",
//     bytes: 23,           // key.length + value.length (raw character count)
//   }
//
// Sorted by descending byte cost so the heavyweight entries (typically
// the expanded set) sit at the top of the panel.
export interface StoredTreeStateEntry {
  key: string;
  value: string;
  bytes: number;
}

// Audit Domain 5 — internal helper. No external callers; demoted from
// `export` so a future refactor can rename without breaking an import
// somewhere we can't grep.
function describeStoredTreeStateEntries(
  entries: ReadonlyArray<readonly [string, string]>,
): StoredTreeStateEntry[] {
  const out: StoredTreeStateEntry[] = [];
  for (const [k, v] of entries) {
    if (!k.startsWith(KEY_NAMESPACE)) continue;
    out.push({ key: k, value: v, bytes: k.length + v.length });
  }
  // Sort by descending byte cost. Tie-break alphabetically by key for
  // deterministic ordering (matters for tests + UI snapshot stability).
  out.sort((a, b) => {
    if (a.bytes !== b.bytes) return b.bytes - a.bytes;
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
  return out;
}

export function listStoredTreeStateEntries(): StoredTreeStateEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const pairs: Array<readonly [string, string]> = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k === null) continue;
      const v = window.localStorage.getItem(k);
      // value can be null only if the key was removed mid-iteration
      // (e.g. by another tab); skip the contribution.
      if (v === null) continue;
      pairs.push([k, v]);
    }
    return describeStoredTreeStateEntries(pairs);
  } catch {
    return [];
  }
}

// Pure helper: classify an entry's key into a friendly short name for
// the debug panel. Returns the trailing segment after KEY_NAMESPACE
// minus the version suffix (or the full segment if unversioned). E.g.
// "dropin:tree:depth:v1" → "depth", "dropin:tree:width" → "width",
// "dropin:tree:cap-subtree-depths:v1" → "cap-subtree-depths". Used by
// the debug panel UI; broken out for bench coverage.
export function shortNameForStoredKey(key: string): string {
  if (!key.startsWith(KEY_NAMESPACE)) return key;
  const tail = key.slice(KEY_NAMESPACE.length);
  // Strip trailing :vN if present.
  const m = /^(.+):v\d+$/.exec(tail);
  return m ? m[1] : tail;
}

// Broaden the debug panel scope. The default panel view shows only
// `dropin:tree:*` keys; a power user investigating quota issues across
// the whole app needs to see EVERY localStorage entry. This helper
// categorizes:
//
//   "tree"   — exact `dropin:tree:*` namespace
//   "dropin" — other `dropin:*` keys (e.g. `dropin:tour-completed-v2`)
//   "other"  — everything else (auth tokens, third-party libs, etc.)
//
// The panel toggle flips between "tree-only" (default) and "all" view.
// Pure helper; the impure walker (`listAllStoredEntries`) wraps the
// live localStorage scan.
export type StoredEntryCategory = "tree" | "dropin" | "other";

export interface StoredEntryCategorized extends StoredTreeStateEntry {
  category: StoredEntryCategory;
}

export function categorizeStoredKey(key: string): StoredEntryCategory {
  if (key.startsWith(KEY_NAMESPACE)) return "tree";
  if (key.startsWith("dropin:")) return "dropin";
  return "other";
}

// Audit Domain 5 — internal helper. No external callers; demoted from
// `export` for the same reason as `describeStoredTreeStateEntries`.
function describeAllStoredEntries(
  entries: ReadonlyArray<readonly [string, string]>,
): StoredEntryCategorized[] {
  const out: StoredEntryCategorized[] = [];
  for (const [k, v] of entries) {
    out.push({
      key: k,
      value: v,
      bytes: k.length + v.length,
      category: categorizeStoredKey(k),
    });
  }
  // Same sort as describeStoredTreeStateEntries — descending bytes
  // with alphabetic tie-break. Categories are NOT used for grouping
  // here; the UI applies a small badge per row instead.
  out.sort((a, b) => {
    if (a.bytes !== b.bytes) return b.bytes - a.bytes;
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
  return out;
}

export function listAllStoredEntries(): StoredEntryCategorized[] {
  if (typeof window === "undefined") return [];
  try {
    const pairs: Array<readonly [string, string]> = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k === null) continue;
      const v = window.localStorage.getItem(k);
      if (v === null) continue;
      pairs.push([k, v]);
    }
    return describeAllStoredEntries(pairs);
  } catch {
    return [];
  }
}

// Wipe ONLY the tree-side preference keys (subtree-depth cap, byte
// thresholds, drag-ghost format). Symmetric counterpart to
// `clearAllStoredStoragePanelPreferences` in `lib/storage-panel.ts` —
// that one wipes panel-side prefs; this one wipes tree-side prefs.
// Callers that want to wipe both call both. State (depth, query,
// expanded, subtree-depths) is left alone — `clearAllStoredTreeState`
// covers that.
//
// "Preference" here is defined as a power-user knob that doesn't
// reflect the current tree's mode/filter/expansion — i.e. the
// drag-ghost format, cap-override, warn/danger thresholds. These are
// safe to wipe back to defaults without disrupting the user's
// in-progress tree work.
export function clearAllStoredTreePreferences(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SUBTREE_DEPTH_CAP_USER_OVERRIDE_KEY);
    window.localStorage.removeItem(STORAGE_WARN_BYTES_USER_OVERRIDE_KEY);
    window.localStorage.removeItem(STORAGE_DANGER_BYTES_USER_OVERRIDE_KEY);
    window.localStorage.removeItem(DRAG_GHOST_FORMAT_KEY);
  } catch {
    // localStorage unavailable; in-memory only.
  }
}

// Constants exported for the bench (locks the cap value + key names).
// Panel-side constants live in STORAGE_PANEL_CONSTANTS in
// `lib/storage-panel.ts`.
export const TREE_PERSISTENCE_CONSTANTS = {
  QUERY_MAX_LEN,
  EXPANDED_MAX_ENTRIES,
  SUBTREE_DEPTH_MAX_ENTRIES,
  STORAGE_SCHEMA_VERSION,
  KEY_NAMESPACE,
  KEY_DEPTH,
  KEY_QUERY,
  KEY_EXPANDED,
  KEY_SUBTREE_DEPTHS,
  SUBTREE_DEPTH_CAP_USER_OVERRIDE_KEY,
  SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN,
  SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX,
  STORAGE_BYTES_WARN_THRESHOLD,
  STORAGE_BYTES_DANGER_THRESHOLD,
  STORAGE_WARN_BYTES_USER_OVERRIDE_KEY,
  STORAGE_DANGER_BYTES_USER_OVERRIDE_KEY,
  STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN,
  STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX,
  DRAG_GHOST_FORMAT_KEY,
  DRAG_GHOST_FORMAT_DEFAULT,
} as const;
