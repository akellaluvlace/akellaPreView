export default function T08AppleStyleHero() {
  const colors = [
    { name: "Forest Green", run: "A.01 · Studio Run",      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA3bq2VvZ3dzP2rpwKBnKEH6nsFRc6_lLbqk6zokh6WlzKn38r6qQNA22ioRpZR1uVDODdGvF53pTbFnIc5WeQY0kNZdCeEGAO6IX-u1Tt9vKDsanikxQhKK7k-uCnOaFk1697nfDdbxJySdbNEIN6EHTQSF6ZLRJTiwcpgUZypWD3Lq2rAjE6R_DFENt64v-1l_T0iJmQwRH1smdKeQsnQSqCk2YC11rvYJ9rxkJDtAN3IdpApXtKZstoIy0uC_cYdHFyaehThsg", cls: "" },
    { name: "Charcoal",     run: "A.02 · House Standard",  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKNhanVH2NTpfq4s__ExrsgOP5uDmBrdi7z7puvhiFn14Fsy1QUcNJoqZyQujgvtVyuFAaZhvjogwrcwr-CcCktalsNlEWXCJSTjEagu2IqV30KClY0QEA6AjMwNTH8bl0VP8VBQom4Q9papj-Dcq6vXkHBOTqn4Fz4plmSuOjfBEpElnUBb7oBuOizsG4E_k_ZmcN8Jhwde6HsELl8mCK4uqXpFH_ceqg3wDOJLHobTb0URPoiFcz4N4UuikIWJ5kPe0FfnWYxT8", cls: "grayscale" },
    { name: "Arctic",       run: "A.03 · Limited · 200",   img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUNQiognOUdvWekNvQzWGorWj3PEd3psWSe4rQKeH_pHgkQ9nTfRQ8K4xU6kg1epdsnPV4L47IWAey-2Np80_9xPpReKtWKCXG3yIyMs2uI3oYns_YjB9TaF8Yi6qZWk0ICVVLOQPqsmqMEgmYKVjb5fMnJSHQD6bOuyjdmO6Ly_u40G9rFc4r9cZR6z-e4b2w3Ma3AOUviW2dnjWjwZGt5uAGjuQ7y_uRKSEuZbRf2Xv2Mo8o-xtk-YB9V8Ob3XKhC29yp-LopgU", cls: "brightness-150 contrast-75" },
  ];

  const explodedParts = [
    { tag: "A", label: "CNC Aluminum Top" },
    { tag: "B", label: "FR-4 Fiberglass Plate" },
    { tag: "C", label: "Hand-lubed Linear Switches" },
    { tag: "D", label: "Three-layer Acoustic Foam" },
  ];

  const studioNotes = [
    { code: "A.01 — Aluminum",  meta: "6061-T6 · 1.8 KG",     body: "CNC-milled from a single block of aircraft-grade aluminum, then sand-blasted and bead-textured at five distinct grit levels for a finish that catches light, not fingerprints." },
    { code: "A.02 — Switches",  meta: "45 G · 24 H BURN-IN",  body: "Custom Monolith Linear stems wound to 45-gram actuation. Each switch is hand-lubed with Krytox 205G0, factory-soldered, and burned-in for a full day before assembly." },
    { code: "A.03 — Voicing",   meta: "22 DB · 380 HZ FLOOR", body: "Three layers of internal foam — Poron, EVA, silicone — engineered to flatten resonance below 380 Hz. Net acoustic signature: 22 dB at typing distance, full-range, room-tone." },
  ];
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif:wght@200;300&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "surface-bright": "#f9f9fb",
                "tertiary": "#000000",
                "surface-container-highest": "#e2e2e4",
                "on-tertiary-fixed-variant": "#454747",
                "inverse-on-surface": "#f0f0f2",
                "surface-dim": "#d9dadc",
                "surface-container-low": "#f3f3f5",
                "primary": "#000000",
                "on-tertiary": "#ffffff",
                "on-primary": "#ffffff",
                "secondary-fixed": "#c9ead7",
                "tertiary-fixed": "#e2e2e2",
                "surface": "#f9f9fb",
                "tertiary-fixed-dim": "#c6c6c7",
                "on-tertiary-container": "#838484",
                "inverse-surface": "#2f3132",
                "primary-fixed": "#e2e2e2",
                "surface-variant": "#e2e2e4",
                "secondary-container": "#c6e7d4",
                "on-tertiary-fixed": "#1a1c1c",
                "outline-variant": "#cfc4c5",
                "on-primary-fixed-variant": "#474747",
                "surface-container-lowest": "#ffffff",
                "surface-container": "#eeeef0",
                "on-error": "#ffffff",
                "on-secondary-fixed": "#022015",
                "secondary": "#476556",
                "on-background": "#1a1c1d",
                "surface-tint": "#5e5e5e",
                "surface-container-high": "#e8e8ea",
                "on-secondary-fixed-variant": "#304d3f",
                "on-secondary": "#ffffff",
                "on-primary-fixed": "#1b1b1b",
                "tertiary-container": "#1a1c1c",
                "secondary-fixed-dim": "#adcebc",
                "outline": "#7e7576",
                "error": "#ba1a1a",
                "on-error-container": "#93000a",
                "primary-container": "#1b1b1b",
                "on-surface-variant": "#4c4546",
                "on-surface": "#1a1c1d",
                "error-container": "#ffdad6",
                "on-secondary-container": "#4b695a",
                "inverse-primary": "#c6c6c6",
                "on-primary-container": "#848484",
                "primary-fixed-dim": "#c6c6c6",
                "background": "#f9f9fb"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "stack-sm": "12px", "section-gap": "160px", "container-max": "1440px", "margin-edge": "80px", "unit": "8px", "gutter": "32px", "stack-md": "24px" },
              fontFamily: {
                "body-lg": ["Inter", "sans-serif"], "caption": ["Inter", "sans-serif"],
                "headline-lg": ["Noto Serif", "serif"], "body-md": ["Inter", "sans-serif"],
                "headline-md": ["Noto Serif", "serif"], "label-caps": ["Inter", "sans-serif"],
                "display-hero": ["Noto Serif", "serif"]
              },
              fontSize: {
                "body-lg": ["clamp(1rem, 0.5vw + 0.875rem, 1.125rem)", { lineHeight: "1.6", letterSpacing: "-0.01em", fontWeight: "400" }],
                "caption": ["clamp(0.75rem, 0.5vw + 0.5rem, 0.8125rem)", { lineHeight: "1.4", fontWeight: "400" }],
                "headline-lg": ["clamp(1.75rem, 4vw + 0.75rem, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" }],
                "body-md": ["clamp(0.875rem, 0.5vw + 0.75rem, 1rem)", { lineHeight: "1.5", fontWeight: "400" }],
                "headline-md": ["clamp(1.125rem, 3vw + 0.375rem, 2.5rem)", { lineHeight: "1.2", fontWeight: "300" }],
                "label-caps": ["clamp(0.625rem, 0.5vw + 0.5rem, 0.75rem)", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
                "display-hero": ["clamp(2.75rem, 6vw + 1.25rem, 7.5rem)", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "200" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto !important; }
          *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      ` }} />

      <div className="bg-surface-container-lowest text-primary font-body-lg antialiased selection:bg-secondary selection:text-on-secondary">

        <header className="fixed top-0 w-full z-[100] flex justify-between items-center gap-3 px-5 py-5 sm:px-8 sm:py-6 md:px-16 md:py-8 pointer-events-none">
          <div className="text-tertiary font-headline-md tracking-[0.2em] uppercase pointer-events-auto cursor-default">
            Monolith
          </div>
          <a href="#preorder" className="bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 md:px-8 md:py-4 uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary active:scale-[0.98] pointer-events-auto shadow-sm inline-flex items-center justify-center">
            Pre-order
          </a>
        </header>

        <main>
          {/* HERO :: image + heading composed as one full-bleed frame */}
          <section className="relative w-full min-h-[100dvh] flex flex-col bg-surface-container-lowest overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low pointer-events-none" aria-hidden="true"></div>
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" aria-hidden="true"
                 style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.55) 1px, transparent 1px)", backgroundSize: "40px 40px", maskImage: "radial-gradient(ellipse 80% 70% at center, black 30%, transparent 90%)", WebkitMaskImage: "radial-gradient(ellipse 80% 70% at center, black 30%, transparent 90%)" }}></div>

            <div className="relative z-20 px-5 sm:px-8 md:px-margin-edge pt-20 sm:pt-24 md:pt-28">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                  <span className="w-6 h-px bg-tertiary/30"></span>
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-surface-tint tabular-nums">Est. Ship · Q3 2026</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="w-8 h-px bg-tertiary/30"></span>
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.4em] text-surface-tint tabular-nums whitespace-nowrap">Monolith Series 01 · 65% Mechanical</span>
                  <span className="w-8 h-px bg-tertiary/30"></span>
                </div>
                <div className="hidden md:flex items-center gap-2 justify-end">
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-surface-tint">Hand-finished · Three colorways</span>
                  <span className="w-6 h-px bg-tertiary/30"></span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-8 md:px-margin-edge pt-4 pb-2 md:pb-4">
              <h1 className="font-display-hero text-display-hero text-tertiary text-balance text-center max-w-6xl mb-3 sm:mb-4">
                Type like you mean it.
              </h1>
              <p className="font-headline-md text-tertiary/65 text-balance text-center max-w-2xl mb-4 sm:mb-5 md:mb-6 italic font-light">
                Forged from a single aluminum billet. Tuned, voiced and packed by hand in Lisbon.
              </p>

              <div className="relative w-[80%] mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[55%] bg-tertiary/[0.06] rounded-[50%] blur-3xl pointer-events-none" aria-hidden="true"></div>
                <img src="https://res.cloudinary.com/dsa31toc5/image/upload/v1777543854/Untitled_wsgn3i.png"
                     alt="Studio shot of the Monolith mechanical keyboard on a transparent background"
                     width="1600" height="1066" fetchPriority="high"
                     className="relative w-full h-auto object-contain max-h-[78vh] sm:max-h-[84vh] drop-shadow-[0_30px_60px_rgba(0,0,0,0.22)]" />
              </div>
            </div>
          </section>

          {/* TRUSTED BY — desk-tool brands the typist already owns */}
          <section className="w-full bg-surface-container-lowest border-y border-tertiary/10 py-12 sm:py-16">
            <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-margin-edge text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-on-surface-variant/70 mb-8">— Pairs cleanly with —</p>
              <ul role="list" className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-x-8 gap-y-9 items-center justify-items-center">
                {[
                  { slug: "apple", name: "Apple" },
                  { slug: "github", name: "GitHub" },
                  { slug: "vercel", name: "Vercel" },
                  { slug: "figma", name: "Figma" },
                  { slug: "framer", name: "Framer" },
                  { slug: "linear", name: "Linear" },
                  { slug: "notion", name: "Notion" },
                  { slug: "razer", name: "Razer" },
                  { slug: "stripe", name: "Stripe" },
                ].map(b => (
                  <li key={b.slug} className="flex flex-col items-center gap-1.5">
                    <img src={`https://cdn.simpleicons.org/${b.slug}/d4d4d4`} alt={b.name} className="h-6 w-auto" loading="lazy" decoding="async" width="24" height="24" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/60">{b.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* DETAIL · 02 — Material */}
          <section id="detail" className="h-[80vh] min-h-[500px] w-full relative overflow-hidden bg-tertiary flex items-end sm:h-screen scroll-mt-0">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz3g8SxRhMTNiD8RIiE86pa6JX5oiyvy_QkwvrbMATzGlh-yn6K-PuR6RzSa51G6Wk6xB6tqYgUZSbMNT99HYFLVDTk6ZAlb_rgM6jqHqwRbimVsuL6EnUm9SLMUpQNT1ooB6e-wHMNaGIugswF-LuJYjgjnrcN0i2J6T5b6VrpfJQtyIdNpcOCB8WVhT8XzQFpz6FskUAe0JLLOwLRMItRdE0Y56E_Eh-aGx6GLVAoYJ5HJ3xl2W7G-J47fHZwEPpame7p6J-Lqc" alt="Macro keycap" width="1920" height="1080" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute top-8 left-5 sm:left-8 md:top-12 md:left-16 z-10 flex items-center gap-3">
              <span className="w-8 h-px bg-on-tertiary/40"></span>
              <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-on-tertiary/70 tabular-nums">Detail · 02 — Material</span>
            </div>
            <div className="relative z-10 w-full max-w-container-max mx-auto px-5 pb-12 sm:px-8 sm:pb-16 md:px-16 md:pb-24">
              <p className="font-headline-lg text-headline-lg text-on-tertiary max-w-3xl text-balance">
                Double-shot PBT. Formulated for permanence. Zero shine, infinite friction.
              </p>
            </div>
          </section>

          {/* DETAIL · 03 — Internals */}
          <section className="min-h-[80vh] py-20 flex flex-col items-center justify-center bg-surface-container-lowest sm:min-h-screen sm:py-28 md:py-section-gap relative overflow-hidden">
            <div className="w-full max-w-container-max mx-auto px-5 sm:px-8 md:px-margin-edge mb-10 sm:mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-tertiary/40"></span>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-surface-tint tabular-nums">Detail · 03 — Internals</span>
              </div>
              <p className="font-headline-md text-tertiary/70 italic font-light max-w-md text-balance md:text-right">Twenty-two parts. One assembly. No glue.</p>
            </div>

            <div className="w-full max-w-6xl relative z-10 px-5 sm:px-8 md:px-gutter">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvtXYjpdNncENyYnjnH7KMV2pX3y-o4ONU7XkOKqaumHc4groHEPXOh9xDlt--ld5oV1y6U0KkerDvsYqgMpwtg9OvMRkVZC4t0lpAgleI2NCLqFW0HIVk-VvoAJsicjnJVvtyulhg87G2Ye8k4VeebDw_7_sXYEhBalMzxGCdEs56KNzP_HVYlMVK9HPo330yFDd9Bxj0GooFGH0xdVjrkgiWZwN9lK2ZjXXTY8WrOzTht0tMgnJkME7Ir1YF9pUKIKbfN3p1fow" alt="Exploded view" width="1440" height="1000" loading="lazy" decoding="async" className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xl" />
            </div>

            <div className="w-full max-w-6xl mt-10 sm:mt-14 px-5 sm:px-8 md:px-gutter">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 border-t border-tertiary/15 pt-6">
                {explodedParts.map((p) => (
                  <div key={p.tag}>
                    <span className="block font-label-caps text-label-caps uppercase tracking-[0.25em] text-surface-tint tabular-nums mb-1.5">{p.tag}</span>
                    <span className="block font-body-md text-body-md text-tertiary/85 leading-snug">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DETAIL · 04 — Studio (NEW editorial section) */}
          <section className="bg-surface py-20 sm:py-28 md:py-section-gap px-5 sm:px-8 md:px-margin-edge border-t border-tertiary/10">
            <div className="max-w-container-max mx-auto grid grid-cols-12 gap-6 md:gap-gutter">
              <div className="col-span-12 md:col-span-5 flex flex-col">
                <div className="flex items-center gap-3 mb-stack-md">
                  <span className="w-8 h-px bg-tertiary/40"></span>
                  <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-surface-tint tabular-nums">Detail · 04 — Studio</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-tertiary text-balance leading-[1.05] mb-stack-md">
                  Cut from one billet.<br />Finished in one studio.
                </h2>
                <p className="font-headline-md text-tertiary/65 italic font-light max-w-md text-balance leading-snug">
                  Each Monolith leaves Lisbon with a hand-stamped serial and a single signature on the underside.
                </p>
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-6 flex flex-col gap-10 sm:gap-12 mt-4 md:mt-1">
                {studioNotes.map((n) => (
                  <div key={n.code}>
                    <div className="flex items-baseline justify-between gap-3 mb-3 border-b border-tertiary/15 pb-2">
                      <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-surface-tint tabular-nums">{n.code}</span>
                      <span className="font-label-caps text-label-caps uppercase tracking-[0.25em] text-surface-tint/70 tabular-nums">{n.meta}</span>
                    </div>
                    <p className="font-body-md text-body-md text-tertiary/80 leading-relaxed text-pretty max-w-prose">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PREMIUM 2x2 — Why We Built It on faint photo bg */}
          <section className="relative w-full bg-surface-container-lowest overflow-hidden py-20 sm:py-28 md:py-section-gap border-t border-tertiary/10">
            <div className="absolute inset-0 -z-10">
              <img src="https://images.unsplash.com/photo-1542435503-956c469947f6?w=1920&q=80&auto=format&fit=crop" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-[0.06] grayscale" loading="lazy" />
              <div className="absolute inset-0 bg-surface-container-lowest/85"></div>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 25%, rgba(10,10,10,0.85) 90%)" }}></div>
            </div>

            <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-margin-edge">
              <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
                <span className="font-label-caps text-label-caps uppercase tracking-[0.4em] text-surface-tint">— § 04 / Doctrine</span>
                <h2 className="font-display-lg text-3xl sm:text-4xl md:text-5xl text-on-surface mt-4 leading-[1.05] tracking-tight">Four reasons it weighs more than it should.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-5 leading-relaxed">Every gram carries an argument. Each card below is one of them — printed on the underside of the chassis, not the box.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                {[
                  { id: "D · 01", icon: "precision_manufacturing", title: "CNC, not cast.", body: "Milled from a single block of 6061-T6 aluminum on a five-axis machine — never die-cast, never injection-shelled. The case rings like a tuning fork; the typing bed lies dead-flat to ±0.05 mm.", left: "Lisbon · Tagus floor", right: "5-axis · 14 hr" },
                  { id: "D · 02", icon: "graphic_eq", title: "Voiced, not silent.", body: "Three internal foam layers — Poron, EVA, silicone — tuned by an acoustic engineer with credits at Bowers & Wilkins. Resonance flat below 380 Hz, full-range room-tone above. Sounds like wood, not plastic.", left: "22 dB · typing distance", right: "B&W consult · 7 wk" },
                  { id: "D · 03", icon: "tune", title: "Hand-lubed, hand-soldered.", body: "Every switch dipped in Krytox 205G0 by a human hand. Every contact through-hole soldered, never hot-swap. The chassis is closed once, sealed for the life of the board — quieter, tighter, cheaper to repair.", left: "104 keys · 24 hr burn-in", right: "Krytox 205G0" },
                  { id: "D · 04", icon: "history_edu", title: "Numbered, signed, kept.", body: "Each Monolith carries a hand-stamped serial and the assembler's signature etched on the underside. Twelve hundred boards a year — never more. Replacements honoured for fifteen years; the schematic ships with each unit.", left: "Edition · 1,200 / yr", right: "Warranty · 15 yrs" },
                ].map(d => (
                  <article key={d.id} className="group relative bg-surface-container/85 backdrop-blur-md border border-tertiary/15 p-7 md:p-9 rounded-sm hover:border-surface-tint/40 transition-colors overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-surface-tint/[0.04] blur-3xl pointer-events-none"></div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-sm border border-surface-tint/40 bg-surface-tint/5 flex items-center justify-center text-surface-tint">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>{d.icon}</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-on-surface-variant/70 tabular-nums">{d.id}</span>
                    </div>
                    <h3 className="font-display-md text-2xl md:text-3xl text-on-surface mb-3 tracking-tight leading-[1.05]">{d.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">{d.body}</p>
                    <div className="flex items-baseline justify-between border-t border-tertiary/15 pt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/70">
                      <span>{d.left}</span>
                      <span className="text-surface-tint">{d.right}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* DETAIL · 05 — On the Desk (lifestyle) */}
          <section className="h-screen w-full relative overflow-hidden">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1AVCEEgFV3TxXmiDyyIIsH_pbtj9swIP2UeFxPVkYcvpgsURxyS0jsqbYQfopXA3zkIreVPNtAPE3I6XqoekXaPXj4SbQNrXJtFbon0WhRnbFEhLs_huYQXpmzteKZwUoLxpKH1dj-xiqumMhH22kETXA2Caksac64-eMfJrJRCLUyG9wczMX1rfGuqpKwDEWpqB3DG7OiPUZVq1lH2_5eOScX3lDlQUiC5PikdHVknQTq5jO6pAlpkU5RB3lQCjAq1JPIMgsMQI" alt="Desk setup" width="1920" height="1080" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-tertiary/55 via-tertiary/15 to-transparent pointer-events-none" aria-hidden="true"></div>
            <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-12 sm:px-8 sm:pb-16 md:px-margin-edge md:pb-20">
              <div className="max-w-container-max mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-px bg-on-tertiary/40"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-on-tertiary/75 tabular-nums">Detail · 05 — On the Desk</span>
                  </div>
                  <p className="font-headline-md text-on-tertiary text-balance max-w-2xl italic font-light">From morning correspondence to release day. The same surface. The same sound.</p>
                </div>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-on-tertiary/65 tabular-nums shrink-0">Lisbon · April</span>
              </div>
            </div>
          </section>

          {/* SPEC SHEET · 06 */}
          <section className="py-16 px-5 bg-surface-container-lowest flex flex-col items-center sm:py-24 sm:px-8 md:py-section-gap md:px-gutter">
            <div className="w-full max-w-4xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="w-8 h-px bg-tertiary/40"></span>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-surface-tint tabular-nums">Spec Sheet · 06</span>
                <span className="w-8 h-px bg-tertiary/40"></span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-tertiary mb-10 text-center text-balance sm:mb-16 md:mb-24">
                Specifications
              </h2>
              <dl className="flex flex-col w-full border-t border-tertiary">
                {[
                  ["Layout", "65% ANSI / ISO"],
                  ["Connectivity", "Bluetooth 5.1 / USB-C"],
                  ["Switches", "Monolith Linear (Custom)"],
                  ["Battery", "4000mAh (Up to 2 months)"],
                  ["Weight", "1.8kg (Machined Aluminum)"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-5 gap-2 sm:gap-4 border-b border-tertiary md:py-8">
                    <dt className="font-label-caps text-label-caps uppercase tracking-widest text-surface-tint">{k}</dt>
                    <dd className="font-body-md text-body-md text-tertiary sm:text-right tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* ORDER · 07 — Pre-order */}
          <section id="preorder" className="min-h-[80vh] py-16 px-5 bg-surface-bright flex flex-col items-center justify-center sm:min-h-screen sm:py-24 sm:px-8 md:py-section-gap md:px-gutter scroll-mt-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-8 h-px bg-tertiary/40"></span>
              <span className="font-label-caps text-label-caps uppercase tracking-[0.3em] text-surface-tint tabular-nums">Order · 07 — Pre-order</span>
              <span className="w-8 h-px bg-tertiary/40"></span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-tertiary mb-4 text-center text-balance">
              Secure Yours
            </h2>
            <p className="font-headline-md text-tertiary/65 italic font-light text-center max-w-xl mb-10 sm:mb-16 md:mb-20 text-balance">
              Three colorways, each numbered. Shipping Q3 2026 in the order received.
            </p>
            <ul className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 sm:gap-12 sm:mb-16 md:gap-16 md:mb-24">
              {colors.map(c => (
                <li key={c.name} className="flex flex-col items-center group cursor-default">
                  <div className="w-full aspect-square bg-surface-container-lowest flex items-center justify-center mb-6 sm:mb-8 p-8 border border-surface-dim overflow-hidden rounded-sm transition-colors duration-300 group-hover:border-outline-variant">
                    <img src={c.img} alt={c.name} width="800" height="800" loading="lazy" decoding="async" className={`w-full h-full object-contain mix-blend-multiply ${c.cls} transition-transform duration-700 ease-out group-hover:scale-105`} />
                  </div>
                  <h3 className="font-body-lg text-body-lg text-tertiary mb-1.5">{c.name}</h3>
                  <span className="font-label-caps text-label-caps text-surface-tint tracking-widest uppercase tabular-nums mb-3">{c.run}</span>
                  <span className="font-body-md text-body-md text-tertiary tabular-nums">$229</span>
                </li>
              ))}
            </ul>
            <button type="button" className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 sm:px-12 sm:py-5 md:px-16 md:py-6 uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary active:scale-[0.98] shadow-sm inline-flex items-center justify-center">
              Pre-order Now
            </button>
          </section>
        </main>

        <footer className="w-full border-t border-surface-dim bg-surface-container-lowest flex flex-col justify-between items-center px-5 py-10 gap-8 sm:px-8 sm:py-14 md:flex-row md:px-16 md:py-20 md:gap-0">
          <div className="font-headline-md text-headline-md text-tertiary tracking-[0.2em] uppercase">
            Monolith
          </div>
          <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-x-8 md:gap-12">
            {["Privacy", "Terms", "Support", "Press"].map(l => (
              <a key={l} href="#" className="font-label-caps text-label-caps text-surface-tint hover:text-tertiary transition-colors uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-tertiary rounded-sm px-2 py-1">{l}</a>
            ))}
          </nav>
          <div className="font-label-caps text-label-caps text-surface-tint tracking-widest uppercase text-center text-balance md:text-right">
            © 2024 Monolith Industries.<br className="sm:hidden" /> Built for Permanence.
          </div>
        </footer>
      </div>
    </>
  );
}
