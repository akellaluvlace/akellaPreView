"use client";

// Vibe-edit properties panel. Routes by VibeElementInfo.kind to one
// of three control sets — text/heading/button → TextControls,
// image → ImageControls, link → LinkControls. Containers are
// inert in vibe mode (clicks on them clear selection) but if a
// container ever lands here we show a hint instead of nothing so
// the panel doesn't go blank.
//
// Empty state (info === null) gives a one-liner pointing at the
// canvas. Vibecoder doesn't see the empty panel and wonder if
// something broke.

import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import { isCardLike, isLinkStyledAsButton } from "@/lib/vibe-edit/detect";
import type { PreviewKind } from "@/lib/preview";
import TextControls from "./VibePropertiesPanel/TextControls";
import ImageControls from "./VibePropertiesPanel/ImageControls";
import LinkControls from "./VibePropertiesPanel/LinkControls";
import CardControls from "./VibePropertiesPanel/CardControls";
import IconControls from "./VibePropertiesPanel/IconControls";
import InlineComponentBrowser from "./VibePropertiesPanel/InlineComponentBrowser";

interface VibePropertiesPanelProps {
  info: VibeElementInfo | null;
  onContentChange: (text: string) => void;
  // styles is now an open-shape Record so card / icon / future
  // panels can route any CSS prop through the same channel without
  // a protocol bump.
  onStyleChange: (styles: Record<string, string>) => void;
  onImageChange: (next: { src?: string; alt?: string }) => void;
  onLinkChange: (href: string) => void;
  onClose: () => void;
  // Icon-only swap — opens the host-owned LibraryModal in icons mode.
  // Optional so callers that don't care about icon swap can omit it
  // (the IconControls Browse button disables itself when absent).
  onIconSwap?: () => void;
  // Image swap — opens the host-owned LibraryModal in media mode.
  // Same shape contract as onIconSwap: the modal owns the pick →
  // postMessage routing, this control just signals intent.
  onImageSwap?: () => void;
  // 2026-05-21 — onComponentSwap restored. Now powers the BYO-AI
  // swap modal (user picks reference + sends prompt to ChatGPT/
  // Claude/Gemini + pastes reply back). See components/ByoAiSwapModal
  // + lib/byo-ai/*.
  onComponentSwap?: () => void;
  // Background-image pick — opens the host-owned LibraryModal in media
  // mode. Pick handler treats the URL as a CSS background (NOT an
  // outerHTML swap). Wired only for card-like containers + semantic
  // section tags (header / footer / main / aside / article / nav).
  onBgImagePick?: () => void;
  // Background-image remove — clears the inline `background-image`
  // CSS + the corresponding Tailwind arbitrary class via idle-commit.
  onBgImageRemove?: () => void;
  // 2026-05-15 — Background-image shuffle. Same Pixabay query-from-text
  // mechanism as the regular image shuffle, scoped to the selected
  // card/section's text content. Async because the network call is
  // surfaced via showWarn on error.
  onBgImageShuffle?: () => void;
  // 2026-05-15 — Copy just THIS element's source bytes (OIDs stripped,
  // dedented). Used by vibecoders who want to paste a single section
  // into AI for focused iteration without dragging the entire template
  // along. JSX mode only; HTML callers leave this undefined and the
  // button doesn't render.
  onCopySection?: () => void;
  // 2026-05-16 — Commit current live vibe state to source via the
  // history-aware setCode path. Without this, vibe edits route through
  // setCodeSilent and undo can't see them. The Apply button below the
  // panel content surfaces this gesture explicitly.
  onApply?: () => void;
  // Class-list mutation routed through to TextControls' typography
  // sliders. Optional so panels mounted without class-edit support
  // (e.g. a future read-only mode) just don't render the section.
  onClassesChange?: (newClasses: string) => void;
  // Inline component browser — when open, the grid renders below the
  // Browse-components button. Category filters by the kind-aware
  // heuristic computed at the call site. onComponentPick is called
  // with the rendered asset text (already mode-aware HTML or JSX).
  componentBrowserOpen?: boolean;
  componentBrowserCategory?: string | null;
  onComponentPick?: (
    assetText: string,
    opts?: { forceRebuild?: boolean },
  ) => void;
  onWarn?: (message: string) => void;
  // 2026-05-16 — positive-path toast routing. Passed through to
  // ImageControls (per-image Shuffle success) and used directly in
  // CardControls bg-image flow. Wired from Workspace.showInfo.
  onInfo?: (message: string) => void;
  mode?: PreviewKind;
}

export default function VibePropertiesPanel({
  info,
  onContentChange,
  onStyleChange,
  onImageChange,
  onLinkChange,
  onClose,
  onIconSwap,
  onImageSwap,
  onComponentSwap,
  onBgImagePick,
  onBgImageRemove,
  onBgImageShuffle,
  onCopySection,
  onApply,
  onClassesChange,
  componentBrowserOpen,
  componentBrowserCategory,
  onComponentPick,
  onWarn,
  onInfo,
  mode,
}: VibePropertiesPanelProps) {
  if (!info) {
    return (
      <aside
        aria-label="Element properties"
        className="w-[320px] shrink-0 border-l-2 border-ink bg-paper p-4 font-mono text-sm"
      >
        <p className="text-muted">
          Click anything on the page to edit it.
        </p>
        <p className="mt-2 font-mono text-[10px] text-muted">
          Headings, paragraphs, images, links, and buttons all work.
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Element properties"
      className="w-[320px] shrink-0 overflow-y-auto border-l-2 border-ink bg-paper"
    >
      <header className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
          {labelFor(info)}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-lg leading-none text-ink hover:text-coral"
          aria-label="Deselect"
          title="Deselect (Esc)"
        >
          ×
        </button>
      </header>

      {/* 2026-05-15 — "Copy this section" — extracts the selected
          element's source bytes (with OIDs stripped + dedented) so the
          vibecoder can paste JUST this section into ChatGPT/Claude for
          focused iteration. The full template Copy button up in the
          chrome stays as-is for "give me the whole thing" workflow. */}
      {onCopySection && (
        <div className="border-b-2 border-ink/15 px-4 py-2">
          <button
            type="button"
            onClick={onCopySection}
            title="Copy just this element's code — paste it into ChatGPT/Claude to iterate on this section alone"
            className="w-full border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper"
          >
            Copy this section's code
          </button>
        </div>
      )}

      {(info.instanceCount ?? 1) > 1 && (
        <div
          className="border-b-2 border-ink bg-coral/10 px-4 py-2 font-mono text-[10px] text-ink"
          role="status"
          title={
            "This template renders this element multiple times from a single source location. " +
            "Your edits apply to all of them — that's how a `.map()` works under the hood. " +
            "To make one card different, copy it out of the list in the code editor."
          }
        >
          <span className="font-bold uppercase tracking-[0.15em]">
            Editing all {info.instanceCount} copies
          </span>
          <p className="mt-0.5 text-muted">
            This element appears {info.instanceCount} times. Changes
            apply to every copy.
          </p>
        </div>
      )}

      {/* 2026-05-21 — BYO-AI swap button. Opens ByoAiSwapModal.
          Host wires onComponentSwap to a handler that just opens the
          modal (no API call here; that happens external-AI side).
          User browses references, picks one, sends prompt to their
          chosen AI, pastes reply back. See docs/superpowers/plans/
          2026-05-20-byo-ai-swap.md.

          2026-05-22 — gated to component-like kinds. Images + icons
          have their own direct-swap flows (Pixabay shuffle / icon
          library); AI swap doesn't fit them. Per the user's design:
          "keep library only for icons/images — those quick swaps
          work — components go through BYO-AI." */}
      {onComponentSwap && info.kind !== "image" && info.kind !== "icon" && (
        <div className="border-b-2 border-ink/15 px-4 py-3">
          <button
            type="button"
            onClick={onComponentSwap}
            title="Pick a reference design + send a prompt to ChatGPT/Claude/Gemini. Paste the reply back to swap. Zero AI cost to Dropin — you use your own AI."
            className="w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            ✨ Swap with AI
          </button>
          <p className="mt-1.5 text-center font-mono text-[10px] text-muted">
            Pick a design → send to your AI → paste the reply.
          </p>
        </div>
      )}

      {(info.kind === "text" ||
        info.kind === "heading" ||
        info.kind === "button") && (
        <TextControls
          info={info}
          onContentChange={onContentChange}
          onStyleChange={onStyleChange}
          onClassesChange={onClassesChange}
        />
      )}

      {info.kind === "image" && (
        <ImageControls
          info={info}
          onImageChange={onImageChange}
          onSwapClick={onImageSwap}
          onWarn={onWarn}
          onInfo={onInfo}
        />
      )}

      {info.kind === "icon" && (
        <IconControls
          info={info}
          onStyleChange={onStyleChange}
          onSwapClick={onIconSwap}
          onClassesChange={onClassesChange}
        />
      )}

      {info.kind === "link" && (
        <LinkControls
          info={info}
          onLinkChange={onLinkChange}
          onContentChange={onContentChange}
          onStyleChange={onStyleChange}
          onClassesChange={onClassesChange}
        />
      )}

      {info.kind === "container" && isCardLike(info) && (
        <CardControls
          info={info}
          onStyleChange={onStyleChange}
          onBgImagePick={onBgImagePick}
          onBgImageRemove={onBgImageRemove}
          onBgImageShuffle={onBgImageShuffle}
        />
      )}

      {info.kind === "container" && !isCardLike(info) && (
        <div className="space-y-3 p-4">
          <p className="font-mono text-[11px] text-muted">
            This container is just a wrapper — click the text or image
            inside to edit it.
          </p>
        </div>
      )}

      {/* 2026-05-17 — InlineComponentBrowser mount retired with the
          rest of the component-library swap. Replaced by the AI Edit
          plan at `docs/superpowers/plans/2026-05-17-ai-edit-element-section.md`. */}

      {/* 2026-05-16 — "Save now" button. Vibe edits auto-save every
          600ms after you stop (via the idle-commit useEffect, which
          NOW routes through setCode so undo captures every batch).
          This button is the explicit "lock it in immediately" gesture
          for users who don't want to wait the 600ms. Always toasts
          positively — confirms saved state whether a force-commit was
          needed or auto-save already handled it. */}
      {onApply && (
        <div className="border-t-2 border-ink/15 bg-soft/30 px-4 py-3">
          <button
            type="button"
            onClick={onApply}
            title="Force-save now (auto-save also runs every 600ms after you stop)"
            className="w-full border-2 border-ink bg-coral px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper hover:bg-ink"
          >
            Save now ✓
          </button>
          <p className="mt-1.5 text-center font-mono text-[10px] text-muted">
            Auto-saves run after you stop editing. Click to save right now.
          </p>
        </div>
      )}
    </aside>
  );
}

// Shared "Browse components" button — kept inline (rather than as its
// own file) because it's a one-liner in 4 sites and lifting it to a
// separate component would just add navigation overhead.
export function SwapComponentButton({
  onClick,
  label = "Swap component",
  hint = "Replace this block with any tile from the Components library.",
}: {
  onClick?: () => void;
  label?: string;
  hint?: string;
}) {
  return (
    <div className="border-t-2 border-ink/15 pt-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <button
        type="button"
        onClick={() => {
          console.log("[dropin:SwapComponentButton] clicked", { hasOnClick: !!onClick });
          onClick?.();
        }}
        disabled={!onClick}
        className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
      >
        Browse components
      </button>
      <p className="mt-1 font-mono text-[10px] text-muted">{hint}</p>
    </div>
  );
}

function labelFor(info: VibeElementInfo): string {
  const kind = info.kind;
  const tag = info.tag;
  // 2026-05-17 — Button-styled <a> (Tailwind utility chrome) shows as
  // "Button" so the vibecoder's mental model matches what they see.
  // The href field is still visible in LinkControls below, so they
  // can edit the link target without losing the "Button" framing.
  if (kind === "link" && isLinkStyledAsButton(info)) return "Button";
  if (kind === "heading") return `Heading (${tag.toUpperCase()})`;
  if (kind === "text") return "Text";
  if (kind === "image") return "Image";
  if (kind === "icon") return "Icon";
  if (kind === "link") return "Link";
  if (kind === "button") return "Button";
  if (kind === "container") return "Card";
  return tag;
}
