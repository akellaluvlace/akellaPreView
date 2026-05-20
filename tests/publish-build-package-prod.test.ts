// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { buildPublishPackage } from "../lib/publish/build-package";

describe("buildPublishPackage — HTML mode", () => {
  it("ships the source as index.html when kind=html", async () => {
    const code = `<!DOCTYPE html><html><body><h1>My site</h1></body></html>`;
    const result = buildPublishPackage({
      code,
      kind: "html",
      filename: "my-template",
    });
    expect(result.mode).toBe("source");
    expect(result.warnings).toEqual([]);
    expect(result.zipFilename).toBe("my-template.zip");
    // Decode zip bytes; STORED format means content appears verbatim.
    const bytes = new Uint8Array(await result.blob.arrayBuffer());
    const decoded = new TextDecoder().decode(bytes);
    expect(decoded).toContain("<h1>My site</h1>");
    expect(decoded).toContain("index.html");
    expect(decoded).toContain("README.md");
  });

  it("slugifies the filename (spaces + special chars → kebab)", async () => {
    const r = buildPublishPackage({
      code: "<html></html>",
      kind: "html",
      filename: "My Cool Template!!!",
    });
    expect(r.zipFilename).toBe("my-cool-template.zip");
  });

  it("falls back to dropin-site for empty filename", async () => {
    const r = buildPublishPackage({
      code: "<html></html>",
      kind: "html",
      filename: "",
    });
    expect(r.zipFilename).toBe("dropin-site.zip");
  });

  it("strips OIDs defensively (idempotent on HTML mode)", async () => {
    // HTML mode shouldn't have OIDs but the helper should run anyway.
    const r = buildPublishPackage({
      code: `<!DOCTYPE html><html><body><h1>Hi</h1></body></html>`,
      kind: "html",
      filename: "x",
    });
    const decoded = new TextDecoder().decode(
      new Uint8Array(await r.blob.arrayBuffer()),
    );
    expect(decoded).not.toContain("data-dropin-id");
  });
});

describe("buildPublishPackage — JSX mode", () => {
  it("uses iframeHtml when provided + sanitizes it", async () => {
    const iframeHtml = `<!DOCTYPE html><html><body>
      <div data-dropin-id="x1" data-dropin-selected="">Hi</div>
      <script>var DROPIN_MODE = "jsx";</script>
    </body></html>`;
    const r = buildPublishPackage({
      code: "export default function X() { return <div>Hi</div>; }",
      kind: "jsx",
      filename: "x",
      iframeHtml,
    });
    expect(r.mode).toBe("snapshot");
    expect(r.warnings).toEqual([]);
    const decoded = new TextDecoder().decode(
      new Uint8Array(await r.blob.arrayBuffer()),
    );
    expect(decoded).not.toContain("data-dropin-id");
    expect(decoded).not.toContain("data-dropin-selected");
    expect(decoded).not.toContain("DROPIN_MODE");
    expect(decoded).toContain("Hi");
  });

  it("falls back to source-only with a warning when iframeHtml is missing", async () => {
    const r = buildPublishPackage({
      code: "export default function X() { return <div>Hi</div>; }",
      kind: "jsx",
      filename: "x",
    });
    expect(r.mode).toBe("source");
    expect(r.warnings.length).toBe(1);
    expect(r.warnings[0]).toMatch(/couldn't capture/i);
  });

  it("falls back to source-only when iframeHtml is suspiciously short", async () => {
    const r = buildPublishPackage({
      code: "export default function X() { return <div>Hi</div>; }",
      kind: "jsx",
      filename: "x",
      iframeHtml: "<html>x</html>", // 14 chars — under the 50-char threshold
    });
    expect(r.mode).toBe("source");
    expect(r.warnings.length).toBe(1);
  });
});

describe("buildPublishPackage — README inclusion", () => {
  it("always includes a README.md alongside index.html", async () => {
    const r = buildPublishPackage({
      code: "<html></html>",
      kind: "html",
      filename: "x",
    });
    const decoded = new TextDecoder().decode(
      new Uint8Array(await r.blob.arrayBuffer()),
    );
    expect(decoded).toContain("README.md");
    expect(decoded).toContain("Netlify Drop");
    expect(decoded).toContain("https://app.netlify.com/drop");
  });

  it("README mentions all three hosting options", async () => {
    const r = buildPublishPackage({
      code: "<html></html>",
      kind: "html",
      filename: "x",
    });
    const decoded = new TextDecoder().decode(
      new Uint8Array(await r.blob.arrayBuffer()),
    );
    expect(decoded).toContain("Netlify");
    expect(decoded).toContain("Vercel");
    // "anywhere else" section — static host pattern.
    expect(decoded).toMatch(/GitHub Pages|Cloudflare Pages|S3/);
  });
});
