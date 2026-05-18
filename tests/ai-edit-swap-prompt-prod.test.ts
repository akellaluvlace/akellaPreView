import { describe, it, expect } from "vitest";
import {
  AI_SWAP_SYSTEM_PROMPT,
  buildSwapUserMessage,
} from "../lib/ai-edit/prompts/swap";
import type { AiEditRequest } from "../lib/ai-edit/parse-request";

// Prod-import tests for lib/ai-edit/prompts/swap.ts (Phase 6).
// The swap prompt is the system's defense against the two failure
// modes from the research:
//   - no-op (output ≈ target, ignored reference)
//   - reference clone (output ≈ reference, lost target's content)
// The tests verify the prompt builder produces sensible XML-tagged
// messages and that the system prompt contains the invariant rules.

function baseSwap(extras: Partial<AiEditRequest> = {}): AiEditRequest {
  return {
    scope: "element",
    mode: "swap",
    targetHtml: "<button>Buy now</button>",
    referenceHtml: "<button class='bg-black text-white p-4'>Click me</button>",
    userPrompt: "",
    ...extras,
  };
}

describe("AI_SWAP_SYSTEM_PROMPT — invariants", () => {
  it("frames the model as a Tailwind specialist", () => {
    expect(AI_SWAP_SYSTEM_PROMPT).toContain("Tailwind");
  });

  it("defines the two XML input tags the user message will use", () => {
    expect(AI_SWAP_SYSTEM_PROMPT).toContain("<dropin_target>");
    expect(AI_SWAP_SYSTEM_PROMPT).toContain("<dropin_reference>");
  });

  it("encodes Pattern 3 inversion — start from REFERENCE, transplant TARGET", () => {
    // Key phrase from the research: model should treat REFERENCE as the
    // skeleton and slot TARGET's content INTO it, not the reverse.
    expect(AI_SWAP_SYSTEM_PROMPT).toMatch(/REFERENCE.{0,40}skeleton/i);
    expect(AI_SWAP_SYSTEM_PROMPT.toLowerCase()).toContain("slot");
  });

  it("enumerates fields to preserve (text/img/href/svg/root-tag)", () => {
    // Per the research: abstract "preserve" causes no-ops. Concrete
    // enumeration works.
    const p = AI_SWAP_SYSTEM_PROMPT.toLowerCase();
    expect(p).toContain("text");
    expect(p).toContain("<img");
    expect(p).toContain("<a href");
    expect(p).toContain("<svg");
    expect(p).toMatch(/root tag/);
  });

  it("forbids the two anti-patterns explicitly (target-identical, reference-identical)", () => {
    const p = AI_SWAP_SYSTEM_PROMPT.toLowerCase();
    // Anti-no-op rule
    expect(p).toMatch(/visually differ from target|identical to target/);
    // Anti-reference-clone rule
    expect(p).toMatch(/target.{0,30}actual.{0,30}text.{0,30}images|placeholder content/);
  });

  it("forbids dangerous output (script/iframe/handlers)", () => {
    const p = AI_SWAP_SYSTEM_PROMPT.toLowerCase();
    expect(p).toContain("<script");
    expect(p).toContain("<iframe");
    expect(p).toContain("on*");
  });

  it("requires raw JSON without fences", () => {
    expect(AI_SWAP_SYSTEM_PROMPT).toMatch(/no markdown fences|raw json/i);
  });
});

describe("buildSwapUserMessage — output shape", () => {
  it("wraps target and reference in XML tags", () => {
    const msg = buildSwapUserMessage(baseSwap());
    expect(msg).toContain("<dropin_target>");
    expect(msg).toContain("<button>Buy now</button>");
    expect(msg).toContain("</dropin_target>");
    expect(msg).toContain("<dropin_reference>");
    expect(msg).toContain("<button class='bg-black text-white p-4'>Click me</button>");
    expect(msg).toContain("</dropin_reference>");
  });

  it("omits user-refinement section when userPrompt is empty", () => {
    const msg = buildSwapUserMessage(baseSwap({ userPrompt: "" }));
    expect(msg).not.toContain("<dropin_user_refinement>");
  });

  it("includes user-refinement section when userPrompt is non-empty", () => {
    const msg = buildSwapUserMessage(
      baseSwap({ userPrompt: "darker and more compact" }),
    );
    expect(msg).toContain("<dropin_user_refinement>");
    expect(msg).toContain("darker and more compact");
    expect(msg).toContain("</dropin_user_refinement>");
  });

  it("trims whitespace from userPrompt", () => {
    const msg = buildSwapUserMessage(
      baseSwap({ userPrompt: "   spaced out   " }),
    );
    expect(msg).toContain("spaced out");
    // The padding should not survive — trim removes leading/trailing.
    expect(msg).not.toContain("   spaced out   ");
  });

  it("throws when referenceHtml is missing (defensive — parser should catch first)", () => {
    expect(() =>
      buildSwapUserMessage({
        ...baseSwap(),
        referenceHtml: undefined,
      }),
    ).toThrow(/referenceHtml/);
  });

  it("places target BEFORE reference in the message (Pattern 3 inversion still applies system-side)", () => {
    // The system prompt does the inversion; the user message stays
    // structural with target first as a stable convention. Verify
    // ordering so we catch regressions where someone flips the
    // builder and breaks the model's structural prior.
    const msg = buildSwapUserMessage(baseSwap());
    const targetIdx = msg.indexOf("<dropin_target>");
    const refIdx = msg.indexOf("<dropin_reference>");
    expect(targetIdx).toBeGreaterThanOrEqual(0);
    expect(refIdx).toBeGreaterThan(targetIdx);
  });
});
