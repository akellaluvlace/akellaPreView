// Thirty-second-pass — pure-logic bench for the parse + serialize
// helpers in `lib/tree-persistence.ts`. Covers depth (number | null |
// Infinity sentinel), query (string with length cap), corruption
// tolerance, and roundtrip stability. Helper logic inlined here so the
// bench is hermetic — if `lib/tree-persistence.ts` diverges, the
// vitest wrapper's bench-summary cross-check still surfaces the
// mismatch via diff.

const QUERY_MAX_LEN = 256;
const EXPANDED_MAX_ENTRIES = 1000;
const SUBTREE_DEPTH_MAX_ENTRIES = 50;
const STORAGE_SCHEMA_VERSION = 1;
const KEY_NAMESPACE = "dropin:tree:";

// ---- Thirty-third-pass chunk (z): inline parseSchemaVersionFromKey -----

function parseSchemaVersionFromKey(key) {
  const m = /:v(\d+)$/.exec(key);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  return n;
}

// ---- Thirty-third-pass chunk (q): inline parseStoredSubtreeDepths /
//      serializeStoredSubtreeDepths / mergeStoredSubtreeDepth ----------

function parseStoredSubtreeDepths(raw) {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const out = {};
    let count = 0;
    for (const k of Object.keys(parsed)) {
      if (count >= SUBTREE_DEPTH_MAX_ENTRIES) break;
      const v = parsed[k];
      if (typeof v !== "number") continue;
      if (!Number.isFinite(v)) continue;
      if (v < 0) continue;
      out[k] = Math.floor(v);
      count++;
    }
    return out;
  } catch {
    return null;
  }
}

function serializeStoredSubtreeDepths(map) {
  const keys = Object.keys(map);
  if (keys.length <= SUBTREE_DEPTH_MAX_ENTRIES) {
    return JSON.stringify(map);
  }
  const trimmed = {};
  const startIdx = keys.length - SUBTREE_DEPTH_MAX_ENTRIES;
  for (let i = startIdx; i < keys.length; i++) {
    const k = keys[i];
    trimmed[k] = Math.floor(map[k]);
  }
  return JSON.stringify(trimmed);
}

function mergeStoredSubtreeDepth(prev, oid, depth) {
  const next = {};
  for (const k of Object.keys(prev)) {
    if (k === oid) continue;
    next[k] = prev[k];
  }
  next[oid] = Math.floor(depth);
  return next;
}

function parseStoredExpanded(raw) {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    if (!parsed.every((s) => typeof s === "string")) return null;
    if (parsed.length > EXPANDED_MAX_ENTRIES) {
      return parsed.slice(0, EXPANDED_MAX_ENTRIES);
    }
    return parsed;
  } catch {
    return null;
  }
}

function serializeStoredExpanded(keys) {
  const arr = Array.isArray(keys) ? keys : Array.from(keys);
  const capped =
    arr.length > EXPANDED_MAX_ENTRIES ? arr.slice(0, EXPANDED_MAX_ENTRIES) : arr;
  return JSON.stringify(capped);
}

function parseStoredDepth(raw, fallback) {
  if (raw === null) return fallback;
  if (raw === "null") return null;
  if (raw === "Infinity") return Number.POSITIVE_INFINITY;
  if (raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  if (n < 0) return fallback;
  return Math.floor(n);
}

function serializeStoredDepth(depth) {
  if (depth === null) return "null";
  if (!Number.isFinite(depth)) return "Infinity";
  return String(Math.floor(depth));
}

function parseStoredQuery(raw) {
  if (raw === null) return "";
  if (raw.length > QUERY_MAX_LEN) return raw.slice(0, QUERY_MAX_LEN);
  return raw;
}

let passed = 0;
let failed = 0;

// JSON.stringify can't represent Infinity / NaN — they collapse to
// "null". The bench's encode helper picks distinct sentinels so a
// "fallback null" doesn't accidentally pass when the helper returned
// Infinity (or vice versa).
function encode(v) {
  if (typeof v === "number" && !Number.isFinite(v)) {
    return v > 0 ? "<Infinity>" : "<-Infinity>";
  }
  if (v === null) return "<null>";
  if (Number.isNaN(v)) return "<NaN>";
  return JSON.stringify(v);
}

function assertEq(label, got, want) {
  const a = encode(got);
  const b = encode(want);
  if (a === b) {
    passed++;
    console.log(`PASS: ${label}`);
  } else {
    failed++;
    console.log(`FAIL: ${label}\n  got:  ${a}\n  want: ${b}`);
  }
}

// ---- parseStoredDepth: missing / fallback ------------------------------

assertEq("1: missing returns fallback (2)", parseStoredDepth(null, 2), 2);
assertEq("2: missing returns fallback null (manual mode)", parseStoredDepth(null, null), null);
assertEq("3: missing returns fallback Infinity", parseStoredDepth(null, Number.POSITIVE_INFINITY), Number.POSITIVE_INFINITY);

// ---- parseStoredDepth: valid integers ----------------------------------

assertEq("4: '0' → 0 (collapse-all is valid)", parseStoredDepth("0", 2), 0);
assertEq("5: '1' → 1", parseStoredDepth("1", 2), 1);
assertEq("6: '2' → 2 (default depth)", parseStoredDepth("2", 9), 2);
assertEq("7: '3' → 3", parseStoredDepth("3", 2), 3);
assertEq("8: '5' → 5", parseStoredDepth("5", 2), 5);
assertEq("9: '99' → 99 (above UI grid still passes through)", parseStoredDepth("99", 2), 99);

// ---- parseStoredDepth: sentinel values ---------------------------------

assertEq("10: 'Infinity' → POSITIVE_INFINITY", parseStoredDepth("Infinity", 2), Number.POSITIVE_INFINITY);
assertEq("11: 'null' → null (manual mode)", parseStoredDepth("null", 2), null);

// ---- parseStoredDepth: corrupt / unrecognized → fallback ---------------

assertEq("12: garbage 'foo' → fallback", parseStoredDepth("foo", 2), 2);
assertEq("13: empty string '' → fallback (Number('') is 0; explicit reject)", parseStoredDepth("", 2), 2);
// 13a: whitespace-only string. Number('   ') is also 0; same reject.
assertEq("13a: whitespace-only '   ' → fallback", parseStoredDepth("   ", 2), 2);
assertEq("14: 'NaN' → fallback (Number('NaN') is NaN)", parseStoredDepth("NaN", 2), 2);
assertEq("15: 'undefined' → fallback", parseStoredDepth("undefined", 2), 2);
assertEq("16: '[]' (array literal) → fallback", parseStoredDepth("[]", 2), 2);
assertEq("17: '{}' (object literal) → fallback", parseStoredDepth("{}", 2), 2);
assertEq("18: 'true' → fallback", parseStoredDepth("true", 2), 2);
assertEq("19: 'false' → fallback (Number('false') = NaN)", parseStoredDepth("false", 2), 2);
assertEq("20: '-Infinity' → fallback (negative infinity not allowed)", parseStoredDepth("-Infinity", 2), 2);
assertEq("21: 'infinity' lowercase → fallback (strict format)", parseStoredDepth("infinity", 0), 0);
assertEq("22: 'INFINITY' upper → fallback (strict format)", parseStoredDepth("INFINITY", 0), 0);

// ---- parseStoredDepth: negative + fractional ---------------------------

assertEq("23: '-1' → fallback (no UI for negatives)", parseStoredDepth("-1", 2), 2);
assertEq("24: '-99' → fallback", parseStoredDepth("-99", 2), 2);
assertEq("25: '2.7' → 2 (floor)", parseStoredDepth("2.7", 0), 2);
assertEq("26: '0.5' → 0 (floor of fractional zero)", parseStoredDepth("0.5", 9), 0);
assertEq("27: '2.0' → 2 (integer-valued float)", parseStoredDepth("2.0", 0), 2);

// ---- parseStoredDepth: whitespace tolerance ----------------------------

assertEq("28: ' 3 ' → 3 (Number coercion strips whitespace)", parseStoredDepth(" 3 ", 0), 3);
assertEq("29: '3\\n' → 3 (trailing newline)", parseStoredDepth("3\n", 0), 3);

// ---- serializeStoredDepth ---------------------------------------------

assertEq("30: serialize 0 → '0'", serializeStoredDepth(0), "0");
assertEq("31: serialize 1 → '1'", serializeStoredDepth(1), "1");
assertEq("32: serialize 2 → '2'", serializeStoredDepth(2), "2");
assertEq("33: serialize 3 → '3'", serializeStoredDepth(3), "3");
assertEq("34: serialize 99 → '99'", serializeStoredDepth(99), "99");
assertEq("35: serialize Infinity → 'Infinity'", serializeStoredDepth(Number.POSITIVE_INFINITY), "Infinity");
assertEq("36: serialize null → 'null'", serializeStoredDepth(null), "null");
assertEq("37: serialize fractional 2.9 → '2' (floor)", serializeStoredDepth(2.9), "2");

// ---- Roundtrip: parse(serialize(d)) === d ------------------------------

for (const d of [0, 1, 2, 3, 5, 99, Number.POSITIVE_INFINITY, null]) {
  const r = parseStoredDepth(serializeStoredDepth(d), 999);
  assertEq(`38.${d === null ? "null" : !Number.isFinite(d) ? "Inf" : d}: roundtrip stable`, r, d);
}

// ---- parseStoredQuery: basic --------------------------------------------

assertEq("46: missing → empty string", parseStoredQuery(null), "");
assertEq("47: empty → empty", parseStoredQuery(""), "");
assertEq("48: short query 'div' preserved", parseStoredQuery("div"), "div");
assertEq("49: tag-with-class '.btn' preserved", parseStoredQuery(".btn"), ".btn");
assertEq("50: hyphenated 'data-id' preserved", parseStoredQuery("data-id"), "data-id");

// ---- parseStoredQuery: whitespace --------------------------------------

assertEq("51: leading/trailing space preserved (display untrimmed)", parseStoredQuery(" div "), " div ");
assertEq("52: tab preserved", parseStoredQuery("\tdiv"), "\tdiv");
assertEq("53: newline preserved", parseStoredQuery("a\nb"), "a\nb");

// ---- parseStoredQuery: length cap --------------------------------------

{
  const long = "x".repeat(300);
  const r = parseStoredQuery(long);
  assertEq("54: 300-char input clamped to 256", r.length, 256);
  assertEq("55: clamp preserves prefix bytes", r, "x".repeat(256));
}

{
  const at = "y".repeat(256);
  assertEq("56: at-cap (256) input preserved", parseStoredQuery(at), at);
}

{
  const over = "z".repeat(257);
  assertEq("57: just-over-cap (257) clamped to 256", parseStoredQuery(over).length, 256);
}

{
  const huge = "q".repeat(10000);
  assertEq("58: huge (10k) clamped to 256", parseStoredQuery(huge).length, 256);
}

// ---- parseStoredQuery: unicode ----------------------------------------

assertEq("59: unicode 'café' preserved", parseStoredQuery("café"), "café");
assertEq("60: emoji preserved (UTF-16 code unit count)", parseStoredQuery("foo🎨"), "foo🎨");

// ---- parseStoredQuery: corruption survival ----------------------------

assertEq("61: query with control char preserved (caller filters)", parseStoredQuery("a b"), "a b");
assertEq("62: JSON-like garbage stored as raw '{\"x\":1}'", parseStoredQuery('{"x":1}'), '{"x":1}');

// ---- Idempotence: parse(parse(x)) === parse(x) ------------------------

{
  for (const raw of [null, "2", "Infinity", "null", "garbage", "-1"]) {
    const once = parseStoredDepth(raw, 2);
    // Re-parse the serialized form (or the original null when raw is null).
    const reSer = once === null && raw === null ? null : serializeStoredDepth(once);
    const twice = parseStoredDepth(reSer, 2);
    assertEq(`63.${raw === null ? "null" : raw}: parse-serialize-parse stable`, twice, once);
  }
}

// ---- Defense-in-depth: helpers don't throw on edge inputs --------------

let didThrow = false;
try { parseStoredDepth(null, null); } catch { didThrow = true; }
assertEq("69: parseStoredDepth(null, null) does not throw", didThrow, false);

didThrow = false;
try { parseStoredDepth("garbage", null); } catch { didThrow = true; }
assertEq("70: parseStoredDepth('garbage', null) does not throw", didThrow, false);

didThrow = false;
try { serializeStoredDepth(null); } catch { didThrow = true; }
assertEq("71: serializeStoredDepth(null) does not throw", didThrow, false);

didThrow = false;
try { serializeStoredDepth(Number.POSITIVE_INFINITY); } catch { didThrow = true; }
assertEq("72: serializeStoredDepth(Infinity) does not throw", didThrow, false);

didThrow = false;
try { parseStoredQuery(null); } catch { didThrow = true; }
assertEq("73: parseStoredQuery(null) does not throw", didThrow, false);

didThrow = false;
try { parseStoredQuery("x".repeat(1_000_000)); } catch { didThrow = true; }
assertEq("74: parseStoredQuery(1MB string) does not throw", didThrow, false);

// ---- Defense-in-depth: pure (no input mutation) -----------------------

{
  const arr = ["2", "3", "Infinity"];
  const before = JSON.stringify(arr);
  for (const raw of arr) parseStoredDepth(raw, 0);
  const after = JSON.stringify(arr);
  assertEq("75: parseStoredDepth doesn't mutate input array", before, after);
}

// ---- Sentinel disambiguation: null vs Infinity vs 0 -------------------

// All three serialize to distinct strings, parse back to distinct values.
{
  const s0 = serializeStoredDepth(0);
  const sNull = serializeStoredDepth(null);
  const sInf = serializeStoredDepth(Number.POSITIVE_INFINITY);
  assertEq("76: serialize(0) !== serialize(null)", s0 !== sNull, true);
  assertEq("77: serialize(0) !== serialize(Infinity)", s0 !== sInf, true);
  assertEq("78: serialize(null) !== serialize(Infinity)", sNull !== sInf, true);
}

// ---- Migration sketch: hypothetical v2 format -------------------------

// If a future schema bumps to v2 (e.g. JSON-encoded { depth: 2, ... }),
// the v1 reader on a v2-formatted value should fall through to fallback.
// This sketch confirms the parser doesn't accidentally accept a v2 shape.
assertEq("79: v2-shaped input '{\"depth\":2}' → fallback (v1 strict)", parseStoredDepth('{"depth":2}', 9), 9);
assertEq("80: v2-shaped input 'depth=2' → fallback", parseStoredDepth("depth=2", 9), 9);

// ---- parseStoredExpanded: missing / null ------------------------------

assertEq("81: missing → null (caller falls back)", parseStoredExpanded(null), null);
assertEq("82: invalid JSON → null", parseStoredExpanded("not json"), null);
assertEq("83: empty string → null (JSON.parse fails)", parseStoredExpanded(""), null);

// ---- parseStoredExpanded: shape validation ---------------------------

assertEq("84: empty array → empty array", parseStoredExpanded("[]"), []);
assertEq("85: single-string array preserved", parseStoredExpanded('["oid:abc"]'), ["oid:abc"]);
assertEq("86: multi-string array preserved", parseStoredExpanded('["oid:a","oid:b","jsx:5:8"]'), ["oid:a", "oid:b", "jsx:5:8"]);

// ---- parseStoredExpanded: corrupt shapes → null ----------------------

assertEq("87: object → null (not array)", parseStoredExpanded('{"a":1}'), null);
assertEq("88: number → null (not array)", parseStoredExpanded("42"), null);
assertEq("89: string-literal → null (not array)", parseStoredExpanded('"oid:abc"'), null);
assertEq("90: bool → null (not array)", parseStoredExpanded("true"), null);
assertEq("91: nested array → null (top-level type check)", parseStoredExpanded('[["oid:a"]]'), null);
assertEq("92: array with number → null (entry type check)", parseStoredExpanded('["oid:a", 42]'), null);
assertEq("93: array with object → null (entry type check)", parseStoredExpanded('["oid:a", {"x":1}]'), null);
assertEq("94: array with null → null (entry type check)", parseStoredExpanded('["oid:a", null]'), null);

// ---- parseStoredExpanded: cap on read --------------------------------

{
  // Build 1500-entry array. Should clamp to 1000.
  const entries = [];
  for (let i = 0; i < 1500; i++) entries.push(`oid:${i}`);
  const raw = JSON.stringify(entries);
  const r = parseStoredExpanded(raw);
  assertEq("95: 1500-entry input clamped to 1000 on read", r.length, 1000);
  assertEq("96: clamp preserves prefix order", r[0], "oid:0");
  assertEq("97: clamp drops suffix", r[999], "oid:999");
}

{
  // Just at cap.
  const at = [];
  for (let i = 0; i < 1000; i++) at.push(`oid:${i}`);
  const r = parseStoredExpanded(JSON.stringify(at));
  assertEq("98: at-cap (1000) preserved", r.length, 1000);
}

// ---- parseStoredExpanded: keys with special content ------------------

assertEq("99: jsx-loc keys preserved", parseStoredExpanded('["jsx:5:8","jsx:120:99"]'), ["jsx:5:8", "jsx:120:99"]);
assertEq("100: html-path keys preserved", parseStoredExpanded('["html:0.1.2","html:3"]'), ["html:0.1.2", "html:3"]);
assertEq("101: empty-string entry preserved (caller filters)", parseStoredExpanded('[""]'), [""]);
assertEq("102: unicode-key preserved", parseStoredExpanded('["oid:тест"]'), ["oid:тест"]);

// ---- serializeStoredExpanded -----------------------------------------

assertEq("103: serialize empty array → '[]'", serializeStoredExpanded([]), "[]");
assertEq("104: serialize single-entry array", serializeStoredExpanded(["oid:abc"]), '["oid:abc"]');
assertEq("105: serialize Set instance", serializeStoredExpanded(new Set(["oid:a", "oid:b"])), '["oid:a","oid:b"]');

// ---- serializeStoredExpanded: cap on write ---------------------------

{
  const entries = [];
  for (let i = 0; i < 1500; i++) entries.push(`oid:${i}`);
  const r = serializeStoredExpanded(entries);
  const parsed = JSON.parse(r);
  assertEq("106: 1500-entry input clamped to 1000 on serialize", parsed.length, 1000);
  assertEq("107: clamp preserves prefix on serialize", parsed[0], "oid:0");
}

// ---- Roundtrip parse(serialize(x)) -----------------------------------

{
  const cases = [
    [],
    ["oid:abc"],
    ["oid:a", "oid:b", "jsx:5:8"],
    ["html:0.1.2", "oid:foo"],
  ];
  for (const c of cases) {
    const r = parseStoredExpanded(serializeStoredExpanded(c));
    assertEq(`108.${c.length}: roundtrip ${c.length}-entry`, r, c);
  }
}

// ---- Defense-in-depth: helpers don't throw ---------------------------

didThrow = false;
try { parseStoredExpanded(null); } catch { didThrow = true; }
assertEq("112: parseStoredExpanded(null) does not throw", didThrow, false);

didThrow = false;
try { parseStoredExpanded("not json"); } catch { didThrow = true; }
assertEq("113: parseStoredExpanded('not json') does not throw", didThrow, false);

didThrow = false;
try { serializeStoredExpanded([]); } catch { didThrow = true; }
assertEq("114: serializeStoredExpanded([]) does not throw", didThrow, false);

didThrow = false;
try { serializeStoredExpanded(new Set()); } catch { didThrow = true; }
assertEq("115: serializeStoredExpanded(new Set()) does not throw", didThrow, false);

// ---- Pure: no input mutation ----------------------------------------

{
  const arr = ["oid:a", "oid:b"];
  const before = JSON.stringify(arr);
  serializeStoredExpanded(arr);
  serializeStoredExpanded(arr);
  const after = JSON.stringify(arr);
  assertEq("116: serializeStoredExpanded does not mutate input", before, after);
}

// ---- Idempotent: repeated calls produce identical output ------------

{
  const r1 = serializeStoredExpanded(["oid:a", "oid:b"]);
  const r2 = serializeStoredExpanded(["oid:a", "oid:b"]);
  assertEq("117: serialize idempotent", r1, r2);
}

// ---- Thirty-third-pass chunk (z): parseSchemaVersionFromKey ---------

assertEq("118: '<ns>depth:v1' → 1", parseSchemaVersionFromKey("dropin:tree:depth:v1"), 1);
assertEq("119: '<ns>depth:v2' → 2", parseSchemaVersionFromKey("dropin:tree:depth:v2"), 2);
assertEq("120: '<ns>foo:v17' → 17", parseSchemaVersionFromKey("dropin:tree:foo:v17"), 17);
assertEq("121: 'dropin:tree:width' (no suffix) → null", parseSchemaVersionFromKey("dropin:tree:width"), null);
assertEq("122: '<ns>depth' (no version) → null", parseSchemaVersionFromKey("dropin:tree:depth"), null);
assertEq("123: '<ns>depth:vfoo' (non-int) → null", parseSchemaVersionFromKey("dropin:tree:depth:vfoo"), null);
assertEq("124: '' empty string → null", parseSchemaVersionFromKey(""), null);
assertEq("125: 'random' → null", parseSchemaVersionFromKey("random"), null);
// Trailing :vN match only — middle :vN doesn't match because regex anchored at end.
assertEq("126: 'foo:v3:bar' middle-version → null", parseSchemaVersionFromKey("foo:v3:bar"), null);
// Versioned key in another namespace still parses.
assertEq("127: 'other:thing:v5' → 5 (helper namespace-agnostic)", parseSchemaVersionFromKey("other:thing:v5"), 5);
// Capital V doesn't match (case-sensitive).
assertEq("128: 'dropin:tree:depth:V1' uppercase V → null", parseSchemaVersionFromKey("dropin:tree:depth:V1"), null);
// Zero is a valid version number.
assertEq("129: '<ns>depth:v0' → 0", parseSchemaVersionFromKey("dropin:tree:depth:v0"), 0);

// Schema version constant locked.
assertEq("130: STORAGE_SCHEMA_VERSION === 1", STORAGE_SCHEMA_VERSION, 1);

// ---- Thirty-third-pass chunk (q): parseStoredSubtreeDepths ----------

// Missing / null falls through.
assertEq("131: parse(null) → null", parseStoredSubtreeDepths(null), null);
// Valid empty object.
{
  const r = parseStoredSubtreeDepths("{}");
  assertEq("132: parse('{}') → {}", JSON.stringify(r), "{}");
}
// Valid single entry.
{
  const r = parseStoredSubtreeDepths('{"oid:a":3}');
  assertEq("133: parse single entry", JSON.stringify(r), '{"oid:a":3}');
}
// Valid multi entry.
{
  const r = parseStoredSubtreeDepths('{"oid:a":3,"oid:b":2,"oid:c":5}');
  assertEq("134: parse multi entry", JSON.stringify(r), '{"oid:a":3,"oid:b":2,"oid:c":5}');
}
// Invalid JSON.
assertEq("135: parse invalid JSON → null", parseStoredSubtreeDepths("not json"), null);
// Top-level array → null.
assertEq("136: parse array → null", parseStoredSubtreeDepths('["oid:a"]'), null);
// Top-level number → null.
assertEq("137: parse number → null", parseStoredSubtreeDepths('42'), null);
// Top-level string → null.
assertEq("138: parse string → null", parseStoredSubtreeDepths('"foo"'), null);
// Top-level null → null.
assertEq("139: parse 'null' → null", parseStoredSubtreeDepths("null"), null);
// Top-level boolean → null.
assertEq("140: parse 'true' → null", parseStoredSubtreeDepths("true"), null);
// Mixed — string values get filtered.
{
  const r = parseStoredSubtreeDepths('{"oid:a":3,"oid:b":"foo","oid:c":2}');
  assertEq("141: parse with string value filtered", JSON.stringify(r), '{"oid:a":3,"oid:c":2}');
}
// Mixed — null values get filtered.
{
  const r = parseStoredSubtreeDepths('{"oid:a":3,"oid:b":null}');
  assertEq("142: parse with null value filtered", JSON.stringify(r), '{"oid:a":3}');
}
// Mixed — array values get filtered.
{
  const r = parseStoredSubtreeDepths('{"oid:a":3,"oid:b":[1,2]}');
  assertEq("143: parse with array value filtered", JSON.stringify(r), '{"oid:a":3}');
}
// Negative depth filtered.
{
  const r = parseStoredSubtreeDepths('{"oid:a":3,"oid:b":-1}');
  assertEq("144: parse negative depth filtered", JSON.stringify(r), '{"oid:a":3}');
}
// Zero is valid (collapse-only-children semantic).
{
  const r = parseStoredSubtreeDepths('{"oid:a":0}');
  assertEq("145: parse depth=0 valid", JSON.stringify(r), '{"oid:a":0}');
}
// Fractional truncated.
{
  const r = parseStoredSubtreeDepths('{"oid:a":2.7}');
  assertEq("146: parse fractional truncated to floor", JSON.stringify(r), '{"oid:a":2}');
}
// NaN filtered (Number.isFinite false).
{
  const r = parseStoredSubtreeDepths('{"oid:a":null,"oid:b":2}');
  assertEq("147: parse NaN-equiv (null) filtered", JSON.stringify(r), '{"oid:b":2}');
}
// Read cap — over-cap entries truncated.
{
  const huge = {};
  for (let i = 0; i < 100; i++) huge[`oid:${i}`] = i % 6;
  const r = parseStoredSubtreeDepths(JSON.stringify(huge));
  assertEq("148: parse caps at 50 entries", Object.keys(r).length, 50);
  // The first 50 keys (insertion order) should survive.
  assertEq("149: parse cap keeps insertion-order head", r["oid:0"], 0);
  assertEq("150: parse cap keeps insertion-order head, last surviving", r["oid:49"], 49 % 6);
  // Beyond cap: oid:50 should not be present.
  assertEq("151: parse cap excludes oid:50", "oid:50" in r, false);
}

// ---- Thirty-third-pass chunk (q): serializeStoredSubtreeDepths ------

// Empty.
assertEq("152: serialize {} → '{}'", serializeStoredSubtreeDepths({}), "{}");
// Single entry.
assertEq("153: serialize single", serializeStoredSubtreeDepths({"oid:a": 3}), '{"oid:a":3}');
// Multi entry preserves insertion order.
{
  const m = {};
  m["oid:c"] = 5;
  m["oid:a"] = 3;
  m["oid:b"] = 2;
  assertEq("154: serialize preserves insertion order", serializeStoredSubtreeDepths(m), '{"oid:c":5,"oid:a":3,"oid:b":2}');
}
// Cap on serialize — keep most-recent (tail) 50 entries.
{
  const m = {};
  for (let i = 0; i < 100; i++) m[`oid:${i}`] = i % 6;
  const r = JSON.parse(serializeStoredSubtreeDepths(m));
  assertEq("155: serialize caps at 50 entries", Object.keys(r).length, 50);
  // Tail: oid:50..oid:99 should survive.
  assertEq("156: serialize cap drops head, keeps tail (oid:50)", r["oid:50"], 50 % 6);
  assertEq("157: serialize cap keeps tail (oid:99)", r["oid:99"], 99 % 6);
  assertEq("158: serialize cap drops head (oid:0 absent)", "oid:0" in r, false);
}

// ---- Thirty-third-pass chunk (q): roundtrip --------------------------

{
  const original = {"oid:a": 3, "oid:b": 2, "jsx:5:8": 4};
  const r = parseStoredSubtreeDepths(serializeStoredSubtreeDepths(original));
  assertEq("159: roundtrip multi-entry stable", JSON.stringify(r), JSON.stringify(original));
}
{
  // Empty roundtrip.
  const r = parseStoredSubtreeDepths(serializeStoredSubtreeDepths({}));
  assertEq("160: roundtrip empty → {}", JSON.stringify(r), "{}");
}

// ---- Thirty-third-pass chunk (q): mergeStoredSubtreeDepth ------------

// Insert into empty map.
{
  const r = mergeStoredSubtreeDepth({}, "oid:a", 3);
  assertEq("161: merge into empty", JSON.stringify(r), '{"oid:a":3}');
}
// Update existing key — recency reset (key moves to end).
{
  const prev = {"oid:a": 3, "oid:b": 2, "oid:c": 5};
  const r = mergeStoredSubtreeDepth(prev, "oid:b", 4);
  assertEq("162: merge updates recency", JSON.stringify(r), '{"oid:a":3,"oid:c":5,"oid:b":4}');
}
// Insert new key into populated map.
{
  const prev = {"oid:a": 3, "oid:b": 2};
  const r = mergeStoredSubtreeDepth(prev, "oid:c", 5);
  assertEq("163: merge appends new key at tail", JSON.stringify(r), '{"oid:a":3,"oid:b":2,"oid:c":5}');
}
// Re-inserting same value still bumps recency.
{
  const prev = {"oid:a": 3, "oid:b": 2};
  const r = mergeStoredSubtreeDepth(prev, "oid:a", 3);
  assertEq("164: merge same value still bumps recency", JSON.stringify(r), '{"oid:b":2,"oid:a":3}');
}
// Fractional depth floored.
{
  const r = mergeStoredSubtreeDepth({}, "oid:a", 2.9);
  assertEq("165: merge floors fractional depth", JSON.stringify(r), '{"oid:a":2}');
}
// Pure: no input mutation.
{
  const prev = {"oid:a": 3, "oid:b": 2};
  const before = JSON.stringify(prev);
  mergeStoredSubtreeDepth(prev, "oid:c", 5);
  const after = JSON.stringify(prev);
  assertEq("166: merge does not mutate input", before, after);
}

// ---- Thirty-third-pass chunk (q): cap eviction via merge + serialize -

{
  let m = {};
  // Fill past the cap via merges.
  for (let i = 0; i < 60; i++) {
    m = mergeStoredSubtreeDepth(m, `oid:${i}`, i % 6);
  }
  // After 60 inserts, the map has 60 entries (merge doesn't cap).
  assertEq("167: merge does not cap (cap is on serialize)", Object.keys(m).length, 60);
  // After serialize round-trip the cap kicks in.
  const r = JSON.parse(serializeStoredSubtreeDepths(m));
  assertEq("168: serialize-roundtrip caps at 50", Object.keys(r).length, 50);
  // Most-recent 50 (oid:10..oid:59) should survive.
  assertEq("169: cap keeps tail (oid:10)", r["oid:10"], 10 % 6);
  assertEq("170: cap keeps tail (oid:59)", r["oid:59"], 59 % 6);
  assertEq("171: cap drops head (oid:9 absent)", "oid:9" in r, false);
}

// ---- Thirty-third-pass chunk (q): defense-in-depth ------------------

didThrow = false;
try { parseStoredSubtreeDepths(null); } catch { didThrow = true; }
assertEq("172: parseStoredSubtreeDepths(null) does not throw", didThrow, false);

didThrow = false;
try { parseStoredSubtreeDepths("garbage{"); } catch { didThrow = true; }
assertEq("173: parseStoredSubtreeDepths(garbage) does not throw", didThrow, false);

didThrow = false;
try { serializeStoredSubtreeDepths({}); } catch { didThrow = true; }
assertEq("174: serializeStoredSubtreeDepths({}) does not throw", didThrow, false);

didThrow = false;
try { mergeStoredSubtreeDepth({}, "oid:a", 0); } catch { didThrow = true; }
assertEq("175: mergeStoredSubtreeDepth does not throw on zero depth", didThrow, false);

// ---- Thirty-third-pass chunk (q): cap constant locked ----------------

assertEq("176: SUBTREE_DEPTH_MAX_ENTRIES === 50", SUBTREE_DEPTH_MAX_ENTRIES, 50);

// ---- Idempotent ------------------------------------------------------

{
  const r1 = serializeStoredSubtreeDepths({"oid:a": 3, "oid:b": 2});
  const r2 = serializeStoredSubtreeDepths({"oid:a": 3, "oid:b": 2});
  assertEq("177: subtree-depths serialize idempotent", r1, r2);
}

// ===== Thirty-fourth-pass chunk (dd): isStoredTreeStateAtDefaults =====

function isStoredTreeStateAtDefaults(args) {
  if (args.lastAppliedDepth !== args.defaultDepth) return false;
  if (args.query.length > 0) return false;
  if (Object.keys(args.subtreeDepths).length > 0) return false;
  return true;
}

// Default at-defaults — every slice matches the lazy-init default.
assertEq(
  "178: at-defaults (depth=2, empty query, empty subtreeDepths)",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 2,
    defaultDepth: 2,
    query: "",
    subtreeDepths: {},
  }),
  true,
);

// Single divergence: depth differs.
assertEq(
  "179: depth=3 (non-default) → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 3,
    defaultDepth: 2,
    query: "",
    subtreeDepths: {},
  }),
  false,
);
assertEq(
  "180: depth=null (manual mode) → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: null,
    defaultDepth: 2,
    query: "",
    subtreeDepths: {},
  }),
  false,
);
assertEq(
  "181: depth=Infinity (expand-all) → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: Number.POSITIVE_INFINITY,
    defaultDepth: 2,
    query: "",
    subtreeDepths: {},
  }),
  false,
);
assertEq(
  "182: depth=0 (collapse-all) → false (not the default)",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 0,
    defaultDepth: 2,
    query: "",
    subtreeDepths: {},
  }),
  false,
);

// Single divergence: query non-empty.
assertEq(
  "183: query='div' → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 2,
    defaultDepth: 2,
    query: "div",
    subtreeDepths: {},
  }),
  false,
);
assertEq(
  "184: whitespace-only query ' ' is non-empty → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 2,
    defaultDepth: 2,
    query: " ",
    subtreeDepths: {},
  }),
  false,
);

// Single divergence: subtree-depth entries.
assertEq(
  "185: subtreeDepths has one entry → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 2,
    defaultDepth: 2,
    query: "",
    subtreeDepths: { "oid:a": 3 },
  }),
  false,
);
assertEq(
  "186: subtreeDepths has multiple entries → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 2,
    defaultDepth: 2,
    query: "",
    subtreeDepths: { "oid:a": 3, "oid:b": 1 },
  }),
  false,
);

// Different defaultDepth values — caller-supplied default wins.
assertEq(
  "187: defaultDepth=5, lastAppliedDepth=5 → true",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 5,
    defaultDepth: 5,
    query: "",
    subtreeDepths: {},
  }),
  true,
);
assertEq(
  "188: defaultDepth=5, lastAppliedDepth=2 → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 2,
    defaultDepth: 5,
    query: "",
    subtreeDepths: {},
  }),
  false,
);

// All slices diverge.
assertEq(
  "189: every slice diverges → false",
  isStoredTreeStateAtDefaults({
    lastAppliedDepth: 5,
    defaultDepth: 2,
    query: "x",
    subtreeDepths: { "oid:a": 1 },
  }),
  false,
);

// Pure no-mutation — input unchanged.
{
  const args = {
    lastAppliedDepth: 2,
    defaultDepth: 2,
    query: "",
    subtreeDepths: { "oid:a": 1 },
  };
  isStoredTreeStateAtDefaults(args);
  assertEq("190: predicate does not mutate args.subtreeDepths", Object.keys(args.subtreeDepths).length, 1);
  assertEq("191: predicate does not mutate args.query", args.query, "");
}

// ===== Thirty-fourth-pass chunk (ff): formatStoredBytes ===============

function formatStoredBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.floor(bytes)} B`;
  const k = bytes / 1024;
  const rounded = Math.round(k * 100) / 100;
  const str = rounded.toFixed(2).replace(/\.?0+$/, "");
  return `${str}K`;
}

assertEq("192: 0 → '0 B'", formatStoredBytes(0), "0 B");
assertEq("193: negative → '0 B' (defensive)", formatStoredBytes(-5), "0 B");
assertEq("194: NaN → '0 B' (defensive)", formatStoredBytes(NaN), "0 B");
assertEq("195: Infinity → '0 B' (defensive — !isFinite)", formatStoredBytes(Number.POSITIVE_INFINITY), "0 B");
assertEq("196: 1 → '1 B'", formatStoredBytes(1), "1 B");
assertEq("197: 100 → '100 B'", formatStoredBytes(100), "100 B");
assertEq("198: 1023 → '1023 B' (just under K boundary)", formatStoredBytes(1023), "1023 B");
assertEq("199: 1024 → '1K' (boundary, trailing-zero strip)", formatStoredBytes(1024), "1K");
assertEq("200: 1536 → '1.5K' (one decimal place)", formatStoredBytes(1536), "1.5K");
assertEq("201: 12288 → '12K' (clean integer K, trailing-zero strip)", formatStoredBytes(12288), "12K");
assertEq("202: 12345 → '12.06K' (two decimals)", formatStoredBytes(12345), "12.06K");
assertEq("203: 100 * 1024 → '100K' (large clean integer)", formatStoredBytes(102400), "100K");
assertEq("204: fractional input 100.7 → '100 B' (floor under K)", formatStoredBytes(100.7), "100 B");

// Idempotent.
{
  const a = formatStoredBytes(12288);
  const b = formatStoredBytes(12288);
  assertEq("205: formatStoredBytes idempotent", a, b);
}

// ===== Thirty-fifth-pass chunk (kk): classifyStorageBytes =============
//
// Severity classifier for the storage telemetry pill.
//   "ok"     — under 4096 bytes (4KB)
//   "warn"   — 4096–16383 bytes (4–16KB)
//   "danger" — 16384+ bytes (16KB+)
// Defensive coercion (negative / NaN / Infinity → "ok") matches the
// formatStoredBytes pattern.

const STORAGE_BYTES_WARN_THRESHOLD = 4 * 1024;
const STORAGE_BYTES_DANGER_THRESHOLD = 16 * 1024;
// Thirty-sixth-pass chunk (rr) — options-aware classifier.
function classifyStorageBytes(bytes, options) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "ok";
  const warnAt = options?.warnAt ?? STORAGE_BYTES_WARN_THRESHOLD;
  const dangerAt = options?.dangerAt ?? STORAGE_BYTES_DANGER_THRESHOLD;
  if (bytes >= dangerAt) return "danger";
  if (warnAt < dangerAt && bytes >= warnAt) return "warn";
  return "ok";
}

// Boundary cases — these lock the threshold semantic. Off-by-one
// regressions would surface here.
assertEq("kk-1: 0 → 'ok'", classifyStorageBytes(0), "ok");
assertEq("kk-2: 1 → 'ok'", classifyStorageBytes(1), "ok");
assertEq("kk-3: 1024 (1KB) → 'ok'", classifyStorageBytes(1024), "ok");
assertEq("kk-4: 4095 (just under warn) → 'ok'", classifyStorageBytes(4095), "ok");
assertEq("kk-5: 4096 (at warn boundary) → 'warn'", classifyStorageBytes(4096), "warn");
assertEq("kk-6: 4097 → 'warn'", classifyStorageBytes(4097), "warn");
assertEq("kk-7: 8192 (8KB, mid-warn) → 'warn'", classifyStorageBytes(8192), "warn");
assertEq("kk-8: 16383 (just under danger) → 'warn'", classifyStorageBytes(16383), "warn");
assertEq("kk-9: 16384 (at danger boundary) → 'danger'", classifyStorageBytes(16384), "danger");
assertEq("kk-10: 16385 → 'danger'", classifyStorageBytes(16385), "danger");
assertEq("kk-11: 100_000 (way over) → 'danger'", classifyStorageBytes(100000), "danger");
assertEq("kk-12: 5_242_880 (5MB) → 'danger'", classifyStorageBytes(5_242_880), "danger");

// Defensive coercion: negative / NaN / Infinity all collapse to 'ok'
// rather than poisoning the className string.
assertEq("kk-13: -1 → 'ok' (defensive)", classifyStorageBytes(-1), "ok");
assertEq("kk-14: -100000 → 'ok' (defensive)", classifyStorageBytes(-100000), "ok");
assertEq("kk-15: NaN → 'ok' (defensive)", classifyStorageBytes(NaN), "ok");
assertEq("kk-16: Infinity → 'ok' (defensive — !isFinite)", classifyStorageBytes(Number.POSITIVE_INFINITY), "ok");
assertEq("kk-17: -Infinity → 'ok' (defensive — !isFinite)", classifyStorageBytes(Number.NEGATIVE_INFINITY), "ok");

// Fractional inputs — the comparison operators handle them naturally
// (4095.99 < 4096 → 'ok', 4096.01 ≥ 4096 → 'warn').
assertEq("kk-18: 4095.99 → 'ok'", classifyStorageBytes(4095.99), "ok");
assertEq("kk-19: 4096.01 → 'warn'", classifyStorageBytes(4096.01), "warn");

// Idempotent + pure (no mutation of the input number — primitives
// can't be mutated, but the assertion locks the no-side-effect
// expectation for future audits).
{
  const a = classifyStorageBytes(8192);
  const b = classifyStorageBytes(8192);
  assertEq("kk-20: classifyStorageBytes idempotent", a, b);
}

// Composition with formatStoredBytes — the pill consumes both, and
// they read the same byte count. Lock that identical inputs produce
// outputs consistent with one another (warn-tier inputs still format
// cleanly, danger-tier inputs still format cleanly).
{
  const labelWarn = formatStoredBytes(8192);
  const sevWarn = classifyStorageBytes(8192);
  assertEq("kk-21: 8192 formats as '8K'", labelWarn, "8K");
  assertEq("kk-22: 8192 classifies as 'warn'", sevWarn, "warn");
}
{
  const labelDanger = formatStoredBytes(20480);
  const sevDanger = classifyStorageBytes(20480);
  assertEq("kk-23: 20480 formats as '20K'", labelDanger, "20K");
  assertEq("kk-24: 20480 classifies as 'danger'", sevDanger, "danger");
}

// Threshold constants exposed correctly (cross-check with the lib).
assertEq("kk-25: warn threshold is 4096", STORAGE_BYTES_WARN_THRESHOLD, 4096);
assertEq("kk-26: danger threshold is 16384", STORAGE_BYTES_DANGER_THRESHOLD, 16384);

// Defense-in-depth — does not throw on edge inputs.
{
  let didThrow = false;
  try {
    classifyStorageBytes(NaN);
    classifyStorageBytes(Number.POSITIVE_INFINITY);
    classifyStorageBytes(-Infinity);
    classifyStorageBytes(0);
  } catch {
    didThrow = true;
  }
  assertEq("kk-27: classifyStorageBytes does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-fifth-pass chunk (mm): parseDragGhostFormat =============
//
// Validates a stored drag-ghost-format string against the enum. Falls
// back to "with-count" for null / non-matching / corruption.

function parseDragGhostFormat(raw) {
  if (raw === "with-count") return "with-count";
  if (raw === "no-count") return "no-count";
  if (raw === "count-only") return "count-only";
  return "with-count";
}

// Valid values pass through.
assertEq("mm-pf-1: 'with-count' literal", parseDragGhostFormat("with-count"), "with-count");
assertEq("mm-pf-2: 'no-count' literal", parseDragGhostFormat("no-count"), "no-count");
assertEq("mm-pf-3: 'count-only' literal", parseDragGhostFormat("count-only"), "count-only");

// Missing / empty / unknown all fall back to with-count.
assertEq("mm-pf-4: null fallback", parseDragGhostFormat(null), "with-count");
assertEq("mm-pf-5: empty string fallback", parseDragGhostFormat(""), "with-count");
assertEq("mm-pf-6: whitespace-only fallback", parseDragGhostFormat("   "), "with-count");
assertEq("mm-pf-7: case-strict 'No-Count' fallback", parseDragGhostFormat("No-Count"), "with-count");
assertEq("mm-pf-8: 'NO-COUNT' fallback", parseDragGhostFormat("NO-COUNT"), "with-count");
assertEq("mm-pf-9: underscore 'with_count' fallback", parseDragGhostFormat("with_count"), "with-count");
assertEq("mm-pf-10: 'something' fallback", parseDragGhostFormat("something"), "with-count");

// Corruption tolerance.
assertEq("mm-pf-11: '{}' fallback", parseDragGhostFormat("{}"), "with-count");
assertEq("mm-pf-12: '[]' fallback", parseDragGhostFormat("[]"), "with-count");
assertEq("mm-pf-13: JSON-quoted literal fallback", parseDragGhostFormat('"with-count"'), "with-count");
assertEq("mm-pf-14: 'true' fallback", parseDragGhostFormat("true"), "with-count");
assertEq("mm-pf-15: '1' fallback", parseDragGhostFormat("1"), "with-count");

// Idempotent.
{
  const a = parseDragGhostFormat("no-count");
  const b = parseDragGhostFormat("no-count");
  assertEq("mm-pf-16: idempotent (valid)", a, b);
}
{
  const a = parseDragGhostFormat("garbage");
  const b = parseDragGhostFormat("garbage");
  assertEq("mm-pf-17: idempotent (fallback)", a, b);
}

// Defense-in-depth: never throws.
{
  let didThrow = false;
  try {
    parseDragGhostFormat(null);
    parseDragGhostFormat("");
    parseDragGhostFormat("garbage");
    parseDragGhostFormat("with-count");
  } catch {
    didThrow = true;
  }
  assertEq("mm-pf-18: parseDragGhostFormat does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-fifth-pass chunk (mm): applyDragGhostFormat (also bench-
// tested in scripts/bench-tree-multi-keys.mjs alongside the
// buildDragGhostLabel helper; tests here cover the format-vs-output
// mapping against the lib's exact applyDragGhostFormat shape so a lib
// drift is caught here too).

function applyDragGhostFormat(tag, setSize, format) {
  const isMulti = setSize > 1;
  if (format === "count-only") {
    return isMulti ? `${setSize}` : "1";
  }
  if (format === "no-count") {
    return tag ? `<${tag}>` : isMulti ? `${setSize} elements` : "1 element";
  }
  if (!isMulti) {
    return tag ? `<${tag}>` : "1 element";
  }
  return tag ? `<${tag}> · ${setSize}` : `${setSize} elements`;
}

// with-count (default) — preserves historical strings.
assertEq("mm-af-1: with-count single tag", applyDragGhostFormat("div", 1, "with-count"), "<div>");
assertEq("mm-af-2: with-count multi tag", applyDragGhostFormat("div", 3, "with-count"), "<div> · 3");
assertEq("mm-af-3: with-count single null tag", applyDragGhostFormat(null, 1, "with-count"), "1 element");
assertEq("mm-af-4: with-count multi null tag", applyDragGhostFormat(null, 5, "with-count"), "5 elements");

// no-count — drops count from multi.
assertEq("mm-af-5: no-count single tag", applyDragGhostFormat("div", 1, "no-count"), "<div>");
assertEq("mm-af-6: no-count multi tag (count dropped)", applyDragGhostFormat("div", 3, "no-count"), "<div>");
assertEq("mm-af-7: no-count single null tag", applyDragGhostFormat(null, 1, "no-count"), "1 element");
assertEq("mm-af-8: no-count multi null tag fallback", applyDragGhostFormat(null, 5, "no-count"), "5 elements");

// count-only — numeric-only.
assertEq("mm-af-9: count-only single", applyDragGhostFormat("div", 1, "count-only"), "1");
assertEq("mm-af-10: count-only multi", applyDragGhostFormat("div", 3, "count-only"), "3");
assertEq("mm-af-11: count-only single null tag", applyDragGhostFormat(null, 1, "count-only"), "1");
assertEq("mm-af-12: count-only multi null tag", applyDragGhostFormat(null, 5, "count-only"), "5");

// setSize edge cases (defensive — buildDragGhostLabel folds these).
assertEq("mm-af-13: setSize 0 with-count → single tag", applyDragGhostFormat("div", 0, "with-count"), "<div>");
assertEq("mm-af-14: setSize 0 count-only → '1'", applyDragGhostFormat("div", 0, "count-only"), "1");
assertEq("mm-af-15: setSize -1 no-count → single tag", applyDragGhostFormat("div", -1, "no-count"), "<div>");
assertEq("mm-af-16: setSize 2 (boundary multi)", applyDragGhostFormat("div", 2, "with-count"), "<div> · 2");
assertEq("mm-af-17: setSize 1 (boundary single)", applyDragGhostFormat("div", 1, "with-count"), "<div>");

// Defense-in-depth: never throws across all format / tag / setSize
// permutations.
{
  let didThrow = false;
  try {
    for (const fmt of ["with-count", "no-count", "count-only", "garbage"]) {
      for (const tag of [null, "div", "MyComponent", ""]) {
        for (const sz of [-1, 0, 1, 2, 100]) {
          applyDragGhostFormat(tag, sz, fmt);
        }
      }
    }
  } catch {
    didThrow = true;
  }
  assertEq("mm-af-18: applyDragGhostFormat does not throw on permutations", didThrow, false);
}

// ===== Thirty-fourth-pass chunk (hh): parseSubtreeDepthCapOverride ====

const SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN = 10;
const SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX = 5000;

function parseSubtreeDepthCapOverride(raw, fallback) {
  if (raw === null) return fallback;
  if (raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  if (n < 0) return fallback;
  const floored = Math.floor(n);
  if (floored < SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN) {
    return SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN;
  }
  if (floored > SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX) {
    return SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX;
  }
  return floored;
}

assertEq("206: null → fallback (50)", parseSubtreeDepthCapOverride(null, 50), 50);
assertEq("207: '' → fallback", parseSubtreeDepthCapOverride("", 50), 50);
assertEq("208: '   ' → fallback", parseSubtreeDepthCapOverride("   ", 50), 50);
assertEq("209: 'foo' → fallback", parseSubtreeDepthCapOverride("foo", 50), 50);
assertEq("210: 'NaN' → fallback", parseSubtreeDepthCapOverride("NaN", 50), 50);
assertEq("211: 'Infinity' → fallback (not finite)", parseSubtreeDepthCapOverride("Infinity", 50), 50);
assertEq("212: '-1' → fallback (negative)", parseSubtreeDepthCapOverride("-1", 50), 50);
assertEq("213: '0' → clamp up to MIN (10)", parseSubtreeDepthCapOverride("0", 50), 10);
assertEq("214: '5' (below MIN) → clamp to MIN", parseSubtreeDepthCapOverride("5", 50), 10);
assertEq("215: '10' (at MIN) → 10", parseSubtreeDepthCapOverride("10", 50), 10);
assertEq("216: '100' (within range) → 100", parseSubtreeDepthCapOverride("100", 50), 100);
assertEq("217: '5000' (at MAX) → 5000", parseSubtreeDepthCapOverride("5000", 50), 5000);
assertEq("218: '6000' (above MAX) → clamp to MAX", parseSubtreeDepthCapOverride("6000", 50), 5000);
assertEq("219: '99999' (way over) → clamp to MAX", parseSubtreeDepthCapOverride("99999", 50), 5000);
assertEq("220: '50.7' (fractional within range) → 50 (floor)", parseSubtreeDepthCapOverride("50.7", 50), 50);
assertEq("221: '9.9' (fractional under MIN) → MIN (clamped after floor=9)", parseSubtreeDepthCapOverride("9.9", 50), 10);
assertEq("222: ' 50 ' (whitespace) → 50 (Number coerces)", parseSubtreeDepthCapOverride(" 50 ", 999), 50);
assertEq("223: '50\\n' → 50 (trailing newline)", parseSubtreeDepthCapOverride("50\n", 999), 50);

// Idempotent.
{
  const a = parseSubtreeDepthCapOverride("100", 50);
  const b = parseSubtreeDepthCapOverride("100", 50);
  assertEq("224: parseSubtreeDepthCapOverride idempotent", a, b);
}

// Defense-in-depth — never throws.
{
  let didThrow = false;
  try {
    parseSubtreeDepthCapOverride(" garbage", 50);
  } catch {
    didThrow = true;
  }
  assertEq("225: parseSubtreeDepthCapOverride does not throw on control chars", didThrow, false);
}

// ===== Thirty-fourth-pass chunk (hh): cap-aware parse/serialize =======

// Re-define with override-aware signatures matching the lib.
function parseStoredSubtreeDepthsCap(raw, maxEntries = SUBTREE_DEPTH_MAX_ENTRIES) {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const out = {};
    let count = 0;
    for (const k of Object.keys(parsed)) {
      if (count >= maxEntries) break;
      const v = parsed[k];
      if (typeof v !== "number") continue;
      if (!Number.isFinite(v)) continue;
      if (v < 0) continue;
      out[k] = Math.floor(v);
      count++;
    }
    return out;
  } catch {
    return null;
  }
}

function serializeStoredSubtreeDepthsCap(map, maxEntries = SUBTREE_DEPTH_MAX_ENTRIES) {
  const keys = Object.keys(map);
  if (keys.length <= maxEntries) {
    return JSON.stringify(map);
  }
  const trimmed = {};
  const startIdx = keys.length - maxEntries;
  for (let i = startIdx; i < keys.length; i++) {
    const k = keys[i];
    trimmed[k] = Math.floor(map[k]);
  }
  return JSON.stringify(trimmed);
}

// Build a 75-entry map.
{
  const m = {};
  for (let i = 0; i < 75; i++) m[`oid:${i}`] = i % 6;
  // Default cap (50) — keep tail.
  const r1 = JSON.parse(serializeStoredSubtreeDepthsCap(m));
  assertEq("226: serialize default cap=50 keeps 50 entries", Object.keys(r1).length, 50);
  // Override cap to 100 → all 75 fit.
  const r2 = JSON.parse(serializeStoredSubtreeDepthsCap(m, 100));
  assertEq("227: serialize override cap=100 keeps all 75", Object.keys(r2).length, 75);
  // Override cap to 25 → keep tail of 25.
  const r3 = JSON.parse(serializeStoredSubtreeDepthsCap(m, 25));
  assertEq("228: serialize override cap=25 keeps 25 entries", Object.keys(r3).length, 25);
  assertEq("229: cap=25 keeps tail (oid:74 present)", "oid:74" in r3, true);
  assertEq("230: cap=25 drops head (oid:0 absent)", "oid:0" in r3, false);
}

// Parse with override cap.
{
  const m = {};
  for (let i = 0; i < 75; i++) m[`oid:${i}`] = i % 6;
  const raw = JSON.stringify(m);
  // Default cap reads 50.
  const r1 = parseStoredSubtreeDepthsCap(raw);
  assertEq("231: parse default cap=50 reads 50 entries", Object.keys(r1).length, 50);
  // Override cap reads 100.
  const r2 = parseStoredSubtreeDepthsCap(raw, 100);
  assertEq("232: parse override cap=100 reads 75 entries", Object.keys(r2).length, 75);
  // Override cap reads 10 (extreme low).
  const r3 = parseStoredSubtreeDepthsCap(raw, 10);
  assertEq("233: parse override cap=10 reads 10 entries", Object.keys(r3).length, 10);
}

// Cap constants locked.
assertEq("234: SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN === 10", SUBTREE_DEPTH_CAP_USER_OVERRIDE_MIN, 10);
assertEq("235: SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX === 5000", SUBTREE_DEPTH_CAP_USER_OVERRIDE_MAX, 5000);

// ===== Thirty-fourth-pass chunk (ff): measureStoredTreeStateBytes =====
// Pure shape check — the impure walk is window-bound; the bench
// inlines the shape (`{ bytes, keyCount }`) to lock the contract.

function measureStoredTreeStateBytesShape(entries) {
  // entries is [[k, v], ...] simulating localStorage subset.
  let bytes = 0;
  let keyCount = 0;
  for (const [k, v] of entries) {
    if (!k.startsWith(KEY_NAMESPACE)) continue;
    if (v === null) continue;
    bytes += k.length + v.length;
    keyCount++;
  }
  return { bytes, keyCount };
}

{
  const r = measureStoredTreeStateBytesShape([]);
  assertEq("236: empty input → bytes=0", r.bytes, 0);
  assertEq("237: empty input → keyCount=0", r.keyCount, 0);
}

{
  const r = measureStoredTreeStateBytesShape([
    ["dropin:tree:depth:v1", "2"],
  ]);
  // key.length (20) + "2".length (1) = 21
  assertEq("238: single entry bytes count", r.bytes, 21);
  assertEq("239: single entry keyCount", r.keyCount, 1);
}

{
  const r = measureStoredTreeStateBytesShape([
    ["dropin:tree:depth:v1", "2"],
    ["dropin:tree:query:v1", "div"],
    ["unrelated:auth-token", "abc"],
    ["dropin:tree:expanded:v1", JSON.stringify(["a", "b"])],
  ]);
  assertEq("240: filters off-namespace keys (3 of 4 counted)", r.keyCount, 3);
  // 20+1 + 20+3 + 23 + 9 = 76
  assertEq("241: bytes only includes namespace entries", r.bytes, 21 + 23 + 23 + 9);
}

{
  const r = measureStoredTreeStateBytesShape([
    ["dropin:tree:depth:v1", null],
  ]);
  // null value (key was removed mid-iteration) is skipped.
  assertEq("242: null value skipped", r.keyCount, 0);
  assertEq("243: null value contributes 0 bytes", r.bytes, 0);
}

// ===== Thirty-fourth-pass chunk (ff): predictStoredTreeStateBytes ====
// Pure form mirroring the lib's gating rules. Pure helper so the
// bench can lock semantics without simulating localStorage.

const KEY_DEPTH = `dropin:tree:depth:v${STORAGE_SCHEMA_VERSION}`;
const KEY_QUERY = `dropin:tree:query:v${STORAGE_SCHEMA_VERSION}`;
const KEY_EXPANDED = `dropin:tree:expanded:v${STORAGE_SCHEMA_VERSION}`;
const KEY_SUBTREE_DEPTHS = `dropin:tree:subtree-depths:v${STORAGE_SCHEMA_VERSION}`;

function predictStoredTreeStateBytes(args) {
  let bytes = 0;
  let keyCount = 0;
  const depthVal = serializeStoredDepth(args.lastAppliedDepth);
  bytes += KEY_DEPTH.length + depthVal.length;
  keyCount++;
  if (args.query.length > 0) {
    const clamped =
      args.query.length > QUERY_MAX_LEN
        ? args.query.slice(0, QUERY_MAX_LEN)
        : args.query;
    bytes += KEY_QUERY.length + clamped.length;
    keyCount++;
  }
  // Expanded — only in manual mode AND non-empty.
  if (args.lastAppliedDepth === null && args.expanded.size > 0) {
    const arr = Array.from(args.expanded);
    const capped =
      arr.length > EXPANDED_MAX_ENTRIES ? arr.slice(0, EXPANDED_MAX_ENTRIES) : arr;
    const expandedVal = JSON.stringify(capped);
    bytes += KEY_EXPANDED.length + expandedVal.length;
    keyCount++;
  }
  if (Object.keys(args.subtreeDepths).length > 0) {
    const sdVal = serializeStoredSubtreeDepths(args.subtreeDepths);
    bytes += KEY_SUBTREE_DEPTHS.length + sdVal.length;
    keyCount++;
  }
  return { bytes, keyCount };
}

// Default state — only depth key contributes (depth always written).
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: 2,
    query: "",
    expanded: new Set(),
    subtreeDepths: {},
  });
  // KEY_DEPTH = "dropin:tree:depth:v1" (20) + "2" (1) = 21
  assertEq("264: default state — depth key only (1)", r.keyCount, 1);
  assertEq("265: default state — bytes = 21", r.bytes, 21);
}

// Manual mode (depth=null) + empty expanded — only depth key.
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: null,
    query: "",
    expanded: new Set(),
    subtreeDepths: {},
  });
  // depth "null" (4) + KEY_DEPTH (20) = 24
  assertEq("266: manual mode empty expanded — keyCount 1", r.keyCount, 1);
  assertEq("267: manual mode empty expanded — bytes 24", r.bytes, 24);
}

// Depth + query.
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: 2,
    query: "div",
    expanded: new Set(),
    subtreeDepths: {},
  });
  // depth: 21 + query: KEY_QUERY (20) + "div" (3) = 23 → 44
  assertEq("268: depth + query — keyCount 2", r.keyCount, 2);
  assertEq("269: depth + query — bytes 44", r.bytes, 44);
}

// Manual mode + non-empty expanded.
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: null,
    query: "",
    expanded: new Set(["oid:a", "oid:b"]),
    subtreeDepths: {},
  });
  // depth: 24 + expanded: KEY_EXPANDED (23) + JSON ["oid:a","oid:b"] (17) = 40 → 64
  assertEq("270: manual mode + 2 expanded — keyCount 2", r.keyCount, 2);
  assertEq("271: manual mode + 2 expanded — bytes 64", r.bytes, 64);
}

// Depth-mode + non-empty expanded → expanded SKIPPED (depth-mode
// doesn't persist expanded).
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: 2,
    query: "",
    expanded: new Set(["oid:a", "oid:b"]),
    subtreeDepths: {},
  });
  // Only depth contributes; expanded is gated out.
  assertEq("272: depth-mode + expanded — expanded skipped (keyCount 1)", r.keyCount, 1);
  assertEq("273: depth-mode + expanded — bytes 21", r.bytes, 21);
}

// SubtreeDepths.
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: 2,
    query: "",
    expanded: new Set(),
    subtreeDepths: { "oid:a": 3 },
  });
  // depth: 21 + subtree: KEY_SUBTREE_DEPTHS (29) + JSON {"oid:a":3} (11) = 40 → 61
  assertEq("274: depth + subtreeDepths — keyCount 2", r.keyCount, 2);
  assertEq("275: depth + subtreeDepths — bytes 61", r.bytes, 61);
}

// All four slices contribute.
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: null,
    query: "div",
    expanded: new Set(["oid:a"]),
    subtreeDepths: { "oid:a": 3 },
  });
  // depth: KEY_DEPTH (20) + "null" (4) = 24
  // query: KEY_QUERY (20) + "div" (3) = 23
  // expanded: KEY_EXPANDED (23) + ["oid:a"] (9) = 32
  // subtree: KEY_SUBTREE_DEPTHS (29) + {"oid:a":3} (11) = 40
  // Total: 119
  assertEq("276: all four slices — keyCount 4", r.keyCount, 4);
  assertEq("277: all four slices — bytes 119", r.bytes, 119);
}

// Infinity depth sentinel.
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: Number.POSITIVE_INFINITY,
    query: "",
    expanded: new Set(),
    subtreeDepths: {},
  });
  // depth: KEY_DEPTH (20) + "Infinity" (8) = 28
  assertEq("278: Infinity depth — keyCount 1", r.keyCount, 1);
  assertEq("279: Infinity depth — bytes 28", r.bytes, 28);
}

// Query length cap respected (clamped to 256).
{
  const r = predictStoredTreeStateBytes({
    lastAppliedDepth: 2,
    query: "x".repeat(300),
    expanded: new Set(),
    subtreeDepths: {},
  });
  // depth: 21 + query: KEY_QUERY (20) + 256 (cap) = 276 → 297
  assertEq("280: query length cap respected", r.bytes, 21 + 20 + 256);
}

// Idempotent — same input → same output.
{
  const args = {
    lastAppliedDepth: 2,
    query: "div",
    expanded: new Set(["oid:a"]),
    subtreeDepths: { "oid:a": 3 },
  };
  const a = predictStoredTreeStateBytes(args);
  const b = predictStoredTreeStateBytes(args);
  assertEq("281: predict idempotent (bytes)", a.bytes, b.bytes);
  assertEq("282: predict idempotent (keyCount)", a.keyCount, b.keyCount);
}

// Pure no-mutation.
{
  const args = {
    lastAppliedDepth: 2,
    query: "div",
    expanded: new Set(["oid:a"]),
    subtreeDepths: { "oid:a": 3 },
  };
  predictStoredTreeStateBytes(args);
  assertEq("283: pure: query not mutated", args.query, "div");
  assertEq("284: pure: expanded not mutated", args.expanded.size, 1);
  assertEq("285: pure: subtreeDepths not mutated", Object.keys(args.subtreeDepths).length, 1);
}

// ===== Thirty-fourth-pass chunk (ii): migrator preserves unversioned ===

// Inlined migrator logic mirroring lib/tree-persistence.ts. Operates on
// an entries array (simulating localStorage) instead of touching window.
function migrateEntries(entries) {
  const out = [];
  let removed = 0;
  for (const [k, v] of entries) {
    if (!k.startsWith(KEY_NAMESPACE)) {
      out.push([k, v]);
      continue;
    }
    const version = parseSchemaVersionFromKey(k);
    // Chunk (ii) — preserve unversioned legacy keys.
    if (version === null) {
      out.push([k, v]);
      continue;
    }
    if (version === STORAGE_SCHEMA_VERSION) {
      out.push([k, v]);
      continue;
    }
    removed++;
  }
  return { out, removed };
}

// Pre-fix bug repro: rail-width preserved.
{
  const r = migrateEntries([
    ["dropin:tree:width", "240"],
    ["dropin:tree:depth:v1", "2"],
  ]);
  assertEq("244: unversioned dropin:tree:width survives migration", r.removed, 0);
  assertEq("245: unversioned width key still present", r.out.find(([k]) => k === "dropin:tree:width") !== undefined, true);
  assertEq("246: versioned depth key still present", r.out.find(([k]) => k === "dropin:tree:depth:v1") !== undefined, true);
}

// Off-namespace keys untouched.
{
  const r = migrateEntries([
    ["unrelated:auth", "xyz"],
    ["dropin:tree:width", "240"],
  ]);
  assertEq("247: off-namespace key preserved", r.out.length, 2);
  assertEq("248: off-namespace not counted in removed", r.removed, 0);
}

// Version mismatch: gets removed.
{
  const r = migrateEntries([
    ["dropin:tree:depth:v0", "2"],
    ["dropin:tree:depth:v999", "5"],
    ["dropin:tree:depth:v1", "3"],
  ]);
  assertEq("249: v0 + v999 entries removed (version mismatch)", r.removed, 2);
  assertEq("250: only v1 survives", r.out.length, 1);
  assertEq("251: v1 entry preserved", r.out[0][0], "dropin:tree:depth:v1");
}

// Mixed: unversioned + matched + mismatched.
{
  const r = migrateEntries([
    ["dropin:tree:width", "240"],
    ["dropin:tree:open", "true"],
    ["dropin:tree:depth:v1", "2"],
    ["dropin:tree:depth:v2", "3"],
    ["dropin:tree:expanded:v1", "[]"],
    ["dropin:tree:expanded:v3", "[\"oid:x\"]"],
    ["dropin:tree:subtree-depths:v1", "{}"],
    ["unrelated", "xx"],
  ]);
  assertEq("252: mixed migration removes only mismatched versions", r.removed, 2);
  assertEq("253: mixed migration preserves unversioned (width)", r.out.find(([k]) => k === "dropin:tree:width") !== undefined, true);
  assertEq("254: mixed migration preserves unversioned (open)", r.out.find(([k]) => k === "dropin:tree:open") !== undefined, true);
  assertEq("255: mixed migration drops v2 depth", r.out.find(([k]) => k === "dropin:tree:depth:v2"), undefined);
  assertEq("256: mixed migration drops v3 expanded", r.out.find(([k]) => k === "dropin:tree:expanded:v3"), undefined);
}

// Idempotent: rerunning migration on already-clean entries removes nothing.
{
  const first = migrateEntries([
    ["dropin:tree:depth:v0", "2"],
    ["dropin:tree:depth:v1", "3"],
  ]);
  const second = migrateEntries(first.out);
  assertEq("257: migrator idempotent — second pass removes 0", second.removed, 0);
  assertEq("258: migrator idempotent — entry count stable", second.out.length, first.out.length);
}

// Edge case: empty entries list.
{
  const r = migrateEntries([]);
  assertEq("259: empty input → no removals", r.removed, 0);
  assertEq("260: empty input → empty output", r.out.length, 0);
}

// Edge case: bare "dropin:tree:" prefix with no body.
{
  const r = migrateEntries([
    ["dropin:tree:", "garbage"],
  ]);
  // No `:vN` suffix → version === null → preserved.
  assertEq("261: bare prefix key preserved (unversioned)", r.removed, 0);
}

// Edge case: cap-override key (chunk hh) is unversioned-suffixed
// (`:v1`) so survives migration.
{
  const r = migrateEntries([
    ["dropin:tree:cap-subtree-depths:v1", "100"],
  ]);
  assertEq("262: chunk-hh cap-override key survives (versioned :v1)", r.removed, 0);
  assertEq("263: chunk-hh key still present", r.out[0][0], "dropin:tree:cap-subtree-depths:v1");
}

// ===== Thirty-fifth-pass chunk (nn): describeStoredTreeStateEntries +
//       shortNameForStoredKey ============================================

function describeStoredTreeStateEntries(entries) {
  const out = [];
  for (const [k, v] of entries) {
    if (!k.startsWith(KEY_NAMESPACE)) continue;
    out.push({ key: k, value: v, bytes: k.length + v.length });
  }
  out.sort((a, b) => {
    if (a.bytes !== b.bytes) return b.bytes - a.bytes;
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
  return out;
}

function shortNameForStoredKey(key) {
  if (!key.startsWith(KEY_NAMESPACE)) return key;
  const tail = key.slice(KEY_NAMESPACE.length);
  const m = /^(.+):v\d+$/.exec(tail);
  return m ? m[1] : tail;
}

// describeStoredTreeStateEntries — namespace filter.
{
  const r = describeStoredTreeStateEntries([
    ["dropin:tree:depth:v1", "3"],
    ["unrelated", "x"],
    ["dropin:tree:expanded:v1", "[\"oid:a\"]"],
  ]);
  assertEq("nn-1: namespace filter rejects unrelated", r.length, 2);
  assertEq("nn-2: filter preserved depth key", r.find((e) => e.key === "dropin:tree:depth:v1") !== undefined, true);
  assertEq("nn-3: filter preserved expanded key", r.find((e) => e.key === "dropin:tree:expanded:v1") !== undefined, true);
  assertEq("nn-4: filter dropped unrelated key", r.find((e) => e.key === "unrelated"), undefined);
}

// describeStoredTreeStateEntries — bytes are key.length + value.length.
{
  const r = describeStoredTreeStateEntries([
    ["dropin:tree:depth:v1", "3"],
  ]);
  assertEq("nn-5: bytes is key.length + value.length", r[0].bytes, "dropin:tree:depth:v1".length + 1);
}

// describeStoredTreeStateEntries — sort by descending byte cost.
{
  const r = describeStoredTreeStateEntries([
    ["dropin:tree:depth:v1", "3"],
    ["dropin:tree:expanded:v1", JSON.stringify(["oid:a", "oid:b", "oid:c"])],
    ["dropin:tree:query:v1", "search-text"],
  ]);
  assertEq("nn-6: sort by descending byte cost", r[0].key, "dropin:tree:expanded:v1");
  // Verify monotonic decrease.
  let monotonic = true;
  for (let i = 1; i < r.length; i++) {
    if (r[i - 1].bytes < r[i].bytes) { monotonic = false; break; }
  }
  assertEq("nn-7: result monotonically non-increasing", monotonic, true);
}

// describeStoredTreeStateEntries — alphabetic tie-break.
{
  const r = describeStoredTreeStateEntries([
    ["dropin:tree:b:v1", "x"],
    ["dropin:tree:a:v1", "x"],
    ["dropin:tree:c:v1", "x"],
  ]);
  // All bytes equal; sort by key ASC.
  assertEq("nn-8: tie-break alphabetic ASC (a)", r[0].key, "dropin:tree:a:v1");
  assertEq("nn-9: tie-break alphabetic ASC (b)", r[1].key, "dropin:tree:b:v1");
  assertEq("nn-10: tie-break alphabetic ASC (c)", r[2].key, "dropin:tree:c:v1");
}

// describeStoredTreeStateEntries — empty input.
assertEq("nn-11: empty input → empty output", describeStoredTreeStateEntries([]).length, 0);

// describeStoredTreeStateEntries — all unrelated → empty.
{
  const r = describeStoredTreeStateEntries([
    ["unrelated-1", "x"],
    ["foo", "y"],
    ["bar:baz", "z"],
  ]);
  assertEq("nn-12: all-unrelated input → empty", r.length, 0);
}

// shortNameForStoredKey — versioned + unversioned + non-namespace.
assertEq("nn-13: depth:v1 → 'depth'", shortNameForStoredKey("dropin:tree:depth:v1"), "depth");
assertEq("nn-14: query:v1 → 'query'", shortNameForStoredKey("dropin:tree:query:v1"), "query");
assertEq("nn-15: subtree-depths:v1 → 'subtree-depths'", shortNameForStoredKey("dropin:tree:subtree-depths:v1"), "subtree-depths");
assertEq("nn-16: cap-subtree-depths:v1 → 'cap-subtree-depths'", shortNameForStoredKey("dropin:tree:cap-subtree-depths:v1"), "cap-subtree-depths");
assertEq("nn-17: expanded:v1 → 'expanded'", shortNameForStoredKey("dropin:tree:expanded:v1"), "expanded");
assertEq("nn-18: width (unversioned) → 'width'", shortNameForStoredKey("dropin:tree:width"), "width");
assertEq("nn-19: open (unversioned) → 'open'", shortNameForStoredKey("dropin:tree:open"), "open");
assertEq("nn-20: drag-ghost-format:v1 → 'drag-ghost-format'", shortNameForStoredKey("dropin:tree:drag-ghost-format:v1"), "drag-ghost-format");
assertEq("nn-21: non-namespace key returned as-is", shortNameForStoredKey("unrelated"), "unrelated");
assertEq("nn-22: empty string returned as-is", shortNameForStoredKey(""), "");

// shortNameForStoredKey — multi-digit version suffix.
assertEq("nn-23: depth:v12 → 'depth' (multi-digit version)", shortNameForStoredKey("dropin:tree:depth:v12"), "depth");
assertEq("nn-24: depth:v999 → 'depth'", shortNameForStoredKey("dropin:tree:depth:v999"), "depth");

// shortNameForStoredKey — colons inside name preserved.
assertEq("nn-25: deep:nested:name:v1 → 'deep:nested:name'", shortNameForStoredKey("dropin:tree:deep:nested:name:v1"), "deep:nested:name");

// describeStoredTreeStateEntries — pure (no input mutation).
{
  const input = [
    ["dropin:tree:depth:v1", "3"],
    ["dropin:tree:query:v1", "x"],
  ];
  const inputCopy = input.map(([k, v]) => [k, v]);
  describeStoredTreeStateEntries(input);
  assertEq("nn-26: input array length unchanged", input.length, inputCopy.length);
  assertEq("nn-27: input order unchanged", input[0][0], inputCopy[0][0]);
  assertEq("nn-28: input second order unchanged", input[1][0], inputCopy[1][0]);
}

// describeStoredTreeStateEntries — idempotent.
{
  const input = [
    ["dropin:tree:depth:v1", "3"],
    ["dropin:tree:query:v1", "abc"],
  ];
  const a = JSON.stringify(describeStoredTreeStateEntries(input));
  const b = JSON.stringify(describeStoredTreeStateEntries(input));
  assertEq("nn-29: describeStoredTreeStateEntries idempotent", a, b);
}

// shortNameForStoredKey — idempotent (re-running on output of prior
// call should be a no-op).
{
  const stage1 = shortNameForStoredKey("dropin:tree:depth:v1");
  const stage2 = shortNameForStoredKey(stage1);
  // Stage 1 returns "depth", which lacks the namespace prefix → stage 2
  // returns "depth" unchanged (passthrough rule).
  assertEq("nn-30: shortNameForStoredKey passthrough on already-short", stage2, "depth");
}

// Defense-in-depth — never throws on edge inputs.
{
  let didThrow = false;
  try {
    describeStoredTreeStateEntries([]);
    describeStoredTreeStateEntries([["", ""]]);
    describeStoredTreeStateEntries([["dropin:tree:x", ""]]);
    shortNameForStoredKey("");
    shortNameForStoredKey("dropin:tree:x:v1");
    shortNameForStoredKey("garbage");
  } catch {
    didThrow = true;
  }
  assertEq("nn-31: chunk-nn helpers do not throw on edge inputs", didThrow, false);
}

// ===== Thirty-sixth-pass chunk (rr): user-overridable warn/danger
//       thresholds + classifier-with-options ===========================
// Reuses the chunk-kk `STORAGE_BYTES_WARN_THRESHOLD` / `_DANGER_` /
// `classifyStorageBytes` declarations above (which were upgraded to
// the options-aware shape for chunk-rr).

const STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN = 256;
const STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX = 1024 * 1024;

function parseStorageBytesThresholdOverride(raw, fallback) {
  if (raw === null) return fallback;
  if (raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  if (n < 0) return fallback;
  const floored = Math.floor(n);
  if (floored < STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN) {
    return STORAGE_BYTES_THRESHOLD_OVERRIDE_MIN;
  }
  if (floored > STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX) {
    return STORAGE_BYTES_THRESHOLD_OVERRIDE_MAX;
  }
  return floored;
}

// classifyStorageBytes — defaults preserved.
assertEq("rr-1: 0 bytes → ok (default thresholds)", classifyStorageBytes(0), "ok");
assertEq("rr-2: 1 byte → ok", classifyStorageBytes(1), "ok");
assertEq("rr-3: 4095 bytes → ok (just under warn)", classifyStorageBytes(4095), "ok");
assertEq("rr-4: 4096 bytes → warn (at warn)", classifyStorageBytes(4096), "warn");
assertEq("rr-5: 8192 bytes → warn (mid-tier)", classifyStorageBytes(8192), "warn");
assertEq("rr-6: 16383 bytes → warn (just under danger)", classifyStorageBytes(16383), "warn");
assertEq("rr-7: 16384 bytes → danger (at danger)", classifyStorageBytes(16384), "danger");
assertEq("rr-8: 100000 bytes → danger (way over)", classifyStorageBytes(100000), "danger");

// classifyStorageBytes — defensive coercion preserved.
assertEq("rr-9: NaN → ok", classifyStorageBytes(NaN), "ok");
assertEq("rr-10: -1 → ok (negative folds to ok)", classifyStorageBytes(-1), "ok");
assertEq("rr-11: Infinity → ok (non-finite folds to ok)", classifyStorageBytes(Infinity), "ok");
assertEq("rr-12: -Infinity → ok", classifyStorageBytes(-Infinity), "ok");

// classifyStorageBytes — override thresholds.
assertEq("rr-13: 1000 bytes with warn=512 → warn", classifyStorageBytes(1000, { warnAt: 512 }), "warn");
assertEq("rr-14: 1000 bytes with danger=2048 → ok (under default warn=4096? NO — explicit warnAt unset uses default; 1000 < 4096 so ok)", classifyStorageBytes(1000, { dangerAt: 2048 }), "ok");
assertEq("rr-15: 3000 bytes with both warn=2048 + danger=8192 → warn", classifyStorageBytes(3000, { warnAt: 2048, dangerAt: 8192 }), "warn");
assertEq("rr-16: 9000 bytes with warn=2048 + danger=8192 → danger", classifyStorageBytes(9000, { warnAt: 2048, dangerAt: 8192 }), "danger");
assertEq("rr-17: 100 bytes with warn=2048 + danger=8192 → ok", classifyStorageBytes(100, { warnAt: 2048, dangerAt: 8192 }), "ok");

// classifyStorageBytes — degenerate warn >= danger (configuration error
// or DevTools mishap). The classifier MUST still surface the danger
// signal at high bytes, and degrade warn to ok (warn is unreachable).
// Inverted thresholds (warn >= danger): bytes > danger trigger danger
// regardless; bytes between (default ordering would be "warn") fall to
// ok because warn < danger fails.
assertEq("rr-18: warn=8192, danger=4096 — 5000 → danger (above danger)", classifyStorageBytes(5000, { warnAt: 8192, dangerAt: 4096 }), "danger");
assertEq("rr-19: warn=8192, danger=4096 — 4096 → danger (still triggers)", classifyStorageBytes(4096, { warnAt: 8192, dangerAt: 4096 }), "danger");
assertEq("rr-20: warn===danger (4096) — 4096 → danger (warn unreachable since warn<danger fails)", classifyStorageBytes(4096, { warnAt: 4096, dangerAt: 4096 }), "danger");
assertEq("rr-21: warn===danger — 4095 → ok (under both)", classifyStorageBytes(4095, { warnAt: 4096, dangerAt: 4096 }), "ok");

// classifyStorageBytes — partial options (one threshold overridden, one default).
assertEq("rr-22: warn=512 + default danger — 8000 → warn", classifyStorageBytes(8000, { warnAt: 512 }), "warn");
assertEq("rr-23: warn=512 + default danger — 100000 → danger", classifyStorageBytes(100000, { warnAt: 512 }), "danger");
assertEq("rr-24: default warn + danger=2048 — 1000 → ok (1000 < default warn 4096)", classifyStorageBytes(1000, { dangerAt: 2048 }), "ok");
assertEq("rr-25: default warn + danger=2048 — 5000 → danger (5000 >= 2048; warn defaulted to 4096 < 2048 is FALSE so warn unreachable)", classifyStorageBytes(5000, { dangerAt: 2048 }), "danger");
// rr-25 explanation: with dangerAt=2048 and warnAt=4096 (default), the
// degenerate condition warnAt >= dangerAt holds (4096 >= 2048), so warn
// is unreachable; bytes >= dangerAt routes straight to danger.

// parseStorageBytesThresholdOverride — null / empty / fallback.
assertEq("rr-26: null → fallback (4096)", parseStorageBytesThresholdOverride(null, 4096), 4096);
assertEq("rr-27: empty string → fallback", parseStorageBytesThresholdOverride("", 4096), 4096);
assertEq("rr-28: whitespace-only → fallback", parseStorageBytesThresholdOverride("   ", 4096), 4096);

// parseStorageBytesThresholdOverride — corrupt / non-numeric.
assertEq("rr-29: 'foo' → fallback", parseStorageBytesThresholdOverride("foo", 4096), 4096);
assertEq("rr-30: 'NaN' → fallback", parseStorageBytesThresholdOverride("NaN", 4096), 4096);
assertEq("rr-31: 'Infinity' → fallback (not finite)", parseStorageBytesThresholdOverride("Infinity", 4096), 4096);
assertEq("rr-32: 'undefined' → fallback", parseStorageBytesThresholdOverride("undefined", 4096), 4096);

// parseStorageBytesThresholdOverride — negative → fallback.
assertEq("rr-33: '-1' → fallback (negatives invalid)", parseStorageBytesThresholdOverride("-1", 4096), 4096);
assertEq("rr-34: '-100000' → fallback", parseStorageBytesThresholdOverride("-100000", 4096), 4096);

// parseStorageBytesThresholdOverride — clamping.
assertEq("rr-35: '0' → MIN (256)", parseStorageBytesThresholdOverride("0", 4096), 256);
assertEq("rr-36: '100' → MIN (below floor)", parseStorageBytesThresholdOverride("100", 4096), 256);
assertEq("rr-37: '256' → 256 (at-floor)", parseStorageBytesThresholdOverride("256", 4096), 256);
assertEq("rr-38: '512' → 512 (in-range)", parseStorageBytesThresholdOverride("512", 4096), 512);
assertEq("rr-39: '4096' → 4096 (in-range)", parseStorageBytesThresholdOverride("4096", 4096), 4096);
assertEq("rr-40: '1048576' → 1048576 (at-ceiling)", parseStorageBytesThresholdOverride("1048576", 4096), 1048576);
assertEq("rr-41: '2000000' → MAX (above ceiling)", parseStorageBytesThresholdOverride("2000000", 4096), 1048576);

// parseStorageBytesThresholdOverride — fractional → floor.
assertEq("rr-42: '512.7' → 512 (floor)", parseStorageBytesThresholdOverride("512.7", 4096), 512);
assertEq("rr-43: '4096.99' → 4096 (floor)", parseStorageBytesThresholdOverride("4096.99", 4096), 4096);

// parseStorageBytesThresholdOverride — whitespace tolerance.
assertEq("rr-44: ' 512 ' → 512 (Number coerces)", parseStorageBytesThresholdOverride(" 512 ", 4096), 512);

// parseStorageBytesThresholdOverride — defense-in-depth.
{
  let didThrow = false;
  try {
    parseStorageBytesThresholdOverride(null, 0);
    parseStorageBytesThresholdOverride("", 0);
    parseStorageBytesThresholdOverride("garbage", 0);
    parseStorageBytesThresholdOverride("100000000", 0);
    classifyStorageBytes(0);
    classifyStorageBytes(NaN, { warnAt: NaN, dangerAt: NaN });
    classifyStorageBytes(0, { warnAt: 0, dangerAt: 0 });
  } catch {
    didThrow = true;
  }
  assertEq("rr-45: chunk-rr helpers do not throw on edge inputs", didThrow, false);
}

// ===== Thirty-sixth-pass chunk (qq): describeAllStoredEntries +
//       categorizeStoredKey ============================================

function categorizeStoredKey(key) {
  if (key.startsWith(KEY_NAMESPACE)) return "tree";
  if (key.startsWith("dropin:")) return "dropin";
  return "other";
}

function describeAllStoredEntries(entries) {
  const out = [];
  for (const [k, v] of entries) {
    out.push({
      key: k,
      value: v,
      bytes: k.length + v.length,
      category: categorizeStoredKey(k),
    });
  }
  out.sort((a, b) => {
    if (a.bytes !== b.bytes) return b.bytes - a.bytes;
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
  return out;
}

// categorizeStoredKey — exact namespace match.
assertEq("qq-1: 'dropin:tree:depth:v1' → tree", categorizeStoredKey("dropin:tree:depth:v1"), "tree");
assertEq("qq-2: 'dropin:tree:width' → tree (unversioned)", categorizeStoredKey("dropin:tree:width"), "tree");
assertEq("qq-3: 'dropin:tree:' → tree (bare prefix)", categorizeStoredKey("dropin:tree:"), "tree");

// categorizeStoredKey — dropin-but-not-tree.
assertEq("qq-4: 'dropin:tour-completed-v2' → dropin", categorizeStoredKey("dropin:tour-completed-v2"), "dropin");
assertEq("qq-5: 'dropin:foo' → dropin", categorizeStoredKey("dropin:foo"), "dropin");
assertEq("qq-6: 'dropin:' → dropin (bare prefix; tree more specific)", categorizeStoredKey("dropin:"), "dropin");

// categorizeStoredKey — other namespaces.
assertEq("qq-7: 'auth-token' → other", categorizeStoredKey("auth-token"), "other");
assertEq("qq-8: 'react-devtools' → other", categorizeStoredKey("react-devtools"), "other");
assertEq("qq-9: '' → other (empty key)", categorizeStoredKey(""), "other");
assertEq("qq-10: 'Dropin:tree:foo' → other (case-sensitive)", categorizeStoredKey("Dropin:tree:foo"), "other");

// describeAllStoredEntries — basic categorization.
{
  const r = describeAllStoredEntries([
    ["dropin:tree:depth:v1", "3"],
    ["dropin:tour-completed-v2", "true"],
    ["auth-token", "abc"],
  ]);
  assertEq("qq-11: 3 entries categorized", r.length, 3);
  assertEq("qq-12: tree entry has tree category", r.find((e) => e.key === "dropin:tree:depth:v1").category, "tree");
  assertEq("qq-13: dropin entry has dropin category", r.find((e) => e.key === "dropin:tour-completed-v2").category, "dropin");
  assertEq("qq-14: other entry has other category", r.find((e) => e.key === "auth-token").category, "other");
}

// describeAllStoredEntries — DOES NOT filter by namespace (counter to nn).
{
  const r = describeAllStoredEntries([
    ["unrelated", "x"],
    ["dropin:tree:depth:v1", "3"],
  ]);
  assertEq("qq-15: unrelated entry preserved (no namespace filter)", r.length, 2);
  assertEq("qq-16: unrelated entry has other category", r.find((e) => e.key === "unrelated").category, "other");
}

// describeAllStoredEntries — sort by descending bytes.
{
  const r = describeAllStoredEntries([
    ["short", "x"],
    ["dropin:tree:expanded:v1", JSON.stringify(["oid:a", "oid:b", "oid:c"])],
    ["medium", "value"],
  ]);
  assertEq("qq-17: heaviest first", r[0].key, "dropin:tree:expanded:v1");
  let monotonic = true;
  for (let i = 1; i < r.length; i++) {
    if (r[i - 1].bytes < r[i].bytes) { monotonic = false; break; }
  }
  assertEq("qq-18: bytes monotonically descending", monotonic, true);
}

// describeAllStoredEntries — alphabetic tie-break.
{
  const r = describeAllStoredEntries([
    ["zzz", "x"],
    ["aaa", "x"],
    ["mmm", "x"],
  ]);
  // All three same byte count (3 + 1 = 4) — tie-break alphabetic ascending.
  assertEq("qq-19: tie-break first alphabetic", r[0].key, "aaa");
  assertEq("qq-20: tie-break second alphabetic", r[1].key, "mmm");
  assertEq("qq-21: tie-break third alphabetic", r[2].key, "zzz");
}

// describeAllStoredEntries — empty input.
{
  const r = describeAllStoredEntries([]);
  assertEq("qq-22: empty input → empty output", r.length, 0);
}

// describeAllStoredEntries — bytes formula matches nn helper.
{
  const r = describeAllStoredEntries([["abc", "xy"]]);
  assertEq("qq-23: bytes = key.length + value.length", r[0].bytes, 5);
}

// describeAllStoredEntries — pure (no input mutation).
{
  const input = [
    ["dropin:tree:depth:v1", "3"],
    ["unrelated", "x"],
  ];
  const inputCopy = input.map(([k, v]) => [k, v]);
  describeAllStoredEntries(input);
  assertEq("qq-24: input length unchanged", input.length, inputCopy.length);
  assertEq("qq-25: input order unchanged", input[0][0], inputCopy[0][0]);
}

// describeAllStoredEntries — idempotent.
{
  const input = [
    ["dropin:tree:depth:v1", "3"],
    ["unrelated", "x"],
  ];
  const a = JSON.stringify(describeAllStoredEntries(input));
  const b = JSON.stringify(describeAllStoredEntries(input));
  assertEq("qq-26: idempotent", a, b);
}

// describeAllStoredEntries — returns fresh array each call.
{
  const input = [["a", "b"]];
  const r1 = describeAllStoredEntries(input);
  const r2 = describeAllStoredEntries(input);
  assertEq("qq-27: returns fresh array (different references)", r1 === r2, false);
}

// describeAllStoredEntries — defense-in-depth.
{
  let didThrow = false;
  try {
    describeAllStoredEntries([]);
    describeAllStoredEntries([["", ""]]);
    describeAllStoredEntries([["a", ""]]);
    categorizeStoredKey("");
    categorizeStoredKey("dropin:tree:foo:v1");
    categorizeStoredKey("garbage");
  } catch {
    didThrow = true;
  }
  assertEq("qq-28: chunk-qq helpers do not throw on edge inputs", didThrow, false);
}

// ===== Thirty-sixth-pass chunk (jj): writeSubtreeDepthCapOverride
//       behavior (semantics — actual storage write tested via wrapper) ===

// Pure-logic reproduction of the writer's gating rules. The writer is
// SSR-safe + try/catch; the bench captures the decision tree (when to
// removeItem vs setItem vs no-op).
function shouldRemoveCapKey(value, defaultValue) {
  if (value === null) return true;
  if (value === defaultValue) return true;
  return false;
}

function shouldSkipCapWrite(value) {
  if (!Number.isFinite(value)) return true;
  if (value < 0) return true;
  return false;
}

assertEq("jj-1: null → removeItem (default-equivalence)", shouldRemoveCapKey(null, 50), true);
assertEq("jj-2: 50 (default) → removeItem", shouldRemoveCapKey(50, 50), true);
assertEq("jj-3: 100 → not removeItem (custom value)", shouldRemoveCapKey(100, 50), false);
assertEq("jj-4: 10 (min) → not removeItem", shouldRemoveCapKey(10, 50), false);
assertEq("jj-5: 5000 (max) → not removeItem", shouldRemoveCapKey(5000, 50), false);

assertEq("jj-6: NaN → skip write (defensive)", shouldSkipCapWrite(NaN), true);
assertEq("jj-7: Infinity → skip", shouldSkipCapWrite(Infinity), true);
assertEq("jj-8: -1 → skip", shouldSkipCapWrite(-1), true);
assertEq("jj-9: 100 → don't skip", shouldSkipCapWrite(100), false);
assertEq("jj-10: 0 → don't skip (0 is in-range, parser clamps to MIN on read)", shouldSkipCapWrite(0), false);

// ===== Thirty-sixth-pass chunk (tt): clearAllStoredTreePreferences
//       semantics (which keys it touches) ================================

// Pure-logic reproduction. The wiper removes 4 specific keys.
const PREFS_KEYS = [
  "dropin:tree:cap-subtree-depths:v1",
  "dropin:tree:storage-warn-bytes:v1",
  "dropin:tree:storage-danger-bytes:v1",
  "dropin:tree:drag-ghost-format:v1",
];

assertEq("tt-1: prefs wipe targets exactly 4 keys", PREFS_KEYS.length, 4);
assertEq("tt-2: prefs include cap-subtree-depths", PREFS_KEYS.includes("dropin:tree:cap-subtree-depths:v1"), true);
assertEq("tt-3: prefs include storage-warn-bytes", PREFS_KEYS.includes("dropin:tree:storage-warn-bytes:v1"), true);
assertEq("tt-4: prefs include storage-danger-bytes", PREFS_KEYS.includes("dropin:tree:storage-danger-bytes:v1"), true);
assertEq("tt-5: prefs include drag-ghost-format", PREFS_KEYS.includes("dropin:tree:drag-ghost-format:v1"), true);
// State keys are NOT in the prefs wipe — they're preserved.
assertEq("tt-6: prefs do NOT include depth (state, not pref)", PREFS_KEYS.includes("dropin:tree:depth:v1"), false);
assertEq("tt-7: prefs do NOT include query (state, not pref)", PREFS_KEYS.includes("dropin:tree:query:v1"), false);
assertEq("tt-8: prefs do NOT include expanded (state, not pref)", PREFS_KEYS.includes("dropin:tree:expanded:v1"), false);
assertEq("tt-9: prefs do NOT include subtree-depths (state, not pref)", PREFS_KEYS.includes("dropin:tree:subtree-depths:v1"), false);

// ===== Thirty-sixth-pass chunk (vv): parseStoragePanelScope ============

const STORAGE_PANEL_SCOPE_DEFAULT = "tree";

function parseStoragePanelScope(raw) {
  if (raw === "tree") return "tree";
  if (raw === "all") return "all";
  return STORAGE_PANEL_SCOPE_DEFAULT;
}

// parseStoragePanelScope — valid values.
assertEq("vv-1: 'tree' → tree", parseStoragePanelScope("tree"), "tree");
assertEq("vv-2: 'all' → all", parseStoragePanelScope("all"), "all");

// parseStoragePanelScope — null / empty / fallback.
assertEq("vv-3: null → tree (default)", parseStoragePanelScope(null), "tree");
assertEq("vv-4: empty string → tree (default)", parseStoragePanelScope(""), "tree");

// parseStoragePanelScope — strict literal (case-sensitive).
assertEq("vv-5: 'TREE' (upper) → tree (default)", parseStoragePanelScope("TREE"), "tree");
assertEq("vv-6: 'Tree' (mixed) → tree (default)", parseStoragePanelScope("Tree"), "tree");
assertEq("vv-7: 'ALL' (upper) → tree (default)", parseStoragePanelScope("ALL"), "tree");

// parseStoragePanelScope — corrupt / unrecognized → fallback.
assertEq("vv-8: 'foo' → tree", parseStoragePanelScope("foo"), "tree");
assertEq("vv-9: 'undefined' → tree", parseStoragePanelScope("undefined"), "tree");
assertEq("vv-10: '{\"scope\":\"all\"}' → tree (no JSON shape)", parseStoragePanelScope('{"scope":"all"}'), "tree");
assertEq("vv-11: '0' → tree", parseStoragePanelScope("0"), "tree");
assertEq("vv-12: 'true' → tree", parseStoragePanelScope("true"), "tree");

// parseStoragePanelScope — defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelScope(null);
    parseStoragePanelScope("");
    parseStoragePanelScope("garbage");
    parseStoragePanelScope("tree");
    parseStoragePanelScope("all");
  } catch {
    didThrow = true;
  }
  assertEq("vv-13: parseStoragePanelScope does not throw on edge inputs", didThrow, false);
}

// parseStoragePanelScope — idempotent (parse-of-parse stable).
{
  for (const raw of [null, "tree", "all", "garbage", ""]) {
    const once = parseStoragePanelScope(raw);
    const twice = parseStoragePanelScope(once);
    assertEq(`vv-14.${raw === null ? "null" : raw === "" ? "empty" : raw}: idempotent`, twice, once);
  }
}

// ===== Thirty-seventh-pass chunk (ccc): summarizeStoredEntriesByCategory ==

function summarizeStoredEntriesByCategory(entries) {
  const out = {
    tree: { count: 0, bytes: 0 },
    dropin: { count: 0, bytes: 0 },
    other: { count: 0, bytes: 0 },
  };
  for (const e of entries) {
    const bucket = out[e.category];
    bucket.count++;
    bucket.bytes += e.bytes;
  }
  return out;
}

// summarizeStoredEntriesByCategory — empty input.
{
  const r = summarizeStoredEntriesByCategory([]);
  assertEq("ccc-1: empty input → tree.count=0", r.tree.count, 0);
  assertEq("ccc-2: empty input → tree.bytes=0", r.tree.bytes, 0);
  assertEq("ccc-3: empty input → dropin.count=0", r.dropin.count, 0);
  assertEq("ccc-4: empty input → dropin.bytes=0", r.dropin.bytes, 0);
  assertEq("ccc-5: empty input → other.count=0", r.other.count, 0);
  assertEq("ccc-6: empty input → other.bytes=0", r.other.bytes, 0);
}

// summarizeStoredEntriesByCategory — tree-only entries.
{
  const r = summarizeStoredEntriesByCategory([
    { key: "dropin:tree:depth:v1", value: "3", bytes: 23, category: "tree" },
    { key: "dropin:tree:width", value: "240", bytes: 21, category: "tree" },
  ]);
  assertEq("ccc-7: tree.count=2", r.tree.count, 2);
  assertEq("ccc-8: tree.bytes summed", r.tree.bytes, 44);
  assertEq("ccc-9: dropin.count=0", r.dropin.count, 0);
  assertEq("ccc-10: other.count=0", r.other.count, 0);
}

// summarizeStoredEntriesByCategory — dropin-only entries.
{
  const r = summarizeStoredEntriesByCategory([
    { key: "dropin:tour-completed-v2", value: "true", bytes: 28, category: "dropin" },
  ]);
  assertEq("ccc-11: dropin.count=1", r.dropin.count, 1);
  assertEq("ccc-12: dropin.bytes=28", r.dropin.bytes, 28);
  assertEq("ccc-13: tree.count=0", r.tree.count, 0);
}

// summarizeStoredEntriesByCategory — other-only entries.
{
  const r = summarizeStoredEntriesByCategory([
    { key: "auth-token", value: "abc", bytes: 13, category: "other" },
    { key: "react-devtools", value: "x", bytes: 15, category: "other" },
  ]);
  assertEq("ccc-14: other.count=2", r.other.count, 2);
  assertEq("ccc-15: other.bytes summed", r.other.bytes, 28);
}

// summarizeStoredEntriesByCategory — mixed all 3 categories.
{
  const entries = [
    { key: "dropin:tree:depth:v1", value: "3", bytes: 23, category: "tree" },
    { key: "dropin:tour-completed-v2", value: "true", bytes: 28, category: "dropin" },
    { key: "auth-token", value: "xyz", bytes: 13, category: "other" },
    { key: "dropin:tree:width", value: "240", bytes: 21, category: "tree" },
  ];
  const r = summarizeStoredEntriesByCategory(entries);
  assertEq("ccc-16: tree.count=2", r.tree.count, 2);
  assertEq("ccc-17: dropin.count=1", r.dropin.count, 1);
  assertEq("ccc-18: other.count=1", r.other.count, 1);
  // Total reconciles to per-entry sum.
  const total = r.tree.bytes + r.dropin.bytes + r.other.bytes;
  const expected = entries.reduce((a, e) => a + e.bytes, 0);
  assertEq("ccc-19: per-category bytes sum to total", total, expected);
}

// summarizeStoredEntriesByCategory — pure (no input mutation).
{
  const input = [
    { key: "dropin:tree:depth:v1", value: "3", bytes: 23, category: "tree" },
    { key: "auth-token", value: "x", bytes: 11, category: "other" },
  ];
  const inputCopy = input.map((e) => ({ ...e }));
  summarizeStoredEntriesByCategory(input);
  assertEq("ccc-20: input length unchanged", input.length, inputCopy.length);
  assertEq("ccc-21: input[0] key unchanged", input[0].key, inputCopy[0].key);
  assertEq("ccc-22: input[0] bytes unchanged", input[0].bytes, inputCopy[0].bytes);
}

// summarizeStoredEntriesByCategory — idempotent.
{
  const input = [
    { key: "dropin:tree:depth:v1", value: "3", bytes: 23, category: "tree" },
    { key: "dropin:tour", value: "true", bytes: 15, category: "dropin" },
  ];
  const a = JSON.stringify(summarizeStoredEntriesByCategory(input));
  const b = JSON.stringify(summarizeStoredEntriesByCategory(input));
  assertEq("ccc-23: idempotent", a, b);
}

// summarizeStoredEntriesByCategory — returns fresh object each call.
{
  const input = [{ key: "k", value: "v", bytes: 2, category: "tree" }];
  const a = summarizeStoredEntriesByCategory(input);
  const b = summarizeStoredEntriesByCategory(input);
  assertEq("ccc-24: fresh object (different reference)", a === b, false);
  assertEq("ccc-25: fresh tree bucket (different reference)", a.tree === b.tree, false);
}

// summarizeStoredEntriesByCategory — zero-byte entry counted.
{
  const r = summarizeStoredEntriesByCategory([
    { key: "", value: "", bytes: 0, category: "tree" },
  ]);
  assertEq("ccc-26: zero-byte entry counts as 1", r.tree.count, 1);
  assertEq("ccc-27: zero-byte entry contributes 0 bytes", r.tree.bytes, 0);
}

// summarizeStoredEntriesByCategory — defense-in-depth (doesn't throw).
{
  let didThrow = false;
  try {
    summarizeStoredEntriesByCategory([]);
    summarizeStoredEntriesByCategory([
      { key: "k", value: "v", bytes: 2, category: "tree" },
      { key: "k2", value: "v2", bytes: 4, category: "dropin" },
      { key: "k3", value: "v3", bytes: 4, category: "other" },
    ]);
  } catch {
    didThrow = true;
  }
  assertEq("ccc-28: summarizeStoredEntriesByCategory does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-seventh-pass chunk (ddd): filterStoredEntries ==============

function filterStoredEntries(entries, query) {
  const trimmed = query.trim();
  if (trimmed === "") return entries.slice();
  const needle = trimmed.toLowerCase();
  const out = [];
  for (const e of entries) {
    if (e.key.toLowerCase().includes(needle)) {
      out.push(e);
      continue;
    }
    if (e.value.toLowerCase().includes(needle)) {
      out.push(e);
    }
  }
  return out;
}

const FIXTURE_ENTRIES = [
  { key: "dropin:tree:depth:v1", value: "3", bytes: 23 },
  { key: "dropin:tree:width", value: "240", bytes: 21 },
  { key: "dropin:tree:expanded:v1", value: '["oid:abc","oid:def"]', bytes: 47 },
  { key: "dropin:tree:subtree-depths:v1", value: '{"oid:abc":3}', bytes: 43 },
];

// filterStoredEntries — empty / whitespace queries.
{
  assertEq("ddd-1: empty query returns all", filterStoredEntries(FIXTURE_ENTRIES, "").length, 4);
  assertEq("ddd-2: whitespace-only returns all", filterStoredEntries(FIXTURE_ENTRIES, "   ").length, 4);
  assertEq("ddd-3: tab-only returns all", filterStoredEntries(FIXTURE_ENTRIES, "\t").length, 4);
}

// filterStoredEntries — substring match in key.
{
  const r = filterStoredEntries(FIXTURE_ENTRIES, "depth");
  assertEq("ddd-4: 'depth' matches depth + subtree-depths", r.length, 2);
  assertEq("ddd-5: matched entry includes depth:v1", r.some((e) => e.key === "dropin:tree:depth:v1"), true);
  assertEq("ddd-6: matched entry includes subtree-depths:v1", r.some((e) => e.key === "dropin:tree:subtree-depths:v1"), true);
}

// filterStoredEntries — substring match in value.
{
  const r = filterStoredEntries(FIXTURE_ENTRIES, "abc");
  assertEq("ddd-7: 'abc' matches expanded + subtree-depths via value", r.length, 2);
  assertEq("ddd-8: matched entry includes expanded:v1", r.some((e) => e.key === "dropin:tree:expanded:v1"), true);
}

// filterStoredEntries — case-insensitive (lowercase needle, uppercase haystack).
{
  const entries = [{ key: "AUTH-TOKEN", value: "ABCDEF", bytes: 16 }];
  const r1 = filterStoredEntries(entries, "auth");
  assertEq("ddd-9: lowercase needle matches uppercase key", r1.length, 1);
  const r2 = filterStoredEntries(entries, "abc");
  assertEq("ddd-10: lowercase needle matches uppercase value", r2.length, 1);
}

// filterStoredEntries — case-insensitive (uppercase needle, lowercase haystack).
{
  const entries = [{ key: "dropin:tree:depth:v1", value: "3", bytes: 23 }];
  const r = filterStoredEntries(entries, "DEPTH");
  assertEq("ddd-11: uppercase needle matches lowercase key", r.length, 1);
}

// filterStoredEntries — no match returns empty.
{
  const r = filterStoredEntries(FIXTURE_ENTRIES, "definitely-not-present-anywhere");
  assertEq("ddd-12: no-match returns empty array", r.length, 0);
}

// filterStoredEntries — query trimmed.
{
  const r = filterStoredEntries(FIXTURE_ENTRIES, "  depth  ");
  assertEq("ddd-13: leading/trailing whitespace trimmed", r.length, 2);
}

// filterStoredEntries — empty input.
{
  const r = filterStoredEntries([], "depth");
  assertEq("ddd-14: empty input → empty output", r.length, 0);
}

// filterStoredEntries — preserves input order (sort applied separately).
{
  const r = filterStoredEntries(FIXTURE_ENTRIES, "tree");
  assertEq("ddd-15: order preserved (depth first)", r[0].key, "dropin:tree:depth:v1");
  assertEq("ddd-16: order preserved (width second)", r[1].key, "dropin:tree:width");
}

// filterStoredEntries — pure (no input mutation).
{
  const input = [...FIXTURE_ENTRIES];
  const inputLengthBefore = input.length;
  filterStoredEntries(input, "depth");
  assertEq("ddd-17: input length unchanged", input.length, inputLengthBefore);
  assertEq("ddd-18: input[0] unchanged", input[0].key, FIXTURE_ENTRIES[0].key);
}

// filterStoredEntries — idempotent.
{
  const a = JSON.stringify(filterStoredEntries(FIXTURE_ENTRIES, "depth"));
  const b = JSON.stringify(filterStoredEntries(FIXTURE_ENTRIES, "depth"));
  assertEq("ddd-19: idempotent", a, b);
}

// filterStoredEntries — returns fresh array each call.
{
  const a = filterStoredEntries(FIXTURE_ENTRIES, "depth");
  const b = filterStoredEntries(FIXTURE_ENTRIES, "depth");
  assertEq("ddd-20: fresh array (different reference)", a === b, false);
}

// filterStoredEntries — empty query returns a fresh COPY (not the same ref).
{
  const a = filterStoredEntries(FIXTURE_ENTRIES, "");
  assertEq("ddd-21: empty-query result is a copy (different ref)", a === FIXTURE_ENTRIES, false);
  assertEq("ddd-22: empty-query result has same length", a.length, FIXTURE_ENTRIES.length);
}

// filterStoredEntries — special regex chars treated literally.
{
  const entries = [
    { key: "k", value: ".*", bytes: 3 },
    { key: "k2", value: "abc", bytes: 5 },
  ];
  const r = filterStoredEntries(entries, ".*");
  assertEq("ddd-23: '.*' matched literally (not as regex)", r.length, 1);
  assertEq("ddd-24: '.*' matched the entry with literal .*", r[0].key, "k");
}

// filterStoredEntries — match in BOTH key and value still counts entry once.
{
  const entries = [
    { key: "abc-key", value: "abc-value", bytes: 16 },
  ];
  const r = filterStoredEntries(entries, "abc");
  assertEq("ddd-25: entry matching both key and value counted once", r.length, 1);
}

// filterStoredEntries — handles entry with empty value.
{
  const entries = [
    { key: "dropin:tree:depth:v1", value: "", bytes: 20 },
  ];
  const r1 = filterStoredEntries(entries, "depth");
  assertEq("ddd-26: empty value entry matches via key", r1.length, 1);
  const r2 = filterStoredEntries(entries, "anything");
  assertEq("ddd-27: empty value entry no-match", r2.length, 0);
}

// filterStoredEntries — defense-in-depth (doesn't throw).
{
  let didThrow = false;
  try {
    filterStoredEntries([], "");
    filterStoredEntries(FIXTURE_ENTRIES, "");
    filterStoredEntries(FIXTURE_ENTRIES, "x");
    filterStoredEntries(FIXTURE_ENTRIES, "  ");
  } catch {
    didThrow = true;
  }
  assertEq("ddd-28: filterStoredEntries does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-seventh-pass chunk (eee): sortStoredEntries ================

function sortStoredEntries(entries, sort) {
  const out = entries.slice();
  if (sort === "name-asc") {
    out.sort((a, b) => {
      const ka = a.key.toLowerCase();
      const kb = b.key.toLowerCase();
      if (ka < kb) return -1;
      if (ka > kb) return 1;
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });
  } else {
    out.sort((a, b) => {
      if (a.bytes !== b.bytes) return b.bytes - a.bytes;
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });
  }
  return out;
}

// sortStoredEntries — bytes-desc on unequal bytes.
{
  const r = sortStoredEntries([
    { key: "small", value: "x", bytes: 6 },
    { key: "large", value: "x", bytes: 60 },
    { key: "medium", value: "x", bytes: 20 },
  ], "bytes-desc");
  assertEq("eee-1: bytes-desc heaviest first", r[0].bytes, 60);
  assertEq("eee-2: bytes-desc lightest last", r[r.length - 1].bytes, 6);
}

// sortStoredEntries — bytes-desc tie-break alphabetic.
{
  const r = sortStoredEntries([
    { key: "zzz", value: "x", bytes: 4 },
    { key: "aaa", value: "x", bytes: 4 },
    { key: "mmm", value: "x", bytes: 4 },
  ], "bytes-desc");
  assertEq("eee-3: tie-break first 'aaa'", r[0].key, "aaa");
  assertEq("eee-4: tie-break second 'mmm'", r[1].key, "mmm");
  assertEq("eee-5: tie-break third 'zzz'", r[2].key, "zzz");
}

// sortStoredEntries — name-asc by key.
{
  const r = sortStoredEntries([
    { key: "zebra", value: "x", bytes: 60 },
    { key: "apple", value: "x", bytes: 6 },
    { key: "mango", value: "x", bytes: 20 },
  ], "name-asc");
  assertEq("eee-6: name-asc 'apple' first", r[0].key, "apple");
  assertEq("eee-7: name-asc 'mango' second", r[1].key, "mango");
  assertEq("eee-8: name-asc 'zebra' last", r[2].key, "zebra");
}

// sortStoredEntries — name-asc case-insensitive.
{
  const r = sortStoredEntries([
    { key: "ZEBRA", value: "x", bytes: 60 },
    { key: "apple", value: "x", bytes: 6 },
    { key: "Mango", value: "x", bytes: 20 },
  ], "name-asc");
  assertEq("eee-9: name-asc 'apple' first (case-insensitive)", r[0].key, "apple");
  assertEq("eee-10: name-asc 'Mango' second (case-insensitive)", r[1].key, "Mango");
  assertEq("eee-11: name-asc 'ZEBRA' last (case-insensitive)", r[2].key, "ZEBRA");
}

// sortStoredEntries — name-asc case-sensitive tie-break.
{
  const r = sortStoredEntries([
    { key: "Foo", value: "x", bytes: 4 },
    { key: "foo", value: "x", bytes: 4 },
  ], "name-asc");
  // Both fold to "foo"; case-sensitive tie-break: "Foo" < "foo" in ASCII.
  assertEq("eee-12: tie-break uppercase first ('Foo' before 'foo')", r[0].key, "Foo");
  assertEq("eee-13: tie-break lowercase second", r[1].key, "foo");
}

// sortStoredEntries — empty input.
{
  const r = sortStoredEntries([], "bytes-desc");
  assertEq("eee-14: empty input returns empty array", r.length, 0);
}

// sortStoredEntries — single entry (both modes).
{
  const single = [{ key: "k", value: "v", bytes: 2 }];
  const a = sortStoredEntries(single, "bytes-desc");
  const b = sortStoredEntries(single, "name-asc");
  assertEq("eee-15: single entry bytes-desc unchanged", a[0].key, "k");
  assertEq("eee-16: single entry name-asc unchanged", b[0].key, "k");
}

// sortStoredEntries — pure (no input mutation).
{
  const input = [
    { key: "z", value: "x", bytes: 60 },
    { key: "a", value: "x", bytes: 6 },
  ];
  const inputCopy = input.map((e) => ({ ...e }));
  sortStoredEntries(input, "bytes-desc");
  assertEq("eee-17: input order unchanged after bytes-desc", input[0].key, inputCopy[0].key);
  sortStoredEntries(input, "name-asc");
  assertEq("eee-18: input order unchanged after name-asc", input[0].key, inputCopy[0].key);
}

// sortStoredEntries — idempotent.
{
  const input = [
    { key: "z", value: "x", bytes: 60 },
    { key: "a", value: "x", bytes: 6 },
  ];
  const a1 = JSON.stringify(sortStoredEntries(input, "bytes-desc"));
  const a2 = JSON.stringify(sortStoredEntries(input, "bytes-desc"));
  assertEq("eee-19: bytes-desc idempotent", a1, a2);
  const b1 = JSON.stringify(sortStoredEntries(input, "name-asc"));
  const b2 = JSON.stringify(sortStoredEntries(input, "name-asc"));
  assertEq("eee-20: name-asc idempotent", b1, b2);
}

// sortStoredEntries — returns fresh array each call.
{
  const input = [{ key: "k", value: "v", bytes: 2 }];
  const a = sortStoredEntries(input, "bytes-desc");
  const b = sortStoredEntries(input, "bytes-desc");
  assertEq("eee-21: fresh array (different reference)", a === b, false);
  assertEq("eee-22: fresh array does not equal input ref", a === input, false);
}

// sortStoredEntries — bytes-desc 0-byte entry sorts last.
{
  const r = sortStoredEntries([
    { key: "a", value: "x", bytes: 0 },
    { key: "b", value: "x", bytes: 5 },
  ], "bytes-desc");
  assertEq("eee-23: 5-byte first", r[0].bytes, 5);
  assertEq("eee-24: 0-byte last", r[1].bytes, 0);
}

// sortStoredEntries — categorized entries preserve category through sort.
{
  const r = sortStoredEntries([
    { key: "tree-key", value: "x", bytes: 8, category: "tree" },
    { key: "other-key", value: "x", bytes: 9, category: "other" },
  ], "bytes-desc");
  assertEq("eee-25: heaviest first", r[0].bytes, 9);
  assertEq("eee-26: category preserved on heaviest", r[0].category, "other");
  assertEq("eee-27: category preserved on lightest", r[1].category, "tree");
}

// sortStoredEntries — defense-in-depth (doesn't throw).
{
  let didThrow = false;
  try {
    sortStoredEntries([], "bytes-desc");
    sortStoredEntries([], "name-asc");
    sortStoredEntries([{ key: "k", value: "v", bytes: 2 }], "bytes-desc");
    sortStoredEntries([{ key: "k", value: "v", bytes: 2 }], "name-asc");
  } catch {
    didThrow = true;
  }
  assertEq("eee-28: sortStoredEntries does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-seventh-pass chunk (fff): parseStoragePanelSort ============

const STORAGE_PANEL_SORT_DEFAULT = "bytes-desc";

function parseStoragePanelSort(raw) {
  if (raw === "bytes-desc") return "bytes-desc";
  if (raw === "name-asc") return "name-asc";
  return STORAGE_PANEL_SORT_DEFAULT;
}

// parseStoragePanelSort — valid values.
assertEq("fff-1: 'bytes-desc' → bytes-desc", parseStoragePanelSort("bytes-desc"), "bytes-desc");
assertEq("fff-2: 'name-asc' → name-asc", parseStoragePanelSort("name-asc"), "name-asc");

// parseStoragePanelSort — null / empty fallback.
assertEq("fff-3: null → bytes-desc (default)", parseStoragePanelSort(null), "bytes-desc");
assertEq("fff-4: empty string → bytes-desc (default)", parseStoragePanelSort(""), "bytes-desc");

// parseStoragePanelSort — strict literal (case-sensitive fallback).
assertEq("fff-5: 'BYTES-DESC' → bytes-desc (default)", parseStoragePanelSort("BYTES-DESC"), "bytes-desc");
assertEq("fff-6: 'Bytes-Desc' → bytes-desc (default)", parseStoragePanelSort("Bytes-Desc"), "bytes-desc");
assertEq("fff-7: 'NAME-ASC' → bytes-desc (default)", parseStoragePanelSort("NAME-ASC"), "bytes-desc");
assertEq("fff-8: 'Name-Asc' → bytes-desc (default)", parseStoragePanelSort("Name-Asc"), "bytes-desc");

// parseStoragePanelSort — corrupt / unrecognized → fallback.
assertEq("fff-9: 'foo' → bytes-desc", parseStoragePanelSort("foo"), "bytes-desc");
assertEq("fff-10: 'undefined' → bytes-desc", parseStoragePanelSort("undefined"), "bytes-desc");
assertEq("fff-11: '{\"sort\":\"name-asc\"}' → bytes-desc (no JSON shape)", parseStoragePanelSort('{"sort":"name-asc"}'), "bytes-desc");
assertEq("fff-12: '0' → bytes-desc", parseStoragePanelSort("0"), "bytes-desc");
assertEq("fff-13: 'true' → bytes-desc", parseStoragePanelSort("true"), "bytes-desc");
assertEq("fff-14: 'asc' → bytes-desc (partial match)", parseStoragePanelSort("asc"), "bytes-desc");
assertEq("fff-15: 'bytes' → bytes-desc (partial match)", parseStoragePanelSort("bytes"), "bytes-desc");
assertEq("fff-16: ' bytes-desc ' → bytes-desc (no whitespace tolerance)", parseStoragePanelSort(" bytes-desc "), "bytes-desc");

// parseStoragePanelSort — defense-in-depth (doesn't throw).
{
  let didThrow = false;
  try {
    parseStoragePanelSort(null);
    parseStoragePanelSort("");
    parseStoragePanelSort("garbage");
    parseStoragePanelSort("bytes-desc");
    parseStoragePanelSort("name-asc");
  } catch {
    didThrow = true;
  }
  assertEq("fff-17: parseStoragePanelSort does not throw on edge inputs", didThrow, false);
}

// parseStoragePanelSort — idempotent (parse-of-parse stable).
{
  for (const raw of [null, "bytes-desc", "name-asc", "garbage", ""]) {
    const once = parseStoragePanelSort(raw);
    const twice = parseStoragePanelSort(once);
    assertEq(`fff-18.${raw === null ? "null" : raw === "" ? "empty" : raw}: idempotent`, twice, once);
  }
}

// ===== Thirty-eighth-pass chunk (ggg): parseStoragePanelFilter ===========

const STORAGE_PANEL_FILTER_DEFAULT = "";
const STORAGE_PANEL_FILTER_MAX_LEN = 256;

function parseStoragePanelFilter(raw) {
  if (raw === null) return STORAGE_PANEL_FILTER_DEFAULT;
  if (raw.length > STORAGE_PANEL_FILTER_MAX_LEN) {
    return raw.slice(0, STORAGE_PANEL_FILTER_MAX_LEN);
  }
  return raw;
}

// parseStoragePanelFilter — basic values.
assertEq("ggg-1: 'foo' → 'foo'", parseStoragePanelFilter("foo"), "foo");
assertEq("ggg-2: '' → '' (default)", parseStoragePanelFilter(""), "");
assertEq("ggg-3: null → '' (default)", parseStoragePanelFilter(null), "");
assertEq("ggg-4: 'dropin:tree:depth' → 'dropin:tree:depth'", parseStoragePanelFilter("dropin:tree:depth"), "dropin:tree:depth");
assertEq("ggg-5: whitespace preserved (no trim)", parseStoragePanelFilter("  foo  "), "  foo  ");

// parseStoragePanelFilter — case preserved (filter is rendered as typed).
assertEq("ggg-6: 'FOO' preserved", parseStoragePanelFilter("FOO"), "FOO");
assertEq("ggg-7: 'MixedCase' preserved", parseStoragePanelFilter("MixedCase"), "MixedCase");

// parseStoragePanelFilter — special chars preserved literally (substring not regex).
assertEq("ggg-8: '.*' preserved", parseStoragePanelFilter(".*"), ".*");
assertEq("ggg-9: '\\\\d+' preserved", parseStoragePanelFilter("\\d+"), "\\d+");
assertEq("ggg-10: 'a/b' preserved", parseStoragePanelFilter("a/b"), "a/b");

// parseStoragePanelFilter — length cap.
{
  const long = "a".repeat(STORAGE_PANEL_FILTER_MAX_LEN);
  assertEq("ggg-11: at-cap preserved exactly", parseStoragePanelFilter(long), long);
}
{
  const overlong = "a".repeat(STORAGE_PANEL_FILTER_MAX_LEN + 50);
  const r = parseStoragePanelFilter(overlong);
  assertEq("ggg-12: overlong clamped to MAX_LEN", r.length, STORAGE_PANEL_FILTER_MAX_LEN);
  assertEq("ggg-13: clamp keeps prefix (not suffix)", r[0], "a");
}
{
  const overlong = "x".repeat(STORAGE_PANEL_FILTER_MAX_LEN + 1);
  const r = parseStoragePanelFilter(overlong);
  assertEq("ggg-14: cap+1 clamped to MAX_LEN", r.length, STORAGE_PANEL_FILTER_MAX_LEN);
}

// parseStoragePanelFilter — defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelFilter(null);
    parseStoragePanelFilter("");
    parseStoragePanelFilter("foo");
    parseStoragePanelFilter("a".repeat(10000));
  } catch {
    didThrow = true;
  }
  assertEq("ggg-15: parseStoragePanelFilter does not throw on edge inputs", didThrow, false);
}

// parseStoragePanelFilter — idempotent (parse-of-parse stable).
{
  for (const raw of [null, "", "foo", "a".repeat(STORAGE_PANEL_FILTER_MAX_LEN + 50), "MixedCase"]) {
    const once = parseStoragePanelFilter(raw);
    const twice = parseStoragePanelFilter(once);
    assertEq(`ggg-16.${raw === null ? "null" : raw === "" ? "empty" : raw.slice(0, 8)}: idempotent`, twice, once);
  }
}

// ===== Thirty-eighth-pass chunk (lll): splitOnMatchedSubstring ===========

function splitOnMatchedSubstring(text, query) {
  const trimmed = query.trim();
  if (trimmed === "" || text === "") {
    return [{ text, match: false }];
  }
  const haystack = text.toLowerCase();
  const needle = trimmed.toLowerCase();
  const out = [];
  let cursor = 0;
  while (cursor <= text.length) {
    const idx = haystack.indexOf(needle, cursor);
    if (idx === -1) {
      if (cursor < text.length) {
        out.push({ text: text.slice(cursor), match: false });
      }
      break;
    }
    if (idx > cursor) {
      out.push({ text: text.slice(cursor, idx), match: false });
    }
    out.push({ text: text.slice(idx, idx + needle.length), match: true });
    cursor = idx + needle.length;
  }
  if (out.length === 0) {
    return [{ text, match: false }];
  }
  return out;
}

// splitOnMatchedSubstring — empty query → single non-match segment.
{
  const r = splitOnMatchedSubstring("hello", "");
  assertEq("lll-1: empty query → 1 segment", r.length, 1);
  assertEq("lll-2: empty query → text full", r[0].text, "hello");
  assertEq("lll-3: empty query → match false", r[0].match, false);
}

// splitOnMatchedSubstring — whitespace-only query → single non-match segment.
{
  const r = splitOnMatchedSubstring("hello", "   ");
  assertEq("lll-4: whitespace query → 1 segment", r.length, 1);
  assertEq("lll-5: whitespace query → match false", r[0].match, false);
}

// splitOnMatchedSubstring — empty text → single non-match segment with empty text.
{
  const r = splitOnMatchedSubstring("", "foo");
  assertEq("lll-6: empty text → 1 segment", r.length, 1);
  assertEq("lll-7: empty text → text empty", r[0].text, "");
  assertEq("lll-8: empty text → match false", r[0].match, false);
}

// splitOnMatchedSubstring — single match in middle → 3 segments.
{
  const r = splitOnMatchedSubstring("hello world", "lo w");
  assertEq("lll-9: middle match → 3 segments", r.length, 3);
  assertEq("lll-10: pre-match text", r[0].text, "hel");
  assertEq("lll-11: pre-match match=false", r[0].match, false);
  assertEq("lll-12: matched text preserves case", r[1].text, "lo w");
  assertEq("lll-13: matched match=true", r[1].match, true);
  assertEq("lll-14: post-match text", r[2].text, "orld");
  assertEq("lll-15: post-match match=false", r[2].match, false);
}

// splitOnMatchedSubstring — match at start → 2 segments (match + non-match).
{
  const r = splitOnMatchedSubstring("foobar", "foo");
  assertEq("lll-16: start match → 2 segments", r.length, 2);
  assertEq("lll-17: first segment match=true", r[0].match, true);
  assertEq("lll-18: first segment text", r[0].text, "foo");
  assertEq("lll-19: tail non-match", r[1].text, "bar");
}

// splitOnMatchedSubstring — match at end → 2 segments (non-match + match).
{
  const r = splitOnMatchedSubstring("foobar", "bar");
  assertEq("lll-20: end match → 2 segments", r.length, 2);
  assertEq("lll-21: head non-match", r[0].text, "foo");
  assertEq("lll-22: tail match", r[1].match, true);
  assertEq("lll-23: tail text", r[1].text, "bar");
}

// splitOnMatchedSubstring — full match → 1 match segment.
{
  const r = splitOnMatchedSubstring("foo", "foo");
  assertEq("lll-24: full match → 1 segment", r.length, 1);
  assertEq("lll-25: full match=true", r[0].match, true);
  assertEq("lll-26: full match text", r[0].text, "foo");
}

// splitOnMatchedSubstring — case-insensitive needle, original case preserved.
{
  const r = splitOnMatchedSubstring("HELLO World", "hello");
  assertEq("lll-27: case-insensitive match found", r.length >= 1, true);
  // First segment is the match
  assertEq("lll-28: matched preserves source case", r[0].text, "HELLO");
  assertEq("lll-29: matched match=true", r[0].match, true);
}

// splitOnMatchedSubstring — multiple non-overlapping matches → alternating.
{
  const r = splitOnMatchedSubstring("ababab", "a");
  // Expected: [a, b, a, b, a, b] alternating match/non-match starting with match.
  assertEq("lll-30: multi-match length", r.length, 6);
  assertEq("lll-31: 1st is match", r[0].match, true);
  assertEq("lll-32: 2nd is non-match", r[1].match, false);
  assertEq("lll-33: 3rd is match", r[2].match, true);
}

// splitOnMatchedSubstring — no match → single non-match.
{
  const r = splitOnMatchedSubstring("hello", "xyz");
  assertEq("lll-34: no-match → 1 segment", r.length, 1);
  assertEq("lll-35: no-match → match=false", r[0].match, false);
  assertEq("lll-36: no-match → text full", r[0].text, "hello");
}

// splitOnMatchedSubstring — query trimmed (matching whitespace stripped).
{
  const r = splitOnMatchedSubstring("hello world", "  world  ");
  // Trimmed needle "world" is found at index 6 → 2 segments.
  assertEq("lll-37: trimmed query length", r.length, 2);
  assertEq("lll-38: trimmed query matches at end", r[1].match, true);
  assertEq("lll-39: trimmed match text", r[1].text, "world");
}

// splitOnMatchedSubstring — special regex chars treated literally.
{
  const r = splitOnMatchedSubstring("a.b.c", ".");
  // Each "." is matched literally; "a", "b", "c" are non-matches between.
  // Expected segments: [a, ., b, ., c] = 5 segments
  assertEq("lll-40: dot literal match count", r.length, 5);
  assertEq("lll-41: matches at idx 1, 3", r[1].match, true);
  assertEq("lll-42: matches at idx 1, 3 (second)", r[3].match, true);
}

// splitOnMatchedSubstring — pure (no input mutation).
{
  const text = "foo bar foo";
  const query = "foo";
  splitOnMatchedSubstring(text, query);
  assertEq("lll-43: text unchanged", text, "foo bar foo");
  assertEq("lll-44: query unchanged", query, "foo");
}

// splitOnMatchedSubstring — segments concatenate to original text.
{
  for (const [text, query] of [
    ["hello world", "lo w"],
    ["aaaa", "a"],
    ["abcabc", "bc"],
    ["test", "Test"],
    ["preserve case", "CASE"],
  ]) {
    const r = splitOnMatchedSubstring(text, query);
    const concat = r.map((s) => s.text).join("");
    assertEq(`lll-45.${query}: segments concat to original`, concat, text);
  }
}

// splitOnMatchedSubstring — defense-in-depth.
{
  let didThrow = false;
  try {
    splitOnMatchedSubstring("", "");
    splitOnMatchedSubstring("text", "");
    splitOnMatchedSubstring("", "query");
    splitOnMatchedSubstring("text", "query");
    splitOnMatchedSubstring("a".repeat(10000), "a");
  } catch {
    didThrow = true;
  }
  assertEq("lll-46: splitOnMatchedSubstring does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-eighth-pass chunk (mmm): parseStoragePanelCollapsedOther ===

const STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT = true;

function parseStoragePanelCollapsedOther(raw) {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT;
}

// parseStoragePanelCollapsedOther — valid values.
assertEq("mmm-1: '1' → true", parseStoragePanelCollapsedOther("1"), true);
assertEq("mmm-2: '0' → false", parseStoragePanelCollapsedOther("0"), false);

// parseStoragePanelCollapsedOther — null / empty → default.
assertEq("mmm-3: null → true (default)", parseStoragePanelCollapsedOther(null), true);
assertEq("mmm-4: '' → true (default)", parseStoragePanelCollapsedOther(""), true);

// parseStoragePanelCollapsedOther — strict literal (no truthy/falsy coercion).
assertEq("mmm-5: 'true' → true (default; not literal '1')", parseStoragePanelCollapsedOther("true"), true);
assertEq("mmm-6: 'false' → true (default; not literal '0')", parseStoragePanelCollapsedOther("false"), true);
assertEq("mmm-7: '01' → true (default)", parseStoragePanelCollapsedOther("01"), true);
assertEq("mmm-8: '10' → true (default)", parseStoragePanelCollapsedOther("10"), true);
assertEq("mmm-9: ' 1' → true (default; no whitespace tolerance)", parseStoragePanelCollapsedOther(" 1"), true);
assertEq("mmm-10: '1 ' → true (default)", parseStoragePanelCollapsedOther("1 "), true);

// parseStoragePanelCollapsedOther — corrupt → fallback.
assertEq("mmm-11: 'foo' → true", parseStoragePanelCollapsedOther("foo"), true);
assertEq("mmm-12: 'undefined' → true", parseStoragePanelCollapsedOther("undefined"), true);
assertEq("mmm-13: '{}' → true", parseStoragePanelCollapsedOther("{}"), true);

// parseStoragePanelCollapsedOther — defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelCollapsedOther(null);
    parseStoragePanelCollapsedOther("");
    parseStoragePanelCollapsedOther("1");
    parseStoragePanelCollapsedOther("0");
    parseStoragePanelCollapsedOther("garbage");
  } catch {
    didThrow = true;
  }
  assertEq("mmm-14: parseStoragePanelCollapsedOther does not throw on edge inputs", didThrow, false);
}

// parseStoragePanelCollapsedOther — idempotent (parse-of-parse stable).
{
  for (const raw of [null, "", "1", "0", "garbage", "true"]) {
    const once = parseStoragePanelCollapsedOther(raw);
    const twice = parseStoragePanelCollapsedOther(once === true ? "1" : "0");
    assertEq(`mmm-15.${raw === null ? "null" : raw === "" ? "empty" : raw}: idempotent through serialization`, twice, once);
  }
}

// ===== Thirty-eighth-pass chunk (mmm): partitionAllEntriesByOtherCollapse =

function partitionAllEntriesByOtherCollapse(entries, collapsed) {
  if (!collapsed) {
    return {
      visible: entries.slice(),
      hiddenOtherCount: 0,
      hiddenOtherBytes: 0,
    };
  }
  const visible = [];
  let hiddenOtherCount = 0;
  let hiddenOtherBytes = 0;
  for (const e of entries) {
    if (e.category === "other") {
      hiddenOtherCount++;
      hiddenOtherBytes += e.bytes;
    } else {
      visible.push(e);
    }
  }
  return { visible, hiddenOtherCount, hiddenOtherBytes };
}

// partition — collapsed=false returns full copy + zero hidden.
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 3, category: "other" },
    { key: "k3", value: "v", bytes: 3, category: "dropin" },
  ];
  const r = partitionAllEntriesByOtherCollapse(inp, false);
  assertEq("mmm-16: collapsed=false visible length", r.visible.length, 3);
  assertEq("mmm-17: collapsed=false hidden count zero", r.hiddenOtherCount, 0);
  assertEq("mmm-18: collapsed=false hidden bytes zero", r.hiddenOtherBytes, 0);
}

// partition — collapsed=true filters out "other".
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "vv", bytes: 4, category: "other" },
    { key: "k3", value: "v", bytes: 3, category: "dropin" },
    { key: "k4", value: "vvv", bytes: 5, category: "other" },
  ];
  const r = partitionAllEntriesByOtherCollapse(inp, true);
  assertEq("mmm-19: collapsed visible length", r.visible.length, 2);
  assertEq("mmm-20: collapsed hidden count", r.hiddenOtherCount, 2);
  assertEq("mmm-21: collapsed hidden bytes (sum)", r.hiddenOtherBytes, 9);
  assertEq("mmm-22: visible[0] is non-other", r.visible[0].category !== "other", true);
  assertEq("mmm-23: visible[1] is non-other", r.visible[1].category !== "other", true);
}

// partition — empty input returns empty visible + zero hidden.
{
  const r = partitionAllEntriesByOtherCollapse([], true);
  assertEq("mmm-24: empty visible length", r.visible.length, 0);
  assertEq("mmm-25: empty hidden count", r.hiddenOtherCount, 0);
  assertEq("mmm-26: empty hidden bytes", r.hiddenOtherBytes, 0);
}

// partition — all "other" with collapse → empty visible.
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "other" },
    { key: "k2", value: "v", bytes: 3, category: "other" },
  ];
  const r = partitionAllEntriesByOtherCollapse(inp, true);
  assertEq("mmm-27: all-other visible empty", r.visible.length, 0);
  assertEq("mmm-28: all-other hidden count", r.hiddenOtherCount, 2);
  assertEq("mmm-29: all-other hidden bytes", r.hiddenOtherBytes, 6);
}

// partition — no "other" with collapse → full visible, zero hidden.
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 3, category: "dropin" },
  ];
  const r = partitionAllEntriesByOtherCollapse(inp, true);
  assertEq("mmm-30: no-other visible length", r.visible.length, 2);
  assertEq("mmm-31: no-other hidden count", r.hiddenOtherCount, 0);
  assertEq("mmm-32: no-other hidden bytes", r.hiddenOtherBytes, 0);
}

// partition — order preserved on visible.
{
  const inp = [
    { key: "z", value: "v", bytes: 2, category: "tree" },
    { key: "a", value: "v", bytes: 2, category: "other" },
    { key: "m", value: "v", bytes: 2, category: "dropin" },
  ];
  const r = partitionAllEntriesByOtherCollapse(inp, true);
  assertEq("mmm-33: order[0]", r.visible[0].key, "z");
  assertEq("mmm-34: order[1]", r.visible[1].key, "m");
}

// partition — pure (input not mutated).
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 3, category: "other" },
  ];
  const before = inp.length;
  partitionAllEntriesByOtherCollapse(inp, true);
  assertEq("mmm-35: input length unchanged", inp.length, before);
  assertEq("mmm-36: input[0] unchanged", inp[0].category, "tree");
  assertEq("mmm-37: input[1] unchanged", inp[1].category, "other");
}

// partition — collapsed=false returns a fresh array (not same ref).
{
  const inp = [{ key: "k1", value: "v", bytes: 3, category: "tree" }];
  const r = partitionAllEntriesByOtherCollapse(inp, false);
  assertEq("mmm-38: visible is fresh array (not ref)", r.visible === inp, false);
  assertEq("mmm-39: visible content matches", r.visible.length, 1);
}

// partition — defense-in-depth.
{
  let didThrow = false;
  try {
    partitionAllEntriesByOtherCollapse([], true);
    partitionAllEntriesByOtherCollapse([], false);
    partitionAllEntriesByOtherCollapse([{ key: "k", value: "v", bytes: 2, category: "tree" }], true);
    partitionAllEntriesByOtherCollapse([{ key: "k", value: "v", bytes: 2, category: "other" }], true);
  } catch {
    didThrow = true;
  }
  assertEq("mmm-40: partitionAllEntriesByOtherCollapse does not throw on edge inputs", didThrow, false);
}

// partition — idempotent (re-partition of visible yields same).
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 3, category: "other" },
  ];
  const r1 = partitionAllEntriesByOtherCollapse(inp, true);
  const r2 = partitionAllEntriesByOtherCollapse(r1.visible, true);
  assertEq("mmm-41: idempotent visible length", r2.visible.length, r1.visible.length);
  assertEq("mmm-42: idempotent hidden count zero (no other in visible)", r2.hiddenOtherCount, 0);
}

// ===== Thirty-eighth-pass chunk (kkk): build/serialize panel export ======
// (summarizeStoredEntriesByCategory inlined earlier in this bench at
// chunk ccc; reused below.)

function buildStoragePanelExport(entries, panelState, exportedAt) {
  const total = entries.reduce(
    (acc, e) => {
      acc.count++;
      acc.bytes += e.bytes;
      return acc;
    },
    { count: 0, bytes: 0 },
  );
  return {
    schemaVersion: 1,
    exportedAt,
    panelState: {
      scope: panelState.scope,
      filter: panelState.filter,
      sort: panelState.sort,
      collapsedOther: panelState.collapsedOther,
    },
    entries: entries.map((e) => ({
      key: e.key,
      value: e.value,
      bytes: e.bytes,
      category: e.category,
    })),
    summary: {
      total,
      byCategory: summarizeStoredEntriesByCategory(entries),
    },
  };
}

function serializeStoragePanelExport(exp) {
  return JSON.stringify(exp, null, 2);
}

const fixedPanelState = {
  scope: "all",
  filter: "depth",
  sort: "bytes-desc",
  collapsedOther: true,
};
const fixedExportedAt = "2026-05-04T12:00:00.000Z";

// buildStoragePanelExport — empty input.
{
  const r = buildStoragePanelExport([], fixedPanelState, fixedExportedAt);
  assertEq("kkk-1: schemaVersion is 1", r.schemaVersion, 1);
  assertEq("kkk-2: exportedAt preserved", r.exportedAt, fixedExportedAt);
  assertEq("kkk-3: panelState.scope preserved", r.panelState.scope, "all");
  assertEq("kkk-4: panelState.filter preserved", r.panelState.filter, "depth");
  assertEq("kkk-5: panelState.sort preserved", r.panelState.sort, "bytes-desc");
  assertEq("kkk-6: panelState.collapsedOther preserved", r.panelState.collapsedOther, true);
  assertEq("kkk-7: entries empty", r.entries.length, 0);
  assertEq("kkk-8: total count zero", r.summary.total.count, 0);
  assertEq("kkk-9: total bytes zero", r.summary.total.bytes, 0);
  assertEq("kkk-10: byCategory.tree zero count", r.summary.byCategory.tree.count, 0);
  assertEq("kkk-11: byCategory.dropin zero count", r.summary.byCategory.dropin.count, 0);
  assertEq("kkk-12: byCategory.other zero count", r.summary.byCategory.other.count, 0);
}

// buildStoragePanelExport — populated input.
{
  const inp = [
    { key: "k1", value: "v1", bytes: 4, category: "tree" },
    { key: "k2", value: "vv", bytes: 4, category: "dropin" },
    { key: "k3", value: "x", bytes: 3, category: "other" },
  ];
  const r = buildStoragePanelExport(inp, fixedPanelState, fixedExportedAt);
  assertEq("kkk-13: entries length matches input", r.entries.length, 3);
  assertEq("kkk-14: total count = 3", r.summary.total.count, 3);
  assertEq("kkk-15: total bytes = 11", r.summary.total.bytes, 11);
  assertEq("kkk-16: byCategory.tree count = 1", r.summary.byCategory.tree.count, 1);
  assertEq("kkk-17: byCategory.dropin count = 1", r.summary.byCategory.dropin.count, 1);
  assertEq("kkk-18: byCategory.other count = 1", r.summary.byCategory.other.count, 1);
  assertEq("kkk-19: byCategory.tree bytes = 4", r.summary.byCategory.tree.bytes, 4);
  assertEq("kkk-20: byCategory.dropin bytes = 4", r.summary.byCategory.dropin.bytes, 4);
  assertEq("kkk-21: byCategory.other bytes = 3", r.summary.byCategory.other.bytes, 3);
  assertEq("kkk-22: entries[0].key", r.entries[0].key, "k1");
  assertEq("kkk-23: entries[0].value", r.entries[0].value, "v1");
  assertEq("kkk-24: entries[0].bytes", r.entries[0].bytes, 4);
  assertEq("kkk-25: entries[0].category", r.entries[0].category, "tree");
}

// buildStoragePanelExport — pure (input not mutated).
{
  const inp = [
    { key: "k1", value: "v1", bytes: 4, category: "tree" },
  ];
  const beforeLen = inp.length;
  buildStoragePanelExport(inp, fixedPanelState, fixedExportedAt);
  assertEq("kkk-26: input length unchanged", inp.length, beforeLen);
  assertEq("kkk-27: input[0] unchanged", inp[0].key, "k1");
}

// buildStoragePanelExport — entries are fresh objects (not shared refs).
{
  const inp = [
    { key: "k1", value: "v1", bytes: 4, category: "tree" },
  ];
  const r = buildStoragePanelExport(inp, fixedPanelState, fixedExportedAt);
  assertEq("kkk-28: entry is a fresh object (not shared ref)", r.entries[0] === inp[0], false);
  assertEq("kkk-29: entry shape matches input", r.entries[0].key, inp[0].key);
}

// buildStoragePanelExport — panelState fields shallow-copied.
{
  const ps = { scope: "tree", filter: "", sort: "name-asc", collapsedOther: false };
  const r = buildStoragePanelExport([], ps, fixedExportedAt);
  assertEq("kkk-30: panelState is a fresh object (not shared ref)", r.panelState === ps, false);
  assertEq("kkk-31: scope copied", r.panelState.scope, "tree");
  assertEq("kkk-32: filter copied", r.panelState.filter, "");
  assertEq("kkk-33: sort copied", r.panelState.sort, "name-asc");
  assertEq("kkk-34: collapsedOther copied", r.panelState.collapsedOther, false);
}

// serializeStoragePanelExport — produces parseable JSON.
{
  const inp = [
    { key: "k1", value: "v1", bytes: 4, category: "tree" },
  ];
  const exp = buildStoragePanelExport(inp, fixedPanelState, fixedExportedAt);
  const json = serializeStoragePanelExport(exp);
  let parsed;
  let didThrow = false;
  try {
    parsed = JSON.parse(json);
  } catch {
    didThrow = true;
  }
  assertEq("kkk-35: serialize produces parseable JSON", didThrow, false);
  assertEq("kkk-36: parsed schemaVersion preserved", parsed.schemaVersion, 1);
  assertEq("kkk-37: parsed entries length", parsed.entries.length, 1);
  assertEq("kkk-38: parsed entries[0].key", parsed.entries[0].key, "k1");
  assertEq("kkk-39: parsed exportedAt preserved", parsed.exportedAt, fixedExportedAt);
}

// serializeStoragePanelExport — pretty-printed (multi-line output).
{
  const exp = buildStoragePanelExport([], fixedPanelState, fixedExportedAt);
  const json = serializeStoragePanelExport(exp);
  const hasNewlines = json.includes("\n");
  assertEq("kkk-40: pretty-printed (has newlines)", hasNewlines, true);
  // Indented with 2 spaces (JSON.stringify(_, null, 2) signature).
  const hasIndent = json.includes('  "schemaVersion"');
  assertEq("kkk-41: 2-space indent", hasIndent, true);
}

// serializeStoragePanelExport — special characters in values escaped.
{
  const inp = [
    { key: "key\"with\"quotes", value: "value\\with\\backslash\nand\nnewlines", bytes: 30, category: "tree" },
  ];
  const exp = buildStoragePanelExport(inp, fixedPanelState, fixedExportedAt);
  const json = serializeStoragePanelExport(exp);
  let parsed;
  let didThrow = false;
  try {
    parsed = JSON.parse(json);
  } catch {
    didThrow = true;
  }
  assertEq("kkk-42: special chars in value still parseable", didThrow, false);
  assertEq("kkk-43: roundtrip preserves quotes in key", parsed.entries[0].key, "key\"with\"quotes");
  assertEq("kkk-44: roundtrip preserves backslashes + newlines in value", parsed.entries[0].value, "value\\with\\backslash\nand\nnewlines");
}

// serializeStoragePanelExport — defense-in-depth.
{
  let didThrow = false;
  try {
    serializeStoragePanelExport(buildStoragePanelExport([], fixedPanelState, fixedExportedAt));
    serializeStoragePanelExport(buildStoragePanelExport([{ key: "k", value: "v", bytes: 2, category: "tree" }], fixedPanelState, fixedExportedAt));
  } catch {
    didThrow = true;
  }
  assertEq("kkk-45: serialize does not throw on edge inputs", didThrow, false);
}

// buildStoragePanelExport — multiple entries in same category sum bytes correctly.
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "vv", bytes: 4, category: "tree" },
    { key: "k3", value: "vvv", bytes: 5, category: "tree" },
  ];
  const r = buildStoragePanelExport(inp, fixedPanelState, fixedExportedAt);
  assertEq("kkk-46: tree count = 3", r.summary.byCategory.tree.count, 3);
  assertEq("kkk-47: tree bytes = 12", r.summary.byCategory.tree.bytes, 12);
  assertEq("kkk-48: total bytes matches sum", r.summary.total.bytes, 12);
}

// buildStoragePanelExport — schemaVersion is always 1.
{
  for (let i = 0; i < 3; i++) {
    const r = buildStoragePanelExport([], fixedPanelState, fixedExportedAt);
    assertEq(`kkk-49.${i}: schemaVersion is always 1`, r.schemaVersion, 1);
  }
}

// ===== Thirty-ninth-pass chunk (ttt): export metadata fields ============

// Re-define build to include the optional metadata 4th parameter.
function buildStoragePanelExportV2(entries, panelState, exportedAt, metadata) {
  const total = entries.reduce(
    (acc, e) => {
      acc.count++;
      acc.bytes += e.bytes;
      return acc;
    },
    { count: 0, bytes: 0 },
  );
  const result = {
    schemaVersion: 1,
    exportedAt,
    panelState: {
      scope: panelState.scope,
      filter: panelState.filter,
      sort: panelState.sort,
      collapsedOther: panelState.collapsedOther,
    },
    entries: entries.map((e) => ({
      key: e.key,
      value: e.value,
      bytes: e.bytes,
      category: e.category,
    })),
    summary: {
      total,
      byCategory: summarizeStoredEntriesByCategory(entries),
    },
  };
  if (metadata !== undefined) {
    result.metadata = {
      dropinSchemaVersion: metadata.dropinSchemaVersion,
      userAgent: metadata.userAgent,
      appVersion: metadata.appVersion,
    };
  }
  return result;
}

const fixedMetadata = {
  dropinSchemaVersion: 1,
  userAgent: "Mozilla/5.0 (Test)",
  appVersion: "0.1.0",
};

// build without metadata → metadata field absent.
{
  const r = buildStoragePanelExportV2([], fixedPanelState, fixedExportedAt);
  assertEq("ttt-1: metadata absent when not provided", "metadata" in r, false);
  assertEq("ttt-2: schemaVersion still 1", r.schemaVersion, 1);
}

// build with metadata → metadata present.
{
  const r = buildStoragePanelExportV2(
    [],
    fixedPanelState,
    fixedExportedAt,
    fixedMetadata,
  );
  assertEq("ttt-3: metadata present when provided", "metadata" in r, true);
  assertEq(
    "ttt-4: dropinSchemaVersion preserved",
    r.metadata.dropinSchemaVersion,
    1,
  );
  assertEq(
    "ttt-5: userAgent preserved",
    r.metadata.userAgent,
    "Mozilla/5.0 (Test)",
  );
  assertEq("ttt-6: appVersion preserved", r.metadata.appVersion, "0.1.0");
}

// build with metadata → metadata is shallow-copied (not shared ref).
{
  const md = {
    dropinSchemaVersion: 2,
    userAgent: "UA",
    appVersion: "1.0.0",
  };
  const r = buildStoragePanelExportV2(
    [],
    fixedPanelState,
    fixedExportedAt,
    md,
  );
  assertEq("ttt-7: metadata is fresh object", r.metadata === md, false);
  assertEq("ttt-8: dropinSchemaVersion copied", r.metadata.dropinSchemaVersion, 2);
}

// build with metadata.appVersion = null → null preserved.
{
  const md = {
    dropinSchemaVersion: 1,
    userAgent: "UA",
    appVersion: null,
  };
  const r = buildStoragePanelExportV2([], fixedPanelState, fixedExportedAt, md);
  assertEq("ttt-9: null appVersion preserved", r.metadata.appVersion, null);
}

// serialize → metadata roundtrips through JSON.
{
  const r = buildStoragePanelExportV2(
    [],
    fixedPanelState,
    fixedExportedAt,
    fixedMetadata,
  );
  const json = JSON.stringify(r, null, 2);
  const parsed = JSON.parse(json);
  assertEq(
    "ttt-10: metadata.userAgent roundtrips",
    parsed.metadata.userAgent,
    "Mozilla/5.0 (Test)",
  );
  assertEq(
    "ttt-11: metadata.appVersion roundtrips",
    parsed.metadata.appVersion,
    "0.1.0",
  );
}

// build without metadata → input unchanged.
{
  const inp = [{ key: "k1", value: "v", bytes: 2, category: "tree" }];
  const beforeLen = inp.length;
  buildStoragePanelExportV2(inp, fixedPanelState, fixedExportedAt);
  assertEq("ttt-12: input unchanged when no metadata", inp.length, beforeLen);
}

// build with metadata → defense-in-depth.
{
  let didThrow = false;
  try {
    buildStoragePanelExportV2([], fixedPanelState, fixedExportedAt, fixedMetadata);
    buildStoragePanelExportV2([], fixedPanelState, fixedExportedAt);
    buildStoragePanelExportV2(
      [{ key: "k", value: "v", bytes: 2, category: "other" }],
      fixedPanelState,
      fixedExportedAt,
      fixedMetadata,
    );
  } catch {
    didThrow = true;
  }
  assertEq("ttt-13: build does not throw with or without metadata", didThrow, false);
}

// ===== Thirty-ninth-pass chunk (qqq): import JSON parser =================

// STORAGE_PANEL_FILTER_MAX_LEN already declared earlier in this bench.

function parseStoragePanelExportJson(raw) {
  if (typeof raw !== "string") return null;
  if (raw.trim() === "") return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const obj = parsed;
  if (obj.schemaVersion !== 1) return null;
  if (typeof obj.exportedAt !== "string") return null;
  if (obj.panelState === null || typeof obj.panelState !== "object" || Array.isArray(obj.panelState)) return null;
  const ps = obj.panelState;
  if (ps.scope !== "tree" && ps.scope !== "all") return null;
  if (ps.sort !== "bytes-desc" && ps.sort !== "name-asc") return null;
  if (typeof ps.filter !== "string") return null;
  if (typeof ps.collapsedOther !== "boolean") return null;
  const importedFilter =
    ps.filter.length > STORAGE_PANEL_FILTER_MAX_LEN
      ? ps.filter.slice(0, STORAGE_PANEL_FILTER_MAX_LEN)
      : ps.filter;
  if (!Array.isArray(obj.entries)) return null;
  const entries = [];
  for (const e of obj.entries) {
    if (e === null || typeof e !== "object" || Array.isArray(e)) return null;
    const er = e;
    if (typeof er.key !== "string") return null;
    if (typeof er.value !== "string") return null;
    if (typeof er.bytes !== "number" || !Number.isFinite(er.bytes)) return null;
    if (er.category !== "tree" && er.category !== "dropin" && er.category !== "other") return null;
    entries.push({ key: er.key, value: er.value, bytes: er.bytes, category: er.category });
  }
  let metadata;
  if (obj.metadata !== null && typeof obj.metadata === "object" && !Array.isArray(obj.metadata)) {
    const mr = obj.metadata;
    if (
      typeof mr.dropinSchemaVersion === "number" &&
      Number.isFinite(mr.dropinSchemaVersion) &&
      typeof mr.userAgent === "string" &&
      (mr.appVersion === null || typeof mr.appVersion === "string")
    ) {
      metadata = {
        dropinSchemaVersion: mr.dropinSchemaVersion,
        userAgent: mr.userAgent,
        appVersion: mr.appVersion,
      };
    }
  }
  const total = entries.reduce(
    (acc, e) => { acc.count++; acc.bytes += e.bytes; return acc; },
    { count: 0, bytes: 0 },
  );
  const out = {
    schemaVersion: 1,
    exportedAt: obj.exportedAt,
    panelState: { scope: ps.scope, filter: importedFilter, sort: ps.sort, collapsedOther: ps.collapsedOther },
    entries,
    summary: { total, byCategory: summarizeStoredEntriesByCategory(entries) },
  };
  if (metadata !== undefined) out.metadata = metadata;
  return out;
}

// parse — empty / whitespace input → null.
{
  assertEq("qqq-1: empty string → null", parseStoragePanelExportJson(""), null);
  assertEq("qqq-2: whitespace → null", parseStoragePanelExportJson("   \n\t"), null);
}

// parse — malformed JSON → null.
{
  assertEq("qqq-3: malformed → null", parseStoragePanelExportJson("{not-json}"), null);
  assertEq("qqq-4: truncated → null", parseStoragePanelExportJson('{"a"'), null);
}

// parse — null root / array root → null.
{
  assertEq("qqq-5: JSON null → null", parseStoragePanelExportJson("null"), null);
  assertEq("qqq-6: array root → null", parseStoragePanelExportJson("[]"), null);
}

// parse — wrong schemaVersion → null.
{
  const bad = JSON.stringify({ schemaVersion: 2, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [], summary: {} });
  assertEq("qqq-7: schemaVersion 2 → null", parseStoragePanelExportJson(bad), null);
}

// parse — missing exportedAt → null.
{
  const bad = JSON.stringify({ schemaVersion: 1, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [] });
  assertEq("qqq-8: missing exportedAt → null", parseStoragePanelExportJson(bad), null);
}

// parse — invalid scope → null.
{
  const bad = JSON.stringify({ schemaVersion: 1, exportedAt: "x", panelState: { scope: "invalid", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [] });
  assertEq("qqq-9: invalid scope → null", parseStoragePanelExportJson(bad), null);
}

// parse — invalid sort → null.
{
  const bad = JSON.stringify({ schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "invalid", collapsedOther: false }, entries: [] });
  assertEq("qqq-10: invalid sort → null", parseStoragePanelExportJson(bad), null);
}

// parse — collapsedOther wrong type → null.
{
  const bad = JSON.stringify({ schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: "no" }, entries: [] });
  assertEq("qqq-11: collapsedOther string → null", parseStoragePanelExportJson(bad), null);
}

// parse — entries not array → null.
{
  const bad = JSON.stringify({ schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: "x" });
  assertEq("qqq-12: entries non-array → null", parseStoragePanelExportJson(bad), null);
}

// parse — entry missing field → null.
{
  const bad = JSON.stringify({ schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [{ key: "k", value: "v" }] });
  assertEq("qqq-13: entry missing bytes → null", parseStoragePanelExportJson(bad), null);
}

// parse — entry invalid category → null.
{
  const bad = JSON.stringify({ schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [{ key: "k", value: "v", bytes: 2, category: "weird" }] });
  assertEq("qqq-14: entry invalid category → null", parseStoragePanelExportJson(bad), null);
}

// parse — valid export roundtrips through build → parse.
{
  const inp = [
    { key: "k1", value: "v1", bytes: 4, category: "tree" },
    { key: "k2", value: "vv", bytes: 4, category: "dropin" },
  ];
  const built = buildStoragePanelExportV2(inp, fixedPanelState, fixedExportedAt, fixedMetadata);
  const json = JSON.stringify(built);
  const parsed = parseStoragePanelExportJson(json);
  assertEq("qqq-15: roundtrip yields non-null", parsed === null, false);
  assertEq("qqq-16: roundtrip schemaVersion 1", parsed.schemaVersion, 1);
  assertEq("qqq-17: roundtrip exportedAt", parsed.exportedAt, fixedExportedAt);
  assertEq("qqq-18: roundtrip scope", parsed.panelState.scope, "all");
  assertEq("qqq-19: roundtrip filter", parsed.panelState.filter, "depth");
  assertEq("qqq-20: roundtrip sort", parsed.panelState.sort, "bytes-desc");
  assertEq("qqq-21: roundtrip collapsedOther", parsed.panelState.collapsedOther, true);
  assertEq("qqq-22: roundtrip entries length", parsed.entries.length, 2);
  assertEq("qqq-23: roundtrip metadata.userAgent", parsed.metadata.userAgent, "Mozilla/5.0 (Test)");
  assertEq("qqq-24: roundtrip total count", parsed.summary.total.count, 2);
  assertEq("qqq-25: roundtrip total bytes", parsed.summary.total.bytes, 8);
}

// parse — pre-ttt export (no metadata field) → parses successfully.
{
  const built = buildStoragePanelExportV2([], fixedPanelState, fixedExportedAt);
  const json = JSON.stringify(built);
  const parsed = parseStoragePanelExportJson(json);
  assertEq("qqq-26: missing metadata accepted", parsed === null, false);
  assertEq("qqq-27: missing metadata absent in result", "metadata" in parsed, false);
}

// parse — malformed metadata → dropped silently, rest of import succeeds.
{
  const obj = { schemaVersion: 1, exportedAt: "x", metadata: { dropinSchemaVersion: "not-a-number", userAgent: "UA" }, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [] };
  const json = JSON.stringify(obj);
  const parsed = parseStoragePanelExportJson(json);
  assertEq("qqq-28: malformed metadata import succeeds", parsed === null, false);
  assertEq("qqq-29: malformed metadata dropped", "metadata" in parsed, false);
}

// parse — caps long filter at MAX_LEN.
{
  const longFilter = "a".repeat(STORAGE_PANEL_FILTER_MAX_LEN + 100);
  const obj = { schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: longFilter, sort: "bytes-desc", collapsedOther: false }, entries: [] };
  const parsed = parseStoragePanelExportJson(JSON.stringify(obj));
  assertEq("qqq-30: long filter capped on import", parsed.panelState.filter.length, STORAGE_PANEL_FILTER_MAX_LEN);
}

// parse — summary re-derived from entries (not asserted).
{
  // Export with deliberately-wrong summary (count = 999) — re-derived to actual.
  const obj = { schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [{ key: "k", value: "v", bytes: 2, category: "tree" }], summary: { total: { count: 999, bytes: 999 }, byCategory: {} } };
  const parsed = parseStoragePanelExportJson(JSON.stringify(obj));
  assertEq("qqq-31: summary re-derived count", parsed.summary.total.count, 1);
  assertEq("qqq-32: summary re-derived bytes", parsed.summary.total.bytes, 2);
}

// parse — defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelExportJson("");
    parseStoragePanelExportJson("{}");
    parseStoragePanelExportJson("[]");
    parseStoragePanelExportJson("null");
    parseStoragePanelExportJson("invalid");
    parseStoragePanelExportJson(JSON.stringify({ schemaVersion: 1 }));
  } catch {
    didThrow = true;
  }
  assertEq("qqq-33: parser does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-ninth-pass chunk (sss): export filename sanitizer ==========

const STORAGE_PANEL_EXPORT_FILENAME_DEFAULT = "dropin-tree-storage";
const STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN = 64;

function sanitizeStoragePanelExportFilename(raw) {
  let s = raw.replace(/[/\\:*?"<>|]/g, "");
  s = s.replace(/[\x00-\x1f\x7f]/g, "");
  s = s.replace(/^[.\s]+/, "");
  s = s.replace(/[.\s]+$/, "");
  if (s.length > STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN) {
    s = s.slice(0, STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN);
  }
  if (s.length === 0) return STORAGE_PANEL_EXPORT_FILENAME_DEFAULT;
  return s;
}

function parseStoragePanelExportFilename(raw) {
  if (raw === null) return STORAGE_PANEL_EXPORT_FILENAME_DEFAULT;
  return sanitizeStoragePanelExportFilename(raw);
}

// sanitize — empty → default.
{
  assertEq("sss-1: empty input → default", sanitizeStoragePanelExportFilename(""), STORAGE_PANEL_EXPORT_FILENAME_DEFAULT);
  assertEq("sss-2: whitespace → default", sanitizeStoragePanelExportFilename("   "), STORAGE_PANEL_EXPORT_FILENAME_DEFAULT);
  assertEq("sss-3: all-stripped → default", sanitizeStoragePanelExportFilename("///\\\\:::"), STORAGE_PANEL_EXPORT_FILENAME_DEFAULT);
}

// sanitize — clean valid input passes through.
{
  assertEq("sss-4: valid alpha", sanitizeStoragePanelExportFilename("my-shop"), "my-shop");
  assertEq("sss-5: valid alphanumeric", sanitizeStoragePanelExportFilename("blog-2026"), "blog-2026");
  assertEq("sss-6: valid underscore", sanitizeStoragePanelExportFilename("my_app_state"), "my_app_state");
}

// sanitize — strip path separators.
{
  assertEq("sss-7: forward slash", sanitizeStoragePanelExportFilename("foo/bar"), "foobar");
  assertEq("sss-8: back slash", sanitizeStoragePanelExportFilename("foo\\bar"), "foobar");
  assertEq("sss-9: colon", sanitizeStoragePanelExportFilename("c:filename"), "cfilename");
  assertEq("sss-10: asterisk", sanitizeStoragePanelExportFilename("file*name"), "filename");
  assertEq("sss-11: question mark", sanitizeStoragePanelExportFilename("file?name"), "filename");
  assertEq("sss-12: angle brackets", sanitizeStoragePanelExportFilename("file<bar>"), "filebar");
  assertEq("sss-13: pipe", sanitizeStoragePanelExportFilename("foo|bar"), "foobar");
  assertEq("sss-14: dquote", sanitizeStoragePanelExportFilename('foo"bar"'), "foobar");
}

// sanitize — strip control chars.
{
  assertEq("sss-15: null byte", sanitizeStoragePanelExportFilename("foo\x00bar"), "foobar");
  assertEq("sss-16: tab", sanitizeStoragePanelExportFilename("foo\tbar"), "foobar");
  assertEq("sss-17: newline", sanitizeStoragePanelExportFilename("foo\nbar"), "foobar");
  assertEq("sss-18: DEL", sanitizeStoragePanelExportFilename("foo\x7fbar"), "foobar");
}

// sanitize — leading dot stripped.
{
  assertEq("sss-19: single leading dot", sanitizeStoragePanelExportFilename(".foo"), "foo");
  assertEq("sss-20: multiple leading dots", sanitizeStoragePanelExportFilename("...foo"), "foo");
  assertEq("sss-21: dots + leading whitespace", sanitizeStoragePanelExportFilename(" . foo"), "foo");
  // Internal dots OK.
  assertEq("sss-22: internal dot kept", sanitizeStoragePanelExportFilename("foo.bar"), "foo.bar");
}

// sanitize — trailing whitespace + dots stripped.
{
  assertEq("sss-23: trailing whitespace", sanitizeStoragePanelExportFilename("foo   "), "foo");
  assertEq("sss-24: trailing dot", sanitizeStoragePanelExportFilename("foo."), "foo");
  assertEq("sss-25: trailing dots + whitespace", sanitizeStoragePanelExportFilename("foo. .. "), "foo");
}

// sanitize — length cap.
{
  const long = "a".repeat(STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN + 50);
  const result = sanitizeStoragePanelExportFilename(long);
  assertEq("sss-26: long input capped", result.length, STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN);
  // At-cap input passes unchanged.
  const atCap = "b".repeat(STORAGE_PANEL_EXPORT_FILENAME_MAX_LEN);
  assertEq("sss-27: at-cap unchanged", sanitizeStoragePanelExportFilename(atCap), atCap);
}

// sanitize — idempotent.
{
  const inputs = ["foo/bar", ".foo.", "  bar  ", "valid-name"];
  for (let i = 0; i < inputs.length; i++) {
    const once = sanitizeStoragePanelExportFilename(inputs[i]);
    const twice = sanitizeStoragePanelExportFilename(once);
    assertEq(`sss-28.${i}: idempotent on ${JSON.stringify(inputs[i])}`, once, twice);
  }
}

// parseStoragePanelExportFilename — null → default.
{
  assertEq("sss-29: null raw → default", parseStoragePanelExportFilename(null), STORAGE_PANEL_EXPORT_FILENAME_DEFAULT);
  assertEq("sss-30: empty string → default", parseStoragePanelExportFilename(""), STORAGE_PANEL_EXPORT_FILENAME_DEFAULT);
}

// sanitize — pure (input unchanged).
{
  const inp = "foo/bar";
  const before = inp;
  sanitizeStoragePanelExportFilename(inp);
  assertEq("sss-31: input string unchanged", inp, before);
}

// sanitize — defense-in-depth.
{
  let didThrow = false;
  try {
    sanitizeStoragePanelExportFilename("");
    sanitizeStoragePanelExportFilename("\x00\x01\x02");
    sanitizeStoragePanelExportFilename("\\\\:::***");
    sanitizeStoragePanelExportFilename("...");
    sanitizeStoragePanelExportFilename("a".repeat(10000));
  } catch {
    didThrow = true;
  }
  assertEq("sss-32: sanitize does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-ninth-pass chunk (vvv): pretty-print JSON values ===========

function tryFormatJsonValue(value) {
  if (typeof value !== "string") return null;
  if (value.trim() === "") return null;
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }
  if (parsed === null) return null;
  if (typeof parsed !== "object") return null;
  return JSON.stringify(parsed, null, 2);
}

// vvv — null / empty / non-string → null.
{
  assertEq("vvv-1: empty string → null", tryFormatJsonValue(""), null);
  assertEq("vvv-2: whitespace → null", tryFormatJsonValue("   "), null);
  assertEq("vvv-3: invalid JSON → null", tryFormatJsonValue("not-json"), null);
  assertEq("vvv-4: truncated JSON → null", tryFormatJsonValue('{"a"'), null);
}

// vvv — JSON primitives → null (no reformat needed).
{
  assertEq("vvv-5: number primitive → null", tryFormatJsonValue("42"), null);
  assertEq("vvv-6: string primitive → null", tryFormatJsonValue('"hello"'), null);
  assertEq("vvv-7: bool primitive → null", tryFormatJsonValue("true"), null);
  assertEq("vvv-8: null primitive → null", tryFormatJsonValue("null"), null);
}

// vvv — object → pretty-printed.
{
  const r = tryFormatJsonValue('{"a":1,"b":2}');
  assertEq("vvv-9: object pretty-printed", r === null, false);
  assertEq("vvv-10: pretty has newlines", r.includes("\n"), true);
  assertEq("vvv-11: pretty has 2-space indent", r.includes('  "a"'), true);
}

// vvv — array → pretty-printed.
{
  const r = tryFormatJsonValue("[1,2,3]");
  assertEq("vvv-12: array pretty-printed", r === null, false);
  assertEq("vvv-13: array pretty has newlines", r.includes("\n"), true);
}

// vvv — nested → pretty-printed.
{
  const r = tryFormatJsonValue('{"nested":{"key":"value"}}');
  assertEq("vvv-14: nested object pretty-printed", r === null, false);
  // Roundtrip via JSON.parse should give the same data.
  const parsed = JSON.parse(r);
  assertEq("vvv-15: roundtrip preserves nested key", parsed.nested.key, "value");
}

// vvv — empty object / array.
{
  assertEq("vvv-16: empty object", tryFormatJsonValue("{}"), "{}");
  assertEq("vvv-17: empty array", tryFormatJsonValue("[]"), "[]");
}

// vvv — pure (input unchanged).
{
  const inp = '{"a":1}';
  tryFormatJsonValue(inp);
  assertEq("vvv-18: input unchanged", inp, '{"a":1}');
}

// vvv — defense-in-depth.
{
  let didThrow = false;
  try {
    tryFormatJsonValue("");
    tryFormatJsonValue("not-json");
    tryFormatJsonValue("{");
    tryFormatJsonValue('{"a":1}');
    tryFormatJsonValue("[1,2,3]");
    tryFormatJsonValue("null");
  } catch {
    didThrow = true;
  }
  assertEq("vvv-19: tryFormatJsonValue does not throw on edge inputs", didThrow, false);
}

// ===== Thirty-ninth-pass chunks (vvv/ppp/sss): boolean/string parsers ====

function parseStoragePanelPrettyPrint(raw) {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return false;
}

function parseStoragePanelHideValues(raw) {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return false;
}

// boolean parsers — accept "1"/"0".
{
  assertEq('vvv-20: pretty-print "1" → true', parseStoragePanelPrettyPrint("1"), true);
  assertEq('vvv-21: pretty-print "0" → false', parseStoragePanelPrettyPrint("0"), false);
  assertEq("vvv-22: pretty-print null → default", parseStoragePanelPrettyPrint(null), false);
  assertEq("vvv-23: pretty-print 'true' (verbose) → default", parseStoragePanelPrettyPrint("true"), false);
  assertEq('ppp-1: hide-values "1" → true', parseStoragePanelHideValues("1"), true);
  assertEq('ppp-2: hide-values "0" → false', parseStoragePanelHideValues("0"), false);
  assertEq("ppp-3: hide-values null → default", parseStoragePanelHideValues(null), false);
  assertEq('ppp-4: hide-values "00" → default', parseStoragePanelHideValues("00"), false);
  assertEq('ppp-5: hide-values "01" → default', parseStoragePanelHideValues("01"), false);
}

// boolean parsers — defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelPrettyPrint(null);
    parseStoragePanelPrettyPrint("");
    parseStoragePanelPrettyPrint("garbage");
    parseStoragePanelPrettyPrint("1");
    parseStoragePanelHideValues(null);
    parseStoragePanelHideValues("");
    parseStoragePanelHideValues("garbage");
    parseStoragePanelHideValues("1");
  } catch {
    didThrow = true;
  }
  assertEq("ppp-6: boolean parsers do not throw on edge inputs", didThrow, false);
}

// ===== Fortieth-pass chunk (zzz): value truncation override =============

const STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT = 200;
const STORAGE_PANEL_VALUE_TRUNCATION_MIN = 50;
const STORAGE_PANEL_VALUE_TRUNCATION_MAX = 5000;

function parseStoragePanelValueTruncation(raw) {
  if (raw === null) return STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT;
  if (raw.trim() === "") return STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT;
  const n = Number(raw);
  if (!Number.isFinite(n)) return STORAGE_PANEL_VALUE_TRUNCATION_DEFAULT;
  if (n < STORAGE_PANEL_VALUE_TRUNCATION_MIN) return STORAGE_PANEL_VALUE_TRUNCATION_MIN;
  if (n > STORAGE_PANEL_VALUE_TRUNCATION_MAX) return STORAGE_PANEL_VALUE_TRUNCATION_MAX;
  return Math.floor(n);
}

// parse — null → default.
{
  assertEq("zzz-1: null → default", parseStoragePanelValueTruncation(null), 200);
  assertEq("zzz-2: empty string → default", parseStoragePanelValueTruncation(""), 200);
}

// parse — valid range passes through.
{
  assertEq("zzz-3: 200 passes (default)", parseStoragePanelValueTruncation("200"), 200);
  assertEq("zzz-4: 50 passes (min)", parseStoragePanelValueTruncation("50"), 50);
  assertEq("zzz-5: 5000 passes (max)", parseStoragePanelValueTruncation("5000"), 5000);
  assertEq("zzz-6: 100 passes", parseStoragePanelValueTruncation("100"), 100);
  assertEq("zzz-7: 1000 passes", parseStoragePanelValueTruncation("1000"), 1000);
}

// parse — out-of-range clamped.
{
  assertEq("zzz-8: 0 → min 50", parseStoragePanelValueTruncation("0"), 50);
  assertEq("zzz-9: 10 → min 50", parseStoragePanelValueTruncation("10"), 50);
  assertEq("zzz-10: -100 → min 50", parseStoragePanelValueTruncation("-100"), 50);
  assertEq("zzz-11: 9999 → max 5000", parseStoragePanelValueTruncation("9999"), 5000);
  assertEq("zzz-12: 1000000 → max 5000", parseStoragePanelValueTruncation("1000000"), 5000);
}

// parse — non-numeric / NaN / Infinity → default.
{
  assertEq("zzz-13: 'abc' → default", parseStoragePanelValueTruncation("abc"), 200);
  assertEq("zzz-14: 'NaN' → default", parseStoragePanelValueTruncation("NaN"), 200);
  assertEq("zzz-15: 'Infinity' → default", parseStoragePanelValueTruncation("Infinity"), 200);
}

// parse — float floored.
{
  assertEq("zzz-16: 100.7 → 100", parseStoragePanelValueTruncation("100.7"), 100);
  assertEq("zzz-17: 4999.99 → 4999", parseStoragePanelValueTruncation("4999.99"), 4999);
}

// parse — defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelValueTruncation(null);
    parseStoragePanelValueTruncation("");
    parseStoragePanelValueTruncation("100");
    parseStoragePanelValueTruncation("garbage");
    parseStoragePanelValueTruncation("0");
    parseStoragePanelValueTruncation("99999");
  } catch {
    didThrow = true;
  }
  assertEq("zzz-18: parse does not throw on edge inputs", didThrow, false);
}

// ===== Fortieth-pass chunk (ooo): per-category collapse =================

function partitionAllEntriesByCategoryCollapse(entries, collapsed) {
  const hidden = {
    tree: { count: 0, bytes: 0 },
    dropin: { count: 0, bytes: 0 },
    other: { count: 0, bytes: 0 },
  };
  const visible = [];
  for (const e of entries) {
    if (collapsed[e.category]) {
      hidden[e.category].count++;
      hidden[e.category].bytes += e.bytes;
    } else {
      visible.push(e);
    }
  }
  return { visible, hidden };
}

// partition — empty input → empty visible + zero hidden.
{
  const r = partitionAllEntriesByCategoryCollapse([], { tree: false, dropin: false, other: false });
  assertEq("ooo-1: empty visible", r.visible.length, 0);
  assertEq("ooo-2: empty hidden tree", r.hidden.tree.count, 0);
  assertEq("ooo-3: empty hidden dropin", r.hidden.dropin.count, 0);
  assertEq("ooo-4: empty hidden other", r.hidden.other.count, 0);
}

// partition — none collapsed → all visible.
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 4, category: "dropin" },
    { key: "k3", value: "v", bytes: 5, category: "other" },
  ];
  const r = partitionAllEntriesByCategoryCollapse(inp, { tree: false, dropin: false, other: false });
  assertEq("ooo-5: none collapsed visible length", r.visible.length, 3);
  assertEq("ooo-6: none collapsed hidden total", r.hidden.tree.count + r.hidden.dropin.count + r.hidden.other.count, 0);
}

// partition — only tree collapsed.
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 4, category: "dropin" },
    { key: "k3", value: "v", bytes: 5, category: "other" },
  ];
  const r = partitionAllEntriesByCategoryCollapse(inp, { tree: true, dropin: false, other: false });
  assertEq("ooo-7: tree collapsed visible length", r.visible.length, 2);
  assertEq("ooo-8: tree collapsed hidden tree count", r.hidden.tree.count, 1);
  assertEq("ooo-9: tree collapsed hidden tree bytes", r.hidden.tree.bytes, 3);
  assertEq("ooo-10: tree collapsed hidden dropin zero", r.hidden.dropin.count, 0);
  assertEq("ooo-11: tree collapsed hidden other zero", r.hidden.other.count, 0);
}

// partition — only dropin collapsed.
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 4, category: "dropin" },
    { key: "k3", value: "v", bytes: 4, category: "dropin" },
  ];
  const r = partitionAllEntriesByCategoryCollapse(inp, { tree: false, dropin: true, other: false });
  assertEq("ooo-12: dropin collapsed visible length", r.visible.length, 1);
  assertEq("ooo-13: dropin collapsed hidden dropin count", r.hidden.dropin.count, 2);
  assertEq("ooo-14: dropin collapsed hidden dropin bytes", r.hidden.dropin.bytes, 8);
}

// partition — only other collapsed (matches chunk-mmm shape exactly).
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 4, category: "other" },
  ];
  const r = partitionAllEntriesByCategoryCollapse(inp, { tree: false, dropin: false, other: true });
  assertEq("ooo-15: other collapsed visible length", r.visible.length, 1);
  assertEq("ooo-16: other collapsed hidden other count", r.hidden.other.count, 1);
  assertEq("ooo-17: other collapsed hidden other bytes", r.hidden.other.bytes, 4);
}

// partition — all three collapsed.
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 4, category: "dropin" },
    { key: "k3", value: "v", bytes: 5, category: "other" },
  ];
  const r = partitionAllEntriesByCategoryCollapse(inp, { tree: true, dropin: true, other: true });
  assertEq("ooo-18: all collapsed visible empty", r.visible.length, 0);
  assertEq("ooo-19: all collapsed hidden tree", r.hidden.tree.count, 1);
  assertEq("ooo-20: all collapsed hidden dropin", r.hidden.dropin.count, 1);
  assertEq("ooo-21: all collapsed hidden other", r.hidden.other.count, 1);
}

// partition — visible preserves input order.
{
  const inp = [
    { key: "z", value: "v", bytes: 2, category: "tree" },
    { key: "a", value: "v", bytes: 2, category: "dropin" },
    { key: "m", value: "v", bytes: 2, category: "tree" },
  ];
  const r = partitionAllEntriesByCategoryCollapse(inp, { tree: false, dropin: true, other: false });
  assertEq("ooo-22: order[0]", r.visible[0].key, "z");
  assertEq("ooo-23: order[1]", r.visible[1].key, "m");
}

// partition — pure (input not mutated).
{
  const inp = [
    { key: "k1", value: "v", bytes: 3, category: "tree" },
    { key: "k2", value: "v", bytes: 4, category: "other" },
  ];
  const before = inp.length;
  partitionAllEntriesByCategoryCollapse(inp, { tree: true, dropin: false, other: true });
  assertEq("ooo-24: input length unchanged", inp.length, before);
  assertEq("ooo-25: input[0] unchanged", inp[0].category, "tree");
}

// partition — bytes accumulate per category.
{
  const inp = [
    { key: "k1", value: "v", bytes: 10, category: "tree" },
    { key: "k2", value: "v", bytes: 20, category: "tree" },
    { key: "k3", value: "v", bytes: 30, category: "tree" },
  ];
  const r = partitionAllEntriesByCategoryCollapse(inp, { tree: true, dropin: false, other: false });
  assertEq("ooo-26: bytes accumulate", r.hidden.tree.bytes, 60);
  assertEq("ooo-27: count accumulates", r.hidden.tree.count, 3);
}

// partition — defense-in-depth.
{
  let didThrow = false;
  try {
    partitionAllEntriesByCategoryCollapse([], { tree: false, dropin: false, other: false });
    partitionAllEntriesByCategoryCollapse([], { tree: true, dropin: true, other: true });
    partitionAllEntriesByCategoryCollapse([{ key: "k", value: "v", bytes: 2, category: "tree" }], { tree: true, dropin: false, other: false });
  } catch {
    didThrow = true;
  }
  assertEq("ooo-28: partition does not throw on edge inputs", didThrow, false);
}

// boolean parsers for tree + dropin collapse — same as chunk-mmm shape.
function parseStoragePanelCollapsedTree(raw) {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return false;
}
function parseStoragePanelCollapsedDropin(raw) {
  if (raw === "1") return true;
  if (raw === "0") return false;
  return false;
}

// Tree / dropin collapse parsers — strict literal "1"/"0".
{
  assertEq("ooo-29: tree '1' → true", parseStoragePanelCollapsedTree("1"), true);
  assertEq("ooo-30: tree '0' → false", parseStoragePanelCollapsedTree("0"), false);
  assertEq("ooo-31: tree null → default false", parseStoragePanelCollapsedTree(null), false);
  assertEq("ooo-32: tree 'true' → default", parseStoragePanelCollapsedTree("true"), false);
  assertEq("ooo-33: dropin '1' → true", parseStoragePanelCollapsedDropin("1"), true);
  assertEq("ooo-34: dropin '0' → false", parseStoragePanelCollapsedDropin("0"), false);
  assertEq("ooo-35: dropin null → default false", parseStoragePanelCollapsedDropin(null), false);
  assertEq("ooo-36: dropin '01' → default", parseStoragePanelCollapsedDropin("01"), false);
}

// ===== Fortieth-pass chunk (eeee): detailed parse result =================

function parseStoragePanelExportJsonDetail(raw) {
  if (typeof raw !== "string") {
    return { kind: "error", reason: "raw input is not a string" };
  }
  if (raw.trim() === "") {
    return { kind: "error", reason: "input is empty" };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const msg = err instanceof Error && typeof err.message === "string" ? err.message : "JSON.parse failed";
    return { kind: "error", reason: `malformed JSON: ${msg}` };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { kind: "error", reason: "root must be a JSON object (got null / array / primitive)" };
  }
  const obj = parsed;
  if (obj.schemaVersion !== 1) {
    return { kind: "error", reason: `schemaVersion: expected 1, got ${JSON.stringify(obj.schemaVersion)}` };
  }
  if (typeof obj.exportedAt !== "string") {
    return { kind: "error", reason: "exportedAt: expected string" };
  }
  if (obj.panelState === null || typeof obj.panelState !== "object" || Array.isArray(obj.panelState)) {
    return { kind: "error", reason: "panelState: expected object" };
  }
  const ps = obj.panelState;
  if (ps.scope !== "tree" && ps.scope !== "all") {
    return { kind: "error", reason: `panelState.scope: expected "tree" or "all", got ${JSON.stringify(ps.scope)}` };
  }
  if (ps.sort !== "bytes-desc" && ps.sort !== "name-asc") {
    return { kind: "error", reason: `panelState.sort: expected "bytes-desc" or "name-asc", got ${JSON.stringify(ps.sort)}` };
  }
  if (typeof ps.filter !== "string") {
    return { kind: "error", reason: "panelState.filter: expected string" };
  }
  if (typeof ps.collapsedOther !== "boolean") {
    return { kind: "error", reason: "panelState.collapsedOther: expected boolean" };
  }
  if (!Array.isArray(obj.entries)) {
    return { kind: "error", reason: "entries: expected array" };
  }
  const legacy = parseStoragePanelExportJson(raw);
  if (legacy === null) {
    return { kind: "error", reason: "an entry failed validation (key/value/bytes/category mismatch)" };
  }
  return { kind: "ok", value: legacy };
}

// Detailed — empty / whitespace.
{
  const r1 = parseStoragePanelExportJsonDetail("");
  assertEq("eeee-1: empty kind", r1.kind, "error");
  assertEq("eeee-2: empty reason mentions 'empty'", r1.reason.includes("empty"), true);
  const r2 = parseStoragePanelExportJsonDetail("   \n  ");
  assertEq("eeee-3: whitespace kind", r2.kind, "error");
}

// Detailed — malformed JSON.
{
  const r = parseStoragePanelExportJsonDetail("{not-json");
  assertEq("eeee-4: malformed kind", r.kind, "error");
  assertEq("eeee-5: malformed reason mentions 'malformed JSON'", r.reason.startsWith("malformed JSON"), true);
}

// Detailed — array root.
{
  const r = parseStoragePanelExportJsonDetail("[]");
  assertEq("eeee-6: array root kind", r.kind, "error");
  assertEq("eeee-7: array root reason mentions 'root'", r.reason.includes("root"), true);
}

// Detailed — wrong schemaVersion.
{
  const obj = { schemaVersion: 2, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [] };
  const r = parseStoragePanelExportJsonDetail(JSON.stringify(obj));
  assertEq("eeee-8: wrong schemaVersion kind", r.kind, "error");
  assertEq("eeee-9: wrong schemaVersion reason mentions schemaVersion", r.reason.startsWith("schemaVersion"), true);
}

// Detailed — wrong scope.
{
  const obj = { schemaVersion: 1, exportedAt: "x", panelState: { scope: "weird", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [] };
  const r = parseStoragePanelExportJsonDetail(JSON.stringify(obj));
  assertEq("eeee-10: wrong scope kind", r.kind, "error");
  assertEq("eeee-11: wrong scope reason mentions scope", r.reason.includes("scope"), true);
}

// Detailed — wrong sort.
{
  const obj = { schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "weird", collapsedOther: false }, entries: [] };
  const r = parseStoragePanelExportJsonDetail(JSON.stringify(obj));
  assertEq("eeee-12: wrong sort kind", r.kind, "error");
  assertEq("eeee-13: wrong sort reason mentions sort", r.reason.includes("sort"), true);
}

// Detailed — entries non-array.
{
  const obj = { schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: "x" };
  const r = parseStoragePanelExportJsonDetail(JSON.stringify(obj));
  assertEq("eeee-14: entries non-array kind", r.kind, "error");
  assertEq("eeee-15: entries non-array reason", r.reason.includes("entries"), true);
}

// Detailed — entry validation failure (delegated reason).
{
  const obj = { schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [{ key: "k", value: "v" }] };
  const r = parseStoragePanelExportJsonDetail(JSON.stringify(obj));
  assertEq("eeee-16: entry validation kind", r.kind, "error");
  assertEq("eeee-17: entry validation reason mentions validation", r.reason.includes("validation"), true);
}

// Detailed — valid input → kind 'ok' with full value.
{
  const obj = { schemaVersion: 1, exportedAt: "2026-05-04T12:00:00.000Z", panelState: { scope: "all", filter: "depth", sort: "bytes-desc", collapsedOther: true }, entries: [{ key: "k1", value: "v", bytes: 3, category: "tree" }] };
  const r = parseStoragePanelExportJsonDetail(JSON.stringify(obj));
  assertEq("eeee-18: valid kind ok", r.kind, "ok");
  assertEq("eeee-19: valid value schemaVersion", r.value.schemaVersion, 1);
  assertEq("eeee-20: valid value entries length", r.value.entries.length, 1);
  assertEq("eeee-21: valid value panelState.scope", r.value.panelState.scope, "all");
}

// Detailed — defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelExportJsonDetail("");
    parseStoragePanelExportJsonDetail("{}");
    parseStoragePanelExportJsonDetail("invalid");
    parseStoragePanelExportJsonDetail(JSON.stringify({ schemaVersion: 1 }));
    parseStoragePanelExportJsonDetail(JSON.stringify({ schemaVersion: 1, exportedAt: "x", panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false }, entries: [] }));
  } catch {
    didThrow = true;
  }
  assertEq("eeee-22: detailed parser does not throw on edge inputs", didThrow, false);
}

// Detailed — same shape always returned (kind always 'ok' or 'error').
{
  const inputs = ["", "{}", "[]", "null", "1", "{\"schemaVersion\":1}"];
  for (let i = 0; i < inputs.length; i++) {
    const r = parseStoragePanelExportJsonDetail(inputs[i]);
    const validKind = r.kind === "ok" || r.kind === "error";
    assertEq(`eeee-23.${i}: shape valid for ${JSON.stringify(inputs[i])}`, validKind, true);
  }
}

// ===================================================================
// Forty-first-pass — chunk-iiii / chunk-ffff / chunk-tttt / chunk-jjjj
// ===================================================================

const STORAGE_PANEL_FILTER_MAX_LEN_41 = 256;
const STORAGE_PANEL_FILTER_HISTORY_MAX_ENTRIES_41 = 8;

// Chunk-iiii: parseStoragePanelFilterHistory
function parseStoragePanelFilterHistory_41(raw) {
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out = [];
    const seen = new Set();
    for (const item of parsed) {
      if (typeof item !== "string") continue;
      if (item.length === 0) continue;
      const capped =
        item.length > STORAGE_PANEL_FILTER_MAX_LEN_41
          ? item.slice(0, STORAGE_PANEL_FILTER_MAX_LEN_41)
          : item;
      const folded = capped.toLowerCase();
      if (seen.has(folded)) continue;
      seen.add(folded);
      out.push(capped);
      if (out.length >= STORAGE_PANEL_FILTER_HISTORY_MAX_ENTRIES_41) break;
    }
    return out;
  } catch {
    return [];
  }
}

function appendStoragePanelFilterHistoryEntry_41(existing, query) {
  const trimmed = query.trim();
  if (trimmed === "") return existing.slice();
  const capped =
    trimmed.length > STORAGE_PANEL_FILTER_MAX_LEN_41
      ? trimmed.slice(0, STORAGE_PANEL_FILTER_MAX_LEN_41)
      : trimmed;
  const folded = capped.toLowerCase();
  const out = [capped];
  for (const e of existing) {
    if (e.toLowerCase() === folded) continue;
    out.push(e);
    if (out.length >= STORAGE_PANEL_FILTER_HISTORY_MAX_ENTRIES_41) break;
  }
  return out;
}

// chunk-iiii: null/empty/malformed → empty.
{
  assertEq("iiii-1: null → empty", parseStoragePanelFilterHistory_41(null).length, 0);
  assertEq("iiii-2: '' → empty", parseStoragePanelFilterHistory_41("").length, 0);
  assertEq("iiii-3: malformed → empty", parseStoragePanelFilterHistory_41("not json").length, 0);
  assertEq("iiii-4: object root → empty", parseStoragePanelFilterHistory_41('{"a":1}').length, 0);
  assertEq("iiii-5: null root → empty", parseStoragePanelFilterHistory_41("null").length, 0);
  assertEq("iiii-6: number root → empty", parseStoragePanelFilterHistory_41("42").length, 0);
}

// chunk-iiii: valid array preserves order + filters non-strings + dedupe.
{
  const got = parseStoragePanelFilterHistory_41('["foo","bar","baz"]');
  assertEq("iiii-7: 3 valid", got.length, 3);
  assertEq("iiii-8: order preserved", got.join(","), "foo,bar,baz");

  const filtered = parseStoragePanelFilterHistory_41('["foo",42,null,"bar",true]');
  assertEq("iiii-9: filter non-strings", filtered.length, 2);
  assertEq("iiii-10: foo first", filtered[0], "foo");
  assertEq("iiii-11: bar second", filtered[1], "bar");

  const dedupe = parseStoragePanelFilterHistory_41('["foo","FOO","Foo","bar","BAR"]');
  assertEq("iiii-12: case-folded dedupe", dedupe.length, 2);
  assertEq("iiii-13: first wins (foo)", dedupe[0], "foo");
  assertEq("iiii-14: bar preserved", dedupe[1], "bar");
}

// chunk-iiii: cap at MAX_ENTRIES.
{
  const big = JSON.stringify(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
  const got = parseStoragePanelFilterHistory_41(big);
  assertEq("iiii-15: cap at 8", got.length, 8);
  assertEq("iiii-16: first wins", got[0], "a");
  assertEq("iiii-17: 8th preserved", got[7], "h");
}

// chunk-iiii: empty strings dropped.
{
  const got = parseStoragePanelFilterHistory_41('["","foo","",""]');
  assertEq("iiii-18: empty strings filtered", got.length, 1);
  assertEq("iiii-19: foo preserved", got[0], "foo");
}

// chunk-iiii: each entry capped at MAX_LEN.
{
  const longStr = "x".repeat(500);
  const got = parseStoragePanelFilterHistory_41(JSON.stringify([longStr]));
  assertEq("iiii-20: long entry length capped at MAX_LEN", got[0].length, STORAGE_PANEL_FILTER_MAX_LEN_41);
  assertEq("iiii-21: capped to all x", got[0] === "x".repeat(STORAGE_PANEL_FILTER_MAX_LEN_41), true);
}

// chunk-iiii: appendStoragePanelFilterHistoryEntry — empty query no-op.
{
  const existing = ["a", "b"];
  const got = appendStoragePanelFilterHistoryEntry_41(existing, "");
  assertEq("iiii-22: empty query length unchanged", got.length, 2);
  assertEq("iiii-23: empty query content unchanged", got.join(","), "a,b");
  // Pure: not the same ref.
  assertEq("iiii-24: returns fresh array", got !== existing, true);
}

// chunk-iiii: append prepends with dedupe.
{
  const got = appendStoragePanelFilterHistoryEntry_41(["a", "b"], "c");
  assertEq("iiii-25: prepend new", got.join(","), "c,a,b");

  const dedup = appendStoragePanelFilterHistoryEntry_41(["a", "b"], "A");
  assertEq("iiii-26: case-folded dedupe", dedup.length, 2);
  assertEq("iiii-27: new casing kept (A first)", dedup[0], "A");
  assertEq("iiii-28: only b after dedup", dedup[1], "b");
}

// chunk-iiii: append caps at MAX_ENTRIES.
{
  const existing = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const got = appendStoragePanelFilterHistoryEntry_41(existing, "i");
  assertEq("iiii-29: appended array capped to 8", got.length, 8);
  assertEq("iiii-30: i first", got[0], "i");
  assertEq("iiii-31: oldest dropped (h gone)", got.indexOf("h"), -1);
}

// chunk-iiii: append trims whitespace.
{
  const got = appendStoragePanelFilterHistoryEntry_41([], "  foo  ");
  assertEq("iiii-32: trimmed", got[0], "foo");
}

// chunk-iiii: pure — input not mutated.
{
  const existing = ["a", "b"];
  const before = existing.slice();
  appendStoragePanelFilterHistoryEntry_41(existing, "c");
  assertEq("iiii-33: input unchanged length", existing.length, before.length);
  assertEq("iiii-34: input unchanged contents", existing.join(","), before.join(","));
}

// chunk-iiii: defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelFilterHistory_41(null);
    parseStoragePanelFilterHistory_41("");
    parseStoragePanelFilterHistory_41("garbage");
    parseStoragePanelFilterHistory_41("{}");
    parseStoragePanelFilterHistory_41("[]");
    appendStoragePanelFilterHistoryEntry_41([], "");
    appendStoragePanelFilterHistoryEntry_41([], "x");
  } catch {
    didThrow = true;
  }
  assertEq("iiii-35: chunk-iiii does not throw on edge inputs", didThrow, false);
}

// ===================================================================
// chunk-ffff: parseStoragePanelRecentImports + appendStoragePanelRecentImportEntry
// ===================================================================

const STORAGE_PANEL_RECENT_IMPORTS_MAX_ENTRIES_41 = 5;

function parseStoragePanelRecentImports_41(raw) {
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out = [];
    for (const item of parsed) {
      if (item === null || typeof item !== "object") continue;
      if (typeof item.exportedAt !== "string") continue;
      if (typeof item.addedAt !== "string") continue;
      if (typeof item.entryCount !== "number") continue;
      if (typeof item.totalBytes !== "number") continue;
      if (!Number.isFinite(item.entryCount)) continue;
      if (!Number.isFinite(item.totalBytes)) continue;
      const ps = item.panelState;
      if (ps === null || typeof ps !== "object") continue;
      const scope = ps.scope === "all" ? "all" : ps.scope === "tree" ? "tree" : null;
      const sort = ps.sort === "name-asc" ? "name-asc" : ps.sort === "bytes-desc" ? "bytes-desc" : null;
      if (scope === null) continue;
      if (sort === null) continue;
      if (typeof ps.filter !== "string") continue;
      if (typeof ps.collapsedOther !== "boolean") continue;
      out.push({
        exportedAt: item.exportedAt,
        panelState: { scope, filter: ps.filter, sort, collapsedOther: ps.collapsedOther },
        entryCount: Math.floor(item.entryCount),
        totalBytes: Math.floor(item.totalBytes),
        addedAt: item.addedAt,
      });
      if (out.length >= STORAGE_PANEL_RECENT_IMPORTS_MAX_ENTRIES_41) break;
    }
    return out;
  } catch {
    return [];
  }
}

function appendStoragePanelRecentImportEntry_41(existing, incoming) {
  const out = [incoming];
  for (const e of existing) {
    if (e.exportedAt === incoming.exportedAt) continue;
    out.push(e);
    if (out.length >= STORAGE_PANEL_RECENT_IMPORTS_MAX_ENTRIES_41) break;
  }
  return out;
}

const VALID_IMPORT_41 = {
  exportedAt: "2026-05-04T12:00:00.000Z",
  panelState: { scope: "tree", filter: "depth", sort: "bytes-desc", collapsedOther: true },
  entryCount: 5,
  totalBytes: 256,
  addedAt: "2026-05-04T12:00:01.000Z",
};

// chunk-ffff: null/empty/malformed → empty.
{
  assertEq("ffff-1: null → empty", parseStoragePanelRecentImports_41(null).length, 0);
  assertEq("ffff-2: '' → empty", parseStoragePanelRecentImports_41("").length, 0);
  assertEq("ffff-3: malformed → empty", parseStoragePanelRecentImports_41("not json").length, 0);
  assertEq("ffff-4: object root → empty", parseStoragePanelRecentImports_41("{}").length, 0);
}

// chunk-ffff: valid roundtrip.
{
  const got = parseStoragePanelRecentImports_41(JSON.stringify([VALID_IMPORT_41]));
  assertEq("ffff-5: 1 entry", got.length, 1);
  assertEq("ffff-6: exportedAt", got[0].exportedAt, "2026-05-04T12:00:00.000Z");
  assertEq("ffff-7: scope", got[0].panelState.scope, "tree");
  assertEq("ffff-8: sort", got[0].panelState.sort, "bytes-desc");
  assertEq("ffff-9: filter", got[0].panelState.filter, "depth");
  assertEq("ffff-10: collapsedOther", got[0].panelState.collapsedOther, true);
  assertEq("ffff-11: entryCount", got[0].entryCount, 5);
  assertEq("ffff-12: totalBytes", got[0].totalBytes, 256);
}

// chunk-ffff: missing required fields filtered.
{
  // Missing exportedAt
  let bad = { ...VALID_IMPORT_41 };
  delete bad.exportedAt;
  assertEq("ffff-13: missing exportedAt filtered", parseStoragePanelRecentImports_41(JSON.stringify([bad])).length, 0);

  bad = { ...VALID_IMPORT_41 };
  bad.entryCount = "5";
  assertEq("ffff-14: non-number entryCount filtered", parseStoragePanelRecentImports_41(JSON.stringify([bad])).length, 0);

  bad = { ...VALID_IMPORT_41 };
  bad.entryCount = NaN;
  assertEq("ffff-15: NaN entryCount filtered", parseStoragePanelRecentImports_41(JSON.stringify([bad])).length, 0);

  bad = { ...VALID_IMPORT_41 };
  bad.entryCount = Infinity;
  assertEq("ffff-16: Infinity entryCount filtered", parseStoragePanelRecentImports_41(JSON.stringify([bad])).length, 0);
}

// chunk-ffff: invalid scope/sort filtered.
{
  let bad = { ...VALID_IMPORT_41, panelState: { ...VALID_IMPORT_41.panelState, scope: "weird" } };
  assertEq("ffff-17: invalid scope filtered", parseStoragePanelRecentImports_41(JSON.stringify([bad])).length, 0);

  bad = { ...VALID_IMPORT_41, panelState: { ...VALID_IMPORT_41.panelState, sort: "weird" } };
  assertEq("ffff-18: invalid sort filtered", parseStoragePanelRecentImports_41(JSON.stringify([bad])).length, 0);

  bad = { ...VALID_IMPORT_41, panelState: { ...VALID_IMPORT_41.panelState, filter: 42 } };
  assertEq("ffff-19: non-string filter filtered", parseStoragePanelRecentImports_41(JSON.stringify([bad])).length, 0);

  bad = { ...VALID_IMPORT_41, panelState: { ...VALID_IMPORT_41.panelState, collapsedOther: "true" } };
  assertEq("ffff-20: non-boolean collapsedOther filtered", parseStoragePanelRecentImports_41(JSON.stringify([bad])).length, 0);
}

// chunk-ffff: cap at MAX_ENTRIES.
{
  const big = [];
  for (let i = 0; i < 10; i++) {
    big.push({ ...VALID_IMPORT_41, exportedAt: `2026-05-04T12:00:${String(i).padStart(2, "0")}.000Z` });
  }
  const got = parseStoragePanelRecentImports_41(JSON.stringify(big));
  assertEq("ffff-21: cap at 5", got.length, STORAGE_PANEL_RECENT_IMPORTS_MAX_ENTRIES_41);
  assertEq("ffff-22: first wins", got[0].exportedAt, big[0].exportedAt);
}

// chunk-ffff: append prepends + dedupe by exportedAt.
{
  const got = appendStoragePanelRecentImportEntry_41([], VALID_IMPORT_41);
  assertEq("ffff-23: append to empty length 1", got.length, 1);
  assertEq("ffff-24: incoming first", got[0].exportedAt, VALID_IMPORT_41.exportedAt);

  const second = { ...VALID_IMPORT_41, exportedAt: "2026-05-05T00:00:00.000Z" };
  const got2 = appendStoragePanelRecentImportEntry_41([VALID_IMPORT_41], second);
  assertEq("ffff-25: append two distinct", got2.length, 2);
  assertEq("ffff-26: incoming first", got2[0].exportedAt, second.exportedAt);
  assertEq("ffff-27: previous second", got2[1].exportedAt, VALID_IMPORT_41.exportedAt);

  // dedupe
  const dup = appendStoragePanelRecentImportEntry_41([VALID_IMPORT_41], VALID_IMPORT_41);
  assertEq("ffff-28: dedupe by exportedAt", dup.length, 1);
}

// chunk-ffff: append caps at 5.
{
  const existing = [];
  for (let i = 0; i < 5; i++) {
    existing.push({ ...VALID_IMPORT_41, exportedAt: `2026-05-04T12:0${i}:00.000Z` });
  }
  const incoming = { ...VALID_IMPORT_41, exportedAt: "2026-05-04T13:00:00.000Z" };
  const got = appendStoragePanelRecentImportEntry_41(existing, incoming);
  assertEq("ffff-29: append cap at 5", got.length, 5);
  assertEq("ffff-30: incoming first", got[0].exportedAt, incoming.exportedAt);
  assertEq("ffff-31: oldest dropped", got.findIndex(e => e.exportedAt === existing[4].exportedAt), -1);
}

// chunk-ffff: pure — input not mutated.
{
  const existing = [VALID_IMPORT_41];
  const beforeLen = existing.length;
  appendStoragePanelRecentImportEntry_41(existing, { ...VALID_IMPORT_41, exportedAt: "x" });
  assertEq("ffff-32: input length unchanged", existing.length, beforeLen);
}

// chunk-ffff: defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelRecentImports_41(null);
    parseStoragePanelRecentImports_41("");
    parseStoragePanelRecentImports_41("garbage");
    parseStoragePanelRecentImports_41("[]");
    parseStoragePanelRecentImports_41("[null]");
    appendStoragePanelRecentImportEntry_41([], VALID_IMPORT_41);
  } catch {
    didThrow = true;
  }
  assertEq("ffff-33: chunk-ffff does not throw on edge inputs", didThrow, false);
}

// ===================================================================
// chunk-tttt: parseStoragePanelFilterMode + tryCompileFilterRegex +
// filterStoredEntriesByRegex + splitOnMatchedRegex
// ===================================================================

function parseStoragePanelFilterMode_41(raw) {
  if (raw === "substring") return "substring";
  if (raw === "regex") return "regex";
  return "substring";
}

function tryCompileFilterRegex_41(query) {
  const trimmed = query.trim();
  if (trimmed === "") return null;
  try {
    return new RegExp(trimmed, "i");
  } catch {
    return null;
  }
}

function filterStoredEntriesByRegex_41(entries, regex) {
  if (regex === null) return entries.slice();
  const out = [];
  for (const e of entries) {
    if (regex.test(e.key)) {
      out.push(e);
      continue;
    }
    if (regex.test(e.value)) {
      out.push(e);
    }
  }
  return out;
}

function splitOnMatchedRegex_41(text, regex) {
  if (regex === null || text === "") {
    return [{ text, match: false }];
  }
  const flags = regex.flags.replace(/[gy]/g, "") + "g";
  let walker;
  try {
    walker = new RegExp(regex.source, flags);
  } catch {
    return [{ text, match: false }];
  }
  const out = [];
  let cursor = 0;
  const maxIter = text.length + 1;
  for (let iter = 0; iter < maxIter; iter++) {
    const m = walker.exec(text);
    if (m === null) {
      if (cursor < text.length) {
        out.push({ text: text.slice(cursor), match: false });
      }
      break;
    }
    if (m.index > cursor) {
      out.push({ text: text.slice(cursor, m.index), match: false });
    }
    if (m[0].length === 0) {
      walker.lastIndex = m.index + 1;
      cursor = m.index + 1;
      if (cursor > text.length) break;
      continue;
    }
    out.push({ text: m[0], match: true });
    cursor = m.index + m[0].length;
    if (cursor >= text.length) break;
  }
  if (out.length === 0) return [{ text, match: false }];
  return out;
}

// chunk-tttt: parseStoragePanelFilterMode strict literal match.
{
  assertEq("tttt-1: substring", parseStoragePanelFilterMode_41("substring"), "substring");
  assertEq("tttt-2: regex", parseStoragePanelFilterMode_41("regex"), "regex");
  assertEq("tttt-3: null → default", parseStoragePanelFilterMode_41(null), "substring");
  assertEq("tttt-4: '' → default", parseStoragePanelFilterMode_41(""), "substring");
  assertEq("tttt-5: case-mismatch → default", parseStoragePanelFilterMode_41("Substring"), "substring");
  assertEq("tttt-6: garbage → default", parseStoragePanelFilterMode_41("foo"), "substring");
}

// chunk-tttt: tryCompileFilterRegex.
{
  assertEq("tttt-7: '' → null", tryCompileFilterRegex_41(""), null);
  assertEq("tttt-8: whitespace → null", tryCompileFilterRegex_41("   "), null);
  const r1 = tryCompileFilterRegex_41("foo");
  assertEq("tttt-9: foo compiles", r1 !== null, true);
  assertEq("tttt-10: foo case-insensitive", r1.flags.includes("i"), true);
  const r2 = tryCompileFilterRegex_41("^dropin:tree:");
  assertEq("tttt-11: anchored compiles", r2 !== null, true);
  // Invalid regex
  const r3 = tryCompileFilterRegex_41("[invalid");
  assertEq("tttt-12: invalid regex → null", r3, null);
  const r4 = tryCompileFilterRegex_41("(?P<bad>)"); // Python syntax
  assertEq("tttt-13: invalid named group → null", r4, null);
}

// chunk-tttt: filterStoredEntriesByRegex.
{
  const entries = [
    { key: "dropin:tree:depth:v1", value: "5", bytes: 23 },
    { key: "dropin:tree:expanded:v1", value: "[]", bytes: 25 },
    { key: "other:foo", value: "bar", bytes: 12 },
  ];
  const r1 = tryCompileFilterRegex_41("^dropin:tree:");
  const got1 = filterStoredEntriesByRegex_41(entries, r1);
  assertEq("tttt-14: ^dropin:tree: matches 2", got1.length, 2);
  const r2 = tryCompileFilterRegex_41("depth");
  const got2 = filterStoredEntriesByRegex_41(entries, r2);
  assertEq("tttt-15: depth matches 1", got2.length, 1);
  assertEq("tttt-16: depth match key", got2[0].key, "dropin:tree:depth:v1");
  // null regex returns full copy
  const got3 = filterStoredEntriesByRegex_41(entries, null);
  assertEq("tttt-17: null regex returns full copy", got3.length, 3);
  assertEq("tttt-18: null regex returns fresh array", got3 !== entries, true);
  // Match against value
  const r4 = tryCompileFilterRegex_41("^bar$");
  const got4 = filterStoredEntriesByRegex_41(entries, r4);
  assertEq("tttt-19: match against value", got4.length, 1);
  assertEq("tttt-20: match value key", got4[0].key, "other:foo");
  // No match → empty
  const r5 = tryCompileFilterRegex_41("xyzzy");
  const got5 = filterStoredEntriesByRegex_41(entries, r5);
  assertEq("tttt-21: no match → empty", got5.length, 0);
}

// chunk-tttt: filterStoredEntriesByRegex pure (no input mutation).
{
  const entries = [
    { key: "a", value: "1", bytes: 2 },
    { key: "b", value: "2", bytes: 2 },
  ];
  const before = entries.slice();
  const r = tryCompileFilterRegex_41("a");
  filterStoredEntriesByRegex_41(entries, r);
  assertEq("tttt-22: input length unchanged", entries.length, before.length);
  assertEq("tttt-23: input contents unchanged", entries[0].key, "a");
}

// chunk-tttt: splitOnMatchedRegex.
{
  // null regex → single non-match
  const got1 = splitOnMatchedRegex_41("hello world", null);
  assertEq("tttt-24: null regex single segment", got1.length, 1);
  assertEq("tttt-25: null regex match=false", got1[0].match, false);
  // empty text → single segment
  const got2 = splitOnMatchedRegex_41("", tryCompileFilterRegex_41("foo"));
  assertEq("tttt-26: empty text single segment", got2.length, 1);
  // No match → single non-match
  const got3 = splitOnMatchedRegex_41("hello", tryCompileFilterRegex_41("xyz"));
  assertEq("tttt-27: no match single segment", got3.length, 1);
  assertEq("tttt-28: no match match=false", got3[0].match, false);
  // Match in middle → 3 segments
  const got4 = splitOnMatchedRegex_41("hello world", tryCompileFilterRegex_41("o"));
  // hell, o, ", w, o, rld" → multi matches; split alternates
  // Specifically: hell + match(o) + " w" + match(o) + "rld" = 5 segments
  assertEq("tttt-29: middle multi-match length", got4.length, 5);
  assertEq("tttt-30: 1st non-match", got4[0].match, false);
  assertEq("tttt-31: 2nd is match", got4[1].match, true);
  assertEq("tttt-32: match content", got4[1].text, "o");
  // Anchored start match
  const got5 = splitOnMatchedRegex_41("hello", tryCompileFilterRegex_41("^h"));
  assertEq("tttt-33: anchored 2 segments", got5.length, 2);
  assertEq("tttt-34: anchored first is match", got5[0].match, true);
  assertEq("tttt-35: anchored remainder", got5[1].text, "ello");
  // Full match
  const got6 = splitOnMatchedRegex_41("foo", tryCompileFilterRegex_41("^foo$"));
  assertEq("tttt-36: full match 1 segment", got6.length, 1);
  assertEq("tttt-37: full match=true", got6[0].match, true);
}

// chunk-tttt: splitOnMatchedRegex zero-width safety.
{
  const r = tryCompileFilterRegex_41("(?=x)"); // zero-width lookahead
  // Should not loop forever
  let didFinish = false;
  try {
    const got = splitOnMatchedRegex_41("xxx", r);
    didFinish = true;
    assertEq("tttt-38: zero-width regex returns segments", got.length > 0, true);
  } catch {
    didFinish = false;
  }
  assertEq("tttt-39: zero-width regex completes", didFinish, true);
}

// chunk-tttt: splitOnMatchedRegex preserves text identity (concatenation).
{
  const text = "hello world from regex";
  const got = splitOnMatchedRegex_41(text, tryCompileFilterRegex_41("[aeiou]"));
  const reconstructed = got.map(s => s.text).join("");
  assertEq("tttt-40: segments concat preserves original text", reconstructed, text);
}

// chunk-tttt: defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelFilterMode_41(null);
    parseStoragePanelFilterMode_41("");
    parseStoragePanelFilterMode_41("garbage");
    tryCompileFilterRegex_41("");
    tryCompileFilterRegex_41("[invalid");
    tryCompileFilterRegex_41("foo");
    filterStoredEntriesByRegex_41([], null);
    filterStoredEntriesByRegex_41([], tryCompileFilterRegex_41("a"));
    splitOnMatchedRegex_41("", null);
    splitOnMatchedRegex_41("foo", null);
    splitOnMatchedRegex_41("foo", tryCompileFilterRegex_41("[invalid"));
  } catch {
    didThrow = true;
  }
  assertEq("tttt-41: chunk-tttt does not throw on edge inputs", didThrow, false);
}

// ===================================================================
// chunk-mmmm: tryCompileFilterRegexDetail
// ===================================================================

function tryCompileFilterRegexDetail_41(query) {
  const trimmed = query.trim();
  if (trimmed === "") return { kind: "empty" };
  try {
    return { kind: "ok", regex: new RegExp(trimmed, "i") };
  } catch (err) {
    if (err !== null && typeof err === "object" && "message" in err) {
      const msg = err.message;
      if (typeof msg === "string" && msg.length > 0) {
        return { kind: "error", reason: msg };
      }
    }
    return { kind: "error", reason: "invalid regex" };
  }
}

// chunk-mmmm: empty / whitespace → kind "empty".
{
  assertEq("mmmm-1: '' → kind empty", tryCompileFilterRegexDetail_41("").kind, "empty");
  assertEq("mmmm-2: whitespace → kind empty", tryCompileFilterRegexDetail_41("   ").kind, "empty");
  assertEq("mmmm-3: tabs+newlines → kind empty", tryCompileFilterRegexDetail_41("\t\n  ").kind, "empty");
}

// chunk-mmmm: valid regex → kind "ok" with regex.
{
  const r1 = tryCompileFilterRegexDetail_41("foo");
  assertEq("mmmm-4: foo kind ok", r1.kind, "ok");
  assertEq("mmmm-5: foo regex.source", r1.regex.source, "foo");
  assertEq("mmmm-6: foo case-insensitive", r1.regex.flags.includes("i"), true);

  const r2 = tryCompileFilterRegexDetail_41("^dropin:tree:");
  assertEq("mmmm-7: anchored kind ok", r2.kind, "ok");
  assertEq("mmmm-8: anchored regex.source", r2.regex.source, "^dropin:tree:");
}

// chunk-mmmm: invalid regex → kind "error" with reason.
{
  const r1 = tryCompileFilterRegexDetail_41("[invalid");
  assertEq("mmmm-9: [invalid kind error", r1.kind, "error");
  assertEq("mmmm-10: [invalid reason non-empty", r1.reason.length > 0, true);

  const r2 = tryCompileFilterRegexDetail_41("(?P<bad>)");
  assertEq("mmmm-11: python syntax kind error", r2.kind, "error");
  assertEq("mmmm-12: python syntax reason non-empty", r2.reason.length > 0, true);
}

// chunk-mmmm: defense-in-depth.
{
  let didThrow = false;
  try {
    tryCompileFilterRegexDetail_41("");
    tryCompileFilterRegexDetail_41(" ");
    tryCompileFilterRegexDetail_41("foo");
    tryCompileFilterRegexDetail_41("[invalid");
    tryCompileFilterRegexDetail_41("(?P<bad>)");
  } catch {
    didThrow = true;
  }
  assertEq("mmmm-13: chunk-mmmm does not throw on edge inputs", didThrow, false);
}

// chunk-mmmm: shape always one of the three kinds.
{
  const inputs = ["", "foo", "[invalid", "  ", "(?P<bad>)", "^anchor"];
  for (let i = 0; i < inputs.length; i++) {
    const r = tryCompileFilterRegexDetail_41(inputs[i]);
    const validKind = r.kind === "ok" || r.kind === "empty" || r.kind === "error";
    assertEq(`mmmm-14.${i}: shape valid for ${JSON.stringify(inputs[i])}`, validKind, true);
  }
}

// ===================================================================
// chunk-xxxx: recent-imports sort toggle
// ===================================================================

const STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT_41 = "insertion";

function parseStoragePanelRecentImportsSort_41(raw) {
  if (raw === "insertion") return "insertion";
  if (raw === "added-desc") return "added-desc";
  return STORAGE_PANEL_RECENT_IMPORTS_SORT_DEFAULT_41;
}

function sortStoragePanelRecentImports_41(entries, sort) {
  if (sort === "insertion") return entries.slice();
  const out = entries.slice();
  out.sort((a, b) => {
    if (a.addedAt < b.addedAt) return 1;
    if (a.addedAt > b.addedAt) return -1;
    if (a.exportedAt < b.exportedAt) return 1;
    if (a.exportedAt > b.exportedAt) return -1;
    return 0;
  });
  return out;
}

// chunk-xxxx: parseStoragePanelRecentImportsSort strict 2-element literal.
{
  assertEq(
    "xxxx-1: insertion → insertion",
    parseStoragePanelRecentImportsSort_41("insertion"),
    "insertion",
  );
  assertEq(
    "xxxx-2: added-desc → added-desc",
    parseStoragePanelRecentImportsSort_41("added-desc"),
    "added-desc",
  );
  assertEq(
    "xxxx-3: null → default insertion",
    parseStoragePanelRecentImportsSort_41(null),
    "insertion",
  );
  assertEq(
    "xxxx-4: empty → default",
    parseStoragePanelRecentImportsSort_41(""),
    "insertion",
  );
  assertEq(
    "xxxx-5: garbage → default",
    parseStoragePanelRecentImportsSort_41("garbage"),
    "insertion",
  );
  assertEq(
    "xxxx-6: case-mismatch → default",
    parseStoragePanelRecentImportsSort_41("Insertion"),
    "insertion",
  );
  assertEq(
    "xxxx-7: case-mismatch → default 2",
    parseStoragePanelRecentImportsSort_41("ADDED-DESC"),
    "insertion",
  );
}

// chunk-xxxx: sortStoragePanelRecentImports — empty input → empty output.
{
  const got = sortStoragePanelRecentImports_41([], "insertion");
  assertEq("xxxx-8: empty insertion → empty", got.length, 0);
  const got2 = sortStoragePanelRecentImports_41([], "added-desc");
  assertEq("xxxx-9: empty added-desc → empty", got2.length, 0);
}

// chunk-xxxx: insertion order preserved.
{
  const entries = [
    { exportedAt: "2026-05-04T12:00:00Z", addedAt: "2026-05-04T13:00:00Z", entryCount: 1, totalBytes: 10, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "2026-05-03T12:00:00Z", addedAt: "2026-05-04T13:30:00Z", entryCount: 2, totalBytes: 20, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "2026-05-05T12:00:00Z", addedAt: "2026-05-04T13:15:00Z", entryCount: 3, totalBytes: 30, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
  ];
  const got = sortStoragePanelRecentImports_41(entries, "insertion");
  assertEq("xxxx-10: insertion preserves order", got.length, 3);
  assertEq("xxxx-11: insertion[0]", got[0].exportedAt, "2026-05-04T12:00:00Z");
  assertEq("xxxx-12: insertion[1]", got[1].exportedAt, "2026-05-03T12:00:00Z");
  assertEq("xxxx-13: insertion[2]", got[2].exportedAt, "2026-05-05T12:00:00Z");
  assertEq("xxxx-14: insertion fresh array", got !== entries, true);
}

// chunk-xxxx: added-desc sorts by addedAt descending.
{
  const entries = [
    { exportedAt: "2026-05-04T12:00:00Z", addedAt: "2026-05-04T13:00:00Z", entryCount: 1, totalBytes: 10, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "2026-05-03T12:00:00Z", addedAt: "2026-05-04T13:30:00Z", entryCount: 2, totalBytes: 20, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "2026-05-05T12:00:00Z", addedAt: "2026-05-04T13:15:00Z", entryCount: 3, totalBytes: 30, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
  ];
  const got = sortStoragePanelRecentImports_41(entries, "added-desc");
  assertEq("xxxx-15: added-desc length", got.length, 3);
  assertEq("xxxx-16: added-desc[0] freshest addedAt", got[0].addedAt, "2026-05-04T13:30:00Z");
  assertEq("xxxx-17: added-desc[1] middle addedAt", got[1].addedAt, "2026-05-04T13:15:00Z");
  assertEq("xxxx-18: added-desc[2] oldest addedAt", got[2].addedAt, "2026-05-04T13:00:00Z");
  assertEq("xxxx-19: added-desc fresh array", got !== entries, true);
}

// chunk-xxxx: addedAt ties broken by exportedAt descending.
{
  const sameAddedAt = "2026-05-04T13:00:00Z";
  const entries = [
    { exportedAt: "2026-05-01T12:00:00Z", addedAt: sameAddedAt, entryCount: 1, totalBytes: 10, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "2026-05-03T12:00:00Z", addedAt: sameAddedAt, entryCount: 2, totalBytes: 20, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "2026-05-02T12:00:00Z", addedAt: sameAddedAt, entryCount: 3, totalBytes: 30, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
  ];
  const got = sortStoragePanelRecentImports_41(entries, "added-desc");
  assertEq("xxxx-20: tiebreak[0] newest exportedAt", got[0].exportedAt, "2026-05-03T12:00:00Z");
  assertEq("xxxx-21: tiebreak[1]", got[1].exportedAt, "2026-05-02T12:00:00Z");
  assertEq("xxxx-22: tiebreak[2] oldest exportedAt", got[2].exportedAt, "2026-05-01T12:00:00Z");
}

// chunk-xxxx: pure (no input mutation).
{
  const entries = [
    { exportedAt: "a", addedAt: "1", entryCount: 1, totalBytes: 1, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "b", addedAt: "2", entryCount: 2, totalBytes: 2, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
  ];
  const before = entries.slice();
  sortStoragePanelRecentImports_41(entries, "added-desc");
  assertEq("xxxx-23: input unchanged length", entries.length, before.length);
  assertEq("xxxx-24: input unchanged [0]", entries[0].exportedAt, before[0].exportedAt);
  assertEq("xxxx-25: input unchanged [1]", entries[1].exportedAt, before[1].exportedAt);
}

// chunk-xxxx: defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelRecentImportsSort_41(null);
    parseStoragePanelRecentImportsSort_41("");
    parseStoragePanelRecentImportsSort_41("garbage");
    sortStoragePanelRecentImports_41([], "insertion");
    sortStoragePanelRecentImports_41([], "added-desc");
    sortStoragePanelRecentImports_41(
      [{ exportedAt: "x", addedAt: "y", entryCount: 0, totalBytes: 0, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } }],
      "added-desc",
    );
  } catch {
    didThrow = true;
  }
  assertEq("xxxx-26: chunk-xxxx does not throw on edge inputs", didThrow, false);
}

// chunk-xxxx: identical input under either sort yields equal-length output.
{
  const entries = [
    { exportedAt: "a", addedAt: "1", entryCount: 1, totalBytes: 1, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "b", addedAt: "2", entryCount: 2, totalBytes: 2, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
    { exportedAt: "c", addedAt: "3", entryCount: 3, totalBytes: 3, panelState: { scope: "tree", filter: "", sort: "bytes-desc", collapsedOther: false } },
  ];
  const a = sortStoragePanelRecentImports_41(entries, "insertion");
  const b = sortStoragePanelRecentImports_41(entries, "added-desc");
  assertEq("xxxx-27: insertion length", a.length, 3);
  assertEq("xxxx-28: added-desc length", b.length, 3);
}

// ===================================================================
// chunk-uuuu: shareable panel-state preset URLs
// ===================================================================

const STORAGE_PANEL_SCOPE_DEFAULT_41 = "tree";
const STORAGE_PANEL_SORT_DEFAULT_41 = "bytes-desc";
const STORAGE_PANEL_FILTER_DEFAULT_41 = "";
const STORAGE_PANEL_FILTER_MODE_DEFAULT_41 = "substring";
const STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT_41 = true;
const STORAGE_PANEL_COLLAPSED_TREE_DEFAULT_41 = false;
const STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT_41 = false;
// STORAGE_PANEL_FILTER_MAX_LEN_41 already declared upstream by chunk-iiii
// bench block; reuse that constant instead of redeclaring.

function encodeStoragePanelStateQuery_41(state) {
  const parts = [];
  if (state.scope !== STORAGE_PANEL_SCOPE_DEFAULT_41) {
    parts.push("s=" + encodeURIComponent(state.scope));
  }
  if (state.sort !== STORAGE_PANEL_SORT_DEFAULT_41) {
    parts.push("o=" + encodeURIComponent(state.sort));
  }
  if (state.filter !== STORAGE_PANEL_FILTER_DEFAULT_41) {
    parts.push("f=" + encodeURIComponent(state.filter));
  }
  if (state.filterMode !== STORAGE_PANEL_FILTER_MODE_DEFAULT_41) {
    parts.push("fm=" + encodeURIComponent(state.filterMode));
  }
  if (state.collapsedOther !== STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT_41) {
    parts.push("co=" + (state.collapsedOther ? "1" : "0"));
  }
  if (state.collapsedTree !== STORAGE_PANEL_COLLAPSED_TREE_DEFAULT_41) {
    parts.push("ct=" + (state.collapsedTree ? "1" : "0"));
  }
  if (state.collapsedDropin !== STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT_41) {
    parts.push("cd=" + (state.collapsedDropin ? "1" : "0"));
  }
  return parts.join("&");
}

function decodeStoragePanelStateQuery_41(query) {
  if (typeof query !== "string") return null;
  let trimmed = query.trim();
  if (trimmed.startsWith("?") || trimmed.startsWith("#")) {
    trimmed = trimmed.slice(1);
  }
  let params;
  try {
    params = new URLSearchParams(trimmed);
  } catch {
    return null;
  }
  const rawScope = params.get("s");
  const scope =
    rawScope === "tree" || rawScope === "all"
      ? rawScope
      : STORAGE_PANEL_SCOPE_DEFAULT_41;
  const rawSort = params.get("o");
  const sort =
    rawSort === "bytes-desc" || rawSort === "name-asc"
      ? rawSort
      : STORAGE_PANEL_SORT_DEFAULT_41;
  const rawFilter = params.get("f");
  let filter = STORAGE_PANEL_FILTER_DEFAULT_41;
  if (typeof rawFilter === "string") {
    filter =
      rawFilter.length > STORAGE_PANEL_FILTER_MAX_LEN_41
        ? rawFilter.slice(0, STORAGE_PANEL_FILTER_MAX_LEN_41)
        : rawFilter;
  }
  const rawMode = params.get("fm");
  const filterMode =
    rawMode === "substring" || rawMode === "regex"
      ? rawMode
      : STORAGE_PANEL_FILTER_MODE_DEFAULT_41;
  const rawCo = params.get("co");
  const collapsedOther =
    rawCo === "1" ? true : rawCo === "0" ? false : STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT_41;
  const rawCt = params.get("ct");
  const collapsedTree =
    rawCt === "1" ? true : rawCt === "0" ? false : STORAGE_PANEL_COLLAPSED_TREE_DEFAULT_41;
  const rawCd = params.get("cd");
  const collapsedDropin =
    rawCd === "1" ? true : rawCd === "0" ? false : STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT_41;
  return { scope, sort, filter, filterMode, collapsedOther, collapsedTree, collapsedDropin };
}

const DEFAULT_STATE_41 = {
  scope: STORAGE_PANEL_SCOPE_DEFAULT_41,
  sort: STORAGE_PANEL_SORT_DEFAULT_41,
  filter: STORAGE_PANEL_FILTER_DEFAULT_41,
  filterMode: STORAGE_PANEL_FILTER_MODE_DEFAULT_41,
  collapsedOther: STORAGE_PANEL_COLLAPSED_OTHER_DEFAULT_41,
  collapsedTree: STORAGE_PANEL_COLLAPSED_TREE_DEFAULT_41,
  collapsedDropin: STORAGE_PANEL_COLLAPSED_DROPIN_DEFAULT_41,
};

// chunk-uuuu: encode default state → empty string.
{
  const got = encodeStoragePanelStateQuery_41(DEFAULT_STATE_41);
  assertEq("uuuu-1: default state encodes to empty string", got, "");
}

// chunk-uuuu: encode includes only non-default fields.
{
  const state = { ...DEFAULT_STATE_41, scope: "all" };
  assertEq("uuuu-2: only scope override → s=all", encodeStoragePanelStateQuery_41(state), "s=all");
  const state2 = { ...DEFAULT_STATE_41, sort: "name-asc" };
  assertEq("uuuu-3: only sort override → o=name-asc", encodeStoragePanelStateQuery_41(state2), "o=name-asc");
  const state3 = { ...DEFAULT_STATE_41, filter: "foo" };
  assertEq("uuuu-4: only filter override → f=foo", encodeStoragePanelStateQuery_41(state3), "f=foo");
  const state4 = { ...DEFAULT_STATE_41, filterMode: "regex" };
  assertEq("uuuu-5: only filterMode override", encodeStoragePanelStateQuery_41(state4), "fm=regex");
  const state5 = { ...DEFAULT_STATE_41, collapsedOther: false };
  assertEq("uuuu-6: only collapsedOther flipped", encodeStoragePanelStateQuery_41(state5), "co=0");
  const state6 = { ...DEFAULT_STATE_41, collapsedTree: true };
  assertEq("uuuu-7: only collapsedTree flipped", encodeStoragePanelStateQuery_41(state6), "ct=1");
  const state7 = { ...DEFAULT_STATE_41, collapsedDropin: true };
  assertEq("uuuu-8: only collapsedDropin flipped", encodeStoragePanelStateQuery_41(state7), "cd=1");
}

// chunk-uuuu: encode multiple overrides preserves field order.
{
  const state = { ...DEFAULT_STATE_41, scope: "all", filter: "depth", sort: "name-asc" };
  assertEq("uuuu-9: scope+sort+filter encoded order", encodeStoragePanelStateQuery_41(state), "s=all&o=name-asc&f=depth");
}

// chunk-uuuu: encode escapes special chars in filter.
{
  const state = { ...DEFAULT_STATE_41, filter: "foo bar&baz" };
  const got = encodeStoragePanelStateQuery_41(state);
  // & and space should be percent-encoded so the URL parses cleanly
  assertEq("uuuu-10: filter & encoded", got.includes("%26"), true);
  // Decoded back, filter is preserved
  const decoded = decodeStoragePanelStateQuery_41(got);
  assertEq("uuuu-11: filter roundtrip", decoded.filter, "foo bar&baz");
}

// chunk-uuuu: decode empty string → all defaults.
{
  const got = decodeStoragePanelStateQuery_41("");
  assertEq("uuuu-12: empty decode scope", got.scope, "tree");
  assertEq("uuuu-13: empty decode sort", got.sort, "bytes-desc");
  assertEq("uuuu-14: empty decode filter", got.filter, "");
  assertEq("uuuu-15: empty decode filterMode", got.filterMode, "substring");
  assertEq("uuuu-16: empty decode collapsedOther", got.collapsedOther, true);
  assertEq("uuuu-17: empty decode collapsedTree", got.collapsedTree, false);
  assertEq("uuuu-18: empty decode collapsedDropin", got.collapsedDropin, false);
}

// chunk-uuuu: decode strips leading ? or #.
{
  const got1 = decodeStoragePanelStateQuery_41("?s=all");
  assertEq("uuuu-19: ? prefix stripped", got1.scope, "all");
  const got2 = decodeStoragePanelStateQuery_41("#s=all");
  assertEq("uuuu-20: # prefix stripped", got2.scope, "all");
}

// chunk-uuuu: decode invalid scope → default.
{
  const got = decodeStoragePanelStateQuery_41("s=garbage");
  assertEq("uuuu-21: garbage scope → default", got.scope, "tree");
}

// chunk-uuuu: decode invalid sort → default.
{
  const got = decodeStoragePanelStateQuery_41("o=random");
  assertEq("uuuu-22: garbage sort → default", got.sort, "bytes-desc");
}

// chunk-uuuu: decode invalid filterMode → default.
{
  const got = decodeStoragePanelStateQuery_41("fm=elaborate");
  assertEq("uuuu-23: garbage filterMode → default", got.filterMode, "substring");
}

// chunk-uuuu: decode invalid boolean → default.
{
  const got = decodeStoragePanelStateQuery_41("co=truth&ct=2&cd=garbage");
  assertEq("uuuu-24: garbage co → default", got.collapsedOther, true);
  assertEq("uuuu-25: garbage ct → default", got.collapsedTree, false);
  assertEq("uuuu-26: garbage cd → default", got.collapsedDropin, false);
}

// chunk-uuuu: decode caps filter at MAX_LEN.
{
  const longFilter = "a".repeat(STORAGE_PANEL_FILTER_MAX_LEN_41 + 100);
  const encoded = "f=" + encodeURIComponent(longFilter);
  const got = decodeStoragePanelStateQuery_41(encoded);
  assertEq("uuuu-27: filter capped at MAX_LEN", got.filter.length, STORAGE_PANEL_FILTER_MAX_LEN_41);
}

// chunk-uuuu: decode preserves valid roundtrip.
{
  const original = {
    scope: "all",
    sort: "name-asc",
    filter: "^dropin:tree:",
    filterMode: "regex",
    collapsedOther: false,
    collapsedTree: true,
    collapsedDropin: true,
  };
  const encoded = encodeStoragePanelStateQuery_41(original);
  const decoded = decodeStoragePanelStateQuery_41(encoded);
  assertEq("uuuu-28: roundtrip scope", decoded.scope, "all");
  assertEq("uuuu-29: roundtrip sort", decoded.sort, "name-asc");
  assertEq("uuuu-30: roundtrip filter", decoded.filter, "^dropin:tree:");
  assertEq("uuuu-31: roundtrip filterMode", decoded.filterMode, "regex");
  assertEq("uuuu-32: roundtrip collapsedOther", decoded.collapsedOther, false);
  assertEq("uuuu-33: roundtrip collapsedTree", decoded.collapsedTree, true);
  assertEq("uuuu-34: roundtrip collapsedDropin", decoded.collapsedDropin, true);
}

// chunk-uuuu: decode missing field → default for that field only.
{
  const got = decodeStoragePanelStateQuery_41("s=all");
  assertEq("uuuu-35: missing sort → default", got.sort, "bytes-desc");
  assertEq("uuuu-36: missing filter → default", got.filter, "");
  assertEq("uuuu-37: scope still applied", got.scope, "all");
}

// chunk-uuuu: defense-in-depth.
{
  let didThrow = false;
  try {
    encodeStoragePanelStateQuery_41(DEFAULT_STATE_41);
    encodeStoragePanelStateQuery_41({ ...DEFAULT_STATE_41, scope: "all" });
    encodeStoragePanelStateQuery_41({ ...DEFAULT_STATE_41, filter: "" });
    decodeStoragePanelStateQuery_41("");
    decodeStoragePanelStateQuery_41("s=all");
    decodeStoragePanelStateQuery_41("garbage&malformed=&=value");
    decodeStoragePanelStateQuery_41("fm=regex&f=" + encodeURIComponent("[invalid"));
  } catch {
    didThrow = true;
  }
  assertEq("uuuu-38: chunk-uuuu does not throw on edge inputs", didThrow, false);
}

// chunk-uuuu: encode is pure (no input mutation).
{
  const state = { ...DEFAULT_STATE_41, scope: "all", filter: "foo" };
  const before = { ...state };
  encodeStoragePanelStateQuery_41(state);
  assertEq("uuuu-39: input scope unchanged", state.scope, before.scope);
  assertEq("uuuu-40: input filter unchanged", state.filter, before.filter);
}

// ===================================================================
// chunk-vvvv: snapshot pinning + diff-vs-live
// ===================================================================

const STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES_41 = 200;
const STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION_41 = 1;

function parseStoragePanelSnapshot_41(raw) {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    if (parsed.schemaVersion !== STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION_41) return null;
    if (typeof parsed.pinnedAt !== "string") return null;
    if (!Array.isArray(parsed.entries)) return null;
    const entries = [];
    for (const item of parsed.entries) {
      if (item === null || typeof item !== "object") continue;
      if (typeof item.key !== "string") continue;
      if (typeof item.value !== "string") continue;
      if (typeof item.bytes !== "number") continue;
      if (!Number.isFinite(item.bytes)) continue;
      entries.push({
        key: item.key,
        value: item.value,
        bytes: Math.floor(item.bytes),
      });
      if (entries.length >= STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES_41) break;
    }
    return {
      schemaVersion: STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION_41,
      pinnedAt: parsed.pinnedAt,
      entries,
    };
  } catch {
    return null;
  }
}

function buildStoragePanelSnapshot_41(liveEntries, pinnedAt) {
  const cappedEntries =
    liveEntries.length > STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES_41
      ? liveEntries.slice(0, STORAGE_PANEL_SNAPSHOT_MAX_ENTRIES_41)
      : liveEntries.slice();
  return {
    schemaVersion: STORAGE_PANEL_SNAPSHOT_SCHEMA_VERSION_41,
    pinnedAt,
    entries: cappedEntries.map((e) => ({
      key: e.key,
      value: e.value,
      bytes: e.bytes,
    })),
  };
}

function diffStoredEntriesAgainstSnapshot_41(live, snapshot) {
  const liveMap = new Map();
  for (const e of live) liveMap.set(e.key, e);
  const snapshotMap = new Map();
  for (const e of snapshot.entries) snapshotMap.set(e.key, e);
  const added = [];
  const removed = [];
  const changed = [];
  let unchanged = 0;
  for (const [key, liveEntry] of liveMap) {
    const snapEntry = snapshotMap.get(key);
    if (snapEntry === undefined) {
      added.push({ key, bytes: liveEntry.bytes });
      continue;
    }
    if (snapEntry.value !== liveEntry.value) {
      changed.push({
        key,
        oldBytes: snapEntry.bytes,
        newBytes: liveEntry.bytes,
      });
      continue;
    }
    unchanged++;
  }
  for (const [key, snapEntry] of snapshotMap) {
    if (!liveMap.has(key)) {
      removed.push({ key, bytes: snapEntry.bytes });
    }
  }
  return { added, removed, changed, unchanged };
}

// chunk-vvvv: parseStoragePanelSnapshot null/empty/malformed.
{
  assertEq("vvvv-1: null → null", parseStoragePanelSnapshot_41(null), null);
  assertEq("vvvv-2: empty → null", parseStoragePanelSnapshot_41(""), null);
  assertEq("vvvv-3: malformed → null", parseStoragePanelSnapshot_41("{not json"), null);
  assertEq("vvvv-4: array root → null", parseStoragePanelSnapshot_41("[]"), null);
  assertEq("vvvv-5: number root → null", parseStoragePanelSnapshot_41("42"), null);
  assertEq("vvvv-6: null root → null", parseStoragePanelSnapshot_41("null"), null);
}

// chunk-vvvv: parseStoragePanelSnapshot wrong schema version → null.
{
  const wrong = JSON.stringify({ schemaVersion: 2, pinnedAt: "2026-05-04T12:00:00Z", entries: [] });
  assertEq("vvvv-7: wrong schemaVersion → null", parseStoragePanelSnapshot_41(wrong), null);
}

// chunk-vvvv: parseStoragePanelSnapshot missing fields → null.
{
  const missingPinnedAt = JSON.stringify({ schemaVersion: 1, entries: [] });
  assertEq("vvvv-8: missing pinnedAt → null", parseStoragePanelSnapshot_41(missingPinnedAt), null);
  const missingEntries = JSON.stringify({ schemaVersion: 1, pinnedAt: "2026-05-04T12:00:00Z" });
  assertEq("vvvv-9: missing entries → null", parseStoragePanelSnapshot_41(missingEntries), null);
}

// chunk-vvvv: parseStoragePanelSnapshot valid roundtrip.
{
  const snap = {
    schemaVersion: 1,
    pinnedAt: "2026-05-04T12:00:00Z",
    entries: [
      { key: "dropin:tree:depth:v1", value: "5", bytes: 23 },
      { key: "other:key", value: "val", bytes: 12 },
    ],
  };
  const got = parseStoragePanelSnapshot_41(JSON.stringify(snap));
  assertEq("vvvv-10: valid pinnedAt", got.pinnedAt, "2026-05-04T12:00:00Z");
  assertEq("vvvv-11: valid entries length", got.entries.length, 2);
  assertEq("vvvv-12: valid entries[0].key", got.entries[0].key, "dropin:tree:depth:v1");
  assertEq("vvvv-13: valid entries[0].bytes", got.entries[0].bytes, 23);
}

// chunk-vvvv: parseStoragePanelSnapshot caps entries at MAX.
{
  const big = { schemaVersion: 1, pinnedAt: "x", entries: [] };
  for (let i = 0; i < 500; i++) {
    big.entries.push({ key: "k" + i, value: "v", bytes: 4 });
  }
  const got = parseStoragePanelSnapshot_41(JSON.stringify(big));
  assertEq("vvvv-14: cap at MAX_ENTRIES", got.entries.length, 200);
}

// chunk-vvvv: parseStoragePanelSnapshot filters malformed entries.
{
  const mixed = {
    schemaVersion: 1,
    pinnedAt: "x",
    entries: [
      { key: "good", value: "v", bytes: 4 },
      null,
      { key: 1, value: "v", bytes: 4 },
      { key: "bad-bytes", value: "v", bytes: "wrong" },
      { key: "no-value", bytes: 4 },
      { key: "good2", value: "v", bytes: 4 },
    ],
  };
  const got = parseStoragePanelSnapshot_41(JSON.stringify(mixed));
  assertEq("vvvv-15: filters mal entries", got.entries.length, 2);
  assertEq("vvvv-16: keeps good[0]", got.entries[0].key, "good");
  assertEq("vvvv-17: keeps good[1]", got.entries[1].key, "good2");
}

// chunk-vvvv: buildStoragePanelSnapshot caps + preserves shape.
{
  const live = [];
  for (let i = 0; i < 500; i++) {
    live.push({ key: "k" + i, value: "v", bytes: 4 });
  }
  const snap = buildStoragePanelSnapshot_41(live, "now");
  assertEq("vvvv-18: build caps at MAX", snap.entries.length, 200);
  assertEq("vvvv-19: build pinnedAt preserved", snap.pinnedAt, "now");
  assertEq("vvvv-20: build schema version", snap.schemaVersion, 1);
}

// chunk-vvvv: buildStoragePanelSnapshot does not mutate input.
{
  const live = [
    { key: "a", value: "1", bytes: 2 },
    { key: "b", value: "2", bytes: 2 },
  ];
  const before = live.slice();
  buildStoragePanelSnapshot_41(live, "now");
  assertEq("vvvv-21: input length unchanged", live.length, before.length);
  assertEq("vvvv-22: input contents unchanged", live[0].key, before[0].key);
}

// chunk-vvvv: diff added / removed / changed / unchanged.
{
  const snapshot = {
    schemaVersion: 1,
    pinnedAt: "x",
    entries: [
      { key: "stays", value: "same", bytes: 8 },
      { key: "removed-key", value: "gone", bytes: 8 },
      { key: "changes", value: "old-value", bytes: 13 },
    ],
  };
  const live = [
    { key: "stays", value: "same", bytes: 8 },
    { key: "added-key", value: "fresh", bytes: 9 },
    { key: "changes", value: "new-value", bytes: 13 },
  ];
  const diff = diffStoredEntriesAgainstSnapshot_41(live, snapshot);
  assertEq("vvvv-23: added length", diff.added.length, 1);
  assertEq("vvvv-24: added[0].key", diff.added[0].key, "added-key");
  assertEq("vvvv-25: removed length", diff.removed.length, 1);
  assertEq("vvvv-26: removed[0].key", diff.removed[0].key, "removed-key");
  assertEq("vvvv-27: changed length", diff.changed.length, 1);
  assertEq("vvvv-28: changed[0].key", diff.changed[0].key, "changes");
  assertEq("vvvv-29: changed[0].oldBytes", diff.changed[0].oldBytes, 13);
  assertEq("vvvv-30: changed[0].newBytes", diff.changed[0].newBytes, 13);
  assertEq("vvvv-31: unchanged count", diff.unchanged, 1);
}

// chunk-vvvv: diff empty live + empty snapshot.
{
  const snap = { schemaVersion: 1, pinnedAt: "x", entries: [] };
  const diff = diffStoredEntriesAgainstSnapshot_41([], snap);
  assertEq("vvvv-32: empty added", diff.added.length, 0);
  assertEq("vvvv-33: empty removed", diff.removed.length, 0);
  assertEq("vvvv-34: empty changed", diff.changed.length, 0);
  assertEq("vvvv-35: empty unchanged", diff.unchanged, 0);
}

// chunk-vvvv: diff all-added (snapshot empty).
{
  const snap = { schemaVersion: 1, pinnedAt: "x", entries: [] };
  const live = [
    { key: "a", value: "1", bytes: 2 },
    { key: "b", value: "2", bytes: 2 },
  ];
  const diff = diffStoredEntriesAgainstSnapshot_41(live, snap);
  assertEq("vvvv-36: all added", diff.added.length, 2);
  assertEq("vvvv-37: zero removed", diff.removed.length, 0);
}

// chunk-vvvv: diff all-removed (live empty).
{
  const snap = {
    schemaVersion: 1,
    pinnedAt: "x",
    entries: [
      { key: "a", value: "1", bytes: 2 },
      { key: "b", value: "2", bytes: 2 },
    ],
  };
  const diff = diffStoredEntriesAgainstSnapshot_41([], snap);
  assertEq("vvvv-38: zero added", diff.added.length, 0);
  assertEq("vvvv-39: all removed", diff.removed.length, 2);
}

// chunk-vvvv: diff identical → all unchanged.
{
  const entries = [
    { key: "a", value: "1", bytes: 2 },
    { key: "b", value: "2", bytes: 2 },
  ];
  const snap = { schemaVersion: 1, pinnedAt: "x", entries };
  const diff = diffStoredEntriesAgainstSnapshot_41(entries, snap);
  assertEq("vvvv-40: identical added", diff.added.length, 0);
  assertEq("vvvv-41: identical removed", diff.removed.length, 0);
  assertEq("vvvv-42: identical changed", diff.changed.length, 0);
  assertEq("vvvv-43: identical unchanged count", diff.unchanged, 2);
}

// chunk-vvvv: diff is pure (no input mutation).
{
  const live = [{ key: "a", value: "1", bytes: 2 }];
  const snap = { schemaVersion: 1, pinnedAt: "x", entries: [{ key: "a", value: "1", bytes: 2 }] };
  const beforeLive = live.slice();
  const beforeSnap = snap.entries.slice();
  diffStoredEntriesAgainstSnapshot_41(live, snap);
  assertEq("vvvv-44: live unchanged", live.length, beforeLive.length);
  assertEq("vvvv-45: snapshot unchanged", snap.entries.length, beforeSnap.length);
}

// chunk-vvvv: defense-in-depth.
{
  let didThrow = false;
  try {
    parseStoragePanelSnapshot_41(null);
    parseStoragePanelSnapshot_41("");
    parseStoragePanelSnapshot_41("garbage");
    parseStoragePanelSnapshot_41("[]");
    buildStoragePanelSnapshot_41([], "x");
    buildStoragePanelSnapshot_41([{ key: "a", value: "v", bytes: 1 }], "x");
    diffStoredEntriesAgainstSnapshot_41([], { schemaVersion: 1, pinnedAt: "x", entries: [] });
  } catch {
    didThrow = true;
  }
  assertEq("vvvv-46: chunk-vvvv does not throw on edge inputs", didThrow, false);
}

console.log(`\nbench-tree-persistence: ${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
