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
import { isCardLike } from "@/lib/vibe-edit/detect";
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
  // Component swap — opens the host-owned LibraryModal in components
  // mode (Uiverse + HyperUI tiles). Wired for every element kind that
  // doesn't already have a kind-specific library (text / heading /
  // button / link / card / plain container). Same shape contract as
  // onIconSwap / onImageSwap.
  onComponentSwap?: () => void;
  // Background-image pick — opens the host-owned LibraryModal in media
  // mode. Pick handler treats the URL as a CSS background (NOT an
  // outerHTML swap). Wired only for card-like containers + semantic
  // section tags (header / footer / main / aside / article / nav).
  onBgImagePick?: () => void;
  // Background-image remove — clears the inline `background-image`
  // CSS + the corresponding Tailwind arbitrary class via idle-commit.
  onBgImageRemove?: () => void;
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
  onClassesChange,
  componentBrowserOpen,
  componentBrowserCategory,
  onComponentPick,
  onWarn,
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
          {labelFor(info.kind, info.tag)}
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

      {(info.kind === "text" ||
        info.kind === "heading" ||
        info.kind === "button") && (
        <TextControls
          info={info}
          onContentChange={onContentChange}
          onStyleChange={onStyleChange}
          onClassesChange={onClassesChange}
          onComponentSwap={onComponentSwap}
        />
      )}

      {info.kind === "image" && (
        <ImageControls
          info={info}
          onImageChange={onImageChange}
          onSwapClick={onImageSwap}
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
          onComponentSwap={onComponentSwap}
        />
      )}

      {info.kind === "container" && isCardLike(info) && (
        <CardControls
          info={info}
          onStyleChange={onStyleChange}
          onComponentSwap={onComponentSwap}
          onBgImagePick={onBgImagePick}
          onBgImageRemove={onBgImageRemove}
        />
      )}

      {info.kind === "container" && !isCardLike(info) && (
        <div className="space-y-3 p-4">
          <p className="font-mono text-[11px] text-muted">
            This container is just a wrapper — click the text or image
            inside to edit it, or swap the whole block below.
          </p>
          <SwapComponentButton onClick={onComponentSwap} />
        </div>
      )}

      {componentBrowserOpen && onComponentPick && mode && (
        <InlineComponentBrowser
          mode={mode}
          category={componentBrowserCategory ?? null}
          onPick={onComponentPick}
          onWarn={onWarn}
          preserveBbox={info.bbox ?? null}
        />
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

function labelFor(kind: string, tag: string): string {
  if (kind === "heading") return `Heading (${tag.toUpperCase()})`;
  if (kind === "text") return "Text";
  if (kind === "image") return "Image";
  if (kind === "icon") return "Icon";
  if (kind === "link") return "Link";
  if (kind === "button") return "Button";
  if (kind === "container") return "Card";
  return tag;
}
