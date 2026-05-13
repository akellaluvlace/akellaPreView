# AiM Dropin — Logo design brief

Use this brief to prompt Claude's design mode (or any image-generation model) for a new logo.

## Brand

- **Name**: AiM Dropin
- **Full form**: **A**kella **i**n**M**otion **Dropin** — a paste-and-preview / template gallery for vibecoders (non-developers who paste AI-generated HTML or JSX and watch it render live).
- **Tagline**: *"Paste code. See page."* — secondary line: *"111 templates. Edit anything. Free assets."*

## Visual language (locked palette + type)

The logo must sit comfortably alongside the rest of the site, which is already shipped. Use these as hard constraints:

| Token | Value | Usage |
|---|---|---|
| `paper` | `#F5F1EA` | Body / page background — warm cream |
| `card` (slightly lighter cream) | ~`#FCFBF9` (resolves from `bg-white/70` on paper) | Navbar / footer / cards / chips / secondary buttons |
| `ink` | `#0F0F0F` | Type, borders, primary marks |
| `coral` | `#FF4D2E` | Single accent — CTAs, italic emphasis, brand pop |
| `muted` | `#8C847A` | Tertiary text, ruler / divider context |

- **Display type**: Fraunces (heavy serif with high thick/thin contrast, can be italicised). Used for headlines like *"111 templates. Edit anything. Free assets."*
- **Body / UI type**: Instrument Sans (humanist neo-grotesque).
- **Mono / chips / eyebrows**: JetBrains Mono uppercase with `tracking-[0.2em]`.
- **Overall vibe**: brutalist-editorial — sharp 2px ink borders, no rounded corners, no drop shadows, no gradients, generous whitespace, a few coral accents.

## Logo requirements

- **Symbol-led** (not a wordmark). The mark must read at **16×16 pixels** for the browser favicon.
- **Square 1:1** aspect ratio. Mark centered with breathing room.
- **Flat 2D vector** style. No gradients, no shadows, no 3D, no photorealism.
- **One coral accent maximum** — keep most of the mark ink-black on cream so it survives the favicon downscale.
- **Sharp geometric edges** — matches the existing brutalist border treatment everywhere else on the site.
- The current asset (`/public/assets/logo.png`) is a geometric wolf head. Brand continuity with a wolf is welcome but not required.

## Avoid

- Decorative flourishes (curls, stars, sparkles unless they're the entire concept).
- Gradients, drop shadows, glow effects, glassmorphism, neumorphism.
- More than two colors total (ink + optional coral accent on cream).
- Logos that depend on photographic detail (won't survive 16×16).
- Rounded corner radii > a few percent — the site is sharp-cornered.
- Sans-serif lettermarks (clashes with the Fraunces editorial language).
- Anything that screams "AI / robot / circuit board" — the brand sells the editor, not the AI.

## Five direction prompts

Drop any of these into Claude's design mode (or Midjourney / Ideogram / DALL·E). Each is self-contained — you can use just one or A/B several.

### 1 · Geometric wolf reimagined (brand continuity)

> Ultra-minimalist geometric wolf head silhouette logo, single bold black shape composed of sharp angular planes, one small coral triangle accent forming the eye, heraldic editorial brutalist style, flat 2D vector art, no gradients no shadows, cream off-white background (#F5F1EA), coral accent (#FF4D2E), recognizable at 16×16 pixels for browser favicon, square 1:1 aspect ratio, centered mark with generous breathing room, magazine masthead aesthetic, single weight, no text.

### 2 · AiM + Drop (target meets droplet) — literal name interpretation

> Minimalist logo mark combining a bullseye target and a falling water droplet, single coral droplet shape (#FF4D2E) suspended directly above three concentric black rings forming the target's center, flat 2D vector design, brutalist editorial aesthetic, cream paper background (#F5F1EA), high contrast geometric forms, no shadows no gradients, designed for 16×16 favicon legibility, square 1:1 aspect ratio, no text, bold simple silhouette, the droplet hovers in the dead center axis.

### 3 · Serif monogram "A" — fits the Fraunces editorial type

> Editorial logo monogram, stylized capital letter "A" in heavy serif typography in the style of Fraunces or Playfair Display, single solid black letterform on cream paper background (#F5F1EA), bold magazine masthead vibe, oversized contrast between thick and thin strokes, single small coral dot accent at the apex of the A (#FF4D2E), brutalist editorial design, flat 2D vector, designed for browser favicon legibility at 16×16 pixels, square 1:1 aspect ratio, no decorative flourishes, mark centered.

### 4 · Code-cursor drop — represents the product action

> Minimalist logo mark featuring a coral downward-pointing chevron cursor (#FF4D2E) descending into a pair of black angular code brackets that frame it like "< >" on either side, flat 2D vector design, brutalist editorial style, cream background (#F5F1EA), bold geometric forms, high contrast, no text, no shadows, sharp clean edges representing "drop code in", designed for legibility at 16×16 pixel browser favicon, square 1:1 aspect ratio.

### 5 · Folded-paper "D" — paper aesthetic + Dropin

> Minimalist logo of a folded sheet of paper forming a stylized capital letter "D" for Dropin, monolithic flat 2D vector design, single solid black shape with one diagonal fold-crease line picked out in coral (#FF4D2E) suggesting motion and falling, brutalist editorial aesthetic, cream paper background (#F5F1EA), highly legible at 16×16 pixel favicon size, square 1:1 aspect ratio, no text, geometric and bold, clean sharp edges, the fold implying a 3D dimensionality without using actual shading.

## Deliverable formats

When the design is picked, please export:

| File | Use |
|---|---|
| `public/assets/logo.svg` | Master vector — used inline + in the footer's `<img>` |
| `public/assets/logo.png` | 512×512 PNG fallback (transparent background) |
| `public/favicon.ico` | 16×16 + 32×32 + 48×48 multi-resolution favicon |
| `public/apple-touch-icon.png` | 180×180 PNG (transparent or cream bg) for iOS home-screen pinning |

Once the master SVG lands at `public/assets/logo.svg`, the existing watermark on the Hero (`app/page.tsx`) will pick it up automatically — it currently sources `/assets/logo.png` and applies a `filter: invert(1) brightness(1.05)` to recolor.

## Reference — existing surfaces using the logo

- Hero (watermark, faint, behind H1 + body): `app/page.tsx` — `<img src="/assets/logo.png" …>` inside the Hero column.
- Footer (left-side colophon): `app/page.tsx`'s `<Footer />` — full-size 112×112 rendering.

If the new mark introduces a wordmark variant ("AiM Dropin" as type), it can live as a separate asset (e.g. `logo-wordmark.svg`) for the footer and OG image; the mark itself is what fills the favicon slot.
