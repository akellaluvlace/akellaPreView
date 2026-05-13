// Phase 5 / A5.1 — BYO-key LLM rewrite relay.
// Phase 5 §5 backlog (b) — streaming variant added.
//
// The user supplies their own OpenAI or Anthropic API key (persisted in their
// browser's localStorage; never on our server); we relay the request to the
// provider's HTTP API directly via `fetch`, no SDK pin. The user's key lives
// in the request body for the duration of one request only — never logged,
// never persisted, never echoed back. Errors are sanitised so a stack trace
// can't leak a key fragment.
//
// Two response modes:
//   • `stream: false` (default) — JSON request/response. The legacy path,
//     kept for back-compat with any external caller. Returns
//     `{ ok: true, classes: [...] }` or `{ ok: false, error: "..." }`.
//   • `stream: true` — text/event-stream. Forwards the provider's own
//     SSE stream and re-emits a normalized envelope:
//        data: {"type":"chunk","text":"..."}
//        data: {"type":"complete","classes":[...]}
//        data: {"type":"error","error":"..."}
//     The envelope shape + parser live in `lib/sse.ts` so the client side
//     in `components/FocusEditor.tsx` AIRewriteSection can consume it
//     with the same primitives.

import { NextResponse } from "next/server";
import {
  encodeServerFrame,
  extractAnthropicDelta,
  extractOpenAIDelta,
  parseSseFrame,
  splitSseFrames,
  type ProviderDelta,
  type SseEvent,
} from "@/lib/sse";
// Audit F1 — replace the unsafe `(await req.json()) as RewriteRequest`
// cast with a parse-don't-validate function. The validator + the
// `RewriteRequest` shape now live in `lib/llm-rewrite-parser.ts` so
// they're testable via prod-import.
import {
  parseRewriteRequest,
  type RewriteRequest,
  type RewriteProvider as Provider,
} from "@/lib/llm-rewrite-parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RewriteResponse =
  | { ok: true; classes: string[]; explanation?: string }
  | { ok: false; error: string };

// In-memory IP→bucket rate limit. 5 requests per 60s per IP. Single-process
// only — fine for the dev / single-region deploy this app targets. If we
// ever add edge regions, swap this for a KV-backed counter.
// Audit MED (Domain 2) — rate-limit logic extracted to
// `lib/rate-limit.ts` so it's testable + the bucket-growth fix lives
// in a pure-logic module. Default-singleton instance for the route;
// tests use `createRateLimiter` directly.
import { defaultRateLimiter } from "@/lib/rate-limit";

function rateLimitOk(ip: string): boolean {
  return defaultRateLimiter.allow(ip, Date.now());
}

function readClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

const SYSTEM_PROMPT = `You are a Tailwind CSS class rewriting assistant. Given the user's element source, current Tailwind classes, and a freeform prompt, return ONLY a JSON object with \`classes\` (string[]) — the new full class list to apply. No prose, no markdown fences.

Constraints:
- Use ONLY Tailwind 3.4 utility classes.
- Preserve layout-critical classes (display, flex/grid alignment, gap, width, height, position) unless the prompt explicitly asks to change them.
- Match the surrounding template's palette family if the prompt doesn't specify a different one.
- Prefer arbitrary-value classes (\`bg-[#hex]\`) only when palette tokens can't express it.`;

function buildUserPrompt(req: RewriteRequest): string {
  return [
    `User intent: ${req.prompt.trim() || "(no instruction — return classes unchanged)"}`,
    "",
    "Current classes:",
    req.classes.length ? req.classes.join(" ") : "(none)",
    "",
    "Element source:",
    req.elementSource,
  ].join("\n");
}

// Audit F9 — Discriminated union over `ok`. Pre-fix this was
// `{ ok: boolean; status: number; text?: string; error?: string }` —
// the implicit invariant "ok: true implies text defined; ok: false
// implies status set" was carried by convention and lost compile-time
// signal. After: tsc knows that the success arm has `text`, the
// failure arm has `status` + `error?`. A future edit that reaches into
// `result.text` without narrowing on `ok` first will fail.
type ProviderResult =
  | { ok: true; text: string }
  | { ok: false; status: number; error?: "network" };

function defaultModel(provider: Provider): string {
  return provider === "openai" ? "gpt-4o-mini" : "claude-haiku-4-5-20251001";
}

function buildOpenAIBody(req: RewriteRequest, stream: boolean): string {
  return JSON.stringify({
    model: req.model || defaultModel("openai"),
    response_format: stream ? undefined : { type: "json_object" },
    stream,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(req) },
    ],
  });
}

function buildAnthropicBody(req: RewriteRequest, stream: boolean): string {
  return JSON.stringify({
    model: req.model || defaultModel("anthropic"),
    max_tokens: 1024,
    stream,
    system:
      SYSTEM_PROMPT +
      "\n\nReturn the JSON object directly — your entire response must be valid JSON with no surrounding prose or fences.",
    messages: [{ role: "user", content: buildUserPrompt(req) }],
  });
}

async function callOpenAI(req: RewriteRequest): Promise<ProviderResult> {
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.apiKey}`,
      },
      body: buildOpenAIBody(req, false),
    });
    if (!r.ok) return { ok: false, status: r.status };
    const json = (await r.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content || "";
    return { ok: true, text };
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
}

async function callAnthropic(req: RewriteRequest): Promise<ProviderResult> {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": req.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: buildAnthropicBody(req, false),
    });
    if (!r.ok) return { ok: false, status: r.status };
    const json = (await r.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const text =
      json.content?.find((b) => b.type === "text")?.text ||
      json.content?.[0]?.text ||
      "";
    return { ok: true, text };
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
}

function parseModelOutput(text: string): string[] | null {
  if (!text) return null;
  let cleaned = text.trim();
  // Strip occasional markdown fences even though we asked for raw JSON.
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }
  if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { classes?: unknown }).classes) &&
    (parsed as { classes: unknown[] }).classes.every(
      (c) => typeof c === "string",
    )
  ) {
    return (parsed as { classes: string[] }).classes
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return null;
}

function bad(error: string, status = 400): NextResponse<RewriteResponse> {
  return NextResponse.json({ ok: false, error }, { status });
}

// ---- streaming variant ----------------------------------------------------

const STREAM_HEADERS: HeadersInit = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  // Hint to upstream proxies (incl. Vercel) not to buffer SSE bodies.
  "X-Accel-Buffering": "no",
  Connection: "keep-alive",
};

function streamErrorResponse(error: string, status: number): Response {
  // Status code remains the actual error (401 / 429 / 502) so failures
  // surface in DevTools, but we still emit a single SSE error frame so a
  // client that already started reading body chunks gets a structured
  // payload instead of a JSON-shaped corpse.
  const body = encodeServerFrame({ type: "error", error });
  return new Response(body, {
    status,
    headers: STREAM_HEADERS,
  });
}

async function fetchOpenAIStream(
  req: RewriteRequest,
  signal: AbortSignal,
): Promise<Response> {
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.apiKey}`,
    },
    body: buildOpenAIBody(req, true),
    signal,
  });
}

async function fetchAnthropicStream(
  req: RewriteRequest,
  signal: AbortSignal,
): Promise<Response> {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": req.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: buildAnthropicBody(req, true),
    signal,
  });
}

async function streamProvider(
  req: RewriteRequest,
  fetchProvider: (signal: AbortSignal) => Promise<Response>,
  decodeFrame: (evt: SseEvent) => ProviderDelta,
): Promise<Response> {
  // AbortController scoped to the upstream provider request. Without this,
  // a client disconnect (Stop button, unmount, route nav) leaves the
  // upstream OpenAI/Anthropic connection open and still billing tokens
  // until the provider finishes the response — minutes, potentially. The
  // ReadableStream's cancel() callback below propagates the disconnect
  // upstream so the provider stops generating.
  const upstreamAc = new AbortController();
  let providerRes: Response;
  try {
    providerRes = await fetchProvider(upstreamAc.signal);
  } catch {
    return streamErrorResponse("Provider unreachable", 502);
  }
  if (!providerRes.ok) {
    if (providerRes.status === 401) {
      return streamErrorResponse("Invalid API key", 401);
    }
    if (providerRes.status === 429) {
      return streamErrorResponse("Rate limited by provider", 429);
    }
    return streamErrorResponse(`Provider returned ${providerRes.status}`, 502);
  }
  const providerBody = providerRes.body;
  if (!providerBody) {
    return streamErrorResponse("Provider returned empty body", 502);
  }

  const out = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const reader = providerBody.getReader();
      let buffer = "";
      let fullText = "";
      let terminalEmitted = false;

      function emit(payload: Parameters<typeof encodeServerFrame>[0]): void {
        controller.enqueue(encoder.encode(encodeServerFrame(payload)));
      }

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const split = splitSseFrames(buffer);
          buffer = split.remaining;
          for (const raw of split.frames) {
            const evt = parseSseFrame(raw);
            if (!evt) continue;
            const delta = decodeFrame(evt);
            if (delta.text) {
              fullText += delta.text;
              emit({ type: "chunk", text: delta.text });
            }
            // delta.done is informational — keep reading until provider
            // closes the body. Some providers send extra frames after
            // the terminal marker (notably OpenAI's `[DONE]` arrives
            // after `finish_reason: stop`).
          }
        }
        // Drain any trailing buffer that didn't end with a boundary —
        // shouldn't happen on a well-behaved provider, but defensive.
        const tail = decoder.decode();
        if (tail) buffer += tail;
        if (buffer.length > 0) {
          const trail = parseSseFrame(buffer);
          if (trail) {
            const delta = decodeFrame(trail);
            if (delta.text) {
              fullText += delta.text;
              emit({ type: "chunk", text: delta.text });
            }
          }
        }

        const classes = parseModelOutput(fullText);
        if (classes) {
          emit({ type: "complete", classes });
        } else {
          emit({
            type: "error",
            error: "Provider returned non-JSON output",
          });
        }
        terminalEmitted = true;
      } catch (e) {
        // Distinguish client-disconnect (upstream signal aborted by our
        // cancel() callback) from genuine stream errors. Without this
        // log, the dominant failure mode (client navigates / clicks Stop)
        // produces no server-side trace at all, and a real upstream
        // failure (provider drop, malformed UTF-8, reader corruption)
        // is silently swallowed too.
        const aborted = upstreamAc.signal.aborted;
        if (!aborted) {
          console.error("[llm-rewrite] stream interrupted", {
            reason: "upstream-or-reader-error",
            err: String(e),
          });
        }
        if (!terminalEmitted) {
          emit({ type: "error", error: "Stream interrupted" });
        }
      } finally {
        try {
          reader.releaseLock();
        } catch {
          // releaseLock can throw if the reader is in an active state — fine.
        }
        controller.close();
      }
    },

    cancel() {
      // Client disconnected (Stop button, navigation, unmount). Propagate
      // the disconnect to the upstream provider fetch so generation +
      // billing stops immediately. Without this, OpenAI/Anthropic keep
      // generating the full response server-side regardless of whether we
      // read it.
      try {
        upstreamAc.abort();
      } catch {
        // abort() doesn't throw per spec, but defensive — finally block
        // in start() may have raced to here.
      }
    },
  });

  return new Response(out, {
    status: 200,
    headers: STREAM_HEADERS,
  });
}

// ---- POST handler ---------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  // Audit F1 — Parse, don't cast. `parseRewriteRequest` returns a typed
  // `RewriteRequest` only when every field is valid; the route handler
  // narrows on `parsed.ok` and never sees an under-typed value.
  //
  // Audit Domain 2 MED — body parsing happens BEFORE the rate-limit
  // check so we know whether the caller asked for streaming. Without
  // this, the 429 would always emit `text/event-stream`, breaking the
  // contract for `stream: false` JSON callers (their parser sees
  // "data: {...}" instead of structured JSON).
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return bad("Invalid JSON body", 400);
  }
  const parsed = parseRewriteRequest(raw);
  if (!parsed.ok) {
    return bad(parsed.error);
  }
  const body: RewriteRequest = parsed.value;

  const ip = readClientIp(req);
  if (!rateLimitOk(ip)) {
    // Match the response Content-Type to the caller's expected mode.
    // Streaming clients get an SSE error frame so their existing parser
    // path consumes it uniformly; JSON clients get the standard
    // `{ ok: false, error }` envelope.
    if (body.stream === true) {
      return streamErrorResponse("Rate limited locally (5 / minute)", 429);
    }
    return bad("Rate limited locally (5 / minute)", 429);
  }

  if (body.stream === true) {
    if (body.provider === "openai") {
      return streamProvider(
        body,
        (signal) => fetchOpenAIStream(body, signal),
        extractOpenAIDelta,
      );
    }
    return streamProvider(
      body,
      (signal) => fetchAnthropicStream(body, signal),
      extractAnthropicDelta,
    );
  }

  // Non-streaming legacy path — request/response JSON.
  const result =
    body.provider === "openai" ? await callOpenAI(body) : await callAnthropic(body);

  if (!result.ok) {
    if (result.error === "network") return bad("Provider unreachable", 502);
    if (result.status === 401) return bad("Invalid API key", 401);
    if (result.status === 429) return bad("Rate limited by provider", 429);
    return bad(`Provider returned ${result.status}`, 502);
  }

  // Audit F9 — narrowed via the discriminated union. tsc now knows
  // `result.text` is `string` here (not `string | undefined`).
  const classes = parseModelOutput(result.text);
  if (!classes) return bad("Provider returned non-JSON output", 502);
  // Audit F2 — typed success envelope. `bad()` already returns
  // `NextResponse<RewriteResponse>`; this branch was previously the
  // only success-path return that lost the type because
  // `NextResponse.json` defaults to `NextResponse<unknown>`. Spelling
  // the type out forces tsc to verify the shape matches the
  // discriminated union; a future edit that drops `ok: true` or
  // mistypes `classes` will fail to compile.
  const okPayload: RewriteResponse = { ok: true, classes };
  return NextResponse.json<RewriteResponse>(okPayload);
}
