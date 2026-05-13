"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const DEBUG_LOGS = false;
function log(msg: string, data?: unknown) {
  if (DEBUG_LOGS) console.log(`[dropin:KindToggle] ${msg}`, data ?? "");
}

type Kind = "jsx" | "html";

interface KindToggleProps {
  current: Kind;
  /**
   * default = gallery masthead, small = workspace header slot,
   * block = full-width sidebar segment (h-12 to match other sidebar rows).
   */
  size?: "default" | "small" | "block";
}

// URL-driven toggle between the JSX and HTML versions of a web/ template.
// On the landing gallery it flips every card's link (and filters the reader
// preference); on a template route it swaps to the other file format for
// the same slug. Uses `router.replace` (not `push`) so browser Back doesn't
// pile up a history entry per toggle click.
export default function KindToggle({ current, size = "default" }: KindToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, start] = useTransition();

  const switchTo = useCallback(
    (kind: Kind) => {
      log("click kind", { target: kind, current });
      if (kind === current) { log("no-op (same kind)"); return; }
      const params = new URLSearchParams(searchParams.toString());
      if (kind === "jsx") params.delete("kind");
      else params.set("kind", "html");
      const q = params.toString();
      const url = q ? `${pathname}?${q}` : pathname;
      start(() => router.replace(url, { scroll: false }));
    },
    [current, pathname, router, searchParams]
  );

  const btnCls = (active: boolean, first: boolean) =>
    (size === "block"
      ? "flex-1 h-9 px-3 text-[11px]"
      : size === "small"
        ? "h-9 min-w-[5.5rem] px-3 text-[10px] inline-flex items-center justify-center"
        : "px-3 py-2 text-[11px]") +
    " font-mono uppercase tracking-[0.15em] transition-colors " +
    (active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-soft") +
    (first ? "" : " border-l-2 border-ink") +
    (pending ? " opacity-70" : "");

  const containerCls =
    (size === "block" ? "flex w-full" : "inline-flex") +
    " overflow-hidden border-2 border-ink";

  return (
    <div
      className={containerCls}
      role="group"
      aria-label="Template format"
    >
      {(["jsx", "html"] as const).map((k, i) => (
        <button
          key={k}
          type="button"
          aria-pressed={k === current}
          onClick={() => switchTo(k)}
          className={btnCls(k === current, i === 0)}
        >
          {k.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
