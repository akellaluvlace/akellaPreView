function FitnessWellness() {
  return (
    <>
      {/* head */}
      <title>Range - High-Energy Fitness</title>
      <meta name="description" content="Range - Elite high-energy fitness training programs designed for the intermediate lifter who demands more from their training." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-tertiary-container": "#292b28",
                        "on-tertiary-fixed-variant": "#454744",
                        "surface-dim": "#131313",
                        "on-secondary-fixed": "#1c1b1b",
                        "background": "#131313",
                        "on-background": "#e4e2e1",
                        "on-tertiary": "#2f312e",
                        "on-secondary": "#313030",
                        "outline-variant": "#5b403a",
                        "on-error-container": "#ffdad6",
                        "on-primary-fixed-variant": "#8b1900",
                        "surface-container-low": "#1b1c1c",
                        "tertiary": "#c6c7c2",
                        "on-primary-fixed": "#3d0600",
                        "secondary-fixed-dim": "#c9c6c5",
                        "error-container": "#93000a",
                        "error": "#ffb4ab",
                        "inverse-primary": "#b62400",
                        "surface-container-high": "#2a2a2a",
                        "primary": "#ffb4a3",
                        "primary-container": "#ff5833",
                        "surface": "#131313",
                        "on-primary-container": "#580c00",
                        "secondary-container": "#4a4949",
                        "surface-container-lowest": "#0e0e0e",
                        "on-surface": "#e4e2e1",
                        "inverse-on-surface": "#303030",
                        "on-tertiary-fixed": "#1a1c19",
                        "inverse-surface": "#e4e2e1",
                        "secondary-fixed": "#e5e2e1",
                        "surface-tint": "#ffb4a3",
                        "surface-variant": "#353535",
                        "on-error": "#690005",
                        "primary-fixed": "#ffdad2",
                        "surface-container-highest": "#353535",
                        "on-surface-variant": "#e4beb6",
                        "outline": "#ab8982",
                        "surface-container": "#1f2020",
                        "tertiary-container": "#91928e",
                        "on-secondary-container": "#bab8b7",
                        "surface-bright": "#393939",
                        "primary-fixed-dim": "#ffb4a3",
                        "tertiary-fixed": "#e3e3de",
                        "on-primary": "#630f00",
                        "secondary": "#c9c6c5",
                        "tertiary-fixed-dim": "#c6c7c2",
                        "on-secondary-fixed-variant": "#474646"
                    },
                    borderRadius: {
                        DEFAULT: "0.125rem",
                        lg: "0.25rem",
                        xl: "0.5rem",
                        full: "0.75rem"
                    },
                    spacing: {
                        "margin-fluid": "clamp(20px, 5vw, 64px)",
                        "unit": "8px",
                        "container-max": "1280px",
                        "section-gap": "clamp(80px, 10vw, 120px)",
                        "gutter": "clamp(1.5rem, 3vw, 2rem)"
                    },
                    fontFamily: {
                        "display-lg": ["Space Grotesk", "system-ui", "-apple-system", "sans-serif"],
                        "display-xl": ["Space Grotesk", "system-ui", "-apple-system", "sans-serif"],
                        "body-lg": ["Inter", "system-ui", "-apple-system", "sans-serif"],
                        "headline-md": ["Space Grotesk", "system-ui", "-apple-system", "sans-serif"],
                        "body-md": ["Inter", "system-ui", "-apple-system", "sans-serif"],
                        "label-bold": ["Inter", "system-ui", "-apple-system", "sans-serif"]
                    },
                    fontSize: {
                        "display-lg": ["clamp(2rem, 5vw + 1rem, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
                        "display-xl": ["clamp(2.5rem, 6vw + 1rem, 5rem)", { lineHeight: "1.0", letterSpacing: "-0.04em", fontWeight: "700" }],
                        "body-lg": ["clamp(1rem, 1vw + 0.75rem, 1.125rem)", { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" }],
                        "headline-md": ["clamp(1.5rem, 3vw + 0.5rem, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
                        "body-md": ["1rem", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
                        "label-bold": ["0.875rem", { lineHeight: "1.0", letterSpacing: "0.05em", fontWeight: "700" }]
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined[style*="'FILL' 1"] {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        @keyframes range-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); }
        }
        .range-marquee-track {
            animation: range-marquee 55s linear infinite;
            width: max-content;
            display: flex;
            gap: 24px;
        }
        .range-marquee-track:hover { animation-play-state: paused; }
        .range-faq summary::-webkit-details-marker { display: none; }
        .range-faq summary { list-style: none; }
        .range-faq summary .range-chevron { transition: transform 250ms ease; }
        .range-faq[open] summary .range-chevron { transform: rotate(45deg); }
        .range-bar {
            background: linear-gradient(180deg, #ff5833 0%, #ffb4a3 100%);
        }
        @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto !important; }
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
            .range-marquee-track { animation: none; }
        }
` }} />

      {/* HTML had `<html class="dark scroll-smooth">` and these body classes — wrapped in dark div */}
      <div className="dark bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary-container selection:text-background flex flex-col min-h-screen">

        {/* TopNavBar */}
        <nav className="bg-[#0B0B0B]/95 backdrop-blur-sm w-full top-0 border-b border-white/10 sticky z-50 transition-colors duration-300">
          <div className="flex justify-between items-center w-full px-margin-fluid py-6 max-w-[1440px] mx-auto">
            <a href="#" aria-label="Range Home" className="text-2xl font-black text-white tracking-tighter uppercase font-['Space_Grotesk'] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] rounded">Range</a>
            <div className="hidden md:flex gap-8 items-center">
              <a className="text-white/70 hover:text-white font-['Space_Grotesk'] font-bold uppercase tracking-tight hover:text-primary-container transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] rounded px-2 py-1 -mx-2" href="#programs">Programs</a>
              <a className="text-white/70 hover:text-white font-['Space_Grotesk'] font-bold uppercase tracking-tight hover:text-primary-container transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] rounded px-2 py-1 -mx-2" href="#">Coaches</a>
              <a className="text-white/70 hover:text-white font-['Space_Grotesk'] font-bold uppercase tracking-tight hover:text-primary-container transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] rounded px-2 py-1 -mx-2" href="#">Reviews</a>
              <a className="text-white/70 hover:text-white font-['Space_Grotesk'] font-bold uppercase tracking-tight hover:text-primary-container transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] rounded px-2 py-1 -mx-2" href="#">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <button className="hidden md:inline-block bg-primary-container text-background font-label-bold text-label-bold px-6 py-3 rounded uppercase tracking-wider hover:bg-white hover:text-background hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]">Start now</button>
              <button aria-label="Toggle Navigation Menu" aria-expanded="false" className="md:hidden text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded p-2 -mr-2">
                <span className="material-symbols-outlined" aria-hidden="true">menu</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <header className="relative w-full h-[90svh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <img
            alt="Athlete mid-deadlift under moody gym lighting"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            width="1920"
            height="1080"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKxxsE4tbT32P3AbvOrJlKWvJe3kid5p2o7G9YVhZjKFLzkvuagrVga7iNTPjqvVW-vKeCtak65UP7eiuThDcSLTP63ix7Sgl9rHfxYJzuwYbHVTf9_187DXHwTj4rSz7rF15Y590j54BXsJ1ljY93GW5ticorrcMatQUJkE5cdfBt0CUXASGPhm9T-kJ_poPSBEuRYu4yenG5r60ijK9Mgz5YmpcrDYAOZsw4fJA3lVXra6SqqGNwY0Le4wKZKVfxhZAc_mKvEDYB"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none"></div>
          <div className="relative z-10 text-center max-w-[800px] px-margin-fluid mt-20">
            <h1 className="font-display-xl text-display-xl text-on-background mb-6 uppercase text-balance drop-shadow-lg">Strength, Built On Principles</h1>
            <p className="font-body-lg text-body-lg text-secondary mb-10 max-w-[65ch] mx-auto text-pretty drop-shadow-md">Elite training programs designed for the intermediate lifter who demands more from their training.</p>
            <a href="#programs" className="inline-block bg-primary-container text-background font-label-bold text-label-bold px-8 py-4 rounded uppercase tracking-wider hover:bg-white hover:text-background hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-background">See programs</a>
          </div>
        </header>

        <main className="max-w-container-max mx-auto px-margin-fluid pb-section-gap w-full flex-grow">

          {/* Programs */}
          <section id="programs" className="mt-section-gap scroll-mt-32">
            <h2 className="font-headline-md text-headline-md text-on-background uppercase mb-8 md:mb-12 border-l-4 border-primary-container pl-4 text-balance">Choose Your Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">

              {/* Card 1 */}
              <article className="relative bg-surface-container-low border border-surface-variant rounded flex flex-col group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-outline/50 focus-within:ring-2 focus-within:ring-primary-container focus-within:ring-offset-2 focus-within:ring-offset-background">
                <div className="h-48 relative overflow-hidden bg-surface-variant/50">
                  <img
                    alt="Close up of heavy barbell loaded with weights on a squat rack"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4xxGYVrUay99xOo9YqvsbzQDf_p03c1hGLVeZCcdUMwbcGlA37il1SRAoEnHyVEPEr3mAJWotU8WEWTwIlK58UvjMNnkeJmadIaY3JMg9veejVHso80zxKeAIyKWymYNHK5tjRPq4ufFwQx5EcagP4eVOGGR8wI6u6Na9D568qWSoFmKkX9rbiOL6W1oJ4yvzE7iNxY8pIg3F5va-rU7zTaCCt99EbduXKEeh2CowmVp89WLHGDtcKIpwmJ0sMIP2jrUWyUysCpDI"
                  />
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-2 py-1 rounded-sm border border-secondary/20 pointer-events-none">
                    <span className="font-label-bold text-label-bold text-primary-container uppercase tabular-nums tracking-widest">12 Weeks</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline-md text-headline-md text-on-background mb-2 text-balance">Foundation</h3>
                  <p className="font-body-md text-body-md text-secondary mb-6 flex-grow text-pretty">Master the core lifts and build a base of undeniable strength.</p>
                  <a className="mt-auto font-label-bold text-label-bold text-primary-container uppercase hover:text-white transition-colors flex items-center gap-2 focus:outline-none before:absolute before:inset-0 w-fit" href="#">
                    View Program <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </article>

              {/* Card 2 */}
              <article className="relative bg-surface-container-low border border-surface-variant rounded flex flex-col group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-outline/50 focus-within:ring-2 focus-within:ring-primary-container focus-within:ring-offset-2 focus-within:ring-offset-background">
                <div className="h-48 relative overflow-hidden bg-surface-variant/50">
                  <img
                    alt="Muscular arms pressing heavy dumbbells on a bench"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9AZXv_XM6jUCSZP2rx_8qEnQ_NJnRqZp4ozmdksajwKFLmp9iuRUD5baxMkBOQttRu98Ot5RYL_ecIShPg6K-zQDBUeVpfT0duS1291p0BIaZRFEGRaEAbAdU3J9zuOAhCMcaEac9eyqBXNY6hNv-K_2X3W45rwFSbUTBBGUUUch5FjajpYxPhIHVkwpcqwJFyep6OCvSTpoZz6hw1BjmZ-xR-pAL7FEvsUBQ3afj_mb1hwu5P5mcx8fi3yneITQt6JlFNUmAmEV9"
                  />
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-2 py-1 rounded-sm border border-secondary/20 pointer-events-none">
                    <span className="font-label-bold text-label-bold text-primary-container uppercase tabular-nums tracking-widest">12 Weeks</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline-md text-headline-md text-on-background mb-2 text-balance">Hypertrophy</h3>
                  <p className="font-body-md text-body-md text-secondary mb-6 flex-grow text-pretty">Science-backed volume to maximize muscle growth and density.</p>
                  <a className="mt-auto font-label-bold text-label-bold text-primary-container uppercase hover:text-white transition-colors flex items-center gap-2 focus:outline-none before:absolute before:inset-0 w-fit" href="#">
                    View Program <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </article>

              {/* Card 3 */}
              <article className="relative bg-surface-container-low border border-surface-variant rounded flex flex-col group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-outline/50 focus-within:ring-2 focus-within:ring-primary-container focus-within:ring-offset-2 focus-within:ring-offset-background">
                <div className="h-48 relative overflow-hidden bg-surface-variant/50">
                  <img
                    alt="Low angle shot of a heavy deadlift setup with chalked hands"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtL-xupMgW-2dMWs-QWCd0DOX4BfCRHAF-qIh_doqIgCEJ2mbdHGccmMzwTqtnxpb_s8WDajh3I1EBXa8EdmQHxR71xllhehymkPzVutDpJQwthVDeHDYJGg5V8jZL2RwJk2tfEv2Q0J-AMLUPMTS2POyH7yaM8suuWXNgIExLiw50Id4mKHW-ZsYnVr7TsFr2kUN2OqVHfRizCeV_0vfcA5W8dSuTJM-mgRD_dldsRBdB1yW6PVv0w1BRCc-lMF1OHSZKm_fOOxCA"
                  />
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-2 py-1 rounded-sm border border-secondary/20 pointer-events-none">
                    <span className="font-label-bold text-label-bold text-primary-container uppercase tabular-nums tracking-widest">12 Weeks</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline-md text-headline-md text-on-background mb-2 text-balance">Strength</h3>
                  <p className="font-body-md text-body-md text-secondary mb-6 flex-grow text-pretty">Peak your central nervous system for new 1RM milestones.</p>
                  <a className="mt-auto font-label-bold text-label-bold text-primary-container uppercase hover:text-white transition-colors flex items-center gap-2 focus:outline-none before:absolute before:inset-0 w-fit" href="#">
                    View Program <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </article>

              {/* Card 4 */}
              <article className="relative bg-surface-container-low border border-surface-variant rounded flex flex-col group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-outline/50 focus-within:ring-2 focus-within:ring-primary-container focus-within:ring-offset-2 focus-within:ring-offset-background">
                <div className="h-48 relative overflow-hidden bg-surface-variant/50">
                  <img
                    alt="Gymnastic rings hanging in a dark crossfit style gym"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEtAnrPRYknN3EH-gpGqxUvZKzghRnnCqJr2IWywdx3ONWe5SC2rFFRFJ898e_-FwTs9Pox7BSPj5I_uX5EYtcNy00VxzDgb-HPsVaqVSgNAGp3Z6TkMpXhq7_4d28_HYkYh6WzVBbw8t4G6ybkKBoTJmCHMr08CHSOwxtn6TBRqmIeIs0eDWetLeU9IxLRaE1vEVc36bXTLxW26hZCK3NqDK45mceTWni_SpyXiJuXA3LwXPT4ZH4jRgfoSqt6bu2DxWgGQfKH22R"
                  />
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-2 py-1 rounded-sm border border-secondary/20 pointer-events-none">
                    <span className="font-label-bold text-label-bold text-primary-container uppercase tabular-nums tracking-widest">12 Weeks</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline-md text-headline-md text-on-background mb-2 text-balance">Peak</h3>
                  <p className="font-body-md text-body-md text-secondary mb-6 flex-grow text-pretty">Advanced peaking cycle for competitive athletes preparing for a meet.</p>
                  <a className="mt-auto font-label-bold text-label-bold text-primary-container uppercase hover:text-white transition-colors flex items-center gap-2 focus:outline-none before:absolute before:inset-0 w-fit" href="#">
                    View Program <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </article>

            </div>
          </section>

          {/* What You Get */}
          <section className="mt-section-gap">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,6vw,4rem)] items-center">
              <div>
                <h2 className="font-display-lg text-display-lg text-on-background uppercase mb-6 md:mb-8 border-l-4 border-primary-container pl-4 text-balance">The Range Edge</h2>
                <p className="font-body-lg text-body-lg text-secondary mb-8 max-w-[65ch] text-pretty">We don't just give you a spreadsheet. We provide a comprehensive coaching ecosystem to ensure execution meets ambition.</p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 group">
                    <span className="material-symbols-outlined text-primary-container mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                    <div>
                      <span className="font-label-bold text-label-bold text-on-background uppercase block mb-1">Scientific Programming</span>
                      <span className="font-body-md text-body-md text-secondary max-w-[60ch] block text-pretty">Periodized cycles based on current exercise science, not gym folklore.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <span className="material-symbols-outlined text-primary-container mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                    <div>
                      <span className="font-label-bold text-label-bold text-on-background uppercase block mb-1">Video Form Reviews</span>
                      <span className="font-body-md text-body-md text-secondary max-w-[60ch] block text-pretty">Submit your sets. Get technical breakdowns to optimize mechanics.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <span className="material-symbols-outlined text-primary-container mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                    <div>
                      <span className="font-label-bold text-label-bold text-on-background uppercase block mb-1">Direct Coach Access</span>
                      <span className="font-body-md text-body-md text-secondary max-w-[60ch] block text-pretty">No bots. Real elite coaches answering your programming questions.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <span className="material-symbols-outlined text-primary-container mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                    <div>
                      <span className="font-label-bold text-label-bold text-on-background uppercase block mb-1">Community Discord</span>
                      <span className="font-body-md text-body-md text-secondary max-w-[60ch] block text-pretty">Surround yourself with lifters who demand as much from themselves as you do.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative h-[600px] w-full bg-surface-variant/30 rounded">
                <img
                  alt="Muscular athlete sitting on a weight bench in a dark gym looking intently at a smartphone screen"
                  className="w-full h-full object-cover rounded opacity-80"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="1200"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv-AGluRFQxD_hRnjCkI00S_EjO7KJJbiS-21qUZ7n-ohUpS-Arvlo-7wx3xROtsBPXzbqSUV2DFpN7USEgbLuOPr3H7RQsKH6HAtZ5x_VTGsT3gnVjdr6ten9agNvetKPevlD1fM5mzBxH7q5D_noVDk30mC1W7fJ9TV7K1ObHEtKNekTFOUEoi6uZ-toEFxwvt89fdVeG9tI7it0b2gYcVeAF7ePUSu85swgh_0Z4JwSgJAn9bu20kosb8KxOV3HIobFgK6ox7fj"
                />
                <div className="absolute inset-0 border border-surface-variant rounded pointer-events-none"></div>
              </div>
            </div>
          </section>
          {/* Section: In Motion (image strip / marquee) */}
          {(() => {
            const motionTiles = [
              { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4xxGYVrUay99xOo9YqvsbzQDf_p03c1hGLVeZCcdUMwbcGlA37il1SRAoEnHyVEPEr3mAJWotU8WEWTwIlK58UvjMNnkeJmadIaY3JMg9veejVHso80zxKeAIyKWymYNHK5tjRPq4ufFwQx5EcagP4eVOGGR8wI6u6Na9D568qWSoFmKkX9rbiOL6W1oJ4yvzE7iNxY8pIg3F5va-rU7zTaCCt99EbduXKEeh2CowmVp89WLHGDtcKIpwmJ0sMIP2jrUWyUysCpDI", alt: "Heavy back squat warm-up", badge: "5 × 5 · @RPE 8", lift: "Back Squat", weight: "160 KG" },
              { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9AZXv_XM6jUCSZP2rx_8qEnQ_NJnRqZp4ozmdksajwKFLmp9iuRUD5baxMkBOQttRu98Ot5RYL_ecIShPg6K-zQDBUeVpfT0duS1291p0BIaZRFEGRaEAbAdU3J9zuOAhCMcaEac9eyqBXNY6hNv-K_2X3W45rwFSbUTBBGUUUch5FjajpYxPhIHVkwpcqwJFyep6OCvSTpoZz6hw1BjmZ-xR-pAL7FEvsUBQ3afj_mb1hwu5P5mcx8fi3yneITQt6JlFNUmAmEV9", alt: "Dumbbell press top set", badge: "3 × 8 · @RPE 9", lift: "DB Press", weight: "42.5 KG" },
              { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtL-xupMgW-2dMWs-QWCd0DOX4BfCRHAF-qIh_doqIgCEJ2mbdHGccmMzwTqtnxpb_s8WDajh3I1EBXa8EdmQHxR71xllhehymkPzVutDpJQwthVDeHDYJGg5V8jZL2RwJk2tfEv2Q0J-AMLUPMTS2POyH7yaM8suuWXNgIExLiw50Id4mKHW-ZsYnVr7TsFr2kUN2OqVHfRizCeV_0vfcA5W8dSuTJM-mgRD_dldsRBdB1yW6PVv0w1BRCc-lMF1OHSZKm_fOOxCA", alt: "Heavy deadlift opener", badge: "1 × 3 · @RPE 9", lift: "Deadlift", weight: "220 KG" },
              { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEtAnrPRYknN3EH-gpGqxUvZKzghRnnCqJr2IWywdx3ONWe5SC2rFFRFJ898e_-FwTs9Pox7BSPj5I_uX5EYtcNy00VxzDgb-HPsVaqVSgNAGp3Z6TkMpXhq7_4d28_HYkYh6WzVBbw8t4G6ybkKBoTJmCHMr08CHSOwxtn6TBRqmIeIs0eDWetLeU9IxLRaE1vEVc36bXTLxW26hZCK3NqDK45mceTWni_SpyXiJuXA3LwXPT4ZH4jRgfoSqt6bu2DxWgGQfKH22R", alt: "Ring muscle-up training", badge: "EMOM 12 · BW", lift: "Rings", weight: "3 reps" },
              { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKxxsE4tbT32P3AbvOrJlKWvJe3kid5p2o7G9YVhZjKFLzkvuagrVga7iNTPjqvVW-vKeCtak65UP7eiuThDcSLTP63ix7Sgl9rHfxYJzuwYbHVTf9_187DXHwTj4rSz7rF15Y590j54BXsJ1ljY93GW5ticorrcMatQUJkE5cdfBt0CUXASGPhm9T-kJ_poPSBEuRYu4yenG5r60ijK9Mgz5YmpcrDYAOZsw4fJA3lVXra6SqqGNwY0Le4wKZKVfxhZAc_mKvEDYB", alt: "Pull from the floor, set-up", badge: "PAUSE 2s · @RPE 8", lift: "Snatch Pull", weight: "90 KG" },
              { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv-AGluRFQxD_hRnjCkI00S_EjO7KJJbiS-21qUZ7n-ohUpS-Arvlo-7wx3xROtsBPXzbqSUV2DFpN7USEgbLuOPr3H7RQsKH6HAtZ5x_VTGsT3gnVjdr6ten9agNvetKPevlD1fM5mzBxH7q5D_noVDk30mC1W7fJ9TV7K1ObHEtKNekTFOUEoi6uZ-toEFxwvt89fdVeG9tI7it0b2gYcVeAF7ePUSu85swgh_0Z4JwSgJAn9bu20kosb8KxOV3HIobFgK6ox7fj", alt: "Athlete reviewing program on phone", badge: "SESSION REVIEW", lift: "Debrief", weight: "12 min" },
              { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4xxGYVrUay99xOo9YqvsbzQDf_p03c1hGLVeZCcdUMwbcGlA37il1SRAoEnHyVEPEr3mAJWotU8WEWTwIlK58UvjMNnkeJmadIaY3JMg9veejVHso80zxKeAIyKWymYNHK5tjRPq4ufFwQx5EcagP4eVOGGR8wI6u6Na9D568qWSoFmKkX9rbiOL6W1oJ4yvzE7iNxY8pIg3F5va-rU7zTaCCt99EbduXKEeh2CowmVp89WLHGDtcKIpwmJ0sMIP2jrUWyUysCpDI", alt: "Front squat session", badge: "4 × 6 · @RPE 7", lift: "Front Squat", weight: "120 KG" },
            ];
            return (
              <section id="in-motion" className="mt-section-gap">
                <div className="flex items-end justify-between gap-6 mb-8 md:mb-12 flex-wrap">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-background uppercase border-l-4 border-primary-container pl-4 text-balance">In Motion</h2>
                    <p className="font-body-md text-body-md text-secondary mt-3 max-w-prose">A week from inside the program. No edits, no filters. The work that the spreadsheet describes.</p>
                  </div>
                  <span className="font-label-bold text-label-bold text-primary-container/80 uppercase tracking-widest hidden md:inline">Hover · paused</span>
                </div>
                <div className="relative -mx-margin-fluid overflow-hidden py-2">
                  <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"></div>
                  <div className="range-marquee-track px-margin-fluid">
                    {[...motionTiles, ...motionTiles].map((t, i) => (
                      <figure key={i} className="shrink-0 w-80 h-56 relative overflow-hidden border border-surface-variant rounded" aria-hidden={i >= motionTiles.length ? true : undefined}>
                        <img className="absolute inset-0 w-full h-full object-cover opacity-90" src={t.src} alt={i < motionTiles.length ? t.alt : ""} loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
                        <div className="absolute top-3 left-3 bg-background/85 backdrop-blur-sm border border-primary-container/30 px-2 py-1 rounded-sm">
                          <span className="font-label-bold text-label-bold text-primary-container uppercase tabular-nums tracking-widest">{t.badge}</span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <span className="font-headline-md text-on-background uppercase text-lg leading-none drop-shadow-md">{t.lift}</span>
                          <span className="font-label-bold text-label-bold text-secondary uppercase tabular-nums">{t.weight}</span>
                        </div>
                      </figure>
                    ))}
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Section: Lifters in the Program (3 alternating rows) */}
          {(() => {
            const lifters = [
              {
                cycle: "CYCLE 01", name: "Mason · 32 · Berlin", role: "Foundation graduate",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv-AGluRFQxD_hRnjCkI00S_EjO7KJJbiS-21qUZ7n-ohUpS-Arvlo-7wx3xROtsBPXzbqSUV2DFpN7USEgbLuOPr3H7RQsKH6HAtZ5x_VTGsT3gnVjdr6ten9agNvetKPevlD1fM5mzBxH7q5D_noVDk30mC1W7fJ9TV7K1ObHEtKNekTFOUEoi6uZ-toEFxwvt89fdVeG9tI7it0b2gYcVeAF7ePUSu85swgh_0Z4JwSgJAn9bu20kosb8KxOV3HIobFgK6ox7fj",
                quote: '"I came in with a 130 kg squat and the same back pain I\'d had for two years. The video reviews fixed both, in that order."',
                body: "Mason had three years of self-programmed lifting before joining. The pre-block intake call rebuilt his squat pattern in week 2; weight followed.",
                stats: [
                  { label: "Squat 1RM", big: "+22 kg", small: "130 → 152" },
                  { label: "Bodyweight", big: "+3.4 kg", small: "Lean" },
                  { label: "Sessions", big: "47 / 48", small: "Adherence" },
                ],
                reverse: false,
              },
              {
                cycle: "CYCLE 02", name: "Priya · 28 · Toronto", role: "Strength block",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtL-xupMgW-2dMWs-QWCd0DOX4BfCRHAF-qIh_doqIgCEJ2mbdHGccmMzwTqtnxpb_s8WDajh3I1EBXa8EdmQHxR71xllhehymkPzVutDpJQwthVDeHDYJGg5V8jZL2RwJk2tfEv2Q0J-AMLUPMTS2POyH7yaM8suuWXNgIExLiw50Id4mKHW-ZsYnVr7TsFr2kUN2OqVHfRizCeV_0vfcA5W8dSuTJM-mgRD_dldsRBdB1yW6PVv0w1BRCc-lMF1OHSZKm_fOOxCA",
                quote: '"I\'d never deadlifted over body-weight. By week ten the bar moved like it owed me an answer."',
                body: "Priya joined the Strength block on a friend's recommendation. The block rotated her primary lift weekly; the deadlift was the surprise.",
                stats: [
                  { label: "Deadlift 1RM", big: "+34 kg", small: "98 → 132" },
                  { label: "RPE Avg", big: "7.6", small: "Sustainable" },
                  { label: "Form review", big: "9", small: "Submitted" },
                ],
                reverse: true,
              },
              {
                cycle: "CYCLE 03", name: "Atli · 34 · Reykjavík", role: "Peak · meet prep",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEtAnrPRYknN3EH-gpGqxUvZKzghRnnCqJr2IWywdx3ONWe5SC2rFFRFJ898e_-FwTs9Pox7BSPj5I_uX5EYtcNy00VxzDgb-HPsVaqVSgNAGp3Z6TkMpXhq7_4d28_HYkYh6WzVBbw8t4G6ybkKBoTJmCHMr08CHSOwxtn6TBRqmIeIs0eDWetLeU9IxLRaE1vEVc36bXTLxW26hZCK3NqDK45mceTWni_SpyXiJuXA3LwXPT4ZH4jRgfoSqt6bu2DxWgGQfKH22R",
                quote: '"My coach didn\'t tell me to peak harder. He told me to peak smaller. I PRed all three lifts on meet day."',
                body: "Atli's third meet, second time using Range. The Peak block tapered intensity weekly with a 14-day deload before competition. He lifted 6.5% over previous best total.",
                stats: [
                  { label: "Meet total", big: "+38 kg", small: "582 → 620" },
                  { label: "DOTS pts", big: "421", small: "Class top-10" },
                  { label: "Cycles done", big: "03", small: "Range" },
                ],
                reverse: false,
              },
            ];
            return (
              <section className="mt-section-gap">
                <div className="mb-8 md:mb-12">
                  <h2 className="font-headline-md text-headline-md text-on-background uppercase border-l-4 border-primary-container pl-4 text-balance">Lifters in the Program</h2>
                  <p className="font-body-md text-body-md text-secondary mt-3 max-w-prose">Three of the people behind the numbers above. Twelve weeks ago, they signed up. Below: what changed.</p>
                </div>
                <div className="flex flex-col gap-12 lg:gap-16">
                  {lifters.map((l, i) => {
                    const figure = (
                      <figure className={`md:col-span-5 ${l.reverse ? "md:order-2 order-1" : ""} relative aspect-[4/5] md:aspect-auto md:min-h-[420px] overflow-hidden border border-surface-variant rounded`}>
                        <img className="absolute inset-0 w-full h-full object-cover opacity-90" src={l.img} alt={`${l.name.split("·")[0].trim()} — ${l.role}`} loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-label-bold text-label-bold text-primary-container uppercase tracking-widest">— {l.name}</span>
                            <span className="font-headline-md text-on-background uppercase text-xl leading-none drop-shadow-md">{l.role}</span>
                          </div>
                          <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest border border-secondary/30 backdrop-blur-sm bg-background/40 px-2 py-1">{l.cycle}</span>
                        </div>
                      </figure>
                    );
                    const content = (
                      <div className={`md:col-span-7 ${l.reverse ? "md:order-1 order-2" : ""} flex flex-col gap-5`}>
                        <span className="material-symbols-outlined text-primary-container text-4xl leading-none" aria-hidden="true">format_quote</span>
                        <blockquote className="font-headline-md text-headline-md text-on-background text-balance leading-tight">{l.quote}</blockquote>
                        <p className="font-body-md text-body-md text-secondary text-pretty max-w-prose">{l.body}</p>
                        <div className="grid grid-cols-3 border-t border-surface-variant pt-6 gap-3">
                          {l.stats.map((s, j) => (
                            <div key={s.label} className={`flex flex-col gap-1 ${j > 0 ? "border-l border-surface-variant pl-3" : ""}`}>
                              <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest">{s.label}</span>
                              <span className="font-display-lg text-primary-container tabular-nums leading-none">{s.big}</span>
                              <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest tabular-nums">{s.small}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                    return (
                      <article key={i} className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-stretch">
                        {figure}
                        {content}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* Section: The Block (12-week intensity visualisation) */}
          <section className="mt-section-gap">
            <div className="mb-8 md:mb-12 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-end">
              <div className="md:col-span-7">
                <h2 className="font-headline-md text-headline-md text-on-background uppercase border-l-4 border-primary-container pl-4 text-balance">The Block</h2>
                <p className="font-body-md text-body-md text-secondary mt-3 max-w-prose">Twelve weeks. Four phases. Every program runs on the same rhythm — accumulate, intensify, peak, recover.</p>
              </div>
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low border border-surface-variant rounded p-4 flex flex-col gap-1">
                  <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest">Sessions / week</span>
                  <span className="font-display-lg text-primary-container tabular-nums leading-none">04</span>
                </div>
                <div className="bg-surface-container-low border border-surface-variant rounded p-4 flex flex-col gap-1">
                  <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest">Average duration</span>
                  <span className="font-display-lg text-primary-container tabular-nums leading-none">72 min</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low border border-surface-variant rounded p-6 md:p-8">
              <div className="flex items-end gap-2 md:gap-3 h-44 md:h-56" role="img" aria-label="Twelve-week intensity ramp: 4 weeks accumulation, 4 weeks intensification, 3 weeks realization, 1 week deload.">
                {(() => {
                  const phaseFx = {
                    1: "opacity-80",
                    2: "",
                    4: "opacity-50",
                  };
                  const peakRing = "ring-2 ring-primary-container/40 ring-offset-2 ring-offset-surface-container-low";
                  const peakRingMax = "ring-2 ring-primary-container/60 ring-offset-2 ring-offset-surface-container-low";
                  const weeks = [
                    { wk: "W1", h: "32%", phase: 1 }, { wk: "W2", h: "38%", phase: 1 }, { wk: "W3", h: "44%", phase: 1 }, { wk: "W4", h: "50%", phase: 1, sep: true },
                    { wk: "W5", h: "58%", phase: 2 }, { wk: "W6", h: "66%", phase: 2 }, { wk: "W7", h: "74%", phase: 2 }, { wk: "W8", h: "82%", phase: 2, sep: true },
                    { wk: "W9", h: "92%", phase: 3, ring: peakRing }, { wk: "W10", h: "96%", phase: 3, ring: peakRing }, { wk: "W11", h: "100%", phase: 3, ring: peakRingMax, sep: true },
                    { wk: "W12", h: "22%", phase: 4 },
                  ];
                  const out = [];
                  weeks.forEach((b, i) => {
                    out.push(
                      <div key={`b-${i}`} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-surface-variant rounded-t" style={{ height: b.h }}>
                          <div className={`w-full range-bar rounded-t h-full ${b.ring || phaseFx[b.phase] || ""}`}></div>
                        </div>
                        <span className={`font-label-bold text-label-bold ${b.phase === 3 ? "text-primary-container" : "text-secondary"} tabular-nums`}>{b.wk}</span>
                      </div>
                    );
                    if (b.sep) out.push(<div key={`s-${i}`} className="w-px h-full bg-surface-variant/60"></div>);
                  });
                  return out;
                })()}
              </div>
              <div className="grid grid-cols-12 gap-2 md:gap-3 mt-6 pt-6 border-t border-surface-variant">
                <div className="col-span-4 flex flex-col gap-1">
                  <span className="font-label-bold text-label-bold text-primary-container uppercase tracking-widest">Phase I</span>
                  <span className="font-headline-md text-on-background uppercase text-base leading-tight">Accumulation</span>
                  <span className="font-body-md text-body-md text-secondary">Volume builds. RPE held at 7.</span>
                </div>
                <div className="col-span-4 flex flex-col gap-1">
                  <span className="font-label-bold text-label-bold text-primary-container uppercase tracking-widest">Phase II</span>
                  <span className="font-headline-md text-on-background uppercase text-base leading-tight">Intensification</span>
                  <span className="font-body-md text-body-md text-secondary">Volume drops. RPE rises to 9.</span>
                </div>
                <div className="col-span-3 flex flex-col gap-1">
                  <span className="font-label-bold text-label-bold text-primary-container uppercase tracking-widest">Phase III</span>
                  <span className="font-headline-md text-on-background uppercase text-base leading-tight">Realization</span>
                  <span className="font-body-md text-body-md text-secondary">Three top sets. New PRs.</span>
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <span className="font-label-bold text-label-bold text-primary-container uppercase tracking-widest">IV</span>
                  <span className="font-headline-md text-on-background uppercase text-base leading-tight">Deload</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 border border-surface-variant divide-y md:divide-y-0 md:divide-x divide-surface-variant rounded mt-4 bg-surface-container-low">
              {[
                { l: "Sets / week peak",  big: "22",       sub: "Per main lift" },
                { l: "% of 1RM range",    big: "62 — 95",  sub: "Across phases" },
                { l: "Form reviews",      big: "12",       sub: "Included" },
                { l: "Coach calls",       big: "04",       sub: "30 min each" },
              ].map(b => (
                <div key={b.l} className="p-5 flex flex-col gap-1">
                  <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest">{b.l}</span>
                  <span className="font-display-lg text-on-background tabular-nums leading-none">{b.big}</span>
                  <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest">{b.sub}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Common Questions (FAQ) */}
          <section className="mt-section-gap">
            <div className="mb-8 md:mb-12">
              <h2 className="font-headline-md text-headline-md text-on-background uppercase border-l-4 border-primary-container pl-4 text-balance">Common Questions</h2>
              <p className="font-body-md text-body-md text-secondary mt-3 max-w-prose">If we haven't answered yours, write to us. The coaches read every message.</p>
            </div>
            <div className="border border-surface-variant rounded bg-surface-container-low divide-y divide-surface-variant overflow-hidden">
              {[
                { q: "What's \"intermediate\"?",            a: "A bodyweight squat for sets of five, two years of consistent training, no obvious form holes on video. We'll send a 4-question intake before you sign up — if you're not ready, we say so." },
                { q: "What if I miss a session?",           a: "One a week is allowed without changing the cycle. More than that, your coach restructures the week and shifts the realization phase. Tell us early; we'll keep the block honest." },
                { q: "Do I need a barbell at home?",        a: "For Foundation, Hypertrophy, and Strength: a barbell, plates to ~150% bodyweight, a rack, and a bench. For Peak: meet-spec only — competition bar, calibrated plates. We can sub equipment on request, but the block is built around the standards." },
                { q: "Is nutrition included?",              a: "Strategy, yes. Macro tracking, no. Each cycle includes a one-page nutrition reference for the phase you're in (surplus / lean / cut), plus a brief on supplements. We don't write daily meal plans; that's a different job." },
                { q: "Refund window?",                       a: "Two weeks, full. After that, prorated to the week of cancellation. Nobody is forced to finish a block; we'd rather you came back than slogged through." },
              ].map(f => (
                <details key={f.q} className="range-faq group p-5 md:p-6">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h3 className="font-headline-md text-headline-md text-on-background uppercase text-lg md:text-xl">{f.q}</h3>
                    <span className="material-symbols-outlined range-chevron text-primary-container text-[24px] mt-0.5" aria-hidden="true">add</span>
                  </summary>
                  <p className="font-body-md text-body-md text-secondary mt-3 max-w-prose">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

        </main>

        {/* Final CTA */}
        <section className="bg-surface-container-low border-t border-surface-variant py-[clamp(4rem,10vw,8rem)] text-center px-margin-fluid">
          <h2 className="font-display-xl text-display-xl text-primary-container uppercase mb-6 md:mb-8 text-balance">Ready to Level Up?</h2>
          <p className="font-body-lg text-body-lg text-on-background mb-10 max-w-[65ch] mx-auto text-pretty">Stop guessing. Start progressing. Join the elite.</p>
          <button className="bg-primary-container text-background font-label-bold text-label-bold px-12 py-6 rounded uppercase tracking-wider hover:bg-white hover:text-background hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-300 active:scale-95 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low">Get Started</button>
        </section>

        {/* Footer */}
        <footer className="bg-[#0B0B0B] w-full border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-fluid py-16 max-w-[1440px] mx-auto gap-10 text-center md:text-left">
            <div className="text-xl font-black text-white tracking-widest font-['Space_Grotesk'] uppercase">Range</div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <a className="text-white/40 font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase hover:text-primary-container transition-colors duration-200 opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded px-2 py-1 -mx-2" href="#">Privacy Policy</a>
              <a className="text-white/40 font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase hover:text-primary-container transition-colors duration-200 opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded px-2 py-1 -mx-2" href="#">Terms of Service</a>
              <a className="text-white/40 font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase hover:text-primary-container transition-colors duration-200 opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded px-2 py-1 -mx-2" href="#">Contact</a>
              <a className="text-white/40 font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase hover:text-primary-container transition-colors duration-200 opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded px-2 py-1 -mx-2" href="#">FAQ</a>
            </div>
            <div className="font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase text-primary-container tabular-nums">
              © 2024 RANGE. ALL RIGHTS RESERVED.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default FitnessWellness;
