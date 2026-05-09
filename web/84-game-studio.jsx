export default function T84GameStudio() {
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Gallery", href: "#gallery" },
    { label: "Lore", href: "#lore" },
    { label: "Studio", href: "#studio" },
  ];

  const platforms = [
    { icon: "desktop_windows", title: "Windows" },
    { icon: "sports_esports", title: "Console" },
    { icon: "gamepad", title: "Gamepad" },
  ];

  const features = [
    { icon: "security", iconCls: "text-error red-glow-text", title: "Brutal Combat", body: "Master a precise, stamina-based combat system where every strike matters and mistakes are harshly punished." },
    { icon: "auto_awesome", iconCls: "text-secondary emerald-glow-text", title: "Eldritch Magic", body: "Harness forbidden spells that drain your very sanity while decimating the abominations that lurk in the dark." },
    { icon: "explore", iconCls: "text-primary", title: "Non-linear World", body: "Discover hidden paths, unlock ancient shortcuts, and unearth the grim history of a cursed, forgotten kingdom." },
  ];

  const gallery = [
    { src: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=800&auto=format&fit=crop", alt: "Vaulted gothic cathedral interior lit by candlelight" },
    { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop", alt: "Dark, foggy forest path surrounded by bare, twisting trees" },
    { src: "https://images.unsplash.com/photo-1517586979036-b7d1e86b3345?q=80&w=800&auto=format&fit=crop", alt: "A raven perched ominously on a dead, jagged branch" },
    { src: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=800&auto=format&fit=crop", alt: "A full moon shining brightly through dramatic, dark clouds", wide: true },
    { src: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop", alt: "Weathered suit of medieval plate armor standing in darkness" },
  ];

  const footerLinks = ["Press Kit", "Privacy Policy", "Terms of Service", "Contact"];

  const soundtrack = [
    { src: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=600&auto=format&fit=crop", alt: "Cathedral chamber", num: "01", title: "Vespers in Ash",       dur: "04:38", tempo: "LARGO",   variant: "emerald" },
    { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop", alt: "Foggy forest",      num: "04", title: "The Hollow Wood",     dur: "06:12", tempo: "ADAGIO",  variant: "emerald" },
    { src: "https://images.unsplash.com/photo-1517586979036-b7d1e86b3345?q=80&w=600&auto=format&fit=crop", alt: "Raven on branch",   num: "07", title: "Carrion Hymn",        dur: "03:21", tempo: "ALLEGRO", variant: "red" },
    { src: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=600&auto=format&fit=crop", alt: "Moon over clouds",  num: "09", title: "Eclipse, Final",      dur: "05:44", tempo: "GRAVE",   variant: "emerald" },
    { src: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop", alt: "Plate armor in dark", num: "11", title: "Harness of Iron",    dur: "07:56", tempo: "MARCIA",  variant: "red" },
    { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=600&auto=format&fit=crop", alt: "Architectural detail", num: "12", title: "Vault & Vow",       dur: "04:02", tempo: "LENTO",   variant: "emerald" },
    { src: "https://images.unsplash.com/photo-1444090542259-0af8fa96557e?q=80&w=600&auto=format&fit=crop", alt: "Lone figure & cathedral", num: "14", title: "Ravenlight (End Theme)", dur: "11:08", tempo: "ANDANTE", variant: "emerald" },
  ];

  const arsenal = [
    {
      numeral: "I", kind: "BLADE", title: "The Penitent Sword", reverse: false,
      img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1400&auto=format&fit=crop", alt: "Iron blade in plate armor",
      body: "A two-handed greatsword forged from cathedral bell-metal. Slow to draw, decisive when drawn. Each parry chips the blade — and the bearer.",
      stats: [{ l: "Damage", v: "142" }, { l: "Stamina", v: "38" }, { l: "Reach", v: "3.4 m" }],
      tone: "tertiary", border: "border-error/40", halo: null,
    },
    {
      numeral: "II", kind: "SIGIL", title: "The Sigil of Lambent Hours", reverse: true,
      img: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=1400&auto=format&fit=crop", alt: "Sigil cast against night sky",
      body: "A spell-locus carved from the bone of a saint who never spoke. Burns sanity to mend wounds, summon false dawn, or stop a heart at thirty paces.",
      stats: [{ l: "Sanity cost", v: "22" }, { l: "Cast time", v: "1.6s" }, { l: "Charges", v: "3 / 7" }],
      tone: "secondary", border: "border-secondary/40", halo: "radial-gradient(circle at 60% 40%, rgba(77,224,130,0.18) 0%, transparent 60%)",
    },
    {
      numeral: "III", kind: "LANTERN", title: "The Petty Lantern", reverse: false,
      img: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1400&auto=format&fit=crop", alt: "Lantern in cathedral",
      body: "A small relic of unknown make. Its flame does not warm and its oil does not run dry. The dark flinches from it; the things in the dark do not.",
      stats: [{ l: "Light", v: "5 m" }, { l: "Fuel", v: "∞" }, { l: "Origin", v: "???" }],
      tone: "tertiary", border: "border-tertiary/30", halo: "radial-gradient(circle at 30% 60%, rgba(255,180,171,0.12) 0%, transparent 50%)",
    },
  ];

  const tomes = [
    { numeral: "I",   title: "On the First Eclipse",    body: "An account from the Cathedral of St. Aelar in the year the sun first refused.",   read: "12 min", heretic: false },
    { numeral: "II",  title: "The Inquisitor's Manual", body: "Field protocols for engagement with the changed. Forty-three rules; thirty-one obeyed.", read: "18 min", heretic: false },
    { numeral: "III", title: "A Brief Bestiary",        body: "Twelve entries with sketches by Cardinal Greve. Several entries are missing pages.", read: "22 min", heretic: false },
    { numeral: "IV",  title: "The Heretic's Confession", body: "Recovered from the Black Library. Charred at the edges. Authorship contested.", read: "14 min", heretic: true },
    { numeral: "V",   title: "The Final Vespers",       body: "A liturgy never sung. Its translation is, by design, incomplete.", read: "9 min", heretic: false },
  ];

  const calendar = [
    { date: "Q3 · 2024",     title: "Vertical Slice", sub: "Closed alpha · 240 testers",          status: "done" },
    { date: "Q1 · 2025",     title: "Combat Lock",    sub: "Stamina & sigil systems · final tuning", status: "done" },
    { date: "Q3 · 2025",     title: "Open Beta",      sub: "Currently here · sign-ups open",        status: "current" },
    { date: "Spring · 2026", title: "Launch Day",     sub: "PC · Console · Cloud",                  status: "upcoming", icon: "schedule" },
    { date: "2026 · 2027",   title: "The Wake",       sub: "Two free expansions · post-launch",     status: "upcoming", icon: "flag" },
  ];

  const termLog = [
    { txt: "> BOOT_COMPLETE :: VESSEL_READY",  cls: "text-secondary" },
    { txt: "> LANTERN_LIT :: FUEL_∞",          cls: "" },
    { txt: "> BLADE_DRAWN :: PARRY +3",        cls: "" },
    { txt: "> SIGIL_BIND :: ECHO 22ms",        cls: "text-secondary" },
    { txt: "> THREAT @ 12m :: HUSK",           cls: "text-tertiary" },
    { txt: "> PARRY · LATE -7 SAN",            cls: "text-error red-glow-text" },
    { txt: "> KILL :: SAINT_HUSK_03",          cls: "text-secondary" },
    { txt: "> EXALT_GAINED :: 14",             cls: "" },
    { txt: "> SAVE_POINT :: WAYSHRINE_07",     cls: "text-secondary" },
  ];

  const editions = [
    {
      numeral: "I", icon: "auto_stories", title: "Standard", sub: "Digital · Base", price: "$59.99",
      featured: false,
      perks: ["Game (PC · Console · Cloud)", "Original soundtrack (FLAC)", "Bestiary PDF (52 pp)", "24h pre-load"],
    },
    {
      numeral: "II", icon: "local_library", title: "Iron-Bound Edition", sub: "Physical · Hardback", price: "$89.99",
      featured: false,
      perks: ["Everything in Standard", "Inquisitor's Manual hardback (192 pp)", "Steel enamel pin (raven sigil)", "Foil-stamped slipcase"],
    },
    {
      numeral: "III", icon: "verified", title: "Cathedral Edition", sub: "Physical · Reliquary", price: "$149.99",
      featured: true,
      perks: ["Everything in Iron-Bound", "Reliquary box (cast resin)", "90-min lore reel (4K download)", "Map cloth (60 × 40 cm)"],
    },
    {
      numeral: "IV", icon: "flag", title: "Inquisitor's Vault", sub: "Numbered · 1 / 2026", price: "$249.99",
      featured: false,
      perks: ["Everything in Cathedral", "Petty Lantern replica (cast resin)", "Numbered certificate (1 / 2026)", "Composer's vinyl LP (180g)"],
    },
  ];

  const relics = [
    { src: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=600&auto=format&fit=crop", alt: "Cathedral chamber, plate I",      label: "PLATE · 01 · I VESPERS" },
    { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop", alt: "Foggy forest, plate II",          label: "PLATE · 02 · II HOLLOW" },
    { src: "https://images.unsplash.com/photo-1517586979036-b7d1e86b3345?q=80&w=600&auto=format&fit=crop", alt: "Raven on branch, plate III",      label: "PLATE · 03 · III CARRION" },
    { src: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=600&auto=format&fit=crop", alt: "Moon over clouds, plate IV",      label: "PLATE · 04 · IV ECLIPSE" },
    { src: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop", alt: "Plate armor, plate V",            label: "PLATE · 05 · V HARNESS" },
    { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=600&auto=format&fit=crop", alt: "Architectural detail, plate VI",  label: "PLATE · 06 · VI VAULT" },
    { src: "https://images.unsplash.com/photo-1444090542259-0af8fa96557e?q=80&w=600&auto=format&fit=crop", alt: "Lone figure & cathedral, plate VII", label: "PLATE · 07 · VII END" },
    { src: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=600&auto=format&fit=crop", alt: "Cathedral chamber reprise, plate VIII", label: "PLATE · 08 · VIII WAKE" },
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "inverse-surface": "#eae1d2", "primary-container": "#0a0a0f",
            "outline": "#929095", "on-secondary-container": "#003e1c",
            "on-surface": "#eae1d2", "surface-container-lowest": "#110e06",
            "on-tertiary": "#690005", "secondary-container": "#00b55d",
            "surface-bright": "#3d392e", "outline-variant": "#47464b",
            "surface-container-high": "#2e2a20", "on-tertiary-fixed": "#410002",
            "secondary-fixed": "#6dfe9c", "error-container": "#93000a",
            "tertiary": "#ffb4ab", "surface": "#17130a",
            "surface-container": "#231f16", "on-primary-fixed-variant": "#47464c",
            "on-primary": "#303036", "on-error-container": "#ffdad6",
            "primary": "#c8c5cd", "surface-variant": "#39342a",
            "tertiary-container": "#200001", "tertiary-fixed": "#ffdad6",
            "secondary-fixed-dim": "#4de082", "error": "#ffb4ab",
            "on-error": "#690005", "on-primary-container": "#7a797f",
            "on-primary-fixed": "#1b1b20", "background": "#17130a",
            "tertiary-fixed-dim": "#ffb4ab", "surface-container-low": "#1f1b12",
            "surface-dim": "#17130a", "on-tertiary-container": "#e03b34",
            "on-background": "#eae1d2", "on-secondary": "#003919",
            "secondary": "#4de082", "inverse-primary": "#5f5d64",
            "primary-fixed": "#e4e1e9", "surface-container-highest": "#39342a",
            "surface-tint": "#c8c5cd", "on-tertiary-fixed-variant": "#93000b",
            "on-secondary-fixed": "#00210c", "inverse-on-surface": "#343026",
            "primary-fixed-dim": "#c8c5cd", "on-surface-variant": "#c8c5cb",
            "on-secondary-fixed-variant": "#005227"
          },
          borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
          spacing: {
            "margin-page": "clamp(1.5rem, 5vw, 4rem)", "stack-xs": "0.5rem",
            "stack-md": "1rem", "stack-xl": "clamp(2rem, 5vw, 3rem)",
            gutter: "clamp(1rem, 3vw, 1.5rem)", unit: "0.5rem",
            "container-max": "1200px"
          },
          fontFamily: {
            "headline-md": ["Newsreader", "serif"], "label-sm": ["Inter", "sans-serif"],
            "body-lg": ["Inter", "sans-serif"], "headline-lg": ["Newsreader", "serif"],
            "body-md": ["Inter", "sans-serif"], "display-xl": ["Newsreader", "serif"]
          },
          fontSize: {
            "headline-md": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2", fontWeight: "500" }],
            "label-sm": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.05em", fontWeight: "600" }],
            "body-lg": ["clamp(1rem, 2vw, 1.125rem)", { lineHeight: "1.5", fontWeight: "400" }],
            "headline-lg": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "600" }],
            "body-md": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
            "display-xl": ["clamp(2.5rem, 5vw + 1rem, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }]
          }
        }
      }
    };
  `;

  const customCss = `
    html { scroll-behavior: smooth; }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important; scroll-behavior: auto !important;
      }
    }
    .emerald-glow { box-shadow: 0 0 25px rgba(77, 224, 130, 0.3); }
    .emerald-glow-text { text-shadow: 0 0 15px rgba(77, 224, 130, 0.4); }
    .red-glow { box-shadow: 0 0 25px rgba(147, 0, 10, 0.5); }
    .red-glow-text { text-shadow: 0 0 15px rgba(147, 0, 10, 0.5); }
    @keyframes raven-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 14px)); }
    }
    .raven-marquee-track {
      animation: raven-marquee 70s linear infinite;
      width: max-content;
      display: flex;
      gap: 28px;
    }
    .raven-marquee-track:hover { animation-play-state: paused; }
    @keyframes raven-pulse {
      0%, 100% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(77, 224, 130, 0.4); }
      50% { opacity: 1; box-shadow: 0 0 0 8px rgba(77, 224, 130, 0); }
    }
    .raven-pulse { animation: raven-pulse 3s ease-in-out infinite; }
    @keyframes raven-sanity-drain {
      0%, 100% { height: 42%; background-color: rgba(255,180,171,0.85); }
      35%      { height: 18%; background-color: rgba(147,0,10,0.9); }
      70%      { height: 65%; background-color: rgba(77,224,130,0.8); }
    }
    .raven-sanity-bar { animation: raven-sanity-drain 9s ease-in-out infinite; }
    @keyframes raven-term-reveal {
      from { opacity: 0; transform: translateX(-4px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .raven-term-line {
      opacity: 0;
      animation: raven-term-reveal 0.4s cubic-bezier(0.2,0.8,0.2,1) forwards;
      animation-delay: var(--d, 0s);
    }
    @keyframes raven-blink { 50% { opacity: 0; } }
    .raven-cursor {
      display: inline-block;
      width: 8px; height: 1em;
      background: currentColor;
      vertical-align: middle;
      animation: raven-blink 1.05s steps(2) infinite;
    }
    @keyframes raven-led-flicker {
      0%, 95%, 100% { opacity: 1; }
      97%           { opacity: 0.4; }
    }
    .raven-led { animation: raven-led-flicker 4s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .raven-marquee-track,
      .raven-pulse,
      .raven-sanity-bar,
      .raven-term-line,
      .raven-cursor,
      .raven-led { animation: none; }
      .raven-term-line { opacity: 1; transform: none; }
    }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0,0,24&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="dark antialiased bg-primary-container text-on-surface font-body-md overflow-x-hidden selection:bg-secondary/30 selection:text-secondary">
        <header className="fixed top-0 left-0 w-full z-50 bg-primary-container/80 backdrop-blur-xl shadow-[0_0_30px_rgba(74,222,128,0.03)] border-b border-secondary/10">
          <div className="flex justify-between items-center px-margin-page py-6 max-w-container-max mx-auto">
            <div className="text-2xl font-bold tracking-[0.2em] uppercase text-on-surface font-headline-md">Ravenlight</div>
            <nav className="hidden md:flex items-center gap-8 font-headline-md text-lg tracking-wide text-on-surface-variant" aria-label="Main navigation">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-secondary transition-colors hover:bg-surface/50 duration-300 px-3 py-1 rounded-DEFAULT active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary-container">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-6">
              <button className="text-on-tertiary-container font-label-sm uppercase tracking-widest hover:text-error transition-colors hidden md:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error rounded-DEFAULT px-2 py-1">
                Wishlist on Steam
              </button>
              <button className="text-on-surface-variant hover:text-secondary transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-DEFAULT p-1" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu">
                <span className="material-symbols-outlined" aria-hidden="true">menu</span>
              </button>
            </div>
          </div>
        </header>

        <main>
          {/* `isolate` is load-bearing: it gives the hero its own stacking
              context so the `-z-20` background image stays scoped to this
              section. Without it, negative-z children promote to the root
              stacking context and paint *behind* the wrapper div's
              `bg-primary-container` — invisible. The HTML version doesn't
              hit this because its bg lives on `<body>` (page canvas), not
              on a wrapper div. */}
          <section id="hero" aria-labelledby="hero-title" className="relative isolate min-h-screen flex items-center justify-center pt-24 pb-16 px-margin-page overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrTaxJl5PxFuVAGSgOiyhsGVTphFmfBrU0qhuXHsTYPQYZEvshPNr4Myq_VzG_GNFXLpRyzsG27e2yFVI5x5CXJlh8PYtMiLcOOLq677NXUDc2pLuXeihj6xswl94yrPKfYp-Sg_Q8EDb_YxW2XltMHwlRieXH5JE-zpME7nMrO0q9PFo9Rz7oG7bcDE5suQiLaK7hqL90hqs1ox9JBT8FRsnXhpCKr0eAMK9W-1Tj1ZG0PCA-dzcF6IWDzCoNwafYVJgb_c7Bcc0"
              alt="A dark, atmospheric gothic landscape with a towering ruined cathedral silhouetted against a blood-red moon, surrounded by twisted dead trees and creeping fog."
              className="absolute inset-0 w-full h-full object-cover -z-20"
              loading="eager" fetchPriority="high" width="1920" height="1080"
            />
            <div className="absolute inset-0 bg-primary-container/80 backdrop-blur-[2px] -z-10" aria-hidden="true"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-container/50 to-primary-container -z-10" aria-hidden="true"></div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-stack-xl mt-12 md:mt-0">
              <div className="space-y-stack-md flex flex-col items-center">
                <h1 id="hero-title" className="font-display-xl text-on-surface tracking-widest uppercase text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                  Ravenlight
                </h1>
                <p className="font-headline-md text-lg md:text-xl text-on-surface-variant italic tracking-wider text-pretty max-w-[65ch]">
                  A gothic adventure through the unlit world.
                </p>
                <p className="font-label-sm text-secondary uppercase tracking-[0.3em] emerald-glow-text mt-8">
                  Spring 2026
                </p>
              </div>
              <div className="flex items-center justify-center gap-6 text-on-surface-variant opacity-80" aria-label="Available platforms">
                {platforms.map((p) => (
                  <span key={p.title} className="material-symbols-outlined text-3xl" aria-hidden="true" title={p.title}>{p.icon}</span>
                ))}
              </div>
              <button className="bg-error-container text-on-error-container font-label-sm px-12 py-4 uppercase tracking-[0.2em] hover:brightness-110 transition-all duration-300 red-glow hover:scale-105 active:scale-95 border border-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-primary-container cursor-pointer rounded-DEFAULT">
                Wishlist on Steam
              </button>
            </div>
          </section>

          <section id="features" aria-labelledby="features-title" className="py-20 px-margin-page max-w-container-max mx-auto scroll-mt-32 flex flex-col gap-stack-xl">
            <div className="text-center space-y-stack-md">
              <h2 id="features-title" className="font-headline-lg text-on-surface text-balance">Features</h2>
              <p className="font-body-lg text-on-surface-variant max-w-[65ch] mx-auto text-pretty">Survive the unending night with mechanics designed to test your absolute resolve.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {features.map((f) => (
                <article key={f.title} className="flex flex-col items-center text-center space-y-stack-md p-8 rounded-xl bg-surface-container-low border border-surface-container-highest hover:border-secondary/30 hover:bg-surface-container transition-all duration-300">
                  <span className={`material-symbols-outlined text-4xl ${f.iconCls}`} aria-hidden="true">{f.icon}</span>
                  <h3 className="font-headline-md text-on-surface">{f.title}</h3>
                  <p className="font-body-md text-on-surface-variant text-pretty max-w-[65ch]">{f.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="gallery" aria-labelledby="gallery-title" className="py-20 px-margin-page bg-surface-container-lowest scroll-mt-32">
            <div className="max-w-container-max mx-auto flex flex-col gap-stack-xl">
              <div className="text-center space-y-stack-md">
                <h2 id="gallery-title" className="font-headline-lg text-on-surface text-balance">Gallery</h2>
                <p className="font-body-lg text-on-surface-variant max-w-[65ch] mx-auto text-pretty">Glimpse into the desolate beauty of Ravenlight.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-unit">
                {gallery.map((g) => (
                  <img
                    key={g.src}
                    src={g.src}
                    alt={g.alt}
                    className={`w-full h-64 object-cover rounded-DEFAULT border border-surface-container-highest hover:border-secondary/50 transition-colors duration-300${g.wide ? " lg:col-span-2" : ""}`}
                    loading="lazy" decoding="async" width="800" height="600"
                  />
                ))}
              </div>
            </div>
          </section>

          <section id="lore" aria-labelledby="lore-title" className="py-20 px-margin-page max-w-container-max mx-auto scroll-mt-32">
            <div className="flex flex-col lg:flex-row gap-stack-xl items-center">
              <div className="lg:w-1/2 space-y-stack-md">
                <h2 id="lore-title" className="font-headline-lg text-on-surface text-balance">The Fall of Oakhaven</h2>
                <div className="space-y-stack-xs font-body-md text-on-surface-variant max-w-[65ch] text-pretty">
                  <p>
                    Once a beacon of prosperity, the kingdom of Oakhaven has been consumed by an endless eclipse. The church's experiments with forbidden celestial blood have mutated the populace into mindless aberrations.
                  </p>
                  <p className="mt-4">
                    As a newly resurrected Inquisitor, you must traverse the decaying capital, unravel the mysteries of the blood plague, and decide the ultimate fate of the realm. Will you restore the light, or embrace the comforting dark?
                  </p>
                </div>
                <a href="#lore" className="inline-flex items-center gap-2 mt-4 text-secondary font-label-sm uppercase tracking-widest hover:text-secondary-fixed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary-container rounded-DEFAULT px-2 py-1 -ml-2 group">
                  Read the full chronicles
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                </a>
              </div>
              <div className="lg:w-1/2 relative w-full">
                <div className="absolute inset-0 bg-secondary/10 blur-[80px] rounded-full pointer-events-none"></div>
                <img
                  src="https://images.unsplash.com/photo-1444090542259-0af8fa96557e?q=80&w=1000&auto=format&fit=crop"
                  alt="A lone figure looking out over a colossal, dark gothic cathedral in the distance, enshrouded in mist"
                  className="relative z-10 w-full h-[400px] lg:h-[500px] object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-surface-container-highest"
                  loading="lazy" decoding="async" width="1000" height="1500"
                />
              </div>
            </div>
          </section>

          {/* Section: Soundtrack (image strip / marquee) */}
          <section id="soundtrack" aria-labelledby="soundtrack-title" className="py-20 px-margin-page bg-surface-container-lowest scroll-mt-32 border-y border-surface-container-highest">
            <div className="max-w-container-max mx-auto flex flex-col gap-stack-xl">
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div className="space-y-stack-md max-w-[65ch]">
                  <p className="font-label-sm text-secondary uppercase tracking-[0.3em] emerald-glow-text">— Aural Codex</p>
                  <h2 id="soundtrack-title" className="font-headline-lg text-on-surface text-balance">Original soundtrack, by candlelight.</h2>
                  <p className="font-body-md text-on-surface-variant text-pretty">Fourteen pieces, recorded over eleven months in a deconsecrated chapel outside Bath. Hover to pause; lean in to listen.</p>
                </div>
                <span className="font-label-sm text-on-surface-variant uppercase tracking-widest hidden md:inline">Composer · Bram Hellinga</span>
              </div>
              <div className="relative -mx-margin-page overflow-hidden py-2">
                <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-surface-container-lowest to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-surface-container-lowest to-transparent"></div>
                <div className="raven-marquee-track px-margin-page">
                  {[...soundtrack, ...soundtrack].map((t, i) => {
                    const isRed = t.variant === "red";
                    const dotCls = isRed ? "bg-error" : "bg-secondary";
                    const trackBorder = isRed ? "border-error/40" : "border-secondary/30";
                    const trackText = isRed ? "text-tertiary" : "text-secondary";
                    const playText = isRed ? "text-tertiary" : "text-secondary";
                    const isFirst = t.num === "01" && i < soundtrack.length;
                    return (
                      <figure key={i} className="shrink-0 w-72" aria-hidden={i >= soundtrack.length ? true : undefined}>
                        <div className="aspect-square overflow-hidden border border-surface-container-highest relative bg-primary-container">
                          <img className="absolute inset-0 w-full h-full object-cover opacity-90 grayscale contrast-105" src={t.src} alt={i < soundtrack.length ? t.alt : ""} loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/30 to-transparent"></div>
                          <div className={`absolute top-3 left-3 flex items-center gap-2 backdrop-blur-sm bg-primary-container/70 border ${trackBorder} px-2 py-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotCls}${isFirst ? " raven-pulse" : ""}`} aria-hidden="true"></span>
                            <span className={`font-label-sm ${trackText} uppercase tracking-widest`}>TRACK {t.num}</span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-headline-md text-on-surface italic text-xl leading-tight drop-shadow-md">{t.title}</span>
                              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest tabular-nums">{t.dur} · {t.tempo}</span>
                            </div>
                            <span className={`material-symbols-outlined ${playText} text-3xl drop-shadow-md`} aria-hidden="true">play_circle</span>
                          </div>
                        </div>
                      </figure>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Inquisitor's Arsenal (3 alternating image+content rows) */}
          <section id="arsenal" aria-labelledby="arsenal-title" className="py-20 px-margin-page max-w-container-max mx-auto scroll-mt-32">
            <div className="text-center space-y-stack-md mb-12">
              <p className="font-label-sm text-secondary uppercase tracking-[0.3em] emerald-glow-text">— Tools of Office</p>
              <h2 id="arsenal-title" className="font-headline-lg text-on-surface text-balance">The Inquisitor's Arsenal</h2>
              <p className="font-body-md text-on-surface-variant max-w-[65ch] mx-auto text-pretty">Three implements, drawn before the eclipse fell. Carry one well. Carry all three at peril.</p>
            </div>
            <div className="flex flex-col gap-stack-xl">
              {arsenal.map(a => {
                const toneCls = a.tone === "secondary" ? "text-secondary" : "text-tertiary";
                const figure = (
                  <figure className={`md:col-span-7 ${a.reverse ? "md:order-2 order-1" : ""} relative aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden rounded-xl border border-surface-container-highest`}>
                    <img className="absolute inset-0 w-full h-full object-cover opacity-85 grayscale contrast-110" src={a.img} alt={a.alt} loading="lazy" />
                    <div className={`absolute inset-0 bg-gradient-to-${a.reverse ? "tl" : "tr"} from-primary-container/90 via-primary-container/30 to-transparent`}></div>
                    {a.halo && <div className="absolute inset-0 pointer-events-none" style={{ background: a.halo }}></div>}
                    <div className={`absolute top-4 ${a.reverse ? "right-4" : "left-4"} flex items-center gap-3 backdrop-blur-sm bg-primary-container/70 border ${a.border} px-3 py-1.5`}>
                      <span className={`font-headline-md ${toneCls} italic text-xl tabular-nums`}>{a.numeral}</span>
                      <span className={`font-label-sm ${toneCls} uppercase tracking-[0.3em]`}>— {a.kind}</span>
                    </div>
                  </figure>
                );
                const content = (
                  <div className={`md:col-span-5 ${a.reverse ? "md:order-1 order-2" : ""} flex flex-col gap-stack-md justify-center`}>
                    <h3 className="font-headline-md text-on-surface text-balance">{a.title}</h3>
                    <p className="font-body-md text-on-surface-variant text-pretty">{a.body}</p>
                    <dl className="grid grid-cols-3 border-t border-surface-container-highest pt-4 gap-3">
                      {a.stats.map((s, j) => (
                        <div key={s.l} className={`flex flex-col gap-1 ${j > 0 ? "border-l border-surface-container-highest pl-3" : ""}`}>
                          <dt className="font-label-sm text-on-surface-variant uppercase tracking-widest">{s.l}</dt>
                          <dd className={`font-headline-md ${toneCls} tabular-nums leading-none`}>{s.v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
                return (
                  <article key={a.numeral} className="grid grid-cols-1 md:grid-cols-12 gap-stack-xl items-stretch">
                    {figure}
                    {content}
                  </article>
                );
              })}
            </div>
          </section>

          {/* Section: Tomes of Oakhaven */}
          <section id="tomes" aria-labelledby="tomes-title" className="py-20 px-margin-page bg-surface-container-low scroll-mt-32 border-y border-surface-container-highest">
            <div className="max-w-container-max mx-auto flex flex-col gap-stack-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md items-end">
                <div className="md:col-span-7 space-y-stack-md">
                  <p className="font-label-sm text-secondary uppercase tracking-[0.3em] emerald-glow-text">— Apocrypha</p>
                  <h2 id="tomes-title" className="font-headline-lg text-on-surface text-balance">Five tomes, recovered from the vault.</h2>
                </div>
                <p className="md:col-span-5 font-body-md text-on-surface-variant text-pretty">In-universe writing. Read in any order. Each unlocks at a milestone in the campaign — these are extracts.</p>
              </div>
              <ol className="flex flex-col border-t border-b border-surface-container-highest divide-y divide-surface-container-highest">
                {tomes.map(t => {
                  const colorCls = t.heretic ? "text-error red-glow-text" : "text-secondary emerald-glow-text";
                  return (
                    <li key={t.numeral} className="grid grid-cols-12 gap-4 py-7 items-center">
                      <span className={`col-span-2 md:col-span-1 font-headline-lg ${colorCls} italic leading-none text-3xl md:text-4xl tabular-nums`}>{t.numeral}</span>
                      <div className="col-span-7 md:col-span-7 flex flex-col gap-1">
                        <h3 className="font-headline-md text-on-surface italic text-xl md:text-2xl">{t.title}</h3>
                        <p className="font-body-md text-on-surface-variant max-w-prose">{t.body}</p>
                      </div>
                      <span className="col-span-3 md:col-span-2 font-label-sm uppercase tracking-widest text-on-surface-variant text-right tabular-nums">{t.read}</span>
                      <a className="col-span-12 md:col-span-2 font-label-sm text-secondary uppercase tracking-widest text-right hover:text-secondary-fixed transition-colors" href="#">Read →</a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          {/* Section: Eclipse Calendar (roadmap) */}
          <section id="calendar" aria-labelledby="calendar-title" className="py-20 px-margin-page max-w-container-max mx-auto scroll-mt-32">
            <div className="text-center space-y-stack-md mb-12 md:mb-16">
              <p className="font-label-sm text-secondary uppercase tracking-[0.3em] emerald-glow-text">— Roadmap</p>
              <h2 id="calendar-title" className="font-headline-lg text-on-surface text-balance">The Eclipse Calendar</h2>
              <p className="font-body-md text-on-surface-variant max-w-[65ch] mx-auto text-pretty">Five milestones from now to launch. Dates may shift; the work will not.</p>
            </div>
            <div className="relative">
              {/* SVG roadmap connector: solid (done) → dashed emerald (current) → dashed dim (upcoming) → arrowhead */}
              <svg aria-hidden="true" className="hidden md:block absolute top-7 left-[8%] right-[8%] h-4 z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 16" fill="none">
                <line x1="0" y1="8" x2="400" y2="8" stroke="#4de082" strokeWidth="2" strokeLinecap="round" />
                <line x1="400" y1="8" x2="600" y2="8" stroke="#4de082" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.7" />
                <line x1="600" y1="8" x2="985" y2="8" stroke="#929095" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" opacity="0.5" />
                <path d="M978 4 L990 8 L978 12" stroke="#929095" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.6" />
              </svg>
              <ol className="grid grid-cols-1 md:grid-cols-5 gap-stack-md md:gap-4 relative">
                {calendar.map((m, i) => {
                  const dot = m.status === "done"
                    ? <span className="material-symbols-outlined text-secondary" aria-hidden="true">check_circle</span>
                    : m.status === "current"
                      ? <span className="w-3 h-3 rounded-full bg-secondary raven-pulse" aria-hidden="true"></span>
                      : <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">{m.icon || "schedule"}</span>;
                  const ringCls = m.status === "upcoming"
                    ? "bg-primary-container border-2 border-on-surface-variant/30"
                    : m.status === "current"
                      ? "bg-secondary/20 border-2 border-secondary shadow-[0_0_24px_rgba(77,224,130,0.45)]"
                      : "bg-secondary/10 border-2 border-secondary emerald-glow";
                  const dateCls = m.status === "upcoming" ? "text-on-surface-variant" : "text-secondary";
                  const subCls = m.status === "current" ? "text-tertiary" : "text-on-surface-variant";
                  return (
                    <li key={i} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center">
                      <div className={`shrink-0 w-14 h-14 rounded-full ${ringCls} flex items-center justify-center relative z-10`}>
                        {dot}
                      </div>
                      <div className="flex flex-col gap-1 md:items-center">
                        <span className={`font-label-sm ${dateCls} uppercase tracking-widest tabular-nums`}>{m.date}</span>
                        <h3 className="font-headline-md text-on-surface italic text-xl">{m.title}</h3>
                        <span className={`font-label-sm ${subCls} uppercase tracking-widest text-[11px]`}>{m.sub}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          {/* Section: HUD telemetry (animated gaming UI) */}
          <section id="hud" aria-labelledby="hud-title" className="py-20 px-margin-page max-w-container-max mx-auto scroll-mt-32">
            <div className="text-center space-y-stack-md mb-10 md:mb-12">
              <p className="font-label-sm text-secondary uppercase tracking-[0.3em] emerald-glow-text">— Telemetry</p>
              <h2 id="hud-title" className="font-headline-lg text-on-surface text-balance">The Inquisitor sees, even when you don't.</h2>
              <p className="font-body-md text-on-surface-variant max-w-[65ch] mx-auto text-pretty">Sanity drains. Sigils restore. Saves are autonomous. The HUD is unobtrusive but never silent.</p>
            </div>
            <div className="border border-secondary/30 bg-surface-container-lowest rounded-xl p-4 md:p-6 shadow-[0_0_30px_rgba(77,224,130,0.05)]">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-surface-container-highest">
                {/* LEFT: Sanity bar */}
                <div className="flex flex-col gap-3 p-4 md:pr-8">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-secondary uppercase tracking-widest">Sanity</span>
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-widest tabular-nums">042 / 100</span>
                  </div>
                  <div className="flex items-end gap-3 h-40">
                    <div className="relative w-8 h-full bg-primary-container border border-surface-container-highest rounded-DEFAULT overflow-hidden" aria-hidden="true">
                      <div className="raven-sanity-bar absolute bottom-0 left-0 right-0 rounded-b-DEFAULT shadow-[0_0_18px_rgba(147,0,10,0.4)]"></div>
                    </div>
                    <ul className="flex-1 flex flex-col gap-1.5 text-[11px] font-label-sm uppercase tracking-widest text-on-surface-variant">
                      <li className="flex items-center justify-between"><span>Threshold</span><span className="text-tertiary tabular-nums">25</span></li>
                      <li className="flex items-center justify-between"><span>Drain</span><span className="tabular-nums">-3 / m</span></li>
                      <li className="flex items-center justify-between"><span>Recover</span><span className="text-secondary tabular-nums">+12 / sigil</span></li>
                      <li className="flex items-center justify-between"><span>State</span><span className="text-tertiary">FRAGILE</span></li>
                    </ul>
                  </div>
                </div>
                {/* CENTER: Sigil charges */}
                <div className="flex flex-col gap-3 p-4 md:px-8">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-secondary uppercase tracking-widest">Charges</span>
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-widest tabular-nums">03 / 07</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-6" aria-hidden="true">
                    <span className="raven-led w-6 h-6 rounded-DEFAULT bg-secondary border border-secondary shadow-[0_0_12px_rgba(77,224,130,0.7)]" style={{ animationDelay: "0s" }}></span>
                    <span className="raven-led w-6 h-6 rounded-DEFAULT bg-secondary border border-secondary shadow-[0_0_12px_rgba(77,224,130,0.7)]" style={{ animationDelay: "0.4s" }}></span>
                    <span className="raven-led w-6 h-6 rounded-DEFAULT bg-secondary border border-secondary shadow-[0_0_12px_rgba(77,224,130,0.7)]" style={{ animationDelay: "0.8s" }}></span>
                    <span className="w-6 h-6 rounded-DEFAULT bg-primary-container border border-surface-container-highest"></span>
                    <span className="w-6 h-6 rounded-DEFAULT bg-primary-container border border-surface-container-highest"></span>
                    <span className="w-6 h-6 rounded-DEFAULT bg-primary-container border border-surface-container-highest"></span>
                    <span className="w-6 h-6 rounded-DEFAULT bg-primary-container border border-surface-container-highest"></span>
                  </div>
                  <ul className="flex flex-col gap-1.5 text-[11px] font-label-sm uppercase tracking-widest text-on-surface-variant">
                    <li className="flex items-center justify-between"><span>Sigil</span><span className="text-secondary">LAMBENT HOURS</span></li>
                    <li className="flex items-center justify-between"><span>Cooldown</span><span className="tabular-nums">22s</span></li>
                    <li className="flex items-center justify-between"><span>Echo</span><span className="text-secondary tabular-nums">22 ms</span></li>
                  </ul>
                </div>
                {/* RIGHT: Terminal log */}
                <div className="flex flex-col gap-3 p-4 md:pl-8">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-secondary uppercase tracking-widest">Log</span>
                    <span className="flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-secondary raven-pulse" aria-hidden="true"></span>
                      LIVE
                    </span>
                  </div>
                  <div className="bg-primary-container border border-surface-container-highest rounded-DEFAULT p-3 font-mono text-[11px] leading-relaxed text-on-surface-variant overflow-hidden">
                    {termLog.map((l, i) => (
                      <p key={i} className={`raven-term-line ${l.cls}`} style={{ "--d": `${i * 0.25}s` }}>{l.txt}</p>
                    ))}
                    <p className="raven-term-line" style={{ "--d": `${termLog.length * 0.25}s` }}>&gt; <span className="raven-cursor" aria-hidden="true"></span></p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Editions of Note (premium 4-card) */}
          <section id="editions" aria-labelledby="editions-title" className="py-20 px-margin-page bg-surface-container-low scroll-mt-32 border-y border-surface-container-highest">
            <div className="max-w-container-max mx-auto flex flex-col gap-stack-xl">
              <div className="flex flex-col gap-stack-md max-w-3xl">
                <p className="font-label-sm text-secondary uppercase tracking-[0.3em] emerald-glow-text">— Editions of note</p>
                <h2 id="editions-title" className="font-headline-lg text-on-surface text-balance">Bind the lantern. Choose the vessel.</h2>
                <p className="font-body-md text-on-surface-variant text-pretty">Four bindings. The Inquisitor's chronicle ships in three of them. The lantern only in one.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-stretch">
                {editions.map((ed) => {
                  const cardCls = ed.featured
                    ? "bg-surface-container-low border border-secondary/40 hover:-translate-y-1 transition-all duration-300 rounded-xl p-6 flex flex-col group relative overflow-hidden red-glow"
                    : "bg-surface-container-low border border-surface-container-highest hover:border-secondary/40 transition-all duration-300 hover:-translate-y-1 rounded-xl p-6 flex flex-col group relative overflow-hidden";
                  const numeralCls = ed.featured
                    ? "absolute top-4 right-5 font-headline-lg italic text-error red-glow-text text-3xl tabular-nums leading-none"
                    : "absolute top-4 right-5 font-headline-lg italic text-secondary/40 text-3xl tabular-nums leading-none";
                  const iconExtraCls = ed.featured ? "mt-8" : "";
                  return (
                    <article key={ed.numeral} className={cardCls}>
                      {ed.featured && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-DEFAULT bg-secondary/15 border border-secondary/40 text-secondary text-[10px] uppercase tracking-widest font-label-sm">Most chosen</span>
                      )}
                      <span aria-hidden="true" className={numeralCls}>{ed.numeral}</span>
                      <span className={`material-symbols-outlined text-secondary mb-4 ${iconExtraCls}`} style={{ fontSize: "32px" }} aria-hidden="true">{ed.icon}</span>
                      <h3 className="font-headline-md italic text-on-surface text-2xl mb-1">{ed.title}</h3>
                      <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-4">{ed.sub}</p>
                      <ul className="space-y-1.5 text-sm text-on-surface-variant mb-6 flex-1">
                        {ed.perks.map((p, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5" aria-hidden="true">check_circle</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="font-headline-md italic text-secondary tabular-nums leading-none mb-4">{ed.price}</p>
                      <a href="#" className="font-label-sm text-secondary uppercase tracking-widest inline-flex items-center gap-1 hover:text-secondary-fixed transition-colors">
                        Wishlist <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="studio" aria-labelledby="studio-title" className="py-24 px-margin-page bg-surface-container scroll-mt-32 border-y border-surface-container-highest">
            <div className="max-w-3xl mx-auto text-center flex flex-col gap-stack-md">
              <h2 id="studio-title" className="font-headline-lg text-on-surface text-balance">Crafted by Ravenlight Studios</h2>
              <p className="font-body-md text-on-surface-variant max-w-[65ch] mx-auto text-pretty">
                We are a small, passionate indie team dedicated to creating atmospheric, challenging experiences that respect the player's intelligence. Founded in 2024, our mission is to resurrect the uncompromising design of classic gothic adventures with modern fidelity.
              </p>
            </div>
          </section>

          {/* Section: Relics — B&W image strip with alternating glitch / colour bleed */}
          <section id="relics" aria-labelledby="relics-title" className="py-20 scroll-mt-32 bg-primary-container">
            <div className="text-center space-y-stack-md mb-8 px-margin-page">
              <p className="font-label-sm text-secondary uppercase tracking-[0.3em] emerald-glow-text">— Plates · Recovered</p>
              <h2 id="relics-title" className="font-headline-lg text-on-surface text-balance">Eight relics, found in the dark.</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 px-3 md:px-6">
              {relics.map((r, i) => {
                const isOdd = i % 2 === 1;
                const imgCls = isOdd
                  ? "w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                  : "w-full h-full object-cover grayscale opacity-90 contrast-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700";
                return (
                  <figure key={i} className="aspect-square rounded-DEFAULT border border-surface-container-highest overflow-hidden bg-primary-container relative group">
                    <img src={r.src} alt={r.alt} loading="lazy" className={imgCls} width="600" height="600" />
                    {isOdd ? (
                      <>
                        <div className="absolute inset-0 mix-blend-multiply pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(11,28,16,0.55) 0%, rgba(8,40,22,0.85) 60%, rgba(31,1,0,0.7) 100%)" }}></div>
                        <div className="absolute inset-0 mix-blend-screen pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(127,199,116,0.35) 0%, transparent 70%)" }}></div>
                        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 4px)" }}></div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/70 via-transparent to-transparent pointer-events-none"></div>
                    )}
                    <span className="absolute bottom-2 left-2 right-2 text-[9px] uppercase tracking-widest text-on-surface-variant bg-primary-container/70 border border-secondary/20 px-2 py-1 backdrop-blur-sm font-label-sm">{r.label}</span>
                  </figure>
                );
              })}
            </div>
          </section>
        </main>

        <footer className="w-full py-20 bg-surface-container-lowest flex flex-col items-center gap-8 px-margin-page">
          <div className="max-w-container-max mx-auto w-full flex flex-col items-center gap-8">
            <nav className="flex flex-wrap justify-center gap-8 font-headline-md text-sm tracking-widest text-on-surface-variant" aria-label="Footer navigation">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="hover:text-secondary transition-colors duration-300 opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest rounded-DEFAULT px-2 py-1">
                  {l}
                </a>
              ))}
            </nav>
            <p className="font-headline-md text-sm tracking-widest text-on-surface-variant opacity-50 text-center text-balance tabular-nums">
              © 2024 Ravenlight Studios. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
