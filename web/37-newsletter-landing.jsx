const PAST_ISSUES = [
  {
    no: '№082',
    title: 'On Quiet Tools',
    date: 'Sep 12 · 2023',
    src: 'https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=800&q=85&auto=format&fit=crop',
    tilt: 'sb-polaroid-tilt-1',
    tape: true,
  },
  {
    no: '№083',
    title: 'The Untyped Margin',
    date: 'Sep 19 · 2023',
    src: 'https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=800&q=85&auto=format&fit=crop',
    tilt: 'sb-polaroid-tilt-2',
    tape: false,
  },
  {
    no: '№084',
    title: 'Sundown Code',
    date: 'Sep 26 · 2023',
    src: 'https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=800&q=85&auto=format&fit=crop',
    tilt: 'sb-polaroid-tilt-3',
    tape: true,
  },
  {
    no: '№085',
    title: 'Slow Migrations',
    date: 'Oct 03 · 2023',
    src: 'https://images.unsplash.com/photo-1618488373960-404fe668e524?w=800&q=85&auto=format&fit=crop',
    tilt: 'sb-polaroid-tilt-4',
    tape: false,
  },
  {
    no: '№086',
    title: 'On Forgetting',
    date: 'Oct 17 · 2023',
    src: 'https://images.unsplash.com/photo-1622912058707-1b33af81db4f?w=800&q=85&auto=format&fit=crop',
    tilt: 'sb-polaroid-tilt-5',
    tape: true,
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is this a paid newsletter?',
    a: 'No. The free archive is permanent, the weekly issue is free, and there is no paywall planned. A small voluntary subscription supports the writing if you’d like to, but it unlocks nothing the free list doesn’t already get.',
  },
  {
    q: 'How long are the essays?',
    a: 'Twelve to twenty-six minutes, with footnotes. They get longer when the subject demands it and shorter when restraint is the better answer. There’s no minimum word count.',
  },
  {
    q: 'Will my email be shared, sold, or tracked?',
    a: 'Never shared, never sold. The list is hosted on a small provider that doesn’t track open-or-click pixels — open rates here are an honourable estimate, not a surveillance metric.',
  },
  {
    q: 'Can I republish, quote, or translate?',
    a: 'Yes — under CC BY-NC. Translations welcome; please link to the original and email a copy of the translation when it’s live so the archive can list it.',
  },
  {
    q: 'What if I miss a week?',
    a: 'The archive holds every issue back to №001. Most readers don’t read in order, and many save the longer pieces for a rainy Saturday. The newsletter is built to be read out of sequence.',
  },
];

const STUDIO_STATS = [
  { label: 'Drafts/issue', value: '11' },
  { label: 'Hours/week', value: '26' },
  { label: 'Tea cups', value: '∞' },
  { label: 'Word count', value: '3,200' },
];

export default function T37NewsletterLanding() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-variant": "#e9e1d7",
                        "surface-tint": "#615e5a",
                        "on-error": "#ffffff",
                        "primary-fixed": "#e7e1dc",
                        "surface-container-highest": "#e9e1d7",
                        "on-tertiary-fixed": "#1b1b1d",
                        "inverse-on-surface": "#f7f0e5",
                        "on-surface": "#1e1b15",
                        "inverse-surface": "#333029",
                        "secondary-fixed": "#ffdbcf",
                        "surface-bright": "#fff8f1",
                        "primary-fixed-dim": "#cbc5c0",
                        "on-secondary-container": "#762808",
                        "tertiary-fixed": "#e4e2e4",
                        "secondary": "#9c4323",
                        "on-primary": "#ffffff",
                        "on-secondary-fixed-variant": "#7d2d0e",
                        "tertiary-fixed-dim": "#c8c6c8",
                        "on-surface-variant": "#4b463f",
                        "outline": "#7c766e",
                        "tertiary-container": "#1b1b1d",
                        "surface-container": "#f5ede3",
                        "background": "#fff8f1",
                        "on-secondary": "#ffffff",
                        "on-tertiary": "#ffffff",
                        "on-background": "#1e1b15",
                        "on-primary-fixed-variant": "#494643",
                        "outline-variant": "#cdc5bc",
                        "on-error-container": "#93000a",
                        "on-tertiary-fixed-variant": "#474649",
                        "on-tertiary-container": "#858386",
                        "surface-dim": "#e0d9cf",
                        "on-secondary-fixed": "#390c00",
                        "on-primary-container": "#87837f",
                        "surface": "#fff8f1",
                        "secondary-container": "#ff9069",
                        "surface-container-lowest": "#ffffff",
                        "tertiary": "#000000",
                        "surface-container-low": "#faf2e8",
                        "error-container": "#ffdad6",
                        "secondary-fixed-dim": "#ffb59c",
                        "on-primary-fixed": "#1d1b18",
                        "inverse-primary": "#cbc5c0",
                        "error": "#ba1a1a",
                        "primary-container": "#1d1b18",
                        "primary": "#000000",
                        "surface-container-high": "#efe7dd"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "paragraph-gap": "24px",
                        "unit": "8px",
                        "container-max": "680px",
                        "section-gap": "80px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "headline-md": ["Newsreader"],
                        "ui-button": ["Inter"],
                        "headline-xl": ["Newsreader"],
                        "body-lg": ["Inter"],
                        "headline-lg": ["Newsreader"],
                        "body-md": ["Inter"],
                        "label-caps": ["Inter"]
                    },
                    "fontSize": {
                        "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "500"}],
                        "ui-button": ["14px", {"lineHeight": "1", "fontWeight": "500"}],
                        "headline-xl": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                        "body-lg": ["18px", {"lineHeight": "1.7", "letterSpacing": "-0.01em", "fontWeight": "400"}],
                        "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "500"}],
                        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}]
                    }
                }
            }
        }
` }} />
      <style type="text/tailwindcss" dangerouslySetInnerHTML={{ __html: `
        @layer utilities {
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
        }
        body {
            background-color: #F9F3EA;
        }
        html, body { overflow-x: clip; }
        .sb-full-bleed {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
            max-width: none;
        }
        .sb-wide {
            width: 80vw;
            margin-left: calc(50% - 40vw);
            margin-right: calc(50% - 40vw);
            max-width: 1400px;
        }
        .sb-wide-narrow {
            width: 75vw;
            margin-left: calc(50% - 37.5vw);
            margin-right: calc(50% - 37.5vw);
            max-width: 1280px;
        }
        .sb-polaroid {
            background: #fffaf2;
            padding: 12px 12px 36px 12px;
            box-shadow: 0 18px 40px -22px rgba(30,27,21,0.35), 0 6px 14px -8px rgba(30,27,21,0.25);
            border: 1px solid rgba(125,45,14,0.12);
        }
        .sb-polaroid-tilt-1 { transform: rotate(-4deg); }
        .sb-polaroid-tilt-2 { transform: rotate(2deg) translateY(-12px); }
        .sb-polaroid-tilt-3 { transform: rotate(-2deg) translateY(8px); }
        .sb-polaroid-tilt-4 { transform: rotate(5deg); }
        .sb-polaroid-tilt-5 { transform: rotate(-3deg) translateY(4px); }
        .sb-polaroid:hover { transform: rotate(0) translateY(-4px); transition: transform 350ms ease; z-index: 10; }
        .sb-tape::before {
            content: '';
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%) rotate(-3deg);
            width: 64px;
            height: 18px;
            background: linear-gradient(180deg, rgba(166,75,42,0.18), rgba(166,75,42,0.28));
            border-left: 1px dashed rgba(166,75,42,0.30);
            border-right: 1px dashed rgba(166,75,42,0.30);
            box-shadow: 0 2px 4px rgba(30,27,21,0.10);
        }
        .sb-faq summary::-webkit-details-marker { display: none; }
        .sb-faq summary { list-style: none; cursor: pointer; }
        .sb-faq summary .sb-chevron { transition: transform 250ms ease; }
        .sb-faq[open] summary .sb-chevron { transform: rotate(180deg); }
        .sb-cinema-caption {
            font-feature-settings: "tnum";
            letter-spacing: 0.08em;
        }
        @media (prefers-reduced-motion: reduce) {
            .sb-faq summary .sb-chevron { transition: none; }
            .sb-polaroid:hover { transition: none; transform: none; }
        }
` }} />

      <div className="dark bg-surface text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">

        {/* TopAppBar */}
        <header className="w-full border-b border-stone-200/50 dark:border-stone-800/50 transition-all duration-200 ease-in-out bg-stone-50 dark:bg-stone-950">
          <div className="max-w-[680px] mx-auto flex justify-between items-center py-10 px-6">
            <a className="text-3xl font-serif italic text-stone-900 dark:text-stone-50 tracking-tight" href="#">Slow Bytes</a>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-stone-500 dark:text-stone-400 hover:text-red-800 dark:hover:text-red-500 transition-colors font-ui-button text-ui-button" href="#archive">Archive</a>
              <a className="text-stone-500 dark:text-stone-400 hover:text-red-800 dark:hover:text-red-500 transition-colors font-ui-button text-ui-button" href="#about">About</a>
              <a className="text-stone-500 dark:text-stone-400 hover:text-red-800 dark:hover:text-red-500 transition-colors font-ui-button text-ui-button" href="#essays">Essays</a>
              <a className="text-stone-500 dark:text-stone-400 hover:text-red-800 dark:hover:text-red-500 transition-colors font-ui-button text-ui-button" href="#faq">FAQ</a>
            </nav>
            <button className="bg-[#A64B2A] text-on-primary px-4 py-2 rounded font-ui-button text-ui-button hover:bg-secondary-container hover:text-on-secondary-container transition-colors">Subscribe</button>
          </div>
        </header>

        <main className="max-w-container-max mx-auto px-6 py-section-gap flex flex-col gap-section-gap">

          {/* Hero */}
          <section className="flex flex-col gap-8 text-center pt-10">
            <h1 className="font-headline-xl text-headline-xl text-on-surface text-balance">A weekly essay on slow software</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">Thoughtful reflections on digital craftsmanship, intentional tools, and the art of building software that lasts.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full mt-4">
              <input className="flex-1 bg-transparent border-b border-outline-variant focus:border-[#A64B2A] focus:ring-0 px-0 py-3 font-body-md text-body-md placeholder-on-surface-variant/60 transition-colors" placeholder="Your email address..." required type="email" />
              <button className="bg-[#A64B2A] text-on-primary px-6 py-3 rounded font-ui-button text-ui-button hover:opacity-90 transition-opacity whitespace-nowrap" type="submit">Subscribe</button>
            </form>
            <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-outline-variant/30">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">4,892 readers. Read by people at Linear, Apple, NYT.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <img alt="Avatar" className="w-8 h-8 rounded-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADVwT1Ige5P9qO8Xrl3cGT9Ivs5z7AqMsos7IWvFeIGFbtbZQx01yxuakOoT31CUajidAv3depN9-K0AOgIZ5YldsHJSdad7eGkg7CCU4t3HNMcsah2AANuVDYxt720zDfPXapDVFfKsHc0hVOHnmN3u5_z0BD1uQ6zNgLT_e7QkEKOgSMd1n1z6sjF86kF8OlOqN2Tx-ipoVC383DbOWkvkHxnvcK8h0Bvhu5qrz7Q2o5Tr-iu-HtH3ExQFbbT_BS3cTmAaZypas" />
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Design at Linear</span>
                </div>
                <div className="flex items-center gap-2">
                  <img alt="Avatar" className="w-8 h-8 rounded-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSZhpVsKa0tBKu4ZLh__g0NVDcUt0PTyQBw0lyPNK08FvXS_4TJpyRtoY52go5sAMWcTCXWN5ir6SjmYXyqF8ZCHRSqpy3Qzi0HPTwfS1lQGK0lumBXfu6WMeRJ1xSd8znfincp2ucO_yLRciood-U7taKzNZY_XlTjLX8NjUHcT2MTSt05y4vN5Hz9HLOms9cuuk0ZC1cJkzxAqSvZZOsvUNC0TyaDIdPZK92JIny8quQBFuuK5NFqBLcKUFK27gfehDJXxGnqJY" />
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Engineer at Apple</span>
                </div>
                <div className="flex items-center gap-2">
                  <img alt="Avatar" className="w-8 h-8 rounded-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC744vLUlUCifqUzc0fk6PGio4Iuob2BIMDef6TWy2rh4FsZ8BVRcxBH_P6WLQIxAEMKgJmc4y_A0gcMnhy2GuVAjUCXdm7pvqFHvDs8S871Nk7gWWz6GyM-tu1hRtIOw0Tllqj8dfx21DjGC6kB3C9--6lB7vH04rMUZsfQZ9l9Yz8AVoKpewGB3hPKBl6xUGfcmuByiXdyYupGw6O8uo-jNy_GjXm0nfQFnjMChOw49PwdjcUQkDuOJ1k-KWLuk1EFkEBOhXuvg" />
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Editor at NYT</span>
                </div>
                <div className="flex items-center gap-2">
                  <img alt="Avatar" className="w-8 h-8 rounded-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAUUtDW_1QDIkZIOY4wrb9vLM1tf3SRoECBDVpbpd_KqEpMCmqsTTFgWpTB9Y_Gcu7Ynh6D20I9ly4ThkNniBYskb8ZSNM5wbd2epYNAFYWULMtl7Y18g01ULJC_UQ-_wOQvm15QNAQyJEScCcyotvnoR3iepBwGCSv68aG-4TOUZc4TCiGbdOiIiMGd3mfzLghvVqG5y161m5cl6iJei4bJmUd9fdISgvxKBilKRqOOBMRMB_V7uaEY_haT-ccC_5tCWyo7mbR98" />
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Founder at Stripe</span>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Latest Issue — image-as-bg under content card (NOVEL #6) */}
          <section className="sb-full-bleed relative overflow-hidden" aria-labelledby="featured-heading">
            <img alt="This week's issue cover" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1920&q=85&auto=format&fit=crop" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(30,27,21,0.55) 0%, rgba(30,27,21,0.30) 40%, rgba(30,27,21,0.65) 100%)' }}></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 18% 80%, rgba(166,75,42,0.18) 0%, transparent 70%)' }}></div>
            <div className="relative max-w-[1100px] mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-stretch md:items-center gap-10">
              <div className="hidden md:block md:w-1/3"></div>
              <div className="w-full md:w-2/3 bg-surface/85 backdrop-blur-md p-8 md:p-10 rounded-lg border border-outline-variant/40 shadow-[0_24px_60px_-18px_rgba(30,27,21,0.45)] flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="font-label-caps text-label-caps text-[#A64B2A] uppercase tracking-widest">Issue №087</span>
                  <span className="h-px flex-1 bg-outline-variant/40"></span>
                  <time className="font-label-caps text-label-caps text-on-surface-variant">October 31, 2023</time>
                </div>
                <h2 id="featured-heading" className="font-headline-lg text-headline-lg text-on-surface">The Cathedral and the Bazaar, Revisited</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">A long, slow read on what has changed — and what hasn’t — in the twenty-six years since Eric Raymond’s essay. We map quiet codebases that outlast their authors, and ask what “release early, release often” really costs the people who maintain.</p>
                <dl className="grid grid-cols-3 gap-6 pt-4 border-t border-outline-variant/30">
                  <div className="flex flex-col gap-1">
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Read time</dt>
                    <dd className="font-headline-md text-[20px] text-on-surface tabular-nums">22 min</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Format</dt>
                    <dd className="font-headline-md text-[20px] text-on-surface">Essay</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Footnotes</dt>
                    <dd className="font-headline-md text-[20px] text-on-surface tabular-nums">14</dd>
                  </div>
                </dl>
                <div className="flex items-center gap-4 pt-2">
                  <a className="bg-[#A64B2A] text-on-primary px-5 py-2.5 rounded font-ui-button text-ui-button hover:opacity-90 transition-opacity" href="#">Read this issue →</a>
                  <a className="font-ui-button text-ui-button text-on-surface-variant border border-outline-variant px-4 py-2.5 rounded hover:bg-surface-container-low transition-colors" href="#">Free preview</a>
                </div>
              </div>
            </div>
          </section>

          {/* Archive */}
          <section id="archive" className="sb-wide grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-stretch">
            <div className="md:col-span-9 flex flex-col gap-8">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 pb-4">Recent issues</h2>
            <div className="flex flex-col gap-0 divide-y divide-outline-variant/20">

              <article className="group py-6 flex flex-col gap-2 hover:bg-surface-container-low transition-colors -mx-4 px-4 rounded">
                <time className="font-label-caps text-label-caps text-on-surface-variant/70">October 24, 2023</time>
                <a className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4" href="#">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-[#A64B2A] transition-colors">The Tyranny of Instant Feedback</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 max-w-xl">Why building software that forces users to wait might actually be the key to fostering deeper, more meaningful engagement with digital tools.</p>
                  </div>
                  <span className="font-ui-button text-ui-button text-[#A64B2A] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">Read essay →</span>
                </a>
              </article>

              <article className="group py-6 flex flex-col gap-2 hover:bg-surface-container-low transition-colors -mx-4 px-4 rounded">
                <time className="font-label-caps text-label-caps text-on-surface-variant/70">October 17, 2023</time>
                <a className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4" href="#">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-[#A64B2A] transition-colors">Digital Brutalism and Honest Interfaces</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 max-w-xl">Stripping away the glossy veneer to reveal the underlying mechanics of our applications. An argument for structural transparency in design.</p>
                  </div>
                  <span className="font-ui-button text-ui-button text-[#A64B2A] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">Read essay →</span>
                </a>
              </article>

              <article className="group py-6 flex flex-col gap-2 hover:bg-surface-container-low transition-colors -mx-4 px-4 rounded">
                <time className="font-label-caps text-label-caps text-on-surface-variant/70">October 10, 2023</time>
                <a className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4" href="#">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-[#A64B2A] transition-colors">In Defense of the Command Line</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 max-w-xl">Text as the ultimate universal interface. Exploring the enduring elegance and unmatched efficiency of typing commands instead of clicking buttons.</p>
                  </div>
                  <span className="font-ui-button text-ui-button text-[#A64B2A] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">Read essay →</span>
                </a>
              </article>

              <article className="group py-6 flex flex-col gap-2 hover:bg-surface-container-low transition-colors -mx-4 px-4 rounded">
                <time className="font-label-caps text-label-caps text-on-surface-variant/70">October 3, 2023</time>
                <a className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4" href="#">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-[#A64B2A] transition-colors">Software as a Quiet Companion</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 max-w-xl">Designing tools that respect your attention. How to build applications that perform their function silently and step out of the way.</p>
                  </div>
                  <span className="font-ui-button text-ui-button text-[#A64B2A] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">Read essay →</span>
                </a>
              </article>

              <article className="group py-6 flex flex-col gap-2 hover:bg-surface-container-low transition-colors -mx-4 px-4 rounded">
                <time className="font-label-caps text-label-caps text-on-surface-variant/70">September 26, 2023</time>
                <a className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4" href="#">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-[#A64B2A] transition-colors">The Maintenance Phase</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 max-w-xl">Why preserving old code is a more noble pursuit than writing new features. A love letter to legacy systems and the engineers who tend them.</p>
                  </div>
                  <span className="font-ui-button text-ui-button text-[#A64B2A] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">Read essay →</span>
                </a>
              </article>
            </div>
            <div className="text-left mt-4">
              <a className="font-ui-button text-ui-button text-on-surface-variant border border-outline-variant px-4 py-2 rounded hover:bg-surface-container-low transition-colors inline-block" href="#archive-full">View full archive</a>
            </div>
            </div>
            {/* Right column: 3 vertically stacked images, height matches the issues list on the left */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded min-h-[180px]">
                <img alt="Drafts on the desk" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://images.unsplash.com/photo-1732408433038-73d2f6741fc5?w=900&q=85&auto=format&fit=crop" />
              </div>
              <div className="flex-1 overflow-hidden rounded min-h-[180px]">
                <img alt="Pencils, paper, and morning light" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://images.unsplash.com/photo-1642543492366-a92039433543?w=900&q=85&auto=format&fit=crop" />
              </div>
              <div className="flex-1 overflow-hidden rounded min-h-[180px]">
                <img alt="A second cup of tea" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://images.unsplash.com/photo-1458819714733-e5ab3d536722?w=900&q=85&auto=format&fit=crop" />
              </div>
            </div>
          </section>

          {/* Past Issues — polaroid stack (NOVEL #3). 2x larger polaroids: dropped grid from 5 cols to 3 cols, and the section uses sb-wide. */}
          <section id="past-issues" className="sb-wide flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 pb-4">From the desk drawer</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Five issues clipped to the cork board. Pinned, taped, and mostly out of order. Click any cover to read the full piece.</p>
            </div>
            <div className="relative py-12 md:py-16">
              {/* Flex-wrap with justify-center so the orphan last row (2 of 5) sits centered with equal padding either side */}
              <div className="flex flex-wrap justify-center gap-10 md:gap-12 items-center">
                {PAST_ISSUES.map((p) => (
                  <figure key={p.no} className={`sb-polaroid ${p.tilt} ${p.tape ? 'sb-tape' : ''} relative w-full sm:w-[calc(50%-1.25rem)] md:w-[calc(33.333%-2rem)]`}>
                    <img alt={`Cover — Issue ${p.no}`} className="w-full aspect-[3/4] object-cover grayscale" src={p.src} />
                    <figcaption className="pt-3 flex flex-col gap-1 items-center text-center">
                      <span className="font-headline-md text-[14px] text-on-surface italic">{p.no} — {p.title}</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant/80 uppercase tracking-widest">{p.date}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Inside the Studio — 3-col, middle image bleeds from grayscale (top) to colour (bottom). 80vw section with 5vw outer padding + 5vw column gaps (5/20/5/20/5/20/5 pattern). */}
          <section id="studio" className="sb-wide grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-[5vw] md:px-[5vw] items-stretch">
            {/* Left col: heading + intro */}
            <div className="flex flex-col gap-4">
              <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 pb-4">Inside the studio</h2>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">A small room, a kettle, and far too many books.</h3>
              <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-paragraph-gap">
                <p>The newsletter is written by hand, in pencil, on the back of last week’s drafts. It gets a second pass with tea, a third pass with a kitchen timer, and a fourth pass after a walk. Only then does it find its way into a text editor.</p>
                <p>I keep three notebooks: one for ideas that arrived too early, one for ideas that arrived too late, and one for the rare middle. The middle is what I send on Sunday.</p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <span className="font-label-caps text-label-caps text-[#A64B2A] uppercase tracking-widest">Detail · 03</span>
                <span className="h-px flex-1 bg-outline-variant/40"></span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Inside</span>
              </div>
            </div>

            {/* Middle col: image with grayscale-to-colour bleed (gray on top, full colour bottom) */}
            <div className="relative min-h-[420px]">
              <img alt="Inside the studio — colour layer" className="absolute inset-0 w-full h-full object-cover rounded" src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop" />
              <img alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover rounded grayscale" src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop" style={{ WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 28%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 0%, #000 28%, transparent 100%)" }} />
              <span className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-2.5 py-1 font-label-caps text-[10px] text-on-surface uppercase tracking-widest border border-outline-variant/40 z-10">Studio · 7:14 AM</span>
              <span className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm px-2.5 py-1 font-label-caps text-[10px] text-on-surface uppercase tracking-widest border border-outline-variant/40 z-10">Colour bleeds in ↓</span>
            </div>

            {/* Right col: rest of narrative + stats */}
            <div className="flex flex-col gap-paragraph-gap">
              <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-paragraph-gap">
                <p>There’s a window above the desk that faces a brick wall. The wall is patient, and so is the work. I read each draft aloud at least twice before it ships — if a sentence stumbles in the mouth, it stumbles on the page.</p>
                <p>The studio is small enough that the cat can reach every surface, which is, in its own way, a useful editorial constraint.</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/30 mt-auto">
                {STUDIO_STATS.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <dt className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">{s.label}</dt>
                    <dd className="font-headline-md text-[18px] text-on-surface tabular-nums">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Frequency / Cadence — wide cinema strip 21:9 (NOVEL #11) */}
          <section className="sb-full-bleed relative overflow-hidden" aria-labelledby="cadence-heading">
            <div className="relative w-full" style={{ aspectRatio: '21 / 9' }}>
              <img alt="Cadence — light through the studio at the hour the issue ships" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1920&q=85&auto=format&fit=crop" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(30,27,21,0.20) 0%, rgba(30,27,21,0.05) 40%, rgba(30,27,21,0.85) 100%)' }}></div>
              <div className="absolute top-6 md:top-10 left-6 md:left-12">
                <span className="font-label-caps text-[10px] text-white/90 uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">Detail · 04 — Cadence</span>
              </div>
              <h2 id="cadence-heading" className="absolute top-1/2 left-6 md:left-12 right-6 md:right-12 -translate-y-1/2 font-headline-xl text-[clamp(28px,5vw,68px)] leading-[1.05] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] max-w-3xl">One essay. Sunday. <em className="italic font-normal">No exceptions, no apologies.</em></h2>
            </div>
            <div className="bg-on-surface text-surface-bright">
              <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sb-cinema-caption">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-label-caps text-[10px] uppercase">Schedule</span>
                  <span className="font-body-md text-[13px] tabular-nums">Sunday · 09:00 GMT</span>
                  <span className="opacity-40">|</span>
                  <span className="font-body-md text-[13px] tabular-nums">52 issues / year</span>
                  <span className="opacity-40">|</span>
                  <span className="font-body-md text-[13px]">Ad-free, footnoted, archivable</span>
                </div>
                <span className="font-label-caps text-[10px] uppercase opacity-70">SB / 087 / 2023</span>
              </div>
            </div>
          </section>

          {/* Testimonials — 75vw wide */}
          <section className="sb-wide-narrow flex flex-col gap-8 bg-surface-container p-8 md:p-12 rounded-lg">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-center">From readers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-4 relative">
                <div className="absolute -left-4 -top-2 w-1 h-full bg-[#A64B2A]/20"></div>
                <p className="font-headline-md text-[20px] leading-snug text-on-surface italic">"The only newsletter I actually read top to bottom every Sunday morning. A breath of fresh air in a tech world obsessed with speed."</p>
                <span className="font-ui-button text-ui-button text-on-surface-variant">— Sarah Jenkins, Designer</span>
              </div>
              <div className="flex flex-col gap-4 relative">
                <div className="absolute -left-4 -top-2 w-1 h-full bg-[#A64B2A]/20"></div>
                <p className="font-headline-md text-[20px] leading-snug text-on-surface italic">"Slow Bytes articulates the underlying malaise I've felt about modern web development for years. Essential reading."</p>
                <span className="font-ui-button text-ui-button text-on-surface-variant">— David Chen, Staff Engineer</span>
              </div>
              <div className="flex flex-col gap-4 relative">
                <div className="absolute -left-4 -top-2 w-1 h-full bg-[#A64B2A]/20"></div>
                <p className="font-headline-md text-[20px] leading-snug text-on-surface italic">"Beautifully written, rigorously argued. It makes me want to build better, simpler tools."</p>
                <span className="font-ui-button text-ui-button text-on-surface-variant">— Elena Rostova, Founder</span>
              </div>
            </div>
          </section>

          {/* About — 3-col with 2 stacked images on the left, content split across the other two cols. Same 80vw wide / 5/20/5/20/5/20/5 pattern as Inside Studio. */}
          <section id="about" className="sb-wide grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-[5vw] md:px-[5vw] items-stretch py-8">
            {/* Left col: 2 images stacked, total height matches the two content cols */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded shadow-sm min-h-[180px]">
                <img alt="Author desk" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzSHzJWbV_hpglLnAKO8ofi4soTdth3fsTfox-qnwtIGtCGpdLPZmm7h7naWqEvoVNJ5We8bU49YIOccjXkNjTh6yuV4AR34hzp55TQRKmkH85DZ0MuvAITw9-QKo-tqgZtm9I2mPUZQXZDDvvPtUKlcberoHtGVXKrBQlqkZp8A2M3M3nRaT47A7dRsnoW4NCdn5tQ-4BEPvlDxSXOlIhA3eyRQNg-Ds90s6BJ0lyRQ1a2jr57Nq9ppQ0N3J7vSYpRjGfZLvpKkE" />
              </div>
              <div className="flex-1 overflow-hidden rounded shadow-sm min-h-[180px]">
                <img alt="Manuscript pages on the desk" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://images.unsplash.com/photo-1732408433038-73d2f6741fc5?w=900&q=85&auto=format&fit=crop" />
              </div>
            </div>
            {/* Middle col: heading + first half of bio + "currently" card pinned to bottom */}
            <div className="flex flex-col gap-6">
              <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 pb-4">About the author</h2>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Writing against the grain of move fast and break things.</h3>
              <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-paragraph-gap">
                <p>I started Slow Bytes because I was exhausted. Exhausted by the endless churn of new frameworks, the pressure to ship half-baked features, and the creeping bloat of modern applications.</p>
                <p>Slow software isn't about writing code slowly. It's a philosophy of intentionality.</p>
              </div>
              {/* Bottom-aligned card — bottoms align with the left image stack */}
              <div className="mt-auto bg-surface-container-low border border-outline-variant/30 rounded p-5 flex flex-col gap-3">
                <span className="font-label-caps text-label-caps text-[#A64B2A] uppercase tracking-[0.2em]">— Currently working on</span>
                <ul className="font-body-md text-[14px] text-on-surface-variant flex flex-col gap-2">
                  <li className="flex items-baseline justify-between border-b border-outline-variant/20 pb-2"><span>The half-life of a framework</span><span className="font-label-caps text-[10px] tabular-nums opacity-70">draft · 04</span></li>
                  <li className="flex items-baseline justify-between border-b border-outline-variant/20 pb-2"><span>Notes on legible logs</span><span className="font-label-caps text-[10px] tabular-nums opacity-70">draft · 02</span></li>
                  <li className="flex items-baseline justify-between"><span>A long answer about caching</span><span className="font-label-caps text-[10px] tabular-nums opacity-70">draft · 01</span></li>
                </ul>
              </div>
            </div>
            {/* Right col: second half of bio + "around the web" card pinned to bottom */}
            <div className="flex flex-col gap-6">
              <span className="font-label-caps text-label-caps text-[#A64B2A] uppercase tracking-widest border-b border-outline-variant/30 pb-4">— Editor's note</span>
              <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-paragraph-gap">
                <p>It's about taking the time to design robust architectures, prioritising user privacy over engagement metrics, and building tools that respect the user's attention.</p>
                <p>Every week, I explore these themes through essays that draw on history, architecture, and personal experience in the tech industry. If you believe software should be crafted rather than merely assembled, you might feel at home here.</p>
                <p className="font-['Newsreader'] italic text-[20px] text-on-surface mt-2">— J.</p>
              </div>
              {/* Bottom-aligned card — bottoms align with the left image stack */}
              <div className="mt-auto bg-surface-container-low border border-outline-variant/30 rounded p-5 flex flex-col gap-3">
                <span className="font-label-caps text-label-caps text-[#A64B2A] uppercase tracking-[0.2em]">— Around the web</span>
                <ul className="font-body-md text-[14px] text-on-surface-variant flex flex-col gap-2">
                  <li className="flex items-baseline justify-between border-b border-outline-variant/20 pb-2"><a className="hover:text-[#A64B2A] transition-colors" href="#">RSS · /feed.xml</a><span className="font-label-caps text-[10px] opacity-70">syndicate</span></li>
                  <li className="flex items-baseline justify-between border-b border-outline-variant/20 pb-2"><a className="hover:text-[#A64B2A] transition-colors" href="#">Mastodon · @j</a><span className="font-label-caps text-[10px] opacity-70">social</span></li>
                  <li className="flex items-baseline justify-between"><a className="hover:text-[#A64B2A] transition-colors" href="#">hello@slow.bytes</a><span className="font-label-caps text-[10px] opacity-70">post</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ — native <details> accordion (§M.7) */}
          <section id="faq" className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30 pb-4">Reader questions</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Five things people email about most. If yours isn’t here, the reply address at the bottom of every issue actually goes to a person.</p>
            </div>
            <div className="flex flex-col divide-y divide-outline-variant/30 border-t border-b border-outline-variant/30">
              {FAQ_ITEMS.map((f, i) => (
                <details key={i} className="sb-faq group py-5">
                  <summary className="flex items-start justify-between gap-6">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{f.q}</h3>
                    <span className="sb-chevron material-symbols-outlined text-on-surface-variant shrink-0 mt-1" aria-hidden="true">expand_more</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant pt-3 max-w-2xl">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="w-full mt-24 ease-in-out transition-opacity bg-stone-100/50 dark:bg-stone-900/30 border-t border-stone-200 dark:border-stone-800">
          <div className="max-w-[680px] mx-auto py-16 flex flex-col items-center gap-8 px-6">
            <div className="flex flex-col items-center gap-4 text-center max-w-sm mb-8">
              <h4 className="font-headline-md text-headline-md text-on-surface">Join 4,800+ thoughtful readers</h4>
              <form className="flex w-full gap-2 mt-2">
                <input className="flex-1 bg-surface border border-outline-variant rounded px-3 py-2 font-body-md text-body-md focus:border-[#A64B2A] focus:ring-0" placeholder="Email address" required type="email" />
                <button className="bg-[#A64B2A] text-on-primary px-4 py-2 rounded font-ui-button text-ui-button hover:opacity-90 transition-opacity" type="submit">Subscribe</button>
              </form>
            </div>
            <nav className="flex gap-6">
              <a className="font-sans text-xs uppercase tracking-widest text-stone-500 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-100 underline decoration-red-900/30 transition-colors" href="#">RSS Feed</a>
              <a className="font-sans text-xs uppercase tracking-widest text-stone-500 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-100 underline decoration-red-900/30 transition-colors" href="#">Archive</a>
              <a className="font-sans text-xs uppercase tracking-widest text-stone-500 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-100 underline decoration-red-900/30 transition-colors" href="#">Privacy Policy</a>
            </nav>
            <p className="font-sans text-xs uppercase tracking-widest text-stone-500">© 2024 Slow Bytes. A journal for the intentional reader.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
