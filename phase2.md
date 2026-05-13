# Phase 2: AI Generation, Registry Protocol, React Preview Runtime

> **ARCHIVED 2026-05-05.** This Phase 2 spec was superseded by `phase2-manipulation.md` (the locked manipulation-focused Phase 2) and never shipped as written. The /api/generate-component server-key + Upstash flow described here was replaced by `/api/llm-rewrite` BYO-key (no DB, no server-stored keys). Keep for historical reference; treat nothing here as current.

## Goal

Extend the Phase 1 static library with three independent tracks: on-demand AI component generation, shadcn-compatible registry ingestion (Aceternity / Magic UI / tweakcn / kibo), and a browser-based React preview runtime that renders JSX components without a bundler.

The differentiator lands here: curated library plus AI generation plus ecosystem registries, all flowing through the same insert pipeline.

## What changed since the original Phase 2 spec

Phase 1 absorbed the thumbnail pipeline (Track 2 in the original Phase 2 plan). That track is now deleted from Phase 2. The other two tracks (generation, registries) remain but are re-architected to fit the locked static-JSON stack: no Supabase, no backend DB, everything either static files committed to `/public/data/` or transient session state in localStorage/IndexedDB.

New track added: React Preview Runtime. Promoted from a sub-section to a full track because registry support can't ship without it, and it's the hardest technical work in Phase 2.

## Scope

In scope:
- Claude-powered component generation with few-shot context from the static library
- Session-only persistence for generated components (localStorage cache, IndexedDB for insert history)
- Ingestion adapter for shadcn v4 registry protocol, extending the Phase 1 script
- Built-in registries: shadcn/ui, Aceternity, Magic UI, tweakcn, kibo-ui
- Custom registry URL: user-pasted, fetched and parsed client-side, cached in IndexedDB
- Browser-side JSX preview runtime (esbuild-wasm + esm.sh)
- Rate limiting for generation (Upstash Redis, operational only, not app data)

Out of scope (defer to Phase 3):
- User accounts, favorites, saved generations across sessions
- Remix / fork / save-edited-back
- Team libraries or shared collections
- Community uploads
- Visual similarity search
- Backend DB of any kind (when Phase 3 adds auth, the architecture pivots)

## Track 1: AI Generation

### Architecture

```
User prompt → /api/generate-component (Next.js route)
              ↓
    ┌────────────────────────┐
    │ Context builder        │  minisearch lookup over Phase 1 index
    └────────────────────────┘
              ↓
    ┌────────────────────────┐
    │ Claude API (Sonnet 4)  │  streaming, structured output
    └────────────────────────┘
              ↓
    ┌────────────────────────┐
    │ Validate + pre-scope   │  PostCSS with __UIV_SCOPE__ placeholder
    └────────────────────────┘
              ↓
    ┌────────────────────────┐
    │ Stream to sidebar      │  tile appears, shimmer fills in
    └────────────────────────┘
              ↓
    ┌────────────────────────┐
    │ localStorage cache     │  prompt hash → generated component
    └────────────────────────┘
```

No DB write. Generated component lives in React state for the session. localStorage cache stores prompt-hash → component payload for the same-prompt deduplication case. IndexedDB stores a short insert history so the user can re-insert a generation they dismissed 10 minutes ago.

### API endpoint

`POST /api/generate-component` at `app/api/generate-component/route.ts`.

Request:
```ts
{
  prompt: string;             // "gradient pricing card with yearly toggle"
  mode: 'html' | 'jsx';       // follows editor mode
  style?: string;             // optional: "minimal", "brutalist", "glass"
  tailwind: boolean;          // default true for jsx, false for html
}
```

Response (streaming NDJSON, not SSE):
```ts
// Frame 1: metadata
{ type: 'meta', id: string, title: string, category: string, tags: string[] }
// Frame 2+: code chunks
{ type: 'code', field: 'html' | 'css', chunk: string }
// Final frame: complete component with pre-scoped CSS
{ type: 'done', component: GeneratedComponent }
```

Streaming matters here because 6-8 second waits feel terrible. Title + category arrive in under a second, code streams in, user sees progress.

### Prompt structure

System prompt locks the output format:

```
You generate self-contained UI components for a live-preview editor.

RULES:
- Valid HTML + CSS (or Tailwind-only if tailwind mode)
- Use __UIV_SCOPE__ as the class prefix for every selector in the CSS
  (e.g. .__UIV_SCOPE__-card, not .card)
- No external images except picsum.photos or placehold.co
- No JavaScript unless CSS can't achieve it
- No external stylesheet links, no <script src=...>, no iframes
- Match modern production quality: specific, not generic
- No em dashes in generated content (use colons or commas)

OUTPUT (strict JSON):
{ "title": "...", "category": "buttons|cards|loaders|...", "html": "...", "css": "...", "tags": [...] }
```

User turn: `{prompt}` followed by 3 few-shot examples from the Phase 1 minisearch index that most closely match the prompt. Examples are full components with their actual scoped CSS, showing the model exactly the format expected.

Use Claude tool_use with a `generate_component` tool for structured output. Parse the tool input directly, skip JSON-in-text parsing entirely.

### Context selection via minisearch

Server-side route imports the same minisearch index Phase 1 uses:

```ts
import { loadSearchIndex } from '@/lib/component-library/search';

const index = await loadSearchIndex();
const matches = index.search(prompt, { limit: 3, combineWith: 'OR' });
const examples = await Promise.all(
  matches.map(m => loadComponent(m.slug))  // reads /public/data/components/{slug}.json
);
```

No DB round-trip. The search index and component JSON are filesystem reads (or fetches within the Next.js server).

### Pre-scoping the generated CSS

Same contract as Phase 1 library components. The model is instructed to use `__UIV_SCOPE__` as a prefix. Server validates this before returning: if the model slipped and used bare selectors, run PostCSS with `postcss-prefix-selector` server-side to force the scoping placeholder in.

At insert time, the existing Phase 1 insert pipeline replaces `__UIV_SCOPE__` with a random 8-char id, identical to library components. Zero client-side PostCSS, works for `:has`, `:is`, nesting.

### Validation layer

After Claude returns:
1. Parse HTML with htmlparser2
2. Parse CSS with PostCSS
3. Reject if: inline `<script>`, external `<script src>`, `<iframe>`, `<link>` pointing outside the allowed image hosts
4. Ensure `__UIV_SCOPE__` appears in every CSS selector (auto-fix with postcss-prefix-selector if missing)
5. On parse failure: retry Claude once with the error message appended to the user turn
6. On second failure: return 422 to client, surface "generation failed, try rephrasing"

### UI integration

Sidebar search bar gets a sparkle button on the right. Visible only when the input has text:

```
┌─────────────────────────────────────┐
│ 🔍 gradient pricing card    [ ✨ ]  │
└─────────────────────────────────────┘
```

Click (or Cmd+Enter) triggers generation. A new tile with a shimmer skeleton appears at the top of the results grid, labeled "Generating…". Title fills in first, then category, then the preview (live iframe in this single tile, not a static thumb). User can:
- Insert (runs the same insert pipeline as library components)
- Regenerate (new generation with the same prompt + "make it more X" optional text)
- Dismiss
- Copy HTML/CSS/JSX raw

Also: auto-suggest generation when minisearch returns fewer than 5 results. A "Don't see what you want? Generate it" CTA tile above the library results.

### Session persistence

Generated components live in a React context for the session. Two storage layers:

- localStorage: `akella:gen-cache:{sha256(prompt+style+mode)}` → full component JSON, TTL 24h. Same-prompt regenerations hit cache first.
- IndexedDB: `akella-generations` object store, keyed by generation id, full history with timestamp. Max 50 entries, FIFO evict. Used by the "recent generations" subsection of the sidebar.

When user inserts a generated component, the attribution comment notes it: `<!-- Generated by Claude, prompt: "{prompt}" -->`.

### Rate limiting

Upstash Redis via `@upstash/ratelimit`. Only for operational abuse prevention, not app data.

```ts
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  analytics: false,
});

const { success, remaining } = await ratelimit.limit(getClientIp(request));
if (!success) return Response.json({ error: 'rate_limited' }, { status: 429 });
```

Env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Free tier covers thousands of requests per day.

If Upstash is a non-starter: fall back to an in-memory `Map<ip, { count, resetAt }>` in the Edge runtime. Not perfect across regional cold starts but good enough for pre-launch.

### Cost controls

- 20 generations per IP per hour
- Max output tokens: 2000
- Model: Sonnet 4, tool_use structured output
- Expected cost: ~$0.02 per successful generation (3 few-shot examples bloat the input slightly)
- Cache hits (same prompt within 24h) cost $0

## Track 2: Registry Protocol Support

### What the protocol is

shadcn/ui v4 standardized a JSON schema for component registries. Format:

```json
// registry index at https://example.com/r/index.json
{
  "name": "aceternity",
  "items": [
    {
      "name": "hover-effect",
      "type": "registry:ui",
      "dependencies": ["framer-motion"],
      "tailwind": { "config": { "theme": { "extend": { ... } } } },
      "files": [
        { "path": "hover-effect.tsx", "content": "...", "type": "registry:ui" }
      ]
    }
  ]
}
```

Some registries (Aceternity, Magic UI) serve the index fat. Others serve per-component JSON at `/r/{name}.json`. Adapter handles both.

### Extension to Phase 1 ingestion script

`scripts/ingest-registry.ts` as a sibling to the existing `scripts/ingest-components.ts`. Shares utilities for categorization, slug generation, CSS scoping, and output formatting.

Run order:
```
npm run ingest          # Phase 1: Uiverse + HyperUI
npm run ingest:registry # Phase 2: all registered registries
npm run gen-thumbs      # Phase 1 pipeline, regenerates missing thumbs
```

All three produce output in `/public/data/components/`. Committed to the repo.

### Schema additions to component JSON

```ts
interface ComponentRecord {
  // Phase 1 fields:
  id: string;
  slug: string;
  title: string;
  category: string;
  source: string;         // now free string, no enum
  html: string | null;    // null for JSX-only registry components
  css: string | null;
  tailwind_required: boolean;
  tags: string[];
  author: string;
  source_url: string;
  license: string;
  thumb_url: string;
  
  // Phase 2 additions:
  jsx?: string;                    // TSX/JSX source for registry components
  dependencies?: string[];         // npm packages needed at preview time
  external_files?: Array<{ path: string; content: string }>;  // multi-file components
  tailwind_config?: object;        // custom theme extensions
  framework?: 'html' | 'react';    // what the source actually is
}
```

### Built-in registries (ingested at build time)

Ship with the following pre-ingested and thumbnailed:
- shadcn/ui: `https://ui.shadcn.com/r/index.json`
- Aceternity: `https://ui.aceternity.com/registry/index.json`
- Magic UI: `https://magicui.design/r/index.json`
- tweakcn: verify URL at implementation time
- kibo-ui: verify URL at implementation time

Per-source adapter if the schema drifts. Most should work off one generic parser.

### Custom registry URL (runtime-only)

Settings panel in the sidebar, "Registries" section:

```
Built-in (always on):
  ☑ Uiverse
  ☑ HyperUI
  ☑ shadcn/ui
  ☑ Aceternity
  ☑ Magic UI

Custom:
  + Add registry URL  [paste URL here]
```

User pastes a URL. Client-side:
1. Fetch the registry JSON (CORS-permitting; most public registries allow it, fall through to a proxy route if not)
2. Parse with the same adapter code as the build-time ingestion
3. Store parsed components in IndexedDB under `akella-custom-registries` keyed by URL
4. Add the registry name to the source filter in the sidebar
5. Custom-registry components render in the grid with live-iframe previews (no static thumb, since we can't run puppeteer client-side)

Custom registries don't get thumbnails. Acceptable trade: custom registries are typically smaller curated lists (10-50 components), live iframes scale fine for that count.

### Thumbnailing for built-in registries

The existing Phase 1 puppeteer pipeline handles HTML/CSS thumbnails natively. For React components from registries, we need the preview runtime (Track 3) to render them before screenshotting.

Updated thumbnail worker flow:
```
if (component.framework === 'react') {
  await page.goto(previewRouteForComponent(component.slug));
  // preview route uses the React runtime, renders to #root
} else {
  await page.setContent(htmlWrapper(component));
}
await page.screenshot({ ... });
```

Requires the preview route (`/api/preview/{slug}`) to exist, which Track 3 provides.

## Track 3: React Preview Runtime

### The problem

Registry components are TSX/JSX. The preview iframe in Phase 1 renders plain HTML. To preview React components without a bundler, we need an in-browser transform and module resolution.

### Architecture

Preview iframe document:
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style id="scoped-styles"></style>
  <style id="tailwind-extend"></style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'https://esm.sh/react@18';
    import { createRoot } from 'https://esm.sh/react-dom@18/client';
    // dynamically imported dependencies inserted here
    // transformed component source inserted here
    
    const mountNode = document.getElementById('root');
    createRoot(mountNode).render(React.createElement(Component));
  </script>
</body>
</html>
```

Three pieces do the work:

1. **esbuild-wasm** for JSX→JS transform, loaded lazily (2.5MB, fetched on first React component insert in a session, cached)
2. **esm.sh** for dependency resolution, no install step
3. **Tailwind CDN** for styling plus a `<style>` block for the component's custom theme extensions

### JSX transform

```ts
import * as esbuild from 'esbuild-wasm';

let initialized = false;
async function ensureInit() {
  if (initialized) return;
  await esbuild.initialize({
    wasmURL: 'https://unpkg.com/esbuild-wasm@0.20/esbuild.wasm'
  });
  initialized = true;
}

export async function transformJsx(source: string): Promise<string> {
  await ensureInit();
  const result = await esbuild.transform(source, {
    loader: 'tsx',
    jsx: 'automatic',
    jsxImportSource: 'react',
    target: 'es2020',
  });
  return result.code;
}
```

Transform runs once per component insert, result cached in memory for the session.

### Dependency resolution

Scan transformed code for import statements. Rewrite package imports to esm.sh URLs:

```ts
function rewriteImports(code: string): string {
  return code
    .replace(/from ['"]react['"]/g, `from 'https://esm.sh/react@18'`)
    .replace(/from ['"]react-dom['"]/g, `from 'https://esm.sh/react-dom@18'`)
    .replace(/from ['"]framer-motion['"]/g, `from 'https://esm.sh/framer-motion'`)
    .replace(/from ['"]lucide-react['"]/g, `from 'https://esm.sh/lucide-react'`)
    .replace(/from ['"]clsx['"]/g, `from 'https://esm.sh/clsx'`)
    .replace(/from ['"](@?[a-z0-9-]+(\/[a-z0-9-]+)*)['"]/g,
      (_, pkg) => `from 'https://esm.sh/${pkg}'`);
}
```

Works for the vast majority of registry components. Fails gracefully for things that need build-time config (Next.js Image, next/link, dynamic imports with webpack magic comments). For those, show a "Preview not supported for this component. Insert anyway?" state. User can still insert the code; they just won't see it render until they wire it into their own setup.

### Preview dispatch

When a component is shown in the sidebar detail view (or auto-previewed in the generated tile), dispatch based on `framework`:

```ts
if (component.framework === 'react') {
  const transformed = await transformJsx(component.jsx);
  const withImports = rewriteImports(transformed);
  mountReactPreview(iframeRef, withImports, component.dependencies);
} else {
  mountHtmlPreview(iframeRef, component.html, component.css);
}
```

### Insertion of React components

HTML mode editor: insert the JSX source wrapped in a comment block that tells the user this component needs React + their own setup:

```jsx
<!--
  React component: {name}
  Source: {source_url}
  Dependencies: react, framer-motion
  Paste into a .tsx file in a React/Next.js project.
-->
```

JSX mode editor: insert the JSX directly at cursor position. Dependencies noted in the attribution comment so the user knows what to `npm install`.

### Known limits (document in UI)

- Components using `next/image`, `next/link`, or any `next/*` module won't preview (insert still works)
- Components with custom fonts loaded via Next.js font optimization won't preview
- Components relying on environment variables won't preview
- Nested registry dependencies (component A imports component B from the same registry) need full multi-file resolution; works for shadcn-style single-file components, fails for others

Ship Phase 2 with "works for ~85% of shadcn-compatible components" as the target. Edge cases go into a known-limitations section of the docs and an issue queue.

## File structure additions

```
scripts/
  ingest-registry.ts             # new, shadcn-compatible parser
  registry-adapters/
    shadcn.ts
    aceternity.ts
    magic-ui.ts
    tweakcn.ts
    kibo.ts
    generic.ts                   # fallback

lib/
  component-library/
    generate.ts                  # client, calls /api/generate-component
    generation-cache.ts          # localStorage + IndexedDB for gens
    custom-registry.ts           # runtime registry fetch + IndexedDB
    jsx-runtime.ts               # esbuild-wasm transform
    esm-sh-resolver.ts           # import rewriter
    react-preview.ts             # dispatch + mount logic

components/
  library/
    GenerateButton.tsx
    GeneratingTile.tsx
    RegistryManager.tsx
    CustomRegistryInput.tsx
    PreviewNotSupportedBadge.tsx

app/
  api/
    generate-component/
      route.ts                   # streaming Next.js route
    preview/
      [slug]/
        route.tsx                # server-rendered React preview page
                                 # (used by puppeteer for thumbnails)
```

## Milestones

Week 1: Registry ingestion. Extend Phase 1 script with shadcn-compatible adapter. Ingest shadcn/ui, Aceternity, Magic UI, tweakcn, kibo. Verify category normalization across 5 sources. Output lands in `/public/data/components/` alongside Phase 1 data. Single minisearch index rebuilt covering all sources.

Week 2: React preview runtime. esbuild-wasm transform, esm.sh import rewriting, preview iframe mount logic. Preview route for puppeteer thumbnail rendering. Update Phase 1 thumbnail pipeline to handle `framework: 'react'` components. All registry components now have static thumbs in the gallery.

Week 3: AI generation. Claude API route with streaming. Few-shot context from minisearch. Pre-scoping validator. Generation UI: sparkle button, generating tile, insert/regenerate/dismiss actions. localStorage cache, IndexedDB history. Upstash rate limit.

Week 4: Custom registry runtime flow, polish, known-limit surfacing in UI, integration testing across all three tracks, docs.

## Acceptance criteria

1. All five built-in registries ingested, appearing in source filter with components searchable
2. React components from built-in registries render correctly in sidebar preview via esbuild-wasm + esm.sh
3. Same components have static WebP thumbnails in the grid (generated via updated Phase 1 pipeline)
4. User can paste a custom registry URL and see its components in the sidebar within 3 seconds
5. Custom-registry components render with live-iframe previews (no static thumb expected)
6. AI generation: "pricing card with gradient border and yearly toggle" produces a working component inserted in under 8 seconds end-to-end
7. Generated CSS uses `__UIV_SCOPE__` placeholder, gets replaced at insert time, doesn't collide with other inserted components
8. Same prompt within 24h hits localStorage cache, returns in <100ms
9. 21st generation in an hour returns HTTP 429 with clear retry-after messaging
10. Components flagged `framework: 'react'` that use `next/*` imports show "Preview not supported, insert anyway" instead of silently failing
11. Re-running `npm run ingest:registry` is idempotent; existing components update, no duplicates
12. No new backend dependencies beyond Upstash (Redis for rate limits only, no app data)

## Risks and mitigations

**Upstash dependency adds infra surface area.** Mitigation: fall back to in-memory Map in Edge runtime if Upstash setup is friction. Accept that rate limits reset on cold start; sufficient for pre-launch. Document the upgrade path.

**Generation latency feels slow.** Mitigation: streaming NDJSON so title/category arrive in <1s. Loading tile with shimmer keeps perceived latency down. Pre-warm Claude connection pool on server.

**esm.sh reliability.** External dependency. Mitigation: cache popular modules via service worker, document known outages as a preview-only issue (insert still works), plan self-hosted proxy for Phase 3 if it becomes a problem.

**esbuild-wasm payload size.** 2.5MB. Mitigation: lazy-load only when user inserts first React component in a session. Cache aggressively via service worker. Shows loading state during first-time init.

**Registry schema drift.** Aceternity/Magic UI may change schemas. Mitigation: per-source adapter isolates breakage. Generic parser as fallback. Ingestion script logs unparseable components but doesn't fail the whole run.

**React component rendering quality variance.** ~85% of registry components will preview cleanly. Mitigation: clear "preview not supported" UX, insert still works, component still ships to user. Document known patterns.

**Custom registry CORS issues.** Some registries may not serve with permissive CORS. Mitigation: lightweight proxy route at `/api/proxy-registry?url=` that fetches server-side. Constrained to known-good-domain allowlist to prevent SSRF.

**Generation cost if viral.** At $0.02/gen and 20/hr cap, a 1000-user spike costs $400/hr. Mitigation: rate limits hold the line. Add a daily cap per IP if needed (e.g. 50/day). Paid tier becomes a Phase 3 consideration if the product takes off.

**Prompt injection via registry content.** Custom registries are user-pasted URLs; malicious content could try to inject into the editor. Mitigation: all registry JSX runs in a sandboxed iframe with no parent access. No registry content evaluated in the main document. Validate structure before rendering.

## What Phase 3 adds on top

- Auth (Supabase or Clerk, pick one when Phase 3 scopes) and the backend DB it implies
- Personal favorites, saved generations persisting across sessions and devices
- Remix flow: edit a component, save as personal variant
- Team-shared libraries (Akella inMotion, client handoffs)
- Community uploads with moderation
- Visual similarity search over thumbnails (CLIP embeddings)
- Paid tier for higher generation limits and team features
- Usage analytics

Note: Phase 3 is the point where the no-backend rule in CLAUDE.md needs to be overturned. Until then, everything in Phase 1 and Phase 2 stays client-side plus static files plus operational rate-limit Redis.