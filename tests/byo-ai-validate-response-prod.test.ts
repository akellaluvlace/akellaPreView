import { describe, it, expect } from "vitest";
import { validateResponse } from "../lib/byo-ai/validate-response";

// Helper — build a "reasonable" input/output pair for length checks.
// 500 chars is comfortably above the 50-char floor and gives the
// length-ratio test a meaningful range to play with.
function pad(s: string, len: number): string {
  while (s.length < len) s += " ";
  return s;
}

describe("validateResponse — length sanity", () => {
  it("accepts response within [0.5×, 1.5×] of input length", () => {
    const input = pad("<html><body><button>x</button></body></html>", 500);
    const output = pad("<html><body><button>y</button></body></html>", 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>x</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("rejects empty response", () => {
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: "",
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("empty");
  });

  it("rejects response under 50 chars", () => {
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: "<html></html>",
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects response under 0.5× input length (suspected truncation)", () => {
    const input = pad("<html></html>", 1000);
    const output = pad("<html></html>", 200);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("short");
  });

  it("rejects response over 1.5× input length (runaway expansion)", () => {
    const input = pad("<html></html>", 500);
    const output = pad("<html></html>", 1000);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("long");
  });
});

describe("validateResponse — no-op detection", () => {
  it("rejects when the target's outerHtml is still verbatim in response", () => {
    const target =
      '<button class="bg-stone-200 px-4 py-2">Get Started</button>';
    const input = pad(`<html><body>${target}</body></html>`, 500);
    const output = pad(`<html><body>${target}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toMatch(/still in the response|swap|ignored/);
  });

  it("ignores data-dropin-id attributes when comparing (OIDs shift legitimately)", () => {
    // Frontier models may regenerate OIDs even on a real swap. We
    // strip those before comparing so a TRUE no-op is the only thing
    // that trips this check.
    const target =
      '<button data-dropin-id="abc123" class="bg-stone-200">Get Started</button>';
    const input = pad(`<html><body>${target}</body></html>`, 500);
    const newTarget =
      '<button data-dropin-id="def456" class="bg-fuchsia-500">Get Started</button>';
    const output = pad(`<html><body>${newTarget}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("skips no-op check when target snippet is too short to be useful", () => {
    // A 15-char target like `<a>x</a>` is too generic to use for
    // change detection — many real swaps would still contain it
    // (e.g. some other anchor in the file). Skip the check at <20.
    const target = "<a>x</a>";
    const input = pad(`<html><body>${target}<a>y</a></body></html>`, 500);
    const output = pad(
      `<html><body><button>new</button><a>y</a></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — security checks", () => {
  it("rejects onclick= event handler", () => {
    const input = pad("<html><body></body></html>", 500);
    const output = pad(
      `<html><body><button onclick="alert(1)">x</button></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("event-handler");
  });

  it("rejects onerror= event handler", () => {
    const output = pad(
      `<html><body><img src="x" onerror="alert(1)"></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("event-handler");
  });

  it("rejects onmouseover= event handler (case-insensitive)", () => {
    const output = pad(
      `<html><body><div onMouseOver="x()">hi</div></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects javascript: URI in href", () => {
    const output = pad(
      `<html><body><a href="javascript:alert(1)">x</a></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("javascript:");
  });

  it("allows legitimate href URLs (http, https, mailto, #anchor)", () => {
    const output = pad(
      `<html><body>
        <a href="https://example.com">a</a>
        <a href="mailto:x@y.com">b</a>
        <a href="#hero">c</a>
        <a href="/about">d</a>
      </body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("ignores onclick-like substring inside text content (whole-word boundary)", () => {
    // "I clicked the button" or "the on-click handler" in a code
    // sample as text content shouldn't trip — only ACTUAL on*= attrs.
    const output = pad(
      `<html><body><p>This site uses on-click animations</p></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — happy path", () => {
  it("accepts a clean restyled element response", () => {
    const oldTarget = '<button class="bg-stone-200 px-4 py-2">Submit</button>';
    const newTarget =
      '<button class="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 text-white">Submit</button>';
    const input = pad(`<html><body>${oldTarget}</body></html>`, 500);
    const output = pad(`<html><body>${newTarget}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(true);
    expect(r.reason).toBeNull();
  });

  it("accepts a JSX-mode swap response", () => {
    const oldTarget = '<button className="bg-stone-200">Hi</button>';
    const newTarget = '<button className="bg-fuchsia-500">Hi</button>';
    const input = pad(
      `export default function X() { return <div>${oldTarget}</div>; }`,
      500,
    );
    const output = pad(
      `export default function X() { return <div>${newTarget}</div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });
});
