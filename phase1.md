# Phase 1: Component Library Integration

> **ARCHIVED 2026-05-05.** Phase 1 shipped a long time ago (component library + ingest). Kept for historical context only. Current rolling status: `CLAUDE.md` + `memory/project_manipulation_phase1_progress.md`. Do not treat any "still TODO" markers in this file as current — they're all addressed.

## Goal

Add a sidebar component gallery that lets users browse, preview, and insert UI components from Uiverse and HyperUI directly into the HTML/JSX editor, with live preview updating on insert. No AI generation, no React-specific sources, no auth, no backend. Ship in roughly two days.

## Why these two sources first

**Uiverse** gives breadth: 4000+ pure HTML/CSS components, MIT licensed, already structured in a public GitHub repo (uiverse-io/galaxy). No scraping, no dependency resolution, no Tailwind required.

**HyperUI** gives practical, modern Tailwind components (marketing blocks, application UI, forms). Also open source, also MIT, well-organized, and renders in the preview iframe as long as Tailwind CDN is available.

Between them: ~80% of what users reach for (buttons, cards, loaders, inputs, forms, navbars, tooltips, pricing blocks, hero sections) is covered with zero runtime dependencies beyond optional Tailwind.

## Scope

**In scope:**
- Local ingestion script that pulls Uiverse galaxy and HyperUI repos, pre-processes each component, writes static JSON artifacts into `/public/data/components/`, and renders thumbnails into `/public/component-thumbs/`
- All artifacts committed to the repo — build is deterministic, no runtime GitHub/CDN fetches
- Client-side search via minisearch over a pre-built index
- Sidebar panel in the workspace editor (`/playground` + `/t/[slug]`): search, category pills, source filter, grid
- Click-to-insert at cursor with correct CSS + HTML placement
- Attribution footer in inserted code (comment block with author + source URL + license)
- Static WebP thumbnails in the gallery grid (no live iframes)

**Out of scope (defer to Phase 2+):**
- Supabase / any backend database
- AI generation (Claude API endpoint)
- shadcn registry protocol
- React component libraries (Aceternity, Magic UI, React Bits)
- User favorites, collections, private uploads
- Server-side rendering or SSR preview

## Architecture

```
┌──────────────────┐     ┌────────────────────────┐     ┌──────────────────┐
│ Ingestion Script │────▶│ /public/data/components│◀────│ Editor Frontend  │
│ (Node, one-shot) │     │  - index.json          │     │ - Sidebar panel  │
│                  │     │  - search.json         │     │ - Monaco ref     │
│                  │     │  - {slug}.json         │     │ - Preview iframe │
└──────────────────┘     │ /public/component-thumbs│     └──────────────────┘
        │                │  - {slug}.webp         │
        │                └────────────────────────┘
        ├── git clone uiverse-io/galaxy  (shallow)
        └── git clone markmead/hyperui   (shallow)
```

Frontend loads static JSON from its own origin. No backend API, no network calls off the critical path. Ingestion is a local Node script; its output is committed. Re-run `npm run ingest` when you want to pull new components from upstream.

## Data artifacts

Everything the client needs sits in `/public/data/components/` and `/public/component-thumbs/`, all committed to the repo.

### `/public/data/components/index.json`

Lightweight metadata only — loaded up-front on first sidebar open. Target size ~500KB for ~4000 components (well within browser cache budgets).

```ts
type ComponentIndex = {
  components: ComponentMeta[];
  generatedAt: string;         // ISO timestamp for cache busting
  sources: Record<string, number>;  // e.g. { uiverse: 3200, hyperui: 342 }
  categories: string[];         // full taxonomy present in the data
};

type ComponentMeta = {
  id: string;                   // stable short id (hash of slug)
  slug: string;                 // e.g. "uiverse-buttons-gradient-pulse-42"
  title: string;                // e.g. "Gradient Pulse" or "Pricing Card: With Icon"
  category: string;             // one of the fixed taxonomy list (below)
  source: string;               // free-form string; "uiverse" | "hyperui" in Phase 1
  tags: string[];
  author: string | null;
  authorUrl: string | null;
  sourceUrl: string;            // back to the original on uiverse.io / hyperui.dev
  license: string;              // typically "MIT"
  tailwindRequired: boolean;    // informational only (Phase 2 filtering)
  thumbUrl: string;             // "/component-thumbs/{slug}.webp"
  hasCss: boolean;              // false for HyperUI, true for most Uiverse
};
```

### `/public/data/components/{slug}.json`

Full code per component. Lazy-loaded on detail view open or insert — never on list mount.

```ts
type ComponentFull = ComponentMeta & {
  html: string;                 // raw component HTML (unscoped)
  css: string | null;           // CSS pre-scoped with __UIV_SCOPE__ placeholder
};
```

### `/public/data/components/search.json`

Pre-built minisearch index, lazy-loaded on first sidebar open. Target size ~200-400KB.

Indexed fields + weights:
- `title` — 10
- `tags` — 5
- `category` — 2

**Intentionally not indexed:** `html`, `css`, `description`. CSS text is noise ("every component with `#8B5CF6` matches 'purple'"). Author-declared tags are the authoritative signal.

### `/public/component-thumbs/{slug}.webp`

Static WebP thumbnails at 400×300, generated at ingest time via the existing puppeteer pipeline (same code path as the gallery template thumbs). One strict upgrade over the original spec's live-iframe previews: better perf, fewer moving parts, fewer bundle costs, and it's already built.

## Category taxonomy

Fixed set, normalized during ingestion. Anything that doesn't map cleanly goes to `other`; review top ~50 `other` entries manually after first ingest and extend the mapping in `categorize.ts`.

```
buttons, cards, loaders, inputs, checkboxes, switches, radios,
forms, navbars, tooltips, dropdowns, modals, alerts, badges,
avatars, tabs, accordions, tables, pricing, heroes, footers,
progress, other
```

## Slug format

`{source}-{category}-{original-id-or-slug}` for single-variant components:
- `uiverse-buttons-gradient-pulse-42`
- `hyperui-cards-pricing-basic`

For HyperUI components with multiple variants (which is most of them — "Basic", "With Icon", "Dark Mode", etc.), each variant ingests as its own record:
- Preferred: `hyperui-{category}-{name}-{slugified-variant-label}` (e.g. `hyperui-cards-pricing-with-icon`)
- Fallback when no label: `hyperui-{category}-{name}-{variant-index}` (e.g. `hyperui-cards-pricing-2`)

Variant label goes into `title` too, so the gallery shows "Pricing Card: With Icon" not "Pricing Card (2)".

## CSS scoping strategy

Pre-scope at ingest time using PostCSS (Node-side) with a placeholder prefix; replace the placeholder at runtime with a per-insert id. This avoids shipping PostCSS to the browser while handling complex selectors correctly.

### Ingest time (Node)

Run every Uiverse component's CSS through `postcss` + `postcss-prefix-selector` with the prefix `__UIV_SCOPE__`:

```css
/* input */
.btn { color: red; }
.btn:hover:has(.icon) { transform: scale(1.05); }

/* output */
.__UIV_SCOPE__ .btn { color: red; }
.__UIV_SCOPE__ .btn:hover:has(.icon) { transform: scale(1.05); }
```

PostCSS handles `:has`, `:is`, `:where`, nested rules, at-rules, and keyframe names correctly. Zero client-side PostCSS bundle.

### Insert time (browser)

```ts
const scope = `ak-${crypto.randomUUID().slice(0, 8)}`;
const scopedCss = full.css.replace(/__UIV_SCOPE__/g, scope);
const wrappedHtml = `<div class="${scope}">\n${full.html}\n</div>`;
```

Two inserts of the same Uiverse component produce two different scopes; their styles never collide.

HyperUI components skip scoping entirely — their Tailwind utility classes are already composable and global-safe by design.

## Attribution comment

Prepended to every insert, regardless of source:

```html
<!--
  Component: {title}
  Source:    {sourceUrl}
  Author:    {author} ({license})
  Tailwind:  always available in the Dropin preview iframe
-->
```

Ensures license compliance automatic. The Tailwind note means users don't wonder why their inserted HyperUI component works without doing anything — our preview iframe auto-injects Tailwind CDN already (`lib/preview.ts`), so every insert has Tailwind for free.

## Ingestion pipeline

Single entry point: `scripts/ingest-components.ts`. Run via `npm run ingest`. Env: none required (read-only git clones). Output: all artifacts under `/public/data/components/` and `/public/component-thumbs/`. Commit the result.

### Uiverse

- Repo: `https://github.com/uiverse-io/galaxy`
- Structure:
  ```
  galaxy/src/{author-slug}/{component-slug}/
    index.html
    index.css
    meta.json      # { username, tags, theme, ... }
  ```

Script steps:
1. `git clone --depth 1 https://github.com/uiverse-io/galaxy /tmp/uiverse` (reuse cache if present; `git pull` instead when dir exists)
2. Walk `src/*/*/meta.json`
3. For each component:
   - Read `index.html`, `index.css`, `meta.json`
   - Categorize: first tag that matches the taxonomy wins (see `categorize.ts`); default to `other`
   - Scope CSS with PostCSS → `__UIV_SCOPE__`
   - Build `ComponentMeta` + `ComponentFull` records
   - Queue thumbnail render

### HyperUI

- Repo: `https://github.com/markmead/hyperui`
- Structure:
  ```
  hyperui/src/data/components/{application-ui|marketing|ecommerce}/{category}/{component}.mdx
  ```

Each MDX has frontmatter (title, tags, etc.) and **one or more** fenced code blocks, often labelled with variant names ("Basic", "With Icon", "Dark Mode").

Script steps:
1. `git clone --depth 1 https://github.com/markmead/hyperui /tmp/hyperui`
2. Walk `src/data/components/**/*.mdx`
3. Parse frontmatter with `gray-matter`
4. Extract **every** fenced `html`/`jsx` code block as a separate record (see slug convention above)
5. `tailwindRequired: true`, `css: null` for every record
6. Queue thumbnail render

### Thumbnail generation

Generalize `scripts/gen-thumbs.mjs` (already used for `/web` templates at `scripts/gen-thumbs.mjs`) to handle component-sized HTML fragments:

1. Render each component into a centered wrapper inside a blank page:
   ```html
   <!doctype html><html><head>
     <script src="https://cdn.tailwindcss.com"></script>
     <style>{component css if any}</style>
   </head><body>
     <div style="display:grid;place-items:center;padding:40px;min-height:320px">
       {component html, with __UIV_SCOPE__ replaced by a throwaway "thumb" class}
     </div>
   </body></html>
   ```
2. Headless Chromium → `networkidle2` → 700ms settle
3. Screenshot clipped to 400×300, WebP quality 78
4. Write to `/public/component-thumbs/{slug}.webp`

Incremental: skip when `thumbs/{slug}.webp` mtime is newer than the source record (same pattern as `gen-thumbs.mjs` today). `protocolTimeout: 120000` at launch to handle heavy pages.

### Index + search build

After all components are processed:
- Write `index.json` (metadata array)
- Build minisearch index over title/tags/category with weights 10/5/2, write `search.json`
- Write each `{slug}.json` (full record)

## Frontend: sidebar panel

### Placement

Right-side collapsible panel inside `components/Workspace.tsx`. Lives in the workspace routes only (`/playground` + `/t/[slug]`). **Not** rendered on `/gallery` or `/`. FocusEditor and DiceBar stay as-is; the sidebar is a third permanent affordance alongside them.

Dimensions: 360px wide when expanded, 40px icon strip when collapsed. Toggle: keyboard shortcut (`Cmd+J`) + a button in the workspace chrome.

### Layout

```
┌─────────────────────────────┐
│ Components            [ × ] │  header
├─────────────────────────────┤
│ 🔍 Search...                │  minisearch-backed
├─────────────────────────────┤
│ [ All ][ Uiverse ][HyperUI] │  source filter
├─────────────────────────────┤
│ Buttons  Cards  Loaders ... │  category pills (horizontal scroll)
├─────────────────────────────┤
│ ┌─────────┐ ┌─────────┐     │
│ │  thumb  │ │  thumb  │     │  static <img> from /component-thumbs/
│ │   .webp │ │   .webp │     │
│ └─────────┘ └─────────┘     │
│    title       title        │
│    author      author       │
│                             │
│   [ + Insert ][ View ]      │
└─────────────────────────────┘
```

### State

```ts
type SidebarState = {
  query: string;                    // debounced 200ms through useDeferredValue
  activeCategory: string | null;
  activeSource: "all" | "uiverse" | "hyperui";
  selected: string | null;          // slug of detail-view component
  pageSize: number;                 // 50; bumps on "Load more" click
};
```

### Client data flow

1. **First sidebar open** — fetch `index.json` + `search.json` in parallel, memoize for the session
2. **Filter/search** — runs entirely client-side:
   - Source filter: `components.filter(c => c.source === activeSource)`
   - Category filter: `.filter(c => c.category === activeCategory)`
   - Search: `minisearch.search(query, { boost: { title: 10, tags: 5, category: 2 } })` → intersect with filtered set
3. **Load `{slug}.json`** — lazy, only when user opens detail view OR clicks Insert (cache in a `Map<slug, ComponentFull>` for the session)

No network calls after the initial two-file fetch until a user inserts or inspects.

### Detail view

Click a card to open a modal (centered over the workspace): full-size preview (static thumbnail + "Live render" button that renders in a sandboxed iframe on demand), HTML tab, CSS tab (if any), "Insert" primary button, attribution with external link to the original source.

Phase 1 intentionally ships without a live iframe preview in the grid. Detail view optionally renders one on demand.

## Insert mechanism

Every insert is composed in this order:

1. Attribution comment (HTML or JSX comment depending on editor mode)
2. Scoped CSS inside a `<style>` block (Uiverse only; HyperUI skips)
3. Wrapped HTML (or transformed JSX)

### Uiverse (HTML mode)

```ts
const scope = `ak-${crypto.randomUUID().slice(0, 8)}`;
const css = full.css!.replace(/__UIV_SCOPE__/g, scope);
const payload = [
  `<!--\n  Component: ${title}\n  Source:    ${sourceUrl}\n  Author:    ${author} (${license})\n-->`,
  `<style>\n${css}\n</style>`,
  `<div class="${scope}">\n${full.html}\n</div>`,
].join("\n\n");
insertAtCursor(payload);
```

### HyperUI (HTML mode)

No scoping. Tailwind CDN is already injected by `lib/preview.ts`. Just the attribution comment + raw HTML.

### JSX mode

Convert the HTML to JSX at insert time using a browser-safe `lib/component-library/html-to-jsx.ts`. **No Babel in browser.** DOMParser + recursive walk, ~100 lines, zero dependencies:
- `class` → `className`
- `for` → `htmlFor`
- inline `style="..."` → `style={{ ... }}` object
- self-close void elements (`<br>`, `<img>`, `<input>`, …)
- SVG-specific camelCase (`stroke-width` → `strokeWidth`, etc.)

The existing Node-side `scripts/html-to-jsx.mjs` stays for build-time batch conversion — the new lib is a browser sibling with the same logic, no fs, no Babel.

For Uiverse in JSX mode: wrap the scoped `<div>` as `<div className={scope}>`. For the style block, emit a `<style>{`\n...\n`}</style>` sibling before the wrapper.

## Editor integration

### Monaco ref plumbing

`components/Editor.tsx` currently controls via `value` + `onChange`. Add a ref-based imperative API:

```tsx
// components/Editor.tsx
type EditorHandle = { insertAtCursor: (text: string) => void };
const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(props, ref) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    /* theme setup… */
  };
  useImperativeHandle(ref, () => ({
    insertAtCursor(text) {
      const ed = editorRef.current;
      if (!ed) return;
      const sel = ed.getSelection();
      ed.executeEdits("component-library-insert", [
        { range: sel ?? new monaco.Range(1, 1, 1, 1), text, forceMoveMarkers: true },
      ]);
      ed.focus();
    },
  }), []);
  /* … */
});
```

`components/Workspace.tsx` holds the ref, forwards it to the sidebar. Sidebar calls `handle.insertAtCursor(payload)` on Insert.

Trade-off note: Monaco is already `dynamic({ ssr: false })`, and `forwardRef` + `dynamic` compose cleanly via `next/dynamic({ loading, ssr: false })` with a `ref: true` option.

## Preview iframe

**No change required.** `lib/preview.ts` already:
- Injects Tailwind CDN unconditionally for JSX
- Injects Tailwind CDN for HTML when missing

The `tailwindRequired` field stays as metadata (useful for Phase 2 filtering and for showing a "Needs Tailwind" chip), but drives **no** iframe-side logic. Attribution comment tells the user Tailwind is always on.

## File structure (folded into existing repo root)

```
app/
  (unchanged)
components/
  library/
    Sidebar.tsx              # main collapsible panel
    SearchBar.tsx
    CategoryPills.tsx
    SourceFilter.tsx
    ComponentGrid.tsx        # simple grid; windowed paging ("Load more")
    ComponentCard.tsx        # <img> thumb + Insert/View buttons
    DetailModal.tsx          # full preview, HTML/CSS tabs, Insert
lib/
  component-library/
    types.ts                 # ComponentMeta, ComponentFull, ComponentIndex
    client.ts                # fetch + cache index/search/{slug}.json
    search.ts                # minisearch wrapper + weights
    scope.ts                 # runtime __UIV_SCOPE__ → ak-xxxxxxxx
    insert.ts                # compose attribution + styles + html/jsx payload
    html-to-jsx.ts           # browser-safe DOM→JSX transform
scripts/
  ingest-components.ts       # main entry: pnpm → npm run ingest
  ingest/
    uiverse.ts
    hyperui.ts
    categorize.ts
    scope-css.ts             # postcss + postcss-prefix-selector
    thumbs.ts                # puppeteer renderer for component fragments
    write-index.ts           # build index.json + search.json
public/
  data/
    components/
      index.json
      search.json
      {slug}.json ...        # one per component
  component-thumbs/
    {slug}.webp ...
```

## Dependencies to add

**Runtime:**
- `minisearch` — client-side FTS

**Dev / ingestion only:**
- `gray-matter` — parse HyperUI MDX frontmatter
- `postcss-prefix-selector` — Uiverse CSS scoping

Already present: `puppeteer`, `postcss`. No pnpm-specific packages.

## Milestones

**Day 1 morning:**
- Add deps, scaffold directories
- `types.ts`, `categorize.ts`
- Uiverse ingestion → `index.json` + `{slug}.json` writes (no thumbs yet)
- Verify ~3000-4000 records land and spot-check 20 at random

**Day 1 afternoon:**
- HyperUI ingestion with per-variant slugs
- Thumbnail generation for all components (reuse `gen-thumbs.mjs` generalization)
- Build `search.json` via minisearch
- Commit the artifacts

**Day 2 morning:**
- Monaco ref plumbing in `Editor.tsx` / `Workspace.tsx`
- Sidebar shell (search, source filter, category pills, grid, card)
- Wire to static JSON; search results under 100ms client-side for 4000 items

**Day 2 afternoon:**
- Detail modal
- Insert flow: `scope.ts`, `insert.ts`, `html-to-jsx.ts`
- End-to-end test: open playground, search "pricing", insert a HyperUI pricing card; open `/t/<slug>`, search "button gradient", insert a scoped Uiverse button; insert a second Uiverse button, confirm scopes don't collide.

## Acceptance criteria

1. Sidebar opens on `/playground` and `/t/[slug]`; closed by default, toggled via button or `Cmd+J`
2. All current Uiverse galaxy components ingested + all HyperUI variants ingested, **<1% ingestion failure rate**
3. Search returns relevant results client-side in under 150ms on a 4-year-old laptop for queries like "pricing", "gradient button", "loader dots"
4. Category filter + source filter work independently and combined
5. Clicking a component card opens a detail modal with full preview, HTML, and CSS
6. Clicking Insert places the component at the Monaco cursor and the preview updates within the existing 250ms debounce window
7. Two Uiverse components inserted back-to-back into the same document do not break each other's styles (different scope ids)
8. Every inserted component starts with an attribution comment pointing to the original source with the correct license
9. No regression in existing HTML/JSX preview, gallery, dice, focus editor, or /t/[slug] routes
10. All sidebar thumbnails are static `<img>` tags sourced from `/public/component-thumbs/` — no live iframes in the grid

## Risks and mitigations

**Uiverse repo size.** Shallow clone is ~200MB. Mitigation: `--depth 1`, cache the clone between runs, never commit `/tmp/uiverse` itself — only the derived JSON + thumbs.

**Category mismatch.** Uiverse tags are freeform; some components won't categorize cleanly. Mitigation: fallback to `other`; review top 100 `other` entries manually after first ingest and extend `categorize.ts`.

**CSS scoping edge cases.** Complex selectors (`:has`, `:is`, nested rules, `@keyframes` names, custom properties) can break naive prefixing. Mitigation: use `postcss-prefix-selector` from day one, not regex. All scoping runs in Node during ingestion, so edge-case handling doesn't bloat the client bundle.

**Thumbnail throughput.** 4000 components × ~4s each at CONCURRENCY=3 is ~1.5 hours for a cold run. Mitigation: incremental skip (same pattern as `gen-thumbs.mjs`), acceptable for a weekly refresh cadence. Bump `CONCURRENCY` if the machine handles it.

**Artifact size in the repo.** `index.json` ~500KB + `search.json` ~300KB + 4000 × `{slug}.json` (avg ~2KB) + 4000 thumbs × ~15KB WebP ≈ 70MB committed. Acceptable for a code repo; if it ever becomes a problem, move thumbs to Git LFS later.

**Minisearch relevance on tiny tag sets.** Some Uiverse components have only 1-2 tags. Mitigation: title/category carry the weight; "other"-bucket items will be harder to find but searchable by exact title match.

## What Phase 2 adds on top

- **AI generation** via Claude API (Sonnet, structured output). Generated components flow through the same scope/insert pipeline.
- **Registry protocol** (shadcn-compatible): Aceternity, Magic UI, tweakcn, kibo-ui — ingested the same way.
- **React component preview** via esm.sh + esbuild-wasm for JSX transform in the browser.
- ~~Thumbnail pipeline~~ — **already done in Phase 1**. Phase 2 extends it to generated components, nothing else.
