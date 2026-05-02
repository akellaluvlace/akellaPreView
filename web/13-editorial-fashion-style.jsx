export default function T13EditorialFashionStyle() {
  const navLinks = [
    { label: "Collections", active: true },
    { label: "Editorial", active: false },
    { label: "Archive", active: false },
    { label: "Studio", active: false },
  ];
  const footerLinks = ["Privacy Policy", "Terms of Service", "Shipping & Returns", "Contact"];
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "outline-variant": "#444748", "outline": "#8e9192", "tertiary": "#ffb3ac",
                "on-surface": "#e2e2e2", "primary": "#c8c6c5",
                "primary-container": "#1e1e1e", "surface-container-lowest": "#0c0f0f",
                "background": "#121414", "on-secondary": "#2f3131",
                "tertiary-container": "#460003", "surface-variant": "#333535",
                "error": "#ffb4ab", "surface": "#121414",
                "surface-container-low": "#1a1c1c", "on-surface-variant": "#c4c7c7",
                "surface-container-high": "#282a2b", "on-tertiary": "#680007",
                "surface-container": "#1e2020", "secondary": "#c6c6c7",
                "on-background": "#e2e2e2", "on-primary": "#303030",
                "surface-container-highest": "#333535"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "section-gap": "160px", "unit": "8px", "margin-edge": "64px", "gutter": "24px" },
              fontFamily: {
                "display-xl": ["Newsreader"], "display-lg": ["Newsreader"], "headline-md": ["Newsreader"],
                "body-md": ["Inter"], "body-lg": ["Inter"], "label-caps": ["Inter"]
              },
              fontSize: {
                "display-xl": ["120px", { lineHeight: "110px", letterSpacing: "-0.03em", fontWeight: "400" }],
                "display-lg": ["80px", { lineHeight: "88px", letterSpacing: "-0.02em", fontWeight: "400" }],
                "headline-md": ["48px", { lineHeight: "56px", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "600" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #121414; color: #e2e2e2; }
        @keyframes archive-fade {
            0%, 4% { opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
            8%, 22% { opacity: 1; filter: blur(0) saturate(1); transform: scale(1); }
            26%, 100% { opacity: 0; filter: blur(18px) saturate(0.8); transform: scale(1.04); }
        }
        .archive-cycle-img {
            animation: archive-fade 16s linear infinite;
            opacity: 0;
            filter: blur(18px) saturate(0.8);
            transform: scale(1.04);
            will-change: opacity, filter, transform;
        }
        @keyframes archive-indicator {
            0%, 4% { opacity: 0.25; transform: scaleY(0.7); }
            8%, 22% { opacity: 1; transform: scaleY(1); }
            26%, 100% { opacity: 0.25; transform: scaleY(0.7); }
        }
        .archive-indicator-tile {
            animation: archive-indicator 16s linear infinite;
            transform-origin: bottom center;
        }
        @keyframes archive-scrub {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
        }
        .archive-scrub-bar {
            animation: archive-scrub 16s linear infinite;
            transform-origin: left center;
        }
        @media (prefers-reduced-motion: reduce) {
            .archive-cycle-img,
            .archive-indicator-tile,
            .archive-scrub-bar { animation: none; }
            .archive-cycle-img:first-of-type {
                opacity: 1; filter: none; transform: none;
            }
        }
      ` }} />

      <div className="bg-background text-on-background antialiased selection:bg-tertiary selection:text-on-tertiary dark">
        <header className="fixed top-0 w-full z-50 flex justify-between items-center gap-3 px-4 py-5 bg-zinc-950/90 backdrop-blur-sm border-b border-white/10 text-zinc-100 font-serif italic tracking-tighter sm:px-8 sm:py-6 md:px-16 md:py-8">
          <a className="text-sm font-serif tracking-[0.2em] uppercase text-zinc-100 sm:text-lg md:text-2xl" href="/">NOIR ATELIER</a>
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map(l => (
              <a key={l.label} className={l.active ? "text-white border-b border-white pb-1 transition-all duration-500 opacity-70" : "text-zinc-500 hover:text-white transition-all duration-500"} href="#">{l.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            {[{ icon: "search", label: "search" }, { icon: "shopping_bag", label: "shopping_bag" }].map(b => (
              <button key={b.icon} type="button" aria-label={b.label} className="hover:text-white transition-all duration-500">
                <span className="material-symbols-outlined">{b.icon}</span>
              </button>
            ))}
          </div>
        </header>

        <main>
          <section className="relative min-h-[100dvh] w-full overflow-hidden bg-primary-container">
            <img alt="Hero Model" className="absolute inset-0 w-full h-full object-cover object-center" src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=2400&q=85&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/85 pointer-events-none"></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 70% at 18% 90%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)" }}></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 95% 10%, rgba(255,179,172,0.10) 0%, transparent 60%)" }}></div>

            <div className="absolute top-28 sm:top-32 md:top-40 left-4 sm:left-16 md:left-24 z-10 flex items-center gap-3 flex-wrap">
              <span className="font-label-caps text-label-caps text-white uppercase tracking-[0.3em] border border-white/40 backdrop-blur-sm bg-black/30 px-3 py-1.5">— Series 14 · MMXXIV</span>
              <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] hidden sm:inline">A / W · Lookbook</span>
            </div>

            <div className="absolute bottom-6 left-4 sm:bottom-16 sm:left-16 md:bottom-24 md:left-24 z-10 w-full max-w-4xl pr-4 sm:pr-8">
              <h1 className="font-display-xl text-[52px] leading-[0.95] text-white italic mb-3 sm:text-[80px] sm:mb-4 md:text-display-xl drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]">
                Nocturne<br />Collection
              </h1>
              <p className="font-body-lg text-white uppercase tracking-[0.25em] text-[12px] sm:text-[13px] max-w-md mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                A study in tension and atmosphere.
              </p>
              <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest max-w-sm">
                Autumn / Winter 2024 · Photographed at the atelier
              </p>
            </div>

            <div className="hidden md:flex absolute bottom-24 right-24 z-10 flex-col items-end gap-2 text-right">
              <span className="font-label-caps text-label-caps text-white/90 uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">CHAPTER 01</span>
              <span className="font-headline-md text-white italic text-[28px] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">— scroll, slowly</span>
              <div className="w-12 h-px bg-white/60 mt-2"></div>
            </div>
          </section>

          {/* New Section: Atelier Manifesto */}
          <section className="px-4 pt-24 pb-12 max-w-[1400px] mx-auto sm:px-8 sm:pt-32 sm:pb-16 md:px-margin-edge md:pt-[140px] md:pb-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-4 mb-10 md:mb-0 md:sticky md:top-32 md:self-start">
                <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] block mb-4">— II · Atelier Manifesto</span>
                <h2 className="font-headline-md text-[36px] leading-tight text-on-surface italic sm:text-[44px] md:text-headline-md">Three tenets, kept in private.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-6">A small studio's working principles, written once and rarely revisited.</p>
              </div>
              <ol className="md:col-span-8 flex flex-col divide-y divide-outline-variant/60 border-t border-b border-outline-variant/60">
                {[
                  { num: "I",   title: "Restraint over ornament.",    body: "Every seam earns its place. Garments are drafted to read at six paces and be felt at one — not the other way around.", tag: "TENET_01 · KEPT" },
                  { num: "II",  title: "Materials before mood.",       body: "Wool, silk, leather. Sourced quietly from three mills the founder has worked with for fourteen years. Mood follows the cloth, not the other way around.", tag: "TENET_02 · KEPT" },
                  { num: "III", title: "Slowness is a method.",        body: "Two collections a year. No drops, no capsules, no surprise releases. The work moves at the speed of the room it was made in.", tag: "TENET_03 · KEPT" },
                ].map(t => (
                  <li key={t.num} className="grid grid-cols-12 gap-4 py-10 md:py-14">
                    <span className="col-span-2 md:col-span-1 font-display-lg text-[32px] md:text-[44px] leading-none italic text-tertiary tabular-nums">{t.num}</span>
                    <div className="col-span-10 md:col-span-11 flex flex-col gap-3">
                      <h3 className="font-headline-md text-on-surface italic text-[22px] sm:text-[28px] md:text-[32px] leading-tight">{t.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-prose">{t.body}</p>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-1">[ {t.tag} ]</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Asymmetric Editorial Grid — right column extended with editorial text cards */}
          <section className="px-4 py-20 max-w-[1600px] mx-auto sm:px-8 sm:py-28 md:px-margin-edge md:py-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
              <div className="md:col-span-7 aspect-[3/4] md:aspect-auto md:h-[1228px] relative group overflow-hidden bg-surface-container-low">
                <img alt="Editorial Portrait" className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALdD8oMTGKXuK386hhNGZ5_hFJF3A3VR_HqyME-PlzE1uazMx70NlF4fF6ZYA-JoDVSXz48YIzkdn9n0efk3t0TkvMcVLIDip0chMiizeT2VHZQJL0TrSY_zhwkORL0ufU3wJZFecWfyGozGGoNP_H1iYdimovJpHz2oeF0hcvhLpdKq2A2Iewlhaa54oO0SKZ6w2xNd1TMf3cFYhURHDeqPpaYScDsh6HjS8sGogEuotJkJmPhAXBZl9TjxZUpLWOeVTIiIxj-pY" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-4">
                  <p className="font-label-caps text-label-caps text-white uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">01 — The Void</p>
                  <span className="font-label-caps text-label-caps text-white/80 uppercase tracking-widest hidden sm:inline drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">PLATE · I</span>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col gap-gutter mt-24 md:mt-48">
                {/* 1. Texture & Form square */}
                <div className="aspect-square relative group overflow-hidden bg-surface-container-low">
                  <img alt="Detail Shot" className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjuuFXhpcD9T6UeuD9RmvGgG-ordnwyTiYEh3gC-vfGc2M9n6uHCZkS6cqMqZnNKnjFIhahJ6KMiF3M90KlPPY3s8Fz55gGtSnXuUJwGnlJn970CrRMPogxudN8x54l4nzpOTSHK3WPDpyYeVK45IePhcMbnkzr0VjwtdRgXhpombu1G8XzS8agebRECxHgSm25yrukA5Q6YV1TE4NZ3ACm67R2X3Y3XUR1uZvxywZo21P6oPfwAsgutngQ5pIFSR7v1WxuDuGSXs" />
                  <div className="absolute inset-0 bg-primary-container/20 group-hover:bg-transparent transition-colors duration-700"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
                    <p className="font-body-md text-body-md text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">02 — Texture & Form</p>
                    <span className="font-label-caps text-label-caps text-white/80 uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">PLATE · II</span>
                  </div>
                </div>

                {/* 2. Editorial pull-quote card */}
                <figure className="border-t border-b border-outline-variant/60 px-2 sm:px-6 py-10 md:py-12 bg-transparent">
                  <span className="material-symbols-outlined text-tertiary text-[36px] leading-none block mb-4" aria-hidden="true">format_quote</span>
                  <blockquote className="font-display-lg text-[24px] sm:text-[28px] md:text-[32px] leading-snug italic text-on-surface">
                    "The void in the cloth is not absence — <span className="text-tertiary">it's where the hand was last."</span>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
                    <cite className="not-italic">— studio diary, Oct 2024</cite>
                    <span className="w-8 h-px bg-tertiary/60"></span>
                  </figcaption>
                </figure>

                {/* 3. Structured Chaos square */}
                <div className="aspect-square relative group overflow-hidden bg-surface-container-low md:ml-12">
                  <img alt="Accessory Shot" className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1FqhvSL4Kfb_3fwqVAoFJlzjARdWyGja1mquVWi9rawR8PshiHfZHHHlA2vFMaLEfZ5gBkXU2pRPdKkNaUzdX4QiQGqv0qocIgTm6KW6z5b2zje-4qJhXIuCDD2EpVd3JIw15V_ZF4awKMc4U8gw9LGQKMhkCGEXtXVElGB2O3tnboH2D8jxVsJI0AR0Yl95qa_uXBMjt1mI4JvKVMkTilxOGU3EFXQLTA_mS_qx00WyZAnkeVUn3p2V_0Hof5-8VPTOHHuyKFek" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
                    <p className="font-body-md text-body-md text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">03 — Structured Chaos</p>
                    <span className="font-label-caps text-label-caps text-white/80 uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">PLATE · III</span>
                  </div>
                </div>

                {/* 4. Specifications meta card */}
                <div className="border border-outline-variant/60 p-6 md:p-7 md:ml-12 flex flex-col gap-4 bg-surface-container-low/40">
                  <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                    <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em]">— Specifications</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">PLATE I — III</span>
                  </div>
                  <dl className="grid grid-cols-[112px_1fr] gap-x-4 gap-y-3 text-[14px]">
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Materials</dt>
                    <dd className="font-body-md text-on-surface italic">Wool / silk / lambskin · undyed</dd>
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Atelier</dt>
                    <dd className="font-body-md text-on-surface italic">No. 14, rue de la Verrerie · Paris IIIᵉ</dd>
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Edition</dt>
                    <dd className="font-body-md text-on-surface italic tabular-nums">Series 14 · 47 pieces</dd>
                    <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Released</dt>
                    <dd className="font-body-md text-on-surface italic">Aug · MMXXIV</dd>
                  </dl>
                  <a className="inline-flex items-center gap-2 self-start font-label-caps text-label-caps uppercase tracking-[0.25em] text-on-surface border-b border-on-surface/40 pb-1 hover:border-tertiary hover:text-tertiary transition-colors duration-300 mt-2" href="#">Read the full sheet <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
                </div>
              </div>
            </div>
          </section>

          <section className="relative w-full aspect-[4/5] md:aspect-auto md:h-[819px] bg-surface-container-highest overflow-hidden mb-20 sm:mb-28 md:mb-section-gap">
            <img alt="Landscape Editorial" className="w-full h-full object-cover object-center opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpJVQ1oZpNoARV4r4ULubc6XK51vp0lLceRfLoYFuSoa5JIkiNaZuQopsBUVY7uOjPJ6sCLeI0RR_lYf1Kead1o84r8ugP8_XWaGhVY3_aXDPQAxZsGUHEuPVYI5IrWnJDI7TOluzO7NCu8G7yssn6OxixslVLZPmbqdZj3onHVTPRAeA0dHo39b3RdeKOn3siBNrkSZoKvBMfsohw7DKPoqOfntfX3okypJOT-47OXxyZjQMEqd-uOVcNVt9TAEBJcIDy7rFWmx0" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
              <h2 className="font-display-lg text-[34px] leading-tight text-on-surface italic text-center mix-blend-overlay opacity-80 sm:text-[56px] md:text-display-lg">
                Silence is structural.
              </h2>
            </div>
          </section>

          {/* New Section: Show Notes — FW24 */}
          <section className="px-4 pb-20 max-w-[1600px] mx-auto sm:px-8 sm:pb-28 md:px-margin-edge md:pb-section-gap">
            <div className="mb-12 md:mb-16">
              <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] block mb-3">— IV · Show Notes</span>
              <h2 className="font-headline-md text-[30px] leading-tight text-on-surface italic sm:text-[40px] md:text-headline-md max-w-3xl">Forty-seven minutes, no music.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-10 items-stretch">
              <figure className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:min-h-[480px] overflow-hidden bg-surface-container-low">
                <img alt="Show portrait — FW24" className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-110" src="https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1800&q=85&auto=format&fit=crop" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none"></div>
                <div className="absolute top-6 left-6 flex items-center gap-3 backdrop-blur-sm bg-black/40 border border-white/30 px-3 py-1.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">videocam</span>
                  <span className="font-label-caps text-label-caps text-white uppercase tracking-[0.3em]">SHOW · FW24</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">— from the runway</span>
                    <span className="font-headline-md text-white italic text-[22px] sm:text-[26px] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">Look 23 · Charcoal calf coat, hand-finished</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-white/80 uppercase tracking-widest backdrop-blur-sm bg-black/30 border border-white/20 px-2 py-1">PLATE · 23 / 47</span>
                </div>
              </figure>

              <aside className="md:col-span-5 flex flex-col gap-6">
                <div className="grid grid-cols-3 border border-outline-variant/60 divide-x divide-outline-variant/60">
                  {[
                    { label: "Looks", value: "47" },
                    { label: "Models", value: "14" },
                    { label: "Run-time", value: "47′" },
                  ].map(s => (
                    <div key={s.label} className="p-4 flex flex-col gap-1">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{s.label}</span>
                      <span className="font-display-lg text-on-surface italic text-[28px] leading-none tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-b border-outline-variant/60 divide-y divide-outline-variant/60">
                  {[
                    { dt: "Show direction", dd: "Mathilde Roux · in-house" },
                    { dt: "Casting",        dd: "Studio Lemaire · 14 models" },
                    { dt: "Sound",          dd: "— silence, by request of the maison" },
                    { dt: "Venue",          dd: "Hôtel Salé · Paris IIIᵉ" },
                    { dt: "Photographs",    dd: "Renaud Vidal · for House" },
                  ].map(c => (
                    <div key={c.dt} className="grid grid-cols-[120px_1fr] gap-4 py-4 items-baseline">
                      <dt className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{c.dt}</dt>
                      <dd className="font-body-md text-on-surface italic">{c.dd}</dd>
                    </div>
                  ))}
                </div>
                <a className="inline-flex items-center gap-2 self-start font-label-caps text-label-caps uppercase tracking-[0.25em] text-on-surface border-b border-on-surface/40 pb-1 hover:border-tertiary hover:text-tertiary transition-colors duration-300" href="#">Read the full show notes <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a>
              </aside>
            </div>
          </section>

          {/* Archive Section — auto-cycling vertical image with blur cross-fade + sync'd thumbnail strip */}
          <section className="px-4 py-20 bg-background max-w-[1800px] mx-auto border-t border-outline/10 sm:px-8 sm:py-28 md:px-margin-edge md:py-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-10">
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start mb-12 md:mb-0">
                <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] block mb-4">— V · Archive</span>
                <h2 className="font-headline-md text-[30px] leading-tight text-on-surface italic mb-6 sm:text-[40px] md:text-headline-md">Archive</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-8">
                  A curated selection of silhouettes. Each piece is a study in precise tailoring and unapologetic form. Watch the frame — it changes every four seconds.
                </p>
                <div className="flex items-center gap-4 mb-8 max-w-sm">
                  <div className="flex-1 h-px bg-outline-variant/40 relative overflow-hidden">
                    <div className="absolute inset-0 origin-left bg-tertiary archive-scrub-bar"></div>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">04 looks · 16s loop</span>
                </div>
                <a className="inline-block border border-outline px-8 py-3 font-label-caps text-label-caps text-on-surface uppercase hover:bg-on-surface hover:text-background transition-colors duration-300" href="#">View Entire Collection</a>
              </div>

              <div className="md:col-span-7">
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-surface-container-low border border-outline-variant/60">
                  {[
                    { id: "1490481651871-ab68de25d43d", num: "01", title: "Structured wool overcoat", delay: "0s" },
                    { id: "1492707892479-7bc8d5a4ee93", num: "02", title: "Asymmetric silk drape",     delay: "4s" },
                    { id: "1539109136881-3be0616acf4b", num: "03", title: "High-collar tunic",         delay: "8s" },
                    { id: "1483985988355-763728e1935b", num: "04", title: "Geometric harness",        delay: "12s" },
                  ].map(l => (
                    <img key={l.num} alt={`Look ${l.num}`} className="archive-cycle-img absolute inset-0 w-full h-full object-cover object-center" style={{ animationDelay: l.delay }} src={`https://images.unsplash.com/photo-${l.id}?w=1400&q=85&auto=format&fit=crop`} loading="lazy" />
                  ))}
                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)" }}></div>
                  <div className="absolute top-6 right-6 backdrop-blur-sm bg-black/40 border border-white/30 px-3 py-1.5">
                    <span className="font-label-caps text-label-caps text-white uppercase tracking-[0.3em]">— ARCHIVE · LIVE</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3 pointer-events-none">
                    <div className="relative flex-1 min-h-[64px]">
                      <div className="absolute inset-0">
                        {[
                          { num: "01", title: "Structured wool overcoat", delay: "0s" },
                          { num: "02", title: "Asymmetric silk drape",     delay: "4s" },
                          { num: "03", title: "High-collar tunic",         delay: "8s" },
                          { num: "04", title: "Geometric harness",        delay: "12s" },
                        ].map(l => (
                          <span key={l.num} className="archive-cycle-img absolute inset-0 flex flex-col gap-1" style={{ animationDelay: l.delay }}>
                            <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">— Look {l.num}</span>
                            <span className="font-headline-md text-white italic text-[22px] sm:text-[26px] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">{l.title}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps text-white/80 uppercase tracking-widest backdrop-blur-sm bg-black/30 border border-white/20 px-2 py-1 self-end shrink-0">PLATE · IV</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-6">
                  {[
                    { id: "1490481651871-ab68de25d43d", num: "01", delay: "0s" },
                    { id: "1492707892479-7bc8d5a4ee93", num: "02", delay: "4s" },
                    { id: "1539109136881-3be0616acf4b", num: "03", delay: "8s" },
                    { id: "1483985988355-763728e1935b", num: "04", delay: "12s" },
                  ].map(t => (
                    <button key={t.num} type="button" className="group flex flex-col gap-2 text-left">
                      <div className="aspect-[3/4] overflow-hidden bg-surface-container-low border border-outline-variant/40 relative">
                        <img alt={`Look ${t.num} thumb`} className="archive-indicator-tile w-full h-full object-cover object-center" style={{ animationDelay: t.delay }} src={`https://images.unsplash.com/photo-${t.id}?w=400&q=80&auto=format&fit=crop`} loading="lazy" />
                      </div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Look {t.num}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 px-4 bg-surface-container-lowest flex items-center justify-center text-center sm:py-32 sm:px-8 md:py-[200px] md:px-margin-edge">
            <div className="max-w-5xl">
              <blockquote className="font-display-lg text-[32px] text-on-surface italic leading-tight sm:text-[56px] md:text-display-lg">
                "We do not dress to be seen.<br />
                <span className="text-tertiary">We dress to be felt.</span>"
              </blockquote>
            </div>
          </section>
        </main>

        <footer className="w-full py-12 px-4 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-950 text-zinc-100 font-serif uppercase tracking-[0.15em] text-[10px] border-t border-white/10 sm:py-16 sm:px-8 sm:gap-8 md:py-20 md:px-16">
          <div className="text-xl font-serif tracking-widest uppercase">NOIR ATELIER</div>
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map(l => (
              <a key={l} className="text-zinc-600 hover:text-white transition-colors duration-300" href="#">{l}</a>
            ))}
          </nav>
          <div className="text-zinc-500">© 2024 NOIR ATELIER. ALL RIGHTS RESERVED.</div>
        </footer>
      </div>
    </>
  );
}
