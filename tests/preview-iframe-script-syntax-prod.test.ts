// Guards the recurring class of "template-string JS trap" bugs in
// lib/preview.ts: the iframe runtime is authored as a JS string inside a
// TS template literal, so tsc CANNOT see syntax errors inside it (a stray
// backtick / under-escaped backslash / unbalanced brace silently breaks the
// whole iframe parse at runtime — see the project's backtick/backslash trap
// notes). This builds the real preview document and parses every inline
// <script> body with `new Function` (parse-only, no execution) so any such
// break fails CI instead of blanking a user's preview.

import { describe, it, expect } from "vitest";
import { buildPreviewDocument } from "../lib/preview";

// Extract inline <script> bodies that are plain classic JS — skip external
// (src=) and non-JS types (the tailwind-config text/plain marker, JSON, and
// module scripts which `new Function` can't validate as a classic body).
function inlineClassicScripts(html: string): string[] {
  const out: string[] = [];
  const re = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] || "";
    if (/\bsrc\s*=/.test(attrs)) continue;
    const typeM = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i);
    if (typeM && !/javascript/i.test(typeM[1])) continue;
    out.push(m[2]);
  }
  return out;
}

const JSX_TEMPLATE = `import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from './logo.png';

export default function Page() {
  const [n, setN] = React.useState(0);
  return (
    <div className={cn('p-4', 'text-center')}>
      <h1>Hello {n}</h1>
      <Button onClick={() => setN(n + 1)}>Click</Button>
    </div>
  );
}

const styles = { color: 'red' };
`;

const HTML_TEMPLATE = `<!doctype html><html><head><title>t</title></head><body><img src="images/x.jpg"><h1 class="text-2xl">Hi</h1></body></html>`;

describe("preview iframe runtime is syntactically valid JS", () => {
  it("every inline <script> in the JSX preview document parses", () => {
    const doc = buildPreviewDocument({ code: JSX_TEMPLATE, kind: "jsx" });
    const scripts = inlineClassicScripts(doc);
    expect(scripts.length).toBeGreaterThan(0);
    for (const body of scripts) {
      expect(() => new Function(body)).not.toThrow();
    }
  });

  it("every inline <script> in the HTML preview document parses", () => {
    const doc = buildPreviewDocument({ code: HTML_TEMPLATE, kind: "html" });
    const scripts = inlineClassicScripts(doc);
    expect(scripts.length).toBeGreaterThan(0);
    for (const body of scripts) {
      expect(() => new Function(body)).not.toThrow();
    }
  });

  it("the JSX runtime resolves the Babel parser via the documented packages path", () => {
    // Regression for Fix #2 — the import-walker must reference a resolved
    // parser (Babel.packages.parser.parse fallback), not only Babel.parse.
    const doc = buildPreviewDocument({ code: JSX_TEMPLATE, kind: "jsx" });
    expect(doc).toContain("Babel.packages.parser.parse");
  });

  it("assembles the import-walker preamble BEFORE the hooks preamble (regression: undefined.useState)", () => {
    // `import React, { useState } from "react"` makes the import-walker emit
    // `var React=(window.__pkgs["react"]...)` INSIDE the IIFE, which shadows
    // the `new Function('React', ...)` param and is hoisted to undefined. The
    // defensive hooks preamble (`var useState=React.useState`) dereferences
    // React, so the wrapped IIFE MUST concatenate `processed.preamble` (the
    // import bindings) BEFORE `DEFAULT_HOOKS_PREAMBLE` — otherwise React is
    // undefined when the hooks preamble runs → "Cannot read properties of
    // undefined (reading 'useState')". (Live regression from re-activating the
    // Babel.parse import-walker.) This guards the concatenation order in the
    // generated runtime, which is what determines the var-assignment order.
    const doc = buildPreviewDocument({ code: JSX_TEMPLATE, kind: "jsx" });
    const start = doc.indexOf("var wrapped =");
    const end = doc.indexOf("Babel.transform(wrapped");
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const wrappedExpr = doc.slice(start, end);
    const preambleIdx = wrappedExpr.indexOf("processed.preamble");
    const hooksIdx = wrappedExpr.indexOf("DEFAULT_HOOKS_PREAMBLE");
    expect(preambleIdx).toBeGreaterThan(-1);
    expect(hooksIdx).toBeGreaterThan(-1);
    expect(preambleIdx).toBeLessThan(hooksIdx);
  });

  // Babel emits self-optimizing helpers (_extends / _objectSpread) for object
  // & JSX spread (`{...rest}`). They reassign their OWN name on first call:
  // `_extends = Object.assign.bind(), _extends.apply(...)`. Babel hoists them
  // to the TOP of the output, so the leading `return ` in
  // `new Function('return ' + compiled)` turns that hoisted DECLARATION into a
  // named function EXPRESSION — whose name is an immutable self-reference — so
  // the reassignment no-ops and the helper recurses forever (RangeError:
  // Maximum call stack size exceeded). Live bug hit by any spread-using
  // component. The two tests below pin the mechanism with a minimal _extends
  // mimic so a regression is caught without needing @babel/standalone in CI.
  const EXTENDS_HELPER =
    "function _extends(){ return _extends = Object.assign.bind(), _extends.apply(null, arguments); }";

  it("documents the bug: `return ` + helper-first compiled infinite-loops", () => {
    const compiled = `${EXTENDS_HELPER}\n(function(){ return _extends({}, { a: 1 }); })()`;
    const bad = new Function("return " + compiled);
    expect(() => bad()).toThrow(RangeError);
  });

  it("the fix: capture the IIFE result in a var so hoisted helpers stay declarations", () => {
    // The pipeline now appends `return __dropinResult;` instead of prefixing
    // `return `, so the helper stays a real (mutable) function declaration.
    const compiled = `${EXTENDS_HELPER}\nvar __dropinResult = (function(){ return _extends({}, { a: 1 }); })();`;
    const factory = new Function(compiled + "\nreturn __dropinResult;");
    expect(() => factory()).not.toThrow();
    expect(factory()).toEqual({ a: 1 });
  });

  it("the generated JSX doc captures the component in a var (not `return ` + compiled)", () => {
    const doc = buildPreviewDocument({ code: JSX_TEMPLATE, kind: "jsx" });
    expect(doc).toContain("return __dropinResult");
    // The fragile executable form `new Function(..., 'return ' + compiled)`
    // must be gone (match the real signature, not the explanatory comment).
    expect(doc).not.toContain("'ReactDOM', 'return ' + compiled");
  });

  it("both docs carry the engine guard, broken-image fallback + mixed-content upgrade", () => {
    const jsx = buildPreviewDocument({ code: JSX_TEMPLATE, kind: "jsx" });
    const html = buildPreviewDocument({ code: HTML_TEMPLATE, kind: "html" });
    // Fix #4 — readable message when the CDN engine fails (JSX path only).
    expect(jsx).toContain("Could not load the preview engine");
    // Fix #5 — broken-image listener + placeholder + mixed-content upgrade,
    // in BOTH preview pipelines.
    for (const doc of [jsx, html]) {
      expect(doc).toContain("dropin:imageError");
      expect(doc).toContain('data-dropin-broken="1"');
      expect(doc).toContain("upgrade-insecure-requests");
    }
  });
});
