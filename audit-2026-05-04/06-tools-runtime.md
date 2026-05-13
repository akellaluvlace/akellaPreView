# Audit 2026-05-04 — Tools / Runtime Health Check

Scope: catch issues that static reading misses. `next build` and `next dev` are
banned by CLAUDE.md rule 5; dev servers on 3001 and 3002 already running and
were curled non-destructively. Port 3000 is a different project (BabyDraft) and
was excluded from the Dropin smoke after detection.

## 1. `npx tsc --noEmit` — PASS

Exit `0`, zero diagnostics. Matches the claimed-clean state.

## 2. `npm run test` (vitest) — PASS

```
Test Files  39 passed (39)
Tests       4022 passed (4022)
Duration    4.10s
```

Matches claim of 4022 tests across 39 files.

## 3. Bench scripts (`scripts/bench-*.mjs`) — PASS, 39/39

All 39 bench files exit clean. Notable totals:

- `bench-tree-persistence`: 1198/1198 (matches claim)
- `bench-presets`: 107/107
- `bench-tree-multi-keys`: 93/93
- `bench-swap-category-hint`: 92/92
- `bench-tree-dnd-multi`: 56/56
- `bench-snap`: 39/39
- `bench-gradient`: 38/38
- `bench-swap`: 34/34
- `bench-parse`: aggregate p99 2.61 ms vs 30 ms budget (27.39 ms headroom).
- All others 8–50 cases, every script passes its own assertions.

## 4. `npm audit --omit=dev` — FAIL (4 vulns: 3 moderate, 1 high)

- **next 14.2.33** → high. 7 advisories (DoS, request smuggling in rewrites,
  image-cache exhaustion, RSC deserialization). Fix path = `next@14.2.35`
  (still 14.2.x, in-band with the locked range `14.2.x`). User decision.
- **postcss <8.5.10** → moderate (XSS via unescaped `</style>`). Transitively
  pulled by next; same fix bumps it.
- **dompurify <=3.3.3** → moderate (8 advisories: mutation-XSS, prototype
  pollution, FORBID_TAGS bypasses). Reachable only via `monaco-editor` —
  client-side editor, not a server attack surface, but still ships to users.
- **monaco-editor** → moderate via dompurify dep.

## 5. `npm outdated` — INFORMATIONAL

Locked stack confirmed (no recommendation per task brief):

- next 14.2.33 (latest 16.2.4 — locked at 14.2.x)
- tailwindcss 3.4.19 (latest 4.2.4 — locked at 3.4.x)
- react/react-dom 18.3.1 (latest 19.2.5 — locked at 18.x)
- typescript 5.9.3 (latest 6.0.3)
- vitest 1.6.1 (latest 4.1.5)

In-band patches available: `@babel/parser` 7.29.2 → 7.29.3, `lucide-static`
1.11.0 → 1.14.0, `simple-icons` 16.18.0 → 16.18.1, `postcss` 8.5.10 → 8.5.13.
None mandatory.

## 6. `npx depcheck --skip-missing` — INFORMATIONAL

Reports unused deps:

- `@babel/types`, `@heroicons/react`, `@phosphor-icons/core`, `@tabler/icons`,
  `heroicons`, `lucide-static`, `simple-icons`, `unicode-emoji-json`
- devDeps: `@types/react-dom`, `autoprefixer`

Caveat: depcheck has many false positives in this codebase. The icon packs
(`@phosphor-icons/core`, `@tabler/icons`, `simple-icons`, `lucide-static`,
`heroicons`, `unicode-emoji-json`) are consumed by `scripts/build-assets/*`
build-time generators and `scripts/ingest-components.mjs`, so depcheck is
likely missing the indirection. `@babel/types` is a peer of `@babel/parser`.
`autoprefixer` is consumed by PostCSS via `postcss.config.js`. **No action
recommended without manual confirmation.**

## 7. `npx madge --circular` — PASS

`Processed 120 files (1.2s) (59 warnings) — No circular dependency found!`

The 59 warnings are unresolved imports (likely `@/` alias edges madge can't
resolve) — not circular.

## 8. `git status -s` — 72 modified/untracked entries

44 modified `web/*.html` + `web/*.jsx` template pairs (mid-batch upgrade).
Modified docs: `CLAUDE-archive.md`, `CLAUDE.md`, `template-upgrade-playbook.md`.
Untracked: `app/`, `components/`, `lib/`, `scripts/`, `templates/`, `tests/`,
`public/`, plus `package.json`, `package-lock.json`, `tsconfig.json`,
`tailwind.config.ts`, `next.config.js`, `postcss.config.js`, `vitest.config.ts`,
`README.md`, `.env.example`, `.prettierignore`, `.prettierrc.json`, plus
in-progress notes (`phase1.md`, `phase2.md`, `phase2-manipulation.md`,
`phase5-prettier-diff-preview.txt`, `phase5-tools-isolation.md`,
`maniuplation.md`, `plan.md`, `assets.md`).

The "untracked" entries are huge directories the repo hasn't snapshotted yet —
the most recent commit is the backup-before-batch (`0878566`) and almost the
entire app exists as untracked-since-rebuild. **Most current work is unsaved
in git.**

## 9. `git log --oneline -25` — INFORMATIONAL

Only one commit visible: `0878566 backup: web templates state before
94/10/32/16/69 batch`. Pretty thin history, consistent with #8.

## 10. ESLint config — ABSENT

No `.eslintrc*`, no `.eslintignore`, no `eslint` in `package.json` deps. Skip.
TypeScript strict mode in `tsconfig.json` plus vitest covers most invariants.

## 11. `.gitignore` coverage of `audit-2026-05-04/` — NOT IGNORED

`.gitignore` does not exclude `audit-2026-05-04/`. The directory is presently
empty (just this file). Will be tracked if added to git.

## 12. Repo size — INFORMATIONAL

```
node_modules   724M
.next          301M     (dev cache; banned to rebuild)
web             11M     (template HTML/JSX pairs)
components     1.1M
lib            788K
scripts       1000K
app             60K
tests           59K
```

Nothing pathological. `.next/` is dev-cache, ignored by git.

## 13. Curl `localhost:3001/` — PASS (200 OK)

`http_code=200 size=147810 time=0.24s`. Title: **Dropin — Paste code. See
page.** No `TypeError`, `ReferenceError`, `Cannot read prop`, or `hydration
mismatch` strings in served HTML. The 1 `error` hit is React framework keyword
`errorScripts`/`errorStyles` in serialized RSC payload — benign.

(Note: `localhost:3000` initially curled — turned out to be **BabyDraft**, an
unrelated Next dev server. 200 OK there too. 3000 was excluded from the
remaining smoke. 3001 and 3002 both serve Dropin and respond identically; 3001
used as primary.)

## 14. Curl `localhost:3001/gallery` — PASS (200 OK)

`http_code=200 size=147835 time=0.14s`. Title: **Gallery — Dropin**.
**111 of 111** templates listed in served HTML (matches gallery count). No
runtime errors. No empty-list state. `dynamic = "force-dynamic"` is doing
its job (per the documented searchParams trap memory).

## 15. Smoke check — `localhost:3001/playground` and `/t/2-saas-light`

Bonus checks added to widen coverage:

- `/playground` → 200 OK, 121 KB.
- `/t/2-saas-light` → 200 OK, 264 KB. Workspace chrome, tools toolbar, JSX/HTML
  toggle, viewport switcher, tree rail, code editor placeholder, preview
  iframe with `srcDoc` all present in initial HTML.

No runtime-error markers in any of the 5 curled pages.

---

## Bottom line

### Working

- TypeScript compiles clean (0 errors).
- 4022 vitest tests pass across 39 files, ~4 seconds.
- 39 bench scripts pass; bench-tree-persistence at 1198/1198 confirms claim.
- No circular imports.
- Dev server (3001/3002) renders `/`, `/gallery`, `/playground`,
  `/t/2-saas-light` — all 200, all under 300 ms, no runtime errors in HTML.

### Broken / risky

1. **Security advisories** (3 moderate + 1 high): `next@14.2.33` carries 7
   open advisories; in-band fix is `next@14.2.35` (still 14.2.x). `dompurify`
   in `monaco-editor` carries 8 advisories — client-only, but exposed.
2. **Most current work is untracked in git.** `app/`, `components/`, `lib/`,
   `scripts/`, `templates/`, `tests/`, plus all root config files are showing
   as `??` (untracked). Only the `web/*` template pairs are committed history.
   Recovery from a `node_modules` accident or branch switch would lose nearly
   the entire app.
3. **No ESLint** — TypeScript strict catches most of what ESLint would, but
   accessibility, hooks-deps, and React-specific rules go unchecked.

### Cosmetic / informational

- `npx prettier --check .` reports 173 files with style issues; not blocking,
  but `npm run format` would be a one-shot tidy.
- depcheck false-positives across 8 icon/build-asset deps; ignore without
  confirmation.
- `audit-2026-05-04/` is not gitignored — the user can decide whether to
  commit, ignore, or delete.

## Gaps — what we CANNOT verify without `next build`

(Banned per CLAUDE.md rule 5; the user explicitly accepts these.)

1. **Production bundle size and code-split layout.** No way to detect bundle
   regressions, Webpack tree-shake failures, or unintended client-component
   bloat. tsc + dev render don't surface these.
2. **Production `'use client'` boundary correctness and prerender output.**
   Dev mode is permissive; prod build can fail on
   `serverComponentsExternalPackages`, `dynamic = 'force-dynamic'` traps,
   `next/dynamic` ssr settings, image-config issues, or static-export bugs
   that dev never trips. The known `/gallery` searchParams trap memory is
   exactly this category — could regress silently.
3. **Production CSS purge correctness (Tailwind safelist).** Dev mode keeps
   the full Tailwind layer; prod purge could drop dynamically-constructed
   class names. No automated check covers this without `next build`.
