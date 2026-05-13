"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import PreviewModal from "./PreviewModal";
import type { PreviewKind } from "@/lib/preview";

interface PreviewRouteProps {
  code: string;
  kind: PreviewKind;
  filename?: string;
}

// Thin client wrapper that hosts <PreviewModal> as a full page (the
// /preview/[slug] route uses this). Close goes back to whatever launched
// the preview — gallery, landing carousel, or a deep link's referrer.
// Falls back to /gallery when there's no history (direct visit / refresh).
export default function PreviewRoute({
  code,
  kind,
  filename,
}: PreviewRouteProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/gallery");
    }
  }, [router]);

  return (
    <PreviewModal
      code={code}
      kind={kind}
      filename={filename}
      onClose={handleClose}
      lockBodyScroll={false}
      closeLabel="Close · Esc"
    />
  );
}
