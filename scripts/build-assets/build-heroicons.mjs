#!/usr/bin/env node
// Pull Heroicons (24px, outline + solid) and emit a single JSON manifest.
// Same shape as Lucide: { name, style, body } with body = inner SVG only.
//
// Run via: npm run build:assets

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const BASE = path.join(ROOT, "node_modules", "heroicons", "24");
const OUT = path.join(ROOT, "public", "data", "assets", "heroicons.json");

function extractInnerBody(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!m) return "";
  return m[1].replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").trim();
}

async function readStyle(style) {
  const dir = path.join(BASE, style);
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".svg"));
  const out = [];
  for (const file of files) {
    const name = file.replace(/\.svg$/i, "");
    const svg = await fs.readFile(path.join(dir, file), "utf-8");
    const body = extractInnerBody(svg);
    if (body) out.push({ name, style, body });
  }
  return out;
}

async function main() {
  const [outline, solid] = await Promise.all([readStyle("outline"), readStyle("solid")]);
  const out = [...outline, ...solid].sort((a, b) =>
    a.name === b.name ? a.style.localeCompare(b.style) : a.name.localeCompare(b.name)
  );
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(out));
  console.log(`✓ heroicons: wrote ${out.length} icons → ${path.relative(ROOT, OUT)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
