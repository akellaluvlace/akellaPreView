// Prod-import test for `lib/rate-limit.ts` (audit MED Domain 2 follow-up).
//
// The rate-limiter was extracted from `app/api/llm-rewrite/route.ts` so
// the bucket-growth fix has direct test coverage. `now` is parametric
// so we drive deterministic time from the test.

import { describe, it, expect, beforeEach } from "vitest";
import {
  createRateLimiter,
  RATE_LIMIT_CONSTANTS,
} from "../lib/rate-limit";

describe("createRateLimiter — basic allow/deny per window", () => {
  it("first call from a fresh IP is allowed", () => {
    const rl = createRateLimiter();
    expect(rl.allow("1.2.3.4", 1000)).toBe(true);
  });

  it("allows up to `limit` calls in the same window", () => {
    const rl = createRateLimiter({ limit: 3, windowMs: 60_000 });
    expect(rl.allow("a", 0)).toBe(true);
    expect(rl.allow("a", 100)).toBe(true);
    expect(rl.allow("a", 200)).toBe(true);
    expect(rl.allow("a", 300)).toBe(false); // 4th — denied
  });

  it("denied calls don't increment the count", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 60_000 });
    expect(rl.allow("a", 0)).toBe(true);
    expect(rl.allow("a", 100)).toBe(true);
    expect(rl.allow("a", 200)).toBe(false);
    expect(rl.allow("a", 300)).toBe(false);
    // The bucket's count should still be 2 (the 2 allowed); not 4.
    const b = rl.buckets().get("a");
    expect(b?.count).toBe(2);
  });

  it("resets the window when first call after resetAt", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.allow("a", 0)).toBe(true);
    expect(rl.allow("a", 100)).toBe(true);
    expect(rl.allow("a", 200)).toBe(false);
    // Window resets at 1000 (resetAt). Calling at 1500 starts a fresh window.
    expect(rl.allow("a", 1500)).toBe(true);
    expect(rl.allow("a", 1600)).toBe(true);
    expect(rl.allow("a", 1700)).toBe(false);
  });

  it("different IPs have independent buckets", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(rl.allow("a", 0)).toBe(true);
    expect(rl.allow("b", 0)).toBe(true); // different IP, separate bucket
    expect(rl.allow("a", 100)).toBe(false);
    expect(rl.allow("b", 100)).toBe(false);
  });
});

describe("createRateLimiter — opportunistic expired-bucket sweep", () => {
  it("opportunistic sweep deletes expired buckets after sweepEveryCalls", () => {
    const rl = createRateLimiter({
      limit: 5,
      windowMs: 1000,
      sweepEveryCalls: 4,
    });

    // Make 3 buckets that will expire by t=2000
    rl.allow("a", 0);
    rl.allow("b", 0);
    rl.allow("c", 0);
    expect(rl.buckets().size).toBe(3);

    // The 4th call (callsSinceSweep === 4) triggers sweep. By then
    // a/b/c have all expired (their resetAt = 1000 < t=2000).
    rl.allow("d", 2000);
    // After sweep: a/b/c deleted (expired), d added (fresh).
    expect(rl.buckets().size).toBe(1);
    expect(rl.buckets().has("d")).toBe(true);
  });

  it("sweep does not delete still-active buckets", () => {
    const rl = createRateLimiter({
      limit: 5,
      windowMs: 60_000,
      sweepEveryCalls: 3,
    });
    rl.allow("a", 0);
    rl.allow("b", 0);
    // 3rd call triggers sweep at t=100 — but both a/b expire at t=60_000,
    // so neither is removed.
    rl.allow("c", 100);
    expect(rl.buckets().size).toBe(3);
  });

  it("explicit sweep() removes expired buckets immediately", () => {
    const rl = createRateLimiter({ limit: 5, windowMs: 1000 });
    rl.allow("a", 0);
    rl.allow("b", 0);
    rl.allow("c", 0);
    expect(rl.buckets().size).toBe(3);
    rl.sweep(2000);
    expect(rl.buckets().size).toBe(0);
  });

  it("explicit sweep() with mixed-state buckets removes only expired", () => {
    const rl = createRateLimiter({ limit: 5, windowMs: 1000 });
    rl.allow("expired", 0);
    rl.allow("alive", 1500);
    expect(rl.buckets().size).toBe(2);
    rl.sweep(1700);
    expect(rl.buckets().size).toBe(1);
    expect(rl.buckets().has("alive")).toBe(true);
    expect(rl.buckets().has("expired")).toBe(false);
  });

  it("sweep counter resets after triggering — next sweep is N more calls away", () => {
    const rl = createRateLimiter({
      limit: 100,
      windowMs: 1000,
      sweepEveryCalls: 3,
    });
    // 3 calls → sweep #1 at the 3rd
    rl.allow("a", 0);
    rl.allow("b", 0);
    rl.allow("c", 100);
    // After sweep, counter resets; need 3 MORE calls to trigger again
    // even though some IPs would be expired.
    rl.allow("d", 5000); // expired counter resets after sweep
    rl.allow("e", 5000);
    // Up to here: 5 total calls; sweep happened at call 3 only.
    // Sweep #2 should be at call 6 (3 since the last sweep).
    // The first 3 are now expired but only "a/b/c/d/e" are in the map.
    // After call-3 sweep at t=100, a/b/c bucket all have resetAt=1000;
    // so they were all alive at sweep time. Now d/e land at t=5000;
    // a/b/c expire at 1000, but no sweep yet.
    expect(rl.buckets().size).toBe(5);
    rl.allow("f", 5000); // 6th call → sweep #2 → a/b/c removed
    expect(rl.buckets().size).toBe(3); // d, e, f
  });
});

describe("createRateLimiter — bucket-state contract", () => {
  it("buckets() returns a stable reference (NOT a copy)", () => {
    const rl = createRateLimiter();
    const m1 = rl.buckets();
    rl.allow("a", 0);
    const m2 = rl.buckets();
    expect(m1).toBe(m2);
  });

  it("reset() clears all buckets", () => {
    const rl = createRateLimiter();
    rl.allow("a", 0);
    rl.allow("b", 0);
    expect(rl.buckets().size).toBe(2);
    rl.reset();
    expect(rl.buckets().size).toBe(0);
  });

  it("reset() also resets the sweep call counter", () => {
    const rl = createRateLimiter({
      limit: 100,
      windowMs: 1000,
      sweepEveryCalls: 2,
    });
    rl.allow("a", 0);
    // 1 call so far. After reset, the counter is 0 again. Need 2 more
    // to trigger a sweep.
    rl.reset();
    rl.allow("b", 5000); // counter = 1
    rl.allow("c", 5000); // counter = 2 → sweep triggers
    // No expired buckets to remove (b/c just landed); size unchanged.
    expect(rl.buckets().size).toBe(2);
  });

  it("bucket count + resetAt are well-formed", () => {
    const rl = createRateLimiter({ limit: 5, windowMs: 60_000 });
    rl.allow("a", 1000);
    rl.allow("a", 1100);
    rl.allow("a", 1200);
    const b = rl.buckets().get("a");
    expect(b?.count).toBe(3);
    expect(b?.resetAt).toBe(61_000); // 1000 + 60_000 (set on first call only)
  });
});

describe("createRateLimiter — edge cases", () => {
  it("opts merge: default values fill in unspecified fields", () => {
    const rl = createRateLimiter({ limit: 3 });
    rl.allow("a", 0);
    rl.allow("a", 100);
    rl.allow("a", 200);
    expect(rl.allow("a", 300)).toBe(false); // limit=3 respected
    // Still uses default 60_000ms window
    expect(rl.allow("a", 30_000)).toBe(false);
    expect(rl.allow("a", 60_001)).toBe(true);
  });

  it("zero-length window denies everything past the first call", () => {
    const rl = createRateLimiter({ limit: 3, windowMs: 0 });
    expect(rl.allow("a", 1000)).toBe(true);
    // Bucket's resetAt = 1000 + 0 = 1000. Next call at t=1000 is at
    // the boundary; resetAt <= now is true so a fresh bucket is made.
    expect(rl.allow("a", 1000)).toBe(true);
    // Same window now (resetAt=1000); next call > now triggers reset
    expect(rl.allow("a", 1001)).toBe(true);
  });

  it("constants pin the route's defaults", () => {
    expect(RATE_LIMIT_CONSTANTS.DEFAULT_LIMIT).toBe(5);
    expect(RATE_LIMIT_CONSTANTS.DEFAULT_WINDOW_MS).toBe(60_000);
    expect(RATE_LIMIT_CONSTANTS.DEFAULT_SWEEP_EVERY_CALLS).toBe(64);
  });
});

describe("createRateLimiter — instances are independent", () => {
  it("two limiters maintain separate state", () => {
    const a = createRateLimiter({ limit: 1, windowMs: 60_000 });
    const b = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(a.allow("ip", 0)).toBe(true);
    expect(a.allow("ip", 100)).toBe(false);
    expect(b.allow("ip", 200)).toBe(true); // separate limiter
  });
});
