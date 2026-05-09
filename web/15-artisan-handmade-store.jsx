export default function T15ArtisanHandmadeStore() {
  const products = [
    { num: "01", title: "Oatmeal Morning Mug", price: "£42", aspect: "aspect-[3/4]", offset: "", alt: "Textured ceramic mug", dataAlt: "Minimalist, textured, unglazed ceramic mug sitting on a rough wooden table, soft window lighting, documentary aesthetic, moody.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQU0AiqUX-CFjzp2YFIBE6xkhqhCkzcSS4_BEUNhMXi6fbEzagMEOcZUJTa6FhlmEN9QG7wJBpnekuiqcqidXY5Ad9WwF0htolAN_LSE92hyL7o0iCc8VaS63kqhVvIAkAgSzOPKprf0gYSIGBBPtt8d3weDso_DUxLhXR7ZZnz31tm-A3wuvl-caC4oY-1Y33adQo26NmXy6gCdjm5NzDMhTVHg2Q2T9IeT06VfLzKYQTSz6S6nx_uIxw1I5_NU59Ii7NjWOVWQ" },
    { num: "02", title: "Iron Ash Deep Bowl", price: "£65", aspect: "aspect-[4/5]", offset: "mt-8", alt: "Ceramic bowl", dataAlt: "Wide, shallow ceramic bowl with a speckled iron glaze, resting on linen cloth, overhead shot, muted earthy tones.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtR3e_TACqNs4Eyd3Gca69s9mXhOjYjLiuufbonutaHqjUTGeCrRoHOouJXC7eaXd298TB8M3dCJ0GN3B8omLnRo_DSLp73Ism5U8uPt7taO270dovka-MLJ0AtFtf0Nlan-BvQUTd7qORCnxWaTx8P1MWOGBtZCCbkFUgZS4Griq3ylS9Z38tE8K21V4ZTcmODm4b4skxDlj3lX_W4rRb-dBVsSv8rFdMFphf2elkYEnDTJm3XGAgeWiRlHJ55TXK5TdBiyjqBA" },
    { num: "03", title: "Chalk Cylinder Vase", price: "£110", aspect: "aspect-[1/1]", offset: "", alt: "Ceramic vase", dataAlt: "Tall, cylindrical ceramic vase with a chalky matte finish, casting a long shadow against a plaster wall, minimalist.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfTji5y2Z5YHhXi5h14WJkAloqC6oyZ9VBcLEBPySt7M3-dVNTH7QX7pDMQSCkvHameqvc75cO_W_7cQJXDrKjqS1c0ZwcV8Qt_1snyFLg6yYpBM_-LCGnMdOBSfSaE8mU02ukLg4EgSp7vkOoKJROWaUhztki-cxuyfWsU7jaRxrd1qMoGlb9nyVUbepVBBU1v1WZVwGAy2icKf_2RgaAneP_uYfxkXjrobsMmP0lR569wnf710ea3Tx40EEJA4WBs9OvNhUY2g" },
    { num: "04", title: "Irregular Dinner Plate", price: "£55", aspect: "aspect-[3/4]", offset: "-mt-12", alt: "Stack of plates", dataAlt: "A stack of three handmade ceramic dinner plates with irregular wavy edges, dark clay body showing through thin white glaze.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvbuW3AKV--PTRAzFleYniGNe78zBBvOsYPnAj8OyNW-S5lD69fZ-_aPzYYC69MvcOy4O-T1KGtRgVULwCqOWkaF0CfD37scuxYYWgfsWap2zSMOSkYlIudX4VgTj6rl1d9fs5kAfKtNf5akrEsZ2FzvTJe1WRAcVw3UKEzQMx3bJmUobjbCENu1SGfpcA-e_wmEJOgPLx0-v9pikSJoRTuGOp6VJYJ_Mg9m24k_R1kyVqc6S4iAPZILHHBNWcK-0kbs3AfTT0gw" }
  ];

  const navLinks = [
    { label: "Journal", active: true },
    { label: "Process" },
    { label: "Archive" },
    { label: "Stockists" }
  ];

  const processSteps = [
    { label: "01. Earth", offset: "", alt: "Raw clay", dataAlt: "Macro shot of raw, damp terracotta clay on a wooden workboard, showing granular texture and moisture.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmUspjxmTMV5MdYG_6qewROgcw0UJFUZVGEA8cAn1-22jeqdXmLxjy3yzaMDsqbgDims5SYaUm5otW1sBLOubXHzVsXdNsG57yH1ECMlfx7i6w0VQoa1brtCPEOKoPb0QjcMhkZJm8SqFFLaLT9AXb74-o7Ov5nvt_FZcAqWHHYOt9gDvzXflyP9Wn40zoy5jrQyUoOTbK0sDUAeANUvEPGZ5K_ybMLhHUfzjRoCfoVqObPw9hrlF_BJJVIa09agcdfrWgzZhLVw" },
    { label: "02. Form", offset: "mt-8", alt: "Shaped clay", dataAlt: "Hands gently pulling up walls of a clay vessel on a spinning wheel, dynamic blur on the edges, gritty texture.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1_HdLLAZDuTSnZHhBuN2K9xdixVDRPSkS4DwkRLK5yPCpp1bTUAon9soDBaFedH6-tiOpFIg3Qwi9bRwN96NYqRlwBf9rlG2HMrPBTVYdSoXiuGQbgbV1Gl4jZS14YasYDsZ6WPBBku2McuoZ81TEeQ-K_3fMHVOIVjezhGAaykkxLylkS2Efp881_dI0hheMZnGjFUqzLrheAIlhDvEIr0Ugx7OvN_myYxtuCKrH4jqslpoabBrxQm38hCOe69ELhStBgM5Q7Q" },
    { label: "03. Surface", offset: "", alt: "Glazed clay", dataAlt: "Close up of a ceramic piece being dipped into a bucket of opaque white glaze, drips forming, messy studio background.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1qhar5dXfGMu3hYpY3nY3_ehWveb6I0T8tpc1hF-yxh-ylxrBZ-Jv3Uv4FKjCdRBR2zIXmsn87MwWbGYG9ECX_SXq4gn2qmo61x_2XSoR1elEEKXmdH9OS3O6AXQ8P9_jFcCnVVa2F1pskHdGfM78PjNR5WE6RS4-trpFYtvbxOGGv2Jf7NkBR9Bt6uyZMKQPH17mbGujh5Y2JYgY8KtDdUEJSgql02VdakAaRdwyOYmDbiprtqphLrXIpOy7yCQzFP5HCxuDRA" },
    { label: "04. Fire", offset: "mt-8", alt: "Fired clay", dataAlt: "Glowing orange interior of a hot pottery kiln, stacked with shelves of ceramic wares amidst flames.", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaCKMF0zEgMBfB2xUVTjBtxMWH6-peM8eMrerN444qNknjnuXXBF91Htz-_pPjyAf1MrGSh6O2xbVuczLTEPhlhCaRkpJCvpunNnQQpQ_mbxbhS4cAiVmjLYuynhnJHzaYHPD_NcIw4qlAqRZwWT5sqpl7ahXvVoPU5scLXLh0NQWWCp0yld9MBmgp5RxBNvs4SR_nSmfBifvNPP8mH7kUJI8lQ2kV0ZzcwDqz_yYLOyEzkDAB2R4oQ3xdjcCSXkGUs88C2bLaOw" }
  ];

  const firings = [
    { name: "Wood-fire Anagama Load", date: "Oct 12 - 14" },
    { name: "Soda Firing Unloading", date: "Nov 02" },
    { name: "Winter Stoneware Batch", date: "Dec 05" }
  ];

  const glazes = [
    { name: "Iron Ash", num: "№ 04", spec: "Cone 10 · Reduction", src: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&q=85&auto=format&fit=crop", filter: "grayscale-[10%] sepia-[15%]" },
    { name: "Chalk White", num: "№ 07", spec: "Cone 9 · Matte", src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=600&q=85&auto=format&fit=crop", filter: "grayscale-[10%] sepia-[8%]" },
    { name: "Cardigan Cobalt", num: "№ 12", spec: "Cone 10 · Salt", src: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=85&auto=format&fit=crop", filter: "grayscale-[15%] sepia-[20%]" },
    { name: "Oatmeal", num: "№ 19", spec: "Cone 9 · Speckle", src: "https://images.unsplash.com/photo-1677776401672-ab7d96c7e63b?w=600&q=85&auto=format&fit=crop", filter: "grayscale-[10%] sepia-[12%]" }
  ];

  const studioStats = [
    { value: "23", suffix: "", label: "Glazes in studio ledger" },
    { value: "1280", suffix: "°C", suffixClass: "text-secondary", label: "Peak kiln temperature" },
    { value: "30", suffix: " days", suffixClass: "font-headline-md text-[20px] md:text-[24px] not-italic align-middle", label: "Average vessel cycle" },
    { value: "2014", suffix: "", label: "Studio established" }
  ];

  const pressLogos = [
    { slug: "etsy", name: "Etsy" },
    { slug: "pinterest", name: "Pinterest" },
    { slug: "instagram", name: "Instagram" },
    { slug: "substack", name: "Substack" },
    { slug: "medium", name: "Medium" },
    { slug: "vimeo", name: "Vimeo" },
    { slug: "mailchimp", name: "Mailchimp" },
  ];

  const livedQuadrants = [
    { id: "Plate · 01", label: "— On the shelf", body: "Cuts of oak, ten years of service. The Iron Ash plates outlasted three kettles.", img: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=1200&q=85&auto=format&fit=crop", alt: "Ceramic dishware on a wooden shelf in warm afternoon light" },
    { id: "Plate · 02", label: "— At the wheel", body: "Each form pulled by hand — no jiggers, no slip-cast moulds, no shortcuts.", img: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=1200&q=85&auto=format&fit=crop", alt: "Hands shaping a clay vessel on a pottery wheel" },
    { id: "Plate · 03", label: "— In the home", body: "A cylinder vase on the windowsill — one peony, one stem, all summer.", img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1200&q=85&auto=format&fit=crop", alt: "Plaster wall and ceramic shelving in soft natural light" },
    { id: "Plate · 04", label: "— On the table", body: "An object that earns its place by being held — daily, slowly, without fanfare.", img: "https://images.unsplash.com/photo-1527844817887-9b937993518b?w=1200&q=85&auto=format&fit=crop", alt: "Brass apothecary objects on a dark surface in directional light" },
  ];

  const selectedVessels = [
    { num: "№ 01", title: "Iron Ash Set", meta: "£ 285 · 4 pieces", img: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&q=85&auto=format&fit=crop", alt: "Iron Ash dinner set" },
    { num: "№ 02", title: "Brass & Stoneware Tray", meta: "£ 220 · ed. 12", img: "https://images.unsplash.com/photo-1527844817887-9b937993518b?w=600&q=85&auto=format&fit=crop", alt: "Apothecary still-life" },
    { num: "№ 03", title: "Chalk Cylinder Vase", meta: "£ 110 · matte", img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=600&q=85&auto=format&fit=crop", alt: "Chalk wall and ceramics" },
    { num: "№ 04", title: "Cardigan Cobalt Plates", meta: "£ 160 · 6 pieces", img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=85&auto=format&fit=crop", alt: "Cardigan Cobalt plate stack" },
    { num: "№ 05", title: "Wheel-Thrown Pour", meta: "£ 95 · ea.", img: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=85&auto=format&fit=crop", alt: "Hand-thrown vessel on the wheel" },
    { num: "№ 06", title: "Harvest Table Spread", meta: "£ 540 · full set", img: "https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=600&q=85&auto=format&fit=crop", alt: "Table setting with assorted ceramics" },
  ];

  const careNotes = [
    { num: "Note · 01", icon: "water_drop", title: "Hand-wash · never the dishwasher", body: "Warm water, soft cloth, a beat of mild soap. The matte glazes carry their character because they are porous — the dishwasher will dull them within a season." },
    { num: "Note · 02", icon: "restaurant", title: "Season the matte glaze", body: "Olive oil, a few minutes' rub, a clean cloth. Repeat once a month for the first year. The glaze deepens with each treatment and stops absorbing the morning's coffee." },
    { num: "Note · 03", icon: "build", title: "Repair, don't replace", body: "Send the broken piece back. We re-fire, gold-line in the kintsugi tradition, and return it. Postage one way, no labour charged. The crack becomes the most-watched line in the vessel." },
    { num: "Note · 04", icon: "menu_book", title: "Lifetime ledger", body: "Each vessel is logged in the studio's hand-written register — clay batch, glaze recipe, kiln position, firing curve. Send the foot-stamp number; we'll send back the page." },
  ];

  const footerLinks = ["Privacy", "Terms", "Studio Visit"];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fff8f0", "on-background": "#1f1b11", "surface": "#fff8f0", "on-surface": "#1f1b11", "surface-variant": "#ebe2d0", "on-surface-variant": "#4a463f", "surface-container-low": "#fcf3e1", "primary": "#635e53", "secondary": "#a13f25", "secondary-container": "#ff8666", "on-secondary-container": "#741f07", "tertiary": "#635d5c", "outline": "#7b776e", "outline-variant": "#ccc6bb", "surface-tint": "#635e53"
          },
          spacing: { "container-max": "1280px", "margin": "48px" },
          fontFamily: {
            "headline-md": ["Newsreader", "serif"],
            "label-sm": ["Public Sans", "sans-serif"],
            "body-lg": ["Public Sans", "sans-serif"],
            "headline-lg": ["Newsreader", "serif"],
            "body-md": ["Public Sans", "sans-serif"],
            "display-xl": ["Newsreader", "serif"]
          },
          fontSize: {
            "headline-md": ["2rem", { lineHeight: "1.3", fontWeight: "400" }],
            "label-sm": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
            "body-lg": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
            "headline-lg": ["3rem", { lineHeight: "1.2", fontWeight: "400" }],
            "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
            "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const noiseCss = `
    .noise-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; opacity: 0.4;
    }
  `;

  const noiseStyle = { backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,700;1,6..72,400&family=Public+Sans:wght@400;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: noiseCss }} />

      <div className="bg-background text-on-background antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        <nav className="bg-[#F1E9DB] text-stone-800 font-serif tracking-tight italic sticky top-0 border-b border-stone-300/40 z-50">
          <div className="flex justify-between items-center gap-3 px-4 py-5 w-full max-w-screen-2xl mx-auto sm:px-6 sm:py-6 md:px-12 md:py-8">
            <a className="text-lg font-serif lowercase text-stone-900 hover:text-stone-900 transition-colors duration-300 sm:text-xl md:text-2xl" href="#">Clay Journal</a>
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((l) => (
                <a key={l.label} href="#" className={l.active ? "text-stone-900 border-b border-stone-800 pb-0.5 opacity-70 transition-opacity" : "text-stone-500 hover:text-stone-900 transition-colors duration-300"}>{l.label}</a>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              <button aria-label="Shopping Bag" className="hover:text-stone-900 transition-colors duration-300">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
              </button>
            </div>
          </div>
        </nav>

        <main>
          <section className="relative min-h-[86vh] md:min-h-[92vh] w-full bg-[#1f1b11] overflow-hidden group">
            <img alt="Grainy, warm photograph of clay-stained hands shaping a bowl on a pottery wheel" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfOdZbO5yT-TjINQT3kOlgwOlA0i2mgb-L5QXLSVeMMadz9Lf6RpSOeOcLKRTpBDsEG6-tyaeWVxFIeypC62MHKC2mOXkhNs-Q_Ve48heSRlwGTm-V5nkE3EQ9r-b84vra0kPIo3R-4pyVg1fG48nXFitT-k2W4jOnrtQSohOhj9QqVEO1LuUcTxAqnGcLzMG2u7fMDrqKDBb3Gm1KTpAQfVFqPU5QdSrK0LCyIMb93Rhe316XayJ7C6c2zn0T8hmOiX5emIUW-A" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-900/15 to-stone-950/85"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/30"></div>
            <div className="noise-overlay opacity-20" style={noiseStyle}></div>

            <div className="absolute top-6 left-4 right-4 flex justify-between items-center text-stone-200/80 sm:top-8 sm:left-8 sm:right-8 md:top-12 md:left-12 md:right-12">
              <span className="font-label-sm text-label-sm uppercase tracking-[0.3em] hidden sm:inline-block">Volume III · MMXXIV</span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.3em] hidden md:inline-block">Aberystwyth · 52°N</span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.3em]">Hand-thrown · 12 pieces</span>
            </div>

            <div className="absolute bottom-8 left-4 right-4 flex flex-col items-start gap-8 sm:bottom-12 sm:left-8 sm:right-8 md:bottom-16 md:left-12 md:right-12 md:flex-row md:justify-between md:items-end md:gap-12">
              <div className="max-w-3xl">
                <span className="inline-block w-12 h-px bg-stone-200/70 mb-6"></span>
                <h1 className="font-display-xl text-[44px] leading-[0.95] text-stone-50 mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] sm:text-[64px] md:text-[88px] lg:text-[104px] tracking-tight">Clay Journal</h1>
                <p className="font-headline-md italic text-stone-100 text-[20px] sm:text-[26px] md:text-[30px] leading-tight max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">Handmade in Aberystwyth, on the rugged Welsh coast — fired in small, considered batches.</p>
              </div>
              <div className="flex flex-col items-start gap-3 shrink-0">
                <a className="inline-flex items-center gap-3 bg-stone-50 text-stone-900 font-label-sm text-label-sm uppercase tracking-widest px-7 py-4 hover:bg-stone-200 transition-all duration-300 group/cta" href="#">
                  <span>See the collection</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover/cta:translate-x-1" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </a>
                <p className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-stone-300/80 max-w-xs">Twelve new vessels · Drops 02 Nov · Limited release</p>
              </div>
            </div>
          </section>

          <section className="px-4 py-16 max-w-4xl mx-auto text-center border-b border-outline-variant sm:px-6 sm:py-20 md:px-margin md:py-24">
            <p className="font-headline-md text-[22px] leading-relaxed text-on-surface text-balance sm:text-[26px] md:text-headline-md">
              Our approach to ceramics is rooted in the narrative of creation over the immediacy of transaction. Every piece is a testament to slow commerce—formed by hands, marked by the kiln, and intended to become part of your daily ritual. The grit, the texture, and the imperfections are the story.
            </p>
          </section>

          {/* Press & Stocked-At — real brand logos */}
          <section className="px-4 py-14 max-w-container-max mx-auto text-center sm:px-6 sm:py-16 md:px-margin md:py-20 border-b border-outline-variant">
            <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-on-surface-variant mb-2">— Featured · Stocked · Followed</p>
            <p className="font-headline-md italic text-[20px] sm:text-[22px] md:text-[24px] leading-snug text-on-surface mb-10 max-w-xl mx-auto">"Quietly considered." — and other notes from the press.</p>
            <ul role="list" className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-9 items-center justify-items-center max-w-4xl mx-auto">
              {pressLogos.map(b => (
                <li key={b.slug} className="flex flex-col items-center gap-2">
                  <img src={`https://cdn.simpleicons.org/${b.slug}/40484d`} alt={b.name} className="h-7 w-auto" loading="lazy" decoding="async" width="28" height="28" />
                  <span className="font-label-sm text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">{b.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="max-w-container-max mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-12 gap-6 sm:px-6 sm:py-20 md:px-margin md:py-24">
            <div className="col-span-1 md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
                {products.map((p) => (
                  <article key={p.num} className="group relative">
                    <div className={`${p.aspect} ${p.offset} overflow-hidden bg-surface-variant mb-4 border border-outline-variant relative`}>
                      <img alt={p.alt} className="w-full h-full object-cover filter contrast-125 sepia-0 group-hover:scale-105 transition-transform duration-700" src={p.src} />
                      <div className="noise-overlay opacity-30" style={noiseStyle}></div>
                      <span className="absolute top-0 right-0 bg-background border-l border-b border-outline-variant px-3 py-1 font-label-sm text-label-sm text-on-surface-variant">{p.num}</span>
                    </div>
                    <h3 className="font-body-lg text-body-lg text-on-surface">{p.title}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{p.price}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="col-span-1 md:col-span-4 mt-16 md:mt-0 pl-0 md:pl-12 border-t md:border-t-0 md:border-l border-outline-variant pt-16 md:pt-0">
              <div className="sticky top-32">
                <div className="aspect-[2/3] w-full overflow-hidden bg-surface-variant mb-6 border border-outline-variant relative">
                  <img alt="Portrait of the ceramic maker" className="w-full h-full object-cover grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkHoUSIFCL9RBijXPLtbkJP_0qblGj2s-RLJRxw9OTe4RV42O8XPpCbfxYMjwXJrkPJk_ETaTE5CM6DcZBSC8lIATw8K-uJf4usjpjZiIDfflDxpoeNSED54mkIrHgj8sZpQGaSoqGLQOpGaDhj0loIxwpOTsBG1HZm4oXgXHa1LbFGf8C2FAICiNkgr2V_p_zJ13gt5sTctRgMz0vr_CZ1C9HSMjKK5HzhqLW4cuvMGBQYIQRMhQj-U18nE6Hv6CqFdLFisvj5g" />
                  <div className="noise-overlay opacity-50" style={noiseStyle}></div>
                </div>
                <p className="font-headline-md text-headline-md text-on-surface italic text-xl leading-relaxed">
                  &quot;The wheel dictates the pace. You cannot rush the form without risking collapse. It demands presence.&quot;
                </p>
                <div className="mt-8">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">The Studio</p>
                  <p className="font-body-md text-body-md text-on-surface">Located on the rugged Welsh coast, our studio is a haven for slow creation. Every piece is born from locally sourced clay and fired in small, considered batches.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low py-16 border-y border-outline-variant sm:py-20 md:py-24">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin">
              <h2 className="font-headline-lg text-[28px] leading-tight text-on-surface mb-8 sm:text-[36px] sm:mb-12 md:text-headline-lg">The Cycle</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {processSteps.map((s) => (
                  <div key={s.label} className={`flex flex-col ${s.offset}`}>
                    <div className="aspect-square bg-surface-variant border border-outline-variant overflow-hidden relative mb-3">
                      <img alt={s.alt} className="w-full h-full object-cover filter grayscale sepia-[20%]" src={s.src} />
                      <div className="noise-overlay opacity-40" style={noiseStyle}></div>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase font-mono tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-container-max mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-margin md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10 items-center">
              <div className="md:col-span-7 relative">
                <div className="aspect-[4/5] w-full overflow-hidden bg-surface-variant border border-outline-variant relative">
                  <img alt="Studio interior, soft afternoon light, ceramic shelves" className="w-full h-full object-cover grayscale-[15%] sepia-[5%]" src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=1600&q=85&auto=format&fit=crop" />
                  <div className="noise-overlay opacity-30" style={noiseStyle}></div>
                  <div className="absolute top-0 left-0 bg-background border-r border-b border-outline-variant px-4 py-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-on-surface-variant">Detail · 02</span>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-background border-l border-t border-outline-variant px-4 py-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-on-surface-variant">The Wheel Room</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5">
                <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-secondary mb-5">— II · Origins</p>
                <h2 className="font-display-xl text-[36px] sm:text-[44px] md:text-[56px] leading-[1.05] text-on-surface mb-6 tracking-tight">A practice rooted in <em className="italic font-light text-secondary">slowness.</em></h2>
                <p className="font-body-lg text-body-lg text-on-surface mb-5 leading-relaxed">Clay Journal began in a converted boathouse on Cardigan Bay in 2014 — one wheel, one kiln, one decision: never to scale beyond what two hands could finish in a season.</p>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">Each vessel passes through eleven stages over thirty days. We do not glaze on Mondays. We do not fire when the wind crosses 25 knots. The kiln, like the work, asks for patience.</p>
                <a className="inline-flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface border-b border-on-surface pb-1 hover:text-secondary hover:border-secondary transition-colors" href="#">
                  <span>Read the studio diary</span>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_outward</span>
                </a>
              </div>
            </div>

            <div className="mt-16 md:mt-24 max-w-4xl mx-auto text-center border-t border-b border-outline-variant py-12 md:py-16 relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-4">
                <span className="material-symbols-outlined text-secondary text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>format_quote</span>
              </span>
              <p className="font-headline-md italic text-[24px] sm:text-[28px] md:text-[34px] text-on-surface leading-snug text-balance">&quot;There is no efficient way to throw a vessel that is meant to last a hundred years.&quot;</p>
              <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-on-surface-variant mt-6">— Eluned Vaughan · Founder · 2014</p>
            </div>
          </section>

          <section className="bg-surface-container py-16 border-y border-outline-variant sm:py-20 md:py-28">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
                <div className="max-w-2xl">
                  <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-secondary mb-4">— III · Material</p>
                  <h2 className="font-headline-lg text-[32px] sm:text-[40px] md:text-headline-lg leading-tight text-on-surface tracking-tight">The Glaze Library.</h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md md:text-right">Twenty-three glazes formulated in-house — wood-ash, iron-ash, chalk-white, cobalt-blue. Every recipe written by hand in the studio ledger.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
                {glazes.map(g => (
                  <figure key={g.name} className="group">
                    <div className="aspect-square overflow-hidden bg-surface-variant border border-outline-variant relative">
                      <img alt={`${g.name} glaze swatch`} className={`w-full h-full object-cover filter ${g.filter} group-hover:scale-105 transition-transform duration-700`} src={g.src} />
                      <div className="noise-overlay opacity-30" style={noiseStyle}></div>
                    </div>
                    <figcaption className="mt-3 flex items-baseline justify-between">
                      <span className="font-body-md text-body-md text-on-surface">{g.name}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">{g.num}</span>
                    </figcaption>
                    <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mt-1">{g.spec}</p>
                  </figure>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-outline-variant">
                {studioStats.map(s => (
                  <div key={s.label} className="border-b border-r border-outline-variant px-6 py-8 md:px-8 md:py-10">
                    <div className="font-display-xl text-[40px] md:text-[56px] leading-none text-on-surface italic">{s.value}{s.suffix && <span className={s.suffixClass || "text-secondary"}>{s.suffix}</span>}</div>
                    <p className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-on-surface-variant mt-3">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Where the work lives — 2x2 Premium image-bg quadrants */}
          <section className="max-w-container-max mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-margin md:py-28">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
              <div className="max-w-2xl">
                <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-secondary mb-4">— IV · The Living Vessel</p>
                <h2 className="font-headline-lg text-[32px] sm:text-[40px] md:text-headline-lg leading-tight text-on-surface tracking-tight">Where the work <em className="italic font-light text-secondary">lives.</em></h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md md:text-right">A vessel is finished only when it earns a place in someone's morning. Four scenes from kitchens that have welcomed our work for a decade.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {livedQuadrants.map(q => (
                <article key={q.id} className="relative group overflow-hidden border border-outline-variant aspect-[4/3] bg-surface-variant">
                  <img src={q.img} alt={q.alt} className="absolute inset-0 w-full h-full object-cover grayscale-[10%] transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" width="1200" height="900" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/35 to-transparent"></div>
                  <div className="noise-overlay opacity-25" style={noiseStyle}></div>
                  <div className="absolute top-4 left-4 bg-background/90 border border-outline-variant px-3 py-1 backdrop-blur-sm">
                    <span className="font-label-sm text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">{q.id}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <p className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-stone-300/80 mb-2">{q.label}</p>
                    <h3 className="font-headline-md text-[22px] md:text-[26px] italic font-light text-stone-50 leading-snug max-w-md">{q.body}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Selected Vessels — 6-up static image strip */}
          <section className="bg-surface-container-low py-16 border-y border-outline-variant sm:py-20 md:py-24">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-outline-variant pb-6">
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-secondary mb-3">— V · Catalog</p>
                  <h2 className="font-headline-lg text-[28px] sm:text-[36px] md:text-headline-lg leading-tight text-on-surface tracking-tight">Selected vessels · Vol III</h2>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">12 of 23 · Drops Nov 02</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
                {selectedVessels.map(v => (
                  <figure key={v.num} className="group">
                    <div className="relative aspect-square overflow-hidden border border-outline-variant bg-surface-variant">
                      <span className="absolute top-2 left-2 z-10 font-label-sm text-[10px] uppercase tracking-widest bg-background/95 border border-outline-variant px-1.5 py-0.5 backdrop-blur-sm">{v.num}</span>
                      <img src={v.img} alt={v.alt} className="w-full h-full object-cover filter grayscale-[10%] sepia-[5%] transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" width="600" height="600" />
                      <div className="noise-overlay opacity-30" style={noiseStyle}></div>
                    </div>
                    <figcaption className="mt-3">
                      <h3 className="font-body-md text-on-surface leading-tight">{v.title}</h3>
                      <p className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 font-mono">{v.meta}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-12 pt-6 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                <span>Each vessel signed · numbered · stamped on the foot</span>
                <a href="#" className="border-b border-on-surface text-on-surface pb-1 hover:text-secondary hover:border-secondary transition-colors">View full catalog →</a>
              </div>
            </div>
          </section>

          {/* Care, Use, Repair — 2-column premium (left text · right card stack with matching heights) */}
          <section className="max-w-container-max mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-margin md:py-28 border-t border-outline-variant">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10 md:items-stretch">
              <div className="md:col-span-5 flex flex-col h-full">
                <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-secondary mb-5">— VI · Stewardship</p>
                <h2 className="font-display-xl text-[36px] sm:text-[44px] md:text-[56px] leading-[1.05] text-on-surface mb-6 tracking-tight">Care. Use. <em className="italic font-light text-secondary">Repair.</em></h2>
                <p className="font-body-lg text-body-lg text-on-surface mb-5 leading-relaxed">A vessel that earns a place in your daily ritual deserves more than a tag in a bag. Four standing notes from the studio, written in long-hand and shipped with every piece.</p>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">If a piece breaks — and over a lifetime, it might — we will repair it for the cost of postage. The kiln has a long memory.</p>
                <div className="mt-auto pt-6 border-t border-outline-variant flex flex-col gap-3">
                  <p className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-on-surface-variant">From the studio diary</p>
                  <p className="font-headline-md italic text-[20px] md:text-[22px] text-on-surface leading-snug">"A pot that you have repaired is more yours than a pot that arrived intact."</p>
                  <p className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-on-surface-variant">— Eluned · Entry № 184 · Mar 2024</p>
                </div>
              </div>
              <div className="md:col-span-7 flex flex-col gap-4 md:gap-5 h-full md:justify-between">
                {careNotes.map(n => (
                  <article key={n.num} className="border border-outline-variant bg-surface-container-low p-5 md:p-7 flex items-start gap-5 group hover:border-secondary/60 transition-colors">
                    <div className="shrink-0 w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center bg-background">
                      <span className="material-symbols-outlined text-secondary text-[22px]" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">{n.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <h3 className="font-body-lg text-body-lg text-on-surface">{n.title}</h3>
                        <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-mono shrink-0">{n.num}</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{n.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-margin md:py-24">
            <h2 className="font-headline-md text-[22px] leading-tight text-on-surface mb-8 border-b border-outline-variant pb-4 sm:text-[26px] md:text-headline-md">Upcoming Kiln Firings</h2>
            <ul className="flex flex-col">
              {firings.map((f) => (
                <li key={f.name} className="flex justify-between items-center py-4 border-b border-outline-variant/50 hover:bg-surface-tint/5 transition-colors duration-300">
                  <span className="font-body-lg text-body-lg text-on-surface">{f.name}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{f.date}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer className="bg-[#F1E9DB] text-stone-700 font-serif text-sm italic w-full py-12 px-4 border-t border-stone-300/40 sm:py-16 sm:px-8 md:py-20 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full max-w-screen-2xl mx-auto relative gap-6 md:gap-0">
            <div className="mb-8 md:mb-0">
              <p className="font-serif text-stone-400 mb-4 text-xl">Clay Journal</p>
              <p className="text-stone-500">© 2024 Clay Journal — From the Kiln</p>
            </div>
            <div className="flex space-x-6 z-10">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="text-stone-500 hover:text-stone-900 transition-colors duration-300">{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
