import { describe, it, expect } from "vitest";
import { jsxElementHasExpressions } from "../lib/ast/patch-class-by-oid";

// Prod-import test for jsxElementHasExpressions (Phase 5 helper added
// 2026-05-18). The function drives the AiScopeChip's "Expressions will
// be baked in" warning that fires BEFORE the user submits an edit. The
// detection accuracy matters: false negatives leave the user surprised
// when their {label} becomes static text post-persistence; false
// positives leak the scary warning onto every selection.

const OID = "data-dropin-id";

function src(jsx: string): string {
  return `export default function X() { return ${jsx}; }`;
}

describe("jsxElementHasExpressions — detects expression children", () => {
  it("detects {expression} text in direct children", () => {
    const code = src(`<button ${OID}="t1">Hi {label}</button>`);
    expect(jsxElementHasExpressions(code, "t1")).toBe(true);
  });

  it("detects expression in a descendant element (deep walk)", () => {
    const code = src(
      `<div ${OID}="t1"><span><strong>{name}</strong></span></div>`,
    );
    expect(jsxElementHasExpressions(code, "t1")).toBe(true);
  });

  it("detects conditional render via expression", () => {
    const code = src(
      `<div ${OID}="t1">{count > 0 && <span>more</span>}</div>`,
    );
    expect(jsxElementHasExpressions(code, "t1")).toBe(true);
  });

  it("detects .map() over array", () => {
    const code = src(
      `<ul ${OID}="t1">{items.map(i => <li key={i}>{i}</li>)}</ul>`,
    );
    expect(jsxElementHasExpressions(code, "t1")).toBe(true);
  });
});

describe("jsxElementHasExpressions — false negatives", () => {
  it("returns false when element has only string children", () => {
    const code = src(`<button ${OID}="t1">Click me</button>`);
    expect(jsxElementHasExpressions(code, "t1")).toBe(false);
  });

  it("returns false when only element children (no text expressions)", () => {
    const code = src(
      `<div ${OID}="t1"><span>A</span><span>B</span></div>`,
    );
    expect(jsxElementHasExpressions(code, "t1")).toBe(false);
  });

  it("returns false for attribute-only expressions (className={...})", () => {
    // Attribute expressions don't represent bake-in risk on outerHTML
    // replacement — they're re-emitted as string-form by the converter.
    const code = src(
      `<button ${OID}="t1" className={isActive ? 'on' : 'off'}>Hi</button>`,
    );
    expect(jsxElementHasExpressions(code, "t1")).toBe(false);
  });
});

describe("jsxElementHasExpressions — graceful degradation", () => {
  it("returns false when source parse fails", () => {
    const broken = "this is not valid JSX {{{";
    expect(jsxElementHasExpressions(broken, "t1")).toBe(false);
  });

  it("returns false when OID is not found", () => {
    const code = src(`<button ${OID}="other">Hi</button>`);
    expect(jsxElementHasExpressions(code, "missing")).toBe(false);
  });

  it("returns false for empty expression containers", () => {
    // Empty {} is rare but valid JSX — treat as no risk since nothing
    // gets baked in.
    const code = src(`<div ${OID}="t1">{ }</div>`);
    expect(jsxElementHasExpressions(code, "t1")).toBe(false);
  });
});

describe("jsxElementHasExpressions — finds OID at any depth", () => {
  it("locates target nested several levels deep", () => {
    const code = src(`
      <main>
        <section>
          <div>
            <button ${OID}="deep">Click {label}</button>
          </div>
        </section>
      </main>
    `);
    expect(jsxElementHasExpressions(code, "deep")).toBe(true);
  });
});
