// Ad-hoc smoke test for `lib/ast/constraints.ts evaluateSoftConstraints`.
// Inlines the pure logic (no TS build step) and exercises threshold cases:
// touch-target / text-size / aspect-distorted / contrast / overflow.
//
// Per CLAUDE.md "no test harnesses unless asked" this is a one-off
// developer-introspection script. Fire `node scripts/bench-constraints.mjs`
// from repo root after touching constraints.ts.

const TOUCH_TARGET_MIN_PX = 32;
const TEXT_SIZE_MIN_PX = 12;
const ASPECT_DISTORTION_TOLERANCE = 0.05;
const WCAG_LARGE_FONT_PX = 18;
const WCAG_LARGE_BOLD_FONT_PX = 14;
const WCAG_BOLD_WEIGHT = 700;
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;
const OVERFLOW_TOLERANCE_PX = 1;

function relativeLuminance(c) {
  function ch(v) {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}

function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function compositeRgba(top, bg) {
  const a = top.a + bg.a * (1 - top.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (top.r * top.a + bg.r * bg.a * (1 - top.a)) / a,
    g: (top.g * top.a + bg.g * bg.a * (1 - top.a)) / a,
    b: (top.b * top.a + bg.b * bg.a * (1 - top.a)) / a,
    a,
  };
}

function wcagThreshold(fontSizePx, fontWeight) {
  if (fontSizePx >= WCAG_LARGE_FONT_PX) return WCAG_AA_LARGE;
  if (fontSizePx >= WCAG_LARGE_BOLD_FONT_PX && fontWeight >= WCAG_BOLD_WEIGHT) {
    return WCAG_AA_LARGE;
  }
  return WCAG_AA_NORMAL;
}

function evaluateSoftConstraints(input) {
  const out = [];
  if (input.isInteractive) {
    const w = input.bounds.width;
    const h = input.bounds.height;
    const tooSmall = w < TOUCH_TARGET_MIN_PX || h < TOUCH_TARGET_MIN_PX;
    if (tooSmall && (w > 0 || h > 0)) {
      out.push({
        kind: "touch-target",
        severity: "warning",
        axis:
          w < TOUCH_TARGET_MIN_PX && h < TOUCH_TARGET_MIN_PX
            ? "both"
            : w < TOUCH_TARGET_MIN_PX
              ? "x"
              : "y",
        message: `Touch target ${Math.round(w)}×${Math.round(h)}px (min ${TOUCH_TARGET_MIN_PX}px)`,
      });
    }
  }
  if (
    input.hasDirectText &&
    input.fontSizePx > 0 &&
    input.fontSizePx < TEXT_SIZE_MIN_PX
  ) {
    out.push({
      kind: "text-size",
      severity: "warning",
      message: `Font size ${input.fontSizePx.toFixed(1)}px (min ${TEXT_SIZE_MIN_PX}px)`,
    });
  }
  if (
    input.isImage &&
    input.naturalAspect !== null &&
    input.naturalAspect > 0 &&
    input.bounds.width > 0 &&
    input.bounds.height > 0
  ) {
    const current = input.bounds.width / input.bounds.height;
    const ratio = current / input.naturalAspect;
    if (
      ratio < 1 - ASPECT_DISTORTION_TOLERANCE ||
      ratio > 1 + ASPECT_DISTORTION_TOLERANCE
    ) {
      out.push({
        kind: "aspect-distorted",
        severity: "warning",
        message: `Aspect ${current.toFixed(2)}:1 (natural ${input.naturalAspect.toFixed(2)}:1)`,
      });
    }
  }
  if (input.hasDirectText && input.fgColor && input.bgColor) {
    const composedFg =
      input.fgColor.a < 1
        ? compositeRgba(input.fgColor, input.bgColor)
        : input.fgColor;
    const ratio = contrastRatio(composedFg, input.bgColor);
    const threshold = wcagThreshold(input.fontSizePx, input.fontWeight);
    if (ratio + 0.001 < threshold) {
      out.push({
        kind: "contrast",
        severity: "warning",
        message: `Contrast ${ratio.toFixed(1)}:1 (WCAG AA ${threshold.toFixed(1)}:1)`,
      });
    }
  }
  if (input.parentBounds) {
    const e = input.bounds;
    const p = input.parentBounds;
    const tol = OVERFLOW_TOLERANCE_PX;
    const overflowX = e.x < p.x - tol || e.x + e.width > p.x + p.width + tol;
    const overflowY = e.y < p.y - tol || e.y + e.height > p.y + p.height + tol;
    if (overflowX || overflowY) {
      out.push({
        kind: "overflow",
        severity: "warning",
        axis: overflowX && overflowY ? "both" : overflowX ? "x" : "y",
        message: "Overflows parent",
      });
    }
  }
  return out;
}

function makeInput(overrides = {}) {
  return {
    bounds: { x: 0, y: 0, width: 200, height: 100 },
    parentBounds: { x: 0, y: 0, width: 400, height: 300 },
    fontSizePx: 16,
    fontWeight: 400,
    isInteractive: false,
    hasDirectText: false,
    isImage: false,
    naturalAspect: null,
    fgColor: null,
    bgColor: null,
    ...overrides,
  };
}

function deepEq(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (a === null || b === null) return a === b;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (!deepEq(a[k], b[k])) return false;
  }
  return true;
}

const cases = [
  // --- Touch target ---
  {
    name: "[constraints] interactive 24×24 button → touch-target warning (both axes)",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 24, height: 24 },
      isInteractive: true,
    }),
    check: (warnings) =>
      warnings.length === 1 &&
      warnings[0].kind === "touch-target" &&
      warnings[0].axis === "both",
  },
  {
    name: "[constraints] interactive 24×40 button → touch-target warning (x only)",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 24, height: 40 },
      isInteractive: true,
    }),
    check: (warnings) =>
      warnings.length === 1 &&
      warnings[0].kind === "touch-target" &&
      warnings[0].axis === "x",
  },
  {
    name: "[constraints] interactive exactly 32×32 button → no warning (boundary)",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 32, height: 32 },
      isInteractive: true,
    }),
    check: (warnings) => warnings.length === 0,
  },
  {
    name: "[constraints] non-interactive 24×24 div → no touch-target warning",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 24, height: 24 },
      isInteractive: false,
    }),
    check: (warnings) => warnings.length === 0,
  },
  {
    name: "[constraints] interactive 0×0 (display:none-equivalent) → no warning",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 0, height: 0 },
      isInteractive: true,
    }),
    check: (warnings) => warnings.length === 0,
  },
  // --- Text size ---
  {
    name: "[constraints] hasDirectText + 10px font → text-size warning",
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 10,
    }),
    check: (warnings) =>
      warnings.length === 1 && warnings[0].kind === "text-size",
  },
  {
    name: "[constraints] hasDirectText + exactly 12px font → no warning (boundary)",
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 12,
    }),
    check: (warnings) => warnings.length === 0,
  },
  {
    name: "[constraints] no direct text + 10px font → no text-size warning",
    input: makeInput({
      hasDirectText: false,
      fontSizePx: 10,
    }),
    check: (warnings) => warnings.length === 0,
  },
  // --- Aspect ratio distortion ---
  {
    name: "[constraints] image 200×100 with natural 2:1 → no aspect warning",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 200, height: 100 },
      isImage: true,
      naturalAspect: 2,
    }),
    check: (warnings) =>
      warnings.filter((w) => w.kind === "aspect-distorted").length === 0,
  },
  {
    name: "[constraints] image 200×200 with natural 2:1 → aspect warning",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 200, height: 200 },
      isImage: true,
      naturalAspect: 2,
    }),
    check: (warnings) =>
      warnings.length === 1 && warnings[0].kind === "aspect-distorted",
  },
  {
    name: "[constraints] image 200×104 with natural 2:1 (~4% off, within tolerance) → no warning",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 200, height: 104 },
      isImage: true,
      naturalAspect: 2,
    }),
    check: (warnings) =>
      warnings.filter((w) => w.kind === "aspect-distorted").length === 0,
  },
  {
    name: "[constraints] image with naturalAspect=null (not loaded) → no warning",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 200, height: 50 },
      isImage: true,
      naturalAspect: null,
    }),
    check: (warnings) => warnings.length === 0,
  },
  // --- Contrast ---
  {
    name: "[constraints] hasDirectText + black-on-white (21:1) → no contrast warning",
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 14,
      fontWeight: 400,
      fgColor: { r: 0, g: 0, b: 0, a: 1 },
      bgColor: { r: 255, g: 255, b: 255, a: 1 },
    }),
    check: (warnings) =>
      warnings.filter((w) => w.kind === "contrast").length === 0,
  },
  {
    name: "[constraints] hasDirectText + light gray on white (~1.6:1) → contrast warning",
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 14,
      fontWeight: 400,
      fgColor: { r: 200, g: 200, b: 200, a: 1 },
      bgColor: { r: 255, g: 255, b: 255, a: 1 },
    }),
    check: (warnings) => warnings.some((w) => w.kind === "contrast"),
  },
  {
    name: "[constraints] hasDirectText + 24px gray on white (large text 3:1 threshold)",
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 24,
      fontWeight: 400,
      fgColor: { r: 145, g: 145, b: 145, a: 1 }, // ~3.4:1 — passes large-text 3:1
      bgColor: { r: 255, g: 255, b: 255, a: 1 },
    }),
    check: (warnings) =>
      warnings.filter((w) => w.kind === "contrast").length === 0,
  },
  {
    name: "[constraints] hasDirectText + 14px gray on white (would-be-large-but-not-bold)",
    // 14px non-bold text uses normal 4.5:1 threshold; ~3.4:1 fails.
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 14,
      fontWeight: 400,
      fgColor: { r: 145, g: 145, b: 145, a: 1 },
      bgColor: { r: 255, g: 255, b: 255, a: 1 },
    }),
    check: (warnings) => warnings.some((w) => w.kind === "contrast"),
  },
  {
    name: "[constraints] hasDirectText + 14px BOLD gray on white → uses large-text 3:1 threshold",
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 14,
      fontWeight: 700,
      fgColor: { r: 145, g: 145, b: 145, a: 1 },
      bgColor: { r: 255, g: 255, b: 255, a: 1 },
    }),
    check: (warnings) =>
      warnings.filter((w) => w.kind === "contrast").length === 0,
  },
  {
    name: "[constraints] hasDirectText + null fg → no contrast warning (can't compute)",
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 14,
      fgColor: null,
      bgColor: { r: 255, g: 255, b: 255, a: 1 },
    }),
    check: (warnings) =>
      warnings.filter((w) => w.kind === "contrast").length === 0,
  },
  {
    name: "[constraints] hasDirectText + null bg (gradient ancestor) → no contrast warning",
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 14,
      fgColor: { r: 200, g: 200, b: 200, a: 1 },
      bgColor: null,
    }),
    check: (warnings) =>
      warnings.filter((w) => w.kind === "contrast").length === 0,
  },
  {
    name: "[constraints] semi-transparent fg composites with bg → expected ~4:1 fails 4.5:1",
    // Black at alpha=0.5 over white = mid-gray (~127), ratio ≈ 4.0:1.
    // The compositing pre-step is what's being asserted here: without it,
    // the math would treat raw black-on-white = 21:1 and pass. The 4:1
    // result confirms the composite happened.
    input: makeInput({
      hasDirectText: true,
      fontSizePx: 14,
      fgColor: { r: 0, g: 0, b: 0, a: 0.5 },
      bgColor: { r: 255, g: 255, b: 255, a: 1 },
    }),
    check: (warnings) => {
      const c = warnings.find((w) => w.kind === "contrast");
      if (!c) return false;
      // Message format: "Contrast X.X:1 (WCAG AA 4.5:1)"
      const m = /Contrast ([\d.]+):1/.exec(c.message);
      if (!m) return false;
      const ratio = parseFloat(m[1]);
      // Expect ~4.0; tolerate 0.2 for rounding.
      return ratio > 3.8 && ratio < 4.2;
    },
  },
  // --- Overflow ---
  {
    name: "[constraints] element fits inside parent → no overflow warning",
    input: makeInput({
      bounds: { x: 10, y: 10, width: 100, height: 50 },
      parentBounds: { x: 0, y: 0, width: 200, height: 100 },
    }),
    check: (warnings) => warnings.length === 0,
  },
  {
    name: "[constraints] element extends past parent right edge → overflow x",
    input: makeInput({
      bounds: { x: 10, y: 10, width: 250, height: 50 },
      parentBounds: { x: 0, y: 0, width: 200, height: 100 },
    }),
    check: (warnings) =>
      warnings.length === 1 &&
      warnings[0].kind === "overflow" &&
      warnings[0].axis === "x",
  },
  {
    name: "[constraints] element extends past parent on both axes → overflow both",
    input: makeInput({
      bounds: { x: -10, y: -10, width: 250, height: 200 },
      parentBounds: { x: 0, y: 0, width: 200, height: 100 },
    }),
    check: (warnings) =>
      warnings.length === 1 &&
      warnings[0].kind === "overflow" &&
      warnings[0].axis === "both",
  },
  {
    name: "[constraints] 1 px tolerance: element just barely past parent → no warning",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 201, height: 100 },
      parentBounds: { x: 0, y: 0, width: 200, height: 100 },
    }),
    check: (warnings) => warnings.length === 0,
  },
  {
    name: "[constraints] 2 px past parent → warning fires (tolerance is 1 px)",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 202, height: 100 },
      parentBounds: { x: 0, y: 0, width: 200, height: 100 },
    }),
    check: (warnings) =>
      warnings.length === 1 && warnings[0].kind === "overflow",
  },
  {
    name: "[constraints] no parentBounds → overflow check skipped",
    input: makeInput({
      bounds: { x: 100, y: 100, width: 250, height: 200 },
      parentBounds: null,
    }),
    check: (warnings) => warnings.length === 0,
  },
  // --- Combined ---
  {
    name: "[constraints] interactive 20×20 with 10px text → both touch-target AND text-size warnings",
    input: makeInput({
      bounds: { x: 0, y: 0, width: 20, height: 20 },
      isInteractive: true,
      hasDirectText: true,
      fontSizePx: 10,
    }),
    check: (warnings) =>
      warnings.length === 2 &&
      warnings[0].kind === "touch-target" &&
      warnings[1].kind === "text-size",
  },
  // --- Color helpers smoke ---
  {
    name: "[constraints] black/white contrast = 21:1 (WCAG canonical)",
    input: null,
    check: () => {
      const r = contrastRatio(
        { r: 0, g: 0, b: 0, a: 1 },
        { r: 255, g: 255, b: 255, a: 1 }
      );
      return Math.abs(r - 21) < 0.01;
    },
  },
  {
    name: "[constraints] same-color contrast = 1:1",
    input: null,
    check: () => {
      const r = contrastRatio(
        { r: 100, g: 100, b: 100, a: 1 },
        { r: 100, g: 100, b: 100, a: 1 }
      );
      return Math.abs(r - 1) < 1e-6;
    },
  },
  {
    name: "[constraints] wcagThreshold returns 4.5 for 14px normal",
    input: null,
    check: () => wcagThreshold(14, 400) === 4.5,
  },
  {
    name: "[constraints] wcagThreshold returns 3 for 14px bold",
    input: null,
    check: () => wcagThreshold(14, 700) === 3.0,
  },
  {
    name: "[constraints] wcagThreshold returns 3 for 18px normal",
    input: null,
    check: () => wcagThreshold(18, 400) === 3.0,
  },
  {
    name: "[constraints] composite black @ 0.5 alpha over white → mid gray rgb(127.5,127.5,127.5)",
    input: null,
    check: () => {
      const r = compositeRgba(
        { r: 0, g: 0, b: 0, a: 0.5 },
        { r: 255, g: 255, b: 255, a: 1 }
      );
      return (
        Math.abs(r.r - 127.5) < 0.5 &&
        Math.abs(r.g - 127.5) < 0.5 &&
        Math.abs(r.b - 127.5) < 0.5 &&
        Math.abs(r.a - 1) < 1e-6
      );
    },
  },
];

let pass = 0;
let fail = 0;
for (const c of cases) {
  let ok = false;
  let result;
  try {
    result = c.input === null ? null : evaluateSoftConstraints(c.input);
    ok = c.check(result);
  } catch (err) {
    ok = false;
    result = String(err);
  }
  if (ok) {
    pass++;
    console.log(`✓ ${c.name}`);
  } else {
    fail++;
    console.log(`✗ ${c.name}`);
    if (result !== null) console.log(`    got: ${JSON.stringify(result)}`);
  }
}

console.log(`\n${pass} passed, ${fail} failed of ${cases.length} total.`);
process.exit(fail === 0 ? 0 : 1);
