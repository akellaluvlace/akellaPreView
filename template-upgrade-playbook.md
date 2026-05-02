# Template Upgrade Playbook

> Companion to `CLAUDE.md`. Read **after** `CLAUDE.md` (which has the locked stack, repo rules, and JSX/HTML hand-conversion notes). This file is the visual / content / palette upgrade flow specifically — what to look for in a `web/<NN>-<slug>.html` template and how to fix it without breaking the project.

> **🔁 Resuming after `/clear`?** Skip to **§J — Resume after /clear** (bottom of file) for the 8-line quickstart. Then read §A (active JSX traps) before editing anything.

---

## ⚠️ HARD RULE — read CLAUDE.md + memory pointers BEFORE every JSX edit

**Before touching any `web/<NN>-*.jsx` file**, read these in order, every single time:

1. `CLAUDE.md` — locked stack, gotchas list (`#1`–`#13`), supported-package allowlist for the iframe.
2. `~/.claude/projects/C--Users-nikit-akellaPreView/memory/MEMORY.md` — index of feedback + project memories. Each linked file documents a live trap that has already broken JSX work in this repo.
3. The specific pointers below before editing the relevant subsystem.

**Skipping this is the single most common cause of broken JSX in this repo.** Every trap in this list cost a back-and-forth round trip to discover. Don't pay that tax twice.

### Active JSX traps (live as of 2026-04-30)

| Pointer | Symptom | Fix |
|---|---|---|
| `feedback_jsx_hooks_via_react_global.md` | `ReferenceError: useState is not defined` at runtime | Use `React.useState` / `React.useEffect` directly. Never `import { useState } from 'react'` — the iframe preamble walker silently drops the binding for some valid sources. |
| `project_jsx_style_cascade_trap.md` | Tailwind utility colors silently overridden in JSX preview only | Plain `<style dangerouslySetInnerHTML>` lands in `<body>`, after Tailwind CDN's head stylesheet. Don't set CSS properties in custom CSS that overlap with Tailwind utilities on the same elements. |
| `feedback_jsx_data_url_in_style.md` | SVG `url("data:image/svg+xml,...")` patterns invisible in JSX iframe (work in HTML) | Use `repeating-linear-gradient` / `radial-gradient` instead, OR declare in `tailwind.config.theme.extend.backgroundImage` (extracted to head host-side by `extractTailwindConfig`), OR use base64-encoded data URL inline on the consuming `<div>`. |
| `project_hydration_random_in_render_trap.md` | `Hydration failed` / attribute-mismatch warnings | No `Math.random()` / `Date.now()` / `crypto.randomUUID()` in render or `useState` lazy initialisers. Seed deterministically or move to post-mount `useEffect`. |
| `project_ts_template_backslash_trap.md` | Iframe `<script>` parse silently dies | Inside TS backtick templates emitting JS source, double every `\` (TS collapses `\\` → one backslash). |

### JSX edit checklist (do all of these)

1. **Read CLAUDE.md + the active pointers above.** Not a suggestion.
2. **Hooks**: write `React.useState`, `React.useEffect`, `React.useRef` directly. No `import { ... } from 'react'`.
3. **Data**: hoist repeated structures into module-level arrays at the top of the file, render via `.map()`. Don't duplicate markup.
4. **Decorative patterns**: pure CSS gradients (`repeating-linear-gradient` / `radial-gradient`). Never `url("data:image/svg+xml,...")` inside a `<style dangerouslySetInnerHTML>` block.
5. **Custom CSS**: only declare things Tailwind doesn't express as utilities (pseudo-elements, `::-webkit-scrollbar`, `:nth-child` delays, `@keyframes`, custom `border-radius`/`box-shadow` patterns). Don't set `background-color`, `color`, `font-family`, `border-color`, `padding`, `margin` that conflict with utility classes on the same elements.
6. **Mirror HTML changes 1:1** unless the user explicitly says otherwise. The HTML and JSX siblings are parity copies for templates 1–100.
7. **No new dependencies.** The iframe's curated UMD allowlist (`SUPPORTED_PKGS` in `lib/preview.ts`) is the surface. Adding `framer-motion`, `@radix-ui/*`, etc. won't load.
8. **Imagery — match subject to archetype before picking IDs (§D.0).** Don't reach for §D.1 IDs without first naming the subject keyword you actually need. The §D.1 pool is small and abstract; force-fitting it into wedding/ceramics/food/garden/kids/sports archetypes makes every page read like the same warehouse photo gallery. Read §D.0 + §D.1.5 before placing any image.

---

The user's signal "look through other templates to see if anything needs correcting" means: open each candidate template, read top-to-bottom, identify symptoms from the **Diagnostic Checklist** below, propose specific fixes (don't just dump the file back), and apply them following the **Validated Patterns**.

---

## Scope: which templates are in play

- `web/<NN>-<slug>.html` templates only. The `.jsx` siblings are user-confirmed parity copies of the HTML — **do not edit them in this flow**. If an HTML edit needs mirroring to its `.jsx` sibling the user will explicitly ask.
- Templates **1 – 100** were finalised on 2026-04-26 with JSX/HTML parity. Treat those as "production" — touch only what the user explicitly points at, and don't restructure them speculatively.
- Templates **101 – 112** are the newer Apr-2026 batch (HTML only, no JSX yet). These were named/upgraded during the recent session and remain the active upgrade target.
- **Worked through this session (do NOT re-rework these):** `101-luxury-watch-editorial`, `102-neon-glitch-brutalist`, `103-acid-glass-studio`, `105-constructivist-bento-terminal`, `106-neo-classical-editorial`, `108-ethereal-fashion-noir`, `109-dark-luxury-occult`, `110-arcade-hardware-brutal`. Cross-check them only if the user explicitly asks.
- **Likely candidates to check next:** `104-halftone-pop-art`, `107-y2k-vaporwave-grid`, `111-isometric-grunge-brutal`, `112-crt-glitch-cyber`. Plus anything else the user names.

---

## Repo rules that override everything in this file

(Pulled from `CLAUDE.md` — they outrank any instinct from this playbook.)

1. **No co-sign on commits.** No `Co-Authored-By: Claude` trailer.
2. **Never push without explicit user permission.** Local `git add` / `git commit` is fine.
3. **Locked stack.** No new deps. No Framer Motion / styled-components / Emotion / Redux / etc. The templates only run inside the iframe preview — they get Tailwind CDN + the curated UMDs in `lib/preview.ts`.
4. **Debug by reading code.** Don't spin up `next dev`, no puppeteer, no test harness unless asked.
5. **Don't run `next build` to "confirm".** Trust the edit. Use `npx tsc --noEmit` only if you suspect a TS-side regression.
6. **Don't create new files** unless the work clearly requires one. The only allowed new top-level file in this flow is this playbook itself.
7. **Don't write the auto-converter `scripts/html-to-jsx.mjs` over a hand-finished file.** That'd undo the user's finalised work.
8. **The template renders inside an iframe with React 18 + Babel-standalone + Tailwind CDN.** That means: a) no npm imports — the `<script src="https://cdn.tailwindcss.com?plugins=...">` tag and the `tailwind.config = { ... }` inline script ARE the design system. b) `<style>` blocks at the top of `<body>` will cascade and beat Tailwind utilities — this is the "JSX `<style>` cascade trap" noted in memory. Keep custom CSS in the `<head>`.

---

## Pre-flight: read before you touch

Before editing a template, do all of:

1. **Read the file end-to-end.** Templates are ~100–400 lines. Read all of it before deciding. Don't speed-read — knowing the existing structure prevents you from re-inventing patterns the file already uses.
2. **Catalogue the design tokens.** The `tailwind.config = { ... }` script at the top defines `colors`, `fontFamily`, `fontSize`, `spacing`. **Reuse those tokens** in any addition you make. New sections that use only existing tokens read as native; new sections that hardcode their own colour values read as bolted-on.
3. **Note the body's `<body class="...">`.** Many templates set base typography there (e.g. `font-body-md text-on-background`). Match.
4. **Note custom CSS in `<style>` at the top.** Patterns like `.glass-panel`, `.crt-scanline`, `.wood-texture`, `.clay-card`, `.brutalist-border`, `.glitch-text`, `.noise-bg`, `.scanline`, `.vignette`, `.glowing-text` etc. — if you add new content, **reuse these classes** rather than re-inventing.
5. **Check the existing `<keyframes>` and decorative animations.** The bottom `<style>` of some templates (e.g. `110`) has `@keyframes blob`, `@keyframes marquee`, `animation-delay-2000` — reuse them.

---

## Diagnostic checklist — what to look for

Walk through each template against these. If you find a symptom, propose the fix from the **Validated Patterns** section below.

### Contrast & legibility
- [ ] Body text uses an existing-token greyish-on-dark that's actually too dim (e.g. `text-on-surface-variant: #b5b0a4` looks washed-out behind a 5%-white glass blur). **Fix: bump the token value to near-ivory.**
- [ ] A section uses `bg-gradient ... to-white/20` (or similar) — the lower half of a headline literally fades to 20 % opacity. **Fix: change the gradient stop to a real accent colour.**
- [ ] A `<p>` or pill uses `text-surface-variant` / `text-outline opacity-50` on dark — Material Design naming makes this look right but it's near-invisible. **Fix: switch to `text-white` or `text-on-surface` (full opacity).**
- [ ] Glass panels with `background: rgba(255, 255, 255, 0.05)` and content inside that's hard to read. **Fix: lift to a real linear-gradient with 0.55–0.65 alpha** (see Pattern A.4).
- [ ] `mix-blend-difference` over a busy/mid-tone background producing muddy gray text. **Fix: drop the blend mode, switch to solid white + `drop-shadow`** (Pattern A.5).

### Layout & spacing
- [ ] Section is forced to `min-h-screen` with little content → huge empty void. **Fix: drop `min-h-screen`, use `py-20 md:py-24`** (Pattern B.3).
- [ ] An asymmetric grid (e.g. `col-span-5 portrait + col-span-7 16:9 wide`) leaves one column visibly shorter than the other, with a dead area below the shorter one. **Fix: wrap the shorter column in `flex flex-col gap-gutter` and add a quote / detail / sub-image panel below** (Pattern B.4).
- [ ] Decorative `mt-12` / `-mt-8` row offsets on a card grid that originally compensated for an empty column — and the column is no longer empty. **Fix: flatten the offsets to a small consistent value (`mt-8` works, or remove).**
- [ ] Footer with `mt-24 pt-8 ... pb-24` between rows = ~220 px of empty stack below the link grid. **Fix: tighten to `mt-10 pt-6 ... pb-10`.**
- [ ] An absolute-positioned element (`nebula-glow`, blur halo) with `bottom-0 translate-y-1/2` extending past the body bottom, creating phantom scroll space below the footer. **Fix: wrap the decorative layer in `<div class="fixed inset-0 pointer-events-none overflow-hidden" style="z-index: 0;">`** (Pattern B.5). This is the single most common cause of "redundant space below footer".
- [ ] A constrained `<main class="max-w-[1440px] ...">` with one section that wants to be full-bleed. **Fix: pull that section out as a sibling of `<main>`** (one `<main>` only — invalid HTML to have two), **or** move the constraint off `<main>` and onto each section that needs it (Pattern B.6).
- [ ] Hero / CTA wrapper card swallowing both the headline AND a hero visual, leaving the page feeling boxed-in. **Fix: drop the wrapping card, restructure to two-column grid (text left, image right)** (Pattern B.7).
- [ ] Headline using a giant `text-display-*` (84–120 px) with no responsive clamp → overflows on narrow widths. **Fix: clamp with `text-[60px] sm:text-[80px] md:text-[100px] lg:text-display-xl`.**

### Sparsity / empty page
- [ ] Page has only a hero + footer (e.g. `109` had this). **Fix: add 1–2 native-aesthetic sections** (Pattern C).
- [ ] A panel that's tall by virtue of `row-span-2` but contains 5 lines of content (e.g. terminal in `105`). **Fix: extend the content** (Pattern C.4).
- [ ] A horizontal-scroll image strip with `overflow-x-auto` that the user wants static. **Fix: convert to a `grid grid-cols-1 md:grid-cols-12` static layout, 4–5 images, mixed `col-span` for editorial rhythm.**

### Imagery
- [ ] Stock `lh3.googleusercontent.com/aida-public/...` URLs that the user wants replaced. **Fix: swap to Unsplash (Pattern D), maintain the aspect ratio.**
- [ ] Hero background is a low-effort gradient blob system — the user often wants it replaced with a photographic backdrop matching the template's other imagery. **Fix: image with `mix-blend-luminosity grayscale contrast-125`, a vertical gradient overlay so headline reads, and a centered radial vignette** (Pattern D.3).
- [ ] Cards that should have background images but don't. **Fix: layer recipe** in Pattern D.2.

### Navbar / header
- [ ] Glassmorphic nav with `bg-white/[0.03] backdrop-blur-2xl` against varied content underneath = barely visible. **Fix: solid surface bg + accent-tinted border** (Pattern A.6).

---

## A. Validated palette / contrast patterns

### A.1 — Premium-dark token swap (used on `103`)

When a template has a low-contrast or candy-bright dark palette and the user says "make it premium":

```
background, surface          → #0a0a0d (warm near-black, was often #141313 cool)
surface-container-lowest     → #0e0e12
surface-container-low        → #15151a
surface-container            → #1c1c22
surface-container-high       → #26262e
surface-container-highest    → #32323a
surface-bright               → #3a3a42
on-background, on-surface    → #f8f5ee (warm ivory, NOT #ffffff and NOT cool grey)
on-surface-variant           → #dcd7ca (near-ivory, ~14:1 against bg)
outline                      → #b0aa9d (warm muted, much brighter than cool grey)
outline-variant              → #4a4840
primary accent (gold)        → #d4b87a       (replaces acid lime / pink / neon greens)
primary-fixed-dim            → #a8915b
secondary accent (copper)    → #c97359        (replaces hot pink / magenta)
secondary highlight          → #e89572        (used for hover states + accent glows)
tertiary-container (deep)    → #3d1c10        (matches the copper)
on-primary-fixed (dark gold) → #1f1809
```

This palette reads as luxury without losing the dark-tech vibe. **Don't apply blindly** — only when the user says "premium" / "contrast bad" / both. Some templates' identity is the candy palette and shouldn't be flattened into gold.

### A.2 — Hardcoded Tailwind colour sweep

When you swap palette tokens, also sweep hardcoded Tailwind classes that bypass tokens. Common offenders:

- `text-lime-400`, `border-lime-400`, `bg-lime-400`, `rgba(163,230,53,1)` (lime-400 RGB) — replace with the new gold accent.
- `text-fuchsia-500`, `hover:text-fuchsia-500` — replace with the new copper highlight.
- Inline `rgba()` values inside the `<style>` block (e.g. `nebula-glow` glows) — recompute with the new accent's RGB values.
- Hardcoded `bg-black` / `bg-zinc-950` for footers — replace with `bg-[#0e0e12]` or `bg-surface-container-lowest` so it ties into the new warm-dark scheme.

### A.3 — Typography boost

If body text is dim, prefer **(token swap → ivory)** over **(`text-white` everywhere)**. Token-level fixes propagate to every consumer. Localised `text-white` is for spot-fixes (a chip, a single label).

For italic narrative copy or hero subtitles that disappear on busy backgrounds: `text-white font-bold ... drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]`.

### A.4 — Glass panel that actually has presence

Replace:
```css
.glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```
With:
```css
.glass-panel {
    background: linear-gradient(180deg, rgba(40, 40, 48, 0.55) 0%, rgba(20, 20, 26, 0.65) 100%);
    backdrop-filter: blur(24px) saturate(140%);
    -webkit-backdrop-filter: blur(24px) saturate(140%);
    border: 1px solid rgba(245, 241, 232, 0.12);
}
```
The 0.55→0.65 alpha gives cards real surface presence so text inside isn't fighting the page background. The `saturate(140%)` boost is what makes the underlying nebulae read warmer through the glass.

### A.5 — Hero headline contrast against a busy backdrop

Replace `mix-blend-difference text-white` (which goes muddy against metallic mid-tones) with:
- A **stacked dark gradient overlay** between the bg image and the content: `<div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>`
- Solid white text + heavy drop-shadow: `class="... text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"`

### A.6 — Solid nav (replacing glassmorphic)

Glassmorphic nav over varied content is unreadable. Use:
```html
class="... bg-[#15151a] border-2 border-[#d4b87a]/40 ... shadow-[6px_6px_0px_0px_rgba(212,184,122,0.85)]"
```
Solid surface, accent-tinted border, keep the hard offset shadow for personality. Drop `backdrop-blur-*` and `bg-white/[0.0X]`.

---

## B. Layout patterns

### B.1 — Make a section full-bleed inside a constrained `<main>`

Two valid approaches; pick whichever fits.

**Approach 1: pull section out of `<main>` as a sibling.** Cleanest for the hero. Only one `<main>` per page (HTML rule).

**Approach 2: move the constraint off `<main>` onto each constrained child.**
```html
<main class="pb-12 flex flex-col gap-24 w-full">    <!-- no max-w on main -->
  <section class="py-24 max-w-[1440px] mx-auto px-12 w-full">Constrained A</section>
  <section class="relative w-full ...">Full-bleed B</section>
  <section class="py-24 max-w-[1440px] mx-auto px-12 w-full">Constrained C</section>
</main>
```
Effective inner content width is identical to before (1440 − 2×48 = 1344 px), so the user can't tell the difference visually for the constrained sections.

### B.2 — Two-column hero (text left, image right)

```html
<section class="relative w-full min-h-[88vh] flex items-center pt-40 pb-24 px-6 md:px-12 overflow-hidden">
  <div class="relative z-10 w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
    <div class="flex flex-col items-start text-left order-2 md:order-1">
      <span class="font-mono-label ... mb-6">[ TAGLINE ]</span>
      <h1 class="...">HEADLINE</h1>
      <p class="...">subhead</p>
      <div class="flex gap-6 mt-10">CTAs</div>
    </div>
    <div class="relative order-1 md:order-2 flex items-center justify-center md:justify-end">
      <!-- image, often circular w/ outer rings (Pattern D.4) -->
    </div>
  </div>
</section>
```
The `order-1 / md:order-2` swap pushes the image above the text on mobile.

### B.3 — Manifesto / quote section that's full-bleed but content-sized

```html
<section class="relative w-full flex items-center justify-center py-20 md:py-24 px-6 md:px-12 overflow-hidden">
  <!-- decorative concentric circles, top-right + bottom-left -->
  <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-[#d4b87a]/15 z-0"></div>
  <div class="absolute -bottom-12 -left-12 w-96 h-96 rounded-full border border-[#d4b87a]/10 z-0"></div>
  <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-[#e89572]/15 z-0"></div>
  <div class="absolute -top-12 -right-12 w-96 h-96 rounded-full border border-[#e89572]/10 z-0"></div>
  <!-- Subtle gold dot-grid backdrop, masked to fade at edges -->
  <div class="absolute inset-0 opacity-50 pointer-events-none z-0"
       style="background-image: radial-gradient(rgba(212,184,122,0.10) 1px, transparent 1px);
              background-size: 32px 32px;
              mask-image: radial-gradient(ellipse 70% 60% at center, black 40%, transparent 90%);
              -webkit-mask-image: radial-gradient(ellipse 70% 60% at center, black 40%, transparent 90%);"></div>
  <!-- Horizon scanline -->
  <div class="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4b87a]/20 to-transparent z-0"></div>
  <div class="relative z-10 max-w-5xl mx-auto text-center">
    <span class="font-mono-label ... text-[#d4b87a] mb-8 tracking-[0.3em]">[ MANIFESTO_03 ]</span>
    <h2 class="...">Headline gradient ivory→gold...</h2>
    <span class="... text-white">VOID_PROTOCOL_ACTIVE</span>
  </div>
</section>
```

### B.4 — Column-balance fix when one column is shorter

Wrap the short column in `flex flex-col gap-gutter` and stack:
- The original card on top.
- A sub-row containing a quote panel + a small detail thumbnail (3-cols / 2-cols inner grid is good).

The quote panel pattern:
```html
<div class="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-between min-h-[260px]">
  <span class="material-symbols-outlined text-[accent] text-4xl leading-none">format_quote</span>
  <blockquote class="font-narrative-italic ... italic leading-relaxed mt-4">"...quote..."</blockquote>
  <div class="flex justify-between items-end mt-6">
    <cite class="font-label-caps ... tracking-widest not-italic">— STUDIO NOTE · 014</cite>
    <div class="w-12 h-px bg-[accent]/60"></div>
  </div>
</div>
```

### B.5 — Phantom scroll space below the footer

Caused by an absolute-positioned decorative element (`nebula-glow`, ambient blob, etc.) with `bottom-0 translate-y-X` extending past `body`'s bottom. The `position: absolute` on the body's child + visible overflow on body means the document scroll height grows.

Fix: wrap all such ambient layers in a single fixed-position viewport-clipped container.
```html
<div class="fixed inset-0 pointer-events-none overflow-hidden" style="z-index: 0;">
  <div class="nebula-glow ..."></div>
  <div class="nebula-glow-green ..."></div>
  <!-- etc. -->
</div>
```
The decorative elements still float ambient behind content, but they cannot extend the document.

### B.6 — Don't decorate cards for empty space that no longer exists

When a card grid had decorative `mt-12` / `-mt-8` offsets to fill a void below a short Adorn-style card, and you've added content to fill that void, remove the offsets. Otherwise cards in row 2 ride up into the new content's bottom edge → visible overlap.

### B.7 — Headline overflow guard

A `text-display-xl` at 120 px will overflow narrow widths. Always clamp:
```
class="text-[60px] sm:text-[80px] md:text-[100px] lg:text-display-xl"
```

---

## C. New-section playbook (when the user asks to add content)

### C.1 — Read the design language first

Before writing the new section: catalogue the existing typography classes (`font-headline-lg`, `font-h2-heading`, `font-cinzel`, `font-display-2xl`, `font-mono-label`), spacing (`section-gap`, `margin-page`, `gutter`), card primitives (`clay-card`, `glass-panel`, `wood-texture`, `bento-card`), and accent colours (`primary-container`, `tertiary`). **Reuse these tokens.** The single biggest "tell" of a bolted-on section is hardcoded `text-yellow-400` / `bg-zinc-900` / generic `font-sans` instead of project tokens.

### C.2 — Section structures that have worked

| Pattern | When to use | Example used in |
|---|---|---|
| **Doctrine list (Roman numerals)** — left col header + intro + pull-quote, right col 5 hairline-separated tenets with `I/II/III/IV/V` numerals | Editorial / occult / classical templates that need a content section beyond hero | `106` ("Five tenets of silent architecture") |
| **Discipline cards (4-column)** — grid of 4 clay-cards, each with Roman numeral, Material icon, headline, hairline rule, body, phase tag | Luxury / craft / process-oriented templates | `109` (Laboratory: Synthesis / Transmutation / Distillation / Resonance) |
| **Case-study grid** — 3-card grid with portrait images, hover desaturate→colour, micro-tags + Cinzel/Newsreader title + supporting copy + case-number chip | Studio / portfolio templates that have a hero only | `109` (Recent Transmutations) |
| **Triptych (3 portrait images)** — 1×3 grid below a manifesto headline, each with `STUDY · I/II/III` chip and editorial label | Fashion / editorial templates | `108` (Form / Light / Silence) |
| **Lookbook static grid** — 5 images in a 12-col layout (7+5 row, then 4+4+4 row) | Replacing horizontal-scroll moodboards | `108` |
| **Telemetry tile grid** — 6 instrument tiles (gauges, dials, LED grids, ASCII waveform, big counter, log console) | Industrial / arcade / hardware templates | `110` |
| **Marquee strip (reverse direction)** — duplicate the existing marquee with a new keyframe (`translateX(-50%)` → `0`) and a different bg colour | Industrial / arcade templates that already have one marquee | `110` (added a tertiary-blue one above Hardware Modules to complement the secondary-pink one below) |

### C.3 — Hoist repeated structures

Don't write 5 nearly-identical card blocks. If you need an array, **inline it as a JS array + `.map`** when the file is JSX. For pure HTML you can't `.map`, so just write the cards out — but use the same per-card structure verbatim, varying only label text + image src + body copy. Consistency makes the section feel professional; subtle markup variations make it feel hand-stitched.

### C.4 — Filling a sparse panel with content

When a panel (often `row-span-2` or with fixed `min-h-`) looks empty:

- For a **terminal panel** (e.g. `105` TERM_42): expand to ~15 lines of `[INIT] / [LOAD] / [BOOT] / [SYNC] / [WARN] / [SCAN] / [STAT] / [NOTE] / [OK] / [QRY]` boot-sequence logs + a simulated operator command + `> _` prompt.
- For an **image panel**: bg-image with `mix-blend-luminosity grayscale contrast-125` + a child overlay matching the surrounding card aesthetic (e.g. CRT scanline, gradient veneer).
- For a **stat panel**: vertical bar gauge OR conic-gradient dial OR LED grid (matrix of `aspect-square` divs with shadow-glow).

### C.5 — Adding a marquee bar sibling

If the template already has one marquee, the user may want a second above another section, scrolling the opposite direction.
1. Add a new keyframe in the bottom `<style>`:
   ```css
   @keyframes marquee-reverse {
       0% { transform: translateX(-50%); }
       100% { transform: translateX(0); }
   }
   ```
2. Use a different bg-colour (e.g. `bg-tertiary` if the existing one is `bg-secondary`).
3. Different content (different status messages — `POWER · NOMINAL — 4.7 KW`, `UPTIME · 1024 HRS`, etc.) so it doesn't read as a copy.
4. Duplicate the message group inline so the loop seamlessly tiles.

---

## D. Imagery

### D.0 — Image-context match (READ FIRST, applies to every image you place)

**The failure mode (May–Jun 2026 batches):** Across upgrade sessions, agents kept reusing the same 7-8 §D.1 architecture IDs (`1487958449943-2429e8be8625` + 6 brutalist/concrete cousins) and the same 8 fashion-editorial portraits across wildly different archetypes — wedding invitation, synthwave audio studio, real-estate listing, podcast site, personal blog, ceramics studio, travel-tour Iceland expedition. The result reads like the same warehouse photo gallery wearing different palettes — *user's correction, 2026-05-04: "banana, batman and google images everywhere".*

The §D.1 pool is verified-working but **small and abstract enough that any agent can force-fit it into any archetype**. That's exactly the trap. Force-fitting kills the page.

**The rule — match imagery to the template's archetype BEFORE reaching for §D.1:**

1. **Name the SUBJECT first, not the §D.1 slot.** Before writing an `<img src=...>`, decide what the image must depict for the section to read true. e.g. "ceramic vase top-down on linen", "synthesizer on wood desk under warm tungsten", "wedding hands holding rings", "tea bowl in raking sunlight", "espresso bar tile", "fern unfurling, macro". Write the subject keyword in a comment beside the slot before picking an ID.

2. **Then check §D.1's subject map (D.1 below).** Every §D.1 ID now has an explicit subject tag describing what the photograph actually shows. If §D.1 has a verified ID matching your subject keyword, use it.

3. **If §D.1 doesn't have a matching subject, look at the template's existing aida-public URLs first.** Those URLs were curated for the original template — wedding-template aida-public photos are wedding-coded, ceramics aida-public photos are ceramics-coded. **Reuse them when the subject fits.** Re-cropping an existing aida-public via `?w=` query params for new sections is preferred over force-fitting a §D.1 architecture photo into a wedding section.

4. **If neither §D.1 nor the template's existing aida-public covers the subject, STOP and surface to the parent agent.** Do NOT substitute a §D.1 ID whose subject is wrong just because it's verified. *A 200-OK image with the wrong subject is worse than no image* — it makes the page look like every other template in the gallery. Per CLAUDE.md rule 6, surface the gap, don't paper over it.

5. **No speculative Unsplash IDs.** Don't invent IDs that "look §D.1-shaped" with subtly-different suffixes. The `1531259683007-016a943cdcdf` family of failures (49-three-js, 09-video-background-style, twice in May 2026) is exactly this. Suffixes are literal Unsplash hashes; one wrong character = 404.

**Audit step (parent agent runs after every batch):**
```bash
# Pulls every photo ID an agent placed and reports which aren't in §D.1 yet.
for f in <touched files>; do
  for id in $(grep -oE "photo-[0-9]+-[a-zA-Z0-9]+" "$f" | sed 's|photo-||' | sort -u); do
    grep -q "$id" template-upgrade-playbook.md || echo "$f: not in §D.1: $id"
  done
done
```
Any line that prints is either (a) a speculative ID that needs replacing or (b) a genuinely new verified ID the user has confirmed and that should be added to §D.1 with a subject tag. Default action is (a) until the user signs off.

### D.1 — Subject map of verified Unsplash IDs

Confirmed-working photo IDs (used and loading verified). Use these preferentially. URL form: `https://images.unsplash.com/photo-<ID>?w=<W>&q=85&auto=format&fit=crop`.

**The pool's subject coverage is narrow:** it's 8 dark editorial portraits, 7 brutalist/architecture frames, 4 industrial/server interiors, and 1 luxury still-life. Anything outside those subject zones (food, weddings, ceramics, gardens, music instruments, sports, kids, animals, plants, books, beverages, vehicles, specific cultures, outdoor nature) is **not in §D.1** and shouldn't be force-fit.

**Fashion / editorial portraits — moody, b&w to low-saturation, premium:**
- `1490481651871-ab68de25d43d` — woman in dark backdrop, contemplative
- `1488161628813-04466f872be2` — younger person in soft light, glasses, near-smile
- `1492707892479-7bc8d5a4ee93` — man in profile, b&w, side-lit
- `1517677208171-0bc6725a3e60` — woman editorial, low-key studio
- `1539109136881-3be0616acf4b` — fashion model, dark wardrobe, dramatic
- `1502716119720-b23a93e5fe1b` — woman in coat, subtle backdrop
- `1483985988355-763728e1935b` — fashion editorial studio shot
- `1485231183945-fffde7cc051e` — close portrait, intimate framing

*Use for:* photographer-portfolio editorial spreads · podcast hosts · creative-studio team grids · personal-brand-store testimonial avatars · author bios.
*DON'T use for:* wedding "couple-portraits" (these are not couples) · family/children · sports · candid lifestyle. They are studio-editorial, not human-warm.

**Architecture / brutalist / minimal interior:**
- `1487958449943-2429e8be8625` — heavy concrete facade in raking light, brutalist
- `1517021897933-0e0319cfbc28` — concrete tower, industrial-civic
- `1469041797191-50ace28483c3` — modernist gallery / institutional interior
- `1481349518771-20055b2a7b24` — long architectural corridor, perspective-deep
- `1502672260266-1c1ef2d93688` — minimal still architectural light study
- `1493663284031-b7e3aefcae8e` — interior cornice / detail
- `1542038784456-1ea8e935640e` — building aperture / facade window

*Use for:* architecture/studio showcases · luxury real-estate (when listing is brutalist/modernist — NOT for "cosy cottage" listings) · luxury watch editorials · museum/exhibition contexts · institutional climate/data sites.
*DON'T use for:* wedding "venues" (these are not warm or romantic) · wabi-sabi ceramics (subject mismatch — concrete walls aren't pottery) · food/restaurant (no food in frame) · holiday/travel (no nature, no horizon).

**Industrial / hardware / circuit / server:**
- `1518770660439-4636190af475` — circuit-board macro, microcomponents
- `1558494949-ef010cbdcc31` — server rack, blue LEDs
- `1531259683007-016a7b628fc3` — industrial machinery / pipes / mechanical
- `1551808525-51a94da548ce` — server-room wide shot, datacentre

*Use for:* hardware-store product pages · 3D-asset marketplaces · saas-dark/edge-compute landings · synthwave audio gear (loose stand-in for analog hardware) · podcast "studio" sections · climate-telemetry / institutional measurement sites.
*DON'T use for:* wedding · ceramics · gardens · culinary · sports · anything human-centred.

**Luxury still-life — dark moody objects:**
- `1611652022419-a9419f74343d` — brass apothecary objects, strong directional light

*Use for:* perfumery · skincare DTC · luxury hardware launches · whisky / spirits · ceramics (loose stand-in for "single artisan object on warm surface") · wabi-sabi pottery (closest §D.1 has).
*DON'T use for:* people · landscapes · tech.

**Sizing convention:** `w=1920` for hero/full-bleed bg, `w=1200`–`1600` for primary cards, `w=900`–`1000` for thumbnails / triptych panels, `w=800` for in-frame portraits, `w=400` for small grid tiles in static side-by-side strips. Re-cropping the same ID with different `w=` / `h=` / `fit=crop` for variety is endorsed.

### D.1.5 — Archetype → subject-pool routing

When you start an upgrade, look up the template's archetype here BEFORE picking image IDs. If the archetype's "primary §D.1 fits" list is empty, that's the signal to reuse the template's own aida-public images and / or surface a gap to the user.

| Archetype | Primary §D.1 fits | Secondary §D.1 fits | Subjects §D.1 LACKS — surface if needed |
|---|---|---|---|
| Wedding / invitation | (none — really) | Fashion editorial portraits as "in absentia" archive imagery only | Couples / hands / rings / flowers / chapels / candles / cake / table-setting |
| Personal blog (essays) | Architecture (abstract) · Editorial portraits (writer headshots) | Luxury still-life (object essays) | Any subject genuinely related to the essay topic |
| Photographer portfolio | Architecture · Editorial portraits | Industrial (loose) | Subject-specific reportage (not in §D.1; surface the project series) |
| Podcast | Editorial portraits (hosts) · Architecture (studio) | Industrial (gear) · Luxury still-life (microphone close-ups stand-in) | Headphones / mics / waveforms / specific guests |
| Real-estate listing | Architecture (brutalist/modernist listings only) | Luxury still-life (interior detail) | Cosy / heritage / cottage / garden / kitchen / bedroom / period-detail |
| Resume / CV | Architecture (project thumb stand-ins) · Editorial portrait (headshot) | — | Specific work artefacts; the subject IS abstract here, §D.1 fits |
| Personal brand store | Editorial portraits · Architecture | Luxury still-life | Product photos (depend on what's sold; surface) |
| Photographer's blog | Editorial portraits · Architecture | — | Same as photo portfolio |
| Studio / agency showcase | Architecture · Editorial portraits | Industrial (loose) | Specific client work artefacts |
| SaaS dark / edge-compute | Industrial · Architecture | — | UI screenshots / dashboards |
| SaaS light | Industrial (cooled) · Architecture | — | UI screenshots / dashboards / team photos |
| Hardware / gadget store | Industrial · Luxury still-life | Architecture | Actual product photography (surface) |
| AI product landing | Industrial · Luxury still-life | Architecture | Generated assets / abstract geometry |
| 3D asset marketplace | Industrial · Luxury still-life | Architecture | 3D renders (none in §D.1; surface) |
| Synthwave / audio studio | Industrial (analog gear stand-in) · Luxury still-life | Architecture | Synths / cassettes / vinyl / neon signage |
| Tech blog | Industrial · Architecture | Luxury still-life | Code screenshots / diagrams / specific gear |
| Terminal / CRT / cyber | Industrial (CRT-tinted) | — | Actual CRT / vintage monitors / Unix screens |
| Y2K / vaporwave | Architecture (chromatic-tinted) · Industrial (chromatic-tinted) · Editorial portraits | Luxury still-life | Web-1.0 / clipart / 3D-rendered chrome |
| Wabi-sabi / ceramics | Luxury still-life (closest fit) | Architecture (warm-tinted) | Pottery / wood-fire kiln / clay / hands-at-wheel — preserve template's own aida-public ceramics |
| Travel / expedition | Architecture (only if site is urban — NOT for nature treks) | — | Mountains / glaciers / fjords / horseback / stops on the road |
| Solarpunk / regenerative | Architecture (industrial-meets-landscape) | — | Plants / fields / canopies / earthworks / botanical macro |
| Wellness / DTC clinical | Editorial portraits (cropped to hands/skin) · Luxury still-life | — | Apothecary bottles / lab / hands-applying / botanical-macro |
| Boutique hotel / retreat | Architecture (cinematic-warm) · Luxury still-life | — | Property exteriors / suites / dining halls / pools |
| Editorial magazine | Architecture · Editorial portraits · Luxury still-life | Industrial | Specific feature subjects |
| Subscription box (produce) | Luxury still-life (stand-in) · Architecture (warehouse stand-in) · Editorial portraits (farmers) | — | Produce close-ups / farm scenes / kitchen / box-on-doorstep |
| Risograph / print studio | Architecture (heavily-tinted with multiply blends to read as riso prints) · Editorial portraits (riso-tinted) | — | Print presses / paper stacks / poster covers |
| Solo / one-page pitch | Architecture · Industrial · Editorial portrait | Luxury still-life | Subject-specific |
| Nonprofit / mission | Architecture (institutional) · Editorial portraits (constituent-facing — careful) | — | Communities / programmes / specific advocacy subjects |
| Photographer pitch | Editorial portraits · Architecture | — | Subject reportage (surface specific series) |

**The "surface" column is not optional.** When the user asks you to upgrade an archetype whose subject pool is genuinely outside §D.1's coverage (wedding, food, ceramics, travel-nature, sports, kids), you do **one** of the following:

(a) **Reuse the template's existing aida-public images at higher counts**, re-cropping them for new sections via different `?w=` / `?h=` / `?fit=crop`. The aida-public URLs are subject-curated for that template; mining them harder is the right move. Each aida-public URL can support 2-4 distinct crops (top-third, bottom-third, square-centre, wide) before it starts looking obviously repeated.

(b) **Tell the parent agent in your report** that the section needs new IDs added to §D.1 by the user — list the subject keywords ("a top-down photograph of a wood-fired ceramic vase on linen", "a wedding bouquet of cream peonies on a stone slab"). The user can then either approve specific Unsplash IDs to add to §D.1 here, or accept that the template stays imageless in those slots until verified images exist.

(c) **NEVER**: substitute a §D.1 architecture photo into a wedding gallery, a §D.1 server-room into a kids-magazine spread, a §D.1 brutalist tower into a wabi-sabi tea-bowl review. The 200-OK trap.

### D.1.7 — When the user says "go bigger, more variety"

If the user explicitly asks for more / more diverse imagery and the §D.1 pool is empty for the archetype, the workflow is:

1. Pause adding sections.
2. List the subject keywords your sections need (e.g. "5 sections need: hands kneading clay, kiln interior glow, ceramic vase profile, ceramic shard close-up, hand glazing").
3. Ask the user to either: (a) provide specific verified Unsplash IDs for those subjects, or (b) accept aida-public reuse + symbolic §D.1 stand-ins clearly labelled as such, or (c) skip those sections.
4. Default to (b) if the user is unresponsive — but tag every "stand-in" in your report-back so the parent can audit and surface.

This rule is what separates an upgrade that reads native to its archetype from an upgrade that reads like every other template in the gallery wearing a different palette.

### D.1.9 — Sizing convention (kept)

`w=1920` hero / full-bleed bg · `w=1200`–`1600` primary cards · `w=900`–`1000` thumbnails / triptych panels · `w=800` in-frame portraits · `w=400` small grid tiles in static side-by-side strips. Re-cropping the same ID with different `w=` / `h=` / `fit=crop` for variety is endorsed and should be used aggressively before reaching for a new ID.

### D.2 — Layered card with background image (Hardware Modules pattern)

Stacking order matters. Inside the card's inner shell:
```html
<div class="h-64 border-2 border-[accent] relative overflow-hidden p-4 flex flex-col justify-between" style="background-color: #1a0f00;">
  <!-- 1. bg image (deepest) -->
  <img class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale contrast-125 pointer-events-none" src="..." alt="..."/>
  <!-- 2. CRT scanline / texture overlay -->
  <div class="absolute inset-0 crt-scanline pointer-events-none" style="z-index: 5;"></div>
  <!-- 3. Bottom-up gradient so existing content stays readable on the lower half -->
  <div class="absolute inset-0 bg-gradient-to-t from-[#1a0f00] via-[#1a0f00]/40 to-transparent pointer-events-none" style="z-index: 6;"></div>
  <!-- 4. Original content, lifted with z-10 -->
  <div class="relative z-10 ...">...</div>
  <div class="relative z-10 ...">...</div>
</div>
```
For a single-CTA card (button in centre with no readable text-mass elsewhere), swap the bottom-up gradient for a centered vignette: `radial-gradient(circle, transparent 40%, #1a0f00 100%)`.

Add `drop-shadow-[0_0_4-8px_rgba(<accent-rgb>,0.5)]` to icons / numbers / progress bar fills so they read as emissive against the photographic backdrop.

### D.3 — Hero with photographic backdrop matching card imagery

```html
<section class="relative min-h-[921px] flex items-center justify-center overflow-hidden ..." style="background-color: #1a0f00;">
  <div class="absolute inset-0 z-0 pointer-events-none">
    <img class="w-full h-full object-cover opacity-35 mix-blend-luminosity grayscale contrast-125" src="..." alt="..."/>
    <!-- Vertical gradient: dark at top + bottom, transparent middle -->
    <div class="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background"></div>
    <!-- Centre radial vignette so corners fade to bg colour -->
    <div class="absolute inset-0" style="background: radial-gradient(ellipse at center, transparent 30%, #1a0f00 110%);"></div>
    <!-- CRT scanline veneer -->
    <div class="absolute inset-0 crt-scanline opacity-60"></div>
    <!-- Soft accent halo behind the headline -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[accent]/20 blur-[140px]"></div>
  </div>
  ...
</section>
```

### D.4 — Hero portrait inside a circular glass frame (used in `108`)

```html
<div class="relative w-72 h-72 md:w-96 md:h-96 lg:w-[460px] lg:h-[460px]">
  <div class="absolute -inset-4 rounded-full border border-white/10"></div>
  <div class="absolute -inset-10 rounded-full border border-white/5"></div>
  <div class="absolute inset-0 rounded-full overflow-hidden border border-white/30
              shadow-[inset_0_0_80px_rgba(255,255,255,0.08),0_0_120px_rgba(<accent-rgb>,0.18)]">
    <img class="w-full h-full object-cover grayscale opacity-95" src="..." alt="..."/>
    <div class="absolute inset-0 bg-gradient-to-br from-[accent1]/10 via-transparent to-[accent2]/15 mix-blend-overlay"></div>
  </div>
  <!-- Editorial chips -->
  <div class="absolute -bottom-2 -right-2 bg-background border border-white/30 px-4 py-2 font-label-caps">SPEC · 001</div>
  <div class="absolute -top-3 left-8 bg-background border border-white/20 px-3 py-1 font-label-caps">ATELIER</div>
</div>
```

---

## E. Glitch / micro-effect snippets that read well

### E.1 — Cyan/magenta CRT glitch on small text (`102` Data Corrupted)
```css
@keyframes corrupt-glitch {
    0%, 100% { transform: translate(0); text-shadow: 1px 0 #d946ef, -1px 0 #22d3ee; }
    20% { transform: translate(-1px, 1px); text-shadow: 2px 0 #d946ef, -2px 0 #22d3ee; }
    40% { transform: translate(1px, -1px); clip-path: inset(20% 0 30% 0); text-shadow: -1px 0 #d946ef, 1px 0 #22d3ee; }
    55% { clip-path: inset(0 0 0 0); }
    60% { transform: translate(-1px, 0); text-shadow: 1px 0 #d946ef, -2px 0 #22d3ee; }
    80% { transform: translate(0, 1px); clip-path: inset(40% 0 10% 0); text-shadow: 2px 0 #d946ef, -2px 0 #22d3ee; }
    90% { clip-path: inset(0 0 0 0); }
}
.glitch-corrupt { display: inline-block; animation: corrupt-glitch 1.4s infinite steps(1); }
```

### E.2 — Subtle wavy pulse for a panel bg (`102` MATERIAL TRUTH)
```css
@keyframes mt-grey-pulse {
    0%, 100% { background-color: #14181a; }
    50%      { background-color: #232828; }
}
.mt-bg-pulse {
    background-image:
        repeating-radial-gradient(circle at 18% 38%, rgba(255,255,255,0.028) 0 70px, transparent 70px 140px),
        repeating-radial-gradient(circle at 82% 64%, rgba(255,255,255,0.022) 0 90px, transparent 90px 180px);
    animation: mt-grey-pulse 7s ease-in-out infinite;
}
```

### E.3 — Hover desaturate→colour + scale on imagery
Standard pattern across the gallery / lookbook / case-study cards:
```
class="grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
```
Always paired with `group` on the wrapping element and a top-of-card gradient (`from-background/85 to-transparent`) so caption text remains readable.

---

## F. Workflow when the user says "look through other templates"

1. **Read each candidate top-to-bottom.** Don't skim. Note its design language (palette, typography, custom CSS).
2. **Run the Diagnostic Checklist** in your head (or as a `TaskCreate` list if there's a lot to track).
3. **Don't fix everything by default.** Surface the worst symptoms (3–5 max per template) in a brief summary to the user before editing. The user wants curation, not a blanket pass.
4. **Group related fixes into one edit** when possible (a palette swap is one big Edit, not 50). Keep edits readable — avoid hundreds of lines of unrelated changes interleaved.
5. **For each new section you propose, name it and describe it in one sentence** before generating the markup. The user has rejected work this session for being unsolicited; better to propose-then-execute than execute-then-explain.
6. **Don't fabricate Unsplash IDs.** Use the verified list in §D.1 unless you have a specific known-good ID.
7. **Check git status before and after.** All these template edits should remain uncommitted (no co-sign rule, no push without permission).

---

## G. Don'ts (recap)

- Don't add new CSS frameworks, JS deps, or `<script src="...">` tags pointing at unsupported packages. The iframe's curated UMD allowlist (in `lib/preview.ts` `SUPPORTED_PKGS`) is the surface — but templates only run there inside the live preview; static HTML files are free to use any CDN that loads, with the caveat that the preview iframe's runtime adds its own React/Tailwind. In practice: stick to Tailwind CDN + the existing per-template `<script>` tags.
- Don't replace the auto-generated `web/<NN>-<slug>.jsx` from `scripts/html-to-jsx.mjs` over user-finalised JSX (templates 1–100). The `.html` is freely editable; the `.jsx` requires explicit user request.
- Don't use `_extends`-style JSX spread `{...(cond ? { target: "_blank", ... } : {})}` in any JSX. Causes Babel-standalone infinite recursion in the preview iframe (see CLAUDE.md).
- Don't wrap inline init scripts in `document.addEventListener('DOMContentLoaded', ...)`. The preview iframe's `DOMContentLoaded` has fired before `lib/preview.ts` re-emits the script. Use a plain IIFE.
- Don't place author CSS that sets bg/colour properties inside a `<style>` block in the `<body>` of a JSX template — it cascades and beats Tailwind utilities (the "JSX `<style>` cascade trap" — note in user memory). Keep custom CSS in `<head>`.
- Don't push, don't `gh pr create`, don't tag, don't open issues without explicit "yes, push" approval per action.
- Don't create scratch / planning / decision markdown files. Work from conversation context.

---

_Last updated: 2026-04-29 — written after the 101–110 upgrade pass. Update this file (in place, single Edit) when a new pattern proves itself across two or more templates._

---

## H. Section catalogue — patterns proven during the Apr–May 2026 JSX upgrade pass

Templates touched: `74-acid-graphics`, `1-aether`, `4-ai-product-landing`, `8-apple-style-hero`, `67-art-deco`, `92-art-noveau`. Every pattern below was applied to **both HTML and JSX** siblings.

### H.1 — Hero: image + heading composed as ONE full-bleed cinematic frame

**Triggered by**: "make the hero full screen width", "image + heading as one", "screen size width hero".

**Used on**: `4-ai-product-landing`, `8-apple-style-hero`, `92-art-noveau`.

Pattern: `<section class="relative w-full min-h-[92vh] overflow-hidden">` — true edge-to-edge. To break out of `<main>`'s horizontal padding, **remove the padding from `<main>`** and apply per-section to the constrained sections that follow:

```html
<main class="flex-grow flex flex-col items-center w-full pb-32">
  <section class="relative w-full min-h-[92vh] ...">HERO — full-bleed</section>
  <div class="w-full h-20 md:h-32"></div>  <!-- spacer -->
  <div class="w-full px-4 sm:px-gutter lg:px-margin-page flex flex-col items-center">
    <section class="w-full max-w-7xl mb-32">...constrained...</section>
    ...
  </div>
</main>
```

Layered backgrounds (each `absolute inset-0 -z-N` in order from back to front):
1. **Solid / gradient page color** — `bg-gradient-to-br from-... via-... to-...` matching the template palette.
2. **Repeating CSS-gradient texture** — `.an-wave`-style class using `repeating-linear-gradient` + a `radial-gradient` dot. **Pure CSS — NO SVG data URLs in JSX**.
3. **2–3 large radial halos** — `w-[60vw] h-[60vw] rounded-full bg-X/15 blur-3xl` with palette-tinted `radial-gradient`. Position at `-top-X -left-X`, `-bottom-X -right-X`, and a center one. Subtle peacock-feather feel.

Top label rail (3-col grid):
```
[Est. Ship · Date]      [— Brand · Series 01 —]      [Hand-finished · 3 colorways]
```

Center: short serif/display headline + italic sub line + image positioned tight under headline so they read as ONE composition. The image's wrapper gets the `object-contain` + `max-h-[78vh] sm:max-h-[84vh]` cap (NOT `max-h-[58vh]` — that's too aggressive, image stays small).

**No bottom CTA bar**. CTAs live in (a) the fixed top header pill, (b) a dedicated `#preorder` / `#pricing` section. **No scroll indicator** unless the hero needs to gesture toward an immediately-following section without its own connector.

### H.2 — Hero: tighten margins to grow the image without breaking layout

**Triggered by**: "make image bigger, padding pushing it down".

When the image looks small in the hero, the bottleneck is usually:
1. `max-h-[58vh]` cap — bump to `max-h-[78vh] sm:max-h-[84vh]`.
2. Center column padding `pt-8 pb-12 md:pb-16` — tighten to `pt-4 pb-2 md:pb-4`.
3. Headline/sub margins `mb-4 sm:mb-5 mb-6 sm:mb-8 md:mb-10` — tighten to `mb-3 sm:mb-4 mb-4 sm:mb-5 md:mb-6`.

These three together give ~1.4–1.5× the perceived image size with no other restructure.

### H.3 — Live demo / synthesis section with typing animation

**Used on**: `4-ai-product-landing` (`Watch Parse think.`).

Two-pane window inside one rounded `glass`-feel card with a brand-gradient status-bar strip at the bottom. Window chrome: traffic lights + active file tab (with file icon + unsaved-dot) + meta strip (`Synthesizing · Pages 47 · 98.4%`).

- **Left pane**: VS Code-style editor — file-tree mini rail (4 sidebar icons), gutter line numbers, JetBrains Mono font, GitHub Dark token colors (`#0d1117` bg, `#ff7b72` keywords, `#d2a8ff` classes, `#79c0ff` variables, `#a5d6ff` strings, `#8b949e` italic comments). Type code character-by-character with a blinking caret on the active row, swap the line to the full syntax-highlighted version on completion.
- **Right pane**: prose typing pane in the body font. Starts ~1100ms after the code pane so it reads as cause→effect. Key terms get `<em>` (accent chip with subtle background); page references render as `<cite>` mono pills (`[Pg 4]` style with border + background).
- **Status bar**: brand-gradient strip (e.g. `from-indigo-600 via-indigo-500 to-fuchsia-600`) with `main · UTF-8 · TypeScript · Ln · Col` (Ln/Col live-update as the caret moves).

JSX implementation: `LiveSynthDemo` helper component **above** the default export. Module-level `const FOO_LINES = [{ t, h }, ...]` arrays for code + prose. `useTyper(lines, opts)` hook returning `{ i, j }` state. Render via `dangerouslySetInnerHTML` keyed off state. Cleanup-safe via a `cancelled` flag inside the effect. Use `React.useState` / `React.useEffect` (no named imports — see active-traps table).

HTML implementation: vanilla IIFE at end of `<body>`. Pad missing lines with `&nbsp;` to keep height stable. Escape typed plaintext, splice the highlighted span-string in once a line completes.

### H.4 — Drop-X onboarding section (file-upload zone)

**Used on**: `4-ai-product-landing` (`Step 01 — Drop a PDF`).

`Step 01 · Drop a PDF` chip + headline + dropzone card. Card: dashed border that lights to accent on hover, with an outer accent→accent2 blur halo. Inside: stacked file-icon tile (gradient slate + accent file-icon + format mono micro-tag) with **two ghost-stack copies** behind that fan out on hover (translate-x/y), a floating gradient pill at the corner (`Up to 500 pp`), headline + dotted-underline link + supporting copy + format meta row + "Try the demo: <example.ext>" chip with pulsing emerald dot. Whole card wrapped in `<label for="..."><input type="file" class="sr-only" /></label>` so it's a real picker.

Below: connector strip — `Then ↓ Watch it think` with bouncing arrow, mono caps, accent-tinted CTA word.

### H.5 — Editorial doctrine list (numbered tenets)

**Used on**: `1-aether` (Five Axioms of Aether).

12-col split with a one-column visual gutter. Left = `md:col-span-4`, gutter = col 5, right = `md:col-span-7 md:col-start-6`.

Left column flex-col with: label rule + headline + intro `<p>` + `<figure>` editorial card (image + spec rail) + pull-quote `<blockquote>`. **Centering the figure**: `mt-auto` on the figure + `mt-auto` on the blockquote = two equal auto-gaps that center the figure in the column's free space.

Right column: `<ol class="divide-y divide-white/10 border-t border-b border-white/10">`. Each `<li>`: 12-sub-cols, Roman numeral I/II/III/IV/V (`col-span-1`, accent color, tabular-nums) + title (`text-xl/2xl`) + chip on the right (`[ AXIOM_N ]` mono caps tabular-nums) + body in muted secondary.

### H.6 — Capability matrix (4-col disciplines)

**Used on**: `1-aether` (Vertical Disciplines).

`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`. Each card: `glass-card rounded-xl p-6 sm:p-8 flex flex-col gap-stack-md min-h-[320px]`.
- Top row: Material icon (accent color) left + dimmed Roman numeral right.
- Middle (`mt-auto`): mono spec chip `[ FAB / 5-AXIS ]` + `font-h3-title` headline + `font-body-md` body.
- Bottom: hairline-bordered row with `Phase 0N` tag + `arrow_forward` icon that slides right + colorshifts to accent on group-hover.

### H.7 — Atmosphere image strip (5 framed tiles)

**Used on**: `67-art-deco` (Atmosphere — From The Floor).

Section header reuses the brand serif + gold rule pattern. 5 tall `aspect-[3/4]` tiles in `grid grid-cols-2 md:grid-cols-5`. Each tile: existing brand frame language (e.g. `framed-image` + `border-double-deco`), `grayscale → grayscale-0` + `opacity-80 → 100` on `group-hover`, accent title chip that fades in on hover only.

Below each tile: caption row in the brand serif — Roman numeral (lighter accent) + `flex-grow mx-2 mb-1 dot-leader opacity-50` + title (muted accent). Rhymes with the page's existing menu/spec typography.

Footer chip below the strip: `Photographs by House · Floor No. 02 · MMXXIV` mono caps.

### H.8 — Process / 3-step craftsmanship arches

**Used on**: `92-art-noveau` (`II — Métier · The Process`).

3-col grid of arched panels. Arch shape: `border-top-left-radius: 50% 30%; border-top-right-radius: 50% 30%;`. Each panel: arch-topped image + Roman numeral medallion floating at the top of the arch (`absolute top-4 left-1/2 -translate-x-1/2`, circular bordered). Image scale-on-hover. Below image: serif italic title + hairline rule + body + season tag (`Mai · Juin · Juillet`, `Atelier No. 02 · Cuivre`, `Repos · 90 Jours`).

### H.9 — Atelier editorial 7/5 split (with stat tiles)

**Used on**: `92-art-noveau` (`IV — Atelier`).

12-col grid `md:grid-cols-12`. Left card `md:col-span-7`: gradient panel with `botanical-border`, an absolute pattern wash + halo blur, overline + headline + bordered-left pull-quote (`"...quote..." — Founder, year`) + body + CTA with brand whiplash decoration + secondary date line.

Right column `md:col-span-5`: arched gold-framed photograph with caption plate (`Salle des Cuivres · No. 02`) + 2 Roman-numeral mini-stat tiles (`XII · Hectares`, `XLVII · Distillations`) in a 2-col sub-grid.

### H.10 — Origins / by-the-numbers stat strip

**Used on**: `92-art-noveau` (`V — Origines`).

4-stat strip inside a brand-bordered panel with a subtle pattern wash. Each stat: huge italic display number + hairline rule + uppercase mono caps label + italic sub-line. `divide-x divide-gold/30 md:divide-x` between cells. `grid grid-cols-2 md:grid-cols-4`.

### H.11 — Footer extended from constrained to full-width

**Triggered by**: "extend footer to full width".

Was: `<footer class="... max-w-7xl mx-auto ...">` — entire footer including bg + border-top constrained.
Becomes: outer `<footer class="relative w-full bg-... border-t border-... ...">` + inner `<div class="max-w-7xl mx-auto px-6 md:px-12">` for content. The bg + border now span the viewport; content stays constrained.

Expanded structure (instead of single-row sign-off):
- 12-col grid: 4-col **brand block** (logo + tagline + bilingual italic strapline) | 4-col **two link columns** side-by-side | 4-col **newsletter form** with email input + frequency disclaimer + 3-icon social rail.
- Decorative ornament centered between content and legal row (e.g., `Mucha-petal` SVG flanked by horizontal rules).
- Legal row: `© DATE · Brand` ↔ legal links nav ↔ location/process strip.

### H.12 — Image strategy (preference order)

When an image is needed:

1. **Existing `aida-public` URLs the original template was loading** — guaranteed to work. If a known-good aida-public image exists in the same template, prefer it over a new Unsplash. (This is what saved `92-art-noveau` after the peony Unsplash 404'd.)
2. **Verified Unsplash IDs from §D.1** (architecture / industrial / luxury still-life). These are tested. Don't fabricate new ones.
3. **Cloudinary URLs the user provides directly** (`res.cloudinary.com/dsa31toc5/...`). If transparent PNG, drop `mix-blend-multiply` (no white plate to dissolve), keep drop-shadow.
4. **AVOID speculative Unsplash IDs.** They 404 frequently. The peony `1490750967868-a8bce28d8717` failed on `92-art-noveau`. Better to reuse a working URL than gamble on a new one.

### H.13 — Decorative-pattern strategy (NEVER SVG data URL in JSX `<style>`)

For repeating textures (waves, dots, crosshatch, dotted grid):

```css
/* Bad — SVG data URL inside body-injected JSX <style>: invisible in iframe */
.an-wave { background-image: url("data:image/svg+xml,..."); }

/* Good — pure CSS gradients: bulletproof everywhere */
.an-wave {
  background-image:
    repeating-linear-gradient(45deg, transparent 0 28px, rgba(195,155,74,0.35) 28px 29px, transparent 29px 56px),
    repeating-linear-gradient(-45deg, transparent 0 28px, rgba(195,155,74,0.30) 28px 29px, transparent 29px 56px),
    radial-gradient(circle at 50% 50%, rgba(195,155,74,0.55) 1.2px, transparent 2px);
  background-size: auto, auto, 56px 56px;
}
.an-pattern {
  background-image: radial-gradient(circle at 50% 50%, rgba(195,155,74,0.45) 1.4px, transparent 2.2px);
  background-size: 28px 28px;
}
```

Use **strong rgba alphas** (`0.30–0.55`), NOT `0.10–0.18`, especially on cream/ivory backgrounds. Don't stack a low-alpha gradient with a `opacity-15` Tailwind modifier — effective opacity becomes ~0.02 and the user reports "not rendering". Either bump the rgba alphas OR drop the `opacity-N` modifier, not both subtle.

### H.14 — When the user says "remove that scribble / wave / line at the bottom"

The user often wants pure decorative SVGs (corner flourishes, bottom wave dividers, whiplash flourishes) removed even when they were intended as ornaments. Don't argue — remove them. The pattern wash + halo glow + frame chrome is enough decoration; over-stacked SVG ornaments read as "scribbles".

### H.15 — Section labelling rhythm (numbered editorial sequence)

When upgrading a long page, label each section with a small mono-caps tag: `Detail · 02 — Material`, `Detail · 03 — Internals`, `Detail · 04 — Studio`, `Detail · 05 — On the Desk`, `Spec Sheet · 06`, `Order · 07 — Pre-order`. This creates an editorial sequence that reads as a numbered booklet rather than a stack of disconnected sections. Same for art-noveau: `II — Métier`, `IV — Atelier`, `V — Origines`. Hero section is implicitly `01` and doesn't need the label.

---

_Last touched: 2026-04-30 — added §H section catalogue after the multi-template JSX upgrade pass (74, 1, 4, 8, 67, 92) and the active-JSX-traps table at the top._

---

## I. Section catalogue — patterns from the May 2026 multi-template pass

Templates touched: `15-artisan-handmade-store`, `60-aurora-gradients`, `57-bauhaus`, `68-bento-grid-dev`, `07-bento-grid-landing`, `97-blueprintiachitectural`, `100-botanical-scientific`, `42-boutique-hotel`, `61-brutalism-raw`. Every pattern below is mirrored to the JSX sibling.

### I.1 — Three-band column layout (`justify-between` with 3 explicit groups)

When a text column sits beside a tall image grid (2×2 or 4-up) and the column looks empty in the middle, switch from `flex flex-col justify-center` to `flex flex-col justify-between gap-10` with **three explicit content groups**:

- **TOP** — eyebrow + headline + intro paragraph → aligns with image-grid top
- **MIDDLE** — amenity checklist / timeline strip / spec tiles → anchors the centre
- **BOTTOM** — stats + CTA OR founders' quote → aligns with image-grid bottom

`justify-center` floats everything in the centre and leaves visible blank bands at top + bottom. `justify-between` distributes the three groups across the full column height so the heading and the CTA flush to the image edges.

Used on `42-boutique-hotel` Rooms (II) and House (V) sections.

### I.2 — Chapter mark super-eyebrow

For heritage / archive / story sections, prepend a big italic Roman-numeral super-eyebrow ABOVE the standard `— II · The Rooms` style label. Two-line construction with a horizontal hairline:

```html
<div class="flex items-center gap-4 mb-6">
  <span class="text-[60px] md:text-[80px] italic font-thin leading-none text-[accent]">V</span>
  <div class="flex-1 h-px bg-[accent]/40"></div>
  <span class="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant whitespace-nowrap">Chapter Five · Heritage</span>
</div>
<span class="text-label-caps uppercase text-[accent] tracking-[0.2em] block mb-3">— The House</span>
<h2 class="font-h2 text-h2 text-primary">A Georgian house, kept <em>quietly.</em></h2>
```

Acts as the top-alignment anchor when paired with §I.1. Used on `42`'s House section.

### I.3 — `.full-bleed` viewport-width escape hatch

When `<main>` is constrained (`max-w-screen-2xl`) but a section needs viewport-edge background colour, the older `-mx-4 sm:-mx-6 md:-mx-12` only stretches to main's edge — on screens wider than 1536 px the bg stops short and shows the body colour as a band. The fix is a custom utility:

```css
html, body { overflow-x: clip; }
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  max-width: none;
}
```

`overflow-x: clip` on `html, body` is mandatory — otherwise `100vw` (which includes scrollbar gutter on Windows) creates a phantom horizontal scrollbar. Inner content stays re-constrained at `max-w-6xl mx-auto`.

Used on `07-bento-grid-landing` integrations / use-cases / impact sections.

### I.4 — Section-level colour tints, sequenced

Subtle full-bleed tinted bands give long pages visual rhythm. Use a fade-in / fade-out gradient so transitions feel editorial, not boxed:

```html
<section class="full-bleed py-16 md:py-24 overflow-hidden"
         style="background: linear-gradient(180deg, transparent 0%, #f5eefb 25%, #efe5f7 75%, transparent 100%);">
  <div class="mx-auto w-full max-w-6xl">…</div>
</section>
```

3-section rhythm proven on `07`: lavender (integrations) → cream (use cases) → ice-blue (impact). Pick colour stops from existing palette tokens (lavender ~ `primary-container`/40, cream ~ `tertiary-fixed-dim`, ice-blue ~ a soft `primary-fixed-dim` blend). Always `overflow-hidden` on the section to clip any internal marquee/halo overflow.

### I.5 — Marquee strip + the `width: max-content` overflow trap

Continuous horizontal scroll for image strips, integration logos, plate references:

```css
.marquee-strip {
  animation: marquee-x 50s linear infinite;
  width: max-content;
  display: flex;
  gap: 14px;
}
.marquee-strip:hover { animation-play-state: paused; }
@keyframes marquee-x {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 7px)); }
}
```

Render the tile array **twice** in source order so the loop tiles seamlessly (`{[...tiles, ...tiles].map(...)}` in JSX, paste the markup twice in HTML).

**TRAP:** `width: max-content` makes the strip wider than the viewport. Without `overflow-hidden` on a wrapping container AND `overflow-x: clip` on `html, body`, the document grows horizontally and the user gets a phantom right-side empty band that "shrinks the longer you stay" (it's actually the marquee scrolling left, revealing more right-side overflow). The fix is both clamps. This was the visible bug on `07`'s first integrations rev.

Edge-fade gradient masks (`bg-gradient-to-r from-background to-transparent` rectangles at the strip ends) render as visible white blocks once the section's actual bg is no longer `background`-coloured — either re-tint the gradient's start to the section bg, or remove them entirely and rely on the section's `overflow-hidden`. Removing was simpler on `07`.

### I.6 — Cinematic full-bleed hero (5-layer overlay stack)

For premium photographic heroes (replacing a centred-text hero), full-bleed the section and stack overlays in this order on top of the bg image:

1. Vertical dark gradient — top-down: opaque-ish, transparent middle, opaque bottom — for text legibility against any photo
2. Radial vignette: `radial-gradient(ellipse 120% 80% at 50% 45%, transparent 0%, rgba(deep,0.4) 70%, rgba(deep,0.85) 100%)` — pulls corners to near-black
3. Horizontal warm-edge fade tinted to brand accent + secondary accent (one on each edge)
4. Soft 600–640 px halo behind headline (radial blur in brand accent)
5. Subtle scanline texture (`repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)`) at `mix-blend-mode: overlay` and 30% opacity — pure CSS, **no SVG data URLs in JSX `<style>`** (the trap)

Headline: large clamp + gradient on the second line via `bg-clip-text`. Heavy `drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]`. Trust-signal row at bottom (cert badge + stat + star rating, separated by a top border).

Set `<main>` top padding to `pt-0` so the hero hits the viewport top. Hero internally pads `pt-24 md:pt-32` to clear the fixed header. Used on `07`.

### I.7 — Solid white nav over a dark hero

When nav uses `bg-white/75 backdrop-blur-xl` and the page now opens with a dark cinematic hero, the semi-transparent nav picks up the dark backdrop and reads as frosted-grey, not white. Drop the transparency entirely:

```html
<header class="fixed top-0 w-full z-50 bg-white border-b border-surface-container shadow-sm">
```

Remove `bg-white/75`, `dark:bg-...`, `backdrop-blur-xl`, `transition-colors duration-300`, and any `dark:` variants on inner links. The backdrop-blur is wasted under solid white.

### I.8 — Multi-grid drafting paper bg

Stack 2 (calmer) or 3 (heavier) grid sizes in a single `background-image` declaration to mimic real architectural trace paper. The 3-layer version (128 + 32 + 8 px with progressively lighter alpha) reads as "real drafting paper" but the user found the 128 px major lines too heavy — drop the boldest layer for a calmer register:

```css
body {
  background-color: #F4F6F5;
  background-image:
    linear-gradient(to right, rgba(186,214,226,0.55) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(186,214,226,0.55) 1px, transparent 1px),
    linear-gradient(to right, rgba(186,214,226,0.22) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(186,214,226,0.22) 1px, transparent 1px);
  background-size: 32px 32px, 32px 32px, 8px 8px, 8px 8px;
  background-attachment: fixed;
}
```

Section-level grid overrides (`.bg-grid-warm`, `.bg-grid-press`) use different palettes (ochre on cream / ochre + cyan on dark) for **register changes** — a different "page" of the drafting book per major content block. Used on `97-blueprintiachitectural`.

### I.9 — Triadic accent (ochre alongside cyan + red)

When a primarily two-colour palette (cyan + red, or revision-red + primary) needs a warm complement:

```js
colors: {
  ochre: '#D4A24A',
  'ochre-dark': '#A87E2E',
  'ochre-light': '#E8C281',
  'ochre-bg': '#FBF3DD'
}
```

Use ochre for spec stamps (`.ochre-stamp` — uppercase mono pill with ochre border + cream bg + ochre text), award seals (`.award-seal` — circular border with dashed inner ring, slight rotation per seal for hand-stamped feel), and register-change borders. Keeps cyan + red intact for primary semantics; ochre adds the warmth without competing.

### I.10 — Bento sub-grid extension pattern

When extending an existing bento grid: don't repeat the same 4-col grid — switch col system. **6-col fits 3-2-3 row layouts cleanly:**

- Row 1: 3 equal tiles (`col-span-2` × 3 in `grid-cols-6`)
- Row 2: 2 split tiles (`col-span-4 + col-span-2` OR `col-span-3 + col-span-3`)
- Row 3: irregular 3 (`col-span-3 + col-span-1 + col-span-2` — wide editorial card + narrow stat + medium image)

Add a section header above the new grid (`// Section 02` mono caption + serif h2) to mark it as a distinct register from the original grid above. Place a continuous image-strip marquee BETWEEN the two grids for editorial breathing room.

Used on `68-bento-grid-dev`.

### I.11 — CSS view-timeline scroll-driven container effects

For "container changes as you scroll past it" (the `61-brutalism-raw` FILE_HEADER negative-flip), use modern CSS scroll-driven animations:

```css
.parent-section { view-timeline-name: --my-section; view-timeline-axis: block; }
.scroll-invert-container {
  animation: container-negative linear both;
  animation-timeline: --my-section;
  animation-range: cover 15% cover 95%;
  will-change: filter;
}
@keyframes container-negative {
  0%   { filter: none; }
  45%  { filter: none; }
  55%  { filter: invert(1) hue-rotate(180deg); }
  100% { filter: invert(1) hue-rotate(180deg); }
}
@media (prefers-reduced-motion: reduce) {
  .scroll-invert-container { animation: none; }
}
```

The hard 45–55 % snap makes the flip feel deliberate (brutalist), not a smooth fade. Smooth from-0-to-100 also works for softer aesthetics.

**Apply `filter` to the CONTAINER, not individual children.** Parent-level `filter` cascades to all descendants in rendered output (image, text, borders, bg) for one coherent flip. Targeting an inner image alone breaks visual coherence — the "user said 'not the image itself'" lesson from this session.

**Image goes on the OUTER container, not the inner element that's empty.** The user pointed out that the right target was the `<aside>` (the tall left rail with empty space below the sticky FILE_HEADER box), not the FILE_HEADER box itself. The aside's height matches its grid sibling (the article column) — putting an `absolute inset-0` image layer there fills exactly the empty stretch the user marked.

Browser support: Chrome / Edge / Safari TP. Firefox without scroll-driven animation support just sees the static positive state — graceful.

### I.12 — Premium-brutalist polish for old-web / Win95 / docs templates

For brutalist / Win95 / archive aesthetics, "make it premium" doesn't mean abandoning the brutalist register. It means adding **more substantive content** in the same register:

1. **Public-facing stats strip** right after the hero — DOWNLOADS · CONTRIBUTORS · LAST_BUILD · STARS in a 4-cell black/yellow ribbon with mono labels and tabular-nums
2. **Visual reference plate gallery** — 4 photographs in `win95-border` framed boxes with mono captions like `PLATE_001`, `circuit.jpg`, `[ TRACES // 320×320 ]`. Photo treatment: `filter: grayscale(1) contrast(1.4) brightness(1.05)` — high-contrast monochromatic, like printed reference plates
3. **Manifesto / doctrine** in long-form editorial — sticky FILE_HEADER sidebar with file metadata (NAME, SIZE, VERSION, DRAFTED, SIGNED, GPG-VERIFIED) on a narrow left rail, drop-cap opening on the right column, numbered ordered-list tenets in a 2 px black-bordered box
4. **Maintainers / contributors** section — fake terminal panel (black bg, green-400 text, traffic-light dots, animated `_` cursor) showing `git shortlog -sn` output on the wide side, colored monogram contributor cards on the narrow side. Hovers turn each card alert-yellow

Used on `61-brutalism-raw`.

### I.13 — Hotel / hospitality "Lookbook" pattern

Pure-images section with mixed-aspect editorial grid. 12-col grid arrangement that reads well:

- Row 1: `col-span-7 (aspect-[4/3]) + col-span-5 (aspect-[4/3])`
- Row 2: 3 × `col-span-4 (aspect-square)`
- Row 3: 1 × `col-span-12 (aspect-[21/9])` — full-width cinema strip

Each tile carries a small `bg-surface/90 backdrop-blur` caption pill with `Plate · No. NN · Title` style text in `font-label-caps uppercase tracking-widest`. Reuses the template's existing `aida-public` images so all photos load reliably. Used on `42-boutique-hotel` III.

### I.14 — Concierge / curated-picks pattern

Short editorial grid of 3-6 numbered recommendations. Each card:

- Top row: `font-label-caps` "No. 0X · Category" left + walking-distance time right
- Headline: `font-h3` venue name
- Body: 1-2 sentence editorial pick with a memorable detail
- Hover-revealed CTA strip ("Walking directions →") that fades in
- Top border `border-t` → `border-primary` on hover

Used on `42-boutique-hotel` VI (Dublin Guide).

### I.15 — Single-row navbar restructure

When a navbar stacks the wordmark above the link nav (e.g., a giant centred wordmark + a row of links beneath it), it towers vertically. Switch to single-row with `justify-between items-center`:

```html
<header class="...">
  <div class="flex justify-between items-center w-full max-w-... mx-auto px-12 py-5">
    <div class="flex items-baseline gap-3">
      <span class="text-2xl italic font-serif">Brand Name</span>
      <span class="hidden lg:inline text-[10px] uppercase tracking-[0.25em] opacity-50 border-l pl-3">Tagline · Est. YYYY</span>
    </div>
    <nav class="flex items-center space-x-8">…</nav>
  </div>
</header>
```

Reduces wordmark size (text-4xl → text-2xl), pushes it left, and fits a tasteful `Est. YYYY` subtitle as a divider-separated micro-line on lg+. Used on `100-botanical-scientific`.

---

## J. Resume after `/clear` — quick start

Read this section first when context has been cleared. The 8 things to know:

1. **Read `CLAUDE.md` and this file before editing.** Especially §A (active JSX traps) at the top — every trap there has cost a round-trip.
2. **Templates 1–100 are production.** Both `web/<NN>-<slug>.html` AND `web/<NN>-<slug>.jsx` siblings must stay in parity. Every change to one mirrors to the other. Templates 101+ are HTML-only.
3. **User points at templates by URL** (`http://localhost:3001/t/<NN>-<slug>` or `?kind=html` to force the HTML variant). The default route serves the JSX variant.
4. **User describes changes informally** — sometimes with screenshots, often imprecise. When wording is ambiguous, propose-then-execute (name the change in one sentence, then apply). The brutalism scroll-invert in this session took three rounds because the target wasn't clear initially — confirm the target element before animating.
5. **Don't co-sign commits, don't push.** Local Edit only. Never commit unless explicitly asked. No `Co-Authored-By: Claude` trailers (per `CLAUDE.md`).
6. **Don't run `next build` or the dev server.** Trust the edit. Use `npx tsc --noEmit` only if you suspect a TS regression. Debug by reading code (`CLAUDE.md` rule #4).
7. **Patterns to reach for** when the user says "more sections / make it premium / add stuff": §C (new-section playbook), §H (Apr–May editorial register), §I (May 2026 patterns above). When the user says "feels empty next to images" — §I.1 (three-band layout). When "spans full screen" or "horizontal scroll bug" — §I.3 + §I.5. When "make container change on scroll" — §I.11.
8. **Image strategy** (§D.1, §H.12): prefer existing `aida-public` URLs the template was loading → verified Unsplash IDs from §D.1 → never speculative IDs. The May session added: `1451187580459-43490279c0fa` (earth from space — works for "Orbit"-named hero), `1518770660439-4636190af475` (circuit board — works for tech / brutalist registers), `1502672260266-1c1ef2d93688` (architecture — works for heritage / facade), `1493663284031-b7e3aefcae8e` (architecture detail — works for cornicing / interior detail).

After this, the user gives an instruction. Apply it.

---

_Last touched: 2026-05-01 — added §I (May 2026 patterns: 3-band columns, full-bleed utility, cinematic hero, view-timeline scroll-driven, brutalist polish) and §J resume-after-clear quickstart. Templates touched this session: 7, 15, 42, 57, 60, 61, 68, 97, 100._

---

## K. Section catalogue — patterns from the late-May 2026 multi-template pass

Templates touched this pass: `48-brutalist-art-style`, `20-brutalist-creative-portfolio`, `93-casette-futurism`, `53-claymorphism`, `coming-soon`, `86-community-forum`, `105-constructivist-bento-terminal`, `95-constructivist-russian`, `30-consulting-firm`, `29-corporate-b2c`, `63-corporate-memphis`, `85-course-education`, `28-creative-agency`, `27-creator-hub`, `112-crt-glitch-cyber`. Every pattern was applied to both HTML and JSX siblings.

### K.1 — Multi-section batch flow ("add N sections, image strip, etc.")

The user's standard request is now: "add 2-4 sections to template X, one of them an image strip, keep premium." The repeatable shape:

1. **Read both `web/<NN>-*.html` AND `web/<NN>-*.jsx`** end-to-end. Cataloguing tokens (palette, fonts, spacing scales, custom CSS classes) is what makes new sections feel native vs. bolted-on.
2. **Propose each section in one sentence** before generating markup (per §F.5). User has corrected scope when sections looked off-script.
3. **Insert sections in editorial order** between existing sections, not all at once at the end. Natural rhythm: feature/grid → image strip → manifesto/list → testimonials → CTA → footer.
4. **Mirror to JSX in the same edit pass.** Don't batch — when an HTML section gets approved, immediately mirror to JSX with data arrays. Skipping this once leaves the parity broken across the rest of the session.
5. **For 3+ sections, hoist data into arrays at the top of the JSX file** and `.map()` in the render. Verbose JSX with 5 near-identical card blocks is unmaintainable and harder to mirror later.

### K.2 — `.full-bleed` utility is the workhorse

Used in 7+ templates this pass (30, 27, 112, 85, 86, coming-soon, etc.). Every template with a constrained `<main class="max-w-... mx-auto">` benefits from this exact CSS:

```css
html, body { overflow-x: clip; }
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  max-width: none;
}
```

`overflow-x: clip` on html/body is non-negotiable — `100vw` includes the scrollbar gutter on Windows and creates a phantom horizontal scrollbar without the clip. Add this to BOTH the `<style>` block AND the JSX `customCss` template literal in the same edit.

For JSX, prefer this over runtime `style={{}}` on every section — utility class is reusable, scales to N sections.

### K.3 — Tinted full-bleed bands as editorial section frames

When the user says "different shade of main background colour" or "give it a different background", the move is:

1. Wrap section in `<section class="full-bleed py-20 lg:py-28" style="background-color: #X">`
2. Re-constrain inner content with `<div class="max-w-[1280px] mx-auto px-margin-edge">`
3. Pick a shade ~5-10% darker/warmer/cooler than the page background (e.g., `#F3EDE0` page → `#ECE2CE` band; `#fbf9f8` page → `#F3EDE4` band → `#E8DEC4` band as a deeper variant)
4. **Use the same shade across paired sections** (Methodology + Case Studies + Friction Report all in the same `#ECE2CE`) to read as a contiguous editorial sequence rather than three random bands.
5. **Adjust nested chip/card backgrounds** that were paper-tinted to match the new band: chips that were `bg-paper` need to switch to `bg-[#ECE2CE]` so they remain in palette against the band. Cards that were `bg-white/40` should become `bg-paper` so they pop as lighter inset surfaces against the slightly-darker band.

When multiple bands stack, the page reads as an editorial spread — premium without hand-tuning.

### K.4 — Bands that flow into the footer

When the user says "extend section to the footer", the band needs to actually meet the footer with no paper-coloured gap. Three things to clean up:

- **Remove `pb-stack-lg` (or any pb-) from `<main>`** — main's bottom padding creates an inner gap inside main that the band can't escape.
- **Remove `mt-32` (or any mt-) from `<footer>`** — footer's top margin pushes it down from main's bottom edge.
- **Verify with the playwright eye**: the band's bottom edge should touch the footer's top border with no visible cream sliver between.

This combo is the cleanest. Negative-margin hacks (`-mb-stack-lg`) on the band itself can work but interact unpredictably with margin-collapse and overflow contexts.

### K.5 — Image height matching across asymmetric grid columns

Two adjacent grid tiles, one wider than the other. Goal: bottoms align flush.

The trick depends on which tile you want to dictate height:

- **Wider tile dictates** (default if both have same aspect): wider tile's `aspect-[4/3]` produces a TALLER calculated height than narrower's same aspect. The narrower tile then gets `aspect-[4/3] md:aspect-auto md:h-full` — at md+ it stretches to the wider tile's height instead of using its own intrinsic aspect.
- **Narrower tile dictates** (when you want a portrait frame on the side): give narrower tile `aspect-[4/3] md:aspect-[3/4]` (it goes portrait at md+, taller). Then the wider tile gets `aspect-[4/3] md:aspect-auto md:h-full` — it stretches to match the portrait's height. The wider tile becomes near-square.
- **Img must not impose its own size**: when `md:h-full` is on the figure but the inner img has its own `aspect-[4/5]` or large natural dimensions, the img can still inflate the figure beyond the row height. Fix: img is `absolute inset-0 w-full h-full object-cover` so it fills the figure exactly without contributing to its sizing. Caption pills in this case need `z-10` to sit above the absolute img.

Used in templates 30 (Field Photographs Frankfurt+Singapore), 29 (Field Reports), 85 (Built for the Ambitious), coming-soon (Pages Already Made).

### K.6 — Doubled marquee strip with opposite directions + alternating treatments

Beyond the single-marquee §I.5 pattern. For a section that needs MORE motion energy:

```css
.marquee-track { display: flex; gap: 24px; width: max-content; }
@keyframes marquee-left  { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
@keyframes marquee-right { 0% { transform: translateX(calc(-50% - 12px)); } 100% { transform: translateX(0); } }
.marquee-left  { animation: marquee-left 60s linear infinite; }
.marquee-right { animation: marquee-right 70s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
```

Two visual differentiators between rows are non-negotiable, otherwise it just reads as "same strip × 2":
- **Different shape language**: top row `rounded-3xl rounded-bl-none` (asymmetric corners), bottom row `rounded-full` (pills). Or rotated vs flat.
- **Different content type**: top row = avatars + names + activity; bottom row = stat tiles with icons. The semantic contrast is what makes it interesting.
- **Different speeds**: 60s vs 70s — slight difference creates interleaving rhythm so the same content doesn't sync up after one loop.

`overflow-hidden` on each row wrapper is required, AND **always add `py-2` or `py-3` to that wrapper** when cards have chunky brutalist `shadow-hard` (`4px 4px 0 #black`). Without that vertical padding, `overflow-hidden` clips the bottom-right offset shadow on every card. (See template 63 fix, K.10 below.)

For an opposite-direction marquee using ONE keyframe, use the arbitrary class `[animation-direction:reverse]` — cleaner than writing a second keyframe just to flip direction.

### K.7 — Glassmorphic ambient strips behind hero/CTA content

When user says "add a moving strip in the background, glassmorphic" — for a CTA or hero where you want ambient motion but content readability is paramount:

```html
<section class="...relative overflow-hidden..." style="background-color: #1a1b26;">
  <!-- Strip — absolute, rotated, drifts horizontally -->
  <div aria-hidden="true" class="absolute top-[18%] -translate-y-1/2 left-[-5vw] w-[110vw] z-0 transform -rotate-2 pointer-events-none">
    <div class="border-y border-[#a78bfa]/40 py-2 md:py-3 flex overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(124,58,237,0.18)]"
         style="background-color: rgba(124,58,237,0.20);">
      <div class="animate-marquee flex items-center shrink-0">
        <span class="font-display-xl text-[#c4b5fd]/55 text-[clamp(1.4rem,2.8vw,2.25rem)] leading-none uppercase px-4 whitespace-nowrap">/ WORDS / WORDS / WORDS</span>
        <!-- duplicate for seamless loop -->
      </div>
      <div class="animate-marquee flex items-center shrink-0">...</div>
    </div>
  </div>

  <!-- Content sits on top with z-10 -->
  <div class="relative z-10 ...">...</div>
</section>
```

Key opacity rules:
- **Background color: 0.15-0.25 alpha** (e.g., `rgba(124,58,237,0.20)` violet). High enough to read as a strip, low enough not to compete.
- **Border: 0.30-0.45 alpha** of accent color. Defines the strip edges.
- **Text inside: 0.40-0.55 alpha** of accent color. Reads as ambient/atmosphere, not foreground.
- **Outer glow: `shadow-[0_0_50px_rgba(R,G,B,0.18)]`** for soft emission.
- **`backdrop-blur-md`** on the inner div — this is what makes it feel "glass" rather than just translucent.

For TWO opposing strips (top + bottom), give them opposite rotations (`-rotate-2` / `rotate-2`) and opposite scroll directions (default vs `[animation-direction:reverse]`). Position with `top-[N%]` for top strip and `bottom-N` for bottom. Section needs `overflow-hidden` to clip the rotated strip ends.

### K.8 — Lifting a chip OUT of a flex column when a strip cuts through it

When you've added an ambient strip behind content (per K.7) and a chip in the content flow ends up cutting through the strip, extract just that chip to absolute positioning ABOVE the strip:

```html
<!-- Chip pulled out, absolute, sits in section's top padding above the strip -->
<span class="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 z-20 ...chip styles... bg-background/70 backdrop-blur-sm">
  CHIP CONTENT
</span>

<!-- Flex column starts with the next item, gets compensating top padding -->
<div class="relative z-10 ...flex flex-col... pt-16 md:pt-24">
  <h2>HEADLINE</h2>
  <!-- ... rest of content -->
</div>
```

Three rules:
1. **z-20 on the chip, z-10 on the content, z-0 on the strip.** Chip floats above everything; strip drifts behind everything; content sits in between.
2. **`bg-background/70 backdrop-blur-sm` on the chip** — translucent so the strip ghosts behind it slightly, but readable. Without backdrop-blur the chip looks pasted on.
3. **Compensate the flex column with `pt-16 md:pt-24` (or similar)** — when the chip leaves the flow, the headline shifts up to where the chip used to be. Top padding on the flex column restores the original headline position. (User asked this explicitly: "lower the headline to the text below — be aware of padding" → this is the fix.)

Don't try to position the strip below the chip instead. Moving the strip changes its visual position relative to the section, and the user wants the strip in a specific place (per their previous direction). Keep the strip pinned, move the chip.

### K.9 — Sliding strip with mini rounded image cards (between sections)

For an end-of-page activity feed / transmission feed BEFORE a footer:

- Single-row marquee, 8 unique mini cards duplicated for the loop.
- Each card: `rounded-2xl border border-X/30 bg-surface-container/60 backdrop-blur-sm px-3 py-2 flex items-center gap-3 shrink-0 w-72`
- Inside: `w-12 h-12 rounded-xl overflow-hidden border border-X/40 shrink-0` thumbnail (40-50px small image, treated to match section aesthetic) + small text block (`> LABEL_TAG` mono caption + timestamp)
- Hover: `hover:border-X` (intensifies border to full opacity) + `hover:bg-surface-container` (lifts bg)
- Use the same `marquee-track` + `marquee-left` keyframes from K.6.

For accent separation between the strip section and footer, use thin gradient bars at top + bottom of the strip section:

```html
<!-- Top accent: cyan→magenta gradient bar -->
<div class="absolute top-0 inset-x-0 h-[3px] z-10 pointer-events-none"
     style="background: linear-gradient(90deg, transparent 0%, #00dbe9 20%, #fe00fe 80%, transparent 100%);"></div>
<!-- Bottom accent: reversed -->
<div class="absolute bottom-0 inset-x-0 h-[3px] z-10 pointer-events-none"
     style="background: linear-gradient(90deg, transparent 0%, #fe00fe 20%, #00dbe9 80%, transparent 100%);"></div>
```

The gradient `transparent 0%, COLOR 20%, COLOR 80%, transparent 100%` makes the bar fade in/out at the edges, which feels editorial rather than slammed-on.

### K.10 — Marquee chunky-shadow clipping (Memphis fix)

In Memphis-style templates with `shadow-hard: 4px 4px 0 0 #1E293B` cards inside marquees, the `overflow-hidden` on the marquee row wrapper clips the bottom and right shadow. Add `py-3` (12px vertical padding) to the wrapper:

```html
<div class="overflow-hidden py-3">
  <div class="marquee-track marquee-left">
    <!-- chunky-shadow cards -->
  </div>
</div>
```

The horizontal shadow clipping is acceptable (cards scroll past the viewport edge anyway), but vertical clipping is permanently visible and looks broken. This bit on template 63 — fix is one class addition.

### K.11 — Dynamic Tailwind classes in JSX `.map()` — pre-compute static strings

When mapping over a data array and the items need varying Tailwind classes per row, **pre-compute the full class string as a constant** and reference it in the data, rather than interpolating into a template literal in the render:

```jsx
// GOOD — JIT picks these up reliably
const cyanCard    = "border-primary-fixed/30 hover:border-primary-fixed";
const cyanImg     = "border-primary-fixed/40";
const magentaCard = "border-secondary/30 hover:border-secondary";

const items = [
  { name: "X", cardCls: cyanCard,    imgBorder: cyanImg },
  { name: "Y", cardCls: magentaCard, imgBorder: magentaImg },
];

{items.map(i => <div className={`rounded-2xl border ${i.cardCls} ...`}>...</div>)}

// RISKY — Tailwind JIT sometimes misses interpolated class names
{items.map(i => <div className={`rounded-2xl border border-${i.color}/30 hover:border-${i.color} ...`}>...</div>)}
```

Tailwind CDN's JIT scans the DOM at runtime via MutationObserver — runtime interpolation USUALLY works because the final concatenated string lands in the DOM. But pre-built static strings are zero-risk and read more clearly when reviewing the data array later.

If you must interpolate dynamically (e.g., `bg-[${color}]`), make sure the literal full class appears somewhere in the source so JIT picks it up — otherwise the class won't generate.

### K.12 — Material Symbols missing-icon trap

When you use `<span class="material-symbols-outlined">apple</span>`, Material Symbols looks up the ligature for the text "apple". If no such glyph exists, the **literal text "APPLE" renders at the icon's huge font size**, which is jarring and breaks layout.

Verify icon names against the Material Symbols catalog before using. Common safe options for cards/integrations:
- Banking/payments: `payments`, `account_balance`, `credit_card`, `request_quote`, `receipt_long`, `contactless`
- Tech/dev: `cloud_sync`, `api`, `smart_toy`, `terminal`, `monitoring`
- General: `account_balance`, `health_and_safety`, `precision_manufacturing`, `bolt`, `tune`, `graphic_eq`, `album`, `groups`, `stage`

Apple/Google/Slack-style brand icons are NOT in Material Symbols — substitute with a generic equivalent (`contactless` for Apple Pay, `message-circle` for Slack via lucide).

### K.13 — Lucide version trap

Templates using lucide pinned to v0.294.0 (`<script src="https://unpkg.com/lucide@0.294.0/...">`) don't have icons added in later versions. Specifically:
- `notebook-pen` → use `book-open` instead
- Any newer "filled variant" icons → use the base equivalent

Stick to long-existing universal icons: `book-open`, `check`, `arrow-right`, `mail`, `play-circle`, `users`, `dollar-sign`, `globe`, `briefcase`, `coffee`, `bar-chart-3`, `zap`, `party-popper`, `chevron-down`, `frown`, `smile`, `x-circle`, `check-circle-2`. These were all reliable in v0.294 and remain valid.

If a tile renders empty (no icon glyph), the icon name probably doesn't exist in the pinned version. Swap immediately.

### K.14 — CSS-built premium card mock (no remote image needed)

For "show off the product" sections (premium credit card, hardware product, etc.), build the visual entirely with CSS gradients instead of relying on a product image:

```html
<div class="aspect-[1.586/1] w-full rounded-2xl border border-on-primary-fixed-variant overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-700"
     style="background:
       radial-gradient(circle at 18% 20%, rgba(109,254,156,0.18), transparent 35%),
       radial-gradient(circle at 90% 90%, rgba(109,254,156,0.12), transparent 40%),
       linear-gradient(135deg, #16223d 0%, #101b34 60%, #060c1e 100%);">
  <!-- diagonal sheen overlay -->
  <div class="absolute inset-0 opacity-40 pointer-events-none"
       style="background-image: linear-gradient(115deg, transparent 60%, rgba(255,255,255,0.04) 60.5%, transparent 64%);"></div>
  <!-- card content: brand mark, number, holder, valid-thru -->
</div>
```

The recipe is:
1. **Aspect-[1.586/1]** = real credit card ratio (CR-80).
2. **Two radial accent highlights** at opposite corners (top-left bright, bottom-right dimmer) for dimensional lighting.
3. **Diagonal linear-gradient base** (135deg, three-stop) for the metallic sheen.
4. **Optional second linear-gradient overlay at 115deg** for a thin sheen line crossing the card.
5. **Mono number** (`font-mono text-lg tracking-[0.25em] tabular-nums`) for the card number.
6. **Hover rotation flatten** (`lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-700`) — the card tilts slightly at rest, straightens on hover.

Used in template 85 (Ledger Bank "The Card"). Reads as premium and is 100% reliable (no image 404 risk).

### K.15 — Phosphor green CRT tint pattern (for cyber/CRT templates)

To turn any image into a CRT-feed tile, layer 4 things over it:

```html
<figure class="relative overflow-hidden bg-black">
  <img class="absolute inset-0 w-full h-full object-cover grayscale contrast-150 opacity-60" src="..." alt=""/>
  <!-- 1. Multiply layer: dark green → forest → red gradient (mood) -->
  <div class="absolute inset-0 mix-blend-multiply pointer-events-none"
       style="background: linear-gradient(160deg, rgba(11,28,16,0.55) 0%, rgba(8,40,22,0.85) 60%, rgba(31,1,0,0.7) 100%);"></div>
  <!-- 2. Screen layer: radial CRT-green halo (bloom) -->
  <div class="absolute inset-0 mix-blend-screen pointer-events-none"
       style="background: radial-gradient(ellipse at 50% 60%, rgba(127,199,116,0.35) 0%, transparent 70%);"></div>
  <!-- 3. Reused .crt-scanlines class -->
  <div class="absolute inset-0 crt-scanlines pointer-events-none"></div>
  <!-- 4. Optional caption / chip / status pill -->
</figure>
```

Used in templates 105 (TERM_42 SCAN_LIVE feed, MANIFESTO bg image), 112 (image strip relics with hue-rotate per row).

For magenta variant: `hue-rotate-[290deg]` on the img + magenta multiply layer. For cyan: `hue-rotate-[170deg]`. Combined with `saturate-150 contrast-110` for the hue-rotated treatment.

### K.16 — Numbered tag chips (`— 01`, `— 02`, …) refresh hollow grid cards

When a grid section feels "empty" (just an icon + a name per cell), the rebuild template is:

```
[ icon-chip ............. — 01 ]   <- numbered tag in mono caps
[                                ]
[ Headline                       ]  <- font-headline-md
[ One-line description copy.     ]  <- font-body-md, max-2 lines
[ ─────────────────────────────  ]
[ N items · Year       View →   ]  <- footer with stat + arrow link
```

Hover treatment that reads as premium:
- `hover:-translate-y-1` (subtle lift)
- `hover:border-[accent]` (border-color shift)
- `hover:shadow-[0_18px_40px_-20px_rgba(...,0.25)]` (deep elevation shadow, brand-tinted)
- Inner icon chip: `group-hover:bg-[accent]/10` (background fills with accent)
- "View →" text: `group-hover:text-primary` (color shift)

Wide / featured tile (1 of N): invert to `bg-primary text-on-primary` with secondary accent border ring + decorative blurred halo + "Featured" badge in the numbered tag spot. Differentiates without breaking the grid rhythm.

Used in template 29 (Industries we serve rebuild).

### K.17 — Image strip with alternating B&W ↔ colour treatments

For creator/editorial templates where the user asks for "alternating B&W and colour", the chequerboard pattern reads best:

- 8-tile grid (4 wide on top row × 2 rows). Tile 1 B&W, 2 colour, 3 B&W, 4 colour, 5 colour, 6 B&W, 7 colour, 8 B&W. Diagonal pattern across the grid.
- B&W treatment: `grayscale opacity-95 mix-blend-multiply group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700` — reveals colour on hover.
- Colour treatment: `saturate-110 contrast-105 group-hover:scale-105 transition-transform duration-700` — slight zoom on hover.
- Caption pill on each tile shows treatment label (`B&W` in muted secondary / `Colour` in brand teal) so the alternation reads as intentional.

Used in template 27 (Studio image strip).

For CRT/cyber templates, swap "colour" treatment with **hue-rotate tint** (cyan or magenta) — same alternation pattern but treatment polarity is B&W ↔ tinted.

### K.18 — Toned-down CTA from flooded brand colour

When a final CTA section is `bg-primary-container` (bright blue/red/etc.) flooded — feels loud and unprofessional in a "premium" context — refactor to:

```
[ ━━━━━━━ thin top accent bar ━━━━━━━ ]    <- 1px gradient or solid accent
[                                        ]
[                                        ]
[ ● OPEN FOR Q1 · 2 SLOTS                ]    <- live status pill with pulsing dot
[                                        ]
[ Let's make                             ]
[ something.   <- italic/colored 2nd line]    <- larger Display-2xl headline
[                                        ]
[ One-paragraph qualifier                ]    <- body copy, max-w-xl
[                                        ]
[ [ primary CTA ] [ secondary CTA ]      ]    <- side-by-side, accent + outline
[                                        ]
[ ───────────────────────────────────── ]
[ Loc · Est · Reply-time meta            ]    <- mono-caps, 3-cell grid
[                                        ]
[ ━━━━━━━ thin bottom accent bar ━━━━━━━ ]
```

Section bg becomes a calm dark surface (`#1a1b26` or `bg-surface-container-low`) with optional grid pattern. Two thin accent bars at top + bottom (`h-1` solid or 3px gradient) keep the brand colour as a frame, not a flood. The headline italic-color on the second word ("**something.**") provides emphasis without shouting. Two CTAs (yellow primary + outline secondary) give the user a choice and signal "we're confident, not desperate."

Used in template 28 (LET'S MAKE / SOMETHING CTA tone-down).

### K.19 — Active JSX trap update: dynamic Tailwind interpolation in `.map()`

Add to the §A active traps table:

| Pointer | Symptom | Fix |
|---|---|---|
| Dynamic Tailwind class names interpolated in JSX template literals (e.g., `border-${color}/30`) | Sometimes the class doesn't render even though it's a valid Tailwind class — JIT misses runtime-interpolated strings | Pre-compute full class strings as constants outside the data array, reference them by key (see K.11). |

Doesn't always fail — depends on whether the literal class string appears anywhere else in the source. But pre-computed strings are zero-risk and easier to maintain.

### K.20 — Resume-after-clear additions

Add to §J quickstart:

- **Pattern reach for "doubled marquee" / "two strips opposite directions"**: §K.6
- **"Glassmorphic strip behind hero/CTA"**: §K.7. Pair with K.8 (chip extraction) when the strip cuts through a chip.
- **"Tinted band that runs to the footer"**: §K.4 (remove main `pb-` and footer `mt-`).
- **"Image strip with alternating B&W and colour"**: §K.17.
- **"Premium card without an image"**: §K.14 (CSS gradients only).
- **"Different shade for full-width section"**: §K.3 (full-bleed + tint).
- **"Tile feels empty on hover"** (industries/services grids): §K.16 (rebuild template).
- **"Tone down a flashy CTA"**: §K.18.
- **Image-icon validation** before shipping: K.12 (Material Symbols ligature trap), K.13 (lucide version mismatch). If a tile renders a giant text or empty icon spot, this is why.

---

_Last touched: 2026-05-01 (late session) — added §K with 20 new patterns from the 15-template multi-batch upgrade pass. Templates touched this pass: 48, 20, 93, 53, coming-soon, 86, 105, 95, 30, 29, 63, 85, 28, 27, 112._

---

## L. Spacing & layout mistakes — recurring across the May 2026 review pass

A focused catalogue of mistakes that surfaced AFTER markup was already shipped and the user pointed them out. These are not theoretical — every entry below took 1+ correction round-trips during the multi-iteration pass on `50-cyberpunk-high-tech`, `91-dark-academia`, and `109-dark-luxury-occult`. **Read this before mirroring an asymmetric image grid or a multi-column editorial section.**

### L.1 — Asymmetric grid: narrower column has empty space below

**Symptom:** In a `grid-cols-12` row with `col-span-7` (large) + `col-span-5` (medium) tiles BOTH using `aspect-[4/3]`, the narrower tile renders shorter (its `aspect-[4/3]` height is proportional to its smaller width). The grid still stretches the FIGURE to match the row's tallest item — but the inner aspect-ratio div only fills its own aspect-defined height. Result: **visible blank/grey/black space below the inner content of the narrow tile**, all the way to the figure's stretched bottom edge.

Hit it on:
- `50-cyberpunk-high-tech` GHOST_GRID — col-span-5 "Node Δ-22 — Encrypted [GHOSTED]" left a black band below the caption
- `109-dark-luxury-occult` Atelier — col-span-5 "The Reading Vault" had grey space below the caption
- `91-dark-academia` Bindings Lookbook — col-span-5 "PLATE II / Calf, Gilt-Tooled" left a wide black strip below

**Two valid fixes:**

**(A) Stretch the single tile to match row height** (when the col-span-5 image content is editorial enough to fill a taller frame):

```jsx
// Add a `stretch: true` flag on the data entry for the narrow tile, then in render:
<figure className={`${b.span} ... ${b.stretch ? "lg:h-full" : ""}`}>
  <div className={`${b.aspect} ... ${b.stretch ? "lg:h-full lg:aspect-auto" : ""}`}>
    <img className={`${b.stretch ? "absolute inset-0 " : ""}w-full h-full object-cover ...`} />
```

Three things have to all be in place:
1. `lg:h-full` on the **figure** — so it fills its grid row height
2. `lg:h-full lg:aspect-auto` on the **inner aspect-ratio div** — drops the aspect constraint at lg+ and stretches to figure height
3. `absolute inset-0 w-full h-full object-cover` on the **img** — img no longer contributes to sizing, just fills

Missing any one of these and the empty space comes back. The `stretch` flag pattern is preferred over hard-coding because it lets the small tiles in the same `.map()` keep their natural aspect ratios.

**(B) Stack two images in the narrow column** (when extra editorial content fits the section's tone):

```jsx
<div className="md:col-span-5 md:h-full flex flex-col gap-4">
  <figure className="aspect-[16/9] md:aspect-auto md:flex-1 ...">[ original tile ]</figure>
  <figure className="aspect-[16/9] md:aspect-auto md:flex-1 ...">[ NEW second tile ]</figure>
</div>
```

`md:flex-1` on each child + `md:h-full` on the wrapper = two figures split the col-span-7 row height with a 16px gap between. Each figure drops its mobile aspect on md+ so it fills its flex share.

Used on `50-cyberpunk-high-tech` GHOST_GRID (added "Sub-Node Φ-9 — Trace [REROUTING]" as the second tile).

**Pick (A) when the tile is one cohesive image that should breathe larger; pick (B) when adding a second tile lets you say more (a related telemetry channel, a paired plate, a sub-relay). Don't leave the empty space.**

### L.2 — Same problem inside `flex-1` vertical image stacks

A direct sibling of L.1, different parent layout. When you stack 3 images in a column with `<figure className="flex-1">` each, the column stretches to match neighboring columns (e.g., a 3-column grid where column 2 holds 3 stacked images and columns 1/3 are tall content). Each `flex-1` figure gets its share of the column height, but the inner `aspect-[3/4]` div constrains the image to its aspect-defined height, leaving black space below in EACH figure.

Hit it on `91-dark-academia` Doctrines middle column (Plates 06/07/08 each had empty bands).

**Fix is the same as L.1(A) but applied unconditionally to every figure in the stack:**

```jsx
{images.map(img => (
  <figure className="... flex-1 lg:min-h-0">
    <div className="aspect-[3/4] lg:aspect-auto lg:h-full relative overflow-hidden">
      <img className="absolute inset-0 w-full h-full object-cover ..." />
```

Three things needed:
1. `flex-1 lg:min-h-0` on figure — `min-h-0` lets flex-1 actually shrink to its share. Without it, the inner content's natural size (aspect-defined) becomes the floor and flex-1 becomes a no-op.
2. `aspect-[3/4] lg:aspect-auto lg:h-full` on inner div — preserves aspect on mobile, drops it at lg+ to stretch.
3. `absolute inset-0 w-full h-full` on img — img fills without contributing to size.

The `lg:min-h-0` is the most-forgotten piece. Default flex items have `min-height: auto` which equals their content's intrinsic height. Without `min-h-0` the aspect-ratio inner div becomes the figure's floor and flex-1 doesn't shrink it.

### L.3 — Image content choice for asymmetric containers

**Symptom:** A vertical-friendly image (close-up of a book spine, portrait photo) placed in a wide `aspect-[4/3]` or `aspect-[16/9]` container with `object-cover` shows just a thin horizontal slice of subject, with the rest of the frame dark/dim because that part of the image is dark or off-center.

Hit it on `91-dark-academia` Bindings Lookbook PLATE II — the original `aida-public` URL was a tight book-spine close-up, `object-cover`-fit into `aspect-[4/3]` cropped most of it away leaving a near-black bottom half that READ as broken layout (not an editorial choice).

**Fix priority order (also see §H.12):**
1. Existing `aida-public` URLs the template was loading → guaranteed to work, but check the source content's aspect direction matches the container
2. Verified Unsplash IDs from §D.1 — the architecture / heritage subset (`1487958449943-...`, `1502672260266-...`, `1493663284031-...`, `1481349518771-...`, `1517021897933-...`) tends to fill horizontal frames well
3. Never gamble on a speculative ID — they 404 frequently

**Practical rule:** if the image was sized to be a thumbnail (small `?w=` query param like `200`), it's probably a vertical-friendly close-up. Don't promote it to a `aspect-[4/3]` hero tile without changing the source.

### L.4 — Clipped corners have no border (CSS `border` follows clip-path)

**Symptom:** Cards using `clip-path: polygon(...)` (like the `cyber-shape` class) define a CSS `border`, but the slanted/notched corners show NO border line — the clip-path crops the border off along with the shape's outer rim. Visually the card looks like it's missing decoration along its slants.

Hit it on `50-cyberpunk-high-tech` pricing tiers — `border border-gray-700` etc. on `.cyber-shape` cards, the clipped corners had visible empty notches with no edge line.

**Fix — nested wrapper pattern:**

```jsx
<div className={`cyber-shape ${accentBg} p-[1px or 2px] relative`}>
  <div className="cyber-shape bg-black/90 p-6 ...">
    {/* original card content */}
  </div>
</div>
```

Outer div has the same clip-path + the accent color as `bg`, plus `p-[1px]` (or `p-[2px]` for a heavier "border"). Inner div has the same clip-path + the actual card bg. The 1–2px padding gap renders the accent bg color along EVERY clipped edge — including the slanted ones — because both shapes are clipped identically. Effectively a "border" that follows the clip-path.

Don't try to do this with CSS `outline` — outline ignores clip-path entirely (renders square around the un-clipped bounding box, useless).

### L.5 — Aggressive percentage-based clip-path eats content

**Symptom:** Percentage-based clip-paths like the original `cyber-shape: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)` create CARD-SIZED triangles in the corners. On a 400px-tall card that's a 30%×height = 120px chop on the top-left, plus a 90%-row corner cut bottom-right. Buttons and content near the corners get visually clipped off.

Hit it on `50-cyberpunk-high-tech` pricing tiers immediately AFTER applying the L.4 fix — the user reported "thats too extreme, it clips off content and button, small slant at the corner is enough".

**Fix — pixel-based clip-path for cards:**

```css
.cyber-tier {
  clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 14px) 100%, 0 100%, 0 18px);
}
```

Pixel offsets give a fixed-size notch (14px wide × 18px tall in this case) regardless of card dimensions. Tiny editorial notch, no content clipping.

**Rule of thumb:** keep percentage-based clip-paths for BUTTONS (small, where the slant IS the design) and use pixel-based variants for CARDS (where the slant is decoration, not the message).

### L.6 — Twelve-col grid + large `gap-x-*` math collapses columns

**Symptom:** User asks for "2x more padding between columns" on a 3-column editorial layout. Naively bumping `gap-x-16` → `gap-x-40` (160px) inside a `lg:grid-cols-12` collapses column widths because:

In a 12-col grid, there are 11 column-line gaps. Each `gap-x-*` value applies between every adjacent column. With container width = 1024px (a typical `max-w-container-max`) minus `px-gutter` = ~960px usable, `gap-x-40` (160px × 11 = 1760px) MORE than the entire container. Cells using `col-span-N` reclaim some space because the gaps within the spanned region count toward their width — but the explicit gaps between groups still add up to too much, and individual `1fr` column units shrink toward zero.

Hit it on `91-dark-academia` Doctrines section. Initial fix (`gap-x-20`) gave 80px between groups; user asked for "at least 2x". Bumping to `gap-x-40` made columns collapse.

**Fix — switch to a custom fractional grid template AND widen the section container:**

```jsx
<div className="max-w-7xl mx-auto px-gutter">
  <div className="grid grid-cols-1 lg:grid-cols-[4fr_3fr_5fr] gap-x-32 gap-y-12">
    <div>{/* Col 1 */}</div>
    <div>{/* Col 2 */}</div>
    <div>{/* Col 3 */}</div>
  </div>
</div>
```

Two changes together:
1. **Custom template `lg:grid-cols-[4fr_3fr_5fr]`** instead of `lg:grid-cols-12 + lg:col-span-X`. With only 3 tracks (not 12), there are only 2 explicit gaps (not 11). The `4fr/3fr/5fr` ratio reproduces what 4/3/5 col-spans gave you, but no internal-gap waste inside spanned cells.
2. **`max-w-7xl` (1280px)** instead of `max-w-container-max` (1024px) — gives the larger gap room to fit. Use this when "more padding" is the explicit ask. Keep `max-w-container-max` for sections that should match the editorial rhythm of the rest of the page.

With `gap-x-32` (128px × 2 gaps = 256px) inside 1216px usable, `(1216-256)/12 fr = 80px per fr`. Col widths: 320 / 240 / 400px. All readable, all generous.

After the fix, `lg:col-span-X` on the children is redundant (the fractional template assigns track widths). Remove those classes for clarity.

**Rule of thumb:** if the design wants "lots of whitespace between editorial columns", reach for `grid-cols-[XfrXfrXfr]` from the start. The 12-col grid is for layouts where column boundaries align with a baseline grid (like pages with sidebars or marginalia).

### L.7 — Bottom-anchored image pair: equal gaps require a wrapper, not per-figure margins

**Symptom:** In a `flex flex-col` column where you want two images stacked at the bottom with **equal** spacing above the first image AND between the two images, the obvious approaches all produce uneven gaps:

- `mt-auto` on the second image only → all leftover space goes BETWEEN the two images. Gap above first = small fixed `mb-X` of the prior content; gap between = HUGE.
- `mt-auto` on the first image, `mb-X` between → all leftover space goes ABOVE the first image. Gap above = HUGE; gap between = small fixed `mb-X`.
- `mb-X` on both → no space anchoring; the pair sits up with the rest of the content, leaving empty space at column bottom.

Hit it on `91-dark-academia` Doctrines col 1 — Plate 04 and Plate 05 had a tiny `mb-6` gap between them but a yawning gap above Plate 04 (or below Plate 05, depending on which fix attempt). User said: "plate 4 and 5 should have same padding between them as plate 4 has above text, so basically move plate 4 a bit down".

**Fix — wrap the pair in a sub-container:**

```jsx
{/* Top section content */}
<blockquote className="...">...</blockquote>

{/* Bottom-anchored plate pair */}
<div className="mt-auto flex flex-col gap-10 pt-10">
  <figure>{/* Plate 04 */}</figure>
  <figure>{/* Plate 05 */}</figure>
</div>
```

Three pieces:
- `mt-auto` on the **wrapper** — anchors the entire pair to column bottom
- `flex flex-col gap-10` on the **wrapper** — fixed 40px between Plate 04 and Plate 05
- `pt-10` on the **wrapper** — fixed 40px ABOVE Plate 04 (matching the inter-plate gap)

The result is a two-image bottom cluster with consistent breathing room on top and between. Any leftover column height ends up ABOVE the wrapper (between the blockquote and the plate pair) rather than getting wedged between the two images. **Always wrap a "bottom-anchored cluster" rather than scattering `mt-auto` and `mb-X` across siblings.**

### L.8 — Mistake summary checklist (read before shipping)

Before declaring an asymmetric grid or multi-column editorial section done, do all of:

- [ ] Each tile in an asymmetric row: confirm visually that the narrower tile fills the row height. If using `aspect-[X/Y]` on a narrow tile, expect empty space below — apply L.1(A) `stretch` flag or L.1(B) two-tile stack.
- [ ] Each `flex-1` figure in a vertical stack: confirm the inner aspect-ratio div doesn't pin a floor below the flex share. Apply L.2 (`lg:min-h-0` + `lg:aspect-auto lg:h-full`) if so.
- [ ] Each image in an asymmetric container: confirm the source content fits the container's aspect direction. A vertical close-up in a horizontal frame is a bug, not a style.
- [ ] Each card with `clip-path`: confirm the borders along the slants render visibly, OR accept the slants as decoration only. Apply L.4 nested wrapper if borders should follow the clip-path.
- [ ] Each `clip-path` polygon: pixel-based for cards, percentage-based for buttons (L.5).
- [ ] Each multi-column editorial section: if "lots of whitespace between columns" is in the brief, reach for `grid-cols-[XfrXfrXfr]` + `max-w-7xl` from the start (L.6). Don't try to push `gap-x-*` past 80px in a `grid-cols-12` + `max-w-container-max` setup.
- [ ] Each bottom-anchored image cluster: wrap it (L.7), don't scatter `mt-auto` across siblings.

Half of these failures only show up at lg+ breakpoints where the asymmetric layout activates. Always check the lg+ rendering, not just mobile.

---

_Last touched: 2026-05-01 (very late session) — added §L spacing & layout mistakes catalogue from the 50/91/109 multi-correction iteration. Each entry is a real round-trip from the user, not a theoretical worry. Templates touched: 50, 91, 109._

---

## M. Section catalogue — patterns from the 7-template multi-batch (May 2026)

Templates touched this batch: `21-developer-portfolio`, `39-doc-hub`, `13-editorial-fashion-style`, `34-editorial-magazine`, `88-fitness-wellness`, `84-game-studio`, `51-glassmorphism`. The user's standing brief was **"4 more sections, 1 image strip, 1 section with images, 2 with content, don't use bento grids for images, be creative, adhere to the style"**. Every pattern below was applied to BOTH HTML and JSX siblings.

### M.1 — The "4 sections" structural template

The brief decomposes into a near-universal shape. Use it as the default skeleton on any template and only deviate when the existing palette/voice forces it:

1. **Image strip** — paused-on-hover horizontal marquee (per §I.5 / §K.6). 6–8 unique tiles + duplicate set for seamless loop. Each tile carries data, not just an image: a numbered tag, a title, a meta line, a metric. **Captions ARE the content** — the photo is a backdrop.
2. **Section with images, NOT a grid** — 3 alternating image+content rows (image-left → content-left → image-left) on a `grid-cols-1 md:grid-cols-12` with 7-col image + 5-col content, second row reversed via `md:order-1 / md:order-2` (per §H.1, §K.5). Each row a discrete subject — a project, a study, a person, a stage.
3. **Content section #1** — numbered editorial list (Roman numerals or `01/02/03`) with 5 entries. Doctrine list (§H.5 / §K.16) is the safest shape: `<ol>` divided by hairlines, each row = numeral + title + body + meta.
4. **Content section #2** — FAQ `<details>` accordion (§I.5 idiom but applied to FAQ specifically). 5 entries. See M.7 below for the recipe variants.

This skeleton lands cleanly on 7-out-of-7 templates this batch. Variations come from the **subject matter of each row**, not the structure.

### M.2 — Auto-cycling image with blur cross-fade (vertical scrolling-image effect)

**Triggered by**: "let it move on a vertical image and while it moves, it changes images effect, blurs it or something like that".

**Used on**: `13-editorial-fashion-style` Archive section.

Recipe — 4 absolute-stacked images with a single shared keyframe and staggered animation-delays:

```css
@keyframes archive-fade {
    0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
    8%, 22%  { opacity: 1; filter: blur(0)     saturate(1);   transform: scale(1); }
    26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
}
.archive-cycle-img {
    animation: archive-fade 16s linear infinite;
    opacity: 0;                                /* initial — for delayed siblings */
    filter: blur(18px) saturate(0.8);
    transform: scale(1.04);
    will-change: opacity, filter, transform;
}
```

```html
<div class="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden">
  <img class="archive-cycle-img absolute inset-0 ..." style="animation-delay: 0s;"  src="..." />
  <img class="archive-cycle-img absolute inset-0 ..." style="animation-delay: 4s;"  src="..." />
  <img class="archive-cycle-img absolute inset-0 ..." style="animation-delay: 8s;"  src="..." />
  <img class="archive-cycle-img absolute inset-0 ..." style="animation-delay: 12s;" src="..." />
</div>
```

Math: 16s loop × 4 stops × 4s slot per image. Each image visible 8–22% of cycle (≈3.5s) with 1s in/out fades; the rest of the cycle, opacity is 0 so siblings show through. The 1s "all dim" gap at startup is acceptable; cycle 2 onwards is seamless.

**Synced indicator strip** — 4 mini thumbnails below get a sibling keyframe `archive-indicator` that fades opacity 0.25 → 1 with the same 0/4/8/12 delays. **Synced scrubber bar** — single horizontal bar with `archive-scrub` keyframe `transform: scaleX(0) → scaleX(1)` over 16s linear, `transform-origin: left`.

**Captions auto-rotate together** — wrap N staggered absolute spans in a `relative` container with explicit `min-h-[Xpx]`. Each span uses the SAME `archive-cycle-img` class with matching delay. Without `position: relative` on the wrapper, all absolute spans fall back to the nearest positioned ancestor and stack at the wrong place — hard-to-spot bug.

`prefers-reduced-motion`: turn the animation off AND override the first image's initial state to `opacity: 1; filter: none; transform: none` so it stays visible (otherwise a no-motion user sees a blank frame).

### M.3 — Hero contrast: when `mix-blend-difference` looks muddy, replace with stacked overlays

**Triggered by**: "better hero HD image, words and headline contrast".

The default `mix-blend-difference` headline goes muddy against any mid-tone region of the photo (sky, skin, walls). Replace with the §A.5 stack — but use this exact 3-layer recipe on dark photographic heroes:

```html
<section class="relative min-h-[100dvh] w-full overflow-hidden">
  <img alt="..." class="absolute inset-0 w-full h-full object-cover" src="HD_Unsplash_w=2400_q=85" />
  <!-- 1. Vertical dark gradient — heavy top + bottom, transparent middle -->
  <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/85 pointer-events-none"></div>
  <!-- 2. Bottom-left radial vignette darkening BEHIND the headline area -->
  <div class="absolute inset-0 pointer-events-none"
       style="background: radial-gradient(ellipse 80% 70% at 18% 90%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);"></div>
  <!-- 3. Subtle accent tint at the opposite corner — keeps it cinematic, not purely flat -->
  <div class="absolute inset-0 pointer-events-none"
       style="background: radial-gradient(ellipse 60% 60% at 95% 10%, rgba(<accent-rgb>,0.10) 0%, transparent 60%);"></div>
  <!-- Solid white text + heavy drop-shadow — no blend mode -->
  <h1 class="... text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]">...</h1>
  <p class="... text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">...</p>
</section>
```

Used on `13-editorial-fashion-style`. Layer 2 (the bottom-left radial) is the load-bearing one — it darkens specifically the region behind the headline without flattening the whole photo. Drop shadows make small body text readable on the few pixels of mid-tone that bleed through.

### M.4 — Filling an asymmetric grid's empty column with editorial cards

**Triggered by**: "for section with 3 images, add some text or cards in empty spaces".

**Used on**: `13-editorial-fashion-style` (right column was 2 images stacked next to a tall portrait, leaving a sizeable bottom gap).

**Don't add a third image** to fill it — the grid stays an image grid, which the user's brief specifically didn't want ("don't use bento grids for images"). Instead, **interleave editorial text cards** with the existing images:

```
[ Image · Square 02 — labelled with PLATE roman numeral ]
[ Pull-quote figure — `format_quote` material icon + blockquote + cite + hairline rule ]
[ Image · Square 03 ]
[ Specifications card — bordered <dl> with Materials / Atelier / Edition / Released ]
```

The `<figure>` quote card needs no image of its own; it's just a bordered text block that matches the section's typography (Newsreader italic, label-caps cite, accent hairline). The Specifications card is a `<dl>` with a header bar and the same border treatment. Together they bring the column height up to match the tall portrait, AND they thicken the editorial voice of the section.

**Don't randomly scatter `mt-auto` / `mb-X`** — let the natural `flex flex-col gap-gutter` handle the cadence. If the column is still short, adjust the `mt-X` offset of the column (e.g., `md:mt-48`), not individual item margins.

### M.5 — "Captions on top of the image" upgrade for mid-tone backdrops

In sections where image + label compose together (lookbook squares, plate tiles, marquee tiles), if the existing label uses `mix-blend-difference` over a varied photo, swap it for **solid white + drop-shadow + a plate-roman-numeral micro-tag on the opposite corner**:

```html
<div class="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
  <p class="font-label-caps text-white uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
    01 — The Void
  </p>
  <span class="font-label-caps text-white/80 uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
    PLATE · I
  </span>
</div>
```

Two tags reading from opposite corners feels editorial; one tag drifting in mid-blend feels fragile. Used on `13`, `34` (Field Notes), `84` (Soundtrack tiles), `88` (testimonial photos).

### M.6 — Roadmap timeline (5 horizontal milestones with status)

**Used on**: `84-game-studio` Eclipse Calendar.

Five-step horizontal roadmap with `done / current / upcoming` status differentiation:

```html
<ol class="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
  <!-- thin gradient track-line under the circles -->
  <div class="hidden md:block absolute top-7 left-[8%] right-[8%] h-px
              bg-gradient-to-r from-X/0 via-X/40 to-X/0" aria-hidden="true"></div>

  <li>  <!-- done -->
    <div class="w-14 h-14 rounded-full bg-X/10 border-2 border-X
                flex items-center justify-center [glow-class] z-10">
      <span class="material-symbols-outlined text-X">check_circle</span>
    </div>
    <span class="font-label-caps text-X tabular-nums">Q3 · 2024</span>
    <h3>Vertical Slice</h3>
    <span class="text-on-surface-variant">Closed alpha · 240 testers</span>
  </li>

  <li>  <!-- current — pulsing dot, no glow class -->
    <div class="w-14 h-14 rounded-full bg-X/20 border-2 border-X flex items-center justify-center z-10">
      <span class="w-3 h-3 rounded-full bg-X [pulse-class]" aria-hidden="true"></span>
    </div>
    ...
  </li>

  <li>  <!-- upcoming — muted ring, schedule/flag icon -->
    <div class="w-14 h-14 rounded-full bg-bg border-2 border-on-surface-variant/30 flex items-center justify-center z-10">
      <span class="material-symbols-outlined text-on-surface-variant">schedule</span>
    </div>
    ...
  </li>
</ol>
```

The track-line uses `top-7` (= circle's vertical center at `h-14` ÷ 2). `left-[8%] right-[8%]` keeps the line just inside the first/last circle. The `z-10` on each circle promotes them above the track-line so the line passes BEHIND them.

For the "current" pulsing dot, use a custom keyframe (e.g., `raven-pulse`):
```css
@keyframes raven-pulse {
    0%, 100% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(<accent-rgb>, 0.4); }
    50%      { opacity: 1;   box-shadow: 0 0 0 8px rgba(<accent-rgb>, 0); }
}
```
Don't use Tailwind's stock `animate-pulse` — its 50% keyframe is just `opacity: 0.5`, no expanding-ring effect.

### M.7 — `<details>` accordion variants (chevron rotation)

Three variants used this batch — pick the one that matches the section's vocabulary:

| Variant         | Rotation                  | Icon        | Used on                          |
|-----------------|---------------------------|-------------|----------------------------------|
| `chevron-down`  | `0 → 180deg`              | lucide      | `51-glassmorphism` (FAQ)         |
| `add` (`+`)     | `0 → 45deg` (becomes `×`) | Material    | `88-fitness-wellness` (FAQ)      |
| `chevron_right` | `0 → 90deg`               | Material    | `39-doc-hub` (FAQ)               |

Universal CSS:
```css
.X-faq summary::-webkit-details-marker { display: none; }
.X-faq summary { list-style: none; }
.X-faq summary .X-chevron { transition: transform 250ms ease; }
.X-faq[open] summary .X-chevron { transform: rotate(<deg>); }
@media (prefers-reduced-motion: reduce) {
    .X-faq summary .X-chevron { transition: none; }
}
```

Native `<details>` works in the iframe with zero JS. No state machine needed. Each `<details>` row is `<details class="X-faq group p-5"><summary><h3>...</h3><span class="X-chevron">...</span></summary><p>...</p></details>` inside a parent that has `divide-y divide-X` for hairlines between rows.

### M.8 — Marquee data tiles (not just photos)

The §I.5 marquee pattern extended: each tile carries **structured data**, not just a caption. Patterns proven this batch:

| Template        | Tile shape                                                                                          |
|-----------------|-----------------------------------------------------------------------------------------------------|
| `21` Field Photographs | photo + `[ NODE_07 ]` mono tag + `FRA · 02:14` location/time                                  |
| `39` Themes shipping   | photo + brand-coloured wash + 5-swatch palette strip + token count chip                       |
| `34` Photographers     | photo + name (Newsreader italic) + city (Public Sans uppercase) + role caption               |
| `88` In Motion         | photo + sets/reps/RPE badge + lift name + weight (tabular-nums)                              |
| `84` Soundtrack        | photo + pulsing track-number dot + title + duration · tempo + play-circle icon               |
| `51` Around the World  | photo + flag emoji + pair (USD/JPY) + glass rate-pill + 24h delta chip (▲/▼/—)              |

Same skeleton, different domain language. The mono caption + accent dot/chip feels native to whatever palette the host template uses.

**Aspect ratio variation inside one marquee** — alternating `w-72 aspect-[3/4]` (portrait) with `w-80/96 aspect-[16/10]` (landscape) creates editorial rhythm vs. uniform tiles. Used on `34-editorial-magazine`.

### M.9 — Reusing existing `aida-public` URLs as marquee fill

When a template loads N reliable `aida-public` images for its primary cards, **reuse those exact URLs** as the marquee photo set rather than reaching for new Unsplash IDs. Each image gets new caption data per role. 7 marquee tiles + duplicate = 14 figures, drawing from the template's existing 4–6 working URLs by repeating with different captions and varied aspect ratios.

Used on `88-fitness-wellness` In Motion (recycled the 4 program-card photos + bench photo + hero photo to fill 7 marquee tiles with 7 different lift names). Zero risk of 404. Per playbook §H.12 image-strategy hierarchy, this is tier 1.

### M.10 — Tinted-overlay technique for sub-themed image tiles

When you need many tiles to feel "different" but you only have a small set of verified Unsplash IDs, vary the **overlay wash colour per tile**, not the underlying image. Used on `39-doc-hub` Themes-in-Production strip:

```html
<div class="relative h-44 rounded-xl overflow-hidden bg-surface-container-low">
  <img class="absolute inset-0 w-full h-full object-cover grayscale contrast-105" src="<verified Unsplash>" />
  <div class="absolute inset-0"
       style="background: linear-gradient(135deg, rgba(<theme-rgb>,0.55) 0%, rgba(<theme-rgb-deeper>,0.30) 50%, rgba(0,0,0,0.45) 100%); mix-blend-mode: multiply;"></div>
  <!-- chip + 5-swatch strip -->
</div>
```

Each tile reads as a different theme (Venice Bank / Apothecary / Atrium Health / Field Atlas / etc.) even though several may share the same architectural source photo. The wash colour + the bottom 5-swatch strip do the differentiation work; the photo is moody texture.

The grayscale + contrast-105 on the underlying image is essential — it strips the photo's own colour out so the tinted wash dominates.

### M.11 — Pricing tier triplet with featured glow ring (NOT a bento)

Three pricing cards in `grid md:grid-cols-3 gap-6 items-stretch`. One tier is featured with:

```css
.X-tier-featured {
    box-shadow: 0 0 0 1px rgba(<accent-rgb>, 0.45),
                0 20px 60px -20px rgba(<accent-rgb>, 0.35);
}
```
Plus a "Most popular" badge:
```html
<span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full
             bg-gradient-to-r from-X to-Y text-white text-[10px] font-bold
             uppercase tracking-widest shadow-[0_0_18px_rgba(<accent-rgb>,0.55)]">
  Most popular
</span>
```

Each card uses `flex flex-col gap-5` with the CTA button as the last child + `mt-auto` to bottom-align CTAs across all three cards regardless of body length. Feature lists use `<ul class="border-t border-X pt-5">` so the divider line aligns across cards even when feature counts differ.

Used on `51-glassmorphism`. This is a 3-column card grid, but it's CONTENT-driven (no images), so it's outside the "no bento for images" rule.

### M.12 — CSS-built dashboard mockup (extension of §K.14)

§K.14 covered a credit-card mock built with CSS gradients. Extending the recipe to a **dashboard** mock (used in `51-glassmorphism` In Your Hand row 2):

```html
<div class="relative h-full flex flex-col gap-4">
  <!-- Header: balance + delta chip -->
  <div class="flex items-baseline justify-between border-b border-white/10 pb-3">
    <div class="flex flex-col">
      <span class="text-[10px] uppercase tracking-widest text-slate-400">Total Balance</span>
      <span class="text-3xl font-bold text-white tabular-nums">$96,660.00</span>
    </div>
    <span class="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30
                 text-emerald-300 text-xs font-bold tabular-nums">+$4,210 · MTD</span>
  </div>
  <!-- 8-bar chart with progressive opacity ramp + final bar with glow -->
  <div class="flex items-end gap-1.5 h-28 mt-1">
    <div class="flex-1 bg-teal-500/15  rounded-t" style="height: 30%"></div>
    <div class="flex-1 bg-teal-500/30  rounded-t" style="height: 45%"></div>
    <div class="flex-1 bg-teal-500/40  rounded-t" style="height: 38%"></div>
    <div class="flex-1 bg-teal-500/55  rounded-t" style="height: 60%"></div>
    <div class="flex-1 bg-teal-500/70  rounded-t" style="height: 52%"></div>
    <div class="flex-1 bg-teal-500/80  rounded-t" style="height: 78%"></div>
    <div class="flex-1 bg-teal-400     rounded-t" style="height: 90%"></div>
    <div class="flex-1 bg-teal-300     rounded-t shadow-[0_0_18px_rgba(45,212,191,0.6)]"
         style="height: 100%"></div>
  </div>
  <!-- 2-row transaction grid pinned to bottom -->
  <div class="grid grid-cols-2 gap-3 mt-auto">
    <!-- Each row: icon-circle + name + time + amount (tabular-nums, sign + colour) -->
  </div>
</div>
```

The opacity ramp on the bars (15 → 30 → 40 → 55 → 70 → 80 → 100 → 100 with shadow-glow) creates "trending up" visual story. The last bar's `shadow-[0_0_18px_rgba(...,0.6)]` reads as "today's value is hot".

**Alerts mockup** (same row 3): 4 stacked notification cards in `flex flex-col gap-3`, each with `w-10 h-10 rounded-full` icon-circle + flexible-width body with `flex items-baseline justify-between` for title + time. Last card uses `opacity-70` to read as "settings / muted" vs the active 3 above.

### M.13 — JSX trap: fragment shorthand `<>` doesn't accept `key`

**Symptom**: React warning "Each child in a list should have a unique key prop", AND/OR the renderer does the wrong thing because keys are scattered onto inner siblings instead of the fragment.

When `.map()` needs to emit multiple sibling elements per iteration (e.g., a bar PLUS an optional separator), do NOT write:

```jsx
{items.map((item, i) => (
  <>
    <div key={i}>...</div>
    {item.sep && <div key={`s-${i}`}>...</div>}
  </>
))}
```

Two cleaner patterns:

**(A) `React.Fragment key={i}` (verbose but clear):**
```jsx
{items.map((item, i) => (
  <React.Fragment key={i}>
    <div>...</div>
    {item.sep && <div>...</div>}
  </React.Fragment>
))}
```

**(B) Build an output array imperatively (cleanest when there are conditional siblings):**
```jsx
{(() => {
  const out = [];
  items.forEach((item, i) => {
    out.push(<div key={`b-${i}`}>...</div>);
    if (item.sep) out.push(<div key={`s-${i}`}>...</div>);
  });
  return out;
})()}
```

Pattern B is what shipped in `88-fitness-wellness` for the 12-week intensity bars (where weeks 4, 8, 11 each get a phase separator after them).

### M.14 — Pre-compute static Tailwind class strings for any conditional ring/border/colour (refresher of §K.11/K.19)

Re-confirmed on `88-fitness-wellness` intensity bars. Building `ring-primary-container/${X}` inside a `${...}` interpolation drops the class for some renders (Tailwind JIT scans source for literal class strings; computed-at-runtime strings sometimes register, sometimes don't, depending on whether the same literal appears elsewhere).

**Always**:

```jsx
const peakRing = "ring-2 ring-primary-container/40 ring-offset-2 ring-offset-surface-container-low";
const peakRingMax = "ring-2 ring-primary-container/60 ring-offset-2 ring-offset-surface-container-low";
const phaseFx = { 1: "opacity-80", 2: "", 4: "opacity-50" };

// in render
<div className={`base-classes ${item.ring || phaseFx[item.phase] || ""}`}>
```

Both string literals exist in the JSX file as static text — JIT picks them up. Reference by data lookup, not by interpolation.

### M.15 — Sticky-rail + auto-cycling-image companion layout

Used on `13-editorial-fashion-style` Archive (left rail sticky, right column has the 16s cycling image).

The sticky rail is only effective if the right column is taller than the viewport — short right columns just leave the sticky rail glued to top while the rest of the section flies past.

```html
<div class="grid grid-cols-1 md:grid-cols-12 gap-... md:gap-...">
  <div class="md:col-span-5 md:sticky md:top-32 md:self-start mb-12 md:mb-0">
    <span class="...eyebrow"></span>
    <h2>Archive</h2>
    <p>...description...</p>
    <!-- Scrubber bar synced to the cycle -->
    <div class="flex items-center gap-4 max-w-sm">
      <div class="flex-1 h-px bg-X/40 relative overflow-hidden">
        <div class="absolute inset-0 origin-left bg-Y archive-scrub-bar"></div>
      </div>
      <span>04 looks · 16s loop</span>
    </div>
    <a class="border ...">View Entire Collection</a>
  </div>
  <div class="md:col-span-7">
    <!-- aspect-[3/4] md:aspect-[4/5] cycling image frame -->
    <!-- + grid grid-cols-4 gap-3 mt-6 of 4 sync'd thumbnails -->
  </div>
</div>
```

The left rail height (eyebrow + h2 + p + scrubber + CTA) is comfortably shorter than the cycling-image frame + thumbnail strip. Sticky engages cleanly.

### M.16 — Insertion points by template archetype

Where to insert new sections varies by host template's structure. Patterns proven this batch:

| Template type                          | Insertion point                                                         |
|----------------------------------------|-------------------------------------------------------------------------|
| Hero + 1–2 main sections + footer (`21`, `88`) | After the last main section, before the footer / final-CTA     |
| Doc page with `<article>` inside `<main>` (`39`) | Inside `<main>` BUT after `</article>`, sized wider than prose |
| Editorial magazine with grid sections (`34`)    | After the constrained grid, still inside `<main>`              |
| Long landing page with Hero / Features / Showcase / Lore / Studio (`84`) | Between Lore and Studio sections — keeps the call-to-action arc |
| Long landing page with Hero / Stats / Features / How / Testimonials / CTA (`51`) | Between Testimonials and CTA — final stretch before convert |
| Hero + many editorial sections + footer (`13`)  | Between specific editorial sections (Atelier Manifesto BEFORE asymmetric grid; Show Notes BEFORE Archive) |

**Rule**: don't all-pile new sections at the end. Insert between existing sections to maintain reading rhythm; the user notices when 4 new sections bunch up before the footer.

### M.17 — Update the TOC sidebar / nav anchors when adding sections

For templates with a table-of-contents sidebar (`39-doc-hub`), update the anchor list **in the same edit pass** as adding the sections. New sections without TOC entries feel orphaned.

Mirror the anchor list to JSX in the same edit:
```jsx
<a href="#themes">Themes in production</a>
<a href="#lifecycle">Brand colour → palette</a>
<a href="#reference">API at a glance</a>
<a href="#faq">FAQ</a>
```

Same for nav-bar anchors on landing pages — if the nav has `Programs / Coaches / Reviews / Pricing` and you've added an `In Motion` section, decide whether to add `#in-motion` to the nav. Don't if it would clutter; do if it's a tier-1 section.

### M.18 — Mistake summary checklist (read before declaring a 4-section batch done)

Before shipping a "4 sections + image strip + content" batch, do all of:

- [ ] All 4 sections inserted between existing sections, NOT piled at the end (M.16).
- [ ] Image strip uses paused-on-hover marquee with edge-fade gradients on both sides.
- [ ] Marquee content is duplicated for seamless loop; duplicates are `aria-hidden="true"`.
- [ ] Image-row section uses 3 alternating image+content rows (NOT bento), 7-col image / 5-col content with `md:order-1 / md:order-2` reverse on row 2.
- [ ] Numbered list section uses `<ol>` with hairline dividers and Roman numerals OR `01/02/03` style.
- [ ] FAQ uses native `<details>` with rotating chevron — no JS state machine.
- [ ] All marquee/cycle keyframes have `@media (prefers-reduced-motion: reduce)` overrides.
- [ ] If the template has a TOC sidebar or nav anchors, new section anchors are added there too (M.17).
- [ ] HTML and JSX siblings stayed in parity (per CLAUDE.md / playbook §J.2).
- [ ] No fragment shorthand `<>` in `.map()` callbacks that emit conditional siblings (M.13).
- [ ] No `ring-${color}/${alpha}` interpolation in JSX — pre-computed static strings only (M.14).
- [ ] `tsc --noEmit` passes silent (or surface any new error before declaring done).

Everything in this section was learned from a single 7-template batch where the user asked for the same shape applied differently to each host template. The shape itself is portable; the voice / palette / typography per template is what carries the "premium" feel.

---

_Last touched: 2026-05-01 (final session) — added §M with 18 patterns from the 7-template multi-batch (21, 39, 13, 34, 88, 84, 51). Captures the "4 sections / 1 image strip / 1 image row / 2 content" structural template, auto-cycling cross-fade, hero overlay stack, asymmetric-grid filling, marquee data tiles, dashboard/alerts CSS mocks, and the JSX traps that surfaced (fragment-with-key, dynamic Tailwind interpolation)._

---

## N. Patterns from the 10-template multi-batch (May 2026, third pass)

Templates touched this batch: `104-halftone-pop-art`, `75-hand-drawn`, `hero-landing` (templates dir), `72-high-luxury`, `64-isometric`, `80-horizontal-scroll`, `111-isometric-grunge-brutal`, `81-kinetic-kino`, `89-editorial-magazine`, `31-law-firm`. Same §M skeleton applied to all, varied per host aesthetic.

### N.1 — The 4-section skeleton ports cleanly to ANY register

The §M.1 skeleton (image strip · image+content rows · doctrine · FAQ) landed on 10/10 templates this batch across every aesthetic in the gallery: pop-art, hand-drawn sketch, premium SaaS, luxury watch, isometric tech, horizontal-scroll editorial, brutalist grunge, kinetic typography, editorial magazine, law firm. **Treat this skeleton as the default; deviate only when the host has an unusual structure (e.g., horizontal-scroll).**

What changes per template is the **tile shape language**, not the skeleton. The shape language sub-table:

| Aesthetic | Tile shape language |
|---|---|
| Pop-art / comic | `stamp-rotate-1/-2` ±2-3° + `pop-art-shadow` (offset error-color shadow) + halftone-dot overlay (`radial-gradient(rgba(...) 1.5px, transparent 1.7px) 7px 7px multiply`) |
| Hand-drawn / sketch | `pin-tack::before` (red radial-gradient pseudo at top-center) + `blob-2`/`blob-1` organic borders + scotch-tape pseudo + paper-coloured backgrounds + sketch shadows |
| Premium SaaS | rounded-2xl + thin `border-slate-200` + `shadow-sm` + status pills (LIVE/REVIEW/SHIPPED/DRAFT) with `pulse-dot` keyframe + grayscale-light photos |
| Luxury (gold-on-black) | mono `border-luxury-gold/40` + `grayscale` photo + `bg-luxury-charcoal` + plate roman-numeral chip + small italic calibre/edition meta |
| Isometric / tech | thick `border-2 border-slate-700` + `bg-slate-800` + grid-pattern overlay + node ID chip (`NODE_07`) + region/latency caption |
| Horizontal-scroll editorial | `border border-tertiary-fixed-dim/40` thin frame + grayscale + serif italic plate caption + small `Plate · I` mono caps |
| Grunge / brutalist | `border-2 border-white` + `shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]` + accent-colour border variant + status chip |
| Kinetic / typography | `border-2 border-background` (inverted: white border on dark) + variable-font axis demo as the figcaption (`Aa`/`Mm`/`Ss`/`Th`) instead of a person/place |
| Editorial / heritage magazine | clean `bg-[#1A1915]` + grayscale + dark gradient + serif italic name + small label-caps role |
| Law firm | `rounded-xl` + grayscale + dark gradient + label-caps PARTNER/COUNSEL chip + serif italic name + small label-caps role |

The marquee skeleton itself is identical across all 10 — only the tile shell changes.

### N.2 — Mixed-aspect tile rhythm: w-72 portrait + w-80/w-96 landscape

For paused-on-hover marquees, mix `w-72 aspect-[3/4]` (portrait) with `w-80 aspect-[16/10]` and `w-96 aspect-[16/10]` (landscape) tiles. **Do not use uniform tile widths** — the rhythm is what makes it read as editorial vs. carousel. Pattern proven on 89-editorial-magazine (Contributors), 31-law-firm (Counsel), 80-horizontal-scroll (Plates). 6–8 unique tiles + duplicate `aria-hidden="true"` set is the standard length.

### N.3 — Material Symbols / lucide pre-flight check

Before using `<span class="material-symbols-outlined">icon_name</span>` or `<i data-lucide="...">`, check the template's `<head>` to confirm the relevant CDN is loaded. Three of this batch's templates (72-high-luxury, 80-horizontal-scroll partial, kinetic templates) DO NOT load Material Symbols — using the class renders the literal text "ICON_NAME" at huge font size, breaking the layout. **Substitute with text glyph (`+`, `→`, `↓`) or inline SVG when the icon font isn't loaded.** This is now the single most common new-section bug.

Also see §K.12 (Material Symbols ligature trap) and §K.13 (lucide v0.294 missing icons).

### N.4 — Lucide v0.294 known-good icon list (extends §K.13)

This batch confirmed working in the pinned version: `book`, `check`, `arrow-right`, `chevron-right`, `chevron-down`, `mail`, `terminal`, `server`, `route`, `shield-check`, `box`, `box-select`, `activity`, `globe`, `cpu`, `twitter`, `github`, `linkedin`, `menu`, `play-circle`, `users`, `dollar-sign`, `briefcase`, `coffee`, `bar-chart-3`, `zap`, `frown`, `smile`, `x-circle`, `check-circle-2`. If a tile renders empty in a lucide template, the icon name probably doesn't exist in v0.294 — swap to one from this list.

### N.5 — Insertion-point map by template archetype (extends §M.16)

| Archetype | Existing structure | Insertion point for the 4 new sections |
|---|---|---|
| Pop-art / brand-led (104) | hero · feature grid · gallery · final CTA | between gallery and final CTA |
| Hand-drawn (75) | hero · social proof · features · how-it-works · pricing · FAQ | between how-it-works and pricing (preserves the pricing/FAQ closing arc) |
| SaaS landing (hero-landing) | hero · features grid · footer | between features and footer (full bleed allowed) |
| Luxury vertical (72) | hero · manifesto · collections · materials · craft · newsletter · footer | atelier marquee BETWEEN materials and craft; heritage/refs/FAQ between craft and newsletter |
| Tech vertical (64) | hero · social proof · services · features · network · pricing · footer | between features and pricing |
| Horizontal-scroll (80) | scenes laid out as horizontal snap container | new scenes inserted between existing scenes; **bottom nav must be updated to include them** |
| Brutalist editorial (111) | hero · arsenal grid · footer | between arsenal and footer (4 sections) |
| Kinetic / typography (81) | hero · featured strips · why-variable blocks · footer | between why-variable and footer |
| Editorial magazine (89) | header · hero · 3-col features · footer | between 3-col features and footer |
| Professional services (31) | hero · practice areas · footer | between practice areas and footer |

**Rule:** When a template ends with a "closing arc" (FAQ → CTA, or pricing → footer), insert the 4 new sections BEFORE the closing arc, not after. Inserting after pushes the closing arc into archive territory. The `75-hand-drawn` insert point (between how-it-works and pricing) was deliberately chosen to keep the existing FAQ at the bottom.

### N.6 — Horizontal-scroll templates: scenes, not sections

For `80-horizontal-scroll`-style templates where each "section" is a 100dvw / 100dvh snap-target:

1. Each new section is a `<section class="scene ...">` — full viewport, `overflow-y: auto` so inner content can scroll vertically inside the scene.
2. Marquee strips inside a scene work well in the **lower half**: scene chrome (eyebrow + h2 + supporting copy) at top-quarter, marquee at `mt-auto pb-16`. The scene's `overflow-y: auto` does not interfere with the strip's `overflow-x: hidden`.
3. **Update the bottom-nav anchors in the same edit pass.** New scenes without nav entries are unreachable except by horizontal scroll.
4. New scenes can use mobile-friendly single-letter labels (`M / P / A` for Manifesto/Plates/Atelier) when nav gets dense.
5. Doctrine list inside a scene: full-screen `<ol>` with hairlines works because the scene scrolls vertically.

### N.7 — JSX-mirror file existence check (extends playbook §J.2)

The 1–100 vs 101+ rule is a heuristic, not a hard partition. **Always check whether the `.jsx` sibling exists** before declaring "no JSX needed":

- 104-halftone-pop-art is technically 101+ but has a complete `.jsx` sibling. The user expected it mirrored.
- 111-isometric-grunge-brutal is 101+ and has no `.jsx` sibling — HTML only.

If `.jsx` exists, mirror. If not, HTML only. Don't trust the number range alone.

### N.8 — Adding CSS to a JSX file with auto-generated `<style>` blocks

Some JSX templates (e.g., `31-law-firm`) have a `<style>` block with hundreds of lines of auto-generated Tailwind utility classes (`.bg-outline`, `.text-outline/5`, etc.) wrapped in `dangerouslySetInnerHTML`. **Don't try to append your new CSS to the end of that block** — the block is one giant string and Edit's exact-match becomes brittle.

Pattern: add a SECOND `<style dangerouslySetInnerHTML={{ __html: \`...\` }} />` element right before the body's outer `<div className="...">` opens. Both blocks render; the cascade resolves; nothing breaks.

```jsx
{/* existing auto-generated style stays as-is */}
<style dangerouslySetInnerHTML={{ __html: hugeUtilityString }} />

{/* new section's CSS goes in its own block */}
<style dangerouslySetInnerHTML={{ __html: `
  html, body { overflow-x: clip; }
  .full-bleed-X { width: 100vw; ... }
  .X-track { animation: ... }
  .X-faq[open] summary .X-chevron { transform: rotate(180deg); }
` }} />

<div className="bg-surface ...">
  {/* body */}
</div>
```

This avoids the brittle Edit and keeps the new utility classes legible and reviewable.

### N.9 — Rotated marquee tile clipping mitigation

When marquee tiles have rotated transforms (`stamp-rotate-1` = `rotate(-3deg)`, etc.) and the wrapping container has `overflow-hidden`, the rotated corners get clipped. Fix: add `padding: 32px 0` (vertical) and small horizontal padding to the `.X-track` wrapper. The rotation budget on tiles should stay within ±3° to avoid needing `padding: 48px 0` or larger.

This is a sibling pattern to §K.10 (chunky-shadow vertical clipping). Same fix idiom.

### N.10 — Inline rich content in mapped JSX data

When a piece of body copy needs inline highlighted spans (e.g., `Stamp it: <span class="bg-on-surface text-surface-bright px-2 font-metadata-mono">FOLIO · OK</span>. Close the lab.`), put the literal HTML in the data array as a string and render with `dangerouslySetInnerHTML`:

```jsx
const steps = [
  { body: 'Tip the matrix. Stamp it: <span class="bg-on-surface text-surface-bright px-2">FOLIO · OK</span>. Close the lab.' },
];

{steps.map(s => (
  <p dangerouslySetInnerHTML={{ __html: s.body }} />
))}
```

For data arrays where SOME entries have inline HTML and others don't, branch on `typeof body === "string" && body.includes("<")` or just use `<p dangerouslySetInnerHTML={{ __html }}>` everywhere and let plain strings flow through. The Babel-standalone preview iframe handles this fine.

Don't try to express inline highlighted spans as JSX-children-inside-the-data — the data array becomes unmaintainable and harder to mirror to HTML.

### N.11 — `prefers-reduced-motion` checklist (closing rule)

Every keyframe added needs a `@media (prefers-reduced-motion: reduce)` override that sets `animation: none`. This is required for every marquee, every pulse, every cycling-image, every accordion chevron. Add the override in the same `<style>` block where the keyframe is declared:

```css
.X-track { animation: X-x 60s linear infinite; }
.pulse-Y { animation: pulse-Y-ring 2s ease-out infinite; }
.X-faq summary .X-chevron { transition: transform 250ms ease; }

@media (prefers-reduced-motion: reduce) {
  .X-track { animation: none; }
  .pulse-Y { animation: none; }
  .X-faq summary .X-chevron { transition: none; }
}
```

The cycling-image (§M.2) needs a special override that ALSO sets the first image's resting state to visible (`opacity: 1; filter: none; transform: none`) — see §M.2.

### N.12 — Mistake summary checklist (read before declaring a 10-template batch done)

- [ ] Each new marquee has 6-8 unique tiles + duplicate set (`aria-hidden="true"`); track has `padding-y` if tiles are rotated.
- [ ] Each new section is inserted at the correct insertion point per §N.5 (BEFORE the closing arc, not after).
- [ ] Material Symbols / lucide icon names are pre-flight-checked against the template's loaded fonts/UMD; substitute with text glyph or SVG if the lib isn't loaded (§N.3).
- [ ] JSX siblings: file existence checked before assuming "no JSX needed" (§N.7). Mirror if file exists.
- [ ] JSX `<style>` blocks: new CSS in a SECOND `<style>` element, not appended to auto-generated one (§N.8).
- [ ] Tile shape language matches host aesthetic (§N.1 sub-table).
- [ ] Aspect mix: portrait `w-72 aspect-[3/4]` + landscape `w-80/w-96 aspect-[16/10]` for editorial rhythm (§N.2).
- [ ] Horizontal-scroll templates: new scenes added to bottom nav (§N.6).
- [ ] Inline rich content: `dangerouslySetInnerHTML` on the rendered `<p>`, NOT JSX children in data array (§N.10).
- [ ] `prefers-reduced-motion` override added for every keyframe (§N.11).
- [ ] No fragment shorthand `<>` with `key` in `.map()` callbacks (§M.13).
- [ ] No `border-${color}/${alpha}` interpolation in JSX — pre-computed static strings only (§M.14).

---

_Last touched: 2026-05-01 (very late session) — added §N from the 10-template third multi-batch (104, 75, hero-landing, 72, 64, 80, 111, 81, 89, 31). Confirms the §M skeleton ports to 10/10 across pop-art, sketch, SaaS, luxury, isometric, horizontal-scroll, brutalist, kinetic, editorial, law-firm registers. New traps: Material Symbols pre-flight check (§N.3), JSX file existence check (§N.7), separate-style-block pattern (§N.8), rotated-tile clipping mitigation (§N.9), and the closing-arc insertion rule (§N.5)._

---

## O. Parallel-batch upgrade workflow (May 2026 — 4 multi-template batches × ~6 templates each)

This section captures the META-process for running the upgrade pass at scale. Templates touched in this multi-batch session: **batch 1** = 24, 78, 47, 11, 101, 18 + 111 jsx-mirror; **batch 2** = 76, 87, 77, 99, 19, 12; **batch 3** = 05, 66, 79, 106, 102, 56; **batch 4** = 37, 82, 58, 33, 59, 71. ~26 templates / ~52 file pairs touched in one extended session, every pair ending HTML/JSX 1:1 in `<section>` count parity, every JSX `tsc --noEmit` clean.

The workflow: parent agent dispatches **6 parallel subagents per batch**, each agent owns one template-pair. Parent does NOT touch any in-flight file. Reports stream back asynchronously, parent updates the task list and surfaces caveats. Below are the patterns that made this work — and the ones that broke and got fixed.

### O.1 — The self-contained subagent brief structure

A working brief for an upgrade-template subagent has these exact sections in this order:

1. **One-line task** — "Upgrade `web/<NN>-<slug>.html` AND its sibling `web/<NN>-<slug>.jsx`. Mirror every HTML change to JSX — they MUST stay in 1:1 parity."
2. **REQUIRED FIRST READS** — list `CLAUDE.md`, the playbook with **specific line ranges to focus on** (NOT the whole 2114-line playbook — token-heavy), and the two template files end-to-end.
3. **USER'S STANDING BRIEF** — one paragraph: 6-9 sections per page, images each, AVOID bento as default, vary composition, match host palette/typography, prefer existing aida-public + verified §D.1 IDs.
4. **TOP TRAPS** — numbered list of 10-12 traps from §A internalised into one screen. The agent will review this once and not need to flip back.
5. **TEMPLATE-SPECIFIC NOTES** — current section count from a quick `grep -cE "^\s*<section"`, the host template's archetype, suggested new sections (with §-references) for the agent to choose from, palette tokens to match.
6. **WORKFLOW** — read both files end-to-end, plan, edit BOTH, hoist arrays in JSX, icon name verification, **`npx tsc --noEmit` ONCE at end, no `next build`/`next dev`**.
7. **CONSTRAINTS** — no new deps, no commits/push/PR, no co-sign, edit only the two template files, mirror in same pass.
8. **REPORT BACK** — sections added (with names + insertion points), patterns referenced (§-numbers), line count delta, **list of all image URLs used** (so parent can audit verified vs speculative), tsc result.

The brief averages ~80 lines per template. The agent reads ~5K tokens of playbook + the two template files (~30K-50K tokens) + the brief itself. Total context per agent ~100K — well within budget.

### O.2 — Specific playbook line ranges to point at (avoid loading the whole file)

The playbook is 2114 lines. Each section is targeted; agents need to reach the right one fast. The line ranges that ALWAYS go in a brief:

- §A active JSX traps: **lines 19-40**
- Pre-flight rules (read end-to-end, catalogue tokens): **lines 70-78**
- §J resume-after-clear quickstart: **lines 933-947**
- §M.1 4-section skeleton: **lines 1528-1538**
- §N.1 + §N.5 archetype map: **lines 1959-1976, 1996-2010**
- §I.3 .full-bleed utility: **lines 725-740**
- §I.5 / §K.6 marquee: **lines 757-777, 1024-1041**
- §K.3 tinted bands: **lines 988-996**
- §M.2 cycling cross-fade: **lines 1542-1577**
- §M.7 details accordion: **lines 1690-1710**
- §M.13 fragment-with-key: **lines 1813-1852**
- §K.11 / §M.14 dynamic Tailwind pre-compute: **lines 1138-1158, 1854-1869**
- §H.12 image strategy: **lines 645-652**
- §D.0 image-context match (READ FIRST): **lines 354-381**
- §D.1 subject map of verified Unsplash IDs (with subject tags): **lines 383-429**
- §D.1.5 archetype → subject-pool routing table: **lines 431-473**
- §D.1.7 "go bigger / more variety" workflow: **lines 475-484**
- §D.1.9 sizing convention: **lines 486-488**
- §M.18 + §N.12 pre-ship checklists: **lines 1932-1947, 2099-2110**

**The brief MUST include a `SUBJECT KEYWORDS` block** before the IMAGE BUDGET line. The agent writes (in their planning step before writing code) a list of subject keywords for each section's images. Example:
```
SUBJECT KEYWORDS (write before placing any <img>):
- Hero: "wood-fired ceramic tea bowl on linen, raking sunlight"
- Vase article (3 imgs): "Shigaraki vase profile / kiln-glow detail / vase shard"
- Recent firings strip (8 cards): "kiln-fired ceramics individual"
- Anagama process: "anagama kiln interior / loading wood / 1280C glow"
- Commissions (3 rows): "tea-house Mishima / Berlin collector study / Lisboa kappo"
```
THEN look up §D.1's subject map. If §D.1 has nothing close, reuse the template's existing aida-public + report the gap. **NEVER force-fit §D.1 architecture/portrait IDs into wedding/ceramics/food/garden/sports/kid archetypes** — that's the May–Jun 2026 "banana-batman-google-images-everywhere" failure mode (§D.0).

Plus ~3 additional pointers tuned to the template's archetype (e.g., §K.15 hue-rotate for neon templates, §K.7-K.8 glassmorphic strips for mesh-gradient, §H.7-H.10 editorial patterns for luxury/heritage, §I.11-I.12 brutalist polish).

### O.3 — The "NOVEL LAYOUT MENU" — push past the standard skeleton

After the standard playbook skeleton (marquee + alt rows + doctrine + FAQ) was applied to ~15 templates, the user's signal "try a bit different layouts picture placements, but variety" called for a novelty push. Batch 4's briefs added a 12-13 item NOVEL LAYOUT MENU and required agents to pick at least 2 NOVEL patterns per template. The menu:

1. **Diagonal full-width image band** — `clip-path: polygon(0 0, 100% 14%, 100% 86%, 0 100%)` slanted edges, content rests over/inside.
2. **Vertical image columns parallel to text** — text 6/12 + 2 stacked tall photos in 6/12 column with `flex-1` each.
3. **Polaroid stack** — 3-5 photos at varying rotations (`-3°` to `+5°`), drop-pin chips, scotch tape pseudo (`::before` cream rectangle).
4. **Off-grid hero with negative space** — large photo takes 2/3, text floats in remaining whitespace, NO card frame.
5. **Layered photo composition** — one large photo + 2 smaller offset thumbnails overlapping it (`absolute -bottom-8 -right-8 w-40 h-40 rotate-3`).
6. **Image-as-background under content card** — image full-width, semi-transparent content card (`bg-surface/70 backdrop-blur`) sitting on top with the spec sheet / editorial details / `<dl>` financial breakdown.
7. **Half-full-bleed image** — image takes 50% screen via `mr-[calc(50%-50vw)]` half-trick, text wraps next 50%.
8. **Sticky-photo + scrolling text** — `md:sticky md:top-32 md:self-start` companion. Pair with §M.15 sticky-rail.
9. **Top + bottom image bookends** — images at top + bottom of section, content sandwiched.
10. **Diagonal/rotated photo strip** — `-rotate-2` banner with `clip-path: polygon` slice.
11. **Wide cinema strip (21:9 full-bleed)** with mono caption bar below.
12. **Two-column flip-grid** — square 6/6 cells alternating image/text per row (NOT 7/5 alt rows — 6/6 with varied inner aspect per cell).
13. **Cluster of small floating sticker-photos** (kawaii / sticker-collage feel).
14. **Torn-paper diagonal split** — section split into halves with a torn-paper edge between (clip-path with random points). Best for paper-collage / zine templates.

Agents in batch 4 picked 2-4 novel patterns each. Result reads more editorial than the pure-skeleton batches. **Adopt this menu by default for any future batch where the user signals "more variety".**

### O.4 — The §A trap inoculation pattern

Across **13 freshly-edited JSX files** (batch 1 + 111 mirror), audit found **0 hits** on the 4 most critical traps:
- `import { useState } from 'react'` (named import → walker drops binding)
- `url("data:image/svg+xml...")` in body `<style>`
- `Math.random()` / `Date.now()` in render or lazy init
- `...(cond ? { x } : {})` spread-with-conditional (Babel infinite recursion)

Verified via:
```bash
grep -nE "^import\s*\{[^}]*\}\s*from\s*['\"]react['\"]" web/*.jsx       # trap 1
grep -nE 'url\(\\\\?"data:image/svg' web/*.jsx                          # trap 2
grep -nE "Math\.random|Date\.now|crypto\.randomUUID" web/*.jsx          # trap 3
grep -nE "\.\.\.\(.*\?" web/*.jsx                                        # trap 4
```

Sectioning these traps into a numbered "TOP TRAPS" block in every brief — verbatim, in priority order — inoculates against them reliably. Agents that read the brief once write trap-clean JSX without reaching for the playbook again. **Keep that block as the second screen of every future brief.**

### O.5 — The speculative-Unsplash-IDs failure mode (and fix)

**Symptom**: in batch 1, 2 templates (87-medical-care, 99-midcentury-modern) had agents add Unsplash IDs that LOOK like §D.1 entries but aren't on the verified list — the agents called them "verified-style" or "consistent with §D.1's URL form, mid-century lounge subject". Per playbook §H.12 these IDs 404 frequently.

**Root cause**: playbook §D.1 + §H.12 say "AVOID speculative Unsplash IDs" but the language ("avoid", "prefer") was treated as soft. Agents picked subject-matching IDs from training data when the §D.1 list didn't have a topic that fit (e.g., "mid-century lounge").

**Fix in batch 3+**: explicit hard rule in TOP TRAPS block: **"NO speculative Unsplash IDs. Use ONLY §D.1 verified list or aida-public URLs the template was loading."** Plus the report-back required listing every image URL used so the parent agent could audit. Result: batches 3 + 4 had 100% verified IDs across all templates.

**Going forward**: keep this as trap #11 or #12 in every brief, AND require the report-back to enumerate every URL. The audit is what makes the rule stick.

### O.6 — HTML/JSX section-count parity check

After every batch, run this one-liner to verify HTML and JSX sibling sections match 1:1:

```bash
for f in <slug-1> <slug-2> ...; do
  html_secs=$(grep -cE "^\s*<section" "web/$f.html")
  jsx_secs=$(grep -cE "<section" "web/$f.jsx")
  echo "$f: HTML=$html_secs JSX=$jsx_secs"
done
```

`<section>` opening tags only — robust to JSX vs HTML differences. Mismatch = parity broken; investigate.

In this session: 12/12 templates in batch 1+2 reported identical HTML/JSX section counts (7/7, 8/8, or 9/9). **Run this after every batch — it's the cheapest possible safety net.**

### O.7 — When the user reports "JSX isn't being converted"

Once in this session the user said "none of agents are converting to jsx" while the audit showed 100% parity. The right response is **not** to apologetically re-do the work — it's to surface evidence and ask what the user is actually seeing. The fastest evidence is:

1. HTML/JSX section count parity table (§O.6 one-liner)
2. Trap audit grep results (§O.4 four greps)
3. New-section markers grep (`grep -cE "(SectionName1|SectionName2|SectionName3)" web/*.jsx`)
4. Line counts (HTML > JSX is normal because JSX hoists `.map()` arrays — 0.6-0.8 ratio is fine)

If all four pass and the user still reports a problem, ask for a specific URL — the issue is likely a render-time runtime trap on one specific template, NOT a missing-conversion problem. **Don't perform agreement; verify and surface.**

### O.8 — The JSX-mirror task (when HTML drifted ahead of JSX)

When HTML grew (e.g., 111-isometric-grunge-brutal: HTML 544 lines, stale JSX at 190 lines), dispatch a SINGLE focused subagent with this brief shape:

1. Read CLAUDE.md + playbook line ranges (§A traps, §M.13/14, §N.8 separate-style-block, §N.10 `dangerouslySetInnerHTML` for inline rich content).
2. Read the FULL HTML.
3. Read the stale JSX (to learn the existing `customCss` shape, export structure, prior data arrays).
4. Read at least one healthy sibling JSX (e.g., `108-ethereal-fashion-noir.jsx`) for export-shape conventions.
5. Plan the data arrays needed (one per repeated structure in HTML).
6. Use `Write` to overwrite the JSX end-to-end with the mirrored content.
7. `tsc --noEmit`.

The 111 mirror caught and fixed: missing glitch keyframes the HTML referenced but never declared, swapped a `noise-bg` SVG data URL to gradient layers per the trap, added `prefers-reduced-motion` for previously-uncovered keyframes, rebuilt customCss block end-to-end. **An HTML→JSX mirror is also an opportunity to harvest accidental trap fixes — the old HTML may have shipped trap-bait that the JSX walker then breaks on.**

### O.9 — Cadence and coordination

- 6 parallel agents finish staggered over 5-12 minutes. Average ~8 minutes per agent for a fresh template (read 2 files, 5 sections, mirror, tsc).
- Parent agent SHOULD NOT touch any in-flight files — it owns no Edit lock, only updates `TaskList` status and surfaces caveats from agent reports.
- Parent agent CAN do read-only survey work meanwhile (e.g., listing untouched templates for the next batch). Do not over-spam with make-work.
- After all 6 finish, run §O.6 + §O.4 audit greps before declaring the batch done. Surface caveats (speculative IDs, novel layout coverage, etc.) to the user.

### O.10 — Insertion-point placement rule (refines §M.16 / §N.5)

When inserting 4-6 new sections into a template that already has 2-5 sections + a closing arc (FAQ → CTA → footer or pricing → footer), **insert BEFORE the closing arc, NOT after**. Inserting after pushes the existing closing into archive territory and the page reads as "we ran out of ideas at the end".

Example pattern that works: `Hero → [NEW marquee] → existing-section A → [NEW alt-rows] → existing-section B → [NEW doctrine] → [NEW cycling] → existing-section C → [NEW FAQ] → footer`. Existing material stays in editorial sequence; new material interleaves. The "new sections piled at end" smell is the user's #1 reject.

### O.11 — Mistake summary checklist (read before declaring a 6-template batch done)

Before reporting batch completion to the user:

- [ ] All 6 task statuses updated to `completed` in the TaskList.
- [ ] HTML/JSX section count parity verified per template (§O.6).
- [ ] Trap audit grep run on all 12 freshly-edited JSX files (§O.4) — 0 hits across all 4 traps.
- [ ] Image URLs in each agent's report verified against §D.1 list / aida-public — flag any speculative IDs to the user (§O.5).
- [ ] Novel-layout coverage tracked per template — at least 1 template per batch should have hit 3+ NOVEL patterns (§O.3).
- [ ] Section count delta logged in the summary table (template / before / after / HTML+JSX delta).
- [ ] Total new sections across the batch tallied (e.g., "23 new sections this batch").
- [ ] Caveats surfaced to the user (e.g., "agent admits image ID X is outside §D.1 list — spot-check").
- [ ] No commits made (CLAUDE.md rule 1-2).
- [ ] No `next build` / `next dev` invoked (CLAUDE.md rule 4-5).

---

_Last touched: 2026-05-01 (extended late session) — added §O after a 4-batch / ~26-template parallel upgrade pass. Captures the meta-process for dispatching 6 parallel subagents per batch with self-contained briefs, the 14-item NOVEL LAYOUT MENU pushed in batch 4, the §A trap inoculation pattern verified across 13 JSX files (0 trap hits), the speculative-Unsplash-IDs failure mode + fix, the HTML/JSX parity audit one-liners, the JSX-mirror task shape, and the insertion-point-before-closing-arc rule. Templates touched this session: 24, 78, 47, 11, 101, 18, 111(jsx-mirror), 76, 87, 77, 99, 19, 12, 05, 66, 79, 106, 102, 56, 37, 82 + batch 4 in flight (58, 33, 59, 71)._
