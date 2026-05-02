function DeveloperPortfolio() {
  return (
    <>
      {/* head */}
      <title>lindqvist.dev - Senior Infra Engineer</title>
      <meta name="description" content="Erik Lindqvist - Senior Infra Engineer portfolio. Exploring distributed systems, Kubernetes, and high-performance code." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "outline-variant": "#3e4a3d",
                        "tertiary-fixed": "#e2e2e2",
                        "on-primary-fixed-variant": "#005321",
                        "on-secondary-fixed": "#001b3d",
                        "surface": "#111317",
                        "tertiary-container": "#bababa",
                        "inverse-surface": "#e2e2e6",
                        "surface-container": "#1e2023",
                        "primary-container": "#52d273",
                        "on-tertiary-fixed-variant": "#454747",
                        "surface-container-high": "#282a2d",
                        "on-surface-variant": "#bdcaba",
                        "inverse-primary": "#006e2f",
                        "on-secondary": "#003063",
                        "secondary": "#a9c7ff",
                        "on-primary": "#003915",
                        "surface-variant": "#333538",
                        "on-tertiary": "#2f3131",
                        "tertiary": "#d6d6d6",
                        "on-error": "#690005",
                        "on-error-container": "#ffdad6",
                        "on-tertiary-fixed": "#1a1c1c",
                        "on-surface": "#e2e2e6",
                        "secondary-container": "#004a95",
                        "on-secondary-fixed-variant": "#00468c",
                        "on-primary-container": "#005623",
                        "error-container": "#93000a",
                        "primary-fixed": "#7dfc98",
                        "surface-container-lowest": "#0c0e11",
                        "background": "#111317",
                        "secondary-fixed": "#d6e3ff",
                        "tertiary-fixed-dim": "#c6c6c6",
                        "on-tertiary-container": "#494a4b",
                        "surface-bright": "#37393d",
                        "surface-container-low": "#1a1c1f",
                        "surface-dim": "#111317",
                        "secondary-fixed-dim": "#a9c7ff",
                        "surface-tint": "#60df7e",
                        "primary-fixed-dim": "#60df7e",
                        "on-primary-fixed": "#002109",
                        "primary": "#70ef8c",
                        "outline": "#879485",
                        "surface-container-highest": "#333538",
                        "inverse-on-surface": "#2f3034",
                        "on-background": "#e2e2e6",
                        "error": "#ffb4ab",
                        "on-secondary-container": "#97bdff"
                    },
                    "fontFamily": {
                        "h2": ["JetBrains Mono", "monospace"],
                        "h1": ["JetBrains Mono", "monospace"],
                        "label-caps": ["JetBrains Mono", "monospace"],
                        "body": ["Inter", "sans-serif"],
                        "h3": ["JetBrains Mono", "monospace"],
                        "code": ["JetBrains Mono", "monospace"],
                        "meta": ["JetBrains Mono", "monospace"]
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .terminal-shadow {
            box-shadow: 6px 6px 0px 0px #000000;
        }
        .ascii-border {
            border: 1px solid #2D3239;
            position: relative;
        }
        .ascii-border::before, .ascii-border::after {
            content: '+';
            position: absolute;
            color: var(--tw-colors-primary, #70ef8c);
            font-size: 14px;
            line-height: 1;
            font-family: 'JetBrains Mono', monospace;
            background-color: var(--tw-colors-surface-container, #1e2023);
        }
        .ascii-border-tl::before { top: -6px; left: -4px; padding: 0 2px; }
        .ascii-border-br::after { bottom: -6px; right: -4px; padding: 0 2px; }
        .blinking-cursor {
            display: inline-block;
            width: 8px;
            height: 16px;
            background-color: var(--tw-colors-primary-container, #52D273);
            animation: blink 1s step-end infinite;
            vertical-align: middle;
            margin-left: 4px;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        @keyframes term-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); }
        }
        .term-marquee-track {
            animation: term-marquee 55s linear infinite;
            width: max-content;
            display: flex;
            gap: 24px;
        }
        .term-marquee-track:hover { animation-play-state: paused; }
        .term-bar {
            background: linear-gradient(90deg, #70ef8c 0%, #60df7e 100%);
        }
        .scanline-veneer {
            background-image: repeating-linear-gradient(0deg, rgba(112,239,140,0.04) 0 1px, transparent 1px 3px);
            mix-blend-mode: overlay;
        }
        @media (prefers-reduced-motion: reduce) {
            .blinking-cursor { animation: none; opacity: 1; }
            .term-marquee-track { animation: none; }
            html { scroll-behavior: auto; }
        }
` }} />

      {/* HTML had `<html class="dark scroll-smooth">` and these body classes */}
      <div className="dark bg-background text-on-background font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-background antialiased">

        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-primary text-background px-4 py-2 font-code text-sm font-bold rounded-sm outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all">
          Skip to main content
        </a>

        {/* TopNavBar */}
        <header className="w-full bg-[#0F1114]/95 backdrop-blur-md border-b border-[#2D3239] sticky top-0 z-50">
          <nav className="flex justify-between items-center gap-3 w-full px-4 py-4 max-w-[1100px] mx-auto sm:px-6" aria-label="Main Navigation">
            <a className="font-code font-bold text-[#52D273] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1 py-0.5 text-sm sm:text-base hover:text-primary transition-colors flex items-center group" href="/" aria-label="Home">
              <span className="text-[#52D273]/70 mr-1 group-hover:text-primary transition-colors" aria-hidden="true">&gt;_</span>
              <span className="sm:hidden">ROOT@~</span>
              <span className="hidden sm:inline">ROOT@PORTFOLIO:~</span>
            </a>
            <div className="hidden md:flex gap-6 font-code uppercase tracking-tighter text-sm">
              <a className="text-[#2D3239] hover:text-[#0F1114] hover:bg-[#52D273] focus-visible:bg-[#52D273] focus-visible:text-[#0F1114] focus-visible:outline-none transition-colors duration-150 cursor-pointer active:translate-y-0.5 px-3 py-1.5 rounded-sm font-semibold" href="#posts">POSTS</a>
              <a className="text-[#2D3239] hover:text-[#0F1114] hover:bg-[#52D273] focus-visible:bg-[#52D273] focus-visible:text-[#0F1114] focus-visible:outline-none transition-colors duration-150 cursor-pointer active:translate-y-0.5 px-3 py-1.5 rounded-sm font-semibold" href="#work">WORK</a>
              <a className="text-[#2D3239] hover:text-[#0F1114] hover:bg-[#52D273] focus-visible:bg-[#52D273] focus-visible:text-[#0F1114] focus-visible:outline-none transition-colors duration-150 cursor-pointer active:translate-y-0.5 px-3 py-1.5 rounded-sm font-semibold" href="#talks">TALKS</a>
              <a className="text-[#2D3239] hover:text-[#0F1114] hover:bg-[#52D273] focus-visible:bg-[#52D273] focus-visible:text-[#0F1114] focus-visible:outline-none transition-colors duration-150 cursor-pointer active:translate-y-0.5 px-3 py-1.5 rounded-sm font-semibold" href="#contact">CONTACT</a>
            </div>
            <button className="md:hidden text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1 flex items-center justify-center transition-colors hover:bg-surface-variant" aria-label="Toggle Navigation Menu" aria-expanded="false">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">terminal</span>
            </button>
          </nav>
        </header>

        <main id="main-content" className="flex-grow w-full max-w-[1100px] mx-auto px-4 py-8 sm:py-16 flex flex-col gap-12 sm:gap-20">

          {/* Hero / Terminal whoami */}
          <section className="w-full flex justify-center scroll-mt-24" aria-labelledby="hero-heading">
            <h1 id="hero-heading" className="sr-only">Erik Lindqvist - Senior Infra Engineer</h1>

            <div className="w-full max-w-3xl bg-surface-container border border-outline-variant terminal-shadow p-4 sm:p-6 flex flex-col gap-4 font-code text-[11px] sm:text-[13px] leading-relaxed relative rounded-[2px]">
              <div className="absolute top-0 left-0 w-full h-8 border-b border-outline-variant bg-surface-container-high flex items-center px-3 justify-between sm:px-4 rounded-t-[2px]">
                <span className="text-on-surface-variant text-[11px] sm:text-[12px] font-semibold">lindqvist@dev: ~</span>
                <div className="flex gap-2" aria-hidden="true">
                  <div className="w-3 h-3 rounded-none bg-surface-variant border border-outline-variant transition-colors hover:bg-error/80"></div>
                  <div className="w-3 h-3 rounded-none bg-surface-variant border border-outline-variant transition-colors hover:bg-[#f6e05e]/80"></div>
                  <div className="w-3 h-3 rounded-none bg-surface-variant border border-outline-variant transition-colors hover:bg-primary/80"></div>
                </div>
              </div>

              <div className="mt-8 text-primary whitespace-pre overflow-x-auto text-[10px] sm:text-[12px] leading-[1.2] pb-2 scrollbar-hide select-none" aria-hidden="true">
{` _      ___ _   _ ____   _____     _____ ____ _____
| |    |_ _| \\ | |  _ \\ / _ \\ \\   / /_ _/ ___|_   _|
| |     | ||  \\| | | | | | | \\ \\ / / | |\\___ \\ | |
| |___  | || |\\  | |_| | |_| |\\ V /  | | ___) || |
|_____||___|_| \\_|____/ \\__\\_\\ \\_/  |___|____/ |_|  `}
              </div>

              <div className="mt-4 text-on-surface">
                <span className="text-primary font-bold">guest@lindqvist.dev</span><span className="text-on-surface-variant">:$</span> <span className="text-secondary">whoami --verbose</span>
              </div>

              <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-x-4 gap-y-3 mt-4">
                <div className="text-on-surface-variant font-semibold">Name:</div>
                <div className="text-on-surface break-words font-bold text-[13px] sm:text-[15px] text-primary">Erik Lindqvist</div>

                <div className="text-on-surface-variant font-semibold">Role:</div>
                <div className="text-on-surface break-words text-inverse-surface">Senior Infra Engineer</div>

                <div className="text-on-surface-variant font-semibold">Location:</div>
                <div className="text-on-surface break-words text-inverse-surface">Stockholm, SE</div>

                <div className="text-on-surface-variant font-semibold">Bio:</div>
                <div className="text-on-surface break-words text-pretty max-w-[65ch] text-on-surface-variant">Building resilient distributed systems, fighting latency, and writing high-performance code. Passionate about observability and cloud-native architecture.</div>

                <div className="text-on-surface-variant font-semibold">Stack:</div>
                <div className="text-on-surface break-words text-tertiary">
                  [ "Rust", "Go", "Kubernetes", "eBPF", "Terraform", "PostgreSQL" ]
                </div>

                <div className="text-on-surface-variant font-semibold pt-1">Links:</div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                  <a className="text-[#6FA0F0] hover:text-primary focus-visible:text-primary hover:underline decoration-1 underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1 -ml-1" href="#" rel="noopener noreferrer" aria-label="GitHub Profile">[GitHub]</a>
                  <a className="text-[#6FA0F0] hover:text-primary focus-visible:text-primary hover:underline decoration-1 underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#" rel="noopener noreferrer" aria-label="LinkedIn Profile">[LinkedIn]</a>
                  <a className="text-[#6FA0F0] hover:text-primary focus-visible:text-primary hover:underline decoration-1 underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#" rel="noopener noreferrer" aria-label="Send Email">[Email]</a>
                </div>
              </div>

              <div className="mt-6 text-on-surface flex items-center h-6">
                <span className="text-primary font-bold">guest@lindqvist.dev</span><span className="text-on-surface-variant">:$</span><span className="blinking-cursor" aria-hidden="true"></span>
              </div>
            </div>
          </section>

          {/* Activity graph */}
          <section id="posts" className="w-full flex flex-col gap-6 scroll-mt-24" aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="font-h2 text-xl sm:text-[24px] font-semibold tracking-tight text-on-surface border-b border-outline-variant pb-3 flex items-center gap-3">
              <span className="text-primary font-bold" aria-hidden="true">#</span> Activity_Log
            </h2>
            <div className="bg-surface-container border border-outline-variant p-4 sm:p-6 ascii-border ascii-border-tl ascii-border-br shadow-sm flex flex-col items-center" tabIndex={0} aria-label="Contribution graph showing 1,423 contributions in the last year">
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="grid grid-rows-7 gap-[2px] sm:gap-[4px] grid-flow-col auto-cols-[10px] sm:auto-cols-[14px] justify-center w-full">
                  {/* Week 1-4 */}
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  {/* Week 5-8 */}
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>

                  {/* Week 9-12 */}
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>

                  {/* Week 13-16 */}
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/40 border border-primary/40"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>

                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/80 border border-primary/80"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary border border-primary-container"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/60 border border-primary/60"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-primary/20 border border-primary/30"></div>
                  <div className="w-full h-full rounded-[2px] bg-surface-variant border border-outline-variant/30"></div>
                </div>

                <div className="text-meta font-code text-[11px] sm:text-[13px] text-on-surface-variant text-center tabular-nums w-full">
                  1,423 contributions in the last year
                </div>
              </div>
            </div>
          </section>

          {/* Featured Projects */}
          <section id="work" className="w-full flex flex-col gap-6 scroll-mt-24" aria-labelledby="work-heading">
            <h2 id="work-heading" className="font-h2 text-xl sm:text-[24px] font-semibold tracking-tight text-on-surface border-b border-outline-variant pb-3 flex items-center gap-3">
              <span className="text-primary font-bold" aria-hidden="true">#</span> Open_Source_Work
            </h2>
            <div className="flex flex-col border border-outline-variant bg-surface-container shadow-sm rounded-[2px]">

              {/* Project Row 1 */}
              <article className="relative flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 border-b border-outline-variant hover:bg-surface-variant/40 transition-colors group">
                <div className="flex flex-col gap-2.5 max-w-[70ch]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-primary font-code font-bold text-[15px] sm:text-base">
                      <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm before:absolute before:inset-0">k8s-mesh-analyzer</a>
                    </h3>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">RUST</span>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">eBPF</span>
                  </div>
                  <p className="font-body text-[14px] sm:text-base text-on-surface-variant text-pretty leading-relaxed">
                    Zero-instrumentation observability sidecar for high-throughput microservices. Hooks into the kernel to trace latency without adding network hops.
                  </p>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0 font-code text-code relative z-10 shrink-0">
                  <div className="flex items-center gap-1.5 text-on-surface-variant" title="Stars">
                    <span className="material-symbols-outlined text-[18px] leading-none" aria-hidden="true">star</span>
                    <span className="tabular-nums font-medium">1.2k</span>
                  </div>
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View k8s-mesh-analyzer repository">
                    [view] <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </article>

              {/* Project Row 2 */}
              <article className="relative flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 border-b border-outline-variant hover:bg-surface-variant/40 transition-colors group">
                <div className="flex flex-col gap-2.5 max-w-[70ch]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-primary font-code font-bold text-[15px] sm:text-base">
                      <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm before:absolute before:inset-0">go-ratelimit-cluster</a>
                    </h3>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">GO</span>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">REDIS</span>
                  </div>
                  <p className="font-body text-[14px] sm:text-base text-on-surface-variant text-pretty leading-relaxed">
                    Distributed token bucket implementation with eventual consistency guarantees, capable of processing 10k+ ops/sec per node.
                  </p>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0 font-code text-code relative z-10 shrink-0">
                  <div className="flex items-center gap-1.5 text-on-surface-variant" title="Stars">
                    <span className="material-symbols-outlined text-[18px] leading-none" aria-hidden="true">star</span>
                    <span className="tabular-nums font-medium">842</span>
                  </div>
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View go-ratelimit-cluster repository">
                    [view] <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </article>

              {/* Project Row 3 */}
              <article className="relative flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 hover:bg-surface-variant/40 transition-colors group">
                <div className="flex flex-col gap-2.5 max-w-[70ch]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-primary font-code font-bold text-[15px] sm:text-base">
                      <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm before:absolute before:inset-0">terraform-provider-internal</a>
                    </h3>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">GO</span>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">HCL</span>
                  </div>
                  <p className="font-body text-[14px] sm:text-base text-on-surface-variant text-pretty leading-relaxed">
                    Robust Terraform provider handling custom proprietary API endpoints. Migrates state cleanly during rolling updates with automatic fallback strategies.
                  </p>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0 font-code text-code relative z-10 shrink-0">
                  <div className="flex items-center gap-1.5 text-on-surface-variant" title="Stars">
                    <span className="material-symbols-outlined text-[18px] leading-none" aria-hidden="true">star</span>
                    <span className="tabular-nums font-medium">340</span>
                  </div>
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View terraform-provider-internal repository">
                    [view] <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </article>

            </div>
          </section>

          {/* Section: Talks_&_Writing */}
          <section id="talks" className="w-full flex flex-col gap-6 scroll-mt-24" aria-labelledby="talks-heading">
            <h2 id="talks-heading" className="font-h2 text-xl sm:text-[24px] font-semibold tracking-tight text-on-surface border-b border-outline-variant pb-3 flex items-center gap-3">
              <span className="text-primary font-bold" aria-hidden="true">#</span> Talks_&amp;_Writing
            </h2>
            <div className="flex flex-col border border-outline-variant bg-surface-container shadow-sm rounded-[2px]">

              <article className="relative flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 sm:p-6 border-b border-outline-variant hover:bg-surface-variant/40 transition-colors group">
                <div className="flex flex-col gap-2.5 max-w-[70ch]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-primary/40 px-1.5 py-0.5 rounded-sm text-primary bg-primary/[0.06] tabular-nums">2024</span>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">KubeCon EU</span>
                    <span className="font-code text-[10px] sm:text-[11px] tracking-wider text-on-surface-variant">// 38 min · paris</span>
                  </div>
                  <h3 className="text-primary font-code font-bold text-[15px] sm:text-base">
                    <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm before:absolute before:inset-0">eBPF in production: tracing 4M req/s without breaking the kernel</a>
                  </h3>
                  <p className="font-body text-[14px] sm:text-base text-on-surface-variant text-pretty leading-relaxed">
                    The pitfalls we hit shipping eBPF probes to a 9000-node fleet — verifier rejections, ring-buffer back-pressure, and a case for static maps in critical paths.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1 md:mt-0 font-code text-[12px] relative z-10 shrink-0">
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View slides">[slides]</a>
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View video">[video]</a>
                </div>
              </article>

              <article className="relative flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 sm:p-6 border-b border-outline-variant hover:bg-surface-variant/40 transition-colors group">
                <div className="flex flex-col gap-2.5 max-w-[70ch]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-primary/40 px-1.5 py-0.5 rounded-sm text-primary bg-primary/[0.06] tabular-nums">2024</span>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">USENIX SREcon</span>
                    <span className="font-code text-[10px] sm:text-[11px] tracking-wider text-on-surface-variant">// 12 min · lightning</span>
                  </div>
                  <h3 className="text-primary font-code font-bold text-[15px] sm:text-base">
                    <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm before:absolute before:inset-0">A postmortem of the rolling Terraform lockout, 02:14 UTC</a>
                  </h3>
                  <p className="font-body text-[14px] sm:text-base text-on-surface-variant text-pretty leading-relaxed">
                    How a state-lock TTL bumped from 60s to 600s during a routine refactor wedged 14 region pipelines for the better part of a Tuesday. Plus the playbook we wrote afterward.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1 md:mt-0 font-code text-[12px] relative z-10 shrink-0">
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View slides">[slides]</a>
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View postmortem">[postmortem]</a>
                </div>
              </article>

              <article className="relative flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 sm:p-6 border-b border-outline-variant hover:bg-surface-variant/40 transition-colors group">
                <div className="flex flex-col gap-2.5 max-w-[70ch]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-on-surface-variant/40 px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high tabular-nums">2023</span>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">acm queue</span>
                    <span className="font-code text-[10px] sm:text-[11px] tracking-wider text-on-surface-variant">// long-form</span>
                  </div>
                  <h3 className="text-primary font-code font-bold text-[15px] sm:text-base">
                    <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm before:absolute before:inset-0">There is no edge: a topology for distributed-first systems</a>
                  </h3>
                  <p className="font-body text-[14px] sm:text-base text-on-surface-variant text-pretty leading-relaxed">
                    Why "edge vs. core" is the wrong axis. A practitioner argument for moving toward latency-tier topology, with diagrams and three example failure modes.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1 md:mt-0 font-code text-[12px] relative z-10 shrink-0">
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="Read paper">[read]</a>
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View pdf">[pdf]</a>
                </div>
              </article>

              <article className="relative flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 sm:p-6 hover:bg-surface-variant/40 transition-colors group">
                <div className="flex flex-col gap-2.5 max-w-[70ch]">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-on-surface-variant/40 px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high tabular-nums">2023</span>
                    <span className="font-code text-[10px] sm:text-[11px] font-bold tracking-wider border border-outline-variant px-1.5 py-0.5 rounded-sm text-on-surface-variant bg-surface-container-high">RustConf</span>
                    <span className="font-code text-[10px] sm:text-[11px] tracking-wider text-on-surface-variant">// 22 min · workshop</span>
                  </div>
                  <h3 className="text-primary font-code font-bold text-[15px] sm:text-base">
                    <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm before:absolute before:inset-0">Lock-free is a vibe, not an outcome: when to reach for a Mutex&lt;T&gt;</a>
                  </h3>
                  <p className="font-body text-[14px] sm:text-base text-on-surface-variant text-pretty leading-relaxed">
                    Benchmarks, contention graphs, and a few honest words about how often the simpler primitive wins on real production hardware.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1 md:mt-0 font-code text-[12px] relative z-10 shrink-0">
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="View slides">[slides]</a>
                  <a className="text-[#6FA0F0] group-hover:text-primary focus-visible:text-[#0F1114] focus-visible:bg-primary transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1" href="#" aria-label="Source repository">[source]</a>
                </div>
              </article>

            </div>
          </section>

          {/* Section: Stack_Topology */}
          <section id="stack" className="w-full flex flex-col gap-6 scroll-mt-24" aria-labelledby="stack-heading">
            <h2 id="stack-heading" className="font-h2 text-xl sm:text-[24px] font-semibold tracking-tight text-on-surface border-b border-outline-variant pb-3 flex items-center gap-3">
              <span className="text-primary font-bold" aria-hidden="true">#</span> Stack_Topology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">

              <div className="md:col-span-7 bg-surface-container border border-outline-variant ascii-border ascii-border-tl ascii-border-br p-4 sm:p-5 rounded-[2px] overflow-x-auto">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-3">
                  <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// borealis-prd · 84 nodes</span>
                  <span className="font-code text-[10px] uppercase tracking-widest text-primary">[stable]</span>
                </div>
                <pre className="font-code text-[10px] sm:text-[11px] leading-[1.55] text-on-surface-variant whitespace-pre m-0">
{`                  ┌──────────────────────────────┐
       client → │  [E] cloudflare · anycast    │ ← 14 PoP
                  └──────────────┬───────────────┘
                                 │ TLS 1.3
                  ┌──────────────▼───────────────┐
                  │  [G] envoy · mesh ingress    │
                  └────┬───────────┬─────────────┘
                       │           │ ratelimit (token-bucket)
        ┌──────────────▼───┐  ┌────▼─────────────┐
        │  [A] api · go    │  │  [W] worker · rs │
        │  10×replicas     │  │  fleet × 32      │
        └─────┬────────────┘  └────┬─────────────┘
              │ gRPC                │ NATS
        ┌─────▼────────────┐  ┌─────▼─────────────┐
        │  [D] postgres-14 │  │  [Q] redis-cluster │
        │  hot+warm+cold   │  │  6 shards · 3 R/W  │
        └─────────────┬────┘  └────────────────────┘
                      │ logical decode
                      ▼
            ┌──────────────────────────────┐
            │  [O] otel + clickhouse       │ ← traces
            └──────────────────────────────┘`}
                </pre>
              </div>

              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="bg-surface-container border border-outline-variant p-4 sm:p-5 rounded-[2px]">
                  <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-3">
                    <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// legend</span>
                    <span className="font-code text-[10px] uppercase tracking-widest text-primary">map</span>
                  </div>
                  <ul className="flex flex-col divide-y divide-outline-variant/60">
                    <li className="flex items-center justify-between py-2.5 text-[13px] gap-3">
                      <span className="font-code text-on-surface flex items-center gap-2 shrink-0"><span className="text-primary tabular-nums">[E]</span> edge</span>
                      <span className="font-code text-on-surface-variant tabular-nums truncate">cloudflare · envoy</span>
                    </li>
                    <li className="flex items-center justify-between py-2.5 text-[13px] gap-3">
                      <span className="font-code text-on-surface flex items-center gap-2 shrink-0"><span className="text-primary tabular-nums">[G]</span> gateway</span>
                      <span className="font-code text-on-surface-variant tabular-nums truncate">envoy mesh</span>
                    </li>
                    <li className="flex items-center justify-between py-2.5 text-[13px] gap-3">
                      <span className="font-code text-on-surface flex items-center gap-2 shrink-0"><span className="text-primary tabular-nums">[A]</span> api</span>
                      <span className="font-code text-on-surface-variant tabular-nums truncate">go · grpc · 10x</span>
                    </li>
                    <li className="flex items-center justify-between py-2.5 text-[13px] gap-3">
                      <span className="font-code text-on-surface flex items-center gap-2 shrink-0"><span className="text-primary tabular-nums">[W]</span> worker</span>
                      <span className="font-code text-on-surface-variant tabular-nums truncate">rust · nats · 32x</span>
                    </li>
                    <li className="flex items-center justify-between py-2.5 text-[13px] gap-3">
                      <span className="font-code text-on-surface flex items-center gap-2 shrink-0"><span className="text-primary tabular-nums">[D]</span> data</span>
                      <span className="font-code text-on-surface-variant tabular-nums truncate">pg14 · h/w/c tiers</span>
                    </li>
                    <li className="flex items-center justify-between py-2.5 text-[13px] gap-3">
                      <span className="font-code text-on-surface flex items-center gap-2 shrink-0"><span className="text-primary tabular-nums">[O]</span> obs</span>
                      <span className="font-code text-on-surface-variant tabular-nums truncate">otel · clickhouse</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-surface-container border border-outline-variant p-4 rounded-[2px] flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// design notes</span>
                    <span className="font-code text-on-surface text-sm">no shared state across api↔worker. eventual consistency, idempotent jobs, sealed snapshots.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 border border-outline-variant divide-x divide-outline-variant rounded-[2px] bg-surface-container">
              <div className="p-4 flex flex-col gap-1">
                <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// uptime</span>
                <span className="font-code text-[22px] sm:text-2xl text-primary font-bold tabular-nums">99.973%</span>
                <span className="font-code text-[10px] text-on-surface-variant">90d rolling</span>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// p99 lat</span>
                <span className="font-code text-[22px] sm:text-2xl text-primary font-bold tabular-nums">3.4 ms</span>
                <span className="font-code text-[10px] text-on-surface-variant">europe · home region</span>
              </div>
              <div className="p-4 flex flex-col gap-1 border-t sm:border-t-0 border-outline-variant">
                <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// qps peak</span>
                <span className="font-code text-[22px] sm:text-2xl text-primary font-bold tabular-nums">218k</span>
                <span className="font-code text-[10px] text-on-surface-variant">2024-09-14 · sale spike</span>
              </div>
              <div className="p-4 flex flex-col gap-1 border-t sm:border-t-0 border-outline-variant">
                <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// cost / req</span>
                <span className="font-code text-[22px] sm:text-2xl text-primary font-bold tabular-nums">$0.00018</span>
                <span className="font-code text-[10px] text-on-surface-variant">all-in · q3 avg</span>
              </div>
            </div>
          </section>

          {/* Section: Field_Photographs (image strip / marquee) */}
          <section id="field" className="w-full flex flex-col gap-6 scroll-mt-24" aria-labelledby="field-heading">
            <h2 id="field-heading" className="font-h2 text-xl sm:text-[24px] font-semibold tracking-tight text-on-surface border-b border-outline-variant pb-3 flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span className="text-primary font-bold" aria-hidden="true">#</span> Field_Photographs
              </span>
              <span className="font-code text-[10px] sm:text-[12px] text-on-surface-variant font-normal tracking-widest hidden sm:inline">// hover = paused</span>
            </h2>
            <div className="overflow-hidden border-y sm:border border-outline-variant bg-surface-container py-4 -mx-4 sm:mx-0 sm:rounded-[2px] relative">
              <div className="absolute inset-y-0 left-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-surface-container to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-surface-container to-transparent"></div>
              <div className="term-marquee-track">
                {[
                  { id: "1558494949-ef010cbdcc31", w: "w-72", q: 900, label: "[ NODE_07 ]", meta: "FRA · 02:14", alt: "Server rack interior" },
                  { id: "1518770660439-4636190af475", w: "w-72", q: 900, label: "[ TRACE.MAP ]", meta: "macro · 01x", alt: "Circuit board macro" },
                  { id: "1551808525-51a94da548ce", w: "w-96", q: 1200, label: "[ AISLE_B / RACK_14 ]", meta: "stockholm · prd", alt: "Server-room wide shot" },
                  { id: "1531259683007-016a7b628fc3", w: "w-72", q: 900, label: "[ COOL_LOOP ]", meta: "delta-T · 04°", alt: "Industrial machinery" },
                  { id: "1487958449943-2429e8be8625", w: "w-80", q: 1100, label: "[ DC_FACADE ]", meta: "site_a · ext", alt: "Architecture" },
                  { id: "1517021897933-0e0319cfbc28", w: "w-72", q: 900, label: "[ ENV.CTRL ]", meta: "hvac · 21°c", alt: "Architecture detail" },
                  { id: "1558494949-ef010cbdcc31", w: "w-72", q: 900, label: "[ NODE_07 ]", meta: "FRA · 02:14", alt: "" },
                  { id: "1518770660439-4636190af475", w: "w-72", q: 900, label: "[ TRACE.MAP ]", meta: "macro · 01x", alt: "" },
                  { id: "1551808525-51a94da548ce", w: "w-96", q: 1200, label: "[ AISLE_B / RACK_14 ]", meta: "stockholm · prd", alt: "" },
                  { id: "1531259683007-016a7b628fc3", w: "w-72", q: 900, label: "[ COOL_LOOP ]", meta: "delta-T · 04°", alt: "" },
                  { id: "1487958449943-2429e8be8625", w: "w-80", q: 1100, label: "[ DC_FACADE ]", meta: "site_a · ext", alt: "" },
                  { id: "1517021897933-0e0319cfbc28", w: "w-72", q: 900, label: "[ ENV.CTRL ]", meta: "hvac · 21°c", alt: "" },
                ].map((p, i) => (
                  <figure key={i} className={`shrink-0 ${p.w} h-44 relative overflow-hidden border border-outline-variant rounded-[2px]`} aria-hidden={i >= 6 ? true : undefined}>
                    <img className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 opacity-90" src={`https://images.unsplash.com/photo-${p.id}?w=${p.q}&q=80&auto=format&fit=crop`} alt={p.alt} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
                    <div className="absolute inset-0 scanline-veneer pointer-events-none"></div>
                    <figcaption className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-code text-[10px] uppercase tracking-widest">
                      <span className="text-primary">{p.label}</span>
                      <span className="text-on-surface">{p.meta}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <p className="font-code text-[11px] text-on-surface-variant text-center tabular-nums">
              photos: own work · sites visited 2022—2024 · stockholm · frankfurt · helsinki · london
            </p>
          </section>

          {/* Section: Now_Running */}
          <section id="cluster" className="w-full flex flex-col gap-6 scroll-mt-24" aria-labelledby="cluster-heading">
            <h2 id="cluster-heading" className="font-h2 text-xl sm:text-[24px] font-semibold tracking-tight text-on-surface border-b border-outline-variant pb-3 flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span className="text-primary font-bold" aria-hidden="true">#</span> Now_Running
              </span>
              <span className="font-code text-[10px] sm:text-[12px] text-on-surface-variant font-normal tracking-widest hidden md:inline">/ updated · 14 minutes ago</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <figure className="lg:col-span-7 relative overflow-hidden border border-outline-variant bg-surface-container rounded-[2px] aspect-[4/3] lg:aspect-auto lg:min-h-[440px] lg:h-full">
                <img className="absolute inset-0 w-full h-full object-cover grayscale contrast-105 brightness-90" src="https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1600&q=85&auto=format&fit=crop" alt="Production server room aisle" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/30 to-transparent"></div>
                <div className="absolute inset-0 scanline-veneer pointer-events-none"></div>
                <span className="absolute top-4 right-4 font-code text-[10px] uppercase tracking-widest border border-primary/40 bg-background/70 backdrop-blur-sm text-primary px-2 py-1 rounded-sm">env · prd-eu</span>
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-code text-[10px] uppercase tracking-widest text-primary">// site_a · stockholm</span>
                    <span className="font-code text-on-surface text-base sm:text-lg font-bold">borealis-prd-01 · rack 14b</span>
                    <span className="font-code text-[11px] text-on-surface-variant">2,144 cores · 9.6 TiB ram · 84 nodes</span>
                  </div>
                  <span className="font-code text-[10px] uppercase tracking-widest text-on-surface flex items-center gap-2 bg-background/60 backdrop-blur-sm border border-outline-variant px-2 py-1 rounded-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>live
                  </span>
                </div>
              </figure>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-surface-container border border-outline-variant rounded-[2px] p-4 flex-1 min-h-[220px] flex flex-col gap-2 font-code text-[11px] sm:text-[12px] ascii-border ascii-border-tl ascii-border-br">
                  <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-1">
                    <span className="text-on-surface-variant">$ tail -f /var/log/cluster.log</span>
                    <span className="text-primary font-bold">[live]</span>
                  </div>
                  <div className="flex flex-col gap-1 leading-[1.55] text-on-surface-variant">
                    <div><span className="text-primary">[OK]</span> hb_07.peer.fra1 ack 0.4ms</div>
                    <div><span className="text-primary">[OK]</span> hb_07.peer.lhr1 ack 1.2ms</div>
                    <div><span className="text-secondary">[I]</span> drift_compensator engaged</div>
                    <div><span className="text-on-surface">[STAT]</span> qps 82,419 / capacity 84.0%</div>
                    <div><span className="text-primary">[OK]</span> region rebalance cycle 1408</div>
                    <div><span className="text-on-surface-variant">[NOTE]</span> warm-cache miss rate 0.0014%</div>
                    <div><span className="text-primary">[OK]</span> snapshot.eu1 sealed @ 1.3 GiB</div>
                    <div className="flex items-center"><span className="text-primary font-bold">guest@borealis</span><span className="text-on-surface-variant">:$</span><span className="blinking-cursor"></span></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container border border-outline-variant p-4 rounded-[2px] flex flex-col gap-1.5">
                    <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// p99 lat</span>
                    <span className="font-code text-2xl text-primary font-bold tabular-nums">3.4 ms</span>
                    <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden mt-1"><div className="term-bar h-full" style={{ width: "24%" }}></div></div>
                    <span className="font-code text-[10px] text-on-surface-variant">budget · 14 ms</span>
                  </div>
                  <div className="bg-surface-container border border-outline-variant p-4 rounded-[2px] flex flex-col gap-1.5">
                    <span className="font-code text-[10px] uppercase tracking-widest text-on-surface-variant">// build #</span>
                    <span className="font-code text-2xl text-primary font-bold tabular-nums">21,408</span>
                    <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden mt-1"><div className="term-bar h-full" style={{ width: "88%" }}></div></div>
                    <span className="font-code text-[10px] text-on-surface-variant">14 min ago · ok</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-outline-variant md:divide-x divide-outline-variant rounded-[2px] overflow-hidden bg-surface-container">
              {[
                { id: "1518770660439-4636190af475", code: "site_b", name: "aurora-stg-04", meta: "helsinki · 32 nodes · staging", alt: "Site b" },
                { id: "1531259683007-016a7b628fc3", code: "site_c", name: "pyrite-dev-09", meta: "frankfurt · 12 nodes · dev", alt: "Site c" },
                { id: "1487958449943-2429e8be8625", code: "site_d", name: "solstice-edge-22", meta: "london · pop · canary", alt: "Site d" },
              ].map((s, i) => (
                <article key={i} className={`p-4 flex gap-4 items-center ${i > 0 ? "border-t md:border-t-0 border-outline-variant" : ""}`}>
                  <div className="w-16 h-16 shrink-0 overflow-hidden border border-outline-variant relative rounded-[2px]">
                    <img className="absolute inset-0 w-full h-full object-cover grayscale contrast-110" src={`https://images.unsplash.com/photo-${s.id}?w=400&q=80&auto=format&fit=crop`} alt={s.alt} loading="lazy" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-code text-[10px] uppercase tracking-widest text-primary">// {s.code}</span>
                    <span className="font-code text-on-surface text-sm font-bold truncate">{s.name}</span>
                    <span className="font-code text-[11px] text-on-surface-variant truncate">{s.meta}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer id="contact" className="w-full bg-[#0F1114] border-t border-[#2D3239] mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full px-4 py-6 sm:py-8 max-w-[1100px] mx-auto sm:px-6">
            <div className="font-code text-[11px] uppercase text-[#2D3239] tracking-widest font-semibold">
              (C) 2024 DEVOPS_PORTFOLIO -- NO_TRACKING_ENABLED
            </div>
            <div className="flex gap-6 font-code text-[11px] uppercase tracking-widest font-semibold">
              <a className="text-[#2D3239] hover:text-[#52D273] focus-visible:outline-none focus-visible:text-primary focus-visible:underline underline-offset-4 transition-colors" href="#" rel="noopener noreferrer">GitHub</a>
              <a className="text-[#2D3239] hover:text-[#52D273] focus-visible:outline-none focus-visible:text-primary focus-visible:underline underline-offset-4 transition-colors" href="#" rel="noopener noreferrer">LinkedIn</a>
              <a className="text-[#2D3239] hover:text-[#52D273] focus-visible:outline-none focus-visible:text-primary focus-visible:underline underline-offset-4 transition-colors" href="#" rel="noopener noreferrer">RSS</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

export default DeveloperPortfolio;
