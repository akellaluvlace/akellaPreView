// Prod-import tests for the OID-keyed text + attribute patchers
// (siblings of patchJsxClassByOid in the same file). The vibe-edit
// flow calls these on commit; they need to handle the cases the
// loc-based patchJsxText / patchJsxAttr already cover, plus OID
// not-found and parse-error bails.

import { describe, it, expect } from "vitest";
import {
  patchJsxTextByOid,
  patchJsxAttrByOid,
  patchJsxOuterByOid,
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

describe("patchJsxOuterByOid", () => {
  it("replaces a self-closing svg verbatim and re-injects the OID", () => {
    const src = `function App() {
  return <svg data-dropin-id="aaaaa1" width="24" height="24"><path d="M1 1" /></svg>;
}`;
    const out = patchJsxOuterByOid(
      src,
      "aaaaa1",
      `<svg width="32" height="32"><circle r="5" /></svg>`,
    );
    expect(out.changed).toBe(true);
    // New svg landed AND the OID was injected so OID addressing survives.
    expect(out.source).toContain(
      `<svg data-dropin-id="aaaaa1" width="32" height="32"><circle r="5" /></svg>`,
    );
    // Old element is gone.
    expect(out.source).not.toContain(`<path d="M1 1" />`);
    expect(out.reason).toBeNull();
  });

  it("does not double-inject OID when the new outer already carries one", () => {
    const src = `<svg data-dropin-id="aaaaa1"><path /></svg>`;
    const out = patchJsxOuterByOid(
      src,
      "aaaaa1",
      `<svg data-dropin-id="aaaaa1" width="40"><rect /></svg>`,
    );
    expect(out.changed).toBe(true);
    // Verify only ONE data-dropin-id occurrence in the new svg.
    const matches = out.source.match(/data-dropin-id/g) || [];
    expect(matches.length).toBe(1);
    expect(out.source).toContain(`width="40"`);
  });

  it("preserves surrounding bytes (sibling + parent untouched)", () => {
    const src = `function App() {
  return (
    <div>
      <h1 data-dropin-id="title">Title</h1>
      <svg data-dropin-id="icon-1" viewBox="0 0 24 24"><path d="M0 0" /></svg>
      <p data-dropin-id="caption">Caption</p>
    </div>
  );
}`;
    const out = patchJsxOuterByOid(
      src,
      "icon-1",
      `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="4" /></svg>`,
    );
    expect(out.changed).toBe(true);
    expect(out.source).toContain(`<h1 data-dropin-id="title">Title</h1>`);
    expect(out.source).toContain(`<p data-dropin-id="caption">Caption</p>`);
    expect(out.source).toContain(
      `<svg data-dropin-id="icon-1" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4" /></svg>`,
    );
  });

  it("returns no-change when the new outer matches the existing bytes after OID injection", () => {
    const existing = `<svg data-dropin-id="aaaaa1" width="24"><path /></svg>`;
    const src = `function App() { return ${existing}; }`;
    // Pass the new outer WITHOUT the OID — the patcher should inject it
    // and notice the resulting bytes match the existing element.
    const out = patchJsxOuterByOid(src, "aaaaa1", `<svg width="24"><path /></svg>`);
    expect(out.changed).toBe(false);
    expect(out.source).toBe(src);
    expect(out.reason).toContain("no change");
  });

  it("bails when oid is not found", () => {
    const src = `<svg data-dropin-id="real"><path /></svg>`;
    const out = patchJsxOuterByOid(src, "missing", `<svg></svg>`);
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("not found");
  });

  it("bails on parse error", () => {
    const src = `<svg data-dropin-id="aaaaa1" {{{>`;
    const out = patchJsxOuterByOid(src, "aaaaa1", `<svg></svg>`);
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("parse failed");
  });

  it("bails when the new outer is empty/whitespace", () => {
    const src = `<svg data-dropin-id="aaaaa1"><path /></svg>`;
    const out = patchJsxOuterByOid(src, "aaaaa1", `   \n  `);
    expect(out.changed).toBe(false);
    expect(out.reason).toContain("empty");
  });

  it("works on non-self-closing element (paired tags)", () => {
    const src = `<div><svg data-dropin-id="aaaaa1"><path d="M1 1" /></svg></div>`;
    const out = patchJsxOuterByOid(
      src,
      "aaaaa1",
      `<svg viewBox="0 0 16 16"></svg>`,
    );
    expect(out.changed).toBe(true);
    expect(out.source).toContain(
      `<svg data-dropin-id="aaaaa1" viewBox="0 0 16 16"></svg>`,
    );
    expect(out.source).not.toContain(`<path d="M1 1" />`);
  });

  it("scopes correctly when multiple SVGs share parent", () => {
    const src = `<div>
      <svg data-dropin-id="a" width="10"><path d="A" /></svg>
      <svg data-dropin-id="b" width="20"><path d="B" /></svg>
    </div>`;
    const out = patchJsxOuterByOid(
      src,
      "b",
      `<svg width="30"><circle /></svg>`,
    );
    expect(out.changed).toBe(true);
    expect(out.source).toContain(`<svg data-dropin-id="b" width="30">`);
    // Sibling untouched.
    expect(out.source).toContain(`<svg data-dropin-id="a" width="10"><path d="A" /></svg>`);
  });

  it("injects OID even when the new outer leads with whitespace", () => {
    const src = `<svg data-dropin-id="aaaaa1"><path /></svg>`;
    const out = patchJsxOuterByOid(
      src,
      "aaaaa1",
      `   <svg width="40"></svg>`,
    );
    expect(out.changed).toBe(true);
    expect(out.source).toContain(`<svg data-dropin-id="aaaaa1" width="40">`);
  });
});
