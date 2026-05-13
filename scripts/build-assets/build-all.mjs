#!/usr/bin/env node
// Run every asset-build script in sequence. New build scripts get added here
// as Tier 2/3 lands (heroicons, phosphor, tabler, simple-icons, undraw…).
//
// Run via: npm run build:assets

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS = [
  "build-lucide.mjs",
  "build-emoji.mjs",
  "build-heroicons.mjs",
  "build-phosphor.mjs",
  "build-tabler.mjs",
  "build-simple-icons.mjs",
];

function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [path.join(HERE, script)], {
      stdio: "inherit",
      shell: false,
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${script} exit ${code}`))));
    child.on("error", reject);
  });
}

(async () => {
  for (const s of SCRIPTS) await run(s);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
