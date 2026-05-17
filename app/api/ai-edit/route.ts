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
import { validateAiResponse } from "@/lib/ai-edit/validate-response";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stricter limiter than llm-rewrite (which is 5/min per IP). AI Edit is
// more expensive per call; cap at 30/min/IP. Plan §6.3 specifies
// 60/hour free-tier — short-window throttle prevents burst spam, the
// hourly cap is a separate concern (not in v1).
const limiter = createRateLimiter({ limit: 30, windowMs: 60_000 });

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

interface TensorixChoice {
  message?: { content?: string };
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

async function callTensorix(
  apiKey: string,
  baseUrl: string,
  model: string,
  userMessage: string,
  maxTokens: number,
): Promise<
  | { ok: true; text: string; usage?: TensorixUsage }
  | { ok: false; status: number; error: string }
> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: AI_EDIT_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: maxTokens,
        stream: false,
      }),
    });
  } catch (e) {
    return { ok: false, status: 0, error: `Network: ${String(e)}` };
  }
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
  const text = json.choices?.[0]?.message?.content ?? "";
  if (!text) {
    return {
      ok: false,
      status: 502,
      error: "Tensorix response had no content",
    };
  }
  return { ok: true, text, usage: json.usage };
}

export async function POST(req: Request): Promise<Response> {
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
    return fail("Server is not configured for AI Edit", 500);
  }

  const ip = readClientIp(req);
  if (!limiter.allow(ip, Date.now())) {
    return fail("Rate limited (30 / minute)", 429);
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }

  const parsed = parseAiEditRequest(raw);
  if (!parsed.ok) return fail(parsed.error, 400);
  const body = parsed.value;

  const defaultModel =
    body.scope === "section" ? sectionDefault : elementDefault;
  const model = body.model ?? defaultModel;
  // Plan §4.3 max_tokens: 1500 element, 6000 section. Bump section to
  // 16000 — many real hero/feature sections in the template library
  // serialize at 4-8k chars input, and the model needs comparable
  // output budget plus reasoning overhead. minimax-m2 supports 197k
  // context; we're nowhere near a hard limit.
  const maxTokens = body.scope === "section" ? 16000 : 2000;
  const userMessage = buildUserMessage(body);
  // Diagnostic: log the request shape (sizes only — never the full
  // body or HTML, to keep terminal output readable and avoid leaking
  // template-source if user shares a screenshot).
  console.log("[ai-edit] request", {
    scope: body.scope,
    model,
    targetHtmlLen: body.targetHtml.length,
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
      userMessage,
      maxTokens,
    );
    modelUsed = fallbackModel;
  }

  if (!attempt.ok) {
    console.error("[ai-edit] tensorix non-ok", {
      model: modelUsed,
      status: attempt.status,
      error: attempt.error.slice(0, 300),
    });
    return fail(attempt.error, attempt.status >= 400 ? attempt.status : 502);
  }

  let validated = validateAiResponse(attempt.text, body.targetHtml, body.scope);
  if (!validated.ok) {
    console.error("[ai-edit] validation failed", {
      model: modelUsed,
      scope: body.scope,
      reason: validated.error,
      rawTextLen: attempt.text.length,
      rawTextStart: attempt.text.slice(0, 200),
      rawTextEnd: attempt.text.slice(-200),
    });
    return fail(validated.error, 502);
  }

  // No-op detection. If the model returned essentially the input back
  // (>= 98% character similarity), the swap will be invisible to the
  // user — exactly what just happened in manual testing. Retry once
  // with an emphatic suffix that demands a real change.
  const isNoOp = (a: string, b: string): boolean => {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > Math.max(a.length, b.length) * 0.05) {
      return false;
    }
    // Trigram overlap — robust to whitespace/attr-order shuffles
    // without computing edit distance on 10k-char inputs.
    function trigrams(s: string): Set<string> {
      const norm = s.replace(/\s+/g, " ").trim();
      const out = new Set<string>();
      for (let i = 0; i <= norm.length - 3; i++) out.add(norm.slice(i, i + 3));
      return out;
    }
    const A = trigrams(a);
    const B = trigrams(b);
    let inter = 0;
    for (const t of A) if (B.has(t)) inter++;
    const union = A.size + B.size - inter;
    if (union === 0) return false;
    return inter / union >= 0.98;
  };

  if (isNoOp(validated.value.html, body.targetHtml)) {
    console.warn("[ai-edit] no-op response — retrying with emphatic suffix", {
      model: modelUsed,
      htmlLen: validated.value.html.length,
    });
    const retryUserMessage =
      userMessage +
      "\n\nYour previous response returned HTML that is nearly identical to the input. The user explicitly asked for a change. Apply a real, visible modification this time. Output JSON only.";
    const retryAttempt = await callTensorix(
      apiKey,
      baseUrl,
      modelUsed,
      retryUserMessage,
      maxTokens,
    );
    if (retryAttempt.ok) {
      const retryValidated = validateAiResponse(
        retryAttempt.text,
        body.targetHtml,
        body.scope,
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
        return fail(
          "Model returned no change — try rephrasing the prompt with a more specific request",
          422,
        );
      }
    } else {
      return fail(
        "Model returned no change — try rephrasing the prompt with a more specific request",
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
