export default function T63CorporateMemphis() {
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];
  const mobileLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  const logos = [
    { slug: "stripe", name: "Stripe" },
    { slug: "notion", name: "Notion" },
    { slug: "figma", name: "Figma" },
    { slug: "linear", name: "Linear" },
    { slug: "shopify", name: "Shopify" },
    { slug: "intercom", name: "Intercom" },
    { slug: "hubspot", name: "HubSpot" },
    { slug: "airtable", name: "Airtable" },
  ];

  const oldWayItems = [
    "Endless spreadsheets and lost emails.",
    "Manually calculating taxes (scary).",
    'Employees asking "Where\'s my paystub?"',
  ];
  const newWayItems = [
    "One dashboard for everything.",
    "Automated tax filings & compliance.",
    "Self-serve portal your team will love.",
  ];

  const features = [
    { icon: "users", bg: "bg-brand-pink", shape: "rounded-2xl", rotate: "rotate-3", iconColor: "text-brand-dark", title: "Team Directory", desc: "Visualize your org chart and manage access levels with a single click. Keep everyone connected." },
    { icon: "coffee", bg: "bg-brand-yellow", shape: "rounded-full", rotate: "-rotate-3", iconColor: "text-brand-dark", title: "Time Off & Perks", desc: "One-click approval for vacations. Manage benefits and perks directly inside the employee profile." },
    { icon: "bar-chart-3", bg: "bg-brand-royal", shape: "rounded-2xl", rotate: "rotate-3", iconColor: "text-white", title: "People Analytics", desc: "Real-time dashboards showing retention, diversity, and growth. Make decisions based on data, not vibes." },
    { icon: "dollar-sign", bg: "bg-brand-green", shape: "rounded-full", rotate: "-rotate-2", iconColor: "text-brand-dark", title: "Global Payroll", desc: "Pay your team in 150+ currencies. We handle the taxes, filings, and headaches automatically." },
    { icon: "zap", bg: "bg-brand-purple", shape: "rounded-2xl", rotate: "rotate-6", iconColor: "text-brand-dark", title: "Instant Onboarding", desc: "Send a magic link and let new hires fill out their own info. Get them set up in minutes, not days." },
  ];

  const reviews = [
    { bg: "bg-brand-pink/30", quote: '"Finally, HR software that doesn\'t look like it was built in 1998. My team actually enjoys logging in."', seed: "Felix", name: "Felix Chen", role: "CEO, TechStart", marginTop: "" },
    { bg: "bg-brand-purple", quote: '"The automated payroll feature saved me 10 hours a week. I can finally focus on hiring."', seed: "Sarah", name: "Sarah Jones", role: "Ops Manager, DesignCo", marginTop: "mt-0 md:mt-8" },
    { bg: "bg-brand-blue", quote: '"Super intuitive. The onboarding flow is magic. New hires are productive on day one."', seed: "Mike", name: "Mike Ross", role: "Founder, LawyerUp", marginTop: "" },
  ];

  const snapshots = [
    { bg: "bg-brand-pink",   rot: "",         dot: "bg-green-500",   seed: "Sarah", who: "Sarah · DesignCo",     activity: "Just paid 14 contractors" },
    { bg: "bg-brand-yellow", rot: "-rotate-1",dot: "bg-brand-royal", seed: "Mike",  who: "Mike · LawyerUp",      activity: "Onboarded a new hire" },
    { bg: "bg-brand-blue",   rot: "",         dot: "bg-brand-yellow",seed: "Felix", who: "Felix · TechStart",    activity: "Approved 8 PTO requests" },
    { bg: "bg-brand-purple", rot: "rotate-1", dot: "bg-brand-pink",  seed: "Aisha", who: "Aisha · BloomLabs",    activity: "Filed quarterly tax" },
    { bg: "bg-brand-green",  rot: "",         dot: "bg-green-500",   seed: "Jonas", who: "Jonas · NorthForge",   activity: "Synced 23 benefits cards" },
    { bg: "bg-brand-pink",   rot: "-rotate-1",dot: "bg-brand-royal", seed: "Maya",  who: "Maya · OrbitDigital",  activity: "Closed Q3 payroll" },
  ];

  const activities = [
    { cardCls: "bg-brand-royal text-white rounded-full",                                 iconBg: "bg-brand-yellow rounded-full", iconClr: "text-brand-dark", icon: "dollar-sign",     rot: "",         hover: "hover:scale-105", title: "$2.4M paid",       sub: "in the last 24 hrs",      subCls: "opacity-80" },
    { cardCls: "bg-white rounded-3xl rounded-bl-none",                                   iconBg: "bg-brand-pink rounded-2xl",    iconClr: "text-brand-dark", icon: "users",           rot: "rotate-1", hover: "hover:rotate-0",  title: "812 new hires",    sub: "onboarded this week",     subCls: "text-slate-600" },
    { cardCls: "bg-brand-yellow rounded-full",                                           iconBg: "bg-brand-dark rounded-full",    iconClr: "text-brand-yellow", icon: "zap",            rot: "",         hover: "hover:scale-105", title: "7-min average",    sub: "setup time",              subCls: "text-slate-700" },
    { cardCls: "bg-white rounded-3xl rounded-tr-none",                                   iconBg: "bg-brand-green rounded-2xl",   iconClr: "text-brand-dark", icon: "check-circle-2",  rot: "-rotate-1",hover: "hover:rotate-0",  title: "99.97% uptime",    sub: "last 90 days",            subCls: "text-slate-600" },
    { cardCls: "bg-brand-pink rounded-full",                                             iconBg: "bg-brand-royal rounded-full",  iconClr: "text-white",      icon: "globe",           rot: "",         hover: "hover:scale-105", title: "150+ countries",   sub: "payroll runs nightly",    subCls: "text-slate-700" },
    { cardCls: "bg-white rounded-3xl rounded-bl-none",                                   iconBg: "bg-brand-purple rounded-2xl",  iconClr: "text-brand-dark", icon: "party-popper",    rot: "rotate-1", hover: "hover:rotate-0",  title: "42 birthdays",     sub: "celebrated today",        subCls: "text-slate-600" },
  ];

  const integrations = [
    { bg: "bg-brand-pink/40",   bgHover: "hover:bg-brand-pink",   rot: "rotate-3",  icon: "message-circle",  name: "Slack",            sub: "Pings on hire, PTO, payroll runs." },
    { bg: "bg-brand-yellow/40", bgHover: "hover:bg-brand-yellow", rot: "-rotate-3", icon: "book-open",    name: "Notion",           sub: "Sync employee handbooks live." },
    { bg: "bg-brand-green/50",  bgHover: "hover:bg-brand-green",  rot: "rotate-2",  icon: "calendar",        name: "Google Workspace", sub: "SSO, calendar, docs sync." },
    { bg: "bg-brand-purple/40", bgHover: "hover:bg-brand-purple", rot: "-rotate-3", icon: "briefcase",       name: "QuickBooks",       sub: "Accounting in one tap." },
    { bg: "bg-brand-blue/50",   bgHover: "hover:bg-brand-blue",   rot: "rotate-3",  icon: "folder-git-2",    name: "GitHub",           sub: "Provision dev access auto." },
    { bg: "bg-brand-pink/40",   bgHover: "hover:bg-brand-pink",   rot: "-rotate-2", icon: "credit-card",     name: "Stripe",           sub: "Contractor payouts globally." },
    { bg: "bg-brand-yellow/40", bgHover: "hover:bg-brand-yellow", rot: "rotate-2",  icon: "video",           name: "Zoom",             sub: "Auto-schedule onboarding." },
    { bg: "bg-brand-green/50",  bgHover: "hover:bg-brand-green",  rot: "-rotate-3", icon: "cloud",           name: "+ 60 more",        sub: "View the full directory →" },
  ];

  const starterPerks = ["Up to 10 employees", "Basic Payroll", "Time off tracking"];
  const growthPerks = ["Unlimited employees", "Automated Payroll Tax", "Benefits Management", "Advanced Reporting"];
  const enterprisePerks = ["Dedicated Account Manager", "SSO & Advanced Security", "Custom API Access"];

  const faqs = [
    { bg: "bg-brand-pink/20", q: "How long is the free trial?", a: "You get 14 days of full access to the Growth plan. No credit card required to start. We want you to love it before you pay." },
    { bg: "bg-brand-blue/20", q: "Is my data secure?", a: "Absolutely. We use bank-level 256-bit encryption and are SOC2 compliant. Your data privacy is our top priority." },
    { bg: "bg-brand-yellow/20", q: "Can I migrate data from other platforms?", a: "Yes! We offer one-click imports from major providers like Gusto, ADP, and BambooHR. Our support team can also help you with custom migrations." },
  ];

  const footerCols = [
    { title: "Product", links: [{ label: "Features" }, { label: "Pricing" }, { label: "Integrations" }, { label: "Changelog" }] },
    { title: "Company", links: [{ label: "About Us" }, { label: "Careers", badge: "Hiring" }, { label: "Legal" }, { label: "Contact" }] },
  ];

  const socials = ["twitter", "linkedin", "instagram"];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    colors: {
      brand: {
        pink: '#FCE7F3', blue: '#E0F2FE', green: '#DCFCE7', purple: '#F3E8FF',
        royal: '#2563EB', yellow: '#FBBF24', dark: '#1E293B',
        skin: '#FCA5A5', white: '#FFFFFF',
      }
    },
    fontFamily: {
      heading: ['Fredoka','sans-serif'],
      body: ['Work Sans','sans-serif'],
    },
    boxShadow: {
      'hard': '4px 4px 0px 0px #1E293B',
      'hard-sm': '2px 2px 0px 0px #1E293B',
      'hard-xl': '8px 8px 0px 0px #1E293B',
      'hard-white': '4px 4px 0px 0px #FFFFFF',
    },
    borderRadius: { '4xl': '2.5rem' }
  } }
};`;

  const customCss = `html { scroll-behavior: smooth; }
.border-hard { border: 2px solid #1E293B; }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
details > summary { list-style: none; }
details > summary::-webkit-details-marker { display: none; }
details[open] summary ~ * { animation: sweep .3s ease-in-out; }
@keyframes sweep {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
html, body { overflow-x: clip; }
.marquee-track { display: flex; gap: 24px; width: max-content; }
@keyframes marquee-left  { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
@keyframes marquee-right { 0% { transform: translateX(calc(-50% - 12px)); } 100% { transform: translateX(0); } }
.marquee-left  { animation: marquee-left 60s linear infinite; }
.marquee-right { animation: marquee-right 70s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }`;

  const initScript = `(function init(){
  if (typeof lucide === 'undefined' || !lucide.createIcons) { setTimeout(init, 50); return; }
  lucide.createIcons();
  var btn = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function(){ menu.classList.toggle('hidden'); });
  }
})();`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      <div className="font-body text-brand-dark bg-white antialiased overflow-x-hidden">
        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b-2 border-brand-dark transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <a href="#" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-brand-royal rounded-full flex items-center justify-center border-2 border-brand-dark group-hover:rotate-12 transition-transform">
                  <div className="w-4 h-4 bg-brand-yellow rounded-full border border-brand-dark"></div>
                </div>
                <span className="font-heading text-2xl font-semibold tracking-wide text-brand-dark">TeamFlow</span>
              </a>

              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} className="font-medium text-slate-600 hover:text-brand-royal transition-colors">{l.label}</a>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-4">
                <a href="#" className="font-heading font-medium hover:underline">Log in</a>
                <a href="#" className="bg-brand-yellow text-brand-dark font-heading px-6 py-2.5 rounded-full border-2 border-brand-dark shadow-hard hover:translate-y-0.5 hover:shadow-hard-sm transition-all active:translate-y-1 active:shadow-none">Start Free Trial</a>
              </div>

              <div className="md:hidden">
                <button id="mobile-menu-btn" className="p-2 text-brand-dark focus:outline-none">
                  <i data-lucide="menu" className="w-8 h-8"></i>
                </button>
              </div>
            </div>
          </div>

          <div id="mobile-menu" className="hidden md:hidden border-t-2 border-brand-dark bg-brand-pink p-4 absolute w-full left-0 top-20 shadow-xl">
            <div className="flex flex-col space-y-4">
              {mobileLinks.map(l => (
                <a key={l.href} href={l.href} className="font-heading text-lg font-medium block px-3 py-2 rounded-md hover:bg-white/50">{l.label}</a>
              ))}
              <div className="h-px bg-brand-dark/10 my-2"></div>
              <a href="#" className="font-heading text-lg font-medium block px-3 py-2">Log in</a>
              <a href="#" className="bg-brand-royal text-white text-center font-heading block px-3 py-3 rounded-xl border-2 border-brand-dark shadow-hard">Get Started</a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-brand-pink relative overflow-hidden">
          <div className="absolute top-24 left-[-50px] w-40 h-40 bg-brand-yellow rounded-full border-2 border-brand-dark opacity-40 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-royal rounded-tl-full opacity-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white border-2 border-brand-dark rounded-full shadow-hard-sm transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-heading font-medium text-sm text-brand-dark">v2.0 is now live</span>
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-[1.1] font-bold mb-6 text-brand-dark">
                HR that doesn't <br />
                <span className="text-brand-royal relative">
                  feel like HR.
                  <svg className="absolute w-full h-4 -bottom-2 left-0 text-brand-yellow z-[-1]" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-700 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                Stop drowning in spreadsheets. TeamFlow automates payroll, benefits, and hiring so you can get back to building a great culture.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#" className="bg-brand-royal text-white font-heading text-lg px-8 py-4 rounded-full border-2 border-brand-dark shadow-hard hover:-translate-y-1 hover:bg-blue-600 transition-all">Start 14-Day Free Trial</a>
                <a href="#" className="bg-white text-brand-dark font-heading text-lg px-8 py-4 rounded-full border-2 border-brand-dark shadow-hard hover:-translate-y-1 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <i data-lucide="play-circle" className="w-5 h-5"></i> Demo
                </a>
              </div>

              <p className="mt-6 text-sm text-slate-500 font-medium">
                <i data-lucide="check" className="w-4 h-4 inline text-green-600 mr-1"></i> No credit card required
              </p>
            </div>

            <div className="relative h-[400px] sm:h-[500px] w-full flex items-center justify-center order-1 lg:order-2">
              <div className="relative w-full h-full max-w-md">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-white border-2 border-brand-dark rounded-full shadow-hard-xl"></div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-10">
                  <div className="w-24 h-28 bg-brand-skin border-2 border-brand-dark rounded-[40px] relative z-20 mx-auto rotate-[-3deg]">
                    <div className="absolute -top-4 -left-2 w-28 h-12 bg-brand-dark rounded-full"></div>
                    <div className="absolute bottom-6 left-8 w-8 h-4 border-b-4 border-brand-dark rounded-b-full"></div>
                  </div>

                  <div className="relative -mt-4 z-10">
                    <div className="w-40 h-40 bg-brand-yellow border-2 border-brand-dark rounded-t-[60px] rounded-b-[20px] mx-auto relative">
                      <div className="absolute top-10 right-8 w-4 h-8 bg-brand-royal rounded-full border border-brand-dark"></div>
                    </div>
                    <div className="absolute top-10 -left-10 w-16 h-32 border-l-2 border-b-2 border-brand-dark rounded-bl-[40px] border-t-0 border-r-0 transform rotate-12"></div>
                    <div className="absolute top-8 -right-8 w-16 h-20 border-r-2 border-b-2 border-brand-dark rounded-br-[40px] border-t-0 border-l-0 transform -rotate-12 bg-brand-skin rounded-full flex items-center justify-center">
                      <div className="w-full h-full bg-brand-yellow rounded-full -z-10 absolute"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-10 right-0 sm:-right-4 bg-white p-4 rounded-xl border-2 border-brand-dark shadow-hard w-40 z-30 animate-float">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400">Payroll</span>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div className="bg-brand-royal h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-xs font-heading font-bold">Processing...</span>
                </div>

                <div className="absolute bottom-10 left-0 sm:-left-4 bg-brand-royal p-4 rounded-xl border-2 border-brand-dark shadow-hard w-44 z-30 animate-float-delayed text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <i data-lucide="party-popper" className="w-4 h-4 text-white"></i>
                    </div>
                    <div>
                      <div className="text-xs opacity-80">New Hire</div>
                      <div className="text-sm font-bold">Sarah joined!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-12 border-b-2 border-brand-dark/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-heading text-slate-400 text-sm font-semibold tracking-widest uppercase mb-10">Trusted by 2,000+ forward-thinking teams</p>
            <ul role="list" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-8 items-center justify-items-center">
              {logos.map(l => (
                <li key={l.slug} className="flex flex-col items-center gap-2 group">
                  <img src={`https://cdn.simpleicons.org/${l.slug}`} alt={l.name} className="h-9 w-auto" loading="lazy" decoding="async" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-heading">{l.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Problem vs Solution */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-red-50 p-8 rounded-3xl border-2 border-red-200 relative overflow-hidden group hover:border-red-400 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <i data-lucide="frown" className="w-32 h-32 text-red-500"></i>
                </div>
                <div className="relative z-10">
                  <h3 className="font-heading text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <i data-lucide="x-circle" className="text-red-500"></i> The Old Way
                  </h3>
                  <ul className="space-y-4">
                    {oldWayItems.map(item => (
                      <li key={item} className="flex items-start gap-3 text-red-800/80">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2.5"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-brand-green p-8 rounded-3xl border-2 border-brand-dark shadow-hard relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <i data-lucide="smile" className="w-32 h-32 text-green-600"></i>
                </div>
                <div className="relative z-10">
                  <h3 className="font-heading text-2xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                    <i data-lucide="check-circle-2" className="text-green-600"></i> The TeamFlow Way
                  </h3>
                  <ul className="space-y-4">
                    {newWayItems.map(item => (
                      <li key={item} className="flex items-start gap-3 text-brand-dark font-medium">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-green-500 shrink-0">
                          <i data-lucide="check" className="w-3 h-3 text-green-600"></i>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-brand-blue relative border-t-2 border-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="bg-white border-2 border-brand-dark px-4 py-1 rounded-full font-heading font-semibold text-brand-royal text-sm uppercase tracking-wide shadow-hard-sm">Features</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mt-6 mb-6 text-brand-dark">Everything you need to grow</h2>
              <p className="text-xl text-slate-600">We handled the boring compliance stuff so you can focus on the fun stuff. Manage your team like a pro.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map(f => (
                <div key={f.title} className="bg-white p-8 rounded-[2rem] border-2 border-brand-dark shadow-hard hover:-translate-y-2 transition-transform duration-300">
                  <div className={`w-16 h-16 ${f.bg} ${f.shape} flex items-center justify-center mb-6 border-2 border-brand-dark ${f.rotate}`}>
                    <i data-lucide={f.icon} className={`${f.iconColor} w-8 h-8`}></i>
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}

              <div className="bg-white p-8 rounded-[2rem] border-2 border-brand-dark shadow-hard hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center items-center text-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=')]">
                <h3 className="font-heading text-2xl font-bold mb-4">And so much more...</h3>
                <a href="#" className="text-brand-royal font-bold text-lg hover:underline flex items-center gap-2">
                  View all features <i data-lucide="arrow-right" className="w-5 h-5"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-4xl font-bold text-center mb-16">People love TeamFlow</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map(r => (
                <div key={r.name} className={`${r.bg} p-8 rounded-[2rem] rounded-bl-none border-2 border-brand-dark relative ${r.marginTop}`}>
                  <div className="flex gap-1 text-brand-yellow mb-4">
                    {[0, 1, 2, 3, 4].map(i => <i key={i} data-lucide="star" className="w-5 h-5 fill-current"></i>)}
                  </div>
                  <p className="text-lg font-medium mb-6">{r.quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full border-2 border-brand-dark overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.seed}`} alt="User" />
                    </div>
                    <div>
                      <div className="font-bold font-heading">{r.name}</div>
                      <div className="text-sm text-slate-500">{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Snapshots — doubled marquee */}
        <section className="py-24 bg-brand-green/30 border-t-2 border-brand-dark relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
            <span className="bg-white border-2 border-brand-dark px-4 py-1 rounded-full font-heading font-semibold text-brand-royal text-sm uppercase tracking-wide shadow-hard-sm">Workflow Snapshots</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-6 mb-4 text-brand-dark">A live look at the floor.</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">2,000+ teams running TeamFlow today. Hover the strips to pause.</p>
          </div>

          <div className="overflow-hidden py-3 mb-6">
            <div className="marquee-track marquee-left">
              {[...snapshots, ...snapshots].map((s, i) => (
                <div key={i} className={`${s.bg} p-5 rounded-3xl border-2 border-brand-dark shadow-hard w-72 flex items-center gap-4 shrink-0 ${s.rot} hover:rotate-0 transition-transform`} aria-hidden={i >= snapshots.length}>
                  <div className="w-14 h-14 bg-white rounded-full border-2 border-brand-dark overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.seed}`} alt={`${s.who} avatar`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-base truncate">{s.who}</p>
                    <p className="text-xs text-slate-700"><span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot} mr-1`}></span>{s.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden py-3">
            <div className="marquee-track marquee-right">
              {[...activities, ...activities].map((a, i) => (
                <div key={i} className={`${a.cardCls} p-5 border-2 border-brand-dark shadow-hard w-64 flex items-center gap-4 shrink-0 ${a.rot} ${a.hover} transition-transform`} aria-hidden={i >= activities.length}>
                  <div className={`w-12 h-12 ${a.iconBg} flex items-center justify-center border-2 border-brand-dark shrink-0`}>
                    <i data-lucide={a.icon} className={`w-6 h-6 ${a.iconClr}`}></i>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm leading-tight">{a.title}</p>
                    <p className={`text-xs ${a.subCls}`}>{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plays nice with — integrations grid */}
        <section className="py-24 bg-white border-t-2 border-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="bg-brand-blue border-2 border-brand-dark px-4 py-1 rounded-full font-heading font-semibold text-brand-dark text-sm uppercase tracking-wide shadow-hard-sm">Integrations</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mt-6 mb-4 text-brand-dark">Plays nice with the rest of your stack.</h2>
              <p className="text-lg text-slate-600">One-click connectors. No webhook YAML, no Zapier glue. Just toggle and go.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {integrations.map(i => (
                <a key={i.name} href="#" className={`${i.bg} p-6 rounded-3xl border-2 border-brand-dark shadow-hard hover:-translate-y-1 ${i.bgHover} transition-all flex flex-col items-start gap-3 group`}>
                  <div className={`w-12 h-12 bg-white rounded-2xl border-2 border-brand-dark flex items-center justify-center ${i.rot} group-hover:rotate-0 transition-transform`}>
                    <i data-lucide={i.icon} className="w-6 h-6 text-brand-dark"></i>
                  </div>
                  <p className="font-heading font-bold text-lg">{i.name}</p>
                  <p className="text-xs text-slate-600">{i.sub}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Big-image showcase A — image LEFT / content RIGHT — fast-moving teams */}
        <section className="py-24 bg-brand-pink/40 border-t-2 border-brand-dark relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-yellow rounded-full border-2 border-brand-dark opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center relative z-10">
            <div className="md:col-span-7 relative">
              <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-3xl bg-brand-yellow border-2 border-brand-dark -z-10"></div>
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&q=80&auto=format&fit=crop" alt="Cross-functional team huddle around laptops in a sunlit office" className="w-full aspect-[4/3] object-cover rounded-3xl border-2 border-brand-dark shadow-[8px_8px_0_0_#1E293B]" loading="lazy" decoding="async" />
            </div>
            <div className="md:col-span-5 flex flex-col gap-5 justify-center">
              <span className="self-start bg-white border-2 border-brand-dark px-4 py-1 rounded-full font-heading font-semibold text-brand-royal text-xs uppercase tracking-wide shadow-hard-sm">Built for momentum</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark leading-[1.05]">Built for fast-moving teams.</h2>
              <p className="text-lg text-slate-700 font-medium">Skip the meetings about meetings. TeamFlow keeps every hire, paystub, and PTO request moving — so people can get back to building.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-brand-yellow rounded-full border-2 border-brand-dark flex items-center justify-center shrink-0 mt-0.5"><i data-lucide="check" className="w-4 h-4 text-brand-dark"></i></div>
                  <span className="text-brand-dark font-medium">Zero-friction onboarding — magic-link invites, signed in 90 seconds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-brand-pink rounded-full border-2 border-brand-dark flex items-center justify-center shrink-0 mt-0.5"><i data-lucide="check" className="w-4 h-4 text-brand-dark"></i></div>
                  <span className="text-brand-dark font-medium">Approvals in Slack — your manager taps once, payroll picks it up.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-brand-blue rounded-full border-2 border-brand-dark flex items-center justify-center shrink-0 mt-0.5"><i data-lucide="check" className="w-4 h-4 text-brand-dark"></i></div>
                  <span className="text-brand-dark font-medium">Org chart that updates itself — no manual edits, ever.</span>
                </li>
              </ul>
              <a href="#" className="self-start mt-2 bg-brand-royal text-white font-heading text-base px-7 py-3 rounded-full border-2 border-brand-dark shadow-hard hover:-translate-y-1 transition-all">See the workflow</a>
            </div>
          </div>
        </section>

        {/* Big-image showcase B — image RIGHT / content LEFT — CSAT climbing (double-image stack) */}
        <section className="py-24 bg-white border-t-2 border-brand-dark relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-purple rounded-full border-2 border-brand-dark opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center relative z-10">
            <div className="md:col-span-5 flex flex-col gap-5 justify-center md:order-1 order-2">
              <span className="self-start bg-brand-green border-2 border-brand-dark px-4 py-1 rounded-full font-heading font-semibold text-brand-dark text-xs uppercase tracking-wide shadow-hard-sm">Results, not vibes</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark leading-[1.05]">Watch your CSAT climb.</h2>
              <p className="text-lg text-slate-700 font-medium">Teams on TeamFlow report higher employee NPS within the first quarter. Less paperwork, more feedback loops, real numbers you can show your board.</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-brand-yellow border-2 border-brand-dark rounded-2xl p-5 shadow-hard-sm">
                  <div className="font-heading text-3xl font-bold text-brand-dark">+38%</div>
                  <div className="text-xs text-slate-700 font-medium mt-1">Employee NPS · 90 days</div>
                </div>
                <div className="bg-brand-blue border-2 border-brand-dark rounded-2xl p-5 shadow-hard-sm">
                  <div className="font-heading text-3xl font-bold text-brand-dark">12 hrs</div>
                  <div className="text-xs text-slate-700 font-medium mt-1">Saved per ops manager / week</div>
                </div>
              </div>
              <blockquote className="bg-brand-pink/40 border-2 border-brand-dark rounded-2xl p-5 mt-2 relative">
                <p className="text-sm text-brand-dark font-medium italic">"Switching to TeamFlow was the cheapest culture upgrade we ever bought."</p>
                <cite className="block text-xs text-slate-600 mt-2 not-italic font-bold">— Priya R., People Lead at Loom Studios</cite>
              </blockquote>
            </div>
            <div className="md:col-span-7 md:order-2 order-1 grid grid-cols-2 gap-4 relative">
              <div className="relative -rotate-2">
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-brand-royal border-2 border-brand-dark -z-10"></div>
                <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=80&auto=format&fit=crop" alt="Engineering team reviewing pull requests around a monitor" className="w-full aspect-[3/4] object-cover rounded-3xl border-2 border-brand-dark shadow-[6px_6px_0_0_#1E293B]" loading="lazy" decoding="async" />
              </div>
              <div className="relative rotate-2 mt-10">
                <div className="absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl bg-brand-pink border-2 border-brand-dark -z-10"></div>
                <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80&auto=format&fit=crop" alt="Sticky notes wall during a sprint planning session" className="w-full aspect-[3/4] object-cover rounded-3xl border-2 border-brand-dark shadow-[6px_6px_0_0_#1E293B]" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* Big-image showcase C — image LEFT / content RIGHT — day one to scale (timeline) */}
        <section className="py-24 bg-brand-blue/40 border-t-2 border-brand-dark relative overflow-hidden">
          <div className="absolute top-12 right-12 w-24 h-24 bg-brand-yellow rounded-full border-2 border-brand-dark"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-brand-pink border-2 border-brand-dark rotate-45"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center relative z-10">
            <div className="md:col-span-7 relative">
              <div className="absolute inset-0 -translate-x-5 -translate-y-4 rounded-3xl bg-brand-royal border-2 border-brand-dark -z-10"></div>
              <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1400&q=80&auto=format&fit=crop" alt="Designer mapping wireframes on a tablet at a sunlit desk" className="w-full aspect-[16/10] object-cover rounded-3xl border-2 border-brand-dark shadow-[8px_8px_0_0_#1E293B]" loading="lazy" decoding="async" />
            </div>
            <div className="md:col-span-5 flex flex-col gap-5 justify-center">
              <span className="self-start bg-brand-yellow border-2 border-brand-dark px-4 py-1 rounded-full font-heading font-semibold text-brand-dark text-xs uppercase tracking-wide shadow-hard-sm">Day one to scale</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark leading-[1.05]">From day one to scale.</h2>
              <p className="text-lg text-slate-700 font-medium">Whether you're hire #2 or #2,000, the same TeamFlow account grows with you. No replatforms, no painful migrations, no spreadsheets to revisit.</p>
              <ol className="space-y-4 mt-2">
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-brand-pink border-2 border-brand-dark rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-brand-dark shadow-hard-sm">1</div>
                  <div>
                    <p className="font-heading font-bold text-brand-dark">Sign up &amp; invite</p>
                    <p className="text-sm text-slate-700">Connect payroll in under 7 minutes. No data migration headaches.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-brand-yellow border-2 border-brand-dark rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-brand-dark shadow-hard-sm">2</div>
                  <div>
                    <p className="font-heading font-bold text-brand-dark">Automate the boring</p>
                    <p className="text-sm text-slate-700">Payroll, taxes, benefits, compliance — all on auto-pilot.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-brand-green border-2 border-brand-dark rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-brand-dark shadow-hard-sm">3</div>
                  <div>
                    <p className="font-heading font-bold text-brand-dark">Scale without breaking</p>
                    <p className="text-sm text-slate-700">Add 10 or 1,000 hires — the platform doesn't blink.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-brand-yellow/10 border-t-2 border-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-xl text-slate-600">Start for free, scale as you grow.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="bg-white p-8 rounded-3xl border-2 border-brand-dark shadow-hard relative">
                <h3 className="font-heading text-2xl font-bold mb-2">Starter</h3>
                <p className="text-slate-500 mb-6 h-12">Perfect for small teams just getting started.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-heading">$0</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <a href="#" className="block w-full text-center py-3 rounded-xl border-2 border-brand-dark font-bold hover:bg-slate-50 transition-colors">Get Started</a>
                <ul className="mt-8 space-y-4">
                  {starterPerks.map(p => (
                    <li key={p} className="flex items-center gap-3"><i data-lucide="check" className="w-5 h-5 text-green-500"></i> {p}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-royal p-8 rounded-3xl border-2 border-brand-dark shadow-hard-xl relative transform lg:-translate-y-4 text-white">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-yellow text-brand-dark px-4 py-1 rounded-full text-sm font-bold border-2 border-brand-dark">Most Popular</div>
                <h3 className="font-heading text-2xl font-bold mb-2">Growth</h3>
                <p className="text-blue-100 mb-6 h-12">Everything you need to scale your operations.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-heading">$29</span>
                  <span className="text-blue-200">/mo/user</span>
                </div>
                <a href="#" className="block w-full text-center py-3 rounded-xl bg-brand-yellow text-brand-dark border-2 border-brand-dark font-bold hover:brightness-110 transition-all shadow-hard-sm">Start Free Trial</a>
                <ul className="mt-8 space-y-4">
                  {growthPerks.map(p => (
                    <li key={p} className="flex items-center gap-3"><i data-lucide="check" className="w-5 h-5 text-brand-yellow"></i> {p}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl border-2 border-brand-dark shadow-hard relative">
                <h3 className="font-heading text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-slate-500 mb-6 h-12">Custom solutions for large organizations.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-heading">Custom</span>
                </div>
                <a href="#" className="block w-full text-center py-3 rounded-xl border-2 border-brand-dark font-bold hover:bg-slate-50 transition-colors">Contact Sales</a>
                <ul className="mt-8 space-y-4">
                  {enterprisePerks.map(p => (
                    <li key={p} className="flex items-center gap-3"><i data-lucide="check" className="w-5 h-5 text-green-500"></i> {p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {faqs.map(f => (
                <details key={f.q} className={`group ${f.bg} rounded-2xl border-2 border-transparent open:border-brand-dark open:shadow-hard transition-all duration-300`}>
                  <summary className="flex justify-between items-center font-bold font-heading cursor-pointer p-6 list-none text-lg">
                    <span>{f.q}</span>
                    <span className="transition group-open:rotate-180">
                      <i data-lucide="chevron-down"></i>
                    </span>
                  </summary>
                  <div className="text-slate-600 px-6 pb-6 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="bg-brand-royal rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-hard border-2 border-brand-dark">
              <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-brand-yellow rounded-br-full opacity-100 border-r-2 border-b-2 border-brand-dark"></div>
              <div className="absolute bottom-[-40px] right-10 w-32 h-32 md:w-48 md:h-48 bg-brand-pink rounded-full border-2 border-brand-dark"></div>

              <div className="relative z-10">
                <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">Ready to find your flow?</h2>
                <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-xl mx-auto">Join 2,000+ companies creating better workplaces today.</p>

                <button className="bg-brand-yellow text-brand-dark font-heading font-bold text-xl px-12 py-5 rounded-full border-2 border-brand-dark shadow-hard-white hover:translate-y-1 hover:shadow-none transition-all w-full md:w-auto">Get Started for Free</button>
                <p className="mt-4 text-blue-200 text-sm">No credit card required. Cancel anytime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-brand-dark text-white pt-20 pb-10 border-t-2 border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-brand-royal rounded-full flex items-center justify-center border border-white/20">
                    <div className="w-3 h-3 bg-brand-yellow rounded-full"></div>
                  </div>
                  <span className="font-heading text-2xl font-semibold">TeamFlow</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  The HR platform designed for humans, not robots. Built with ❤️ for teams everywhere.
                </p>
              </div>

              {footerCols.map(col => (
                <div key={col.title}>
                  <h4 className="font-heading font-bold text-brand-pink mb-6 uppercase tracking-wider text-sm">{col.title}</h4>
                  <ul className="space-y-3 text-slate-300">
                    {col.links.map(l => (
                      <li key={l.label}>
                        <a href="#" className="hover:text-brand-yellow transition-colors">{l.label}</a>
                        {l.badge && <span className="text-xs bg-brand-royal px-2 py-0.5 rounded-full ml-1">{l.badge}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h4 className="font-heading font-bold text-brand-pink mb-6 uppercase tracking-wider text-sm">Social</h4>
                <div className="flex gap-4">
                  {socials.map(s => (
                    <a key={s} href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-royal transition-colors">
                      <i data-lucide={s} className="w-5 h-5"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
              <p>© 2024 TeamFlow Inc. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
