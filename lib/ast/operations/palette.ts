// Phase 5 / Phase C — Operation engine for palette swap. Sibling to
// `style.ts` / `insert.ts` / `swap.ts`. Walks every static
// `className="..."` / `class="..."` attribute in source, infers a
// {sourceFamily → destFamily} mapping based on usage counts, and
// rewrites every `<prefix>-<family>-<shade>` token in scope to its
// destination family at the same shade.
//
// Scope:
//   - `"all"` → every JSX element in source is in scope.
//   - `{ oids: string[] }` → only className attributes on JSX elements
//     whose `data-dropin-id` is in the list. The host wires this so
//     in-isolated mode the palette swap affects only the focused
//     subtree (locked decision §1.12 of `phase5-tools-isolation.md`).
//
// Mapping rule (preserves text readability — locked decision from
// the old dice palette spec):
//   - Most-used non-neutral source family → palette.families.primary
//   - Second-most-used non-neutral → palette.families.accent
//   - Most-used neutral source family → palette.families.neutral
//   - Everything else: left alone. We don't aggressively remap third+
//     non-neutrals because a vibecoder using 4+ families likely has
//     intent we'd ruin by collapsing them onto the palette's three
//     roles.
//
// Skip rules:
//   - Arbitrary-value tokens (`bg-[#hex]`, `text-[rgb(...)]`) are
//     left alone — palette swap can't infer their role.
//   - Tokens that don't match `<prefix>-<family>-<shade>` are passed
//     through unchanged (e.g. `bg-cover`, `text-center`, `border-2`).
//
// Bail rules:
//   - Source doesn't parse → bail (caller has a broken state).
//   - No in-scope className tokens to rewrite → unchanged with a
//     non-error reason.

import MagicString from "magic-string";
import { parse, type ParserOptions } from "@babel/parser";
import { OID_ATTR } from "../oids";
import {
  ALL_FAMILIES,
  FAMILY_HEX_SHADES,
  NEUTRAL_FAMILIES,
  type Family,
  type Palette,
} from "../../palettes";

export type PaletteScope = "all" | { oids: ReadonlyArray<string> };

export interface PaletteOperation {
  palette: Palette;
  scope: PaletteScope;
}

export interface PaletteResult {
  source: string;
  unchanged: boolean;
  reason: string | null;
}

const PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

const SKIP_KEYS = new Set([
  "loc",
  "tokens",
  "comments",
  "extra",
  "start",
  "end",
  "leadingComments",
  "trailingComments",
]);

// Tailwind class prefixes that carry a {family}-{shade} payload. The
// list mirrors what `lib/dice/palettes.ts` PREFIXES had — kept verbatim
// so palette swaps catch gradient classes (from / via / to) and ring /
// outline / divide which would look out of place left at the old family.
const PREFIXES = [
  "bg", "text", "border", "ring", "fill", "stroke",
  "from", "via", "to", "decoration", "placeholder", "caret",
  "accent", "divide", "outline", "shadow",
];

const FAMILY_SET: ReadonlySet<string> = new Set(ALL_FAMILIES);

interface ClassAttrSlot {
  oid: string | null;
  // Inner-value range — INSIDE the surrounding quotes of the JSX
  // string literal. `start` points to the first character of the
  // class string, `end` points one past the last character.
  start: number;
  end: number;
}

function collectOpenings(node: any, into: any[]): void {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXOpeningElement") into.push(node);
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      for (const c of child) collectOpenings(c, into);
    } else if (child && typeof child === "object" && child.type) {
      collectOpenings(child, into);
    }
  }
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

// Returns the className/class attribute's StringLiteral value node, or
// null if the element has no className / has a non-string-literal value
// (e.g. JSXExpressionContainer). We only rewrite static strings.
function readClassNameAttr(opening: any): any | null {
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

// Strip variant prefixes (`hover:`, `md:`, `dark:`, etc.) from a
// classname token; return the bare core. Keep variant intact so the
// caller can re-attach.
function splitVariants(token: string): { variant: string; core: string } {
  const idx = token.lastIndexOf(":");
  if (idx === -1) return { variant: "", core: token };
  return { variant: token.slice(0, idx + 1), core: token.slice(idx + 1) };
}

interface TokenParts {
  prefix: string;
  family: Family;
  shade: string;
  alpha: string; // includes leading "/" if present, otherwise ""
}

// Parse a Tailwind class core (post variant strip) into prefix /
// family / shade / optional alpha. Returns null if the token doesn't
// match the {prefix}-{family}-{shade}[/{alpha}] shape.
function parseToken(core: string): TokenParts | null {
  // Reject arbitrary-value classes — handled separately by
  // parseArbitraryHexToken below.
  if (core.includes("[")) return null;
  for (const p of PREFIXES) {
    if (!core.startsWith(p + "-")) continue;
    const rest = core.slice(p.length + 1);
    for (const f of ALL_FAMILIES) {
      if (!rest.startsWith(f + "-")) continue;
      const shadePart = rest.slice(f.length + 1);
      const m = shadePart.match(/^(\d{2,4})(\/\d+(?:\.\d+)?)?$/);
      if (!m) continue;
      const shadeNum = m[1];
      return {
        prefix: p,
        family: f,
        shade: shadeNum,
        alpha: m[2] ?? "",
      };
    }
  }
  return null;
}

function rebuildToken(parts: TokenParts, destFamily: Family): string {
  return `${parts.prefix}-${destFamily}-${parts.shade}${parts.alpha}`;
}

// 2026-05-20 — Arbitrary-value Tailwind tokens like `bg-[#6366f1]` are
// the AI's favorite output format (one-off hex colors) and a huge chunk
// of any AI-generated template's color surface. The named-token path
// above skips them. This parser maps them back to the Tailwind palette
// when the hex matches a known (family, shade) pair.
//
// Examples handled:
//   bg-[#6366f1]      → indigo-500
//   text-[#10b981]    → emerald-500
//   border-[#3b82f6]  → blue-500
//   hover:bg-[#a855f7] → variant preserved, purple-500 inside
//
// Examples NOT handled (returned null, left untouched):
//   bg-[rgb(...)]     → non-hex syntax
//   bg-[url(...)]     → image URL
//   text-[14px]       → not a color
//   bg-[#abc]         → 3-digit hex; we only match 6-digit Tailwind hex
function parseArbitraryHexToken(
  core: string,
): { prefix: string; family: Family; shade: string; alpha: string } | null {
  for (const p of PREFIXES) {
    if (!core.startsWith(p + "-[")) continue;
    // Match `prefix-[#rrggbb]` or `prefix-[#rrggbb]/{alpha}`.
    const rest = core.slice(p.length + 1);
    const m = rest.match(/^\[#([0-9a-fA-F]{6})\](\/\d+(?:\.\d+)?)?$/);
    if (!m) return null;
    const hex = "#" + m[1].toLowerCase();
    const lookup = FAMILY_HEX_SHADES.get(hex);
    if (!lookup) return null;
    return {
      prefix: p,
      family: lookup.family,
      shade: lookup.shade,
      alpha: m[2] ?? "",
    };
  }
  return null;
}

function rebuildArbitraryHexToken(
  parts: { prefix: string; shade: string; alpha: string },
  destFamily: Family,
): string | null {
  const destHexShades = (
    (
      [
        "slate","gray","zinc","neutral","stone",
        "red","orange","amber","yellow","lime","green","emerald","teal",
        "cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose",
      ] as Family[]
    ).includes(destFamily)
  );
  if (!destHexShades) return null;
  // Look up destination hex from the palettes module's full table.
  // We don't import lookupFamilyHex directly here to avoid a circular
  // import surface — the FAMILY_HEX_SHADES map covers reverse lookup,
  // and we re-derive forward by scanning entries.
  for (const [hex, info] of FAMILY_HEX_SHADES) {
    if (info.family === destFamily && info.shade === parts.shade) {
      return `${parts.prefix}-[${hex}]${parts.alpha}`;
    }
  }
  return null;
}

export function applyPalette(
  source: string,
  op: PaletteOperation
): PaletteResult {
  let ast: any;
  try {
    ast = parse(source, PARSE_OPTS);
  } catch (e) {
    return {
      source,
      unchanged: true,
      reason: `parse failed: ${String(e)}`,
    };
  }

  const palette = op.palette;
  const scope = op.scope;
  const scopeOidSet =
    scope === "all" ? null : new Set<string>(scope.oids);

  // Pass 0: collect every (oid, className value range) tuple in source.
  const openings: any[] = [];
  collectOpenings(ast, openings);

  const slots: ClassAttrSlot[] = [];
  for (const opening of openings) {
    const classAttrVal = readClassNameAttr(opening);
    if (!classAttrVal) continue;
    const oid = readOidAttr(opening);
    // String literal start/end span the surrounding quotes. Inner range
    // is [start+1, end-1].
    slots.push({
      oid,
      start: classAttrVal.start + 1,
      end: classAttrVal.end - 1,
    });
  }

  function inScope(oid: string | null): boolean {
    if (scopeOidSet === null) return true;
    if (oid === null) return false;
    return scopeOidSet.has(oid);
  }

  // Pass 1: family usage counts within scope. Counts BOTH named tokens
  // (bg-blue-500) AND arbitrary-hex tokens (bg-[#3b82f6]) since the
  // mapping should consider both shapes when picking which family is
  // "the primary."
  const counts = new Map<Family, number>();
  for (const slot of slots) {
    if (!inScope(slot.oid)) continue;
    const value = source.slice(slot.start, slot.end);
    for (const tok of value.split(/\s+/)) {
      if (!tok) continue;
      const { core } = splitVariants(tok);
      const namedParts = parseToken(core);
      if (namedParts) {
        counts.set(namedParts.family, (counts.get(namedParts.family) ?? 0) + 1);
        continue;
      }
      const hexParts = parseArbitraryHexToken(core);
      if (hexParts) {
        counts.set(hexParts.family, (counts.get(hexParts.family) ?? 0) + 1);
      }
    }
  }

  // No families in scope — palette swap is a no-op. Return unchanged
  // with a friendly reason so the caller can surface a toast.
  if (counts.size === 0) {
    return {
      source,
      unchanged: true,
      reason: "no Tailwind color tokens in scope",
    };
  }

  // Sort families by usage descending. Stable order (insertion-order
  // tiebreak) is fine for our use case.
  const sortedFamilies = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([f]) => f);

  const neutralUsed: Family[] = sortedFamilies.filter((f) =>
    NEUTRAL_FAMILIES.has(f)
  );
  const nonNeutralUsed: Family[] = sortedFamilies.filter(
    (f) => !NEUTRAL_FAMILIES.has(f)
  );

  // Build the mapping. Source-role → palette-role.
  const mapping = new Map<Family, Family>();
  if (neutralUsed[0]) {
    mapping.set(neutralUsed[0], palette.families.neutral);
  }
  if (nonNeutralUsed[0]) {
    mapping.set(nonNeutralUsed[0], palette.families.primary);
  }
  if (nonNeutralUsed[1]) {
    mapping.set(nonNeutralUsed[1], palette.families.accent);
  }

  // Pass 2: rewrite. Skip slots that produce no change to keep the
  // resulting source diff minimal.
  const s = new MagicString(source);
  let changed = false;
  for (const slot of slots) {
    if (!inScope(slot.oid)) continue;
    const value = source.slice(slot.start, slot.end);
    let updated = false;
    const rebuilt = value
      .split(/(\s+)/)
      .map((chunk) => {
        if (/^\s+$/.test(chunk) || !chunk) return chunk;
        const { variant, core } = splitVariants(chunk);
        // Try named token first (bg-blue-500). Then arbitrary hex
        // (bg-[#3b82f6]). Both route through the same family-mapping
        // logic but use different rebuild functions.
        const named = parseToken(core);
        if (named) {
          const dest = mapping.get(named.family);
          if (!dest) return chunk;
          if (dest === named.family) return chunk;
          if (
            NEUTRAL_FAMILIES.has(named.family) !==
            NEUTRAL_FAMILIES.has(dest)
          ) {
            return chunk;
          }
          if (!FAMILY_SET.has(named.family)) return chunk;
          updated = true;
          return variant + rebuildToken(named, dest);
        }
        const hex = parseArbitraryHexToken(core);
        if (hex) {
          const dest = mapping.get(hex.family);
          if (!dest) return chunk;
          if (dest === hex.family) return chunk;
          if (
            NEUTRAL_FAMILIES.has(hex.family) !==
            NEUTRAL_FAMILIES.has(dest)
          ) {
            return chunk;
          }
          const rebuilt = rebuildArbitraryHexToken(hex, dest);
          if (!rebuilt) return chunk;
          updated = true;
          return variant + rebuilt;
        }
        return chunk;
      })
      .join("");
    if (updated && rebuilt !== value) {
      s.overwrite(slot.start, slot.end, rebuilt);
      changed = true;
    }
  }

  if (!changed) {
    return {
      source,
      unchanged: true,
      reason: "no tokens needed rewriting (palette already applied)",
    };
  }

  return { source: s.toString(), unchanged: false, reason: null };
}
