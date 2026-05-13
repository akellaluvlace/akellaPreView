// Phase F foundation — preflight prod-import test suite.
//
// Pure-logic only. Composes instance-graph + slot-capacity end-to-end
// against synthetic projects and capacity inputs.

import { describe, it, expect } from "vitest";
import {
  preflightSwapAcrossInstances,
  summarizePreflightResult,
  type EnvelopeLookup,
  type InstanceFitFailure,
} from "../lib/swap/preflight";
import { createProject, addFile } from "../lib/files/operations";
import { injectOids, OID_ATTR } from "../lib/ast/oids";
import type {
  SlotCapacity,
  SlotEnvelope,
} from "../lib/swap/slot-capacity";
import type { FileId, Project } from "../lib/files/types";

// ─── helpers ────────────────────────────────────────────────────────────────

function buildProject(
  entry: { path: string; source: string },
  others: Array<{ path: string; source: string }> = [],
): Project {
  const inject = (path: string, source: string): string =>
    path.endsWith(".jsx") || path.endsWith(".tsx")
      ? injectOids(source).source
      : source;

  const create = createProject({
    name: "test",
    entryPath: entry.path,
    entrySource: inject(entry.path, entry.source),
  });
  if (!create.ok) throw new Error("createProject failed");
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
  for (const f of project.files.values()) if (f.path === path) return f.id;
  throw new Error(`file not in project: ${path}`);
}

function getOidOfFirstElement(project: Project, path: string): string {
  const file = Array.from(project.files.values()).find((f) => f.path === path);
  if (!file) throw new Error(`file not in project: ${path}`);
  const m = file.source.match(new RegExp(`${OID_ATTR}="([^"]+)"`));
  if (!m) throw new Error(`no OID in ${path}`);
  return m[1];
}

const FILL_CAPACITY: SlotCapacity = {
  category: "components",
  flexBehavior: "fill",
  source: "library",
  intrinsic: {
    minWidthPx: null,
    minHeightPx: null,
    maxWidthPx: null,
    maxHeightPx: null,
    aspectRatio: null,
  },
};

const NEEDS_320PX: SlotCapacity = {
  category: "components",
  flexBehavior: "fit-content",
  source: "library",
  intrinsic: {
    minWidthPx: 320,
    minHeightPx: null,
    maxWidthPx: null,
    maxHeightPx: null,
    aspectRatio: null,
  },
};

function envelope(
  w: number,
  h: number,
  ar: number | null = null,
): SlotEnvelope {
  return { availableWidthPx: w, availableHeightPx: h, preferredAspectRatio: ar };
}

// ─── happy paths ────────────────────────────────────────────────────────────

describe("preflightSwapAcrossInstances — happy paths", () => {
  it("zero instances → trivially ok", () => {
    const project = buildProject({
      path: "Card.jsx",
      source: `export default function Card() { return <article />; }`,
    });
    const cardId = getFileId(project, "Card.jsx");
    const cardOid = getOidOfFirstElement(project, "Card.jsx");

    const r = preflightSwapAcrossInstances(
      project,
      cardId,
      cardOid,
      FILL_CAPACITY,
      () => envelope(320, 320),
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.okCount).toBe(0);
  });

  it("all instances fit unconstrained capacity", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "./Card";
function App() { return <div><Card /><Card /><Card /></div>; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
      ],
    );
    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      FILL_CAPACITY,
      () => envelope(320, 320),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.okCount).toBe(3);
      expect(r.instances).toHaveLength(3);
    }
  });

  it("all instances fit when capacity meets every envelope", () => {
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
    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      NEEDS_320PX, // needs 320px; envelopes give 400px
      () => envelope(400, 300),
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.okCount).toBe(2);
  });
});

// ─── failure paths ──────────────────────────────────────────────────────────

describe("preflightSwapAcrossInstances — failure paths", () => {
  it("single instance fails: ok=false with failures populated", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "./Card";
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
    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      NEEDS_320PX, // needs 320; envelope only 200
      () => envelope(200, 200),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.failures).toHaveLength(1);
      expect(r.failures[0].reasons[0]).toContain("≥ 320px");
      expect(r.okInstances).toHaveLength(0);
    }
  });

  it("partial pass: some fit, some fail", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "./Card";
function App() { return <div><Card /><Card /><Card /></div>; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
      ],
    );

    // Instance #0 → 200px (fail), #1 → 400px (pass), #2 → 350px (pass).
    let callIdx = 0;
    const widths = [200, 400, 350];
    const lookup: EnvelopeLookup = () => envelope(widths[callIdx++] ?? 0, 300);

    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      NEEDS_320PX,
      lookup,
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.failures).toHaveLength(1);
      expect(r.okInstances).toHaveLength(2);
    }
  });

  it("multiple instances all fail", () => {
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
    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      NEEDS_320PX,
      () => envelope(100, 100),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.failures).toHaveLength(2);
      expect(r.okInstances).toHaveLength(0);
    }
  });

  it("missing envelope (lookup returns null) tracked separately", () => {
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
    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      FILL_CAPACITY,
      () => null, // can never measure
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.missingEnvelope).toHaveLength(2);
      expect(r.failures).toHaveLength(0);
      expect(r.okInstances).toHaveLength(0);
    }
  });

  it("mixed: 1 ok, 1 fail, 1 missing", () => {
    const project = buildProject(
      {
        path: "App.jsx",
        source: `
import Card from "./Card";
function App() { return <div><Card /><Card /><Card /></div>; }
`.trim(),
      },
      [
        {
          path: "Card.jsx",
          source: `export default function Card() { return <article />; }`,
        },
      ],
    );
    let callIdx = 0;
    const lookup: EnvelopeLookup = () => {
      const i = callIdx++;
      if (i === 0) return envelope(400, 300); // ok
      if (i === 1) return envelope(100, 100); // fail
      return null; // missing
    };
    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      NEEDS_320PX,
      lookup,
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.okInstances).toHaveLength(1);
      expect(r.failures).toHaveLength(1);
      expect(r.missingEnvelope).toHaveLength(1);
    }
  });
});

// ─── top-level error path ───────────────────────────────────────────────────

describe("preflightSwapAcrossInstances — top-level errors", () => {
  it("def file not in project surfaces topLevelReason", () => {
    const project = buildProject({
      path: "App.jsx",
      source: `function App() { return <div />; }`,
    });
    const r = preflightSwapAcrossInstances(
      project,
      "nonexistent" as FileId,
      "anyoid",
      FILL_CAPACITY,
      () => envelope(320, 320),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.topLevelReason).toContain("def file not in project");
      expect(r.failures).toHaveLength(0);
      expect(r.okInstances).toHaveLength(0);
    }
  });

  it("defRootOid not found surfaces topLevelReason", () => {
    const project = buildProject({
      path: "Card.jsx",
      source: `export default function Card() { return <article />; }`,
    });
    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      "fake-oid",
      FILL_CAPACITY,
      () => envelope(320, 320),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.topLevelReason).toContain("not found");
  });
});

// ─── summarizePreflightResult ──────────────────────────────────────────────

describe("summarizePreflightResult", () => {
  it("ok summary mentions count + 'ready'", () => {
    const msg = summarizePreflightResult({
      ok: true,
      instances: [],
      okCount: 5,
    });
    expect(msg).toContain("5");
    expect(msg).toContain("ready");
  });

  it("zero ok: 'All 0 instances'", () => {
    const msg = summarizePreflightResult({
      ok: true,
      instances: [],
      okCount: 0,
    });
    expect(msg).toContain("0");
  });

  it("top-level error short-circuits to that reason", () => {
    const msg = summarizePreflightResult({
      ok: false,
      topLevelReason: "def file not in project: foo",
      failures: [],
      okInstances: [],
      missingEnvelope: [],
    });
    expect(msg).toContain("def file not in project");
  });

  it("partial-fail summary mentions counts + first 3 failures", () => {
    const failures: InstanceFitFailure[] = [
      { instance: { fileId: "fA" as FileId, oid: "o1" }, reasons: ["≥ 320px"] },
      { instance: { fileId: "fA" as FileId, oid: "o2" }, reasons: ["≥ 320px"] },
    ];
    const msg = summarizePreflightResult({
      ok: false,
      failures,
      okInstances: [{ fileId: "fA" as FileId, oid: "o3" }],
      missingEnvelope: [],
    });
    expect(msg).toContain("1 of 3");
    expect(msg).toContain("o1");
    expect(msg).toContain("o2");
  });

  it("4+ failures abbreviated as '+N more'", () => {
    const failures: InstanceFitFailure[] = [
      { instance: { fileId: "fA" as FileId, oid: "o1" }, reasons: ["x"] },
      { instance: { fileId: "fA" as FileId, oid: "o2" }, reasons: ["x"] },
      { instance: { fileId: "fA" as FileId, oid: "o3" }, reasons: ["x"] },
      { instance: { fileId: "fA" as FileId, oid: "o4" }, reasons: ["x"] },
      { instance: { fileId: "fA" as FileId, oid: "o5" }, reasons: ["x"] },
    ];
    const msg = summarizePreflightResult({
      ok: false,
      failures,
      okInstances: [],
      missingEnvelope: [],
    });
    expect(msg).toContain("+2 more");
  });

  it("missing envelope mentioned in summary", () => {
    const msg = summarizePreflightResult({
      ok: false,
      failures: [],
      okInstances: [],
      missingEnvelope: [
        { fileId: "fA" as FileId, oid: "o1" },
        { fileId: "fA" as FileId, oid: "o2" },
      ],
    });
    expect(msg).toContain("2");
    expect(msg).toContain("couldn't be measured");
  });
});

// ─── invariants ─────────────────────────────────────────────────────────────

describe("preflightSwapAcrossInstances — invariants", () => {
  it("ok=false implies (failures + missing) > 0", () => {
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
    const r = preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      NEEDS_320PX,
      () => envelope(100, 100),
    );
    if (!r.ok) {
      expect(r.failures.length + r.missingEnvelope.length).toBeGreaterThan(0);
    }
  });

  it("envelopeFor called once per instance", () => {
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
    let calls = 0;
    preflightSwapAcrossInstances(
      project,
      getFileId(project, "Card.jsx"),
      getOidOfFirstElement(project, "Card.jsx"),
      FILL_CAPACITY,
      () => {
        calls++;
        return envelope(320, 320);
      },
    );
    expect(calls).toBe(2);
  });

  it("deterministic — repeated runs produce same result", () => {
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
    const cardId = getFileId(project, "Card.jsx");
    const cardOid = getOidOfFirstElement(project, "Card.jsx");
    const lookup: EnvelopeLookup = () => envelope(400, 300);

    const a = preflightSwapAcrossInstances(project, cardId, cardOid, NEEDS_320PX, lookup);
    const b = preflightSwapAcrossInstances(project, cardId, cardOid, NEEDS_320PX, lookup);
    expect(a.ok).toBe(b.ok);
    if (a.ok && b.ok) expect(a.okCount).toBe(b.okCount);
  });
});
