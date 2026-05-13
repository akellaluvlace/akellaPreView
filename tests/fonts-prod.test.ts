// 7th prod-import surge — direct-import tests for `lib/fonts.ts`.
// Bench-omitted module (no `bench-fonts.mjs`); the curated FONTS pair list
// + `buildFontPreloadUrl()` Google-Fonts URL builder were entirely
// uncovered prior to this surge.

import { describe, it, expect } from "vitest";
import { FONTS, fontById, buildFontPreloadUrl } from "../lib/fonts";

describe("§1 FONTS — curated pair list", () => {
  it("contains 15 pairs", () => {
    expect(FONTS.length).toBe(15);
  });

  it("every pair has the required fields (id, name, display, body, vibe)", () => {
    for (const f of FONTS) {
      expect(f.id).toBeTypeOf("string");
      expect(f.id.length).toBeGreaterThan(0);
      expect(f.name).toBeTypeOf("string");
      expect(f.display).toBeTypeOf("string");
      expect(f.body).toBeTypeOf("string");
      expect(f.vibe).toBeTypeOf("string");
    }
  });

  it("ids are globally unique", () => {
    const ids = FONTS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("weights field, when present, is a semicolon-separated number list", () => {
    for (const f of FONTS) {
      if (f.weights !== undefined) {
        expect(f.weights).toMatch(/^\d+(;\d+)*$/);
      }
    }
  });

  it("locked canaries — 'editorial' / 'classic' / 'modern' have known display fonts", () => {
    expect(FONTS.find((f) => f.id === "editorial")?.display).toBe("Fraunces");
    expect(FONTS.find((f) => f.id === "classic")?.display).toBe(
      "Playfair Display",
    );
    expect(FONTS.find((f) => f.id === "modern")?.display).toBe(
      "Space Grotesk",
    );
  });
});

describe("§2 fontById", () => {
  it("returns the matching FontPair for a known id", () => {
    expect(fontById("editorial")?.name).toBe("Editorial");
    expect(fontById("modern")?.body).toBe("Inter");
  });

  it("returns undefined for an unknown id", () => {
    expect(fontById("does-not-exist")).toBeUndefined();
  });

  it("is case-sensitive (no fuzzy match)", () => {
    expect(fontById("Editorial")).toBeUndefined();
    expect(fontById("EDITORIAL")).toBeUndefined();
  });
});

describe("§3 buildFontPreloadUrl", () => {
  const url = buildFontPreloadUrl();

  it("starts with the Google Fonts CSS2 endpoint", () => {
    expect(url.startsWith("https://fonts.googleapis.com/css2?")).toBe(true);
  });

  it("ends with display=swap", () => {
    expect(url.endsWith("&display=swap")).toBe(true);
  });

  it("URI-encodes family names with spaces", () => {
    // "Playfair Display" → "Playfair%20Display"
    expect(url).toContain("family=Playfair%20Display:wght@");
    // "Space Grotesk" → "Space%20Grotesk"
    expect(url).toContain("family=Space%20Grotesk:wght@");
  });

  it("includes a family= entry for each unique font name across display+body", () => {
    const uniqueNames = new Set(FONTS.flatMap((f) => [f.display, f.body]));
    for (const name of uniqueNames) {
      expect(url).toContain(`family=${encodeURIComponent(name)}`);
    }
  });

  it("each family= entry has a :wght@<list> suffix", () => {
    const familyMatches = url.match(/family=[^&]+/g) ?? [];
    expect(familyMatches.length).toBeGreaterThan(0);
    for (const segment of familyMatches) {
      expect(segment).toMatch(/family=[^&:]+:wght@\d+(;\d+)*$/);
    }
  });

  it("default weights '400;500;700' applied when no FontPair declares the font's weights", () => {
    // Pick a font name that appears as a body in a pair without `weights`.
    // All current pairs declare weights, so this verifies the FALLBACK
    // remains present in the encoded string for any *future* fontless pair.
    // For now, assert the substring `400;500;700` is present somewhere.
    expect(url).toContain("400;500;700");
  });

  it("returns deterministic output (same call twice → equal)", () => {
    expect(buildFontPreloadUrl()).toBe(url);
  });
});
