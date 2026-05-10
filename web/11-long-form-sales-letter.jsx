export default function T11LongFormSalesLetter() {
  const featuredIn = [
    { label: "Forbes", className: "font-bold text-sm" },
    { label: "FastCompany", className: "font-bold text-sm italic" },
    { label: "The Verge", className: "font-bold text-sm uppercase" },
  ];
  const students = [
    { tag: "No. 01 · Strategy", name: "Maren Lindqvist", meta: "$11,400 MRR · 1,840 paid subs", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=85&auto=format&fit=crop", shape: "w-72 aspect-[3/4]" },
    { tag: "No. 02 · Personal Finance", name: "Devontae Reyes", meta: "$8,200 MRR · launched in 9 weeks", img: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=1100&q=85&auto=format&fit=crop", shape: "w-80 aspect-[16/10]" },
    { tag: "No. 03 · Design Weekly", name: "Aiko Tanaka", meta: "$14,900 MRR · 12,300 free / 980 paid", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85&auto=format&fit=crop", shape: "w-72 aspect-[3/4]" },
    { tag: "No. 04 · Climate Policy", name: "Henrik Sørensen", meta: "$22,000 MRR · corporate seats x 18", img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1200&q=85&auto=format&fit=crop", shape: "w-96 aspect-[16/10]" },
    { tag: "No. 05 · Founder Letter", name: "Priya Nair", meta: "$9,600 MRR · quit consulting Q2", img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=900&q=85&auto=format&fit=crop", shape: "w-72 aspect-[3/4]" },
    { tag: "No. 06 · Wine Letter", name: "Rosa Bellini", meta: "$6,400 MRR · 92% renewal", img: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=1100&q=85&auto=format&fit=crop", shape: "w-80 aspect-[16/10]" },
    { tag: "No. 07 · Strength Digest", name: "Marcus Adeyemi", meta: "$13,200 MRR · 760 paid coaches", img: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=900&q=85&auto=format&fit=crop", shape: "w-72 aspect-[3/4]" },
    { tag: "No. 08 · AI Research", name: "Elena Park", meta: "$31,500 MRR · sponsored x 4", img: "https://images.unsplash.com/photo-1762341124796-530c0085f7d8?w=1100&q=85&auto=format&fit=crop", shape: "w-80 aspect-[16/10]" },
  ];
  const stats = [
    { value: "2,500+", label: "Operators in the room" },
    { value: "$11k", label: "Median MRR after 6 months" },
    { value: "42", label: "Niches actively shipped" },
    { value: "94%", label: "Finish the curriculum" },
  ];
  const workrooms = [
    {
      number: "Workroom 01",
      title: "The Vault — find what people will actually pay for.",
      body: "Forty-eight hours of niche pressure-testing. We write five candidate angles by hand, run them past a small list, then choose the one with three paying signals before you ever build the page.",
      img: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?w=1400&q=85&auto=format&fit=crop",
      alt: "Studio interior at dawn — minimal light study where the niche-pressure week begins",
      reverse: false,
      kind: "list",
      list: [
        "Niche-pressure interview script (12 questions)",
        "The \"three paying signals\" rubric",
        "Validation worksheet — fill in 1 hour",
      ],
    },
    {
      number: "Workroom 02",
      title: "The Press — write the issue that converts.",
      body: "A six-week shaping room: the cold-open, the pull-quote, the close. Every issue you draft gets line-edited against a single conversion question — would a stranger pay rent for this paragraph?",
      img: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1400&q=85&auto=format&fit=crop",
      alt: "Architectural cornice detail of the studio's south wall — the press where issues take shape",
      reverse: true,
      kind: "quote",
      quote: "The Press is where I stopped trying to sound clever and started getting paid.",
      cite: "— Lin Toh, Cohort 04",
    },
    {
      number: "Workroom 03",
      title: "The Bindery — package, price, and renew.",
      body: "The last four weeks. We ship a tiered pricing page, a year-one renewal letter, and a deliberate way to retire issues into a back-catalogue product. The number on the door becomes a number in the bank.",
      img: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1400&q=85&auto=format&fit=crop",
      alt: "Workshop stair · the bindery floor where issues are bound and signed before dispatch",
      reverse: false,
      kind: "specs",
      specs: [
        { label: "Tier model", value: "3 prices · 1 page" },
        { label: "Cadence", value: "52 issues / yr" },
        { label: "Back-catalogue", value: "$199 vault" },
        { label: "Renewal copy", value: "14-day window" },
      ],
    },
  ];
  const voices = [
    {
      quote: "I rewrote my welcome sequence on the first weekend. Open rates went from 38% to 64% — and three readers replied asking how to pay me before I'd even built the checkout.",
      name: "Lin Toh",
      role: "Cohort 04 · Strategy Letter",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=85&auto=format&fit=crop",
    },
    {
      quote: "The Bindery week alone was worth the whole tuition. I shipped a back-catalogue product on a Sunday and it covered the cost by Tuesday.",
      name: "Devontae Reyes",
      role: "Cohort 06 · Personal Finance",
      img: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=200&q=85&auto=format&fit=crop",
    },
    {
      quote: "I'd been a freelancer for nine years and never had a real renewal letter. The one in module six is the most cynical, generous piece of writing I've ever copied.",
      name: "Aiko Tanaka",
      role: "Cohort 03 · Design Weekly",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=85&auto=format&fit=crop",
    },
  ];
  const faqs = [
    { q: "Do I need an existing audience?", a: "No. Half of last year's cohort started from a list of zero. The Vault week is built for that case — you'll have a 250-person waitlist by week three or your tuition back." },
    { q: "How much time per week is realistic?", a: "Six hours. Three for the workroom, three for shaping your own draft. Most operators do it on Tuesday and Saturday mornings." },
    { q: "What if my niche is \"too small\"?", a: "A 1,200-person paid wine letter outearns most 80,000-person free ones. Small niches with sharp pricing are the entire point. The Vault rubric is built to find them." },
    { q: "Do you teach a specific platform — Substack, Beehiiv, ghost?", a: "Platform-agnostic. The Bindery section ships templates for the three majors plus a self-hosted recipe. Switch later and the writing still works." },
    { q: "Is there a refund window?", a: "Fourteen days, no questions. After the Vault week — if you're not on a paying-signal trajectory — write us and we'll send the tuition back the same day." },
  ];
  const audience = {
    forYou: [
      "Experts looking to monetize their industry knowledge directly.",
      "Freelance writers wanting recurring revenue and ownership.",
      "Creators tired of platform algorithms changing their reach.",
    ],
    notForYou: [
      'People looking for a "get rich quick" scheme without putting in writing work.',
      "Those unwilling to invest time in understanding their audience's deep needs.",
      "Anyone looking for general blogging advice rather than a specific paid model.",
    ],
  };
  const valueStack = [
    { icon: "menu_book", title: "Core Curriculum", body: "6 modules covering everything from niche selection to scaling past 1,000 true fans." },
    { icon: "description", title: "Templates & Swipe Files", body: "Plug-and-play landing pages, welcome emails, and sales sequences." },
    { icon: "forum", title: "Private Community", body: "Lifetime access to a network of serious newsletter operators." },
  ];
  const modules = [
    { title: "Module 1: Finding Your Niche", body: "Discover the exact intersection of your expertise and what people are willing to pay for. Stop guessing and start validating." },
    { title: "Module 2: Building Your List", body: null },
    { title: "Module 3: The Conversion Engine", body: null },
  ];
  const tiers = [
    {
      name: "The Starter",
      price: "$297",
      featured: false,
      perks: ["Core 6-Module Curriculum", "Basic Email Templates"],
      cta: "Get Started",
    },
    {
      name: "The Pro Playbook",
      price: "$497",
      featured: true,
      perks: ["Everything in Starter", "Swipe File Library (50+ templates)", "Lifetime Community Access", "Monthly Q&A Calls"],
      cta: "Join Pro Tier",
    },
  ];
  const footerLinks = ["Terms of Service", "Privacy Policy", "Contact Support", "Member Login"];

  // Bonus Library — premium add-on cards shown after Pricing to inflate value before FAQ.
  // Each carries an inline SVG icon (line-weight 1.5, currentColor) + a value tag so the
  // perceived stack of bonuses is concrete (sales-letter pattern).
  const bonuses = [
    {
      tag: "Bonus · 01",
      title: "The Vault Audit",
      body: "A 30-minute call with the founder to pressure-test your niche before week one. Five candidate angles in, one deliverable angle out — recorded, transcribed, and yours to keep.",
      value: "Worth $480",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />,
    },
    {
      tag: "Bonus · 02",
      title: "Live Q&A Calls",
      body: "Monthly office hours with cohort leads. Bring a draft, a paywall question, or a pricing puzzle. Answers go to the archive so you can replay any past call as long as your seat is open.",
      value: "Worth $240/yr",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />,
    },
    {
      tag: "Bonus · 03",
      title: "Swipe File Library",
      body: "Fifty-plus templates: cold-open hooks, sales-letter close blocks, renewal letters, refund replies. Field-tested in real cohorts. Drop them into your draft and rewrite in your own voice.",
      value: "Worth $390",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />,
    },
    {
      tag: "Bonus · 04",
      title: "Priority Reader Replies",
      body: "Skip the public queue. Reach the author's private inbox once a quarter for a single specific question — paywall maths, niche-fit, copy line-edit — and get a written reply in two working days.",
      value: "Worth $360/yr",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />,
    },
  ];
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "on-error": "#ffffff", "on-primary": "#ffffff", "on-background": "#1b1b1c",
                "surface-container": "#f0eded", "inverse-on-surface": "#f3f0ef",
                "secondary": "#605e5b", "on-surface-variant": "#414942",
                "surface-container-high": "#eae7e7", "on-tertiary": "#ffffff",
                "surface-container-low": "#f6f3f2", "surface": "#fcf9f8",
                "error-container": "#ffdad6", "tertiary-container": "#54514a",
                "error": "#ba1a1a", "on-secondary": "#ffffff",
                "tertiary-fixed": "#e8e2d9", "background": "#fcf9f8",
                "primary-container": "#2d5a3d", "primary": "#144227",
                "secondary-container": "#e6e2dd", "on-surface": "#1b1b1c",
                "tertiary": "#3d3a34", "outline": "#717971", "outline-variant": "#c1c9c0"
              },
              borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
              spacing: {
                "margin-page": "32px", "container-max": "1140px",
                "stack-sm": "16px", "stack-md": "32px", "stack-lg": "64px",
                "gutter": "24px", "unit": "4px"
              },
              fontFamily: {
                "body-md": ["Inter"], "label-caps": ["Inter"], "body-lg": ["Inter"],
                "h1": ["Newsreader"], "h2": ["Newsreader"], "h3": ["Newsreader"]
              },
              fontSize: {
                "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "1.0", letterSpacing: "0.05em", fontWeight: "600" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "h3": ["24px", { lineHeight: "1.3", fontWeight: "500" }],
                "h2": ["36px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
                "h1": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        html, body { overflow-x: clip; }
        .full-bleed {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-right: calc(50% - 50vw);
          max-width: none;
        }
        .pnp-marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: pnp-marquee-x 60s linear infinite;
        }
        .pnp-marquee-track:hover { animation-play-state: paused; }
        @keyframes pnp-marquee-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .pnp-faq summary::-webkit-details-marker { display: none; }
        .pnp-faq summary { list-style: none; }
        .pnp-faq summary .pnp-chevron { transition: transform 250ms ease; }
        .pnp-faq[open] summary .pnp-chevron { transform: rotate(180deg); }
        .pnp-quote-mark {
          font-family: 'Newsreader', serif;
          font-style: italic;
          font-size: 96px;
          line-height: 0.8;
          letter-spacing: -0.04em;
          color: #2d5a3d;
          opacity: 0.18;
        }
        @media (prefers-reduced-motion: reduce) {
          .pnp-marquee-track { animation: none; }
          .pnp-faq summary .pnp-chevron { transition: none; }
        }
      ` }} />

      <div className="bg-background text-on-background font-body-md antialiased selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
        <nav className="bg-[#F9F8F6] dark:bg-stone-950 sticky top-0 w-full border-b border-stone-200 dark:border-stone-800 flex justify-between items-center gap-3 px-4 py-3 z-50 backdrop-blur-md sm:px-6 sm:py-4 md:px-8">
          <div className="text-sm font-serif italic font-bold text-[#1F1F1F] dark:text-stone-100 sm:text-base md:text-xl">The Paid Newsletter Playbook</div>
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {[
                { href: "#curriculum", label: "Curriculum" },
                { href: "#testimonials", label: "Testimonials" },
                { href: "#pricing", label: "Pricing" },
                { href: "#faq", label: "FAQ" },
              ].map(l => (
                <li key={l.href}>
                  <a className="text-stone-600 dark:text-stone-400 font-sans text-sm font-medium hover:text-[#2D5A3D] dark:hover:text-emerald-300 transition-colors opacity-90 active:opacity-100" href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <a className="text-[#2D5A3D] dark:text-emerald-500 font-serif text-lg tracking-tight font-medium hover:opacity-80 transition-opacity" href="#pricing">Get Access</a>
        </nav>

        <main>
          <section className="max-w-container-max mx-auto px-4 py-12 sm:px-6 sm:py-16 md:px-margin-page md:py-[120px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:gap-stack-lg">
              <div className="flex flex-col gap-stack-md pr-0 md:pr-12">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">As featured in</span>
                  <div className="flex flex-wrap gap-3 opacity-60 grayscale sm:gap-4 sm:ml-2">
                    {featuredIn.map(f => <span key={f.label} className={f.className}>{f.label}</span>)}
                  </div>
                </div>
                <h1 className="font-h1 text-[28px] leading-[1.15] text-on-background sm:text-[36px] md:text-h1">
                  Go from 0 to $10k/month writing about what you love
                </h1>
                <p className="font-body-lg text-body-lg text-secondary max-w-lg">
                  The exact, step-by-step system to launch, grow, and monetize a premium newsletter without burning out or needing millions of followers.
                </p>
                <div className="pt-4">
                  <a className="inline-flex items-center justify-center bg-primary-container text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-primary transition-colors duration-300" href="#pricing">Get Instant Access</a>
                  <p className="text-sm text-secondary mt-3">Join 2,500+ successful creators.</p>
                </div>
              </div>
              <div className="relative w-full aspect-[4/5] rounded bg-tertiary-fixed overflow-hidden border border-outline-variant">
                <img alt="Author Portrait" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu203FcqZLRwg7FOjhOX9UPeAHcm196daainqBnYIHY2dsBGNnUD6TBz1abyfgO0eUFIRkyXp6VhZqIeAuIFnnQNTL72q2Xw7m0K4iTAysNqcx9iqhc-G_QqtaiHBgzdX3_yNFeKNZh0ePrgQgvwvMmcS5KCcxBXbt6b4DJvn0isbpv5mlL92YfIi6_P1vgNAfonoCUIPIcp7zdQ2hsYlSn_V57XQ7AGyXRRX-RgbkP2Nz8JXZeqvGl9L7r_pGi8wFB-Tp4PFeJA" />
              </div>
            </div>
          </section>

          {/* Past Students marquee — paused on hover, §I.5 / §K.6 / §M.8 */}
          <section className="full-bleed bg-background py-12 border-t border-outline-variant overflow-hidden sm:py-16 md:py-stack-lg">
            <div className="max-w-container-max mx-auto px-4 mb-stack-md sm:px-6 md:px-margin-page">
              <div className="flex flex-col items-start gap-3 max-w-2xl md:flex-row md:items-end md:justify-between md:max-w-none">
                <div>
                  <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">Chapter II — Proof on the page</span>
                  <h2 className="font-h2 text-[24px] leading-tight text-on-background mt-2 sm:text-[30px] md:text-h2">Writers who left the algorithm — and got paid for it.</h2>
                </div>
                <p className="font-body-md text-body-md text-secondary max-w-md md:text-right">Eight of the 2,500+ operators who built recurring revenue with the Playbook. Hover to pause.</p>
              </div>
            </div>
            <div className="pnp-marquee-track py-2">
              {[...students, ...students].map((s, i) => (
                <figure key={`s-${i}`} aria-hidden={i >= students.length ? "true" : undefined} className={`shrink-0 ${s.shape} relative rounded bg-tertiary-fixed overflow-hidden border border-outline-variant`}>
                  <img alt={i >= students.length ? "" : `${s.name}, ${s.tag}`} className="absolute inset-0 w-full h-full object-cover grayscale contrast-105" src={s.img} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>
                  <figcaption className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-white">
                    <span className="text-label-caps font-label-caps uppercase tracking-widest opacity-80">{s.tag}</span>
                    <span className="font-h3 text-[20px] italic">{s.name}</span>
                    <span className="font-body-md text-sm opacity-90">{s.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="max-w-container-max mx-auto px-4 mt-stack-md grid grid-cols-2 md:grid-cols-4 gap-gutter sm:px-6 md:px-margin-page">
              {stats.map(st => (
                <div key={st.label} className="border-t border-on-background/15 pt-4">
                  <div className="font-h1 text-[40px] leading-none text-on-background tabular-nums">{st.value}</div>
                  <p className="font-body-md text-sm text-secondary mt-2">{st.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-low py-12 border-y border-outline-variant sm:py-16 md:py-stack-lg">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-page">
              <div className="text-center mb-stack-md">
                <h2 className="font-h2 text-[24px] leading-tight text-on-background sm:text-[30px] md:text-h2">Is this for you?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {[
                  { label: "For You", icon: "check_circle", iconColor: "text-primary-container", textColor: "text-on-surface", bulletColor: "text-secondary", h3Color: "", opacity: "", items: audience.forYou },
                  { label: "Not For You", icon: "cancel", iconColor: "text-error", textColor: "text-secondary", bulletColor: "text-outline-variant", h3Color: "text-secondary", opacity: "opacity-80", items: audience.notForYou },
                ].map(group => (
                  <div key={group.label} className={`bg-surface p-stack-md rounded border border-outline-variant ${group.opacity}`}>
                    <h3 className={`font-h3 text-h3 mb-6 flex items-center gap-3 ${group.h3Color}`}>
                      <span className={`material-symbols-outlined ${group.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{group.icon}</span>
                      {group.label}
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {group.items.map(item => (
                        <li key={item} className="flex items-start gap-3">
                          <span className={`material-symbols-outlined mt-1 text-sm ${group.bulletColor}`}>arrow_right</span>
                          <span className={`font-body-md text-body-md ${group.textColor}`}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-container-max mx-auto px-4 py-12 sm:px-6 sm:py-16 md:px-margin-page md:py-stack-lg">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-h2 text-[24px] leading-tight text-center mb-stack-md sm:text-[30px] md:text-h2">Everything you get inside</h2>
              <div className="flex flex-col gap-4">
                {valueStack.map(v => (
                  <div key={v.title} className="flex items-center gap-4 p-4 border-b border-outline-variant">
                    <span className="material-symbols-outlined text-primary-container text-3xl">{v.icon}</span>
                    <div>
                      <h4 className="font-label-caps text-label-caps uppercase tracking-wider mb-1">{v.title}</h4>
                      <p className="font-body-md text-body-md text-secondary">{v.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Inside the Course — 3 alternating image+content rows (§M.1 / §H.1) */}
          <section className="full-bleed py-12 border-y border-outline-variant sm:py-16 md:py-stack-lg" style={{ backgroundColor: "#efeae0" }}>
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-page">
              <div className="max-w-2xl mb-stack-lg">
                <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">Chapter IV — Inside the Playbook</span>
                <h2 className="font-h2 text-[24px] leading-tight text-on-background mt-2 sm:text-[30px] md:text-h2">A craft you can see being built.</h2>
                <p className="font-body-lg text-body-lg text-secondary mt-4">Three workrooms. Each one a fixed habit, a fixed deliverable, and a fixed week to ship it. Not a content drip — an editorial studio.</p>
              </div>
              {workrooms.map((w, i) => (
                <div key={w.number} className={`grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-stack-md items-center ${i < workrooms.length - 1 ? "mb-stack-lg" : ""}`}>
                  <figure className={`md:col-span-7 ${w.reverse ? "md:order-2" : ""} relative aspect-[4/3] rounded bg-tertiary-fixed overflow-hidden border border-outline-variant`}>
                    <img alt={w.alt} className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-105" src={w.img} />
                    <span className="absolute top-4 left-4 px-2 py-1 bg-background text-on-background font-label-caps text-label-caps uppercase tracking-widest">{w.number}</span>
                  </figure>
                  <div className={`md:col-span-5 ${w.reverse ? "md:order-1" : ""} flex flex-col gap-4`}>
                    <span className="font-h3 text-h3 italic text-on-background">{w.title}</span>
                    <p className="font-body-md text-body-md text-secondary">{w.body}</p>
                    {w.kind === "list" && (
                      <ul className="flex flex-col gap-2 pt-2 border-t border-outline-variant">
                        {w.list.map((line, idx) => (
                          <li key={line} className="flex items-baseline gap-3 font-body-md text-body-md text-secondary">
                            <span className="font-label-caps text-label-caps text-primary-container tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {w.kind === "quote" && (
                      <blockquote className="border-l-2 border-primary-container pl-4 py-1 italic font-h3 text-[18px] text-on-background">
                        "{w.quote}"
                        <cite className="block not-italic font-label-caps text-label-caps text-secondary uppercase tracking-widest mt-2">{w.cite}</cite>
                      </blockquote>
                    )}
                    {w.kind === "specs" && (
                      <dl className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant">
                        {w.specs.map(sp => (
                          <div key={sp.label}>
                            <dt className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{sp.label}</dt>
                            <dd className="font-h3 text-[20px] italic text-on-background mt-1">{sp.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="curriculum" className="bg-tertiary-fixed py-12 border-y border-outline-variant sm:py-16 md:py-stack-lg">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-page">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-h2 text-[24px] leading-tight mb-stack-md sm:text-[30px] md:text-h2">The Playbook Curriculum</h2>
                <div className="flex flex-col gap-2">
                  {modules.map(m => (
                    <div key={m.title} className="bg-surface border border-outline-variant rounded p-6">
                      <div className="flex justify-between items-center cursor-pointer">
                        <h3 className="font-h3 text-h3 text-on-background">{m.title}</h3>
                        <span className="material-symbols-outlined text-secondary">expand_more</span>
                      </div>
                      {m.body && <p className="font-body-md text-body-md text-secondary mt-4 pr-12">{m.body}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Voices / Reviews — 3-column testimonial grid with circular portraits */}
          <section id="testimonials" className="max-w-container-max mx-auto px-4 py-12 sm:px-6 sm:py-16 md:px-margin-page md:py-stack-lg">
            <div className="max-w-2xl mb-stack-md">
              <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">Chapter VI — On the record</span>
              <h2 className="font-h2 text-[24px] leading-tight text-on-background mt-2 sm:text-[30px] md:text-h2">What the writers say in their own words.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {voices.map(v => (
                <figure key={v.name} className="bg-surface border border-outline-variant rounded p-stack-md flex flex-col gap-4 relative">
                  <span aria-hidden="true" className="pnp-quote-mark absolute top-4 right-6">&ldquo;</span>
                  <blockquote className="font-h3 text-[20px] italic leading-snug text-on-background">&ldquo;{v.quote}&rdquo;</blockquote>
                  <figcaption className="flex items-center gap-3 mt-auto pt-4 border-t border-outline-variant">
                    <img alt={`Portrait of ${v.name}`} className="w-12 h-12 rounded-full object-cover grayscale" src={v.img} />
                    <div className="flex flex-col">
                      <span className="font-h3 text-base italic text-on-background">{v.name}</span>
                      <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{v.role}</span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="pricing" className="max-w-container-max mx-auto px-4 py-12 sm:px-6 sm:py-16 md:px-margin-page md:py-stack-lg">
            <div className="text-center mb-stack-lg">
              <h2 className="font-h2 text-[24px] leading-tight text-on-background sm:text-[30px] md:text-h2">Choose Your Path</h2>
              <p className="font-body-lg text-body-lg text-secondary mt-4">Invest in the system that pays for itself with your first 5 subscribers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-4xl mx-auto">
              {tiers.map(t => (
                <div
                  key={t.name}
                  className={
                    t.featured
                      ? "border-2 border-primary-container rounded p-8 flex flex-col bg-surface relative shadow-sm"
                      : "border border-outline-variant rounded p-8 flex flex-col bg-surface"
                  }
                >
                  {t.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-label-caps text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-h3 text-h3 text-on-background mb-2">{t.name}</h3>
                  <div className="text-4xl font-h1 text-on-background mb-6">{t.price}</div>
                  <ul className="flex flex-col gap-3 mb-8 flex-grow">
                    {t.perks.map(perk => (
                      <li key={perk} className={t.featured ? "flex items-center gap-2 font-body-md text-on-background font-medium" : "flex items-center gap-2 font-body-md text-secondary"}>
                        <span className={t.featured ? "material-symbols-outlined text-primary-container text-sm" : "material-symbols-outlined text-sm"}>check</span>{" "}
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <a
                    className={
                      t.featured
                        ? "w-full text-center bg-primary-container text-on-primary font-label-caps text-label-caps px-6 py-3 rounded hover:bg-primary transition-colors"
                        : "w-full text-center border border-primary-container text-primary-container font-label-caps text-label-caps px-6 py-3 rounded hover:bg-surface-container transition-colors"
                    }
                    href="#"
                  >
                    {t.cta}
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Bonus Library — 4-card premium add-on stack between Pricing and FAQ.
              Inflates perceived value just before the user reaches the objection-handling
              FAQ; each card states a concrete deliverable + dollar-value tag. */}
          <section id="bonuses" className="full-bleed py-12 border-y border-outline-variant sm:py-16 md:py-stack-lg" style={{ backgroundColor: "#1F2D24" }}>
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-page">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-stack-md max-w-none">
                <div className="max-w-2xl">
                  <span className="text-label-caps font-label-caps text-tertiary-fixed/80 uppercase tracking-widest">Chapter VII · Bonuses included</span>
                  <h2 className="font-h2 text-[24px] leading-tight text-tertiary-fixed mt-2 sm:text-[30px] md:text-h2">Four bonuses already in your seat.</h2>
                  <p className="font-body-md text-body-md text-tertiary-fixed/70 mt-3 max-w-xl">Not "extras for the cart" — these ship with every Pro Playbook. The audit gets booked the day you join, the rest unlock on Tuesday morning of week one.</p>
                </div>
                <div className="flex items-baseline gap-3 font-label-caps text-label-caps uppercase tracking-widest text-tertiary-fixed/60 tabular-nums whitespace-nowrap">
                  <span>Total bonus value</span>
                  <span className="font-h3 text-[28px] italic text-tertiary-fixed not-italic-on-mobile">$1,470</span>
                </div>
              </div>
              {/* 2×2 layout on md+ so cards have enough width to read short on body — */}
              {/* the 4-col stack at lg+ made each card too narrow and too tall. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {bonuses.map((b) => (
                  <article key={b.tag} className="bg-surface/[0.04] border border-tertiary-fixed/15 rounded p-stack-md flex flex-col gap-3 hover:bg-surface/[0.08] hover:border-tertiary-fixed/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="w-11 h-11 border border-tertiary-fixed/30 flex items-center justify-center text-tertiary-fixed">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{b.icon}</svg>
                      </span>
                      <span className="font-label-caps text-label-caps uppercase tracking-widest text-tertiary-fixed/60 tabular-nums">{b.tag}</span>
                    </div>
                    <h3 className="font-h3 text-[22px] italic leading-tight text-tertiary-fixed">{b.title}</h3>
                    <p className="font-body-md text-body-md text-tertiary-fixed/75 leading-relaxed">{b.body}</p>
                    <div className="mt-auto pt-4 border-t border-tertiary-fixed/15 flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-primary-fixed-dim uppercase tracking-widest" style={{ color: "#bcd6c4" }}>{b.value}</span>
                      <span className="font-label-caps text-label-caps uppercase tracking-widest text-tertiary-fixed/40">Included</span>
                    </div>
                  </article>
                ))}
              </div>
              <p className="text-center mt-stack-md font-label-caps text-label-caps uppercase tracking-widest text-tertiary-fixed/50">All bonuses ship with the Pro Playbook · 14-day refund window applies</p>
            </div>
          </section>

          {/* FAQ — native <details> accordion, §M.7 chevron rotation */}
          <section id="faq" className="full-bleed bg-surface-container-low py-12 border-y border-outline-variant sm:py-16 md:py-stack-lg">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-page">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md md:gap-stack-lg">
                <div className="md:col-span-5">
                  <figure className="relative aspect-[4/5] rounded bg-tertiary-fixed overflow-hidden border border-outline-variant md:sticky md:top-32">
                    <img alt="Late afternoon light at the studio's south facade — the desk where reader letters get their replies" className="absolute inset-0 w-full h-full object-cover grayscale-[0.15] contrast-105" src="https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=1200&q=85&auto=format&fit=crop" />
                    <figcaption className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/20 to-transparent text-white">
                      <span className="font-label-caps text-label-caps uppercase tracking-widest opacity-80">From the desk</span>
                      <p className="font-h3 text-[20px] italic leading-snug mt-1">&ldquo;If your question isn't here, mail it. I read every one before the next cohort opens.&rdquo;</p>
                    </figcaption>
                  </figure>
                </div>
                <div className="md:col-span-7">
                  <span className="text-label-caps font-label-caps text-secondary uppercase tracking-widest">Chapter VIII — Common questions</span>
                  <h2 className="font-h2 text-[24px] leading-tight text-on-background mt-2 mb-stack-md sm:text-[30px] md:text-h2">Before you join.</h2>
                  <div className="flex flex-col divide-y divide-outline-variant border-y border-outline-variant">
                    {faqs.map(f => (
                      <details key={f.q} className="pnp-faq group py-5">
                        <summary className="flex items-start justify-between gap-4 cursor-pointer">
                          <h3 className="font-h3 text-h3 text-on-background pr-4">{f.q}</h3>
                          <span className="material-symbols-outlined text-secondary pnp-chevron mt-1">expand_more</span>
                        </summary>
                        <p className="font-body-md text-body-md text-secondary mt-3 pr-12">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer — outer element spans full screen width (no max-w / mt strip); inner div
            holds the content at max-w-7xl with reduced side padding so it reads tight to
            the section above. */}
        <footer className="bg-[#E8E2D9] dark:bg-stone-900 w-full py-8 border-t border-stone-300 dark:border-stone-700 sm:py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
            <div className="text-lg font-serif font-bold text-[#1F1F1F] dark:text-stone-200">The Paid Newsletter Playbook</div>
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.map(l => (
                <a key={l} className="text-stone-500 dark:text-stone-400 font-sans text-xs uppercase tracking-widest hover:text-[#2D5A3D] dark:hover:text-emerald-400 ease-in-out duration-300" href="#">{l}</a>
              ))}
            </div>
            <div className="text-[#2D5A3D] dark:text-emerald-500 font-sans text-xs uppercase tracking-widest">
              © 2024 The Paid Newsletter Playbook. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
