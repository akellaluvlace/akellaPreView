// Pexels video search proxy. Same key + setup-card pattern as the photo
// route. Pexels videos return an array of `video_files` per result, each
// at a different quality / resolution; we pass them through verbatim so the
// panel's resolution dropdown can pick the right one at insert time.

import { NextResponse } from "next/server";
import { assetProxyRateLimiter, readClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const revalidate = 3600;

function notConfigured() {
  return NextResponse.json(
    {
      configured: false,
      provider: "pexels",
      setupNote: "Add PEXELS_API_KEY to .env.local, then restart the dev server.",
      signupUrl: "https://www.pexels.com/api/",
      docsUrl: "https://www.pexels.com/api/documentation/",
    },
    { status: 503 }
  );
}

export async function GET(req: Request) {
  if (!assetProxyRateLimiter.allow(readClientIp(req), Date.now())) {
    return NextResponse.json(
      { configured: true, error: "rate-limited", detail: "Too many requests — slow down a moment." },
      { status: 429 }
    );
  }
  const key = process.env.PEXELS_API_KEY;
  if (!key) return notConfigured();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ configured: true, videos: [], total: 0 });
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const per_page = Math.min(80, Math.max(1, Number(searchParams.get("per_page") || 12)));

  const params = new URLSearchParams({ query: q, page: String(page), per_page: String(per_page) });
  const upstream = `https://api.pexels.com/videos/search?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(upstream, {
      headers: { Authorization: key },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    // Don't echo `String(e)` — see pexels-photos/route.ts.
    console.error("[pexels-videos] upstream fetch failed:", e);
    return NextResponse.json(
      { configured: true, error: "upstream-unreachable", detail: "Could not reach Pexels — check your network connection." },
      { status: 502 }
    );
  }

  if (res.status === 401) {
    return NextResponse.json(
      { configured: true, error: "unauthorized" },
      { status: 401 }
    );
  }
  if (res.status === 429) {
    return NextResponse.json(
      { configured: true, error: "rate-limited" },
      { status: 429 }
    );
  }
  if (!res.ok) {
    return NextResponse.json(
      { configured: true, error: "upstream-error", status: res.status },
      { status: 502 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    console.error("[pexels-videos] upstream returned non-JSON:", e);
    return NextResponse.json(
      { configured: true, error: "upstream-malformed", detail: "Pexels returned an unexpected response shape." },
      { status: 502 }
    );
  }
  return NextResponse.json({
    configured: true,
    total: data.total_results,
    videos: (data.videos || []).map((v: {
      id: number;
      width: number;
      height: number;
      url: string;
      image: string;
      duration: number;
      user?: { name?: string; url?: string };
      video_files?: PexelsVideoFile[];
    }) => ({
      id: v.id,
      width: v.width,
      height: v.height,
      url: v.url,
      image: v.image,
      duration: v.duration,
      // Guard sparse/legacy upstream shapes (PEXVID-1) — a missing user or
      // video_files array threw an opaque 500.
      user: { name: v.user?.name ?? "", url: v.user?.url ?? "" },
      video_files: (v.video_files ?? []).map((f) => ({
        id: f.id,
        quality: f.quality,
        file_type: f.file_type,
        width: f.width,
        height: f.height,
        link: f.link,
      })),
    })),
  });
}

interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number | null;
  height: number | null;
  link: string;
}
