import { describe, it, expect } from "vitest";
import {
  APPLY_EDIT_TOOL,
  APPLY_EDIT_TOOL_CHOICE,
  extractToolCallArgs,
} from "../lib/ai-edit/tools";

// Prod-import tests for the Phase 7 tool-calling migration. Per
// research, vLLM/SGLang enforce the JSON Schema at decode time so
// the model literally can't emit invalid JSON — but our parsing
// pipeline still needs to handle:
//   - well-formed tool_call args
//   - malformed args (the rare gateway / parser bug)
//   - non-string fields
//   - absent notes field (allowed)
//   - empty html field (rejected)

describe("APPLY_EDIT_TOOL schema invariants", () => {
  it("declares one function named 'apply_edit'", () => {
    expect(APPLY_EDIT_TOOL.type).toBe("function");
    expect(APPLY_EDIT_TOOL.function.name).toBe("apply_edit");
  });

  it("requires only the 'html' field — notes is optional", () => {
    expect(APPLY_EDIT_TOOL.function.parameters.required).toEqual(["html"]);
  });

  it("declares html + notes as plain strings (NOT nullable — minimax-m2 SGLang bug)", () => {
    // Per research: sglang #16057 — minimax-m2's tool-call parser
    // crashes on union types like `string | null`. We use plain string
    // for both fields and let `notes` be ABSENT rather than nullable.
    const props = APPLY_EDIT_TOOL.function.parameters.properties;
    expect(props.html.type).toBe("string");
    expect(props.notes.type).toBe("string");
  });

  it("forbids additional properties (defensive against model hallucinated fields)", () => {
    expect(APPLY_EDIT_TOOL.function.parameters.additionalProperties).toBe(
      false,
    );
  });

  it("tool_choice forces the apply_edit function explicitly", () => {
    // tool_choice: 'auto' would let the model escape into text mode.
    // We need the function to fire every time — only then can we trust
    // the parse-reliability uplift the migration is supposed to deliver.
    expect(APPLY_EDIT_TOOL_CHOICE.type).toBe("function");
    expect(APPLY_EDIT_TOOL_CHOICE.function.name).toBe("apply_edit");
  });
});

describe("extractToolCallArgs — happy path", () => {
  it("parses well-formed { html, notes } JSON", () => {
    const r = extractToolCallArgs(
      '{"html":"<button class=\\"bg-red-500\\">x</button>","notes":"reddened"}',
    );
    expect(r).toEqual({
      html: '<button class="bg-red-500">x</button>',
      notes: "reddened",
    });
  });

  it("parses { html } without notes (notes optional)", () => {
    const r = extractToolCallArgs('{"html":"<p>x</p>"}');
    expect(r).toEqual({ html: "<p>x</p>" });
  });

  it("ignores empty notes field (drops it)", () => {
    const r = extractToolCallArgs('{"html":"<p>x</p>","notes":""}');
    expect(r).toEqual({ html: "<p>x</p>" });
  });
});

describe("extractToolCallArgs — rejection paths", () => {
  it("returns null on empty input", () => {
    expect(extractToolCallArgs("")).toBeNull();
  });

  it("returns null on non-string input (defensive)", () => {
    expect(extractToolCallArgs(null as unknown as string)).toBeNull();
    expect(extractToolCallArgs(undefined as unknown as string)).toBeNull();
  });

  it("returns null on malformed JSON", () => {
    expect(extractToolCallArgs('{"html": "<p>')).toBeNull();
    expect(extractToolCallArgs("not json at all")).toBeNull();
  });

  it("returns null when html is missing", () => {
    expect(extractToolCallArgs('{"notes":"foo"}')).toBeNull();
  });

  it("returns null when html is not a string", () => {
    expect(extractToolCallArgs('{"html":123}')).toBeNull();
    expect(extractToolCallArgs('{"html":null}')).toBeNull();
    expect(extractToolCallArgs('{"html":["a","b"]}')).toBeNull();
  });

  it("returns null when html is empty string", () => {
    expect(extractToolCallArgs('{"html":""}')).toBeNull();
  });

  it("returns null on JSON array (not an object)", () => {
    expect(extractToolCallArgs('["x"]')).toBeNull();
  });

  it("returns null when notes is non-string (silently drops, keeps html)", () => {
    // Per research, minimax-m2 SGLang parser sometimes emits notes as
    // null instead of omitting it. Defense: drop bad notes silently
    // rather than reject the whole response — the html field is what
    // matters for the swap.
    const r = extractToolCallArgs('{"html":"<p>x</p>","notes":null}');
    expect(r).toEqual({ html: "<p>x</p>" });
  });
});
