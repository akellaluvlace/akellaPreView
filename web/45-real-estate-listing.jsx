export default function T45RealEstateListing() {
  const navLinks = [
    { label: "Properties", href: "#", active: true },
    { label: "Advisory", href: "#" },
    { label: "Heritage", href: "#" },
    { label: "Contact", href: "#" }
  ];

  const features = [
    { label: "Period Details", value: "Original cornicing" },
    { label: "Outdoor Space", value: "West-facing garden" },
    { label: "Convenience", value: "Private parking" },
    { label: "Energy", value: "B2 BER Rating" }
  ];

  const gallery = [
    { alt: "Grand living room with high ceilings, original fireplace, and contemporary furniture", className: "md:col-span-2 md:row-span-2 relative group overflow-hidden", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZmkbY5cKTlmMdt0FTTpAVcLFZKBFYVTEc6-JXDG4195Z3CsSaMllXA6__fLeLD7TFT-Nnk0irTumcoD_BWSnNqh3hVoxzTR3tUglaXJWRuPFUaGS89qUvGNeqFQlzXEV9Vlh5tK1oodymL3A_V3Nl-SL9RJH-u-u3_RYFoH1EhBYHmeX6ygHM0wGsNyoXn3AypRcjg8-5QeBIwb_QolQgk2F02-rLsjlhxFw6USXdL21veXtcjgWpgH1FGEUJEJ6ZFj2aEv17T3NN" },
    { alt: "Bespoke modern kitchen with marble island", className: "relative group overflow-hidden", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBa9oSyyxrky5TgD48ENsZAhSflbGwr7dmSB8X9IUVF6IgEQMhSuC1q8riAqMKopgOIJwGkegBxfhNlFYVBIC7ITcG9lanXoJKH3_OUdSew-mErERag5LIK7vMZEXujVekqqdI76Vnv_OFdUCLg7nXBhOXHlfOE2Spt216LiiimYH50Q6uRDRjNpDLJxVpcBQw83iaU3o18bz-J3-33FHM5-wKbX711xt-WCfB39-Ap4ouXZxbMpIy8QCZLNdB6Hi6TEgtQmbjU21AV" },
    { alt: "Master suite detail", className: "relative group overflow-hidden", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2cEXZqbbZS_gjQzQatn5n-8WfkgM8pEKszYJlMfGqkBlV2yEo20IFy66_E5pF0nDdS0RM3ojM7mr97agzjjbzg-X6MQMg1QYJJgX2qskSjbl18h35d6d0DPjS07b8L4qTMsn48j54mEXopJsAOdsZIJUpLJ82xYGmkwHJkYgv6kem2KoRv3BFjnyDOrtlNfvLy07pDID65AhbOC-nKWCrFXyftXSGDVyl5LdeP2SZcC7TQgSg3QnrDlo-cO2isp8muPYVH2196rcA" },
    { alt: "West facing landscaped garden", className: "md:col-span-2 md:row-span-1 relative group overflow-hidden", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKEB1FLjdNLLGcqp2soK5e-PMpxSEE_0GunYsFWQThRjDOyvgTtF58EojuMzJWgapjOAobTZHbCnoVBZwam3S6K1s5TJ6CcXWECE7gBpijjhfz3AB1igJIOgmJajaC_BdqMjMQHiIEbAWu2Q_Q8HZD9AmRYy80FpqU3GZ55hp6WhljXZ52P41gYJqjr7xqLsjivbX8LODcL8w8qmQgGhNAsuku9IPVsvpzkhPWrC40EvH5lkcX6EpODbtUpCEQzEHIXxVQMuXZ-pzq" },
    { alt: "Bathroom detail", className: "relative group overflow-hidden", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA27MDuRqQSAtKLW680-4T27KQ_w-sjzgKT7vsMRpPBZHkRI2mmTye4Rux2gyTs2iaiS6Vs8y280D_j_rWsEgZh2z9MuVJSOo9q8sFGeQFEpA70DYMxMKAGFCq-vHnbBayrTvTVP0K6igN9DJa1Lr1KOGT5yX68IfTwvLLpn5NnO77-zdc5bKTPqAQ8KBX3KfN5WzNRAXXwR-wIpxhxGS-HibOKrhdetZwK0ItuYyOFOgC2cWc2YXd-HXSz9x6N0YvERHtAQRONjPz" }
  ];

  const footerLegal = ["Privacy Policy", "Terms of Service", "Accessibility", "Cookie Policy"];

  const stackRows = [
    {
      plate: "I",
      caption: "I · Exterior · Grosvenor Facade · 1875",
      aspect: "aspect-[16/9]",
      alt: "Heritage exterior elevation of a classical European townhouse",
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85&auto=format&fit=crop"
    },
    {
      plate: "II",
      caption: "II · Piano Nobile · Drawing Room",
      aspect: "aspect-[21/9]",
      alt: "Light-filled interior salon with classical proportions",
      src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1920&q=85&auto=format&fit=crop"
    },
    {
      plate: "III",
      caption: "III · Rear Mews · Garden Entrance",
      aspect: "aspect-[16/9]",
      alt: "Rear mews staircase and private garden entrance in soft daylight",
      src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=1920&q=85&auto=format&fit=crop"
    }
  ];

  const provenance = [
    {
      year: "1875",
      title: "Built for the Whitcombe family",
      body: "Commissioned in early 1873 from the Dublin practice of Tate & Hennessy, completed two winters later. The original sash glazing remains intact across the principal facade.",
      last: false
    },
    {
      year: "1924",
      title: "Acquired by Lord Sturridge",
      body: "Held by the family in continuous occupation through the inter-war and post-war decades. The first-floor library and its hand-leaded bookcases date from this stewardship.",
      last: false
    },
    {
      year: "1982",
      title: "Listed Grade II — Heritage Council",
      body: "Façade, fanlight, plasterwork, and original Portland-stone door surround all designated. Subsequent works conducted under conservation supervision.",
      last: false
    },
    {
      year: "2024",
      title: "Discreetly available — by introduction only",
      body: "Following a five-year programme of conservation-led restoration, the residence is offered to a private purchaser through Aurelian & Co. Off-market viewings on application.",
      last: true
    }
  ];

  const specs = [
    { label: "Bedrooms", value: "Five" },
    { label: "Bathrooms", value: "Four (incl. en-suite)" },
    { label: "Reception Rooms", value: "Three" },
    { label: "Total Internal Area", value: "3,337 sq ft · 310 sq m" },
    { label: "Lot Size", value: "0.18 acres" },
    { label: "Year Built", value: "1875" },
    { label: "Tenure", value: "Freehold" },
    { label: "Listing Class", value: "Grade II Listed" },
    { label: "EPC Rating", value: "B2 · 78" },
    { label: "Council Tax Band", value: "Band H" },
    { label: "Annual Service Charge", value: "Not applicable" },
    { label: "Parking", value: "Private gated · two cars" },
    { label: "Aspect", value: "South-east principal · west garden" },
    { label: "Guide Price", value: "€1,850,000" }
  ];

  const neighbourhood = [
    { name: "Hyde Park", time: "4 min walk" },
    { name: "South Audley Street", time: "2 min" },
    { name: "Connaught Hotel", time: "6 min" },
    { name: "Mount Street Gardens", time: "3 min" },
    { name: "Bond Street Underground", time: "7 min" }
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "background": "#fbf9fa", "on-background": "#1b1c1d",
                "surface": "#fbf9fa", "surface-bright": "#fbf9fa", "surface-dim": "#dbd9db", "surface-variant": "#e4e2e3",
                "surface-container-lowest": "#ffffff", "surface-container-low": "#f5f3f4", "surface-container": "#efedef", "surface-container-high": "#e9e7e9", "surface-container-highest": "#e4e2e3",
                "on-surface": "#1b1c1d", "on-surface-variant": "#44474c",
                "primary": "#041627", "on-primary": "#ffffff", "primary-container": "#1a2b3c", "on-primary-container": "#8192a7", "primary-fixed": "#d2e4fb", "primary-fixed-dim": "#b7c8de", "on-primary-fixed": "#0b1d2d", "on-primary-fixed-variant": "#38485a",
                "secondary": "#605e58", "on-secondary": "#ffffff", "secondary-container": "#e6e2da", "on-secondary-container": "#66645e", "secondary-fixed": "#e6e2da", "secondary-fixed-dim": "#c9c6bf", "on-secondary-fixed": "#1c1c17", "on-secondary-fixed-variant": "#484741",
                "tertiary": "#211200", "on-tertiary": "#ffffff", "tertiary-container": "#38260b", "on-tertiary-container": "#a88c69", "tertiary-fixed": "#feddb5", "tertiary-fixed-dim": "#e1c29b", "on-tertiary-fixed": "#281802", "on-tertiary-fixed-variant": "#584326",
                "error": "#ba1a1a", "on-error": "#ffffff", "error-container": "#ffdad6", "on-error-container": "#93000a",
                "outline": "#74777d", "outline-variant": "#c4c6cd", "surface-tint": "#4f6073", "inverse-surface": "#303032", "inverse-on-surface": "#f2f0f2", "inverse-primary": "#b7c8de"
              },
              spacing: {
                "stack-sm": "12px",
                "stack-md": "24px",
                "stack-lg": "48px",
                "margin-edge": "64px",
                gutter: "32px",
                "container-max": "1440px",
                "section-gap": "128px",
                unit: "8px"
              },
              fontFamily: {
                "headline-md": ["Noto Serif"],
                "headline-lg": ["Noto Serif"],
                "address-label": ["Noto Serif"],
                "display-xl": ["Noto Serif"],
                "body-lg": ["Inter"],
                "body-md": ["Inter"],
                caption: ["Inter"],
                "ui-label": ["Inter"]
              },
              fontSize: {
                "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "400" }],
                "headline-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
                "address-label": ["24px", { lineHeight: "1.4", fontWeight: "400" }],
                "display-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
                "ui-label": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }]
              }
            }
          }
        };
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
          font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      ` }} />

      <div className="light bg-[#FAF6EE] text-[#1A2B3C] antialiased selection:bg-[#B8904A] selection:text-white">
        {/* TopAppBar */}
        <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200 transition-transform scale-100 active:scale-95">
          <div className="flex justify-between items-center w-full px-16 py-6 max-w-[1440px] mx-auto">
            <a className="text-2xl font-serif tracking-tight text-slate-900" href="#">AURELIAN &amp; CO.</a>
            <div className="hidden md:flex gap-8 items-center">
              {navLinks.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className={
                    l.active
                      ? "font-ui-label text-ui-label uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1"
                      : "font-ui-label text-ui-label uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors duration-300"
                  }
                >
                  {l.label}
                </a>
              ))}
            </div>
            <button className="hidden md:block bg-primary text-white font-ui-label text-ui-label uppercase tracking-widest px-6 py-3 rounded hover:bg-slate-800 transition-colors">
              Book Viewing
            </button>
            <button className="md:hidden">
              <span className="material-symbols-outlined text-slate-900">menu</span>
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative h-screen w-full pt-24">
          <div className="absolute inset-0 z-0">
            <img alt="Georgian townhouse exterior at dusk with warm interior lighting and classic brick facade" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-771ofPprRqD2hyyiRLc_U74mhKdV3cwNQhqGf5riPiS4lTdHms3SJBGx59wViyfSMKdA2-G6Tf1TXbK-dNB76qf-gyyhG1klFg6Mw59jWQZtx1G_hzEP2YZjzVtztVDN2SvuM_Xh-aa9BhmCuRPM9JUoV_svZz8BXiUfddesnTpaNIGypBCmtG0G3wd8C9xUxYK7NvC1EusiEsxhev87AN5l3xqcnpEGH-DFlMlcQ2hyKtOCHqADKGbUhHvt5W-uVpoh42gA99ZD" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B3C]/80 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full p-margin-edge z-10 flex flex-col md:flex-row justify-between items-end gap-stack-lg max-w-container-max">
            <div className="text-white">
              <h1 className="font-display-xl text-display-xl mb-stack-sm text-white">42 Grosvenor Square</h1>
              <p className="font-body-lg text-body-lg text-white/90">5 bed · 4 bath · 310 sqm · €1,850,000</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-[#B8904A] text-white font-ui-label text-ui-label uppercase tracking-widest px-8 py-4 rounded hover:bg-[#a88241] transition-colors whitespace-nowrap">
                Book a viewing
              </button>
              <button className="bg-transparent border border-white text-white font-ui-label text-ui-label uppercase tracking-widest px-8 py-4 rounded hover:bg-white/10 transition-colors whitespace-nowrap">
                Download brochure
              </button>
            </div>
          </div>
        </section>

        {/* Content Canvas */}
        <main className="max-w-container-max mx-auto px-margin-edge py-section-gap space-y-section-gap">
          {/* About & Specs */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-7 space-y-stack-md">
              <h2 className="font-headline-lg text-headline-lg">A Masterpiece of Georgian Elegance</h2>
              <div className="font-body-lg text-body-lg space-y-4 text-on-surface-variant">
                <p>Situated in the prestigious enclave of Dublin 4, 42 Grosvenor Square represents a rare opportunity to acquire a meticulously restored piece of architectural history. This imposing residence perfectly balances its grand heritage with contemporary luxury living.</p>
                <p>The property unfolds over four magnificent levels, characterized by soaring ceiling heights, intricate original cornicing, and an abundance of natural light pouring through magnificent sash windows. The recent renovation has thoughtfully integrated modern technological conveniences without compromising the home's historic integrity.</p>
              </div>
            </div>
            <div className="md:col-span-4 md:col-start-9 space-y-stack-md">
              <h3 className="font-ui-label text-ui-label uppercase tracking-widest text-[#B8904A] border-b border-[#1A2B3C]/20 pb-2">Key Features</h3>
              <ul className="space-y-4">
                {features.map(f => (
                  <li key={f.label} className="flex justify-between items-end border-b border-[#1A2B3C]/10 pb-2">
                    <span className="font-ui-label text-ui-label uppercase text-on-surface-variant">{f.label}</span>
                    <span className="font-headline-md text-headline-md text-sm">{f.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Gallery */}
          <section>
            <h3 className="font-ui-label text-ui-label uppercase tracking-widest text-[#B8904A] mb-stack-md">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-unit h-[800px]">
              {gallery.map(g => (
                <div key={g.alt} className={g.className}>
                  <img alt={g.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={g.src} />
                </div>
              ))}
              <div className="relative group overflow-hidden bg-primary flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors">
                <span className="font-ui-label text-ui-label text-white uppercase tracking-widest flex items-center gap-2">
                  View All 12 Photos
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </div>
            </div>
          </section>

          {/* Three-Row Image Stack: Studies in Form */}
          <section className="space-y-stack-lg">
            <div className="flex items-end justify-between border-b border-[#1A2B3C]/15 pb-stack-md">
              <div>
                <p className="font-ui-label text-ui-label uppercase tracking-widest text-[#B8904A] mb-stack-sm">Folio · 003</p>
                <h2 className="font-headline-lg text-headline-lg">Three Studies of the House</h2>
              </div>
              <p className="hidden md:block font-serif italic text-on-surface-variant max-w-sm">A measured portrait of the residence — facade, piano nobile, and rear mews — recorded in three sequential views.</p>
            </div>
            {stackRows.map(row => (
              <figure key={row.plate} className="space-y-stack-sm">
                <div className={`relative w-full ${row.aspect} overflow-hidden bg-surface-container-high`}>
                  <img alt={row.alt} className="absolute inset-0 w-full h-full object-cover" src={row.src} />
                </div>
                <figcaption className="flex items-center justify-between font-ui-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">
                  <span>{row.caption}</span>
                  <span className="text-[#B8904A]">— PLATE {row.plate}</span>
                </figcaption>
              </figure>
            ))}
          </section>

          {/* Provenance Timeline */}
          <section className="bg-surface-container-low -mx-margin-edge px-margin-edge py-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-4 space-y-stack-md">
                <p className="font-ui-label text-ui-label uppercase tracking-widest text-[#B8904A]">Folio · 004</p>
                <h2 className="font-headline-lg text-headline-lg">A Provenance, Quietly Kept</h2>
                <p className="font-serif italic text-on-surface-variant text-body-md">Four owners across one hundred and forty-nine years. Each chapter recorded in the deeds at the Probate Office, Henrietta Street.</p>
                <div className="relative aspect-[4/5] overflow-hidden border border-[#1A2B3C]/15">
                  <img alt="Archival interior detail of cornicing and shutter" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&q=85&auto=format&fit=crop" />
                </div>
              </div>
              <ol className="md:col-span-7 md:col-start-6 space-y-stack-lg">
                {provenance.map(p => (
                  <li key={p.year} className={`grid grid-cols-12 gap-gutter ${p.last ? "pb-stack-md" : "border-b border-[#1A2B3C]/15 pb-stack-md"}`}>
                    <div className="col-span-3"><span className="font-serif italic text-headline-md text-headline-md text-[#B8904A]">{p.year}</span></div>
                    <div className="col-span-9 space-y-stack-sm">
                      <h3 className="font-headline-md text-headline-md">{p.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Specification Sheet */}
          <section className="bg-surface-container-high -mx-margin-edge px-margin-edge py-section-gap">
            <div className="max-w-container-max mx-auto space-y-stack-lg">
              <div className="flex items-end justify-between border-b border-[#1A2B3C]/15 pb-stack-md">
                <div>
                  <p className="font-ui-label text-ui-label uppercase tracking-widest text-[#B8904A] mb-stack-sm">Folio · 005</p>
                  <h2 className="font-headline-lg text-headline-lg">Specification</h2>
                </div>
                <p className="hidden md:block font-serif italic text-on-surface-variant">Issued under Reference AC-GS-42 / 2024</p>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-section-gap">
                {specs.map(s => (
                  <div key={s.label} className="flex items-baseline justify-between border-b border-[#1A2B3C]/15 py-stack-md gap-stack-md">
                    <dt className="font-ui-label text-ui-label uppercase tracking-widest text-on-surface-variant">{s.label}</dt>
                    <dd className="font-serif text-headline-md">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Within Five Minutes */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-7 relative">
              <div className="relative aspect-[4/3] overflow-hidden border border-[#1A2B3C]/15">
                <img alt="Heritage district streetscape with classical facades" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=1600&q=85&auto=format&fit=crop" />
              </div>
              <div className="hidden md:block absolute -bottom-12 -right-8 w-48 h-60 overflow-hidden border-4 border-background shadow-2xl rotate-2">
                <img alt="Quiet heritage street corner at dusk" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=85&auto=format&fit=crop" />
              </div>
              <div className="hidden md:block absolute top-12 -left-12 w-40 h-32 overflow-hidden border-4 border-background shadow-xl -rotate-3">
                <img alt="Wrought iron gate detail of a heritage residence" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&q=85&auto=format&fit=crop" />
              </div>
            </div>
            <div className="md:col-span-4 md:col-start-9 space-y-stack-md self-center">
              <p className="font-ui-label text-ui-label uppercase tracking-widest text-[#B8904A]">Folio · 006</p>
              <h2 className="font-headline-lg text-headline-lg">Within five minutes</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">A walk through the quiet residential streets of Mayfair places the principal entrances of the West End within reach. The square is bordered by Embassy gardens to the north and the heritage mews to the south.</p>
              <ul className="space-y-stack-sm pt-stack-sm border-t border-[#1A2B3C]/15">
                {neighbourhood.map(n => (
                  <li key={n.name} className="flex items-baseline justify-between">
                    <span className="font-headline-md text-headline-md text-sm">{n.name}</span>
                    <span className="font-ui-label text-ui-label uppercase tracking-widest text-on-surface-variant">{n.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-16 py-24 max-w-[1440px] mx-auto">
            <div className="md:col-span-2 space-y-stack-md">
              <div className="font-serif text-xl uppercase tracking-[0.2em] text-slate-900">AURELIAN &amp; CO.</div>
              <p className="font-serif text-sm italic text-slate-900">© 2024 Aurelian &amp; Co. International Realty. All rights reserved.</p>
            </div>
            <div className="space-y-stack-sm flex flex-col">
              {footerLegal.map(l => (
                <a key={l} className="font-ui-label text-ui-label uppercase text-slate-500 hover:text-slate-900 transition-colors" href="#">{l}</a>
              ))}
            </div>
            <div>
              <button className="bg-primary text-white font-ui-label text-ui-label uppercase tracking-widest px-6 py-3 rounded w-full hover:bg-slate-800 transition-colors">
                Schedule Appointment
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
