// Phase 5 §5 / audit-2026-05-04 medium-fix — direct-import test for the
// production `applyResize`. Sister file to `tests/resize.test.ts`, which
// goes through `runBench("bench-resize")` and ends up testing the bench's
// inlined v1 copy of the algorithm (the audit `02-tests.md` flagged
// signal-divergence: lib was refactored to a 12-LOC wrapper around
// `applyStyleProps` while the bench still has the 130-LOC v1).
//
// This file imports `applyResize` from production directly so any logic
// drift between the bench's inlined mirror and the actual lib gets
// caught here. Cases overlap with the bench's case list intentionally
// (not duplicated wholesale — these focus on the wrapper's bail
// contract + lossless-on-no-op invariant).

import { describe, it, expect } from "vitest";
import { applyResize } from "../lib/ast/operations/resize";

const TPL = (style?: string) =>
  `export default function T() { return <div${
    style ? ` style=${style}` : ""
  } data-dropin-id="aaaaaaaa">x</div>; }`;

describe("applyResize (production import)", () => {
  it("empty op (no width, no height) → unchanged no-op", () => {
    const r = applyResize(TPL(), { oid: "aaaaaaaa" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeNull();
  });

  it("adds width to element with no style attribute", () => {
    const r = applyResize(TPL(), { oid: "aaaaaaaa", width: "248px" });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("width: '248px'");
    expect(r.source).toContain('data-dropin-id="aaaaaaaa"');
  });

  it("adds height to element with no style attribute", () => {
    const r = applyResize(TPL(), { oid: "aaaaaaaa", height: "12rem" });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("height: '12rem'");
  });

  it("sets both width and height in one pass", () => {
    const r = applyResize(TPL(), {
      oid: "aaaaaaaa",
      width: "100px",
      height: "200px",
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("width: '100px'");
    expect(r.source).toContain("height: '200px'");
  });

  it("merges into existing style ObjectExpression preserving siblings", () => {
    const src = TPL("{{ color: 'red' }}");
    const r = applyResize(src, { oid: "aaaaaaaa", width: "50px" });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("color: 'red'");
    expect(r.source).toContain("width: '50px'");
  });

  it("updates an existing width prop in place (no duplicate)", () => {
    const src = TPL("{{ width: '10px' }}");
    const r = applyResize(src, { oid: "aaaaaaaa", width: "50px" });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("width: '50px'");
    // Old value is gone — count occurrences of `width:` should be 1.
    const widthMatches = (r.source.match(/width:/g) || []).length;
    expect(widthMatches).toBe(1);
  });

  it("lossless on re-apply — same width on already-updated source = byte-identical output", () => {
    // The docblock claim is byte-identity of the OUTPUT, not unchanged:true
    // on the flag. The wrapper re-writes the prop unconditionally; the
    // invariant is that the rewrite produces the same bytes when the input
    // matches the request, not that the wrapper short-circuits.
    const src0 = TPL();
    const r1 = applyResize(src0, { oid: "aaaaaaaa", width: "75px" });
    expect(r1.unchanged).toBe(false);
    const r2 = applyResize(r1.source, { oid: "aaaaaaaa", width: "75px" });
    expect(r2.source).toBe(r1.source);
  });

  it("OID not present in source → unchanged with reason", () => {
    const r = applyResize(TPL(), { oid: "ffffffff", width: "10px" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("style={cn(...)} (non-ObjectExpression) → unchanged with bail reason", () => {
    const src = TPL("{cn('a', 'b')}");
    const r = applyResize(src, { oid: "aaaaaaaa", width: "10px" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("style=\"plain string\" (string literal) → unchanged with bail reason", () => {
    const src = TPL('"color:red"');
    const r = applyResize(src, { oid: "aaaaaaaa", width: "10px" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("source that doesn't parse → unchanged with parse-failure reason", () => {
    const r = applyResize("this is not jsx <<<<", {
      oid: "aaaaaaaa",
      width: "10px",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("returns the correct shape: { source, unchanged, reason }", () => {
    const r = applyResize(TPL(), { oid: "aaaaaaaa", width: "10px" });
    expect(typeof r.source).toBe("string");
    expect(typeof r.unchanged).toBe("boolean");
    expect(r.reason === null || typeof r.reason === "string").toBe(true);
  });

  it("preserves the data-dropin-id on the resized element", () => {
    const r = applyResize(TPL(), { oid: "aaaaaaaa", width: "10px" });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain('data-dropin-id="aaaaaaaa"');
  });

  it("does not touch siblings when multiple OIDs are present", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">x</div>
        <div data-dropin-id="cccccccc">y</div>
      </section>;
    }`;
    const r = applyResize(src, { oid: "bbbbbbbb", width: "50px" });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain('data-dropin-id="aaaaaaaa"');
    expect(r.source).toContain('data-dropin-id="cccccccc"');
    // Only one width prop was injected (on bbbbbbbb).
    const widthMatches = (r.source.match(/width:/g) || []).length;
    expect(widthMatches).toBe(1);
  });
});
