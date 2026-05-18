// 2026-05-17 — AI Edit request validator. Parse-don't-validate pattern
// mirroring lib/llm-rewrite-parser.ts. Route handler narrows on
// `parsed.ok` and never sees an under-typed value.

export type AiEditScope = "element" | "section";

export interface AiEditRequest {
  // Scope of the edit. Drives prompt + max_tokens budget.
  scope: AiEditScope;
  // OuterHTML of the selected element. The thing the model rewrites.
  targetHtml: string;
  // OuterHTML of the parent with the target replaced by `{{TARGET}}`.
  // Element-mode only; section-mode parents are usually <body> and
  // not informative.
  parentContext?: string;
  // User's natural-language change request.
  userPrompt: string;
  // Optional model override. When absent, route uses TENSORIX_DEFAULT_MODEL.
  model?: string;
}

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

// Hard cap on input HTML — protects against malformed payloads + cost
// blow-ups. Section mode at the 8k-token warning bar (plan §6.1) is
// ~28000 chars; 100KB gives generous headroom for absurd cases without
// allowing accidental megabyte uploads.
const MAX_HTML_LENGTH = 100_000;
const MAX_PARENT_CONTEXT_LENGTH = 50_000;
const MAX_PROMPT_LENGTH = 2_000;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function parseAiEditRequest(raw: unknown): ParseResult<AiEditRequest> {
  if (!isPlainObject(raw)) return { ok: false, error: "Body must be an object" };

  const scope = raw.scope;
  if (scope !== "element" && scope !== "section") {
    return { ok: false, error: "scope must be 'element' or 'section'" };
  }

  const targetHtml = raw.targetHtml;
  if (typeof targetHtml !== "string" || targetHtml.length === 0) {
    return { ok: false, error: "targetHtml is required" };
  }
  if (targetHtml.length > MAX_HTML_LENGTH) {
    return { ok: false, error: "targetHtml exceeds 100KB" };
  }

  let parentContext: string | undefined;
  if (raw.parentContext !== undefined) {
    if (typeof raw.parentContext !== "string") {
      return { ok: false, error: "parentContext must be a string" };
    }
    if (raw.parentContext.length > MAX_PARENT_CONTEXT_LENGTH) {
      return { ok: false, error: "parentContext exceeds 50KB" };
    }
    parentContext = raw.parentContext;
  }

  const userPrompt = raw.userPrompt;
  if (typeof userPrompt !== "string" || userPrompt.trim().length === 0) {
    return { ok: false, error: "userPrompt is required" };
  }
  if (userPrompt.length > MAX_PROMPT_LENGTH) {
    return { ok: false, error: "userPrompt exceeds 2000 characters" };
  }

  let model: string | undefined;
  if (raw.model !== undefined) {
    if (typeof raw.model !== "string" || raw.model.length === 0) {
      return { ok: false, error: "model must be a non-empty string" };
    }
    // Slash-form is OpenRouter / Tensorix convention. Reject anything
    // that could be a prompt injection ("--system" etc) — requires the
    // first char to be alphanumeric so leading-dash flags are rejected.
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(raw.model)) {
      return { ok: false, error: "model contains invalid characters" };
    }
    model = raw.model;
  }

  return {
    ok: true,
    value: { scope, targetHtml, parentContext, userPrompt, model },
  };
}
