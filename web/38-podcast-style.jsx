const NAV_LINKS = [
  { href: "#episodes", label: "Episodes" },
  { href: "#archive", label: "Archive" },
  { href: "#hosts", label: "Hosts" },
  { href: "#about", label: "About" },
  { href: "#subscribe", label: "Subscribe" }
];

const HERO_PLATFORMS = ["Apple Podcasts", "Spotify", "Overcast", "RSS"];

const EPISODES = [
  { num: "Episode 24", date: "2023-10-24", display: "Oct 24, 2023", duration: "54:21", title: "The Architecture of Systems", desc: "We sit down with Dr. Elena Rostova to unpack the hidden structures governing modern distributed networks, and why simplicity is the hardest metric to optimize." },
  { num: "Episode 23", date: "2023-10-17", display: "Oct 17, 2023", duration: "48:15", title: "Navigating The Noise", desc: "Author and critic Marcus Lin discusses the psychological toll of hyper-connectivity and his framework for intentional information consumption in the digital age." },
  { num: "Episode 22", date: "2023-10-10", display: "Oct 10, 2023", duration: "62:04", title: "The Future of Urban Mobility", desc: "City planner Sarah Jenkins outlines how micro-mobility and AI-driven traffic systems are reshaping the layout of major metropolitan areas." }
];

const ARCHIVE = [
  { ep: "S03 · E14", date: "2024-04-22", display: "Apr 22, 2024", duration: "52:14", title: "The Patience of Concrete", desc: "Architect Mira Halász on slow-cure materials and the ethics of the hundred-year building.", src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=900&q=85&auto=format&fit=crop", alt: "Brutalist concrete facade in raking afternoon light" },
  { ep: "S03 · E13", date: "2024-04-15", display: "Apr 15, 2024", duration: "1:04:22", title: "Apothecaries of Attention", desc: "Cognitive scientist Wren Okafor on the small economies of focus we trade away each morning.", src: "https://images.unsplash.com/photo-1527844817887-9b937993518b?w=900&q=85&auto=format&fit=crop", alt: "Brass apothecary objects on a dark surface" },
  { ep: "S03 · E12", date: "2024-04-08", display: "Apr 8, 2024", duration: "49:08", title: "Latent Hardware", desc: "Hardware historian Toma Ren on the long, quiet half-lives of forgotten silicon.", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85&auto=format&fit=crop", alt: "Macro detail of a printed circuit board" },
  { ep: "S03 · E11", date: "2024-04-01", display: "Apr 1, 2024", duration: "57:46", title: "Rooms That Listen", desc: "Acoustic designer Pell Inman on the architecture of conversation and the quiet rooms we keep returning to.", src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=900&q=85&auto=format&fit=crop", alt: "Minimal interior with diffuse window light" },
  { ep: "S03 · E10", date: "2024-03-25", display: "Mar 25, 2024", duration: "1:11:30", title: "The Long Stair", desc: "Civic strategist Iola Bremner on infrastructures that take a generation to climb, and how to keep faith with them.", src: "https://images.unsplash.com/photo-1618488373960-404fe668e524?w=900&q=85&auto=format&fit=crop", alt: "Concrete stairwell receding into shadow" },
  { ep: "S03 · E09", date: "2024-03-18", display: "Mar 18, 2024", duration: "43:55", title: "Sharp Shadows", desc: "Photographer Sune Castell on negative space, raking light, and the discipline of leaving a frame mostly empty.", src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop", alt: "Modernist building with sharp shadows" }
];

const HOSTS = [
  {
    name: "David Sterling",
    role: "Host · Editorial",
    bio: "Former staff writer at The Atlantic Review; nine years in long-form interviews with system architects, civic technologists, and the occasional sound engineer who refuses to be one.",
    italicize: "The Atlantic Review",
    socials: ["Letters", "Mastodon", "Are.na"],
    img1: { src: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=800&q=85&auto=format&fit=crop", alt: "David Sterling — editorial portrait, soft window light" },
    img2: { src: "https://images.unsplash.com/photo-1758518729058-b158e71c5a9b?w=800&q=85&auto=format&fit=crop", alt: "David at the studio desk, mid-thought" },
    layout: "left-tall"
  },
  {
    name: "Nori Aldama",
    role: "Co-Host · Producer",
    bio: "Field-recordist turned producer. Builds the show's sound from the room up — preferring close mics, slow rooms, and the kind of edit that doesn't announce itself. Co-founded The Lateral with David in 2021.",
    italicize: null,
    socials: ["Studio Notes", "Bandcamp", "Mastodon"],
    img1: { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85&auto=format&fit=crop", alt: "Nori Aldama — editorial portrait, low key" },
    img2: { src: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=800&q=85&auto=format&fit=crop", alt: "Nori at the mixing desk" },
    layout: "right-tall"
  }
];

const PLATFORMS_FULL = [
  { letter: "A", verb: "Listen on", name: "Apple Podcasts" },
  { letter: "S", verb: "Stream on", name: "Spotify" },
  { letter: "O", verb: "Subscribe via", name: "Overcast" },
  { letter: "P", verb: "Open in", name: "Pocket Casts" },
  { letter: "C", verb: "Listen on", name: "Castro" },
  { letter: "Y", verb: "Watch on", name: "YouTube" },
  { letter: "Æ", verb: "Subscribe via", name: "RSS Feed" },
  { letter: "G", verb: "Find on", name: "Goodpods" }
];

const STUDIO_SPECS = [
  ["Mics", "Coles 4038 · matched pair"],
  ["Console", "Neve 8816, half-broken"],
  ["Tape", "Studer A810, when patient"],
  ["Coffee", "Stumptown · Hair Bender"]
];

const FEATURED_GUESTS = [
  {
    label: "Guest · I — S03 · E14",
    quote: "A building's first decade is the cheap part. The hundred-year cost is whether the people inside still want to take care of it.",
    cite: "Mira Halász, architect — on patience as a structural material.",
    listen: "Listen to Episode 14",
    src: "https://images.unsplash.com/photo-1622626426572-c268eb006092?w=900&q=85&auto=format&fit=crop",
    alt: "Editorial portrait — Halász, looking off-frame",
    reverse: false
  },
  {
    label: "Guest · II — S03 · E13",
    quote: "Attention isn't infinite — it's a tide. The economy that owns the moon owns the tide. It would be useful to know who that is.",
    cite: "Wren Okafor, cognitive scientist — on the small economies of focus we trade away each morning.",
    listen: "Listen to Episode 13",
    src: "https://images.unsplash.com/photo-1765005204268-631d9e0c6fe1?w=900&q=85&auto=format&fit=crop",
    alt: "Editorial portrait — Okafor at a desk by a window",
    reverse: true
  },
  {
    label: "Guest · III — S03 · E10",
    quote: "Civic infrastructure used to be measured in lifespans. We measure it in budget cycles. The mismatch is what's breaking things, not the politics.",
    cite: "Iola Bremner, civic strategist — on infrastructures that take a generation to climb.",
    listen: "Listen to Episode 10",
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85&auto=format&fit=crop",
    alt: "Editorial portrait — Bremner, in a soft outdoor light",
    reverse: false
  }
];

const PRESS = [
  { quote: "The rare interview show that respects how slow a real conversation actually is. The Lateral lets sentences finish.", source: "— The New Inquiry" },
  { quote: "Sterling and Aldama interview the way other shows wish they wrote — patient, structural, and genuinely surprised by their own questions.", source: "— Reverse Shot Quarterly" },
  { quote: "A weekly argument for the long question. The closest thing audio has produced to a serious quarterly.", source: "— Pitchcraft Magazine" }
];

const SPONSORS = ["Are.na", "Stripe", "Atomic Industries", "Patagonia", "Fellow Coffee", "Readwise", "Field Notes", "Linear"];

const FAQ = [
  { q: "How often do new episodes drop?", a: "Wednesdays at 6 a.m. Eastern, every week of the year. Twelve weeks per season, three seasons per year, with a fortnight of silence between seasons. The schedule is the only thing about the show that doesn't drift." },
  { q: "How long are episodes?", a: "Forty-two to seventy-six minutes. Long enough to be useful; short enough to listen on a real walk. We edit for clarity, never for length, so individual episodes set their own pace." },
  { q: "Are transcripts available?", a: "Yes — every episode ships with a hand-edited transcript at publish time, free, with timestamps and footnoted references. Auto-transcripts are too lossy for the way our guests actually speak; we'd rather keep the line." },
  { q: "Can I sponsor an episode?", a: "We take one underwriter per episode, read by Nori, never mid-conversation. We say no to about four offers in five — usually because the message and the topic don't actually rhyme. Email the studio if you'd like to be the fifth." },
  { q: "Do you take guest pitches?", a: "Always. We read every pitch, even the ones we don't reply to. The strongest pitches name a question rather than a guest — tell us what you'd want them to be asked, and the rest tends to follow on its own." }
];

const SUBSCRIBE_ON = ["Apple Podcasts", "Spotify", "Google Podcasts"];
const FOOTER_LINKS = ["Apple Podcasts", "Spotify", "RSS", "Terms"];

export default function T38PodcastStyle() {
  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fcf9f8", "on-background": "#1b1c1c",
            "surface": "#fcf9f8", "on-surface": "#1b1c1c", "on-surface-variant": "#514346",
            "surface-container-lowest": "#ffffff", "surface-container-low": "#f6f3f2", "surface-container": "#f0eded", "surface-container-high": "#eae7e7", "surface-variant": "#e4e2e1",
            "primary": "#310918", "on-primary": "#ffffff", "primary-container": "#4b1e2c", "primary-fixed": "#ffd9e1", "primary-fixed-dim": "#f9b4c5", "on-primary-fixed-variant": "#6a3746",
            "secondary": "#7b580b", "on-secondary": "#ffffff", "secondary-container": "#fdcd78", "on-secondary-container": "#785508", "secondary-fixed": "#ffdea8", "secondary-fixed-dim": "#eebf6c",
            "tertiary": "#181815", "on-tertiary": "#ffffff", "tertiary-container": "#2d2d29", "tertiary-fixed-dim": "#c9c6c0",
            "outline": "#837376", "outline-variant": "#d5c2c5",
            "surface-tint": "#854e5d"
          },
          borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
          spacing: { "margin-mobile": "20px", "unit": "8px", "gutter": "24px", "section-gap": "120px", "container-max": "1200px" },
          fontFamily: {
            "display-xl": ["Newsreader", "serif"], "headline-lg": ["Newsreader", "serif"], "headline-md": ["Newsreader", "serif"],
            "body-md": ["Inter", "sans-serif"], "body-lg": ["Inter", "sans-serif"], "label-caps": ["Inter", "sans-serif"]
          },
          fontSize: {
            "display-xl": ["72px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
            "headline-lg": ["48px", { lineHeight: "1.2", fontWeight: "500" }],
            "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
            "body-lg": ["20px", { lineHeight: "1.6", fontWeight: "400" }],
            "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
            "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }]
          }
        }
      }
    }
  `;

  const css = `
    ::selection { background-color: #f9b4c5; color: #310918; }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    .lateral-marquee-track {
      display: flex;
      gap: 56px;
      width: max-content;
      animation: lateral-marquee 48s linear infinite;
    }
    .lateral-marquee-track:hover { animation-play-state: paused; }
    @keyframes lateral-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 28px)); }
    }
    .lateral-faq summary::-webkit-details-marker { display: none; }
    .lateral-faq summary { list-style: none; cursor: pointer; }
    .lateral-faq summary .lateral-chevron { transition: transform 250ms ease; }
    .lateral-faq[open] summary .lateral-chevron { transform: rotate(45deg); }
    .lateral-half-bleed { margin-right: calc(50% - 50vw); }
    @media (prefers-reduced-motion: reduce) {
      .lateral-marquee-track { animation: none !important; }
      .lateral-faq summary .lateral-chevron { transition: none; }
    }
    html, body { overflow-x: clip; }
  `;

  const PlayIcon = ({ size }) => (
    <span className={`material-symbols-outlined ${size}`} aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
  );

  const sponsorRow = [...SPONSORS, ...SPONSORS];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="light scroll-smooth bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col selection:bg-primary-fixed-dim selection:text-primary">
        <header className="bg-surface/95 backdrop-blur-md sticky top-0 w-full z-50 border-b border-outline-variant/30 transition-colors">
          <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-gutter h-20">
            <a href="#" className="text-2xl font-headline-lg font-bold tracking-tight text-primary" aria-label="The Lateral Home">The Lateral</a>
            <nav className="hidden md:flex gap-8 items-center" aria-label="Main Navigation">
              {NAV_LINKS.map(l => (
                <a key={l.href} href={l.href} className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-200">{l.label}</a>
              ))}
            </nav>
            <a href="#episodes" className="hidden md:inline-flex bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-caps text-label-caps hover:bg-primary-container transition-colors shadow-sm">Listen Now</a>
          </div>
        </header>

        <main className="flex-grow">
          {/* Hero — bigger, moodier */}
          <section className="relative bg-primary-container text-on-primary-container py-[80px] md:py-section-gap px-margin-mobile md:px-gutter overflow-hidden">
            {/* Atmospheric backdrop */}
            <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=85&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-15 mix-blend-luminosity grayscale contrast-110" />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,180,197,0.18) 0%, transparent 70%)" }}></div>
              <div className="absolute inset-0 bg-gradient-to-b from-primary-container via-primary-container/85 to-primary-container"></div>
            </div>

            <div className="relative z-10 max-w-container-max mx-auto grid md:grid-cols-12 gap-10 md:gap-12 items-center">
              <div className="md:col-span-5 aspect-square relative rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-secondary-fixed/20">
                <img alt="Editorial portrait of Dr. Elena Rostova in warm studio light — guest of Episode 24" className="object-cover w-full h-full grayscale contrast-110" src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=85&auto=format&fit=crop" width="800" height="800" loading="eager" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/45 via-transparent to-secondary-fixed/10 mix-blend-multiply pointer-events-none" aria-hidden="true"></div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <span className="font-label-caps text-label-caps text-on-primary uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Episode · 024</span>
                  <span className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">— ROSTOVA</span>
                </div>
              </div>
              <div className="md:col-span-7 flex flex-col gap-6">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                    <span className="w-10 h-px bg-secondary-fixed"></span>
                    Latest Episode · 54 min
                  </span>
                  <h1 className="font-display-xl text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-on-primary mb-6 text-balance">
                    The Architecture <em className="text-secondary-fixed">of Systems.</em>
                  </h1>
                  <p className="font-body-lg text-primary-fixed-dim max-w-[60ch] text-pretty">
                    We sit down with Dr. Elena Rostova to unpack the hidden structures governing modern distributed networks, and why simplicity is the hardest metric to optimize.
                  </p>
                  <a href="#about" className="inline-flex items-center text-secondary-fixed hover:text-secondary-fixed-dim transition-colors mt-6 border-b border-secondary-fixed/30 hover:border-secondary-fixed pb-1">
                    <span className="font-body-md font-medium">Guest: Dr. Elena Rostova</span>
                  </a>
                </div>
                <div className="bg-primary p-6 rounded-2xl border border-outline-variant/20 mt-4 shadow-lg flex flex-col gap-4">
                  <div className="flex items-center gap-5">
                    <button className="w-16 h-16 shrink-0 rounded-full bg-secondary-fixed text-on-secondary-container flex items-center justify-center hover:bg-secondary-fixed-dim transition-transform hover:scale-105 active:scale-95 shadow-md" aria-label="Play Episode: The Architecture of Systems">
                      <PlayIcon size="text-4xl" />
                    </button>
                    <div className="flex-grow flex flex-col gap-3">
                      <div className="flex justify-between font-label-caps text-label-caps text-primary-fixed-dim tabular-nums">
                        <span aria-hidden="true">18:42</span>
                        <span aria-hidden="true">-35:39</span>
                      </div>
                      <div className="h-1.5 bg-surface-tint/30 rounded-full relative overflow-hidden cursor-pointer" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100} aria-label="Audio playback progress">
                        <div className="absolute top-0 left-0 h-full w-[35%] bg-secondary-fixed rounded-full transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4" aria-label="Listen on platforms">
                  {HERO_PLATFORMS.map(p => (
                    <a key={p} href="#" className="font-label-caps text-label-caps text-primary-fixed-dim bg-primary-container px-4 py-2 rounded-full border border-primary-fixed-dim/20 hover:border-secondary-fixed hover:text-secondary-fixed transition-colors">{p}</a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Recent Episodes */}
          <section id="episodes" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-surface scroll-mt-20">
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-outline-variant/30 pb-6">
                <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-on-surface text-balance">Recent Episodes</h2>
                <a href="#archive" className="font-label-caps text-label-caps text-primary hover:text-primary-fixed-variant transition-colors inline-flex items-center gap-2 mt-4 md:mt-0 group">
                  View All Episodes
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                </a>
              </div>
              <div className="flex flex-col gap-6">
                {EPISODES.map(e => (
                  <article key={e.num} className="group relative grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-8 items-start md:items-center p-6 md:p-8 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-300 border border-outline-variant/20 hover:border-outline-variant/40 hover:shadow-md">
                    <button className="w-14 h-14 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-transform group-hover:scale-105 shadow-sm" aria-label={`Play ${e.num}: ${e.title}`}>
                      <PlayIcon size="text-3xl" />
                    </button>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-3 font-label-caps text-label-caps text-on-surface-variant tabular-nums">
                        <span>{e.num}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant" aria-hidden="true"></span>
                        <time dateTime={e.date}>{e.display}</time>
                        <span className="w-1 h-1 rounded-full bg-outline-variant" aria-hidden="true"></span>
                        <span>{e.duration}</span>
                      </div>
                      <h3 className="font-headline-md text-[clamp(1.5rem,3vw,2rem)] text-on-surface text-balance group-hover:text-primary transition-colors">
                        <a href="#" className="before:absolute before:inset-0 relative before:z-10">{e.title}</a>
                      </h3>
                      <p className="font-body-md text-on-surface-variant max-w-[70ch] text-pretty">{e.desc}</p>
                    </div>
                    <div className="hidden md:flex gap-2 relative z-20">
                      <button className="p-3 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors" aria-label="Add to queue">
                        <span className="material-symbols-outlined" aria-hidden="true">playlist_add</span>
                      </button>
                      <button className="p-3 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors" aria-label="Download episode">
                        <span className="material-symbols-outlined" aria-hidden="true">download</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Archive Grid */}
          <section id="archive" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-surface-container scroll-mt-20">
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-outline-variant/30 pb-6">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3 block">Archive · Season Three</span>
                  <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-on-surface text-balance max-w-[18ch]">From the Archive</h2>
                </div>
                <p className="font-body-md text-on-surface-variant max-w-[42ch] text-pretty">Eighty-six conversations on the lateral edges of technology, design, and quiet systems thinking.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {ARCHIVE.map(a => (
                  <article key={a.ep} className="group flex flex-col gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 hover:border-outline-variant/50 hover:shadow-md transition-all">
                    <div className="aspect-square overflow-hidden rounded-xl bg-surface-variant relative">
                      <img src={a.src} alt={a.alt} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" loading="lazy" decoding="async" />
                      <span className="absolute top-3 left-3 font-label-caps text-label-caps text-on-primary bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">{a.ep}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 font-label-caps text-label-caps text-on-surface-variant tabular-nums">
                      <time dateTime={a.date}>{a.display}</time>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span>{a.duration}</span>
                    </div>
                    <h3 className="font-headline-md text-2xl text-on-surface text-balance group-hover:text-primary transition-colors">{a.title}</h3>
                    <p className="font-body-md text-on-surface-variant text-pretty">{a.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Co-Hosts — all 4 images in one row, bios beneath */}
          <section id="hosts" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-surface scroll-mt-20">
            <div className="max-w-container-max mx-auto">
              <div className="mb-12 max-w-[60ch]">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3 block">Voices · Behind the Show</span>
                <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-on-surface text-balance">Two ears, one long table.</h2>
              </div>

              {/* All 4 images aligned in a single row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
                {HOSTS.flatMap(h => [
                  { src: h.img1.src, alt: h.img1.alt, key: `${h.name}-1` },
                  { src: h.img2.src, alt: h.img2.alt, key: `${h.name}-2` }
                ]).map(im => (
                  <figure key={im.key} className="aspect-[3/4] overflow-hidden rounded-2xl bg-surface-variant">
                    <img src={im.src} alt={im.alt} className="object-cover w-full h-full grayscale contrast-110 hover:grayscale-0 transition-all duration-700" loading="lazy" decoding="async" />
                  </figure>
                ))}
              </div>

              {/* Bios — 2-col underneath */}
              <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                {HOSTS.map(h => (
                  <article key={h.name} className="flex flex-col gap-3">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{h.role}</span>
                    <h3 className="font-headline-md text-3xl text-on-surface">{h.name}</h3>
                    <p className="font-body-md text-on-surface-variant max-w-[42ch] text-pretty">
                      {h.italicize ? (
                        <>
                          {h.bio.split(h.italicize)[0]}
                          <em>{h.italicize}</em>
                          {h.bio.split(h.italicize)[1]}
                        </>
                      ) : h.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {h.socials.map(s => (
                        <a key={s} href="#" className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container-low border border-outline-variant/40 px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-colors">{s}</a>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Listen Anywhere — mustard tinted band */}
          <section id="listen-anywhere" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-secondary-container scroll-mt-20">
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-on-secondary-container/20 pb-6">
                <div>
                  <span className="font-label-caps text-label-caps text-on-secondary-container uppercase tracking-widest mb-3 block">Distribution</span>
                  <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-on-secondary-container text-balance">Listen anywhere you already are.</h2>
                </div>
                <p className="font-body-md text-on-secondary-container/80 max-w-[40ch] text-pretty">Open RSS first. Major platforms second. We keep our archive on a small server in a quiet room — not on a fragile silo.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {PLATFORMS_FULL.map(p => (
                  <a key={p.name} href="#" className="group flex items-center gap-4 bg-background/40 hover:bg-background/70 border border-on-secondary-container/15 hover:border-on-secondary-container/40 backdrop-blur-sm px-5 py-5 rounded-2xl transition-all">
                    <span className="w-12 h-12 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-lg text-xl tracking-tight">{p.letter}</span>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-on-secondary-container/70 uppercase tracking-widest">{p.verb}</span>
                      <span className="font-headline-md text-lg text-on-secondary-container">{p.name}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Behind-the-Mic — contained 2-col, image bounded */}
          <section id="studio" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-surface-container-low scroll-mt-20">
            <div className="max-w-container-max mx-auto grid md:grid-cols-2 items-center gap-10 md:gap-16">
              <figure className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-2xl bg-surface-container shadow-xl">
                <img src="https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=1200&q=85&auto=format&fit=crop" alt="Recording-room interior — soft daylight in a converted carriage house" className="absolute inset-0 w-full h-full object-cover grayscale contrast-110" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/35 via-transparent to-transparent pointer-events-none"></div>
                <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <p className="font-label-caps text-label-caps text-on-primary uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Studio · Carriage House</p>
                  <span className="font-label-caps text-label-caps text-on-primary/80 uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Plate · IV</span>
                </figcaption>
              </figure>
              <div className="flex flex-col gap-6 max-w-[52ch]">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Behind the Mic</span>
                <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-on-surface text-balance">A long room, two warm mics, and a list of questions we'd rather not ask.</h2>
                <div className="font-body-md text-on-surface-variant space-y-4 text-pretty">
                  <p>The Lateral is recorded in a converted carriage house outside Hudson, New York. The room is mostly wood, mostly soft, and mostly slow — built so that the silence between answers reads as part of the show, not an editing failure.</p>
                  <p>Episodes start with a question we're a little embarrassed to ask. They end about an hour later, after the guest has talked themselves into something they didn't know they believed.</p>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mt-2 pt-6 border-t border-outline-variant/40">
                  {STUDIO_SPECS.map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{k}</dt>
                      <dd className="font-body-md text-on-surface">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* Featured Guests — alt rows */}
          <section id="guests" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-surface scroll-mt-20">
            <div className="max-w-container-max mx-auto">
              <div className="mb-16 max-w-[58ch]">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3 block">Featured Guests · Series Three</span>
                <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-on-surface text-balance">The people who said the thing we couldn't.</h2>
              </div>
              <div className="flex flex-col gap-16 md:gap-24">
                {FEATURED_GUESTS.map((g, i) => (
                  <article key={i} className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className={`md:col-span-5 aspect-[4/5] overflow-hidden rounded-2xl bg-surface-variant ${g.reverse ? "md:order-1" : ""}`}>
                      <img src={g.src} alt={g.alt} className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700" loading="lazy" decoding="async" />
                    </div>
                    <div className={`md:col-span-7 flex flex-col gap-5 ${g.reverse ? "md:order-2" : ""}`}>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{g.label}</span>
                      <p className="font-headline-lg text-[clamp(1.5rem,2.6vw,2.25rem)] text-on-surface italic font-medium leading-snug text-balance">"{g.quote}"</p>
                      <p className="font-body-md text-on-surface-variant">{g.cite}</p>
                      <a href="#" className="self-start inline-flex items-center gap-2 font-label-caps text-label-caps text-primary hover:text-primary-fixed-variant border-b border-primary/30 hover:border-primary pb-1 transition-colors">
                        {g.listen}
                        <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-surface-container-low scroll-mt-20">
            <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="order-2 md:order-1 flex flex-col gap-6">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block">About The Host</span>
                <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-on-surface text-balance">Curiosity at the Intersection of Disciplines</h2>
                <div className="font-body-md text-on-surface-variant space-y-4 max-w-[65ch] text-pretty">
                  <p>Hosted by acclaimed journalist and researcher David Sterling, <em>The Lateral</em> explores the unexpected connections between technology, psychology, and design.</p>
                  <p>Each week, we invite visionaries—from system architects to behavioral economists—to dissect the frameworks they use to understand the world. We believe that the most profound insights often come from looking sideways.</p>
                </div>
                <div className="mt-4">
                  <a href="#" className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-on-primary font-label-caps text-label-caps rounded-full hover:bg-primary-container transition-colors shadow-sm hover:shadow-md">Read Full Bio</a>
                </div>
              </div>
              <div className="order-1 md:order-2 aspect-[4/5] relative rounded-2xl overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=800&q=85&auto=format&fit=crop" alt="David Sterling, host of The Lateral podcast — editorial portrait, contemplative low light" className="object-cover w-full h-full grayscale contrast-110" loading="lazy" decoding="async" width="800" height="1000" />
              </div>
            </div>
          </section>

          {/* Press / Reviews quote band */}
          <section id="press" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-surface-container-low scroll-mt-20">
            <div className="max-w-container-max mx-auto">
              <div className="text-center mb-12">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3 block">Selected Press</span>
                <h2 className="font-headline-lg text-[clamp(2rem,3.6vw,2.5rem)] text-on-surface text-balance">Kind things, mostly from people we admire.</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-gutter">
                {PRESS.map((p, i) => (
                  <figure key={i} className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 border border-outline-variant/20 flex flex-col gap-6">
                    <div className="flex items-center gap-1 text-secondary text-xl tracking-widest" aria-label="Five stars">★★★★★</div>
                    <blockquote className="font-headline-md text-xl text-on-surface italic leading-snug text-pretty">"{p.quote}"</blockquote>
                    <figcaption className="mt-auto pt-6 border-t border-outline-variant/30 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{p.source}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Sponsors marquee */}
          <section id="sponsors" className="py-16 md:py-24 bg-tertiary text-on-tertiary overflow-hidden">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-widest mb-3 block">Underwriters · Season Three</span>
                <h2 className="font-headline-lg text-[clamp(1.75rem,3vw,2.25rem)] text-on-tertiary text-balance">Generously supported by quiet companies.</h2>
              </div>
              <p className="font-body-md text-tertiary-fixed-dim max-w-[40ch] text-pretty">Underwriting messages run once per episode and never interrupt mid-sentence. Reach out for a slot in S04.</p>
            </div>
            <div className="overflow-hidden relative">
              <div className="lateral-marquee-track items-center py-4">
                {sponsorRow.map((s, i) => (
                  <span key={i} className="shrink-0 flex items-center gap-14">
                    <span className={`font-headline-lg text-3xl md:text-4xl text-tertiary-fixed-dim tracking-tight ${i % 2 === 0 ? "italic" : ""}`}>{s}</span>
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" aria-hidden="true"></span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section id="faq" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-background scroll-mt-20">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-3 block">FAQ · Show Notes</span>
                <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-on-surface text-balance">Things people ask, mostly twice.</h2>
              </div>
              <div className="flex flex-col gap-3">
                {FAQ.map((f, i) => (
                  <details key={i} className="lateral-faq group bg-surface-container-low rounded-2xl border border-outline-variant/30 px-6 py-5 open:bg-surface-container hover:border-outline-variant/50 transition-colors">
                    <summary className="flex items-start justify-between gap-4">
                      <h3 className="font-headline-md text-lg md:text-xl text-on-surface text-balance">{f.q}</h3>
                      <span className="lateral-chevron material-symbols-outlined shrink-0 text-2xl text-primary mt-0.5" aria-hidden="true">add</span>
                    </summary>
                    <div className="font-body-md text-on-surface-variant pt-4 max-w-[60ch] text-pretty">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Subscribe */}
          <section id="subscribe" className="py-[80px] md:py-section-gap px-margin-mobile md:px-gutter bg-primary text-on-primary scroll-mt-20">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
              <span className="material-symbols-outlined text-5xl text-secondary-fixed" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>podcasts</span>
              <h2 className="font-headline-lg text-[clamp(2rem,4vw,3rem)] text-balance">Never Miss an Episode</h2>
              <p className="font-body-lg text-primary-fixed-dim max-w-[60ch] text-pretty">
                Join 50,000+ curious minds. Subscribe to our newsletter for weekly episodes, extended show notes, and exclusive behind-the-scenes content.
              </p>
              <form className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-4" action="#" method="POST" onSubmit={e => e.preventDefault()}>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input type="email" id="email" name="email" required autoComplete="email" placeholder="Enter your email address" className="flex-grow rounded-full bg-primary-container border border-primary-fixed-dim/30 px-6 py-3.5 text-on-primary placeholder:text-primary-fixed-dim/60 focus:ring-2 focus:ring-secondary-fixed focus:border-transparent outline-none transition-all font-body-md shadow-inner" />
                <button type="submit" className="whitespace-nowrap px-8 py-3.5 bg-secondary-fixed text-on-secondary-container font-label-caps text-label-caps rounded-full hover:bg-secondary-fixed-dim transition-colors shadow-md active:scale-95">Subscribe</button>
              </form>
              <div className="pt-10 mt-6 border-t border-primary-fixed-dim/20 w-full flex flex-col items-center gap-6">
                <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-widest">Or Listen Directly On</span>
                <div className="flex flex-wrap justify-center gap-4">
                  {SUBSCRIBE_ON.map(s => (
                    <a key={s} href="#" className="font-label-caps text-label-caps text-on-primary bg-primary-container/80 px-5 py-2.5 rounded-full border border-primary-fixed-dim/20 hover:border-secondary-fixed/50 hover:bg-primary-container hover:text-secondary-fixed transition-all duration-300 shadow-sm">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-surface-container-low w-full py-12 border-t border-outline-variant/30">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-gutter gap-6">
            <div className="text-xl font-bold font-headline-lg text-primary tracking-tight">The Lateral</div>
            <div className="flex flex-wrap justify-center gap-8">
              {FOOTER_LINKS.map(l => (
                <a key={l} href="#" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors">{l}</a>
              ))}
            </div>
            <div className="font-body-md text-sm text-on-surface-variant">© 2024 The Lateral. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
