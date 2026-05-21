import { describe, it, expect } from "vitest";
import {
  BYO_AI_PROVIDERS,
  BYO_AI_PROVIDER_STORAGE_KEY,
  getProviderById,
  orderProvidersByPreference,
} from "../lib/byo-ai/providers";

describe("BYO_AI_PROVIDERS — registry shape", () => {
  it("has four providers: chatgpt, claude, gemini, copy", () => {
    const ids = BYO_AI_PROVIDERS.map((p) => p.id);
    expect(ids).toEqual(["chatgpt", "claude", "gemini", "copy"]);
  });

  it("every provider has label + title + openUrl shape", () => {
    for (const p of BYO_AI_PROVIDERS) {
      expect(typeof p.id).toBe("string");
      expect(typeof p.label).toBe("string");
      expect(p.label.length).toBeGreaterThan(0);
      expect(typeof p.title).toBe("string");
      expect(p.title.length).toBeGreaterThan(20); // Tooltips should be helpful
      // openUrl is string | null
      expect(p.openUrl === null || typeof p.openUrl === "string").toBe(true);
    }
  });

  it("'copy' provider has openUrl = null", () => {
    const copy = BYO_AI_PROVIDERS.find((p) => p.id === "copy");
    expect(copy?.openUrl).toBeNull();
  });

  it("all non-copy providers have https openUrls", () => {
    for (const p of BYO_AI_PROVIDERS) {
      if (p.id === "copy") continue;
      expect(p.openUrl).toMatch(/^https:\/\//);
    }
  });

  it("ChatGPT URL is chatgpt.com (not chat.openai.com)", () => {
    // Per 2026 research — chatgpt.com is the canonical domain; the
    // openai redirect adds a hop.
    const chatgpt = BYO_AI_PROVIDERS.find((p) => p.id === "chatgpt");
    expect(chatgpt?.openUrl).toContain("chatgpt.com");
  });

  it("Claude URL lands on /new (fresh chat)", () => {
    const claude = BYO_AI_PROVIDERS.find((p) => p.id === "claude");
    expect(claude?.openUrl).toContain("claude.ai/new");
  });

  it("Gemini URL lands on /app (chat surface, not marketing page)", () => {
    const gemini = BYO_AI_PROVIDERS.find((p) => p.id === "gemini");
    expect(gemini?.openUrl).toContain("gemini.google.com/app");
  });
});

describe("BYO_AI_PROVIDER_STORAGE_KEY", () => {
  it("uses dropin: prefix for the localStorage namespace", () => {
    expect(BYO_AI_PROVIDER_STORAGE_KEY).toMatch(/^dropin:/);
  });

  it("identifies it as a byo-ai preference", () => {
    expect(BYO_AI_PROVIDER_STORAGE_KEY).toContain("byo-ai");
    expect(BYO_AI_PROVIDER_STORAGE_KEY).toContain("preferred");
  });
});

describe("getProviderById", () => {
  it("returns the matching provider", () => {
    const p = getProviderById("chatgpt");
    expect(p?.id).toBe("chatgpt");
  });

  it("returns null for an unknown id", () => {
    expect(getProviderById("anthropic-claude-pro-max")).toBeNull();
    expect(getProviderById("")).toBeNull();
  });
});

describe("orderProvidersByPreference", () => {
  it("returns the original order when no preference", () => {
    const ordered = orderProvidersByPreference(null);
    expect(ordered.map((p) => p.id)).toEqual([
      "chatgpt",
      "claude",
      "gemini",
      "copy",
    ]);
  });

  it("floats preferred id to the front", () => {
    const ordered = orderProvidersByPreference("gemini");
    expect(ordered[0].id).toBe("gemini");
    // Rest preserve their relative order
    expect(ordered.slice(1).map((p) => p.id)).toEqual([
      "chatgpt",
      "claude",
      "copy",
    ]);
  });

  it("floats 'copy' to the front when preferred", () => {
    const ordered = orderProvidersByPreference("copy");
    expect(ordered[0].id).toBe("copy");
  });

  it("ignores unknown preference id (returns original order)", () => {
    const ordered = orderProvidersByPreference("unknown");
    expect(ordered.map((p) => p.id)).toEqual([
      "chatgpt",
      "claude",
      "gemini",
      "copy",
    ]);
  });

  it("does not mutate the original BYO_AI_PROVIDERS array", () => {
    const before = BYO_AI_PROVIDERS.map((p) => p.id);
    orderProvidersByPreference("gemini");
    const after = BYO_AI_PROVIDERS.map((p) => p.id);
    expect(after).toEqual(before);
  });
});
