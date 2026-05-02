export default function T100BotanicalScientific() {
  const navLinks = [
    { label: "Catalogue", active: true },
    { label: "Seasons" },
    { label: "Journal" },
    { label: "Account" },
  ];

  const specimens = [
    {
      name: "Telephone Pea", latin: "Pisum sativum",
      sow: "Sow: Early Spring | Germ: 7-14 Days",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFaVFFkx48rMaZ_jd40xhgVhZhKZWuiD572p27CFdxwjWriQcw0-w8orNDm5hE30tracEysHtFD9idcAaHeHP2KTgzxBx2kw812e1xjnJOGM8k2OdAW43KjvhUHJZudc6F_DTC0Qb0JOtjtXzL65MsGAa3tBSoCGT7LwsAGnIMj7Fne5kY6Yi7VNxhqSyo4S6F1jC9WPV_9BypVl12KX_kPPBYX1NG_4qka9ZCqyFs1UQvwceJoMw0k4qX5sKZx5UkR-ndjLBpYX9k",
    },
    {
      name: "Oxheart Carrot", latin: "Daucus carota",
      sow: "Sow: Mid-Spring | Germ: 14-21 Days", scarce: true,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxY6FV7wZv9dOLUY-NUkBy9-W2RvKB_9TS46yrvNpxnE1tweVb888ATzNgVivfGUxKHgwjuO15apDkn0iAwcvEvpGXAUU8W3ZTcZhXmF24ZdPSr-tk4boDvKMlrFhhOmtkI6wgHXJq8EdAI-4odRfiuMikGyDiLSeZ7Y-D5HKFWPkXAxY7NrdFLsLMBe9WYpMLXRpTudwge4gesE74uA6OSwGVtvnQNacmEXV6jc20Or51FgmOgTSXXGPfmqa9GL88bJT1OWCkoxqC",
    },
    {
      name: "Legion of Honor Marigold", latin: "Tagetes patula",
      sow: "Sow: After Frost | Germ: 5-8 Days",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi8h5AP_9zvdBmrRkycbtTFjtPF4DIvRKhbsRFkNmiJlG1q_BE5lpL4KeppYD1Ura4DDe64xkXx_gNFxPB6oxlKpGbUPY8aHQGpjVxbnYPpq7q51hMBH4cF1o5HC_6OAAeKgneBTdODjhmPXhuzUvnWbKXfFFCwBS6zajXhZz34Rx3bXEKz145q9hGkH28-UvSS4xLXqzky5dtgMnu5SHux0Lya0--UqD9mFBmcFPg1iTveGZ_XscYyXWGeDIS0nmHTlHlsSPhzPMq",
    },
  ];

  const footerLinks = ["Terms of Accession", "Shipping Manifests", "Contact Curator"];

  const months = [
    { roman: "I", name: "January", desc: "Indoor / Pulses", level: 2, accent: false },
    { roman: "II", name: "February", desc: "Indoor / Brassicas", level: 3, accent: false },
    { roman: "III · Now", name: "March", desc: "Outdoor / Peas", level: 4, accent: true },
    { roman: "IV", name: "April", desc: "Outdoor / Roots", level: 5, accent: false },
    { roman: "V", name: "May", desc: "Heat lovers", level: 6, accent: false },
    { roman: "VI", name: "June", desc: "Successions", level: 4, accent: false },
    { roman: "VII", name: "July", desc: "Autumn brassicas", level: 3, accent: false, soft: true },
    { roman: "VIII", name: "August", desc: "Overwinter", level: 2, accent: false, soft: true },
    { roman: "IX", name: "September", desc: "Hardy greens", level: 3, accent: false, soft: true },
    { roman: "X", name: "October", desc: "Garlic / cover", level: 2, accent: false, soft: true },
    { roman: "XI", name: "November", desc: "Repose", level: 1, accent: false, dormant: true },
    { roman: "XII", name: "December", desc: "Planning", level: 1, accent: false, dormant: true }
  ];

  const plates = [
    { latin: "Solanum lycopersicum", family: "Solanaceae", plate: "XLII",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWc5ed4tM4w3zeq6QwgtyHqDVN_-N-e1H6BOBKvqLER9TWrXWlYIJa-vC_YQFxfkC6DoewqaNZhHTWWH5JJahtVZZ3BD5DSmfCBstpzSjbYhRFN10mqpOvtywYyhzhtLg-cG-9I4-N0DHaOUVhATEbiSUu0ocsLOQkCRc1LUw4I-UA6-alnWYX8KOzg4sVOAQ1qE8uKnHg3Rq1MIBk1-HgQ5UbIZV09K8Jvl3_gPB1g6vclgarBqohQAWAjnY5N-xXqfvjBXVt9SLx" },
    { latin: "Pisum sativum", family: "Fabaceae", plate: "XII",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFaVFFkx48rMaZ_jd40xhgVhZhKZWuiD572p27CFdxwjWriQcw0-w8orNDm5hE30tracEysHtFD9idcAaHeHP2KTgzxBx2kw812e1xjnJOGM8k2OdAW43KjvhUHJZudc6F_DTC0Qb0JOtjtXzL65MsGAa3tBSoCGT7LwsAGnIMj7Fne5kY6Yi7VNxhqSyo4S6F1jC9WPV_9BypVl12KX_kPPBYX1NG_4qka9ZCqyFs1UQvwceJoMw0k4qX5sKZx5UkR-ndjLBpYX9k" },
    { latin: "Daucus carota", family: "Apiaceae", plate: "XXIV", scarce: true,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxY6FV7wZv9dOLUY-NUkBy9-W2RvKB_9TS46yrvNpxnE1tweVb888ATzNgVivfGUxKHgwjuO15apDkn0iAwcvEvpGXAUU8W3ZTcZhXmF24ZdPSr-tk4boDvKMlrFhhOmtkI6wgHXJq8EdAI-4odRfiuMikGyDiLSeZ7Y-D5HKFWPkXAxY7NrdFLsLMBe9WYpMLXRpTudwge4gesE74uA6OSwGVtvnQNacmEXV6jc20Or51FgmOgTSXXGPfmqa9GL88bJT1OWCkoxqC" },
    { latin: "Tagetes patula", family: "Asteraceae", plate: "CIX",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi8h5AP_9zvdBmrRkycbtTFjtPF4DIvRKhbsRFkNmiJlG1q_BE5lpL4KeppYD1Ura4DDe64xkXx_gNFxPB6oxlKpGbUPY8aHQGpjVxbnYPpq7q51hMBH4cF1o5HC_6OAAeKgneBTdODjhmPXhuzUvnWbKXfFFCwBS6zajXhZz34Rx3bXEKz145q9hGkH28-UvSS4xLXqzky5dtgMnu5SHux0Lya0--UqD9mFBmcFPg1iTveGZ_XscYyXWGeDIS0nmHTlHlsSPhzPMq" }
  ];

  const letters = [
    { quote: "Found a single jar of Calabrian fava, sealed in 1952. Two seeds germinated in the warm bed. We are quiet about it.", meta: "Mar 14 · Greenhouse 2" },
    { quote: "Clematis 'Rosalind' — written off as lost in 1989 — recovered from a private estate in Cornwall. Twelve viable cuttings now in propagation.", meta: "Apr 02 · Cornwall Field" },
    { quote: "The frost arrived three weeks early. Lost the late tomato beds, but the pepper trial is undeterred. Patience is the principal virtue here.", meta: "Oct 28 · Devon Hills" }
  ];

  const monthBarColor = (m) => {
    if (m.dormant) return "bg-sepia/15";
    if (m.soft) return "bg-leaf-green/40";
    if (m.accent) return "bg-leaf-green";
    if (m.level <= 2) return "bg-leaf-green/30";
    return "bg-leaf-green";
  };

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-background": "#1e1b18", "secondary-fixed": "#ece2ca", "secondary-container": "#ece2ca",
            "surface": "#fff8f4", "surface-variant": "#e9e1dc", "on-primary-fixed-variant": "#5b4225",
            "on-tertiary-fixed": "#062101", "on-secondary-fixed": "#201b0d", "surface-tint": "#75593a",
            "primary-fixed-dim": "#e4c09a", "on-tertiary": "#ffffff", "on-tertiary-fixed-variant": "#314e25",
            "on-primary": "#ffffff", "secondary-fixed-dim": "#cfc6af", "surface-dim": "#e0d9d4",
            "surface-container": "#f4ece8", "surface-container-lowest": "#ffffff", "outline-variant": "#d2c4b8",
            "primary-container": "#5c4326", "tertiary-container": "#324f26", "primary-fixed": "#ffddba",
            "inverse-primary": "#e4c09a", "inverse-on-surface": "#f7efea", "inverse-surface": "#33302d",
            "tertiary-fixed-dim": "#aed09b", "background": "#fff8f4", "secondary": "#645e4b",
            "error-container": "#ffdad6", "on-error-container": "#93000a", "surface-container-low": "#faf2ed",
            "tertiary-fixed": "#caedb5", "primary": "#432d12", "on-surface": "#1e1b18",
            "surface-container-high": "#eee7e2", "surface-container-highest": "#e9e1dc", "on-primary-container": "#d3b18c",
            "on-surface-variant": "#4e453c", "outline": "#80756b", "on-primary-fixed": "#2a1701",
            "on-secondary-container": "#6b6451", "on-tertiary-container": "#9ec08c", "error": "#ba1a1a",
            "tertiary": "#1c3811", "on-secondary-fixed-variant": "#4c4635", "surface-bright": "#fff8f4",
            "on-error": "#ffffff", "on-secondary": "#ffffff",
            "sepia": "#5C4326", "leaf-green": "#4C6A3E", "heritage-red": "#933325", "foxing": "#A68558"
          },
          borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
          spacing: { "sm": "8px", "xs": "4px", "gutter": "24px", "xl": "64px", "md": "16px", "margin-page": "48px", "unit": "4px", "lg": "32px" },
          fontFamily: {
            "headline-md": ["Noto Serif"], "display-lg": ["Noto Serif"],
            "label-caps": ["Noto Serif"], "body-main": ["Noto Serif"]
          },
          fontSize: {
            "headline-md": ["24px", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "700" }],
            "display-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
            "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.15em", fontWeight: "700" }],
            "body-main": ["16px", { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  const styles = `
    body {
      background-color: #EFE5CD;
      background-image: radial-gradient(#A68558 0.5px, transparent 0.5px);
      background-size: 80px 80px; background-position: 0 0; position: relative;
    }
    body::before {
      content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at 15% 25%, rgba(166, 133, 88, 0.05) 0%, transparent 20%),
                  radial-gradient(circle at 85% 75%, rgba(166, 133, 88, 0.04) 0%, transparent 25%),
                  radial-gradient(circle at 50% 90%, rgba(166, 133, 88, 0.06) 0%, transparent 15%);
      pointer-events: none; z-index: -1;
    }
    .etched-border { border: 1px solid #5C4326; box-shadow: 2px 2px 0px rgba(166, 133, 88, 0.2); }
    .etched-divider { border-bottom: 0.5px solid #5C4326; }
    .double-etched-divider { border-bottom: 3px double rgba(92, 67, 38, 0.3); }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;
    }
  `;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="light font-body-main text-body-main text-sepia antialiased min-h-screen flex flex-col">
        <header className="bg-[#F5F2ED] dark:bg-[#1A1815] border-b-2 border-double border-[#5C4326]/30 border-b-[3px] z-50 sticky top-0">
          <div className="flex justify-between items-center w-full max-w-[1280px] mx-auto px-12 py-5">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl italic font-serif text-[#5C4326] dark:text-[#D9C5B2]">Cabinet &amp; Seed</span>
              <span className="hidden lg:inline-block font-serif text-[10px] uppercase tracking-[0.25em] text-[#5C4326]/50 dark:text-[#D9C5B2]/50 border-l border-[#5C4326]/30 pl-3">Botanical Archives · Est. MDCCCLXXXVIII</span>
            </div>
            <nav className="flex items-center space-x-8">
              {navLinks.map(l => (
                <a key={l.label} href="#" className={l.active
                  ? "text-[#5C4326] dark:text-[#D9C5B2] font-bold border-b border-[#5C4326] uppercase tracking-[0.2em] text-xs hover:bg-[#A68558]/5 transition-all"
                  : "text-[#5C4326]/60 dark:text-[#D9C5B2]/60 uppercase tracking-[0.2em] text-xs hover:text-[#5C4326] dark:hover:text-[#D9C5B2] hover:bg-[#A68558]/5 transition-all"}>
                  {l.label}
                </a>
              ))}
              <button className="text-[#5C4326] dark:text-[#D9C5B2] hover:bg-[#A68558]/5 transition-all ml-4 relative">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
                <span className="absolute -top-1 -right-1 bg-heritage-red text-white font-bold text-[9px] rounded-full w-4 h-4 flex items-center justify-center">2</span>
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1280px] mx-auto px-margin-page py-xl space-y-xl">
          <section className="grid grid-cols-12 gap-gutter items-center">
            <div className="col-span-8 etched-border bg-surface p-md relative">
              <img alt="vintage botanical illustration of tomato plant" className="w-full h-[600px] object-cover grayscale opacity-80 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWc5ed4tM4w3zeq6QwgtyHqDVN_-N-e1H6BOBKvqLER9TWrXWlYIJa-vC_YQFxfkC6DoewqaNZhHTWWH5JJahtVZZ3BD5DSmfCBstpzSjbYhRFN10mqpOvtywYyhzhtLg-cG-9I4-N0DHaOUVhATEbiSUu0ocsLOQkCRc1LUw4I-UA6-alnWYX8KOzg4sVOAQ1qE8uKnHg3Rq1MIBk1-HgQ5UbIZV09K8Jvl3_gPB1g6vclgarBqohQAWAjnY5N-xXqfvjBXVt9SLx" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="font-headline-md text-headline-md italic">Fig. 1 — Solanum lycopersicum</span>
                <span className="font-label-caps text-label-caps uppercase text-sepia/70">Plate XLII</span>
              </div>
            </div>
            <div className="col-span-4 flex flex-col justify-center space-y-lg pl-lg">
              <h1 className="font-display-lg text-display-lg text-sepia">Heirloom seeds, catalogued carefully.</h1>
              <p className="font-body-main text-body-main text-sepia/80 leading-relaxed">
                A curated archive of historically significant varietals, preserved for the discerning horticulturist. Each specimen rigorously sourced and documented for purity of lineage.
              </p>
              <a href="#" className="inline-flex items-center space-x-2 font-label-caps text-label-caps uppercase text-sepia border-b border-sepia pb-1 w-max hover:bg-foxing/10 transition-colors">
                <span>Browse the catalogue</span>
                <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
              </a>
            </div>
          </section>

          <div className="etched-divider w-full"></div>

          <section className="space-y-lg">
            <header className="flex justify-between items-end">
              <h2 className="font-headline-md text-headline-md text-sepia italic">Recent Accessions</h2>
              <a href="#" className="font-label-caps text-label-caps uppercase text-sepia/70 hover:text-sepia transition-colors">View All Specimens</a>
            </header>
            <div className="grid grid-cols-3 gap-gutter">
              {specimens.map(s => (
                <article key={s.name} className="etched-border bg-surface p-md flex flex-col">
                  <div className="h-64 mb-4 bg-surface-variant/30 flex items-center justify-center p-4 relative">
                    {s.scarce && <span className="absolute top-2 right-2 bg-heritage-red text-white font-label-caps text-[10px] uppercase px-2 py-1">Scarce</span>}
                    <img alt={`${s.name} illustration`} className="w-full h-full object-contain grayscale opacity-80 mix-blend-multiply" src={s.img} />
                  </div>
                  <div className="etched-divider mb-4"></div>
                  <h3 className="font-headline-md text-headline-md text-sepia mb-1">{s.name}</h3>
                  <p className="font-body-main text-body-main italic text-sepia/70 mb-4">{s.latin}</p>
                  <div className="mt-auto space-y-4">
                    <p className="font-label-caps text-label-caps uppercase text-sepia/60">{s.sow}</p>
                    <button className="w-full py-2 border border-sepia text-sepia font-label-caps text-label-caps uppercase hover:bg-foxing/10 transition-colors flex justify-center items-center space-x-2">
                      <span>Add to order</span>
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* II — Sowing Almanac */}
          <div className="etched-divider w-full"></div>
          <section className="space-y-lg">
            <header className="flex flex-col sm:flex-row justify-between items-baseline gap-2">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-foxing block mb-2">— II · Almanac</span>
                <h2 className="font-headline-md text-headline-md text-sepia italic">The Sowing Calendar</h2>
              </div>
              <p className="font-label-caps text-label-caps uppercase text-sepia/70 max-w-xs sm:text-right">Folio referencing optimal sowing windows for the temperate Northern Hemisphere</p>
            </header>

            <div className="etched-border bg-surface p-md">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-[#5C4326]/15 border-l border-t border-[#5C4326]/15">
                {months.map(m => (
                  <div key={m.name} className={`p-md flex flex-col items-start gap-2 hover:bg-foxing/5 transition-colors group ${m.accent ? "bg-foxing/5" : ""}`}>
                    <span className={`font-label-caps text-label-caps uppercase tabular-nums ${m.accent ? "text-heritage-red font-bold" : "text-sepia/50"}`}>{m.roman}</span>
                    <span className="font-headline-md text-base text-sepia italic">{m.name}</span>
                    <span className={`font-label-caps text-[10px] uppercase tracking-widest ${m.accent ? "text-heritage-red" : "text-foxing"}`}>{m.desc}</span>
                    <div className="flex gap-0.5 mt-auto">
                      {Array.from({ length: m.level }).map((_, i) => (
                        <span key={i} className={`w-1.5 h-3 ${monthBarColor(m)}`}></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-md pt-md border-t border-[#5C4326]/15 font-label-caps text-[10px] uppercase tracking-widest text-sepia/70">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-leaf-green inline-block"></span> Active sowing</span>
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-leaf-green/40 inline-block"></span> Indoor / Glass</span>
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-sepia/15 inline-block"></span> Dormant</span>
                </div>
                <span>Last revised · Plate XIV · MMXXIV</span>
              </div>
            </div>
          </section>

          {/* III — Provenance */}
          <div className="etched-divider w-full"></div>
          <section className="grid grid-cols-12 gap-gutter items-stretch">
            <div className="col-span-12 md:col-span-7 etched-border bg-surface p-md relative">
              <img alt="archive of seed packets and botanical illustrations" className="w-full h-[420px] md:h-[480px] object-cover grayscale opacity-85 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFaVFFkx48rMaZ_jd40xhgVhZhKZWuiD572p27CFdxwjWriQcw0-w8orNDm5hE30tracEysHtFD9idcAaHeHP2KTgzxBx2kw812e1xjnJOGM8k2OdAW43KjvhUHJZudc6F_DTC0Qb0JOtjtXzL65MsGAa3tBSoCGT7LwsAGnIMj7Fne5kY6Yi7VNxhqSyo4S6F1jC9WPV_9BypVl12KX_kPPBYX1NG_4qka9ZCqyFs1UQvwceJoMw0k4qX5sKZx5UkR-ndjLBpYX9k" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="font-headline-md text-base italic text-sepia">Fig. 14 — Pisum sativum cv. 'Telephone'</span>
                <span className="font-label-caps text-label-caps uppercase text-sepia/70">Plate IX</span>
              </div>
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full border border-heritage-red/60 bg-heritage-red/15 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-headline-md italic text-heritage-red text-base block leading-none">C&amp;S</span>
                  <span className="font-label-caps text-[8px] uppercase tracking-widest text-heritage-red/80">MDCCCLXXXVIII</span>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 flex flex-col justify-between gap-lg">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-foxing block mb-2">— III · Provenance</span>
                <h2 className="font-headline-md text-headline-md text-sepia italic mb-md">A practice of <span className="text-leaf-green">careful keeping.</span></h2>
                <p className="font-body-main text-body-main text-sepia/85 leading-relaxed mb-md">
                  Founded in a converted greenhouse on the edge of the Devon hills, Cabinet &amp; Seed has spent four generations preserving heirloom varietals that the modern catalogue has discarded. Every accession is hand-pollinated, hand-cleaned, and hand-packeted under the supervision of a single curator.
                </p>
                <p className="font-body-main text-body-main text-sepia/70 italic leading-relaxed">
                  &quot;We do not grow seed. We keep it — quietly, for the next gardener.&quot;
                </p>
                <p className="font-label-caps text-label-caps uppercase text-sepia/60 mt-2">— Edith Halsworth, Curator IV</p>
              </div>
              <div className="grid grid-cols-3 border-t border-l border-[#5C4326]/30">
                <div className="border-r border-b border-[#5C4326]/30 p-md text-center">
                  <div className="font-display-lg text-3xl text-sepia italic leading-none">412</div>
                  <p className="font-label-caps text-[10px] uppercase tracking-widest text-sepia/60 mt-2">Varietals in archive</p>
                </div>
                <div className="border-r border-b border-[#5C4326]/30 p-md text-center">
                  <div className="font-display-lg text-3xl text-sepia italic leading-none">1888</div>
                  <p className="font-label-caps text-[10px] uppercase tracking-widest text-sepia/60 mt-2">Year established</p>
                </div>
                <div className="border-r border-b border-[#5C4326]/30 p-md text-center">
                  <div className="font-display-lg text-3xl text-leaf-green italic leading-none">IV</div>
                  <p className="font-label-caps text-[10px] uppercase tracking-widest text-sepia/60 mt-2">Curators · since</p>
                </div>
              </div>
            </div>
          </section>

          {/* IV — Plates Folio */}
          <div className="etched-divider w-full"></div>
          <section className="space-y-lg">
            <header className="flex flex-col sm:flex-row justify-between items-baseline gap-2">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-foxing block mb-2">— IV · The Folio</span>
                <h2 className="font-headline-md text-headline-md text-sepia italic">From the Plate Library</h2>
              </div>
              <a href="#" className="font-label-caps text-label-caps uppercase text-sepia/70 hover:text-sepia transition-colors border-b border-sepia/40 pb-1">Browse all 240 plates · arrow_right_alt</a>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {plates.map(p => (
                <figure key={p.latin} className="group">
                  <div className="etched-border bg-surface aspect-[3/4] overflow-hidden flex items-center justify-center p-md relative">
                    <img alt={`${p.latin} botanical plate`} className="w-full h-full object-contain grayscale opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:scale-105" src={p.img} />
                    <span className="absolute top-2 right-2 font-label-caps text-[9px] uppercase tracking-widest text-sepia/60 bg-surface/80 px-2 py-0.5 border border-[#5C4326]/30">{p.plate}</span>
                    {p.scarce && <span className="absolute top-2 left-2 bg-heritage-red text-white font-label-caps text-[9px] uppercase px-1.5 py-0.5">Scarce</span>}
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between">
                    <span className="font-headline-md text-sm text-sepia italic">{p.latin}</span>
                    <span className="font-label-caps text-[9px] uppercase text-sepia/50">{p.family}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* V — Letters from the Curator */}
          <div className="etched-divider w-full"></div>
          <section className="grid grid-cols-12 gap-gutter">
            <div className="col-span-12 md:col-span-3">
              <span className="font-label-caps text-label-caps uppercase text-foxing block mb-2">— V · Correspondence</span>
              <h3 className="font-headline-md text-headline-md text-sepia italic">Letters from the Curator</h3>
              <p className="font-label-caps text-[10px] uppercase tracking-widest text-sepia/60 mt-2">Field notes · Vol. III</p>
            </div>
            <div className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {letters.map(l => (
                <article key={l.meta} className="etched-border bg-surface p-md relative">
                  <span className="absolute -top-3 left-4 bg-surface px-2 font-headline-md text-2xl text-sepia/30 italic">&quot;</span>
                  <p className="font-body-main text-body-main italic text-sepia/85 leading-relaxed mb-md">{l.quote}</p>
                  <div className="etched-divider mb-3"></div>
                  <p className="font-label-caps text-[10px] uppercase tracking-widest text-sepia/60">{l.meta}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="bg-[#F5F2ED] dark:bg-[#1A1815] border-t-[3px] border-double border-[#5C4326]/20 mt-24">
          <div className="max-w-[1280px] mx-auto flex flex-col items-center justify-center space-y-6 text-center border-t border-[#5C4326]/10 px-8 py-12">
            <div className="text-lg font-serif text-[#5C4326]">Cabinet &amp; Seed</div>
            <nav className="flex space-x-6">
              {footerLinks.map(l => (
                <a key={l} href="#" className="text-[#5C4326]/50 hover:text-[#5C4326] transition-colors font-serif text-[10px] uppercase tracking-widest">{l}</a>
              ))}
            </nav>
            <p className="font-serif text-[10px] uppercase tracking-widest text-[#5C4326]/70">© MDCCCLXXXVIII Cabinet &amp; Seed Botanical Archives. Printed by Hand.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
