import { describe, it, expect } from "vitest";
import { planEverywhereSwap } from "../lib/swap/plan-everywhere-swap";
import { createProject, addFile } from "../lib/files/operations";
import type { Project } from "../lib/files/types";
import type { SlotEnvelope } from "../lib/swap/slot-capacity";

function mkProject(opts: { name: string; entryPath: string; entrySource: string }): Project {
  const r = createProject(opts);
  if (!r.ok) throw new Error(`createProject failed: ${r.error}`);
  return r.project;
}

// Phase F orchestrator — Workspace's everywhere-mode swap branch.
// Composition of findCrossFileDefinition (or inline-def fallback) +
// preflightSwapAcrossInstances + applySwap + createEdit.
//
// Pure tests: no DOM, no async. The async part (envelope fetching) is
// pre-resolved by callers; this helper consumes the lookup as a closure.

const ROOMY_ENV: SlotEnvelope = {
  availableWidthPx: 10000,
  availableHeightPx: 10000,
  preferredAspectRatio: null,
};

const TIGHT_ENV: SlotEnvelope = {
  availableWidthPx: 50,
  availableHeightPx: 50,
  preferredAspectRatio: null,
};

describe("planEverywhereSwap — orchestration", () => {
  it("skips when tag is not capitalized (HTML element)", () => {
    const p = mkProject({
      name: "x",
      entryPath: "App.jsx",
      entrySource: `<div data-dropin-id="root" />`,
    });
    const plan = planEverywhereSwap(
      p,
      p.entryFileId,
      `<div data-dropin-id="root" />`,
      "root",
      "div",
      `<section className="bg-red-500" />`,
      false,
      { envelopeForInstance: () => ROOMY_ENV },
    );
    expect(plan.kind).toBe("skip");
  });

  it("skips when no cross-file or inline def exists for the tag", () => {
    const src = `function App(){return (<NoSuchThing data-dropin-id="x"/>);}`;
    const p = mkProject({
      name: "x",
      entryPath: "App.jsx",
      entrySource: src,
    });
    const plan = planEverywhereSwap(
      p,
      p.entryFileId,
      src,
      "x",
      "NoSuchThing",
      `<section className="x" />`,
      false,
      { envelopeForInstance: () => ROOMY_ENV },
    );
    expect(plan.kind).toBe("skip");
  });

  it("ok path with inline def — single-diff Edit on the def file", () => {
    const src = `function Card(){return (<div data-dropin-id="def-root" className="bg-gray-100 p-4">a</div>);}
function App(){return (<main data-dropin-id="main"><Card data-dropin-id="inst-1"/></main>);}`;
    const p = mkProject({
      name: "x",
      entryPath: "App.jsx",
      entrySource: src,
    });
    const plan = planEverywhereSwap(
      p,
      p.entryFileId,
      src,
      "inst-1",
      "Card",
      `<section className="bg-blue-500 p-2">y</section>`,
      false,
      { envelopeForInstance: () => ROOMY_ENV },
    );
    expect(plan.kind).toBe("ok");
    if (plan.kind === "ok") {
      expect(plan.tag).toBe("Card");
      expect(plan.affectedCount).toBeGreaterThanOrEqual(1);
      expect(plan.edit.diffs.length).toBe(1);
      // The single diff targets the active file (inline def).
      expect(plan.edit.diffs[0].fileId).toBe(p.entryFileId);
      // Reason carries the tag.
      expect(plan.edit.reason).toMatch(/everywhere-swap:<Card>/);
    }
  });

  it("aborts on preflight when the new asset overflows the slot envelope", () => {
    const src = `function Card(){return (<div data-dropin-id="def-root" className="bg-gray-100">a</div>);}
function App(){return (<main data-dropin-id="main"><Card data-dropin-id="inst-1"/></main>);}`;
    const p = mkProject({
      name: "x",
      entryPath: "App.jsx",
      entrySource: src,
    });
    const plan = planEverywhereSwap(
      p,
      p.entryFileId,
      src,
      "inst-1",
      "Card",
      `<section className="w-[800px] min-w-[600px]">y</section>`,
      false,
      // The asset's static-analysis capacity has min-w >= 600px; tight
      // env (50px) fails the fit check.
      { envelopeForInstance: () => TIGHT_ENV },
    );
    expect(plan.kind).toBe("abort-preflight");
    if (plan.kind === "abort-preflight") {
      expect(plan.summary).toContain("instances fit");
      expect(plan.affectedCount).toBeGreaterThanOrEqual(1);
    }
  });

  it("aborts when applySwap on the def file bails", () => {
    const src = `function Card(){return (<div data-dropin-id="def-root" className="bg-gray-100">a</div>);}
function App(){return (<main data-dropin-id="main"><Card data-dropin-id="inst-1"/></main>);}`;
    const p = mkProject({
      name: "x",
      entryPath: "App.jsx",
      entrySource: src,
    });
    const plan = planEverywhereSwap(
      p,
      p.entryFileId,
      src,
      "inst-1",
      "Card",
      // Self-closing asset + preserveChildren=true → swap engine bails
      `<section className="x" />`,
      true,
      { envelopeForInstance: () => ROOMY_ENV },
    );
    expect(plan.kind).toBe("abort-bail");
    if (plan.kind === "abort-bail") {
      expect(plan.reason).toMatch(/self-closing|asset/);
    }
  });

  it("skips when the user invokes swap on the def root itself (single-instance flow's job)", () => {
    const src = `function Card(){return (<div data-dropin-id="def-root" className="bg-gray-100">a</div>);}
function App(){return (<main data-dropin-id="main"><Card data-dropin-id="inst-1"/></main>);}`;
    const p = mkProject({
      name: "x",
      entryPath: "App.jsx",
      entrySource: src,
    });
    const plan = planEverywhereSwap(
      p,
      p.entryFileId,
      src,
      "def-root",
      "Card",
      `<section className="x">y</section>`,
      false,
      { envelopeForInstance: () => ROOMY_ENV },
    );
    expect(plan.kind).toBe("skip");
  });

  it("cross-file def: ok path produces a diff against the def file (NOT active)", () => {
    let p = mkProject({
      name: "x",
      entryPath: "App.jsx",
      entrySource: `import Card from "./Card";
export default function App(){return (<main data-dropin-id="main"><Card data-dropin-id="inst-1"/></main>);}`,
    });
    const cardAdd = addFile(p, {
      path: "Card.jsx",
      source: `export default function Card(){return (<div data-dropin-id="def-root" className="bg-gray-100 p-4">a</div>);}`,
    });
    expect(cardAdd.ok).toBe(true);
    if (!cardAdd.ok) return;
    p = cardAdd.project;
    const cardFileId = Array.from(p.files.values()).find(
      (f) => f.path === "Card.jsx",
    )!.id;

    const plan = planEverywhereSwap(
      p,
      p.entryFileId,
      `import Card from "./Card";
export default function App(){return (<main data-dropin-id="main"><Card data-dropin-id="inst-1"/></main>);}`,
      "inst-1",
      "Card",
      `<section className="bg-blue-500 p-2">y</section>`,
      false,
      { envelopeForInstance: () => ROOMY_ENV },
    );
    expect(plan.kind).toBe("ok");
    if (plan.kind === "ok") {
      expect(plan.edit.diffs.length).toBe(1);
      // The diff targets the Card.jsx file, NOT App.jsx.
      expect(plan.edit.diffs[0].fileId).toBe(cardFileId);
      expect(plan.edit.diffs[0].fileId).not.toBe(p.entryFileId);
    }
  });

  it("aborts when an instance has missing envelope (multi-page proxy)", () => {
    // Two-file project. Card def in Card.jsx, two instances: one in
    // App.jsx (envelope provided), one in About.jsx (envelope null).
    let p = mkProject({
      name: "x",
      entryPath: "App.jsx",
      entrySource: `import Card from "./Card";
export default function App(){return (<Card data-dropin-id="inst-A"/>);}`,
    });
    let r = addFile(p, {
      path: "Card.jsx",
      source: `export default function Card(){return (<div data-dropin-id="def-root" className="bg-gray-100">a</div>);}`,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    p = r.project;
    r = addFile(p, {
      path: "About.jsx",
      source: `import Card from "./Card";
export default function About(){return (<Card data-dropin-id="inst-B"/>);}`,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    p = r.project;

    const plan = planEverywhereSwap(
      p,
      p.entryFileId,
      `import Card from "./Card";
export default function App(){return (<Card data-dropin-id="inst-A"/>);}`,
      "inst-A",
      "Card",
      `<section className="bg-blue-500">y</section>`,
      false,
      // Only inst-A has an envelope; inst-B (in About.jsx) returns null.
      {
        envelopeForInstance: (inst) =>
          inst.oid === "inst-A" ? ROOMY_ENV : null,
      },
    );
    expect(plan.kind).toBe("abort-preflight");
    if (plan.kind === "abort-preflight") {
      expect(plan.summary).toMatch(/couldn't be measured|envelope/i);
    }
  });
});
