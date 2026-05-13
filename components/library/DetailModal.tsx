"use client";

import { useEffect, useState } from "react";
import type {
  ComponentFull,
  ComponentMeta,
} from "@/lib/component-library/types";
import { getComponentFull } from "@/lib/component-library/client";
import type { PreviewKind } from "@/lib/preview";

interface DetailModalProps {
  meta: ComponentMeta;
  mode: PreviewKind;
  onClose: () => void;
  onInsert: () => void | Promise<void>;
}

type Tab = "preview" | "html" | "css";

export default function DetailModal({
  meta,
  mode,
  onClose,
  onInsert,
}: DetailModalProps) {
  const [full, setFull] = useState<ComponentFull | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("preview");

  useEffect(() => {
    let active = true;
    getComponentFull(meta.slug)
      .then((f) => {
        if (active) setFull(f);
      })
      .catch((e) => {
        if (active) setErr(e instanceof Error ? e.message : String(e));
      });
    return () => {
      active = false;
    };
  }, [meta.slug]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={meta.title}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden border-2 border-ink bg-paper shadow-[8px_8px_0_0_#FF4D2E]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b-2 border-ink px-4 py-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl leading-tight">{meta.title}</h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {meta.source} · {meta.category}
              {meta.author ? ` · ${meta.author}` : ""}
              {meta.license ? ` · ${meta.license}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onInsert}
              className="btn btn-accent"
              disabled={!full}
            >
              + Insert
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="btn"
            >
              Close
            </button>
          </div>
        </header>

        <div className="flex shrink-0 border-b-2 border-ink bg-soft" role="tablist">
          {(["preview", "html", "css"] as Tab[]).map((t, i) => {
            const disabled = t === "css" && !meta.hasCss;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={() => !disabled && setTab(t)}
                className={
                  "flex-1 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors " +
                  (tab === t
                    ? "bg-ink text-paper"
                    : disabled
                    ? "bg-soft text-muted"
                    : "bg-paper text-ink hover:bg-soft") +
                  (i > 0 ? " border-l-2 border-ink" : "")
                }
              >
                {t}
                {disabled ? " (none)" : ""}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {err && <div className="p-6 font-mono text-xs text-coral">{err}</div>}
          {!full && !err && (
            <div className="p-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Loading…
            </div>
          )}
          {full && tab === "preview" && <DetailPreview full={full} />}
          {full && tab === "html" && <CodePane code={full.html} />}
          {full && tab === "css" && (
            <CodePane code={(full.css ?? "").replace(/__UIV_SCOPE__/g, ".<scope>")} />
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-4 border-t-2 border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          <a
            href={meta.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-coral"
          >
            ↗ View original
          </a>
          <span>
            Insert into {mode.toUpperCase()} editor
            {meta.tailwindPlugins.length ? ` · plugins: ${meta.tailwindPlugins.join(", ")}` : ""}
          </span>
        </footer>
      </div>
    </div>
  );
}

// Renders the component into a fresh sandboxed iframe using the same html
// shell the thumbnail worker uses (Tailwind CDN + optional scoped CSS). This
// is the ONE live iframe the sidebar ever spins up — tiles in the grid
// stay static <img>.
function DetailPreview({ full }: { full: ComponentFull }) {
  const srcDoc = buildPreviewDoc(full);
  return (
    <iframe
      title={`Preview: ${full.title}`}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin"
      className="h-full w-full bg-card"
    />
  );
}

function buildPreviewDoc(full: ComponentFull): string {
  const thumbScope = "dropin-preview";
  const scopedCss = full.css
    ? full.css.split("__UIV_SCOPE__").join(thumbScope)
    : "";
  const plugins = full.tailwindPlugins?.length
    ? `?plugins=${encodeURIComponent(full.tailwindPlugins.join(","))}`
    : "";
  const tailwind = full.tailwindRequired
    ? `<script src="https://cdn.tailwindcss.com${plugins}"></script>`
    : "";
  const bodyClass = full.darkVariant ? "dark" : "";
  const wrap = full.css ? thumbScope : "";
  return `<!doctype html>
<html class="${bodyClass}">
<head>
<meta charset="utf-8" />
${tailwind}
<style>
  html,body{margin:0;padding:0;background:${full.darkVariant ? "#0b0c0e" : "#fafafa"};font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;}
  .dropin-preview-wrap{min-height:100vh;display:grid;place-items:center;padding:32px;}
  ${scopedCss}
</style>
</head>
<body>
<div class="dropin-preview-wrap">
<div class="${wrap}">
${full.html}
</div>
</div>
</body>
</html>`;
}

function CodePane({ code }: { code: string }) {
  return (
    <pre className="h-full overflow-auto bg-ink p-4 font-mono text-[11px] leading-[1.5] text-paper">
      <code>{code}</code>
    </pre>
  );
}
