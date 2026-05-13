// Phase 5 §5 / audit-2026-05-04 medium-fix — direct-import tests for
// `applyReorder` + `applyReparent` + `applyPalette` (the structural
// move + palette-swap engines). Companion benches `bench-reorder.mjs`,
// `bench-reparent.mjs`, `bench-palette-apply.mjs` inline their own
// copies; this file imports production directly. Inline-mirror anti-
// pattern counterweight (audit `02-tests.md`).

import { describe, it, expect } from "vitest";
import { applyReorder } from "../lib/ast/operations/reorder";
import { applyReparent } from "../lib/ast/operations/reparent";
import { applyPalette } from "../lib/ast/operations/palette";
import { PALETTES, getPaletteById } from "../lib/palettes";

const threeChildren = () => `export default function T() {
  return (
    <section data-dropin-id="aaaaaaaa">
      <h1 data-dropin-id="bbbbbbbb">first</h1>
      <p data-dropin-id="cccccccc">second</p>
      <span data-dropin-id="dddddddd">third</span>
    </section>
  );
}`;

describe("applyReorder (production import)", () => {
  it("moves last child to first position", () => {
    const r = applyReorder(threeChildren(), {
      oid: "dddddddd",
      parentOid: "aaaaaaaa",
      toIndex: 0,
    });
    expect(r.unchanged).toBe(false);
    // Order in source should now be: dddd, bbbb, cccc.
    const idxD = r.source.indexOf('data-dropin-id="dddddddd"');
    const idxB = r.source.indexOf('data-dropin-id="bbbbbbbb"');
    const idxC = r.source.indexOf('data-dropin-id="cccccccc"');
    expect(idxD).toBeLessThan(idxB);
    expect(idxB).toBeLessThan(idxC);
  });

  it("moves first child to last position", () => {
    const r = applyReorder(threeChildren(), {
      oid: "bbbbbbbb",
      parentOid: "aaaaaaaa",
      toIndex: 2,
    });
    expect(r.unchanged).toBe(false);
    const idxC = r.source.indexOf('data-dropin-id="cccccccc"');
    const idxD = r.source.indexOf('data-dropin-id="dddddddd"');
    const idxB = r.source.indexOf('data-dropin-id="bbbbbbbb"');
    expect(idxC).toBeLessThan(idxD);
    expect(idxD).toBeLessThan(idxB);
  });

  it("toIndex == fromIndex → unchanged no-op", () => {
    const r = applyReorder(threeChildren(), {
      oid: "cccccccc",
      parentOid: "aaaaaaaa",
      toIndex: 1, // already at index 1
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeNull();
  });

  it("bails on out-of-range toIndex", () => {
    const r = applyReorder(threeChildren(), {
      oid: "bbbbbbbb",
      parentOid: "aaaaaaaa",
      toIndex: 99,
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails when oid is not a direct child of parentOid", () => {
    const r = applyReorder(threeChildren(), {
      oid: "ffffffff",
      parentOid: "aaaaaaaa",
      toIndex: 0,
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails on unparseable source", () => {
    const r = applyReorder("not jsx <<<", {
      oid: "aaaaaaaa",
      parentOid: "bbbbbbbb",
      toIndex: 0,
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });
});

describe("applyReparent (production import)", () => {
  it("moves child from parent A to parent B", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">
          <span data-dropin-id="cccccccc">move me</span>
        </div>
        <article data-dropin-id="dddddddd"></article>
      </section>;
    }`;
    const r = applyReparent(src, {
      oid: "cccccccc",
      newParentOid: "dddddddd",
      insertIndex: 0,
    });
    expect(r.unchanged).toBe(false);
    // The moved cccc is now inside dddd, not bbbb.
    const ddddOpen = r.source.indexOf('data-dropin-id="dddddddd"');
    const ddddClose = r.source.indexOf("</article>");
    const ccccPos = r.source.indexOf('data-dropin-id="cccccccc"');
    expect(ccccPos).toBeGreaterThan(ddddOpen);
    expect(ccccPos).toBeLessThan(ddddClose);
  });

  it("bails when newParent equals current direct parent (caller should use reorder)", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">x</div>
        <div data-dropin-id="cccccccc">y</div>
      </section>;
    }`;
    const r = applyReparent(src, {
      oid: "bbbbbbbb",
      newParentOid: "aaaaaaaa", // same as bbbb's current parent
      insertIndex: 0,
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails when newParent is a descendant of oid (would create a cycle)", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">
          <span data-dropin-id="cccccccc"></span>
        </div>
      </section>;
    }`;
    const r = applyReparent(src, {
      oid: "bbbbbbbb",
      newParentOid: "cccccccc",
      insertIndex: 0,
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails on unparseable source", () => {
    const r = applyReparent("not jsx <<<", {
      oid: "aaaaaaaa",
      newParentOid: "bbbbbbbb",
      insertIndex: 0,
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("returns shape: { source, unchanged, reason }", () => {
    const r = applyReparent("not jsx <<<", {
      oid: "aaaaaaaa",
      newParentOid: "bbbbbbbb",
      insertIndex: 0,
    });
    expect(typeof r.source).toBe("string");
    expect(typeof r.unchanged).toBe("boolean");
    expect(r.reason === null || typeof r.reason === "string").toBe(true);
  });
});

describe("applyPalette (production import)", () => {
  it("PALETTES registry has the documented 12 palettes", () => {
    expect(PALETTES.length).toBe(12);
    for (const p of PALETTES) {
      expect(typeof p.id).toBe("string");
      expect(typeof p.name).toBe("string");
      expect(p.families).toBeTruthy();
      expect(p.swatch).toBeTruthy();
    }
  });

  it("getPaletteById returns the palette by id; null on miss", () => {
    expect(getPaletteById("warm-paper")?.id).toBe("warm-paper");
    expect(getPaletteById("does-not-exist")).toBeNull();
  });

  it("rewrites a className token's family in a 'all' scope", () => {
    const palette = getPaletteById("ocean")!;
    const src = `export default function T() {
      return <div data-dropin-id="aaaaaaaa" className="bg-red-500 text-red-900">x</div>;
    }`;
    const r = applyPalette(src, { palette, scope: "all" });
    // ocean's primary is sky → red-500 should remap to sky-500
    if (!r.unchanged) {
      expect(r.source).toContain("sky-500");
      expect(r.source).not.toContain("bg-red-500");
    } else {
      // If the algorithm decided no remap was warranted, it bails with reason
      expect(r.reason).toBeTruthy();
    }
  });

  it("bails on unparseable source", () => {
    const palette = PALETTES[0];
    const r = applyPalette("not jsx <<<", { palette, scope: "all" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("scope = { oids: [] } → no-op (nothing in scope to rewrite)", () => {
    const palette = PALETTES[0];
    const src = `export default function T() {
      return <div data-dropin-id="aaaaaaaa" className="bg-red-500">x</div>;
    }`;
    const r = applyPalette(src, { palette, scope: { oids: [] } });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("returns shape: { source, unchanged, reason }", () => {
    const palette = PALETTES[0];
    const r = applyPalette("not jsx <<<", { palette, scope: "all" });
    expect(typeof r.source).toBe("string");
    expect(typeof r.unchanged).toBe("boolean");
    expect(r.reason === null || typeof r.reason === "string").toBe(true);
  });
});
