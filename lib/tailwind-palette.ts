// Tailwind 3.4 default palette → hex map.
//
// Powers (a) "pre-fill the picker when the source uses a palette name like
// `bg-slate-500`" — see §2.5 in ROADMAP.md (the picker today only resolves
// `bg-[#hex]`); (b) reverse lookup for "what palette name is closest to this
// hex?", used to surface a friendly label next to arbitrary-hex colors.
//
// Source-of-truth: the literal hex strings shipped by `tailwindcss@3.4.x` in
// `lib/public/colors.js`. Pinned by version — Tailwind 4 retunes the OKLCH
// values for some shades (notably 50/100 and 900/950), so this map is
// intentionally NOT auto-derived.
//
// Keys are stored as plain `<family>-<shade>` (no `bg-` / `text-` prefix) so
// the same map serves every prefix the inspector cares about. `transparent`,
// `current`, `black`, `white` are included for completeness even though
// `current`/`transparent` have no fixed hex (we map them to a sentinel
// useful for the picker — see `paletteHexFor`).
//
// Hexes are stored uppercase — round-trip with the picker (which uppercases
// all of its hex output) stays bit-identical.

export const TAILWIND_FAMILIES = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
] as const;

export type TailwindFamily = (typeof TAILWIND_FAMILIES)[number];

export const TAILWIND_SHADES = [
  "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950",
] as const;

export type TailwindShade = (typeof TAILWIND_SHADES)[number];

// Neutral families never get used as accent backgrounds in the dice roller's
// "high" mode safeguards (see ROADMAP §3.2 risk #4). Exposed here for any
// other consumer that needs the same distinction.
export const TAILWIND_NEUTRAL_FAMILIES: ReadonlyArray<TailwindFamily> = [
  "slate", "gray", "zinc", "neutral", "stone",
];

// `Record<string, string>` rather than nested-by-family because every
// consumer keys by `<family>-<shade>` directly. Total entries: 22 × 11 = 242.
export const TAILWIND_PALETTE: Readonly<Record<string, string>> = {
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
  // red
  "red-50": "#FEF2F2", "red-100": "#FEE2E2", "red-200": "#FECACA",
  "red-300": "#FCA5A5", "red-400": "#F87171", "red-500": "#EF4444",
  "red-600": "#DC2626", "red-700": "#B91C1C", "red-800": "#991B1B",
  "red-900": "#7F1D1D", "red-950": "#450A0A",
  // orange
  "orange-50": "#FFF7ED", "orange-100": "#FFEDD5", "orange-200": "#FED7AA",
  "orange-300": "#FDBA74", "orange-400": "#FB923C", "orange-500": "#F97316",
  "orange-600": "#EA580C", "orange-700": "#C2410C", "orange-800": "#9A3412",
  "orange-900": "#7C2D12", "orange-950": "#431407",
  // amber
  "amber-50": "#FFFBEB", "amber-100": "#FEF3C7", "amber-200": "#FDE68A",
  "amber-300": "#FCD34D", "amber-400": "#FBBF24", "amber-500": "#F59E0B",
  "amber-600": "#D97706", "amber-700": "#B45309", "amber-800": "#92400E",
  "amber-900": "#78350F", "amber-950": "#451A03",
  // yellow
  "yellow-50": "#FEFCE8", "yellow-100": "#FEF9C3", "yellow-200": "#FEF08A",
  "yellow-300": "#FDE047", "yellow-400": "#FACC15", "yellow-500": "#EAB308",
  "yellow-600": "#CA8A04", "yellow-700": "#A16207", "yellow-800": "#854D0E",
  "yellow-900": "#713F12", "yellow-950": "#422006",
  // lime
  "lime-50": "#F7FEE7", "lime-100": "#ECFCCB", "lime-200": "#D9F99D",
  "lime-300": "#BEF264", "lime-400": "#A3E635", "lime-500": "#84CC16",
  "lime-600": "#65A30D", "lime-700": "#4D7C0F", "lime-800": "#3F6212",
  "lime-900": "#365314", "lime-950": "#1A2E05",
  // green
  "green-50": "#F0FDF4", "green-100": "#DCFCE7", "green-200": "#BBF7D0",
  "green-300": "#86EFAC", "green-400": "#4ADE80", "green-500": "#22C55E",
  "green-600": "#16A34A", "green-700": "#15803D", "green-800": "#166534",
  "green-900": "#14532D", "green-950": "#052E16",
  // emerald
  "emerald-50": "#ECFDF5", "emerald-100": "#D1FAE5", "emerald-200": "#A7F3D0",
  "emerald-300": "#6EE7B7", "emerald-400": "#34D399", "emerald-500": "#10B981",
  "emerald-600": "#059669", "emerald-700": "#047857", "emerald-800": "#065F46",
  "emerald-900": "#064E3B", "emerald-950": "#022C22",
  // teal
  "teal-50": "#F0FDFA", "teal-100": "#CCFBF1", "teal-200": "#99F6E4",
  "teal-300": "#5EEAD4", "teal-400": "#2DD4BF", "teal-500": "#14B8A6",
  "teal-600": "#0D9488", "teal-700": "#0F766E", "teal-800": "#115E59",
  "teal-900": "#134E4A", "teal-950": "#042F2E",
  // cyan
  "cyan-50": "#ECFEFF", "cyan-100": "#CFFAFE", "cyan-200": "#A5F3FC",
  "cyan-300": "#67E8F9", "cyan-400": "#22D3EE", "cyan-500": "#06B6D4",
  "cyan-600": "#0891B2", "cyan-700": "#0E7490", "cyan-800": "#155E75",
  "cyan-900": "#164E63", "cyan-950": "#083344",
  // sky
  "sky-50": "#F0F9FF", "sky-100": "#E0F2FE", "sky-200": "#BAE6FD",
  "sky-300": "#7DD3FC", "sky-400": "#38BDF8", "sky-500": "#0EA5E9",
  "sky-600": "#0284C7", "sky-700": "#0369A1", "sky-800": "#075985",
  "sky-900": "#0C4A6E", "sky-950": "#082F49",
  // blue
  "blue-50": "#EFF6FF", "blue-100": "#DBEAFE", "blue-200": "#BFDBFE",
  "blue-300": "#93C5FD", "blue-400": "#60A5FA", "blue-500": "#3B82F6",
  "blue-600": "#2563EB", "blue-700": "#1D4ED8", "blue-800": "#1E40AF",
  "blue-900": "#1E3A8A", "blue-950": "#172554",
  // indigo
  "indigo-50": "#EEF2FF", "indigo-100": "#E0E7FF", "indigo-200": "#C7D2FE",
  "indigo-300": "#A5B4FC", "indigo-400": "#818CF8", "indigo-500": "#6366F1",
  "indigo-600": "#4F46E5", "indigo-700": "#4338CA", "indigo-800": "#3730A3",
  "indigo-900": "#312E81", "indigo-950": "#1E1B4B",
  // violet
  "violet-50": "#F5F3FF", "violet-100": "#EDE9FE", "violet-200": "#DDD6FE",
  "violet-300": "#C4B5FD", "violet-400": "#A78BFA", "violet-500": "#8B5CF6",
  "violet-600": "#7C3AED", "violet-700": "#6D28D9", "violet-800": "#5B21B6",
  "violet-900": "#4C1D95", "violet-950": "#2E1065",
  // purple
  "purple-50": "#FAF5FF", "purple-100": "#F3E8FF", "purple-200": "#E9D5FF",
  "purple-300": "#D8B4FE", "purple-400": "#C084FC", "purple-500": "#A855F7",
  "purple-600": "#9333EA", "purple-700": "#7E22CE", "purple-800": "#6B21A8",
  "purple-900": "#581C87", "purple-950": "#3B0764",
  // fuchsia
  "fuchsia-50": "#FDF4FF", "fuchsia-100": "#FAE8FF", "fuchsia-200": "#F5D0FE",
  "fuchsia-300": "#F0ABFC", "fuchsia-400": "#E879F9", "fuchsia-500": "#D946EF",
  "fuchsia-600": "#C026D3", "fuchsia-700": "#A21CAF", "fuchsia-800": "#86198F",
  "fuchsia-900": "#701A75", "fuchsia-950": "#4A044E",
  // pink
  "pink-50": "#FDF2F8", "pink-100": "#FCE7F3", "pink-200": "#FBCFE8",
  "pink-300": "#F9A8D4", "pink-400": "#F472B6", "pink-500": "#EC4899",
  "pink-600": "#DB2777", "pink-700": "#BE185D", "pink-800": "#9D174D",
  "pink-900": "#831843", "pink-950": "#500724",
  // rose
  "rose-50": "#FFF1F2", "rose-100": "#FFE4E6", "rose-200": "#FECDD3",
  "rose-300": "#FDA4AF", "rose-400": "#FB7185", "rose-500": "#F43F5E",
  "rose-600": "#E11D48", "rose-700": "#BE123C", "rose-800": "#9F1239",
  "rose-900": "#881337", "rose-950": "#4C0519",
  // base colors
  "black": "#000000",
  "white": "#FFFFFF",
};

// Sentinel hex used by the picker when the source class is `bg-current` /
// `bg-transparent` — there's no fixed swatch, but we need *something* for the
// `<input type="color">` start value. Choosing the paper background means the
// picker doesn't show a glaring black on first open. Callers that need to
// distinguish should compare class strings directly, not the returned hex.
const PALETTE_FALLBACK_HEX = "#F5F1EA";

const COLOR_CLASS_RE = new RegExp(
  "^(bg|text|border|ring|from|via|to|fill|stroke|outline|caret|accent|decoration|divide|placeholder|shadow)" +
    "-(transparent|current|inherit|black|white|" +
    "(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))" +
    "(?:/(\\d+))?$"
);

export interface PaletteMatch {
  /** prefix portion (e.g. `bg`, `text`) */
  prefix: string;
  /** body of the class — `slate-500` / `black` / `transparent` */
  body: string;
  /** resolved hex (uppercase, no alpha). May be the fallback for transparent/current. */
  hex: string;
  /** Tailwind opacity slash suffix (e.g. `bg-slate-500/30` → 30). null if no slash present. */
  alpha: number | null;
  /** True only when `hex` is a real palette swatch (not the fallback for transparent/current/inherit). */
  isPaletteHex: boolean;
}

/**
 * Parse a single Tailwind palette class. Returns null when the input is
 * an arbitrary-hex class (`bg-[#abc]`) — the existing
 * `pickArbitraryHex` covers that path. Returns null for unknown shapes.
 *
 * Supports all common color-family prefixes (bg, text, border, ring, from/via/to,
 * fill/stroke/outline/caret/accent/decoration/divide/placeholder/shadow). The
 * Inspector only uses bg/text/border/ring today but the parser is permissive
 * because the dice roller (Phase 3) needs to swap palette families across the
 * full set.
 */
export function parsePaletteClass(cls: string): PaletteMatch | null {
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

/**
 * Walk a class list and return the first palette class matching `prefix`.
 * Useful for "what palette name is sitting on `bg-` right now?". Matches
 * `bg-slate-500` and `bg-slate-500/30` (alpha is reported separately).
 */
export function findPaletteClass(
  classes: ReadonlyArray<string>,
  prefix: string
): PaletteMatch | null {
  for (const c of classes) {
    const m = parsePaletteClass(c);
    if (m && m.prefix === prefix) return m;
  }
  return null;
}

// --- reverse lookup: hex → closest palette name -----------------------------

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB | null {
  const s = hex.startsWith("#") ? hex.slice(1) : hex;
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  if (s.length === 6 || s.length === 8) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

// Pre-compute palette RGB once at module load. Cuts ~242 hex parses per
// reverse-lookup call down to a single object lookup.
const PALETTE_RGB: Array<{ name: string; rgb: RGB }> = (() => {
  const out: Array<{ name: string; rgb: RGB }> = [];
  for (const [name, hex] of Object.entries(TAILWIND_PALETTE)) {
    const rgb = hexToRgb(hex);
    if (rgb) out.push({ name, rgb });
  }
  return out;
})();

/**
 * Find the closest palette entry to a given hex. Returns the palette body
 * (e.g. `"slate-500"`, `"black"`) and the squared-distance score in
 * sRGB space (0 == exact, ≤300 ≈ visually indistinguishable, ≥3000 means
 * the source hex doesn't really map to any palette swatch — surface as
 * "custom" rather than mislabel).
 */
export function closestPaletteName(hex: string): { name: string; distance: number } | null {
  const target = hexToRgb(hex);
  if (!target) return null;
  let best: { name: string; distance: number } | null = null;
  for (const { name, rgb } of PALETTE_RGB) {
    const dr = rgb.r - target.r;
    const dg = rgb.g - target.g;
    const db = rgb.b - target.b;
    const d = dr * dr + dg * dg + db * db;
    if (best === null || d < best.distance) best = { name, distance: d };
  }
  return best;
}

/** Convenience: returns the palette body only when the match is "close". */
export function nearbyPaletteName(hex: string, threshold = 300): string | null {
  const m = closestPaletteName(hex);
  if (!m) return null;
  if (m.distance > threshold) return null;
  return m.name;
}
