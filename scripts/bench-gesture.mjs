// Ad-hoc smoke test for `lib/ast/gesture-math.ts computeDims`. Pure math
// function (no React, no DOM, no iframe), so we inline a copy of the
// module's logic and exercise the (4b) + (4c-i) + (4c-ii) cases the
// gesture path actually hits.
//
// Each case logs PASS / FAIL and the produced dims. Per CLAUDE.md "no
// test harnesses unless asked" this is a one-off developer-introspection
// script, not a CI gate. Fire `node scripts/bench-gesture.mjs` from repo
// root after touching gesture-math.ts.

const ELASTIC_COEFFICIENT = 0.15;

function applyElasticDim(desired, min) {
  if (desired >= min) return desired;
  const overshoot = min - desired;
  return min - overshoot * ELASTIC_COEFFICIENT;
}

function isCornerHandle(handle) {
  return handle === "tl" || handle === "tr" || handle === "bl" || handle === "br";
}

function captureAspect(startW, startH) {
  if (startW <= 0 || startH <= 0) return null;
  return startW / startH;
}

function computeDims(input, clientX, clientY, modifiers) {
  const { handle, startX, startY, startW, startH, aspect } = input;
  const dx = clientX - startX;
  const dy = clientY - startY;
  const mul = modifiers.alt ? 2 : 1;
  let w = null;
  let h = null;
  switch (handle) {
    case "tl":
      w = startW - dx * mul;
      h = startH - dy * mul;
      break;
    case "tr":
      w = startW + dx * mul;
      h = startH - dy * mul;
      break;
    case "bl":
      w = startW - dx * mul;
      h = startH + dy * mul;
      break;
    case "br":
      w = startW + dx * mul;
      h = startH + dy * mul;
      break;
    case "t":
      h = startH - dy * mul;
      break;
    case "r":
      w = startW + dx * mul;
      break;
    case "b":
      h = startH + dy * mul;
      break;
    case "l":
      w = startW - dx * mul;
      break;
  }
  if (w !== null) w = Math.max(0, w);
  if (h !== null) h = Math.max(0, h);
  if (modifiers.shift && aspect !== null) {
    if (isCornerHandle(handle) && w !== null && h !== null) {
      const dw = Math.abs(w - startW);
      const dh = Math.abs(h - startH);
      if (dw >= dh) h = w / aspect;
      else w = h * aspect;
    } else if ((handle === "r" || handle === "l") && w !== null) {
      h = w / aspect;
    } else if ((handle === "t" || handle === "b") && h !== null) {
      w = h * aspect;
    }
    if (w !== null && w < 0) w = 0;
    if (h !== null && h < 0) h = 0;
  }
  return {
    w: w !== null ? Math.round(w) : null,
    h: h !== null ? Math.round(h) : null,
  };
}

// --- Cases ---

// Standard input shape factory — all cases start from a 200×100 element
// at cursor (100, 100). Tests vary handle, cursor delta, and modifiers.
function gestureFrom({ handle, startW = 200, startH = 100 }) {
  return {
    handle,
    startX: 100,
    startY: 100,
    startW,
    startH,
    aspect: captureAspect(startW, startH),
  };
}

const cases = [
  // (4b) BASELINE — no modifiers.
  {
    name: "[4b] BR drag (+30, +20) → free corner resize",
    input: gestureFrom({ handle: "br" }),
    cursor: [130, 120],
    mods: { shift: false, alt: false, cmd: false },
    expect: { w: 230, h: 120 },
  },
  {
    name: "[4b] R drag (+50, ignore Y) → edge single-axis",
    input: gestureFrom({ handle: "r" }),
    cursor: [150, 9999],
    mods: { shift: false, alt: false, cmd: false },
    expect: { w: 250, h: null },
  },
  {
    name: "[4b] T drag (ignore X, -30) → edge top",
    input: gestureFrom({ handle: "t" }),
    cursor: [9999, 70],
    mods: { shift: false, alt: false, cmd: false },
    expect: { w: null, h: 130 },
  },
  {
    name: "[4b] BR drag (-300, -200) → clamp at 0",
    input: gestureFrom({ handle: "br" }),
    cursor: [-200, -100],
    mods: { shift: false, alt: false, cmd: false },
    expect: { w: 0, h: 0 },
  },

  // (4c-ii) ALT — center-resize doubles delta.
  {
    name: "[4c-ii] BR + Alt (+30, +20) → both axes doubled",
    input: gestureFrom({ handle: "br" }),
    cursor: [130, 120],
    mods: { shift: false, alt: true, cmd: false },
    // startW + 2*30 = 260, startH + 2*20 = 140
    expect: { w: 260, h: 140 },
  },
  {
    name: "[4c-ii] R + Alt (+50, ignore Y) → only width axis doubles",
    input: gestureFrom({ handle: "r" }),
    cursor: [150, 9999],
    mods: { shift: false, alt: true, cmd: false },
    // startW + 2*50 = 300; h untouched
    expect: { w: 300, h: null },
  },
  {
    name: "[4c-ii] TL + Alt (drag inward 20px each axis) → both shrink doubled",
    input: gestureFrom({ handle: "tl" }),
    cursor: [120, 120],
    mods: { shift: false, alt: true, cmd: false },
    // dx=20, dy=20; tl: w = 200 - 2*20 = 160; h = 100 - 2*20 = 60
    expect: { w: 160, h: 60 },
  },

  // (4c-ii) SHIFT — aspect lock. startW/startH = 200/100 = 2:1.
  {
    name: "[4c-ii] BR + Shift, dw>dh → height derived from width",
    input: gestureFrom({ handle: "br" }),
    cursor: [200, 110],
    mods: { shift: true, alt: false, cmd: false },
    // dx=100, dy=10. raw: w=300, h=110. dw=100, dh=10 → w drives → h = 300/2 = 150
    expect: { w: 300, h: 150 },
  },
  {
    name: "[4c-ii] BR + Shift, dh>dw → width derived from height",
    input: gestureFrom({ handle: "br" }),
    cursor: [110, 250],
    mods: { shift: true, alt: false, cmd: false },
    // dx=10, dy=150. raw: w=210, h=250. dw=10, dh=150 → h drives → w = 250*2 = 500
    expect: { w: 500, h: 250 },
  },
  {
    name: "[4c-ii] R + Shift → height derived from width (edge aspect)",
    input: gestureFrom({ handle: "r" }),
    cursor: [200, 9999],
    mods: { shift: true, alt: false, cmd: false },
    // dx=100; w=300, h=null. With Shift+r: h = w/aspect = 300/2 = 150
    expect: { w: 300, h: 150 },
  },
  {
    name: "[4c-ii] T + Shift → width derived from height (edge aspect)",
    input: gestureFrom({ handle: "t" }),
    cursor: [9999, 50],
    mods: { shift: true, alt: false, cmd: false },
    // dy=-50; h=startH-(-50)=150, w=null. With Shift+t: w = h*aspect = 150*2 = 300
    expect: { w: 300, h: 150 },
  },

  // (4c-ii) SHIFT + ALT — both apply.
  {
    name: "[4c-ii] BR + Shift + Alt → doubled delta then aspect lock",
    input: gestureFrom({ handle: "br" }),
    cursor: [130, 120],
    mods: { shift: true, alt: true, cmd: false },
    // dx=30, dy=20. After Alt: w=260, h=140. dw=60, dh=40 → w drives →
    // h = 260/2 = 130
    expect: { w: 260, h: 130 },
  },

  // (4c-ii) Degenerate aspect — Shift no-ops on zero-start element.
  {
    name: "[4c-ii] Shift with zero startH (aspect=null) → free resize",
    input: gestureFrom({ handle: "br", startH: 0 }),
    cursor: [150, 130],
    mods: { shift: true, alt: false, cmd: false },
    // aspect=null → Shift no-ops → raw dims: w=250, h=30
    expect: { w: 250, h: 30 },
  },
];

// (4d) computeSpacing — single-axis padding / margin math.
function computeSpacing(input, clientX, clientY, modifiers) {
  const dx = clientX - input.startX;
  const dy = clientY - input.startY;
  const cursorDelta = input.axis === "x" ? dx : dy;
  const valueDelta = cursorDelta * input.signMul;
  let active = input.startValue + valueDelta;
  let opposite = null;
  if (modifiers.alt) opposite = input.startOppositeValue + valueDelta;
  if (input.kind === "padding") {
    if (active < 0) active = 0;
    if (opposite !== null && opposite < 0) opposite = 0;
  }
  return {
    active: Math.round(active),
    opposite: opposite !== null ? Math.round(opposite) : null,
  };
}

// Standard spacing input shape factory. All cases start at cursor (100, 100)
// with startValue=20px / startOppositeValue=10px to make Alt-symmetric
// asymmetry visible (active and opposite take different baselines).
function spacingInput({ axis, signMul, kind, startValue = 20, startOppositeValue = 10 }) {
  return { axis, signMul, kind, startX: 100, startY: 100, startValue, startOppositeValue };
}

const spacingCases = [
  // PADDING — single-side (no Alt). Test each handle direction.
  {
    name: "[4d] pt drag down +30 → padding-top 50",
    input: spacingInput({ axis: "y", signMul: 1, kind: "padding" }),
    cursor: [100, 130],
    mods: { shift: false, alt: false, cmd: false },
    expect: { active: 50, opposite: null },
  },
  {
    name: "[4d] pb drag up -30 (signMul=-1, dy=-30 → +30 delta) → padding-bottom 50",
    input: spacingInput({ axis: "y", signMul: -1, kind: "padding" }),
    cursor: [100, 70],
    mods: { shift: false, alt: false, cmd: false },
    expect: { active: 50, opposite: null },
  },
  {
    name: "[4d] pl drag right +25 → padding-left 45",
    input: spacingInput({ axis: "x", signMul: 1, kind: "padding" }),
    cursor: [125, 100],
    mods: { shift: false, alt: false, cmd: false },
    expect: { active: 45, opposite: null },
  },
  {
    name: "[4d] pr drag left -25 (signMul=-1) → padding-right 45",
    input: spacingInput({ axis: "x", signMul: -1, kind: "padding" }),
    cursor: [75, 100],
    mods: { shift: false, alt: false, cmd: false },
    expect: { active: 45, opposite: null },
  },
  // PADDING clamp at 0 (heavy negative drag).
  {
    name: "[4d] pt drag up -50 (away from center) → clamp at 0 (no negative padding)",
    input: spacingInput({ axis: "y", signMul: 1, kind: "padding" }),
    cursor: [100, 50],
    // dy=-50, valueDelta=-50, active = 20 + -50 = -30, clamps to 0
    mods: { shift: false, alt: false, cmd: false },
    expect: { active: 0, opposite: null },
  },

  // MARGIN — single-side (no Alt).
  {
    name: "[4d] mt drag up -30 (signMul=-1) → margin-top 50",
    input: spacingInput({ axis: "y", signMul: -1, kind: "margin" }),
    cursor: [100, 70],
    mods: { shift: false, alt: false, cmd: false },
    expect: { active: 50, opposite: null },
  },
  {
    name: "[4d] mr drag right +30 → margin-right 50",
    input: spacingInput({ axis: "x", signMul: 1, kind: "margin" }),
    cursor: [130, 100],
    mods: { shift: false, alt: false, cmd: false },
    expect: { active: 50, opposite: null },
  },
  // MARGIN allows negative (overlap effects).
  {
    name: "[4d] mt drag down +50 (signMul=-1, valueDelta=-50) → margin-top -30 (negative allowed)",
    input: spacingInput({ axis: "y", signMul: -1, kind: "margin" }),
    cursor: [100, 150],
    mods: { shift: false, alt: false, cmd: false },
    expect: { active: -30, opposite: null },
  },

  // ALT — symmetric, opposite side gets same delta with its own baseline.
  {
    name: "[4d] pt + Alt drag down +30 → padding top 50, bottom 40",
    input: spacingInput({ axis: "y", signMul: 1, kind: "padding" }),
    // startValue=20 → active = 50; startOppositeValue=10 → opposite = 40
    cursor: [100, 130],
    mods: { shift: false, alt: true, cmd: false },
    expect: { active: 50, opposite: 40 },
  },
  {
    name: "[4d] mr + Alt drag right +30 → margin right 50, left 40",
    input: spacingInput({ axis: "x", signMul: 1, kind: "margin" }),
    cursor: [130, 100],
    mods: { shift: false, alt: true, cmd: false },
    expect: { active: 50, opposite: 40 },
  },

  // ALT + clamp: heavy negative on padding → both sides clamp at 0.
  {
    name: "[4d] pt + Alt drag up -50 → both sides clamp (active 0, opposite 0)",
    input: spacingInput({ axis: "y", signMul: 1, kind: "padding" }),
    // valueDelta = -50; active = 20+(-50) = -30 → 0; opposite = 10+(-50) = -40 → 0
    cursor: [100, 50],
    mods: { shift: false, alt: true, cmd: false },
    expect: { active: 0, opposite: 0 },
  },

  // SHIFT alone is a no-op for spacing (v1).
  {
    name: "[4d] pt + Shift (no-op for spacing) → same as plain pt",
    input: spacingInput({ axis: "y", signMul: 1, kind: "padding" }),
    cursor: [100, 130],
    mods: { shift: true, alt: false, cmd: false },
    expect: { active: 50, opposite: null },
  },
];

// (4c-i) ELASTIC — pure math test, separate from the above (the gesture
// applies elastic AFTER computeDims so this test isolates the helper).
const elasticCases = [
  {
    name: "[4c-i] applyElasticDim above min → identity",
    desired: 200,
    min: 100,
    expect: 200,
  },
  {
    name: "[4c-i] applyElasticDim at min → identity",
    desired: 100,
    min: 100,
    expect: 100,
  },
  {
    name: "[4c-i] applyElasticDim 50px past min → 92.5",
    desired: 50,
    min: 100,
    // 100 - (100 - 50) * 0.15 = 100 - 7.5 = 92.5
    expect: 92.5,
  },
  {
    name: "[4c-i] applyElasticDim heavy overshoot — bounded by elastic floor",
    desired: -100,
    min: 100,
    // 100 - 200 * 0.15 = 100 - 30 = 70
    expect: 70,
  },
];

// --- Runner ---

let passed = 0;
let failed = 0;

for (const c of cases) {
  const r = computeDims(c.input, c.cursor[0], c.cursor[1], c.mods);
  const ok = r.w === c.expect.w && r.h === c.expect.h;
  console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
  console.log(`  → w=${r.w}, h=${r.h}  (expected w=${c.expect.w}, h=${c.expect.h})`);
  if (ok) passed++;
  else failed++;
}

for (const c of elasticCases) {
  const r = applyElasticDim(c.desired, c.min);
  // Float-compare with small epsilon; rubberband math doesn't go through
  // Math.round here.
  const ok = Math.abs(r - c.expect) < 1e-9;
  console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
  console.log(`  → ${r}  (expected ${c.expect})`);
  if (ok) passed++;
  else failed++;
}

for (const c of spacingCases) {
  const r = computeSpacing(c.input, c.cursor[0], c.cursor[1], c.mods);
  const ok = r.active === c.expect.active && r.opposite === c.expect.opposite;
  console.log(`${ok ? "PASS" : "FAIL"}: ${c.name}`);
  console.log(
    `  → active=${r.active}, opposite=${r.opposite}  (expected active=${c.expect.active}, opposite=${c.expect.opposite})`
  );
  if (ok) passed++;
  else failed++;
}

const total = cases.length + elasticCases.length + spacingCases.length;
console.log(`\n${passed}/${total} passed${failed ? `, ${failed} FAILED` : ""}`);
process.exit(failed > 0 ? 1 : 0);
