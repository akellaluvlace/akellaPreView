// Uiverse ingestion: walk galaxy/{Category}/*.html, split <style> from body
// HTML, parse the attribution comment for author + tags, run CSS through
// the scoper, emit one `{meta, full}` record per component.
//
// Real-world structure (confirmed via `gh api repos/uiverse-io/galaxy/...`):
// every component is a single self-contained .html with its CSS inline in
// a <style> tag and a `/* From Uiverse.io by {author} - Tags: {a, b, c} */`
// comment at the top of that style block. No meta.json, no JS, no nesting.

import { promises as fs } from "node:fs";
import path from "node:path";
import { categorizeUiverseFolder } from "./categorize.mjs";
import { scopeCss } from "./scope-css.mjs";
import { extractRootClassName } from "./extract-root-class.mjs";

// Uiverse attribution: `/* From Uiverse.io by <handle> - Tags: a, b, c */`.
// The handle can contain dashes (`0x-Sarthak`), so we don't stop at `-`; we
// stop at the "space-dash-space-Tags" separator or end-of-comment. Fallback:
// if no Tags segment is present, the whole tail after "by " is the author.
const ATTRIBUTION_RE =
  /\/\*\s*From\s+Uiverse\.io\s+by\s+([^\r\n]+?)(?:\s+-\s*Tags?\s*:\s*([^*]+?))?\s*\*\//i;
const STYLE_BLOCK_RE = /<style[^>]*>([\s\S]*?)<\/style>/gi;
const SCRIPT_BLOCK_RE = /<script[^>]*>[\s\S]*?<\/script>/gi;

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Split the raw file into "pure CSS" (concatenated from every <style> block,
// with the leading attribution comment stripped once we've consumed it) and
// "body HTML" (everything else). Uiverse files have no <html>/<head> wrapper
// — they're just the component markup — so the body is the whole file minus
// its style tags.
function splitHtmlAndCss(raw) {
  let cssParts = [];
  let bodyHtml = raw;
  bodyHtml = bodyHtml.replace(STYLE_BLOCK_RE, (_, inner) => {
    cssParts.push(inner);
    return "";
  });
  // Strip any stray <script> blocks — Uiverse is supposed to be CSS-only, but
  // a handful of files ship a tiny script we don't want executing in the
  // preview iframe unsandboxed.
  bodyHtml = bodyHtml.replace(SCRIPT_BLOCK_RE, "");
  const css = cssParts.join("\n\n").trim();
  return { css, html: bodyHtml.trim() };
}

function parseAttribution(css) {
  const m = css.match(ATTRIBUTION_RE);
  if (!m) return { author: null, tags: [] };
  const author = m[1]?.trim() || null;
  const tagsRaw = (m[2] || "").trim();
  const tags = tagsRaw
    ? tagsRaw
        .split(/[,\s]+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];
  return { author, tags };
}

// Filename pattern: `{author-handle}_{component-name}-{number?}.html`.
// e.g. `0x-Sarthak_hungry-penguin-30.html` → author "0x-Sarthak", name
// "hungry-penguin-30". The `_` is the reliable separator; we split on the
// first underscore and keep the rest as the name.
function parseFilename(filename) {
  const base = filename.replace(/\.html?$/i, "");
  const idx = base.indexOf("_");
  if (idx <= 0) return { author: null, name: base };
  return { author: base.slice(0, idx), name: base.slice(idx + 1) };
}

function titleCase(slug) {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

async function readOne({ categoryDir, filename, rootDir }) {
  const full = path.join(rootDir, categoryDir, filename);
  const raw = await fs.readFile(full, "utf-8");
  const { css, html } = splitHtmlAndCss(raw);
  if (!html) return null;

  const { author: attrAuthor, tags } = parseAttribution(css);
  const { author: fileAuthor, name } = parseFilename(filename);
  const author = attrAuthor || fileAuthor;
  const category = categorizeUiverseFolder(categoryDir);
  const nameSlug = slugify(name);
  const slug = `uiverse-${category}-${slugify(
    (author ? author + "-" : "") + nameSlug
  )}`;

  const scopedCss = css ? await scopeCss(css) : null;

  const meta = {
    id: slug,
    slug,
    title: titleCase(nameSlug),
    category,
    source: "uiverse",
    tags,
    author,
    authorUrl: author ? `https://uiverse.io/${encodeURIComponent(author)}` : null,
    sourceUrl: `https://github.com/uiverse-io/galaxy/blob/main/${encodeURIComponent(
      categoryDir
    )}/${encodeURIComponent(filename)}`,
    license: "MIT",
    tailwindRequired: false,
    tailwindPlugins: [],
    thumbUrl: `/component-thumbs/${slug}.webp`,
    hasCss: !!css,
    darkVariant: false,
    // Phase E proper — root className for runtime capacity inference.
    // The LibraryModal compatibility filter feeds this string through
    // `inferCapacityFromClasses` to derive width/height bounds + flex
    // behavior + aspect-ratio for the "fits this slot" check. null when
    // the asset has no top-level element with a class attribute.
    rootClassName: extractRootClassName(html),
  };

  const fullRecord = { ...meta, html, css: scopedCss };
  return { meta, full: fullRecord };
}

// Public entry — yields `{meta, full}` for every Uiverse file under rootDir.
// Errors on individual files are logged and skipped; one bad file shouldn't
// kill a 4000-component batch.
export async function* ingestUiverse({ rootDir, onProgress } = {}) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const categoryDirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);

  let total = 0;
  let emitted = 0;
  let errored = 0;
  for (const cat of categoryDirs) {
    const catPath = path.join(rootDir, cat);
    let files;
    try {
      files = await fs.readdir(catPath);
    } catch {
      continue;
    }
    for (const f of files) {
      if (!/\.html?$/i.test(f)) continue;
      total++;
      try {
        const rec = await readOne({ categoryDir: cat, filename: f, rootDir });
        if (rec) {
          emitted++;
          if (onProgress) onProgress({ total, emitted, errored, slug: rec.meta.slug });
          yield rec;
        }
      } catch (e) {
        errored++;
        if (onProgress) onProgress({ total, emitted, errored, error: e.message, filename: f });
      }
    }
  }
  if (onProgress) onProgress({ total, emitted, errored, done: true });
}
