// 7th prod-import surge — direct-import tests for `lib/palettes.ts`.
// Bench-omitted; the existing `reorder-reparent-palette-prod.test.ts`
// covers `PALETTES.length=12` + `getPaletteById` happy/null only. This
// file covers the broader surface: `ALL_FAMILIES` registry order +
// uniqueness, `NEUTRAL_FAMILIES` strict-subset membership, the internal
// `FAMILY_500` Tailwind-3.4 hex map (verified through each palette's
// `swatch.primary/.neutral/.accent`), per-palette vibe + id validity,
// and the PAPER/INK paper-ink invariant on `swatch.bg/.fg`.

import { describe, it, expect } from "vitest";
import {
  ALL_FAMILIES,
  NEUTRAL_FAMILIES,
  PALETTES,
  getPaletteById,
} from "../lib/palettes";

const PAPER = "#F5F1EA";
const INK = "#18141C";

// Tailwind 3.4 family-500 hex codes — must match `lib/palettes.ts` internal
// `FAMILY_500` map. If a swatch hex drifts from this, swatch render no
// longer matches Tailwind's actual class output.
const TAILWIND_3_4_FAMILY_500: Record<string, string> = {
  slate: "#64748b",
  gray: "#6b7280",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
};

describe("§1 ALL_FAMILIES registry", () => {
  it("contains all 22 Tailwind families", () => {
    expect(ALL_FAMILIES.length).toBe(22);
  });

  it("entries are unique (no duplicates)", () => {
    expect(new Set(ALL_FAMILIES).size).toBe(ALL_FAMILIES.length);
  });

  it("first 5 entries are the neutrals (slate, gray, zinc, neutral, stone)", () => {
    expect(ALL_FAMILIES.slice(0, 5)).toEqual([
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
    ]);
  });

  it("starts with red after the neutrals (ROYGBIV-ish ordering)", () => {
    expect(ALL_FAMILIES[5]).toBe("red");
  });

  it("ends with rose (last family in the wheel)", () => {
    expect(ALL_FAMILIES[ALL_FAMILIES.length - 1]).toBe("rose");
  });

  it("every family is a valid Tailwind 3.4 family name (cross-checked vs canon)", () => {
    for (const fam of ALL_FAMILIES) {
      expect(TAILWIND_3_4_FAMILY_500[fam]).toBeDefined();
    }
  });
});

describe("§2 NEUTRAL_FAMILIES — strict 5-member subset", () => {
  it("contains exactly 5 entries", () => {
    expect(NEUTRAL_FAMILIES.size).toBe(5);
  });

  it("contains slate, gray, zinc, neutral, stone (no others)", () => {
    expect(NEUTRAL_FAMILIES.has("slate")).toBe(true);
    expect(NEUTRAL_FAMILIES.has("gray")).toBe(true);
    expect(NEUTRAL_FAMILIES.has("zinc")).toBe(true);
    expect(NEUTRAL_FAMILIES.has("neutral")).toBe(true);
    expect(NEUTRAL_FAMILIES.has("stone")).toBe(true);
  });

  it("does NOT contain a non-neutral family", () => {
    // Cast through `any` — Set.has's type signature wants Family, but
    // we want to verify a runtime miss for non-neutral input.
    expect((NEUTRAL_FAMILIES as ReadonlySet<string>).has("red")).toBe(false);
    expect((NEUTRAL_FAMILIES as ReadonlySet<string>).has("blue")).toBe(false);
    expect((NEUTRAL_FAMILIES as ReadonlySet<string>).has("emerald")).toBe(
      false,
    );
  });

  it("every member is also in ALL_FAMILIES (strict subset)", () => {
    for (const fam of NEUTRAL_FAMILIES) {
      expect(ALL_FAMILIES.includes(fam)).toBe(true);
    }
  });
});

describe("§3 PALETTES — registry shape + invariants", () => {
  it("ids are globally unique across all 12 palettes", () => {
    const ids = PALETTES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every palette id is kebab-case (lowercase letters + dashes only)", () => {
    for (const p of PALETTES) {
      expect(p.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });

  it("every palette has a non-empty vibe and name", () => {
    for (const p of PALETTES) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.vibe.length).toBeGreaterThan(0);
    }
  });

  it("every palette's families.{primary,neutral,accent} are valid Tailwind families", () => {
    for (const p of PALETTES) {
      expect(ALL_FAMILIES.includes(p.families.primary)).toBe(true);
      expect(ALL_FAMILIES.includes(p.families.neutral)).toBe(true);
      expect(ALL_FAMILIES.includes(p.families.accent)).toBe(true);
    }
  });

  it("every palette's families.neutral is a member of NEUTRAL_FAMILIES", () => {
    for (const p of PALETTES) {
      expect(NEUTRAL_FAMILIES.has(p.families.neutral)).toBe(true);
    }
  });

  it("every palette's swatch.bg = PAPER (#F5F1EA — house surface token)", () => {
    for (const p of PALETTES) {
      expect(p.swatch.bg).toBe(PAPER);
    }
  });

  it("every palette's swatch.fg = INK (#18141C — house surface token)", () => {
    for (const p of PALETTES) {
      expect(p.swatch.fg).toBe(INK);
    }
  });

  it("swatch.primary/neutral/accent === FAMILY_500[families.x] (the table-derived invariant)", () => {
    for (const p of PALETTES) {
      expect(p.swatch.primary).toBe(
        TAILWIND_3_4_FAMILY_500[p.families.primary],
      );
      expect(p.swatch.neutral).toBe(
        TAILWIND_3_4_FAMILY_500[p.families.neutral],
      );
      expect(p.swatch.accent).toBe(
        TAILWIND_3_4_FAMILY_500[p.families.accent],
      );
    }
  });

  it("locked canary — 'warm-paper' primary=orange, swatch.primary=#f97316", () => {
    const p = getPaletteById("warm-paper")!;
    expect(p.families.primary).toBe("orange");
    expect(p.swatch.primary).toBe("#f97316");
  });

  it("locked canary — 'ocean' primary=sky, swatch.primary=#0ea5e9", () => {
    const p = getPaletteById("ocean")!;
    expect(p.families.primary).toBe("sky");
    expect(p.swatch.primary).toBe("#0ea5e9");
  });

  it("locked canary — 'mono' uses 'zinc' for all three roles", () => {
    const p = getPaletteById("mono")!;
    expect(p.families.primary).toBe("zinc");
    expect(p.families.neutral).toBe("zinc");
    expect(p.families.accent).toBe("zinc");
    expect(p.swatch.primary).toBe(p.swatch.accent);
    expect(p.swatch.primary).toBe(p.swatch.neutral);
  });
});

describe("§4 getPaletteById — case sensitivity + null on miss", () => {
  it("returns null on miss (not undefined)", () => {
    expect(getPaletteById("does-not-exist")).toBeNull();
  });

  it("returns null on empty string (no palette has empty id)", () => {
    expect(getPaletteById("")).toBeNull();
  });

  it("is case-sensitive — uppercase id misses", () => {
    expect(getPaletteById("WARM-PAPER")).toBeNull();
    expect(getPaletteById("Ocean")).toBeNull();
  });

  it("hits every palette in PALETTES by id", () => {
    for (const p of PALETTES) {
      expect(getPaletteById(p.id)).toBe(p);
    }
  });
});
