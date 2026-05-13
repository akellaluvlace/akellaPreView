// Audit F1 — Pure-logic input parser for `POST /api/llm-rewrite`.
//
// Pre-fix the route had `body = (await req.json()) as RewriteRequest`
// followed by field-by-field guards. The cast typed the value as
// `RewriteRequest` BEFORE the guards ran, which means: any future edit
// that moved a property access above the guards (or copied the body to
// another helper) wouldn't get a tsc warning even when the runtime
// shape was broken. This module replaces the cast with a parse-don't-
// validate function — `parseRewriteRequest(raw: unknown)` returns
// either `{ ok: true; value }` (typed) or `{ ok: false; error }`. The
// route handler narrows on `ok` and only sees a typed value in the
// success branch.
//
// Pure-logic only — no fetch, no Next.js imports. Lives in `lib/` (not
// inside `app/api/.../`) so prod-import tests can exercise it without
// pulling Next's server runtime.

export type RewriteProvider = "openai" | "anthropic";

export interface RewriteRequest {
  provider: RewriteProvider;
  apiKey: string;
  model?: string;
  prompt: string;
  elementSource: string;
  classes: string[];
  stream?: boolean;
}

export type ParseRewriteRequestResult =
  | { ok: true; value: RewriteRequest }
  | { ok: false; error: string };

const MIN_API_KEY_LEN = 8;

// Narrow `unknown` → `RewriteRequest` with field-by-field validation.
// The error messages match the strings the original inline guards used
// so existing test fixtures + bench output stay backwards compatible.
//
// Validation order (matters for which error the user sees first when
// multiple fields are wrong):
//   1. root not an object
//   2. provider — first because every downstream branch needs it valid
//   3. apiKey — second since the rate-limit + provider call need it
//   4. prompt / elementSource / classes — required strings/arrays
//   5. model / stream — optional fields, validated only when present
export function parseRewriteRequest(
  raw: unknown,
): ParseRewriteRequestResult {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Invalid request" };
  }
  const r = raw as Record<string, unknown>;

  if (r.provider !== "openai" && r.provider !== "anthropic") {
    return { ok: false, error: 'provider must be "openai" or "anthropic"' };
  }

  if (typeof r.apiKey !== "string" || r.apiKey.length < MIN_API_KEY_LEN) {
    return { ok: false, error: "apiKey missing or too short" };
  }

  if (typeof r.prompt !== "string") {
    return { ok: false, error: "prompt must be a string" };
  }

  if (typeof r.elementSource !== "string") {
    return { ok: false, error: "elementSource must be a string" };
  }

  if (
    !Array.isArray(r.classes) ||
    !r.classes.every((c) => typeof c === "string")
  ) {
    return { ok: false, error: "classes must be string[]" };
  }

  if (r.model !== undefined && typeof r.model !== "string") {
    return { ok: false, error: "model must be a string when set" };
  }

  if (r.stream !== undefined && typeof r.stream !== "boolean") {
    return { ok: false, error: "stream must be a boolean when set" };
  }

  // Build the typed value explicitly. This guards against attacker-
  // controlled extra properties (we don't trust `r` shape past the
  // fields we validated; spreading would carry junk through).
  const value: RewriteRequest = {
    provider: r.provider,
    apiKey: r.apiKey,
    prompt: r.prompt,
    elementSource: r.elementSource,
    classes: r.classes as string[],
  };
  if (typeof r.model === "string") {
    value.model = r.model;
  }
  if (typeof r.stream === "boolean") {
    value.stream = r.stream;
  }
  return { ok: true, value };
}

// Public constants — exported so tests can pin the contract + the route
// handler doesn't duplicate the magic number.
export const REWRITE_REQUEST_PARSER_CONSTANTS = {
  MIN_API_KEY_LEN,
} as const;
