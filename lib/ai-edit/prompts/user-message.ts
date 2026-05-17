// 2026-05-17 — AI Edit user-message builders. Plan §5.3.
//
// Two scopes share the same response envelope ({ html, notes }) but
// differ in framing + supporting context:
//   - element: parent_context + target_html, narrow scope, edit-in-place
//   - section: target_html only (section IS the parent), wider scope,
//     allow structural reshape
//
// The builders are deliberately string-concat (not template literals)
// so the cache-stable prefix is the system prompt + this builder's
// first few sentences; only the user's prompt text + the HTML
// fragment varies. Tensorix's cache-billing semantics charge less for
// hits on a stable prefix.

import type { AiEditRequest } from "@/lib/ai-edit/parse-request";

export function buildElementUserMessage(req: AiEditRequest): string {
  const parts: string[] = [];
  parts.push(
    "Edit the following HTML element based on the user's request.",
  );
  parts.push("");
  if (req.parentContext) {
    parts.push("Parent context (for styling reference, do not modify):");
    parts.push(req.parentContext);
    parts.push("");
  }
  parts.push("Target element:");
  parts.push(req.targetHtml);
  parts.push("");
  parts.push(`User request: ${req.userPrompt.trim()}`);
  return parts.join("\n");
}

export function buildSectionUserMessage(req: AiEditRequest): string {
  const parts: string[] = [];
  parts.push(
    "Redesign or modify the following HTML section based on the user's request.",
  );
  parts.push(
    "Keep the section's role and overall purpose intact unless explicitly told otherwise.",
  );
  parts.push("");
  parts.push("Section HTML:");
  parts.push(req.targetHtml);
  parts.push("");
  parts.push(`User request: ${req.userPrompt.trim()}`);
  return parts.join("\n");
}

export function buildUserMessage(req: AiEditRequest): string {
  return req.scope === "section"
    ? buildSectionUserMessage(req)
    : buildElementUserMessage(req);
}
