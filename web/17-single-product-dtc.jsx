const DRIFT_INVENTORY = [
  { sku: "DRF · 03·14 — Bench Proof", title: "Sleep Tincture · Lot 24·R3", place: "Kyoto · 04:12", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=85&auto=format&fit=crop", alt: "Field study — Kyoto bench" },
  { sku: "DRF · 03·15 — Apothecary",  title: "Tincture decant · Brass dropper", place: "Copenhagen · 21:48", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=85&auto=format&fit=crop", alt: "Apothecary still life" },
  { sku: "DRF · 03·17 — Clinic Bay",  title: "Cohort handoff · n=22", place: "Lisbon · 09:02", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", alt: "Sage interior — Lisbon clinic" },
  { sku: "DRF · 03·18 — Night Proof", title: "Subject log · Restful 7h22m", place: "Brooklyn · 23:11", img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=85&auto=format&fit=crop", alt: "Night-table proof — portrait" },
  { sku: "DRF · 03·19 — Editorial",   title: "Evening regimen · Pre-press", place: "Antwerp · 18:55", img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=85&auto=format&fit=crop", alt: "Editorial portrait" },
  { sku: "DRF · 03·21 — Shelf Audit", title: "Inventory rotation · Q1·24", place: "Helsinki · 14:30", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85&auto=format&fit=crop", alt: "Architectural shelf — apothecary" },
  { sku: "DRF · 03·22 — Restoration", title: "Cohort review · Week 04", place: "Reykjavík · 06:40", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85&auto=format&fit=crop", alt: "Quiet portrait — restoration" },
  { sku: "DRF · 03·24 — Light Study", title: "Bottle stability · 21°C", place: "Geneva · 11:15", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=85&auto=format&fit=crop", alt: "Light study — facade" },
];

const DRIFT_RITUAL = [
  { n: "01", title: "Dim, then settle.",  body: "Lower the room to candle-grade light by 21:30. Phones face-down, screens out of arm's reach." },
  { n: "02", title: "Two droppers, held.", body: "Place 1 mL under the tongue and hold for 30 seconds before swallowing. The botanicals enter cleanly through sublingual capillaries." },
  { n: "03", title: "Twenty quiet minutes.", body: "Read a page, stretch, or sit with tea. The valerian and L-theanine begin to elevate GABA tone within fifteen minutes." },
  { n: "04", title: "Released into sleep.", body: "By 22:15 the body recognises the cue. Magnesium glycinate eases muscle tension; cortisol falls without sedation." },
];

const DRIFT_LEDGER = [
  {
    pct: "4%",
    label: "Ledger · 01",
    name: "Hydrolyzed yeast peptide",
    body: "A short-chain bioactive that primes the GABA-A receptor without binding it. Dosed at 4%, the threshold above which two independent crossover studies showed reduced sleep-onset latency.",
    role: "Receptor primer",
    origin: "Strasbourg · FR",
    img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=85&auto=format&fit=crop",
    alt: "Brass apothecary still life — peptide flask",
    overlay: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=85&auto=format&fit=crop",
    overlayPos: "-bottom-6 -right-6 rotate-3",
    reverse: false,
  },
  {
    pct: "0.5%",
    label: "Ledger · 02",
    name: "Bakuchiol — Babchi seed",
    body: "A plant-derived analogue to retinol with none of the photosensitivity. Half a percent is the dose proven across two third-party clinical reads to soften the cortisol-driven evening flush.",
    role: "Cortisol modulator",
    origin: "Kerala · IN",
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop",
    alt: "Architectural interior — bakuchiol provenance",
    overlay: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=85&auto=format&fit=crop",
    overlayPos: "-bottom-6 -left-6 -rotate-3",
    reverse: true,
  },
  {
    pct: "12%",
    label: "Ledger · 03",
    name: "Squalane — sugarcane derived",
    body: "A clean carrier that mirrors the skin's own sebum. 12% by volume is what we settled on: dense enough to slow the active's release through the night, light enough to leave no residue on linen.",
    role: "Carrier · time-release",
    origin: "Pernambuco · BR",
    img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=900&q=85&auto=format&fit=crop",
    alt: "Squalane carrier oil — bottle in light",
    overlay: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=85&auto=format&fit=crop",
    overlayPos: "-top-6 -right-6 rotate-2",
    reverse: false,
  },
];

const DRIFT_STATS = [
  { v: "78%",       l: "Reported smoother texture" },
  { v: "4 wk",      l: "Median visible result" },
  { v: "n=127",     l: "Double-blind cohort" },
  { v: "ISO·21148", l: "Lab certified" },
];

function SingleProductDtc() {
  return (
    <>
      {/* head */}
      <title>Drift - Clinical Restoration</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Serif:wght@400;500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-fixed-dim": "#f9b989",
                        "on-primary-fixed": "#191c1a",
                        "primary-container": "#2a2d2a",
                        "on-tertiary-container": "#c0875b",
                        "on-tertiary": "#ffffff",
                        "inverse-primary": "#c5c7c2",
                        "surface-bright": "#f8faf6",
                        "surface-container-highest": "#e1e3df",
                        "background": "#f8faf6",
                        "on-error-container": "#93000a",
                        "on-surface-variant": "#444844",
                        "surface": "#f8faf6",
                        "secondary-container": "#e0e4db",
                        "on-secondary-fixed": "#181d17",
                        "error-container": "#ffdad6",
                        "inverse-on-surface": "#eff1ed",
                        "on-surface": "#191c1a",
                        "outline-variant": "#c5c7c2",
                        "on-primary-fixed-variant": "#454744",
                        "secondary-fixed-dim": "#c4c8bf",
                        "inverse-surface": "#2e312f",
                        "on-error": "#ffffff",
                        "outline": "#757874",
                        "surface-dim": "#d8dbd7",
                        "on-secondary-container": "#61665f",
                        "secondary": "#5b6059",
                        "on-background": "#191c1a",
                        "on-secondary": "#ffffff",
                        "on-primary-container": "#929490",
                        "secondary-fixed": "#e0e4db",
                        "error": "#ba1a1a",
                        "surface-variant": "#e1e3df",
                        "surface-container-lowest": "#ffffff",
                        "primary-fixed": "#e1e3de",
                        "surface-container": "#eceeea",
                        "primary-fixed-dim": "#c5c7c2",
                        "on-tertiary-fixed": "#2f1400",
                        "tertiary": "#2a1100",
                        "primary": "#151916",
                        "on-tertiary-fixed-variant": "#683c17",
                        "surface-tint": "#5c5f5b",
                        "tertiary-fixed": "#ffdcc4",
                        "surface-container-low": "#f2f4f0",
                        "on-primary": "#ffffff",
                        "surface-container-high": "#e7e9e5",
                        "on-secondary-fixed-variant": "#434842",
                        "tertiary-container": "#482201"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "sm": "16px",
                        "base": "8px",
                        "md": "24px",
                        "gutter": "24px",
                        "xl": "80px",
                        "margin": "64px",
                        "xs": "4px",
                        "lg": "48px"
                    },
                    "fontFamily": {
                        "headline-h2": ["Noto Serif"],
                        "display-lg": ["Noto Serif"],
                        "body-sm": ["Inter"],
                        "headline-h1": ["Noto Serif"],
                        "label-caps": ["Inter"],
                        "body-main": ["Inter"]
                    },
                    "fontSize": {
                        "headline-h2": ["32px", { "lineHeight": "1.3", "fontWeight": "400" }],
                        "display-lg": ["72px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "400" }],
                        "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
                        "headline-h1": ["48px", { "lineHeight": "1.2", "fontWeight": "400" }],
                        "label-caps": ["12px", { "lineHeight": "1", "letterSpacing": "0.08em", "fontWeight": "600" }],
                        "body-main": ["16px", { "lineHeight": "1.6", "letterSpacing": "0.01em", "fontWeight": "400" }]
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        html, body { overflow-x: clip; }
        .drift-marquee-track {
            display: flex;
            gap: 24px;
            width: max-content;
            animation: drift-marquee-x 60s linear infinite;
        }
        .drift-marquee-track:hover { animation-play-state: paused; }
        @keyframes drift-marquee-x {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); }
        }
        .drift-tile-img {
            mix-blend-mode: luminosity;
            filter: contrast(1.05);
        }
        @media (prefers-reduced-motion: reduce) {
            .drift-marquee-track { animation: none; }
        }
` }} />

      {/* body wrapper */}
      <div className="bg-background text-on-background font-body-main selection:bg-tertiary-fixed-dim selection:text-tertiary">

        {/* TopNavBar */}
        <nav className="bg-stone-50/90 backdrop-blur-sm dark:bg-neutral-900/90 fixed top-0 w-full z-50 border-b border-neutral-200/40 dark:border-neutral-800/40 text-neutral-900 dark:text-neutral-50 font-serif text-sm tracking-wide flex justify-between items-center gap-3 h-16 px-4 opacity-90 active:opacity-100 transition-opacity sm:h-20 sm:px-8 md:px-16">
          <div className="flex items-center gap-6 md:gap-margin">
            <a className="text-lg font-serif font-medium tracking-[0.2em] text-neutral-900 dark:text-neutral-50 sm:text-xl md:text-2xl" href="#">Drift</a>
            <div className="hidden md:flex gap-md">
              <a className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300" href="#science">Science</a>
              <a className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300" href="#ingredients">Ingredients</a>
              <a className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300" href="#reviews">Reviews</a>
              <a className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300" href="#faq">FAQ</a>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-md">
            <button className="hidden md:block font-body-main text-body-main text-on-primary bg-primary-container px-md py-base rounded-DEFAULT hover:bg-surface-tint transition-colors duration-300">Shop Now</button>
            <button aria-label="Cart" className="text-neutral-900 dark:text-neutral-50 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300">
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </button>
          </div>
        </nav>

        <main className="pt-[72px] pb-12 px-4 max-w-7xl mx-auto space-y-16 sm:pt-24 sm:pb-16 sm:px-8 sm:space-y-24 md:pt-[120px] md:pb-xl md:px-margin md:space-y-[120px]">

          {/* Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center md:gap-margin">
            <div className="lg:col-span-7 aspect-[3/4] lg:aspect-auto lg:h-[600px] bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 flex items-center justify-center p-6 relative sm:p-10 md:p-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-variant/20 to-transparent"></div>
              <img alt="Drift Sleep Tincture Bottle" className="w-full h-full object-cover object-center mix-blend-multiply opacity-90 z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3rpp5EbMuFD6_H7Na3Lc1--m1VOP1UImW86OS3z7Y2Fq_BzvnkKq-xXFShN_ClOheRUjbBk6vi_IMCkHyAjB6wd_UuyiwT_KBLHWMPw5FVKUH-nHhS9F5SFaWYviDXY6R_Gml4QbINAghLU900g_9nTrACI1_4OYgOTB8dUsGFpV3v6cYzfxc_gnVgJUVmaKHclbjqVH6-CIM510CamttLUILf9GQfO56pN7mdar1lX6mod6SU552sYQeuRuWTYI7Tt9Ojuo1y3tc" />
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-md">
              <div className="space-y-base">
                <h1 className="font-display-lg text-[36px] leading-[1.05] text-on-background sm:text-[52px] md:text-display-lg">Sleep, returned.</h1>
                <p className="font-body-main text-body-main text-on-surface-variant">A clinical-grade botanical tincture designed to quiet the mind, lower cortisol, and invite deep, restorative sleep without morning grogginess.</p>
              </div>
              <div className="border-y border-outline-variant/30 py-md space-y-md">
                <div className="space-y-sm">
                  <label className="flex items-start gap-sm p-sm rounded-lg border border-primary-container bg-surface cursor-pointer">
                    <input defaultChecked className="mt-1 text-primary-container focus:ring-primary-container w-4 h-4" name="purchase_type" type="radio" />
                    <div>
                      <span className="block font-body-main text-body-main text-on-background font-medium">Subscribe &amp; Save 15%</span>
                      <span className="block font-body-sm text-body-sm text-on-surface-variant">Delivery every 30 days. Cancel anytime.</span>
                    </div>
                    <span className="ml-auto font-body-main text-body-main text-on-background">$42.00</span>
                  </label>
                  <label className="flex items-start gap-sm p-sm rounded-lg border border-outline-variant/50 bg-transparent hover:bg-surface-container-lowest cursor-pointer transition-colors">
                    <input className="mt-1 text-primary-container focus:ring-primary-container w-4 h-4" name="purchase_type" type="radio" />
                    <div>
                      <span className="block font-body-main text-body-main text-on-background font-medium">One-Time Purchase</span>
                    </div>
                    <span className="ml-auto font-body-main text-body-main text-on-background">$48.00</span>
                  </label>
                </div>

                <div className="flex gap-sm">
                  <div className="flex items-center border border-outline-variant rounded-DEFAULT w-32">
                    <button className="px-sm py-base text-on-surface-variant hover:text-on-background"><span className="material-symbols-outlined text-sm">remove</span></button>
                    <input aria-label="Quantity" className="w-full text-center border-none bg-transparent font-body-main text-body-main focus:ring-0 p-0" type="text" defaultValue="1" />
                    <button className="px-sm py-base text-on-surface-variant hover:text-on-background"><span className="material-symbols-outlined text-sm">add</span></button>
                  </div>
                  <button className="flex-1 bg-primary-container text-on-primary font-body-main text-body-main py-base px-md rounded-DEFAULT hover:bg-surface-tint transition-colors">
                    Add to Cart — $42.00
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-center flex items-center justify-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span> Free shipping on all domestic orders.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits row */}
          <section className="border-y border-outline-variant/30 py-10 sm:py-12 md:py-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:gap-md md:divide-x md:divide-outline-variant/30">
              <div className="flex flex-col items-center space-y-sm px-sm">
                <span className="material-symbols-outlined text-4xl text-on-tertiary-container" style={{ fontVariationSettings: "'wght' 200" }}>nights_stay</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Deeper Sleep</span>
              </div>
              <div className="flex flex-col items-center space-y-sm px-sm">
                <span className="material-symbols-outlined text-4xl text-on-tertiary-container" style={{ fontVariationSettings: "'wght' 200" }}>wb_sunny</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Morning Clarity</span>
              </div>
              <div className="flex flex-col items-center space-y-sm px-sm">
                <span className="material-symbols-outlined text-4xl text-on-tertiary-container" style={{ fontVariationSettings: "'wght' 200" }}>spa</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Natural Elements</span>
              </div>
              <div className="flex flex-col items-center space-y-sm px-sm">
                <span className="material-symbols-outlined text-4xl text-on-tertiary-container" style={{ fontVariationSettings: "'wght' 200" }}>science</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Clinical Results</span>
              </div>
            </div>
          </section>

          {/* In the field — inventory marquee (image strip) */}
          <section className="-mx-4 sm:-mx-8 md:-mx-margin space-y-8 md:space-y-lg">
            <div className="px-4 sm:px-8 md:px-margin">
              <div className="flex items-end justify-between gap-md flex-wrap">
                <div className="space-y-base max-w-xl">
                  <span className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest">In the field · Inventory</span>
                  <h2 className="font-headline-h1 text-[28px] leading-tight text-on-background sm:text-[36px] md:text-headline-h1">Earned in quiet rooms.</h2>
                  <p className="font-body-main text-body-main text-on-surface-variant">Drift travels through apothecary bench tests, clinical bays, and night-table proofs. A passing record of where each batch was last logged.</p>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">Lot · 24·R3 — Hand · 17 / 24</span>
              </div>
            </div>
            <div className="overflow-hidden relative">
              <div className="drift-marquee-track py-base">
                {[...DRIFT_INVENTORY, ...DRIFT_INVENTORY].map((t, i) => (
                  <figure key={i} aria-hidden={i >= DRIFT_INVENTORY.length ? "true" : undefined} className="w-60 sm:w-64 shrink-0">
                    <div className="aspect-square rounded-xl overflow-hidden border border-outline-variant/30 bg-secondary/15 relative">
                      <img alt={i >= DRIFT_INVENTORY.length ? "" : t.alt} className="drift-tile-img w-full h-full object-cover" src={t.img} />
                      <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay pointer-events-none"></div>
                    </div>
                    <figcaption className="mt-sm space-y-xs">
                      <div className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest tabular-nums">{t.sku}</div>
                      <div className="font-body-sm text-body-sm text-on-background">{t.title}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">place</span> {t.place}</div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Ingredients bento */}
          <section id="ingredients" className="space-y-10 sm:space-y-12 md:space-y-lg">
            <div className="text-center max-w-2xl mx-auto space-y-base px-4 md:px-0">
              <h2 className="font-headline-h1 text-[28px] leading-tight text-on-background sm:text-[36px] md:text-headline-h1">Sourced for efficacy.</h2>
              <p className="font-body-main text-body-main text-on-surface-variant">We eliminated the unnecessary, focusing only on active botanicals proven to interact with your circadian rhythm.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-md">

              {/* Main ingredient */}
              <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-[400px] rounded-xl overflow-hidden border border-outline-variant/30 group">
                <img alt="Valerian Root" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF_5cojr3LvHy-b8_mt943WojSdN_zea6o3ia7t9zIrxKaTob_SOXz8aqYa6NSGjNYe0xSd69OA9mCJpufmHYY8kzx4WW1wHb3EOTsD6EVF2lnnDutrImvHuZYGBi1B7GaxZSXA9r_7R8plsOHqoPF_W6SUBw4zWiZpth-XokZgp97zdC6k1cGPVtYLgLpTgTL23w-kXub4qpxHZzsQf3fWdvoYwEXuTW4DeauUyFLg48iRqBxQJgwmgW8Oa-x5nYiCzwc0YaK7pRN" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full sm:p-8 md:p-lg">
                  <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase tracking-widest mb-xs block">Core Active</span>
                  <h3 className="font-headline-h2 text-[22px] leading-tight text-on-primary sm:text-[26px] md:text-headline-h2">Valerian Root Extract</h3>
                  <p className="font-body-main text-sm text-surface-variant mt-sm max-w-md sm:text-body-main">Clinically shown to increase GABA levels in the brain, reducing the time it takes to fall asleep.</p>
                </div>
              </div>

              {/* Secondary ingredient */}
              <div className="relative aspect-[3/4] md:aspect-auto md:h-[400px] rounded-xl overflow-hidden border border-outline-variant/30 group bg-surface-container-low">
                <div className="h-1/2 w-full">
                  <img alt="Lavender" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRqC-NsGcKm5moD0fqhQD2phunL1hd8ADdS89xlH1tZu0EVRKxpdhcKNADSarOfVkSq7vd-6KM2j4jTk7QtN4dw-BYjXUvTog8oBJcwhElHMel-AypPQ6f1mofKdFYTYLnbu6LHXzEPfqAf4wBi__k-TCTTNkW8TLndtgooWwgJsTF7xTul_o1ERpeLBdopNMMoM52RgHwTNLtnk8-vDqu4rDWH0CJIdXkK0zBOYpel0_qD6LSNxfnUqj8NImhD42rg7K6Dk2JDfK5" />
                </div>
                <div className="p-md h-1/2 flex flex-col justify-center">
                  <h3 className="font-headline-h2 text-[24px] leading-tight text-on-background">L-Theanine</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">An amino acid found in tea leaves that promotes a state of wakeful relaxation before sleep.</p>
                </div>
              </div>

              {/* Tertiary ingredient */}
              <div className="relative min-h-[220px] md:h-[300px] rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low flex flex-col justify-end p-md">
                <h3 className="font-headline-h2 text-[22px] leading-tight text-on-background sm:text-[24px]">Magnesium Glycinate</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">The most bioavailable form of magnesium, essential for muscle relaxation and nervous system regulation.</p>
              </div>

              {/* Info card */}
              <div className="md:col-span-2 relative min-h-[240px] md:h-[300px] rounded-xl border border-outline-variant/30 bg-surface flex items-center p-6 sm:p-8 md:p-lg">
                <div className="max-w-xl">
                  <span className="material-symbols-outlined text-on-tertiary-container text-4xl mb-sm" style={{ fontVariationSettings: "'wght' 200" }}>verified_user</span>
                  <h3 className="font-headline-h2 text-[22px] leading-tight text-on-background sm:text-[26px] md:text-headline-h2">Zero melatonin.</h3>
                  <p className="font-body-main text-body-main text-on-surface-variant mt-sm">Unlike synthetic sleep aids, Drift contains no melatonin, ensuring you wake up without the notorious "sleep hangover" and preserving your body's natural hormone production.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Ritual / How to use — sticky photo + scrolling steps */}
          <section id="ritual" className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-margin items-start">
            <div className="md:col-span-5 md:sticky md:top-[120px] md:self-start">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low relative">
                <img alt="Hands cradling tincture bottle, sage interior" className="absolute inset-0 w-full h-full object-cover grayscale contrast-105" src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1000&q=85&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-secondary/15 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/30 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 p-md flex items-end justify-between gap-3">
                  <span className="font-label-caps text-label-caps text-surface-variant uppercase tracking-widest">Plate · I — Ritual</span>
                  <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase tracking-widest tabular-nums">21:30 — 22:15</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 space-y-sm md:space-y-md">
              <div className="space-y-base">
                <span className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest">II — How to use</span>
                <h2 className="font-headline-h1 text-[28px] leading-tight text-on-background sm:text-[36px] md:text-headline-h1">A 45-minute ritual.</h2>
                <p className="font-body-main text-body-main text-on-surface-variant">Drift was made to slot inside an unhurried evening. Four small acts that lower the room's temperature before the body lets go.</p>
              </div>
              <ol className="border-t border-outline-variant/40 mt-md">
                {DRIFT_RITUAL.map((step) => (
                  <li key={step.n} className="border-b border-outline-variant/40 py-md grid grid-cols-12 gap-sm md:gap-md items-start">
                    <span className="col-span-2 font-display-lg text-[32px] sm:text-[40px] md:text-[44px] leading-none text-on-tertiary-container tabular-nums">{step.n}</span>
                    <div className="col-span-10 space-y-base">
                      <h3 className="font-headline-h2 text-[20px] leading-tight text-on-background italic sm:text-[24px]">{step.title}</h3>
                      <p className="font-body-main text-body-main text-on-surface-variant">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Ingredient ledger — alternating image/content rows + layered overlays */}
          <section className="space-y-10 sm:space-y-12 md:space-y-lg">
            <div className="max-w-2xl space-y-base">
              <span className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest">III — Ledger</span>
              <h2 className="font-headline-h1 text-[28px] leading-tight text-on-background sm:text-[36px] md:text-headline-h1">What's inside, in proof.</h2>
              <p className="font-body-main text-body-main text-on-surface-variant">Three actives, dosed to the percentage shown on the laboratory ledger. No fillers, no proprietary blends, no hidden carriers.</p>
            </div>
            <div className="space-y-10 md:space-y-margin">
              {DRIFT_LEDGER.map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-margin items-center">
                  <div className={`md:col-span-5 relative ${row.reverse ? "md:order-2" : ""}`}>
                    <div className="aspect-[4/5] rounded-xl overflow-hidden border border-outline-variant/30 bg-secondary/15 relative">
                      <img alt={row.alt} className="absolute inset-0 w-full h-full object-cover grayscale contrast-105" src={row.img} />
                      <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay pointer-events-none"></div>
                    </div>
                    <div className={`hidden md:block absolute w-32 h-32 rounded-xl overflow-hidden border border-outline-variant/40 bg-surface shadow-lg ${row.overlayPos}`}>
                      <img alt="" className="w-full h-full object-cover grayscale contrast-105" src={row.overlay} />
                    </div>
                  </div>
                  <div className={`md:col-span-7 space-y-md ${row.reverse ? "md:order-1 md:pr-md" : "md:pl-md"}`}>
                    <div className="flex items-baseline gap-md flex-wrap">
                      <span className="font-display-lg text-[40px] sm:text-[52px] md:text-[60px] leading-none text-tertiary tabular-nums">{row.pct}</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{row.label}</span>
                    </div>
                    <h3 className="font-headline-h2 text-[24px] leading-tight text-on-background sm:text-[28px] md:text-headline-h2">{row.name}</h3>
                    <p className="font-body-main text-body-main text-on-surface-variant">{row.body}</p>
                    <dl className="grid grid-cols-2 gap-sm border-t border-outline-variant/40 pt-md">
                      <div><dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Role</dt><dd className="font-body-main text-body-main text-on-background">{row.role}</dd></div>
                      <div><dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Provenance</dt><dd className="font-body-main text-body-main text-on-background">{row.origin}</dd></div>
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Clinical evidence — 4-stat doctrine + methodology disclosure (content section, no image) */}
          <section id="science" className="bg-surface-container-high rounded-xl border border-outline-variant/30 p-6 sm:p-10 md:p-xl space-y-10 md:space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-end">
              <div className="md:col-span-7 space-y-base">
                <span className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest">IV — Backed by data</span>
                <h2 className="font-headline-h1 text-[28px] leading-tight text-on-background sm:text-[36px] md:text-headline-h1">Evidence, plainly stated.</h2>
              </div>
              <div className="md:col-span-5">
                <p className="font-body-main text-body-main text-on-surface-variant">A double-blind crossover read across 127 adult subjects, conducted by an independent ISO·17025 lab between November 2023 and February 2024.</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md md:divide-x md:divide-outline-variant/40 border-t border-b border-outline-variant/40 py-10 md:py-lg">
              {DRIFT_STATS.map((s) => (
                <div key={s.l} className="px-sm md:px-md space-y-base">
                  <dt className="font-display-lg text-[44px] sm:text-[56px] md:text-[64px] leading-none text-on-background tabular-nums">{s.v}</dt>
                  <dd className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{s.l}</dd>
                </div>
              ))}
            </dl>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md md:gap-margin">
              <div className="space-y-sm">
                <span className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest">Methodology</span>
                <p className="font-headline-h2 italic text-[18px] sm:text-[20px] leading-relaxed text-on-background">Subjects were stratified by baseline cortisol AUC and assigned across two 28-day arms with a 14-day washout. Sleep latency, wake-after-sleep-onset, and morning self-reported alertness were primary outcomes; texture and skin-barrier integrity were secondary.</p>
              </div>
              <div className="space-y-sm">
                <span className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-widest">Disclosure</span>
                <p className="font-headline-h2 italic text-[18px] sm:text-[20px] leading-relaxed text-on-background">No subjects were compensated by Drift. The lab — independent of any retailer — held the unblinding key. Raw data is filed with the European Cosmetics Cluster registry and is available on written request from a credentialed clinician.</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-md flex-wrap pt-md border-t border-outline-variant/40">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">Study · DRF·24·R3 — Read · Feb 2024</span>
              <a className="font-label-caps text-label-caps text-on-background uppercase tracking-widest underline decoration-outline-variant underline-offset-4 hover:decoration-on-background transition-colors" href="#science">Read the full ledger →</a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-stone-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-serif text-xs uppercase tracking-widest w-full mt-16 border-t border-neutral-200 dark:border-neutral-800 ease-in-out duration-200 flex flex-col md:flex-row justify-between items-center py-10 px-4 max-w-7xl mx-auto space-y-6 md:space-y-0 sm:py-12 sm:px-8 sm:mt-20 md:py-16 md:px-16">
          <div className="text-lg font-serif tracking-widest text-neutral-900 dark:text-neutral-50">
            Drift
          </div>
          <div className="flex flex-wrap justify-center gap-md">
            <a className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors" href="#">Privacy</a>
            <a className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors" href="#">Terms</a>
            <a className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors" href="#">Shipping</a>
            <a className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors" href="#">Contact</a>
          </div>
          <div className="text-neutral-400 dark:text-neutral-500 font-body-sm text-body-sm normal-case tracking-normal">
            © 2024 Drift. Clinical Restoration.
          </div>
        </footer>
      </div>
    </>
  );
}

export default SingleProductDtc;
