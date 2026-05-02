export default function T72HighLuxury() {
  const materials = [
    { roman: "I", title: "Sapphire Crystal", body: "Forged at 2000°C, our sapphire is virtually scratch-proof. Only a diamond can leave a mark on the lens through which you view time.", delay: 0 },
    { roman: "II", title: "Titanium Grade 5", body: "Lighter than steel, harder than gold. Polished by hand to achieve a mirror finish that resists corrosion and captures light.", delay: 100 },
    { roman: "III", title: "Horween Leather", body: "Sourced from the finest tanneries, our straps patina beautifully over time, telling a story unique to the wearer's journey.", delay: 200 },
  ];

  const movementSpecs = ["72-Hour Power Reserve", "28,800 Vibrations/Hour", "25 Jewels"];
  const footerLinks = ["Timepieces", "Atelier", "Heritage", "Concierge"];
  const legalLinks = ["Privacy", "Terms", "Instagram"];

  const atelierTiles = [
    { src: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=900&auto=format&fit=crop", plate: "Plate · I", tag: "Noir", calibre: "Calibre 71", title: "Ceramic 42", meta: "Geneva · 2024", w: "w-72 md:w-80", grad: "bg-gradient-to-t from-luxury-black via-luxury-black/30 to-transparent" },
    { src: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1100&auto=format&fit=crop", plate: "Plate · II", tag: "Movement", calibre: "Tourbillon 18", title: "Open Heart", meta: "25 Jewels · 28,800 vph", w: "w-80 md:w-[26rem]", grad: "bg-gradient-to-tr from-luxury-black/90 via-transparent to-luxury-gold/10" },
    { src: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=900&auto=format&fit=crop", plate: "Plate · III", tag: "Gold", calibre: "Calibre 18", title: "Rose 18k", meta: "Hand-finished case", w: "w-64 md:w-72", grad: "bg-gradient-to-t from-luxury-black via-transparent to-transparent" },
    { src: "https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=1100&auto=format&fit=crop", plate: "Plate · IV", tag: "Aviator", calibre: "Calibre 96", title: "Sky · 44mm", meta: "Chronograph · matte", w: "w-80 md:w-96", grad: "bg-gradient-to-bl from-luxury-black/80 via-transparent to-luxury-charcoal/60" },
    { src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=900&auto=format&fit=crop", plate: "Plate · V", tag: "Tools", calibre: "Of the Bench", title: "Brass · 1924", meta: "Heritage atelier", w: "w-64 md:w-72", grad: "bg-gradient-to-t from-luxury-black via-luxury-black/30 to-luxury-gold/15" },
    { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1100&auto=format&fit=crop", plate: "Plate · VI", tag: "Workshop", calibre: "Salle · No. 02", title: "Geneva", meta: "14 master watchmakers", w: "w-80 md:w-[26rem]", grad: "bg-gradient-to-r from-luxury-black/85 via-luxury-black/30 to-transparent" },
    { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop", plate: "Plate · VII", tag: "Hall", calibre: "Heritage", title: "MMXXIV", meta: "Centennial vault", w: "w-72 md:w-80", grad: "bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" },
  ];

  const milestones = [
    { numeral: "I", year: "MCMXXIV", title: "A bench, a name.", meta: "Founded · Geneva · 1924", numColor: "text-luxury-gold-light", labelColor: "text-luxury-gold", txt: "text-luxury-white", muted: "text-gray-500", border: "border-luxury-gold/70", isCurrent: false, isFuture: false },
    { numeral: "II", year: "MCML", title: "Calibre 18.", meta: "First gold movement · 1950", numColor: "text-luxury-gold-light", labelColor: "text-luxury-gold", txt: "text-luxury-white", muted: "text-gray-500", border: "border-luxury-gold/70", isCurrent: false, isFuture: false },
    { numeral: "III", year: "MCMLXXII", title: "The Aviator.", meta: "Pilot edition · 1972", numColor: "text-luxury-gold-light", labelColor: "text-luxury-gold", txt: "text-luxury-white", muted: "text-gray-500", border: "border-luxury-gold/70", isCurrent: false, isFuture: false },
    { numeral: "•", year: "MMXXIV", title: "Centennial.", meta: "Now · Limited 96", numColor: "text-luxury-gold-light", labelColor: "text-luxury-gold-light", txt: "text-luxury-white", muted: "text-gray-300", border: "border-luxury-gold", isCurrent: true, isFuture: false },
    { numeral: "V", year: "MMXXX", title: "Atelier II.", meta: "Forecast · Vallée de Joux", numColor: "text-gray-500", labelColor: "text-gray-500", txt: "text-gray-400", muted: "text-gray-600", border: "border-luxury-gold/30", isCurrent: false, isFuture: true },
  ];

  const refRows = [
    { side: "left", num: "No. I — Calibre 71", title: "Noir, in ceramic.", body: "A 42 mm case carved from monobloc black ceramic, sintered at 1450 °C. The bezel is silent; the lume reads near-violet at midnight.", img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1600&auto=format&fit=crop", chip: "REF · 71-CER", chipPos: "left-5", grad: "from-luxury-black/70 via-transparent to-transparent", spec: { Case: "Black ceramic · 42 mm", Movement: "Automatic · 72h", Strap: "Horween shell cordovan", Edition: "96 pieces · numbered" } },
    { side: "right", num: "No. II — Calibre 18", title: "Gold standard, alive.", body: "A flying tourbillon under sapphire, on a rose-gold case hand-finished by a single watchmaker. The dial admits the light without flattering it.", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1600&auto=format&fit=crop", chip: "REF · 18-RG", chipPos: "right-5", grad: "from-luxury-black/70 via-transparent to-luxury-gold/10", bullets: ["18k rose gold case", "Flying tourbillon · 60s", "Anglage · hand-polished", "Edition · 27 pieces"] },
    { side: "left", num: "No. III — Calibre 96", title: "Aviator, sky-tested.", body: "Built for the cockpit of a Caravelle: anti-magnetic, anti-shock, brushed titanium. The dial survives weather; the chronograph survives habit.", img: "https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=1600&auto=format&fit=crop", chip: "REF · 96-CHR", chipPos: "left-5", grad: "from-luxury-black/65 via-transparent to-luxury-charcoal/40", stats: [{ v: "44", l: "mm case" }, { v: "200", l: "m water" }, { v: "96", l: "edition" }] },
  ];

  const luxFaq = [
    { i: "I.", q: "Are pieces sold online?", a: "Numbered editions are placed by appointment only — Geneva, Milan, Tokyo, New York. Heritage references are reserved for clients of the inner circle.", open: true },
    { i: "II.", q: "What does the warranty cover?", a: "Eight years on movement, lifetime on case anglage. Service is performed only at the Geneva atelier — we collect, restore, return." },
    { i: "III.", q: "Can I commission a bespoke?", a: "A studio of three accepts six commissions per annum. Conversations begin with a private viewing; the first calibre is delivered fourteen months later." },
    { i: "IV.", q: "How do I authenticate a heritage piece?", a: "Each heritage reference carries a hidden signature beneath the rotor. Ship the piece in its original box; we examine, certify, and return within three weeks." },
    { i: "V.", q: "Where is the boutique?", a: "An unmarked door on Rue du Rhône. The address is given to clients only. The bell is answered between 14:00 and 18:00, weekdays." },
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&family=Lato:wght@300;400&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                'luxury-black': '#080808',
                'luxury-charcoal': '#121212',
                'luxury-white': '#FDFDFD',
                'luxury-gold': '#C5A059',
                'luxury-gold-light': '#E5C585',
                'luxury-gray': '#2A2A2A',
              },
              fontFamily: {
                'header': ['Cinzel', 'serif'],
                'sub': ['Playfair Display', 'serif'],
                'body': ['Lato', 'sans-serif'],
              },
              letterSpacing: {
                'widest': '0.25em',
                'extreme': '0.4em',
                'mega': '0.6em',
              },
              backgroundImage: {
                'noise': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.07%22/%3E%3C/svg%3E')",
              },
              animation: {
                'scroll-down': 'scrollDown 2s cubic-bezier(0.77, 0, 0.175, 1) infinite',
              },
              keyframes: {
                scrollDown: {
                  '0%': { transform: 'translateY(0)', opacity: '1' },
                  '100%': { transform: 'translateY(40px)', opacity: '0' },
                }
              }
            }
          }
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #080808; color: #FDFDFD; font-feature-settings: "lnum"; }
        .reveal-on-scroll { opacity: 0; transform: translateY(30px); transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
        .animate-in { animation: fadeInUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
        .delay-200 { animation-delay: 0.2s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.8s; }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        ::selection { background: #C5A059; color: #000; }
        .img-wrapper { overflow: hidden; position: relative; }
        .img-wrapper img { transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1), filter 0.5s ease; will-change: transform; }
        .img-wrapper:hover img { transform: scale(1.08); filter: grayscale(0%); }
        .line-vertical { width: 1px; background: linear-gradient(to bottom, transparent, #C5A059, transparent); }
        .line-horizontal { height: 1px; background: linear-gradient(to right, transparent, #C5A059, transparent); }
        html, body { overflow-x: clip; }
        .full-bleed-luxury { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); max-width: none; }
        .atelier-track { display: flex; gap: 22px; width: max-content; animation: atelier-x 75s linear infinite; padding: 8px 0; }
        .atelier-track:hover { animation-play-state: paused; }
        @keyframes atelier-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 11px)); } }
        .lux-faq summary { list-style: none; cursor: pointer; }
        .lux-faq summary::-webkit-details-marker { display: none; }
        .lux-faq summary .lux-glyph { transition: transform 300ms ease; }
        .lux-faq[open] summary .lux-glyph { transform: rotate(45deg); }
        .gold-pulse { animation: gold-ring 2.6s ease-out infinite; }
        @keyframes gold-ring {
          0% { box-shadow: 0 0 0 0 rgba(197,160,89,0.55); }
          70% { box-shadow: 0 0 0 12px rgba(197,160,89,0); }
          100% { box-shadow: 0 0 0 0 rgba(197,160,89,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .atelier-track { animation: none; }
          .gold-pulse { animation: none; }
          .lux-faq summary .lux-glyph { transition: none; }
        }
      ` }} />

      <div className="scroll-smooth antialiased overflow-x-hidden selection:bg-luxury-gold selection:text-black bg-luxury-black text-luxury-white">

        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 md:py-8 mix-blend-exclusion text-white transition-all duration-300">
          <div className="hidden md:block w-24">
            <span className="text-[10px] tracking-[0.3em] font-body uppercase opacity-80">Est. 1924</span>
          </div>
          <div className="text-xl md:text-2xl font-header font-bold tracking-[0.2em] text-center w-full md:w-auto text-luxury-gold">C_E</div>
          <div className="w-24 text-right hidden md:block group cursor-pointer">
            <span className="text-[10px] tracking-[0.3em] font-body uppercase group-hover:text-luxury-gold transition-colors duration-300">Menu</span>
            <div className="h-[1px] bg-luxury-gold w-0 group-hover:w-full transition-all duration-500 ml-auto mt-1"></div>
          </div>
          <div className="md:hidden absolute right-6 top-7 text-xs uppercase tracking-widest text-luxury-gold">Menu</div>
        </nav>

        <header className="relative min-h-screen w-full flex flex-col items-center justify-center bg-luxury-black border-b border-luxury-gray/20 overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80 z-0"></div>
          <div className="z-10 text-center px-4 relative max-w-7xl mx-auto">
            <h2 className="animate-in text-luxury-gold font-sub italic text-lg md:text-2xl mb-4 md:mb-8 tracking-widest">The Art of Time</h2>
            <div className="relative py-8 md:py-16">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-48 h-[1px] bg-luxury-gold/60"></div>
              <h1 className="animate-in delay-200 font-header text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-luxury-white tracking-widest md:tracking-mega uppercase leading-tight">
                Chronos<br className="md:hidden" /><span className="hidden md:inline">_</span>Elite
              </h1>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 md:w-48 h-[1px] bg-luxury-gold/60"></div>
            </div>
            <p className="animate-in delay-500 font-body text-gray-400 text-[10px] md:text-xs tracking-[0.4em] mt-8 md:mt-12 uppercase max-w-xs md:max-w-md mx-auto leading-relaxed">
              Swiss Precision &bull; Italian Heritage &bull; Global Exclusivity
            </p>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
            <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold mb-2">Discover</span>
            <div className="w-[1px] h-12 md:h-20 bg-gray-800 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-luxury-gold animate-scroll-down"></div>
            </div>
          </div>
        </header>

        <section className="bg-luxury-black py-24 md:py-48 px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-luxury-charcoal/30 -skew-x-12 pointer-events-none"></div>
          <div className="max-w-3xl mx-auto text-center relative z-10 reveal-on-scroll">
            <div className="flex justify-center mb-8">
              <span className="px-4 py-1 border border-luxury-gold/30 text-luxury-gold font-body text-[10px] tracking-[0.3em] uppercase">Manifesto</span>
            </div>
            <p className="font-sub text-2xl md:text-4xl lg:text-5xl leading-relaxed md:leading-normal text-luxury-white opacity-95">
              True luxury is the absence of noise. We do not merely measure hours; we curate moments. <span className="text-luxury-gold italic">Chronos_Elite</span> is designed for those who understand that time is the only true currency.
            </p>
            <div className="mt-12">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" alt="Signature" className="h-12 md:h-16 mx-auto opacity-40 invert" />
            </div>
          </div>
        </section>

        <section className="bg-luxury-white text-luxury-black py-24 md:py-32 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-gold flex justify-center items-center">
            <div className="w-2 h-2 bg-luxury-gold rotate-45"></div>
          </div>
          <div className="container mx-auto px-4 md:px-12">
            <div className="flex flex-col items-center mb-20 md:mb-32 reveal-on-scroll">
              <span className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">The Selection</span>
              <h3 className="font-header text-4xl md:text-6xl tracking-extreme uppercase text-center">Collections</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
              <div className="col-span-1 md:col-span-7 group cursor-pointer reveal-on-scroll">
                <div className="relative img-wrapper border border-gray-200 h-[500px] md:h-[700px]">
                  <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop" alt="The Noir Series" className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 bg-white border-t border-r border-luxury-gold z-10 transition-transform duration-500 group-hover:-translate-y-2">
                    <h4 className="font-header text-lg md:text-xl tracking-widest text-black">The Noir Series</h4>
                    <p className="font-body text-[10px] md:text-xs mt-2 tracking-widest text-gray-600">Automatic &bull; 42mm &bull; Ceramic</p>
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-5 flex flex-col justify-between group cursor-pointer mt-8 md:mt-0 reveal-on-scroll" style={{ transitionDelay: "100ms" }}>
                <div className="relative img-wrapper border border-gray-200 h-[400px] md:h-[500px]">
                  <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop" alt="Gold Standard" className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100" />
                  <div className="absolute top-0 right-0 p-6 md:p-10 bg-white border-b border-l border-luxury-gold z-10">
                    <h4 className="font-header text-lg md:text-xl tracking-widest text-right text-black">Gold Standard</h4>
                    <p className="font-body text-[10px] md:text-xs mt-2 tracking-widest text-right text-gray-600">Tourbillon &bull; 18k Rose Gold</p>
                  </div>
                </div>
                <div className="mt-8 md:mt-0 p-6 md:p-10 border-l-2 border-luxury-gold bg-gray-50 flex-grow flex items-center">
                  <p className="font-sub italic text-xl md:text-2xl text-gray-800">"Complexity hidden within simplicity is the ultimate sophistication."</p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-12 mt-8 md:mt-16 group cursor-pointer reveal-on-scroll">
                <div className="relative img-wrapper border border-gray-200 h-[400px] md:h-[600px]">
                  <img src="https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=1935&auto=format&fit=crop" alt="Aviator Elite" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
                    <div className="bg-luxury-black text-luxury-gold px-8 py-4 border border-luxury-gold backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="font-header tracking-widest uppercase text-sm">View Aviator Elite</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6 text-white md:hidden">
                    <span className="bg-black/80 px-4 py-2 text-xs tracking-widest border border-luxury-gold">Aviator Elite</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-20 text-center">
              <a href="#" className="inline-block border-b border-black pb-1 text-xs tracking-[0.3em] uppercase hover:text-luxury-gold hover:border-luxury-gold transition-colors">View All Timepieces</a>
            </div>
          </div>
        </section>

        <section className="bg-luxury-charcoal py-24 border-y border-luxury-gold/20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-luxury-gold/20">
              {materials.map((m) => (
                <div key={m.roman} className="py-8 md:px-8 reveal-on-scroll" style={m.delay ? { transitionDelay: `${m.delay}ms` } : undefined}>
                  <div className="text-luxury-gold text-4xl mb-6 font-header">{m.roman}</div>
                  <h4 className="text-white font-header text-lg tracking-widest mb-4">{m.title}</h4>
                  <p className="text-gray-500 font-body text-xs leading-loose tracking-wide">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Atelier marquee */}
        <section className="full-bleed-luxury bg-luxury-black border-y border-luxury-gold/20 py-20 md:py-28 overflow-hidden relative">
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
          <div className="container mx-auto px-6 mb-12 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <span className="text-luxury-gold font-body text-[10px] md:text-xs tracking-[0.4em] uppercase block mb-3">— Atelier · IV</span>
              <h2 className="font-header text-3xl md:text-5xl tracking-widest uppercase">From the bench.</h2>
            </div>
            <p className="font-sub italic text-base md:text-lg text-gray-400 max-w-md md:text-right">A drift of details photographed in Geneva. Hover to halt the procession; every plate is a master before it is a movement.</p>
          </div>
          <div className="overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-24 md:w-40 bg-gradient-to-r from-luxury-black to-transparent pointer-events-none z-10"></div>
            <div className="absolute top-0 bottom-0 right-0 w-24 md:w-40 bg-gradient-to-l from-luxury-black to-transparent pointer-events-none z-10"></div>
            <div className="atelier-track">
              {[...atelierTiles, ...atelierTiles].map((t, i) => (
                <figure key={`a-${i}`} aria-hidden={i >= atelierTiles.length ? "true" : undefined} className={`shrink-0 ${t.w} h-[380px] md:h-[440px] relative border border-luxury-gold/40 overflow-hidden bg-luxury-charcoal`}>
                  <img alt={i < atelierTiles.length ? `${t.plate} — ${t.tag}` : ""} className={`absolute inset-0 w-full h-full object-cover grayscale ${i === 1 ? "opacity-90" : ""}`} src={t.src} />
                  <div className={`absolute inset-0 ${t.grad}`}></div>
                  <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] tracking-[0.3em] uppercase">
                    <span className="text-luxury-gold">{t.plate}</span>
                    <span className="text-gray-300">{t.tag}</span>
                  </div>
                  <figcaption className="absolute bottom-5 left-5 right-5">
                    <span className="font-sub italic text-luxury-gold-light text-sm block mb-1">{t.calibre}</span>
                    <h3 className="font-header text-luxury-white text-xl tracking-widest uppercase">{t.title}</h3>
                    <span className="text-gray-400 text-[10px] tracking-widest uppercase block mt-2">{t.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-luxury-black py-24 md:py-40 relative">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="order-2 md:order-1 reveal-on-scroll">
              <div className="relative p-2 border border-luxury-gold/30">
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-luxury-gold"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-luxury-gold"></div>
                <div className="h-[400px] md:h-[600px] overflow-hidden bg-gray-900">
                  <img src="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=2000&auto=format&fit=crop" alt="Internal Mechanism" className="w-full h-full object-cover opacity-70 grayscale hover:scale-110 transition-transform duration-[2s]" />
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 text-left reveal-on-scroll">
              <span className="text-luxury-gold font-body text-[10px] md:text-xs tracking-[0.4em] uppercase block mb-6">The Heartbeat</span>
              <h2 className="font-header text-3xl md:text-5xl text-luxury-white mb-8 tracking-widest leading-tight">
                Perpetual<br /><span className="text-luxury-gold italic font-sub normal-case">Motion</span>
              </h2>
              <p className="font-body text-gray-400 leading-8 mb-10 font-light tracking-wide text-sm md:text-base">
                Our movements are assembled by hand in Geneva, ensuring an accuracy that defies the standard. Encased in sapphire crystal and brushed titanium, the movement is not just an engine&mdash;it is the soul of the watch.
              </p>
              <ul className="space-y-4 mb-12 border-l border-luxury-gray pl-6">
                {movementSpecs.map((s) => (
                  <li key={s} className="text-gray-300 text-xs tracking-widest uppercase flex items-center gap-4">
                    <span className="w-2 h-[1px] bg-luxury-gold"></span> {s}
                  </li>
                ))}
              </ul>
              <a href="#" className="group inline-flex items-center gap-4 text-luxury-white text-xs tracking-[0.3em] uppercase border border-luxury-white/30 px-8 py-4 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300">
                <span>Discover Engineering</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* Heritage timeline */}
        <section className="bg-luxury-charcoal py-24 md:py-32 border-y border-luxury-gold/20 relative">
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-20 reveal-on-scroll">
              <span className="text-luxury-gold font-body text-[10px] md:text-xs tracking-[0.4em] uppercase block mb-4">— Heritage · V</span>
              <h2 className="font-header text-3xl md:text-5xl tracking-widest uppercase text-luxury-white">A century, in five strikes.</h2>
              <p className="font-sub italic text-gray-400 mt-4 max-w-xl mx-auto">From a single bench in Geneva, 1924, to a vault of 96 calibres a hundred years on.</p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              <div aria-hidden="true" className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-luxury-gold/0 via-luxury-gold/60 to-luxury-gold/0"></div>
              {milestones.map((m, i) => (
                <li key={i} className="relative flex flex-col items-center text-center reveal-on-scroll" style={i ? { transitionDelay: `${i * 100}ms` } : undefined}>
                  <div className={`w-14 h-14 rounded-full border ${m.border} ${m.isCurrent ? "border-2 bg-luxury-gold/10 gold-pulse" : "bg-luxury-black"} flex items-center justify-center text-2xl ${m.numColor} relative z-10`}>
                    {m.isCurrent ? <span className="w-3 h-3 rounded-full bg-luxury-gold-light"></span> : m.numeral}
                  </div>
                  <span className={`font-header ${m.labelColor} tabular-nums text-sm mt-5 tracking-widest`}>{m.year}</span>
                  <h3 className={`font-sub italic ${m.txt} text-xl mt-2`}>{m.title}</h3>
                  <span className={`font-body ${m.muted} text-[11px] tracking-widest mt-2`}>{m.meta}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* References */}
        <section className="bg-luxury-black py-24 md:py-40 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20 reveal-on-scroll">
              <span className="text-luxury-gold font-body text-[10px] md:text-xs tracking-[0.4em] uppercase block mb-4">— References · VI</span>
              <h2 className="font-header text-3xl md:text-5xl tracking-widest uppercase text-luxury-white">Three calibres, in conversation.</h2>
            </div>
            <div className="flex flex-col gap-24 md:gap-32">
              {refRows.map((r, i) => {
                const imgFig = (
                  <figure className={`md:col-span-7 relative${r.side === "right" ? " md:order-2 order-1" : ""}`}>
                    <div className={`absolute -top-3 ${r.side === "right" ? "-right-3" : "-left-3"} w-6 h-6 ${r.side === "right" ? "border-t border-r" : "border-t border-l"} border-luxury-gold`}></div>
                    <div className={`absolute -bottom-3 ${r.side === "right" ? "-left-3" : "-right-3"} w-6 h-6 ${r.side === "right" ? "border-b border-l" : "border-b border-r"} border-luxury-gold`}></div>
                    <div className="img-wrapper border border-luxury-gold/30">
                      <img alt={r.title} className="w-full aspect-[16/10] object-cover grayscale" src={r.img} />
                      <div className={`absolute inset-0 bg-gradient-to-${r.side === "right" ? "tl" : i === 2 ? "br" : "tr"} ${r.grad} pointer-events-none`}></div>
                      <span className={`absolute top-5 ${r.chipPos} text-[10px] tracking-[0.4em] uppercase bg-luxury-black/80 text-luxury-gold border border-luxury-gold/60 px-3 py-1.5`}>{r.chip}</span>
                    </div>
                  </figure>
                );
                const content = (
                  <div className={`md:col-span-5${r.side === "right" ? " md:order-1 order-2" : ""}`}>
                    <span className="font-sub italic text-luxury-gold text-base block mb-2">{r.num}</span>
                    <h3 className="font-header text-3xl md:text-4xl tracking-widest uppercase text-luxury-white mb-6">{r.title}</h3>
                    <p className="font-body text-gray-400 leading-loose mb-8 text-sm md:text-base font-light">{r.body}</p>
                    {r.spec && (
                      <dl className="grid grid-cols-2 gap-5 border-t border-luxury-gray pt-6">
                        {Object.entries(r.spec).map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-[10px] tracking-[0.3em] uppercase text-gray-500">{k}</dt>
                            <dd className={`font-sub italic mt-1 ${k === "Edition" ? "text-luxury-gold-light" : "text-luxury-white"}`}>{v}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {r.bullets && (
                      <ul className="space-y-3 border-l border-luxury-gold pl-5">
                        {r.bullets.map((b) => (
                          <li key={b} className="text-gray-300 text-xs tracking-widest uppercase flex items-center gap-3"><span className="w-2 h-px bg-luxury-gold"></span>{b}</li>
                        ))}
                      </ul>
                    )}
                    {r.stats && (
                      <div className="grid grid-cols-3 gap-3">
                        {r.stats.map((s) => (
                          <div key={s.l} className="border border-luxury-gold/30 p-4 text-center">
                            <div className="font-header text-luxury-gold-light text-2xl">{s.v}</div>
                            <div className="text-[10px] tracking-widest uppercase text-gray-500 mt-1">{s.l}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
                return (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center reveal-on-scroll">
                    {r.side === "right" ? content : imgFig}
                    {r.side === "right" ? imgFig : content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Concierge FAQ */}
        <section className="bg-luxury-charcoal py-24 md:py-32 border-y border-luxury-gold/20 relative">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <aside className="lg:col-span-4 reveal-on-scroll">
                <span className="text-luxury-gold font-body text-[10px] md:text-xs tracking-[0.4em] uppercase block mb-4">— Concierge · VII</span>
                <h2 className="font-header text-3xl md:text-5xl tracking-widest uppercase text-luxury-white leading-tight">Quietly,<br />before the appointment.</h2>
                <p className="font-sub italic text-gray-400 mt-6">Replied to in person within forty-eight hours. The boutique does not list a number; the concierge does.</p>
                <a className="mt-10 inline-flex items-center gap-3 text-luxury-white text-xs tracking-[0.3em] uppercase border border-luxury-gold/40 px-7 py-3.5 hover:border-luxury-gold hover:text-luxury-gold transition-all" href="#">Request the brief →</a>
              </aside>
              <div className="lg:col-span-8 divide-y divide-luxury-gold/20 border-y border-luxury-gold/20">
                {luxFaq.map((f, i) => (
                  <details key={i} className="lux-faq group p-5 md:p-7" open={f.open}>
                    <summary className="flex items-center gap-6">
                      <span className="font-header text-luxury-gold tabular-nums text-lg shrink-0 w-12">{f.i}</span>
                      <h3 className="flex-1 font-header text-luxury-white tracking-widest text-base md:text-lg uppercase">{f.q}</h3>
                      <span className="lux-glyph text-luxury-gold text-3xl shrink-0 leading-none font-thin">+</span>
                    </summary>
                    <p className="font-body text-gray-400 leading-loose mt-4 pl-16 text-sm tracking-wide">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-luxury-white py-24 md:py-32 border-t border-luxury-gold">
          <div className="max-w-2xl mx-auto px-6 text-center reveal-on-scroll">
            <h3 className="font-header text-luxury-black text-2xl md:text-3xl tracking-widest mb-4">The Inner Circle</h3>
            <p className="font-body text-gray-500 text-xs tracking-widest mb-10">Access to limited editions and private viewings.</p>
            <form className="flex flex-col md:flex-row gap-4 border-b border-luxury-black pb-2">
              <input type="email" placeholder="ENTER YOUR EMAIL" className="bg-transparent border-none outline-none text-luxury-black placeholder-gray-400 text-xs tracking-widest w-full text-center md:text-left uppercase p-2" />
              <button type="submit" className="text-luxury-black font-header text-xs tracking-widest uppercase hover:text-luxury-gold transition-colors whitespace-nowrap">Request Access</button>
            </form>
          </div>
        </section>

        <footer className="bg-luxury-black text-white pt-20 pb-10 border-t border-luxury-gray/30">
          <div className="container mx-auto px-6 flex flex-col items-center">
            <div className="mb-12">
              <h2 className="font-header text-4xl tracking-mega font-bold text-luxury-gold">C_E</h2>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-16 w-full">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="font-body text-[10px] tracking-[0.25em] uppercase hover:text-luxury-gold transition-colors">{l}</a>
              ))}
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent max-w-lg mb-10"></div>
            <p className="font-sub italic text-lg text-gray-500 mb-2">"Time waits for no one."</p>
            <div className="flex flex-col md:flex-row justify-between w-full max-w-4xl mt-12 text-gray-600 text-[9px] uppercase tracking-widest">
              <div className="text-center md:text-left mb-4 md:mb-0">&copy; 2026 Chronos_Elite Geneve.</div>
              <div className="flex gap-6 justify-center md:justify-end">
                {legalLinks.map((l) => (
                  <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Run synchronously — preview.ts re-emits inline <script>s only after
          React mounts, by which time the iframe doc's DOMContentLoaded has
          already fired. A `document.addEventListener('DOMContentLoaded',...)`
          wrapper here would silently never run, leaving every
          `.reveal-on-scroll` element pinned at opacity:0 (i.e. invisible
          images). */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function () {
          const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
              }
            });
          }, { root: null, rootMargin: '0px', threshold: 0.15 });
          document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
        })();
      ` }} />
    </>
  );
}
