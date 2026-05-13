// 8th prod-import surge — direct-import tests for `lib/component-library/`.
// Covers `scope.ts` (mintScopeId + applyScope) and `insert.ts` HTML mode
// (the JSX path runs htmlToJsx which uses DOMParser — needs jsdom; skipped
// here per node-only test env).

import { describe, it, expect } from "vitest";
import {
  mintScopeId,
  applyScope,
  SCOPE_PLACEHOLDER,
} from "../lib/component-library/scope";
import { buildInsertPayload } from "../lib/component-library/insert";

describe("§1 mintScopeId — generates 'ak-<8-hex-chars>' ids", () => {
  it("returns a string with 'ak-' prefix", () => {
    expect(mintScopeId().startsWith("ak-")).toBe(true);
  });

  it("the suffix is exactly 8 chars (lowercase hex)", () => {
    const id = mintScopeId();
    const suffix = id.slice(3);
    expect(suffix.length).toBe(8);
    expect(suffix).toMatch(/^[0-9a-f]{8}$/);
  });

  it("two consecutive calls yield different ids (collision-resistant)", () => {
    const a = mintScopeId();
    const b = mintScopeId();
    expect(a).not.toBe(b);
  });

  it("never contains a dash (UUID hyphens stripped)", () => {
    const id = mintScopeId();
    // After 'ak-', no further dashes.
    expect(id.slice(3)).not.toContain("-");
  });
});

describe("§2 applyScope — substitutes the scope placeholder in CSS", () => {
  it("replaces every occurrence of __UIV_SCOPE__ with the scope id", () => {
    const css = `.${SCOPE_PLACEHOLDER} { color: red } .${SCOPE_PLACEHOLDER}-inner { padding: 4px }`;
    const r = applyScope(css, "ak-12345678");
    expect(r).toBe(".ak-12345678 { color: red } .ak-12345678-inner { padding: 4px }");
  });

  it("returns '' for empty input (load-bearing for the no-css component path)", () => {
    expect(applyScope("", "ak-12345678")).toBe("");
  });

  it("idempotent on CSS without the placeholder", () => {
    const css = ".something { color: blue }";
    expect(applyScope(css, "ak-12345678")).toBe(css);
  });

  it("uses split/join (replaceAll-equivalent) — handles multiple occurrences", () => {
    const css = `${SCOPE_PLACEHOLDER}${SCOPE_PLACEHOLDER}${SCOPE_PLACEHOLDER}`;
    expect(applyScope(css, "X")).toBe("XXX");
  });

  it("SCOPE_PLACEHOLDER constant is the documented '__UIV_SCOPE__'", () => {
    expect(SCOPE_PLACEHOLDER).toBe("__UIV_SCOPE__");
  });
});

describe("§3 buildInsertPayload — HTML mode (no JSX path; that needs jsdom)", () => {
  const uiverseComponent = () => ({
    id: "btn-glow",
    slug: "btn-glow",
    title: "Glowing Button",
    category: "buttons",
    source: "uiverse" as const,
    tags: ["button", "glow"],
    author: "Some Author",
    authorUrl: "https://uiverse.io/u/some-author",
    sourceUrl: "https://uiverse.io/some-author/btn-glow",
    license: "MIT",
    tailwindRequired: false,
    html: `<button class="btn">Click</button>`,
    css: `.${SCOPE_PLACEHOLDER} .btn { color: red; }`,
    tailwindPlugins: [],
  });

  const hyperuiComponent = () => ({
    id: "tw-card",
    slug: "tw-card",
    title: "Tailwind Card",
    category: "cards",
    source: "hyperui" as const,
    tags: ["card"],
    author: null,
    authorUrl: null,
    sourceUrl: "https://hyperui.dev/components/tw-card",
    license: "MIT",
    tailwindRequired: true,
    html: `<div class="rounded-xl bg-white p-4">Hi</div>`,
    css: undefined as string | undefined, // HyperUI: no scoped CSS
    tailwindPlugins: ["@tailwindcss/forms"],
  });

  it("HTML mode for Uiverse: emits attribution comment + scoped <style> + wrapper div", () => {
    const r = buildInsertPayload(uiverseComponent() as any, "html");
    expect(r.text).toContain("<!--");
    expect(r.text).toContain("Component: Glowing Button");
    expect(r.text).toContain("Source:    https://uiverse.io/some-author/btn-glow");
    expect(r.text).toContain("Author:    Some Author (MIT)");
    expect(r.text).toContain("-->");
    expect(r.text).toContain("<style>");
    expect(r.text).toContain(`.${r.scopeId} .btn { color: red; }`);
    expect(r.text).toContain(`<div class="${r.scopeId}">`);
    expect(r.text).toContain("<button class=\"btn\">Click</button>");
  });

  it("Uiverse: scopeId is non-null and matches mintScopeId pattern", () => {
    const r = buildInsertPayload(uiverseComponent() as any, "html");
    expect(r.scopeId).not.toBeNull();
    expect(r.scopeId!).toMatch(/^ak-[0-9a-f]{8}$/);
  });

  it("HyperUI (no css): no <style>, no wrapper div, just attribution + body", () => {
    const r = buildInsertPayload(hyperuiComponent() as any, "html");
    expect(r.text).toContain("Component: Tailwind Card");
    expect(r.text).not.toContain("<style>");
    expect(r.text).toContain('<div class="rounded-xl');
    // No wrapper div with scope class.
    expect(r.text).not.toMatch(/<div class="ak-[0-9a-f]{8}">/);
  });

  it("HyperUI: scopeId is null", () => {
    const r = buildInsertPayload(hyperuiComponent() as any, "html");
    expect(r.scopeId).toBeNull();
  });

  it("attribution falls back to license-only when author is null", () => {
    const r = buildInsertPayload(hyperuiComponent() as any, "html");
    // No author → just "MIT" without parentheses
    expect(r.text).toContain("Author:    MIT");
    expect(r.text).not.toContain("(MIT)");
  });

  it("requiredPlugins propagates from component.tailwindPlugins", () => {
    const r = buildInsertPayload(hyperuiComponent() as any, "html");
    expect(r.requiredPlugins).toEqual(["@tailwindcss/forms"]);
  });

  it("requiredPlugins defaults to [] when undefined on component", () => {
    const c = { ...hyperuiComponent(), tailwindPlugins: undefined };
    const r = buildInsertPayload(c as any, "html");
    expect(r.requiredPlugins).toEqual([]);
  });

  it("payload.text always ends with a trailing newline", () => {
    const r = buildInsertPayload(uiverseComponent() as any, "html");
    expect(r.text.endsWith("\n")).toBe(true);
  });

  it("scoped CSS substitutes the placeholder with the minted scope id", () => {
    const r = buildInsertPayload(uiverseComponent() as any, "html");
    // Original css has __UIV_SCOPE__; substituted text should have ak-<id>
    expect(r.text).not.toContain(SCOPE_PLACEHOLDER);
    expect(r.text).toContain(r.scopeId!);
  });
});
