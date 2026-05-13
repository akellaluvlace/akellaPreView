#!/usr/bin/env node
// Measure @babel/parser parse latency over web/*.jsx (the hand-converted
// templates) so we can verify the manipulation system's spec budget:
// "<30 ms p99 on @babel/parser for files up to 1000 lines"
// (`maniuplation.md` Phase 1 → "Parse perf budget benchmark"). Layer 1
// runs the parser on every keystroke that changes Workspace `code`
// (group-roots auto-detect, future inspector queries), so blowing the
// budget means a visibly laggy editor.
//
// Run from repo root:
//   node scripts/bench-parse.mjs
//
// Output: per-file LOC + p50/p99/max parse time across N iterations,
// then aggregate p50/p99/max across all samples. Files that exceed the
// spec budget (either LOC > 1000 or p99 > 30 ms) get flagged inline.
//
// If the aggregate p99 breaches budget, the spec's fallback strategy is
// onBlur-only parse with a "Parsing paused while typing…" indicator.
// We're nowhere near needing that yet, but this script gives us the data
// to make that call rather than guess.

import { parse } from "@babel/parser";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIR = path.resolve(__dirname, "..", "web");

const ITERATIONS = 20;
const LOC_BUDGET = 1000;
const P99_BUDGET_MS = 30;

const PARSE_OPTS = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

function pct(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

function fmt(ms) {
  return ms.toFixed(2);
}

async function main() {
  const entries = await readdir(WEB_DIR);
  const jsxFiles = entries.filter((f) => f.endsWith(".jsx")).sort();
  if (jsxFiles.length === 0) {
    console.error(`no .jsx files in ${WEB_DIR}`);
    process.exit(1);
  }

  console.log(
    `Benchmarking @babel/parser over ${jsxFiles.length} files, ` +
      `${ITERATIONS} iterations each. Budget: p99 < ${P99_BUDGET_MS} ms ` +
      `for files <= ${LOC_BUDGET} LOC.\n`
  );

  console.log(
    "file".padEnd(45) +
      "loc".padStart(7) +
      "p50".padStart(9) +
      "p99".padStart(9) +
      "max".padStart(9) +
      "  flag"
  );
  console.log("-".repeat(82));

  const allSamples = [];
  const flagged = [];

  for (const name of jsxFiles) {
    const src = await readFile(path.join(WEB_DIR, name), "utf8");
    const loc = src.split("\n").length;

    parse(src, PARSE_OPTS);

    const samples = new Array(ITERATIONS);
    for (let i = 0; i < ITERATIONS; i++) {
      const t0 = performance.now();
      parse(src, PARSE_OPTS);
      const t1 = performance.now();
      samples[i] = t1 - t0;
    }

    const p50 = pct(samples, 50);
    const p99 = pct(samples, 99);
    const max = Math.max(...samples);
    allSamples.push(...samples);

    let flag = "";
    if (loc > LOC_BUDGET) flag = "LOC>1000";
    if (p99 > P99_BUDGET_MS) flag = flag ? `${flag},p99>${P99_BUDGET_MS}ms` : `p99>${P99_BUDGET_MS}ms`;
    if (flag) flagged.push({ name, loc, p99, flag });

    console.log(
      name.padEnd(45) +
        String(loc).padStart(7) +
        fmt(p50).padStart(9) +
        fmt(p99).padStart(9) +
        fmt(max).padStart(9) +
        (flag ? `  ${flag}` : "")
    );
  }

  console.log("-".repeat(82));
  const aggP50 = pct(allSamples, 50);
  const aggP99 = pct(allSamples, 99);
  const aggMax = Math.max(...allSamples);
  console.log(
    "AGGREGATE".padEnd(45) +
      "".padStart(7) +
      fmt(aggP50).padStart(9) +
      fmt(aggP99).padStart(9) +
      fmt(aggMax).padStart(9)
  );

  console.log("");
  if (aggP99 <= P99_BUDGET_MS) {
    console.log(
      `[PASS] aggregate p99 ${fmt(aggP99)} ms <= ${P99_BUDGET_MS} ms budget ` +
        `(${fmt(P99_BUDGET_MS - aggP99)} ms headroom).`
    );
  } else {
    console.log(
      `[FAIL] aggregate p99 ${fmt(aggP99)} ms > ${P99_BUDGET_MS} ms budget. ` +
        `Consider onBlur-only parse fallback per maniuplation.md Phase 1 ` +
        `"Parse perf budget benchmark".`
    );
  }

  if (flagged.length > 0) {
    console.log("");
    console.log(`${flagged.length} file(s) flagged:`);
    for (const f of flagged) {
      console.log(`  ${f.name}  loc=${f.loc}  p99=${fmt(f.p99)} ms  [${f.flag}]`);
    }
  } else {
    console.log("No per-file flags.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
