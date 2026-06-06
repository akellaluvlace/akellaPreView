// Unsplash search proxy. Keeps `UNSPLASH_ACCESS_KEY` server-side only and
// adds light caching so repeat queries don't burn the dev key's 50/hour
// allowance. When the key is missing we return a structured 503 the panel
// renders as a friendly "API not configured" empty state — see
// `components/library/asset-panels/sub-panels/UnsplashPanel.tsx`.
//
// Query params:
//   q (string, required)       — search term
//   page (number, default 1)
//   per_page (number, default 24, max 30)
//   orientation (landscape|portrait|squarish, optional)
//
// Cached for 1 hour at the edge / data layer (revalidate: 3600).

import { NextResponse } from "next/server";
import { assetProxyRateLimiter, readClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
// Default — overridable per-request via the `revalidate` arg in `fetch`.
export const revalidate = 3600;

interface UnsplashSearchPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
  urls: { thumb: string; small: string; regular: string; full: string; raw: string };
  links: { html: string; download_location: string };
  user: {
    name: string;
    username: string;
    links: { html: string };
  };
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashSearchPhoto[];
}

function notConfigured() {
  return NextResponse.json(
    {
      configured: false,
      provider: "unsplash",
      setupNote: "Add UNSPLASH_ACCESS_KEY to .env.local, then restart the dev server.",
      signupUrl: "https://unsplash.com/developers",
      docsUrl: "https://unsplash.com/documentation",
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
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return notConfigured();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json({ configured: true, results: [], total: 0, total_pages: 0 });
  }
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const per_page = Math.min(30, Math.max(1, Number(searchParams.get("per_page") || 24)));
  const orientation = searchParams.get("orientation") || "";

  const params = new URLSearchParams({ query: q, page: String(page), per_page: String(per_page) });
  if (orientation === "landscape" || orientation === "portrait" || orientation === "squarish") {
    params.set("orientation", orientation);
  }

  const upstream = `https://api.unsplash.com/search/photos?${params.toString()}`;
  let res: Response;
  try {
    res = await fetch(upstream, {
      headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
      next: { revalidate: 3600 },
      // Don't let a hung upstream pin the serverless function — abort + 502.
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    // Don't echo `String(e)` — undici error messages include the request
    // URL + internal Node error structure. Unsplash's key is in the
    // Authorization header so the URL itself is safe, but the error shape
    // can still expose Node internals + stack hints. Static string for
    // the client, full error to server logs.
    console.error("[unsplash] upstream fetch failed:", e);
    return NextResponse.json(
      { configured: true, error: "upstream-unreachable", detail: "Could not reach Unsplash — check your network connection." },
      { status: 502 }
    );
  }

  if (res.status === 401 || res.status === 403) {
    return NextResponse.json(
      { configured: true, error: "unauthorized", detail: "Unsplash rejected the access key" },
      { status: 401 }
    );
  }
  if (res.status === 429) {
    return NextResponse.json(
      { configured: true, error: "rate-limited", detail: "Unsplash rate limit reached" },
      { status: 429 }
    );
  }
  if (!res.ok) {
    return NextResponse.json(
      { configured: true, error: "upstream-error", status: res.status },
      { status: 502 }
    );
  }

  // Defensive JSON parse — a non-JSON 200 (Cloudflare challenge, proxy HTML)
  // would otherwise throw an opaque 500 the panel can't model.
  let data: UnsplashSearchResponse;
  try {
    data = (await res.json()) as UnsplashSearchResponse;
  } catch (e) {
    console.error("[unsplash] upstream returned non-JSON:", e);
    return NextResponse.json(
      { configured: true, error: "upstream-malformed", detail: "Unsplash returned an unexpected response shape." },
      { status: 502 }
    );
  }

  // Trim the payload to just what the panel needs — keeps the wire payload
  // small and protects us from upstream schema drift leaking client-side.
  const slim = {
    configured: true,
    total: data.total,
    total_pages: data.total_pages,
    results: (data.results || []).map((p) => ({
      id: p.id,
      description: p.description || p.alt_description || "",
      width: p.width,
      height: p.height,
      thumb: p.urls.thumb,
      small: p.urls.small,
      regular: p.urls.regular,
      full: p.urls.full,
      pageUrl: p.links.html,
      downloadLocation: p.links.download_location,
      author: { name: p.user.name, username: p.user.username, profileUrl: p.user.links.html },
    })),
  };

  return NextResponse.json(slim);
}
