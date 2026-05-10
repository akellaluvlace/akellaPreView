export default function T92ArtNoveau() {
  const navLinks = [
    { label: "Collection", active: true },
    { label: "The Perfumer" },
    { label: "The Process" },
    { label: "Boutique" },
  ];

  const fragrances = [
    {
      tag: "Floral", name: "L'Iris Noir", price: "€185",
      desc: "Midnight iris, vetiver, and crushed violet leaves.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFkuXWAoEf8scCg6o39asJtt5H8PvjI0l3-BYew2Nl2D7lWbxXYXZ0aEuMorfb-l3zIkEkUGx6TnrNqe7gPwVuT5MA8jopK3A-1nlRkL-z8HAh1UTGynsrmBCvNz3ZKFw5PQ_iJP5FJcxF3pP0fI2iUhulVXdYadmSKnLpdHXEZLhNDPQZ4NQSOhLjFNwvK6tefGzYmG_g9Varo1dJNwjBVFrByrMMRhRtGXxCM07zBhjaOqe1jP0nVY55_U4Otu_AjTZMFifKTw",
    },
    {
      tag: "Woody", name: "Bois de Sylvan", price: "€195",
      desc: "Ancient oakmoss, cedar, and wild ferns.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS6pVbLl_68cF6jR9pLR5VEXVVFaW5eujYwYGjINOYhmJiNd3HtcC9CXdkDVM0AEivBONw_DNB70WdyvlqR4ckFoEfXBkCaNqF-5YTIhpYV-RXXXaMIgA901wKyhVrzyYWuxsPLVmA1cNgeIuU5znPgf_mC909_aWMiEMMoU-8La2wnqNeurMae6F0E_-05ewa78RaDf6ejVTShzXb595HLB8-SEzRN0ss6R9cWqQU-KZ7vNO9I15pdJcoTKut2AmQIshuzHP1Ww",
    },
    {
      tag: "Citrus Floral", name: "Jardin d'Aube", price: "€175",
      desc: "Neroli, morning jasmine, and green mandarin.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkoLmL4wQwxB_2kounPKoAHnghV24lrV8tG76pFHc3ApRasoEtX51TH9e4FQC56MhvDINKQVCWVXNjO-_OOlHFcKhMLXQuWUhuWylDEvKscFDxsxE_xEOoeLNXt8dEZ5dcNq5Y6IAz3MPKLmtCA5YP8nuekLi5mK1FfEU5uK-PS2BL4hc8pQCDls6ikSqWuy4JaHcLXqzt91UFwYrhUboxu3gSF0l_FVqjJA6o3GqpgY8bFO7TDY907Kh_cgnVv9hgmwC7Fg2hnw",
    },
  ];

  const footerLinks = ["Privacy Policy", "Press Inquiries", "Sustainability", "Terms of Service"];

  const processSteps = [
    {
      numeral: "I", title: "Harvest at Dawn", season: "Mai · Juin · Juillet",
      body: "Before the sun lifts the dew, our cutters take only what is fully open. Twelve fields, hand-shears, no engines in the rows.",
      img: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=900&q=85&auto=format&fit=crop",
      alt: "Hand-cut bouquet of cream roses, eucalyptus and seasonal blooms — harvest at dawn",
    },
    {
      numeral: "II", title: "Distill in Copper", season: "Atelier No. 02 · Cuivre",
      body: "Slow steam through hand-hammered copper. A six-hour cycle yields the absolute. Volatile. Honest. Never a synthetic top-up.",
      img: "https://images.unsplash.com/photo-1527844817887-9b937993518b?w=900&q=85&auto=format&fit=crop",
      alt: "Aged copper distillation apparatus with brass apothecary still-life",
    },
    {
      numeral: "III", title: "Compose by Hand", season: "Repos · 90 Jours",
      body: "Each formula rests in oak for ninety days before the cap is set. Twelve trials. One signature. One decanter at a time.",
      img: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=900&q=85&auto=format&fit=crop",
      alt: "Perfumer's bench with hand-bound notebook, mug and vials in soft daylight",
    },
  ];

  const originStats = [
    { num: "1895",  label: "Founded in Grasse",  sub: "Rue de la Fontaine, No. 14" },
    { num: "12",    label: "Hectares Cultivated", sub: "Owned · Tended · Slept upon" },
    { num: "3,000", label: "Blossoms per Bottle", sub: "Hand-cut at first light" },
    { num: "47",    label: "Distillations / Year", sub: "Copper alembic No. 02" },
  ];

  const footerHouseLinks   = ["Collection", "The Perfumer", "The Atelier", "Origins", "Boutique"];
  const footerServiceLinks = ["Press Inquiries", "Sustainability", "Sample Box", "Refill Programme", "Contact"];
  const footerLegalLinks   = ["Privacy", "Terms", "Cookies", "Mentions Légales"];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "tertiary": "#5d2e46", "on-secondary-container": "#785808", "on-error-container": "#93000a",
            "surface-bright": "#f9faf7", "tertiary-fixed-dim": "#f6b4d1", "on-primary": "#ffffff",
            "on-secondary-fixed": "#261900", "on-background": "#1a1c1b", "surface": "#f9faf7",
            "surface-container-high": "#e7e8e6", "primary-fixed-dim": "#a0d1bf", "tertiary-fixed": "#ffd8e7",
            "error-container": "#ffdad6", "on-primary-fixed": "#002018", "surface-container-low": "#f3f4f1",
            "on-tertiary-fixed": "#350c23", "on-surface": "#1a1c1b", "error": "#ba1a1a",
            "surface-tint": "#396758", "on-secondary-fixed-variant": "#5d4200", "on-tertiary-container": "#f9b7d5",
            "on-tertiary-fixed-variant": "#68374f", "surface-container-lowest": "#ffffff", "inverse-on-surface": "#f0f1ee",
            "surface-variant": "#e2e3e0", "primary-fixed": "#bceddb", "tertiary-container": "#78455e",
            "secondary-fixed-dim": "#ecc06b", "on-primary-fixed-variant": "#204f41", "outline": "#717975",
            "primary-container": "#2f5d4f", "inverse-primary": "#a0d1bf", "on-error": "#ffffff",
            "secondary": "#79590a", "on-secondary": "#ffffff", "surface-container": "#edeeec",
            "secondary-fixed": "#ffdea4", "secondary-container": "#fed17a", "on-primary-container": "#a3d4c2",
            "outline-variant": "#c0c8c4", "on-surface-variant": "#404945", "inverse-surface": "#2e312f",
            "primary": "#154538", "surface-dim": "#d9dad8", "on-tertiary": "#ffffff",
            "background": "#f9faf7", "surface-container-highest": "#e2e3e0",
            "gold": "#C39B4A", "ivory": "#EFE4C8", "rose": "#C9867A"
          },
          borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
          spacing: { "gutter": "2rem", "unit": "8px", "margin-page": "4rem", "frame-padding": "3rem" },
          fontFamily: {
            "label-caps": ["Newsreader", "serif"], "display-lg": ["Epilogue", "sans-serif"],
            "body-lg": ["Newsreader", "serif"], "headline-md": ["Epilogue", "sans-serif"],
            "body-md": ["Newsreader", "serif"], "headline-xl": ["Epilogue", "sans-serif"]
          },
          fontSize: {
            "label-caps": ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "600" }],
            "display-lg": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" }],
            "body-lg": ["1.25rem", { lineHeight: "1.6", fontWeight: "400" }],
            "headline-md": ["2rem", { lineHeight: "1.2", fontWeight: "400" }],
            "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
            "headline-xl": ["3rem", { lineHeight: "1.2", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const styles = `
    .whiplash-curve { border-bottom: 1px solid #C39B4A; border-radius: 0 0 50% 0; padding-bottom: 2px; }
    .botanical-border { border: 1px solid #C39B4A; position: relative; }
    .botanical-border::before, .botanical-border::after {
      content: ''; position: absolute; width: 20px; height: 20px;
      border: 1px solid #C39B4A; border-radius: 50%;
    }
    .botanical-border::before { top: -10px; left: -10px; }
    .botanical-border::after { bottom: -10px; right: -10px; }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;
    }
    .an-wave {
      background-image:
        repeating-linear-gradient(45deg, transparent 0 28px, rgba(195,155,74,0.40) 28px 29px, transparent 29px 56px),
        repeating-linear-gradient(-45deg, transparent 0 28px, rgba(195,155,74,0.32) 28px 29px, transparent 29px 56px),
        radial-gradient(circle at 50% 50%, rgba(195,155,74,0.65) 1.4px, transparent 2.2px);
      background-size: auto, auto, 56px 56px;
    }
    .an-pattern {
      background-image:
        radial-gradient(circle at 50% 50%, rgba(195,155,74,0.55) 1.6px, transparent 2.4px);
      background-size: 28px 28px;
    }
    .gold-frame { border: 1px solid #C39B4A; box-shadow: inset 0 0 0 4px #EFE4C8, inset 0 0 0 5px rgba(195, 155, 74, 0.5); }
    .arch { border-top-left-radius: 50% 30%; border-top-right-radius: 50% 30%; }
    .rose-glow { background: radial-gradient(circle at center, rgba(201, 134, 122, 0.18) 0%, transparent 70%); }
    .sage-glow { background: radial-gradient(circle at center, rgba(21, 69, 56, 0.12) 0%, transparent 70%); }
    .gold-glow { background: radial-gradient(circle at center, rgba(195, 155, 74, 0.22) 0%, transparent 65%); }
    @keyframes an-bloom { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.02); opacity: 1; } }
    .an-bloom { animation: an-bloom 8s ease-in-out infinite; }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,300;0,400;0,600;1,300&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="bg-[#EFE4C8] text-primary min-h-screen flex flex-col font-body-md overflow-x-hidden">
        <header className="bg-stone-50/90 dark:bg-stone-950/90 top-0 z-50 border-b border-[#C39B4A]/30 flex justify-between items-center px-16 py-10 w-full backdrop-blur-sm sticky">
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.label} href="#" className={l.active
                ? "text-[#C39B4A] font-bold border-b border-[#C39B4A] pb-1 font-epilogue tracking-[0.2em] uppercase text-xs hover:text-[#C39B4A] transition-all duration-500 ease-in-out"
                : "text-emerald-900/70 dark:text-emerald-100/70 hover:text-[#C39B4A] font-epilogue tracking-[0.2em] uppercase text-xs transition-all duration-500 ease-in-out"}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="text-3xl font-light italic tracking-tighter text-emerald-950 dark:text-emerald-50">
            Maison Solène
          </div>
          <div className="flex items-center gap-4">
            <button className="text-emerald-900 dark:text-emerald-50 hover:text-[#C39B4A] transition-all duration-500 ease-in-out">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center w-full pb-32">
          {/* HERO :: full-bleed art nouveau composition */}
          <section className="relative w-full min-h-[92vh] overflow-hidden">
            <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#EFE4C8] via-[#F2E8CF] to-[#D4DBC9]" aria-hidden="true"></div>
            <div className="absolute inset-0 -z-20 pointer-events-none" aria-hidden="true"></div>
            <div className="absolute -top-40 -left-32 w-[60vw] h-[60vw] gold-glow blur-3xl pointer-events-none -z-10" aria-hidden="true"></div>
            <div className="absolute -bottom-48 -right-24 w-[55vw] h-[55vw] rose-glow blur-3xl pointer-events-none -z-10" aria-hidden="true"></div>
            <div className="absolute top-1/3 left-1/2 w-[30vw] h-[30vw] sage-glow blur-3xl pointer-events-none -z-10" aria-hidden="true"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-24 md:pt-24 md:pb-28 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
              <div className="md:col-span-7 flex flex-col">
                <div className="flex items-center gap-3 mb-7 flex-wrap">
                  <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold"></span>
                  <svg className="w-3 h-3 text-gold" viewBox="0 0 12 12" aria-hidden="true">
                    <circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                  <span className="font-epilogue tracking-[0.4em] uppercase text-[10px] text-gold">Maison · Grasse · MCMXIV</span>
                  <svg className="w-3 h-3 text-gold" viewBox="0 0 12 12" aria-hidden="true">
                    <circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                  <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold"></span>
                </div>

                <h1 className="font-display-lg text-primary italic leading-[0.95] mb-8 text-[clamp(48px,8vw,116px)] tracking-tight">
                  An hour <br />
                  <span className="text-tertiary">in <span className="not-italic font-newsreader">Grasse</span>.</span>
                </h1>

                <p className="font-body-lg text-tertiary leading-relaxed max-w-xl mb-3 italic">
                  Twelve fields. Three thousand blossoms. One bottle, hand-poured at dawn.
                </p>
                <p className="font-body-md text-on-surface/70 leading-relaxed max-w-xl mb-10">
                  Each Maison Solène fragrance is composed of natural absolutes from our own valley — distilled in copper, blended in oak, and rested through a full season before the cap is set.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <a href="#collection" className="group inline-flex items-center justify-center bg-primary text-on-primary font-epilogue tracking-[0.3em] uppercase text-xs px-10 py-5 hover:bg-tertiary transition-colors duration-500">
                    Enter the Atelier
                    <span className="material-symbols-outlined ml-2 text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </a>
                  <a href="#perfumer" className="inline-flex items-center justify-center border border-gold text-gold font-epilogue tracking-[0.3em] uppercase text-xs px-10 py-5 hover:bg-gold/10 transition-colors duration-500">
                    The Manifesto
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] tracking-[0.3em] uppercase font-epilogue text-tertiary/70">
                  <span>Spring Collection · MCMXCV</span>
                  <span className="w-px h-3 bg-gold/40"></span>
                  <span>By Hand · By Nose · By Season</span>
                  <span className="w-px h-3 bg-gold/40"></span>
                  <span className="text-rose">100% Natural Absolutes</span>
                </div>
              </div>

              <div className="md:col-span-5 relative">
                <div className="relative aspect-[4/5] arch overflow-hidden gold-frame bg-ivory shadow-[0_30px_80px_-20px_rgba(93,46,70,0.35)] an-bloom">
                  <div className="absolute inset-3 arch border border-gold/50 z-10 pointer-events-none"></div>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYaVWl9ZjLODwPa0hv6JpnnALOfqv07OesT5_fo5cohWRMltHoKkYLYBsP0-1uj0vyd0o9R5UYB0eBrQRcX-ZiBPUEocZPAny4BYblzwNiTRRZsmKlxPu--RA_nskAG_dTG7i-OKCan2WmLuyQ9HDhLpQBl-eEi0I9zunZxKT3p2o3zvFVNxUY91Sw1KOLUFXJ7Um5QjigkmMUmxkjDdKRTV0IQltUmB9KXdC4BPkcFHii5-1gtdJ6CX3ug8EmQ_wdGnF-52r6AQ"
                       alt="Art Nouveau lithograph of a woman with flowing hair intertwined with stylized vines and lilies, Mucha inspired"
                       className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-ivory/20 via-transparent to-tertiary/30 pointer-events-none"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between border-t border-gold/40 pt-3">
                    <span className="font-epilogue tracking-[0.3em] uppercase text-[9px] text-ivory">No. 01 — L'Iris</span>
                    <span className="font-newsreader italic text-ivory text-sm">Hand-poured</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between text-tertiary">
                  <span className="font-newsreader italic text-sm">Composé · Mai · MCMXCV</span>
                  <span className="font-epilogue tracking-[0.3em] uppercase text-[9px] text-gold/70">Grasse · Provence</span>
                </div>

                <div className="absolute -left-3 top-1/4 hidden md:flex flex-col gap-3" aria-hidden="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/60"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/20"></span>
                </div>
              </div>
            </div>

          </section>

          <div className="w-full h-20 md:h-32"></div>

          {/* Constrained content */}
          <div className="w-full px-4 sm:px-gutter lg:px-margin-page flex flex-col items-center">

          {/* Maisons & Press — featured-in row */}
          <section className="w-full max-w-7xl mb-32">
            <div className="text-center mb-10">
              <span className="font-epilogue tracking-[0.3em] uppercase text-[10px] text-gold">Maisons · Presses · Boutiques</span>
              <h2 className="font-headline-md text-primary italic mt-3">Carried &amp; written about, in equal measure.</h2>
              <div className="w-16 h-px bg-gold/60 mx-auto mt-4"></div>
            </div>
            <ul role="list" className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-9 items-center justify-items-center bg-surface-bright/70 botanical-border py-9 px-6">
              {[
                { slug: "hermes", name: "Hermès" },
                { slug: "elsevier", name: "Elsevier" },
                { slug: "etsy", name: "Etsy" },
                { slug: "pinterest", name: "Pinterest" },
                { slug: "instagram", name: "Instagram" },
                { slug: "medium", name: "Medium" },
                { slug: "airbnb", name: "Airbnb" },
              ].map(b => (
                <li key={b.slug} className="flex flex-col items-center gap-2">
                  <img src={`https://cdn.simpleicons.org/${b.slug}/8B6F43`} alt={b.name} className="h-7 w-auto" loading="lazy" decoding="async" width="28" height="28" />
                  <span className="font-epilogue tracking-[0.25em] uppercase text-[9px] text-gold">{b.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Maison Pillars — premium 2x2 cards on faint floral backdrop */}
          <section className="w-full max-w-7xl mb-32 relative overflow-hidden p-frame-padding md:p-16">
            <div className="absolute inset-0 -z-10">
              <img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80&auto=format&fit=crop" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-25" loading="lazy" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(245,235,208,0.92) 0%, rgba(247,242,229,0.94) 100%)" }}></div>
              <div className="absolute inset-0 an-pattern opacity-10 pointer-events-none" aria-hidden="true"></div>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 25%, rgba(247,242,229,0.7) 80%)" }}></div>
            </div>

            <svg className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-12 text-gold/60 pointer-events-none" viewBox="0 0 200 60" aria-hidden="true">
              <path d="M10 50 Q 100 0 190 50" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <circle cx="100" cy="22" r="2" fill="currentColor" />
            </svg>

            <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto pt-12">
              <span className="font-epilogue tracking-[0.3em] uppercase text-[10px] text-gold">Quatre · Maximes</span>
              <h2 className="font-headline-xl text-primary italic mt-3">The Maison's Four Maxims.</h2>
              <div className="w-24 h-1 bg-gold mx-auto mt-6"></div>
              <p className="font-body-md text-on-surface/70 mt-6 leading-relaxed">Standing principles, kept since the founding ledger of 1899. Each accompanies an essence; each is signed in the perfumer's own hand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                { id: "M · I", icon: "local_florist", title: "Naturel · sans synthétique", body: "Every absolute extracted from the field. No synthetic top-up, no isolate masking, no shortcut to volume. If a flower fails its harvest, the run is held until next May.", meta: "Distilled · Grasse" },
                { id: "M · II", icon: "edit_note", title: "Composé · à la main", body: "Each formula written in the master's leather book — twelve trial flacons, ninety days of oak rest, one final signature before the cap is set. No factory line. No batch shortcut.", meta: "Atelier · ninety days" },
                { id: "M · III", icon: "recycling", title: "Refillable · à perpetuité", body: "The crystal flacon is yours for life. Send it back at half-volume; we refill, re-seal in beeswax, and return. Cap, stopper and crest-seal restored at no charge. The bottle is the heirloom.", meta: "Service · perpetuum" },
                { id: "M · IV", icon: "history_edu", title: "Numéroté · signé", body: "Each decanter numbered, signed, and entered in the maison's ledger — twelve hundred annual editions, never more. Provenance is traceable to the row of the field and the day of the cut.", meta: "Édition · 1,200 / an" },
              ].map(m => (
                <article key={m.id} className="relative bg-ivory/85 backdrop-blur-sm botanical-border p-7 md:p-9 group hover:bg-ivory transition-colors flex gap-5">
                  <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 arch border border-gold flex items-center justify-center bg-surface-bright">
                    <span className="material-symbols-outlined text-gold text-[26px]" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">{m.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3 mb-2 border-b border-gold/30 pb-2">
                      <h3 className="font-headline-md text-primary italic leading-tight">{m.title}</h3>
                      <span className="font-epilogue tracking-[0.3em] uppercase text-[9px] text-gold/80 shrink-0">{m.id}</span>
                    </div>
                    <p className="font-body-md text-on-surface/75 leading-loose">{m.body}</p>
                    <p className="font-epilogue tracking-[0.25em] uppercase text-[10px] text-gold/70 mt-4">{m.meta}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="w-full max-w-7xl mb-32">
            <div className="text-center mb-16">
              <h2 className="font-headline-xl text-primary italic relative inline-block">
                The Collection
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-[1px] bg-gold"></div>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {fragrances.map(f => (
                <div key={f.name} className="flex flex-col items-center text-center botanical-border p-8 bg-surface-bright group hover:bg-rose/10 transition-colors duration-500">
                  <div className="w-full h-64 mb-6 border-b border-gold/30 pb-4 relative overflow-hidden rounded-t-[50%]">
                    <img alt="Perfume bottle illustration" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" src={f.img} />
                  </div>
                  <span className="bg-tertiary text-on-tertiary font-label-caps px-4 py-1 mb-4 rounded-sm" style={{ border: "1px solid #C39B4A" }}>{f.tag}</span>
                  <h3 className="font-headline-md text-primary mb-2">{f.name}</h3>
                  <p className="font-body-md text-outline mb-6">{f.desc}</p>
                  <p className="font-label-caps text-gold">{f.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* THE PROCESS — 3 arches */}
          <section id="process" className="w-full max-w-7xl mb-32">
            <div className="text-center mb-16">
              <span className="font-epilogue tracking-[0.4em] uppercase text-[10px] text-gold">II — Métier</span>
              <h2 className="font-headline-xl text-primary italic relative inline-block mt-4">
                The Process
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-[1px] bg-gold"></div>
              </h2>
              <p className="font-newsreader italic text-tertiary/85 max-w-xl mx-auto mt-10 leading-relaxed">
                Three slow gestures, repeated since 1895. From the first cut at sunrise to the last drop set in oak.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {processSteps.map((s) => (
                <div key={s.numeral} className="flex flex-col items-center text-center group">
                  <div className="relative w-full aspect-[3/4] arch overflow-hidden gold-frame bg-surface-bright">
                    <div className="absolute inset-3 arch border border-gold/40 z-10 pointer-events-none"></div>
                    <img src={s.img} alt={s.alt} loading="lazy" decoding="async"
                         className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-tertiary/40 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full border border-gold/70 bg-ivory/80 flex items-center justify-center font-newsreader italic text-gold text-lg">{s.numeral}</div>
                  </div>
                  <h3 className="font-headline-md text-primary italic mt-8">{s.title}</h3>
                  <div className="w-12 h-px bg-gold/60 my-4"></div>
                  <p className="font-body-md text-on-surface/70 leading-relaxed max-w-sm">{s.body}</p>
                  <span className="font-epilogue tracking-[0.3em] uppercase text-[10px] text-gold mt-6">{s.season}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="perfumer" className="w-full max-w-7xl mb-32 flex flex-col md:flex-row items-center gap-16 p-frame-padding botanical-border bg-surface-bright relative">
            <div className="w-full md:w-1/2 h-[500px] relative overflow-hidden rounded-t-full border border-gold">
              <img alt="The Perfumer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNuPdxiNZe2xdkZOBIZowk1ih_shnXu-arVF437SfcHJT6PcorQryZIPKdqmHqflZjWQLZ4j1r0hX4bEf5xJT5kF24OBk8TZaetEgXEi31YXPbe8uIU_YObjhXUeoRiH75AtDqS1xPVr8MfOHL-nFt_LDVJRgoHrwLB1NyM5aenuUHJP0xIDZOxGTw_olhZhO-7yMKd4t7U7OdmXJe97N3d8b20ETRtDBfrEr4BHhkauNvR_qTC45R-BdwVHjc88yCitKXaVfag" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left">
              <h2 className="font-headline-xl text-primary italic">The Perfumer</h2>
              <div className="w-16 h-[1px] bg-gold mx-auto md:mx-0"></div>
              <p className="font-body-lg text-outline leading-relaxed">
                "Perfumery is a dialogue with nature, a translation of ephemeral blooms into lasting memory."
              </p>
              <p className="font-body-md text-on-surface">
                Trained in the historic fields of Grasse, our master perfumer seeks the most lyrical natural essences. Each creation is composed like a visual symphony, drawing inspiration from the curving lines of nature and the poetic heritage of the Fin de Siècle.
              </p>
            </div>
          </section>

          {/* ATELIER DE GRASSE — editorial 7/5 split */}
          <section id="atelier" className="w-full max-w-7xl mb-32 relative">
            <svg className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-12 text-gold/60 pointer-events-none" viewBox="0 0 200 60" aria-hidden="true">
              <path d="M10 50 Q 100 0 190 50" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <circle cx="100" cy="22" r="2" fill="currentColor" />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-stretch">
              <div className="md:col-span-7 relative bg-gradient-to-br from-[#F5EBD0] via-[#EFE4C8] to-[#E8D9B5] p-10 md:p-16 botanical-border flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 an-pattern opacity-10 pointer-events-none" aria-hidden="true"></div>
                <div className="absolute -top-8 -left-8 w-32 h-32 gold-glow blur-2xl pointer-events-none" aria-hidden="true"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-epilogue tracking-[0.4em] uppercase text-[10px] text-gold">IV — Atelier</span>
                    <span className="w-12 h-px bg-gold/60"></span>
                  </div>
                  <h2 className="font-headline-xl text-primary italic leading-tight mb-8 text-[clamp(36px,4vw+1rem,56px)]">
                    The atelier <br />
                    <span className="text-tertiary">at <span className="not-italic font-newsreader">Grasse</span>.</span>
                  </h2>
                  <blockquote className="border-l-2 border-gold pl-6 mb-8 max-w-xl">
                    <p className="font-newsreader italic text-tertiary text-xl leading-relaxed">
                      "We do not invent fragrance. We translate it — from a single dawn-cut petal into a thousand quiet evenings."
                    </p>
                    <cite className="not-italic font-epilogue tracking-[0.3em] uppercase text-[9px] text-gold mt-4 block">— Solène, fondatrice · 1895</cite>
                  </blockquote>
                  <p className="font-body-md text-on-surface/75 leading-relaxed max-w-xl mb-8">
                    Three rooms above a stone courtyard in old Grasse. Eighteen oak vats. Forty-seven distillations a year. No machine has ever crossed the threshold — every cap is set, every label is gilt, every note is pencilled by hand.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a href="#" className="group inline-flex items-center gap-2 text-gold whiplash-curve font-epilogue tracking-[0.3em] uppercase text-xs hover:text-rose transition-colors">
                      Visite Privée
                      <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </a>
                    <span className="font-newsreader italic text-tertiary/70 text-sm">Sur rendez-vous · Mardi → Vendredi</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col gap-6">
                <div className="relative aspect-[4/5] arch overflow-hidden gold-frame">
                  <div className="absolute inset-3 arch border border-gold/40 z-10 pointer-events-none"></div>
                  <img src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop"
                       alt="Atelier ceiling cornice and ornament in afternoon light"
                       loading="lazy" decoding="async"
                       className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 right-3 z-10 bg-ivory/80 px-3 py-1.5 flex items-center justify-between">
                    <span className="font-newsreader italic text-tertiary text-xs">Salle des Cuivres</span>
                    <span className="font-epilogue tracking-[0.3em] uppercase text-[8px] text-gold">No. 02</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gold/40 p-4 bg-surface-bright/60 text-center">
                    <span className="block font-newsreader italic text-tertiary text-3xl">XII</span>
                    <span className="block font-epilogue tracking-[0.3em] uppercase text-[9px] text-gold/80 mt-2">Hectares</span>
                  </div>
                  <div className="border border-gold/40 p-4 bg-surface-bright/60 text-center">
                    <span className="block font-newsreader italic text-tertiary text-3xl">XLVII</span>
                    <span className="block font-epilogue tracking-[0.3em] uppercase text-[9px] text-gold/80 mt-2">Distillations</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ORIGINS — by the numbers */}
          <section id="origins" className="w-full max-w-7xl mb-32">
            <div className="text-center mb-12">
              <span className="font-epilogue tracking-[0.4em] uppercase text-[10px] text-gold">V — Origines</span>
              <h2 className="font-headline-xl text-primary italic relative inline-block mt-4">
                By the numbers
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-[1px] bg-gold"></div>
              </h2>
            </div>

            <div className="relative botanical-border p-8 md:p-12 bg-gradient-to-r from-[#F5EBD0] via-ivory to-[#F5EBD0]">
              <div className="absolute inset-0 opacity-15 pointer-events-none" aria-hidden="true"></div>
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 divide-gold/30 md:divide-x">
                {originStats.map((s) => (
                  <div key={s.label} className="flex flex-col items-center text-center px-2">
                    <span className="font-newsreader italic text-primary text-5xl md:text-6xl mb-2">{s.num}</span>
                    <span className="w-8 h-px bg-gold/60 my-3"></span>
                    <span className="font-epilogue tracking-[0.3em] uppercase text-[10px] text-tertiary">{s.label}</span>
                    <span className="font-newsreader italic text-tertiary/70 text-xs mt-2">{s.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </main>

        <footer className="relative w-full bg-gradient-to-b from-[#F5EBD0] to-[#EFE4C8] border-t border-gold/40 pt-16 pb-10 overflow-hidden">
          <div className="absolute inset-0 an-pattern opacity-15 pointer-events-none" aria-hidden="true"></div>

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="text-3xl font-light italic tracking-tight text-primary font-newsreader">Maison Solène</div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-gold/60"></span>
                <span className="font-epilogue tracking-[0.4em] uppercase text-[10px] text-gold">Grasse · Provence</span>
              </div>
              <p className="font-newsreader italic text-tertiary/85 leading-relaxed text-sm max-w-xs">Une heure dans nos champs, un siècle dans une bouteille.</p>
              <p className="font-body-md text-on-surface/70 text-sm leading-relaxed max-w-xs mt-1">Composing natural absolutes from twelve cultivated hectares since 1895. Every bottle stamped, sealed and signed by hand.</p>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-epilogue tracking-[0.3em] uppercase text-[10px] text-gold mb-4 border-b border-gold/30 pb-2">The House</h4>
                <ul className="space-y-2.5 font-newsreader text-sm text-tertiary/85">
                  {footerHouseLinks.map(l => (
                    <li key={l}><a href="#" className="hover:text-gold transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-epilogue tracking-[0.3em] uppercase text-[10px] text-gold mb-4 border-b border-gold/30 pb-2">Le Service</h4>
                <ul className="space-y-2.5 font-newsreader text-sm text-tertiary/85">
                  {footerServiceLinks.map(l => (
                    <li key={l}><a href="#" className="hover:text-gold transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <h4 className="font-epilogue tracking-[0.3em] uppercase text-[10px] text-gold border-b border-gold/30 pb-2">La Lettre</h4>
              <p className="font-newsreader italic text-tertiary/85 text-sm leading-relaxed">Seasonal letters from Grasse — harvest dates, atelier visits, and one new fragrance each spring.</p>
              <form className="flex border-b border-gold/60 focus-within:border-gold transition-colors">
                <input type="email" placeholder="Votre adresse électronique" className="flex-1 bg-transparent py-2 font-newsreader italic text-tertiary text-sm placeholder-tertiary/40 focus:outline-none" />
                <button type="button" className="text-gold hover:text-rose transition-colors px-2" aria-label="Subscribe">
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </form>
              <p className="font-epilogue text-[9px] tracking-[0.3em] uppercase text-tertiary/50 leading-relaxed">Quatre lettres par an. Désabonnement instantané.</p>
              <div className="flex items-center gap-3 mt-2">
                <a href="#" className="text-tertiary/70 hover:text-gold transition-colors" aria-label="Instagram"><span className="material-symbols-outlined text-base">camera_alt</span></a>
                <span className="w-px h-4 bg-gold/30"></span>
                <a href="#" className="text-tertiary/70 hover:text-gold transition-colors" aria-label="Journal"><span className="material-symbols-outlined text-base">menu_book</span></a>
                <span className="w-px h-4 bg-gold/30"></span>
                <a href="#" className="text-tertiary/70 hover:text-gold transition-colors" aria-label="Boutique"><span className="material-symbols-outlined text-base">storefront</span></a>
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 mt-12 mb-6">
            <div className="flex items-center gap-3 opacity-70">
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-gold to-gold"></div>
              <svg className="w-5 h-5 text-gold" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 3 Q 14 7 10 10 Q 6 13 10 17 Q 14 13 10 10 Q 6 7 10 3 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </svg>
              <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-gold to-gold"></div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] tracking-[0.3em] uppercase font-epilogue text-tertiary/60">
            <span>© MCMXCV — MMXXIV · Maison Solène</span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLegalLinks.map(l => (
                <a key={l} href="#" className="hover:text-gold transition-colors">{l}</a>
              ))}
            </div>
            <span>Composed · Bottled · Sealed in Grasse</span>
          </div>
        </footer>
      </div>
    </>
  );
}
