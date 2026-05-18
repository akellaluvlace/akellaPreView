import { describe, it, expect } from "vitest";
import {
  findSectionScope,
  estimateTokens,
  formatTokenCount,
} from "../lib/ai-edit/scope";
import { makeFingerprint } from "../lib/ai-edit/fingerprint";
import { JSDOM } from "jsdom";

// Prod-import tests for lib/ai-edit/scope.ts + lib/ai-edit/fingerprint.ts.
// Scope uses a real DOM (jsdom) to exercise the walker; fingerprint is
// pure-string and doesn't need DOM.

function dom(html: string): Document {
  return new JSDOM(`<!doctype html><html><body>${html}</body></html>`).window.document;
}

describe("ai-edit scope — findSectionScope", () => {
  it("returns the section ancestor for an element inside one", () => {
    const doc = dom('<section class="hero"><button id="b">Hi</button></section>');
    const btn = doc.getElementById("b")!;
    const scope = findSectionScope(btn);
    expect(scope.tagName).toBe("SECTION");
  });

  it("returns header/footer/nav/aside/main/article semantic ancestors", () => {
    for (const tag of ["header", "footer", "nav", "aside", "main", "article"]) {
      const doc = dom(`<${tag}><span id="x">Hi</span></${tag}>`);
      const el = doc.getElementById("x")!;
      const scope = findSectionScope(el);
      expect(scope.tagName).toBe(tag.toUpperCase());
    }
  });

  it("matches role=region / banner / contentinfo", () => {
    const doc = dom(
      '<div role="region"><span id="r">x</span></div>' +
        '<div role="banner"><span id="b">x</span></div>' +
        '<div role="contentinfo"><span id="c">x</span></div>',
    );
    expect(findSectionScope(doc.getElementById("r")!).getAttribute("role")).toBe("region");
    expect(findSectionScope(doc.getElementById("b")!).getAttribute("role")).toBe("banner");
    expect(findSectionScope(doc.getElementById("c")!).getAttribute("role")).toBe("contentinfo");
  });

  it("matches class fingerprints (hero, features, pricing, etc.)", () => {
    for (const cls of [
      "hero",
      "features",
      "pricing",
      "cta",
      "testimonials",
      "bento",
      "footer",
      "navbar",
      "faq",
      "stats",
      "logos",
      "gallery",
    ]) {
      const doc = dom(`<div class="wrapper ${cls}"><span id="x">x</span></div>`);
      const el = doc.getElementById("x")!;
      const scope = findSectionScope(el);
      expect(scope.className).toContain(cls);
    }
  });

  it("does not match partial class tokens (heroku ≠ hero)", () => {
    const doc = dom('<div class="heroku-deploy"><span id="x">x</span></div>');
    const el = doc.getElementById("x")!;
    const scope = findSectionScope(el);
    // No semantic ancestor, no fingerprint match → falls back to
    // direct child of body, which here is the .heroku-deploy div.
    // (Confirms it didn't WALK PAST due to false-positive match.)
    expect(scope.className).toBe("heroku-deploy");
  });

  it("falls back to direct child of body when no semantic ancestor", () => {
    const doc = dom('<div class="x"><div class="y"><span id="s">x</span></div></div>');
    const el = doc.getElementById("s")!;
    const scope = findSectionScope(el);
    expect(scope.className).toBe("x");
  });

  it("returns the element itself when it IS a section", () => {
    const doc = dom('<section id="self">x</section>');
    const el = doc.getElementById("self")!;
    const scope = findSectionScope(el);
    expect(scope).toBe(el);
  });
});

describe("ai-edit scope — estimateTokens", () => {
  it("returns 0 for empty input", () => {
    expect(estimateTokens("")).toBe(0);
  });

  it("uses chars/3.5 ceiling", () => {
    expect(estimateTokens("x")).toBe(1);
    expect(estimateTokens("x".repeat(7))).toBe(2);
    expect(estimateTokens("x".repeat(350))).toBe(100);
  });

  it("scales linearly with length", () => {
    const small = estimateTokens("x".repeat(100));
    const big = estimateTokens("x".repeat(1000));
    expect(big).toBeGreaterThan(small * 9);
    expect(big).toBeLessThan(small * 11);
  });
});

describe("ai-edit scope — formatTokenCount", () => {
  it("returns exact integer for <1000", () => {
    expect(formatTokenCount(0)).toBe("0");
    expect(formatTokenCount(1)).toBe("1");
    expect(formatTokenCount(999)).toBe("999");
  });

  it("returns 1-decimal k-suffix for >=1000", () => {
    expect(formatTokenCount(1000)).toBe("1.0k");
    expect(formatTokenCount(1500)).toBe("1.5k");
    expect(formatTokenCount(2300)).toBe("2.3k");
    expect(formatTokenCount(10500)).toBe("10.5k");
  });
});

describe("ai-edit fingerprint — makeFingerprint", () => {
  it("returns tag-only when no classes", () => {
    expect(makeFingerprint("button", "")).toBe("button");
    expect(makeFingerprint("div", "  ")).toBe("div");
  });

  it("strips Tailwind utility chrome", () => {
    const fp = makeFingerprint(
      "div",
      "flex items-center justify-between gap-4 px-6 py-4 bg-white text-ink",
    );
    // All those are Tailwind utilities — nothing should survive past
    // the tag name.
    expect(fp).toBe("div");
  });

  it("preserves semantic class names (hero, cta-primary, navbar)", () => {
    const fp = makeFingerprint(
      "section",
      "hero relative min-h-screen flex items-center",
    );
    expect(fp).toContain("hero");
    expect(fp.startsWith("section")).toBe(true);
  });

  it("strips Tailwind variant chains (md:hover:bg-blue-500)", () => {
    const fp = makeFingerprint("button", "md:hover:bg-blue-500 cta-primary");
    expect(fp).toContain("cta-primary");
    expect(fp).not.toContain("md:hover");
  });

  it("strips arbitrary-value classes (bg-[#hex], text-[14px])", () => {
    const fp = makeFingerprint("div", "bg-[#FF4D2E] text-[14px] hero");
    expect(fp).toContain("hero");
    expect(fp).not.toContain("[#FF4D2E]");
    expect(fp).not.toContain("[14px]");
  });

  it("caps total length around 40 chars", () => {
    const fp = makeFingerprint(
      "div",
      "hero features pricing cta testimonials bento footer navbar faq stats logos",
    );
    expect(fp.length).toBeLessThanOrEqual(45);
  });
});
