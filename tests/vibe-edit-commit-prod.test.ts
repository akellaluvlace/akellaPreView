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
    borderRadius: "",
    inlineStyle: "",
    classes: "",
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
    borderRadius: "",
    inlineStyle: "",
    classes: "",
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

const SVG_HTML_FIXTURE =
  `<!doctype html><html><head></head><body>` +
  `<header>top</header>` +
  `<svg viewBox="0 0 24 24"><path d="M0 0" /></svg>` +
  `<p>after</p>` +
  `</body></html>`;
const SVG_PATH_HTML = [1, 1];

const SVG_JSX_FIXTURE = `function App() {
  return (
    <div>
      <svg data-dropin-id="icon-1" viewBox="0 0 24 24"><path d="M1 1" /></svg>
    </div>
  );
}`;

describe("buildVibeCommit — outer (icon swap)", () => {
  it("HTML mode: replaces svg outer via patchHtmlOuter", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: SVG_HTML_FIXTURE,
      old: htmlInfo({
        path: "body > svg",
        htmlPath: SVG_PATH_HTML,
        tag: "svg",
        kind: "icon",
        text: "",
      }),
      next: { outer: `<svg viewBox="0 0 16 16"><circle r="8" /></svg>` },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain(`<svg viewBox="0 0 16 16"><circle r="8" /></svg>`);
    expect(out.source).not.toContain(`<path d="M0 0" />`);
    // Surrounding bytes preserved.
    expect(out.source).toContain(`<header>top</header>`);
    expect(out.source).toContain(`<p>after</p>`);
  });

  it("JSX mode: replaces svg outer via patchJsxOuterByOid and re-injects OID", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: SVG_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > svg",
        oid: "icon-1",
        tag: "svg",
        kind: "icon",
        text: "",
      }),
      next: { outer: `<svg viewBox="0 0 16 16"><circle /></svg>` },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain(
      `<svg data-dropin-id="icon-1" viewBox="0 0 16 16"><circle /></svg>`,
    );
    expect(out.source).not.toContain(`<path d="M1 1" />`);
  });

  it("JSX mode: bails (unchanged) when oid is null", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: SVG_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > svg",
        oid: null,
        tag: "svg",
        kind: "icon",
        text: "",
      }),
      next: { outer: `<svg></svg>` },
    });
    expect(out.unchanged).toBe(true);
    expect(out.source).toBe(SVG_JSX_FIXTURE);
  });

  it("HTML mode: bails (unchanged) when htmlPath is null", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: SVG_HTML_FIXTURE,
      old: htmlInfo({
        path: "body > svg",
        htmlPath: null,
        tag: "svg",
        kind: "icon",
        text: "",
      }),
      next: { outer: `<svg></svg>` },
    });
    expect(out.unchanged).toBe(true);
    expect(out.source).toBe(SVG_HTML_FIXTURE);
  });

  it("returns unchanged when newOuter is empty", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: SVG_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > svg",
        oid: "icon-1",
        tag: "svg",
        kind: "icon",
        text: "",
      }),
      next: { outer: "" },
    });
    // Empty string is treated as "no swap intent" — same as text=""
    // semantics elsewhere: it would commit an empty patch, which the
    // patcher rejects. Net result: unchanged.
    expect(out.unchanged).toBe(true);
  });
});

const TYPO_HTML_FIXTURE =
  `<!doctype html><html><head></head><body>` +
  `<header>top</header>` +
  `<h2 class="text-xl font-bold leading-tight">Headline</h2>` +
  `<p>after</p>` +
  `</body></html>`;
const TYPO_PATH_HTML = [1, 1];

const TYPO_JSX_FIXTURE = `function App() {
  return (
    <div>
      <h2 data-dropin-id="head-1" className="text-xl font-bold leading-tight">Headline</h2>
    </div>
  );
}`;

describe("buildVibeCommit — classes (typography)", () => {
  it("HTML mode: rewrites class attribute via patchHtmlClass", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: TYPO_HTML_FIXTURE,
      old: htmlInfo({
        path: "body > h2",
        htmlPath: TYPO_PATH_HTML,
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-xl font-bold leading-tight",
      }),
      next: { classes: "text-2xl font-bold leading-tight" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain(`class="text-2xl font-bold leading-tight"`);
    expect(out.source).not.toContain(`class="text-xl`);
    // Surrounding bytes unchanged.
    expect(out.source).toContain(`<header>top</header>`);
    expect(out.source).toContain(`<p>after</p>`);
  });

  it("JSX mode: rewrites className via patchJsxClassByOid", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: TYPO_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-xl font-bold leading-tight",
      }),
      next: { classes: "text-3xl font-extrabold tracking-wide" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).toContain(
      `className="text-3xl font-extrabold tracking-wide"`,
    );
  });

  it("returns unchanged when classes match the old snapshot", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: TYPO_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-xl font-bold leading-tight",
      }),
      next: { classes: "text-xl font-bold leading-tight" },
    });
    expect(out.unchanged).toBe(true);
  });

  it("JSX mode: bails (unchanged) when oid is null", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: TYPO_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: null,
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-xl",
      }),
      next: { classes: "text-2xl" },
    });
    expect(out.unchanged).toBe(true);
    expect(out.source).toBe(TYPO_JSX_FIXTURE);
  });

  it("supports empty classes (removes the className attribute)", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: TYPO_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-xl font-bold leading-tight",
      }),
      next: { classes: "" },
    });
    expect(out.unchanged).toBe(false);
    expect(out.source).not.toContain(`className=`);
  });
});
