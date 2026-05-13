// Public surface of the Phase 2 Step 9 Properties Panel. FocusEditor
// (the only consumer in v1) imports the three sections from here so the
// import block stays tidy.
//
// All three sections are pure presentational — they receive `current`
// (a `Record<string, string>` pulled from `readSourceStyle`) and
// `onCommit` (which routes to `applyStyleProps` in Workspace), and
// render their visual controls. Stateful concerns (link toggles,
// "More" disclosures) live inside each section.

export { default as SizingSection } from "./SizingSection";
export { default as SpacingSection } from "./SpacingSection";
export { default as RadiusSection } from "./RadiusSection";
export type { SizingSectionProps } from "./SizingSection";
export type { SpacingSectionProps } from "./SpacingSection";
export type { RadiusSectionProps } from "./RadiusSection";
