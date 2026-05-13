// ROADMAP §3.5 — style presets. Twelve hand-curated combinations spanning
// Button / Card / Heading / Input. Each preset is a Tailwind class string
// applied to the user's element by stripping conflicting classes (bg, text
// colour/size, padding, border, radius, shadow, font) and concatenating the
// preset's classes. Standard-palette only (slate, blue, white, etc.) — the
// Play-CDN-driven preview iframe doesn't carry the host's `paper / ink / coral`
// custom palette, and presets are supposed to "just work" on any template.
//
// Why a separate `preview` payload per preset: the host renders mini
// thumbnail cards in the FocusEditor's right pane. Those run through the
// host's Tailwind JIT (which ONLY scans `app/**` + `components/**`), so we
// can't rely on classes from this `lib/` file being recognised as host CSS.
// Instead the preview renders via inline `style={...}` with a few
// pre-baked CSS tokens. The application-side `classes` string still feeds
// the iframe (which renders via Play CDN's runtime JIT and recognises
// every standard utility on the fly).

export type PresetShape = "button" | "card" | "heading" | "input";

export interface PresetPreview {
  shape: PresetShape;
  bg: string;
  fg: string;
  border?: string;
  shadow?: string;
  radius?: string;
  fontWeight?: number | string;
  fontSize?: string;
  underline?: boolean;
  letterSpacing?: string;
  label: string;
}

export interface StylePreset {
  id: string;
  name: string;
  /** Space-separated Tailwind classes applied to the user's element. */
  classes: string;
  preview: PresetPreview;
  /**
   * Optional alternate variants of the same preset. When present,
   * re-clicking the preset on the same element cycles through
   * `[classes, ...variants]` in order. Each variant is itself a
   * space-separated Tailwind class string with the same shape as
   * `classes`. Useful for "Primary blue / Primary emerald / Primary
   * red" kinds of looks where the user wants a quick re-spin without
   * abandoning the preset's intent.
   */
  variants?: ReadonlyArray<string>;
}

export interface PresetCategory {
  label: string;
  /** Lowercased element tags this category applies to. */
  matchTags: ReadonlyArray<string>;
  presets: ReadonlyArray<StylePreset>;
}

const BUTTON_BASE = "inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium";

export const STYLE_PRESETS: ReadonlyArray<PresetCategory> = [
  {
    label: "Button",
    matchTags: ["button", "a"],
    presets: [
      {
        id: "btn-primary",
        name: "Primary",
        classes: `${BUTTON_BASE} rounded-md bg-slate-900 text-white shadow-sm`,
        variants: [
          // Vibrant blue
          `${BUTTON_BASE} rounded-md bg-blue-600 text-white shadow-sm`,
          // Success emerald
          `${BUTTON_BASE} rounded-md bg-emerald-600 text-white shadow-sm`,
          // Pill-shaped slate
          `${BUTTON_BASE} rounded-full bg-slate-900 text-white shadow-md`,
        ],
        preview: {
          shape: "button",
          bg: "#0F172A",
          fg: "#FFFFFF",
          radius: "6px",
          shadow: "0 1px 2px rgba(15,23,42,0.08)",
          fontWeight: 500,
          label: "Primary",
        },
      },
      {
        id: "btn-secondary",
        name: "Secondary",
        classes: `${BUTTON_BASE} rounded-md bg-white text-slate-900 border-2 border-slate-900 shadow-sm`,
        variants: [
          // Quiet light fill
          `${BUTTON_BASE} rounded-md bg-slate-100 text-slate-900`,
          // Soft border
          `${BUTTON_BASE} rounded-md bg-white text-slate-700 border border-slate-300`,
          // Pill outline
          `${BUTTON_BASE} rounded-full bg-white text-slate-900 border-2 border-slate-900`,
        ],
        preview: {
          shape: "button",
          bg: "#FFFFFF",
          fg: "#0F172A",
          radius: "6px",
          border: "2px solid #0F172A",
          shadow: "0 1px 2px rgba(15,23,42,0.08)",
          fontWeight: 500,
          label: "Secondary",
        },
      },
      {
        id: "btn-ghost",
        name: "Ghost",
        classes: `${BUTTON_BASE} rounded-md bg-transparent text-slate-900`,
        preview: {
          shape: "button",
          bg: "transparent",
          fg: "#0F172A",
          radius: "6px",
          fontWeight: 500,
          label: "Ghost",
        },
      },
      {
        id: "btn-link",
        name: "Link",
        classes: "inline-flex items-center gap-1 text-blue-600 font-medium underline underline-offset-2",
        preview: {
          shape: "button",
          bg: "transparent",
          fg: "#2563EB",
          fontWeight: 500,
          underline: true,
          label: "Link →",
        },
      },
    ],
  },
  {
    // Card presets used to match every container tag (div/section/header/
    // footer/main/aside/article). For vibecoders that turned every block
    // selection into a noisy "FLAT / RAISED / OUTLINED" tile rail they
    // didn't ask for. We only auto-show presets on tags whose semantics
    // ARE a card by default — `<article>` qualifies, generic containers
    // don't. Users who want card styling on a div can still apply it via
    // the Background / Border / Effects controls (or open the Library).
    label: "Card",
    matchTags: ["article"],
    presets: [
      {
        id: "card-flat",
        name: "Flat",
        classes: "bg-white p-6 rounded-md",
        preview: {
          shape: "card",
          bg: "#FFFFFF",
          fg: "#0F172A",
          radius: "6px",
          label: "Flat",
        },
      },
      {
        id: "card-raised",
        name: "Raised",
        classes: "bg-white p-6 rounded-md shadow-md",
        variants: [
          "bg-white p-8 rounded-lg shadow-lg",
          "bg-white p-6 rounded-2xl shadow-xl",
        ],
        preview: {
          shape: "card",
          bg: "#FFFFFF",
          fg: "#0F172A",
          radius: "6px",
          shadow: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)",
          label: "Raised",
        },
      },
      {
        id: "card-outlined",
        name: "Outlined",
        classes: "bg-white p-6 rounded-md border-2 border-slate-900",
        preview: {
          shape: "card",
          bg: "#FFFFFF",
          fg: "#0F172A",
          radius: "6px",
          border: "2px solid #0F172A",
          label: "Outlined",
        },
      },
    ],
  },
  {
    label: "Heading",
    matchTags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    presets: [
      {
        id: "heading-hero",
        name: "Hero",
        classes: "text-5xl font-bold tracking-tight",
        variants: [
          "text-4xl font-extrabold tracking-tighter",
          "text-6xl font-black tracking-tight",
        ],
        preview: {
          shape: "heading",
          bg: "transparent",
          fg: "#0F172A",
          fontSize: "20px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          label: "Hero heading",
        },
      },
      {
        id: "heading-section",
        name: "Section",
        classes: "text-3xl font-bold",
        preview: {
          shape: "heading",
          bg: "transparent",
          fg: "#0F172A",
          fontSize: "16px",
          fontWeight: 700,
          label: "Section",
        },
      },
      {
        id: "heading-display",
        name: "Display",
        classes: "text-7xl font-bold tracking-tighter",
        preview: {
          shape: "heading",
          bg: "transparent",
          fg: "#0F172A",
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          label: "Display",
        },
      },
    ],
  },
  {
    label: "Input",
    matchTags: ["input", "textarea", "select"],
    presets: [
      {
        id: "input-minimal",
        name: "Minimal",
        classes: "bg-transparent border-b-2 border-slate-900 px-2 py-2 text-slate-900",
        preview: {
          shape: "input",
          bg: "transparent",
          fg: "#0F172A",
          border: "0 0 2px 0 / solid #0F172A",
          label: "field",
        },
      },
      {
        id: "input-boxed",
        name: "Boxed",
        classes: "bg-white border-2 border-slate-900 rounded-md px-3 py-2 text-slate-900 shadow-sm",
        preview: {
          shape: "input",
          bg: "#FFFFFF",
          fg: "#0F172A",
          border: "2px solid #0F172A",
          radius: "6px",
          shadow: "0 1px 2px rgba(15,23,42,0.08)",
          label: "field",
        },
      },
    ],
  },
];

/**
 * Find every preset that applies to the given lowercased tag.
 * Returns flat list across categories so a single Heading section can
 * sit alongside Card if a tag straddles (rare). Returns the categories
 * shape so the caller can render per-category headings.
 */
export function getPresetCategoriesForTag(
  tag: string,
): ReadonlyArray<PresetCategory> {
  const t = tag.toLowerCase();
  return STYLE_PRESETS.filter((cat) => cat.matchTags.includes(t));
}

/**
 * Whether a class is "owned" by the preset surface — should be stripped
 * from currentClasses before applying a preset. Conservative on text-*:
 * preserves text-{align} (text-center/left/right/justify/start/end)
 * since alignment is positioning, not visual style.
 */
export function isPresetStripClass(c: string): boolean {
  if (/^bg-/.test(c)) return true;
  if (c === "border" || /^border-/.test(c)) return true;
  if (c === "rounded" || /^rounded-/.test(c)) return true;
  if (c === "shadow" || /^shadow-/.test(c)) return true;
  if (/^p[trblxy]?(-|$)/.test(c)) return true;
  if (/^text-/.test(c)) {
    return !/^text-(center|left|right|justify|start|end)$/.test(c);
  }
  if (/^font-/.test(c)) return true;
  if (/^(tracking|leading|decoration)-/.test(c)) return true;
  if (
    c === "underline" ||
    c === "no-underline" ||
    c === "italic" ||
    c === "not-italic"
  ) {
    return true;
  }
  // Display + flex/grid alignment: the button presets set inline-flex
  // and items/justify-center; if we don't strip the user's existing
  // display utility, we get e.g. `block inline-flex` which conflicts.
  if (
    c === "block" ||
    c === "inline-block" ||
    c === "inline" ||
    c === "flex" ||
    c === "inline-flex" ||
    c === "grid" ||
    c === "inline-grid" ||
    c === "hidden"
  ) {
    return true;
  }
  if (/^(items|justify|content|place|gap)-/.test(c)) return true;
  return false;
}

/**
 * Apply a preset to a class list. Strips conflicting style classes
 * (per `isPresetStripClass`) AND any class the preset is about to
 * re-add (dedup). Appends the preset's class tokens at the end.
 * Pure — does not mutate the input.
 */
export function applyPreset(
  currentClasses: ReadonlyArray<string>,
  preset: StylePreset,
): string[] {
  return applyPresetVariant(currentClasses, preset, 0);
}

/**
 * Total number of "looks" a preset can produce (1 if no variants, else
 * 1 + variants.length). Caller advances through `[0..total-1]` and
 * passes the index back into `applyPresetVariant`.
 */
export function presetVariantCount(preset: StylePreset): number {
  return 1 + (preset.variants?.length ?? 0);
}

/**
 * Get the class string for variant index `idx` (0 = base preset, 1+ =
 * `variants[idx-1]`). Out-of-range indices clamp to the base.
 */
export function presetVariantClasses(
  preset: StylePreset,
  idx: number,
): string {
  if (idx <= 0) return preset.classes;
  const v = preset.variants;
  if (!v || idx > v.length) return preset.classes;
  return v[idx - 1];
}

/**
 * Apply a specific variant of a preset. `idx === 0` is the base
 * preset's classes (identical to `applyPreset`); higher indices pick
 * from `preset.variants` (clamped to base if out of range). Same
 * strip-and-dedup semantics as `applyPreset`.
 */
export function applyPresetVariant(
  currentClasses: ReadonlyArray<string>,
  preset: StylePreset,
  idx: number,
): string[] {
  const tokens = presetVariantClasses(preset, idx)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const tokenSet = new Set(tokens);
  const kept = currentClasses.filter(
    (c) => !isPresetStripClass(c) && !tokenSet.has(c),
  );
  return [...kept, ...tokens];
}

// --- Custom presets (localStorage-backed) ---
//
// Users can save the current element's classes as a custom preset that
// renders alongside the built-ins. Persists in localStorage so it
// survives reloads. Schema is forward-compatible — adding fields to
// CustomPreset only appears as `undefined` on older saves.

const CUSTOM_PRESETS_KEY = "dropin:custom-presets";
const CUSTOM_PRESETS_VERSION = 1;

export interface CustomPreset {
  id: string;
  name: string;
  classes: string;
  // Original element tag at save time. Filters where the preset
  // surfaces (button-tagged custom presets only show on button/a, etc.)
  // — keeps the surface consistent with built-ins.
  matchTags: ReadonlyArray<string>;
  // Visual hint for the swatch. Inferred at save time from the
  // currently-selected category's preview shape.
  shape: PresetShape;
  // Inline-style preview override — caller renders a generic swatch
  // when `previewClasses` is empty (most cases). Future expansion.
  previewClasses?: string;
  createdAt: number;
}

interface CustomPresetsFile {
  version: number;
  items: CustomPreset[];
}

export function loadCustomPresets(): CustomPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_PRESETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<CustomPresetsFile>;
    if (!parsed || typeof parsed !== "object") return [];
    if (!Array.isArray(parsed.items)) return [];
    // Filter malformed entries defensively. A bad entry shouldn't
    // poison the whole list — drop just that one.
    return parsed.items.filter(
      (it): it is CustomPreset =>
        Boolean(it) &&
        typeof it === "object" &&
        typeof it.id === "string" &&
        typeof it.name === "string" &&
        typeof it.classes === "string" &&
        Array.isArray(it.matchTags) &&
        typeof it.shape === "string",
    );
  } catch {
    return [];
  }
}

export function saveCustomPresets(items: ReadonlyArray<CustomPreset>): void {
  if (typeof window === "undefined") return;
  try {
    const file: CustomPresetsFile = {
      version: CUSTOM_PRESETS_VERSION,
      items: [...items],
    };
    window.localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(file));
  } catch {
    // localStorage full / disabled / private mode — silent. v1 doesn't
    // surface a toast; v2 could.
  }
}

/**
 * Convert a saved CustomPreset into the shape PresetTile expects.
 * Builds a synthetic preview based on the saved shape — the actual
 * Tailwind tokens determine the look in the iframe; the swatch is
 * just an indication.
 */
export function customToStylePreset(c: CustomPreset): StylePreset {
  return {
    id: `custom:${c.id}`,
    name: c.name,
    classes: c.classes,
    preview: {
      shape: c.shape,
      bg: "#F1F5F9", // slate-100 as a neutral custom-preset hint
      fg: "#0F172A",
      radius: "6px",
      label: c.name,
    },
  };
}

/**
 * Filter saved custom presets that apply to the supplied tag.
 */
export function getCustomPresetsForTag(
  tag: string,
  all: ReadonlyArray<CustomPreset>,
): ReadonlyArray<CustomPreset> {
  const t = tag.toLowerCase();
  return all.filter((c) => c.matchTags.includes(t));
}

/**
 * Pick the best-matching shape category for a saved preset by tag —
 * matches against the built-in registry. Falls back to "card".
 */
export function inferShapeForTag(tag: string): PresetShape {
  const t = tag.toLowerCase();
  for (const cat of STYLE_PRESETS) {
    if (cat.matchTags.includes(t)) {
      return cat.presets[0]?.preview.shape ?? "card";
    }
  }
  return "card";
}

/**
 * Strip the user's classes down to the preset-domain tokens only —
 * what an `applyPreset` call would leave behind. Used by "save as
 * preset" so the saved preset only carries visual tokens (bg, text,
 * border, padding, etc.) and not layout / size / position classes.
 */
export function extractPresetClasses(
  current: ReadonlyArray<string>,
): string {
  const kept = current.filter((c) => isPresetStripClass(c));
  return kept.join(" ");
}
