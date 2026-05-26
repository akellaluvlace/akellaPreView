# CLAUDE.md

Project: **Dropin** — Next.js + Vercel site where vibecoders paste AI-generated HTML/JSX and see it render live, or pick from a gallery of templates. Audience: people with no terminal, no Node install, no dev background.

## Active branches (2026-05-26)

- **`main`** — codebase. Last commit `0878566 backup: web templates state before 94/10/32/16/69 batch`.
- **`audit-phase2-cascade-ids`** — long-lived feature branch. **NOW PUSHED to `origin` (github.com/akellaluvlace/akellaPreView), HEAD = `801b891`, 0 unpushed.** Was ~70 commits ahead of the stale remote (which sat at `36ad297`); pushed 2026-05-26. ~95 commits ahead of `main`. Contains: audit work + UI/UX redesign + vibe-edit + vibecoder simplification + Move/Insert/Swap retirements + AI Edit (built then retired) + BYO-AI swap (current flagship) + 2026-05-24..26 (modal UI, cascade group-swap choice, iframe handshake fix, audit + 6 hardening fixes). Full per-session log in `CLAUDE-archive-status.md`.

## Backup checkpoints (rollback refs)

| Date | Commit | Restore command | What it captures |
|---|---|---|---|
| 2026-05-26 | `801b891` | `git reset --hard 801b891` | **Pushed to origin.** Audit + 6 hardening fixes (parse-gate, localStorage key, tracer gating, flake+gallery, route delete + IP). tsc 0, vitest 6646 (envelope flake now stable). The pre-#6-dead-UI-removal snapshot. |
| 2026-05-15 | `d656e21` | `git reset --hard d656e21` | Pre-cascade-detach + pre-move-fix work. Vibe-edit 5-phase simplification + inline component browser + 2026-05-15 plans. Two new SVG logos. CLAUDE.md trimmed + archive. tsc 0, vitest 6291/6293. |
| 2026-05-10 | `c659862` | `git reset --hard c659862` | Pre-master-ID sweep snapshot (vibe-edit scaffold + audit-phase2 cascade work). Also tagged `backup/pre-master-id-sweep-2026-05-10`. |
| 2026-04-26 | `36ad297` | `git reset --hard 36ad297` | Initial publish — project source, audit docs, logo brief. The base before this branch diverged. |

## Current status (2026-05-26 — audit + 6 hardening fixes shipped & PUSHED. HEAD `801b891`. tsc 0, vitest 6646 (envelope flake now stable). One item deferred to next run: full dead-AI-UI removal.)

### ⏭️ NEXT RUN STARTS HERE — finish Fix #6 (remove the dead AI-Edit UI layer)

The retired Tensorix AI-Edit path's **HTTP route was deleted** (`app/api/ai-edit/route.ts` — the cost-DoS surface), but the **dead UI layer is still on disk** and interwoven with LIVE code. Remove it carefully (mostly tsc-guarded + covered by the integration tests; the iframe-runtime edits are the delicate part). Do it in tsc-clean, committed chunks:

1. **Consumers first** (so the lib + components become unreferenced):
   - `components/ToolBar.tsx` — remove `TOOL_META.ai` + `AiIcon` (the `'ai'` tool is already gone from `TOOL_LIST`).
   - `components/Workspace.tsx` — remove `handleAiSubmit`, `handleAiSwapPick`, `handleAiSelected`, `handleAiSetScope`, `handleAiClearFromChip`, `aiInfo`/`aiBusy`/related state, the `<AiPromptBar>` + `<AiScopeChip>` mounts (gated on the unreachable `tool === "ai"`), and the `@/lib/ai-edit/*` imports.
   - `components/Preview.tsx` — remove `onAiSelected`/`onAiCleared`/`onAiApplied`/`onAiApplyFailed` props + the `ai:*` message handling/posting + the `lib/ai-edit` imports.
   - `lib/iframe-bridge.ts` — remove the `ai:*` variants from `IframeToHostMessage`/`HostToIframeMessage` + the `AiSelectionPayload` import + their entries in the `IFRAME_MESSAGE_TYPES` exhaustiveness tuple (the `Exhaustive` guard will tsc-error if you miss one — lean on it).
   - `lib/vibe-edit/runtime.ts` — remove `aiSerialize`/`aiSelect`/`aiClear`/`aiFindSectionScope`, the `DROPIN_TOOL === 'ai'` click branch, and the `ai:set-scope`/`ai:clear`/`ai:apply-outer` message handlers. **Delicate (template-literal string, not tsc-checked internally) — verify with `tests/integration/vibe-edit-roundtrip.test.ts` + `iframe-click-to-select.test.ts`.**
2. **Then delete the orphaned files:** `lib/ai-edit/*` (11 files), `components/AiPromptBar.tsx`, `components/AiScopeChip.tsx`, `components/AiSwapBusyOverlay.tsx`, `tests/ai-edit-*.test.ts` (6 files).
3. **MUST KEEP** (BYO-AI depends on them): `lib/ast/operations/detach-from-map.ts`, `lib/component-library/html-to-jsx.ts`, `lib/ast/patch-class-by-oid.ts` (`getJsxOuterByOid`), `lib/ast/oids.ts` (`parsesAsPlainJsx`).
4. ~2,500 LOC + ~115 tests of pure bloat. Verify `npx tsc --noEmit` + full `vitest` after each chunk.

### This session (2026-05-26): codebase audit + 6 hardening fixes (all pushed)

Ran a 4-agent read-only audit (AST layer, BYO-AI/iframe, what's-coming inventory, security/silent-failures) + internet research. Then shipped, in priority order:

- **`dc9c3a6`** backup — all 2026-05-24..26 BYO-AI/handshake/cascade work (see next block + below).
- **`a25b068`** Fix #2 — `isParseable` was returning `true` for broken JSX because `PARSE_OPTS` has `errorRecovery: true` (Babel recovers, collects errors in `ast.errors` instead of throwing). It's the parse-gate before `setCode` in `handleByoAiApply`, so truncated/unbalanced AI replies could blank the preview. Now inspects `ast.errors`. Stays TS-tolerant (so validate-response's structural-vs-TS distinction holds). `injectOids`/`stripOids` keep the lenient `tryParse`.
- **`bb68409`** Fix #3 — never persist the BYO AI key to `localStorage` (`FocusEditor` `AIRewriteSection`): the `allow-same-origin` srcdoc iframe can read `window.parent.localStorage`. Key is now in-memory (session) only; provider pref (non-secret) still persists. Documented the sandbox tradeoff at `Preview.tsx`. (FocusEditor is itself unreachable — only opened by the retired Select tool — so this is a latent risk closed.)
- **`1781afc`** Fix #4 — gated the ~150 `[dropin:*]` console tracers behind `lib/debug.ts` `dlog()` (host) + a runtime `dropinDbg()` (iframe). OFF unless `NODE_ENV!=='production'` OR `localStorage['dropin:debug']==='1'`. Done for Preview/Workspace/ByoAiSwapModal/ImageControls + the iframe runtime (preview.ts + vibe-edit/runtime.ts — self-contained `dropinDbg` defined in both so the vibe runtime works standalone in tests). NOT yet gated (low-freq, deferred): ~30 misc 1-log files (asset panels) + SelectionOverlay (dead Move code).
- **`5b4d3ce`** Fix #7 — envelope-channel test flake fixed (deadline `waitFor()` poll replaces a fixed `flushTimers(20)` — 6/6 green). `/gallery` pinned `export const dynamic = "force-dynamic"` (latent searchParams static-render crash).
- **`801b891`** Fix #5 + #6-partial — deleted `app/api/ai-edit/route.ts` (Tensorix cost-DoS HTTP surface, used `TENSORIX_API_KEY`, reachable regardless of dead UI). Hardened `llm-rewrite` `readClientIp` to prefer `x-real-ip` over spoofable XFF-first.

**Audit findings still OPEN (not fixed):** duplicate-OID mis-target when `applyDetachFromMap` bails (the patch hits querySelector's FIRST match, not the clicked instance — the canIsolate dry-run mitigates the BYO-AI path only); `canIsolate` re-parses the full template on every keystroke while the modal is open (perf); `injectOidIntoOuter` regex silently no-ops if the AI reply leads with a comment/whitespace; 7× duplicated `findJsxElementByOid` across operation files. **Research confirmed:** Next.js already on 14.2.35 (CVEs patched — no action); the sandbox warning is an accepted tradeoff; Tailwind Play CDN is dev-only but required in the preview (and embedded in the Publish export → published sites aren't production-grade — future consideration).

---

## Archived status blocks

Per-session status logs for **2026-05-15 through 2026-05-24/25** live in `CLAUDE-archive-status.md` (newest-first): BYO-AI swap evolution + 6 hardening rounds, AI-Edit Phases 0–9 + Tensorix integration (all retired), Move/Try-Variations retirements, post-dinner polish, and the Phase-1 manual-test checklist. The 2026-05-26 status block above + the Fix #6 plan are the live handoff — that is all the next run needs.

---

## What's left — prioritized

**Now**: branch `audit-phase2-cascade-ids` pushed to origin at `801b891`; doc commit `6f18017` local-only. Working tree clean except pre-existing untracked `wireframe-globe (1).svg`. **Next**: finish **Fix #6** — remove the dead AI-Edit UI layer (see the "⏭️ NEXT RUN STARTS HERE" plan in the 2026-05-26 status block above). Goal: push live today.

**Deferred (low priority)**:
- **Visual-role disambiguation (Layer 3 swap-category fallback)** — see `memory/project_visual_kind_disambiguation.md`. HTML tag ≠ visual role: Tailwind-utility-styled `<a>` looks like a button or card; `<button>` styled as a link; `<input type="submit">`; `<div role="button">`. Current Layer 1 (token) + Layer 2 (kind+isCardLike) misses these. Proposed `inferVisualRole(info)` reads bg/rounded/bbox.height/padding/aria-role; wait for concrete failure case before implementing.
- **Flex/grid context preservation on component swap** — see 2026-05-14 PM block in `CLAUDE-archive-status.md`. Wrap currently locks abs px; flex `flex-grow/shrink/basis` and grid `grid-column/row` are lost. Layer in if it surfaces.
- **Component re-pick to clean up pre-converter-fix in-source picks** — anything swapped during the broken html-to-jsx window has bad SVG markup in user-source.jsx; user re-picks to refresh.
- **Tighten Fragment-wrap + forceRebuild to multi-root JSX only** — currently applied to every JSX pick. Cheap unnecessary rebuild for single-root components.
- **Dead-code sweep of Phase D/F libs** — ~6 pure-logic modules (`lib/swap/plan-everywhere-swap.ts`, `lib/ast/instance-graph.ts`, `lib/ast/cross-file-query.ts`, `lib/ast/component-def.ts`, `lib/edits/operations.ts createEdit half`, `lib/ast/patch-class-by-oid.ts patchJsxClassByOid only`) + their ~150 prod-import tests are now uncalled from production after the 2026-05-14 toggle removal. Kept for now — removing covered code is regression risk for ~0 value. 30-60 min when there's appetite.
- **Cascade fix beyond the badge** — per-instance editing of `.map()`-rendered items via auto-expansion is the Plasmic-incompatible / multi-day path. Documented architectural limitation; revisit when there's appetite.
- **2026-05-11 PM 5-phase edit-flow-hardening plan** (`docs/superpowers/plans/2026-05-11-edit-flow-hardening.md`): Phase 1 (WU1 span walk-up — shipped per UI2 work 2026-05-12 per memory entry), Phases 2-5 (buildVibeCommit union / opacity slash form / TextControls debounce / rgbToHex extraction) still on the shelf.
- **PX5 (Pixabay write-through cache) + UI2 FULL Step 2 (styleDelta `iconFill` field)** — specced at `docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md`.
- **Pre-existing IDB records cleanup** — orphaned per-template records skipped on read but stay in browser storage.
- **`MANUAL-TEST-CHECKLIST.md` refresh** — the version at repo root is from before the UI/UX pass; redundant with the 2026-05-14 checklist now in `CLAUDE-archive-status.md` for the current vibe-edit surfaces.

**Specced plans ready to execute** (2026-05-15 design pass — code work greenlit when user says go):
- **AI Edit element + section** — `docs/superpowers/plans/2026-05-17-ai-edit-element-section.md`. **LOCKED 2026-05-17.** Tensorix-backed "click + prompt + apply" editing with element / section scope. Replaces the broken component-library swap (which never preserved content + dimensions cleanly because library tiles are rigid). Phase 0 = retire library swap from UI. Phases 1-4 = selection layer → API integration → section mode → hardening. ~4 weeks. minimax-m2 default, ~€0.002/edit, €800-1000/month at 1k active users. The "swap this for something better" use case becomes a natural element-mode prompt ("redesign this card with darker chrome") — AI inherits content + dimensions by construction. Pre-existing infra to leverage detailed in plan's section 11.
- **2026-05-16 post-dinner polish** — `docs/superpowers/plans/2026-05-16-post-dinner-polish.md`. Six phases (P1-P4 + P6 SHIPPED 2026-05-16 PM, P5 mood slider deferred per user "not much value"). Phase 0 manual test still recommended on resume.
- **Cascade detach** — `docs/superpowers/plans/2026-05-15-cascade-detach.md`. User-triggered "Make this one different" button on the cascade chip. AST surgery splits `.map()` at index K via slice + IIFE form; OID regen makes the detached copy independently editable. Covers ~80% of real `.map()` shapes per sampling of `web/05-mobile-app-landing.jsx` (ArrayExpression / no-second-param / custom-key shapes all supported). Bails cleanly on filter chains / non-arrow callbacks / `i` used outside `key=`. ~25 prod-import tests planned. ~1-2 days.
- ~~**Move tool fix**~~ — RETIRED 2026-05-15 per the new status block above. `docs/superpowers/plans/2026-05-15-move-tool-fix.md` left in place for reference if someone ever does the Plasmic-grade rebuild.

**Known gaps (require rule changes / hard tradeoffs)**:
- Bundle size + Tailwind purge correctness — verifying needs `next build` (rule 5).
- Next.js advisories — `npm audit` recommends 16.2.4 (SemVer-major), breaks locked stack.

**Known bugs (see `memory/project_known_bugs_deferred.md` for full investigation checklists)**:
- **Bug #2** — React duplicate-key warning from duplicate OIDs. Cosmetic console noise; cascade architecture intentionally lets one source OID render N DOM instances (duplicate-in-DOM is by-design). Duplicate-in-source is the actual bug to chase.
- ~~**Bug #3** — Move tool~~ RESOLVED 2026-05-15 by retiring the canvas-drag tool. Tree DnD still works for the legitimate reorder use case.

## Pointers (open on demand)

- **Archived status blocks (2026-05-11 PM and earlier)**: `CLAUDE-archive-status.md` at repo root — full per-session log, decisions, file lists, test counts. Trimmed out of this file 2026-05-14 to keep it ~30k chars.
- **Manual test checklist (post-audit P0/P1/P2)**: `MANUAL-TEST-CHECKLIST.md` at repo root — note: pre-dates the 2026-05-10 UI/UX redesign + 2026-05-14 vibe-edit work, so the test list above is more current for the live surfaces.
- **Rolling status memory**: `~/.claude/projects/C--Users-nikit-akellaPreView/memory/project_vibecoder_simplification_2026_05_14.md` (latest) + `MEMORY.md` (index of all auto-memory).
- **Audit reports**: `audit-2026-05-04/00-synthesis.md` (older multi-area audit) · `AUDIT-2026-05-11.md` (latest, 7-agent vibe-edit audit) · `AUDIT-FIX-PLAN.md` (image cascade fix plan).
- **Pending follow-up plans**: `docs/superpowers/plans/2026-05-11-edit-flow-hardening.md` (Phases 2-5 still on shelf) · `docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md` (PX5 + UI2 Step 2).
- **Specs**: `maniuplation.md` (master) · `phase5-tools-isolation.md` (Phase 5 SHIPPED + §5 backlog) · `phase2-manipulation.md` (locked / reference). `plan.md`, `phase1.md`, `phase2.md` are ARCHIVED — don't trust their pins.
- **AST engines + helpers + per-engine bench list + template playbook + layout rules + stack / preview-runtime / gotchas / template contract / acceptance criteria**: `CLAUDE-archive.md`.

## Rules (non-negotiable)

1. **No co-sign on commits.** No `Co-Authored-By: Claude` trailer or AI attribution. Commits attributed to `akellaluvlace <nikita.akella13@gmail.com>` only.
2. **Never push without explicit permission.** Local git ops fine. Any remote-affecting action (`git push`, `--force`, `gh pr create`, tag push, release) needs fresh per-push approval.
3. **Never deviate from the locked stack** (Next.js 14.2.x, Tailwind 3.4.x, Monaco, parse5, @babel/parser, magic-string). Locked-out list in archive.
4. **Debug by reading code.** No dev/prod servers, puppeteer, or test harnesses unless explicitly asked.
5. **Don't run `next build` to confirm.** `npx tsc --noEmit` and trust it. See `memory/feedback_no_npm_build_to_verify.md`.
6. **Surface unrelated breakage; don't fix it.** Documented trap memories are context, not standing permission.
7. **Proper research is non-negotiable.** When user says "do proper research" / "no blind guessing" / equivalent — STOP code edits, read every relevant file end-to-end (proxies, handlers, type defs), verify assumptions BEFORE writing. The 2026-05-16 Pixabay-field-rename bug shipped because I assumed the proxy passed upstream shapes through without reading the proxy file. One Read would have caught it. See `memory/feedback_proper_research_is_non_negotiable.md`.
