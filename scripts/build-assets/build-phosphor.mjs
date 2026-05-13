#!/usr/bin/env node
// Phosphor ships SIX weights: thin / light / regular / bold / fill / duotone.
// 1500+ icons × 6 weights × ~500B = ~4.5MB. Per the spec, we emit one JSON
// PER WEIGHT so the panel can lazy-load weights on demand and the initial
// bundle stays small (only `phosphor-regular.json` ships at first interact).
//
// File names: public/data/assets/phosphor-{weight}.json
// Each entry: { name, body }

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const BASE = path.join(ROOT, "node_modules", "@phosphor-icons", "core", "assets");
const OUT_DIR = path.join(ROOT, "public", "data", "assets");
const WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"];

function extractInnerBody(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!m) return "";
  return m[1].replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").trim();
}

// Phosphor's "duotone" and "fill" weights wrap multiple paths; for "fill" we
// drop the duotone-style wrapper. For our purposes we keep the body as-is —
// the panel renders inside an outer <svg> with phosphor's expected viewBox
// (256x256), and applies the user's chosen color via `fill="currentColor"`.
async function readWeight(weight) {
  const dir = path.join(BASE, weight);
  let files;
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".svg"));
  } catch {
    console.warn(`  ! phosphor weight "${weight}" missing in package, skipping`);
    return [];
  }
  const out = [];
  for (const file of files) {
    let name = file.replace(/\.svg$/i, "");
    // Phosphor non-regular weights suffix the filename: "acorn-bold.svg" etc.
    // Strip the suffix so the panel's per-weight grids share icon names.
    if (weight !== "regular") {
      const suffix = `-${weight}`;
      if (name.endsWith(suffix)) name = name.slice(0, -suffix.length);
    }
    const svg = await fs.readFile(path.join(dir, file), "utf-8");
    const body = extractInnerBody(svg);
    if (body) out.push({ name, body });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const w of WEIGHTS) {
    const data = await readWeight(w);
    const out = path.join(OUT_DIR, `phosphor-${w}.json`);
    await fs.writeFile(out, JSON.stringify(data));
    console.log(`✓ phosphor-${w}: wrote ${data.length} icons → ${path.relative(ROOT, out)}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
