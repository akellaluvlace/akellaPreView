// Phase C — end-to-end test: bundleProject → buildPreviewDocument.
//
// Validates the contract between the multi-file bundler (Workspace-side,
// pure-logic) and the iframe document builder (also Workspace-side, but
// emits the iframe-side runtime as a string). The chain:
//   1. `bundleProject` rewrites a multi-file Project into a single source.
//   2. `buildPreviewDocument({ code: bundled, kind: "jsx" })` wraps it in
//      the iframe HTML doc with React/ReactDOM/Babel/Tailwind preloads.
//   3. The iframe runtime's `processModuleSyntax` (defined inline in the
//      buildJsxDoc string) sees the hoisted npm imports + the entry's
//      `export default` + the module IIFE vars, and produces the right
//      preamble bindings and `return App` rewrite.
//
// We can't actually run the iframe runtime here (it lives inside a
// JSX-emitted iframe srcDoc string, not a callable module). But we CAN
// assert that the bundle's structural shape lands in the srcDoc as
// expected, and that the runtime's recognizable symbols (the inline
// `processModuleSyntax` function, the SUPPORTED_PKGS array, the
// `Babel.transform` call) coexist with our bundled output.

import { describe, it, expect } from "vitest";
import { bundleProject } from "../lib/preview-bundler";
import { buildPreviewDocument } from "../lib/preview";
import { addFile, createProject } from "../lib/files/operations";

function makeTwoFileProject() {
  const r = createProject({
    name: "e2e",
    entryPath: "App.jsx",
    entrySource:
      "import { useState } from 'react';\nimport Card from './Card';\nexport default function App() { const [n] = useState(0); return <Card n={n} />; }\n",
  });
  if (!r.ok) throw new Error(r.error);
  const ar = addFile(r.project, {
    path: "Card.jsx",
    source:
      "export default function Card({ n }) { return <div className='p-4 rounded-2xl bg-paper'>card #{n}</div>; }\n",
  });
  if (!ar.ok) throw new Error(ar.error);
  return ar.project;
}

describe("Phase C end-to-end — bundleProject → buildPreviewDocument", () => {
  it("multi-file bundle's IIFE shape survives into iframe srcDoc", () => {
    const p = makeTwoFileProject();
    const bundled = bundleProject(p);
    expect(bundled.ok).toBe(true);
    if (!bundled.ok) return;

    const srcDoc = buildPreviewDocument({ code: bundled.source, kind: "jsx" });

    // Module IIFE shape made it into the wrapped iframe doc. The bundler
    // emits `var __dropin_mod_0 = (function () { ... })();` as a top-
    // level statement; buildPreviewDocument pastes the bundle into a
    // `var src = ${escapedCode}` line inside the iframe runtime's main
    // <script>. Escaped form: line breaks + quote escapes.
    expect(srcDoc).toContain("__dropin_mod_0");
    expect(srcDoc).toContain("__dropin_default");

    // Entry's `export default` is preserved verbatim (the iframe
    // runtime's processModuleSyntax converts it to `return` at parse
    // time; we don't pre-rewrite it in the bundler). After string
    // escaping we should still see the literal text.
    expect(srcDoc).toMatch(/export default function App/);

    // The iframe runtime's processModuleSyntax function definition
    // exists in the doc — confirms the runtime is intact.
    expect(srcDoc).toContain("function processModuleSyntax(src)");

    // The bundle's hoisted npm import 'react' is the source-of-truth for
    // the runtime to convert into a `var useState = window.__pkgs['react']
    // .useState` preamble binding. The unescaped 'react' string survives.
    expect(srcDoc).toMatch(/import\s*\{\s*useState\s*\}\s*from\s*'react'/);

    // The runtime's SUPPORTED_PKGS_LIST is JSON-serialized; should
    // include `react` so processModuleSyntax accepts it (vs flagging as
    // unsupported).
    expect(srcDoc).toContain('"react"');
  });

  it("single-file project produces unchanged srcDoc shape (no IIFE markers)", () => {
    const r = createProject({
      name: "single",
      entryPath: "App.jsx",
      entrySource:
        "import { useState } from 'react';\nexport default function App() { const [n] = useState(0); return <div>{n}</div>; }\n",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const bundled = bundleProject(r.project);
    expect(bundled.ok).toBe(true);
    if (!bundled.ok) return;

    const srcDoc = buildPreviewDocument({ code: bundled.source, kind: "jsx" });

    // No bundler artifacts in the iframe doc for single-file projects —
    // critical regression guard. If a future refactor accidentally always
    // emits IIFEs even for single-file, every existing template would
    // regress to the bundled shape.
    expect(srcDoc).not.toContain("__dropin_mod_");
    expect(srcDoc).not.toContain("__dropin_default");

    // The user's source is byte-identical (post buildPreviewDocument's
    // own escapeUserCode) to what they typed.
    expect(srcDoc).toMatch(/export default function App/);
  });

  it("bundle errors are NOT silently embedded — caller must fall back to entry source", () => {
    // Caller-side assertion: when bundling fails (e.g., a cycle),
    // Workspace's entryCode falls back to the entry source. Verify the
    // bundler returns the failure shape so caller can react.
    const r = createProject({
      name: "cycle",
      entryPath: "A.jsx",
      entrySource:
        "import B from './B';\nexport default function A() { return <B />; }\n",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const ar = addFile(r.project, {
      path: "B.jsx",
      source: "import A from './A';\nexport default function B() { return <A />; }\n",
    });
    expect(ar.ok).toBe(true);
    if (!ar.ok) return;

    const bundled = bundleProject(ar.project);
    expect(bundled.ok).toBe(false);
    if (bundled.ok) return;
    expect(bundled.error).toMatch(/cycle/);
  });

  it("HTML entry passes through buildPreviewDocument as the html branch", () => {
    const r = createProject({
      name: "html",
      entryPath: "index.html",
      entrySource: "<div>hi <strong>world</strong></div>",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const bundled = bundleProject(r.project);
    expect(bundled.ok).toBe(true);
    if (!bundled.ok) return;

    const srcDoc = buildPreviewDocument({
      code: bundled.source,
      kind: "html",
    });

    // HTML branch never invokes the JSX runtime; no module IIFE pattern.
    expect(srcDoc).not.toContain("__dropin_mod_");
    // The user's HTML lands inside <body>.
    expect(srcDoc).toContain("<div>hi <strong>world</strong></div>");
  });
});
