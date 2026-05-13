#!/usr/bin/env node
// Main ingest orchestrator for the component library.
//   1. Shallow-clone (or `git pull`) uiverse-io/galaxy and markmead/hyperui
//      into .cache/ingest/. That dir is gitignored; only the derived /public
//      artifacts land in git.
//   2. Walk both repos, build `{meta, full}[]`.
//   3. Write index.json / search.json / <slug>.json to /public/data/components.
//   4. Render thumbnails to /public/component-thumbs (puppeteer).
//
// Usage:
//   node scripts/ingest-components.mjs              # full run
//   node scripts/ingest-components.mjs --no-thumbs  # skip puppeteer step
//   node scripts/ingest-components.mjs --limit 40   # sample slice (both sources)
//   node scripts/ingest-components.mjs --source uiverse   # one source only
//
// Flags compose: --limit + --source is valid, --no-thumbs disables step 4.

import { promises as fs } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

import { ingestUiverse } from "./ingest/uiverse.mjs";
import { ingestHyperUI } from "./ingest/hyperui.mjs";
import { writeArtifacts } from "./ingest/write-index.mjs";
import { renderComponentThumbs } from "./ingest/thumbs.mjs";

const REPO_ROOT = process.cwd();
const CACHE_DIR = path.join(REPO_ROOT, ".cache", "ingest");
const UIVERSE_DIR = path.join(CACHE_DIR, "uiverse");
const HYPERUI_DIR = path.join(CACHE_DIR, "hyperui");
const OUT_ROOT = path.join(REPO_ROOT, "public", "data", "components");
const THUMBS_DIR = path.join(REPO_ROOT, "public", "component-thumbs");

function parseArgs(argv) {
  const args = { limit: Infinity, source: "all", thumbs: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--no-thumbs") args.thumbs = false;
    else if (a === "--limit") args.limit = Number(argv[++i]) || Infinity;
    else if (a.startsWith("--limit=")) args.limit = Number(a.slice(8)) || Infinity;
    else if (a === "--source") args.source = argv[++i] || "all";
    else if (a.startsWith("--source=")) args.source = a.slice(9);
  }
  return args;
}

function run(cmd, opts = {}) {
  process.stdout.write(`$ ${cmd}\n`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

async function ensureClone(url, targetDir, { shallow = true } = {}) {
  await fs.mkdir(path.dirname(targetDir), { recursive: true });
  try {
    const st = await fs.stat(path.join(targetDir, ".git"));
    if (st.isDirectory()) {
      // Existing clone — refresh. Keep `--depth 1` history to stay lightweight.
      run(`git -C "${targetDir}" fetch --depth 1 origin HEAD`);
      run(`git -C "${targetDir}" reset --hard FETCH_HEAD`);
      return;
    }
  } catch {}
  const depth = shallow ? "--depth 1" : "";
  run(`git clone ${depth} ${url} "${targetDir}"`);
}

async function collectAll({ limit, source }) {
  const records = [];
  const perSourceLimit = Number.isFinite(limit) ? limit : Infinity;

  if (source === "all" || source === "uiverse") {
    process.stdout.write(`▶ Uiverse: walking ${UIVERSE_DIR}\n`);
    let cnt = 0;
    for await (const rec of ingestUiverse({
      rootDir: UIVERSE_DIR,
      onProgress: (p) => {
        if (p.error) process.stdout.write(`  ! uiverse ${p.filename}: ${p.error}\n`);
      },
    })) {
      records.push(rec);
      cnt++;
      if (cnt >= perSourceLimit) break;
    }
    process.stdout.write(`  uiverse: ${cnt} records\n`);
  }

  if (source === "all" || source === "hyperui") {
    process.stdout.write(`▶ HyperUI: walking ${HYPERUI_DIR}\n`);
    let cnt = 0;
    for await (const rec of ingestHyperUI({
      rootDir: HYPERUI_DIR,
      onProgress: (p) => {
        if (p.error) process.stdout.write(`  ! hyperui ${p.filename}: ${p.error}\n`);
      },
    })) {
      records.push(rec);
      cnt++;
      if (cnt >= perSourceLimit) break;
    }
    process.stdout.write(`  hyperui: ${cnt} records\n`);
  }

  // Dedup by slug (very occasionally a file is duplicated across Uiverse
  // categories; last-write-wins is fine since the record content is identical).
  const bySlug = new Map();
  for (const r of records) bySlug.set(r.meta.slug, r);
  return [...bySlug.values()].sort((a, b) =>
    a.meta.title.localeCompare(b.meta.title)
  );
}

async function main() {
  const t0 = Date.now();
  const args = parseArgs(process.argv.slice(2));
  process.stdout.write(
    `▶ Dropin component ingest — source=${args.source} limit=${
      Number.isFinite(args.limit) ? args.limit : "∞"
    } thumbs=${args.thumbs}\n`
  );

  await fs.mkdir(CACHE_DIR, { recursive: true });
  if (args.source === "all" || args.source === "uiverse") {
    await ensureClone("https://github.com/uiverse-io/galaxy.git", UIVERSE_DIR);
  }
  if (args.source === "all" || args.source === "hyperui") {
    await ensureClone("https://github.com/markmead/hyperui.git", HYPERUI_DIR);
  }

  const records = await collectAll(args);
  process.stdout.write(`▶ ${records.length} records collected in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);

  if (records.length === 0) {
    process.stderr.write("no records; aborting before writing empty artifacts\n");
    process.exit(1);
  }

  process.stdout.write(`▶ Writing artifacts → ${OUT_ROOT}\n`);
  const artifactSummary = await writeArtifacts({ outRoot: OUT_ROOT, records });
  process.stdout.write(
    `  ✓ ${artifactSummary.total} slug json, ${artifactSummary.categories} categories, sources=${JSON.stringify(artifactSummary.sources)}\n`
  );

  if (args.thumbs) {
    process.stdout.write(`▶ Rendering thumbnails → ${THUMBS_DIR}\n`);
    const thumbSummary = await renderComponentThumbs(records, THUMBS_DIR);
    process.stdout.write(
      `  ✓ thumbs: ${thumbSummary.ok} captured, ${thumbSummary.skipped} skipped, ${thumbSummary.failed.length} failed\n`
    );
    if (thumbSummary.failed.length) {
      for (const f of thumbSummary.failed.slice(0, 10)) {
        process.stdout.write(`    - ${f.slug}: ${f.error}\n`);
      }
      if (thumbSummary.failed.length > 10) {
        process.stdout.write(`    … and ${thumbSummary.failed.length - 10} more\n`);
      }
    }
  } else {
    process.stdout.write(`▶ Skipping thumbnails (--no-thumbs)\n`);
  }

  const dur = ((Date.now() - t0) / 1000).toFixed(1);
  process.stdout.write(`✓ Ingest complete in ${dur}s on ${os.platform()} ${os.release()}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
