const PARSE_CODE_LINES = [
  { t: "import { Parse } from '@parse/research'", h: "<span class=\"kw\">import</span> { <span class=\"cls\">Parse</span> } <span class=\"kw\">from</span> <span class=\"str\">'@parse/research'</span>" },
  { t: "", h: "&nbsp;" },
  { t: "const doc = await Parse.load(", h: "<span class=\"kw\">const</span> <span class=\"vr\">doc</span> = <span class=\"kw\">await</span> <span class=\"cls\">Parse</span>.<span class=\"fn\">load</span>(" },
  { t: "  'Q3_Policy_Framework.pdf'", h: "  <span class=\"str\">'Q3_Policy_Framework.pdf'</span>" },
  { t: ")", h: ")" },
  { t: "", h: "&nbsp;" },
  { t: "const insights = await Parse.synthesize(doc, {", h: "<span class=\"kw\">const</span> <span class=\"vr\">insights</span> = <span class=\"kw\">await</span> <span class=\"cls\">Parse</span>.<span class=\"fn\">synthesize</span>(<span class=\"vr\">doc</span>, {" },
  { t: "  rigor: 'academic',", h: "  <span class=\"prop\">rigor</span>: <span class=\"str\">'academic'</span>," },
  { t: "  cite: true,", h: "  <span class=\"prop\">cite</span>: <span class=\"kw\">true</span>," },
  { t: "})", h: "})" },
  { t: "", h: "&nbsp;" },
  { t: "// → 3 structural shifts identified", h: "<span class=\"cm\">// → 3 structural shifts identified</span>" },
  { t: "// → 47 citations extracted", h: "<span class=\"cm\">// → 47 citations extracted</span>" },
  { t: "// → confidence: 98.4%", h: "<span class=\"cm\">// → confidence: 98.4%</span>" },
];

const PARSE_PROSE_LINES = [
  { t: "The Q3 Policy Framework outlines three", h: "The Q3 Policy Framework outlines three" },
  { t: "structural shifts in how organisations", h: "structural shifts in how organisations" },
  { t: "allocate resource and verify compliance.", h: "allocate resource and verify compliance." },
  { t: "", h: "&nbsp;" },
  { t: "First, decentralised resource allocation", h: "First, <em>decentralised resource allocation</em>" },
  { t: "across functional teams [Pg 4]. Second,", h: "across functional teams <cite>[Pg 4]</cite>. Second," },
  { t: "an agile framework for compliance", h: "an agile framework for <em>compliance</em>" },
  { t: "reporting [Pg 12]. Third, a transition", h: "reporting <cite>[Pg 12]</cite>. Third, a transition" },
  { t: "to asynchronous-first decision making", h: "to <em>asynchronous-first</em> decision making" },
  { t: "[Pg 23] — particularly relevant in rapid", h: "<cite>[Pg 23]</cite> — particularly relevant in rapid" },
  { t: "iteration cycles where synchronous", h: "iteration cycles where synchronous" },
  { t: "alignment becomes a bottleneck.", h: "alignment becomes a bottleneck." },
];

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildEditorHtml(lines, state, withNums) {
  let html = "";
  for (let k = 0; k < lines.length; k++) {
    let content;
    if (k < state.i) {
      content = lines[k].h || "&nbsp;";
    } else if (k === state.i) {
      const typed = lines[k].t.slice(0, state.j);
      content = (typed.length ? escapeHtml(typed) : "") + '<span class="parse-caret"></span>';
    } else {
      content = "&nbsp;";
    }
    const active = k === state.i && state.j < lines[k].t.length ? " active" : "";
    if (withNums) {
      html += '<div class="line' + active + '"><span class="num">' + (k + 1) + '</span><span class="text">' + content + '</span></div>';
    } else {
      html += '<div class="line">' + content + '</div>';
    }
  }
  return html;
}

function useTyper(lines, opts) {
  const [state, setState] = React.useState({ i: 0, j: 0 });
  React.useEffect(() => {
    let cancelled = false;
    let timer;
    let i = 0, j = 0;
    const charDelay = opts.charDelay || 22;
    const lineDelay = opts.lineDelay || 90;
    const rand = opts.rand || 18;
    const restart = opts.restart || 6500;

    const tick = () => {
      if (cancelled) return;
      if (i >= lines.length) {
        timer = setTimeout(() => {
          if (cancelled) return;
          i = 0; j = 0;
          setState({ i, j });
          timer = setTimeout(tick, 600);
        }, restart);
        return;
      }
      const cur = lines[i];
      if (j < cur.t.length) {
        j += 1;
        setState({ i, j });
        const ch = cur.t.charAt(j - 1);
        const d = ch === " " ? charDelay * 0.6 : charDelay + Math.random() * rand;
        timer = setTimeout(tick, d);
      } else {
        i += 1; j = 0;
        setState({ i, j });
        timer = setTimeout(tick, lineDelay);
      }
    };

    timer = setTimeout(tick, opts.initial || 0);
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);
  return state;
}

function LiveSynthDemo() {
  const codeState = useTyper(PARSE_CODE_LINES, { charDelay: 16, lineDelay: 90, rand: 22, restart: 6500, initial: 200 });
  const proseState = useTyper(PARSE_PROSE_LINES, { charDelay: 22, lineDelay: 140, rand: 26, restart: 6500, initial: 1100 });
  const ln = Math.min(codeState.i + 1, PARSE_CODE_LINES.length);
  const col = (codeState.i < PARSE_CODE_LINES.length ? codeState.j : PARSE_CODE_LINES[PARSE_CODE_LINES.length - 1].t.length) + 1;

  return (
    <section id="live-synth" className="relative w-full px-4 sm:px-6 mt-16 sm:mt-24 mb-8">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 px-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-300 mb-4">
              <span>Step 02</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span className="text-indigo-300 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Synthesise · Live</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">Watch Parse think.</h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed">A 47-page policy framework, parsed into structure on the left and synthesised into prose on the right — in real time.</p>
        </div>

        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_120px_-20px_rgba(129,140,248,0.25)]">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-64 bg-indigo-500/30 blur-[120px] -z-10 pointer-events-none" aria-hidden="true"></div>

          <div className="h-11 bg-[#161b22] border-b border-white/5 flex items-stretch pl-4 pr-4 gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex items-stretch ml-3 gap-px">
              <div className="flex items-center gap-2 px-3 bg-[#0d1117] border-r border-l border-t border-white/10 -mb-px rounded-t text-xs text-gray-200 font-mono">
                <svg className="w-3 h-3 text-fuchsia-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".4" /><path d="M14 2v6h6" /></svg>
                <span>Q3_Policy_Framework.pdf</span>
                <span className="w-1 h-1 rounded-full bg-fuchsia-400 ml-1" aria-hidden="true"></span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 text-xs text-gray-500 font-mono">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
                <span>synthesize.ts</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 sm:gap-4 text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500">
              <span className="hidden sm:inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Synthesizing</span>
              <span className="hidden md:inline">Pages 47</span>
              <span className="text-indigo-300">98.4%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 bg-[#0d1117]">
            <div className="parse-editor relative border-b md:border-b-0 md:border-r border-white/5 min-h-[460px]">
              <div className="absolute top-0 left-0 w-10 h-full bg-[#0a0d12] border-r border-white/5 flex flex-col items-center py-3 gap-3" aria-hidden="true">
                <div className="parse-rail-ico is-active">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                </div>
                <div className="parse-rail-ico">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" /></svg>
                </div>
                <div className="parse-rail-ico">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 3v18M18 3v18M3 9h6m6 0h6M3 15h6m6 0h6" /></svg>
                </div>
                <div className="parse-rail-ico">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" /></svg>
                </div>
              </div>
              <div className="pl-12 pr-4 py-4 parse-editor-scroll">
                <div aria-label="Live code synthesis" dangerouslySetInnerHTML={{ __html: buildEditorHtml(PARSE_CODE_LINES, codeState, true) }} />
              </div>
            </div>

            <div className="relative bg-[#0a0d12] p-6 sm:p-10 min-h-[460px] flex flex-col">
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" aria-hidden="true"></span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-fuchsia-300">Synthesised Brief</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500">Stream · v2</span>
              </div>
              <div className="parse-prose flex-1" dangerouslySetInnerHTML={{ __html: buildEditorHtml(PARSE_PROSE_LINES, proseState, false) }} />
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 gap-3">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                  3 sources cited
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Confidence 98.4%
                </span>
              </div>
            </div>
          </div>

          <div className="h-7 bg-gradient-to-r from-indigo-600 via-indigo-500 to-fuchsia-600 px-3 flex items-center text-[10px] text-white/95 font-mono uppercase tracking-[0.2em] gap-3 sm:gap-4 select-none">
            <span className="flex items-center gap-1.5"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12a3 3 0 003 3h6a3 3 0 003-3V9M6 3l4 4M6 3v6h6" /></svg>main</span>
            <span className="hidden sm:inline">UTF-8</span>
            <span>TypeScript</span>
            <span className="ml-auto">Ln {ln}</span>
            <span>Col {col}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function T4AiProductLanding() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              fontFamily: { sans: ['Inter', 'sans-serif'] },
              colors: {
                background: '#030303',
                surface: '#0A0A0A',
                surface2: '#121212',
                border: '#222222',
                primary: '#FFFFFF',
                secondary: '#A1A1AA',
                accent: '#818CF8',
                accent2: '#C084FC',
              },
              animation: {
                'fade-in-up': 'fadeInUp 1s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
              },
              keyframes: {
                fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } }
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background-color: rgba(129, 140, 248, 0.4); color: #ffffff; }
        .noise-bg {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 50; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .glass { background: rgba(15, 15, 15, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .gradient-border-wrapper { position: relative; background: #121212; border-radius: 1rem; z-index: 1; }
        .gradient-border-wrapper::before {
          content: ""; position: absolute; inset: -1px; border-radius: 1.1rem;
          background: linear-gradient(45deg, #818CF8, #C084FC, #818CF8); background-size: 200% 200%;
          z-index: -1; animation: gradientMove 4s ease infinite;
        }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }

        .parse-editor { background: #0d1117; color: #c9d1d9; font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', ui-monospace, monospace; font-size: 13px; line-height: 1.7; overflow: hidden; }
        .parse-editor-scroll { overflow-x: auto; }
        .parse-editor .line { display: flex; white-space: pre; min-height: 1.7em; transition: background 120ms ease; }
        .parse-editor .line.active { background: rgba(255,255,255,0.025); }
        .parse-editor .num { width: 3rem; padding-right: 1rem; color: #484f58; text-align: right; user-select: none; font-variant-numeric: tabular-nums; flex-shrink: 0; }
        .parse-editor .text { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .parse-editor .kw { color: #ff7b72; }
        .parse-editor .cls { color: #d2a8ff; }
        .parse-editor .fn { color: #d2a8ff; }
        .parse-editor .vr { color: #79c0ff; }
        .parse-editor .str { color: #a5d6ff; }
        .parse-editor .prop { color: #79c0ff; }
        .parse-editor .cm { color: #8b949e; font-style: italic; }
        .parse-caret { display: inline-block; width: 0.55ch; height: 1.05em; background: #c9d1d9; margin-left: 1px; vertical-align: -2px; animation: parseCaretBlink 1s step-end infinite; }
        @keyframes parseCaretBlink { 50% { opacity: 0; } }

        .parse-prose { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.8; color: #d1d5db; }
        .parse-prose .line { display: block; min-height: 1.8em; }
        .parse-prose em { color: #c4b5fd; font-style: normal; font-weight: 500; background: rgba(196,181,253,0.08); padding: 0 4px; border-radius: 2px; }
        .parse-prose cite { color: #a78bfa; font-style: normal; background: rgba(167,139,250,0.14); padding: 1px 6px; border-radius: 3px; font-size: 0.8em; font-family: 'JetBrains Mono', ui-monospace, monospace; border: 1px solid rgba(167,139,250,0.28); margin: 0 1px; }
        .parse-prose .parse-caret { background: #a78bfa; }

        .parse-rail-ico { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; color: #6e7681; }
        .parse-rail-ico.is-active { color: #c4b5fd; }
      ` }} />

      <div className="relative flex flex-col min-h-screen bg-[#030303] text-white dark overflow-x-hidden">
        <div className="noise-bg" aria-hidden="true"></div>
        <div className="absolute top-0 left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-fuchsia-900/10 blur-[100px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>

        <header className="fixed top-0 w-full z-40 transition-all duration-300 border-b border-white/[0.04] bg-[#030303]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex justify-between items-center">
            <a href="/" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(129,140,248,0.4)]">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-tight text-white group-hover:opacity-80 transition-opacity">Parse</span>
            </a>
            <nav className="hidden md:flex gap-8 items-center" aria-label="Main Navigation">
              <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#features">Features</a>
              <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#demo">How it Works</a>
              <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#pricing">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="#login" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign In</a>
              <a href="#pricing" className="relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-white px-5 font-medium text-black transition-transform active:scale-95 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
                Get Started
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full pt-28 sm:pt-36">

          <section className="relative w-full px-6 flex flex-col items-center text-center max-w-[1400px] mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              Introducing Parse 2.0
              <svg className="w-3 h-3 ml-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
            <h1 className="text-[clamp(48px,9.5vw,136px)] font-bold tracking-tighter leading-[1.02] text-balance mb-8 text-white">
              Research that <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-pulse-slow">thinks with you.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 text-balance font-light">
              Synthesize complex documents into clear insights with a high-fidelity AI research partner built for academic and professional rigor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a href="#pricing" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-black font-medium text-sm transition-transform active:scale-95 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                Start Reading Free
              </a>
              <a href="#demo" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#121212] border border-[#222222] text-white font-medium text-sm transition-colors hover:bg-[#222222] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] w-full sm:w-auto">
                View Demo
              </a>
            </div>

          </section>

          {/* STEP 01 :: Drop a PDF — onboarding dropzone */}
          <section className="relative w-full px-4 sm:px-6 mt-20 sm:mt-28 mb-8">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 px-2">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-300 mb-4">
                    <span>Step 01</span>
                    <span className="w-px h-3 bg-white/20"></span>
                    <span className="text-fuchsia-300">Drop a PDF</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">Drop a document. Anything.</h2>
                </div>
                <p className="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed">No setup. No file conversion. No CLI. Drag a PDF — Parse handles the rest. We never store the source.</p>
              </div>

              <label htmlFor="parse-fakeup" className="block group cursor-pointer relative">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" aria-hidden="true"></div>

                <div className="relative rounded-2xl border-2 border-dashed border-white/15 bg-[#0A0A0A]/80 group-hover:border-indigo-400/60 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
                  <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "radial-gradient(ellipse 70% 60% at center, black 30%, transparent 90%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at center, black 30%, transparent 90%)" }}></div>

                  <div className="relative px-6 sm:px-12 py-12 sm:py-16 flex flex-col items-center text-center">
                    <div className="relative mb-6 sm:mb-8">
                      <div className="absolute -inset-6 bg-indigo-500/25 blur-3xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative w-16 h-20 rounded-md bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 flex flex-col items-center justify-center gap-1.5 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500 shadow-2xl shadow-indigo-500/30">
                        <svg className="w-7 h-7 text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
                        </svg>
                        <span className="text-[8px] font-mono text-gray-500 tracking-widest uppercase">PDF</span>
                      </div>
                      <div className="absolute -top-2 -right-4 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">Up to 500 pp</div>
                      <div className="absolute top-1.5 left-1.5 w-16 h-20 rounded-md bg-white/[0.02] border border-white/5 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500" aria-hidden="true"></div>
                      <div className="absolute top-3 left-3 w-16 h-20 rounded-md bg-white/[0.015] border border-white/5 -z-20 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" aria-hidden="true"></div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">Drop your PDF here</h3>
                    <p className="text-gray-400 text-sm mb-7 max-w-sm">or <span className="text-indigo-300 underline decoration-dotted underline-offset-4 group-hover:text-white transition-colors">click to browse</span> — we'll do the rest. No account required for the first three documents.</p>

                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-6">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>End-to-end encrypted</span>
                      <span className="text-gray-700 hidden sm:inline">·</span>
                      <span>PDF · DOCX · EPUB</span>
                      <span className="text-gray-700 hidden sm:inline">·</span>
                      <span>Up to 500 pages</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-gray-400 font-mono">
                      <svg className="w-3 h-3 text-fuchsia-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
                      <span>Try the demo: <span className="text-white">Q3_Policy_Framework.pdf</span></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                  </div>
                </div>
                <input id="parse-fakeup" type="file" className="sr-only" accept=".pdf,.docx,.epub" tabIndex={-1} />
              </label>

              <div className="flex flex-col items-center gap-1.5 mt-8 mb-2 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">
                <span>Then</span>
                <svg className="w-4 h-6 animate-bounce" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v16m0 0l-4-4m4 4l4-4" />
                </svg>
                <span className="text-fuchsia-300">Watch it think</span>
              </div>
            </div>
          </section>

          <LiveSynthDemo />

          <section id="features" className="w-full px-6 py-24 sm:py-32 max-w-6xl mx-auto relative z-10 border-t border-white/5">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Intelligence built for rigor.</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">Parse doesn't just skim. It comprehends nuance, connects dots, and builds a verified knowledge graph of your documents.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E0E] p-8 sm:p-10 transition-all hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-white group-hover:text-indigo-400 transition-colors group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Deep Reading Engine</h3>
                    <p className="text-gray-400 leading-relaxed max-w-md group-hover:text-gray-300 transition-colors">Our specialized models process entire documents in context. No more keyword matching or missing the underlying structural arguments.</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E0E] p-8 sm:p-10 transition-all hover:border-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(217,70,239,0.05)]">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-white group-hover:text-fuchsia-400 transition-colors group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Verifiable Truth</h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Every insight generated is directly linked and cited to the exact paragraph in your source document.</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E0E] p-8 sm:p-10 transition-all hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.05)]">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-white group-hover:text-blue-400 transition-colors group-hover:bg-blue-500/10 group-hover:border-blue-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Smart Synthesis</h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">Connect disparate concepts across thousands of pages instantly. Build cohesive narratives from chaos.</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E0E] p-8 sm:p-10 transition-all hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-white group-hover:text-emerald-400 transition-colors group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Seamless Export</h3>
                    <p className="text-gray-400 leading-relaxed max-w-md group-hover:text-gray-300 transition-colors">Integrate directly into your existing workflow. Export cleanly formatted citations to BibTeX, Notion, or Markdown with a single click.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <section id="demo" className="w-full px-6 py-24 sm:py-32 border-t border-white/5 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">See Parse in Action</h2>
                  <p className="text-gray-300 text-lg max-w-xl">Watch how our engine isolates critical concepts from dense academic formatting and surfaces them as actionable intelligence.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-12 gap-8 items-stretch">
                <div className="md:col-span-7 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8 relative group overflow-hidden shadow-lg">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <div className="font-serif text-lg leading-relaxed text-gray-400 space-y-6">
                    <p>The implications of the aforementioned framework extend beyond immediate operational concerns. It demands a fundamental restructuring of how cross-functional teams communicate.</p>
                    <p>Particularly in the context of <span className="bg-indigo-500/20 text-gray-200 px-1.5 py-0.5 rounded border border-indigo-500/30 transition-colors cursor-pointer group-hover:bg-indigo-500/40">rapid iteration cycles</span>, the necessity for synchronous alignment becomes a potential bottleneck. Therefore, adopting an asynchronous-first methodology is highly recommended.</p>
                    <p>This <span className="border-b border-indigo-400 text-gray-200 pb-0.5">asynchronous paradigm</span> not only alleviates pressure on synchronous meeting time but also creates a persistent, searchable record of decision-making processes.</p>
                  </div>
                </div>
                <div className="md:col-span-5 relative">
                  <div className="hidden md:block absolute top-1/2 -left-8 w-8 border-t border-dashed border-white/20" aria-hidden="true"></div>
                  <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 shadow-2xl relative h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                      <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">Concept Extracted</span>
                    </div>
                    <h4 className="text-2xl font-semibold text-white mb-4 leading-tight">Asynchronous Shift</h4>
                    <p className="text-gray-300 text-sm leading-relaxed flex-1">
                      Fast iteration cycles turn traditional synchronous meetings into bottlenecks. A shift to documented, asynchronous decision-making is necessary to maintain velocity and create a persistent record.
                    </p>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                        <span className="text-xs font-medium tracking-wide uppercase">Source: Paragraph 2 & 3</span>
                      </div>
                      <div className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[10px] font-mono text-gray-400">98% Confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="pricing" className="w-full px-6 py-24 sm:py-32 relative z-10 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16 sm:mb-20">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Transparent pricing.</h2>
                <p className="text-gray-300 text-lg max-w-xl mx-auto">Start exploring your documents for free. Upgrade when you need academic-grade power.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-stretch">

                <div className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-8 sm:p-10 flex flex-col h-full hover:border-white/20 transition-colors shadow-lg">
                  <h3 className="text-xl font-medium text-white mb-2">Personal</h3>
                  <p className="text-sm text-gray-300 mb-8">For casual research and students.</p>
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tighter text-white">Free</span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {["5 Documents per month", "Basic Synthesis", "Standard Citations"].map((it, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <a href="#signup-free" className="w-full inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white font-medium text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all">
                    Get Started Free
                  </a>
                </div>

                <div className="gradient-border-wrapper shadow-2xl shadow-indigo-500/10 md:scale-105">
                  <div className="h-full bg-[#121212] rounded-2xl p-8 sm:p-10 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-bl-lg shadow-sm">
                        Recommended
                      </div>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Pro</h3>
                    <p className="text-sm text-gray-300 mb-8">For serious academics and researchers.</p>
                    <div className="mb-8 flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tighter text-white tabular-nums">$20</span>
                      <span className="text-gray-400 text-sm">/mo</span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                      {[
                        { txt: "Unlimited Documents", bold: true },
                        { txt: "Deep Reading Engine access" },
                        { txt: "Export to BibTeX & Notion" },
                        { txt: "Priority inference queue" },
                      ].map((it, i) => (
                        <li key={i} className={`flex items-center gap-3 text-sm ${it.bold ? "text-white font-medium" : "text-gray-200"}`}>
                          <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          {it.txt}
                        </li>
                      ))}
                    </ul>
                    <a href="#signup-pro" className="w-full inline-flex h-12 items-center justify-center rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] transition-all active:scale-[0.98]">
                      Upgrade to Pro
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </main>

        <footer className="border-t border-white/5 py-12 w-full mt-auto relative z-10 bg-[#030303]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded border border-white/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white tracking-tight">Parse Research © 2024</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-8" aria-label="Footer Navigation">
              <a className="text-sm text-gray-400 hover:text-white transition-colors" href="#privacy">Privacy</a>
              <a className="text-sm text-gray-400 hover:text-white transition-colors" href="#terms">Terms</a>
              <a className="text-sm text-gray-400 hover:text-white transition-colors" href="#changelog">Changelog</a>
              <a className="text-sm text-gray-400 hover:text-white transition-colors" href="#contact">Contact</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
