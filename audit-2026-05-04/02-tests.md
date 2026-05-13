# Test-quality audit — 2026-05-04

Auditing whether `tests/` (39 files, claim 4022 passing) and `scripts/bench-*.mjs` (39 files) actually verify the product, or whether they are "staged mocked tests made to pass."

---

## 1. Headline numbers (verified)

### Vitest

```
$ npm run test
Test Files  39 passed (39)
     Tests  4022 passed (4022)
  Duration  4.20s
```

The 4022 figure is real **as a count of `it()` blocks emitted by `_runBench.ts`**. It is NOT a count of independent unit tests (see §3).

### Benches (all 39 ran clean, exit 0)

Tallying the per-bench summary line each script prints:

| Bench | Cases | | Bench | Cases |
| --- | ---: | --- | --- | ---: |
| canvas-range | 31 | | reorder-multi | 25 |
| constraints | 33 | | reparent | 22 |
| contrast | 26 | | resize | 8 |
| delete | 22 | | resolver | 18 |
| drop-placeholder | 30 | | section-order | 44 |
| duplicate | 22 | | snap | 39 |
| flip | 16 | | spacing | 12 |
| gesture | 29 | | style | 18 |
| gradient | 38 | | swap | 34 |
| insert | 25 | | swap-category-hint | 92 |
| insert-multi | 14 | | tree | 50 |
| multi | 18 | | tree-collapse-subtree | 22 |
| multi-mod | 18 | | tree-dnd | 37 |
| multi-move | 12 | | tree-dnd-multi | 56 |
| oids | 12 | | tree-expand-depth | 37 |
| palette | 32 | | tree-filter | 42 |
| palette-apply | 30 | | tree-multi-keys | 93 |
| parse | 1 (aggregate) | | tree-persistence | **1198** |
| presets | 107 | | tree-range-select | 28 |
| reorder | 22 | | | |

**Sum: 2413 bench cases across 39 benches.** All exit 0. (Discrepancy with the 4022 vitest figure: `_runBench.ts` synthesizes per-case `it()` calls from summary lines AND runs an extra `(bench exits 0)` wrapper per file, plus benches that emit explicit `PASS:` rows often have more rows than their summary count — see §3.)

`tsc --noEmit` exits 0. Confirmed.

---

## 2. `tests/_runBench.ts` — the trust spine

Every `tests/<name>.test.ts` file is verbatim:

```ts
import { runBench } from "./_runBench";
runBench("bench-<name>");
```

No exceptions. **Zero hand-written unit tests in `tests/`.** All 4022 numerator tests come from one module spawning subprocess benches and parsing their stdout.

`runBench(name)`:
1. `spawnSync(node, scripts/<name>.mjs)`.
2. Concat stdout+stderr, split on newline.
3. For every line matching `/^\s*(?:PASS:|\[PASS\]|✓\s)/` → emit a passing `it()`.
4. For every line matching `/^\s*(?:FAIL:|\[FAIL\]|✗\s)/` → emit a failing `it()`.
5. For the first line matching `/^bench-[\w-]+:\s*(\d+)\/(\d+)/` (summary fallback) → synthesize that many `it()`s, marking the first `passed` of them PASS and the rest FAIL.
6. One trailing `it("(bench exits 0)")` that asserts `r.status === 0`.

### Verdict: **The bridge is structurally untrustworthy.**

I ran a literal staged bench:

```js
// /tmp/staged-bench.mjs
console.log("PASS: completely fake test that does nothing");
console.log("PASS: also fake");
console.log("staged-bench: 2/2 passed");
process.exit(0);
```

This script does no work. If wired up via `tests/staged.test.ts`, vitest would report **5 passing tests**: the 2 explicit `PASS:` rows, the 2 synthetic rows from the summary `2/2`, and the aggregate `(bench exits 0)`. The runner has no contract that the bench actually executed any logic before printing PASS — `printf "PASS:..." ; exit 0` is indistinguishable from real work.

Concrete failure modes the bridge does NOT catch:

1. **Empty bench**: an `.mjs` that just `process.exit(0)` with no PASS/FAIL/summary lines emits 0 it()s but still passes the `(bench exits 0)` aggregate. The test file looks green — vitest doesn't warn that a `describe()` block emitted zero children.
2. **Missing test fn calls**: a bench can declare 100 `cases` and only iterate 10 (off-by-one bug, early `return`) — the only signal would be the summary line, which the bench itself prints from `cases.length`. If the bench prints `100/100 passed` from a counter that was wrong by construction, the bridge believes it.
3. **Drifted inline copy**: every bench except `bench-parse` re-implements the lib code inline rather than importing it (CLAUDE.md "no test harnesses unless asked" framing). A bench stuck at vN of an algorithm passes its inline assertions while the lib is at vN+1 and broken — see §4 for `bench-resize.mjs` doing exactly this.

The bridge's only real signal is the exit code. With pure-logic benches that throw on assertion failure that's adequate IF the inline logic mirrors the lib. The bridge cannot give us anything stronger.

---

## 3. Bench quality — sampled non-tree-persistence files

### Sample 1 — `scripts/bench-flip.mjs` (16 cases)

- Inlines `FLIP_THRESHOLD_PX = 1` + the entire `detectDrift()` body.
- Cross-checked against `lib/ast/flip.ts:49-80` — **byte-identical algorithm**.
- Cases exercise: identical rects (no drift), sub-px noise (under threshold), boundary inclusion (exactly 1px), positional drift, width/height grow, vanished canonical (zero size), mixed motion. Includes the center-anchored 4px-each-side case.
- Real coverage of edge cases. Numerical assertions via `approxEq` (1e-6 tol). **High quality.**
- Drift risk: low — flip.ts is a 32-line file that hasn't moved in passes.

### Sample 2 — `scripts/bench-oids.mjs` (12 cases)

- Inlines `ALPHA`, `OID_LEN`, `makeOid()`. Verified against `lib/ast/oids.ts:25-92` — **byte-identical**.
- Cases: determinism (same seed → same string), specific known encodings (`makeOid(0)='aaaaaaaa'`, `makeOid(62)='aaaaaaba'`, etc.), length invariant, alphabet invariant, distinctness over 100 seeds, random-fallback distinctness over 10 calls, cross-version stability check.
- Tests the actual hydration-fix invariants (CLAUDE.md gotcha #13). **High quality.**
- Drift risk: low — `oids.ts` is the locked surface for hydration safety.

### Sample 3 — `scripts/bench-resize.mjs` (8 cases)  ⚠️  **DRIFTED**

- Comment claims "Mirrors lib/ast/operations/resize.ts exactly — keep them in sync."
- Reality: `lib/ast/operations/resize.ts` was refactored in the eleventh pass into a 12-line wrapper that delegates to `applyStyleProps` from `./style`. The bench inlines a 130-line v1-era `applyResize` that no longer exists in production.
- The bench passes (8/8) because the v1 inline algorithm and the v2 wrapper produce the same output on the cases the bench tests. **But the bench is no longer testing production code.** It's testing a reference implementation that drifted out of sync.
- Test names: simple cases — insert style attr, overwrite width, append height, bail on `cn()`, missing oid, no width/height, lowercase oid case. **Happy path coverage only.**
- This is the canonical example of the inline-helper-drift hazard.

### Sample 4 — `scripts/bench-style.mjs` (18 cases)

- Inlines `applyStyleProps` from `lib/ast/operations/style.ts`.
- Cross-checked against `lib/ast/operations/style.ts:59-346` for the first 200 lines — algorithm matches but bench inline is only ~190 lines vs lib 290 lines. Only the first removal-handling branch is covered; the per-property splice + comma-consume logic at lines ~278-340 of lib has fewer corresponding cases.
- Cases include: empty decls (no-op), all-undefined, fresh insert, overwrite, append, mixed write+remove, all-remove (clean interior overwrite path), bail on string-literal style, bail on `someStyle()` call, bail on member-expression value.
- Better edge-case coverage than `bench-resize` but still happy-path-leaning. The "all existing props removed" path is exercised; the "remove middle prop with surrounding commas" splice path is lightly covered.
- Drift risk: medium — `applyStyleProps` is the engine for the entire Properties Panel; refactor here would silently desync.

### Sample 5 — `scripts/bench-tree-filter.mjs` (42 cases)

- Inlines `nodeKey`, `locKey`, `nodeMatchesQuery`, `buildVisibleKeys`.
- Cross-checked against `components/ElementTree.tsx:343-390` — **byte-identical algorithm.**
- Coverage: empty query → null, tag prefix match, class substring match, OID exact match (case-insensitive), ancestor inclusion, multiple matches, no match, deep nesting, sibling matches, mixed matches.
- Real coverage of the tree-filter UX invariant.
- Drift risk: medium — `ElementTree.tsx` is the most-edited file in the codebase (5751 → 6334 LOC across recent passes). The filter helpers have remained stable but live in the same file as 6300 LOC of churn.

### Aggregate quality observation

- **Algorithms are exercised, not stubbed.** None of the 5 sampled benches has fake assertions or trivially-true cases. They build inputs, call a function, compare outputs.
- **Inline-helper drift is a real, present hazard.** `bench-resize` is already drifted. The "inline so the script runs without a TS build step" tradition (CLAUDE.md "no test harnesses unless asked") sacrifices the single-source-of-truth property the comment in `_runBench.ts` claims to be preserving.
- **Edge-case coverage is uneven.** Some benches (oids, flip, tree-filter) have thorough boundary cases. Others (resize, spacing, insert) lean on happy paths.
- **Zero negative testing of the bridge itself.** No bench deliberately FAILs to verify `_runBench.ts` reports failure correctly. The only signal that the FAIL path works is that humans presumably saw it work historically.

---

## 4. Coverage gaps — load-bearing files with NO test path

### `lib/` files matched to a bench

✅ Covered: `lib/ast/{constraints,flip,oids,snap,tree-dnd}.ts`, `lib/ast/operations/{delete,duplicate,insert,palette,reorder,reorder-multi,reparent,resize,spacing,style,swap}.ts`, `lib/{canvas-range,contrast,swap-category-hint,tree-persistence,style-presets,tailwind-palette}.ts`, `lib/ast/{gesture-math,intent-resolver}.ts`, `lib/component-library/insert.ts`.

❌ **Untested lib files (sorted by load-bearing first):**

| File | LOC | Role | Risk |
| --- | ---: | --- | --- |
| **`lib/preview.ts`** | **2531** | Iframe runtime — Babel-in-browser, OID injection, dropinSerializeTree, srcDoc builder. Most load-bearing single file in the project. | **Critical** |
| **`lib/source-patch-jsx.ts`** | 411 | The OTHER source-rewrite path — used by Inspector / data-dropin-loc flow. 9 exported functions, none touched by any bench. | High |
| **`lib/iframe-bridge.ts`** | 379 | postMessage protocol between Workspace and iframe. encode/decode JsxLoc. | High |
| **`lib/use-source-history.ts`** | 188 | Undo stack + injectOids lazy init (the gotcha #13 site). | High |
| **`lib/source-patch-html.ts`** | 176 | HTML-template rewrite path mirror of source-patch-jsx. | High |
| `lib/component-library/{client,html-to-jsx,scope,search,types}.ts` | ~456 | Component Library card → source insert pipeline. | Medium |
| `lib/asset-library/insert-{decorative,emoji,font,icon,illustration,image,palette,pexels-photo,pexels-video,svg-icon}.ts` | ~837 | 10 asset insert helpers — every left-rail asset commit funnels through one. | Medium |
| `lib/asset-library/{recent,types}.ts` | 208 | Asset MRU + types | Low |
| `lib/{layout-context,palettes,patterns,fonts,templates}.ts` | mixed | Context glue + static asset registries | Low |
| `lib/ast/{component-def,index,patch-class-by-oid,query,scope,style-source-read}.ts` | mixed | Various utility surfaces | Low |
| `lib/tailwind-slider-maps.ts` | – | Slider unit conversions | Low |

### `components/` — totally untested

**No `components/` file has a test or bench.** The repo's largest source files all live here:

| File | LOC | Test coverage |
| --- | ---: | --- |
| `components/ElementTree.tsx` | 6334 | Only the `nodeMatchesQuery`/`buildVisibleKeys`/`buildVisibleKeysFromRegex` helpers are mirrored in `bench-tree-filter` + `bench-tree-persistence`. The other ~6200 LOC of UI logic, drag/drop, multi-select, panel state — **untested.** |
| `components/Workspace.tsx` | 2815 | None. Top-level state owner — code/source/selection state, OID injection, history, preview wiring. |
| `components/SelectionOverlay.tsx` | 3519 | None. Selection bounds, drag handles, inspector overlay. |
| `components/Preview.tsx` | 1087 | None. Iframe lifecycle, srcDoc rebuild, postMessage handling. |
| `components/BackgroundEditor.tsx` | 841 | None. Gradient + color editor. |
| `components/Editor.tsx` | 306 | None. Monaco wiring. |
| `components/IsolatedPreview.tsx` | 316 | None. Gallery preview cards. |
| `components/library/*` | ~8 files | None. Whole component-library modal. |
| `components/ast/PropertiesPanel/*` | 4 files | None. The panel that funnels every commit through `applyStyleProps`. |

### Biggest single coverage gap: `lib/preview.ts`

The 2531-line iframe runtime is the heart of the product. It contains:
- The Babel-in-browser transform pipeline (the user's pasted JSX → executable React).
- OID injection inside the iframe (post-Babel).
- `dropinSerializeTree` (DOM walker that produces the inspector tree).
- `dropinFlipMeasure` (the FLIP measurement layer).
- The runtime that stitches CSS, fonts, scripts, error overlays into the iframe doc.
- Multiple regex literals + template-string-of-template-strings (CLAUDE.md memories: `project_ts_template_backslash_trap`, `project_ts_template_backtick_trap`).

`bench-tree.mjs` re-implements `dropinSerializeTree` against a fake DOM with no fidelity to the iframe's actual `getAttribute`/`tagName` semantics. It's a unit test of a clone, not a test of `lib/preview.ts`.

If `lib/preview.ts` regresses, the entire app silently breaks and 4022 tests stay green.

---

## 5. End-to-end / integration coverage

**There are zero end-to-end tests.** Specifically:

- No test exercises the canonical product flow: paste HTML/JSX → `injectOids` → preview iframe srcDoc → render → user clicks an element → SelectionOverlay → properties panel commits → source patch → iframe rebuild.
- No JSDOM/happy-dom test of any React component. `vitest.config.ts` has `environment: "node"` — there's no way to render a React tree.
- No Playwright/puppeteer. (CLAUDE.md "no servers, no puppeteer unless asked" — explicitly out of scope.)
- No snapshot tests of generated iframe srcDoc.
- No test confirms that a pasted template renders without console errors. The hand-rewritten `web/<NN>-*.jsx` templates have no parity check beyond `bench-parse` (which only verifies they parse in <30ms p99).
- No test verifies postMessage round-trips between Workspace and iframe.
- No test exercises the Babel-in-browser transform that converts user JSX → executable.
- No test verifies the OID determinism property end-to-end (only the algorithmic seed→string mapping in `bench-oids`).

The 39 benches collectively answer one question: **"Do my pure-logic helpers compute the right output for the inputs I gave them?"**

They do not answer:
- Does Workspace mount?
- Does the iframe render a template?
- Does clicking an element trigger selection?
- Does committing a style change in the panel write to source?
- Does undo restore the previous source?
- Does typing in Monaco update the preview?
- Does the Component Library modal open and insert a card?

All of those flows are verified manually by the user in the running dev server (localhost:3000–3002 confirmed responding 200 at audit time).

---

## 6. Dev server smoke (audit-time, no new processes spawned)

Curled the user's existing dev servers:

```
3000: 200
3001: 200
3002: 200
```

`http://localhost:3000/` returns the marketing landing page (~68KB HTML). The server is healthy. The audit did not start any new dev/build processes.

---

## 7. Verdict

### Is the suite "staged mocked tests made to pass"?

**Mostly no, but with one structural caveat and a real drift case.**

- The bench `cases` arrays are not stubs. The 5 randomly sampled benches (flip, oids, resize, style, tree-filter) all build real inputs, call real (inlined) algorithms, and assert on real outputs. The 4022 number is not fabricated — it counts real assertions running against real (if inlined) code.
- BUT: `_runBench.ts` is fundamentally trust-based. A bench that prints `PASS:` and `process.exit(0)` is reported green with no work done. The user's instinct to be suspicious is well-founded structurally even though the actual benches don't appear to abuse it.
- AND: `bench-resize.mjs` is a confirmed concrete case of a bench that no longer mirrors its target lib. The lib was refactored to a 12-line wrapper; the bench still inlines the 130-line v1 algorithm and passes against itself.

### What the 4022 + 39-bench-green claim actually verifies

- ✅ ~30 pure-logic helpers compute correct outputs on hand-picked inputs (with one drifted clone).
- ✅ `tsc --noEmit` passes cleanly.
- ✅ `@babel/parser` parses every web/*.jsx template under 30ms p99.
- ❌ The product's actual user-facing behavior. There is no test that survives a regression in `lib/preview.ts`, `components/Workspace.tsx`, `lib/iframe-bridge.ts`, or any other UI/integration surface — and those files account for ~17,000 LOC, which is the majority of the active code in the project.

The suite is honest about what it tests. It is the developer-introspection harness CLAUDE.md says it is. It is just not a "test suite" in the integration-coverage sense, and the 4022 number is not a quality signal beyond "the helpers I wrote a bench for still produce the outputs I wrote in the bench."

### Recommendations (out of scope per task — not implemented)

1. Replace inline algorithm copies in benches with TS imports (via `tsx`/`tsm`), eliminating drift hazard. `bench-resize.mjs` should be the first migration.
2. Add at least one integration test that mounts `Workspace` in JSDOM, sets initial source, and asserts the preview iframe receives a non-empty srcDoc. Even one such test catches a class of regressions the entire current suite misses.
3. Consider a "smoke fixture" for `lib/preview.ts`: build the iframe HTML for a known template and assert it contains the expected OID-stamped output. Pure-Node, no JSDOM needed.
4. Wire `_runBench.ts` to refuse `(bench exits 0)` if no PASS/FAIL/summary lines were seen — closes the empty-bench loophole.
