import { describe, it, expect } from "vitest";
import { extractCodeFence } from "../lib/byo-ai/extract-code";

describe("extractCodeFence — fence extraction", () => {
  it("extracts ```jsx-fenced code with chatty preamble", () => {
    const input = `Sure! Here's your updated component:

\`\`\`jsx
<button className="rounded-full bg-fuchsia-500 px-6 py-3">Click me</button>
\`\`\`

Let me know if you want adjustments!`;
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toContain('className="rounded-full');
    expect(result.code).not.toContain("Sure!");
    expect(result.code).not.toContain("Let me know");
  });

  it("extracts ```html-fenced code", () => {
    const input = "```html\n<div>hi</div>\n```";
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toBe("<div>hi</div>");
  });

  it("extracts unlabeled ``` fences (no language tag)", () => {
    const input = "```\n<div>hi</div>\n```";
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toBe("<div>hi</div>");
  });

  it("extracts ```tsx fences", () => {
    const input = "```tsx\nconst x: number = 1;\n```";
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toContain("const x: number");
  });

  it("extracts ```javascript fences", () => {
    const input = "```javascript\nconst x = 1;\n```";
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toContain("const x");
  });

  it("returns the FIRST fence when multiple are present", () => {
    const input = `Here are two options:

\`\`\`jsx
<button>option one</button>
\`\`\`

Or you could try:

\`\`\`jsx
<button>option two</button>
\`\`\``;
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toContain("option one");
    expect(result.code).not.toContain("option two");
  });

  it("handles multiline code with nested tags", () => {
    const input = `\`\`\`jsx
<div className="hero">
  <h1>Welcome</h1>
  <p>Lorem ipsum dolor sit amet.</p>
</div>
\`\`\``;
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toContain("<h1>Welcome</h1>");
    expect(result.code).toContain("Lorem ipsum");
  });
});

describe("extractCodeFence — fallback paths", () => {
  it("returns raw input trimmed when no fence is present", () => {
    const input = "   <div>just raw code</div>   ";
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(false);
    expect(result.code).toBe("<div>just raw code</div>");
  });

  it("returns raw input when fence is malformed (no closing)", () => {
    const input = "```jsx\n<div>oops no closing</div>";
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(false);
    expect(result.code).toContain("<div>oops no closing</div>");
  });

  it("returns empty when input is empty", () => {
    const result = extractCodeFence("");
    expect(result.hadFence).toBe(false);
    expect(result.code).toBe("");
  });

  it("returns empty when input is only whitespace", () => {
    const result = extractCodeFence("   \n   \n   ");
    expect(result.hadFence).toBe(false);
    expect(result.code).toBe("");
  });
});

describe("extractCodeFence — real-world frontier-model outputs", () => {
  it("handles Claude's typical 'Here is your updated...' shape", () => {
    const input = `Here is your updated button styled to match the reference design:

\`\`\`jsx
<button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-3 text-white shadow-xl hover:scale-105 transition-transform">
  Get Started
</button>
\`\`\`

I've kept the "Get Started" text and applied the reference's gradient + rounded-full + padding styles while removing the old stone-200 chrome. Let me know if you want any adjustments!`;
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toContain("Get Started");
    expect(result.code).toContain("gradient-to-r");
    expect(result.code).not.toContain("I've kept");
  });

  it("handles GPT's typical multi-paragraph preamble", () => {
    const input = `I'll update the element to match the reference style while keeping the content.

Here's the updated file:

\`\`\`jsx
import React from 'react';

export default function App() {
  return (
    <div>
      <button className="new-style">Click me</button>
    </div>
  );
}
\`\`\`

The key changes I made:
- Replaced the old button classes with the reference's
- Kept the "Click me" text
- Maintained the parent div structure`;
    const result = extractCodeFence(input);
    expect(result.hadFence).toBe(true);
    expect(result.code).toContain("export default function App");
    expect(result.code).not.toContain("The key changes");
  });
});
