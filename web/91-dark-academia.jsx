function DarkAcademia() {
  const marginalia = [
    { label: "Vellum & Sepia", meta: "Restoration Ledger · No. II", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2OCzU3XWvgc9dkwbHMgQQ4y9jwGaRdjOudE--xNEBCCQZmIAFWQByZUOHXXA7IR6mfW8Uxyv1uD_aj_nXdbXn77xori7Ylx_ZAZPaSXilw8sBvr_uIgOrJqFURlDwloU0Bzvbe4lkdb9UKbIIXMcD7X9TrVeobCueFEvzZBxwPBTbdvmJCQvxbJCsZAIbxGWpir5xmuOF-Zt8UyNsJ1NMTjcAkG-4mbxzhPLTreT5-hRsULdWHoceUUOLiqJmzqsnu-iIs5HS-6uH" },
    { label: "Newcastle, c. 1731", meta: "Provenance Note · 014", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9WkrYzItu10hlG6COyZ965tOKglm7AVs_o3kdnpfdsag31atSQ3xwEHm0nuxIGaA9TMs-nKoi6_Q9JLytIyB5xmxEdpb1T-3lRNALKf5ufWBtvn696gqCLugpv0TvN27YVJwBLfg2sKsjM777aDTvHTo1yLNKyc-YYepLu0_jxPNkGWHyPZ6qMUems9zJ-HxNrRaq6ZJSUSM_dvUUIh-p2I-T7-7ezEAaHI1y9yT3HHey6BaLZgCdugZU6HRzdJ1tve-iJ2Jk8Han" },
    { label: "Quarto · No. XII", meta: "Imprint Folio · MMIV", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQMkvanduR0us5h0TEDN3dtAPuU-aB3jpBc5SrjINMBI_SIfi5nh7pmA7wYkGBHOqc2m4dwYauHFGn_0YdsGVxXgpIuzpEx1SNWRy6yEzbzaqf9rcnk_GWrgqCi9aHoFBCKMJXv4TyFUaOzCwepJCo1nRM-Mh6ivPwUAxUtldEom0AgOzUj_e-1ievSCQaSfQdahBgyn8drhyMeIUOs5CGRxRXk2dJIYCxfjxNwPrZXnOjAAhsM3EyIKbX-eeXfNr8j1DsRLDIRVPq" },
    { label: "Florentine Press", meta: "Bookplate · Δ-1612", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80&auto=format&fit=crop" },
    { label: "Earl of Bracknell", meta: "Acquisition · MCMLXXXII", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7dJghdM_Sn7Zs7akejIhwTFN0AU4u_KSqD3DrxFF6JFXLhMZTBTGWVX59ytTKWBi8fIdOKVLhdWUxhoLRE8Mhmte5Uhhth18hCvZB6U9vThF1SF2vIUj1S2ThUSjW12JqlwqO8XjusknX8tDHwUavMRdZE0I2jLxf9t1o1g4UYwVsOuP4vZZmssirLHJ8lk7oFC0Fa6c8h74jM2LOXnwYQhfFai4-gAGnGnznt28Jkp45zoZKzQbU2tNgDvOFKqkywtPDnfxXjo9g" },
    { label: "Reading Room IV", meta: "By Appointment · MMXXIV", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80&auto=format&fit=crop" },
  ];

  const bindings = [
    { span: "lg:col-span-7", aspect: "aspect-[4/3]", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=85&auto=format&fit=crop", chip: "Plate I", title: "The North Reading Room", body: "By appointment · 1st floor", roman: "I" },
    { span: "lg:col-span-5", aspect: "aspect-[4/3]", stretch: true, img: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=1100&q=85&auto=format&fit=crop", chip: "Plate II", title: "Calf, Gilt-Tooled", body: "Rebound · Newcastle, 1731", roman: "II" },
    { span: "lg:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85&auto=format&fit=crop", chip: "Plate III", title: "The Antechamber", body: "Candlelight · Dusk", roman: "III" },
    { span: "lg:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=85&auto=format&fit=crop", chip: "Plate IV", title: "Apparatus", body: "Brass & Bone, c. 1730", roman: "IV" },
    { span: "lg:col-span-4", aspect: "aspect-square", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", chip: "Plate V", title: "The West Wing", body: "Stone · Vellum · Hush", roman: "V" },
  ];

  const doctrineCol2Images = [
    { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=85&auto=format&fit=crop", alt: "Heritage stone", caption: "Plate · 06", roman: "VI" },
    { src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=85&auto=format&fit=crop", alt: "Apothecary brass", caption: "Plate · 07", roman: "VII" },
    { src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=85&auto=format&fit=crop", alt: "Reading interior", caption: "Plate · 08", roman: "VIII" },
  ];

  const doctrines = [
    { roman: "I", title: "On Provenance", body: "Every book carries the memory of its prior keepers. We accept no item whose origin we cannot trace, and refuse to obscure what we know." },
    { roman: "II", title: "On Restoration", body: "We mend with restraint. The patina of time is a kind of authorship; to scrub it away is to silence the artifact." },
    { roman: "III", title: "On Discretion", body: "The reading room is no theatre. Conversations there are quiet, and the names of our patrons are kept in the same drawer as our prices." },
    { roman: "IV", title: "On the Reader", body: "A book is not a possession but a temporary trust. Custodianship requires the reader to leave it the better for having held it." },
    { roman: "V", title: "On the Mark of Time", body: "We prize foxing, dog-eared corners, marginal notes, and the faint imprint of a hand on a cover. These are the work of readers — the higher purpose." },
  ];

  const provenance = [
    { num: "I", title: "The Macclesfield Sale", year: "MCMLXXII", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2OCzU3XWvgc9dkwbHMgQQ4y9jwGaRdjOudE--xNEBCCQZmIAFWQByZUOHXXA7IR6mfW8Uxyv1uD_aj_nXdbXn77xori7Ylx_ZAZPaSXilw8sBvr_uIgOrJqFURlDwloU0Bzvbe4lkdb9UKbIIXMcD7X9TrVeobCueFEvzZBxwPBTbdvmJCQvxbJCsZAIbxGWpir5xmuOF-Zt8UyNsJ1NMTjcAkG-4mbxzhPLTreT5-hRsULdWHoceUUOLiqJmzqsnu-iIs5HS-6uH", body: "A 1731 Virgil with the bookplate of George Parker, recovered from a Norfolk estate. Bound in original calf, spine lettering intact, kept exactly as we found it." },
    { num: "II", title: "Norfolk Folio Cache", year: "MCMXCVI", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", body: "Twelve folio editions found in a sealed library, last opened during the war. Each leaf catalogued, each provenance traced to a 17th-century Italian press." },
    { num: "III", title: "The Bracknell Donation", year: "MMXIV", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85&auto=format&fit=crop", body: "A complete first edition of 'On the Origin of Species' donated by an anonymous reader. Authenticated, conserved, and now offered with the original correspondence." },
  ];

  return (
    <>
      {/* head */}
      <title>Vellum &amp; Morocco - Antiquarian Bookseller</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                "on-primary-container": "#b3817c",
                "on-error": "#690005",
                "error": "#ffb4ab",
                "on-secondary": "#442b00",
                "surface-container-low": "#211b0c",
                "on-background": "#ede1c8",
                "on-tertiary-container": "#b2854c",
                "surface-dim": "#181305",
                "tertiary-fixed-dim": "#f1bd7f",
                "on-primary-fixed": "#311210",
                "background": "#181305",
                "surface-tint": "#f1b9b3",
                "on-tertiary-fixed-variant": "#623f0c",
                "surface-container-highest": "#3b3423",
                "primary-fixed": "#ffdad6",
                "inverse-primary": "#7e534f",
                "secondary": "#ebbf83",
                "primary-fixed-dim": "#f1b9b3",
                "on-secondary-fixed-variant": "#5f4110",
                "on-surface-variant": "#d5c2c0",
                "inverse-on-surface": "#36301f",
                "on-secondary-fixed": "#291800",
                "surface-container-lowest": "#120e02",
                "on-surface": "#ede1c8",
                "outline": "#9e8d8b",
                "on-secondary-container": "#d8ae73",
                "primary-container": "#3e1d1a",
                "inverse-surface": "#ede1c8",
                "surface-container-high": "#302919",
                "surface-bright": "#3f3927",
                "outline-variant": "#514442",
                "on-tertiary": "#462a00",
                "secondary-container": "#5f4110",
                "primary": "#f1b9b3",
                "on-primary": "#4a2723",
                "on-error-container": "#ffdad6",
                "surface-container": "#251f0f",
                "surface": "#181305",
                "tertiary": "#f1bd7f",
                "error-container": "#93000a",
                "secondary-fixed": "#ffddb1",
                "on-tertiary-fixed": "#2a1700",
                "on-primary-fixed-variant": "#643c38",
                "secondary-fixed-dim": "#ebbf83",
                "tertiary-container": "#392100",
                "tertiary-fixed": "#ffddb7",
                "surface-variant": "#3b3423"
              },
              "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
              },
              "spacing": {
                "margin-page": "64px",
                "gutter": "32px",
                "container-max": "1024px",
                "unit": "8px"
              },
              "fontFamily": {
                "body-md": ["Noto Serif"],
                "label-sm": ["Noto Serif"],
                "headline-sm": ["Newsreader"],
                "body-lg": ["Noto Serif"],
                "display-md": ["Newsreader"],
                "display-lg": ["Newsreader"]
              },
              "fontSize": {
                "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "label-sm": ["13px", { "letterSpacing": "0.15em", "fontWeight": "600" }],
                "headline-sm": ["24px", { "letterSpacing": "0.1em", "fontWeight": "400" }],
                "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "display-md": ["36px", { "lineHeight": "1.2", "fontWeight": "600" }],
                "display-lg": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600" }]
              }
            }
          }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .ornamental-rule {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, #b2854c, transparent);
          position: relative;
        }
        .ornamental-rule::after {
          content: '♦';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #b2854c;
          font-size: 10px;
          background-color: #181305;
          padding: 0 4px;
        }
        .text-link-hover {
          position: relative;
          text-decoration: none;
        }
        .text-link-hover::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: currentColor;
          transform: scaleX(1);
          transition: transform 0.3s ease;
          transform-origin: bottom right;
        }
        .text-link-hover:hover::after {
          transform: scaleX(0);
          transform-origin: bottom left;
        }
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
        .marquee-track { display: flex; gap: 24px; width: max-content; }
        .marquee-slow { animation: marquee-slow 90s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .paper-grain {
          background-image: repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,245,220,0.4) 2px 3px);
        }
` }} />

      {/* The HTML had `<html class="dark">` — JSX wraps the body in a dark div so dark: variants resolve. */}
      <div className="dark bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">

        {/* TopAppBar */}
        <header className="bg-[#0a0a0a] dark:bg-[#050505] full-width top-0 z-50">
          <div className="flex flex-col items-center w-full px-8 pt-12 pb-6 max-w-screen-2xl mx-auto border-b border-[#3E1D1A]">
            <nav className="flex items-center justify-between w-full max-w-4xl mx-auto">
              <div className="flex items-center gap-8 font-newsreader uppercase tracking-[0.2em] text-sm">
                <a className="text-[#F5F5DC] opacity-80 hover:text-[#D4AF37] hover:underline transition-all duration-700 cursor-pointer ease-in-out" href="#">Catalogue</a>
                <a className="text-[#F5F5DC] opacity-80 hover:text-[#D4AF37] hover:underline transition-all duration-700 cursor-pointer ease-in-out" href="#">Appraisals</a>
              </div>
              <div className="px-6 text-center">
                <h1 className="text-4xl font-serif italic text-[#F5F5DC] py-4">Vellum &amp; Morocco</h1>
              </div>
              <div className="flex items-center gap-8 font-newsreader uppercase tracking-[0.2em] text-sm">
                <a className="text-[#F5F5DC] opacity-80 hover:text-[#D4AF37] hover:underline transition-all duration-700 cursor-pointer ease-in-out" href="#">Journal</a>
                <a className="text-[#F5F5DC] opacity-80 hover:text-[#D4AF37] hover:underline transition-all duration-700 cursor-pointer ease-in-out" href="#">Contact</a>
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-grow flex flex-col">

          {/* Hero — full-bleed cinematic */}
          <section className="relative w-full min-h-[92vh] flex items-end justify-start pt-32 pb-24 px-gutter md:px-margin-page overflow-hidden bg-background">
            <div className="absolute inset-0 z-0">
              <img
                alt="Open antique book on desk"
                className="w-full h-full object-cover opacity-75 mix-blend-luminosity contrast-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgioIvW-EkYa8vfcBSts_qRvOt-2hKq2b4-_Sem-R7Xo-OT_6xdf_yBWwePvFvvzQFmZFLBmmebFSUASRf1N6NTI27aEJXHMvKKRfmisnTuO8Qs3XLf2ptTKDhQoiUUrLSrnTCL2pVMiZ4vdeXYqoYCDFZjAMy87Tqpx5eNOhq9iVjoWrTJtN7j3hYVi2_Mc5Qsl8LPfwiMj6yWi9VmFgXPhQbUNp8KSkA4yooLPHktxj0AW4JOTOXU4Tr9CgNh5DLuyd9F46gVts6"
              />
              {/* 1 — top-down dark veil */}
              <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/30 to-background"></div>
              {/* 2 — left-to-right horizontal fade so the headline reads against the lit candle/lamp */}
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/55 to-background/15"></div>
              {/* 3 — radial vignette pulling corners to ink */}
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 110% 80% at 30% 65%, transparent 0%, rgba(24,19,5,0.35) 65%, rgba(24,19,5,0.85) 100%)" }}></div>
              {/* 4 — warm gold halo behind headline */}
              <div className="absolute bottom-32 left-16 md:left-32 w-[480px] h-[480px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(241,189,127,0.20) 0%, transparent 60%)", filter: "blur(60px)" }}></div>
              {/* 5 — paper grain veneer */}
              <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none paper-grain"></div>
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-[0.3em] mb-6 block">— Antiquarian Bookseller · Est. MMIV —</span>
              <h2 className="font-display-lg text-display-lg text-on-surface mb-6 font-serif drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
                Books of consequence,<br />
                <span className="italic text-tertiary-fixed-dim">carefully kept.</span>
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface mb-10 max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] opacity-95">Purveyors of fine, rare, and consequential printed matter. Seeking to preserve the intellectual hush of the archival reading room.</p>
              <a className="inline-flex items-center gap-2 font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-widest text-link-hover pb-1" href="#">
                <span>Browse the catalogue</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </section>

          {/* Marginalia — image strip marquee */}
          <section className="relative w-full overflow-hidden py-12" style={{ backgroundColor: "#211a0c" }}>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-tertiary-fixed-dim/40 to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-on-tertiary-container/40 to-transparent"></div>
            <div className="max-w-container-max mx-auto px-gutter mb-6 flex items-center justify-between font-label-sm text-label-sm tracking-[0.3em] uppercase">
              <span className="text-tertiary-fixed-dim">— Marginalia · From the Archive —</span>
              <span className="hidden md:inline text-on-surface-variant opacity-60">No. III</span>
            </div>
            <div className="overflow-hidden py-3">
              <div className="marquee-track marquee-slow">
                {[...marginalia, ...marginalia].map((m, i) => (
                  <div key={`mg-${i}`} className="flex items-center gap-4 shrink-0 w-80 px-4 py-3 border border-outline-variant/30 bg-surface-container-lowest/60 backdrop-blur-sm">
                    <div className="w-14 h-20 overflow-hidden bg-surface-container shrink-0 border border-outline-variant/40">
                      <img src={m.img} alt={m.label} className="w-full h-full object-cover grayscale contrast-110 sepia-[0.25] opacity-90" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-headline-sm text-base italic text-on-surface leading-tight">{m.label}</span>
                      <span className="font-label-sm text-[10px] tracking-[0.25em] uppercase text-on-secondary-container mt-1 truncate">{m.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="w-full max-w-container-max mx-auto px-gutter py-16">
            <hr className="ornamental-rule" />
          </div>

          {/* Recent Acquisitions */}
          <section className="w-full max-w-container-max mx-auto px-gutter pb-24">
            <div className="text-center mb-16">
              <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase mb-4">Recent Acquisitions</h3>
              <p className="font-body-md text-body-md text-on-surface-variant italic">A selection from our latest folio.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">

              {/* Entry 1 */}
              <article className="flex gap-6 items-start group border border-transparent hover:border-outline-variant/30 p-4 transition-colors duration-500 rounded-sm">
                <div className="w-24 h-36 shrink-0 bg-surface-container overflow-hidden shadow-md">
                  <img
                    alt="Book spine"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2OCzU3XWvgc9dkwbHMgQQ4y9jwGaRdjOudE--xNEBCCQZmIAFWQByZUOHXXA7IR6mfW8Uxyv1uD_aj_nXdbXn77xori7Ylx_ZAZPaSXilw8sBvr_uIgOrJqFURlDwloU0Bzvbe4lkdb9UKbIIXMcD7X9TrVeobCueFEvzZBxwPBTbdvmJCQvxbJCsZAIbxGWpir5xmuOF-Zt8UyNsJ1NMTjcAkG-4mbxzhPLTreT5-hRsULdWHoceUUOLiqJmzqsnu-iIs5HS-6uH"
                  />
                </div>
                <div className="flex flex-col h-full pt-1">
                  <h4 className="font-body-lg text-body-lg text-on-surface italic leading-snug mb-1 group-hover:text-tertiary-fixed-dim transition-colors">The Works of Virgil, Translated into English Blank Verse</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-3">Joseph Trapp, 1731</p>
                  <p className="font-label-sm text-label-sm text-on-secondary-container tracking-widest mb-4">EX LIBRIS EARL OF MACCLESFIELD</p>
                  <div className="mt-auto flex items-center justify-between border-t border-outline-variant/50 pt-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">$1,250</span>
                    <a className="font-label-sm text-label-sm text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors" href="#">Inquire</a>
                  </div>
                </div>
              </article>

              {/* Entry 2 */}
              <article className="flex gap-6 items-start group border border-transparent hover:border-outline-variant/30 p-4 transition-colors duration-500 rounded-sm">
                <div className="w-24 h-36 shrink-0 bg-surface-container overflow-hidden shadow-md">
                  <img
                    alt="Book spine"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9WkrYzItu10hlG6COyZ965tOKglm7AVs_o3kdnpfdsag31atSQ3xwEHm0nuxIGaA9TMs-nKoi6_Q9JLytIyB5xmxEdpb1T-3lRNALKf5ufWBtvn696gqCLugpv0TvN27YVJwBLfg2sKsjM777aDTvHTo1yLNKyc-YYepLu0_jxPNkGWHyPZ6qMUems9zJ-HxNrRaq6ZJSUSM_dvUUIh-p2I-T7-7ezEAaHI1y9yT3HHey6BaLZgCdugZU6HRzdJ1tve-iJ2Jk8Han"
                  />
                </div>
                <div className="flex flex-col h-full pt-1">
                  <h4 className="font-body-lg text-body-lg text-on-surface italic leading-snug mb-1 group-hover:text-tertiary-fixed-dim transition-colors">On the Origin of Species by Means of Natural Selection</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-3">Charles Darwin, 1860</p>
                  <p className="font-label-sm text-label-sm text-on-secondary-container tracking-widest mb-4">SECOND EDITION, SECOND ISSUE</p>
                  <div className="mt-auto flex items-center justify-between border-t border-outline-variant/50 pt-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">$4,500</span>
                    <a className="font-label-sm text-label-sm text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors" href="#">Inquire</a>
                  </div>
                </div>
              </article>

              {/* Entry 3 */}
              <article className="flex gap-6 items-start group border border-transparent hover:border-outline-variant/30 p-4 transition-colors duration-500 rounded-sm">
                <div className="w-24 h-36 shrink-0 bg-surface-container overflow-hidden shadow-md">
                  <img
                    alt="Book spine"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQMkvanduR0us5h0TEDN3dtAPuU-aB3jpBc5SrjINMBI_SIfi5nh7pmA7wYkGBHOqc2m4dwYauHFGn_0YdsGVxXgpIuzpEx1SNWRy6yEzbzaqf9rcnk_GWrgqCi9aHoFBCKMJXv4TyFUaOzCwepJCo1nRM-Mh6ivPwUAxUtldEom0AgOzUj_e-1ievSCQaSfQdahBgyn8drhyMeIUOs5CGRxRXk2dJIYCxfjxNwPrZXnOjAAhsM3EyIKbX-eeXfNr8j1DsRLDIRVPq"
                  />
                </div>
                <div className="flex flex-col h-full pt-1">
                  <h4 className="font-body-lg text-body-lg text-on-surface italic leading-snug mb-1 group-hover:text-tertiary-fixed-dim transition-colors">De Rerum Natura Libri Sex</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-3">Titus Lucretius Carus, 1611</p>
                  <p className="font-label-sm text-label-sm text-on-secondary-container tracking-widest mb-4">CONTEMPORARY VELLUM BINDING</p>
                  <div className="mt-auto flex items-center justify-between border-t border-outline-variant/50 pt-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">$850</span>
                    <a className="font-label-sm text-label-sm text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors" href="#">Inquire</a>
                  </div>
                </div>
              </article>

              {/* Entry 4 */}
              <article className="flex gap-6 items-start group border border-transparent hover:border-outline-variant/30 p-4 transition-colors duration-500 rounded-sm">
                <div className="w-24 h-36 shrink-0 bg-surface-container overflow-hidden shadow-md">
                  <img
                    alt="Book spine"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7dJghdM_Sn7Zs7akejIhwTFN0AU4u_KSqD3DrxFF6JFXLhMZTBTGWVX59ytTKWBi8fIdOKVLhdWUxhoLRE8Mhmte5Uhhth18hCvZB6U9vThF1SF2vIUj1S2ThUSjW12JqlwqO8XjusknX8tDHwUavMRdZE0I2jLxf9t1o1g4UYwVsOuP4vZZmssirLHJ8lk7oFC0Fa6c8h74jM2LOXnwYQhfFai4-gAGnGnznt28Jkp45zoZKzQbU2tNgDvOFKqkywtPDnfxXjo9g"
                  />
                </div>
                <div className="flex flex-col h-full pt-1">
                  <h4 className="font-body-lg text-body-lg text-on-surface italic leading-snug mb-1 group-hover:text-tertiary-fixed-dim transition-colors">Paradise Lost. A Poem in Twelve Books</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-3">John Milton, 1749</p>
                  <p className="font-label-sm text-label-sm text-on-secondary-container tracking-widest mb-4">BASKERVILLE PRESS EDITION</p>
                  <div className="mt-auto flex items-center justify-between border-t border-outline-variant/50 pt-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">$2,100</span>
                    <a className="font-label-sm text-label-sm text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors" href="#">Inquire</a>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-12 text-center">
              <a className="inline-block font-label-sm text-label-sm text-on-surface uppercase tracking-widest border-b border-outline-variant hover:border-tertiary-fixed-dim hover:text-tertiary-fixed-dim transition-all pb-2" href="#">View the Complete Catalogue</a>
            </div>
          </section>

          {/* Bindings Lookbook — image grid section, full-bleed slight shade */}
          <section className="relative w-full overflow-hidden py-20 md:py-28" style={{ backgroundColor: "#1d1709" }}>
            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none paper-grain"></div>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-tertiary-fixed-dim/30 to-transparent"></div>

            <div className="max-w-container-max mx-auto px-gutter relative z-10">
              <div className="flex items-end justify-between mb-12 gap-8 flex-col md:flex-row">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display-lg text-[60px] md:text-[80px] italic font-thin leading-none text-tertiary-fixed-dim">II</span>
                    <div className="flex-1 h-px bg-tertiary-fixed-dim/40"></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-[0.3em] block mb-3">— Chapter Two · The Bindings</span>
                  <h3 className="font-display-md text-display-md text-on-surface italic font-serif">Plates from the <em>house</em> archive.</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant italic max-w-sm md:text-right">Photographs by the proprietor. Each plate names the room, the binding, or the hour at which it was kept.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {bindings.map(b => (
                  <figure key={b.chip} className={`${b.span} group relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30 ${b.stretch ? "lg:h-full" : ""}`}>
                    <div className={`${b.aspect} relative overflow-hidden ${b.stretch ? "lg:h-full lg:aspect-auto" : ""}`}>
                      <img src={b.img} alt={b.title} className={`${b.stretch ? "absolute inset-0 " : ""}w-full h-full object-cover grayscale contrast-110 sepia-[0.3] opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-transparent"></div>
                      <div className="absolute top-4 left-4 font-label-sm text-label-sm tracking-[0.3em] uppercase text-tertiary-fixed-dim bg-background/70 backdrop-blur-sm border border-tertiary-fixed-dim/30 px-3 py-1">{b.chip}</div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                        <div>
                          <h4 className="font-headline-sm text-base md:text-lg italic text-on-surface leading-tight">{b.title}</h4>
                          <p className="font-label-sm text-[10px] tracking-[0.25em] uppercase text-on-secondary-container mt-1">{b.body}</p>
                        </div>
                        <span className="font-display-md text-3xl md:text-4xl italic font-thin text-tertiary-fixed-dim leading-none">{b.roman}</span>
                      </div>
                    </div>
                  </figure>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-center gap-4 font-label-sm text-label-sm uppercase tracking-[0.3em] text-on-secondary-container opacity-70">
                <span className="w-12 h-px bg-tertiary-fixed-dim/40"></span>
                Photographs by House · Floor No. 02 · MMXXIV
                <span className="w-12 h-px bg-tertiary-fixed-dim/40"></span>
              </div>
            </div>
          </section>

          {/* Doctrines — content section, numbered tenets, slight shade */}
          <section className="relative w-full overflow-hidden py-20 md:py-28" style={{ backgroundColor: "#15100a" }}>
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none paper-grain"></div>

            <div className="max-w-7xl mx-auto px-gutter relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-[4fr_3fr_5fr] gap-x-32 gap-y-12">

                {/* Col 1 — header + intro + blockquote + bottom-anchored plate pair */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-display-lg text-[60px] md:text-[80px] italic font-thin leading-none text-tertiary-fixed-dim">III</span>
                    <div className="flex-1 h-px bg-tertiary-fixed-dim/40"></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-[0.3em] block mb-3">— Chapter Three · The Doctrines</span>
                  <h3 className="font-display-md text-display-md text-on-surface italic font-serif mb-6">Five tenets of the <em>quiet</em> trade.</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8">An old craft endures by holding to its measures. These are ours, written in the front matter of every catalogue and refused to no inquirer.</p>
                  <hr className="ornamental-rule mb-8" />
                  <blockquote className="font-headline-sm text-lg italic text-on-surface leading-snug border-l-2 border-tertiary-fixed-dim/50 pl-6">
                    "A bookseller without principles is merely a clerk who handles paper."
                    <cite className="block font-label-sm text-[10px] not-italic tracking-[0.3em] uppercase text-on-secondary-container mt-3">— Julian Thorne, Proprietor</cite>
                  </blockquote>
                  {/* Plate pair — anchored at bottom with equal gap between */}
                  <div className="mt-auto flex flex-col gap-10 pt-10">
                    <figure className="group relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop" alt="The Stairwell" className="w-full h-full object-cover grayscale contrast-110 sepia-[0.3] opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent"></div>
                        <div className="absolute top-3 left-3 font-label-sm text-label-sm tracking-[0.3em] uppercase text-tertiary-fixed-dim bg-background/70 backdrop-blur-sm border border-tertiary-fixed-dim/30 px-2 py-1 text-[10px]">Plate · 04</div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                          <div>
                            <h4 className="font-headline-sm text-base italic text-on-surface leading-tight">The Stairwell</h4>
                            <p className="font-label-sm text-[9px] tracking-[0.25em] uppercase text-on-secondary-container mt-1">East Wing · Quarter past four</p>
                          </div>
                          <span className="font-display-md text-2xl italic font-thin text-tertiary-fixed-dim leading-none">IV</span>
                        </div>
                      </div>
                    </figure>
                    <figure className="group relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop" alt="House facade" className="w-full h-full object-cover grayscale contrast-110 sepia-[0.3] opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent"></div>
                        <div className="absolute top-3 left-3 font-label-sm text-label-sm tracking-[0.3em] uppercase text-tertiary-fixed-dim bg-background/70 backdrop-blur-sm border border-tertiary-fixed-dim/30 px-2 py-1 text-[10px]">Plate · 05</div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                          <div>
                            <h4 className="font-headline-sm text-base italic text-on-surface leading-tight">House Façade</h4>
                            <p className="font-label-sm text-[9px] tracking-[0.25em] uppercase text-on-secondary-container mt-1">Antiquary Lane · Dawn</p>
                          </div>
                          <span className="font-display-md text-2xl italic font-thin text-tertiary-fixed-dim leading-none">V</span>
                        </div>
                      </div>
                    </figure>
                  </div>
                </div>

                {/* Col 2 — 3 stacked vertical images, each stretches to flex share */}
                <div className="flex flex-col gap-6">
                  {doctrineCol2Images.map(img => (
                    <figure key={img.caption} className="group relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30 flex-1 lg:min-h-0">
                      <div className="aspect-[3/4] lg:aspect-auto lg:h-full relative overflow-hidden">
                        <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 sepia-[0.3] opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent"></div>
                        <div className="absolute top-3 left-3 font-label-sm text-[10px] tracking-[0.3em] uppercase text-tertiary-fixed-dim bg-background/70 backdrop-blur-sm border border-tertiary-fixed-dim/30 px-2 py-1">{img.caption}</div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <span className="font-label-sm text-[9px] tracking-[0.25em] uppercase text-on-secondary-container">— {img.alt}</span>
                          <span className="font-display-md text-xl italic font-thin text-tertiary-fixed-dim leading-none">{img.roman}</span>
                        </div>
                      </div>
                    </figure>
                  ))}
                </div>

                {/* Col 3 — tenets */}
                <ol className="divide-y divide-outline-variant/30 border-t border-b border-outline-variant/30 self-start">
                  {doctrines.map(d => (
                    <li key={d.roman} className="grid grid-cols-12 gap-3 md:gap-4 py-7 group">
                      <span className="col-span-2 md:col-span-2 font-display-md text-2xl md:text-3xl italic font-thin text-tertiary-fixed-dim leading-tight tabular-nums">{d.roman}</span>
                      <div className="col-span-10 md:col-span-10">
                        <h4 className="font-headline-sm text-xl md:text-2xl italic text-on-surface leading-tight mb-2 group-hover:text-tertiary-fixed-dim transition-colors duration-500">{d.title}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{d.body}</p>
                        <span className="font-label-sm text-[9px] tracking-[0.3em] uppercase text-on-secondary-container mt-3 inline-block">— Tenet · {d.roman}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="w-full max-w-container-max mx-auto px-gutter py-8">
            <hr className="ornamental-rule" />
          </div>

          {/* About / By Appointment */}
          <section className="w-full max-w-container-max mx-auto px-gutter py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* About the House */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 p-8 border border-outline-variant/20 bg-surface-container-lowest">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary-container p-1 mx-auto lg:mx-0">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      alt="Proprietor Portrait"
                      className="w-full h-full object-cover grayscale contrast-125 sepia-[0.3]"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7v6GSpXxuAdH8U4VDJpsc2w6eYYd_0cboMWZDlfZKRMkAdIHGFBFhWKhNJ4ErBpR7Tqt00l4URCdYyEErhbnUN2EVvvhGKNb1DzKZyrDNDE494xlcHXECP45qJQBxMShWQ2W--Jxfq6s4S38DZDeTeZcioLbk5opwCXpTcbmM2FgcCmpVCSn4p1AeRcmQt8GkcNNSs6JCHK34Rm9UIPqoz0kVec3I9qqM21R7ZEv2xSRREf4SooFxcWOwebszk3R88Hhbl0dNbwaX"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase mb-4">About the House</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Founded on the principle that the physical artifact carries history as weightily as the text it bears. Vellum &amp; Morocco is curated by Julian Thorne, bringing three decades of archival expertise to the acquisition and placement of significant printed matter. We specialize in early modern philosophy, classical translations, and fine bindings from the 16th to 19th centuries.
                  </p>
                </div>
              </div>

              {/* By Appointment */}
              <div className="flex flex-col justify-center space-y-6 bg-surface-container p-12 text-center h-full border-t-4 border-primary-container relative">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50 mx-auto mb-2">menu_book</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-widest">By Appointment</h3>
                <p className="font-body-md text-body-md text-on-surface-variant italic max-w-sm mx-auto">
                  The reading room is open to scholars, collectors, and the quietly curious, by prior arrangement only.
                </p>
                <div className="pt-6">
                  <a className="inline-flex items-center gap-2 font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-widest text-link-hover pb-1" href="#">
                    <span>Request an hour</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Provenance Inquiries — case studies, full-bleed slight shade */}
          <section className="relative w-full overflow-hidden py-20 md:py-28" style={{ backgroundColor: "#1a140b" }}>
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none paper-grain"></div>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-on-tertiary-container/40 to-transparent"></div>

            <div className="max-w-container-max mx-auto px-gutter relative z-10">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="w-12 h-px bg-tertiary-fixed-dim/40"></span>
                  <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-[0.3em]">Chapter Four · Provenance</span>
                  <span className="w-12 h-px bg-tertiary-fixed-dim/40"></span>
                </div>
                <h3 className="font-display-md text-display-md text-on-surface font-serif">Inquiries from the <em className="text-tertiary-fixed-dim">stacks</em>.</h3>
                <p className="font-body-md text-body-md text-on-surface-variant italic mt-4 max-w-xl mx-auto">A short ledger of acquisitions, in their own right small histories of how a book reached our shelf.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {provenance.map(p => (
                  <article key={p.num} className="group flex flex-col bg-surface-container-lowest border border-outline-variant/25 hover:border-tertiary-fixed-dim/40 transition-colors duration-700">
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 sepia-[0.3] opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent"></div>
                      <div className="absolute top-4 left-4 font-display-md text-2xl italic font-thin text-tertiary-fixed-dim leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{p.num}</div>
                      <div className="absolute bottom-4 left-4 right-4 font-label-sm text-[10px] tracking-[0.3em] uppercase text-on-secondary-container">— Acquired · {p.year}</div>
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <h4 className="font-headline-sm text-xl italic text-on-surface leading-snug mb-2 group-hover:text-tertiary-fixed-dim transition-colors">{p.title}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">{p.body}</p>
                      <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-4">
                        <span className="font-label-sm text-[10px] tracking-[0.25em] uppercase text-on-secondary-container">Inquiry · No. {p.num}</span>
                        <a href="#" className="font-label-sm text-label-sm text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors uppercase tracking-widest">Inquire →</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-16 flex items-center justify-center gap-4 font-label-sm text-label-sm uppercase tracking-[0.3em] text-on-secondary-container opacity-70">
                <span className="w-16 h-px bg-tertiary-fixed-dim/40"></span>
                Further inquiries upon written request
                <span className="w-16 h-px bg-tertiary-fixed-dim/40"></span>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#0a0a0a] dark:bg-[#050505] w-full border-t border-[#3E1D1A]">
          <div className="flex flex-col items-center justify-center w-full py-16 px-4 gap-8">
            <div className="text-lg font-serif text-[#F5F5DC]">
              Vellum &amp; Morocco
            </div>
            <div className="flex flex-wrap justify-center gap-8 font-newsreader text-xs tracking-widest uppercase">
              <a className="text-[#F5F5DC] opacity-60 hover:text-[#D4AF37] underline underline-offset-4 transition-all duration-500 grayscale hover:grayscale-0" href="#">Terms of Sale</a>
              <a className="text-[#F5F5DC] opacity-60 hover:text-[#D4AF37] underline underline-offset-4 transition-all duration-500 grayscale hover:grayscale-0" href="#">Privacy Policy</a>
              <a className="text-[#F5F5DC] opacity-60 hover:text-[#D4AF37] underline underline-offset-4 transition-all duration-500 grayscale hover:grayscale-0" href="#">Archival Care</a>
            </div>
            <div className="text-center font-newsreader text-xs tracking-widest uppercase text-[#D4AF37] opacity-80 mt-4">
              <p className="mb-2">14 Antiquary Lane, London • By Appointment Only</p>
              <p>© MMXXIV Vellum &amp; Morocco. Members of ABA &amp; ILAB.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default DarkAcademia;
