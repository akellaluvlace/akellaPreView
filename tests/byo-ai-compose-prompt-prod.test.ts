import { describe, it, expect } from "vitest";
import { composeSwapPrompt } from "../lib/byo-ai/compose-prompt";

describe("composeSwapPrompt — shape", () => {
  it("includes the target outerHtml in a code fence", () => {
    const prompt = composeSwapPrompt({
      fullSource: "<html><body></body></html>",
      kind: "html",
      targetOuterHtml: '<button class="old">Submit</button>',
      referenceHtml: '<button class="new">Click</button>',
    });
    expect(prompt).toContain('<button class="old">Submit</button>');
  });

  it("includes the reference HTML in a code fence", () => {
    const prompt = composeSwapPrompt({
      fullSource: "<html></html>",
      kind: "html",
      targetOuterHtml: "<button>a</button>",
      referenceHtml: '<button class="cool">b</button>',
    });
    expect(prompt).toContain('<button class="cool">b</button>');
  });

  it("includes the full source in a code fence", () => {
    const fullSource =
      "<!DOCTYPE html><html><body><div>HELLO_WORLD_SENTINEL</div></body></html>";
    const prompt = composeSwapPrompt({
      fullSource,
      kind: "html",
      targetOuterHtml: "<button>a</button>",
      referenceHtml: "<button>b</button>",
    });
    expect(prompt).toContain("HELLO_WORLD_SENTINEL");
  });

  it("uses 'html' fence language for HTML mode", () => {
    const prompt = composeSwapPrompt({
      fullSource: "<html></html>",
      kind: "html",
      targetOuterHtml: "<a>x</a>",
      referenceHtml: "<a>y</a>",
    });
    // The fences around target + full source should be ```html.
    // (Reference is always ```html regardless of mode.)
    const htmlFenceCount = (prompt.match(/```html/g) ?? []).length;
    expect(htmlFenceCount).toBeGreaterThanOrEqual(3);
  });

  it("uses 'jsx' fence language for JSX mode", () => {
    const prompt = composeSwapPrompt({
      fullSource: "export default () => null;",
      kind: "jsx",
      targetOuterHtml: "<button>x</button>",
      referenceHtml: "<button>y</button>",
    });
    // Target + full source should be ```jsx; reference stays ```html
    expect(prompt).toMatch(/```jsx\n/);
    expect(prompt).toMatch(/```html\n/);
  });
});

describe("composeSwapPrompt — instruction content", () => {
  it("instructs to keep text content", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt.toLowerCase()).toContain("keep");
    expect(prompt.toLowerCase()).toContain("text");
  });

  it("instructs to keep meaningful attributes", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt.toLowerCase()).toMatch(/href|src|alt/);
  });

  it("instructs to return the COMPLETE file", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt).toMatch(/complete file/i);
  });

  it("instructs to use a single code block", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt.toLowerCase()).toContain("single code block");
  });

  it("instructs to leave other elements untouched", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt.toLowerCase()).toContain("untouched");
  });
});

describe("composeSwapPrompt — file type label", () => {
  it("describes file as HTML for kind=html", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt).toMatch(/I have a HTML file/);
  });

  it("describes file as JSX for kind=jsx", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "jsx",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt).toMatch(/I have a JSX file/);
  });
});

describe("composeSwapPrompt — trims input snippets", () => {
  it("trims targetOuterHtml whitespace", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "   <a>x</a>   \n\n",
      referenceHtml: "y",
    });
    // Trimmed snippet should appear without leading/trailing whitespace
    expect(prompt).toContain("<a>x</a>");
    // The fenced block specifically — check that <a> is immediately
    // after the opening fence line (no extra padding lines).
    expect(prompt).toMatch(/```html\n<a>x<\/a>\n```/);
  });

  it("trims referenceHtml whitespace", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "  \n  <b>y</b>  \n  ",
    });
    expect(prompt).toMatch(/```html\n<b>y<\/b>\n```/);
  });

  it("does NOT trim fullSource (could affect rendering)", () => {
    // We want the FULL file verbatim — leading/trailing whitespace
    // could be meaningful (e.g. trailing newline at EOF is a common
    // convention). Don't strip it.
    const fullSource = "\n<html></html>\n\n";
    const prompt = composeSwapPrompt({
      fullSource,
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "y",
    });
    expect(prompt).toContain(fullSource);
  });
});

describe("composeSwapPrompt — JSX guardrails (C2/H2)", () => {
  it("forbids TypeScript syntax for JSX mode", () => {
    const prompt = composeSwapPrompt({
      fullSource: "export default () => null;",
      kind: "jsx",
      targetOuterHtml: "<button>x</button>",
      referenceHtml: "<button>y</button>",
    });
    expect(prompt.toLowerCase()).toContain("plain jsx, not typescript");
  });

  it("instructs not to touch style/config/const for JSX mode", () => {
    const prompt = composeSwapPrompt({
      fullSource: "export default () => null;",
      kind: "jsx",
      targetOuterHtml: "<button>x</button>",
      referenceHtml: "<button>y</button>",
    });
    expect(prompt.toLowerCase()).toContain("tailwind config");
    expect(prompt.toLowerCase()).toContain("top-level `const`");
  });

  it("does NOT include the TS guard for HTML mode", () => {
    const prompt = composeSwapPrompt({
      fullSource: "<html></html>",
      kind: "html",
      targetOuterHtml: "<button>x</button>",
      referenceHtml: "<button>y</button>",
    });
    expect(prompt.toLowerCase()).not.toContain("typescript");
  });

  it("instructs to return the COMPLETE file with no placeholders", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt.toLowerCase()).toContain("complete file");
    expect(prompt.toLowerCase()).toContain("placeholder");
  });
});

describe("composeSwapPrompt — reference HTML cleaning (H1)", () => {
  it("strips HTML comments from the reference", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "<!-- attribution: uiverse.io --><button>cool</button>",
    });
    expect(prompt).not.toContain("attribution");
    expect(prompt).toContain("<button>cool</button>");
  });

  it("caps oversized reference HTML + appends a truncation note", () => {
    const huge = "<div>" + "x".repeat(8000) + "</div>";
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: huge,
    });
    expect(prompt).toContain("reference truncated for length");
    // The full 8000-char blob should NOT be present verbatim.
    expect(prompt).not.toContain("x".repeat(8000));
  });

  it("leaves small reference HTML intact (no truncation note)", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: '<button class="cta">Click</button>',
    });
    expect(prompt).toContain('<button class="cta">Click</button>');
    expect(prompt).not.toContain("reference truncated");
  });
});
