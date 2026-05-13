// Phase 5 §5 backlog (b) — Server-Sent Events helpers shared between the
// streaming `/api/llm-rewrite` route and the client-side AIRewriteSection
// consumer.
//
// The module is intentionally pure: no DOM, no Node-only APIs, no fetch.
// Anything that touches a stream lives in the caller; this file only
// concerns itself with the byte-shape of SSE frames + the JSON-shape of
// per-provider deltas. That makes it bench-able with no harness — see
// `scripts/bench-sse.mjs` (mirror of the algorithms inlined for the
// build-free bench tradition; keep in sync if any algorithm here moves).
//
// Wire format reminders:
//   • Frames are separated by a blank line: a `\n\n` (or `\r\n\r\n`) byte
//     boundary. Within a frame, fields are colon-prefixed lines. The two
//     fields we care about are `event:` and `data:` — `id:` and `retry:`
//     are skipped, comment lines starting with `:` are skipped.
//   • OpenAI streams use ONE event type (data-only) terminated by a
//     `data: [DONE]` sentinel.
//   • Anthropic streams use TYPED events (`event: content_block_delta`
//     etc.) and terminate on `event: message_stop`. They additionally
//     emit `event: ping` keep-alives that carry no text.
//
// Server emits its own normalized envelope downstream so the UI never has
// to know which provider it came from:
//   data: {"type":"chunk","text":"..."}            ← incremental output
//   data: {"type":"complete","classes":["..."]}    ← terminal success
//   data: {"type":"error","error":"..."}            ← terminal failure

export interface SseEvent {
  /** SSE `event:` field, or undefined when the frame omitted one. */
  event?: string;
  /** Joined `data:` field bytes. May be empty. */
  data: string;
}

/**
 * Drain complete SSE frames from a buffer. Returns the parsed frame text
 * (without the terminating blank line) plus whatever bytes remain at the
 * tail, which the caller is expected to prepend to the next chunk before
 * calling again.
 *
 * Accepts both `\n\n` and `\r\n\r\n` boundaries (some proxies / fetch
 * implementations normalize, others don't).
 */
export function splitSseFrames(buffer: string): {
  frames: string[];
  remaining: string;
} {
  const frames: string[] = [];
  let rest = buffer;
  while (true) {
    let boundary = rest.indexOf("\n\n");
    let boundaryLen = 2;
    const crBoundary = rest.indexOf("\r\n\r\n");
    if (crBoundary !== -1 && (boundary === -1 || crBoundary < boundary)) {
      boundary = crBoundary;
      boundaryLen = 4;
    }
    if (boundary === -1) break;
    frames.push(rest.slice(0, boundary));
    rest = rest.slice(boundary + boundaryLen);
  }
  return { frames, remaining: rest };
}

/**
 * Parse one SSE frame (newline-joined `field: value` lines) into the
 * shape we care about. Returns null when the frame had no `data:` line
 * at all — that filters out keep-alive comments and stray `event:`-only
 * frames the caller doesn't need to act on.
 */
export function parseSseFrame(frame: string): SseEvent | null {
  if (!frame) return null;
  const lines = frame.split(/\r?\n/);
  let event: string | undefined;
  const dataParts: string[] = [];
  let sawData = false;
  for (const line of lines) {
    if (!line || line.startsWith(":")) continue;
    if (line.startsWith("data:")) {
      sawData = true;
      const v = line.slice(5);
      dataParts.push(v.startsWith(" ") ? v.slice(1) : v);
    } else if (line.startsWith("event:")) {
      const v = line.slice(6);
      event = v.startsWith(" ") ? v.slice(1) : v;
    }
    // id: / retry: / unknown fields silently skipped per SSE spec
  }
  if (!sawData) return null;
  return { event, data: dataParts.join("\n") };
}

/** Per-provider per-frame delta: incremental text + a "stream is over" hint. */
export interface ProviderDelta {
  text: string;
  done: boolean;
}

/**
 * OpenAI chat-completions stream: data-only frames carrying JSON with
 * `choices[0].delta.content`. The string `[DONE]` marks termination.
 * Malformed JSON returns an empty delta rather than throwing — providers
 * occasionally inject blank frames or comment lines that look like data.
 */
export function extractOpenAIDelta(evt: SseEvent): ProviderDelta {
  const trimmed = evt.data.trim();
  if (trimmed === "" || trimmed === "[DONE]") {
    return { text: "", done: trimmed === "[DONE]" };
  }
  let j: unknown;
  try {
    j = JSON.parse(evt.data);
  } catch {
    return { text: "", done: false };
  }
  if (!j || typeof j !== "object") return { text: "", done: false };
  const choice = (j as { choices?: Array<unknown> }).choices?.[0];
  if (!choice || typeof choice !== "object") return { text: "", done: false };
  const c = choice as {
    delta?: { content?: unknown };
    finish_reason?: unknown;
  };
  const text = typeof c.delta?.content === "string" ? c.delta.content : "";
  const done = c.finish_reason != null;
  return { text, done };
}

/**
 * Anthropic messages stream: typed events. Only `content_block_delta`
 * with a `text_delta` body carries text; `message_stop` signals the
 * terminal end. `ping`, `message_start`, `content_block_start`,
 * `content_block_stop`, `message_delta` all return zeros.
 */
export function extractAnthropicDelta(evt: SseEvent): ProviderDelta {
  if (evt.event === "message_stop") return { text: "", done: true };
  if (evt.event !== "content_block_delta") return { text: "", done: false };
  let j: unknown;
  try {
    j = JSON.parse(evt.data);
  } catch {
    return { text: "", done: false };
  }
  if (!j || typeof j !== "object") return { text: "", done: false };
  const delta = (j as { delta?: unknown }).delta;
  if (!delta || typeof delta !== "object") return { text: "", done: false };
  const d = delta as { type?: unknown; text?: unknown };
  if (d.type !== "text_delta" || typeof d.text !== "string") {
    return { text: "", done: false };
  }
  return { text: d.text, done: false };
}

// ---- Server-emitted envelope (route → client) -----------------------------

export type ServerStreamPayload =
  | { type: "chunk"; text: string }
  | { type: "complete"; classes: string[] }
  | { type: "error"; error: string };

/**
 * Encode one envelope event for the route's downstream stream. Always
 * emits a single `data:` line + the SSE frame terminator so the client
 * can split + parse with the same primitives above.
 */
export function encodeServerFrame(payload: ServerStreamPayload): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

/**
 * Result of parsing one server-emitted envelope.
 *
 * Audit 2026-05-06 Domain 4 MED — `parseServerStreamPayload` used to
 * collapse FOUR distinct failure modes into a single `null` return (JSON
 * parse fails / root not object / unknown envelope `type` / shape
 * mismatch within a known type). The consumer collapsed all four into
 * "ignore and read more" — same drift-hiding pattern that masked the
 * iframe `relativeImports` cascade until it was traced back. This
 * discriminated union splits the four into two intents:
 *
 *   • `kind: "skip"` — the envelope's `type` is one we don't handle.
 *     The legitimate forward-compat path: a future server might emit a
 *     new variant ("warning", "progress", …) and the existing client
 *     should silently ignore it. Routine, no log.
 *   • `kind: "malformed"` — JSON parse fail, root not object, OR a
 *     known type with the wrong inner shape. Worth a `console.warn`
 *     because it indicates either a server bug, a contract drift, or a
 *     hostile/corrupted byte stream.
 *
 * Caller is expected to switch on `kind` and act accordingly.
 */
export type ServerStreamPayloadResult =
  | { kind: "ok"; value: ServerStreamPayload }
  | { kind: "skip" }
  | { kind: "malformed"; reason: string };

/**
 * Parse the JSON payload out of a server-emitted frame's `data` field.
 * Returns a discriminated result so the caller can distinguish silent
 * forward-compat skips (`kind: "skip"`) from genuine shape errors
 * (`kind: "malformed"`); the latter typically warrants a log line.
 *
 * Never throws.
 */
export function parseServerStreamPayload(
  data: string,
): ServerStreamPayloadResult {
  let j: unknown;
  try {
    j = JSON.parse(data);
  } catch {
    return { kind: "malformed", reason: "json-parse-failed" };
  }
  if (!j || typeof j !== "object") {
    return { kind: "malformed", reason: "root-not-object" };
  }
  const t = (j as { type?: unknown }).type;
  if (t === "chunk") {
    const text = (j as { text?: unknown }).text;
    if (typeof text === "string") {
      return { kind: "ok", value: { type: "chunk", text } };
    }
    return { kind: "malformed", reason: "chunk-text-not-string" };
  }
  if (t === "complete") {
    const cs = (j as { classes?: unknown }).classes;
    if (
      Array.isArray(cs) &&
      cs.every((c: unknown): c is string => typeof c === "string")
    ) {
      return { kind: "ok", value: { type: "complete", classes: cs } };
    }
    return { kind: "malformed", reason: "complete-classes-not-string-array" };
  }
  if (t === "error") {
    const err = (j as { error?: unknown }).error;
    if (typeof err === "string") {
      return { kind: "ok", value: { type: "error", error: err } };
    }
    return { kind: "malformed", reason: "error-error-not-string" };
  }
  // Unknown / missing `type` — treat as forward-compat skip rather than
  // malformed. A server that adds a new envelope variant
  // (`{type:"warning",...}`) shouldn't trigger a warn on every existing
  // client; it should be silently ignored.
  return { kind: "skip" };
}
