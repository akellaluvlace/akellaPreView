import { describe, it, expect } from "vitest";
import { inferKind, type VibeKind } from "../lib/vibe-edit/kind";

describe("inferKind", () => {
  it("classifies headings", () => {
    for (const t of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
      expect(inferKind(t)).toBe<VibeKind>("heading");
    }
  });

  it("classifies text-bearing tags as text", () => {
    for (const t of [
      "p",
      "span",
      "li",
      "blockquote",
      "small",
      "figcaption",
      "td",
      "th",
      "label",
      "strong",
      "em",
      "code",
      "pre",
    ]) {
      expect(inferKind(t)).toBe<VibeKind>("text");
    }
  });

  it("classifies <img> as image", () => {
    expect(inferKind("img")).toBe<VibeKind>("image");
  });

  it("classifies <a> as link", () => {
    expect(inferKind("a")).toBe<VibeKind>("link");
  });

  it("classifies <button> as button", () => {
    expect(inferKind("button")).toBe<VibeKind>("button");
  });

  it("classifies <svg> as icon", () => {
    expect(inferKind("svg")).toBe<VibeKind>("icon");
    expect(inferKind("SVG")).toBe<VibeKind>("icon");
  });

  it("classifies role='button' on a div as button", () => {
    expect(inferKind("div", "button")).toBe<VibeKind>("button");
  });

  it("classifies <div>/<section>/etc as container", () => {
    for (const t of [
      "div",
      "section",
      "header",
      "footer",
      "main",
      "aside",
      "article",
      "nav",
    ]) {
      expect(inferKind(t)).toBe<VibeKind>("container");
    }
  });

  it("normalises tag case", () => {
    expect(inferKind("DIV")).toBe<VibeKind>("container");
    expect(inferKind("H1")).toBe<VibeKind>("heading");
    expect(inferKind("Img")).toBe<VibeKind>("image");
  });

  it("normalises role case", () => {
    expect(inferKind("div", "BUTTON")).toBe<VibeKind>("button");
  });

  it("falls back to container for unknown tags", () => {
    expect(inferKind("foobar")).toBe<VibeKind>("container");
    expect(inferKind("")).toBe<VibeKind>("container");
  });

  it("ignores undefined / null role gracefully", () => {
    expect(inferKind("div", undefined)).toBe<VibeKind>("container");
    expect(inferKind("div", null)).toBe<VibeKind>("container");
    expect(inferKind("h1", null)).toBe<VibeKind>("heading");
  });

  it("role='button' wins over tag classification", () => {
    expect(inferKind("h1", "button")).toBe<VibeKind>("button");
    expect(inferKind("p", "button")).toBe<VibeKind>("button");
  });
});
