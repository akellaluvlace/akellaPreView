const FLOWLINE_TYPED_PREFIX = "$ flowline run ";
const FLOWLINE_TYPED_QUOTED = '"Ship engineering review weekly"';
const FLOWLINE_RESULT_LINES = [
  "  → triage backlog",
  "  → notify reviewers",
  "  → draft summary in Notion",
  "  ✓ ran in 2.3s · 4 actions completed",
];

const FLOWLINE_LOGOS = [
  { name: "Atlasworks", mark: "●" },
  { name: "Pixelpath", mark: null },
  { name: "Northbeam", mark: null },
  { name: "Helix Labs", mark: "◆" },
  { name: "Cosmic.io", mark: null },
  { name: "Latticebase", mark: null },
  { name: "Spire", mark: "▲" },
  { name: "Quanta", mark: null },
  { name: "Beacon & Co", mark: null },
  { name: "Driftwood", mark: "●" },
];

const FLOWLINE_INTEGRATIONS = [
  { icon: "forum", name: "Slack", body: "Two-way thread sync. Reactions become tasks; resolution updates back to the channel." },
  { icon: "timeline", name: "Linear", body: "Issues, cycles, projects — bidirectional. Status updates write back without round-trips." },
  { icon: "code", name: "GitHub", body: "PR lifecycle, deploy events, CI signal — composed into a single ops feed." },
  { icon: "description", name: "Notion", body: "Auto-drafted summaries, weekly digests, and decision logs — written into your wiki." },
];

const FLOWLINE_PRICING_ROWS = [
  { feature: "Workflow runs / month", values: ["100", "10,000", "50,000", "Unlimited"] },
  { feature: "Real-time sync", values: [true, true, true, true] },
  { feature: "Branching workflows", values: [false, true, true, true] },
  { feature: "Audit log retention", values: ["7 days", "90 days", "1 year", "Unlimited"] },
  { feature: "SAML SSO", values: [false, false, true, true] },
  { feature: "SOC 2 Type II", values: [false, false, true, true] },
  { feature: "Dedicated support", values: ["Community", "Email", "Priority", "CSM + SLA"] },
];

const FLOWLINE_PRICING_TIERS = [
  { name: "Starter", price: "$0" },
  { name: "Team", price: "$29", highlight: true },
  { name: "Business", price: "$79" },
  { name: "Enterprise", price: "Custom" },
];

const FLOWLINE_FAQ = [
  { q: "Is there a free trial?", a: "Yes — every paid plan includes a 14-day trial with full feature access. No card required up front." },
  { q: "Can I switch plans anytime?", a: "Up- and downgrades take effect at the start of your next billing cycle. Annual plans are pro-rated to the day." },
  { q: "Do you offer SOC 2?", a: "SOC 2 Type II is included on Business and Enterprise. Reports are available under NDA via your security portal." },
  { q: "What's the data export format?", a: "JSON, NDJSON, and CSV — bulk via API, scheduled to S3-compatible buckets, or one-off from the workspace settings." },
  { q: "Does it work with self-hosted stacks?", a: "Yes — we ship a runner for self-hosted GitLab, Gitea, Mattermost, and any tool with a webhook contract." },
  { q: "How do you price seats?", a: "Per active editor, billed monthly or annually. Read-only viewers and external collaborators are always free." },
];

function FlowlineTerminal() {
  const fullCommand = FLOWLINE_TYPED_PREFIX + FLOWLINE_TYPED_QUOTED;
  const [typedIdx, setTypedIdx] = React.useState(0);
  const [revealCount, setRevealCount] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    let timer;
    const tick = (i) => {
      if (cancelled) return;
      if (i <= fullCommand.length) {
        setTypedIdx(i);
        timer = setTimeout(() => tick(i + 1), 38);
      }
    };
    tick(0);
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [fullCommand.length]);

  React.useEffect(() => {
    if (typedIdx < fullCommand.length) return;
    let cancelled = false;
    const timers = [];
    for (let n = 1; n <= FLOWLINE_RESULT_LINES.length; n++) {
      timers.push(setTimeout(() => {
        if (!cancelled) setRevealCount(n);
      }, n * 380));
    }
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [typedIdx, fullCommand.length]);

  const typedSlice = fullCommand.slice(0, typedIdx);
  const showCommandCaret = typedIdx < fullCommand.length;
  const promptDone = typedIdx >= fullCommand.length;

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#1f2630] shadow-[0_24px_60px_rgba(11,11,12,0.18)] bg-[#0f1419] flowline-frame">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#161b22]">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 ml-2">flowline · my-team</span>
      </div>
      <div className="p-5 sm:p-6 text-[13.5px] leading-7 text-[#c9d1d9]" aria-live="polite">
        <div className="whitespace-pre-wrap break-words">
          <span className="text-emerald-400">{typedSlice.length > 0 ? typedSlice.charAt(0) : "$"}</span>
          <span className="text-white">{typedSlice.slice(1, Math.min(typedSlice.length, FLOWLINE_TYPED_PREFIX.length))}</span>
          <span className="text-[#a5d6ff]">{typedSlice.slice(FLOWLINE_TYPED_PREFIX.length)}</span>
          {showCommandCaret ? <span className="flowline-caret" aria-hidden="true"></span> : null}
        </div>
        {FLOWLINE_RESULT_LINES.slice(0, revealCount).map((line, i) => (
          <div key={i} className={"mt-1 " + (i === FLOWLINE_RESULT_LINES.length - 1 ? "text-emerald-300 mt-2" : "text-[#8b949e]")}>
            {line}
          </div>
        ))}
        {promptDone && revealCount === FLOWLINE_RESULT_LINES.length ? (
          <div className="mt-3"><span className="text-emerald-400">$</span> <span className="flowline-caret" aria-hidden="true"></span></div>
        ) : null}
      </div>
    </div>
  );
}

export default function T2SaasLight() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Display:wght@700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "secondary": "#5f5e5f",
                "on-secondary": "#ffffff",
                "on-primary-fixed": "#0f0069",
                "secondary-container": "#e5e2e3",
                "primary-fixed-dim": "#c3c0ff",
                "error": "#ba1a1a",
                "on-tertiary-container": "#dbdbd8",
                "surface-dim": "#d8dade",
                "on-tertiary": "#ffffff",
                "background": "#f7f9fd",
                "on-surface": "#191c1f",
                "tertiary-fixed": "#e2e3e0",
                "surface-container-highest": "#e0e2e6",
                "on-primary": "#ffffff",
                "primary-container": "#4f46e5",
                "on-primary-container": "#dad7ff",
                "surface-container-lowest": "#ffffff",
                "outline": "#777587",
                "on-secondary-fixed-variant": "#474647",
                "primary": "#3525cd",
                "surface-bright": "#f7f9fd",
                "surface-container": "#eceef2",
                "surface-variant": "#e0e2e6",
                "surface-tint": "#4d44e3",
                "secondary-fixed": "#e5e2e3",
                "error-container": "#ffdad6",
                "on-background": "#191c1f",
                "outline-variant": "#c7c4d8",
                "primary-fixed": "#e2dfff",
                "surface-container-low": "#f2f4f8",
                "surface": "#f7f9fd",
                "on-secondary-fixed": "#1c1b1c",
                "on-error": "#ffffff",
                "inverse-surface": "#2d3134",
                "on-error-container": "#93000a",
                "on-primary-fixed-variant": "#3323cc",
                "on-tertiary-fixed-variant": "#454745",
                "inverse-on-surface": "#eff1f5",
                "on-secondary-container": "#656465",
                "tertiary": "#474847",
                "on-surface-variant": "#464555",
                "tertiary-fixed-dim": "#c6c7c4",
                "on-tertiary-fixed": "#1a1c1b",
                "surface-container-high": "#e6e8ec",
                "tertiary-container": "#5f605e",
                "secondary-fixed-dim": "#c8c6c7",
                "inverse-primary": "#c3c0ff"
              },
              borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
              spacing: {
                "md": "24px",
                "container-max": "1280px",
                "gutter": "32px",
                "lg": "48px",
                "sm": "16px",
                "xs": "8px",
                "base": "4px",
                "xl": "80px"
              },
              fontFamily: {
                "display-lg": ["Inter Display", "sans-serif"],
                "display-xl": ["Inter Display", "sans-serif"],
                "label-sm": ["Inter", "sans-serif"],
                "body-md": ["Inter", "sans-serif"],
                "headline-md": ["Inter Display", "sans-serif"],
                "display-2xl": ["Inter Display", "sans-serif"],
                "body-lg": ["Inter", "sans-serif"]
              },
              fontSize: {
                "display-lg": ["48px", { lineHeight: "52px", letterSpacing: "-0.03em", fontWeight: "700" }],
                "display-xl": ["72px", { lineHeight: "72px", letterSpacing: "-0.04em", fontWeight: "800" }],
                "label-sm": ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "600" }],
                "body-md": ["16px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "400" }],
                "headline-md": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
                "display-2xl": ["96px", { lineHeight: "92px", letterSpacing: "-0.04em", fontWeight: "800" }],
                "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "0em", fontWeight: "400" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .text-balance { text-wrap: balance; }
        .text-pretty { text-wrap: pretty; }
        .flowline-frame { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
        .flowline-caret { display: inline-block; width: 0.55ch; height: 1.05em; background: #c9d1d9; margin-left: 1px; vertical-align: -2px; animation: flowlineCaretBlink 1s step-end infinite; }
        @keyframes flowlineCaretBlink { 50% { opacity: 0; } }
        .flowline-marquee-track { display: flex; gap: 3rem; animation: flowlineMarquee 40s linear infinite; will-change: transform; }
        .flowline-marquee:hover .flowline-marquee-track { animation-play-state: paused; }
        @keyframes flowlineMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .flowline-caret { animation: none; }
          .flowline-marquee-track { animation: none; }
        }
      ` }} />

      <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">

        <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-white/40 shadow-[0_20px_40px_rgba(11,11,12,0.04)]">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-[100] outline-none ring-2 ring-primary-container ring-offset-2 font-label-sm">Skip to main content</a>
          <div className="flex justify-between items-center h-20 px-5 sm:px-8 lg:px-gutter max-w-container-max mx-auto">
            <a href="/" aria-label="Flowline Home" className="text-2xl font-black tracking-tighter text-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-opacity hover:opacity-80">Flowline</a>
            <nav aria-label="Main Navigation" className="hidden md:flex gap-8 items-center">
              <a className="font-label-sm text-sm tracking-tight text-secondary hover:text-on-background transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#product">Product</a>
              <a className="font-label-sm text-sm tracking-tight text-secondary hover:text-on-background transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#features">Features</a>
              <a className="font-label-sm text-sm tracking-tight text-secondary hover:text-on-background transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#demo">Demo</a>
              <a className="font-label-sm text-sm tracking-tight text-secondary hover:text-on-background transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#pricing">Pricing</a>
            </nav>
            <div className="flex gap-3 sm:gap-4 items-center">
              <a href="#login" className="font-label-sm text-sm tracking-tight text-on-background transition-colors duration-300 ease-out hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 py-1">Log In</a>
              <a href="#signup" className="font-label-sm text-sm tracking-tight bg-[#0B0B0C] text-white px-4 py-2 rounded-lg hover:shadow-[0_0_0_2px_rgba(79,70,229,0.5)] transition-all duration-300 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Get Started</a>
            </div>
          </div>
        </header>

        <main id="main-content" className="pt-24 sm:pt-28 lg:pt-32">
          <section className="max-w-container-max mx-auto px-5 py-12 flex flex-col lg:flex-row items-center gap-10 sm:px-8 sm:py-16 lg:px-gutter lg:py-xl lg:gap-gutter">
            <div className="flex-1 space-y-6 sm:space-y-8 w-full">
              <h1 className="font-display-xl text-[clamp(2.75rem,6vw+1rem,4.5rem)] leading-[1.05] text-on-background text-balance tracking-tight">
                Execute.<br />Faster.<br />Together.
              </h1>
              <p className="font-body-lg text-[clamp(1rem,1.5vw+0.5rem,1.125rem)] text-secondary max-w-[55ch] text-pretty">
                The project operating system built for high-velocity teams to align, track, and deliver without the friction.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-sm">
                <button type="button" className="bg-[#0B0B0C] text-white px-6 py-3 rounded-DEFAULT font-label-sm text-label-sm hover:shadow-[0_0_0_2px_rgba(79,70,229,0.5)] transition-all duration-200 ease-out hover:-translate-y-0.5 sm:px-8 sm:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  Start Building
                </button>
                <button type="button" className="bg-transparent text-[#0B0B0C] px-6 py-3 rounded-DEFAULT font-label-sm text-label-sm border border-outline-variant hover:bg-black/5 hover:border-outline transition-all duration-200 ease-out sm:px-8 sm:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  Book a Demo
                </button>
              </div>
            </div>
            <div className="flex-1 relative w-full aspect-[4/3] sm:aspect-video lg:aspect-square xl:aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-primary-container opacity-5 blur-[100px] rounded-full motion-reduce:hidden pointer-events-none"></div>
              <div className="relative w-full h-full max-h-[500px] rounded-xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_20px_40px_rgba(11,11,12,0.04)] overflow-hidden flex items-center justify-center p-2">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Data analytics dashboard interface" className="w-full h-full object-cover rounded-lg shadow-sm" width="1200" height="800" fetchPriority="high" decoding="async" />
              </div>
            </div>
          </section>

          <section aria-labelledby="trusted-by-heading" className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-gutter py-12 border-y border-surface-variant overflow-hidden">
            <h2 id="trusted-by-heading" className="sr-only">Trusted by top enterprise teams</h2>
            <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 sm:gap-12">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google logo" className="h-6 w-auto object-contain filter brightness-0 opacity-40 hover:opacity-80 transition-opacity duration-300" width="74" height="24" loading="lazy" decoding="async" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM logo" className="h-6 w-auto object-contain filter brightness-0 opacity-40 hover:opacity-80 transition-opacity duration-300" width="60" height="24" loading="lazy" decoding="async" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft logo" className="h-6 w-auto object-contain filter brightness-0 opacity-40 hover:opacity-80 transition-opacity duration-300" width="114" height="24" loading="lazy" decoding="async" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW logo" className="h-8 w-auto object-contain filter brightness-0 opacity-40 hover:opacity-80 transition-opacity duration-300" width="32" height="32" loading="lazy" decoding="async" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" alt="Cisco logo" className="h-6 w-auto object-contain filter brightness-0 opacity-40 hover:opacity-80 transition-opacity duration-300" width="46" height="24" loading="lazy" decoding="async" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe logo" className="h-6 w-auto object-contain filter brightness-0 opacity-40 hover:opacity-80 transition-opacity duration-300" width="58" height="24" loading="lazy" decoding="async" />
            </div>
          </section>

          <section id="features" className="max-w-container-max mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-gutter lg:py-xl">
            <header className="text-center mb-10 sm:mb-14 lg:mb-16">
              <h2 className="font-display-lg text-[clamp(2rem,4vw+1rem,2.5rem)] leading-tight text-on-background text-balance">Engineered for Velocity</h2>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-gutter">
              {[
                { icon: "bolt", title: "Real-time Sync", body: "State updates propagate instantly across all clients, ensuring absolute single-source-of-truth alignment." },
                { icon: "account_tree", title: "Branching Logic", body: "Manage complex dependencies with Git-like workflow states designed specifically for non-engineering teams." },
                { icon: "insights", title: "Velocity Metrics", body: "Automated sprint burn-down and throughput analysis built directly into the operational layer." },
              ].map((f, i) => (
                <article key={i} className="bg-surface-container-lowest p-6 sm:p-md rounded-xl border border-surface-variant shadow-[0_10px_30px_rgba(11,11,12,0.03)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(11,11,12,0.08)] transition-all duration-300 group">
                  <div className="mb-sm flex items-center justify-center w-12 h-12 bg-surface rounded-lg border border-surface-variant group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors duration-300">
                    <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors duration-300" aria-hidden="true" style={{ fontVariationSettings: "'wght' 300" }}>{f.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-xl sm:text-headline-md text-on-background mb-base">{f.title}</h3>
                  <p className="font-body-md text-body-md text-secondary text-pretty">{f.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="demo" aria-labelledby="terminal-heading" className="bg-surface-container py-16 sm:py-20 lg:py-xl overflow-hidden">
            <div className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-gutter">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-gutter items-center">
                <div className="lg:col-span-7 relative">
                  <div className="absolute -inset-6 bg-primary-container opacity-10 blur-[80px] rounded-full pointer-events-none motion-reduce:hidden" aria-hidden="true"></div>
                  <div className="relative">
                    <FlowlineTerminal />
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-6 sm:space-y-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-surface-variant bg-surface-container-lowest font-label-sm text-[11px] uppercase tracking-[0.2em] text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse motion-reduce:animate-none" aria-hidden="true"></span>
                    Workflow as code
                  </span>
                  <h2 id="terminal-heading" className="font-display-lg text-[clamp(2rem,4vw+1rem,2.5rem)] leading-tight text-on-background text-balance">
                    Describe the work. Flowline runs it.
                  </h2>
                  <ul className="space-y-sm" role="list">
                    <li className="flex items-start gap-3 font-body-md text-body-md text-secondary text-pretty">
                      <span className="material-symbols-outlined text-[20px] text-primary-container shrink-0 mt-0.5" aria-hidden="true">terminal</span>
                      <span><strong className="text-on-background font-semibold">Define workflows in plain English</strong> — the runtime parses intent into actions across your stack.</span>
                    </li>
                    <li className="flex items-start gap-3 font-body-md text-body-md text-secondary text-pretty">
                      <span className="material-symbols-outlined text-[20px] text-primary-container shrink-0 mt-0.5" aria-hidden="true">hub</span>
                      <span><strong className="text-on-background font-semibold">Auto-route across Slack, Linear, Notion</strong> — no glue code, no Zaps to maintain.</span>
                    </li>
                    <li className="flex items-start gap-3 font-body-md text-body-md text-secondary text-pretty">
                      <span className="material-symbols-outlined text-[20px] text-primary-container shrink-0 mt-0.5" aria-hidden="true">bolt</span>
                      <span><strong className="text-on-background font-semibold">One-line CLI install</strong> — pipe to shell, authenticate once, ship a workflow in 60 seconds.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="enterprise-heading" className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-gutter py-16 sm:py-20">
            <header className="text-center mb-10 sm:mb-12">
              <span className="font-label-sm text-[11px] uppercase tracking-[0.25em] text-secondary">Section · 04</span>
              <h2 id="enterprise-heading" className="mt-3 font-display-lg text-[clamp(1.75rem,3vw+1rem,2.25rem)] leading-tight text-on-background text-balance">Trusted in production by 2,400+ teams</h2>
            </header>
            <div className="grid grid-cols-12 gap-3 sm:gap-4 items-stretch">
              <div className="col-span-2 hidden md:block relative rounded-xl overflow-hidden border border-surface-variant aspect-[3/4]">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop" alt="" aria-hidden="true" className="w-full h-full object-cover" width="600" height="800" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              </div>
              <div className="col-span-12 md:col-span-8 flowline-marquee relative overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest py-8 sm:py-10">
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-container-lowest to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-container-lowest to-transparent z-10 pointer-events-none"></div>
                <div className="flowline-marquee-track" aria-hidden="true">
                  <div className="flex items-center gap-12 shrink-0 px-6">
                    {FLOWLINE_LOGOS.map((logo, i) => (
                      <span key={"a-" + i} className="font-label-sm text-base sm:text-lg uppercase tracking-[0.3em] text-secondary whitespace-nowrap">
                        {logo.mark ? <span className="text-primary-container">{logo.mark}</span> : null}
                        {logo.mark ? " " : null}
                        {logo.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-12 shrink-0 px-6">
                    {FLOWLINE_LOGOS.map((logo, i) => (
                      <span key={"b-" + i} className="font-label-sm text-base sm:text-lg uppercase tracking-[0.3em] text-secondary whitespace-nowrap">
                        {logo.mark ? <span className="text-primary-container">{logo.mark}</span> : null}
                        {logo.mark ? " " : null}
                        {logo.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 hidden md:block relative rounded-xl overflow-hidden border border-surface-variant aspect-[3/4]">
                <img src="https://images.unsplash.com/photo-1551808525-51a94da548ce?w=600&q=85&auto=format&fit=crop" alt="" aria-hidden="true" className="w-full h-full object-cover" width="600" height="800" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              </div>
            </div>
            <p className="mt-6 text-center font-body-md text-sm text-secondary">From Series-A teams to Fortune 500 ops orgs — Flowline runs the boring middle.</p>
          </section>

          <section aria-labelledby="integrations-heading" className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-gutter py-16 sm:py-20 lg:py-xl">
            <header className="mb-10 sm:mb-14">
              <span className="font-label-sm text-[11px] uppercase tracking-[0.25em] text-secondary">Section · 05</span>
              <h2 id="integrations-heading" className="mt-3 font-display-lg text-[clamp(2rem,4vw+1rem,2.5rem)] leading-tight text-on-background text-balance max-w-2xl">One control plane. Every tool you already use.</h2>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-gutter">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-32 relative rounded-xl overflow-hidden border border-surface-variant aspect-[4/5] bg-primary/10">
                  <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=85&auto=format&fit=crop" alt="Server racks rendered in cool blue tones suggesting infrastructure backbone" className="w-full h-full object-cover mix-blend-luminosity opacity-90" width="1200" height="1500" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary-container/30 mix-blend-multiply" aria-hidden="true"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-label-sm text-[11px] uppercase tracking-[0.25em] text-white/90">
                    <span>Backbone · v4.2</span>
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse motion-reduce:animate-none"></span>99.99% uptime</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                {FLOWLINE_INTEGRATIONS.map((it, i) => (
                  <article key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(11,11,12,0.06)] transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-surface-variant shrink-0 group-hover:bg-primary/5 transition-colors">
                        <span className="material-symbols-outlined text-secondary group-hover:text-primary" aria-hidden="true">{it.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-3 mb-1">
                          <h3 className="font-headline-md text-xl text-on-background">{it.name}</h3>
                          <span className="font-label-sm text-[10px] uppercase tracking-[0.2em] text-secondary tabular-nums">{String(i + 1).padStart(2, "0")} / 04</span>
                        </div>
                        <p className="font-body-md text-body-md text-secondary text-pretty">{it.body}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="testimonial-heading" className="max-w-container-max mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-gutter lg:py-xl">
            <h2 id="testimonial-heading" className="sr-only">Customer Testimonial</h2>
            <blockquote className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <span className="text-[clamp(4rem,8vw+2rem,7.5rem)] leading-none text-primary-container/15 font-serif mb-[-0.25em] select-none" aria-hidden="true">“</span>
              <p className="font-headline-md text-[clamp(1.25rem,3vw+0.5rem,1.75rem)] leading-snug text-on-background mb-8 sm:mb-10 text-balance z-10">
                Flowline removed the operational drag from our engineering cycles. We ship 30% faster and have zero arguments about status.
              </p>
              <footer className="flex items-center gap-sm">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=160&q=80" alt="Sarah Jenkins" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover grayscale border border-surface-variant" width="64" height="64" loading="lazy" decoding="async" />
                <div className="text-left">
                  <cite className="font-label-sm text-label-sm text-on-background not-italic block">Sarah Jenkins</cite>
                  <span className="font-body-md text-[14px] sm:text-body-md text-secondary block">VP Engineering, ScaleTech</span>
                </div>
              </footer>
            </blockquote>
          </section>

          <section aria-labelledby="compare-heading" className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-gutter py-16 sm:py-20 lg:py-xl">
            <header className="text-center mb-10 sm:mb-12">
              <span className="font-label-sm text-[11px] uppercase tracking-[0.25em] text-secondary">Section · 07</span>
              <h2 id="compare-heading" className="mt-3 font-display-lg text-[clamp(2rem,4vw+1rem,2.5rem)] leading-tight text-on-background text-balance">Plan comparison at a glance</h2>
              <p className="mt-3 font-body-md text-body-md text-secondary max-w-xl mx-auto">Every feature, mapped across tiers. No fine-print, no hidden gates.</p>
            </header>
            <div className="overflow-x-auto rounded-xl border border-surface-variant bg-surface-container-lowest shadow-[0_10px_30px_rgba(11,11,12,0.04)]">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-surface-variant">
                    <th scope="col" className="p-5 font-label-sm text-label-sm text-secondary uppercase tracking-widest">Feature</th>
                    {FLOWLINE_PRICING_TIERS.map((tier, i) => (
                      <th key={i} scope="col" className={"p-5 font-label-sm text-label-sm uppercase tracking-widest text-center " + (tier.highlight ? "text-primary-container bg-primary/5" : "text-secondary")}>
                        <span className="block text-on-background">{tier.name}</span>
                        <span className={"block mt-1 font-display-lg text-2xl text-on-background " + (tier.price === "Custom" ? "tracking-tight" : "tracking-tight tabular-nums")}>{tier.price}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  {FLOWLINE_PRICING_ROWS.map((row, ri) => (
                    <tr key={ri} className={ri < FLOWLINE_PRICING_ROWS.length - 1 ? "border-b border-surface-variant" : ""}>
                      <th scope="row" className="p-5 text-on-background font-medium">{row.feature}</th>
                      {row.values.map((val, ci) => {
                        const highlight = FLOWLINE_PRICING_TIERS[ci] && FLOWLINE_PRICING_TIERS[ci].highlight;
                        const cellClass = "p-5 text-center" + (highlight ? " bg-primary/5" : "");
                        if (val === true) {
                          return <td key={ci} className={cellClass}><span className="material-symbols-outlined text-[20px] text-primary-container" aria-label="Included">check</span></td>;
                        }
                        if (val === false) {
                          return <td key={ci} className={cellClass + " text-outline-variant"} aria-label="Not included">—</td>;
                        }
                        return <td key={ci} className={cellClass + " " + (highlight ? "text-on-background" : "text-secondary") + " tabular-nums"}>{val}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="pricing" className="bg-surface py-16 sm:py-20 lg:py-24 border-t border-surface-variant">
            <div className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-gutter">
              <header className="text-center mb-12 sm:mb-16 lg:mb-20">
                <h2 className="font-display-lg text-[clamp(2rem,4vw+1rem,2.5rem)] leading-tight text-on-background text-balance">Simple, Transparent Pricing</h2>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-center lg:px-4">

                <article className="bg-surface-container-lowest p-6 sm:p-lg rounded-xl border border-surface-variant shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-sm">Starter</h3>
                  <div className="flex items-baseline mb-md">
                    <span className="font-display-lg text-[clamp(2.5rem,4vw+1rem,3rem)] text-on-background tabular-nums tracking-tight">$0</span>
                    <span className="font-body-md text-body-md text-secondary ml-2">/mo</span>
                  </div>
                  <ul className="space-y-sm mb-lg" role="list">
                    {["Up to 5 users", "Basic Kanban", "Community support"].map((it, i) => (
                      <li key={i} className="flex items-start gap-xs font-body-md text-body-md text-secondary">
                        <span className="material-symbols-outlined text-[20px] text-primary-container shrink-0" aria-hidden="true">check</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="w-full bg-transparent text-[#0B0B0C] py-3 rounded-DEFAULT font-label-sm text-label-sm border border-outline-variant hover:bg-black/5 hover:border-outline transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Get Started</button>
                </article>

                <article className="relative bg-surface-container-lowest p-6 sm:p-lg rounded-xl border-2 border-primary-container shadow-[0_20px_40px_rgba(79,70,229,0.12)] lg:-translate-y-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap shadow-sm">Most Popular</div>
                  <h3 className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest mb-sm">Pro</h3>
                  <div className="flex items-baseline mb-md">
                    <span className="font-display-lg text-[clamp(2.5rem,4vw+1rem,3rem)] text-on-background tabular-nums tracking-tight">$29</span>
                    <span className="font-body-md text-body-md text-secondary ml-2">/user/mo</span>
                  </div>
                  <ul className="space-y-sm mb-lg" role="list">
                    {["Unlimited users", "Advanced Analytics", "Custom Workflows", "Priority support"].map((it, i) => (
                      <li key={i} className="flex items-start gap-xs font-body-md text-body-md text-on-background">
                        <span className="material-symbols-outlined text-[20px] text-primary-container shrink-0" aria-hidden="true">check</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="w-full bg-[#0B0B0C] text-white py-3 rounded-DEFAULT font-label-sm text-label-sm hover:bg-primary hover:shadow-[0_0_0_2px_rgba(79,70,229,0.5)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Start Free Trial</button>
                </article>

                <article className="bg-surface-container-lowest p-6 sm:p-lg rounded-xl border border-surface-variant shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-sm">Enterprise</h3>
                  <div className="flex items-baseline mb-md">
                    <span className="font-display-lg text-[clamp(2.5rem,4vw+1rem,3rem)] text-on-background tracking-tight">Custom</span>
                  </div>
                  <ul className="space-y-sm mb-[68px]" role="list">
                    {["Dedicated instance", "SSO & SAML", "SLA guarantees"].map((it, i) => (
                      <li key={i} className="flex items-start gap-xs font-body-md text-body-md text-secondary">
                        <span className="material-symbols-outlined text-[20px] text-primary-container shrink-0" aria-hidden="true">check</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="w-full bg-transparent text-[#0B0B0C] py-3 rounded-DEFAULT font-label-sm text-label-sm border border-outline-variant hover:bg-black/5 hover:border-outline transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Contact Sales</button>
                </article>

              </div>
            </div>
          </section>

          <section id="faq" aria-labelledby="faq-heading" className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-gutter py-16 sm:py-20 lg:py-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-gutter">
              <header className="lg:col-span-4">
                <span className="font-label-sm text-[11px] uppercase tracking-[0.25em] text-secondary">Section · 09</span>
                <h2 id="faq-heading" className="mt-3 font-display-lg text-[clamp(2rem,4vw+1rem,2.5rem)] leading-tight text-on-background text-balance">Frequently asked</h2>
                <p className="mt-4 font-body-md text-body-md text-secondary text-pretty">Still chasing? Drop a line to <a href="mailto:hello@flowline.dev" className="text-primary underline-offset-4 hover:underline">hello@flowline.dev</a>.</p>
              </header>
              <div className="lg:col-span-8 divide-y divide-surface-variant border-y border-surface-variant">
                {FLOWLINE_FAQ.map((item, i) => (
                  <details key={i} className="group py-5">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-headline-md text-lg text-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                      <span>{item.q}</span>
                      <span className="material-symbols-outlined text-secondary group-open:rotate-45 transition-transform duration-200" aria-hidden="true">add</span>
                    </summary>
                    <p className="mt-3 font-body-md text-body-md text-secondary text-pretty">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full py-12 border-t border-surface-variant bg-surface-container-lowest sm:py-16 lg:py-24">
          <div className="max-w-container-max mx-auto px-5 sm:px-8 lg:px-gutter flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
            <a href="/" aria-label="Flowline Home" className="text-xl font-black tracking-tighter text-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-opacity hover:opacity-80">
              Flowline
            </a>
            <p className="font-label-sm text-[11px] sm:text-xs uppercase tracking-widest text-secondary text-center lg:order-none opacity-80">
              © 2024 Flowline. Built for high-velocity teams.
            </p>
            <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a className="font-label-sm text-[11px] sm:text-xs uppercase tracking-widest font-bold text-secondary hover:text-on-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#privacy">Privacy</a>
              <a className="font-label-sm text-[11px] sm:text-xs uppercase tracking-widest font-bold text-secondary hover:text-on-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#terms">Terms</a>
              <a className="font-label-sm text-[11px] sm:text-xs uppercase tracking-widest font-bold text-secondary hover:text-on-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#security">Security</a>
              <a className="font-label-sm text-[11px] sm:text-xs uppercase tracking-widest font-bold text-secondary hover:text-on-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1" href="#status">Status</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
