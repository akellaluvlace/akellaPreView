import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

export type TemplateKind = "jsx" | "html";

// Style is a parallel taxonomy to `category`. Category answers "what kind
// of page" (Landing, Ecommerce, …); style answers "what does it look like"
// (Stylish, Cyber, …). Templates can be untagged (style: null) when they
// don't fit any of the five clusters cleanly — better than force-fitting.
export type TemplateStyle = "Stylish" | "Cyber" | "Brutal" | "Editorial" | "Retro";

export const TEMPLATE_STYLES: readonly TemplateStyle[] = [
  "Stylish",
  "Cyber",
  "Brutal",
  "Editorial",
  "Retro",
] as const;

export interface TemplateMeta {
  title: string;
  description: string;
  category: string;
  tags: string[];
  kind: TemplateKind;
  author?: string;
  style?: TemplateStyle | null;
}

export interface Template extends TemplateMeta {
  slug: string;
  source: string;
}

// Gallery-safe view of a template — no `source` field. Keeps the client
// payload small when we ship all ~100 summaries to a client component for
// search/filter/sort. The editor routes still use the full `Template`.
export type TemplateSummary = Omit<Template, "source">;

const TEMPLATES_DIR = path.join(process.cwd(), "templates");
const WEB_DIR = path.join(process.cwd(), "web");

// --- folder-based templates (spec §10 contract) ------------------------

// A folder-based template can ship BOTH `source.jsx` and `source.html`
// (e.g. coming-soon does). `meta.kind` is the *default* kind to load when
// the caller hasn't asked for a specific one; if the caller asks for the
// other kind and the corresponding file exists, we honour that and return
// the template tagged with the requested kind. Falling back keeps single-
// kind templates working (most folder templates only ship one source file).
async function readFolderTemplate(
  slug: string,
  opts?: { preferKind?: TemplateKind }
): Promise<Template | null> {
  try {
    const folder = path.join(TEMPLATES_DIR, slug);
    const metaRaw = await fs.readFile(path.join(folder, "meta.json"), "utf-8");
    const meta = JSON.parse(metaRaw) as TemplateMeta;
    if (!isValidMeta(meta)) return null;

    const kindOrder: TemplateKind[] =
      opts?.preferKind && opts.preferKind !== meta.kind
        ? [opts.preferKind, meta.kind]
        : [meta.kind];

    // meta.json may declare a style; otherwise fall back to the slug map so
    // existing folder templates pick up a style without an authoring step.
    const style = meta.style ?? styleFromSlug(slug);

    for (const k of kindOrder) {
      const sourceFile = k === "jsx" ? "source.jsx" : "source.html";
      try {
        const source = await fs.readFile(
          path.join(folder, sourceFile),
          "utf-8"
        );
        return { ...meta, style, kind: k, slug, source };
      } catch {
        // file doesn't exist for this kind, try the next candidate
      }
    }
    return null;
  } catch {
    return null;
  }
}

function isValidMeta(x: unknown): x is TemplateMeta {
  if (!x || typeof x !== "object") return false;
  const m = x as Record<string, unknown>;
  if (
    typeof m.title !== "string" ||
    typeof m.description !== "string" ||
    typeof m.category !== "string" ||
    !Array.isArray(m.tags) ||
    !(m.kind === "jsx" || m.kind === "html")
  ) {
    return false;
  }
  // `style` is optional; when present it must be one of the known styles.
  if (m.style != null && !TEMPLATE_STYLES.includes(m.style as TemplateStyle)) {
    return false;
  }
  return true;
}

async function readAllFolderTemplates(): Promise<Template[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(TEMPLATES_DIR);
  } catch {
    return [];
  }
  const loaded = await Promise.all(
    entries.map(async (name) => {
      const stat = await fs.stat(path.join(TEMPLATES_DIR, name)).catch(() => null);
      if (!stat || !stat.isDirectory()) return null;
      return readFolderTemplate(name);
    })
  );
  return loaded.filter((t): t is Template => t !== null);
}

// --- `web/` gallery (bulk drops) ---------------------------------------

// Any `.jsx` or `.html` file dropped into `/web` is auto-imported. JSX is
// preferred when both exist for the same slug, because the preview's Babel
// plugin gives JSX templates precise `data-dropin-loc` attributes for
// click-to-select, while HTML falls back to DOM-path indexing. Title,
// description, category, tags are all derived automatically — no per-file
// meta.json required.

async function readWebFile(file: string, kind: TemplateKind): Promise<Template | null> {
  try {
    const slug = file.replace(/\.(jsx|html)$/i, "");
    const source = await fs.readFile(path.join(WEB_DIR, file), "utf-8");
    const title = humanizeSlug(slug);
    const category = categorizeSlug(slug);
    const tags = deriveTags(slug);
    const style = styleFromSlug(slug);
    const description =
      firstMeaningfulLine(source) || `Imported from /web gallery.`;
    return { slug, title, description, category, tags, kind, style, source };
  } catch {
    return null;
  }
}

async function readAllWebTemplates(preferKind: TemplateKind): Promise<Template[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(WEB_DIR);
  } catch {
    return [];
  }
  // Collect every slug that has at least one file; remember which extensions
  // exist for each so we can honour the caller's preferred kind with a
  // sensible fallback when only the other kind is present.
  const bySlug = new Map<string, { jsx?: string; html?: string }>();
  for (const name of entries) {
    const lower = name.toLowerCase();
    const m = lower.match(/^(.+)\.(jsx|html)$/);
    if (!m) continue;
    const slug = name.slice(0, -m[2].length - 1);
    const rec = bySlug.get(slug) || {};
    if (m[2] === "jsx") rec.jsx = name;
    else rec.html = name;
    bySlug.set(slug, rec);
  }

  const alt: TemplateKind = preferKind === "jsx" ? "html" : "jsx";
  const jobs: Array<Promise<Template | null>> = [];
  for (const rec of bySlug.values()) {
    const preferredFile = preferKind === "jsx" ? rec.jsx : rec.html;
    const fallbackFile = preferKind === "jsx" ? rec.html : rec.jsx;
    if (preferredFile) jobs.push(readWebFile(preferredFile, preferKind));
    else if (fallbackFile) jobs.push(readWebFile(fallbackFile, alt));
  }
  const loaded = await Promise.all(jobs);
  return loaded.filter((t): t is Template => t !== null);
}

// --- slug heuristics ---------------------------------------------------

function humanizeSlug(slug: string): string {
  return slug
    .replace(/^\d+-/, "") // strip leading "NN-"
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Map slug keywords to one of plan.md's §10 valid categories:
// Landing | Ecommerce | Portfolio | Marketing | Utility | Dashboard | Blog
function categorizeSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (/(store|product|shop|marketplace|dtc|ecommerce|cart)/.test(s)) return "Ecommerce";
  if (/(portfolio|resume|cv|about-me|personal-brand|creator-hub|link-in-bio|artist)/.test(s)) return "Portfolio";
  if (/(blog|magazine|editorial|newsletter|podcast|article)/.test(s)) return "Blog";
  if (/(dashboard|admin|analytics|saas-app)/.test(s)) return "Dashboard";
  if (/(law|corporate|consulting|agency|firm|studio|b2b|b2c|services|pitch|one-page)/.test(s)) return "Marketing";
  if (/(404|maintenance|coming-soon|pricing|terms|privacy|auth|login|signup)/.test(s)) return "Utility";
  // Default bucket for landings / heroes / grids / most marketing pages
  return "Landing";
}

function deriveTags(slug: string): string[] {
  const tokens = slug
    .toLowerCase()
    .replace(/^\d+-/, "")
    .split("-")
    .filter((t) => t.length > 2 && !/^(a|the|and|with|of)$/.test(t));
  return Array.from(new Set(tokens)).slice(0, 5);
}

// Try to pull a meaningful <title> or meta[description] or the first <h1>/<p>
// text from the HTML to use as the card description.
function firstMeaningfulLine(html: string): string | null {
  const titleMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (titleMatch) return trimTo(titleMatch[1], 160);
  const htmlTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (htmlTitle) return trimTo(stripTags(htmlTitle[1]), 160);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return trimTo(stripTags(h1[1]), 160);
  return null;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function trimTo(s: string, max: number): string {
  const t = s.trim();
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + "…";
}

// --- style assignment --------------------------------------------------
//
// Hand-curated mapping of every web/* and folder slug to one of the five
// style buckets. Slugs absent from this map are intentionally untagged
// (style: null) — utility templates and a couple of niche aesthetics that
// don't fit any cluster cleanly. Force-fitting them would only dilute the
// filter.
//
// Buckets:
//   Stylish   — clean / polished / modern marketing + product surfaces
//   Cyber     — neon / glitch / synthwave / 3D / terminal / vaporwave
//   Brutal    — raw concrete / brutalism / grunge / arcade-hardware
//   Editorial — luxe / fashion / art deco / dark academia / refined print
//   Retro     — Y2K / 90s grunge / cassette / hand-drawn / risograph / op-art

const STYLE_BY_SLUG: Record<string, TemplateStyle> = {
  // Stylish (clean / polished modern)
  "1-aether": "Stylish",
  "2-saas-light": "Stylish",
  "3-saas-dark": "Stylish",
  "4-ai-product-landing": "Stylish",
  "05-mobile-app-landing": "Stylish",
  "06-product-launch-page": "Stylish",
  "07-bento-grid-landing": "Stylish",
  "08-apple-style-hero": "Stylish",
  "09-video-background-style": "Stylish",
  "10-split-screen": "Stylish",
  "11-long-form-sales-letter": "Stylish",
  "12-minimalist-product-store": "Stylish",
  "14-tech-gadget-store": "Stylish",
  "16-subscription-box-landing": "Stylish",
  "17-single-product-dtc": "Stylish",
  "18-marketplace-home": "Stylish",
  "19-minimalist-portfolio": "Stylish",
  "21-developer-portfolio": "Stylish",
  "23-personal-brand-store": "Stylish",
  "24-link-in-bio": "Stylish",
  "25-resume-cv-site": "Stylish",
  "26-about-me-card": "Stylish",
  "27-creator-hub": "Stylish",
  "28-creative-agency": "Stylish",
  "29-corporate-b2c": "Stylish",
  "30-consulting-firm": "Stylish",
  "33-one-page-pitch": "Stylish",
  "35-personal-blog": "Stylish",
  "36-tech-blog": "Stylish",
  "37-newsletter-landing": "Stylish",
  "38-podcast-style": "Stylish",
  "39-doc-hub": "Stylish",
  "45-real-estate-listing": "Stylish",
  "46-travel-tour": "Stylish",
  "47-local-services-business": "Stylish",
  "51-glassmorphism": "Stylish",
  "52-swiss-minimalist": "Stylish",
  "53-claymorphism": "Stylish",
  "56-neumorphism": "Stylish",
  "57-bauhaus": "Stylish",
  "58-oled": "Stylish",
  "60-aurora-gradients": "Stylish",
  "64-isometric": "Stylish",
  "66-monochrome": "Stylish",
  "68-bento-grid-dev": "Stylish",
  "76-material-design": "Stylish",
  "77-mesh-gradient": "Stylish",
  "80-horizontal-scroll": "Stylish",
  "82-nonprofit": "Stylish",
  "85-course-education": "Stylish",
  "86-community-forum": "Stylish",
  "87-medical-care": "Stylish",
  "88-fitness-wellness": "Stylish",
  "hero-landing": "Stylish",

  // Cyber (neon / glitch / 3D / terminal / vaporwave / synthwave)
  "49-three-js": "Cyber",
  "50-cyberpunk-high-tech": "Cyber",
  "54-synthwave": "Cyber",
  "70-terminal-ascii": "Cyber",
  "73-abstract-3d": "Cyber",
  "74-acid-graphics": "Cyber",
  "78-liquid-metal": "Cyber",
  "81-kinetic-kino": "Cyber",
  "84-game-studio": "Cyber",
  "102-neon-glitch-brutalist": "Cyber",
  "103-acid-glass-studio": "Cyber",
  "105-constructivist-bento-terminal": "Cyber",
  "112-crt-glitch-cyber": "Cyber",

  // Brutal (raw / brutalism / grunge / arcade-hardware)
  "20-brutalist-creative-portfolio": "Brutal",
  "48-brutalist-art-style": "Brutal",
  "61-brutalism-raw": "Brutal",
  "79-neo-brutalism": "Brutal",
  "110-arcade-hardware-brutal": "Brutal",
  "111-isometric-grunge-brutal": "Brutal",

  // Editorial (luxe / fashion / art deco / dark academia / refined print)
  "13-editorial-fashion-style": "Editorial",
  "22-photographer-portfolio": "Editorial",
  "31-law-firm": "Editorial",
  "32-studio-showcase": "Editorial",
  "34-editorial-magazine": "Editorial",
  "42-boutique-hotel": "Editorial",
  "44-wedding-invitation": "Editorial",
  "65-typographic-swiss-poster": "Editorial",
  "67-art-deco": "Editorial",
  "72-high-luxury": "Editorial",
  "89-editorial-magazine": "Editorial",
  "91-dark-academia": "Editorial",
  "92-art-noveau": "Editorial",
  "95-constructivist-russian": "Editorial",
  "96-wabi-sabi-imperfect": "Editorial",
  "97-blueprintiachitectural": "Editorial",
  "100-botanical-scientific": "Editorial",
  "101-luxury-watch-editorial": "Editorial",
  "106-neo-classical-editorial": "Editorial",
  "108-ethereal-fashion-noir": "Editorial",
  "109-dark-luxury-occult": "Editorial",

  // Retro (Y2K / 90s / cassette / hand-drawn / risograph / halftone / op-art)
  "55-y2k-web-1-0": "Retro",
  "59-paper-collage": "Retro",
  "62-90s-grunge": "Retro",
  "63-corporate-memphis": "Retro",
  "69-skeuomorphism": "Retro",
  "71-pastel-kawaii": "Retro",
  "75-hand-drawn": "Retro",
  "90-risograph-print": "Retro",
  "93-casette-futurism": "Retro",
  "98.op-art-bendaydots": "Retro",
  "99-midcentury-modern": "Retro",
  "104-halftone-pop-art": "Retro",
  "107-y2k-vaporwave-grid": "Retro",

  // Intentionally untagged (no force-fit):
  //   15-artisan-handmade-store, 94-solarpunk, coming-soon, product-card
};

function styleFromSlug(slug: string): TemplateStyle | null {
  return STYLE_BY_SLUG[slug] ?? null;
}

// --- public API --------------------------------------------------------

export async function getAllTemplates(opts?: {
  preferKind?: TemplateKind;
}): Promise<Template[]> {
  const preferKind = opts?.preferKind ?? "jsx";
  const [folders, webs] = await Promise.all([
    readAllFolderTemplates(),
    readAllWebTemplates(preferKind),
  ]);
  return [...folders, ...webs].sort((a, b) => a.title.localeCompare(b.title));
}

export async function getTemplate(
  slug: string,
  opts?: { preferKind?: TemplateKind }
): Promise<Template | null> {
  // Folder templates (spec §10) win first. The folder loader honours the
  // caller's preferred kind when both `source.jsx` and `source.html` exist
  // (otherwise it falls back to whatever the meta.json declares).
  const folder = await readFolderTemplate(slug, opts);
  if (folder) return folder;

  const preferKind = opts?.preferKind ?? "jsx";
  const preferred = preferKind === "jsx" ? "jsx" : "html";
  const fallback: TemplateKind = preferKind === "jsx" ? "html" : "jsx";
  const preferredFile = await readWebFile(`${slug}.${preferred}`, preferred);
  if (preferredFile) return preferredFile;
  return readWebFile(`${slug}.${fallback}`, fallback);
}

export async function getCategories(): Promise<string[]> {
  const all = await getAllTemplates();
  const set = new Set(all.map((t) => t.category));
  return Array.from(set).sort();
}

// Returns the styles that actually appear on at least one template, in the
// canonical TEMPLATE_STYLES order. Filters out clusters with zero members so
// we don't render a dead button if a future ingest run drops a whole bucket.
export async function getStyles(): Promise<TemplateStyle[]> {
  const all = await getAllTemplates();
  const present = new Set<TemplateStyle>();
  for (const t of all) {
    if (t.style) present.add(t.style);
  }
  return TEMPLATE_STYLES.filter((s) => present.has(s));
}

// Which kinds exist on disk for this slug? For BOTH folder-based and web/
// templates we probe the actual files, not the metadata. Folder templates may
// ship a `source.jsx` and a `source.html` side by side (e.g. coming-soon),
// in which case both kinds are exposed and the workspace renders the JSX↔HTML
// toggle. Single-source folder templates report only their one kind.
export async function listTemplateKinds(slug: string): Promise<TemplateKind[]> {
  // Folder template? Probe the source files directly.
  try {
    const folder = path.join(TEMPLATES_DIR, slug);
    const stat = await fs.stat(folder);
    if (stat.isDirectory()) {
      const kinds: TemplateKind[] = [];
      try {
        await fs.access(path.join(folder, "source.jsx"));
        kinds.push("jsx");
      } catch {}
      try {
        await fs.access(path.join(folder, "source.html"));
        kinds.push("html");
      } catch {}
      if (kinds.length) return kinds;
      // Folder exists but no source files — fall through to web/ probe.
    }
  } catch {
    // Folder doesn't exist; fall through.
  }
  // Web/ template.
  const kinds: TemplateKind[] = [];
  try {
    await fs.access(path.join(WEB_DIR, `${slug}.jsx`));
    kinds.push("jsx");
  } catch {}
  try {
    await fs.access(path.join(WEB_DIR, `${slug}.html`));
    kinds.push("html");
  } catch {}
  return kinds;
}

// Slugs that already have a generated thumbnail in `public/thumbs/`.
// Used by the gallery to decide whether to render the real screenshot or the
// text placeholder tile. A single directory read beats one fs.access per card.
export async function getThumbSlugs(): Promise<Set<string>> {
  try {
    const entries = await fs.readdir(path.join(process.cwd(), "public", "thumbs"));
    const set = new Set<string>();
    for (const e of entries) {
      const m = e.match(/^(.+)\.webp$/i);
      if (m) set.add(m[1]);
    }
    return set;
  } catch {
    return new Set();
  }
}
