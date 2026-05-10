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
import TextControls from "./VibePropertiesPanel/TextControls";
import ImageControls from "./VibePropertiesPanel/ImageControls";
import LinkControls from "./VibePropertiesPanel/LinkControls";

interface VibePropertiesPanelProps {
  info: VibeElementInfo | null;
  onContentChange: (text: string) => void;
  onStyleChange: (styles: { color?: string; backgroundColor?: string }) => void;
  onImageChange: (next: { src?: string; alt?: string }) => void;
  onLinkChange: (href: string) => void;
  onClose: () => void;
}

export default function VibePropertiesPanel({
  info,
  onContentChange,
  onStyleChange,
  onImageChange,
  onLinkChange,
  onClose,
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
        />
      )}

      {info.kind === "image" && (
        <ImageControls info={info} onImageChange={onImageChange} />
      )}

      {info.kind === "link" && (
        <LinkControls
          info={info}
          onLinkChange={onLinkChange}
          onContentChange={onContentChange}
        />
      )}

      {info.kind === "container" && (
        <div className="p-4 font-mono text-[11px] text-muted">
          Containers don&apos;t have direct edits in vibe mode. Click on
          the text or image inside to edit it.
        </div>
      )}
    </aside>
  );
}

function labelFor(kind: string, tag: string): string {
  if (kind === "heading") return `Heading (${tag.toUpperCase()})`;
  if (kind === "text") return "Text";
  if (kind === "image") return "Image";
  if (kind === "link") return "Link";
  if (kind === "button") return "Button";
  return tag;
}
