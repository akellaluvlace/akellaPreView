// Translate a vibe-edit DOM change back into a source-text patch.
// Re-uses the existing byte patchers — no new parsing logic here.
//
// Inputs: mode (html | jsx), source string, the old VibeElementInfo
// captured at selection time, and a `next` partial of fields to
// overwrite. Output: a discriminated union distinguishing:
//   - "ok"   — patchers landed bytes; consumer should setCode(source)
//   - "no-op" — legit no-op (no fields drifted OR patchers all clean)
//   - "bail" — silently couldn't reach source (missing-oid / missing-
//              html-path); consumer SHOULD surface a toast so the
//              vibecoder doesn't see "I clicked and the swap appeared
//              in preview" → reload-reverts (the SF-M6 trust killer)
//
// HTML mode addresses elements via the path field (parse5 byte-offset
// math in patchHtmlText / patchHtmlAttr). Bails with reason
// "missing-html-path" when old.htmlPath is null.
// JSX mode prefers OID over path because OID survives source edits
// that shift line/column positions; bails with reason "missing-oid"
// when old.oid is null.

import {
  patchHtmlText,
  patchHtmlAttr,
  patchHtmlOuter,
  patchHtmlClass,
} from "../source-patch-html";
import {
  patchJsxTextByOid,
  patchJsxAttrByOid,
  patchJsxOuterByOid,
  patchJsxClassByOid,
} from "../ast/patch-class-by-oid";
import { readJsxClassByOid } from "../ast/read-class-by-oid";
import {
  mergeStyleDeltaIntoClasses,
  type StyleDelta,
} from "./style-to-class";
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
    // Outer-replacement payload used by the icon-swap flow. The
    // patcher replaces the element's full byte range with this string;
    // JSX mode re-injects the existing OID into the new opening tag so
    // post-swap addressing keeps working. Empty string is treated as
    // "no swap intent" and produces no patch.
    outer: string;
    // Full className-attribute overwrite. Drives the typography
    // sliders. Routed through the existing class-only patchers
    // (patchJsxClassByOid / patchHtmlClass) so the byte-level edit
    // stays minimal — only the className value changes, surrounding
    // attributes / formatting / OID untouched.
    classes: string;
    // Per-property style delta used by JSX mode to persist colour /
    // background / radius edits as Tailwind arbitrary-value classes
    // (text-[#hex] / bg-[#hex] / rounded-[Npx]). React rejects
    // string-valued style props, so we can't write `style="..."` as a
    // JSX attribute — translating to className is the v1 workaround.
    // HTML mode ignores this field; its `next.style` cssText path
    // writes the inline-style attribute directly (survives reload
    // natively in HTML).
    styleDelta: StyleDelta;
  }>;
}

export type VibeCommitBailReason = "missing-oid" | "missing-html-path";

export type VibeCommitResult =
  | { kind: "ok"; source: string }
  | { kind: "no-op" }
  | { kind: "bail"; reason: VibeCommitBailReason };

// Convenience for callers that just want the patched source (or a
// fallback when the result isn't "ok"). Mirrors the pattern used in
// other discriminated-union flows (parseServerStreamPayload, etc.).
export function commitSourceOr(
  result: VibeCommitResult,
  fallback: string,
): string {
  return result.kind === "ok" ? result.source : fallback;
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
      return { kind: "bail", reason: "missing-html-path" };
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
    if (next.outer !== undefined && next.outer.length > 0) {
      apply(patchHtmlOuter(source, hp, next.outer));
    }
    if (next.classes !== undefined && next.classes !== (old.classes ?? "")) {
      apply(patchHtmlClass(source, hp, next.classes));
    }
  } else {
    // JSX mode requires OID. Path-based JSX patching isn't wired
    // yet — vibecoders editing OID-less JSX elements (pre-injection
    // window) get a clean no-op rather than a guess.
    if (!old.oid) {
      return { kind: "bail", reason: "missing-oid" };
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
    if (next.outer !== undefined && next.outer.length > 0) {
      apply(patchJsxOuterByOid(source, old.oid, next.outer));
    }
    if (next.classes !== undefined && next.classes !== (old.classes ?? "")) {
      apply(patchJsxClassByOid(source, old.oid, next.classes));
    }
    if (next.styleDelta) {
      // Translate the style delta into a className mutation. Read the
      // CURRENT class value from `source` (post next.classes patch
      // above, if any) so a future caller passing BOTH next.classes
      // AND next.styleDelta in the same commit doesn't compute the
      // strip+add against stale bytes and clobber the next.classes
      // write. Falls back to old.classes when the source read can't
      // resolve (parse fail / no className / expression-form className
      // — same conditions under which patchJsxClassByOid would also
      // bail, so the strip math stays internally consistent).
      const currentClasses = readJsxClassByOid(source, old.oid) ?? old.classes ?? "";
      const merged = mergeStyleDeltaIntoClasses(
        next.styleDelta,
        currentClasses,
      );
      if (merged.changed) {
        apply(patchJsxClassByOid(source, old.oid, merged.classes));
      }
    }
  }

  return anyChanged ? { kind: "ok", source } : { kind: "no-op" };
}
