import { describe, it, expect } from "vitest";
import { buildIndex } from "../lib/ast/query";

// Prod-import test for lib/ast/query.ts. Builds the Layer 1 OID-keyed
// query index from a JSX source string. Used by the Layout Inspector
// (Phase 2) and intent resolver (Phase 3) to navigate the AST without
// re-parsing on every lookup.

describe("lib/ast/query — findById", () => {
  it("returns the QueryNode for a known oid", () => {
    const idx = buildIndex(`<div data-dropin-id="a" />`);
    const node = idx.findById("a");
    expect(node).not.toBeNull();
    expect(node!.oid).toBe("a");
    expect(node!.tagName).toBe("div");
    expect(node!.parentOid).toBeNull();
    expect(node!.childrenOids).toEqual([]);
  });

  it("returns null for an unknown oid", () => {
    const idx = buildIndex(`<div data-dropin-id="a" />`);
    expect(idx.findById("missing")).toBeNull();
  });

  it("returns null for an empty source", () => {
    const idx = buildIndex("");
    expect(idx.findById("a")).toBeNull();
  });
});

describe("lib/ast/query — parent", () => {
  it("returns null for a root element", () => {
    const idx = buildIndex(`<div data-dropin-id="root" />`);
    expect(idx.parent("root")).toBeNull();
  });

  it("returns the immediate parent's QueryNode", () => {
    const idx = buildIndex(`
      <div data-dropin-id="parent">
        <span data-dropin-id="child" />
      </div>
    `);
    const parent = idx.parent("child");
    expect(parent).not.toBeNull();
    expect(parent!.oid).toBe("parent");
  });

  it("walks through non-OID intermediates to find the OID-bearing parent", () => {
    // <div data-dropin-id="P"><div><span data-dropin-id="C"/></div></div>
    // The unwrapped <div> has no OID — visit() carries P's OID as
    // parentOid for C, which is exactly what we want.
    const idx = buildIndex(`
      <div data-dropin-id="P">
        <div>
          <span data-dropin-id="C" />
        </div>
      </div>
    `);
    expect(idx.parent("C")!.oid).toBe("P");
  });

  it("returns null for an unknown oid", () => {
    const idx = buildIndex(`<div data-dropin-id="a" />`);
    expect(idx.parent("missing")).toBeNull();
  });
});

describe("lib/ast/query — children", () => {
  it("returns empty list for a leaf", () => {
    const idx = buildIndex(`<div data-dropin-id="leaf" />`);
    expect(idx.children("leaf")).toEqual([]);
  });

  it("returns immediate children in document order", () => {
    const idx = buildIndex(`
      <div data-dropin-id="P">
        <span data-dropin-id="A" />
        <span data-dropin-id="B" />
        <span data-dropin-id="C" />
      </div>
    `);
    const kids = idx.children("P");
    expect(kids.map((k) => k.oid)).toEqual(["A", "B", "C"]);
  });

  it("does NOT include grandchildren", () => {
    const idx = buildIndex(`
      <div data-dropin-id="P">
        <div data-dropin-id="A">
          <span data-dropin-id="A1" />
        </div>
      </div>
    `);
    const kids = idx.children("P");
    expect(kids.map((k) => k.oid)).toEqual(["A"]);
  });

  it("returns [] for an unknown oid", () => {
    const idx = buildIndex(`<div data-dropin-id="a" />`);
    expect(idx.children("missing")).toEqual([]);
  });
});

describe("lib/ast/query — siblings (excludes self)", () => {
  it("returns sibling QueryNodes minus self", () => {
    const idx = buildIndex(`
      <div data-dropin-id="P">
        <span data-dropin-id="A" />
        <span data-dropin-id="B" />
        <span data-dropin-id="C" />
      </div>
    `);
    const sibs = idx.siblings("B");
    expect(sibs.map((s) => s.oid)).toEqual(["A", "C"]);
  });

  it("returns [] for a root with no parent", () => {
    const idx = buildIndex(`<div data-dropin-id="root" />`);
    expect(idx.siblings("root")).toEqual([]);
  });

  it("returns [] for an only child", () => {
    const idx = buildIndex(`
      <div data-dropin-id="P">
        <span data-dropin-id="only" />
      </div>
    `);
    expect(idx.siblings("only")).toEqual([]);
  });

  it("returns [] for an unknown oid", () => {
    const idx = buildIndex(`<div data-dropin-id="a" />`);
    expect(idx.siblings("missing")).toEqual([]);
  });
});

describe("lib/ast/query — ancestors (root → immediate parent)", () => {
  it("returns empty for a root element", () => {
    const idx = buildIndex(`<div data-dropin-id="root" />`);
    expect(idx.ancestors("root")).toEqual([]);
  });

  it("returns ancestors in root → parent order", () => {
    const idx = buildIndex(`
      <main data-dropin-id="root">
        <section data-dropin-id="L1">
          <article data-dropin-id="L2">
            <p data-dropin-id="L3" />
          </article>
        </section>
      </main>
    `);
    const a = idx.ancestors("L3");
    expect(a.map((n) => n.oid)).toEqual(["root", "L1", "L2"]);
  });

  it("returns immediate parent only for depth-1 element", () => {
    const idx = buildIndex(`
      <div data-dropin-id="root">
        <span data-dropin-id="child" />
      </div>
    `);
    expect(idx.ancestors("child").map((n) => n.oid)).toEqual(["root"]);
  });
});

describe("lib/ast/query — all() returns DFS-ordered list", () => {
  it("emits opening-tag-first across the document", () => {
    const idx = buildIndex(`
      <main data-dropin-id="M">
        <section data-dropin-id="S1">
          <p data-dropin-id="P1" />
        </section>
        <section data-dropin-id="S2">
          <p data-dropin-id="P2" />
        </section>
      </main>
    `);
    expect(idx.all().map((n) => n.oid)).toEqual([
      "M",
      "S1",
      "P1",
      "S2",
      "P2",
    ]);
  });

  it("returns [] for an empty source", () => {
    expect(buildIndex("").all()).toEqual([]);
  });

  it("returns [] when source has no JSX", () => {
    expect(buildIndex("const x = 1;").all()).toEqual([]);
  });
});

describe("lib/ast/query — fragments are layout-invisible", () => {
  it("treats fragment children as siblings under fragment's parent", () => {
    const idx = buildIndex(`
      <div data-dropin-id="P">
        <>
          <span data-dropin-id="A" />
          <span data-dropin-id="B" />
        </>
      </div>
    `);
    expect(idx.parent("A")!.oid).toBe("P");
    expect(idx.parent("B")!.oid).toBe("P");
    expect(idx.children("P").map((n) => n.oid)).toEqual(["A", "B"]);
  });
});

describe("lib/ast/query — tag names", () => {
  it("preserves lowercase intrinsic tags", () => {
    const idx = buildIndex(`<div data-dropin-id="a" />`);
    expect(idx.findById("a")!.tagName).toBe("div");
  });

  it("preserves capitalized component tags", () => {
    const idx = buildIndex(`<Card data-dropin-id="c" />`);
    expect(idx.findById("c")!.tagName).toBe("Card");
  });

  it("formats JSXMemberExpression as 'Outer.Inner'", () => {
    const idx = buildIndex(`<Card.Header data-dropin-id="h" />`);
    expect(idx.findById("h")!.tagName).toBe("Card.Header");
  });

  it("formats nested member expressions as 'A.B.C'", () => {
    const idx = buildIndex(`<A.B.C data-dropin-id="n" />`);
    expect(idx.findById("n")!.tagName).toBe("A.B.C");
  });
});

describe("lib/ast/query — duplicate OID handling (first-occurrence wins for entry)", () => {
  it("indexes only the first element entry on duplicate oids", () => {
    const idx = buildIndex(`
      <main>
        <div data-dropin-id="dup">
          <span data-dropin-id="first-child" />
        </div>
        <div data-dropin-id="dup">
          <span data-dropin-id="second-child" />
        </div>
      </main>
    `);
    const node = idx.findById("dup");
    expect(node).not.toBeNull();
    // Both real children get linked under the FIRST dup's entry — the
    // second-occurrence wrapper is dropped from the index, but its
    // descendants still register with parentOid="dup" (the first one).
    // This is intentional for the upstream-fix-only-not-yet-fixed
    // duplicate-OID injector bug: the index keeps moving even when the
    // wrapper duplicates.
    expect(node!.childrenOids).toContain("first-child");
    expect(node!.childrenOids).toContain("second-child");
  });

  it("only registers the first dup in all() — later dups dropped", () => {
    const idx = buildIndex(`
      <main>
        <div data-dropin-id="dup" />
        <div data-dropin-id="dup" />
      </main>
    `);
    const dups = idx.all().filter((n) => n.oid === "dup");
    expect(dups.length).toBe(1);
  });
});

describe("lib/ast/query — parse failure recovery", () => {
  it("returns an empty-index shell on heavy malformation", () => {
    // errorRecovery is on, but truly broken input still bails.
    // The shell index should still answer queries safely.
    const idx = buildIndex(`<<<<not jsx>>>>`);
    expect(idx.all()).toEqual([]);
    expect(idx.findById("anything")).toBeNull();
    expect(idx.parent("anything")).toBeNull();
    expect(idx.children("anything")).toEqual([]);
    expect(idx.siblings("anything")).toEqual([]);
    expect(idx.ancestors("anything")).toEqual([]);
  });
});

describe("lib/ast/query — element field references the AST node", () => {
  it("provides the JSXElement node through the .element field", () => {
    const idx = buildIndex(`<div data-dropin-id="a" />`);
    const node = idx.findById("a");
    expect(node).not.toBeNull();
    // Loose check: it's an object with .type === "JSXElement".
    const el = node!.element as any;
    expect(el).toBeTypeOf("object");
    expect(el.type).toBe("JSXElement");
  });
});
