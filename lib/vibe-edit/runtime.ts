// Iframe-side runtime for the vibe-edit flow. Emitted as a JS string
// that lives inside the same script tag as inspectorRuntimeJs in
// lib/preview.ts so they share a global scope (and the same
// parent.postMessage channel via dropinPost).
//
// The runtime exposes:
//   - VIBE_EDITABLE selector for click gating
//   - vibeSelect / vibeClear DOM marking + selection broadcast
//   - vibeSerialize: read element + emit VibeElementInfo (path,
//     htmlPath, oid, tag, kind, text, src, alt, href, textColor,
//     bgColor) - mirrors lib/vibe-edit/types.ts shape
//   - 4 host-to-iframe message handlers for direct DOM mutation:
//     vibe:update-content, vibe:update-style, vibe:update-image,
//     vibe:update-link
//
// CRITICAL traps (per memory/project_ts_template_*):
//   1. NO backticks anywhere in this template string - they would
//      close the outer `...` template literal in lib/preview.ts at
//      parse time. Use single quotes everywhere, even in comments
//      inside the emitted JS.
//   2. Backslashes need DOUBLE escaping in regex literals: a literal
//      backslash inside the emitted JS regex needs '\\\\'.
//   3. The runtime is plain ES5/ES6 - no TypeScript syntax (it's
//      executed by the iframe's JS engine after toString).
//
// Mirrors MoodScape's editorScript.ts behaviour with our message
// envelope (parent.postMessage with __dropin: true brand) instead
// of MoodScape's plain envelope.

export function vibeRuntimeJs(): string {
  return `
    var VIBE_EDITABLE = 'h1,h2,h3,h4,h5,h6,p,span,li,blockquote,small,figcaption,td,th,label,strong,em,code,pre,a,button,img,svg';
    var VIBE_TEXT_TAG_SET = {
      h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1,
      p: 1, span: 1, li: 1, blockquote: 1, small: 1,
      figcaption: 1, td: 1, th: 1, label: 1,
      strong: 1, em: 1, code: 1, pre: 1
    };
    var vibeSelected = null;

    function vibeIsEditable(el) {
      return el && el.matches && el.matches(VIBE_EDITABLE);
    }

    // Walk up from el looking for a button or card-like ancestor
    // within maxDepth levels. Used by vibeFindEditableAncestor to
    // override a span-first match with the spans parent intent — the
    // dominant real-template pattern is <button><span>Label</span>
    // </button> or <div class="card"><span class="badge">NEW</span>
    // </div> where the user wants the parent, not the label/badge.
    // Stops at body/documentElement to avoid walking into doc root.
    // Returns the ancestor or null.
    function vibeFindButtonOrCardAncestorWithin(el, maxDepth) {
      var cur = el && el.parentElement;
      var depth = 0;
      while (
        cur &&
        depth < maxDepth &&
        cur !== document.body &&
        cur !== document.documentElement
      ) {
        if (cur.tagName === 'BUTTON') return cur;
        // Use vibeHasCardChrome (not vibeIsCardLike) so a span inside
        // <main><div>…</div></main> is NOT hijacked into selecting
        // <main> just because semantic sections always qualify as
        // card-like for the post-editable-atom fallback. Only "real"
        // card chrome counts here.
        if (vibeHasCardChrome(cur)) return cur;
        cur = cur.parentElement;
        depth++;
      }
      return null;
    }

    // Walk up from el to find the nearest editable atom (heading,
    // text, button, link, image, svg, etc.). ev.target is the deepest
    // hit element which for SVGs is usually a <path>, for buttons-
    // with-children is the child, etc. Without the walk-up, clicks on
    // these never select anything because the immediate target doesnt
    // match VIBE_EDITABLE. Stops at body/documentElement so a click
    // on the page background doesnt walk into the document root.
    //
    // Span override: when the first editable match is a <span>, look
    // for a <button> or card-like container within 3 ancestor levels
    // and prefer THAT. Rationale: 34 of 108 templates wrap button /
    // card labels in <span> for typography control — clicking the
    // visible label should select the user-intended parent, not the
    // wrapper. Standalone spans (no button/card parent within 3)
    // still get selected normally so <span class="text-6xl">42%
    // </span> in a stat block still works as an atom.
    function vibeFindEditableAncestor(el) {
      var cur = el;
      while (cur && cur !== document.body && cur !== document.documentElement) {
        if (vibeIsEditable(cur)) {
          if (cur.tagName === 'SPAN') {
            var parent = vibeFindButtonOrCardAncestorWithin(cur, 3);
            if (parent) return parent;
          }
          return cur;
        }
        cur = cur.parentElement;
      }
      return null;
    }

    // Card detection — used as the fallback when no editable atom
    // matched. Vibecoder mental model: I clicked on something that
    // LOOKS like a box → I want to tweak the box (bg / corners).
    // Computed-style based so it works with Tailwind utilities,
    // inline styles, or hand-rolled CSS. Plain wrapper divs (no
    // bg / no rounding / no shadow / no border) fall through to
    // selection-clear.
    // Computed-chrome flavour of the card check — bg / rounding /
    // shadow / border. Used by the span-override (a span inside a
    // <main> wrapper with no chrome SHOULDN'T be hijacked into
    // selecting the main; only "real" cards count there) AND as the
    // chrome arm of vibeIsCardLike below.
    function vibeHasCardChrome(el) {
      if (!el || !el.tagName) return false;
      if (el === document.body || el === document.documentElement) return false;
      if (vibeIsEditable(el)) return false;
      var cs = window.getComputedStyle ? getComputedStyle(el) : null;
      if (!cs) return false;
      var bg = cs.backgroundColor || '';
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return true;
      var rad = cs.borderRadius || '';
      if (rad && rad !== '0px') {
        var radNum = parseFloat(rad);
        if (radNum > 0) return true;
      }
      var sh = cs.boxShadow || '';
      if (sh && sh !== 'none' && sh.length > 0) return true;
      var bw =
        (parseFloat(cs.borderTopWidth || '0') || 0) +
        (parseFloat(cs.borderBottomWidth || '0') || 0) +
        (parseFloat(cs.borderLeftWidth || '0') || 0) +
        (parseFloat(cs.borderRightWidth || '0') || 0);
      if (bw > 0) return true;
      return false;
    }

    // Semantic-section short-circuit. Sections / headers / mains /
    // etc. ALWAYS qualify as card-like for the post-editable-atom
    // fallback so vibecoders can select a hero section to set its
    // background image even when the section has no chrome of its
    // own. Excluded from the span-override above so a span inside
    // <main><div>…</div></main> doesn't have its selection hijacked
    // to <main>.
    function vibeIsSemanticSection(el) {
      if (!el || !el.tagName) return false;
      var tag = el.tagName.toUpperCase();
      return (
        tag === 'SECTION' ||
        tag === 'HEADER' ||
        tag === 'FOOTER' ||
        tag === 'MAIN' ||
        tag === 'ASIDE' ||
        tag === 'ARTICLE' ||
        tag === 'NAV'
      );
    }

    function vibeIsCardLike(el) {
      if (vibeIsSemanticSection(el)) return true;
      return vibeHasCardChrome(el);
    }

    // Performance note (WU3, 2026-05-12): walks up to ~10 levels in
    // realistic templates, calling vibeIsCardLike (4 getComputedStyle
    // reads per ancestor) each step. Looks expensive but isn't —
    // getComputedStyle is free by itself; reads within a single task
    // share the browser's style cache. ~10 ancestor walks fold into
    // ~1 forced style recalc total = sub-millisecond on modern
    // hardware, far below the 16ms one-frame threshold. If templates
    // ever grow past 30 levels OR if profiling flags this as a hot
    // path, switch to a per-click WeakMap<Element, boolean> cache
    // reset at handler entry (see docs/superpowers/plans/2026-05-11-
    // pm-deferred-decisions.md Option B for the implementation).
    function vibeFindCardAncestor(el) {
      var cur = el;
      while (cur && cur !== document.body && cur !== document.documentElement) {
        if (vibeIsCardLike(cur)) return cur;
        cur = cur.parentElement;
      }
      return null;
    }

    // CSS-selector path: tag#id (stops at first id) or tag:nth-of-type(N)
    // when ambiguous siblings exist. Mirrors lib/vibe-edit/path.ts
    // exactly; if either drifts the integration test catches it.
    function vibeGetPath(el) {
      if (!el) return '';
      if (el === document.documentElement) return '';
      if (el.tagName === 'BODY') return 'body';
      var parts = [];
      var cur = el;
      var body = document.body;
      var root = document.documentElement;
      while (cur && cur !== body && cur !== root) {
        var seg = cur.tagName.toLowerCase();
        if (cur.id) {
          var escId = (window.CSS && CSS.escape) ? CSS.escape(cur.id) : cur.id;
          seg += '#' + escId;
          parts.unshift(seg);
          return parts.join(' > ');
        }
        var parent = cur.parentElement;
        if (parent) {
          var sameTag = [];
          for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i].tagName === cur.tagName) {
              sameTag.push(parent.children[i]);
            }
          }
          if (sameTag.length > 1) {
            var idx = sameTag.indexOf(cur) + 1;
            seg += ':nth-of-type(' + idx + ')';
          }
        }
        parts.unshift(seg);
        cur = parent;
      }
      return parts.join(' > ');
    }

    // Element-index chain from <html> down to el. Used by HTML-mode
    // source patchers (parse5 walks the AST element-by-element). For
    // JSX templates this is still computed cheaply but isnt used on
    // commit; the host falls back to OID. Returns null if el is
    // detached or above body level.
    function vibeGetHtmlPath(el) {
      if (!el) return null;
      var root = document.documentElement;
      if (!root || el === root) return null;
      var chain = [];
      var cur = el;
      while (cur && cur !== root) {
        var parent = cur.parentElement;
        if (!parent) return null;
        var elementChildren = [];
        for (var i = 0; i < parent.children.length; i++) {
          elementChildren.push(parent.children[i]);
        }
        var idx = elementChildren.indexOf(cur);
        if (idx < 0) return null;
        chain.unshift(idx);
        cur = parent;
      }
      return chain;
    }

    function vibeKind(tag, role) {
      var t = (tag || '').toLowerCase();
      var r = (role || '').toLowerCase();
      if (r === 'button') return 'button';
      if (/^h[1-6]$/.test(t)) return 'heading';
      if (VIBE_TEXT_TAG_SET[t]) return 'text';
      if (t === 'img') return 'image';
      if (t === 'svg') return 'icon';
      if (t === 'a') return 'link';
      if (t === 'button') return 'button';
      return 'container';
    }

    function vibeParseBgImageUrl(raw) {
      // cs.backgroundImage form is url("https://…") / url('…') / url(…)
      // for plain image bgs, 'none' for unset, and 'linear-gradient(…)'
      // / 'repeating-…' / multi-layer comma-joined values for richer
      // styling. We only own the plain-url case; everything else
      // surfaces as null so the picker doesnt pretend to manage it.
      if (!raw || raw === 'none') return null;
      var m = raw.match(/^url\(\s*(?:"([^"]+)"|'([^']+)'|([^)]+))\s*\)$/);
      if (!m) return null;
      return m[1] || m[2] || (m[3] ? m[3].trim() : null);
    }

    // Count DOM elements sharing this elements source OID. >1 means
    // the user clicked into a .map()-rendered (or otherwise duplicated)
    // source location — edits will cascade to siblings on the next
    // source rebuild because all N rendered instances read from the
    // same source bytes. Surface to the host panel so it can show
    // "Editing all N copies" instead of letting the user discover
    // after reload. OID is 8 alphanumeric chars (per lib/ast/oids.ts)
    // so attribute-selector interpolation is safe without escaping.
    // Returns 1 for elements with no OID (HTML mode, or pre-injection
    // JSX) so the panel doesnt misreport singletons. NB: backticks
    // are forbidden in this entire template literal — they would
    // close the outer TS template at parse time (project memory:
    // ts_template_backtick_trap).
    function vibeInstanceCount(oid) {
      if (!oid) return 1;
      try {
        var nodes = document.querySelectorAll(
          '[data-dropin-id="' + oid + '"]'
        );
        return nodes ? nodes.length : 1;
      } catch (e) {
        return 1;
      }
    }

    function vibeSerialize(el) {
      var cs = window.getComputedStyle ? getComputedStyle(el) : null;
      var oid = el.getAttribute('data-dropin-id');
      // Visual footprint at selection time. Drives the component-swap
      // path's same-dimension wrap so larger/smaller Uiverse tiles
      // don't push surrounding layout around. Round to integer CSS
      // pixels for stable inline style output.
      var bbox = null;
      try {
        if (typeof el.getBoundingClientRect === 'function') {
          var rect = el.getBoundingClientRect();
          var disp = cs ? cs.display : 'block';
          // parseFloat handles "8px" → 8, "auto" → NaN (rounded to 0).
          function parsePx(s) {
            var n = parseFloat(s);
            return isFinite(n) ? Math.round(n) : 0;
          }
          bbox = {
            width: Math.max(0, Math.round(rect.width || 0)),
            height: Math.max(0, Math.round(rect.height || 0)),
            display: disp || 'block',
            marginTop: cs ? parsePx(cs.marginTop) : 0,
            marginRight: cs ? parsePx(cs.marginRight) : 0,
            marginBottom: cs ? parsePx(cs.marginBottom) : 0,
            marginLeft: cs ? parsePx(cs.marginLeft) : 0
          };
        }
      } catch (e) {
        bbox = null;
      }
      return {
        path: vibeGetPath(el),
        htmlPath: vibeGetHtmlPath(el),
        oid: oid,
        tag: el.tagName.toLowerCase(),
        kind: vibeKind(el.tagName, el.getAttribute('role')),
        text: el.textContent || '',
        src: el.getAttribute('src'),
        alt: el.getAttribute('alt'),
        href: el.getAttribute('href'),
        textColor: cs ? cs.color : '',
        bgColor: cs ? cs.backgroundColor : '',
        borderRadius: cs ? cs.borderRadius : '',
        inlineStyle: el.style ? (el.style.cssText || '') : '',
        classes: el.getAttribute('class') || '',
        bgImage: cs ? vibeParseBgImageUrl(cs.backgroundImage) : null,
        instanceCount: vibeInstanceCount(oid),
        bbox: bbox
      };
    }

    function vibeSelect(el) {
      if (!el) return;
      if (vibeSelected && vibeSelected !== el) {
        vibeSelected.removeAttribute('data-vibe-selected');
      }
      vibeSelected = el;
      el.setAttribute('data-vibe-selected', '');
      dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
    }

    function vibeClear() {
      if (vibeSelected) {
        vibeSelected.removeAttribute('data-vibe-selected');
        vibeSelected = null;
      }
      dropinPost({ type: 'vibe:cleared' });
    }

    // Click handler is registered unconditionally; the gate is the
    // DROPIN_TOOL global from inspectorRuntimeJs. When the user
    // switches tool away from vibe, the host posts dropin:set-tool
    // and this handler becomes inert until they switch back.
    //
    // Resolution order: walk up from ev.target for an editable atom
    // (heading / text / button / link / image / svg). If none, walk
    // up for a card-like container (div with bg / rounded / shadow /
    // border) — vibecoders click somewhere in a card and expect to
    // edit the card. Plain wrappers fall through to selection-clear.
    //
    // SINGLE CAPTURE-PHASE HANDLER BY DESIGN (WU2 lock-the-design,
    // 2026-05-12). Tool coordination is via the DROPIN_TOOL global
    // from inspectorRuntimeJs; any future inspector that wants to
    // handle clicks adds an else-if (DROPIN_TOOL === "mytool")
    // branch inside THIS handler OR an else-arm in inspectorRuntimeJs.
    // Do NOT register a parallel addEventListener click capture
    // listener — capture-phase stopPropagation kills bubble-phase
    // handlers and there is no clean way for two capture-phase
    // listeners on the same target to coexist. Pattern matches
    // tldraw single-active-tool dispatcher and Plasmic/Builder.io
    // host-frame-owns-clicks architecture (see
    // docs/superpowers/plans/2026-05-11-pm-deferred-decisions.md
    // for citations).
    document.addEventListener('click', function (ev) {
      // Diagnostic: log every click that reaches the iframe regardless
      // of tool state. Tells us whether a "click does nothing" report
      // is (a) the click never reached the iframe, (b) tool was not
      // vibe, (c) walk-up found no editable atom + no card ancestor.
      try {
        var rawForLog = ev.target;
        var tagForLog = rawForLog && rawForLog.tagName
          ? rawForLog.tagName.toLowerCase() : 'unknown';
        console.log('[dropin:iframe-vibe-click] tool=' + DROPIN_TOOL
          + ' target=' + tagForLog);
      } catch (e) {}
      if (DROPIN_TOOL !== 'vibe') return;
      ev.preventDefault();
      ev.stopPropagation();
      var raw = ev.target;
      var atom = vibeFindEditableAncestor(raw);
      if (atom) {
        try { console.log('[dropin:iframe-vibe-click] hit atom', atom.tagName); } catch (e) {}
        vibeSelect(atom);
        return;
      }
      var card = vibeFindCardAncestor(raw);
      if (card) {
        try { console.log('[dropin:iframe-vibe-click] hit card', card.tagName); } catch (e) {}
        vibeSelect(card);
        return;
      }
      try { console.log('[dropin:iframe-vibe-click] no editable + no card ancestor → clear'); } catch (e) {}
      if (vibeSelected) vibeClear();
    }, true);

    // Direct-mutation handlers. Each finds the element by path; if
    // missing (structure changed underneath) the command is a silent
    // no-op and the next selection round-trip will reconcile.
    window.addEventListener('message', function (ev) {
      var d = ev.data;
      if (!d || typeof d !== 'object' || d.__dropin !== true) return;
      var el;
      if (d.type === 'vibe:update-content') {
        el = d.path ? document.querySelector(d.path) : null;
        if (el) {
          el.textContent = d.text || '';
          if (vibeSelected === el) {
            dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
          }
        }
      } else if (d.type === 'vibe:update-style') {
        el = d.path ? document.querySelector(d.path) : null;
        if (el && d.styles && typeof d.styles === 'object') {
          // Generic CSS-prop application. camelCase prop names go
          // through el.style[prop] = value (CSSStyleDeclaration
          // setter handles the kebab-case translation internally).
          // Empty string clears the inline value; absent keys are
          // left alone naturally because for-in skips undefined.
          for (var prop in d.styles) {
            if (Object.prototype.hasOwnProperty.call(d.styles, prop)) {
              var v = d.styles[prop];
              if (typeof v === 'string') {
                try { el.style[prop] = v; }
                catch (e) {
                  if (window.console && console.warn) {
                    console.warn('[vibe-edit] style assign failed', prop, e);
                  }
                }
              }
            }
          }
          if (vibeSelected === el) {
            dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
          }
        }
      } else if (d.type === 'vibe:update-image') {
        // 2026-05-16 — Tracer: log every step so we can see if the
        // path resolves, if the element is an IMG, what the src
        // before/after setAttribute looks like, and what the actual
        // DOM src reads back as one tick later (catches React
        // reconciliation reverts).
        el = d.path ? document.querySelector(d.path) : null;
        console.log('[dropin:iframe] update-image dispatch', {
          path: d.path,
          elFound: !!el,
          elTag: el ? el.tagName : null,
          newSrc: d.src,
          newAlt: d.alt
        });
        if (el && el.tagName === 'IMG') {
          var beforeSrc = el.getAttribute('src');
          if (typeof d.src === 'string') el.setAttribute('src', d.src);
          if (typeof d.alt === 'string') el.setAttribute('alt', d.alt);
          var afterSrc = el.getAttribute('src');
          console.log('[dropin:iframe] update-image setAttribute done', {
            beforeSrc: beforeSrc,
            afterSrc: afterSrc,
            srcChanged: beforeSrc !== afterSrc
          });
          // Check 50ms later whether React (or anything else) reverted
          // the DOM src. If a parent component re-renders, React's
          // reconciliation will reset src to whatever the VDOM says —
          // which for templates using <img src={var}> is the original
          // const-array URL.
          setTimeout(function () {
            try {
              var laterSrc = el.getAttribute('src');
              console.log('[dropin:iframe] update-image 50ms-later check', {
                srcStillSet: laterSrc,
                reverted: laterSrc !== afterSrc
              });
            } catch (e) {}
          }, 50);
          if (vibeSelected === el) {
            dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
          }
        }
      } else if (d.type === 'vibe:update-link') {
        el = d.path ? document.querySelector(d.path) : null;
        if (el && el.tagName === 'A') {
          el.setAttribute('href', d.href || '');
          if (vibeSelected === el) {
            dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
          }
        }
      } else if (d.type === 'vibe:update-outer') {
        // Icon swap. Replaces the elements outerHTML with the asset
        // markup. We re-inject d.oid into the first opening tag so
        // post-swap OID-based addressing keeps working. After the
        // outerHTML write the old node is detached, so we re-find by
        // path and re-emit selection if the user had this element
        // selected. Manual char-scan (no regex literal) avoids the TS
        // template backslash-escape trap.
        el = d.path ? document.querySelector(d.path) : null;
        if (el && typeof d.newOuter === 'string' && d.newOuter.length > 0) {
          var wasSelected = (vibeSelected === el);
          var stamped = d.newOuter;
          // Strip any foreign OID baked into the asset markup so we
          // can replant the target element's OID below — without this,
          // the swap would silently lose OID continuity on assets that
          // ship pre-stamped (e.g. assets exported from a prior vibe-
          // edit session).
          if (d.oid) {
            stamped = stamped.replace(
              /\s*data-dropin-id\s*=\s*("[^"]*"|'[^']*')/g,
              ''
            );
          }
          if (d.oid && stamped.indexOf('data-dropin-id') < 0) {
            // charCode comparisons throughout — avoids '\t' in a TS
            // template body (which would expand to a literal tab and
            // make the source visually ambiguous). 60 = '<', 32 = ' ',
            // 9 = TAB, 10 = LF, 13 = CR; tag-name chars are A-Z
            // (65-90), a-z (97-122), 0-9 (48-57), '-' (45). LF/CR
            // matter for asset library outputs that format multi-line
            // markup (e.g. an SVG icon with the open tag on its own
            // line) — without them the scan stalls before the tag
            // name and the OID injection silently no-ops.
            var i = 0;
            while (i < stamped.length && stamped.charCodeAt(i) !== 60) i++;
            if (i < stamped.length) {
              var j = i + 1;
              while (
                j < stamped.length &&
                (
                  stamped.charCodeAt(j) === 32 ||
                  stamped.charCodeAt(j) === 9 ||
                  stamped.charCodeAt(j) === 10 ||
                  stamped.charCodeAt(j) === 13
                )
              ) j++;
              var k = j;
              while (k < stamped.length) {
                var ch = stamped.charCodeAt(k);
                var isAlpha =
                  (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122);
                var isDigit = (ch >= 48 && ch <= 57);
                var isHyphen = ch === 45;
                // 58 = colon. Accepts namespace-prefixed tags like
                // <svg:use> and <xlink:href> — rare in modern HTML5
                // but legal XHTML / inlined SVG-as-XML still emits
                // them. Without this the scan would stop AT the colon
                // and inject OID between the namespace prefix and the
                // local name, producing broken markup.
                var isColon = ch === 58;
                if (!isAlpha && !isDigit && !isHyphen && !isColon) break;
                k++;
              }
              if (k > j) {
                stamped =
                  stamped.slice(0, k) +
                  ' data-dropin-id="' + d.oid + '"' +
                  stamped.slice(k);
              }
            }
          }
          try { el.outerHTML = stamped; }
          catch (e) {
            // CSP nonce mismatch, sandboxed-iframe innerHTML restrictions,
            // and parser-rejection of malformed asset markup all land
            // here. Without this log a swap that silently failed in the
            // DOM would still post vibe:selected with stale info.
            if (window.console && console.warn) {
              console.warn('[vibe-edit] outerHTML assign failed', e);
            }
          }
          if (wasSelected && d.path) {
            var newEl = document.querySelector(d.path);
            if (newEl) {
              newEl.setAttribute('data-vibe-selected', '');
              vibeSelected = newEl;
              dropinPost({ type: 'vibe:selected', info: vibeSerialize(newEl) });
            } else {
              vibeSelected = null;
              dropinPost({ type: 'vibe:cleared' });
            }
          }
        }
      } else if (d.type === 'vibe:update-classes') {
        // Class-list overwrite. Sets the element's class attribute
        // verbatim and re-emits selection so the host's vibeInfo
        // .classes echoes back. Empty string clears the attr.
        el = d.path ? document.querySelector(d.path) : null;
        if (el && typeof d.classes === 'string') {
          if (d.classes.length === 0) {
            el.removeAttribute('class');
          } else {
            el.setAttribute('class', d.classes);
          }
          if (vibeSelected === el) {
            dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
          }
        }
      } else if (d.type === 'vibe:select') {
        el = d.path ? document.querySelector(d.path) : null;
        if (el) vibeSelect(el);
      } else if (d.type === 'vibe:clear') {
        vibeClear();
      }
    });

    // Outline style for the selected element. Append to head; the
    // inspector style appended ahead of us in inspectorRuntimeJs
    // already styles [data-dropin-selected] + [data-dropin-hover];
    // ours is a separate marker so vibe and the legacy select tools
    // can coexist without one tools paint stomping the other.
    (function () {
      var s = document.createElement('style');
      s.setAttribute('data-vibe-style', 'true');
      s.textContent =
        '[data-vibe-selected] { outline: 3px solid #FF4D2E !important; outline-offset: 2px !important; cursor: pointer !important; }';
      (document.head || document.documentElement).appendChild(s);
    })();

    dropinPost({ type: 'vibe:ready' });
  `;
}
