// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { getElementPath, findElementByPath } from "../lib/vibe-edit/path";

function setBody(html: string): Document {
  document.body.innerHTML = html;
  return document;
}

describe("getElementPath", () => {
  it("returns 'body' for body itself", () => {
    setBody("<p>hi</p>");
    expect(getElementPath(document.body)).toBe("body");
  });

  it("uses id when present and stops walking", () => {
    setBody(`<div><p id="hero">x</p></div>`);
    const p = document.getElementById("hero")!;
    expect(getElementPath(p)).toBe("p#hero");
  });

  it("appends nth-of-type when ambiguous siblings exist", () => {
    setBody(`<div><p>a</p><p>b</p><p>c</p></div>`);
    const second = document.querySelectorAll("p")[1] as HTMLElement;
    expect(getElementPath(second)).toBe("div > p:nth-of-type(2)");
  });

  it("omits nth-of-type for unique sibling", () => {
    setBody(`<section><h1>title</h1><p>body</p></section>`);
    const h1 = document.querySelector("h1")!;
    expect(getElementPath(h1)).toBe("section > h1");
  });

  it("escapes ids that contain special CSS chars", () => {
    setBody(`<p id="my:id.with-dots">x</p>`);
    const p = document.querySelector("p")!;
    const path = getElementPath(p);
    expect(path).toContain("p#");
    // round-trip: the escaped id should be valid in querySelector
    expect(findElementByPath(document, path)).toBe(p);
  });

  it("handles empty / null / documentElement", () => {
    expect(getElementPath(null)).toBe("");
    expect(getElementPath(document.documentElement)).toBe("");
  });

  it("walks deeply nested ancestry", () => {
    setBody(`<main><section><div><h2>title</h2></div></section></main>`);
    const h2 = document.querySelector("h2")!;
    expect(getElementPath(h2)).toBe("main > section > div > h2");
  });
});

describe("findElementByPath", () => {
  it("returns null for empty path", () => {
    setBody("<p>x</p>");
    expect(findElementByPath(document, "")).toBeNull();
  });

  it("returns null for unparseable selector", () => {
    setBody("<p>x</p>");
    expect(findElementByPath(document, "p[")).toBeNull();
  });

  it("round-trips through getElementPath for nested structures", () => {
    setBody(
      `<main><section><div><h2>title</h2><p>a</p><p>b</p></div></section></main>`,
    );
    const targets = [
      document.querySelector("h2")!,
      document.querySelectorAll("p")[0] as HTMLElement,
      document.querySelectorAll("p")[1] as HTMLElement,
    ];
    for (const el of targets) {
      const path = getElementPath(el);
      expect(findElementByPath(document, path)).toBe(el);
    }
  });

  it("returns null when the element no longer exists at that path", () => {
    setBody(`<div><p>a</p></div>`);
    const path = "div > p:nth-of-type(2)";
    expect(findElementByPath(document, path)).toBeNull();
  });

  it("resolves the body itself via the literal 'body' path", () => {
    setBody(`<p>x</p>`);
    expect(findElementByPath(document, "body")).toBe(document.body);
  });
});
