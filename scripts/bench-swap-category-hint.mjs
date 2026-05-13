// Thirty-third-pass — bench for `lib/swap-category-hint.ts`. Locks
// the tag → hint table, the class-fallback regex priority, and the
// tag-first precedence rule. Helpers inlined here for hermetic
// testing — if `lib/swap-category-hint.ts` diverges, the vitest
// wrapper's bench-summary cross-check still surfaces the mismatch
// via diff.

const TAG_HINTS = {
  button:   { panel: "components", category: "buttons" },
  input:    { panel: "components", category: "inputs" },
  textarea: { panel: "components", category: "inputs" },
  select:   { panel: "components", category: "inputs" },
  form:     { panel: "components", category: "forms" },
  fieldset: { panel: "components", category: "forms" },
  nav:      { panel: "components", category: "navbars" },
  footer:   { panel: "components", category: "footers" },
  table:    { panel: "components", category: "tables" },
  img:      { panel: "media" },
  video:    { panel: "media" },
  picture:  { panel: "media" },
  audio:    { panel: "media" },
  svg:      { panel: "icons" },
};

const CLASS_HINTS = [
  [/^card(?:-[a-z0-9-]+)?$/, { panel: "components", category: "cards" }],
  [/^[a-z0-9-]+-card$/,      { panel: "components", category: "cards" }],
  [/^modal(?:-[a-z0-9-]+)?$/, { panel: "components", category: "modals" }],
  [/^dialog(?:-[a-z0-9-]+)?$/, { panel: "components", category: "modals" }],
  [/^alert(?:-[a-z0-9-]+)?$/, { panel: "components", category: "alerts" }],
  [/^banner(?:-[a-z0-9-]+)?$/, { panel: "components", category: "alerts" }],
  [/^notification(?:-[a-z0-9-]+)?$/, { panel: "components", category: "notifications" }],
  [/^badge(?:-[a-z0-9-]+)?$/, { panel: "components", category: "badges" }],
  [/^chip(?:-[a-z0-9-]+)?$/, { panel: "components", category: "badges" }],
  [/^pill(?:-[a-z0-9-]+)?$/, { panel: "components", category: "badges" }],
  [/^navbar(?:-[a-z0-9-]+)?$/, { panel: "components", category: "navbars" }],
  [/^footer(?:-[a-z0-9-]+)?$/, { panel: "components", category: "footers" }],
  [/^breadcrumb(?:s)?(?:-[a-z0-9-]+)?$/, { panel: "components", category: "breadcrumbs" }],
  [/^dropdown(?:-[a-z0-9-]+)?$/, { panel: "components", category: "dropdowns" }],
  [/^tab(?:s)?(?:-[a-z0-9-]+)?$/, { panel: "components", category: "tabs" }],
  [/^tooltip(?:-[a-z0-9-]+)?$/, { panel: "components", category: "tooltips" }],
  [/^pagination(?:-[a-z0-9-]+)?$/, { panel: "components", category: "pagination" }],
  [/^pricing(?:-[a-z0-9-]+)?$/, { panel: "components", category: "pricing" }],
  [/^stat(?:s)?(?:-[a-z0-9-]+)?$/, { panel: "components", category: "stats" }],
  [/^loader(?:-[a-z0-9-]+)?$/, { panel: "components", category: "loaders" }],
  [/^spinner(?:-[a-z0-9-]+)?$/, { panel: "components", category: "loaders" }],
  [/^switch(?:-[a-z0-9-]+)?$/, { panel: "components", category: "switches" }],
  [/^toggle(?:-[a-z0-9-]+)?$/, { panel: "components", category: "switches" }],
  [/^accordion(?:-[a-z0-9-]+)?$/, { panel: "components", category: "accordions" }],
  [/^btn(?:-[a-z0-9-]+)?$/, { panel: "components", category: "buttons" }],
  [/^button(?:-[a-z0-9-]+)?$/, { panel: "components", category: "buttons" }],
  [/^lucide(?:-[a-z0-9-]+)?$/, { panel: "icons" }],
  [/^heroicon(?:s)?(?:-[a-z0-9-]+)?$/, { panel: "icons" }],
  [/^fa(?:-[a-z0-9-]+)?$/, { panel: "icons" }],
  [/^fas$/, { panel: "icons" }],
  [/^far$/, { panel: "icons" }],
  [/^fab$/, { panel: "icons" }],
  [/^bi(?:-[a-z0-9-]+)?$/, { panel: "icons" }],
];

function inferSwapCategory(tag, classes) {
  if (typeof tag === "string" && tag.length > 0) {
    const t = tag.toLowerCase();
    const tagHint = TAG_HINTS[t];
    if (tagHint) return tagHint;
  }
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

let passed = 0;
let failed = 0;
function assertEq(label, got, want) {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  if (a === b) {
    passed++;
    console.log(`PASS: ${label}`);
  } else {
    failed++;
    console.log(`FAIL: ${label}\n  got:  ${a}\n  want: ${b}`);
  }
}

// ---- Tag-based mappings ----

assertEq("1: button → buttons",
  inferSwapCategory("button", []),
  { panel: "components", category: "buttons" });
assertEq("2: input → inputs",
  inferSwapCategory("input", []),
  { panel: "components", category: "inputs" });
assertEq("3: textarea → inputs",
  inferSwapCategory("textarea", []),
  { panel: "components", category: "inputs" });
assertEq("4: select → inputs",
  inferSwapCategory("select", []),
  { panel: "components", category: "inputs" });
assertEq("5: form → forms",
  inferSwapCategory("form", []),
  { panel: "components", category: "forms" });
assertEq("6: fieldset → forms",
  inferSwapCategory("fieldset", []),
  { panel: "components", category: "forms" });
assertEq("7: nav → navbars",
  inferSwapCategory("nav", []),
  { panel: "components", category: "navbars" });
assertEq("8: footer → footers",
  inferSwapCategory("footer", []),
  { panel: "components", category: "footers" });
assertEq("9: table → tables",
  inferSwapCategory("table", []),
  { panel: "components", category: "tables" });
assertEq("10: img → media",
  inferSwapCategory("img", []),
  { panel: "media" });
assertEq("11: video → media",
  inferSwapCategory("video", []),
  { panel: "media" });
assertEq("12: picture → media",
  inferSwapCategory("picture", []),
  { panel: "media" });
assertEq("13: audio → media",
  inferSwapCategory("audio", []),
  { panel: "media" });
assertEq("14: svg → icons",
  inferSwapCategory("svg", []),
  { panel: "icons" });

// Tag is case-insensitive.
assertEq("15: BUTTON (uppercase) → buttons",
  inferSwapCategory("BUTTON", []),
  { panel: "components", category: "buttons" });
assertEq("16: Img (mixed case) → media",
  inferSwapCategory("Img", []),
  { panel: "media" });

// Unmapped tags fall through.
assertEq("17: div → null (when no classes)",
  inferSwapCategory("div", []),
  null);
assertEq("18: section → null (when no classes)",
  inferSwapCategory("section", []),
  null);
assertEq("19: span → null (when no classes)",
  inferSwapCategory("span", []),
  null);
assertEq("20: h1 → null (heading not mapped)",
  inferSwapCategory("h1", []),
  null);
assertEq("21: p → null",
  inferSwapCategory("p", []),
  null);
assertEq("22: article → null",
  inferSwapCategory("article", []),
  null);
assertEq("23: main → null",
  inferSwapCategory("main", []),
  null);

// ---- Class-based fallback ----

assertEq("24: div + class='card' → cards",
  inferSwapCategory("div", ["card"]),
  { panel: "components", category: "cards" });
assertEq("25: div + class='card-base' → cards",
  inferSwapCategory("div", ["card-base"]),
  { panel: "components", category: "cards" });
assertEq("26: div + class='product-card' → cards",
  inferSwapCategory("div", ["product-card"]),
  { panel: "components", category: "cards" });
assertEq("27: section + class='modal' → modals",
  inferSwapCategory("section", ["modal"]),
  { panel: "components", category: "modals" });
assertEq("28: section + class='modal-overlay' → modals",
  inferSwapCategory("section", ["modal-overlay"]),
  { panel: "components", category: "modals" });
assertEq("29: div + class='dialog' → modals",
  inferSwapCategory("div", ["dialog"]),
  { panel: "components", category: "modals" });
assertEq("30: div + class='alert' → alerts",
  inferSwapCategory("div", ["alert"]),
  { panel: "components", category: "alerts" });
assertEq("31: div + class='banner-info' → alerts",
  inferSwapCategory("div", ["banner-info"]),
  { panel: "components", category: "alerts" });
assertEq("32: div + class='notification' → notifications",
  inferSwapCategory("div", ["notification"]),
  { panel: "components", category: "notifications" });
assertEq("33: span + class='badge' → badges",
  inferSwapCategory("span", ["badge"]),
  { panel: "components", category: "badges" });
assertEq("34: span + class='chip' → badges",
  inferSwapCategory("span", ["chip"]),
  { panel: "components", category: "badges" });
assertEq("35: span + class='pill' → badges",
  inferSwapCategory("span", ["pill"]),
  { panel: "components", category: "badges" });
assertEq("36: header + class='navbar' → navbars",
  inferSwapCategory("header", ["navbar"]),
  { panel: "components", category: "navbars" });
assertEq("37: nav + class='navbar' → navbars (tag-first wins)",
  inferSwapCategory("nav", ["navbar"]),
  { panel: "components", category: "navbars" });
assertEq("38: ol + class='breadcrumbs' → breadcrumbs",
  inferSwapCategory("ol", ["breadcrumbs"]),
  { panel: "components", category: "breadcrumbs" });
assertEq("39: ol + class='breadcrumb' → breadcrumbs (singular)",
  inferSwapCategory("ol", ["breadcrumb"]),
  { panel: "components", category: "breadcrumbs" });
assertEq("40: div + class='dropdown' → dropdowns",
  inferSwapCategory("div", ["dropdown"]),
  { panel: "components", category: "dropdowns" });
assertEq("41: ul + class='tabs' → tabs",
  inferSwapCategory("ul", ["tabs"]),
  { panel: "components", category: "tabs" });
assertEq("42: div + class='tooltip' → tooltips",
  inferSwapCategory("div", ["tooltip"]),
  { panel: "components", category: "tooltips" });
assertEq("43: nav + class='pagination' → navbars (tag-first)",
  inferSwapCategory("nav", ["pagination"]),
  { panel: "components", category: "navbars" });
assertEq("44: div + class='pagination' → pagination",
  inferSwapCategory("div", ["pagination"]),
  { panel: "components", category: "pagination" });
assertEq("45: section + class='pricing' → pricing",
  inferSwapCategory("section", ["pricing"]),
  { panel: "components", category: "pricing" });
assertEq("46: div + class='stats' → stats",
  inferSwapCategory("div", ["stats"]),
  { panel: "components", category: "stats" });
assertEq("47: div + class='stat' → stats (singular)",
  inferSwapCategory("div", ["stat"]),
  { panel: "components", category: "stats" });
assertEq("48: div + class='loader' → loaders",
  inferSwapCategory("div", ["loader"]),
  { panel: "components", category: "loaders" });
assertEq("49: div + class='spinner' → loaders",
  inferSwapCategory("div", ["spinner"]),
  { panel: "components", category: "loaders" });
assertEq("50: div + class='switch' → switches",
  inferSwapCategory("div", ["switch"]),
  { panel: "components", category: "switches" });
assertEq("51: div + class='toggle' → switches",
  inferSwapCategory("div", ["toggle"]),
  { panel: "components", category: "switches" });
assertEq("52: div + class='accordion' → accordions",
  inferSwapCategory("div", ["accordion"]),
  { panel: "components", category: "accordions" });

// Anchor + class='btn' → buttons (anchor styled as button).
assertEq("53: a + class='btn' → buttons",
  inferSwapCategory("a", ["btn"]),
  { panel: "components", category: "buttons" });
assertEq("54: a + class='btn-primary' → buttons",
  inferSwapCategory("a", ["btn-primary"]),
  { panel: "components", category: "buttons" });
assertEq("55: a + class='button-primary' → buttons",
  inferSwapCategory("a", ["button-primary"]),
  { panel: "components", category: "buttons" });

// Icon-class on `<i>` / `<span>`.
assertEq("56: i + class='lucide-heart' → icons",
  inferSwapCategory("i", ["lucide-heart"]),
  { panel: "icons" });
assertEq("57: span + class='heroicon' → icons",
  inferSwapCategory("span", ["heroicon"]),
  { panel: "icons" });
assertEq("58: i + class='fa-solid' → icons",
  inferSwapCategory("i", ["fa-solid"]),
  { panel: "icons" });
assertEq("59: i + class='fas' → icons",
  inferSwapCategory("i", ["fas"]),
  { panel: "icons" });
assertEq("60: i + class='far' → icons",
  inferSwapCategory("i", ["far"]),
  { panel: "icons" });
assertEq("61: i + class='fab' → icons",
  inferSwapCategory("i", ["fab"]),
  { panel: "icons" });
assertEq("62: i + class='bi-house' → icons",
  inferSwapCategory("i", ["bi-house"]),
  { panel: "icons" });

// ---- Tag-first precedence ----

// `<button>` inside a div with class card → tag wins, returns buttons.
assertEq("63: button + class='card' → buttons (tag wins over class)",
  inferSwapCategory("button", ["card"]),
  { panel: "components", category: "buttons" });
// Unmapped tag with multiple matching classes — first match in CLASS_HINTS order.
assertEq("64: div + ['card', 'modal'] → cards (first in list)",
  inferSwapCategory("div", ["card", "modal"]),
  { panel: "components", category: "cards" });
assertEq("65: div + ['unrelated', 'card'] → cards (later match found)",
  inferSwapCategory("div", ["unrelated", "card"]),
  { panel: "components", category: "cards" });

// ---- Edge cases ----

assertEq("66: null tag, null classes → null",
  inferSwapCategory(null, null),
  null);
assertEq("67: undefined tag, undefined classes → null",
  inferSwapCategory(undefined, undefined),
  null);
assertEq("68: empty tag, empty classes → null",
  inferSwapCategory("", []),
  null);
assertEq("69: empty tag, ['card'] → cards",
  inferSwapCategory("", ["card"]),
  { panel: "components", category: "cards" });
// Tags case-insensitive should still match.
assertEq("70: 'Button' (mixed case) → buttons",
  inferSwapCategory("Button", []),
  { panel: "components", category: "buttons" });
// Class case-insensitive.
assertEq("71: div + ['CARD'] → cards (uppercase class)",
  inferSwapCategory("div", ["CARD"]),
  { panel: "components", category: "cards" });
// Empty string in classes array is ignored.
assertEq("72: div + ['', 'card'] → cards (empty tokens skipped)",
  inferSwapCategory("div", ["", "card"]),
  { panel: "components", category: "cards" });

// ---- Partial-match guards: word-boundary regex ----

// 'discard' contains 'card' but should not match — regex is anchored.
assertEq("73: div + ['discard'] → null (no token-level card match)",
  inferSwapCategory("div", ["discard"]),
  null);
// 'cards' (plural) doesn't match the singular pattern with optional suffix.
// Actually 'cards' fails because the suffix is hyphenated ([a-z0-9-]).
assertEq("74: div + ['cards'] → null (plural doesn't match singular form)",
  inferSwapCategory("div", ["cards"]),
  null);
// 'rounded-md' doesn't match anything.
assertEq("75: div + ['rounded-md'] → null",
  inferSwapCategory("div", ["rounded-md"]),
  null);
// 'flex' doesn't match anything.
assertEq("76: div + ['flex'] → null",
  inferSwapCategory("div", ["flex"]),
  null);
// 'shadow-sm' doesn't match anything.
assertEq("77: div + ['shadow-sm'] → null",
  inferSwapCategory("div", ["shadow-sm"]),
  null);
// 'tab-active' matches /^tab(?:s)?(?:-[a-z0-9-]+)?$/.
assertEq("78: div + ['tab-active'] → tabs",
  inferSwapCategory("div", ["tab-active"]),
  { panel: "components", category: "tabs" });
// 'modal-content' matches /^modal(?:-[a-z0-9-]+)?$/.
assertEq("79: div + ['modal-content'] → modals",
  inferSwapCategory("div", ["modal-content"]),
  { panel: "components", category: "modals" });
// 'data-card' matches /^[a-z0-9-]+-card$/.
assertEq("80: div + ['data-card'] → cards (suffix variant)",
  inferSwapCategory("div", ["data-card"]),
  { panel: "components", category: "cards" });

// ---- Realistic combos ----

// Realistic class soup with a card token in the middle.
assertEq("81: div + ['relative', 'rounded-md', 'card', 'shadow-md'] → cards",
  inferSwapCategory("div", ["relative", "rounded-md", "card", "shadow-md"]),
  { panel: "components", category: "cards" });
// Anchor styled as button with extra utilities.
assertEq("82: a + ['inline-flex', 'btn', 'btn-primary'] → buttons",
  inferSwapCategory("a", ["inline-flex", "btn", "btn-primary"]),
  { panel: "components", category: "buttons" });
// Plain `<i>` with no icon class — falls through.
assertEq("83: i + ['italic'] → null (italic isn't an icon class)",
  inferSwapCategory("i", ["italic"]),
  null);

// ---- Defense-in-depth: helpers don't throw ----

let didThrow = false;
try { inferSwapCategory(null, null); } catch { didThrow = true; }
assertEq("84: inferSwapCategory(null,null) does not throw", didThrow, false);

didThrow = false;
try { inferSwapCategory("button", null); } catch { didThrow = true; }
assertEq("85: inferSwapCategory(button,null) does not throw", didThrow, false);

didThrow = false;
try { inferSwapCategory(null, ["card"]); } catch { didThrow = true; }
assertEq("86: inferSwapCategory(null, [card]) does not throw", didThrow, false);

didThrow = false;
try { inferSwapCategory("button", undefined); } catch { didThrow = true; }
assertEq("87: inferSwapCategory(button, undefined) does not throw", didThrow, false);

// Non-string class entries are filtered.
didThrow = false;
try { inferSwapCategory("div", [123, null, "card"]); } catch { didThrow = true; }
assertEq("88: inferSwapCategory accepts mixed class types without throwing", didThrow, false);

// ---- Pure: no mutation ----

{
  const classes = ["card", "shadow-md"];
  const before = JSON.stringify(classes);
  inferSwapCategory("div", classes);
  inferSwapCategory("div", classes);
  const after = JSON.stringify(classes);
  assertEq("89: inferSwapCategory does not mutate classes input", before, after);
}

// ---- Idempotent ----

{
  const r1 = inferSwapCategory("button", ["btn"]);
  const r2 = inferSwapCategory("button", ["btn"]);
  assertEq("90: idempotent", JSON.stringify(r1), JSON.stringify(r2));
}

// ---- Table size locks ----

assertEq("91: TAG_HINTS table has expected size",
  Object.keys(TAG_HINTS).length, 14);
assertEq("92: CLASS_HINTS table has expected size",
  CLASS_HINTS.length, 33);

console.log(`\nbench-swap-category-hint: ${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
