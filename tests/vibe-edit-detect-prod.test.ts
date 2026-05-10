import { describe, it, expect } from "vitest";
import {
  isCardLike,
  hasBackground,
  hasRounding,
  hasShadow,
  hasBorder,
  parseRadiusPx,
} from "../lib/vibe-edit/detect";
import type { VibeElementInfo } from "../lib/vibe-edit/types";

function info(over: Partial<VibeElementInfo>): VibeElementInfo {
  return {
    path: "div",
    htmlPath: [1, 0],
    oid: null,
    tag: "div",
    kind: "container",
    text: "",
    src: null,
    alt: null,
    href: null,
    textColor: "",
    bgColor: "",
    borderRadius: "",
    inlineStyle: "",
    classes: "",
    ...over,
  };
}

describe("isCardLike", () => {
  it("returns false for non-container kinds", () => {
    expect(isCardLike(info({ kind: "text", classes: "bg-white rounded-lg" }))).toBe(false);
    expect(isCardLike(info({ kind: "image", bgColor: "rgb(255, 0, 0)" }))).toBe(false);
  });

  it("detects bg via Tailwind class", () => {
    expect(isCardLike(info({ classes: "bg-white" }))).toBe(true);
    expect(isCardLike(info({ classes: "p-4 bg-slate-100 rounded" }))).toBe(true);
    expect(isCardLike(info({ classes: "bg-[#fff]" }))).toBe(true);
  });

  it("detects bg via inline style", () => {
    expect(isCardLike(info({ inlineStyle: "background-color: red;" }))).toBe(true);
    expect(isCardLike(info({ inlineStyle: "background: linear-gradient(...);" }))).toBe(true);
  });

  it("detects bg via computed bgColor", () => {
    expect(isCardLike(info({ bgColor: "rgb(255, 255, 255)" }))).toBe(true);
  });

  it("treats transparent / rgba(0,0,0,0) as no bg", () => {
    expect(isCardLike(info({ bgColor: "transparent" }))).toBe(false);
    expect(isCardLike(info({ bgColor: "rgba(0, 0, 0, 0)" }))).toBe(false);
    expect(isCardLike(info({ bgColor: "" }))).toBe(false);
  });

  it("detects rounding via Tailwind class", () => {
    expect(isCardLike(info({ classes: "rounded" }))).toBe(true);
    expect(isCardLike(info({ classes: "rounded-lg" }))).toBe(true);
    expect(isCardLike(info({ classes: "rounded-[12px]" }))).toBe(true);
    expect(isCardLike(info({ classes: "p-4 rounded-md text-blue-500" }))).toBe(true);
  });

  it("detects rounding via computed borderRadius", () => {
    expect(isCardLike(info({ borderRadius: "8px" }))).toBe(true);
    expect(isCardLike(info({ borderRadius: "0px" }))).toBe(false);
    expect(isCardLike(info({ borderRadius: "" }))).toBe(false);
  });

  it("detects shadow via class or inline", () => {
    expect(isCardLike(info({ classes: "shadow" }))).toBe(true);
    expect(isCardLike(info({ classes: "shadow-md" }))).toBe(true);
    expect(isCardLike(info({ inlineStyle: "box-shadow: 0 1px 3px rgba(0,0,0,0.1);" }))).toBe(true);
  });

  it("detects border via class or inline", () => {
    expect(isCardLike(info({ classes: "border" }))).toBe(true);
    expect(isCardLike(info({ classes: "border-2 border-red-500" }))).toBe(true);
    expect(isCardLike(info({ inlineStyle: "border: 1px solid red;" }))).toBe(true);
  });

  it("returns false for plain wrapper container", () => {
    expect(isCardLike(info({ classes: "flex items-center" }))).toBe(false);
    expect(isCardLike(info({ classes: "" }))).toBe(false);
    expect(isCardLike(info({ classes: "p-4 mx-auto" }))).toBe(false);
  });
});

describe("parseRadiusPx", () => {
  it("returns 0 for empty / non-px", () => {
    expect(parseRadiusPx("")).toBe(0);
    expect(parseRadiusPx("0px")).toBe(0);
    expect(parseRadiusPx("1rem")).toBe(0);
    expect(parseRadiusPx("auto")).toBe(0);
  });

  it("parses single value", () => {
    expect(parseRadiusPx("8px")).toBe(8);
    expect(parseRadiusPx("12.5px")).toBe(13);
  });

  it("parses first value of multi-corner shorthand", () => {
    expect(parseRadiusPx("8px 12px 16px 4px")).toBe(8);
    expect(parseRadiusPx("4px 8px")).toBe(4);
  });
});

describe("hasBackground / hasRounding / hasShadow / hasBorder", () => {
  it("hasBackground decisions", () => {
    expect(hasBackground(info({}))).toBe(false);
    expect(hasBackground(info({ classes: "bg-white" }))).toBe(true);
    expect(hasBackground(info({ inlineStyle: "background: red" }))).toBe(true);
    expect(hasBackground(info({ bgColor: "rgb(0,0,0)" }))).toBe(true);
  });

  it("hasRounding decisions", () => {
    expect(hasRounding(info({}))).toBe(false);
    expect(hasRounding(info({ classes: "rounded-md" }))).toBe(true);
    expect(hasRounding(info({ borderRadius: "4px" }))).toBe(true);
    expect(hasRounding(info({ borderRadius: "0px" }))).toBe(false);
  });

  it("hasShadow decisions", () => {
    expect(hasShadow(info({}))).toBe(false);
    expect(hasShadow(info({ classes: "shadow-lg" }))).toBe(true);
    expect(hasShadow(info({ inlineStyle: "box-shadow: 0 0 0 1px red" }))).toBe(true);
  });

  it("hasBorder decisions", () => {
    expect(hasBorder(info({}))).toBe(false);
    expect(hasBorder(info({ classes: "border-2" }))).toBe(true);
    expect(hasBorder(info({ classes: "border-red-500" }))).toBe(true);
    expect(hasBorder(info({ inlineStyle: "border-color: red" }))).toBe(true);
  });
});
