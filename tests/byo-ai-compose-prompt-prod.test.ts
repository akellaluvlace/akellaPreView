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

  it("does NOT embed the full source (element-only prompt)", () => {
    // 2026-05-22 — element-only pivot. The prompt no longer sends the
    // whole file; the AI only needs the target + reference + returns
    // just the restyled element.
    const fullSource =
      "<!DOCTYPE html><html><body><div>HELLO_WORLD_SENTINEL</div></body></html>";
    const prompt = composeSwapPrompt({
      fullSource,
      kind: "html",
      targetOuterHtml: "<button>a</button>",
      referenceHtml: "<button>b</button>",
    });
    expect(prompt).not.toContain("HELLO_WORLD_SENTINEL");
  });

  it("uses 'html' fence language for HTML mode (target fence)", () => {
    const prompt = composeSwapPrompt({
      fullSource: "<html></html>",
      kind: "html",
      targetOuterHtml: "<a>x</a>",
      referenceHtml: "<a>y</a>",
    });
    // Target + reference fences are ```html for HTML mode.
    const htmlFenceCount = (prompt.match(/```html/g) ?? []).length;
    expect(htmlFenceCount).toBeGreaterThanOrEqual(2);
  });

  it("uses 'jsx' fence language for JSX mode", () => {
    const prompt = composeSwapPrompt({
      fullSource: "export default () => null;",
      kind: "jsx",
      targetOuterHtml: "<button>x</button>",
      referenceHtml: "<button>y</button>",
    });
    // Target fence is ```jsx; reference stays ```html
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

  it("instructs to return ONLY the single restyled element", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt.toLowerCase()).toMatch(/only the single restyled element/);
    expect(prompt.toLowerCase()).toContain("not a full file");
  });

  it("instructs to use one code block", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt.toLowerCase()).toContain("one code block");
  });
});

describe("composeSwapPrompt — element-only framing", () => {
  it("frames the task as restyling one element", () => {
    const prompt = composeSwapPrompt({
      fullSource: "x",
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "x",
    });
    expect(prompt.toLowerCase()).toContain("restyle one ui element");
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

  it("does NOT embed fullSource at all (element-only)", () => {
    const fullSource = "\nSENTINEL_FULL_SOURCE_42\n\n";
    const prompt = composeSwapPrompt({
      fullSource,
      kind: "html",
      targetOuterHtml: "x",
      referenceHtml: "y",
    });
    expect(prompt).not.toContain("SENTINEL_FULL_SOURCE_42");
  });
});

describe("composeSwapPrompt — JSX guardrails", () => {
  it("forbids TypeScript + tells the AI to use className for JSX mode", () => {
    const prompt = composeSwapPrompt({
      fullSource: "export default () => null;",
      kind: "jsx",
      targetOuterHtml: "<button>x</button>",
      referenceHtml: "<button>y</button>",
    });
    expect(prompt.toLowerCase()).toContain("plain jsx, not typescript");
    expect(prompt).toContain("className");
  });

  it("tells the AI to preserve data-dropin-id for JSX mode", () => {
    const prompt = composeSwapPrompt({
      fullSource: "export default () => null;",
      kind: "jsx",
      targetOuterHtml: "<button>x</button>",
      referenceHtml: "<button>y</button>",
    });
    expect(prompt.toLowerCase()).toContain("data-dropin-id");
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
