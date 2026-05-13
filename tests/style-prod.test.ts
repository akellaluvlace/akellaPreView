// Phase 5 §5 / audit-2026-05-04 medium-fix — direct-import test for
// `lib/ast/operations/style.ts applyStyleProps`. This is the underlying
// engine that `applyResize`, `applySpacing`, and the Properties Panel
// commit pipeline all wrap, so a regression here fans out across every
// dimension/spacing/radius edit. The companion bench
// `scripts/bench-style.mjs` inlines its own copy of the algorithm
// (audit `02-tests.md` flagged the inline-mirror anti-pattern); this
// file imports production directly so drift between the inlined mirror
// and reality has independent signal.

import { describe, it, expect } from "vitest";
import { applyStyleProps } from "../lib/ast/operations/style";

const TPL = (style?: string) =>
  `export default function T() { return <div${
    style ? ` style=${style}` : ""
  } data-dropin-id="aaaaaaaa">x</div>; }`;

describe("applyStyleProps (production import)", () => {
  it("empty declarations → unchanged no-op (null reason)", () => {
    const r = applyStyleProps(TPL(), { oid: "aaaaaaaa", declarations: {} });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeNull();
  });

  it("all-undefined declarations → unchanged no-op", () => {
    const r = applyStyleProps(TPL(), {
      oid: "aaaaaaaa",
      declarations: { width: undefined, height: undefined },
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeNull();
  });

  it("adds a new prop on element with no style attribute", () => {
    const r = applyStyleProps(TPL(), {
      oid: "aaaaaaaa",
      declarations: { width: "100px" },
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("width: '100px'");
  });

  it("adds new prop into existing ObjectExpression preserving siblings", () => {
    const src = TPL("{{ color: 'red' }}");
    const r = applyStyleProps(src, {
      oid: "aaaaaaaa",
      declarations: { width: "100px" },
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("color: 'red'");
    expect(r.source).toContain("width: '100px'");
  });

  it("updates an existing prop in place — no duplicate", () => {
    const src = TPL("{{ width: '50px' }}");
    const r = applyStyleProps(src, {
      oid: "aaaaaaaa",
      declarations: { width: "200px" },
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("width: '200px'");
    expect((r.source.match(/width:/g) || []).length).toBe(1);
  });

  it("null value removes an existing prop", () => {
    const src = TPL("{{ color: 'red', width: '50px' }}");
    const r = applyStyleProps(src, {
      oid: "aaaaaaaa",
      declarations: { width: null },
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("color: 'red'");
    expect(r.source).not.toContain("width:");
  });

  it("null value on non-existent prop → no-op via no decl that triggers write", () => {
    const src = TPL("{{ color: 'red' }}");
    const r = applyStyleProps(src, {
      oid: "aaaaaaaa",
      declarations: { width: null },
    });
    // Removing a prop that isn't there is harmless. Result either stays
    // byte-identical OR is unchanged:true — the test asserts color survives
    // and no width was injected.
    expect(r.source).toContain("color: 'red'");
    expect(r.source).not.toMatch(/width:\s*'/);
  });

  it("mixed write + delete in one call", () => {
    const src = TPL("{{ color: 'red', width: '50px' }}");
    const r = applyStyleProps(src, {
      oid: "aaaaaaaa",
      declarations: { width: null, height: "200px" },
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("color: 'red'");
    expect(r.source).toContain("height: '200px'");
    expect(r.source).not.toContain("width:");
  });

  it("multiple new props all written", () => {
    const r = applyStyleProps(TPL(), {
      oid: "aaaaaaaa",
      declarations: {
        width: "100px",
        height: "200px",
        borderRadius: "8px",
      },
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("width: '100px'");
    expect(r.source).toContain("height: '200px'");
    expect(r.source).toContain("borderRadius: '8px'");
  });

  it("OID not present in source → unchanged with reason", () => {
    const r = applyStyleProps(TPL(), {
      oid: "ffffffff",
      declarations: { width: "100px" },
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("style={cn(...)} (CallExpression) → unchanged with bail reason", () => {
    const src = TPL("{cn('a', 'b')}");
    const r = applyStyleProps(src, {
      oid: "aaaaaaaa",
      declarations: { width: "100px" },
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it('style="string-literal" → unchanged with bail reason', () => {
    const src = TPL('"color:red"');
    const r = applyStyleProps(src, {
      oid: "aaaaaaaa",
      declarations: { width: "100px" },
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("source that doesn't parse → unchanged with parse-failure reason", () => {
    const r = applyStyleProps("not jsx <<<<", {
      oid: "aaaaaaaa",
      declarations: { width: "100px" },
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toMatch(/parse/i);
  });

  it("style={someExpr} (Identifier — not ObjectExpression) → unchanged with bail reason", () => {
    const src = TPL("{styleObj}");
    const r = applyStyleProps(src, {
      oid: "aaaaaaaa",
      declarations: { width: "100px" },
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("lossless re-apply — same declarations on already-updated source = byte-identical output", () => {
    const r1 = applyStyleProps(TPL(), {
      oid: "aaaaaaaa",
      declarations: { width: "100px" },
    });
    expect(r1.unchanged).toBe(false);
    const r2 = applyStyleProps(r1.source, {
      oid: "aaaaaaaa",
      declarations: { width: "100px" },
    });
    expect(r2.source).toBe(r1.source);
  });

  it("does not touch siblings with different OIDs", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">x</div>
        <div data-dropin-id="cccccccc">y</div>
      </section>;
    }`;
    const r = applyStyleProps(src, {
      oid: "bbbbbbbb",
      declarations: { width: "50px" },
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain('data-dropin-id="aaaaaaaa"');
    expect(r.source).toContain('data-dropin-id="cccccccc"');
    expect((r.source.match(/width:/g) || []).length).toBe(1);
  });

  it("returns the documented shape: { source, unchanged, reason }", () => {
    const r = applyStyleProps(TPL(), {
      oid: "aaaaaaaa",
      declarations: { width: "10px" },
    });
    expect(typeof r.source).toBe("string");
    expect(typeof r.unchanged).toBe("boolean");
    expect(r.reason === null || typeof r.reason === "string").toBe(true);
  });
});
