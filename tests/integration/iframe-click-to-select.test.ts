import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { buildPreviewDocument } from "../../lib/preview";

// FIRST end-to-end integration test. Validates the full iframe runtime click
// flow against a real DOM (jsdom), not a unit-tested helper. Per pre-manual-
// test audit `02-tests.md`: the 5341-case pure-logic suite exercises lib/
// in isolation, but ZERO tests covered the actual product flow until now.
// Even one such test catches behavior the inline-mirror benches can't see.
//
// Why HTML mode (not JSX): JSX mode loads React + ReactDOM + Babel UMDs from
// unpkg via `<script src=...>` tags, requiring network in the test runner.
// HTML mode runs the same `inspectorRuntimeJs` (~700 LOC, the click handler /
// hover painter / message router) without external resources, so the test is
// offline + fast + flake-free. JSX-mode coverage is a follow-up if/when we
// add stubs for the CDN scripts.
//
// What this test catches that nothing else does:
//   - `buildPreviewDocument` HTML-mode head injection (CSP/inspector script/style)
//   - inspectorRuntimeJs message-listener wire-up (window.addEventListener)
//   - DROPIN_TOOL gating on click handler — regression for 2026-05-06 audit fix #3
//     (dblclick was hijacking view-mode; this asserts the click-handler analog)
//   - dropinResolveTarget walk + dropinSerialize payload contract
//   - parent.postMessage delivery of dropin:ready, dropin:select envelopes
//
// Notes on the jsdom environment:
//   - In standalone JSDOM, `window.parent === window`. The runtime's
//     `parent.postMessage(payload, '*')` therefore fires a `message` event
//     on the same window we're listening to. Both directions of the protocol
//     (host→iframe set-tool and iframe→host select) flow through the same
//     event stream — discriminate by `data.type`.
//   - jsdom doesn't enforce frame-ancestors CSP; the meta tag is harmless.
//   - `withTailwind: false` skips the cdn.tailwindcss.com script src so jsdom
//     doesn't make real network requests.
//   - The runtime's `setTimeout(fn, 0)` schedules dropin:ready emission. We
//     await ~50 ms via the jsdom window's own setTimeout to let it fire.

// Structural type so the same helper accepts both Node's and the DOM's
// setTimeout signatures — Node's adds a `__promisify__` brand that's absent
// on the DOMWindow's. We only need "schedule a callback" semantics here.
function flushTimers(
  window: { setTimeout: (fn: () => void, ms: number) => unknown },
  ms = 50,
): Promise<void> {
  return new Promise((resolve) => window.setTimeout(() => resolve(), ms));
}

function buildDom(userHtml: string): JSDOM {
  const previewHtml = buildPreviewDocument({
    code: userHtml,
    kind: "html",
    withTailwind: false,
  });
  return new JSDOM(previewHtml, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
}

describe("iframe runtime — HTML mode click-to-select", () => {
  it("emits dropin:ready on mount with kind === 'html'", async () => {
    const dom = buildDom(`<div><h1>Hello</h1></div>`);
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });

    await flushTimers(dom.window, 50);

    const readyMsg = messages.find((m) => m?.type === "dropin:ready");
    expect(readyMsg).toBeDefined();
    expect(readyMsg.kind).toBe("html");
    // dropinPost wraps every iframe→host message with `__dropin: true` so the
    // host's `isIframeMessage` gate accepts it. Drift here would silently
    // detach the iframe from the host's message router.
    expect(readyMsg.__dropin).toBe(true);
  });

  it("emits dropin:tree alongside dropin:ready (one snapshot per mount)", async () => {
    const dom = buildDom(
      `<div class="hero"><h1>Hello</h1><p>World</p></div>`,
    );
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });

    await flushTimers(dom.window, 50);

    const treeMsg = messages.find((m) => m?.type === "dropin:tree");
    expect(treeMsg).toBeDefined();
    expect(Array.isArray(treeMsg.tree)).toBe(true);
    expect(treeMsg.tree.length).toBeGreaterThan(0);
  });

  it("posts dropin:select with the right payload after set-tool=select + click", async () => {
    const dom = buildDom(
      `<div class="hero"><h1 class="title">Hello</h1><button id="cta" class="btn primary">Click me</button></div>`,
    );
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });

    // Wait for the runtime to mount + emit dropin:ready before we send the
    // host→iframe tool message — mirrors the production sequence (host listens
    // for dropin:ready, then pushes set-tool with the current Workspace tool).
    await flushTimers(dom.window, 50);

    // Enable click handling. Default DROPIN_TOOL is 'view' which bails the
    // handler — same gate that protects view-mode pass-through.
    dom.window.postMessage(
      { __dropin: true, type: "dropin:set-tool", tool: "select" },
      "*",
    );
    await flushTimers(dom.window, 10);

    const button = dom.window.document.getElementById("cta");
    expect(button).toBeTruthy();

    button!.dispatchEvent(
      new dom.window.MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );
    await flushTimers(dom.window, 10);

    const selectMsg = messages.find((m) => m?.type === "dropin:select");
    expect(selectMsg).toBeDefined();
    expect(selectMsg.__dropin).toBe(true);
    expect(selectMsg.selection).toBeDefined();

    const sel = selectMsg.selection;
    expect(sel.tag).toBe("button");
    expect(sel.loc.kind).toBe("html");
    expect(Array.isArray(sel.loc.path)).toBe(true);
    expect(sel.classes).toEqual(expect.arrayContaining(["btn", "primary"]));
    expect(sel.hasOnlyTextChildren).toBe(true);
    expect(sel.text).toBe("Click me");
    expect(sel.isVoid).toBe(false);
    expect(Array.isArray(sel.breadcrumb)).toBe(true);
    // Breadcrumb walks button → div.hero → body → html. At minimum the parent
    // div should be in the chain (we don't lock the exact length because
    // dropinElementLoc may skip non-addressable wrappers).
    expect(sel.breadcrumb.some((b: any) => b.tag === "div")).toBe(true);
  });

  it("view tool: click does NOT emit dropin:select (regression for tool gating)", async () => {
    const dom = buildDom(`<div><button id="cta">Click</button></div>`);
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });

    await flushTimers(dom.window, 50);
    // Do NOT send dropin:set-tool — DROPIN_TOOL stays at its default 'view'.
    // Click handler should bail at the top guard (lib/preview.ts:1804) and
    // pass the click through to the user's element verbatim.

    const button = dom.window.document.getElementById("cta")!;
    button.dispatchEvent(
      new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
    await flushTimers(dom.window, 10);

    expect(messages.find((m) => m?.type === "dropin:select")).toBeUndefined();
  });

  it("walks up the DOM to find an addressable target — clicking a nested span resolves to its block parent", async () => {
    // The user clicks a span inside a button. The runtime's dropinResolveTarget
    // walks ancestors until it finds an "addressable" element — see
    // dropinResolveTarget at lib/preview.ts:343. Bare inline elements like
    // <span> often resolve up to the enclosing block. This test pins that
    // walk against the runtime so a future refactor can't silently break
    // "click any visible element → host gets a meaningful selection."
    const dom = buildDom(
      `<button id="cta" class="btn"><span id="inner">label</span></button>`,
    );
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });

    await flushTimers(dom.window, 50);
    dom.window.postMessage(
      { __dropin: true, type: "dropin:set-tool", tool: "select" },
      "*",
    );
    await flushTimers(dom.window, 10);

    const inner = dom.window.document.getElementById("inner")!;
    inner.dispatchEvent(
      new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
    await flushTimers(dom.window, 10);

    const selectMsg = messages.find((m) => m?.type === "dropin:select");
    expect(selectMsg).toBeDefined();
    // Either span resolves to itself (if it's addressable) or up to the button
    // — both are valid runtime behaviour. What we're really pinning here is
    // "no select message" must not happen for a click on a real element with
    // an addressable ancestor. Document the actual choice via the assertion.
    expect(["span", "button"]).toContain(selectMsg.selection.tag);
  });

  it("Escape key clears selection (dropin:clear-selection)", async () => {
    const dom = buildDom(`<div><button id="cta">Click</button></div>`);
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });

    await flushTimers(dom.window, 50);
    dom.window.postMessage(
      { __dropin: true, type: "dropin:set-tool", tool: "select" },
      "*",
    );
    await flushTimers(dom.window, 10);

    // Select first
    const button = dom.window.document.getElementById("cta")!;
    button.dispatchEvent(
      new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
    await flushTimers(dom.window, 10);
    expect(messages.find((m) => m?.type === "dropin:select")).toBeDefined();

    // Clear selection via Escape — runtime keydown listener at lib/preview.ts:1909
    dom.window.document.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await flushTimers(dom.window, 10);

    expect(messages.find((m) => m?.type === "dropin:clear-selection")).toBeDefined();
  });
});
