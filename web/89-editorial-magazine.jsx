export default function T89EditorialMagazine() {
  const navLinks = [
    { label: "Essays", active: true },
    { label: "Interviews" },
    { label: "Archive" },
    { label: "About" },
  ];

  const col1 = [
    {
      kicker: "Essay", title: "Mechanics of Memory",
      body: "How analog devices shaped our cognitive retention before the digital flood.",
      author: "By Julian Barnes",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoCTt8LlsDXnHsBdz89kafXCY59_OuldTyNr56PAby89mpJYvU-Lc7mXkhf5vhlfJRzpWcKG083qbqPGlCVNCA9SDLxQ9kWVOuSLs77h-a8fKE3RRudJN7NqTYDbB4TVjsCyS3RZp149LfCspNphdPnuFaVrg5Dad4Vywzn4Pbbz63EKUy7l7jZk5EB7MNtDBvstFz1XSHHNDaxMh64kFvtBrNhH58S9194r7mGZq6iQrQfzLK83hPU4N00ktK9WLlVqlNKmUFlAfG",
      h: "h-48",
    },
    {
      kicker: "Critique", title: "Brutalism Revisited",
      body: "Re-evaluating the concrete giants that defined post-war civic ambition.",
      author: "By Elena Rostova",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeZQ4Iqm-9c8lMRUyQzhSpEtISHfJzTIajKcB8OFHHA3ypQTYs7aESMRha6SIJMKr0V7kxHSc76H0rIOxhFvKDkXyrRzOySTWA9_cOCEEdHQf2unMpWTP7aWuzFAGTvZuJy6LB57W2Kdvbab1Ah61KW5Lpj9L4ZdwysdjS1t4jdRgDAaz0m79iO8bC89tTyJw0-U7IQRNF0Nr4iEbWqKbTkn-iKjveI7QHPuYRg5_jEYxYZE3uGukq5cHNGWWkELg9FDriqpXF3Xhu",
      h: "h-48",
    },
  ];

  const col2 = [
    {
      kicker: "Interview", title: "The Empty Stage",
      body: "A conversation with director Thomas Vance on the power of minimalist theater.",
      author: "By Sarah Chen",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl2Ivmu09W8o2vyIbihneVI-gqeu_-Ob1oTlS7YD1mBWTL42LeotPU-LkqB_nUlLcPn6HGL-fx5sfnpJBbRP9TjzXKzIyl6V_hyQhTsFy0RMP6ez2NXviZzCmV9nDy_vpctLCuW_Jyo_6XY5jrlI10G64rdxI4nKkfaKjVflu_Yv0AEoC3MpUDoLtvUYuK0927bvgNFmPu00w4mBqGfmSGPmh6mfWDLwcA1axL597U7wIrjlKccnD5_I4gwRyLjZqVYzjZ0m3SUhP9",
      h: "h-64", clamp: "line-clamp-3",
    },
    {
      kicker: "Notes", title: "Marginalia #42",
      body: "Brief thoughts on the necessity of boredom in the creative process.",
      author: "By The Editors",
    },
  ];

  const col3Bottom = {
    kicker: "Poetry", title: "Autumnal Decay",
    body: "Three new poems observing the slow turning of the season.",
    author: "By Arthur Penhaligon",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCycn2hwTm4_dmZCQXok5UHhnHq8vzrEIIxvIEFAz8ZWALSCsuH6xr441dy4bKxuBXRvdyaxmvSeb7fZD8cEE0jhSc26vkLgqVZsox5X5rriaSu4b7W9G-wJ62BFu_0ox3FK0-ZFm23Uh70l5eOBKujFYDw2wNP9C1cnDDnNPJvaUzEzyz3e6p_env9QwgHd2FeuQEJ7Lr27vAzUFsFW_Om0KBOYo5ulfgoqFhfuoe5k55VStxy8dkooUn8fQuZi7Hu4iBLAHwVvakm",
    h: "h-48",
  };

  const footerLinks = ["Masthead", "Terms of Service", "Privacy", "Contact", "Newsletter"];

  const contributors = [
    { name: "Hannah Keats", piece: '"The Quiet Years" · 8 min', kind: "ESSAY", study: "I", w: "w-72", aspect: "aspect-[3/4]", grad: "from-[#1A1915] via-[#1A1915]/30 to-transparent", dir: "t", src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=85&auto=format&fit=crop" },
    { name: "Julian Barnes", piece: '"Mechanics of Memory" · 6 min', kind: "ESSAY", study: "II", w: "w-80", aspect: "aspect-[16/10]", grad: "from-[#1A1915]/60 via-transparent to-transparent", dir: "r", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=85&auto=format&fit=crop" },
    { name: "Elena Rostova", piece: '"Brutalism Revisited" · 12 min', kind: "CRITIQUE", study: "III", w: "w-72", aspect: "aspect-[3/4]", grad: "from-[#1A1915] via-[#1A1915]/40 to-transparent", dir: "t", src: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=900&q=85&auto=format&fit=crop" },
    { name: "Thomas Vance", piece: '"The Empty Stage" · 18 min', kind: "INTERVIEW", study: "IV", w: "w-96", aspect: "aspect-[16/10]", grad: "from-[#1A1915]/70 via-transparent to-[#A8802C]/15", dir: "tr", src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1100&q=85&auto=format&fit=crop" },
    { name: "Sarah Chen", piece: "In conversation with TV · 18 min", kind: "INTERVIEWER", study: "V", w: "w-72", aspect: "aspect-[3/4]", grad: "from-[#1A1915] via-[#1A1915]/30 to-transparent", dir: "t", src: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=900&q=85&auto=format&fit=crop" },
    { name: "Arthur Penhaligon", piece: '"Autumnal Decay" · three poems', kind: "POETRY", study: "VI", w: "w-80", aspect: "aspect-[16/10]", grad: "from-[#A8802C]/15 via-transparent to-[#1A1915]", dir: "bl", src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1000&q=85&auto=format&fit=crop" },
    { name: "The Editors", piece: '"Marginalia #42" · 3 min', kind: "NOTES", study: "VII", w: "w-72", aspect: "aspect-[3/4]", grad: "from-[#1A1915] via-[#1A1915]/40 to-transparent", dir: "t", src: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=900&q=85&auto=format&fit=crop" },
    { name: "Margaret Wells", piece: '"Wind Off the Cape" · 4 min', kind: "FIELD NOTE", study: "VIII", w: "w-80", aspect: "aspect-[16/10]", grad: "from-[#1A1915]/70 via-transparent to-[#A8802C]/15", dir: "tl", src: "https://images.unsplash.com/photo-1762341124796-530c0085f7d8?w=1000&q=85&auto=format&fit=crop" },
  ];

  const folioRules = [
    { i: "I", title: "A piece earns its photograph.", body: "The image follows the writing, never the other way around. We have killed beautiful photographs to spare a thin essay; we have never killed a thin essay for a photograph.", tag: "rule_01" },
    { i: "II", title: "No advertorial. No sponsored. No silent sponsors.", body: "Subscribers fund the paper. The masthead carries no second column.", tag: "rule_02" },
    { i: "III", title: "Cite the marginalia.", body: "Every issue carries a Notes column. Half the marginalia are corrections to the previous issue; the other half are corrections to the next one.", tag: "rule_03" },
    { i: "IV", title: "Pay the contributor before the printer.", body: "The contributor closed the laptop. The printer closed the press. Both wait, but the contributor waits first.", tag: "rule_04" },
    { i: "V", title: "Print four issues a year. Quietly.", body: "A quarterly is a discipline before it is a publication. The first deadline kept is the founding act of the next issue.", tag: "rule_05" },
  ];

  const pressBrands = [
    { slug: "medium", name: "Medium" },
    { slug: "theguardian", name: "The Guardian" },
    { slug: "telegraph", name: "The Telegraph" },
    { slug: "substack", name: "Substack" },
    { slug: "behance", name: "Behance" },
    { slug: "vimeo", name: "Vimeo" },
  ];

  const pillarIconBookmark = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  );
  const pillarIconBox = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="0"/><path d="M3 8L12 3l9 5"/><path d="M3 12h18"/></svg>
  );
  const pillarIconLibrary = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A8802C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  );
  const pillarIconUsers = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );

  const studioPlates = [
    { id: "1611224923853-80b023f02d71", alt: "The desk, before the proof comes back" },
    { id: "1521405924368-64c5b84bec60", alt: "Galley sheets, marked up" },
    { id: "1499744937866-d7e566a20a61", alt: "The press, end of run" },
    { id: "1457369804613-52c61a468e7d", alt: "A second draft, in pencil" },
    { id: "1481627834876-b7833e8f5570", alt: "The bindery shelf" },
    { id: "1495446815901-a7297e633e8d", alt: "Type case, slanted light" },
    { id: "1455390582262-044cdead277a", alt: "Folded sheets, awaiting trim" },
    { id: "1529655683826-aba9b3e77383", alt: "The editor's window, late" },
  ];

  const folioFaq = [
    { i: "01", color: "text-[#A8802C]", q: "Is Folio Quarterly available in print?", a: "Yes. Each issue is offset-printed in a small atelier near Edinburgh, on Munken Pure Rough 120 gsm. The print run sits at 2,400. The digital edition is included with every print subscription.", open: true },
    { i: "02", color: "text-[#1A1915]", q: "Do you accept submissions?", a: "Once a year, in the spring. The window is announced in the masthead column of the autumn issue and stays open for six weeks. Pieces are paid on acceptance, before the printer." },
    { i: "03", color: "text-[#A8802C]", q: "Can I order a back issue?", a: "Issues 1 through 9 are out of print but available as facsimile reprints. Issues 10 onwards are stocked in original print. Both ship from the studio in glassine sleeves, by hand, on Wednesdays." },
    { i: "04", color: "text-[#1A1915]", q: "Is the typeface licensed?", a: "Newsreader by Production Type, with custom italics drawn for the masthead. The licence covers print, web, and the occasional bookplate. Inquire if you wish to commission a similar custom cut." },
    { i: "05", color: "text-[#A8802C]", q: "Why so few sections?", a: "A magazine is a way of choosing what not to print. We carry essays, interviews, notes, archive, poetry. Anything else is somebody else's quarterly." },
  ];

  const folioCss = `
    html, body { overflow-x: clip; }
    .full-bleed-folio { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); max-width: none; }
    .contrib-track { display: flex; gap: 24px; width: max-content; animation: contrib-x 70s linear infinite; padding: 8px 0; }
    .contrib-track:hover { animation-play-state: paused; }
    @keyframes contrib-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
    .folio-faq summary { list-style: none; cursor: pointer; }
    .folio-faq summary::-webkit-details-marker { display: none; }
    .folio-faq summary .folio-chevron { transition: transform 250ms ease; }
    .folio-faq[open] summary .folio-chevron { transform: rotate(90deg); }
    @media (prefers-reduced-motion: reduce) {
      .contrib-track { animation: none; }
      .folio-faq summary .folio-chevron { transition: none; }
    }
  `;

  const Article = ({ a }) => (
    <article className="group cursor-pointer">
      {a.img && (
        <img alt="Article Thumbnail" className={`w-full ${a.h} object-cover mb-4 grayscale group-hover:grayscale-0 transition-all duration-500`} src={a.img} />
      )}
      <div className="font-label-caps text-label-caps text-[#A8802C] mb-2 uppercase">{a.kicker}</div>
      <h3 className="font-headline-md text-headline-md mb-2 group-hover:underline underline-offset-4 decoration-[0.5px]">{a.title}</h3>
      <p className={`font-body-reading text-label-ui text-[#1A1915]/70 mb-3 ${a.clamp || "line-clamp-2"}`}>{a.body}</p>
      <div className="font-label-ui text-label-ui text-[#1A1915]/50">{a.author}</div>
    </article>
  );

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-secondary": "#ffffff", "on-secondary-fixed-variant": "#494740", "surface-tint": "#605e59",
            "surface-container-high": "#ece8de", "on-background": "#1d1c16", "secondary": "#615e57",
            "on-secondary-fixed": "#1d1c16", "on-error": "#ffffff", "surface-container": "#f2ede4",
            "surface-container-lowest": "#ffffff", "on-primary-fixed-variant": "#484742", "outline-variant": "#cac6bd",
            "on-tertiary-fixed": "#271900", "surface-variant": "#e6e2d9", "secondary-container": "#e7e2d8",
            "background": "#fef9ef", "primary-fixed-dim": "#cac6bf", "on-primary-container": "#86837e",
            "inverse-primary": "#cac6bf", "on-secondary-container": "#67645c", "error-container": "#ffdad6",
            "on-surface": "#1d1c16", "on-surface-variant": "#494740", "primary-container": "#1d1c17",
            "error": "#ba1a1a", "on-error-container": "#93000a", "outline": "#7a776f",
            "tertiary-container": "#271900", "secondary-fixed-dim": "#cac6bd", "on-primary-fixed": "#1d1c17",
            "primary": "#000000", "surface-container-low": "#f8f3ea", "surface-dim": "#dedad0",
            "inverse-on-surface": "#f5f0e7", "surface-container-highest": "#e6e2d9", "on-tertiary-fixed-variant": "#5d4200",
            "tertiary": "#000000", "surface-bright": "#fef9ef", "primary-fixed": "#e6e2db",
            "inverse-surface": "#32302a", "on-tertiary-container": "#a57d2a", "tertiary-fixed-dim": "#eec065",
            "surface": "#fef9ef", "on-primary": "#ffffff", "secondary-fixed": "#e7e2d8",
            "tertiary-fixed": "#ffdea5", "on-tertiary": "#ffffff"
          },
          borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
          spacing: { "stack-xl": "8rem", "stack-sm": "1rem", "gutter-grid": "2rem", "stack-lg": "4rem", "margin-page": "5vw", "stack-md": "2rem" },
          fontFamily: {
            "display-hero": ["Newsreader"], "label-ui": ["Inter"], "body-reading": ["Newsreader"],
            "pull-quote": ["Newsreader"], "headline-md": ["Newsreader"], "label-caps": ["Inter"],
            "body-italic": ["Newsreader"], "headline-lg": ["Newsreader"]
          },
          fontSize: {
            "display-hero": ["84px", { lineHeight: "90px", letterSpacing: "-0.02em", fontWeight: "300" }],
            "label-ui": ["13px", { lineHeight: "18px", fontWeight: "400" }],
            "body-reading": ["20px", { lineHeight: "32px", fontWeight: "400" }],
            "pull-quote": ["32px", { lineHeight: "44px", fontWeight: "400" }],
            "headline-md": ["32px", { lineHeight: "38px", fontWeight: "400" }],
            "label-caps": ["11px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "600" }],
            "body-italic": ["20px", { lineHeight: "32px", fontWeight: "400" }],
            "headline-lg": ["48px", { lineHeight: "52px", letterSpacing: "-0.01em", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: folioCss }} />

      <div className="bg-[#FDFCFB] text-[#1A1915] antialiased selection:bg-[#A8802C]/20">
        {/* Compact full-width sticky navbar — single row */}
        <header className="sticky top-0 z-40 w-full bg-[#FDFCFB]/95 backdrop-blur-sm border-b-[0.5px] border-[#1A1915] text-[#1A1915]">
          <div className="flex items-center justify-between gap-6 px-6 md:px-12 h-16 md:h-[72px]">
            <div className="flex items-center gap-4 md:gap-6 shrink-0">
              <span className="hidden md:inline font-sans uppercase tracking-[0.25em] text-[10px] text-[#1A1915]/55">Folio Q. · No. 12</span>
              <span className="hidden md:inline-block w-px h-4 bg-[#1A1915]/25"></span>
              <span className="font-serif italic text-2xl md:text-[28px] leading-none">Folio Quarterly</span>
            </div>
            <nav className="flex items-center gap-3 md:gap-7 font-sans uppercase text-[11px] tracking-[0.2em]">
              {navLinks.map(l => (
                <a key={l.label} href="#" className={l.active
                  ? "text-[#1A1915] border-b-[0.5px] border-[#1A1915] pb-0.5 transition-colors hover:text-[#A8802C] hover:border-[#A8802C]"
                  : "hidden sm:inline text-[#1A1915]/60 hover:text-[#1A1915] transition-colors"}>
                  {l.label}
                </a>
              ))}
              <span className="hidden lg:inline-block w-px h-4 bg-[#1A1915]/25"></span>
              <span className="hidden lg:inline font-sans uppercase tracking-[0.25em] text-[10px] text-[#1A1915]/55">Aut · MMXXIV</span>
            </nav>
          </div>
        </header>

        {/* Hero — full-bleed image with overlaid title; navbar + hero fits in viewport */}
        <section className="relative w-full h-[calc(100vh-72px)] min-h-[560px] overflow-hidden">
          <img alt="Hero Image" className="absolute inset-0 w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSi0ohbXrZlMAR_aevXbnvbForUkHmaSPHHBBFyJZ8IhuSAgf4DK4ssWxSmSagUK4a2qdzw-xpDk6uhvCrEXxb_LfOE5F7zOeAu8ombZhc3Ni90VL62AAHHPPKGt9T3GpbvytiQNxIG3ZsLti6auS-IHPi0tzUpcrWwNgZ5JUlq_VoAnTLYPnaa4rP_dmqoJTN5WbeSek9-5bsUv9h7q-siJS4LC5g8n1sdrF336UOIuoLJ9gfZQJXzELLj7UDdVce_ptI4np-eewU" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1915]/85 via-[#1A1915]/30 to-[#1A1915]/15"></div>
          <div className="absolute top-6 md:top-10 left-0 right-0 px-6 md:px-12 flex items-center justify-between font-label-caps text-label-caps uppercase tracking-[0.3em] text-[#FDFCFB]/75 text-[10px] md:text-[11px]">
            <span>— Issue No. 12 · Aut. MMXXIV</span>
            <span className="hidden md:inline">Plate · 01 · Cover</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10 md:pb-16 text-[#FDFCFB]">
            <div className="max-w-[1100px] mx-auto text-center">
              <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-[#A8802C] block mb-4 text-[10px] md:text-[11px]">— Cover Essay</span>
              <h1 className="font-display-hero text-display-hero italic leading-[0.95] mb-5 md:mb-6">The Quiet Years</h1>
              <p className="font-body-italic text-body-italic text-[#FDFCFB]/85 max-w-2xl mx-auto mb-5 md:mb-6">An exploration of silence, isolation, and the profound spaces left behind in the wake of relentless modernity.</p>
              <div className="flex items-center justify-center gap-4 font-label-caps text-label-caps uppercase tracking-[0.3em] text-[#FDFCFB]/65 text-[10px] md:text-[11px]">
                <span>By Hannah Keats</span>
                <span className="w-1 h-1 rounded-full bg-[#FDFCFB]/65"></span>
                <span>8 min read</span>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-[1440px] mx-auto px-12 pt-stack-xl pb-24">
          {/* Press masthead — trusted-by, editorial flavor */}
          <section className="border-y-[0.5px] border-[#1A1915] mb-stack-xl py-10 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <span className="font-label-caps text-label-caps text-[#A8802C] uppercase tracking-widest block mb-2">— Press · 02</span>
                <h2 className="font-display-hero text-2xl md:text-3xl italic text-[#1A1915] leading-tight">Reviewed in the long-form columns of:</h2>
              </div>
              <p className="font-body-italic italic text-[#1A1915]/60 max-w-sm md:text-right text-sm">Folio Quarterly does not advertise. We are mentioned where the writing earns the line.</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
              {pressBrands.map(b => (
                <img key={b.slug} alt={b.name} className="h-6 md:h-7 opacity-50 hover:opacity-100 transition-opacity duration-300" src={`https://cdn.simpleicons.org/${b.slug}/1A1915`} />
              ))}
            </div>
            <p className="mt-8 font-label-ui text-label-ui text-[#1A1915]/50 uppercase tracking-widest">+ 14 mentions in trade press · Spring 2024 · Folio is read by 2,400 print subscribers in 31 countries.</p>
          </section>

          {/* Six-feature grid · 2 rows × 3 columns, uniform cards, generous spacing */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-12 gap-y-14 lg:gap-y-16 mb-stack-xl">
            {/* 1 — Essay */}
            <article className="group cursor-pointer flex flex-col">
              <div className="aspect-[4/3] overflow-hidden mb-6 border-[0.5px] border-[#1A1915]/15">
                <img alt="Article Thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoCTt8LlsDXnHsBdz89kafXCY59_OuldTyNr56PAby89mpJYvU-Lc7mXkhf5vhlfJRzpWcKG083qbqPGlCVNCA9SDLxQ9kWVOuSLs77h-a8fKE3RRudJN7NqTYDbB4TVjsCyS3RZp149LfCspNphdPnuFaVrg5Dad4Vywzn4Pbbz63EKUy7l7jZk5EB7MNtDBvstFz1XSHHNDaxMh64kFvtBrNhH58S9194r7mGZq6iQrQfzLK83hPU4N00ktK9WLlVqlNKmUFlAfG" />
              </div>
              <div className="font-label-caps text-label-caps text-[#A8802C] mb-3 uppercase tracking-widest">— Essay · 06</div>
              <h3 className="font-headline-md text-headline-md mb-3 leading-tight group-hover:underline underline-offset-4 decoration-[0.5px]">Mechanics of Memory</h3>
              <p className="font-body-reading text-label-ui text-[#1A1915]/70 leading-relaxed line-clamp-3 mb-5">How analog devices shaped our cognitive retention before the digital flood — and what we've quietly forgotten in the migration.</p>
              <div className="font-label-ui text-label-ui text-[#1A1915]/50 mt-auto pt-4 border-t-[0.5px] border-[#1A1915]/15 flex items-center justify-between">
                <span>By Julian Barnes</span><span className="uppercase tracking-widest">6 min</span>
              </div>
            </article>
            {/* 2 — Critique */}
            <article className="group cursor-pointer flex flex-col">
              <div className="aspect-[4/3] overflow-hidden mb-6 border-[0.5px] border-[#1A1915]/15">
                <img alt="Article Thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeZQ4Iqm-9c8lMRUyQzhSpEtISHfJzTIajKcB8OFHHA3ypQTYs7aESMRha6SIJMKr0V7kxHSc76H0rIOxhFvKDkXyrRzOySTWA9_cOCEEdHQf2unMpWTP7aWuzFAGTvZuJy6LB57W2Kdvbab1Ah61KW5Lpj9L4ZdwysdjS1t4jdRgDAaz0m79iO8bC89tTyJw0-U7IQRNF0Nr4iEbWqKbTkn-iKjveI7QHPuYRg5_jEYxYZE3uGukq5cHNGWWkELg9FDriqpXF3Xhu" />
              </div>
              <div className="font-label-caps text-label-caps text-[#A8802C] mb-3 uppercase tracking-widest">— Critique · 11</div>
              <h3 className="font-headline-md text-headline-md mb-3 leading-tight group-hover:underline underline-offset-4 decoration-[0.5px]">Brutalism Revisited</h3>
              <p className="font-body-reading text-label-ui text-[#1A1915]/70 leading-relaxed line-clamp-3 mb-5">Re-evaluating the concrete giants that defined post-war civic ambition, and the slow rehabilitation of an unloved canon.</p>
              <div className="font-label-ui text-label-ui text-[#1A1915]/50 mt-auto pt-4 border-t-[0.5px] border-[#1A1915]/15 flex items-center justify-between">
                <span>By Elena Rostova</span><span className="uppercase tracking-widest">12 min</span>
              </div>
            </article>
            {/* 3 — Interview */}
            <article className="group cursor-pointer flex flex-col">
              <div className="aspect-[4/3] overflow-hidden mb-6 border-[0.5px] border-[#1A1915]/15">
                <img alt="Article Thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl2Ivmu09W8o2vyIbihneVI-gqeu_-Ob1oTlS7YD1mBWTL42LeotPU-LkqB_nUlLcPn6HGL-fx5sfnpJBbRP9TjzXKzIyl6V_hyQhTsFy0RMP6ez2NXviZzCmV9nDy_vpctLCuW_Jyo_6XY5jrlI10G64rdxI4nKkfaKjVflu_Yv0AEoC3MpUDoLtvUYuK0927bvgNFmPu00w4mBqGfmSGPmh6mfWDLwcA1axL597U7wIrjlKccnD5_I4gwRyLjZqVYzjZ0m3SUhP9" />
              </div>
              <div className="font-label-caps text-label-caps text-[#A8802C] mb-3 uppercase tracking-widest">— Interview · 18</div>
              <h3 className="font-headline-md text-headline-md mb-3 leading-tight group-hover:underline underline-offset-4 decoration-[0.5px]">The Empty Stage</h3>
              <p className="font-body-reading text-label-ui text-[#1A1915]/70 leading-relaxed line-clamp-3 mb-5">A conversation with director Thomas Vance on the power of minimalist theater and what is gained when the set disappears.</p>
              <div className="font-label-ui text-label-ui text-[#1A1915]/50 mt-auto pt-4 border-t-[0.5px] border-[#1A1915]/15 flex items-center justify-between">
                <span>By Sarah Chen</span><span className="uppercase tracking-widest">18 min</span>
              </div>
            </article>
            {/* 4 — Notes (typographic block) */}
            <article className="group cursor-pointer flex flex-col">
              <div className="aspect-[4/3] overflow-hidden mb-6 border-[0.5px] border-[#1A1915]/40 bg-[#1A1915] text-[#FDFCFB] flex flex-col items-center justify-center px-6 relative">
                <span className="font-display-hero text-[120px] leading-none italic text-[#A8802C] select-none">§42</span>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.4em] text-[#FDFCFB]/60 mt-3">Marginalia</span>
                <span className="absolute top-4 left-4 font-label-ui text-[10px] uppercase tracking-widest text-[#A8802C]">— Folio · 014</span>
              </div>
              <div className="font-label-caps text-label-caps text-[#A8802C] mb-3 uppercase tracking-widest">— Notes · 04</div>
              <h3 className="font-headline-md text-headline-md mb-3 leading-tight group-hover:underline underline-offset-4 decoration-[0.5px]">Marginalia #42</h3>
              <p className="font-body-reading text-label-ui text-[#1A1915]/70 leading-relaxed line-clamp-3 mb-5">Brief thoughts on the necessity of boredom in the creative process — and the small, accumulating gestures that don't fit anywhere else.</p>
              <div className="font-label-ui text-label-ui text-[#1A1915]/50 mt-auto pt-4 border-t-[0.5px] border-[#1A1915]/15 flex items-center justify-between">
                <span>By The Editors</span><span className="uppercase tracking-widest">4 min</span>
              </div>
            </article>
            {/* 5 — Archive (typographic plate) */}
            <article className="group cursor-pointer flex flex-col">
              <div className="aspect-[4/3] overflow-hidden mb-6 border-[0.5px] border-[#1A1915] bg-[#FDFCFB] flex flex-col items-center justify-center px-6 relative group-hover:bg-[#1A1915] transition-colors duration-500">
                <span className="font-label-caps text-label-caps uppercase tracking-[0.4em] text-[#A8802C] absolute top-4 left-4">Issue · No. 03</span>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.4em] text-[#1A1915]/40 group-hover:text-[#FDFCFB]/40 absolute top-4 right-4">Aut · MMXXI</span>
                <span className="font-display-hero text-5xl md:text-6xl italic text-[#1A1915] group-hover:text-[#FDFCFB] text-center leading-tight transition-colors duration-500">"The Weight<br />of Water"</span>
                <span className="font-label-ui text-[10px] uppercase tracking-widest text-[#1A1915]/50 group-hover:text-[#FDFCFB]/50 mt-4 transition-colors duration-500">Read again →</span>
              </div>
              <div className="font-label-caps text-label-caps text-[#A8802C] mb-3 uppercase tracking-widest">— From the Archive</div>
              <h3 className="font-headline-md text-headline-md mb-3 leading-tight group-hover:underline underline-offset-4 decoration-[0.5px]">"The Weight of Water"</h3>
              <p className="font-body-reading text-label-ui text-[#1A1915]/70 leading-relaxed line-clamp-3 mb-5">Originally published in Issue No. 3, Autumn 2021. A meditation on river-stones, slowness, and the patience of measurement.</p>
              <div className="font-label-ui text-label-ui text-[#1A1915]/50 mt-auto pt-4 border-t-[0.5px] border-[#1A1915]/15 flex items-center justify-between">
                <span>Editor's pick</span><span className="uppercase tracking-widest">9 min</span>
              </div>
            </article>
            {/* 6 — Poetry */}
            <article className="group cursor-pointer flex flex-col">
              <div className="aspect-[4/3] overflow-hidden mb-6 border-[0.5px] border-[#1A1915]/15">
                <img alt="Article Thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCycn2hwTm4_dmZCQXok5UHhnHq8vzrEIIxvIEFAz8ZWALSCsuH6xr441dy4bKxuBXRvdyaxmvSeb7fZD8cEE0jhSc26vkLgqVZsox5X5rriaSu4b7W9G-wJ62BFu_0ox3FK0-ZFm23Uh70l5eOBKujFYDw2wNP9C1cnDDnNPJvaUzEzyz3e6p_env9QwgHd2FeuQEJ7Lr27vAzUFsFW_Om0KBOYo5ulfgoqFhfuoe5k55VStxy8dkooUn8fQuZi7Hu4iBLAHwVvakm" />
              </div>
              <div className="font-label-caps text-label-caps text-[#A8802C] mb-3 uppercase tracking-widest">— Poetry · 03</div>
              <h3 className="font-headline-md text-headline-md mb-3 leading-tight group-hover:underline underline-offset-4 decoration-[0.5px]">Autumnal Decay</h3>
              <p className="font-body-reading text-label-ui text-[#1A1915]/70 leading-relaxed line-clamp-3 mb-5">Three new poems observing the slow turning of the season — light, leaf, and the small disappearances they make.</p>
              <div className="font-label-ui text-label-ui text-[#1A1915]/50 mt-auto pt-4 border-t-[0.5px] border-[#1A1915]/15 flex items-center justify-between">
                <span>By Arthur Penhaligon</span><span className="uppercase tracking-widest">3 poems</span>
              </div>
            </article>
          </section>
        </main>

        {/* Contributors marquee */}
        <section className="full-bleed-folio bg-[#FDFCFB] border-y-[0.5px] border-[#1A1915] py-20 md:py-24 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-12 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <span className="font-label-caps text-label-caps text-[#A8802C] uppercase tracking-widest block mb-3">— Contributors · 04</span>
              <h2 className="font-display-hero text-[5vw] italic leading-[1] text-[#1A1915]">Eight voices, this issue.</h2>
            </div>
            <p className="text-[#1A1915]/70 max-w-md md:text-right font-body-italic italic">Hover the strip to halt the procession. Every plate carries a contributor and a single piece pinned to issue No. 12.</p>
          </div>
          <div className="overflow-hidden relative">
            <div className="contrib-track">
              {[...contributors, ...contributors].map((c, i) => {
                const dirCls = { t: "bg-gradient-to-t", r: "bg-gradient-to-r", tr: "bg-gradient-to-tr", bl: "bg-gradient-to-bl", tl: "bg-gradient-to-tl" }[c.dir];
                return (
                  <figure key={`c-${i}`} aria-hidden={i >= contributors.length ? "true" : undefined} className={`shrink-0 ${c.w} ${c.aspect} relative bg-[#1A1915] overflow-hidden`}>
                    <img alt={i < contributors.length ? c.name : ""} className="absolute inset-0 w-full h-full object-cover grayscale" src={c.src} />
                    <div className={`absolute inset-0 ${dirCls} ${c.grad}`}></div>
                    <div className="absolute top-4 left-4 right-4 flex justify-between font-label-caps text-label-caps text-[#FDFCFB]">
                      <span>STUDY · {c.study}</span>
                      <span className="opacity-70">{c.kind}</span>
                    </div>
                    <figcaption className="absolute bottom-5 left-5 right-5 text-[#FDFCFB]">
                      <span className="font-display-hero text-3xl italic block">{c.name}</span>
                      <span className="block font-label-caps text-label-caps text-[#A8802C] mt-2">{c.piece}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured pieces — alternating rows */}
        <section className="max-w-[1440px] mx-auto px-12 py-stack-xl">
          <div className="text-center mb-stack-lg">
            <span className="font-label-caps text-label-caps text-[#A8802C] uppercase tracking-widest block mb-3">— Featured Pieces · 05</span>
            <h2 className="font-display-hero text-[5vw] italic leading-[1.05] text-[#1A1915]">Three rooms<br />in this issue.</h2>
          </div>
          <div className="flex flex-col gap-stack-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-grid items-center">
              <figure className="md:col-span-7 relative">
                <img alt="Reading rooms" className="w-full aspect-[16/10] object-cover grayscale" src="https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=1400&q=85&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1915]/55 via-transparent to-transparent"></div>
                <span className="absolute top-5 left-5 bg-[#FDFCFB] text-[#1A1915] font-label-caps text-label-caps uppercase tracking-widest px-3 py-1.5 border-[0.5px] border-[#1A1915]">PLATE · I</span>
                <span className="absolute bottom-5 right-5 bg-[#1A1915] text-[#FDFCFB] font-label-caps text-label-caps uppercase tracking-widest px-3 py-1.5">Reading rooms</span>
              </figure>
              <div className="md:col-span-5">
                <span className="font-label-caps text-label-caps text-[#A8802C] uppercase block mb-3">Plate I — The Reading Rooms</span>
                <h3 className="font-display-hero text-5xl italic mb-4 leading-[1.05]">Six libraries that read you back.</h3>
                <p className="font-body-italic text-body-italic text-[#1A1915]/80 mb-6">Margaret Wells walks the Bodleian, the Strahov, the Kanazawa Umimirai. Each room she enters re-shapes the way she enters the next. The piece is fourteen pages long and two photographs short.</p>
                <p className="font-label-ui text-label-ui text-[#1A1915]/50 uppercase tracking-widest">By Margaret Wells · 14 min · No. 12 · Pp. 38—52</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-grid items-center">
              <div className="md:col-span-5 md:order-1 order-2">
                <span className="font-label-caps text-label-caps text-[#A8802C] uppercase block mb-3">Plate II — Quiet Places</span>
                <h3 className="font-display-hero text-5xl italic mb-4 leading-[1.05]">Where the city goes to sit down.</h3>
                <p className="font-body-italic text-body-italic text-[#1A1915]/80 mb-6">A photo essay across nine empty rooms. Hotel mezzanines, courthouse benches, the bottom of staircases. Halfway through, the photographer stops describing them and lets the image do the work.</p>
                <blockquote className="border-l-2 border-[#A8802C] pl-5 font-pull-quote text-[#1A1915]/90 italic">"The thing about a quiet room is the moment you describe it, you've furnished it." — Sarah Chen</blockquote>
              </div>
              <figure className="md:col-span-7 md:order-2 order-1 relative">
                <img alt="Quiet places" className="w-full aspect-[16/10] object-cover grayscale" src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1400&q=85&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#1A1915]/55 via-transparent to-[#A8802C]/10"></div>
                <span className="absolute top-5 right-5 bg-[#FDFCFB] text-[#1A1915] font-label-caps text-label-caps uppercase tracking-widest px-3 py-1.5 border-[0.5px] border-[#1A1915]">PLATE · II</span>
                <span className="absolute bottom-5 left-5 bg-[#A8802C] text-[#FDFCFB] font-label-caps text-label-caps uppercase tracking-widest px-3 py-1.5">Photo Essay · 9 frames</span>
              </figure>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-grid items-center">
              <figure className="md:col-span-7 relative">
                <img alt="Solitary practices" className="w-full aspect-[16/10] object-cover grayscale" src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1400&q=85&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1915]/55 via-transparent to-transparent"></div>
                <span className="absolute top-5 left-5 bg-[#FDFCFB] text-[#1A1915] font-label-caps text-label-caps uppercase tracking-widest px-3 py-1.5 border-[0.5px] border-[#1A1915]">PLATE · III</span>
                <span className="absolute bottom-5 right-5 bg-[#1A1915] text-[#FDFCFB] font-label-caps text-label-caps uppercase tracking-widest px-3 py-1.5">Solitary Practices</span>
              </figure>
              <div className="md:col-span-5">
                <span className="font-label-caps text-label-caps text-[#A8802C] uppercase block mb-3">Plate III — Solitary Practices</span>
                <h3 className="font-display-hero text-5xl italic mb-4 leading-[1.05]">Five quiet vocations, in detail.</h3>
                <p className="font-body-italic text-body-italic text-[#1A1915]/80 mb-6">A bookbinder, a watch-maker, a piano-tuner, a calligrapher, a beekeeper. Each writes one page about the silence of their work; each receives one full-page photograph in return.</p>
                <a className="font-label-caps text-label-caps text-[#1A1915] border-b-[0.5px] border-[#1A1915] pb-1 uppercase hover:text-[#A8802C] hover:border-[#A8802C] transition-colors" href="#">Read the suite →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Doctrine */}
        <section className="full-bleed-folio py-stack-xl bg-[#1A1915] text-[#FDFCFB] border-y-[0.5px] border-[#1A1915]">
          <div className="max-w-[1440px] mx-auto px-12 grid grid-cols-1 lg:grid-cols-12 gap-stack-md lg:gap-stack-lg items-stretch">
            <aside className="lg:col-span-4 flex flex-col">
              <span className="font-label-caps text-label-caps text-[#A8802C] uppercase tracking-widest block mb-4">— Doctrine · 06</span>
              <h2 className="font-display-hero text-[4.5vw] italic leading-[1.05]">Five rules<br />of the page.</h2>
              <p className="font-body-italic text-body-italic text-[#FDFCFB]/70 mt-stack-sm">Pinned above the editor's desk since the founding issue. Bent twice. Broken once.</p>
              <div className="mt-auto pt-10 hidden lg:block">
                <div className="border-[0.5px] border-[#FDFCFB]/30 bg-[#1A1915] p-5 font-mono text-[11px] text-[#FDFCFB]/85">
                  <p className="font-bold uppercase tracking-[0.22em] text-[#A8802C] underline underline-offset-4 decoration-[0.5px] mb-3">ISSUE_HEADER</p>
                  <ul className="flex flex-col gap-1.5">
                    <li className="flex justify-between"><span className="text-[#FDFCFB]/50">VOLUME:</span><span className="font-bold">No. 12 · MMXXIV</span></li>
                    <li className="flex justify-between"><span className="text-[#FDFCFB]/50">SERIES:</span><span>Volume IV · Autumn</span></li>
                    <li className="flex justify-between"><span className="text-[#FDFCFB]/50">FORMAT:</span><span>Quarto · 232 × 305 mm</span></li>
                    <li className="flex justify-between"><span className="text-[#FDFCFB]/50">PAPER:</span><span>Munken Pure 120 gsm</span></li>
                    <li className="flex justify-between"><span className="text-[#FDFCFB]/50">RUN:</span><span>2,400 numbered</span></li>
                    <li className="flex justify-between"><span className="text-[#FDFCFB]/50">SIGNED:</span><span>@H.KEATS · ED.</span></li>
                  </ul>
                  <hr className="border-[#FDFCFB]/20 my-3" />
                  <p className="text-[#FDFCFB]/50 uppercase tracking-[0.18em] text-[9px]">VERIFIED BY THE PRINTER.<br />Atelier No. 03, Leith — sealed Wednesdays.</p>
                </div>
              </div>
            </aside>
            <ol className="lg:col-span-8 border-t-[0.5px] border-[#FDFCFB]/30">
              {folioRules.map((r, i) => (
                <li key={r.tag} className={`grid grid-cols-12 gap-4 py-stack-sm ${i < folioRules.length - 1 ? "border-b-[0.5px] border-[#FDFCFB]/30 " : ""}hover:bg-[#FDFCFB]/[0.03] transition-colors`}>
                  <span className="col-span-2 lg:col-span-1 font-display-hero text-5xl italic text-[#A8802C] tabular-nums leading-none">{r.i}</span>
                  <div className="col-span-10 lg:col-span-9">
                    <h3 className="font-headline-md text-2xl italic mb-1">{r.title}</h3>
                    <p className="font-body-italic text-body-italic text-[#FDFCFB]/70">{r.body}</p>
                  </div>
                  <span className="col-span-12 lg:col-span-2 font-label-ui text-label-ui uppercase tracking-widest text-[#FDFCFB]/40 self-center lg:text-right">[ {r.tag} ]</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Membership — premium 4-card pillars */}
        <section className="max-w-[1440px] mx-auto px-12 py-stack-xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-stack-lg">
            <div>
              <span className="font-label-caps text-label-caps text-[#A8802C] uppercase tracking-widest block mb-3">— Membership · 07</span>
              <h2 className="font-display-hero text-[4.5vw] italic leading-[1.05] text-[#1A1915]">Four ways to keep<br />the paper close.</h2>
            </div>
            <p className="font-body-italic italic text-body-italic text-[#1A1915]/70 max-w-md md:text-right">No tiering, no upsell. Each is a complete relationship to the magazine. Choose the one that matches the shape of your year.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <article className="border-[0.5px] border-[#1A1915] p-7 bg-[#FDFCFB] hover:bg-[#1A1915] hover:text-[#FDFCFB] transition-colors duration-500 flex flex-col group">
              <div className="mb-6 inline-flex w-12 h-12 items-center justify-center border-[0.5px] border-[#1A1915] group-hover:border-[#FDFCFB]">{pillarIconBookmark}</div>
              <span className="font-label-caps text-label-caps text-[#A8802C] uppercase block mb-3">Pillar I</span>
              <h3 className="font-headline-md text-2xl italic mb-3 leading-tight">Subscriber Vault</h3>
              <p className="font-body-italic italic text-label-ui opacity-80 mb-6 flex-1">Every issue, ever printed. Twelve back-issues digitised, indexed, searchable by phrase. The marginalia made findable.</p>
              <div className="mt-auto pt-5 border-t-[0.5px] border-[#1A1915]/30 group-hover:border-[#FDFCFB]/30 flex justify-between font-label-ui text-label-ui uppercase tracking-widest">
                <span>£48 / year</span>
                <span className="opacity-60">12 issues</span>
              </div>
            </article>
            <article className="border-[0.5px] border-[#1A1915] p-7 bg-[#FDFCFB] hover:bg-[#1A1915] hover:text-[#FDFCFB] transition-colors duration-500 flex flex-col group">
              <div className="mb-6 inline-flex w-12 h-12 items-center justify-center border-[0.5px] border-[#1A1915] group-hover:border-[#FDFCFB]">{pillarIconBox}</div>
              <span className="font-label-caps text-label-caps text-[#A8802C] uppercase block mb-3">Pillar II</span>
              <h3 className="font-headline-md text-2xl italic mb-3 leading-tight">The Annual Box</h3>
              <p className="font-body-italic italic text-label-ui opacity-80 mb-6 flex-1">All four issues of the year, hand-collated in a linen-bound slipcase, shipped each January. Numbered. Signed by the editor.</p>
              <div className="mt-auto pt-5 border-t-[0.5px] border-[#1A1915]/30 group-hover:border-[#FDFCFB]/30 flex justify-between font-label-ui text-label-ui uppercase tracking-widest">
                <span>£196 / year</span>
                <span className="opacity-60">Limited · 400</span>
              </div>
            </article>
            <article className="border-[0.5px] border-[#1A1915] p-7 bg-[#1A1915] text-[#FDFCFB] flex flex-col relative">
              <span className="absolute top-4 right-4 font-label-caps text-label-caps text-[#A8802C] uppercase tracking-widest border-[0.5px] border-[#A8802C] px-2 py-1">RECOMMENDED</span>
              <div className="mb-6 inline-flex w-12 h-12 items-center justify-center border-[0.5px] border-[#A8802C]">{pillarIconLibrary}</div>
              <span className="font-label-caps text-label-caps text-[#A8802C] uppercase block mb-3">Pillar III</span>
              <h3 className="font-headline-md text-2xl italic mb-3 leading-tight">Library Access</h3>
              <p className="font-body-italic italic text-label-ui text-[#FDFCFB]/80 mb-6 flex-1">Print + Vault + a year of monthly Editor's Letters with the cuts that didn't make the page. The relationship most subscribers settle into.</p>
              <div className="mt-auto pt-5 border-t-[0.5px] border-[#FDFCFB]/30 flex justify-between font-label-ui text-label-ui uppercase tracking-widest">
                <span className="text-[#A8802C]">£124 / year</span>
                <span className="opacity-60">Print + Digital</span>
              </div>
            </article>
            <article className="border-[0.5px] border-[#1A1915] p-7 bg-[#FDFCFB] hover:bg-[#1A1915] hover:text-[#FDFCFB] transition-colors duration-500 flex flex-col group">
              <div className="mb-6 inline-flex w-12 h-12 items-center justify-center border-[0.5px] border-[#1A1915] group-hover:border-[#FDFCFB]">{pillarIconUsers}</div>
              <span className="font-label-caps text-label-caps text-[#A8802C] uppercase block mb-3">Pillar IV</span>
              <h3 className="font-headline-md text-2xl italic mb-3 leading-tight">Salon Series</h3>
              <p className="font-body-italic italic text-label-ui opacity-80 mb-6 flex-1">Four evenings a year, in a small room, with a contributor and a glass of something. London, Edinburgh, Paris. Twenty-five seats per night.</p>
              <div className="mt-auto pt-5 border-t-[0.5px] border-[#1A1915]/30 group-hover:border-[#FDFCFB]/30 flex justify-between font-label-ui text-label-ui uppercase tracking-widest">
                <span>£280 / year</span>
                <span className="opacity-60">By invitation</span>
              </div>
            </article>
          </div>
          <div className="mt-12 pt-8 border-t-[0.5px] border-[#1A1915]/30 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 font-label-ui text-label-ui text-[#1A1915]/60 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#A8802C]"></span>Cancel any quarter</span>
            <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#A8802C]"></span>Ships from Leith on Wednesdays</span>
            <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#A8802C]"></span>Carbon-offset by the printer</span>
            <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#A8802C]"></span>VAT included · UK & EU</span>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-[1440px] mx-auto px-12 py-stack-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
            <aside className="lg:col-span-4">
              <span className="font-label-caps text-label-caps text-[#A8802C] uppercase tracking-widest block mb-3">— Pre-issue · 08</span>
              <h2 className="font-display-hero text-[4.5vw] italic leading-[1.05]">Pre-issue queries.</h2>
              <p className="font-body-italic text-body-italic text-[#1A1915]/70 mt-stack-sm">Asked by readers in the months between issues. Answered by the editors, in five lines or fewer.</p>
            </aside>
            <div className="lg:col-span-8 divide-y-[0.5px] divide-[#1A1915] border-y-[0.5px] border-[#1A1915]">
              {folioFaq.map((f) => (
                <details key={f.i} className="folio-faq group p-6" open={f.open}>
                  <summary className="flex items-center gap-6 list-none">
                    <span className={`font-display-hero text-3xl italic ${f.color} tabular-nums shrink-0 w-12 leading-none`}>{f.i}</span>
                    <h3 className="font-headline-md text-xl italic flex-1">{f.q}</h3>
                    <span className="folio-chevron text-[#A8802C] text-2xl shrink-0 leading-none">→</span>
                  </summary>
                  <p className="pl-16 mt-stack-sm font-body-italic text-body-italic text-[#1A1915]/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Inside the studio — image strip before footer */}
        <section className="full-bleed-folio border-t-[0.5px] border-[#1A1915] bg-[#FDFCFB] py-stack-lg">
          <div className="max-w-[1440px] mx-auto px-12 mb-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <span className="font-label-caps text-label-caps text-[#A8802C] uppercase tracking-widest block mb-3">— Inside the Studio · 09</span>
                <h2 className="font-display-hero text-[4.5vw] italic leading-[1.05] text-[#1A1915]">Eight rooms, one Wednesday.</h2>
              </div>
              <p className="font-body-italic italic text-[#1A1915]/60 max-w-md md:text-right">A walk through the atelier the day Issue No. 12 went to press. Plates from the photo desk; no captions, on purpose.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 px-3 md:px-6">
            {studioPlates.map(p => (
              <figure key={p.id} className="aspect-square overflow-hidden border-[0.5px] border-[#1A1915] bg-[#1A1915]">
                <img alt={p.alt} className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-500" decoding="async" loading="lazy" src={`https://images.unsplash.com/photo-${p.id}?w=600&q=80&auto=format&fit=crop`} />
              </figure>
            ))}
          </div>
          <p className="max-w-[1440px] mx-auto px-12 mt-10 pt-6 border-t-[0.5px] border-[#1A1915]/20 font-label-ui text-label-ui text-[#1A1915]/50 uppercase tracking-widest text-center">Photographs by the editorial desk · No. 12 · MMXXIV · plates 01—08 of an unpublished sequence</p>
        </section>

        <footer className="bg-[#FDFCFB] text-[#1A1915] font-sans uppercase text-[10px] tracking-[0.2em] border-t-[0.5px] border-[#1A1915] w-full grid grid-cols-12 gap-8 py-16 px-12 max-w-[1440px] mx-auto">
          <div className="col-span-12 md:col-span-4 flex flex-col justify-between">
            <div className="font-serif italic text-2xl text-[#1A1915] mb-8">Folio Quarterly</div>
            <div className="text-[#1A1915]/50">© 2024 Folio Quarterly. Printed Digitally.</div>
          </div>
          <div className="col-span-12 md:col-span-8 flex flex-wrap gap-8 justify-end">
            {footerLinks.map(l => (
              <a key={l} href="#" className="text-[#1A1915]/50 hover:underline decoration-1 underline-offset-4 transition-all">{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
