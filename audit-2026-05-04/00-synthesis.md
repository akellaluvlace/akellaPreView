# Dropin Audit Synthesis — 2026-05-04

Audit dispatched as 6 parallel agents covering architecture, test quality, silent failures, code quality, doc drift, and tools/runtime. Reports in this directory:

- `01-architecture.md` — file-size + module-boundary analysis
- `02-tests.md` — bench/test trustworthiness
- `03-silent-failures.md` — error swallowing audit
- `04-code-quality.md` — dead code / duplicates / overengineering
- `05-doc-drift.md` — docs vs reality
- `06-tools-runtime.md` — tooling + runtime smoke

---

## TL;DR

**The product actually works.** Servers up on 3001 + 3002, all routes return 200, gallery renders 111/111 templates. tsc 0, vitest 4022 pass, all 39 benches pass.

**But the signal is misleading.** The "4022 tests pass" number is inflated, the bench harness can't tell real benches from fake ones, at least one bench inlines an obsolete copy of code so it tests itself rather than production, and **0 of the tests verify the actual product flow** (paste HTML → render). All current tests are pure-logic helpers + the test environment is `node`, not jsdom.

**The codebase is structurally bloated**, primarily from the 26-chunk debug-panel polish run. Three high-ROI extractions would cut total LOC by ~5000 with zero behavior change.

**There's one real semantic bug** (`predictStoredTreeStateBytes` claims pure but reads localStorage), three real silent-failure UX hazards (relative-import drop, clipboard-rejection swallow, multi-op per-element bail silenced), and one real security advisory (`next@14.2.33` has 7 open advisories; bump to `14.2.35` is in-band with the locked 14.2.x range).

---

## Where we're crooked

### 1. The test signal lies (CRITICAL)

The `tests/_runBench.ts` bridge spawns each `scripts/bench-X.mjs` as a subprocess and parses stdout for `PASS:` / `FAIL:` regex. Its only real signal is exit code; everything else is screen-scraped.

Empirically demonstrated: a `.mjs` doing nothing but `console.log("PASS: fake"); process.exit(0)` is reported green. Every `tests/*.test.ts` is `runBench("bench-X")`; there are zero hand-written unit tests.

**Concrete drift case found:** `scripts/bench-resize.mjs` (297 LOC) inlines `applyResize` with the comment "Mirrors `lib/ast/operations/resize.ts` exactly — keep them in sync if the operation engine evolves." The lib was refactored eleventh-pass into a 12-LOC wrapper around `applyStyleProps`. The bench still has the old 130-LOC algorithm. **Bench passes 8/8 against itself, but it isn't testing production code.**

The 4022 vitest count is inflated: `_runBench.ts` synthesizes per-case `it()`s from PASS:/FAIL: rows AND from summary lines AND adds an aggregate `(bench exits 0)` per file — multiple counters for the same work. Sum of inline summaries across all 39 benches: **2413 actual cases**.

**Coverage gap:** `lib/preview.ts` (2531 LOC, the iframe runtime — the heart of the product) has zero test coverage. `Workspace.tsx` (2815), `SelectionOverlay.tsx` (3519), `Preview.tsx` (1087), `ElementTree.tsx` (7076 — only ~50 LOC mirrored). All component layer untested. No integration tests at all.

### 2. ElementTree.tsx is two products in one (HIGH)

7076-LOC monolith hosting both the element tree and an entire localStorage debug panel (~1800 lines of JSX, 35 useState/useRef, 20 useMemo, 15 useCallback). The panel was added across 26 sequential "polish chunks" and now overshadows the tree it's nested in.

Header comment claims "Expand state is local to the rail (no persistence across iframe rebuilds)" — materially false; the file now persists 17+ preference keys with cross-tab sync, regex filter, snapshot pinning, shareable URL encoding.

### 3. lib/tree-persistence.ts mixed two unrelated domains (HIGH)

3358 LOC split roughly 960 (tree-state persistence — the original purpose) + 2400 (storage panel UI prefs / data formatters / import-export / regex / snapshot / preset URLs). Same `KEY_NAMESPACE` so they coexist, but the panel half is independent and has its own life.

### 4. bench-tree-persistence.mjs duplicates ~500 LOC from the module it benches (MEDIUM)

5621-LOC bench file inlines re-implementations rather than importing from `lib/tree-persistence.ts`. Logic bugs in production may pass the bench because the bench tests its own copy. Same anti-pattern as bench-resize but at much larger scale.

### 5. One real semantic bug found (MEDIUM)

`lib/tree-persistence.ts:643` — `predictStoredTreeStateBytes` docblock says "Pure deterministic counterpart to measureStoredTreeStateBytes." But line 678 calls `readEffectiveSubtreeDepthCap()` which reads `window.localStorage.getItem(...)`. Two failure modes:
- (a) Can throw in SSR if guard fails (low risk in practice; the function is only called from React state)
- (b) Benches relying on the purity claim silently read live localStorage rather than using injected args

Fix: thread the cap as a parameter (`cap = SUBTREE_DEPTH_MAX_ENTRIES`).

### 6. Three real silent-failure UX hazards (MEDIUM)

Of ~140 catch blocks audited, most are legitimate (SSR + localStorage degradation). But three sites swallow user-visible errors:

- **`lib/preview.ts:2335`** — Relative imports in user JSX (`import Foo from "./Foo"`) are silently stripped. User sees "Foo is not defined" runtime error with no hint that the import was eaten. The unsupported-package branch right next to it correctly throws a clear error; the relative branch should match.
- **`components/Workspace.tsx:833` + `:2596`** — Both clipboard `writeText` calls swallow rejection (NotAllowedError, SecurityError, non-focused tab). User clicks Copy, sees no feedback, pastes garbage from prior clipboard. `showWarn` toast is right there.
- **Workspace multi-op handlers (~9 sites)** — Per-element bail reasons in batch operations only `console.debug`-gated. User shift-selects 5 elements, runs an action, gets "Inserted into 3 elements" with no signal that 2 silently bailed.

### 7. Security advisories (MEDIUM — partially deferred)

`npm audit --omit=dev`:
- `next@14.2.33 → 14.2.35` was bumped (latest in locked 14.2.x range). **Correction to original audit:** the next advisories affect ALL 14.x versions; npm's `fixAvailable` points at `next@16.2.4` which is a SemVer-major bump and violates the locked stack rule. Staying on 14.2.35 (latest-patch-within-locked-range) and accepting the advisories as known gap.
- `dompurify` (via `monaco-editor`) carries 8 advisories — client-only surface but ships to users. `monaco-editor` is in the locked stack; bump path needs verification before any change.
- `postcss` moderate (XSS) — locked too.

**Posture:** locked stack > security advisories on a non-public dev tool. The advisories are well-known DoS / request-smuggling against next's server-side surface; Dropin's actual production deploy posture (currently dev-mostly, not yet hardened for hostile traffic) means the practical risk is low. Re-evaluate when the product goes to a public production deploy.

### 8. Doc drift (LOW–MEDIUM, but everywhere)

- `phase5-tools-isolation.md:3` says "Status: not started" — but **all 16 § 6 acceptance criteria are shipped**.
- `plan.md:87` pins `"next": "14.2.5"` — actual is `14.2.33`. plan.md deps list is missing 12 of 16 actual runtime deps.
- `phase2.md` describes `/api/generate-component` server-key flow with Upstash; reality is `/api/llm-rewrite` BYO-key with in-memory rate-limiting. Entirely superseded.
- `CLAUDE-archive.md:286` still references `DiceBar.tsx` and `lib/dice/` — both deleted.
- `CLAUDE.md` "current status" was one pass behind memory until I just updated it (this audit).

**Confidence in rolling status memory: HIGH** — all 11 spot-checked symbols from 42nd-pass claims are present at exact positions.

### 9. ~80 chunk-attribution comments are noise (LOW)

`// Thirty-N-pass chunk (xxx) — ...` scattered through ElementTree.tsx and tree-persistence.ts. They describe the addition sequence, not current semantics. New developers can't refactor without checking whether labels are referenced elsewhere.

### 10. ~20 unused-externally exports (LOW)

`measureStoredTreeStateBytes`, 14 `parseStoragePanel*` functions, `clearStoredDepth`/`clearStoredQuery`, `describeStoredTreeStateEntries`/`describeAllStoredEntries`, `parseSchemaVersionFromKey`, plus 6 more pure helpers — exported but only called inside `lib/tree-persistence.ts` itself. Mechanical change to remove `export` cuts the public API surface in half with zero behavior change.

### 11. partitionAllEntriesByOtherCollapse is dead code (LOW)

Superseded by `partitionAllEntriesByCategoryCollapse` (chunk-ooo). Grep confirms no external imports.

---

## Where we are right (don't break these)

- **Module dependency graph is a clean DAG.** No circular imports. lib has zero imports from components.
- **AST operations are exemplary.** All 13 catches in `lib/ast/operations/*` thread bail reasons through `unchanged: true; reason: string` and Workspace surfaces every one via `showWarn` toast.
- **localStorage degradation is correct.** Every call wraps in try/catch with silent in-memory fallback. SSR guards everywhere.
- **TypeScript is honest.** tsc clean, no `any` smuggling, no `@ts-ignore` graveyard.
- **Real benches that exist test real logic.** Sampled 5 random non-suspect benches (flip, oids, resize, style, tree-filter) — they build real inputs and assert real outputs; they aren't stubs (the issue is the harness can't tell stubs apart, not that current benches are stubs).
- **Routing works.** /, /gallery, /playground, /t/[slug] all render 200 with no error markers in served HTML.

---

## What we can't verify (banned-tool blind spots)

- **Production bundle size** — no way to detect Webpack tree-shake regressions without `next build`
- **Production `'use client'` boundaries / prerender output** — dev mode is permissive; the documented `/gallery` searchParams trap could re-surface silently in prod build
- **Tailwind purge correctness** — dynamically-constructed classes only fail on prod build

These three are the cost of the "no `next build`" rule. Worth knowing.

---

## Recommended next moves (ranked)

### Immediate (do now)

1. **Extract `StorageHealthPanel` from `ElementTree.tsx`** — option (a) per user. Cuts ElementTree from 7076 → ~2200 LOC. Highest-ROI single change in the audit.
2. **Split `lib/tree-persistence.ts` → `lib/storage-panel.ts`** — pure module split, low risk. Cuts the file from 3358 → ~960 LOC focused on tree state only.
3. **Fix `predictStoredTreeStateBytes` purity violation** — thread `cap` as parameter. Real semantic bug.
4. **Fix three silent UX failures** — `preview.ts:2335` relative-import strip, Workspace clipboard rejection, multi-op bail silencing. ~30 min total.
5. **Bump `next@14.2.33 → 14.2.35`** — drop-in patch, lifts 7 security advisories, in-band with locked range.

### Soon (within next session)

6. **Refactor bench files to import from production** — eliminate the inline-mirror anti-pattern. Start with bench-resize (the verified-broken case), then bench-tree-persistence.
7. **Pick one real backlog item** — option (b). Candidates:
   - `(b)` AI rewrite SSE streaming — meaty but bounded
   - `(c)` multi-file component-instance propagation — bigger, more impact
   - `(e/f/s)` mobile/touch gestures — reaches the no-terminal audience directly
8. **Update `phase5-tools-isolation.md`** to "Status: shipped" with the audit's compliance evidence
9. **Archive `plan.md`, `phase1.md`, `phase2.md`** — superseded by current specs

### Eventually

10. **Add jsdom integration tests for the actual product flow** — paste HTML → injectOids → render in iframe → click → select → edit. Even ONE end-to-end test would cover more than the current 4022-but-really-2413-but-actually-fake-able count.
11. **Strip ~80 chunk-attribution comments** from ElementTree.tsx and tree-persistence.ts. Comment-rot cleanup.
12. **Demote ~20 unused exports** in lib/tree-persistence.ts. Mechanical.
13. **Extract pure tree utilities** from ElementTree.tsx → `lib/ast/tree-utils.ts`. Removes "use client" barrier.
14. **Consider splitting SelectionOverlay.tsx** into resize/spacing/move controllers. High cost, lower ROI than the others.
15. **Add ESLint** — currently no config. Won't catch what's broken now but prevents future drift.

---

## What we are NOT going to do

- Add a 7th polish chunk to the storage panel
- Run `next build` (CLAUDE.md rule 5 — the bundle-size gap is acknowledged)
- Bump the locked stack (Next.js 14.2.x → 14.2.x patch only; Tailwind / Monaco / parse5 / babel / magic-string stay pinned)
- Mass-revert the 42nd pass — green tsc/bench/vitest means the bloat doesn't break anything, and reverting destroys work for no functional benefit. The fix is extraction, not deletion.
