import { describe, it, expect } from "vitest";
import {
  STYLE_PRESETS,
  getPresetCategoriesForTag,
  isPresetStripClass,
  applyPreset,
  applyPresetVariant,
  presetVariantCount,
  presetVariantClasses,
  inferShapeForTag,
  extractPresetClasses,
  getCustomPresetsForTag,
  customToStylePreset,
  loadCustomPresets,
  saveCustomPresets,
  type CustomPreset,
  type StylePreset,
} from "../lib/style-presets";

// Prod-import test for lib/style-presets.ts. Hand-curated 12-preset
// surface (Button × 4, Card × 3, Heading × 3, Input × 2). Pure
// functions get full coverage; localStorage-backed save/load gets
// SSR-safety verification only (vitest env is node, no window).

describe("lib/style-presets — STYLE_PRESETS structure", () => {
  it("ships exactly 4 categories", () => {
    expect(STYLE_PRESETS.length).toBe(4);
  });

  it("Button category matches button + a tags, ships 4 presets", () => {
    const cat = STYLE_PRESETS.find((c) => c.label === "Button");
    expect(cat).toBeDefined();
    expect([...cat!.matchTags]).toEqual(["button", "a"]);
    expect(cat!.presets.length).toBe(4);
    expect(cat!.presets.map((p) => p.id)).toEqual([
      "btn-primary",
      "btn-secondary",
      "btn-ghost",
      "btn-link",
    ]);
  });

  it("Card category matches `article` only (vibecoder-friendly opt-in), ships 3 presets", () => {
    const cat = STYLE_PRESETS.find((c) => c.label === "Card");
    expect(cat).toBeDefined();
    expect([...cat!.matchTags]).toEqual(["article"]);
    expect(cat!.presets.length).toBe(3);
  });

  it("Heading category matches h1..h6, ships 3 presets", () => {
    const cat = STYLE_PRESETS.find((c) => c.label === "Heading");
    expect(cat).toBeDefined();
    expect([...cat!.matchTags]).toEqual(["h1", "h2", "h3", "h4", "h5", "h6"]);
    expect(cat!.presets.length).toBe(3);
  });

  it("Input category matches form-control tags, ships 2 presets", () => {
    const cat = STYLE_PRESETS.find((c) => c.label === "Input");
    expect(cat).toBeDefined();
    expect([...cat!.matchTags]).toEqual(["input", "textarea", "select"]);
    expect(cat!.presets.length).toBe(2);
  });

  it("every preset has stable id, name, and classes", () => {
    for (const cat of STYLE_PRESETS) {
      for (const p of cat.presets) {
        expect(p.id).toBeTruthy();
        expect(p.name).toBeTruthy();
        expect(p.classes).toBeTruthy();
        expect(typeof p.classes).toBe("string");
        expect(p.preview).toBeDefined();
        expect(p.preview.shape).toMatch(/^(button|card|heading|input)$/);
      }
    }
  });

  it("preset ids are globally unique across categories", () => {
    const ids: string[] = [];
    for (const cat of STYLE_PRESETS) for (const p of cat.presets) ids.push(p.id);
    const set = new Set(ids);
    expect(set.size).toBe(ids.length);
  });
});

describe("lib/style-presets — getPresetCategoriesForTag", () => {
  it("returns the Button category for button + a tags", () => {
    expect(getPresetCategoriesForTag("button").map((c) => c.label)).toEqual([
      "Button",
    ]);
    expect(getPresetCategoriesForTag("a").map((c) => c.label)).toEqual([
      "Button",
    ]);
  });

  it("returns the Heading category for h1..h6", () => {
    for (const h of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
      expect(getPresetCategoriesForTag(h).map((c) => c.label)).toEqual([
        "Heading",
      ]);
    }
  });

  it("returns the Card category only for the semantic <article> tag", () => {
    expect(getPresetCategoriesForTag("article").map((c) => c.label)).toEqual([
      "Card",
    ]);
  });

  it("returns [] for generic container tags (Card presets are opt-in)", () => {
    for (const t of ["div", "section", "header", "footer", "main", "aside"]) {
      expect(getPresetCategoriesForTag(t)).toEqual([]);
    }
  });

  it("returns the Input category for input/textarea/select", () => {
    for (const t of ["input", "textarea", "select"]) {
      expect(getPresetCategoriesForTag(t).map((c) => c.label)).toEqual([
        "Input",
      ]);
    }
  });

  it("normalizes tag to lowercase before lookup", () => {
    expect(getPresetCategoriesForTag("BUTTON").map((c) => c.label)).toEqual([
      "Button",
    ]);
    expect(getPresetCategoriesForTag("ARTICLE").map((c) => c.label)).toEqual([
      "Card",
    ]);
  });

  it("returns [] for an unknown tag", () => {
    expect(getPresetCategoriesForTag("p")).toEqual([]);
    expect(getPresetCategoriesForTag("span")).toEqual([]);
    expect(getPresetCategoriesForTag("custom-element")).toEqual([]);
  });
});

describe("lib/style-presets — isPresetStripClass", () => {
  it("strips bg-* classes", () => {
    expect(isPresetStripClass("bg-slate-500")).toBe(true);
    expect(isPresetStripClass("bg-red-500")).toBe(true);
    expect(isPresetStripClass("bg-transparent")).toBe(true);
    expect(isPresetStripClass("bg-[#abc]")).toBe(true);
  });

  it("strips border / border-* classes", () => {
    expect(isPresetStripClass("border")).toBe(true);
    expect(isPresetStripClass("border-2")).toBe(true);
    expect(isPresetStripClass("border-slate-900")).toBe(true);
    expect(isPresetStripClass("border-b-2")).toBe(true);
  });

  it("strips rounded / rounded-* classes", () => {
    expect(isPresetStripClass("rounded")).toBe(true);
    expect(isPresetStripClass("rounded-md")).toBe(true);
    expect(isPresetStripClass("rounded-full")).toBe(true);
    expect(isPresetStripClass("rounded-2xl")).toBe(true);
  });

  it("strips shadow / shadow-* classes", () => {
    expect(isPresetStripClass("shadow")).toBe(true);
    expect(isPresetStripClass("shadow-sm")).toBe(true);
    expect(isPresetStripClass("shadow-lg")).toBe(true);
  });

  it("strips padding (p, pt, px, py, etc.)", () => {
    expect(isPresetStripClass("p-4")).toBe(true);
    expect(isPresetStripClass("pt-2")).toBe(true);
    expect(isPresetStripClass("px-6")).toBe(true);
    expect(isPresetStripClass("py-2.5")).toBe(true);
    expect(isPresetStripClass("pl-1")).toBe(true);
    expect(isPresetStripClass("pr-1")).toBe(true);
    expect(isPresetStripClass("pb-1")).toBe(true);
  });

  it("strips text-color and text-size but NOT text-alignment", () => {
    expect(isPresetStripClass("text-slate-900")).toBe(true);
    expect(isPresetStripClass("text-3xl")).toBe(true);
    expect(isPresetStripClass("text-red-500")).toBe(true);
    // Alignment preserved — positioning, not visual style.
    expect(isPresetStripClass("text-center")).toBe(false);
    expect(isPresetStripClass("text-left")).toBe(false);
    expect(isPresetStripClass("text-right")).toBe(false);
    expect(isPresetStripClass("text-justify")).toBe(false);
    expect(isPresetStripClass("text-start")).toBe(false);
    expect(isPresetStripClass("text-end")).toBe(false);
  });

  it("strips font-* classes", () => {
    expect(isPresetStripClass("font-bold")).toBe(true);
    expect(isPresetStripClass("font-medium")).toBe(true);
    expect(isPresetStripClass("font-mono")).toBe(true);
  });

  it("strips tracking-* / leading-* / decoration-*", () => {
    expect(isPresetStripClass("tracking-tight")).toBe(true);
    expect(isPresetStripClass("leading-loose")).toBe(true);
    expect(isPresetStripClass("decoration-2")).toBe(true);
  });

  it("strips underline/italic toggles", () => {
    expect(isPresetStripClass("underline")).toBe(true);
    expect(isPresetStripClass("no-underline")).toBe(true);
    expect(isPresetStripClass("italic")).toBe(true);
    expect(isPresetStripClass("not-italic")).toBe(true);
  });

  it("strips display utilities (block/flex/grid/etc.)", () => {
    expect(isPresetStripClass("block")).toBe(true);
    expect(isPresetStripClass("inline")).toBe(true);
    expect(isPresetStripClass("inline-block")).toBe(true);
    expect(isPresetStripClass("flex")).toBe(true);
    expect(isPresetStripClass("inline-flex")).toBe(true);
    expect(isPresetStripClass("grid")).toBe(true);
    expect(isPresetStripClass("inline-grid")).toBe(true);
    expect(isPresetStripClass("hidden")).toBe(true);
  });

  it("strips alignment utilities (items/justify/content/place/gap)", () => {
    expect(isPresetStripClass("items-center")).toBe(true);
    expect(isPresetStripClass("justify-between")).toBe(true);
    expect(isPresetStripClass("content-start")).toBe(true);
    expect(isPresetStripClass("place-items-center")).toBe(true);
    expect(isPresetStripClass("gap-2")).toBe(true);
  });

  it("preserves sizing/positioning utilities NOT in the strip set", () => {
    expect(isPresetStripClass("w-full")).toBe(false);
    expect(isPresetStripClass("h-screen")).toBe(false);
    expect(isPresetStripClass("max-w-md")).toBe(false);
    expect(isPresetStripClass("m-4")).toBe(false);
    expect(isPresetStripClass("mx-auto")).toBe(false);
    expect(isPresetStripClass("relative")).toBe(false);
    expect(isPresetStripClass("absolute")).toBe(false);
  });
});

describe("lib/style-presets — applyPreset / applyPresetVariant", () => {
  const fakePreset: StylePreset = {
    id: "test",
    name: "Test",
    classes: "bg-blue-500 text-white p-4 rounded-lg",
    preview: { shape: "button", bg: "#3B82F6", fg: "#FFF", label: "x" },
  };

  it("appends preset tokens to a non-conflicting class list", () => {
    const out = applyPreset(["w-full"], fakePreset);
    expect(out).toContain("w-full");
    expect(out).toContain("bg-blue-500");
    expect(out).toContain("text-white");
    expect(out).toContain("p-4");
    expect(out).toContain("rounded-lg");
  });

  it("strips conflicting tokens (bg-*, p-*, rounded-*, text-color)", () => {
    const out = applyPreset(
      ["bg-red-500", "p-2", "rounded-md", "text-slate-900", "w-full"],
      fakePreset,
    );
    expect(out).not.toContain("bg-red-500");
    expect(out).not.toContain("p-2");
    expect(out).not.toContain("rounded-md");
    expect(out).not.toContain("text-slate-900");
    expect(out).toContain("w-full");
  });

  it("dedupes when an existing class matches a preset token", () => {
    const out = applyPreset(["bg-blue-500", "extra"], fakePreset);
    // bg-blue-500 should appear exactly once.
    expect(out.filter((c) => c === "bg-blue-500").length).toBe(1);
  });

  it("preserves text-alignment classes (text-center / text-left)", () => {
    const out = applyPreset(["text-center", "text-slate-900"], fakePreset);
    expect(out).toContain("text-center");
    expect(out).not.toContain("text-slate-900");
  });

  it("returns just preset tokens for an empty class list", () => {
    const out = applyPreset([], fakePreset);
    expect(out).toEqual(["bg-blue-500", "text-white", "p-4", "rounded-lg"]);
  });

  it("does not mutate the input class list", () => {
    const input = ["w-full", "bg-red-500"];
    const snapshot = [...input];
    applyPreset(input, fakePreset);
    expect(input).toEqual(snapshot);
  });

  it("applyPresetVariant idx=0 equals applyPreset", () => {
    const a = applyPreset(["w-full"], fakePreset);
    const b = applyPresetVariant(["w-full"], fakePreset, 0);
    expect(b).toEqual(a);
  });

  it("applyPresetVariant idx>0 uses variants[idx-1]", () => {
    const variantPreset: StylePreset = {
      id: "v",
      name: "V",
      classes: "bg-slate-900 text-white",
      variants: ["bg-blue-600 text-white", "bg-emerald-600 text-white"],
      preview: { shape: "button", bg: "#000", fg: "#FFF", label: "x" },
    };
    const out = applyPresetVariant([], variantPreset, 1);
    expect(out).toEqual(["bg-blue-600", "text-white"]);
  });

  it("applyPresetVariant idx out of range clamps to base", () => {
    const variantPreset: StylePreset = {
      id: "v",
      name: "V",
      classes: "bg-slate-900",
      variants: ["bg-blue-600"],
      preview: { shape: "button", bg: "#000", fg: "#FFF", label: "x" },
    };
    expect(applyPresetVariant([], variantPreset, 99)).toEqual(["bg-slate-900"]);
    expect(applyPresetVariant([], variantPreset, -5)).toEqual(["bg-slate-900"]);
  });
});

describe("lib/style-presets — presetVariantCount", () => {
  it("returns 1 for a preset with no variants", () => {
    const p: StylePreset = {
      id: "x",
      name: "X",
      classes: "bg-slate-900",
      preview: { shape: "button", bg: "#000", fg: "#FFF", label: "x" },
    };
    expect(presetVariantCount(p)).toBe(1);
  });

  it("returns 1 + variants.length when variants are present", () => {
    const p: StylePreset = {
      id: "x",
      name: "X",
      classes: "bg-slate-900",
      variants: ["bg-blue-600", "bg-emerald-600", "bg-rose-600"],
      preview: { shape: "button", bg: "#000", fg: "#FFF", label: "x" },
    };
    expect(presetVariantCount(p)).toBe(4);
  });
});

describe("lib/style-presets — presetVariantClasses", () => {
  const p: StylePreset = {
    id: "x",
    name: "X",
    classes: "BASE",
    variants: ["V1", "V2"],
    preview: { shape: "button", bg: "#000", fg: "#FFF", label: "x" },
  };

  it("returns base classes for idx<=0", () => {
    expect(presetVariantClasses(p, 0)).toBe("BASE");
    expect(presetVariantClasses(p, -1)).toBe("BASE");
  });

  it("returns variant for idx in range", () => {
    expect(presetVariantClasses(p, 1)).toBe("V1");
    expect(presetVariantClasses(p, 2)).toBe("V2");
  });

  it("returns base when idx exceeds variants.length", () => {
    expect(presetVariantClasses(p, 3)).toBe("BASE");
    expect(presetVariantClasses(p, 99)).toBe("BASE");
  });

  it("returns base when variants is undefined", () => {
    const noVariants: StylePreset = {
      id: "n",
      name: "N",
      classes: "BASE",
      preview: { shape: "button", bg: "#000", fg: "#FFF", label: "x" },
    };
    expect(presetVariantClasses(noVariants, 1)).toBe("BASE");
  });
});

describe("lib/style-presets — inferShapeForTag", () => {
  it("returns 'button' for button/a", () => {
    expect(inferShapeForTag("button")).toBe("button");
    expect(inferShapeForTag("a")).toBe("button");
  });

  it("returns 'heading' for h1..h6", () => {
    expect(inferShapeForTag("h1")).toBe("heading");
    expect(inferShapeForTag("h6")).toBe("heading");
  });

  it("returns 'card' for container tags", () => {
    expect(inferShapeForTag("div")).toBe("card");
    expect(inferShapeForTag("section")).toBe("card");
  });

  it("returns 'input' for input/textarea/select", () => {
    expect(inferShapeForTag("input")).toBe("input");
    expect(inferShapeForTag("textarea")).toBe("input");
    expect(inferShapeForTag("select")).toBe("input");
  });

  it("falls back to 'card' for unknown tags", () => {
    expect(inferShapeForTag("p")).toBe("card");
    expect(inferShapeForTag("span")).toBe("card");
    expect(inferShapeForTag("unknown")).toBe("card");
  });

  it("normalizes input tag to lowercase", () => {
    expect(inferShapeForTag("BUTTON")).toBe("button");
    expect(inferShapeForTag("H1")).toBe("heading");
  });
});

describe("lib/style-presets — extractPresetClasses", () => {
  it("keeps strip-class tokens, drops sizing/positioning", () => {
    const got = extractPresetClasses([
      "bg-slate-500",
      "text-white",
      "p-4",
      "rounded-md",
      "w-full",
      "mx-auto",
      "relative",
    ]);
    expect(got).toContain("bg-slate-500");
    expect(got).toContain("text-white");
    expect(got).toContain("p-4");
    expect(got).toContain("rounded-md");
    expect(got).not.toContain("w-full");
    expect(got).not.toContain("mx-auto");
    expect(got).not.toContain("relative");
  });

  it("returns empty string when nothing is preset-domain", () => {
    expect(extractPresetClasses(["w-full", "mx-auto", "relative"])).toBe("");
  });

  it("preserves text-alignment tokens (NOT preset-domain)", () => {
    // text-center isn't a strip class → not part of extracted preset.
    const got = extractPresetClasses(["text-center", "bg-slate-500"]);
    expect(got).toBe("bg-slate-500");
  });

  it("space-joins kept tokens", () => {
    const got = extractPresetClasses(["bg-slate-500", "p-4", "rounded-md"]);
    expect(got).toBe("bg-slate-500 p-4 rounded-md");
  });
});

describe("lib/style-presets — getCustomPresetsForTag", () => {
  const fixtures: CustomPreset[] = [
    {
      id: "1",
      name: "Custom Button",
      classes: "bg-rose-500 text-white",
      matchTags: ["button", "a"],
      shape: "button",
      createdAt: 1,
    },
    {
      id: "2",
      name: "Custom Card",
      classes: "bg-white p-8",
      matchTags: ["div", "section"],
      shape: "card",
      createdAt: 2,
    },
  ];

  it("returns presets whose matchTags include the requested tag", () => {
    expect(getCustomPresetsForTag("button", fixtures).map((c) => c.id)).toEqual([
      "1",
    ]);
    expect(getCustomPresetsForTag("div", fixtures).map((c) => c.id)).toEqual([
      "2",
    ]);
  });

  it("normalizes input tag to lowercase before filter", () => {
    expect(
      getCustomPresetsForTag("BUTTON", fixtures).map((c) => c.id),
    ).toEqual(["1"]);
  });

  it("returns [] for a tag matching no preset", () => {
    expect(getCustomPresetsForTag("p", fixtures)).toEqual([]);
  });

  it("returns [] for an empty preset list", () => {
    expect(getCustomPresetsForTag("button", [])).toEqual([]);
  });
});

describe("lib/style-presets — customToStylePreset", () => {
  it("prefixes id with 'custom:'", () => {
    const c: CustomPreset = {
      id: "abc",
      name: "My Preset",
      classes: "bg-rose-500",
      matchTags: ["button"],
      shape: "button",
      createdAt: 1,
    };
    const sp = customToStylePreset(c);
    expect(sp.id).toBe("custom:abc");
    expect(sp.name).toBe("My Preset");
    expect(sp.classes).toBe("bg-rose-500");
    expect(sp.preview.shape).toBe("button");
  });

  it("builds a preview using the saved shape", () => {
    const c: CustomPreset = {
      id: "x",
      name: "n",
      classes: "bg-white",
      matchTags: ["div"],
      shape: "card",
      createdAt: 1,
    };
    expect(customToStylePreset(c).preview.shape).toBe("card");
  });
});

describe("lib/style-presets — loadCustomPresets / saveCustomPresets (SSR-safe)", () => {
  it("loadCustomPresets returns [] in node (no window)", () => {
    // vitest env is node — typeof window === "undefined" → guard returns [].
    expect(loadCustomPresets()).toEqual([]);
  });

  it("saveCustomPresets is a no-op in node (no window)", () => {
    // Should not throw, should not persist anything observable.
    expect(() => saveCustomPresets([])).not.toThrow();
    expect(() =>
      saveCustomPresets([
        {
          id: "x",
          name: "n",
          classes: "c",
          matchTags: ["div"],
          shape: "card",
          createdAt: 1,
        },
      ]),
    ).not.toThrow();
  });
});
