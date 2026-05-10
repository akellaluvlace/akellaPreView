// @vitest-environment jsdom
//
// Integration test for the vibe-edit iframe runtime. Mirrors the
// existing tests/integration/iframe-click-to-select.test.ts pattern:
// instantiate JSDOM with runScripts: 'dangerously' and an inline
// <script> that sets up a fake DROPIN_TOOL + dropinPost shim then
// loads the runtime. We capture parent.postMessage by listening on
// the same window (JSDOM's window.parent === window for standalone
// instances).

import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { vibeRuntimeJs } from "../../lib/vibe-edit/runtime";

interface CapturedMessage {
  type?: string;
  [k: string]: unknown;
}

function buildIframe(bodyHtml: string, tool: string = "vibe"): JSDOM {
  // The runtime references a `DROPIN_TOOL` global plus a `dropinPost`
  // function that, in the real iframe runtime, lives at the top of
  // the inspector script. We define minimal shims here so the vibe
  // runtime stands on its own for testing.
  const html = `<!doctype html><html><body>${bodyHtml}<script>
    var DROPIN_TOOL = ${JSON.stringify(tool)};
    function dropinPost(m) {
      var payload = Object.assign({ __dropin: true }, m);
      window.parent.postMessage(payload, '*');
    }
    ${vibeRuntimeJs()}
  </script></body></html>`;
  return new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "http://localhost/",
  });
}

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("vibe-edit runtime — integration", () => {
  it("emits vibe:ready on script load", async () => {
    const dom = buildIframe("<h1>Hello</h1>");
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    expect(messages.some((m) => m?.type === "vibe:ready")).toBe(true);
  });

  it("clicks a heading and emits vibe:selected with the right info", async () => {
    const dom = buildIframe("<main><h1>Hello</h1></main>");
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);

    const h1 = dom.window.document.querySelector("h1") as HTMLElement;
    h1.click();
    await waitMs(50);

    const sel = messages.find((m) => m?.type === "vibe:selected") as any;
    expect(sel).toBeDefined();
    expect(sel.info.kind).toBe("heading");
    expect(sel.info.tag).toBe("h1");
    expect(sel.info.text).toBe("Hello");
    expect(sel.info.path).toBe("main > h1");
    expect(Array.isArray(sel.info.htmlPath)).toBe(true);
    // <html> > body (idx 0) > main (idx 0) > h1 (idx 0)
    // jsdom doesn't auto-create head when none specified; the chain
    // depends on the parsed structure. Verify it's a non-empty array
    // ending in 0 (h1 is first child of main).
    expect(sel.info.htmlPath.length).toBeGreaterThan(0);
    expect(sel.info.htmlPath[sel.info.htmlPath.length - 1]).toBe(0);
  });

  it("emits vibe:selected when an image is clicked with src + alt", async () => {
    const dom = buildIframe(
      `<main><img src="/cat.jpg" alt="a cat" /></main>`,
    );
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);

    const img = dom.window.document.querySelector("img") as HTMLElement;
    img.click();
    await waitMs(50);

    const sel = messages.find((m) => m?.type === "vibe:selected") as any;
    expect(sel).toBeDefined();
    expect(sel.info.kind).toBe("image");
    expect(sel.info.src).toBe("/cat.jpg");
    expect(sel.info.alt).toBe("a cat");
  });

  it("vibe:update-content mutates DOM + re-emits selected", async () => {
    const dom = buildIframe("<main><h1>Hello</h1></main>");
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(50);
    const h1 = dom.window.document.querySelector("h1") as HTMLElement;
    h1.click();
    await waitMs(50);

    dom.window.postMessage(
      {
        __dropin: true,
        type: "vibe:update-content",
        path: "main > h1",
        text: "Goodbye",
      },
      "*",
    );
    await waitMs(100);

    expect(
      (dom.window.document.querySelector("h1") as HTMLElement).textContent,
    ).toBe("Goodbye");
    const refreshed = messages
      .filter((m) => m?.type === "vibe:selected")
      .pop() as any;
    expect(refreshed.info.text).toBe("Goodbye");
  });

  it("vibe:update-image mutates src/alt + re-emits selected", async () => {
    const dom = buildIframe(
      `<main><img src="/old.jpg" alt="old" /></main>`,
    );
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    const img = dom.window.document.querySelector("img") as HTMLElement;
    img.click();
    await waitMs(50);

    dom.window.postMessage(
      {
        __dropin: true,
        type: "vibe:update-image",
        path: "main > img",
        src: "/new.jpg",
        alt: "new alt",
      },
      "*",
    );
    await waitMs(50);

    const fresh = dom.window.document.querySelector("img") as HTMLImageElement;
    expect(fresh.getAttribute("src")).toBe("/new.jpg");
    expect(fresh.getAttribute("alt")).toBe("new alt");
  });

  it("vibe:update-link rewrites href on anchor", async () => {
    const dom = buildIframe(
      `<main><a href="/old">click</a></main>`,
    );
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    const a = dom.window.document.querySelector("a") as HTMLElement;
    a.click();
    await waitMs(50);

    dom.window.postMessage(
      {
        __dropin: true,
        type: "vibe:update-link",
        path: "main > a",
        href: "/new",
      },
      "*",
    );
    await waitMs(50);

    const fresh = dom.window.document.querySelector("a") as HTMLAnchorElement;
    expect(fresh.getAttribute("href")).toBe("/new");
  });

  it("ignores click in non-vibe tool", async () => {
    const dom = buildIframe("<h1>X</h1>", "view");
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    const h1 = dom.window.document.querySelector("h1") as HTMLElement;
    h1.click();
    await waitMs(50);
    expect(messages.some((m) => m?.type === "vibe:selected")).toBe(false);
  });

  it("clicking a non-editable container clears selection", async () => {
    const dom = buildIframe("<div id='wrap'><h1>X</h1></div>");
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    const h1 = dom.window.document.querySelector("h1") as HTMLElement;
    h1.click();
    await waitMs(50);
    // dispatchEvent so we click the wrap directly without bubbling
    // through the h1.
    const wrap = dom.window.document.querySelector("#wrap") as HTMLElement;
    wrap.dispatchEvent(
      new dom.window.Event("click", { bubbles: true, cancelable: true }),
    );
    await waitMs(50);
    expect(messages.some((m) => m?.type === "vibe:cleared")).toBe(true);
  });

  it("vibe:clear command clears the selection marker", async () => {
    const dom = buildIframe("<h1>X</h1>");
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    const h1 = dom.window.document.querySelector("h1") as HTMLElement;
    h1.click();
    await waitMs(50);
    expect(h1.hasAttribute("data-vibe-selected")).toBe(true);

    dom.window.postMessage({ __dropin: true, type: "vibe:clear" }, "*");
    await waitMs(50);
    expect(h1.hasAttribute("data-vibe-selected")).toBe(false);
    expect(messages.some((m) => m?.type === "vibe:cleared")).toBe(true);
  });

  it("clicking a child of svg (path) walks up and selects the svg", async () => {
    // Real-world: Lucide / Heroicons render as <svg><path/></svg>.
    // ev.target is usually the <path> (deepest hit) — runtime must
    // walk up and select the svg, not bail.
    const dom = buildIframe(
      `<main><svg viewBox="0 0 24 24"><path d="M1 1 L23 23" /></svg></main>`,
    );
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    // jsdom's HTMLElement.click() doesn't dispatch on SVG's child
    // elements directly; use dispatchEvent with bubbles so the
    // capture-phase handler on document still receives ev.target =
    // the path.
    const path = dom.window.document.querySelector("path") as any;
    path.dispatchEvent(
      new dom.window.Event("click", { bubbles: true, cancelable: true }),
    );
    await waitMs(50);

    const sel = messages.find((m) => m?.type === "vibe:selected") as any;
    expect(sel).toBeDefined();
    expect(sel.info.tag).toBe("svg");
    expect(sel.info.kind).toBe("icon");
  });

  it("clicking a child inside a button walks up and selects the button when child is non-editable", async () => {
    // <button><i class="dot" /></button> — i is not in the editable
    // set, so walk-up should reach the button.
    const dom = buildIframe(
      `<main><button><i class="dot"></i></button></main>`,
    );
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    const i = dom.window.document.querySelector("i") as HTMLElement;
    i.dispatchEvent(
      new dom.window.Event("click", { bubbles: true, cancelable: true }),
    );
    await waitMs(50);

    const sel = messages.find((m) => m?.type === "vibe:selected") as any;
    expect(sel).toBeDefined();
    expect(sel.info.tag).toBe("button");
    expect(sel.info.kind).toBe("button");
  });

  it("clicking a card-like div (has bg + rounded) selects it as a container", async () => {
    // jsdom's getComputedStyle reflects inline `style="..."` reliably.
    // The runtime's card-like check trips on background-color,
    // border-radius, box-shadow, or non-zero border-width.
    const dom = buildIframe(
      `<main><div id="card" style="background: white; border-radius: 8px; padding: 16px;"><h2>Title</h2></div></main>`,
    );
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    const card = dom.window.document.querySelector("#card") as HTMLElement;
    // dispatchEvent on the card itself (cursor in padding zone, not
    // on the h2). The capture-phase handler sees ev.target = card.
    card.dispatchEvent(
      new dom.window.Event("click", { bubbles: true, cancelable: true }),
    );
    await waitMs(50);

    const sel = messages
      .filter((m) => m?.type === "vibe:selected")
      .pop() as any;
    expect(sel).toBeDefined();
    expect(sel.info.tag).toBe("div");
    expect(sel.info.kind).toBe("container");
  });

  it("vibe:update-classes overwrites class attribute + re-emits selected", async () => {
    const dom = buildIframe(
      `<main><h2 class="text-xl font-bold">Hi</h2></main>`,
    );
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);
    const h2 = dom.window.document.querySelector("h2") as HTMLElement;
    h2.click();
    await waitMs(50);

    dom.window.postMessage(
      {
        __dropin: true,
        type: "vibe:update-classes",
        path: "main > h2",
        classes: "text-3xl font-extrabold",
      },
      "*",
    );
    await waitMs(100);

    const fresh = dom.window.document.querySelector("h2") as HTMLElement;
    expect(fresh.getAttribute("class")).toBe("text-3xl font-extrabold");
    const refreshed = messages
      .filter((m) => m?.type === "vibe:selected")
      .pop() as any;
    expect(refreshed.info.classes).toBe("text-3xl font-extrabold");
  });

  it("vibe:update-classes with empty string removes the class attribute", async () => {
    const dom = buildIframe(
      `<main><p class="text-base">Hi</p></main>`,
    );
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);

    dom.window.postMessage(
      {
        __dropin: true,
        type: "vibe:update-classes",
        path: "main > p",
        classes: "",
      },
      "*",
    );
    await waitMs(50);

    const fresh = dom.window.document.querySelector("p") as HTMLElement;
    expect(fresh.hasAttribute("class")).toBe(false);
  });

  it("vibe:select command selects an element by path", async () => {
    const dom = buildIframe("<main><h1>X</h1><p>Y</p></main>");
    const messages: CapturedMessage[] = [];
    dom.window.addEventListener("message", (ev: any) => {
      messages.push(ev.data);
    });
    await waitMs(30);

    dom.window.postMessage(
      { __dropin: true, type: "vibe:select", path: "main > p" },
      "*",
    );
    await waitMs(50);

    const sel = messages.find((m) => m?.type === "vibe:selected") as any;
    expect(sel).toBeDefined();
    expect(sel.info.tag).toBe("p");
    const p = dom.window.document.querySelector("p") as HTMLElement;
    expect(p.hasAttribute("data-vibe-selected")).toBe(true);
  });
});
