import { describe, it, expect } from "vitest";
import {
  inferSwapCategory,
  SWAP_CATEGORY_HINT_CONSTANTS,
} from "../lib/swap-category-hint";

// Prod-import test for lib/swap-category-hint.ts. Counterweight to
// the bench inline-mirror anti-pattern (scripts/bench-swap-category-
// hint.mjs inlines its own copies of TAG_HINTS, CLASS_HINTS, and the
// resolution function). The prod-import path is the only one that
// catches a drift between the bench's hand-copied table and the
// production source-of-truth table.

describe("lib/swap-category-hint — TAG_HINTS lookup", () => {
  it("maps form/interactive control tags to inputs/forms/buttons", () => {
    expect(inferSwapCategory("button", null)).toEqual({
      panel: "components",
      category: "buttons",
    });
    expect(inferSwapCategory("input", null)).toEqual({
      panel: "components",
      category: "inputs",
    });
    expect(inferSwapCategory("textarea", null)).toEqual({
      panel: "components",
      category: "inputs",
    });
    expect(inferSwapCategory("select", null)).toEqual({
      panel: "components",
      category: "inputs",
    });
    expect(inferSwapCategory("form", null)).toEqual({
      panel: "components",
      category: "forms",
    });
    expect(inferSwapCategory("fieldset", null)).toEqual({
      panel: "components",
      category: "forms",
    });
  });

  it("maps layout-region tags to navbars/footers/tables", () => {
    expect(inferSwapCategory("nav", null)).toEqual({
      panel: "components",
      category: "navbars",
    });
    expect(inferSwapCategory("footer", null)).toEqual({
      panel: "components",
      category: "footers",
    });
    expect(inferSwapCategory("table", null)).toEqual({
      panel: "components",
      category: "tables",
    });
  });

  it("maps media tags to media panel without category", () => {
    expect(inferSwapCategory("img", null)).toEqual({ panel: "media" });
    expect(inferSwapCategory("video", null)).toEqual({ panel: "media" });
    expect(inferSwapCategory("picture", null)).toEqual({ panel: "media" });
    expect(inferSwapCategory("audio", null)).toEqual({ panel: "media" });
  });

  it("maps svg to icons panel without category", () => {
    expect(inferSwapCategory("svg", null)).toEqual({ panel: "icons" });
  });

  it("returns null for tags not in the table when no classes given", () => {
    expect(inferSwapCategory("div", null)).toBeNull();
    expect(inferSwapCategory("section", null)).toBeNull();
    expect(inferSwapCategory("article", null)).toBeNull();
    expect(inferSwapCategory("span", null)).toBeNull();
    expect(inferSwapCategory("h1", null)).toBeNull();
    expect(inferSwapCategory("p", null)).toBeNull();
  });
});

describe("lib/swap-category-hint — case insensitivity", () => {
  it("normalizes tag to lowercase before lookup", () => {
    expect(inferSwapCategory("BUTTON", null)).toEqual({
      panel: "components",
      category: "buttons",
    });
    expect(inferSwapCategory("Img", null)).toEqual({ panel: "media" });
    expect(inferSwapCategory("SVG", null)).toEqual({ panel: "icons" });
  });

  it("normalizes class tokens to lowercase before regex test", () => {
    expect(inferSwapCategory("div", ["CARD"])).toEqual({
      panel: "components",
      category: "cards",
    });
    expect(inferSwapCategory("div", ["Modal-Header"])).toEqual({
      panel: "components",
      category: "modals",
    });
  });
});

describe("lib/swap-category-hint — tag wins over class fallback", () => {
  it("uses tag mapping even if classes would yield a different category", () => {
    // <button class="card"> — tag says buttons, classes hint cards.
    // Tag wins per spec ("Conflict resolution: tag wins when a
    // mapping exists").
    const got = inferSwapCategory("button", ["card", "shadow-md"]);
    expect(got).toEqual({ panel: "components", category: "buttons" });
  });

  it("class fallback ONLY applies when the tag has no mapping", () => {
    // <div class="card-base"> — div has no tag mapping, class kicks in.
    expect(inferSwapCategory("div", ["card-base"])).toEqual({
      panel: "components",
      category: "cards",
    });
    // <a class="btn"> — anchor styled as button.
    expect(inferSwapCategory("a", ["btn", "btn-primary"])).toEqual({
      panel: "components",
      category: "buttons",
    });
  });
});

describe("lib/swap-category-hint — CLASS_HINTS regex anchoring", () => {
  it("matches bare 'card' token", () => {
    expect(inferSwapCategory("div", ["card"])).toEqual({
      panel: "components",
      category: "cards",
    });
  });

  it("matches 'card-' suffix variants (card-base, card-header)", () => {
    expect(inferSwapCategory("div", ["card-base"])).toEqual({
      panel: "components",
      category: "cards",
    });
    expect(inferSwapCategory("div", ["card-header"])).toEqual({
      panel: "components",
      category: "cards",
    });
  });

  it("matches '*-card' prefix variants (my-card)", () => {
    expect(inferSwapCategory("div", ["my-card"])).toEqual({
      panel: "components",
      category: "cards",
    });
    expect(inferSwapCategory("div", ["product-card"])).toEqual({
      panel: "components",
      category: "cards",
    });
  });

  it("does NOT match 'discard' (regex is anchored, not a substring search)", () => {
    expect(inferSwapCategory("div", ["discard"])).toBeNull();
  });

  it("does NOT match 'card_foo' or 'cardfoo' (only '-' separator allowed)", () => {
    expect(inferSwapCategory("div", ["card_foo"])).toBeNull();
    expect(inferSwapCategory("div", ["cardfoo"])).toBeNull();
  });

  it("does NOT match 'my-card-extras' (must end with -card or be card-*)", () => {
    expect(inferSwapCategory("div", ["my-card-extras"])).toBeNull();
  });
});

describe("lib/swap-category-hint — modals / dialogs", () => {
  it("maps both 'modal' and 'dialog' classes to modals category", () => {
    expect(inferSwapCategory("div", ["modal"])).toEqual({
      panel: "components",
      category: "modals",
    });
    expect(inferSwapCategory("div", ["dialog"])).toEqual({
      panel: "components",
      category: "modals",
    });
    expect(inferSwapCategory("div", ["modal-header"])).toEqual({
      panel: "components",
      category: "modals",
    });
  });
});

describe("lib/swap-category-hint — alerts / banners / notifications", () => {
  it("maps alert + banner → alerts; notification → notifications", () => {
    expect(inferSwapCategory("div", ["alert"])).toEqual({
      panel: "components",
      category: "alerts",
    });
    expect(inferSwapCategory("div", ["banner-warning"])).toEqual({
      panel: "components",
      category: "alerts",
    });
    expect(inferSwapCategory("div", ["notification-toast"])).toEqual({
      panel: "components",
      category: "notifications",
    });
  });
});

describe("lib/swap-category-hint — badges / chips / pills", () => {
  it("maps badge, chip, pill → badges", () => {
    expect(inferSwapCategory("span", ["badge"])).toEqual({
      panel: "components",
      category: "badges",
    });
    expect(inferSwapCategory("span", ["chip"])).toEqual({
      panel: "components",
      category: "badges",
    });
    expect(inferSwapCategory("span", ["pill-success"])).toEqual({
      panel: "components",
      category: "badges",
    });
  });
});

describe("lib/swap-category-hint — breadcrumb plural form", () => {
  it("matches both 'breadcrumb' and 'breadcrumbs' (regex (s)? group)", () => {
    expect(inferSwapCategory("ol", ["breadcrumb"])).toEqual({
      panel: "components",
      category: "breadcrumbs",
    });
    expect(inferSwapCategory("ol", ["breadcrumbs"])).toEqual({
      panel: "components",
      category: "breadcrumbs",
    });
  });
});

describe("lib/swap-category-hint — tabs plural form", () => {
  it("matches both 'tab' and 'tabs'", () => {
    expect(inferSwapCategory("div", ["tab"])).toEqual({
      panel: "components",
      category: "tabs",
    });
    expect(inferSwapCategory("div", ["tabs"])).toEqual({
      panel: "components",
      category: "tabs",
    });
    expect(inferSwapCategory("div", ["tab-pane"])).toEqual({
      panel: "components",
      category: "tabs",
    });
  });
});

describe("lib/swap-category-hint — stats plural form", () => {
  it("matches both 'stat' and 'stats'", () => {
    expect(inferSwapCategory("div", ["stat"])).toEqual({
      panel: "components",
      category: "stats",
    });
    expect(inferSwapCategory("div", ["stats"])).toEqual({
      panel: "components",
      category: "stats",
    });
  });
});

describe("lib/swap-category-hint — loader / spinner share category", () => {
  it("maps both loader and spinner → loaders", () => {
    expect(inferSwapCategory("div", ["loader"])).toEqual({
      panel: "components",
      category: "loaders",
    });
    expect(inferSwapCategory("div", ["spinner"])).toEqual({
      panel: "components",
      category: "loaders",
    });
  });
});

describe("lib/swap-category-hint — switch / toggle share category", () => {
  it("maps switch + toggle → switches", () => {
    expect(inferSwapCategory("div", ["switch"])).toEqual({
      panel: "components",
      category: "switches",
    });
    expect(inferSwapCategory("div", ["toggle"])).toEqual({
      panel: "components",
      category: "switches",
    });
  });
});

describe("lib/swap-category-hint — class-fallback button matches", () => {
  it("matches 'btn' for anchor-styled-as-button (<a class='btn'>)", () => {
    expect(inferSwapCategory("a", ["btn"])).toEqual({
      panel: "components",
      category: "buttons",
    });
  });

  it("matches 'btn-primary' / 'btn-large' variants", () => {
    expect(inferSwapCategory("a", ["btn-primary"])).toEqual({
      panel: "components",
      category: "buttons",
    });
    expect(inferSwapCategory("a", ["btn-large"])).toEqual({
      panel: "components",
      category: "buttons",
    });
  });

  it("matches 'button' class on non-button tags (<div role='button'>)", () => {
    expect(inferSwapCategory("div", ["button"])).toEqual({
      panel: "components",
      category: "buttons",
    });
  });
});

describe("lib/swap-category-hint — icon-class fallback for <i>/<span>", () => {
  it("matches lucide-* on <i> tags", () => {
    expect(inferSwapCategory("i", ["lucide-home"])).toEqual({ panel: "icons" });
    expect(inferSwapCategory("i", ["lucide"])).toEqual({ panel: "icons" });
  });

  it("matches Heroicons fallback", () => {
    expect(inferSwapCategory("i", ["heroicon"])).toEqual({ panel: "icons" });
    expect(inferSwapCategory("i", ["heroicons-outline"])).toEqual({
      panel: "icons",
    });
  });

  it("matches Font Awesome fa-prefix", () => {
    expect(inferSwapCategory("i", ["fa-home"])).toEqual({ panel: "icons" });
    expect(inferSwapCategory("i", ["fa-camera-retro"])).toEqual({
      panel: "icons",
    });
  });

  it("matches Font Awesome standalone style classes (fas, far, fab)", () => {
    // These are exact-match patterns — `fas` does NOT match the
    // `^fa(?:-...)?$` rule (no dash) so it falls through to its own
    // explicit pattern.
    expect(inferSwapCategory("i", ["fas"])).toEqual({ panel: "icons" });
    expect(inferSwapCategory("i", ["far"])).toEqual({ panel: "icons" });
    expect(inferSwapCategory("i", ["fab"])).toEqual({ panel: "icons" });
  });

  it("matches Bootstrap Icons (bi-*)", () => {
    expect(inferSwapCategory("i", ["bi-home"])).toEqual({ panel: "icons" });
    expect(inferSwapCategory("i", ["bi"])).toEqual({ panel: "icons" });
  });
});

describe("lib/swap-category-hint — first match wins on multi-class", () => {
  it("returns the first matching pattern across multiple classes", () => {
    // Classes ordered: tailwind utility + card. card matches; nothing
    // before would match; output is cards.
    const got = inferSwapCategory("div", [
      "rounded-lg",
      "shadow-md",
      "card",
      "extra",
    ]);
    expect(got).toEqual({ panel: "components", category: "cards" });
  });

  it("stops at the first matching class even if a later one would also match", () => {
    // 'badge' matches before 'card' in the input array — but 'card'
    // is earlier in the CLASS_HINTS table. Iteration order is
    // classes outer / patterns inner per source: "for (const cls of
    // classes) { for (const [re, hint] of CLASS_HINTS) ... }"
    // So the FIRST class that matches ANY pattern wins.
    const got = inferSwapCategory("div", ["badge", "card"]);
    expect(got).toEqual({ panel: "components", category: "badges" });
  });
});

describe("lib/swap-category-hint — null/empty input handling", () => {
  it("returns null when both tag and classes are null/undefined", () => {
    expect(inferSwapCategory(null, null)).toBeNull();
    expect(inferSwapCategory(undefined, undefined)).toBeNull();
    expect(inferSwapCategory(null, undefined)).toBeNull();
  });

  it("falls through to class-only path when tag is empty string", () => {
    expect(inferSwapCategory("", ["card"])).toEqual({
      panel: "components",
      category: "cards",
    });
  });

  it("falls through to class-only path when tag is null", () => {
    expect(inferSwapCategory(null, ["btn"])).toEqual({
      panel: "components",
      category: "buttons",
    });
  });

  it("returns null for empty classes array with no tag mapping", () => {
    expect(inferSwapCategory("div", [])).toBeNull();
    expect(inferSwapCategory("", [])).toBeNull();
  });

  it("skips empty-string class tokens", () => {
    expect(inferSwapCategory("div", ["", "", "card"])).toEqual({
      panel: "components",
      category: "cards",
    });
  });

  it("skips non-string class entries safely", () => {
    // Mock a malformed classes array (TS would normally guard, but
    // runtime should still survive). cast through unknown so TS
    // doesn't reject.
    const malformed = [null, undefined, 42, "card"] as unknown as string[];
    expect(inferSwapCategory("div", malformed)).toEqual({
      panel: "components",
      category: "cards",
    });
  });

  it("returns null when classes is not an Array (defensive guard)", () => {
    // Source uses Array.isArray; non-array falls through to null.
    const notArray = "card" as unknown as string[];
    expect(inferSwapCategory("div", notArray)).toBeNull();
  });
});

describe("lib/swap-category-hint — SWAP_CATEGORY_HINT_CONSTANTS canary", () => {
  it("locks TAG_HINT_COUNT (table size canary)", () => {
    // 14 tags: button, input, textarea, select, form, fieldset, nav,
    // footer, table, img, video, picture, audio, svg.
    expect(SWAP_CATEGORY_HINT_CONSTANTS.TAG_HINT_COUNT).toBe(14);
  });

  it("locks CLASS_HINT_COUNT (regex table size canary)", () => {
    // 33 entries — see source comment block. If the table grows or
    // shrinks unintentionally, this catches it.
    expect(SWAP_CATEGORY_HINT_CONSTANTS.CLASS_HINT_COUNT).toBe(33);
  });

  it("exposes the actual TAG_HINTS table via the constant", () => {
    expect(SWAP_CATEGORY_HINT_CONSTANTS.TAG_HINTS["button"]).toEqual({
      panel: "components",
      category: "buttons",
    });
    expect(SWAP_CATEGORY_HINT_CONSTANTS.TAG_HINTS["svg"]).toEqual({
      panel: "icons",
    });
  });

  it("TAG_HINT_COUNT matches Object.keys(TAG_HINTS).length (self-consistency)", () => {
    expect(SWAP_CATEGORY_HINT_CONSTANTS.TAG_HINT_COUNT).toBe(
      Object.keys(SWAP_CATEGORY_HINT_CONSTANTS.TAG_HINTS).length,
    );
  });
});

describe("lib/swap-category-hint — pricing / pagination / tooltip / dropdown / accordion", () => {
  it("maps pricing", () => {
    expect(inferSwapCategory("div", ["pricing"])).toEqual({
      panel: "components",
      category: "pricing",
    });
    expect(inferSwapCategory("div", ["pricing-table"])).toEqual({
      panel: "components",
      category: "pricing",
    });
  });

  it("maps pagination", () => {
    expect(inferSwapCategory("nav", ["pagination"])).toEqual({
      panel: "components",
      category: "navbars",
    });
    // Tag wins (nav → navbars). Direct fallback test:
    expect(inferSwapCategory("ul", ["pagination"])).toEqual({
      panel: "components",
      category: "pagination",
    });
  });

  it("maps tooltip", () => {
    expect(inferSwapCategory("div", ["tooltip"])).toEqual({
      panel: "components",
      category: "tooltips",
    });
  });

  it("maps dropdown", () => {
    expect(inferSwapCategory("div", ["dropdown"])).toEqual({
      panel: "components",
      category: "dropdowns",
    });
    expect(inferSwapCategory("div", ["dropdown-menu"])).toEqual({
      panel: "components",
      category: "dropdowns",
    });
  });

  it("maps accordion", () => {
    expect(inferSwapCategory("div", ["accordion"])).toEqual({
      panel: "components",
      category: "accordions",
    });
  });
});

describe("lib/swap-category-hint — navbar/footer class fallback (no tag)", () => {
  it("matches navbar class on non-nav tag", () => {
    // <header class="navbar"> — header has no tag mapping, navbar class hits.
    expect(inferSwapCategory("header", ["navbar"])).toEqual({
      panel: "components",
      category: "navbars",
    });
  });

  it("matches footer class on non-footer tag", () => {
    // <div class="footer"> — div has no tag mapping, footer class hits.
    expect(inferSwapCategory("div", ["footer"])).toEqual({
      panel: "components",
      category: "footers",
    });
  });
});
