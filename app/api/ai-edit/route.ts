// 2026-05-17 — AI Edit API route. Server-paid Tensorix proxy.
// Plan: docs/superpowers/plans/2026-05-17-ai-edit-element-section.md §4.3.
//
// Unlike /api/llm-rewrite (BYO-key relay), this route uses a server-held
// Tensorix key. The key lives in env (TENSORIX_API_KEY) and never reaches
// the client. Rate-limiting + cost ceilings are server-side per plan §6.3+§6.4.
//
// Tensorix is OpenAI-compatible — same /chat/completions endpoint, same
// response_format: { type: "json_object" }. Default model is set via
// TENSORIX_DEFAULT_MODEL (minimax/minimax-m2). Caller can override with
// a "model" field in the request body (validated against an allowlist
// pattern in parseAiEditRequest).

import { NextResponse } from "next/server";
import { parseAiEditRequest } from "@/lib/ai-edit/parse-request";
import { AI_EDIT_SYSTEM_PROMPT } from "@/lib/ai-edit/prompts/system";
import { buildUserMessage } from "@/lib/ai-edit/prompts/user-message";
import {
  AI_SWAP_SYSTEM_PROMPT,
  buildSwapUserMessage,
} from "@/lib/ai-edit/prompts/swap";
import {
  APPLY_EDIT_TOOL,
  APPLY_EDIT_TOOL_CHOICE,
  extractToolCallArgs,
} from "@/lib/ai-edit/tools";
import { validateAiResponse } from "@/lib/ai-edit/validate-response";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Two-tier rate limiting per plan §6.3:
//   - Burst: 30 / minute / IP — prevents click-spam blowing through the
//     Tensorix quota in one second.
//   - Hourly: 120 / hour / IP — free-tier cap (plan suggested 60; bumped
//     to 120 for now since most sessions hit ~20-40 edits and we don't
//     want to wall normal use).
// Both walls are TENANT-INSENSITIVE in v1: the IP IS the user. Tighter
// per-account caps would need an auth surface we don't have yet.
const minuteLimiter = createRateLimiter({ limit: 30, windowMs: 60_000 });
const hourlyLimiter = createRateLimiter({
  limit: 120,
  windowMs: 60 * 60_000,
  sweepEveryCalls: 256,
});

function readClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

type ApiResponse =
  | {
      ok: true;
      html: string;
      notes?: string;
      model: string;
      usage?: { prompt: number; completion: number; total: number };
    }
  | { ok: false; error: string };

function fail(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>({ ok: false, error }, { status });
}

interface TensorixToolCall {
  id?: string;
  type?: string;
  function?: {
    name?: string;
    arguments?: string;
  };
}

interface TensorixChoice {
  message?: {
    content?: string | null;
    tool_calls?: TensorixToolCall[];
  };
  finish_reason?: string;
}

interface TensorixUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

interface TensorixResponse {
  choices?: TensorixChoice[];
  usage?: TensorixUsage;
}

// Hard per-call timeout. Manual testing showed Tensorix occasionally
// taking 90s+ on minimax-m2 — user-facing latency that crosses into
// "is this broken?" territory. 45s is generous enough to absorb
// reasoning-model passes on big payloads while still aborting clear
// hangs. Plan §3.4 SLA was 6s median; this is the upper bound.
const TENSORIX_CALL_TIMEOUT_MS = 45_000;

async function callTensorix(
  apiKey: string,
  baseUrl: string,
  model: string,
  systemPrompt: string,
  userMessage: string,
  maxTokens: number,
): Promise<
  | { ok: true; text: string; usage?: TensorixUsage }
  | { ok: false; status: number; error: string }
> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TENSORIX_CALL_TIMEOUT_MS);
  let res: Response;
  try {
    // Phase 7 — tool calling. Forces the model to return its result
    // via `tool_calls[0].function.arguments` (stringified JSON matching
    // our schema). vLLM/SGLang enforce the schema at decode time, so
    // syntactically-invalid JSON essentially can't happen. Fallback
    // path below handles the rare model that ignores `tools` and
    // returns prose in `message.content` instead.
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [APPLY_EDIT_TOOL],
        tool_choice: APPLY_EDIT_TOOL_CHOICE,
        // Keep response_format as a belt-and-braces — if the model
        // refuses the tool call and falls back to content, we still
        // want valid JSON there.
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: maxTokens,
        stream: false,
      }),
      signal: ac.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    // Distinguish a timeout-driven abort from other network errors so
    // the toast can be specific ("AI is taking too long" vs generic
    // "Network error"). DOMException with name "AbortError" is the
    // standard shape for both fetch-aborts and signal-driven aborts.
    const isAbort =
      (e instanceof Error && e.name === "AbortError") || ac.signal.aborted;
    if (isAbort) {
      return {
        ok: false,
        status: 504,
        error: `Tensorix call exceeded ${TENSORIX_CALL_TIMEOUT_MS / 1000}s timeout`,
      };
    }
    return { ok: false, status: 0, error: `Network: ${String(e)}` };
  }
  clearTimeout(timer);
  if (!res.ok) {
    // Don't leak the response body — it can contain the model name + the
    // request preview which is fine, but provider error envelopes are
    // inconsistent. Surface status + short tag only.
    let snippet = "";
    try {
      snippet = (await res.text()).slice(0, 200);
    } catch {
      // ignore
    }
    return {
      ok: false,
      status: res.status,
      error: `Tensorix ${res.status}${snippet ? ": " + snippet : ""}`,
    };
  }
  let json: TensorixResponse;
  try {
    json = (await res.json()) as TensorixResponse;
  } catch {
    return { ok: false, status: 502, error: "Tensorix returned non-JSON" };
  }
  // Phase 7 — Prefer tool_calls (constrained-decode JSON, ~99% parse
  // reliability). Fall back to message.content (json_object mode) when
  // the model refuses the tool call or the gateway dropped the tools
  // field. Both paths converge on a single `text` string the caller
  // passes through validateAiResponse.
  const choice = json.choices?.[0];
  const toolCall = choice?.message?.tool_calls?.[0];
  if (toolCall && toolCall.function?.name === "apply_edit") {
    const args = toolCall.function?.arguments ?? "";
    // Sanity-extract — confirms args is parseable JSON with `html` field.
    // If extractToolCallArgs returns null, args was malformed; fall
    // through to the content path rather than fail outright (the model
    // might have ALSO emitted prose content).
    const parsed = extractToolCallArgs(args);
    if (parsed) {
      // Re-encode as JSON so callers downstream can run the same
      // validation pipeline. Drop notes when absent rather than
      // emit `null` (avoids the SGLang minimax-m2 union-type bug).
      const rebuilt: { html: string; notes?: string } = { html: parsed.html };
      if (parsed.notes) rebuilt.notes = parsed.notes;
      return {
        ok: true,
        text: JSON.stringify(rebuilt),
        usage: json.usage,
      };
    }
    console.warn("[ai-edit] tool_call args malformed — falling back to content", {
      model,
      argsPreview: args.slice(0, 200),
    });
  }
  const text = choice?.message?.content ?? "";
  if (!text) {
    return {
      ok: false,
      status: 502,
      error: "Tensorix response had neither tool_call nor content",
    };
  }
  return { ok: true, text, usage: json.usage };
}

// Plan §8 telemetry. ONE structured log line per request, regardless of
// outcome. Hits the dev terminal in dev, ends up in Vercel logs in prod.
// Fields chosen to satisfy "what failed and why" + "how much did this
// cost" without leaking template content. Times in ms, sizes in bytes.
interface TelemetryEvent {
  outcome:
    | "success"
    | "no-op-after-retry"
    | "validation-failed"
    | "tensorix-error"
    | "rate-limited-minute"
    | "rate-limited-hour"
    | "bad-request"
    | "server-misconfigured";
  scope?: "element" | "section";
  modelRequested?: string;
  modelUsed?: string;
  status: number;
  latencyMs: number;
  targetHtmlLen?: number;
  responseHtmlLen?: number;
  promptTokens?: number;
  completionTokens?: number;
  retried?: boolean;
  fellBack?: boolean;
  noOpRetried?: boolean;
  reason?: string;
}

function emitTelemetry(evt: TelemetryEvent): void {
  console.log("[ai-edit] telemetry", evt);
}

export async function POST(req: Request): Promise<Response> {
  const requestStart = Date.now();
  // Server-held env. If misconfigured surface a 500 so the operator
  // sees it; the client toast already has a generic fallback.
  const apiKey = process.env.TENSORIX_API_KEY;
  const baseUrl = process.env.TENSORIX_BASE_URL ?? "https://api.tensorix.ai/v1";
  // 2026-05-17 — Defaults: qwen3-coder default for element-mode (surgical
  // class edits — coder-tagged, no-reasoning, 1-3s). minimax-m2 default
  // for section-mode (composition reasoning helps creative restructuring).
  // User can still override via the `model` field in the request body.
  // Env vars override either default — useful when testing other models.
  const elementDefault =
    process.env.TENSORIX_DEFAULT_MODEL ??
    "qwen/qwen3-coder-30b-a3b-instruct";
  const sectionDefault =
    process.env.TENSORIX_SECTION_MODEL ?? "minimax/minimax-m2";
  const fallbackModel =
    process.env.TENSORIX_FALLBACK_MODEL ?? "minimax/minimax-m2";
  if (!apiKey) {
    emitTelemetry({
      outcome: "server-misconfigured",
      status: 500,
      latencyMs: Date.now() - requestStart,
    });
    return fail("Server is not configured for AI Edit", 500);
  }

  const ip = readClientIp(req);
  const now = Date.now();
  if (!minuteLimiter.allow(ip, now)) {
    emitTelemetry({
      outcome: "rate-limited-minute",
      status: 429,
      latencyMs: Date.now() - requestStart,
    });
    return fail("Rate limited (30 / minute) — slow down and retry", 429);
  }
  if (!hourlyLimiter.allow(ip, now)) {
    emitTelemetry({
      outcome: "rate-limited-hour",
      status: 429,
      latencyMs: Date.now() - requestStart,
    });
    return fail(
      "Hourly limit reached (120 / hour) — take a break or upgrade",
      429,
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    emitTelemetry({
      outcome: "bad-request",
      status: 400,
      latencyMs: Date.now() - requestStart,
      reason: "invalid-json",
    });
    return fail("Invalid JSON body", 400);
  }

  const parsed = parseAiEditRequest(raw);
  if (!parsed.ok) {
    emitTelemetry({
      outcome: "bad-request",
      status: 400,
      latencyMs: Date.now() - requestStart,
      reason: parsed.error,
    });
    return fail(parsed.error, 400);
  }
  const body = parsed.value;

  // 2026-05-20 hotfix — Switch EDIT mode default to minimax-m2 too.
  // Manual testing exposed qwen-coder's failure pattern: interprets
  // ambiguous prompts ("patterned" → Unsplash URL), changes root tags
  // semantically (<div> → <article>), occasionally emits JSX expressions
  // (`{cardCls}`) into rendered HTML output. Reasoning models follow
  // strict instructions more reliably. Cost goes up ~5x ($60→$300/mo
  // at 1k users) but production quality demands it. qwen-coder retained
  // as cross-model fallback when minimax flakes.
  //
  // All defaults now route to sectionDefault (minimax-m2 from env).
  // Caller can still override per-request via body.model.
  const defaultModel = sectionDefault;
  void elementDefault; // unused for now; kept for future scope-aware routing
  const model = body.model ?? defaultModel;
  // Plan §4.3 max_tokens: 1500 element, 6000 section. Bump section to
  // 16000 — many real hero/feature sections in the template library
  // serialize at 4-8k chars input, and the model needs comparable
  // output budget plus reasoning overhead. minimax-m2 supports 197k
  // context; we're nowhere near a hard limit.
  const maxTokens = body.scope === "section" ? 16000 : 2000;
  // Phase 6 — Mode dispatch. Swap mode fuses target + reference via a
  // separate system prompt (Pattern 3 inverted framing). Edit mode is
  // the existing natural-language path.
  const systemPrompt =
    body.mode === "swap" ? AI_SWAP_SYSTEM_PROMPT : AI_EDIT_SYSTEM_PROMPT;
  const userMessage =
    body.mode === "swap" ? buildSwapUserMessage(body) : buildUserMessage(body);
  console.log("[ai-edit] request", {
    scope: body.scope,
    mode: body.mode,
    model,
    targetHtmlLen: body.targetHtml.length,
    referenceHtmlLen: body.referenceHtml?.length ?? 0,
    promptLen: body.userPrompt.length,
    maxTokens,
  });

  // Transient-fault tolerant strategy:
  //   1. Try default model.
  //   2. If 5xx / network / 429, retry SAME model once after 250ms.
  //   3. If STILL failing, try fallback model.
  // Total worst case: ~3 upstream calls. The 250ms gap is enough to
  // get past a transient Tensorix worker race; we don't add jittered
  // backoff because the user is waiting in the prompt bar.
  function isTransient(status: number): boolean {
    return status === 0 || status === 429 || status >= 500;
  }
  function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  let attempt = await callTensorix(
    apiKey,
    baseUrl,
    model,
    systemPrompt,
    userMessage,
    maxTokens,
  );
  let modelUsed = model;

  if (!attempt.ok && isTransient(attempt.status)) {
    console.warn("[ai-edit] retry-same", {
      model,
      status: attempt.status,
      error: attempt.error.slice(0, 200),
    });
    await sleep(250);
    attempt = await callTensorix(
      apiKey,
      baseUrl,
      model,
      systemPrompt,
      userMessage,
      maxTokens,
    );
  }

  if (
    !attempt.ok &&
    isTransient(attempt.status) &&
    fallbackModel &&
    fallbackModel !== model
  ) {
    console.warn("[ai-edit] fallback-model", {
      from: model,
      to: fallbackModel,
      status: attempt.status,
      error: attempt.error.slice(0, 200),
    });
    attempt = await callTensorix(
      apiKey,
      baseUrl,
      fallbackModel,
      systemPrompt,
      userMessage,
      maxTokens,
    );
    modelUsed = fallbackModel;
  }

  // Track whether we retried + fell back for telemetry.
  const retried = modelUsed === model && attempt.ok === false ? false : false;
  // Simpler — derive at emit time by comparing modelUsed vs model.
  if (!attempt.ok) {
    console.error("[ai-edit] tensorix non-ok", {
      model: modelUsed,
      status: attempt.status,
      error: attempt.error.slice(0, 300),
    });
    emitTelemetry({
      outcome: "tensorix-error",
      scope: body.scope,
      modelRequested: model,
      modelUsed,
      status: attempt.status >= 400 ? attempt.status : 502,
      latencyMs: Date.now() - requestStart,
      targetHtmlLen: body.targetHtml.length,
      fellBack: modelUsed !== model,
      reason: attempt.error.slice(0, 200),
    });
    return fail(attempt.error, attempt.status >= 400 ? attempt.status : 502);
  }
  void retried;

  // Paranoid diagnostic for the 2026-05-18 hotfix manual-test —
  // confirm the validator receives mode + referenceHtml correctly.
  // If `validatorMode` ever shows 'edit' on a swap request, the route
  // is dropping the field between parse + validator-call (HMR cache
  // bug or similar). If `validatorRefHtmlLen` shows 0 with mode=swap,
  // the parser stripped it.
  console.log("[ai-edit] validator-input", {
    validatorMode: body.mode,
    validatorRefHtmlLen: body.referenceHtml?.length ?? 0,
    rawTextLen: attempt.text.length,
  });
  let validated = validateAiResponse(attempt.text, body.targetHtml, body.scope, body.mode, body.referenceHtml);
  // 2026-05-20 — Retry once for the specific nested-duplicate case.
  // Manual test caught qwen-coder inserting a <div class="glass-card">
  // INSIDE the existing <div class="glass-card"> when the prompt was
  // ambiguous ("patterned background"). One emphatic retry with an
  // explicit "do not nest" instruction recovers most cases.
  if (!validated.ok && /nested-duplicate/i.test(validated.error)) {
    console.warn("[ai-edit] nested-duplicate detected — retrying with explicit suffix", {
      model: modelUsed,
      reason: validated.error,
    });
    const nestRetryMsg =
      userMessage +
      "\n\nYour previous response NESTED a duplicate of the input element inside itself. This is forbidden. Do NOT insert a new <div>, <section>, or wrapper of the same kind to achieve visual effects. Apply class-level changes ONLY to the existing root element. Try again.";
    const nestRetry = await callTensorix(
      apiKey,
      baseUrl,
      modelUsed,
      systemPrompt,
      nestRetryMsg,
      maxTokens,
    );
    if (nestRetry.ok) {
      const reValidated = validateAiResponse(
        nestRetry.text,
        body.targetHtml,
        body.scope,
        body.mode,
        body.referenceHtml,
      );
      if (reValidated.ok) {
        validated = reValidated;
        attempt = nestRetry;
      }
    }
  }
  if (!validated.ok) {
    console.error("[ai-edit] validation failed", {
      model: modelUsed,
      scope: body.scope,
      reason: validated.error,
      rawTextLen: attempt.text.length,
      rawTextStart: attempt.text.slice(0, 200),
      rawTextEnd: attempt.text.slice(-200),
    });
    emitTelemetry({
      outcome: "validation-failed",
      scope: body.scope,
      modelRequested: model,
      modelUsed,
      status: 502,
      latencyMs: Date.now() - requestStart,
      targetHtmlLen: body.targetHtml.length,
      fellBack: modelUsed !== model,
      reason: validated.error,
    });
    return fail(validated.error, 502);
  }

  // No-op detection — 2026-05-20 hotfix after the previous round's
  // 0.92 trigram threshold false-positived legit single-class edits
  // ("bg-stone-200" → "bg-red-500" had ~93% trigram overlap and got
  // wrongly flagged as no-op). New rule: ONLY exact-equality post-
  // normalize. If the strings are byte-identical after stripping
  // OIDs + sorting class lists + collapsing whitespace → it's truly
  // a no-op. Any meaningful char change survives normalization.
  function normalizeForCompare(s: string): string {
    return (
      s
        // Strip Dropin-injected attrs that vary by re-render
        .replace(/\s*data-dropin-id="[^"]*"/g, "")
        .replace(/\s*data-dropin-loc="[^"]*"/g, "")
        // Sort class attribute values so reordering doesn't fool us
        .replace(/class="([^"]*)"/g, (_, classes: string) => {
          const sorted = classes
            .split(/\s+/)
            .filter(Boolean)
            .sort()
            .join(" ");
          return `class="${sorted}"`;
        })
        // Collapse whitespace
        .replace(/\s+/g, " ")
        .trim()
    );
  }
  const isNoOp = (a: string, b: string): boolean => {
    if (a === b) return true;
    const na = normalizeForCompare(a);
    const nb = normalizeForCompare(b);
    return na === nb;
  };

  if (isNoOp(validated.value.html, body.targetHtml)) {
    console.warn("[ai-edit] no-op response — retrying with emphatic suffix", {
      model: modelUsed,
      mode: body.mode,
      htmlLen: validated.value.html.length,
    });
    // Phase 6 — Mode-aware emphatic suffix. Swap mode's failure mode is
    // "ignored the reference" — the model returned target nearly intact.
    // The fix-up has to specifically push the model back toward the
    // reference's design DNA, not a generic "apply a change."
    const retryUserMessage =
      userMessage +
      (body.mode === "swap"
        ? "\n\nYour previous response was nearly identical to <dropin_target>. You ignored <dropin_reference>. You MUST adopt REFERENCE's classes, colors, typography, and spacing while keeping TARGET's text/images. Try again."
        : "\n\nYour previous response returned HTML that is nearly identical to the input. The user explicitly asked for a change. Apply a real, visible modification this time. Output JSON only.");
    const retryAttempt = await callTensorix(
      apiKey,
      baseUrl,
      modelUsed,
      systemPrompt,
      retryUserMessage,
      maxTokens,
    );
    if (retryAttempt.ok) {
      const retryValidated = validateAiResponse(
        retryAttempt.text,
        body.targetHtml,
        body.scope,
        body.mode,
        body.referenceHtml,
      );
      if (retryValidated.ok && !isNoOp(retryValidated.value.html, body.targetHtml)) {
        validated = retryValidated;
        attempt = retryAttempt;
      } else {
        console.error("[ai-edit] no-op retry still failed", {
          model: modelUsed,
          retryOk: retryValidated.ok,
          retryReason: retryValidated.ok ? "still-noop" : retryValidated.error,
        });
        emitTelemetry({
          outcome: "no-op-after-retry",
          scope: body.scope,
          modelRequested: model,
          modelUsed,
          status: 422,
          latencyMs: Date.now() - requestStart,
          targetHtmlLen: body.targetHtml.length,
          responseHtmlLen: validated.value.html.length,
          fellBack: modelUsed !== model,
          noOpRetried: true,
          reason: retryValidated.ok ? "still-noop" : retryValidated.error,
        });
        return fail(
          "Model returned no change — try rephrasing the prompt with a more specific request",
          422,
        );
      }
    } else {
      emitTelemetry({
        outcome: "no-op-after-retry",
        scope: body.scope,
        modelRequested: model,
        modelUsed,
        status: 422,
        latencyMs: Date.now() - requestStart,
        targetHtmlLen: body.targetHtml.length,
        responseHtmlLen: validated.value.html.length,
        fellBack: modelUsed !== model,
        noOpRetried: true,
        reason: `retry-tensorix-error: ${retryAttempt.error.slice(0, 100)}`,
      });
      return fail(
        "Model returned no change — try rephrasing the prompt with a more specific request",
        422,
      );
    }
  }

  // Phase 6 — Reference-clone detection (swap mode only). If the output
  // is ~identical to the reference, the model regurgitated REFERENCE
  // verbatim and lost TARGET's content. Mirror of the no-op check, with
  // a slightly looser 0.95 threshold since reference + target's content
  // slotted in won't be byte-identical to reference. Retry once with a
  // sharper "you ignored TARGET's content" suffix.
  if (
    body.mode === "swap" &&
    body.referenceHtml &&
    isNoOp(validated.value.html, body.referenceHtml)
  ) {
    console.warn("[ai-edit] reference-clone — retrying with target-emphasis", {
      model: modelUsed,
      htmlLen: validated.value.html.length,
    });
    const retryUserMessage =
      userMessage +
      "\n\nYour previous response was nearly identical to <dropin_reference>. You ignored TARGET's content. You MUST keep TARGET's actual text, images, and links while adopting REFERENCE's visual design. Slot TARGET's content INTO REFERENCE's structure — don't return REFERENCE unchanged.";
    const retryAttempt = await callTensorix(
      apiKey,
      baseUrl,
      modelUsed,
      systemPrompt,
      retryUserMessage,
      maxTokens,
    );
    if (retryAttempt.ok) {
      const retryValidated = validateAiResponse(
        retryAttempt.text,
        body.targetHtml,
        body.scope,
        body.mode,
        body.referenceHtml,
      );
      if (
        retryValidated.ok &&
        !isNoOp(retryValidated.value.html, body.referenceHtml)
      ) {
        validated = retryValidated;
        attempt = retryAttempt;
      } else {
        emitTelemetry({
          outcome: "no-op-after-retry",
          scope: body.scope,
          modelRequested: model,
          modelUsed,
          status: 422,
          latencyMs: Date.now() - requestStart,
          targetHtmlLen: body.targetHtml.length,
          responseHtmlLen: validated.value.html.length,
          fellBack: modelUsed !== model,
          noOpRetried: true,
          reason: "still-reference-clone",
        });
        return fail(
          "Model regurgitated the reference — try a different reference or add a refinement prompt",
          422,
        );
      }
    } else {
      return fail(
        "Model regurgitated the reference — try a different reference or add a refinement prompt",
        422,
      );
    }
  }

  console.log("[ai-edit] success", {
    model: modelUsed,
    scope: body.scope,
    htmlLen: validated.value.html.length,
    promptTokens: attempt.usage?.prompt_tokens ?? null,
    completionTokens: attempt.usage?.completion_tokens ?? null,
  });
  // 2026-05-20 — Full content dump. Browser console collapses Objects;
  // this lets us see exactly what the model returned without expanding.
  // Counts same-class root duplicates in both input + output so we can
  // diagnose whether source pollution from prior bad edits is the
  // cause when the nested-duplicate detector doesn't fire.
  const dupSig = (() => {
    const m = body.targetHtml.match(
      /^<[a-zA-Z][\w-]*\b[^>]*\bclass="([^"]*)"/,
    );
    if (!m) return null;
    const cls = m[1].split(/\s+/).filter(Boolean);
    return cls.find((c) => c.length >= 4) ?? null;
  })();
  function countSig(html: string, sig: string): number {
    const esc = sig.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `<[a-zA-Z][\\w-]*\\b[^>]*\\bclass="[^"]*\\b${esc}\\b[^"]*"`,
      "g",
    );
    let n = 0;
    while (re.exec(html) !== null) n++;
    return n;
  }
  console.log("[ai-edit] FULL-TARGET ", body.targetHtml);
  console.log("[ai-edit] FULL-OUTPUT ", validated.value.html);
  if (dupSig) {
    console.log("[ai-edit] dup-check", {
      sig: dupSig,
      targetCount: countSig(body.targetHtml, dupSig),
      outputCount: countSig(validated.value.html, dupSig),
    });
  }
  emitTelemetry({
    outcome: "success",
    scope: body.scope,
    modelRequested: model,
    modelUsed,
    status: 200,
    latencyMs: Date.now() - requestStart,
    targetHtmlLen: body.targetHtml.length,
    responseHtmlLen: validated.value.html.length,
    promptTokens: attempt.usage?.prompt_tokens ?? undefined,
    completionTokens: attempt.usage?.completion_tokens ?? undefined,
    fellBack: modelUsed !== model,
  });

  const usage = attempt.usage
    ? {
        prompt: attempt.usage.prompt_tokens ?? 0,
        completion: attempt.usage.completion_tokens ?? 0,
        total: attempt.usage.total_tokens ?? 0,
      }
    : undefined;

  const okPayload: ApiResponse = {
    ok: true,
    html: validated.value.html,
    notes: validated.value.notes,
    model: modelUsed,
    usage,
  };
  return NextResponse.json<ApiResponse>(okPayload);
}
