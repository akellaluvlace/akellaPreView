# Audit Fix Plan — execution checklist

> **Companion to `AUDIT-FINDINGS.md`** — the findings file is the WHY (378 findings catalogued); this file is the WHAT TO DO. Execute one phase at a time, verify after each, surface anything unexpected before continuing.
>
> **Status**: drafted 2026-05-08. Not started. Execution scheduled for next session.

---

## Operating rules for execution

These hold across every phase. Re-read before starting any phase tomorrow.

1. **Read-only audit phase is over** — this fix plan authorises edits, but only edits explicitly listed here. Anything outside the listed scope = surface to user, don't patch.
2. **One phase at a time.** After each phase, run the verification step in §V, report results, get acknowledgement before moving to the next phase.
3. **`npx tsc --noEmit` and curl-on-existing-dev-server only.** No `next build`, no `next dev`, no puppeteer (per `feedback_no_npm_build_to_verify.md` + `feedback_no_servers_on_debug.md`).
4. **No co-sign on commits, no push.** Per `CLAUDE.md` rules 1+2. Each phase commits separately with a clear scope; `git push` waits for explicit per-push approval.
5. **Don't fabricate Unsplash IDs.** Per playbook §1.3. Every replacement ID must pass HTTP 200 + download + multimodal Read + archetype-fit per §1.1 before going into source.
6. **Locked stack.** Next 14.2.x, Tailwind 3.4.x, Monaco, parse5, @babel/parser, magic-string. No upgrades, no new deps.
7. **No iframe runtime / harness / Workspace edits in this fix pass.** Templates only (`web/<NN>-*.{html,jsx}`) plus the playbook itself (§7). Anything else is out of scope.
8. **JSX templates: no TS syntax** (per `feedback_no_ts_cast_in_jsx_templates.md`), `React.useState` only (per `feedback_jsx_hooks_via_react_global.md`), no `_extends` spread, no `DOMContentLoaded` handlers.

---

## Decisions to confirm before starting

These came up at planning time and weren't locked. Confirm tomorrow before Phase 0 starts:

1. **0.2 Simple Icons substitutes** — let me pick by archetype, or surface candidates? *Default*: I pick with archetype rationale, you override.
2. **0.4 Alt-text drift** — sync to HTML or JSX? *Default*: sync JSX → HTML (HTML is older/canonical for these pairs).
3. **1.1 SVG data-URL migration target** — Option A (CSS gradient substitute), B (tailwind config backgroundImage), or C (inline `bg-[url(...)]`)? *Default*: B for fractalNoise patterns, A for simple textures.
4. **1.2 §5.3 cascade trap** — defer all 12 advisories or fix? *Default*: defer (no confirmed bugs, cleanup-not-progress per `feedback_no_chunk_polish_overrun.md`).
5. **Phase 2 approach** — A (I curate per archetype, propose mapping table, you approve before edits) or B (I produce verified shortlists, you pick IDs)? *Default*: A.
6. **Phase 2 scope** — all ~17 cascade IDs, or worst 5 first? *Default*: worst 5 first (`1481349518771` banana, `1611652022419` necklace, `1551808525` Google booth, `1531259683007` Batman, `1492707892479` handbag), re-evaluate after.
7. **Phase 4 re-curation scope** — all 6 high-stakes templates, or sequence? *Default*: do 45 + 31 + 109 first (most user-visible damage), defer 65 + 38 + 94 to later session.
8. **Phase 5 (108-ethereal-fashion-noir parity)** — port missing 7 photos into JSX, or remove from HTML? *Default*: port into JSX (preserves editorial intent).
9. **Phase 6 (CLS authoring-style)** — defer or include? *Default*: defer (LOW severity, 108-file touch surface, requires intrinsic-dimension lookup per image).
10. **Overall ordering** — Phase 0 → 7 → 3 → 1 → 2 → 4 → 5 → 6, or yours? *Default*: that order (no-taste fixes first, cascade replacement before per-template re-curation since templates re-use cascade IDs).
11. **Per-phase commit cadence** — one commit per phase, or one per sub-phase (0.1, 0.2, 0.3, 0.4 separate)? *Default*: one per sub-phase for clean revert granularity.

---

## Phase 0 — Safe surgical fixes (no taste calls)

### 0.1 — HTML `DOMContentLoaded` → IIFE conversion

| File | Line | What gates |
|---|---|---|
| `web/72-high-luxury.html` | 904 | IntersectionObserver scroll animations |
| `web/76-material-design.html` | 1167 | chart.js initialisation (canvas stays blank without this fix) |
| `web/80-horizontal-scroll.html` | 481 | Scroll behaviour (JSX twin already on IIFE — sync HTML) |

**Pattern**: `document.addEventListener('DOMContentLoaded', () => { ... })` → `(function(){ ... })()`.

**Why**: Iframe's `DOMContentLoaded` already fired by the time `lib/preview.ts` re-emits the script. Per `CLAUDE.md` gotcha + playbook §5.9. JSX twins of all three already use IIFE (verified during audit).

**Verification**: `grep -nE "addEventListener\\(\\s*['\"]DOMContentLoaded" web/72-high-luxury.html web/76-material-design.html web/80-horizontal-scroll.html` returns 0 hits. `npx tsc --noEmit` clean. Curl `http://localhost:3000/playground?template=72-high-luxury` and grep served bundle for the IIFE function-expression signature.

**Risk**: very low — purely mechanical; JSX twins are working precedent.

---

### 0.2 — Broken Simple Icons slug substitutes

| Template | File | Line(s) | Broken slug | Proposed replacement | Archetype rationale |
|---|---|---|---|---|---|
| 68-bento-grid-dev | `.html` | 503 | `openai` | `anthropic` | AI lab logo, archetype-fit, verified-good (§1.4.2) |
| 68-bento-grid-dev | `.jsx` | 394 | `openai` | `anthropic` | (same — sync HTML/JSX) |
| 74-acid-graphics | `.html` | 452 | `ableton` | `bandcamp` | Music-platform logo, audio-archetype-adjacent, verified-good |
| 74-acid-graphics | `.jsx` | 337 | `ableton` | `bandcamp` | (same) |
| 79-neo-brutalism | `.html` | 330 | `slack` | `discord` | Communication-platform logo, brutalist startup-aesthetic-fit, verified-good |
| 79-neo-brutalism | `.jsx` | 53 | `slack` | `discord` | (same) |
| 97-blueprintiachitectural | `.html` | 466 | `adobe` | `figma` | Design-software logo, architectural/practice-software-fit, verified-good |
| 97-blueprintiachitectural | `.jsx` | 56 | `adobe` | `figma` | (same) |

**Pre-edit check**: `curl -s -o /dev/null -w "%{http_code}" "https://cdn.simpleicons.org/<slug>"` for each proposed replacement. Must return 200.

**Note on 74-acid-graphics**: `bandcamp` is genre-adjacent but not equivalent to Ableton (Ableton is a DAW; Bandcamp is a music marketplace). If you want pure-DAW alternative there isn't one in Simple Icons — surface to user for taste call (styled text chip is the alternative).

**Verification**: per-template, run the slug HTTP-check post-edit. `npx tsc --noEmit`. Curl served bundle.

---

### 0.3 — Headline clamp fixes

| Template | File | Line | Current | Proposed |
|---|---|---|---|---|
| 81-kinetic-kino | `tailwindConfig` (in HTML+JSX) | — | `display-xl: 120px` fixed | `display-xl: clamp(60px, 12vw, 120px)` |
| 82-nonprofit | `.html` | 169 | `text-display-xl` (72px fixed) | Add `text-[36px] sm:text-[52px] md:text-[64px] lg:text-display-xl` |
| 101-luxury-watch-editorial | `.html` | 225 | `text-display-xl` h1 no clamp | Add same ladder |
| 109-dark-luxury-occult | `.html` | 245, 282, 353, 439, 528, 616 | 6× `text-headline-xl` no clamp | Add `text-[28px] sm:text-[36px] md:text-[44px] lg:text-headline-xl` |
| 111-isometric-grunge-brutal | `.html` | 190 | h1 `text-display-xl uppercase glitch-text` | Add ladder |

**Pattern decision needed before edits**: 81 uses tailwindConfig fontSize override (`clamp()` works there); the others should use Tailwind responsive prefixes on the element itself. Both work; pick one approach per template based on whether the size token is reused elsewhere.

**Why**: §3.1 — display-xl/headline-xl typically renders 80-96px+; on 360px viewports these overflow horizontally. Hero headline on a phone overflowing is a top-3 reported bug pattern.

**Verification**: visual check via curl + small viewport. `npx tsc --noEmit` clean (Tailwind classes are strings, won't tsc-fail anyway). Need to verify the tailwindConfig clamp() syntax is valid — Tailwind 3.4 supports it.

**JSX parity**: every HTML edit needs the matching JSX edit. 109's 6 h2s are likely in a `.map()` array in JSX — single edit point. Verify post-edit by diffing class strings.

---

### 0.4 — Alt-text drift HTML/JSX sync

| Template | Image ID | Sites | Decision |
|---|---|---|---|
| 62-90s-grunge | `1563841930606` | HTML L569 "Stage with crowd at night...", L634 "Stage and crowd at night with smoke", JSX L173 "Concert atmosphere — stage lights and crowd at night" | Pick canonical alt; sync all three to it |
| 72-high-luxury | `1599643478518` | HTML L414+L469 "Plate V — Apothecary", JSX L534 longer descriptor | Sync to HTML version |
| 76-material-design | `1481349518771` | HTML L712 "Color foundation", JSX L54 longer string | Sync to HTML version |

**Default**: sync to HTML side. HTML is older/canonical for these pairs per CLAUDE.md "templates 1–100 hand-rewritten" history.

**Why**: §4.2 — alt drift means one side was edited without the other. Audit should produce zero alt-set diffs across HTML/JSX pairs.

**Note**: these alts are also FACTUALLY WRONG (e.g. `1481349518771` "Color foundation" → image is a banana). Phase 2 fixes the ID; Phase 0.4 only syncs the existing wrong text. Don't try to fix alt content here — separate concern.

**Verification**: post-edit, run `diff <(grep -oE 'alt="[^"]+"' web/<NN>.html | sort) <(grep -oE 'alt="[^"]+"' web/<NN>.jsx | sort)` per template. Should be empty (modulo template-literal interpolation noise).

---

## Phase 7 — Playbook maintenance (do BEFORE Phase 2/3)

> Moved up because Phase 2/3's verification protocol depends on the playbook §1.2 entries being accurate.

### 7.1 — Update `template-upgrade-playbook.md` §1.2 known-mismatch table

| Action | Entry | Current | Proposed |
|---|---|---|---|
| Update | `photo-1481349518771-20055b2a7b24` | "Long architectural corridor, perspective-deep" | "**Yellow banana on pink background** (subject drifted on Unsplash; verified 2026-05-08)" |
| Context-scope | `photo-1592078615290-033ee584e267` | "Nesting tables → Single black molded shell chair on wood legs" | Add note: photo IS correctly a moulded shell chair on wood legs — wrong only when alt names "nesting tables"; PERFECT in 57-bauhaus's "T-1 Side Chair" context |
| Add | `photo-1542038784456-1ea8e935640e` | (not in table) | "Person tossing camera in autumn forest — misused 12+ times as 'designer at tablet wireframes' / 'drafting drawings' / 'hallway' / etc." |
| Add | `photo-1493663284031-b7e3aefcae8e` | (not in table) | "Modern grey/teal tufted sofa with pillows in living room — misused 17+ times as 'cornicing' / 'master bedroom' / 'Faroe cliffs' / 'reef footage' / etc." |

**Why**: per audit §3.1 — playbook itself has stale entries. Surfaced unrelated breakage. Catching the banana drift took multimodal step-3; subsequent audits would be cheaper if §1.2 reflects reality.

**Verification**: read the diff, sanity-check the entries.

---

## Phase 3 — Hard-broken Unsplash 404 replacements

### 3.1 — `photo-1533158307587-828f0a76ef93` (404, 58-oled.html:771 + .jsx:621)

Slot context: "Lifestyle / Master The Moment" parallax gallery section. Archetype: dark-luxury-watch lifestyle.

**Search candidates** (4-step protocol per §1.1):
- "luxury watch lifestyle dark"
- "watch on stone parallax"
- "Patek Philippe close-up"
- "wristwatch dark mood"

**Workflow**: search → curl HTTP-200 check → `curl -o /tmp/audit-fix/repl-58.jpg "<url>&w=300&q=70"` → multimodal Read inspect → confirm archetype fit (dark luxury watch / lifestyle parallax) → propose 1 ID + 2 alternates → user picks → mechanical replacement in HTML+JSX.

### 3.2 — `photo-1590529853874-12968846df72` (404, 62-90s-grunge.html:212 + .jsx:186)

**HIGH URGENCY**: this is the hero `bg-clip-text` background. When 404s the headline renders unstyled / transparent — first thing visible.

Slot context: 90s-grunge hero text-clip background. Archetype: grunge / concert / band photography.

**Search candidates**:
- "grunge concert stage smoke"
- "90s band performance"
- "concert crowd stage lights"
- "grunge venue interior dark"

Same workflow as 3.1.

**Verification both**: post-edit HTTP-check (must be 200), visual download to confirm subject, curl played-back bundle to confirm replacement landed in the served chunk.

---

## Phase 1 — JSX iframe trap migrations

### 1.1 — SVG `data:image/svg+xml` in JSX `<style>` blocks

| File | Line | What it does | Proposed migration |
|---|---|---|---|
| `4-ai-product-landing.jsx` | 243-249 | TBD — read at edit time | TBD per §1.3 default |
| `10-split-screen.jsx` | 263-270 | TBD | TBD |
| `15-artisan-handmade-store.jsx` | 108-114 | TBD | TBD |
| `20-brutalist-creative-portfolio.jsx` | 133 | `.brutal-noise` overlay | TBD |
| `55-y2k-web-1-0.jsx` | 40 | Y2K starburst pattern | Probably Option A (CSS `radial-gradient` substitute) |
| `59-paper-collage.jsx` | 115 | SVG noise filter | Probably Option B (move to tailwindConfig) |
| `68-bento-grid-dev.jsx` | 87 | `.noise-bg` fractalNoise | Option B |
| `75-hand-drawn.jsx` | 88 | `.paper-grain::before` fractalNoise | Option B |
| `104-halftone-pop-art.jsx` | 84 | fractalNoise | Option B |
| `105-constructivist-bento-terminal.jsx` | 89 | fractalNoise | Option B |
| `109-dark-luxury-occult.jsx` | 74 | fractalNoise | Option B |

**Read-at-edit-time first**: my proposed migrations above are speculative. For each file: read the actual `<style>` block contents, decide A vs B vs C based on whether it's a noise-filter pattern (B/tailwindConfig) or a simple geometric texture (A/CSS gradients) or a one-off slot (C/inline `bg-[url(...)]`).

**Why**: §5.4 trap. Inline SVG `data:` URLs inside body-injected JSX `<style>` render unreliably in the iframe (per `feedback_jsx_data_url_in_style.md`). HTML twins keep working (static `<style>` in head); JSX users see a broken/missing texture. Both modes need to look the same per CLAUDE.md "JSX/HTML parity confirmed" rule.

**Decision** (re-confirm at edit time): Option B (tailwindConfig backgroundImage) is the playbook-blessed path because tailwindConfig is extracted to head host-side. Option A is fallback if the SVG can be approximated by CSS gradients without subjective visual loss.

**Verification per file**: edit → curl played-back JSX bundle → confirm pattern visible in the rendered iframe via served bundle inspection. Won't be visually verifiable from grep alone — need to spot-check the texture renders.

### 1.2 — `<style>` cascade trap §5.3 — DEFERRED

12 templates flagged in audit §1.3 (60, 65, 66, 67, 68, 72, 74, 77, 78, 79, 81, 94). Advisory only — no confirmed runtime bugs, just override-risk. Per `feedback_no_chunk_polish_overrun.md`, defer cleanup not driven by a confirmed problem. Re-flag if a body-Tailwind-utility appears not to apply during manual testing.

---

## Phase 2 — Cascade-ID replacement (the big one)

**Default approach (Approach A)**: I curate per archetype bucket → propose mapping table → you approve → mechanical replacement.

**Default scope (worst 5 first)**:
1. `photo-1481349518771-20055b2a7b24` (banana) — 18 templates affected
2. `photo-1611652022419-a9419f74343d` (necklace) — 14 templates
3. `photo-1551808525-51a94da548ce` (Google booth) — 11 templates
4. `photo-1531259683007-016a7b628fc3` (Batman) — 13 templates
5. `photo-1492707892479-7bc8d5a4ee93` (handbag) — 15 templates

Combined: ~71 distinct slots across ~50 templates. Slots have differing alts, so each archetype bucket is split further.

### 2.1 — Per-cascade-ID workflow

For each of the 5 cascade IDs:

1. **Bucket the slots by archetype** based on alt-text. Example for banana:
   - "architectural corridor / stairwell / library landing" archetype → ~6 slots
   - "FM/tape player catalog hero" → 1 slot (69-skeuomorphism)
   - "Material Design color foundation" → 1 slot (76)
   - "Atelier · Marfa" → 1 slot (77)
   - "Concrete corridor neo-brutalism" → 1 slot (79)
   - "Bauakademie portrait — venue" → 1 slot (65)
   - "Western Ghats ecoregion" → 1 slot (94)
   - "Hokkaido railway / Issue cover / second cup of tea" → ~4 slots
   - Decorative empty-alt strip → 5 slots (22, 25, 32 marquees) — these can stay as decorative IF the strip's design tolerates a banana subject; otherwise replace.

2. **Per archetype bucket**: search Unsplash for archetype-fit candidates (3-5 per bucket).

3. **4-step protocol per candidate**:
   - HTTP `curl` → must be 200.
   - Download via `curl -o /tmp/audit-fix/<id>.jpg "<url>&w=300&q=70"`.
   - Multimodal Read inspect.
   - Score archetype fit per playbook §1.5 routing table.

4. **Propose mapping table to user**:

   | Slot | Template | File:Line | Old alt | New ID | New subject | Confidence |
   |---|---|---|---|---|---|---|

5. **User approves**.

6. **Mechanical replacement** — sed-style replace in HTML + JSX. JSX `.map()` arrays often share IDs across slots — verify each slot's intent before bulk-replacing.

### 2.2 — Workflow for cascade IDs 6-17 (deferred)

After worst-5 land + verify, re-evaluate scope. Likely the remaining cascade IDs need similar treatment but at lower per-template hit count.

**Why**: ~80% of all 172 CRITICALs are cascade-ID drift. Per-template patches don't scale — same ID appears in many templates. Bulk per-archetype curation is the only tractable approach.

**Verification**: post-replacement, run the original audit greps per template:
- `curl` each new ID → 200.
- Download + multimodal Read → confirm subject matches new alt.
- `npx tsc --noEmit`.
- Curl served bundle → confirm new ID landed in chunk.
- HTML/JSX identicality diff per template.

**Estimated session time**: 1 cascade ID per session (worst 5 = 5 sessions). Phase 2 alone is multi-day work.

---

## Phase 4 — High-stakes per-template re-curation

These templates need full re-curation rather than slot-by-slot patching because cascade-ID density is too high.

**Default scope (do 3, defer 3)**:

### 4.1 — 45-real-estate-listing — UNFIT TO SHIP, do FIRST

8 unique photos, 7 wrong. Archetype: heritage Georgian property listing.

Slot inventory:
- Hero "Georgian townhouse facade at dusk" (`1487958449943` Rock&Roll Hall, used 4×)
- "Grand drawing room" (`1469041797191` camels, used 4×)
- "Rear mews entrance — wrought iron gate" (`1517021897933` mountains, used 3×)
- "West-facing landscaped garden" (`1542038784456` forest-camera, used 4×)
- "Powder room — Portland stone and brass" (`1517677208171` sweaters, used 3×)
- "Heritage interior — cornicing and shutter" (`1502672260266` Scandi room, used 4×)
- "Master suite — tall sash window" (`1493663284031` teal sofa, used 5×)
- "Library landing with leaded glass" (`1481349518771` banana, used 4×)

**Search candidates per slot** (Unsplash search hints):
- Georgian London facade: "Belgravia townhouse", "Notting Hill stucco", "Georgian terrace London"
- Drawing room: "Georgian drawing room sash window", "panelled library bookcase"
- Mews entrance: "London mews cobble", "wrought iron gate"
- Garden: "English country garden box hedges"
- Powder room: "marble bathroom Portland stone"
- Cornicing: "ornate ceiling cornice"
- Master suite: "period bedroom sash window"
- Library landing: "library bookcase leaded glass"

4-step protocol per candidate, propose mapping, user approves, replace.

### 4.2 — 31-law-firm partner row — do SECOND

8 partner head-shots, 7 mismatches. Archetype: B2B legal partner portraits.

Slot inventory: Sarah Hennessey, Adaeze Okafor, Mateo Reyes, Eleanor Vance, Daniel Park, Rachel Stein, James Bellamy, Priya Iyer.

**Critical**: each name has implied gender + ethnicity. Replacement IDs must respect:
- "Sarah Hennessey" → female-coded
- "Adaeze Okafor" → female, Nigerian-coded
- "Mateo Reyes" → male, Latino-coded
- "Eleanor Vance" → female
- "Daniel Park" → male, Korean-coded
- "Rachel Stein" → female
- "James Bellamy" → male
- "Priya Iyer" → female, Indian-coded (currently OK)

Stock photography curation has well-known representation issues; the 4-step protocol's archetype check needs a name-fit dimension here. Surface concerns to user.

### 4.3 — 109-dark-luxury-occult three hero "Constellations" — do THIRD

3 hero photos, all 3 wrong:
- "The Obsidian Vault" (alt: dark library bookshelf, candlelit) → currently smartphone-repair on teal desk
- "Brass & Bone" (alt: brass apothecary, dark moody still life) → currently woman-with-necklace
- "Hour of the Wolf" (alt: open manuscript by candlelight) → currently bright art gallery

Search: "candlelit manuscript", "antique apothecary brass", "dark library macro", "dark gothic still life". OR: AIDA-generated specific assets if Unsplash search underperforms.

### 4.4–4.6 — DEFERRED to later session

- 65-typographic-swiss-poster speakers (6 portraits)
- 38-podcast-style host portraits (3 named hosts)
- 94-solarpunk station carousel (8 ecoregion stations)

These need ~17 verified-replacement IDs collectively. Defer until Phase 4.1–4.3 land + verify, then re-evaluate Phase 4 scope based on what we learned.

**Verification per template**: same as Phase 2 (HTTP+download+multimodal+archetype+tsc+curl+identicality).

---

## Phase 5 — JSX/HTML parity gap

### 5.1 — 108-ethereal-fashion-noir

JSX missing 7 unique Unsplash photos vs HTML. Missing IDs:
- `photo-1455390582262-044cdead277a`
- `photo-1457369804613-52c61a468e7d`
- `photo-1481627834876-b7833e8f5570`
- `photo-1495446815901-a7297e633e8d`
- `photo-1499744937866-d7e566a20a61`
- `photo-1521405924368-64c5b84bec60`
- `photo-1611652022419-a9419f74343d` ← also a cascade-ID problem; replace via Phase 2 first

**Default**: port the missing 6 (excluding the cascade ID, which Phase 2 replaces) into the JSX gallery section.

**Workflow**:
1. Read HTML's editorial gallery section that contains all 22 photos.
2. Read JSX's editorial gallery section that contains the 15.
3. Identify the section structure (article wrapper / `.map()` array / inline JSX).
4. Add the 6 missing entries to JSX in the same shape as HTML.
5. Verify HTML+JSX photo-set identicality per §4.1.

**Verification**: photo-set diff returns empty (modulo escape differences).

---

## Phase 6 — CLS authoring-style pass — DEFERRED

~80% of `<img>` tags across all 108 templates lack `width`/`height`. LOW severity, ~108-file touch surface, requires intrinsic-dimension lookup per image (curl + image-byte read for dimensions, OR use Unsplash `w=`/`h=` query params + aspect ratio assumption).

**Default**: defer. Re-evaluate after Phases 0–5 land. If you want to include now, scope is:
- Per-template: read all `<img>` tags, look up intrinsic dimensions per src URL (download via curl, read EXIF / image header), add `width="N" height="M"` attrs.
- ~108 files × ~25 imgs/template = ~2700 attrs to add.
- Tractable as a single mechanical pass if we accept "use Unsplash query params" as the dimension source rather than downloading every image.

---

## Verification protocol §V — run after EVERY phase

1. **`npx tsc --noEmit`** — must pass with 0 errors.
2. **`grep` audit** — re-run the relevant playbook grep from §5.12 for the trap that phase addressed. Expected: 0 hits where applicable.
3. **Curl on user's existing dev server** — `curl -s http://localhost:3000/playground?template=<NN>-<slug>` → grep served bundle for the expected post-edit signature (e.g. IIFE function-expression, new Unsplash ID, etc.). Per `feedback_runtime_smoke_via_curl.md` — never spawn a fresh `npm run dev`.
4. **HTML/JSX identicality diff** — per touched template, run `diff <(grep -oE 'src="[^"]+"' web/<NN>.html | sort -u) <(grep -oE 'src="[^"]+"' web/<NN>.jsx | sort -u)`. Should be empty modulo escape differences.
5. **Visual spot-check** — for image-replacement phases (3, 4), download replacement → multimodal Read → confirm subject matches alt.
6. **Commit + report** — `git add web/<files>` (specific files, never `git add .`), commit with scope-tagged message, surface results to user, await acknowledgement before next phase.

---

## Pointers

- **Findings (WHY)**: `AUDIT-FINDINGS.md` at repo root.
- **Per-batch source reports**: `C:\Users\nikit\AppData\Local\Temp\audit-findings\batch-{2..6}.md` (batch 1 didn't persist; reconstructed in aggregate).
- **Playbook (rules + grep recipes)**: `template-upgrade-playbook.md` at repo root.
- **Active traps**: §5 of playbook + `~/.claude/projects/C--Users-nikit-akellaPreView/memory/MEMORY.md` for the per-trap pointer files.
- **Locked stack + non-negotiables**: `CLAUDE.md` rules section.

---

## Status tracker (update during execution)

| Phase | Status | Started | Finished | Notes |
|---|---|---|---|---|
| Decisions confirmed | ☐ | — | — | 11 decisions in §"Decisions to confirm" |
| 0.1 DOMContentLoaded → IIFE | ☐ | — | — | 3 files |
| 0.2 Simple Icons substitutes | ☐ | — | — | 4 slugs × HTML+JSX = 8 sites |
| 0.3 Headline clamps | ☐ | — | — | 5 templates |
| 0.4 Alt-text drift sync | ☐ | — | — | 3 templates |
| 7.1 Playbook §1.2 update | ☐ | — | — | 4 entries |
| 3.1 58-oled.html:771 404 replace | ☐ | — | — | Awaits 4-step verified ID |
| 3.2 62-90s-grunge hero 404 replace | ☐ | — | — | HIGH urgency — hero text-clip |
| 1.1 SVG data-URL migrations | ☐ | — | — | 11 JSX files |
| 1.2 Cascade trap §5.3 | DEFERRED | — | — | Per-default decision |
| 2.x Cascade-ID replacement | ☐ | — | — | Worst 5 first, multi-session |
| 4.1 45-real-estate full re-curation | ☐ | — | — | Unfit to ship — priority |
| 4.2 31-law-firm partner row | ☐ | — | — | Name-coded gender/ethnicity |
| 4.3 109-dark-luxury-occult heroes | ☐ | — | — | 3 hero photos |
| 4.4–4.6 65 / 38 / 94 | DEFERRED | — | — | Per-default decision |
| 5.1 108-ethereal-fashion-noir parity | ☐ | — | — | Port 6 photos to JSX |
| 6 CLS authoring-style | DEFERRED | — | — | Per-default decision |

---

_Plan drafted 2026-05-08 after the 6-batch audit. Execution begins next session — start by confirming the 11 decisions in §"Decisions to confirm", then enter Phase 0 sub-phase by sub-phase._
