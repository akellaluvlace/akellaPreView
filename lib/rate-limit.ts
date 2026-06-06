// Audit MED (Domain 2) — Rate-limit primitive with opportunistic
// expired-bucket sweep.
//
// Pre-fix the route's `buckets` Map grew one entry per unique IP for
// the lifetime of the Node process. Fine for single-region single-user
// deployments; accumulates with broad traffic / scanners. The sweep is
// amortized: every Nth call runs an O(buckets.size) walk to delete
// expired entries, so steady-state cost is O(1) per sweep tick. No
// setInterval — server-rendered routes don't get long-lived timers in
// dev/HMR; opportunistic sweep is restart-safe.
//
// Pure-logic — `now` is passed in instead of read from `Date.now()` so
// tests can drive deterministic time. The route's wrapper (`rateLimitOk`)
// supplies `Date.now()`.

export interface RateLimiterOpts {
  // Per-window allowance.
  readonly limit: number;
  // Window length in ms. After this many ms since the first call in a
  // window, the bucket resets.
  readonly windowMs: number;
  // Sweep cadence: every N `allow()` calls, walk the Map and delete
  // expired entries. Tradeoff: lower = tighter memory bound, more CPU;
  // higher = more memory headroom, less CPU.
  readonly sweepEveryCalls: number;
}

export interface RateLimiterBucket {
  count: number;
  // Wall-clock ms at which this bucket should be considered expired.
  resetAt: number;
}

export interface RateLimiter {
  // Returns true if the IP should be allowed; false if it's over the
  // per-window limit. Mutates internal state.
  allow(ip: string, now: number): boolean;
  // Force a sweep at the given wall-clock time. Used by callers that
  // want explicit control (tests + future periodic runners).
  sweep(now: number): void;
  // Snapshot of the current bucket state. Returned by reference for
  // tests; do NOT mutate from outside the module.
  buckets(): ReadonlyMap<string, RateLimiterBucket>;
  // Reset the limiter to empty state. Tests use this between cases;
  // the route's default singleton never calls it.
  reset(): void;
}

const DEFAULT_OPTS: RateLimiterOpts = {
  limit: 5,
  windowMs: 60_000,
  sweepEveryCalls: 64,
};

export function createRateLimiter(
  opts: Partial<RateLimiterOpts> = {},
): RateLimiter {
  const merged: RateLimiterOpts = { ...DEFAULT_OPTS, ...opts };
  const map = new Map<string, RateLimiterBucket>();
  let callsSinceSweep = 0;

  function sweep(now: number): void {
    for (const [ip, bucket] of map) {
      if (bucket.resetAt <= now) map.delete(ip);
    }
  }

  return {
    allow(ip: string, now: number): boolean {
      callsSinceSweep++;
      if (callsSinceSweep >= merged.sweepEveryCalls) {
        sweep(now);
        callsSinceSweep = 0;
      }
      const cur = map.get(ip);
      if (!cur || cur.resetAt <= now) {
        map.set(ip, { count: 1, resetAt: now + merged.windowMs });
        return true;
      }
      if (cur.count >= merged.limit) return false;
      cur.count += 1;
      return true;
    },
    sweep,
    buckets: () => map,
    reset: () => {
      map.clear();
      callsSinceSweep = 0;
    },
  };
}

// Process-wide singleton used by the route. Module-scope state survives
// across invocations as long as the Node process lives — same as the
// pre-fix `buckets` Map. NOT exported for direct manipulation; callers
// go through `defaultRateLimiter.allow(ip, now)`.
export const defaultRateLimiter = createRateLimiter();

// Shared limiter for the PUBLIC asset proxies (Pixabay / Unsplash / Pexels +
// Unsplash download tracking). Looser than the 5/min default because image
// search legitimately bursts (pagination / shuffle), but still bounds a single
// IP from draining the owner's free-tier provider key (Unsplash dev = 50/hr).
// 30 requests / minute / IP.
export const assetProxyRateLimiter = createRateLimiter({
  limit: 30,
  windowMs: 60_000,
});

// Best-effort client IP for rate-limiting. Prefer x-real-ip — on Vercel / most
// reverse proxies this is the platform-injected connecting IP, which the client
// cannot forge. The FIRST x-forwarded-for value IS client-controllable (a
// client can prepend a fake hop to reset its bucket), so only fall back to it
// when x-real-ip is absent. (2026-05-26 audit #5.)
export function readClientIp(req: Request): string {
  const real = req.headers.get("x-real-ip");
  if (real && real.trim()) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

// Constants exported for tests + observability.
export const RATE_LIMIT_CONSTANTS = {
  DEFAULT_LIMIT: DEFAULT_OPTS.limit,
  DEFAULT_WINDOW_MS: DEFAULT_OPTS.windowMs,
  DEFAULT_SWEEP_EVERY_CALLS: DEFAULT_OPTS.sweepEveryCalls,
} as const;
