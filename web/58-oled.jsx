const OLED_CYCLE_IMAGES = [
  { src: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1600&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=400&auto=format&fit=crop", alt: "Eclipse Noir — Onyx", label: "01 Onyx", delay: "0s" },
  { src: "https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=1600&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=400&auto=format&fit=crop", alt: "Eclipse Noir — Sapphire", label: "02 Sapphire", delay: "4s" },
  { src: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1600&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=400&auto=format&fit=crop", alt: "Eclipse Noir — Aurum", label: "03 Aurum", delay: "8s" },
  { src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1600&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=400&auto=format&fit=crop", alt: "Eclipse Noir — Obsidian", label: "04 Obsidian", delay: "12s" },
];

const OLED_POLAROIDS = [
  { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop", caption: "Tokyo · 03.07", pos: "top-4 left-[6%] w-44 md:w-56", rot: "oled-polaroid-rot-1", z: "" },
  { src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600&auto=format&fit=crop", caption: "Geneva · 05.18", pos: "top-12 left-[28%] w-48 md:w-60", rot: "oled-polaroid-rot-2", z: "z-10" },
  { src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop", caption: "Reykjavík · 10.02", pos: "top-2 right-[18%] w-44 md:w-56", rot: "oled-polaroid-rot-3", z: "" },
  { src: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?q=80&w=600&auto=format&fit=crop", caption: "Marrakech · 12.20", pos: "bottom-4 left-[18%] w-44 md:w-52", rot: "oled-polaroid-rot-4", z: "z-10" },
  { src: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=600&auto=format&fit=crop", caption: "Private · ⌀", pos: "bottom-8 right-[6%] w-40 md:w-52", rot: "oled-polaroid-rot-2", z: "" },
];

const OLED_ATELIER_TILES = [
  { src: "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=600&auto=format&fit=crop", aspect: "w-72 aspect-[3/4]", chip: "Calibre · 09", title: "Movement Lift", meta: "412 hrs · M. Vasseur" },
  { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop", aspect: "w-80 aspect-[16/10]", chip: "Atelier · I", title: "Case Polish", meta: "196 hrs · Grade 5 Ti" },
  { src: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?q=80&w=600&auto=format&fit=crop", aspect: "w-72 aspect-[3/4]", chip: "Strap · IV", title: "Hand Stitch", meta: "38 hrs · L. Roche" },
  { src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=800&auto=format&fit=crop", aspect: "w-80 aspect-[16/10]", chip: "Vault · 03", title: "Final Inspection", meta: "22 hrs · 14 checks" },
  { src: "https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=600&auto=format&fit=crop", aspect: "w-72 aspect-[3/4]", chip: "Crystal · II", title: "Sapphire Cut", meta: "82 hrs · Double dome" },
  { src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800&auto=format&fit=crop", aspect: "w-80 aspect-[16/10]", chip: "Dial · V", title: "Lume Application", meta: "14 hrs · Gold flake" },
  { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop", aspect: "w-72 aspect-[3/4]", chip: "Vault · 09", title: "Allocation", meta: "500 / 500 reserved" },
];

const OLED_FAQ = [
  { q: "How are the 500 pieces allocated?", a: "Allocation opens in three waves: Atelier (heritage clients · 200 pieces), Cellar (waitlist · 240 pieces), Reserve (auction · 60 pieces). Each piece ships with a hand-numbered case-back and a paper provenance card." },
  { q: "What is the service interval?", a: "The Caliber .09 movement is rated for 7 years between full services. Worldwide service is performed in Geneva or by appointment in Tokyo, New York, and Singapore. A diagnostic is offered annually at no charge." },
  { q: "Will the dial fade or burn-in over time?", a: "No. The dial uses a sapphire-printed lacquer — not an emissive panel — so there is no luminance decay. The applied gold indices and lumed batons are sealed under a double sapphire dome and do not yellow with UV exposure." },
  { q: "Can the strap be customised?", a: "Three strap options are included with each piece — Onyx alligator, Brushed titanium link, and a Geneva-stitched suede cuff. Bespoke straps can be commissioned via the Atelier desk; allow 12–16 weeks." },
  { q: "Is private viewing available?", a: "Yes — by request only. The 2026 tour stops in Tokyo (March), Geneva (May), Reykjavík (October), and Marrakech (December). Reach out via the reservation form to be considered." },
];

function Oled() {
  return (
    <>
      {/* head */}
      <title>CHRONOS | The Dark Edition</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'pure-black': '#000000',
                        'luxury-gold': '#D4AF37',
                        'faded-gold': '#AA8C2C',
                        'dark-gray': '#111111',
                    },
                    fontFamily: {
                        serif: ['"Playfair Display"', 'serif'],
                        sans: ['"Montserrat"', 'sans-serif'],
                    },
                    letterSpacing: {
                        'ultra': '0.35em',
                    },
                    backgroundImage: {
                        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                    },
                    screens: {
                        'xs': '400px',
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        body {
            background-color: #000000;
            color: #ffffff;
            overflow-x: hidden;
        }
        ::-webkit-scrollbar { width: 6px; background: #000000; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
        .vignette-overlay { background: radial-gradient(circle at center, transparent 40%, #000000 100%); }
        .fade-bottom { background: linear-gradient(to bottom, transparent 0%, #000000 100%); }
        .fade-top { background: linear-gradient(to top, transparent 0%, #000000 100%); }
        .text-glow { text-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }

        /* Diagonal full-bleed image band */
        .oled-diagonal-band { clip-path: polygon(0 8%, 100% 0, 100% 92%, 0 100%); }

        /* In Sight cycling image cross-fade — 4-image, 16s loop */
        @keyframes oled-archive-fade {
            0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.7) hue-rotate(8deg); transform: scale(1.06); }
            8%, 22%  { opacity: 1; filter: blur(0)     saturate(1.05) hue-rotate(0deg); transform: scale(1); }
            26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.7) hue-rotate(-8deg); transform: scale(1.06); }
        }
        .oled-cycle-img {
            animation: oled-archive-fade 16s linear infinite;
            opacity: 0;
            filter: blur(18px) saturate(0.7);
            transform: scale(1.06);
            will-change: opacity, filter, transform;
        }
        @keyframes oled-archive-indicator {
            0%, 4%   { opacity: 0.2; }
            8%, 22%  { opacity: 1; }
            26%, 100%{ opacity: 0.2; }
        }
        .oled-cycle-indicator { animation: oled-archive-indicator 16s linear infinite; opacity: 0.2; }
        @keyframes oled-archive-scrub {
            0%   { transform: scaleX(0); }
            100% { transform: scaleX(1); }
        }
        .oled-cycle-scrub { animation: oled-archive-scrub 16s linear infinite; transform-origin: left; }

        /* Polaroid stack */
        .oled-polaroid {
            box-shadow: 0 0 0 1px rgba(212,175,55,0.35), 0 0 24px rgba(212,175,55,0.18), 0 30px 50px -20px rgba(0,0,0,0.9);
        }
        .oled-polaroid-rot-1 { transform: rotate(-6deg); }
        .oled-polaroid-rot-2 { transform: rotate(4deg); }
        .oled-polaroid-rot-3 { transform: rotate(-2deg); }
        .oled-polaroid-rot-4 { transform: rotate(7deg); }

        /* Marquee — Atelier strip */
        .oled-marquee-track {
            display: flex;
            gap: 24px;
            width: max-content;
            animation: oled-marquee 60s linear infinite;
        }
        .oled-marquee-track:hover { animation-play-state: paused; }
        @keyframes oled-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); }
        }

        /* FAQ details accordion */
        .oled-faq summary::-webkit-details-marker { display: none; }
        .oled-faq summary { list-style: none; cursor: pointer; }
        .oled-faq .oled-chevron { transition: transform 250ms ease; }
        .oled-faq[open] .oled-chevron { transform: rotate(180deg); }

        @media (prefers-reduced-motion: reduce) {
            .oled-cycle-img { animation: none; opacity: 1; filter: none; transform: none; }
            .oled-cycle-img ~ .oled-cycle-img { opacity: 0; }
            .oled-cycle-indicator { animation: none; opacity: 1; }
            .oled-cycle-scrub { animation: none; transform: scaleX(1); }
            .oled-marquee-track { animation: none; }
            .oled-faq .oled-chevron { transition: none; }
        }
` }} />

      {/* body wrapper */}
      <div className="antialiased selection:bg-luxury-gold selection:text-pure-black bg-pure-black text-white">

        {/* Navbar */}
        <nav className="fixed w-full z-50 top-0 transition-all duration-500 bg-pure-black/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
            <a href="#" className="font-serif text-xl md:text-2xl text-luxury-gold tracking-widest font-semibold z-50">
              CHRONOS
            </a>

            <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-ultra text-neutral-400">
              <a href="#collection" className="hover:text-white transition-colors duration-300">Collection</a>
              <a href="#in-sight" className="hover:text-white transition-colors duration-300">Editions</a>
              <a href="#craftsmanship" className="hover:text-white transition-colors duration-300">Craft</a>
              <a href="#specs" className="hover:text-white transition-colors duration-300">Specs</a>
              <a href="#faq" className="hover:text-white transition-colors duration-300">FAQ</a>
            </div>

            <div className="flex items-center gap-6">
              <a href="#preorder" className="hidden md:block px-6 py-2 border border-luxury-gold/30 text-luxury-gold text-[10px] uppercase tracking-widest hover:bg-luxury-gold hover:text-pure-black transition-all duration-300">
                Reserve
              </a>
              <div className="cursor-pointer md:hidden group">
                <i data-lucide="menu" className="w-6 h-6 text-white group-hover:text-luxury-gold transition-colors"></i>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2560&auto=format&fit=crop"
              alt="Luxury Watch Background"
              className="w-full h-full object-cover opacity-50 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pure-black via-transparent to-pure-black"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-pure-black/80"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
            <p className="text-luxury-gold text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 md:mb-8 animate-fade-in-up" data-aos="fade-up">
              Swiss Engineering
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-white mb-6 md:mb-10 leading-[1.1]" data-aos="fade-up" data-aos-delay="200">
              Eclipse <span className="italic text-neutral-500 font-light">Noir</span>
            </h1>
            <p className="font-sans text-neutral-400 text-xs md:text-sm font-light tracking-widest max-w-md mx-auto leading-loose" data-aos="fade-up" data-aos-delay="400">
              Absolute darkness. Unrivaled precision. A masterpiece forged from shadows and sapphire.
            </p>
          </div>

          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 opacity-60">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-luxury-gold to-transparent"></div>
            <span className="text-[9px] uppercase tracking-ultra text-white">Scroll</span>
          </div>
        </header>

        {/* Spectrum / Calibration — Diagonal full-bleed image band (NOVEL #1) */}
        <section id="spectrum" className="relative bg-pure-black overflow-hidden py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-12 bg-luxury-gold"></div>
                  <span className="text-luxury-gold text-[10px] uppercase tracking-ultra">— 01 / Spectrum</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight max-w-2xl" data-aos="fade-up">
                  Calibrated to the <span className="italic text-luxury-gold">deepest</span> black.
                </h2>
              </div>
              <p className="font-sans text-neutral-400 text-sm leading-8 tracking-wide max-w-md" data-aos="fade-up" data-aos-delay="100">
                Every dial is matched to an OLED reference panel — true 0 cd/m² blacks against 700-nit emissive gold. No backlight, no compromise.
              </p>
            </div>
          </div>

          <div className="relative w-full h-[280px] md:h-[420px] oled-diagonal-band overflow-hidden" data-aos="fade-up" data-aos-delay="200">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"
              alt="Spectrum calibration display"
              className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale contrast-125"
            />
            <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(8,12,20,0.4) 50%, rgba(0,0,0,0.7) 100%)" }}></div>
            <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.18) 0%, transparent 70%)" }}></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)" }}></div>

            <div className="absolute inset-0 flex items-center px-6 md:px-16">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 w-full">
                <div className="border-l border-luxury-gold/40 pl-3 md:pl-5">
                  <p className="text-luxury-gold text-[9px] uppercase tracking-ultra mb-2">Black Level</p>
                  <p className="font-serif text-2xl md:text-4xl text-white">0.00</p>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">cd/m²</p>
                </div>
                <div className="border-l border-luxury-gold/40 pl-3 md:pl-5">
                  <p className="text-luxury-gold text-[9px] uppercase tracking-ultra mb-2">Peak Lume</p>
                  <p className="font-serif text-2xl md:text-4xl text-white">700</p>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">nits</p>
                </div>
                <div className="border-l border-luxury-gold/40 pl-3 md:pl-5">
                  <p className="text-luxury-gold text-[9px] uppercase tracking-ultra mb-2">Δ E ≤</p>
                  <p className="font-serif text-2xl md:text-4xl text-white">1.4</p>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">deviation</p>
                </div>
                <div className="hidden md:block border-l border-luxury-gold/40 pl-5">
                  <p className="text-luxury-gold text-[9px] uppercase tracking-ultra mb-2">Spectrum</p>
                  <p className="font-serif text-4xl text-white">DCI-P3</p>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">100% coverage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage / Philosophy */}
        <section id="craftsmanship" className="py-24 md:py-40 bg-pure-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

              <div className="w-full lg:w-1/2 relative" data-aos="fade-right" data-aos-duration="1200">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=1200&auto=format&fit=crop"
                    alt="Watchmaker"
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pure-black via-transparent to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 border-r border-b border-luxury-gold/30 hidden md:block"></div>
              </div>

              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                  <div className="h-[1px] w-12 bg-luxury-gold"></div>
                  <span className="text-luxury-gold text-[10px] uppercase tracking-ultra">The Artisan</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl text-white mb-8 leading-tight" data-aos="fade-up">
                  Silence is the <br /> ultimate luxury.
                </h2>
                <p className="font-sans text-neutral-400 text-sm leading-8 tracking-wide mb-8" data-aos="fade-up" data-aos-delay="100">
                  In a world of noise, Chronos speaks in whispers. Our artisans spend over 400 hours hand-polishing the Grade 5 titanium case to achieve a finish that absorbs light rather than reflecting it.
                </p>
                <p className="font-sans text-neutral-400 text-sm leading-8 tracking-wide mb-12" data-aos="fade-up" data-aos-delay="200">
                  The internal movement is suspended in a vacuum-sealed chamber, ensuring that the ticking of time is felt, never heard.
                </p>

                <a href="#" className="inline-flex items-center gap-3 text-white text-xs uppercase tracking-widest group" data-aos="fade-up" data-aos-delay="300">
                  Explore Heritage
                  <i data-lucide="arrow-right" className="w-4 h-4 text-luxury-gold group-hover:translate-x-2 transition-transform"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* In Sight — Cycling cross-fade with sticky rail (NOVEL #8 sticky-photo, M.2 + M.15) */}
        <section id="in-sight" className="py-24 md:py-32 bg-pure-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">

              {/* Sticky text rail */}
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-12 bg-luxury-gold"></div>
                  <span className="text-luxury-gold text-[10px] uppercase tracking-ultra">— 02 / In Sight</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl text-white mb-8 leading-tight" data-aos="fade-up">
                  Four faces. <br /><span className="italic text-neutral-500">One silhouette.</span>
                </h2>
                <p className="font-sans text-neutral-400 text-sm leading-8 tracking-wide mb-8" data-aos="fade-up" data-aos-delay="100">
                  Eclipse Noir is offered in four dial finishes — each photographed under emissive lighting at the Geneva atelier. Every 4 seconds, a new face emerges from the dark.
                </p>

                <div className="flex items-center gap-4 max-w-sm mb-10" data-aos="fade-up" data-aos-delay="150">
                  <div className="flex-1 h-px bg-white/15 relative overflow-hidden">
                    <div className="absolute inset-0 origin-left bg-luxury-gold oled-cycle-scrub"></div>
                  </div>
                  <span className="text-neutral-500 text-[9px] uppercase tracking-widest whitespace-nowrap">04 dials · 16s loop</span>
                </div>

                <a href="#" className="inline-flex items-center gap-3 text-white text-xs uppercase tracking-widest group" data-aos="fade-up" data-aos-delay="200">
                  Explore Editions
                  <i data-lucide="arrow-right" className="w-4 h-4 text-luxury-gold group-hover:translate-x-2 transition-transform"></i>
                </a>
              </div>

              {/* Cycling image frame + thumbnail strip */}
              <div className="md:col-span-7">
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden border border-white/10 bg-pure-black" data-aos="fade-left" data-aos-duration="1200">
                  {OLED_CYCLE_IMAGES.map((img) => (
                    <img
                      key={img.label}
                      className="oled-cycle-img absolute inset-0 w-full h-full object-cover"
                      style={{ animationDelay: img.delay }}
                      src={img.src}
                      alt={img.alt}
                    />
                  ))}

                  <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, #000 95%)" }}></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)", filter: "blur(40px)" }}></div>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-6">
                  {OLED_CYCLE_IMAGES.map((img) => (
                    <div
                      key={`thumb-${img.label}`}
                      className="oled-cycle-indicator relative aspect-[3/4] overflow-hidden border border-luxury-gold/40"
                      style={{ animationDelay: img.delay }}
                    >
                      <img src={img.thumb} alt="" className="w-full h-full object-cover opacity-80" />
                      <span className="absolute bottom-1 left-2 text-luxury-gold text-[8px] uppercase tracking-widest">{img.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OLED showcase */}
        <section id="collection" className="bg-pure-black py-20 relative">
          <div className="absolute top-10 left-0 w-full text-center pointer-events-none z-10">
            <span className="text-[12rem] md:text-[20rem] font-serif text-white opacity-[0.02] leading-none select-none">
              OLED
            </span>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="group relative aspect-[3/4] overflow-hidden border border-white/5 bg-neutral-900/10" data-aos="fade-up" data-aos-delay="0">
                <img
                  src="https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=800&auto=format&fit=crop"
                  alt="Sapphire Crystal Macro"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-8 left-8">
                  <p className="text-luxury-gold text-[10px] tracking-ultra mb-2">01</p>
                  <h3 className="font-serif text-2xl text-white">Sapphire Dome</h3>
                </div>
              </div>

              <div className="group relative aspect-[3/4] overflow-hidden border border-white/5 bg-neutral-900/10 md:-mt-16" data-aos="fade-up" data-aos-delay="200">
                <img
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"
                  alt="Gold Watch Hands"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-8 left-8">
                  <p className="text-luxury-gold text-[10px] tracking-ultra mb-2">02</p>
                  <h3 className="font-serif text-2xl text-white">Gold Hands</h3>
                </div>
              </div>

              <div className="group relative aspect-[3/4] overflow-hidden border border-white/5 bg-neutral-900/10" data-aos="fade-up" data-aos-delay="400">
                <img
                  src="https://images.unsplash.com/photo-1623998021450-85c29c644e0d?q=80&w=800&auto=format&fit=crop"
                  alt="Leather Strap Detail"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-8 left-8">
                  <p className="text-luxury-gold text-[10px] tracking-ultra mb-2">03</p>
                  <h3 className="font-serif text-2xl text-white">Leather Strap</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Witnessed — Polaroid stack (NOVEL #3) with neon-glowing borders */}
        <section id="witnessed" className="py-24 md:py-32 bg-pure-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-12 bg-luxury-gold"></div>
                  <span className="text-luxury-gold text-[10px] uppercase tracking-ultra">— 04 / Witnessed</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl text-white mb-8 leading-tight" data-aos="fade-up">
                  Field <span className="italic text-neutral-500">notes</span> from the dark.
                </h2>
                <p className="font-sans text-neutral-400 text-sm leading-8 tracking-wide mb-6" data-aos="fade-up" data-aos-delay="100">
                  Snapshots from private viewings — Tokyo (March), Geneva (May), Reykjavik (October), Marrakech (December). Each piece travels with its caretaker; each frame is a single instant of allocation.
                </p>
                <div className="flex gap-6 text-[10px] uppercase tracking-widest text-neutral-500" data-aos="fade-up" data-aos-delay="150">
                  <span><span className="text-luxury-gold">04</span> &nbsp;Cities</span>
                  <span><span className="text-luxury-gold">12</span> &nbsp;Frames</span>
                  <span><span className="text-luxury-gold">2026</span> &nbsp;Tour</span>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 relative h-[440px] md:h-[520px]" data-aos="fade-left" data-aos-duration="1200">
                {OLED_POLAROIDS.map((p, i) => (
                  <figure key={i} className={`absolute ${p.pos} ${p.rot} ${p.z} oled-polaroid bg-neutral-900 p-3 pb-10`}>
                    <img src={p.src} alt="" className="w-full aspect-[4/5] object-cover grayscale" />
                    <figcaption className="absolute bottom-2 left-3 right-3 text-luxury-gold text-[9px] uppercase tracking-ultra">{p.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* In the Dark / Atelier — Marquee data tile strip (M.8) */}
        <section id="atelier" className="py-24 md:py-28 bg-pure-black border-y border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-luxury-gold"></div>
              <span className="text-luxury-gold text-[10px] uppercase tracking-ultra">— 05 / In the Dark</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-white max-w-3xl leading-tight" data-aos="fade-up">
              Hours logged at <span className="italic text-luxury-gold">the bench</span>.
            </h2>
          </div>

          <div className="overflow-hidden py-3" data-aos="fade-up" data-aos-delay="100">
            <div className="oled-marquee-track">
              {OLED_ATELIER_TILES.map((t, i) => (
                <figure key={`atelier-${i}`} className={`relative ${t.aspect} flex-shrink-0 overflow-hidden border border-luxury-gold/30 bg-neutral-900`}>
                  <img src={t.src} alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-pure-black/40 to-transparent"></div>
                  <figcaption className="absolute bottom-4 left-4 right-4">
                    <span className="text-luxury-gold text-[9px] uppercase tracking-ultra">{t.chip}</span>
                    <p className="font-serif text-lg text-white mt-1">{t.title}</p>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">{t.meta}</p>
                  </figcaption>
                </figure>
              ))}
              {OLED_ATELIER_TILES.map((t, i) => (
                <figure aria-hidden="true" key={`atelier-dup-${i}`} className={`relative ${t.aspect} flex-shrink-0 overflow-hidden border border-luxury-gold/30 bg-neutral-900`}>
                  <img src={t.src} alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-pure-black/40 to-transparent"></div>
                  <figcaption className="absolute bottom-4 left-4 right-4">
                    <span className="text-luxury-gold text-[9px] uppercase tracking-ultra">{t.chip}</span>
                    <p className="font-serif text-lg text-white mt-1">{t.title}</p>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">{t.meta}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Specs */}
        <section id="specs" className="py-32 bg-pure-black">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="text-center mb-20" data-aos="fade-up">
              <i data-lucide="settings" className="w-6 h-6 text-luxury-gold mx-auto mb-6 opacity-70"></i>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Technical Data</h2>
              <div className="w-16 h-[1px] bg-luxury-gold mx-auto opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-0 text-sm" data-aos="fade-up" data-aos-delay="200">
              <div>
                <div className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-luxury-gold/50 transition-colors">
                  <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Reference</span>
                  <span className="text-white font-serif tracking-wide">CH-9000-BLK</span>
                </div>
                <div className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-luxury-gold/50 transition-colors">
                  <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Diameter</span>
                  <span className="text-white font-serif tracking-wide">42 mm</span>
                </div>
                <div className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-luxury-gold/50 transition-colors">
                  <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Height</span>
                  <span className="text-white font-serif tracking-wide">9.8 mm</span>
                </div>
                <div className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-luxury-gold/50 transition-colors">
                  <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Material</span>
                  <span className="text-white font-serif tracking-wide">Ceramic / Titanium</span>
                </div>
              </div>

              <div className="md:border-t-0 border-t border-white/10 md:mt-0 mt-6">
                <div className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-luxury-gold/50 transition-colors">
                  <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Movement</span>
                  <span className="text-white font-serif tracking-wide">Auto Caliber .09</span>
                </div>
                <div className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-luxury-gold/50 transition-colors">
                  <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Water Resistance</span>
                  <span className="text-white font-serif tracking-wide">10 ATM</span>
                </div>
                <div className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-luxury-gold/50 transition-colors">
                  <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Crystal</span>
                  <span className="text-white font-serif tracking-wide">Double Sapphire</span>
                </div>
                <div className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-luxury-gold/50 transition-colors">
                  <span className="text-neutral-500 uppercase tracking-widest text-[10px]">Power Reserve</span>
                  <span className="text-white font-serif tracking-wide">72 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lifestyle parallax */}
        <div className="w-full bg-pure-black pb-20">
          <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1533158307587-828f0a76ef93?q=80&w=2000&auto=format&fit=crop"
              className="absolute inset-0 w-full h-full object-cover opacity-40 fixed-bg"
              style={{ backgroundAttachment: "fixed" }}
              alt="Lifestyle"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-transparent to-pure-black"></div>

            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div>
                <i data-lucide="crown" className="w-8 h-8 text-white mx-auto mb-6 opacity-80"></i>
                <h3 className="font-serif text-2xl md:text-5xl text-white tracking-widest uppercase">
                  Master The Moment
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ — <details> accordion (M.7) */}
        <section id="faq" className="py-24 md:py-32 bg-pure-black relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16" data-aos="fade-up">
              <i data-lucide="help-circle" className="w-6 h-6 text-luxury-gold mx-auto mb-6 opacity-70"></i>
              <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">Allocations & Care</h2>
              <div className="w-16 h-[1px] bg-luxury-gold mx-auto opacity-50"></div>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10" data-aos="fade-up" data-aos-delay="100">
              {OLED_FAQ.map((row, i) => (
                <details key={i} className="oled-faq group p-6 md:p-7">
                  <summary className="flex justify-between items-center gap-6">
                    <h3 className="font-serif text-lg md:text-xl text-white">{row.q}</h3>
                    <i data-lucide="chevron-down" className="oled-chevron w-5 h-5 text-luxury-gold flex-shrink-0"></i>
                  </summary>
                  <p className="font-sans text-neutral-400 text-sm leading-8 tracking-wide mt-4 max-w-2xl">{row.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Pre-order */}
        <section id="preorder" className="py-32 bg-pure-black border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

          <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
            <span className="inline-block py-1 px-3 border border-luxury-gold/30 text-luxury-gold text-[9px] uppercase tracking-ultra mb-8 rounded-full">
              Limited Release
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
              Acquire The <br /> <span className="text-luxury-gold">Darkness</span>
            </h2>
            <p className="text-neutral-400 text-sm mb-12 font-light tracking-wide max-w-lg mx-auto">
              Only 500 individual pieces will be created. Join the waitlist to secure your allocation.
            </p>

            <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border border-neutral-700 text-white px-6 py-4 text-xs tracking-widest focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-neutral-600"
              />
              <button type="submit" className="bg-luxury-gold hover:bg-white text-pure-black px-8 py-4 text-xs uppercase tracking-widest font-semibold transition-colors duration-300">
                Join
              </button>
            </form>

            <p className="mt-8 text-neutral-600 text-[10px] uppercase tracking-widest">
              Shipping Worldwide Q4 2026
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-pure-black pt-20 pb-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">

              <div className="text-center md:text-left">
                <a href="#" className="font-serif text-2xl text-luxury-gold tracking-widest block mb-4">CHRONOS</a>
                <p className="text-neutral-600 text-[10px] uppercase tracking-widest max-w-xs">
                  Geneva, Switzerland <br />
                  Est. 1924
                </p>
              </div>

              <div className="flex gap-12 text-[10px] uppercase tracking-widest text-neutral-500">
                <div className="flex flex-col gap-4">
                  <a href="#" className="hover:text-luxury-gold transition-colors">Timepieces</a>
                  <a href="#" className="hover:text-luxury-gold transition-colors">Atelier</a>
                  <a href="#" className="hover:text-luxury-gold transition-colors">Boutiques</a>
                </div>
                <div className="flex flex-col gap-4">
                  <a href="#" className="hover:text-luxury-gold transition-colors">Press</a>
                  <a href="#" className="hover:text-luxury-gold transition-colors">Contact</a>
                  <a href="#" className="hover:text-luxury-gold transition-colors">Legal</a>
                </div>
              </div>

              <div className="flex gap-6">
                <a href="#" className="text-neutral-600 hover:text-white transition-colors"><i data-lucide="instagram" className="w-5 h-5"></i></a>
                <a href="#" className="text-neutral-600 hover:text-white transition-colors"><i data-lucide="twitter" className="w-5 h-5"></i></a>
              </div>
            </div>

            <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest text-neutral-700">
              <span>© 2024 Chronos Watch Co.</span>
              <span>Privacy Policy / Terms of Service</span>
            </div>
          </div>
        </footer>

        {/* Init AOS + Lucide after React mount via the preview's script-hoister */}
        <script dangerouslySetInnerHTML={{ __html: `
          if (typeof AOS !== 'undefined') {
            AOS.init({ once: true, offset: 100, duration: 1000, easing: 'ease-out-cubic' });
          }
          if (typeof lucide !== 'undefined') lucide.createIcons();
        ` }} />
      </div>
    </>
  );
}

export default Oled;
