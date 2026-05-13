// 8th prod-import surge — direct-import tests for `lib/sse.ts`.
// Currently `tests/sse.test.ts` only routes to `runBench("bench-sse")`,
// which inlines an algorithm mirror per the build-free bench tradition
// (line 9 of `lib/sse.ts`: "keep in sync if any algorithm here moves").
// That mirror is the highest-priority drift risk in the surge backlog
// since both the route and the client consume these primitives. Direct
// imports here catch any divergence between bench mirror and lib.

import { describe, it, expect } from "vitest";
import {
  splitSseFrames,
  parseSseFrame,
  extractOpenAIDelta,
  extractAnthropicDelta,
  encodeServerFrame,
  parseServerStreamPayload,
} from "../lib/sse";

describe("§1 splitSseFrames — frame boundary detection", () => {
  it("returns no frames + entire buffer remaining when no boundary present", () => {
    const r = splitSseFrames("data: hello");
    expect(r.frames).toEqual([]);
    expect(r.remaining).toBe("data: hello");
  });

  it("splits single complete frame on '\\n\\n' boundary", () => {
    const r = splitSseFrames("data: hello\n\n");
    expect(r.frames).toEqual(["data: hello"]);
    expect(r.remaining).toBe("");
  });

  it("splits multiple frames in one buffer", () => {
    const r = splitSseFrames("data: a\n\ndata: b\n\ndata: c\n\n");
    expect(r.frames).toEqual(["data: a", "data: b", "data: c"]);
    expect(r.remaining).toBe("");
  });

  it("retains trailing partial frame in remaining (no terminator yet)", () => {
    const r = splitSseFrames("data: a\n\ndata: partial");
    expect(r.frames).toEqual(["data: a"]);
    expect(r.remaining).toBe("data: partial");
  });

  it("accepts CRLF '\\r\\n\\r\\n' boundary", () => {
    const r = splitSseFrames("data: a\r\n\r\ndata: b");
    expect(r.frames).toEqual(["data: a"]);
    expect(r.remaining).toBe("data: b");
  });

  it("picks the EARLIER boundary when both LF and CRLF present", () => {
    // First frame ends with \n\n at pos 7; second with \r\n\r\n
    const buf = "data: a\n\ndata: b\r\n\r\ndata: c";
    const r = splitSseFrames(buf);
    expect(r.frames).toEqual(["data: a", "data: b"]);
    expect(r.remaining).toBe("data: c");
  });

  it("empty buffer → no frames, empty remaining", () => {
    expect(splitSseFrames("")).toEqual({ frames: [], remaining: "" });
  });

  it("buffer with only the terminator yields one empty frame", () => {
    const r = splitSseFrames("\n\n");
    expect(r.frames).toEqual([""]);
    expect(r.remaining).toBe("");
  });

  it("multiline data field stays a single frame (only blank line is a boundary)", () => {
    const r = splitSseFrames("data: line1\ndata: line2\n\n");
    expect(r.frames.length).toBe(1);
    expect(r.frames[0]).toBe("data: line1\ndata: line2");
  });
});

describe("§2 parseSseFrame — field extraction", () => {
  it("returns the data field with leading-space stripped", () => {
    const r = parseSseFrame("data: hello");
    expect(r).toEqual({ event: undefined, data: "hello" });
  });

  it("returns null when there's no data: line at all", () => {
    expect(parseSseFrame("event: ping")).toBeNull();
  });

  it("returns null on empty input", () => {
    expect(parseSseFrame("")).toBeNull();
  });

  it("captures event field with leading-space stripped", () => {
    const r = parseSseFrame("event: content_block_delta\ndata: {}");
    expect(r).toEqual({ event: "content_block_delta", data: "{}" });
  });

  it("joins multi-line data with a single \\n", () => {
    const r = parseSseFrame("data: line1\ndata: line2\ndata: line3");
    expect(r!.data).toBe("line1\nline2\nline3");
  });

  it("preserves data WITHOUT leading space when caller emitted no space", () => {
    // 'data:hello' (no space) — slice(5) returns 'hello' since slice doesn't
    // start with a leading space.
    const r = parseSseFrame("data:hello");
    expect(r!.data).toBe("hello");
  });

  it("skips comment lines starting with ':' (SSE keep-alive)", () => {
    const r = parseSseFrame(": ping\ndata: real");
    expect(r!.data).toBe("real");
  });

  it("skips id: and retry: lines (per SSE spec)", () => {
    const r = parseSseFrame("id: 42\nretry: 1000\ndata: payload");
    expect(r!.data).toBe("payload");
  });

  it("preserves empty data field when 'data:' line present but value empty", () => {
    const r = parseSseFrame("data: ");
    expect(r).not.toBeNull();
    expect(r!.data).toBe("");
  });

  it("accepts CRLF-separated lines inside the frame", () => {
    const r = parseSseFrame("event: x\r\ndata: y");
    expect(r).toEqual({ event: "x", data: "y" });
  });
});

describe("§3 extractOpenAIDelta — chat-completions stream", () => {
  const evt = (data: string) => ({ event: undefined, data });

  it("extracts text from choices[0].delta.content", () => {
    const r = extractOpenAIDelta(
      evt('{"choices":[{"delta":{"content":"hello"}}]}'),
    );
    expect(r).toEqual({ text: "hello", done: false });
  });

  it("[DONE] sentinel → done=true, text=''", () => {
    expect(extractOpenAIDelta(evt("[DONE]"))).toEqual({
      text: "",
      done: true,
    });
  });

  it("empty data → text='', done=false (not [DONE])", () => {
    expect(extractOpenAIDelta(evt(""))).toEqual({ text: "", done: false });
  });

  it("malformed JSON → text='', done=false (no throw)", () => {
    expect(extractOpenAIDelta(evt("{not json"))).toEqual({
      text: "",
      done: false,
    });
  });

  it("missing choices array → text=''", () => {
    expect(extractOpenAIDelta(evt('{"foo":"bar"}'))).toEqual({
      text: "",
      done: false,
    });
  });

  it("choices[0] without delta.content → text=''", () => {
    expect(
      extractOpenAIDelta(evt('{"choices":[{"finish_reason":"stop"}]}')),
    ).toEqual({ text: "", done: true });
  });

  it("finish_reason set (non-null) → done=true even with empty text", () => {
    const r = extractOpenAIDelta(
      evt('{"choices":[{"delta":{},"finish_reason":"length"}]}'),
    );
    expect(r.done).toBe(true);
  });

  it("delta.content non-string type → text='' (defensive)", () => {
    const r = extractOpenAIDelta(
      evt('{"choices":[{"delta":{"content":42}}]}'),
    );
    expect(r.text).toBe("");
  });

  it("[DONE] with surrounding whitespace still works (trim semantics)", () => {
    expect(extractOpenAIDelta(evt("  [DONE]  "))).toEqual({
      text: "",
      done: true,
    });
  });
});

describe("§4 extractAnthropicDelta — typed events", () => {
  it("content_block_delta + text_delta type → emits text", () => {
    const r = extractAnthropicDelta({
      event: "content_block_delta",
      data: '{"delta":{"type":"text_delta","text":"hello"}}',
    });
    expect(r).toEqual({ text: "hello", done: false });
  });

  it("message_stop event → done=true, text=''", () => {
    expect(
      extractAnthropicDelta({ event: "message_stop", data: "" }),
    ).toEqual({ text: "", done: true });
  });

  it("ping keep-alive event → text='', done=false", () => {
    expect(
      extractAnthropicDelta({ event: "ping", data: '{"type":"ping"}' }),
    ).toEqual({ text: "", done: false });
  });

  it("message_start event → no text, no done", () => {
    expect(
      extractAnthropicDelta({ event: "message_start", data: "{}" }),
    ).toEqual({ text: "", done: false });
  });

  it("content_block_delta with non-text_delta type → no text", () => {
    const r = extractAnthropicDelta({
      event: "content_block_delta",
      data: '{"delta":{"type":"input_json_delta","partial_json":"{}"}}',
    });
    expect(r.text).toBe("");
  });

  it("malformed JSON → text='', done=false (no throw)", () => {
    const r = extractAnthropicDelta({
      event: "content_block_delta",
      data: "not json",
    });
    expect(r).toEqual({ text: "", done: false });
  });

  it("text_delta with non-string text → text='' (defensive)", () => {
    const r = extractAnthropicDelta({
      event: "content_block_delta",
      data: '{"delta":{"type":"text_delta","text":123}}',
    });
    expect(r.text).toBe("");
  });

  it("missing delta field → text=''", () => {
    const r = extractAnthropicDelta({
      event: "content_block_delta",
      data: "{}",
    });
    expect(r.text).toBe("");
  });
});

describe("§5 encodeServerFrame — envelope emission", () => {
  it("chunk type → 'data: {...}\\n\\n'", () => {
    const r = encodeServerFrame({ type: "chunk", text: "hello" });
    expect(r).toBe('data: {"type":"chunk","text":"hello"}\n\n');
  });

  it("complete type → 'data: {...}\\n\\n'", () => {
    const r = encodeServerFrame({
      type: "complete",
      classes: ["text-red-500", "p-4"],
    });
    expect(r).toBe(
      'data: {"type":"complete","classes":["text-red-500","p-4"]}\n\n',
    );
  });

  it("error type → 'data: {...}\\n\\n'", () => {
    const r = encodeServerFrame({ type: "error", error: "auth failed" });
    expect(r).toBe('data: {"type":"error","error":"auth failed"}\n\n');
  });

  it("output always ends with the SSE blank-line terminator", () => {
    expect(
      encodeServerFrame({ type: "chunk", text: "" }).endsWith("\n\n"),
    ).toBe(true);
  });

  it("escapes quotes in chunk text per JSON.stringify", () => {
    const r = encodeServerFrame({ type: "chunk", text: 'he said "hi"' });
    expect(r).toContain('he said \\"hi\\"');
  });
});

describe("§6 parseServerStreamPayload — round-trip with encodeServerFrame", () => {
  it("chunk round-trip preserves text", () => {
    const enc = encodeServerFrame({ type: "chunk", text: "hello" });
    // Strip the 'data: ' prefix and trailing '\n\n' to get the inner JSON.
    const data = enc.slice(6, -2);
    expect(parseServerStreamPayload(data)).toEqual({
      kind: "ok",
      value: { type: "chunk", text: "hello" },
    });
  });

  it("complete round-trip preserves classes", () => {
    const enc = encodeServerFrame({
      type: "complete",
      classes: ["a", "b", "c"],
    });
    const data = enc.slice(6, -2);
    expect(parseServerStreamPayload(data)).toEqual({
      kind: "ok",
      value: { type: "complete", classes: ["a", "b", "c"] },
    });
  });

  it("error round-trip preserves error string", () => {
    const enc = encodeServerFrame({ type: "error", error: "x" });
    const data = enc.slice(6, -2);
    expect(parseServerStreamPayload(data)).toEqual({
      kind: "ok",
      value: { type: "error", error: "x" },
    });
  });

  it("malformed JSON → kind:malformed json-parse-failed", () => {
    expect(parseServerStreamPayload("not json")).toEqual({
      kind: "malformed",
      reason: "json-parse-failed",
    });
  });

  it("unknown type field → kind:skip (forward-compat — silent ignore)", () => {
    // Audit Domain 4 MED — the discriminated union's whole point: a
    // future server emitting `{type:"warning",...}` should not be logged
    // as a contract violation, just silently dropped.
    expect(parseServerStreamPayload('{"type":"weird","x":1}')).toEqual({
      kind: "skip",
    });
  });

  it("chunk type with non-string text → kind:malformed", () => {
    expect(parseServerStreamPayload('{"type":"chunk","text":42}')).toEqual({
      kind: "malformed",
      reason: "chunk-text-not-string",
    });
  });

  it("complete type with non-array classes → kind:malformed", () => {
    expect(
      parseServerStreamPayload('{"type":"complete","classes":"oops"}'),
    ).toEqual({
      kind: "malformed",
      reason: "complete-classes-not-string-array",
    });
  });

  it("complete type with non-string array elements → kind:malformed", () => {
    expect(
      parseServerStreamPayload('{"type":"complete","classes":["ok",42]}'),
    ).toEqual({
      kind: "malformed",
      reason: "complete-classes-not-string-array",
    });
  });

  it("error type with non-string error → kind:malformed", () => {
    expect(parseServerStreamPayload('{"type":"error","error":42}')).toEqual({
      kind: "malformed",
      reason: "error-error-not-string",
    });
  });

  it("missing type field → kind:skip (no type === unknown variant)", () => {
    expect(parseServerStreamPayload('{"text":"x"}')).toEqual({ kind: "skip" });
  });

  it("non-object root JSON → kind:malformed root-not-object", () => {
    expect(parseServerStreamPayload('"just a string"')).toEqual({
      kind: "malformed",
      reason: "root-not-object",
    });
    expect(parseServerStreamPayload("null")).toEqual({
      kind: "malformed",
      reason: "root-not-object",
    });
    expect(parseServerStreamPayload("42")).toEqual({
      kind: "malformed",
      reason: "root-not-object",
    });
  });

  it("type field present but non-string (numeric/null/object) → kind:skip", () => {
    // `type` not matching any known string variant treated as
    // forward-compat skip; non-string `type` is the same intent class.
    expect(parseServerStreamPayload('{"type":42}')).toEqual({ kind: "skip" });
    expect(parseServerStreamPayload('{"type":null}')).toEqual({ kind: "skip" });
    expect(parseServerStreamPayload('{"type":{"x":1}}')).toEqual({
      kind: "skip",
    });
  });

  it("complete with empty classes array → kind:ok (legitimate empty result)", () => {
    expect(parseServerStreamPayload('{"type":"complete","classes":[]}')).toEqual({
      kind: "ok",
      value: { type: "complete", classes: [] },
    });
  });

  it("chunk with empty text → kind:ok (legitimate keep-alive flush)", () => {
    expect(parseServerStreamPayload('{"type":"chunk","text":""}')).toEqual({
      kind: "ok",
      value: { type: "chunk", text: "" },
    });
  });

  it("kind discriminator is exhaustive — only ok/skip/malformed", () => {
    // Canary: every kind in the union has a known shape. If a new kind
    // is added without updating consumers (FocusEditor SSE switch), tsc
    // already errs at the consumer; this test pins the lib-side surface.
    const cases: Array<{ data: string; expectedKind: "ok" | "skip" | "malformed" }> = [
      { data: '{"type":"chunk","text":"x"}', expectedKind: "ok" },
      { data: '{"type":"weird"}', expectedKind: "skip" },
      { data: "not json", expectedKind: "malformed" },
    ];
    for (const c of cases) {
      const r = parseServerStreamPayload(c.data);
      expect(r.kind).toBe(c.expectedKind);
    }
  });

  it("malformed reason strings stay stable (consumers may grep on them)", () => {
    // Canary: these reason strings appear in console.warn messages and
    // potentially in test fixtures. Pin them so a future refactor can't
    // silently rename them.
    const REASONS = new Set([
      "json-parse-failed",
      "root-not-object",
      "chunk-text-not-string",
      "complete-classes-not-string-array",
      "error-error-not-string",
    ]);
    const samples = [
      "not json",
      '"a"',
      '{"type":"chunk","text":1}',
      '{"type":"complete","classes":1}',
      '{"type":"error","error":1}',
    ];
    for (const s of samples) {
      const r = parseServerStreamPayload(s);
      expect(r.kind).toBe("malformed");
      if (r.kind === "malformed") {
        expect(REASONS.has(r.reason)).toBe(true);
      }
    }
  });
});

describe("§7 end-to-end pipeline (split → parse → extract)", () => {
  it("OpenAI: chunked stream split + parse + delta extract", () => {
    const stream =
      'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n' +
      'data: {"choices":[{"delta":{"content":"lo"}}]}\n\n' +
      "data: [DONE]\n\n";
    const { frames, remaining } = splitSseFrames(stream);
    expect(remaining).toBe("");
    expect(frames.length).toBe(3);
    const deltas = frames
      .map((f) => parseSseFrame(f))
      .filter((e) => e !== null)
      .map((e) => extractOpenAIDelta(e!));
    expect(deltas[0]).toEqual({ text: "Hel", done: false });
    expect(deltas[1]).toEqual({ text: "lo", done: false });
    expect(deltas[2]).toEqual({ text: "", done: true });
  });

  it("Anthropic: typed events end-to-end", () => {
    const stream =
      "event: message_start\ndata: {}\n\n" +
      'event: content_block_delta\ndata: {"delta":{"type":"text_delta","text":"Hi"}}\n\n' +
      "event: message_stop\ndata: {}\n\n";
    const { frames } = splitSseFrames(stream);
    const evts = frames
      .map((f) => parseSseFrame(f))
      .filter((e) => e !== null);
    const deltas = evts.map((e) => extractAnthropicDelta(e!));
    expect(deltas[0]).toEqual({ text: "", done: false }); // message_start
    expect(deltas[1]).toEqual({ text: "Hi", done: false });
    expect(deltas[2]).toEqual({ text: "", done: true });
  });
});
