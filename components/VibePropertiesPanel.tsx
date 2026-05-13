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
import TextControls from "./VibePropertiesPanel/TextControls";
import ImageControls from "./VibePropertiesPanel/ImageControls";
import LinkControls from "./VibePropertiesPanel/LinkControls";
import CardControls from "./VibePropertiesPanel/CardControls";
import IconControls from "./VibePropertiesPanel/IconControls";

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
  // Class-list mutation routed through to TextControls' typography
  // sliders. Optional so panels mounted without class-edit support
  // (e.g. a future read-only mode) just don't render the section.
  onClassesChange?: (newClasses: string) => void;
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
  onClassesChange,
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
        />
      )}

      {info.kind === "container" && isCardLike(info) && (
        <CardControls info={info} onStyleChange={onStyleChange} />
      )}

      {info.kind === "container" && !isCardLike(info) && (
        <div className="p-4 font-mono text-[11px] text-muted">
          This container is just a wrapper — click on the text or
          image inside to edit it.
        </div>
      )}
    </aside>
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
