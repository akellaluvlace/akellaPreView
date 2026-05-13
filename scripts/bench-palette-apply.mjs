// Ad-hoc smoke test for `lib/ast/operations/palette.ts applyPalette`.
// Inlines the module + the palette registry so the script runs without
// a TS build step.

import { parse } from "@babel/parser";
import MagicString from "magic-string";

const OID_ATTR = "data-dropin-id";
const PARSE_OPTS = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

const SKIP_KEYS = new Set([
  "loc", "tokens", "comments", "extra", "start", "end",
  "leadingComments", "trailingComments",
]);

const ALL_FAMILIES = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
];
const NEUTRAL_FAMILIES = new Set(["slate", "gray", "zinc", "neutral", "stone"]);

const PREFIXES = [
  "bg", "text", "border", "ring", "fill", "stroke",
  "from", "via", "to", "decoration", "placeholder", "caret",
  "accent", "divide", "outline", "shadow",
];

function makePalette(id, name, primary, neutral, accent) {
  return {
    id, name,
    families: { primary, neutral, accent },
    swatch: { primary: "#fff", neutral: "#000", accent: "#888", bg: "#F5F1EA", fg: "#18141C" },
    vibe: "test",
  };
}

const OCEAN = makePalette("ocean", "Ocean", "sky", "slate", "teal");
const SUNSET = makePalette("sunset", "Sunset", "rose", "neutral", "orange");
const FOREST = makePalette("forest", "Forest", "emerald", "stone", "lime");
const MONO = makePalette("mono", "Mono", "zinc", "zinc", "zinc");

function collectOpenings(node, into) {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") into.push(node);
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) collectOpenings(c, into);
    } else if (child && typeof child === "object" && child.type) {
      collectOpenings(child, into);
    }
  }
}

function readOidAttr(opening) {
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

function readClassNameAttr(opening) {
  for (const a of opening?.attributes || []) {
    if (
      a?.type === "JSXAttribute" &&
      a.name?.type === "JSXIdentifier" &&
      (a.name.name === "className" || a.name.name === "class") &&
      a.value?.type === "StringLiteral" &&
      typeof a.value.start === "number" &&
      typeof a.value.end === "number"
    ) {
      return a.value;
    }
  }
  return null;
}

function splitVariants(token) {
  const idx = token.lastIndexOf(":");
  if (idx === -1) return { variant: "", core: token };
  return { variant: token.slice(0, idx + 1), core: token.slice(idx + 1) };
}

function parseToken(core) {
  if (core.includes("[")) return null;
  for (const p of PREFIXES) {
    if (!core.startsWith(p + "-")) continue;
    const rest = core.slice(p.length + 1);
    for (const f of ALL_FAMILIES) {
      if (!rest.startsWith(f + "-")) continue;
      const shadePart = rest.slice(f.length + 1);
      const m = shadePart.match(/^(\d{2,4})(\/\d+(?:\.\d+)?)?$/);
      if (!m) continue;
      return { prefix: p, family: f, shade: m[1], alpha: m[2] ?? "" };
    }
  }
  return null;
}

function rebuildToken(parts, destFamily) {
  return `${parts.prefix}-${destFamily}-${parts.shade}${parts.alpha}`;
}

function applyPalette(source, op) {
  let ast;
  try { ast = parse(source, PARSE_OPTS); }
  catch (e) { return { source, unchanged: true, reason: `parse failed: ${String(e)}` }; }

  const palette = op.palette;
  const scope = op.scope;
  const scopeOidSet = scope === "all" ? null : new Set(scope.oids);

  const openings = [];
  collectOpenings(ast, openings);

  const slots = [];
  for (const opening of openings) {
    const classAttrVal = readClassNameAttr(opening);
    if (!classAttrVal) continue;
    const oid = readOidAttr(opening);
    slots.push({ oid, start: classAttrVal.start + 1, end: classAttrVal.end - 1 });
  }

  function inScope(oid) {
    if (scopeOidSet === null) return true;
    if (oid === null) return false;
    return scopeOidSet.has(oid);
  }

  const counts = new Map();
  for (const slot of slots) {
    if (!inScope(slot.oid)) continue;
    const value = source.slice(slot.start, slot.end);
    for (const tok of value.split(/\s+/)) {
      if (!tok) continue;
      const { core } = splitVariants(tok);
      const parts = parseToken(core);
      if (!parts) continue;
      counts.set(parts.family, (counts.get(parts.family) ?? 0) + 1);
    }
  }

  if (counts.size === 0) {
    return { source, unchanged: true, reason: "no Tailwind color tokens in scope" };
  }

  const sortedFamilies = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([f]) => f);
  const neutralUsed = sortedFamilies.filter((f) => NEUTRAL_FAMILIES.has(f));
  const nonNeutralUsed = sortedFamilies.filter((f) => !NEUTRAL_FAMILIES.has(f));

  const mapping = new Map();
  if (neutralUsed[0]) mapping.set(neutralUsed[0], palette.families.neutral);
  if (nonNeutralUsed[0]) mapping.set(nonNeutralUsed[0], palette.families.primary);
  if (nonNeutralUsed[1]) mapping.set(nonNeutralUsed[1], palette.families.accent);

  const s = new MagicString(source);
  let changed = false;
  for (const slot of slots) {
    if (!inScope(slot.oid)) continue;
    const value = source.slice(slot.start, slot.end);
    let updated = false;
    const rebuilt = value.split(/(\s+)/).map((chunk) => {
      if (/^\s+$/.test(chunk) || !chunk) return chunk;
      const { variant, core } = splitVariants(chunk);
      const parts = parseToken(core);
      if (!parts) return chunk;
      const dest = mapping.get(parts.family);
      if (!dest) return chunk;
      if (dest === parts.family) return chunk;
      if (NEUTRAL_FAMILIES.has(parts.family) !== NEUTRAL_FAMILIES.has(dest)) return chunk;
      updated = true;
      return variant + rebuildToken(parts, dest);
    }).join("");
    if (updated && rebuilt !== value) {
      s.overwrite(slot.start, slot.end, rebuilt);
      changed = true;
    }
  }

  if (!changed) {
    return { source, unchanged: true, reason: "no tokens needed rewriting (palette already applied)" };
  }

  return { source: s.toString(), unchanged: false, reason: null };
}

// ---------- test harness ----------

let pass = 0;
let fail = 0;
function test(name, source, op, expected) {
  const r = applyPalette(source, op);
  let ok;
  if (typeof expected === "string") {
    ok = !r.unchanged && r.source === expected;
  } else if (typeof expected === "function") {
    ok = expected(r);
  } else {
    ok = r.unchanged === expected.unchanged;
  }
  if (ok) {
    pass++;
    console.log(`PASS: ${name}`);
  } else {
    fail++;
    console.log(`FAIL: ${name}`);
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  got: ${JSON.stringify({
      unchanged: r.unchanged,
      reason: r.reason,
      source: r.unchanged ? null : r.source,
    })}`);
  }
}

const P = "pppppppp";
const A = "aaaaaaaa";
const B = "bbbbbbbb";

// 1. Basic non-neutral swap: bg-blue → bg-sky (Ocean)
test(
  "blue → sky (Ocean primary)",
  `<div data-dropin-id="${P}" className="bg-blue-500"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="bg-sky-500"/>`
);

// 2. Neutral swap: text-gray → text-slate
test(
  "gray → slate (Ocean neutral)",
  `<div data-dropin-id="${P}" className="text-gray-700"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="text-slate-700"/>`
);

// 3. Combined: blue (primary) + gray (neutral) → sky + slate
test(
  "combined primary + neutral",
  `<div data-dropin-id="${P}" className="bg-blue-500 text-gray-100"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="bg-sky-500 text-slate-100"/>`
);

// 4. Accent: second non-neutral usage → accent
test(
  "second non-neutral → accent",
  `<div data-dropin-id="${P}" className="bg-blue-500 bg-blue-700 text-violet-500"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="bg-sky-500 bg-sky-700 text-teal-500"/>`
);

// 5. Variant prefix preserved
test(
  "variant prefix preserved",
  `<div data-dropin-id="${P}" className="hover:bg-blue-500 md:text-gray-700"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="hover:bg-sky-500 md:text-slate-700"/>`
);

// 6. Arbitrary values left alone
test(
  "bg-[#hex] left alone",
  `<div data-dropin-id="${P}" className="bg-blue-500 bg-[#FF4D2E]"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="bg-sky-500 bg-[#FF4D2E]"/>`
);

// 7. Non-color token left alone
test(
  "non-color tokens unchanged",
  `<div data-dropin-id="${P}" className="bg-blue-500 flex p-4 rounded-md"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="bg-sky-500 flex p-4 rounded-md"/>`
);

// 8. No tokens to rewrite → unchanged
test(
  "no Tailwind color tokens → unchanged",
  `<div data-dropin-id="${P}" className="flex p-4"/>`,
  { palette: OCEAN, scope: "all" },
  { unchanged: true }
);

// 9. Source already at target palette → unchanged (no diff)
test(
  "already at target palette → unchanged",
  `<div data-dropin-id="${P}" className="bg-sky-500 text-slate-700"/>`,
  { palette: OCEAN, scope: "all" },
  { unchanged: true }
);

// 10. Scope filter: only A in scope, B left alone
test(
  "scope filter — only A in scope",
  `<div data-dropin-id="${P}" className="bg-blue-100">
  <a data-dropin-id="${A}" className="bg-blue-500"/>
  <b data-dropin-id="${B}" className="bg-blue-700"/>
</div>`,
  { palette: OCEAN, scope: { oids: [A] } },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`<a data-dropin-id="${A}" className="bg-sky-500"/>`)
      && r.source.includes(`<b data-dropin-id="${B}" className="bg-blue-700"/>`)
      && r.source.includes(`<div data-dropin-id="${P}" className="bg-blue-100">`);
  }
);

// 11. Scope filter — empty → no rewrite
test(
  "empty scope → unchanged",
  `<div data-dropin-id="${P}" className="bg-blue-500"/>`,
  { palette: OCEAN, scope: { oids: [] } },
  { unchanged: true }
);

// 12. Token with alpha modifier preserved
test(
  "alpha modifier preserved",
  `<div data-dropin-id="${P}" className="bg-blue-500/70"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="bg-sky-500/70"/>`
);

// 13. Multiple variant prefixes
test(
  "double variant (md:hover:)",
  `<div data-dropin-id="${P}" className="md:hover:bg-blue-500"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="md:hover:bg-sky-500"/>`
);

// 14. Neutral mapping doesn't accidentally swap to non-neutral
test(
  "neutral source maps only to neutral dest",
  `<div data-dropin-id="${P}" className="text-gray-700 bg-blue-500"/>`,
  { palette: SUNSET, scope: "all" }, // neutral=neutral, primary=rose
  `<div data-dropin-id="${P}" className="text-neutral-700 bg-rose-500"/>`
);

// 15. Mono palette (all zinc) — non-neutral source maps to zinc, but
// our defensive guard skips when neutral-class differs. Wait: zinc IS
// in NEUTRAL_FAMILIES, so this would swap blue → zinc which the guard
// prevents (neutral mismatch). End result: unchanged for non-neutrals.
test(
  "mono palette: non-neutral preserved (neutral guard)",
  `<div data-dropin-id="${P}" className="bg-blue-500 text-gray-700"/>`,
  { palette: MONO, scope: "all" },
  // gray → zinc OK (both neutral); blue → zinc blocked. So:
  `<div data-dropin-id="${P}" className="bg-blue-500 text-zinc-700"/>`
);

// 16. text-{family}-{shade}
test(
  "text-{family}-{shade} swap",
  `<div data-dropin-id="${P}" className="text-emerald-300"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="text-sky-300"/>`
);

// 17. border-{family}-{shade}
test(
  "border-{family}-{shade} swap",
  `<div data-dropin-id="${P}" className="border-2 border-blue-200"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="border-2 border-sky-200"/>`
);

// 18. Gradient classes (from / via / to)
test(
  "gradient prefixes swap",
  `<div data-dropin-id="${P}" className="from-blue-500 to-blue-700"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="from-sky-500 to-sky-700"/>`
);

// 19. Multiple OIDs in scope
test(
  "multi-oid scope",
  `<main>
  <div data-dropin-id="${P}" className="bg-blue-100"/>
  <a data-dropin-id="${A}" className="bg-blue-500"/>
  <b data-dropin-id="${B}" className="bg-blue-700"/>
</main>`,
  { palette: OCEAN, scope: { oids: [A, B] } },
  (r) => {
    if (r.unchanged) return false;
    return r.source.includes(`bg-blue-100"`)
      && r.source.includes(`bg-sky-500"`)
      && r.source.includes(`bg-sky-700"`);
  }
);

// 20. Round-trip: applying ocean twice = identity (unchanged on second)
test(
  "round-trip — second apply is unchanged",
  `<div data-dropin-id="${P}" className="bg-blue-500 text-gray-700"/>`,
  { palette: OCEAN, scope: "all" },
  (r) => {
    if (r.unchanged) return false;
    const r2 = applyPalette(r.source, { palette: OCEAN, scope: "all" });
    return r2.unchanged;
  }
);

// 21. Source parse failure → bail
test(
  "source parse failure → bail",
  `<div className="bg-blue-500" <<<broken`,
  { palette: OCEAN, scope: "all" },
  { unchanged: true }
);

// 22. Most-used non-neutral wins primary role (tiebreak by first-seen)
test(
  "most-used family wins primary role",
  `<div data-dropin-id="${P}" className="bg-blue-500 bg-blue-700 bg-violet-500"/>`,
  { palette: SUNSET, scope: "all" }, // primary=rose, accent=orange
  // blue (count=2) → rose; violet (count=1) → orange
  `<div data-dropin-id="${P}" className="bg-rose-500 bg-rose-700 bg-orange-500"/>`
);

// 23. Forest palette: emerald primary (matches source family directly)
test(
  "source already uses palette primary",
  `<div data-dropin-id="${P}" className="bg-emerald-500 bg-stone-700"/>`,
  { palette: FOREST, scope: "all" },
  { unchanged: true }
);

// 24. All shades preserved across swap
test(
  "shade preserved across swap",
  `<div data-dropin-id="${P}" className="bg-blue-50 bg-blue-200 bg-blue-500 bg-blue-900"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="bg-sky-50 bg-sky-200 bg-sky-500 bg-sky-900"/>`
);

// 25. Element without OID — skipped on scoped, included on "all"
test(
  "no-OID element included on scope: all",
  `<div className="bg-blue-500"/>`,
  { palette: OCEAN, scope: "all" },
  `<div className="bg-sky-500"/>`
);

// 26. Element without OID — skipped on scoped
test(
  "no-OID element skipped on scoped",
  `<div className="bg-blue-500"/>`,
  { palette: OCEAN, scope: { oids: [P] } },
  { unchanged: true }
);

// 27. JSX expression in className → ignored (regex doesn't see it)
test(
  "className={expr} ignored",
  `<div data-dropin-id="${P}" className={isActive ? "bg-blue-500" : "bg-gray-200"}/>`,
  { palette: OCEAN, scope: "all" },
  { unchanged: true }
);

// 28. Single quotes also supported via class= attribute
test(
  "class=' attribute (HTML-style)",
  `<div data-dropin-id="${P}" class="bg-blue-500"/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" class="bg-sky-500"/>`
);

// 29. Scope with non-existent oid → unchanged
test(
  "scope with bogus oid → unchanged",
  `<div data-dropin-id="${P}" className="bg-blue-500"/>`,
  { palette: OCEAN, scope: { oids: ["zzzzzzzz"] } },
  { unchanged: true }
);

// 30. Whitespace preservation
test(
  "leading/trailing whitespace preserved",
  `<div data-dropin-id="${P}" className="  bg-blue-500   text-gray-700  "/>`,
  { palette: OCEAN, scope: "all" },
  `<div data-dropin-id="${P}" className="  bg-sky-500   text-slate-700  "/>`
);

console.log(`\n${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
