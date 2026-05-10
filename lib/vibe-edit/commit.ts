// Translate a vibe-edit DOM change back into a source-text patch.
// Re-uses the existing byte patchers — no new parsing logic here.
//
// Inputs: mode (html | jsx), source string, the old VibeElementInfo
// captured at selection time, and a `next` partial of fields to
// overwrite. Output: { unchanged, source } where source is the
// rewritten text and unchanged is true iff no fields actually
// changed OR every patcher reported no diff (e.g. trim-equal text).
//
// HTML mode addresses elements via the path field (parse5 byte-offset
// math in patchHtmlText / patchHtmlAttr).
// JSX mode prefers OID over path because OID survives source edits
// that shift line/column positions; if oid is null we bail with
// unchanged=true rather than guessing.

import { patchHtmlText, patchHtmlAttr } from "../source-patch-html";
import {
  patchJsxTextByOid,
  patchJsxAttrByOid,
} from "../ast/patch-class-by-oid";
import type { VibeElementInfo } from "./types";

export interface VibeCommitInput {
  mode: "html" | "jsx";
  source: string;
  old: VibeElementInfo;
  next: Partial<{
    text: string;
    src: string;
    alt: string;
    href: string;
    // Verbatim el.style.cssText. Written as the element's style
    // attribute, replacing any existing inline-style value. The
    // iframe DOM is the source of truth here — caller passes the
    // current cssText whenever any style-affecting field (bg, text
    // colour, radius) drifted from the last-committed snapshot.
    style: string;
  }>;
}

export interface VibeCommitResult {
  unchanged: boolean;
  source: string;
}

interface PatcherOk {
  source: string;
  changed?: boolean;
  unchanged?: boolean;
}

function applyPatch(
  current: string,
  patched: PatcherOk | null,
): { source: string; changed: boolean } {
  if (!patched) return { source: current, changed: false };
  // patchHtml* uses { unchanged, source }; patchJsx*ByOid uses
  // { source, changed }. Normalise both to a single check.
  if (typeof patched.changed === "boolean") {
    return patched.changed
      ? { source: patched.source, changed: true }
      : { source: current, changed: false };
  }
  if (typeof patched.unchanged === "boolean") {
    return patched.unchanged
      ? { source: current, changed: false }
      : { source: patched.source, changed: true };
  }
  return { source: current, changed: false };
}

export function buildVibeCommit(input: VibeCommitInput): VibeCommitResult {
  const { mode, old, next } = input;
  let source = input.source;
  let anyChanged = false;

  const apply = (p: PatcherOk | null) => {
    const result = applyPatch(source, p);
    if (result.changed) {
      source = result.source;
      anyChanged = true;
    }
  };

  if (mode === "html") {
    // HTML patchers want a number[] element-index chain; the iframe
    // runtime fills this alongside the CSS selector path for HTML
    // mode. If absent we bail clean rather than guess from the
    // selector string.
    if (!old.htmlPath) {
      return { unchanged: true, source };
    }
    const hp = old.htmlPath;
    if (next.text !== undefined && next.text !== old.text) {
      apply(patchHtmlText(source, hp, next.text));
    }
    if (next.src !== undefined && next.src !== (old.src ?? "")) {
      apply(patchHtmlAttr(source, hp, "src", next.src));
    }
    if (next.alt !== undefined && next.alt !== (old.alt ?? "")) {
      apply(patchHtmlAttr(source, hp, "alt", next.alt));
    }
    if (next.href !== undefined && next.href !== (old.href ?? "")) {
      apply(patchHtmlAttr(source, hp, "href", next.href));
    }
    if (next.style !== undefined && next.style !== (old.inlineStyle ?? "")) {
      apply(patchHtmlAttr(source, hp, "style", next.style));
    }
  } else {
    // JSX mode requires OID. Path-based JSX patching isn't wired
    // yet — vibecoders editing OID-less JSX elements (pre-injection
    // window) get a clean no-op rather than a guess.
    if (!old.oid) {
      return { unchanged: true, source };
    }
    if (next.text !== undefined && next.text !== old.text) {
      apply(patchJsxTextByOid(source, old.oid, next.text));
    }
    if (next.src !== undefined && next.src !== (old.src ?? "")) {
      apply(patchJsxAttrByOid(source, old.oid, "src", next.src));
    }
    if (next.alt !== undefined && next.alt !== (old.alt ?? "")) {
      apply(patchJsxAttrByOid(source, old.oid, "alt", next.alt));
    }
    if (next.href !== undefined && next.href !== (old.href ?? "")) {
      apply(patchJsxAttrByOid(source, old.oid, "href", next.href));
    }
    // JSX style writeback intentionally skipped in v1. React rejects
    // string-valued style props (warns and ignores), and writing
    // expression-form `style={{...}}` requires a dedicated patcher
    // that round-trips an existing object expression. Iframe DOM
    // changes for radius / bg / text colour are visible during the
    // session but won't survive a reload in JSX mode. Power editor
    // (FocusEditor) keeps its existing class-based persistence path
    // for users who need permanence in JSX mode.
    if (next.style !== undefined && next.style !== (old.inlineStyle ?? "")) {
      // No-op — see comment above.
    }
  }

  return { unchanged: !anyChanged, source };
}
