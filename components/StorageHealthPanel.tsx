"use client";

// Storage health debug panel — power-user / debug surface anchored
// above the ElementTree footer's storage telemetry pill. Lists every
// localStorage entry (scoped to `dropin:tree:*` by default, or every
// origin key when broadened) with byte cost, supports search /
// filter / sort / per-key edit / per-key delete / export-as-JSON /
// import-restore-state-only / pinned-snapshot diff vs. live, plus
// preference knobs (drag-ghost label format, subtree-depth cap, pill
// thresholds, value truncation, category collapse).
//
// Owns its own scope/sort/filter/collapse/snapshot/import/edit state
// and reads localStorage entries directly via
// `listStoredTreeStateEntries` / `listAllStoredEntries`. The parent
// (ElementTree) owns the open/close state and the tree-side preference
// state that this panel renders editing controls for; those four prefs
// (subtreeDepthCap, storageWarnBytes, storageDangerBytes,
// dragGhostFormat) are passed in + back out via callback props so the
// footer telemetry pill, tree DnD ghost, and other tree-side
// consumers see the same values.
//
// Keyboard shortcuts that activate when the panel is open:
//   Esc — close
//   t   — switch scope to tree-only
//   a   — switch scope to all keys
//   f   — focus the filter input
// (The `g` toggle lives in ElementTree's onTreeKeyDown handler.)

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  subscribeStoredTreeStateChanges,
  formatStoredBytes,
  type DragGhostFormat,
  listStoredTreeStateEntries,
  listAllStoredEntries,
  shortNameForStoredKey,
  type StoredTreeStateEntry,
  type StoredEntryCategorized,
  TREE_PERSISTENCE_CONSTANTS,
} from "@/lib/tree-persistence";
import {
  readStoredStoragePanelScope,
  writeStoredStoragePanelScope,
  type StoragePanelScope,
  summarizeStoredEntriesByCategory,
  filterStoredEntries,
  sortStoredEntries,
  readStoredStoragePanelSort,
  writeStoredStoragePanelSort,
  type StoragePanelSort,
  readStoredStoragePanelFilter,
  writeStoredStoragePanelFilter,
  splitOnMatchedSubstring,
  readStoredStoragePanelCollapsedOther,
  writeStoredStoragePanelCollapsedOther,
  buildStoragePanelExport,
  serializeStoragePanelExport,
  type StoragePanelExportMetadata,
  parseStoragePanelExportJsonDetail,
  type StoragePanelExportParseResult,
  readStoredStoragePanelExportFilename,
  writeStoredStoragePanelExportFilename,
  sanitizeStoragePanelExportFilename,
  readStoredStoragePanelPrettyPrint,
  writeStoredStoragePanelPrettyPrint,
  tryFormatJsonValue,
  readStoredStoragePanelHideValues,
  writeStoredStoragePanelHideValues,
  readEffectiveStoragePanelValueTruncation,
  writeStoragePanelValueTruncationOverride,
  partitionAllEntriesByCategoryCollapse,
  readStoredStoragePanelCollapsedTree,
  writeStoredStoragePanelCollapsedTree,
  readStoredStoragePanelCollapsedDropin,
  writeStoredStoragePanelCollapsedDropin,
  readStoredStoragePanelFilterHistory,
  writeStoredStoragePanelFilterHistory,
  appendStoragePanelFilterHistoryEntry,
  readStoredStoragePanelRecentImports,
  writeStoredStoragePanelRecentImports,
  appendStoragePanelRecentImportEntry,
  type StoragePanelRecentImport,
  readStoredStoragePanelRecentImportsSort,
  writeStoredStoragePanelRecentImportsSort,
  sortStoragePanelRecentImports,
  type StoragePanelRecentImportsSort,
  encodeStoragePanelStateQuery,
  decodeStoragePanelStateQuery,
  readStoredStoragePanelSnapshot,
  writeStoredStoragePanelSnapshot,
  buildStoragePanelSnapshot,
  diffStoredEntriesAgainstSnapshot,
  type StoragePanelSnapshot,
  removeSingleStoredKey,
  setSingleStoredKeyValue,
  readStoredStoragePanelFilterMode,
  writeStoredStoragePanelFilterMode,
  type StoragePanelFilterMode,
  tryCompileFilterRegex,
  filterStoredEntriesByRegex,
  splitOnMatchedRegex,
  tryCompileFilterRegexDetail,
  clearAllStoredStoragePanelPreferences,
  STORAGE_PANEL_CONSTANTS,
} from "@/lib/storage-panel";

// Build-time inlined by Next.js via tsconfig's resolveJsonModule.
// The panel's export-as-JSON includes appVersion in metadata so a
// recipient knows which Dropin release produced the snapshot.
import dropinPackageJson from "@/package.json";
const DROPIN_APP_VERSION: string =
  typeof dropinPackageJson === "object" &&
  dropinPackageJson !== null &&
  typeof (dropinPackageJson as { version?: unknown }).version === "string"
    ? (dropinPackageJson as { version: string }).version
    : "0.0.0";

export interface StorageHealthPanelProps {
  open: boolean;
  onClose: () => void;
  // Tree-side prefs displayed + edited in the panel UI but owned by
  // the parent (ElementTree) so the footer telemetry pill, tree DnD
  // ghost, and subtree-depth replay see the same values.
  subtreeDepthCap: number;
  onSubtreeDepthCapChange: (cap: number | null) => void;
  storageWarnBytes: number;
  onStorageWarnBytesChange: (bytes: number | null) => void;
  storageDangerBytes: number;
  onStorageDangerBytesChange: (bytes: number | null) => void;
  dragGhostFormat: DragGhostFormat;
  onDragGhostFormatChange: (fmt: DragGhostFormat) => void;
  // Wipe-prefs button resets BOTH the panel's internal prefs AND the
  // tree-side prefs above. The panel calls this to fan out the
  // tree-side resets; the panel handles its own internal reset
  // locally.
  onWipeTreePrefs: () => void;
  // Audit MED (Domain 4) — clipboard rejection silent-failure parity
  // with the 2026-05-04 audit's Workspace.tsx fix. Both copy handlers
  // (`handleCopyStoragePanel`, `handleCopyStoragePanelPresetUrl`) used
  // to silently no-op on clipboard rejection (permission denied, older
  // browsers, locked tab focus). Now they surface via `onWarn` so the
  // user has signal that the copy didn't land. Optional so existing
  // callers without the wire still compile.
  onWarn?: (msg: string) => void;
}

export default function StorageHealthPanel({
  open,
  onClose,
  subtreeDepthCap,
  onSubtreeDepthCapChange,
  storageWarnBytes,
  onStorageWarnBytesChange,
  storageDangerBytes,
  onStorageDangerBytesChange,
  dragGhostFormat,
  onDragGhostFormatChange,
  onWipeTreePrefs,
  onWarn,
}: StorageHealthPanelProps) {
  const [storageHealthEntries, setStorageHealthEntries] = useState<
    StoredTreeStateEntry[]
  >([]);
  const [storageHealthAllEntries, setStorageHealthAllEntries] = useState<
    StoredEntryCategorized[]
  >([]);
  // Panel scope: "tree" = only `dropin:tree:*` keys; "all" = every
  // localStorage entry, categorized.
  const [storageHealthScope, setStorageHealthScope] = useState<
    StoragePanelScope
  >(() => readStoredStoragePanelScope());
  const handleSetStorageHealthScope = useCallback(
    (scope: StoragePanelScope) => {
      setStorageHealthScope(scope);
      writeStoredStoragePanelScope(scope);
    },
    [],
  );
  // Substring filter — case-insensitive match against either key OR
  // value (filterStoredEntries semantics). Empty string disables.
  const [storageHealthFilter, setStorageHealthFilter] = useState<string>(
    () => readStoredStoragePanelFilter(),
  );
  const handleSetStorageHealthFilter = useCallback((filter: string) => {
    setStorageHealthFilter(filter);
    writeStoredStoragePanelFilter(filter);
  }, []);
  // Persisted recent search history (max 8, case-folded dedupe).
  const [storagePanelFilterHistory, setStoragePanelFilterHistory] = useState<
    string[]
  >(() => readStoredStoragePanelFilterHistory());
  const commitStoragePanelFilterHistory = useCallback((query: string) => {
    setStoragePanelFilterHistory((prev) => {
      const next = appendStoragePanelFilterHistoryEntry(prev, query);
      writeStoredStoragePanelFilterHistory(next);
      return next;
    });
  }, []);
  const handleClearStoragePanelFilterHistory = useCallback(() => {
    setStoragePanelFilterHistory([]);
    writeStoredStoragePanelFilterHistory([]);
  }, []);
  // Filter mode toggle — substring vs regex. Invalid regex falls
  // back to substring match silently so a half-typed regex doesn't
  // blank the entries list.
  const [storagePanelFilterMode, setStoragePanelFilterMode] = useState<
    StoragePanelFilterMode
  >(() => readStoredStoragePanelFilterMode());
  const handleSetStoragePanelFilterMode = useCallback(
    (mode: StoragePanelFilterMode) => {
      setStoragePanelFilterMode(mode);
      writeStoredStoragePanelFilterMode(mode);
    },
    [],
  );
  const storagePanelFilterRegex = useMemo<RegExp | null>(() => {
    if (storagePanelFilterMode !== "regex") return null;
    return tryCompileFilterRegex(storageHealthFilter);
  }, [storageHealthFilter, storagePanelFilterMode]);
  // Detailed compile result for the inline reason hint when a regex
  // fails to compile.
  const storagePanelFilterRegexDetail = useMemo(() => {
    if (storagePanelFilterMode !== "regex") return null;
    return tryCompileFilterRegexDetail(storageHealthFilter);
  }, [storageHealthFilter, storagePanelFilterMode]);
  // Persisted recent imports list (max 5). Stores ONLY panel-state +
  // entry-count summary so the import is re-applicable as a lens; the
  // entries themselves stay outside the persistence boundary.
  const [storagePanelRecentImports, setStoragePanelRecentImports] = useState<
    StoragePanelRecentImport[]
  >(() => readStoredStoragePanelRecentImports());
  const handleClearStoragePanelRecentImports = useCallback(() => {
    setStoragePanelRecentImports([]);
    writeStoredStoragePanelRecentImports([]);
  }, []);
  // Recent-imports sort: "insertion" (most-recent first, default) or
  // "added-desc" (by addedAt then exportedAt desc).
  const [storagePanelRecentImportsSort, setStoragePanelRecentImportsSort] =
    useState<StoragePanelRecentImportsSort>(() =>
      readStoredStoragePanelRecentImportsSort(),
    );
  const handleSetStoragePanelRecentImportsSort = useCallback(
    (sort: StoragePanelRecentImportsSort) => {
      setStoragePanelRecentImportsSort(sort);
      writeStoredStoragePanelRecentImportsSort(sort);
    },
    [],
  );
  const sortedStoragePanelRecentImports = useMemo(
    () =>
      sortStoragePanelRecentImports(
        storagePanelRecentImports,
        storagePanelRecentImportsSort,
      ),
    [storagePanelRecentImports, storagePanelRecentImportsSort],
  );
  // Per-key delete: two-step inline confirm. Pending key auto-disarms
  // after 4s.
  const [storagePanelPendingDeleteKey, setStoragePanelPendingDeleteKey] =
    useState<string | null>(null);
  const storagePanelDeleteDisarmTimerRef = useRef<number | null>(null);
  // Countdown bar inside the armed "delete?" pill drains 100% → 0%
  // width over 4s linear. The ref points at a thin <span> at the
  // bottom edge of the armed button.
  const storagePanelDeleteCountdownRef = useRef<HTMLSpanElement | null>(null);
  // Per-key edit state — mutually exclusive with pending delete.
  const [storagePanelEditingKey, setStoragePanelEditingKey] = useState<
    string | null
  >(null);
  const [storagePanelEditDraft, setStoragePanelEditDraft] =
    useState<string>("");
  const armStoragePanelDelete = useCallback((key: string) => {
    // Arming delete cancels any in-progress edit so the mutation
    // surface stays single-headed.
    setStoragePanelEditingKey(null);
    setStoragePanelEditDraft("");
    setStoragePanelPendingDeleteKey(key);
    if (storagePanelDeleteDisarmTimerRef.current !== null) {
      if (typeof window !== "undefined") {
        window.clearTimeout(storagePanelDeleteDisarmTimerRef.current);
      }
    }
    if (typeof window !== "undefined") {
      storagePanelDeleteDisarmTimerRef.current = window.setTimeout(() => {
        setStoragePanelPendingDeleteKey(null);
        storagePanelDeleteDisarmTimerRef.current = null;
      }, 4000);
    }
  }, []);
  const disarmStoragePanelDelete = useCallback(() => {
    setStoragePanelPendingDeleteKey(null);
    if (storagePanelDeleteDisarmTimerRef.current !== null) {
      if (typeof window !== "undefined") {
        window.clearTimeout(storagePanelDeleteDisarmTimerRef.current);
      }
      storagePanelDeleteDisarmTimerRef.current = null;
    }
  }, []);
  const handleConfirmDeleteStoragePanelKey = useCallback(
    (key: string) => {
      const ok = removeSingleStoredKey(key);
      disarmStoragePanelDelete();
      if (!ok) return;
      // Same-tab refresh — StorageEvent only fires cross-tab.
      setStorageHealthEntries(listStoredTreeStateEntries());
      setStorageHealthAllEntries(listAllStoredEntries());
    },
    [disarmStoragePanelDelete],
  );
  // Cleanup pending timer on unmount.
  useEffect(() => {
    return () => {
      if (storagePanelDeleteDisarmTimerRef.current !== null) {
        if (typeof window !== "undefined") {
          window.clearTimeout(storagePanelDeleteDisarmTimerRef.current);
        }
      }
    };
  }, []);
  const beginStoragePanelEdit = useCallback(
    (key: string, currentValue: string) => {
      // Cancel any pending delete first — single mutation surface.
      setStoragePanelPendingDeleteKey(null);
      if (storagePanelDeleteDisarmTimerRef.current !== null) {
        if (typeof window !== "undefined") {
          window.clearTimeout(storagePanelDeleteDisarmTimerRef.current);
        }
        storagePanelDeleteDisarmTimerRef.current = null;
      }
      setStoragePanelEditingKey(key);
      setStoragePanelEditDraft(currentValue);
    },
    [],
  );
  const cancelStoragePanelEdit = useCallback(() => {
    setStoragePanelEditingKey(null);
    setStoragePanelEditDraft("");
  }, []);
  const handleSaveStoragePanelEdit = useCallback(
    (key: string) => {
      const ok = setSingleStoredKeyValue(key, storagePanelEditDraft);
      if (!ok) return;
      setStorageHealthEntries(listStoredTreeStateEntries());
      setStorageHealthAllEntries(listAllStoredEntries());
      setStoragePanelEditingKey(null);
      setStoragePanelEditDraft("");
    },
    [storagePanelEditDraft],
  );
  // Drive the countdown bar from 100% → 0% width over 4s linear once
  // a row is armed. The requestAnimationFrame defer ensures the
  // initial 100% width is committed to the layout tree before the 0%
  // transition kicks in; without it React commits both widths in the
  // same paint and the browser collapses to no animation.
  useEffect(() => {
    if (storagePanelPendingDeleteKey === null) return;
    if (typeof window === "undefined") return;
    const el = storagePanelDeleteCountdownRef.current;
    if (el === null) return;
    el.style.transition = "none";
    el.style.width = "100%";
    const handle = window.requestAnimationFrame(() => {
      const now = storagePanelDeleteCountdownRef.current;
      if (now !== el) return;
      el.style.transition = "width 4s linear";
      el.style.width = "0%";
    });
    return () => {
      window.cancelAnimationFrame(handle);
    };
  }, [storagePanelPendingDeleteKey]);
  // Collapse the "other" category in the broadened "all" view by
  // default. Power users investigating dropin storage usually don't
  // care about third-party libs / auth tokens taking up space outside
  // the dropin:* namespace.
  const [storageHealthCollapsedOther, setStorageHealthCollapsedOther] =
    useState<boolean>(() => readStoredStoragePanelCollapsedOther());
  const handleSetStorageHealthCollapsedOther = useCallback(
    (collapsed: boolean) => {
      setStorageHealthCollapsedOther(collapsed);
      writeStoredStoragePanelCollapsedOther(collapsed);
    },
    [],
  );
  // Custom export filename prefix. Runtime filename is
  // `${prefix}-${Date.now()}.json`. Sanitization mirrors writer
  // semantics so the rendered input shows the post-sanitize value.
  const [storagePanelExportFilename, setStoragePanelExportFilename] =
    useState<string>(() => readStoredStoragePanelExportFilename());
  const handleSetStoragePanelExportFilename = useCallback((name: string) => {
    const sanitized = sanitizeStoragePanelExportFilename(name);
    setStoragePanelExportFilename(sanitized);
    writeStoredStoragePanelExportFilename(sanitized);
  }, []);
  // Pretty-print JSON-parseable values in panel rows.
  const [storagePanelPrettyPrint, setStoragePanelPrettyPrint] =
    useState<boolean>(() => readStoredStoragePanelPrettyPrint());
  const handleSetStoragePanelPrettyPrint = useCallback((pretty: boolean) => {
    setStoragePanelPrettyPrint(pretty);
    writeStoredStoragePanelPrettyPrint(pretty);
  }, []);
  // Hide the value column entirely.
  const [storagePanelHideValues, setStoragePanelHideValues] =
    useState<boolean>(() => readStoredStoragePanelHideValues());
  const handleSetStoragePanelHideValues = useCallback((hidden: boolean) => {
    setStoragePanelHideValues(hidden);
    writeStoredStoragePanelHideValues(hidden);
  }, []);
  // Import JSON textarea + restore status. Restore is STATE-ONLY —
  // the imported entries are NOT written back to localStorage (would
  // clobber user data); only the panel state knobs (scope, filter,
  // sort, collapsedOther) are applied.
  const [storagePanelImportRaw, setStoragePanelImportRaw] = useState<string>(
    "",
  );
  const [storagePanelImportStatus, setStoragePanelImportStatus] = useState<
    | { kind: "ok"; message: string }
    | { kind: "error"; message: string }
    | null
  >(null);
  // navigator.storage.estimate() quota awareness (origin-wide,
  // includes IndexedDB + caches + cookies, not just localStorage).
  // Refreshed on panel open.
  const [storageQuotaInfo, setStorageQuotaInfo] = useState<{
    usage: number;
    quota: number;
  } | null>(null);
  // User-overridable value truncation cap (panel rows). Default 200,
  // range [50, 5000].
  const [storagePanelValueTruncation, setStoragePanelValueTruncation] =
    useState<number>(() => readEffectiveStoragePanelValueTruncation());
  const handleSetStoragePanelValueTruncation = useCallback(
    (value: number | null) => {
      writeStoragePanelValueTruncationOverride(value);
      setStoragePanelValueTruncation(readEffectiveStoragePanelValueTruncation());
    },
    [],
  );
  // Per-category collapse for tree + dropin (extends the existing
  // "other" collapse). Tree + dropin default to NOT collapsed.
  const [storagePanelCollapsedTree, setStoragePanelCollapsedTree] =
    useState<boolean>(() => readStoredStoragePanelCollapsedTree());
  const handleSetStoragePanelCollapsedTree = useCallback(
    (collapsed: boolean) => {
      setStoragePanelCollapsedTree(collapsed);
      writeStoredStoragePanelCollapsedTree(collapsed);
    },
    [],
  );
  const [storagePanelCollapsedDropin, setStoragePanelCollapsedDropin] =
    useState<boolean>(() => readStoredStoragePanelCollapsedDropin());
  const handleSetStoragePanelCollapsedDropin = useCallback(
    (collapsed: boolean) => {
      setStoragePanelCollapsedDropin(collapsed);
      writeStoredStoragePanelCollapsedDropin(collapsed);
    },
    [],
  );
  // Sort order: "bytes-desc" (heaviest first, default) or "name-asc"
  // (alphabetical, case-insensitive).
  const [storageHealthSort, setStorageHealthSort] = useState<
    StoragePanelSort
  >(() => readStoredStoragePanelSort());
  const handleSetStorageHealthSort = useCallback(
    (sort: StoragePanelSort) => {
      setStorageHealthSort(sort);
      writeStoredStoragePanelSort(sort);
    },
    [],
  );
  // Filter then sort. Pure derivations memoized off the source list +
  // filter + sort; both tree-only and all-keys views use the same
  // pipeline. Regex mode falls back to substring match silently when
  // the compiled regex is null (invalid syntax).
  const filteredAndSortedTreeEntries = useMemo(() => {
    const filtered =
      storagePanelFilterMode === "regex" && storagePanelFilterRegex !== null
        ? filterStoredEntriesByRegex(storageHealthEntries, storagePanelFilterRegex)
        : filterStoredEntries(storageHealthEntries, storageHealthFilter);
    return sortStoredEntries(filtered, storageHealthSort);
  }, [
    storageHealthEntries,
    storageHealthFilter,
    storageHealthSort,
    storagePanelFilterMode,
    storagePanelFilterRegex,
  ]);
  const filteredAndSortedAllEntries = useMemo(() => {
    const filtered =
      storagePanelFilterMode === "regex" && storagePanelFilterRegex !== null
        ? filterStoredEntriesByRegex(
            storageHealthAllEntries,
            storagePanelFilterRegex,
          )
        : filterStoredEntries(storageHealthAllEntries, storageHealthFilter);
    return sortStoredEntries(filtered, storageHealthSort);
  }, [
    storageHealthAllEntries,
    storageHealthFilter,
    storageHealthSort,
    storagePanelFilterMode,
    storagePanelFilterRegex,
  ]);
  // Per-category partition for tree + dropin + other.
  const partitionedAllEntriesByCategory = useMemo(
    () =>
      partitionAllEntriesByCategoryCollapse(filteredAndSortedAllEntries, {
        tree: storagePanelCollapsedTree,
        dropin: storagePanelCollapsedDropin,
        other: storageHealthCollapsedOther,
      }),
    [
      filteredAndSortedAllEntries,
      storagePanelCollapsedTree,
      storagePanelCollapsedDropin,
      storageHealthCollapsedOther,
    ],
  );
  // Live JSON validation memo for the import textarea — chip + tooltip.
  // Audit F5 — single source of truth via the detail-returning parser;
  // the success-only preview is derived from the same memo's `value`.
  const storagePanelImportDetail = useMemo<StoragePanelExportParseResult | null>(
    () => {
      if (storagePanelImportRaw.trim() === "") return null;
      return parseStoragePanelExportJsonDetail(storagePanelImportRaw);
    },
    [storagePanelImportRaw],
  );
  const storagePanelImportPreview =
    storagePanelImportDetail?.kind === "ok"
      ? storagePanelImportDetail.value
      : null;
  // Build the JSON for the export-as-file / copy-to-clipboard / share
  // buttons. Rebuilt at click time so the timestamp is fresh.
  const buildLiveStoragePanelExportJson = useCallback((): string => {
    const categorizedEntries =
      storageHealthScope === "tree"
        ? filteredAndSortedTreeEntries.map((e) => ({
            ...e,
            category: "tree" as const,
          }))
        : filteredAndSortedAllEntries;
    const metadata: StoragePanelExportMetadata = {
      dropinSchemaVersion:
        TREE_PERSISTENCE_CONSTANTS.STORAGE_SCHEMA_VERSION,
      userAgent:
        typeof navigator !== "undefined" && typeof navigator.userAgent === "string"
          ? navigator.userAgent
          : "",
      appVersion: DROPIN_APP_VERSION,
    };
    return serializeStoragePanelExport(
      buildStoragePanelExport(
        categorizedEntries,
        {
          scope: storageHealthScope,
          filter: storageHealthFilter,
          sort: storageHealthSort,
          collapsedOther: storageHealthCollapsedOther,
        },
        new Date().toISOString(),
        metadata,
      ),
    );
  }, [
    storageHealthScope,
    storageHealthFilter,
    storageHealthSort,
    storageHealthCollapsedOther,
    filteredAndSortedTreeEntries,
    filteredAndSortedAllEntries,
  ]);
  // The export-download primitive — pulled out so the auto-share
  // fallback chain can reuse it as the last-resort terminal.
  const triggerStoragePanelExportDownload = useCallback(
    (json: string): boolean => {
      if (typeof window === "undefined") return false;
      if (typeof document === "undefined") return false;
      if (typeof Blob === "undefined") return false;
      if (typeof URL === "undefined" || !URL.createObjectURL) return false;
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safePrefix = sanitizeStoragePanelExportFilename(
        storagePanelExportFilename,
      );
      a.download = `${safePrefix}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    },
    [storagePanelExportFilename],
  );
  const handleExportStoragePanel = useCallback(() => {
    const json = buildLiveStoragePanelExportJson();
    triggerStoragePanelExportDownload(json);
  }, [buildLiveStoragePanelExportJson, triggerStoragePanelExportDownload]);
  // Copy-to-clipboard: 1500ms "copied" feedback state.
  const [storagePanelCopiedAt, setStoragePanelCopiedAt] = useState<number>(0);
  const storagePanelCopyClearTimerRef = useRef<number | null>(null);
  const handleCopyStoragePanel = useCallback(() => {
    if (typeof window === "undefined") return;
    if (typeof navigator === "undefined") return;
    if (!navigator.clipboard?.writeText) {
      onWarn?.("Copy unavailable in this browser. Use Export instead.");
      return;
    }
    const json = buildLiveStoragePanelExportJson();
    navigator.clipboard.writeText(json).then(
      () => {
        setStoragePanelCopiedAt(Date.now());
        if (storagePanelCopyClearTimerRef.current !== null) {
          window.clearTimeout(storagePanelCopyClearTimerRef.current);
        }
        storagePanelCopyClearTimerRef.current = window.setTimeout(() => {
          setStoragePanelCopiedAt(0);
          storagePanelCopyClearTimerRef.current = null;
        }, 1500);
      },
      () => {
        // Audit MED (Domain 4) — surface the rejection so the user
        // knows the copy didn't land. Common causes: permission
        // denied (e.g. tab not focused at click time), older browsers
        // without the async clipboard API. Export button is still
        // the supported fallback.
        onWarn?.("Copy blocked. Try Export instead.");
      },
    );
  }, [buildLiveStoragePanelExportJson, onWarn]);
  // Cleanup pending timer on unmount.
  useEffect(() => {
    return () => {
      if (storagePanelCopyClearTimerRef.current !== null) {
        if (typeof window !== "undefined") {
          window.clearTimeout(storagePanelCopyClearTimerRef.current);
        }
        storagePanelCopyClearTimerRef.current = null;
      }
    };
  }, []);
  // Restore panel state from pasted JSON. STATE-ONLY restore: only
  // the panel state knobs (scope, filter, sort, collapsedOther) are
  // applied; imported entries are summarized in the status but NOT
  // written back to localStorage.
  const handleImportStoragePanel = useCallback(() => {
    if (storagePanelImportRaw.trim() === "") {
      setStoragePanelImportStatus({
        kind: "error",
        message: "paste exported json first",
      });
      return;
    }
    const detailed = parseStoragePanelExportJsonDetail(storagePanelImportRaw);
    if (detailed.kind === "error") {
      setStoragePanelImportStatus({
        kind: "error",
        message: `invalid: ${detailed.reason}`,
      });
      return;
    }
    const parsed = detailed.value;
    handleSetStorageHealthScope(parsed.panelState.scope);
    handleSetStorageHealthFilter(parsed.panelState.filter);
    handleSetStorageHealthSort(parsed.panelState.sort);
    handleSetStorageHealthCollapsedOther(parsed.panelState.collapsedOther);
    const parts: string[] = [
      `imported ${parsed.entries.length} ${
        parsed.entries.length === 1 ? "entry" : "entries"
      }`,
      "panel state restored",
    ];
    if (parsed.metadata) {
      const ua = parsed.metadata.userAgent.trim();
      if (ua.length > 0) {
        const trimmedUa = ua.length > 32 ? ua.slice(0, 32) + "…" : ua;
        const fromParts: string[] = [trimmedUa];
        if (parsed.metadata.appVersion) {
          fromParts.push(`v${parsed.metadata.appVersion}`);
        }
        parts.push(`from ${fromParts.join(" ")}`);
      }
    }
    const dateMatch = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(
      parsed.exportedAt,
    );
    if (dateMatch) {
      parts.push(`@ ${dateMatch[1]} ${dateMatch[2]}`);
    }
    setStoragePanelImportStatus({
      kind: "ok",
      message: parts.join(" · "),
    });
    // Stash the import in the recent imports ring so the user can
    // re-apply later without pasting the JSON again.
    const recentEntry: StoragePanelRecentImport = {
      exportedAt: parsed.exportedAt,
      panelState: parsed.panelState,
      entryCount: parsed.entries.length,
      totalBytes: parsed.entries.reduce((acc, e) => acc + e.bytes, 0),
      addedAt: new Date().toISOString(),
    };
    setStoragePanelRecentImports((prev) => {
      const next = appendStoragePanelRecentImportEntry(prev, recentEntry);
      writeStoredStoragePanelRecentImports(next);
      return next;
    });
  }, [
    storagePanelImportRaw,
    handleSetStorageHealthScope,
    handleSetStorageHealthFilter,
    handleSetStorageHealthSort,
    handleSetStorageHealthCollapsedOther,
  ]);
  // Re-apply a previously imported panel state without re-pasting
  // the JSON. State-only.
  const handleApplyRecentStoragePanelImport = useCallback(
    (entry: StoragePanelRecentImport) => {
      handleSetStorageHealthScope(entry.panelState.scope);
      handleSetStorageHealthFilter(entry.panelState.filter);
      handleSetStorageHealthSort(entry.panelState.sort);
      handleSetStorageHealthCollapsedOther(entry.panelState.collapsedOther);
      const dateMatch = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(
        entry.exportedAt,
      );
      const dateLabel = dateMatch ? `${dateMatch[1]} ${dateMatch[2]}` : "(no date)";
      setStoragePanelImportStatus({
        kind: "ok",
        message: `re-applied recent import · ${entry.entryCount} entries · @ ${dateLabel}`,
      });
    },
    [
      handleSetStorageHealthScope,
      handleSetStorageHealthFilter,
      handleSetStorageHealthSort,
      handleSetStorageHealthCollapsedOther,
    ],
  );
  // Pretty-print a JSON-parseable value when the toggle is on;
  // otherwise return the value unchanged.
  const formatPanelValue = useCallback(
    (value: string): string => {
      if (!storagePanelPrettyPrint) return value;
      const pretty = tryFormatJsonValue(value);
      return pretty ?? value;
    },
    [storagePanelPrettyPrint],
  );
  // Web Share API fallback chain: navigator.share → clipboard →
  // download. AbortError (user dismissed share sheet) skips the
  // chain — falling through would be unwelcome surprise.
  const flashStoragePanelCopiedFeedback = useCallback(() => {
    setStoragePanelCopiedAt(Date.now());
    if (storagePanelCopyClearTimerRef.current !== null) {
      if (typeof window !== "undefined") {
        window.clearTimeout(storagePanelCopyClearTimerRef.current);
      }
    }
    if (typeof window !== "undefined") {
      storagePanelCopyClearTimerRef.current = window.setTimeout(() => {
        setStoragePanelCopiedAt(0);
        storagePanelCopyClearTimerRef.current = null;
      }, 1500);
    }
  }, []);
  const handleShareStoragePanel = useCallback(() => {
    if (typeof window === "undefined") return;
    if (typeof navigator === "undefined") return;
    const json = buildLiveStoragePanelExportJson();
    const fallbackToClipboard = (): boolean => {
      if (!navigator.clipboard?.writeText) return false;
      navigator.clipboard.writeText(json).then(
        () => {
          flashStoragePanelCopiedFeedback();
        },
        () => {
          triggerStoragePanelExportDownload(json);
        },
      );
      return true;
    };
    if (typeof navigator.share === "function") {
      navigator
        .share({
          title: "Dropin storage panel snapshot",
          text: json,
        })
        .then(
          () => {
            flashStoragePanelCopiedFeedback();
          },
          (err: unknown) => {
            if (
              err !== null &&
              typeof err === "object" &&
              "name" in err &&
              (err as { name: unknown }).name === "AbortError"
            ) {
              return;
            }
            if (!fallbackToClipboard()) {
              triggerStoragePanelExportDownload(json);
            }
          },
        );
      return;
    }
    if (!fallbackToClipboard()) {
      triggerStoragePanelExportDownload(json);
    }
  }, [
    buildLiveStoragePanelExportJson,
    triggerStoragePanelExportDownload,
    flashStoragePanelCopiedFeedback,
  ]);
  // Feature-detect navigator.share once per render. SSR-safe.
  const canShareStoragePanel =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";
  // Encoded preset query string for the current panel lens. Empty
  // when state is at all defaults (the share-preset button is
  // disabled in that case).
  const storagePanelPresetEncoded = useMemo(
    () =>
      encodeStoragePanelStateQuery({
        scope: storageHealthScope,
        sort: storageHealthSort,
        filter: storageHealthFilter,
        filterMode: storagePanelFilterMode,
        collapsedOther: storageHealthCollapsedOther,
        collapsedTree: storagePanelCollapsedTree,
        collapsedDropin: storagePanelCollapsedDropin,
      }),
    [
      storageHealthScope,
      storageHealthSort,
      storageHealthFilter,
      storagePanelFilterMode,
      storageHealthCollapsedOther,
      storagePanelCollapsedTree,
      storagePanelCollapsedDropin,
    ],
  );
  // Coral pulse-feedback for the share-preset button.
  const [storagePanelPresetCopiedAt, setStoragePanelPresetCopiedAt] =
    useState<number>(0);
  const storagePanelPresetCopyClearTimerRef = useRef<number | null>(null);
  const handleCopyStoragePanelPresetUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    if (typeof navigator === "undefined") return;
    if (!navigator.clipboard?.writeText) {
      onWarn?.("Copy unavailable in this browser.");
      return;
    }
    if (storagePanelPresetEncoded === "") return;
    const url =
      window.location.origin +
      window.location.pathname +
      window.location.search +
      "#dropin-panel=" +
      storagePanelPresetEncoded;
    navigator.clipboard.writeText(url).then(
      () => {
        setStoragePanelPresetCopiedAt(Date.now());
        if (storagePanelPresetCopyClearTimerRef.current !== null) {
          window.clearTimeout(storagePanelPresetCopyClearTimerRef.current);
        }
        storagePanelPresetCopyClearTimerRef.current = window.setTimeout(() => {
          setStoragePanelPresetCopiedAt(0);
          storagePanelPresetCopyClearTimerRef.current = null;
        }, 1500);
      },
      () => {
        // Audit MED (Domain 4) — surface the rejection.
        onWarn?.("Copy preset URL blocked.");
      },
    );
  }, [storagePanelPresetEncoded, onWarn]);
  // Cleanup pending preset-copy timer on unmount.
  useEffect(() => {
    return () => {
      if (storagePanelPresetCopyClearTimerRef.current !== null) {
        if (typeof window !== "undefined") {
          window.clearTimeout(storagePanelPresetCopyClearTimerRef.current);
        }
      }
    };
  }, []);
  // On-mount hash decode. If the URL landed with `#dropin-panel=
  // <encoded>`, parse it, apply via the existing setters, then strip
  // the hash so reload doesn't re-apply.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hashRaw = window.location.hash;
    const PREFIX = "#dropin-panel=";
    if (!hashRaw.startsWith(PREFIX)) return;
    const encoded = hashRaw.slice(PREFIX.length);
    const decoded = decodeStoragePanelStateQuery(encoded);
    if (decoded === null) return;
    handleSetStorageHealthScope(decoded.scope);
    handleSetStorageHealthSort(decoded.sort);
    handleSetStorageHealthFilter(decoded.filter);
    handleSetStoragePanelFilterMode(decoded.filterMode);
    handleSetStorageHealthCollapsedOther(decoded.collapsedOther);
    handleSetStoragePanelCollapsedTree(decoded.collapsedTree);
    handleSetStoragePanelCollapsedDropin(decoded.collapsedDropin);
    try {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    } catch {
      // history API unavailable / locked-down iframe — leave the
      // hash in place. The decode succeeded; reload will re-apply.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run-once
    // on mount; the handler identities don't matter for this effect.
  }, []);
  // Snapshot pinning. The user pins a point-in-time copy of the
  // live storage entries; the panel can then show a diff of what's
  // added/removed/changed since the pin.
  const [storagePanelSnapshot, setStoragePanelSnapshot] =
    useState<StoragePanelSnapshot | null>(() =>
      readStoredStoragePanelSnapshot(),
    );
  const [storagePanelDiffOpen, setStoragePanelDiffOpen] =
    useState<boolean>(false);
  const [storagePanelSnapshotError, setStoragePanelSnapshotError] =
    useState<string>("");
  const handlePinStoragePanelSnapshot = useCallback(() => {
    const live = storageHealthAllEntries.map((e) => ({
      key: e.key,
      value: e.value,
      bytes: e.bytes,
    }));
    const snapshot = buildStoragePanelSnapshot(live, new Date().toISOString());
    const ok = writeStoredStoragePanelSnapshot(snapshot);
    if (!ok) {
      setStoragePanelSnapshotError(
        "snapshot too large or quota exceeded — try reducing scope first",
      );
      return;
    }
    setStoragePanelSnapshot(snapshot);
    setStoragePanelSnapshotError("");
  }, [storageHealthAllEntries]);
  const handleClearStoragePanelSnapshot = useCallback(() => {
    setStoragePanelSnapshot(null);
    setStoragePanelDiffOpen(false);
    setStoragePanelSnapshotError("");
    writeStoredStoragePanelSnapshot(null);
  }, []);
  const storagePanelSnapshotDiff = useMemo(() => {
    if (storagePanelSnapshot === null) return null;
    const live = storageHealthAllEntries.map((e) => ({
      key: e.key,
      value: e.value,
      bytes: e.bytes,
    }));
    return diffStoredEntriesAgainstSnapshot(live, storagePanelSnapshot);
  }, [storageHealthAllEntries, storagePanelSnapshot]);
  // Wrap filter matches in a `<mark>` so the user spots WHERE in the
  // rendered key/value their needle hit. Short-circuits when no match
  // was found.
  const renderHighlighted = useCallback(
    (text: string): ReactNode => {
      const segments =
        storagePanelFilterMode === "regex" && storagePanelFilterRegex !== null
          ? splitOnMatchedRegex(text, storagePanelFilterRegex)
          : splitOnMatchedSubstring(text, storageHealthFilter);
      if (segments.length === 1 && !segments[0].match) {
        return text;
      }
      return segments.map((seg, i) =>
        seg.match ? (
          <mark
            key={i}
            className="rounded-sm bg-coral/20 px-px text-ink"
          >
            {seg.text}
          </mark>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        ),
      );
    },
    [storageHealthFilter, storagePanelFilterMode, storagePanelFilterRegex],
  );
  // Per-category breakdown for the "all" view footer.
  const allEntriesCategorySummary = useMemo(
    () => summarizeStoredEntriesByCategory(filteredAndSortedAllEntries),
    [filteredAndSortedAllEntries],
  );
  // Filter input ref — used by the `f` keyboard shortcut to focus +
  // select the input.
  const storagePanelFilterInputRef = useRef<HTMLInputElement | null>(null);
  // Refresh on open + on cross-tab storage events while open.
  // Refreshes BOTH lists regardless of current scope so flipping the
  // toggle in either direction shows fresh data without a re-fire of
  // the storage event.
  useEffect(() => {
    if (!open) return;
    setStorageHealthEntries(listStoredTreeStateEntries());
    setStorageHealthAllEntries(listAllStoredEntries());
    let cancelled = false;
    if (
      typeof navigator !== "undefined" &&
      navigator.storage &&
      typeof navigator.storage.estimate === "function"
    ) {
      navigator.storage.estimate().then(
        (estimate) => {
          if (cancelled) return;
          if (
            typeof estimate.usage === "number" &&
            typeof estimate.quota === "number" &&
            Number.isFinite(estimate.usage) &&
            Number.isFinite(estimate.quota) &&
            estimate.quota > 0
          ) {
            setStorageQuotaInfo({
              usage: estimate.usage,
              quota: estimate.quota,
            });
          } else {
            setStorageQuotaInfo(null);
          }
        },
        () => {
          if (cancelled) return;
          setStorageQuotaInfo(null);
        },
      );
    } else {
      setStorageQuotaInfo(null);
    }
    const unsubscribe = subscribeStoredTreeStateChanges((key) => {
      // Refresh entries for any key change (cross-tab edits to either
      // dropin:tree:* or other namespaces should re-render the lists).
      setStorageHealthEntries(listStoredTreeStateEntries());
      setStorageHealthAllEntries(listAllStoredEntries());
      // Sync panel-only persisted prefs on cross-tab change. Tree-side
      // prefs (depth/query/expanded/subtree-depths/dragGhostFormat/
      // subtreeDepthCap/storage*Bytes) are owned by the parent — its
      // own subscription handles those.
      if (key === null) {
        // Whole-storage wipe — reset every panel pref to its lazy-init
        // default.
        setStorageHealthScope(readStoredStoragePanelScope());
        setStorageHealthSort(readStoredStoragePanelSort());
        setStorageHealthFilter(readStoredStoragePanelFilter());
        setStorageHealthCollapsedOther(readStoredStoragePanelCollapsedOther());
        setStoragePanelExportFilename(readStoredStoragePanelExportFilename());
        setStoragePanelPrettyPrint(readStoredStoragePanelPrettyPrint());
        setStoragePanelHideValues(readStoredStoragePanelHideValues());
        setStoragePanelValueTruncation(
          readEffectiveStoragePanelValueTruncation(),
        );
        setStoragePanelCollapsedTree(readStoredStoragePanelCollapsedTree());
        setStoragePanelCollapsedDropin(readStoredStoragePanelCollapsedDropin());
        setStoragePanelFilterHistory(readStoredStoragePanelFilterHistory());
        setStoragePanelRecentImports(readStoredStoragePanelRecentImports());
        setStoragePanelFilterMode(readStoredStoragePanelFilterMode());
        setStoragePanelRecentImportsSort(
          readStoredStoragePanelRecentImportsSort(),
        );
        setStoragePanelSnapshot(readStoredStoragePanelSnapshot());
        return;
      }
      if (key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_SCOPE_KEY) {
        setStorageHealthScope(readStoredStoragePanelScope());
      } else if (key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_SORT_KEY) {
        setStorageHealthSort(readStoredStoragePanelSort());
      } else if (key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_FILTER_KEY) {
        setStorageHealthFilter(readStoredStoragePanelFilter());
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_COLLAPSED_OTHER_KEY
      ) {
        setStorageHealthCollapsedOther(readStoredStoragePanelCollapsedOther());
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_EXPORT_FILENAME_KEY
      ) {
        setStoragePanelExportFilename(readStoredStoragePanelExportFilename());
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_PRETTY_PRINT_KEY
      ) {
        setStoragePanelPrettyPrint(readStoredStoragePanelPrettyPrint());
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_HIDE_VALUES_KEY
      ) {
        setStoragePanelHideValues(readStoredStoragePanelHideValues());
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_KEY
      ) {
        setStoragePanelValueTruncation(
          readEffectiveStoragePanelValueTruncation(),
        );
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_COLLAPSED_TREE_KEY
      ) {
        setStoragePanelCollapsedTree(readStoredStoragePanelCollapsedTree());
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_COLLAPSED_DROPIN_KEY
      ) {
        setStoragePanelCollapsedDropin(
          readStoredStoragePanelCollapsedDropin(),
        );
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_FILTER_HISTORY_KEY
      ) {
        setStoragePanelFilterHistory(readStoredStoragePanelFilterHistory());
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_RECENT_IMPORTS_KEY
      ) {
        setStoragePanelRecentImports(readStoredStoragePanelRecentImports());
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_FILTER_MODE_KEY
      ) {
        setStoragePanelFilterMode(readStoredStoragePanelFilterMode());
      } else if (
        key ===
        STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_RECENT_IMPORTS_SORT_KEY
      ) {
        setStoragePanelRecentImportsSort(
          readStoredStoragePanelRecentImportsSort(),
        );
      } else if (
        key === STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_SNAPSHOT_KEY
      ) {
        setStoragePanelSnapshot(readStoredStoragePanelSnapshot());
      }
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [open]);
  // Esc + t/a/f keyboard shortcuts when the panel is open. Esc closes;
  // t/a switch scope; f focuses the filter input. Modifier-guarded so
  // Cmd+F = browser find isn't shadowed.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Ignore keystrokes targeted at form fields inside the panel
      // (filter input, edit textarea, import textarea, number inputs)
      // so typing "t" / "a" / "f" inside them isn't intercepted.
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
          return;
        }
        if (target.isContentEditable) return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const k = e.key;
      if (k === "t" || k === "T") {
        e.preventDefault();
        setStorageHealthScope("tree");
        writeStoredStoragePanelScope("tree");
      } else if (k === "a" || k === "A") {
        e.preventDefault();
        setStorageHealthScope("all");
        writeStoredStoragePanelScope("all");
      } else if (k === "f" || k === "F") {
        e.preventDefault();
        if (storagePanelFilterInputRef.current) {
          storagePanelFilterInputRef.current.focus();
          storagePanelFilterInputRef.current.select();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  // Wipe-prefs button: reset BOTH tree-side prefs (via the parent
  // callback) AND the panel's internal prefs (locally + storage).
  // The parent's callback wipes the tree-side preference keys via
  // `clearAllStoredTreePreferences`; the direct call here wipes the
  // panel-side keys via `clearAllStoredStoragePanelPreferences`. The
  // setState calls below sync the panel's local state with the just-
  // wiped storage so the UI reflects the new defaults immediately.
  const handleWipePrefs = useCallback(() => {
    onWipeTreePrefs();
    clearAllStoredStoragePanelPreferences();
    setStorageHealthScope(STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_SCOPE_DEFAULT);
    setStorageHealthSort(STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_SORT_DEFAULT);
    setStorageHealthFilter(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_FILTER_DEFAULT,
    );
    setStorageHealthCollapsedOther(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT,
    );
    setStoragePanelExportFilename(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_EXPORT_FILENAME_DEFAULT,
    );
    setStoragePanelPrettyPrint(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_PRETTY_PRINT_DEFAULT,
    );
    setStoragePanelHideValues(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_HIDE_VALUES_DEFAULT,
    );
    setStoragePanelValueTruncation(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT,
    );
    setStoragePanelCollapsedTree(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_COLLAPSED_TREE_DEFAULT,
    );
    setStoragePanelCollapsedDropin(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT,
    );
    setStoragePanelFilterHistory([]);
    setStoragePanelRecentImports([]);
    setStoragePanelFilterMode(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_FILTER_MODE_DEFAULT,
    );
    setStoragePanelRecentImportsSort(
      STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT,
    );
  }, [onWipeTreePrefs]);

  if (!open) return null;
  return (
    <>
      {/* Transparent backdrop catches outside clicks. z-index sits
          below the panel itself so the panel still receives
          pointer events. */}
      <div
        aria-hidden
        onClick={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          background: "transparent",
        }}
      />
      <div
        role="dialog"
        aria-label="Storage health · dropin:tree:* keys"
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute bottom-9 left-2 right-2 z-40 max-h-[60%] overflow-y-auto border-2 border-ink bg-paper p-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
      >
        <header className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
          <span>
            storage ·{" "}
            {storageHealthScope === "tree" ? "dropin:tree:*" : "all keys"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close storage health panel"
            title="Close · Esc · g"
            className="border-none bg-transparent p-0 text-muted hover:text-coral"
          >
            close
          </button>
        </header>
        {/* Origin storage quota row. Surfaces navigator.storage.estimate()
            output so a user investigating "why is dropin hitting
            localStorage limits" sees the macro picture. Hidden when the
            API is unavailable / fetch failed. */}
        {storageQuotaInfo !== null ? (
          <p
            className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-muted/70"
            title={`navigator.storage.estimate() · ${storageQuotaInfo.usage} / ${storageQuotaInfo.quota} bytes (origin-wide)`}
            aria-live="polite"
          >
            origin quota · {formatStoredBytes(storageQuotaInfo.usage)} of{" "}
            {formatStoredBytes(storageQuotaInfo.quota)}
            {" · "}
            {(() => {
              const pct =
                (storageQuotaInfo.usage / storageQuotaInfo.quota) * 100;
              if (pct < 0.01) return "<0.01%";
              if (pct < 1) return pct.toFixed(2) + "%";
              return pct.toFixed(1) + "%";
            })()}
          </p>
        ) : null}
        {/* Drag-ghost format preference toggle. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            drag-ghost label
            {dragGhostFormat !==
            TREE_PERSISTENCE_CONSTANTS.DRAG_GHOST_FORMAT_DEFAULT ? (
              <span
                aria-hidden
                title="Overridden from default"
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
              />
            ) : null}
          </legend>
          <div
            role="radiogroup"
            aria-label="Drag-ghost label format preference"
            className="flex items-center gap-1"
          >
            {(["with-count", "no-count", "count-only"] as const).map(
              (opt) => {
                const active = dragGhostFormat === opt;
                const sample =
                  opt === "with-count"
                    ? "<div> · 3"
                    : opt === "no-count"
                      ? "<div>"
                      : "3";
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onDragGhostFormatChange(opt)}
                    title={`Multi-drag ghost reads as: ${sample}`}
                    className={
                      "flex-1 border px-1.5 py-1 font-mono text-[10px] " +
                      (active
                        ? "border-coral bg-coral/15 text-coral"
                        : "border-soft bg-paper text-muted hover:text-ink")
                    }
                  >
                    {opt}
                  </button>
                );
              },
            )}
          </div>
        </fieldset>
        {/* Subtree-depth cap override. Default 50; clamped to
            [10, 5000]. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            subtree-depth cap (default{" "}
            {TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_MAX_ENTRIES})
            {subtreeDepthCap !==
            TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_MAX_ENTRIES ? (
              <span
                aria-hidden
                title="Overridden from default"
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
              />
            ) : null}
          </legend>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={
                TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN
              }
              max={
                TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX
              }
              step={1}
              value={subtreeDepthCap}
              onChange={(e) => {
                const raw = e.currentTarget.value;
                if (raw.trim() === "") return;
                const n = Number(raw);
                if (!Number.isFinite(n)) return;
                onSubtreeDepthCapChange(n);
              }}
              aria-label="Subtree-depth cap override (entries)"
              title={`Range ${TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN}–${TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX}`}
              className="w-20 border border-soft bg-paper px-1.5 py-1 font-mono text-[10px] text-ink focus:border-coral focus:outline-none"
            />
            <span className="font-mono text-[9px] text-muted">
              entries
            </span>
            <button
              type="button"
              onClick={() => onSubtreeDepthCapChange(null)}
              disabled={
                subtreeDepthCap ===
                TREE_PERSISTENCE_CONSTANTS.SUBTREE_DEPTH_MAX_ENTRIES
              }
              aria-label="Reset subtree-depth cap to default"
              title="Reset to default 50"
              className="ml-auto border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral disabled:cursor-not-allowed disabled:opacity-40"
            >
              reset
            </button>
          </div>
        </fieldset>
        {/* Storage telemetry warn / danger byte thresholds. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            pill thresholds (bytes)
            {storageWarnBytes !==
              TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_WARN_THRESHOLD ||
            storageDangerBytes !==
              TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_DANGER_THRESHOLD ? (
              <span
                aria-hidden
                title="Overridden from default"
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
              />
            ) : null}
          </legend>
          <div className="flex items-center gap-1.5">
            <label className="flex items-center gap-1 font-mono text-[9px] text-muted">
              warn
              <input
                type="number"
                min={
                  TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN
                }
                max={
                  TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX
                }
                step={256}
                value={storageWarnBytes}
                onChange={(e) => {
                  const raw = e.currentTarget.value;
                  if (raw.trim() === "") return;
                  const n = Number(raw);
                  if (!Number.isFinite(n)) return;
                  onStorageWarnBytesChange(n);
                }}
                aria-label="Pill warn threshold in bytes"
                title={`Range ${TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN}–${TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX} · default ${TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_WARN_THRESHOLD}`}
                className="w-20 border border-soft bg-paper px-1.5 py-1 font-mono text-[10px] text-ink focus:border-coral focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-1 font-mono text-[9px] text-muted">
              danger
              <input
                type="number"
                min={
                  TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN
                }
                max={
                  TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX
                }
                step={256}
                value={storageDangerBytes}
                onChange={(e) => {
                  const raw = e.currentTarget.value;
                  if (raw.trim() === "") return;
                  const n = Number(raw);
                  if (!Number.isFinite(n)) return;
                  onStorageDangerBytesChange(n);
                }}
                aria-label="Pill danger threshold in bytes"
                title={`Range ${TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN}–${TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX} · default ${TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_DANGER_THRESHOLD}`}
                className="w-20 border border-soft bg-paper px-1.5 py-1 font-mono text-[10px] text-ink focus:border-coral focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                onStorageWarnBytesChange(null);
                onStorageDangerBytesChange(null);
              }}
              disabled={
                storageWarnBytes ===
                  TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_WARN_THRESHOLD &&
                storageDangerBytes ===
                  TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_DANGER_THRESHOLD
              }
              aria-label="Reset pill thresholds to defaults"
              title="Reset to defaults 4096 / 16384"
              className="ml-auto border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral disabled:cursor-not-allowed disabled:opacity-40"
            >
              reset
            </button>
          </div>
          {/* Read-only computed effective values + override / default
              annotation + degenerate-config callout. */}
          <p
            className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-muted/70"
            aria-live="polite"
          >
            warn={storageWarnBytes}{" "}
            {storageWarnBytes ===
            TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_WARN_THRESHOLD
              ? "(default)"
              : "(override)"}
            {" · "}
            danger={storageDangerBytes}{" "}
            {storageDangerBytes ===
            TREE_PERSISTENCE_CONSTANTS.STORAGE_BYTES_DANGER_THRESHOLD
              ? "(default)"
              : "(override)"}
            {storageWarnBytes >= storageDangerBytes ? (
              <span className="ml-1.5 text-coral">
                · warn ≥ danger (warn unreachable)
              </span>
            ) : null}
          </p>
        </fieldset>
        {/* Panel scope. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            scope
            {storageHealthScope !==
            STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_SCOPE_DEFAULT ? (
              <span
                aria-hidden
                title="Overridden from default"
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
              />
            ) : null}
          </legend>
          <div
            role="radiogroup"
            aria-label="Storage health panel scope"
            className="flex items-center gap-1"
          >
            {(["tree", "all"] as const).map((opt) => {
              const active = storageHealthScope === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleSetStorageHealthScope(opt)}
                  title={
                    opt === "tree"
                      ? "Show only dropin:tree:* keys · t"
                      : "Show every localStorage key (categorized) · a"
                  }
                  className={
                    "flex-1 border px-1.5 py-1 font-mono text-[10px] " +
                    (active
                      ? "border-coral bg-coral/15 text-coral"
                      : "border-soft bg-paper text-muted hover:text-ink")
                  }
                >
                  {opt === "tree" ? "tree only" : "all keys"}
                </button>
              );
            })}
          </div>
        </fieldset>
        {/* Sort order. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            sort
            {storageHealthSort !==
            STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_SORT_DEFAULT ? (
              <span
                aria-hidden
                title="Overridden from default"
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
              />
            ) : null}
          </legend>
          <div
            role="radiogroup"
            aria-label="Storage entries sort order"
            className="flex items-center gap-1"
          >
            {(["bytes-desc", "name-asc"] as const).map((opt) => {
              const active = storageHealthSort === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleSetStorageHealthSort(opt)}
                  title={
                    opt === "bytes-desc"
                      ? "Sort heaviest entries first (default)"
                      : "Sort by key alphabetically (case-insensitive)"
                  }
                  className={
                    "flex-1 border px-1.5 py-1 font-mono text-[10px] " +
                    (active
                      ? "border-coral bg-coral/15 text-coral"
                      : "border-soft bg-paper text-muted hover:text-ink")
                  }
                >
                  {opt === "bytes-desc" ? "size desc" : "name asc"}
                </button>
              );
            })}
          </div>
        </fieldset>
        {/* Export + copy + share + share-preset buttons. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            export
          </legend>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[9px] text-muted">
              current view as json (entries + panel state)
            </p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={handleCopyStoragePanel}
                aria-label="Copy the panel's current view as JSON to clipboard"
                title="Copies the JSON to your clipboard. Same payload as 'export json' (filtered + sorted entries + panel state knobs)."
                aria-live="polite"
                className={
                  "border px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] " +
                  (storagePanelCopiedAt > 0
                    ? "border-coral bg-coral text-paper"
                    : "border-soft bg-paper text-muted hover:border-coral hover:text-coral")
                }
              >
                {storagePanelCopiedAt > 0 ? "copied" : "copy json"}
              </button>
              {canShareStoragePanel ? (
                <button
                  type="button"
                  onClick={handleShareStoragePanel}
                  aria-label="Open OS share sheet with the panel JSON"
                  title="Opens your OS share sheet with the JSON as the message body. Falls back silently when share is dismissed."
                  className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
                >
                  share
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleExportStoragePanel}
                aria-label="Export the panel's current view as a JSON download"
                title="Downloads a JSON file containing the filtered + sorted entries plus the panel state knobs (scope, filter, sort, collapsedOther). Useful for sharing repro states or archiving snapshots."
                className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
              >
                export json
              </button>
              <button
                type="button"
                onClick={handleCopyStoragePanelPresetUrl}
                disabled={storagePanelPresetEncoded === ""}
                aria-label="Copy a shareable URL that restores the current panel lens"
                aria-live="polite"
                title={
                  storagePanelPresetEncoded === ""
                    ? "Default panel state — no preset to share. Adjust scope / filter / sort first."
                    : "Copies a URL with the current scope / sort / filter / collapse state encoded. Pasting it back applies the preset on mount."
                }
                className={
                  "border px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] " +
                  (storagePanelPresetCopiedAt > 0
                    ? "border-coral bg-coral text-paper"
                    : storagePanelPresetEncoded === ""
                      ? "border-soft/50 bg-paper/50 text-muted/50 cursor-not-allowed"
                      : "border-soft bg-paper text-muted hover:border-coral hover:text-coral")
                }
              >
                {storagePanelPresetCopiedAt > 0 ? "copied" : "share preset"}
              </button>
            </div>
          </div>
          {/* Custom filename prefix for the export download. */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <label
              htmlFor="dropin-storage-panel-filename"
              className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted"
            >
              filename
              {storagePanelExportFilename !==
              STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_EXPORT_FILENAME_DEFAULT ? (
                <span
                  aria-hidden
                  title="Overridden from default"
                  className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
                />
              ) : null}
            </label>
            <input
              id="dropin-storage-panel-filename"
              type="text"
              value={storagePanelExportFilename}
              onChange={(e) =>
                handleSetStoragePanelExportFilename(e.currentTarget.value)
              }
              maxLength={
                STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN
              }
              spellCheck={false}
              aria-label="Export filename prefix (sanitized; runtime filename is prefix-{timestamp}.json)"
              title="Path separators, control chars, and leading dots stripped on save"
              className="min-w-0 flex-1 border border-soft bg-paper px-1.5 py-1 font-mono text-[10px] text-ink focus:border-coral focus:outline-none"
            />
            <button
              type="button"
              onClick={() =>
                handleSetStoragePanelExportFilename(
                  STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_EXPORT_FILENAME_DEFAULT,
                )
              }
              disabled={
                storagePanelExportFilename ===
                STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_EXPORT_FILENAME_DEFAULT
              }
              aria-label="Reset filename prefix to default"
              title="Reset to default 'dropin-tree-storage'"
              className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral disabled:cursor-not-allowed disabled:opacity-40"
            >
              reset
            </button>
          </div>
        </fieldset>
        {/* Snapshot pin for diff-vs-live compare. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            snapshot
            {storagePanelSnapshot !== null ? (
              <span
                aria-hidden
                title="Snapshot is pinned"
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
              />
            ) : null}
          </legend>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[9px] text-muted">
              {storagePanelSnapshot === null
                ? "no snapshot pinned"
                : (() => {
                    const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(
                      storagePanelSnapshot.pinnedAt,
                    );
                    const compact = m ? `${m[1]} ${m[2]}` : "(no date)";
                    return `pinned ${storagePanelSnapshot.entries.length} entries · @ ${compact}`;
                  })()}
            </p>
            <div className="flex shrink-0 gap-1">
              {storagePanelSnapshot === null ? (
                <button
                  type="button"
                  onClick={handlePinStoragePanelSnapshot}
                  aria-label="Pin a snapshot of the current localStorage entries"
                  title={`Captures up to ${STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES} entries from the all-keys list at this moment. Diff against live afterward.`}
                  className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
                >
                  pin snapshot
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setStoragePanelDiffOpen((o) => !o)
                    }
                    aria-pressed={storagePanelDiffOpen}
                    aria-label={
                      storagePanelDiffOpen
                        ? "Hide diff"
                        : "Show diff vs. live"
                    }
                    title="Toggles the inline diff: + added · - removed · ≠ changed · = unchanged. Counts source from the all-keys list."
                    className={
                      "border px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] " +
                      (storagePanelDiffOpen
                        ? "border-coral bg-coral/15 text-coral"
                        : "border-soft bg-paper text-muted hover:border-coral hover:text-coral")
                    }
                  >
                    diff
                  </button>
                  <button
                    type="button"
                    onClick={handlePinStoragePanelSnapshot}
                    aria-label="Re-pin snapshot at the current moment"
                    title="Replaces the pinned snapshot with a fresh capture at this moment."
                    className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
                  >
                    re-pin
                  </button>
                  <button
                    type="button"
                    onClick={handleClearStoragePanelSnapshot}
                    aria-label="Unpin snapshot"
                    title="Discards the pinned snapshot (clears the panel diff and frees localStorage)."
                    className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
                  >
                    unpin
                  </button>
                </>
              )}
            </div>
          </div>
          {storagePanelSnapshotError !== "" ? (
            <p
              className="mt-1.5 break-words border border-coral bg-coral/10 px-1.5 py-1 font-mono text-[9px] text-coral"
              aria-live="polite"
            >
              {storagePanelSnapshotError}
            </p>
          ) : null}
          {storagePanelSnapshot !== null &&
          storagePanelDiffOpen &&
          storagePanelSnapshotDiff !== null ? (
            <div className="mt-1.5 space-y-1">
              <p className="font-mono text-[9px] text-muted">
                +{storagePanelSnapshotDiff.added.length} added · −
                {storagePanelSnapshotDiff.removed.length} removed · ≠
                {storagePanelSnapshotDiff.changed.length} changed · =
                {storagePanelSnapshotDiff.unchanged} unchanged
              </p>
              {storagePanelSnapshotDiff.added.length > 0 ? (
                <details className="border border-soft bg-paper p-1">
                  <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-[0.15em] text-coral">
                    + added ({storagePanelSnapshotDiff.added.length})
                  </summary>
                  <ul className="mt-1 space-y-0.5">
                    {storagePanelSnapshotDiff.added
                      .slice(0, 20)
                      .map((d) => (
                        <li
                          key={d.key}
                          className="flex items-baseline justify-between gap-2 font-mono text-[9px]"
                        >
                          <span className="truncate text-ink">
                            {d.key}
                          </span>
                          <span className="shrink-0 text-muted">
                            {formatStoredBytes(d.bytes)}
                          </span>
                        </li>
                      ))}
                    {storagePanelSnapshotDiff.added.length > 20 ? (
                      <li className="font-mono text-[9px] text-muted/70">
                        + {storagePanelSnapshotDiff.added.length - 20} more
                      </li>
                    ) : null}
                  </ul>
                </details>
              ) : null}
              {storagePanelSnapshotDiff.removed.length > 0 ? (
                <details className="border border-soft bg-paper p-1">
                  <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-[0.15em] text-coral">
                    − removed ({storagePanelSnapshotDiff.removed.length})
                  </summary>
                  <ul className="mt-1 space-y-0.5">
                    {storagePanelSnapshotDiff.removed
                      .slice(0, 20)
                      .map((d) => (
                        <li
                          key={d.key}
                          className="flex items-baseline justify-between gap-2 font-mono text-[9px]"
                        >
                          <span className="truncate text-ink">
                            {d.key}
                          </span>
                          <span className="shrink-0 text-muted">
                            {formatStoredBytes(d.bytes)}
                          </span>
                        </li>
                      ))}
                    {storagePanelSnapshotDiff.removed.length > 20 ? (
                      <li className="font-mono text-[9px] text-muted/70">
                        +{" "}
                        {storagePanelSnapshotDiff.removed.length - 20} more
                      </li>
                    ) : null}
                  </ul>
                </details>
              ) : null}
              {storagePanelSnapshotDiff.changed.length > 0 ? (
                <details className="border border-soft bg-paper p-1">
                  <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-[0.15em] text-coral">
                    ≠ changed ({storagePanelSnapshotDiff.changed.length})
                  </summary>
                  <ul className="mt-1 space-y-0.5">
                    {storagePanelSnapshotDiff.changed
                      .slice(0, 20)
                      .map((d) => (
                        <li
                          key={d.key}
                          className="flex items-baseline justify-between gap-2 font-mono text-[9px]"
                        >
                          <span className="truncate text-ink">
                            {d.key}
                          </span>
                          <span className="shrink-0 text-muted">
                            {formatStoredBytes(d.oldBytes)} →{" "}
                            {formatStoredBytes(d.newBytes)}
                          </span>
                        </li>
                      ))}
                    {storagePanelSnapshotDiff.changed.length > 20 ? (
                      <li className="font-mono text-[9px] text-muted/70">
                        +{" "}
                        {storagePanelSnapshotDiff.changed.length - 20} more
                      </li>
                    ) : null}
                  </ul>
                </details>
              ) : null}
            </div>
          ) : null}
        </fieldset>
        {/* Import a previously-exported panel snapshot. STATE-ONLY
            restore: only the panel state knobs (scope, filter, sort,
            collapsedOther) are applied. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            import
          </legend>
          <p className="mb-1.5 font-mono text-[9px] text-muted">
            paste exported json · restores panel state only (entries
            not written)
          </p>
          <textarea
            value={storagePanelImportRaw}
            onChange={(e) => {
              setStoragePanelImportRaw(e.currentTarget.value);
              if (storagePanelImportStatus !== null) {
                setStoragePanelImportStatus(null);
              }
            }}
            rows={3}
            placeholder='{"schemaVersion":1,...}'
            aria-label="Paste exported JSON here to restore panel state"
            spellCheck={false}
            className="mb-1.5 w-full resize-y border border-soft bg-paper p-1 font-mono text-[10px] text-ink focus:border-coral focus:outline-none"
          />
          {/* Live validation chip. */}
          {storagePanelImportRaw.trim() !== "" ? (
            <div
              className={
                "mb-1.5 inline-block border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] " +
                (storagePanelImportPreview
                  ? "border-coral text-coral"
                  : "border-coral bg-coral/10 text-coral")
              }
              aria-live="polite"
              title={
                storagePanelImportDetail?.kind === "error"
                  ? storagePanelImportDetail.reason
                  : storagePanelImportPreview
                    ? `Click restore to apply panel state from this export (${storagePanelImportPreview.entries.length} entries)`
                    : undefined
              }
            >
              {storagePanelImportPreview
                ? `valid · ${
                    storagePanelImportPreview.entries.length
                  } ${
                    storagePanelImportPreview.entries.length === 1
                      ? "entry"
                      : "entries"
                  }`
                : "invalid json"}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-2">
            <p
              className={
                "min-w-0 flex-1 truncate font-mono text-[9px] " +
                (storagePanelImportStatus?.kind === "ok"
                  ? "text-coral"
                  : storagePanelImportStatus?.kind === "error"
                    ? "text-coral"
                    : "text-muted")
              }
              aria-live="polite"
            >
              {storagePanelImportStatus?.message ?? ""}
            </p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => {
                  setStoragePanelImportRaw("");
                  setStoragePanelImportStatus(null);
                }}
                disabled={
                  storagePanelImportRaw === "" &&
                  storagePanelImportStatus === null
                }
                aria-label="Clear import input + status"
                title="Clear input + status"
                className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral disabled:cursor-not-allowed disabled:opacity-40"
              >
                clear
              </button>
              <button
                type="button"
                onClick={handleImportStoragePanel}
                aria-label="Restore panel state from pasted JSON"
                title="Parses the JSON and applies the panel state knobs (scope, filter, sort, collapsedOther). Imported entries are summarized but NOT written back to localStorage."
                className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
              >
                restore
              </button>
            </div>
          </div>
          {/* Imported-entries side-by-side compare view. */}
          {storagePanelImportPreview &&
          storagePanelImportPreview.entries.length > 0 ? (
            <details className="mt-1.5 border border-soft p-1.5">
              <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral">
                parsed entries (
                {storagePanelImportPreview.entries.length})
              </summary>
              <ul className="mt-1.5 space-y-0.5">
                {storagePanelImportPreview.entries
                  .slice(0, 10)
                  .map((e) => (
                    <li
                      key={e.key}
                      className="flex items-baseline justify-between gap-2 font-mono text-[9px]"
                    >
                      <span
                        className="truncate text-muted"
                        title={e.key}
                      >
                        <span
                          className={
                            "mr-1 inline-block min-w-[36px] text-center align-middle " +
                            (e.category === "tree"
                              ? "border border-coral px-1 text-[8px] uppercase text-coral"
                              : e.category === "dropin"
                                ? "border border-soft px-1 text-[8px] uppercase text-muted"
                                : "border border-soft/50 px-1 text-[8px] uppercase text-muted/60")
                          }
                        >
                          {e.category}
                        </span>
                        {shortNameForStoredKey(e.key)}
                      </span>
                      <span className="shrink-0 text-muted/70">
                        {formatStoredBytes(e.bytes)}
                      </span>
                    </li>
                  ))}
                {storagePanelImportPreview.entries.length > 10 ? (
                  <li className="font-mono text-[9px] text-muted/60">
                    + {storagePanelImportPreview.entries.length - 10} more
                  </li>
                ) : null}
              </ul>
            </details>
          ) : null}
        </fieldset>
        {/* Recent imports list — clickable re-apply buttons. */}
        {storagePanelRecentImports.length > 0 ? (
          <fieldset className="mb-2 border border-soft p-1.5">
            <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
              recent imports ({storagePanelRecentImports.length})
            </legend>
            <div className="mb-1.5 flex items-center gap-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                sort:
              </span>
              <button
                type="button"
                onClick={() =>
                  handleSetStoragePanelRecentImportsSort("insertion")
                }
                aria-pressed={
                  storagePanelRecentImportsSort === "insertion"
                }
                title="Insertion order (most-recent import first)"
                className={
                  "border px-1 font-mono text-[9px] uppercase tracking-[0.15em] " +
                  (storagePanelRecentImportsSort === "insertion"
                    ? "border-coral bg-coral/15 text-coral"
                    : "border-soft bg-paper text-muted hover:border-coral hover:text-coral")
                }
              >
                insertion
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSetStoragePanelRecentImportsSort("added-desc")
                }
                aria-pressed={
                  storagePanelRecentImportsSort === "added-desc"
                }
                title="Date (addedAt desc, then exportedAt desc as tiebreaker)"
                className={
                  "border px-1 font-mono text-[9px] uppercase tracking-[0.15em] " +
                  (storagePanelRecentImportsSort === "added-desc"
                    ? "border-coral bg-coral/15 text-coral"
                    : "border-soft bg-paper text-muted hover:border-coral hover:text-coral")
                }
              >
                by date
              </button>
            </div>
            <ul className="mb-1.5 space-y-1">
              {sortedStoragePanelRecentImports.map((entry) => {
                const dateMatch = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(
                  entry.exportedAt,
                );
                const dateLabel = dateMatch
                  ? `${dateMatch[1]} ${dateMatch[2]}`
                  : "(no date)";
                return (
                  <li
                    key={`${entry.exportedAt}-${entry.addedAt}`}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyRecentStoragePanelImport(entry)
                      }
                      aria-label={`Re-apply panel state from ${dateLabel} (${entry.entryCount} entries)`}
                      title={`Re-apply: scope=${entry.panelState.scope} · sort=${entry.panelState.sort} · filter="${entry.panelState.filter}" · collapsedOther=${entry.panelState.collapsedOther}`}
                      className="min-w-0 flex-1 border border-soft bg-paper px-1.5 py-1 text-left font-mono text-[10px] text-ink hover:border-coral hover:text-coral"
                    >
                      <span className="truncate">{dateLabel}</span>
                      <span className="ml-1.5 text-[9px] text-muted">
                        · {entry.entryCount}{" "}
                        {entry.entryCount === 1 ? "entry" : "entries"} ·{" "}
                        {formatStoredBytes(entry.totalBytes)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={handleClearStoragePanelRecentImports}
              aria-label="Clear recent imports list"
              title="Wipe the recent imports list (does NOT affect the live panel state)"
              className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral"
            >
              clear list
            </button>
          </fieldset>
        ) : null}
        {/* Display toggles — pretty-print + hide-values + truncation. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            display
            {storagePanelPrettyPrint !==
              STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_PRETTY_PRINT_DEFAULT ||
            storagePanelHideValues !==
              STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_HIDE_VALUES_DEFAULT ? (
              <span
                aria-hidden
                title="Overridden from default"
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
              />
            ) : null}
          </legend>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1 font-mono text-[10px] text-muted">
              <input
                type="checkbox"
                checked={storagePanelPrettyPrint}
                onChange={(e) =>
                  handleSetStoragePanelPrettyPrint(e.currentTarget.checked)
                }
                aria-label="Pretty-print JSON-parseable values"
                className="accent-coral"
              />
              pretty-print json
            </label>
            <label className="flex items-center gap-1 font-mono text-[10px] text-muted">
              <input
                type="checkbox"
                checked={storagePanelHideValues}
                onChange={(e) =>
                  handleSetStoragePanelHideValues(e.currentTarget.checked)
                }
                aria-label="Hide value previews in panel rows"
                className="accent-coral"
              />
              hide values
            </label>
          </div>
          {/* Value truncation override. */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <label
              htmlFor="dropin-storage-panel-truncation"
              className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted"
            >
              truncate values
              {storagePanelValueTruncation !==
              STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT ? (
                <span
                  aria-hidden
                  title="Overridden from default"
                  className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coral align-middle"
                />
              ) : null}
            </label>
            <input
              id="dropin-storage-panel-truncation"
              type="number"
              min={
                STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_MIN
              }
              max={
                STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_MAX
              }
              step={50}
              value={storagePanelValueTruncation}
              disabled={storagePanelHideValues}
              onChange={(e) => {
                const raw = e.currentTarget.value;
                if (raw.trim() === "") return;
                const n = Number(raw);
                if (!Number.isFinite(n)) return;
                handleSetStoragePanelValueTruncation(n);
              }}
              aria-label={`Value truncation cap (range ${STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_MIN}–${STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_MAX} chars)`}
              title={`Range ${STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_MIN}–${STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_MAX} · default ${STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT} · disabled when hide-values is on`}
              className="w-20 border border-soft bg-paper px-1.5 py-1 font-mono text-[10px] text-ink focus:border-coral focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            />
            <span className="font-mono text-[9px] text-muted">chars</span>
            <button
              type="button"
              onClick={() => handleSetStoragePanelValueTruncation(null)}
              disabled={
                storagePanelValueTruncation ===
                  STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT ||
                storagePanelHideValues
              }
              aria-label="Reset truncation cap to default"
              title={`Reset to default ${STORAGE_PANEL_CONSTANTS.STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT}`}
              className="ml-auto border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral disabled:cursor-not-allowed disabled:opacity-40"
            >
              reset
            </button>
          </div>
        </fieldset>
        {/* Wipe preferences — does NOT touch tree state. */}
        <fieldset className="mb-2 border border-soft p-1.5">
          <legend className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
            wipe preferences
          </legend>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[9px] text-muted">
              resets cap, thresholds, drag-ghost, scope, sort,
              filter, collapse (3×), filename, pretty-print,
              hide-values, truncation
            </p>
            <button
              type="button"
              onClick={handleWipePrefs}
              aria-label="Wipe all panel preferences to defaults"
              title="Clears all panel preferences (cap, pill thresholds, drag-ghost format, panel scope, panel sort, panel filter, collapsed-other). State (depth/filter/expanded/subtree-depths) is NOT touched."
              className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
            >
              wipe prefs
            </button>
          </div>
        </fieldset>
        {/* Filter input + mode toggle + clear buttons. */}
        <div className="mb-2 flex items-center gap-1.5">
          <input
            ref={storagePanelFilterInputRef}
            type="search"
            value={storageHealthFilter}
            onChange={(e) =>
              handleSetStorageHealthFilter(e.currentTarget.value)
            }
            onBlur={(e) => {
              commitStoragePanelFilterHistory(e.currentTarget.value);
            }}
            placeholder={
              storagePanelFilterMode === "regex"
                ? "filter (regex)…"
                : "filter keys / values…"
            }
            list={
              storagePanelFilterHistory.length > 0
                ? "dropin-storage-panel-filter-history"
                : undefined
            }
            aria-label={
              storagePanelFilterMode === "regex"
                ? "Filter storage entries by regex (case-insensitive). Invalid regex falls back to substring match."
                : "Filter storage entries by substring (key or value, case-insensitive)"
            }
            className={
              "min-w-0 flex-1 border bg-paper px-1.5 py-1 font-mono text-[10px] text-ink focus:border-coral focus:outline-none " +
              (storagePanelFilterMode === "regex" &&
              storageHealthFilter.trim() !== "" &&
              storagePanelFilterRegex === null
                ? "border-coral bg-coral/5"
                : "border-soft")
            }
          />
          {storagePanelFilterHistory.length > 0 ? (
            <datalist id="dropin-storage-panel-filter-history">
              {storagePanelFilterHistory.map((q) => (
                <option key={q} value={q} />
              ))}
            </datalist>
          ) : null}
          <button
            type="button"
            onClick={() =>
              handleSetStoragePanelFilterMode(
                storagePanelFilterMode === "substring" ? "regex" : "substring",
              )
            }
            aria-label={`Filter mode: ${storagePanelFilterMode}. Click to toggle.`}
            title={
              storagePanelFilterMode === "regex"
                ? "Regex mode (case-insensitive). Click to switch to substring."
                : "Substring mode (case-insensitive). Click to switch to regex."
            }
            className={
              "shrink-0 border px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] " +
              (storagePanelFilterMode === "regex"
                ? "border-coral bg-coral/15 text-coral"
                : "border-soft bg-paper text-muted hover:text-coral")
            }
          >
            {storagePanelFilterMode === "regex" ? ".*" : "abc"}
          </button>
          {storageHealthFilter !== "" ? (
            <button
              type="button"
              onClick={() => handleSetStorageHealthFilter("")}
              aria-label="Clear filter"
              title="Clear filter"
              className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral"
            >
              clear
            </button>
          ) : null}
          {storagePanelFilterHistory.length > 0 ? (
            <button
              type="button"
              onClick={handleClearStoragePanelFilterHistory}
              aria-label="Clear search history"
              title={`Clear ${storagePanelFilterHistory.length} recent search${storagePanelFilterHistory.length === 1 ? "" : "es"}`}
              className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:text-coral"
            >
              ×{storagePanelFilterHistory.length}
            </button>
          ) : null}
        </div>
        {/* Inline reason hint for invalid regex. */}
        {storagePanelFilterRegexDetail?.kind === "error" ? (
          <p
            className="-mt-1 mb-2 break-all border border-coral bg-coral/10 px-1.5 py-1 font-mono text-[9px] text-coral"
            aria-live="polite"
            title="Filter falls back to substring match while the regex is invalid; entries below are matched as substring."
          >
            {storagePanelFilterRegexDetail.reason}
          </p>
        ) : null}
        {/* Entries list. */}
        {storageHealthScope === "tree" ? (
          filteredAndSortedTreeEntries.length === 0 ? (
            <p className="font-mono text-[10px] text-muted">
              {storageHealthEntries.length === 0
                ? "no dropin:tree:* keys persisted yet"
                : `no matches for "${storageHealthFilter}"`}
            </p>
          ) : (
            <ul className="space-y-1">
              {filteredAndSortedTreeEntries.map((entry) => (
                <li
                  key={entry.key}
                  className="border border-soft bg-paper p-1.5"
                >
                  <div className="mb-0.5 flex items-baseline justify-between gap-2 font-mono text-[10px]">
                    <span
                      className="truncate text-ink"
                      title={entry.key}
                    >
                      {renderHighlighted(shortNameForStoredKey(entry.key))}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span
                        className="text-muted"
                        title={`${entry.bytes} characters (key + value)`}
                      >
                        {formatStoredBytes(entry.bytes)}
                      </span>
                      {storagePanelPendingDeleteKey !== entry.key &&
                      storagePanelEditingKey !== entry.key ? (
                        <button
                          type="button"
                          onClick={() =>
                            beginStoragePanelEdit(entry.key, entry.value)
                          }
                          aria-label={`Edit value of ${entry.key}`}
                          title={`Edit value of ${entry.key} (raw text; no JSON validation)`}
                          className="border border-soft bg-paper px-1 font-mono text-[9px] text-muted hover:border-coral hover:text-coral"
                        >
                          edit
                        </button>
                      ) : null}
                      {storagePanelPendingDeleteKey === entry.key ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleConfirmDeleteStoragePanelKey(entry.key)
                          }
                          aria-label={`Confirm delete ${entry.key}`}
                          title={`Confirm delete ${entry.key} from localStorage. Auto-disarms in 4 seconds.`}
                          className="relative overflow-hidden border border-coral bg-coral px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-paper"
                        >
                          <span
                            key={`zzzz-${entry.key}`}
                            ref={storagePanelDeleteCountdownRef}
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-paper"
                            style={{ width: "100%" }}
                          />
                          <span className="relative">delete?</span>
                        </button>
                      ) : storagePanelEditingKey !== entry.key ? (
                        <button
                          type="button"
                          onClick={() =>
                            armStoragePanelDelete(entry.key)
                          }
                          aria-label={`Delete ${entry.key} from localStorage`}
                          title={`Delete ${entry.key} (click ×, then click "delete?" within 4s to confirm)`}
                          className="border border-soft bg-paper px-1 font-mono text-[9px] text-muted hover:border-coral hover:text-coral"
                        >
                          ×
                        </button>
                      ) : null}
                    </span>
                  </div>
                  {storagePanelEditingKey === entry.key ? (
                    <div className="space-y-1">
                      <textarea
                        value={storagePanelEditDraft}
                        onChange={(e) =>
                          setStoragePanelEditDraft(e.currentTarget.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            e.preventDefault();
                            cancelStoragePanelEdit();
                          }
                        }}
                        autoFocus
                        rows={Math.min(
                          8,
                          Math.max(
                            3,
                            storagePanelEditDraft.split("\n").length,
                          ),
                        )}
                        aria-label={`Edit value of ${entry.key}`}
                        className="w-full resize-y border border-soft bg-paper p-1 font-mono text-[9px] text-ink"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleSaveStoragePanelEdit(entry.key)
                          }
                          aria-label={`Save edited value for ${entry.key}`}
                          title="Write the new value to localStorage. No JSON validation — caller is responsible."
                          className="border border-coral bg-coral px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-paper"
                        >
                          save
                        </button>
                        <button
                          type="button"
                          onClick={cancelStoragePanelEdit}
                          aria-label="Cancel edit"
                          title="Discard draft and revert"
                          className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
                        >
                          cancel
                        </button>
                        <span className="font-mono text-[9px] text-muted/70">
                          {storagePanelEditDraft.length} chars
                        </span>
                      </div>
                    </div>
                  ) : storagePanelHideValues ? null : (
                    <div
                      className={
                        "overflow-y-auto break-all font-mono text-[9px] text-muted/80 " +
                        (storagePanelPrettyPrint
                          ? "max-h-40 whitespace-pre"
                          : "max-h-20")
                      }
                      title={entry.value}
                    >
                      {(() => {
                        const formatted = formatPanelValue(entry.value);
                        const truncated =
                          formatted.length > storagePanelValueTruncation
                            ? formatted.slice(0, storagePanelValueTruncation) +
                              "…"
                            : formatted;
                        return renderHighlighted(truncated);
                      })()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        ) : filteredAndSortedAllEntries.length === 0 ? (
          <p className="font-mono text-[10px] text-muted">
            {storageHealthAllEntries.length === 0
              ? "no localStorage keys at all"
              : `no matches for "${storageHealthFilter}"`}
          </p>
        ) : (
          <ul className="space-y-1">
            {partitionedAllEntriesByCategory.visible.length === 0 ? (
              <li className="border border-dashed border-soft bg-paper p-1.5 font-mono text-[10px] text-muted">
                all {(() => {
                  const totalHidden =
                    partitionedAllEntriesByCategory.hidden.tree.count +
                    partitionedAllEntriesByCategory.hidden.dropin.count +
                    partitionedAllEntriesByCategory.hidden.other.count;
                  return totalHidden;
                })()} match
                {(() => {
                  const totalHidden =
                    partitionedAllEntriesByCategory.hidden.tree.count +
                    partitionedAllEntriesByCategory.hidden.dropin.count +
                    partitionedAllEntriesByCategory.hidden.other.count;
                  return totalHidden === 1 ? "" : "es";
                })()}{" "}
                in collapsed categories — expand below
              </li>
            ) : null}
            {partitionedAllEntriesByCategory.visible.map((entry) => (
              <li
                key={entry.key}
                className="border border-soft bg-paper p-1.5"
              >
                <div className="mb-0.5 flex items-baseline justify-between gap-2 font-mono text-[10px]">
                  <span className="flex min-w-0 items-center gap-1 truncate text-ink">
                    {entry.category === "other" ? (
                      <span
                        className="shrink-0 border border-soft/50 px-1 font-mono text-[8px] uppercase tracking-[0.15em] text-muted/60"
                        title={`Category: ${entry.category}`}
                      >
                        {entry.category}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleSetStorageHealthFilter(
                            entry.category === "tree"
                              ? "dropin:tree:"
                              : "dropin:",
                          )
                        }
                        aria-label={`Filter to ${entry.category} category`}
                        className={
                          "shrink-0 border px-1 font-mono text-[8px] uppercase tracking-[0.15em] hover:bg-coral hover:text-paper " +
                          (entry.category === "tree"
                            ? "border-coral text-coral"
                            : "border-soft text-muted")
                        }
                        title={`Category: ${entry.category} · click to filter to ${
                          entry.category === "tree"
                            ? "dropin:tree:*"
                            : "dropin:*"
                        }`}
                      >
                        {entry.category}
                      </button>
                    )}
                    <span className="truncate" title={entry.key}>
                      {renderHighlighted(
                        entry.category === "tree"
                          ? shortNameForStoredKey(entry.key)
                          : entry.key,
                      )}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span
                      className="text-muted"
                      title={`${entry.bytes} characters (key + value)`}
                    >
                      {formatStoredBytes(entry.bytes)}
                    </span>
                    {storagePanelPendingDeleteKey !== entry.key &&
                    storagePanelEditingKey !== entry.key ? (
                      <button
                        type="button"
                        onClick={() =>
                          beginStoragePanelEdit(entry.key, entry.value)
                        }
                        aria-label={`Edit value of ${entry.key}`}
                        title={`Edit value of ${entry.key} (raw text; no JSON validation)`}
                        className="border border-soft bg-paper px-1 font-mono text-[9px] text-muted hover:border-coral hover:text-coral"
                      >
                        edit
                      </button>
                    ) : null}
                    {storagePanelPendingDeleteKey === entry.key ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleConfirmDeleteStoragePanelKey(entry.key)
                        }
                        aria-label={`Confirm delete ${entry.key}`}
                        title={`Confirm delete ${entry.key} from localStorage. Auto-disarms in 4 seconds.`}
                        className="relative overflow-hidden border border-coral bg-coral px-1 font-mono text-[9px] uppercase tracking-[0.15em] text-paper"
                      >
                        <span
                          key={`zzzz-${entry.key}`}
                          ref={storagePanelDeleteCountdownRef}
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-paper"
                          style={{ width: "100%" }}
                        />
                        <span className="relative">delete?</span>
                      </button>
                    ) : storagePanelEditingKey !== entry.key ? (
                      <button
                        type="button"
                        onClick={() => armStoragePanelDelete(entry.key)}
                        aria-label={`Delete ${entry.key} from localStorage`}
                        title={`Delete ${entry.key} (click ×, then click "delete?" within 4s to confirm)`}
                        className="border border-soft bg-paper px-1 font-mono text-[9px] text-muted hover:border-coral hover:text-coral"
                      >
                        ×
                      </button>
                    ) : null}
                  </span>
                </div>
                {storagePanelEditingKey === entry.key ? (
                  <div className="space-y-1">
                    <textarea
                      value={storagePanelEditDraft}
                      onChange={(e) =>
                        setStoragePanelEditDraft(e.currentTarget.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          e.preventDefault();
                          cancelStoragePanelEdit();
                        }
                      }}
                      autoFocus
                      rows={Math.min(
                        8,
                        Math.max(
                          3,
                          storagePanelEditDraft.split("\n").length,
                        ),
                      )}
                      aria-label={`Edit value of ${entry.key}`}
                      className="w-full resize-y border border-soft bg-paper p-1 font-mono text-[9px] text-ink"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveStoragePanelEdit(entry.key)
                        }
                        aria-label={`Save edited value for ${entry.key}`}
                        title="Write the new value to localStorage. No JSON validation — caller is responsible."
                        className="border border-coral bg-coral px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-paper"
                      >
                        save
                      </button>
                      <button
                        type="button"
                        onClick={cancelStoragePanelEdit}
                        aria-label="Cancel edit"
                        title="Discard draft and revert"
                        className="border border-soft bg-paper px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
                      >
                        cancel
                      </button>
                      <span className="font-mono text-[9px] text-muted/70">
                        {storagePanelEditDraft.length} chars
                      </span>
                    </div>
                  </div>
                ) : storagePanelHideValues ? null : (
                  <div
                    className={
                      "overflow-y-auto break-all font-mono text-[9px] text-muted/80 " +
                      (storagePanelPrettyPrint
                        ? "max-h-40 whitespace-pre"
                        : "max-h-20")
                    }
                    title={entry.value}
                  >
                    {(() => {
                      const formatted = formatPanelValue(entry.value);
                      const truncated =
                        formatted.length > 200
                          ? formatted.slice(0, 200) + "…"
                          : formatted;
                      return renderHighlighted(truncated);
                    })()}
                  </div>
                )}
              </li>
            ))}
            {/* Per-category collapse / expand toggles. */}
            {(
              ["tree", "dropin", "other"] as const
            ).map((cat) => {
              const inFilter = allEntriesCategorySummary[cat].count;
              if (inFilter === 0) return null;
              const catBytes = allEntriesCategorySummary[cat].bytes;
              const collapsed =
                cat === "tree"
                  ? storagePanelCollapsedTree
                  : cat === "dropin"
                    ? storagePanelCollapsedDropin
                    : storageHealthCollapsedOther;
              const onToggle =
                cat === "tree"
                  ? handleSetStoragePanelCollapsedTree
                  : cat === "dropin"
                    ? handleSetStoragePanelCollapsedDropin
                    : handleSetStorageHealthCollapsedOther;
              return (
                <li key={`collapse-${cat}`}>
                  <button
                    type="button"
                    onClick={() => onToggle(!collapsed)}
                    aria-label={
                      collapsed
                        ? `Show ${inFilter} ${cat} entries`
                        : `Hide ${cat} entries`
                    }
                    title={
                      collapsed
                        ? `Show ${inFilter} hidden "${cat}" entries (${formatStoredBytes(catBytes)})`
                        : `Hide ${cat} entries from the list`
                    }
                    className="w-full border border-dashed border-soft bg-paper px-1.5 py-1 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-muted hover:border-coral hover:text-coral"
                  >
                    {collapsed
                      ? `+ show ${inFilter} ${cat} ${
                          inFilter === 1 ? "entry" : "entries"
                        } · ${formatStoredBytes(catBytes)}`
                      : `− hide ${cat} entries`}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <footer className="mt-2 flex flex-col items-stretch gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate">
              {(() => {
                const sourceLen =
                  storageHealthScope === "tree"
                    ? storageHealthEntries.length
                    : storageHealthAllEntries.length;
                const sourceBytes =
                  storageHealthScope === "tree"
                    ? storageHealthEntries.reduce(
                        (acc, e) => acc + e.bytes,
                        0,
                      )
                    : storageHealthAllEntries.reduce(
                        (acc, e) => acc + e.bytes,
                        0,
                      );
                const visible =
                  storageHealthScope === "tree"
                    ? filteredAndSortedTreeEntries
                    : filteredAndSortedAllEntries;
                const visibleBytes = visible.reduce(
                  (acc, e) => acc + e.bytes,
                  0,
                );
                const filterActive = storageHealthFilter.trim() !== "";
                if (filterActive) {
                  return (
                    <>
                      matching {visible.length} of {sourceLen} ·{" "}
                      {formatStoredBytes(visibleBytes)} of{" "}
                      {formatStoredBytes(sourceBytes)}
                    </>
                  );
                }
                return (
                  <>
                    {visible.length}{" "}
                    {visible.length === 1 ? "key" : "keys"} ·{" "}
                    {formatStoredBytes(visibleBytes)} total
                  </>
                );
              })()}
            </span>
            <span className="shrink-0">esc · g · t/a</span>
          </div>
          {storageHealthScope === "all" &&
          filteredAndSortedAllEntries.length > 0 ? (
            <div className="text-muted/70">
              tree {allEntriesCategorySummary.tree.count}{" "}
              {formatStoredBytes(allEntriesCategorySummary.tree.bytes)}
              {" · "}
              dropin {allEntriesCategorySummary.dropin.count}{" "}
              {formatStoredBytes(allEntriesCategorySummary.dropin.bytes)}
              {" · "}
              other {allEntriesCategorySummary.other.count}{" "}
              {formatStoredBytes(allEntriesCategorySummary.other.bytes)}
            </div>
          ) : null}
        </footer>
      </div>
    </>
  );
}
