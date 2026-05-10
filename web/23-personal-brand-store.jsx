const NAV_LINKS = [
  { label: "About", href: "#", active: true },
  { label: "Essays", href: "#" },
  { label: "Speaking", href: "#" },
  { label: "Consulting", href: "#" }
];

const HERO_LINKS = [
  { label: "Read my newsletter", href: "#" },
  { label: "Book me to speak", href: "#" },
  { label: "Hire me to advise", href: "#" }
];

const FEATURED_HERO = ["The New York Times", "The Wall Street Journal", "The Atlantic"];

const DOCTRINE = [
  { numeral: "I.", title: "Plain language is a discipline.", body: "An idea you can't say without jargon is an idea you don't yet understand." },
  { numeral: "II.", title: "Operators write better than writers operate.", body: "Drafts get sharper after a quarter inside the thing you're describing." },
  { numeral: "III.", title: "A reader is not a user.", body: "Essays are for the person on the bus. Memos are for the person in the room." },
  { numeral: "IV.", title: "Most strategy is taste.", body: "The frameworks come later. Choose what you can defend without a slide." },
  { numeral: "V.", title: "Ship the essay.", body: "A finished piece in public is worth four better drafts in a folder." }
];

const ESSAYS = [
  { date: "October 12, 2024", title: "The Art of Operating", body: "We often confuse execution with strategy. True operational excellence lies in the quiet spaces between decisions, where culture is built and sustained." },
  { date: "September 28, 2024", title: "On Narrative Complexity", body: "In an age of simplified soundbites, defending nuance is an act of rebellion. Why the best leaders are comfortable living in the gray area." },
  { date: "August 15, 2024", title: "The Operator's Dilemma", body: "Scaling a company requires breaking the very processes that got you there. A reflection on knowing when to rebuild from the ground up." }
];

const LIBRARY = [
  { num: "No. 01", title: "The Lonely City", author: "Olivia Laing", img: "https://images.unsplash.com/photo-1664786200000-b1424aa47dff?w=900&q=85&auto=format&fit=crop", alt: "A library shelf, photographed in soft light" },
  { num: "No. 02", title: "High Output Management", author: "Andy Grove", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", alt: "A pale interior corridor with classical detail" },
  { num: "No. 03", title: "Several short sentences about writing", author: "Verlyn Klinkenborg", img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop", alt: "An architectural cornice photographed against a pale sky" },
  { num: "No. 04", title: "A Field Guide to Getting Lost", author: "Rebecca Solnit", img: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop", alt: "A modernist staircase in a pale interior" },
  { num: "No. 05", title: "The Hard Thing About Hard Things", author: "Ben Horowitz", img: "https://images.unsplash.com/photo-1618488373960-404fe668e524?w=900&q=85&auto=format&fit=crop", alt: "A brutalist concrete corridor" },
  { num: "No. 06", title: "On Writing Well", author: "William Zinsser", img: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=900&q=85&auto=format&fit=crop", alt: "A pale interior with a hanging light fixture" },
  { num: "No. 07", title: "Bird by Bird", author: "Anne Lamott", img: "https://images.unsplash.com/photo-1622912058707-1b33af81db4f?w=900&q=85&auto=format&fit=crop", alt: "An expansive modernist facade in soft light" },
  { num: "No. 08", title: "Status and Culture", author: "W. David Marx", img: "https://images.unsplash.com/photo-1527844817887-9b937993518b?w=900&q=85&auto=format&fit=crop", alt: "A still life of brass apothecary objects on dark wood" }
];

const PROCESS = [
  { numeral: "01.", weeks: "Week 1 · 2", title: "Research", body: "Two weeks of reading, interviews, and walking the perimeter of the question. Notes go into a single folder; nothing gets thrown away yet." },
  { numeral: "02.", weeks: "Week 3 · 5", title: "Drafting", body: "A first draft, written quickly and badly on purpose. The point is to find the spine. Anything that sounds clever in week three is suspect." },
  { numeral: "03.", weeks: "Week 6 · 8", title: "Editing", body: "A pass for argument, a pass for line, a pass for cuts. Three trusted readers see it before anyone else does." },
  { numeral: "04.", weeks: "Week 9 · 10", title: "Shipping", body: "A final read on paper, a typeset proof, and the piece goes out at 9am on a Sunday. The next folder opens on Monday." }
];

const TESTIMONIALS = [
  { quote: "The clearest writing on operating I read all year. I keep one essay open in a tab and re-read it before every board meeting.", name: "Mara Kenji", role: "COO · Linear Supply", img: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=200&q=85&auto=format&fit=crop", alt: "Portrait of Mara Kenji" },
  { quote: "Tessa writes like an editor and thinks like an operator. The combination is rare and the essays are how I figure out what I think.", name: "Henry Ahn", role: "Editor · Long Form Quarterly", img: "https://images.unsplash.com/photo-1622626426572-c268eb006092?w=200&q=85&auto=format&fit=crop", alt: "Portrait of Henry Ahn" },
  { quote: "I sent the Operator's Notebook to every founder in our portfolio. Two of them sent it on to their boards within the week.", name: "Iris Vela", role: "Partner · Threadwork Capital", img: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=200&q=85&auto=format&fit=crop", alt: "Portrait of Iris Vela" }
];

const EVENTS = [
  { title: "The Next 10 Years Summit", location: "San Francisco, CA", role: "Keynote" },
  { title: "Code & Context", location: "London, UK", role: "Panel" },
  { title: "Oxford Union Debate", location: "Oxford, UK", role: "Guest Speaker" },
  { title: "SXSW Panel", location: "Austin, TX", role: "Moderator" }
];

const LOGO_WALL = ["Fast Company", "WIRED", "Harvard Business Review", "Forbes", "Bloomberg", "Monocle", "Vogue Business", "Financial Times"];

const FAQS = [
  { q: "What's the refund policy?", a: "Thirty days, no questions, no forms. Reply to the order email and the refund goes out the same week." },
  { q: "Do you offer team licences?", a: "Yes. Bundles of 10, 25, and 50 are listed on the order page. Larger groups, write to me directly and we'll work something out." },
  { q: "Can I support without buying?", a: "The newsletter is free and will stay that way. The single most useful thing you can do is forward an essay you liked to one person who'd disagree with it." },
  { q: "Are essays DRM-free?", a: "Always. PDFs and ePubs ship without watermarks, expiry, or login walls. They're yours to keep, annotate, and re-read offline." },
  { q: "How do I get notified about new drops?", a: "Newsletter subscribers see new books, courses, and limited drops 48 hours before anyone else. No social posts, no DMs - just the inbox." },
  { q: "Do you take guest essays or commissions?", a: "I take one or two outside commissions a year and almost no guest essays — the throughline matters more than the rate. If you have a specific brief in mind, send the question first and we'll see whether the answer earns a piece." },
  { q: "Where do book proceeds go?", a: "After printing and shipping, twenty per cent of the net goes to the Internet Archive and the Newcomers' Library Fund in Lisbon. The rest pays for the next book and the next twelve months of essays — that's it." }
];

const FOOTER_LINKS = ["Newsletter", "Privacy Policy", "LinkedIn", "Substack"];

const TAILWIND_CONFIG = `
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "primary": "#4d0516", "on-primary": "#ffffff", "primary-container": "#6b1d2a", "on-primary-container": "#ef848f", "on-primary-fixed-variant": "#7c2a36",
          "secondary": "#605e5a", "on-secondary": "#ffffff", "secondary-container": "#e6e2dc", "on-secondary-container": "#666460",
          "tertiary": "#002b1b", "on-tertiary": "#ffffff",
          "surface": "#fcf9f8", "on-surface": "#1b1c1c", "surface-variant": "#e5e2e1", "on-surface-variant": "#554243", "surface-container": "#f0eded", "surface-container-high": "#eae7e7", "surface-container-low": "#f6f3f2", "surface-container-lowest": "#ffffff",
          "background": "#fcf9f8", "on-background": "#1b1c1c", "outline": "#877273", "outline-variant": "#dac0c1"
        },
        fontFamily: {
          "body-lg": ["Inter", "sans-serif"], "body-md": ["Inter", "sans-serif"], "label-caps": ["Inter", "sans-serif"],
          "headline-md": ["Newsreader", "serif"], "headline-lg": ["Newsreader", "serif"], "display-xl": ["Newsreader", "serif"]
        },
        fontSize: {
          "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
          "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
          "label-caps": ["12px", { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "600" }],
          "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
          "headline-lg": ["48px", { lineHeight: "1.2", fontWeight: "500" }],
          "display-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }]
        }
      }
    }
  }
`;

const CUSTOM_CSS = `
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  html, body { overflow-x: clip; }
  .full-bleed {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    max-width: none;
  }
  .tv-marquee-track {
    display: flex;
    gap: 28px;
    width: max-content;
    animation: tv-marquee-x 60s linear infinite;
  }
  .tv-marquee-track:hover { animation-play-state: paused; }
  @keyframes tv-marquee-x {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 14px)); }
  }
  .tv-faq summary::-webkit-details-marker { display: none; }
  .tv-faq summary { list-style: none; cursor: pointer; }
  .tv-faq summary .tv-chevron { transition: transform 250ms ease; }
  .tv-faq[open] summary .tv-chevron { transform: rotate(180deg); }
  @media (prefers-reduced-motion: reduce) {
    .tv-marquee-track { animation: none; }
    .tv-faq summary .tv-chevron { transition: none; }
  }
`;

export default function T23PersonalBrandStore() {
  const libraryDoubled = [...LIBRARY, ...LIBRARY];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: TAILWIND_CONFIG }} />
      <style dangerouslySetInnerHTML={{ __html: CUSTOM_CSS }} />

      <div className="bg-[#F8F4EE] text-on-surface antialiased">
        <header className="bg-[#F8F4EE] w-full border-b border-stone-200">
          <div className="flex justify-between items-center gap-3 w-full px-4 py-4 max-w-[1280px] mx-auto sm:px-6 sm:py-5 md:px-8 md:py-6">
            <div className="text-lg font-serif font-bold text-[#6B1D2A] sm:text-xl md:text-2xl">Tessa Varga</div>
            <nav className="hidden md:flex space-x-8">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} className={l.active
                  ? "font-serif text-stone-900 uppercase tracking-widest text-sm text-[#6B1D2A] border-b-2 border-[#6B1D2A] pb-1 transition-colors duration-300 ease-in-out"
                  : "font-serif text-stone-500 uppercase tracking-widest text-sm hover:text-[#6B1D2A] transition-colors duration-300 ease-in-out"}>{l.label}</a>
              ))}
            </nav>
            <button className="hidden md:block font-label-caps text-label-caps text-on-primary bg-primary-container px-6 py-3 hover:bg-on-primary-fixed-variant transition-colors">
              Get in Touch
            </button>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="max-w-[1280px] mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center lg:gap-16">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative w-full aspect-[3/4] bg-secondary-container">
                  <img alt="Tessa Varga — editorial portrait, soft window light" className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply opacity-90" src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=85&auto=format&fit=crop" />
                </div>
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-8 lg:space-y-12">
                <div>
                  <h1 className="font-display-xl text-[36px] leading-[1.05] text-primary-container mb-4 sm:text-[48px] sm:mb-6 md:text-display-xl">Tessa Varga</h1>
                  <p className="font-headline-md text-[20px] leading-tight text-on-surface-variant max-w-2xl sm:text-[26px] md:text-headline-md">
                    Writer. Operator. Previously at Stripe & Andreessen Horowitz.
                  </p>
                </div>
                <div className="space-y-6">
                  {HERO_LINKS.map((l) => (
                    <a key={l.label} href={l.href} className="flex items-center space-x-4 text-on-surface hover:text-primary-container group transition-colors">
                      <span className="w-8 h-px bg-[#222] opacity-15 group-hover:bg-primary-container group-hover:opacity-100 transition-all"></span>
                      <span className="font-body-lg text-body-lg">{l.label}</span>
                      <span className="material-symbols-outlined text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span>
                    </a>
                  ))}
                </div>
                <div className="pt-8 border-t border-[#222]/10">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest sm:mb-6">Featured in</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-60 grayscale sm:space-x-8 sm:gap-x-0">
                    {FEATURED_HERO.map((name) => (
                      <span key={name} className="font-headline-md text-sm font-bold sm:text-base md:text-xl">{name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NEW: Manifesto / Doctrine - tinted band */}
          <section className="full-bleed bg-surface-container-high py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-stretch">
                <div className="md:col-span-4 flex flex-col gap-6 md:h-full md:justify-between">
                  <div className="flex flex-col gap-4">
                    <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.25em] block">— II · Doctrine</span>
                    <p className="font-body-md text-body-md text-on-surface-variant">A short list of things I believe about the work, kept in plain view so I can be held to them.</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">Five tenets, drafted on the back of a Lisbon coffee receipt in 2017 and revised every winter since. They are the spine of every piece I publish — and the first thing I cut when an essay starts feeling clever instead of clear.</p>
                    <p className="font-body-md text-body-md text-on-surface-variant italic">Disagreement is welcome. The doctrine is mine; the work is everyone&apos;s.</p>
                  </div>

                  {/* Doctrine ledger card — pins to bottom of left column to align with right column */}
                  <aside className="bg-surface-container-lowest border border-[#222]/10 p-5 sm:p-6 flex flex-col gap-4 mt-6 md:mt-0">
                    <div className="flex items-baseline justify-between gap-3 pb-3 border-b border-[#222]/15">
                      <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.3em]">Field log · 2026</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">REV · IV</span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div className="flex flex-col gap-0.5">
                        <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Drafted</dt>
                        <dd className="font-headline-md text-[20px] text-on-surface tabular-nums">2017</dd>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Last revision</dt>
                        <dd className="font-headline-md text-[20px] text-on-surface tabular-nums">2026</dd>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Tenets</dt>
                        <dd className="font-headline-md text-[20px] text-on-surface tabular-nums">V</dd>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Cuts</dt>
                        <dd className="font-headline-md text-[20px] text-on-surface tabular-nums">12</dd>
                      </div>
                    </dl>
                    <p className="font-body-md text-xs text-on-surface-variant border-t border-[#222]/15 pt-3 italic leading-relaxed text-pretty">
                      Each tenet survived three quarters and one hostile reader before earning a Roman numeral. The folder of cuts is longer than the list itself.
                    </p>
                  </aside>
                </div>
                <ol className="md:col-span-8 divide-y divide-[#222]/10 border-t border-[#222]/10">
                  {DOCTRINE.map((d) => (
                    <li key={d.numeral} className="py-6 grid grid-cols-12 gap-4 items-baseline">
                      <span className="col-span-2 sm:col-span-1 font-headline-md italic text-primary-container tabular-nums text-[24px]">{d.numeral}</span>
                      <div className="col-span-10 sm:col-span-11">
                        <h3 className="font-headline-md text-[22px] leading-tight text-on-surface mb-1 sm:text-[26px] md:text-headline-md">{d.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">{d.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="bg-[#E8E2D8] py-16 sm:py-20 md:py-24">
            <div className="max-w-[800px] mx-auto px-4 text-center space-y-6 sm:px-6 sm:space-y-8 md:px-8">
              <h2 className="font-headline-lg text-[26px] leading-tight text-primary-container sm:text-[36px] md:text-headline-lg">A Sunday reflection on systems and stories.</h2>
              <form className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <input className="w-full bg-transparent border-0 border-b border-[#222] px-0 py-3 font-body-md text-body-md focus:ring-0 focus:border-primary-container placeholder:text-on-surface-variant" placeholder="Email address" type="email" />
                <button className="w-full sm:w-auto font-label-caps text-label-caps text-on-primary bg-primary-container px-8 py-3 hover:bg-on-primary-fixed-variant transition-colors whitespace-nowrap" type="submit">
                  Join
                </button>
              </form>
            </div>
          </section>

          {/* NEW: Featured product spotlight - NOVEL #2 vertical image columns */}
          <section className="max-w-[1280px] mx-auto px-4 py-20 sm:px-6 sm:py-24 md:px-8 md:py-28">
            <div className="flex items-center gap-4 mb-10 sm:mb-14">
              <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.25em]">— IV · Featured</span>
              <div className="flex-1 h-px bg-[#222]/15"></div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">No. 04 · Pre-order</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch">
              <div className="md:col-span-6 grid grid-cols-2 gap-4 md:gap-6">
                <div className="relative aspect-[3/4] bg-surface-container overflow-hidden">
                  <img alt="A long, brutalist concrete corridor lit from above" className="absolute inset-0 w-full h-full object-cover grayscale" src="https://images.unsplash.com/photo-1618488373960-404fe668e524?w=900&q=85&auto=format&fit=crop" />
                  <span className="absolute top-4 left-4 font-label-caps text-label-caps text-white uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Plate · I</span>
                </div>
                <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mt-8 md:mt-16">
                  <img alt="A pale interior with a single hanging light fixture" className="absolute inset-0 w-full h-full object-cover grayscale" src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=900&q=85&auto=format&fit=crop" />
                  <span className="absolute top-4 left-4 font-label-caps text-label-caps text-white uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Plate · II</span>
                </div>
              </div>
              <div className="md:col-span-6 flex flex-col justify-between gap-10">
                <div>
                  <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-widest mb-4 block">A 96-page essay collection</span>
                  <h2 className="font-headline-lg text-[28px] leading-tight text-primary-container mb-6 sm:text-[40px] md:text-headline-lg">The Operator's Notebook</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">Twelve essays on the unglamorous middle of building a company. Drafted between 5am flights, edited inside Notes, set in Newsreader on uncoated cream stock.</p>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[#222]/15 pt-6">
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Format</dt>
                    <dd className="font-body-md text-body-md text-on-surface">Hardcover · 96pp</dd>
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Edition</dt>
                    <dd className="font-body-md text-body-md text-on-surface">First · 2,400 copies</dd>
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Ships</dt>
                    <dd className="font-body-md text-body-md text-on-surface">May · 2026</dd>
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Price</dt>
                    <dd className="font-headline-md text-[22px] text-primary-container">USD 38</dd>
                  </dl>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a className="flex-1 text-center font-label-caps text-label-caps text-on-primary bg-primary-container px-8 py-4 hover:bg-on-primary-fixed-variant transition-colors uppercase tracking-widest" href="#">Pre-order · USD 38</a>
                  <a className="flex-1 text-center font-label-caps text-label-caps text-primary-container border border-primary-container px-8 py-4 hover:bg-primary-container hover:text-on-primary transition-colors uppercase tracking-widest" href="#">Read a sample</a>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Essays */}
          <section className="max-w-[1280px] mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
            <div className="flex justify-between items-end mb-10 sm:mb-16">
              <h2 className="font-headline-lg text-[26px] leading-tight text-primary-container sm:text-[36px] md:text-headline-lg">Recent Essays</h2>
              <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-container uppercase tracking-widest transition-colors pb-1 border-b border-transparent hover:border-primary-container" href="#">View all</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ESSAYS.map((e) => (
                <article key={e.title} className="group cursor-pointer">
                  <div className="h-px w-full bg-[#222]/15 mb-6 group-hover:bg-primary-container transition-colors"></div>
                  <time className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-4">{e.date}</time>
                  <h3 className="font-headline-md text-[22px] leading-tight text-on-surface mb-4 group-hover:text-primary-container transition-colors sm:text-[26px] md:text-headline-md">{e.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{e.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* NEW: Editorial photo essay - NOVEL #11 wide cinema strip 21:9 full-bleed */}
          <section className="full-bleed py-12 md:py-16">
            <div className="relative w-full overflow-hidden aspect-[21/9] bg-surface-container">
              <img alt="A long modernist building photographed in soft daylight" className="absolute inset-0 w-full h-full object-cover grayscale" src="https://images.unsplash.com/photo-1622912058707-1b33af81db4f?w=2400&q=85&auto=format&fit=crop" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div>
                  <p className="font-label-caps text-label-caps text-white/85 uppercase tracking-[0.25em] mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">From the studio · Spring 2026</p>
                  <h3 className="font-headline-md text-[24px] leading-tight text-white max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:text-[32px] md:text-headline-md">A week in Lisbon, written in margins.</h3>
                </div>
                <span className="font-label-caps text-label-caps text-white/80 uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Plate · III</span>
              </div>
            </div>
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#222]/15 pt-4">
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">A photo essay accompanying the May newsletter. Three days, two cafés, one stubborn paragraph.</p>
                <a className="font-label-caps text-label-caps text-primary-container uppercase tracking-widest border-b border-primary-container pb-1 hover:opacity-70 transition-opacity self-start sm:self-auto" href="#">Read the dispatch</a>
              </div>
            </div>
          </section>

          {/* NEW: Reading list / Library - horizontal marquee */}
          <section className="full-bleed bg-surface-container-low py-20 md:py-28 overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 mb-10 md:mb-14">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.25em] block mb-3">— VI · Library</span>
                  <h2 className="font-headline-lg text-[26px] leading-tight text-primary-container sm:text-[36px] md:text-headline-lg">Currently on the desk.</h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm hidden md:block">Eight books I'm reading, re-reading, or arguing with this season. Hover to pause.</p>
              </div>
            </div>
            <div className="overflow-hidden py-2">
              <div className="tv-marquee-track">
                {libraryDoubled.map((b, i) => (
                  <a key={`${b.num}-${i}`} aria-hidden={i >= LIBRARY.length ? "true" : undefined} className="shrink-0 w-56 group" href="#">
                    <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-3">
                      <img alt={i >= LIBRARY.length ? "" : b.alt} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={b.img} />
                      <span className="absolute top-3 left-3 font-label-caps text-label-caps text-white uppercase tracking-widest drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">{b.num}</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] leading-tight text-on-surface mb-1">{b.title}</h3>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{b.author}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Speaking Section */}
          <section className="max-w-[1280px] mx-auto px-4 py-16 border-t border-[#222]/10 sm:px-6 sm:py-20 md:px-8 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-1 flex flex-col gap-6 lg:h-full lg:justify-between">
                <div className="flex flex-col gap-6">
                  <h2 className="font-headline-lg text-[26px] leading-tight text-primary-container sm:text-[36px] md:text-headline-lg">Speaking</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Selected appearances and keynotes on strategy, scaling, and leadership.</p>
                  <a className="font-label-caps text-label-caps border border-[#222] px-6 py-3 hover:bg-[#222] hover:text-white transition-colors inline-block text-center w-full" href="#">Book Inquiry</a>
                </div>

                {/* Speaking ledger card — pins to bottom of left column to align with events list */}
                <aside className="bg-surface-container-lowest border border-[#222]/10 p-5 flex flex-col gap-3 mt-6 lg:mt-0">
                  <div className="flex items-baseline justify-between gap-3 pb-3 border-b border-[#222]/15">
                    <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.3em]">2024 · log</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">14 stops</span>
                  </div>
                  <dl className="flex flex-col gap-2 font-body-md text-[14px]">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Keynotes</dt>
                      <dd className="text-on-surface tabular-nums">06</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Panels</dt>
                      <dd className="text-on-surface tabular-nums">05</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Workshops</dt>
                      <dd className="text-on-surface tabular-nums">03</dd>
                    </div>
                  </dl>
                  <p className="font-body-md text-xs text-on-surface-variant border-t border-[#222]/15 pt-3 italic leading-relaxed">
                    Travel within the EU + East Coast US. One keynote a month, two open weeks each quarter.
                  </p>
                </aside>
              </div>
              <div className="lg:col-span-3 space-y-8">
                {EVENTS.map((ev) => (
                  <div key={ev.title} className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#222]/15 pb-8 group">
                    <div className="mb-2 md:mb-0">
                      <h3 className="font-headline-md text-[20px] leading-tight text-on-surface group-hover:text-primary-container transition-colors sm:text-[24px] md:text-headline-md">{ev.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{ev.location}</p>
                    </div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{ev.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* NEW: Process - NOVEL #8 sticky photo + scrolling text */}
          <section className="max-w-[1280px] mx-auto px-4 py-20 sm:px-6 sm:py-24 md:px-8 md:py-28">
            <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
              <div>
                <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.25em] block mb-3">— IX · Process</span>
                <h2 className="font-headline-lg text-[26px] leading-tight text-primary-container sm:text-[36px] md:text-headline-lg">How a piece is made.</h2>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest hidden sm:block">Four stages · 6–10 weeks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
              <div className="md:col-span-5">
                <div className="md:sticky md:top-24 self-start">
                  <div className="relative w-full aspect-[3/4] bg-surface-container overflow-hidden">
                    <img alt="A long, brutalist concrete corridor, soft daylight" className="absolute inset-0 w-full h-full object-cover grayscale" src="https://images.unsplash.com/photo-1618488373960-404fe668e524?w=1200&q=85&auto=format&fit=crop" />
                    <span className="absolute bottom-4 left-4 font-label-caps text-label-caps text-white uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Studio · No. 02</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-4">A photograph from the working desk. The studio sits two streets from the Tagus, behind a green door.</p>
                </div>
              </div>
              <ol className="md:col-span-7 space-y-12 md:space-y-16">
                {PROCESS.map((p) => (
                  <li key={p.numeral} className="grid grid-cols-12 gap-4 items-start">
                    <span className="col-span-2 font-headline-md italic text-primary-container tabular-nums text-[28px]">{p.numeral}</span>
                    <div className="col-span-10">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-2">{p.weeks}</span>
                      <h3 className="font-headline-md text-[22px] leading-tight text-on-surface mb-3 sm:text-[26px] md:text-headline-md">{p.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* NEW: Testimonials - 3-card grid with portraits */}
          <section className="full-bleed bg-surface-container py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
                <div>
                  <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.25em] block mb-3">— X · Readers</span>
                  <h2 className="font-headline-lg text-[26px] leading-tight text-primary-container sm:text-[36px] md:text-headline-lg">What readers tell me.</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {TESTIMONIALS.map((t) => (
                  <figure key={t.name} className="bg-surface-container-lowest p-8 flex flex-col gap-6">
                    <span className="material-symbols-outlined text-primary-container text-3xl">format_quote</span>
                    <blockquote className="font-headline-md italic text-[20px] leading-snug text-on-surface sm:text-[22px]">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="flex items-center gap-4 mt-auto pt-6 border-t border-[#222]/10">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                        <img alt={t.alt} className="absolute inset-0 w-full h-full object-cover grayscale" src={t.img} />
                      </div>
                      <div>
                        <p className="font-headline-md text-[16px] text-on-surface">{t.name}</p>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{t.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Featured In Logo Wall */}
          <section className="bg-[#E8E2D8] py-16 sm:py-20 md:py-24">
            <div className="max-w-[1280px] mx-auto px-4 text-center sm:px-6 md:px-8">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-8 uppercase tracking-widest sm:mb-12">Featured In & Trusted By</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 items-center opacity-50 grayscale mix-blend-multiply sm:gap-x-8 sm:gap-y-12 md:gap-x-12 md:gap-y-16">
                {LOGO_WALL.map((name) => (
                  <span key={name} className="font-headline-md text-sm font-bold sm:text-lg md:text-2xl">{name}</span>
                ))}
              </div>
            </div>
          </section>

          {/* NEW: FAQ accordion */}
          <section className="max-w-[1280px] mx-auto px-4 py-20 sm:px-6 sm:py-24 md:px-8 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-24 lg:gap-32 items-stretch">
              <div className="md:col-span-4 flex flex-col gap-6 md:h-full md:justify-between">
                <div className="flex flex-col gap-4">
                  <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.25em] block">— XII · Questions</span>
                  <h2 className="font-headline-lg text-[26px] leading-tight text-primary-container sm:text-[36px] md:text-headline-lg">Frequently asked.</h2>
                </div>

                {/* Reply windows card — middle */}
                <aside className="bg-surface-container-lowest border border-[#222]/10 p-5 sm:p-6 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between gap-3 pb-3 border-b border-[#222]/15">
                    <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.3em]">Reply windows</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">2026</span>
                  </div>
                  <dl className="flex flex-col gap-2 font-body-md text-[14px]">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Mon — Fri</dt>
                      <dd className="text-on-surface tabular-nums">≈ 36&thinsp;h</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Weekends</dt>
                      <dd className="text-on-surface">paused, on purpose</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">August</dt>
                      <dd className="text-on-surface tabular-nums">slow · 5–7 days</dd>
                    </div>
                  </dl>
                  <p className="font-body-md text-xs text-on-surface-variant border-t border-[#222]/15 pt-3 italic leading-relaxed">
                    Real but unhurried. Long answers live in the essays; the longer-than-long ones arrive in the Sunday newsletter.
                  </p>
                </aside>

                {/* Direct line card — pins to bottom of left column to align with FAQ list */}
                <aside className="bg-surface-container-lowest border border-[#222]/10 p-5 sm:p-6 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between gap-3 pb-3 border-b border-[#222]/15">
                    <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-[0.3em]">Direct line</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">Q · 06+</span>
                  </div>
                  <dl className="flex flex-col gap-2 font-body-md text-[14px]">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Inbox</dt>
                      <dd className="text-on-surface">hello@tessavarga.com</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">Office hours</dt>
                      <dd className="text-on-surface">First Wed · monthly</dd>
                    </div>
                  </dl>
                  <p className="font-body-md text-xs text-on-surface-variant border-t border-[#222]/15 pt-3 italic leading-relaxed">
                    Anything not covered above. One sentence, one ask — clarity rewarded.
                  </p>
                </aside>
              </div>
              <div className="md:col-span-8 divide-y divide-[#222]/15 border-t border-b border-[#222]/15">
                {FAQS.map((f) => (
                  <details key={f.q} className="tv-faq group py-6">
                    <summary className="flex items-center justify-between gap-6">
                      <h3 className="font-headline-md text-[20px] leading-tight text-on-surface sm:text-[22px] md:text-[24px]">{f.q}</h3>
                      <span className="material-symbols-outlined tv-chevron text-primary-container shrink-0">expand_more</span>
                    </summary>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-2xl">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="max-w-[800px] mx-auto px-4 py-20 text-center sm:px-6 sm:py-24 md:px-8 md:py-32">
            <h2 className="font-headline-lg text-[26px] leading-tight text-primary-container mb-8 sm:text-[36px] md:text-headline-lg">For inquiries regarding speaking, writing, or advisory work.</h2>
            <a className="font-body-lg text-body-lg border-b border-[#222] pb-1 hover:text-primary-container hover:border-primary-container transition-colors break-all" href="mailto:hello@tessavarga.com">hello@tessavarga.com</a>
          </section>
        </main>

        <footer className="bg-[#F8F4EE] w-full border-t border-stone-200">
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 py-8 max-w-7xl mx-auto gap-4 sm:px-8 sm:py-10 md:px-16 md:py-12 md:gap-0">
            <p className="font-serif text-xs uppercase tracking-tighter text-[#6B1D2A] text-center md:text-left">© 2024 Tessa Varga. All rights reserved.</p>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:space-x-8 sm:gap-x-0">
              {FOOTER_LINKS.map((l) => (
                <a key={l} href="#" className="font-serif text-xs uppercase tracking-tighter text-stone-400 hover:text-[#6B1D2A] transition-colors focus:ring-1 focus:ring-[#6B1D2A]">{l}</a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
