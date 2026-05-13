// Ad-hoc smoke test for `lib/ast/flip.ts detectDrift`. Pure logic, so we
// inline the module's threshold + the function and exercise the
// > 1 px-on-any-side gate plus the vanished-canonical edge case.
//
// Per CLAUDE.md "no test harnesses unless asked" this is a one-off
// developer-introspection script, not a CI gate. Fire
// `node scripts/bench-flip.mjs` from repo root after touching flip.ts.

const FLIP_THRESHOLD_PX = 1;

function detectDrift(from, last) {
  if (last.width <= 0 || last.height <= 0) return null;
  const dxLeft = from.x - last.x;
  const dyTop = from.y - last.y;
  const dxRight = from.x + from.width - (last.x + last.width);
  const dyBottom = from.y + from.height - (last.y + last.height);
  const stable =
    Math.abs(dxLeft) <= FLIP_THRESHOLD_PX &&
    Math.abs(dyTop) <= FLIP_THRESHOLD_PX &&
    Math.abs(dxRight) <= FLIP_THRESHOLD_PX &&
    Math.abs(dyBottom) <= FLIP_THRESHOLD_PX;
  if (stable) return null;
  return {
    dx: dxLeft,
    dy: dyTop,
    sx: from.width / last.width,
    sy: from.height / last.height,
  };
}

function approxEq(a, b, eps = 1e-6) {
  return Math.abs(a - b) < eps;
}

const cases = [
  {
    name: "[flip] identical rects → null (no drift)",
    from: { x: 100, y: 200, width: 320, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: null,
  },
  {
    name: "[flip] sub-px positional drift (0.5 / 0.5) → null",
    from: { x: 100.5, y: 200.5, width: 320, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: null,
  },
  {
    name: "[flip] exactly 1 px positional drift on x → null (boundary inclusive)",
    from: { x: 101, y: 200, width: 320, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: null,
  },
  {
    name: "[flip] 1.5 px positional drift on x → deltas (left+right both shift)",
    from: { x: 101.5, y: 200, width: 320, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: { dx: 1.5, dy: 0, sx: 1, sy: 1 },
  },
  {
    name: "[flip] 1.5 px negative drift on y (shrunk up) → deltas",
    from: { x: 100, y: 198.5, width: 320, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: { dx: 0, dy: -1.5, sx: 1, sy: 1 },
  },
  {
    name: "[flip] 0.8 px width grow → null (under threshold per side)",
    from: { x: 100, y: 200, width: 320.8, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: null,
  },
  {
    name: "[flip] 1.6 px width grow (right-edge drift) → deltas",
    from: { x: 100, y: 200, width: 321.6, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: { dx: 0, dy: 0, sx: 321.6 / 320, sy: 1 },
  },
  {
    name: "[flip] 6.4 px width grow (2% scale) → deltas",
    from: { x: 100, y: 200, width: 326.4, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: { dx: 0, dy: 0, sx: 326.4 / 320, sy: 1 },
  },
  {
    name: "[flip] 0.96 px height grow → null (under threshold)",
    from: { x: 100, y: 200, width: 320, height: 48.96 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: null,
  },
  {
    name: "[flip] vanished canonical (zero width) → null (no animation possible)",
    from: { x: 100, y: 200, width: 320, height: 48 },
    last: { x: 0, y: 0, width: 0, height: 48 },
    expect: null,
  },
  {
    name: "[flip] vanished canonical (zero height) → null",
    from: { x: 100, y: 200, width: 320, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 0 },
    expect: null,
  },
  {
    name: "[flip] both rects vanished → null",
    from: { x: 100, y: 200, width: 0, height: 0 },
    last: { x: 100, y: 200, width: 0, height: 0 },
    expect: null,
  },
  {
    name: "[flip] mixed: 2 px positional + width grow → deltas",
    from: { x: 100, y: 200, width: 200, height: 60 },
    last: { x: 102, y: 200, width: 210, height: 60 },
    expect: { dx: -2, dy: 0, sx: 200 / 210, sy: 1 },
  },
  {
    name: "[flip] big drift: snap rounded 248→250 → deltas (right-edge -2)",
    from: { x: 100, y: 200, width: 248, height: 48 },
    last: { x: 100, y: 200, width: 250, height: 48 },
    expect: { dx: 0, dy: 0, sx: 248 / 250, sy: 1 },
  },
  {
    name: "[flip] full element move: parent flex-wrap pushed it down → deltas",
    from: { x: 100, y: 200, width: 320, height: 48 },
    last: { x: 0, y: 248, width: 320, height: 48 },
    expect: { dx: 100, dy: -48, sx: 1, sy: 1 },
  },
  {
    name: "[flip] center-anchored width change: 4 px grow each side → deltas (left -4, right +4)",
    from: { x: 104, y: 200, width: 312, height: 48 },
    last: { x: 100, y: 200, width: 320, height: 48 },
    expect: { dx: 4, dy: 0, sx: 312 / 320, sy: 1 },
  },
];

let passed = 0;
let failed = 0;

for (const c of cases) {
  const r = detectDrift(c.from, c.last);
  let ok = false;
  if (c.expect === null) {
    ok = r === null;
  } else if (r) {
    ok =
      approxEq(r.dx, c.expect.dx) &&
      approxEq(r.dy, c.expect.dy) &&
      approxEq(r.sx, c.expect.sx) &&
      approxEq(r.sy, c.expect.sy);
  }
  console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
  if (!ok) {
    console.log(`    got     : ${JSON.stringify(r)}`);
    console.log(`    expected: ${JSON.stringify(c.expect)}`);
    failed++;
  } else {
    passed++;
  }
}

console.log(`\n${passed}/${cases.length} passed${failed ? `, ${failed} FAILED` : ""}`);
process.exit(failed > 0 ? 1 : 0);
