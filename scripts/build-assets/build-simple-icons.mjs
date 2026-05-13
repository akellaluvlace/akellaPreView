#!/usr/bin/env node
// Simple Icons (~3400 brand logos as SVG) plus their official brand hex.
// Each entry: { slug, title, hex, body }. The panel renders at the brand
// color by default and offers a "monochrome" toggle that swaps fill to
// `currentColor` at insert time.

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const META_PATH = path.join(
  ROOT, "node_modules", "simple-icons", "data", "simple-icons.json"
);
const ICONS_DIR = path.join(ROOT, "node_modules", "simple-icons", "icons");
const OUT = path.join(ROOT, "public", "data", "assets", "simple-icons.json");

function extractInnerBody(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!m) return "";
  // Drop the <title> tag — at insert time we let the user's alt text or
  // their own context describe the icon. Keeping it bloats the JSON.
  return m[1]
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .trim();
}

async function main() {
  const meta = JSON.parse(await fs.readFile(META_PATH, "utf-8"));
  const out = [];
  for (const m of meta) {
    const file = path.join(ICONS_DIR, `${m.slug}.svg`);
    let svg;
    try {
      svg = await fs.readFile(file, "utf-8");
    } catch {
      continue;
    }
    const body = extractInnerBody(svg);
    if (!body) continue;
    out.push({ slug: m.slug, title: m.title, hex: m.hex, body });
  }
  out.sort((a, b) => a.title.localeCompare(b.title));
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(out));
  console.log(`✓ simple-icons: wrote ${out.length} brand logos → ${path.relative(ROOT, OUT)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
