const APV2_GALLERY_FRAMES = [
  { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=85&auto=format&fit=crop", alt: "Editorial portrait, dramatic side-light, Aperture v2 sample frame", delay: "0s" },
  { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85&auto=format&fit=crop", alt: "Brutalist concrete facade in raking light, Aperture v2 sample frame", delay: "4s" },
  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1920&q=85&auto=format&fit=crop", alt: "Black and white editorial figure with deep shadow, Aperture v2 sample frame", delay: "8s" },
  { src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1920&q=85&auto=format&fit=crop", alt: "Architectural cornicing detail, Aperture v2 sample frame", delay: "12s" },
];

const APV2_MARQUEE_TAGS = [
  "REYKJAVIK · 64°N",
  "KYOTO · F/1.7 · 1/240",
  "MARFA · GOLDEN HOUR",
  "PORTO · ISO 800",
  "DAKAR · OPEN GATE",
  "OSLO · LOG3 · 4K60",
];

const APV2_SPECS = [
  ["Sensor", "1.0″ stacked CMOS"],
  ["Lens", "28–135 mm equiv."],
  ["Aperture", "f/1.4 — f/4.0"],
  ["Stabilisation", "7-axis OIS · 8.5 EV"],
  ["Native ISO", "100 / 1600 dual"],
  ["Video", "8K 30 · 4K 120 ProRes"],
  ["Audio", "4-mic spatial · 96 kHz"],
  ["Battery", "4 850 mAh · 22 hr video"],
  ["Connectivity", "USB-C 4 · Wi-Fi 7"],
  ["Storage", "256 GB — 4 TB"],
  ["Dimensions", "158 × 76 × 9.4 mm"],
  ["Weight", "214 g (titanium)"],
];

const APV2_PROCESS = [
  { numeral: "I", stage: "Stage · Capture", title: "Photons in, faithfully.", body: "A new microlens array couples to deep-well photosites, gathering 1.6× more light per pixel without amplifying noise. The shutter, mechanical and electronic, agrees to 1/64 000 s." },
  { numeral: "II", stage: "Stage · Process", title: "Eight cores. One frame.", body: "The Helios image processor runs eight neural cores in parallel — denoise, demosaic, tone-map, deconvolve, motion-resolve. The frame leaves the silicon already graded." },
  { numeral: "III", stage: "Stage · Output", title: "RAW, ProRes, ready.", body: "Files land as 14-bit RAW DNG, ProRes 4444 XQ, or HEVC 10-bit — your colourist's choice. Metadata travels with the frame: lens, ISO, body temperature, GPS, lat-lng-alt." },
];

const APV2_COMPARE = [
  { label: "Dynamic range", v1: "v1 · 10 EV", v2: "14 EV" },
  { label: "Low-light ISO", v1: "v1 · 51 200", v2: "204 800" },
  { label: "Video bitrate", v1: "v1 · 240 Mb/s", v2: "1.6 Gb/s" },
  { label: "Battery (video)", v1: "v1 · 9 hr", v2: "22 hr" },
];

const APV2_PRICING = [
  {
    eyebrow: "Standard",
    title: "Aperture v2",
    sub: "256 GB · Aluminium",
    price: "$1 199",
    items: ["Aperture v2 body, 256 GB", "USB-C 4 cable, 1.5 m", "Standard wrist strap"],
    featured: false,
  },
  {
    eyebrow: "Pro",
    title: "Aperture v2 Pro",
    sub: "1 TB · Titanium",
    price: "$1 799",
    items: ["Aperture v2 Pro body, 1 TB", "ProRes 4444 XQ unlock", "Leather field strap, brass clasp", "2 yr Atelier service plan"],
    featured: true,
  },
  {
    eyebrow: "Pro Max",
    title: "v2 Pro Max",
    sub: "4 TB · Titanium · Sapphire",
    price: "$2 499",
    items: ["v2 Pro Max body, 4 TB", "Sapphire crystal lens cover", "Atelier-engraved serial plate", "4 yr Atelier service plan"],
    featured: false,
  },
];

const APV2_REVIEWS = [
  { name: "Mae Tanaka", outlet: "Wired · Editor at Large", stars: 5, quote: "The image-processing pipeline is so quiet you forget the camera is doing anything at all. The frames feel discovered, not made." },
  { name: "Idris Beaumont", outlet: "The Verge · Hardware Lead", stars: 4, quote: "Aperture has done what Hasselblad couldn't and Leica refused to: shipped a 1-inch sensor in a body you'd actually carry on a Sunday." },
  { name: "Hana Olafsdottir", outlet: "LensCulture · Field Editor", stars: 5, quote: "Held it for three minutes and knew. The shutter is mechanical, the dial detents are right, the menus are out of the way. They got it." },
];

const APV2_BOOKEND_TOP = [
  { src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop", alt: "Brutalist concrete interior, Aperture v2 in the wild" },
  { src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&q=85&auto=format&fit=crop", alt: "Highway in raking light, Aperture v2 sample environment" },
  { src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=900&q=85&auto=format&fit=crop", alt: "Architectural shadow play on facade, Aperture v2 sample environment" },
  { src: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=85&auto=format&fit=crop", alt: "Editorial portrait in monochrome, Aperture v2 sample frame" },
];

const APV2_BOOKEND_BOTTOM = [
  { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", alt: "Architectural lobby, Aperture v2 sample environment" },
  { src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=900&q=85&auto=format&fit=crop", alt: "Editorial portrait with drape lighting, Aperture v2 sample frame" },
  { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=85&auto=format&fit=crop", alt: "Brutalist staircase under hard sun, Aperture v2 sample environment" },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85&auto=format&fit=crop", alt: "Editorial figure with strong contrast, Aperture v2 sample frame" },
];

const APV2_FAQ = [
  { q: "When does it ship?", a: "First wave ships November 14, 2024. Standard configurations from stock; Pro Max is built-to-order with a 6–8 week atelier window. Reservations placed today are guaranteed wave-one allocation." },
  { q: "Is trade-in available?", a: "Aperture v1 trade-in earns up to $400 toward any v2 configuration. Send a serial in the order flow and we mail a pre-paid case; credit posts the day v1 arrives at our Lisbon depot." },
  { q: "What's in the box?", a: "Body, USB-C 4 cable, woven wrist strap, microfiber, Quick Reference card, atelier registration card. Pro and Pro Max add a leather field strap and lens cap; Pro Max adds the engraved serial plate." },
  { q: "Compatible with v1 lenses and accessories?", a: "All v1 conversion-lens adapters carry over. Magsafe-style accessories from v1 mount but with a 4 mm spacer due to the larger sensor stack — included free with any trade-in." },
  { q: "How does it compare to a dedicated camera?", a: "In a controlled studio, a dedicated full-frame still wins on shallow-DoF and lens choice. In the field, on the bench, at golden hour, in the rain — the body you brought beats the body you left at home. Aperture v2 is the body you bring." },
  { q: "Is the case sold separately?", a: "Yes — the Atelier Field Case (waxed canvas with brass clasps) ships separately at $129. Included free with Pro Max. Handcrafted in Porto, lifetime stitching warranty." },
];

export default function T06ProductLaunchPage() {
  const features = [
    { id: "feature-dynamic-range", title: "Dynamic Range", num: "01", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbjJHxiR_ed6i7oSlHsgYS2pfgVFkeHMb4A9aDD7-9PE03BZZM_NI7XGwecgoj04LA_h7-aBoD3wPUI8RMdKvMxGTdGd_w-Te92pmI_r_lLY6FFQrjHzAc9GtkpewSrfC3QgVtMCor6rhdkZUvT3ZHykKDvufMsYeT-CihfmPRYrryy4r0W_L_OqssDP3CDrdYyXjIHedVTjMhqVxZCxz9IcBlxAQI4-_G2RmsAv_CRgveJchdhd8I2dix5TY-2txUBh7tbNstgec", alt: "High contrast black and white portrait" },
    { id: "feature-procolor", title: "ProColor 10-bit", num: "02", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA28uixWL1o9w3hAGnWjaeFM8MbcThT2vF4BwegYVH8Lf3NlDGWATQaNAfTxOHJOJ5KqvTkHKKxnlUrPUk532QjpJylmS04iWX2LZ-sRLUJj_zjzADOpw_EBaLpBE0AXIr8cTjSJMbDaCHPHEp89kQIm400RHfbcQ4UvfgcnJSMqhjTGnu9g45A2t2d9AqLv7XXFw8GooItfs3lb5sv_7ePFHWbayCepilZsHRdyYJA6G65PnmJ2nhkKJHrfXRzjjrC-3U_H5fzpsQ", alt: "Vibrant neon lights reflecting on wet city streets" },
    { id: "feature-neural-focus", title: "Neural Focus", num: "03", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAquSmx3Gc3ml7BN67tyxt8f_2vBBZ602igbi6bX_bwTJUJUDBe69im4X_he534ut7htvrxKTprBtjwkEax_yuaQfqC2hihjrX8xrxgq7VYZ2k0Gr8G3P0-mH-YYBA2YPAAvnYQ8Ffv3Yk2K__Xnoey1QrdfQiWWvgIxcIUMI3tE640R-ER3yzb47e4JbbzzlC4SAPyJoaFY2Bv5jxfSsKil4wdAzI6GLCNbO22dcWCEC8-fzMfv8v8LjMQjeGc4hoecRNqLg7hsuE", alt: "Extreme close up of an eye" },
    { id: "feature-open-gate", title: "Open Gate", num: "04", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAT-mVAoyjHhXi6SuXfPr7JHOnKPvOBX1T3-n3JpNeQJoMFLZ0bxcf8pPRJFJP88UaEK5ieOrZrGmEOlTO24hVb1Fn_D1kESPgT5eSxQ3EhNsban1T99lC9uNeF6xaIgkHUe8aISvKp-4Cuyt5XH-J2zr9NFuPAdl9vCPiO9EZotR1RYDPJ0nfflYihEBbJW0KgR67HuxJMnrI0gbnVWIbkDTyctE58dd96s9P5ANUkwflQIruVk-aQQ6YD0jK-K6ye84xTJG7yw0", alt: "Wide cinematic shot of a lone figure" },
  ];
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Serif:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0..1,0&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "on-surface-variant": "#d7c3ae",
                "surface-container": "#201f1f",
                "tertiary-container": "#b8b6b5",
                "surface-tint": "#ffb955",
                "primary-fixed-dim": "#ffb955",
                "on-primary-container": "#644000",
                "tertiary-fixed": "#e5e2e1",
                "on-error": "#690005",
                "tertiary": "#d4d1d1",
                "outline": "#9f8e7a",
                "on-tertiary-fixed": "#1c1b1b",
                "on-surface": "#e5e2e1",
                "on-primary-fixed-variant": "#633f00",
                "on-primary-fixed": "#291800",
                "surface-container-highest": "#353534",
                "inverse-on-surface": "#313030",
                "secondary": "#c9c6bf",
                "on-secondary": "#31312b",
                "primary": "#ffc880",
                "surface-variant": "#353534",
                "on-tertiary-container": "#484747",
                "on-tertiary-fixed-variant": "#474746",
                "secondary-fixed-dim": "#c9c6bf",
                "secondary-container": "#474741",
                "outline-variant": "#524534",
                "on-secondary-fixed-variant": "#474741",
                "inverse-surface": "#e5e2e1",
                "inverse-primary": "#835500",
                "primary-container": "#f5a623",
                "on-secondary-fixed": "#1c1c17",
                "error-container": "#93000a",
                "primary-fixed": "#ffddb4",
                "on-background": "#e5e2e1",
                "error": "#ffb4ab",
                "surface-container-low": "#1c1b1b",
                "on-secondary-container": "#b7b5ae",
                "surface-dim": "#131313",
                "surface-bright": "#3a3939",
                "on-primary": "#452b00",
                "on-tertiary": "#313030",
                "background": "#131313",
                "surface-container-lowest": "#0e0e0e",
                "tertiary-fixed-dim": "#c8c6c5",
                "surface": "#131313",
                "on-error-container": "#ffdad6",
                "secondary-fixed": "#e5e2db",
                "surface-container-high": "#2a2a2a"
              },
              borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
              spacing: { unit: "8px", "safe-area": "16px", margin: "32px", gutter: "24px" },
              fontFamily: {
                "body-md": ["Inter"], "label-caps": ["Inter"], "display-lg": ["Noto Serif"],
                "body-lg": ["Inter"], "mono-data": ["Inter"], "headline-sm": ["Noto Serif"], "headline-md": ["Noto Serif"]
              },
              fontSize: {
                "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
                "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "mono-data": ["13px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }],
                "headline-sm": ["24px", { lineHeight: "1.3", fontWeight: "400" }],
                "headline-md": ["32px", { lineHeight: "1.2", fontWeight: "400" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        @keyframes ap-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .ap-marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: ap-marquee 60s linear infinite;
        }
        .ap-marquee-track:hover { animation-play-state: paused; }
        @keyframes ap-archive-fade {
          0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
          8%, 22%  { opacity: 1; filter: blur(0)     saturate(1);   transform: scale(1); }
          26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
        }
        .ap-archive-img {
          animation: ap-archive-fade 16s linear infinite;
          opacity: 0;
          filter: blur(18px) saturate(0.8);
          transform: scale(1.04);
          will-change: opacity, filter, transform;
        }
        .ap-faq summary::-webkit-details-marker { display: none; }
        .ap-faq summary { list-style: none; cursor: pointer; }
        .ap-faq summary .ap-chev { transition: transform 250ms ease; }
        .ap-faq[open] summary .ap-chev { transform: rotate(45deg); }
        @media (prefers-reduced-motion: reduce) {
          .ap-marquee-track { animation: none; }
          .ap-archive-img { animation: none; opacity: 1; filter: none; transform: none; }
          .ap-faq summary .ap-chev { transition: none; }
        }
      ` }} />

      <div className="bg-background text-on-background min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container dark">

        <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-on-background/10">
          <div className="flex justify-between items-center gap-3 w-full px-4 py-4 sm:px-8 sm:py-5 md:px-margin md:py-6">
            <a href="#" aria-label="Aperture v2 Home" className="text-sm font-headline-sm tracking-[0.2em] text-on-background uppercase sm:text-base md:text-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm transition-colors block">
              APERTURE v2
            </a>
            <nav aria-label="Main navigation" className="hidden md:block">
              <ul className="flex items-center gap-8">
                {["Features:#features", "Gallery:#gallery", "Specs:#specs", "Community:#community"].map(l => {
                  const [name, href] = l.split(":");
                  return (
                    <li key={name}><a href={href} className="text-on-background/60 font-label-caps text-label-caps tracking-widest uppercase hover:text-primary-container focus-visible:outline-none focus-visible:text-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm transition-colors duration-500 block">{name}</a></li>
                  );
                })}
              </ul>
            </nav>
            <div className="flex items-center gap-6">
              <button className="hidden md:block font-label-caps text-label-caps tracking-widest uppercase text-primary-container hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm transition-all duration-300 active:scale-95">
                Pre-order
              </button>
              <button aria-label="Open Shopping Bag" className="text-on-background hover:text-primary-container focus-visible:outline-none focus-visible:text-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm transition-all duration-300 scale-95 hover:scale-100 active:scale-90">
                <span className="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow">

          <section id="hero" className="relative min-h-[100dvh] w-full flex flex-col justify-end pb-12 pt-32 px-4 overflow-hidden bg-surface-dim sm:pb-16 sm:px-8 md:pb-24 md:px-margin">
            <div className="absolute inset-0 z-0">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFgjfMAYcmQu_vL0CJomegHYq4Sgy2tYd5U4rsVCjoz5X6MaryF2z_dFpgq8mt4nzlnDpVejmskFv3btyCN4Vm6CKcb97PynxXCU9NV4MpEwxn81HY6eeVuwj5Ir6mCXujSu5OWsaFnuyQr-1o9LYXj-tyoOX6oum4hnKk2SY8cIgIdMJ2l_QL41yxeyImJAccOSC_F-shX20hTfu2ucnENEhdZ-aM86V5kgJasHK3Y9zVd6QnJgFQYM_naSDfBtIzou50RGPNGJI" alt="Dramatic golden hour landscape" width="1920" height="1080" fetchPriority="high" decoding="async" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-screen-2xl mx-auto w-full">
              <h1 className="font-display-lg text-[clamp(2.25rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] text-on-surface mb-6 max-w-4xl sm:mb-8 text-balance">
                Aperture v2: <span className="italic text-primary-container">See differently.</span>
              </h1>
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 sm:gap-8">
                <div className="flex gap-4 sm:gap-6">
                  {[["14", "Days"], ["08", "Hours"], ["42", "Min"]].map(([n, l]) => (
                    <div key={l} className="flex flex-col">
                      <span className="font-mono-data text-[clamp(1.5rem,3vw,2rem)] font-light text-on-surface leading-none tabular-nums">{n}</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant mt-2 uppercase">{l}</span>
                    </div>
                  ))}
                </div>
                <button className="group flex items-center justify-center gap-3 bg-primary-container text-on-primary-container px-5 py-3 rounded-none hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-300 sm:gap-4 sm:px-8 sm:py-4 active:scale-95">
                  <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  <span className="font-label-caps text-label-caps tracking-widest uppercase">Watch the trailer</span>
                </button>
              </div>
            </div>
          </section>

          <section id="quote" className="py-16 px-5 bg-background flex flex-col items-center justify-center text-center sm:py-24 sm:px-8 md:py-32 md:px-margin">
            <span className="material-symbols-outlined text-4xl text-surface-variant mb-6 sm:mb-8" aria-hidden="true">camera</span>
            <figure className="max-w-3xl w-full">
              <blockquote className="font-headline-md text-[clamp(1.375rem,3vw,2rem)] leading-relaxed text-primary italic text-balance mb-6 sm:mb-8">
                "The most significant leap in mobile cinematography since the lens itself."
              </blockquote>
              <figcaption className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase text-pretty">
                — International Journal of Photography
              </figcaption>
            </figure>
          </section>

          <section id="features" className="py-16 px-5 bg-surface-container-lowest sm:py-20 sm:px-8 md:py-24 md:px-margin scroll-mt-20">
            <ul className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {features.map(f => (
                <li key={f.id}>
                  <a href={`#${f.id}`} className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-4 focus-visible:ring-offset-surface-container-lowest rounded-sm block">
                    <div className="aspect-[3/4] overflow-hidden bg-surface-container mb-6">
                      <img src={f.img} alt={f.alt} width="600" height="800" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out motion-reduce:transition-none" />
                    </div>
                    <div className="flex items-center justify-between border-t border-outline/20 pt-4">
                      <span className="font-label-caps text-label-caps text-on-surface tracking-widest uppercase">{f.title}</span>
                      <span className="font-mono-data text-mono-data text-on-surface-variant tabular-nums">{f.num}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section id="sensor" className="py-20 px-5 bg-background sm:py-24 sm:px-8 md:py-32 md:px-margin scroll-mt-20">
            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-12 items-center">
              <div className="md:col-span-7 relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-surface-container-low">
                <img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&q=85&auto=format&fit=crop" alt="Macro detail of brass lens housing rendering the Aperture v2 sensor cluster" width="1600" height="2000" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale contrast-110 opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-primary-container/10 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
                  <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">Detail · 02 — Sensor</span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">PLATE · I</span>
                </div>
              </div>
              <div className="md:col-span-5 flex flex-col gap-8">
                <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Detail · 02 — Sensor</span>
                <h2 className="font-display-lg text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-on-surface text-balance">
                  1.6× larger photosites. <span className="italic text-primary-container">Light, faithfully recorded.</span>
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant text-pretty">
                  A redesigned 1-inch stacked sensor with deep-well photodiodes captures four stops more dynamic range than v1. The result is a frame that holds together — highlights soft, shadows readable, midtones true — even when the world isn't.
                </p>
                <dl className="grid grid-cols-3 gap-4 border-t border-outline/20 pt-8">
                  {[["Sensor", "1.0″"], ["Range", "14 EV"], ["ISO", "25–204k"]].map(([dt, dd]) => (
                    <div key={dt} className="flex flex-col gap-1">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{dt}</dt>
                      <dd className="font-mono-data text-[clamp(1.25rem,2vw,1.75rem)] font-light text-on-surface tabular-nums">{dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section id="gallery" className="relative py-20 px-5 bg-surface-container-lowest sm:py-24 sm:px-8 md:py-32 md:px-margin scroll-mt-20 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto flex flex-col gap-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex flex-col gap-4 max-w-2xl">
                  <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Detail · 03 — Gallery</span>
                  <h2 className="font-display-lg text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-on-surface text-balance">
                    Shot on Aperture v2. <span className="italic text-primary-container">Unretouched.</span>
                  </h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant md:max-w-md">
                  Frames from the field crew — 90 days, six continents, one camera. Hover to slow the marquee.
                </p>
              </div>
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface-container">
                {APV2_GALLERY_FRAMES.map(f => (
                  <img key={f.delay} className="ap-archive-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: f.delay }} src={f.src} alt={f.alt} width="1920" height="822" loading="lazy" decoding="async" />
                ))}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-surface-container-lowest/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
                  <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Frame · Auto-cycling 21:9</span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">SHOT ON · v2</span>
                </div>
              </div>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="ap-marquee-track">
                  {[...APV2_MARQUEE_TAGS, ...APV2_MARQUEE_TAGS].map((tag, i) => (
                    <React.Fragment key={i}>
                      <span className="font-mono-data text-mono-data text-on-surface-variant uppercase tracking-widest whitespace-nowrap" aria-hidden={i >= APV2_MARQUEE_TAGS.length ? "true" : undefined}>{tag}</span>
                      <span className="font-mono-data text-mono-data text-outline" aria-hidden="true">·</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="specs" className="py-20 px-5 bg-surface-container sm:py-24 sm:px-8 md:py-32 md:px-margin scroll-mt-20">
            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-12">
              <div className="md:col-span-4 flex flex-col gap-6">
                <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Spec Sheet · 04</span>
                <h2 className="font-display-lg text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.02em] text-on-surface text-balance">
                  Every figure, <span className="italic text-primary-container">measured.</span>
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-pretty">
                  No marketing roundings. Calibrated against an EBU studio reference, signed off by Aperture Labs metrology, Q2 2024.
                </p>
              </div>
              <dl className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 divide-y divide-outline/15 sm:divide-y-0 sm:[&>*]:border-b sm:[&>*]:border-outline/15 sm:[&>*]:py-6 [&>*]:py-5">
                {APV2_SPECS.map(([k, v], i) => {
                  const colCls = i % 2 === 0 ? "sm:pr-8 sm:border-r sm:border-outline/15" : "sm:pl-8";
                  return (
                    <div key={k} className={`flex items-baseline justify-between gap-6 ${colCls}`}>
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{k}</dt>
                      <dd className="font-mono-data text-mono-data text-on-surface tabular-nums">{v}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </section>

          <section id="process" className="py-20 px-5 bg-background sm:py-24 sm:px-8 md:py-32 md:px-margin scroll-mt-20">
            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-16">
              <figure className="md:col-span-5 md:sticky md:top-32 md:self-start aspect-[3/4] overflow-hidden bg-surface-container">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&auto=format&fit=crop" alt="Macro of green circuit board representing the Aperture v2 image-processing pipeline" width="1200" height="1600" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale contrast-110 opacity-90" />
              </figure>
              <ol className="md:col-span-7 flex flex-col divide-y divide-outline/15 border-y border-outline/15">
                {APV2_PROCESS.map(p => (
                  <li key={p.numeral} className="grid grid-cols-12 gap-4 py-8 md:py-12">
                    <span className="col-span-2 font-display-lg text-[clamp(1.75rem,3vw,2.5rem)] text-primary-container italic tabular-nums">{p.numeral}</span>
                    <div className="col-span-10 flex flex-col gap-3">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{p.stage}</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface">{p.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant text-pretty">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="comparison" className="relative py-24 sm:py-32 md:py-40 overflow-hidden bg-background">
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ clipPath: "polygon(0 0, 100% 14%, 100% 86%, 0 100%)" }}>
              <img src="https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1920&q=85&auto=format&fit=crop" alt="Industrial machinery in golden tungsten light, Aperture v2 vs v1 backdrop" width="1920" height="1080" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale contrast-110 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-background/85"></div>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245,166,35,0.12) 0%, transparent 70%)" }}></div>
            </div>
            <div className="relative z-10 max-w-screen-2xl mx-auto px-5 sm:px-8 md:px-margin">
              <div className="flex flex-col items-center text-center gap-6 mb-12 sm:mb-16">
                <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Detail · 05 — Compare</span>
                <h2 className="font-display-lg text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-on-surface text-balance max-w-3xl">
                  v1 was the proof. <span className="italic text-primary-container">v2 is the practice.</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-outline/20 border border-outline/20">
                {APV2_COMPARE.map(c => (
                  <div key={c.label} className="bg-background/80 backdrop-blur-sm flex flex-col gap-2 p-6 sm:p-8">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{c.label}</span>
                    <span className="font-mono-data text-mono-data text-outline tabular-nums">{c.v1}</span>
                    <span className="font-display-lg text-[clamp(1.75rem,2.4vw,2.25rem)] font-light text-primary-container tabular-nums leading-none mt-2">{c.v2}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="pricing" className="py-20 px-5 bg-surface-container-high sm:py-24 sm:px-8 md:py-32 md:px-margin scroll-mt-20">
            <div className="max-w-screen-2xl mx-auto flex flex-col gap-12">
              <div className="flex flex-col items-start gap-6 max-w-3xl">
                <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Order · 06 — Configure</span>
                <h2 className="font-display-lg text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-on-surface text-balance">
                  Three bodies. <span className="italic text-primary-container">One sensor.</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {APV2_PRICING.map(p => {
                  const cardCls = p.featured
                    ? "bg-surface-container-low border-2 border-primary-container shadow-[0_0_60px_rgba(245,166,35,0.18)]"
                    : "bg-surface-container-lowest border border-outline/15";
                  const eyebrowCls = p.featured ? "text-primary-container" : "text-on-surface-variant";
                  const ctaCls = p.featured
                    ? "bg-primary-container text-on-primary-container hover:bg-primary focus-visible:ring-primary"
                    : "border border-outline/40 text-on-surface hover:border-primary-container hover:text-primary-container focus-visible:ring-primary-container";
                  return (
                    <article key={p.title} className={`flex flex-col p-6 sm:p-8 gap-6 relative ${cardCls}`}>
                      {p.featured && (
                        <span className="absolute -top-3 left-6 bg-primary-container text-on-primary-container font-label-caps text-label-caps tracking-widest uppercase px-3 py-1">Most Loved</span>
                      )}
                      <header className="flex flex-col gap-2 border-b border-outline/15 pb-6">
                        <span className={`font-label-caps text-label-caps uppercase tracking-widest ${eyebrowCls}`}>{p.eyebrow}</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface">{p.title}</h3>
                        <p className="font-mono-data text-mono-data text-outline">{p.sub}</p>
                      </header>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display-lg text-[clamp(2rem,3vw,2.75rem)] font-light text-on-surface tabular-nums leading-none">{p.price}</span>
                        <span className="font-mono-data text-mono-data text-outline">USD</span>
                      </div>
                      <ul className="flex flex-col gap-3 text-on-surface-variant font-body-md text-body-md">
                        {p.items.map(it => (
                          <li key={it} className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary-container text-xl" aria-hidden="true">check</span>
                            {it}
                          </li>
                        ))}
                      </ul>
                      <a href="#preorder" className={`mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 font-label-caps text-label-caps tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-high rounded-sm transition-all duration-300 active:scale-95 ${ctaCls}`}>
                        <span>Reserve</span>
                        <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="reviews" className="py-20 px-5 bg-surface-container-low sm:py-24 sm:px-8 md:py-32 md:px-margin scroll-mt-20">
            <div className="max-w-screen-2xl mx-auto flex flex-col gap-12">
              <div className="flex flex-col items-start gap-4 max-w-2xl">
                <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Detail · 07 — Press</span>
                <h2 className="font-display-lg text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.02em] text-on-surface text-balance">
                  Reviewers, on the record.
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {APV2_REVIEWS.map(r => (
                  <figure key={r.name} className="flex flex-col gap-6 border-t border-outline/20 pt-8">
                    <div className="flex items-center gap-1 text-primary-container">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className="material-symbols-outlined text-base" style={i <= r.stars ? { fontVariationSettings: "'FILL' 1" } : undefined} aria-hidden="true">star</span>
                      ))}
                    </div>
                    <blockquote className="font-display-lg text-[clamp(1.25rem,2vw,1.75rem)] leading-snug text-on-surface italic text-pretty">
                      "{r.quote}"
                    </blockquote>
                    <figcaption className="flex flex-col gap-1 mt-auto">
                      <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">{r.name}</span>
                      <span className="font-mono-data text-mono-data text-on-surface-variant">{r.outlet}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section id="in-the-wild" className="py-20 px-5 bg-background sm:py-24 sm:px-8 md:py-32 md:px-margin scroll-mt-20">
            <div className="max-w-screen-2xl mx-auto flex flex-col gap-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
                {APV2_BOOKEND_TOP.map(im => (
                  <figure key={im.src} className="aspect-[3/4] overflow-hidden bg-surface-container">
                    <img src={im.src} alt={im.alt} width="900" height="1200" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                  </figure>
                ))}
              </div>
              <figure className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
                <blockquote className="font-headline-md text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug text-on-surface italic text-balance">
                  "Out of the studio, on the bench, in the rain, in the dark — it just keeps making frames."
                </blockquote>
                <figcaption className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Field log · 90 days</figcaption>
              </figure>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
                {APV2_BOOKEND_BOTTOM.map(im => (
                  <figure key={im.src} className="aspect-[3/4] overflow-hidden bg-surface-container">
                    <img src={im.src} alt={im.alt} width="900" height="1200" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="py-20 px-5 bg-surface-container-lowest sm:py-24 sm:px-8 md:py-32 md:px-margin scroll-mt-20">
            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-16">
              <div className="md:col-span-4 flex flex-col gap-6">
                <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Detail · 08 — FAQ</span>
                <h2 className="font-display-lg text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.02em] text-on-surface text-balance">
                  Questions <span className="italic text-primary-container">we hear most.</span>
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-pretty">
                  Anything not covered here, our atelier desk is at <a href="mailto:concierge@aperturelabs.co" className="underline decoration-outline/40 hover:decoration-primary-container hover:text-primary-container transition">concierge@aperturelabs.co</a>.
                </p>
              </div>
              <div className="md:col-span-8 flex flex-col divide-y divide-outline/15 border-y border-outline/15">
                {APV2_FAQ.map(item => (
                  <details key={item.q} className="ap-faq group py-6 px-1">
                    <summary className="flex items-center justify-between gap-6">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.q}</h3>
                      <span className="material-symbols-outlined ap-chev text-primary-container shrink-0" aria-hidden="true">add</span>
                    </summary>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-4 text-pretty">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section id="preorder" className="relative py-24 px-5 sm:py-32 md:py-40 md:px-margin overflow-hidden scroll-mt-20">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1920&q=85&auto=format&fit=crop" alt="Server rack in cool blue light, Aperture v2 pre-order backdrop" width="1920" height="1080" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale contrast-110 opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background"></div>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,166,35,0.18) 0%, transparent 70%)" }}></div>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto bg-surface/80 backdrop-blur-xl border border-outline/20 p-8 sm:p-12 md:p-16 flex flex-col gap-8">
              <div className="flex flex-col items-start gap-4">
                <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase">Order · 09 — Pre-order</span>
                <h2 className="font-display-lg text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.02em] text-on-surface text-balance">
                  Reserve your <span className="italic text-primary-container">Aperture v2.</span>
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-pretty">
                  $50 holds your wave-one allocation, fully refundable until the day before shipping. We'll email three weeks before your camera leaves the atelier.
                </p>
              </div>
              <form action="#" method="POST" className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex flex-col gap-2 flex-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Name</span>
                    <input name="name" type="text" autoComplete="name" required placeholder="Your full name" className="bg-transparent border border-outline/30 text-on-surface font-body-md text-body-md px-4 py-3 placeholder-on-surface/30 focus:ring-1 focus:ring-primary-container focus:border-primary-container focus-visible:outline-none rounded-sm" />
                  </label>
                  <label className="flex flex-col gap-2 flex-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Email</span>
                    <input name="email" type="email" autoComplete="email" required placeholder="you@studio.com" className="bg-transparent border border-outline/30 text-on-surface font-body-md text-body-md px-4 py-3 placeholder-on-surface/30 focus:ring-1 focus:ring-primary-container focus:border-primary-container focus-visible:outline-none rounded-sm" />
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Configuration</span>
                  <select name="config" defaultValue="pro" className="bg-transparent border border-outline/30 text-on-surface font-body-md text-body-md px-4 py-3 focus:ring-1 focus:ring-primary-container focus:border-primary-container focus-visible:outline-none rounded-sm">
                    <option value="standard" className="bg-surface-container">Standard · 256 GB · $1 199</option>
                    <option value="pro" className="bg-surface-container">Pro · 1 TB · $1 799</option>
                    <option value="pro-max" className="bg-surface-container">Pro Max · 4 TB · $2 499</option>
                  </select>
                </label>
                <button type="submit" className="group inline-flex items-center justify-center gap-3 bg-primary-container text-on-primary-container px-6 py-4 font-label-caps text-label-caps tracking-widest uppercase hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm transition-all duration-300 active:scale-95 mt-2">
                  <span>Hold my Aperture · $50</span>
                  <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </button>
                <p className="font-mono-data text-mono-data text-on-surface-variant tracking-widest">No card charged until allocation is confirmed · Refundable any time until shipping</p>
              </form>
            </div>
          </section>

          <aside aria-label="Press mentions" className="border-y border-outline/10 bg-background py-10 px-5 overflow-hidden sm:py-12 sm:px-8 md:px-margin">
            <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-6 sm:gap-x-12 md:gap-x-24 opacity-40">
              <span className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-tighter">WIRED</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">THE VERGE</span>
              <span className="font-headline-sm text-headline-sm text-on-surface italic tracking-widest">LensCulture</span>
              <span className="font-headline-sm text-headline-sm text-on-surface uppercase border-2 border-current px-2 py-1">National Geographic</span>
            </div>
          </aside>

          <section id="community" className="relative py-20 px-5 bg-surface-dim overflow-hidden flex items-center justify-center text-center sm:py-28 sm:px-8 md:py-48 md:px-margin scroll-mt-20">
            <div className="absolute inset-0 z-0">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUrbSFR2HFfemX7_pPoUUL9Hd6L2qwBZl3E8xusJhSnaSIZ3iplLqmHzeBU8k3PAwLpNRLjTKkJ6TkDUcLQ-LOtFmBxjOlER0UykwBc2xb9YCGPGXd7OMW9HCQSNWHb7SlIvZ3DhiFR5ZpRpB38Zj69OpCJ5Hvzbll-XNbCDqQG6iS1ggXPyVs_D7yWu9CdAm4zxpy7wIt9STRP-4ZhF_uRf-Ul-fiP3UwV-N5MIkxumrBvlDj9tqTZAu-464pr_jFwaKH7KdpHKo" alt="Photographer working in studio" width="1920" height="1080" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-20 blur-sm grayscale" />
              <div className="absolute inset-0 bg-background/60"></div>
            </div>
            <figure className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
              <blockquote className="font-display-lg text-[clamp(1.75rem,4vw,4rem)] leading-tight tracking-[-0.02em] text-on-surface italic mb-8 sm:mb-10 md:mb-12 text-balance">
                "It doesn't just capture light; it captures intent. It's the only tool that feels like it disappears when I'm shooting."
              </blockquote>
              <figcaption className="flex flex-col items-center">
                <span className="font-label-caps text-label-caps text-primary-container tracking-widest uppercase mb-2">Elena Rostova</span>
                <span className="font-mono-data text-mono-data text-on-surface-variant">Cinematographer, ASC</span>
              </figcaption>
            </figure>
          </section>

        </main>

        <footer className="w-full pt-16 pb-10 px-5 bg-background border-t border-outline/10 sm:pt-24 sm:pb-12 sm:px-8 md:pt-32 md:px-margin">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-10 md:gap-16">
            <div className="flex flex-col w-full md:w-1/2">
              <div className="font-headline-md text-[clamp(1.5rem,3vw,2.25rem)] leading-tight tracking-tighter text-on-surface uppercase mb-8 sm:mb-10 md:mb-12">
                APERTURE v2
              </div>
              <form action="#" method="POST" className="mb-12 max-w-md">
                <label htmlFor="email-input" className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase block mb-4 cursor-pointer">
                  Join the waitlist for launch notifications
                </label>
                <div className="flex items-center border-b border-outline/30 pb-2 focus-within:border-primary-container transition-colors duration-300">
                  <input id="email-input" name="email" type="email" autoComplete="email" required placeholder="ENTER YOUR EMAIL" className="bg-transparent border-none outline-none w-full text-on-surface font-body-md text-body-md placeholder-on-surface/30 focus:ring-0 focus-visible:outline-none px-0" />
                  <button type="submit" aria-label="Submit email" className="text-primary-container hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-all duration-300 active:scale-95 ml-2">
                    <span className="material-symbols-outlined block" aria-hidden="true">arrow_forward</span>
                  </button>
                </div>
              </form>
              <p className="font-body-md text-body-md text-on-surface/40 italic text-pretty">
                © 2024 Aperture Labs. Precision in every frame.
              </p>
            </div>
            <nav aria-label="Footer navigation" className="flex flex-col items-start md:items-end gap-6">
              {["Journal", "Press Kit", "Privacy", "Terms"].map(l => (
                <a key={l} href="#" className="text-on-surface/50 font-label-caps text-label-caps uppercase tracking-[0.3em] hover:text-primary-container focus-visible:outline-none focus-visible:text-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm transition-all duration-300 block">{l}</a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
