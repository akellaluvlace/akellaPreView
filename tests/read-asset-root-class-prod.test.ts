import { describe, it, expect } from "vitest";
import { readAssetRootClass } from "../lib/ast/read-class-by-oid";

// Phase F — companion to `readJsxClassByOid`. The everywhere-mode swap
// handler needs the new asset's ROOT className (without an OID, since
// the asset is fresh user input) to infer its capacity via
// `inferCapacityFromClasses` for the cross-instance preflight check.
//
// Asset text is parsed under a `(<>...</>);` wrapper so multi-root assets
// are valid JSX. The "root" is the FIRST top-level JSXElement under the
// fragment.

describe("readAssetRootClass — pure read", () => {
  it("returns the root element's className for a single-root asset", () => {
    expect(
      readAssetRootClass(`<div className="bg-red-500 p-4">x</div>`),
    ).toBe("bg-red-500 p-4");
  });

  it("returns the legacy `class` attribute when className is absent", () => {
    expect(readAssetRootClass(`<div class="foo">x</div>`)).toBe("foo");
  });

  it("returns null when the root has no className/class attribute", () => {
    expect(readAssetRootClass(`<div>x</div>`)).toBeNull();
  });

  it("returns null when className is an expression (className={cn(...)})", () => {
    expect(
      readAssetRootClass(`<div className={cn("a","b")}>x</div>`),
    ).toBeNull();
  });

  it("returns the FIRST top-level element's className for a multi-root asset", () => {
    // `(<>` <A><B>` </>);` — A is the first.
    expect(
      readAssetRootClass(
        `<a className="A">x</a><b className="B">y</b>`,
      ),
    ).toBe("A");
  });

  it("returns null on parse failure", () => {
    expect(readAssetRootClass(`{{not jsx{{`)).toBeNull();
  });

  it("returns empty string for `className=\"\"`", () => {
    expect(readAssetRootClass(`<div className="">x</div>`)).toBe("");
  });

  it("returns null when input has no JSX content (text only)", () => {
    expect(readAssetRootClass(`just text`)).toBeNull();
  });

  it("trims whitespace at boundaries before parsing", () => {
    expect(
      readAssetRootClass(`   \n  <div className="trimmed">x</div>  \n  `),
    ).toBe("trimmed");
  });
});
