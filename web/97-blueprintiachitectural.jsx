export default function T97Blueprintiachitectural() {
  const navLinks = [
    { label: "PROJECTS", href: "#projects", active: true },
    { label: "STUDIO", href: "#studio" },
    { label: "PROCESS", href: "#process" },
    { label: "CONTACT", href: "#contact" },
  ];

  const projects = [
    {
      id: "PRJ.01", title: "The Ridge House", year: "2023", loc: "ASPEN, CO", area: "4,200 SQ FT",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxBkUw5_SULdhpgYJ5R6AQC7LS2PAJ9OESB-jOO5HijTsr2Kg8KgRIGIeZardO-PKGnkNvVhAtHRwveo3dD8WFKM-I52I93UPmCXD0zlo7-4RjNm4ohtQD9fmRtzGwaJWXYI0t99npQUgrEg0bmLVPpovClgtr0HFgyk1NM54-J8IAjZbkJS-6QYCVsy9evN_TRKpIgkSTMyRHRkq0jlLGq1l0EUwxD3rNsG-hLglmuSl99AcnioXPcBg5ylsOE83_27Q0qRQWzag",
      tickClass: "tick-tl",
    },
    {
      id: "PRJ.02", title: "Coastal Pavilion", year: "2022", loc: "BIG SUR, CA", area: "1,800 SQ FT",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIQ-qsCET7Sg-CjYwfKNzMCWLXtsa8X8WRvhSQfj9BaEDEgc4CqRdnRxqeSc_EBbvNRPIYjjoi7TgnQhbyZRCLxtcvHl5WuUNVkQ1zDCSi-Sy9Pbw3ASDr4f0SWr5u-EJ16xOSyxD58WXY5Rg_BVMzwLWLby8_XQTtKcGaaLJ8z3Qgu08E3Q9gZgFTgnRmNRyiH9e3hS10HJjWoAhzLq0fZXTsCWHrzVR6AIMY-fYK8Xy3m2hdVMF-gO5NdBsNYJiJzBdXFkP88X8",
    },
  ];

  const draftProject = {
    id: "PRJ.03", title: "Urban Infill 04", year: "IN PROG", loc: "SEATTLE, WA", area: "TBD",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB25ih1H5euZn2vRYF36S2AKcu84ZVeBz_dbGh683lUGVKAyRp7cIz0xpC8YH2JYkClX54FrdkB_2bDT4yih3-sriVBJJCyQ0OdsF9ELEIcJgeZpV8rKB1p-ObtUdAGmcyZNf7CQ_ecKf7iMqLpTs62nGCrYxV906SRyd0aw9NpWzYwAiYjkBWIxESG04RaRaGAt7m6fMY0L0QenEUiH1uaiggFYP_enO2g-XakQR9gjm9qXUXOeTeATFKdJ1wO2NTPRme0g6lTbGQ",
  };

  const steps = [
    { n: "01", icon: "terrain", title: "SITE ANALYSIS", body: "Topographical mapping, solar studies, and contextual integration assessment." },
    { n: "02", icon: "draw", title: "SCHEMATIC DESIGN", body: "Massing studies, spatial flow diagrams, and initial structural concepts." },
    { n: "03", icon: "square_foot", title: "CONSTRUCTION DOCS", body: "Rigorous detailing, material specifications, and comprehensive drafting sets." },
    { n: "04", icon: "engineering", title: "SITE VISIT", body: "Construction administration, quality control, and built-environment verification." },
  ];

  const footerLinks = ["SPECIFICATIONS", "LEGAL", "ARCHIVE"];

  const materials = [
    { id: "MTL.01", title: "BOARD-FORMED CONCRETE", spec: [["FINISH", "NATURAL CURE"], ["DENSITY", "2,400 KG/M³"], ["SOURCE", "CASCADIA AGGREGATES"]], img: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=900&q=85&auto=format&fit=crop", alt: "Board-formed concrete facade in raking light", filter: "grayscale-[15%]", stamp: "In Stock", tickClass: "tick-tl tick-br", offset: "" },
    { id: "MTL.02", title: "RIFT-SAWN WHITE OAK", spec: [["FINISH", "HARDWAX OIL"], ["JANKA", "1,360 LBF"], ["SOURCE", "OREGON COAST RANGE"]], img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&q=85&auto=format&fit=crop", alt: "Rift-sawn white oak floor in raking light", filter: "", stamp: "FSC Cert.", tickClass: "tick-tr", offset: "md:translate-y-8 lg:translate-y-12" },
    { id: "MTL.03", title: "PATINATED COPPER", spec: [["FINISH", "NATURAL VERDIGRIS"], ["GAUGE", "16 OZ / 0.55MM"], ["SOURCE", "REVERE COPPER"]], img: "https://images.unsplash.com/photo-1527844817887-9b937993518b?w=900&q=85&auto=format&fit=crop", alt: "Patinated copper sheet", filter: "", stamp: "Patina · 5yr", tickClass: "tick-bl", offset: "" }
  ];

  const microMaterials = [
    { num: "№ 04", title: "Cor-Ten Steel", img: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=200&q=85&auto=format&fit=crop", alt: "Cor-Ten Steel", imgClass: "grayscale" },
    { num: "№ 11", title: "Honed Limestone", img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=200&q=85&auto=format&fit=crop", alt: "Limestone", imgClass: "" },
    { num: "№ 18", title: "Cast Bronze", img: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=200&q=85&auto=format&fit=crop", alt: "Cast bronze", imgClass: "sepia-[40%]" },
    { num: "№ 27", title: "Smooth Stucco", img: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=200&q=85&auto=format&fit=crop", alt: "Stucco", imgClass: "" }
  ];

  const awards = [
    { seal: { abbr: "RIBA", year: "'23", line: "SHORTLIST" }, source: "Royal Institute", title: "Stephen Lawrence Prize Shortlist", meta: "For The Ridge House · Aspen, CO", rotate: "" },
    { seal: { abbr: "DEZN", year: "'23", line: "PROJECT" }, source: "Dezeen Magazine", title: "Project of the Day · Coastal Pavilion", meta: "Featured · 14 May 2023", rotate: "rotate(6deg)" },
    { seal: { abbr: "WALL", year: "'22", line: "PAPER*" }, source: "Wallpaper* Magazine", title: "House of the Year · Honourable", meta: "Issue 296 · November 2022", rotate: "rotate(-12deg)" }
  ];

  const trustLogos = [
    { slug: "autodesk", name: "Autodesk" },
    { slug: "framer", name: "Framer" },
    { slug: "figma", name: "Figma" },
    { slug: "notion", name: "Notion" },
    { slug: "behance", name: "Behance" },
    { slug: "dribbble", name: "Dribbble" },
    { slug: "vimeo", name: "Vimeo" },
    { slug: "pinterest", name: "Pinterest" },
  ];

  const pillars = [
    { id: "PIL.01", img: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=1200&q=85&auto=format&fit=crop", alt: "Geometric metallic facade in raking light", tickClass: "tick-tl", title: "Site & brief", body: "Topology readings, sun studies, and a single-page brief drafted on tracing paper before a line is committed." },
    { id: "PIL.02", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop", alt: "Minimal interior — drafting in volume", tickClass: "tick-tr", title: "Drawing first", body: "Plans, sections, and elevations at scale 1:50. The model exists to validate the drawing — not the other way around." },
    { id: "PIL.03", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=85&auto=format&fit=crop", alt: "Interior with rift-sawn oak floor and warm light", tickClass: "tick-bl", title: "Material honesty", body: "Every specimen handled in the studio before it lands on a sheet. We do not specify what we have not held." },
    { id: "PIL.04", img: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1200&q=85&auto=format&fit=crop", alt: "Modernist interior gallery — realised work", tickClass: "tick-br", title: "On-site delivery", body: "Weekly site visits, mock-ups before pours, and revision logs that follow the contractor's clipboard, not ours." },
  ];

  const folio = [
    { n: "01", title: "The Ridge House", loc: "Aspen, CO · 2023", img: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=600&q=85&auto=format&fit=crop", alt: "The Ridge House — gallery interior" },
    { n: "02", title: "Coastal Pavilion", loc: "Big Sur, CA · 2022", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=85&auto=format&fit=crop", alt: "Coastal Pavilion — minimal volume" },
    { n: "03", title: "North Atelier", loc: "Portland, OR · 2022", img: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=600&q=85&auto=format&fit=crop", alt: "North Atelier — facade study" },
    { n: "04", title: "Mill Bend House", loc: "Hood River, OR · 2021", img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=85&auto=format&fit=crop", alt: "Mill Bend House — living volume" },
    { n: "05", title: "Quarry Studio", loc: "Marfa, TX · 2020", img: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=600&q=85&auto=format&fit=crop", alt: "Quarry Studio — light study" },
    { n: "06", title: "Cedar Hollow Cabin", loc: "Methow Valley, WA · 2019", img: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=600&q=85&auto=format&fit=crop", alt: "Cedar Hollow Cabin — facade aperture" },
  ];

  const clippings = [
    { source: "The New York Times", title: "\"Quietly radical.\"", img: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=900&q=85&auto=format&fit=crop", alt: "Magazine spread of architectural feature" },
    { source: "Domus", title: "\"On the line.\"", img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=900&q=85&auto=format&fit=crop", alt: "Drafting interview portrait" },
    { source: "Wallpaper*", title: "\"Drawing first.\"", img: "https://images.unsplash.com/photo-1576250670488-4a00a3ed480e?w=900&q=85&auto=format&fit=crop", alt: "Studio interview reportage" }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-container-highest": "#e5e2e1", "surface-bright": "#fcf9f8", "on-tertiary": "#ffffff",
            "inverse-primary": "#93cef2", "on-tertiary-container": "#ffe1de", "primary-container": "#2f6e8e",
            "on-primary-fixed": "#001e2c", "tertiary-fixed-dim": "#ffb3ad", "secondary-fixed-dim": "#afcbd7",
            "inverse-surface": "#313030", "on-primary-fixed-variant": "#004c69", "inverse-on-surface": "#f3f0ef",
            "on-surface": "#1c1b1b", "outline-variant": "#c0c7ce", "on-secondary-fixed": "#011f28",
            "error-container": "#ffdad6", "surface": "#fcf9f8", "secondary-container": "#c8e4f0",
            "on-surface-variant": "#40484d", "background": "#fcf9f8", "on-error-container": "#93000a",
            "tertiary": "#a0111a", "on-tertiary-fixed-variant": "#920213", "primary": "#095674",
            "surface-container": "#f0edec", "primary-fixed-dim": "#93cef2", "on-tertiary-fixed": "#410004",
            "surface-container-lowest": "#ffffff", "primary-fixed": "#c4e7ff", "surface-variant": "#e5e2e1",
            "error": "#ba1a1a", "on-secondary-container": "#4c6771", "secondary": "#48626d",
            "on-background": "#1c1b1b", "on-secondary": "#ffffff", "on-primary-container": "#cfebff",
            "secondary-fixed": "#cbe7f3", "outline": "#71787e", "on-error": "#ffffff",
            "surface-dim": "#dcd9d9", "surface-container-high": "#ebe7e7", "on-secondary-fixed-variant": "#304a54",
            "tertiary-container": "#c32e2f", "on-primary": "#ffffff", "surface-container-low": "#f6f3f2",
            "tertiary-fixed": "#ffdad7", "surface-tint": "#236584", "grid-line": "#BAD6E2", "revision-red": "#C93333",
            "ochre": "#D4A24A", "ochre-dark": "#A87E2E", "ochre-light": "#E8C281", "ochre-bg": "#FBF3DD"
          },
          spacing: {
            "base": "8px", "gutter": "clamp(1.5rem, 3vw, 2rem)", "margin": "clamp(3rem, 5vw, 4rem)", "grid-size": "32px"
          },
          fontFamily: {
            "body-lg": ["Space Grotesk", "system-ui", "sans-serif"],
            "technical-data": ["Space Grotesk", "system-ui", "sans-serif"],
            "headline-md": ["Newsreader", "Georgia", "serif"],
            "display-xl": ["Newsreader", "Georgia", "serif"],
            "body-md": ["Space Grotesk", "system-ui", "sans-serif"],
            "headline-lg": ["Newsreader", "Georgia", "serif"],
            "label-caps": ["Space Grotesk", "system-ui", "sans-serif"]
          },
          fontSize: {
            "body-lg": ["clamp(1.125rem, 2vw, 1.25rem)", { lineHeight: "1.6", fontWeight: "400" }],
            "technical-data": ["clamp(0.75rem, 1vw + 0.5rem, 0.875rem)", { lineHeight: "1.2", fontWeight: "400" }],
            "headline-md": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.3", fontWeight: "400" }],
            "display-xl": ["clamp(3rem, 6vw + 1rem, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
            "body-md": ["clamp(1rem, 1.5vw + 0.5rem, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }],
            "headline-lg": ["clamp(2rem, 4vw + 1rem, 2.5rem)", { lineHeight: "1.2", fontWeight: "500" }],
            "label-caps": ["0.75rem", { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "600" }]
          }
        }
      }
    }
  `;

  const styles = `
    :root { scroll-padding-top: 5rem; }
    /* Drafting-paper grid: medium 32px + fine 8px micro (heavy 128px major dropped) */
    body {
      background-color: #F4F6F5;
      background-image:
        linear-gradient(to right, rgba(186, 214, 226, 0.55) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(186, 214, 226, 0.55) 1px, transparent 1px),
        linear-gradient(to right, rgba(186, 214, 226, 0.22) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(186, 214, 226, 0.22) 1px, transparent 1px);
      background-size: 32px 32px, 32px 32px, 8px 8px, 8px 8px;
      background-attachment: fixed;
    }
    .bg-grid-warm {
      background-color: #FBF3DD;
      background-image:
        linear-gradient(to right, rgba(212, 162, 74, 0.30) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(212, 162, 74, 0.30) 1px, transparent 1px),
        linear-gradient(to right, rgba(212, 162, 74, 0.12) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(212, 162, 74, 0.12) 1px, transparent 1px);
      background-size: 24px 24px, 24px 24px, 6px 6px, 6px 6px;
    }
    .bg-grid-press {
      background-color: #1c1b1b;
      background-image:
        linear-gradient(to right, rgba(212, 162, 74, 0.14) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(212, 162, 74, 0.14) 1px, transparent 1px),
        linear-gradient(to right, rgba(147, 206, 242, 0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(147, 206, 242, 0.06) 1px, transparent 1px);
      background-size: 48px 48px, 48px 48px, 12px 12px, 12px 12px;
    }
    .ochre-stamp {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 10px; border: 1px solid #D4A24A;
      background: rgba(251, 243, 221, 0.85); backdrop-filter: blur(4px);
      color: #A87E2E; font-size: 10px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
    }
    .award-seal {
      position: relative; width: 88px; height: 88px;
      border: 2px solid #D4A24A; border-radius: 9999px;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 2px;
      background: rgba(251, 243, 221, 0.95);
      transform: rotate(-8deg);
      box-shadow: 0 0 0 4px rgba(212, 162, 74, 0.15);
    }
    .award-seal::before {
      content: ''; position: absolute; inset: 4px;
      border: 1px dashed #D4A24A; border-radius: 9999px; pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important; scroll-behavior: auto !important;
      }
    }
    .tick-tl::before, .tick-tr::before, .tick-bl::after, .tick-br::after {
      content: ''; position: absolute; width: 10px; height: 2px;
      background-color: #2f6e8e; transform: rotate(-45deg); pointer-events: none; z-index: 20;
    }
    .tick-tl::before { top: -1px; left: -5px; }
    .tick-tr::before { top: -1px; right: -5px; }
    .tick-bl::after { bottom: -1px; left: -5px; }
    .tick-br::after { bottom: -1px; right: -5px; }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;
    }
  `;

  const ProjectCard = ({ p }) => (
    <article className={`border border-primary-container bg-surface/70 backdrop-blur-md flex flex-col group relative ${p.tickClass || ""} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary-container focus-within:ring-offset-2 focus-within:ring-offset-[#F4F6F5]`}>
      <div className="absolute top-2 right-2 font-technical-data text-[10px] text-primary-container border border-primary-container px-1 z-10 bg-surface/80 backdrop-blur-sm">{p.id}</div>
      <div className="h-64 border-b border-primary-container overflow-hidden relative p-4 flex items-center justify-center">
        <img src={p.img} alt="Architectural drawing" className="w-full h-full object-contain mix-blend-multiply opacity-80 filter grayscale sepia-[.2] hue-rotate-[180deg] saturate-[2] transition-transform duration-700 group-hover:scale-105" width="600" height="400" loading="lazy" decoding="async" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-headline-md text-body-lg font-bold mb-3 uppercase text-balance">{p.title}</h3>
        <div className="font-technical-data text-[12px] text-on-surface-variant space-y-2 mb-8">
          <div className="flex justify-between border-b border-outline-variant/30 pb-1"><span>YEAR</span> <span className="tabular-nums">{p.year}</span></div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-1"><span>LOC</span> <span>{p.loc}</span></div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-1"><span>AREA</span> <span className="tabular-nums">{p.area}</span></div>
        </div>
        <a href="#" className="mt-auto font-label-caps text-[10px] text-primary-container flex items-center gap-1.5 hover:bg-primary-container hover:text-surface w-max px-3 py-2 border border-transparent hover:border-primary-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm">
          <span className="material-symbols-outlined text-[14px]">description</span>
          VIEW DRAWING SET
        </a>
      </div>
    </article>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="light scroll-smooth text-on-surface min-h-screen relative overflow-x-hidden selection:bg-primary-container selection:text-surface">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-container focus:text-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700">
          Skip to content
        </a>

        <header className="sticky top-0 z-50 w-full border-b-2 border-cyan-700 dark:border-cyan-500 bg-[#F4F6F5]/80 backdrop-blur-md tick-bl tick-br shadow-sm transition-all">
          <nav className="flex justify-between items-center w-full px-6 lg:px-8 py-4 lg:py-6 max-w-full relative after:content-['/'] after:absolute after:right-6 lg:after:right-8 after:-bottom-[13px] lg:after:-bottom-[17px] after:text-cyan-700 after:font-mono after:font-bold">
            <div className="font-mono font-bold border-2 border-cyan-700 dark:border-cyan-500 px-3 py-1.5 leading-none text-[10px] text-cyan-700 dark:text-cyan-400 bg-surface/50 backdrop-blur-sm">
              ORDNANCE ARCHITECTS / DWG-001 / REV C
            </div>
            <div className="hidden md:flex gap-8">
              {navLinks.map(l => (
                <a key={l.label} href={l.href} className={l.active
                  ? "font-mono uppercase tracking-widest text-xs text-cyan-900 dark:text-cyan-200 border-b border-cyan-700 dark:border-cyan-500 pb-1 px-2 rounded-t-sm hover:bg-cyan-700 hover:text-white dark:hover:bg-cyan-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6F5]"
                  : "font-mono uppercase tracking-widest text-xs text-slate-500 dark:text-slate-400 pb-1 px-2 rounded-t-sm border-b border-transparent hover:border-cyan-700 hover:bg-cyan-700 hover:text-white dark:hover:bg-cyan-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6F5]"}>
                  {l.label}
                </a>
              ))}
            </div>
            <button aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-nav" className="md:hidden text-cyan-700 p-2 -mr-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6F5]">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </nav>
        </header>

        <main id="main-content" className="w-full relative z-10">
          <section className="min-h-[80vh] flex flex-col justify-center px-6 lg:px-margin pt-16 lg:pt-24 pb-12 lg:pb-16 relative">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10 items-stretch">
              <div className="bg-surface/70 backdrop-blur-md border-2 border-primary-container p-8 lg:p-12 relative tick-tl tick-br shadow-sm flex flex-col justify-center">
                <h1 className="font-display-xl text-display-xl text-on-surface mb-6 border-b border-primary-container pb-4 text-balance">
                  Houses, drawn carefully
                </h1>
                <p className="font-technical-data text-technical-data text-on-surface-variant max-w-[65ch] text-pretty">
                  // STRUCTURAL INTEGRITY MEETS MINIMALIST DESIGN. WE DRAFT SPACES THAT RESPECT THE LAND AND ELEVATE THE HUMAN EXPERIENCE THROUGH PRECISE ENGINEERING AND THOUGHTFUL PROPORTION.
                </p>
                <div className="mt-8 lg:mt-12 flex gap-4">
                  <button className="border border-primary-container bg-surface/50 backdrop-blur-sm px-6 py-3 font-label-caps text-label-caps text-primary-container hover:bg-primary-container hover:text-surface transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6F5]">
                    <span>VIEW FOLIO</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                  </button>
                </div>
              </div>

              <div className="border-2 border-primary-container bg-surface/70 backdrop-blur-md relative min-h-[300px] lg:min-h-[500px] overflow-hidden group shadow-sm flex items-center justify-center p-4 lg:p-0">
                <div className="absolute top-0 right-0 bg-primary-container text-surface px-2 py-1 font-technical-data text-[10px] z-20">ELEV-01</div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt3Ud3hjbkgkOFrUyuvNX06x_M_poFQZj6evuOVi_tgNvbsqdbj1vKVub1TkZbyihlo43Piac1HqHMwPtlnz3PHr0Vt23ploz_OFQlF_M-ZEmu1UwVv_nMOuX62CtwSbPiRnzLBj3QUfrqmfMU_lxw85ni9ZBPAqduZzbAVYS9YRc4CW5sKGNsL7NhzDkMh8AfMBBCULod_nnMQnMOIuoDQZyGLkRiJjEu4JNySGOPumvRMVbpWORvU3k_eRzQPHRdVSnTpU4zl60"
                  alt="Blueprint style architectural line drawing of a modern minimalist house elevation"
                  className="w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale contrast-125 sepia-[.2] hue-rotate-[180deg] saturate-[2]"
                  width="800" height="600" loading="eager" decoding="async"
                />
                <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
                  <div className="absolute left-[10%] top-[20%] w-[1px] h-[60%] bg-primary-container before:content-[''] before:absolute before:-top-[5px] before:-left-[4px] before:w-2 before:h-[2px] before:bg-primary-container before:rotate-45 after:content-[''] after:absolute after:-bottom-[5px] after:-left-[4px] after:w-2 after:h-[2px] after:bg-primary-container after:rotate-45"></div>
                  <div className="absolute left-[8%] top-[50%] -translate-y-1/2 -rotate-90 font-technical-data text-[10px] text-primary-container tracking-widest bg-surface/80 backdrop-blur-sm px-2">24'-0" V.I.F.</div>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="bg-grid-press py-16 lg:py-24 px-6 lg:px-margin border-t-2 border-ochre border-b-2 border-ochre relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ochre to-transparent"></div>
            <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 lg:mb-12 border-b border-ochre/40 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-light mb-2 block">// REGISTER 01 / FIELD</span>
                <h2 className="font-headline-lg text-headline-lg text-surface text-balance">SELECTED PROJECTS</h2>
              </div>
              <span className="font-technical-data text-technical-data text-ochre-light hidden sm:inline-block">SHT A-100</span>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {projects.map(p => <ProjectCard key={p.id} p={p} />)}
              <article className="border-2 border-dashed border-revision-red bg-surface/70 backdrop-blur-md flex flex-col group relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-revision-red focus-within:ring-offset-2 focus-within:ring-offset-[#F4F6F5]">
                <div className="absolute -top-3 right-4 bg-surface/90 backdrop-blur-sm text-revision-red font-mono text-[10px] px-2 py-0.5 font-bold border border-revision-red z-20">REV</div>
                <div className="absolute top-2 right-2 font-technical-data text-[10px] text-revision-red border border-revision-red px-1 z-10 bg-surface/80 backdrop-blur-sm">{draftProject.id}</div>
                <div className="h-64 border-b border-revision-red overflow-hidden relative p-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-20">
                    <span className="font-display-xl text-revision-red font-bold rotate-[-30deg] tracking-widest border-4 border-revision-red p-2">DRAFT</span>
                  </div>
                  <img src={draftProject.img} alt="Schematic massing model" className="w-full h-full object-contain mix-blend-multiply opacity-60 filter grayscale sepia-[.2] hue-rotate-[180deg] saturate-[2] transition-transform duration-700 group-hover:scale-105" width="600" height="400" loading="lazy" decoding="async" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline-md text-body-lg font-bold mb-3 uppercase text-balance">{draftProject.title}</h3>
                  <div className="font-technical-data text-[12px] text-on-surface-variant space-y-2 mb-8">
                    <div className="flex justify-between border-b border-outline-variant/30 pb-1"><span>YEAR</span> <span>{draftProject.year}</span></div>
                    <div className="flex justify-between border-b border-outline-variant/30 pb-1"><span>LOC</span> <span>{draftProject.loc}</span></div>
                    <div className="flex justify-between border-b border-outline-variant/30 pb-1"><span>AREA</span> <span>{draftProject.area}</span></div>
                  </div>
                  <a href="#" className="mt-auto font-label-caps text-[10px] text-revision-red flex items-center gap-1.5 hover:bg-revision-red hover:text-surface w-max px-3 py-2 border border-transparent hover:border-revision-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-revision-red rounded-sm">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    UNDER REVIEW
                  </a>
                </div>
              </article>
            </div>
          </section>

          <section id="studio" className="py-16 lg:py-24 px-6 lg:px-margin border-t-2 border-primary-container relative">
            <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 lg:mb-12 border-b border-primary-container pb-4">
              <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">THE STUDIO</h2>
              <span className="font-technical-data text-technical-data text-primary-container hidden sm:inline-block">SHT A-200</span>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-margin items-stretch">
              <div className="border border-primary-container p-4 bg-surface/70 backdrop-blur-md min-h-[400px] lg:min-h-[500px] relative flex items-center justify-center shadow-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3MsAyBJgDFHCUxh303YUXC6ZGykkg8e2X1U-Rcs-aOCgHvYmf4ZnzBeoctw4-8Mj_bfwR_vB5smyReX-bGk7ac9wzv7NHEBugizQQEQ3CqOt25igHybh2jTqh-EYuA5J1ZZcfk1Afjvv7lkfrS2LBheZw2Wdjbpz9vzX4fJtJ_wrdu7mQ98WwUWeLLC3RDgliApKcfIHHrh98EpRhpZjFGmVWiPXHE5R0gMR01WCQoBlC_cbPtDCo8dzNudtvi0C0Grd5DUh-cdg"
                  alt="Axonometric drawing of design studio"
                  className="w-full h-full object-cover opacity-70 mix-blend-multiply filter grayscale sepia-[.2] hue-rotate-[180deg] saturate-[2]"
                  width="800" height="800" loading="lazy" decoding="async"
                />
                <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-sm border border-primary-container px-3 py-2 font-technical-data text-[10px] text-primary-container flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
                  HQ / SEATTLE
                </div>
              </div>
              <div className="space-y-6 lg:space-y-8 bg-surface/70 backdrop-blur-md p-8 lg:p-12 border border-primary-container relative tick-tr tick-bl shadow-sm flex flex-col justify-center">
                <div className="font-mono text-primary-container text-sm border-b border-primary-container pb-2 mb-4 lg:mb-6">
                  // PHILOSOPHY_DOC_V2
                </div>
                <h3 className="font-headline-md text-on-surface leading-tight text-balance">
                  Architecture as an act of precision, not decoration.
                </h3>
                <p className="font-body-md text-on-surface-variant max-w-prose text-pretty">
                  At Ordnance Architects, we believe that the beauty of a structure lies in its logical assembly. Our practice strips away the superficial to reveal the underlying geometry and material honesty of a space.
                </p>
                <p className="font-body-md text-on-surface-variant max-w-prose text-pretty">
                  We view the blueprint not just as a set of instructions, but as the truest representation of intent. Every line drawn is a commitment to spatial integrity, environmental responsibility, and structural clarity.
                </p>
                <div className="pt-6 lg:pt-8 border-t border-outline-variant/30 mt-auto">
                  <div className="flex items-center gap-4 text-primary-container font-technical-data text-sm flex-wrap">
                    <span className="material-symbols-outlined">architecture</span>
                    <span>EST. <span className="tabular-nums">2018</span></span>
                    <span className="hidden sm:inline-block w-px h-4 bg-primary-container"></span>
                    <span>LICENSED IN WA, OR, CA</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Bar + Practice Pillars */}
          <section id="practice" className="py-16 lg:py-24 px-6 lg:px-margin border-t-2 border-primary-container relative">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between border-b border-primary-container pb-3 mb-8 lg:mb-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-container">// REGISTER 02 / TRUST</span>
                <span className="font-technical-data text-technical-data text-primary-container hidden sm:inline-block">SHT A-220</span>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-on-surface-variant mb-6">— DRAFTED &amp; PUBLISHED WITH —</p>
              <ul role="list" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-8 items-center justify-items-center bg-surface/70 backdrop-blur-md border border-primary-container px-6 py-7">
                {trustLogos.map(b => (
                  <li key={b.slug} className="flex flex-col items-center gap-2">
                    <img src={`https://cdn.simpleicons.org/${b.slug}/095674`} alt={b.name} className="h-7 w-auto" loading="lazy" decoding="async" width="28" height="28" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">{b.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="max-w-7xl mx-auto mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-gutter">
              {pillars.map(p => (
                <article key={p.id} className={`relative group overflow-hidden border-2 border-primary-container aspect-[4/3] ${p.tickClass}`}>
                  <img src={p.img} alt={p.alt} className="absolute inset-0 w-full h-full object-cover grayscale-[35%] transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" width="1200" height="900" />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/45 to-on-surface/15"></div>
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, rgba(212,162,74,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,162,74,0.12) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
                  <div className="absolute top-3 right-3 font-technical-data text-[10px] text-ochre-bg border border-ochre/70 px-2 py-0.5 bg-on-surface/40 backdrop-blur-sm">{p.id}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-light mb-2">// PRACTICE PILLAR</p>
                    <h3 className="font-headline-md text-headline-md text-surface uppercase tracking-tight leading-tight mb-2">{p.title}</h3>
                    <p className="font-technical-data text-technical-data text-surface/85 max-w-md text-pretty">{p.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Materials Library Section */}
          <section id="materials" className="bg-grid-warm py-16 lg:py-24 px-6 lg:px-margin border-t-2 border-primary-container border-b-2 border-ochre relative">
            <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 lg:mb-12 border-b border-ochre-dark pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-dark mb-2 block">// REGISTER 03 / WARM</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">MATERIAL LIBRARY</h2>
              </div>
              <span className="font-technical-data text-technical-data text-ochre-dark hidden sm:inline-block">SHT A-250</span>
            </div>

            <p className="max-w-2xl mx-auto text-center font-body-md text-on-surface-variant mb-10 lg:mb-14 text-balance">
              Forty-two specimens kept in studio rotation. Each catalogued by source, finish, and structural class. We do not specify what we have not handled.
            </p>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {materials.map(m => (
                <article key={m.id} className={`border border-ochre-dark bg-surface/85 backdrop-blur-md flex flex-col group relative ${m.tickClass} ${m.offset} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                  <div className="absolute top-2 right-2 font-technical-data text-[10px] text-ochre-dark border border-ochre-dark px-1 z-10 bg-ochre-bg">{m.id}</div>
                  <div className="aspect-[4/5] border-b border-ochre-dark overflow-hidden relative">
                    <img src={m.img} alt={m.alt} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${m.filter}`} loading="lazy" />
                    <div className="absolute bottom-3 left-3 right-3 bg-ochre-bg/95 border border-ochre-dark px-3 py-2 backdrop-blur-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-ochre-dark uppercase tracking-widest">Sample · 3"×3"</span>
                        <span className="ochre-stamp">{m.stamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-headline-md text-body-lg font-bold mb-3 uppercase">{m.title}</h3>
                    <div className="font-technical-data text-[12px] text-on-surface-variant space-y-2 mb-4">
                      {m.spec.map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-ochre/30 pb-1">
                          <span>{k}</span> <span className="tabular-nums">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="max-w-7xl mx-auto mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {microMaterials.map(m => (
                <figure key={m.num} className="group relative border border-ochre-dark bg-surface/70 backdrop-blur-md p-3 flex items-center gap-3 hover:bg-ochre-bg/60 transition-colors">
                  <div className="w-12 h-12 shrink-0 overflow-hidden border border-ochre-dark">
                    <img src={m.img} alt={m.alt} className={`w-full h-full object-cover ${m.imgClass}`} />
                  </div>
                  <figcaption className="flex-1">
                    <p className="font-mono text-[10px] text-ochre-dark uppercase tracking-widest">{m.num}</p>
                    <p className="font-bold text-sm uppercase tracking-tight">{m.title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="process" className="py-16 lg:py-24 px-6 lg:px-margin border-t-2 border-primary-container relative">
            <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 lg:mb-12 border-b border-primary-container pb-4">
              <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">METHODOLOGY</h2>
              <span className="font-technical-data text-technical-data text-primary-container hidden sm:inline-block">SHT A-300</span>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-gutter">
              {steps.map(s => (
                <div key={s.n} tabIndex={0} className="border border-primary-container bg-surface/70 backdrop-blur-md p-6 lg:p-8 flex flex-col relative group hover:bg-primary-container/85 hover:backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6F5] rounded-sm cursor-default">
                  <div className="font-display-xl text-[48px] text-primary-container opacity-20 absolute top-2 right-4 group-hover:text-surface transition-colors tabular-nums">{s.n}</div>
                  <div className="h-24 lg:h-32 border-b border-primary-container mb-6 pb-4 flex items-end group-hover:border-surface transition-colors">
                    <span className="material-symbols-outlined text-[48px] text-primary-container font-light group-hover:text-surface transition-colors" style={{ fontVariationSettings: "'wght' 200" }}>{s.icon}</span>
                  </div>
                  <h4 className="font-label-caps text-label-caps text-on-surface mb-3 group-hover:text-surface transition-colors">{s.title}</h4>
                  <p className="font-technical-data text-[12px] text-on-surface-variant group-hover:text-surface/90 transition-colors text-pretty">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Selected Work — 6-up static strip */}
          <section id="selected-work" className="py-16 lg:py-20 px-6 lg:px-margin border-t-2 border-primary-container relative">
            <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 lg:mb-12 border-b border-primary-container pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-container mb-2 block">// REGISTER 05 / FOLIO</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface text-balance">SELECTED WORK · 2018 — 2024</h2>
              </div>
              <span className="font-technical-data text-technical-data text-primary-container hidden sm:inline-block">SHT A-350</span>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-gutter">
              {folio.map(f => (
                <figure key={f.n} className="group relative">
                  <div className="relative aspect-square overflow-hidden border border-primary-container bg-surface/70">
                    <span className="absolute top-2 left-2 z-10 font-mono text-[10px] text-surface bg-primary-container px-1.5 py-0.5 tabular-nums">{f.n}</span>
                    <img src={f.img} alt={f.alt} className="w-full h-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" width="600" height="600" />
                  </div>
                  <figcaption className="pt-3 border-t border-primary-container/60 mt-2">
                    <h3 className="font-headline-md text-sm font-bold uppercase tracking-tight text-on-surface leading-tight">{f.title}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mt-1">{f.loc}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Press / Recognition Section */}
          <section id="press" className="bg-grid-press py-16 lg:py-24 px-6 lg:px-margin border-t-2 border-primary-container border-b-2 border-ochre relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ochre to-transparent"></div>

            <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 lg:mb-12 border-b border-ochre/40 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-light mb-2 block">// REGISTER 04 / EDITORIAL</span>
                <h2 className="font-headline-lg text-headline-lg text-surface text-balance">PRESS &amp; RECOGNITION</h2>
              </div>
              <span className="font-technical-data text-technical-data text-ochre-light hidden sm:inline-block">SHT A-400</span>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter">

              {/* Featured Editorial */}
              <article className="md:col-span-7 group relative">
                <div className="relative aspect-[4/3] overflow-hidden border-2 border-ochre/60">
                  <img src="https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?w=1600&q=85&auto=format&fit=crop" alt="Editorial photograph of completed home interior" className="w-full h-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                  <div className="absolute top-4 left-4 award-seal" aria-hidden="true">
                    <span className="font-mono font-bold text-[9px] tracking-widest text-ochre-dark uppercase">AIA</span>
                    <span className="font-display text-base font-bold text-ochre-dark">2024</span>
                    <span className="font-mono text-[8px] text-ochre-dark uppercase tracking-wider">HONOR</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-ochre-bg/95 border border-ochre-dark px-5 py-4 flex items-end justify-between gap-4 backdrop-blur-sm">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-dark mb-1">Architectural Record · Vol. 212</p>
                      <h3 className="font-headline-md text-on-surface font-bold uppercase tracking-tight leading-tight">"A study in restraint."</h3>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ochre-dark whitespace-nowrap">Cover · Mar 2024</span>
                  </div>
                </div>
              </article>

              {/* Awards stack */}
              <div className="md:col-span-5 flex flex-col gap-gutter">
                {awards.map((a, i) => (
                  <article key={i} className="border border-ochre/60 bg-surface/8 backdrop-blur-md p-5 flex items-center gap-5 group hover:border-ochre transition-colors">
                    <div className="award-seal shrink-0" aria-hidden="true" style={a.rotate ? { transform: a.rotate } : undefined}>
                      <span className="font-mono font-bold text-[9px] tracking-widest text-ochre-dark uppercase">{a.seal.abbr}</span>
                      <span className="font-display text-base font-bold text-ochre-dark">{a.seal.year}</span>
                      <span className="font-mono text-[8px] text-ochre-dark uppercase">{a.seal.line}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ochre-light mb-1">{a.source}</p>
                      <h4 className="font-bold text-surface uppercase tracking-tight text-base leading-tight">{a.title}</h4>
                      <p className="font-technical-data text-[12px] text-surface/70 mt-1">{a.meta}</p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Bottom clippings */}
              <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-gutter mt-4">
                {clippings.map(c => (
                  <article key={c.source} className="border border-ochre/40 bg-surface/8 backdrop-blur-md group hover:border-ochre transition-colors">
                    <div className="aspect-video overflow-hidden border-b border-ochre/40">
                      <img src={c.img} alt={c.alt} className="w-full h-full object-cover grayscale-[15%] transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-[10px] text-ochre-light uppercase tracking-widest">{c.source}</p>
                        <h5 className="font-bold text-sm text-surface mt-1">{c.title}</h5>
                      </div>
                      <span className="ochre-stamp">Read</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-ochre/40 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-ochre-light">
              <span>Selected press · 2018 — 2024</span>
              <span className="text-surface/60">42 features · 11 awards · 3 monographs</span>
              <a href="#" className="ochre-stamp hover:bg-ochre hover:text-on-surface transition-colors">Press archive →</a>
            </div>
          </section>
        </main>

        <footer className="border-t-2 border-cyan-700 dark:border-cyan-500 bg-[#F4F6F5]/90 backdrop-blur-md flex flex-col md:flex-row justify-between items-center w-full px-6 lg:px-8 py-8 lg:py-6 z-40 relative mt-12 lg:mt-24 tick-tl tick-tr gap-6">
          <div className="flex flex-col gap-2 items-center md:items-start w-full md:w-auto">
            <div className="text-cyan-800 dark:text-cyan-300 font-bold font-mono uppercase text-[10px] tracking-tight flex items-center gap-4 flex-wrap justify-center text-center">
              <span>PROJECT NO. <span className="tabular-nums">2024</span>-OA / SCALE <span className="tabular-nums">1:100</span> / NORTH ARROW ↑</span>
            </div>
            <div className="w-48 h-2 border border-cyan-700 flex bg-surface/50">
              <div className="flex-1 bg-cyan-700"></div>
              <div className="flex-1 border-r border-cyan-700"></div>
              <div className="flex-1 border-r border-cyan-700"></div>
              <div className="flex-1"></div>
            </div>
          </div>
          <div className="flex gap-6 lg:gap-8 justify-center flex-wrap">
            {footerLinks.map(l => (
              <a key={l} href="#" className="font-mono uppercase text-[10px] tracking-tight text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 px-1 py-0.5">{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
