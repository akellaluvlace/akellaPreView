export default function T85CourseEducation() {
  const navLinks = [
    { label: "Business banking", href: "#features" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];

  const trust = [
    { icon: "account_balance", text: "FDIC insured up to $250k" },
    { icon: "verified_user", text: "SOC 2 Type II compliant" },
    { icon: "star", text: "4.9 on Trustpilot" },
  ];

  const tiles = [
    {
      large: true, icon: "payments", title: "Instant Transfers",
      body: "Move money globally with zero latency. Your capital, available immediately whenever opportunity strikes.",
      img: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=800",
      alt: "Modern digital banking interface displayed on a smartphone screen",
    },
    {
      icon: "credit_card", title: "Virtual Cards",
      body: "Generate unlimited virtual cards for distinct vendor expenses with zero friction.",
    },
    {
      icon: "receipt_long", title: "Expense Tracking",
      body: "Automated categorization with AI-powered receipt matching and logging.",
    },
    {
      large: true, icon: "account_balance_wallet", title: "Tax Integration",
      body: "Seamlessly export to preferred accounting software or grant access to CPAs directly from your dashboard.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      alt: "Financial charts, graphs and tax documents being analyzed on a desk",
    },
  ];

  const tiers = [
    {
      name: "Freelance", price: "$0",
      bullets: ["1 Business Account", "Standard Transfers"],
      cta: "Start Free",
    },
    {
      name: "Professional", price: "$15", featured: true,
      bullets: ["3 Business Accounts", "Instant Transfers", "Tax Integrations"],
      cta: "Upgrade to Pro",
    },
    {
      name: "Enterprise", price: "$49",
      bullets: ["Unlimited Accounts", "Dedicated Manager"],
      cta: "Contact Sales",
    },
  ];

  const fields = [
    { col: "md:col-span-7", aspect: "aspect-[4/3] md:aspect-auto md:h-full", num: "Field · 01", title: "The studio · Berlin",     titleSize: "text-xl",  showChip: true,  chip: "Pro", alt: "Concrete facade of a contemporary office building", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1400&auto=format&fit=crop" },
    { col: "md:col-span-5", aspect: "aspect-[4/3] md:aspect-[3/4]",          num: "Field · 02", title: "The HQ · Singapore",      titleSize: "text-xl",  showChip: false, chip: "",    alt: "Brutalist tower against open sky",                  src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=900&auto=format&fit=crop" },
    { col: "md:col-span-4", aspect: "aspect-square",                          num: "Field · 03", title: "The desk · Lisbon",       titleSize: "text-base", showChip: false, chip: "",    alt: "Brass apothecary objects on a deep desk",          src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=900&auto=format&fit=crop" },
    { col: "md:col-span-4", aspect: "aspect-square",                          num: "Field · 04", title: "The atelier · Antwerp",   titleSize: "text-base", showChip: false, chip: "",    alt: "Stripped industrial interior with raw concrete",   src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=900&auto=format&fit=crop" },
    { col: "md:col-span-4", aspect: "aspect-square",                          num: "Field · 05", title: "The bureau · Zürich",     titleSize: "text-base", showChip: false, chip: "",    alt: "Architectural detail of columns and shadow",        src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop" },
  ];

  const cardFeatures = [
    { icon: "bolt",          body: "2.4× rewards on cloud, software, and contractor payouts." },
    { icon: "verified_user", body: "Single-use virtual card numbers per vendor, generated in two taps." },
    { icon: "flight_takeoff",body: "Lounge access in 1,400+ airports, no waiver, no annual cap." },
  ];

  const snapshots = [
    { initials: "RH", name: "Rina Hadid",      meta: "Architect · 3 entities", quote: "Closed three businesses worth of books in an afternoon. The tax export to my CPA used to take a fortnight.", featured: false },
    { initials: "MO", name: "Marcus Okonkwo",  meta: "Consultant · 22 countries", quote: "The card paid for itself in lounge access by month two. The instant transfers paid for it again by month three.", featured: true },
    { initials: "EL", name: "Elena Lyapunov",  meta: "Indie filmmaker · Berlin", quote: "My virtual cards are now named after my projects. Every Friday, I see exactly where the money went, no spreadsheet.", featured: false },
  ];

  const integrations = [
    { icon: "receipt_long",   name: "QuickBooks",   sub: "One-tap export of every transaction with VAT & classification preserved.", api: false },
    { icon: "payments",       name: "Stripe",       sub: "Pull payouts to Ledger the second they clear, with auto reconciliation.", api: false },
    { icon: "contactless",    name: "Apple Pay",    sub: "Provision the Black card to your wallet in 30 seconds, contactless ready.", api: false },
    { icon: "cloud_sync",     name: "Xero",         sub: "Daily ledger sync for cash-basis bookkeeping. Approval inbox, not a spreadsheet.", api: false },
    { icon: "request_quote",  name: "FreshBooks",   sub: "Auto-attach receipts to invoices the moment a payment lands.", api: false },
    { icon: "work",           name: "Bench",        sub: "Hand your year-end folder to your bookkeeper in a single shared link.", api: false },
    { icon: "smart_toy",      name: "Zapier",       sub: "Trigger 6,000+ workflows from any Ledger event with a no-code builder.", api: false },
    { icon: "api",            name: "Open API",     sub: "Roll your own integration. REST + webhooks, signed payloads, sandbox keys.", api: true },
  ];

  const footerLinks = ["Routing number", "FDIC notices", "Privacy Policy", "Terms of Service", "Regulatory Disclosures"];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-secondary-fixed": "#00210c", "surface": "#fbf8fb", "outline-variant": "#c6c6ce",
            "tertiary-fixed": "#d3e4fe", "on-primary-fixed-variant": "#3c4662",
            "on-tertiary-fixed-variant": "#38485d", "on-surface-variant": "#45464d",
            "surface-container-high": "#eae7ea", "tertiary-container": "#0b1c30",
            "surface-container": "#f0edf0", "inverse-surface": "#303032",
            "primary-container": "#101b34", "tertiary": "#000000",
            "on-error": "#ffffff", "inverse-primary": "#bbc6e7",
            "on-secondary": "#ffffff", "secondary": "#006d36",
            "on-primary": "#ffffff", "surface-variant": "#e4e2e4",
            "on-tertiary": "#ffffff", "on-error-container": "#93000a",
            "on-tertiary-fixed": "#0b1c30", "on-surface": "#1b1b1d",
            "secondary-container": "#6dfe9c", "on-secondary-fixed-variant": "#005227",
            "on-primary-container": "#7983a2", "surface-container-lowest": "#ffffff",
            "background": "#fbf8fb", "secondary-fixed": "#6dfe9c",
            "error-container": "#ffdad6", "primary-fixed": "#d9e2ff",
            "surface-container-low": "#f5f3f5", "surface-dim": "#dcd9dc",
            "secondary-fixed-dim": "#4de082", "surface-tint": "#535e7a",
            "primary-fixed-dim": "#bbc6e7", "tertiary-fixed-dim": "#b7c8e1",
            "on-tertiary-container": "#75859d", "surface-bright": "#fbf8fb",
            "surface-container-highest": "#e4e2e4", "on-primary-fixed": "#101b34",
            "primary": "#000000", "outline": "#76777e",
            "on-secondary-container": "#007439", "inverse-on-surface": "#f3f0f2",
            "on-background": "#1b1b1d", "error": "#ba1a1a"
          },
          borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", "2xl": "1rem", full: "9999px" },
          spacing: {
            "stack-sm": "8px", "stack-lg": "32px", "stack-md": "16px",
            unit: "8px", gutter: "24px", margin: "32px", "container-max": "1280px"
          },
          fontFamily: {
            "headline-lg": ["Inter Display", "sans-serif"], "body-md": ["Inter", "sans-serif"],
            "display-lg": ["Inter Display", "sans-serif"], "body-lg": ["Inter", "sans-serif"],
            "body-sm": ["Inter", "sans-serif"], "label-md": ["Inter", "sans-serif"],
            "headline-md": ["Inter Display", "sans-serif"]
          },
          fontSize: {
            "headline-lg": ["clamp(2rem, 4vw + 0.5rem, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
            "body-md": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
            "display-lg": ["clamp(2.5rem, 5vw + 1rem, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "body-lg": ["clamp(1rem, 1.5vw + 0.5rem, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }],
            "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
            "label-md": ["clamp(0.75rem, 1vw + 0.5rem, 0.875rem)", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
            "headline-md": ["clamp(1.25rem, 2vw + 0.5rem, 1.5rem)", { lineHeight: "1.3", fontWeight: "500" }]
          }
        }
      }
    };
  `;

  const customCss = `
    :root { color-scheme: light; }
    ::selection { background-color: #101b34; color: #ffffff; }
    html { scroll-behavior: smooth; scroll-padding-top: 100px; }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-flex; align-items: center; justify-content: center;
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Display:wght@500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="light bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
        <header className="bg-white/90 backdrop-blur-md text-slate-900 font-sans text-sm font-medium tracking-tight fixed top-0 w-full z-50 border-b border-slate-200 shadow-sm transition-colors">
          <nav aria-label="Main Navigation" className="flex justify-between items-center px-6 md:px-8 h-20 max-w-container-max mx-auto w-full">
            <a href="#" className="text-xl font-bold tracking-tighter text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 rounded" aria-label="Ledger Bank Home">Ledger Bank</a>
            <div className="hidden md:flex space-x-8">
              {navLinks.map((l) => (
                <a key={l.label} className="text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 rounded px-2 py-1 -mx-2" href={l.href}>{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <a className="hidden sm:inline-block text-slate-900 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 rounded px-2 py-1" href="#login">Log in</a>
              <button type="button" className="bg-primary-container text-on-primary font-label-md px-5 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-primary-container/90 active:scale-95 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 whitespace-nowrap">Open account</button>
            </div>
          </nav>
        </header>

        <main className="flex-grow pt-[120px] pb-24 md:pb-32">
          <section className="max-w-container-max mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
            <div className="space-y-stack-md pr-0 lg:pr-8 text-center lg:text-left">
              <h1 className="font-display-lg text-display-lg text-primary-container text-balance">Banking built for the self-employed</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[65ch] mx-auto lg:mx-0 text-pretty">
                Manage your business finances with precision. No hidden fees, seamless tax integration, and a premium card that matches your ambition.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-4">
                <button type="button" className="bg-primary-container text-on-primary font-label-md px-8 py-4 rounded-full shadow-[0px_4px_20px_rgba(15,26,51,0.15)] hover:shadow-[0px_6px_24px_rgba(15,26,51,0.2)] hover:bg-primary-container/90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2">Open an account</button>
                <a href="#features" className="text-on-surface-variant font-label-md px-8 py-4 border border-outline-variant rounded-full hover:bg-surface-container-low active:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 flex items-center justify-center">Explore features</a>
              </div>
            </div>
            <div className="relative w-full aspect-video bg-surface-container rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] isolate">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/-EoNrg_DR3s"
                title="YouTube video player"
                loading="lazy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          <section className="border-y border-surface-variant bg-surface py-8 mb-24 md:mb-32">
            <div className="max-w-container-max mx-auto px-6 md:px-8 flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-16 items-center text-on-surface-variant font-body-sm opacity-80">
              {trust.map((t) => (
                <div key={t.text} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{t.icon}</span>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="max-w-container-max mx-auto px-6 md:px-8 mb-24 md:mb-32 scroll-mt-32">
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-stack-lg text-center text-balance">Engineered for clarity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {tiles.map((t) => (
                <div
                  key={t.title}
                  className={`${t.large ? "md:col-span-2 group " : ""}bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,26,51,0.04)] border border-surface-container p-6 md:p-8 flex flex-col ${t.large ? "justify-between" : "justify-start"} min-h-[300px] transition-shadow hover:shadow-[0px_8px_30px_rgba(15,26,51,0.08)]`}
                >
                  <div className={`space-y-stack-sm${t.large ? " mb-8" : ""}`}>
                    <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary-container mb-4">
                      <span className="material-symbols-outlined" aria-hidden="true">{t.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary-container">{t.title}</h3>
                    <p className={`font-body-md text-body-md text-on-surface-variant${t.large ? " max-w-[65ch]" : ""} text-pretty`}>{t.body}</p>
                  </div>
                  {t.large && (
                    <div className="h-48 md:h-64 bg-surface-container-low rounded-xl border border-surface-variant relative overflow-hidden">
                      <img src={t.img} alt={t.alt} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 via-primary-container/20 to-transparent mix-blend-multiply pointer-events-none"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Built for the Ambitious — image strip */}
          <section className="max-w-container-max mx-auto px-6 md:px-8 mb-24 md:mb-32">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <span className="font-label-md text-label-md uppercase tracking-widest text-secondary mb-3 inline-block">Field Notes · Vol. 04</span>
                <h2 className="font-headline-lg text-headline-lg text-primary-container text-balance">Built for the way you work.</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md md:text-right">From studio rentals to cross-border consultancies — Ledger keeps the books steady wherever you set up shop.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
              {fields.map(f => (
                <figure key={f.num} className={`${f.col} ${f.aspect} relative overflow-hidden rounded-2xl bg-surface-container group border border-surface-container`}>
                  <img alt={f.alt} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" src={f.src} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-container/85 via-primary-container/15 to-transparent" />
                  <figcaption className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                    <div>
                      <span className="block font-label-md text-label-md uppercase text-secondary-fixed-dim">{f.num}</span>
                      <span className={`block font-headline-md ${f.titleSize} text-white mt-1`}>{f.title}</span>
                    </div>
                    {f.showChip && <span className="bg-secondary-fixed text-primary-container font-label-md uppercase tracking-wider px-3 py-1 rounded-full text-[10px]">{f.chip}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* The Card */}
          <section className="max-w-container-max mx-auto px-6 md:px-8 mb-24 md:mb-32">
            <div className="bg-primary-container rounded-2xl overflow-hidden text-white relative">
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-fixed/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-32 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12 lg:p-16 relative">
                <div className="relative aspect-[1.586/1] w-full max-w-md mx-auto lg:mx-0 lg:max-w-none rounded-2xl border border-on-primary-fixed-variant overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-700"
                     style={{ background: "radial-gradient(circle at 18% 20%, rgba(109,254,156,0.18), transparent 35%), radial-gradient(circle at 90% 90%, rgba(109,254,156,0.12), transparent 40%), linear-gradient(135deg, #16223d 0%, #101b34 60%, #060c1e 100%)" }}>
                  <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: "linear-gradient(115deg, transparent 60%, rgba(255,255,255,0.04) 60.5%, transparent 64%)" }} />
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <span className="font-label-md text-label-md uppercase tracking-widest text-secondary-fixed">Ledger · Black</span>
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-secondary-fixed via-secondary-fixed-dim to-secondary border border-white/20" />
                  </div>
                  <div className="absolute bottom-16 left-6 right-6 font-mono text-lg md:text-xl text-secondary-fixed tracking-[0.25em] tabular-nums">4929 · 0246 · 1183 · 0019</div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end font-label-md text-label-md uppercase tracking-widest text-white/80">
                    <div>
                      <p className="opacity-60 text-[10px]">Cardholder</p>
                      <p className="text-white">A. PARTNER</p>
                    </div>
                    <div className="text-right">
                      <p className="opacity-60 text-[10px]">Valid thru</p>
                      <p className="text-white tabular-nums">11 / 28</p>
                    </div>
                    <div className="text-right">
                      <p className="opacity-60 text-[10px]">Network</p>
                      <p className="text-white">Premium</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-stack-md">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-secondary-fixed">— The Card</span>
                  <h2 className="font-display-lg text-display-lg text-white text-balance">Black, glass, and earned.</h2>
                  <p className="font-body-md text-body-md text-primary-fixed-dim max-w-md">Solid metal, edge-lit phosphor green, and zero foreign-transaction fees. Issued only to Professional and Enterprise accounts in good standing for 90 days.</p>
                  <ul className="space-y-3 pt-4">
                    {cardFeatures.map(f => (
                      <li key={f.icon} className="flex items-start gap-3 text-white">
                        <span className="material-symbols-outlined text-secondary-fixed text-[20px] mt-0.5">{f.icon}</span>
                        <span className="font-body-md text-body-md">{f.body}</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="bg-secondary-fixed text-primary-container font-label-md px-8 py-4 rounded-full hover:brightness-110 active:scale-95 transition-all mt-4 inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(109,254,156,0.25)]">
                    Request the card
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim/70">Subject to credit review. No annual fee on Professional · $250 on Enterprise.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Snapshots */}
          <section className="max-w-container-max mx-auto px-6 md:px-8 mb-24 md:mb-32">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="font-label-md text-label-md uppercase tracking-widest text-secondary mb-3 inline-block">— Customer Snapshots</span>
                <h2 className="font-headline-lg text-headline-lg text-primary-container">Words from the operators.</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md md:text-right">Verified Trustpilot reviews from self-employed account holders, lightly edited for length.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {snapshots.map(s => (
                <figure key={s.initials} className={s.featured
                  ? "bg-primary-container rounded-2xl border border-on-primary-fixed-variant shadow-[0_30px_60px_-20px_rgba(15,26,51,0.4)] p-8 flex flex-col gap-6 md:-translate-y-3"
                  : "bg-white rounded-2xl border border-surface-container shadow-[0px_4px_20px_rgba(15,26,51,0.04)] p-8 flex flex-col gap-6 hover:shadow-[0px_8px_30px_rgba(15,26,51,0.08)] transition-shadow"}>
                  <div className={`flex gap-1 ${s.featured ? "text-secondary-fixed" : "text-secondary-fixed-dim"}`}>
                    {[0, 1, 2, 3, 4].map(i => <span key={i} className="material-symbols-outlined text-[18px]">star</span>)}
                  </div>
                  <blockquote className={`font-headline-md text-lg leading-snug ${s.featured ? "text-white" : "text-primary-container"}`}>"{s.quote}"</blockquote>
                  <figcaption className={`mt-auto pt-6 border-t flex items-center gap-3 ${s.featured ? "border-on-primary-fixed-variant" : "border-surface-container"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-headline-md font-semibold ${s.featured ? "bg-secondary-fixed text-primary-container" : "bg-primary-container text-secondary-fixed"}`}>{s.initials}</div>
                    <div>
                      <p className={`font-body-md text-body-md font-medium leading-tight ${s.featured ? "text-white" : "text-primary-container"}`}>{s.name}</p>
                      <p className={`font-body-sm text-body-sm mt-0.5 ${s.featured ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}>{s.meta}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Connected Stack — integrations */}
          <section className="max-w-container-max mx-auto px-6 md:px-8 mb-24 md:mb-32">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="font-label-md text-label-md uppercase tracking-widest text-secondary mb-3 inline-block">— Connected Stack</span>
                <h2 className="font-headline-lg text-headline-lg text-primary-container">Plays well with the tools you already use.</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md md:text-right">Native two-way sync with the eight most-loved apps in the small-business stack. No webhook rigging, no Zapier glue.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {integrations.map(i => (
                <a key={i.name} href="#" className={i.api
                  ? "bg-primary-container rounded-2xl border border-on-primary-fixed-variant p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform group text-white"
                  : "bg-white rounded-2xl border border-surface-container p-6 flex flex-col gap-3 hover:border-outline-variant hover:-translate-y-1 transition-all group"}>
                  <div className={i.api
                    ? "w-12 h-12 bg-secondary-fixed/15 rounded-full flex items-center justify-center text-secondary-fixed"
                    : "w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-secondary-fixed transition-colors"}>
                    <span className="material-symbols-outlined">{i.icon}</span>
                  </div>
                  <p className={`font-headline-md text-lg ${i.api ? "text-white" : "text-primary-container"}`}>{i.name}</p>
                  <p className={`font-body-sm text-body-sm ${i.api ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}>{i.sub}</p>
                </a>
              ))}
            </div>
          </section>

          <section id="pricing" className="max-w-container-max mx-auto px-6 md:px-8 mb-12 scroll-mt-32">
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-stack-lg text-center text-balance">Transparent Economics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-gutter items-stretch">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={
                    t.featured
                      ? "bg-primary-container rounded-2xl shadow-2xl border border-on-primary-fixed-variant p-8 flex flex-col relative lg:transform lg:scale-105 z-10 h-full"
                      : "bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,26,51,0.04)] border border-surface-container p-8 flex flex-col h-full hover:border-outline-variant transition-colors"
                  }
                >
                  {t.featured && (
                    <div className="absolute top-0 right-0 bg-secondary-fixed text-primary-container font-label-md px-4 py-1.5 rounded-bl-xl rounded-tr-2xl text-[10px] uppercase tracking-wider font-bold">
                      Most Popular
                    </div>
                  )}
                  <h3 className={`font-headline-md text-headline-md mb-2 ${t.featured ? "text-white" : "text-primary-container"}`}>{t.name}</h3>
                  <div className={`font-display-lg text-display-lg mb-8 tabular-nums tracking-tight ${t.featured ? "text-white" : "text-on-surface"}`}>
                    {t.price}
                    <span className={`font-body-sm text-body-sm font-normal ${t.featured ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}>/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow" role="list">
                    {t.bullets.map((b) => (
                      <li key={b} className={`flex items-center gap-3 font-body-sm ${t.featured ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}>
                        <span className={`material-symbols-outlined text-[18px] ${t.featured ? "text-secondary-fixed" : "text-secondary-fixed-dim"}`} aria-hidden="true">check</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={
                      t.featured
                        ? "w-full py-3 bg-secondary-fixed text-primary-container rounded-full font-label-md hover:bg-secondary-fixed/90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-primary-container mt-auto"
                        : "w-full py-3 border border-outline-variant rounded-full text-primary-container font-label-md hover:bg-surface-container-low active:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 mt-auto"
                    }
                  >
                    {t.cta}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="bg-slate-50 w-full border-t border-slate-200 text-xs font-normal leading-relaxed text-slate-500">
          <div className="max-w-container-max mx-auto px-6 md:px-8 py-12 md:py-16 grid grid-cols-1 gap-8 divide-y divide-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 gap-6 md:gap-0">
              <div className="text-lg font-bold text-slate-900">Ledger Bank</div>
              <nav aria-label="Footer Navigation" className="flex flex-wrap gap-4 md:gap-6">
                {footerLinks.map((l) => (
                  <a key={l} href="#" className="text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 rounded py-1">{l}</a>
                ))}
              </nav>
            </div>
            <div className="pt-8">© 2024 Ledger Bank. Member FDIC. Equal Housing Lender.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
