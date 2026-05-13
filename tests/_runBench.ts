// Phase 5 / A2 — bench → vitest bridge.
//
// Each `tests/<name>.test.ts` is a thin wrapper that calls `runBench(name)`.
// The wrapper spawns the existing `scripts/<name>.mjs` as a subprocess (the
// bench files inline their module logic so they need no build), then mirrors
// every `PASS:` / `[PASS]` line as a passing it() and every `FAIL:` /
// `[FAIL]` line as a failing it() with the bench's full stderr/stdout
// attached. An aggregate `(bench exits 0)` it() catches benches that report
// only a final summary (bench-parse, bench-snap), so we don't get a falsely
// green wrapper if a bench failed silently.
//
// Why subprocess + parse instead of re-porting the inline logic to TS:
//  · Single source of truth — `scripts/bench-*.mjs` already encode every
//    case. Re-typing them in TS would drift.
//  · CLAUDE.md "no test harnesses unless asked" tradition: benches stay
//    where they are; tests/ provides the same signal in the vitest reporter
//    so future CI integration is one toggle away.

import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

export function runBench(name: string): void {
  describe(name, () => {
    const r = spawnSync(
      process.execPath,
      [path.join(REPO_ROOT, "scripts", `${name}.mjs`)],
      {
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
        cwd: REPO_ROOT,
      },
    );
    const out = (r.stdout || "") + (r.stderr || "");
    const lines = out.split("\n");

    // Per-case rows. Bench output formats vary across files:
    //   • bench-style / bench-resize / bench-flip emit `PASS: <name>`
    //     and `FAIL: <name>` at column 0.
    //   • bench-parse uses `[PASS]` / `[FAIL]` for one aggregate marker.
    //   • bench-constraints uses `✓` / `✗` prefix.
    //   • bench-tree / bench-palette / bench-presets / bench-tree-filter
    //     emit only a `bench-X: N/N passed` summary line.
    // Match all four so vitest reports per-case granularity wherever
    // possible.
    const PASS_RE = /^\s*(?:PASS:|\[PASS\]|✓\s)\s*/;
    const FAIL_RE = /^\s*(?:FAIL:|\[FAIL\]|✗\s)\s*/;
    const SUMMARY_RE = /^\s*bench-[\w-]+:\s*(\d+)\/(\d+)/;

    let passCount = 0;
    let failCount = 0;
    let summaryEmitted = false;
    for (const line of lines) {
      if (PASS_RE.test(line)) {
        const caseName = line.replace(PASS_RE, "").trim().slice(0, 200);
        const label = `PASS: ${caseName || "(unnamed)"} #${++passCount}`;
        it(label, () => {});
      } else if (FAIL_RE.test(line)) {
        const caseName = line.replace(FAIL_RE, "").trim().slice(0, 200);
        const label = `FAIL: ${caseName || "(unnamed)"} #${++failCount}`;
        it(label, () => {
          throw new Error(
            `bench reported failure on this line:\n  ${line}\n\nFull output:\n${out}`,
          );
        });
      } else {
        const m = SUMMARY_RE.exec(line);
        if (m && !summaryEmitted) {
          summaryEmitted = true;
          const passed = Number(m[1]);
          const total = Number(m[2]);
          // Synthesize per-case it() calls so the reporter shows the same
          // numerator the bench printed. We don't have the per-case names
          // (the bench didn't print them), so they get sequential labels.
          for (let i = 0; i < total; i++) {
            const isPass = i < passed;
            const caseName = `${name} case ${i + 1}/${total}`;
            it(isPass ? `PASS: ${caseName}` : `FAIL: ${caseName}`, () => {
              if (!isPass) {
                throw new Error(
                  `bench summary reported ${passed}/${total} — case ${i + 1} did not pass.\n\nFull output:\n${out}`,
                );
              }
            });
          }
        }
      }
    }

    // Aggregate signal — bench-parse and a few others report only at the
    // end. Exit 0 means the inlined assertions all passed.
    it("(bench exits 0)", () => {
      expect(
        r.status,
        `bench exited ${r.status}; full output:\n${out}`,
      ).toBe(0);
    });
  });
}
