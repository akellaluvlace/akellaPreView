// Phase E proper — Static-analysis capacity inference.
//
// Phase E foundation defined `SlotCapacity` as the asset's authored
// dimension constraints. The plan called for computing capacities at
// ingest time via headless-browser measurement (puppeteer + DOM rect).
//
// This module is the DOM-FREE FALLBACK. It infers capacity from the
// asset's className tokens alone — no rendering, no measurement. Useful
// for:
//
//   - Bootstrap before the puppeteer ingest run lands
//     (`data/component-capacities.json` doesn't exist yet)
//   - User-extracted "Make Component" assets (Phase G post-MVP) where
//     the source is in-memory and no headless browser run is wanted
//   - Test fixtures where we want deterministic capacity per fixture
//
// The output's `source` field is "user-extracted" so the consumer
// (LibraryModal filter) knows the data is heuristic, not measured. A
// future ingest-pipeline pass writes "library"-source records that
// override these for gallery assets.
//
// Pure-logic only — no React, no DOM, no fetch.

import type {
  SlotCapacity,
  SlotCategory,
  SlotFlexBehavior,
} from "./slot-capacity";

// Tokens that indicate "fills the slot" — happy in any container width.
// Class-name match is exact (no substring), token-bounded by whitespace.
// `flex-1` is the canonical Tailwind shorthand (`flex: 1 1 0%`).
// `grow` is the "increase" half of `flex-grow`; without an explicit
// `grow-0` cancel it means the asset will expand to fill.
const FILL_TOKENS = new Set([
  "w-full",
  "w-screen",
  "flex-1",
  "flex-auto",
  "grow",
  "flex-grow",
]);

// Match unprefixed `w-[Npx]` / `h-[Npx]` / `min-w-[Npx]` / `max-w-[Npx]`
// etc. Each is a separate regex so we can capture the prefix explicitly
// and pull the numeric value. Prefix-bound (no `lg:`, no `hover:`).
function buildBracketPxRe(prefix: string): RegExp {
  // Escape regex-special chars in prefix; only "-" appears here, which
  // is benign as a literal but escape for safety.
  const escaped = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  return new RegExp(`(?:^|\\s)(${escaped}\\[(\\d+(?:\\.\\d+)?)px\\])(?:$|\\s)`);
}

const W_PX_RE = buildBracketPxRe("w-");
const H_PX_RE = buildBracketPxRe("h-");
const MIN_W_PX_RE = buildBracketPxRe("min-w-");
const MIN_H_PX_RE = buildBracketPxRe("min-h-");
const MAX_W_PX_RE = buildBracketPxRe("max-w-");
const MAX_H_PX_RE = buildBracketPxRe("max-h-");

// Aspect-ratio tokens — same rules as swap-fit's matchers.
const ASPECT_ARBITRARY_RE =
  /(?:^|\s)aspect-\[(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\](?:$|\s)/;
const ASPECT_NAMED_RE = /(?:^|\s)aspect-(square|video)(?:$|\s)/;

// Tailwind's `min-w-screen` / `min-w-full` — semantically "fills the
// slot horizontally" and gives no minimum-pixel hint. Token-listed
// rather than regex-driven because the set is small.
const MIN_W_FILL_TOKENS = new Set(["min-w-full", "min-w-screen"]);

// Tailwind 3.4 spacing scale in px. `w-N`, `min-w-N`, `max-w-N`, `h-N`,
// `min-h-N`, `max-h-N` all dereference here (1 unit = 0.25rem = 4px).
// Includes "px" (=1) and decimal halves.
const SPACING_PX: Readonly<Record<string, number>> = {
  "0": 0,
  px: 1,
  "0.5": 2,
  "1": 4,
  "1.5": 6,
  "2": 8,
  "2.5": 10,
  "3": 12,
  "3.5": 14,
  "4": 16,
  "5": 20,
  "6": 24,
  "7": 28,
  "8": 32,
  "9": 36,
  "10": 40,
  "11": 44,
  "12": 48,
  "14": 56,
  "16": 64,
  "20": 80,
  "24": 96,
  "28": 112,
  "32": 128,
  "36": 144,
  "40": 160,
  "44": 176,
  "48": 192,
  "52": 208,
  "56": 224,
  "60": 240,
  "64": 256,
  "72": 288,
  "80": 320,
  "96": 384,
};

// Tailwind 3.4 max-width named scale in px. `max-w-{size}` dereferences
// here. "none"/"full"/"min"/"max"/"fit" → null (no pixel cap).
const MAX_WIDTH_NAMED_PX: Readonly<Record<string, number | null>> = {
  none: null,
  full: null,
  min: null,
  max: null,
  fit: null,
  prose: 520, // ~65ch at default font; rounded to 520px
  xs: 320,
  sm: 384,
  md: 448,
  lg: 512,
  xl: 576,
  "2xl": 672,
  "3xl": 768,
  "4xl": 896,
  "5xl": 1024,
  "6xl": 1152,
  "7xl": 1280,
  "screen-sm": 640,
  "screen-md": 768,
  "screen-lg": 1024,
  "screen-xl": 1280,
  "screen-2xl": 1536,
};

function lookupSpacingPx(suffix: string): number | null {
  return Object.prototype.hasOwnProperty.call(SPACING_PX, suffix)
    ? SPACING_PX[suffix]
    : null;
}

function lookupNamedMaxWidthPx(suffix: string): number | null {
  if (!Object.prototype.hasOwnProperty.call(MAX_WIDTH_NAMED_PX, suffix)) {
    return null;
  }
  return MAX_WIDTH_NAMED_PX[suffix];
}

// Match Tailwind named-scale tokens. Token MUST be unprefixed (no
// breakpoint / variant) — the regex anchors on whitespace. Captures the
// suffix (the part after the prefix-hyphen) for table lookup.
function matchNamedScale(
  prefix: string,
  classes: string,
  table: (suffix: string) => number | null,
): number | null {
  // Match `prefix-{suffix}` where suffix is alphanumeric / dash / dot.
  // Excludes bracketed arbitrary values (those are matched separately).
  const escaped = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const re = new RegExp(`(?:^|\\s)${escaped}-([a-zA-Z0-9.-]+)(?:$|\\s)`);
  let m: RegExpExecArray | null;
  let matched: number | null = null;
  // Walk through ALL matches (a class might have multiple `w-N` variants
  // due to authoring mistakes — last-write-wins per CSS specificity).
  // Build a global regex by re-creating with /g flag.
  const reG = new RegExp(re.source, "g");
  while ((m = reG.exec(classes)) !== null) {
    const suffix = m[1];
    const px = table(suffix);
    if (px !== null) matched = px;
  }
  return matched;
}

// Approximate rem→px conversion for `min-w-[40rem]` style classes. 16px
// is the browser default root-font-size; we don't try to read user CSS.
// Only used when we'd otherwise emit null for that bound and a coarse
// estimate is better than nothing for the "fits this slot" filter.
const REM_PX_BASE = 16;

const MIN_W_REM_RE =
  /(?:^|\s)min-w-\[(\d+(?:\.\d+)?)rem\](?:$|\s)/;
const MIN_H_REM_RE =
  /(?:^|\s)min-h-\[(\d+(?:\.\d+)?)rem\](?:$|\s)/;

function matchPxValue(re: RegExp, classes: string): number | null {
  const m = re.exec(classes);
  if (!m) return null;
  const n = parseFloat(m[2]);
  return isFinite(n) && n >= 0 ? n : null;
}

function matchRemPx(re: RegExp, classes: string): number | null {
  const m = re.exec(classes);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return isFinite(n) && n >= 0 ? Math.round(n * REM_PX_BASE) : null;
}

// Detect a `w-N` named Tailwind width (e.g. `w-80` = 320px). Excludes
// fractions, "auto", "screen" / "full" (those are fill-content semantic
// and handled by the FILL_TOKENS gate above), and bracketed arbitrary
// values (those are handled by the px regex). Returns the matched px
// value or null.
function namedWidthPx(classes: string): number | null {
  return matchNamedScale("w", classes, lookupSpacingPx);
}

function detectFlexBehavior(tokens: string[], paddedClasses: string): SlotFlexBehavior {
  // grow-0 cancels grow's "fill" semantics — must check before the
  // generic fill-token loop so `grow-0` doesn't accidentally trigger
  // on the `grow` substring (Set lookup is exact, but safer to be explicit).
  const hasGrowZero = tokens.includes("grow-0");
  for (const t of tokens) {
    if (t === "grow" && hasGrowZero) continue;
    if (FILL_TOKENS.has(t)) return "fill";
  }
  // Literal pixel width OR named Tailwind width (w-80, w-96) with no
  // fill marker → "fixed". The capacity's maxWidthPx (computed elsewhere)
  // carries the actual constraint.
  if (W_PX_RE.test(paddedClasses)) return "fixed";
  if (namedWidthPx(paddedClasses) !== null) return "fixed";
  // Default: "fit-content" — the asset sizes to its inherent content.
  // Most cards and buttons fall here.
  return "fit-content";
}

export interface InferCapacityOpts {
  category?: SlotCategory;
  // When true, also populate maxWidthPx from a literal `w-[Npx]` (the
  // asset has a fixed width). Default: true.
  inferMaxFromLiteralW?: boolean;
}

export function inferCapacityFromClasses(
  classes: string | null | undefined,
  opts: InferCapacityOpts = {},
): SlotCapacity {
  const inferMaxFromLiteralW = opts.inferMaxFromLiteralW ?? true;
  const category: SlotCategory = opts.category ?? "unknown";

  if (typeof classes !== "string" || classes.length === 0) {
    return {
      category,
      intrinsic: {
        minWidthPx: null,
        minHeightPx: null,
        maxWidthPx: null,
        maxHeightPx: null,
        aspectRatio: null,
      },
      flexBehavior: "fit-content",
      source: "user-extracted",
    };
  }

  // Pad with spaces so the leading/trailing-whitespace regex anchors fire
  // on tokens at the start and end of the string without special-casing.
  const padded = " " + classes + " ";
  const tokens = classes.split(/\s+/).filter(Boolean);

  // ─── min bounds ──────────────────────────────────────────────────────
  // `min-w-full` / `min-w-screen` give no pixel hint; treat as null.
  // Resolution order: arbitrary `min-w-[Npx]` → rem `min-w-[Nrem]` →
  // named Tailwind `min-w-N` (e.g. min-w-80).
  let minWidthPx: number | null = null;
  if (!tokens.some((t) => MIN_W_FILL_TOKENS.has(t))) {
    minWidthPx = matchPxValue(MIN_W_PX_RE, padded);
    if (minWidthPx === null) {
      minWidthPx = matchRemPx(MIN_W_REM_RE, padded);
    }
    if (minWidthPx === null) {
      minWidthPx = matchNamedScale("min-w", padded, lookupSpacingPx);
    }
  }

  let minHeightPx: number | null = matchPxValue(MIN_H_PX_RE, padded);
  if (minHeightPx === null) {
    minHeightPx = matchRemPx(MIN_H_REM_RE, padded);
  }
  if (minHeightPx === null) {
    minHeightPx = matchNamedScale("min-h", padded, lookupSpacingPx);
  }

  // ─── max bounds ──────────────────────────────────────────────────────
  // Resolution order: arbitrary `max-w-[Npx]` → named Tailwind size
  // `max-w-md` (448px) etc. → spacing `max-w-80` (320px) → fall back to
  // literal `w-[Npx]` or named `w-N` when inferMaxFromLiteralW is on.
  let maxWidthPx: number | null = matchPxValue(MAX_W_PX_RE, padded);
  if (maxWidthPx === null) {
    maxWidthPx = matchNamedScale("max-w", padded, lookupNamedMaxWidthPx);
  }
  if (maxWidthPx === null) {
    // max-w spacing scale (max-w-80 = 320px). Note: max-w-md and
    // max-w-80 both work; the named-size table wins because it's
    // checked first.
    maxWidthPx = matchNamedScale("max-w", padded, lookupSpacingPx);
  }
  if (maxWidthPx === null && inferMaxFromLiteralW) {
    maxWidthPx = matchPxValue(W_PX_RE, padded);
    if (maxWidthPx === null) {
      maxWidthPx = namedWidthPx(padded);
    }
  }

  let maxHeightPx: number | null = matchPxValue(MAX_H_PX_RE, padded);
  if (maxHeightPx === null) {
    // max-h has fewer named sizes (no md/lg in vanilla Tailwind for
    // height); only the spacing scale applies.
    maxHeightPx = matchNamedScale("max-h", padded, lookupSpacingPx);
  }
  if (maxHeightPx === null && inferMaxFromLiteralW) {
    maxHeightPx = matchPxValue(H_PX_RE, padded);
    if (maxHeightPx === null) {
      maxHeightPx = matchNamedScale("h", padded, lookupSpacingPx);
    }
  }

  // ─── aspect ratio ────────────────────────────────────────────────────
  let aspectRatio: number | null = null;
  const arbAr = ASPECT_ARBITRARY_RE.exec(padded);
  if (arbAr) {
    const x = parseFloat(arbAr[1]);
    const y = parseFloat(arbAr[2]);
    if (x > 0 && y > 0) aspectRatio = x / y;
  } else {
    const namedAr = ASPECT_NAMED_RE.exec(padded);
    if (namedAr) {
      aspectRatio = namedAr[1] === "square" ? 1 : 16 / 9;
    }
  }

  // ─── flex behavior ───────────────────────────────────────────────────
  const flexBehavior = detectFlexBehavior(tokens, padded);

  return {
    category,
    intrinsic: {
      minWidthPx,
      minHeightPx,
      maxWidthPx,
      maxHeightPx,
      aspectRatio,
    },
    flexBehavior,
    source: "user-extracted",
  };
}

// Constants exported for testing + the LibraryModal compatibility filter.
export const CAPACITY_FROM_SOURCE_CONSTANTS = {
  FILL_TOKENS,
  MIN_W_FILL_TOKENS,
  REM_PX_BASE,
  SPACING_PX,
  MAX_WIDTH_NAMED_PX,
} as const;
