const PINBOARD_TILES = [
  { src: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=640&q=85&auto=format&fit=crop", title: "Daily Standup", meta: "Mon · Bench 04", w: "w-64", bg: "bg-white", rot: "-rotate-3", aspect: "aspect-[4/5]", extra: "" },
  { src: "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=720&q=85&auto=format&fit=crop", title: "Roadmap Q3", meta: "5 sticky notes · 2 arrows", w: "w-72", bg: "bg-blue-100", rot: "rotate-2", aspect: "aspect-[5/4]", extra: "grayscale contrast-110" },
  { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=640&q=85&auto=format&fit=crop", title: "Studio Tour", meta: "Annotated · 12 pins", w: "w-64", bg: "bg-yellow-50", rot: "-rotate-1", aspect: "aspect-[4/5]", extra: "" },
  { src: "https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f?w=720&q=85&auto=format&fit=crop", title: "Recipe Tests", meta: "12 sketches · 3 stains", w: "w-72", bg: "bg-red-100", rot: "rotate-3", aspect: "aspect-[5/4]", extra: "" },
  { src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=640&q=85&auto=format&fit=crop", title: "Camera Notes", meta: "Lens diagram · sun-side", w: "w-64", bg: "bg-green-100", rot: "-rotate-2", aspect: "aspect-[4/5]", extra: "" },
  { src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=720&q=85&auto=format&fit=crop", title: "Trip · Lisbon", meta: "14 maps · 4 doodles", w: "w-72", bg: "bg-white", rot: "rotate-1", aspect: "aspect-[5/4]", extra: "" },
  { src: "https://images.unsplash.com/photo-1503602642458-232111445657?w=640&q=85&auto=format&fit=crop", title: "Letter Draft", meta: "3 attempts · 1 keep", w: "w-64", bg: "bg-highlight", rot: "-rotate-3", aspect: "aspect-[4/5]", extra: "" },
  { src: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=720&q=85&auto=format&fit=crop", title: "Weekend Plan", meta: "Lists · 2 wishes · 1 lie", w: "w-72", bg: "bg-blue-100", rot: "rotate-2", aspect: "aspect-[5/4]", extra: "grayscale" },
];

const COMMANDMENTS = [
  { i: "I.", color: "text-red-pen", title: "Open the page before the laptop.", body: "If the keyboard wins the first five minutes, the day belongs to the inbox.", tag: "cmd_01" },
  { i: "II.", color: "text-blue-pen", title: "A bad doodle beats a perfect outline.", body: "The wobble carries the meaning. Tidiness costs ideas.", tag: "cmd_02" },
  { i: "III.", color: "text-red-pen", title: "Keep the eraser in the drawer.", body: "Cross out, don't disappear. The crossed-out version is half the audit trail.", tag: "cmd_03" },
  { i: "IV.", color: "text-blue-pen", title: "One arrow per intention.", body: "Three arrows means three ideas; do not let them merge into one undecided fork.", tag: "cmd_04" },
  { i: "V.", color: "text-red-pen", title: "Date every page in the corner.", body: "Future-you will need it. The undated page is gravity-free; nothing sticks.", tag: "cmd_05" },
  { i: "VI.", color: "text-blue-pen", title: "Highlighter last.", body: "Yellow on top of pen reads as confidence. Yellow on top of pencil reads as panic.", tag: "cmd_06" },
  { i: "VII.", color: "text-red-pen", title: "Close the book on the hour.", body: "Sketching past the bell ruins the next page. Tape it, photograph it, walk away.", tag: "cmd_07" },
];

const TESTIMONIALS = [
  { bg: "bg-highlight", rot: "-rotate-3", trans: "", blob: "blob-2", tape: "left-1/2 -translate-x-1/2 rotate-1", quote: "Burned my notebook last summer. Got Sketch_Pad. Burned 0 notebooks since.", initial: "M", initialBg: "bg-blue-pen text-white", name: "Maya R.", role: "Product · Berlin" },
  { bg: "bg-blue-100", rot: "rotate-2", trans: "md:translate-y-6", blob: "blob-1", tape: "right-8 -rotate-3", quote: "Used to plan in Notion. My kids saw the Sunday list, kept it. Now I plan in Sketch_Pad. Same kids. They keep more.", initial: "A", initialBg: "bg-red-pen text-white", name: "Akira N.", role: "Teacher · Osaka" },
  { bg: "bg-red-100", rot: "-rotate-1", trans: "", blob: "blob-2", tape: "left-10 rotate-2", quote: "My therapist says my journals are tidier. My therapist is wrong, but the export is genuinely beautiful.", initial: "L", initialBg: "bg-ink text-highlight", name: "Lena S.", role: "Repair shop · Lisbon" },
];

function HandDrawn() {
  return (
    <>
      {/* head */}
      <title>SKETCH_PAD | The Doodle Note App</title>
      <meta name="description" content="The digital notebook that feels like real paper." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Patrick+Hand&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'paper': '#fdfbf7',
                        'ink': '#2d2d2d',
                        'ink-light': '#4a4a4a',
                        'highlight': '#fff04b',
                        'blue-pen': '#2b6cb0',
                        'red-pen': '#c53030',
                        'tape': 'rgba(255, 255, 255, 0.6)',
                    },
                    fontFamily: {
                        'sans': ['"Patrick Hand"', 'cursive'],
                        'display': ['"Gochi Hand"', 'cursive'],
                    },
                    boxShadow: {
                        'sketch': '3px 3px 0px 0px #2d2d2d',
                        'sketch-lg': '6px 6px 0px 0px #2d2d2d',
                        'sketch-xl': '10px 10px 0px 0px #2d2d2d',
                    },
                    backgroundImage: {
                        'grid-pattern': "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
                        'line-pattern': "repeating-linear-gradient(transparent, transparent 31px, #cbd5e1 31px, #cbd5e1 32px)",
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-color: #fdfbf7;
          background-image: radial-gradient(#a3a3a3 1px, transparent 1px);
          background-size: 24px 24px;
          color: #2d2d2d;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .paper-grain::before {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.4;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E");
          z-index: 50;
        }
        .blob-1 { border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; }
        .blob-2 { border-radius: 25px 225px 25px 225px / 225px 25px 225px 25px; }
        .blob-circle { border-radius: 55% 45% 60% 40% / 40% 60% 50% 50%; }
        .btn-scribble { transition: all 0.15s ease-in-out; }
        .btn-scribble:hover {
          transform: translate(-2px, -2px) rotate(-1deg);
          box-shadow: 6px 6px 0px 0px #2d2d2d;
        }
        .btn-scribble:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px 0px #2d2d2d;
        }
        .scotch-tape {
          background-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-left: 1px solid rgba(255,255,255,0.3);
          border-right: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(1px);
        }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #fdfbf7; border-left: 2px solid #2d2d2d; }
        ::-webkit-scrollbar-thumb { background: #2d2d2d; border-radius: 5px; border: 2px solid #fdfbf7; }
        .divider-zigzag {
          background:
            linear-gradient(135deg, #fdfbf7 25%, transparent 25%) -10px 0,
            linear-gradient(225deg, #fdfbf7 25%, transparent 25%) -10px 0,
            linear-gradient(315deg, #2d2d2d 25%, transparent 25%),
            linear-gradient(45deg, #2d2d2d 25%, transparent 25%);
          background-size: 20px 20px;
          height: 10px;
        }
        .pinboard-track {
          display: flex;
          gap: 28px;
          width: max-content;
          animation: pinboard-scroll 70s linear infinite;
          padding: 32px 0;
        }
        .pinboard-track:hover { animation-play-state: paused; }
        @keyframes pinboard-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 14px)); }
        }
        .pin-tack::before {
          content: '';
          position: absolute;
          top: 8px; left: 50%; transform: translateX(-50%);
          width: 14px; height: 14px;
          background: radial-gradient(circle at 30% 30%, #ef4444 0%, #b91c1c 70%, #7f1d1d 100%);
          border: 2px solid #2d2d2d;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
          z-index: 30;
        }
        .sketch-faq summary { list-style: none; cursor: pointer; }
        .sketch-faq summary::-webkit-details-marker { display: none; }
        .sketch-faq summary .sketch-arrow { transition: transform 250ms ease; }
        .sketch-faq[open] summary .sketch-arrow { transform: rotate(90deg); }
        @media (prefers-reduced-motion: reduce) {
          .pinboard-track { animation: none; }
          .sketch-faq summary .sketch-arrow { transition: none; }
        }
` }} />

      {/* body — equivalent to <body class="font-sans text-xl leading-relaxed selection:bg-highlight selection:text-ink"> */}
      <div className="font-sans text-xl leading-relaxed selection:bg-highlight selection:text-ink">

        {/* Navbar */}
        <nav className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b-2 border-ink shadow-sm transition-all">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 border-2 border-ink bg-highlight blob-circle flex items-center justify-center shadow-sketch group-hover:rotate-12 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>
              <span className="font-display text-2xl md:text-3xl font-bold tracking-wide relative top-1">SKETCH_PAD</span>
            </a>

            <div className="hidden md:flex items-center gap-8 font-bold text-lg">
              <a href="#features" className="hover:text-blue-pen hover:underline decoration-wavy decoration-2 underline-offset-4">Features</a>
              <a href="#how-it-works" className="hover:text-red-pen hover:underline decoration-wavy decoration-2 underline-offset-4">How it Works</a>
              <a href="#pricing" className="hover:text-blue-pen hover:underline decoration-wavy decoration-2 underline-offset-4">Pricing</a>
            </div>

            <button className="font-display text-lg md:text-xl border-2 border-ink bg-white px-5 py-2 blob-2 shadow-sketch btn-scribble hidden sm:block">
              Download App
            </button>

            <button className="md:hidden p-2">
              <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Hero */}
        <header className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
          <svg className="absolute top-20 left-0 w-32 h-32 opacity-20 -rotate-12 pointer-events-none md:block hidden" viewBox="0 0 100 100">
            <path fill="none" stroke="#2d2d2d" strokeWidth="2" d="M10,50 Q30,10 50,50 T90,50 M20,60 Q40,20 60,60 T90,60" />
          </svg>
          <svg className="absolute bottom-10 right-0 w-48 h-48 opacity-10 rotate-45 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#2d2d2d" strokeWidth="2" fill="none" strokeDasharray="10 5" />
          </svg>

          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 md:gap-20">

            {/* Left content */}
            <div className="md:w-1/2 text-center md:text-left z-10">
              <div className="inline-block bg-red-100 text-red-800 px-4 py-1 border-2 border-red-800 blob-1 mb-6 -rotate-2 font-bold text-sm transform origin-bottom-left">
                ★ #1 Productivity Tool (My Mom said so)
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-8 text-ink relative">
                Messy thoughts? <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10">Get Sketchy.</span>
                  <div className="absolute inset-x-0 bottom-2 h-4 bg-highlight/80 -z-0 blob-1 transform -rotate-1 skew-x-12"></div>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-ink-light mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Stop forcing your brain into rigid boxes. Write, draw, and scribble freely on an infinite digital canvas.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                <a href="#" className="bg-ink text-paper font-display text-2xl px-8 py-3 blob-1 border-2 border-transparent shadow-sketch-lg hover:shadow-sketch hover:-translate-y-1 transition-all text-center">
                  Try for Free
                </a>
                <a href="#" className="bg-transparent text-ink font-display text-2xl px-8 py-3 blob-2 border-2 border-ink hover:bg-white transition-colors flex items-center justify-center gap-2 group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M10 8l6 4-6 4V8z" />
                  </svg>
                  Watch Demo
                </a>
              </div>
              <div className="mt-6 text-sm text-gray-500 font-bold rotate-1">
                * No credit card required. Just creativity.
              </div>
            </div>

            {/* Right visual — sticky note stack */}
            <div className="md:w-1/2 relative w-full max-w-md md:max-w-full">
              {/* Bottom note */}
              <div className="absolute top-10 right-4 w-full aspect-[4/5] bg-blue-100 border-2 border-ink blob-1 rotate-6 z-0 shadow-sketch"></div>

              {/* Main note */}
              <div className="relative bg-highlight w-full aspect-[4/5] border-2 border-ink blob-2 shadow-sketch-lg flex flex-col p-6 md:p-8 -rotate-2 z-10">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-10 scotch-tape rotate-1 z-20"></div>

                <h2 className="font-display text-4xl mb-6 border-b-2 border-ink border-dashed pb-2 text-center">Master Plan</h2>

                <ul className="text-xl md:text-2xl space-y-4 list-none font-sans flex-1">
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-6 h-6 border-2 border-ink rounded bg-white mt-1 group-hover:bg-ink transition-colors"></div>
                    <span className="group-hover:line-through decoration-2 decoration-ink">Launch Website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 border-2 border-ink rounded bg-ink flex items-center justify-center text-white text-sm mt-1">✓</div>
                    <span className="line-through decoration-2 decoration-red-pen text-gray-500">Fix checkmarks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 border-2 border-ink rounded bg-white mt-1"></div>
                    <span>Sketch new logo</span>
                  </li>
                  <li className="relative mt-4">
                    <svg className="w-32 h-20 text-blue-pen absolute -right-2 top-0 rotate-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 60">
                      <path d="M10,30 Q30,10 50,30 T90,30" strokeDasharray="4 2" />
                      <path d="M80,25 L90,30 L85,40" />
                      <text x="0" y="55" className="font-display text-sm" stroke="none" fill="currentColor">Needs more coffee</text>
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Social proof */}
        <div className="border-y-2 border-ink bg-white py-8 overflow-hidden transform -skew-y-1 origin-top-left">
          <div className="container mx-auto px-4 transform skew-y-1">
            <p className="text-center font-display text-xl mb-6 text-gray-500">Loved by messy people at:</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2 group">
                <svg className="w-8 h-8 text-ink group-hover:text-blue-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M7 12h10" />
                </svg>
                <span className="font-bold text-2xl">BigTech</span>
              </div>
              <div className="flex items-center gap-2 group">
                <svg className="w-8 h-8 text-ink group-hover:text-red-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M10 8l5 4-5 4V8z" />
                </svg>
                <span className="font-bold text-2xl">MediaCo</span>
              </div>
              <div className="flex items-center gap-2 group">
                <svg className="w-8 h-8 text-ink group-hover:text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="font-bold text-2xl">Stacker</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="py-20 bg-paper relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 relative inline-block">
                Why Use It?
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-highlight" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.8" />
                </svg>
              </h2>
              <p className="text-xl text-gray-600 mt-4">Features that don't get in your way.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

              {/* Feature 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-ink rounded-[25px_225px_25px_225px/225px_25px_225px_25px] transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
                <div className="relative bg-white border-2 border-ink blob-2 p-8 h-full transition-transform group-hover:-translate-y-1">
                  <div className="w-16 h-16 mb-6 flex items-center justify-center bg-blue-100 rounded-full border-2 border-ink">
                    <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 16l6-6 6 6M4 20h16M4 12l6-6 6 6M4 8h16" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl mb-3">Infinite Canvas</h3>
                  <p className="text-gray-600">Run out of space? Never. Scroll in any direction forever. It's like a napkin that never ends.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-ink rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
                <div className="relative bg-white border-2 border-ink blob-1 p-8 h-full transition-transform group-hover:-translate-y-1">
                  <div className="w-16 h-16 mb-6 flex items-center justify-center bg-green-100 rounded-full border-2 border-ink">
                    <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl mb-3">Offline First</h3>
                  <p className="text-gray-600">No internet? No problem. Your genius ideas are stored locally on your device.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-ink rounded-[25px_225px_25px_225px/225px_25px_225px_25px] transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
                <div className="relative bg-white border-2 border-ink blob-2 p-8 h-full transition-transform group-hover:-translate-y-1">
                  <div className="w-16 h-16 mb-6 flex items-center justify-center bg-red-100 rounded-full border-2 border-ink">
                    <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl mb-3">Export to PDF</h3>
                  <p className="text-gray-600">Turn your mess into a professional(ish) looking PDF document with one click.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider-zigzag"></div>

        {/* How it Works */}
        <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-display font-bold text-center mb-16">How it Works</h2>

            <div className="flex flex-col md:flex-row justify-center items-center gap-12 relative">
              <svg className="hidden md:block absolute top-12 left-[15%] w-[70%] h-20 z-0 text-gray-300" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 5">
                <path d="M0,40 Q150,-20 300,40 T600,40" />
              </svg>

              <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
                <div className="w-24 h-24 bg-paper border-2 border-ink blob-circle flex items-center justify-center text-5xl font-display shadow-sketch mb-6 rotate-2">1</div>
                <h3 className="text-2xl font-bold mb-2">Open App</h3>
                <p>Click the icon. It loads instantly. No splash screens, no loading bars.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center max-w-xs mt-8 md:mt-0">
                <div className="w-24 h-24 bg-paper border-2 border-ink blob-circle flex items-center justify-center text-5xl font-display shadow-sketch mb-6 -rotate-3">2</div>
                <h3 className="text-2xl font-bold mb-2">Scribble</h3>
                <p>Use your finger, mouse, or stylus. Draw diagrams or write lists.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center max-w-xs mt-8 md:mt-0">
                <div className="w-24 h-24 bg-paper border-2 border-ink blob-circle flex items-center justify-center text-5xl font-display shadow-sketch mb-6 rotate-1">3</div>
                <h3 className="text-2xl font-bold mb-2">Done</h3>
                <p>Close it. It saves automatically. Go drink some coffee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pinboard image marquee */}
        <section className="relative bg-paper border-y-2 border-ink overflow-hidden py-10" id="pinboard">
          <div className="container mx-auto px-4 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <span className="font-display text-red-pen text-lg rotate-[-2deg] inline-block">~ Real Pages ~</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold leading-none">Pinboard <span className="relative inline-block">wall.<svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-pen" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="6" /></svg></span></h2>
            </div>
            <p className="text-ink-light max-w-md md:text-right">Stuff actual humans pinned to the cork board. Hover to halt the conveyor. <span className="bg-highlight px-1">Pull the corner — they're stuck on properly.</span></p>
          </div>
          <div className="overflow-hidden">
            <div className="pinboard-track">
              {[...PINBOARD_TILES, ...PINBOARD_TILES].map((t, i) => (
                <figure key={`pin-${i}`} aria-hidden={i >= PINBOARD_TILES.length ? "true" : undefined} className={`pin-tack relative shrink-0 ${t.w} ${t.bg} border-2 border-ink shadow-sketch-lg p-3 ${t.rot}`}>
                  <img alt={i < PINBOARD_TILES.length ? `Page ${i + 1}` : ""} className={`w-full ${t.aspect} object-cover border border-ink/50 ${t.extra}`} src={t.src} />
                  <figcaption className="font-display text-2xl mt-3 text-ink">{t.title}</figcaption>
                  <span className="text-sm text-ink-light">{t.meta}</span>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases — alternating image+content rows */}
        <section className="py-24 bg-white relative overflow-hidden" id="use-cases">
          <svg className="absolute top-10 left-10 w-40 h-40 opacity-10 -rotate-12" viewBox="0 0 100 100"><path fill="none" stroke="#2d2d2d" strokeWidth="2" d="M10,50 Q30,10 50,50 T90,50" /></svg>
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <span className="font-display text-blue-pen text-2xl block mb-2 -rotate-1">~ Field tested ~</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold relative inline-block">Three pages from real sketchers.<svg className="absolute -bottom-3 left-0 w-full h-3 text-red-pen" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="4" /></svg></h2>
            </div>
            <div className="flex flex-col gap-24">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                <figure className="md:col-span-7 relative">
                  <div className="absolute -inset-3 bg-blue-100 blob-2 -rotate-2"></div>
                  <div className="absolute -top-5 left-12 w-32 h-10 scotch-tape rotate-2 z-30"></div>
                  <img alt="Field 01" className="relative w-full aspect-[16/10] object-cover border-2 border-ink blob-2 shadow-sketch-lg rotate-1" src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1400&q=85&auto=format&fit=crop" />
                </figure>
                <div className="md:col-span-5 relative">
                  <span className="font-display text-3xl text-red-pen rotate-[-2deg] inline-block mb-3">— Page 01 / Plan</span>
                  <h3 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">Crayoning a real Q3 roadmap.</h3>
                  <p className="text-ink-light mb-6">Three highlighters, one weekend, zero spreadsheet hugs. Maya runs product at a 12-person startup; she sketches each release as a panel, threads them with arrows, and re-shoots the whole spread on Mondays.</p>
                  <ul className="space-y-2">
                    {["Threaded arrows · 18 ideas", "3 highlighters · pen on top", "Snapshots · Mondays at 09:00"].map((t, i) => (
                      <li key={i} className="flex items-center gap-2"><span className="w-6 h-6 text-blue-pen text-sm font-bold border-2 border-ink rounded-full flex items-center justify-center bg-white">★</span> {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Row 2 reversed */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                <div className="md:col-span-5 md:order-1 order-2">
                  <span className="font-display text-3xl text-blue-pen rotate-[2deg] inline-block mb-3">— Page 02 / Brainstorm</span>
                  <h3 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">Six unread ideas, one paper trail.</h3>
                  <p className="text-ink-light mb-6">Akira teaches in Osaka. He keeps a 92-page sketchbook of fragmented lesson plans, then drags the strongest into a Pro folder for the next term. Nothing gets deleted; everything gets reopened.</p>
                  <blockquote className="relative bg-highlight border-2 border-ink p-5 blob-1 -rotate-1">
                    <p className="font-display text-2xl">"Half of what I keep is the doodle in the margin, not the lesson."</p>
                    <cite className="not-italic font-bold mt-2 block">— Akira, 5th-grade teacher</cite>
                  </blockquote>
                </div>
                <figure className="md:col-span-7 md:order-2 order-1 relative">
                  <div className="absolute -inset-3 bg-yellow-50 blob-1 rotate-2"></div>
                  <div className="absolute -top-5 right-16 w-28 h-10 scotch-tape -rotate-3 z-30"></div>
                  <img alt="Field 02" className="relative w-full aspect-[16/10] object-cover border-2 border-ink blob-1 shadow-sketch-lg -rotate-1" src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1400&q=85&auto=format&fit=crop" />
                </figure>
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                <figure className="md:col-span-7 relative">
                  <div className="absolute -inset-3 bg-red-100 blob-2 -rotate-1"></div>
                  <div className="absolute -top-5 left-1/3 w-24 h-10 scotch-tape rotate-3 z-30"></div>
                  <img alt="Field 03" className="relative w-full aspect-[16/10] object-cover border-2 border-ink blob-2 shadow-sketch-lg rotate-1" src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1400&q=85&auto=format&fit=crop" />
                </figure>
                <div className="md:col-span-5">
                  <span className="font-display text-3xl text-red-pen rotate-[-1deg] inline-block mb-3">— Page 03 / Visual Notes</span>
                  <h3 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">Camera diagrams, no manual.</h3>
                  <p className="text-ink-light mb-6">Lena buys old film cameras, sketches their guts, and figures out how to clean them on the page itself. The folder is 240 pages and growing; the sketches travel home with the cameras.</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border-2 border-ink bg-white p-3 text-center blob-2"><span className="font-display text-3xl text-red-pen block">240</span><span className="text-sm">Pages</span></div>
                    <div className="border-2 border-ink bg-highlight p-3 text-center blob-1"><span className="font-display text-3xl text-ink block">31</span><span className="text-sm">Cameras</span></div>
                    <div className="border-2 border-ink bg-blue-100 p-3 text-center blob-2"><span className="font-display text-3xl text-blue-pen block">14</span><span className="text-sm">Cities</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sketch Commandments */}
        <section className="py-24 bg-paper relative" id="commandments">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <span className="font-display text-2xl text-blue-pen rotate-[-2deg] inline-block mb-2">~ Pinned above the desk ~</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold leading-tight">The Seven Sketch Commandments.</h2>
              <p className="mt-4 text-ink-light max-w-xl mx-auto">Bent twice. Broken thrice. Re-pinned every Sunday.</p>
            </div>
            <ol className="bg-white border-2 border-ink shadow-sketch-xl divide-y-2 divide-dashed divide-ink/60 relative" style={{ borderRadius: "8px" }}>
              <div className="absolute -top-4 left-1/4 w-32 h-9 scotch-tape -rotate-2 z-20"></div>
              <div className="absolute -top-4 right-1/4 w-28 h-9 scotch-tape rotate-3 z-20"></div>
              {COMMANDMENTS.map((c, i) => (
                <li key={i} className="flex flex-col md:flex-row gap-6 md:items-center p-6 md:p-8 hover:bg-yellow-50/40 transition-colors">
                  <span className={`font-display text-7xl ${c.color} leading-none w-20 shrink-0`}>{c.i}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-3xl mb-1">{c.title}</h3>
                    <p className="text-ink-light">{c.body}</p>
                  </div>
                  <span className="font-bold text-sm border-2 border-ink rounded-full px-3 py-1 bg-white">{c.tag}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Sticky-note testimonials */}
        <section className="py-24 bg-white relative overflow-hidden" id="testimonials">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="font-display text-red-pen text-2xl rotate-[2deg] inline-block">~ From the dropbox ~</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold leading-tight">Notes left at the front desk.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {TESTIMONIALS.map((t, i) => (
                <article key={i} className={`relative ${t.bg} border-2 border-ink p-6 ${t.blob} shadow-sketch-lg ${t.rot} ${t.trans}`}>
                  <div className={`absolute -top-4 ${t.tape} w-24 h-9 scotch-tape`}></div>
                  <p className="font-display text-2xl leading-snug mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3 border-t-2 border-dashed border-ink pt-3">
                    <div className={`w-12 h-12 rounded-full ${t.initialBg} flex items-center justify-center font-display text-xl border-2 border-ink`}>{t.initial}</div>
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-sm text-ink-light">{t.role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-paper relative">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-display font-bold text-center mb-12">Pricing Plans</h2>

            <div className="max-w-4xl mx-auto bg-white border-2 border-ink shadow-sketch-lg relative rotate-1" style={{ borderRadius: "5px" }}>
              <div className="absolute -top-3 left-1/3 w-24 h-8 scotch-tape -rotate-2"></div>
              <div className="absolute -bottom-3 right-1/3 w-24 h-8 scotch-tape rotate-2"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink">

                {/* Free Plan */}
                <div className="p-8 md:p-12 text-center hover:bg-gray-50 transition-colors">
                  <div className="inline-block border-2 border-ink px-4 py-1 rounded-full mb-4 text-sm font-bold bg-gray-100">Starter</div>
                  <h3 className="text-4xl font-display font-bold mb-2">$0</h3>
                  <p className="text-gray-500 mb-8">Forever free</p>
                  <ul className="text-left space-y-4 mb-8 mx-auto max-w-[200px]">
                    <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg> Unlimited Pages</li>
                    <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg> Basic Brushes</li>
                    <li className="flex items-center gap-2 text-gray-400 decoration-ink line-through decoration-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg> Cloud Sync</li>
                  </ul>
                  <button className="w-full font-display text-xl border-2 border-ink bg-transparent px-6 py-2 blob-2 hover:bg-ink hover:text-white transition-colors">Get Free</button>
                </div>

                {/* Pro Plan */}
                <div className="p-8 md:p-12 text-center bg-yellow-50/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-highlight text-ink text-xs font-bold px-8 py-1 rotate-45 translate-x-8 translate-y-4 border-b border-ink">BEST VALUE</div>
                  <div className="inline-block border-2 border-ink px-4 py-1 rounded-full mb-4 text-sm font-bold bg-highlight shadow-sketch-sm">Pro Artist</div>
                  <h3 className="text-4xl font-display font-bold mb-2">$5<span className="text-lg font-sans">/mo</span></h3>
                  <p className="text-gray-500 mb-8">Less than a latte</p>
                  <ul className="text-left space-y-4 mb-8 mx-auto max-w-[200px]">
                    <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg> Everything in Free</li>
                    <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg> Cloud Sync</li>
                    <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg> PDF Export</li>
                  </ul>
                  <button className="w-full font-display text-xl border-2 border-ink bg-ink text-white px-6 py-2 blob-1 shadow-sketch hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Go Pro</button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-5xl font-display font-bold text-center mb-12">Q & A</h2>

            <div className="space-y-6">
              <div className="border-b-2 border-ink pb-6 border-dashed">
                <h3 className="text-2xl font-display font-bold mb-2 flex items-start">
                  <span className="text-red-pen mr-2">Q:</span> Is this app really free?
                </h3>
                <p className="text-gray-700 ml-8">
                  <span className="font-bold">A:</span> Yes! The core features are free forever. We only charge for cloud syncing because servers cost money (and we need to eat).
                </p>
              </div>
              <div className="border-b-2 border-ink pb-6 border-dashed">
                <h3 className="text-2xl font-display font-bold mb-2 flex items-start">
                  <span className="text-red-pen mr-2">Q:</span> Can I use it on Android?
                </h3>
                <p className="text-gray-700 ml-8">
                  <span className="font-bold">A:</span> Absolutely. It's a web app that works on everything. iPad, Android, even your smart fridge if it has a browser.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2 flex items-start">
                  <span className="text-red-pen mr-2">Q:</span> Who drew these icons?
                </h3>
                <p className="text-gray-700 ml-8">
                  <span className="font-bold">A:</span> Our developer, Greg. He failed art school but we think he's trying his best.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-ink bg-paper pt-16 pb-8 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-display font-bold mb-2">SKETCH_PAD</h2>
                <p className="text-gray-500">Made with <span className="text-red-pen">♥</span> and too much caffeine.</p>
              </div>

              <div className="flex flex-wrap justify-center gap-8 font-bold text-lg">
                <a href="#" className="hover:line-through decoration-2 decoration-red-pen">About</a>
                <a href="#" className="hover:line-through decoration-2 decoration-blue-pen">Blog</a>
                <a href="#" className="hover:line-through decoration-2 decoration-highlight">Privacy</a>
                <a href="#" className="hover:line-through decoration-2 decoration-ink">Contact</a>
              </div>

              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 border-2 border-ink rounded-full flex items-center justify-center hover:bg-ink hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 border-2 border-ink rounded-full flex items-center justify-center hover:bg-ink hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 border-t border-gray-300 pt-8">
              © 2023 Drawn by Hand Inc. No robots allowed. (Except you, search crawler).
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

export default HandDrawn;
