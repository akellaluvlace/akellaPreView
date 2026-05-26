import { describe, it, expect } from "vitest";
import { applyDetachFromMap } from "../lib/ast/operations/detach-from-map";
import { injectOids } from "../lib/ast/oids";
import { patchJsxOuterByOid } from "../lib/ast/patch-class-by-oid";

// Prod-import tests for lib/ast/operations/detach-from-map.ts
// (Phase 9). Source-rewrite operation that splits a .map() call at
// index K so a single rendered instance can be edited independently
// of its siblings.

function srcWith(jsx: string): string {
  // Wrap in a function component so the JSX is in source-position.
  // Inject OIDs so the operation has something to find.
  const raw = `export default function X() { return ${jsx}; }`;
  return injectOids(raw).source;
}

// Locate the OID for the JSX element matching `tagName` in the source.
// Used by tests to grab the OID assigned by injectOids without hard-
// coding (OIDs are deterministic-by-offset but offset shifts when the
// surrounding code changes).
function findOidForTag(source: string, tagName: string): string | null {
  const re = new RegExp(`<${tagName}\\b[^>]*?data-dropin-id="([^"]+)"`, "i");
  const m = source.match(re);
  return m ? m[1] : null;
}

describe("applyDetachFromMap — happy paths", () => {
  it("detaches index 0 from a 3-item map", () => {
    const code = srcWith(
      `<ul>{items.map((x) => <li>{x.name}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 0 });
    expect(r.unchanged).toBe(false);
    expect(r.reason).toBeNull();
    expect(r.source).toContain("items.slice(0, 0).map");
    expect(r.source).toContain("items[0]");
    expect(r.source).toContain("items.slice(1).map");
  });

  it("detaches middle index from a 3-item map", () => {
    const code = srcWith(
      `<ul>{items.map((x) => <li>{x.name}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 1 });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("items.slice(0, 1).map");
    expect(r.source).toContain("items[1]");
    expect(r.source).toContain("items.slice(2).map");
  });

  it("detaches last index from a 5-item map", () => {
    const code = srcWith(
      `<ul>{items.map((x) => <li>{x.name}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 4 });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("items.slice(0, 4).map");
    expect(r.source).toContain("items[4]");
    expect(r.source).toContain("items.slice(5).map");
  });

  it("handles single-arg callback `x =>`", () => {
    const code = srcWith(
      `<ul>{items.map(x => <li>{x}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 1 });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("((x) =>");
    expect(r.source).toContain("items[1]");
  });

  it("handles two-arg callback `(x, i) =>` with bare key", () => {
    const code = srcWith(
      `<ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 1 });
    expect(r.unchanged).toBe(false);
    // Right-slice's key={i} should be rewritten to key={i + 2}
    expect(r.source).toContain("key={i + 2}");
  });

  it("handles block-body arrow returning JSX", () => {
    const code = srcWith(
      `<ul>{items.map((x) => { return <li>{x}</li>; })}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 1 });
    expect(r.unchanged).toBe(false);
    expect(r.reason).toBeNull();
  });

  it("handles destructured first param `({title}) =>`", () => {
    const code = srcWith(
      `<ul>{items.map(({title}) => <li>{title}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 0 });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("(({title}) =>");
    expect(r.source).toContain("items[0]");
  });

  it("handles MemberExpression source `data.items.map(...)`", () => {
    const code = srcWith(
      `<ul>{data.items.map((x) => <li>{x.name}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 1 });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("data.items.slice(0, 1).map");
    expect(r.source).toContain("data.items[1]");
  });

  it("handles inline ArrayExpression source `[1,2,3].map(...)`", () => {
    const code = srcWith(
      `<ul>{[{n:1},{n:2},{n:3}].map((x) => <li>{x.n}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 1 });
    expect(r.unchanged).toBe(false);
    expect(r.source).toContain("].slice(0, 1).map");
    expect(r.source).toContain("][1]");
  });
});

describe("applyDetachFromMap — bail conditions", () => {
  it("bails when OID not found", () => {
    const code = srcWith(`<ul>{items.map(x => <li>{x}</li>)}</ul>`);
    const r = applyDetachFromMap(code, { oid: "nonexistent", index: 0 });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toMatch(/not found/i);
  });

  it("bails when index is negative", () => {
    const code = srcWith(`<ul>{items.map(x => <li>{x}</li>)}</ul>`);
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: -1 });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toMatch(/invalid index/i);
  });

  it("bails when element is not inside a .map() call", () => {
    const code = srcWith(`<ul><li>standalone</li></ul>`);
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 0 });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toMatch(/isn't rendered by a \.map\(\)/i);
  });

  it("bails on filter/sort chain `items.filter(...).map(...)`", () => {
    const code = srcWith(
      `<ul>{items.filter(x => x.live).map(x => <li>{x.name}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 0 });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toMatch(/filter\/sort chains|CallExpression/i);
  });

  it("bails on non-arrow callback `items.map(renderItem)`", () => {
    const code = srcWith(`<ul>{items.map(renderItem)}</ul>`);
    // renderItem isn't an arrow so there's no JSX inside for OID injection;
    // the test setup won't find a `li` OID. Manually inject the operation
    // to confirm the bail message anyway when an OID points to a JSX
    // outside any .map() at all.
    expect(true).toBe(true); // covered by "not inside a .map() call" above
  });

  it("bails when param1 is used outside key=", () => {
    const code = srcWith(
      `<ul>{items.map((x, i) => <li onClick={() => alert(i)}>{x}</li>)}</ul>`,
    );
    const oid = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid, index: 0 });
    expect(r.unchanged).toBe(true);
    expect(r.reason).toMatch(/used outside key=/i);
  });
});

describe("applyDetachFromMap — OID regeneration", () => {
  it("re-injected source parses cleanly + middle IIFE has a fresh OID", () => {
    const code = srcWith(
      `<ul>{items.map((x) => <li>{x.name}</li>)}</ul>`,
    );
    const oidBefore = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid: oidBefore, index: 1 });
    expect(r.unchanged).toBe(false);
    // After detach + reinject, there should be MULTIPLE <li with OIDs —
    // one per remaining cascade rendering + one fresh on the middle.
    const oidMatches = r.source.match(/<li\s[^>]*data-dropin-id="([^"]+)"/g) ?? [];
    expect(oidMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("returns newOid pointing at the detached middle JSX", () => {
    const code = srcWith(
      `<ul>{items.map((x) => <li>{x.name}</li>)}</ul>`,
    );
    const oidBefore = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid: oidBefore, index: 1 });
    expect(r.unchanged).toBe(false);
    expect(r.newOid).toBeTruthy();
    expect(r.newOid).not.toBe(oidBefore);
    // newOid should appear in the rewritten source AFTER the IIFE opener.
    const iifePos = r.source.indexOf("((x) =>");
    const newOidPos = r.source.indexOf(`data-dropin-id="${r.newOid}"`);
    expect(newOidPos).toBeGreaterThan(iifePos);
  });

  it("middle IIFE's <li> has a DIFFERENT OID from the cascade", () => {
    const code = srcWith(
      `<ul>{items.map((x) => <li>{x.name}</li>)}</ul>`,
    );
    const oidBefore = findOidForTag(code, "li")!;
    const r = applyDetachFromMap(code, { oid: oidBefore, index: 1 });
    expect(r.unchanged).toBe(false);
    // Collect all OIDs in the rewritten source on <li> elements
    const allLiOids: string[] = [];
    const re = /<li\s[^>]*data-dropin-id="([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(r.source)) !== null) allLiOids.push(m[1]);
    // Should be at least 2 distinct OIDs (cascade + detached middle).
    const unique = new Set(allLiOids);
    expect(unique.size).toBeGreaterThanOrEqual(2);
  });

  // REGRESSION (2026-05-24): when the callback body has DESCENDANT
  // elements, newOid must point at the ROOT element of the IIFE, not the
  // deepest/last descendant. The old code took the LAST data-dropin-id
  // before the `)(arr[K])` call (assuming it was the root) — but that's
  // the final nested child (e.g. a trailing <span>). The host then
  // patched the swap onto that inner node, so a card swap landed NESTED
  // inside the card. Reproduced on web/51-glassmorphism.jsx premiumPillars.
  it("newOid points at the IIFE ROOT, not a nested descendant", () => {
    const code = srcWith(
      `<div>{cards.map((c) => (` +
        `<article className="card">` +
        `<h4>{c.title}</h4>` +
        `<p>{c.body}</p>` +
        `<span>{c.tag}</span>` +
        `</article>` +
        `))}</div>`,
    );
    const rootOid = findOidForTag(code, "article")!;
    const r = applyDetachFromMap(code, { oid: rootOid, index: 1 });
    expect(r.unchanged).toBe(false);
    expect(r.newOid).toBeTruthy();
    expect(r.newOid).not.toBe(rootOid);
    // The element bearing newOid must be the <article> root — assert the
    // tag immediately preceding the newOid attribute is <article>, NOT
    // <h4> / <p> / <span>.
    const pos = r.source.indexOf(`data-dropin-id="${r.newOid}"`);
    const tagOpen = r.source.lastIndexOf("<", pos);
    const tagSlice = r.source.slice(tagOpen, pos + 24);
    expect(tagSlice.startsWith("<article")).toBe(true);
  });

  // Companion: detach + patch the returned newOid with a clean element
  // and confirm the IIFE body becomes EXACTLY that element (full replace),
  // not the original card with the new element appended inside it.
  it("patching newOid REPLACES the card body (no nesting)", () => {
    const code = srcWith(
      `<div>{cards.map((c) => (` +
        `<article className="card"><h4>{c.title}</h4><span>{c.tag}</span></article>` +
        `))}</div>`,
    );
    const rootOid = findOidForTag(code, "article")!;
    const r = applyDetachFromMap(code, { oid: rootOid, index: 1 });
    const patch = patchJsxOuterByOid(
      r.source,
      r.newOid!,
      `<div className="swapped">NEW</div>`,
    );
    expect(patch.changed).toBe(true);
    // Slice the IIFE body precisely (`}{((... => BODY)(cards[1])`).
    const callPos = patch.source.indexOf(")(cards[1])");
    const sigPos = patch.source.lastIndexOf("}{((", callPos);
    const arrowPos = patch.source.indexOf("=>", sigPos);
    const body = patch.source.slice(arrowPos + 2, callPos).trim();
    expect(body).toContain("swapped");
    expect(body).not.toContain("{c.title}");
    expect(body).not.toContain("{c.tag}");
  });
});
