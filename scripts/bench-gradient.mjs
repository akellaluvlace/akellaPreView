// Smoke test for the gradient helpers in `lib/patterns.ts`. Inline-and-
// isolate convention (matches bench-palette.mjs / bench-style.mjs).
// Re-implements `tailwindClassesForGradient` + `parseGradientClasses`
// from the .ts so this script runs without a build step.
//
// Coverage target: round-trip (build classes → re-parse), 8-direction
// coverage, 3-stop with via, palette stops on the way IN, invalid/empty
// inputs, alpha edge cases (0 / 100 / fractional). Roadmap §4.3 #21.

const TAILWIND_PALETTE = {
  "slate-500": "#64748B",
  "red-500": "#EF4444",
  "blue-500": "#3B82F6",
  "green-500": "#22C55E",
  "purple-500": "#A855F7",
  "pink-500": "#EC4899",
  "white": "#FFFFFF",
  "black": "#000000",
};

function stopClass(prefix, hex, alpha) {
  const upper = hex.toUpperCase();
  if (alpha >= 100) return `${prefix}-[${upper}]`;
  return `${prefix}-[${upper}]/${Math.round(alpha)}`;
}

function tailwindClassesForGradient(opts) {
  const out = [`bg-gradient-to-${opts.direction}`];
  out.push(stopClass("from", opts.fromHex, opts.fromAlpha));
  if (opts.viaHex) out.push(stopClass("via", opts.viaHex, opts.viaAlpha ?? 100));
  out.push(stopClass("to", opts.toHex, opts.toAlpha));
  return out;
}

const STOP_RE = /^(from|via|to)-(?:\[#([0-9a-fA-F]{3,8})\]|([a-z]+(?:-\d+)?))(?:\/(\d+))?$/;

function decodeStop(cls) {
  const m = cls.match(STOP_RE);
  if (!m) return null;
  const pos = m[1];
  const arbHex = m[2];
  const palette = m[3];
  const suffix = m[4];
  let hex;
  let alpha = 100;
  if (arbHex) {
    let raw = arbHex;
    if (raw.length === 3) raw = raw.split("").map((c) => c + c).join("");
    if (raw.length === 8) {
      hex = `#${raw.slice(0, 6).toUpperCase()}`;
      alpha = Math.round((parseInt(raw.slice(6, 8), 16) / 255) * 100);
    } else if (raw.length === 6) {
      hex = `#${raw.toUpperCase()}`;
    } else {
      return null;
    }
  } else if (palette) {
    const lookup = TAILWIND_PALETTE[palette];
    if (!lookup) return null;
    hex = lookup;
  } else {
    return null;
  }
  if (suffix) {
    const n = Number(suffix);
    if (Number.isFinite(n)) alpha = Math.max(0, Math.min(100, n));
  }
  return { pos, hex, alpha };
}

function parseGradientClasses(classes) {
  let direction = null;
  let from = null;
  let via = null;
  let to = null;
  for (const c of classes) {
    const dirM = c.match(/^bg-gradient-to-(t|tr|r|br|b|bl|l|tl)$/);
    if (dirM) {
      direction = dirM[1];
      continue;
    }
    const stop = decodeStop(c);
    if (!stop) continue;
    if (stop.pos === "from") from = { hex: stop.hex, alpha: stop.alpha };
    else if (stop.pos === "via") via = { hex: stop.hex, alpha: stop.alpha };
    else if (stop.pos === "to") to = { hex: stop.hex, alpha: stop.alpha };
  }
  if (!direction || !from || !to) return null;
  return {
    direction,
    fromHex: from.hex,
    fromAlpha: from.alpha,
    viaHex: via?.hex ?? null,
    viaAlpha: via?.alpha ?? 100,
    toHex: to.hex,
    toAlpha: to.alpha,
  };
}

// --- bench harness ---------------------------------------------------------

let pass = 0;
let fail = 0;
const failures = [];

function test(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass++;
  } else {
    fail++;
    failures.push({ name, actual, expected });
  }
}

// --- tailwindClassesForGradient: shape -------------------------------------

test("2-stop r direction full alpha",
  tailwindClassesForGradient({
    direction: "r",
    fromHex: "#FF4D2E", fromAlpha: 100,
    toHex: "#0F0F0F", toAlpha: 100,
  }),
  ["bg-gradient-to-r", "from-[#FF4D2E]", "to-[#0F0F0F]"]);

test("3-stop with via",
  tailwindClassesForGradient({
    direction: "br",
    fromHex: "#FF0000", fromAlpha: 100,
    viaHex: "#00FF00", viaAlpha: 100,
    toHex: "#0000FF", toAlpha: 100,
  }),
  ["bg-gradient-to-br", "from-[#FF0000]", "via-[#00FF00]", "to-[#0000FF]"]);

test("alpha-50 stops use /N suffix",
  tailwindClassesForGradient({
    direction: "t",
    fromHex: "#abcdef", fromAlpha: 50,
    toHex: "#fedcba", toAlpha: 30,
  }),
  ["bg-gradient-to-t", "from-[#ABCDEF]/50", "to-[#FEDCBA]/30"]);

test("alpha-100 omits /N suffix",
  tailwindClassesForGradient({
    direction: "l",
    fromHex: "#000000", fromAlpha: 100,
    toHex: "#FFFFFF", toAlpha: 100,
  }),
  ["bg-gradient-to-l", "from-[#000000]", "to-[#FFFFFF]"]);

test("hex case is normalized to upper",
  tailwindClassesForGradient({
    direction: "tr",
    fromHex: "#ff4d2e", fromAlpha: 100,
    toHex: "#aabbcc", toAlpha: 100,
  }),
  ["bg-gradient-to-tr", "from-[#FF4D2E]", "to-[#AABBCC]"]);

// --- 8-direction coverage --------------------------------------------------

const DIRS = ["t", "tr", "r", "br", "b", "bl", "l", "tl"];
for (const d of DIRS) {
  const classes = tailwindClassesForGradient({
    direction: d,
    fromHex: "#FF0000", fromAlpha: 100,
    toHex: "#00FF00", toAlpha: 100,
  });
  test(`${d}: gradient class is bg-gradient-to-${d}`,
    classes[0],
    `bg-gradient-to-${d}`);
}

// --- parseGradientClasses: happy paths -------------------------------------

test("round-trip: 2-stop r direction",
  parseGradientClasses(["bg-gradient-to-r", "from-[#FF4D2E]", "to-[#0F0F0F]"]),
  {
    direction: "r",
    fromHex: "#FF4D2E", fromAlpha: 100,
    viaHex: null, viaAlpha: 100,
    toHex: "#0F0F0F", toAlpha: 100,
  });

test("round-trip: 3-stop br direction",
  parseGradientClasses(["bg-gradient-to-br", "from-[#FF0000]", "via-[#00FF00]", "to-[#0000FF]"]),
  {
    direction: "br",
    fromHex: "#FF0000", fromAlpha: 100,
    viaHex: "#00FF00", viaAlpha: 100,
    toHex: "#0000FF", toAlpha: 100,
  });

test("round-trip: with alpha suffix",
  parseGradientClasses(["bg-gradient-to-t", "from-[#ABCDEF]/50", "to-[#FEDCBA]/30"]),
  {
    direction: "t",
    fromHex: "#ABCDEF", fromAlpha: 50,
    viaHex: null, viaAlpha: 100,
    toHex: "#FEDCBA", toAlpha: 30,
  });

test("8-digit hex unpacks alpha to /100",
  parseGradientClasses(["bg-gradient-to-r", "from-[#FF000080]", "to-[#000000]"]),
  {
    direction: "r",
    fromHex: "#FF0000", fromAlpha: 50,  // 0x80 = 128 → 128/255 = 50.196 → 50
    viaHex: null, viaAlpha: 100,
    toHex: "#000000", toAlpha: 100,
  });

test("3-digit hex expands to 6-digit",
  parseGradientClasses(["bg-gradient-to-r", "from-[#abc]", "to-[#def]"]),
  {
    direction: "r",
    fromHex: "#AABBCC", fromAlpha: 100,
    viaHex: null, viaAlpha: 100,
    toHex: "#DDEEFF", toAlpha: 100,
  });

test("palette stop names on the way in",
  parseGradientClasses(["bg-gradient-to-r", "from-slate-500", "to-red-500"]),
  {
    direction: "r",
    fromHex: "#64748B", fromAlpha: 100,
    viaHex: null, viaAlpha: 100,
    toHex: "#EF4444", toAlpha: 100,
  });

test("palette + alpha suffix",
  parseGradientClasses(["bg-gradient-to-r", "from-slate-500/30", "to-red-500/70"]),
  {
    direction: "r",
    fromHex: "#64748B", fromAlpha: 30,
    viaHex: null, viaAlpha: 100,
    toHex: "#EF4444", toAlpha: 70,
  });

test("base palette names: white / black",
  parseGradientClasses(["bg-gradient-to-r", "from-white", "to-black"]),
  {
    direction: "r",
    fromHex: "#FFFFFF", fromAlpha: 100,
    viaHex: null, viaAlpha: 100,
    toHex: "#000000", toAlpha: 100,
  });

test("class order doesn't matter",
  parseGradientClasses(["to-[#0F0F0F]", "from-[#FF4D2E]", "bg-gradient-to-r"]),
  {
    direction: "r",
    fromHex: "#FF4D2E", fromAlpha: 100,
    viaHex: null, viaAlpha: 100,
    toHex: "#0F0F0F", toAlpha: 100,
  });

test("interleaved unrelated classes",
  parseGradientClasses(["flex", "bg-gradient-to-r", "p-4", "from-[#FF4D2E]", "rounded-lg", "to-[#0F0F0F]"]),
  {
    direction: "r",
    fromHex: "#FF4D2E", fromAlpha: 100,
    viaHex: null, viaAlpha: 100,
    toHex: "#0F0F0F", toAlpha: 100,
  });

// --- parseGradientClasses: failure modes -----------------------------------

test("missing direction → null",
  parseGradientClasses(["from-[#FF4D2E]", "to-[#0F0F0F]"]),
  null);

test("missing from → null",
  parseGradientClasses(["bg-gradient-to-r", "to-[#0F0F0F]"]),
  null);

test("missing to → null",
  parseGradientClasses(["bg-gradient-to-r", "from-[#FF4D2E]"]),
  null);

test("empty class list → null",
  parseGradientClasses([]),
  null);

test("non-gradient classes → null",
  parseGradientClasses(["flex", "p-4", "bg-slate-500"]),
  null);

test("invalid direction → null",
  parseGradientClasses(["bg-gradient-to-xyz", "from-[#FF4D2E]", "to-[#0F0F0F]"]),
  null);

test("malformed hex (5 chars) → ignored, missing → null",
  parseGradientClasses(["bg-gradient-to-r", "from-[#abcde]", "to-[#0F0F0F]"]),
  null);

// --- multi-bench: round-trip integrity for all 8 directions ----------------

for (const d of DIRS) {
  const built = tailwindClassesForGradient({
    direction: d,
    fromHex: "#112233", fromAlpha: 75,
    viaHex: "#445566", viaAlpha: 50,
    toHex: "#778899", toAlpha: 25,
  });
  const parsed = parseGradientClasses(built);
  test(`round-trip-with-via direction=${d}`,
    parsed,
    {
      direction: d,
      fromHex: "#112233", fromAlpha: 75,
      viaHex: "#445566", viaAlpha: 50,
      toHex: "#778899", toAlpha: 25,
    });
}

// --- summary ---------------------------------------------------------------

console.log(`bench-gradient: ${pass}/${pass + fail} passed`);
if (fail > 0) {
  console.log("\nFailures:");
  for (const f of failures) {
    console.log(`  - ${f.name}`);
    console.log(`      actual:   ${JSON.stringify(f.actual)}`);
    console.log(`      expected: ${JSON.stringify(f.expected)}`);
  }
  process.exit(1);
}
