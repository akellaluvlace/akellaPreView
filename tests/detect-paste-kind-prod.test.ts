// Prod-import tests for playground HTML/JSX paste detection. Guards the
// demo symptom "pasted HTML doesn't render" — AI output that isn't a bare
// <!DOCTYPE> doc (fragments, fenced, comment-prefixed) must still be routed
// to the HTML pipeline, while half-typed JSX must NEVER swap kind.

import { describe, it, expect } from "vitest";
import {
  stripDetectionNoise,
  detectKindByPrefix,
  detectFragmentKind,
} from "../lib/detect-paste-kind";

describe("stripDetectionNoise", () => {
  it("strips a leading markdown html fence", () => {
    expect(stripDetectionNoise("```html\n<!DOCTYPE html><html></html>")).toBe(
      "<!DOCTYPE html><html></html>",
    );
  });
  it("strips a bare fence", () => {
    expect(stripDetectionNoise("```\n<section></section>")).toBe(
      "<section></section>",
    );
  });
  it("strips leading HTML comments", () => {
    expect(stripDetectionNoise("<!-- generated -->\n<!DOCTYPE html>")).toBe(
      "<!DOCTYPE html>",
    );
  });
  it("leaves plain code untouched", () => {
    expect(stripDetectionNoise("function App(){}")).toBe("function App(){}");
  });
});

describe("detectKindByPrefix", () => {
  it("detects a full HTML doc", () => {
    expect(detectKindByPrefix("<!DOCTYPE html>\n<html></html>")).toBe("html");
    expect(detectKindByPrefix("<html><body></body></html>")).toBe("html");
  });
  it("detects an HTML doc behind a markdown fence", () => {
    expect(detectKindByPrefix("```html\n<!DOCTYPE html>\n<html></html>")).toBe(
      "html",
    );
  });
  it("detects an HTML doc behind a leading comment", () => {
    expect(detectKindByPrefix("<!-- v0 export -->\n<!DOCTYPE html>")).toBe(
      "html",
    );
  });
  it("detects JSX by keyword prefix", () => {
    expect(detectKindByPrefix("function App() { return <div/>; }")).toBe("jsx");
    expect(detectKindByPrefix("import React from 'react';")).toBe("jsx");
    expect(detectKindByPrefix('"use client";\nexport default App')).toBe("jsx");
  });
  it("returns null on an ambiguous fragment (defers to fragment detection)", () => {
    expect(detectKindByPrefix("<section><h1>Hi</h1></section>")).toBe(null);
  });
  it("returns null for half-typed JSX so it never swaps under the user", () => {
    expect(detectKindByPrefix("<div classN")).toBe(null);
  });
});

describe("detectFragmentKind", () => {
  it("flips an HTML fragment with an unclosed void tag to html", () => {
    const frag = `<section class="hero"><img src="images/x.jpg"><h1>Hi</h1></section>`;
    expect(detectFragmentKind(frag)).toBe("html");
  });
  it("flips a fragment with raw HTML comment children to html", () => {
    const frag = `<div><!-- nav --><nav><a href="/">Home</a></nav></div>`;
    expect(detectFragmentKind(frag)).toBe("html");
  });
  it("leaves a valid JSX fragment as jsx (returns null)", () => {
    const jsx = `<div className="p-4"><h1>Hi {name}</h1></div>`;
    expect(detectFragmentKind(jsx)).toBe(null);
  });
  it("does not flip markup that parses as both (defaults to jsx)", () => {
    // <div><p>hi</p></div> is valid JSX and valid HTML — stay on jsx default.
    expect(detectFragmentKind("<div><p>hi</p></div>")).toBe(null);
  });
  it("never flips half-typed JSX", () => {
    // Incomplete but JSX-signalled input must not become html.
    expect(detectFragmentKind("<div className=")).toBe(null);
  });
  it("returns null for non-markup", () => {
    expect(detectFragmentKind("const x = 1;")).toBe(null);
  });
});
