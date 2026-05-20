// Phase 5 / Phase C — clean palette registry. Replaces the dice-shape
// `lib/dice/palettes.ts` (which carried `Rng` / extremity ergonomics
// for the roller mechanic that retired in Phase A8).
//
// `PALETTES` exports the same 12 palettes as before but reshaped to
// fit the new `applyPalette` engine + `<PalettesSection>` UI:
//   - `families.{primary, neutral, accent}` — Tailwind family tokens.
//     Used by `applyPalette` to rewrite className tokens.
//   - `swatch.{primary, neutral, accent, bg, fg}` — display hexes for
//     the tile preview chips. `bg` / `fg` are a paper / ink pair so
//     the tile reads as "this is what the page will look like" instead
//     of three colored dots floating on neutral chrome.
//
// The class-token tokenizers + family helpers (ALL_FAMILIES,
// NEUTRAL_FAMILIES, familyOf, extractClassTokens, rewriteClasses,
// detectFamilies, countClassAttrs) used to live in `lib/dice/palettes.ts`.
// Phase C deletes that file in C5; this module owns the registry only,
// while the AST-shaped class-token rewriter ships in
// `lib/ast/operations/palette.ts` (which doesn't depend on the legacy
// regex tokenizer).

export const ALL_FAMILIES = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
] as const;
export type Family = (typeof ALL_FAMILIES)[number];

export const NEUTRAL_FAMILIES: ReadonlySet<Family> = new Set<Family>([
  "slate", "gray", "zinc", "neutral", "stone",
]);

// Standard Tailwind 3.4 family-500 hex codes. Used for swatch chips.
// Pulling them out of the palette literal so the table stays readable.
const FAMILY_500: Record<Family, string> = {
  slate: "#64748b",
  gray: "#6b7280",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
};

// Reverse index hex -> { family, shade }. Built from the verified
// `lib/tailwind-palette.ts` TAILWIND_PALETTE table (single source of
// truth, version-pinned to Tailwind 3.4.x). Used by applyPalette to
// remap arbitrary-value tokens like bg-[#6366f1] (indigo-500).
//
// Without this, AI-generated templates that emit `bg-[#hex]` for
// one-off accent colors bypass the palette swap entirely — the
// named-token path only matches `bg-blue-500`, not `bg-[#3b82f6]`.
//
// Lookup is lowercase only; callers normalize before lookup.
// Forward lookup (family, shade) -> hex via lookupFamilyHex below.
import { TAILWIND_PALETTE } from "./tailwind-palette";

export const FAMILY_HEX_SHADES: ReadonlyMap<string, { family: Family; shade: string }> = (() => {
  const m = new Map<string, { family: Family; shade: string }>();
  for (const family of ALL_FAMILIES) {
    for (const shade of ["50","100","200","300","400","500","600","700","800","900","950"]) {
      const hex = TAILWIND_PALETTE[`${family}-${shade}`];
      if (hex) m.set(hex.toLowerCase(), { family, shade });
    }
  }
  return m;
})();

export function lookupFamilyHex(family: Family, shade: string): string | null {
  return TAILWIND_PALETTE[`${family}-${shade}`]?.toLowerCase() ?? null;
}

export interface PaletteFamilies {
  primary: Family;
  neutral: Family;
  accent: Family;
}

export interface PaletteSwatch {
  primary: string;
  neutral: string;
  accent: string;
  bg: string;
  fg: string;
}

export interface Palette {
  id: string;
  name: string;
  families: PaletteFamilies;
  swatch: PaletteSwatch;
  vibe: string;
}

// Paper / ink — Dropin's house surface tokens. Same values as
// tailwind.config.ts → theme.extend.colors.{paper, ink} so the tile
// preview matches the live UI.
const PAPER = "#F5F1EA";
const INK = "#18141C";

function makePalette(
  id: string,
  name: string,
  primary: Family,
  neutral: Family,
  accent: Family,
  vibe: string
): Palette {
  return {
    id,
    name,
    families: { primary, neutral, accent },
    swatch: {
      primary: FAMILY_500[primary],
      neutral: FAMILY_500[neutral],
      accent: FAMILY_500[accent],
      bg: PAPER,
      fg: INK,
    },
    vibe,
  };
}

export const PALETTES: ReadonlyArray<Palette> = [
  makePalette("warm-paper",  "Warm paper", "orange", "stone",   "amber",   "editorial / cozy"),
  makePalette("ocean",       "Ocean",      "sky",    "slate",   "teal",    "clean / techy"),
  makePalette("forest",      "Forest",     "emerald","stone",   "lime",    "organic / fresh"),
  makePalette("sunset",      "Sunset",     "rose",   "neutral", "orange",  "sunset / romantic"),
  makePalette("dusk",        "Dusk",       "violet", "zinc",    "fuchsia", "moody / creative"),
  makePalette("candy",       "Candy",      "fuchsia","neutral", "pink",    "playful / pop"),
  makePalette("sage",        "Sage",       "teal",   "stone",   "emerald", "calm / wellness"),
  makePalette("vintage",     "Vintage",    "red",    "stone",   "amber",   "retro / bold"),
  makePalette("mono",        "Monochrome", "zinc",   "zinc",    "zinc",    "minimal / strict"),
  makePalette("noir-coral",  "Noir coral", "rose",   "zinc",    "red",     "confident / brutalist"),
  makePalette("electric",    "Electric",   "indigo", "slate",   "cyan",    "digital / neon"),
  makePalette("desert",      "Desert",     "amber",  "stone",   "orange",  "warm / natural"),
];

// Fast O(1) lookup helper for the workspace `applyPalette` handler.
export function getPaletteById(id: string): Palette | null {
  for (const p of PALETTES) if (p.id === id) return p;
  return null;
}
