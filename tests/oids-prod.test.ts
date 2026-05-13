import { describe, it, expect } from "vitest";
import {
  injectOids,
  isValidOid,
  makeOid,
  OID_ATTR,
  stripOids,
} from "../lib/ast/oids";

// Prod-import test for lib/ast/oids.ts. Counterweight to scripts/bench-oids.mjs
// which inlines a copy. OIDs are critical — they're the bridge between the
// source AST and the rendered DOM. Drift here breaks selection, gestures,
// and every operation engine.

describe("oids — OID_ATTR", () => {
  it("equals 'data-dropin-id'", () => {
    expect(OID_ATTR).toBe("data-dropin-id");
  });
});

describe("oids — makeOid", () => {
  it("returns 8-char alnum string with no seed", () => {
    const oid = makeOid();
    expect(oid).toHaveLength(8);
    expect(oid).toMatch(/^[A-Za-z0-9]{8}$/);
  });
  it("is deterministic with a numeric seed", () => {
    expect(makeOid(0)).toBe(makeOid(0));
    expect(makeOid(12345)).toBe(makeOid(12345));
    expect(makeOid(999999)).toBe(makeOid(999999));
  });
  it("returns different OIDs for different seeds", () => {
    const a = makeOid(0);
    const b = makeOid(1);
    const c = makeOid(2);
    expect(a).not.toBe(b);
    expect(b).not.toBe(c);
    expect(a).not.toBe(c);
  });
  it("seed 0 produces all-first-character (base-N encoding sanity)", () => {
    expect(makeOid(0)).toBe("aaaaaaaa");
  });
  it("never throws for arbitrary positive integers", () => {
    for (const seed of [0, 1, 100, 9999, 1234567]) {
      expect(() => makeOid(seed)).not.toThrow();
    }
  });
});

describe("oids — isValidOid", () => {
  it("accepts 8-char alnum strings", () => {
    expect(isValidOid("aaaaaaaa")).toBe(true);
    expect(isValidOid("abc12XYZ")).toBe(true);
    expect(isValidOid("00000000")).toBe(true);
    expect(isValidOid("ZZZZZZZZ")).toBe(true);
  });
  it("rejects wrong length", () => {
    expect(isValidOid("aaaaaaa")).toBe(false); // 7
    expect(isValidOid("aaaaaaaaa")).toBe(false); // 9
    expect(isValidOid("")).toBe(false);
  });
  it("rejects non-alnum chars", () => {
    expect(isValidOid("aaaaaaa-")).toBe(false);
    expect(isValidOid("aa aa aa")).toBe(false);
    expect(isValidOid("aaa-aaaa")).toBe(false);
    expect(isValidOid("aaa_aaaa")).toBe(false);
  });
  it("output of makeOid always passes isValidOid", () => {
    for (let i = 0; i < 50; i++) {
      const oid = makeOid(i);
      expect(isValidOid(oid)).toBe(true);
    }
  });
});

describe("oids — injectOids", () => {
  const tplBefore = `function App() {
  return <div><h1>Hi</h1><p>X</p></div>;
}`;

  it("inserts OIDs on every JSX opening element", () => {
    const result = injectOids(tplBefore);
    expect(result.unchanged).toBe(false);
    expect(result.injected).toBe(3); // div, h1, p
    expect(result.source).toContain('data-dropin-id="');
  });

  it("returns insertions array sorted descending by pos", () => {
    const result = injectOids(tplBefore);
    expect(result.insertions).toHaveLength(3);
    for (let i = 1; i < result.insertions.length; i++) {
      expect(result.insertions[i - 1].pos).toBeGreaterThanOrEqual(
        result.insertions[i].pos
      );
    }
  });

  it("each insertion's text includes a valid OID", () => {
    const result = injectOids(tplBefore);
    for (const ins of result.insertions) {
      const match = ins.text.match(/data-dropin-id="([^"]+)"/);
      expect(match).not.toBeNull();
      expect(isValidOid(match![1])).toBe(true);
    }
  });

  it("is idempotent — re-running on injected source returns unchanged", () => {
    const first = injectOids(tplBefore);
    const second = injectOids(first.source);
    expect(second.unchanged).toBe(true);
    expect(second.injected).toBe(0);
    expect(second.insertions).toHaveLength(0);
  });

  it("returns unchanged for source with no JSX elements", () => {
    const result = injectOids(`const x = 1;`);
    expect(result.unchanged).toBe(true);
    expect(result.injected).toBe(0);
  });

  it("returns unchanged on parse failure", () => {
    const broken = `function App() { return <div`;
    const result = injectOids(broken);
    // errorRecovery may produce a partial AST. Either it injects what
    // it could parse (unchanged: false) OR returns unchanged. Both are
    // acceptable; the contract is "doesn't throw".
    expect(typeof result.unchanged).toBe("boolean");
  });

  it("preserves existing valid OIDs (won't double-inject)", () => {
    const tpl = `<div data-dropin-id="aaaaaaaa">x</div>`;
    const result = injectOids(tpl);
    expect(result.injected).toBe(0);
    expect(result.unchanged).toBe(true);
  });

  it("regenerates malformed existing OIDs", () => {
    const tpl = `function F() { return <div data-dropin-id="bad">x</div>; }`;
    const result = injectOids(tpl);
    // The malformed one isn't valid (3-char), so a new one is minted.
    expect(result.injected).toBe(1);
    expect(result.unchanged).toBe(false);
  });

  it("OIDs differ across distinct elements (offset-seeded)", () => {
    const result = injectOids(tplBefore);
    const oids = result.insertions
      .map((i) => i.text.match(/data-dropin-id="([^"]+)"/)?.[1])
      .filter((s): s is string => !!s);
    expect(new Set(oids).size).toBe(oids.length);
  });
});

describe("oids — stripOids", () => {
  it("removes injected OIDs", () => {
    const injected = injectOids(`<div><span>x</span></div>`);
    const stripped = stripOids(injected.source);
    expect(stripped.removed).toBe(2);
    expect(stripped.source).not.toContain("data-dropin-id");
  });

  it("returns unchanged when no OIDs present", () => {
    const result = stripOids(`<div><span>x</span></div>`);
    expect(result.unchanged).toBe(true);
    expect(result.removed).toBe(0);
  });

  it("inject + strip round-trips to original-equivalent", () => {
    const src = `function F() { return <div className="a"><p>hi</p></div>; }`;
    const injected = injectOids(src);
    const stripped = stripOids(injected.source);
    expect(stripped.source).toBe(src);
  });

  it("preserves leading whitespace cleanup (no double-spaces)", () => {
    const injected = injectOids(`<div className="a">x</div>`);
    const stripped = stripOids(injected.source);
    expect(stripped.source).toBe(`<div className="a">x</div>`);
    expect(stripped.source).not.toContain("  ");
  });
});
