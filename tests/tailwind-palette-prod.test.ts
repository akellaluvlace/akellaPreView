import { describe, it, expect } from "vitest";
import {
  TAILWIND_FAMILIES,
  TAILWIND_SHADES,
  TAILWIND_NEUTRAL_FAMILIES,
  TAILWIND_PALETTE,
  parsePaletteClass,
  findPaletteClass,
  closestPaletteName,
  nearbyPaletteName,
} from "../lib/tailwind-palette";

// Prod-import test for lib/tailwind-palette.ts. Hex map pinned to
// Tailwind 3.4.x (locked stack) — Tailwind 4 retunes 50/100 + 900/950
// shades, so this map is intentionally not auto-derived. No bench
// inlines this — prod-import is the only signal.

describe("lib/tailwind-palette — TAILWIND_FAMILIES", () => {
  it("contains exactly 22 families", () => {
    expect(TAILWIND_FAMILIES.length).toBe(22);
  });

  it("includes the 5 neutrals at the start (slate gray zinc neutral stone)", () => {
    expect(TAILWIND_FAMILIES.slice(0, 5)).toEqual([
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
    ]);
  });

  it("includes warm and cool accents (red blue green pink)", () => {
    expect(TAILWIND_FAMILIES).toContain("red");
    expect(TAILWIND_FAMILIES).toContain("blue");
    expect(TAILWIND_FAMILIES).toContain("green");
    expect(TAILWIND_FAMILIES).toContain("pink");
  });
});

describe("lib/tailwind-palette — TAILWIND_SHADES", () => {
  it("contains exactly 11 shade levels (50 through 950)", () => {
    expect(TAILWIND_SHADES.length).toBe(11);
    expect(TAILWIND_SHADES).toEqual([
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ]);
  });
});

describe("lib/tailwind-palette — TAILWIND_NEUTRAL_FAMILIES", () => {
  it("is a strict subset of TAILWIND_FAMILIES (5 of 22)", () => {
    expect(TAILWIND_NEUTRAL_FAMILIES.length).toBe(5);
    for (const fam of TAILWIND_NEUTRAL_FAMILIES) {
      expect(TAILWIND_FAMILIES).toContain(fam);
    }
  });

  it("matches the documented neutrals (slate/gray/zinc/neutral/stone)", () => {
    expect([...TAILWIND_NEUTRAL_FAMILIES]).toEqual([
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
    ]);
  });
});

describe("lib/tailwind-palette — TAILWIND_PALETTE map", () => {
  it("contains 22 × 11 + 2 = 244 entries (palettes + black + white)", () => {
    expect(Object.keys(TAILWIND_PALETTE).length).toBe(22 * 11 + 2);
  });

  it("locks specific Tailwind 3.4 hex values (canary samples)", () => {
    expect(TAILWIND_PALETTE["slate-500"]).toBe("#64748B");
    expect(TAILWIND_PALETTE["red-500"]).toBe("#EF4444");
    expect(TAILWIND_PALETTE["blue-500"]).toBe("#3B82F6");
    expect(TAILWIND_PALETTE["emerald-500"]).toBe("#10B981");
    expect(TAILWIND_PALETTE["pink-500"]).toBe("#EC4899");
  });

  it("includes black and white as base colors", () => {
    expect(TAILWIND_PALETTE["black"]).toBe("#000000");
    expect(TAILWIND_PALETTE["white"]).toBe("#FFFFFF");
  });

  it("uses uppercase hex strings consistently (round-trip with picker)", () => {
    for (const v of Object.values(TAILWIND_PALETTE)) {
      // # + 6 uppercase hex chars — every entry MUST match this.
      expect(v).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it("has every (family, shade) combo present", () => {
    for (const fam of TAILWIND_FAMILIES) {
      for (const sh of TAILWIND_SHADES) {
        expect(TAILWIND_PALETTE[`${fam}-${sh}`]).toBeDefined();
      }
    }
  });

  it("ships sky-500 as #0EA5E9 (high-frequency hex)", () => {
    expect(TAILWIND_PALETTE["sky-500"]).toBe("#0EA5E9");
  });
});

describe("lib/tailwind-palette — parsePaletteClass (palette colors)", () => {
  it("parses a basic palette class (bg-slate-500)", () => {
    expect(parsePaletteClass("bg-slate-500")).toEqual({
      prefix: "bg",
      body: "slate-500",
      hex: "#64748B",
      alpha: null,
      isPaletteHex: true,
    });
  });

  it("parses with text/border/ring prefixes", () => {
    expect(parsePaletteClass("text-red-700")?.body).toBe("red-700");
    expect(parsePaletteClass("border-blue-300")?.body).toBe("blue-300");
    expect(parsePaletteClass("ring-emerald-500")?.body).toBe("emerald-500");
  });

  it("supports gradient prefixes (from/via/to)", () => {
    expect(parsePaletteClass("from-pink-500")?.body).toBe("pink-500");
    expect(parsePaletteClass("via-purple-500")?.body).toBe("purple-500");
    expect(parsePaletteClass("to-violet-500")?.body).toBe("violet-500");
  });

  it("supports stroke/fill/outline/caret/accent/decoration/divide/placeholder/shadow prefixes", () => {
    const prefixes = [
      "fill",
      "stroke",
      "outline",
      "caret",
      "accent",
      "decoration",
      "divide",
      "placeholder",
      "shadow",
    ];
    for (const p of prefixes) {
      const got = parsePaletteClass(`${p}-slate-500`);
      expect(got).not.toBeNull();
      expect(got!.prefix).toBe(p);
      expect(got!.body).toBe("slate-500");
    }
  });

  it("captures opacity slash suffix as alpha number", () => {
    expect(parsePaletteClass("bg-slate-500/30")).toEqual({
      prefix: "bg",
      body: "slate-500",
      hex: "#64748B",
      alpha: 30,
      isPaletteHex: true,
    });
    expect(parsePaletteClass("bg-slate-500/50")?.alpha).toBe(50);
    expect(parsePaletteClass("bg-slate-500/100")?.alpha).toBe(100);
  });

  it("returns alpha=null when no slash suffix is present", () => {
    expect(parsePaletteClass("bg-slate-500")?.alpha).toBeNull();
  });

  it("parses bg-black and bg-white (base colors)", () => {
    expect(parsePaletteClass("bg-black")).toEqual({
      prefix: "bg",
      body: "black",
      hex: "#000000",
      alpha: null,
      isPaletteHex: true,
    });
    expect(parsePaletteClass("bg-white")?.hex).toBe("#FFFFFF");
  });
});

describe("lib/tailwind-palette — parsePaletteClass (transparent/current/inherit)", () => {
  it("returns isPaletteHex=false for bg-transparent", () => {
    const m = parsePaletteClass("bg-transparent");
    expect(m).not.toBeNull();
    expect(m!.body).toBe("transparent");
    expect(m!.isPaletteHex).toBe(false);
    // Hex is the documented fallback (not a real palette swatch).
    expect(m!.hex).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("returns isPaletteHex=false for bg-current", () => {
    expect(parsePaletteClass("bg-current")?.isPaletteHex).toBe(false);
  });

  it("returns isPaletteHex=false for bg-inherit", () => {
    expect(parsePaletteClass("bg-inherit")?.isPaletteHex).toBe(false);
  });

  it("still captures alpha on bg-current/30", () => {
    const m = parsePaletteClass("bg-current/30");
    expect(m).not.toBeNull();
    expect(m!.alpha).toBe(30);
    expect(m!.isPaletteHex).toBe(false);
  });
});

describe("lib/tailwind-palette — parsePaletteClass (rejects unsupported)", () => {
  it("returns null for arbitrary-hex classes (bg-[#abc])", () => {
    expect(parsePaletteClass("bg-[#abc]")).toBeNull();
    expect(parsePaletteClass("bg-[#ff0000]")).toBeNull();
  });

  it("returns null for unknown prefixes (m-slate-500, p-red-500)", () => {
    expect(parsePaletteClass("m-slate-500")).toBeNull();
    expect(parsePaletteClass("p-red-500")).toBeNull();
  });

  it("returns null for unknown families (bg-foo-500)", () => {
    expect(parsePaletteClass("bg-foo-500")).toBeNull();
  });

  it("returns null for invalid shades (slate-1000, slate-1)", () => {
    expect(parsePaletteClass("bg-slate-1000")).toBeNull();
    expect(parsePaletteClass("bg-slate-1")).toBeNull();
  });

  it("returns null for shape-only-prefix matches (bg-, bg, bg-slate)", () => {
    expect(parsePaletteClass("bg-")).toBeNull();
    expect(parsePaletteClass("bg")).toBeNull();
    expect(parsePaletteClass("bg-slate")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parsePaletteClass("")).toBeNull();
  });
});

describe("lib/tailwind-palette — findPaletteClass", () => {
  it("returns the first class matching the prefix", () => {
    const got = findPaletteClass(
      ["text-red-500", "bg-slate-500", "border-blue-300"],
      "bg",
    );
    expect(got).not.toBeNull();
    expect(got!.body).toBe("slate-500");
  });

  it("returns null when no class matches the prefix", () => {
    const got = findPaletteClass(["text-red-500", "border-blue-300"], "bg");
    expect(got).toBeNull();
  });

  it("returns null for an empty class list", () => {
    expect(findPaletteClass([], "bg")).toBeNull();
  });

  it("skips unparseable classes silently", () => {
    const got = findPaletteClass(
      ["px-4", "rounded-lg", "bg-slate-500"],
      "bg",
    );
    expect(got!.body).toBe("slate-500");
  });

  it("returns the first match in array order, not the most specific", () => {
    const got = findPaletteClass(
      ["bg-slate-500", "bg-red-500"],
      "bg",
    );
    expect(got!.body).toBe("slate-500");
  });

  it("captures alpha when the class uses a slash", () => {
    const got = findPaletteClass(["bg-slate-500/40"], "bg");
    expect(got!.alpha).toBe(40);
  });
});

describe("lib/tailwind-palette — closestPaletteName", () => {
  it("returns distance 0 for an exact palette hex match", () => {
    const got = closestPaletteName("#64748B"); // slate-500
    expect(got).not.toBeNull();
    expect(got!.name).toBe("slate-500");
    expect(got!.distance).toBe(0);
  });

  it("matches black/white at the extremes", () => {
    expect(closestPaletteName("#000000")?.name).toBe("black");
    expect(closestPaletteName("#000000")?.distance).toBe(0);
    expect(closestPaletteName("#FFFFFF")?.name).toBe("white");
    expect(closestPaletteName("#FFFFFF")?.distance).toBe(0);
  });

  it("supports lowercase hex input", () => {
    const got = closestPaletteName("#64748b"); // slate-500 lowercase
    expect(got!.name).toBe("slate-500");
    expect(got!.distance).toBe(0);
  });

  it("supports 3-digit hex input", () => {
    // #FFF expands to #FFFFFF
    expect(closestPaletteName("#FFF")?.name).toBe("white");
    expect(closestPaletteName("#000")?.name).toBe("black");
  });

  it("supports 8-digit hex (alpha ignored for distance calc)", () => {
    // First 6 chars used; alpha ignored.
    expect(closestPaletteName("#000000FF")?.name).toBe("black");
  });

  it("returns null on invalid hex", () => {
    expect(closestPaletteName("not-a-hex")).toBeNull();
    expect(closestPaletteName("#xyz123")).toBeNull();
    expect(closestPaletteName("")).toBeNull();
  });

  it("returns the nearest palette for an off-palette hex with non-zero distance", () => {
    const got = closestPaletteName("#65749C"); // close to slate-500 (#64748B)
    expect(got).not.toBeNull();
    expect(got!.name).toBe("slate-500");
    expect(got!.distance).toBeGreaterThan(0);
    expect(got!.distance).toBeLessThan(300);
  });

  it("uses squared-RGB distance (so close colors have small numbers)", () => {
    // #64748C is exactly 1 byte from slate-500 (#64748B): 1^2 = 1.
    const got = closestPaletteName("#64748C");
    expect(got!.distance).toBe(1);
  });
});

describe("lib/tailwind-palette — nearbyPaletteName", () => {
  it("returns the name when distance ≤ default threshold (300)", () => {
    expect(nearbyPaletteName("#64748B")).toBe("slate-500");
    expect(nearbyPaletteName("#65748C")).toBe("slate-500"); // ≤ threshold
  });

  it("returns null when distance exceeds threshold", () => {
    // A wildly distant hex: pure magenta on slate scale is far.
    expect(nearbyPaletteName("#FF00FF")).not.toBe("slate-500");
    // We don't lock the exact returned value — just that it wouldn't
    // be slate. The behaviour we DO lock: when a hex is genuinely
    // off-palette beyond threshold, return null.
    const farFromAnyPalette = "#7B5B3F"; // earthen tone, off-palette
    const got = nearbyPaletteName(farFromAnyPalette, 50);
    // With a tight threshold this may return null. Confirm the null
    // path works at least once.
    if (closestPaletteName(farFromAnyPalette)!.distance > 50) {
      expect(got).toBeNull();
    }
  });

  it("respects a custom threshold", () => {
    // High threshold (10000) → almost any hex maps to something.
    expect(nearbyPaletteName("#7B5B3F", 10000)).not.toBeNull();
    // Zero threshold → only exact matches return non-null.
    expect(nearbyPaletteName("#64748B", 0)).toBe("slate-500");
    expect(nearbyPaletteName("#64748C", 0)).toBeNull();
  });

  it("returns null on invalid hex", () => {
    expect(nearbyPaletteName("not-a-hex")).toBeNull();
    expect(nearbyPaletteName("")).toBeNull();
  });
});
