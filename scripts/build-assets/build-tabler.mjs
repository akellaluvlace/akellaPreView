#!/usr/bin/env node
// Tabler icons: outline + filled. ~5000 outline + ~1000 filled.
// Single JSON, entries: { name, style, body } similar to Lucide / Heroicons.

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const BASE = path.join(ROOT, "node_modules", "@tabler", "icons", "icons");
const OUT = path.join(ROOT, "public", "data", "assets", "tabler.json");

function extractInnerBody(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!m) return "";
  return m[1].replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").trim();
}

async function readStyle(style) {
  const dir = path.join(BASE, style);
  let files;
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".svg"));
  } catch {
    return [];
  }
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
  const [outline, filled] = await Promise.all([readStyle("outline"), readStyle("filled")]);
  const out = [...outline, ...filled].sort((a, b) =>
    a.name === b.name ? a.style.localeCompare(b.style) : a.name.localeCompare(b.name)
  );
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(out));
  console.log(`✓ tabler: wrote ${out.length} icons → ${path.relative(ROOT, OUT)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
