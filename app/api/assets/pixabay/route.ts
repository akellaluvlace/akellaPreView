// Pixabay photo search proxy. Same key-gating + setup-card empty state
// pattern as Unsplash + Pexels. Pixabay's auth model is a `key` query
// parameter (not a header), which we keep server-side via this proxy
// so the key never reaches the client bundle.
//
// CC0-equivalent license — attribution preferred but not required. We
// still emit attribution comments on insert as a courtesy. The free
// tier exposes previewURL / webformatURL / largeImageURL; the full
// `imageURL` field is gated behind a premium plan and isn't surfaced.
//
// Query params:
//   q (string, required)       — search term
//   page (number, default 1)
//   per_page (number, default 24, max 200)
//   orientation (horizontal|vertical, optional)
//
// Cached for 1 hour at the data layer (revalidate: 3600).

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

function notConfigured() {
  return NextResponse.json(
    {
      configured: false,
      provider: "pixabay",
      setupNote: "Add PIXABAY_API_KEY to .env.local, then restart the dev server.",
      signupUrl: "https://pixabay.com/api/docs/",
      docsUrl: "https://pixabay.com/api/docs/",
    },
    { status: 503 },
  );
}

interface PixabayHit {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  user: string;
  user_id: number;
}

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayHit[];
}

export async function GET(req: Request) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return notConfigured();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json({
      configured: true,
      total: 0,
      totalHits: 0,
      hits: [],
    });
  }
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const per_page = Math.min(
    200,
    Math.max(3, Number(searchParams.get("per_page") || 24)),
  );
  const orientation = searchParams.get("orientation") || "";

  const params = new URLSearchParams({
    key,
    q,
    image_type: "photo",
    safesearch: "true",
    page: String(page),
    per_page: String(per_page),
  });
  if (orientation === "horizontal" || orientation === "vertical") {
    params.set("orientation", orientation);
  }

  const upstream = `https://pixabay.com/api/?${params.toString()}`;
  let res: Response;
  try {
    res = await fetch(upstream, { next: { revalidate: 3600 } });
  } catch (e) {
    // Critical: NEVER include the raw error message verbatim. Node's
    // undici fetch error message includes the offending URL with the
    // full query string — `key=PIXABAY_KEY` would leak to the client.
    // Log server-side for debugging; surface a static string to the
    // caller. Same pattern as F1/F9 in the prior audit.
    console.error("[pixabay] upstream fetch failed", e);
    return NextResponse.json(
      {
        configured: true,
        error: "upstream-unreachable",
        detail: "Could not reach Pixabay — check your network connection.",
      },
      { status: 502 },
    );
  }

  if (res.status === 400) {
    // Pixabay returns 400 for invalid key (no separate 401). Read the
    // body ONCE here — we can't fall through to the body-reading paths
    // below without re-reading a consumed stream.
    const text = await res.text();
    if (/invalid api key/i.test(text)) {
      return NextResponse.json(
        { configured: true, error: "unauthorized", detail: "Pixabay rejected the API key" },
        { status: 401 },
      );
    }
    // 400 for any other reason (bad `q`, unsupported param, etc.).
    // Don't leak the upstream body verbatim — it can echo query params
    // or include unbounded debug info. Truncate + label.
    return NextResponse.json(
      {
        configured: true,
        error: "bad-request",
        detail: text.slice(0, 200),
      },
      { status: 400 },
    );
  }
  if (res.status === 429) {
    return NextResponse.json(
      { configured: true, error: "rate-limited", detail: "Pixabay rate limit reached" },
      { status: 429 },
    );
  }
  if (!res.ok) {
    return NextResponse.json(
      { configured: true, error: "upstream-error", status: res.status },
      { status: 502 },
    );
  }

  // Defensive JSON parse — if Pixabay or an intermediary (Cloudflare,
  // proxy) returns non-JSON (e.g. an HTML challenge page), .json()
  // throws SyntaxError and the route 500s with no useful info. Catch
  // explicitly + surface a clear shape to the caller.
  let data: PixabayResponse;
  try {
    data = (await res.json()) as PixabayResponse;
  } catch (e) {
    console.error("[pixabay] upstream returned non-JSON", e);
    return NextResponse.json(
      {
        configured: true,
        error: "upstream-malformed",
        detail: "Pixabay returned an unexpected response shape.",
      },
      { status: 502 },
    );
  }

  // Slim shape — only what PixabayPanel + buildPixabayInsert need.
  // imageWidth/imageHeight describe the FULL original (used for the
  // intrinsic dimensions of the <img> we emit, even though we link to
  // the largeImageURL at most).
  return NextResponse.json({
    configured: true,
    total: data.total,
    totalHits: data.totalHits,
    hits: (data.hits || []).map((h) => ({
      id: String(h.id),
      tags: h.tags,
      width: h.imageWidth,
      height: h.imageHeight,
      preview: h.previewURL,
      webformat: h.webformatURL,
      large: h.largeImageURL,
      pageUrl: h.pageURL,
      author: {
        name: h.user,
        profileUrl: `https://pixabay.com/users/${encodeURIComponent(h.user)}-${h.user_id}/`,
      },
    })),
  });
}
