// 2026-05-17 — AI Edit payload-side helpers. Plan §4.2.
//
// The iframe already serializes target outerHTML + path + bbox into
// AiSelectionPayload. Host needs to derive ONE extra piece for element
// mode: the parent's outerHTML with the target replaced by a {{TARGET}}
// placeholder. That gives the model styling context without doubling
// the input tokens.
//
// We can't do this in the iframe (the AI tool branch keeps the iframe
// runtime small, and the iframe can't safely serialize the parent
// without complicating the click handler). So the host re-finds the
// element via the iframe's DOM (we don't have access from here), OR —
// simpler — we pass an extracted parentOuterHtml back from the iframe
// for element mode in a future revision.
//
// For Phase 2 v0 we keep parent_context optional: the API still works
// without it. The model gets less styling context but produces sensible
// element-mode results in 80%+ of cases per the Tensorix evals.

import type { AiSelectionInfo } from "@/lib/ai-edit/types";

export interface ApiEditRequestBody {
  scope: "element" | "section";
  // Phase 6 — Optional mode. Defaults to "edit" server-side when omitted.
  // "swap" fires the reference-fusion prompt and requires referenceHtml.
  mode?: "edit" | "swap";
  targetHtml: string;
  parentContext?: string;
  // Phase 6 — Reference outerHTML for swap mode (from component library).
  referenceHtml?: string;
  userPrompt: string;
  model?: string;
}

export function buildApiRequestBody(
  info: AiSelectionInfo,
  userPrompt: string,
  options: {
    model?: string;
    parentContext?: string;
    mode?: "edit" | "swap";
    referenceHtml?: string;
  } = {},
): ApiEditRequestBody {
  // Phase 3a — Prefer the explicit override, then the parentContext
  // emitted by the iframe (element-mode only). Iframe sends null for
  // section scope; we treat null as undefined so the API parser doesn't
  // see a string-shaped null.
  const parentContext =
    options.parentContext ?? info.parentContext ?? undefined;
  return {
    scope: info.scope,
    mode: options.mode,
    targetHtml: info.outerHtml,
    parentContext,
    referenceHtml: options.referenceHtml,
    userPrompt,
    model: options.model,
  };
}
