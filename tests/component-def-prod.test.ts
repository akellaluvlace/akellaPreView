import { describe, it, expect } from "vitest";
import { findInlineComponentDefRootOid } from "../lib/ast/component-def";

// Prod-import test for lib/ast/component-def.ts. Used by the
// propagation toggle's "everywhere" mode to find a component's
// inline definition root so its className change can be applied at
// the definition site (not just the instance). No bench inlines this.

describe("lib/ast/component-def — supported definition shapes", () => {
  it("matches function declaration: function X() { return <Y/>; }", () => {
    const src = `
      function Card() {
        return <div data-dropin-id="root">x</div>;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("root");
  });

  it("matches arrow expression body: const X = () => <Y/>", () => {
    const src = `
      const Card = () => <div data-dropin-id="root">x</div>;
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("root");
  });

  it("matches arrow block body: const X = () => { return <Y/>; }", () => {
    const src = `
      const Card = () => {
        return <div data-dropin-id="root">x</div>;
      };
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("root");
  });

  it("matches function expression: const X = function() { return <Y/>; }", () => {
    const src = `
      const Card = function() {
        return <div data-dropin-id="root">x</div>;
      };
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("root");
  });
});

describe("lib/ast/component-def — exports", () => {
  it("matches `export function X() { return <Y/>; }`", () => {
    const src = `
      export function Card() {
        return <div data-dropin-id="root" />;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("root");
  });

  it("matches `export default function X() { return <Y/>; }`", () => {
    const src = `
      export default function Card() {
        return <div data-dropin-id="root" />;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("root");
  });

  it("matches `export const X = () => <Y/>`", () => {
    const src = `
      export const Card = () => <div data-dropin-id="root" />;
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("root");
  });
});

describe("lib/ast/component-def — fragment root", () => {
  it("returns the FIRST JSXElement inside a fragment root", () => {
    // Fragment can't have an OID itself; the first nested element is
    // the effective render root.
    const src = `
      function Card() {
        return (
          <>
            <span data-dropin-id="first" />
            <span data-dropin-id="second" />
          </>
        );
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("first");
  });

  it("returns null when fragment contains no JSXElements (only text)", () => {
    const src = `
      function Card() {
        return <>just text</>;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBeNull();
  });
});

describe("lib/ast/component-def — naming conventions", () => {
  it("rejects tags that don't start with a capital letter", () => {
    // Lowercase = HTML element, not a component. Pre-empt walk.
    const src = `
      function card() {
        return <div data-dropin-id="root" />;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "card")).toBeNull();
  });

  it("rejects empty tag name", () => {
    expect(findInlineComponentDefRootOid("function X(){}", "")).toBeNull();
  });

  it("rejects tag starting with digit", () => {
    expect(findInlineComponentDefRootOid("const X = () => <div/>", "1Foo")).toBeNull();
  });
});

describe("lib/ast/component-def — bail paths", () => {
  it("returns null when no definition exists for the requested tag", () => {
    const src = `
      function OtherCard() {
        return <div data-dropin-id="root" />;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBeNull();
  });

  it("returns null when the definition has no JSX root (returns null)", () => {
    const src = `
      function Card() {
        return null;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBeNull();
  });

  it("returns null when the definition returns a non-JSX value (string)", () => {
    const src = `
      function Card() {
        return "hello";
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBeNull();
  });

  it("returns null when block body has no return statement", () => {
    const src = `
      function Card() {
        const x = 1;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBeNull();
  });

  it("returns null when the JSX root has no data-dropin-id attribute", () => {
    const src = `
      function Card() {
        return <div className="x" />;
      }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBeNull();
  });

  it("returns null when source fails to parse", () => {
    // Heavy malformation. errorRecovery may still return a partial
    // AST, but the definition lookup should still fail to find a
    // proper FunctionDeclaration / VariableDeclaration with name === "Card".
    const src = `function Card() { return <div`;
    expect(findInlineComponentDefRootOid(src, "Card")).toBeNull();
  });
});

describe("lib/ast/component-def — multiple definitions", () => {
  it("finds the matching definition by name even when other components exist", () => {
    const src = `
      function Other() { return <p data-dropin-id="other" />; }
      function Card() { return <div data-dropin-id="card-root" />; }
      function Third() { return <span data-dropin-id="third" />; }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("card-root");
    expect(findInlineComponentDefRootOid(src, "Other")).toBe("other");
    expect(findInlineComponentDefRootOid(src, "Third")).toBe("third");
  });

  it("differentiates between similarly-named components", () => {
    const src = `
      function Card() { return <div data-dropin-id="card-root" />; }
      function CardHeader() { return <div data-dropin-id="header-root" />; }
    `;
    expect(findInlineComponentDefRootOid(src, "Card")).toBe("card-root");
    expect(findInlineComponentDefRootOid(src, "CardHeader")).toBe("header-root");
  });
});
