// Canonical category taxonomy for the sidebar. Maps Uiverse's 11 folders and
// HyperUI's fine-grained MDX slugs onto a single list so the pills look
// coherent. Anything with no mapping falls through to "other" — audit the
// `other` bucket after the first ingest and extend this file to drain it.

export const TAXONOMY = [
  "buttons",
  "cards",
  "loaders",
  "inputs",
  "checkboxes",
  "switches",
  "radios",
  "forms",
  "navbars",
  "tooltips",
  "dropdowns",
  "modals",
  "alerts",
  "badges",
  "avatars",
  "tabs",
  "accordions",
  "tables",
  "pricing",
  "heroes",
  "footers",
  "progress",
  "notifications",
  "backgrounds",
  "breadcrumbs",
  "dividers",
  "media",
  "sidebar",
  "pagination",
  "skeleton",
  "stats",
  "other",
];

const TAXONOMY_SET = new Set(TAXONOMY);

// Uiverse folder → taxonomy slug. Only the outliers need explicit entries;
// folder names that already match (e.g. "Buttons" → "buttons") flow through
// the default-lowercase branch.
const UIVERSE_FOLDER_MAP = {
  Buttons: "buttons",
  Cards: "cards",
  Checkboxes: "checkboxes",
  Forms: "forms",
  Inputs: "inputs",
  Notifications: "notifications",
  Patterns: "backgrounds",
  "Radio-buttons": "radios",
  "Toggle-switches": "switches",
  Tooltips: "tooltips",
  loaders: "loaders",
};

export function categorizeUiverseFolder(folderName) {
  if (folderName in UIVERSE_FOLDER_MAP) return UIVERSE_FOLDER_MAP[folderName];
  const lower = folderName.toLowerCase();
  return TAXONOMY_SET.has(lower) ? lower : "other";
}

// HyperUI: MDX file slug is already close to our taxonomy. A few need
// flattening (plural/singular / naming differences).
const HYPERUI_SLUG_MAP = {
  accordions: "accordions",
  alerts: "alerts",
  avatars: "avatars",
  badges: "badges",
  banners: "alerts",
  "blog-cards": "cards",
  breadcrumbs: "breadcrumbs",
  "button-groups": "buttons",
  buttons: "buttons",
  cards: "cards",
  carts: "cards",
  checkboxes: "checkboxes",
  "contact-sections": "forms",
  "cookie-banners": "alerts",
  "cta-sections": "heroes",
  details: "accordions",
  "details-list": "accordions",
  dividers: "dividers",
  dropdown: "dropdowns",
  dropdowns: "dropdowns",
  "empty-states": "other",
  "faq-sections": "accordions",
  "feature-sections": "heroes",
  "file-uploaders": "inputs",
  filters: "dropdowns",
  "footer-sections": "footers",
  footers: "footers",
  forms: "forms",
  grids: "other",
  "header-sections": "navbars",
  headers: "navbars",
  "hero-sections": "heroes",
  heroes: "heroes",
  inputs: "inputs",
  "logo-clouds": "other",
  loaders: "loaders",
  "login-sections": "forms",
  media: "media",
  menus: "navbars",
  modals: "modals",
  "newsletter-sections": "forms",
  navbars: "navbars",
  navigation: "navbars",
  pagination: "pagination",
  "pricing-sections": "pricing",
  pricing: "pricing",
  "product-cards": "cards",
  "product-collections": "other",
  progress: "progress",
  radios: "radios",
  "section-headings": "other",
  sidebar: "sidebar",
  sliders: "inputs",
  "stats-sections": "stats",
  stats: "stats",
  "step-indicators": "progress",
  steps: "progress",
  stats: "stats",
  switches: "switches",
  tables: "tables",
  tabs: "tabs",
  tags: "badges",
  "team-sections": "other",
  "testimonial-sections": "other",
  toggles: "switches",
  tooltips: "tooltips",
  "trust-indicators": "other",
  typography: "other",
  utilities: "other",
  vertical: "sidebar",
};

export function categorizeHyperUISlug(slug) {
  if (slug in HYPERUI_SLUG_MAP) return HYPERUI_SLUG_MAP[slug];
  const lower = slug.toLowerCase();
  if (TAXONOMY_SET.has(lower)) return lower;
  // Last-resort: strip trailing plural "s" and retry.
  const singular = lower.endsWith("s") ? lower.slice(0, -1) : lower + "s";
  if (TAXONOMY_SET.has(singular)) return singular;
  return "other";
}
