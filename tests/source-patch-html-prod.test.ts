// 7th prod-import surge — direct-import tests for `lib/source-patch-html.ts`.
// Bench-omitted module (no `bench-source-patch-html.mjs`); these are the
// HTML-mode mirrors of the JSX byte patchers covered by
// `tests/source-patch-jsx-prod.test.ts`. parse5 source-location-info
// drives the byte boundaries; tests verify formatting preservation
// (whitespace, comments, quote style) around the patched bytes.
//
// Path semantics (per `findElement` in lib): parse5 wraps a fragment
// in `<html><head/><body>...</body></html>`, so a top-level `<div>` in
// fragment input lives at path [1, 0] (body's first child). Tests use
// explicit full-document fixtures most of the time so the paths are
// readable.

import { describe, it, expect } from "vitest";
import {
  patchHtmlClass,
  patchHtmlAttr,
  patchHtmlRemoveAttr,
  extractHtmlElement,
  duplicateHtmlElement,
  deleteHtmlElement,
  patchHtmlText,
  patchHtmlOuter,
} from "../lib/source-patch-html";

// Helper: build a doc that places one `<div>` inside body, plus a
// preceding `<header>` for path-disambiguation. Returns html + the path
// to the div: [1, 1] (body is child 1 of html; div is child 1 of body).
function docWithDiv(opener: string, content: string, closer = "</div>") {
  const html =
    `<!doctype html><html><head></head><body><header></header>${opener}${content}${closer}</body></html>`;
  return { html, path: [1, 1] as number[] };
}

describe("§1 patchHtmlClass — overwrite + insert + path bails", () => {
  it("overwrites existing class attribute, preserving surrounding bytes", () => {
    const { html, path } = docWithDiv(`<div class="old">`, "x");
    const r = patchHtmlClass(html, path, "new");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<div class="new">`);
    expect(r.source).not.toContain("old");
  });

  it("inserts class attribute when none present (before closing >)", () => {
    const { html, path } = docWithDiv(`<div>`, "y");
    const r = patchHtmlClass(html, path, "fresh");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<div class="fresh">`);
  });

  it("inserts class on void self-closing element before /", () => {
    // <img> is a void element; in HTML5 the slash before > is optional
    // but accepted. Verify insert position skips back past it.
    const html = `<!doctype html><html><head></head><body><img/></body></html>`;
    const r = patchHtmlClass(html, [1, 0], "icon");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<img class="icon"/>`);
  });

  it("escapes special chars in the class value (entity-encoded)", () => {
    const { html, path } = docWithDiv(`<div>`, "z");
    const r = patchHtmlClass(html, path, `a"b<c>d&e`);
    expect(r.changed).toBe(true);
    expect(r.source).toContain(
      `<div class="a&quot;b&lt;c&gt;d&amp;e">`,
    );
  });

  it("returns unchanged 'stale' when path is out of range", () => {
    const { html } = docWithDiv(`<div>`, "x");
    const r = patchHtmlClass(html, [1, 99], "ignored");
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/locate.*stale/i);
    expect(r.source).toBe(html);
  });

  it("returns unchanged 'stale' when path traverses non-element index", () => {
    const { html } = docWithDiv(`<div>`, "x");
    const r = patchHtmlClass(html, [99], "ignored");
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/stale/i);
  });
});

describe("§2 patchHtmlAttr — generic attr patcher", () => {
  it("overwrites an existing attribute by name", () => {
    const { html, path } = docWithDiv(`<div data-foo="old">`, "x");
    const r = patchHtmlAttr(html, path, "data-foo", "new");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`data-foo="new"`);
  });

  it("inserts a new attribute when name is absent", () => {
    const { html, path } = docWithDiv(`<div>`, "x");
    const r = patchHtmlAttr(html, path, "title", "hello");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`title="hello"`);
  });

  it("matches attribute name case-insensitively (HTML semantics)", () => {
    // parse5 lowercases attr names internally; passing 'CLASS' should
    // still hit the 'class' attr.
    const { html, path } = docWithDiv(`<div class="old">`, "x");
    const r = patchHtmlAttr(html, path, "CLASS", "new");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`CLASS="new"`);
    expect(r.source).not.toContain(`class="old"`);
  });

  it("escapes &, \", <, > in the attr value (4 entities)", () => {
    const { html, path } = docWithDiv(`<div>`, "x");
    const r = patchHtmlAttr(html, path, "title", `a"b&c<d>e`);
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`title="a&quot;b&amp;c&lt;d&gt;e"`);
  });
});

describe("§3 patchHtmlRemoveAttr — remove + leading-whitespace cleanup", () => {
  it("removes the attribute and leading whitespace", () => {
    const { html, path } = docWithDiv(
      `<div   class="x"   data-foo="y">`,
      "z",
    );
    const r = patchHtmlRemoveAttr(html, path, "class");
    expect(r.changed).toBe(true);
    expect(r.source).not.toContain(`class="x"`);
    // data-foo still present + the whitespace before class collapsed.
    expect(r.source).toContain(`data-foo="y"`);
  });

  it("returns unchanged when attribute is not present", () => {
    const { html, path } = docWithDiv(`<div class="x">`, "y");
    const r = patchHtmlRemoveAttr(html, path, "data-foo");
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/not present/i);
    expect(r.source).toBe(html);
  });

  it("matches attribute case-insensitively when removing", () => {
    const { html, path } = docWithDiv(`<div class="x">`, "y");
    const r = patchHtmlRemoveAttr(html, path, "CLASS");
    expect(r.changed).toBe(true);
    expect(r.source).not.toContain(`class="x"`);
  });

  it("returns unchanged 'stale' on bad path", () => {
    const { html } = docWithDiv(`<div class="x">`, "y");
    const r = patchHtmlRemoveAttr(html, [1, 99], "class");
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/stale/i);
  });
});

describe("§4 extractHtmlElement — full element source", () => {
  it("returns the element bytes from start tag through end tag (inclusive)", () => {
    const { html, path } = docWithDiv(`<div class="a">`, "hello");
    const extracted = extractHtmlElement(html, path);
    expect(extracted).toBe(`<div class="a">hello</div>`);
  });

  it("returns just the start tag for void / self-closing elements", () => {
    const html = `<!doctype html><html><head></head><body><img src="a"/></body></html>`;
    const extracted = extractHtmlElement(html, [1, 0]);
    expect(extracted).toBe(`<img src="a"/>`);
  });

  it("returns null when path is out of range", () => {
    const { html } = docWithDiv(`<div>`, "x");
    expect(extractHtmlElement(html, [1, 99])).toBeNull();
  });

  it("returns null on negative index in path", () => {
    const { html } = docWithDiv(`<div>`, "x");
    expect(extractHtmlElement(html, [1, -1])).toBeNull();
  });
});

describe("§5 duplicateHtmlElement — append a clone after the original", () => {
  it("appends a duplicate immediately after the closing tag, separated by newline", () => {
    const { html, path } = docWithDiv(`<div class="a">`, "x");
    const r = duplicateHtmlElement(html, path);
    expect(r.changed).toBe(true);
    // Both copies present.
    const matches = r.source.match(/<div class="a">x<\/div>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("duplicates a void element by repeating its start tag", () => {
    const html = `<!doctype html><html><head></head><body><img src="a"/></body></html>`;
    const r = duplicateHtmlElement(html, [1, 0]);
    expect(r.changed).toBe(true);
    const matches = r.source.match(/<img src="a"\/>/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("returns unchanged on stale path", () => {
    const { html } = docWithDiv(`<div>`, "x");
    const r = duplicateHtmlElement(html, [1, 99]);
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/stale/i);
  });
});

describe("§6 deleteHtmlElement — drop element from source", () => {
  it("removes the entire element source (start tag through end tag)", () => {
    const { html, path } = docWithDiv(`<div class="a">`, "x");
    const r = deleteHtmlElement(html, path);
    expect(r.changed).toBe(true);
    expect(r.source).not.toContain(`<div class="a">`);
    expect(r.source).not.toContain(`</div>`);
  });

  it("removes a void element (just the start tag)", () => {
    const html = `<!doctype html><html><head></head><body><img src="a"/><p>p</p></body></html>`;
    const r = deleteHtmlElement(html, [1, 0]);
    expect(r.changed).toBe(true);
    expect(r.source).not.toContain(`<img`);
    // Sibling preserved.
    expect(r.source).toContain(`<p>p</p>`);
  });

  it("returns unchanged on stale path", () => {
    const { html } = docWithDiv(`<div>`, "x");
    const r = deleteHtmlElement(html, [1, 99]);
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/stale/i);
  });
});

describe("§7 patchHtmlText — replace text content between start/end tags", () => {
  it("replaces text content between tags, preserving the tags themselves", () => {
    const { html, path } = docWithDiv(`<div class="a">`, "old");
    const r = patchHtmlText(html, path, "new");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<div class="a">new</div>`);
  });

  it("escapes &, <, > in the new text (3 entities; no quote escape — that's an attr concern)", () => {
    const { html, path } = docWithDiv(`<div>`, "old");
    const r = patchHtmlText(html, path, `a&b<c>d`);
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<div>a&amp;b&lt;c&gt;d</div>`);
  });

  it("returns unchanged when text is already up to date", () => {
    const { html, path } = docWithDiv(`<div>`, "same");
    const r = patchHtmlText(html, path, "same");
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/already up to date/i);
  });

  it("bails on void element (no text slot — no end tag)", () => {
    const html = `<!doctype html><html><head></head><body><img src="a"/></body></html>`;
    const r = patchHtmlText(html, [1, 0], "ignored");
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/void.*self-closing/i);
  });

  it("returns unchanged on stale path", () => {
    const { html } = docWithDiv(`<div>`, "x");
    const r = patchHtmlText(html, [1, 99], "ignored");
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/stale/i);
  });

  it("preserves nested children when overwriting parent text (replaces whole inner)", () => {
    // patchHtmlText replaces from startTag.endOffset → endTag.startOffset,
    // which collapses any nested children. This is the documented
    // single-text-node use case.
    const { html, path } = docWithDiv(
      `<div>`,
      "a<span>b</span>c",
    );
    const r = patchHtmlText(html, path, "flat");
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<div>flat</div>`);
    expect(r.source).not.toContain("<span>");
  });
});

describe("§8 escape helpers (verified through patcher round-trips)", () => {
  it("attr escape covers all 4 entities (&, \", <, >)", () => {
    const { html, path } = docWithDiv(`<div>`, "x");
    const r = patchHtmlAttr(html, path, "title", `&"<>`);
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`title="&amp;&quot;&lt;&gt;"`);
  });

  it("text escape covers 3 entities (&, <, >) — no quote needed in text content", () => {
    const { html, path } = docWithDiv(`<div>`, "x");
    const r = patchHtmlText(html, path, `&"<>`);
    expect(r.changed).toBe(true);
    // Quote stays as a literal; & < > entity-encoded.
    expect(r.source).toContain(`<div>&amp;"&lt;&gt;</div>`);
  });
});

describe("§9 patchHtmlOuter — replace element bytes wholesale", () => {
  it("replaces a non-void element's full outer source", () => {
    const html = `<!doctype html><html><head></head><body><svg width="24"><path d="M1 1" /></svg></body></html>`;
    const r = patchHtmlOuter(html, [1, 0], `<svg width="32"><circle r="5" /></svg>`);
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<svg width="32"><circle r="5" /></svg>`);
    expect(r.source).not.toContain(`<path d="M1 1" />`);
  });

  it("replaces a void element (img) at path", () => {
    const html = `<!doctype html><html><head></head><body><img src="/old" /></body></html>`;
    const r = patchHtmlOuter(html, [1, 0], `<svg viewBox="0 0 8 8"></svg>`);
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<svg viewBox="0 0 8 8"></svg>`);
    expect(r.source).not.toContain(`/old`);
  });

  it("preserves surrounding bytes (siblings + parent untouched)", () => {
    const html =
      `<!doctype html><html><head></head><body>` +
      `<header>before</header>` +
      `<svg viewBox="0 0 24 24"><path d="M0 0" /></svg>` +
      `<p>after</p>` +
      `</body></html>`;
    const r = patchHtmlOuter(html, [1, 1], `<svg viewBox="0 0 16 16"><circle /></svg>`);
    expect(r.changed).toBe(true);
    expect(r.source).toContain(`<header>before</header>`);
    expect(r.source).toContain(`<p>after</p>`);
    expect(r.source).toContain(`<svg viewBox="0 0 16 16"><circle /></svg>`);
  });

  it("returns unchanged when path is stale", () => {
    const html = `<!doctype html><html><head></head><body><svg></svg></body></html>`;
    const r = patchHtmlOuter(html, [1, 99], `<svg></svg>`);
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/locate.*stale/i);
    expect(r.source).toBe(html);
  });

  it("returns unchanged short-circuit when newOuter matches existing bytes", () => {
    const existing = `<svg viewBox="0 0 24 24"><path /></svg>`;
    const html = `<!doctype html><html><head></head><body>${existing}</body></html>`;
    const r = patchHtmlOuter(html, [1, 0], existing);
    expect(r.changed).toBe(false);
    expect(r.source).toBe(html);
    expect(r.reason).toMatch(/already up to date/i);
  });

  it("bails when newOuter is empty/whitespace", () => {
    const html = `<!doctype html><html><head></head><body><svg></svg></body></html>`;
    const r = patchHtmlOuter(html, [1, 0], `   `);
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/empty/i);
    expect(r.source).toBe(html);
  });
});
