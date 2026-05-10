export default function T78LiquidMetal() {
  const desktopLinks = [
    { href: "#collection", label: "The_Drop" },
    { href: "#manifesto", label: "Manifesto" },
    { href: "#specs", label: "Specs" },
  ];

  const mobileLinks = [
    { href: "#collection", label: "01. COLLECTION" },
    { href: "#manifesto", label: "02. MANIFESTO" },
    { href: "#specs", label: "03. SPECS" },
  ];

  const products = [
    {
      title: "CYBER_RING", sub: "SIZE: ADAPTIVE", price: "€350.00",
      art: (
        <div className="w-32 h-32 rounded-full border-[12px] border-[#d1d5db] shadow-[0_0_20px_rgba(255,255,255,0.4),inset_0_0_10px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10 bg-gradient-to-tr from-gray-300 via-white to-gray-500">
          <div className="absolute inset-0 rounded-full border-[2px] border-black/20"></div>
        </div>
      ),
    },
    {
      title: "LIQUID_CHOKER", sub: "SOLID .925", price: "€550.00",
      art: (
        <div className="w-48 h-24 rounded-[100%] border-b-[8px] border-[#a0a0a0] shadow-[0_10px_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500 relative z-10">
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-12 bg-gradient-to-b from-gray-300 to-transparent clip-path-dagger"></div>
        </div>
      ),
    },
    {
      title: "MERCURY_EAR", sub: "PAIR / SINGLE", price: "€220.00",
      art: <div className="w-40 h-40 bg-gradient-to-br from-white via-gray-400 to-gray-800 rounded-full liquid-blob group-hover:scale-110 transition-transform duration-500 relative z-10 mix-blend-normal shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>,
    },
  ];

  const marquee = [
    { text: "FUTURE_PROOF", outline: false },
    { text: "LIQUID_METAL", outline: true },
    { text: "CHROME_HEARTS", outline: false },
    { text: "SYSTEM_UPDATE", outline: true },
    { text: "FUTURE_PROOF", outline: false },
    { text: "LIQUID_METAL", outline: true },
  ];

  const specs = [
    ["Base Material", "Sterling Silver .925"],
    ["Finish", "Mirror Polish / Oxidized"],
    ["Origin", "Earth / Sector 7"],
    ["Warranty", "Lifetime Digital Support"],
  ];

  const social = ["INSTAGRAM", "TWITTER", "DISCORD"];
  const legal = ["TERMS", "PRIVACY", "RETURNS"];

  const studies = [
    {
      tilt: "study-tilt-l",
      reverse: false,
      img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1400&q=85&auto=format&fit=crop",
      alt: "Foundry interior, molten flow",
      tag: "01 — The Pour",
      plate: "PLATE · I",
      serial: "Serial // CH—001 / Reflective",
      title: ["A Surface That", "Remembers Light."],
      body: "Each piece is poured at 1064°C and cooled in a vacuum chamber. The final mirror polish is achieved by hand over forty-eight hours — long enough to recall every photon that has ever touched its skin.",
      footL: "— ATELIER 07",
      footR: "EDITION OF 200",
    },
    {
      tilt: "study-tilt-r",
      reverse: true,
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=85&auto=format&fit=crop",
      alt: "Circuit-board macro, polished metal",
      tag: "02 — Circuitry",
      plate: "PLATE · II",
      serial: "Serial // CH—002 / Permanence",
      title: ["Forged for", "The Long Quiet."],
      body: "Our oxidation kiln pulls black tones out of the alloy without resorting to plating. The result is structural — the colour is the metal, not a coating, and it deepens by the decade.",
      footL: "— FORGE 02",
      footR: ".925 · OXIDIZED",
    },
    {
      tilt: "study-tilt-l",
      reverse: false,
      img: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1400&q=85&auto=format&fit=crop",
      alt: "Brutalist concrete architecture",
      tag: "03 — The Vault",
      plate: "PLATE · III",
      serial: "Serial // CH—003 / Architecture",
      title: ["Geometry as", "Inheritance."],
      body: "We treat each silhouette as an architectural problem. The volumes are subtractive — what remains is what survives the foundry, the file, and the wearer. Heirloom by deletion.",
      footL: "— STUDIO C",
      footR: "SECTOR 7 / TOKYO",
    },
  ];

  const forgeWide = "shrink-0 w-96 aspect-[16/10] relative border border-white/10 bg-black overflow-hidden";
  const forgePortrait72 = "shrink-0 w-72 aspect-[3/4] relative border border-white/10 bg-black overflow-hidden";
  const forgePortrait80 = "shrink-0 w-80 aspect-[3/4] relative border border-white/10 bg-black overflow-hidden";
  const forgeWide80 = "shrink-0 w-80 aspect-[16/10] relative border border-white/10 bg-black overflow-hidden";

  const forgeTiles = [
    { cls: forgePortrait72, img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=900&q=85&auto=format&fit=crop", label: "Pour_07", meta: "1064°C" },
    { cls: forgeWide, img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1100&q=85&auto=format&fit=crop", label: "Trace_03", meta: "SECTOR_7" },
    { cls: forgePortrait80, img: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop", label: "Apothecary_11", meta: ".925" },
    { cls: forgeWide, img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1100&q=85&auto=format&fit=crop", label: "Vault_02", meta: "METAVAULT" },
    { cls: forgePortrait72, img: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=900&q=85&auto=format&fit=crop", label: "Facade_05", meta: "PARIS" },
    { cls: forgeWide80, img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&q=85&auto=format&fit=crop", label: "Rack_19", meta: "UPLINK" },
  ];

  const forgePeople = [
    { img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=85&auto=format&fit=crop", name: "M. Aoki", role: "FORGE_LEAD" },
    { img: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=200&q=85&auto=format&fit=crop", name: "L. Reyes", role: "POLISH_CHIEF" },
    { img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=200&q=85&auto=format&fit=crop", name: "S. Vidal", role: "METALLURGY" },
    { img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=85&auto=format&fit=crop", name: "K. Halloran", role: "CASTING" },
    { img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=200&q=85&auto=format&fit=crop", name: "D. Park", role: "CRYO_OPS" },
    { img: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=200&q=85&auto=format&fit=crop", name: "E. Mori", role: "QC // SECTOR_7" },
  ];

  const atelierFrames = [
    { delay: "0s",  src: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1400&q=85&auto=format&fit=crop", alt: "Atelier — pour",   caption: "01 — The Pour" },
    { delay: "4s",  src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=85&auto=format&fit=crop", alt: "Atelier — file room, server-rack tooling close-up",   caption: "02 — The File" },
    { delay: "8s",  src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&q=85&auto=format&fit=crop", alt: "Atelier — polish floor, mirror-finish reflections under fluorescents", caption: "03 — The Polish" },
    { delay: "12s", src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1400&q=85&auto=format&fit=crop", alt: "Atelier — vault",  caption: "04 — The Vault" },
  ];

  const atelierSteps = [
    ["01", "The Pour", "1064°C"],
    ["02", "The File", "48 HRS"],
    ["03", "The Polish", "MIRROR"],
    ["04", "The Vault", "METAVAULT"],
  ];

  const faq = [
    { q: "Are pieces made by hand?", a: "Every Chrome_Hearts artifact is poured, filed, and polished by a small atelier of six. The vacuum cooling and oxidation steps are computer-monitored; everything else is touch." },
    { q: "What is the .925 standard?", a: ".925 indicates 92.5% pure silver alloyed with 7.5% copper for structural memory. Our oxidized finish is a chemical reaction with the copper, not a coating — it cannot wear off." },
    { q: "How do I care for liquid finishes?", a: "Wipe with a dry microfiber after wear. Do not use chemical polishers — they remove the patina that gives oxidized pieces their depth. The mirror finish self-restores in three to five wears." },
    { q: "Is metavault delivery covered?", a: "Every artifact ships with both a physical certificate (engraved alloy plate) and a metavault token. Token storage is included for the lifetime of the wearer's wallet." },
    { q: "Can pieces be resized?", a: "Yes. Our adaptive pieces flex within a 1.5-size range without reworking. For permanent resizing, send to Atelier 07 — the work is free for original owners across the lifetime of the artifact." },
    { q: "Where can I see them in person?", a: "By appointment in Tokyo (Sector 7), Paris (4e), and the metavault. Address & coordinates are released to confirmed appointment holders 24 hours prior." },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Syncopate:wght@400;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: { syncopate: ['Syncopate', 'sans-serif'], orbitron: ['Orbitron', 'sans-serif'] },
              colors: {
                'metal-dark': '#050505',
                'metal-dim': '#1a1a1a',
                'metal-light': '#e0e0e0',
                'neon-blue': '#4cc9f0',
                'deep-blue': '#001233',
              },
              backgroundImage: { 'chrome-gradient': 'linear-gradient(180deg, #ffffff 0%, #d4d4d4 40%, #4e4e4e 50%, #a8a8a8 51%, #ffffff 100%)' },
              animation: { 'spin-slow': 'spin 12s linear infinite', 'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }
            }
          }
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --chrome-text: linear-gradient(180deg, #fff 0%, #ccc 40%, #444 50%, #999 51%, #fff 100%); }
        body { background-color: #020202; color: #e0e0e0; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border: 1px solid #555; }
        .chrome-text { background: var(--chrome-text); background-clip: text; -webkit-background-clip: text; color: transparent; -webkit-text-stroke: 0.5px rgba(255,255,255,0.1); filter: drop-shadow(0px 0px 5px rgba(255,255,255,0.2)); }
        @keyframes liquid-morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        .liquid-blob { animation: liquid-morph 8s ease-in-out infinite; }
        .float-element { animation: float 6s ease-in-out infinite; }
        .mercury-btn {
          background: radial-gradient(circle at 30% 30%, #fff 5%, #ccc 20%, #666 50%, #222 90%);
          box-shadow: inset 2px 2px 5px rgba(255,255,255,0.9), inset -2px -2px 5px rgba(0,0,0,0.5), 5px 5px 15px rgba(0,0,0,0.5), 0 0 15px rgba(76, 201, 240, 0.2);
          transition: all 0.3s ease;
        }
        .mercury-btn:hover { transform: scale(1.02); box-shadow: inset 2px 2px 5px rgba(255,255,255,1), inset -2px -2px 5px rgba(0,0,0,0.5), 0 0 30px rgba(76, 201, 240, 0.6); }
        .grid-bg {
          background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }
        .distort { transform: skewX(-15deg); }
        #mobile-menu { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .mercury-photo { filter: grayscale(1) contrast(1.35) brightness(0.92) saturate(0); mix-blend-mode: luminosity; }
        .mercury-photo-soft { filter: grayscale(1) contrast(1.15) brightness(1) saturate(0); }

        .forge-track { display: flex; gap: 24px; width: max-content; }
        @keyframes forge-left  { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
        @keyframes forge-right { 0% { transform: translateX(calc(-50% - 12px)); } 100% { transform: translateX(0); } }
        .forge-left  { animation: forge-left 60s linear infinite; }
        .forge-right { animation: forge-right 70s linear infinite; }
        .forge-track:hover { animation-play-state: paused; }

        @keyframes atelier-fade {
          0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.6); transform: scale(1.05); }
          8%, 22%  { opacity: 1; filter: blur(0) saturate(0.9);    transform: scale(1); }
          26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.6); transform: scale(1.05); }
        }
        .atelier-cycle-img {
          animation: atelier-fade 16s linear infinite;
          opacity: 0;
          filter: blur(18px) saturate(0.6);
          transform: scale(1.05);
          will-change: opacity, filter, transform;
        }
        @keyframes atelier-scrub { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        .atelier-scrub { animation: atelier-scrub 16s linear infinite; transform-origin: left; will-change: transform; }

        .lm-faq summary::-webkit-details-marker { display: none; }
        .lm-faq summary { list-style: none; cursor: pointer; }
        .lm-faq summary .lm-chevron { transition: transform 250ms ease; }
        .lm-faq[open] summary .lm-chevron { transform: rotate(180deg); }

        .study-tilt-l { transform: rotate(-2deg); }
        .study-tilt-r { transform: rotate(2deg); }
        .study-frame { box-shadow: 0 18px 40px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), 12px 12px 0 0 rgba(76,201,240,0.12); }

        @media (prefers-reduced-motion: reduce) {
          .liquid-blob, .float-element, .forge-left, .forge-right,
          .atelier-cycle-img, .atelier-scrub { animation: none; }
          .atelier-cycle-img:first-child { opacity: 1; filter: none; transform: none; }
          .lm-faq summary .lm-chevron { transition: none; }
          .study-tilt-l, .study-tilt-r { transform: none; }
        }
      ` }} />

      <div className="scroll-smooth font-orbitron">

        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-gray-800/20 rounded-full blur-[100px]"></div>
        </div>

        <nav className="fixed top-0 w-full z-50 px-6 py-5 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div className="container mx-auto flex justify-between items-center">
            <a href="#" className="font-syncopate font-bold text-lg md:text-xl tracking-tighter text-white relative z-50 group">
              CHROME<span className="text-gray-500 group-hover:text-neon-blue transition-colors">_</span>HEARTS
            </a>
            <div className="hidden md:flex space-x-12 font-bold tracking-widest text-[10px] lg:text-xs">
              {desktopLinks.map((l) => (
                <a key={l.href} href={l.href} className="text-gray-400 hover:text-white hover:chrome-text transition-all uppercase">{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-6 relative z-50">
              <span className="hidden md:block text-xs text-neon-blue animate-pulse">SYSTEM_ONLINE</span>
              <button id="menu-btn" className="w-10 h-10 border border-white/20 rounded-full flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 transition-colors md:hidden">
                <span className="w-5 h-[2px] bg-white transition-transform origin-center"></span>
                <span className="w-5 h-[2px] bg-white transition-transform origin-center"></span>
              </button>
            </div>
          </div>
        </nav>

        <div id="mobile-menu" className="fixed inset-0 bg-black z-40 transform translate-x-full flex flex-col justify-center px-8">
          <div className="flex flex-col space-y-8 font-syncopate text-3xl font-bold">
            {mobileLinks.map((l) => (
              <a key={l.href} href={l.href} className="mobile-link text-transparent" style={{ WebkitTextStroke: "1px white" }}>{l.label}</a>
            ))}
            <a href="#" className="mobile-link text-neon-blue">04. CART (0)</a>
          </div>
          <div className="absolute bottom-10 left-8 text-xs text-gray-500 font-orbitron tracking-widest">TOKYO / PARIS / METAVERSE</div>
        </div>

        <header className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none">
            <h1 className="font-syncopate text-[20vw] leading-none font-bold text-white/[0.03]">LIQUID</h1>
          </div>
          <div className="relative w-64 h-64 md:w-96 md:h-96 liquid-blob mb-12 flex items-center justify-center float-element transition-all duration-700">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#fff,#a0a0a0_20%,#111_70%,#000_100%)] liquid-blob shadow-[0_0_60px_rgba(76,201,240,0.2)]"></div>
            <div className="absolute top-10 left-10 w-20 h-10 bg-white/40 blur-lg rounded-full transform -rotate-45"></div>
            <div className="absolute inset-[-20px] border border-white/20 rounded-full animate-spin-slow" style={{ borderRadius: "40% 60% 70% 30% / 50% 30% 60% 50%" }}></div>
          </div>
          <div className="relative z-10 text-center flex flex-col items-center gap-4">
            <h2 className="font-syncopate font-bold text-4xl md:text-7xl lg:text-8xl uppercase chrome-text tracking-wide leading-tight">Chrome<br />_Hearts</h2>
            <p className="font-orbitron text-xs md:text-sm text-gray-400 tracking-[0.4em] uppercase max-w-xs md:max-w-md mx-auto mt-4">Forged in the void. Polished by code.</p>
            <div className="mt-10 flex flex-col md:flex-row gap-6">
              <a href="#collection" className="mercury-btn rounded-full px-10 py-4 text-black font-syncopate font-bold text-xs tracking-widest inline-flex items-center justify-center group">
                <span className="mr-2">Explore_V1</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
            <span className="text-[10px] tracking-widest">SCROLL</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
          </div>
        </header>

        <section id="manifesto" className="py-24 md:py-32 bg-metal-dark border-t border-white/10 relative overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <h3 className="font-syncopate font-black text-6xl md:text-8xl leading-[0.8] text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>HEAVY<br />METAL<br />SOFT<br />WARE</h3>
              <div className="absolute -z-10 top-0 right-0 w-48 h-48 bg-neon-blue/20 rounded-full blur-[80px]"></div>
            </div>
            <div className="space-y-8">
              <div className="border-l-2 border-neon-blue pl-6">
                <p className="font-orbitron text-sm md:text-base leading-relaxed text-gray-300 tracking-wide text-justify">
                  We are not a clothing brand. We are a skin update. Inspired by the fluidity of mercury and the permanence of chrome, our artifacts are designed for the citizens of the simulation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
                  <span className="block text-2xl font-bold font-syncopate text-white mb-1">99%</span>
                  <span className="text-[10px] text-gray-400 tracking-widest">PURE DIGITAL</span>
                </div>
                <div className="bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
                  <span className="block text-2xl font-bold font-syncopate text-white mb-1">.925</span>
                  <span className="text-[10px] text-gray-400 tracking-widest">STERLING SILVER</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="studies" className="py-24 md:py-32 bg-black border-t border-white/10 relative overflow-hidden">
          <div className="absolute -top-20 left-1/3 w-[40vw] h-[40vw] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-gray-700/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto px-6 relative">
            <div className="flex items-center gap-4 mb-16">
              <span className="text-[10px] uppercase tracking-[0.4em] text-neon-blue whitespace-nowrap">— II · Studies</span>
              <div className="flex-1 h-px bg-white/15"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 whitespace-nowrap">PLATES I — III</span>
            </div>
            <h2 className="font-syncopate text-3xl md:text-5xl lg:text-6xl font-bold chrome-text uppercase mb-20 max-w-3xl leading-[0.95]">
              Studies in<br />Reflection
            </h2>

            <div className="space-y-24 md:space-y-32">
              {studies.map((s, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                  <figure className={`md:col-span-7 ${s.tilt} study-frame relative bg-metal-dim overflow-hidden ${s.reverse ? "md:order-2" : ""}`}>
                    <div className="aspect-[4/3] relative">
                      <img className="absolute inset-0 w-full h-full object-cover mercury-photo" src={s.img} alt={s.alt} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                        <p className="font-syncopate text-white text-[10px] uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">{s.tag}</p>
                        <span className="font-orbitron text-white/70 text-[10px] uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">{s.plate}</span>
                      </div>
                    </div>
                  </figure>
                  <div className={`md:col-span-5 space-y-6 ${s.reverse ? "md:order-1" : ""}`}>
                    <span className="font-orbitron text-[10px] tracking-[0.4em] text-neon-blue uppercase">{s.serial}</span>
                    <h3 className="font-syncopate font-bold text-2xl md:text-3xl text-white leading-tight">
                      {s.title[0]}<br />{s.title[1]}
                    </h3>
                    <p className="font-orbitron text-sm leading-relaxed text-gray-400 text-justify">{s.body}</p>
                    <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                      <span className="font-syncopate text-xs text-white">{s.footL}</span>
                      <span className="font-orbitron text-[10px] tracking-widest text-gray-500 ml-auto">{s.footR}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="collection" className="py-24 bg-black relative">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <h2 className="font-syncopate text-3xl md:text-5xl font-bold chrome-text">LATEST_DROP</h2>
              <span className="hidden md:block font-orbitron text-xs text-neon-blue animate-pulse">LIVE STATUS: AVAILABLE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((p) => (
                <div key={p.title} className="group relative h-[500px] border border-white/10 bg-[#080808] overflow-hidden flex flex-col">
                  <div className="h-3/4 w-full relative flex items-center justify-center bg-gradient-to-b from-gray-900 to-black overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-20"></div>
                    {p.art}
                  </div>
                  <div className="h-1/4 p-6 border-t border-white/10 flex flex-col justify-between bg-neutral-900 relative z-20">
                    <div>
                      <h3 className="font-syncopate font-bold text-white text-lg">{p.title}</h3>
                      <p className="text-[10px] tracking-widest text-gray-500 mt-1">{p.sub}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-orbitron text-neon-blue text-sm">{p.price}</span>
                      <button className="text-[10px] uppercase font-bold tracking-wider hover:text-white text-gray-400 transition-colors">Add to Cart +</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="forge" className="py-20 md:py-28 bg-metal-dark border-t border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10 mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-neon-blue whitespace-nowrap">— III · Atelier</span>
              <div className="flex-1 h-px bg-white/15"></div>
              <span className="font-orbitron text-[10px] text-gray-500 tracking-widest animate-pulse hidden md:inline">FEED // LIVE</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="font-syncopate text-3xl md:text-5xl font-bold chrome-text uppercase leading-[0.95] max-w-2xl">Cast &amp; Forge</h2>
              <p className="font-orbitron text-xs md:text-sm text-gray-400 max-w-md md:text-right tracking-wide">
                Twelve thousand hours per quarter. Recorded between Sector 7 and the metavault. Hover to hold a frame.
              </p>
            </div>
          </div>

          <div className="overflow-hidden py-3 relative z-10">
            <div className="forge-track forge-left">
              {[...forgeTiles, ...forgeTiles].map((t, i) => (
                <figure key={i} className={t.cls} aria-hidden={i >= forgeTiles.length ? "true" : undefined}>
                  <img className="absolute inset-0 w-full h-full object-cover mercury-photo" src={t.img} alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <figcaption className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                    <span className="font-syncopate text-white text-[10px] uppercase tracking-widest">{t.label}</span>
                    <span className="font-orbitron text-neon-blue text-[10px] tracking-widest">{t.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="overflow-hidden py-3 mt-6 relative z-10">
            <div className="forge-track forge-right">
              {[...forgePeople, ...forgePeople].map((p, i) => (
                <div key={i} aria-hidden={i >= forgePeople.length ? "true" : undefined} className="shrink-0 flex items-center gap-4 pl-1 pr-5 py-1 border border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-full">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/15 shrink-0">
                    <img className="w-full h-full object-cover mercury-photo-soft" src={p.img} alt="" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-syncopate text-white text-xs uppercase tracking-widest">{p.name}</span>
                    <span className="font-orbitron text-neon-blue text-[10px] tracking-widest">{p.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="py-4 bg-white border-y-4 border-gray-300 overflow-hidden select-none">
          <div className="flex animate-[marquee_15s_linear_infinite] whitespace-nowrap">
            {marquee.map((m, i) => (
              <span key={i} className={`text-4xl font-syncopate font-black mx-4 ${m.outline ? "text-transparent" : "text-black"}`} style={m.outline ? { WebkitTextStroke: "1px black" } : undefined}>{m.text}</span>
            ))}
          </div>
        </div>

        <section id="specs" className="py-24 bg-metal-dim relative">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-syncopate text-2xl md:text-3xl font-bold mb-12 text-center text-white">TECHNICAL_SPECIFICATIONS</h2>
            <div className="border border-white/20 bg-black/50 backdrop-blur-sm">
              {specs.map(([k, v], i) => (
                <div key={k} className={`grid grid-cols-2 group hover:bg-white/5 transition-colors ${i < specs.length - 1 ? "border-b border-white/20" : ""}`}>
                  <div className="p-4 md:p-6 font-orbitron text-xs text-gray-400 border-r border-white/20 uppercase tracking-widest">{k}</div>
                  <div className="p-4 md:p-6 font-syncopate text-sm md:text-base text-white">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="font-orbitron text-[10px] text-gray-500 tracking-[0.5em] animate-pulse">ENCRYPTION KEY: VALID</p>
            </div>
          </div>
        </section>

        <section id="atelier" className="py-24 md:py-32 bg-black border-t border-white/10 relative overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-[40vw] h-[40vw] bg-neon-blue/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <span className="text-[10px] uppercase tracking-[0.4em] text-neon-blue whitespace-nowrap">— V · The Atelier</span>
              <div className="flex-1 h-px bg-white/15"></div>
              <span className="font-orbitron text-[10px] text-gray-500 tracking-widest">16s LOOP</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Sticky removed so left col can grow to match right col's aspect-[3/4] image.
                  Atelier Signal card fills the remaining height with live-stat cells. */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                <h2 className="font-syncopate text-3xl md:text-5xl font-bold chrome-text uppercase leading-[0.95]">
                  In Motion,<br />Held Still.
                </h2>
                <p className="font-orbitron text-sm md:text-base leading-relaxed text-gray-400 text-justify">
                  Four windows into the atelier — pour, file, polish, vault. Each frame is real-time documentation, recorded between Tokyo and the metavault. Hover the strip below to lock onto a single window.
                </p>

                <ol className="space-y-4 pt-4 border-t border-white/10">
                  {atelierSteps.map(([n, label, meta]) => (
                    <li key={n} className="flex items-baseline gap-4">
                      <span className="font-orbitron text-[10px] tracking-widest text-neon-blue tabular-nums w-10">{n}</span>
                      <span className="font-syncopate text-sm text-white uppercase">{label}</span>
                      <span className="ml-auto font-orbitron text-[10px] tracking-widest text-gray-500">{meta}</span>
                    </li>
                  ))}
                </ol>

                <div>
                  <div className="h-px w-full bg-white/10 relative overflow-hidden">
                    <div className="atelier-scrub absolute inset-y-0 left-0 w-full bg-neon-blue"></div>
                  </div>
                  <p className="font-orbitron text-[10px] text-gray-500 tracking-[0.3em] mt-2">FEED // CONTINUOUS</p>
                </div>

                {/* Atelier Signal — live status card, fills space to bottom-align with image. */}
                <aside className="flex-1 flex flex-col gap-5 p-6 md:p-7 border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                      </span>
                      <span className="font-syncopate text-xs text-white uppercase tracking-widest">Atelier Signal</span>
                    </div>
                    <span className="font-orbitron text-[10px] tracking-widest text-gray-500 tabular-nums">[V_LIVE]</span>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-white/10">
                    <div className="bg-black/40 p-4 flex flex-col gap-1">
                      <span className="font-orbitron text-[10px] tracking-widest text-gray-500 uppercase">Furnace</span>
                      <span className="font-syncopate text-2xl font-bold text-white tabular-nums">1064°C</span>
                      <span className="font-orbitron text-[9px] tracking-widest text-neon-blue uppercase">Operational</span>
                    </div>
                    <div className="bg-black/40 p-4 flex flex-col gap-1">
                      <span className="font-orbitron text-[10px] tracking-widest text-gray-500 uppercase">Crew</span>
                      <span className="font-syncopate text-2xl font-bold text-white tabular-nums">06 / 08</span>
                      <span className="font-orbitron text-[9px] tracking-widest text-neon-blue uppercase">On-bench</span>
                    </div>
                    <div className="bg-black/40 p-4 flex flex-col gap-1">
                      <span className="font-orbitron text-[10px] tracking-widest text-gray-500 uppercase">Today</span>
                      <span className="font-syncopate text-2xl font-bold text-white tabular-nums">03</span>
                      <span className="font-orbitron text-[9px] tracking-widest text-neon-blue uppercase">Pours logged</span>
                    </div>
                    <div className="bg-black/40 p-4 flex flex-col gap-1">
                      <span className="font-orbitron text-[10px] tracking-widest text-gray-500 uppercase">Vault sync</span>
                      <span className="font-syncopate text-2xl font-bold text-white tabular-nums">0×7C</span>
                      <span className="font-orbitron text-[9px] tracking-widest text-neon-blue uppercase">Live</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-2 mt-auto pt-4 border-t border-white/10">
                    <span className="font-orbitron text-[10px] tracking-widest text-gray-500 uppercase">Tokyo · Sector 7 · 14:22 JST</span>
                    <a href="#" className="font-syncopate text-[10px] tracking-widest text-neon-blue uppercase border-b border-neon-blue/50 hover:border-neon-blue transition-colors">Visit log →</a>
                  </div>
                </aside>
              </div>

              <div className="lg:col-span-7">
                <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden border border-white/10 bg-metal-dim">
                  {atelierFrames.map((f) => (
                    <img key={f.delay} className="atelier-cycle-img absolute inset-0 w-full h-full object-cover mercury-photo" style={{ animationDelay: f.delay }} src={f.src} alt={f.alt} />
                  ))}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4">
                    <div className="relative min-h-[44px] flex-1">
                      {atelierFrames.map((f) => (
                        <span key={f.delay} className="atelier-cycle-img absolute inset-0 font-syncopate font-bold text-white text-lg md:text-xl uppercase tracking-wide" style={{ animationDelay: f.delay }}>{f.caption}</span>
                      ))}
                    </div>
                    <span className="font-orbitron text-[10px] tracking-widest text-neon-blue shrink-0">REC // LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 md:py-32 bg-metal-dark border-t border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <span className="text-[10px] uppercase tracking-[0.4em] text-neon-blue whitespace-nowrap">— VI · Reception</span>
              <div className="flex-1 h-px bg-white/15"></div>
              <span className="font-orbitron text-[10px] text-gray-500 tracking-widest">06 ENTRIES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
              <div className="md:col-span-4 space-y-6">
                <figure className="relative border border-white/10 bg-black overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <img className="absolute inset-0 w-full h-full object-cover mercury-photo" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85&auto=format&fit=crop" alt="Witness portrait" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <figcaption className="absolute bottom-4 left-4 right-4">
                      <p className="font-syncopate text-white text-xs uppercase tracking-widest">— H. Vance</p>
                      <p className="font-orbitron text-[10px] text-neon-blue tracking-widest mt-1">CRITIC, METAL_QUARTERLY</p>
                    </figcaption>
                  </div>
                </figure>
                <blockquote className="font-orbitron text-sm leading-relaxed text-gray-300 italic border-l-2 border-neon-blue pl-5">
                  "Chrome_Hearts has rewritten what it means for a metal to feel cold. Wearing it is closer to wearing a thought than wearing an object."
                </blockquote>
              </div>

              <div className="md:col-span-8">
                <h2 className="font-syncopate text-3xl md:text-4xl font-bold chrome-text uppercase mb-8 leading-[0.95]">Frequently<br />Transmitted.</h2>

                <div className="border-t border-white/10">
                  {faq.map((f, i) => (
                    <details key={i} className={`lm-faq group py-5 ${i < faq.length - 1 ? "border-b border-white/10" : ""}`}>
                      <summary className="flex items-center justify-between gap-6">
                        <h3 className="font-syncopate text-sm md:text-base text-white uppercase tracking-wide">{f.q}</h3>
                        <svg className="lm-chevron w-4 h-4 text-neon-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </summary>
                      <p className="font-orbitron text-sm leading-relaxed text-gray-400 mt-4 pl-1">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-black border-t border-white/10 text-center">
          <div className="container mx-auto px-6">
            <h3 className="font-syncopate text-xl text-white mb-6">JOIN THE HIVE_MIND</h3>
            <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
              <input type="email" placeholder="ENTER_EMAIL" className="flex-1 bg-transparent border border-white/30 p-4 text-white font-orbitron text-sm focus:border-neon-blue focus:outline-none transition-colors placeholder-gray-600" />
              <button type="submit" className="bg-white text-black font-syncopate font-bold px-8 py-4 text-sm hover:bg-neon-blue transition-colors">SUBMIT</button>
            </form>
          </div>
        </section>

        <footer className="bg-black text-white pt-20 pb-8 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-end pb-12 border-b border-white/10">
              <div className="mb-12 lg:mb-0 w-full lg:w-auto">
                <h2 className="font-syncopate text-[15vw] lg:text-9xl font-bold text-neutral-900 distort leading-none select-none hover:text-neutral-800 transition-colors cursor-default">CHROME</h2>
                <h2 className="font-syncopate text-[15vw] lg:text-9xl font-bold text-neutral-900 distort leading-none lg:ml-24 select-none hover:text-neutral-800 transition-colors cursor-default">HEARTS</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-12 lg:gap-24 text-right w-full lg:w-auto justify-end">
                <div className="flex flex-col space-y-4">
                  <h4 className="font-syncopate text-sm text-gray-500 mb-2">SOCIAL</h4>
                  {social.map((s) => (
                    <a key={s} href="#" className="font-orbitron text-xs tracking-[0.2em] hover:text-neon-blue transition-colors">{s}</a>
                  ))}
                </div>
                <div className="flex flex-col space-y-4">
                  <h4 className="font-syncopate text-sm text-gray-500 mb-2">LEGAL</h4>
                  {legal.map((l) => (
                    <a key={l} href="#" className="font-orbitron text-xs tracking-[0.2em] hover:text-neon-blue transition-colors">{l}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-orbitron tracking-widest">
              <p>&copy; 2077 CHROME_HEARTS INC.</p>
              <p className="mt-2 md:mt-0">DESIGNED IN THE VOID</p>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const menuBtn = document.getElementById('menu-btn');
          const mobileMenu = document.getElementById('mobile-menu');
          if (!menuBtn || !mobileMenu) return;
          const mobileLinks = document.querySelectorAll('.mobile-link');
          let isMenuOpen = false;
          function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
              mobileMenu.classList.remove('translate-x-full');
              document.body.style.overflow = 'hidden';
              menuBtn.children[0].classList.add('rotate-45', 'translate-y-[4px]');
              menuBtn.children[1].classList.add('-rotate-45', '-translate-y-[4px]');
            } else {
              mobileMenu.classList.add('translate-x-full');
              document.body.style.overflow = '';
              menuBtn.children[0].classList.remove('rotate-45', 'translate-y-[4px]');
              menuBtn.children[1].classList.remove('-rotate-45', '-translate-y-[4px]');
            }
          }
          menuBtn.addEventListener('click', toggleMenu);
          mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
        })();
      ` }} />
    </>
  );
}
