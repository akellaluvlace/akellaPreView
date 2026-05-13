// Phase 5 §5 / audit-2026-05-04 medium-fix — direct-import test for
// `applyInsertChild` + `applySwap` (Phase C engines for the Insert /
// Swap tools). These ship the headline new-element flows; benches
// `bench-insert.mjs` + `bench-swap.mjs` inline their own copies. This
// file imports production directly for inline-mirror anti-pattern
// counterweight (audit `02-tests.md`).

import { describe, it, expect } from "vitest";
import { applyInsertChild } from "../lib/ast/operations/insert";
import { applySwap } from "../lib/ast/operations/swap";

const containerWithChild = () =>
  `export default function T() {
    return (
      <section data-dropin-id="aaaaaaaa">
        <p data-dropin-id="bbbbbbbb">existing</p>
      </section>
    );
  }`;

const emptyContainer = () =>
  `export default function T() { return <section data-dropin-id="aaaaaaaa"></section>; }`;

describe("applyInsertChild (production import)", () => {
  it("inserts asset as last child of an empty parent", () => {
    const r = applyInsertChild(emptyContainer(), {
      parentOid: "aaaaaaaa",
      jsx: '<button>click</button>',
    });
    expect(r.unchanged).toBe(false);
    expect(r.insertedOid).toBeTruthy();
    expect(r.source).toContain("<button");
    expect(r.source).toContain("click");
    // Inserted OID is on the asset's root element.
    expect(r.source).toContain(`data-dropin-id="${r.insertedOid}"`);
  });

  it("inserts asset after the last existing child (preserves siblings)", () => {
    const r = applyInsertChild(containerWithChild(), {
      parentOid: "aaaaaaaa",
      jsx: '<span>after</span>',
    });
    expect(r.unchanged).toBe(false);
    // Existing OID survived.
    expect(r.source).toContain('data-dropin-id="bbbbbbbb"');
    // Inserted OID exists.
    expect(r.source).toContain(`data-dropin-id="${r.insertedOid}"`);
    // The new element appears AFTER the existing one in source order.
    const existingIdx = r.source.indexOf('data-dropin-id="bbbbbbbb"');
    const newIdx = r.source.indexOf(`data-dropin-id="${r.insertedOid}"`);
    expect(newIdx).toBeGreaterThan(existingIdx);
  });

  it("mints fresh OIDs across nested asset elements (no collisions)", () => {
    const r = applyInsertChild(emptyContainer(), {
      parentOid: "aaaaaaaa",
      jsx: '<div><span>a</span><span>b</span></div>',
    });
    expect(r.unchanged).toBe(false);
    const oids = (r.source.match(/data-dropin-id="([^"]+)"/g) || []).map((m) =>
      m.slice('data-dropin-id="'.length, -1),
    );
    // 1 original + 3 inserted (div + 2 spans) = 4 unique
    expect(new Set(oids).size).toBe(oids.length);
    expect(oids.length).toBe(4);
  });

  it("bails when parent OID not found", () => {
    const r = applyInsertChild(emptyContainer(), {
      parentOid: "ffffffff",
      jsx: "<span>x</span>",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
    expect(r.insertedOid).toBeNull();
  });

  it("bails on unparseable source", () => {
    const r = applyInsertChild("not jsx <<<", {
      parentOid: "aaaaaaaa",
      jsx: "<span>x</span>",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails on unparseable asset", () => {
    const r = applyInsertChild(emptyContainer(), {
      parentOid: "aaaaaaaa",
      jsx: "<<this is not jsx>>",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails on self-closing parent (e.g. <img/>)", () => {
    const src = `export default function T() { return <img data-dropin-id="aaaaaaaa" src="x"/>; }`;
    const r = applyInsertChild(src, {
      parentOid: "aaaaaaaa",
      jsx: "<span>x</span>",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("returns shape: { source, unchanged, reason, insertedOid }", () => {
    const r = applyInsertChild(emptyContainer(), {
      parentOid: "aaaaaaaa",
      jsx: "<span>x</span>",
    });
    expect(typeof r.source).toBe("string");
    expect(typeof r.unchanged).toBe("boolean");
    expect(r.reason === null || typeof r.reason === "string").toBe(true);
    expect(r.insertedOid === null || typeof r.insertedOid === "string").toBe(
      true,
    );
  });
});

describe("applySwap (production import)", () => {
  it("swaps a leaf element wholesale (children of original discarded by default)", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">
          <span data-dropin-id="cccccccc">old</span>
        </div>
      </section>;
    }`;
    const r = applySwap(src, {
      oid: "bbbbbbbb",
      jsx: "<button>new</button>",
    });
    expect(r.unchanged).toBe(false);
    expect(r.swappedOid).toBeTruthy();
    // The original bbbb and its nested cccc are gone.
    expect(r.source).not.toContain('data-dropin-id="bbbbbbbb"');
    expect(r.source).not.toContain('data-dropin-id="cccccccc"');
    // The asset replaced them.
    expect(r.source).toContain("<button");
    expect(r.source).toContain("new");
  });

  it("preserveChildren: true keeps original children inside asset shell", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">
          <span data-dropin-id="cccccccc">keep me</span>
        </div>
      </section>;
    }`;
    const r = applySwap(src, {
      oid: "bbbbbbbb",
      jsx: '<button className="btn"></button>',
      preserveChildren: true,
    });
    expect(r.unchanged).toBe(false);
    // The original bbbb shell is replaced (gone), but cccc (its child) survives.
    expect(r.source).not.toContain('data-dropin-id="bbbbbbbb"');
    expect(r.source).toContain('data-dropin-id="cccccccc"');
    expect(r.source).toContain("keep me");
    expect(r.source).toContain("<button");
  });

  it("bails when OID not found", () => {
    const src = `export default function T() { return <section data-dropin-id="aaaaaaaa"><p data-dropin-id="bbbbbbbb">x</p></section>; }`;
    const r = applySwap(src, { oid: "ffffffff", jsx: "<button>x</button>" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
    expect(r.swappedOid).toBeNull();
  });

  it("bails on top-level element (no JSX parent)", () => {
    const src = `export default function T() { return <div data-dropin-id="aaaaaaaa">x</div>; }`;
    const r = applySwap(src, { oid: "aaaaaaaa", jsx: "<button>x</button>" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toMatch(/root|swap/i);
  });

  it("bails on unparseable source", () => {
    const r = applySwap("not jsx <<<", {
      oid: "aaaaaaaa",
      jsx: "<button>x</button>",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails on unparseable asset", () => {
    const src = `export default function T() { return <section data-dropin-id="aaaaaaaa"><p data-dropin-id="bbbbbbbb">x</p></section>; }`;
    const r = applySwap(src, {
      oid: "bbbbbbbb",
      jsx: "<<unparseable>>",
    });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("preserves siblings of the swapped element", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <h1 data-dropin-id="bbbbbbbb">title</h1>
        <p data-dropin-id="cccccccc">para</p>
        <span data-dropin-id="dddddddd">end</span>
      </section>;
    }`;
    const r = applySwap(src, {
      oid: "cccccccc",
      jsx: "<button>x</button>",
    });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain('data-dropin-id="bbbbbbbb"');
    expect(r.source).toContain('data-dropin-id="dddddddd"');
    expect(r.source).not.toContain('data-dropin-id="cccccccc"');
  });

  it("returns shape: { source, unchanged, reason, swappedOid }", () => {
    const src = `export default function T() { return <section data-dropin-id="aaaaaaaa"><p data-dropin-id="bbbbbbbb">x</p></section>; }`;
    const r = applySwap(src, { oid: "bbbbbbbb", jsx: "<button>x</button>" });
    expect(typeof r.source).toBe("string");
    expect(typeof r.unchanged).toBe("boolean");
    expect(r.reason === null || typeof r.reason === "string").toBe(true);
    expect(r.swappedOid === null || typeof r.swappedOid === "string").toBe(
      true,
    );
  });
});
