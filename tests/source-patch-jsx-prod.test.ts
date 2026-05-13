// Phase 5 §5 / audit-2026-05-04 medium-fix — direct-import test for
// `lib/source-patch-jsx.ts`. This is the byte-level patcher that the
// inspector + FocusEditor className edits all flow through (every
// slider tick → patchJsxClass → setCode). It's deliberately NOT an
// AST module — it does single-pass attribute tokenization on the
// opening-tag substring only, driven by JsxLoc coordinates emitted
// by the iframe's Babel loc plugin. Bench `bench-parse.mjs` covers
// some edges; this file covers the public API surface end-to-end.

import { describe, it, expect } from "vitest";
import {
  jsxSpans,
  patchJsxClass,
  patchJsxAttr,
  patchJsxRemoveAttr,
  patchJsxText,
  isClassNameDynamic,
  extractJsxElement,
  duplicateJsxElement,
  deleteJsxElement,
} from "../lib/source-patch-jsx";
import type { JsxLoc } from "../lib/iframe-bridge";

// Build a JsxLoc for one-line source. line is 1; col is the byte offset
// within the line. Caller passes openingStartIdx / openingEndIdx (just
// past the `>`) / elementEndIdx (past `</tag>` or `/>`).
function singleLineLoc(
  openingStartIdx: number,
  openingEndIdx: number,
  elementEndIdx: number,
): JsxLoc {
  return {
    kind: "jsx",
    startLine: 1,
    startCol: openingStartIdx,
    openEndLine: 1,
    openEndCol: openingEndIdx,
    endLine: 1,
    endCol: elementEndIdx,
  };
}

// Compute the loc for a single tag at the start of a one-line source.
function locFromSource(source: string): JsxLoc {
  const openingStart = 0;
  const openingEnd = source.indexOf(">") + 1;
  return singleLineLoc(openingStart, openingEnd, source.length);
}

describe("jsxSpans (production import)", () => {
  it("computes spans for a simple element", () => {
    const src = `<div className="x">y</div>`;
    const r = jsxSpans(src, locFromSource(src));
    expect(r).not.toBeNull();
    expect(r?.tagName).toBe("div");
    expect(r?.isSelfClosing).toBe(false);
    expect(r?.openingStart).toBe(0);
    expect(r?.openingEnd).toBe(src.indexOf(">") + 1);
    expect(r?.elementEnd).toBe(src.length);
  });

  it("recognizes self-closing elements", () => {
    const src = `<img src="x"/>`;
    const r = jsxSpans(src, locFromSource(src));
    expect(r?.tagName).toBe("img");
    expect(r?.isSelfClosing).toBe(true);
  });

  it("returns null on an invalid loc (out-of-bounds line)", () => {
    const src = `<div>x</div>`;
    const r = jsxSpans(src, {
      kind: "jsx",
      startLine: 99,
      startCol: 0,
      openEndLine: 99,
      openEndCol: 5,
      endLine: 99,
      endCol: 12,
    });
    expect(r).toBeNull();
  });

  it("returns null when the opening doesn't look like a JSX tag", () => {
    const src = `not a tag`;
    const r = jsxSpans(src, singleLineLoc(0, 5, src.length));
    expect(r).toBeNull();
  });

  it("captures hyphenated component names (e.g. data-* tags via parser)", () => {
    const src = `<my-tag>x</my-tag>`;
    const r = jsxSpans(src, locFromSource(src));
    expect(r?.tagName).toBe("my-tag");
  });
});

describe("patchJsxClass (production import)", () => {
  it("rewrites an existing className value", () => {
    const src = `<div className="old">x</div>`;
    const r = patchJsxClass(src, locFromSource(src), "new");
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="new"');
    expect(r.source).not.toContain('className="old"');
  });

  it("inserts a new className when none exists", () => {
    const src = `<div>x</div>`;
    const r = patchJsxClass(src, locFromSource(src), "fresh");
    expect(r.changed).toBe(true);
    expect(r.source).toContain('className="fresh"');
  });

  it("returns unchanged with reason when className is dynamic-expression", () => {
    const src = `<div className={cls}>x</div>`;
    const r = patchJsxClass(src, locFromSource(src), "new");
    expect(r.changed).toBe(false);
    expect(r.reason).toBeTruthy();
  });

  it("returns unchanged with reason on stale loc", () => {
    const src = `<div className="x">y</div>`;
    const staleLoc = singleLineLoc(0, 999, 999);
    const r = patchJsxClass(src, staleLoc, "new");
    expect(r.changed).toBe(false);
    expect(r.reason).toBeTruthy();
  });
});

describe("isClassNameDynamic (production import)", () => {
  it("returns true for className={expr}", () => {
    const src = `<div className={cls}>x</div>`;
    expect(isClassNameDynamic(src, locFromSource(src))).toBe(true);
  });

  it("returns false for className=\"static\"", () => {
    const src = `<div className="static">x</div>`;
    expect(isClassNameDynamic(src, locFromSource(src))).toBe(false);
  });

  it("returns false when no className attr at all", () => {
    const src = `<div>x</div>`;
    expect(isClassNameDynamic(src, locFromSource(src))).toBe(false);
  });

  it("returns false on stale loc (safe default — read is harmless)", () => {
    const src = `<div className={cls}>x</div>`;
    const staleLoc = singleLineLoc(0, 999, 999);
    expect(isClassNameDynamic(src, staleLoc)).toBe(false);
  });
});

describe("patchJsxAttr / patchJsxRemoveAttr (production import)", () => {
  it("patchJsxAttr writes a new value for an existing attr", () => {
    const src = `<a href="old">x</a>`;
    const r = patchJsxAttr(src, locFromSource(src), "href", "new");
    expect(r.changed).toBe(true);
    expect(r.source).toContain('href="new"');
  });

  it("patchJsxRemoveAttr removes an existing attr", () => {
    const src = `<a href="x" id="y">link</a>`;
    const r = patchJsxRemoveAttr(src, locFromSource(src), "href");
    expect(r.changed).toBe(true);
    expect(r.source).not.toContain("href=");
    expect(r.source).toContain('id="y"');
  });

  it("patchJsxRemoveAttr is a no-op when the attr is absent", () => {
    const src = `<a>link</a>`;
    const r = patchJsxRemoveAttr(src, locFromSource(src), "href");
    expect(r.changed).toBe(false);
    expect(r.reason).toBeTruthy();
  });
});

describe("patchJsxText (production import)", () => {
  it("rewrites text content between opening and closing tag", () => {
    const src = `<p>old text</p>`;
    const r = patchJsxText(src, locFromSource(src), "new text");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(">new text<");
    expect(r.source).not.toContain(">old text<");
  });

  it("bails on self-closing element (no text slot)", () => {
    const src = `<img src="x"/>`;
    const r = patchJsxText(src, locFromSource(src), "new");
    expect(r.changed).toBe(false);
    expect(r.reason).toBeTruthy();
  });
});

describe("extractJsxElement / duplicateJsxElement / deleteJsxElement (production import)", () => {
  it("extractJsxElement returns the element source bytes", () => {
    const src = `<p className="x">hello</p>`;
    const r = extractJsxElement(src, locFromSource(src));
    expect(r).toBe(src);
  });

  it("extractJsxElement returns null on stale loc", () => {
    const src = `<p>x</p>`;
    const r = extractJsxElement(src, singleLineLoc(0, 999, 999));
    expect(r).toBeNull();
  });

  it("duplicateJsxElement appends a verbatim copy after the original", () => {
    const src = `<p>x</p>`;
    const r = duplicateJsxElement(src, locFromSource(src));
    expect(r.changed).toBe(true);
    // Two copies of the element now appear in source.
    const copies = (r.source.match(/<p>x<\/p>/g) || []).length;
    expect(copies).toBe(2);
  });

  it("deleteJsxElement removes the element entirely", () => {
    const src = `<p>x</p>`;
    const r = deleteJsxElement(src, locFromSource(src));
    expect(r.changed).toBe(true);
    expect(r.source).toBe("");
  });
});
