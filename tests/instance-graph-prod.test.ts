// Phase F foundation — instance-graph prod-import test suite.
//
// Pure-logic only. Builds in-memory Projects with various import shapes
// and asserts findAllInstancesOfDefinition discovers the right call sites.

import { describe, it, expect } from "vitest";
import { findAllInstancesOfDefinition } from "../lib/ast/instance-graph";
import { createProject, addFile } from "../lib/files/operations";
import { injectOids, OID_ATTR } from "../lib/ast/oids";
import type { FileId, Project } from "../lib/files/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function buildProject(
  entry: { path: string; source: string },
  others: Array<{ path: string; source: string }> = [],
): Project {
  // Inject OIDs into JSX/TSX files — same pre-condition as production.
  const inject = (path: string, source: string): string => {
    if (path.endsWith(".jsx") || path.endsWith(".tsx")) {
      return injectOids(source).source;
    }
    return source;
  };

  const create = createProject({
    name: "test-project",
    entryPath: entry.path,
    entrySource: inject(entry.path, entry.source),
  });
  if (!create.ok) throw new Error(`createProject failed: ${create.error}`);
  let project = create.project;

  for (const f of others) {
    const r = addFile(project, {
      path: f.path,
      source: inject(f.path, f.source),
    });
    if (!r.ok) throw new Error(`addFile failed: ${r.error}`);
    project = r.project;
  }
  return project;
}

function getFileId(project: Project, path: string): FileId {
  for (const f of project.files.values()) {
    if (f.path === path) return f.id;
  }
  throw new Error(`file not in project: ${path}`);
}

function getOidOfFirstElement(project: Project, path: string): string {
  const file = Array.from(project.files.values()).find((f) => f.path === path);
  if (!file) throw new Error(`file not in project: ${path}`);
  // Crude regex extraction of the first OID — good enough for fixtures
  // where we control the structure.
  const m = file.source.match(new RegExp(`${OID_ATTR}="([^"]+)"`));
  if (!m) throw new Error(`no OID in ${path}`);
  return m[1];
}

// ─── happy paths ────────────────────────────────────────────────────────────

describe("findAllInstancesOfDefinition — happy paths", () => {
  it("finds a single cross-file call site (default import)", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "./Card";
function App() { return <div><Card /></div>; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `
export default function Card() { return <div className="card" />; }
`.trim(),
        },
      ],
    );

    const cardFileId = getFileId(project, "Card.jsx");
    const cardRootOid = getOidOfFirstElement(project, "Card.jsx");

    const r = findAllInstancesOfDefinition(project, cardFileId, cardRootOid);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(1);
    expect(r.instances[0].fileId).toBe(getFileId(project, "App.jsx"));
    expect(r.defExports).toHaveLength(1);
    expect(r.defExports[0].isDefault).toBe(true);
    expect(r.defExports[0].localName).toBe("Card");
  });

  it("finds multiple call sites in same file", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "./Card";
function App() {
  return <div><Card /><Card /><Card /></div>;
}
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(3);
    // All 3 should have unique OIDs.
    const oids = r.instances.map((i) => i.oid);
    expect(new Set(oids).size).toBe(3);
  });

  it("finds call sites across multiple files", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "./Card";
function App() { return <div><Card /></div>; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
        {
          path: "Page.jsx",
          source: `
import Card from "./Card";
function Page() { return <main><Card /><Card /></main>; }
export default Page;
`.trim(),
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(3);
    const fileIds = new Set(r.instances.map((i) => i.fileId));
    expect(fileIds.size).toBe(2);
  });

  it("default import with rename: <MyCard /> resolves to Card definition", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import MyCard from "./Card";
function App() { return <MyCard />; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(1);
  });

  it("named export: <Card /> via { Card } import", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import { Card } from "./components";
function App() { return <Card />; }
`.trim(),
      },
      [
        {
          path: "components.jsx",
          source: `export function Card() { return <article />; }`,
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "components.jsx"),
      getOidOfFirstElement(project, "components.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(1);
    expect(r.defExports[0].isDefault).toBe(false);
    expect(r.defExports[0].exportedName).toBe("Card");
  });

  it("named export with importer rename: import { Card as MyCard }", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import { Card as MyCard } from "./components";
function App() { return <MyCard />; }
`.trim(),
      },
      [
        {
          path: "components.jsx",
          source: `export function Card() { return <article />; }`,
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "components.jsx"),
      getOidOfFirstElement(project, "components.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(1);
  });

  it("named export with exporter rename: export { Internal as Card }", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import { Card } from "./components";
function App() { return <Card />; }
`.trim(),
      },
      [
        {
          path: "components.jsx",
          source: `
function Internal() { return <article />; }
export { Internal as Card };
`.trim(),
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "components.jsx"),
      getOidOfFirstElement(project, "components.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(1);
    expect(r.defExports[0].localName).toBe("Internal");
    expect(r.defExports[0].exportedName).toBe("Card");
  });

  it("in-file calls in def file are found too", () => {
    // Card.jsx defines AND calls Card in a sibling function. App.jsx
    // imports the NAMED export Card. Both call sites count.
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import { Card } from "./Card";
function App() { return <Card />; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `
export function Card() { return <div className="card" />; }
function Wrapper() { return <Card />; }
export default Wrapper;
`.trim(),
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // Should find: <Card /> in App.jsx + <Card /> in Wrapper inside Card.jsx
    expect(r.instances.length).toBe(2);
  });
});

// ─── error paths ────────────────────────────────────────────────────────────

describe("findAllInstancesOfDefinition — error paths", () => {
  it("def file not in project", () => {
    const create = createProject({
      name: "test",
      entryPath: "App.jsx",
      entrySource: "function App() { return <div />; }",
    });
    if (!create.ok) throw new Error("createProject failed");
    const r = findAllInstancesOfDefinition(
      create.project,
      "nonexistent" as FileId,
      "anyoid",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toContain("def file not in project");
  });

  it("empty defRootOid", () => {
    const project = buildProject({
      path: "App.jsx",
      source: `function App() { return <div />; }`,
    });
    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "App.jsx"),
      "",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toContain("non-empty");
  });

  it("defRootOid not found in any export", () => {
    const project = buildProject({
      path: "Card.jsx",
      source: `export default function Card() { return <article />; }`,
    });
    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      "fake-oid-doesnt-exist",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toContain("not found");
  });

  it("def file parse error bails", () => {
    const create = createProject({
      name: "test",
      entryPath: "Card.jsx",
      entrySource: `export default function Card() { return <div data-dropin-id="x" />; }`,
    });
    if (!create.ok) throw new Error("createProject failed");
    let project = create.project;
    // Corrupt the source after creation
    const cardId = getFileId(project, "Card.jsx");
    const file = project.files.get(cardId)!;
    project = {
      ...project,
      files: new Map(project.files).set(cardId, {
        ...file,
        source: `this is not { valid javascript`,
      }),
    };
    const r = findAllInstancesOfDefinition(project, cardId, "x");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toContain("parse error");
  });

  it("call-site file parse error skips that file (best-effort)", () => {
    let project = buildProject(
      {
        path: "App.jsx",
        source: `import Card from "./Card"; function App() { return <Card />; }`,
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
        {
          path: "Broken.jsx",
          source: `import Card from "./Card"; <Card />`, // top-level JSX is a parse error
        },
      ],
    );
    // Corrupt the Broken.jsx source
    const brokenId = getFileId(project, "Broken.jsx");
    const file = project.files.get(brokenId)!;
    project = {
      ...project,
      files: new Map(project.files).set(brokenId, {
        ...file,
        source: `this is { hopelessly broken`,
      }),
    };

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    // Should still succeed — App.jsx contributes its 1 call site.
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(1);
  });

  it("HTML files skipped (no JSX expected)", () => {
    const create = createProject({
      name: "test",
      entryPath: "index.html",
      entrySource: `<!doctype html><html><body>hi</body></html>`,
    });
    if (!create.ok) throw new Error("createProject failed");
    let project = create.project;
    const cardAdd = addFile(project, {
      path: "Card.jsx",
      source: injectOids(
        `export default function Card() { return <article />; }`,
      ).source,
    });
    if (!cardAdd.ok) throw new Error("addFile failed");
    project = cardAdd.project;

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // No JSX file imports Card → 0 instances.
    expect(r.instances).toHaveLength(0);
  });
});

// ─── filter / boundary cases ────────────────────────────────────────────────

describe("findAllInstancesOfDefinition — filter cases", () => {
  it("non-matching imports are ignored", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Banner from "./Banner";
import Card from "./Card";
function App() { return <div><Card /><Banner /></div>; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
        {
          path: "Banner.jsx",
          source: `export default function Banner() { return <header />; }`,
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // Only <Card /> counts — <Banner /> is a different import.
    expect(r.instances).toHaveLength(1);
  });

  it("npm imports of same name don't match", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "react-card-library";
function App() { return <Card />; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // App.jsx imports a different Card from npm → 0 matches.
    expect(r.instances).toHaveLength(0);
  });

  it("definition root is NOT counted as its own instance", () => {
    // Card.jsx has <Card> defined. The definition's root element should
    // NOT appear in instances list (else the def would always self-include).
    const project = buildProject({
      path: "Card.jsx",
      source: `export default function Card() { return <article />; }`,
    });
    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.instances).toHaveLength(0);
  });

  it("namespace import ignored (rare; not v1 path)", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import * as Lib from "./components";
function App() { return <Lib.Card />; }
`.trim(),
      },
      [
        {
          path: "components.jsx",
          source: `export function Card() { return <article />; }`,
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "components.jsx"),
      getOidOfFirstElement(project, "components.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // <Lib.Card /> is JSXMemberExpression, not Identifier → 0 matches.
    expect(r.instances).toHaveLength(0);
  });

  it("multi-import (import { A, B })", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import { Card, Button } from "./components";
function App() { return <div><Card /><Button /></div>; }
`.trim(),
      },
      [
        {
          path: "components.jsx",
          source: `
export function Card() { return <article />; }
export function Button() { return <button>x</button>; }
`.trim(),
        },
      ],
    );

    const r = findAllInstancesOfDefinition(
      project,
      getFileId(project, "components.jsx"),
      getOidOfFirstElement(project, "components.jsx"),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // Should find Card; not Button (different OID).
    expect(r.instances).toHaveLength(1);
  });
});

// ─── invariants ─────────────────────────────────────────────────────────────

describe("findAllInstancesOfDefinition — invariants", () => {
  it("does not mutate project", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `import Card from "./Card"; function App() { return <Card />; }`,
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
      ],
    );
    const before = JSON.stringify({
      entry: project.entryFileId,
      files: Array.from(project.files.entries()).map(([id, f]) => [
        id,
        { path: f.path, source: f.source },
      ]),
    });
    findAllInstancesOfDefinition(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
    );
    const after = JSON.stringify({
      entry: project.entryFileId,
      files: Array.from(project.files.entries()).map(([id, f]) => [
        id,
        { path: f.path, source: f.source },
      ]),
    });
    expect(before).toBe(after);
  });

  it("deterministic across repeated calls", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "./Card";
function App() { return <div><Card /><Card /></div>; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
      ],
    );
    const cardId = getFileId(project, "Card.jsx");
    const cardOid = getOidOfFirstElement(project, "Card.jsx");

    const a = findAllInstancesOfDefinition(project, cardId, cardOid);
    const b = findAllInstancesOfDefinition(project, cardId, cardOid);
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) {
      expect(a.instances).toEqual(b.instances);
      expect(a.defExports).toEqual(b.defExports);
    }
  });
});
