import { describe, it, expect } from "vitest";
import { applyPaletteToConfigColors } from "../lib/ast/operations/palette-config";
import { PALETTES } from "../lib/palettes";

// Prod-import tests for applyPaletteToConfigColors. Material 3
// templates use design tokens like "primary-container", "surface-
// container-low", "on-surface-variant" in the embedded
// tailwind.config.theme.extend.colors block. The class-token-only
// palette swap missed these entirely — this module is the fix.

function findPalette(id: string) {
  const p = PALETTES.find((p) => p.id === id);
  if (!p) throw new Error(`Palette '${id}' not found`);
  return p;
}

describe("applyPaletteToConfigColors — Material 3 design tokens", () => {
  it("rewrites primary + primary-container", () => {
    const src = `
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              "primary": "#6750a4",
              "primary-container": "#eaddff",
              "on-primary": "#ffffff",
            }
          }
        }
      };
    `;
    const r = applyPaletteToConfigColors(src, findPalette("forest"));
    expect(r.unchanged).toBe(false);
    expect(r.tokensRewritten).toBeGreaterThanOrEqual(2);
    // Forest palette: primary = emerald. Config stores HEX values
    // (not family names), so check for the destination hexes.
    // primary → emerald-500 (#10b981)
    expect(r.source).toContain("#10b981");
    // primary-container → emerald-200 (#a7f3d0)
    expect(r.source).toContain("#a7f3d0");
  });

  it("rewrites surface family to neutral palette family", () => {
    const src = `colors: {
      "surface": "#fef7ff",
      "surface-container": "#f3edf7",
      "surface-container-low": "#f6f3f2",
      "on-surface": "#1d1b20",
    }`;
    const r = applyPaletteToConfigColors(src, findPalette("forest"));
    expect(r.unchanged).toBe(false);
    expect(r.tokensRewritten).toBeGreaterThanOrEqual(4);
    // forest neutral = stone family. surface → stone-100 etc.
    expect(r.source).toContain("#f5f5f4"); // stone-100 (surface)
  });

  it("rewrites secondary + tertiary as accent", () => {
    const src = `colors: {
      "secondary": "#625b71",
      "tertiary": "#7d5260",
    }`;
    const r = applyPaletteToConfigColors(src, findPalette("forest"));
    expect(r.unchanged).toBe(false);
    expect(r.tokensRewritten).toBe(2);
    // forest accent = lime. Both should map to lime-500.
    expect(r.source).toContain("#84cc16"); // lime-500
  });

  it("leaves error/warning/success/info tokens alone (semantic)", () => {
    const src = `colors: {
      "error": "#b3261e",
      "warning": "#f59e0b",
      "success": "#10b981",
      "info": "#3b82f6",
    }`;
    const r = applyPaletteToConfigColors(src, findPalette("forest"));
    expect(r.source).toContain("#b3261e");
    expect(r.source).toContain("#f59e0b");
    expect(r.source).toContain("#10b981");
    expect(r.source).toContain("#3b82f6");
  });

  it("handles bare keys (no quotes) and single-quoted values", () => {
    const src = `colors: {
      primary: '#6750a4',
      surface: '#fef7ff',
    }`;
    const r = applyPaletteToConfigColors(src, findPalette("forest"));
    expect(r.unchanged).toBe(false);
    expect(r.tokensRewritten).toBe(2);
  });

  it("returns unchanged when no recognizable tokens", () => {
    const src = `colors: {
      "brand-blue": "#0044ff",
      "custom-thing": "#abcdef",
    }`;
    const r = applyPaletteToConfigColors(src, findPalette("forest"));
    expect(r.unchanged).toBe(true);
    expect(r.tokensRewritten).toBe(0);
  });

  it("returns unchanged when no colors block exists", () => {
    const src = `function X() { return <div className="bg-red-500">Hi</div>; }`;
    const r = applyPaletteToConfigColors(src, findPalette("forest"));
    expect(r.unchanged).toBe(true);
  });

  it("on-* tokens map to readable contrast", () => {
    const src = `colors: {
      "on-primary-container": "#21005d",
      "on-surface-variant": "#49454f",
    }`;
    const r = applyPaletteToConfigColors(src, findPalette("forest"));
    expect(r.unchanged).toBe(false);
    // on-primary-container → primary-900 (dark text on light primary container)
    expect(r.source).toContain("#064e3b"); // emerald-900
    // on-surface-variant → neutral-900
    expect(r.source).toContain("#1c1917"); // stone-900
  });
});
