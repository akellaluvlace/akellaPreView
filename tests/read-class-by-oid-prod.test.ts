import { describe, it, expect } from "vitest";
import { readJsxClassByOid } from "../lib/ast/read-class-by-oid";

// Phase E proper — companion read for `patchJsxClassByOid`. The Workspace
// swap handler needs the swapped element's NEW classes (post-applySwap)
// to feed `applySwapFit`. Rather than have callers parse + walk the AST
// manually, this helper does the read in one call.
//
// Same parse + find-by-oid plumbing as the patcher; just returns the
// className string-literal value (or null on miss / non-literal).

describe("readJsxClassByOid — pure read", () => {
  it("returns the className value for a string-literal attribute", () => {
    const src = `export default function App(){return (<div data-dropin-id="oid-1" className="bg-red-500 text-white">x</div>);}`;
    expect(readJsxClassByOid(src, "oid-1")).toBe("bg-red-500 text-white");
  });

  it("returns the legacy `class` attribute value when className isn't present", () => {
    const src = `export default function App(){return (<div data-dropin-id="oid-2" class="bar">x</div>);}`;
    expect(readJsxClassByOid(src, "oid-2")).toBe("bar");
  });

  it("returns null when the element has no className attribute", () => {
    const src = `export default function App(){return (<div data-dropin-id="oid-3">x</div>);}`;
    expect(readJsxClassByOid(src, "oid-3")).toBeNull();
  });

  it("returns null when className uses an expression (className={cn(...)})", () => {
    const src = `export default function App(){return (<div data-dropin-id="oid-4" className={cn("a", "b")}>x</div>);}`;
    expect(readJsxClassByOid(src, "oid-4")).toBeNull();
  });

  it("returns null when the OID is not found", () => {
    const src = `export default function App(){return (<div data-dropin-id="oid-5" className="x">y</div>);}`;
    expect(readJsxClassByOid(src, "missing-oid")).toBeNull();
  });

  it("returns null on parse failure", () => {
    const src = `not actually javascript {{{`;
    expect(readJsxClassByOid(src, "any-oid")).toBeNull();
  });

  it("targets the named OID — multiple elements present", () => {
    const src = `export default function App(){return (<section data-dropin-id="parent" className="p-4"><div data-dropin-id="child" className="bg-blue-100">x</div></section>);}`;
    expect(readJsxClassByOid(src, "parent")).toBe("p-4");
    expect(readJsxClassByOid(src, "child")).toBe("bg-blue-100");
  });

  it("preserves multi-token className verbatim including inner whitespace runs", () => {
    const src = `export default function App(){return (<div data-dropin-id="oid-7" className="a   b\tc">x</div>);}`;
    expect(readJsxClassByOid(src, "oid-7")).toBe("a   b\tc");
  });

  it("returns empty string for `className=\"\"`", () => {
    const src = `export default function App(){return (<div data-dropin-id="oid-8" className="">x</div>);}`;
    expect(readJsxClassByOid(src, "oid-8")).toBe("");
  });

  it("returns null for boolean-shorthand `<X className />`", () => {
    const src = `export default function App(){return (<div data-dropin-id="oid-9" className />);}`;
    // Boolean shorthand has no string value — the read returns null
    // (the patcher's symmetric path overwrites this case to a string).
    expect(readJsxClassByOid(src, "oid-9")).toBeNull();
  });
});
