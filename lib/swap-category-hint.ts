// Thirty-third-pass — Swap auto-category routing.
//
// When the user enters Swap mode (W key / Swap toolbar button) on a
// selection with a recognisable role — e.g. a `<button>`, a div with
// class "card", an `<img>` — the library should pre-filter to the
// matching component category instead of opening to whatever filter
// the user last left active. The heuristic table here is tag-first
// (the HTML tag is the strongest signal of intent), with a class-
// based fallback for divs/sections/etc whose class tokens disclose a
// specific role (e.g. `class="card-base shadow-md"` → cards).
//
// Conflict resolution: tag wins when a mapping exists. A `<button>`
// sitting inside a div.card-inner should swap a button, not a card —
// the user's selection points at the button, not the card. Class
// fallback is only consulted for tag values that have no direct
// category mapping (div, section, span, article, etc).
//
// Output panel hints:
//   - panel: "components" → ComponentsPanel
//   - panel: "media"      → MediaPanel
//   - panel: "icons"      → IconsPanel
//
// `category` is meaningful only for the components panel. `null` =
// open the panel with no specific filter.
//
// Returns null when no confident hint can be inferred — caller falls
// back to the existing default tab (whatever the user last had open).
//
// Pure / synchronous. Tested via `scripts/bench-swap-category-hint.mjs`.

export type SwapHintPanel = "components" | "media" | "icons";

export interface SwapCategoryHint {
  panel: SwapHintPanel;
  category?: string;
}

// Tag → hint mapping. Tags here have a strong, unambiguous category
// in the component library. Order matches the library's category
// taxonomy exposed in /public/data/components/index.json (accordions,
// alerts, badges, breadcrumbs, buttons, cards, ...). Anything not
// listed falls through to the class-based heuristic below.
//
// IMPORTANT: keep keys lowercase. Caller normalises tags via
// String.toLowerCase before lookup, but the table itself uses
// lowercase as the source of truth.
const TAG_HINTS: Readonly<Record<string, SwapCategoryHint>> = {
  // Form / interactive controls.
  button:   { panel: "components", category: "buttons" },
  input:    { panel: "components", category: "inputs" },
  textarea: { panel: "components", category: "inputs" },
  select:   { panel: "components", category: "inputs" },
  form:     { panel: "components", category: "forms" },
  fieldset: { panel: "components", category: "forms" },
  // Layout regions with a clear category.
  nav:      { panel: "components", category: "navbars" },
  footer:   { panel: "components", category: "footers" },
  table:    { panel: "components", category: "tables" },
  // Media. Covers `<img>`, `<video>`, `<picture>`, `<audio>`. The
  // media panel doesn't have category sub-filters that match this
  // shape, so we just route to the panel without a category.
  img:      { panel: "media" },
  video:    { panel: "media" },
  picture:  { panel: "media" },
  audio:    { panel: "media" },
  // Icons — `<svg>` is the cleanest signal. `<i>` is also common
  // for icon fonts (Font Awesome, Bootstrap Icons) but `<i>` is
  // ambiguous (italic text); class-based detection handles that.
  svg:      { panel: "icons" },
};

// Class-token regexps for fallback when the tag has no mapping. The
// tokens are matched against the FULL classes array, not concatenated,
// so a partial match within a longer token (e.g. "discard" containing
// "card") doesn't trigger. Each entry maps a regex → hint; first match
// wins (the order here is the priority order).
//
// Patterns are anchored with word-edge guards via the regex itself;
// callers do NOT need to add their own ^/$. Each token is tested
// individually so multi-class strings like "rounded-lg shadow-md card"
// match cleanly.
const CLASS_HINTS: ReadonlyArray<readonly [RegExp, SwapCategoryHint]> = [
  // Cards: explicit "card" / "card-*" / "*-card" tokens.
  [/^card(?:-[a-z0-9-]+)?$/, { panel: "components", category: "cards" }],
  [/^[a-z0-9-]+-card$/,      { panel: "components", category: "cards" }],
  // Modals / dialogs.
  [/^modal(?:-[a-z0-9-]+)?$/, { panel: "components", category: "modals" }],
  [/^dialog(?:-[a-z0-9-]+)?$/, { panel: "components", category: "modals" }],
  // Alerts / banners / notifications.
  [/^alert(?:-[a-z0-9-]+)?$/, { panel: "components", category: "alerts" }],
  [/^banner(?:-[a-z0-9-]+)?$/, { panel: "components", category: "alerts" }],
  [/^notification(?:-[a-z0-9-]+)?$/, { panel: "components", category: "notifications" }],
  // Badges / chips / pills.
  [/^badge(?:-[a-z0-9-]+)?$/, { panel: "components", category: "badges" }],
  [/^chip(?:-[a-z0-9-]+)?$/, { panel: "components", category: "badges" }],
  [/^pill(?:-[a-z0-9-]+)?$/, { panel: "components", category: "badges" }],
  // Navigation bars.
  [/^navbar(?:-[a-z0-9-]+)?$/, { panel: "components", category: "navbars" }],
  // Footers.
  [/^footer(?:-[a-z0-9-]+)?$/, { panel: "components", category: "footers" }],
  // Breadcrumbs.
  [/^breadcrumb(?:s)?(?:-[a-z0-9-]+)?$/, { panel: "components", category: "breadcrumbs" }],
  // Dropdowns.
  [/^dropdown(?:-[a-z0-9-]+)?$/, { panel: "components", category: "dropdowns" }],
  // Tabs.
  [/^tab(?:s)?(?:-[a-z0-9-]+)?$/, { panel: "components", category: "tabs" }],
  // Tooltips.
  [/^tooltip(?:-[a-z0-9-]+)?$/, { panel: "components", category: "tooltips" }],
  // Pagination.
  [/^pagination(?:-[a-z0-9-]+)?$/, { panel: "components", category: "pagination" }],
  // Pricing.
  [/^pricing(?:-[a-z0-9-]+)?$/, { panel: "components", category: "pricing" }],
  // Stats / metrics.
  [/^stat(?:s)?(?:-[a-z0-9-]+)?$/, { panel: "components", category: "stats" }],
  // Loaders / spinners.
  [/^loader(?:-[a-z0-9-]+)?$/, { panel: "components", category: "loaders" }],
  [/^spinner(?:-[a-z0-9-]+)?$/, { panel: "components", category: "loaders" }],
  // Switches / toggles.
  [/^switch(?:-[a-z0-9-]+)?$/, { panel: "components", category: "switches" }],
  [/^toggle(?:-[a-z0-9-]+)?$/, { panel: "components", category: "switches" }],
  // Accordions.
  [/^accordion(?:-[a-z0-9-]+)?$/, { panel: "components", category: "accordions" }],
  // Buttons via class fallback (e.g. div role=button or anchor styled
  // as button — common pattern). Tag-first means an actual <button>
  // tag is already routed; this catches `<a class="btn">` etc.
  [/^btn(?:-[a-z0-9-]+)?$/, { panel: "components", category: "buttons" }],
  [/^button(?:-[a-z0-9-]+)?$/, { panel: "components", category: "buttons" }],
  // Icon-class fallbacks for `<i>` and `<span>` icon tags. Common
  // libraries: Lucide (`lucide-*`), Heroicons, Font Awesome (`fa-*`,
  // `fas`, `far`), Bootstrap Icons (`bi-*`).
  [/^lucide(?:-[a-z0-9-]+)?$/, { panel: "icons" }],
  [/^heroicon(?:s)?(?:-[a-z0-9-]+)?$/, { panel: "icons" }],
  [/^fa(?:-[a-z0-9-]+)?$/, { panel: "icons" }],
  [/^fas$/, { panel: "icons" }],
  [/^far$/, { panel: "icons" }],
  [/^fab$/, { panel: "icons" }],
  [/^bi(?:-[a-z0-9-]+)?$/, { panel: "icons" }],
];

export function inferSwapCategory(
  tag: string | null | undefined,
  classes: ReadonlyArray<string> | null | undefined,
): SwapCategoryHint | null {
  // Tag-first lookup. Empty/null tag falls through to class-based.
  if (typeof tag === "string" && tag.length > 0) {
    const t = tag.toLowerCase();
    const tagHint = TAG_HINTS[t];
    if (tagHint) return tagHint;
  }
  // Class-based fallback. Iterate classes × patterns; first match wins.
  // The double loop is bounded — realistic class arrays have < 20
  // entries and the pattern table is short.
  if (Array.isArray(classes)) {
    for (const cls of classes) {
      if (typeof cls !== "string" || cls.length === 0) continue;
      const c = cls.toLowerCase();
      for (const [re, hint] of CLASS_HINTS) {
        if (re.test(c)) return hint;
      }
    }
  }
  return null;
}

// Constants exported for the bench (locks the tag table).
export const SWAP_CATEGORY_HINT_CONSTANTS = {
  TAG_HINTS,
  // Length count is a useful canary — if the table grows or shrinks
  // unintentionally, the bench's count assertion catches it.
  TAG_HINT_COUNT: Object.keys(TAG_HINTS).length,
  CLASS_HINT_COUNT: CLASS_HINTS.length,
} as const;
