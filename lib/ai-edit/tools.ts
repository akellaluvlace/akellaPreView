// 2026-05-19 — Tool-calling schema for the AI Edit + Swap pipeline.
//
// Per Phase 7 research: migrating from `response_format: { type:
// "json_object" }` to OpenAI-compatible tool calling lifts parse
// reliability from ~85-92% to ~95-99% on coder + reasoning models
// (the gap is narrower than older claims but still real). The win is
// that JSON Schema is enforced at decode time on the vLLM/SGLang
// backends Tensorix runs, so syntactically-invalid JSON essentially
// can't happen.
//
// Single tool shape works for both modes:
//   - edit mode: model returns the edited HTML
//   - swap mode: model returns the fused HTML
// Both feed into the same validation + apply pipeline.
//
// Model-specific quirks captured here (also see research notes):
//   - minimax-m2's SGLang parser crashes on union types like
//     `string | null` — we use plain `string` for `notes` and let it
//     be absent rather than nullable.
//   - qwen3-coder is clean on tool calling via vLLM (Tensorix backend).
//   - Both honor `tool_choice: { type: "function", function: {name} }`
//     which forces exactly one call to our function. Without forcing,
//     the model can escape into free-form prose.

export interface TensorixToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<
        string,
        { type: string; description?: string }
      >;
      required: string[];
      additionalProperties: false;
    };
  };
}

export const APPLY_EDIT_TOOL: TensorixToolDefinition = {
  type: "function",
  function: {
    name: "apply_edit",
    description:
      "Return the edited HTML element. The `html` field MUST be valid HTML. The `notes` field is an optional one-sentence summary of what changed.",
    parameters: {
      type: "object",
      properties: {
        html: {
          type: "string",
          description:
            "The full edited HTML element, root tag included. For swap mode this is REFERENCE's structure with TARGET's content slotted in.",
        },
        notes: {
          type: "string",
          description:
            "One short sentence describing what visual aspects you changed. Optional but encouraged.",
        },
      },
      required: ["html"],
      additionalProperties: false,
    },
  },
};

export const APPLY_EDIT_TOOL_CHOICE = {
  type: "function" as const,
  function: { name: "apply_edit" },
};

/**
 * Extract { html, notes? } from a Tensorix tool-call response.
 * Returns null when the response shape doesn't match — caller falls
 * back to the json_object parsing path.
 */
export function extractToolCallArgs(
  text: string,
): { html: string; notes?: string } | null {
  // text comes from the raw response — could be a JSON string of args
  // OR a fallback prose response. The caller passes
  // choices[0].message.tool_calls[0].function.arguments when that
  // path exists; passes raw message.content otherwise.
  if (!text || typeof text !== "string") return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.html !== "string" || obj.html.length === 0) return null;
  const result: { html: string; notes?: string } = { html: obj.html };
  if (typeof obj.notes === "string" && obj.notes.length > 0) {
    result.notes = obj.notes;
  }
  return result;
}
