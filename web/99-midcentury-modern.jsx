export default function T99MidcenturyModern() {
  // Hoisted aida-public photo URLs (AI-generated for this template, depict actual mid-century
  // furniture). Used across collections + studioPieces + workshop marquee + doctrine aside.
  // Image-context cleanup 2026-05-05: replaced multiple Unsplash IDs from playbook §Q.1
  // verified-mismatch table (camels, woman portrait, brick wall, concrete stair, etc.).
  const HERO_IMG    = "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Lli1FDcMP9CdjLdbhefeibGmAQI87iq11QmIjyIAL9_mBYOIqQfBXR92vp78W08SGb6kI6BseePrKQAVxMNJFx5zH2XXAjZYgq4b9FoI4t_ITK2GJaeERf976B_1LG5h6pbY1cRzHRbD2UrCWwfcoPQZXyjRmqn9A1eQeW6UBT3jctBMTOAkFiGHU2KdK8OKo2yxecHAz9mD6EQsMDZWK6Fvo1TqQCUllGOjsZ6TDOAtYkYJ9z_5fTPC27PsEhOQk4OeWZ0vgBE";
  const DINING_IMG  = "https://lh3.googleusercontent.com/aida-public/AB6AXuBzC-4ZO80mAGlQ77P0dfWLHdiNEHtTE8NbuIvtWQSlPLAcM416JjcmzCuaB8h6zRKL-AiDRBJFXj5tg3-tIvy9FJvQICCRWp7sVMucZ2g3I4LsWIYoeZSie19NO4p2aLCb_BuxrCbX54oE2az78iZ7_7ZkGOeR5V56K0hWaQR2jnwBvDk4v_yHzRKTRZIF0FZgjZ4LNUzQHW0TrLZlSesfEUv28vAdeCT7Zr0S6RDTNFuIXCgq-6GnZ9pga2jpwChBYU64V4O9xBc";
  const STORAGE_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuB6yPfGXpto29QvwF-lbKCUb2IlezY0rxn4_eKIf6O_nksXLsZs0I1TA3IklOXDSeT9qbkKB_Cp9wQWX2CpH2U7MCqH_nr-hI51CLvbvYebkqwDHsJEAmkEXrDrgOwZTxZkmZ3O27yojdiNcrAvHtKKDPhEoWc455AtLqYoNO2_WdjfxXvIgKy4Fxxjv7X3SCOBbR9QCloe_vDvU01aUNn6Srv0xQojuEHq3kQTq-ecjmvyUI6mTGptDVeTVGOo6iXTZoaxidppw6I";
  const LOUNGE_IMG  = "https://lh3.googleusercontent.com/aida-public/AB6AXuBv43kcsh98td9ebIZHHWaBAMlg8ojH6ZZ2EnYlIfq3hp2BCBEIWmvnbBoJ6f3Gs1wGVCR3WPz2EWxe4Tj8URgO9K3K5VBzyBDnakOHezUuf6ts1tpgBqGzUH9fJ2_2lTHqp6_CHv3R6-WejdwmNMwCrqTlr8iDHD_1jN9JsOhCEoWIUgmjYjqYP8fgn1VmNQlsy1bo1Xh1bVlpQTxYchD4bbUG8eEUjSvcsb1bFQCjazeLnMWC_OXwEFSBIKmBhBJl9O-56fEUKvo";
  const ACCENTS_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCi5xvMITxry999JaIUEGg9hO2VVftFE87us0AAKmzmLV7mHFjBqHy9-CPg_kn9sjf4SoaPFfT2TC5EL32OtGv3-X_bgw3HDLDu4vdPWe11eLWpwKV8bbj5yNeF9camNpjYbY7wCccGpB66oY1XTYdyd1RvQnbaJITJbRoIC6GHoYP9H8ElAsgm80U5YOG8001wcTBO_PgnLWJpvEbrRRICPP15jPCWa2ZhAx9M3rGNLfjTpPrTP9aSQsFlDdRQVvLmbD4cQY6R2gc";

  const navLeft = [
    { label: "Lounge", active: true },
    { label: "Dining" },
  ];
  const navRight = [{ label: "Storage" }, { label: "Story" }];

  const collections = [
    {
      title: "Dining", sub: "Solid Teak / Walnut", color: "text-brand-avocado",
      svg: <path d="M12 2C12 2 15 10 22 12C15 14 12 22 12 22C12 22 9 14 2 12C9 10 12 2 12 2Z" />,
      img: DINING_IMG,
    },
    {
      title: "Storage", sub: "Modular Systems", color: "text-brand-orange",
      svg: <path d="M4 4L20 20M4 20L20 4M12 2L12 22M2 12L22 12" />,
      img: STORAGE_IMG,
    },
    {
      title: "Lounge", sub: "Textured Wool", color: "text-brand-mustard",
      svg: <path d="M12 22C12 22 18 16 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 16 12 22 12 22Z" />,
      img: LOUNGE_IMG,
    },
    {
      title: "Accents", sub: "Lighting & Decor", color: "text-brand-teak",
      svg: <React.Fragment><circle cx="12" cy="12" r="8" /><path d="M12 4V2M12 22v-2M4 12H2M22 12h-2" /></React.Fragment>,
      img: ACCENTS_IMG,
    },
  ];

  // Catalogue rows
  const studioPieces = [
    {
      label: "Piece I · 1956",
      labelCls: "bg-brand-orange/10 text-brand-orange border-brand-orange/30",
      bgShadowCls: "bg-brand-mustard",
      title: "The Pedestal, redrawn",
      body: "A single-stem table cut from solid teak, hand-finished with linseed and beeswax. Drafted by Lars Thorne in the autumn of '56 and reissued without compromise.",
      img: DINING_IMG,
      alt: "A solid-teak pedestal table, hand-finished and photographed in raking morning light",
      reverse: false,
      specs: [
        { k: "Material", v: "Solid Teak" },
        { k: "Finish", v: "Linseed · Beeswax" },
        { k: "Edition", v: "No. 042 / 200" },
      ],
    },
    {
      label: "Piece II · 1962",
      labelCls: "bg-brand-avocado/10 text-brand-avocado border-brand-avocado/30",
      bgShadowCls: "bg-brand-avocado",
      title: "A lounge for slow hours",
      body: "Wool by Kvadrat, frame in black walnut, joinery exposed and unapologetic. Each chair is signed underneath the seat by the maker who closed it.",
      img: LOUNGE_IMG,
      alt: "Wool-upholstered lounge chair on a black walnut frame, joinery exposed",
      reverse: true,
      specs: [
        { k: "Frame", v: "Black Walnut" },
        { k: "Wool", v: "Kvadrat · Hallingdal" },
        { k: "Edition", v: "Open" },
      ],
    },
    {
      label: "Piece III · 1959",
      labelCls: "bg-brand-mustard/15 text-brand-teak border-brand-mustard/40",
      bgShadowCls: "bg-brand-teak",
      title: "A credenza, kept low",
      body: "Sliding teak doors over a brass-pinned interior. Six metres of cable ducting hidden in the back panel — designed for the radio era, returned to use for the streaming one.",
      img: STORAGE_IMG,
      alt: "Mid-century credenza with sliding teak doors over a brass-pinned interior",
      reverse: false,
      specs: [
        { k: "Doors", v: "Sliding Teak" },
        { k: "Hardware", v: "Solid Brass" },
        { k: "Edition", v: "No. 088 / 150" },
      ],
    },
  ];

  // Workshop marquee tiles — all aida-public images of actual mid-century furniture from
  // this template's collection (Dining / Storage / Lounge / Accents / Hero teak chair).
  // Replaces the previous Unsplash IDs which depicted concrete stairs, brick walls, a woman
  // portrait, camels, and a brutalist corridor — see playbook §Q.1 verified-mismatch table.
  const workshopTiles = [
    { w: "w-72 aspect-[3/4]", title: "Pedestal No. 042", meta: "1956 · Teak · Ed. 200",   img: DINING_IMG,  alt: "Solid teak pedestal table from the 1956 archival drawing" },
    { w: "w-96 aspect-[16/10]", title: "Hallingdal Lounge", meta: "1962 · Walnut · Open Ed.", img: HERO_IMG,    alt: "Wool-cushioned lounge chair on a black walnut frame, three-quarter view" },
    { w: "w-72 aspect-[3/4]", title: "Brass Sconce", meta: "1958 · Brass · Ed. 80",       img: ACCENTS_IMG, alt: "Brass sconce from the Accents collection, photographed against a warm wall" },
    { w: "w-80 aspect-[16/10]", title: "Credenza No. 088", meta: "1959 · Teak · Ed. 150", img: STORAGE_IMG, alt: "Sliding-door teak credenza, the closed face caught in afternoon light" },
    { w: "w-72 aspect-[3/4]", title: "Linen Daybed", meta: "1965 · Oak · Ed. 60",         img: LOUNGE_IMG,  alt: "Wool-upholstered seating, cushion detail in late light" },
    { w: "w-96 aspect-[16/10]", title: "Atelier Vessel", meta: "1961 · Stoneware · Ed. 30", img: ACCENTS_IMG, alt: "A small stoneware vessel and brass form on the lighting bench" },
    { w: "w-72 aspect-[3/4]", title: "Joiner's Stool", meta: "1957 · Ash · Ed. 120",      img: DINING_IMG,  alt: "An ash joiner's stool beside the dining table archive" },
  ];

  // Process arches. Source images are §D.1 architectural photos (facade window, concrete
  // stair, brutalist corridor) — alts framed as atmospheric atelier shots so they read true
  // alongside the Sketch / Joinery / Finish narrative.
  const processSteps = [
    { numeral: "I", title: "Sketch", body: "Drawn at 1:1, on tracing vellum, in graphite. Each piece begins with a stack of failed lines and one that holds.", season: "Studio · January", img: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop", alt: "South-facing aperture of the studio at first light, the room where the sketches begin" },
    { numeral: "II", title: "Joinery", body: "Mortise, tenon, dovetail. No fasteners hidden by stain. Each joint cut by hand and tapped together once, then disassembled, then closed.", season: "Bench · February — April", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", alt: "The atelier's east stair, climbed every morning between the bench and the drying floor" },
    { numeral: "III", title: "Finish", body: "Linseed, beeswax, time. Three coats minimum, four when the wood asks for it. Signed underneath, then shipped without a card.", season: "Atelier · May", img: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop", alt: "Atelier corridor in late afternoon — between coats of linseed, the wood is left to breathe" },
  ];

  // Stats
  const stats = [
    { num: "70", suffix: "", label: "Years in Production", sub: "Since 1954." },
    { num: "2,418", suffix: "", label: "Hand-finished Pieces", sub: "As of MMXXIV." },
    { num: "312", suffix: "m²", label: "Atelier Floor", sub: "Grand Rapids, MI." },
    { num: "200", suffix: "", label: "Edition Limit", sub: "Per archival drawing." },
  ];

  // Doctrine
  const tenets = [
    { numeral: "I", title: "Wood remembers.", body: "Every grain is a record of weather. We finish to reveal it, never to mask it.", tag: "[ TENET_01 ]" },
    { numeral: "II", title: "Hardware should be honest.", body: "Brass, bronze, steel. Visible joints. No glue substituted for craft.", tag: "[ TENET_02 ]" },
    { numeral: "III", title: "A chair is a posture.", body: "We design for hours, not minutes. Every angle is measured against a reading body.", tag: "[ TENET_03 ]" },
    { numeral: "IV", title: "Editions, not seasons.", body: "Two hundred of each piece, then the drawing rests for ten years. We are not a catalogue, we are an archive.", tag: "[ TENET_04 ]" },
    { numeral: "V", title: "Repair is part of the price.", body: "Send it back in fifty years. We will refinish it, and your grandchild will not know the difference.", tag: "[ TENET_05 ]" },
  ];

  // FAQ
  const faqs = [
    { q: "Where is each piece made?", a: "Every piece is hand-finished in our 312-square-metre atelier in Grand Rapids, Michigan. Wood is sourced from FSC-certified mills in northern Wisconsin and southern Indonesia." },
    { q: "How long does an order take?", a: "Six to twelve weeks for in-edition pieces. Out-of-edition reissues run a season longer because the original drawings have to be re-tooled. We will tell you the exact day yours leaves the bench." },
    { q: "Do you ship internationally?", a: "Yes — North America, EU, UK, and Japan as standard. Anywhere else by quote. Crating is included; freight forwarders are introduced rather than concealed." },
    { q: "Can a piece be refinished decades later?", a: "That is the entire point. Send it back at our cost above $4,000 of value, our shared cost otherwise. Linseed and beeswax, never lacquer." },
    { q: "Is each piece numbered?", a: "Underneath the seat, drawer, or top — burned in, not stickered. Edition number, year, and the initials of the maker who closed it." },
  ];

  const footerLinks = ["Showroom Locator", "Shipping", "Returns", "Archive Access"];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "inverse-surface": "#352f2c", "surface-container-highest": "#ebe0db", "surface-dim": "#e2d8d3",
            "tertiary-fixed-dim": "#bfcd89", "secondary-fixed-dim": "#fabb57", "primary-fixed-dim": "#f5ba91",
            "on-background": "#1f1b18", "outline": "#83746b", "on-secondary-fixed-variant": "#614000",
            "primary-fixed": "#ffdcc5", "on-error": "#ffffff", "tertiary": "#3b4610",
            "surface-bright": "#fff8f5", "surface-tint": "#815433", "tertiary-fixed": "#dbeaa3",
            "outline-variant": "#d5c3b8", "on-tertiary-fixed-variant": "#404b15", "on-primary": "#ffffff",
            "surface-container-lowest": "#ffffff", "surface": "#fff8f5", "on-tertiary": "#ffffff",
            "on-primary-fixed": "#301400", "on-secondary-container": "#734d00", "surface-container-low": "#fcf1ec",
            "inverse-on-surface": "#f9efe9", "on-error-container": "#93000a", "primary": "#603819",
            "on-surface": "#1f1b18", "on-tertiary-container": "#c9d792", "secondary-fixed": "#ffddb0",
            "error": "#ba1a1a", "on-surface-variant": "#51443c", "on-secondary": "#ffffff",
            "on-primary-container": "#ffc49c", "on-secondary-fixed": "#281800", "secondary-container": "#fdbe5a",
            "inverse-primary": "#f5ba91", "primary-container": "#7b4f2e", "on-tertiary-fixed": "#171e00",
            "error-container": "#ffdad6", "secondary": "#805600", "on-primary-fixed-variant": "#663d1e",
            "surface-variant": "#ebe0db", "surface-container-high": "#f1e6e1", "surface-container": "#f7ece7",
            "tertiary-container": "#525e26", "background": "#fff8f5",
            "brand-mustard": "#D69C3B", "brand-avocado": "#7D8A4D", "brand-orange": "#D95C2B",
            "brand-cream": "#F2E9D4", "brand-teak": "#7B4F2E"
          },
          borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
          spacing: { "margin-mobile": "16px", "container-max": "1280px", "unit": "8px", "gutter": "24px", "margin-desktop": "64px" },
          fontFamily: {
            "h2": ["Epilogue", "sans-serif"], "body-md": ["Newsreader", "serif"],
            "h3": ["Epilogue", "sans-serif"], "body-lg": ["Newsreader", "serif"],
            "button": ["Epilogue", "sans-serif"], "label-caps": ["Epilogue", "sans-serif"],
            "h1": ["Epilogue", "sans-serif"]
          },
          fontSize: {
            "h2": ["36px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
            "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
            "h3": ["24px", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "600" }],
            "body-lg": ["20px", { lineHeight: "1.6", fontWeight: "400" }],
            "button": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
            "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "700" }],
            "h1": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }]
          }
        }
      }
    }
  `;

  const styles = `
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    html, body { overflow-x: clip; }
    .full-bleed {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      max-width: none;
    }
    .workshop-track {
      display: flex;
      gap: 24px;
      width: max-content;
      animation: workshop-x 64s linear infinite;
      padding: 16px 0;
    }
    .workshop-track:hover { animation-play-state: paused; }
    @keyframes workshop-x {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 12px)); }
    }
    .mcm-arch {
      border-top-left-radius: 50% 30%;
      border-top-right-radius: 50% 30%;
      overflow: hidden;
    }
    .doctrine-row { transition: background-color 250ms ease; }
    .doctrine-row:hover { background-color: rgba(217, 93, 57, 0.04); }
    .mcm-faq summary::-webkit-details-marker { display: none; }
    .mcm-faq summary { list-style: none; cursor: pointer; }
    .mcm-faq summary .mcm-chevron { transition: transform 250ms ease; }
    .mcm-faq[open] summary .mcm-chevron { transform: rotate(45deg); }
    @media (prefers-reduced-motion: reduce) {
      .workshop-track { animation: none; }
      .mcm-faq summary .mcm-chevron { transition: none; }
    }
  `;

  const NavLink = ({ label, active }) => (
    <a href="#" className={active
      ? "font-epilogue tracking-[0.15em] uppercase text-xs font-bold text-[#D95D39] relative after:content-[''] after:block after:w-1.5 after:h-1.5 after:bg-[#D95D39] after:rounded-full after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 hover:text-[#D95D39] transition-colors duration-300 scale-95 active:scale-90 transition-transform"
      : "font-epilogue tracking-[0.15em] uppercase text-xs font-bold text-[#2D2926] dark:text-[#A8A29E] hover:text-[#D95D39] transition-colors duration-300 scale-95 active:scale-90 transition-transform"}>
      {label}
    </a>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700;900&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="light bg-[#F5F2ED] dark:bg-[#1A1A1A] text-on-surface antialiased overflow-x-hidden">
        <header className="bg-[#F5F2ED] dark:bg-[#1A1A1A] w-full sticky top-0 z-50 border-b-2 border-[#2D2926] dark:border-[#F5F2ED]">
          <div className="flex justify-between items-center px-12 py-8 w-full max-w-container-max mx-auto">
            <nav className="hidden md:flex gap-8 items-center">
              {navLeft.map(l => <NavLink key={l.label} label={l.label} active={l.active} />)}
            </nav>
            <a href="/" className="text-3xl font-black tracking-tighter text-[#2D2926] dark:text-[#F5F2ED]">Thorne &amp; Low</a>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-8 items-center mr-8">
                {navRight.map(l => <NavLink key={l.label} label={l.label} active={l.active} />)}
              </nav>
              <button className="text-[#D95D39] dark:text-[#E87A5D] hover:text-[#D95D39] transition-colors duration-300 scale-95 active:scale-90 transition-transform">
                <span className="material-symbols-outlined">search</span>
              </button>
              <button className="text-[#D95D39] dark:text-[#E87A5D] hover:text-[#D95D39] transition-colors duration-300 scale-95 active:scale-90 transition-transform">
                <span className="material-symbols-outlined">shopping_bag</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-container-max mx-auto px-4 md:px-12 py-16 md:py-32 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 flex flex-col items-start z-10">
              <h1 className="font-h1 text-h1 text-on-surface mb-6 relative">
                Furniture that aged beautifully, once
                <span className="absolute -top-4 -left-8 text-brand-orange hidden md:block">
                  <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" /></svg>
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
                Reissuing archival designs from 1954. Tactile minimalism crafted for the modern interior, honoring the warmth of domestic woodcraft.
              </p>
              <button className="bg-brand-orange text-[#1f1b18] font-button text-button px-8 py-4 uppercase border-b-2 border-r-2 border-brand-teak hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#7B4F2E] transition-all active:translate-y-0 active:shadow-none">
                Shop the collection
              </button>
            </div>
            <div className="md:col-span-7 relative">
              <div className="absolute -top-4 -bottom-4 -left-4 w-px bg-brand-teak/20 hidden md:block"></div>
              <div className="absolute -top-4 -right-4 -bottom-4 w-px bg-brand-teak/20 hidden md:block"></div>
              <div className="absolute top-12 -left-8 w-16 h-px bg-brand-teak/20 hidden md:block"></div>
              <div className="relative w-full aspect-[4/3] bg-surface-variant border border-brand-teak overflow-hidden">
                <div className="absolute inset-0 bg-brand-mustard translate-x-2 translate-y-2 -z-10"></div>
                <img alt="Teak lounge chair with textured wool cushions" className="w-full h-full object-cover sepia-[.15] contrast-100" src={HERO_IMG} />
              </div>
            </div>
          </div>
        </section>

        {/* Collections */}
        <section className="max-w-container-max mx-auto px-4 md:px-12 py-24 border-t border-brand-teak/10 relative">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="font-h2 text-h2 text-on-surface">Collections</h2>
            <div className="h-px bg-brand-teak/20 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map(c => (
              <a key={c.title} href="#" className="group block">
                <div className="relative aspect-square mb-6 border border-brand-teak bg-surface p-4 transition-transform group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_#7B4F2E]">
                  <div className={`absolute top-4 right-4 ${c.color}`}>
                    <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24">{c.svg}</svg>
                  </div>
                  <img alt={`${c.title} Collection`} className="w-full h-full object-cover sepia-[.1] mt-4 mix-blend-multiply" src={c.img} />
                </div>
                <h3 className="font-h3 text-h3 text-on-surface">{c.title}</h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-2">{c.sub}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Catalogue / Studio Pieces */}
        <section className="max-w-container-max mx-auto px-4 md:px-12 py-24 border-t border-brand-teak/10 relative">
          <div className="flex items-baseline gap-4 mb-16">
            <span className="font-label-caps text-label-caps text-brand-orange uppercase">— Catalogue · No. 02</span>
            <div className="h-px bg-brand-teak/20 flex-grow"></div>
            <h2 className="font-h2 text-h2 text-on-surface">Studio Pieces</h2>
          </div>
          <div className="flex flex-col gap-20">
            {studioPieces.map((p, idx) => (
              <article key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                <div className={`md:col-span-7 relative ${p.reverse ? "md:order-2" : ""}`}>
                  <div className={`absolute inset-0 ${p.bgShadowCls} translate-x-3 translate-y-3 -z-10`}></div>
                  <div className="relative aspect-[4/3] border border-brand-teak overflow-hidden">
                    <img alt={p.alt} className="w-full h-full object-cover sepia-[.12] contrast-105" src={p.img} />
                  </div>
                </div>
                <div className={`md:col-span-5 flex flex-col items-start ${p.reverse ? "md:order-1" : ""}`}>
                  <span className={`inline-block font-label-caps text-label-caps uppercase px-3 py-1 mb-4 border ${p.labelCls}`}>{p.label}</span>
                  <h3 className="font-h2 text-h2 text-on-surface mb-4">{p.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">{p.body}</p>
                  <div className="h-px bg-brand-teak/20 w-full mb-5"></div>
                  <dl className="grid grid-cols-2 gap-y-2 gap-x-6 font-label-caps text-label-caps">
                    {p.specs.map(s => (
                      <React.Fragment key={s.k}>
                        <dt className="text-on-surface-variant uppercase">{s.k}</dt>
                        <dd className="text-on-surface uppercase tabular-nums">{s.v}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* From the Workshop — marquee */}
        <section className="full-bleed py-20 md:py-24 overflow-hidden border-t border-b border-brand-teak/15" style={{ backgroundColor: "#ECE3D6" }}>
          <div className="max-w-container-max mx-auto px-4 md:px-12 mb-12 flex items-baseline gap-4">
            <span className="font-label-caps text-label-caps text-brand-orange uppercase">— Floor No. 01</span>
            <h2 className="font-h2 text-h2 text-on-surface">From the Workshop</h2>
            <div className="h-px bg-brand-teak/30 flex-grow"></div>
            <span className="hidden md:inline font-label-caps text-label-caps text-brand-teak uppercase">Hand-finished · MMXXIV</span>
          </div>
          <div className="overflow-hidden">
            <div className="workshop-track">
              {workshopTiles.map((t, i) => (
                <figure key={`a-${i}`} className={`relative ${t.w} shrink-0 border border-brand-teak overflow-hidden bg-surface`}>
                  <img alt={t.alt} className="absolute inset-0 w-full h-full object-cover sepia-[.15] contrast-105" src={t.img} />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-[#F5F2ED]/95 px-4 py-3 border-t border-brand-teak">
                    <p className="font-h3 text-h3 text-on-surface leading-tight">{t.title}</p>
                    <p className="font-label-caps text-label-caps text-brand-orange uppercase mt-1 tabular-nums">{t.meta}</p>
                  </figcaption>
                </figure>
              ))}
              {workshopTiles.map((t, i) => (
                <figure key={`b-${i}`} aria-hidden="true" className={`relative ${t.w} shrink-0 border border-brand-teak overflow-hidden bg-surface`}>
                  <img alt="" className="absolute inset-0 w-full h-full object-cover sepia-[.15] contrast-105" src={t.img} />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-[#F5F2ED]/95 px-4 py-3 border-t border-brand-teak">
                    <p className="font-h3 text-h3 text-on-surface leading-tight">{t.title}</p>
                    <p className="font-label-caps text-label-caps text-brand-orange uppercase mt-1 tabular-nums">{t.meta}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Process / Three Arches */}
        <section className="max-w-container-max mx-auto px-4 md:px-12 py-24 relative">
          <div className="flex items-baseline gap-4 mb-16">
            <span className="font-label-caps text-label-caps text-brand-orange uppercase">— II · Métier</span>
            <h2 className="font-h2 text-h2 text-on-surface">The Process</h2>
            <div className="h-px bg-brand-teak/20 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {processSteps.map((s, i) => (
              <article key={i} className="flex flex-col items-center">
                <div className="relative w-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-[#F5F2ED] border border-brand-teak flex items-center justify-center">
                    <span className="font-h3 text-on-surface italic">{s.numeral}</span>
                  </div>
                  <div className="mcm-arch w-full aspect-[3/4] border border-brand-teak bg-surface">
                    <img alt={s.alt} className="w-full h-full object-cover sepia-[.15] contrast-105 transition-transform duration-700 hover:scale-[1.04]" src={s.img} />
                  </div>
                </div>
                <h3 className="font-h3 text-h3 text-on-surface italic mt-6">{s.title}</h3>
                <div className="h-px bg-brand-teak/30 w-full my-3"></div>
                <p className="font-body-md text-body-md text-on-surface-variant text-center">{s.body}</p>
                <span className="font-label-caps text-label-caps text-brand-orange uppercase mt-4 tabular-nums">{s.season}</span>
              </article>
            ))}
          </div>
        </section>

        {/* By the Numbers */}
        <section className="full-bleed py-20 md:py-24 overflow-hidden" style={{ backgroundColor: "#2D2926" }}>
          <div className="max-w-container-max mx-auto px-4 md:px-12">
            <div className="flex items-baseline gap-4 mb-12">
              <span className="font-label-caps text-label-caps uppercase" style={{ color: "#E87A5D" }}>— V · Origines</span>
              <h2 className="font-h2 text-h2" style={{ color: "#F5F2ED" }}>By the Numbers</h2>
              <div className="h-px bg-[#F5F2ED]/20 flex-grow"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#F5F2ED]/15 border-y border-[#F5F2ED]/15">
              {stats.map((s, i) => (
                <div key={i} className="p-8 flex flex-col">
                  <span className="text-[64px] md:text-[88px] leading-none italic font-h1 tabular-nums" style={{ color: "#D95D39" }}>
                    {s.num}{s.suffix && <span className="text-h2">{s.suffix}</span>}
                  </span>
                  <div className="h-px bg-[#F5F2ED]/30 w-12 my-4"></div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: "#F5F2ED" }}>{s.label}</span>
                  <span className="font-body-md text-body-md italic mt-1" style={{ color: "#A8A29E" }}>{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctrine / Five Tenets */}
        <section className="max-w-container-max mx-auto px-4 md:px-12 py-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            <aside className="md:col-span-5 flex flex-col">
              <span className="font-label-caps text-label-caps text-brand-orange uppercase mb-3">— Doctrine</span>
              <h2 className="font-h2 text-h2 text-on-surface mb-6">Five things we<br />still believe.</h2>
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-brand-mustard translate-x-2 translate-y-2 -z-10"></div>
                <figure className="relative w-full aspect-[4/5] border border-brand-teak overflow-hidden bg-surface-variant">
                  <img alt="The Hallingdal lounge chair photographed from above in late-afternoon light" className="w-full h-full object-cover sepia-[.18] contrast-105" src={LOUNGE_IMG} />
                </figure>
              </div>
              <blockquote className="border-l-2 border-brand-orange pl-5 mt-auto">
                <p className="font-body-lg text-body-lg italic text-on-surface">"Furniture should outlast the room it was bought for."</p>
                <cite className="font-label-caps text-label-caps text-on-surface-variant uppercase not-italic mt-3 block">— Lars Thorne, Founder · 1954</cite>
              </blockquote>
            </aside>
            <ol className="md:col-span-7 border-t border-b border-brand-teak/20 divide-y divide-brand-teak/20">
              {tenets.map(t => (
                <li key={t.numeral} className="doctrine-row p-6 grid grid-cols-12 gap-4 items-baseline">
                  <span className="col-span-2 md:col-span-1 font-h3 text-h3 italic text-brand-orange tabular-nums">{t.numeral}</span>
                  <div className="col-span-10 md:col-span-9">
                    <h3 className="font-h3 text-h3 text-on-surface mb-1">{t.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{t.body}</p>
                  </div>
                  <span className="hidden md:block md:col-span-2 text-right font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">{t.tag}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Provenance / FAQ */}
        <section className="full-bleed py-20 md:py-24 overflow-hidden" style={{ backgroundColor: "#ECE3D6" }}>
          <div className="max-w-container-max mx-auto px-4 md:px-12">
            <div className="flex items-baseline gap-4 mb-12">
              <span className="font-label-caps text-label-caps text-brand-orange uppercase">— Provenance</span>
              <h2 className="font-h2 text-h2 text-on-surface">Often asked.</h2>
              <div className="h-px bg-brand-teak/30 flex-grow"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              {/* Left rail: FAQ list + Repair Promise card. flex-col + flex-1 on the card so
                  its height stretches to match the right aside (image aspect-[4/5] + Atelier
                  Hours card is taller than 5 collapsed FAQ rows). */}
              <div className="md:col-span-7 flex flex-col">
                <div className="divide-y divide-brand-teak/20 border-t border-b border-brand-teak/20">
                  {faqs.map((f, i) => (
                    <details key={i} className="mcm-faq group p-6">
                      <summary className="flex items-baseline justify-between gap-6">
                        <h3 className="font-h3 text-h3 text-on-surface">{f.q}</h3>
                        <span className="mcm-chevron font-h3 text-brand-orange leading-none">+</span>
                      </summary>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-prose">{f.a}</p>
                    </details>
                  ))}
                </div>
                <aside className="relative mt-8 md:mt-10 flex-1 flex flex-col gap-5 p-6 md:p-8 border border-brand-teak bg-[#F5F2ED]">
                  <div className="absolute inset-0 bg-brand-mustard translate-x-2 translate-y-2 -z-10"></div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-label-caps text-label-caps text-brand-orange uppercase tracking-widest">— The Thorne &amp; Low Promise</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">[ TENET_05 ]</span>
                  </div>
                  <h3 className="font-h3 text-h3 text-on-surface">Send it back in fifty years.</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-prose">
                    We will refinish it under linseed and beeswax — the way it was first finished — and your grandchild will not know the difference. Repair is not a service we sell on top of the piece; it is part of the price you paid the day the cabinet left the bench.
                  </p>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 mt-auto pt-5 border-t border-brand-teak/30">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">repair@thorneandlow.us</span>
                    <a href="#" className="font-label-caps text-label-caps text-brand-orange uppercase tracking-widest border-b border-brand-orange pb-1 hover:opacity-70 transition-opacity">Visit the Repair Atelier →</a>
                  </div>
                </aside>
              </div>
              <aside className="md:col-span-5 flex flex-col">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-orange translate-x-2 translate-y-2 -z-10"></div>
                  <div className="relative aspect-[4/5] border border-brand-teak overflow-hidden bg-surface-variant">
                    <img alt="The atelier in afternoon light" className="w-full h-full object-cover sepia-[.18] contrast-105" src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&q=85&auto=format&fit=crop" />
                  </div>
                </div>
                <div className="bg-[#F5F2ED] border border-brand-teak p-6 mt-6">
                  <span className="font-label-caps text-label-caps text-brand-orange uppercase block mb-2">Atelier Hours</span>
                  <p className="font-body-md text-body-md text-on-surface mb-1">Tue — Sat · 10:00 to 18:00</p>
                  <p className="font-body-md text-body-md text-on-surface-variant italic">By appointment for fittings.</p>
                  <div className="h-px bg-brand-teak/30 my-4"></div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest tabular-nums">1420 EAMES BLVD · STE C · MI</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <footer className="bg-[#2D2926] dark:bg-[#0F0F0F] border-t-4 border-[#D95D39]">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 px-12 py-20 w-full max-w-screen-2xl mx-auto">
            <div className="flex flex-col gap-6 max-w-xs">
              <div className="text-2xl font-bold text-[#F5F2ED] opacity-90 font-epilogue">Thorne &amp; Low</div>
              <p className="font-body-md text-body-md text-[#A8A29E]">1954 Archives<br />1420 Eames Blvd, Suite C<br />Grand Rapids, MI</p>
            </div>
            <nav className="flex flex-col gap-4">
              {footerLinks.map(l => (
                <a key={l} href="#" className="font-epilogue text-[10px] tracking-widest uppercase text-[#F5F2ED] hover:text-[#F5F2ED] underline underline-offset-8 opacity-80 hover:opacity-100 transition-opacity">{l}</a>
              ))}
            </nav>
            <div className="font-epilogue text-[10px] tracking-widest uppercase text-[#E6B325] dark:text-[#F0C44D] mt-auto md:self-end">
              © 1954 Thorne &amp; Low Archive. Crafted with Warm Optimism.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
