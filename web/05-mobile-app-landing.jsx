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
    portrait: 'https://images.unsplash.com/photo-1776275758873-31603dd06112?auto=format&fit=crop&w=160&q=80',
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

// Carousel cards — each is a CSS UI mockup of a different Sundial screen, layered over a faded photo backdrop
const CAROUSEL_CARDS = [
  { tag: 'Write',           tagBg: 'bg-primary-container/90 text-primary',                 active: 'edit_note',  bgImg: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80', bgAlt: 'Warm sunlit desk — backdrop for the Write screen',           overlayClass: 'bg-gradient-to-b from-white/40 to-white/70', textColor: 'text-on-surface', clock: '9:41' },
  { tag: 'Calendar · May',  tagBg: 'bg-secondary-container/90 text-secondary',             active: 'mood',       bgImg: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80', bgAlt: 'Calming landscape — backdrop for the Calendar screen',       overlayClass: 'bg-gradient-to-b from-white/50 to-white/75', textColor: 'text-on-surface', clock: '10:02' },
  { tag: 'Insights · Week 18', tagBg: 'bg-tertiary-container/90 text-tertiary',           active: 'history',    bgImg: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80', bgAlt: 'Abstract minimal curves — backdrop for the Insights screen', overlayClass: 'bg-gradient-to-b from-white/55 to-white/80', textColor: 'text-on-surface', clock: '16:30' },
  { tag: 'Settings',        tagBg: 'bg-primary-container/90 text-primary',                 active: 'spa',        bgImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', bgAlt: 'Soft pastel gradient — backdrop for the Settings screen',    overlayClass: 'bg-gradient-to-b from-white/55 to-white/80', textColor: 'text-on-surface', clock: '20:14' },
  { tag: 'Bedtime',         tagBg: 'bg-white/15 backdrop-blur text-white border border-white/30', active: 'bedtime', bgImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80', bgAlt: 'Sunset clouds — backdrop for the Bedtime screen',           overlayClass: 'bg-gradient-to-b from-black/30 via-black/20 to-black/55', textColor: 'text-white', clock: '22:07' },
];

// Real brand logos via Simple Icons CDN (D.0.1) replacing fake Press names
const TRUSTED_BRANDS = [
  { name: 'Apple',    slug: 'apple',    color: '1A1A1A' },
  { name: 'Spotify',  slug: 'spotify',  color: '1DB954' },
  { name: 'Notion',   slug: 'notion',   color: '1A1A1A' },
  { name: 'Figma',    slug: 'figma',    color: 'F24E1E' },
  { name: 'Linear',   slug: 'linear',   color: '5E6AD2' },
  { name: 'Airbnb',   slug: 'airbnb',   color: 'FF5A5F' },
  { name: 'Medium',   slug: 'medium',   color: '1A1A1A' },
  { name: 'Buffer',   slug: 'buffer',   color: '231F20' },
];

// Promise — full-bleed dark commitment strip facets
const PROMISE_FACETS = [
  { icon: 'lock',               iconColor: 'text-tertiary-fixed-dim',  title: 'End-to-end private',     body: 'Encrypted on device. Synced through your iCloud or Google. We never see a word.' },
  { icon: 'notifications_off',  iconColor: 'text-primary-fixed-dim',   title: 'No streaks. No nags.',   body: 'One optional sunset reminder, set to your evening. Skip a week — the rhythm holds.' },
  { icon: 'devices',            iconColor: 'text-secondary-fixed-dim', title: 'iPhone, iPad, web',      body: 'Pick up the page where you left it — sleeper train, kitchen window, lunch break.' },
  { icon: 'file_export',        iconColor: 'text-tertiary-fixed-dim',  title: 'Yours to take',          body: 'Markdown, plain text, or a printable photobook with mood-tinted pages.' },
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

            {/* Hero phone mockups — pure CSS UI replacing abstract photos */}
            <div className="flex justify-center items-end gap-6 sm:gap-10 md:gap-16 mt-16 w-full max-w-4xl mx-auto">

              {/* Phone 1 — Morning Journal Entry */}
              <div className="w-[45%] max-w-[320px] aspect-[9/19.5] shrink-0 rounded-[2rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-white shadow-[0_20px_50px_-10px_rgba(196,181,253,0.6)] relative overflow-hidden ring-1 ring-black/5 motion-safe:transition-transform motion-safe:duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(196,181,253,0.8)] z-10" role="img" aria-label="Sundial app — morning journal entry screen">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-5 sm:h-6 bg-white rounded-b-xl sm:rounded-b-2xl z-20 shadow-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary-container/50 via-background to-secondary-container/30"></div>
                <div className="absolute top-12 -right-8 w-32 h-32 rounded-full bg-primary-container/60 blur-2xl"></div>
                <div className="absolute inset-0 z-10 flex flex-col px-3 pt-6 pb-3 text-on-surface">
                  <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-semibold tabular-nums">
                    <span>9:41</span>
                    <div className="flex gap-1 items-center">
                      <span className="material-symbols-outlined text-[9px] sm:text-[11px]">network_wifi</span>
                      <span className="material-symbols-outlined text-[9px] sm:text-[11px]">battery_full</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 flex items-center justify-between">
                    <div className="flex flex-col leading-tight">
                      <span className="text-on-surface-variant text-[6px] sm:text-[7px] uppercase tracking-[0.25em]">Sunday</span>
                      <span className="font-headline-md text-base sm:text-lg font-bold leading-none">12 May</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface text-[14px] sm:text-[16px]">menu</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
                    <span className="text-[8px] sm:text-[10px] font-medium leading-none">Good morning, Sarah.</span>
                  </div>
                  <div className="mt-2 rounded-2xl bg-white/85 border border-white/60 p-2 shadow-inner">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Today's note</span>
                      <span className="bg-primary-container text-primary text-[6px] sm:text-[7px] px-1.5 py-0.5 rounded-full font-bold tabular-nums">07:14</span>
                    </div>
                    <p className="text-[8px] sm:text-[9px] leading-snug">Walked to the lighthouse before the rain. Tea on the way back, watched the gulls.</p>
                    <span className="inline-block w-[1px] h-2.5 bg-primary mt-0.5 align-middle motion-safe:animate-pulse"></span>
                  </div>
                  <div className="mt-2 self-start flex items-center gap-1 bg-secondary-container/40 rounded-full px-2 py-0.5 border border-white/40">
                    <span className="w-1 h-1 rounded-full bg-secondary"></span>
                    <span className="text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-on-surface font-bold">Mood · Calm</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 rounded-xl bg-white/60 border border-white/50 p-1.5">
                    <span className="material-symbols-outlined text-tertiary text-[10px] sm:text-[12px]">photo_camera</span>
                    <span className="text-[6px] sm:text-[8px] uppercase tracking-[0.18em] text-on-surface-variant">Attach a moment</span>
                  </div>
                  <div className="flex-1"></div>
                  <div className="flex justify-around items-center bg-white/85 backdrop-blur rounded-full px-2 py-1 sm:py-1.5 border border-white/60 shadow">
                    <span className="material-symbols-outlined text-primary text-[12px] sm:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px] sm:text-[14px]">mood</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px] sm:text-[14px]">history</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px] sm:text-[14px]">spa</span>
                  </div>
                </div>
              </div>

              {/* Phone 2 — Mood Slider */}
              <div className="w-[45%] max-w-[320px] aspect-[9/19.5] shrink-0 rounded-[2rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-white shadow-[0_20px_50px_-10px_rgba(232,180,217,0.6)] relative overflow-hidden ring-1 ring-black/5 mt-16 sm:mt-24 motion-safe:transition-transform motion-safe:duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(232,180,217,0.8)] z-10" role="img" aria-label="Sundial app — afternoon mood slider screen">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-5 sm:h-6 bg-white rounded-b-xl sm:rounded-b-2xl z-20 shadow-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary-container via-secondary-container/70 to-tertiary-container/60"></div>
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary-container/50 blur-3xl"></div>
                <div className="absolute inset-0 z-10 flex flex-col px-3 pt-6 pb-3 text-on-surface">
                  <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-semibold tabular-nums">
                    <span>15:02</span>
                    <div className="flex gap-1 items-center">
                      <span className="material-symbols-outlined text-[9px] sm:text-[11px]">network_wifi</span>
                      <span className="material-symbols-outlined text-[9px] sm:text-[11px]">battery_full</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 flex items-center justify-between">
                    <span className="material-symbols-outlined text-on-surface text-[14px] sm:text-[16px]">arrow_back</span>
                    <span className="text-[6px] sm:text-[8px] uppercase tracking-[0.25em] text-on-surface-variant font-bold">Mood · Afternoon</span>
                    <span className="material-symbols-outlined text-on-surface text-[14px] sm:text-[16px]">more_horiz</span>
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-container via-primary-fixed-dim to-secondary-container border-2 border-white/80 shadow-[0_0_40px_-5px_rgba(244,186,154,0.7)]"></div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">How does today feel?</p>
                    <p className="mt-0.5 font-headline-md text-base sm:text-lg font-bold leading-tight">Soft</p>
                  </div>
                  <div className="mt-3 px-1">
                    <div className="relative h-3 sm:h-4 rounded-full bg-gradient-to-r from-tertiary-fixed-dim via-primary-container to-secondary-container border border-white/60 shadow-inner flex items-center">
                      <div className="absolute left-[55%] -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-primary shadow"></div>
                    </div>
                    <div className="flex justify-between text-[5px] sm:text-[7px] uppercase tracking-[0.18em] text-on-surface-variant mt-1.5 font-bold">
                      <span>Tense</span>
                      <span>Soft</span>
                      <span>Bright</span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-white/70 border border-white/60 p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">7-day arc</span>
                      <span className="text-[6px] sm:text-[7px] tabular-nums text-primary font-bold">+12%</span>
                    </div>
                    <div className="flex items-end justify-between h-5 gap-0.5">
                      <span className="flex-1 bg-tertiary-container rounded-sm" style={{ height: '30%' }}></span>
                      <span className="flex-1 bg-secondary-container rounded-sm" style={{ height: '50%' }}></span>
                      <span className="flex-1 bg-secondary-container rounded-sm" style={{ height: '45%' }}></span>
                      <span className="flex-1 bg-primary-container rounded-sm" style={{ height: '65%' }}></span>
                      <span className="flex-1 bg-primary-container rounded-sm" style={{ height: '70%' }}></span>
                      <span className="flex-1 bg-primary rounded-sm" style={{ height: '85%' }}></span>
                      <span className="flex-1 bg-primary rounded-sm" style={{ height: '90%' }}></span>
                    </div>
                  </div>
                  <div className="flex-1"></div>
                  <button type="button" className="bg-on-surface text-on-primary rounded-full py-1.5 sm:py-2 font-label-bold text-[8px] sm:text-[10px] tracking-wide uppercase">Save mood</button>
                  <div className="mt-1.5 flex justify-around items-center bg-white/85 backdrop-blur rounded-full px-2 py-1 sm:py-1.5 border border-white/60 shadow">
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px] sm:text-[14px]">edit_note</span>
                    <span className="material-symbols-outlined text-secondary text-[12px] sm:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>mood</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px] sm:text-[14px]">history</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px] sm:text-[14px]">spa</span>
                  </div>
                </div>
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

                {/* Card 1 — Write screen */}
                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2" role="img" aria-label="Sundial Write screen mockup">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-cover rounded-[1.5rem] opacity-70" src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80" alt="Warm sunlit desk — backdrop for the Write screen" />
                  <div className="absolute inset-3 z-10 flex flex-col rounded-[1.5rem] p-2.5 text-on-surface bg-gradient-to-b from-white/40 to-white/70">
                    <div className="flex justify-between items-center text-[8px] font-bold tabular-nums">
                      <span>9:41</span>
                      <span className="material-symbols-outlined text-[10px]">battery_full</span>
                    </div>
                    <span className="mt-2 self-start bg-primary-container/90 text-primary text-[7px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full">Write</span>
                    <p className="mt-2 font-headline-md text-sm font-bold leading-tight">Today's note</p>
                    <div className="mt-1.5 rounded-lg bg-white/85 border border-white/60 p-1.5 shadow-inner">
                      <p className="text-[8px] leading-snug">The light went pink at twenty past seven.</p>
                      <span className="inline-block w-[1px] h-2 bg-primary mt-0.5 motion-safe:animate-pulse"></span>
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex justify-around items-center bg-white/85 backdrop-blur rounded-full py-1 border border-white/60">
                      <span className="material-symbols-outlined text-primary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px]">mood</span>
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px]">history</span>
                    </div>
                  </div>
                </article>

                {/* Card 2 — Calendar / mood map */}
                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2" role="img" aria-label="Sundial Calendar screen mockup">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-cover rounded-[1.5rem] opacity-60" src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80" alt="Calming landscape — backdrop for the Calendar screen" />
                  <div className="absolute inset-3 z-10 flex flex-col rounded-[1.5rem] p-2.5 text-on-surface bg-gradient-to-b from-white/50 to-white/75">
                    <div className="flex justify-between items-center text-[8px] font-bold tabular-nums">
                      <span>10:02</span>
                      <span className="material-symbols-outlined text-[10px]">battery_full</span>
                    </div>
                    <span className="mt-2 self-start bg-secondary-container/90 text-secondary text-[7px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full">Calendar · May</span>
                    <p className="mt-2 font-headline-md text-sm font-bold leading-tight">Your month, in mood</p>
                    <div className="mt-2 grid grid-cols-7 gap-0.5">
                      {["bg-primary-container/60","bg-secondary-container/60","bg-tertiary-container/60","bg-primary-container/80","bg-primary","bg-secondary-container/70","bg-tertiary-container/40","bg-primary-container/40","bg-primary-container/70","bg-primary","bg-secondary","bg-secondary-container/80","bg-tertiary-container/70","bg-primary-container/50","bg-primary-container/85","bg-primary","bg-secondary","bg-tertiary","bg-secondary-container/65","bg-primary-container/65","bg-tertiary-container/55"].map((cls, i) => (
                        <span key={i} className={`aspect-square rounded-sm ${cls}`}></span>
                      ))}
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex justify-around items-center bg-white/85 backdrop-blur rounded-full py-1 border border-white/60">
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px]">edit_note</span>
                      <span className="material-symbols-outlined text-secondary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>mood</span>
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px]">history</span>
                    </div>
                  </div>
                </article>

                {/* Card 3 — Insights / weekly arc chart */}
                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2" role="img" aria-label="Sundial Insights screen mockup">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-cover rounded-[1.5rem] opacity-50" src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80" alt="Abstract minimal curves — backdrop for the Insights screen" />
                  <div className="absolute inset-3 z-10 flex flex-col rounded-[1.5rem] p-2.5 text-on-surface bg-gradient-to-b from-white/55 to-white/80">
                    <div className="flex justify-between items-center text-[8px] font-bold tabular-nums">
                      <span>16:30</span>
                      <span className="material-symbols-outlined text-[10px]">battery_full</span>
                    </div>
                    <span className="mt-2 self-start bg-tertiary-container/90 text-tertiary text-[7px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full">Insights · Week 18</span>
                    <p className="mt-2 font-headline-md text-sm font-bold leading-tight">A softer arc this week.</p>
                    <p className="text-[8px] text-on-surface-variant mt-0.5">Mood up 12%. Energy steadier.</p>
                    <div className="mt-2 flex items-end justify-between gap-0.5 h-12 px-0.5">
                      {[
                        { cls: "bg-tertiary-container/70", h: "35%" },
                        { cls: "bg-secondary-container/80", h: "50%" },
                        { cls: "bg-primary-container/80", h: "60%" },
                        { cls: "bg-primary-container", h: "65%" },
                        { cls: "bg-primary", h: "78%" },
                        { cls: "bg-primary", h: "88%" },
                        { cls: "bg-primary-fixed-dim shadow-[0_0_8px_rgba(244,186,154,0.6)]", h: "95%" },
                      ].map((b, i) => (
                        <span key={i} className={`flex-1 rounded-sm ${b.cls}`} style={{ height: b.h }}></span>
                      ))}
                    </div>
                    <div className="mt-1 flex justify-between text-[6px] uppercase tracking-[0.18em] text-on-surface-variant font-bold">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex justify-around items-center bg-white/85 backdrop-blur rounded-full py-1 border border-white/60">
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px]">edit_note</span>
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px]">mood</span>
                      <span className="material-symbols-outlined text-tertiary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                    </div>
                  </div>
                </article>

                {/* Card 4 — Settings */}
                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2" role="img" aria-label="Sundial Settings screen mockup">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-cover rounded-[1.5rem] opacity-55" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" alt="Soft pastel gradient — backdrop for the Settings screen" />
                  <div className="absolute inset-3 z-10 flex flex-col rounded-[1.5rem] p-2.5 text-on-surface bg-gradient-to-b from-white/55 to-white/80">
                    <div className="flex justify-between items-center text-[8px] font-bold tabular-nums">
                      <span>20:14</span>
                      <span className="material-symbols-outlined text-[10px]">battery_full</span>
                    </div>
                    <span className="mt-2 self-start bg-primary-container/90 text-primary text-[7px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full">Settings</span>
                    <p className="mt-2 font-headline-md text-sm font-bold leading-tight">Your rhythm</p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      <li className="flex items-center justify-between rounded-lg bg-white/80 border border-white/60 px-2 py-1">
                        <span className="text-[8px] font-medium">Sunset reminder</span>
                        <span className="w-6 h-3 rounded-full bg-primary relative"><span className="absolute right-0.5 top-0.5 w-2 h-2 rounded-full bg-white"></span></span>
                      </li>
                      <li className="flex items-center justify-between rounded-lg bg-white/80 border border-white/60 px-2 py-1">
                        <span className="text-[8px] font-medium">End-to-end private</span>
                        <span className="w-6 h-3 rounded-full bg-primary relative"><span className="absolute right-0.5 top-0.5 w-2 h-2 rounded-full bg-white"></span></span>
                      </li>
                      <li className="flex items-center justify-between rounded-lg bg-white/80 border border-white/60 px-2 py-1">
                        <span className="text-[8px] font-medium">Streaks</span>
                        <span className="w-6 h-3 rounded-full bg-on-surface-variant/30 relative"><span className="absolute left-0.5 top-0.5 w-2 h-2 rounded-full bg-white"></span></span>
                      </li>
                      <li className="flex items-center justify-between rounded-lg bg-white/80 border border-white/60 px-2 py-1">
                        <span className="text-[8px] font-medium">Mood palette</span>
                        <span className="text-[7px] text-on-surface-variant">Sunset →</span>
                      </li>
                    </ul>
                    <div className="flex-1"></div>
                    <div className="flex justify-around items-center bg-white/85 backdrop-blur rounded-full py-1 border border-white/60">
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px]">edit_note</span>
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[12px]">mood</span>
                      <span className="material-symbols-outlined text-primary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                    </div>
                  </div>
                </article>

                {/* Card 5 — Bedtime */}
                <article className="shrink-0 snap-start w-[240px] sm:w-[280px] aspect-[9/19.5] glass-card rounded-[2rem] p-3 flex flex-col relative overflow-hidden ring-1 ring-white/50 shadow-xl motion-safe:transition-transform motion-safe:duration-300 hover:-translate-y-2" role="img" aria-label="Sundial Bedtime screen mockup">
                  <img width="800" height="1733" loading="lazy" decoding="async" className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] object-cover rounded-[1.5rem] opacity-80" src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" alt="Sunset clouds — backdrop for the Bedtime screen" />
                  <div className="absolute inset-3 z-10 flex flex-col rounded-[1.5rem] p-2.5 text-white bg-gradient-to-b from-black/30 via-black/20 to-black/55">
                    <div className="flex justify-between items-center text-[8px] font-bold tabular-nums drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                      <span>22:07</span>
                      <span className="material-symbols-outlined text-[10px]">battery_full</span>
                    </div>
                    <span className="mt-2 self-start bg-white/15 backdrop-blur text-white text-[7px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full border border-white/30">Bedtime</span>
                    <p className="mt-2 font-headline-md text-sm font-bold leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">Wind down softly.</p>
                    <p className="text-[8px] mt-1 opacity-80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">21 min until your sunset reminder.</p>
                    <div className="mt-3 mx-auto w-16 h-8 relative">
                      <div className="absolute inset-x-0 bottom-0 h-px bg-white/40"></div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-12 rounded-full bg-gradient-to-t from-primary-container to-secondary-container/0 border-2 border-white/60 -translate-y-1/4 shadow-[0_0_24px_rgba(244,186,154,0.55)]"></div>
                    </div>
                    <div className="flex-1"></div>
                    <button type="button" className="rounded-full bg-white/20 backdrop-blur border border-white/30 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em]">Start ritual</button>
                    <div className="mt-1.5 flex justify-around items-center bg-white/15 backdrop-blur rounded-full py-1 border border-white/30">
                      <span className="material-symbols-outlined text-white/60 text-[12px]">edit_note</span>
                      <span className="material-symbols-outlined text-white/60 text-[12px]">mood</span>
                      <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
                    </div>
                  </div>
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

                  {/* Persistent status bar overlay */}
                  <div className="absolute top-2 inset-x-0 z-25 px-5 flex justify-between items-center text-white text-[10px] font-bold tabular-nums drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                    <span>9:41</span>
                    <div className="flex gap-1.5 items-center">
                      <span className="material-symbols-outlined text-[12px]">network_wifi</span>
                      <span className="material-symbols-outlined text-[12px]">battery_full</span>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-14 h-24 z-20 bg-gradient-to-t from-black/65 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-x-0 bottom-16 p-5 z-20 text-white" style={{ minHeight: '56px' }}>
                    {SCREEN_FRAMES.map(f => (
                      <span key={"cap-" + f.tag} className="sundial-cycle-img font-caption uppercase tracking-[0.3em] text-[10px] absolute left-5 bottom-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" style={{ animationDelay: f.delay }}>{f.caption}</span>
                    ))}
                  </div>

                  {/* Persistent bottom tab bar */}
                  <div className="absolute bottom-3 inset-x-3 z-25 flex justify-around items-center bg-white/90 backdrop-blur-md rounded-full px-3 py-2 border border-white/60 shadow-lg">
                    <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                    <span className="material-symbols-outlined text-secondary text-[18px]">mood</span>
                    <span className="material-symbols-outlined text-tertiary text-[18px]">history</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-[18px]">spa</span>
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
                <div className="w-full max-w-[280px] aspect-[9/19.5] bg-white rounded-[2.5rem] sm:rounded-[3rem] border-[8px] border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden ring-1 ring-black/10 motion-safe:transition-transform motion-safe:duration-700 hover:rotate-0 rotate-[6deg]" role="img" aria-label="Sundial app — evening rewind on the phone, sunset photo of the day">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-6 bg-white rounded-b-2xl z-20 shadow-sm"></div>
                  <img loading="lazy" decoding="async" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=80" alt="Sundial app open on a phone — sunset tones reflecting the moment captured" />
                  {/* UI chrome */}
                  <div className="absolute inset-0 z-10 flex flex-col px-3 pt-3 pb-3 text-white pointer-events-none">
                    <div className="flex justify-between items-center text-[9px] font-bold tabular-nums drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                      <span>21:48</span>
                      <div className="flex gap-1 items-center">
                        <span className="material-symbols-outlined text-[11px]">network_wifi</span>
                        <span className="material-symbols-outlined text-[11px]">battery_full</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="material-symbols-outlined text-white text-[16px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">arrow_back</span>
                      <span className="text-[7px] uppercase tracking-[0.25em] font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">— Evening · Rewind</span>
                      <span className="material-symbols-outlined text-white text-[16px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">share</span>
                    </div>
                    <div className="flex-1"></div>
                    <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 p-2.5 shadow-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[7px] uppercase tracking-[0.2em] font-bold opacity-90">Sunday · Recap</span>
                        <span className="bg-primary-container/90 text-primary text-[7px] px-1.5 py-0.5 rounded-full font-bold tabular-nums">3 notes</span>
                      </div>
                      <p className="text-[9px] leading-snug">Tea by the lighthouse. Light went pink at twenty past seven.</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="bg-secondary-container/70 text-on-surface text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-[0.15em]">Calm</span>
                        <span className="bg-primary-container/70 text-on-surface text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-[0.15em]">Bright</span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-around items-center bg-white/85 backdrop-blur rounded-full px-2 py-1.5 border border-white/60 shadow">
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[14px]">edit_note</span>
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[14px]">mood</span>
                      <span className="material-symbols-outlined text-tertiary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-[14px]">spa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trusted by — real brand logos via Simple Icons CDN replacing fake press names */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12" aria-labelledby="trusted-heading">
            <div className="flex flex-col items-center text-center gap-3 mb-8 md:mb-10">
              <span className="font-caption uppercase tracking-[0.3em] text-[11px] text-on-surface-variant">— Trusted by</span>
              <h2 id="trusted-heading" className="font-headline-md text-[clamp(1.25rem,2.5vw,1.75rem)] text-balance">Quietly used at studios you'll know.</h2>
            </div>
            <div className="glass-card rounded-[2rem] sm:rounded-[2.5rem] py-8 sm:py-10 px-6 sm:px-8 ring-1 ring-white/40 shadow-md">
              <ul role="list" className="flex flex-wrap justify-center gap-x-8 gap-y-6 sm:gap-x-12 md:gap-x-14 items-center">
                {TRUSTED_BRANDS.map(b => (
                  <li key={b.slug}>
                    <img src={`https://cdn.simpleicons.org/${b.slug}/${b.color}`} alt={b.name} className="h-7 sm:h-8 w-auto opacity-75 hover:opacity-100 motion-safe:transition-opacity duration-300" loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            </div>
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

          {/* Promise — full-bleed deep tertiary strip with 4 commitment columns (premium colour break against the pastel sunset page) */}
          <section className="full-bleed relative overflow-hidden" aria-labelledby="promise-heading" style={{ background: 'linear-gradient(135deg, #1a1530 0%, #2a2050 50%, #1d1838 100%)' }}>
            <div className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full bg-tertiary-container opacity-15 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[35vw] h-[35vw] rounded-full bg-primary-container opacity-12 blur-[100px] pointer-events-none"></div>
            <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)' }}></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-20 md:py-28">
              <div className="flex flex-col items-center text-center gap-3 mb-12 md:mb-16">
                <span className="font-caption uppercase tracking-[0.3em] text-[11px] text-white/55">— IV · The Promise</span>
                <h2 id="promise-heading" className="font-headline-xl text-[clamp(1.75rem,4vw+0.5rem,3rem)] text-white text-balance leading-[1.05] max-w-3xl">Built for the slow part of your day.</h2>
                <p className="font-body-md text-[clamp(1rem,1.5vw,1.125rem)] text-white/70 max-w-[55ch] text-pretty mt-2">Four commitments we won't quietly rewrite over the years.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {PROMISE_FACETS.map(f => (
                  <div key={f.title} className="flex flex-col gap-3 text-white">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                      <span className={`material-symbols-outlined ${f.iconColor} text-[24px]`} aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-base sm:text-lg leading-tight">{f.title}</h3>
                    <p className="font-body-md text-xs sm:text-sm text-white/65 leading-relaxed text-pretty">{f.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 md:mt-16 flex justify-center">
                <span className="inline-flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-full px-5 py-2 text-white/80">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim sundial-pulse"></span>
                  <span className="font-caption text-[11px] uppercase tracking-[0.25em]">Sundial · Made for slow mornings</span>
                </span>
              </div>
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
