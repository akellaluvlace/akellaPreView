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
