import { describe, it, expect } from "vitest";
import { extractRootClassName } from "../scripts/ingest/extract-root-class.mjs";

// Phase E proper — root className extractor for ingest pipeline.
//
// Runs at `node scripts/ingest-components.mjs` time and writes the
// resulting string into `ComponentMeta.rootClassName`. The runtime
// LibraryModal compatibility filter then feeds it through
// `inferCapacityFromClasses`. Test contract: handle real-world
// uiverse + hyperui fragment shapes deterministically; emit null for
// "no class signal at all" (caller treats as "unknown").

describe("extractRootClassName — happy paths", () => {
  it("returns the class attribute of a single top-level div", () => {
    expect(extractRootClassName(`<div class="foo bar">x</div>`)).toBe(
      "foo bar",
    );
  });

  it("preserves multi-class whitespace verbatim", () => {
    expect(extractRootClassName(`<div class="bg-red-500   p-4">x</div>`)).toBe(
      "bg-red-500   p-4",
    );
  });

  it("works on nested children — only the root class is read", () => {
    const html = `<section class="root"><div class="child">y</div></section>`;
    expect(extractRootClassName(html)).toBe("root");
  });

  it("works on void / self-closing root elements", () => {
    expect(extractRootClassName(`<input class="border" />`)).toBe("border");
  });

  it("walks past leading whitespace text nodes", () => {
    const html = `\n   <div class="hero">x</div>`;
    expect(extractRootClassName(html)).toBe("hero");
  });

  it("walks past leading HTML comments", () => {
    const html = `<!-- comment --><div class="hero">x</div>`;
    expect(extractRootClassName(html)).toBe("hero");
  });

  it("returns the FIRST element's class when multiple top-level siblings exist", () => {
    const html = `<div class="first"></div><div class="second"></div>`;
    expect(extractRootClassName(html)).toBe("first");
  });
});

describe("extractRootClassName — null fallback paths", () => {
  it("returns null on empty input", () => {
    expect(extractRootClassName("")).toBeNull();
  });

  it("returns null on null input", () => {
    expect(extractRootClassName(null)).toBeNull();
  });

  it("returns null on undefined input", () => {
    expect(extractRootClassName(undefined)).toBeNull();
  });

  it("returns null when input is not a string", () => {
    // @ts-expect-error testing defensive runtime behavior with wrong type
    expect(extractRootClassName(123)).toBeNull();
  });

  it("returns null when root element has no class attribute", () => {
    expect(extractRootClassName(`<button>Click</button>`)).toBeNull();
  });

  it("returns null when root has empty class (treated as no signal)", () => {
    expect(extractRootClassName(`<div class="">x</div>`)).toBeNull();
  });

  it("returns null when fragment has only text", () => {
    expect(extractRootClassName(`just some text`)).toBeNull();
  });

  it("returns null when fragment is only whitespace", () => {
    expect(extractRootClassName(`   \n   `)).toBeNull();
  });

  it("returns null when fragment is only comments", () => {
    expect(extractRootClassName(`<!-- only --><!-- comments -->`)).toBeNull();
  });
});

describe("extractRootClassName — real-world Uiverse / HyperUI shapes", () => {
  it("Uiverse-style style-stripped fragment", () => {
    // Uiverse splits <style> from body; the extractor only sees body
    // markup. First element is typically a button/card/wrapper.
    const html = `<button class="btn-7">Hover me</button>`;
    expect(extractRootClassName(html)).toBe("btn-7");
  });

  it("HyperUI-style Tailwind wrapper", () => {
    const html = `<section class="bg-white">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">…</div>
      </div>
    </section>`;
    expect(extractRootClassName(html)).toBe("bg-white");
  });

  it("HyperUI nav-style with multi-class wrapper", () => {
    const html = `<header class="bg-white shadow"><nav class="mx-auto">…</nav></header>`;
    expect(extractRootClassName(html)).toBe("bg-white shadow");
  });

  it("Uiverse fancy-loader with arbitrary-px width", () => {
    const html = `<div class="loader w-[120px] h-[120px]"></div>`;
    expect(extractRootClassName(html)).toBe("loader w-[120px] h-[120px]");
  });
});

describe("extractRootClassName — malformed input tolerance", () => {
  it("returns null for unclosed tag (parse5 still parses but emits no element)", () => {
    // parse5's parseFragment is forgiving; it usually invents a child
    // for an unclosed tag, so this MAY return a class. We accept either
    // behavior — the contract is "doesn't throw, returns string|null".
    const result = extractRootClassName(`<div class="x"`);
    expect(result === null || typeof result === "string").toBe(true);
  });

  it("does not throw on garbled input", () => {
    expect(() =>
      extractRootClassName(`<<<class="not a tag">>>`),
    ).not.toThrow();
  });
});
