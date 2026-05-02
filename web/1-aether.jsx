export default function T1Aether() {
  const axioms = [
    { numeral: "I",   tag: "[ AXIOM_I ]",   title: "Material Honesty",     body: "No surface is decorative. Each substrate — titanium, ceramic, aramid — is selected for the load it carries, not the way it photographs." },
    { numeral: "II",  tag: "[ AXIOM_II ]",  title: "Quiet Telemetry",      body: "Instruments speak only when called. The cabin is silent by default; status surfaces on the wrist, never the dashboard. Notifications are a vendor failure mode." },
    { numeral: "III", tag: "[ AXIOM_III ]", title: "Modular Sovereignty",  body: "Every component is replaceable. No glue traps. No paired serials. No vendor lock past the year of purchase. The artifact belongs to its owner — not to the OEM." },
    { numeral: "IV",  tag: "[ AXIOM_IV ]",  title: "Forward Compatibility", body: "Ten-year service horizon. Schematics included. The next decade of firmware ships with the artifact — not behind a subscription, not behind a paywall, not behind a successor SKU." },
    { numeral: "V",   tag: "[ AXIOM_V ]",   title: "Aesthetic Restraint",  body: "Refuse ornament. Refuse the trend cycle. Beauty is what remains after the unnecessary has been subtracted — and what survives the next ten launches without revision." },
  ];

  const disciplines = [
    { numeral: "I",   icon: "precision_manufacturing", chip: "[ FAB / 5-AXIS ]",  title: "Fabrication", phase: "Phase 01", body: "Single-mill titanium chassis. Tolerance ±5µm. No press-fits. No glued joints. Each unit traceable to the billet." },
    { numeral: "II",  icon: "science",                 chip: "[ LAB / R-3 ]",     title: "Synthesis",   phase: "Phase 02", body: "In-house polymer and ceramic R&D. Custom alloys formulated against load envelopes — never sourced from a vendor catalogue." },
    { numeral: "III", icon: "monitoring",              chip: "[ OPS / 24H ]",     title: "Telemetry",   phase: "Phase 03", body: "Anonymous instrument feedback. Encrypted firmware channel. The unit reports to the owner first — and to the factory only by consent." },
    { numeral: "IV",  icon: "local_shipping",          chip: "[ LOG / GLOBAL ]",  title: "Dispatch",    phase: "Phase 04", body: "Hand-courier from atelier to threshold. Signature handshake on receipt. No drop boxes. No third-party last mile. The artifact never leaves a chain of custody." },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "surface-dim": "#121414",
                "surface-tint": "#abd600",
                "on-secondary-fixed-variant": "#474646",
                "on-tertiary-fixed": "#1c1b1b",
                "on-secondary-fixed": "#1c1b1b",
                "on-primary-fixed-variant": "#3c4d00",
                "tertiary-fixed": "#e5e2e1",
                "on-tertiary-container": "#656464",
                "error-container": "#93000a",
                "inverse-primary": "#506600",
                "tertiary-container": "#e5e2e1",
                "on-secondary-container": "#bab8b7",
                "outline-variant": "#444933",
                "surface": "#121414",
                "on-tertiary": "#313030",
                "secondary-container": "#4a4949",
                "tertiary-fixed-dim": "#c8c6c5",
                "on-error-container": "#ffdad6",
                "primary-container": "#c3f400",
                "tertiary": "#ffffff",
                "on-secondary": "#313030",
                "on-error": "#690005",
                "background": "#121414",
                "on-primary": "#283500",
                "on-tertiary-fixed-variant": "#474746",
                "surface-bright": "#37393a",
                "secondary-fixed": "#e5e2e1",
                "secondary": "#c9c6c5",
                "on-surface-variant": "#c4c9ac",
                "on-primary-fixed": "#161e00",
                "primary": "#ffffff",
                "inverse-surface": "#e2e2e2",
                "surface-container-highest": "#333535",
                "primary-fixed-dim": "#abd600",
                "secondary-fixed-dim": "#c9c6c5",
                "outline": "#8e9379",
                "surface-container-low": "#1a1c1c",
                "surface-container-lowest": "#0c0f0f",
                "on-primary-container": "#556d00",
                "surface-container-high": "#282a2b",
                "primary-fixed": "#c3f400",
                "surface-container": "#1e2020",
                "inverse-on-surface": "#2f3131",
                "on-background": "#e2e2e2",
                "on-surface": "#e2e2e2",
                "error": "#ffb4ab",
                "surface-variant": "#333535"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: {
                "margin-edge": "64px",
                "stack-md": "40px",
                "unit": "8px",
                "stack-sm": "16px",
                "gutter": "32px",
                "stack-lg": "80px",
                "max-width": "1440px"
              },
              fontFamily: {
                "h3-title": ["Space Grotesk", "sans-serif"],
                "h1-display": ["Space Grotesk", "sans-serif"],
                "body-md": ["Manrope", "sans-serif"],
                "body-lg": ["Manrope", "sans-serif"],
                "label-caps": ["Space Grotesk", "sans-serif"],
                "h2-headline": ["Space Grotesk", "sans-serif"]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .glow-button { box-shadow: 0 0 20px rgba(195, 244, 0, 0.15); }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
        }
      ` }} />

      <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container font-body-md overflow-x-hidden flex flex-col min-h-screen dark">

        <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-[40px] border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] transition-all duration-700">
          <nav aria-label="Main Navigation" className="flex justify-between items-center gap-3 px-4 py-4 w-full max-w-[1920px] mx-auto sm:gap-6 sm:px-8 sm:py-6 md:px-16 md:py-10">
            <a href="#" aria-label="Aether Home" className="text-xl font-black tracking-tighter text-lime-400 sm:text-2xl md:text-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm">
              AETHER
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a className="font-label-caps tracking-[0.2em] uppercase text-xs font-bold text-white/60 hover:text-lime-400 hover:tracking-[0.3em] transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5" href="#">Collections</a>
              <a className="font-label-caps tracking-[0.2em] uppercase text-xs font-bold text-white/60 hover:text-lime-400 hover:tracking-[0.3em] transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5" href="#">Manifesto</a>
              <a className="font-label-caps tracking-[0.2em] uppercase text-xs font-bold text-white/60 hover:text-lime-400 hover:tracking-[0.3em] transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5" href="#">Archive</a>
              <a className="font-label-caps tracking-[0.2em] uppercase text-xs font-bold text-white/60 hover:text-lime-400 hover:tracking-[0.3em] transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5" href="#">Atelier</a>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <a className="font-label-caps tracking-[0.2em] uppercase text-[10px] font-bold text-lime-400 hover:text-lime-400 hover:tracking-[0.3em] transition-all duration-500 ease-out border border-lime-400/30 px-3 py-1.5 hover:bg-lime-400/10 sm:text-xs sm:px-4 sm:py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm" href="#">
                <span className="hidden sm:inline">Access Portal</span>
                <span className="sm:hidden">Portal</span>
              </a>
              <button type="button" aria-label="Open shopping bag" className="text-white/60 hover:text-lime-400 transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-full p-1 active:scale-95">
                <span className="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
              </button>
            </div>
          </nav>
        </header>

        <main className="w-full flex-grow flex flex-col pt-[72px] sm:pt-[96px] md:pt-[120px]">

          <section aria-labelledby="hero-heading" className="min-h-[100dvh] flex items-center px-5 w-full max-w-max-width mx-auto relative mb-12 sm:px-8 sm:mb-16 md:px-margin-edge md:mb-stack-lg">
            <div className="absolute top-0 z-0 opacity-20 pointer-events-none h-full bg-cover bg-center" style={{ left: "50%", transform: "translateX(-50%)", width: "100vw", backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAsLEAeymXsx8WUKxUe4aPKXvjWrdWukOUJpJmd1w8MV3A_UJu5RfvV5ZZxWAkwUF3WeqAvHZ0EUc7Lfsvs6wm2FGonf7clOpt1Z--P6FCi7qhQaarKBEaH7KnkNbVq_xdXx4PExuAybSLVrx-lkSGLdnvpfYTFvN7NyHaae-dmxMmc4fx_cXTBK09Xmivd7NlyBH6t9RrMA5ibLQyKCjcM5Msj7HmH8ClOWnRMpnlUsY0MMoPxdAU-2tNi7ApLf_qioD9dbNHJ2od')" }} role="img" aria-label="Abstract dark futuristic geometric landscape with subtle glowing green lines and deep shadows"></div>
            <div className="grid grid-cols-12 gap-6 w-full relative z-10 sm:gap-gutter">
              <div className="col-span-12 md:col-span-10 lg:col-span-8 flex flex-col justify-center">
                <h1 id="hero-heading" className="font-h1-display text-[clamp(2.5rem,5vw+1rem,5.25rem)] text-primary mb-5 uppercase leading-[1.05] sm:leading-[1.1] sm:mb-stack-sm text-balance tracking-tight">
                  Engineered For The <span className="text-primary-container">Vanguard</span>
                </h1>
                <p className="font-body-md text-[clamp(1rem,1vw+0.5rem,1.125rem)] text-secondary max-w-[65ch] mb-6 sm:mb-stack-md text-pretty leading-relaxed">
                  AETHER bridges the chasm between raw technological capability and uncompromising luxury. Artifacts designed not for the present, but for the impending horizon.
                </p>
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <button type="button" className="bg-primary-container text-on-primary-container font-label-caps text-[clamp(10px,1vw+6px,12px)] px-6 py-3 uppercase tracking-[0.2em] glow-button hover:bg-white transition-all duration-300 sm:px-8 sm:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary-container active:scale-[0.98] rounded-sm font-bold">
                    Explore Collections
                  </button>
                  <button type="button" className="border border-white/20 text-white font-label-caps text-[clamp(10px,1vw+6px,12px)] px-6 py-3 uppercase tracking-[0.2em] hover:bg-white/5 transition-all duration-300 sm:px-8 sm:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-white active:scale-[0.98] rounded-sm font-bold">
                    The Manifesto
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="collections-heading" className="px-5 w-full max-w-max-width mx-auto mb-12 sm:px-8 sm:mb-16 md:px-margin-edge md:mb-stack-lg">
            <div className="flex flex-col items-start gap-3 mb-8 sm:flex-row sm:justify-between sm:items-end sm:gap-6 sm:mb-stack-md">
              <h2 id="collections-heading" className="font-h2-headline text-[clamp(2rem,3vw+1rem,3rem)] text-primary uppercase leading-tight text-balance tracking-tight">Current Protocol</h2>
              <a className="font-label-caps text-xs text-primary-container hover:text-white transition-colors duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5 tracking-widest uppercase font-bold" href="#">
                View Complete Archive <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[280px] sm:gap-gutter md:auto-rows-[400px]">
              <article className="col-span-1 md:col-span-8 glass-card rounded-xl overflow-hidden relative group">
                <img alt="Sleek metallic futuristic hardware lying on dark obsidian surface with subtle green ambient lighting" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-80 transition-opacity duration-700" loading="lazy" decoding="async" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClQvVXDGTWBjHL0lfRFQKEGGrBPoUc71THsZXuysmS-owQSjjtkoaxLGZQQkDICkinR9z457MUcqmtVdmg1zJZr5C7Wf7O974Uz7fqyhBF9J6RDWKvb1TGz9Sqlr8mxAYcjvyLUn-bhxXkMsOu2QUVPnK-XiP0xg83dxh6w1sAqOkJOqQA_kqPXvX0JUbIdsY_xG2TMd9DCkETuN2N5B49NukXWE72QlVLtMGf6L7oX42olxFZ7slU3pPvWdEAJgRVCIsVfou_-_T6" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full sm:p-8">
                  <div className="bg-primary-container text-on-primary-container font-label-caps text-[10px] sm:text-xs px-3 py-1 inline-block mb-3 uppercase font-bold sm:mb-4 rounded-sm tabular-nums tracking-widest">Series 01</div>
                  <h3 className="font-h3-title text-[clamp(1.375rem,2vw+0.5rem,1.625rem)] text-primary mb-2 text-balance tracking-tight">Neural Interface Mk.II</h3>
                  <p className="font-body-md text-sm sm:text-base text-secondary text-pretty max-w-prose">Seamless cognitive integration in a machined titanium chassis.</p>
                </div>
              </article>
              <article className="col-span-1 md:col-span-4 glass-card rounded-xl overflow-hidden relative group p-5 flex flex-col justify-between hover:bg-white/5 transition-colors duration-500 sm:p-8">
                <div className="flex justify-between items-start w-full gap-4">
                  <span className="material-symbols-outlined text-primary-container text-3xl shrink-0" aria-hidden="true">memory</span>
                  <span className="font-label-caps text-[10px] sm:text-xs text-secondary uppercase font-bold tracking-widest text-right">Stock: Limited</span>
                </div>
                <div>
                  <h3 className="font-h3-title text-[clamp(1.375rem,2vw+0.5rem,1.625rem)] text-primary mb-2 text-balance tracking-tight">AETHER Core</h3>
                  <p className="font-body-md text-sm text-secondary text-pretty">Quantum-state processing unit. Personal infrastructure.</p>
                </div>
              </article>
              <article className="col-span-1 md:col-span-4 glass-card rounded-xl overflow-hidden relative group p-5 flex flex-col justify-between hover:bg-white/5 transition-colors duration-500 sm:p-8">
                <div className="flex justify-between items-start w-full gap-4">
                  <span className="material-symbols-outlined text-primary-container text-3xl shrink-0" aria-hidden="true">vital_signs</span>
                  <span className="font-label-caps text-[10px] sm:text-xs text-secondary uppercase font-bold tracking-widest text-right">Status: Active</span>
                </div>
                <div>
                  <h3 className="font-h3-title text-[clamp(1.375rem,2vw+0.5rem,1.625rem)] text-primary mb-2 text-balance tracking-tight">Biometric Sync</h3>
                  <p className="font-body-md text-sm text-secondary text-pretty">Continuous atmospheric and physiological optimization.</p>
                </div>
              </article>
              <article className="col-span-1 md:col-span-8 glass-card rounded-xl overflow-hidden relative group">
                <img alt="Close up of minimalist black fabric texture with sharp geometric seams and neon green accent stitching" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-80 transition-opacity duration-700" loading="lazy" decoding="async" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEv4P4XgA2xsjONELzDYOiW5PMNA4lF34K53ihzGdOWeXEwTgfZ-oxQwsCYDQhLvPwpyXlxDRuoRZCXAizOIOkeOynmg0y-m3w-X6D3WK9seHdInLjecN0CgnpyAh9yWusojk3bC-6fEKTyrLAWUQ1e26s485dj-FdxCDba2drNWx77jJiLDlzMx-wlSCKpB4G8wRwzTtFcvswynQO4D6ENcadFhR8FaHgqMH-RoRxwgXIW89tEaGqD6L9zK33j0FjqIjfHMp8EqTD" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full flex justify-between items-end gap-3 sm:p-8">
                  <div className="min-w-0">
                    <div className="bg-black text-white font-label-caps text-[10px] sm:text-xs px-3 py-1 inline-block mb-3 uppercase font-bold border border-white/20 sm:mb-4 rounded-sm tracking-widest">Apparel Component</div>
                    <h3 className="font-h3-title text-[clamp(1.375rem,2vw+0.5rem,1.625rem)] text-primary text-balance tracking-tight">Void Shell Jacket</h3>
                  </div>
                  <button type="button" aria-label="View Void Shell Jacket" className="shrink-0 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 sm:w-12 sm:h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-white active:scale-95">
                    <span className="material-symbols-outlined" aria-hidden="true">north_east</span>
                  </button>
                </div>
              </article>
            </div>
          </section>

          {/* SECTION 02 :: Doctrine — Five Axioms */}
          <section aria-labelledby="doctrine-heading" className="px-5 w-full max-w-max-width mx-auto mb-12 sm:px-8 sm:mb-16 md:px-margin-edge md:mb-stack-lg">
            <div className="grid grid-cols-12 gap-6 sm:gap-gutter">
              <div className="col-span-12 md:col-span-4 flex flex-col">
                <div className="flex items-center gap-3 mb-stack-sm">
                  <span className="w-8 h-px bg-primary-container" aria-hidden="true"></span>
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary-container font-bold tabular-nums">Doctrine — 002</span>
                </div>
                <h2 id="doctrine-heading" className="font-h2-headline text-[clamp(2rem,3vw+1rem,3rem)] text-primary uppercase leading-tight text-balance tracking-tight mb-stack-sm">
                  Five Axioms<br /><span className="text-primary-container">Of Aether</span>
                </h2>
                <p className="font-body-md text-base text-secondary leading-relaxed text-pretty mb-stack-md max-w-prose">
                  Every artifact ships against the same five constants. Compliance is forged at the metal layer — never retrofitted in firmware, never patched in marketing.
                </p>

                <figure className="relative rounded-xl overflow-hidden glass-card mt-auto group">
                  <div className="aspect-[5/3] relative overflow-hidden">
                    <img alt="Macro photograph of a machined circuit substrate with copper traces and matte black solder mask under low-key directional light" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:opacity-70 group-hover:scale-[1.02] transition-all duration-700 ease-out" loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&auto=format&fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" aria-hidden="true"></div>
                    <div className="absolute top-3 right-3 font-label-caps text-[9px] tracking-[0.3em] uppercase font-bold text-primary-container/80 tabular-nums">REF.0042</div>
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" aria-hidden="true"></span>
                      <span className="font-label-caps text-[9px] tracking-[0.3em] uppercase font-bold text-primary-container/90">In Service</span>
                    </div>
                    <figcaption className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <div className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary-container font-bold mb-1.5 tabular-nums">[ ARTIFACT / MK.II ]</div>
                      <h3 className="font-h3-title text-base sm:text-lg text-primary tracking-tight">Titanium Substrate</h3>
                      <p className="font-body-md text-xs text-secondary text-pretty mt-1 leading-relaxed max-w-[40ch]">Engineered against all five axioms. Single-billet origin, hand-finished, serial-bonded to the owner.</p>
                    </figcaption>
                  </div>
                  <div className="border-t border-white/10 px-4 py-3 flex justify-between items-center bg-black/40">
                    <span className="font-label-caps text-[9px] uppercase tracking-[0.3em] text-secondary/60 font-bold tabular-nums">GR.5 · 5-AXIS · ±5µm</span>
                    <span className="font-label-caps text-[9px] uppercase tracking-[0.3em] text-primary-container font-bold tabular-nums flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">Spec Sheet <span className="material-symbols-outlined text-xs" aria-hidden="true">arrow_forward</span></span>
                  </div>
                </figure>

                <blockquote className="border-l-2 border-primary-container/60 pl-stack-sm py-2 mt-auto">
                  <p className="font-h3-title text-base sm:text-lg text-primary italic leading-relaxed text-balance">"Restraint is not a constraint. It is the spec."</p>
                  <cite className="not-italic font-label-caps text-[10px] tracking-[0.3em] uppercase text-secondary mt-3 block tabular-nums">— Internal Memo / R-03</cite>
                </blockquote>
              </div>

              <ol className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
                {axioms.map((a) => (
                  <li key={a.numeral} className="grid grid-cols-12 gap-4 py-stack-md group hover:bg-white/[0.02] transition-colors duration-500 px-2">
                    <span className="col-span-2 sm:col-span-1 font-h3-title text-3xl sm:text-4xl text-primary-container leading-none tabular-nums" aria-hidden="true">{a.numeral}</span>
                    <div className="col-span-10 sm:col-span-11 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <h3 className="font-h3-title text-xl sm:text-2xl text-primary tracking-tight">{a.title}</h3>
                        <span className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-secondary/60 font-bold shrink-0 tabular-nums">{a.tag}</span>
                      </div>
                      <p className="font-body-md text-sm sm:text-base text-secondary leading-relaxed text-pretty max-w-prose">{a.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* SECTION 03 :: Capability — Vertical Disciplines */}
          <section aria-labelledby="disciplines-heading" className="px-5 w-full max-w-max-width mx-auto mb-12 sm:px-8 sm:mb-16 md:px-margin-edge md:mb-stack-lg">
            <div className="flex flex-col items-start gap-3 mb-8 sm:flex-row sm:justify-between sm:items-end sm:gap-6 sm:mb-stack-md">
              <div>
                <div className="flex items-center gap-3 mb-stack-sm">
                  <span className="w-8 h-px bg-primary-container" aria-hidden="true"></span>
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary-container font-bold tabular-nums">Capability — 003</span>
                </div>
                <h2 id="disciplines-heading" className="font-h2-headline text-[clamp(2rem,3vw+1rem,3rem)] text-primary uppercase leading-tight text-balance tracking-tight">Vertical Disciplines</h2>
              </div>
              <p className="font-body-md text-sm sm:text-base text-secondary max-w-md leading-relaxed text-pretty">Four in-house functions. Vertically integrated from raw silicon to finished artifact — no white-label, no margin tax, no third-party signature on the spec sheet.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-gutter">
              {disciplines.map((d) => (
                <article key={d.numeral} className="glass-card rounded-xl p-6 sm:p-8 flex flex-col gap-stack-md hover:bg-white/[0.05] transition-all duration-500 group min-h-[320px]">
                  <div className="flex items-start justify-between">
                    <span className="material-symbols-outlined text-primary-container text-4xl" aria-hidden="true">{d.icon}</span>
                    <span className="font-h3-title text-2xl text-secondary/40 leading-none tabular-nums" aria-hidden="true">{d.numeral}</span>
                  </div>
                  <div className="mt-auto">
                    <div className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary-container font-bold mb-2 tabular-nums">{d.chip}</div>
                    <h3 className="font-h3-title text-lg sm:text-xl text-primary tracking-tight mb-3">{d.title}</h3>
                    <p className="font-body-md text-sm text-secondary leading-relaxed text-pretty">{d.body}</p>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="font-label-caps text-[9px] uppercase tracking-[0.3em] text-secondary/60 font-bold">{d.phase}</span>
                    <span className="material-symbols-outlined text-secondary/40 group-hover:text-primary-container group-hover:translate-x-1 transition-all duration-300 text-base" aria-hidden="true">arrow_forward</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="w-full border-t border-white/5 bg-neutral-950 opacity-80 hover:opacity-100 transition-opacity mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-5 py-10 max-w-[1920px] mx-auto gap-6 text-center md:text-left sm:px-8 sm:py-12 md:px-16 md:py-20 md:gap-8">
            <div className="text-white font-bold tracking-widest text-lg sm:text-xl">
              AETHER
            </div>
            <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a className="font-label-caps text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-600 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5" href="#">Privacy</a>
              <a className="font-label-caps text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-600 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5" href="#">Terms</a>
              <a className="font-label-caps text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-600 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5" href="#">Protocol</a>
              <a className="font-label-caps text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-600 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-sm px-1 py-0.5" href="#">Contact</a>
            </nav>
            <div className="font-label-caps text-[10px] tracking-[0.25em] uppercase font-bold text-lime-400 text-pretty">
              © 2024 AETHER FUTURES. ENGINEERED FOR THE VANGUARD.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
