# Asset Panels Spec

## Goal

Add a complete asset library to the sidebar so vibecoders can drop images, icons, fonts, illustrations, brand logos, emoji, gradients, patterns, and color palettes into their projects without leaving the editor. Every source is free, attribution is auto-handled, and insertion uses the same cursor-position pipeline as the component library.

Editing gets dramatically easier when the user doesn't have to leave the tool to find a hero image, search for the right icon, or pick a font. Today's friction: open Unsplash in another tab, search, copy URL, paste. Tomorrow's: type "mountain" in the sidebar, click the thumbnail, image is in the code with attribution.

## What ships

Tabbed sidebar with five top-level tabs, plus expansion of existing two:

```
[ Components ] [ Generate ] [ Media ] [ Icons ] [ Style ]
```

- Components: existing Phase 1 library
- Generate: Phase 2 AI generation
- Media: photos, videos, illustrations
- Icons: 5 icon sets plus emoji
- Style: fonts, palettes, gradients, patterns, shadows

Tier 1 (Sprint 1): Unsplash, Lucide, Google Fonts, Palettes, Emoji. Highest leverage, simplest integration.

Tier 2 (Sprint 2): Heroicons, Phosphor, Tabler, Simple Icons, unDraw illustrations.

Tier 3 (Sprint 3): Pexels videos, SVG patterns, gradients library, shadow presets, mockup frames.

## Architecture overview

All assets share the same insertion contract Phase 1 established:
- Click or drag → insert at cursor position
- Attribution comment prepended to every insert
- Mode-aware (HTML vs JSX) transformation at insert time
- Recent items tracked in IndexedDB for quick re-access
- Search debounced 200ms
- Virtualized grids where item count exceeds 50

Where Phase 1 components are stored as static JSON committed to the repo, asset panels split into two categories:

**Pre-bundled assets:** Lucide icons, Heroicons, Phosphor, Tabler, Simple Icons, emoji metadata, palettes, gradient library, shadow presets, SVG patterns, unDraw illustrations. All committed to `/public/data/assets/` as static JSON. Zero runtime API dependency, works offline.

**API-fetched assets:** Unsplash photos, Pexels videos, Google Fonts. Require runtime API calls. Each gets a Next.js route handler that proxies the request (keeps API keys server-side) and adds light caching.

## Tier 1: Sprint 1 (Week 1)

### Unsplash

API: `https://api.unsplash.com/search/photos`. Free tier: 50 requests/hour for development, 5000/hour for approved production apps. Apply for production access early.

**Backend:** `app/api/assets/unsplash/route.ts`. Accepts `?q=mountain&page=1&per_page=30`. Server-side adds the API key from env. Caches identical queries for 1 hour via Vercel's data cache or in-memory LRU.

**Frontend panel:**

```
┌──────────────────────────────────────────┐
│ 🔍 mountain sunset                       │
├──────────────────────────────────────────┤
│ Orientation: [All][Landscape][Portrait]  │
├──────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐               │
│ │      │ │      │ │      │               │
│ │ img  │ │ img  │ │ img  │               │
│ └──────┘ └──────┘ └──────┘               │
│  by John   by Jane  by Sam                │
│                                           │
│  ... (infinite scroll)                    │
└──────────────────────────────────────────┘
```

Each thumbnail uses the Unsplash `thumb` URL (~200px). Click previews full-size in a modal with metadata. Drag to canvas drops at cursor. Click to insert at cursor position.

**Insertion behavior:**
- HTML mode: `<img src="https://images.unsplash.com/photo-...?w=1600&q=80" alt="{description}" />`
- JSX mode: same but with `className=""` placeholder and `alt={"..."}` 
- Resolution picker: small (640w), medium (1080w), large (1600w), original. Default medium.
- Object-fit and aspect-ratio styling: not added by default. Let the user opt in via a "wrap in figure" toggle that produces a styled `<figure>` with cover behavior.

**Attribution comment** (Unsplash license requires it):
```html
<!--
  Photo by John Doe (https://unsplash.com/@johndoe) on Unsplash
  https://unsplash.com/photos/abc123
-->
```

This is non-optional. Unsplash will revoke API access if attribution is missing and they audit. The comment makes compliance automatic.

**Track downloads** per Unsplash API requirements: hit `/photos/{id}/download` endpoint when the user inserts an image. Fire-and-forget, doesn't block insertion.

### Lucide Icons

Pre-bundled. `npm install lucide-static` gives JSON metadata plus SVG sources for all ~1500 icons. Build script extracts to `/public/data/assets/lucide.json`:

```json
[
  { "name": "arrow-right", "tags": ["forward", "next", "direction"], "categories": ["arrows"], "svg": "<svg ...>" },
  ...
]
```

**Frontend panel:**

```
┌──────────────────────────────────────────┐
│ 🔍 arrow                                 │
├──────────────────────────────────────────┤
│ Size: [16][20][24][32]  Stroke: [1.5][2] │
├──────────────────────────────────────────┤
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│ │→ │ │↓ │ │↑ │ │← │ │↗ │ │↘ │ │⤴ │      │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘        │
└──────────────────────────────────────────┘
```

Icons render as actual SVGs in the grid (cheap: SVG is small, browser handles sizing). Filter by category via pills above the search bar. Sticky size and stroke selectors apply to insertion, not preview.

**Insertion:**
- HTML mode: inline SVG with the user's chosen size and stroke applied as attributes:
  ```html
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke-width="2" ...>...</svg>
  ```
- JSX mode: import from lucide-react if available, else inline SVG. Default to inline for portability:
  ```jsx
  <ArrowRight size={24} strokeWidth={2} />
  ```
  With auto-import added at top of file: `import { ArrowRight } from 'lucide-react';`

**Auto-import logic for JSX:** scan the existing code for the import statement; if present, no-op; if absent, prepend. If multiple Lucide icons get inserted in a session, deduplicate imports.

**Recent icons** stored in IndexedDB, shown in a "Recent" section at the top of the panel (max 12).

### Google Fonts

API: `https://www.googleapis.com/webfonts/v1/webfonts`. Free, no rate limit in practice. Returns full catalog in one request (~200KB), cache aggressively.

**Backend:** `app/api/assets/google-fonts/route.ts` fetches the catalog, caches for 24h. Filters trash fonts (the API returns thousands; a curated allowlist of ~150 quality fonts trims the noise).

**Frontend panel:**

```
┌──────────────────────────────────────────┐
│ 🔍 inter                                 │
├──────────────────────────────────────────┤
│ Category: [Sans][Serif][Display][Mono]   │
├──────────────────────────────────────────┤
│ ┌────────────────────────────────────┐   │
│ │ Inter                              │   │
│ │ The quick brown fox jumps          │   │
│ └────────────────────────────────────┘   │
│ ┌────────────────────────────────────┐   │
│ │ Geist                              │   │
│ │ The quick brown fox jumps          │   │
│ └────────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

Each card renders the font live (lazy-loaded via `<link>` injection on intersection). Click expands to show all weights and a customizable preview text. Insert button asks: apply to selection, apply globally, or apply to a CSS variable.

**Insertion modes:**
- Apply globally: inject `<link>` into preview iframe head and add `body { font-family: 'Inter', sans-serif; }` at top of user's CSS
- Apply to selection: requires an element to be selected in the click-to-edit overlay; adds `font-family` to that element's inline style or scoped CSS
- Apply to CSS variable: writes `--font-sans: 'Inter', sans-serif;` to `:root` and the user can use `var(--font-sans)` anywhere

Default to global if no selection. Show a confirmation toast: "Applied Inter globally. Selecting an element first lets you apply to a single component."

**Weight picker:** by default insert all weights the font offers via `<link>`. Optimization: ask user which weights they want (toggle 400/500/600/700, or "all"). Smaller stylesheets mean faster preview.

### Palettes

Pre-bundled, hand-curated. Build a JSON file `/public/data/assets/palettes.json` with ~100 quality palettes. Sources: handpicked from Coolors trending, Adobe Color, Khroma, Dribbble color studies. Each entry:

```json
{
  "id": "warm-sunset",
  "name": "Warm Sunset",
  "tags": ["warm", "vibrant", "sunset", "orange"],
  "colors": {
    "background": "#1a0f0a",
    "foreground": "#fff5e6",
    "primary": "#ff6b35",
    "secondary": "#f7c59f",
    "accent": "#ffd23f",
    "muted": "#3a2418",
    "border": "#5c3a2a"
  }
}
```

Standard 7-token palette across all entries (background, foreground, primary, secondary, accent, muted, border) so swaps are clean.

**Frontend panel:**

```
┌──────────────────────────────────────────┐
│ 🔍 warm                                  │
├──────────────────────────────────────────┤
│ Mood: [Vibrant][Muted][Dark][Pastel]     │
├──────────────────────────────────────────┤
│ ┌────────────────────────┐               │
│ │ ▮▮▮▮▮▮▮  Warm Sunset   │               │
│ └────────────────────────┘               │
│ ┌────────────────────────┐               │
│ │ ▮▮▮▮▮▮▮  Ocean Deep    │               │
│ └────────────────────────┘               │
└──────────────────────────────────────────┘
```

Color swatches preview the palette inline. Click to apply.

**Insertion behavior:**
- Inject CSS variables into `:root`:
  ```css
  :root {
    --background: #1a0f0a;
    --foreground: #fff5e6;
    --primary: #ff6b35;
    /* ... */
  }
  ```
- If existing palette variables are present, replace them
- Show a toast: "Palette applied. Components using `var(--primary)` will update automatically."

**The trick:** for this to feel magical, Phase 1 component templates and any inserted components should already use these variable names where possible. Update the ingestion script to do a soft remap: after CSS scoping, replace common color patterns (e.g. `#3b82f6` becomes `var(--primary, #3b82f6)`) so palette swaps cascade through the document. Fallback values keep old behavior intact.

This is the "alive" feeling. User clicks a palette, the entire page recolors instantly. No editing, no hunting through CSS.

**Custom palette builder:** secondary feature, not Sprint 1. Side panel that lets users tweak palette tokens individually with a color picker, save as a custom palette to localStorage. Sprint 4-5 work.

### Emoji

Native unicode, zero API. Full emoji set (~3500 characters) committed as JSON: `/public/data/assets/emoji.json`. Source: emoji-datasource or unicode-emoji-json npm packages.

```json
{ "char": "🚀", "name": "rocket", "tags": ["space", "launch", "fast"], "category": "objects" }
```

**Frontend panel:**

```
┌──────────────────────────────────────────┐
│ 🔍 rocket                                │
├──────────────────────────────────────────┤
│ [Smileys][Animals][Food][Travel]...      │
├──────────────────────────────────────────┤
│ 😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃           │
│ 🤐 🤨 😐 😑 😶 😏 😒 🙄 😬 🤥          │
└──────────────────────────────────────────┘
```

Click inserts the unicode character at cursor. Recent emojis tracked. Skin tone modifier picker for emoji that support it. Search matches name and tags.

Tiny addition but high satisfaction: emoji tend to get used as visual anchors in marketing copy, feature icons, and section dividers. Native unicode means no SVG bloat.

## Tier 2: Sprint 2 (Week 2)

### Heroicons

Pre-bundled via `@heroicons/react`. ~300 icons in two styles (outline, solid). Same insertion contract as Lucide. Separate sub-tab in the Icons panel.

When and why over Lucide: Heroicons match shadcn/ui aesthetics specifically. Auto-suggest Heroicons when the inserted component is from shadcn registry. Otherwise default to Lucide.

### Phosphor Icons

Pre-bundled. Six weights: thin, light, regular, bold, fill, duotone. ~9000 total icons across weights.

Distinctive look, especially the duotone weight. Default weight selector at top of panel.

Implementation note: 9000 icons × 6 weights is heavy. Don't ship them all bundled. Lazy-load weight bundles on demand: only download "duotone" weight when user picks it.

### Tabler Icons

Pre-bundled. ~5800 icons, MIT, designed to match Tabler dashboard aesthetic. Useful for dashboard/admin builds. Sub-tab in Icons panel.

### Simple Icons (brand logos)

Pre-bundled. ~3000 brand logos as SVG: GitHub, Twitter, Stripe, Vercel, every major company. Free, public domain.

Underrated. Vibecoder building a "trusted by" or "integrations" section needs these constantly. Search "stripe" → drop the Stripe logo SVG with brand-correct color.

**Insertion:** SVG with the brand's official color baked in (`fill="#635BFF"` for Stripe). Toggle to insert in monochrome (`currentColor`) for use in dark sections.

**Sub-tab in the Icons panel** with its own search. Keep separate from regular icons since the use case is different (specific brand vs generic concept).

### unDraw Illustrations

Pre-bundled. ~600 SVG illustrations, customizable color. Free, open license, attribution appreciated but not required.

Use case: feature sections, empty states, hero illustrations, 404 pages. Vibecoder's site instantly looks more polished with one good illustration.

**Frontend panel:**

```
┌──────────────────────────────────────────┐
│ 🔍 team work                             │
├──────────────────────────────────────────┤
│ Color: [██] (picker)                     │
├──────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐               │
│ │      │ │      │ │      │               │
│ │ illo │ │ illo │ │ illo │               │
│ └──────┘ └──────┘ └──────┘               │
└──────────────────────────────────────────┘
```

Color picker swaps the illustration's accent color (unDraw uses `#6c63ff` as the swappable color in every SVG; replace at insert time with whatever the user picks, or default to the current palette's `--primary`).

**Insertion:** inline SVG, dimensions preserved, color tokenized. Optional wrapping in a sized container.

### Pexels photos

Secondary photo source. Same panel as Unsplash, separate tab or merged with a source toggle. Different content vibe (Pexels skews more lifestyle, Unsplash more curated/artistic). Having both means broader coverage.

API: `https://api.pexels.com/v1/search`. Free, 200 requests/hour, attribution appreciated.

Same insertion contract as Unsplash.

## Tier 3: Sprint 3 (Week 3)

### Pexels Videos

API: `https://api.pexels.com/videos/search`. Free, MP4 URLs at multiple resolutions.

Use case: hero video backgrounds. The "wow" moment when a vibecoder drops a slow-motion ocean clip into their hero and it instantly looks like a $50k landing page.

**Insertion:**
```html
<video autoplay loop muted playsinline poster="..." class="w-full h-full object-cover">
  <source src="https://videos.pexels.com/..." type="video/mp4" />
</video>
```

`autoplay loop muted playsinline` is the standard combo for autoplay-friendly hero backgrounds. `poster` set to the video's first frame for fast initial paint.

**Resolution picker:** SD (640p, fast), HD (1080p, default), 4K (2160p, large file warning).

### SVG Patterns and Backgrounds

Pre-bundled JSON of decorative SVGs:

- Hero patterns (~50 from heropatterns.com style: dots, grids, diagonal lines, hexagons)
- SVG waves (~30 from getwaves.io style: dividers between sections)
- SVG blobs (~30 from blobs.app style: organic shapes for backgrounds)
- Gradient meshes (~30 hand-picked mesh gradients as CSS)

**Frontend panel:**

```
┌──────────────────────────────────────────┐
│ [Patterns][Waves][Blobs][Gradients]      │
├──────────────────────────────────────────┤
│ Color: [██] (uses --primary by default)  │
├──────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐               │
│ │ ▦▦▦▦ │ │ ⌒⌒⌒ │ │ ◯◯◯ │              │
│ └──────┘ └──────┘ └──────┘               │
└──────────────────────────────────────────┘
```

**Insertion behavior varies by type:**
- Patterns: insert as `background-image: url('data:image/svg+xml...')` on selected element, or as a `<div>` with the pattern if no selection
- Waves: insert as `<svg>` divider element at cursor (typical between hero and next section)
- Blobs: insert as absolutely-positioned background `<svg>` with pointer-events:none
- Gradients: insert as `background: linear-gradient(...)` or radial mesh on selected element

All color-customizable, defaulting to current palette variables.

### Gradient Library

Pre-bundled. ~150 hand-picked gradients (linear and mesh). Sources: uigradients.com classics, modern mesh from Mesh Gradients, Apple-style gradients.

Stored as JSON:
```json
{ "id": "lush", "name": "Lush", "css": "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)", "tags": ["green", "nature"] }
```

**Insertion:** apply to selected element's `background` property, or insert a `<div>` with the gradient as a standalone block.

Sub-tab within the Style tab alongside Palettes.

### Shadow Presets

Pre-bundled. ~30 hand-tuned `box-shadow` values: smooth shadows (Tailwind-style), brutalist shadows (hard offset), neon shadows (colored glow), inner shadows, layered shadows.

```json
{ "id": "smooth-md", "name": "Smooth Medium", "css": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }
```

**Frontend panel:** mini cards each rendering a square with the shadow applied so the user sees what they're picking.

**Insertion:** on selected element, set `box-shadow`. Required: a click-to-edit selection. If no selection, disable insert and show "Select an element first."

### Mockup Frames

Pre-bundled. ~20 SVG/HTML mockup wrappers: browser frame (Safari, Chrome, generic), iPhone frame (multiple models), iPad frame, MacBook frame, Apple Watch frame.

Use case: vibecoder showing off their app/site in a polished way. Wrap an image or screenshot in a browser frame instantly.

**Insertion:** wraps a placeholder or selected image in the chosen frame markup. If an `<img>` is selected, wrap it in place. Else insert a complete frame with placeholder image inside.

## Layout: how all this fits in the sidebar

Tab bar at the top of the sidebar with five tabs. Each tab has its own internal navigation:

```
┌───────────────────────────────────────────────────┐
│ [ Components ] [ Generate ] [ Media ] [ Icons ] [ Style ] │
├───────────────────────────────────────────────────┤
│                                                   │
│   (tab content)                                   │
│                                                   │
└───────────────────────────────────────────────────┘
```

**Components tab:** existing Phase 1 (categories + search + grid).

**Generate tab:** existing Phase 2 (prompt input + generation history).

**Media tab:** sub-tabs for Photos (Unsplash + Pexels), Videos (Pexels), Illustrations (unDraw). Source toggle at top of Photos.

**Icons tab:** sub-tabs for Lucide, Heroicons, Phosphor, Tabler, Simple Icons (brand), Emoji.

**Style tab:** sub-tabs for Fonts, Palettes, Gradients, Patterns, Shadows.

Tabs persist via localStorage so user returns to the last-used tab on next session. Internal sub-tab choices also persist per top-level tab.

**Why five tabs and not flat:** flat would be 11+ panels, becomes overwhelming. Grouping by intent (build → fill → polish) makes mental model clean.

## Cross-cutting features

### Recent items

Every asset type tracks recent inserts in IndexedDB. Each panel shows a "Recent" row at the top (when present, max 12 items). Significantly speeds up iterative work where the user inserts the same icon multiple times.

### Drag-to-canvas

All assets support drag-to-canvas in addition to click-to-insert. Drag from sidebar tile to preview iframe; on drop, insert at the position closest to the cursor. Implementation uses HTML5 drag-and-drop with custom data payload, dispatched through the same insert pipeline.

### Attribution registry

Every inserted asset that requires attribution drops a comment into the code. To avoid scattered comments, also maintain an "Attributions" panel accessible from the editor toolbar that lists all currently-inserted attributable assets in the document. Helps users build proper credit footers if they want to clean up scattered comments later.

### Source filter persistence

Each panel remembers its last filter state. User searches "arrow" in Lucide, switches tabs, comes back: search term still there. Reset button clears it.

### Keyboard navigation

Arrow keys navigate the grid. Enter inserts the focused item. Cmd+1 through Cmd+5 jump to tabs. Cmd+F focuses search. These shortcuts unlock fast workflows for power users without needing a tour.

## API key management

Three APIs require keys: Unsplash, Pexels, Google Fonts.

Server-side env vars only. Client never sees them. All three calls go through Next.js route handlers at `/api/assets/{provider}`. Each route adds light caching (Vercel Edge cache for 1h on identical queries) to reduce upstream calls.

Env vars to add:
- `UNSPLASH_ACCESS_KEY`
- `PEXELS_API_KEY`
- `GOOGLE_FONTS_API_KEY`

Document in README and `.env.example`. Without keys, the asset panels gracefully degrade: pre-bundled assets (icons, palettes, fonts catalog cached, etc.) keep working; only Unsplash and Pexels degrade to "API not configured" empty state.

## File structure

```
public/
  data/
    assets/
      lucide.json
      heroicons.json
      phosphor.json
      tabler.json
      simple-icons.json
      emoji.json
      palettes.json
      gradients.json
      shadows.json
      patterns.json
      waves.json
      blobs.json
      undraw.json
      mockups.json

scripts/
  build-assets/
    build-lucide.mjs
    build-heroicons.mjs
    build-phosphor.mjs
    build-tabler.mjs
    build-simple-icons.mjs
    build-emoji.mjs
    build-undraw.mjs
    build-all.mjs           # runs them all, npm run build:assets

app/
  api/
    assets/
      unsplash/route.ts
      pexels-photos/route.ts
      pexels-videos/route.ts
      google-fonts/route.ts

components/
  library/
    asset-panels/
      MediaPanel.tsx
      IconsPanel.tsx
      StylePanel.tsx
      sub-panels/
        UnsplashPanel.tsx
        PexelsVideosPanel.tsx
        UndrawPanel.tsx
        LucidePanel.tsx
        HeroiconsPanel.tsx
        PhosphorPanel.tsx
        TablerPanel.tsx
        SimpleIconsPanel.tsx
        EmojiPanel.tsx
        FontsPanel.tsx
        PalettesPanel.tsx
        GradientsPanel.tsx
        PatternsPanel.tsx
        ShadowsPanel.tsx

lib/
  asset-library/
    insert-asset.ts         # routes to appropriate insert helper
    insert-image.ts
    insert-icon.ts
    insert-font.ts
    insert-palette.ts
    insert-gradient.ts
    insert-shadow.ts
    insert-pattern.ts
    insert-emoji.ts
    auto-import.ts          # JSX import management
    palette-tokenizer.ts    # color → CSS variable mapper
    recent.ts               # IndexedDB recent items
    types.ts
```

## Milestones

**Sprint 1 (Week 1):** Tier 1 ships. Unsplash + Lucide + Google Fonts + Palettes + Emoji. Tab structure exists for future tiers.

**Sprint 2 (Week 2):** Tier 2 ships. Heroicons + Phosphor + Tabler + Simple Icons + unDraw + Pexels photos. Icons tab now full.

**Sprint 3 (Week 3):** Tier 3 ships. Pexels videos + SVG patterns/waves/blobs + gradient library + shadow presets + mockup frames. Style tab now full.

**Sprint 4 (Week 4):** Polish. Custom palette builder. Drag-to-canvas. Attribution registry panel. Keyboard navigation. Recent items wired across all panels.

## Acceptance criteria

1. All five tabs visible, all sub-tabs functional
2. Unsplash search returns results in under 500ms (cache hits in under 50ms)
3. Lucide search across 1500 icons feels instant (under 16ms per keystroke)
4. Insert any icon: SVG appears at cursor in the editor, preview updates within one render frame
5. Click a palette: every component using palette CSS variables recolors instantly
6. Click a Google Font card: font loads in preview, preview re-renders with new font applied
7. Drag a Pexels video to the canvas: dropped at cursor as a `<video>` tag, autoplays in preview
8. Insert a Simple Icons brand logo: SVG inserted with brand-correct color
9. Every asset that requires attribution gets a comment block in the inserted code
10. All asset panels work offline for pre-bundled types (icons, emoji, palettes, gradients, shadows, patterns, illustrations)
11. Recent items appear at the top of each panel and persist across sessions
12. Tab choice and sub-tab choice persist via localStorage
13. JSX mode auto-imports Lucide/Heroicons/Phosphor when inserting; deduplicates across multiple inserts in the same file
14. No API key in the client bundle for any of the three keyed APIs

## Risks and mitigations

**Pre-bundled icon weight.** Phosphor's six weights × 9000 icons is large. Mitigation: lazy-load per-weight bundles only when user picks that weight. Initial bundle ships with regular weight only.

**API rate limits.** Unsplash dev key allows 50/hr. Heavy users will hit it. Mitigation: aggressive server-side cache (1h TTL on identical queries). Apply for production access (5000/hr) before public launch. Show "rate limit reached, results cached" warning when hit.

**Attribution comment noise.** Users inserting 20 Unsplash images get 20 comment blocks scattered through code. Mitigation: attribution registry panel that consolidates them into a single "credits" footer comment block on demand.

**unDraw color customization.** Some unDraw illustrations have multiple swappable colors (newer ones), some have one. Mitigation: build script tags each illustration with its color count; UI shows one or multiple color pickers accordingly.

**Google Fonts catalog noise.** API returns thousands of fonts including obscure ones. Mitigation: hand-curated allowlist of ~150 quality fonts. Allow "show all" toggle for users who want the full catalog.

**Mesh gradient browser support.** Pure CSS mesh gradients require multiple radial gradients layered. Older browsers may render fallback. Mitigation: provide a single-color fallback in the inserted CSS.

**Drag-to-canvas across iframe boundary.** Standard HTML5 drag-and-drop doesn't cross iframe boundaries cleanly without custom postMessage. Mitigation: implement the iframe drop target via postMessage protocol. Phase 1 of asset panels can ship with click-to-insert only; drag-to-canvas joins in Sprint 4.

**Search relevance for icons.** "Arrow right" should match `arrow-right` even though tags don't include the literal phrase. Mitigation: use minisearch with token matching plus tag/name fields weighted, similar to component library.

## What this unlocks

After this ships, vibecoders can build a full landing page without ever leaving the editor:

- Hero section with Unsplash photo background and Google Fonts headline
- Features section with unDraw illustrations and Lucide icons
- Trusted-by row with Simple Icons brand logos
- Testimonial cards with emoji ratings
- Pricing table with palette-coordinated colors and shadow presets
- Footer with patterns and gradient backgrounds

Total time: maybe 30 minutes. The component library gives them structure; assets give them content. Together, they're the difference between "looks like a v0 demo" and "looks like a real product."