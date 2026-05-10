// Prod-import tests for the OID-keyed text + attribute patchers
// (siblings of patchJsxClassByOid in the same file). The vibe-edit
// flow calls these on commit; they need to handle the cases the
// loc-based patchJsxText / patchJsxAttr already cover, plus OID
// not-found and parse-error bails.

import { describe, it, expect } from "vitest";
import {
  patchJsxTextByOid,
  patchJsxAttrByOid,
} from "../lib/ast/patch-class-by-oid";

describe("patchJsxTextByOid", () => {
  it("rewrites text content of a heading", () => {
    const src = `function App() {
  return <h1 data-dropin-id="aaaaa1">Hello</h1>;
}`;
    const out = patchJsxTextByOid(src, "aaaaa1", "Goodbye");
    expect(out.changed).toBe(true);
    expect(out.source).toContain(">Goodbye<");
    expect(out.source).not.toContain(">Hello<");
    expect(out.reason).toBeNull();
  });

  it("rewrites text content of a paragraph with surrounding markup", () => {
    const src = `function App() {
  return (
    <div>
      <h1 data-dropin-id="aaaaa1">Title</h1>
      <p data-dropin-id="aaaaa2">Body text</p>
    </div>
  );
}`;
    const out = patchJsxTextByOid(src, "aaaaa2", "New body");
    expect(out.changed).toBe(true);
    expect(out.source).toContain(">New body<");
    expect(out.source).toContain(">Title<"); // sibling untouched
  });

  it("escapes JSX-special chars in new text", () => {
    const src = `<p data-dropin-id="aaaaa1">x</p>`;
    const out = patchJsxTextByOid(src, "aaaaa1", "5 < 10 & 3 > 2");
    expect(out.changed).toBe(true);
    expect(out.source).toContain("5 &lt; 10 &amp; 3 &gt; 2");
  });

  it("returns no-change when text already matches", () => {
    const src = `<p data-dropin-id="aaaaa1">Same</p>`;
    const out = patchJsxTextByOid(src, "aaaaa1", "Same");
    expect(out.changed).toBe(false);
    expect(out.source).toBe(src);
  });

  it("bails on self-closing element (no text slot)", () => {
    const src = `<img data-dropin-id="aaaaa1" src="/x" />`;
    const out = patchJsxTextByOid(src, "aaaaa1", "anything");
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("self-closing");
  });

  it("bails when OID not found", () => {
    const src = `<p data-dropin-id="other">x</p>`;
    const out = patchJsxTextByOid(src, "missing", "y");
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("not found");
  });

  it("bails on parse error", () => {
    const src = `<p data-dropin-id="aaaaa1" {{{}>broken`;
    const out = patchJsxTextByOid(src, "aaaaa1", "y");
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("parse failed");
  });

  it("bails when element has non-text children (component or expression)", () => {
    const src = `<p data-dropin-id="aaaaa1"><span>nested</span></p>`;
    const out = patchJsxTextByOid(src, "aaaaa1", "y");
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("non-text");
  });
});

describe("patchJsxAttrByOid", () => {
  it("rewrites existing string-literal attribute", () => {
    const src = `<img data-dropin-id="aaaaa1" src="/old.jpg" alt="x" />`;
    const out = patchJsxAttrByOid(src, "aaaaa1", "src", "/new.jpg");
    expect(out.changed).toBe(true);
    expect(out.source).toContain('src="/new.jpg"');
    expect(out.source).not.toContain("/old.jpg");
  });

  it("inserts attribute when missing", () => {
    const src = `<img data-dropin-id="aaaaa1" src="/x" />`;
    const out = patchJsxAttrByOid(src, "aaaaa1", "alt", "new alt");
    expect(out.changed).toBe(true);
    expect(out.source).toContain('alt="new alt"');
  });

  it("rewrites href on anchor", () => {
    const src = `<a data-dropin-id="aaaaa1" href="/old">link</a>`;
    const out = patchJsxAttrByOid(src, "aaaaa1", "href", "/new");
    expect(out.changed).toBe(true);
    expect(out.source).toContain('href="/new"');
  });

  it("escapes double quotes in value", () => {
    const src = `<img data-dropin-id="aaaaa1" src="/x" />`;
    const out = patchJsxAttrByOid(src, "aaaaa1", "alt", 'a "quoted" word');
    expect(out.changed).toBe(true);
    expect(out.source).toContain('alt="a &quot;quoted&quot; word"');
  });

  it("returns no-change when value already matches", () => {
    const src = `<img data-dropin-id="aaaaa1" src="/x" />`;
    const out = patchJsxAttrByOid(src, "aaaaa1", "src", "/x");
    expect(out.changed).toBe(false);
  });

  it("bails on expression-form attribute (dynamic)", () => {
    const src = `<img data-dropin-id="aaaaa1" src={dynamic} />`;
    const out = patchJsxAttrByOid(src, "aaaaa1", "src", "/new");
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("expression");
  });

  it("bails when OID not found", () => {
    const src = `<img data-dropin-id="other" src="/x" />`;
    const out = patchJsxAttrByOid(src, "missing", "src", "/new");
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("not found");
  });

  it("bails on parse error", () => {
    const src = `<img data-dropin-id="aaaaa1" {{{}>`;
    const out = patchJsxAttrByOid(src, "aaaaa1", "src", "/new");
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("parse failed");
  });

  it("scopes correctly when multiple elements share parent", () => {
    const src = `<div>
      <img data-dropin-id="a" src="/one" alt="one" />
      <img data-dropin-id="b" src="/two" alt="two" />
    </div>`;
    const out = patchJsxAttrByOid(src, "b", "alt", "TWO!");
    expect(out.changed).toBe(true);
    expect(out.source).toContain('alt="TWO!"');
    expect(out.source).toContain('alt="one"'); // unchanged
  });
});
