"use client";

import MonacoEditor, { type OnMount } from "@monaco-editor/react";
import { useCallback, useEffect, useRef } from "react";

function log(msg: string, data?: unknown) {
  console.log(`[dropin:Editor] ${msg}`, data ?? "");
}

type EditorLanguage = "javascript" | "typescript" | "html";

// Imperative API the Editor hands to the parent on mount. We avoid forwardRef
// because `forwardRef` + `next/dynamic` is still flaky in Next 14 (see
// vercel/next.js#16309) — the refs sometimes never resolve. A one-shot
// callback prop sidesteps the dynamic-boundary issue entirely.
export interface EditorHandle {
  insertAtCursor: (text: string) => void;
  // Prepend to the very top of the document. Generic, no parsing.
  insertAtTop: (text: string) => void;
  // HTML-mode "top" — finds `</head>` and inserts the text right before
  // it. Putting the style as the LAST entry in <head> guarantees both:
  //   1. It's parsed inside head (no quirks-mode trigger from style-
  //      before-DOCTYPE).
  //   2. It wins the cascade against any earlier head styles, including
  //      Tailwind's runtime-injected utility sheet.
  // Falls back to `insertAtTop` when the source has no closing head tag.
  insertInHtmlHead: (text: string) => void;
  // JSX-mode "top" — finds `return (\s*(<>|<Tag ...>)` and inserts inside
  // the JSX wrapper. A stray <style /> at the very top of a JSX file is
  // a syntax error since it's outside any JSX expression.
  insertAtJsxRoot: (text: string) => void;
  // Batch edits keyed by byte offset. Used by the OID re-inject path
  // (`Workspace.tsx`) to graft `data-dropin-id="..."` attributes onto JSX
  // pasted mid-session WITHOUT calling `model.setValue` — that would reset
  // Monaco's undo stack and cursor. Internally converts each offset to a
  // Monaco position and runs them as a single `executeEdits` call so the
  // whole batch coalesces into one undo entry.
  applyEditsByOffset: (
    edits: Array<{ pos: number; text: string }>,
    label?: string,
  ) => void;
  // Phase C / B.2 — Per-file viewState capture/restore. Used by the tab UX
  // to preserve cursor + scroll + selection + folding across tab switches.
  // The caller stashes the returned state in a Map<filePath, ViewState>;
  // when switching back, restoreViewState replays the state. Opaque type
  // (unknown) so the consumer doesn't depend on Monaco's IViewState shape
  // — Editor.tsx is the only place that talks to Monaco directly.
  getViewState: () => unknown | null;
  restoreViewState: (state: unknown) => void;
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language: EditorLanguage;
  // Phase C / B.2 — Per-file model swap. @monaco-editor/react's `path` prop
  // creates (or reuses) a Monaco model with this URI. Switching `path` swaps
  // the editor's bound model — the previous model is preserved in memory,
  // so its content + Monaco-internal undo stack survive across tab swaps.
  // Cursor/scroll position are NOT preserved automatically; per-file
  // viewState save/restore is a polish backlog item. v1 single-file
  // projects can omit this prop and Monaco assigns a default URI.
  path?: string;
  onReady?: (handle: EditorHandle) => void;
  // Override Monaco's internal Cmd-Z / Cmd-Shift-Z / Cmd-Y bindings to call
  // these instead. Workspace wires them to useEditHistory's undo/redo so
  // the host's source-level history is the single undo source of truth — no
  // matter whether Monaco is focused. Without these, Monaco's internal stack
  // and the host stack diverge after any non-Monaco edit (dice roll,
  // inspector patcher, library insert, focus-editor commit) because Monaco
  // resets its own stack whenever its `value` prop changes via `setValue`.
  // Keeping Monaco's stack ignored is cheaper than synchronizing both — the
  // host stack already has the granularity we need (300 ms time-coalesced
  // entries, bulk-edit detection).
  onUndoRequest?: () => void;
  onRedoRequest?: () => void;
}

export default function Editor({
  value,
  onChange,
  language,
  path,
  onReady,
  onUndoRequest,
  onRedoRequest,
}: EditorProps) {
  // Keep the latest callbacks on refs so the addCommand registrations done
  // in `handleMount` don't capture a stale closure. Monaco's `addCommand`
  // takes a function reference at registration time and never re-binds —
  // updating these refs from a `useEffect` is the cheap way to keep the
  // commands wired to current callbacks across re-renders.
  const undoRequestRef = useRef<(() => void) | undefined>(onUndoRequest);
  const redoRequestRef = useRef<(() => void) | undefined>(onRedoRequest);
  useEffect(() => {
    undoRequestRef.current = onUndoRequest;
  }, [onUndoRequest]);
  useEffect(() => {
    redoRequestRef.current = onRedoRequest;
  }, [onRedoRequest]);
  // Store the live monaco editor instance so `insertAtCursor` can reach it
  // without running through React state. We also grab the monaco namespace
  // (for the `Range` constructor) because the editor instance alone doesn't
  // expose it.
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);

  const insertAtCursor = useCallback((text: string) => {
    log("insertAtCursor", { textLen: text.length });
    const ed = editorRef.current;
    const mn = monacoRef.current;
    if (!ed || !mn) return;
    const sel =
      ed.getSelection() ?? new mn.Range(1, 1, 1, 1);
    ed.executeEdits("dropin:component-insert", [
      { range: sel, text, forceMoveMarkers: true },
    ]);
    ed.focus();
  }, []);

  const insertAtTop = useCallback((text: string) => {
    log("insertAtTop", { textLen: text.length });
    const ed = editorRef.current;
    const mn = monacoRef.current;
    if (!ed || !mn) return;
    // Insert at line 1 column 1 — pushes existing content down.
    const range = new mn.Range(1, 1, 1, 1);
    ed.executeEdits("dropin:component-insert-top", [
      { range, text: text + "\n", forceMoveMarkers: true },
    ]);
    // Restore cursor to top so the user can see what landed there.
    ed.setPosition({ lineNumber: 1, column: 1 });
    ed.revealLine(1);
    ed.focus();
  }, []);

  const insertInHtmlHead = useCallback(
    (text: string) => {
      log("insertInHtmlHead", { textLen: text.length });
      const ed = editorRef.current;
      const mn = monacoRef.current;
      if (!ed || !mn) return;
      const model = ed.getModel();
      if (!model) return;
      const source = model.getValue();
      const m = /<\/head>/i.exec(source);
      if (!m) {
        log("insertInHtmlHead: no </head> found, falling back to insertAtTop");
        insertAtTop(text);
        return;
      }
      const insertOffset = m.index;
      const insertPos = model.getPositionAt(insertOffset);
      const range = new mn.Range(
        insertPos.lineNumber,
        insertPos.column,
        insertPos.lineNumber,
        insertPos.column
      );
      ed.executeEdits("dropin:component-insert-html-head", [
        { range, text: text + "\n", forceMoveMarkers: true },
      ]);
      ed.setPosition(insertPos);
      ed.revealLine(insertPos.lineNumber);
      ed.focus();
    },
    [insertAtTop]
  );

  const applyEditsByOffset = useCallback(
    (edits: Array<{ pos: number; text: string }>, label?: string) => {
      if (edits.length === 0) return;
      const ed = editorRef.current;
      const mn = monacoRef.current;
      if (!ed || !mn) return;
      const model = ed.getModel();
      if (!model) return;
      log("applyEditsByOffset", { count: edits.length, label });
      const monacoEdits = edits.map(({ pos, text }) => {
        const p = model.getPositionAt(pos);
        return {
          range: new mn.Range(p.lineNumber, p.column, p.lineNumber, p.column),
          text,
          forceMoveMarkers: true,
        };
      });
      // Single `executeEdits` call so Monaco coalesces every insertion into
      // one undo entry. If we ran them in a `forEach` instead, hitting Cmd+Z
      // would back out one OID at a time — surprising behaviour for what is
      // logically a single "stamp OIDs onto pasted source" gesture.
      ed.executeEdits(label ?? "dropin:apply-edits-by-offset", monacoEdits);
    },
    [],
  );

  const getViewState = useCallback((): unknown | null => {
    const ed = editorRef.current;
    if (!ed) return null;
    // Monaco's saveViewState returns ICodeEditorViewState | null. The
    // unknown return type lets the consumer treat it as an opaque blob.
    return ed.saveViewState();
  }, []);

  const restoreViewState = useCallback((state: unknown) => {
    const ed = editorRef.current;
    if (!ed || state == null) return;
    // restoreViewState's signature is restoreViewState(state: ICodeEditorViewState).
    // We took unknown in the EditorHandle to keep the consumer Monaco-free;
    // cast back here at the boundary.
    ed.restoreViewState(state as Parameters<typeof ed.restoreViewState>[0]);
  }, []);

  const insertAtJsxRoot = useCallback(
    (text: string) => {
      log("insertAtJsxRoot", { textLen: text.length });
      const ed = editorRef.current;
      const mn = monacoRef.current;
      if (!ed || !mn) return;
      const model = ed.getModel();
      if (!model) return;
      const source = model.getValue();

      // Find `return (` followed by either a fragment `<>` or a normal
      // opening tag `<Tag ...>`. Insert text right after the opening
      // tag's closing `>` so it becomes the first child inside the JSX
      // wrapper. Limitation: the regex doesn't track `>` inside attribute
      // string literals — pathological cases like
      // `<div onClick={() => alert('>0')}>` would slot the insert at the
      // wrong spot. None of our converted templates do that.
      const re = /return\s*\(\s*(<>|<[A-Za-z][^>]*?>)/;
      const m = re.exec(source);
      if (!m) {
        log("insertAtJsxRoot: no JSX root found, falling back to insertAtCursor");
        insertAtCursor(text);
        return;
      }
      const insertOffset = m.index + m[0].length;
      const insertPos = model.getPositionAt(insertOffset);
      const range = new mn.Range(
        insertPos.lineNumber,
        insertPos.column,
        insertPos.lineNumber,
        insertPos.column
      );
      ed.executeEdits("dropin:component-insert-jsx-root", [
        { range, text: "\n" + text + "\n", forceMoveMarkers: true },
      ]);
      ed.setPosition(insertPos);
      ed.revealLine(insertPos.lineNumber);
      ed.focus();
    },
    [insertAtCursor]
  );

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Override Cmd-Z / Cmd-Shift-Z / Cmd-Y inside Monaco. `addCommand`
    // registers a keybinding that takes precedence over Monaco's defaults;
    // calling the host-supplied callback gives the host stack a single
    // entry point for all undo/redo regardless of focus state. The refs
    // sidestep stale closures across re-renders without re-registering the
    // commands every time the prop identity changes.
    const KeyMod = monaco.KeyMod;
    const KeyCode = monaco.KeyCode;
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyZ, () => {
      log("Monaco Cmd+Z → onUndoRequest");
      undoRequestRef.current?.();
    });
    editor.addCommand(
      KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ,
      () => {
        log("Monaco Cmd+Shift+Z → onRedoRequest");
        redoRequestRef.current?.();
      },
    );
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyY, () => {
      log("Monaco Cmd+Y → onRedoRequest");
      redoRequestRef.current?.();
    });

    monaco.editor.defineTheme("dropin-paper", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "8C847A", fontStyle: "italic" },
        { token: "keyword", foreground: "FF4D2E", fontStyle: "bold" },
        { token: "string", foreground: "0F0F0F" },
        { token: "number", foreground: "FF4D2E" },
        { token: "tag", foreground: "0F0F0F", fontStyle: "bold" },
        { token: "attribute.name", foreground: "8C847A" },
        { token: "attribute.value", foreground: "0F0F0F" },
      ],
      colors: {
        "editor.background": "#F5F1EA",
        "editor.foreground": "#0F0F0F",
        "editorLineNumber.foreground": "#C6BFB0",
        "editorLineNumber.activeForeground": "#0F0F0F",
        "editor.selectionBackground": "#FF4D2E40",
        "editor.lineHighlightBackground": "#EDE6D9",
        "editorCursor.foreground": "#FF4D2E",
        "editorIndentGuide.background1": "#E5DECF",
      },
    });
    monaco.editor.setTheme("dropin-paper");
    onReady?.({
      insertAtCursor,
      insertAtTop,
      insertInHtmlHead,
      insertAtJsxRoot,
      applyEditsByOffset,
      getViewState,
      restoreViewState,
    });
  };

  return (
    <MonacoEditor
      height="100%"
      language={language}
      path={path}
      value={value}
      onChange={(v) => { log("onChange (Monaco)", { len: (v ?? "").length }); onChange(v ?? ""); }}
      onMount={handleMount}
      theme="dropin-paper"
      options={{
        fontFamily: "'JetBrains Mono', Menlo, monospace",
        fontSize: 13,
        lineHeight: 1.7,
        padding: { top: 20, bottom: 20 },
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        renderLineHighlight: "line",
        smoothScrolling: true,
        cursorBlinking: "smooth",
        tabSize: 2,
      }}
    />
  );
}
