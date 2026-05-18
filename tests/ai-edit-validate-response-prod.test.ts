import { describe, it, expect } from "vitest";
import {
  validateAiResponse,
  extractRootTag,
} from "../lib/ai-edit/validate-response";

// Prod-import test for lib/ai-edit/validate-response.ts. Covers the
// validation pipeline: fence strip → JSON parse → shape check → root
// tag match → forbidden tags → length sanity. Each rule has at least
// one accept + one reject case.

describe("ai-edit validate-response — extractRootTag", () => {
  it("returns lowercased root tag", () => {
    expect(extractRootTag("<DIV>x</DIV>")).toBe("div");
    expect(extractRootTag("<section class='x'>")).toBe("section");
    expect(extractRootTag('<a href="#">link</a>')).toBe("a");
  });

  it("trims leading whitespace before matching", () => {
    expect(extractRootTag("  \n  <button>x</button>")).toBe("button");
  });

  it("handles self-closing tags", () => {
    expect(extractRootTag("<br/>")).toBe("br");
    expect(extractRootTag("<img src='x'/>")).toBe("img");
  });

  it("returns null when no opening tag at start", () => {
    expect(extractRootTag("plain text")).toBeNull();
    expect(extractRootTag("")).toBeNull();
    expect(extractRootTag("<<bad>")).toBeNull();
  });
});

describe("ai-edit validate-response — happy path", () => {
  it("accepts a clean response with matching root tag", () => {
    const r = validateAiResponse(
      '{"html":"<button class=\\"bg-red-500\\">Hi</button>","notes":"reddened"}',
      "<button>Hi</button>",
      "element",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.html).toContain("bg-red-500");
      expect(r.value.notes).toBe("reddened");
    }
  });

  it("strips markdown fences before parsing", () => {
    const r = validateAiResponse(
      '```json\n{"html":"<p>Hi</p>"}\n```',
      "<p>Hi</p>",
      "element",
    );
    expect(r.ok).toBe(true);
  });

  it("accepts missing notes field (optional)", () => {
    const r = validateAiResponse(
      '{"html":"<p>Hi</p>"}',
      "<p>Hi</p>",
      "element",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.notes).toBeUndefined();
    }
  });
});

describe("ai-edit validate-response — rejects malformed JSON", () => {
  it("rejects empty input", () => {
    expect(validateAiResponse("", "<p/>", "element")).toMatchObject({
      ok: false,
    });
  });

  it("rejects non-JSON text", () => {
    expect(
      validateAiResponse("Hello, here is your edit: <p/>", "<p/>", "element"),
    ).toMatchObject({ ok: false, error: expect.stringContaining("JSON") });
  });

  it("rejects JSON without html field", () => {
    expect(
      validateAiResponse('{"notes":"hi"}', "<p/>", "element"),
    ).toMatchObject({ ok: false, error: expect.stringContaining("html") });
  });

  it("rejects JSON where html is not a string", () => {
    expect(
      validateAiResponse('{"html":123}', "<p/>", "element"),
    ).toMatchObject({ ok: false });
  });

  it("rejects JSON array (not an object)", () => {
    expect(
      validateAiResponse('["html","<p/>"]', "<p/>", "element"),
    ).toMatchObject({ ok: false });
  });
});

describe("ai-edit validate-response — root tag matching", () => {
  it("rejects different root tag (element → section)", () => {
    const r = validateAiResponse(
      '{"html":"<section>Hi</section>"}',
      "<button>Hi</button>",
      "element",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("Root tag changed");
  });

  it("accepts same root tag with different attrs/content", () => {
    const r = validateAiResponse(
      '{"html":"<button class=\\"new\\" id=\\"x\\">Bye</button>"}',
      "<button>Hi</button>",
      "element",
    );
    expect(r.ok).toBe(true);
  });

  it("case-insensitive root tag match", () => {
    const r = validateAiResponse(
      '{"html":"<BUTTON>Hi</BUTTON>"}',
      "<button>Hi</button>",
      "element",
    );
    expect(r.ok).toBe(true);
  });
});

describe("ai-edit validate-response — forbidden tags + URLs", () => {
  it("rejects added <script>", () => {
    const r = validateAiResponse(
      '{"html":"<button>Hi<script>x()</script></button>"}',
      "<button>Hi</button>",
      "element",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/script|iframe|object|embed/i);
  });

  it("rejects added <iframe>", () => {
    const r = validateAiResponse(
      '{"html":"<div><iframe src=\\"x\\"/></div>"}',
      "<div>x</div>",
      "element",
    );
    expect(r.ok).toBe(false);
  });

  it("ALLOWS forbidden tags that were already in the original", () => {
    const r = validateAiResponse(
      '{"html":"<div class=\\"new\\"><iframe src=\\"y\\"/></div>"}',
      "<div><iframe src=\"x\"/></div>",
      "element",
    );
    expect(r.ok).toBe(true);
  });

  it("rejects added onclick handler", () => {
    const r = validateAiResponse(
      '{"html":"<button onclick=\\"x()\\">Hi</button>"}',
      "<button>Hi</button>",
      "element",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("on*");
  });

  it("rejects added javascript: URL", () => {
    const r = validateAiResponse(
      '{"html":"<a href=\\"javascript:alert(1)\\">x</a>"}',
      "<a>x</a>",
      "element",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/javascript|data:/i);
  });

  it("rejects added non-image data: URL", () => {
    const r = validateAiResponse(
      '{"html":"<a href=\\"data:text/html,xx\\">x</a>"}',
      "<a>x</a>",
      "element",
    );
    expect(r.ok).toBe(false);
  });

  it("ALLOWS image data: URLs (img src)", () => {
    const r = validateAiResponse(
      '{"html":"<img src=\\"data:image/png;base64,iVBOR\\"/>"}',
      "<img/>",
      "element",
    );
    expect(r.ok).toBe(true);
  });
});

describe("ai-edit validate-response — length sanity", () => {
  it("rejects element response much larger than input (hallucination guard)", () => {
    // Need to clear both the 1.5x ratio AND the +500-char absolute
    // fallback. Use a moderately large input so the ratio bound bites.
    const moderate = "<p>" + "x".repeat(2000) + "</p>";
    const huge = "<p>" + "x".repeat(moderate.length * 2) + "</p>";
    const r = validateAiResponse(
      JSON.stringify({ html: huge }),
      moderate,
      "element",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/larger than input|hallucinated/i);
  });

  it("ALLOWS small element edits that add reasonable utility classes", () => {
    // The pre-Phase-5 1.5x cap rejected this real-world case where a
    // 19-char button gets a class attribute added.
    const r = validateAiResponse(
      '{"html":"<button class=\\"bg-red-500 text-white p-4 rounded\\">Hi</button>"}',
      "<button>Hi</button>",
      "element",
    );
    expect(r.ok).toBe(true);
  });

  it("rejects section response <20% input (truncation guard)", () => {
    const big = "<section>" + "x".repeat(500) + "</section>";
    const tiny = "<section>x</section>";
    const r = validateAiResponse(
      JSON.stringify({ html: tiny }),
      big,
      "section",
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("20%");
  });

  it("element-mode 1.5x bound does NOT apply to section mode", () => {
    const small = "<section>x</section>";
    const big = "<section>" + "x".repeat(small.length * 2) + "</section>";
    const r = validateAiResponse(
      JSON.stringify({ html: big }),
      small,
      "section",
    );
    expect(r.ok).toBe(true);
  });
});
