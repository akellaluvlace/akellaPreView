function DocHub() {
  return (
    <>
      {/* head */}
      <title>Palette API - Documentation</title>
      <meta name="description" content="Palette API - Comprehensive documentation for the color-system-as-a-service." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                "on-error": "#ffffff",
                "outline": "#787586",
                "surface-dim": "#dcd8e4",
                "on-background": "#1c1b23",
                "secondary": "#5f5e5f",
                "on-secondary-container": "#656465",
                "on-secondary": "#ffffff",
                "secondary-fixed": "#e5e2e3",
                "on-primary-container": "#faf6ff",
                "error": "#ba1a1a",
                "surface-variant": "#e5e0ed",
                "primary-fixed": "#e4dfff",
                "surface-container-lowest": "#ffffff",
                "on-tertiary-fixed": "#2f1500",
                "primary-fixed-dim": "#c6bfff",
                "surface-container": "#f0ecf8",
                "tertiary": "#884800",
                "on-tertiary-fixed-variant": "#6e3900",
                "primary": "#5341cd",
                "surface-tint": "#5847d2",
                "tertiary-fixed": "#ffdcc3",
                "surface-container-low": "#f6f2fe",
                "on-primary": "#ffffff",
                "surface-container-high": "#ebe6f2",
                "on-secondary-fixed-variant": "#474647",
                "tertiary-container": "#ac5d00",
                "tertiary-fixed-dim": "#ffb77d",
                "on-primary-fixed": "#160066",
                "primary-container": "#6c5ce7",
                "on-tertiary-container": "#fff5f1",
                "on-tertiary": "#ffffff",
                "inverse-primary": "#c6bfff",
                "surface-bright": "#fcf8ff",
                "surface-container-highest": "#e5e0ed",
                "background": "#fcf8ff",
                "on-error-container": "#93000a",
                "on-surface-variant": "#474554",
                "secondary-container": "#e5e2e3",
                "surface": "#fcf8ff",
                "error-container": "#ffdad6",
                "on-secondary-fixed": "#1c1b1c",
                "on-surface": "#1c1b23",
                "inverse-on-surface": "#f3effb",
                "outline-variant": "#c8c4d7",
                "on-primary-fixed-variant": "#4029ba",
                "secondary-fixed-dim": "#c8c6c7",
                "inverse-surface": "#312f38"
              },
              "borderRadius": {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
              },
              "spacing": {
                "toc_width": "240px",
                "stack_sm": "8px",
                "gutter": "32px",
                "nav_width": "260px",
                "content_max_width": "800px",
                "stack_lg": "48px",
                "stack_md": "16px"
              },
              "fontFamily": {
                "body-sm": ["Inter"],
                "h1": ["Inter"],
                "h3": ["Inter"],
                "label-caps": ["Inter"],
                "body-base": ["Inter"],
                "h2": ["Inter"],
                "code-base": ["JetBrains Mono"]
              },
              "fontSize": {
                "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                "h1": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                "h3": ["18px", { "lineHeight": "28px", "letterSpacing": "0em", "fontWeight": "600" }],
                "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
                "body-base": ["15px", { "lineHeight": "24px", "fontWeight": "400" }],
                "h2": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                "code-base": ["13px", { "lineHeight": "22px", "fontWeight": "400" }]
              }
            }
          }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes doc-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); }
        }
        .doc-marquee-track {
            animation: doc-marquee 60s linear infinite;
            width: max-content;
            display: flex;
            gap: 24px;
        }
        .doc-marquee-track:hover { animation-play-state: paused; }
        .doc-faq summary::-webkit-details-marker { display: none; }
        .doc-faq summary { list-style: none; }
        .doc-faq summary .doc-chevron { transition: transform 250ms ease; }
        .doc-faq[open] summary .doc-chevron { transform: rotate(90deg); }
        @media (prefers-reduced-motion: reduce) {
            .doc-marquee-track { animation: none; }
            .doc-faq summary .doc-chevron { transition: none; }
        }
` }} />

      {/* HTML had <html class="light"> + body classes — wrapped here so the React mount carries them. */}
      <div className="bg-surface text-on-surface font-body-base antialiased min-h-screen">

        {/* TopNavBar */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 h-16 font-sans text-sm antialiased text-indigo-600 dark:text-indigo-400">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white cursor-pointer active:opacity-80">Palette API</span>

            {/* Search */}
            <div className="hidden md:flex items-center group bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 hover:border-outline focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all cursor-text w-64">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm text-on-surface placeholder-on-surface-variant/50 w-full p-0" placeholder="Search documentation..." type="text" />
              <kbd className="ml-2 px-1.5 py-0.5 rounded border border-outline-variant bg-surface-container font-code-base text-[10px] text-on-surface-variant flex-shrink-0">⌘K</kbd>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer active:opacity-80 px-3 py-1.5 rounded-lg font-medium">Log in</button>
            <button className="bg-primary-container text-on-primary font-medium px-4 py-1.5 rounded-lg hover:bg-surface-tint transition-colors cursor-pointer active:opacity-80 shadow-sm">Sign up</button>
          </div>
        </header>

        {/* Main Layout Wrapper */}
        <div className="flex pt-16 min-h-screen">

          {/* SideNavBar (Left) */}
          <aside className="bg-gray-50 dark:bg-gray-900/50 text-[14px] font-sans leading-relaxed text-indigo-600 dark:text-indigo-400 fixed left-0 top-16 w-[260px] h-[calc(100vh-64px)] border-r border-gray-200 dark:border-gray-800 flex flex-col py-8 overflow-y-auto md:flex hidden">
            <div className="px-6 mb-6">
              <h3 className="font-h3 text-h3 text-on-surface mb-1">Documentation</h3>
              <span className="font-code-base text-code-base text-on-surface-variant text-[11px] bg-surface-container-high px-2 py-0.5 rounded">v1.0.4</span>
            </div>
            <nav className="flex-1 px-4 space-y-1">
              {/* Active */}
              <a className="flex items-center gap-3 py-2 px-3 rounded-lg text-indigo-600 dark:text-indigo-400 font-medium border-l-2 border-indigo-600 pl-4 bg-indigo-50/50 dark:bg-indigo-900/10 transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>Introduction</span>
              </a>
              {/* Inactive */}
              <a className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-600 dark:text-gray-400 pl-4 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Authentication</span>
              </a>
              <a className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-600 dark:text-gray-400 pl-4 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>Guides</span>
              </a>
              <a className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-600 dark:text-gray-400 pl-4 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
                <span className="material-symbols-outlined text-[18px]">api</span>
                <span>API Reference</span>
              </a>
            </nav>
            <div className="px-4 mt-auto pt-6 border-t border-outline-variant/30">
              <a className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-600 dark:text-gray-400 pl-4 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
                <span className="material-symbols-outlined text-[18px]">help</span>
                <span>Support</span>
              </a>
              <a className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-600 dark:text-gray-400 pl-4 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 ease-in-out cursor-pointer active:opacity-80" href="#">
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>Changelog</span>
              </a>
            </div>
          </aside>

          {/* Main Content (Center) */}
          <main className="flex-1 md:ml-nav_width xl:max-w-content_max_width px-8 py-12">
            <article className="max-w-prose">
              <h1 className="font-h1 text-h1 text-on-surface mb-stack_md">Getting Started with Palette API</h1>
              <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed mb-stack_lg">
                Welcome to the Palette API. We provide a comprehensive color-system-as-a-service, allowing developers to programmatically generate, manage, and distribute accessible color palettes across web, mobile, and print applications. Start integrating dynamic themes into your product in minutes.
              </p>

              <h2 id="quickstart" className="font-h2 text-h2 text-on-surface mb-stack_md border-b border-surface-variant pb-2">Quickstart</h2>
              <p className="font-body-base text-body-base text-on-surface-variant mb-stack_md">
                To interact with the API, you'll need an API key. You can create one in your dashboard after signing up. Below is a simple request to generate a complementary color palette based on a primary brand hex code.
              </p>

              {/* Code Block */}
              <div className="rounded-xl overflow-hidden bg-inverse-surface border border-outline-variant/20 shadow-sm mb-stack_lg">
                {/* Language Tabs */}
                <div className="flex items-center px-4 bg-inverse-surface border-b border-white/10">
                  <button className="font-code-base text-code-base text-inverse-on-surface px-4 py-2 border-b-2 border-primary-fixed-dim text-[13px] hover:bg-white/5 transition-colors">cURL</button>
                  <button className="font-code-base text-code-base text-inverse-on-surface/60 px-4 py-2 border-b-2 border-transparent text-[13px] hover:text-inverse-on-surface hover:bg-white/5 transition-colors">Node</button>
                  <button className="font-code-base text-code-base text-inverse-on-surface/60 px-4 py-2 border-b-2 border-transparent text-[13px] hover:text-inverse-on-surface hover:bg-white/5 transition-colors">Python</button>
                  <button className="font-code-base text-code-base text-inverse-on-surface/60 px-4 py-2 border-b-2 border-transparent text-[13px] hover:text-inverse-on-surface hover:bg-white/5 transition-colors">Ruby</button>
                </div>
                {/* Code Content */}
                <div className="p-4 relative group overflow-x-auto">
                  <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 text-inverse-on-surface p-1.5 rounded hover:bg-white/20">
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                  <pre className="font-code-base text-code-base text-inverse-on-surface/90 leading-relaxed"><code className="language-bash"><span className="text-primary-fixed-dim">curl</span> -X POST https://api.palette.dev/v1/generate \
{`  -H `}<span className="text-tertiary-fixed-dim">"Authorization: Bearer YOUR_API_KEY"</span>{` \\
  -H `}<span className="text-tertiary-fixed-dim">"Content-Type: application/json"</span>{` \\
  -d `}<span className="text-tertiary-fixed-dim">{`'{
    "base_color": "#6C5CE7",
    "strategy": "complementary",
    "steps": 5
  }'`}</span></code></pre>
                </div>
              </div>

              <h2 id="integration-steps" className="font-h2 text-h2 text-on-surface mb-stack_md border-b border-surface-variant pb-2">Integration Steps</h2>
              <div className="space-y-6 mb-stack_lg">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-h3 text-h3 text-on-surface border border-outline-variant/50">1</div>
                  <div>
                    <h3 className="font-h3 text-h3 text-on-surface mb-1">Obtain API Credentials</h3>
                    <p className="font-body-base text-body-base text-on-surface-variant">Sign up for a developer account and navigate to the <a className="text-primary-container hover:underline" href="#">API Keys section</a> to generate your live and test keys.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-h3 text-h3 text-on-surface border border-outline-variant/50">2</div>
                  <div>
                    <h3 className="font-h3 text-h3 text-on-surface mb-1">Configure your Client</h3>
                    <p className="font-body-base text-body-base text-on-surface-variant">Install our official SDKs or configure your HTTP client to include your Bearer token in the Authorization header of every request.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-h3 text-h3 text-on-surface border border-outline-variant/50">3</div>
                  <div>
                    <h3 className="font-h3 text-h3 text-on-surface mb-1">Make your First Call</h3>
                    <p className="font-body-base text-body-base text-on-surface-variant">Test your integration using the test mode keys to verify your payload structure before moving to production.</p>
                  </div>
                </div>
              </div>

              {/* Next Steps Callout */}
              <div className="bg-surface-container-low border border-primary-container/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
                <h3 className="font-h3 text-h3 text-on-surface mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                  Next Steps
                </h3>
                <p className="font-body-base text-body-base text-on-surface-variant mb-4">
                  Ready to dive deeper? Explore our guides to understand color contrast algorithms, accessibility compliance, and webhook integrations.
                </p>
                <div className="flex gap-3">
                  <button className="bg-white border border-outline-variant text-on-surface font-medium px-4 py-2 rounded-lg hover:bg-surface-container transition-colors shadow-sm font-body-sm text-body-sm">View Guides</button>
                  <button className="text-primary-container hover:text-surface-tint font-medium px-4 py-2 rounded-lg transition-colors font-body-sm text-body-sm flex items-center gap-1">
                    API Reference
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Section: Themes in Production (image strip / marquee) */}
            <section id="themes" className="mt-stack_lg pt-stack_lg border-t border-outline-variant/40" aria-labelledby="themes-heading">
              <div className="flex items-end justify-between gap-4 mb-stack_md">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1">/ in production</span>
                  <h2 id="themes-heading" className="font-h2 text-h2 text-on-surface">Themes shipping with Palette</h2>
                </div>
                <span className="font-code-base text-[12px] text-on-surface-variant hidden sm:inline">hover · paused</span>
              </div>
              <div className="relative overflow-hidden -mx-8 px-1 py-2">
                <div className="absolute inset-y-0 left-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-surface to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-surface to-transparent"></div>
                <div className="doc-marquee-track px-8">
                  {[
                    { id: "1487958449943-2429e8be8625", name: "Venice Bank", code: "venice_bank", strategy: "linear-cool", tokens: 5, swatches: ["#0F1A4D","#3B4FA9","#7E92E0","#C9D2F2","#F4F6FB"], wash: "linear-gradient(135deg, rgba(108,92,231,0.55) 0%, rgba(83,65,205,0.30) 50%, rgba(0,0,0,0.45) 100%)" },
                    { id: "1611652022419-a9419f74343d", name: "Apothecary & Co.", code: "apothecary", strategy: "monochrome-warm", tokens: 7, swatches: ["#2F1500","#6E3900","#AC5D00","#FFB77D","#FFDCC3"], wash: "linear-gradient(135deg, rgba(255,183,125,0.45) 0%, rgba(172,93,0,0.30) 60%, rgba(0,0,0,0.45) 100%)" },
                    { id: "1517021897933-0e0319cfbc28", name: "Atrium Health", code: "atrium_health", strategy: "complementary", tokens: 6, swatches: ["#053C3A","#0E6B66","#3FB1A6","#9EE0D7","#E6F6F2"], wash: "linear-gradient(135deg, rgba(50,180,160,0.55) 0%, rgba(7,103,99,0.35) 55%, rgba(0,0,0,0.40) 100%)" },
                    { id: "1481349518771-20055b2a7b24", name: "Field Atlas", code: "field_atlas", strategy: "analogous-warm", tokens: 5, swatches: ["#1F0A0A","#7E1A1A","#C9382E","#F2A187","#FBE6DC"], wash: "linear-gradient(135deg, rgba(195,58,58,0.45) 0%, rgba(112,30,30,0.35) 60%, rgba(0,0,0,0.45) 100%)" },
                    { id: "1502672260266-1c1ef2d93688", name: "North Aperture", code: "north_aperture", strategy: "grayscale-tuned", tokens: 8, swatches: ["#0B0C0F","#1E2128","#3A3F4A","#838B9C","#D7DBE3"], wash: "linear-gradient(135deg, rgba(60,60,72,0.45) 0%, rgba(28,27,35,0.45) 60%, rgba(0,0,0,0.55) 100%)" },
                    { id: "1493663284031-b7e3aefcae8e", name: "Petal & Press", code: "petal_press", strategy: "split-complementary", tokens: 6, swatches: ["#3B0F22","#8A2A55","#D45B92","#F8B5D0","#FDE6F0"], wash: "linear-gradient(135deg, rgba(232,118,170,0.45) 0%, rgba(146,49,99,0.35) 60%, rgba(0,0,0,0.45) 100%)" },
                  ].concat([
                    { id: "1487958449943-2429e8be8625", name: "Venice Bank", code: "venice_bank", strategy: "linear-cool", tokens: 5, swatches: ["#0F1A4D","#3B4FA9","#7E92E0","#C9D2F2","#F4F6FB"], wash: "linear-gradient(135deg, rgba(108,92,231,0.55) 0%, rgba(83,65,205,0.30) 50%, rgba(0,0,0,0.45) 100%)" },
                    { id: "1611652022419-a9419f74343d", name: "Apothecary & Co.", code: "apothecary", strategy: "monochrome-warm", tokens: 7, swatches: ["#2F1500","#6E3900","#AC5D00","#FFB77D","#FFDCC3"], wash: "linear-gradient(135deg, rgba(255,183,125,0.45) 0%, rgba(172,93,0,0.30) 60%, rgba(0,0,0,0.45) 100%)" },
                    { id: "1517021897933-0e0319cfbc28", name: "Atrium Health", code: "atrium_health", strategy: "complementary", tokens: 6, swatches: ["#053C3A","#0E6B66","#3FB1A6","#9EE0D7","#E6F6F2"], wash: "linear-gradient(135deg, rgba(50,180,160,0.55) 0%, rgba(7,103,99,0.35) 55%, rgba(0,0,0,0.40) 100%)" },
                    { id: "1481349518771-20055b2a7b24", name: "Field Atlas", code: "field_atlas", strategy: "analogous-warm", tokens: 5, swatches: ["#1F0A0A","#7E1A1A","#C9382E","#F2A187","#FBE6DC"], wash: "linear-gradient(135deg, rgba(195,58,58,0.45) 0%, rgba(112,30,30,0.35) 60%, rgba(0,0,0,0.45) 100%)" },
                    { id: "1502672260266-1c1ef2d93688", name: "North Aperture", code: "north_aperture", strategy: "grayscale-tuned", tokens: 8, swatches: ["#0B0C0F","#1E2128","#3A3F4A","#838B9C","#D7DBE3"], wash: "linear-gradient(135deg, rgba(60,60,72,0.45) 0%, rgba(28,27,35,0.45) 60%, rgba(0,0,0,0.55) 100%)" },
                    { id: "1493663284031-b7e3aefcae8e", name: "Petal & Press", code: "petal_press", strategy: "split-complementary", tokens: 6, swatches: ["#3B0F22","#8A2A55","#D45B92","#F8B5D0","#FDE6F0"], wash: "linear-gradient(135deg, rgba(232,118,170,0.45) 0%, rgba(146,49,99,0.35) 60%, rgba(0,0,0,0.45) 100%)" },
                  ]).map((p, i) => (
                    <figure key={i} className="shrink-0 w-72 group" aria-hidden={i >= 6 ? true : undefined}>
                      <div className="relative h-44 rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low">
                        <img className="absolute inset-0 w-full h-full object-cover grayscale contrast-105" src={`https://images.unsplash.com/photo-${p.id}?w=900&q=80&auto=format&fit=crop`} alt={i < 6 ? `${p.name} theme` : ""} loading="lazy" />
                        <div className="absolute inset-0" style={{ background: p.wash, mixBlendMode: "multiply" }}></div>
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-white/90 uppercase tracking-widest">{p.code}</span>
                          <span className="font-code-base text-[10px] bg-white/15 backdrop-blur text-white border border-white/30 rounded px-1.5 py-0.5">{p.tokens} tokens</span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex gap-1">
                          {p.swatches.map((s, j) => (
                            <span key={j} className="flex-1 h-2 rounded-sm" style={{ background: s }}></span>
                          ))}
                        </div>
                      </div>
                      <figcaption className="mt-3 flex items-center justify-between font-body-sm text-body-sm">
                        <span className="text-on-surface font-medium">{p.name}</span>
                        <span className="text-on-surface-variant font-code-base text-[12px]">{p.strategy}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-stack_md max-w-prose">A small selection of recent shipping themes — generated from a single brand hex, exported as design tokens, deployed as CSS variables &amp; iOS asset catalogs.</p>
            </section>

            {/* Section: From brand colour to palette */}
            <section id="lifecycle" className="mt-stack_lg pt-stack_lg border-t border-outline-variant/40" aria-labelledby="lifecycle-heading">
              <div className="mb-stack_md">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1">/ lifecycle</span>
                <h2 id="lifecycle-heading" className="font-h2 text-h2 text-on-surface">From brand colour to production palette</h2>
                <p className="font-body-base text-body-base text-on-surface-variant mt-2 max-w-prose">Three stages, from a designer pasting one hex code into the dashboard to a production CDN serving the resulting tokens to thousands of clients.</p>
              </div>

              {/* Row 1: image left, content right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch mb-6">
                <figure className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:min-h-[300px] rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low">
                  <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1400&q=85&auto=format&fit=crop" alt="Designer's desk with colour swatches" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/30 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-surface/85 backdrop-blur-sm border border-outline-variant rounded-lg px-3 py-1.5">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">colorize</span>
                    <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">stage_01</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    <span className="font-code-base text-[12px] bg-surface/90 backdrop-blur-sm border border-outline-variant text-on-surface px-2 py-1 rounded">#6C5CE7</span>
                    <span className="font-code-base text-[12px] bg-surface/90 backdrop-blur-sm border border-outline-variant text-on-surface px-2 py-1 rounded">strategy: complementary</span>
                    <span className="font-code-base text-[12px] bg-surface/90 backdrop-blur-sm border border-outline-variant text-on-surface px-2 py-1 rounded">steps: 5</span>
                  </div>
                </figure>
                <div className="md:col-span-5 flex flex-col justify-center gap-4 px-1">
                  <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-wider">— input</span>
                  <h3 className="font-h3 text-h3 text-on-surface">Drop a hex, pick a strategy</h3>
                  <p className="font-body-base text-body-base text-on-surface-variant">Designers paste one brand colour into the dashboard and choose a generation strategy — analogous, complementary, monochrome, split-complementary, or seeded from an uploaded image. Engineers can do the same with a single POST.</p>
                  <ul className="flex flex-col gap-2 font-body-sm text-body-sm">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary-container text-[16px] mt-0.5">check_circle</span><span>1 brand hex → 5 / 7 / 11 token steps</span></li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary-container text-[16px] mt-0.5">check_circle</span><span>Optional contrast-locks (WCAG AA &amp; AAA)</span></li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary-container text-[16px] mt-0.5">check_circle</span><span>Reproducible: same seed → same palette</span></li>
                  </ul>
                </div>
              </div>

              {/* Row 2: content left, image right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch mb-6">
                <div className="md:col-span-5 md:order-1 order-2 flex flex-col justify-center gap-4 px-1">
                  <span className="font-label-caps text-label-caps text-tertiary-container uppercase tracking-wider">— compile</span>
                  <h3 className="font-h3 text-h3 text-on-surface">Tokens, contrast-checked</h3>
                  <p className="font-body-base text-body-base text-on-surface-variant">Each generated palette is graded against WCAG, scored for perceptual evenness in OKLCH, and emitted as design tokens. Same source of truth, every platform.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-code-base text-[12px] border border-outline-variant bg-surface-container-low text-on-surface px-2 py-1 rounded-lg">CSS variables</span>
                    <span className="font-code-base text-[12px] border border-outline-variant bg-surface-container-low text-on-surface px-2 py-1 rounded-lg">Tailwind config</span>
                    <span className="font-code-base text-[12px] border border-outline-variant bg-surface-container-low text-on-surface px-2 py-1 rounded-lg">JSON tokens</span>
                    <span className="font-code-base text-[12px] border border-outline-variant bg-surface-container-low text-on-surface px-2 py-1 rounded-lg">iOS asset catalog</span>
                    <span className="font-code-base text-[12px] border border-outline-variant bg-surface-container-low text-on-surface px-2 py-1 rounded-lg">Android colors.xml</span>
                  </div>
                </div>
                <figure className="md:col-span-7 md:order-2 order-1 relative aspect-[4/3] md:aspect-auto md:min-h-[300px] rounded-xl overflow-hidden border border-outline-variant bg-inverse-surface">
                  <img className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400&q=85&auto=format&fit=crop" alt="Architectural detail" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-br from-inverse-surface/85 via-inverse-surface/70 to-inverse-surface/95"></div>
                  <div className="absolute inset-4 sm:inset-6 rounded-lg border border-white/10 bg-inverse-surface/85 p-4 sm:p-5 flex flex-col gap-2 font-code-base text-[12px] sm:text-code-base text-inverse-on-surface">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-1">
                      <span className="text-inverse-on-surface/70">tokens.css</span>
                      <span className="text-primary-fixed-dim">12 tokens · ok</span>
                    </div>
                    {[
                      { swatch: "#160066", token: "--brand-900:" },
                      { swatch: "#4029BA", token: "--brand-700:" },
                      { swatch: "#6C5CE7", token: "--brand-500:" },
                      { swatch: "#C6BFFF", token: "--brand-300:" },
                      { swatch: "#E4DFFF", token: "--brand-100:" },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-sm" style={{ background: t.swatch }}></span>
                        <span className="text-inverse-on-surface/80">{t.token}</span>
                        <span className="text-tertiary-fixed-dim">{t.swatch};</span>
                      </div>
                    ))}
                    <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-inverse-on-surface/60">contrast: AAA</span>
                      <span className="text-primary-fixed-dim">build_021</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg px-3 py-1.5">
                    <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">code</span>
                    <span className="font-label-caps text-label-caps text-white uppercase tracking-wider">stage_02</span>
                  </div>
                </figure>
              </div>

              {/* Row 3: image left, content right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch">
                <figure className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:min-h-[300px] rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low">
                  <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1400&q=85&auto=format&fit=crop" alt="Production rollout" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/40 via-transparent to-transparent mix-blend-multiply"></div>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-surface/85 backdrop-blur-sm border border-outline-variant rounded-lg px-3 py-1.5">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">cloud_done</span>
                    <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">stage_03</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                    <div className="bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-lg p-2.5">
                      <div className="font-code-base text-[10px] text-on-surface-variant uppercase tracking-widest">cdn pops</div>
                      <div className="font-h3 text-on-surface tabular-nums">214</div>
                    </div>
                    <div className="bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-lg p-2.5">
                      <div className="font-code-base text-[10px] text-on-surface-variant uppercase tracking-widest">p99</div>
                      <div className="font-h3 text-on-surface tabular-nums">31 ms</div>
                    </div>
                    <div className="bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-lg p-2.5">
                      <div className="font-code-base text-[10px] text-on-surface-variant uppercase tracking-widest">webhooks</div>
                      <div className="font-h3 text-on-surface tabular-nums">live</div>
                    </div>
                  </div>
                </figure>
                <div className="md:col-span-5 flex flex-col justify-center gap-4 px-1">
                  <span className="font-label-caps text-label-caps text-primary-container uppercase tracking-wider">— distribute</span>
                  <h3 className="font-h3 text-h3 text-on-surface">Versioned, cached, webhooked</h3>
                  <p className="font-body-base text-body-base text-on-surface-variant">Every palette gets a stable version slug, edge-cached at 214 PoPs, and emits a webhook on rotation so design systems and Storybook builds rebuild automatically. No manual export.</p>
                  <a className="text-primary-container hover:text-surface-tint font-medium font-body-sm text-body-sm flex items-center gap-1 mt-1" href="#">Read the rollout guide <span className="material-symbols-outlined text-[16px]">arrow_forward</span></a>
                </div>
              </div>
            </section>

            {/* Section: API Reference at a glance */}
            <section id="reference" className="mt-stack_lg pt-stack_lg border-t border-outline-variant/40" aria-labelledby="reference-heading">
              <div className="flex items-end justify-between gap-4 mb-stack_md flex-wrap">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1">/ reference</span>
                  <h2 id="reference-heading" className="font-h2 text-h2 text-on-surface">API at a glance</h2>
                </div>
                <a href="#" className="font-body-sm text-body-sm text-primary-container hover:text-surface-tint font-medium flex items-center gap-1">Full reference <span className="material-symbols-outlined text-[16px]">arrow_forward</span></a>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
                <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-outline-variant bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  <div className="col-span-2">Method</div>
                  <div className="col-span-5 hidden sm:block">Path</div>
                  <div className="col-span-7 sm:col-span-5">Description</div>
                </div>
                <div className="divide-y divide-outline-variant/60">
                  {[
                    { method: "POST",   pillCls: "border-emerald-300 bg-emerald-50 text-emerald-700", path: "/v1/generate",                 desc: "Generate a complete palette from a brand hex + strategy." },
                    { method: "GET",    pillCls: "border-sky-300 bg-sky-50 text-sky-700",             path: "/v1/palettes/{id}",            desc: "Retrieve a stored palette + its compiled tokens." },
                    { method: "POST",   pillCls: "border-emerald-300 bg-emerald-50 text-emerald-700", path: "/v1/palettes/{id}/tokens",     desc: "Compile tokens for one or more output formats." },
                    { method: "PATCH",  pillCls: "border-amber-300 bg-amber-50 text-amber-700",       path: "/v1/palettes/{id}",            desc: "Update strategy, contrast lock, or seed of an existing palette." },
                    { method: "GET",    pillCls: "border-sky-300 bg-sky-50 text-sky-700",             path: "/v1/contrast/check",           desc: "Run a WCAG / APCA contrast check on any colour pair." },
                    { method: "DELETE", pillCls: "border-rose-300 bg-rose-50 text-rose-700",          path: "/v1/palettes/{id}",            desc: "Soft-delete a palette. Webhooks fire; old slug 410s after 24h." },
                  ].map((r, i) => (
                    <a key={i} href="#" className="grid grid-cols-12 gap-3 px-5 py-4 hover:bg-surface-container-low transition-colors items-center">
                      <div className="col-span-2"><span className={`font-code-base text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded border ${r.pillCls}`}>{r.method}</span></div>
                      <div className="col-span-5 font-code-base text-code-base text-on-surface hidden sm:block truncate">{r.path}</div>
                      <div className="col-span-10 sm:col-span-5 font-body-sm text-body-sm text-on-surface-variant">{r.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Section: FAQ */}
            <section id="faq" className="mt-stack_lg pt-stack_lg border-t border-outline-variant/40 mb-stack_lg" aria-labelledby="faq-heading">
              <div className="mb-stack_md">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block mb-1">/ faq</span>
                <h2 id="faq-heading" className="font-h2 text-h2 text-on-surface">Common questions</h2>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest divide-y divide-outline-variant/60 overflow-hidden">
                <details className="doc-faq group p-5">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h3 className="font-h3 text-h3 text-on-surface">Is generation deterministic?</h3>
                    <span className="material-symbols-outlined doc-chevron text-on-surface-variant text-[20px] mt-0.5">chevron_right</span>
                  </summary>
                  <p className="font-body-base text-body-base text-on-surface-variant mt-3 max-w-prose">Yes. Same brand hex + same strategy + same seed always produces the same palette. Useful for reproducible builds and for diffing two palettes during a brand refresh.</p>
                </details>
                <details className="doc-faq group p-5">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h3 className="font-h3 text-h3 text-on-surface">What happens to existing tokens when a palette rotates?</h3>
                    <span className="material-symbols-outlined doc-chevron text-on-surface-variant text-[20px] mt-0.5">chevron_right</span>
                  </summary>
                  <p className="font-body-base text-body-base text-on-surface-variant mt-3 max-w-prose">Each rotation produces a new immutable version slug; the old slug stays cacheable for 24 hours, then 410s. Webhooks fire on rotation so consumers can rebuild Storybook / asset catalogs automatically.</p>
                </details>
                <details className="doc-faq group p-5">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h3 className="font-h3 text-h3 text-on-surface">Do you store our brand colours?</h3>
                    <span className="material-symbols-outlined doc-chevron text-on-surface-variant text-[20px] mt-0.5">chevron_right</span>
                  </summary>
                  <p className="font-body-base text-body-base text-on-surface-variant mt-3 max-w-prose">Only as input + your generated palettes, scoped to your workspace. There's a stateless mode (<span className="font-code-base text-[13px] bg-surface-container-low border border-outline-variant rounded px-1 py-0.5">X-Palette-Stateless: true</span>) that returns the palette without persisting anything.</p>
                </details>
                <details className="doc-faq group p-5">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h3 className="font-h3 text-h3 text-on-surface">How do contrast locks interact with strategies?</h3>
                    <span className="material-symbols-outlined doc-chevron text-on-surface-variant text-[20px] mt-0.5">chevron_right</span>
                  </summary>
                  <p className="font-body-base text-body-base text-on-surface-variant mt-3 max-w-prose">A lock declares minimum required contrast between named tokens (e.g., <span className="font-code-base text-[13px] bg-surface-container-low border border-outline-variant rounded px-1 py-0.5">on-primary</span> ≥ 4.5 against <span className="font-code-base text-[13px] bg-surface-container-low border border-outline-variant rounded px-1 py-0.5">primary</span>). The generator nudges hue + lightness within the strategy's family until the lock is satisfied. If it can't, the response includes a <span className="font-code-base text-[13px] bg-surface-container-low border border-outline-variant rounded px-1 py-0.5">contrast_warning</span> array instead of failing.</p>
                </details>
                <details className="doc-faq group p-5">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h3 className="font-h3 text-h3 text-on-surface">Are SDKs available?</h3>
                    <span className="material-symbols-outlined doc-chevron text-on-surface-variant text-[20px] mt-0.5">chevron_right</span>
                  </summary>
                  <p className="font-body-base text-body-base text-on-surface-variant mt-3 max-w-prose">Official: TypeScript, Python, Ruby, Go, Swift. Community-maintained: Rust, Elixir, .NET. The REST API is stable enough that any HTTP client works fine if your stack isn't on the list.</p>
                </details>
              </div>
            </section>
          </main>

          {/* TOC Sidebar (Right) */}
          <aside className="hidden xl:block w-toc_width fixed right-0 top-16 h-[calc(100vh-64px)] overflow-y-auto py-12 px-6">
            <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 tracking-wider">On this page</h4>
            <nav className="flex flex-col space-y-3">
              <a className="font-body-sm text-body-sm text-primary-container font-medium hover:text-surface-tint border-l-2 border-primary-container pl-3 -ml-[14px]" href="#">Getting Started</a>
              <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface pl-3" href="#quickstart">Quickstart</a>
              <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface pl-3" href="#integration-steps">Integration Steps</a>
              <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface pl-3" href="#themes">Themes in production</a>
              <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface pl-3" href="#lifecycle">Brand colour → palette</a>
              <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface pl-3" href="#reference">API at a glance</a>
              <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface pl-3" href="#faq">FAQ</a>
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}

export default DocHub;
