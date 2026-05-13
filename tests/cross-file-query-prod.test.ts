import { describe, it, expect } from "vitest";
import { findCrossFileDefinition } from "../lib/ast/cross-file-query";
import { injectOids } from "../lib/ast/oids";
import { addFile, createProject } from "../lib/files/operations";
import type { Project } from "../lib/files/types";

// Phase D foundation — cross-file definition lookup.
//
// Pure-logic prod-import test for `findCrossFileDefinition`. Covers:
//   - in-file fallback (uses the existing single-file resolver)
//   - default-import resolution (named function decl + identifier ref +
//     anonymous function + class component bail + HOC bail)
//   - named-import resolution (direct decl + alias-via-specifier
//     + import-with-rename)
//   - missing import / non-relative / unresolvable paths
//   - re-export bail (D4 locked)
//
// Each fixture pre-injects OIDs so the resolver can read them off the
// opening element. We use the existing `injectOids` from `lib/ast/oids`
// to mirror what Workspace's lazy initializer does.

function injectAll(source: string): string {
  const r = injectOids(source);
  return r.source;
}

function makeProject(
  entryPath: string,
  entrySource: string,
  extras: Array<{ path: string; source: string }> = [],
): Project {
  const r = createProject({
    name: "xfd",
    entryPath,
    entrySource: injectAll(entrySource),
  });
  if (!r.ok) throw new Error(r.error);
  let p = r.project;
  for (const f of extras) {
    const ar = addFile(p, { path: f.path, source: injectAll(f.source) });
    if (!ar.ok) throw new Error(ar.error);
    p = ar.project;
  }
  return p;
}

describe("findCrossFileDefinition — in-file fallback", () => {
  it("returns in-file def when the component is defined in the same file", () => {
    const p = makeProject(
      "App.jsx",
      "function Card() { return <div className='card' />; }\nexport default function App() { return <Card />; }\n",
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.def.fileId).toBe(p.entryFileId);
    // The OID is non-empty 8-char string per `makeOid` contract.
    expect(r.def.rootOid).toMatch(/^[A-Za-z0-9]{8}$/);
  });

  it("rejects lowercase tag (HTML element, not component)", () => {
    const p = makeProject(
      "App.jsx",
      "export default function App() { return <div />; }\n",
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "div");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/lowercase/i);
  });

  it("rejects when call-site file is not in project", () => {
    const p = makeProject(
      "App.jsx",
      "export default function App() { return <div />; }\n",
    );
    const r = findCrossFileDefinition(p, "nonexistent" as any, "Card");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/call-site file not in project/);
  });
});

describe("findCrossFileDefinition — default imports", () => {
  it("resolves `import Card from './x'` against `export default function Card()`", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export default function Card() { return <div className='card' />; }\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // Resolved file is the Card.jsx record, not the entry file.
    const resolvedFile = Array.from(p.files.values()).find((f) => f.path === "Card.jsx");
    expect(r.def.fileId).toBe(resolvedFile!.id);
    expect(r.def.rootOid).toMatch(/^[A-Za-z0-9]{8}$/);
  });

  it("resolves default-import-with-rename (local name differs from exported name)", () => {
    const p = makeProject(
      "App.jsx",
      "import MyCard from './Card';\nexport default function App() { return <MyCard />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export default function Card() { return <div />; }\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "MyCard");
    expect(r.ok).toBe(true);
  });

  it("resolves `export default Identifier;` form (named function declared above the export)", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "function Card() { return <div />; }\nexport default Card;\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
  });

  it("resolves `export default Identifier;` form with arrow expression", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "const Card = () => <div />;\nexport default Card;\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
  });

  it("resolves anonymous default export (function expression with JSX body)", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export default function() { return <div className='anon' />; }\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
  });

  it("resolves anonymous default arrow with block body", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export default () => { return <div className='arrow-block' />; };\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
  });

  it("bails on HOC-wrapped default export (`export default withAuth(Card)`)", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source:
            "function Card() { return <div />; }\nfunction withAuth(C) { return C; }\nexport default withAuth(Card);\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/HOC/i);
  });

  it("bails on class component default export", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export default class Card extends Object { render() { return null; } }\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/class component/i);
  });

  it("bails when caller imports default but resolved file has no default export", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export const Card = () => <div />;\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/no default export/i);
  });
});

describe("findCrossFileDefinition — named imports", () => {
  it("resolves `import { Card } from './x'` against `export const Card = () => ...`", () => {
    const p = makeProject(
      "App.jsx",
      "import { Card } from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export const Card = () => <div className='card' />;\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
  });

  it("resolves named import against `export function Card()` shape", () => {
    const p = makeProject(
      "App.jsx",
      "import { Card } from './Card';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export function Card() { return <div />; }\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
  });

  it("resolves named import-with-rename: `import { Foo as Bar } from`", () => {
    const p = makeProject(
      "App.jsx",
      "import { Card as MyCard } from './Card';\nexport default function App() { return <MyCard />; }\n",
      [
        {
          path: "Card.jsx",
          source: "export const Card = () => <div />;\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "MyCard");
    expect(r.ok).toBe(true);
  });

  it("resolves specifier-only export: `export { Internal as Card }`", () => {
    const p = makeProject(
      "App.jsx",
      "import { Card } from './lib';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "lib.jsx",
          source:
            "function Internal() { return <div className='internal' />; }\nexport { Internal as Card };\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
  });

  it("resolves specifier-only export with no rename: `export { Card }`", () => {
    const p = makeProject(
      "App.jsx",
      "import { Card } from './lib';\nexport default function App() { return <Card />; }\n",
      [
        {
          path: "lib.jsx",
          source: "function Card() { return <div className='c' />; }\nexport { Card };\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
  });

  it("bails on `export { Card } from './bar'` re-export (locked decision D4)", () => {
    const p = makeProject(
      "App.jsx",
      "import { Card } from './lib';\nexport default function App() { return <Card />; }\n",
      [
        { path: "lib.jsx", source: "export { Card } from './card-impl';\n" },
        { path: "card-impl.jsx", source: "export const Card = () => <div />;\n" },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/re-export/i);
  });

  it("bails when named export is missing from resolved file", () => {
    const p = makeProject(
      "App.jsx",
      "import { Missing } from './lib';\nexport default function App() { return <Missing />; }\n",
      [
        {
          path: "lib.jsx",
          source: "export const Card = () => <div />;\n",
        },
      ],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Missing");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/named export "Missing" not found/);
  });
});

describe("findCrossFileDefinition — error paths", () => {
  it("returns 'tag not imported' reason when the tag has no matching import (caller falls back)", () => {
    // App has a use of <Mystery /> but no import for it. Resolver returns
    // ok:false with reason like "tag <Mystery> not imported in App.jsx".
    // Caller treats this as "no cross-file work to do" and stays in
    // single-file mode.
    const p = makeProject(
      "App.jsx",
      "export default function App() { return <Mystery />; }\n",
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Mystery");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/not imported/);
  });

  it("bails on non-relative import (curated npm)", () => {
    const p = makeProject(
      "App.jsx",
      "import { Heart } from 'lucide-react';\nexport default function App() { return <Heart />; }\n",
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Heart");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/lucide-react/);
    expect(r.reason).toMatch(/cross-file propagation only works for project files/);
  });

  it("bails on unresolved relative import", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './missing-file';\nexport default function App() { return <Card />; }\n",
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/cannot resolve/);
    expect(r.reason).toContain("./missing-file");
  });

  it("bails on parse error in resolved file", () => {
    // We can't easily construct a file with a syntax error post `injectOids`
    // because injectOids tolerates parse failure (returns input unchanged
    // per its tryParse helper). The simplest test: have resolved file
    // text that's invalid even at the top level.
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function( {{{{ broken syntax\n" }],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    // injectOids couldn't add OIDs (parse failed), so resolved.source ===
    // original. Resolver re-parses and surfaces "parse error".
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/parse error/);
  });

  it("bails on namespace import (`import * as`)", () => {
    const p = makeProject(
      "App.jsx",
      "import * as Pkg from './lib';\nexport default function App() { return <Pkg.X />; }\n",
      [{ path: "lib.jsx", source: "export const X = () => <div />;\n" }],
    );
    // The tag in the call site is `Pkg`, so the resolver finds the
    // namespace import. It bails because namespace-as-tag isn't a v1 path.
    const r = findCrossFileDefinition(p, p.entryFileId, "Pkg");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/namespace imports/);
  });
});

describe("findCrossFileDefinition — additional invariants", () => {
  it("does not mutate the input project", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const beforeSize = p.files.size;
    const beforeUpdated = p.updatedAt;
    findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(p.files.size).toBe(beforeSize);
    expect(p.updatedAt).toBe(beforeUpdated);
  });

  it("is deterministic — same project + same call site → same result", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r1 = findCrossFileDefinition(p, p.entryFileId, "Card");
    const r2 = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r1).toEqual(r2);
  });

  it("returns the resolved fileId, not the call-site fileId, on cross-file hit", () => {
    const p = makeProject(
      "App.jsx",
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      [{ path: "Card.jsx", source: "export default function Card() { return <div />; }\n" }],
    );
    const r = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.def.fileId).not.toBe(p.entryFileId);
  });
});
