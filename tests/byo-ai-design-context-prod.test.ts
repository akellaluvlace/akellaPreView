import { describe, it, expect } from "vitest";
import { extractDesignContext } from "../lib/byo-ai/design-context";

describe("extractDesignContext — color tokens (tailwind config)", () => {
  it("extracts named tokens from an embedded tailwind config", () => {
    const src = `
      <script>
        tailwind.config = {
          theme: { extend: { colors: {
            "primary": "#10b981",
            "surface": "#fef7ff",
            "on-surface": "#1d1b20",
          } } }
        };
      </script>`;
    const ctx = extractDesignContext(src);
    expect(ctx).toContain("Color tokens");
    expect(ctx).toContain("primary=#10b981");
    expect(ctx).toContain("surface=#fef7ff");
  });

  it("handles quoted colors-block key", () => {
    const src = `"colors": { "brand": "#0044ff", "ink": "#111111" }`;
    const ctx = extractDesignContext(src);
    expect(ctx).toContain("brand=#0044ff");
  });

  it("caps token count (doesn't dump 50 tokens into the prompt)", () => {
    const entries = Array.from(
      { length: 30 },
      (_, i) => `"c${i}": "#${(i * 111111).toString(16).padStart(6, "0").slice(0, 6)}"`,
    ).join(",");
    const src = `colors: { ${entries} }`;
    const ctx = extractDesignContext(src) ?? "";
    const tokenCount = (ctx.match(/c\d+=#/g) ?? []).length;
    expect(tokenCount).toBeLessThanOrEqual(12);
  });
});

describe("extractDesignContext — color families (fallback, no config)", () => {
  it("tallies the most-used Tailwind families when there's no config block", () => {
    const src = `
      <div class="bg-emerald-500 text-stone-800">
        <button class="bg-emerald-600 hover:bg-emerald-700 text-white">Go</button>
        <p class="text-stone-600">Hi</p>
        <span class="border-lime-400">x</span>
      </div>`;
    const ctx = extractDesignContext(src);
    expect(ctx).toContain("Color families in use");
    expect(ctx).toContain("emerald");
    expect(ctx).toContain("stone");
  });

  it("prefers config tokens over family tally when both exist", () => {
    const src = `
      colors: { "primary": "#10b981" }
      <div class="bg-emerald-500 text-stone-800"></div>`;
    const ctx = extractDesignContext(src);
    // Config tokens win — we report tokens, not the family tally.
    expect(ctx).toContain("Color tokens");
    expect(ctx).toContain("primary=#10b981");
    expect(ctx).not.toContain("Color families in use");
  });
});

describe("extractDesignContext — fonts", () => {
  it("extracts font-['Name'] arbitrary classes", () => {
    const src = `<h1 class="font-['Playfair_Display'] text-4xl">Title</h1>`;
    const ctx = extractDesignContext(src);
    expect(ctx).toContain("Fonts:");
    expect(ctx).toContain("Playfair Display");
  });

  it("extracts Google Fonts from a <link> href", () => {
    const src = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora&display=swap" rel="stylesheet">`;
    const ctx = extractDesignContext(src);
    expect(ctx).toContain("Inter");
    expect(ctx).toContain("Lora");
  });

  it("extracts font-family from CSS, skipping generic keywords", () => {
    const src = `<style>body { font-family: 'Manrope', sans-serif; }</style>`;
    const ctx = extractDesignContext(src);
    expect(ctx).toContain("Manrope");
    expect(ctx).not.toContain("sans-serif");
  });
});

describe("extractDesignContext — empty / no signal", () => {
  it("returns null when there's nothing useful", () => {
    const src = `<div><p>just some text with no colors or fonts</p></div>`;
    expect(extractDesignContext(src)).toBeNull();
  });

  it("returns null for empty input", () => {
    expect(extractDesignContext("")).toBeNull();
  });
});
