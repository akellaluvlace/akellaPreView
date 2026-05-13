// Phase D foundation — Cross-file component-definition query.
//
// In-file propagation already works (`findInlineComponentDefRootOid` in
// `component-def.ts`). To extend "Apply: everywhere" across files, the
// caller asks: given a JSX `<Card />` use site in file A, where is `Card`'s
// JSX root located? Phase D's full implementation will then run an
// additional `applyStyleProps` pass on the resolved file's source, and
// Phase B.2's `applyEditDirect` will package both edits into one atomic
// `Edit { diffs: FileDiff[] }`.
//
// Pure: no React, no DOM, no IDB. Single-pass walk over the call-site
// file's AST + (when needed) the imported file's AST. Re-uses the existing
// `findInlineComponentDefRootOid` for in-file shape detection and for
// resolving named-export declarations in the imported file.
//
// Locked decisions consumed here:
//   D3 (imports): relative + curated npm. Curated npm imports never have
//   a definition we can patch; bail with a clear reason.
//   D4 (definition resolution): direct named + default exports. HOCs
//   (`export default withAuth(Card)`), barrel re-exports
//   (`export { Foo } from './bar'`), and `export *` re-exports bail.
//
// What this module does NOT do (deferred to Phase D proper):
//   - Apply the propagation patch. This module ONLY locates the
//     definition; the caller runs `applyStyleProps` etc. against the
//     resolved file's source.
//   - Recursive resolution through index.ts barrel re-exports. v1 fails
//     fast; v2+ may add a layer of resolution if user demand surfaces.
//
// Result shape mirrors `FileOpResult` for caller-side ergonomics: the
// `ok: false` arm always carries a human-readable `reason` so the caller
// can surface a toast like "Cross-file propagation: <reason>; falling
// back to instance-only".

import { parse, type ParserOptions } from "@babel/parser";
import { findInlineComponentDefRootOid } from "./component-def";
import { resolveRelativeImport, getFile } from "../files/operations";
import type { FileId, FileRecord, Project } from "../files/types";
import { OID_ATTR } from "./oids";

const PARSE_OPTS: ParserOptions = {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
  errorRecovery: true,
};

export type CrossFileDef = {
  fileId: FileId;
  rootOid: string;
};

export type CrossFileQueryResult =
  | { ok: true; def: CrossFileDef }
  | { ok: false; reason: string };

// Top-level entrypoint. Resolves a `<TagName>` use site in `callSiteFileId`
// to the file + JSX root OID of its definition.
//
// Resolution order:
//   1. Try in-file lookup via `findInlineComponentDefRootOid`. Most
//      pasted templates define their components inline — Phase 5 / Phase C
//      / C3 already covers this path with prod-import tests.
//   2. Walk top-level imports in the call-site file. Find one whose local
//      binding name matches `tagName`.
//   3. Resolve the import's source string to a file in the project.
//   4. Recurse-once into the resolved file: find the declaration whose
//      EXPORTED name matches what the call-site imported.
//   5. Read the OID off that declaration's JSX root.
//
// Failure modes (all return `{ ok: false; reason: ... }`):
//   - Lowercase tag (HTML element, not a component).
//   - Call-site file not in project.
//   - Call-site source doesn't parse.
//   - No import statement matches the tag's local name. The propagation
//     toggle should still single-file-fall-back without surfacing a toast
//     in this case (it's the normal "tag is defined inline elsewhere or
//     the user is editing a top-level element, no cross-file work needed")
//     — caller decides whether to surface based on `reason`.
//   - Non-relative import (npm / curated-pkg). Bail.
//   - Relative import doesn't resolve to a file. Bail.
//   - Resolved file's source doesn't parse. Bail.
//   - Resolved file has no matching definition (HOC / re-export-only file
//     / shape we don't support). Bail.
//   - Resolved declaration's JSX root has no OID (defensive — should
//     always have one after `injectOids` ran).
export function findCrossFileDefinition(
  project: Project,
  callSiteFileId: FileId,
  tagName: string,
): CrossFileQueryResult {
  if (!tagName || !/^[A-Z]/.test(tagName)) {
    return { ok: false, reason: "tag is not a component (lowercase tag = HTML)" };
  }

  const callSite = getFile(project, callSiteFileId);
  if (!callSite) {
    return { ok: false, reason: `call-site file not in project: ${callSiteFileId}` };
  }

  // Step 1 — in-file definition (matches existing single-file behaviour).
  const inlineOid = findInlineComponentDefRootOid(callSite.source, tagName);
  if (inlineOid) {
    return { ok: true, def: { fileId: callSiteFileId, rootOid: inlineOid } };
  }

  // Step 2 — walk imports. Parse the call-site source.
  let ast: any;
  try {
    ast = parse(callSite.source, PARSE_OPTS);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, reason: `parse error in "${callSite.path}": ${msg}` };
  }
  const body = ast?.program?.body ?? [];

  // Find the ImportDeclaration whose LOCAL binding name === tagName.
  // This handles both default imports (local = whatever `import X from`
  // says) and named imports with renames (`import { Foo as MyFoo }`).
  let matchedImport: ImportMatch | null = null;
  for (const node of body) {
    if (node.type !== "ImportDeclaration") continue;
    for (const spec of node.specifiers || []) {
      if (spec.local?.type !== "Identifier") continue;
      if (spec.local.name !== tagName) continue;
      matchedImport = {
        sourceSpec: node.source.value,
        specType: spec.type,
        // For named imports, `imported` carries the EXPORTED name. For
        // default imports it's not present.
        importedName:
          spec.type === "ImportSpecifier" && spec.imported
            ? spec.imported.type === "Identifier"
              ? spec.imported.name
              : spec.imported.type === "StringLiteral"
              ? spec.imported.value
              : null
            : null,
      };
      break;
    }
    if (matchedImport) break;
  }

  if (!matchedImport) {
    // No import — caller falls back to instance-only mode quietly.
    return {
      ok: false,
      reason: `tag "${tagName}" not imported in "${callSite.path}"`,
    };
  }

  // Step 3 — relative imports only. Curated npm has no inspectable JSX root.
  const spec = matchedImport.sourceSpec;
  if (!spec.startsWith(".") && !spec.startsWith("/")) {
    return {
      ok: false,
      reason: `tag "${tagName}" imported from "${spec}"; cross-file propagation only works for project files`,
    };
  }

  // Step 4 — resolve to a project file.
  const resolved = resolveRelativeImport(project, callSite.path, spec);
  if (!resolved) {
    return {
      ok: false,
      reason: `cannot resolve "${spec}" from "${callSite.path}"`,
    };
  }

  // Step 5 — find the JSX root in the resolved file.
  return findExportedJsxRoot(resolved, matchedImport, tagName);
}

interface ImportMatch {
  sourceSpec: string;
  specType: "ImportDefaultSpecifier" | "ImportNamespaceSpecifier" | "ImportSpecifier" | string;
  importedName: string | null;
}

// Find the JSX root OID corresponding to the given import shape in the
// resolved file's source. Three paths: default import, namespace import
// (bail — namespace use as a JSX tag is not a meaningful pattern in v1),
// named import.
function findExportedJsxRoot(
  resolved: FileRecord,
  match: ImportMatch,
  tagNameInCaller: string,
): CrossFileQueryResult {
  let ast: any;
  try {
    ast = parse(resolved.source, PARSE_OPTS);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, reason: `parse error in "${resolved.path}": ${msg}` };
  }
  const body = ast?.program?.body ?? [];

  if (match.specType === "ImportNamespaceSpecifier") {
    // `import * as Pkg from './lib'` then using `<Pkg.X />` — the call-
    // site tag would be `Pkg.X` (a JSXMemberExpression), not a single
    // Identifier. We don't currently support that path.
    return {
      ok: false,
      reason: `namespace imports (import * as) are not supported for cross-file propagation in v1`,
    };
  }

  if (match.specType === "ImportDefaultSpecifier") {
    return findDefaultExportRoot(resolved, body, tagNameInCaller);
  }

  // ImportSpecifier — named import. Caller asked for `match.importedName`
  // (or, fallback, `tagNameInCaller` for non-renamed shape). Walk the
  // resolved file's exports for the matching name.
  const wantName = match.importedName ?? tagNameInCaller;
  return findNamedExportRoot(resolved, body, wantName);
}

function findDefaultExportRoot(
  resolved: FileRecord,
  body: any[],
  fallbackName: string,
): CrossFileQueryResult {
  for (const stmt of body) {
    if (stmt?.type !== "ExportDefaultDeclaration") continue;
    const decl = stmt.declaration;
    if (!decl) continue;

    // `export default function Foo() {}` — name = Foo, recurse via the
    // existing in-file resolver against the resolved source.
    if (decl.type === "FunctionDeclaration" && decl.id?.type === "Identifier") {
      const oid = findInlineComponentDefRootOid(resolved.source, decl.id.name);
      if (oid) return { ok: true, def: { fileId: resolved.id, rootOid: oid } };
    }

    // `export default function() {}` — anonymous FunctionDeclaration in
    // default-export position (Babel parses this as FunctionDeclaration
    // with `id: null`, NOT as FunctionExpression). Walk the body for
    // a JSX root.
    if (decl.type === "FunctionDeclaration" && !decl.id) {
      return findJsxRootInFunctionBody(resolved.id, decl.body);
    }

    // `export default class Foo {}` — class components are not the v1
    // path; bail with reason. (Class components would need a different
    // walk because their render method's JSX is the root.)
    if (decl.type === "ClassDeclaration") {
      return {
        ok: false,
        reason: `class component default export is not supported for cross-file propagation in v1`,
      };
    }

    // `export default function() {}` (anonymous) — no in-file lookup
    // works because there's no name. Walk decl.body directly to find
    // the JSX root. Same shape as `findInlineComponentDefRootOid`'s
    // helper; we'd need to expose it. For v1, bail with reason — the
    // user can name their function as a workaround.
    if (
      decl.type === "FunctionExpression" ||
      decl.type === "ArrowFunctionExpression"
    ) {
      return findJsxRootInFunctionBody(resolved.id, decl.body);
    }

    // `export default <expr>` where <expr> is an Identifier referring to
    // a const/let/function defined elsewhere. e.g.
    //   const Card = () => <div />;
    //   export default Card;
    // Walk back to find the binding by name.
    if (decl.type === "Identifier") {
      const oid = findInlineComponentDefRootOid(resolved.source, decl.name);
      if (oid) return { ok: true, def: { fileId: resolved.id, rootOid: oid } };
      return {
        ok: false,
        reason: `default-exported identifier "${decl.name}" has no inline component definition in "${resolved.path}"`,
      };
    }

    // `export default withAuth(Card)` (CallExpression) — HOC pattern,
    // locked decision Q4 → bail.
    if (decl.type === "CallExpression") {
      return {
        ok: false,
        reason: `HOC-wrapped default export is not supported for cross-file propagation in v1 (Q4 locked decision)`,
      };
    }

    return {
      ok: false,
      reason: `unsupported default-export shape "${decl.type}" in "${resolved.path}"`,
    };
  }

  // No `export default` at all — but the caller did `import Foo from`,
  // which means they expected one. The resolved file is malformed for
  // this import; bail.
  return {
    ok: false,
    reason: `no default export in "${resolved.path}" but caller imports "${fallbackName}" as default`,
  };
}

function findNamedExportRoot(
  resolved: FileRecord,
  body: any[],
  wantName: string,
): CrossFileQueryResult {
  // Two shapes: `export const X = ...` / `export function X() {}` (with
  // declaration), AND `export { X }` / `export { X as Y }` (specifiers).
  // The former is handled by `findInlineComponentDefRootOid`; the latter
  // needs a manual walk through specifiers.
  let directDeclMatch = false;
  for (const stmt of body) {
    if (stmt?.type !== "ExportNamedDeclaration") continue;

    // `export { X } from './bar'` — re-export, locked decision D4 → bail.
    if (stmt.source) {
      return {
        ok: false,
        reason: `re-export not supported: "export { ${wantName} } from ${JSON.stringify(stmt.source.value)}" in "${resolved.path}"`,
      };
    }

    if (stmt.declaration) {
      // `export const X = ...` / `export function X() {}` — same
      // resolver as in-file. Mark for fallback if name matches.
      const decl = stmt.declaration;
      if (decl.type === "FunctionDeclaration" && decl.id?.name === wantName) {
        directDeclMatch = true;
      } else if (decl.type === "VariableDeclaration") {
        for (const d of decl.declarations || []) {
          if (d.id?.type === "Identifier" && d.id.name === wantName) {
            directDeclMatch = true;
            break;
          }
        }
      }
      continue;
    }

    // Specifier-only form: `export { Foo, Bar as Baz }`. Find the
    // specifier whose EXPORTED name matches wantName, then look up the
    // LOCAL name in the file.
    for (const spec of stmt.specifiers || []) {
      if (spec.type !== "ExportSpecifier") continue;
      const exportedName =
        spec.exported.type === "Identifier"
          ? spec.exported.name
          : spec.exported.type === "StringLiteral"
          ? spec.exported.value
          : null;
      if (exportedName !== wantName) continue;
      const localName = spec.local.type === "Identifier" ? spec.local.name : null;
      if (!localName) {
        return {
          ok: false,
          reason: `unsupported export specifier shape in "${resolved.path}"`,
        };
      }
      const oid = findInlineComponentDefRootOid(resolved.source, localName);
      if (oid) return { ok: true, def: { fileId: resolved.id, rootOid: oid } };
      return {
        ok: false,
        reason: `local "${localName}" exported as "${wantName}" has no inline component definition in "${resolved.path}"`,
      };
    }
  }

  if (directDeclMatch) {
    const oid = findInlineComponentDefRootOid(resolved.source, wantName);
    if (oid) return { ok: true, def: { fileId: resolved.id, rootOid: oid } };
    return {
      ok: false,
      reason: `named export "${wantName}" in "${resolved.path}" has no JSX root (HOC, conditional render, or non-component shape)`,
    };
  }

  return {
    ok: false,
    reason: `named export "${wantName}" not found in "${resolved.path}"`,
  };
}

// Walks an anonymous function/arrow body for its first JSXElement and
// reads the OID. Same logic as `findReturnedJsxElement` in component-def.ts
// but inlined here — exposing it from component-def would expand its
// public API surface. Returns the same `{ ok: true; def }` shape for
// consistency.
function findJsxRootInFunctionBody(fileId: FileId, body: any): CrossFileQueryResult {
  if (!body) {
    return { ok: false, reason: "anonymous default export has no body" };
  }
  if (body.type === "JSXElement") {
    const oid = readOpeningOid(body);
    if (oid) return { ok: true, def: { fileId, rootOid: oid } };
    return { ok: false, reason: "JSX root has no OID (file may not have been injected)" };
  }
  if (body.type === "JSXFragment") {
    for (const child of body.children || []) {
      if (child.type === "JSXElement") {
        const oid = readOpeningOid(child);
        if (oid) return { ok: true, def: { fileId, rootOid: oid } };
      }
    }
    return { ok: false, reason: "fragment root has no JSXElement child with an OID" };
  }
  if (body.type === "BlockStatement") {
    for (const stmt of body.body || []) {
      if (stmt.type === "ReturnStatement" && stmt.argument) {
        const arg = stmt.argument;
        if (arg.type === "JSXElement") {
          const oid = readOpeningOid(arg);
          if (oid) return { ok: true, def: { fileId, rootOid: oid } };
        }
        if (arg.type === "JSXFragment") {
          for (const child of arg.children || []) {
            if (child.type === "JSXElement") {
              const oid = readOpeningOid(child);
              if (oid) return { ok: true, def: { fileId, rootOid: oid } };
            }
          }
        }
      }
    }
  }
  return {
    ok: false,
    reason: "anonymous function body has no JSXElement return value",
  };
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
