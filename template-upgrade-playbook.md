# Template Audit Playbook

> Read-only audit of `web/<NN>-<slug>.html` + `web/<NN>-<slug>.jsx` template pairs. Flags issues; **never edits, never commits, never pushes**. Companion to `CLAUDE.md`.
>
> The previous upgrade-pass catalogues (palette swaps, new-section recipes, B/C/H/I/K/M/N/O/P/Q/R/S sections) lived in this file through 2026-05-08; they're preserved in git history. Audit is a fundamentally different job: surface findings, hand them back, do not modify.

---

## ⚠️ HARD RULE — read CLAUDE.md + memory pointers BEFORE touching anything

Every single audit run, in this order:

1. `CLAUDE.md` — locked stack, gotchas list, supported-package allowlist for the iframe.
2. `~/.claude/projects/C--Users-nikit-akellaPreView/memory/MEMORY.md` — index of feedback + project memories.
3. The active-trap pointers in §5 below before evaluating any JSX-side finding.

Skipping this is the single most common cause of bad audits — flagging things that are correct or missing things that are documented traps.

---

## 0. Operating rules (non-negotiable)

1. **Read-only.** No `Edit`, no `Write`, no `Bash` that mutates project files. The audit returns findings, not patches.
2. **Verification by curl is allowed.** HTTP-checking image URLs and Simple Icons slugs is the whole point of an image audit. Downloading sample bytes to inspect with the multimodal Read tool is also allowed (downloads land in `/tmp/img-check/` or the OS temp dir, not in the project).
3. **No `next build`, no `next dev`, no puppeteer.** See `feedback_no_npm_build_to_verify.md` and `feedback_no_servers_on_debug.md`.
4. **No co-sign on commits, no push.** Standard repo rules apply even if you produce a follow-up patch in a separate session.
5. **Surface unrelated breakage; do not fix.** If you spot a bug in the harness, the iframe runtime, the gallery, or anywhere outside the audit scope — flag it in the report. Do not patch.
6. **Do not invent verified IDs.** §1.3 spells out the rule. Putting a never-curl-tested ID in a finding ("you should swap to `photo-1xxxx`") is worse than offering no replacement at all.

---

## 1. Image audit — context match

The single highest-yield audit. Almost every template upgrade pass over the last two months has caught a context mismatch — sometimes one, sometimes ten. The pattern is consistent: **the alt text or surrounding heading claims the image shows X; the actual file shows Y**.

### 1.1 — The verification protocol

For every image URL in the template (HTML + JSX), do all four:

1. **HTTP-check.** `curl -s -o /dev/null -w "%{http_code}" <url>` — must return `200`. `404`/`410` = broken slot, instant CRITICAL finding.
2. **Read the alt + nearest heading.** What does the template *claim* the image is?
3. **Download the sample.** `curl -s -o /tmp/img-check/<id>.jpg <url>?w=300&q=70` then `Read` it (multimodal). What does it *actually* show?
4. **Score the match.** PERFECT / ACCEPTABLE-LOOSE / MISMATCH. Mismatches are the finding.

The four-step is non-negotiable. Steps 1 + 2 alone miss the most common failure mode (URL loads, alt is plausible, but the photo is the wrong subject). Steps 3 + 4 are what surface "the alt says brass apothecary, the photo is a woman wearing a necklace".

### 1.2 — Catalogue of confirmed mismatches caught (2026-05-04 → 2026-05-08)

This list is documentation that the audit is real work, not paranoia. Every entry was a live placement until caught.

| ID | Template slot claimed | Actually shows | Caught when |
|---|---|---|---|
| `photo-1611652022419-a9419f74343d` | "brass apothecary still-life" / "aged copper distillation apparatus" / "brass studio objects" | Woman wearing a delicate silver/gold necklace, top half of bare shoulders | 67-art-deco, 92-art-noveau, 26-about-me-card, 103-acid-glass-studio |
| `photo-1454165804606-c3d57bc86b40` | "Dual-monitor amber CRT terminal workbench" | Modern person at desk between two MacBook laptops | 93-cassette-futurism |
| `photo-1518709268805-4e9042af9f23` | "Smooth poured concrete macro" | Gothic German castle (Burg Eltz) in mist | 97-blueprintarchitectural |
| `photo-1500382017468-9049fed747ef` | "White oak wood grain" | Wheat field at sunset | 97-blueprintarchitectural |
| `photo-1525203135335-74d272fc8d9c` | "Guitarist" | Pink/red cake slices on marble | 62-90s-grunge |
| `photo-1576506542790-51244b486a6b` | "Cassette" | Open book with hand on dark wood | 62-90s-grunge |
| `photo-1485579149621-3123dd979885` | "Drummer" | Vintage chrome ribbon microphone | 62-90s-grunge (alt-text drift across templates) |
| `photo-1467453678174-768ec283a940` | "Jazz musician at vintage microphone" | Healthy breakfast bowl with avocado, granola, fruit | 67-art-deco |
| `photo-1481349518771-20055b2a7b24` | "Bartender pouring spirits behind marble counter" / "architectural corridor" / "color foundation" / "library landing" / many other archetypes | **Yellow banana on pink background** (subject drifted on Unsplash; verified 2026-05-08 multimodal) — used as cascade-ID across 18+ templates | 67-art-deco, 76-material-design, 45-real-estate, 79-neo-brutalism, etc. |
| `photo-1551024506-0bccd828d307` | "Crystal coupe glass holding amber cocktail" | Caramel pouring over ice cream / dessert | 67-art-deco |
| `photo-1592078615290-033ee584e267` | "Nesting tables" | Single black molded shell chair on wood legs — photo IS correctly a moulded shell chair; wrong only when alt names "nesting tables". PERFECT in 57-bauhaus's "T-1 Side Chair" context. Verify alt-fits-photo before flagging. | 57-bauhaus |
| `photo-1500964757637-c85e8a162699` | "Studio diary" / open notebook in office | Pages of an old novel | candidate, never shipped |
| `photo-1542038784456-1ea8e935640e` | "designer at tablet wireframes" / "drafting drawings" / "hallway" / many other archetypes | **Person tossing camera in autumn forest** — cascade-ID misused 12+ times across templates (added 2026-05-08) | 45-real-estate, etc. |
| `photo-1493663284031-b7e3aefcae8e` | "cornicing" / "master bedroom" / "Faroe cliffs" / "reef footage" / many other archetypes | **Modern grey/teal tufted sofa with pillows in living room** — cascade-ID misused 17+ times across templates (added 2026-05-08) | 45-real-estate, etc. |

The lesson: **a 200-OK image with the wrong subject is worse than no image** — it makes every page in the gallery look like the same warehouse photo set.

### 1.3 — The "no speculative IDs" rule

The §D.1 architecture/portrait pool was originally curated as "verified working IDs." Two problems made it dangerous:

1. **Subjects drift.** Photographers can replace, edit, or have Unsplash re-encode their photo. `photo-1611652022419` is a working ID — it just doesn't show what it showed when the §D.1 entry was written. The verification protocol's step 3 (download + look) is the only defence.
2. **Forced fits look identical to the right call.** An agent that writes "brass apothecary alt text + force-fit a §D.1 photo" produces output that passes a 200-OK check but reads as wrong. Multiple templates have shipped this way.

Audit rule: **flag any image whose alt text describes a subject that the actual photo does not show.** Don't assume the §D.1 catalogue is current; re-verify the subject of every ID you encounter.

### 1.4 — Brand logos via Simple Icons CDN

For "Trusted by" / "As seen on" / "Stocked at" / "Backed by" rows: the URL pattern is `https://cdn.simpleicons.org/<slug>` or `https://cdn.simpleicons.org/<slug>/<hex>` for a forced colour.

#### 1.4.1 — Confirmed-broken slugs (caught in audit, 2026-05-08)

| Slug | Status | Notes |
|---|---|---|
| `vogue` | 404 | Used in 92, 67 — now `hermes` |
| `forbes` | 404 | Used in 67 — now `dior` |
| `nyt` | 404 | Used in 67 — now `americanexpress` |
| `calm` | 404 | Used in 60 — now `fitbit` |
| `oura` | 404 | Used in 60 — now `garmin` |
| `whoop` | 404 | Used in 60 — now `strava` |
| `logitech` | 404 | — |
| `openai` | 404 | OpenAI's logo is in their style guide, not Simple Icons |
| `microsoft` | 404 | Use `microsoftedge`, `microsoftteams`, `microsoft365` etc. |
| `slack` | 404 | At time of writing — re-verify if you encounter it |
| `masterclass` | 404 | — |
| `applehealth` | 404 | Use `applemusic` if you need an Apple-coded chip |
| `keychron`, `rivian`, `kering`, `chanel`, `versace`, `burberry`, `tiffany`, `cartier`, `rolex`, `monocle`, `dezeen`, `wallpaper`, `wired`, `bloomberg`, `theatlantic`, `harpersbazaar`, `nyt`, `nikkei`, `reuters`, `condenast`, `louisvuitton`, `prada`, `gucci`, `fendi`, `moet`, `kate-spade`, `tiffany-and-co` | 404 | Most luxury / consumer / press brands aren't in Simple Icons |

#### 1.4.2 — Confirmed-good replacement slugs (audited 2026-05-08)

`anthropic`, `huggingface`, `langchain`, `replit`, `palantir`, `mongodb`, `redis`, `postgresql`, `elasticsearch`, `vercel`, `cloudflare`, `datadog`, `sentry`, `mixpanel`, `posthog`, `github`, `figma`, `framer`, `linear`, `notion`, `supabase`, `nvidia`, `intel`, `arduino`, `raspberrypi`, `amd`, `apple`, `applemusic`, `airbnb`, `stripe`, `shopify`, `etsy`, `pinterest`, `instagram`, `medium`, `substack`, `theguardian`, `spotify`, `vimeo`, `behance`, `dribbble`, `discord`, `twitch`, `telegram`, `signal`, `bandcamp`, `soundcloud`, `ableton`, `redbull`, `nike`, `headspace`, `peloton`, `garmin`, `fitbit`, `strava`, `audible`, `duolingo`, `netflix`, `uber`, `mastercard`, `visa`, `americanexpress`, `cocacola`, `tesla`, `lufthansa`, `britishairways`, `dior`, `hermes`, `ikea`, `mailchimp`, `intercom`, `zoom`, `microsoftteams`, `awwwards`, `sketchfab`, `threedotjs`, `blender`.

This list is correct as of **2026-05-08**. Re-verify any slug before flagging in a new audit — Simple Icons removes brands when companies re-license, so a slug that worked last week can 404 today.

#### 1.4.3 — Audit checks for trusted-by rows

- Pre-flight check **every slug** with `curl -s -o /dev/null -w "%{http_code}" "https://cdn.simpleicons.org/<slug>"`. 404 = finding.
- The forced-colour URL form is `https://cdn.simpleicons.org/<slug>/<hex-without-#>`. The colour suffix doesn't gate availability — the slug itself does.
- Brand fit matters too. A jazz/speakeasy template with `redbull` in its trusted row reads false; a wellness app with `cocacola` reads false. Flag mis-archetyped brands as MEDIUM.
- Made-up brand names rendered as text caps (`ATLASWORKS · PIXELPATH · NORTHBEAM · HELIX LABS`) instead of real Simple Icons logos = HIGH finding. Documented in playbook history; user has called this out repeatedly.

### 1.5 — Archetype routing (which subjects belong on which template)

This is the single most-violated rule across upgrade history. The §D.1 verified pool has narrow subject coverage; force-fitting it across archetypes makes every page in the gallery read as warehouse stock.

| Archetype | Imagery that fits | Imagery that does NOT fit (instant MISMATCH) |
|---|---|---|
| Wedding / invitation | Couples, hands, rings, flowers, chapels, candles | Brutalist concrete, server rooms, editorial portraits-with-no-couple |
| Wabi-sabi / ceramics | Hands at wheel, ceramic vessels, clay studio, kiln glow | Brutalist towers, server racks, fashion editorials |
| Synthwave / audio studio | Synths, cassettes, vinyl, neon signage, analog gear | Wedding florals, ceramics, real-estate listings |
| Real-estate listing (cosy) | Cosy interiors, period detail, kitchen, bedroom, garden | Brutalist towers, fashion editorial portraits |
| Real-estate listing (modernist) | Brutalist/modernist architecture | Ceramics, wedding florals |
| Cassette futurism / arcade | Industrial pipes, server racks, circuit boards, vintage hardware | Wedding florals, ceramics, fashion editorials |
| Comic publisher / pop-art | Editorial portraits with halftone, comic frames | Wedding florals, ceramics |
| Perfume / luxury maison | Florals, brass apothecary still-life, atelier interior | Server rooms, brutalist towers |
| Speakeasy / bar | Vintage bar interiors, cocktails, microphones, jazz | Breakfast bowls, architectural corridors |
| 90s-grunge band | Microphones, drum kits, guitarists, concert atmosphere, vinyl | Cakes, breakfast bowls, books |
| AI / research product | Data centres, code editors, dashboards, abstract gradients | Wedding florals, ceramics |
| 3D / abstract studio | Abstract gradients, 3D-rendered figures, render screens | Editorial portraits with halftone |

Audit check: name the template's archetype first, then evaluate every image against the row above. Anything in the right column is a finding.

### 1.6 — Aida-public + Cloudinary URLs

`https://lh3.googleusercontent.com/aida-public/AB6AXu...` images were curated for specific templates and are usually subject-correct.

- **Trust by default.** They were placed deliberately at template-creation time.
- **Verify if you have reason to suspect drift.** Aida-public URLs can serve different bytes over time; if alt+heading don't match what curl shows, treat as MISMATCH the same way as Unsplash.
- **No subject testing without browser-view.** You cannot resize aida-public via query params reliably; download at native resolution and inspect.

`https://res.cloudinary.com/<cloud>/image/upload/...` is rare (one in 08-apple-style-hero) and is a hand-uploaded asset. Same trust-but-verify rule.

---

## 2. Image audit — broken / 404

Separate from context: an image URL can be **structurally broken** (404, 410, malformed query, wrong CDN hostname).

### 2.1 — Quick scan

```bash
# Pull every Unsplash URL across templates and HTTP-check each unique one.
cd web && grep -rohE 'images\.unsplash\.com/[^"]+' --include="*.html" --include="*.jsx" \
  | sort -u \
  | while read url; do
      code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
      [ "$code" != "200" ] && echo "$code $url"
    done
```

Same approach for `cdn.simpleicons.org`, `lh3.googleusercontent.com/aida-public`, `res.cloudinary.com`.

### 2.2 — `auto=format` coverage

Every Unsplash URL should carry `auto=format` so the CDN ships AVIF / WebP to modern browsers. URLs without it force JPEG-only delivery — ~30–50% larger payload.

```bash
cd web && grep -rohE 'images\.unsplash\.com/[^"]+' --include="*.html" --include="*.jsx" \
  | grep -v "auto=format"
```

Findings = list of slots that need `auto=format` appended. As of 2026-05-08 the gallery is 100% covered; flag regressions.

### 2.3 — Inappropriate `w=` sizes

Common waste: `w=2000` on a thumbnail, `w=400` on a full-bleed hero (blurry on retina).

| Slot context | Acceptable `w=` |
|---|---|
| Full-bleed hero / section bg | 1600–1920 |
| Primary card image | 900–1400 |
| Secondary card / strip tile | 600–900 |
| Avatar / icon-size thumb | 200–400 |
| Aside / inset thumbnail | 300–500 |

Flag mismatches but mark as LOW unless egregious.

### 2.4 — Lazy-loading audit

`loading="lazy"` should be on every below-the-fold `<img>` and **never** on hero / above-the-fold images (lazy-eager mismatch hurts LCP).

```bash
cd web && grep -rohE '<img[^>]*loading="lazy"[^>]*>' --include="*.html" | wc -l   # lazy count
cd web && grep -rohE '<img[^>]*>' --include="*.html" | wc -l                       # total
```

Expected: 30–50% lazy across the gallery (above-the-fold images intentionally eager).

---

## 3. Responsiveness audit

These are the patterns that have produced the most "looks broken on mobile" findings during reviews.

### 3.1 — Headline overflow at narrow widths

`text-display-xl` is typically ≥84px. Without a clamp it overflows narrow viewports.

**Spot it**: search for headline classes (`text-7xl`, `text-display-xl`, `text-headline-xl`, `text-9xl`) without a `text-[Npx] sm:text-[Mpx]` clamp on the same element.

```bash
grep -rE 'text-(?:display-xl|headline-xl|9xl|8xl|7xl)' --include="*.html" web/ \
  | grep -v "sm:text-\["
```

### 3.2 — Horizontal scroll into empty space

The single most-reported bug. Causes:

1. **Marquee strip with `width: max-content`** sitting in a parent without `overflow: hidden`.
2. **Decorative `absolute` element** with `bottom-0 translate-y-X` extending past the body.
3. **Section with negative margins** that slip past the body's `max-w-` constraint.

**Spot it**: search for any of:

```bash
grep -rnE 'width:\s*max-content|w-max(\s|"|\b)' --include="*.html" web/
grep -rnE 'translate-y-(?:1/2|full|24|28|32|40)' --include="*.html" web/
```

For each match, walk up the DOM tree (read upwards) and verify a parent has `overflow-x: hidden` or `overflow: hidden` or a containing `<section class="overflow-hidden">`.

Most reliable defence: a top-level `html, body { overflow-x: hidden; max-width: 100vw; }` rule. Flag templates lacking it as MEDIUM if they also have absolute decorative layers.

### 3.3 — Cards overlapping at md→lg viewports

`mt-12` / `-mt-8` row offsets ("editorial rhythm") were fine when the column above was empty. If a card has been added that fills the void, the offsets now collide. Visual tell: card row 2 rides up into the bottom edge of section 1.

**Spot it**: any card with `mt-` / `-mt-` / `translate-y-` in its outer element. Cross-check whether a sibling above it ends inside that same vertical band.

### 3.4 — Sticky-photo + scrolling-text bottom-misalignment

Pattern is `md:col-span-5 md:sticky md:top-32 md:self-start` (one short image) beside `md:col-span-7` (4–6 long article paragraphs). The sticky inner is shorter than the right column; visible empty stripe under the photo.

**Spot it**: any `md:sticky md:self-start` on a column inside a `grid grid-cols-12`. Audit finding: column heights don't align at `md:` and up.

### 3.5 — Touch hit-areas on canvas / inspector handles

If the template has SelectionOverlay-style draggable handles or sliders: verify the `coarse pointer` query yields ≥44×44 hit areas. Visual handles can stay 16/28px; the hit area must grow.

**Spot it**: `useCoarsePointer()` references + `hitAreaFor(visualPx, coarse)` invocations should be present in components that ship interactive handles. Non-application here for static landing templates — flag as N/A.

### 3.6 — Mobile menu / nav

- Navbar that uses `hidden md:flex` for desktop links must have a working `md:hidden` mobile burger.
- Burger should toggle a `mobile-menu-container` (or equivalent) class that uses `grid-template-rows: 0fr → 1fr` for height-animated reveal.
- Tap targets ≥44px high.

**Spot it**: `id="menu-btn"` + `id="mobile-menu"` pattern; verify both exist and their JS toggle wires up. Static landing templates often skip the JS — flag as MEDIUM if the mobile-menu container exists but the toggle isn't there.

### 3.7 — `overflow-x: hidden` on body

The bullet-proof fix to most layout-overflow bugs. Audit every template for either:

```css
body { overflow-x: hidden; }
```

or the equivalent Tailwind class on `<body>`. Flag missing as LOW (preventative); MEDIUM if the same template also has `width: max-content` marquees or large `translate-` decoratives.

### 3.8 — `aspect-ratio` on images to prevent CLS

Images without explicit `width="..." height="..."` (or aspect-ratio container) cause cumulative layout shift as they load.

**Spot it**: any `<img>` lacking both `width` and `height` attributes. Flag as MEDIUM at scale (pages with 10+ unsized images), LOW for a few stragglers.

```bash
grep -rohE '<img[^>]*src="[^"]+"[^>]*>' --include="*.html" web/ \
  | grep -vE 'width="[0-9]+"|aspect-\['
```

### 3.9 — Subscribe / primary-CTA placement

Audit for: primary CTA visible on first viewport at mobile (<=400px wide). Often the subscribe button gets pushed off-screen on small phones because of `self-end` / `ml-auto` without a fallback.

**Spot it**: primary CTAs with `md:self-end` or `ml-auto` and no `flex-col` mobile fallback that puts them in flow.

---

## 4. JSX / HTML identicality audit

`web/<NN>-<slug>.html` and `web/<NN>-<slug>.jsx` are user-confirmed parity copies for templates 1–100 (per CLAUDE.md). Any divergence is a bug.

### 4.1 — Same image set

```bash
# Per template — should produce empty diff
diff <(grep -oE 'src="https?://[^"]+"' web/57-bauhaus.html | sort -u) \
     <(grep -oE 'src="https?://[^"]+"' web/57-bauhaus.jsx | sort -u)
```

Permitted divergences:
- HTML uses `&amp;` in URLs; JSX uses raw `&`. The escaping difference is acceptable; the actual URL after un-escape must match.
- `loading=` / `decoding=` / `width=` / `height=` attribute presence should be the same in both. Flag drift.

### 4.2 — Same alt text

```bash
diff <(grep -oE 'alt="[^"]+"' web/57-bauhaus.html | sort) \
     <(grep -oE 'alt="[^"]+"' web/57-bauhaus.jsx | sort)
```

If alt strings differ, one side has been edited without the other. Always a finding.

### 4.3 — Same headings + body copy

Sample 5–10 distinctive headlines and verify both files contain them verbatim. Find candidates with:

```bash
grep -oE '<h[1-6][^>]*>[^<]+</h[1-6]>' web/57-bauhaus.html | head -10
```

then grep for each in the `.jsx`.

Missing headings = a section was added/modified on one side and not the other.

### 4.4 — Same number of items in repeating structures

```bash
grep -c '<article' web/57-bauhaus.html
grep -c '<article' web/57-bauhaus.jsx
```

Drift on these counts means a card got added/removed in one file. Check `<li>`, `<figure>`, `<section>` similarly.

### 4.5 — Same Simple Icons / brand list

Pull all `cdn.simpleicons.org/<slug>` references, sort, diff. The lists must be identical (same brands, same order).

### 4.6 — Unsupported JSX-only constructs

JSX templates have a curated UMD allowlist (see `lib/preview.ts` `SUPPORTED_PKGS`). The HTML twin can't import npm packages either — both rely on Tailwind CDN + the same supported UMDs.

Flag any JSX `import { X } from 'react'` (must use `React.useState` etc. — see §5.1). Flag any `import` from a non-React package not in the allowlist.

### 4.7 — `dangerouslySetInnerHTML` divergence

Style blocks in JSX use `<style dangerouslySetInnerHTML={{ __html: customCss }} />`. The `customCss` string must match the HTML's `<style>...</style>` body byte-for-byte (modulo cosmetic whitespace). Drift breaks the JSX preview.

---

## 5. JSX preview-iframe traps (conversion pet-peeves)

These are the live traps that have broken JSX templates in this repo. Always pointer-check each one before approving a JSX-side finding.

### 5.1 — Hooks must use `React.useState`, never named-import

`pointer:` `feedback_jsx_hooks_via_react_global.md`

The preview iframe's preamble walker silently drops `import { useState } from 'react'` for some valid sources. Symptom: `ReferenceError: useState is not defined` at runtime.

**Audit pattern**:

```bash
grep -nE "import\s*\{[^}]*\b(useState|useEffect|useRef|useMemo|useCallback|useReducer)\b" \
  --include="*.jsx" web/
```

Any match is a HIGH finding. JSX must call `React.useState(...)` directly.

### 5.2 — No TypeScript syntax in `web/*.jsx`

`pointer:` `feedback_no_ts_cast_in_jsx_templates.md`

The iframe Babel-standalone has the JSX preset only — no TypeScript preset. `as Type`, `satisfies`, generics, type annotations, and `<Component<T>>` all fail silently because tsc doesn't check `.jsx` files either.

**Audit pattern**:

```bash
grep -nE "\bas\s+\w+\s*[\)\,\;\}]|\bsatisfies\s+\w+|\<[A-Z]\w*<[A-Z]" \
  --include="*.jsx" web/
```

Watch especially for `style={{...} as React.CSSProperties}` — caught in 61-brutalism-raw on 2026-05-07. HIGH finding.

### 5.3 — JSX `<style>` cascade trap

`pointer:` `project_jsx_style_cascade_trap.md`

Plain `<style dangerouslySetInnerHTML>` in JSX lands inside `<body>`, after Tailwind CDN's head stylesheet. Author CSS that sets `background-color`, `color`, `font-family`, `border-color`, `padding`, or `margin` on the same elements as Tailwind utilities will silently override the utilities.

**Audit pattern**: read `customCss` strings. Flag any rule that sets a property Tailwind already exposes as a utility on the same selector class (e.g. a `.bento-card { background-color: #fff }` rule when the markup also uses `bg-white`).

### 5.4 — No SVG data URLs inside `<style>` blocks

`pointer:` `feedback_jsx_data_url_in_style.md`

`url("data:image/svg+xml,...")` patterns inside JSX-injected `<style>` blocks render unreliably in the preview iframe (work in HTML mode). Use `repeating-linear-gradient` / `radial-gradient` instead, or declare in `tailwind.config.theme.extend.backgroundImage` (extracted to head host-side), or use base64-encoded data URL inline on the consuming `<div>`.

**Audit pattern**:

```bash
grep -nE 'url\("data:image/svg\+xml' --include="*.jsx" web/ | head -10
```

Each match gets a MEDIUM finding pointing at the trap memory.

### 5.5 — Hydration: no `Math.random()` / `Date.now()` / `crypto.randomUUID()` in render

`pointer:` `project_hydration_random_in_render_trap.md`

"use client" components SSR + hydrate twice; non-determinism in `render` (or in `useState` lazy initialisers) diverges between server and client. Symptom: hydration warnings in the console.

**Audit pattern**: this is mostly a `components/Workspace.tsx` concern, not a `web/<NN>-*.jsx` concern (templates run inside the iframe, not the SSR shell). Flag only if the JSX template itself has `Math.random()` / `Date.now()` in its render body.

### 5.6 — TS template-literal backslash double-escape

`pointer:` `project_ts_template_backslash_trap.md`

Inside TS backtick templates emitting JS source (`lib/preview.ts inspectorRuntimeJs` etc.), TS collapses `\\` → one backslash. Iframe regex literals + strings containing backslashes need double-escapes. Under-escape kills the iframe `<script>` parse entirely.

**Audit pattern**: this affects `lib/preview.ts` and similar runtime-emitter files, not `web/<NN>-*.jsx` directly. Flag only when auditing the runtime layer.

### 5.7 — Backticks inside comments inside iframe-runtime templates

`pointer:` `project_ts_template_backtick_trap.md`

Backticks **inside JS comments** that live inside the outer `\`...\`` template close the outer template at TS parse time AND at Webpack cold-cache production-bundle load time. Same surface as 5.6.

**Audit pattern**: comments containing backticks inside `lib/preview.ts inspectorRuntimeJs` and similar. Don't apply to templates.

### 5.8 — `_extends`-style spread

`pointer:` CLAUDE.md gotcha

`{...(cond ? { target: "_blank", ... } : {})}` triggers Babel-standalone infinite recursion in the preview iframe. Use explicit conditional attributes instead.

**Audit pattern**:

```bash
grep -nE '\{\.\.\.\(' --include="*.jsx" web/
```

Each match: HIGH finding.

### 5.9 — `DOMContentLoaded` won't fire

CLAUDE.md gotcha

The preview iframe's `DOMContentLoaded` has fired before `lib/preview.ts` re-emits the script. Inline init scripts wrapping their body in `document.addEventListener('DOMContentLoaded', ...)` will never run inside the iframe.

**Audit pattern**:

```bash
grep -nE "addEventListener\(\s*['\"]DOMContentLoaded" --include="*.html" --include="*.jsx" web/
```

HIGH finding. Use a plain IIFE: `(function(){ ... })();`.

### 5.10 — Curated UMD allowlist

The iframe loads only the UMDs in `lib/preview.ts` `SUPPORTED_PKGS`. Common allowed: React, ReactDOM, Babel-standalone, Tailwind play CDN, Lucide UMD, Material Symbols icon font, Google Fonts.

**Audit pattern**: any `<script src="...">` in the template that points outside that allowlist. Examples that have shipped broken: framer-motion, @radix-ui, Three.js (when not loaded as a self-contained CDN UMD). Flag as HIGH.

### 5.11 — Iframe `processModuleSyntax` cascade

`pointer:` `project_iframe_processed_field_cascade.md`

`lib/preview.ts processModuleSyntax` had two early-return paths missing `relativeImports: []`. Caller's `processed.relativeImports.length` threw `TypeError: Cannot read properties of undefined`, masking the real error. Resolved 2026-05-05.

**Audit pattern**: this is a runtime-layer concern, not a template concern. Flag only when auditing `lib/preview.ts`.

### 5.12 — Active-trap consolidated table

| Trap | Pointer | Symptom | Audit grep |
|---|---|---|---|
| Hooks via named import | `feedback_jsx_hooks_via_react_global.md` | `useState is not defined` | `import\s*\{[^}]*useState` |
| TS syntax in `.jsx` | `feedback_no_ts_cast_in_jsx_templates.md` | iframe blanks silently | `\bas\s+\w+`, `satisfies`, generics |
| Style cascade in body | `project_jsx_style_cascade_trap.md` | Tailwind utilities silently overridden | read `customCss` for `bg/color/font` rules |
| SVG data URL in `<style>` | `feedback_jsx_data_url_in_style.md` | pattern invisible in JSX preview | `url\("data:image/svg\+xml` in `.jsx` |
| Hydration non-determinism | `project_hydration_random_in_render_trap.md` | hydration warnings | `Math.random\|Date.now\|crypto.randomUUID` |
| TS template `\\` collapse | `project_ts_template_backslash_trap.md` | iframe `<script>` parse dies | runtime emitters only |
| Backtick in comment | `project_ts_template_backtick_trap.md` | TS / Webpack parse error | runtime emitters only |
| `_extends` spread | CLAUDE.md gotcha | Babel-standalone infinite recursion | `\{\.\.\.\(` |
| DOMContentLoaded | CLAUDE.md gotcha | inline init never runs | `addEventListener\("DOMContentLoaded` |
| Unsupported UMD | CLAUDE.md gotcha | preview blanks | `<script src=` outside allowlist |

---

## 6. Reporting format

A clean audit report has three layers.

### 6.1 — Summary table

One row per template. Columns:

| Template | Critical | High | Medium | Low | Notes |
|---|---|---|---|---|---|
| 57-bauhaus | 0 | 0 | 1 | 2 | aspect-ratio on 2 imgs |
| 67-art-deco | 1 | 4 | 2 | 0 | 4 image mismatches + broken slug |

### 6.2 — Per-template finding list

```
## 67-art-deco

CRITICAL — line 226 — `photo-1514362545857` claims "Bar Interior" but renders as a single cocktail glass on dark wood.
  Suggested replacement (verified): `photo-1514933651103-005eec06c04b` (vintage backlit bar with copper counter).
  HTML+JSX both affected.

HIGH — line 358, 373, 403, 418 — four more image-context mismatches:
  - 1514362545857 (cocktail) → "speakeasy interior"
  - 1551024506 (caramel pour) → "cocktail in coupe glass"
  - 1467453678174 (breakfast bowl) → "jazz musician at vintage microphone"
  - 1481349518771 (architectural corridor) → "bartender pouring spirits"

HIGH — broken Simple Icons slugs in trusted-by row (line 312–319):
  - `vogue` → 404 (Simple Icons does not carry it)
  - `forbes` → 404
  - `nyt` → 404

MEDIUM — JSX twin (`67-art-deco.jsx`) line 27 has different alt strings vs HTML line 358; alt drift across 5 entries.

LOW — `auto=format` missing on 2 URLs at line 254, 260 (forces JPEG-only delivery).
```

Each finding cites:
- Severity tag (CRITICAL / HIGH / MEDIUM / LOW)
- File + line reference
- Evidence (what claim vs what's actually shown / what's broken)
- Suggested replacement *only if you've verified it* via the §1.1 four-step protocol

### 6.3 — Verified-replacements appendix

If the audit suggests replacement IDs, list each with proof of verification:

```
## Verified replacement IDs (this audit)

photo-1514933651103-005eec06c04b — "vintage backlit bar with copper counter"
  HTTP 200 ✓
  Subject visually verified (downloaded 2026-05-08) ✓
  Fits archetype: speakeasy / luxury bar ✓

photo-1485579149621-3123dd979885 — "vintage chrome ribbon microphone"
  HTTP 200 ✓
  Subject visually verified ✓
  Fits archetype: jazz / vintage performance ✓
```

Without this appendix, the suggested replacements are not actionable — the user has to re-verify each one before using.

---

## 7. Workflow when the user says "audit template X"

1. Open `web/<X>.html` and `web/<X>.jsx` side by side.
2. Read both end-to-end. Catalogue every `<img src>`, `<style>`, `<script>`, every Simple Icons logo URL, every headline.
3. For images:
   a. HTTP-check every unique URL (§1.1 step 1, §2.1).
   b. For any image whose alt or surrounding heading describes a specific subject: download + visually verify (§1.1 steps 2–4).
   c. Score each: PERFECT / ACCEPTABLE-LOOSE / MISMATCH.
4. For Simple Icons: HTTP-check every slug (§1.4.3).
5. For JSX-side traps: run §5.12 grep table. Each match → pointer-cited finding.
6. For HTML/JSX identicality: run §4.1 – §4.6 diffs. Each drift → finding.
7. For responsiveness: walk §3.1 – §3.9 checklist. Each violation → finding.
8. Compose report per §6 (summary table + per-template list + verified-replacements appendix).
9. Hand back to user. **No edits.**

---

## 8. Don'ts (audit-specific)

- **Don't write code.** The audit's output is a report, not a patch.
- **Don't push, don't commit, don't `gh pr create`.**
- **Don't create scratch / planning markdown files.** The report goes back as a chat message.
- **Don't run `next build` / `next dev` / puppeteer / vitest.** All `feedback_*` rules in `MEMORY.md` apply.
- **Don't fabricate Unsplash IDs in suggested replacements.** §1.3 rule. If you cannot verify a replacement (HTTP + download + visually inspect), say "no verified replacement available — surface to user."
- **Don't blanket-flag aida-public URLs as MISMATCH** unless you've actually verified the subject. They were curated for the original template.
- **Don't auto-promote LOW findings to HIGH** to make the report look more substantial. The severity matters; gallery owners read by severity.
- **Don't audit the iframe runtime, the harness, the gallery, or anywhere outside the named template.** Surface unrelated breakage as a single line in the report; do not deep-dive.
- **Don't substitute §D.1 architecture photos when the archetype is wedding / ceramics / food / garden / kids / sports.** §1.5 archetype routing.

---

## 9. Resume after `/clear`

If you're resuming an audit after a fresh context clear, do these in order:

1. Read `CLAUDE.md`. Stack, rules, gotchas.
2. Read `MEMORY.md` for active feedback / project pointers.
3. Read this file end-to-end (you can skim §0 – §2 if you've read it recently; §5 traps and §6 reporting format are mandatory every time).
4. Ask the user: "which template(s) am I auditing, and what severity floor do you want in the report (CRITICAL+HIGH only, or include MEDIUM/LOW)?"
5. Begin §7 workflow on the named template(s).

---

## 10. Pointers — open on demand

- **CLAUDE.md** — locked stack, gotchas, repo rules.
- **CLAUDE-archive.md** — AST engines, layout rules, template playbook (legacy upgrade context).
- **MEMORY.md** — index of feedback + project memories.
- **`maniuplation.md`** — manipulation system spec (master reference for editor/iframe behaviour, not template surface).
- Trap memories cited in §5: each is one file under `~/.claude/projects/C--Users-nikit-akellaPreView/memory/`.

---

_Last rewritten: 2026-05-08 — converted from upgrade playbook (3923 lines, 10 catalogue sections H–S) to audit playbook (this file). The upgrade catalogues live in git history as `template-upgrade-playbook.md` revisions before this date — recoverable via `git show <commit>:template-upgrade-playbook.md` if needed for adding new sections._
