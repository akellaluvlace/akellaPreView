import { describe, it, expect } from "vitest";
import { buildVibeCommit } from "../lib/vibe-edit/commit";
import type { VibeElementInfo } from "../lib/vibe-edit/types";

const HTML_FIXTURE = `<!doctype html><html><body>
<h1>Original heading</h1>
<p>Original paragraph</p>
<img src="/old.jpg" alt="old alt" />
<a href="/old">link text</a>
</body></html>`;

const JSX_FIXTURE = `function App() {
  return (
    <div>
      <h1 data-dropin-id="aaaaa1">Original heading</h1>
      <p data-dropin-id="aaaaa2">Original paragraph</p>
      <img data-dropin-id="aaaaa3" src="/old.jpg" alt="old alt" />
      <a data-dropin-id="aaaaa4" href="/old">link text</a>
    </div>
  );
}`;

// Element-index chains from <html> for the HTML_FIXTURE. Body is
// child #1 of <html> (head is #0). Inside body the elements are h1,
// p, img, a in order — indices 0..3.
const PATH_H1 = [1, 0];
const PATH_P = [1, 1];
const PATH_IMG = [1, 2];
const PATH_A = [1, 3];

function htmlInfo(over: Partial<VibeElementInfo>): VibeElementInfo {
  return {
    path: "body > h1",
    htmlPath: PATH_H1,
    oid: null,
    tag: "h1",
    kind: "heading",
    text: "Original heading",
    src: null,
    alt: null,
    href: null,
    textColor: "",
    bgColor: "",
    ...over,
  };
}

function jsxInfo(over: Partial<VibeElementInfo>): VibeElementInfo {
  return {
    path: "div > h1",
    htmlPath: null,
    oid: "aaaaa1",
    tag: "h1",
    kind: "heading",
    text: "Original heading",
    src: null,
    alt: null,
    href: null,
    textColor: "",
    bgColor: "",
    ...over,
  };
}

describe("buildVibeCommit — HTML mode", () => {
  it("rewrites text content for headings", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: htmlInfo({}),
      next: { text: "New heading" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain("<h1>New heading</h1>");
    expect(out.source).not.toContain("Original heading");
  });

  it("rewrites image src + alt", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: htmlInfo({
        path: "body > img",
        htmlPath: PATH_IMG,
        tag: "img",
        kind: "image",
        text: "",
        src: "/old.jpg",
        alt: "old alt",
      }),
      next: { src: "/new.jpg", alt: "new alt" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain('src="/new.jpg"');
    expect(out.source).toContain('alt="new alt"');
    expect(out.source).not.toContain("/old.jpg");
  });

  it("rewrites link href", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: htmlInfo({
        path: "body > a",
        htmlPath: PATH_A,
        tag: "a",
        kind: "link",
        text: "link text",
        href: "/old",
      }),
      next: { href: "/new" },
    });
    expect(out.source).toContain('href="/new"');
  });

  it("returns unchanged=true when next is identical to old", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: htmlInfo({
        path: "body > p",
        htmlPath: PATH_P,
        tag: "p",
        kind: "text",
        text: "Original paragraph",
      }),
      next: { text: "Original paragraph" },
    });
    expect(out.unchanged).toBe(true);
    expect(out.source).toBe(HTML_FIXTURE);
  });

  it("escapes HTML entities when writing text", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: htmlInfo({
        path: "body > p",
        htmlPath: PATH_P,
        tag: "p",
        kind: "text",
        text: "Original paragraph",
      }),
      next: { text: "5 < 10 & 3 > 2" },
    });
    expect(out.source).toContain("5 &lt; 10 &amp; 3 &gt; 2");
  });

  it("ignores undefined next fields", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: htmlInfo({}),
      next: {},
    });
    expect(out.unchanged).toBe(true);
    expect(out.source).toBe(HTML_FIXTURE);
  });
});

describe("buildVibeCommit — JSX mode", () => {
  it("rewrites text by OID when available", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: jsxInfo({}),
      next: { text: "New heading" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain(">New heading<");
  });

  it("rewrites image attrs by OID", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: jsxInfo({
        path: "div > img",
        oid: "aaaaa3",
        tag: "img",
        kind: "image",
        text: "",
        src: "/old.jpg",
        alt: "old alt",
      }),
      next: { src: "/new.jpg" },
    });
    expect(out.source).toContain('src="/new.jpg"');
  });

  it("rewrites link href by OID", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: jsxInfo({
        path: "div > a",
        oid: "aaaaa4",
        tag: "a",
        kind: "link",
        text: "link text",
        href: "/old",
      }),
      next: { href: "/new" },
    });
    expect(out.source).toContain('href="/new"');
  });

  it("returns unchanged when patcher reports no diff", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: jsxInfo({
        path: "div > p",
        oid: "aaaaa2",
        tag: "p",
        kind: "text",
        text: "Original paragraph",
      }),
      next: {},
    });
    expect(out.unchanged).toBe(true);
  });

  it("returns unchanged when oid missing in JSX mode", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: jsxInfo({ oid: null }),
      next: { text: "would-be-new" },
    });
    expect(out.unchanged).toBe(true);
  });

  it("applies multiple field changes in one call", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: jsxInfo({
        path: "div > img",
        oid: "aaaaa3",
        tag: "img",
        kind: "image",
        text: "",
        src: "/old.jpg",
        alt: "old alt",
      }),
      next: { src: "/x.jpg", alt: "new alt" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain('src="/x.jpg"');
    expect(out.source).toContain('alt="new alt"');
  });
});
