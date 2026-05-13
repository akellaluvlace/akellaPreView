function ComingSoon() {
  // Countdown target — 30 days from first render. `useRef` would freeze the
  // target across re-renders too, but useState's lazy initializer is enough
  // here and reads simpler.
  const [target] = React.useState(() => Date.now() + 30 * 24 * 60 * 60 * 1000);
  const [now, setNow] = React.useState(() => Date.now());
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  const milestones = [
    { step: "Step 01", date: "Mar · 2026", title: "Editor pre-alpha",  body: "Long-form composer with the typesetting we wanted. Closed circle of 38 writers.",  status: "Shipped",  statusCls: "text-[#7DA0FF] bg-[#7DA0FF]/10 border-[#7DA0FF]/30",                          cardCls: "border-stone-800 bg-[#0b0b0c]/60",                  hasDot: false },
    { step: "Step 02", date: "May · 2026", title: "Quiet beta",        body: "First 200 writers from the waitlist. Custom domains, RSS, no metrics.",              status: "Now",      statusCls: "text-[#FF4D2E] bg-[#FF4D2E]/15 border-[#FF4D2E]/40 inline-flex items-center gap-1.5", cardCls: "border-[#FF4D2E]/40 bg-[#FF4D2E]/5",                hasDot: true  },
    { step: "Step 03", date: "Jul · 2026", title: "Open enrolment",    body: "Public sign-ups roll out a hundred a day. No invite code, no dashboard, no urgency.", status: "Soon",     statusCls: "text-stone-400 bg-stone-800/60 border-stone-700",                              cardCls: "border-stone-800 bg-[#0b0b0c]/60",                  hasDot: false },
    { step: "Step 04", date: "Q4 · 2026", title: "Folio Annual",       body: "A printed yearbook of the best 50 essays, mailed to every contributor. The web is plenty, but ink is lovely.", status: "Late '26", statusCls: "text-stone-400 bg-stone-800/60 border-stone-700",  cardCls: "border-stone-800 bg-[#0b0b0c]/60",                  hasDot: false },
  ];

  const gallery = [
    { col: "md:col-span-7", aspect: "aspect-[4/3] md:aspect-auto md:h-full", src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop", alt: "Architectural detail of columns and shadow", label: "Essay · 014", title: "A grammar of doorways", titleCls: "text-lg md:text-xl", fill: true },
    { col: "md:col-span-5", aspect: "aspect-[4/3] md:aspect-auto md:h-full", src: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?q=80&w=900&auto=format&fit=crop",  alt: "Concrete stair rising toward light",      label: "Essay · 022", title: "On going up alone",       titleCls: "text-lg md:text-xl", fill: true },
    { col: "md:col-span-4", aspect: "aspect-square", src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=900&auto=format&fit=crop", alt: "Open notebook on a wooden desk",     label: "Note · 005",  title: "Unfinished is a tense",   titleCls: "text-base", fill: false },
    { col: "md:col-span-4", aspect: "aspect-square", src: "https://images.unsplash.com/photo-1685787773514-90e8e14af797?q=80&w=900&auto=format&fit=crop", alt: "Geometric concrete cantilever",       label: "Essay · 031", title: "The cantilever theory",   titleCls: "text-base", fill: false },
    { col: "md:col-span-4", aspect: "aspect-square", src: "https://images.unsplash.com/photo-1601993957728-1e56ab70c5a8?q=80&w=900&auto=format&fit=crop", alt: "Concrete corridor with columnar verticals", label: "Note · 011",  title: "A column is a question",  titleCls: "text-base", fill: false },
  ];

  const trustedLogos = [
    { slug: "medium",      alt: "Medium" },
    { slug: "substack",    alt: "Substack" },
    { slug: "theguardian", alt: "The Guardian" },
    { slug: "telegraph",   alt: "The Telegraph" },
    { slug: "behance",     alt: "Behance" },
    { slug: "vimeo",       alt: "Vimeo" },
    { slug: "notion",      alt: "Notion" },
    { slug: "framer",      alt: "Framer" },
  ];

  const premiumPillars = [
    { numeral: "I",   icon: "verified",      title: "A real domain, kept for life.",          body: "Your essays live at your address — not a slug under ours. We renew the registration, we host the certificate, we stay out of the URL. Move out any month and the domain comes with you.", chip: "Included", cta: "Read more →",  featured: true },
    { numeral: "II",  icon: "auto_awesome",  title: "Typography we drew, not licensed.",      body: "Every page is set in Folio Text and Folio Display — type the studio drew at the kitchen table. The kerning is non-negotiable, and the italic has the slope we wanted in 2014.",         chip: "Built in", cta: "Specimens →",  featured: false },
    { numeral: "III", icon: "lock",          title: "No metrics, anywhere.",                  body: "No view counter, no like button, no follower number. The dashboard is one page long: it tells you the date your domain renews, and that's the dashboard.",                                  chip: "By design", cta: "Why →",        featured: false },
    { numeral: "IV",  icon: "mail",          title: "A printed yearbook, mailed to you.",     body: "Once a year, the editors pick fifty essays from the circle and bind them. Every contributor gets one copy in the post — paper, sewn signatures, no QR codes.",                            chip: "Late '26", cta: "A look →",     featured: false },
  ];

  const tenets = [
    { num: "/01", title: "No metrics.",   body: "Pages have no view counter, no like button, no follower number. The editor will not nag." },
    { num: "/02", title: "No feed.",      body: "If somebody wants to read your essay, they'll be reading it. The reverse-chronological river is over." },
    { num: "/03", title: "No algorithm.", body: "Discoverability happens through your domain, your RSS, and the people you actually know." },
    { num: "/04", title: "One email.",    body: "When the doors open, you get one note. Maybe one again at the printed-yearbook stage. That's it." },
  ];

  const founders = [
    { initials: "EH", name: "Eliot Hayes",      role: "Editor",        quote: "I wanted the writing app I'd had at 24, on a yellow legal pad — but with a domain and an RSS feed.", prior: "Prior · Editorial, Harper's" },
    { initials: "MA", name: "Mira Akiyama",     role: "Engineering",   quote: "There is no follower count anywhere in the codebase. We don't even compute it. That part felt like the point.", prior: "Prior · Infra, Vercel" },
    { initials: "RS", name: "Rune Sørensen",    role: "Type & Design", quote: "Every page on Folio is set in something I drew at the kitchen table. The kerning is non-negotiable.", prior: "Prior · Type, Klim Foundry" },
  ];

  return (
    <>
      <title>Coming Soon — Folio</title>
      <meta name="description" content="Minimalist pre-launch page with email capture and countdown." />
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { background: #0b0b0c; color: #f5f1ea; }
        .dial { font-variant-numeric: tabular-nums; }
        .img-folio { filter: grayscale(100%) contrast(115%) brightness(85%); transition: filter 0.6s ease; }
        .group:hover .img-folio { filter: grayscale(60%) contrast(105%) brightness(95%); }
      ` }} />

      <div className="font-sans antialiased">
        {/* Hero / countdown */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 10%, rgba(255,77,46,0.25), transparent 40%), radial-gradient(circle at 80% 80%, rgba(120,160,255,0.18), transparent 45%)",
            }}
          />

          <a href="#" className="flex items-center gap-2 text-sm uppercase tracking-[0.4em] text-stone-400">
            <span className="inline-block h-2 w-2 rotate-45 bg-[#FF4D2E]"></span>
            Folio
          </a>

          <h1 className="mt-12 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
            Something new is <span className="italic text-[#FF4D2E]">nearly here.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-stone-400 md:text-lg">
            We're building a quieter way to publish — handmade pages, no feed, no algorithm.
            Drop your email and we'll send one note when it opens.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@domain.com"
              className="flex-1 rounded-full border border-stone-700 bg-transparent px-5 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-[#FF4D2E] focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitted}
              className="rounded-full bg-[#FF4D2E] px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-stone-900 transition hover:bg-[#ff6747] disabled:opacity-90 disabled:cursor-default"
            >
              {submitted ? "On the list ✓" : "Notify me"}
            </button>
          </form>

          <div id="countdown" className="mt-16 flex gap-6 text-stone-200">
            <div className="text-center">
              <div className="dial text-4xl font-semibold md:text-5xl">{pad(days)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-stone-500">Days</div>
            </div>
            <div className="text-center">
              <div className="dial text-4xl font-semibold md:text-5xl">{pad(hours)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-stone-500">Hours</div>
            </div>
            <div className="text-center">
              <div className="dial text-4xl font-semibold md:text-5xl">{pad(minutes)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-stone-500">Minutes</div>
            </div>
            <div className="text-center">
              <div className="dial text-4xl font-semibold md:text-5xl">{pad(seconds)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-stone-500">Seconds</div>
            </div>
          </div>

          <a href="#roadmap" className="absolute bottom-8 text-[10px] uppercase tracking-[0.4em] text-stone-500 hover:text-stone-300 transition flex flex-col items-center gap-2">
            Read the plan
            <span className="block w-px h-8 bg-stone-700"></span>
          </a>
        </section>

        {/* Trusted by / Featured in */}
        <section className="w-full py-20 md:py-24 px-6 border-y border-stone-900">
          <div className="max-w-5xl mx-auto text-center">
            <p className="block text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-8 md:mb-10">— Pre-launch press · Featured in</p>
            <div className="grid grid-cols-4 md:grid-cols-8 items-center gap-x-8 gap-y-10 opacity-80">
              {trustedLogos.map(l => (
                <img
                  key={l.slug}
                  src={`https://cdn.simpleicons.org/${l.slug}/F5F1EA`}
                  alt={l.alt}
                  className="h-6 md:h-7 w-auto mx-auto opacity-60 hover:opacity-100 transition"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap — full-bleed ink-blue */}
        <section id="roadmap" className="w-full py-24 md:py-32 px-6" style={{ background: "linear-gradient(180deg, #0b0b0c 0%, #0e1228 30%, #0e1228 70%, #0b0b0c 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7DA0FF] mb-3">Roadmap · Quietly</p>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-xl">Four steps. No theatrics.</h2>
              </div>
              <p className="text-stone-400 max-w-sm md:text-right">Each milestone gets one note in the email. We'll never write twice in a week.</p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              {milestones.map(m => (
                <li key={m.step} className={`relative rounded-2xl border ${m.cardCls} p-6 backdrop-blur-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="dial text-xs uppercase tracking-[0.25em] text-stone-500">{m.step}</span>
                    <span className={`text-[10px] uppercase tracking-[0.3em] px-2 py-1 rounded-full border ${m.statusCls}`}>
                      {m.hasDot && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF4D2E] animate-pulse"></span>}
                      {m.status}
                    </span>
                  </div>
                  <p className="dial text-xs uppercase tracking-[0.25em] text-stone-400 mb-3">{m.date}</p>
                  <h3 className="text-xl font-semibold mb-2">{m.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{m.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pages Already Made — full-bleed deep purple gallery */}
        <section className="w-full py-24 md:py-32 px-6" style={{ background: "linear-gradient(180deg, #0b0b0c 0%, #160c20 25%, #160c20 75%, #0b0b0c 100%)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#C28FFF] mb-3">From the closed circle</p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Pages already made.</h2>
              <p className="mt-4 text-stone-400 max-w-xl mx-auto">A few essays from the pre-alpha, set in our editor. They'll never go to a feed.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-5 items-stretch">
              {gallery.map(g => (
                <figure key={g.title} className={`group relative ${g.col} ${g.aspect} overflow-hidden rounded-2xl border border-stone-800`}>
                  <img src={g.src} alt={g.alt} className={`${g.fill ? "absolute inset-0 " : ""}w-full h-full object-cover img-folio`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160c20] via-transparent to-transparent" />
                  <figcaption className="absolute bottom-4 left-4 right-4 text-left">
                    <p className="dial text-[10px] uppercase tracking-[0.3em] text-[#C28FFF]">{g.label}</p>
                    <p className={`font-semibold ${g.titleCls} mt-1`}>{g.title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-10 text-center text-xs uppercase tracking-[0.3em] text-stone-500">Photographs · Closed circle, vols. I–II · MMXXVI</p>
          </div>
        </section>

        {/* Image + Content A — workspace spread */}
        <section className="w-full py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <figure className="relative md:col-span-7 aspect-[16/10] overflow-hidden rounded-2xl border border-stone-800">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop" alt="Quiet desk with a single lamp and notebook" className="absolute inset-0 w-full h-full object-cover img-folio" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c]/60 via-transparent to-transparent" />
              </figure>
              <div className="md:col-span-5 flex flex-col gap-5 justify-center">
                <p className="block text-[10px] uppercase tracking-[0.4em] text-[#FF4D2E] mb-2">— The editor</p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">A composer that gets out of the way.</h2>
                <p className="text-stone-400 leading-relaxed">No toolbars hovering over your sentences. No word counts ticking up while you write. The first thing the editor does is hide itself, and the second thing is set your line in something you'd be glad to see in print.</p>
                <div className="flex items-center gap-6 mt-2">
                  <a href="#roadmap" className="rounded-full bg-[#FF4D2E] px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-stone-900 transition hover:bg-[#ff6747]">See the roadmap</a>
                  <a href="#" className="text-sm text-stone-300 underline-offset-4 hover:underline">Read the founding letter →</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto — full-bleed warm cream-on-dark */}
        <section className="w-full py-24 md:py-32 px-6" style={{ background: "linear-gradient(180deg, #0b0b0c 0%, #1a1814 25%, #1a1814 75%, #0b0b0c 100%)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#F5E6C8] mb-6">Manifesto</p>
            <blockquote className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-[#f5f1ea]">
              "We are building a quieter <span className="italic text-[#FF4D2E]">place to write</span> &mdash; the one we wished we'd had on the days the feed got loud."
            </blockquote>
            <p className="mt-8 text-sm uppercase tracking-[0.3em] text-stone-500">— Founding letter, Jan 2026</p>

            <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {tenets.map(t => (
                <li key={t.num} className="rounded-2xl border border-stone-800 bg-[#0b0b0c]/40 p-6">
                  <div className="dial text-2xl font-semibold text-[#FF4D2E] mb-2">{t.num}</div>
                  <p className="font-semibold mb-1">{t.title}</p>
                  <p className="text-sm text-stone-400 leading-relaxed">{t.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Premium 2x2 — what you get */}
        <section className="w-full py-24 md:py-32 px-6" style={{ background: "linear-gradient(180deg, #0b0b0c 0%, #11151c 25%, #11151c 75%, #0b0b0c 100%)" }}>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="block text-[10px] uppercase tracking-[0.4em] text-[#7DA0FF] mb-8 md:mb-10">— What every page gives you</p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Four things, kept on purpose.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch">
              {premiumPillars.map(p => (
                <article
                  key={p.numeral}
                  className={`relative rounded-2xl p-8 md:p-10 flex flex-col ${
                    p.featured
                      ? "border-2 border-[#FF4D2E]/40 bg-[#FF4D2E]/5 ring-1 ring-[#FF4D2E]/20"
                      : "border border-stone-800 bg-[#0b0b0c]/60"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#FF4D2E] text-[10px] uppercase tracking-[0.25em] text-stone-900 font-semibold">Featured</span>
                  )}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`material-symbols-outlined ${p.featured ? "text-[#FF4D2E]" : "text-[#7DA0FF]"}`} style={{ fontSize: "32px" }}>{p.icon}</span>
                    <span className="dial italic text-2xl text-stone-500">{p.numeral}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed flex-1">{p.body}</p>
                  <div className="mt-6 pt-6 border-t border-stone-800 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-stone-500">
                    <span className="px-2 py-1 rounded-full border border-stone-700 bg-stone-800/40">{p.chip}</span>
                    <span className={p.featured ? "text-[#FF4D2E]" : "text-stone-300"}>{p.cta}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Founders — full-bleed warm rust */}
        <section className="w-full py-24 md:py-32 px-6" style={{ background: "linear-gradient(180deg, #0b0b0c 0%, #1a0d05 25%, #1a0d05 75%, #0b0b0c 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF4D2E] mb-3">Made by</p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Three people. One quiet plan.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {founders.map(f => (
                <article key={f.name} className="rounded-2xl border border-[#FF4D2E]/20 bg-[#0b0b0c]/40 p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#FF4D2E]/15 border border-[#FF4D2E]/40 flex items-center justify-center font-semibold text-[#FF4D2E] dial">{f.initials}</div>
                    <div>
                      <p className="font-semibold">{f.name}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mt-0.5">{f.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-stone-400 leading-relaxed italic">"{f.quote}"</p>
                  <p className="mt-6 pt-6 border-t border-stone-800 text-xs uppercase tracking-[0.25em] text-stone-500">{f.prior}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Image + Content B — paper / craft (alternated) */}
        <section className="w-full py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-5 md:order-1 flex flex-col gap-5 justify-center">
                <p className="block text-[10px] uppercase tracking-[0.4em] text-[#F5E6C8] mb-2">— The yearbook</p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">A book in the post, every December.</h2>
                <p className="text-stone-400 leading-relaxed">Fifty essays, sewn signatures, a cloth cover the colour of the year's mood. Printed in Wellington and posted from there. Every contributor gets one — including the writers whose pieces didn't make this volume.</p>
                <div className="flex items-center gap-6 mt-2">
                  <a href="#" className="rounded-full border border-stone-700 px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-stone-100 transition hover:border-[#FF4D2E] hover:text-[#FF4D2E]">See vol. I</a>
                  <a href="#" className="text-sm text-stone-300 underline-offset-4 hover:underline">Press notes →</a>
                </div>
              </div>
              <figure className="relative md:col-span-7 md:order-2 aspect-[16/10] overflow-hidden rounded-2xl border border-stone-800">
                <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1400&auto=format&fit=crop" alt="Open hardback book on a writing desk" className="absolute inset-0 w-full h-full object-cover img-folio" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c]/60 via-transparent to-transparent" />
              </figure>
            </div>
          </div>
        </section>

        <footer className="w-full py-10 px-6 text-center text-xs uppercase tracking-[0.3em] text-stone-600 border-t border-stone-900">
          Folio · 2026 · Built quietly in Berlin &amp; Wellington
        </footer>
      </div>
    </>
  );
}

export default ComingSoon;
