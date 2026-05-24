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
  PREFILL_URL_MAX,
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
  // Fires when user clicks Apply with a validated response. `mode`
  // tells the host how to apply it: "element" → patch into source via
  // the target's OID/htmlPath; "full-file" → setCode the whole thing.
  // Returns true on success; false → host signals a failure (e.g.
  // patch/parse error) and the modal keeps the response visible.
  onApply: (code: string, mode: "element" | "full-file") => boolean;
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

// 2026-05-24 — prominent numbered step header. Vibecoders need the
// 3-step flow obvious at a glance, not buried in tiny mono caps.
function StepHeader({
  n,
  title,
  hint,
  done,
}: {
  n: number;
  title: string;
  hint: string;
  done?: boolean;
}) {
  return (
    <div
      className={
        "flex items-start gap-4 px-8 py-4 transition-colors " +
        (done ? "bg-coral/10" : "bg-paper")
      }
    >
      <span
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink font-display text-[17px] font-bold " +
          (done ? "bg-coral text-paper" : "bg-ink text-paper")
        }
        aria-hidden="true"
      >
        {done ? "✓" : n}
      </span>
      <div className="min-w-0">
        <div className="font-display text-[18px] font-bold leading-tight text-ink">
          {title}
        </div>
        <div className="mt-1 text-[13px] leading-snug text-muted">{hint}</div>
      </div>
    </div>
  );
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
  // 2026-05-23 — free-form change description. The user can describe a
  // change in words ("make it bigger with a blue gradient") instead of
  // (or in addition to) picking a reference design.
  const [changeText, setChangeText] = useState("");
  // 2026-05-24 — the describe input is behind a toggle so it doesn't eat
  // space by default; the reference grid is the primary path.
  const [showDescribe, setShowDescribe] = useState(false);
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
  const providerSectionRef = useRef<HTMLElement | null>(null);
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
      setChangeText("");
      setShowDescribe(false);
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

  // The user can proceed with EITHER a picked reference OR a typed
  // change description (or both). This gates the provider buttons.
  const hasInput =
    !!selectedReference || changeText.trim().length > 0;

  // Compose the prompt on demand (each button click rebuilds it so
  // we always have the latest full source — Dropin's iframe re-renders
  // between picks and the source may have shifted via other edits).
  const buildPrompt = useCallback((): string | null => {
    if (!vibeInfo) return null;
    const hasRef = !!selectedReference;
    const hasChange = changeText.trim().length > 0;
    if (!hasRef && !hasChange) return null;
    return composeSwapPrompt({
      fullSource,
      kind,
      targetOuterHtml: vibeInfo.outerHtml ?? "",
      referenceHtml: selectedReference?.rawHtml,
      userPrompt: changeText.trim() || undefined,
    });
  }, [fullSource, kind, vibeInfo, selectedReference, changeText]);

  // Approximate prompt size, shown once there's input so the user knows
  // whether it'll fit their AI's context limit. ~3.5 chars/token.
  const promptSize = useMemo(() => {
    if (!vibeInfo) return null;
    const hasRef = !!selectedReference;
    const hasChange = changeText.trim().length > 0;
    if (!hasRef && !hasChange) return null;
    const prompt = composeSwapPrompt({
      fullSource,
      kind,
      targetOuterHtml: vibeInfo.outerHtml ?? "",
      referenceHtml: selectedReference?.rawHtml,
      userPrompt: changeText.trim() || undefined,
    });
    const chars = prompt.length;
    const kb = Math.round(chars / 1024);
    const kTokens = Math.round(chars / 3.5 / 1000);
    return { kb, kTokens };
  }, [fullSource, kind, vibeInfo, selectedReference, changeText]);

  const handleProviderClick = useCallback(
    async (provider: ByoAiProvider) => {
      if (!selectedReference && changeText.trim().length === 0) {
        onWarn("Pick a reference design OR describe a change first (Step 1).");
        return;
      }
      const prompt = buildPrompt();
      if (!prompt) {
        onWarn("Couldn't build the prompt — missing source or selection.");
        return;
      }
      console.log("[dropin:byo-ai] provider-click", {
        provider: provider.id,
        promptLen: prompt.length,
      });

      // CRITICAL ORDER (2026-05-22): copy to clipboard BEFORE opening
      // the tab. window.open synchronously focuses the new tab, which
      // blurs this document — and the Clipboard API rejects writeText
      // with "Document is not focused" when the page isn't focused. The
      // earlier order (open tab → write) silently failed every time, so
      // nothing was on the clipboard to paste. Writing first (while we
      // still have focus + the user-activation) succeeds, THEN we open
      // the tab.
      let copied = false;
      try {
        await navigator.clipboard.writeText(prompt);
        copied = true;
        setManualCopyPrompt(null);
      } catch (e) {
        // Fallback — surface the prompt in a readonly textarea for
        // manual copy instead of dead-ending.
        console.warn("[dropin:byo-ai] clipboard write failed; manual fallback", e);
        setManualCopyPrompt(prompt);
      }

      // Open the provider tab. Skip for "copy". Prefer the prefill URL
      // (prompt lands in the AI's box automatically — ChatGPT `?q=`)
      // when the provider supports it AND the encoded URL is under the
      // browser-safe length. Otherwise open the plain URL + rely on the
      // clipboard copy. On Chrome the user-activation survives the short
      // clipboard await; if a browser blocks the popup, the prompt is
      // still on the clipboard (or fallback box).
      let opened: Window | null = null;
      let prefilled = false;
      if (provider.openUrl) {
        let url = provider.openUrl;
        if (provider.buildPrefillUrl) {
          const prefillUrl = provider.buildPrefillUrl(prompt);
          if (prefillUrl.length <= PREFILL_URL_MAX) {
            url = prefillUrl;
            prefilled = true;
          }
        }
        opened = window.open(url, "_blank", "noopener");
      }
      const popupBlocked = !!provider.openUrl && (!opened || opened.closed);

      // Remember the user's choice + snapshot the source for the
      // edit-after-copy notice.
      try {
        localStorage.setItem(BYO_AI_PROVIDER_STORAGE_KEY, provider.id);
        setPreferredProvider(provider.id);
      } catch {
        // localStorage can be disabled in private browsing — degrade.
      }
      setLastClicked(provider.id);
      promptSourceRef.current = fullSource;
      setSourceChanged(false);

      const providerName = provider.label.replace("Open ", "");
      if (!copied && !prefilled) {
        onWarn(
          "Couldn't auto-copy — the prompt is shown below the buttons. Select all + copy it manually, then paste in your AI.",
        );
      } else if (popupBlocked) {
        onWarn(
          `Prompt copied, but ${providerName}'s tab was blocked by your browser. Open ${providerName} yourself + paste — then come back here.`,
        );
      } else if (prefilled) {
        onInfo(
          `${providerName} opened with the prompt pre-filled — just press Enter there, copy the reply, then paste it below.`,
        );
      } else if (provider.openUrl) {
        onInfo(
          `Prompt copied + ${providerName} opened. Paste it there → copy the reply → come back here to paste below.`,
        );
      } else {
        onInfo("Prompt copied. Paste it in your AI, then come back here.");
      }
    },
    [selectedReference, changeText, buildPrompt, onInfo, onWarn, fullSource],
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
      mode: validation.mode,
      reason: validation.reason,
    });
    if (!validation.ok) {
      setFailureReason(validation.reason ?? "Response failed validation.");
      return;
    }
    // Apply the CLEANED code the validator produced (element markup
    // sliced of prose, or the trimmed full file), not the raw paste.
    const codeToApply = validation.appliedCode ?? extractedCode;
    const applied = onApply(codeToApply, validation.mode ?? "full-file");
    console.log("[dropin:byo-ai] apply-result", { applied, mode: validation.mode });
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
    setChangeText("");
    setFailureReason(null);
    onClose();
  }, [vibeInfo, pasteText, fullSource, kind, onApply, onClose]);

  if (!open || !vibeInfo) return null;

  const targetKind = inferCategoryFromKind(vibeInfo);

  return (
    <div
      className="fixed inset-0 z-[90] bg-paper"
      role="dialog"
      aria-modal="true"
      aria-label="Swap with AI"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="flex h-full w-full flex-col bg-paper focus:outline-none"
      >
        {/* Header — title + a plain-language explanation of the whole
            3-step round-trip so vibecoders grok it before scrolling. */}
        <div className="shrink-0 border-b-2 border-ink bg-soft px-8 py-5">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <span className="font-display text-[24px] font-bold leading-tight text-ink">
                ✨ Restyle your{" "}
                <span className="text-coral">&lt;{vibeInfo.tag}&gt;</span> with
                AI
              </span>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/80">
                You use your <span className="font-bold">own</span> AI
                (ChatGPT, Claude…) — it&apos;s free. Three steps:
                <span className="font-bold"> ① choose a look</span> →
                <span className="font-bold"> ② open your AI</span> →
                <span className="font-bold"> ③ paste its reply back here</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close swap dialog"
              className="shrink-0 border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Close (Esc)
            </button>
          </div>
        </div>

        {/* Body — scrolls if needed; reference picker takes most space */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* STEP 1 — reference picker */}
          <section className="border-b-2 border-ink/15">
            <StepHeader
              n={1}
              title="Choose the new look"
              hint="Type what you want in plain words, or pick a ready-made design below."
              done={!!selectedReference || changeText.trim().length > 0}
            />
            {selectedReference && (
              <div className="border-b-2 border-ink/10 bg-coral/10 px-8 py-2">
                <span className="text-[13px] font-bold text-coral">
                  ✓ Picked “{selectedReference.component.title}” — now do Step 2
                  below ↓
                </span>
              </div>
            )}
            {/* 2026-05-24 — describe-a-change behind a toggle so it
                doesn't eat space; the reference grid is the primary
                path. Either input enables the providers. */}
            <div className="border-b-2 border-ink/10 bg-paper px-8 py-2">
              {!showDescribe && !changeText.trim() ? (
                <button
                  type="button"
                  onClick={() => setShowDescribe(true)}
                  className="text-[13px] font-bold text-coral underline-offset-2 hover:underline"
                >
                  ✏️ Or describe a change in words instead →
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    autoFocus
                    value={changeText}
                    onChange={(e) => setChangeText(e.target.value)}
                    placeholder="e.g. make it bigger with a blue gradient and rounded corners"
                    className="w-full border-2 border-ink bg-paper px-3 py-2.5 text-[14px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-coral"
                  />
                  <p className="mt-1.5 text-[12px] text-muted">
                    {changeText.trim()
                      ? "✓ Got it. Pick a reference too if you like, or go to Step 2 ↓"
                      : "Describe the change, or pick a ready-made design below."}
                  </p>
                </>
              )}
            </div>
            {/* 2026-05-22 — overflow-y-auto is load-bearing. The grid
                (up to 1257 tiles) scrolls INSIDE this fixed-height box
                so steps 2 + 3 stay reachable. Tall on the full-screen
                modal so many tiles show at once. */}
            <div className="h-[48vh] min-h-[320px] max-h-[48vh] overflow-y-auto">
              <InlineComponentBrowser
                mode={kind}
                category={targetKind}
                columns={4}
                selectedSlug={selectedReference?.component.slug ?? null}
                onPickReference={(component, rawHtml) => {
                  setSelectedReference({ component, rawHtml });
                  // Scroll the "Send to your AI" step into view so the
                  // user sees the providers light up right after picking.
                  window.requestAnimationFrame(() => {
                    providerSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                    });
                  });
                }}
                onWarn={onWarn}
              />
            </div>
          </section>

          {/* STEP 2 — provider buttons */}
          <section
            ref={providerSectionRef}
            className="border-b-2 border-ink/15 bg-paper"
          >
            <StepHeader
              n={2}
              title="Open your AI"
              hint={
                hasInput
                  ? "Click the AI you use. It opens in a new tab with your request ready."
                  : "Do Step 1 first (describe a change or pick a design), then these light up."
              }
              done={!!lastClicked}
            />
            <div className="px-8 pb-4">
              <div className="flex flex-wrap items-center gap-3">
                {orderedProviders.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderClick(p)}
                    disabled={!hasInput}
                    title={p.title}
                    className={
                      "border-2 border-ink px-5 py-3 text-[14px] font-bold transition-colors " +
                      (hasInput
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
              {/* After a provider click — spell out what to do over in
                  the AI tab, then come back. The single clearest signal
                  for the round-trip. */}
              {lastClicked ? (
                <div className="mt-4 border-2 border-coral bg-coral/10 px-4 py-3.5">
                  <p className="text-[13px] font-bold text-ink">
                    ✓ Opened{" "}
                    {getProviderById(lastClicked)?.label.replace("Open ", "") ??
                      "your AI"}
                    . Now, over in that tab:
                  </p>
                  <ol className="mt-1 list-decimal pl-5 text-[12px] leading-relaxed text-ink/90">
                    <li>
                      Send the prompt
                      {lastClicked === "chatgpt"
                        ? " (already filled in — just press Enter)"
                        : " (paste it — it's on your clipboard — then send)"}
                      .
                    </li>
                    <li>Wait for the answer, then copy the whole reply.</li>
                    <li>
                      Come back here and paste it in{" "}
                      <span className="font-bold">Step 3 ↓</span>
                    </li>
                  </ol>
                  <p className="mt-1.5 text-[11px] text-muted">
                    Want a different AI? Click another button above.
                  </p>
                </div>
              ) : (
                hasInput && (
                  <p className="mt-2 text-[12px] text-muted">
                    {promptSize && (
                      <>Prompt is ready (~{promptSize.kb} KB). </>
                    )}
                    Tip: ChatGPT opens with it already typed in.
                  </p>
                )
              )}
            </div>
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
          <section className="bg-paper">
            <StepHeader
              n={3}
              title="Paste the AI's reply"
              hint="Paste the whole answer the AI gave you — we pull out the code automatically and apply it."
              done={pasteText.trim().length > 0}
            />
            <div className="px-8 pb-6">
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
              placeholder="Paste the AI's whole reply here (⌘↵ / Ctrl↵ to apply)"
              spellCheck={false}
              rows={8}
              className="w-full border-2 border-ink bg-paper p-3 font-mono text-[12px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-coral"
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
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="border-2 border-ink bg-paper px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!pasteText.trim()}
                className={
                  "border-2 border-ink px-6 py-2.5 text-[15px] font-bold transition-colors " +
                  (pasteText.trim()
                    ? "bg-coral text-paper hover:bg-ink"
                    : "cursor-not-allowed bg-paper text-muted opacity-40")
                }
              >
                Apply to my site
              </button>
            </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
