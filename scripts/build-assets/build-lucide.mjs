#!/usr/bin/env node
// Pull all Lucide icons from `lucide-static` and emit a single JSON manifest
// to `public/data/assets/lucide.json` for the asset library to consume at
// runtime. The JSON has just the fields we actually need to render and search:
// name, tags, and the raw inner SVG body (paths/lines/circles only — no outer
// <svg> wrapper, so the panel can apply its own width/stroke at insert time).
//
// Run via: npm run build:assets
//
// Output shape:
//   [
//     { "name": "arrow-right", "tags": ["forward", "next", ...], "body": "<path .../>..." },
//     ...
//   ]

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const ICONS_DIR = path.join(ROOT, "node_modules", "lucide-static", "icons");
const TAGS_PATH = path.join(ROOT, "node_modules", "lucide-static", "tags.json");
const OUT_PATH = path.join(ROOT, "public", "data", "assets", "lucide.json");

// Lucide ships each icon as a self-contained `<svg>` with attributes baked
// in (width=24, height=24, stroke=currentColor, stroke-width=2, viewBox, etc.).
// We strip the wrapper so callers can rebuild the SVG with whatever size and
// stroke the user picked at insert time. Keeping ONLY the inner body makes
// the JSON ~30% smaller and makes insertion a simple template assembly.
function extractInnerBody(svgString) {
  const m = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!m) return "";
  // Remove license comment + collapse whitespace between tags.
  return m[1]
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .trim();
}

async function main() {
  const [tagsRaw, files] = await Promise.all([
    fs.readFile(TAGS_PATH, "utf-8"),
    fs.readdir(ICONS_DIR),
  ]);
  const tags = JSON.parse(tagsRaw);

  const svgFiles = files.filter((f) => f.endsWith(".svg"));
  const out = [];
  for (const file of svgFiles) {
    const name = file.replace(/\.svg$/i, "");
    const svg = await fs.readFile(path.join(ICONS_DIR, file), "utf-8");
    const body = extractInnerBody(svg);
    if (!body) continue;
    out.push({ name, tags: tags[name] || [], body });
  }

  out.sort((a, b) => a.name.localeCompare(b.name));
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(out));
  console.log(`✓ lucide: wrote ${out.length} icons → ${path.relative(ROOT, OUT_PATH)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
