// 8th prod-import surge — direct-import tests for `lib/ast/operations/spacing.ts`.
// `applySpacing` is the gesture-side spacing engine; thin wrapper over
// `applyStyleProps` (already covered by `tests/style-prod.test.ts`). The
// wrapper's only responsibility is mapping (kind, side) → camelCase JSX
// style key. Bench `bench-spacing.mjs` exists; this is the prod-import
// counterweight.

import { describe, it, expect } from "vitest";
import { applySpacing } from "../lib/ast/operations/spacing";

const sourceWithBoxOid = (oid: string) => `export default function T() {
  return (
    <div data-dropin-id="${oid}">x</div>
  );
}`;

describe("§1 applySpacing — happy paths (padding kind)", () => {
  it("writes paddingTop only when only top is set", () => {
    const r = applySpacing(sourceWithBoxOid("aaaaaaaa"), {
      oid: "aaaaaaaa",
      kind: "padding",
      top: "20px",
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("paddingTop");
    expect(r.source).toContain("20px");
    expect(r.source).not.toContain("paddingRight");
    expect(r.source).not.toContain("paddingBottom");
    expect(r.source).not.toContain("paddingLeft");
  });

  it("writes all 4 per-side props when all 4 sides set", () => {
    const r = applySpacing(sourceWithBoxOid("bbbbbbbb"), {
      oid: "bbbbbbbb",
      kind: "padding",
      top: "1px",
      right: "2px",
      bottom: "3px",
      left: "4px",
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("paddingTop");
    expect(r.source).toContain("paddingRight");
    expect(r.source).toContain("paddingBottom");
    expect(r.source).toContain("paddingLeft");
    expect(r.source).toContain("'1px'");
    expect(r.source).toContain("'4px'");
  });
});

describe("§2 applySpacing — margin kind", () => {
  it("writes marginTop / marginRight / etc. (camelCase mirror of padding)", () => {
    const r = applySpacing(sourceWithBoxOid("cccccccc"), {
      oid: "cccccccc",
      kind: "margin",
      top: "8px",
      bottom: "8px",
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("marginTop");
    expect(r.source).toContain("marginBottom");
    expect(r.source).not.toContain("marginRight");
    expect(r.source).not.toContain("marginLeft");
  });

  it("accepts negative margin values verbatim", () => {
    const r = applySpacing(sourceWithBoxOid("dddddddd"), {
      oid: "dddddddd",
      kind: "margin",
      left: "-4px",
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("marginLeft");
    expect(r.source).toContain("'-4px'");
  });
});

describe("§3 applySpacing — no-ops + bails", () => {
  it("all-undefined input is an intentional no-op (unchanged: true, no reason)", () => {
    const src = sourceWithBoxOid("eeeeeeee");
    const r = applySpacing(src, {
      oid: "eeeeeeee",
      kind: "padding",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeNull();
    expect(r.source).toBe(src);
  });

  it("empty kind-only object (no sides) is no-op", () => {
    const src = sourceWithBoxOid("ffffffff");
    const r = applySpacing(src, {
      oid: "ffffffff",
      kind: "margin",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeNull();
  });

  it("missing OID bails via applyStyleProps", () => {
    const r = applySpacing(sourceWithBoxOid("gggggggg"), {
      oid: "MISSING1",
      kind: "padding",
      top: "10px",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("parse failure surface via applyStyleProps", () => {
    const r = applySpacing("not a parseable jsx", {
      oid: "anything",
      kind: "padding",
      top: "10px",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });
});

describe("§4 applySpacing — coexistence with shorthand padding/margin", () => {
  it("longhand wins on top of existing shorthand padding via applyStyleProps", () => {
    // Source already has shorthand `padding: '10px'` — applySpacing should
    // ADD paddingTop alongside (longhand wins in the cascade per docblock).
    const src = `export default function T() {
  return (
    <div data-dropin-id="hhhhhhhh" style={{ padding: '10px' }}>x</div>
  );
}`;
    const r = applySpacing(src, {
      oid: "hhhhhhhh",
      kind: "padding",
      top: "20px",
    });
    expect(r.unchanged).toBe(false);
    // Both shorthand AND longhand should be in the source after.
    expect(r.source).toContain("padding:");
    expect(r.source).toContain("paddingTop");
  });
});

describe("§5 applySpacing — exhaustive (kind, side) → key mapping", () => {
  it("padding sides map to paddingTop/paddingRight/paddingBottom/paddingLeft", () => {
    const sides = ["top", "right", "bottom", "left"] as const;
    const expected = [
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
    ];
    for (let i = 0; i < sides.length; i++) {
      const r = applySpacing(sourceWithBoxOid(`zzzzz${i}xx`), {
        oid: `zzzzz${i}xx`,
        kind: "padding",
        [sides[i]!]: "5px",
      });
      expect(r.source).toContain(expected[i]!);
    }
  });

  it("margin sides map to marginTop/marginRight/marginBottom/marginLeft", () => {
    const sides = ["top", "right", "bottom", "left"] as const;
    const expected = ["marginTop", "marginRight", "marginBottom", "marginLeft"];
    for (let i = 0; i < sides.length; i++) {
      const r = applySpacing(sourceWithBoxOid(`yyyyy${i}xx`), {
        oid: `yyyyy${i}xx`,
        kind: "margin",
        [sides[i]!]: "5px",
      });
      expect(r.source).toContain(expected[i]!);
    }
  });
});
