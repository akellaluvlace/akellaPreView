import { describe, it, expect } from "vitest";
import { parseAiEditRequest } from "../lib/ai-edit/parse-request";

// Prod-import test for lib/ai-edit/parse-request.ts. Mirrors the
// parse-don't-validate pattern in lib/llm-rewrite-parser tests. Covers
// the validator's contract: every accept path must produce a fully-
// typed AiEditRequest, every reject path must surface a clear reason.

describe("ai-edit parse-request — accepts valid input", () => {
  it("accepts minimal element-mode request", () => {
    const r = parseAiEditRequest({
      scope: "element",
      targetHtml: "<button>Hi</button>",
      userPrompt: "make it red",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.scope).toBe("element");
      expect(r.value.targetHtml).toBe("<button>Hi</button>");
      expect(r.value.userPrompt).toBe("make it red");
      expect(r.value.parentContext).toBeUndefined();
      expect(r.value.model).toBeUndefined();
    }
  });

  it("accepts section-mode request with optional fields", () => {
    const r = parseAiEditRequest({
      scope: "section",
      targetHtml: "<section><h1>Hi</h1></section>",
      parentContext: "<body>{{TARGET}}</body>",
      userPrompt: "redesign as split layout",
      model: "qwen/qwen3-coder-30b-a3b-instruct",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.parentContext).toBe("<body>{{TARGET}}</body>");
      expect(r.value.model).toBe("qwen/qwen3-coder-30b-a3b-instruct");
    }
  });
});

describe("ai-edit parse-request — swap mode (Phase 6)", () => {
  it("defaults mode to 'edit' when omitted", () => {
    const r = parseAiEditRequest({
      scope: "element",
      targetHtml: "<button>Hi</button>",
      userPrompt: "make it red",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.mode).toBe("edit");
  });

  it("accepts mode='swap' with referenceHtml", () => {
    const r = parseAiEditRequest({
      scope: "element",
      mode: "swap",
      targetHtml: "<button>Buy</button>",
      referenceHtml: "<button class='glass'>Click</button>",
      userPrompt: "",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.mode).toBe("swap");
      expect(r.value.referenceHtml).toBe("<button class='glass'>Click</button>");
    }
  });

  it("rejects mode='swap' WITHOUT referenceHtml", () => {
    const r = parseAiEditRequest({
      scope: "element",
      mode: "swap",
      targetHtml: "<button>Hi</button>",
      userPrompt: "",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("referenceHtml");
  });

  it("rejects mode='swap' with EMPTY referenceHtml", () => {
    const r = parseAiEditRequest({
      scope: "element",
      mode: "swap",
      targetHtml: "<button>Hi</button>",
      referenceHtml: "",
      userPrompt: "",
    });
    expect(r.ok).toBe(false);
  });

  it("allows empty userPrompt in swap mode (library pick conveys intent)", () => {
    const r = parseAiEditRequest({
      scope: "element",
      mode: "swap",
      targetHtml: "<button>Buy</button>",
      referenceHtml: "<button>X</button>",
      userPrompt: "",
    });
    expect(r.ok).toBe(true);
  });

  it("still requires non-empty userPrompt in edit mode", () => {
    const r = parseAiEditRequest({
      scope: "element",
      mode: "edit",
      targetHtml: "<button>Hi</button>",
      userPrompt: "",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects invalid mode value", () => {
    const r = parseAiEditRequest({
      scope: "element",
      mode: "delete",
      targetHtml: "<button>Hi</button>",
      userPrompt: "x",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("mode");
  });

  it("rejects oversized referenceHtml (>50KB)", () => {
    const giant = "<div>" + "x".repeat(50_001) + "</div>";
    const r = parseAiEditRequest({
      scope: "element",
      mode: "swap",
      targetHtml: "<button>Hi</button>",
      referenceHtml: giant,
      userPrompt: "",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("50KB");
  });
});

describe("ai-edit parse-request — rejects malformed input", () => {
  it("rejects non-object body", () => {
    expect(parseAiEditRequest("hello")).toMatchObject({
      ok: false,
      error: expect.stringContaining("Body"),
    });
    expect(parseAiEditRequest(null)).toMatchObject({ ok: false });
    expect(parseAiEditRequest([])).toMatchObject({ ok: false });
  });

  it("rejects missing or invalid scope", () => {
    expect(parseAiEditRequest({ targetHtml: "<x/>", userPrompt: "x" })).toMatchObject({
      ok: false,
      error: expect.stringContaining("scope"),
    });
    expect(
      parseAiEditRequest({ scope: "page", targetHtml: "<x/>", userPrompt: "x" }),
    ).toMatchObject({ ok: false });
  });

  it("rejects empty or missing targetHtml", () => {
    expect(parseAiEditRequest({ scope: "element", userPrompt: "x" })).toMatchObject({
      ok: false,
      error: expect.stringContaining("targetHtml"),
    });
    expect(
      parseAiEditRequest({ scope: "element", targetHtml: "", userPrompt: "x" }),
    ).toMatchObject({ ok: false });
  });

  it("rejects oversized targetHtml (>100KB)", () => {
    const giant = "<div>" + "x".repeat(100_001) + "</div>";
    expect(
      parseAiEditRequest({ scope: "element", targetHtml: giant, userPrompt: "x" }),
    ).toMatchObject({
      ok: false,
      error: expect.stringContaining("100KB"),
    });
  });

  it("rejects empty userPrompt", () => {
    expect(
      parseAiEditRequest({ scope: "element", targetHtml: "<x/>", userPrompt: "" }),
    ).toMatchObject({ ok: false, error: expect.stringContaining("userPrompt") });
    // Whitespace-only counts as empty after trim.
    expect(
      parseAiEditRequest({ scope: "element", targetHtml: "<x/>", userPrompt: "   " }),
    ).toMatchObject({ ok: false });
  });

  it("rejects oversized userPrompt (>2000 chars)", () => {
    const giant = "x".repeat(2001);
    expect(
      parseAiEditRequest({ scope: "element", targetHtml: "<x/>", userPrompt: giant }),
    ).toMatchObject({ ok: false, error: expect.stringContaining("2000") });
  });

  it("rejects model with invalid characters (prompt injection guard)", () => {
    expect(
      parseAiEditRequest({
        scope: "element",
        targetHtml: "<x/>",
        userPrompt: "x",
        model: "--system",
      }),
    ).toMatchObject({ ok: false, error: expect.stringContaining("invalid") });
    expect(
      parseAiEditRequest({
        scope: "element",
        targetHtml: "<x/>",
        userPrompt: "x",
        model: "qwen/foo bar",
      }),
    ).toMatchObject({ ok: false });
  });

  it("accepts model with allowed chars (slash, dot, dash, underscore)", () => {
    expect(
      parseAiEditRequest({
        scope: "element",
        targetHtml: "<x/>",
        userPrompt: "x",
        model: "qwen/qwen3-coder-30b-a3b-instruct",
      }),
    ).toMatchObject({ ok: true });
    expect(
      parseAiEditRequest({
        scope: "element",
        targetHtml: "<x/>",
        userPrompt: "x",
        model: "minimax/minimax-m2.5",
      }),
    ).toMatchObject({ ok: true });
  });

  it("rejects oversized parentContext (>50KB)", () => {
    const giant = "<div>" + "x".repeat(50_001) + "</div>";
    expect(
      parseAiEditRequest({
        scope: "element",
        targetHtml: "<x/>",
        userPrompt: "x",
        parentContext: giant,
      }),
    ).toMatchObject({
      ok: false,
      error: expect.stringContaining("50KB"),
    });
  });
});
