// HyperUI ingestion: the MDX at
// `src/content/collection/{cat}/{slug}.mdx` has frontmatter listing variants;
// the actual HTML lives in `public/examples/{cat}/{slug}/{N}.html` (and
// `{N}-dark.html` when a dark variant is shipped). We walk the MDX files,
// pair each component entry with its HTML, and emit one record per variant
// — light + dark as separate records per the locked spec decision.

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categorizeHyperUISlug } from "./categorize.mjs";
import { extractRootClassName } from "./extract-root-class.mjs";

const COLLECTION_ROOT = "src/content/collection";
const EXAMPLES_ROOT = "public/examples";

// Coarse → fine (reference only; fine slug is what we actually categorize on):
const COARSE_DIRS = ["application", "marketing", "neobrutalism"];

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleCase(s) {
  return s
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

async function readIfExists(p) {
  try {
    return await fs.readFile(p, "utf-8");
  } catch {
    return null;
  }
}

// `title` field in the frontmatter sub-object tends to be human-readable:
// "Base", "Base with icon", "Split with image". Slugify for the URL slug but
// keep the readable form for the UI.
function variantSlug(rawTitle, index) {
  const base = slugify(rawTitle || "");
  return base || `v${index + 1}`;
}

async function readOne({ rootDir, coarse, fine, variantIndex, variantInfo, isDark }) {
  const examplesDir = path.join(rootDir, EXAMPLES_ROOT, coarse, fine);
  const htmlFile = isDark ? `${variantIndex}-dark.html` : `${variantIndex}.html`;
  const html = await readIfExists(path.join(examplesDir, htmlFile));
  if (!html) return null;

  const category = categorizeHyperUISlug(fine);
  const vSlug = variantSlug(variantInfo.title, variantIndex - 1);
  const darkSuffix = isDark ? "-dark" : "";
  const slug = `hyperui-${fine}-${vSlug}${darkSuffix}`;
  const readableTitle =
    (variantInfo.title || titleCase(fine)) + (isDark ? " (Dark)" : "");

  const plugins = Array.isArray(variantInfo.plugins) ? variantInfo.plugins : [];

  const meta = {
    id: slug,
    slug,
    title: `${titleCase(fine)}: ${readableTitle}`,
    category,
    source: "hyperui",
    tags: [fine, coarse, ...plugins],
    author: "HyperUI",
    authorUrl: "https://www.hyperui.dev",
    sourceUrl: `https://www.hyperui.dev/components/${coarse}/${fine}`,
    license: "MIT",
    tailwindRequired: true,
    tailwindPlugins: plugins,
    thumbUrl: `/component-thumbs/${slug}.webp`,
    hasCss: false,
    darkVariant: isDark,
    // Phase E proper — root className for runtime capacity inference.
    // See uiverse.mjs for full context. HyperUI components ship as
    // body-level fragments with the wrapper class on the first element
    // (typically `class="bg-white"` or `class="grid grid-cols-..."`).
    rootClassName: extractRootClassName(html.trim()),
  };
  const full = { ...meta, html: html.trim(), css: null };
  return { meta, full };
}

export async function* ingestHyperUI({ rootDir, onProgress } = {}) {
  let total = 0;
  let emitted = 0;
  let errored = 0;
  for (const coarse of COARSE_DIRS) {
    const mdxDir = path.join(rootDir, COLLECTION_ROOT, coarse);
    let files;
    try {
      files = await fs.readdir(mdxDir);
    } catch {
      continue;
    }
    for (const f of files) {
      if (!/\.mdx?$/i.test(f)) continue;
      const fine = f.replace(/\.mdx?$/i, "");
      const mdxPath = path.join(mdxDir, f);
      let parsed;
      try {
        const raw = await fs.readFile(mdxPath, "utf-8");
        parsed = matter(raw);
      } catch (e) {
        errored++;
        if (onProgress) onProgress({ total, emitted, errored, error: `mdx read: ${e.message}`, filename: f });
        continue;
      }
      const variants = parsed.data?.components;
      if (!Array.isArray(variants) || variants.length === 0) continue;

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const idx = i + 1; // HTML files are 1-indexed to match MDX order
        total++;
        // Light variant (always expected)
        try {
          const rec = await readOne({
            rootDir,
            coarse,
            fine,
            variantIndex: idx,
            variantInfo: v,
            isDark: false,
          });
          if (rec) {
            emitted++;
            if (onProgress) onProgress({ total, emitted, errored, slug: rec.meta.slug });
            yield rec;
          }
        } catch (e) {
          errored++;
          if (onProgress) onProgress({ total, emitted, errored, error: e.message, filename: `${f}#${idx}` });
        }

        // Dark variant (optional; frontmatter's `dark: true/obj`)
        if (v.dark) {
          total++;
          try {
            const rec = await readOne({
              rootDir,
              coarse,
              fine,
              variantIndex: idx,
              variantInfo: v,
              isDark: true,
            });
            if (rec) {
              emitted++;
              if (onProgress) onProgress({ total, emitted, errored, slug: rec.meta.slug });
              yield rec;
            }
          } catch (e) {
            errored++;
            if (onProgress) onProgress({ total, emitted, errored, error: e.message, filename: `${f}#${idx}-dark` });
          }
        }
      }
    }
  }
  if (onProgress) onProgress({ total, emitted, errored, done: true });
}
