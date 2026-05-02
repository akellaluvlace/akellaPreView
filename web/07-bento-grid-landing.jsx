function BentoGridLanding() {
  const integrations = [
    { initials: "S", name: "Slack", grad: "linear-gradient(135deg, #4A154B, #ECB22E)" },
    { initials: "L", name: "Linear", grad: "linear-gradient(135deg, #5E6AD2, #8A9BFF)" },
    { initials: "G", name: "Gmail", grad: "linear-gradient(135deg, #EA4335, #FBBC04)" },
    { initials: "N", name: "Notion", grad: "linear-gradient(135deg, #000000, #2D2D2D)" },
    { initials: "Gh", name: "GitHub", grad: "linear-gradient(135deg, #181717, #4078C0)" },
    { initials: "F", name: "Figma", grad: "linear-gradient(135deg, #F24E1E, #A259FF)" },
    { initials: "A", name: "Asana", grad: "linear-gradient(135deg, #F06A6A, #E84A82)" },
    { initials: "D", name: "Discord", grad: "linear-gradient(135deg, #5865F2, #404EED)" },
    { initials: "Z", name: "Zoom", grad: "linear-gradient(135deg, #2D8CFF, #4A9EFF)" },
    { initials: "T", name: "Teams", grad: "linear-gradient(135deg, #036C70, #1A9BA1)" },
    { initials: "Tr", name: "Trello", grad: "linear-gradient(135deg, #0079BF, #51A1F5)" },
    { initials: "In", name: "Intercom", grad: "linear-gradient(135deg, #FC636B, #FF9D6E)" }
  ];

  return (
    <>
      {/* head */}
      <title>Orbit - Unified Inbox for High-Performance Teams</title>
      <meta name="description" content="Orbit is the unified inbox for high-performance teams. Connect Slack, email, and Linear into a single, flowing workspace." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary-container": "#6750a4",
                        "surface-container-low": "#f8f2fa",
                        "surface-dim": "#ded8e0",
                        "surface": "#fdf7ff",
                        "on-primary-fixed-variant": "#4f378a",
                        "background": "#fdf7ff",
                        "primary": "#4f378a",
                        "secondary": "#63597c",
                        "on-background": "#1d1b20",
                        "on-primary-fixed": "#22005d",
                        "secondary-fixed-dim": "#cdc0e9",
                        "tertiary-fixed": "#ffdf93",
                        "on-primary-container": "#e0d2ff",
                        "on-error-container": "#93000a",
                        "on-tertiary-fixed-variant": "#594400",
                        "surface-bright": "#fdf7ff",
                        "primary-fixed-dim": "#cfbcff",
                        "on-surface-variant": "#494551",
                        "on-secondary-fixed-variant": "#4b4263",
                        "tertiary-container": "#c9a74d",
                        "surface-container": "#f2ecf4",
                        "tertiary-fixed-dim": "#e7c365",
                        "tertiary": "#765b00",
                        "outline": "#7a7582",
                        "on-secondary-fixed": "#1f1635",
                        "on-tertiary": "#ffffff",
                        "error": "#ba1a1a",
                        "on-tertiary-container": "#503d00",
                        "error-container": "#ffdad6",
                        "on-tertiary-fixed": "#241a00",
                        "surface-tint": "#6750a4",
                        "surface-container-highest": "#e6e0e9",
                        "on-secondary-container": "#645a7d",
                        "secondary-fixed": "#e9ddff",
                        "on-secondary": "#ffffff",
                        "surface-container-high": "#ece6ee",
                        "inverse-primary": "#cfbcff",
                        "on-primary": "#ffffff",
                        "surface-variant": "#e6e0e9",
                        "outline-variant": "#cbc4d2",
                        "on-surface": "#1d1b20",
                        "on-error": "#ffffff",
                        "inverse-surface": "#322f35",
                        "secondary-container": "#e1d4fd",
                        "inverse-on-surface": "#f5eff7",
                        "surface-container-lowest": "#ffffff",
                        "primary-fixed": "#e9ddff"
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1.25rem",
                        "full": "9999px"
                    },
                    spacing: {
                        "bento-gap": "24px",
                        "container-padding": "32px",
                        "xl": "40px",
                        "lg": "24px",
                        "md": "16px",
                        "unit": "4px",
                        "xs": "4px",
                        "sm": "8px"
                    },
                    fontFamily: {
                        "body-lg": ["Inter", "sans-serif"],
                        "label-caps": ["Inter", "sans-serif"],
                        "display-xl": ["Inter", "sans-serif"],
                        "headline-md": ["Inter", "sans-serif"],
                        "body-md": ["Inter", "sans-serif"],
                        "headline-lg": ["Inter", "sans-serif"]
                    },
                    fontSize: {
                        "body-lg": ["clamp(1rem, 1vw + 0.875rem, 1.0625rem)", { "lineHeight": "1.6", "fontWeight": "400" }],
                        "label-caps": ["0.75rem", { "lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "display-xl": ["clamp(2.25rem, 4vw + 1rem, 3rem)", { "lineHeight": "1.1", "letterSpacing": "-0.022em", "fontWeight": "700" }],
                        "headline-lg": ["clamp(1.75rem, 2vw + 1rem, 2rem)", { "lineHeight": "1.2", "letterSpacing": "-0.015em", "fontWeight": "600" }],
                        "headline-md": ["clamp(1.25rem, 1.5vw + 0.8rem, 1.5rem)", { "lineHeight": "1.3", "fontWeight": "600" }],
                        "body-md": ["clamp(0.9375rem, 1vw + 0.8rem, 1rem)", { "lineHeight": "1.5", "fontWeight": "400" }]
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            flex-shrink: 0;
        }
        .bento-shadow {
            box-shadow: 0px 12px 36px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.02);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (prefers-reduced-motion: no-preference) {
            .bento-card:hover {
                transform: translateY(-4px);
                box-shadow: 0px 20px 40px rgba(0,0,0,0.06), 0px 8px 16px rgba(0,0,0,0.03);
            }
        }
        .glass-edge {
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.8), inset 0 0 0 1px rgba(255,255,255,0.4);
        }
        *:focus-visible {
            outline: 2px solid #4f378a;
            outline-offset: 2px;
            border-radius: inherit;
        }
        html, body { overflow-x: clip; }
        .full-bleed {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
            max-width: none;
        }
        .marquee-x { animation: marquee-slide 38s linear infinite; width: max-content; display: flex; gap: 18px; }
        .marquee-x:hover { animation-play-state: paused; }
        @keyframes marquee-slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 9px)); }
        }
        .integration-pill {
            display: inline-flex; align-items: center; gap: 10px;
            padding: 10px 18px; border-radius: 9999px;
            background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
            border: 1px solid rgba(203, 196, 210, 0.5);
            box-shadow: 0 4px 14px -4px rgba(79, 55, 138, 0.06);
            white-space: nowrap; transition: all 0.3s ease;
        }
        .integration-pill:hover { transform: translateY(-2px); border-color: rgba(79,55,138,0.3); box-shadow: 0 8px 20px -6px rgba(79,55,138,0.12); }
        .integration-pill .ipill-mark { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0; }
        .persona-card {
            position: relative;
            border-radius: 1.25rem;
            padding: 2rem 1.75rem;
            overflow: hidden;
            transition: transform 0.4s cubic-bezier(0.25,0.8,0.25,1), box-shadow 0.4s ease;
            border: 1px solid rgba(203, 196, 210, 0.5);
        }
        .persona-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -16px rgba(79, 55, 138, 0.15); }
        .persona-card .persona-glow { position: absolute; inset: -40% 50% 50% -40%; border-radius: 9999px; filter: blur(60px); opacity: 0.5; pointer-events: none; }
        .impact-tile {
            position: relative; padding: 2rem 1.5rem; border-radius: 1.5rem;
            background: linear-gradient(160deg, #ffffff 0%, #f8f2fa 100%);
            border: 1px solid rgba(203, 196, 210, 0.5);
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .impact-tile:hover { transform: translateY(-4px); border-color: rgba(79, 55, 138, 0.3); }
` }} />

      {/* body wrapper carrying classes from <body> in the source HTML */}
      <div className="bg-background text-on-background font-body-lg antialiased selection:bg-primary-container selection:text-on-primary-container">

        <header className="fixed top-0 w-full z-50 bg-white border-b border-surface-container shadow-sm">
          <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 md:px-12">
            <div className="flex items-center gap-8 lg:gap-12">
              <a href="#" className="text-xl font-bold tracking-tighter text-slate-900 rounded-md px-1 -mx-1" aria-label="Orbit Home">Orbit</a>
              <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
                <a href="#" className="text-primary font-medium border-b-2 border-primary py-1 hover:text-primary/80 transition-all rounded-sm">Product</a>
                <a href="#" className="text-on-surface-variant font-medium hover:text-on-background py-1 transition-all rounded-sm">Solutions</a>
                <a href="#" className="text-on-surface-variant font-medium hover:text-on-background py-1 transition-all rounded-sm">Integrations</a>
                <a href="#" className="text-on-surface-variant font-medium hover:text-on-background py-1 transition-all rounded-sm">Pricing</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hidden sm:inline-block text-on-surface-variant font-medium text-body-md hover:text-on-background transition-colors px-2 py-1 rounded-md">Sign In</a>
              <button type="button" className="inline-flex items-center justify-center bg-primary text-on-primary px-4 py-2 rounded-lg font-medium text-body-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm active:scale-95">Get Started</button>
            </div>
          </div>
        </header>

        <main className="flex flex-col gap-16 px-4 pt-0 pb-16 mx-auto max-w-screen-2xl sm:gap-24 sm:px-6 md:px-12 md:pb-24">

          {/* Hero — full-bleed cinematic */}
          <section className="full-bleed relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: "#0e0a1f" }}>

            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=85&auto=format&fit=crop"
                 alt="" aria-hidden="true"
                 className="absolute inset-0 w-full h-full object-cover scale-105 grayscale-[20%]"
                 style={{ filter: "brightness(0.55) saturate(1.1)" }} />

            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(14,10,31,0.45) 0%, rgba(14,10,31,0.20) 30%, rgba(14,10,31,0.55) 70%, rgba(14,10,31,0.95) 100%)" }}></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 120% 80% at 50% 45%, transparent 0%, rgba(14,10,31,0.4) 70%, rgba(14,10,31,0.85) 100%)" }}></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(79,55,138,0.18) 0%, transparent 30%, transparent 70%, rgba(201,167,77,0.10) 100%)" }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(155,108,236,0.35), transparent 70%)", filter: "blur(40px)" }}></div>
            <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)" }}></div>

            <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-12 pt-24 md:pt-32 pb-12">
              <div className="max-w-3xl">

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-200/95">Version 2 · Now in GA</span>
                </div>

                <h1 className="font-bold tracking-tight text-white leading-[0.95] text-[44px] sm:text-6xl md:text-7xl lg:text-[96px] mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                  One Orbit.<br />
                  <span className="italic font-light text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #ffffff 0%, #cfbcff 40%, #e7c365 100%)" }}>All your work.</span>
                </h1>

                <p className="text-lg md:text-xl lg:text-2xl text-white/85 leading-relaxed max-w-2xl mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  The unified inbox for high-performance teams. Slack, email, and Linear collapse into a single, flowing workspace — with one keyboard shortcut.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button type="button" className="group inline-flex items-center justify-center gap-2 bg-white px-7 py-4 rounded-xl font-bold text-base shadow-[0_10px_40px_-8px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all" style={{ color: "#0e0a1f" }}>
                    Get Started — it&apos;s free
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                  <button type="button" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-medium text-base text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all">
                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                    Watch demo · 90s
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
                    <span className="text-xs uppercase tracking-widest text-white/70 font-semibold">SOC-2 Type II</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white tabular-nums">12k+</span>
                    <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">Teams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white tabular-nums">4.9</span>
                    <span className="flex gap-0.5 text-amber-300">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </span>
                    <span className="text-xs uppercase tracking-widest text-white/60 font-semibold hidden sm:inline">App Store</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/50">
              <span className="text-[9px] uppercase tracking-[0.3em] font-semibold">Scroll</span>
              <span className="material-symbols-outlined text-[16px] animate-bounce">arrow_downward</span>
            </div>
          </section>

          {/* Bento grid */}
          <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-bento-gap md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3" aria-label="Features Grid">

            {/* Tile 1: Slack Preview */}
            <article className="bento-card bento-shadow glass-edge relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-surface-container-highest bg-white p-lg md:col-span-2 lg:col-span-2 lg:row-span-1">
              <header>
                <h3 className="font-label-caps text-on-surface-variant uppercase tracking-wider">Unified Comms</h3>
              </header>
              <div className="relative z-10 flex flex-1 flex-col justify-center gap-3">
                <div className="flex items-start gap-3 rounded-xl border border-surface-container-highest bg-surface-container-lowest p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container">
                    <span className="material-symbols-outlined text-on-secondary-container text-base" aria-hidden="true">person</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-body-md text-on-surface">Sarah J.</p>
                      <time className="text-xs text-outline" dateTime="10:42">10:42 AM</time>
                    </div>
                    <p className="mt-0.5 text-sm text-on-surface-variant text-pretty">Can you review the PR for the new auth flow?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-surface-container-highest bg-surface-container-low p-4 shadow-sm ml-8 opacity-90">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-body-md text-on-surface">You</p>
                      <time className="text-xs text-outline" dateTime="10:45">10:45 AM</time>
                    </div>
                    <p className="mt-0.5 text-sm text-on-surface-variant text-pretty">On it. Looks solid so far.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none"></div>
            </article>

            {/* Tile 2: 3D Object */}
            <article className="bento-card bento-shadow glass-edge relative flex flex-col items-center justify-between overflow-hidden rounded-2xl bg-[#E1F0DA] p-lg md:col-span-1 lg:col-span-1 lg:row-span-2">
              <header className="w-full text-center z-10">
                <h3 className="font-label-caps text-[#4A6836] uppercase tracking-wider">Unblock</h3>
              </header>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbrLlm82t9rSZrvtJtAhmQBXqQe5JzB20N1zMh5B1OmU5uqwDaiA9CGtLimpGgaIHCKBzT2riLi6IseafNZJoJkdjGp6G1q6_3Sr1N8yAlTgYkJvhP_j5ztNbKDp4DtHL8E5mXgnig0yHBY7aJsA8RXzDKbr2jneRzZn8ZIIqcxuTvIQaWg7BzJ1VjVgTWZR21kN4p_G21UKk4ZfTiaCgyzR0BScBpZUIHhDucKTrTSzJAcBjnJJMnrSTk1lts1XDpScYNl8ADYUI-"
                alt="Abstract soft green and beige 3D shapes representing fluid workflow"
                className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-multiply"
                width="400"
                height="600"
                loading="lazy"
                decoding="async"
              />
              <div className="relative z-10 mt-auto flex w-full flex-col items-center rounded-xl border border-white/40 bg-white/60 p-4 text-center shadow-sm backdrop-blur-md transition-colors hover:bg-white/70">
                <span className="material-symbols-outlined mb-2 text-3xl text-[#4A6836]" aria-hidden="true">vpn_key</span>
                <p className="font-medium leading-tight text-body-md text-[#4A6836]">Access Everything.</p>
              </div>
            </article>

            {/* Tile 3: Typography Callout */}
            <article className="bento-card bento-shadow glass-edge relative flex flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A2130] to-[#252F45] p-lg md:col-span-1 lg:col-span-1 lg:row-span-1">
              <a href="#" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:bg-white/10 hover:scale-105" aria-label="Learn more about focus mode">
                <span className="material-symbols-outlined text-lg" aria-hidden="true">north_east</span>
              </a>
              <h2 className="font-headline-lg text-white">Focus.</h2>
              <p className="mt-2 text-slate-300 text-body-md">Zero context switching.</p>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            </article>

            {/* Tile 4: Linear Ticket */}
            <article className="bento-card bento-shadow glass-edge relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[#F2D8C9] bg-gradient-to-b from-[#FDF0E6] to-[#FAFAF9] p-lg md:col-span-2 lg:col-span-2 lg:row-span-1">
              <header>
                <h3 className="font-label-caps text-[#A0623A] uppercase tracking-wider">Issue Tracking</h3>
              </header>
              <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#F2D8C9]/60 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-surface-container px-2 py-1 text-xs font-medium text-outline tabular-nums">ORB-142</span>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A0623A] text-white" aria-hidden="true">
                      <span className="material-symbols-outlined text-[12px]">priority_high</span>
                    </span>
                    <img
                      src="https://ui-avatars.com/api/?name=David+C&background=f2ecf4&color=494551&size=24"
                      alt="Assignee avatar"
                      className="h-6 w-6 rounded-full border border-white"
                      width="24"
                      height="24"
                      loading="lazy"
                    />
                  </div>
                </div>
                <p className="font-medium leading-snug text-body-lg text-on-surface text-pretty">Implement Webhooks for external integrations</p>
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <span className="relative flex h-3 w-3" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A0623A] opacity-20"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#A0623A] bg-white"></span>
                  </span>
                  <span className="text-xs font-medium text-outline">In Progress</span>
                </div>
              </div>
            </article>

            {/* Tile 5: Velocity Bars */}
            <article className="bento-card bento-shadow glass-edge flex flex-col gap-4 rounded-2xl border border-surface-container-highest bg-white p-lg md:col-span-2 lg:col-span-1 lg:row-span-1">
              <header>
                <h3 className="font-label-caps text-on-surface-variant uppercase tracking-wider">Velocity</h3>
              </header>
              <div className="relative flex flex-1 items-end gap-2 pb-2 mt-4">
                <div className="absolute inset-0 flex flex-col justify-between border-b border-surface-container pb-2" aria-hidden="true">
                  <div className="w-full border-t border-dashed border-surface-container-highest"></div>
                  <div className="w-full border-t border-dashed border-surface-container-highest"></div>
                  <div className="w-full border-t border-dashed border-surface-container-highest"></div>
                </div>
                <div className="relative z-10 h-[30%] w-full rounded-t-md bg-primary-container/20 transition-all hover:bg-primary-container/30"></div>
                <div className="relative z-10 h-[50%] w-full rounded-t-md bg-primary-container/40 transition-all hover:bg-primary-container/50"></div>
                <div className="relative z-10 h-[75%] w-full rounded-t-md bg-primary-container/60 transition-all hover:bg-primary-container/70"></div>
                <div className="relative z-10 h-[100%] w-full rounded-t-md bg-primary-container transition-all hover:brightness-110">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-surface-container-highest px-1.5 py-0.5 text-xs font-bold text-primary shadow-sm tabular-nums">+42%</div>
                </div>
              </div>
            </article>

            {/* Tile 6: Command Palette */}
            <article className="bento-card bento-shadow glass-edge relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl border border-surface-container-highest bg-surface-container-lowest p-xl md:col-span-2 md:flex-row lg:col-span-4 lg:row-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low to-transparent opacity-60 pointer-events-none"></div>
              <div className="relative z-10 flex max-w-md flex-col gap-4">
                <header>
                  <h3 className="font-label-caps text-primary uppercase tracking-wider">Keyboard First</h3>
                  <h2 className="mt-2 font-headline-lg text-on-background text-balance">Command your day.</h2>
                </header>
                <p className="text-on-surface-variant text-body-md text-pretty">
                  Press <kbd className="font-sans font-medium">Cmd+K</kbd> to search across every tool, draft replies, or create issues without lifting your hands from the keyboard.
                </p>
              </div>
              <div className="relative z-10 flex w-full max-w-sm items-center gap-4 rounded-2xl border border-surface-container-highest bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-transform hover:scale-[1.02]">
                <span className="material-symbols-outlined text-outline" aria-hidden="true">search</span>
                <span className="flex-1 text-outline text-body-lg">Search or jump to...</span>
                <div className="flex gap-1" aria-hidden="true">
                  <kbd className="flex h-6 min-w-[24px] items-center justify-center rounded bg-surface-container px-1.5 text-xs font-medium text-on-surface-variant">⌘</kbd>
                  <kbd className="flex h-6 min-w-[24px] items-center justify-center rounded bg-surface-container px-1.5 text-xs font-medium text-on-surface-variant">K</kbd>
                </div>
              </div>
            </article>
          </section>

          {/* Integrations Marquee — soft lavender wash, full-bleed */}
          <section className="full-bleed px-4 sm:px-6 md:px-12 py-12 md:py-16 overflow-hidden" aria-label="Integrations" style={{ background: "linear-gradient(180deg, transparent 0%, #f5eefb 25%, #efe5f7 75%, transparent 100%)" }}>
            <div className="max-w-6xl mx-auto mb-8 flex items-end justify-between gap-6">
              <div>
                <h3 className="font-label-caps uppercase tracking-[0.2em] text-primary mb-2">// Integrations</h3>
                <h2 className="font-headline-lg text-on-background text-balance">120+ tools, one orbit.</h2>
              </div>
              <span className="hidden md:block text-sm text-on-surface-variant">Auto-sync · Hover to pause</span>
            </div>
            <div className="relative">
              <div className="marquee-x py-2">
                {[...integrations, ...integrations].map((it, i) => (
                  <span key={i} className="integration-pill">
                    <span className="ipill-mark" style={{ background: it.grad }}>{it.initials}</span>
                    <span className="font-medium text-on-background">{it.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="mx-auto w-full max-w-4xl py-12 text-center" aria-label="User Testimonial">
            <figure className="flex flex-col items-center">
              <span className="material-symbols-outlined mb-6 text-5xl text-primary-container opacity-40" aria-hidden="true">format_quote</span>
              <blockquote className="mb-8 max-w-[40ch] text-balance font-headline-md font-medium leading-relaxed text-on-background">
                "Orbit didn't just organize my inbox; it rewired how our entire engineering team communicates. It's the quietest my mind has felt in years."
              </blockquote>
              <figcaption className="flex items-center justify-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-surface-container-high bg-surface-container-highest shadow-sm">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsT144Gaukg3VATBZ1_KP1JFPIhP8R46oUWfYzFOE0tLqaAFk6CieufXLkAsy-AJGlnsP-KRy6mSarVbo0CWDIt1kV51Wmin_bCguhM_2KPCUwKrfcni9RLNTf7lUZd3maNy-cap9ON_5TIP4phcvELcQfNyWB5n8bWmgVIEvmqMo7aaPPl_ncpYilTQsCglHssb1HXAMkdnB_Uela5v5UcRh0kFLiqFa0DbYujeIUxJhDkgCAdp_olroSr_7xho0uq514Mp1vEPzW"
                    alt="David Chen, Lead Engineer at Acme Corp"
                    className="h-full w-full object-cover"
                    width="56"
                    height="56"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-on-background text-body-lg">David Chen</p>
                  <p className="text-on-surface-variant text-body-md">Lead Engineer, Acme Corp</p>
                </div>
              </figcaption>
            </figure>
          </section>

          {/* Use Cases / Personas — warm cream wash, full-bleed */}
          <section className="full-bleed px-4 sm:px-6 md:px-12 py-16 md:py-24 overflow-hidden" aria-labelledby="usecases-heading" style={{ background: "linear-gradient(180deg, transparent 0%, #fdf6e8 30%, #fbf1d9 70%, transparent 100%)" }}>
            <div className="mx-auto w-full max-w-6xl">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <span className="font-label-caps uppercase tracking-[0.2em] text-primary mb-3 block">// Built for every craft</span>
              <h2 id="usecases-heading" className="font-headline-lg text-on-background text-balance mb-3">One tool, three crafts.</h2>
              <p className="text-on-surface-variant text-body-lg">Engineering, design, and product — each gets the lens they need.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <article className="persona-card flex flex-col" style={{ background: "linear-gradient(160deg, #f8f2fa 0%, #ffffff 100%)" }}>
                <div className="persona-glow" style={{ background: "radial-gradient(circle, rgba(79,55,138,0.5), transparent 70%)" }}></div>
                <div className="relative z-10 flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">code</span>
                  </div>
                  <div>
                    <p className="font-label-caps text-primary uppercase tracking-wider text-[10px]">For Engineers</p>
                    <h3 className="font-headline-md text-on-background mt-0.5">Ship without the slack.</h3>
                  </div>
                </div>
                <p className="relative z-10 text-on-surface-variant text-body-md mb-6 flex-1 leading-relaxed">PRs, alerts, and incidents land in one stream. Triage in 30 seconds; deep-work the rest of the day.</p>
                <div className="relative z-10 flex items-end justify-between pt-5 border-t border-outline-variant/40">
                  <div>
                    <p className="font-display-xl text-primary leading-none tabular-nums">3.7×</p>
                    <p className="text-xs text-on-surface-variant mt-1">Faster PR turnaround</p>
                  </div>
                  <div className="flex -space-x-2">
                    <img src="https://ui-avatars.com/api/?name=Maya+K&background=4f378a&color=fff&size=32" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                    <img src="https://ui-avatars.com/api/?name=Dev+T&background=63597c&color=fff&size=32" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                    <img src="https://ui-avatars.com/api/?name=R+P&background=765b00&color=fff&size=32" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                  </div>
                </div>
              </article>

              <article className="persona-card flex flex-col" style={{ background: "linear-gradient(160deg, #fff5e6 0%, #ffffff 100%)" }}>
                <div className="persona-glow" style={{ background: "radial-gradient(circle, rgba(201,167,77,0.55), transparent 70%)" }}></div>
                <div className="relative z-10 flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #c9a74d, #e7c365)", color: "#503d00" }}>
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">brush</span>
                  </div>
                  <div>
                    <p className="font-label-caps uppercase tracking-wider text-[10px]" style={{ color: "#765b00" }}>For Designers</p>
                    <h3 className="font-headline-md text-on-background mt-0.5">Feedback, not noise.</h3>
                  </div>
                </div>
                <p className="relative z-10 text-on-surface-variant text-body-md mb-6 flex-1 leading-relaxed">Threaded reviews from PM, eng, and stakeholders pinned to each Figma frame — never search a thread again.</p>
                <div className="relative z-10 flex items-end justify-between pt-5 border-t border-outline-variant/40">
                  <div>
                    <p className="font-display-xl leading-none tabular-nums" style={{ color: "#765b00" }}>87%</p>
                    <p className="text-xs text-on-surface-variant mt-1">Less context switching</p>
                  </div>
                  <div className="flex -space-x-2">
                    <img src="https://ui-avatars.com/api/?name=Sara+L&background=765b00&color=fff&size=32" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                    <img src="https://ui-avatars.com/api/?name=Anna+W&background=c9a74d&color=fff&size=32" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                  </div>
                </div>
              </article>

              <article className="persona-card flex flex-col" style={{ background: "linear-gradient(160deg, #e8f4f8 0%, #ffffff 100%)" }}>
                <div className="persona-glow" style={{ background: "radial-gradient(circle, rgba(99,89,124,0.4), transparent 70%)" }}></div>
                <div className="relative z-10 flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #63597c, #8a7fab)", color: "#fff" }}>
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">conversion_path</span>
                  </div>
                  <div>
                    <p className="font-label-caps uppercase tracking-wider text-[10px]" style={{ color: "#4b4263" }}>For PMs</p>
                    <h3 className="font-headline-md text-on-background mt-0.5">Decisions, in context.</h3>
                  </div>
                </div>
                <p className="relative z-10 text-on-surface-variant text-body-md mb-6 flex-1 leading-relaxed">Customer feedback from Intercom, sentiment from sales calls, and roadmap blockers — visible in one window.</p>
                <div className="relative z-10 flex items-end justify-between pt-5 border-t border-outline-variant/40">
                  <div>
                    <p className="font-display-xl leading-none tabular-nums" style={{ color: "#4b4263" }}>4.6 hr</p>
                    <p className="text-xs text-on-surface-variant mt-1">Reclaimed weekly</p>
                  </div>
                  <div className="flex -space-x-2">
                    <img src="https://ui-avatars.com/api/?name=Sam+P&background=4b4263&color=fff&size=32" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                    <img src="https://ui-avatars.com/api/?name=J+R&background=8a7fab&color=fff&size=32" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                    <img src="https://ui-avatars.com/api/?name=L+K&background=63597c&color=fff&size=32" alt="" className="w-7 h-7 rounded-full border-2 border-white" />
                  </div>
                </div>
              </article>
            </div>
            </div>
          </section>

          {/* Impact / Stats Strip — cool ice-blue wash, full-bleed */}
          <section className="full-bleed px-4 sm:px-6 md:px-12 py-16 md:py-24 overflow-hidden" aria-label="Impact metrics" style={{ background: "linear-gradient(180deg, transparent 0%, #eaf2f8 30%, #dde9f4 70%, transparent 100%)" }}>
            <div className="mx-auto w-full max-w-6xl">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="font-label-caps uppercase tracking-[0.2em] text-primary mb-3 block">// Numbers that compound</span>
              <h2 className="font-headline-lg text-on-background text-balance">The orbit, in motion.</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="impact-tile text-center">
                <p className="font-display-xl text-primary leading-none tabular-nums">12k+</p>
                <p className="text-xs text-on-surface-variant mt-3 uppercase tracking-widest font-semibold">Teams</p>
                <p className="text-[10px] text-outline mt-1.5">From Series A to F500</p>
              </div>
              <div className="impact-tile text-center" style={{ background: "linear-gradient(160deg, #ffffff 0%, #fff5e6 100%)" }}>
                <p className="font-display-xl leading-none tabular-nums" style={{ color: "#765b00" }}>4.6 hr</p>
                <p className="text-xs text-on-surface-variant mt-3 uppercase tracking-widest font-semibold">Saved / week</p>
                <p className="text-[10px] text-outline mt-1.5">Median across team plans</p>
              </div>
              <div className="impact-tile text-center" style={{ background: "linear-gradient(160deg, #ffffff 0%, #e8f4f8 100%)" }}>
                <p className="font-display-xl leading-none tabular-nums" style={{ color: "#4b4263" }}>2.4M</p>
                <p className="text-xs text-on-surface-variant mt-3 uppercase tracking-widest font-semibold">Messages / day</p>
                <p className="text-[10px] text-outline mt-1.5">Triaged automatically</p>
              </div>
              <div className="impact-tile text-center">
                <p className="font-display-xl text-primary leading-none tabular-nums">87%</p>
                <p className="text-xs text-on-surface-variant mt-3 uppercase tracking-widest font-semibold">Less switching</p>
                <p className="text-[10px] text-outline mt-1.5">Self-reported, n=1,400</p>
              </div>
            </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="mx-auto w-full max-w-6xl pt-4" aria-labelledby="pricing-heading">
            <div className="mb-14 text-center">
              <h2 id="pricing-heading" className="mb-4 font-headline-lg text-on-background text-balance">Simple, transparent pricing.</h2>
              <p className="text-on-surface-variant text-body-lg">Choose the perfect plan for your workflow.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
              {/* Free */}
              <article className="bento-shadow flex flex-col rounded-2xl border border-surface-container-highest bg-white p-8 transition-transform hover:-translate-y-1">
                <header className="mb-6">
                  <h3 className="mb-2 font-headline-md text-on-background">Free</h3>
                  <p className="text-on-surface-variant text-body-md">For individuals getting started.</p>
                </header>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="font-display-xl tracking-tight tabular-nums">$0</span>
                  <span className="text-on-surface-variant font-medium">/mo</span>
                </div>
                <ul className="mb-8 flex flex-1 flex-col gap-4" aria-label="Free plan features">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-full bg-primary-container/10 p-0.5 text-sm text-primary" aria-hidden="true">check</span>
                    <span className="text-body-md">2 Integrations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-full bg-primary-container/10 p-0.5 text-sm text-primary" aria-hidden="true">check</span>
                    <span className="text-body-md">7-day history</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <span className="material-symbols-outlined p-0.5 text-sm text-outline" aria-hidden="true">close</span>
                    <span className="text-body-md line-through">AI Triage</span>
                  </li>
                </ul>
                <button type="button" className="w-full rounded-xl border border-outline-variant py-3 font-medium text-body-lg transition-colors hover:bg-surface-container-low">
                  Start Free
                </button>
              </article>

              {/* Pro */}
              <article className="bento-shadow relative flex flex-col overflow-hidden rounded-2xl bg-primary-container p-8 shadow-xl transition-transform md:-translate-y-4 hover:-translate-y-5">
                <div className="absolute right-0 top-0 rounded-bl-xl bg-on-primary-container px-4 py-1.5 text-xs font-bold tracking-wider text-primary-container shadow-sm">
                  POPULAR
                </div>
                <header className="mb-6">
                  <h3 className="mb-2 font-headline-md text-on-primary-container">Pro</h3>
                  <p className="text-on-primary-container/80 text-body-md">For high-performance teams.</p>
                </header>
                <div className="mb-8 flex items-baseline gap-1 text-on-primary-container">
                  <span className="font-display-xl tracking-tight tabular-nums">$12</span>
                  <span className="text-on-primary-container/80 font-medium">/mo</span>
                </div>
                <ul className="mb-8 flex flex-1 flex-col gap-4 text-on-primary-container" aria-label="Pro plan features">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-full bg-on-primary-container/10 p-0.5 text-sm" aria-hidden="true">check</span>
                    <span className="text-body-md">Unlimited Integrations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-full bg-on-primary-container/10 p-0.5 text-sm" aria-hidden="true">check</span>
                    <span className="text-body-md">Unlimited history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-full bg-on-primary-container/10 p-0.5 text-sm" aria-hidden="true">check</span>
                    <span className="font-medium text-body-md">AI Triage</span>
                  </li>
                </ul>
                <button type="button" className="w-full rounded-xl bg-on-primary-container py-3 font-bold text-primary-container shadow-sm transition-all hover:bg-white">
                  Get Pro
                </button>
              </article>

              {/* Enterprise */}
              <article className="bento-shadow flex flex-col rounded-2xl border border-surface-container-highest bg-white p-8 transition-transform hover:-translate-y-1">
                <header className="mb-6">
                  <h3 className="mb-2 font-headline-md text-on-background">Enterprise</h3>
                  <p className="text-on-surface-variant text-body-md">For large organizations.</p>
                </header>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="font-headline-lg tracking-tight">Custom</span>
                </div>
                <ul className="mb-8 flex flex-1 flex-col gap-4" aria-label="Enterprise plan features">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-full bg-primary-container/10 p-0.5 text-sm text-primary" aria-hidden="true">check</span>
                    <span className="text-body-md">SAML SSO &amp; SCIM</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-full bg-primary-container/10 p-0.5 text-sm text-primary" aria-hidden="true">check</span>
                    <span className="text-body-md">Dedicated Support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-full bg-primary-container/10 p-0.5 text-sm text-primary" aria-hidden="true">check</span>
                    <span className="text-body-md">Custom SLA</span>
                  </li>
                </ul>
                <button type="button" className="w-full rounded-xl border border-outline-variant py-3 font-medium text-body-lg transition-colors hover:bg-surface-container-low">
                  Contact Sales
                </button>
              </article>
            </div>
          </section>
        </main>

        <footer className="mt-20 w-full border-t border-surface-container-highest bg-surface-container-lowest py-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 sm:px-6 md:flex-row md:justify-between md:px-12">
            <div className="flex flex-col items-center gap-2 md:items-start md:gap-1">
              <span className="text-lg font-bold tracking-tight text-on-background">Orbit</span>
              <p className="text-sm text-on-surface-variant">© 2024 Orbit Technologies Inc. Designed for Focus.</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4" aria-label="Footer Navigation">
              <a href="#" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary rounded px-1 -mx-1">Privacy Policy</a>
              <a href="#" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary rounded px-1 -mx-1">Terms of Service</a>
              <a href="#" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary rounded px-1 -mx-1">Security</a>
              <a href="#" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary rounded px-1 -mx-1">Status</a>
              <a href="#" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary rounded px-1 -mx-1">Twitter</a>
              <a href="#" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary rounded px-1 -mx-1">LinkedIn</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

export default BentoGridLanding;
