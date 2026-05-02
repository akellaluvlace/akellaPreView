export default function T82Nonprofit() {
  const navLinks = ["Mission", "Work", "Impact"];

  const stats = [
    { num: "12,400", label: "Acres Protected" },
    { num: "48", label: "Species Monitored" },
    { num: "9", label: "Countries" },
    { num: "2011", label: "Founded" },
  ];

  const projects = [
    {
      tag: "Project 01 — Indonesia",
      title: "Coral Bleaching Survey",
      blurb: "Documenting the unprecedented warming events across the Coral Triangle to establish baseline resiliency data.",
      cap: "Image: Researchers recording temperatures off Raja Ampat.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZkNao5vKoVUEGOpvn2t2bS-lUiPIMzrgPRzugksKPUapw-J0GVheZXQDVhtahmcVwCLGP0BYC6qYqZMno2n4DTAA3P5YIdyJSW8wjEIECSh5Sbprxrl5n7JLukDCLjSJXpy67SeKkyarnZXZatK4qUWg2voXHI_AadmJQ4cfDn5PkK-kzFoFqvy4xOkh-lRAL1ns_fM5_F1t8F8qYoKjUk8hKi0iwWa4RDjlaJ6YxR3L1vuUOdh7Klf5PaG6rHrKzHcUt4o5kbJRf",
      alt: "Marine scientists tagging a turtle",
    },
    {
      tag: "Project 02 — Maldives",
      title: "Manta Ray Migration",
      blurb: "Acoustic tagging program tracking seasonal movements to advocate for protected marine corridors.",
      cap: "Image: Deployment of receiver array at Hanifaru Bay.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfRQhrkmhvTaMtuup4QJeg1SJfVp8tq9ie71EtkC5RZE9rsuC_nWR9giyK7vbp7vezBn7nney28Cw0scq27bCZTMTmxaUsP8tYFG7Y6iXoDw7AMAbeMyNpygORlhji28WTCQ4a3Qiy4aXnH8oaEmcJdoueXbVDHKfoHN7xLVKk8O2u5ilns2-3fthDGdYbr81n9t4soTrzF1J0JMiGoWf9VrzAoIhs-O9uu6tVuZ7NAWTP3ILrN5Hndb0mi6Hj_ooE_dON42d-GjN0",
      alt: "Scientist taking water samples",
      grayscale: true,
    },
    {
      tag: "Project 03 — Philippines",
      title: "Mangrove Restoration",
      blurb: "Community-led initiative restoring vital coastal nurseries that protect against storm surges.",
      cap: "Image: Palawan coastal youth group planting seedlings.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB47LzfwZkvt5_zH0QZw9Obol0K5LYrxROKLU7R4pRdr6oWX9de1TxrfTJD02cDAscyQUQIA64OZnU-jMaDbwgxWX0k12ozEyBJQZhdruebQRUmY7JaR9fQwSnCjy2qJ-OqnmGo_DHiw6BcxFb_YmBRQe5DieXnt4sBOWwMDtZgABvxs0vDfMhG1tfsAxkn02kJ3V_GtgDyKcqnOR07hxt3FRZXe0hiiwyprhe2iimXWAkQhWfeLcUxpklJ_XaLYZrEVJdUHj4uFzfA",
      alt: "Community members planting mangroves",
    },
  ];

  const amounts = ["$25", "$50", "$100", "$250"];
  const orgLinks = ["Mission", "Field Reports", "Scientific Data"];
  const connectLinks = ["Contact", "Transparency"];

  const fieldRegions = [
    { label: "Coral Triangle", count: "04 stations" },
    { label: "W. Indian Ocean", count: "03 stations" },
    { label: "E. Pacific", count: "02 stations" },
  ];

  const voices = [
    {
      name: "Lala Putri",
      role: "Ranger · ID",
      img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=85&auto=format&fit=crop",
      alt: "Marine ranger Lala Putri",
      pos: "md:left-[2%] md:top-[2%] w-[68%] md:w-[42%] -rotate-3 z-10",
    },
    {
      name: "Tomás Ndoye",
      role: "Elder · SN",
      img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=85&auto=format&fit=crop",
      alt: "Community elder Tomás Ndoye",
      pos: "md:left-[36%] md:top-[10%] w-[64%] md:w-[40%] rotate-2 z-20 mt-8 md:mt-0",
    },
    {
      name: "Dr. Anika Reyes",
      role: "Biologist · PH",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85&auto=format&fit=crop",
      alt: "Marine biologist Dr. Anika Reyes",
      pos: "md:left-[8%] md:top-[44%] w-[64%] md:w-[40%] rotate-1 z-20 mt-8 md:mt-0",
    },
    {
      name: "Issa Marwa",
      role: "Volunteer · KE",
      img: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=900&q=85&auto=format&fit=crop",
      alt: "Youth volunteer Issa Marwa",
      pos: "md:left-[42%] md:top-[52%] w-[68%] md:w-[42%] -rotate-2 z-30 mt-8 md:mt-0",
    },
  ];

  const approachItems = [
    { num: "01", title: "Long-term Monitoring", body: "Acoustic arrays, photo-quadrats, and satellite tagging across decade-long baselines.", meta: "Active since 2011 · 240 sites" },
    { num: "02", title: "Community Co-Management", body: "Marine protected areas designed and stewarded with the villages whose livelihoods depend on them.", meta: "14 MPAs · 38 villages" },
    { num: "03", title: "Habitat Restoration", body: "Coral micro-fragmentation, mangrove planting, and seagrass replanting at scale.", meta: "2.1M corals · 9,400 ha mangrove" },
    { num: "04", title: "Policy Translation", body: "Field data turned into legal protections — fishing-zone treaties, vessel speed limits, plastic bans.", meta: "31 statutes informed" },
    { num: "05", title: "Next Generation", body: "Field scholarships for young scientists from coastal communities — paid, mentored, published.", meta: "62 scholars · 19 PhDs" },
  ];

  const finance = [
    { label: "Field research", pct: "62%", w: "62%", barClass: "bg-primary-container" },
    { label: "Community programs", pct: "21%", w: "21%", barClass: "bg-secondary" },
    { label: "Policy & advocacy", pct: "9%", w: "9%", barClass: "bg-on-primary-container" },
    { label: "Operations", pct: "8%", w: "8%", barClass: "bg-outline" },
  ];

  const faqs = [
    { q: "Is my donation tax-deductible?", a: "Yes. The Bluefield Fund is a registered 501(c)(3) public charity (EIN #84-1234567). U.S. donors receive a deductible-gift acknowledgment for every contribution above $25. International donors should consult our partner network in the EU, UK, and Australia." },
    { q: "How is field-research funding allocated?", a: "Sixty-two cents of every dollar funds direct field research — staff scientists, instrument arrays, vessel time, and station operations. The full breakdown is published in Section V above and audited annually by an independent firm." },
    { q: "Can I volunteer in the field?", a: "Field placements run 8–12 weeks and require open-water certification plus a science or community-engagement background. We open eight slots a year, prioritizing applicants from coastal communities adjacent to our partner sites." },
    { q: "Do you accept crypto, stock, or DAF gifts?", a: "Yes — appreciated stock, donor-advised-fund grants, and cryptocurrency (BTC, ETH, USDC) are all accepted. Stock and DAF transfers are processed by our partner foundation; please email development@bluefieldfund.org for routing." },
    { q: "Where do I find your published research?", a: "Field reports, peer-reviewed papers, and open datasets are published quarterly under a CC-BY license. The full archive — 184 reports as of FY24 — is mirrored on our Field Reports page and on the Open Science Framework." },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-container-high": "#eae7e7", "on-primary": "#ffffff",
            "surface-variant": "#e5e2e1", "inverse-primary": "#b2c8ed",
            "on-error": "#ffffff", "on-surface": "#1c1b1b",
            "outline-variant": "#c4c6ce", "inverse-surface": "#313030",
            "inverse-on-surface": "#f3f0ef", "secondary-container": "#fc7368",
            "surface-container-lowest": "#ffffff", "primary-fixed": "#d5e3ff",
            "error-container": "#ffdad6", "on-tertiary-container": "#928977",
            "surface-tint": "#4b5f7f", "on-tertiary-fixed": "#201b0e",
            "surface-container-highest": "#e5e2e1", "on-secondary-container": "#6f080c",
            "secondary-fixed": "#ffdad6", "on-secondary": "#ffffff",
            "on-error-container": "#93000a", "surface-bright": "#fcf9f8",
            "on-tertiary-fixed-variant": "#4d4637", "on-surface-variant": "#44474d",
            "primary-fixed-dim": "#b2c8ed", "surface-container": "#f0eded",
            "tertiary-container": "#282215", "on-secondary-fixed-variant": "#881e1b",
            "tertiary-fixed-dim": "#d0c5b1", "tertiary": "#110c03",
            "on-secondary-fixed": "#410002", "outline": "#74777e",
            "on-tertiary": "#ffffff", "error": "#ba1a1a",
            "surface-container-low": "#f6f3f2", "surface-dim": "#dcd9d9",
            "surface": "#fcf9f8", "primary-container": "#0b2340",
            "background": "#fcf9f8", "on-primary-fixed-variant": "#334866",
            "secondary": "#a93630", "primary": "#000d20",
            "on-background": "#1c1b1b", "on-primary-fixed": "#031c39",
            "secondary-fixed-dim": "#ffb4ac", "tertiary-fixed": "#ede1cc",
            "on-primary-container": "#768bad"
          },
          borderRadius: { DEFAULT: "0px", lg: "0px", xl: "0px", full: "9999px" },
          spacing: {
            margin: "40px", gutter: "24px", sm: "16px", lg: "64px",
            xl: "128px", md: "32px", unit: "4px", xs: "8px"
          },
          fontFamily: {
            "label-caps": ["Inter"], "body-lg": ["Inter"],
            "display-xl": ["Newsreader"], "headline-md": ["Newsreader"],
            "body-md": ["Inter"], "headline-lg": ["Newsreader"]
          },
          fontSize: {
            "label-caps": ["12px", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "700" }],
            "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
            "display-xl": ["72px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
            "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
            "headline-lg": ["48px", { lineHeight: "1.2", fontWeight: "500" }]
          }
        }
      }
    };
  `;

  const customCss = `
    html, body { overflow-x: clip; }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    .full-bleed {
        width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
        max-width: none;
    }
    .diagonal-band { clip-path: polygon(0 0, 100% 6%, 100% 94%, 0 100%); }
    .polaroid {
        background: #fdfaf3;
        padding: 12px 12px 36px 12px;
        box-shadow: 0 18px 36px -12px rgba(11,35,64,0.35), 0 2px 6px rgba(11,35,64,0.18);
    }
    .polaroid::before {
        content: "";
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%) rotate(-3deg);
        width: 64px;
        height: 18px;
        background: rgba(252,115,104,0.55);
        border: 1px solid rgba(252,115,104,0.35);
        box-shadow: 0 1px 0 rgba(0,0,0,0.04);
        pointer-events: none;
    }
    .field-faq summary::-webkit-details-marker { display: none; }
    .field-faq summary { list-style: none; cursor: pointer; }
    .field-faq summary .field-chevron { transition: transform 250ms ease; }
    .field-faq[open] summary .field-chevron { transform: rotate(90deg); }
    @keyframes field-pulse {
        0%, 100% { opacity: 0.65; box-shadow: 0 0 0 0 rgba(252,115,104,0.45); }
        50%      { opacity: 1;    box-shadow: 0 0 0 10px rgba(252,115,104,0); }
    }
    .field-pulse { animation: field-pulse 2.4s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
        .field-faq summary .field-chevron { transition: none; }
        .field-pulse { animation: none; }
    }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="light bg-background text-on-background antialiased selection:bg-primary-container selection:text-surface-container-lowest">
        <header className="bg-[#FDFCF8] w-full top-0 border-b border-[#0B2340]/15 sticky z-50">
          <div className="flex justify-between items-center w-full px-8 md:px-16 py-6 max-w-[1440px] mx-auto">
            <a href="#" className="text-2xl font-bold tracking-tighter text-[#0B2340] uppercase hover:opacity-80 transition-opacity duration-300">
              The Bluefield Fund
            </a>
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((l) => (
                <a key={l} href="#" className="font-['Newsreader'] uppercase tracking-widest text-sm text-[#0B2340]/60 hover:text-[#0B2340] hover:opacity-80 transition-opacity duration-300 py-1">{l}</a>
              ))}
            </nav>
            <button className="bg-primary-container text-surface-container-lowest font-label-caps text-label-caps px-6 py-3 hover:opacity-80 transition-opacity duration-300 uppercase">
              Give
            </button>
          </div>
        </header>

        <section className="relative w-full h-[870px] flex items-center bg-primary-container overflow-hidden">
          <img
            alt="Documentary photograph of a coral reef with a diver in silhouette"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIZlVld3i4SbBupQs5qPifY7W9oeEhp03QGDhFWa4FlZcXWr9aK63KcB1tgEnbq4jd11wqRDY_HzakOfOArD5YMDwWg5AZUgbP_OwCWniEXSvQptrldd9mlb49R15AYfv4CWeWs6eEexdU35IUmE-u_WrUpcqcuB4Q7o68j010MeLgQpXvlj1HtS8QSJUvAdY9JSQJxKw53qIBrxVZidUUu6QVrsyBYChR9xmcoyonLsNSuuu3pjnby0BAIQQ6tTaCQ-5V24InewKS"
          />
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 md:px-16 flex flex-col items-start gap-md">
            <h1 className="font-display-xl text-display-xl text-surface-container-lowest max-w-4xl">Protecting the oceans we depend on</h1>
            <p className="font-body-lg text-body-lg text-surface-container-lowest/90 max-w-2xl">Our mission is to safeguard marine ecosystems through science and community action.</p>
            <div className="flex gap-4 mt-sm">
              <button className="bg-secondary text-surface-container-lowest font-label-caps text-label-caps px-8 py-4 uppercase hover:bg-on-secondary-container transition-colors">Donate now</button>
              <button className="border border-surface-container-lowest text-surface-container-lowest font-label-caps text-label-caps px-8 py-4 uppercase hover:bg-surface-container-lowest/10 transition-colors flex items-center gap-2">
                Learn more
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-surface-container py-xl border-y border-outline/15">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter divide-x divide-outline/15">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center px-4">
                  <span className="font-headline-lg text-headline-lg text-primary-container">{s.num}</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where We Work — diagonal full-width image band (NOVEL pattern 1) */}
        <section className="full-bleed relative bg-primary-container overflow-hidden diagonal-band" style={{ minHeight: "520px" }}>
          <img
            alt="Aerial view of a coastline where the foundation operates field stations"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1920&q=85&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container/85 via-primary-container/40 to-primary-container/70"></div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-8 md:px-16 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7 flex flex-col gap-md">
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim uppercase tracking-[0.3em]">II — The Field</span>
              <h2 className="font-display-xl text-[44px] md:text-[64px] leading-[1.05] tracking-tight text-surface-container-lowest">Where the work takes place.</h2>
              <p className="font-body-lg text-body-lg text-surface-container-lowest/85 max-w-2xl">Nine countries across the Coral Triangle, the Western Indian Ocean, and the Eastern Pacific. Field stations staffed by local marine biologists, ranger teams, and the communities living closest to the reefs they steward.</p>
            </div>
            <div className="md:col-span-5 flex flex-col gap-4 border-l-2 border-secondary-fixed-dim/40 pl-6">
              {fieldRegions.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between border-b border-surface-container-lowest/20 pb-3">
                  <span className="font-label-caps text-label-caps text-surface-container-lowest/70 uppercase">{r.label}</span>
                  <span className="font-headline-md text-headline-md text-surface-container-lowest tabular-nums">{r.count}</span>
                </div>
              ))}
              <a href="#" className="font-label-caps text-label-caps text-secondary-fixed-dim uppercase tracking-widest mt-2 inline-flex items-center gap-2 hover:text-surface-container-lowest transition-colors">
                Field map <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        <section className="py-xl bg-background">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16">
            <div className="flex justify-between items-end mb-lg border-b border-outline/15 pb-4">
              <h2 className="font-headline-md text-headline-md text-primary-container">Our Work</h2>
              <a href="#" className="font-label-caps text-label-caps text-primary-container uppercase hover:opacity-70 transition-opacity flex items-center gap-1">
                View all projects <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              {projects.map((p) => (
                <article key={p.title} className="border border-outline/15 flex flex-col group cursor-pointer hover:border-primary-container transition-colors">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      alt={p.alt}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700${p.grayscale ? " filter grayscale-[20%]" : ""}`}
                      src={p.img}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs tracking-widest">{p.tag}</span>
                    <h3 className="font-headline-md text-headline-md text-primary-container mb-sm text-[24px]">{p.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-md">{p.blurb}</p>
                    <div className="mt-auto pt-sm border-t border-outline/15">
                      <span className="font-body-md text-body-md text-on-surface-variant italic text-sm">{p.cap}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Voices from the Field — polaroid stack (NOVEL pattern 3) */}
        <section className="py-xl bg-surface-container-low border-y border-outline/15 relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              <div className="lg:col-span-4 flex flex-col gap-md lg:sticky lg:top-32">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.3em]">III — Voices</span>
                <h2 className="font-display-xl text-[40px] md:text-[56px] leading-[1.05] tracking-tight text-primary-container">From the field, in their words.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Field rangers, community elders, and the next generation of marine biologists tell us why the work matters. We listen first; the science follows.</p>
                <a href="#" className="font-label-caps text-label-caps text-primary-container uppercase tracking-widest inline-flex items-center gap-2 border-b border-primary-container/40 pb-1 self-start hover:opacity-70 transition-opacity">
                  Read all stories <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
              <div className="lg:col-span-8 relative min-h-[520px] md:min-h-[640px]">
                {voices.map((v) => (
                  <figure key={v.name} className={`polaroid relative absolute ${v.pos}`}>
                    <img alt={v.alt} className="w-full aspect-[3/4] object-cover" src={v.img} />
                    <figcaption className="absolute bottom-2 left-3 right-3 flex items-end justify-between text-primary-container">
                      <span className="font-['Newsreader'] italic text-base">{v.name}</span>
                      <span className="font-label-caps text-[10px] uppercase tracking-widest opacity-70">{v.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach — sticky-photo + scrolling program list (NOVEL pattern 8) */}
        <section className="py-xl bg-background border-b border-outline/15">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16">
            <div className="flex flex-col mb-lg border-b border-outline/15 pb-4">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.3em] mb-2">IV — Approach</span>
              <h2 className="font-headline-md text-headline-md text-primary-container">Five disciplines, one ocean.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-12 items-start">
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
                <figure className="relative">
                  <img
                    alt="Marine biologist Dr. Reyes documenting reef"
                    className="w-full aspect-[4/5] object-cover"
                    src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1000&q=85&auto=format&fit=crop"
                  />
                  <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-surface-container-lowest">
                    <span className="font-['Newsreader'] italic text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Dr. Anika Reyes</span>
                    <span className="font-label-caps text-[10px] uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Lead Scientist</span>
                  </figcaption>
                </figure>
                <p className="font-body-md text-body-md text-on-surface-variant italic mt-4 border-l-2 border-secondary pl-4">"We don't parachute in. Every program runs for a minimum decade because reefs heal on geological time, not grant cycles."</p>
              </div>
              <ol className="md:col-span-7 flex flex-col">
                {approachItems.map((it, i) => (
                  <li key={it.num} className={`grid grid-cols-12 gap-4 py-6 ${i < approachItems.length - 1 ? "border-b border-outline/15" : ""}`}>
                    <span className="col-span-2 font-headline-lg text-[32px] text-secondary tabular-nums leading-none">{it.num}</span>
                    <div className="col-span-10 flex flex-col gap-2">
                      <h3 className="font-headline-md text-[22px] text-primary-container">{it.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{it.body}</p>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{it.meta}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Transparency — image-as-bg under financial breakdown card (NOVEL pattern 6) */}
        <section className="full-bleed relative overflow-hidden" style={{ minHeight: "640px" }}>
          <img
            alt="Open ocean reef footage as backdrop"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1920&q=85&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-primary-container/75"></div>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 0%, rgba(11,35,64,0.55) 80%)" }}></div>
          <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 py-xl">
            <div className="bg-surface-container-lowest/95 backdrop-blur-sm border border-surface-container-lowest/30 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-md border-b border-outline/15 pb-md">
                <div className="flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.3em]">V — Transparency</span>
                  <h2 className="font-headline-md text-headline-md text-primary-container">Where every dollar goes.</h2>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">FY 2024 · Audited</span>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {finance.map((f) => (
                  <div key={f.label} className="flex flex-col gap-2 border-b border-outline/15 pb-4">
                    <div className="flex items-baseline justify-between">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{f.label}</dt>
                      <dd className="font-headline-md text-[24px] text-primary-container tabular-nums">{f.pct}</dd>
                    </div>
                    <div className="h-1.5 bg-surface-container w-full">
                      <div className={`h-full ${f.barClass}`} style={{ width: f.w }}></div>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-md pt-md border-t border-outline/15">
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">FY24 revenue</span>
                  <span className="font-headline-md text-[24px] text-primary-container tabular-nums">$8.4M</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Charity Navigator</span>
                  <span className="font-headline-md text-[24px] text-primary-container">★★★★ Four-star</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Form 990</span>
                  <a href="#" className="font-headline-md text-[24px] text-secondary hover:text-on-secondary-container transition-colors inline-flex items-center gap-2">Download <span className="material-symbols-outlined text-[18px]">arrow_forward</span></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-xl bg-surface-container-high border-y border-outline/15">
          <div className="max-w-4xl mx-auto px-8 md:px-16">
            <div className="bg-surface-container-lowest border border-outline/15 p-8 md:p-12">
              <div className="text-center mb-md border-b border-outline/15 pb-md">
                <h2 className="font-headline-md text-headline-md text-primary-container mb-xs">Support the Mission</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Your contribution directly funds field research and conservation action.</p>
              </div>
              <form className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Select Amount</span>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-primary-container border-outline/30 focus:ring-primary-container focus:ring-offset-0 h-4 w-4" />
                      <span className="font-label-caps text-label-caps text-primary-container uppercase">Make it recurring</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {amounts.map((a) => (
                      <button key={a} type="button" className="border border-outline/30 py-3 font-label-caps text-label-caps hover:border-primary-container hover:bg-surface-container transition-colors focus:border-primary-container focus:bg-primary-container focus:text-surface-container-lowest">
                        {a}
                      </button>
                    ))}
                    <div className="border border-outline/30 relative flex items-center col-span-3 md:col-span-1">
                      <span className="absolute left-3 font-body-md text-on-surface-variant">$</span>
                      <input type="number" placeholder="Custom" className="w-full bg-transparent border-none py-3 pl-8 pr-3 font-label-caps text-label-caps focus:ring-0 placeholder-on-surface-variant/50" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-secondary text-surface-container-lowest font-label-caps text-label-caps py-4 uppercase hover:bg-on-secondary-container transition-colors">
                  Give Now
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ — details accordion (M.7) */}
        <section className="py-xl bg-background border-t border-outline/15">
          <div className="max-w-4xl mx-auto px-8 md:px-16">
            <div className="flex flex-col mb-lg border-b border-outline/15 pb-4">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.3em] mb-2">VI — Questions</span>
              <h2 className="font-headline-md text-headline-md text-primary-container">Frequently asked.</h2>
            </div>
            <div className="divide-y divide-outline/15">
              {faqs.map((f) => (
                <details key={f.q} className="field-faq group py-5">
                  <summary className="flex items-start justify-between gap-6">
                    <h3 className="font-['Newsreader'] text-[22px] text-primary-container leading-snug">{f.q}</h3>
                    <span className="material-symbols-outlined field-chevron text-primary-container text-[24px] mt-1">chevron_right</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-3xl">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-[#0B2340] border-t border-white/10 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 md:px-16 py-20 max-w-[1440px] mx-auto">
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <span className="text-xl font-black text-[#FDFCF8] mb-sm uppercase">The Bluefield Fund</span>
              <p className="font-['Inter'] text-xs uppercase tracking-wider text-[#FDFCF8]/70 mb-md max-w-sm leading-relaxed">
                Dedicated to oceanic preservation through rigorous field science and active community engagement.
              </p>
              <form className="mt-auto w-full max-w-md border-b border-white/20 flex">
                <input type="email" placeholder="SUBSCRIBE FOR FIELD UPDATES" className="bg-transparent border-none w-full text-white font-['Inter'] text-xs uppercase tracking-wider placeholder-white/40 focus:ring-0 p-0 pb-2" />
                <button type="submit" className="text-white pb-2">
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </form>
            </div>
            <div className="col-span-1">
              <span className="font-['Inter'] text-xs uppercase tracking-wider text-white border-b border-white/20 pb-2 block mb-4">Organization</span>
              <ul className="space-y-3">
                {orgLinks.map((l) => (
                  <li key={l}><a href="#" className="font-['Inter'] text-xs uppercase tracking-wider text-[#FDFCF8]/70 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="col-span-1 flex flex-col justify-between">
              <div>
                <span className="font-['Inter'] text-xs uppercase tracking-wider text-white border-b border-white/20 pb-2 block mb-4">Connect</span>
                <ul className="space-y-3 mb-8">
                  {connectLinks.map((l) => (
                    <li key={l}><a href="#" className="font-['Inter'] text-xs uppercase tracking-wider text-[#FDFCF8]/70 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <p className="font-['Inter'] text-xs uppercase tracking-wider text-[#FDFCF8]/50">
                  © 2024 The Bluefield Fund. Dedicated to oceanic preservation.
                </p>
                <p className="font-['Inter'] text-[10px] uppercase tracking-wider text-[#FDFCF8]/30 mt-2">
                  Charity ID: 501(C)(3) #84-1234567
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
