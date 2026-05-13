// Phase D-proper — scenario test for cross-file className propagation.
//
// Exercises the chain that Workspace.tsx's `handleClassChange` runs in
// "everywhere" mode for a multi-file project:
//
//   1. patchJsxClassByOid on the call-site (active file).
//   2. findCrossFileDefinition resolves the imported component to its def file.
//   3. patchJsxClassByOid on the def file at the resolved root OID.
//   4. createEdit packages both diffs into one Edit.
//   5. applyEdit threads atomically through to the project (no React; we
//      use the pure operation directly to avoid mounting jsdom for what's
//      effectively a workflow test).
//   6. revertEdit rolls both files back atomically (undo simulation).
//
// Pure-logic only — runs in vitest's `node` environment.

import { describe, it, expect } from "vitest";
import { patchJsxClassByOid } from "../lib/ast/patch-class-by-oid";
import { findCrossFileDefinition } from "../lib/ast/cross-file-query";
import { findInlineComponentDefRootOid } from "../lib/ast/component-def";
import { injectOids } from "../lib/ast/oids";
import { addFile, createProject, getFile } from "../lib/files/operations";
import {
  applyEdit,
  createEdit,
  revertEdit,
} from "../lib/edits/operations";
import type { FileId, Project } from "../lib/files/types";

function injectAll(source: string): string {
  return injectOids(source).source;
}

function makeTwoFileProject(): { project: Project; cardFileId: FileId } {
  const r = createProject({
    name: "scenario",
    entryPath: "App.jsx",
    entrySource: injectAll(
      "import Card from './Card';\nexport default function App() { return <Card />; }\n",
    ),
  });
  if (!r.ok) throw new Error(r.error);
  const ar = addFile(r.project, {
    path: "Card.jsx",
    source: injectAll(
      "export default function Card() { return <div className='p-4 bg-paper'>card body</div>; }\n",
    ),
  });
  if (!ar.ok) throw new Error(ar.error);
  const cardFile = Array.from(ar.project.files.values()).find(
    (f) => f.path === "Card.jsx",
  );
  if (!cardFile) throw new Error("Card.jsx missing post-add");
  return { project: ar.project, cardFileId: cardFile.id };
}

// Returns the OID for the JSX element with the given tag in the source.
// Used to find the call-site OID so we can run patchJsxClassByOid against
// it. Real Workspace flow uses patchJsxClass (with a loc from the iframe's
// click handler) instead, but for a scenario test the OID-based variant
// produces the same byte-equivalent diff without the loc-finding fragility.
function findOidForTag(source: string, tagName: string): string {
  // Anchor: opening `<TagName` followed somewhere before `>` by the OID.
  const re = new RegExp(
    `<${tagName}[^>]*data-dropin-id="([A-Za-z0-9]{8})"`,
  );
  const m = source.match(re);
  if (!m) throw new Error(`no OID on <${tagName}>`);
  return m[1];
}

describe("Phase D-proper — cross-file className propagation scenario", () => {
  it("end-to-end: edit <Card /> in App.jsx, both App.jsx and Card.jsx update atomically", () => {
    const { project, cardFileId } = makeTwoFileProject();
    const entryFile = getFile(project, project.entryFileId)!;
    const cardFile = getFile(project, cardFileId)!;

    // Step 1: simulate click → selection on the <Card /> element.
    const targetOid = findOidForTag(entryFile.source, "Card");
    const newClass = "bg-mint-100 p-6";

    // Step 2: patch className on the call-site.
    const callSitePatch = patchJsxClassByOid(
      entryFile.source,
      targetOid,
      newClass,
    );
    expect(callSitePatch.changed).toBe(true);
    const nextEntrySource = callSitePatch.source;

    // Step 3: in-file def lookup misses (Card is imported, not inline).
    const inlineDef = findInlineComponentDefRootOid(nextEntrySource, "Card");
    expect(inlineDef).toBeNull();

    // Step 4: cross-file resolver finds Card.jsx + the JSX root OID.
    const crossDef = findCrossFileDefinition(
      project,
      project.entryFileId,
      "Card",
    );
    expect(crossDef.ok).toBe(true);
    if (!crossDef.ok) return;
    expect(crossDef.def.fileId).toBe(cardFileId);

    // Step 5: patch className on Card.jsx at the resolved root OID.
    const defPatch = patchJsxClassByOid(
      cardFile.source,
      crossDef.def.rootOid,
      newClass,
    );
    expect(defPatch.changed).toBe(true);

    // Step 6: package as multi-file Edit and apply.
    const editResult = createEdit({
      diffs: [
        {
          fileId: project.entryFileId,
          before: entryFile.source,
          after: nextEntrySource,
        },
        {
          fileId: cardFileId,
          before: cardFile.source,
          after: defPatch.source,
        },
      ],
      reason: "everywhere-cross-file:<Card>",
    });
    expect(editResult.ok).toBe(true);
    if (!editResult.ok) return;

    const applied = applyEdit(project, editResult.edit);
    expect(applied.ok).toBe(true);
    if (!applied.ok) return;

    // Both files have the new className.
    const newEntry = getFile(applied.project, project.entryFileId)!;
    const newCard = getFile(applied.project, cardFileId)!;
    expect(newEntry.source).toContain('className="bg-mint-100 p-6"');
    expect(newCard.source).toContain('className="bg-mint-100 p-6"');
    // The OIDs survived the round-trip.
    expect(newEntry.source).toMatch(/data-dropin-id="[A-Za-z0-9]{8}"/);
    expect(newCard.source).toMatch(/data-dropin-id="[A-Za-z0-9]{8}"/);

    // Step 7: simulate undo via revertEdit.
    const reverted = revertEdit(applied.project, editResult.edit);
    expect(reverted.ok).toBe(true);
    if (!reverted.ok) return;

    // Both files back to original.
    const restoredEntry = getFile(reverted.project, project.entryFileId)!;
    const restoredCard = getFile(reverted.project, cardFileId)!;
    expect(restoredEntry.source).toBe(entryFile.source);
    expect(restoredCard.source).toBe(cardFile.source);
  });

  it("does NOT use cross-file path when inline def exists in same file", () => {
    // App.jsx defines Card INLINE, then uses <Card />. Even though
    // findCrossFileDefinition would also bail (no import), the inline
    // def takes precedence and the propagation is single-file.
    const r = createProject({
      name: "inline",
      entryPath: "App.jsx",
      entrySource: injectAll(
        "function Card() { return <div className='p-4 bg-paper'>x</div>; }\nexport default function App() { return <Card />; }\n",
      ),
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const project = r.project;
    const entryFile = getFile(project, project.entryFileId)!;

    const inlineDef = findInlineComponentDefRootOid(entryFile.source, "Card");
    expect(inlineDef).not.toBeNull();

    // The cross-file resolver should ALSO succeed (it tries in-file first
    // per resolution-order step 1 in the docblock).
    const crossDef = findCrossFileDefinition(project, project.entryFileId, "Card");
    expect(crossDef.ok).toBe(true);
    if (!crossDef.ok) return;
    // Resolved to the same file as the call site.
    expect(crossDef.def.fileId).toBe(project.entryFileId);
  });

  it("HOC-wrapped default export bails with reason for toast", () => {
    const r = createProject({
      name: "hoc",
      entryPath: "App.jsx",
      entrySource: injectAll(
        "import Card from './Card';\nexport default function App() { return <Card />; }\n",
      ),
    });
    if (!r.ok) throw new Error(r.error);
    const ar = addFile(r.project, {
      path: "Card.jsx",
      source: injectAll(
        "function Card() { return <div className='c' />; }\nfunction withAuth(C) { return C; }\nexport default withAuth(Card);\n",
      ),
    });
    if (!ar.ok) throw new Error(ar.error);
    const crossDef = findCrossFileDefinition(ar.project, ar.project.entryFileId, "Card");
    expect(crossDef.ok).toBe(false);
    if (crossDef.ok) return;
    expect(crossDef.reason).toMatch(/HOC/i);
  });

  it("re-export bails with reason for toast", () => {
    const r = createProject({
      name: "reexport",
      entryPath: "App.jsx",
      entrySource: injectAll(
        "import { Card } from './lib';\nexport default function App() { return <Card />; }\n",
      ),
    });
    if (!r.ok) throw new Error(r.error);
    let p = r.project;
    const ar1 = addFile(p, {
      path: "lib.jsx",
      source: injectAll("export { Card } from './card-impl';\n"),
    });
    if (!ar1.ok) throw new Error(ar1.error);
    p = ar1.project;
    const ar2 = addFile(p, {
      path: "card-impl.jsx",
      source: injectAll(
        "export const Card = () => <div className='c' />;\n",
      ),
    });
    if (!ar2.ok) throw new Error(ar2.error);
    p = ar2.project;
    const crossDef = findCrossFileDefinition(p, p.entryFileId, "Card");
    expect(crossDef.ok).toBe(false);
    if (crossDef.ok) return;
    expect(crossDef.reason).toMatch(/re-export/i);
  });

  it("multi-file Edit's atomicity: pre-validation rejects edit if either file's `before` mismatches project state", () => {
    // Simulates a stale Edit landing after a fresh edit. applyEdit's two-
    // phase atomicity should reject the WHOLE edit if either diff's before
    // doesn't match the project.
    const { project, cardFileId } = makeTwoFileProject();
    const entryFile = getFile(project, project.entryFileId)!;
    const cardFile = getFile(project, cardFileId)!;

    const stale = createEdit({
      diffs: [
        {
          fileId: project.entryFileId,
          before: entryFile.source,
          after: entryFile.source.replace("Card", "Card2"),
        },
        {
          fileId: cardFileId,
          // STALE — pretend the card file had a different prior state.
          before: "wrong prior content",
          after: "doesn't matter",
        },
      ],
    });
    expect(stale.ok).toBe(true);
    if (!stale.ok) return;

    const r = applyEdit(project, stale.edit);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toMatch(/before|state/i);

    // Critical: project unchanged after rejected apply (no partial mutation).
    expect(getFile(project, project.entryFileId)!.source).toBe(entryFile.source);
    expect(getFile(project, cardFileId)!.source).toBe(cardFile.source);
  });

  it("named-import (`import { Card } from './lib'`) cross-file propagation works end-to-end", () => {
    const r = createProject({
      name: "named",
      entryPath: "App.jsx",
      entrySource: injectAll(
        "import { Card } from './lib';\nexport default function App() { return <Card />; }\n",
      ),
    });
    if (!r.ok) throw new Error(r.error);
    const ar = addFile(r.project, {
      path: "lib.jsx",
      source: injectAll(
        "export const Card = () => <div className='p-2'>x</div>;\n",
      ),
    });
    if (!ar.ok) throw new Error(ar.error);
    const project = ar.project;
    const libFile = Array.from(project.files.values()).find(
      (f) => f.path === "lib.jsx",
    )!;

    const crossDef = findCrossFileDefinition(project, project.entryFileId, "Card");
    expect(crossDef.ok).toBe(true);
    if (!crossDef.ok) return;
    expect(crossDef.def.fileId).toBe(libFile.id);

    const defPatch = patchJsxClassByOid(
      libFile.source,
      crossDef.def.rootOid,
      "p-6",
    );
    expect(defPatch.changed).toBe(true);
    expect(defPatch.source).toContain('className="p-6"');
  });
});
