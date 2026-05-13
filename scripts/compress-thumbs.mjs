#!/usr/bin/env node
// Re-encode every `public/thumbs/*.webp` with sharp at a tighter quality +
// max compression effort. Replaces the file in place when the new bytes are
// smaller; skips otherwise. Reports savings and any thumbs the encoder
// couldn't shrink.
//
// Run:  node scripts/compress-thumbs.mjs
//
// Tunables:
//   QUALITY   — target visual quality, 0–100. 60 is the sweet spot for
//               1280x800 thumbnails (visually identical to 78 at half the
//               bytes).
//   EFFORT    — sharp's webp encoder effort, 0–6. 6 = slowest / smallest.
//   ALPHA_Q   — alpha-channel quality. Most thumbs have no alpha so this
//               rarely matters, but cheap insurance against alpha bloat.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const THUMBS_DIR = path.resolve(process.cwd(), "public", "thumbs");
const QUALITY = 60;
const EFFORT = 6;
const ALPHA_Q = 60;

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressOne(file) {
  const full = path.join(THUMBS_DIR, file);
  const before = (await fs.stat(full)).size;
  let buf;
  let openErr;
  // Retry the read+encode on transient Windows file locks (file indexer, IDE,
  // dev server). Read into memory first so the source handle is closed before
  // we write — avoids Windows write-while-reading lock conflicts.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const raw = await fs.readFile(full);
      buf = await sharp(raw)
        .webp({
          quality: QUALITY,
          effort: EFFORT,
          smartSubsample: true,
          alphaQuality: ALPHA_Q,
        })
        .toBuffer();
      openErr = null;
      break;
    } catch (e) {
      openErr = e;
      const code = e?.code || "";
      if (code !== "EPERM" && code !== "EBUSY" && code !== "UNKNOWN" && code !== "ENOENT") break;
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }
  if (openErr || !buf) {
    return {
      file,
      error: openErr instanceof Error ? openErr.message : String(openErr || "no buffer"),
    };
  }
  const after = buf.length;
  if (after >= before) {
    return { file, before, after, skipped: true };
  }
  // Direct write with EPERM retries — Windows often locks files briefly when
  // a dev server / IDE has the path open. Atomic-rename is overkill for a
  // build-time tool; truncate-write is fine.
  let lastErr;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await fs.writeFile(full, buf);
      lastErr = null;
      break;
    } catch (e) {
      lastErr = e;
      if (e?.code !== "EPERM" && e?.code !== "EBUSY") break;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  if (lastErr) {
    return { file, error: lastErr instanceof Error ? lastErr.message : String(lastErr) };
  }
  return { file, before, after };
}

async function main() {
  const all = (await fs.readdir(THUMBS_DIR))
    .filter((f) => f.toLowerCase().endsWith(".webp"))
    .sort();
  console.log(
    `Re-encoding ${all.length} thumbnails @ quality ${QUALITY} effort ${EFFORT} → ${THUMBS_DIR}`
  );

  let totalBefore = 0;
  let totalAfter = 0;
  const results = [];
  // Run a few in parallel for throughput; sharp already uses libvips threads
  // internally so a small concurrency keeps the cores busy without thrashing.
  const CONCURRENCY = 2;
  const queue = [...all];
  const runOne = async () => {
    while (queue.length) {
      const f = queue.shift();
      if (!f) break;
      const r = await compressOne(f);
      results.push(r);
      if (r.error) {
        process.stdout.write(`✗ ${r.file}: ${r.error}\n`);
        continue;
      }
      totalBefore += r.before;
      totalAfter += r.after;
      if (r.skipped) {
        process.stdout.write(
          `· ${r.file}  no gain (${fmtBytes(r.before)} → ${fmtBytes(r.after)})\n`
        );
      } else {
        const pct = (((r.before - r.after) / r.before) * 100).toFixed(1);
        process.stdout.write(
          `✓ ${r.file}  ${fmtBytes(r.before)} → ${fmtBytes(r.after)} (-${pct}%)\n`
        );
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, runOne));

  const savedPct = totalBefore
    ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
    : "0.0";
  console.log(
    `\nDone. ${results.filter((r) => !r.skipped && !r.error).length} re-encoded, ` +
      `${results.filter((r) => r.skipped).length} unchanged, ` +
      `${results.filter((r) => r.error).length} failed.\n` +
      `Total: ${fmtBytes(totalBefore)} → ${fmtBytes(totalAfter)} (-${savedPct}%)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
