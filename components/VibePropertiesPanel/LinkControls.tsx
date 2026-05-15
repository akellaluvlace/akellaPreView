"use client";

// Vibe-edit link controls: link text + href. Both fields edit
// independently — onContentChange goes through vibe:update-content
// (textContent mutation), onLinkChange through vibe:update-link
// (href attribute).

import { useEffect, useState } from "react";
import type { VibeElementInfo } from "@/lib/vibe-edit/types";
import { SwapComponentButton } from "../VibePropertiesPanel";

interface LinkControlsProps {
  info: VibeElementInfo;
  onLinkChange: (href: string) => void;
  onContentChange: (text: string) => void;
  // Opens the Components library modal so the user can swap the link
  // for a different block (e.g. a button-styled CTA). Optional.
  onComponentSwap?: () => void;
}

export default function LinkControls({
  info,
  onLinkChange,
  onContentChange,
  onComponentSwap,
}: LinkControlsProps) {
  const [href, setHref] = useState(info.href ?? "");
  const [text, setText] = useState(info.text);

  useEffect(() => {
    setHref(info.href ?? "");
    setText(info.text);
  }, [info.path, info.href, info.text]);

  return (
    <div className="space-y-3 p-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Link text
        </span>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onContentChange(e.target.value);
          }}
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Goes to
        </span>
        <input
          type="text"
          value={href}
          onChange={(e) => {
            setHref(e.target.value);
            onLinkChange(e.target.value);
          }}
          placeholder="https://... or /relative/path"
          className="mt-1 w-full border-2 border-ink bg-paper p-2 font-mono text-sm focus:outline-none"
        />
      </label>

      <SwapComponentButton onClick={onComponentSwap} />
    </div>
  );
}
