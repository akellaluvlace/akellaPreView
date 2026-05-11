export default function T108EtherealFashionNoir() {
  const studies = [
    { num: "I", title: "Form", suffix: "01", offset: "", alt: "Form study", src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=85&auto=format&fit=crop" },
    { num: "II", title: "Light", suffix: "02", offset: "md:mt-16", alt: "Light study", src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=900&q=85&auto=format&fit=crop" },
    { num: "III", title: "Silence", suffix: "03", offset: "", alt: "Silence study", src: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=900&q=85&auto=format&fit=crop" },
  ];
  const lookbookSquares = [
    { num: "03", caption: "SHADOW / GEOMETRY", alt: "Lookbook 3", src: "https://images.unsplash.com/photo-1636471758054-06c6e8c433f7?w=1000&q=85&auto=format&fit=crop" },
    { num: "04", caption: "SPACE / DAYLIGHT", alt: "Lookbook 4", src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=1000&q=85&auto=format&fit=crop" },
    { num: "05", caption: "FIGURE / VOLTAGE", alt: "Lookbook 5", src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1000&q=85&auto=format&fit=crop" },
  ];
  const trustedBrands = [
    { slug: "hermes", alt: "Hermès" },
    { slug: "theguardian", alt: "The Guardian" },
    { slug: "telegraph", alt: "Telegraph" },
    { slug: "medium", alt: "Medium" },
    { slug: "substack", alt: "Substack" },
    { slug: "behance", alt: "Behance" },
    { slug: "vimeo", alt: "Vimeo" },
    { slug: "issuu", alt: "Issuu" },
  ];
  const trustedStats = [
    { value: "04", label: "EDITIONS" },
    { value: "12", label: "RESIDENCIES" },
    { value: "340", label: "PRESS NOTICES" },
    { value: "∞", label: "FIELD NOTES" },
  ];
  const atelierRites = [
    {
      numeral: "I", icon: "door_front", title: "Atelier Visit",
      body: "A ninety-minute conversation in the workroom. Walk the line, hold the prototypes, watch the light fall on raw cloth as it does the day a piece is decided.",
      footLabel: "DURATION", footValue: "90 MIN",
    },
    {
      numeral: "II", icon: "straighten", title: "Made to Measure",
      body: "Three fittings across a season. The pattern is cut to your geometry, the material chosen against your existing wardrobe — never as accent, only as accord.",
      footLabel: "FITTINGS", footValue: "03 · SEASON",
    },
    {
      numeral: "III", icon: "travel_explore", title: "Trunk Show",
      body: "Twice a year the archive travels — Kyoto in spring, Paris in autumn. Twelve invitations issued per city, each address handwritten, each call answered in person.",
      footLabel: "CITIES", footValue: "02 · YEAR",
    },
    {
      numeral: "IV", icon: "key", title: "Private Edit",
      body: "For those whose wardrobe predates us. We arrive, listen, withdraw — then return with a slim memorandum proposing what to keep, what to retire, what to commission.",
      footLabel: "CADENCE", footValue: "ANNUAL",
    },
  ];
  const innerCircleStats = [
    { value: "40", label: "SEATS" },
    { value: "07", label: "YEARS" },
    { value: "∞", label: "REVERENCE" },
  ];
  const innerCircleBenefits = [
    { strong: "Pre-edition access.", body: "Every garment offered to members two weeks before the public announcement." },
    { strong: "Annual residency.", body: "Three days inside the working studio, the editor's table reserved for one conversation a day." },
    { strong: "One bespoke commission per season.", body: "At the studio rate, no waitlist, the cloth chosen by hand from the Como mill." },
    { strong: "Field correspondence.", body: "A printed letter from the editor each solstice — what we are reading, mending, refusing." },
  ];
  const canvasSpecs = [
    { label: "LOCATION", value: "NEO-TOKYO" },
    { label: "AREA", value: "450 SQM" },
    { label: "VALUE", value: "ON REQUEST" },
    { label: "CADENCE", value: "ONCE / YR" },
  ];
  const canvasDossier = [
    { label: "// SLOT", value: "Q1 2027" },
    { label: "// DRAWINGS", value: "12 wks" },
    { label: "// FABRICATION", value: "28 wks" },
    { label: "// CALLS", value: "22 / yr" },
  ];
  const stripImages = [
    { id: "1527844817887-9b937993518b", alt: "Studio still life" },
    { id: "1461099059505-2dabdfc447b8", alt: "Atelier interior" },
    { id: "1591926870242-9b01d19110d0", alt: "Paper editorial" },
    { id: "1457369804613-52c61a468e7d", alt: "Workspace fragment" },
    { id: "1481627834876-b7833e8f5570", alt: "Press fragment" },
    { id: "1521405924368-64c5b84bec60", alt: "Editorial paper" },
    { id: "1495446815901-a7297e633e8d", alt: "Craft hand-detail" },
    { id: "1455390582262-044cdead277a", alt: "Paper editorial detail" },
  ];
  const mobileNavIcons = ["adjust", "grid_view", "layers", "fingerprint"];
  const footerLinks = [
    { label: "Manifesto", active: true },
    { label: "Archives" },
    { label: "Legal" },
    { label: "Connect" },
  ];
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Work+Sans:wght@400;500&family=Newsreader:ital,opsz,wght@1,6..72,400&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "primary": "#cfbcff", "on-primary": "#381e72",
                "primary-container": "#6750a4", "on-primary-container": "#e0d2ff",
                "primary-fixed": "#e9ddff", "primary-fixed-dim": "#cfbcff",
                "secondary": "#cdc0e9", "on-secondary": "#342b4b",
                "secondary-container": "#4d4465", "on-secondary-container": "#bfb2da",
                "tertiary": "#e7c365", "on-tertiary": "#3e2e00",
                "tertiary-fixed": "#ffdf93", "tertiary-fixed-dim": "#e7c365",
                "tertiary-container": "#c9a74d", "on-tertiary-container": "#503d00",
                "surface": "#141218", "on-surface": "#e6e0e9", "on-surface-variant": "#cbc4d2",
                "surface-container-lowest": "#0f0d13", "surface-container-low": "#1d1b20",
                "surface-container": "#211f24", "surface-container-high": "#2b292f",
                "surface-container-highest": "#36343a",
                "outline": "#948e9c", "outline-variant": "#494551",
                "background": "#141218", "on-background": "#e6e0e9",
                "error": "#ffb4ab"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "container-max": "1440px", "unit": "8px", "margin-edge": "64px", "section-gap": "160px", "gutter": "32px" },
              fontFamily: {
                "body-md": ["Work Sans"], "label-caps": ["Space Grotesk"],
                "headline-lg": ["Space Grotesk"], "display-2xl": ["Space Grotesk"],
                "narrative-italic": ["Newsreader"]
              },
              fontSize: {
                "body-md": ["16px", { lineHeight: "160%", letterSpacing: "0.01em", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "100%", letterSpacing: "0.2em", fontWeight: "700" }],
                "headline-lg": ["48px", { lineHeight: "110%", letterSpacing: "-0.02em", fontWeight: "600" }],
                "display-2xl": ["120px", { lineHeight: "100%", letterSpacing: "-0.04em", fontWeight: "700" }],
                "narrative-italic": ["24px", { lineHeight: "140%", fontWeight: "400" }]
              }
            }
          }
        };
      `}} />
      <div className="dark bg-background text-on-background font-body-md overflow-x-hidden selection:bg-primary selection:text-on-primary min-h-[max(884px,100dvh)]">
        <header className="fixed top-0 left-0 w-full z-50 h-16 bg-zinc-950/40 backdrop-blur-xl border-b border-white/10 shadow-none flex justify-between items-center px-8 max-w-full">
          <button className="text-zinc-100 hover:text-white transition-colors duration-500 ease-in-out cursor-none">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="text-lg font-bold tracking-[0.5em] text-zinc-50 font-sans uppercase">NEO-ALCHEMY</div>
          <button className="text-zinc-100 hover:text-white transition-colors duration-500 ease-in-out cursor-none">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </header>
        <main className="pt-16">
          <section className="relative min-h-screen flex flex-col justify-center items-center px-4 md:px-margin-edge overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img alt="Hero Background" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&q=85&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 grayscale mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
            </div>
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] z-0" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px] z-0" />
            <div className="absolute top-24 left-8 md:left-margin-edge font-label-caps text-label-caps text-on-surface-variant z-10 hidden md:flex items-center gap-3">
              <span className="w-8 h-px bg-on-surface-variant" />
              EDITION №04
            </div>
            <div className="absolute top-24 right-8 md:right-margin-edge font-label-caps text-label-caps text-tertiary z-10 hidden md:flex items-center gap-3">
              AW / 2026
              <span className="w-8 h-px bg-tertiary" />
            </div>
            <div className="relative z-10 w-full max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
              <div className="md:col-span-7 flex flex-col justify-center">
                <span className="font-label-caps text-label-caps text-tertiary mb-6 tracking-[0.4em]">[ A LIVING ARCHIVE ]</span>
                <h1 className="font-display-2xl text-display-2xl text-on-surface mb-8 relative z-20 mix-blend-difference">
                  NEO<br />ALCHEMY
                </h1>
                <div className="w-1/2 h-[1px] bg-outline mb-8" />
                <p className="font-narrative-italic text-narrative-italic text-on-surface-variant max-w-md mb-10">
                  Transmuting raw digital matter into profound aesthetic experiences. A studio of feeling, geometry, and rare material.
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <button className="px-10 py-4 bg-on-surface text-surface font-label-caps text-label-caps hover:bg-tertiary hover:text-on-tertiary transition-colors duration-500">
                    ENTER ARCHIVE
                  </button>
                  <a href="#" className="font-label-caps text-label-caps text-on-surface hover:text-tertiary transition-colors duration-300 border-b border-white/30 pb-1 inline-flex items-center gap-2">
                    VIEW LOOKBOOK
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </a>
                </div>
              </div>
              <div className="md:col-span-5 flex justify-center md:justify-end items-center relative mt-16 md:mt-0">
                <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[460px] lg:h-[460px]">
                  <div className="absolute -inset-4 rounded-full border border-white/10" />
                  <div className="absolute -inset-10 rounded-full border border-white/5" />
                  <div className="absolute inset-0 rounded-full overflow-hidden border border-white/30 shadow-[inset_0_0_80px_rgba(255,255,255,0.08),0_0_120px_rgba(207,188,255,0.18)]">
                    <img alt="Editorial portrait" src="https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=900&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-95" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-tertiary/15 mix-blend-overlay" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-background border border-white/30 px-4 py-2 font-label-caps text-label-caps text-tertiary tracking-widest">SPEC · 001</div>
                  <div className="absolute -top-3 left-8 bg-background border border-white/20 px-3 py-1 font-label-caps text-label-caps text-on-surface-variant">ATELIER</div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.4em]">SCROLL</span>
              <div className="w-px h-12 bg-gradient-to-b from-on-surface-variant to-transparent" />
            </div>
          </section>
          <section className="py-section-gap px-4 md:px-margin-edge bg-surface-container-lowest relative overflow-hidden">
            <div className="absolute -top-20 -right-32 font-display-2xl text-[280px] leading-none text-on-surface/[0.03] pointer-events-none select-none uppercase tracking-tighter hidden lg:block">FORM</div>
            <div className="max-w-container-max mx-auto text-center relative z-10">
              <span className="font-label-caps text-label-caps text-tertiary mb-6 inline-block tracking-[0.4em]">— MANIFESTO —</span>
              <h2 className="font-display-2xl text-display-2xl text-on-surface tracking-tighter uppercase mb-12">FORM IS FEELING</h2>
              <div className="mx-auto w-[1px] h-32 bg-outline-variant mb-12" />
              <p className="font-narrative-italic text-narrative-italic text-on-surface-variant max-w-2xl mx-auto mb-24">
                The architecture of thought demands rigorous geometry. We strip away the non-essential until only the pure vibration remains.
              </p>
            </div>
            <div className="max-w-container-max mx-auto relative z-10 grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {studies.map((s) => (
                <div key={s.num} className={`aspect-[3/4] relative overflow-hidden rounded-md group border border-white/10 ${s.offset}`}>
                  <img alt={s.alt} src={s.src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                  <div className="absolute top-6 left-6 font-label-caps text-label-caps text-on-surface bg-background/40 backdrop-blur-sm px-3 py-1 border border-white/20">STUDY · {s.num}</div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface italic">{s.title}</h3>
                    <span className="font-label-caps text-label-caps text-tertiary">{s.suffix}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="py-24 md:py-32 px-4 md:px-margin-edge bg-surface-container-lowest border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tertiary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-tertiary/30 to-transparent" />
            <div className="max-w-container-max mx-auto">
              <div className="text-center mb-16">
                <span className="font-label-caps text-label-caps text-tertiary tracking-[0.4em] inline-flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-tertiary/60" />
                  FEATURED IN · AW / 2026
                  <span className="w-8 h-px bg-tertiary/60" />
                </span>
                <h2 className="font-display-2xl text-3xl md:text-5xl text-on-surface tracking-tight uppercase mb-3">A Quiet Reception</h2>
                <p className="font-narrative-italic text-lg md:text-xl text-on-surface-variant italic max-w-xl mx-auto">Press notices and editorial residencies, gathered without fanfare since the first edition.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.025] backdrop-blur-xl p-8 md:p-12 shadow-[0_0_80px_rgba(231,195,101,0.05)]">
                <div className="flex flex-wrap items-center justify-center gap-x-12 md:gap-x-16 gap-y-8">
                  {trustedBrands.map((b) => (
                    <img key={b.slug} alt={b.alt} src={`https://cdn.simpleicons.org/${b.slug}/c5a059`} className="h-7 md:h-8 opacity-70 hover:opacity-100 transition-opacity duration-500" />
                  ))}
                </div>
                <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {trustedStats.map((s) => (
                    <div key={s.label}>
                      <div className="font-display-2xl text-3xl text-tertiary mb-1">{s.value}</div>
                      <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="py-section-gap px-4 md:px-margin-edge">
            <div className="max-w-container-max mx-auto">
              <div className="flex items-center gap-4 mb-16">
                <span className="font-label-caps text-label-caps text-primary">02 / ARCHIVE</span>
                <div className="h-[1px] flex-grow bg-white/10" />
                <span className="font-label-caps text-label-caps text-on-surface-variant hidden md:block">FIVE OBJECTS · ONE LANGUAGE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                <div className="md:col-span-5 md:mt-32">
                  <div className="relative group rounded-xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-4 transition-all duration-700 hover:bg-white/10 hover:shadow-[0_0_60px_rgba(103,80,164,0.18)]">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                      <img alt="Architecture" src="https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1200&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                      <div className="absolute top-4 left-4 font-label-caps text-label-caps text-tertiary bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">A · 01</div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Structure</h3>
                        <p className="font-label-caps text-label-caps text-on-surface-variant">Geometric Precision</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-7 flex flex-col gap-gutter">
                  <div className="relative group rounded-xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-4 transition-all duration-700 hover:bg-white/10 hover:shadow-[0_0_60px_rgba(231,195,101,0.18)]">
                    <div className="aspect-[16/9] rounded-lg overflow-hidden relative">
                      <img alt="Fashion Detail" src="https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=1600&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                      <div className="absolute top-4 left-4 font-label-caps text-label-caps text-tertiary bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">A · 02</div>
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div>
                          <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Adorn</h3>
                          <p className="font-label-caps text-label-caps text-on-surface-variant">Material Contrast</p>
                        </div>
                        <button className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-on-surface hover:bg-white hover:text-background transition-colors duration-300">
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter flex-1">
                    <div className="md:col-span-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-between min-h-[260px]">
                      <span className="material-symbols-outlined text-tertiary text-4xl leading-none">format_quote</span>
                      <blockquote className="font-narrative-italic text-narrative-italic text-on-surface italic leading-relaxed mt-4">
                        "A piece is never finished. It simply arrives at the moment we agree to stop interfering."
                      </blockquote>
                      <div className="flex justify-between items-end mt-6">
                        <cite className="font-label-caps text-label-caps text-on-surface-variant tracking-widest not-italic">— STUDIO NOTE · 014</cite>
                        <div className="w-12 h-px bg-tertiary/60" />
                      </div>
                    </div>
                    <div className="md:col-span-2 rounded-xl overflow-hidden border border-white/10 relative group min-h-[260px]">
                      <img alt="Detail" src="https://images.unsplash.com/photo-1622912058707-1b33af81db4f?w=900&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                      <div className="absolute top-4 left-4 font-label-caps text-label-caps text-on-surface bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">A · 02b</div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="font-label-caps text-label-caps text-on-surface-variant">DETAIL · FRAGMENT</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-4 md:mt-8">
                  <div className="relative group rounded-xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-4 transition-all duration-700 hover:bg-white/10">
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                      <img alt="Atmosphere" src="https://images.unsplash.com/photo-1762341124796-530c0085f7d8?w=1000&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                      <div className="absolute top-4 left-4 font-label-caps text-label-caps text-tertiary bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">A · 03</div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-headline-lg text-3xl text-on-surface mb-1">Atmosphere</h3>
                        <p className="font-label-caps text-label-caps text-on-surface-variant">Cinematic Air</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-4">
                  <div className="relative group rounded-xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-4 transition-all duration-700 hover:bg-white/10">
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                      <img alt="Material" src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1000&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                      <div className="absolute top-4 left-4 font-label-caps text-label-caps text-tertiary bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">A · 04</div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-headline-lg text-3xl text-on-surface mb-1">Material</h3>
                        <p className="font-label-caps text-label-caps text-on-surface-variant">Concrete Geometry</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-4 md:mt-8">
                  <div className="relative group rounded-xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-4 transition-all duration-700 hover:bg-white/10">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                      <img alt="Specimen" src="https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1000&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                      <div className="absolute top-4 left-4 font-label-caps text-label-caps text-tertiary bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">A · 05</div>
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div>
                          <h3 className="font-headline-lg text-3xl text-on-surface mb-1">Specimen</h3>
                          <p className="font-label-caps text-label-caps text-on-surface-variant">Figure / Voltage</p>
                        </div>
                        <span className="font-label-caps text-label-caps text-tertiary">RARE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-section-gap relative px-4 md:px-margin-edge">
            <div className="max-w-container-max mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <span className="font-label-caps text-label-caps text-primary">03 / LOOKBOOK</span>
                <div className="h-[1px] flex-grow bg-white/10" />
                <span className="font-label-caps text-label-caps text-on-surface-variant hidden md:block">FIVE FRAMES · ONE FREQUENCY</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                <div className="md:col-span-7 flex flex-col gap-gutter">
                  <div className="relative aspect-[16/10] rounded-md overflow-hidden border border-white/10 group">
                    <img alt="Lookbook 1" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <div className="absolute top-4 left-4 font-label-caps text-label-caps text-on-surface bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">LB · 01</div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <p className="font-label-caps text-label-caps text-on-surface-variant">FIGURE / SIDE-LIT</p>
                      <span className="font-label-caps text-label-caps text-tertiary">EDITION №04</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 min-h-[200px] rounded-md border border-white/10 bg-white/[0.02]">
                    <span className="font-label-caps text-label-caps text-tertiary mb-5 tracking-[0.45em]">— FROM THE EDITOR —</span>
                    <p className="font-narrative-italic text-narrative-italic text-on-surface italic leading-relaxed max-w-md">
                      Each frame is a held breath. The pause between intentions, where geometry and feeling agree to occupy the same body.
                    </p>
                    <div className="flex items-center gap-4 mt-7">
                      <span className="w-10 h-px bg-on-surface-variant/60" />
                      <span className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.3em]">FRAMES · 01 — 05</span>
                      <span className="w-10 h-px bg-on-surface-variant/60" />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 relative aspect-[3/4] rounded-md overflow-hidden border border-white/10 group">
                  <img alt="Lookbook 2" src="https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=1000&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  <div className="absolute top-4 left-4 font-label-caps text-label-caps text-on-surface bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">LB · 02</div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <p className="font-label-caps text-label-caps text-on-surface-variant">PORTRAIT / NOIR</p>
                  </div>
                </div>
                {lookbookSquares.map((s) => (
                  <div key={s.num} className="md:col-span-4 relative aspect-square rounded-md overflow-hidden border border-white/10 group">
                    <img alt={s.alt} src={s.src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <div className="absolute top-4 left-4 font-label-caps text-label-caps text-on-surface bg-background/50 backdrop-blur-sm px-3 py-1 border border-white/15">LB · {s.num}</div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-label-caps text-label-caps text-on-surface-variant">{s.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-section-gap px-4 md:px-margin-edge bg-surface-container-lowest relative overflow-hidden">
            <div className="absolute -bottom-32 -left-20 font-display-2xl text-[280px] leading-none text-on-surface/[0.03] pointer-events-none select-none uppercase tracking-tighter hidden lg:block">RITE</div>
            <div className="max-w-container-max mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-label-caps text-label-caps text-primary">04 / RITES</span>
                    <div className="h-[1px] w-16 bg-white/10" />
                    <span className="font-label-caps text-label-caps text-on-surface-variant">FOUR ENTRANCES</span>
                  </div>
                  <h2 className="font-display-2xl text-4xl md:text-6xl lg:text-7xl text-on-surface tracking-tighter uppercase mb-6">Ways to Enter the Studio</h2>
                  <p className="font-narrative-italic text-narrative-italic text-on-surface-variant italic max-w-lg">
                    Four rites — each a distinct cadence for meeting the work. None requires a public face. All proceed by appointment.
                  </p>
                </div>
                <div className="hidden md:flex flex-col items-end gap-2 font-label-caps text-label-caps text-on-surface-variant">
                  <span className="text-tertiary">CAPACITY · LIMITED</span>
                  <span>EDITION №04 · BY APPOINTMENT</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {atelierRites.map((r) => (
                  <div key={r.numeral} className="group relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col transition-all duration-700 hover:bg-white/[0.06] hover:border-tertiary/30 hover:shadow-[0_0_60px_rgba(231,195,101,0.12)] min-h-[420px]">
                    <div className="absolute top-6 right-6 font-label-caps text-label-caps text-on-surface-variant tracking-widest">{r.numeral}</div>
                    <div className="w-14 h-14 rounded-lg border border-tertiary/30 bg-tertiary/5 flex items-center justify-center mb-8">
                      <span className="material-symbols-outlined text-tertiary text-3xl">{r.icon}</span>
                    </div>
                    <h3 className="font-headline-lg text-2xl text-on-surface mb-3 italic">{r.title}</h3>
                    <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-6 flex-grow">{r.body}</p>
                    <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">{r.footLabel}</span>
                      <span className="font-label-caps text-label-caps text-tertiary">{r.footValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-section-gap px-4 md:px-margin-edge relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img alt="Atelier interior" src="https://images.unsplash.com/photo-1461099059505-2dabdfc447b8?w=1920&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-30 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
            </div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[140px] z-0" />
            <div className="max-w-container-max mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
              <aside className="lg:col-span-5 flex flex-col">
                <div>
                  <div className="flex items-center gap-3 mb-6 font-label-caps text-label-caps text-tertiary">
                    <span className="w-8 h-px bg-tertiary" />
                    INNER CIRCLE
                    <span className="font-label-caps text-on-surface-variant tracking-widest">· EST. 2019</span>
                  </div>
                  <h2 className="font-display-2xl text-4xl md:text-6xl text-on-surface tracking-tight uppercase mb-6 italic">Patrons of the House</h2>
                  <p className="font-narrative-italic text-narrative-italic text-on-surface italic mb-6 leading-relaxed">
                    For the forty patrons whose subscription underwrites the studio's quietest work — the mended pieces, the unsold experiments, the long winter of pattern-making before any cloth is cut.
                  </p>
                  <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-10 max-w-md">
                    Members receive every edition before announcement, an annual atelier residency, and the standing right to commission a single bespoke piece per season at the studio rate.
                  </p>
                </div>
                <div className="mt-auto pt-8 border-t border-white/15 grid grid-cols-3 gap-4 font-label-caps text-label-caps">
                  {innerCircleStats.map((s) => (
                    <div key={s.label}>
                      <div className="text-tertiary text-2xl font-bold mb-1">{s.value}</div>
                      <div className="text-on-surface-variant tracking-widest text-[10px]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </aside>
              <div className="lg:col-span-7 flex flex-col">
                <div className="rounded-xl border border-tertiary/30 bg-surface-container-low/70 backdrop-blur-2xl p-8 md:p-10 shadow-[0_0_120px_rgba(231,195,101,0.12)] flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8 pb-8 border-b border-white/10">
                    <div>
                      <div className="font-label-caps text-label-caps text-tertiary tracking-widest mb-2">SUBSCRIPTION · ANNUAL</div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display-2xl text-5xl md:text-6xl text-on-surface tracking-tighter">€8,400</span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">/ YR</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-1">SEAT</div>
                      <div className="font-headline-lg text-3xl text-tertiary">№37</div>
                      <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mt-1">/ 40</div>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {innerCircleBenefits.map((b) => (
                      <li key={b.strong} className="flex items-start gap-4 font-body-md text-sm text-on-surface">
                        <span className="material-symbols-outlined text-tertiary text-base mt-0.5">circle</span>
                        <span><strong className="text-on-surface">{b.strong}</strong> <span className="text-on-surface-variant">{b.body}</span></span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 px-8 py-4 bg-tertiary text-on-tertiary font-label-caps text-label-caps tracking-widest hover:bg-on-surface hover:text-surface transition-colors duration-500">
                      REQUEST AN INVITATION
                    </button>
                    <button className="px-8 py-4 border border-white/20 text-on-surface font-label-caps text-label-caps tracking-widest hover:border-tertiary hover:text-tertiary transition-colors duration-500">
                      READ THE LETTER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-section-gap px-4 md:px-margin-edge relative">
            <div className="absolute inset-0 w-full h-full">
              <img alt="Interior" src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1920&q=85&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-50 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
            </div>
            <div className="max-w-container-max mx-auto relative z-10 min-h-[618px] flex flex-col justify-end">
              <div className="flex items-center gap-4 mb-12">
                <span className="font-label-caps text-label-caps text-primary">05 / CANVAS</span>
                <div className="h-[1px] flex-grow bg-white/10" />
                <span className="font-label-caps text-label-caps text-on-surface-variant hidden md:block">SPACE · COMMISSIONED</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
                <aside className="lg:col-span-7 flex flex-col">
                  <div>
                    <span className="font-label-caps text-label-caps text-tertiary tracking-[0.4em] mb-6 inline-block">— A SINGLE COMMISSION —</span>
                    <h3 className="font-display-2xl text-3xl md:text-5xl lg:text-6xl text-on-surface tracking-tight uppercase mb-6 italic">A Room to Hold the Work</h3>
                    <p className="font-narrative-italic text-narrative-italic text-on-surface italic mb-6 leading-relaxed max-w-xl">
                      Once each year, the studio accepts a single spatial commission — a private gallery, a residence's reading room, a quiet corner of a hotel — to be furnished entirely from the archive.
                    </p>
                    <p className="font-body-md text-on-surface-variant text-sm leading-relaxed max-w-xl">
                      Plans drawn in graphite, materials specified in the Como mill's hand, every fixture set against a year of conversation. Not a project; a contract with patience.
                    </p>
                  </div>
                  <div className="mt-auto pt-10">
                    <div className="rounded-xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 font-mono text-xs text-on-surface-variant">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <span className="text-tertiary tracking-widest">DOSSIER · CANVAS-04</span>
                        <span className="text-on-surface-variant">v 1.2 · CONFIDENTIAL</span>
                      </div>
                      <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {canvasDossier.map((d) => (
                          <div key={d.label}>
                            <dt className="text-on-surface-variant/70 mb-1">{d.label}</dt>
                            <dd className="text-on-surface">{d.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-[14px] text-tertiary/80">verified</span>
                        <span>signed · le studio · ed. n°04</span>
                      </div>
                    </div>
                  </div>
                </aside>
                <div className="lg:col-span-5 flex flex-col">
                  <div className="bg-surface-container-low/60 backdrop-blur-2xl border border-white/10 rounded-xl p-8 shadow-2xl flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                      <h3 className="font-headline-lg text-headline-lg text-on-surface">The Canvas</h3>
                      <span className="font-label-caps text-label-caps text-primary px-3 py-1 border border-primary/30 rounded-full">AVAIL</span>
                    </div>
                    <div className="w-full h-[1px] bg-white/10 mb-8" />
                    <div className="space-y-4 mb-10">
                      {canvasSpecs.map((s) => (
                        <div key={s.label} className="flex justify-between items-center font-label-caps text-label-caps text-on-surface-variant"><span>{s.label}</span><span className="text-on-surface">{s.value}</span></div>
                      ))}
                    </div>
                    <button className="mt-auto w-full py-4 bg-on-surface text-surface font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-colors duration-300">
                      INQUIRE NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-24 md:py-28 px-4 md:px-margin-edge bg-zinc-950 border-t-2 border-tertiary">
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div>
                  <span className="font-label-caps text-label-caps text-tertiary tracking-[0.4em] mb-3 inline-block">— FIELD NOTES —</span>
                  <h2 className="font-display-2xl text-2xl md:text-4xl text-on-surface tracking-tight uppercase italic">Studio · Off-Frame</h2>
                </div>
                <p className="font-narrative-italic text-narrative-italic text-on-surface-variant italic max-w-md">Atmosphere from the worktable, gathered between editions and never published.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {stripImages.map((img) => (
                  <div key={img.id} className="aspect-square overflow-hidden rounded-md border border-white/10 group">
                    <img alt={img.alt} src={`https://images.unsplash.com/photo-${img.id}?w=600&q=80&auto=format&fit=crop`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                  </div>
                ))}
              </div>
            </div>
            {/* Gold divider above the NEO-ALCHEMY wordmark (sits in strip's bottom padding zone) */}
            <div aria-hidden="true" className="mt-16 md:mt-20 h-[2px] bg-tertiary -mx-4 md:-mx-margin-edge"></div>
          </section>
        </main>
        <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] rounded-full border border-white/10 bg-zinc-950/20 backdrop-blur-2xl shadow-2xl flex justify-around items-center h-16 px-4 z-50">
          {mobileNavIcons.map((icon, i) => (
            <button key={icon} className={(i === 0 ? "bg-white/10 text-white rounded-full p-3 " : "text-zinc-500 p-3 ") + "hover:bg-white/5 transition-all scale-95 active:scale-90 ease-in-out cursor-none"}>
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
        </nav>
        <footer className="relative w-full py-20 px-10 bg-zinc-950 border-t-2 border-tertiary z-40">
          <div className="text-4xl md:text-5xl font-black text-tertiary absolute -top-16 md:-top-20 left-4 pointer-events-none drop-shadow-[0_0_18px_rgba(197,160,89,0.35)]">NEO-ALCHEMY</div>
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <div>
              <p className="font-sans text-xs tracking-tighter uppercase text-zinc-500">© 2024 NEO-ALCHEMY. ALL RIGHTS RESERVED.</p>
            </div>
            <div className="flex flex-wrap gap-8 md:justify-end font-sans text-xs tracking-tighter uppercase">
              {footerLinks.map((l) => (
                <a key={l.label} href="#" className={l.active
                  ? "text-white border-b border-white hover:text-blue-500 transition-colors"
                  : "text-zinc-600 hover:text-blue-500 transition-colors"
                }>{l.label}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
