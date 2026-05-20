// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { sanitizeIframeHtml } from "../lib/publish/sanitize-html";

// 2026-05-20 — Prod-import tests for the iframe-HTML sanitizer used by
// the Publish flow for JSX templates. The published page must not leak
// any editor-internal markers (OIDs, selection chrome, runtime <script>).

describe("sanitizeIframeHtml — strips dropin data-attrs", () => {
  it("removes data-dropin-id", () => {
    const html = `<!DOCTYPE html><html><body><div data-dropin-id="abc123">x</div></body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain("data-dropin-id");
    expect(r.strippedAttrs).toBe(1);
  });

  it("removes data-dropin-loc", () => {
    const html = `<!DOCTYPE html><html><body><div data-dropin-loc="App.jsx:10:5">x</div></body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain("data-dropin-loc");
  });

  it("removes selection chrome attrs", () => {
    const html = `<!DOCTYPE html><html><body>
      <div data-dropin-hover="">a</div>
      <div data-dropin-selected="">b</div>
      <div data-vibe-selected="">c</div>
      <div data-ai-selected="">d</div>
    </body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain("data-dropin-hover");
    expect(r.html).not.toContain("data-dropin-selected");
    expect(r.html).not.toContain("data-vibe-selected");
    expect(r.html).not.toContain("data-ai-selected");
    expect(r.strippedAttrs).toBeGreaterThanOrEqual(4);
  });

  it("removes data-ai-just-applied (pulse marker)", () => {
    const html = `<!DOCTYPE html><html><body><div data-ai-just-applied="">x</div></body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain("data-ai-just-applied");
  });

  it("removes data-dropin-group (editor primitive)", () => {
    const html = `<!DOCTYPE html><html><body><section data-dropin-group="hero">x</section></body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain("data-dropin-group");
  });

  it("preserves user-authored attributes", () => {
    const html = `<!DOCTYPE html><html><body><div class="hero" id="main" data-foo="bar" aria-label="hi">x</div></body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).toContain('class="hero"');
    expect(r.html).toContain('id="main"');
    expect(r.html).toContain('data-foo="bar"');
    expect(r.html).toContain('aria-label="hi"');
  });
});

describe("sanitizeIframeHtml — strips dropin runtime <script>", () => {
  it("removes inline scripts that contain DROPIN_MODE", () => {
    const html = `<!DOCTYPE html><html><head>
      <script>var DROPIN_MODE = "jsx"; var DROPIN_RESTORE_SCROLL = 0;</script>
    </head><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain("DROPIN_MODE");
    expect(r.strippedScripts).toBe(1);
  });

  it("keeps external <script src=...> tags (user/CDN scripts)", () => {
    const html = `<!DOCTYPE html><html><head>
      <script src="https://unpkg.com/react"></script>
      <script src="https://cdn.tailwindcss.com"></script>
    </head><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).toContain("https://unpkg.com/react");
    expect(r.html).toContain("https://cdn.tailwindcss.com");
    expect(r.strippedScripts).toBe(0);
  });

  it("keeps inline scripts that DON'T mention DROPIN_*", () => {
    const html = `<!DOCTYPE html><html><body>
      <script>console.log("hello from the user");</script>
    </body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).toContain('console.log("hello from the user")');
    expect(r.strippedScripts).toBe(0);
  });

  it("strips runtime script when 2+ needles coincide (DROPIN_MODE + DROPIN_VOID_TAGS)", () => {
    const html = `<!DOCTYPE html><html><head>
      <script>var DROPIN_MODE = "jsx"; var DROPIN_VOID_TAGS = ["area","br"];</script>
      <script>window.__TEMPLATE_THEME = "dark";</script>
    </head><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain("DROPIN_VOID_TAGS");
    expect(r.html).toContain("__TEMPLATE_THEME");
    expect(r.strippedScripts).toBe(1);
  });

  it("does NOT strip a user script that only quotes ONE Dropin name (false-positive guard)", () => {
    // H4 bug fix: a docs site quoting `DROPIN_MODE` once in a code
    // sample shouldn't lose its script. Real runtime declares all
    // four globals in the same block, so the 2-of-N coincidence rule
    // separates them cleanly.
    const html = `<!DOCTYPE html><html><head>
      <script>const docsExample = 'set DROPIN_MODE if you want';</script>
    </head><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).toContain("DROPIN_MODE");
    expect(r.strippedScripts).toBe(0);
  });
});

describe("sanitizeIframeHtml — strips dropin-* <style> chrome", () => {
  it("removes <style id='dropin-outline'>", () => {
    const html = `<!DOCTYPE html><html><head>
      <style id="dropin-outline">[data-dropin-selected]{outline:2px solid red;}</style>
    </head><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain('id="dropin-outline"');
    expect(r.strippedStyles).toBe(1);
  });

  it("removes <style id='dropin-live'> (drag-overlay live styles)", () => {
    const html = `<!DOCTYPE html><html><head>
      <style id="dropin-live">.live{transform:translate3d(0,0,0);}</style>
    </head><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).not.toContain('id="dropin-live"');
  });

  it("keeps user-authored <style> blocks (no dropin- id)", () => {
    const html = `<!DOCTYPE html><html><head>
      <style>body { background: #fef7ff; }</style>
      <style id="user-theme">.btn { color: red; }</style>
    </head><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).toContain("background: #fef7ff");
    expect(r.html).toContain('id="user-theme"');
    expect(r.strippedStyles).toBe(0);
  });
});

describe("sanitizeIframeHtml — output shape", () => {
  it("preserves doctype", () => {
    const html = `<!DOCTYPE html><html><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html.toLowerCase()).toMatch(/^<!doctype html>/);
  });

  it("emits well-formed <html>...</html> wrapper", () => {
    const html = `<!DOCTYPE html><html lang="en"><head><title>Hi</title></head><body>x</body></html>`;
    const r = sanitizeIframeHtml(html);
    expect(r.html).toContain("<html");
    expect(r.html).toContain("</html>");
    expect(r.html).toContain("<title>Hi</title>");
    expect(r.html).toContain("<body>x</body>");
  });

  it("falls back gracefully on malformed input", () => {
    const r = sanitizeIframeHtml("");
    // Empty input — function shouldn't throw; result may be the input
    // back or a doctype-only string. Both acceptable.
    expect(typeof r.html).toBe("string");
  });
});
