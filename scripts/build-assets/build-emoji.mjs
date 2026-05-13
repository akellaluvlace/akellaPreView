#!/usr/bin/env node
// Pull the unicode-emoji-json dataset and emit a flat JSON array tailored for
// the asset library: each emoji has its character, name, group, slug, and
// whether it supports skin-tone modifiers. Drops the regional flags grouping
// (people don't usually pick country flags from a UI sidebar) but keeps the
// rest of the standard groups.
//
// Run via: npm run build:assets

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const SRC_PATH = path.join(
  ROOT,
  "node_modules",
  "unicode-emoji-json",
  "data-by-group.json"
);
const OUT_PATH = path.join(ROOT, "public", "data", "assets", "emoji.json");

// "Flags" is mostly country flags — visually noisy in a sidebar grid and
// rarely useful for landing-page work. Drop the whole group; keep regional
// ones via the symbols/objects/etc. groups that already include them.
const GROUP_BLOCKLIST = new Set(["Flags"]);

async function main() {
  const groups = JSON.parse(await fs.readFile(SRC_PATH, "utf-8"));
  const out = [];
  for (const group of groups) {
    if (GROUP_BLOCKLIST.has(group.name)) continue;
    for (const e of group.emojis) {
      out.push({
        char: e.emoji,
        name: e.name,
        slug: e.slug,
        group: group.slug,
        groupName: group.name,
        skinTone: !!e.skin_tone_support,
      });
    }
  }

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(out));
  console.log(`✓ emoji: wrote ${out.length} emoji → ${path.relative(ROOT, OUT_PATH)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
