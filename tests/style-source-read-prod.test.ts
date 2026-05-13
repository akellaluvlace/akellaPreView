import { describe, it, expect } from "vitest";
import { readSourceStyle } from "../lib/ast/style-source-read";

// Prod-import test for lib/ast/style-source-read.ts. The Properties
// Panel uses this to populate numeric inputs from the JSX `style={{...}}`
// ObjectExpression for a given OID. Counterweight to any inline-mirror
// in benches (no bench currently inlines this — prod-import IS the
// only test signal).

describe("lib/ast/style-source-read — happy path", () => {
  it("reads a string-literal style prop", () => {
    const src = `<div data-dropin-id="a" style={{ width: "100px" }} />`;
    expect(readSourceStyle(src, "a")).toEqual({ width: "100px" });
  });

  it("reads a numeric-literal style prop (stringified)", () => {
    const src = `<div data-dropin-id="a" style={{ width: 100 }} />`;
    expect(readSourceStyle(src, "a")).toEqual({ width: "100" });
  });

  it("reads multiple props in source order (object preserves keys)", () => {
    const src = `<div data-dropin-id="a" style={{ width: "100px", height: "50px", margin: 8 }} />`;
    expect(readSourceStyle(src, "a")).toEqual({
      width: "100px",
      height: "50px",
      margin: "8",
    });
  });

  it("supports identifier keys (camelCase, e.g. paddingTop)", () => {
    const src = `<div data-dropin-id="a" style={{ paddingTop: "12px" }} />`;
    expect(readSourceStyle(src, "a")).toEqual({ paddingTop: "12px" });
  });

  it("supports string-literal keys (e.g. '--my-var')", () => {
    const src = `<div data-dropin-id="a" style={{ "--my-var": "red" }} />`;
    expect(readSourceStyle(src, "a")).toEqual({ "--my-var": "red" });
  });
});

describe("lib/ast/style-source-read — bail paths", () => {
  it("returns {} when source fails to parse", () => {
    const src = `<div data-dropin-id="a" style={{ width: 100 } /* unterminated`;
    // Babel's errorRecovery is on, so parse usually succeeds with
    // partial AST. This case is a heavily-malformed input — confirm
    // we either get {} or at minimum a safe defined object.
    const got = readSourceStyle(src, "a");
    expect(got).toBeTypeOf("object");
    expect(got).not.toBeNull();
  });

  it("returns {} when oid is not found", () => {
    const src = `<div data-dropin-id="a" style={{ width: "100px" }} />`;
    expect(readSourceStyle(src, "missing")).toEqual({});
  });

  it("returns {} when element has no style attribute", () => {
    const src = `<div data-dropin-id="a" />`;
    expect(readSourceStyle(src, "a")).toEqual({});
  });

  it("returns {} when style is a string (style=\"...\")", () => {
    const src = `<div data-dropin-id="a" style="color: red" />`;
    expect(readSourceStyle(src, "a")).toEqual({});
  });

  it("returns {} when style is an identifier expression (style={var})", () => {
    const src = `<div data-dropin-id="a" style={var1} />`;
    expect(readSourceStyle(src, "a")).toEqual({});
  });

  it("returns {} when style is a function call (style={cn(...)})", () => {
    const src = `<div data-dropin-id="a" style={cn("foo", "bar")} />`;
    expect(readSourceStyle(src, "a")).toEqual({});
  });
});

describe("lib/ast/style-source-read — value type filtering", () => {
  it("skips computed/expression values (template literals, identifiers)", () => {
    const src = `<div data-dropin-id="a" style={{ width: \`\${x}px\`, height: 50 }} />`;
    // The template-literal `width` is skipped, `height` is captured.
    expect(readSourceStyle(src, "a")).toEqual({ height: "50" });
  });

  it("skips spread elements (..rest)", () => {
    const src = `<div data-dropin-id="a" style={{ ...rest, width: 10 }} />`;
    // Spread is not an ObjectProperty — skipped silently. width still
    // captured.
    expect(readSourceStyle(src, "a")).toEqual({ width: "10" });
  });

  it("captures only literal values, leaves computed expressions unsurfaced", () => {
    // The panel's contract: reflect "what changing this number rewrites
    // in the file". Computed values can't be safely round-tripped, so
    // they're omitted; the user can type a new value to overwrite.
    const src = `<div data-dropin-id="a" style={{ width: variable, padding: 8 }} />`;
    expect(readSourceStyle(src, "a")).toEqual({ padding: "8" });
  });
});

describe("lib/ast/style-source-read — multi-element scope", () => {
  it("targets the right oid when multiple elements have style", () => {
    const src = `
      <div data-dropin-id="parent" style={{ padding: 16 }}>
        <span data-dropin-id="child" style={{ color: "red" }} />
      </div>
    `;
    expect(readSourceStyle(src, "parent")).toEqual({ padding: "16" });
    expect(readSourceStyle(src, "child")).toEqual({ color: "red" });
  });

  it("handles an empty {} ObjectExpression as no props", () => {
    const src = `<div data-dropin-id="a" style={{}} />`;
    expect(readSourceStyle(src, "a")).toEqual({});
  });
});
