// Prod-import tests for the multi-root JSX insert wrapper. Guards against
// "Adjacent JSX elements must be wrapped" blanking the preview when a font /
// pattern / shadow insert (comment + <link> + <style>) lands at the cursor.

import { describe, it, expect } from "vitest";
import { wrapMultiRootJsxInsert } from "../lib/asset-library/wrap-insert";
import { buildFontInsert } from "../lib/asset-library/insert-font";

describe("wrapMultiRootJsxInsert", () => {
  it("wraps a multi-node JSX payload in a Fragment", () => {
    const payload = `{/* Google Font */}\n<link rel="stylesheet" href="/x" />\n<style>{\`body{}\`}</style>`;
    const out = wrapMultiRootJsxInsert(payload, "jsx");
    expect(out.startsWith("<>")).toBe(true);
    expect(out.endsWith("</>")).toBe(true);
    expect(out).toContain("<link");
    expect(out).toContain("<style>");
  });

  it("leaves a single-node JSX payload unchanged", () => {
    const payload = `<img src="/x.jpg" alt="a" />`;
    expect(wrapMultiRootJsxInsert(payload, "jsx")).toBe(payload);
  });

  it("never wraps in HTML mode (sibling nodes are valid there)", () => {
    const payload = `<!-- font -->\n<link href="/x" />\n<style>body{}</style>`;
    expect(wrapMultiRootJsxInsert(payload, "html")).toBe(payload);
  });

  it("the real font insert is multi-node and gets wrapped in JSX, valid as a single node", () => {
    const font: any = {
      family: "Inter",
      category: "sans-serif",
      variants: ["400", "700"],
    };
    const built = buildFontInsert(font, "jsx", {
      weights: ["400", "700"],
      applyMode: "global",
    });
    const wrapped = wrapMultiRootJsxInsert(built, "jsx");
    expect(wrapped.startsWith("<>")).toBe(true);
    // The wrapped form must itself be a single valid JSX node — i.e. exactly
    // one top-level node after wrapping.
    expect(wrapMultiRootJsxInsert(wrapped, "jsx")).toBe(wrapped);
  });
});
