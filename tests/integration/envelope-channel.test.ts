import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { buildPreviewDocument } from "../../lib/preview";

// Phase E proper — Iframe-side parent envelope channel.
//
// At swap-invoke time the host needs the slot envelope (parent's content-box
// + aspect-ratio) for the selected element to feed `slotCapacityFits` /
// `composeEnvelopeFromBbox`. This test pins the wire contract:
//
//   host ─[dropin:get-envelope { oid, requestId }]→ iframe
//   host ←[dropin:envelope-result { requestId, result }]─ iframe
//
// `result` is null when the OID isn't present (or computation throws);
// otherwise carries raw CSSOM-shaped inputs ready for `parentBoxFromRect`
// + the child's bounding rect for drift-baseline math (post-swap drift
// assessment compares pre-swap to post-swap on the same element).
//
// HTML mode is used because it skips the unpkg React/Babel UMD loads. The
// runtime's `dropinFindByOid` doesn't care about mode — it queries
// `[data-dropin-id]` against the DOM. We plant the attribute by hand in the
// fixture HTML so the lookup hits.

function flushTimers(
  window: { setTimeout: (fn: () => void, ms: number) => unknown },
  ms = 50,
): Promise<void> {
  return new Promise((resolve) => window.setTimeout(() => resolve(), ms));
}

// 2026-05-26 — deadline-based wait for an async postMessage reply. Replaces
// the previous fixed `flushTimers(20)` + `messages.find` pattern, which was
// flaky: 20ms was sometimes too short for the round-trip + the runtime's
// getComputedStyle/getBoundingClientRect work under load, so the reply
// hadn't landed when we checked. Polls the collected `messages` array every
// 10ms up to `timeoutMs`, returning the match as soon as it arrives (or
// undefined at the deadline, so the assertion still fails clearly).
async function waitFor(
  window: { setTimeout: (fn: () => void, ms: number) => unknown },
  messages: any[],
  predicate: (m: any) => boolean,
  timeoutMs = 2000,
): Promise<any> {
  const deadline = Date.now() + timeoutMs;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const hit = messages.find(predicate);
    if (hit) return hit;
    if (Date.now() >= deadline) return undefined;
    await new Promise((r) => window.setTimeout(() => r(undefined), 10));
  }
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

describe("iframe runtime — envelope channel", () => {
  it("responds to dropin:get-envelope with dropin:envelope-result keyed by requestId", async () => {
    const dom = buildDom(
      `<section data-dropin-id="parent-1"><div data-dropin-id="child-1">Hi</div></section>`,
    );
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await flushTimers(dom.window, 50);

    dom.window.postMessage(
      { __dropin: true, type: "dropin:get-envelope", oid: "child-1", requestId: 42 },
      "*",
    );
    const reply = await waitFor(
      dom.window,
      messages,
      (m) => m?.type === "dropin:envelope-result" && m.requestId === 42,
    );
    expect(reply).toBeDefined();
    expect(reply.__dropin).toBe(true);
    expect(reply.requestId).toBe(42);
  });

  it("returns a non-null result with parent + childRect when the oid is present", async () => {
    const dom = buildDom(
      `<section data-dropin-id="parent-2"><div data-dropin-id="child-2">x</div></section>`,
    );
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await flushTimers(dom.window, 50);

    dom.window.postMessage(
      { __dropin: true, type: "dropin:get-envelope", oid: "child-2", requestId: 7 },
      "*",
    );
    const reply = await waitFor(
      dom.window,
      messages,
      (m) => m?.type === "dropin:envelope-result" && m.requestId === 7,
    );
    expect(reply).toBeDefined();
    expect(reply.result).not.toBeNull();
    // parent shape — every field needed by `parentBoxFromRect`.
    const parent = reply.result.parent;
    expect(typeof parent.rectWidthPx).toBe("number");
    expect(typeof parent.rectHeightPx).toBe("number");
    expect(typeof parent.paddingLeftPx).toBe("number");
    expect(typeof parent.paddingRightPx).toBe("number");
    expect(typeof parent.paddingTopPx).toBe("number");
    expect(typeof parent.paddingBottomPx).toBe("number");
    expect(typeof parent.borderLeftPx).toBe("number");
    expect(typeof parent.borderRightPx).toBe("number");
    expect(typeof parent.borderTopPx).toBe("number");
    expect(typeof parent.borderBottomPx).toBe("number");
    expect(
      parent.aspectRatioCss === null || typeof parent.aspectRatioCss === "string",
    ).toBe(true);
    // childRect shape — drift-baseline.
    const childRect = reply.result.childRect;
    expect(childRect).not.toBeNull();
    expect(typeof childRect.widthPx).toBe("number");
    expect(typeof childRect.heightPx).toBe("number");
  });

  it("returns null result for an oid that isn't in the DOM", async () => {
    const dom = buildDom(`<div data-dropin-id="real-1">x</div>`);
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await flushTimers(dom.window, 50);

    dom.window.postMessage(
      { __dropin: true, type: "dropin:get-envelope", oid: "missing-oid", requestId: 99 },
      "*",
    );
    const reply = await waitFor(
      dom.window,
      messages,
      (m) => m?.type === "dropin:envelope-result" && m.requestId === 99,
    );
    expect(reply).toBeDefined();
    expect(reply.result).toBeNull();
  });

  it("parallel queries with distinct requestIds get distinct replies", async () => {
    const dom = buildDom(
      `<section data-dropin-id="p"><div data-dropin-id="c1">a</div><span data-dropin-id="c2">b</span></section>`,
    );
    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await flushTimers(dom.window, 50);

    dom.window.postMessage(
      { __dropin: true, type: "dropin:get-envelope", oid: "c1", requestId: 1 },
      "*",
    );
    dom.window.postMessage(
      { __dropin: true, type: "dropin:get-envelope", oid: "c2", requestId: 2 },
      "*",
    );

    const r1 = await waitFor(
      dom.window,
      messages,
      (m) => m?.type === "dropin:envelope-result" && m.requestId === 1,
    );
    const r2 = await waitFor(
      dom.window,
      messages,
      (m) => m?.type === "dropin:envelope-result" && m.requestId === 2,
    );
    expect(r1).toBeDefined();
    expect(r2).toBeDefined();
    expect(r1.requestId).toBe(1);
    expect(r2.requestId).toBe(2);
  });

  it("when the element has no parent (e.g. detached), result.result is null", async () => {
    // Edge case: the runtime's lookup walks `el.parentElement`. Document
    // body's parentElement is `<html>` → still has dimensions, but the
    // result should be defensive when even that walk fails. We can't
    // easily produce a detached element via the source; instead, pin
    // that the runtime DOES return null for an oid that resolves to
    // `documentElement` (whose parentElement is null in jsdom).
    const dom = buildDom(`<div data-dropin-id="present">x</div>`);
    // Manually mark <html> so dropinFindByOid resolves to it.
    dom.window.document.documentElement.setAttribute(
      "data-dropin-id",
      "html-root",
    );

    const messages: any[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await flushTimers(dom.window, 50);

    dom.window.postMessage(
      { __dropin: true, type: "dropin:get-envelope", oid: "html-root", requestId: 11 },
      "*",
    );
    const reply = await waitFor(
      dom.window,
      messages,
      (m) => m?.type === "dropin:envelope-result" && m.requestId === 11,
    );
    expect(reply).toBeDefined();
    // documentElement.parentElement === null → no parent envelope to compute.
    expect(reply.result).toBeNull();
  });
});
