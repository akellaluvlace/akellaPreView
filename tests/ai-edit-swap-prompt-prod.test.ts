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

  it("instructs output is REFERENCE's structure filled with TARGET's content (2026-05-18 hotfix wording)", () => {
    // Phase 6 hotfix: prompt rewritten after manual testing showed the
    // model was returning target unchanged because the original prompt
    // contradicted itself ("re-root to target"). New prompt is explicit:
    // output IS reference's structure, with target's content slotted.
    expect(AI_SWAP_SYSTEM_PROMPT).toMatch(
      /REFERENCE'S STRUCTURE FILLED WITH TARGET'S CONTENT/i,
    );
  });

  it("explicitly mandates root tag = REFERENCE's root (not target's)", () => {
    // The killer Phase 6 bug was validator rejecting root-tag changes.
    // Both prompt + validator are now aligned: output root MUST match
    // reference's root, NOT target's. Without this assertion, anyone
    // editing the prompt to "re-root to target" would silently regress
    // the swap to no-op.
    expect(AI_SWAP_SYSTEM_PROMPT).toMatch(
      /root tag = REFERENCE's root tag\. NOT target's/i,
    );
  });

  it("enumerates fields to preserve (text/img/href/svg/sizing-classes)", () => {
    // Per the research: abstract "preserve" causes no-ops. Concrete
    // enumeration works.
    const p = AI_SWAP_SYSTEM_PROMPT.toLowerCase();
    expect(p).toContain("text");
    expect(p).toContain("<img");
    expect(p).toContain("<a href");
    expect(p).toContain("<svg");
    expect(p).toMatch(/sizing classes/i);
  });

  it("forbids the two anti-patterns explicitly (target-unchanged, reference-unchanged)", () => {
    const p = AI_SWAP_SYSTEM_PROMPT.toLowerCase();
    // Anti-no-op rule
    expect(p).toMatch(/target unchanged|visually differ from target/);
    // Anti-reference-clone rule
    expect(p).toMatch(/reference unchanged|lost user's content|contain target's actual/);
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
