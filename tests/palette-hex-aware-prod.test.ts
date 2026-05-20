import { describe, it, expect } from "vitest";
import { applyPalette } from "../lib/ast/operations/palette";
import { PALETTES, FAMILY_HEX_SHADES } from "../lib/palettes";
import { injectOids } from "../lib/ast/oids";

// 2026-05-20 — Prod-import tests for the hex-aware palette extension.
// Previously the palette swap engine skipped arbitrary-value tokens
// like `bg-[#6366f1]` (indigo-500). AI-generated templates use these
// constantly — the model emits one-off hex values for accent colors
// instead of `bg-indigo-500`. Without this support the palette swap
// felt broken on most templates. New parser maps the hex back to a
// (family, shade) pair, applies the family mapping, rebuilds the hex
// at the destination family's same shade.

function findPalette(id: string) {
  const p = PALETTES.find((p) => p.id === id);
  if (!p) throw new Error(`Palette '${id}' not found in PALETTES registry`);
  return p;
}

function srcWith(jsx: string): string {
  const raw = `export default function X() { return ${jsx}; }`;
  return injectOids(raw).source;
}

describe("palette hex-aware: forward + reverse lookups", () => {
  it("FAMILY_HEX_SHADES has indigo-500 = #6366f1", () => {
    const lookup = FAMILY_HEX_SHADES.get("#6366f1");
    expect(lookup).toBeDefined();
    expect(lookup?.family).toBe("indigo");
    expect(lookup?.shade).toBe("500");
  });

  it("FAMILY_HEX_SHADES has emerald-500 = #10b981", () => {
    const lookup = FAMILY_HEX_SHADES.get("#10b981");
    expect(lookup?.family).toBe("emerald");
    expect(lookup?.shade).toBe("500");
  });

  it("FAMILY_HEX_SHADES covers nearly all 11 shades for each family", () => {
    // 22 families * 11 shades = 242 entries, minus 1 cross-family
    // shade collision in the Tailwind palette (reverse map collapses
    // them — the first family seen wins, which is fine for our use:
    // any hex resolves to SOME (family, shade), and the destination
    // hex lookup uses the actual destination family verbatim).
    expect(FAMILY_HEX_SHADES.size).toBeGreaterThanOrEqual(240);
    expect(FAMILY_HEX_SHADES.size).toBeLessThanOrEqual(242);
  });

  it("uppercase hex normalizes via lowercase lookup", () => {
    expect(FAMILY_HEX_SHADES.get("#6366F1")).toBeUndefined();
    expect(FAMILY_HEX_SHADES.get("#6366f1")).toBeDefined();
  });
});

describe("applyPalette: arbitrary-hex tokens", () => {
  it("rewrites bg-[#6366f1] (indigo-500) → bg-[#10b981] when forest palette applied", () => {
    const code = srcWith(
      `<div className="bg-[#6366f1] text-white p-4">Hi</div>`,
    );
    const r = applyPalette(code, { palette: findPalette("forest"), scope: "all" });
    expect(r.unchanged).toBe(false);
    // Forest palette: primary=emerald → indigo-500 (#6366f1) → emerald-500 (#10b981)
    expect(r.source).toContain("bg-[#10b981]");
    expect(r.source).not.toContain("bg-[#6366f1]");
  });

  it("rewrites multiple hex tokens at different shades together", () => {
    // indigo-500 + indigo-100 in same className. Both should map to
    // emerald-500 + emerald-100 (same shade preservation).
    const code = srcWith(
      `<div className="bg-[#6366f1] border border-[#e0e7ff]">Hi</div>`,
    );
    const r = applyPalette(code, { palette: findPalette("forest"), scope: "all" });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("bg-[#10b981]"); // emerald-500
    expect(r.source).toContain("border-[#d1fae5]"); // emerald-100
  });

  it("handles variants on hex tokens (hover:bg-[#hex])", () => {
    const code = srcWith(
      `<div className="bg-[#6366f1] hover:bg-[#4f46e5]">Hi</div>`,
    );
    const r = applyPalette(code, { palette: findPalette("forest"), scope: "all" });
    expect(r.unchanged).toBe(false);
    // indigo-500 → emerald-500 (#10b981)
    expect(r.source).toContain("bg-[#10b981]");
    // indigo-600 → emerald-600 (#059669)
    expect(r.source).toContain("hover:bg-[#059669]");
  });

  it("handles alpha-suffixed hex tokens (bg-[#hex]/50)", () => {
    const code = srcWith(
      `<div className="bg-[#6366f1]/50 text-white">Hi</div>`,
    );
    const r = applyPalette(code, { palette: findPalette("forest"), scope: "all" });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("bg-[#10b981]/50");
  });

  it("mixes named + arbitrary hex in the same className", () => {
    const code = srcWith(
      `<div className="bg-indigo-500 text-[#6366f1] border-indigo-200">Hi</div>`,
    );
    const r = applyPalette(code, { palette: findPalette("forest"), scope: "all" });
    expect(r.unchanged).toBe(false);
    // Both forms should remap consistently to emerald.
    expect(r.source).toContain("bg-emerald-500");
    expect(r.source).toContain("text-[#10b981]");
    expect(r.source).toContain("border-emerald-200");
  });
});

describe("applyPalette: leaves untouchable hex tokens alone", () => {
  it("ignores arbitrary hex that doesn't match any Tailwind family", () => {
    // #abc123 isn't in the Tailwind palette.
    const code = srcWith(
      `<div className="bg-[#abc123] text-white">Hi</div>`,
    );
    const r = applyPalette(code, { palette: findPalette("forest"), scope: "all" });
    // The bg-[#abc123] should stay unchanged — no family detected → no remap.
    expect(r.source).toContain("bg-[#abc123]");
  });

  it("ignores non-hex arbitrary values (rgb, url, length)", () => {
    const code = srcWith(
      `<div className="bg-[rgb(50,60,70)] text-[14px] bg-[url('x.jpg')]">Hi</div>`,
    );
    const r = applyPalette(code, { palette: findPalette("forest"), scope: "all" });
    // None of these should be affected.
    expect(r.source).toContain("bg-[rgb(50,60,70)]");
    expect(r.source).toContain("text-[14px]");
    expect(r.source).toContain("bg-[url('x.jpg')]");
  });

  it("does not touch 3-digit shorthand hex (#abc)", () => {
    const code = srcWith(
      `<div className="bg-[#abc] text-white">Hi</div>`,
    );
    const r = applyPalette(code, { palette: findPalette("forest"), scope: "all" });
    expect(r.source).toContain("bg-[#abc]");
  });
});
