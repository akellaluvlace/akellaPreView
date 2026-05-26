// Stable per-element identity for the new manipulation system.
//
// Each JSX opening element gets a `data-dropin-id="<8 alnum>"` attribute
// minted into the user's source. The OID is part of the source — it survives
// re-parse trivially because it's literally a JSX attribute now. React passes
// `data-*` through, so the rendered DOM also carries the OID. The same string
// identifies the source node AND the rendered element.
//
// This is the "Stable node identity" primitive from `maniuplation.md`
// (Implementation Toolchain → "parse-time Babel walk, NOT a build-time SWC
// plugin"). Modeled on Onlook's `packages/parser/src/ids.ts` (267 LOC, MIT) —
// our slimmer version skips OID-on-fragment, opaque-collision regen on every
// run, and the `@babel/traverse` dependency.
//
// Coexistence: this lives ALONGSIDE the existing `data-dropin-loc` plugin in
// `lib/preview.ts`. `data-dropin-loc` is volatile (line:col shifts on every
// keystroke) and owned by the existing `Inspector` / `lib/source-patch-jsx.ts`
// path. `data-dropin-id` is opaque + stable and owned by the new system. Both
// attributes ride together for the entire Phase 1 → Phase 4 window.
//
// NOT WIRED YET: this session ships the pure module. Hooking it into the
// source-state owner (Workspace.tsx) and the Monaco round-trip is the next
// session's work, alongside the Layout Inspector and selection model.

import { parse, type ParserOptions } from "@babel/parser";

export const OID_ATTR = "data-dropin-id";

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const OID_LEN = 8;
const OID_REGEX = /^[A-Za-z0-9]{8}$/;

const PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

// Deterministic OID generator (tenth-pass hydration fix).
//
// Pre-tenth-pass this used `Math.random()`, which seeds independently in the
// SSR process and the client process — server and client produced different
// OIDs for the same source, the iframe's `srcDoc` attribute (built from the
// OID-stamped code) differed between the two, and React 18 logged a hard
// hydration mismatch. The CLAUDE.md gotcha #13 workaround was to stamp OIDs
// post-hydration in a useEffect with a useRef gate. That worked but added a
// SECOND iframe rebuild ~300 ms after mount (the OID injection's
// `setCodeSilent` triggered a code state update → Preview's debounced srcDoc
// effect → iframe reload). The double-rebuild flake'd unpkg's CORS preflight
// cache (browser cache state confusion when the same scripts re-fetch back-
// to-back), which was the real-world reason templates were sometimes blank
// on Ctrl+R.
//
// The fix: encode the JSXOpeningElement's parse offset as a base-N string
// (where N = ALPHA.length, currently 62). Each opening element has a unique
// `name.end` offset within a source, so each gets a unique OID. Crucially,
// the encoding is pure: SSR and client both compute the same string from
// the same offset, so the lazy initializer can run `injectOids(initialCode)`
// hydration-safely. The post-hydration useEffect is no longer needed.
//
// Why offset-based and not a counter (oid-1, oid-2, ...): offsets are stable
// across structural edits in unrelated regions. If you append a new element
// at the end of source A to get source A', every existing element's offset
// is unchanged, so existing OIDs persist on a re-inject. Counter-based would
// renumber every element when you insert one in the middle. (Both shift on
// edits within an element, but that's fine — the OID is then a new identity
// for what's effectively a new element.)
//
// Collision considerations: 62^8 = 2.18 × 10^14 distinct values. Two
// elements would have to share a parse offset to collide, which is
// impossible within a single source. Across sources, collisions don't
// matter (OIDs are scoped to a single document at a time).
export function makeOid(seed?: number): string {
  if (typeof seed === "number" && Number.isFinite(seed) && seed >= 0) {
    const N = ALPHA.length;
    let n = Math.floor(seed) >>> 0;
    let s = "";
    for (let i = 0; i < OID_LEN; i++) {
      s = ALPHA[n % N] + s;
      n = Math.floor(n / N);
    }
    return s;
  }
  // Random fallback for callers without a seed (e.g. ad-hoc test fixtures
  // that don't have a parse offset). Avoid in production paths — non-
  // deterministic IDs reintroduce the hydration trap above.
  let id = "";
  for (let i = 0; i < OID_LEN; i++) {
    id += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  }
  return id;
}

export function isValidOid(s: string): boolean {
  return OID_REGEX.test(s);
}

export interface OidInsertion {
  pos: number;
  text: string;
}

export interface InjectResult {
  source: string;
  injected: number;
  unchanged: boolean;
  // The byte-offset insertions that produced `source` from the input. Empty
  // when `unchanged`. Exposed so callers operating on a Monaco model can
  // apply the same edits via `model.applyEdits`/`editor.executeEdits`,
  // preserving the undo stack and cursor position — `model.setValue(source)`
  // would reset both. Sorted descending by `pos` to match the splice order
  // used internally; Monaco's `executeEdits` re-sorts as needed, so callers
  // don't need to depend on the order.
  insertions: OidInsertion[];
}

export interface StripResult {
  source: string;
  removed: number;
  unchanged: boolean;
}

// Inject `data-dropin-id` attributes into every JSXOpeningElement that
// doesn't already have a valid one. Idempotent: re-running on already-injected
// source returns it unchanged (well — if a duplicate slips in via paste, the
// duplicate is regenerated; the first occurrence wins).
export function injectOids(source: string): InjectResult {
  const ast = tryParse(source);
  if (!ast) return { source, injected: 0, unchanged: true, insertions: [] };

  const insertions: OidInsertion[] = [];
  const seen = new Set<string>();

  walkJsxOpenings(ast, (opening) => {
    if (!opening?.name?.end) return;
    // Skip JSXMemberExpression-named tags? No — `<Foo.Bar>` is still a normal
    // JSXOpeningElement; the `name` is just a JSXMemberExpression node whose
    // `.end` is the byte right after `Bar`. Insertion still works.
    const existing = readOidAttr(opening);
    if (existing && isValidOid(existing) && !seen.has(existing)) {
      seen.add(existing);
      return;
    }
    // Mint a fresh OID using the parse offset as the seed (deterministic).
    // If the existing one was malformed or duplicate, we overwrite by
    // inserting a new attribute — the old (malformed) one stays in source as
    // dead bytes, but a future strip+re-inject pass cleans it. Acceptable
    // for an idempotent path.
    const oid = mintUnique(opening.name.end, seen);
    seen.add(oid);
    insertions.push({ pos: opening.name.end, text: ` ${OID_ATTR}="${oid}"` });
  });

  if (insertions.length === 0) {
    return { source, injected: 0, unchanged: true, insertions: [] };
  }

  insertions.sort((a, b) => b.pos - a.pos);
  let out = source;
  for (const { pos, text } of insertions) {
    out = out.slice(0, pos) + text + out.slice(pos);
  }
  return {
    source: out,
    injected: insertions.length,
    unchanged: false,
    insertions,
  };
}

// Inverse: walk every JSXAttribute named `data-dropin-id` and splice it out
// (with the leading whitespace, so a clean ` foo="bar" baz="qux"` stays
// readable after removal). Used by the future "Download clean source" /
// "Show source to LLM" paths so OIDs never leak outside the editor session.
export function stripOids(source: string): StripResult {
  const ast = tryParse(source);
  if (!ast) return { source, removed: 0, unchanged: true };

  const removals: Array<{ start: number; end: number }> = [];
  walkJsxOpenings(ast, (opening) => {
    for (const a of opening.attributes || []) {
      if (
        a?.type === "JSXAttribute" &&
        a.name?.type === "JSXIdentifier" &&
        a.name.name === OID_ATTR &&
        typeof a.start === "number" &&
        typeof a.end === "number"
      ) {
        let start = a.start;
        while (start > 0 && /\s/.test(source[start - 1])) start--;
        removals.push({ start, end: a.end });
      }
    }
  });

  if (removals.length === 0) {
    return { source, removed: 0, unchanged: true };
  }

  removals.sort((a, b) => b.start - a.start);
  let out = source;
  for (const { start, end } of removals) {
    out = out.slice(0, start) + out.slice(end);
  }
  return { source: out, removed: removals.length, unchanged: false };
}

// --- helpers ---

function tryParse(source: string): unknown {
  try {
    return parse(source, PARSE_OPTS);
  } catch {
    // Source doesn't parse. Caller already has a broken state; injecting OIDs
    // can't help. Defer the syntax error to whoever runs Babel.transform on
    // the iframe side and let it surface there.
    return null;
  }
}

// 2026-05-24 — parse-gate. Returns true iff `source` parses as a
// module under the same plugin set the iframe uses. Callers use this
// to refuse applying a syntactically-broken source (e.g. an AI swap
// that produced an unbalanced tag) BEFORE setCode blanks the preview.
export function isParseable(source: string): boolean {
  return tryParse(source) !== null;
}

// 2026-05-25 — strict JSX-only parse. Mirrors the iframe's Babel-standalone
// (JSX preset, NO TypeScript plugin) so it answers the exact question
// "will this run in the preview?". `errorRecovery` is OFF so any syntax
// error throws (recovery would let TS like `foo as Bar` slip through).
//
// This REPLACES the old regex-based TS-syntax heuristics in
// lib/byo-ai/validate-response.ts, which false-rejected ordinary UI text:
// "Export as PDF" (matched `as PDF`), "downtime: never" (matched `: never`),
// "type: string" etc. A parser can't be fooled by prose — text content is
// valid JSX and parses; only genuine TS syntax in code position throws.
const JSX_ONLY_PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx"],
};
export function parsesAsPlainJsx(source: string): boolean {
  try {
    parse(source, JSX_ONLY_PARSE_OPTS);
    return true;
  } catch {
    return false;
  }
}

// Deterministic mint with collision-bumping. The first attempt encodes the
// parse offset directly. If that string happens to collide with an existing
// OID in `seen` (rare — would require a stale OID in the source that
// happens to match this offset's encoding), we bump the seed by a prime
// offset (7919) and retry. Bumping is deterministic so the same input
// always produces the same output. After 100 collisions we give up and
// fall back to random — astronomically unlikely to hit but defensive.
function mintUnique(seed: number, seen: Set<string>): string {
  let candidate = makeOid(seed);
  if (!seen.has(candidate)) return candidate;
  for (let bump = 1; bump < 100; bump++) {
    candidate = makeOid(seed + bump * 7919);
    if (!seen.has(candidate)) return candidate;
  }
  // Defensive: should never land here at any realistic source size.
  let id = makeOid() + makeOid();
  while (seen.has(id)) id = makeOid() + makeOid();
  return id;
}

function readOidAttr(opening: any): string | null {
  for (const a of opening?.attributes || []) {
    if (
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      a.name.name === OID_ATTR &&
      a.value?.type === "StringLiteral"
    ) {
      return a.value.value;
    }
  }
  return null;
}

// Recursive descent over the AST that fires `onOpening` for every
// JSXOpeningElement. We don't use `@babel/traverse` — keeps the dep surface
// at just `@babel/parser` and the walk is small enough to maintain by hand.
// Skip noisy keys (`loc`, `tokens`, `comments`, `extra`) so we don't recurse
// into source-position metadata.
export function walkJsxOpenings(
  node: any,
  onOpening: (opening: any) => void
): void {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") onOpening(node);
  for (const key in node) {
    if (
      key === "loc" ||
      key === "tokens" ||
      key === "comments" ||
      key === "extra" ||
      key === "start" ||
      key === "end" ||
      key === "leadingComments" ||
      key === "trailingComments"
    ) {
      continue;
    }
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      for (const c of child) walkJsxOpenings(c, onOpening);
    } else if (child && typeof child === "object" && child.type) {
      walkJsxOpenings(child, onOpening);
    }
  }
}
