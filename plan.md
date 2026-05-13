# Dropin: Build Spec

> **ARCHIVED 2026-05-05.** This was the original "v1 ship" spec. Phase 1–5 all shipped; current rolling status lives in `CLAUDE.md` + `memory/project_manipulation_phase1_progress.md`, and the per-area audit is in `audit-2026-05-04/`. Keep this file for historical context (it documents the original locked decisions) but DO NOT treat dependency pins, architecture, or status statements here as current — they are frozen at the v1 ship moment and have drifted.

> A website where vibecoders paste AI-generated HTML/JSX and see it render live, or pick from a gallery of ready-to-ship templates.

This document is the complete build spec. Every decision has been made. Do not ask clarifying questions about stack, design, or scope. Execute it.

---

## 1. Objective

Build a single-page Next.js site hosted on Vercel where users can:

1. **Browse a gallery** of HTML and JSX templates (landing pages, product cards, coming-soon pages, etc.), click one, see it render live in an editor.
2. **Paste their own code** in a blank playground, see it render.
3. **Edit inline** with Monaco. Preview updates live within ~250ms of typing.
4. **Copy to clipboard** or **download** the edited file. No backend, no accounts, no storage.

Target audience: people who got code from ChatGPT or Claude and have no idea what to do with it. They don't have Node installed. They have never used a terminal.

---

## 2. Stack (locked, do not deviate)

- **Framework:** Next.js 14.2.x, App Router
- **Language:** TypeScript, strict mode
- **Styling:** Tailwind 3.4.x
- **Editor:** `@monaco-editor/react` 4.6.x, lazy-loaded client-only
- **Fonts:** Google Fonts via `next/font/google`: Fraunces (display), Instrument Sans (body), JetBrains Mono (code)
- **Preview runtime:** iframe with `srcDoc`, loading React 18 + Babel standalone from unpkg
- **Tailwind in preview:** injected via `https://cdn.tailwindcss.com` into the iframe document
- **Deploy:** Vercel, zero config. `git push` is the deploy
- **No backend.** No database. No auth. No API routes. Static export is fine if easier

**Do not add:** Redux, Zustand, styled-components, Emotion, Framer Motion, tRPC, Prisma, Supabase, auth. None of it. If you think something needs one of these, re-read the spec.

---

## 3. File structure

```
dropin/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                    # Landing + gallery
│   ├── playground/
│   │   └── page.tsx                # Blank paste-your-own
│   └── t/
│       └── [slug]/
│           └── page.tsx            # Template editor
├── components/
│   ├── Editor.tsx                  # Monaco wrapper, client-only
│   ├── Preview.tsx                 # iframe + viewport toggle
│   ├── Toolbar.tsx                 # Copy, download, viewport buttons
│   ├── TemplateCard.tsx            # Gallery tile
│   └── Workspace.tsx               # Shared split-pane used by /t/[slug] and /playground
├── lib/
│   ├── templates.ts                # Filesystem-based template registry
│   └── preview.ts                  # Builds the preview HTML document
├── templates/
│   ├── hero-landing/
│   │   ├── meta.json
│   │   └── source.jsx
│   ├── product-card/
│   │   ├── meta.json
│   │   └── source.jsx
│   └── coming-soon/
│       ├── meta.json
│       └── source.html
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── README.md
```

---

## 4. Dependencies

```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.11",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3"
  }
}
```

---

## 5. Design system

Aesthetic: **editorial brutalist**. Think independent magazine, not SaaS dashboard. Warm paper background, heavy black borders, single coral accent, serif display font paired with mono labels.

### Palette (Tailwind config)

```ts
colors: {
  paper:  "#F5F1EA",  // warm cream background
  ink:    "#0F0F0F",  // near-black for type and borders
  coral:  "#FF4D2E",  // the one accent. Use sparingly.
  muted:  "#8C847A",  // subdued text
  soft:   "#EDE6D9",  // slightly darker than paper for panels
  card:   "#FFFFFF",  // pure white for cards and iframe backdrop
}
```

### Typography

- **Display:** Fraunces (variable, with `opsz`, `SOFT`, `WONK` axes). Used for hero, template titles, section headers.
- **Body:** Instrument Sans. Used for paragraphs and UI labels.
- **Mono:** JetBrains Mono. Used for code, small caps labels, chips, technical metadata.

Load all three via `next/font/google` with CSS variables `--font-fraunces`, `--font-instrument`, `--font-jetbrains`. Apply to `<html>` element in `layout.tsx`.

Custom font sizes:

```ts
fontSize: {
  "display-xl": ["clamp(3rem, 8vw, 7rem)",  { lineHeight: "0.95", letterSpacing: "-0.03em" }],
  "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1",    letterSpacing: "-0.025em" }],
}
```

### Reusable Tailwind component classes

Defined in `app/globals.css` under `@layer components` or as plain CSS classes after `@tailwind` directives:

```css
.chip {
  @apply inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase
         tracking-[0.15em] border border-ink bg-paper;
}
.chip-accent { @apply bg-coral text-paper border-coral; }

.btn {
  @apply inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-xs
         uppercase tracking-[0.15em] border-2 border-ink bg-paper transition-colors
         hover:bg-ink hover:text-paper;
}
.btn-accent { @apply bg-coral text-paper border-ink hover:bg-ink hover:text-coral; }

.card { @apply bg-card border-2 border-ink; }

.link-thick {
  @apply relative no-underline after:content-[''] after:absolute after:left-0
         after:right-0 after:-bottom-0.5 after:h-[3px] after:bg-ink;
}
```

### Global styles (required details)

- Body background: `#F5F1EA` plus a subtle dot grain: `radial-gradient(circle at 1px 1px, rgba(15,15,15,0.025) 1px, transparent 0); background-size: 3px 3px;`
- `::selection { background: #FF4D2E; color: #F5F1EA; }`
- Custom scrollbar: 10px width, soft track, ink thumb with 2px soft border
- `color-scheme: light` on `:root`

---

## 6. `lib/preview.ts` (critical: the preview runtime)

This file generates the full HTML document that gets injected into the preview iframe via `srcDoc`. It handles both HTML and JSX.

### Signature

```ts
export type PreviewKind = "jsx" | "html";

export function buildPreviewDocument(opts: {
  code: string;
  kind: PreviewKind;
  withTailwind?: boolean; // default true
}): string;
```

### HTML mode logic

If `kind === "html"` and Tailwind CDN is not already in the code, inject `<script src="https://cdn.tailwindcss.com"></script>` into `<head>`. If there is no `<head>`, wrap the code in a full document that includes the CDN script. If Tailwind is already present, return the code unchanged.

### JSX mode logic

Return a full HTML document that:

1. Loads Tailwind CDN, React 18 UMD production, ReactDOM 18 UMD production, Babel standalone (all from `unpkg.com`)
2. Has a `<div id="root">` and a fixed-bottom error console (`#__err`) styled in coral on ink
3. Runs inline JS that:
   - Takes the user's code (injected via `JSON.stringify` so string escaping Just Works)
   - Strips `import` statements (line regex): `/^\s*import\s+[^;]+;?\s*$/gm` → ``
   - Replaces the first `export default` with `return`: `/export\s+default\s+/` → `return `
   - Strips remaining `export` keywords: `/^\s*export\s+/gm` → ``
   - Wraps in an IIFE: `(function() { ...stripped... })()`
   - Runs `Babel.transform(wrapped, { presets: ['react'], filename: 'preview.jsx' }).code`
   - Executes via `new Function('React', 'ReactDOM', 'return ' + compiled)(React, ReactDOM)` to get the component back
   - Renders with `ReactDOM.createRoot(mount).render(React.createElement(Component))`
   - Catches any error and shows it in `#__err`

### Why this shape

- iframe isolation means template Tailwind/CSS can't leak into the host app
- `srcDoc` (not `src`) avoids needing a separate route to serve previews
- Babel in-browser means zero build step per template
- `JSON.stringify` on the user code handles every escape case correctly; do not try to manually escape backticks, quotes, or `</script>`
- Error UI pinned to bottom of iframe so user sees the page and the error simultaneously

### Error console styles (required)

```css
#__err {
  position: fixed; left: 0; right: 0; bottom: 0;
  background: #0F0F0F; color: #FF4D2E;
  font-family: 'JetBrains Mono', Menlo, monospace;
  font-size: 12px; line-height: 1.55;
  padding: 14px 18px; white-space: pre-wrap;
  border-top: 3px solid #FF4D2E; max-height: 40vh; overflow: auto;
  display: none; z-index: 99999;
}
#__err.visible { display: block; }
```

---

## 7. `lib/templates.ts`

Server-only (uses Node `fs`). Do not import from client components.

### Types

```ts
export type TemplateKind = "jsx" | "html";

export interface TemplateMeta {
  title: string;
  description: string;
  category: string;
  tags: string[];
  kind: TemplateKind;
  author?: string;
}

export interface Template extends TemplateMeta {
  slug: string;
  source: string; // the raw file contents
}
```

### Functions

- `getAllTemplates(): Promise<Template[]>` — reads `templates/` directory, loads each subfolder's `meta.json` and either `source.jsx` or `source.html` (based on `meta.kind`), returns the list. Silently skip folders that fail to parse.
- `getTemplate(slug: string): Promise<Template | null>` — same logic for a single slug
- `getCategories(): Promise<string[]>` — unique sorted categories from all templates

Use `fs/promises.readdir` and `readFile` with `utf-8` encoding. Base path: `path.join(process.cwd(), "templates")`.

---

## 8. Components

### 8.1 `<Editor>` (`components/Editor.tsx`)

**`"use client"`**. Monaco wrapper.

Props:
```ts
{
  value: string;
  onChange: (v: string) => void;
  language: "javascript" | "typescript" | "html";
}
```

On mount, define a custom theme `"dropin-paper"`:

```ts
{
  base: "vs",
  inherit: true,
  rules: [
    { token: "comment",         foreground: "8C847A", fontStyle: "italic" },
    { token: "keyword",         foreground: "FF4D2E", fontStyle: "bold"   },
    { token: "string",          foreground: "0F0F0F"                       },
    { token: "number",          foreground: "FF4D2E"                       },
    { token: "tag",             foreground: "0F0F0F", fontStyle: "bold"   },
    { token: "attribute.name",  foreground: "8C847A"                       },
    { token: "attribute.value", foreground: "0F0F0F"                       }
  ],
  colors: {
    "editor.background":            "#F5F1EA",
    "editor.foreground":            "#0F0F0F",
    "editorLineNumber.foreground":  "#C6BFB0",
    "editorLineNumber.activeForeground": "#0F0F0F",
    "editor.selectionBackground":   "#FF4D2E40",
    "editor.lineHighlightBackground":"#EDE6D9",
    "editorCursor.foreground":      "#FF4D2E",
    "editorIndentGuide.background1":"#E5DECF"
  }
}
```

Editor options: `fontFamily: "'JetBrains Mono', Menlo, monospace"`, `fontSize: 13`, `lineHeight: 1.7`, padding top/bottom 20, `minimap: { enabled: false }`, `scrollBeyondLastLine: false`, `wordWrap: "on"`, `automaticLayout: true`.

Height: `100%`.

### 8.2 `<Preview>` (`components/Preview.tsx`)

**`"use client"`**. Renders the iframe.

Props:
```ts
{
  code: string;
  kind: PreviewKind;
  viewport: "desktop" | "tablet" | "mobile";
}
```

Behavior:
- Debounce `code`/`kind` changes by **250ms**, then regenerate `srcDoc` via `buildPreviewDocument`
- Viewport widths: desktop `100%`, tablet `768px`, mobile `390px`
- Iframe wrapper: white card, 2px ink border, 6px offset ink drop shadow (`shadow-[6px_6px_0_0_#0F0F0F]`), transitions width change with `300ms ease-out`
- Iframe `sandbox="allow-scripts allow-same-origin allow-popups allow-forms"`
- Container: `bg-soft`, padded, scroll on overflow

### 8.3 `<Toolbar>` (`components/Toolbar.tsx`)

**`"use client"`**. Top action bar inside the Workspace.

Props:
```ts
{
  code: string;
  kind: PreviewKind;
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  filename?: string;
}
```

Layout:
- Left: kind chip (`JSX` in coral, `HTML` in paper-black), filename in mono muted
- Right: viewport toggle group (Desktop / Tablet / Mobile as connected buttons with ink dividers), Copy button, Download button (coral accent)

Copy: `navigator.clipboard.writeText(code)`. On success, change label to "Copied" for 1.8s.

Download: create `Blob`, URL, anchor, click, revoke. Filename: `${filename || "dropin"}.${kind === "html" ? "html" : "jsx"}`.

### 8.4 `<TemplateCard>` (`components/TemplateCard.tsx`)

Server component (or plain functional component, no client state needed).

Props:
```ts
{ template: Template; index: number }
```

Behavior:
- Links to `/t/${template.slug}` via `next/link`
- Card has 2px ink border, hover adds `10px 10px 0 0 #FF4D2E` shadow
- Hover rotation variants cycled by index mod 4: `-rotate-1`, `rotate-1`, `-rotate-1`, `rotate-0`, combined with `-translate-y-1` or `-translate-y-2`
- Top: 4:3 aspect placeholder with template title in large serif, kind chip top-left, `№ 001` counter bottom-right
- Bottom: category in mono caps, title in display serif, description in 2-line clamp

### 8.5 `<Workspace>` (`components/Workspace.tsx`)

**`"use client"`**. Shared split-pane layout.

Props:
```ts
{
  initialCode: string;
  initialKind: PreviewKind;
  filename?: string;
  allowKindToggle?: boolean;  // true on playground, false on template pages
  title?: string;
  subtitle?: string;
}
```

Layout:
- Top header (shrink-0): back-to-home link, title/subtitle, optional JSX/HTML kind toggle (playground only)
- Below header: `<Toolbar>` (the action bar)
- Main area: 2-column grid, `md:grid-cols-2`, 1-column on mobile
  - Left: `<Editor>` with `border-r-2 border-ink`
  - Right: `<Preview>`

Monaco import: use `dynamic(() => import("./Editor"), { ssr: false, loading: <spinner> })`. Do not import statically — it breaks SSR.

Total layout is `flex flex-col h-screen`, grid section is `flex-1 min-h-0` to make the editor fill available space correctly.

---

## 9. Pages

### 9.1 `/` (`app/page.tsx`)

Server component. Calls `getAllTemplates()` and `getCategories()`.

Sections top to bottom:

1. **Masthead** (`border-b-2 border-ink`): "Dropin" wordmark in Fraunces, volume chip ("Vol. 01 · April 2026"), nav links (Playground, Gallery), coral CTA button linking to `/playground`
2. **Hero** (`border-b-2 border-ink`): 12-col grid. Left 8 cols: chip row (Live preview, Zero install, HTML · JSX), giant `display-xl` headline ("Paste code. / See page." with "See page." italic coral), description paragraph, two buttons (coral "Open playground" → `/playground`, outline "Browse N templates" → `#gallery`). Right 4 cols (with `lg:border-l-2 lg:border-ink`): "How it works" label, numbered 3-step ordered list with huge coral numerals (01, 02, 03)
3. **Category strip** (`bg-soft border-b-2 border-ink`): "Sections:" label then horizontal list of chips (one per category), scroll-x overflow
4. **Gallery** (`id="gallery"`, `border-b-2 border-ink`): "The Gallery" label, "Ready-to-ship pages" `display-lg` heading, count on right (`N pieces`), then 3-col grid (1 on mobile, 2 on tablet) of `<TemplateCard>`. Empty state if zero templates
5. **Footer**: copyright left, nav links right, all in mono caps

Max width for all sections: `max-w-[1400px] mx-auto px-6 lg:px-10`.

### 9.2 `/t/[slug]` (`app/t/[slug]/page.tsx`)

Server component. Implements `generateStaticParams` from `getAllTemplates()` so Vercel prerenders every template route.

Loads template via `getTemplate(params.slug)`. If null, call `notFound()`.

Renders `<Workspace>` with the template's source, kind, slug as filename, title, and category as subtitle. `allowKindToggle` is false.

### 9.3 `/playground` (`app/playground/page.tsx`)

Server component. Renders `<Workspace>` with a starter JSX snippet (a centered hero saying "Paste your code here"), filename `"playground"`, title "Playground", subtitle "Paste anything · JSX or HTML", `allowKindToggle: true`.

---

## 10. Template contract

Every template is a folder under `/templates/`. The folder name is the slug.

Required files:
- `meta.json` — metadata
- `source.jsx` **or** `source.html` — the actual template (matches `kind` in meta)

### meta.json schema

```json
{
  "title": "Hero Landing",
  "description": "Short marketing blurb shown on the card, under 140 chars.",
  "category": "Landing",
  "tags": ["saas", "hero", "features"],
  "kind": "jsx"
}
```

Valid categories (use these, do not invent): `Landing`, `Ecommerce`, `Portfolio`, `Marketing`, `Utility`, `Dashboard`, `Blog`.

### source.jsx contract

Must have exactly one `export default` that is a React functional component. Can use React hooks (React is loaded globally in the preview). Can use Tailwind classes freely.

**Cannot use:**
- `import` statements from npm packages (they get stripped in preview)
- External CSS files
- Images from local paths (use absolute URLs to unsplash, etc.)

### source.html contract

Standalone HTML document or fragment. If Tailwind classes are used, the preview builder will inject the CDN automatically. Can include `<style>` and `<script>` tags.

---

## 11. Seed templates (build these three)

### 11.1 `templates/hero-landing/`

- `meta.json`: title "Hero Landing", description "SaaS landing with gradient hero, feature grid, and CTA.", category "Landing", tags `["saas", "hero", "features"]`, kind "jsx"
- `source.jsx`: nav bar with wordmark and Start free button, gradient hero section (`bg-gradient-to-br from-orange-50 via-white to-blue-50`) with version pill, huge tracking-tight headline, description, primary + ghost CTAs, 3-col feature grid below, all in Tailwind. Single default export component, no imports

### 11.2 `templates/product-card/`

- `meta.json`: title "Product Card", description "Clean ecommerce product detail with image, variants, and add-to-cart.", category "Ecommerce", tags `["product", "shop", "card"]`, kind "jsx"
- `source.jsx`: 2-column split. Left: square product image from Unsplash. Right: brand caption, product title, price, rating stars, short description, color swatches, size buttons, Add to Cart button. Tailwind only

### 11.3 `templates/coming-soon/`

- `meta.json`: title "Coming Soon", description "Minimalist pre-launch page with email capture and countdown.", category "Marketing", tags `["launch", "email", "countdown"]`, kind "html"
- `source.html`: full HTML document, dark theme, centered logo, large headline, email input with subscribe button, countdown timer in JS (`setInterval` to a hardcoded target date 30 days from now). Tailwind will be auto-injected

---

## 12. Build and deploy

### Local dev

```
npm install
npm run dev
```

Open `http://localhost:3000`.

### Production build

```
npm run build
npm start
```

### Vercel deploy

```
git init
git add .
git commit -m "initial"
# Push to a GitHub repo
# In Vercel dashboard: Import Project → select repo → deploy
```

Zero config. Next.js is detected automatically. Templates are bundled at build time because `getAllTemplates` runs at build in Server Components.

---

## 13. Acceptance criteria

The build is done when all of these pass:

1. `npm run build` completes with zero errors and zero warnings
2. Landing page loads at `/` and shows all seed templates in a 3-col grid on desktop
3. Clicking any template card navigates to `/t/[slug]` and the preview renders the template correctly within 1 second of page load
4. Typing into the editor updates the preview within 500ms (250ms debounce + paint)
5. A syntax error in JSX shows the error in the coral bottom console in the preview, without breaking the editor
6. Viewport toggle visually shrinks/expands the preview (check at 390px / 768px / 100%)
7. Copy button copies current editor content to clipboard, shows "Copied" confirmation for 1.8s
8. Download button downloads `${filename}.jsx` (or `.html`) containing the current editor content
9. Playground `/playground` loads with a starter JSX snippet, user can switch between JSX and HTML mode via the kind toggle
10. Mobile layout: gallery is 1 column, workspace stacks editor above preview
11. Tailwind classes used in a template render correctly inside the preview iframe (proves CDN injection works)
12. No console errors in the browser on any of the three page types
13. Lighthouse Performance score ≥ 85 on the landing page

---

## 14. Non-goals (do not build these)

- User accounts, auth, login
- Saved edits or history
- Shareable preview URLs (user edits do not persist on refresh)
- Template search or tag filtering (not needed under 20 templates)
- Screenshot generation for thumbnails (placeholders are fine)
- A CMS or template upload UI (templates live in the repo)
- A backend of any kind
- Analytics (can add Vercel Analytics later if wanted, but not in MVP)
- SEO-heavy metadata per template (generic metadata on all pages is fine)
- Import resolution for `import { x } from "npm-package"` in templates (strip and move on)

---

## 15. Known gotchas

Things that will bite if you don't handle them explicitly.

1. **Monaco breaks SSR.** Always import via `dynamic(() => import("./Editor"), { ssr: false })`. Never statically import Monaco in a Server Component or in a Client Component that's rendered on the server.

2. **`JSON.stringify` the user code when embedding it into the preview document.** Do not use template literals or manual escaping. This is the only way to safely pass code containing backticks, dollar-braces, quotes, `</script>`, etc.

3. **Tailwind in the host app does not see classes used inside templates.** That's fine — templates run in an iframe with their own Tailwind CDN. Do not add `templates/**/*` to the host `tailwind.config.ts` `content` array, you will just slow down the build.

4. **Server Components cannot import client-only libs.** `templates.ts` uses `fs` and must only be called from Server Components. `Editor.tsx`, `Preview.tsx`, `Toolbar.tsx`, `Workspace.tsx` are all `"use client"`.

5. **`generateStaticParams` must be exported from `/t/[slug]/page.tsx`** for template routes to prerender. Otherwise they become on-demand dynamic routes, which works but is slower.

6. **Iframe `srcDoc` re-renders on every change.** Debounce the update (250ms) or typing feels laggy. Do not use `postMessage` for incremental updates — `srcDoc` reset is simpler and fast enough.

7. **Monaco theme must be defined before `setTheme` is called.** Define in the `onMount` callback, not at module load. The monaco instance is only available inside `onMount`.

8. **React 18 UMD expects `React.createElement`, not JSX.** That's why the preview script uses `React.createElement(Component)` after Babel compiles the template.

9. **Babel standalone is ~3MB.** Loading from unpkg on every preview is fine for MVP. If the site gets popular, self-host it from `/public`.

10. **Viewport toggle with iframe:** changing width via inline style on the wrapper is correct. Do not try to change the iframe's `width` attribute directly — CSS transitions won't work.

11. **The `export default` → `return` regex only replaces the first occurrence.** That's intentional. If a template has multiple `export default` statements, it's malformed anyway.

12. **`sandbox="allow-scripts allow-same-origin"` is required** for React to run in the iframe. Without `allow-same-origin`, React's development mode throws. Without `allow-scripts`, nothing runs at all.

---

## 16. Build order for Claude Code

Execute in this order to avoid import errors and let each layer be testable:

1. Scaffold: `package.json`, `tsconfig.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.ts`
2. `app/globals.css` with palette and component classes
3. `app/layout.tsx` with fonts
4. `lib/templates.ts`
5. `lib/preview.ts`
6. Seed templates in `templates/` (three folders)
7. `components/Editor.tsx`
8. `components/Preview.tsx`
9. `components/Toolbar.tsx`
10. `components/TemplateCard.tsx`
11. `components/Workspace.tsx`
12. `app/page.tsx` (landing + gallery)
13. `app/playground/page.tsx`
14. `app/t/[slug]/page.tsx`
15. `README.md` with dev and deploy instructions
16. Run `npm install && npm run build` and fix any compilation errors before declaring done

After each file, verify it typechecks. Run `npx tsc --noEmit` if in doubt.

---

## 17. README contents

At the end, create `README.md` with:

- One-paragraph product description
- "Run locally" section: `npm install`, `npm run dev`
- "Add a template" section: create `templates/[slug]/` with `meta.json` and `source.jsx` or `source.html`, referencing the schema in Section 10
- "Deploy" section: push to GitHub, import in Vercel, done
- "Stack" section: one-liner per major dep

Keep it short. The spec is for Claude Code; the README is for humans who clone the repo later.