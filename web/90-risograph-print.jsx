const PROCESS_STEPS = [
  {
    n: "01",
    nColor: "text-primary-container",
    phase: "Phase · I",
    phaseColor: "text-secondary",
    title: "Strip the artwork to its skeleton.",
    body: "Each colour gets its own bare-bones layer. Black goes solid; magenta goes halftone; cobalt fills the negatives. We separate by hand because the software always over-thinks the dot grid.",
    meta: "Output · 4 layers · 1 master file · 0 doubts",
  },
  {
    n: "02",
    nColor: "text-secondary",
    phase: "Phase · II",
    phaseColor: "text-primary-container",
    title: "Burn the masters onto wax.",
    body: "A xenon lamp blasts each separation onto a thermal master. The MZ790 hisses, the cylinder spins, and the master accepts soy ink in the only places we told it to.",
    meta: "Heat · 0.4 sec · Resolution · 600 dpi",
  },
  {
    n: "03",
    nColor: "text-primary-container",
    phase: "Phase · III",
    phaseColor: "text-secondary",
    title: "Run the paper through, four times.",
    body: "Each pass lays a single colour. Between passes the paper rests on a drying rack — soy ink takes its time. We change drums by hand and feed the stack with a cotton glove.",
    meta: "Passes · 4 · Drying · 36 hours total",
  },
  {
    n: "04",
    nColor: "text-secondary",
    phase: "Phase · IV",
    phaseColor: "text-primary-container",
    title: "Bind, stamp, smudge, ship.",
    body: "Saddle-stitched or perfect-bound, depending on the page count. Every cover gets a hand-stamp in our studio's magenta. Every edition gets a number. Every thumbprint stays.",
    meta: "Edition · 50–500 · Stamp · Magenta · Always",
  },
];

const RIBBON_PRINTS = [
  { caption: "ZINE 14 · CRACK", num: "№01", swatch: "bg-primary-container", numColor: "text-primary-container", src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&auto=format&fit=crop", alt: "Fashion editorial b&w portrait, treated with riso magenta-cobalt overprint" },
  { caption: "POSTER · VOID", num: "№02", swatch: "bg-secondary", numColor: "text-secondary", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", alt: "Architectural facade study, riso-treated with cobalt overprint" },
  { caption: "PRINT 023 · STATIC", num: "№03", swatch: "bg-primary-container", numColor: "text-primary-container", src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=85&auto=format&fit=crop", alt: "Editorial portrait riso-treated" },
  { caption: "FOLIO 07 · BRUISE", num: "№04", swatch: "bg-secondary", numColor: "text-secondary", src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop", alt: "Brutalist concrete interior riso-treated" },
  { caption: "BOOKLET · MARROW", num: "№05", swatch: "bg-primary-container", numColor: "text-primary-container", src: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=900&q=85&auto=format&fit=crop", alt: "Fashion editorial portrait riso-treated" },
  { caption: "ZINE 18 · KIN", num: "№06", swatch: "bg-secondary", numColor: "text-secondary", src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&q=85&auto=format&fit=crop", alt: "Architectural minimal interior riso-treated" },
  { caption: "POSTER · MOTH", num: "№07", swatch: "bg-primary-container", numColor: "text-primary-container", src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=900&q=85&auto=format&fit=crop", alt: "Editorial portrait riso-treated" },
  { caption: "PRINT 041 · QUIET", num: "№08", swatch: "bg-secondary", numColor: "text-secondary", src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=900&q=85&auto=format&fit=crop", alt: "Architectural archway riso-treated" },
  { caption: "FOLIO 12 · CINDER", num: "№09", swatch: "bg-primary-container", numColor: "text-primary-container", src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85&auto=format&fit=crop", alt: "Editorial portrait riso-treated" },
  { caption: "ZINE 22 · PILE", num: "№10", swatch: "bg-secondary", numColor: "text-secondary", src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", alt: "Marble vestibule architectural detail riso-treated" },
];

const RISO_FAQ = [
  { i: "Q · 01", color: "text-primary-container", q: "What's a riso, exactly?", a: "A risograph is a stencil duplicator — think mimeograph's smarter cousin. Soy-based ink, drum per colour, hand-fed paper. It's not a printer; it's a small press wearing a coat.", open: true },
  { i: "Q · 02", color: "text-secondary", q: "How many colors per print?", a: "Up to four. We stock magenta, cobalt, fluorescent yellow, and black. Anything more and the registration starts arguing back. Two colours is usually the sweet spot.", open: false },
  { i: "Q · 03", color: "text-primary-container", q: "What paper do you use?", a: "Mohawk Superfine 80lb for covers. Munken Pure 90gsm for interiors. Both uncoated, both warm-cream. Coated stock and riso ink hate each other; we don't get involved.", open: false },
  { i: "Q · 04", color: "text-secondary", q: "Can you print my cover?", a: "Yes, if it's interesting. We don't print wedding invitations or coupons. Send a PDF, a sentence about the project, and the run size. We answer Mondays and Thursdays.", open: false },
  { i: "Q · 05", color: "text-primary-container", q: "Lead time?", a: "Three to six weeks from approval, depending on colour count and binding. Drying takes longer than printing — soy ink is slow, and we don't rush it. Rush jobs cost double.", open: false },
  { i: "Q · 06", color: "text-secondary", q: "Do you ship abroad?", a: "Worldwide, kraft-wrapped, twine-tied. Customs forms get stamped in magenta. We've shipped to forty-one countries and lost exactly two boxes — both to the same Dutch sorting office.", open: false },
];

export default function T90RisographPrint() {
  const ribbonAll = [...RIBBON_PRINTS, ...RIBBON_PRINTS];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@700;800;900&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "secondary-fixed": "#d9e2ff",
                "on-secondary": "#ffffff",
                "on-tertiary-container": "#33312d",
                "error-container": "#ffdad6",
                "surface-tint": "#b2196c",
                "on-tertiary-fixed": "#1d1b18",
                "surface-container-highest": "#eae2ce",
                "on-secondary-container": "#003c89",
                "outline-variant": "#debec8",
                "on-surface": "#1f1b0f",
                "on-error": "#ffffff",
                "inverse-surface": "#343023",
                "inverse-on-surface": "#f8f0dc",
                "secondary-container": "#83aaff",
                "primary-fixed": "#ffd9e4",
                "surface-container-lowest": "#ffffff",
                "surface-container-high": "#f0e8d4",
                "surface-variant": "#eae2ce",
                "on-primary": "#ffffff",
                "inverse-primary": "#ffb0cd",
                "on-background": "#1f1b0f",
                "secondary-fixed-dim": "#afc6ff",
                "on-primary-fixed": "#3e0021",
                "tertiary-fixed": "#e7e1dc",
                "on-primary-container": "#650039",
                "surface-container-low": "#fbf3df",
                "surface-dim": "#e1dac6",
                "surface": "#fff9ee",
                "primary-container": "#ff5ca8",
                "background": "#fff9ee",
                "on-primary-fixed-variant": "#8d0052",
                "secondary": "#305cac",
                "primary": "#b2196c",
                "tertiary-fixed-dim": "#cbc5c0",
                "tertiary": "#615e5a",
                "on-secondary-fixed": "#001a43",
                "outline": "#8a7078",
                "on-tertiary": "#ffffff",
                "error": "#ba1a1a",
                "on-error-container": "#93000a",
                "surface-bright": "#fff9ee",
                "on-tertiary-fixed-variant": "#494643",
                "on-surface-variant": "#574148",
                "primary-fixed-dim": "#ffb0cd",
                "surface-container": "#f5edd9",
                "tertiary-container": "#9d9893",
                "on-secondary-fixed-variant": "#0d4393"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: {
                "stack-sm": "16px",
                "stack-md": "32px",
                "gutter": "24px",
                "base": "8px",
                "margin-site": "32px",
                "stack-lg": "64px"
              },
              fontFamily: {
                "caption": ["Space Grotesk"],
                "label-sm": ["Space Grotesk"],
                "body-md": ["Newsreader"],
                "headline-lg": ["Epilogue"],
                "body-lg": ["Newsreader"],
                "headline-md": ["Epilogue"],
                "display-xl": ["Epilogue"]
              },
              fontSize: {
                "caption": ["14px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
                "label-sm": ["12px", { lineHeight: "1", fontWeight: "700" }],
                "body-md": ["18px", { lineHeight: "1.5", fontWeight: "400" }],
                "headline-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" }],
                "body-lg": ["20px", { lineHeight: "1.6", fontWeight: "400" }],
                "headline-md": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
                "display-xl": ["72px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "900" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        .riso-grain { position: relative; }
        .riso-grain::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image:
            radial-gradient(circle at 25% 35%, rgba(31,27,15,0.10) 0.6px, transparent 1.2px),
            radial-gradient(circle at 70% 60%, rgba(178,25,108,0.08) 0.5px, transparent 1px),
            radial-gradient(circle at 50% 80%, rgba(48,92,172,0.06) 0.5px, transparent 1px);
          background-size: 7px 7px, 5px 5px, 11px 11px;
          pointer-events: none;
          z-index: 50;
          mix-blend-mode: multiply;
          opacity: 0.55;
        }
        .multiply-blend { mix-blend-mode: multiply; }
        .misregister-hover:hover { transform: translate(2px, 2px); transition: transform 0.1s; }
        .rough-border { border: 2px solid #1f1b0f; border-radius: 1px; }
        .riso-shift { text-shadow: 3px 3px 0 #305cac, -2px -2px 0 #ff5ca8; }
        .riso-shift-sm { text-shadow: 2px 2px 0 #305cac; }
        .riso-photo { filter: contrast(120%) saturate(1.3) hue-rotate(-12deg) grayscale(60%); mix-blend-mode: multiply; }
        .ribbon-track {
          display: flex;
          gap: 28px;
          width: max-content;
          animation: ribbon-scroll 60s linear infinite;
        }
        .ribbon-track:hover { animation-play-state: paused; }
        @keyframes ribbon-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 14px)); }
        }
        details.riso-faq summary::-webkit-details-marker { display: none; }
        details.riso-faq summary { list-style: none; cursor: pointer; }
        details.riso-faq summary .riso-plus { transition: transform 250ms ease; display: inline-block; }
        details.riso-faq[open] summary .riso-plus { transform: rotate(45deg); }
        @media (prefers-reduced-motion: reduce) {
          details.riso-faq summary .riso-plus { transition: none; }
          .ribbon-track { animation: none; }
        }
        html, body { overflow-x: clip; }
        .full-bleed {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-right: calc(50% - 50vw);
          max-width: none;
        }
      ` }} />

      <div className="bg-background text-on-background font-body-md min-h-screen relative riso-grain selection:bg-primary-container selection:text-white">
        {/* TopAppBar */}
        <header className="bg-[#fdfbf7] dark:bg-[#1a1a1a] top-0 border-b-2 border-stone-900 dark:border-stone-100 flex justify-between items-center w-full px-6 py-4 relative overflow-visible z-40 sticky">
          <a className="text-3xl font-black tracking-tighter text-stone-900 dark:text-stone-100 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform font-display-xl" href="#" style={{ fontSize: "2rem" }}>
            Paper Lung Press
          </a>
          <nav className="hidden md:flex gap-gutter">
            <a className="font-['Space_Grotesk'] uppercase tracking-tight font-bold text-sm text-[#FF5CA8] border-b-2 border-[#FF5CA8] pb-1 hover:bg-[#FF5CA8] hover:text-white transition-colors duration-75 misregister-hover" href="#">Catalogue</a>
            <a className="font-['Space_Grotesk'] uppercase tracking-tight font-bold text-sm text-stone-900 dark:text-stone-100 hover:text-blue-600 hover:bg-[#FF5CA8] hover:text-white transition-colors duration-75 misregister-hover" href="#">Reading Room</a>
            <a className="font-['Space_Grotesk'] uppercase tracking-tight font-bold text-sm text-stone-900 dark:text-stone-100 hover:text-blue-600 hover:bg-[#FF5CA8] hover:text-white transition-colors duration-75 misregister-hover" href="#">About</a>
            <a className="font-['Space_Grotesk'] uppercase tracking-tight font-bold text-sm text-stone-900 dark:text-stone-100 hover:text-blue-600 hover:bg-[#FF5CA8] hover:text-white transition-colors duration-75 misregister-hover" href="#">Archive</a>
          </nav>
          <button className="bg-[#fdfbf7] dark:bg-[#1a1a1a] rough-border px-4 py-2 font-caption font-bold uppercase tracking-tight hover:bg-[#FF5CA8] hover:text-white transition-colors duration-75 misregister-hover hidden md:block">
            Shop Now
          </button>
          <button className="md:hidden rough-border p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <main className="max-w-screen-2xl mx-auto px-margin-site">
          {/* Hero Section */}
          <section className="py-stack-lg flex flex-col md:flex-row items-center gap-stack-lg border-b-2 border-on-surface">
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute inset-0 bg-secondary translate-x-2 translate-y-2 rough-border"></div>
              <img alt="Risograph style illustration of a lung paper flower with misaligned cyan and magenta fills and thick black outlines" className="w-full h-auto object-cover aspect-square rough-border relative z-10 multiply-blend grayscale contrast-150 sepia-[.2]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4p_Coj6RcCRC5vC2WfbcUF_gG-LO6plqRLd-DwDaoWuTMOy3FBdPweARjpqX7GeaxZ3MLijcWJArRMnvIzXZgRpmQwhb3BEan2iLpqw-mNAR0npFS639144cxZqTeFgynkYUlKsAHE2-F4nJK6uMYEA0H4coJ-_KwSRpyGOHGQvmngbkrLQs13EL0esnZGJAPtK83bIiT8r7ycNao0ST-xR1xvDr7UeZpyHlg2vogrpcP6osue4rksEw9rNgMXhtVrFGARXeW6O8" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-stack-md">
              <h1 className="font-display-xl text-on-surface leading-none relative">
                <span className="absolute text-secondary translate-x-1 translate-y-1 z-0">Small books. Loud colors.</span>
                <span className="relative z-10 text-primary-container multiply-blend">Small books. Loud colors.</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-lg border-l-4 border-primary-container pl-4">
                An independent publishing house dedicated to the tactile, the unrefined, and the intentionally misregistered. We print analog artifacts for a digital world.
              </p>
              <a className="inline-block bg-primary-container text-on-primary font-caption uppercase border-2 border-on-surface py-3 px-6 w-max misregister-hover relative group" href="#">
                <span className="relative z-10 font-bold tracking-widest">Shop the catalogue</span>
              </a>
            </div>
          </section>

          {/* Catalogue Section */}
          <section className="py-stack-lg border-b-2 border-on-surface">
            <div className="flex justify-between items-baseline mb-stack-md border-b-2 border-on-surface pb-2">
              <h2 className="font-headline-lg text-on-surface">Catalogue</h2>
              <a className="font-caption uppercase text-secondary font-bold hover:text-primary-container misregister-hover" href="#">View All -&gt;</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {/* Book 1 */}
              <article className="rough-border bg-surface-container-high p-4 flex flex-col gap-4 group">
                <div className="relative bg-surface-container-lowest aspect-[3/4] overflow-hidden border-b-2 border-on-surface border-dotted pb-4">
                  <img alt="Riso print book cover" className="w-full h-full object-cover multiply-blend grayscale contrast-125 sepia-[.3] group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSzWuqjoFK60USvSBC15TaMSj6oGQF85AQFLk23sJm7wvpM_pUB0r8l5LiHCvdWyozfO51tyAxGB6z9jC1UlJEavqjyAHGF5Wpy4pbLRBeH1m7HtgIPIIyhN76kIZsUGxO81uB-jg7y8MFpNA6cxGEFVxaimsU2td0dfmFGv1YPbpBdSbrqAkoNU_ywdWS8Nk3hwHniGvRLUaAW7h1W-6U8kYG3IPrq1Eep1ofBiqUnGhzuRrXPPcd6qW0vYWSWgmIUKwPOdtWA-8" />
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <span className="font-label-sm uppercase bg-primary text-on-primary w-max px-2 py-1 mb-2">Poetry</span>
                  <h3 className="font-headline-md text-on-surface leading-tight">The Rust Manual</h3>
                  <p className="font-caption text-on-surface-variant">by E.. Vance</p>
                </div>
              </article>
              {/* Book 2 */}
              <article className="rough-border bg-surface-container-high p-4 flex flex-col gap-4 group">
                <div className="relative bg-surface-container-lowest aspect-[3/4] overflow-hidden border-b-2 border-on-surface border-dotted pb-4">
                  <img alt="Riso print book cover" className="w-full h-full object-cover multiply-blend grayscale contrast-125 sepia-[.3] group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT1DS2t8ahhrRhbzcr-2ZrOeRcs_8S11RLdOrc7ukShVGrXtkqfrr6OjVz-pXInTUphKqKJC0qLhhQFpWLoyG9dFJ6H_4rAkeMBSRl_P8HkvFml_5Bjmgxiurj4faNMpH4BjlL2vf2P5KOzi4mnjlUZPaRFZc-BLHarHr7EjieMzJM3MJexLjH80WNEdpWZbQw3cwR5c1PPkbDjNEtgu4WsYHbN6RVK-vi0qP2y8h47FyHii2hZJ6LvprvWU8BOW72JEHgi1rLQOY" />
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <span className="font-label-sm uppercase bg-secondary text-on-secondary w-max px-2 py-1 mb-2">Fiction</span>
                  <h3 className="font-headline-md text-on-surface leading-tight">Concrete Sleep</h3>
                  <p className="font-caption text-on-surface-variant">by Sarah Jin</p>
                </div>
              </article>
              {/* Book 3 */}
              <article className="rough-border bg-surface-container-high p-4 flex flex-col gap-4 group">
                <div className="relative bg-surface-container-lowest aspect-[3/4] overflow-hidden border-b-2 border-on-surface border-dotted pb-4">
                  <img alt="Riso print book cover" className="w-full h-full object-cover multiply-blend grayscale contrast-125 sepia-[.3] group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAdSS5ZEDiKFl6rttcHGComi-Ca1B-qwbSV40wgaODKvk9oiO7wSBISv1juAxzaFJOiFBIlC4g5BMFYiH2KWWCjNoK95swXdqNb4AuMfJh5j1LUidDR9rd7GPxsNf_vYSvMVY0JnWSfmCjSTGMufVHOHrEd8LGtXwy5KDOPHByaYmz2Qhrzq6jwd4VuZVl48qvrhm5hLCBl_oS7slMhekvsMB32Vp3PlAgvsz-eg0lLjBAdk8iax6qXfeEGPUkWQspEJfxFFgR5Qc" />
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <span className="font-label-sm uppercase bg-surface-tint text-on-primary w-max px-2 py-1 mb-2">Zine</span>
                  <h3 className="font-headline-md text-on-surface leading-tight">Ink Bleed Vol 4.</h3>
                  <p className="font-caption text-on-surface-variant">Anthology</p>
                </div>
              </article>
            </div>
          </section>

          {/* About Section */}
          <section className="py-stack-lg border-b-2 border-on-surface grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-5 relative group">
              <div className="absolute inset-0 bg-primary-container translate-x-[-4px] translate-y-[4px] rough-border"></div>
              <img alt="Portrait of editor" className="w-full h-full object-cover aspect-[4/5] rough-border relative z-10 multiply-blend grayscale contrast-150" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQJDBD0mXiblSnn4Q6aFqUsO7H9g8t1AQ4D497hLaH7ulEqdkU7qKDa5wMqu3wkPbevFxRYhrh273y1rg586VzKlpXkhqQRGP7J9y9Ix2hIkFkCQIxCRAsyBe3LKHopaE6mpqpXhJngFUVPygtclFg7kka7eJAKcR3MC4ei1M6dJEWWAUXqt_ULRdanJmiDOyUBnBe84ojFVsxfaIuf0mz0ChslejvU7FxpdZJF96pSQ5YRi5N4CMqvslcEqSDZtjqO2HDyUklG-Y" />
            </div>
            <div className="md:col-span-7 flex flex-col justify-center gap-stack-sm md:pl-stack-md">
              <h2 className="font-display-xl text-on-surface">Misregistration is a feature.</h2>
              <div className="font-body-lg text-on-surface-variant flex flex-col gap-4">
                <p>Founded in a damp basement with a refurbished MZ790, Paper Lung Press believes in the physical artifact. We publish works that are too odd for the mainstream, too messy for digital perfection.</p>
                <p>Every book is printed, folded, and bound by hand. If your copy has an ink smudge on page 42, consider it a signature from the machine.</p>
              </div>
            </div>
          </section>

          {/* Process Section — content #1 */}
          <section className="py-stack-lg border-b-2 border-on-surface">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-stack-md border-b-2 border-on-surface pb-2">
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-xs text-secondary font-bold">Detail · 04 — Press Floor</span>
                <h2 className="font-headline-lg text-on-surface">How a print is made.</h2>
              </div>
              <p className="font-body-md italic text-on-surface-variant max-w-md">Four passes, four colors, four chances to misregister. Skip a pass and the page goes silent.</p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {PROCESS_STEPS.map((s) => (
                <li key={s.n} className="rough-border bg-surface-container-low p-stack-md flex flex-col gap-4 misregister-hover relative">
                  <div className="flex items-baseline gap-4">
                    <span className={`font-display-xl text-[120px] leading-none ${s.nColor} riso-shift`}>{s.n}</span>
                    <span className={`font-['Space_Grotesk'] uppercase tracking-widest text-xs ${s.phaseColor} border-l-2 border-on-surface pl-3 self-end pb-3`}>{s.phase}</span>
                  </div>
                  <h3 className="font-['Newsreader'] italic text-3xl text-on-surface leading-tight">{s.title}</h3>
                  <p className="font-['Space_Grotesk'] text-sm tracking-wide text-on-surface-variant leading-relaxed">{s.body}</p>
                  <div className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] text-on-surface-variant border-t-2 border-on-surface border-dotted pt-3">{s.meta}</div>
                </li>
              ))}
            </ol>
          </section>
        </main>

        {/* Manifesto Section — content #2 (NOVEL #6 image-as-bg under content card, full-bleed) */}
        <section className="full-bleed relative py-stack-lg overflow-hidden bg-surface-container-high border-y-2 border-on-surface">
          <div className="absolute inset-0 pointer-events-none">
            <img alt="Risograph press detail with heavy ink residue and brutalist concrete walls" className="w-full h-full object-cover opacity-25 multiply-blend grayscale contrast-150 sepia-[.2]" src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85&auto=format&fit=crop" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(240,232,212,0.6) 0%, rgba(240,232,212,0.85) 50%, rgba(240,232,212,0.6) 100%)" }}></div>
          </div>
          <div className="relative max-w-screen-2xl mx-auto px-margin-site grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-2 flex flex-col gap-2">
              <span className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-xs text-primary-container font-bold">Doctrine</span>
              <span className="font-display-xl text-secondary text-6xl leading-none riso-shift-sm">II</span>
            </div>
            <div className="md:col-span-10">
              <blockquote className="font-['Newsreader'] italic text-on-surface text-4xl md:text-6xl lg:text-[80px] leading-[1.05] relative">
                <span aria-hidden="true" className="absolute left-[-0.5rem] top-[-1rem] text-primary-container text-9xl font-display-xl opacity-30 select-none">&ldquo;</span>
                <span className="relative z-10">We believe ink should be heavy. Paper should be soft. And every <span className="text-primary-container not-italic font-display-xl">misregistration</span> is a <span className="text-secondary not-italic font-display-xl">feature</span>, not a defect.</span>
              </blockquote>
              <div className="mt-stack-md flex flex-col md:flex-row md:items-center justify-between gap-4 border-t-2 border-on-surface border-dashed pt-4">
                <cite className="font-['Space_Grotesk'] not-italic uppercase tracking-widest text-sm text-on-surface-variant">— The Press Floor Manifesto · 2017</cite>
                <span className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[10px] text-on-surface-variant">Stamped · Hand-set · Ink-stained</span>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Ribbon — image strip (NOVEL #11 wide cinema marquee) */}
        <section className="py-stack-lg border-b-2 border-on-surface overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-margin-site flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-stack-md border-b-2 border-on-surface pb-2">
            <div className="flex flex-col gap-2">
              <span className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-xs text-primary-container font-bold">Detail · 06 — Catalog Ribbon</span>
              <h2 className="font-headline-lg text-on-surface">Every print, in passing.</h2>
            </div>
            <p className="font-body-md italic text-on-surface-variant max-w-md">Hover the ribbon to pause. Each card is a real edition we still hand-stamp on request.</p>
          </div>
          <div className="overflow-hidden py-3 relative">
            <div className="ribbon-track">
              {ribbonAll.map((p, idx) => (
                <figure key={`r-${idx}`} aria-hidden={idx >= RIBBON_PRINTS.length ? "true" : undefined} className="w-72 flex-shrink-0 rough-border bg-surface-container-lowest p-3 flex flex-col gap-2 misregister-hover">
                  <div className={`aspect-[3/4] overflow-hidden ${p.swatch} relative`}>
                    <img alt={idx >= RIBBON_PRINTS.length ? "" : p.alt} className="w-full h-full object-cover riso-photo" src={p.src} />
                  </div>
                  <figcaption className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[10px] text-on-surface flex justify-between">
                    <span>{p.caption}</span>
                    <span className={p.numColor}>{p.num}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="max-w-screen-2xl mx-auto px-margin-site mt-stack-md flex justify-between items-baseline">
            <span className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[10px] text-on-surface-variant">10 editions · pinned to the press wall · MMXXIV</span>
            <a className="font-caption uppercase text-secondary font-bold hover:text-primary-container misregister-hover" href="#">Browse archive -&gt;</a>
          </div>
        </section>

        {/* FAQ Section — content #3 */}
        <main className="max-w-screen-2xl mx-auto px-margin-site">
          <section className="py-stack-lg border-b-2 border-on-surface grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-4 flex flex-col gap-4">
              <span className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-xs text-secondary font-bold">Detail · 07 — Field Manual</span>
              <h2 className="font-headline-lg text-on-surface">Plain answers, ink-stained.</h2>
              <p className="font-body-md italic text-on-surface-variant">Six questions we get every Tuesday. The answers haven't changed since the basement days.</p>
              <div className="hidden md:flex flex-col gap-2 mt-stack-md border-t-2 border-on-surface border-dashed pt-4">
                <span className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[10px] text-primary-container">Reading room hours</span>
                <span className="font-['Newsreader'] italic text-on-surface text-lg">Wed–Sat · 14h00 → 19h00</span>
                <span className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[10px] text-on-surface-variant">Or by knock · side alley · #4</span>
              </div>
            </div>
            <div className="md:col-span-8 flex flex-col">
              {RISO_FAQ.map((f, i) => (
                <details key={f.i} open={f.open} className={`riso-faq ${i === 0 ? "border-t-2" : ""} border-b-2 border-on-surface py-4 group`}>
                  <summary className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="flex items-baseline gap-4">
                      <span className={`font-['Space_Grotesk'] uppercase tracking-widest text-xs ${f.color}`}>{f.i}</span>
                      <span className="font-['Newsreader'] italic text-2xl md:text-3xl text-on-surface">{f.q}</span>
                    </span>
                    <span className={`riso-plus font-display-xl ${f.color} text-3xl leading-none`}>+</span>
                  </summary>
                  <p className="font-['Space_Grotesk'] text-sm tracking-wide text-on-surface-variant mt-4 leading-relaxed pl-[4.5rem]">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#fdfbf7] dark:bg-[#1a1a1a] docked full-width bottom-0 border-t-4 border-double border-stone-900 w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 mt-stack-lg relative z-10">
          <div className="font-black text-lg text-stone-900 font-headline-md uppercase tracking-tighter">
            Paper Lung Press
          </div>
          <div className="font-['Space_Grotesk'] text-[10px] tracking-widest uppercase text-stone-600 dark:text-stone-400">
            ©2024 PAPER LUNG PRESS. PRINTED VIA MIMEOGRAPH. ALL RIGHTS MISREGISTERED.
          </div>
          <nav className="flex gap-4 font-['Space_Grotesk'] text-[10px] tracking-widest uppercase">
            <a className="text-stone-600 dark:text-stone-400 hover:italic hover:text-[#FF5CA8] transition-all" href="#">Imprint</a>
            <a className="text-stone-600 dark:text-stone-400 hover:italic hover:text-[#FF5CA8] transition-all" href="#">Shipping</a>
            <a className="text-stone-600 dark:text-stone-400 hover:italic hover:text-[#FF5CA8] transition-all" href="#">Privacy</a>
            <a className="text-stone-600 dark:text-stone-400 hover:italic hover:text-[#FF5CA8] transition-all" href="#">Contact</a>
          </nav>
        </footer>
      </div>
    </>
  );
}
