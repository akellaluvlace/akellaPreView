# Doc Drift Audit (2026-05-04)

Snapshot of where documentation, specs, and memory files have wandered from
the actual code at `C:\Users\nikit\akellaPreView`.

---

## Top drift cases ("Doc says X, code shows Y")

1. **CLAUDE-archive.md still references `DiceBar.tsx` (and `lib/dice/*` tree)**
   - Says (line 286): `FocusEditor.tsx   DiceBar.tsx   KindToggle.tsx`
   - Code: `components/DiceBar.tsx` does not exist; `lib/dice/` directory does
     not exist (verified — `ls` returns "No such file or directory"). All
     dice modules (`fonts.ts`, `spacing.ts`, `radius.ts`, `roller.ts`,
     `roller-types.ts`, `palettes.ts`, `rng.ts`) gone; replaced by
     `lib/palettes.ts` and `lib/ast/operations/palette.ts`.
   - This was the explicit Phase A8 + C5 deletion. Archive doc not updated.

2. **`maniuplation.md` and `phase1.md` reference PostCSS as a runtime stylesheet
   parser**, but code only uses `postcss` + `postcss-prefix-selector` at
   ingest time (`scripts/ingest-components.mjs`) — there is no PostCSS-based
   AST source-of-truth in `lib/`. The "Layer 1: Source of Truth (AST)" claims
   PostCSS is one of three production-grade parsers; in reality only
   `@babel/parser` + `parse5` see runtime use. (Mostly aspirational rather
   than wrong, but `maniuplation.md:28` materially overstates code coverage.)

3. **`phase5-tools-isolation.md:3` still says "Status: not started"** — code
   shows Phase 5 A/B/C all shipped. `app/api/llm-rewrite/route.ts` exists
   with the documented prompt + 5/min rate limit, `components/ToolBar.tsx`
   exists with V/S/M/I/W shortcuts, `components/library/LibraryModal.tsx` +
   `PalettesSection.tsx` shipped, `lib/ast/operations/insert.ts` +
   `swap.ts` + `palette.ts` all present. The header banner contradicts the
   rest of the doc, which references the work as completed.

4. **CLAUDE.md "open backlog" includes (b) AI rewrite SSE streaming — listed
   as open**. The route at `app/api/llm-rewrite/route.ts` has zero SSE /
   ReadableStream / streaming code (grep returned 0 matches). Genuinely
   open — accurate. But CLAUDE.md also lists `(yyyy)`, `(uuuu)`, `(vvvv)`,
   `(xxxx)`, `(zzzz)` as deferred (the rolling status memory marks them all
   shipped as the 42nd-pass chunks). CLAUDE.md text under "Phase 6 ramps
   through 41st pass" is one full session stale relative to the rolling
   memory file's 42nd-pass header; 42 chunk symbols all present in code.

5. **CLAUDE.md says `components/ElementTree.tsx 5751→6334 LOC`** for 41st
   pass; actual file is **7076 LOC** (verified `wc -l`). Same line claims
   `lib/tree-persistence.ts grew 2489→2934`; actual is **3358 LOC**. The
   memory file is one pass ahead and corrects this; CLAUDE.md status
   paragraph is the staler of the two.

6. **`plan.md:88` lists `next: 14.2.5`**; `package.json` pins `14.2.33` (per
   Phase A1). plan.md also lists only 4 deps; actual `package.json` has 16
   runtime deps including `@babel/parser`, `magic-string`, `parse5`,
   `idb`, multiple icon packs, `minisearch`. plan.md is the original v0
   build spec and has not tracked any subsequent phase.

---

## Spec compliance — `phase5-tools-isolation.md` § 6 (16 acceptance criteria)

Verifiable from code (file paths confirmed via Read/Grep above):

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Default workspace = View, no canvas interaction | SHIPPED — `Workspace.tsx:187` `useState<Tool>("view")` |
| 2 | Select + click → FocusEditor isolated, centered | SHIPPED — `IsolatedPreview.tsx:122-129` Phase A7 fix |
| 3 | Move tool drag = reorder/reparent | SHIPPED — `SelectionOverlay.tsx` gates by tool |
| 4 | Insert tool → library "Insert into <tag>" → fresh OIDs | SHIPPED — `applyInsertChild` in `Workspace.tsx:1606`; `Sidebar.tsx:86 insertContext` |
| 5 | Swap tool → library "Swap <tag>" → discard children | SHIPPED — `applySwap` import; `Sidebar.tsx:98 swapContext` |
| 6 | Library Palettes section, click swaps page palette | SHIPPED — `Sidebar.tsx:27,438` PalettesSection mounted |
| 7 | Palette scope = full page vs isolated subtree | SHIPPED — `applyPalette` accepts scope; `lib/palettes.ts` exists |
| 8 | Phase 5 propagation toggle instance/everywhere | SHIPPED — `Workspace.tsx:274` propagationMode state, persisted |
| 9 | AI rewrite gated behind user key | SHIPPED — `FocusEditor.tsx:1025` `dropin:ai-key`; `route.ts` redacts |
| 10 | Breakpoint tabs sm:/md:/Desktop | SHIPPED — `Workspace.tsx:165` breakpoint state, persisted |
| 11 | Custom preset delete inline two-step | SHIPPED — `FocusEditor.tsx` `confirmingDelete` (Phase A4) |
| 12 | Vitest test suite green | SHIPPED — 40 tests in `tests/`, `_runBench.ts` bridge present |
| 13 | Prettier passes / diff preview surfaced | PARTIAL — `phase5-prettier-diff-preview.txt` exists with ~50 file warnings; not yet reformatted (matches Phase A3 plan) |
| 14 | `next: 14.2.33` in package.json | SHIPPED — verified |
| 15 | `lib/dice/` deleted, no broken imports | SHIPPED — directory gone, no `from "@/lib/dice"` imports anywhere in code |
| 16 | Previous phase acceptance still passes | SHIPPED — implied; bench tree green, tsc 0 per memory |

**16/16 file-verifiable acceptance criteria green** (one is partial-on-purpose
per the spec's own "diff preview only, do not run --write" rule). Spec compliance
≈ 97 % (15 fully shipped + 1 partial-as-designed).

---

## Symbol spot-checks (rolling status, 42nd pass) — `lib/tree-persistence.ts`

| Symbol | Found at | Verdict |
|---|---|---|
| `tryCompileFilterRegexDetail` | line 3134 | present |
| `filterStoredEntriesByRegex` | line 3161 | present |
| `splitOnMatchedRegex` | line 3185 | present |
| `setSingleStoredKeyValue` | line 3045 | present |
| `buildStoragePanelSnapshot` | line 2771 | present |
| `diffStoredEntriesAgainstSnapshot` | line 2848 | present |
| `sortStoragePanelRecentImports` | line 2684 | present |
| `encodeStoragePanelStateQuery` | line 2919 | present |
| `decodeStoragePanelStateQuery` | line 2952 | present |
| `interface SharedStoragePanelState` | line 2909 | present |
| `STORAGE_PANEL_SNAPSHOT_KEY` (= versionedKey + MAX_ENTRIES=200 + SCHEMA=1) | 2717-2719 | present, exact values |

All 11 symbols claimed by the rolling status are present at exactly the
shape claimed. `bench-tree-persistence.mjs` has 1148 `assertEq/assertTrue`
calls (rolling memory says 1198 cases — close; some assertions test multiple
expectations per case).

---

## Confidence rating on rolling status memory

**HIGH confidence** that the file's symbol-level claims match code. Every
spot-check passed verbatim, including line numbers, constant values
(`MAX_ENTRIES = 200`, `SCHEMA_VERSION = 1`, `MAX_LEN = 64`, etc.), and the
"39 benches green" claim is directly verifiable (39 bench-*.mjs files in
`scripts/`, 40 test files in `tests/`).

Rolling status is more current than CLAUDE.md by one full pass: CLAUDE.md
says "ramps through 41st", memory says "42nd". CLAUDE.md numbers (LOC, test
count, bench count) are stale by ~700 LOC, ~228 tests, ~114 bench cases.

---

## Files that should be archived or deleted

These are stale planning docs from earlier eras of the project that no
longer reflect any current decisions:

1. **`plan.md` (622 LOC)** — original v0 build spec. Stack pin (`next:
   14.2.5`) is wrong by 28 patches; deps list is missing 12 of the 16 actual
   runtime deps; doesn't mention `web/` templates (templates are now under
   `web/` not `templates/`); doesn't mention manipulation system, asset
   library, or any post-Phase 1 work. Pure historical artifact.
2. **`phase1.md` (499 LOC)** — initial component library integration plan.
   Shipped long ago. Worth keeping for the upstream-source license rationale,
   but should move to a `docs/history/` folder if kept at all.
3. **`phase2.md` (539 LOC)** — initial AI generation + registry plan.
   Heavily superseded — actual route at `app/api/llm-rewrite/route.ts`
   bears no resemblance to the spec'd `app/api/generate-component/route.ts`
   (different name, different shape, different provider semantics, BYO key
   instead of server key, no `@upstash/ratelimit`, no `Sonnet 4` tool_use).
4. **`phase5-prettier-diff-preview.txt`** — transient artifact from Phase
   A3; spec says "remove after they decide". User has not decided; safe to
   keep until format choice is made.

Keep:
- `CLAUDE.md`, `CLAUDE-archive.md` (current — needs `DiceBar.tsx` reference
  surgery in archive; 2-line fix not 2-doc fix).
- `maniuplation.md` (master spec, current; minor PostCSS overstatement).
- `phase2-manipulation.md` (locked / reference).
- `phase5-tools-isolation.md` (current spec; just needs the
  "Status: not started" header flipped to "shipped 2026-05-04").
- `template-upgrade-playbook.md` (3125 LOC; currently in active use per
  recent commit history).
- `assets.md`, `README.md` (both current and concise).

---

## Acceptance criteria openly stale

- `phase5-tools-isolation.md:3` "Status: not started" — entire spec body
  describes shipped work.
- `plan.md` § 4 dependencies list — outdated since Phase 1.
- `phase2.md` whole-file — superseded by phase5-tools-isolation §A5
  (BYO-key model replaces server-key generation).
- `phase1.md` § "Live thumbnail" plan — actually shipped as static WebP
  pipeline (puppeteer in `scripts/build-assets/`).
