// Phase C — sanity check that the bundler's output is shaped the way the
// iframe runtime in `lib/preview.ts` expects:
//   - Only top-level statements are: hoisted-npm imports, module IIFE
//     `var __dropin_mod_<i> = ...` declarations, then the entry source.
//   - The entry's `export default` survives so `processModuleSyntax` turns
//     it into `return`.
//   - The hoisted npm imports parse as ES module imports (the runtime's
//     Babel.parse with sourceType:'module' accepts them and produces
//     `var X = window.__pkgs[name]...` preamble bindings).
//
// We don't actually run Babel.transform here (that's iframe-side). We just
// validate the bundle's top-level statement shape.

import { describe, it, expect } from "vitest";
import { parse } from "@babel/parser";
import { bundleProject } from "../lib/preview-bundler";
import { addFile, createProject } from "../lib/files/operations";
import type { Project } from "../lib/files/types";

function makeProject(
  entryPath: string,
  entrySource: string,
  extras: Array<{ path: string; source: string }> = [],
): Project {
  const r = createProject({ name: "iframe-shape", entryPath, entrySource });
  if (!r.ok) throw new Error(r.error);
  let p = r.project;
  for (const f of extras) {
    const ar = addFile(p, f);
    if (!ar.ok) throw new Error(ar.error);
    p = ar.project;
  }
  return p;
}

function topLevelStatements(src: string) {
  return parse(src, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
    errorRecovery: false,
  }).program.body;
}

describe("preview-bundler iframe-shape contract", () => {
  it("multi-file bundle starts with import declarations + module IIFE vars", () => {
    const p = makeProject(
      "App.jsx",
      "import { useState } from 'react';\nimport Card from './Card';\nexport default function App() { const [x] = useState(0); return <Card x={x} />; }\n",
      [
        {
          path: "Card.jsx",
          source:
            "import { Heart } from 'lucide-react';\nexport default function Card({ x }) { return <div><Heart />{x}</div>; }\n",
        },
      ],
    );
    const r = bundleProject(p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const body = topLevelStatements(r.source);

    // First N statements must be ImportDeclaration nodes (hoisted npm).
    let i = 0;
    while (i < body.length && body[i].type === "ImportDeclaration") i++;
    expect(i).toBeGreaterThanOrEqual(2); // at least useState + Heart

    // The first non-import statement must be a VariableDeclaration whose
    // declarator id starts with `__dropin_mod_` (the module IIFE).
    expect(body[i].type).toBe("VariableDeclaration");
    const firstVar = body[i] as { declarations: Array<{ id: { name?: string } }> };
    const declName = firstVar.declarations[0]?.id?.name ?? "";
    expect(declName.startsWith("__dropin_mod_")).toBe(true);

    // The LAST statement is the entry's `export default function App() {}`.
    expect(body[body.length - 1].type).toBe("ExportDefaultDeclaration");
  });

  it("entry's `export default` shape is exactly what the iframe runtime expects", () => {
    // The iframe runtime's processModuleSyntax in lib/preview.ts handles
    // `ExportDefaultDeclaration` by replacing the keyword span with `return`.
    // Confirm our bundler emits exactly one such node at top level (and that
    // its declaration's start position is recoverable for the keyword-strip).
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = bundleProject(p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const body = topLevelStatements(r.source);
    const exportDefaults = body.filter((n) => n.type === "ExportDefaultDeclaration");
    expect(exportDefaults).toHaveLength(1);
    // The declaration is a FunctionDeclaration named App
    const exp = exportDefaults[0] as {
      declaration: { type: string; id?: { name?: string } };
    };
    expect(exp.declaration.type).toBe("FunctionDeclaration");
    expect(exp.declaration.id?.name).toBe("App");
  });

  it("single-file projects produce zero npm-import-hoist statements added", () => {
    const p = makeProject(
      "App.jsx",
      "import { useState } from 'react';\nexport default function App() { const [x] = useState(0); return <div>{x}</div>; }\n",
    );
    const r = bundleProject(p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // Should be byte-identical to the input source for single-file projects.
    expect(r.source).toBe(
      "import { useState } from 'react';\nexport default function App() { const [x] = useState(0); return <div>{x}</div>; }\n",
    );
  });

  it("module IIFE shape: var __dropin_mod_<n> = (function () { ... return { ... }; })();", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = bundleProject(p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // Anchored regex: the IIFE block lives in `r.source` and must obey this
    // exact structural shape (anchors guard against accidental drift if the
    // emitter is refactored).
    const iifeRegex =
      /var __dropin_mod_0 = \(function \(\) \{[\s\S]*?return \{ default: __dropin_default \};\s*\}\)\(\);/;
    expect(iifeRegex.test(r.source)).toBe(true);
  });

  it("relative-import binding lands inside the IMPORTER's body, not at the top", () => {
    // A 3-file chain: A → B → C. B imports C. The `var C = __dropin_mod_0.default;`
    // must appear INSIDE B's IIFE, not at the bundle's top level.
    const p = makeProject(
      "A.jsx",
      "import B from './B';\nexport default function A() { return <B />; }\n",
      [
        { path: "B.jsx", source: "import C from './C';\nexport default function B() { return <C />; }\n" },
        { path: "C.jsx", source: "export default function C() { return <div />; }\n" },
      ],
    );
    const r = bundleProject(p);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // C is mod_0, B is mod_1
    const body = topLevelStatements(r.source);
    const topLevelDecls = body.filter((n) => n.type === "VariableDeclaration");
    // Top-level vars: only the module IIFE vars (mod_0, mod_1) AND the
    // entry's relative-import bindings (var B = __dropin_mod_1.default).
    const topLevelNames = topLevelDecls
      .map((d) => {
        const v = d as { declarations: Array<{ id: { name?: string } }> };
        return v.declarations[0]?.id?.name ?? "";
      })
      .filter(Boolean);
    expect(topLevelNames).toContain("__dropin_mod_0");
    expect(topLevelNames).toContain("__dropin_mod_1");
    expect(topLevelNames).toContain("B");
    // Crucially: `C` is NOT a top-level var — it's inside B's IIFE.
    expect(topLevelNames).not.toContain("C");
  });
});
