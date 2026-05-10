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

    function vibeSerialize(el) {
      var cs = window.getComputedStyle ? getComputedStyle(el) : null;
      return {
        path: vibeGetPath(el),
        htmlPath: vibeGetHtmlPath(el),
        oid: el.getAttribute('data-dropin-id'),
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
        classes: el.getAttribute('class') || ''
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
    document.addEventListener('click', function (ev) {
      if (DROPIN_TOOL !== 'vibe') return;
      ev.preventDefault();
      ev.stopPropagation();
      var t = ev.target;
      if (!vibeIsEditable(t)) {
        if (vibeSelected) vibeClear();
        return;
      }
      vibeSelect(t);
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
                try { el.style[prop] = v; } catch (e) {}
              }
            }
          }
          if (vibeSelected === el) {
            dropinPost({ type: 'vibe:selected', info: vibeSerialize(el) });
          }
        }
      } else if (d.type === 'vibe:update-image') {
        el = d.path ? document.querySelector(d.path) : null;
        if (el && el.tagName === 'IMG') {
          if (typeof d.src === 'string') el.setAttribute('src', d.src);
          if (typeof d.alt === 'string') el.setAttribute('alt', d.alt);
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
