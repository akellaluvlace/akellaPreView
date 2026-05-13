import { describe, it, expect } from "vitest";
import { parse } from "@babel/parser";
import { bundleProject } from "../lib/preview-bundler";
import { addFile, createProject, setEntryFile } from "../lib/files/operations";
import type { Project, FileId } from "../lib/files/types";

// Phase C — bundler prod-import test suite.
//
// Exercises `bundleProject` against synthetic Projects assembled via the
// Phase A.1 pure operations. Pure-logic only: no React, no DOM, no iframe.
//
// Style: the "valid bundle" assertions check (a) the source compiles as JS
// (via `new Function`), (b) the right module IIFE shape lands in output,
// (c) curated npm imports survive at the bundle top so the iframe runtime's
// processModuleSyntax can produce its preamble. We do NOT execute the
// produced code — execution happens in the iframe's React runtime, which
// these tests don't simulate.

// ─── helpers ────────────────────────────────────────────────────────────────

function makeProject(
  entryPath: string,
  entrySource: string,
  extras: Array<{ path: string; source: string }> = [],
): Project {
  const r = createProject({
    name: "test",
    entryPath,
    entrySource,
  });
  if (!r.ok) throw new Error(`createProject failed: ${r.error}`);
  let p = r.project;
  for (const f of extras) {
    const ar = addFile(p, { path: f.path, source: f.source });
    if (!ar.ok) throw new Error(`addFile ${f.path} failed: ${ar.error}`);
    p = ar.project;
  }
  return p;
}

function expectOk(
  result: ReturnType<typeof bundleProject>,
): { source: string; entryLineOffset: number; filesBundled: number } {
  if (!result.ok) {
    throw new Error(`bundleProject failed: ${result.error}`);
  }
  return result;
}

function expectError(result: ReturnType<typeof bundleProject>): string {
  if (result.ok) throw new Error("expected bundle to fail");
  return result.error;
}

function parsesAsJs(src: string): boolean {
  // Use @babel/parser with sourceType: 'module' so top-level imports +
  // exports parse cleanly. JSX in the bundler output is also handled via
  // the jsx plugin. The bundler is ES-module-shape on output (passes through
  // to the iframe runtime which handles npm imports + the entry's `export
  // default`); this gate confirms the WHOLE bundle is well-formed module
  // syntax.
  try {
    parse(src, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
      errorRecovery: false,
    });
    return true;
  } catch {
    return false;
  }
}

// ─── single-file passthrough ─────────────────────────────────────────────────

describe("bundleProject — single-file passthrough", () => {
  it("returns entry source verbatim when project has one file", () => {
    const p = makeProject(
      "App.jsx",
      "import { useState } from 'react';\nexport default function App() { return <div />; }\n",
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toBe(
      "import { useState } from 'react';\nexport default function App() { return <div />; }\n",
    );
    expect(r.entryLineOffset).toBe(0);
    expect(r.filesBundled).toBe(1);
  });

  it("treats files with no relative imports as single-file", () => {
    // 2 files in pool but entry doesn't import the other → bundler doesn't
    // walk it; it's treated as inert. Output should be entry-only.
    const p = makeProject(
      "App.jsx",
      "export default function App() { return <div />; }\n",
      [{ path: "lib/util.js", source: "export const noop = () => {};\n" }],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toBe("export default function App() { return <div />; }\n");
    expect(r.filesBundled).toBe(1);
  });

  it("HTML entry returns source as-is regardless of pool", () => {
    const p = makeProject(
      "index.html",
      "<!doctype html><html><body><div>hi</div></body></html>",
      [{ path: "App.jsx", source: "export default function() {}" }],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toBe(
      "<!doctype html><html><body><div>hi</div></body></html>",
    );
    expect(r.entryLineOffset).toBe(0);
  });
});

// ─── default + named import resolution ──────────────────────────────────────

describe("bundleProject — default imports", () => {
  it("resolves default import to module.default", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './components/Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "components/Card.jsx",
          source: "export default function Card() { return <div className='card' />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    // Module IIFE assigns to __dropin_mod_0
    expect(r.source).toContain("var __dropin_mod_0 = (function () {");
    // Default-export in non-entry rewritten to var __dropin_default
    expect(r.source).toContain("var __dropin_default = function Card()");
    // Module IIFE return shape exposes default
    expect(r.source).toContain("return { default: __dropin_default };");
    // Entry's relative import becomes a binding using bracket-default
    expect(r.source).toContain("var Card = __dropin_mod_0.default;");
    // Entry's `export default` is LEFT ALONE — iframe runtime processes it
    expect(r.source).toMatch(/export default function App\(\)/);
    expect(r.filesBundled).toBe(2);
    expect(r.entryLineOffset).toBeGreaterThan(0);
  });

  it("resolves anonymous default to var binding too", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export default function() { return <span />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain("var __dropin_default = function() {");
    expect(r.source).toContain("return { default: __dropin_default };");
  });

  it("resolves default-as-arrow expression", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "const Inner = () => <span />;\nexport default Inner;\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain("var __dropin_default = Inner;");
  });

  it("resolves default-as-class declaration", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export default class Card extends Object {}\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain("var __dropin_default = class Card");
  });
});

describe("bundleProject — named imports", () => {
  it("resolves named import to module[name]", () => {
    const p = makeProject(
      "App.jsx",
      "import { Button } from './Button';\nexport default function App() { return <Button />; }\n",
      [
        {
          path: "Button.jsx",
          source: "export function Button() { return <button />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain('var Button = __dropin_mod_0["Button"];');
    expect(r.source).toContain("function Button()");
    expect(r.source).toContain("return { Button: Button };");
  });

  it("resolves alias-named import (import { Foo as Bar })", () => {
    const p = makeProject(
      "App.jsx",
      "import { Foo as MyFoo } from './lib';\nexport default function App() { return <MyFoo />; }\n",
      [
        {
          path: "lib.js",
          source: "export const Foo = () => 'value';\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    // Entry binds local name MyFoo to remote member Foo
    expect(r.source).toContain('var MyFoo = __dropin_mod_0["Foo"];');
    // Module IIFE returns under exported name Foo
    expect(r.source).toContain("return { Foo: Foo };");
  });

  it("resolves multi-name destructure", () => {
    const p = makeProject(
      "App.jsx",
      "import { a, b, c as cc } from './lib';\nexport default function App() { return <div>{a}{b}{cc}</div>; }\n",
      [
        {
          path: "lib.js",
          source: "export const a = 1, b = 2, c = 3;\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain('var a = __dropin_mod_0["a"];');
    expect(r.source).toContain('var b = __dropin_mod_0["b"];');
    expect(r.source).toContain('var cc = __dropin_mod_0["c"];');
    // Module IIFE returns all three named exports
    expect(r.source).toContain("a: a");
    expect(r.source).toContain("b: b");
    expect(r.source).toContain("c: c");
  });

  it("handles `export { Foo, Bar as Baz }` specifier-only form", () => {
    const p = makeProject(
      "App.jsx",
      "import { Foo, BazAlias } from './lib';\nexport default function App() { return <Foo />; }\n",
      [
        {
          path: "lib.js",
          source:
            "function Foo() {}\nfunction Bar() {}\nexport { Foo, Bar as BazAlias };\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain("Foo: Foo");
    expect(r.source).toContain("BazAlias: Bar");
  });
});

describe("bundleProject — namespace imports", () => {
  it("binds whole module to namespace import", () => {
    const p = makeProject(
      "App.jsx",
      "import * as utils from './lib/util';\nexport default function App() { return <div>{utils.fmt(3)}</div>; }\n",
      [
        {
          path: "lib/util.js",
          source: "export const fmt = (n) => 'n=' + n;\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain("var utils = __dropin_mod_0;");
    expect(r.source).toContain("fmt: fmt");
  });
});

describe("bundleProject — side-effect-only imports", () => {
  it("drops side-effect import binding but keeps module IIFE in topo order", () => {
    const p = makeProject(
      "App.jsx",
      "import './side-fx';\nexport default function App() { return <div />; }\n",
      [
        {
          path: "side-fx.js",
          source: "console.log('boot');\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    // No `var X` injection for side-effect imports.
    expect(r.source).not.toMatch(/var\s+\w+\s*=\s*__dropin_mod_0/);
    // Module IIFE still wraps the side-effect file
    expect(r.source).toContain("console.log('boot');");
    // Module return shape is empty object (no exports)
    expect(r.source).toContain("return {  };");
    expect(r.filesBundled).toBe(2);
  });
});

// ─── npm + relative mixed ────────────────────────────────────────────────────

describe("bundleProject — npm imports stay as-is", () => {
  it("hoists npm imports to bundle top, deduplicated", () => {
    const p = makeProject(
      "App.jsx",
      "import { useState } from 'react';\nimport Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source:
            "import { useEffect } from 'react';\nexport default function Card() { return <div />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    // npm imports both appear at the top
    const idxUseState = r.source.indexOf("import { useState } from 'react';");
    const idxUseEffect = r.source.indexOf("import { useEffect } from 'react';");
    const idxModIife = r.source.indexOf("var __dropin_mod_0");
    expect(idxUseState).toBeGreaterThanOrEqual(0);
    expect(idxUseEffect).toBeGreaterThanOrEqual(0);
    expect(idxModIife).toBeGreaterThan(idxUseState);
    expect(idxModIife).toBeGreaterThan(idxUseEffect);
    // npm imports are NOT duplicated inside the module IIFE — they were
    // stripped from the file body and hoisted.
    const inIife = r.source.slice(idxModIife);
    expect(inIife).not.toContain("import { useEffect } from 'react'");
  });

  it("dedupes when two files have the IDENTICAL npm import statement", () => {
    const p = makeProject(
      "App.jsx",
      "import { useState } from 'react';\nimport Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source:
            "import { useState } from 'react';\nexport default function Card() { return <div />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    const occurrences = r.source.split("import { useState } from 'react';").length - 1;
    expect(occurrences).toBe(1);
  });

  it("preserves duplicate npm imports when specifier sets differ", () => {
    // `import { useState } from 'react'` and `import { useEffect } from 'react'`
    // are SEPARATE statements (no merging) because dedup is by exact text.
    // The iframe runtime's processModuleSyntax merges them at preamble-build
    // time, so output is correct either way.
    const p = makeProject(
      "App.jsx",
      "import { useState } from 'react';\nimport Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source:
            "import { useEffect } from 'react';\nexport default function Card() { return <div />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain("import { useState } from 'react';");
    expect(r.source).toContain("import { useEffect } from 'react';");
  });
});

// ─── transitive dependencies ─────────────────────────────────────────────────

describe("bundleProject — transitive imports", () => {
  it("bundles a 3-file chain (App → Page → Card) in topological order", () => {
    const p = makeProject(
      "App.jsx",
      "import Page from './Page';\nexport default function App() { return <Page />; }\n",
      [
        {
          path: "Page.jsx",
          source:
            "import Card from './Card';\nexport default function Page() { return <Card />; }\n",
        },
        {
          path: "Card.jsx",
          source: "export default function Card() { return <div className='card' />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.filesBundled).toBe(3);
    // Card (idx 0) appears before Page (idx 1) — topological order
    const idxCardIife = r.source.indexOf("var __dropin_mod_0 = ");
    const idxPageIife = r.source.indexOf("var __dropin_mod_1 = ");
    expect(idxCardIife).toBeGreaterThanOrEqual(0);
    expect(idxPageIife).toBeGreaterThan(idxCardIife);
    // Page's IIFE references Card via __dropin_mod_0
    const pageIife = r.source.slice(idxPageIife);
    expect(pageIife).toContain("var Card = __dropin_mod_0.default;");
    // Entry references Page via __dropin_mod_1
    expect(r.source).toContain("var Page = __dropin_mod_1.default;");
  });

  it("handles a diamond import (A → B, A → C, B → D, C → D)", () => {
    const p = makeProject(
      "A.jsx",
      "import B from './B';\nimport C from './C';\nexport default function A() { return <><B /><C /></>; }\n",
      [
        {
          path: "B.jsx",
          source: "import D from './D';\nexport default function B() { return <D />; }\n",
        },
        {
          path: "C.jsx",
          source: "import D from './D';\nexport default function C() { return <D />; }\n",
        },
        {
          path: "D.jsx",
          source: "export default function D() { return <div className='d' />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.filesBundled).toBe(4);
    // D ends up with index 0 (deepest dependency)
    expect(r.source).toContain("var __dropin_mod_0 = ");
    // Both B and C reference __dropin_mod_0
    const occurrences = (r.source.match(/var D = __dropin_mod_0\.default;/g) || []).length;
    expect(occurrences).toBe(2);
  });

  it("resolves extensionless imports", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.tsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = expectOk(bundleProject(p));
    expect(r.filesBundled).toBe(2);
  });

  it("resolves nested-folder imports", () => {
    const p = makeProject(
      "App.jsx",
      "import { Btn } from './ui/Button';\nexport default function App() { return <Btn />; }\n",
      [
        {
          path: "ui/Button.jsx",
          source: "export const Btn = () => <button />;\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain('var Btn = __dropin_mod_0["Btn"];');
  });

  it("resolves parent-folder imports (../)", () => {
    const p = makeProject(
      "src/App.jsx",
      "import Card from '../shared/Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "shared/Card.jsx",
          source: "export default function Card() { return <div />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.filesBundled).toBe(2);
  });
});

// ─── error paths ────────────────────────────────────────────────────────────

describe("bundleProject — error paths", () => {
  it("errors on cycle (A → B → A)", () => {
    const p = makeProject(
      "A.jsx",
      "import B from './B';\nexport default function A() { return <B />; }\n",
      [
        {
          path: "B.jsx",
          source: "import A from './A';\nexport default function B() { return <A />; }\n",
        },
      ],
    );
    const err = expectError(bundleProject(p));
    expect(err).toMatch(/cycle/);
    expect(err).toContain("A.jsx");
  });

  it("errors on self-import", () => {
    const p = makeProject(
      "App.jsx",
      "import App from './App';\nexport default function App() { return <App />; }\n",
    );
    const err = expectError(bundleProject(p));
    expect(err).toMatch(/cycle/);
  });

  it("errors when relative import does not resolve", () => {
    const p = makeProject(
      "App.jsx",
      "import Missing from './does-not-exist';\nexport default function App() { return <Missing />; }\n",
    );
    const err = expectError(bundleProject(p));
    expect(err).toMatch(/cannot resolve/);
    expect(err).toContain("./does-not-exist");
    expect(err).toContain("App.jsx");
  });

  it("errors on `export * from './x'` re-export", () => {
    const p = makeProject(
      "App.jsx",
      "import { Foo } from './reexp';\nexport default function App() { return <Foo />; }\n",
      [
        { path: "reexp.js", source: "export * from './x';\n" },
        { path: "x.js", source: "export const Foo = 1;\n" },
      ],
    );
    const err = expectError(bundleProject(p));
    expect(err).toMatch(/re-export not supported/);
  });

  it("errors on `export { Foo } from './x'` re-export", () => {
    const p = makeProject(
      "App.jsx",
      "import { Foo } from './reexp';\nexport default function App() { return <Foo />; }\n",
      [
        { path: "reexp.js", source: "export { Foo } from './x';\n" },
        { path: "x.js", source: "export const Foo = 1;\n" },
      ],
    );
    const err = expectError(bundleProject(p));
    expect(err).toMatch(/re-export not supported/);
  });

  it("errors on per-file syntax error with file path in the message", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export default function( { return <div />; }\n",
        },
      ],
    );
    const err = expectError(bundleProject(p));
    expect(err).toMatch(/parse error/);
    expect(err).toContain("Card.jsx");
  });
});

// ─── invariants + structural shape ──────────────────────────────────────────

describe("bundleProject — structural invariants", () => {
  it("entry source's `export default` is preserved verbatim (iframe runtime processes it)", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toMatch(/export default function App\(\)/);
  });

  it("non-entry `export default` is rewritten to var binding", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = expectOk(bundleProject(p));
    // Only one `export default` should remain — the entry's.
    const matches = r.source.match(/export default/g) || [];
    expect(matches.length).toBe(1);
  });

  it("entryLineOffset reflects pre-entry newlines (mod IIFEs)", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = expectOk(bundleProject(p));
    // Module IIFE adds at least 4 newlines: opening line, body, return,
    // closing brace + 1 join newline.
    expect(r.entryLineOffset).toBeGreaterThanOrEqual(4);
  });

  it("filesBundled reflects topological-order count", () => {
    const p = makeProject(
      "A.jsx",
      "import B from './B';\nexport default function A() { return <B />; }\n",
      [
        { path: "B.jsx", source: "import C from './C';\nexport default function B() { return <C />; }\n" },
        { path: "C.jsx", source: "export default function C() { return <div />; }\n" },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.filesBundled).toBe(3);
  });

  it("an unused file in the pool is NOT bundled", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        { path: "Card.jsx", source: "export default function Card() { return <div />; }\n" },
        // Unreachable from entry — should not appear in bundle.
        { path: "unused.js", source: "export const wasted = 'never imported';\n" },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).not.toContain("wasted");
    expect(r.filesBundled).toBe(2);
  });

  it("entry source remaining text is bundle-trailing", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nfunction App() { return <Card />; }\nexport default App;\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source.endsWith("export default App;\n")).toBe(true);
  });

  it("npm import statements appear before any module IIFE", () => {
    const p = makeProject(
      "App.jsx",
      "import { useState } from 'react';\nimport Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = expectOk(bundleProject(p));
    const idxNpm = r.source.indexOf("import { useState }");
    const idxIife = r.source.indexOf("var __dropin_mod_0");
    expect(idxNpm).toBeGreaterThanOrEqual(0);
    expect(idxIife).toBeGreaterThan(idxNpm);
  });

  it("output bundle is structurally a parseable JS document (sans JSX)", () => {
    const p = makeProject(
      "App.js",
      "import { useState } from 'react';\nimport Card from './Card';\nexport default function App() { return Card(); }\n",
      [{ path: "Card.js", source: "export default function Card() { return 'card'; }\n" }],
    );
    const r = expectOk(bundleProject(p));
    // Sanity: bundler output passes our basic-JS gate (doesn't actually
    // run, just checks parser doesn't choke on the wrapping shape).
    expect(parsesAsJs(r.source)).toBe(true);
  });

  it("non-entry-file kind tsx/jsx/ts/js/html — bundles all JS-family kinds", () => {
    const p = makeProject(
      "App.tsx",
      "import { Btn } from './Button';\nexport default function App() { return <Btn />; }\n",
      [
        {
          path: "Button.tsx",
          source: "export const Btn = (): JSX.Element => <button />;\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.filesBundled).toBe(2);
    // TypeScript syntax (`(): JSX.Element =>`) preserved in output
    expect(r.source).toContain("(): JSX.Element =>");
  });

  it("multiple `export const` on one line round-trips both names", () => {
    const p = makeProject(
      "App.jsx",
      "import { a, b } from './lib';\nexport default function App() { return <div>{a}{b}</div>; }\n",
      [
        {
          path: "lib.js",
          source: "export const a = 1, b = 2;\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain('var a = __dropin_mod_0["a"];');
    expect(r.source).toContain('var b = __dropin_mod_0["b"];');
    expect(r.source).toContain("a: a");
    expect(r.source).toContain("b: b");
  });

  it("non-entry file with both default + named exports surfaces both", () => {
    const p = makeProject(
      "App.jsx",
      "import Card, { variant } from './Card';\nexport default function App() { return <Card v={variant} />; }\n",
      [
        {
          path: "Card.jsx",
          source:
            "export const variant = 'primary';\nexport default function Card() { return <div />; }\n",
        },
      ],
    );
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain("var Card = __dropin_mod_0.default;");
    expect(r.source).toContain('var variant = __dropin_mod_0["variant"];');
    // Module IIFE return shape includes both
    expect(r.source).toContain("default: __dropin_default");
    expect(r.source).toContain("variant: variant");
  });
});

// ─── customization knobs ────────────────────────────────────────────────────

describe("bundleProject — entry override", () => {
  it("accepts explicit entryFileId override (different from project.entryFileId)", () => {
    // Build a project where the configured entry is App.jsx but we ask the
    // bundler to pretend Lib.jsx is the entry for a one-shot bundle.
    let p = makeProject(
      "App.jsx",
      "import Lib from './Lib';\nexport default function App() { return <Lib />; }\n",
      [
        {
          path: "Lib.jsx",
          source: "export default function Lib() { return <span />; }\n",
        },
      ],
    );
    // Find Lib's id and bundle THAT as entry.
    const libRecord = Array.from(p.files.values()).find((f) => f.path === "Lib.jsx");
    expect(libRecord).toBeTruthy();
    const r = expectOk(bundleProject(p, libRecord!.id as FileId));
    // Lib has no relative imports, so single-file passthrough.
    expect(r.filesBundled).toBe(1);
    expect(r.source).toContain("export default function Lib()");
  });

  it("errors when entryFileId override is unknown", () => {
    const p = makeProject(
      "App.jsx",
      "export default function App() { return <div />; }\n",
    );
    const fakeId = "not-a-real-file-id" as FileId;
    const err = expectError(bundleProject(p, fakeId));
    expect(err).toMatch(/entry file not found/);
  });
});

// ─── additional invariants ─────────────────────────────────────────────────

describe("bundleProject — additional invariants", () => {
  it("does not mutate the input project", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const beforeSize = p.files.size;
    const beforeEntry = p.entryFileId;
    const beforeUpdated = p.updatedAt;
    bundleProject(p);
    expect(p.files.size).toBe(beforeSize);
    expect(p.entryFileId).toBe(beforeEntry);
    expect(p.updatedAt).toBe(beforeUpdated);
  });

  it("calling bundleProject is deterministic — same project → same source", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r1 = expectOk(bundleProject(p));
    const r2 = expectOk(bundleProject(p));
    expect(r1.source).toBe(r2.source);
    expect(r1.entryLineOffset).toBe(r2.entryLineOffset);
  });

  it("entryLineOffset is 0 for single-file projects", () => {
    const p = makeProject(
      "App.jsx",
      "export default function App() { return <div />; }\n",
    );
    const r = expectOk(bundleProject(p));
    expect(r.entryLineOffset).toBe(0);
  });

  it("respects setEntryFile reassignment", () => {
    let p = makeProject(
      "App.jsx",
      "export default function App() { return <div />; }\n",
      [{ path: "Other.jsx", source: "export default function Other() { return <p />; }\n" }],
    );
    const otherFile = Array.from(p.files.values()).find((f) => f.path === "Other.jsx")!;
    const setRes = setEntryFile(p, otherFile.id);
    expect(setRes.ok).toBe(true);
    if (!setRes.ok) return;
    p = setRes.project;
    const r = expectOk(bundleProject(p));
    expect(r.source).toContain("function Other()");
    expect(r.source).not.toContain("function App()");
  });
});
