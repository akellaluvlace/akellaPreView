// Phase F foundation — Instance graph query.
//
// "Cross-instance swap propagation" needs a way to enumerate every call
// site that resolves to a given component definition. This module is the
// PURE-LOGIC INVERSE of `cross-file-query.ts`:
//
//   cross-file-query: <Card /> in App.jsx → which file/oid is its DEFINITION?
//   instance-graph:   def in Card.jsx → which call sites across the project
//                     INSTANTIATE it?
//
// The result is consumed by Phase F's pre-flight envelope check (when
// the user invokes "everywhere mode" Swap, every call site's slot
// envelope must accept the new asset). Q10 locked-decision: any envelope
// failure aborts the multi-instance swap atomically.
//
// Pure-logic only — no React, no DOM, no IDB. Walks the full project
// AST set on each call; caller may memoise on `[project]`.

import { parse, type ParserOptions } from "@babel/parser";
import { findInlineComponentDefRootOid } from "./component-def";
import { resolveRelativeImport, getFile, listFiles } from "../files/operations";
import type { FileId, FileRecord, Project } from "../files/types";
import { OID_ATTR } from "./oids";

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

export interface InstanceRef {
  readonly fileId: FileId;
  readonly oid: string;
}

export type InstanceGraphResult =
  | { ok: true; instances: InstanceRef[]; defExports: DefinitionExport[] }
  | { ok: false; reason: string };

export interface DefinitionExport {
  readonly localName: string;
  readonly exportedName: string;
  readonly isDefault: boolean;
}

// Find every JSX call site across the project that resolves to the
// component definition rooted at (defFileId, defRootOid).
//
// Resolution order:
//   1. Identify which export(s) of `defFileId` wrap the given OID by
//      walking the def file's top-level body and matching subtree-
//      contains-oid for every export form.
//   2. For each file in the project:
//      - parse + find imports whose source resolves (relative) to
//        `defFileId`. Track the local binding name for each matching
//        specifier (default vs named alias both supported).
//      - For the def file itself, the local binding is the def's
//        original local declaration name (so `<Card />` calls inside
//        `function App()` in the SAME file still count).
//      - Walk all JSXElements in the file; collect those whose
//        openingElement.name matches a tracked local binding.
//   3. Return the flat list of (fileId, oid) refs.
//
// Failure modes (`ok: false`):
//   - defFile not in project
//   - parse error in defFile
//   - defRootOid not found in any export
//
// Files OTHER than the def file that fail to parse get LOGGED as a
// reason but do not bail the whole query — caller wants partial results
// when one file is unparseable. (defFile parse failure DOES bail since
// without it we can't identify the export.)
export function findAllInstancesOfDefinition(
  project: Project,
  defFileId: FileId,
  defRootOid: string,
): InstanceGraphResult {
  if (!defRootOid || typeof defRootOid !== "string") {
    return { ok: false, reason: "defRootOid must be a non-empty string" };
  }

  const defFile = getFile(project, defFileId);
  if (!defFile) {
    return { ok: false, reason: `def file not in project: ${defFileId}` };
  }

  // Step 1 — identify which export(s) wrap the OID.
  let defAst: any;
  try {
    defAst = parse(defFile.source, PARSE_OPTS);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, reason: `parse error in def file "${defFile.path}": ${msg}` };
  }

  const defExports = findExportsContainingOid(defAst, defFile.source, defRootOid);
  if (defExports.length === 0) {
    return {
      ok: false,
      reason: `defRootOid "${defRootOid}" not found in any export of "${defFile.path}"`,
    };
  }

  // Step 2 — walk every project file looking for call sites.
  const instances: InstanceRef[] = [];
  for (const file of listFiles(project)) {
    if (!isJsishFile(file)) continue;

    let ast: any;
    try {
      ast = parse(file.source, PARSE_OPTS);
    } catch {
      // Best-effort: skip files that don't parse. Caller may surface
      // a separate warn if any file's source is malformed; this
      // module's contract is "find what we can."
      continue;
    }

    const localBindings = collectLocalBindings(
      file,
      ast,
      project,
      defFile,
      defExports,
    );
    if (localBindings.size === 0) continue;

    walkJsxElements(ast, (el) => {
      const tag = readJsxTagIdentifier(el);
      if (tag === null) return;
      if (!localBindings.has(tag)) return;
      const oid = readOpeningOid(el);
      if (oid === null) return;
      // Don't count the def itself (when def file is being walked).
      if (file.id === defFile.id && oid === defRootOid) return;
      instances.push({ fileId: file.id, oid });
    });
  }

  return { ok: true, instances, defExports };
}

// File extension gate. We only walk JSX/TSX/JS/TS — HTML files don't
// have ImportDeclarations or JSXElements.
function isJsishFile(file: FileRecord): boolean {
  return (
    file.kind === "jsx" ||
    file.kind === "tsx" ||
    file.kind === "js" ||
    file.kind === "ts"
  );
}

// Walk the def AST and collect (localName, exportedName, isDefault) for
// every export whose subtree contains an element with the given OID.
function findExportsContainingOid(
  defAst: any,
  defSource: string,
  defRootOid: string,
): DefinitionExport[] {
  const out: DefinitionExport[] = [];
  const body = defAst?.program?.body ?? [];

  for (const stmt of body) {
    if (stmt?.type === "ExportDefaultDeclaration") {
      const decl = stmt.declaration;
      if (!decl) continue;

      // `export default function Foo()` → name = Foo. Also walks the
      // body to confirm the OID is inside.
      if (decl.type === "FunctionDeclaration" && decl.id?.type === "Identifier") {
        if (subtreeContainsOid(decl.body, defRootOid)) {
          out.push({
            localName: decl.id.name,
            exportedName: decl.id.name, // default import LOCAL name carries here
            isDefault: true,
          });
        }
      }

      // `export default function() {}` — anonymous. No localName, but the
      // export is still default. Use empty string for localName.
      else if (decl.type === "FunctionDeclaration" && !decl.id) {
        if (subtreeContainsOid(decl.body, defRootOid)) {
          out.push({ localName: "", exportedName: "", isDefault: true });
        }
      }

      // `export default () => <X />` arrow / function expression.
      else if (
        decl.type === "ArrowFunctionExpression" ||
        decl.type === "FunctionExpression"
      ) {
        if (subtreeContainsOid(decl.body, defRootOid)) {
          out.push({ localName: "", exportedName: "", isDefault: true });
        }
      }

      // `export default Card` (Identifier) — find the local binding.
      else if (decl.type === "Identifier") {
        const oid = findInlineComponentDefRootOid(defSource, decl.name);
        if (oid === defRootOid) {
          out.push({
            localName: decl.name,
            exportedName: decl.name,
            isDefault: true,
          });
        }
      }
      continue;
    }

    if (stmt?.type === "ExportNamedDeclaration") {
      // Re-export form (`export { Foo } from './bar'`) — locked decision
      // D4: bail. Skip.
      if (stmt.source) continue;

      // Declaration form: `export const Foo = ...` / `export function Foo() {}`.
      if (stmt.declaration) {
        const decl = stmt.declaration;
        if (decl.type === "FunctionDeclaration" && decl.id?.type === "Identifier") {
          if (subtreeContainsOid(decl.body, defRootOid)) {
            out.push({
              localName: decl.id.name,
              exportedName: decl.id.name,
              isDefault: false,
            });
          }
        } else if (decl.type === "VariableDeclaration") {
          for (const d of decl.declarations || []) {
            if (d.id?.type === "Identifier" && subtreeContainsOid(d.init, defRootOid)) {
              out.push({
                localName: d.id.name,
                exportedName: d.id.name,
                isDefault: false,
              });
            }
          }
        }
        continue;
      }

      // Specifier form: `export { Foo, Bar as Baz }`. For each spec, look
      // up the local binding and check if its body contains the OID.
      for (const spec of stmt.specifiers || []) {
        if (spec.type !== "ExportSpecifier") continue;
        const localName = spec.local?.type === "Identifier" ? spec.local.name : null;
        const exportedName =
          spec.exported?.type === "Identifier"
            ? spec.exported.name
            : spec.exported?.type === "StringLiteral"
            ? spec.exported.value
            : null;
        if (!localName || !exportedName) continue;
        const oid = findInlineComponentDefRootOid(defSource, localName);
        if (oid === defRootOid) {
          out.push({ localName, exportedName, isDefault: false });
        }
      }
      continue;
    }
  }

  // Also: declarations that aren't exported but are still callable
  // INSIDE the def file. e.g.
  //   function Card() { return <div data-dropin-id="root1" />; }
  //   function App() { return <Card />; }   // ← internal call
  //   export default App;
  // For in-file detection of <Card /> we need to know `Card`'s local name
  // even when `Card` itself isn't exported. Walk top-level FunctionDeclarations
  // + VariableDeclarations not already enumerated above.
  for (const stmt of body) {
    if (stmt?.type === "FunctionDeclaration" && stmt.id?.type === "Identifier") {
      if (subtreeContainsOid(stmt.body, defRootOid)) {
        const already = out.some((e) => e.localName === stmt.id.name);
        if (!already) {
          // Local-only declaration, no export. Record so in-file calls match.
          // exportedName "" signals "not exported"; the cross-file walk
          // ignores these but the in-file walk still uses localName.
          out.push({
            localName: stmt.id.name,
            exportedName: "",
            isDefault: false,
          });
        }
      }
    } else if (stmt?.type === "VariableDeclaration") {
      for (const d of stmt.declarations || []) {
        if (d.id?.type === "Identifier" && subtreeContainsOid(d.init, defRootOid)) {
          const already = out.some((e) => e.localName === d.id.name);
          if (!already) {
            out.push({
              localName: d.id.name,
              exportedName: "",
              isDefault: false,
            });
          }
        }
      }
    }
  }

  return out;
}

// Subtree-contains-oid: walk a Babel AST node and return true if any
// JSXElement within it has the matching OID attribute.
function subtreeContainsOid(node: any, targetOid: string): boolean {
  if (!node || typeof node !== "object") return false;
  if (node.type === "JSXElement") {
    if (readOpeningOid(node) === targetOid) return true;
  }
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        if (subtreeContainsOid(c, targetOid)) return true;
      }
    } else if (child && typeof child === "object" && child.type) {
      if (subtreeContainsOid(child, targetOid)) return true;
    }
  }
  return false;
}

function readOpeningOid(jsxEl: any): string | null {
  for (const a of jsxEl?.openingElement?.attributes || []) {
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

// Read the JSX tag's local Identifier name (e.g., "Card" in <Card />).
// Returns null for member expressions (`<Pkg.X />`) and namespaced names
// (`<svg:circle />`) — those are not v1 instances.
function readJsxTagIdentifier(jsxEl: any): string | null {
  const name = jsxEl?.openingElement?.name;
  if (!name) return null;
  if (name.type === "JSXIdentifier") return name.name;
  return null;
}

// Walk all JSXElements in an AST, calling `visit` on each.
function walkJsxElements(node: any, visit: (el: any) => void): void {
  if (!node || typeof node !== "object") return;
  if (node.type === "JSXElement") visit(node);
  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) walkJsxElements(c, visit);
    } else if (child && typeof child === "object" && child.type) {
      walkJsxElements(child, visit);
    }
  }
}

// For the given project file, collect the LOCAL binding name(s) under
// which the def's exports appear. For non-def files: walks imports. For
// def file itself: returns the def's original local names.
function collectLocalBindings(
  file: FileRecord,
  ast: any,
  project: Project,
  defFile: FileRecord,
  defExports: DefinitionExport[],
): Set<string> {
  const out = new Set<string>();

  if (file.id === defFile.id) {
    // In-file calls: the LOCAL declaration name is what matters; exported
    // shape doesn't. Every defExport carries `localName` (some empty for
    // anonymous defaults — those produce no in-file binding to track).
    for (const e of defExports) {
      if (e.localName) out.add(e.localName);
    }
    return out;
  }

  const body = ast?.program?.body ?? [];
  for (const stmt of body) {
    if (stmt?.type !== "ImportDeclaration") continue;
    const sourceSpec = stmt.source?.value;
    if (typeof sourceSpec !== "string") continue;
    if (!sourceSpec.startsWith(".") && !sourceSpec.startsWith("/")) continue;

    const resolved = resolveRelativeImport(project, file.path, sourceSpec);
    if (!resolved || resolved.id !== defFile.id) continue;

    for (const spec of stmt.specifiers || []) {
      if (spec.local?.type !== "Identifier") continue;
      const localBinding = spec.local.name;

      if (spec.type === "ImportDefaultSpecifier") {
        if (defExports.some((e) => e.isDefault)) {
          out.add(localBinding);
        }
        continue;
      }
      if (spec.type === "ImportSpecifier") {
        const importedName =
          spec.imported?.type === "Identifier"
            ? spec.imported.name
            : spec.imported?.type === "StringLiteral"
            ? spec.imported.value
            : null;
        if (importedName === null) continue;
        if (defExports.some((e) => !e.isDefault && e.exportedName === importedName)) {
          out.add(localBinding);
        }
        continue;
      }
      // ImportNamespaceSpecifier (`import * as Pkg`) is skipped — `<Pkg.X />`
      // is a JSXMemberExpression, not a single Identifier; readJsxTagIdentifier
      // already returns null for those, so we'd never match anyway.
    }
  }
  return out;
}
