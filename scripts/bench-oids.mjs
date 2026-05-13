// Ad-hoc smoke test for `lib/ast/oids.ts makeOid` determinism (tenth-pass
// hydration fix). Per CLAUDE.md gotcha #13, the OID generator must produce
// identical output for the same source on SSR and client — non-determinism
// (Math.random) caused intermittent hydration mismatches and a double iframe
// rebuild that flake'd unpkg.com's CORS preflight cache.
//
// This script verifies:
//   1. `makeOid(seed)` is deterministic — same seed → same output across calls.
//   2. Different seeds produce different outputs (no collisions at typical
//      parse-offset spacing).
//   3. `makeOid()` (no seed) falls back to random — different per call.
//   4. The encoded length is exactly OID_LEN (8 chars).
//   5. The encoded string only contains characters from ALPHA.
//
// Per CLAUDE.md "no test harnesses unless asked" this is a one-off
// developer-introspection script, not a CI gate. Run via
// `node scripts/bench-oids.mjs` from repo root after touching makeOid.
//
// We inline the function (instead of importing the TS module) so the script
// runs without a build step — same pattern as bench-resize.mjs / bench-snap.mjs.

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const OID_LEN = 8;

function makeOid(seed) {
  if (typeof seed === "number" && Number.isFinite(seed) && seed >= 0) {
    const N = ALPHA.length;
    let n = Math.floor(seed) >>> 0;
    let s = "";
    for (let i = 0; i < OID_LEN; i++) {
      s = ALPHA[n % N] + s;
      n = Math.floor(n / N);
    }
    return s;
  }
  let id = "";
  for (let i = 0; i < OID_LEN; i++) {
    id += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  }
  return id;
}

const cases = [
  // 1. Determinism — same seed twice, same output.
  {
    name: "[oid] determinism — makeOid(0) twice returns same value",
    test: () => makeOid(0) === makeOid(0),
  },
  {
    name: "[oid] determinism — makeOid(12345) twice returns same value",
    test: () => makeOid(12345) === makeOid(12345),
  },
  {
    name: "[oid] determinism — makeOid(999999) twice returns same value",
    test: () => makeOid(999999) === makeOid(999999),
  },
  // 2. Specific encodings (verify the algorithm).
  {
    name: "[oid] makeOid(0) → 'aaaaaaaa' (zero seed → all-zeros encoding)",
    test: () => makeOid(0) === "aaaaaaaa",
    detail: () => makeOid(0),
  },
  {
    name: "[oid] makeOid(1) → 'aaaaaaab' (seed 1 → last char is index-1)",
    test: () => makeOid(1) === "aaaaaaab",
    detail: () => makeOid(1),
  },
  {
    name: "[oid] makeOid(61) → 'aaaaaaa9' (last char is ALPHA[61] = '9')",
    test: () => makeOid(61) === "aaaaaaa9",
    detail: () => makeOid(61),
  },
  {
    name: "[oid] makeOid(62) → 'aaaaaaba' (rolls over to 2nd-to-last position)",
    test: () => makeOid(62) === "aaaaaaba",
    detail: () => makeOid(62),
  },
  // 3. Length + alphabet.
  {
    name: "[oid] makeOid(N) returns length-8 string for various N",
    test: () =>
      [0, 1, 100, 12345, 999999, 7919, 1e9].every((n) => makeOid(n).length === 8),
  },
  {
    name: "[oid] all encoded chars are in ALPHA",
    test: () => {
      const set = new Set(ALPHA);
      for (const n of [0, 1, 100, 12345, 999999, 7919, 1e9]) {
        const id = makeOid(n);
        for (const c of id) if (!set.has(c)) return false;
      }
      return true;
    },
  },
  // 4. Distinctness — different seeds produce different outputs (no collisions
  //    in the small-distance regime where parse offsets typically fall).
  {
    name: "[oid] distinct seeds produce distinct OIDs (100 seeds, no collisions)",
    test: () => {
      const seen = new Set();
      for (let i = 0; i < 100; i++) {
        const id = makeOid(i);
        if (seen.has(id)) return false;
        seen.add(id);
      }
      return seen.size === 100;
    },
  },
  // 5. Random fallback — no seed = different output each call (probabilistic).
  {
    name: "[oid] makeOid() with no seed → random (10 calls produce ≥9 distinct)",
    test: () => {
      const seen = new Set();
      for (let i = 0; i < 10; i++) seen.add(makeOid());
      // 1-in-218T odds per pair; 10 calls = 45 pairs; probability of even
      // ONE collision ≈ 0. So expecting ≥9 distinct is very lenient.
      return seen.size >= 9;
    },
  },
  // 6. Cross-process determinism check — encode a few seeds and assert exact
  //    string output. If a future refactor changes ALPHA or OID_LEN, these
  //    fail loudly so we know hydration is at risk.
  {
    name: "[oid] specific known encodings stable across versions",
    // If these fail after a refactor, ALPHA or OID_LEN changed — review
    // hydration impact before bumping. base-62 encoding of (seed=100, 7919,
    // 123456) using ALPHA = a-z A-Z 0-9.
    test: () =>
      makeOid(100) === "aaaaaabM" &&
      makeOid(7919) === "aaaaacdT" &&
      makeOid(123456) === "aaaaaGho",
    detail: () => `100→${makeOid(100)} 7919→${makeOid(7919)} 123456→${makeOid(123456)}`,
  },
];

let passed = 0;
let failed = 0;

for (const c of cases) {
  let ok = false;
  try {
    ok = c.test();
  } catch (e) {
    console.log(`FAIL: ${c.name}`);
    console.log(`  → threw: ${e.message}`);
    failed++;
    continue;
  }
  console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
  if (c.detail) {
    try {
      console.log(`  → ${c.detail()}`);
    } catch {}
  }
  if (ok) passed++;
  else failed++;
}

console.log(`\n${passed}/${cases.length} passed${failed ? `, ${failed} FAILED` : ""}`);
process.exit(failed > 0 ? 1 : 0);
