// Phase 5 §5 / audit-2026-05-04 medium-fix — direct-import test for
// `applyDelete` + `applyDuplicate`. These are the two structural
// operations Workspace's multi-op handlers wrap (the audit fixed silent
// partial-failure swallowing on the *handlers*; this file covers the
// underlying engines themselves). Companion benches `bench-delete.mjs`
// and `bench-duplicate.mjs` inline their own copies of the algorithms;
// this file imports production directly for the inline-mirror anti-
// pattern counterweight (audit `02-tests.md`).

import { describe, it, expect } from "vitest";
import { applyDelete } from "../lib/ast/operations/delete";
import { applyDuplicate } from "../lib/ast/operations/duplicate";

const tplWithSiblings = () => `export default function T() {
  return (
    <section data-dropin-id="aaaaaaaa">
      <h1 data-dropin-id="bbbbbbbb">title</h1>
      <p data-dropin-id="cccccccc">para</p>
      <span data-dropin-id="dddddddd">end</span>
    </section>
  );
}`;

describe("applyDelete (production import)", () => {
  it("removes a middle child preserving siblings", () => {
    const r = applyDelete(tplWithSiblings(), { oid: "cccccccc" });
    expect(r.unchanged).toBe(false);
    expect(r.source).not.toContain('data-dropin-id="cccccccc"');
    expect(r.source).toContain('data-dropin-id="bbbbbbbb"');
    expect(r.source).toContain('data-dropin-id="dddddddd"');
  });

  it("removes the first child", () => {
    const r = applyDelete(tplWithSiblings(), { oid: "bbbbbbbb" });
    expect(r.unchanged).toBe(false);
    expect(r.source).not.toContain('data-dropin-id="bbbbbbbb"');
    expect(r.source).toContain('data-dropin-id="cccccccc"');
  });

  it("removes the last child", () => {
    const r = applyDelete(tplWithSiblings(), { oid: "dddddddd" });
    expect(r.unchanged).toBe(false);
    expect(r.source).not.toContain('data-dropin-id="dddddddd"');
    expect(r.source).toContain('data-dropin-id="cccccccc"');
  });

  it("removes an element along with its entire subtree", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">
          <span data-dropin-id="cccccccc">nested</span>
        </div>
        <p data-dropin-id="dddddddd">keep</p>
      </section>;
    }`;
    const r = applyDelete(src, { oid: "bbbbbbbb" });
    expect(r.unchanged).toBe(false);
    // Both the parent (bbbb) AND its nested child (cccc) are gone.
    expect(r.source).not.toContain('data-dropin-id="bbbbbbbb"');
    expect(r.source).not.toContain('data-dropin-id="cccccccc"');
    expect(r.source).toContain('data-dropin-id="dddddddd"');
  });

  it("bails on top-level element (no JSXElement parent)", () => {
    const src = `export default function T() { return <div data-dropin-id="aaaaaaaa">x</div>; }`;
    const r = applyDelete(src, { oid: "aaaaaaaa" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails on missing OID", () => {
    const r = applyDelete(tplWithSiblings(), { oid: "ffffffff" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("bails on unparseable source", () => {
    const r = applyDelete("not jsx <<<<", { oid: "aaaaaaaa" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
  });

  it("returns shape: { source, unchanged, reason }", () => {
    const r = applyDelete(tplWithSiblings(), { oid: "cccccccc" });
    expect(typeof r.source).toBe("string");
    expect(typeof r.unchanged).toBe("boolean");
    expect(r.reason === null || typeof r.reason === "string").toBe(true);
  });
});

describe("applyDuplicate (production import)", () => {
  it("duplicates a leaf as next sibling and returns a fresh OID", () => {
    const r = applyDuplicate(tplWithSiblings(), { oid: "cccccccc" });
    expect(r.unchanged).toBe(false);
    expect(r.newRootOid).toBeTruthy();
    expect(r.newRootOid).not.toBe("cccccccc");
    // Original cccc is still there.
    expect(r.source).toContain('data-dropin-id="cccccccc"');
    // newRootOid is also present (but different).
    expect(r.source).toContain(`data-dropin-id="${r.newRootOid}"`);
  });

  it("duplicate count of OID-bearing tags increases by exactly the duplicate's subtree size", () => {
    const before = tplWithSiblings();
    const beforeCount = (before.match(/data-dropin-id=/g) || []).length;
    const r = applyDuplicate(before, { oid: "cccccccc" });
    expect(r.unchanged).toBe(false);
    const afterCount = (r.source.match(/data-dropin-id=/g) || []).length;
    // <p> is a leaf — exactly one new OID added.
    expect(afterCount).toBe(beforeCount + 1);
  });

  it("duplicates a subtree and mints fresh OIDs for every element", () => {
    const src = `export default function T() {
      return <section data-dropin-id="aaaaaaaa">
        <div data-dropin-id="bbbbbbbb">
          <span data-dropin-id="cccccccc">nested</span>
        </div>
      </section>;
    }`;
    const beforeCount = (src.match(/data-dropin-id=/g) || []).length;
    const r = applyDuplicate(src, { oid: "bbbbbbbb" });
    expect(r.unchanged).toBe(false);
    expect(r.newRootOid).toBeTruthy();
    const afterCount = (r.source.match(/data-dropin-id=/g) || []).length;
    // bbbb subtree has 2 elements; duplicate adds 2 new OIDs.
    expect(afterCount).toBe(beforeCount + 2);
    // None of the original OIDs appear twice in the new source.
    const oids = r.source.match(/data-dropin-id="([^"]+)"/g) || [];
    const seen = new Set<string>();
    for (const o of oids) {
      expect(seen.has(o)).toBe(false);
      seen.add(o);
    }
  });

  it("preserves all sibling OIDs intact", () => {
    const r = applyDuplicate(tplWithSiblings(), { oid: "cccccccc" });
    expect(r.unchanged).toBe(false);
    for (const oid of ["aaaaaaaa", "bbbbbbbb", "cccccccc", "dddddddd"]) {
      expect(r.source).toContain(`data-dropin-id="${oid}"`);
    }
  });

  it("deterministic — same input produces same output", () => {
    const before = tplWithSiblings();
    const r1 = applyDuplicate(before, { oid: "cccccccc" });
    const r2 = applyDuplicate(before, { oid: "cccccccc" });
    expect(r2.source).toBe(r1.source);
    expect(r2.newRootOid).toBe(r1.newRootOid);
  });

  it("bails on top-level element (no JSXElement parent)", () => {
    const src = `export default function T() { return <div data-dropin-id="aaaaaaaa">x</div>; }`;
    const r = applyDuplicate(src, { oid: "aaaaaaaa" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
    expect(r.newRootOid).toBeNull();
  });

  it("bails on missing OID", () => {
    const r = applyDuplicate(tplWithSiblings(), { oid: "ffffffff" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
    expect(r.newRootOid).toBeNull();
  });

  it("bails on unparseable source", () => {
    const r = applyDuplicate("not jsx <<<<", { oid: "aaaaaaaa" });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toBeTruthy();
    expect(r.newRootOid).toBeNull();
  });

  it("returns shape: { source, unchanged, reason, newRootOid }", () => {
    const r = applyDuplicate(tplWithSiblings(), { oid: "cccccccc" });
    expect(typeof r.source).toBe("string");
    expect(typeof r.unchanged).toBe("boolean");
    expect(r.reason === null || typeof r.reason === "string").toBe(true);
    expect(r.newRootOid === null || typeof r.newRootOid === "string").toBe(
      true,
    );
  });
});
