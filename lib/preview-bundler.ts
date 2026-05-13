// Phase C — Multi-file iframe bundler.
//
// Walks a Project's relative import graph starting from the entry file,
// resolves each `./foo` / `../bar` against the file pool, detects cycles, and
// emits a single concatenated source string suitable for the existing iframe
// runtime in `lib/preview.ts`.
//
// Pure: no React, no DOM, no IndexedDB. Caller (Workspace via Preview) runs
// this in the parent process before passing the result to `buildPreviewDocument`.
//
// What the bundler does:
//   - Resolves relative imports across files in `project.files`.
//   - Wraps each non-entry file's body in an IIFE that returns its export
//     bag: `{ default, namedA, namedB, ... }`.
//   - Rewrites the importer's `import X from './foo'` into a closure-scoped
//     `var X = __mod_<idx>.default;` declaration.
//   - Hoists curated-npm imports (deduplicated) to the bundle top so the
//     iframe's existing `processModuleSyntax` produces a single preamble of
//     `var X = window.__pkgs[...]` bindings — npm imports buried inside
//     IIFEs would be illegal (`import` must be top-level under
//     `sourceType: 'module'`).
//   - Leaves the entry file's `export default` keyword alone — the iframe
//     runtime turns it into `return` to wire the IIFE's return value into
//     `ReactDOM.render`.
//
// What the bundler does NOT do:
//   - JSX → JS transformation. The iframe's Babel.transform handles that for
//     the WHOLE bundle in one pass, so JSX in non-entry files works the same
//     as in the entry.
//   - Curated-npm import rewriting. Stays delegated to the iframe runtime.
//   - Re-exports (`export { Foo } from './x'`, `export * from './x'`).
//     Bails with a clear error per locked decision D4.
//   - HOC / barrel re-export resolution. The bundler successfully bundles
//     these (an HOC's default export is just `<expr>` to us); only the
//     downstream definition-resolver in Phase D will refuse them.
//
// Edge cases:
//   - Single-file projects: `bundleProject` short-circuits and returns the
//     entry source unchanged. Zero overhead vs the pre-Phase-C path.
//   - HTML entry: no imports possible. Caller should not invoke the bundler;
//     defensive fallback returns the entry source unchanged.
//   - Cycles: `import A from './b'` and `import B from './a'` → bail with
//     `cycle detected` error.
//   - File not found: bail with `cannot resolve '<spec>' from '<path>'`.
//   - Per-file parse failure: bail with the parser error string. (The iframe
//     would have errored anyway; bundling-time error gives the user a clearer
//     trace including the path of the failing file.)
//
// Line-number caveat:
//   The iframe's `dropin-loc` Babel plugin tags JSX elements with bundle-
//   relative line numbers, then subtracts 1 to map to user-source line N. With
//   bundling, the entry file no longer starts at bundle line 2; module IIFEs
//   prepended push it down. This means clicking a non-entry-file element in
//   the preview lands on the WRONG user-source line. Inspector resolution by
//   OID (`data-dropin-id`) is unaffected — OIDs are unique across the bundle
//   and DOM lookup finds the right element. The `data-dropin-loc` -based
//   "scroll Monaco to the clicked line" hint is degraded for multi-file in v1.
//   Documented limitation; full fix lands with Phase D's cross-file query.

import { parse, type ParserOptions } from "@babel/parser";
import MagicString from "magic-string";
import type { File as BabelFile } from "@babel/types";
import {
  resolveRelativeImport,
  getEntryFile,
  getFile,
} from "./files/operations";
import type { FileId, FileRecord, Project } from "./files/types";

const PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

// Identifier prefix for the in-bundle module table. Each non-entry file gets
// one slot keyed by topological index. Index-based avoids collisions that
// path-derived names (`__mod_components_Card_tsx` vs `components_Card.tsx`)
// would have.
const MOD_PREFIX = "__dropin_mod_";

export type BundleResult =
  | {
      ok: true;
      source: string;
      // Number of bundle-line newlines BEFORE the entry source begins.
      // Caller can pass this to the iframe runtime to adjust dropin-loc
      // mappings (deferred to Phase D).
      entryLineOffset: number;
      // Number of files actually bundled. 1 for single-file projects (just
      // the entry); >1 when relative imports resolved.
      filesBundled: number;
    }
  | { ok: false; error: string };

export interface BundleOpts {
  // Reserved for future cross-file inspector wiring. Not consumed in v1.
  emitFileMarkers?: boolean;
}

export function bundleProject(
  project: Project,
  entryFileId: FileId | null = null,
  _opts: BundleOpts = {},
): BundleResult {
  const entry = entryFileId
    ? getFile(project, entryFileId)
    : getEntryFile(project);
  if (!entry) {
    return { ok: false, error: `entry file not found: ${entryFileId}` };
  }

  // HTML mode: the bundler is a no-op. HTML files don't have ES module
  // imports. Caller (Preview) should already gate on kind, but defensive.
  if (entry.kind === "html") {
    return { ok: true, source: entry.source, entryLineOffset: 0, filesBundled: 1 };
  }

  // Build dependency graph + topo order via DFS from the entry. White (not
  // visited) → gray (on current path) → black (done). Gray-on-gray = cycle.
  const visited = new Map<string, "gray" | "black">();
  const order: FileRecord[] = [];
  // Per-file parsed AST + raw imports list, cached so we don't re-parse below.
  const parsed = new Map<string, ParsedFile>();

  const stack: Array<{ file: FileRecord; iter: Iterator<RelImport> }> = [];

  // Seed with entry. We do an iterative DFS instead of recursion so deep
  // import chains don't blow the call stack on ad-hoc test fixtures.
  const entryParseResult = parseFileImports(project, entry);
  if (!entryParseResult.ok) return entryParseResult;
  parsed.set(entry.path, entryParseResult.parsed);
  visited.set(entry.path, "gray");
  stack.push({ file: entry, iter: entryParseResult.parsed.relImports[Symbol.iterator]() });

  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    const next = top.iter.next();
    if (next.done) {
      visited.set(top.file.path, "black");
      // Entry file is finalized last (post-order). Push to order.
      order.push(top.file);
      stack.pop();
      continue;
    }
    const rel = next.value;
    const resolved = resolveRelativeImport(project, top.file.path, rel.spec);
    if (!resolved) {
      return {
        ok: false,
        error: `cannot resolve "${rel.spec}" from "${top.file.path}"`,
      };
    }
    const color = visited.get(resolved.path);
    if (color === "gray") {
      return {
        ok: false,
        error: `import cycle detected: "${resolved.path}" reached from "${top.file.path}"`,
      };
    }
    if (color === "black") continue;

    const r = parseFileImports(project, resolved);
    if (!r.ok) return r;
    parsed.set(resolved.path, r.parsed);
    visited.set(resolved.path, "gray");
    stack.push({
      file: resolved,
      iter: r.parsed.relImports[Symbol.iterator](),
    });
  }

  // Single-file short-circuit: only the entry was visited and it has no
  // relative imports. Return entry source verbatim — the iframe runtime
  // handles npm imports + export default exactly as it did pre-Phase-C.
  if (order.length === 1) {
    return { ok: true, source: entry.source, entryLineOffset: 0, filesBundled: 1 };
  }

  // order is post-order: dependencies before dependents, entry last. Module
  // IIFEs need to evaluate in this order so a dependent's `var X = __mod_<i>...`
  // sees the IIFE result. Build a topological-index map keyed by path.
  const topoIndex = new Map<string, number>();
  for (let i = 0; i < order.length; i++) topoIndex.set(order[i].path, i);

  // Collect all unique npm imports (any spec that's NOT relative). Hoist to
  // bundle top — `import` is a top-level-only statement under sourceType:
  // 'module', so an import buried inside a module IIFE would be a SyntaxError.
  // The iframe's processModuleSyntax then converts the hoisted imports into
  // `var X = window.__pkgs[name]...` preamble bindings.
  const npmHoist = collectNpmImports(parsed, order);

  // For each file, build the rewritten body:
  //   - Strip ALL imports (relative AND npm).
  //   - Inject relative-import bindings (`var X = __mod_<idx>.default`) at
  //     the top of the body.
  //   - Inject npm-import bindings the SAME WAY for non-entry files (the
  //     hoisted top-level imports won't reach into module IIFE scope under
  //     strict-mode? actually they will — hoisted vars are at outer IIFE
  //     scope, inner IIFE closes over them. So we DON'T need to re-emit
  //     npm bindings inside module IIFEs).
  //   - Transform top-level exports per the rules below.
  const parts: string[] = [];

  // 1) Hoisted npm imports at the very top.
  for (const imp of npmHoist) parts.push(imp);

  // 2) Each non-entry module IIFE in topological order.
  for (let i = 0; i < order.length - 1; i++) {
    const file = order[i];
    const p = parsed.get(file.path);
    if (!p) {
      // Defensive: parsed was set when we visited.
      return { ok: false, error: `internal: parsed missing for "${file.path}"` };
    }
    const wrapped = buildModuleIife(file, p, topoIndex, project, i);
    if (!wrapped.ok) return wrapped;
    parts.push(wrapped.source);
  }

  // 3) Entry file. NOT wrapped in an IIFE — the iframe runtime wraps the
  //    whole bundle. Rewrite relative imports + strip npm imports (already
  //    hoisted). Leave `export default` for the iframe runtime to convert
  //    into `return`.
  const entryParsed = parsed.get(entry.path);
  if (!entryParsed) {
    return { ok: false, error: `internal: parsed missing for entry "${entry.path}"` };
  }
  const entryRewritten = buildEntrySource(entry, entryParsed, topoIndex, project);
  if (!entryRewritten.ok) return entryRewritten;

  // Pre-entry parts (npm hoist + module IIFEs) are joined with newlines so
  // each lives on its own line for debug-tooling readability. Entry source
  // is appended last.
  const preEntry = parts.join("\n");
  const finalSource = preEntry + (preEntry ? "\n" : "") + entryRewritten.source;

  // Count newlines in the pre-entry portion to derive entryLineOffset.
  // Used by future inspector wiring to remap dropin-loc lines back to entry
  // user-source line numbers.
  let entryLineOffset = 0;
  for (let i = 0; i < preEntry.length; i++) {
    if (preEntry.charCodeAt(i) === 10 /* \n */) entryLineOffset++;
  }
  if (preEntry) entryLineOffset++; // the joining newline before entry

  return {
    ok: true,
    source: finalSource,
    entryLineOffset,
    filesBundled: order.length,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Internals
// ────────────────────────────────────────────────────────────────────────────

interface RelImport {
  spec: string;
  start: number;
  end: number;
}

interface ImportSpan {
  start: number;
  end: number;
  spec: string;
  // Pre-built replacement source for this import statement. For relative
  // imports it's the var-binding emit; for npm imports it's empty (the
  // statement is hoisted, the in-place range becomes whitespace).
  replacement: string;
  isRelative: boolean;
  // Original verbatim text. Used for npm hoisting so the hoisted statement
  // matches the user's exact spec specifier order.
  raw: string;
}

interface ExportInfo {
  // Identifier expression that becomes `default` in the IIFE return shape.
  // null when the file has no default export.
  defaultExpr: string | null;
  // Map from EXPORTED name (key as seen by the consumer) to LOCAL identifier
  // (the variable in scope inside the IIFE). e.g. `export { Foo as Bar }` →
  // namedExports.set("Bar", "Foo").
  namedExports: Map<string, string>;
}

interface ExportEdit {
  start: number;
  end: number;
  replacement: string;
}

interface ParsedFile {
  ast: BabelFile;
  // All import statements (both relative and npm). Imports get processed at
  // bundle-emit time per-file because the rewrite shape depends on the
  // topo-index map.
  imports: ImportSpan[];
  // Just the relative import specs — fed to the DFS walker so we don't
  // re-walk the AST during graph construction.
  relImports: RelImport[];
  // Top-level export edits (whitespace strip / `export default ` → `var __default = `).
  exportEdits: ExportEdit[];
  // Resolved export shape used to emit the IIFE return statement.
  exports: ExportInfo;
}

type ParseResult =
  | { ok: true; parsed: ParsedFile }
  | { ok: false; error: string };

function parseFileImports(project: Project, file: FileRecord): ParseResult {
  let ast: BabelFile;
  try {
    ast = parse(file.source, PARSE_OPTS);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `parse error in "${file.path}": ${msg}` };
  }

  const imports: ImportSpan[] = [];
  const relImports: RelImport[] = [];
  const exportEdits: ExportEdit[] = [];
  const exports: ExportInfo = { defaultExpr: null, namedExports: new Map() };

  const body = ast.program?.body ?? [];
  for (const node of body) {
    if (
      node.type === "ImportDeclaration" &&
      typeof node.start === "number" &&
      typeof node.end === "number"
    ) {
      const spec = node.source.value;
      const isRelative =
        spec.startsWith(".") || spec.startsWith("/");
      const raw = file.source.slice(node.start, node.end);
      if (isRelative) {
        relImports.push({ spec, start: node.start, end: node.end });
      }
      // Replacement is filled in at bundle-emit time when topoIndex is known.
      imports.push({
        start: node.start,
        end: node.end,
        spec,
        replacement: "",
        isRelative,
        raw,
      });
      continue;
    }

    if (
      node.type === "ExportAllDeclaration" &&
      typeof node.start === "number" &&
      typeof node.end === "number"
    ) {
      // `export * from './x'` — bail per D4.
      return {
        ok: false,
        error: `re-export not supported: "export * from ${JSON.stringify(node.source.value)}" in "${file.path}"`,
      };
    }

    if (node.type === "ExportNamedDeclaration") {
      // `export { Foo } from './x'` (re-export with source) — bail.
      if (
        node.source &&
        typeof node.start === "number" &&
        typeof node.end === "number"
      ) {
        return {
          ok: false,
          error: `re-export not supported: "export { ... } from ${JSON.stringify(node.source.value)}" in "${file.path}"`,
        };
      }

      if (
        node.declaration &&
        typeof node.start === "number" &&
        typeof node.declaration.start === "number"
      ) {
        // `export const Foo = ...` / `export function Foo() {}` — strip just
        // the `export ` keyword span. The declaration body stays intact and
        // declares Foo at top level for the IIFE return to capture.
        exportEdits.push({
          start: node.start,
          end: node.declaration.start,
          replacement: "",
        });
        const namesFromDecl = collectNamedExportsFromDeclaration(node.declaration);
        for (const n of namesFromDecl) exports.namedExports.set(n, n);
      } else if (
        node.specifiers.length > 0 &&
        typeof node.start === "number" &&
        typeof node.end === "number"
      ) {
        // `export { Foo, Bar as Baz }` — strip whole statement, register
        // (exported name → local name) mapping so the IIFE return emits
        // `Baz: Bar`.
        exportEdits.push({ start: node.start, end: node.end, replacement: "" });
        for (const sp of node.specifiers) {
          if (sp.type !== "ExportSpecifier") continue;
          const local = sp.local.type === "Identifier" ? sp.local.name : null;
          const exported =
            sp.exported.type === "Identifier"
              ? sp.exported.name
              : sp.exported.type === "StringLiteral"
              ? sp.exported.value
              : null;
          if (local && exported) {
            exports.namedExports.set(exported, local);
          }
        }
      }
      continue;
    }

    if (
      node.type === "ExportDefaultDeclaration" &&
      typeof node.start === "number" &&
      typeof node.declaration.start === "number"
    ) {
      // `export default <decl-or-expr>` — replace `export default ` keyword
      // span with `var __dropin_default =` so the IIFE can capture the value.
      // Names: `export default function Foo()` keeps Foo local but we still
      // bind through __dropin_default for consistency. `export default
      // function() {}` (anonymous) needs the var binding because a bare
      // function expression as a top-level statement is a SyntaxError.
      const replacement = "var __dropin_default = ";
      exportEdits.push({
        start: node.start,
        end: node.declaration.start,
        replacement,
      });
      // `export default function Foo() {}` ends at `}` — needs a trailing
      // semicolon. So does `export default class Foo {}` and any expression.
      // We append `;` to the IIFE return shape rather than mutating source
      // here — easier to reason about, and parses fine because var __default =
      // <thing> is a single statement with implicit ASI on the next line.
      exports.defaultExpr = "__dropin_default";
      continue;
    }
  }

  return {
    ok: true,
    parsed: { ast, imports, relImports, exportEdits, exports },
  };
}

// VariableDeclaration / FunctionDeclaration / ClassDeclaration → list of
// declared names. `export const Foo = ..., Bar = ...` declares both Foo and
// Bar. `export class Foo {}` declares Foo. `export function Foo() {}` declares
// Foo. Anonymous function/class declarations are illegal in this position.
function collectNamedExportsFromDeclaration(decl: any): string[] {
  if (!decl) return [];
  if (decl.type === "VariableDeclaration") {
    const names: string[] = [];
    for (const d of decl.declarations) {
      if (d.id?.type === "Identifier") names.push(d.id.name);
      // Destructured exports (`export const { a, b } = obj`) — rare in user
      // code; bail by skipping. The IIFE return won't include them, so the
      // consumer sees `undefined` if they import. Documented limitation.
    }
    return names;
  }
  if (decl.type === "FunctionDeclaration" || decl.type === "ClassDeclaration") {
    return decl.id?.type === "Identifier" ? [decl.id.name] : [];
  }
  return [];
}

// Across all parsed files, collect the unique npm imports (everything that
// isn't relative). Hoist with a single representative statement per (spec, set
// of bindings) tuple. v1 keeps things simple by emitting each unique original
// statement verbatim — this can produce slightly redundant hoisted statements
// when two files import different names from the same package, but the iframe
// runtime's processModuleSyntax merges all that into a single preamble of
// `var X = window.__pkgs['react']...` bindings, so the final user-visible
// output is unaffected.
function collectNpmImports(
  parsed: ReadonlyMap<string, ParsedFile>,
  order: readonly FileRecord[],
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  // Walk in topological order so npm imports appear in the same order the
  // user authored across files; deduplicate by exact statement text.
  for (const file of order) {
    const p = parsed.get(file.path);
    if (!p) continue;
    for (const imp of p.imports) {
      if (imp.isRelative) continue;
      if (seen.has(imp.raw)) continue;
      seen.add(imp.raw);
      out.push(imp.raw);
    }
  }
  return out;
}

// Emit per-import-statement bindings for the importer's relative imports.
// Each `import X from './foo'` becomes one or more `var X = __mod_<idx>.X;`
// declarations. Default imports map to `.default`; named imports to `.name`;
// namespace imports to the whole IIFE return object.
function emitRelImportBindings(
  imp: ImportSpan,
  fromPath: string,
  topoIndex: ReadonlyMap<string, number>,
  project: Project,
  ast: BabelFile,
): { ok: true; source: string } | { ok: false; error: string } {
  const resolved = resolveRelativeImport(project, fromPath, imp.spec);
  if (!resolved) {
    return {
      ok: false,
      error: `cannot resolve "${imp.spec}" from "${fromPath}"`,
    };
  }
  const idx = topoIndex.get(resolved.path);
  if (idx === undefined) {
    return {
      ok: false,
      error: `internal: topoIndex missing for "${resolved.path}"`,
    };
  }
  const modVar = `${MOD_PREFIX}${idx}`;

  // Find the matching ImportDeclaration in the AST and walk its specifiers.
  // We do this by start-offset match — exact, no fuzzy matching.
  let importNode: any = null;
  for (const node of ast.program?.body ?? []) {
    if (
      node.type === "ImportDeclaration" &&
      node.start === imp.start &&
      node.end === imp.end
    ) {
      importNode = node;
      break;
    }
  }
  if (!importNode) {
    return {
      ok: false,
      error: `internal: ImportDeclaration not found at ${imp.start}`,
    };
  }

  const specs = importNode.specifiers || [];
  if (specs.length === 0) {
    // Side-effect-only `import './foo'` — module IIFE already runs at the
    // top of the bundle thanks to topo order, so we can drop the binding.
    return { ok: true, source: "" };
  }

  const lines: string[] = [];
  for (const s of specs) {
    if (s.type === "ImportDefaultSpecifier") {
      lines.push(`var ${s.local.name} = ${modVar}.default;`);
    } else if (s.type === "ImportNamespaceSpecifier") {
      lines.push(`var ${s.local.name} = ${modVar};`);
    } else if (s.type === "ImportSpecifier") {
      const importedName =
        s.imported?.type === "Identifier"
          ? s.imported.name
          : s.imported?.type === "StringLiteral"
          ? s.imported.value
          : s.local.name;
      lines.push(`var ${s.local.name} = ${modVar}[${JSON.stringify(importedName)}];`);
    }
  }
  return { ok: true, source: lines.join(" ") };
}

function buildModuleIife(
  file: FileRecord,
  parsed: ParsedFile,
  topoIndex: ReadonlyMap<string, number>,
  project: Project,
  topoIdx: number,
): { ok: true; source: string } | { ok: false; error: string } {
  const modVar = `${MOD_PREFIX}${topoIdx}`;
  const ms = new MagicString(file.source);

  // Apply import edits: relative imports become inline var bindings;
  // npm imports are stripped (already hoisted at bundle top).
  for (const imp of parsed.imports) {
    if (imp.isRelative) {
      const r = emitRelImportBindings(imp, file.path, topoIndex, project, parsed.ast);
      if (!r.ok) return r;
      ms.overwrite(imp.start, imp.end, r.source);
    } else {
      // Replace npm import with whitespace so line numbers stay consistent
      // for downstream tooling that walks the IIFE body.
      ms.overwrite(imp.start, imp.end, "");
    }
  }

  // Apply export edits: `export ` strip, `export default ` → `var __dropin_default =`.
  for (const e of parsed.exportEdits) {
    ms.overwrite(e.start, e.end, e.replacement);
  }

  // Build the IIFE return shape from the export info.
  const returnShape = buildIifeReturnExpr(parsed.exports);
  const transformed = ms.toString();
  return {
    ok: true,
    source:
      `var ${modVar} = (function () {\n` +
      transformed +
      `\nreturn ${returnShape};\n})();`,
  };
}

function buildEntrySource(
  entry: FileRecord,
  parsed: ParsedFile,
  topoIndex: ReadonlyMap<string, number>,
  project: Project,
): { ok: true; source: string } | { ok: false; error: string } {
  const ms = new MagicString(entry.source);

  // Same import rewrites as a module IIFE, but no IIFE wrapping. The iframe
  // runtime takes responsibility for `export default` (turns it into `return`)
  // so we DON'T process exportEdits for the entry file.
  for (const imp of parsed.imports) {
    if (imp.isRelative) {
      const r = emitRelImportBindings(imp, entry.path, topoIndex, project, parsed.ast);
      if (!r.ok) return r;
      ms.overwrite(imp.start, imp.end, r.source);
    } else {
      // Strip npm imports (hoisted) — keep line count via newlines so the
      // user's source line numbers map cleanly to bundle line numbers under
      // `(line - entryLineOffset - 1)`.
      ms.overwrite(imp.start, imp.end, "");
    }
  }

  return { ok: true, source: ms.toString() };
}

function buildIifeReturnExpr(exports: ExportInfo): string {
  const fields: string[] = [];
  if (exports.defaultExpr !== null) {
    fields.push(`default: ${exports.defaultExpr}`);
  }
  for (const [exportedName, localName] of exports.namedExports) {
    // exportedName is what consumers use (`__mod_X.exportedName`); localName
    // is the in-IIFE variable. Use bracket syntax for exportedName when it's
    // not a valid JS identifier (rare — `export { foo as "weird name" }`).
    if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(exportedName)) {
      fields.push(`${exportedName}: ${localName}`);
    } else {
      fields.push(`${JSON.stringify(exportedName)}: ${localName}`);
    }
  }
  return `{ ${fields.join(", ")} }`;
}
