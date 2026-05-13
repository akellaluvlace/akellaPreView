import { describe, it, expect } from "vitest";
import { collectDescendantOids } from "../lib/ast/scope";

// Prod-import test for lib/ast/scope.ts. Used by FocusEditor's
// isolated palette swap path — collects every OID inside a focused
// element's subtree so the swap targets only the focus, not the page.
// No bench inlines this — prod-import is the only signal.

describe("lib/ast/scope — root-only subtrees", () => {
  it("returns [rootOid] for a self-closing root with no descendants", () => {
    const src = `<div data-dropin-id="root" />`;
    expect(collectDescendantOids(src, "root")).toEqual(["root"]);
  });

  it("returns [rootOid] for a non-self-closing root with no oid'd children", () => {
    // Children without OIDs aren't collected — only OID-bearing
    // openings count. Plain text children are walked but emit nothing.
    const src = `<div data-dropin-id="root">hello</div>`;
    expect(collectDescendantOids(src, "root")).toEqual(["root"]);
  });
});

describe("lib/ast/scope — descendant collection in source order", () => {
  it("collects root + immediate children in DFS pre-order", () => {
    const src = `
      <div data-dropin-id="root">
        <span data-dropin-id="a" />
        <span data-dropin-id="b" />
      </div>
    `;
    expect(collectDescendantOids(src, "root")).toEqual(["root", "a", "b"]);
  });

  it("descends arbitrarily deep — each element's opening contributes once", () => {
    const src = `
      <section data-dropin-id="root">
        <div data-dropin-id="A">
          <p data-dropin-id="A1">x</p>
          <p data-dropin-id="A2">y</p>
        </div>
        <div data-dropin-id="B">
          <p data-dropin-id="B1">z</p>
        </div>
      </section>
    `;
    expect(collectDescendantOids(src, "root")).toEqual([
      "root",
      "A",
      "A1",
      "A2",
      "B",
      "B1",
    ]);
  });

  it("scopes correctly when collecting from a non-root subtree", () => {
    const src = `
      <section data-dropin-id="root">
        <div data-dropin-id="A">
          <p data-dropin-id="A1" />
          <p data-dropin-id="A2" />
        </div>
        <div data-dropin-id="B">
          <p data-dropin-id="B1" />
        </div>
      </section>
    `;
    // Asking for subtree-A should NOT include root, B, or B1.
    expect(collectDescendantOids(src, "A")).toEqual(["A", "A1", "A2"]);
  });

  it("scopes a leaf-level subtree", () => {
    const src = `
      <section data-dropin-id="root">
        <div data-dropin-id="A">
          <p data-dropin-id="A1">x</p>
        </div>
      </section>
    `;
    expect(collectDescendantOids(src, "A1")).toEqual(["A1"]);
  });
});

describe("lib/ast/scope — bail paths", () => {
  it("returns [] when rootOid is not present in the source", () => {
    const src = `<div data-dropin-id="real">x</div>`;
    expect(collectDescendantOids(src, "missing")).toEqual([]);
  });

  it("returns [] for empty source", () => {
    expect(collectDescendantOids("", "root")).toEqual([]);
  });

  it("returns [] when source has no JSX at all", () => {
    expect(collectDescendantOids("const x = 1;", "root")).toEqual([]);
  });

  it("returns [] when source is wildly malformed", () => {
    // Babel.parse errorRecovery is on, but if it still throws, we
    // catch and return []. Even with recovery, the OID lookup will
    // fail and yield [] — both paths converge on the same output.
    const src = `<<<not really jsx>>>`;
    expect(collectDescendantOids(src, "anything")).toEqual([]);
  });
});

describe("lib/ast/scope — non-OID elements are walked through", () => {
  it("traverses through unwrapped intermediate elements", () => {
    // The intermediate <div> has no OID. Its children's OIDs are
    // still collected via recursion.
    const src = `
      <div data-dropin-id="root">
        <div>
          <span data-dropin-id="grand" />
        </div>
      </div>
    `;
    expect(collectDescendantOids(src, "root")).toEqual(["root", "grand"]);
  });

  it("walks through Fragments (<>...</>)", () => {
    const src = `
      <div data-dropin-id="root">
        <>
          <span data-dropin-id="frag-child" />
        </>
      </div>
    `;
    expect(collectDescendantOids(src, "root")).toEqual([
      "root",
      "frag-child",
    ]);
  });
});

describe("lib/ast/scope — sibling isolation", () => {
  it("does not bleed into a later sibling's subtree", () => {
    const src = `
      <main>
        <section data-dropin-id="L">
          <p data-dropin-id="L1" />
        </section>
        <section data-dropin-id="R">
          <p data-dropin-id="R1" />
        </section>
      </main>
    `;
    expect(collectDescendantOids(src, "L")).toEqual(["L", "L1"]);
    expect(collectDescendantOids(src, "R")).toEqual(["R", "R1"]);
  });

  it("collects only the first occurrence's subtree on duplicate OIDs", () => {
    // Spec contract: findJsxElementByOid returns the first match. If
    // injectOids ever ships duplicates (the known React-key warning
    // bug), this picks the FIRST subtree consistently, not both.
    const src = `
      <main>
        <div data-dropin-id="dup">
          <span data-dropin-id="x" />
        </div>
        <div data-dropin-id="dup">
          <span data-dropin-id="y" />
        </div>
      </main>
    `;
    const out = collectDescendantOids(src, "dup");
    expect(out[0]).toBe("dup");
    expect(out).toContain("x");
    expect(out).not.toContain("y");
  });
});
