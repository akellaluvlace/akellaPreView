// Prod-import tests for the parse-based JSX-root insert locator. Guards the
// palette/gradient "page-level insert" path: when the component's return form
// isn't `return (`, the old regex missed and dropped the <style> at the caret
// → blank. This must find the right offset for every return shape.

import { describe, it, expect } from "vitest";
import { findJsxRootInsertOffset } from "../lib/find-jsx-root-insert-offset";

function insert(source: string, marker = "[X]"): string | null {
  const off = findJsxRootInsertOffset(source);
  if (off === null) return null;
  return source.slice(0, off) + marker + source.slice(off);
}

describe("findJsxRootInsertOffset", () => {
  it("handles parenthesised `return (<div>`", () => {
    const out = insert(`function App(){ return (\n  <div className="x">\n    <h1>Hi</h1>\n  </div>\n); }`);
    expect(out).toContain(`<div className="x">[X]`);
  });

  it("handles un-parenthesised `return <div>`", () => {
    const out = insert(`function App(){ return <div className="y"><h1>Hi</h1></div>; }`);
    expect(out).toContain(`<div className="y">[X]`);
  });

  it("handles arrow-implicit return `() => <div>`", () => {
    const out = insert(`const App = () => <main id="root"><p>Hi</p></main>;\nexport default App;`);
    expect(out).toContain(`<main id="root">[X]`);
  });

  it("handles a fragment root `() => (<>`", () => {
    const out = insert(`const App = () => (\n  <>\n    <h1>Hi</h1>\n  </>\n);`);
    expect(out).toContain(`<>[X]`);
  });

  it("returns null when there is no JSX at all", () => {
    expect(findJsxRootInsertOffset(`const x = 1; export default x;`)).toBe(null);
  });

  it("returns null for a self-closing root that cannot take children", () => {
    expect(findJsxRootInsertOffset(`const App = () => <img src="/x" />;`)).toBe(null);
  });

  it("inserts at a position that keeps the source parseable as JSX", () => {
    const src = `export default function App(){\n  return (\n    <section>\n      <h1>Hi</h1>\n    </section>\n  );\n}`;
    const withStyle = src.slice(0, findJsxRootInsertOffset(src)!) +
      `\n<style>{\`.x{color:red}\`}</style>\n` +
      src.slice(findJsxRootInsertOffset(src)!);
    // The injected <style> sits as the first child of <section> — valid JSX.
    expect(withStyle).toContain("<section>\n<style>");
  });
});
