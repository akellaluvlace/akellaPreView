export default function T34EditorialMagazine() {
  const navLinks = [
    { href: "#essays", label: "Essays" },
    { href: "#reporting", label: "Reporting" },
    { href: "#criticism", label: "Criticism" },
    { href: "#interviews", label: "Interviews", smOnly: true }
  ];

  const features = [
    {
      tag: "Essays", title: "The Mechanics of Memory", byline: "by David Chen",
      desc: "Examining the physical artifacts we leave behind, and how tactile objects outlive our digital footprints in the long scope of history. As we migrate our lives to the cloud, the tangible remnants of our existence gain an almost sacred, anchoring weight in an increasingly transient world.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFoBNoQ8cu2oZFKH62jM-OcpKfaWS_zWLOq8xGgCFfGwJQ2t0J8VFjaLVTJEwLuk4IphqXyxnN14B7viEb_3RbCJOLE53XEQHYcaFOdJ7_uHEQDaaVTmo6GJGYKAkUgUmVoWpKM9wxXm7B_uucjeOO-MARG4hx0UYOnZOYdI-gN6GzJ0LHKkuHPvR4FEq0RPq7gW4cfPhGMicS1wLHFlLTKaVDa0QOKzckv1POSO5xXD1AvGf78D4nOaCvFQfqLMmjFqTcPIvGBQ8",
      alt: "Close up of old typewriter keys in high contrast black and white."
    },
    {
      tag: "Criticism", title: "Concrete Utopias", byline: "by Sarah Jenkins",
      desc: "A reassessment of Brutalism not as an aesthetic failing, but as the last sincere architectural attempt at civic egalitarianism. We explore how these towering concrete monoliths were originally built on profound promises of universal housing, community solidarity, and structural honesty.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtWEElgJD2D1HEX75y9j9rlVRkNyAfWlLrAg2H-QI4ZzdvLIUVoBe3KC1rd16seC_7_liSlrnx1W72sAEnZVAsBLQLMiAc_E28yRFLMgTC094QTrEDf0g0NGY_F4zrEG7RM4M7EuXnzXnF8e_-mZUr1_LV0D87CmH2bpff0P_Fq7DUKJ9Z0rGlfX5hjVbshF848VIa2ZHOq3GRTBioGr2uSaQw5_R4tGuKZybMeCLtRx-1mPkcMzCFm8hYM41UxPGlHG6UbYuYvIc",
      alt: "Abstract architectural details of a brutalist concrete building featuring sharp angles and dramatic shadows.",
      bordered: true
    },
    {
      tag: "Interviews", title: "Silence is a Language", byline: "with Maria Rossi",
      desc: "The reclusive author discusses her twenty-year hiatus, the deafening noise of the modern world, and the arduous process of finding the words to begin again. In her first public interview since 2004, Rossi reveals the profound, generative power she discovered within absolute quiet.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9eh4EuVsGqGKuVas-fBbATsGxiuwKFurFgJvOtNA_lzS92-SNUhBu5W7AzV0cZrCj-uFNJoAYgg1EoRwKn-5oHzJlz7ABgg6T_45RxxqV3WbXWPYAhGaeEwd8kLcaxcXxgVvARpJQ8mlWoAu0VhhuBUC_P7SuWitnFZTwphUFWiHwBFqbG3NxhYvoQoupt38ZYarvyFt1fi_jQLbqcPjMOAJ2aulpekHlM2KWuxjn-x69s9z5Je3tuP6SaTiasIzWLtstIiOkFRk",
      alt: "Portrait of an older woman looking away thoughtfully in soft window light with deep cinematic shadows.",
      bordered: true
    }
  ];

  const archive = [
    { season: "Winter 2019", title: "The Geography of Fog", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVuj7Bo34fyutxF9tVLMsCSnkxxDXMI3rng1a8l2N0BVoX0a5_th3rDeQN3yEarSJAYIuCcmDTfhGGX8VqxOr6qMsb79nS3QBfrtnkIlfGykUduI0XMER_BJTKOJWfZFqWBQuqKvjVFoxTYKT7QcjhSQHwbWlBKLT5ZRHiZsbc-GzAoHX6IdDTwVrPfBM1kWmmpDtc-w5o60BZiNROs6sv2KiZzFqigNMOPuPC3ZWgS0qS0z3hJEbkjMB9lD8vEMOUpYZITLHEZ2U", alt: "Minimalist monochromatic landscape of distant mountains wrapped in thick fog." },
    { season: "Autumn 2021", title: "Algorithms of Grief", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0edrcO4OD4smcc6H4mRhMhx1CyvkKhI40WHtio0v4SRKTlgQ-aNi8DOYEBzRr9dFdv4_PC6HfbXEYm7tJYgEL-d_uu1fhZP48FKduTJ32dOEXCTXN2lg-g349rB_4Wp614eeJG-WY4NUDJabIdEBAYeYkUsT2ELkGsmStirTRl_b2DFCbzkbtaP7bPwE5kP5Lk1tt3gxi8lELO6-BH3ES6HcZ_5ajvc-L2m0Eyiqyw0tWqM_JlhJQatXPWw2c0o8thRAnBt9FIPA", alt: "Close up of code on a computer screen reflecting in someone's glasses, dark and moody." },
    { season: "Summer 2018", title: "Rust Belt Elegies", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600", alt: "Abandoned rusty train car overgrown with nature, representing industrial decay." },
    { season: "Spring 2020", title: "The Vinyl Resurgence", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA200DFPnp63LHtQirklHGPo8LbiN7hVR7tIo72249WyVkL95UUNxsuzfvI7T5dqt2vSMfDgf98-VT9H4wRCt0kU44EiV_MZ3JPuVJwMRNB9u9jS4g-WKPBwwsZ5IuIR8vWLBsC1G4ZOZPccraeEQzuwktBx93uIxTSe3I2xPeLbDT-YZPnOaN82meKGDfXM8mclkW64-BbQwVucSU72r1Eyqt9F6bcfZL_8OBUdY1yepXXtd7-cFNIHa_3pDbdnMytOKtaisinncU", alt: "Stacks of old vinyl records in a dusty room with sunbeams illuminating the dust motes." }
  ];

  const footerCols = [
    ["Essays", "Reporting", "Criticism"],
    ["About", "Archive", "Masthead"],
    ["Submissions", "Subscribe"]
  ];

  const photographers = [
    { id: "1573496359142-b8d87734a5a2", name: "Renaud Vidal",   city: "PARIS",       caption: "Cover · & the Cartographer.",          aspect: "aspect-[3/4]",  width: "w-72" },
    { id: "1609530142110-7af0a038c723", name: "Hana Sato",      city: "TOKYO",       caption: "Architecture plates · Concrete Utopias.", aspect: "aspect-[16/10]", width: "w-80" },
    { id: "1776275758873-31603dd06112", name: "Lior Halpern",   city: "BERLIN",      caption: "Reportage · Field Notes I.",          aspect: "aspect-[3/4]",  width: "w-72" },
    { id: "1622912058707-1b33af81db4f", name: "Inès Moreau",    city: "MARSEILLE",   caption: "Long-form · Faroe diary.",            aspect: "aspect-[16/10]", width: "w-80" },
    { id: "1762341124796-530c0085f7d8", name: "Theo Almeida",   city: "LISBON",      caption: "Portraits · Silence is a Language.",  aspect: "aspect-[3/4]",  width: "w-72" },
    { id: "1685787773514-90e8e14af797", name: "Eli Cano",       city: "MEXICO CITY", caption: "Travel essay · Field Notes III.",     aspect: "aspect-[16/10]", width: "w-80" },
    { id: "1573497019940-1c28c88b4f3e", name: "Margit Reier",   city: "REYKJAVÍK",   caption: "Documentary · Algorithms of Grief.",  aspect: "aspect-[3/4]",  width: "w-72" },
  ];

  const fieldNotes = [
    {
      no: "I", locale: "Faroe Islands", tag: "Reporting · 14 min read",
      title: "Letters to a country with no road.",
      body: "Three weeks on Streymoy with a Polaroid camera, a cassette recorder, and a postman who has memorised every household on his island. What he carries is rarely letters. It is news, condolences, the silence between ferries.",
      byline: "by Inès Moreau",
      img: "1742339548967-5d0a45af57c2", alt: "Faroe Islands cliffs in heavy weather",
      reverse: false,
    },
    {
      no: "II", locale: "Hokkaido", tag: "Essay · 22 min read",
      title: "A train at the edge of Hokkaido.",
      body: "For seven years, the Mashike branch line ran a single carriage to a single passenger — a high-school student walking out of one life and into another. We rode it the day it closed, with the conductor who had taken the job specifically to keep her safe.",
      byline: "by Hana Sato",
      img: "1707186563546-71a3e11d6b39", alt: "Hokkaido railway in snow",
      reverse: true,
    },
    {
      no: "III", locale: "Trinidad", tag: "Reportage · 18 min read",
      title: "The dancers who measure the year.",
      body: "Carnival in Port of Spain is not a single event. It is a calendar in motion — a sequence of small disciplines kept by an extended family of dressmakers, drummers, and bookkeepers. We followed three of them for the eight months between October and the parade.",
      byline: "by Eli Cano",
      img: "1685787773514-90e8e14af797", alt: "Trinidad street at dusk",
      reverse: false,
    },
  ];

  const contributors = [
    { numeral: "I",   name: "Renaud Vidal",  img: "1573496359142-b8d87734a5a2", body: <>Cover photograph &amp; portfolio. Has worked the Sahel, the Sicilian salt flats, the Highlands. Is rarely in the same country twice in a calendar year.</>, tags: ["Photography", "Reportage"] },
    { numeral: "II",  name: "Elena Vranas",  img: "1776275758873-31603dd06112", body: <>Author of <em>The Last Cartographer</em>. Greek-Namibian writer, longtime contributor since 2014. This is her ninth feature for Periphery.</>, tags: ["Long-form", "Memoir"] },
    { numeral: "III", name: "Sarah Jenkins", img: "1762341124796-530c0085f7d8", body: <>Architecture critic. <em>Concrete Utopias</em> began as a footnote in her 2022 monograph and grew into the longest essay in this issue.</>, tags: ["Criticism", "Architecture"] },
    { numeral: "IV",  name: "David Chen",    img: "1758600587391-338f5376b7ed", body: <>Memoirist. <em>The Mechanics of Memory</em> is the first piece he has published since the 2021 closure of <em>Lapham's</em>. We are pleased he chose us.</>, tags: ["Essay", "Memoir"] },
    { numeral: "V",   name: "Maria Rossi",   img: "1701096374092-bb70915fdc5c", body: <>Subject of our cover interview, <em>Silence is a Language</em>. Ms Rossi's first published words since 2004 appear in these pages.</>, tags: ["Interview", "Fiction"] },
  ];

  const readingOrder = [
    { num: "01", title: "The Last Cartographer",                  meta: "Reporting · Elena Vranas",   read: "26 min" },
    { num: "02", title: "Concrete Utopias",                       meta: "Criticism · Sarah Jenkins",  read: "19 min" },
    { num: "03", title: "The Mechanics of Memory",                meta: "Essay · David Chen",         read: "14 min" },
    { num: "04", title: "Letters to a country with no road",      meta: "Field Notes · Inès Moreau",  read: "14 min" },
    { num: "05", title: "Silence is a Language",                  meta: "Interview · Maria Rossi",    read: "31 min" },
  ];

  // Press shelf — editorial flavor of R.11 (trusted-by). All slugs curl-checked 200 with -L.
  const pressShelf = [
    "medium", "theguardian", "substack", "telegraph",
    "behance", "vimeo", "framer", "wetransfer",
  ];

  // Premium 4-card editorial subscription tiers (R.12 editorial: Salon / Subscription / Vault / Salon Series).
  const tiers = [
    {
      tag: "Issue · One",
      title: "The Salon",
      body: "A single, hand-stitched copy posted from London the week of release. Includes the printed inserts and the editor's note.",
      chip: "£24 · per issue",
      glyph: "M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4",
    },
    {
      tag: "Quartet",
      title: "Subscription",
      body: "Four printed issues a year, posted ten days before newsstand. Members receive the full digital archive and the bi-monthly Periphery letter.",
      chip: "£86 · annual",
      glyph: "M4 6h16M4 12h16M4 18h10",
      featured: true,
    },
    {
      tag: "Patron",
      title: "The Vault",
      body: "Everything in the Quartet, plus a numbered linen-bound volume of the year's complete archive, hand-pressed in Saint-Pierre.",
      chip: "£240 · annual · 220 made",
      glyph: "M5 4h14a2 2 0 012 2v14l-9-4-9 4V6a2 2 0 012-2z",
    },
    {
      tag: "Conversation",
      title: "Salon Series",
      body: "Four small evenings a year — one writer, one reader, no podium. London, Paris, Tokyo, and one elsewhere. Twenty-four seats; eight reserved for subscribers.",
      chip: "By invitation",
      glyph: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z",
    },
  ];

  // Image strip before footer (R.17, 8 squares). Pulled from the verified editorial / workspace / portrait pool.
  // Subjects: type / paper / shelves / printer / light-on-desk / portrait studio / typewriter / page-spread.
  const closingPlates = [
    { id: "1521405924368-64c5b84bec60", alt: "Type cases and metal sorts laid out on the editor's desk." },
    { id: "1502458051560-7f33ac46fda3", alt: "A folded broadsheet beside a black coffee, raking morning light." },
    { id: "1455390582262-044cdead277a", alt: "Wall of bound back-issues in the production office." },
    { id: "1481627834876-b7833e8f5570", alt: "Open spread of the previous issue, gutter centred." },
    { id: "1495446815901-a7297e633e8d", alt: "Reading lamp, marked-up galley, and a felt-tip pen." },
    { id: "1701096374092-bb70915fdc5c", alt: "Studio portrait — feature subject, between sittings." },
    { id: "1535546204504-586398ee6677", alt: "An old typewriter on a writing desk, daylight from the left." },
    { id: "1499951360447-b19be8fe80f5", alt: "Stack of essays in proof, page numbers visible at the corner." },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fef9ed", "on-background": "#1d1c15",
            "surface": "#fef9ed", "on-surface": "#1d1c15", "on-surface-variant": "#444748",
            "surface-container-low": "#f8f3e8", "surface-container": "#f3ede2", "surface-container-high": "#ede8dd",
            "primary": "#000000", "on-primary": "#ffffff",
            "secondary": "#ae2d3e", "on-secondary": "#ffffff", "secondary-container": "#ff6a76",
            "tertiary": "#000000", "on-tertiary": "#ffffff",
            "outline": "#747878", "outline-variant": "#c4c7c7"
          },
          fontFamily: {
            "display-masthead": ["Newsreader", "serif"],
            "headline-xl": ["Newsreader", "serif"], "headline-lg": ["Newsreader", "serif"], "headline-md": ["Newsreader", "serif"],
            "body-lg": ["Noto Serif", "serif"], "body-md": ["Noto Serif", "serif"],
            "label-caps": ["Public Sans", "sans-serif"], "metadata": ["Public Sans", "sans-serif"]
          },
          fontSize: {
            "display-masthead": ["clamp(3.5rem, 8vw + 1rem, 7.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
            "headline-xl": ["clamp(2.5rem, 5vw + 1rem, 4rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
            "headline-lg": ["clamp(2rem, 3vw + 1rem, 3rem)", { lineHeight: "1.2", fontWeight: "500" }],
            "headline-md": ["clamp(1.5rem, 2vw + 1rem, 2rem)", { lineHeight: "1.3", fontWeight: "500" }],
            "body-lg": ["clamp(1.125rem, 1.5vw + 0.5rem, 1.25rem)", { lineHeight: "1.6", fontWeight: "400" }],
            "body-md": ["clamp(1rem, 1.2vw + 0.5rem, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }],
            "label-caps": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "700" }],
            "metadata": ["0.875rem", { lineHeight: "1.4", fontWeight: "400" }]
          },
          spacing: {
            "column-gap": "clamp(1.5rem, 4vw, 3rem)", "gutter": "clamp(1rem, 4vw, 2rem)",
            "section-gap": "clamp(4rem, 8vw, 8rem)", "margin-page": "clamp(1.5rem, 5vw, 4rem)"
          }
        }
      }
    }
  `;

  const css = `
    ::selection { background-color: #ae2d3e; color: #ffffff; }
    .text-balance { text-wrap: balance; }
    .text-pretty { text-wrap: pretty; }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; display: inline-block; vertical-align: middle; }
    @keyframes mag-marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(calc(-50% - 14px)); }
    }
    .mag-marquee-track {
        animation: mag-marquee 65s linear infinite;
        width: max-content;
        display: flex;
        align-items: center;
        gap: 28px;
    }
    .mag-marquee-track:hover { animation-play-state: paused; }
    .mag-drop-cap::first-letter {
        font-family: 'Newsreader', serif;
        font-weight: 600;
        float: left;
        font-size: 4.2em;
        line-height: 0.85;
        padding: 0.15em 0.18em 0 0;
        color: #ae2d3e;
    }
    .mag-tier-featured {
        box-shadow: 0 0 0 1px rgba(174, 45, 62, 0.45),
                    0 24px 60px -28px rgba(174, 45, 62, 0.35);
    }
    .mag-noise {
        background-image:
            repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px),
            repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px);
    }
    .mag-press-mark img {
        filter: grayscale(100%) opacity(0.55);
        transition: filter 360ms ease, transform 360ms ease;
    }
    .mag-press-mark:hover img {
        filter: grayscale(20%) opacity(1);
        transform: translateY(-1px);
    }
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
      .mag-marquee-track { animation: none; }
      .mag-press-mark img { transition: none; }
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@300,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="light scroll-smooth bg-background text-on-background antialiased flex flex-col min-h-screen">
        <header className="w-full bg-background border-b border-on-background/10 sticky top-0 z-50 backdrop-blur-sm bg-background/95 transition-all">
          <div className="w-full px-6 md:px-12 lg:px-16 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-on-surface-variant font-label-caps uppercase text-label-caps tracking-widest">Spring 2024</div>
            <a href="#" className="text-4xl md:text-6xl lg:text-7xl font-display-masthead text-primary uppercase tracking-tighter hover:text-secondary transition-colors">Periphery</a>
            <nav className="flex gap-6 items-center" aria-label="Primary Navigation">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className={`${l.smOnly ? "hidden sm:block " : ""}text-on-surface-variant font-label-caps uppercase text-label-caps tracking-widest hover:text-secondary transition-colors`}>{l.label}</a>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16 w-full">
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-section-gap border-b border-on-background/10 pb-16">
            <div className="col-span-1 md:col-span-7 lg:col-span-8 group overflow-hidden rounded-sm relative">
              <a href="#" className="absolute inset-0 z-10" aria-label="Read full article: The Last Cartographer"></a>
              <img
                src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=2000"
                alt="Vast aerial view of the Namib desert showing intricate patterns of towering sand dunes and deep shadows."
                width="1200" height="800"
                className="w-full h-full aspect-[4/3] md:aspect-auto md:h-[600px] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
                loading="eager" decoding="async"
              />
            </div>
            <div className="col-span-1 md:col-span-5 lg:col-span-4 flex flex-col justify-center gap-6 pl-0 md:pl-4">
              <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Reporting</div>
              <h1 className="font-headline-xl text-headline-xl text-primary leading-tight text-balance">
                <a href="#" className="hover:text-secondary transition-colors">The Last Cartographer</a>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant text-pretty max-w-[45ch]">
                In an age of omnipresent satellites and algorithmic prediction, one man continues to map the shifting sands of the Namib desert entirely by hand. His solitary work preserves the delicate, ephemeral territories that are relentlessly forgotten by digital systems, offering a profound meditation on memory, landscape, and human observation.
              </p>
              <div className="font-metadata text-metadata text-on-surface-variant mt-4 pt-6 border-t border-on-background/10 w-1/2">by Elena Vranas</div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-section-gap">
            {features.map(f => (
              <article key={f.title} className={`flex flex-col gap-5 relative group${f.bordered ? " border-t pt-8 md:pt-0 md:border-t-0 md:border-l border-on-background/10 md:pl-8 lg:pl-12" : ""}`}>
                <a href="#" className="absolute inset-0 z-10" aria-label={`Read: ${f.title}`}></a>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-sm">
                  <img src={f.img} alt={f.alt} width="600" height="450" className="w-full h-full object-cover filter grayscale group-hover:grayscale-[0.3] group-hover:scale-105 transition-all duration-700 ease-out" loading="lazy" decoding="async" />
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3">{f.tag}</div>
                  <h2 className="font-headline-md text-headline-md text-primary group-hover:text-secondary group-hover:italic transition-colors duration-300 text-balance mb-2">{f.title}</h2>
                  <div className="font-metadata text-metadata text-on-surface-variant mb-4">{f.byline}</div>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-4 text-pretty max-w-[50ch]">{f.desc}</p>
                </div>
              </article>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-on-background/10 pt-16">
            <section className="col-span-1 lg:col-span-8 lg:pr-12 border-b lg:border-b-0 pb-12 lg:pb-0 border-r-0 lg:border-r border-on-background/10">
              <h3 className="font-headline-lg text-headline-lg text-primary mb-8 pb-4 border-b border-on-background/10">From the Archive</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                {archive.map(a => (
                  <article key={a.title} className="flex flex-col gap-3 group relative flex-row sm:flex-col items-center sm:items-start">
                    <a href="#" className="absolute inset-0 z-10 rounded-sm" aria-label={`Read archive piece: ${a.title}`}></a>
                    <div className="w-1/3 sm:w-full aspect-square overflow-hidden rounded-sm flex-shrink-0 mr-4 sm:mr-0 sm:mb-3">
                      <img src={a.img} alt={a.alt} width="300" height="300" className="w-full h-full object-cover filter grayscale group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" decoding="async" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px] mb-1">{a.season}</div>
                      <h4 className="font-headline-md text-headline-md text-primary text-xl md:text-2xl leading-tight group-hover:text-secondary group-hover:italic transition-colors text-balance">{a.title}</h4>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="col-span-1 lg:col-span-4 bg-surface-container-low p-8 lg:p-10 border border-on-background/5 rounded-sm flex flex-col justify-center">
              <h3 className="font-headline-md text-headline-md text-primary mb-8 italic text-center text-balance">Letter from the Editor</h3>
              <div className="flex justify-center mb-8">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAteU2vigkcRSBpZ180NV00Nucn6XwTXtwCcqoyAKsNugaq96tZ2MOYvpG7MGbKaXvNOXCdA_jG01cjI4e8xVMWzc0mv3ePGharWUIZ-agAX1mF2q8j5vDinTgfkwcGV-98JqizIC9jEflMX7K5Mw3vNJ3bFAGHGtCny1Zrmaqo5agBd3QocPoig0xzJV_u1yYuYLUW18iesURggzzTMK3IpNOOw97_YBktyM7LXpfpItedWUFqLQtn4O-w7dXOMB0ZF2faHpvTpDs"
                  alt="Portrait of Marcus Vance, Editor of Periphery." width="96" height="96"
                  className="w-24 h-24 rounded-full object-cover filter grayscale shadow-sm" loading="lazy" decoding="async"
                />
              </div>
              <div className="font-body-md text-body-md text-on-surface-variant space-y-5 text-center text-pretty">
                <p>In this issue, we deliberately turn our attention to the margins. We seek the stories that happen just out of frame, the territories left unmapped by conventional wisdom, and the isolated voices that speak quietly in noisy rooms.</p>
                <p>We invite you to slow down, disconnect from the relentless digital feed, and explore the periphery with us.</p>
              </div>
              <div className="mt-10 pt-8 border-t border-on-background/10 text-center font-headline-lg text-primary italic text-2xl">Marcus Vance</div>

              {/* P.12 FILE_HEADER metadata card — pinned to aside floor for R.6 bottom-align */}
              <div className="mt-auto pt-10">
                <div className="border border-on-background/30 bg-background p-4 font-mono text-[11px] text-on-surface-variant">
                  <p className="font-bold uppercase tracking-[0.22em] underline underline-offset-4 text-primary mb-3">MASTHEAD · ISSUE 14</p>
                  <ul className="flex flex-col gap-1.5">
                    <li className="flex justify-between"><span>VOLUME:</span><span className="font-bold text-primary">XIV · Spring MMXXVI</span></li>
                    <li className="flex justify-between"><span>PRESSED:</span><span>Saint-Pierre · 02-04</span></li>
                    <li className="flex justify-between"><span>PAPER:</span><span>Munken Pure · 120 g/m²</span></li>
                    <li className="flex justify-between"><span>TYPE:</span><span>Newsreader · Noto Serif</span></li>
                    <li className="flex justify-between"><span>EDITION:</span><span>2,400 numbered</span></li>
                  </ul>
                  <hr className="border-on-background/20 my-3" />
                  <p className="uppercase tracking-[0.18em] text-[9px]">SIGNED OFF BY THE EDITOR.<br/>Plates verified against the negative.</p>
                </div>
              </div>
            </aside>
          </div>

          {/* Section: Photographers in this issue (image strip / marquee) */}
          <section className="mt-section-gap pt-16 border-t border-on-background/10">
            <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
              <div>
                <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3">— Behind the camera</div>
                <h3 className="font-headline-lg text-headline-lg text-primary leading-tight text-balance">Photographers in this issue.</h3>
              </div>
              <span className="font-metadata text-metadata text-on-surface-variant italic">Hover to pause · seven contributors, four continents.</span>
            </div>
            <div className="relative -mx-6 md:-mx-12 lg:-mx-16 overflow-hidden py-4">
              <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"></div>
              <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"></div>
              <div className="mag-marquee-track px-6 md:px-12 lg:px-16">
                {[...photographers, ...photographers].map((p, i) => (
                  <figure key={i} className={`shrink-0 ${p.width}`} aria-hidden={i >= photographers.length ? true : undefined}>
                    <div className={`${p.aspect} overflow-hidden rounded-sm bg-surface-container relative`}>
                      <img className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-110 hover:grayscale-0 transition-all duration-1000" src={`https://images.unsplash.com/photo-${p.id}?w=${p.aspect === "aspect-[3/4]" ? 900 : 1100}&q=85&auto=format&fit=crop`} alt={i < photographers.length ? `${p.name}, ${p.city}` : ""} loading="lazy" />
                    </div>
                    <figcaption className="mt-4 flex items-baseline justify-between gap-3 border-t border-on-background/10 pt-3">
                      <span className="font-headline-md text-primary italic text-xl leading-tight">{p.name}</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{p.city}</span>
                    </figcaption>
                    <p className="font-metadata text-metadata text-on-surface-variant mt-1">{p.caption}</p>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Press Shelf — quoted by, syndicated to, reprinted in */}
          <section className="mt-section-gap pt-16 border-t border-on-background/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-end mb-12">
              <div className="md:col-span-7">
                <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3">— On the press shelf</div>
                <h3 className="font-headline-lg text-headline-lg text-primary leading-tight text-balance">Reprinted, syndicated, & quoted at length.</h3>
              </div>
              <p className="md:col-span-5 font-body-md text-body-md text-on-surface-variant text-pretty md:text-right">A small number of houses we trust to carry our long-form on. We do not syndicate widely; the list below is the entirety of the past four issues.</p>
            </div>
            <div className="border-y border-on-background/10 py-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-8 items-center justify-items-center">
                {pressShelf.map(slug => (
                  <a key={slug} href="#" className="mag-press-mark inline-flex items-center justify-center h-10" aria-label={`Reprinted in ${slug}`}>
                    <img src={`https://cdn.simpleicons.org/${slug}/1d1c15`} alt={slug} className="h-7 md:h-8 w-auto" loading="lazy" decoding="async" />
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 text-on-surface-variant">
              <span className="font-metadata text-metadata italic">+ 19 mentions in trade press, Spring 2024 — full ledger on request.</span>
              <span className="font-label-caps text-label-caps uppercase tracking-widest">Periphery · House register · MMXXIV</span>
            </div>
          </section>

          {/* Section: Field Notes (3 alternating image+content rows) */}
          <section className="mt-section-gap pt-16 border-t border-on-background/10">
            <div className="mb-12">
              <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3">— Field Notes</div>
              <h3 className="font-headline-lg text-headline-lg text-primary leading-tight text-balance max-w-3xl">Three pieces, written away from the desk.</h3>
            </div>
            <div className="flex flex-col gap-16">
              {fieldNotes.map(n => (
                <article key={n.no} className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center group">
                  <a href="#" className="contents">
                    <figure className={`relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-container md:col-span-7 ${n.reverse ? "md:order-2 order-1" : ""}`}>
                      <img className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-[0.2] group-hover:scale-105 transition-all duration-[1500ms] ease-out" src={`https://images.unsplash.com/photo-${n.img}?w=1600&q=85&auto=format&fit=crop`} alt={n.alt} loading="lazy" />
                      <span className="absolute top-4 left-4 font-label-caps text-label-caps uppercase tracking-widest bg-background/85 backdrop-blur-sm text-primary px-3 py-1.5 rounded-sm">No. {n.no} · {n.locale}</span>
                    </figure>
                  </a>
                  <div className={`md:col-span-5 flex flex-col gap-4 ${n.reverse ? "md:order-1 order-2" : ""}`}>
                    <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{n.tag}</div>
                    <h4 className="font-headline-md text-headline-md text-primary italic text-balance group-hover:text-secondary transition-colors duration-300">{n.title}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-pretty max-w-prose">{n.body}</p>
                    <div className="font-metadata text-metadata text-on-surface-variant pt-3 border-t border-on-background/10 flex items-center justify-between">
                      <span>{n.byline}</span>
                      <span className="italic">— photographs: own work</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Section: Subscription tiers (R.12 premium 4-card editorial) */}
          <section className="mt-section-gap pt-16 border-t border-on-background/10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
              <div className="max-w-xl">
                <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3">— How to read Periphery</div>
                <h3 className="font-headline-lg text-headline-lg text-primary leading-tight text-balance">Four ways to keep the journal on the table.</h3>
              </div>
              <p className="md:max-w-md font-body-md text-body-md text-on-surface-variant text-pretty md:text-right">Each issue is hand-stitched in Saint-Pierre, posted in a linen wrap. We print to order; the closing date for the next issue is the eighth of every quarter.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {tiers.map(t => (
                <article key={t.title} className={`relative bg-surface-container-low border border-on-background/10 rounded-sm p-7 lg:p-8 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-500 ${t.featured ? "mag-tier-featured" : ""}`}>
                  {t.featured ? (
                    <span className="absolute -top-3 left-7 font-label-caps text-label-caps uppercase tracking-widest bg-secondary text-on-secondary px-2.5 py-1 rounded-sm">Most chosen</span>
                  ) : null}
                  <div className="inline-flex w-12 h-12 rounded-sm bg-background border border-on-background/15 items-center justify-center text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={t.glyph} />
                    </svg>
                  </div>
                  <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{t.tag}</div>
                  <h4 className="font-headline-md text-primary italic text-2xl leading-tight">{t.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-pretty flex-1">{t.body}</p>
                  <span className="mt-3 pt-4 border-t border-on-background/10 font-label-caps text-label-caps uppercase tracking-widest text-primary tabular-nums">{t.chip}</span>
                </article>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-metadata text-metadata text-on-surface-variant">
              <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true"></span>Unconditional refund within 30 days.</span>
              <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true"></span>Posted from Saint-Pierre · 2,400 copies.</span>
              <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true"></span>No advertising in the printed pages.</span>
            </div>
          </section>

          {/* Section: Contributors */}
          <section className="mt-section-gap pt-16 border-t border-on-background/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
              <div className="lg:col-span-5">
                <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3">— Contributors</div>
                <h3 className="font-headline-lg text-headline-lg text-primary leading-tight text-balance">In this issue, fourteen voices.</h3>
              </div>
              <p className="lg:col-span-7 font-body-md text-body-md text-on-surface-variant text-pretty max-w-prose self-end">Five of them new to the masthead. The remaining nine return after long absences — by design. Periphery commissions slowly. Below, a small selection of those whose work shapes Spring 2024.</p>
            </div>
            <ol className="flex flex-col border-t border-b border-on-background/10 divide-y divide-on-background/10">
              {contributors.map(c => (
                <li key={c.numeral} className="grid grid-cols-12 gap-4 lg:gap-8 py-8 items-center">
                  <span className="col-span-2 md:col-span-1 font-headline-lg text-primary italic text-2xl md:text-3xl tabular-nums">{c.numeral}</span>
                  <div className="col-span-10 md:col-span-2 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shrink-0">
                      <img className="w-full h-full object-cover filter grayscale" src={`https://images.unsplash.com/photo-${c.img}?w=200&q=80&auto=format&fit=crop`} alt={c.name} loading="lazy" />
                    </div>
                    <span className="font-headline-md text-primary italic text-xl">{c.name}</span>
                  </div>
                  <p className="col-span-12 md:col-span-6 font-body-md text-body-md text-on-surface-variant text-pretty">{c.body}</p>
                  <div className="col-span-12 md:col-span-3 flex flex-wrap gap-2 justify-start md:justify-end">
                    {c.tags.map(t => (
                      <span key={t} className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant border border-on-background/15 px-2 py-1 rounded-sm">{t}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Section: The Reading Room — R.18 Inner Circle premium image-bg */}
          <section className="relative mt-section-gap py-24 md:py-32 border-y border-on-background/15 overflow-hidden bg-on-background text-background">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1800&q=85&auto=format&fit=crop"
                alt="Editor's reading room — folio paper, brass lamp, low evening light."
                className="w-full h-full object-cover opacity-30 grayscale"
                loading="lazy" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-on-background via-on-background/85 to-on-background"></div>
              <div className="absolute inset-0 mag-noise opacity-20"></div>
            </div>
            <div className="relative max-w-2xl mx-auto px-6 text-center">
              <div aria-hidden="true" className="w-16 h-px bg-secondary/60 mx-auto mb-10"></div>
              <span className="inline-block font-label-caps text-label-caps uppercase tracking-widest border border-secondary/50 text-secondary-container px-3 py-1.5 rounded-sm">By invitation</span>
              <h3 className="mt-8 font-display-masthead text-[clamp(2.25rem,4vw+1rem,3.75rem)] leading-[1.05] text-background italic text-balance">The Reading Room.</h3>
              <p className="mt-6 font-body-lg text-body-lg text-background/85 italic text-pretty">A small, untracked correspondence between the editor and ninety-six readers. One letter a fortnight, one essay in proof, one piece of marginalia per quarter — sent by post, in a paper envelope, signed by hand.</p>
              <p className="mt-5 font-label-caps text-label-caps uppercase tracking-[0.28em] text-background/60">Ninety-six seats · London · Paris · Tokyo · Buenos Aires</p>

              <form className="mt-10 max-w-md mx-auto flex items-end gap-3 border-b border-background/40 pb-3" onSubmit={(e) => e.preventDefault()}>
                <label className="flex-1 text-left">
                  <span className="block font-label-caps text-label-caps uppercase tracking-widest text-background/60 mb-2">Postal address</span>
                  <input type="email" required placeholder="reader@city.com" className="w-full bg-transparent text-background placeholder:text-background/40 font-body-md text-body-md focus:outline-none focus:ring-0 border-0" />
                </label>
                <button type="submit" className="font-label-caps text-label-caps uppercase tracking-widest text-secondary-container hover:text-background transition-colors pb-1 whitespace-nowrap">Request →</button>
              </form>

              <div aria-hidden="true" className="w-16 h-px bg-secondary/60 mx-auto mt-12"></div>
              <p className="mt-6 font-metadata text-metadata text-background/55 italic">MMXIV — present · No public roster · Reply by post within 21 days.</p>
            </div>
          </section>

          {/* Section: Reading Order */}
          <section className="mt-section-gap pt-16 pb-section-gap border-t border-on-background/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-end mb-12">
              <div className="md:col-span-7">
                <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3">— Reading order</div>
                <h3 className="font-headline-lg text-headline-lg text-primary leading-tight text-balance">A small prescription for the next ninety minutes.</h3>
              </div>
              <p className="md:col-span-5 font-body-md text-body-md text-on-surface-variant text-pretty mag-drop-cap">Read in the order below for the cleanest arc of the issue. Each piece is dated, timed, and held to a single sitting; we recommend the cartographer first, the manuscript last.</p>
            </div>
            <ol className="flex flex-col border-t border-b border-on-background/10 divide-y divide-on-background/10">
              {readingOrder.map(r => (
                <li key={r.num} className="grid grid-cols-12 gap-4 py-7 items-center">
                  <span className="col-span-2 md:col-span-1 font-display-masthead text-primary italic leading-none text-[40px] md:text-[56px] tabular-nums">{r.num}</span>
                  <div className="col-span-7 md:col-span-7 flex flex-col gap-1">
                    <h4 className="font-headline-md text-primary italic text-xl md:text-2xl">{r.title}</h4>
                    <span className="font-metadata text-metadata text-on-surface-variant">{r.meta}</span>
                  </div>
                  <span className="col-span-3 md:col-span-2 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant text-right tabular-nums">{r.read}</span>
                  <a className="col-span-12 md:col-span-2 font-label-caps text-label-caps text-secondary uppercase tracking-widest text-right hover:underline" href="#">Read →</a>
                </li>
              ))}
            </ol>
            <p className="font-metadata text-metadata text-on-surface-variant italic text-center mt-8">Total reading time, end to end: roughly one hour and forty-four minutes. Tea is permitted between pieces three and four.</p>
          </section>

          {/* Section: Closing plates — image strip before footer (R.17, 8 squares, static) */}
          <section className="border-t border-on-background/10 pt-16 pb-12">
            <div className="text-center mb-10">
              <div className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3">— From the production room</div>
              <h3 className="font-headline-lg text-headline-lg text-primary leading-tight text-balance max-w-2xl mx-auto">Eight plates from the week we went to press.</h3>
              <p className="mt-4 font-metadata text-metadata text-on-surface-variant italic">Photographed in-house by the editorial team · Saint-Pierre, March 2024.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {closingPlates.map(p => (
                <figure key={p.id} className="aspect-square rounded-sm overflow-hidden border border-on-background/10 bg-surface-container group">
                  <img
                    src={`https://images.unsplash.com/photo-${p.id}?w=600&q=80&auto=format&fit=crop`}
                    alt={p.alt}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy" decoding="async"
                  />
                </figure>
              ))}
            </div>
          </section>
        </main>

        <footer className="w-full border-t border-on-background/10 mt-auto bg-surface-container-low text-on-background py-16 px-6 md:px-12 lg:px-16">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
            <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
              <a href="#" className="text-4xl font-headline-lg italic text-primary hover:text-secondary transition-colors inline-block w-fit">Periphery</a>
              <p className="font-body-md text-on-surface-variant max-w-sm text-pretty">An independent journal dedicated to long-form journalism, cultural criticism, and in-depth interviews.</p>
              <div className="font-metadata text-metadata text-on-surface-variant mt-4">© 2024 Periphery Magazine.<br />All rights reserved.</div>
            </div>
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerCols.map((col, i) => (
                <nav key={i} className="flex flex-col gap-4" aria-label={`Footer Section ${i + 1}`}>
                  {col.map(label => (
                    <a key={label} href="#" className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider hover:text-secondary hover:italic transition-all w-fit">{label}</a>
                  ))}
                </nav>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
