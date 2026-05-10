const STRIP_LEFT = [
  { id: "1490481651871-ab68de25d43d", caption: "2024 · NYC",  tone: "grayscale opacity-80" },
  { id: "1609530142110-7af0a038c723", caption: "field notes", tone: "grayscale-0 opacity-100" },
  { id: "1776275758873-31603dd06112", caption: "Mar · studio", tone: "grayscale opacity-80" },
  { id: "1622912058707-1b33af81db4f", caption: "Brooklyn",    tone: "grayscale-0 opacity-100" },
  { id: "1517677208171-0bc6725a3e60", caption: "portrait",    tone: "grayscale opacity-80" },
  { id: "1685787773514-90e8e14af797", caption: "window",      tone: "grayscale-0 opacity-100" }
];

const STRIP_RIGHT = [
  { id: "1539109136881-3be0616acf4b", caption: "desk · ix",    tone: "grayscale-0 opacity-100" },
  { id: "1618488373960-404fe668e524", caption: "corridor",     tone: "grayscale opacity-80" },
  { id: "1502716119720-b23a93e5fe1b", caption: "2023 · ME",    tone: "grayscale-0 opacity-100" },
  { id: "1762215781547-2ac20ed42cd1", caption: "interior",     tone: "grayscale opacity-80" },
  { id: "1483985988355-763728e1935b", caption: "portrait, ii", tone: "grayscale-0 opacity-100" },
  { id: "1766604106308-58b6d0d676bf", caption: "building",     tone: "grayscale opacity-80" }
];

const ARCHIVE_POSTS = [
  { id: "1518770660439-4636190af475", date: "Apr 12 · 2023", kind: "Notes", read: "8 min",  title: "Parsing attention.", href: "/archive/parsing-attention", alt: "A circuit board macro photograph." },
  { id: "1762215781547-2ac20ed42cd1", date: "Feb 03 · 2023", kind: "Essay", read: "14 min", title: "A long, quiet tool.", href: "/archive/long-quiet-tools", alt: "An empty architectural interior." },
  { id: "1685787773514-90e8e14af797", date: "Nov 18 · 2022", kind: "Field", read: "6 min",  title: "The notebook as operating system.", href: "/archive/notebook-as-os", alt: "A still architectural light study." },
  { id: "1518770660439-4636190af475", date: "Jul 22 · 2022", kind: "Essay", read: "11 min", title: "The computer as instrument.", href: "/archive/computer-as-instrument", alt: "Macro photograph of a green circuit board." },
  { id: "1527844817887-9b937993518b", date: "May 06 · 2022", kind: "Notes", read: "9 min",  title: "Keeping a commonplace.", href: "/archive/keeping-a-commonplace", alt: "A still life of small objects in amber light." },
  { id: "1609530142110-7af0a038c723", date: "Mar 11 · 2022", kind: "Essay", read: "12 min", title: "Against launch week.", href: "/archive/against-launch-week", alt: "A heavy concrete facade in raking light." }
];

const SHELF = [
  { id: "1609530142110-7af0a038c723", title: "A Pattern Language", author: "Christopher Alexander", note: '"The first design book that ever made me cry."' },
  { id: "1622912058707-1b33af81db4f", title: "In Praise of Shadows", author: "Junichirō Tanizaki", note: '"On the dignity of dim rooms."' },
  { id: "1664786200000-b1424aa47dff", title: "The Craftsman", author: "Richard Sennett", note: '"Why we make things, even badly."' },
  { id: "1685787773514-90e8e14af797", title: "How To Do Nothing", author: "Jenny Odell", note: '"Attention as a kind of refusal."' },
  { id: "1762215781547-2ac20ed42cd1", title: "The Order of Time", author: "Carlo Rovelli", note: '"A small physics book about waiting."' },
  { id: "1664786200000-b1424aa47dff", title: "Getting Lost", author: "Rebecca Solnit", note: '"Maps as confession."' }
];

const NOW_COLS = [
  { label: "Currently", items: ["— Drafting an essay on the limits of autocomplete.", "— Reading three books at once, badly.", "— Walking the same six blocks every morning."] },
  { label: "Recently",  items: ["— Finished a small CLI for journaling.", "— Spoke at a tiny meet-up in Hudson.", "— Re-organised the bookshelves, finally."] },
  { label: "Soon",      items: ["— A printed broadsheet of the year's essays.", "— Office hours in March, by appointment.", "— Quieter Octobers."] }
];

const FAQS = [
  { q: "Why are the essays so long?", a: "Because most of the things I want to say take more than 800 words to say honestly, and shorter pieces tend to come out either confident or evasive — neither of which is the texture I like to read." },
  { q: "How often do you publish?", a: "Roughly once every two weeks, sometimes more like every three. There is a small newsletter that goes out the morning after each essay lands; it is the most reliable way to hear from me." },
  { q: "Can I republish or quote an essay?", a: "Quotes — yes, freely, with a link back. Full reposts — please write me first. I almost always say yes; I just want to know where the work is going." },
  { q: "Do you do consulting or contract work?", a: "A small amount of writing-and-research work, mostly with libraries, museums, and patient long-form software teams. Three or four engagements a year. I am picky about it on purpose." },
  { q: "How can I support this work?", a: "The best way is to read carefully and write back; the second-best way is to share an essay with one specific person who would like it. There is no paywall, and there are no plans for one." }
];

const FIELD_PLATES = [
  { id: "1776524039930-ea1ed83b0f97", caption: "Plate · 03 — A machine asleep.", alt: "An industrial shape in evening light." },
  { id: "1618488373960-404fe668e524", caption: "Plate · 04 — Corridor, late.",   alt: "A long architectural corridor." }
];

// B&W image rails flanking the centered masthead (full-width navbar fill)
const MASTHEAD_LEFT = [
  "1490481651871-ab68de25d43d",
  "1488161628813-04466f872be2",
  "1776275758873-31603dd06112",
  "1517677208171-0bc6725a3e60",
  "1539109136881-3be0616acf4b"
];
const MASTHEAD_RIGHT = [
  "1502716119720-b23a93e5fe1b",
  "1483985988355-763728e1935b",
  "1485231183945-fffde7cc051e",
  "1609530142110-7af0a038c723",
  "1622912058707-1b33af81db4f"
];

const customCss = `
  html, body { overflow-x: clip; }
  .mira-strip-img { transition: filter 600ms ease, opacity 600ms ease; }
  .mira-strip-img:hover { filter: grayscale(0); opacity: 1; }
  .mira-faq summary::-webkit-details-marker { display: none; }
  .mira-faq summary { list-style: none; cursor: pointer; }
  .mira-faq summary .mira-chevron { transition: transform 250ms ease; display: inline-block; }
  .mira-faq[open] summary .mira-chevron { transform: rotate(45deg); }
  .mira-shelf-track {
    animation: mira-shelf 70s linear infinite;
    width: max-content;
    display: flex;
    gap: 28px;
  }
  .mira-shelf-track:hover { animation-play-state: paused; }
  @keyframes mira-shelf {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 14px)); }
  }
  .mira-archive-fade { opacity: 0.78; transition: opacity 400ms ease, filter 400ms ease; }
  .mira-archive-fade:hover { opacity: 1; filter: saturate(1.05); }

  @media (prefers-reduced-motion: reduce) {
    .mira-shelf-track { animation: none; }
    .mira-strip-img, .mira-archive-fade { transition: none; }
    .mira-faq summary .mira-chevron { transition: none; }
  }
`;

export default function T35PersonalBlog() {
  const navLinks = [
    { href: "/archive", label: "Archive" },
    { href: "/about", label: "About" },
    { href: "/subscribe", label: "Subscribe" }
  ];

  const groups = [
    {
      year: "2024",
      posts: [
        { date: "2024-10-15", display: "Oct 15", title: "The Friction of Smooth Interfaces", desc: "When we remove all resistance from our tools, we often remove the very feedback mechanisms required for mastery." },
        { date: "2024-08-22", display: "Aug 22", title: "Maintenance as a Creative Act", desc: "We fetishize the launch of new software, yet the quiet, ongoing work of keeping systems alive is where the true craft lies." },
        { date: "2024-05-10", display: "May 10", title: "Reading in the Age of Agility", desc: "How the relentless cadence of sprints and standups erodes our capacity for deep, uninterrupted contemplation." }
      ]
    },
    {
      year: "2023",
      posts: [
        { date: "2023-11-04", display: "Nov 04", title: "The Elegance of Plain Text", desc: "A defense of the simplest data format we have, and why durability matters more than rich formatting in the long run." },
        { date: "2023-07-18", display: "Jul 18", title: "Against \"User-Friendly\"", desc: "Sometimes, an interface should demand something of the person using it." }
      ]
    }
  ];

  const footerLinks = [
    { href: "/privacy", label: "Privacy" },
    { href: "/rss", label: "RSS" },
    { href: "/contact", label: "Contact" }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fdf8f8", "on-background": "#1c1b1b",
            "surface": "#fdf8f8", "on-surface": "#1c1b1b", "on-surface-variant": "#444748",
            "surface-container-low": "#f7f3f2", "surface-container": "#f1edec",
            "surface-container-high": "#ebe7e6",
            "primary": "#000000", "on-primary": "#ffffff",
            "secondary": "#3c5d9c", "on-secondary": "#ffffff", "secondary-container": "#98b8fe",
            "tertiary": "#000000", "on-tertiary": "#ffffff", "tertiary-container": "#1d1b1a",
            "outline": "#747878", "outline-variant": "#c4c7c7"
          },
          borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
          spacing: { "gutter": "2rem", "max_width": "680px", "section_gap": "8rem", "paragraph_gap": "2.5rem" },
          fontFamily: {
            "h1": ["Newsreader", "serif"], "h2": ["Newsreader", "serif"],
            "body-md": ["Newsreader", "serif"], "body-lg": ["Newsreader", "serif"],
            "metadata": ["Space Grotesk", "sans-serif"]
          },
          fontSize: {
            "h1": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "400" }],
            "h2": ["32px", { lineHeight: "1.3", fontWeight: "400" }],
            "body-md": ["18px", { lineHeight: "1.7", fontWeight: "400" }],
            "body-lg": ["21px", { lineHeight: "1.8", fontWeight: "400" }],
            "metadata": ["14px", { lineHeight: "1.5", letterSpacing: "0.05em", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const stripImg = (id) => `https://images.unsplash.com/photo-${id}?w=320&q=85&auto=format&fit=crop`;
  const shelfImg = (id) => `https://images.unsplash.com/photo-${id}?w=400&h=600&q=85&auto=format&fit=crop`;
  const archiveImg = (id) => `https://images.unsplash.com/photo-${id}?w=600&q=85&auto=format&fit=crop`;

  const Strip = ({ items, label }) => (
    <aside aria-hidden="true" className="hidden md:block">
      <div className="md:sticky md:top-24 flex flex-col gap-4 py-8">
        {items.map((it, i) => (
          <figure key={`${label}-${i}-${it.id}`} className="flex flex-col gap-1">
            <div className="overflow-hidden rounded bg-surface-container-low aspect-[3/4]">
              <img alt="" loading="lazy" className={`mira-strip-img w-full h-full object-cover ${it.tone}`} src={stripImg(it.id)} />
            </div>
            <figcaption className="font-metadata text-[10px] uppercase tracking-[0.18em] text-on-surface-variant pt-1">{it.caption}</figcaption>
          </figure>
        ))}
        <div className="font-metadata text-[10px] uppercase tracking-[0.22em] text-outline pt-2 border-t border-outline-variant">{label}</div>
      </div>
    </aside>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="light bg-background text-on-background min-h-screen flex flex-col items-center">
        {/* Full-width navbar with B&W image rails flanking the centered masthead */}
        <header className="w-full pt-16 pb-8 md:pt-0 md:pb-0 md:min-h-[320px] border-b border-zinc-100 bg-white grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch">
          <aside aria-hidden="true" className="hidden md:flex items-stretch overflow-hidden">
            <div className="flex flex-1 gap-1.5 items-stretch py-2">
              {MASTHEAD_LEFT.map((id) => (
                <div key={`mh-l-${id}`} className="flex-1 overflow-hidden bg-zinc-100">
                  <img alt="" loading="lazy" src={`https://images.unsplash.com/photo-${id}?w=320&q=85&auto=format&fit=crop`} className="w-full h-full object-cover grayscale opacity-90"/>
                </div>
              ))}
            </div>
          </aside>
          <div className="w-full max-w-[680px] mx-auto md:px-12 md:py-16 px-6 flex flex-col items-center gap-8">
            <a className="text-3xl font-h1 text-h1 lowercase tracking-tight text-zinc-900 hover:opacity-70 transition-opacity" href="/">mira</a>
            <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-md italic">Essays about working with computers, mostly.</p>
            <nav aria-label="Main Navigation" className="flex gap-8 items-center">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="text-zinc-500 uppercase text-xs tracking-widest font-metadata text-metadata hover:text-zinc-900 transition-colors duration-300 cursor-pointer active:opacity-70">{l.label}</a>
              ))}
            </nav>
          </div>
          <aside aria-hidden="true" className="hidden md:flex items-stretch overflow-hidden">
            <div className="flex flex-1 gap-1.5 items-stretch py-2">
              {MASTHEAD_RIGHT.map((id) => (
                <div key={`mh-r-${id}`} className="flex-1 overflow-hidden bg-zinc-100">
                  <img alt="" loading="lazy" src={`https://images.unsplash.com/photo-${id}?w=320&q=85&auto=format&fit=crop`} className="w-full h-full object-cover grayscale opacity-90"/>
                </div>
              ))}
            </div>
          </aside>
        </header>

        {/* 3-column wrapper: vertical image strips frame the central reading column */}
        <div className="relative w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)_140px] lg:grid-cols-[160px_minmax(0,1fr)_160px] gap-0 md:gap-8 lg:gap-12">

          <Strip items={STRIP_LEFT} label="Margin notes · I" />

          <main className="w-full max-w-[680px] mx-auto px-6 py-section_gap flex-grow flex flex-col gap-section_gap">
            {groups.map(g => (
              <section key={g.year} className="flex flex-col gap-8">
                <h2 className="font-metadata text-metadata uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant pb-2 mb-4">{g.year}</h2>
                {g.posts.map(p => (
                  <article key={p.date} className="flex flex-col sm:flex-row gap-4 sm:gap-8 group cursor-pointer">
                    <time className="font-metadata text-metadata text-on-surface-variant sm:w-24 shrink-0 pt-1" dateTime={p.date}>{p.display}</time>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-h2 text-h2 text-on-surface group-hover:text-secondary transition-colors duration-200">{p.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{p.desc}</p>
                    </div>
                  </article>
                ))}
              </section>
            ))}

            {/* NEW: Featured Essay (cinema strip 21:9) — NOVEL #11 */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4 border-b border-outline-variant pb-3">
                <span className="font-metadata text-metadata uppercase tracking-[0.2em] text-on-surface-variant">Featured · Long Read</span>
                <span className="font-metadata text-[12px] uppercase tracking-[0.18em] text-outline">5 min read</span>
              </div>
              <figure className="flex flex-col gap-4">
                <div className="overflow-hidden rounded bg-surface-container-low aspect-[21/9]">
                  <img alt="A cinematic wide architectural interior in muted tones." loading="lazy" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1600&q=85&auto=format&fit=crop" />
                </div>
                <figcaption className="flex flex-col gap-3">
                  <h3 className="font-h2 text-h2 text-on-surface italic">Slow software, or: how I learned to wait again.</h3>
                  <blockquote className="font-body-lg text-body-lg text-on-surface-variant border-l border-secondary pl-5 italic">
                    "The fastest interface is the one that gives you a reason to come back." Three months on a single essay, written longhand, transcribed twice, pruned to half its weight.
                  </blockquote>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-metadata text-metadata text-on-surface-variant">
                    <span className="uppercase tracking-[0.18em] text-[12px]">Sept 30 · 2024</span>
                    <span className="uppercase tracking-[0.18em] text-[12px] text-secondary">Essay</span>
                    <span className="uppercase tracking-[0.18em] text-[12px]">Print issue · 04</span>
                  </div>
                </figcaption>
              </figure>
            </section>

            {/* NEW: Field Notes (layered photo composition) — NOVEL #5 */}
            <section className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="font-metadata text-metadata uppercase tracking-[0.2em] text-on-surface-variant">Photo essay · No. II</span>
                <h2 className="font-h2 text-h2 text-on-surface italic">Field notes from a quiet studio.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-prose">Frames I keep returning to. Most of them have nothing to do with the essay they accompany — which is, I have come to suspect, the entire point of a margin photograph.</p>
              </div>
              <div className="relative">
                <div className="overflow-hidden rounded bg-surface-container-low aspect-[4/3]">
                  <img alt="Large editorial portrait in deep contrast." loading="lazy" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=1200&q=85&auto=format&fit=crop" />
                </div>
                <div className="absolute -bottom-8 -right-4 sm:-right-12 w-32 sm:w-44 aspect-[3/4] overflow-hidden rounded bg-surface-container-low border-4 border-background rotate-3 shadow-lg">
                  <img alt="A still-life of brass and amber objects." loading="lazy" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1527844817887-9b937993518b?w=600&q=85&auto=format&fit=crop" />
                </div>
                <div className="absolute -top-6 -left-4 sm:-left-10 w-28 sm:w-36 aspect-[3/4] overflow-hidden rounded bg-surface-container-low border-4 border-background -rotate-2 shadow-lg hidden sm:block">
                  <img alt="A b&w portrait, half in shadow." loading="lazy" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=85&auto=format&fit=crop" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-12">
                {FIELD_PLATES.map((p, i) => (
                  <figure key={`fp-${i}`} className="flex flex-col gap-2">
                    <div className="overflow-hidden rounded bg-surface-container-low aspect-[4/5]">
                      <img alt={p.alt} loading="lazy" className="w-full h-full object-cover" src={`https://images.unsplash.com/photo-${p.id}?w=800&q=85&auto=format&fit=crop`} />
                    </div>
                    <figcaption className="font-metadata text-[12px] uppercase tracking-[0.18em] text-on-surface-variant">{p.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            {/* NEW: Reading List / Archive grid */}
            <section className="flex flex-col gap-8">
              <div className="flex items-end justify-between gap-4 border-b border-outline-variant pb-3">
                <h2 className="font-metadata text-metadata uppercase tracking-[0.2em] text-on-surface-variant">From the archive</h2>
                <a className="font-metadata text-[12px] uppercase tracking-[0.18em] text-outline hover:text-on-surface transition-colors" href="/archive">All essays →</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {ARCHIVE_POSTS.map((post, i) => (
                  <a key={`ap-${i}`} className="mira-archive-fade flex flex-col gap-3 group" href={post.href}>
                    <div className="overflow-hidden rounded bg-surface-container-low aspect-[4/3]">
                      <img alt={post.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={archiveImg(post.id)} />
                    </div>
                    <div className="flex items-center gap-3 font-metadata text-[12px] uppercase tracking-[0.18em] text-on-surface-variant">
                      <span>{post.date}</span><span className="text-outline">·</span><span className="text-secondary">{post.kind}</span><span className="text-outline">· {post.read}</span>
                    </div>
                    <h3 className="font-h2 text-[22px] leading-tight text-on-surface group-hover:text-secondary transition-colors">{post.title}</h3>
                  </a>
                ))}
              </div>
            </section>

            {/* NEW: About the Writer (sticky-photo + scrolling text) — NOVEL #8 */}
            <section className="flex flex-col gap-8">
              <span className="font-metadata text-metadata uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant pb-3">About · Mira Halloran</span>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                <figure className="md:col-span-5 md:sticky md:top-24 md:self-start flex flex-col gap-4">
                  {/* Plain B&W photo — no overlay */}
                  <div className="overflow-hidden rounded bg-surface-container-low aspect-[4/5]">
                    <img alt="Portrait of the writer at a desk." loading="lazy" className="w-full h-full object-cover grayscale contrast-105" src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=85&auto=format&fit=crop" />
                  </div>

                  {/* PLATE_HEADER — modeled on the FILE_HEADER from 61-brutalism-raw */}
                  <div className="border border-on-surface bg-surface-container-low p-4 font-metadata text-[11px] text-on-surface">
                    <p className="font-bold uppercase tracking-[0.22em] underline underline-offset-4 mb-3">PLATE_HEADER</p>
                    <ul className="flex flex-col gap-1.5 m-0 p-0 list-none">
                      <li className="flex justify-between gap-3 uppercase tracking-[0.05em]"><span className="text-on-surface-variant">NAME:</span><span className="font-bold">portrait_03.jpg</span></li>
                      <li className="flex justify-between gap-3 uppercase tracking-[0.05em]"><span className="text-on-surface-variant">SIZE:</span><span>2.4 MB</span></li>
                      <li className="flex justify-between gap-3 uppercase tracking-[0.05em]"><span className="text-on-surface-variant">ROLL:</span><span>42 / 36</span></li>
                      <li className="flex justify-between gap-3 uppercase tracking-[0.05em]"><span className="text-on-surface-variant">SHOT:</span><span>2024-03-08</span></li>
                      <li className="flex justify-between gap-3 uppercase tracking-[0.05em]"><span className="text-on-surface-variant">LENS:</span><span>50mm · f/2.8</span></li>
                      <li className="flex justify-between gap-3 uppercase tracking-[0.05em]"><span className="text-on-surface-variant">SIGNED:</span><span>@MIRA</span></li>
                    </ul>
                    <hr className="border-outline-variant my-3" />
                    <p className="text-on-surface-variant uppercase tracking-[0.18em] text-[9px] leading-relaxed">VERIFIED BY DARKROOM.<br/>Hash matches negative.</p>
                  </div>
                </figure>
                <div className="md:col-span-7 flex flex-col gap-paragraph_gap">
                  <p className="font-body-lg text-body-lg text-on-surface italic">I write essays about working with computers — slowly, mostly — from a small studio in Brooklyn.</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">Before this, I spent ten years building software for libraries and small museums; before that, I studied literature, poorly. The essays here grow out of that double life: a stubborn affection for the tools, and a deeper affection for the things the tools were built to serve. I publish here once a fortnight when I can manage it, less often when I cannot.</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">If you wrote me, I will eventually answer. If you sent something to read, I have probably already finished it twice.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-outline-variant">
                    <div className="flex flex-col gap-2">
                      <span className="font-metadata text-[11px] uppercase tracking-[0.22em] text-outline">Currently reading</span>
                      <p className="font-body-md text-[16px] text-on-surface italic">A Pattern Language — Christopher Alexander.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-metadata text-[11px] uppercase tracking-[0.22em] text-outline">Currently building</span>
                      <p className="font-body-md text-[16px] text-on-surface italic">A small reading log, in plain text.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* NEW: Currently / Now-page (3-col micro-format) */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4 border-b border-outline-variant pb-3">
                <h2 className="font-metadata text-metadata uppercase tracking-[0.2em] text-on-surface-variant">Now · Updated this week</h2>
                <a className="font-metadata text-[12px] uppercase tracking-[0.18em] text-outline hover:text-on-surface transition-colors" href="/now">/now →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {NOW_COLS.map((col, i) => (
                  <div key={`nc-${i}`} className={`flex flex-col gap-3 ${i > 0 ? "md:border-l md:border-outline-variant md:pl-8" : ""}`}>
                    <span className="font-metadata text-[11px] uppercase tracking-[0.22em] text-secondary">{col.label}</span>
                    <ul className="flex flex-col gap-2 font-body-md text-[16px] text-on-surface-variant leading-relaxed">
                      {col.items.map((line, j) => (<li key={`ni-${i}-${j}`}>{line}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* NEW: Bookshelf marquee */}
            <section className="flex flex-col gap-6">
              <div className="flex items-end justify-between gap-4 border-b border-outline-variant pb-3">
                <h2 className="font-metadata text-metadata uppercase tracking-[0.2em] text-on-surface-variant">On the shelf</h2>
                <span className="font-metadata text-[12px] uppercase tracking-[0.18em] text-outline">Recent · Recommend</span>
              </div>
              <div className="overflow-hidden -mx-6 sm:mx-0 py-2">
                <div className="mira-shelf-track">
                  {[...SHELF, ...SHELF].map((b, i) => (
                    <figure key={`sh-${i}`} aria-hidden={i >= SHELF.length ? "true" : undefined} className="flex flex-col gap-2 shrink-0 w-40">
                      <div className="overflow-hidden rounded bg-surface-container-low aspect-[2/3]">
                        <img alt={i < SHELF.length ? `Book spine — ${b.title}.` : ""} loading="lazy" className="w-full h-full object-cover" src={shelfImg(b.id)} />
                      </div>
                      <figcaption className="flex flex-col gap-1">
                        <span className="font-h2 text-[16px] leading-tight text-on-surface italic">{b.title}</span>
                        <span className="font-metadata text-[11px] uppercase tracking-[0.18em] text-outline">{b.author}</span>
                        <span className="font-body-md text-[13px] text-on-surface-variant leading-snug">{b.note}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            {/* NEW: FAQ accordion */}
            <section className="flex flex-col gap-6">
              <div className="flex items-end justify-between gap-4 border-b border-outline-variant pb-3">
                <h2 className="font-metadata text-metadata uppercase tracking-[0.2em] text-on-surface-variant">Questions, occasionally.</h2>
                <span className="font-metadata text-[12px] uppercase tracking-[0.18em] text-outline">FAQ · 05</span>
              </div>
              <div className="divide-y divide-outline-variant border-y border-outline-variant">
                {FAQS.map((f, i) => (
                  <details key={`fq-${i}`} className="mira-faq group py-5 px-1">
                    <summary className="flex items-center justify-between gap-6">
                      <h3 className="font-h2 text-[20px] leading-snug text-on-surface italic">{f.q}</h3>
                      <span className="mira-chevron font-metadata text-[20px] text-on-surface-variant select-none leading-none">+</span>
                    </summary>
                    <p className="font-body-md text-body-md text-on-surface-variant pt-4 pr-8">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mt-16 py-12 px-8 bg-surface-container-low border border-outline-variant rounded flex flex-col items-center text-center gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="font-body-lg text-body-lg text-on-surface italic">A quiet note in your inbox.</h3>
                <p className="font-metadata text-metadata text-on-surface-variant max-w-sm">New essays delivered infrequently. No tracking, no spam.</p>
              </div>
              <form action="#" method="POST" className="flex flex-col sm:flex-row gap-0 w-full max-w-md">
                <input type="email" required placeholder="email address" className="flex-grow bg-surface border border-outline-variant px-4 py-3 font-metadata text-metadata text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-0 rounded-t sm:rounded-tr-none sm:rounded-l transition-colors" />
                <button type="submit" className="bg-primary text-on-primary px-6 py-3 font-metadata text-metadata uppercase tracking-widest hover:bg-tertiary-container transition-colors rounded-b sm:rounded-bl-none sm:rounded-r border border-primary">Subscribe</button>
              </form>
            </section>
          </main>

          <Strip items={STRIP_RIGHT} label="Margin notes · II" />
        </div>

        {/* Footer — full screen width, mirrors the navbar with image rails flanking centred meta */}
        <footer className="w-full mt-24 border-t border-zinc-100 bg-white grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch md:min-h-[180px]">
          <aside aria-hidden="true" className="hidden md:flex items-stretch overflow-hidden">
            <div className="flex flex-1 gap-1.5 items-stretch py-2">
              {MASTHEAD_RIGHT.map((id) => (
                <div key={`fl-${id}`} className="flex-1 overflow-hidden bg-zinc-100">
                  <img alt="" loading="lazy" src={`https://images.unsplash.com/photo-${id}?w=320&q=85&auto=format&fit=crop`} className="w-full h-full object-cover grayscale opacity-90"/>
                </div>
              ))}
            </div>
          </aside>
          <div className="w-full max-w-[680px] mx-auto px-6 py-10 md:py-12 flex flex-col items-center gap-4">
            <a className="text-2xl font-h1 text-h1 lowercase tracking-tight text-zinc-900 hover:opacity-70 transition-opacity" href="/">mira</a>
            <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-6">
              {footerLinks.map(l => (
                <a key={l.href} href={l.href} className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-metadata text-metadata hover:text-zinc-900 transition-all duration-200">{l.label}</a>
              ))}
            </nav>
            <span className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-metadata text-metadata pt-2">© mira.writing · MMXXVI</span>
          </div>
          <aside aria-hidden="true" className="hidden md:flex items-stretch overflow-hidden">
            <div className="flex flex-1 gap-1.5 items-stretch py-2">
              {MASTHEAD_LEFT.map((id) => (
                <div key={`fr-${id}`} className="flex-1 overflow-hidden bg-zinc-100">
                  <img alt="" loading="lazy" src={`https://images.unsplash.com/photo-${id}?w=320&q=85&auto=format&fit=crop`} className="w-full h-full object-cover grayscale opacity-90"/>
                </div>
              ))}
            </div>
          </aside>
        </footer>
      </div>
    </>
  );
}
