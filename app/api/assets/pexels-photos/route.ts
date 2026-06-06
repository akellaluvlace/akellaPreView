// Pexels photo search proxy. Same key-gating + setup-card empty state
// pattern as the Unsplash route. Different API key (Pexels is `Authorization:
// {API_KEY}`, no `Client-ID` prefix), and the response shape is normalized
// to what `insert-pexels-photo.ts` expects.

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
  if (!q) return NextResponse.json({ configured: true, photos: [], total: 0 });
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const per_page = Math.min(80, Math.max(1, Number(searchParams.get("per_page") || 24)));
  const orientation = searchParams.get("orientation") || "";

  const params = new URLSearchParams({ query: q, page: String(page), per_page: String(per_page) });
  if (orientation === "landscape" || orientation === "portrait" || orientation === "square") {
    params.set("orientation", orientation);
  }

  const upstream = `https://api.pexels.com/v1/search?${params.toString()}`;
  let res: Response;
  try {
    res = await fetch(upstream, {
      headers: { Authorization: key },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    // Don't echo `String(e)` — undici error messages include the request
    // URL + internal Node error structure. Pexels's key is in the
    // Authorization header so the URL itself is safe, but the error shape
    // can still expose Node internals + stack hints. Static string for
    // the client, full error to server logs.
    console.error("[pexels-photos] upstream fetch failed:", e);
    return NextResponse.json(
      { configured: true, error: "upstream-unreachable", detail: "Could not reach Pexels — check your network connection." },
      { status: 502 }
    );
  }

  if (res.status === 401) {
    return NextResponse.json(
      { configured: true, error: "unauthorized", detail: "Pexels rejected the API key" },
      { status: 401 }
    );
  }
  if (res.status === 429) {
    return NextResponse.json(
      { configured: true, error: "rate-limited", detail: "Pexels rate limit reached" },
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
    console.error("[pexels-photos] upstream returned non-JSON:", e);
    return NextResponse.json(
      { configured: true, error: "upstream-malformed", detail: "Pexels returned an unexpected response shape." },
      { status: 502 }
    );
  }
  return NextResponse.json({
    configured: true,
    total: data.total_results,
    photos: (data.photos || []).map((p: {
      id: number;
      width: number;
      height: number;
      url: string;
      photographer: string;
      photographer_url: string;
      alt: string;
      src: PexelsPhotoSrc;
    }) => ({
      id: p.id,
      width: p.width,
      height: p.height,
      url: p.url,
      photographer: p.photographer,
      photographerUrl: p.photographer_url,
      alt: p.alt || "",
      src: p.src,
    })),
  });
}

interface PexelsPhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}
