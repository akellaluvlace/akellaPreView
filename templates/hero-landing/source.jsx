const ROOMS = [
  { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85&auto=format&fit=crop", title: "Atlas · Onboarding flow", team: "Design · Stockholm", room: "ROOM_07", w: "w-72", chip: { text: "Live · 12", live: true }, foot: "avatars" },
  { src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&q=85&auto=format&fit=crop", title: "Beacon · Pricing rework", team: "PM · Seoul", room: "ROOM_12", w: "w-80", chip: { text: "v2.4 · ship", live: false, color: "text-slate-700" }, foot: "+47 commits", footColor: "text-emerald-700" },
  { src: "https://images.unsplash.com/photo-1573164574001-518958d9baa2?w=900&q=85&auto=format&fit=crop", title: "Cedar · Spec → tickets", team: "Eng · Berlin", room: "ROOM_19", w: "w-72", chip: { text: "Live · 8", live: true }, foot: "37 issues", footColor: "text-orange-600" },
  { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=85&auto=format&fit=crop", title: "Dune · Q1 retrospective", team: "Cross · Lisbon", room: "ROOM_22", w: "w-80", chip: { text: "REVIEW", live: false, color: "text-orange-700", bg: "bg-orange-100" }, foot: "14 voices", footColor: "text-slate-500" },
  { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=85&auto=format&fit=crop", title: "Echo · Mobile rebuild", team: "Eng · Toronto", room: "ROOM_28", w: "w-72", chip: { text: "Live · 21", live: true }, foot: "3 reviewers", footColor: "text-rose-600" },
  { src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&q=85&auto=format&fit=crop", title: "Forge · API redraft", team: "Platform · Austin", room: "ROOM_31", w: "w-80", chip: { text: "DRAFT", live: false, color: "text-blue-700", bg: "bg-blue-100" }, foot: "Updated 6m", footColor: "text-slate-500" },
  { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85&auto=format&fit=crop", title: "Glow · v3.0 launch", team: "All hands · NYC", room: "ROOM_36", w: "w-72", chip: { text: "SHIPPED", live: false, color: "text-emerald-800", bg: "bg-emerald-100" }, foot: "14:02 · 2026-04", footColor: "text-slate-500" },
  { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=85&auto=format&fit=crop", title: "Halo · Pricing v2", team: "PM · Remote", room: "ROOM_44", w: "w-80", chip: { text: "Live · 4", live: true }, foot: "2 unresolved", footColor: "text-orange-600" },
];

const ROLLOUT = [
  { i: "01", title: "Import one repo, not all of them.", body: "Start with the loudest one. Watch the changelog roll in. The rest will follow themselves.", time: "~ 4 minutes" },
  { i: "02", title: "Pin the noisiest channel.", body: "Whichever Slack channel ate yesterday: pin it. Lumen turns its threads into rooms automatically.", time: "~ 2 minutes" },
  { i: "03", title: "Hold one ritual on the canvas.", body: "Your standup, your retro, your post-mortem — pick one. The team learns the canvas in one ritual.", time: "~ 25 minutes" },
  { i: "04", title: "Convert one spec into tickets.", body: "Take the longest doc on your wiki. Press ⌘K. Watch a sprint plan walk out of it.", time: "~ 8 minutes" },
  { i: "05", title: "Ship a draft release note before Friday.", body: "Don't polish. Just publish. The first one is the hardest; everything after writes itself.", time: "~ 12 minutes" },
];

const FAQS = [
  { i: "01", color: "text-orange-600", q: "Will Lumen replace our existing tools?", a: "No. Lumen sits next to Linear, Jira, Notion, GitHub and Slack. It indexes them, draws on them, and makes the seams disappear. Most teams keep every tool they had — they just stop tab-hopping.", open: true },
  { i: "02", color: "text-rose-600", q: "How long does the trial run?", a: "14 days. No card, no calls. If you ship one release note in week one, you'll know whether it works for your team." },
  { i: "03", color: "text-blue-600", q: "Where is our data hosted?", a: "EU and US regions, your choice at workspace creation. SOC 2 Type II, ISO 27001, and GDPR-aligned. Customer-managed keys (CMK) on Pro and above." },
  { i: "04", color: "text-emerald-600", q: "Does the AI train on our content?", a: "No. Drafts are generated per-workspace and discarded after rendering. We never use your content as training data. The full data-handling brief is in the security centre." },
  { i: "05", color: "text-orange-600", q: "Can we self-host?", a: "Yes — single-tenant on AWS, GCP, or Azure on the Enterprise plan. We help you wire SSO, audit log forwarding, and the changelog connector." },
];

function RoomTile({ t, hidden }) {
  const liveChip = (
    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot"></span>{t.chip.text}
    </span>
  );
  const flatChip = (
    <span className={`absolute top-3 left-3 rounded-full ${t.chip.bg || "bg-white/90 backdrop-blur"} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${t.chip.color || "text-slate-700"}`}>{t.chip.text}</span>
  );
  return (
    <figure aria-hidden={hidden ? "true" : undefined} className={`shrink-0 ${t.w} rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden`}>
      <div className="relative h-44">
        <img alt={hidden ? "" : t.title} className="absolute inset-0 h-full w-full object-cover" src={t.src} />
        {t.chip.live ? liveChip : flatChip}
        <span className="absolute top-3 right-3 rounded-full bg-slate-900/85 text-white px-2 py-0.5 text-[10px] font-semibold tracking-wider">{t.room}</span>
      </div>
      <figcaption className="px-4 py-3 flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold text-slate-900">{t.title}</div>
          <div className="text-xs text-slate-500">{t.team}</div>
        </div>
        {t.foot === "avatars" ? (
          <div className="flex -space-x-2">
            <div className="h-6 w-6 rounded-full bg-orange-400 border-2 border-white"></div>
            <div className="h-6 w-6 rounded-full bg-rose-500 border-2 border-white"></div>
            <div className="h-6 w-6 rounded-full bg-blue-600 border-2 border-white"></div>
          </div>
        ) : (
          <span className={`text-xs font-semibold ${t.footColor}`}>{t.foot}</span>
        )}
      </figcaption>
    </figure>
  );
}

function HeroLanding() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { overflow-x: clip; }
        .full-bleed { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); max-width: none; }
        .lumen-marquee { display: flex; gap: 16px; width: max-content; animation: lumen-x 60s linear infinite; }
        .lumen-marquee:hover { animation-play-state: paused; }
        @keyframes lumen-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 8px)); } }
        .lumen-faq summary { list-style: none; cursor: pointer; }
        .lumen-faq summary::-webkit-details-marker { display: none; }
        .lumen-faq summary .lumen-chevron { transition: transform 250ms ease; }
        .lumen-faq[open] summary .lumen-chevron { transform: rotate(180deg); }
        .pulse-dot { animation: pulse-ring 2s ease-out infinite; }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lumen-marquee { animation: none; }
          .pulse-dot { animation: none; }
          .lumen-faq summary .lumen-chevron { transition: none; }
        }
      `}} />
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500" />
            <span className="text-lg font-semibold tracking-tight">Lumen</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#about" className="hover:text-slate-900">About</a>
          </nav>
          <a
            href="#"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Start free
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            v1.4 — Real-time collab is here
          </span>
          <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-900 md:text-7xl">
            Ship product faster,
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 bg-clip-text text-transparent">
              together.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            Lumen is the collaborative workspace where product, design, and
            engineering turn ideas into releases — without the meetings.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Start free — no credit card
            </a>
            <a
              href="#features"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              See how it works →
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Free 14-day trial · Cancel anytime · SOC 2 compliant
          </p>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-orange-600">
            Why teams switch
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Everything a product team needs, in one room.
          </h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Live whiteboards",
              body: "Sketch flows, pin screenshots, and comment in the same canvas. No context lost to Slack.",
              icon: "✶",
            },
            {
              title: "Spec-to-ticket",
              body: "Turn any doc into a backlog with one click. Linear, Jira, and GitHub Issues supported.",
              icon: "◆",
            },
            {
              title: "Release notes that write themselves",
              body: "We watch your PRs and draft the changelog. You review and ship.",
              icon: "●",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-lg text-orange-600">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workspace marquee strip */}
      <section className="full-bleed border-y border-slate-200 bg-slate-50 py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-orange-600">// Inside Lumen · 03</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">A glance across active rooms.</h2>
          </div>
          <p className="max-w-md text-sm text-slate-600">Eight workspaces from this morning's spread of teams. Hover the strip to halt the conveyor — every tile is a real room.</p>
        </div>
        <div className="overflow-hidden relative">
          <div className="lumen-marquee">
            {ROOMS.map((t, i) => <RoomTile key={`a-${i}`} t={t} hidden={false} />)}
            {ROOMS.map((t, i) => <RoomTile key={`b-${i}`} t={t} hidden={true} />)}
          </div>
        </div>
      </section>

      {/* Three rituals */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-orange-600">From spec to ship</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Three rituals, one workspace.</h2>
        </div>
        <div className="mt-20 flex flex-col gap-24">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <figure className="md:col-span-7 relative">
              <div className="absolute -inset-4 -rotate-2 bg-gradient-to-tr from-orange-100 via-rose-50 to-blue-50 rounded-3xl"></div>
              <img alt="Whiteboard collaboration" className="relative w-full aspect-[16/10] object-cover rounded-2xl border border-slate-200 shadow-xl" src="https://images.unsplash.com/photo-1573164574001-518958d9baa2?w=1400&q=85&auto=format&fit=crop" />
              <span className="absolute top-6 left-6 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot"></span>Whiteboard · live</span>
            </figure>
            <div className="md:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">RITUAL · 01</span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Sketch first, doc second.</h3>
              <p className="mt-4 text-slate-600">A blank canvas where engineering can pin a screenshot, design can draw the flow, and PM can vote on which lane wins. The whiteboard has its own URL — pin it in your Slack, your Linear, your inbox.</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {["Live cursors and per-user colour rails", "Comment threads tied to canvas regions", "One-click export → spec doc"].map((b, i) => (
                  <li key={i} className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0"></span>{b}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Row 2 reversed */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5 md:order-1 order-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">RITUAL · 02</span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Spec to ticket, in one keystroke.</h3>
              <p className="mt-4 text-slate-600">Highlight a paragraph; press <kbd className="rounded border border-slate-300 bg-slate-50 px-1.5 text-xs">⌘ K</kbd>; pick a board. The ticket shows up with full context — your figure pinned, your acceptance criteria copied, your reviewers notified.</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-center"><div className="text-2xl font-semibold text-blue-600">37</div><div className="text-[11px] uppercase tracking-widest text-slate-500">Issues today</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-center"><div className="text-2xl font-semibold text-rose-600">12s</div><div className="text-[11px] uppercase tracking-widest text-slate-500">Median open</div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-center"><div className="text-2xl font-semibold text-emerald-600">94%</div><div className="text-[11px] uppercase tracking-widest text-slate-500">First-pass</div></div>
              </div>
            </div>
            <figure className="md:col-span-7 md:order-2 order-1 relative">
              <div className="absolute -inset-4 rotate-2 bg-gradient-to-bl from-blue-100 via-white to-orange-50 rounded-3xl"></div>
              <img alt="Spec converted to tickets" className="relative w-full aspect-[16/10] object-cover rounded-2xl border border-slate-200 shadow-xl" src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&q=85&auto=format&fit=crop" />
              <span className="absolute top-6 right-6 rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold tracking-widest">⌘ K · ship</span>
            </figure>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <figure className="md:col-span-7 relative">
              <div className="absolute -inset-4 -rotate-1 bg-gradient-to-tr from-emerald-50 via-white to-blue-50 rounded-3xl"></div>
              <img alt="Release notes panel" className="relative w-full aspect-[16/10] object-cover rounded-2xl border border-slate-200 shadow-xl" src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1400&q=85&auto=format&fit=crop" />
              <span className="absolute bottom-6 left-6 rounded-full bg-emerald-500 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest">v3.0 · pushed</span>
            </figure>
            <div className="md:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">RITUAL · 03</span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Release notes that write themselves.</h3>
              <p className="mt-4 text-slate-600">Lumen watches your merged PRs, groups them by feature flag, and drafts the changelog the night before launch. You read, you trim, you ship — even on Fridays.</p>
              <a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:gap-3 transition-all" href="#">See an example release note →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Rollout doctrine */}
      <section className="full-bleed bg-slate-900 text-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            <aside className="lg:col-span-4 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">Rollout playbook</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Five moves teams make in week one.</h2>
              <p className="mt-4 text-slate-300">Pulled from 240 onboarding interviews. The teams who ship in week one do these five things, in this order. The teams who don't, don't.</p>
              <a className="mt-8 inline-flex items-center gap-2 text-sm font-semibold border border-white/30 rounded-full px-5 py-2 hover:bg-white hover:text-slate-900 transition-colors self-start" href="#">Read the full handbook →</a>
              {/* Bottom-aligned card so the left column stretches to match the 5-item ordered list on the right (mt-auto pushes to floor of the flex column). */}
              <div className="mt-auto pt-10 hidden lg:block">
                <div className="rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur p-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400 pulse-dot"></span>
                      Telemetry · live
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">N = 240</span>
                  </div>
                  <h3 className="text-base font-semibold mb-1 text-white">Week-one outcomes.</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-5">Pulled live from cohorts that finished onboarding in the last six months.</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-semibold tabular-nums text-orange-400">31</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">cohorts</div>
                    </div>
                    <div className="text-center border-x border-white/10">
                      <div className="text-2xl font-semibold tabular-nums text-rose-400">14d</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">to first ship</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold tabular-nums text-emerald-400">94%</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">stuck through</div>
                    </div>
                  </div>
                  <p className="mt-5 pt-4 border-t border-white/10 text-[10px] uppercase tracking-widest text-slate-500">Rolling 6-month window · refreshed nightly</p>
                </div>
              </div>
            </aside>
            <ol className="lg:col-span-8 divide-y divide-white/10 border-t border-b border-white/10">
              {ROLLOUT.map((r, i) => (
                <li key={i} className="grid grid-cols-12 gap-4 py-6 hover:bg-white/[0.03] transition-colors">
                  <span className="col-span-2 lg:col-span-1 text-4xl font-semibold tabular-nums text-orange-400 leading-none">{r.i}</span>
                  <div className="col-span-10 lg:col-span-9">
                    <h3 className="text-lg font-semibold mb-1">{r.title}</h3>
                    <p className="text-sm text-slate-400">{r.body}</p>
                  </div>
                  <span className="col-span-12 lg:col-span-2 text-[10px] uppercase tracking-widest text-slate-500 self-center lg:text-right">{r.time}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Trusted by — brand wall via simpleicons.org CDN. All slugs curl-verified 200. */}
      <section className="full-bleed border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">Stack-native</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl text-slate-900">Lumen sits next to the tools your team already opens.</h2>
            <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">Two-way sync with the surfaces below. Set it up once, ignore it forever.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16">
            {[
              { slug: "linear", name: "Linear" },
              { slug: "github", name: "GitHub" },
              { slug: "notion", name: "Notion" },
              { slug: "figma", name: "Figma" },
              { slug: "vercel", name: "Vercel" },
              { slug: "hubspot", name: "HubSpot" },
            ].map((b) => (
              <span key={b.slug} className="group inline-flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors">
                <img src={`https://cdn.simpleicons.org/${b.slug}/64748b`} alt={`${b.name} logo`} width="24" height="24" loading="lazy" decoding="async" className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm font-semibold tracking-wide">{b.name}</span>
              </span>
            ))}
          </div>
          <p className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400">Plus 28 more via Zapier · OAuth · API · webhook</p>
        </div>
      </section>

      {/* Premium — security & compliance, four cards with inline SVG icons */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">Built for buyers</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl text-slate-900">Security your procurement team will sign on Friday.</h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">No questionnaire scramble. Trust centre, audit log, and DPA are linkable on day one.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "SOC 2 Type II",
                body: "Audited annually by a Big Four firm. Latest report dated Q1 2026 — request access through the trust centre.",
                icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"/></svg>),
                accent: "text-emerald-600", chip: "Audited · Q1 26",
              },
              {
                title: "Single sign-on",
                body: "Okta, Azure AD, Google Workspace, JumpCloud. SAML and OIDC. Provisioning via SCIM 2.0.",
                icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>),
                accent: "text-blue-600", chip: "On Pro+",
              },
              {
                title: "Audit log streaming",
                body: "Every click, comment, and command — streamed to Datadog, Splunk, or your S3 bucket. JSON-Lines; back-fillable.",
                icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"/></svg>),
                accent: "text-rose-600", chip: "JSONL · 12mo",
              },
              {
                title: "Customer-managed keys",
                body: "BYOK with AWS KMS or GCP KMS. Rotate, suspend, and revoke from your own console — Lumen never holds the master.",
                icon: (<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"/></svg>),
                accent: "text-orange-600", chip: "BYOK · KMS",
              },
            ].map((c) => (
              <article key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
                <div className={`mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 ${c.accent}`}>
                  {c.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">{c.body}</p>
                <span className={`mt-5 pt-4 border-t border-slate-200 text-[10px] font-semibold uppercase tracking-widest ${c.accent}`}>{c.chip}</span>
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>ISO 27001 · in progress</span>
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>GDPR · DPA on file</span>
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>HIPAA · Enterprise BAA</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-orange-600">Pre-flight checks</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Questions teams ask in week zero.</h2>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((f, i) => (
            <details key={i} className="lumen-faq group p-5 md:p-6" open={f.open}>
              <summary className="flex items-center gap-6">
                <span className={`text-2xl font-semibold tabular-nums ${f.color} shrink-0 w-10`}>{f.i}</span>
                <h3 className="flex-1 text-lg font-semibold text-slate-900">{f.q}</h3>
                <svg className="lumen-chevron w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="pl-16 mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Square image strip — full-width, 8 rounded-corner photos. All Unsplash IDs HEAD-checked 200. */}
      <section className="full-bleed border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6 mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">// Inside Lumen · 04</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl text-slate-900">Eight rooms, one Friday afternoon.</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 px-3 md:px-6">
          {[
            { src: "1517245386807-bb43f82c33c4", alt: "Engineering pair-debugging at a laptop" },
            { src: "1542038784456-1ea8e935640e", alt: "Designer sketching wireframes on tablet" },
            { src: "1531403009284-440f080d1e12", alt: "Standup in front of a wall of sticky notes" },
            { src: "1454165804606-c3d57bc86b40", alt: "Dual-monitor coding setup with terminal open" },
            { src: "1573164574001-518958d9baa2", alt: "Whiteboard sprint planning session" },
            { src: "1556761175-5973dc0f32e7", alt: "Cross-functional design review at long table" },
            { src: "1517048676732-d65bc937f952", alt: "Engineer reviewing pull request on screen" },
            { src: "1521737711867-e3b97375f902", alt: "Remote teammate on video call laptop" },
          ].map((p) => (
            <figure key={p.src} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={`https://images.unsplash.com/photo-${p.src}?w=600&q=80&auto=format&fit=crop`} alt={p.alt} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </figure>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-slate-500 md:flex-row">
          <p>© 2026 Lumen Labs</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HeroLanding;
