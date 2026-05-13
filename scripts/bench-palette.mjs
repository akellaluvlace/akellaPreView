// Smoke test for `lib/tailwind-palette.ts`. Mirrors the inline-and-isolate
// pattern of the other benches (bench-style.mjs / bench-resize.mjs / etc).
// Re-implements the helpers below from the .ts so this script runs without a
// build step. If the TS module's signature changes, re-sync this file.
//
// Coverage target: parsing palette classes (every prefix the inspector uses,
// plus alpha suffix), reverse-lookup nearest match, sentinel handling for
// transparent / current / inherit.

const TAILWIND_PALETTE = {
  // slate
  "slate-50": "#F8FAFC", "slate-100": "#F1F5F9", "slate-200": "#E2E8F0",
  "slate-300": "#CBD5E1", "slate-400": "#94A3B8", "slate-500": "#64748B",
  "slate-600": "#475569", "slate-700": "#334155", "slate-800": "#1E293B",
  "slate-900": "#0F172A", "slate-950": "#020617",
  // gray
  "gray-50": "#F9FAFB", "gray-100": "#F3F4F6", "gray-200": "#E5E7EB",
  "gray-300": "#D1D5DB", "gray-400": "#9CA3AF", "gray-500": "#6B7280",
  "gray-600": "#4B5563", "gray-700": "#374151", "gray-800": "#1F2937",
  "gray-900": "#111827", "gray-950": "#030712",
  // zinc
  "zinc-50": "#FAFAFA", "zinc-100": "#F4F4F5", "zinc-200": "#E4E4E7",
  "zinc-300": "#D4D4D8", "zinc-400": "#A1A1AA", "zinc-500": "#71717A",
  "zinc-600": "#52525B", "zinc-700": "#3F3F46", "zinc-800": "#27272A",
  "zinc-900": "#18181B", "zinc-950": "#09090B",
  // neutral
  "neutral-50": "#FAFAFA", "neutral-100": "#F5F5F5", "neutral-200": "#E5E5E5",
  "neutral-300": "#D4D4D4", "neutral-400": "#A3A3A3", "neutral-500": "#737373",
  "neutral-600": "#525252", "neutral-700": "#404040", "neutral-800": "#262626",
  "neutral-900": "#171717", "neutral-950": "#0A0A0A",
  // stone
  "stone-50": "#FAFAF9", "stone-100": "#F5F5F4", "stone-200": "#E7E5E4",
  "stone-300": "#D6D3D1", "stone-400": "#A8A29E", "stone-500": "#78716C",
  "stone-600": "#57534E", "stone-700": "#44403C", "stone-800": "#292524",
  "stone-900": "#1C1917", "stone-950": "#0C0A09",
  // red, blue, sky, slate already cover the regex space; rest abridged
  // with just the 500 shade (the bench only needs a sample for reverse-
  // lookup distance, not full coverage of every shade).
  "red-500": "#EF4444",
  "orange-500": "#F97316",
  "amber-500": "#F59E0B",
  "yellow-500": "#EAB308",
  "lime-500": "#84CC16",
  "green-500": "#22C55E",
  "emerald-500": "#10B981",
  "teal-500": "#14B8A6",
  "cyan-500": "#06B6D4",
  "sky-500": "#0EA5E9",
  "blue-500": "#3B82F6",
  "indigo-500": "#6366F1",
  "violet-500": "#8B5CF6",
  "purple-500": "#A855F7",
  "fuchsia-500": "#D946EF",
  "pink-500": "#EC4899",
  "rose-500": "#F43F5E",
  "black": "#000000",
  "white": "#FFFFFF",
};

const PALETTE_FALLBACK_HEX = "#F5F1EA";

const COLOR_CLASS_RE = new RegExp(
  "^(bg|text|border|ring|from|via|to|fill|stroke|outline|caret|accent|decoration|divide|placeholder|shadow)" +
    "-(transparent|current|inherit|black|white|" +
    "(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))" +
    "(?:/(\\d+))?$"
);

function parsePaletteClass(cls) {
  const m = cls.match(COLOR_CLASS_RE);
  if (!m) return null;
  const [, prefix, body] = m;
  const alphaRaw = m[3];
  const alpha = alphaRaw == null ? null : Number(alphaRaw);
  if (body === "transparent" || body === "current" || body === "inherit") {
    return { prefix, body, hex: PALETTE_FALLBACK_HEX, alpha, isPaletteHex: false };
  }
  const hex = TAILWIND_PALETTE[body];
  if (!hex) return null;
  return { prefix, body, hex, alpha, isPaletteHex: true };
}

function findPaletteClass(classes, prefix) {
  for (const c of classes) {
    const m = parsePaletteClass(c);
    if (m && m.prefix === prefix) return m;
  }
  return null;
}

function hexToRgb(hex) {
  const s = hex.startsWith("#") ? hex.slice(1) : hex;
  let r, g, b;
  if (s.length === 3) {
    r = parseInt(s[0] + s[0], 16);
    g = parseInt(s[1] + s[1], 16);
    b = parseInt(s[2] + s[2], 16);
  } else if (s.length === 6 || s.length === 8) {
    r = parseInt(s.slice(0, 2), 16);
    g = parseInt(s.slice(2, 4), 16);
    b = parseInt(s.slice(4, 6), 16);
  } else {
    return null;
  }
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

const PALETTE_RGB = Object.entries(TAILWIND_PALETTE).map(([name, hex]) => ({
  name,
  rgb: hexToRgb(hex),
}));

function closestPaletteName(hex) {
  const target = hexToRgb(hex);
  if (!target) return null;
  let best = null;
  for (const { name, rgb } of PALETTE_RGB) {
    const dr = rgb.r - target.r;
    const dg = rgb.g - target.g;
    const db = rgb.b - target.b;
    const d = dr * dr + dg * dg + db * db;
    if (best === null || d < best.distance) best = { name, distance: d };
  }
  return best;
}

function nearbyPaletteName(hex, threshold = 300) {
  const m = closestPaletteName(hex);
  if (!m || m.distance > threshold) return null;
  return m.name;
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

// --- parsePaletteClass -----------------------------------------------------

test("parse bg-slate-500",
  parsePaletteClass("bg-slate-500"),
  { prefix: "bg", body: "slate-500", hex: "#64748B", alpha: null, isPaletteHex: true });

test("parse text-red-500",
  parsePaletteClass("text-red-500"),
  { prefix: "text", body: "red-500", hex: "#EF4444", alpha: null, isPaletteHex: true });

test("parse border-blue-500/30 (alpha)",
  parsePaletteClass("border-blue-500/30"),
  { prefix: "border", body: "blue-500", hex: "#3B82F6", alpha: 30, isPaletteHex: true });

test("parse ring-emerald-500",
  parsePaletteClass("ring-emerald-500"),
  { prefix: "ring", body: "emerald-500", hex: "#10B981", alpha: null, isPaletteHex: true });

test("parse from-purple-500 (gradient stop)",
  parsePaletteClass("from-purple-500"),
  { prefix: "from", body: "purple-500", hex: "#A855F7", alpha: null, isPaletteHex: true });

test("parse to-pink-500/50 (gradient stop with alpha)",
  parsePaletteClass("to-pink-500/50"),
  { prefix: "to", body: "pink-500", hex: "#EC4899", alpha: 50, isPaletteHex: true });

test("parse bg-white (base color)",
  parsePaletteClass("bg-white"),
  { prefix: "bg", body: "white", hex: "#FFFFFF", alpha: null, isPaletteHex: true });

test("parse bg-black (base color)",
  parsePaletteClass("bg-black"),
  { prefix: "bg", body: "black", hex: "#000000", alpha: null, isPaletteHex: true });

test("parse bg-transparent (sentinel)",
  parsePaletteClass("bg-transparent"),
  { prefix: "bg", body: "transparent", hex: PALETTE_FALLBACK_HEX, alpha: null, isPaletteHex: false });

test("parse bg-current (sentinel)",
  parsePaletteClass("bg-current"),
  { prefix: "bg", body: "current", hex: PALETTE_FALLBACK_HEX, alpha: null, isPaletteHex: false });

test("parse bg-inherit (sentinel)",
  parsePaletteClass("bg-inherit"),
  { prefix: "bg", body: "inherit", hex: PALETTE_FALLBACK_HEX, alpha: null, isPaletteHex: false });

test("non-palette bg-[#abc] returns null",
  parsePaletteClass("bg-[#abc]"),
  null);

test("non-palette bg-[radial-gradient(...)] returns null",
  parsePaletteClass("bg-[radial-gradient(circle,red,blue)]"),
  null);

test("not-a-color class returns null",
  parsePaletteClass("flex"),
  null);

test("nonexistent shade returns null",
  parsePaletteClass("bg-slate-1000"),
  null);

test("nonexistent family returns null",
  parsePaletteClass("bg-cherry-500"),
  null);

// --- findPaletteClass ------------------------------------------------------

test("findPaletteClass picks the right prefix on a mixed list",
  findPaletteClass(["flex", "bg-slate-500", "text-red-500", "p-4"], "text"),
  { prefix: "text", body: "red-500", hex: TAILWIND_PALETTE["red-500"], alpha: null, isPaletteHex: true });

test("findPaletteClass returns null when prefix not present",
  findPaletteClass(["flex", "bg-slate-500", "p-4"], "border"),
  null);

test("findPaletteClass first match wins for repeated prefix",
  findPaletteClass(["bg-red-500", "bg-blue-500"], "bg")?.body,
  "red-500");

test("findPaletteClass empty list returns null",
  findPaletteClass([], "bg"),
  null);

// --- closestPaletteName / nearbyPaletteName --------------------------------

test("exact slate-500 hex resolves to slate-500",
  closestPaletteName("#64748B")?.name,
  "slate-500");

test("exact slate-500 hex distance is 0",
  closestPaletteName("#64748B")?.distance,
  0);

test("close-to-slate-500 (off by 1 per channel) resolves to slate-500",
  closestPaletteName("#65758C")?.name,
  "slate-500");

test("very-close-to-blue-500 hex resolves to blue-500",
  closestPaletteName("#3B82F7")?.name,
  "blue-500");

test("nearbyPaletteName(slate-500 exact) returns slate-500",
  nearbyPaletteName("#64748B"),
  "slate-500");

test("nearbyPaletteName(off-palette random) returns null",
  nearbyPaletteName("#FF4D2E"),
  null); // coral is not a palette swatch; furthest from white/black-ish

test("nearbyPaletteName(white) returns white",
  nearbyPaletteName("#FFFFFF"),
  "white");

test("nearbyPaletteName(black) returns black",
  nearbyPaletteName("#000000"),
  "black");

test("nearbyPaletteName tightens with smaller threshold",
  nearbyPaletteName("#65758C", 5), // off by 1 per channel = distance 3
  "slate-500");

test("nearbyPaletteName loosens with larger threshold finds neutrals",
  // a custom warm-gray near stone-500 should resolve under generous threshold
  nearbyPaletteName("#7A7570", 1000),
  "stone-500");

test("invalid hex returns null",
  closestPaletteName("not-a-hex"),
  null);

test("3-char hex parses",
  closestPaletteName("#000")?.name,
  "black");

// --- summary ---------------------------------------------------------------

console.log(`bench-palette: ${pass}/${pass + fail}`);
if (fail > 0) {
  for (const f of failures) {
    console.log("FAIL", f.name);
    console.log("  expected:", JSON.stringify(f.expected));
    console.log("  actual:  ", JSON.stringify(f.actual));
  }
  process.exit(1);
}
