// Public surface of the new manipulation system's AST layer.
//
// Phase 1 ships:
//   - OID injection / strip (lib/ast/oids.ts)
//   - Structural query API (lib/ast/query.ts)
//
// Phase 1 NOT yet shipped (next session):
//   - Wiring into the source-state owner (Workspace.tsx) so OIDs flow into
//     Monaco and downstream into the iframe DOM.
//   - Layout Inspector (Layer 2): ResizeObserver/MutationObserver hooks,
//     layoutRole + parent context + computed CSS exposure per element.
//   - Selection model: a single OID marked "selected", host overlay.
//   - Undo stack with structured AstDiff.
//
// Reference: `maniuplation.md` Layer 1 + the "Phase 1" bullet list. See also
// the `project_manipulation_phase1_progress.md` memory entry for what's done
// vs deferred at session granularity.

export {
  OID_ATTR,
  makeOid,
  isValidOid,
  injectOids,
  stripOids,
  walkJsxOpenings,
  type InjectResult,
  type StripResult,
} from "./oids";

export {
  buildIndex,
  type AstIndex,
  type QueryNode,
} from "./query";
