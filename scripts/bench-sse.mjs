// Phase 5 §5 backlog (b) — Server-Sent Events parser bench. Inlines the
// algorithms from `lib/sse.ts` so the bench runs without a TS build,
// matching the per-engine bench tradition (see also `bench-style.mjs`,
// `bench-resize.mjs`, etc.). Audit `02-tests.md` flags the inline-mirror
// anti-pattern as MEDIUM cleanup; not deviating from the existing
// convention here, but if you change `lib/sse.ts` you must mirror it
// below or this bench drifts silently.

// ---------- inlined helpers (mirror of lib/sse.ts) ----------

function splitSseFrames(buffer) {
  const frames = [];
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

function parseSseFrame(frame) {
  if (!frame) return null;
  const lines = frame.split(/\r?\n/);
  let event;
  const dataParts = [];
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
  }
  if (!sawData) return null;
  return { event, data: dataParts.join("\n") };
}

function extractOpenAIDelta(evt) {
  const trimmed = evt.data.trim();
  if (trimmed === "" || trimmed === "[DONE]") {
    return { text: "", done: trimmed === "[DONE]" };
  }
  let j;
  try {
    j = JSON.parse(evt.data);
  } catch {
    return { text: "", done: false };
  }
  if (!j || typeof j !== "object") return { text: "", done: false };
  const choice = j.choices?.[0];
  if (!choice || typeof choice !== "object") return { text: "", done: false };
  const text = typeof choice.delta?.content === "string" ? choice.delta.content : "";
  const done = choice.finish_reason != null;
  return { text, done };
}

function extractAnthropicDelta(evt) {
  if (evt.event === "message_stop") return { text: "", done: true };
  if (evt.event !== "content_block_delta") return { text: "", done: false };
  let j;
  try {
    j = JSON.parse(evt.data);
  } catch {
    return { text: "", done: false };
  }
  if (!j || typeof j !== "object") return { text: "", done: false };
  const delta = j.delta;
  if (!delta || typeof delta !== "object") return { text: "", done: false };
  if (delta.type !== "text_delta" || typeof delta.text !== "string") {
    return { text: "", done: false };
  }
  return { text: delta.text, done: false };
}

function encodeServerFrame(payload) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

// Audit Domain 4 MED — mirrored from `lib/sse.ts`. Returns a
// discriminated union: `{kind:"ok",value} | {kind:"skip"} |
// {kind:"malformed",reason}`. Caller distinguishes forward-compat skip
// (unknown envelope type) from genuine shape errors. Keep in sync.
function parseServerStreamPayload(data) {
  let j;
  try {
    j = JSON.parse(data);
  } catch {
    return { kind: "malformed", reason: "json-parse-failed" };
  }
  if (!j || typeof j !== "object") {
    return { kind: "malformed", reason: "root-not-object" };
  }
  const t = j.type;
  if (t === "chunk") {
    if (typeof j.text === "string") {
      return { kind: "ok", value: { type: "chunk", text: j.text } };
    }
    return { kind: "malformed", reason: "chunk-text-not-string" };
  }
  if (t === "complete") {
    if (Array.isArray(j.classes) && j.classes.every((c) => typeof c === "string")) {
      return { kind: "ok", value: { type: "complete", classes: j.classes } };
    }
    return { kind: "malformed", reason: "complete-classes-not-string-array" };
  }
  if (t === "error") {
    if (typeof j.error === "string") {
      return { kind: "ok", value: { type: "error", error: j.error } };
    }
    return { kind: "malformed", reason: "error-error-not-string" };
  }
  return { kind: "skip" };
}

// ---------- harness ----------

let pass = 0;
let fail = 0;
function ok(name, cond, detail) {
  if (cond) {
    pass++;
    console.log(`PASS: ${name}`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    if (detail !== undefined) console.log(`  → ${detail}`);
  }
}
function eq(name, got, want) {
  const sg = JSON.stringify(got);
  const sw = JSON.stringify(want);
  ok(name, sg === sw, `expected ${sw} got ${sg}`);
}

// ---------- splitSseFrames ----------

eq(
  "splitSseFrames: empty buffer → no frames, empty remaining",
  splitSseFrames(""),
  { frames: [], remaining: "" },
);

eq(
  "splitSseFrames: single frame with terminator",
  splitSseFrames("data: hello\n\n"),
  { frames: ["data: hello"], remaining: "" },
);

eq(
  "splitSseFrames: two frames",
  splitSseFrames("data: a\n\ndata: b\n\n"),
  { frames: ["data: a", "data: b"], remaining: "" },
);

eq(
  "splitSseFrames: partial tail preserved for next read",
  splitSseFrames("data: complete\n\ndata: par"),
  { frames: ["data: complete"], remaining: "data: par" },
);

eq(
  "splitSseFrames: CRLF boundary accepted",
  splitSseFrames("data: x\r\n\r\ndata: y\r\n\r\n"),
  { frames: ["data: x", "data: y"], remaining: "" },
);

eq(
  "splitSseFrames: mixed LF + CRLF in same buffer",
  splitSseFrames("data: a\n\ndata: b\r\n\r\n"),
  { frames: ["data: a", "data: b"], remaining: "" },
);

eq(
  "splitSseFrames: no terminator → no frames extracted",
  splitSseFrames("data: incomplete"),
  { frames: [], remaining: "data: incomplete" },
);

// ---------- parseSseFrame ----------

eq(
  "parseSseFrame: data-only with leading space stripped",
  parseSseFrame("data: hello"),
  { event: undefined, data: "hello" },
);

eq(
  "parseSseFrame: data without leading space preserved",
  parseSseFrame("data:hello"),
  { event: undefined, data: "hello" },
);

eq(
  "parseSseFrame: event + data",
  parseSseFrame("event: ping\ndata: {}"),
  { event: "ping", data: "{}" },
);

eq(
  "parseSseFrame: multi-line data joined with \\n",
  parseSseFrame("data: line1\ndata: line2\ndata: line3"),
  { event: undefined, data: "line1\nline2\nline3" },
);

eq(
  "parseSseFrame: comment lines ignored",
  parseSseFrame(": keep-alive\ndata: x"),
  { event: undefined, data: "x" },
);

eq(
  "parseSseFrame: id and retry fields silently skipped",
  parseSseFrame("id: 42\nretry: 1000\nevent: msg\ndata: payload"),
  { event: "msg", data: "payload" },
);

ok(
  "parseSseFrame: empty frame → null",
  parseSseFrame("") === null,
);

ok(
  "parseSseFrame: comment-only frame → null",
  parseSseFrame(": just a comment") === null,
);

ok(
  "parseSseFrame: event-only frame (no data) → null",
  parseSseFrame("event: ping") === null,
);

eq(
  "parseSseFrame: empty data: line → empty data string, not null",
  parseSseFrame("data:"),
  { event: undefined, data: "" },
);

// ---------- extractOpenAIDelta ----------

eq(
  "openai: text content delta",
  extractOpenAIDelta({
    data: JSON.stringify({
      choices: [{ delta: { content: "hello" }, finish_reason: null }],
    }),
  }),
  { text: "hello", done: false },
);

eq(
  "openai: [DONE] sentinel → done true, no text",
  extractOpenAIDelta({ data: "[DONE]" }),
  { text: "", done: true },
);

eq(
  "openai: finish_reason set → done true",
  extractOpenAIDelta({
    data: JSON.stringify({
      choices: [{ delta: {}, finish_reason: "stop" }],
    }),
  }),
  { text: "", done: true },
);

eq(
  "openai: empty data → no text, no done",
  extractOpenAIDelta({ data: "" }),
  { text: "", done: false },
);

eq(
  "openai: malformed JSON → no text, no done (no throw)",
  extractOpenAIDelta({ data: "not json" }),
  { text: "", done: false },
);

eq(
  "openai: missing choices → no text, no done",
  extractOpenAIDelta({ data: "{}" }),
  { text: "", done: false },
);

eq(
  "openai: role-only opening delta → empty text",
  extractOpenAIDelta({
    data: JSON.stringify({
      choices: [{ delta: { role: "assistant" }, finish_reason: null }],
    }),
  }),
  { text: "", done: false },
);

eq(
  "openai: ignores irrelevant event field",
  extractOpenAIDelta({
    event: "anything",
    data: JSON.stringify({
      choices: [{ delta: { content: "x" }, finish_reason: null }],
    }),
  }),
  { text: "x", done: false },
);

// ---------- extractAnthropicDelta ----------

eq(
  "anthropic: content_block_delta with text_delta",
  extractAnthropicDelta({
    event: "content_block_delta",
    data: JSON.stringify({
      type: "content_block_delta",
      index: 0,
      delta: { type: "text_delta", text: "hi" },
    }),
  }),
  { text: "hi", done: false },
);

eq(
  "anthropic: message_stop → done",
  extractAnthropicDelta({
    event: "message_stop",
    data: JSON.stringify({ type: "message_stop" }),
  }),
  { text: "", done: true },
);

eq(
  "anthropic: ping keep-alive → empty",
  extractAnthropicDelta({
    event: "ping",
    data: JSON.stringify({ type: "ping" }),
  }),
  { text: "", done: false },
);

eq(
  "anthropic: message_start → empty",
  extractAnthropicDelta({
    event: "message_start",
    data: JSON.stringify({ type: "message_start" }),
  }),
  { text: "", done: false },
);

eq(
  "anthropic: content_block_start → empty",
  extractAnthropicDelta({
    event: "content_block_start",
    data: JSON.stringify({
      type: "content_block_start",
      content_block: { type: "text", text: "" },
    }),
  }),
  { text: "", done: false },
);

eq(
  "anthropic: content_block_delta with non-text delta type → empty",
  extractAnthropicDelta({
    event: "content_block_delta",
    data: JSON.stringify({
      delta: { type: "input_json_delta", partial_json: "{}" },
    }),
  }),
  { text: "", done: false },
);

eq(
  "anthropic: malformed JSON → empty (no throw)",
  extractAnthropicDelta({ event: "content_block_delta", data: "not json" }),
  { text: "", done: false },
);

eq(
  "anthropic: missing event field → empty",
  extractAnthropicDelta({
    data: JSON.stringify({
      delta: { type: "text_delta", text: "ignored" },
    }),
  }),
  { text: "", done: false },
);

// ---------- encodeServerFrame ----------

eq(
  "encodeServerFrame: chunk",
  encodeServerFrame({ type: "chunk", text: "abc" }),
  'data: {"type":"chunk","text":"abc"}\n\n',
);

eq(
  "encodeServerFrame: complete",
  encodeServerFrame({ type: "complete", classes: ["bg-red-500", "p-4"] }),
  'data: {"type":"complete","classes":["bg-red-500","p-4"]}\n\n',
);

eq(
  "encodeServerFrame: error",
  encodeServerFrame({ type: "error", error: "boom" }),
  'data: {"type":"error","error":"boom"}\n\n',
);

// ---------- parseServerStreamPayload ----------

eq(
  "parseServerStreamPayload: valid chunk",
  parseServerStreamPayload('{"type":"chunk","text":"x"}'),
  { kind: "ok", value: { type: "chunk", text: "x" } },
);

eq(
  "parseServerStreamPayload: valid complete",
  parseServerStreamPayload('{"type":"complete","classes":["a","b"]}'),
  { kind: "ok", value: { type: "complete", classes: ["a", "b"] } },
);

eq(
  "parseServerStreamPayload: valid error",
  parseServerStreamPayload('{"type":"error","error":"x"}'),
  { kind: "ok", value: { type: "error", error: "x" } },
);

eq(
  "parseServerStreamPayload: malformed JSON → kind:malformed",
  parseServerStreamPayload("not json"),
  { kind: "malformed", reason: "json-parse-failed" },
);

eq(
  "parseServerStreamPayload: unknown type → kind:skip (forward-compat)",
  parseServerStreamPayload('{"type":"weird","x":1}'),
  { kind: "skip" },
);

eq(
  "parseServerStreamPayload: chunk without text → kind:malformed",
  parseServerStreamPayload('{"type":"chunk"}'),
  { kind: "malformed", reason: "chunk-text-not-string" },
);

eq(
  "parseServerStreamPayload: complete with non-string class → kind:malformed",
  parseServerStreamPayload('{"type":"complete","classes":["a",42]}'),
  { kind: "malformed", reason: "complete-classes-not-string-array" },
);

eq(
  "parseServerStreamPayload: complete missing classes → kind:malformed",
  parseServerStreamPayload('{"type":"complete"}'),
  { kind: "malformed", reason: "complete-classes-not-string-array" },
);

// ---------- round-trip envelope ----------

(() => {
  const original = { type: "complete", classes: ["bg-red-500", "p-4", "flex"] };
  const encoded = encodeServerFrame(original);
  // strip the SSE framing then parse the data field
  const { frames } = splitSseFrames(encoded);
  const evt = parseSseFrame(frames[0]);
  const parsed = parseServerStreamPayload(evt.data);
  eq("round-trip envelope: encode → split → parse → payload", parsed, {
    kind: "ok",
    value: original,
  });
})();

// ---------- end-to-end OpenAI stream simulation ----------

(() => {
  // Realistic shape: opening role frame, three content frames, terminal
  // finish_reason frame, [DONE] sentinel.
  const frames = [
    `data: ${JSON.stringify({ choices: [{ delta: { role: "assistant" }, finish_reason: null }] })}`,
    `data: ${JSON.stringify({ choices: [{ delta: { content: '{"' }, finish_reason: null }] })}`,
    `data: ${JSON.stringify({ choices: [{ delta: { content: 'classes":["bg-red-500"' }, finish_reason: null }] })}`,
    `data: ${JSON.stringify({ choices: [{ delta: { content: "]}" }, finish_reason: null }] })}`,
    `data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: "stop" }] })}`,
    "data: [DONE]",
  ];
  const stream = frames.join("\n\n") + "\n\n";

  // Feed to splitter; collect text + done across frames.
  const { frames: split } = splitSseFrames(stream);
  let text = "";
  let done = false;
  for (const raw of split) {
    const evt = parseSseFrame(raw);
    if (!evt) continue;
    const d = extractOpenAIDelta(evt);
    text += d.text;
    if (d.done) done = true;
  }
  ok("openai end-to-end: terminal done observed", done);
  eq("openai end-to-end: text accumulated in order", text, '{"classes":["bg-red-500"]}');
})();

// ---------- end-to-end Anthropic stream simulation ----------

(() => {
  // Realistic shape with typed events.
  const frames = [
    'event: message_start\ndata: {"type":"message_start","message":{"id":"msg_1","model":"claude-haiku","content":[]}}',
    'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}',
    'event: ping\ndata: {"type":"ping"}',
    `event: content_block_delta\ndata: ${JSON.stringify({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: '{"' } })}`,
    `event: content_block_delta\ndata: ${JSON.stringify({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: 'classes":["p-4"' } })}`,
    `event: content_block_delta\ndata: ${JSON.stringify({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "]}" } })}`,
    'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}',
    'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":7}}',
    'event: message_stop\ndata: {"type":"message_stop"}',
  ];
  const stream = frames.join("\n\n") + "\n\n";

  const { frames: split } = splitSseFrames(stream);
  let text = "";
  let done = false;
  for (const raw of split) {
    const evt = parseSseFrame(raw);
    if (!evt) continue;
    const d = extractAnthropicDelta(evt);
    text += d.text;
    if (d.done) done = true;
  }
  ok("anthropic end-to-end: terminal done observed", done);
  eq("anthropic end-to-end: text accumulated, ping ignored", text, '{"classes":["p-4"]}');
})();

// ---------- chunked-byte stream simulation (bytes split mid-frame) ----------

(() => {
  // Provider sends bytes that don't align to frame boundaries — verify
  // the buffer-and-replay loop drains correctly across reads.
  const wholeStream =
    "data: a\n\nevent: content_block_delta\ndata: " +
    JSON.stringify({ delta: { type: "text_delta", text: "X" } }) +
    "\n\ndata: [DONE]\n\n";

  // Split bytes into 7-character chunks and feed sequentially.
  let buffer = "";
  const collected = [];
  for (let i = 0; i < wholeStream.length; i += 7) {
    buffer += wholeStream.slice(i, i + 7);
    const r = splitSseFrames(buffer);
    buffer = r.remaining;
    for (const raw of r.frames) {
      const evt = parseSseFrame(raw);
      if (evt) collected.push(evt);
    }
  }
  // After full feed, buffer must be drained.
  ok("chunked feed: buffer drained at stream end", buffer === "");
  ok("chunked feed: 3 frames recovered across boundaries", collected.length === 3);
  eq("chunked feed: middle frame typed event preserved", collected[1].event, "content_block_delta");
  eq("chunked feed: terminal frame is [DONE]", collected[2].data, "[DONE]");
})();

// ---------- summary ----------

console.log(`\nbench-sse: ${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
