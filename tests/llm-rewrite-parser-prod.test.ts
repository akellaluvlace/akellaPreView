// Prod-import test for `lib/llm-rewrite-parser.ts` (audit F1 follow-up).
//
// The validator replaces the unsafe `(await req.json()) as RewriteRequest`
// cast at `app/api/llm-rewrite/route.ts:420`. These tests pin the parse
// contract: every reject path returns the matching error string, every
// accept path strips unknown keys (defense against attacker-controlled
// extra properties), and the optional fields land only when explicitly
// present.

import { describe, it, expect } from "vitest";
import {
  parseRewriteRequest,
  REWRITE_REQUEST_PARSER_CONSTANTS,
} from "../lib/llm-rewrite-parser";

const validBase = {
  provider: "openai",
  apiKey: "sk-12345678", // 11 chars — above the 8-char minimum
  prompt: "Make it red",
  elementSource: '<div className="">x</div>',
  classes: ["bg-blue-500", "p-4"],
};

describe("parseRewriteRequest — root shape", () => {
  it("rejects null", () => {
    const r = parseRewriteRequest(null);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("Invalid request");
  });

  it("rejects undefined", () => {
    const r = parseRewriteRequest(undefined);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("Invalid request");
  });

  it("rejects primitives", () => {
    expect(parseRewriteRequest("string").ok).toBe(false);
    expect(parseRewriteRequest(42).ok).toBe(false);
    expect(parseRewriteRequest(true).ok).toBe(false);
  });

  it("rejects arrays at root (audit F1: cast couldn't catch this)", () => {
    const r = parseRewriteRequest([validBase]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("Invalid request");
  });
});

describe("parseRewriteRequest — provider field", () => {
  it("accepts openai", () => {
    const r = parseRewriteRequest({ ...validBase, provider: "openai" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.provider).toBe("openai");
  });

  it("accepts anthropic", () => {
    const r = parseRewriteRequest({ ...validBase, provider: "anthropic" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.provider).toBe("anthropic");
  });

  it("rejects unknown provider", () => {
    const r = parseRewriteRequest({ ...validBase, provider: "google" });
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.error).toBe('provider must be "openai" or "anthropic"');
  });

  it("rejects missing provider", () => {
    const noProvider = { ...validBase } as Record<string, unknown>;
    delete noProvider.provider;
    const r = parseRewriteRequest(noProvider);
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.error).toBe('provider must be "openai" or "anthropic"');
  });

  it("rejects non-string provider", () => {
    const r = parseRewriteRequest({ ...validBase, provider: 1 });
    expect(r.ok).toBe(false);
  });
});

describe("parseRewriteRequest — apiKey field", () => {
  it("accepts an 8-char apiKey (the minimum)", () => {
    const r = parseRewriteRequest({ ...validBase, apiKey: "12345678" });
    expect(r.ok).toBe(true);
  });

  it("rejects a 7-char apiKey", () => {
    const r = parseRewriteRequest({ ...validBase, apiKey: "1234567" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("apiKey missing or too short");
  });

  it("rejects empty apiKey", () => {
    const r = parseRewriteRequest({ ...validBase, apiKey: "" });
    expect(r.ok).toBe(false);
  });

  it("rejects non-string apiKey", () => {
    const r = parseRewriteRequest({ ...validBase, apiKey: 12345678 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("apiKey missing or too short");
  });

  it("rejects missing apiKey", () => {
    const noKey = { ...validBase } as Record<string, unknown>;
    delete noKey.apiKey;
    const r = parseRewriteRequest(noKey);
    expect(r.ok).toBe(false);
  });
});

describe("parseRewriteRequest — prompt field", () => {
  it("accepts empty string (the route accepts any string)", () => {
    const r = parseRewriteRequest({ ...validBase, prompt: "" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.prompt).toBe("");
  });

  it("rejects non-string prompt", () => {
    const r = parseRewriteRequest({ ...validBase, prompt: 42 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("prompt must be a string");
  });

  it("rejects missing prompt", () => {
    const noPrompt = { ...validBase } as Record<string, unknown>;
    delete noPrompt.prompt;
    const r = parseRewriteRequest(noPrompt);
    expect(r.ok).toBe(false);
  });
});

describe("parseRewriteRequest — elementSource field", () => {
  it("accepts empty string", () => {
    const r = parseRewriteRequest({ ...validBase, elementSource: "" });
    expect(r.ok).toBe(true);
  });

  it("rejects non-string", () => {
    const r = parseRewriteRequest({ ...validBase, elementSource: null });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("elementSource must be a string");
  });
});

describe("parseRewriteRequest — classes field", () => {
  it("accepts empty array", () => {
    const r = parseRewriteRequest({ ...validBase, classes: [] });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.classes).toEqual([]);
  });

  it("rejects non-array", () => {
    const r = parseRewriteRequest({ ...validBase, classes: "p-4" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("classes must be string[]");
  });

  it("rejects array with non-string element", () => {
    const r = parseRewriteRequest({
      ...validBase,
      classes: ["p-4", 42, "m-2"],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("classes must be string[]");
  });

  it("rejects missing classes", () => {
    const noClasses = { ...validBase } as Record<string, unknown>;
    delete noClasses.classes;
    const r = parseRewriteRequest(noClasses);
    expect(r.ok).toBe(false);
  });
});

describe("parseRewriteRequest — optional model field", () => {
  it("accepts undefined model", () => {
    const r = parseRewriteRequest(validBase);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.model).toBeUndefined();
  });

  it("accepts string model", () => {
    const r = parseRewriteRequest({ ...validBase, model: "gpt-4o" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.model).toBe("gpt-4o");
  });

  it("rejects non-string model when set", () => {
    const r = parseRewriteRequest({ ...validBase, model: 42 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("model must be a string when set");
  });
});

describe("parseRewriteRequest — optional stream field", () => {
  it("accepts undefined stream", () => {
    const r = parseRewriteRequest(validBase);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.stream).toBeUndefined();
  });

  it("accepts true", () => {
    const r = parseRewriteRequest({ ...validBase, stream: true });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.stream).toBe(true);
  });

  it("accepts false", () => {
    const r = parseRewriteRequest({ ...validBase, stream: false });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.stream).toBe(false);
  });

  it("rejects non-boolean stream when set", () => {
    const r = parseRewriteRequest({ ...validBase, stream: "true" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("stream must be a boolean when set");
  });
});

describe("parseRewriteRequest — output strips junk", () => {
  it("attacker extra properties don't carry into the typed value", () => {
    const evil = {
      ...validBase,
      __proto__: { admin: true },
      injectedField: "rm -rf /",
      _id: "secret",
    };
    const r = parseRewriteRequest(evil);
    expect(r.ok).toBe(true);
    if (r.ok) {
      // Only the validated fields exist
      expect(Object.keys(r.value).sort()).toEqual(
        ["apiKey", "classes", "elementSource", "prompt", "provider"].sort(),
      );
      // No junk leaked
      expect((r.value as unknown as Record<string, unknown>).injectedField).toBeUndefined();
      expect((r.value as unknown as Record<string, unknown>)._id).toBeUndefined();
    }
  });

  it("preserves classes array reference identity for downstream use", () => {
    // Not a hard contract — but an implementation note. If we later need
    // to copy the array (e.g. to defend against mutation), this test
    // will fail and we'll know to update both sides.
    const classes = ["p-4", "m-2"];
    const r = parseRewriteRequest({ ...validBase, classes });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.classes).toBe(classes);
  });
});

describe("parseRewriteRequest — validation order (first-error-wins)", () => {
  it("provider error fires before apiKey error", () => {
    const r = parseRewriteRequest({
      provider: "google",
      apiKey: "tooshort",
      prompt: "x",
      elementSource: "x",
      classes: [],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("provider");
  });

  it("apiKey error fires before prompt error", () => {
    const r = parseRewriteRequest({
      provider: "openai",
      apiKey: "x",
      prompt: 42,
      elementSource: "x",
      classes: [],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("apiKey");
  });
});

describe("parseRewriteRequest — public constants", () => {
  it("MIN_API_KEY_LEN locked to 8", () => {
    expect(REWRITE_REQUEST_PARSER_CONSTANTS.MIN_API_KEY_LEN).toBe(8);
  });
});
