export default function T24LinkInBio() {
  const links = [
    { icon: "🍵", label: "Tea Brand", bg: "bg-primary-container", border: "border" },
    { icon: "🐕", label: "Dog Vlog", bg: "bg-secondary-container", border: "border" },
    { icon: "🛍️", label: "Shop Merch", bg: "bg-tertiary-container", border: "border-[3px]", featured: true },
    { icon: "📸", label: "Instagram", bg: "bg-error-container", border: "border" },
    { icon: "🎥", label: "TikTok", bg: "bg-primary-fixed", border: "border" },
    { icon: "💌", label: "Newsletter", bg: "bg-secondary-fixed", border: "border" }
  ];

  const socials = ["photo_camera", "music_video", "play_circle"];

  // Section 3 — alternating image+content rows
  const projects = [
    {
      n: "01",
      kicker: "Brand · Steepwell",
      title: "A loose-leaf brand for the slow afternoon.",
      body: "Four blends, no caffeine ladder. Sourced from one farm in Shizuoka and one in West Bengal — the rest is the kettle.",
      tags: [
        { text: "4 blends", cls: "bg-primary-container text-on-primary-container" },
        { text: "Restocks · monthly", cls: "bg-tertiary-container text-on-tertiary-container" }
      ],
      cta: "Open the shop",
      img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1400&q=85&auto=format&fit=crop",
      alt: "tea ceremony overhead — kettle, brass strainer, ceramic cups arranged on linen",
      tag: "— 01 · Tea",
      reverse: false
    },
    {
      n: "02",
      kicker: "Vlog · Bean & Pickle",
      title: "A weekly dog show, mostly napping.",
      body: "Five minutes a Sunday — Bean does something dramatic, Pickle ruins it, I narrate it like a nature doc. 32 episodes, 0 sponsors I don't actually use.",
      tags: [
        { text: "32 episodes", cls: "bg-secondary-container text-on-secondary-container" },
        { text: "Sundays · 09:00", cls: "bg-primary-fixed text-on-primary-fixed" }
      ],
      cta: "Watch the show",
      img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1400&q=85&auto=format&fit=crop",
      alt: "a small dog with bright eyes resting on a soft blanket",
      tag: "— 02 · Vlog",
      reverse: true
    },
    {
      n: "03",
      kicker: "Shop · Studio Goods",
      title: "Tees, totes, the occasional ceramic.",
      body: "Printed in small runs by a 2-person studio in Lisbon. If a thing's sold out, it'll be back when we make more — not when an algorithm decides.",
      tags: [
        { text: "12 SKUs", cls: "bg-tertiary-container text-on-tertiary-container" },
        { text: "Restock · soon", cls: "bg-secondary-fixed text-on-secondary-fixed" }
      ],
      cta: "Browse the shop",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1400&q=85&auto=format&fit=crop",
      alt: "folded organic-cotton tees stacked on a linen-covered table — Lisbon studio drop",
      tag: "— 03 · Merch",
      reverse: false
    }
  ];

  // Section 4 — marquee tiles
  const marqueeTiles = [
    {
      size: "w-80 h-56",
      img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900&q=85&auto=format&fit=crop",
      alt: "overhead flat-lay of a tea ceremony with cups, kettle and dried leaves",
      chip: { text: "Reel", cls: "bg-surface text-on-surface border-on-surface/30" },
      meta: "42.1k · 7d"
    },
    {
      size: "w-60 h-72",
      img: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=800&q=85&auto=format&fit=crop",
      alt: "portrait of a young woman laughing in a sunlit kitchen",
      chip: { text: "Story", cls: "bg-primary-container text-on-primary-container border-primary" },
      meta: "12.4k · 3d"
    },
    {
      size: "w-96 h-56",
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=85&auto=format&fit=crop",
      alt: "a small dog peeks out of a wicker basket with morning light",
      chip: { text: "Vlog · 28", cls: "bg-secondary-container text-on-secondary-container border-secondary" },
      meta: "88.7k · 2w"
    },
    {
      size: "w-64 h-64",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85&auto=format&fit=crop",
      alt: "folded organic-cotton t-shirts in muted tones on a linen surface",
      chip: { text: "Drop", cls: "bg-tertiary-container text-on-tertiary-container border-tertiary" },
      meta: "5.6k · 1w"
    },
    {
      size: "w-80 h-56",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=85&auto=format&fit=crop",
      alt: "hands writing in a journal with a steaming cup of tea nearby",
      chip: { text: "Letter · 14", cls: "bg-surface text-on-surface border-on-surface/30" },
      meta: "9.2k · 3w"
    },
    {
      size: "w-60 h-72",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85&auto=format&fit=crop",
      alt: "hands arranging dried flowers on a wooden table",
      chip: { text: "Studio", cls: "bg-primary-fixed text-on-primary-fixed border-on-primary-fixed" },
      meta: "3.1k · 4w"
    },
    {
      size: "w-80 h-56",
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=85&auto=format&fit=crop",
      alt: "warm overhead shot of a tea-steeping ritual with brass strainer",
      chip: { text: "Press · Kinfolk", cls: "bg-secondary-fixed text-on-secondary-fixed border-on-secondary-fixed" },
      meta: "— 03/26"
    }
  ];

  // Section 5 — doctrine
  const tenets = [
    {
      n: "01",
      img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=85&auto=format&fit=crop",
      alt: "matcha bowl on a linen table — small batch, complete in one sitting",
      title: "Make small. Make often.",
      body: "A 12-jar batch is a complete thing. So is a 3-minute video. Bigger is the trap, not the goal."
    },
    {
      n: "02",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=85&auto=format&fit=crop",
      alt: "open spiral notebook with pencil and pressed leaf",
      title: "Write the thing first.",
      body: "If I can't write a paragraph about a product or a video, it isn't ready. Captions come from notebooks, not the post box."
    },
    {
      n: "03",
      img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&q=85&auto=format&fit=crop",
      alt: "small dog asleep on a sunlit rug",
      title: "The dogs run the schedule.",
      body: "Walks at 8 and 4. Filming around them, never the other way around. They've never missed a deadline; I have."
    },
    {
      n: "04",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=85&auto=format&fit=crop",
      alt: "folded organic-cotton tees stacked on a linen-covered table",
      title: "Sponsor the stuff I'd already buy.",
      body: "No partnerships unless I've used the thing for at least a month. The list is short on purpose."
    },
    {
      n: "05",
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85&auto=format&fit=crop",
      alt: "kettle steaming over a teacup on linen — kettle-on protocol",
      title: "Put a kettle on before any meeting.",
      body: "It's mostly a delay tactic. But also: I make better choices three sips in than I do at minute zero."
    }
  ];

  // Section 6 — testimonials
  const quotes = [
    {
      body: "The newsletter is the only one I open the morning it lands. Steepwell tea is the one I refill when it runs out.",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=85&auto=format&fit=crop",
      alt: "portrait of Mira in soft afternoon light",
      name: "Mira A.",
      role: "Reader · since '24"
    },
    {
      body: "Bean & Pickle has carried me through two house moves and a bad winter. Sunday at nine, every week, no skips.",
      img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=200&q=85&auto=format&fit=crop",
      alt: "portrait of a young man with curly hair",
      name: "Tomás L.",
      role: "Vlog viewer · 32 eps"
    },
    {
      body: "Worked with Kaia on a small Steepwell collaboration — small in the best way. Honest, quiet, on time, careful with the pictures.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=85&auto=format&fit=crop",
      alt: "portrait of a woman in soft afternoon light",
      name: "Hana W.",
      role: "Studio · ceramics"
    }
  ];

  // Section 7 — FAQ
  const faqs = [
    {
      q: "Where is the tea sourced?",
      a: "Two farms only — one in Shizuoka, Japan (Sencha + Hojicha) and a small estate in Darjeeling (the autumn flush). Both visited in person, both pictured on the jar."
    },
    {
      q: "Do you take brand collaborations?",
      a: "One a quarter, max. The criteria are short: I've used the thing for at least a month, the team is small, and the pitch isn't a calendar invite. Newsletter reply or kaia@steepwell.studio."
    },
    {
      q: "When does merch restock?",
      a: "When the studio in Lisbon finishes the next run — usually six to eight weeks after a sellout. Subscribers get a 24h heads-up before public stock."
    },
    {
      q: "What's the dog vlog schedule?",
      a: "Sunday 09:00 GMT, every week barring real life. We've missed three Sundays in three years, two for moving house and one because Bean ate a sock."
    },
    {
      q: "Is the newsletter free?",
      a: "Yes — Sundays, no pop-ups, no tracking pixels. Paid tier exists only for studio recipes and full Steepwell sourcing notes; not required to read anything else."
    }
  ];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface": "#f9faf5", "background": "#f9faf5", "surface-bright": "#f9faf5", "surface-dim": "#d9dad6", "surface-variant": "#e2e3de", "surface-container-lowest": "#ffffff", "surface-container-low": "#f3f4ef", "surface-container": "#edeeea", "surface-container-high": "#e8e8e4", "surface-container-highest": "#e2e3de",
            "on-surface": "#1a1c1a", "on-surface-variant": "#414942", "on-background": "#1a1c1a",
            "primary": "#3e674b", "on-primary": "#ffffff", "primary-container": "#bdebc7", "on-primary-container": "#426c4f", "primary-fixed": "#c0eec9", "primary-fixed-dim": "#a4d1ae", "on-primary-fixed": "#00210e", "on-primary-fixed-variant": "#264f34",
            "secondary": "#7b5641", "on-secondary": "#ffffff", "secondary-container": "#fecdb2", "on-secondary-container": "#795540", "secondary-fixed": "#ffdbc9", "secondary-fixed-dim": "#ecbda2", "on-secondary-fixed": "#2e1505", "on-secondary-fixed-variant": "#603f2b",
            "tertiary": "#685f25", "on-tertiary": "#ffffff", "tertiary-container": "#eee199", "on-tertiary-container": "#6d6329", "tertiary-fixed": "#f1e39c", "tertiary-fixed-dim": "#d4c782", "on-tertiary-fixed": "#201c00", "on-tertiary-fixed-variant": "#50470f",
            "error": "#ba1a1a", "on-error": "#ffffff", "error-container": "#ffdad6", "on-error-container": "#93000a",
            "outline": "#727971", "outline-variant": "#c1c8c0"
          },
          spacing: { "container-max": "640px", "stack-gap": "12px", "section-padding": "40px" },
          fontFamily: {
            "display-xl": ["Plus Jakarta Sans"], "headline-lg": ["Plus Jakarta Sans"], "headline-md": ["Plus Jakarta Sans"],
            "body-lg": ["Inter"], "body-md": ["Inter"], "button-text": ["Inter"],
            "caveat": ["Caveat"]
          },
          fontSize: {
            "display-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
            "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
            "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
            "body-lg": ["18px", { lineHeight: "1.5", fontWeight: "500" }],
            "body-md": ["16px", { lineHeight: "1.5", fontWeight: "500" }],
            "button-text": ["16px", { lineHeight: "1", letterSpacing: "0.01em", fontWeight: "600" }]
          }
        }
      }
    }
  `;

  const customCss = `
    html, body { overflow-x: clip; }
    .full-bleed {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      max-width: none;
    }
    .kb-marquee-track {
      display: flex;
      align-items: center;
      gap: 18px;
      width: max-content;
      animation: kb-marquee 55s linear infinite;
      padding: 10px 0;
    }
    .kb-marquee-wrap:hover .kb-marquee-track { animation-play-state: paused; }
    @keyframes kb-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 9px)); }
    }
    .kb-pulse { animation: kb-pulse-ring 2.4s ease-out infinite; }
    @keyframes kb-pulse-ring {
      0%, 100% { box-shadow: 0 0 0 0 rgba(62,103,75,0.5); }
      50% { box-shadow: 0 0 0 9px rgba(62,103,75,0); }
    }
    .kb-faq summary::-webkit-details-marker { display: none; }
    .kb-faq summary { list-style: none; cursor: pointer; }
    .kb-faq summary .kb-chev { transition: transform 250ms ease; display: inline-block; }
    .kb-faq[open] summary .kb-chev { transform: rotate(45deg); }
    .kb-float { animation: kb-float-y 7s ease-in-out infinite; }
    @keyframes kb-float-y {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .kb-underline {
      background-image: linear-gradient(transparent 75%, rgba(62,103,75,0.35) 75%);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 0 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .kb-marquee-track { animation: none; }
      .kb-pulse { animation: none; }
      .kb-float { animation: none; }
      .kb-faq summary .kb-chev { transition: none; }
    }
  `;

  // Build doubled marquee imperatively (avoid fragment-with-key trap, §M.13)
  const renderMarqueeTile = (t, i, hidden) => (
    <figure
      key={`${hidden ? "d" : "o"}-${i}`}
      aria-hidden={hidden ? "true" : undefined}
      className={`relative ${t.size} rounded-xl overflow-hidden border border-on-surface/20 shrink-0 bg-surface-container`}
    >
      <img className="absolute inset-0 w-full h-full object-cover" alt={hidden ? "" : t.alt} src={t.img} />
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
        <span className={`px-2 py-0.5 rounded-full ${t.chip.cls} text-[10px] font-bold uppercase tracking-[0.18em] border`}>{t.chip.text}</span>
        <span className="text-white text-[11px] font-mono drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">{t.meta}</span>
      </div>
    </figure>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Caveat:wght@500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col relative overflow-x-hidden">
        <div className="fixed top-20 left-[-20px] text-5xl opacity-20 z-0">✨</div>
        <div className="fixed top-1/3 right-[-10px] text-6xl opacity-20 z-0 rotate-12">💖</div>
        <div className="fixed bottom-32 right-[-20px] text-5xl opacity-20 z-0">⭐</div>

        <header className="bg-transparent sticky top-0 w-full z-50">
          <div className="flex justify-between items-center w-full max-w-[420px] mx-auto px-6 py-4">
            <span className="text-lg font-black text-slate-900 tracking-tight">@kaia.builds</span>
            <button className="hover:opacity-80 active:scale-90 transition">
              <span className="material-symbols-outlined text-slate-900">share</span>
            </button>
          </div>
        </header>

        {/* SECTION 1 — link rail hero */}
        <section className="w-full max-w-[420px] mx-auto px-6 pt-10 pb-16 flex flex-col items-center z-10 relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-on-surface bg-surface-container-high mb-4">
              <img className="w-full h-full object-cover" alt="Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ4xVkRRz0Row3K3O8RQDdE3U2AfePg3BKJh36RAnVzZwxC-ngKB_OjCv0-6KK6QfUekyTT08sEeAskkX3Xj8VKWJPGniodTBfl776e6-B2xnxUgrIOnLxbNC9WiN1LsPMocGez73r4Jp4dBwt3X0By4xdpVncrHhMBP62Mxqe4kqYS5I9ZXfNbYhKkq3JGf0f3xFbvy_KNiQJluVf1t2SPSXGCf__4zps6fvSKzENmw5ckQVU3MLrmFdiwJUIl87fujuY-_buLpyE" />
            </div>
            <h1 className="font-display-xl text-display-xl text-on-surface text-center mb-2 tracking-tight">@kaia.builds</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant text-center max-w-[280px]">building a tea brand & dog content</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container border border-on-surface">
              <span className="w-2 h-2 rounded-full bg-primary kb-pulse" aria-hidden="true"></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-primary-container">Open · taking 1 brand collab</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-stack-gap">
            {links.map((l) => (
              <a key={l.label} href="#" className={`w-full py-4 px-6 rounded-xl flex items-center ${l.bg} ${l.border} border-on-surface text-on-surface font-button-text text-button-text active:scale-95 transition-transform ${l.featured ? "relative overflow-hidden group" : ""}`}>
                {l.featured && <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>}
                <span className={`text-2xl mr-4 ${l.featured ? "relative z-10" : ""}`}>{l.icon}</span>
                <span className={`flex-1 text-center ${l.featured ? "relative z-10 font-bold" : ""}`}>{l.label}</span>
              </a>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-on-surface-variant">
            <span className="font-caveat text-2xl text-secondary">scroll for the rest</span>
            <span className="material-symbols-outlined text-secondary kb-float">south</span>
          </div>
        </section>

        {/* SECTION 2 — full-bleed cinematic */}
        <section className="full-bleed relative overflow-hidden" style={{ backgroundColor: "#1a1c1a" }}>
          <div className="relative w-full h-[60vh] min-h-[420px] max-h-[640px]">
            <img className="absolute inset-0 w-full h-full object-cover opacity-90" alt="warm overhead shot of loose-leaf tea, brass strainer, and ceramic cups on a linen surface" src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1920&q=85&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/85 pointer-events-none"></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 18% 92%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)" }}></div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 95% 8%, rgba(189,235,199,0.18) 0%, transparent 60%)" }}></div>
            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-10 md:pb-14 max-w-[1200px] mx-auto">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-container mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Latest drop · 02 — Steepwell No. 04</span>
              <h2 className="font-display-xl text-[40px] md:text-[64px] leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] max-w-[14ch]">A small tea<br /><em className="font-caveat font-normal text-tertiary-fixed-dim">brewed slowly.</em></h2>
              <p className="mt-4 font-body-lg text-body-lg text-white/85 max-w-[44ch] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">First batch of the season. 80 jars, hand-folded labels, packed with sleepy dog supervision.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary-container text-on-primary-container border border-primary font-button-text text-sm hover:translate-y-[-1px] transition-transform">
                  <span className="material-symbols-outlined text-base">storefront</span>
                  Shop the drop
                </a>
                <a href="#" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white border border-white/30 backdrop-blur-sm font-button-text text-sm hover:bg-white/15 transition">
                  <span className="material-symbols-outlined text-base">play_circle</span>
                  Behind the steep
                </a>
              </div>
              <div className="mt-8 pt-5 border-t border-white/15 grid grid-cols-3 gap-4 max-w-[520px]">
                <div>
                  <div className="text-white font-display-xl text-[22px] tabular-nums">80</div>
                  <div className="text-white/70 text-[11px] uppercase tracking-[0.18em] mt-0.5">jars</div>
                </div>
                <div>
                  <div className="text-white font-display-xl text-[22px] tabular-nums">04</div>
                  <div className="text-white/70 text-[11px] uppercase tracking-[0.18em] mt-0.5">batch · '26</div>
                </div>
                <div>
                  <div className="text-white font-display-xl text-[22px] tabular-nums">1</div>
                  <div className="text-white/70 text-[11px] uppercase tracking-[0.18em] mt-0.5">tired dog</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — alternating image+content */}
        <section className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-tertiary mb-2 block">— Currently making</span>
              <h2 className="font-display-xl text-[34px] md:text-[44px] leading-[1.05] tracking-tight text-on-surface">Three things on <span className="kb-underline">my desk.</span></h2>
            </div>
            <a href="#" className="hidden md:inline-flex items-center gap-1 text-on-surface-variant text-sm hover:text-on-surface">All projects <span className="material-symbols-outlined text-base">arrow_outward</span></a>
          </div>

          <div className="flex flex-col gap-12 md:gap-20">
            {projects.map((p) => {
              const figureCls = `md:col-span-7 ${p.reverse ? "md:order-2" : ""} relative aspect-[4/3] rounded-2xl overflow-hidden border border-on-surface/20 bg-surface-container`;
              const contentCls = `md:col-span-5 ${p.reverse ? "md:order-1" : ""}`;
              return (
                <article key={p.n} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                  <figure className={figureCls}>
                    <img className="absolute inset-0 w-full h-full object-cover" alt={p.alt} src={p.img} />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface text-on-surface text-[10px] font-semibold uppercase tracking-[0.18em] border border-on-surface/30">{p.tag}</span>
                  </figure>
                  <div className={contentCls}>
                    <span className="text-tertiary text-[11px] uppercase tracking-[0.22em] font-semibold">{p.kicker}</span>
                    <h3 className="mt-2 font-display-xl text-[28px] leading-[1.1] tracking-tight">{p.title}</h3>
                    <p className="mt-3 font-body-md text-on-surface-variant">{p.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t.text} className={`px-2.5 py-1 rounded-full ${t.cls} text-[11px] font-semibold`}>{t.text}</span>
                      ))}
                    </div>
                    <a href="#" className="mt-6 inline-flex items-center gap-1 text-on-surface font-semibold border-b border-on-surface pb-0.5">{p.cta} <span className="material-symbols-outlined text-base">arrow_outward</span></a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 4 — marquee */}
        <section className="full-bleed py-16 md:py-24" style={{ backgroundColor: "#f3f4ef" }}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 mb-8 md:mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary block mb-2">— Lately, on the feed</span>
              <h2 className="font-display-xl text-[32px] md:text-[40px] leading-[1.05] tracking-tight">A scroll, paused.</h2>
            </div>
            <span className="hidden md:inline-flex items-center gap-2 text-on-surface-variant text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary kb-pulse" aria-hidden="true"></span>
              hover to pause
            </span>
          </div>

          <div className="kb-marquee-wrap relative overflow-hidden">
            <div className="kb-marquee-track">
              {marqueeTiles.map((t, i) => renderMarqueeTile(t, i, false))}
              {marqueeTiles.map((t, i) => renderMarqueeTile(t, i, true))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — doctrine */}
        <section className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="md:max-w-[680px] mb-10 md:mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary block mb-2">— The studio rules</span>
            <h2 className="font-display-xl text-[34px] md:text-[44px] leading-[1.05] tracking-tight">Five things I keep <em className="font-caveat font-normal text-secondary">on the wall.</em></h2>
            <p className="mt-4 font-body-md text-on-surface-variant max-w-[52ch]">A small list to slow myself down on the loud days. None of it's clever — it's just what makes the work feel mine.</p>
          </div>

          <ol className="border-t border-on-surface/15">
            {tenets.map((t) => (
              <li key={t.n} className="grid grid-cols-12 gap-4 md:gap-8 py-7 md:py-9 border-b border-on-surface/15 items-center">
                <span className="col-span-12 md:col-span-1 font-display-xl text-[34px] md:text-[44px] text-tertiary tabular-nums leading-none">{t.n}</span>
                <figure className="col-span-3 md:col-span-2 aspect-square rounded-xl overflow-hidden border border-on-surface/20 bg-surface-container">
                  <img className="w-full h-full object-cover" alt={t.alt} src={t.img} />
                </figure>
                <div className="col-span-9 md:col-span-9">
                  <h3 className="font-headline-md text-headline-md tracking-tight">{t.title}</h3>
                  <p className="mt-1 font-body-md text-on-surface-variant max-w-[58ch]">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* SECTION 6 — testimonials */}
        <section className="full-bleed py-16 md:py-24" style={{ backgroundColor: "#ECE2CE" }}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary block mb-2">— Said about the work</span>
                <h2 className="font-display-xl text-[32px] md:text-[40px] leading-[1.05] tracking-tight">Kind notes from <span className="kb-underline">good company.</span></h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {quotes.map((q) => (
                <figure key={q.name} className="relative bg-surface rounded-2xl border border-on-surface/15 p-6 flex flex-col gap-5">
                  <span className="material-symbols-outlined text-tertiary text-3xl leading-none">format_quote</span>
                  <blockquote className="font-headline-md text-[20px] leading-[1.35] tracking-tight text-on-surface">"{q.body}"</blockquote>
                  <figcaption className="mt-auto pt-5 border-t border-on-surface/10 flex items-center gap-3">
                    <img className="w-11 h-11 rounded-full object-cover border border-on-surface/20" alt={q.alt} src={q.img} />
                    <div>
                      <div className="font-button-text text-button-text text-on-surface">{q.name}</div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">{q.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7 — FAQ */}
        <section className="w-full max-w-[920px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-tertiary block mb-2">— Things people ask</span>
              <h2 className="font-display-xl text-[32px] md:text-[40px] leading-[1.05] tracking-tight">A short FAQ, <em className="font-caveat font-normal text-primary">honest answers.</em></h2>
              <p className="mt-4 font-body-md text-on-surface-variant max-w-[42ch]">If yours isn't here, the newsletter reply box reaches my actual inbox.</p>
              <a href="#" className="mt-5 inline-flex items-center gap-2 text-on-surface font-semibold border-b border-on-surface pb-0.5">Email me directly <span className="material-symbols-outlined text-base">mail</span></a>
            </div>
            <div className="md:col-span-7">
              <div className="divide-y divide-on-surface/15 border-t border-b border-on-surface/15">
                {faqs.map((f) => (
                  <details key={f.q} className="kb-faq group p-5">
                    <summary className="flex items-center justify-between gap-4">
                      <h3 className="font-headline-md text-[19px] tracking-tight">{f.q}</h3>
                      <span className="kb-chev material-symbols-outlined text-tertiary text-2xl">add</span>
                    </summary>
                    <p className="mt-3 font-body-md text-on-surface-variant max-w-[58ch]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 — Black & white snapshot strip. Static (not animated), screen-width,
            7-square row of moments from the studio. Clean visual breath before the footer. */}
        <section className="full-bleed py-12 md:py-16 border-t border-on-surface/15 bg-surface-container-low">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-6 md:mb-8">
            <div className="flex items-end justify-between gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-on-surface-variant">— A quiet contact sheet</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant tabular-nums hidden md:inline">No. 24 · Spring '26</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 md:gap-2 px-1.5 md:px-2">
            {[
              { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ4xVkRRz0Row3K3O8RQDdE3U2AfePg3BKJh36RAnVzZwxC-ngKB_OjCv0-6KK6QfUekyTT08sEeAskkX3Xj8VKWJPGniodTBfl776e6-B2xnxUgrIOnLxbNC9WiN1LsPMocGez73r4Jp4dBwt3X0By4xdpVncrHhMBP62Mxqe4kqYS5I9ZXfNbYhKkq3JGf0f3xFbvy_KNiQJluVf1t2SPSXGCf__4zps6fvSKzENmw5ckQVU3MLrmFdiwJUIl87fujuY-_buLpyE", alt: "kaia in studio" },
              { src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&q=85&auto=format&fit=crop", alt: "studio dog asleep" },
              { src: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=85&auto=format&fit=crop", alt: "matcha tea overhead" },
              { src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=85&auto=format&fit=crop", alt: "small dog peeking out of basket" },
              { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=85&auto=format&fit=crop", alt: "folded organic cotton tees" },
              { src: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=85&auto=format&fit=crop", alt: "tea ceremony with brass strainer" },
              { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85&auto=format&fit=crop", alt: "tea cup with steam, soft afternoon light" },
            ].map((tile, i) => (
              <figure key={i} className="aspect-square overflow-hidden bg-on-surface/5">
                <img src={tile.src} alt={tile.alt} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale contrast-[1.05]" />
              </figure>
            ))}
          </div>
          <p className="text-center mt-6 md:mt-8 text-[10px] uppercase tracking-widest text-on-surface-variant">Photographed at the kitchen table · Sundays, between brews</p>
        </section>

        <footer className="bg-transparent w-full bottom-0 mt-auto z-10 relative">
          <div className="w-full max-w-[420px] mx-auto px-6 py-10 flex flex-col justify-center items-center gap-4">
            <div className="flex gap-6 mb-2">
              {socials.map((icon) => (
                <a key={icon} href="#" className="text-on-surface hover:text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </a>
              ))}
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-slate-400">Built with kaia.builds</span>
          </div>
        </footer>
      </div>
    </>
  );
}
