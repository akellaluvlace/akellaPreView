# Dropin Code Quality Audit — 2026-05-04

## THEME A — `lib/tree-persistence.ts` pure-parser export explosion

### Issue 1 — `measureStoredTreeStateBytes` exported but never called
- File: `lib/tree-persistence.ts:596`
- Severity: medium
- The function is mentioned only in comments — never imported, never called from application or test code. Superseded by `predictStoredTreeStateBytes`.
- **Fix:** Delete (596–619).

### Issue 2 — 14 `parseStoragePanel*` functions exported but only called internally
- File: `lib/tree-persistence.ts` (lines 1063, 1366, 1417, 1576, 2028, 2103, 2148, 2198, 2324, 2358, 2411, 2644, 2733, 3071)
- Severity: medium
- These are used exclusively inside the corresponding `readStored*` wrapper. ElementTree.tsx imports only the `readStored*` / `writeStored*` impure variants.
- **Fix:** Remove the `export` keyword. Drops public API surface by ~14 names with zero behavior change.

### Issue 3 — `clearStoredDepth` and `clearStoredQuery` exported but unused outside
- File: `lib/tree-persistence.ts:281,288`
- Severity: low
- Both are never imported by any other file. The composite `clearAllStoredTreeState` is the actual entry point.
- **Fix:** Remove `export`.

### Issue 4 — `describeStoredTreeStateEntries` and `describeAllStoredEntries` exported but unused outside
- File: `lib/tree-persistence.ts:1122,1198`
- Severity: low
- Both pure-walk helpers are called only by their impure wrappers in the same file.
- **Fix:** Remove `export`.

### Issue 5 — `parseSchemaVersionFromKey` exported but unused outside
- File: `lib/tree-persistence.ts:498`
- Severity: low
- Called only inside `migrateLegacyStoredTreeState`. The bench inlines its own copy.
- **Fix:** Remove `export`.

### Issue 6 — Six more pure helpers exported but unused outside
- File: `lib/tree-persistence.ts` (lines 981, 784, 878, 129, 222, 365)
- Functions: `parseDragGhostFormat`, `parseSubtreeDepthCapOverride`, `parseStorageBytesThresholdOverride`, `serializeStoredDepth`, `serializeStoredExpanded`, `serializeStoredSubtreeDepths`
- Severity: low
- Same pattern — pure helpers only called by their impure siblings.
- **Fix:** Remove `export`.

## THEME B — TREE_PERSISTENCE_CONSTANTS over-extension

### Issue 7 — `TREE_PERSISTENCE_CONSTANTS` re-exports every module-private constant
- File: `lib/tree-persistence.ts:3292–3358`
- Severity: medium
- The object now has 47 members — including internal localStorage key strings only used by the cross-tab subscription handler. Constants mirror pattern is useful for bench caps; overkill for the 20+ key strings.
- **Fix:** Trim to numeric/string bounds that benches actually lock. Re-export key strings as named constants if needed.

## THEME C — ElementTree.tsx panel-polish overrun

### Issue 8 — File-level header is materially false
- File: `components/ElementTree.tsx:1–22`
- Severity: medium
- Header states "Expand state is local to the rail (no persistence across iframe rebuilds)" but the file now contains an entire persistent debug panel with localStorage schema, cross-tab sync, import/export pipeline, snapshot pinning, regex filter, and shareable URL encoding.
- **Fix:** Replace with short accurate summary of current scope.

### Issue 9 — `handleResetTreePreferences` is a maintenance hazard
- File: `components/ElementTree.tsx:932–981`, `lib/tree-persistence.ts:3248–3289`
- Severity: medium
- Manually resets ~14 React state slices. Each new chunk requires three edits (reset handler + clearAllStoredTreePreferences + cross-tab sync switch).
- **Fix:** Introduce `StoragePanelPrefs` interface bundling all preference-tier state, plus `readAllStoragePanelPrefs()` factory and `defaultStoragePanelPrefs()` constant.

### Issue 10 — Pass-attribution comment graveyard
- Files: `components/ElementTree.tsx`, `lib/tree-persistence.ts` (pervasive)
- Severity: medium
- ~80+ inline `// Thirty-N-pass chunk (xxx) —` comments scattered throughout. They describe the addition sequence, not current semantics. New developers can't refactor without checking whether chunk labels are referenced elsewhere.
- **Fix:** Strip chunk-attribution comments from function/JSX bodies. Keep only interface-level docblocks.

### Issue 11 — `partitionAllEntriesByOtherCollapse` is dead code
- File: `lib/tree-persistence.ts:1537`
- Severity: low
- Superseded by `partitionAllEntriesByCategoryCollapse` (chunk-ooo). Grep confirms not imported anywhere in `.ts`/`.tsx`.
- **Fix:** Remove function (1537–1561) and `CollapsibleAllEntriesView` interface (1531–1535). Verify bench doesn't exercise.

## THEME D — Naming / abstraction inconsistencies

### Issue 12 — `readStoredStoragePanelFoo` double-nesting
- File: `lib/tree-persistence.ts` (pervasive from ~line 1069)
- Severity: low
- Earlier helpers follow `readStoredDepth`/`readStoredQuery` (clean). Later helpers are `readStoredStoragePanelScope`/`readStoredStoragePanelSort` etc. — "StoragePanel" is redundant.
- **Fix:** Cosmetic rename pass: `readStoredStoragePanelFoo` → `readStoredPanelFoo`.

### Issue 13 — `parseStoredQuery` and `parseStoragePanelFilter` are structurally identical
- File: `lib/tree-persistence.ts:157,1417`
- Severity: low
- Both clamp `string | null` to a max length (both 256). Comment at 1412 even acknowledges identity. Copy-paste duplication.
- **Fix:** Extract `clampStoredString(raw, maxLen)` helper.

### Issue 14 — `predictStoredTreeStateBytes` claims pure but reads localStorage
- File: `lib/tree-persistence.ts:643–684`
- Severity: medium (semi-bug)
- Docblock says "Pure — no localStorage / window access" but line 678 calls `readEffectiveSubtreeDepthCap()` which reads `window.localStorage`. Mismatch means: (a) function can throw in SSR if guard reached unexpectedly, (b) benches relying on purity claim silently read live localStorage.
- **Fix:** Thread effective cap as a parameter (`cap = SUBTREE_DEPTH_MAX_ENTRIES`).

### Issue 15 — Stale "eighteenth pass" reference in ElementTree header
- File: `components/ElementTree.tsx:17`
- Severity: low
- Header references "eighteenth pass" polish; actual is 42nd+. Misleading.
- **Fix:** Remove the sentence.

## Things that look bad but are intentional (skip these)

- Try/catch on every localStorage call with silent fallback — correct (private mode, quota exhaustion).
- `if (typeof window === "undefined")` guards — correct for Next.js SSR.
- `TREE_PERSISTENCE_CONSTANTS` re-exporting numeric cap values — load-bearing for ElementTree reset handler.
- ~47 `else if` branches in cross-tab sync — structurally sound; per-key granularity is unavoidable.
- `serializeStoredExpanded` exported without external callers — bench inlines its own copy by design.

## Top 3 Themes

1. **`lib/tree-persistence.ts` export surface explosion.** ~90 exports, only ~40 imported externally. ~20 `export` keywords removable with zero behavior change.
2. **`components/ElementTree.tsx` panel-polish overrun.** 7076-LOC monolith with 26 chunk-attribution comments and a 50-line reset handler that requires three-edit-per-chunk maintenance.
3. **Comment rot from incremental-polish attribution.** ~80 `// Thirty-N-pass chunk (xxx) —` comments + materially false file-level header.

## Top 3 Most Actionable Issues

1. **Delete `measureStoredTreeStateBytes`** — exported, never called, superseded.
2. **Fix `predictStoredTreeStateBytes` purity violation** — thread cap as parameter; medium-risk bug for benches relying on purity claim.
3. **Remove `export` from 20+ unused-externally helpers** — mechanical change, cuts module API surface in half.
