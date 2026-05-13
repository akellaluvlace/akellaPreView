import { describe, it, expect } from "vitest";
import { patchJsxClassByOid } from "../lib/ast/patch-class-by-oid";

// Prod-import test for lib/ast/patch-class-by-oid.ts. The propagation
// toggle's "everywhere" mode uses this OID-keyed patcher to rewrite
// className at component-definition sites (where there's no loc, just
// an OID). Mirror contract of `patchJsxClass` (loc-based) — same
// rules: no expression patches, attribute removal preserves
// surrounding whitespace, quote escaping for safety.

describe("lib/ast/patch-class-by-oid — happy path: existing string className", () => {
  it("overwrites a different value", () => {
    const src = `<div data-dropin-id="a" className="old" />`;
    const r = patchJsxClassByOid(src, "a", "new");
    expect(r.changed).toBe(true);
    expect(r.reason).toBeNull();
    expect(r.source).toContain('className="new"');
    expect(r.source).not.toContain('className="old"');
  });

  it("returns no-change when value is identical (after trim)", () => {
    const src = `<div data-dropin-id="a" className="same" />`;
    const r = patchJsxClassByOid(src, "a", "same");
    expect(r.changed).toBe(false);
    expect(r.reason).toBe("no change");
    expect(r.source).toBe(src);
  });

  it("treats whitespace-equivalent newClass as identical (trim applied)", () => {
    const src = `<div data-dropin-id="a" className="hello" />`;
    const r = patchJsxClassByOid(src, "a", "  hello  ");
    expect(r.changed).toBe(false);
    expect(r.reason).toBe("no change");
  });

  it("rewrites with the trimmed value", () => {
    const src = `<div data-dropin-id="a" className="x" />`;
    const r = patchJsxClassByOid(src, "a", "  y  ");
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="y"');
  });

  it("preserves surrounding source bytes when overwriting", () => {
    const src = `<section><div data-dropin-id="a" className="old">child</div></section>`;
    const r = patchJsxClassByOid(src, "a", "new");
    expect(r.source).toBe(`<section><div data-dropin-id="a" className="new">child</div></section>`);
  });
});

describe("lib/ast/patch-class-by-oid — happy path: insert new className", () => {
  it("inserts className after the opening tag's name when missing", () => {
    const src = `<div data-dropin-id="a" />`;
    const r = patchJsxClassByOid(src, "a", "fresh");
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="fresh"');
    // Order: <tag className="..." data-dropin-id="..." />, since
    // appendLeft at name.end places className FIRST.
    expect(r.source.indexOf("className")).toBeLessThan(
      r.source.indexOf("data-dropin-id"),
    );
  });

  it("inserts className with trimmed value", () => {
    const src = `<div data-dropin-id="a">x</div>`;
    const r = patchJsxClassByOid(src, "a", "   foo   ");
    expect(r.source).toContain('className="foo"');
  });

  it("returns no-change when both no className and empty newClass", () => {
    const src = `<div data-dropin-id="a" />`;
    const r = patchJsxClassByOid(src, "a", "");
    expect(r.changed).toBe(false);
    expect(r.reason).toBe("no className attribute and newClass is empty");
    expect(r.source).toBe(src);
  });
});

describe("lib/ast/patch-class-by-oid — happy path: remove className", () => {
  it("removes className when newClass is empty (drops leading whitespace too)", () => {
    const src = `<div data-dropin-id="a" className="x" />`;
    const r = patchJsxClassByOid(src, "a", "");
    expect(r.changed).toBe(true);
    // After removal, no double-space should remain between
    // `data-dropin-id="a"` and `/`.
    expect(r.source).not.toContain('className="x"');
    expect(r.source).not.toMatch(/  +\/>/);
  });

  it("removes className with whitespace-only newClass (treated as empty after trim)", () => {
    const src = `<div data-dropin-id="a" className="x" />`;
    const r = patchJsxClassByOid(src, "a", "   ");
    expect(r.changed).toBe(true);
    expect(r.source).not.toContain('className="x"');
  });
});

describe("lib/ast/patch-class-by-oid — bail: expression className", () => {
  it("bails on `className={...}` (expression form)", () => {
    const src = `<div data-dropin-id="a" className={dynamic} />`;
    const r = patchJsxClassByOid(src, "a", "force-static");
    expect(r.changed).toBe(false);
    expect(r.reason).toBe(
      "className uses an expression — propagation skipped",
    );
    expect(r.source).toBe(src);
  });

  it("bails on `className={cn('foo','bar')}` (template / call expression)", () => {
    const src = `<div data-dropin-id="a" className={cn('foo','bar')} />`;
    const r = patchJsxClassByOid(src, "a", "static-x");
    expect(r.changed).toBe(false);
    expect(r.reason).toBe(
      "className uses an expression — propagation skipped",
    );
  });
});

describe("lib/ast/patch-class-by-oid — bail: oid not found", () => {
  it("returns reason mentioning the missing oid", () => {
    const src = `<div data-dropin-id="real" className="x" />`;
    const r = patchJsxClassByOid(src, "missing", "anything");
    expect(r.changed).toBe(false);
    expect(r.reason).toContain("missing");
    expect(r.reason).toContain("not found");
    expect(r.source).toBe(src);
  });
});

describe("lib/ast/patch-class-by-oid — bail: parse failure", () => {
  it("returns parse-failed reason on truly malformed input", () => {
    // errorRecovery is on, but heavy malformation can still throw.
    // If recovery succeeds, the path is still safe (oid not found).
    const src = `<div data-dropin-id="a" }}}}}{`;
    const r = patchJsxClassByOid(src, "a", "x");
    expect(r.changed).toBe(false);
    // Either parse failure OR oid lookup failure — both are valid
    // bail paths and both should produce a reason.
    expect(r.reason).toBeTruthy();
  });
});

describe("lib/ast/patch-class-by-oid — quote escaping", () => {
  it("escapes embedded double quotes as &quot; on insert", () => {
    const src = `<div data-dropin-id="a" />`;
    const r = patchJsxClassByOid(src, "a", 'a"b');
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="a&quot;b"');
  });

  it("escapes embedded double quotes as &quot; on overwrite", () => {
    const src = `<div data-dropin-id="a" className="old" />`;
    const r = patchJsxClassByOid(src, "a", 'foo"bar');
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="foo&quot;bar"');
  });
});

describe("lib/ast/patch-class-by-oid — multi-class values", () => {
  it("preserves whitespace inside the className value as-typed", () => {
    const src = `<div data-dropin-id="a" />`;
    const r = patchJsxClassByOid(src, "a", "px-4 py-2 rounded-lg");
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="px-4 py-2 rounded-lg"');
  });

  it("does not collapse internal multi-spaces (preserves verbatim)", () => {
    const src = `<div data-dropin-id="a" />`;
    const r = patchJsxClassByOid(src, "a", "px-4  py-2"); // double space
    expect(r.source).toContain('className="px-4  py-2"');
  });
});

describe("lib/ast/patch-class-by-oid — multi-element scope", () => {
  it("only patches the targeted oid when multiple elements present", () => {
    // Two siblings under one parent (top-level adjacent JSX is a syntax error).
    const src = `<section>
      <div data-dropin-id="a" className="A" />
      <div data-dropin-id="b" className="B" />
    </section>`;
    const r = patchJsxClassByOid(src, "a", "A-new");
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="A-new"');
    expect(r.source).toContain('className="B"');
  });

  it("targets a deep descendant correctly", () => {
    const src = `
      <section>
        <header>
          <h1 data-dropin-id="title" className="text-xl">Hello</h1>
        </header>
      </section>
    `;
    const r = patchJsxClassByOid(src, "title", "text-2xl font-bold");
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="text-2xl font-bold"');
  });
});
