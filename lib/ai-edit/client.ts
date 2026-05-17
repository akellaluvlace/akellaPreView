// 2026-05-17 — AI Edit host client. Wraps `fetch('/api/ai-edit')` with
// typed request/response and a single AbortController per call so the
// caller can cancel mid-flight (Escape, tool change, unmount).
//
// Plan §6.3 — client-side: 1 in-flight request per session. The caller
// (Workspace) holds an aborter ref and aborts the previous request
// before firing a new one.

import type { ApiEditRequestBody } from "@/lib/ai-edit/payload";

export interface AiEditSuccess {
  ok: true;
  html: string;
  notes?: string;
  model: string;
  usage?: { prompt: number; completion: number; total: number };
}

export interface AiEditFailure {
  ok: false;
  error: string;
  status?: number;
}

export type AiEditResult = AiEditSuccess | AiEditFailure;

export async function callAiEdit(
  body: ApiEditRequestBody,
  signal?: AbortSignal,
): Promise<AiEditResult> {
  let res: Response;
  try {
    res = await fetch("/api/ai-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e) {
    // Aborted requests throw DOMException("AbortError"). Surface a
    // distinct error string so the caller can suppress the toast.
    const msg = String(e);
    if (msg.includes("AbortError") || (signal && signal.aborted)) {
      return { ok: false, error: "aborted" };
    }
    return { ok: false, error: "Network error" };
  }
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: `Server ${res.status}: non-JSON response`, status: res.status };
  }
  if (!json || typeof json !== "object") {
    return { ok: false, error: "Malformed server response", status: res.status };
  }
  const obj = json as Record<string, unknown>;
  if (obj.ok === true && typeof obj.html === "string" && typeof obj.model === "string") {
    return {
      ok: true,
      html: obj.html,
      notes: typeof obj.notes === "string" ? obj.notes : undefined,
      model: obj.model,
      usage:
        obj.usage && typeof obj.usage === "object"
          ? (obj.usage as AiEditSuccess["usage"])
          : undefined,
    };
  }
  if (obj.ok === false && typeof obj.error === "string") {
    return { ok: false, error: obj.error, status: res.status };
  }
  return { ok: false, error: `Server ${res.status}: malformed payload`, status: res.status };
}
