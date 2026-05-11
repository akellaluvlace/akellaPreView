export default function T13EditorialFashionStyle() {
  const navLinks = [
    { label: "Collections", active: true },
    { label: "Editorial", active: false },
    { label: "Archive", active: false },
    { label: "Studio", active: false },
  ];
  const footerLinks = ["Privacy Policy", "Terms of Service", "Shipping & Returns", "Contact"];
  const pressBrands = [
    { slug: "theguardian", alt: "The Guardian" },
    { slug: "telegraph",   alt: "The Telegraph" },
    { slug: "medium",      alt: "Medium" },
    { slug: "substack",    alt: "Substack" },
    { slug: "behance",     alt: "Behance" },
    { slug: "vimeo",       alt: "Vimeo" },
    { slug: "issuu",       alt: "Issuu" },
  ];
  const lookbookHeader = [
    { k: "NAME",      v: "SS-2026 · No. 04" },
    { k: "PLATES",    v: "22 / 22 negatives" },
    { k: "STUDIO",    v: "9 mo. · in-house" },
    { k: "MATERIALS", v: "wool / silk / lambskin" },
    { k: "ATELIER",   v: "14, rue de la Verrerie" },
    { k: "EDITION",   v: "Series 14 · 47 pieces" },
    { k: "SIGNED",    v: "@MATHILDE · @RENAUD" },
  ];
  const houseOffer = [
    {
      title: "Atelier visit",
      body: "An hour with the founder at No. 14, rue de la Verrerie. Cloth on the table, not on a hanger. By appointment, weekdays only.",
      chip: "— Paris · in person",
      icon: <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-7h6v7"/></svg>,
    },
    {
      title: "Made-to-order",
      body: "Three fittings, twelve weeks, one piece. Drafted from the season's pattern but cut for the body — not the body cut for the pattern.",
      chip: "— 12 weeks · 3 fittings",
      icon: <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 6l3-3h12l3 3"/><path d="M3 6v15h18V6"/><path d="M3 6h18"/><path d="M9 11a3 3 0 0 0 6 0"/></svg>,
    },
    {
      title: "Trunk Show",
      body: "Twice a year, four cities. London, Milan, Tokyo, Geneva. Forty pieces in a private suite for two evenings, by invitation only.",
      chip: "— 4 cities · 2x / yr",
      icon: <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 7l10-4 10 4v3a4 4 0 0 1-4 4h-1l-1 7H8l-1-7H6a4 4 0 0 1-4-4V7z"/></svg>,
    },
    {
      title: "Private Edit",
      body: "A four-piece capsule the founder edits to the wearer's existing wardrobe. A coat, a trouser, a shirt, an evening piece. Held back from the season.",
      chip: "— 4 pieces · held back",
      icon: <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 4h18v3H3z"/><path d="M5 7v13h14V7"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>,
    },
  ];
  const offerMeta = [
    { icon: "place", label: "Atelier",   value: "Paris IIIᵉ" },
    { icon: "event", label: "Cadence",   value: "Two seasons / yr" },
    { icon: "mail",  label: "Allotment", value: "96 invitations only" },
  ];
  const platesStrip = [
    { id: "1685787773514-90e8e14af797", alt: "Light study, atelier corridor", grayscale: true },
    { id: "1622912058707-1b33af81db4f", alt: "Studio gallery interior",        grayscale: true },
    { id: "1573497019940-1c28c88b4f3e", alt: "Editorial portrait, low key",     grayscale: true },
    { id: "1762215781547-2ac20ed42cd1", alt: "Cornice detail, salon",           grayscale: true },
    { id: "1618488373960-404fe668e524", alt: "Long perspective corridor",       grayscale: true },
    { id: "1527844817887-9b937993518b", alt: "Apothecary still-life, brass objects", grayscale: false },
    { id: "1762341124796-530c0085f7d8", alt: "Close portrait, intimate framing", grayscale: true },
    { id: "1766604106308-58b6d0d676bf", alt: "Building aperture, raking light",  grayscale: true },
  ];
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
            <img alt="Hero Model" className="absolute inset-0 w-full h-full object-cover object-center" src="https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=2400&q=85&auto=format&fit=crop" />
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

          {/* New Section: Featured In (R.11 luxury press wall — flex-wrap simpleicons strip with date subtitle) */}
          <section className="px-4 pt-16 pb-12 max-w-[1400px] mx-auto sm:px-8 sm:pt-20 sm:pb-14 md:px-margin-edge md:pt-24 md:pb-16 border-b border-outline-variant/30">
            <div className="flex flex-col items-center text-center gap-3 mb-10">
              <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em]">— I · Featured In</span>
              <p className="font-headline-md text-on-surface italic text-[24px] sm:text-[28px] md:text-[32px] leading-snug max-w-2xl">Quietly noted by editors who do not chase noise.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16 md:gap-x-20 max-w-4xl mx-auto opacity-90">
              {pressBrands.map(b => (
                <img key={b.slug} alt={b.alt} className="h-5 sm:h-6 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300" src={`https://cdn.simpleicons.org/${b.slug}/c8c6c5`} loading="lazy" />
              ))}
            </div>
            <p className="text-center font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-10">+ 14 mentions in trade press · MMXXIII — MMXXIV · No paid placement</p>
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch">
              {/* Left Column (Tall Portrait + Twin-Plate Card + Solo-Study Card — flex-col, natural height matches right column via items-stretch on parent grid) */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <div className="aspect-[3/4] md:aspect-auto md:flex-1 md:min-h-0 relative group overflow-hidden bg-surface-container-low">
                  <img alt="Editorial Portrait" className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALdD8oMTGKXuK386hhNGZ5_hFJF3A3VR_HqyME-PlzE1uazMx70NlF4fF6ZYA-JoDVSXz48YIzkdn9n0efk3t0TkvMcVLIDip0chMiizeT2VHZQJL0TrSY_zhwkORL0ufU3wJZFecWfyGozGGoNP_H1iYdimovJpHz2oeF0hcvhLpdKq2A2Iewlhaa54oO0SKZ6w2xNd1TMf3cFYhURHDeqPpaYScDsh6HjS8sGogEuotJkJmPhAXBZl9TjxZUpLWOeVTIiIxj-pY" />
                  <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-4">
                    <p className="font-label-caps text-label-caps text-white uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">01 — The Void</p>
                    <span className="font-label-caps text-label-caps text-white/80 uppercase tracking-widest hidden sm:inline drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">PLATE · I</span>
                  </div>
                </div>
                {/* Twin-plate study card — pinned to the bottom of the left column, bottoms-align with the right column's LOOKBOOK_HEADER mono plate */}
                <div className="border border-white/10 rounded-sm overflow-hidden bg-surface-container/40">
                  <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 border-b border-white/10">
                    <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em]">— PLATE · Ib & Ic</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">TWIN STUDY</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2">
                    <figure className="aspect-square overflow-hidden bg-surface-container-low">
                      <img alt="Atelier paper studies, hand-marked patterns" className="w-full h-full object-cover object-center grayscale contrast-110 hover:scale-105 transition-transform duration-[2000ms] ease-out" src="https://images.unsplash.com/photo-1461099059505-2dabdfc447b8?w=600&q=85&auto=format&fit=crop" loading="lazy" />
                    </figure>
                    <figure className="aspect-square overflow-hidden bg-surface-container-low">
                      <img alt="Studio workbench, ink and graphite drafts" className="w-full h-full object-cover object-center grayscale contrast-110 hover:scale-105 transition-transform duration-[2000ms] ease-out" src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=85&auto=format&fit=crop" loading="lazy" />
                    </figure>
                  </div>
                  <p className="px-4 pt-1 pb-3 font-label-caps text-label-caps text-on-surface-variant/70 uppercase tracking-widest">PLATES · TWIN STUDY · MAY 2026</p>
                </div>
                {/* Solo-Study card (PLATE · Id) — 3rd block in the left column, fills remaining gap below the twin-plate card. */}
                <figure className="border border-white/10 rounded-sm overflow-hidden bg-surface-container/40 flex flex-col">
                  <div className="px-3 py-2 flex items-center justify-between border-b border-white/10">
                    <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.4em]">PLATE · Id</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">SOLO STUDY</span>
                  </div>
                  <div className="aspect-[4/3] relative">
                    <img alt="Atelier proof, single matte print on Hahnemühle paper" className="absolute inset-0 w-full h-full object-cover grayscale contrast-110" src="https://images.unsplash.com/photo-1591926870242-9b01d19110d0?w=900&q=85&auto=format&fit=crop" loading="lazy" />
                  </div>
                  <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest italic">SS-2026 · No. 04 · matte print on Hahnemühle</span>
                    <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest">⌬</span>
                  </div>
                </figure>
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

                {/* 4. LOOKBOOK_HEADER metadata plate (§P.12 — monospace bordered card with title rule + 2-col label/value list + hr + verified-by line) */}
                <div className="border border-on-surface/60 bg-surface-container-low/60 p-5 md:p-6 md:ml-12 font-mono text-[11px]">
                  <p className="font-bold uppercase tracking-[0.22em] underline underline-offset-4 mb-4 text-on-surface">LOOKBOOK_HEADER</p>
                  <ul className="flex flex-col gap-2">
                    {lookbookHeader.map(r => (
                      <li key={r.k} className="flex justify-between gap-3">
                        <span className="text-on-surface-variant">{r.k}:</span>
                        <span className={r.k === "NAME" ? "font-bold text-on-surface" : "text-on-surface"}>{r.v}</span>
                      </li>
                    ))}
                  </ul>
                  <hr className="border-outline-variant my-4" />
                  <p className="text-on-surface-variant uppercase tracking-[0.18em] text-[9px]">VERIFIED BY THE HOUSE.<br />Hash matches negative · MMXXIV.</p>
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
                <img alt="Show portrait — FW24" className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-110" src="https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=1800&q=85&auto=format&fit=crop" loading="lazy" />
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

          {/* New Section: Atelier Services (R.12 premium 4-card — Atelier visit / Made-to-order / Trunk Show / Private Edit. Inline SVG icons, flex-col cards, mt-auto chip) */}
          <section className="px-4 py-20 max-w-[1600px] mx-auto sm:px-8 sm:py-28 md:px-margin-edge md:py-section-gap border-t border-outline-variant/30">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
              <div className="max-w-2xl">
                <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] block mb-3">— V · The House Offer</span>
                <h2 className="font-headline-md text-[30px] leading-tight text-on-surface italic sm:text-[40px] md:text-headline-md">Four ways to enter the room.</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md md:text-right">Direct rapport with the founder, on a calendar that respects the cloth. No public list, no waiting room.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {houseOffer.map(c => (
                <article key={c.title} className="border border-outline-variant/60 bg-surface-container-low/40 p-6 md:p-7 hover:bg-surface-container-low/70 transition-colors duration-300 flex flex-col">
                  <div className="mb-5 inline-flex w-12 h-12 items-center justify-center border border-tertiary/40 text-tertiary">
                    {c.icon}
                  </div>
                  <h3 className="font-headline-md text-on-surface italic text-[22px] sm:text-[24px] leading-tight mb-3">{c.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-1">{c.body}</p>
                  <span className="mt-5 pt-4 border-t border-outline-variant/40 font-label-caps text-label-caps text-tertiary uppercase tracking-[0.25em]">{c.chip}</span>
                </article>
              ))}
            </div>
            {/* Premium spec-plate: 3 squared-up tiles (Atelier / Cadence / Allotment), centered in max-w-3xl, with a Discretion footer line below. */}
            <div className="mt-12 pt-8 border-t border-outline-variant/30">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {offerMeta.map(m => (
                    <div key={m.label} className="aspect-square bg-surface-container-low/40 backdrop-blur-sm border border-tertiary/30 rounded-sm flex flex-col items-center justify-center gap-2 p-5 text-center hover:border-tertiary/60 transition-colors duration-300">
                      <span className="material-symbols-outlined text-tertiary text-3xl mb-1" aria-hidden="true">{m.icon}</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.3em] text-[10px]">{m.label}</span>
                      <span className="font-headline-md text-on-surface italic text-lg leading-tight">{m.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center font-metadata text-metadata text-on-surface-variant italic mt-4 md:mt-6">
                  <span className="material-symbols-outlined align-middle text-tertiary text-base mr-2" aria-hidden="true">lock</span>
                  Discretion · No public list
                </p>
              </div>
            </div>
          </section>

          {/* Archive Section — auto-cycling vertical image with blur cross-fade + sync'd thumbnail strip */}
          <section className="px-4 py-20 bg-background max-w-[1800px] mx-auto border-t border-outline/10 sm:px-8 sm:py-28 md:px-margin-edge md:py-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-10">
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start mb-12 md:mb-0">
                <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] block mb-4">— VI · Archive</span>
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
                    { id: "1573496359142-b8d87734a5a2", num: "01", title: "Structured wool overcoat", delay: "0s" },
                    { id: "1776275758873-31603dd06112", num: "02", title: "Asymmetric silk drape",     delay: "4s" },
                    { id: "1776275758873-31603dd06112", num: "03", title: "High-collar tunic",         delay: "8s" },
                    { id: "1701096374092-bb70915fdc5c", num: "04", title: "Geometric harness",        delay: "12s" },
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
                    { id: "1573496359142-b8d87734a5a2", num: "01", delay: "0s" },
                    { id: "1776275758873-31603dd06112", num: "02", delay: "4s" },
                    { id: "1776275758873-31603dd06112", num: "03", delay: "8s" },
                    { id: "1701096374092-bb70915fdc5c", num: "04", delay: "12s" },
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

          {/* New Section: The Inner Circle (R.18 premium upgrade — image bg + gradient + scanline overlay + decorative tertiary rules + by-invitation chip + dark form) */}
          <section className="relative w-full bg-background py-28 md:py-36 border-t border-outline-variant/40 overflow-hidden">
            <div className="absolute inset-0">
              <img alt="Atelier interior" className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale" src="https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=2000&q=85&auto=format&fit=crop" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background"></div>
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)" }}></div>
            </div>
            <div className="relative max-w-2xl mx-auto px-6 text-center">
              <div aria-hidden="true" className="w-16 h-px bg-tertiary/60 mx-auto mb-10"></div>
              <span className="inline-block font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] border border-tertiary/50 px-4 py-2 mb-8">— By Invitation</span>
              <h3 className="font-display-lg text-[32px] sm:text-[44px] md:text-[56px] leading-tight italic text-on-surface mb-5">The Inner Circle</h3>
              <p className="font-headline-md text-on-surface-variant italic text-[18px] sm:text-[20px] md:text-[22px] leading-relaxed mb-6 max-w-xl mx-auto">Access to limited editions, trunk-show invitations and a quarterly letter from the studio. Held back from the public season.</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant/70 uppercase tracking-[0.25em] mb-10">96 invitations issued annually · Paris · Milan · Tokyo · Geneva</p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="your.address@maison.com" aria-label="Email address" className="flex-1 bg-transparent border-b border-on-surface/40 focus:border-tertiary outline-none px-2 py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 italic transition-colors duration-300" />
                <button type="submit" className="font-label-caps text-label-caps uppercase tracking-[0.25em] text-on-surface border border-tertiary/60 px-6 py-3 hover:bg-tertiary hover:text-on-tertiary transition-colors duration-300">Request Invitation</button>
              </form>
              <div aria-hidden="true" className="w-16 h-px bg-tertiary/60 mx-auto mt-12 mb-6"></div>
              <p className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase tracking-widest">MMXXIV — present · No public list</p>
            </div>
          </section>

          {/* New Section: Plates · Inside the Atelier (R.17 image strip — 8 squares, full-width, hover scale only, no marquee) */}
          <section className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-14 md:py-16">
            <div className="max-w-[1600px] mx-auto px-4 md:px-margin-edge mb-10 text-center">
              <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-[0.3em] block mb-3">— Inside the Atelier · 04</span>
              <h2 className="font-headline-md text-on-surface italic text-[26px] sm:text-[32px] md:text-[40px] leading-tight max-w-3xl mx-auto">Eight rooms, one Friday afternoon.</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 px-3 md:px-6">
              {platesStrip.map(p => (
                <figure key={p.id} className="aspect-square overflow-hidden bg-surface-container-low border border-outline-variant/40">
                  <img alt={p.alt} className={p.grayscale ? "w-full h-full object-cover hover:scale-105 transition-transform duration-500 grayscale contrast-110" : "w-full h-full object-cover hover:scale-105 transition-transform duration-500"} src={`https://images.unsplash.com/photo-${p.id}?w=600&q=80&auto=format&fit=crop`} loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
            <div className="max-w-[1600px] mx-auto px-4 md:px-margin-edge mt-8 flex items-center justify-center gap-4">
              <span className="w-8 h-px bg-tertiary/40"></span>
              <span className="font-label-caps text-label-caps text-on-surface-variant/70 uppercase tracking-widest">Photographs by House · Floor No. 02 · MMXXIV</span>
              <span className="w-8 h-px bg-tertiary/40"></span>
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
