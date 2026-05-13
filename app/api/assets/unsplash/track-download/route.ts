// Unsplash API guidelines require us to hit the photo's `download_location`
// URL whenever a user actually inserts/uses the image — distinct from a
// search response. The host page is sandboxed inside an iframe, so we can't
// easily call Unsplash directly from the editor without exposing the access
// key; this route proxies the ping and stays fire-and-forget.
//
// Body: { downloadLocation: string }
// Returns: { ok: true } on success, structured 503 if not configured.

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json(
      { configured: false, provider: "unsplash" },
      { status: 503 }
    );
  }

  let body: { downloadLocation?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-body" }, { status: 400 });
  }
  const url = body.downloadLocation;
  // Only allow Unsplash URLs through — guards against arbitrary URL pings.
  if (typeof url !== "string" || !/^https:\/\/api\.unsplash\.com\//.test(url)) {
    return NextResponse.json({ ok: false, error: "invalid-url" }, { status: 400 });
  }

  try {
    await fetch(url, {
      headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
    });
  } catch {
    // Tracking is best-effort. Swallow and return ok so the insert path
    // never blocks on a transient network error.
  }
  return NextResponse.json({ ok: true });
}
