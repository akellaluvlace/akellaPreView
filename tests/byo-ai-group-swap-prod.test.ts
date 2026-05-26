import { describe, it, expect } from "vitest";
import { injectOids, stripOids, parsesAsPlainJsx } from "../lib/ast";
import {
  getJsxOuterByOid,
  patchJsxOuterByOid,
} from "../lib/ast/patch-class-by-oid";

// 2026-05-25 — "convert all N cards" group swap. The host sends the AI the
// JSX SOURCE of the .map() callback (so {expr} bindings come back intact),
// then patches the SHARED OID directly (NO detach) → the one template is
// rewritten and every card re-renders with the new design + its own content.

function srcWith(jsx: string): string {
  const raw = `export default function X() { return ${jsx}; }`;
  return injectOids(raw).source;
}
function oidForTag(source: string, tag: string): string {
  return source.match(
    new RegExp(`<${tag}\\b[^>]*?data-dropin-id="([^"]+)"`, "i"),
  )![1];
}

describe("getJsxOuterByOid", () => {
  it("returns the JSX SOURCE slice (with {expr} bindings), not rendered HTML", () => {
    const code = srcWith(
      `<div>{cards.map((c) => <article className="card"><h4>{c.title}</h4><p>{c.body}</p></article>)}</div>`,
    );
    const oid = oidForTag(code, "article");
    const out = getJsxOuterByOid(code, oid)!;
    expect(out).toContain("<article");
    expect(out).toContain("{c.title}");
    expect(out).toContain("{c.body}");
  });

  it("returns null for an unknown OID", () => {
    const code = srcWith(`<div><span>hi</span></div>`);
    expect(getJsxOuterByOid(code, "zzzzzzzz")).toBeNull();
  });

  it("returns null for unparseable source", () => {
    expect(getJsxOuterByOid("const x = (", "aaaaaaaa")).toBeNull();
  });
});

describe("group swap — patch shared OID keeps .map() + per-card content", () => {
  it("restyles ALL cards while preserving their own bindings", () => {
    const code = srcWith(
      `<div>{cards.map((c) => (` +
        `<article className="glass rounded-3xl border border-amber-300/20 p-8">` +
        `<h4>{c.title}</h4><p>{c.body}</p><span>{c.meta}</span>` +
        `</article>` +
        `))}</div>`,
    );
    const sharedOid = oidForTag(code, "article");

    // Simulate the AI's restyled template — NEW wrapper, KEEPS bindings.
    const restyled =
      `<article data-dropin-id="${sharedOid}" className="rounded-xl bg-black border border-emerald-400/40 p-6">` +
      `<h4 className="text-emerald-300">{c.title}</h4>` +
      `<p className="text-gray-300">{c.body}</p>` +
      `<span className="text-emerald-400/70">{c.meta}</span>` +
      `</article>`;

    // Group apply = patch the SHARED oid directly (no detach).
    const patch = patchJsxOuterByOid(code, sharedOid, restyled);
    expect(patch.changed).toBe(true);

    // .map() stays intact (NOT split into slices/IIFE).
    expect(patch.source).toContain("cards.map(");
    expect(patch.source).not.toContain("cards.slice(");

    // Bindings survive → each card keeps its own content.
    expect(patch.source).toContain("{c.title}");
    expect(patch.source).toContain("{c.body}");
    expect(patch.source).toContain("{c.meta}");

    // New design in, old design gone (single template, applies to all).
    expect(patch.source).toContain("bg-black border border-emerald-400/40");
    expect(patch.source).not.toContain(
      "glass rounded-3xl border border-amber-300/20",
    );

    // Re-stamp + parse-gate (mirrors handleByoAiApply).
    const final = injectOids(stripOids(patch.source).source).source;
    expect(parsesAsPlainJsx(final)).toBe(true);
  });
});
