const SCREEN_FRAMES = [
  { delay: '0s',  caption: '07:14 · Morning',          tag: 'Morning',  dot: 'bg-primary',           src: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1080&q=80', alt: 'Morning intention screen — minimal text editor with warm lighting' },
  { delay: '4s',  caption: '15:02 · Mood Slider',      tag: 'Mood',     dot: 'bg-secondary',         src: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1080&q=80', alt: 'Afternoon mood screen — emotional tracking against a calming landscape' },
  { delay: '8s',  caption: '21:48 · Evening Rewind',   tag: 'Rewind',   dot: 'bg-tertiary',          src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=80', alt: 'Evening rewind screen — sunset clouds in muted tones for the day rewind' },
  { delay: '12s', caption: 'Sunday · Timeline',        tag: 'Timeline', dot: 'bg-primary-fixed-dim', src: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1080&q=80', alt: 'Timeline screen — abstract minimal curves of weekly personal growth' },
];

const VOICES = [
  {
    name: 'Mira Calderón',
    role: 'Novelist · Lisbon',
    quote: '"I write at first light. Sundial is the only tool that makes the page feel softer than the screen."',
    portrait: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=160&q=80',
    portraitAlt: 'Portrait of Mira Calderón, novelist, smiling softly',
    quoteTint: 'text-primary-container/70',
  },
  {
    name: 'Daniel Okafor',
    role: 'Therapist · Brooklyn',
    quote: '"I recommend it to clients before any clinical app. The mood slider feels like a hand on a shoulder, not a chart."',
    portrait: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=160&q=80',
    portraitAlt: 'Portrait of Daniel Okafor, therapist, looking thoughtful',
    quoteTint: 'text-secondary-container/80',
  },
  {
    name: 'Hana Vesely',
    role: 'Designer · Prague',
    quote: '"A year of entries reads back like a quiet film. I keep returning to spring — the colours, not the words."',
    portrait: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=160&q=80',
    portraitAlt: 'Portrait of Hana Vesely, designer, looking calm and curious',
    quoteTint: 'text-tertiary-container/80',
  },
];

const FAQS = [
  {
    q: 'Is my journal private?',
    a: "Entries are end-to-end encrypted on device, then synced via your iCloud or Google account. We never see your text, and there's no analytics on the contents of your entries — only on whether the app launched.",
  },
  {
    q: 'Will it nag me with streaks?',
    a: 'No streaks, no badges, no red dots. The only nudge is a single optional sunset reminder that you choose the time of. Skipping a week is part of the rhythm too.',
  },
  {
    q: 'Can I export my entries?',
    a: 'Yes — Markdown, plain text, or a printable PDF photobook with mood colours preserved as page tints. Your archive belongs to you, on your terms.',
  },
  {
    q: 'How much does Sundial cost?',
    a: 'Free for one entry per day with the standard mood palette. Sundial Plus unlocks unlimited entries, the timeline view, and the sunset photobook export — $4 a month or $36 a year.',
  },
  {
    q: 'Does it work offline?',
    a: 'Completely. Write on a plane, in a tent, on a sleeper train. Entries sync the next time you reconnect. No connection required for the editor, the mood slider, or the timeline.',
  },
];

const IN_USE_FACETS = [
  { icon: 'spa',                label: 'Calm by default' },
  { icon: 'notifications_off',  label: 'No streaks. No nags.' },
  { icon: 'lock',               label: 'End-to-end private' },
];

function MobileAppLanding() {
  return (
    <>
      {/* head */}
      <title>Sundial - Daily Journaling App</title>
      <meta name="description" content="A daily journaling experience that feels like a cinematic pause. Capture your thoughts, track your mood, and reflect on your journey." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-container": "#ffc4a3",
                        "on-secondary": "#ffffff",
                        "outline-variant": "#d5c3ba",
                        "surface-container-highest": "#e5e2e1",
                        "on-tertiary-fixed": "#1e0e4e",
                        "primary-fixed-dim": "#f4ba9a",
                        "on-error-container": "#93000a",
                        "surface-container-lowest": "#ffffff",
                        "inverse-on-surface": "#f3f0ef",
                        "inverse-primary": "#f4ba9a",
                        "background": "#fcf9f8",
                        "tertiary-fixed": "#e7deff",
                        "primary": "#80543a",
                        "tertiary": "#625595",
                        "outline": "#83746c",
                        "surface-dim": "#dcd9d9",
                        "surface-variant": "#e5e2e1",
                        "surface-container": "#f0eded",
                        "on-secondary-fixed-variant": "#613a58",
                        "on-tertiary-container": "#5c4f8f",
                        "surface-container-low": "#f6f3f2",
                        "error": "#ba1a1a",
                        "surface-tint": "#80543a",
                        "on-primary-container": "#7a4f35",
                        "secondary-fixed": "#ffd7f2",
                        "on-tertiary-fixed-variant": "#4a3d7c",
                        "on-primary-fixed-variant": "#653d25",
                        "secondary-fixed-dim": "#ebb7dc",
                        "secondary-container": "#fdc7ed",
                        "surface-bright": "#fcf9f8",
                        "on-error": "#ffffff",
                        "on-secondary-fixed": "#300e2b",
                        "tertiary-fixed-dim": "#ccbeff",
                        "on-primary": "#ffffff",
                        "on-surface": "#1c1b1b",
                        "secondary": "#7b5171",
                        "surface-container-high": "#eae7e7",
                        "tertiary-container": "#d5c9ff",
                        "on-primary-fixed": "#311301",
                        "on-tertiary": "#ffffff",
                        "error-container": "#ffdad6",
                        "inverse-surface": "#313030",
                        "on-secondary-container": "#7a5070",
                        "on-surface-variant": "#51443d",
                        "surface": "#fcf9f8",
                        "primary-fixed": "#ffdbc9",
                        "on-background": "#1c1b1b"
                    },
                    "borderRadius": {
                        "DEFAULT": "1rem",
                        "lg": "2rem",
                        "xl": "3rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "body-md": ["Inter", "system-ui", "sans-serif"],
                        "caption": ["Inter", "system-ui", "sans-serif"],
                        "body-lg": ["Inter", "system-ui", "sans-serif"],
                        "label-bold": ["Inter", "system-ui", "sans-serif"],
                        "headline-xl": ["Space Grotesk", "system-ui", "sans-serif"],
                        "headline-lg": ["Space Grotesk", "system-ui", "sans-serif"],
                        "headline-md": ["Space Grotesk", "system-ui", "sans-serif"]
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .sunset-bg {
            background: linear-gradient(135deg, rgba(255,196,163,0.3) 0%, rgba(232,180,217,0.3) 50%, rgba(196,181,253,0.3) 100%);
            background-color: var(--color-background, #fcf9f8);
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.8);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Full-bleed escape for the constrained <main> wrapper */
        html, body { overflow-x: clip; }
        .full-bleed {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
            max-width: none;
        }

        /* Auto-cycling vertical image cross-fade with blur */
        @keyframes sundial-archive-fade {
            0%, 4%   { opacity: 0; filter: blur(18px) saturate(0.85); transform: scale(1.04); }
            8%, 22%  { opacity: 1; filter: blur(0)     saturate(1);    transform: scale(1); }
            26%, 100%{ opacity: 0; filter: blur(18px) saturate(0.85); transform: scale(1.04); }
        }
        .sundial-cycle-img {
            animation: sundial-archive-fade 16s linear infinite;
            opacity: 0;
            filter: blur(18px) saturate(0.85);
            transform: scale(1.04);
            will-change: opacity, filter, transform;
        }
        @keyframes sundial-scrub {
            0%   { transform: scaleX(0); }
            100% { transform: scaleX(1); }
        }
        .sundial-scrub {
            animation: sundial-scrub 16s linear infinite;
            transform-origin: left;
        }

        @keyframes sundial-pulse {
            0%, 100% { opacity: 0.7; box-shadow: 0 0 0 0 rgba(244,186,154,0.45); }
            50%      { opacity: 1;   box-shadow: 0 0 0 10px rgba(244,186,154,0); }
        }
        .sundial-pulse { animation: sundial-pulse 2.4s ease-in-out infinite; }

        .sundial-faq summary::-webkit-details-marker { display: none; }
        .sundial-faq summary { list-style: none; cursor: pointer; }
        .sundial-faq summary .sundial-chevron { transition: transform 250ms ease; }
        .sundial-faq[open] summary .sundial-chevron { transform: rotate(180deg); }

        @media (prefers-reduced-motion: reduce) {
            .sundial-cycle-img,
            .sundial-scrub,
            .sundial-pulse { animation: none !important; }
            .sundial-cycle-img:first-child {
                opacity: 1 !important;
                filter: none !important;
                transform: none !important;
            }
            .sundial-faq summary .sundial-chevron { transition: none; }
        }
` }} />

      {/* body wrapper */}
      <div className="sunset-bg text-on-surface font-body-md antialiased min-h-screen selection:bg-primary-container selection:text-on-primary-container relative flex flex-col cursor-default">

        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:p-4 focus:bg-white focus:text-primary focus:z-[100] focus:outline-none focus:ring-2 focus:ring-primary focus:rounded-lg shadow-lg font-label-bold">
          Skip to main content
        </a>

        {/* Background ambient gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container opacity-30 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-tertiary-container opacity-30 blur-[120px]"></div>
          <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-secondary-container opacity-30 blur-[80px]"></div>
        </div>

        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-white/30 dark:bg-zinc-950/20 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 shadow-[0_8px_32px_0_rgba(255,196,163,0.1)]">
          <nav className="flex justify-between items-center px-4 py-4 max-w-7xl mx-auto gap-3 sm:px-8 sm:py-6 md:px-12 xl:px-0" aria-label="Main Navigation">
            <a className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-headline-md tracking-tight sm:text-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-2 -mx-2 transition-colors" href="#">Sundial</a>

            <div className="hidden md:flex items-center space-x-8 font-['Space_Grotesk'] font-medium tracking-tight">
              <a className="text-orange-500 dark:text-orange-400 border-b-2 border-orange-400 pb-1 motion-safe:transition-all motion-safe:duration-300 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded" href="#">Reflection</a>
              <a className="text-zinc-600 dark:text-zinc-400 motion-safe:transition-all motion-safe:duration-300 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-2" href="#">Process</a>
              <a className="text-zinc-600 dark:text-zinc-400 motion-safe:transition-all motion-safe:duration-300 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-2" href="#">Community</a>
              <a className="text-zinc-600 dark:text-zinc-400 motion-safe:transition-all motion-safe:duration-300 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-2" href="#">Philosophy</a>
            </div>

            <button type="button" className="bg-[#1A1A1A] text-white px-4 py-2 rounded-full font-label-bold text-xs motion-safe:transition-all hover:bg-zinc-800 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:px-6 sm:py-3 sm:text-sm cursor-pointer">
              Get Started
            </button>
          </nav>
        </header>

        {/* Main */}
        <main id="main-content" className="flex-grow pt-28 pb-12 flex flex-col gap-16 md:pt-[160px] md:pb-24 md:gap-24 w-full">

          {/* Hero */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col items-center text-center gap-6 mt-8 sm:mt-12">
            <h1 className="font-headline-xl text-[clamp(2.5rem,5vw+1rem,4rem)] leading-[1.1] text-on-surface max-w-4xl text-balance">
              Your reflections, turned into memories.
            </h1>
            <p className="font-body-lg text-[clamp(1rem,2vw+0.5rem,1.125rem)] text-on-surface-variant max-w-[65ch] text-pretty">
              A daily journaling experience that feels like a cinematic pause. Whether you're tracking your mood, capturing life's little details, or finding peace in the chaos, Sundial adapts to your unique rhythm. Capture the sunset of your day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 z-10">
              <button type="button" className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-label-bold motion-safe:transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">ios</span> App Store
              </button>
              <button type="button" className="glass-panel text-on-surface px-8 py-4 rounded-full font-label-bold motion-safe:transition-all hover:bg-white/60 hover:shadow-lg active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">play_arrow</span> Google Play
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 text-on-surface-variant font-caption tabular-nums">
              <div className="flex text-orange-400" aria-hidden="true">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
              </div>
              <span><span className="font-bold text-on-surface">4.9</span> stars, <span className="font-bold text-on-surface">12k</span> reviews</span>
            </div>

            <div className="flex justify-center items-end gap-6 sm:gap-10 md:gap-16 mt-16 w-full max-w-4xl mx-auto">
              <div className="w-[45%] max-w-[320px] aspect-[9/19.5] shrink-0 bg-white rounded-[2rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-white shadow-[0_20px_50px_-10px_rgba(196,181,253,0.6)] relative overflow-hidden ring-1 ring-black/5 motion-safe:transition-transform motion-safe:duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(196,181,253,0.8)] z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-5 sm:h-6 bg-white rounded-b-xl sm:rounded-b-2xl z-20 shadow-sm"></div>
                <img width="1080" height="2340" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80" alt="Abstract fluid gradient resembling a soft, calming digital journal interface" fetchPriority="high" />
              </div>
              <div className="w-[45%] max-w-[320px] aspect-[9/19.5] shrink-0 bg-white rounded-[2rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-white shadow-[0_20px_50px_-10px_rgba(232,180,217,0.6)] relative overflow-hidden ring-1 ring-black/5 mt-16 sm:mt-24 motion-safe:transition-transform motion-safe:duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(232,180,217,0.8)] z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-5 sm:h-6 bg-white rounded-b-xl sm:rounded-b-2xl z-20 shadow-sm"></div>
                <img width="1080" height="2340" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80" alt="Soft pastel sunset view demonstrating a visual timeline of memories in the app" fetchPriority="high" />
              </div>
            </div>
          </section>

          {/* Feature Carousel */}
          <section className="w-full overflow-hidden" aria-labelledby="carousel-heading">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mb-8 md:mb-12">
              <h2 id="carousel-heading" className="font-headline-md text-[clamp(1.5rem,4vw,2.5rem)] text-center text-balance mb-2">Glimpse your journey</h2>
              <p className="text-center font-body-md text-[clamp(1rem,1.5vw,1.125rem)] text-on-surface-variant max-w-[55ch] mx-auto text-pretty">
                Explore a beautifully minimal interface where every detail is designed to bring you peace. Swipe through your days like a curated gallery of your life.
              </p>
            </div>

            <div className="flex overflow-x-auto pb-12 pt-4 snap-x snap-mandatory hide-scrollbar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background" tabIndex={0} aria-label="App features gallery">
              <div className="m-auto flex w-max gap-6 sm:gap-8 px-4 sm:px-8 md:px-12">

                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[1.5rem]" src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80" alt="Clean minimal text editor screen with warm lighting perfect for daily journaling" />
                </article>

                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[1.5rem]" src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80" alt="Stylized calendar view showing emotional tracking mapped across calming landscape colors" />
                </article>

                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[1.5rem]" src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80" alt="Abstract minimal curved charts demonstrating weekly personal growth analytics" />
                </article>

                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[1.5rem]" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" alt="Settings screen showcasing beautiful pastel toggles and soft typography" />
                </article>

                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[1.5rem]" src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" alt="Relaxing night mode view featuring deep sunset clouds and muted tones" />
                </article>
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12" aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="sr-only">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

              <article className="glass-card p-8 sm:p-10 rounded-[2rem] flex flex-col items-center text-center gap-4 motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2 shadow-lg ring-1 ring-white/40">
                <div className="w-20 h-20 rounded-full bg-primary-container/40 flex items-center justify-center mb-2 shadow-inner">
                  <span className="material-symbols-outlined text-[40px] text-primary" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>edit_document</span>
                </div>
                <h3 className="font-headline-md text-xl">Capture</h3>
                <p className="font-body-md text-on-surface-variant max-w-[40ch] text-pretty">
                  Jot down fleeting thoughts in a distraction-free space designed for focus. Our minimalist editor removes the noise, allowing your purest thoughts to flow directly onto the digital page without hesitation.
                </p>
              </article>

              <article className="glass-card p-8 sm:p-10 rounded-[2rem] flex flex-col items-center text-center gap-4 motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2 shadow-lg ring-1 ring-white/40">
                <div className="w-20 h-20 rounded-full bg-secondary-container/40 flex items-center justify-center mb-2 shadow-inner">
                  <span className="material-symbols-outlined text-[40px] text-secondary" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <h3 className="font-headline-md text-xl">Reflect</h3>
                <p className="font-body-md text-on-surface-variant max-w-[40ch] text-pretty">
                  Pause and map your emotional state with our intuitive sun-slider mood tracker. Understand your daily patterns, recognize your emotional triggers, and find profound clarity in your journey over time.
                </p>
              </article>

              <article className="glass-card p-8 sm:p-10 rounded-[2rem] flex flex-col items-center text-center gap-4 motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2 shadow-lg ring-1 ring-white/40">
                <div className="w-20 h-20 rounded-full bg-tertiary-container/40 flex items-center justify-center mb-2 shadow-inner">
                  <span className="material-symbols-outlined text-[40px] text-tertiary" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                </div>
                <h3 className="font-headline-md text-xl">Relive</h3>
                <p className="font-body-md text-on-surface-variant max-w-[40ch] text-pretty">
                  Look back on your journey through beautifully curated timelines of your past. Celebrate your unique growth, remember the small moments of joy, and witness the beautiful story of your life unfolding.
                </p>
              </article>

            </div>
          </section>

          {/* Screens — auto-cycling vertical image cross-fade */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12" aria-labelledby="screens-heading">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32 self-start">
                <span className="font-caption uppercase tracking-[0.3em] text-[11px] text-on-surface-variant">— II · The Screens</span>
                <h2 id="screens-heading" className="font-headline-lg text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] text-balance text-on-surface">
                  Four scenes from a quiet day.
                </h2>
                <p className="font-body-md text-[clamp(1rem,1.4vw,1.125rem)] text-on-surface-variant max-w-[42ch] text-pretty">
                  Each frame is a moment Sundial holds for you — morning intention, an afternoon mood, the evening rewind, and the timeline that quietly stitches them together.
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
                  {SCREEN_FRAMES.map(f => (
                    <span key={f.tag} className="inline-flex items-center gap-2 font-caption text-xs text-on-surface-variant">
                      <span className={"w-1.5 h-1.5 rounded-full " + f.dot}></span> {f.tag}
                    </span>
                  ))}
                </div>

                <div className="h-px w-full bg-outline-variant/40 relative overflow-hidden mt-2" aria-hidden="true">
                  <div className="sundial-scrub absolute inset-0 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-[360px] aspect-[9/19.5] bg-white rounded-[2.5rem] sm:rounded-[3rem] border-[8px] border-white shadow-[0_30px_60px_-15px_rgba(196,181,253,0.55)] relative overflow-hidden ring-1 ring-black/5">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-6 bg-white rounded-b-2xl z-30 shadow-sm"></div>
                  {SCREEN_FRAMES.map(f => (
                    <img key={"img-" + f.tag} loading="lazy" decoding="async" className="sundial-cycle-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: f.delay }} src={f.src} alt={f.alt} />
                  ))}

                  <div className="absolute inset-x-0 bottom-0 h-20 z-20 bg-gradient-to-t from-black/55 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-x-0 bottom-0 p-5 z-20 text-white" style={{ minHeight: '56px' }}>
                    {SCREEN_FRAMES.map(f => (
                      <span key={"cap-" + f.tag} className="sundial-cycle-img font-caption uppercase tracking-[0.3em] text-[10px] absolute left-5 bottom-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" style={{ animationDelay: f.delay }}>{f.caption}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* In Use — full-bleed cinematic lifestyle backdrop with phone overlay */}
          <section className="full-bleed relative overflow-hidden" aria-labelledby="in-use-heading">
            <img loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85" alt="Soft pastel coastal sunset evoking the cinematic pause Sundial captures" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75 pointer-events-none"></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 25% 80%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)' }}></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 55% at 92% 8%, rgba(255,196,163,0.22) 0%, transparent 60%)' }}></div>
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)' }}></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-20 md:py-32 grid grid-cols-1 md:grid-cols-12 items-center gap-10 md:gap-16">
              <div className="md:col-span-7 text-white flex flex-col gap-6">
                <span className="font-caption uppercase tracking-[0.3em] text-[11px] text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">— III · In Use</span>
                <h2 id="in-use-heading" className="font-headline-xl text-[clamp(2rem,5vw+0.5rem,3.75rem)] leading-[1.05] text-balance text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] max-w-[18ch]">
                  Designed for the slow part of your evening.
                </h2>
                <p className="font-body-lg text-[clamp(1rem,1.6vw,1.25rem)] text-white/90 max-w-[52ch] text-pretty drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  Pour the tea. Watch the sky go soft. Sundial is the only screen that earns its place at the end of your day — opened by ritual, closed when the words feel finished.
                </p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-2 text-white/85">
                  {IN_USE_FACETS.map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" aria-hidden="true">{f.icon}</span>
                      <span className="font-caption text-sm tracking-wide">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center md:justify-end">
                <div className="w-full max-w-[280px] aspect-[9/19.5] bg-white rounded-[2.5rem] sm:rounded-[3rem] border-[8px] border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden ring-1 ring-black/10 motion-safe:transition-transform motion-safe:duration-700 hover:rotate-0 rotate-[6deg]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-6 bg-white rounded-b-2xl z-20 shadow-sm"></div>
                  <img loading="lazy" decoding="async" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=80" alt="Sundial app open on a phone — sunset tones reflecting the moment captured" />
                </div>
              </div>
            </div>
          </section>

          {/* Press strip */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 border-y border-outline-variant/30 py-8 flex justify-center items-center gap-10 flex-wrap opacity-60 grayscale motion-safe:transition-all motion-safe:duration-500 hover:grayscale-0 hover:opacity-100 sm:py-10 sm:gap-14 md:py-12 md:gap-20" aria-label="Featured in press">
            <span className="font-headline-md text-xl font-bold tracking-tighter text-on-surface sm:text-2xl md:text-[28px] cursor-default">THE VERGE</span>
            <span className="font-headline-md text-xl font-bold text-[#00A33B] sm:text-2xl md:text-[28px] cursor-default">TechCrunch</span>
            <span className="font-headline-md text-xl font-bold tracking-widest uppercase text-on-surface sm:text-2xl md:text-[28px] cursor-default">Wired</span>
          </section>

          {/* Testimonial */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex justify-center">
            <figure className="glass-card w-full max-w-4xl p-8 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[3rem] relative text-center shadow-xl ring-1 ring-white/50">
              <span className="material-symbols-outlined absolute top-6 left-6 sm:top-10 sm:left-10 text-5xl sm:text-6xl text-primary-container/60 pointer-events-none" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>

              <blockquote className="font-headline-lg text-[clamp(1.25rem,3vw+0.5rem,2rem)] leading-snug text-on-surface mb-8 sm:mb-10 relative z-10 text-balance mx-auto max-w-[32ch]">
                "Sundial changed how I see my day. It's not just logging; it's a moment of peace. The beautifully crafted timeline makes reflecting a true joy rather than a chore."
              </blockquote>

              <figcaption className="flex items-center justify-center gap-4">
                <img width="150" height="150" loading="lazy" decoding="async" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-md ring-2 ring-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" alt="Close up portrait of Sarah Jenkins, a daily app user, smiling gently" />
                <div className="text-left">
                  <div className="font-label-bold text-on-surface text-sm sm:text-base">Sarah Jenkins</div>
                  <div className="font-caption text-on-surface-variant">Daily User</div>
                </div>
              </figcaption>
            </figure>
          </section>

          {/* Voices — testimonial trio */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12" aria-labelledby="voices-heading">
            <div className="flex flex-col items-center text-center gap-3 mb-10 md:mb-14">
              <span className="font-caption uppercase tracking-[0.3em] text-[11px] text-on-surface-variant">— V · Voices</span>
              <h2 id="voices-heading" className="font-headline-md text-[clamp(1.5rem,4vw,2.5rem)] text-balance">Heard at sunset.</h2>
              <p className="font-body-md text-[clamp(1rem,1.5vw,1.125rem)] text-on-surface-variant max-w-[55ch] text-pretty">
                Three writers, three rituals. The same quiet pause at the end of each day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {VOICES.map(v => (
                <figure key={v.name} className="glass-card p-8 sm:p-10 rounded-[2rem] flex flex-col items-center text-center gap-5 motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2 shadow-lg ring-1 ring-white/40 relative">
                  <span className={"material-symbols-outlined absolute top-5 right-5 text-3xl pointer-events-none " + v.quoteTint} aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  <img width="160" height="160" loading="lazy" decoding="async" className="w-20 h-20 rounded-full object-cover shadow-md ring-2 ring-white" src={v.portrait} alt={v.portraitAlt} />
                  <blockquote className="font-headline-md italic text-lg sm:text-xl leading-snug text-on-surface text-balance">
                    {v.quote}
                  </blockquote>
                  <figcaption className="flex flex-col items-center gap-1 mt-auto">
                    <div className="font-label-bold text-on-surface text-sm sm:text-base">{v.name}</div>
                    <div className="font-caption text-on-surface-variant text-xs">{v.role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* FAQ — <details> accordion */}
          <section className="w-full max-w-3xl mx-auto px-4 sm:px-8 md:px-12" aria-labelledby="faq-heading">
            <div className="flex flex-col items-center text-center gap-3 mb-8 md:mb-12">
              <span className="font-caption uppercase tracking-[0.3em] text-[11px] text-on-surface-variant">— VI · Questions</span>
              <h2 id="faq-heading" className="font-headline-md text-[clamp(1.5rem,4vw,2.5rem)] text-balance">Asked at twilight.</h2>
            </div>

            <div className="glass-card rounded-[2rem] divide-y divide-outline-variant/30 ring-1 ring-white/40 shadow-lg overflow-hidden">
              {FAQS.map(item => (
                <details key={item.q} className="sundial-faq group p-6 sm:p-7">
                  <summary className="flex items-center justify-between gap-4">
                    <h3 className="font-headline-md text-lg sm:text-xl text-on-surface text-left">{item.q}</h3>
                    <span className="sundial-chevron material-symbols-outlined text-primary shrink-0" aria-hidden="true">expand_more</span>
                  </summary>
                  <p className="font-body-md text-on-surface-variant text-pretty mt-4 max-w-[60ch]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

        </main>

        {/* Footer */}
        <div className="w-full px-4 sm:px-8 md:px-12 xl:px-[calc((100vw-80rem)/2)]">
          <footer className="bg-surface/60 backdrop-blur-2xl rounded-t-[2.5rem] sm:rounded-t-[3rem] flex flex-col items-center px-6 py-10 w-full font-['Space_Grotesk'] text-sm tracking-wide gap-8 sm:py-12 md:px-12 md:flex-row md:justify-between md:gap-0 border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] ring-1 ring-black/5 relative z-10">
            <a href="#" className="text-xl font-bold text-on-surface motion-safe:transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-2 -mx-2">
              Sundial
            </a>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-on-surface-variant font-medium" aria-label="Footer Navigation">
              <a href="#" className="motion-safe:transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-1">Privacy</a>
              <a href="#" className="motion-safe:transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-1">Terms</a>
              <a href="#" className="motion-safe:transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-1">Support</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="motion-safe:transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-1">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="motion-safe:transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded px-1">Twitter</a>
            </nav>

            <div className="text-on-surface-variant text-center md:text-right text-xs sm:text-sm">
              © 2024 Sundial. Find your pause.
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default MobileAppLanding;
