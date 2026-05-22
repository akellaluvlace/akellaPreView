"use client";

// 2026-05-21 — BYO-AI swap modal. Replaces the failed Tensorix Phase 6
// AI swap. User picks a reference design from the component library,
// clicks an AI provider button (clipboard copy + new tab to their AI),
// pastes the AI's reply, hits Apply. Zero AI cost to Dropin; frontier-
// model quality.
//
// Architecture:
//   - 3 stacked sections, all always visible (no stepper, no
//     progressive disclosure — trust the vibecoder to do them top-down)
//   - Reference picker reuses InlineComponentBrowser in onPickReference
//     mode (same component the failed Phase 6 modal used)
//   - Provider buttons clipboard-copy + open new tab (or just copy for
//     "Just copy"). Last-clicked provider is remembered via
//     localStorage and floated to the leftmost position next open.
//   - Paste textarea contents persist via sessionStorage so an
//     accidental modal close doesn't lose the AI reply.
//   - Paste-anywhere routing: a paste event on the modal backdrop or
//     non-textarea region forwards the clipboard text into the
//     textarea (frontier models reply with large bodies that users
//     sometimes paste in the wrong spot).
//   - On Apply: extract first code fence (fall back to raw input) →
//     validate (length sanity, no event handlers, no-op detection)
//     → onApply(code) callback. Host owns the actual setCode call so
//     the modal is unaware of source-mode plumbing.
//   - Validation failure: keep response in textarea, surface specific
//     reason next to it. User can edit + retry without losing work.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentMeta } from "@/lib/component-library/types";
import type { PreviewKind } from "@/lib/preview";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import InlineComponentBrowser from "./VibePropertiesPanel/InlineComponentBrowser";
import { composeSwapPrompt } from "@/lib/byo-ai/compose-prompt";
import { extractCodeFence } from "@/lib/byo-ai/extract-code";
import { validateResponse } from "@/lib/byo-ai/validate-response";
import {
  BYO_AI_PROVIDERS,
  BYO_AI_PROVIDER_STORAGE_KEY,
  orderProvidersByPreference,
  getProviderById,
  type ByoAiProvider,
} from "@/lib/byo-ai/providers";

interface Props {
  // Closed = unmounted; open = mounted. Host owns the boolean.
  open: boolean;
  onClose: () => void;
  // Selected element from vibe-edit. Carries outerHtml + tag + classes
  // + kind for category inference. Always non-null when open=true.
  vibeInfo: VibeElementInfo | null;
  // Full source code of the current file. Composed into the prompt.
  fullSource: string;
  kind: PreviewKind;
  // Fires when user clicks Apply with a validated response. Host
  // routes the validated code through setCode. Returns true on
  // success; false → host signals a failure (e.g. parse error in
  // setCode pipeline) and the modal keeps the response visible.
  onApply: (code: string) => boolean;
  onWarn: (msg: string) => void;
  onInfo: (msg: string) => void;
}

// Persisted state — survives modal close + page reload within a tab.
// Keyed by the target element's outerHtml signature so resuming on a
// different element starts fresh.
const SESSION_STORAGE_KEY = "dropin:byo-ai:textarea";
const SESSION_STORAGE_TARGET_KEY = "dropin:byo-ai:textarea-target";

function inferCategoryFromKind(info: VibeElementInfo): string | null {
  // Reuse the same fall-through logic the failed Phase 6 modal used
  // — InlineComponentBrowser accepts a category hint and filters the
  // library grid by it. null = show everything.
  switch (info.kind) {
    case "button":
      return "buttons";
    case "text":
      return null; // texts can be swapped with anything; show all
    case "heading":
      return null;
    case "link":
      return "buttons"; // links commonly swap with buttons or cards
    case "container":
      return "cards";
    case "image":
      return null; // images use a different swap flow (Pixabay)
    case "icon":
      return null;
    default:
      return null;
  }
}

export default function ByoAiSwapModal({
  open,
  onClose,
  vibeInfo,
  fullSource,
  kind,
  onApply,
  onWarn,
  onInfo,
}: Props) {
  const [selectedReference, setSelectedReference] =
    useState<{ component: ComponentMeta; rawHtml: string } | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [preferredProvider, setPreferredProvider] = useState<string | null>(
    null,
  );
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  // B (2026-05-22) — clipboard fallback. When navigator.clipboard
  // .writeText fails (insecure context, permission denied, older
  // browser), we drop the prompt into a readonly textarea so the user
  // can select-all + copy manually instead of dead-ending.
  const [manualCopyPrompt, setManualCopyPrompt] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const manualCopyRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  // B (2026-05-22) — snapshot of the source at the moment the prompt
  // was last built (provider-click time). If the user edits the
  // template afterward, applying the AI's reply (based on the older
  // snapshot) would silently discard those edits — we surface a
  // non-blocking notice instead.
  const promptSourceRef = useRef<string | null>(null);
  const [sourceChanged, setSourceChanged] = useState(false);
  // C (2026-05-22) — track the target signature so we can reset the
  // picker + paste state when the modal opens on a DIFFERENT element.
  const lastTargetRef = useRef<string | null>(null);

  // TEMP DIAG (2026-05-22) — trace whether the modal receives open=true.
  // If we see "open=true" the state propagated; if not, something is
  // resetting byoAiSwapOpen before render (e.g. a Fast Refresh remount).
  useEffect(() => {
    console.log("[dropin:byo-ai] MODAL open-prop changed", {
      open,
      hasVibeInfo: !!vibeInfo,
      willRender: open && !!vibeInfo,
    });
  }, [open, vibeInfo]);

  // Restore the paste textarea contents from sessionStorage on mount
  // ONLY if the stored target matches the current vibeInfo's
  // outerHtml signature. Otherwise we'd cross-pollinate across
  // different elements + confuse the user.
  useEffect(() => {
    if (!open || !vibeInfo) return;
    try {
      const storedTarget = sessionStorage.getItem(SESSION_STORAGE_TARGET_KEY);
      const storedText = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedText && storedTarget === (vibeInfo.outerHtml ?? "")) {
        setPasteText(storedText);
      }
    } catch {
      // sessionStorage can throw in restricted iframes; not worth a
      // toast — silently degrade to no persistence.
    }
    // Also load the preferred provider from localStorage so the button
    // order can rotate the user's last choice to the left.
    try {
      const pref = localStorage.getItem(BYO_AI_PROVIDER_STORAGE_KEY);
      if (pref) setPreferredProvider(pref);
    } catch {
      // Same defensive degradation.
    }
  }, [open, vibeInfo]);

  // C — reset picker + transient state when the modal opens on a NEW
  // target. Without this, a reference picked for element A would still
  // show selected when the user reopens on element B. The paste text
  // restore above is target-keyed, so we don't clobber a legit resume.
  useEffect(() => {
    if (!open || !vibeInfo) return;
    const sig = vibeInfo.outerHtml ?? "";
    if (lastTargetRef.current !== sig) {
      lastTargetRef.current = sig;
      setSelectedReference(null);
      setFailureReason(null);
      setLastClicked(null);
      setSourceChanged(false);
      promptSourceRef.current = null;
    }
  }, [open, vibeInfo]);

  // D — focus management. Move focus into the modal when it opens so
  // keyboard users + screen readers land inside the dialog (Tab then
  // stays within the modal's interactive elements). Focusing the panel
  // container (tabindex -1) is the least-surprising target — it doesn't
  // hijack into a specific control before the user has read the steps.
  useEffect(() => {
    if (!open) return;
    // Defer to the next frame so the element exists + layout settled.
    const id = window.requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  // B — recompute the source-changed flag whenever the current source
  // diverges from the snapshot taken at prompt-build time.
  useEffect(() => {
    if (promptSourceRef.current === null) {
      setSourceChanged(false);
      return;
    }
    setSourceChanged(promptSourceRef.current !== fullSource);
  }, [fullSource]);

  // D — tab-return focus nudge. When the modal is open AND the user
  // has already clicked a provider (so they went to their AI tab) AND
  // the Dropin tab regains visibility, scroll the paste textarea into
  // view + focus it. This is the smooth "you're back — paste here"
  // landing without any clipboard read / permission prompt. Only the
  // visual nudge, per the original UX decision.
  useEffect(() => {
    if (!open) return;
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (!lastClicked) return; // only after they've sent to an AI
      const ta = textareaRef.current;
      if (!ta) return;
      ta.scrollIntoView({ behavior: "smooth", block: "center" });
      // Defer focus slightly so the scroll settles first.
      window.setTimeout(() => ta.focus(), 120);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [open, lastClicked]);

  // Persist textarea contents on every change. Throttled by React's
  // batched state updates (already debounced via the controlled
  // textarea pattern).
  useEffect(() => {
    if (!open || !vibeInfo) return;
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, pasteText);
      sessionStorage.setItem(
        SESSION_STORAGE_TARGET_KEY,
        vibeInfo.outerHtml ?? "",
      );
    } catch {
      // Defensive — same as above.
    }
  }, [open, pasteText, vibeInfo]);

  // Escape closes the modal (standard pattern). Click-outside is
  // wired separately on the backdrop div.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Paste-anywhere routing — if the user pastes outside the textarea
  // (e.g. somewhere in the modal chrome), capture it and route into
  // the textarea. Skip when the actual target IS the textarea (the
  // controlled-input change handler handles it natively).
  useEffect(() => {
    if (!open) return;
    const onPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "TEXTAREA") return; // native flow
      if (target && target.tagName === "INPUT") return; // don't hijack search boxes
      if (target && target.isContentEditable) return; // M2 — leave rich inputs alone
      const text = e.clipboardData?.getData("text") ?? "";
      if (!text || text.length < 20) return; // too short to be a real reply
      e.preventDefault();
      setPasteText(text);
      if (failureReason) setFailureReason(null);
      // Focus the textarea so the user sees the paste landed there.
      textareaRef.current?.focus();
      onInfo("Pasted into the response box.");
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [open, onInfo]);

  const orderedProviders = useMemo(
    () => orderProvidersByPreference(preferredProvider),
    [preferredProvider],
  );

  // Compose the prompt on demand (each button click rebuilds it so
  // we always have the latest full source — Dropin's iframe re-renders
  // between picks and the source may have shifted via other edits).
  const buildPrompt = useCallback((): string | null => {
    if (!vibeInfo || !selectedReference) return null;
    return composeSwapPrompt({
      fullSource,
      kind,
      targetOuterHtml: vibeInfo.outerHtml ?? "",
      referenceHtml: selectedReference.rawHtml,
    });
  }, [fullSource, kind, vibeInfo, selectedReference]);

  // Approximate prompt size, shown once a reference is picked so the
  // user knows whether it'll fit their AI's context limit. ~3.5 chars
  // per token is a rough industry heuristic; we show KB + an estimated
  // token count. Memoized so we don't rebuild the (potentially 60KB)
  // prompt string on every render.
  const promptSize = useMemo(() => {
    if (!selectedReference || !vibeInfo) return null;
    const prompt = composeSwapPrompt({
      fullSource,
      kind,
      targetOuterHtml: vibeInfo.outerHtml ?? "",
      referenceHtml: selectedReference.rawHtml,
    });
    const chars = prompt.length;
    const kb = Math.round(chars / 1024);
    const kTokens = Math.round(chars / 3.5 / 1000);
    return { kb, kTokens };
  }, [fullSource, kind, vibeInfo, selectedReference]);

  const handleProviderClick = useCallback(
    async (provider: ByoAiProvider) => {
      if (!selectedReference) {
        onWarn("Pick a reference design first (Step 1).");
        return;
      }
      const prompt = buildPrompt();
      if (!prompt) {
        onWarn("Couldn't build the prompt — missing source or selection.");
        return;
      }
      // Open the new tab SYNCHRONOUSLY before any async work so popup
      // blockers honor the user gesture. Skip for "copy" provider.
      let opened: Window | null = null;
      let popupBlocked = false;
      if (provider.openUrl) {
        opened = window.open(provider.openUrl, "_blank", "noopener");
        // H6 fix (2026-05-21): when the popup is blocked, window.open
        // returns null (or a Window object that's immediately .closed).
        // We surface a clear toast so the user knows the prompt is
        // still copied to their clipboard and they can paste it
        // wherever themselves, instead of staring at a missing tab.
        if (!opened || opened.closed) {
          popupBlocked = true;
        }
      }
      console.log("[dropin:byo-ai] provider-click", {
        provider: provider.id,
        promptLen: prompt.length,
        popupBlocked,
      });
      try {
        await navigator.clipboard.writeText(prompt);
        // Clear any prior manual-copy fallback now that the modern API
        // worked.
        setManualCopyPrompt(null);
      } catch (e) {
        // B — fallback: surface the prompt in a readonly textarea for
        // manual copy instead of dead-ending. Keep the opened tab (the
        // user can still paste manually once they copy from the
        // fallback box).
        console.warn("[dropin:byo-ai] clipboard write failed; manual fallback", e);
        setManualCopyPrompt(prompt);
        onWarn(
          "Couldn't auto-copy (your browser blocked clipboard access). The prompt is shown below — select all + copy it manually.",
        );
        // Still record the choice + snapshot so the rest of the flow
        // works after a manual copy.
        promptSourceRef.current = fullSource;
        setSourceChanged(false);
        setLastClicked(provider.id);
        return;
      }
      // Remember the user's choice for next time.
      try {
        localStorage.setItem(BYO_AI_PROVIDER_STORAGE_KEY, provider.id);
        setPreferredProvider(provider.id);
      } catch {
        // localStorage can be disabled in private browsing — degrade.
      }
      setLastClicked(provider.id);
      // B — snapshot the source the AI is about to see. If the user
      // edits the template afterward, handleApply's source-changed
      // notice fires (the AI's reply is based on this snapshot).
      promptSourceRef.current = fullSource;
      setSourceChanged(false);
      if (popupBlocked) {
        const providerName = provider.label.replace("Open ", "");
        onWarn(
          `Popup blocked — couldn't open ${providerName}. Your prompt is copied; paste it in ${providerName} manually, then come back here.`,
        );
      } else if (provider.openUrl) {
        onInfo(
          `Prompt copied + ${provider.label.replace("Open ", "")} opened. Paste it there → copy the reply → come back here to paste below.`,
        );
      } else {
        onInfo("Prompt copied. Paste it in your AI, then come back here.");
      }
    },
    [selectedReference, buildPrompt, onInfo, onWarn, fullSource],
  );

  const handleApply = useCallback(() => {
    if (!vibeInfo) return;
    setFailureReason(null);
    const { code: extractedCode, hadFence } = extractCodeFence(pasteText);
    console.log("[dropin:byo-ai] apply-attempt", {
      pasteLen: pasteText.length,
      extractedLen: extractedCode.length,
      hadFence,
      kind,
    });
    if (!extractedCode) {
      setFailureReason("Paste the AI's reply first.");
      return;
    }
    const validation = validateResponse({
      inputSource: fullSource,
      outputSource: extractedCode,
      targetOuterHtml: vibeInfo.outerHtml ?? "",
      kind,
    });
    console.log("[dropin:byo-ai] validation", {
      ok: validation.ok,
      reason: validation.reason,
    });
    if (!validation.ok) {
      setFailureReason(validation.reason ?? "Response failed validation.");
      return;
    }
    const applied = onApply(extractedCode);
    console.log("[dropin:byo-ai] apply-result", { applied });
    if (!applied) {
      setFailureReason(
        "Applying the response failed at the source patch step. The code may have a syntax error.",
      );
      return;
    }
    // H5 fix (2026-05-21): do NOT clear sessionStorage on success.
    // The iframe rebuild runs ASYNC after setCode — if the AI's code
    // had a subtle Babel parse error, the iframe error fires AFTER
    // this modal has closed. Keeping the textarea in sessionStorage
    // means the user can reopen on the same target + see their AI
    // reply still there + edit it. The target-signature key already
    // protects against cross-pollination (different elements get
    // different stored payloads).
    //
    // The textarea state is also retained on the modal instance so a
    // subsequent re-open within the same React session works without
    // a sessionStorage hop.
    setSelectedReference(null);
    setFailureReason(null);
    onClose();
  }, [vibeInfo, pasteText, fullSource, kind, onApply, onClose]);

  if (!open || !vibeInfo) return null;

  const targetKind = inferCategoryFromKind(vibeInfo);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Swap with AI"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex h-[88vh] w-[min(1000px,calc(100vw-32px))] flex-col border-2 border-ink bg-paper shadow-[8px_8px_0_0_#FF4D2E] focus:outline-none"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b-2 border-ink bg-soft px-4 py-2">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral">
              ✨ Swap with AI
            </span>
            <p className="mt-0.5 font-mono text-[10px] text-muted">
              Pick a design → send to your AI → paste the reply.
              Restyles your <span className="font-bold">{vibeInfo.tag}</span>{" "}
              while keeping its content.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close swap dialog"
            className="border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Close (Esc)
          </button>
        </div>

        {/* Body — scrolls if needed; reference picker takes most space */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* STEP 1 — reference picker */}
          <section className="border-b-2 border-ink/15">
            <div className="border-b-2 border-ink/10 bg-paper px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                1. Pick a design
              </span>
              {selectedReference && (
                <span className="ml-2 font-mono text-[10px] text-coral">
                  ✓ {selectedReference.component.title}
                </span>
              )}
            </div>
            <div className="h-[40vh] min-h-[300px]">
              <InlineComponentBrowser
                mode={kind}
                category={targetKind}
                onPickReference={(component, rawHtml) =>
                  setSelectedReference({ component, rawHtml })
                }
                onWarn={onWarn}
              />
            </div>
          </section>

          {/* STEP 2 — provider buttons */}
          <section className="border-b-2 border-ink/15 bg-paper px-4 py-3">
            <div className="mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                2. Send to your AI
              </span>
              {lastClicked && (
                <span className="ml-2 font-mono text-[10px] text-coral">
                  Sent to{" "}
                  {getProviderById(lastClicked)?.label.replace("Open ", "") ??
                    lastClicked}
                  . Switch AI? Click another button.
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {orderedProviders.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProviderClick(p)}
                  disabled={!selectedReference}
                  title={p.title}
                  className={
                    "border-2 border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors " +
                    (selectedReference
                      ? i === 0
                        ? "bg-coral text-paper hover:bg-ink"
                        : "bg-paper text-ink hover:bg-ink hover:text-paper"
                      : "cursor-not-allowed bg-paper text-muted opacity-40")
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted">
              {selectedReference ? (
                <>
                  Paste in your AI → copy its reply → come back here &
                  paste below.
                  {promptSize && (
                    <span className="ml-1 text-ink/60">
                      (prompt ~{promptSize.kb} KB · ~{promptSize.kTokens}k
                      tokens)
                    </span>
                  )}
                </>
              ) : (
                "Pick a reference design first."
              )}
            </p>
            {/* B — manual-copy fallback. Shown only when the clipboard
                API was unavailable. The textarea auto-selects on focus
                so the user can Ctrl+C / Cmd+C the prompt. */}
            {manualCopyPrompt && (
              <div className="mt-2 border-2 border-ink/30 bg-soft p-2">
                <p className="mb-1 font-mono text-[10px] text-ink">
                  Auto-copy was blocked. Select all + copy this prompt,
                  then paste it in your AI:
                </p>
                <textarea
                  ref={manualCopyRef}
                  readOnly
                  value={manualCopyPrompt}
                  onFocus={(e) => e.currentTarget.select()}
                  rows={4}
                  className="w-full border-2 border-ink bg-paper p-2 font-mono text-[10px] text-ink focus:outline-none focus:ring-2 focus:ring-coral"
                />
                <button
                  type="button"
                  onClick={() => {
                    manualCopyRef.current?.focus();
                    manualCopyRef.current?.select();
                  }}
                  className="mt-1 border-2 border-ink bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Select all
                </button>
              </div>
            )}
          </section>

          {/* STEP 3 — paste + Apply */}
          <section className="bg-paper px-4 py-3">
            <div className="mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                3. Paste the AI's reply here
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                if (failureReason) setFailureReason(null);
              }}
              onKeyDown={(e) => {
                // M7 fix (2026-05-21): Cmd/Ctrl+Enter on the textarea
                // triggers Apply. Common pattern for textarea-based
                // submit flows; vibecoders familiar with Slack /
                // Discord / GitHub PR comments will reach for it.
                if (
                  (e.metaKey || e.ctrlKey) &&
                  e.key === "Enter" &&
                  pasteText.trim()
                ) {
                  e.preventDefault();
                  handleApply();
                }
              }}
              placeholder="Paste the AI's full response here — we'll extract the code automatically. Press ⌘↵ to apply."
              spellCheck={false}
              rows={6}
              className="w-full border-2 border-ink bg-paper p-2 font-mono text-[11px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-coral"
            />
            {/* B — source-changed notice. The AI's reply is based on the
                template as it was when the prompt was copied. If the user
                edited the template since, applying will use the AI's
                (older-baseline) version + lose those edits. Non-blocking
                — just informs. */}
            {sourceChanged && (
              <div className="mt-2 border-2 border-ink/30 bg-soft px-2 py-1.5">
                <p className="font-mono text-[10px] text-ink">
                  ⚠ You've edited the template since copying the prompt.
                  Applying will use your AI's version (based on the earlier
                  copy) and discard those edits. Re-send to your AI to
                  include them.
                </p>
              </div>
            )}
            {failureReason && (
              <div
                role="alert"
                className="mt-2 border-2 border-coral bg-coral/10 px-2 py-1.5"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-coral">
                  Apply blocked
                </span>
                <p className="mt-0.5 font-mono text-[11px] text-ink">
                  {failureReason}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted">
                  Edit the response above + try Apply again, or re-send to a
                  different AI.
                </p>
              </div>
            )}
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!pasteText.trim()}
                className={
                  "border-2 border-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors " +
                  (pasteText.trim()
                    ? "bg-coral text-paper hover:bg-ink"
                    : "cursor-not-allowed bg-paper text-muted opacity-40")
                }
              >
                Apply to my site
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
