export default function T103AcidGlassStudio() {
  const navLinks = [
    { label: "MANIFESTO" },
    { label: "LABS", active: true },
    { label: "RITUAL" },
    { label: "VOID" },
  ];
  const scanlineTops = ["18%", "42%", "68%", "90%"];
  const fusionCards = [
    { num: "001", icon: "layers", title: "Segmented Depth", body: "Structural hierarchy built on glassmorphism and solid, unyielding offsets. Soft blurs banished in favor of tactile reality.", iconBg: "bg-secondary-fixed", shadow: "hard-shadow-green" },
    { num: "002", icon: "electric_bolt", title: "Cyber Kawaii", body: "Unapologetically technical yet soft. Balancing the aggressive energy of neon with approachable blob geometry.", iconBg: "bg-tertiary", shadow: "hard-shadow-pink" },
    { num: "003", icon: "code_blocks", title: "Max Minimal", body: "Sparse layouts acting as canvases for hyper-expressive, high-contrast UI components.", iconBg: "bg-secondary-fixed", shadow: "hard-shadow-green" },
  ];
  const footerLinks = [
    { label: "INSTAGRAM" },
    { label: "DISCORD", highlight: true },
    { label: "TWITTER" },
    { label: "MIRROR" },
    { label: "ETHOS" },
  ];
  const customCss = `
    .glass-panel {
      background: linear-gradient(180deg, rgba(40, 40, 48, 0.55) 0%, rgba(20, 20, 26, 0.65) 100%);
      backdrop-filter: blur(24px) saturate(140%);
      -webkit-backdrop-filter: blur(24px) saturate(140%);
      border: 1px solid rgba(245, 241, 232, 0.12);
    }
    .hard-shadow-green { box-shadow: 6px 6px 0px 0px #d4b87a; }
    .hard-shadow-pink { box-shadow: 6px 6px 0px 0px #e89572; }
    .hard-shadow-black { box-shadow: 6px 6px 0px 0px #000000; }
    .nebula-glow {
      position: absolute; width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(201,115,89,0.18) 0%, rgba(10,10,13,0) 70%);
      filter: blur(60px); z-index: -1; pointer-events: none;
    }
    .nebula-glow-green {
      position: absolute; width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(212,184,122,0.14) 0%, rgba(10,10,13,0) 70%);
      filter: blur(60px); z-index: -1; pointer-events: none;
    }
    .scanline {
      width: 100%; height: 1px; background: rgba(255, 255, 255, 0.05);
      position: absolute; z-index: 10; pointer-events: none;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #d4b87a; }
  `;
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "surface": "#0a0a0d", "background": "#0a0a0d",
                "surface-container": "#1c1c22", "surface-container-low": "#15151a",
                "on-background": "#f8f5ee", "on-surface": "#f8f5ee", "on-surface-variant": "#dcd7ca",
                "primary": "#f8f5ee", "on-primary": "#1a1a1c",
                "secondary": "#f5f1e8", "on-secondary-fixed": "#1f1809",
                "secondary-fixed": "#d4b87a", "secondary-container": "#d4b87a",
                "tertiary": "#c97359", "tertiary-container": "#3d1c10", "on-tertiary-container": "#e89572",
                "outline": "#b0aa9d", "outline-variant": "#4a4840"
              },
              borderRadius: { DEFAULT: "1rem", lg: "2rem", xl: "3rem", full: "9999px" },
              fontFamily: {
                "h1": ["Noto Serif"], "h2": ["Noto Serif"],
                "mono-label": ["Space Grotesk"], "glitch-display": ["Space Grotesk"],
                "body-md": ["Space Grotesk"], "body-lg": ["Space Grotesk"]
              },
              fontSize: {
                "h1": ["64px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
                "h2": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
                "mono-label": ["12px", { lineHeight: "1", letterSpacing: "0.15em", fontWeight: "700" }],
                "glitch-display": ["80px", { lineHeight: "1", letterSpacing: "-0.05em", fontWeight: "800" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }]
              }
            }
          }
        };
      `}} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />
      <div className="dark antialiased min-h-screen relative font-body-md text-body-md bg-background text-on-background overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="nebula-glow top-0 left-1/4 -translate-y-1/2" />
          <div className="nebula-glow-green bottom-0 right-1/4 translate-y-1/2" />
          <div className="nebula-glow top-1/2 right-0 translate-x-1/4 -translate-y-1/2" />
        </div>
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-3 w-[95%] max-w-6xl mx-auto rounded-full border-2 border-[#d4b87a]/40 mt-6 bg-[#15151a] shadow-[6px_6px_0px_0px_rgba(212,184,122,0.85)]">
          <div className="text-2xl font-black text-[#f5f1e8] italic tracking-widest">OMNI_LABS</div>
          <div className="hidden md:flex gap-8 items-center font-serif tracking-tighter uppercase">
            {navLinks.map((l) => (
              <a key={l.label} href="#" className={l.active
                ? "text-[#d4b87a] border-b-2 border-[#d4b87a] pb-0.5"
                : "text-[#dcd7ca] hover:text-[#f8f5ee] transition-colors"
              }>{l.label}</a>
            ))}
          </div>
          <button className="hidden md:block px-6 py-2 bg-transparent text-[#d4b87a] border border-[#d4b87a]/30 rounded-full font-serif tracking-tighter uppercase hover:bg-[#d4b87a] hover:text-[#1f1809] transition-all duration-300 scale-95 active:scale-90">
            CAST_SPELL
          </button>
        </nav>
        <section className="relative w-full min-h-[88vh] flex items-center pt-40 pb-24 px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0">
            {scanlineTops.map((top) => (
              <div key={top} className="scanline" style={{ top }} />
            ))}
          </div>
          <div className="absolute top-32 right-8 md:right-16 font-mono-label text-mono-label text-on-surface-variant opacity-60 z-10">
            [ X: 104.2 // Y: -43.9 ]
          </div>
          <div className="relative z-10 w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col items-start text-left order-2 md:order-1">
              <span className="font-mono-label text-mono-label text-tertiary tracking-widest uppercase mb-8 bg-tertiary-container px-3 py-1 rounded-sm hard-shadow-pink">v2.0.4_BETA</span>
              <h1 className="font-glitch-display text-glitch-display text-secondary mb-8 uppercase">
                Beyond <br />
                <span className="text-secondary-fixed italic">Mortal</span> <br />
                Aesthetics
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                A frontend design studio synthesizing ACID_WAVE intensity with MOCHI_DREAMS tactility. We forge hyper-expressive interfaces for the bold.
              </p>
            </div>
            <div className="relative order-1 md:order-2 flex items-center justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px]">
                <div className="absolute inset-0 rounded-full border border-[#d4b87a]/20" style={{ boxShadow: "0 0 80px rgba(212,184,122,0.18), inset 0 0 60px rgba(232,149,114,0.1)" }} />
                <img alt="Abstract 3D glass shape floating in dark space with warm gold and copper highlights" className="w-full h-full object-cover rounded-full opacity-90 mix-blend-screen filter contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ0daIoLJ22kzMfSqxmgcABDT2gXPkJHBQAiTdZzODfwSYHeUMcK6cUiCUtLFmciI-9BQvL4X10zVHQsphsZ8xSxW3eHk6We28C7LRvPsy9_PEVQjfaM6LjGyA6UC8mnZwpuVQKXWDn1056q822YcrraLF_GGwGhc5sUwPahVltiGJzUXOH2y6yP_V0m32aEbX7R1VC41fuDp6hiUf4k5IWI7q-Bzk84qxlzzCqL5B7UYgHcd2cGyms1v2B0k2C6kF-APrlol__Ts" />
              </div>
            </div>
          </div>
        </section>
        <main className="pb-[48px] flex flex-col gap-[96px] w-full">
          <section className="py-24 max-w-[1440px] mx-auto px-[48px] w-full">
            <div className="flex items-center justify-between mb-16">
              <h2 className="font-h2 text-h2 text-secondary uppercase">Design <span className="text-secondary-fixed">Alchemy</span></h2>
              <div className="h-[1px] bg-white/10 flex-grow ml-8 relative">
                <div className="absolute right-0 -top-1 font-mono-label text-mono-label text-on-surface-variant">SEC_02</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {fusionCards.map((c) => (
                <div key={c.num} className={`glass-panel p-8 rounded-lg ${c.shadow} relative group transition-transform hover:-translate-y-2`}>
                  <div className="absolute top-4 right-4 font-mono-label text-mono-label text-on-surface-variant">{c.num}</div>
                  <div className={`w-16 h-16 rounded-full ${c.iconBg} flex items-center justify-center mb-8 hard-shadow-black`}>
                    <span className="material-symbols-outlined text-background" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                  </div>
                  <h3 className="font-h1 text-2xl text-secondary mb-4 uppercase">{c.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{c.body}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="relative w-full flex items-center justify-center py-20 md:py-24 px-6 md:px-12 overflow-hidden">
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-[#d4b87a]/15 z-0" />
            <div className="absolute -bottom-12 -left-12 w-96 h-96 rounded-full border border-[#d4b87a]/10 z-0" />
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-[#e89572]/15 z-0" />
            <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full border border-[#e89572]/10 z-0" />
            <div className="absolute inset-0 opacity-50 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(rgba(212,184,122,0.10) 1px, transparent 1px)", backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse 70% 60% at center, black 40%, transparent 90%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at center, black 40%, transparent 90%)" }} />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4b87a]/20 to-transparent z-0" />
            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <span className="font-mono-label text-mono-label text-[#d4b87a] mb-8 inline-block tracking-[0.3em]">[ MANIFESTO_03 ]</span>
              <h2 className="font-glitch-display text-glitch-display leading-none uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#f8f5ee] to-[#d4b87a] hover:from-[#e89572] hover:to-[#d4b87a] transition-all duration-700 cursor-crosshair">
                We reject the <br /> soft blur. <br /> We demand <br /> <span className="italic font-h1">hard edges</span>.
              </h2>
              <div className="mt-16 flex justify-center gap-4">
                <span className="font-mono-label text-mono-label bg-surface-container px-4 py-2 rounded-full border border-[#d4b87a]/30 text-white">VOID_PROTOCOL_ACTIVE</span>
              </div>
            </div>
          </section>
          <section className="py-24 max-w-[1440px] mx-auto px-[48px] w-full">
            <div className="glass-panel p-12 rounded-xl flex flex-col md:flex-row items-center gap-16 relative overflow-hidden border-2 border-outline-variant">
              <div className="w-full md:w-1/2 relative z-10">
                <img alt="Abstract digital illustration blending surreal geometric shapes with neon green and pink, bold black outlines" className="w-full h-auto rounded-lg filter grayscale contrast-150 mix-blend-lighten opacity-80 border-2 border-black hard-shadow-pink" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFD9iontrF29YNtmJp27vu8zyX69KnT3p2oHt7cpg29KxwLPn-SNl9nGeSd6ZG1pR-3gsaf_HMLDbNhGTASJUdTYuOaX5IfgG6Qp_efSrBjj_cUSL1xQyC7Tyc4FkRAen2bF60ITfVMjEUQb2JmQkmhGytuRqv_ZeSDJ-SQbjVWdWezp3x9L3iTxdL8oerBuQ2rwzf1dEYaLkCxXfrxjAKJ3SnLZYYOohdgj4XwZ5BucrIEBapzH3j-XPwQ5BIbRj5dyAx1ZhF_j4" />
              </div>
              <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start">
                <span className="font-mono-label text-mono-label text-secondary-fixed mb-4">[ INIT_SEQUENCE ]</span>
                <h2 className="font-h2 text-h2 text-secondary uppercase mb-6">Begin The <br /> <span className="italic text-tertiary">Ritual</span></h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-md">
                  Step into the dimension labs. Synthesize your vision with our architectural alchemy.
                </p>
                <button className="bg-secondary-fixed text-on-secondary-fixed px-12 py-4 rounded-full font-mono-label text-mono-label uppercase tracking-widest hard-shadow-black hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000000] transition-all border-2 border-black flex items-center gap-2">
                  <span>Cast Spell</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                </button>
              </div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-white/5 z-0" />
              <div className="absolute -bottom-12 -right-12 w-96 h-96 rounded-full border border-white/5 z-0" />
            </div>
          </section>
        </main>
        <footer className="w-full px-12 mt-24 relative z-10 border-t-2 border-white/5 pt-12 pb-10 bg-[#0e0e12]">
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)" }} />
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
              <div className="text-4xl font-serif font-black text-white dark:text-white">OMNI_LABS</div>
              <div className="font-mono-label text-mono-label text-outline uppercase">
                SYS_STATUS: <span className="text-secondary-fixed">ONLINE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 font-mono text-xs tracking-widest">
              {footerLinks.map((l) => (
                <a key={l.label} href="#" className={l.highlight
                  ? "text-[#d4b87a] hover:text-[#e89572] hover:translate-x-2 transition-transform cursor-crosshair"
                  : "text-[#dcd7ca] hover:text-[#e89572] hover:translate-x-2 transition-transform cursor-crosshair"
                }>{l.label}</a>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center font-mono text-xs tracking-widest text-[#e89572]">
              <p>©2024 OMNI_LABS // BEYOND_AESTHETICS</p>
              <p className="hidden md:block opacity-50">[END_OF_TRANSMISSION]</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
