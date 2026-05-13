// Smoke test for `lib/contrast.ts`. Inline-and-isolate convention.
// Re-implements the helpers below from the .ts so this script runs
// without a build step. Roadmap §4.1 #6 — WCAG contrast checker.

const COMPOSITE_WHITE = { r: 255, g: 255, b: 255 };

function parseHexFlexible(hex) {
  if (!hex) return null;
  const raw = hex.startsWith("#") ? hex.slice(1) : hex;
  if (!/^[0-9a-fA-F]+$/.test(raw)) return null;
  let r, g, b, a = 1;
  if (raw.length === 3) {
    r = parseInt(raw[0] + raw[0], 16);
    g = parseInt(raw[1] + raw[1], 16);
    b = parseInt(raw[2] + raw[2], 16);
  } else if (raw.length === 6) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
  } else if (raw.length === 8) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
    a = parseInt(raw.slice(6, 8), 16) / 255;
  } else {
    return null;
  }
  if (a < 1) {
    r = Math.round(r * a + COMPOSITE_WHITE.r * (1 - a));
    g = Math.round(g * a + COMPOSITE_WHITE.g * (1 - a));
    b = Math.round(b * a + COMPOSITE_WHITE.b * (1 - a));
  }
  return { r, g, b };
}

function srgbToLinear(c) {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fgHex, bgHex) {
  const fg = parseHexFlexible(fgHex);
  const bg = parseHexFlexible(bgHex);
  if (!fg || !bg) return null;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagBucket(ratio) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

// --- bench harness ---------------------------------------------------------

let pass = 0;
let fail = 0;
const failures = [];

function approx(name, actual, expected, tolerance) {
  const ok = typeof actual === "number" && typeof expected === "number"
    && Math.abs(actual - expected) <= tolerance;
  if (ok) pass++;
  else { fail++; failures.push({ name, actual, expected }); }
}
function eq(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++;
  else { fail++; failures.push({ name, actual, expected }); }
}

// --- parseHexFlexible ------------------------------------------------------

eq("3-digit hex expands", parseHexFlexible("#abc"), { r: 0xAA, g: 0xBB, b: 0xCC });
eq("6-digit hex", parseHexFlexible("#FF0000"), { r: 255, g: 0, b: 0 });
// 8-digit hex composites with white. Alpha = 0x80/255 = ~0.5019 so rounding
// gives 127 not 128 — within 1 byte of expected, which is fine for the chip.
{
  const out = parseHexFlexible("#FF000080");
  const ok = out && out.r === 255 && Math.abs(out.g - 128) <= 1 && Math.abs(out.b - 128) <= 1;
  if (ok) pass++; else { fail++; failures.push({ name: "8-digit hex composites with white", actual: out, expected: "{r:255,g:~128,b:~128}" }); }
}
eq("no leading #", parseHexFlexible("00FF00"), { r: 0, g: 255, b: 0 });
eq("empty → null", parseHexFlexible(""), null);
eq("malformed → null", parseHexFlexible("xyz"), null);
eq("5-char → null", parseHexFlexible("#abcde"), null);

// --- contrastRatio ---------------------------------------------------------

approx("black on white = 21:1", contrastRatio("#000000", "#FFFFFF"), 21, 0.01);
approx("white on black = 21:1 (ordering invariant)",
  contrastRatio("#FFFFFF", "#000000"), 21, 0.01);
approx("same colour = 1:1", contrastRatio("#888888", "#888888"), 1, 0.01);
approx("ink on paper (high)", contrastRatio("#0F0F0F", "#F5F1EA"), 17.0, 0.3);
// Coral #FF4D2E on the editor's paper #F5F1EA actually fails the AA Large
// threshold (~2.94). The chip should report Fail — that's the diagnostic.
approx("coral on paper (low)", contrastRatio("#FF4D2E", "#F5F1EA"), 2.94, 0.1);
{
  const r = contrastRatio("#FF4D2E", "#F5F1EA");
  eq("coral on paper bucket", wcagBucket(r), "Fail");
}

eq("missing fg → null", contrastRatio("xyz", "#FFFFFF"), null);
eq("missing bg → null", contrastRatio("#FFFFFF", "abc12"), null);

// --- wcagBucket ------------------------------------------------------------

eq("21 → AAA", wcagBucket(21), "AAA");
eq("7 → AAA", wcagBucket(7), "AAA");
eq("6.99 → AA", wcagBucket(6.99), "AA");
eq("4.5 → AA", wcagBucket(4.5), "AA");
eq("4.49 → AA Large", wcagBucket(4.49), "AA Large");
eq("3 → AA Large", wcagBucket(3), "AA Large");
eq("2.99 → Fail", wcagBucket(2.99), "Fail");
eq("1 → Fail", wcagBucket(1), "Fail");

// --- end-to-end (round-trip via real palette pairs) ------------------------

// Tailwind slate-900 (#0F172A) on slate-50 (#F8FAFC) — should be AAA.
{
  const r = contrastRatio("#0F172A", "#F8FAFC");
  eq("slate-900 on slate-50 hits AAA tier", wcagBucket(r), "AAA");
}
// Tailwind blue-500 (#3B82F6) on white — AA Large only.
{
  const r = contrastRatio("#3B82F6", "#FFFFFF");
  eq("blue-500 on white tier", wcagBucket(r), "AA Large");
}
// red-300 on white fails contrast.
{
  const r = contrastRatio("#FCA5A5", "#FFFFFF");
  eq("red-300 on white fails", wcagBucket(r), "Fail");
}

// --- summary ---------------------------------------------------------------

console.log(`bench-contrast: ${pass}/${pass + fail} passed`);
if (fail > 0) {
  console.log("\nFailures:");
  for (const f of failures) {
    console.log(`  - ${f.name}`);
    console.log(`      actual:   ${JSON.stringify(f.actual)}`);
    console.log(`      expected: ${JSON.stringify(f.expected)}`);
  }
  process.exit(1);
}
