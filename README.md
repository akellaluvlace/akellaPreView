# Dropin

A website for vibecoders: paste AI-generated HTML or JSX and watch it render live, or pick from a gallery of ready-to-ship templates. Edit inline with Monaco, copy to clipboard or download the file. No sign-in, no backend, no storage.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add a template

Each template is a folder in `/templates/<slug>/`. You need two files:

- `meta.json` — title, description, category, tags, kind (`jsx` or `html`).
- `source.jsx` **or** `source.html` — matches the `kind` in meta.

```json
// templates/my-page/meta.json
{
  "title": "My Page",
  "description": "Short blurb under 140 chars.",
  "category": "Landing",
  "tags": ["saas", "hero"],
  "kind": "jsx"
}
```

Valid categories: `Landing`, `Ecommerce`, `Portfolio`, `Marketing`, `Utility`, `Dashboard`, `Blog`.

JSX templates must have exactly one `export default` component, no npm imports (they get stripped in preview), and no local-path images (use absolute URLs to Unsplash or similar).

HTML templates are standalone documents. Tailwind CDN is auto-injected if not already present.

## Deploy

Push to GitHub, import the repo in Vercel, done. Next.js is detected automatically and zero config is needed. Templates are read from the filesystem at build time in Server Components.

## Stack

- **Next.js 14.2** (App Router) — server components, static routes for each template
- **TypeScript** strict — typesafe everything
- **Tailwind 3.4** — styling, including the brutalist paper-and-ink theme
- **@monaco-editor/react** — the editor, lazy-loaded client-only
- **next/font/google** — Fraunces (display), Instrument Sans (body), JetBrains Mono (code)
- **iframe `srcDoc`** — the preview runtime; React 18 UMD + Babel standalone + Tailwind CDN loaded from unpkg
- **Vercel** — hosting; `git push` is the deploy

No database, no auth, no API routes.
