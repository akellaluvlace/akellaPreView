const ESSAY_ROWS = [
  {
    side: "left",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=85&auto=format&fit=crop",
    alt: "Server rack interior with cabling",
    read: "11 min read",
    date: "Apr 29, 2024",
    tag: "#NETWORKING",
    title: "When TCP backpressure stops being a metaphor",
    body: "Most engineers reach for \"TCP handles backpressure\" as a calming incantation, then are surprised when their service falls over under load anyway. This essay walks through what actually happens at each layer once a slow consumer stops draining the receive window: the kernel queues that fill, the retransmits that pile up, the way `epoll` flips between edge and level triggering, and the moment when application-level buffering quietly accepts a write that the socket cannot. It ends with a small Rust example that makes the failure mode reproducible on a laptop."
  },
  {
    side: "right",
    img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=1200&q=85&auto=format&fit=crop",
    alt: "Industrial machinery — gauge cluster",
    read: "14 min read",
    date: "Apr 12, 2024",
    tag: "#KERNEL",
    title: "A patient tour of the Linux page cache",
    body: "The page cache is the operating system's most influential black box. It governs whether your `read()` returns from disk or from RAM, whether `mmap` is faster than `pread`, whether your container's \"memory usage\" is honest or a lie. We start from the data structures (radix tree, address_space, struct page) and work outward through reclaim, dirty writeback, and the subtle ways that `madvise` and `posix_fadvise` change what stays resident. By the end you should be able to predict, within order-of-magnitude, what `vmstat` will print under any given workload."
  },
  {
    side: "left",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&auto=format&fit=crop",
    alt: "Circuit board macro showing dense surface-mount components",
    read: "9 min read",
    date: "Mar 30, 2024",
    tag: "#OBSERVABILITY",
    title: "Tracing without a vendor: a `perf` and `bpftrace` walkthrough",
    body: "You can do a remarkable amount of distributed-tracing-style work with just `perf record`, `bpftrace`, and a little patience. This piece is the tutorial I wish I had when I first realised that \"we need a tracing platform\" was sometimes shorthand for \"we have not yet read `man perf-script`\". It covers attaching uprobes to a Go binary without symbol tables, joining kernel-side block-device latencies to user-side request IDs, and exporting flame graphs that a product manager will actually look at without flinching."
  }
];

const MEMOS = [
  {
    no: "014",
    date: "May 02, 2024",
    title: "Most \"service mesh\" pain is just unowned DNS",
    p1: "I have now seen enough postmortems to confidently say: a non-trivial fraction of incidents blamed on the mesh are actually CoreDNS being CoreDNS, plus a stale `ndots:5` default copying its way through every Helm chart in the org. The mesh gets the blame because it is the most recent thing on the diagram.",
    p2: "The fix is unromantic. Set `ndots:1` in your pod spec, point your stub resolver at a node-local cache, and stop letting four sidecars argue about A vs AAAA records. You can buy a year of mesh runway with one ConfigMap."
  },
  {
    no: "013",
    date: "Apr 22, 2024",
    title: "Latency histograms are a moral instrument",
    p1: "Averages flatter you. Percentiles tell the truth, but only if you trust the buckets. A 100ms-wide bucket at the tail will absorb a thirty-second outlier and call it a 200ms request. The histogram is doing what you asked; you asked the wrong thing.",
    p2: "Pick exponential buckets, log them, then go back and re-read your last incident in the new light. You will probably find the SLO that was \"always green\" had been hiding a small population of users having a much worse week than the dashboard ever admitted to."
  },
  {
    no: "012",
    date: "Apr 09, 2024",
    title: "\"Eventually consistent\" is a two-word load-bearing apology",
    p1: "Every eventually consistent system has a quiet contract with its operator: you will not look too closely, and in return the system will mostly be right. The trouble starts when a downstream user does start looking closely — usually a finance team, usually with a spreadsheet.",
    p2: "The honest answer is to publish a staleness budget alongside the latency one, and to alert when reads cross it. Not to \"fix\" eventual consistency, but to admit it has a shape."
  },
  {
    no: "011",
    date: "Mar 28, 2024",
    title: "There is no such thing as a \"just a feature flag\"",
    p1: "Feature flags are runtime configuration. Runtime configuration is, in practice, a small distributed system you did not plan to build. It has eventual consistency, partitions, version skew between SDKs and servers, and a habit of being wrong in the most expensive customer's session.",
    p2: "Treat them with the suspicion you would give any mutable global. Audit flag deletions like you audit migrations. Pin SDKs. The team that takes flags seriously ships faster than the team that thinks of them as \"just config\"."
  }
];

const PROJECTS = [
  { img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=85&auto=format&fit=crop", alt: "Server room aisle", caption: "apex · 2024" },
  { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop", alt: "Circuit board macro", caption: "snapshot · 2023" },
  { img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=85&auto=format&fit=crop&crop=focalpoint&fp-x=0.3", alt: "Server rack tight crop", caption: "scaffold · 2023" },
  { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop&crop=focalpoint&fp-x=0.7", alt: "Circuit board low-angle macro", caption: "helix · 2023" },
  { img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=85&auto=format&fit=crop&crop=focalpoint&fp-x=0.7", alt: "Server hardware deep crop", caption: "lattice · 2022" },
  { img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=600&q=85&auto=format&fit=crop", alt: "Industrial machinery cluster", caption: "forge · 2022" },
  { img: "https://images.unsplash.com/photo-1776524039930-ea1ed83b0f97?w=600&q=85&auto=format&fit=crop&crop=focalpoint&fp-x=0.3", alt: "Industrial machinery tight crop", caption: "cornice · 2022" },
  { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=85&auto=format&fit=crop&crop=focalpoint&fp-x=0.3", alt: "Circuit detail with copper traces", caption: "aperture · 2021" }
];

const FAQS = [
  {
    q: "Why do you publish so seldom?",
    a: "Because the cost of being wrong in public, on a topic where I am supposed to know what I am talking about, is meaningfully higher than the cost of staying quiet for another month and re-reading the kernel patch one more time. I would rather publish six things a year that I will still endorse in five years than publish forty that I will quietly retract by reorganising the tags. The cadence is the editorial position."
  },
  {
    q: "Can I republish your essays elsewhere?",
    a: "Yes — non-commercially, with attribution, and a canonical link back to the original URL. Translations are especially welcome; please mark them as translations and include the translator's name. For commercial republication (a paid newsletter, a printed anthology, a training corpus you intend to sell access to) please email first; the answer is usually yes, but the answer is never silent."
  },
  {
    q: "Are there RSS feeds for individual tags?",
    a: "There is a main feed at `/feed.xml`, an Atom mirror at `/feed.atom`, and per-tag feeds at `/tags/<tag>.xml` for every tag with at least three posts. They are all hand-curated — no auto-generated firehose — so an item appears in at most one tag feed even when it belongs to several. JSON Feed support is not planned; if you need it, the conversion is a five-line script."
  },
  {
    q: "Will you write about <topic X>?",
    a: "Probably not on request. The essays here exist because I have spent long enough with the subject to have an opinion that survives a hostile review, and that condition does not transfer well to other people's curiosity. That said — if you have an unusual production failure that you can describe in detail, and you would like a second pair of eyes, I read every email and answer about a third of them."
  },
  {
    q: "Do you do consulting or advisory work?",
    a: "Sparingly. I take on roughly two engagements a year, both small (sub-six-week), both deeply technical, and both with a written deliverable that the client can hand to their next engineer six months later. I do not do \"advisory\" arrangements where I appear on a website in exchange for an option grant, and I do not do retainer work. If you have a real, narrow, specific systems problem, write to me and I will tell you honestly whether I can help."
  },
  {
    q: "How do I contact you?",
    a: "Email is best — `editor@fsync.dev`. PGP key on the about page if you need it; I read encrypted mail within a day or two. I am not on most social platforms; the accounts that do exist are passive mirrors of the RSS feed. Please do not DM me on chat platforms about an essay — the response time is measured in months, and the conversation will fork in ways neither of us can audit."
  },
  {
    q: "Why open-source the blog code itself?",
    a: "Because I write about systems engineering, and a blog whose source is not auditable is, in a small way, a counter-example to its own essays. The repository — static generator, theme, RSS, deploy script — is at `github.com/fsync/blog` under a permissive license. It is not a product, it has no roadmap, and I am not interested in pull requests that add comments, analytics, or tracking. Forks are welcome and encouraged."
  }
];

const FSYNC_FAQ_CSS = `
.fsync-faq summary::-webkit-details-marker { display: none; }
.fsync-faq .fsync-chevron { transition: transform 250ms ease; }
.fsync-faq[open] .fsync-chevron { transform: rotate(45deg); }
@media (prefers-reduced-motion: reduce) {
  .fsync-faq .fsync-chevron { transition: none; }
}
`;

export default function T36TechBlog() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "surface-container-highest": "#e4e2e2",
                "surface-dim": "#dbdad9",
                "on-tertiary": "#ffffff",
                "background": "#fbf9f8",
                "inverse-surface": "#303030",
                "on-surface-variant": "#464555",
                "outline-variant": "#c7c4d8",
                "primary": "#3525cd",
                "secondary-container": "#e5e2e1",
                "on-primary-container": "#dad7ff",
                "secondary-fixed": "#e5e2e1",
                "secondary": "#5f5e5e",
                "surface-container": "#efeded",
                "on-secondary": "#ffffff",
                "on-error": "#ffffff",
                "inverse-primary": "#c3c0ff",
                "primary-container": "#4f46e5",
                "outline": "#777587",
                "on-primary-fixed-variant": "#3323cc",
                "tertiary-container": "#a44100",
                "secondary-fixed-dim": "#c8c6c5",
                "on-tertiary-fixed-variant": "#7b2f00",
                "surface-container-lowest": "#ffffff",
                "inverse-on-surface": "#f2f0f0",
                "surface-variant": "#e4e2e2",
                "primary-fixed": "#e2dfff",
                "on-tertiary-container": "#ffd2be",
                "on-secondary-fixed-variant": "#474646",
                "surface-tint": "#4d44e3",
                "on-surface": "#1b1c1c",
                "error": "#ba1a1a",
                "surface-container-low": "#f5f3f3",
                "on-primary-fixed": "#0f0069",
                "on-tertiary-fixed": "#351000",
                "error-container": "#ffdad6",
                "surface-container-high": "#eae8e7",
                "primary-fixed-dim": "#c3c0ff",
                "tertiary-fixed": "#ffdbcc",
                "surface": "#fbf9f8",
                "on-background": "#1b1c1c",
                "on-secondary-fixed": "#1c1b1b",
                "on-primary": "#ffffff",
                "tertiary-fixed-dim": "#ffb695",
                "surface-bright": "#fbf9f8",
                "tertiary": "#7e3000",
                "on-secondary-container": "#656464",
                "on-error-container": "#93000a",
                "dracula-bg": "#282a36",
                "dracula-curr": "#44475a",
                "dracula-fg": "#f8f8f2",
                "dracula-comment": "#6272a4",
                "dracula-cyan": "#8be9fd",
                "dracula-green": "#50fa7b",
                "dracula-orange": "#ffb86c",
                "dracula-pink": "#ff79c6",
                "dracula-purple": "#bd93f9",
                "dracula-red": "#ff5555",
                "dracula-yellow": "#f1fa8c"
              },
              borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
              spacing: {
                "stack-sm": "0.5rem",
                "sidebar-width": "280px",
                "gutter": "1.5rem",
                "container-max-width": "800px",
                "stack-md": "1rem",
                "stack-lg": "2.5rem"
              },
              fontFamily: {
                "h3": ["Inter"],
                "body-sm": ["Inter"],
                "code": ["JetBrains Mono"],
                "h1": ["Inter"],
                "h2": ["Inter"],
                "label-caps": ["Inter"],
                "body": ["Inter"]
              },
              fontSize: {
                "h3": ["18px", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }],
                "body-sm": ["14px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
                "code": ["14px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
                "h1": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
                "h2": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
                "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
                "body": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }]
              }
            }
          }
        }
      ` }} />

      <div className="bg-surface text-on-surface font-body text-body antialiased flex min-h-screen">

        <aside className="hidden md:flex flex-col gap-1 py-8 px-0 bg-white dark:bg-zinc-950 font-['Inter'] antialiased tracking-tight text-sm fixed left-0 top-0 h-screen w-[240px] border-r border-zinc-200 dark:border-zinc-800 z-10">
          <div className="px-6 pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-4">
            <h1 className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">fsync.dev</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Systems Engineering</p>
          </div>
          <nav className="flex-1 overflow-y-auto w-full">
            <ul className="flex flex-col gap-1">
              <li className="w-full">
                <a className="flex items-center gap-3 px-6 py-2 border-l-2 border-indigo-600 dark:border-indigo-500 text-zinc-900 dark:text-zinc-50 font-semibold bg-zinc-50/50 dark:bg-zinc-900/30 cursor-pointer active:opacity-80 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 duration-200" href="#">
                  <span className="material-symbols-outlined">article</span>
                  <span>All posts</span>
                </a>
              </li>
              <li className="w-full">
                <a className="flex items-center gap-3 px-6 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border-l-2 border-transparent cursor-pointer active:opacity-80 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 duration-200" href="#">
                  <span className="material-symbols-outlined">label</span>
                  <span>Tags</span>
                </a>
              </li>
              <li className="w-full">
                <a className="flex items-center gap-3 px-6 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border-l-2 border-transparent cursor-pointer active:opacity-80 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 duration-200" href="#">
                  <span className="material-symbols-outlined">terminal</span>
                  <span>Projects</span>
                </a>
              </li>
              <li className="w-full">
                <a className="flex items-center gap-3 px-6 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border-l-2 border-transparent cursor-pointer active:opacity-80 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 duration-200" href="#">
                  <span className="material-symbols-outlined">person</span>
                  <span>About</span>
                </a>
              </li>
              <li className="w-full mt-auto">
                <a className="flex items-center gap-3 px-6 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border-l-2 border-transparent cursor-pointer active:opacity-80 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 duration-200" href="#">
                  <span className="material-symbols-outlined">rss_feed</span>
                  <span>RSS</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 ml-0 md:ml-[240px] py-8 md:py-12 flex flex-col items-stretch">
          <style dangerouslySetInnerHTML={{ __html: FSYNC_FAQ_CSS }} />
          <div className="w-full max-w-container-max-width mx-auto px-gutter">
            <header className="md:hidden flex items-center justify-between pb-4 border-b border-surface-container-highest mb-4">
              <div>
                <h1 className="font-h1 text-h1 text-on-surface">fsync.dev</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Systems Engineering</p>
              </div>
              <button className="p-2 border border-surface-container-highest rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </header>
          </div>

          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-stack-lg">
            <section aria-label="Recent Posts" className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 lg:gap-x-16 gap-y-14">

              <div className="lg:col-span-5 lg:order-1">
                <div className="bg-dracula-bg rounded-lg border border-surface-container-highest overflow-hidden h-full">
                  <div className="flex items-center justify-between px-4 py-2 bg-dracula-curr/30 border-b border-surface-container-highest/20">
                    <span className="font-code text-code text-dracula-comment text-xs">$ cat io_uring/setup.rs</span>
                    <span className="material-symbols-outlined text-dracula-comment text-sm">terminal</span>
                  </div>
                  <pre className="p-4 overflow-x-auto"><code className="font-code text-code text-dracula-fg" style={{ fontSize: "13px", lineHeight: "1.7" }}><span className="text-dracula-pink">let mut</span> <span className="text-dracula-fg">ring</span> = <span className="text-dracula-green">IoUring</span>::<span className="text-dracula-cyan">new</span>(<span className="text-dracula-purple">256</span>)?;{"\n\n"}<span className="text-dracula-pink">let</span> <span className="text-dracula-fg">read_e</span> = <span className="text-dracula-green">opcode</span>::<span className="text-dracula-green">Read</span>::<span className="text-dracula-cyan">new</span>(<span className="text-dracula-fg">fd</span>, <span className="text-dracula-fg">buf</span>, <span className="text-dracula-purple">4096</span>){"\n"}    .<span className="text-dracula-cyan">build</span>(){"\n"}    .<span className="text-dracula-cyan">user_data</span>(<span className="text-dracula-purple">0x42</span>);{"\n\n"}<span className="text-dracula-fg">ring</span>.<span className="text-dracula-cyan">submission</span>().<span className="text-dracula-cyan">push</span>(&amp;<span className="text-dracula-fg">read_e</span>)?;{"\n"}<span className="text-dracula-fg">ring</span>.<span className="text-dracula-cyan">submit_and_wait</span>(<span className="text-dracula-purple">1</span>)?;{"\n\n"}<span className="text-dracula-comment">{`// → zero syscall overhead per op`}</span></code></pre>
                </div>
              </div>
              <article className="lg:col-span-7 lg:order-2 bg-surface-container-lowest border border-surface-container-highest rounded-lg p-6 hover:border-primary-container transition-colors duration-200 group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary-container transition-colors">push_pin</span>
                </div>
                <div className="flex flex-col gap-stack-sm">
                  <time className="font-body-sm text-body-sm text-on-surface-variant">Nov 12, 2023</time>
                  <h2 className="font-h2 text-h2 text-on-surface group-hover:text-primary-container transition-colors">Optimizing I/O performance on Linux with io_uring</h2>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#LINUX</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#KERNEL</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#PERFORMANCE</span>
                  </div>
                  <p className="font-body text-body text-on-surface-variant mt-2">Traditional POSIX asynchronous I/O (AIO) has long been a source of frustration for systems engineers. This deep dive explores how `io_uring` revolutionizes Linux I/O by providing a fast, scalable, and genuinely asynchronous interface, eliminating the overhead of frequent system calls through shared ring buffers.</p>
                  <div className="mt-4 flex items-center gap-2 text-primary-container font-body-sm text-body-sm font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Read full article</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </article>

              <figure className="lg:col-span-5 lg:order-3 m-0">
                <div className="overflow-hidden rounded-lg border border-surface-container-highest aspect-[4/3] bg-dracula-bg">
                  <img alt="Server rack with blue indicator LEDs along the kernel networking path" className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85&auto=format&fit=crop" />
                </div>
                <figcaption className="mt-2 font-code text-code text-on-surface-variant">capture · networking lab · 02:41</figcaption>
              </figure>
              <article className="lg:col-span-7 lg:order-4 bg-surface-container-lowest border border-surface-container-highest rounded-lg p-6 hover:border-primary-container transition-colors duration-200 group cursor-pointer">
                <div className="flex flex-col gap-stack-sm">
                  <time className="font-body-sm text-body-sm text-on-surface-variant">Oct 24, 2023</time>
                  <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary-container transition-colors">Deep dive into eBPF filters</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#LINUX</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#NETWORKING</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#EBPF</span>
                  </div>
                  <p className="font-body text-body text-on-surface-variant mt-2">Extended Berkeley Packet Filter (eBPF) has fundamentally changed how we observe and manipulate network traffic in the kernel. We examine the mechanics of attaching XDP programs to network interfaces for high-performance packet dropping before the kernel networking stack is even invoked.</p>
                </div>
              </article>

              <div className="lg:col-span-5 lg:order-5">
                <div className="bg-dracula-bg rounded-lg border border-surface-container-highest overflow-hidden h-full">
                  <div className="flex items-center justify-between px-4 py-2 bg-dracula-curr/30 border-b border-surface-container-highest/20">
                    <span className="font-code text-code text-dracula-comment text-xs">$ cat memory_order.cc</span>
                    <span className="material-symbols-outlined text-dracula-comment text-sm">terminal</span>
                  </div>
                  <pre className="p-4 overflow-x-auto"><code className="font-code text-code text-dracula-fg" style={{ fontSize: "13px", lineHeight: "1.7" }}><span className="text-dracula-comment">{`// producer`}</span>{"\n"}<span className="text-dracula-fg">payload</span>.<span className="text-dracula-cyan">store</span>(<span className="text-dracula-fg">data</span>);{"\n"}<span className="text-dracula-fg">ready</span>.<span className="text-dracula-cyan">store</span>(<span className="text-dracula-pink">true</span>,{"\n"}   <span className="text-dracula-green">std</span>::<span className="text-dracula-cyan">memory_order_release</span>);{"\n\n"}<span className="text-dracula-comment">{`// consumer`}</span>{"\n"}<span className="text-dracula-pink">while</span> (!<span className="text-dracula-fg">ready</span>.<span className="text-dracula-cyan">load</span>({"\n"}   <span className="text-dracula-green">std</span>::<span className="text-dracula-cyan">memory_order_acquire</span>)) {"{}"}{"\n\n"}<span className="text-dracula-pink">auto</span> <span className="text-dracula-fg">v</span> = <span className="text-dracula-fg">payload</span>.<span className="text-dracula-cyan">load</span>(); <span className="text-dracula-comment">{`// safe`}</span></code></pre>
                </div>
              </div>
              <article className="lg:col-span-7 lg:order-6 bg-surface-container-lowest border border-surface-container-highest rounded-lg p-6 hover:border-primary-container transition-colors duration-200 group cursor-pointer">
                <div className="flex flex-col gap-stack-sm">
                  <time className="font-body-sm text-body-sm text-on-surface-variant">Oct 15, 2023</time>
                  <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary-container transition-colors">Memory barriers and lock-free data structures</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#CONCURRENCY</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#C</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#ARCHITECTURE</span>
                  </div>
                  <p className="font-body text-body text-on-surface-variant mt-2">Writing lock-free code requires a solid understanding of memory ordering rules across different CPU architectures. This post breaks down acquire/release semantics and explains why the compiler's view of memory ordering often differs from the hardware's reality.</p>
                </div>
              </article>

              <div className="lg:col-span-5 lg:order-7">
                <div className="bg-dracula-bg rounded-lg border border-surface-container-highest overflow-hidden h-full">
                  <div className="flex items-center justify-between px-4 py-2 bg-dracula-curr/30 border-b border-surface-container-highest/20">
                    <span className="font-code text-code text-dracula-comment text-xs">src/allocator.rs</span>
                    <button className="text-dracula-comment hover:text-dracula-fg transition-colors">
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto"><code className="font-code text-code text-dracula-fg" style={{ fontSize: "13px", lineHeight: "1.7" }}><span className="text-dracula-pink">use</span> <span className="text-dracula-fg">core::alloc::</span>{"{"}<span className="text-dracula-fg">GlobalAlloc</span>, <span className="text-dracula-fg">Layout</span>{"}"};{"\n"}<span className="text-dracula-pink">use</span> <span className="text-dracula-fg">core::ptr::</span><span className="text-dracula-purple">null_mut</span>;{"\n\n"}<span className="text-dracula-pink">pub struct</span> <span className="text-dracula-green">BumpAllocator</span> {"{"}{"\n"}    <span className="text-dracula-purple">heap_start</span>: <span className="text-dracula-cyan">usize</span>,{"\n"}    <span className="text-dracula-purple">heap_end</span>:   <span className="text-dracula-cyan">usize</span>,{"\n"}    <span className="text-dracula-purple">next</span>:       <span className="text-dracula-cyan">usize</span>,{"\n"}{"}"}{"\n\n"}<span className="text-dracula-pink">unsafe impl</span> <span className="text-dracula-green">GlobalAlloc</span> <span className="text-dracula-pink">for</span> <span className="text-dracula-green">Locked</span>&lt;<span className="text-dracula-green">BumpAllocator</span>&gt; {"{"}{"\n"}    <span className="text-dracula-pink">unsafe fn</span> <span className="text-dracula-green">alloc</span>(&amp;<span className="text-dracula-orange">self</span>, <span className="text-dracula-orange">layout</span>: <span className="text-dracula-cyan">Layout</span>){"\n"}        -&gt; <span className="text-dracula-cyan">*mut u8</span> {"{"}{"\n"}        <span className="text-dracula-pink">let mut</span> <span className="text-dracula-fg">a</span> = <span className="text-dracula-orange">self</span>.<span className="text-dracula-cyan">lock</span>();{"\n"}        <span className="text-dracula-comment">{`// bump pointer + alignment`}</span>{"\n"}        <span className="text-dracula-purple">null_mut</span>(){"\n"}    {"}"}{"\n"}{"}"}</code></pre>
                </div>
              </div>
              <article className="lg:col-span-7 lg:order-8 bg-surface-container-lowest border border-surface-container-highest rounded-lg p-6 hover:border-primary-container transition-colors duration-200 group cursor-pointer">
                <div className="flex flex-col gap-stack-sm">
                  <time className="font-body-sm text-body-sm text-on-surface-variant">Oct 02, 2023</time>
                  <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary-container transition-colors">Implementing a custom memory allocator in Rust</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#RUST</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#SYSTEMS</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#MEMORY</span>
                  </div>
                  <p className="font-body text-body text-on-surface-variant mt-2">Rust's `GlobalAlloc` trait allows for replacing the system's default memory allocator. We build a simple bump allocator suitable for embedded systems or specific tight-loop scenarios where the overhead of a general-purpose allocator like `jemalloc` is unacceptable.</p>
                </div>
              </article>

              <div className="lg:col-span-5 lg:order-9">
                <div className="bg-dracula-bg rounded-lg border border-surface-container-highest overflow-hidden h-full">
                  <div className="flex items-center justify-between px-4 py-2 bg-dracula-curr/30 border-b border-surface-container-highest/20">
                    <span className="font-code text-code text-dracula-comment text-xs">root@host:~$ cgroup-v2</span>
                    <span className="material-symbols-outlined text-dracula-comment text-sm">terminal</span>
                  </div>
                  <pre className="p-4 overflow-x-auto"><code className="font-code text-code text-dracula-fg" style={{ fontSize: "13px", lineHeight: "1.7" }}><span className="text-dracula-pink">{`# enable controllers in root`}</span>{"\n"}<span className="text-dracula-cyan">echo</span> <span className="text-dracula-yellow">"+cpu +memory +io"</span> \{"\n"}   &gt; /sys/fs/cgroup/<span className="text-dracula-fg">cgroup.subtree_control</span>{"\n\n"}<span className="text-dracula-pink">{`# carve a slice for the api tier`}</span>{"\n"}<span className="text-dracula-cyan">mkdir</span> /sys/fs/cgroup/<span className="text-dracula-green">api</span>{"\n"}<span className="text-dracula-cyan">echo</span> <span className="text-dracula-purple">512M</span> &gt; api/<span className="text-dracula-fg">memory.high</span>{"\n"}<span className="text-dracula-cyan">echo</span> <span className="text-dracula-purple">$$</span>   &gt; api/<span className="text-dracula-fg">cgroup.procs</span></code></pre>
                </div>
              </div>
              <article className="lg:col-span-7 lg:order-10 bg-surface-container-lowest border border-surface-container-highest rounded-lg p-6 hover:border-primary-container transition-colors duration-200 group cursor-pointer">
                <div className="flex flex-col gap-stack-sm">
                  <time className="font-body-sm text-body-sm text-on-surface-variant">Sep 18, 2023</time>
                  <h3 className="font-h3 text-h3 text-on-surface group-hover:text-primary-container transition-colors">Understanding cgroups v2 resource isolation</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#LINUX</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#CONTAINERS</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed-dim/20 text-primary-container px-2 py-1 rounded-DEFAULT">#CGROUPS</span>
                  </div>
                  <p className="font-body text-body text-on-surface-variant mt-2">Control Groups v2 unified the previously disjointed hierarchy system, simplifying resource management for containers. This article explores configuring CPU, memory, and I/O limits using the unified hierarchy and interacting directly with the cgroupfs.</p>
                </div>
              </article>

            </section>
          </div>

          {/* ===== NEW SECTION A — Recent essays (alt 7/5 rows) ===== */}
          <section aria-label="Recent essays" className="w-full bg-surface-container-low mt-stack-lg">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col gap-stack-lg">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-2 max-w-2xl">
                  <span className="font-code text-code text-primary tracking-[0.2em] uppercase">Detail · 02 — Recent essays</span>
                  <h2 className="font-h1 text-h1 text-on-surface">Long-form writing on production systems, kernels, and the unhappy paths.</h2>
                </div>
                <a className="font-body-sm text-body-sm text-primary-container hover:underline self-start md:self-end" href="#">View archive →</a>
              </div>
              <div className="flex flex-col gap-12 md:gap-16">
                {ESSAY_ROWS.map((row, i) => (
                  <article key={i} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center group cursor-pointer">
                    {row.side === "left" ? (
                      <>
                        <div className="md:col-span-7 overflow-hidden rounded-lg border border-surface-container-highest bg-surface-container-lowest">
                          <img alt={row.alt} className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src={row.img} />
                        </div>
                        <div className="md:col-span-5 flex flex-col gap-stack-sm">
                          <div className="flex items-center gap-3 font-code text-code text-on-surface-variant">
                            <span>{row.read}</span>
                            <span className="text-outline-variant">·</span>
                            <time>{row.date}</time>
                            <span className="text-outline-variant">·</span>
                            <span className="text-primary-container">{row.tag}</span>
                          </div>
                          <h3 className="font-h2 text-h2 text-on-surface group-hover:text-primary-container transition-colors">{row.title}</h3>
                          <p className="font-body text-body text-on-surface-variant">{row.body}</p>
                          <span className="font-label-caps text-label-caps text-primary-container tracking-[0.1em]">Continue reading →</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="md:col-span-5 md:order-1 flex flex-col gap-stack-sm">
                          <div className="flex items-center gap-3 font-code text-code text-on-surface-variant">
                            <span>{row.read}</span>
                            <span className="text-outline-variant">·</span>
                            <time>{row.date}</time>
                            <span className="text-outline-variant">·</span>
                            <span className="text-primary-container">{row.tag}</span>
                          </div>
                          <h3 className="font-h2 text-h2 text-on-surface group-hover:text-primary-container transition-colors">{row.title}</h3>
                          <p className="font-body text-body text-on-surface-variant">{row.body}</p>
                          <span className="font-label-caps text-label-caps text-primary-container tracking-[0.1em]">Continue reading →</span>
                        </div>
                        <div className="md:col-span-7 md:order-2 overflow-hidden rounded-lg border border-surface-container-highest bg-surface-container-lowest">
                          <img alt={row.alt} className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src={row.img} />
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ===== NEW SECTION B — Field notes / Memos (sticky photo + scrolling memos) ===== */}
          <section aria-label="Field notes and memos" className="w-full bg-surface-container">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
              <div className="flex flex-col gap-2 mb-10 md:mb-14 max-w-2xl">
                <span className="font-code text-code text-primary tracking-[0.2em] uppercase">Detail · 03 — Field notes</span>
                <h2 className="font-h1 text-h1 text-on-surface">Short memos. Hot takes. Things that didn't earn a full essay but earned the page.</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                <aside className="md:col-span-5 md:sticky md:top-24 md:self-start">
                  <figure className="relative overflow-hidden rounded-lg border border-surface-container-highest">
                    <img alt="Server room aisle stretching into cool blue indicator lights" className="w-full aspect-[3/4] object-cover grayscale contrast-110" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&q=85&auto=format&fit=crop" />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(53,37,205,0.18) 0%, rgba(53,37,205,0) 35%, rgba(53,37,205,0.32) 100%)" }} />
                    <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <span className="font-label-caps text-label-caps text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] tracking-[0.2em]">FIELD · STILL · 04</span>
                      <span className="font-code text-code text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">52.5°N 13.4°E</span>
                    </figcaption>
                  </figure>
                  <p className="mt-4 font-code text-code text-on-surface-variant">
                    Filed from a long train ride between two datacenters. Not edited. Not benchmarked. Treat them as pencil notes in the margin.
                  </p>
                </aside>
                <div className="md:col-span-7 flex flex-col gap-6">
                  {MEMOS.map((m, i) => (
                    <article key={i} className="bg-surface-container-lowest border border-surface-container-highest rounded-lg p-6 md:p-7 hover:border-primary-container transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-code text-code text-on-surface-variant tracking-[0.1em] uppercase">Memo · {m.no}</span>
                        <time className="font-body-sm text-body-sm text-on-surface-variant">{m.date}</time>
                      </div>
                      <h3 className="font-h3 text-h3 text-on-surface mb-3">{m.title}</h3>
                      <p className="font-body text-body text-on-surface-variant mb-3">{m.p1}</p>
                      <p className="font-body text-body text-on-surface-variant">{m.p2}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ===== NEW SECTION C — Selected work / projects (STATIC 8-tile grid) ===== */}
          <section aria-label="Selected work" className="w-full bg-surface-container-high">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
              <div className="flex flex-col gap-3 mb-10 md:mb-14 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-2 max-w-2xl">
                  <span className="font-code text-code text-primary tracking-[0.2em] uppercase">Detail · 04 — Selected work</span>
                  <h2 className="font-h1 text-h1 text-on-surface">A small, static catalogue of shipped projects.</h2>
                </div>
                <span className="font-code text-code text-on-surface-variant">8 of 41 · sorted by year</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
                {PROJECTS.map((p, i) => (
                  <figure key={i} className="flex flex-col gap-2">
                    <div className="aspect-square overflow-hidden rounded-lg border border-surface-container-highest bg-surface-container-lowest">
                      <img alt={p.alt} className="w-full h-full object-cover grayscale" src={p.img} />
                    </div>
                    <figcaption className="font-code text-code text-on-surface-variant">{p.caption}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-8 font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
                A static catalogue. No carousel, no auto-scroll. Each tile lands at the same place every time you load the page — which, on reflection, is what most of these projects also try to do.
              </p>
            </div>
          </section>

          {/* ===== NEW SECTION D — FAQ accordion ===== */}
          <section aria-label="Frequently asked" className="w-full bg-primary-fixed">
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
              <div className="flex flex-col gap-2 mb-10 md:mb-14 max-w-2xl">
                <span className="font-code text-code text-primary tracking-[0.2em] uppercase">Detail · 05 — FAQ</span>
                <h2 className="font-h1 text-h1 text-on-primary-fixed">Questions a reader has, before the reader is willing to ask.</h2>
              </div>
              <div className="divide-y divide-on-primary-fixed/15 border-t border-b border-on-primary-fixed/15">
                {FAQS.map((f, i) => (
                  <details key={i} className="fsync-faq group py-5">
                    <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                      <h3 className="font-h3 text-h3 text-on-primary-fixed">{f.q}</h3>
                      <span className="material-symbols-outlined fsync-chevron text-on-primary-fixed/70 shrink-0 mt-1">add</span>
                    </summary>
                    <p className="mt-4 font-body text-body text-on-primary-fixed/80 max-w-3xl">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <div className="w-full max-w-container-max-width mx-auto px-gutter">
            <div className="flex justify-center mt-stack-lg">
              <button className="px-6 py-2 bg-surface-container-lowest border border-surface-container-highest text-on-surface font-body-sm text-body-sm rounded hover:bg-surface-container-low transition-colors duration-200">
                Load More Posts
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
