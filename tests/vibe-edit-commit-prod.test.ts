import { describe, it, expect } from "vitest";
import {
  buildVibeCommit,
  type VibeCommitResult,
} from "../lib/vibe-edit/commit";
import type { VibeElementInfo } from "../lib/vibe-edit/types";

// Narrowing helper. Phase 2 migrated buildVibeCommit from
// { unchanged, source } to a discriminated union — `source` only lives
// on the "ok" arm. Asserting via the helper both fails the test on a
// wrong-kind result AND narrows the type for the follow-on `.source`
// assertions, keeping the assertion-style flat.
function expectOk(
  r: VibeCommitResult,
): asserts r is { kind: "ok"; source: string } {
  if (r.kind !== "ok") {
    throw new Error(`expected kind="ok", got "${r.kind}"`);
  }
}

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
    expectOk(out);
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
    expectOk(out);
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
    expectOk(out);
    expect(out.source).toContain('href="/new"');
  });

  it("returns no-op when next is identical to old", () => {
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
    expect(out.kind).toBe("no-op");
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
    expectOk(out);
    expect(out.source).toContain("5 &lt; 10 &amp; 3 &gt; 2");
  });

  it("ignores undefined next fields (no-op)", () => {
    const out = buildVibeCommit({
      mode: "html",
      source: HTML_FIXTURE,
      old: htmlInfo({}),
      next: {},
    });
    expect(out.kind).toBe("no-op");
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
    expectOk(out);
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
    expectOk(out);
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
    expectOk(out);
    expect(out.source).toContain('href="/new"');
  });

  it("returns no-op when patcher reports no diff", () => {
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
    expect(out.kind).toBe("no-op");
  });

  it("returns bail (missing-oid) when JSX mode lacks oid", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: JSX_FIXTURE,
      old: jsxInfo({ oid: null }),
      next: { text: "would-be-new" },
    });
    expect(out).toEqual({ kind: "bail", reason: "missing-oid" });
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
    expectOk(out);
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
    expectOk(out);
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
    expectOk(out);
    expect(out.source).toContain(
      `<svg data-dropin-id="icon-1" viewBox="0 0 16 16"><circle /></svg>`,
    );
    expect(out.source).not.toContain(`<path d="M1 1" />`);
  });

  it("JSX mode: returns bail (missing-oid) when oid is null", () => {
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
    expect(out).toEqual({ kind: "bail", reason: "missing-oid" });
  });

  it("HTML mode: returns bail (missing-html-path) when htmlPath is null", () => {
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
    expect(out).toEqual({ kind: "bail", reason: "missing-html-path" });
  });

  it("returns no-op when newOuter is empty", () => {
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
    // patcher rejects. Net result: no-op.
    expect(out.kind).toBe("no-op");
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
    expectOk(out);
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
    expectOk(out);
    expect(out.source).toContain(
      `className="text-3xl font-extrabold tracking-wide"`,
    );
  });

  it("returns no-op when classes match the old snapshot", () => {
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
    expect(out.kind).toBe("no-op");
  });

  it("JSX mode: returns bail (missing-oid) when oid is null (classes change)", () => {
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
    expect(out).toEqual({ kind: "bail", reason: "missing-oid" });
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
    expectOk(out);
    expect(out.source).not.toContain(`className=`);
  });
});

const STYLE_JSX_FIXTURE = `function App() {
  return (
    <div>
      <h2 data-dropin-id="head-1" className="text-red-500 bg-blue-500 rounded-md p-4">Headline</h2>
    </div>
  );
}`;

const STYLE_JSX_NO_CLASSES = `function App() {
  return (
    <div>
      <p data-dropin-id="p-1">Plain paragraph</p>
    </div>
  );
}`;

describe("buildVibeCommit — styleDelta (JSX persistence)", () => {
  it("translates color delta to text-[#hex] and patches className", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: STYLE_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-red-500 bg-blue-500 rounded-md p-4",
      }),
      next: { styleDelta: { color: "rgb(0, 255, 0)" } },
    });
    expectOk(out);
    expect(out.source).toContain(`text-[#00ff00]`);
    expect(out.source).not.toContain(`text-red-500`);
    // Untouched bits.
    expect(out.source).toContain(`bg-blue-500`);
    expect(out.source).toContain(`rounded-md`);
    expect(out.source).toContain(`p-4`);
  });

  it("translates color + bg + radius delta in one call", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: STYLE_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-red-500 bg-blue-500 rounded-md p-4",
      }),
      next: {
        styleDelta: {
          color: "#000000",
          backgroundColor: "rgb(255, 255, 255)",
          borderRadius: "16px",
        },
      },
    });
    expectOk(out);
    expect(out.source).toContain(`text-[#000000]`);
    expect(out.source).toContain(`bg-[#ffffff]`);
    expect(out.source).toContain(`rounded-[16px]`);
    expect(out.source).not.toContain(`text-red-500`);
    expect(out.source).not.toContain(`bg-blue-500`);
    expect(out.source).not.toContain(`rounded-md`);
  });

  it("returns no-op when styleDelta is empty", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: STYLE_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-red-500 bg-blue-500 rounded-md p-4",
      }),
      next: { styleDelta: {} },
    });
    expect(out.kind).toBe("no-op");
  });

  it("transparent color: strips text colour, no add", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: STYLE_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-red-500 bg-blue-500 rounded-md p-4",
      }),
      next: { styleDelta: { color: "transparent" } },
    });
    expectOk(out);
    expect(out.source).not.toContain(`text-red-500`);
    expect(out.source).not.toMatch(/text-\[/);
    expect(out.source).toContain(`bg-blue-500`);
  });

  it("0px borderRadius: strips rounded classes, no add", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: STYLE_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-red-500 bg-blue-500 rounded-md p-4",
      }),
      next: { styleDelta: { borderRadius: "0px" } },
    });
    expectOk(out);
    expect(out.source).not.toContain(`rounded-md`);
    expect(out.source).not.toMatch(/rounded-\[/);
  });

  it("works on element with no existing className (creates one)", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: STYLE_JSX_NO_CLASSES,
      old: jsxInfo({
        path: "div > p",
        oid: "p-1",
        tag: "p",
        kind: "text",
        text: "Plain paragraph",
        classes: "",
      }),
      next: { styleDelta: { color: "#ff8800" } },
    });
    expectOk(out);
    expect(out.source).toContain(`className="text-[#ff8800]"`);
  });

  it("HTML mode ignores styleDelta (no-op — uses next.style for inline-style writeback)", () => {
    const html =
      `<!doctype html><html><head></head><body>` +
      `<h2 class="text-red-500">Hi</h2>` +
      `</body></html>`;
    const out = buildVibeCommit({
      mode: "html",
      source: html,
      old: htmlInfo({
        path: "body > h2",
        htmlPath: [1, 0],
        tag: "h2",
        kind: "heading",
        text: "Hi",
        classes: "text-red-500",
      }),
      next: { styleDelta: { color: "#000000" } },
    });
    // HTML mode ignores styleDelta — class wasn't touched.
    expect(out.kind).toBe("no-op");
  });

  it("JSX mode: returns bail (missing-oid) when oid is null (styleDelta change)", () => {
    const out = buildVibeCommit({
      mode: "jsx",
      source: STYLE_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: null,
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-red-500",
      }),
      next: { styleDelta: { color: "#000000" } },
    });
    expect(out).toEqual({ kind: "bail", reason: "missing-oid" });
  });
});

describe("buildVibeCommit — styleDelta reads CURRENT classes (M3 hardening)", () => {
  // Audit M3: pre-fix, styleDelta computed its strip+add against
  // old.classes — fine when only ONE of next.classes / next.styleDelta
  // was set per commit (Workspace maintains the invariant) but fragile
  // for a future caller that batches both. Post-fix reads current class
  // bytes from source after the next.classes patch lands.

  it("when both next.classes and next.styleDelta are set, styleDelta strips against the patched classes", () => {
    // Initial: text-red-500 (gets replaced via next.classes with
    // text-blue-500), then styleDelta color rgb(0,255,0) should strip
    // the just-patched text-blue-500 and add text-[#00ff00]. Pre-fix
    // bug: styleDelta read old.classes = "text-red-500" → stripped
    // text-red-500 (already gone) → text-blue-500 survived → final
    // source had BOTH text-blue-500 AND text-[#00ff00]. Post-fix the
    // strip operates against text-blue-500 (the current value) and
    // correctly removes it.
    const out = buildVibeCommit({
      mode: "jsx",
      source: STYLE_JSX_FIXTURE,
      old: jsxInfo({
        path: "div > h2",
        oid: "head-1",
        tag: "h2",
        kind: "heading",
        text: "Headline",
        classes: "text-red-500 bg-blue-500 rounded-md p-4",
      }),
      next: {
        classes: "text-blue-500 bg-blue-500 rounded-md p-4",
        styleDelta: { color: "rgb(0, 255, 0)" },
      },
    });
    expectOk(out);
    // The final source should reflect the styleDelta's resolution —
    // no text-blue-500 (stripped by styleDelta) and the arbitrary class.
    expect(out.source).toContain("text-[#00ff00]");
    expect(out.source).not.toContain("text-blue-500");
    expect(out.source).not.toContain("text-red-500");
  });
});

describe("buildVibeCommit — bail semantics (Phase 2 SF-M6)", () => {
  // Crisp dedicated tests for the bail kinds — the surrounding test
  // groups also exercise these reasons via various next-field shapes,
  // but these two are the single source of truth that the reason
  // strings are stable for the Workspace toast routing.

  it("JSX mode with oid=null returns bail reason 'missing-oid' regardless of next fields", () => {
    const inputs = [
      { text: "anything" },
      { src: "/new.jpg" },
      { classes: "text-2xl" },
      { outer: "<span>foo</span>" },
      { styleDelta: { color: "#abcdef" } },
    ];
    for (const next of inputs) {
      const out = buildVibeCommit({
        mode: "jsx",
        source: JSX_FIXTURE,
        old: jsxInfo({ oid: null }),
        next,
      });
      expect(out).toEqual({ kind: "bail", reason: "missing-oid" });
    }
  });

  it("HTML mode with htmlPath=null returns bail reason 'missing-html-path' regardless of next fields", () => {
    const inputs = [
      { text: "anything" },
      { src: "/new.jpg" },
      { classes: "text-2xl" },
      { outer: "<span>foo</span>" },
    ];
    for (const next of inputs) {
      const out = buildVibeCommit({
        mode: "html",
        source: HTML_FIXTURE,
        old: htmlInfo({ htmlPath: null }),
        next,
      });
      expect(out).toEqual({ kind: "bail", reason: "missing-html-path" });
    }
  });
});
