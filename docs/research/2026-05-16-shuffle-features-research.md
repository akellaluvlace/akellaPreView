# Vibecoder Shuffle Features — Research & Viability

**Author**: 2026-05-16 research pass after Try Variations failed on real templates.
**Status**: RESEARCH ONLY. No code changes from this doc. Implementation decisions wait for user sign-off per feature.
**Goal**: Honest viability assessment for image / color / font shuffle features. Cover what works, what doesn't, and where the dead zones are — before writing any more code.

---

## Section 1 — Template inventory (what we're actually shipping against)

108 JSX templates + 108 HTML twins = 216 files in `web/`. Analysis below is JSX-only because that's the active edit surface; HTML versions are mostly auto-generated parity copies.

### 1.1 Image patterns

**By count, across 108 JSX templates:**

| Pattern | Count | Files | Notes |
|---|---:|---:|---|
| `<img ...>` tags | 620 | 108 | Every template has imgs |
| `src="https://..."` literal | 110 | 61 | Direct literal src in JSX |
| `src={var}` JSX expression | 13 | 9 | Variable reference; URL lives elsewhere in source |
| `bg-[url(...)]` Tailwind arbitrary | 502 | 56 | **Mostly textures, not photos** |
| `backgroundImage:` / `background-image:` | (failed grep, ~50 est.) | ~20 | Inline `style={{}}` or CSS |
| `img:` field in const data arrays | high (estimated 1000+) | ~80 | The "real" pattern — see §1.2 |

### 1.2 URL host frequency (across all `web/*.jsx`)

| Host | Occurrences | What it is | Shuffle eligible? |
|---|---:|---|---|
| `images.unsplash.com` | **1207** | Photos (dominant) | YES |
| `lh3.googleusercontent.com` | 266 | Mix: `/aida-public/` = AI-gen photos; others = avatars | PARTIAL — only `/aida-public/` |
| `fonts.googleapis.com` | 232 | Google Fonts CSS | NO (font, not photo) |
| `cdn.tailwindcss.com` | 79 | Tailwind script | NO |
| `fonts.gstatic.com` | 76 | Google Fonts assets | NO |
| `cdn.simpleicons.org` | 53 | Brand icons | **NO** (icons, not photos) |
| `unpkg.com` | 20 | npm CDN | NO |
| `ui-avatars.com` | 9 | Generated avatars | **NO** (deterministic, generated) |
| `upload.wikimedia.org` | 6 | Wikipedia images | NO (specific educational) |
| `api.dicebear.com` | 4 | Generated avatars | NO |
| `transparenttextures.com` | 3 | CSS pattern textures | NO (textures, not photos) |
| `i.pravatar.cc` | 3 | Random avatars | NO (already random) |
| `media.giphy.com` | 2 | GIFs | EDGE — debatable |
| `res.cloudinary.com` | 2 | CDN (could be anything) | YES if photo-shaped |

**Key takeaway**: Photo URLs in templates are ~1207 Unsplash + a sliver of others. The 502 `bg-[url()]` occurrences are **mostly data-URI SVG textures + transparenttextures.com patterns** — NOT photos, and shouldn't be touched.

### 1.3 The actual structural shapes

Looking at how templates use photo URLs (sampled `17-single-product-dtc.jsx`, `109-dark-luxury-occult.jsx`, etc.):

**Shape A — Const data array referenced via JSX expression** (most common — ~80% of photo URLs):
```jsx
const products = [
  { id: 1, img: "https://images.unsplash.com/photo-...", title: "Apothecary" },
  { id: 2, img: "https://images.unsplash.com/photo-...", title: "Vault" },
];
// ...
{products.map((p) => <img src={p.img} alt={p.title} />)}
```
The URL is a literal in the const, but `src={p.img}` is a JSX expression. **A scanner looking only inside `<img>` tags misses this entirely.**

**Shape B — Direct literal src** (~15%):
```jsx
<img src="https://images.unsplash.com/photo-..." alt="Hero" />
```

**Shape C — Tailwind bg-image arbitrary** (~5%):
```jsx
<section className="bg-[url('https://images.unsplash.com/photo-...')]">
```
The URL is inside the className string, escaped within `url('...')`.

**Shape D — Inline style backgroundImage** (rare):
```jsx
<div style={{ backgroundImage: "url(https://...)" }}>
```

### 1.4 Color patterns

**By count, across 108 JSX templates:**

| Pattern | Count | Files | Notes |
|---|---:|---:|---|
| Hex literal (`#abc` / `#abcdef`) | **3794** | 108 | Universal; some templates have 100+ |
| Tailwind palette utilities (`bg-blue-500` etc.) | 2482 | 82 | Standard Tailwind colors |
| Tailwind arbitrary (`bg-[#hex]`) | 1204 | 62 | Mixed with palette utilities |
| `rgba()` / `hsla()` / `rgb()` / `hsl()` | 990 | 89 | Mostly in inline styles + CSS |
| CSS custom props (`--foo:`) | 129 | 108 | ~1 per file (`:root {}` block) |

**Key takeaway**: Colors live in 4 different forms scattered throughout each template. **There is no shared design-token system.** A "make it darker" feature has to handle all 4 forms, or pick one mutation strategy that bypasses source modification entirely (see §3).

### 1.5 Font patterns

**By count:**

| Pattern | Count | Files | Notes |
|---|---:|---:|---|
| Google Fonts `<link>` `family=X` import | ~250 imports | 108 | Universal — every template loads via CDN |
| Tailwind arbitrary `font-['Name']` | 1640 | 90 | Heavy use; per-element font selection |
| Tailwind utilities (`font-serif/sans/mono`) | 166 | 17 | Rare — only 17 templates use these |
| `font-family:` in inline CSS | 31 | 17 | Custom CSS in `<style>` blocks |

**Common font usage** (from `family=...` extraction):

Heavy hitters: Inter (~50 templates), Newsreader (~30), Space Grotesk (~25), Noto Serif (~20), Material Symbols Outlined (~80 — icon font, NEVER swap), Playfair Display (~10), JetBrains Mono (~6).

Specialty fonts in style-specific templates: Press Start 2P, Orbitron, VT323, Cinzel, Rubik Glitch, Permanent Marker, La Belle Aurore, etc. — each used in 1-2 templates that reference them by name.

**Key takeaway**: Each template loads 1-3 fonts via Google Fonts `<link>`, then applies via `font-['Name']` classes. A swap would need to (a) update the `<link>` URL's `family=` params, (b) replace every `font-['Name']` arbitrary class. Two-location edit per font.

---

## Section 2 — Industry research

### 2.1 Image swap UX (Plasmic, Onlook, Webflow)

**Plasmic**: Image swap is a *per-element* affordance. Designer right-clicks the image attribute, "Allow external access" exposes it as a bindable prop, then dynamic-value picker selects the new source. There's a project-level **asset library** users upload to; bound props pick from the library OR from data sources. No "shuffle all images" concept — that's not how visual editors think about images. Images are *content*; shuffling content is unusual.

**Onlook**: Same architectural pattern as Dropin (data-oid attributes injected at build, edit instrumented via OID lookup). Asset management via Figma-like UI. AI integration recommends images based on context.

**Webflow**: Asset panel with upload + Unsplash-search-by-keyword baked in. Per-element image swap. No "shuffle the whole site."

**Conclusion**: "Shuffle every image at once" is NOT an industry pattern. It's something we invented. The industry pattern is **per-image picker with optional AI/library search**. Sources:
- Plasmic: [Dynamic values](https://docs.plasmic.app/learn/dynamic-values/) · [Code components API](https://docs.plasmic.app/learn/code-components-ref/)
- Onlook: [LogRocket review](https://blog.logrocket.com/onlook-react-visual-editor/) · [Onlook README](https://github.com/onlook-dev/onlook)

The per-image Shuffle we already shipped (in `ImageControls.tsx`) IS aligned with industry. The Try Variations "shuffle everything" feature is the outlier.

### 2.2 Lighter/Darker UX

**Industry approach (Tailwind v4 + design tokens)**:
- Colors defined as HSL CSS variables at `:root`: `--primary: 220 90% 50%;`
- Theme references via `hsl(var(--primary))` everywhere
- "Darker" mode: redefine the variables with shifted L values
- The whole site updates from one variable change

**Why this DOESN'T fit Dropin's existing templates**:
- Templates don't use CSS variables for color. They scatter hex/Tailwind classes inline.
- Retrofitting CSS variables across 108 templates is a multi-day project per template (manual auditing to identify primary/secondary/accent etc.).

**Alternative: source-mutation approach** (no architectural change):
- Walk every hex/rgba/hsla in source, convert to HSL, shift L by ±N%, write back
- Tailwind palette classes (`bg-blue-500`): map to shade variant (`bg-blue-700`) via lookup
- Tailwind arbitrary (`bg-[#hex]`): parse hex, shift HSL, rewrite
- This is heavy: 3794 hex + 2482 palette + 1204 arbitrary + 990 rgba = **8470 color references per template (theoretical max)**. Realistically the math runs in <100ms per template but the **risk surface is huge** — one bad mutation breaks visual hierarchy.

**Alternative: CSS filter approach** (lightweight, non-source-touching):
- Inject `<style>body { filter: brightness(N) saturate(M); }</style>` into the template
- Single-line edit at one location
- Slider drives `N` (brightness) and `M` (saturation)
- Downside: filter applies to **everything including images** — could wash photos out at extremes
- Counter: clamp `N` to `[0.7, 1.3]` so it's a subtle mood shift, not a destructive change

**Alternative: overlay blend approach**:
- Inject a fixed-position overlay div with `mix-blend-mode: multiply` (dark) or `screen` (light)
- Slider drives overlay opacity
- Doesn't desaturate photos; works as a tint
- Downside: needs careful z-index management; could intercept clicks if pointer-events not zeroed out

Sources:
- [HSL Starter Kit · web.dev](https://web.dev/patterns/theming/hsl-starter-kit)
- [Tailwind dynamic color theme](https://medium.com/@oodri/tailwind-dynamic-color-theme-solution-4351d0495c7f)
- [Tailwind v4 @theme](https://medium.com/@kevstrosky/theme-colors-with-tailwind-css-v4-0-and-next-themes-dark-light-custom-mode-36dca1e20419)

### 2.3 Font swap UX

**Industry approach**: Curated pair lists (Fontpair, Typewolf, Figma's "Google Fonts pairings"). User picks a pair from a small (10-40) curated list, designer doesn't expose the full Google Fonts catalog because choice paralysis + most fonts don't pair well for landing pages.

**Common 2026 pairs** (from web research):
- Inter + Playfair Display (clean modern + elegant serif)
- Inter + DM Serif Display (sans + editorial)
- Plus Jakarta Sans + Inter (modern SaaS)
- Space Grotesk + Inter (creative)
- Lora + Montserrat (classic trustworthy)
- Manrope + Inter (fintech)
- Poppins + Roboto (utility)
- Montserrat + Source Sans Pro (timeless)

Sources:
- [Typewolf Best Google Fonts 2026](https://www.typewolf.com/google-fonts)
- [Best Google Font Pairings 2026 — LandingPageFlow](https://www.landingpageflow.com/post/google-font-pairings-for-websites)
- [Google Fonts pairings — Material Design](https://m3.material.io/blog/google-fonts-pairing-figma)

---

## Section 3 — Per-feature viability

### 3.1 Image shuffle (Try Variations / per-element)

**What works today**:
- Per-image Shuffle button (`ImageControls.tsx`) — shipped 2026-05-15. Uses Pixabay with alt-text query. Single-image swap; doesn't touch other images.
- Background-image Shuffle on cards/sections (`CardControls.tsx`) — shipped 2026-05-15.

**What's broken today**:
- Try Variations "shuffle ALL images at once" — scanner is the bottleneck.

**v3 scanner status** (after 2026-05-15 rewrite to `looksLikePhotoUrl` heuristic):
- Catches Shape A (const-data-array URLs) ✓
- Catches Shape B (direct literal `<img src>`) ✓
- Catches Shape C (`bg-[url(...)]` Tailwind arbitrary) — **untested** against real templates
- Catches Shape D (inline `style={{ backgroundImage }}`) — **untested**

**Dead zones the v3 scanner can't help**:
- Templates with photo URLs we don't recognize as photos — `looksLikePhotoUrl` filters by hostname/extension/path-hint. If a template uses e.g. a S3 URL with no extension, no `/photo` path, no recognized host name, we'd skip it.

**Recommendation**:

| Option | Effort | Risk | Outcome |
|---|---|---|---|
| **A. Test v3 against all 108 templates, document dead zones** | 1 hr | None | Honest map of what shuffles + what doesn't |
| **B. Retire Try Variations, keep per-image Shuffle only** | 5 min | None | Less ambition, zero failure surface. Per-image Shuffle covers the vibecoder need ("I don't like this image, get me another") cleanly. |
| **C. Keep Try Variations + add per-template manual fallback** | ~2 hr | Medium | When scanner finds 0 photos, show vibecoder a "Manually shuffle each image" walkthrough |

**My honest take**: Option B. The industry pattern (per-element image swap) IS what we already have working. "Shuffle ALL images at once" is an outlier feature with high failure-mode surface. Vibecoders who want template-wide variety can use per-image Shuffle on each image they want changed (5 clicks for a typical hero template).

### 3.2 Lighter / Darker slider

**Three implementation paths**:

| Path | How | Coverage | Risk | Effort |
|---|---|---|---|---|
| **A. Source mutation** | Parse every hex/rgba/hsla/Tailwind in source, shift HSL `L`, rewrite | Universal | **HIGH** — 8400+ color refs per template; one bad mutation per template = visible breakage; no rollback path beyond undo | 1-2 days |
| **B. CSS filter** | Inject `<style>body { filter: brightness(N) }</style>` at template top | Universal (applies to everything including imgs) | LOW — single edit, instantly undoable, predictable | ~1 hr |
| **C. Overlay blend** | Inject fixed-position tinted overlay with `mix-blend-mode` | Universal but trickier | MEDIUM — z-index/pointer-events footguns | ~2 hr |

**Recommendation**: Path **B** (CSS filter) for v1.

Implementation sketch:
- Slider in WorkspaceActions row: "Mood" with `Darker ← → Lighter` labels, default center.
- Slider value `[-50, +50]` maps to brightness `[0.7, 1.3]` and inversely to saturation `[1.2, 0.9]`.
- On change: find-or-create a `<style id="dropin-mood">` tag in the template's `<head>` (or first `<style>` block in JSX), update its content.
- Goes through `setCode` → undo restores.

Trade-offs honestly named:
- Photos in the template DO get tinted (slightly desaturated when going dark, slightly washed when going light). For subtle adjustments this looks like atmosphere; for extreme values it looks bad. Clamp to `[0.7, 1.3]` keeps it subtle.
- Doesn't change the "color identity" of the template — just the mood. If user wants a different palette entirely, that's a separate feature (which we'd defer).
- Vibecoder mental model fits: "I want this template to feel darker / more moody" → slide → done.

If Path B proves popular, Path A could be a Pro upgrade later. Not now.

### 3.3 Font swap

**Implementation sketch (Path: curated pair list)**:

- Workspace chrome: "Font" dropdown with ~10 curated pairs.
- Each pair = `{ heading: "Playfair Display", body: "Inter" }`.
- On pick: rewrite (a) the `<link href="https://fonts.googleapis.com/...">` URL's `family=` parameters, (b) every `font-['<oldHeading>']` arbitrary class → `font-['<newHeading>']`, (c) every `font-['<oldBody>']` → `font-['<newBody>']`.
- Detect current pair by parsing the template's `<link>` URL.
- For templates that use specialty fonts (Press Start 2P, Permanent Marker, etc.), the heading/body roles may not match. v1 just rewrites the first two non-icon-font families found.

**Edge cases**:
- Templates using 3+ fonts (rare, but exist) — v1 rewrites only the first two.
- Material Symbols Outlined is in ~80 templates as the icon font — **always preserve**.
- Fonts referenced in inline CSS (`<style>` blocks) — v1 leaves these alone (rare).

**Curated list for v1**:
1. Inter + Playfair Display (default-feeling editorial)
2. Inter + DM Serif Display (modern + bold serif)
3. Plus Jakarta Sans + Inter (SaaS clean)
4. Space Grotesk + Inter (creative)
5. Lora + Montserrat (classic trustworthy)
6. Manrope + Inter (fintech)
7. JetBrains Mono + Inter (developer/dev-tools)
8. Cinzel + Lato (luxury)
9. Press Start 2P + VT323 (retro/gaming — only for matching templates)
10. Permanent Marker + Special Elite (handmade/personal)

**Risk**: Medium. Replacing fonts in the `<link>` URL is straightforward; replacing all Tailwind arbitrary `font-['...']` classes requires care to match exact font names (case-sensitive, space vs `+`).

**Effort**: ~3-4 hr.

---

## Section 4 — Recommended order of action

Ranked by (vibecoder value × ship safety):

1. **Test the v3 image scanner against all 108 templates** — 1 hr. Either confirms current state is good OR identifies dead-zone templates honestly. No code changes. This is the homework before any further shipping.
2. **Decision: retire Try Variations OR keep with documented dead zones** — depends on #1 output. Per-image Shuffle stays either way.
3. **Lighter/Darker slider via CSS filter (Path B)** — ~1 hr. Honest "mood adjustment," works on every template, fully undoable, no source mutation footguns.
4. **Font pair picker** — ~3-4 hr. After #3 proves out the "curated dropdown in chrome" pattern.

Each step is a separate decision point. Do not chain — stop after each, confirm with manual test, then proceed.

---

## Section 5 — What this research closes out

| Earlier guess / claim | Reality after research |
|---|---|
| "Shuffle every image at once is a vibecoder win" | Industry doesn't do this; it's an outlier feature with high failure surface. Per-element swap is the proven pattern. |
| "CDN allowlist regex will catch every photo" | 1207 Unsplash URLs covered, but ~5% of templates have URLs we don't recognize. v3 heuristic is broader but still has edge cases. |
| "Palette swap is risky like Move" (user's existing instinct) | Confirmed — source mutation across 8400+ color refs per template = high risk. CSS filter is the safer mood-adjustment path. |
| "Font swap is complex" | Actually tractable — Google Fonts `<link>` + Tailwind arbitrary classes, two-location edit per font, ~3-4 hr. |
| "bg-[url(...)] is a big dead zone" | Mostly textures/data URIs, NOT photos. ~5-10 actual photo URLs in bg across all templates. Not a critical miss. |

## Sources

- [Plasmic Dynamic Values](https://docs.plasmic.app/learn/dynamic-values/)
- [Plasmic Code Components API](https://docs.plasmic.app/learn/code-components-ref/)
- [Onlook (GitHub)](https://github.com/onlook-dev/onlook)
- [Onlook visual editor — LogRocket](https://blog.logrocket.com/onlook-react-visual-editor/)
- [HSL Light/Dark Starter Kit · web.dev](https://web.dev/patterns/theming/hsl-starter-kit)
- [Tailwind Dynamic Color Theme Solutions](https://medium.com/@oodri/tailwind-dynamic-color-theme-solution-4351d0495c7f)
- [Theme colors with Tailwind v4](https://medium.com/@kevstrosky/theme-colors-with-tailwind-css-v4-0-and-next-themes-dark-light-custom-mode-36dca1e20419)
- [Typewolf Best Google Fonts 2026](https://www.typewolf.com/google-fonts)
- [LandingPageFlow Google Font Pairings 2026](https://www.landingpageflow.com/post/google-font-pairings-for-websites)
- [Material Design — Google Fonts Pairings](https://m3.material.io/blog/google-fonts-pairing-figma)
- [Pixabay API Docs](https://pixabay.com/api/docs/)
- [Pexels API Docs](https://www.pexels.com/api/documentation/)
- [Free Image API comparison 2026 — LaoZhang AI](https://blog.laozhang.ai/en/posts/free-image-api)
