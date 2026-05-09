export default function T51Glassmorphism() {
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  const stats = [
    { value: "2.5M+", label: "Active Users" },
    { value: "$12B", label: "Processed Volume" },
    { value: "180+", label: "Countries Supported" },
    { value: "0.01s", label: "Transaction Time" },
  ];

  const features = [
    { icon: "zap", iconColor: "text-teal-300", bg: "bg-teal-500/20", border: "border-teal-500/30", title: "Instant Transfers", desc: "Send money globally in seconds. Our proprietary mesh network cuts out the middlemen and the wait times." },
    { icon: "shield-check", iconColor: "text-blue-300", bg: "bg-blue-500/20", border: "border-blue-500/30", title: "Bank-Grade Security", desc: "Your data is encrypted with AES-256. Biometric authentication ensures only you can access your funds." },
    { icon: "pie-chart", iconColor: "text-purple-300", bg: "bg-purple-500/20", border: "border-purple-500/30", title: "Smart Insights", desc: "Visual spending breakdowns help you budget better. See exactly where your money goes every month." },
    { icon: "wallet", iconColor: "text-pink-300", bg: "bg-pink-500/20", border: "border-pink-500/30", title: "Multi-Currency Vaults", desc: "Hold and exchange 30+ currencies with real-time interbank exchange rates and zero markup." },
  ];

  const steps = [
    { n: 1, active: true, title: "Download the App", desc: "Available on iOS and Android. Get started with just your phone number." },
    { n: 2, active: false, title: "Verify Identity", desc: "Secure biometric verification takes less than 2 minutes." },
    { n: 3, active: false, title: "Start Spending", desc: "Get your virtual card instantly. Your physical glass card ships in 3 days." },
  ];

  const testimonials = [
    { quote: "I've never seen a banking app this beautiful and fast. The glass card always gets compliments when I pay.", name: "Sarah Jenkins", role: "Freelance Designer", avatar: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=160&q=80&auto=format&fit=crop" },
    { quote: "The transparency is real. I finally understand my fee structure and the international rates are unbeatable.", name: "Michael Chen", role: "Digital Nomad", avatar: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=160&q=80&auto=format&fit=crop" },
    { quote: "ClearBank has completely replaced my traditional bank. The analytics tools saved me so much money last year.", name: "Elena Rodriguez", role: "Small Business Owner", avatar: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=160&q=80&auto=format&fit=crop" },
  ];

  const cities = [
    { id: "1542051841857-5f90071e7989", flag: "🇯🇵", city: "Tokyo",     status: "Open",   pair: "USD / JPY", rate: "154.32", delta: "▲ 0.21%", trend: "up" },
    { id: "1486299267070-83823f5448dd", flag: "🇬🇧", city: "London",    status: "Open",   pair: "USD / GBP", rate: "0.7892", delta: "▼ 0.08%", trend: "down" },
    { id: "1499856871958-5b9627545d1a", flag: "🇪🇺", city: "Frankfurt", status: "Open",   pair: "USD / EUR", rate: "0.9214", delta: "▲ 0.14%", trend: "up" },
    { id: "1496442226666-8d4d0e62e6e9", flag: "🇺🇸", city: "NYC",       status: "Open",   pair: "USD · BASE", rate: "1.0000", delta: "— FLAT",  trend: "flat" },
    { id: "1525625293386-3f8f99389edd", flag: "🇸🇬", city: "Singapore", status: "Open",   pair: "USD / SGD", rate: "1.3521", delta: "▲ 0.32%", trend: "up" },
    { id: "1506973035872-a4ec16b8e8d9", flag: "🇦🇺", city: "Sydney",    status: "Closed", pair: "USD / AUD", rate: "1.5189", delta: "▼ 0.18%", trend: "down" },
    { id: "1517090504586-fde19ea6066f", flag: "🇨🇦", city: "Toronto",   status: "Open",   pair: "USD / CAD", rate: "1.3712", delta: "▲ 0.05%", trend: "up" },
  ];

  const faqs = [
    { q: "Are deposits insured?",                     a: "Yes. Up to $250,000 per depositor in the US (FDIC, via our partner bank), £85,000 in the UK (FSCS), and €100,000 in the EU (national schemes). Coverage details are in the in-app legal pack." },
    { q: "What happens if I lose my card?",           a: "Freeze it from the app in under a second. Order a replacement (free, twice a year on Plus and above). Your virtual card stays active throughout — most users don't notice the gap." },
    { q: "Do you sell my data?",                      a: "No. Not to advertisers, not to data brokers, not to \"trusted partners\". Our income is the subscription fees, the interchange fees, and the spread we don't charge on FX. That's the deal; we like it that way." },
    { q: "Where is my money kept?",                   a: "Held in segregated accounts at our partner banks (the named bank changes by jurisdiction; the in-app legal pack tells you which). Not lent out. Not pooled with company funds. We bear the cost; you keep the safety." },
    { q: "How do I cancel?",                          a: "Settings → Account → Close account. Two taps and a sixty-second confirmation. Outstanding balance returned to a linked bank account within one business day. We will not chase you to stay." },
  ];

  const productLinks = ["Features", "Pricing", "Credit Card", "Invest"];
  const companyLinks = ["About", "Careers", "Blog", "Contact"];
  const legalLinks = ["Privacy Policy", "Terms of Use", "Cookie Policy"];
  const socials = ["twitter", "linkedin", "instagram"];

  const trustedLogos = [
    { slug: "stripe",          name: "Stripe",          caption: "Payments" },
    { slug: "mastercard",      name: "Mastercard",      caption: "Network" },
    { slug: "visa",            name: "Visa",            caption: "Network" },
    { slug: "americanexpress", name: "American Express", caption: "Network" },
    { slug: "monzo",           name: "Monzo",           caption: "UK · Bank" },
    { slug: "wise",            name: "Wise",            caption: "FX Rails" },
    { slug: "revolut",         name: "Revolut",         caption: "EU · Bank" },
    { slug: "n26",             name: "N26",             caption: "EU · Bank" },
    { slug: "coinbase",        name: "Coinbase",        caption: "Crypto Rail" },
    { slug: "barclays",        name: "Barclays",        caption: "UK · Custody" },
    { slug: "hsbc",            name: "HSBC",            caption: "APAC · Custody" },
    { slug: "goldmansachs",    name: "Goldman Sachs",   caption: "US · Custody" },
  ];

  // 28 LED dots (varying opacity) for "Regions live" small card
  const ledOpacities = [0.9, 0.7, 1, 0.6, 0.9, 0.8, 1, 0.7, 0.9, 0.6, 0.8, 1, 0.7, 0.9, 1, 0.8, 0.6, 0.9, 1, 0.7, 0.8, 0.9, 0.6, 1, 0.8, 0.9, 0.7, 1];

  const liveFeed = [
    { d: "0s",   t: "14:02:11", arrow: "▲", arrowCls: "text-emerald-400", amount: "$ 4,210.00",  meta: "salary · acme · NYC → SF",         status: "[OK · 0.02s]", statusCls: "text-emerald-300" },
    { d: "0.3s", t: "14:02:12", arrow: "▼", arrowCls: "text-rose-400",    amount: "€ 84.20",     meta: "caffè nero · london",              status: "[OK · 0.04s]", statusCls: "text-emerald-300" },
    { d: "0.6s", t: "14:02:14", arrow: "▲", arrowCls: "text-emerald-400", amount: "¥ 250,000",   meta: "FX lock · USD → JPY · 60min",      status: "[FLOW]",       statusCls: "text-blue-300" },
    { d: "0.9s", t: "14:02:15", arrow: "▼", arrowCls: "text-rose-400",    amount: "$ 18.80",     meta: "uber · berlin · split 2 ways",     status: "[OK · 0.03s]", statusCls: "text-emerald-300" },
    { d: "1.2s", t: "14:02:18", arrow: "▲", arrowCls: "text-emerald-400", amount: "£ 1,200.00",  meta: "rent · standing order · cleared",  status: "[OK · 0.06s]", statusCls: "text-emerald-300" },
    { d: "1.5s", t: "14:02:21", arrow: "▼", arrowCls: "text-rose-400",    amount: "S$ 32.40",    meta: "grab · singapore · evening",       status: "[OK · 0.02s]", statusCls: "text-emerald-300" },
    { d: "1.8s", t: "14:02:23", arrow: "●", arrowCls: "text-amber-400",   amount: "$ 89.99",     meta: "photoshelter · annual · review?",  status: "[WARN]",       statusCls: "text-amber-300" },
    { d: "2.1s", t: "14:02:25", arrow: "▲", arrowCls: "text-emerald-400", amount: "CA$ 540.00",  meta: "freelance · invoice 0214",         status: "[OK · 0.05s]", statusCls: "text-emerald-300" },
    { d: "2.4s", t: "14:02:28", arrow: "▼", arrowCls: "text-rose-400",    amount: "A$ 12.50",    meta: "flat white · sydney · cbd",        status: "[OK · 0.03s]", statusCls: "text-emerald-300" },
    { d: "2.7s", t: "14:02:30", arrow: "▲", arrowCls: "text-emerald-400", amount: "$ 2,000.00",  meta: "vault · USD → SGD · executed",     status: "[FLOW]",       statusCls: "text-blue-300" },
    { d: "3.0s", t: "14:02:33", arrow: "▼", arrowCls: "text-rose-400",    amount: "€ 9.80",      meta: "metro · paris · navigo",           status: "[OK · 0.02s]", statusCls: "text-emerald-300" },
    { d: "3.3s", t: "14:02:35", arrow: "▲", arrowCls: "text-emerald-400", amount: "$ 75.00",     meta: "refund · airline · processed",     status: "[OK · 0.04s]", statusCls: "text-emerald-300" },
    { d: "3.6s", t: "14:02:38", arrow: "▼", arrowCls: "text-rose-400",    amount: "¥ 1,820",     meta: "ramen · shibuya · 22:11 jst",      status: "[OK · 0.03s]", statusCls: "text-emerald-300" },
    { d: "3.9s", t: "14:02:40", arrow: "▲", arrowCls: "text-emerald-400", amount: "$ 312.04",    meta: "interest · uninvested · 1.4%",     status: "[FLOW]",       statusCls: "text-blue-300" },
  ];

  const premiumPillars = [
    { icon: "phone-call", title: "Concierge · 24/7",   body: "A real human, on a real number, in 90 seconds. Speak about money the way you'd speak about a flight.", meta: "Geneva · Singapore" },
    { icon: "lock",       title: "Glass Vault",        body: "Up to $5M segregated, FDIC-insured per pool, with same-day access. The kind of vault that doesn't echo.", meta: "3 banking partners" },
    { icon: "gem",        title: "Black Glass Card",   body: "Stainless steel, edge-lit, 28 g. Ships engraved within 72 hours. The chip is recessed flush.",         meta: "Twice-yearly replacement" },
    { icon: "landmark",   title: "Estate Suite",       body: "Beneficiary routing, trust handoff, and tax-export rails. Pre-wired for the conversation you've been avoiding.", meta: "Counsel on call" },
  ];

  const tailwindConfig = `tailwind.config = {
  theme: { extend: {
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      body: ['"Inter"', 'sans-serif'],
    },
    colors: { brand: { teal: '#2dd4bf', blue: '#3b82f6', purple: '#a855f7' } },
    animation: {
      blob: "blob 20s infinite",
      float: "float 6s ease-in-out infinite",
      "float-delayed": "float 6s ease-in-out 3s infinite",
    },
    keyframes: {
      blob: {
        "0%": { transform: "translate(0px, 0px) scale(1)" },
        "33%": { transform: "translate(30px, -50px) scale(1.1)" },
        "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        "100%": { transform: "translate(0px, 0px) scale(1)" }
      },
      float: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-20px)" }
      }
    }
  } }
};`;

  const customCss = `body { background-color: #0f172a; color: #ffffff; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
.glass-high-contrast {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}
.gradient-bg {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: -1; overflow: hidden; background: #0f172a;
}
.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; will-change: transform; }
.blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #7c3aed; animation-delay: 0s; }
.blob-2 { top: 40%; right: -20%; width: 60vw; height: 60vw; background: #2563eb; animation-delay: 2s; }
.blob-3 { bottom: -20%; left: 20%; width: 40vw; height: 40vw; background: #0d9488; animation-delay: 4s; }
.text-gradient {
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.text-gradient-accent {
  background: linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0f172a; }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }
.perspective-container { perspective: 1000px; }
.card-3d { transform-style: preserve-3d; transform: rotateY(-15deg) rotateX(5deg); }
#mobile-menu { transition: opacity 0.3s ease, transform 0.3s ease; }
.menu-hidden { opacity: 0; pointer-events: none; transform: translateY(-10px); }
.menu-visible { opacity: 1; pointer-events: auto; transform: translateY(0); }
@keyframes clear-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 14px)); }
}
.clear-marquee-track {
  animation: clear-marquee 70s linear infinite;
  width: max-content;
  display: flex;
  gap: 28px;
}
.clear-marquee-track:hover { animation-play-state: paused; }
.clear-faq summary::-webkit-details-marker { display: none; }
.clear-faq summary { list-style: none; }
.clear-faq summary .clear-chevron { transition: transform 250ms ease; }
.clear-faq[open] summary .clear-chevron { transform: rotate(180deg); }
.clear-tier-featured {
  box-shadow: 0 0 0 1px rgba(45,212,191,0.45), 0 20px 60px -20px rgba(45,212,191,0.35);
}
@keyframes clear-term-reveal {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.clear-term-line {
  opacity: 0;
  animation: clear-term-reveal 0.5s cubic-bezier(0.2,0.8,0.2,1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes clear-term-blink { 50% { opacity: 0; } }
.clear-term-caret {
  display: inline-block;
  width: 8px; height: 1em;
  background: currentColor;
  vertical-align: middle;
  animation: clear-term-blink 1.05s steps(2) infinite;
}
@keyframes clear-bar-fill {
  0% { width: 0%; }
  60% { width: 76%; }
  100% { width: 76%; }
}
.clear-bar-fill {
  width: 0%;
  animation: clear-bar-fill 2.5s cubic-bezier(0.2,0.8,0.2,1) 0.4s forwards;
}
@keyframes clear-pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.45); }
  50%      { box-shadow: 0 0 0 6px rgba(45,212,191,0); }
}
.clear-pulse { animation: clear-pulse-ring 2s ease-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .clear-marquee-track { animation: none; }
  .clear-term-line { animation: none; opacity: 1; transform: none; }
  .clear-term-caret { animation: none; }
  .clear-bar-fill { animation: none; width: 76%; }
  .clear-pulse { animation: none; }
}`;

  const initScript = `(function init(){
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
    var menuBtn = document.getElementById('menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var isOpen = false;
    function toggle() {
      isOpen = !isOpen;
      if (isOpen) { mobileMenu.classList.remove('menu-hidden'); mobileMenu.classList.add('menu-visible'); }
      else { mobileMenu.classList.remove('menu-visible'); mobileMenu.classList.add('menu-hidden'); }
    }
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', toggle);
      document.addEventListener('click', function(e){
        if (isOpen && !menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) toggle();
      });
      mobileMenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ if (isOpen) toggle(); }); });
    }
    return;
  }
  setTimeout(init, 50);
})();`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <script src="https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js"></script>
      <script src="https://cdn.tailwindcss.com/3.4.1"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: customCss }} />

      {/* No `bg-slate-900` on this wrapper: customCss already sets
          `body { background-color: #0f172a }` (= slate-900), which becomes
          the iframe's page canvas. Putting the same colour on a wrapper
          div instead would paint over the `.gradient-bg` blobs (which use
          `position: fixed; z-index: -1` and rely on the canvas being
          underneath them) and turn the page into flat slate without the
          purple/blue/teal ambient glow. */}
      <div className="scroll-smooth font-body selection:bg-brand-teal selection:text-slate-900 text-white">
        <div className="gradient-bg">
          <div className="blob blob-1 animate-blob"></div>
          <div className="blob blob-2 animate-blob"></div>
          <div className="blob blob-3 animate-blob"></div>
        </div>

        <header className="fixed top-0 w-full z-50 pt-4 px-4 sm:px-6">
          <div className="glass-high-contrast rounded-full max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <i data-lucide="gem" className="w-5 h-5"></i>
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-white">ClearBank</span>
            </a>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="text-sm font-medium text-white/80 hover:text-white transition-colors">{l.label}</a>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-4">
              <a href="#" className="text-sm font-medium text-white hover:text-teal-300 transition-colors">Log In</a>
              <a href="#" className="bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-teal-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">Get Started</a>
            </div>
            <button id="menu-btn" className="md:hidden text-white p-1">
              <i data-lucide="menu" className="w-6 h-6"></i>
            </button>
          </div>
          <div id="mobile-menu" className="menu-hidden absolute top-24 left-4 right-4 glass-high-contrast rounded-2xl p-6 flex flex-col gap-4 md:hidden z-40">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-lg font-medium text-center py-2 border-b border-white/10">{l.label}</a>
            ))}
            <a href="#" className="bg-white text-slate-900 py-3 rounded-xl text-center font-bold mt-2">Get Started</a>
          </div>
        </header>

        <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Banking Reimagined
              </div>
              <h1 className="font-sans font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white">
                Transparency in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400">Digital Finance</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience clarity with every transaction. No hidden fees, real-time analytics, and a beautiful glass interface designed for the modern economy.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2">
                  Open Account <i data-lucide="arrow-right" className="w-5 h-5"></i>
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-full glass hover:bg-white/10 font-semibold transition-all flex items-center justify-center gap-2">
                  <i data-lucide="play-circle" className="w-5 h-5"></i> Watch Demo
                </button>
              </div>
            </div>

            <div className="relative perspective-container flex justify-center items-center h-[400px] sm:h-[500px]">
              <div className="absolute w-64 h-64 bg-teal-500/40 rounded-full blur-[100px] animate-pulse"></div>
              <div className="card-3d relative w-[320px] h-[200px] sm:w-[420px] sm:h-[260px] glass-high-contrast rounded-2xl p-6 sm:p-8 flex flex-col justify-between animate-float shadow-2xl border border-white/40">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-40 rounded-2xl pointer-events-none"></div>
                <div className="flex justify-between items-start z-10">
                  <i data-lucide="nfc" className="text-white/80 w-8 h-8 rotate-90"></i>
                  <i data-lucide="gem" className="text-white w-8 h-8"></i>
                </div>
                <div className="w-12 h-9 bg-gradient-to-tr from-amber-200 to-amber-500 rounded md:rounded-md shadow-inner border border-amber-300/50 z-10"></div>
                <div className="z-10 space-y-4">
                  <div className="font-mono text-xl sm:text-2xl tracking-[0.15em] text-white drop-shadow-md">4920 **** **** 3819</div>
                  <div className="flex justify-between text-white/90">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest opacity-70">Card Holder</div>
                      <div className="font-sans font-bold text-sm sm:text-base tracking-wide">SOPHIA REYNOLDS</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest opacity-70">Expires</div>
                      <div className="font-sans font-bold text-sm sm:text-base tracking-wide">08/29</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-10 right-10 w-24 h-24 glass rounded-full animate-float-delayed flex items-center justify-center -z-10">
                <span className="text-2xl">💸</span>
              </div>
            </div>
          </div>
        </main>

        <section className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map(s => (
                <div key={s.label} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Trusted-by */}
        <section id="trusted" className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-white/30"></span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-teal-300">— Trusted across borders —</span>
                <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-white/30"></span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold font-sans text-white mb-4">Banks the way the world does business.</h3>
              <p className="text-slate-300 text-base md:text-lg">Built on the same rails as Stripe, Wise, and Mastercard — the infrastructure your money is already moving on.</p>
            </div>
            <div className="glass-high-contrast rounded-3xl border border-white/15 p-8 md:p-12 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]">
              <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10 items-center justify-items-center">
                {trustedLogos.map(b => (
                  <li key={b.slug} className="group flex flex-col items-center gap-2">
                    <img src={`https://cdn.simpleicons.org/${b.slug}/f8fafc`} alt={b.name} className="h-7 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300" loading="lazy" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{b.caption}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span className="uppercase tracking-widest">+ 28 partner banks across 47 jurisdictions</span>
                <span className="flex items-center gap-2 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  Live since MMXIX
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold font-sans text-white mb-6">Designed for transparency</h3>
            <p className="text-slate-300 text-lg">Everything you need to manage your wealth with absolute clarity, wrapped in a stunning interface.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="glass-card p-8 rounded-3xl transition-all duration-300 group cursor-default">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border ${f.border}`}>
                  <i data-lucide={f.icon} className={`${f.iconColor} w-7 h-7`}></i>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{f.title}</h4>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
            <div className="glass-card p-8 rounded-3xl transition-all duration-300 group cursor-default md:col-span-2 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-orange-500/30">
                  <i data-lucide="smartphone" className="text-orange-300 w-7 h-7"></i>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Mobile First Experience</h4>
                <p className="text-slate-400 leading-relaxed max-w-md">Manage your finances on the go with our award-winning mobile app. Freeze cards, set limits, and track subscriptions with a tap.</p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-[60px] opacity-20"></div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold font-sans">Setup in minutes,<br />benefit forever.</h2>
                <div className="space-y-6">
                  {steps.map(s => (
                    <div key={s.n} className="flex gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${s.active ? "bg-teal-500 text-slate-900" : "bg-white/10 border border-white/20 text-white"}`}>{s.n}</div>
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{s.title}</h4>
                        <p className="text-slate-400 text-sm">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-[500px] glass-high-contrast rounded-3xl border border-white/10 p-4 flex items-center justify-center shadow-2xl">
                <div className="w-[280px] h-[480px] bg-[#0f172a] rounded-[2.5rem] border-8 border-slate-800 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl w-32 mx-auto z-20"></div>
                  <div className="p-6 pt-10 h-full flex flex-col relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-teal-900/30 to-slate-900 -z-10"></div>
                    <div className="flex justify-between items-center mb-8">
                      <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                      <div className="w-4 h-4 rounded-full bg-teal-500"></div>
                    </div>
                    <div className="text-slate-400 text-xs uppercase mb-1">Total Balance</div>
                    <div className="text-3xl font-bold text-white mb-6">$12,450.00</div>
                    <div className="h-24 w-full flex items-end gap-1 mb-6">
                      <div className="w-1/6 bg-teal-500/20 h-10 rounded-t"></div>
                      <div className="w-1/6 bg-teal-500/40 h-16 rounded-t"></div>
                      <div className="w-1/6 bg-teal-500/60 h-12 rounded-t"></div>
                      <div className="w-1/6 bg-teal-500/80 h-20 rounded-t"></div>
                      <div className="w-1/6 bg-teal-500 h-14 rounded-t"></div>
                      <div className="w-1/6 bg-teal-400 h-24 rounded-t animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-14 bg-white/5 rounded-xl flex items-center px-4 gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center"><i data-lucide="coffee" className="w-4 h-4 text-red-400"></i></div>
                        <div className="flex-1">
                          <div className="h-2 w-16 bg-slate-600 rounded mb-1"></div>
                          <div className="h-1.5 w-10 bg-slate-700 rounded"></div>
                        </div>
                        <div className="text-white font-bold text-sm">-$4.50</div>
                      </div>
                      <div className="h-14 bg-white/5 rounded-xl flex items-center px-4 gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><i data-lucide="arrow-down-left" className="w-4 h-4 text-green-400"></i></div>
                        <div className="flex-1">
                          <div className="h-2 w-20 bg-slate-600 rounded mb-1"></div>
                          <div className="h-1.5 w-12 bg-slate-700 rounded"></div>
                        </div>
                        <div className="text-teal-400 font-bold text-sm">+$2,000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Live now (animated ticker + terminal feed) */}
        <section id="live" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">— Live now</h2>
              <h3 className="text-3xl md:text-4xl font-bold font-sans text-white mb-4">Watch the ledger breathe.</h3>
              <p className="text-slate-300 text-base md:text-lg">Three tickers, one feed. Each line below appeared somewhere in the network in the last sixty seconds.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* Big card */}
                <div className="glass-high-contrast rounded-3xl border border-white/15 p-6 md:p-7 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-teal-500/15 rounded-full blur-[60px] pointer-events-none"></div>
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Volume · last 60s</span>
                    <span className="px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">▲ live</span>
                  </div>
                  <div className="font-mono text-4xl md:text-5xl text-white tabular-nums leading-none mb-4">$ 1,281,902</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60 clear-pulse"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                    </span>
                    <span className="uppercase tracking-widest">Across 47 jurisdictions</span>
                  </div>
                </div>
                {/* Bottom 2-col */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="glass rounded-3xl border border-white/15 p-5 flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Latency p99</span>
                    <span className="font-mono text-3xl text-white tabular-nums leading-none mb-4">38<span className="text-base text-slate-400 ml-1">ms</span></span>
                    <div className="mt-auto h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full clear-bar-fill bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400"></div>
                    </div>
                  </div>
                  <div className="glass rounded-3xl border border-white/15 p-5 flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Regions live</span>
                    <span className="font-mono text-3xl text-white tabular-nums leading-none mb-4">28<span className="text-base text-slate-400">/28</span></span>
                    <div className="mt-auto grid grid-cols-7 gap-1.5">
                      {ledOpacities.map((o, j) => (
                        <span key={j} className="h-2 w-2 rounded-full bg-emerald-400" style={{ opacity: o }}></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: terminal feed */}
              <div className="lg:col-span-7">
                <div className="glass-high-contrast rounded-3xl border border-white/15 overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
                    </div>
                    <span className="font-mono text-xs text-slate-400 truncate">/ledger · ws → live</span>
                    <span className="ml-auto font-mono text-[10px] text-slate-500 uppercase tracking-widest hidden sm:inline">UTF-8 · LN 124</span>
                  </div>
                  <ol className="font-mono text-xs sm:text-sm p-5 sm:p-6 space-y-2 leading-relaxed">
                    {liveFeed.map((row, j) => (
                      <li key={j} className="clear-term-line flex items-center gap-3 flex-wrap" style={{ "--d": row.d }}>
                        <span className="text-slate-500 tabular-nums">{row.t}</span>
                        <span className={row.arrowCls}>{row.arrow}</span>
                        <span className="text-white tabular-nums">{row.amount}</span>
                        <span className="text-slate-400">{row.meta}</span>
                        <span className={`ml-auto text-[10px] uppercase tracking-widest ${row.statusCls}`}>{row.status}</span>
                      </li>
                    ))}
                    <li className="clear-term-line flex items-center gap-3" style={{ "--d": "4.2s" }}>
                      <span className="text-slate-500 tabular-nums">14:02:41</span>
                      <span className="text-teal-300">→ READY</span>
                      <span className="text-teal-300 clear-term-caret"></span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Community Love</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.name} className="glass p-8 rounded-3xl relative">
                  <div className="text-teal-400 text-6xl absolute top-4 left-6 opacity-20 font-serif">"</div>
                  <p className="text-slate-300 relative z-10 mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt="User" className="w-10 h-10 rounded-full border border-white/20" />
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Around the World (image strip / marquee) */}
        <section id="world" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div className="max-w-2xl">
                <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">— Around the world</h2>
                <h3 className="text-3xl md:text-4xl font-bold font-sans text-white mb-4">Your money, in 180 places at once.</h3>
                <p className="text-slate-300 text-lg">Real interbank rates. Zero markup, ever. Hover to pause; click to convert.</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-slate-400 hidden md:flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Live · refreshed every 30s
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden py-2">
            <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#0f172a] to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#0f172a] to-transparent"></div>
            <div className="clear-marquee-track px-6 sm:px-12">
              {[...cities, ...cities].map((c, i) => {
                const trendCls = c.trend === "up" ? "text-emerald-300 border-emerald-400/30" : c.trend === "down" ? "text-rose-300 border-rose-400/30" : "text-slate-300 border-white/20";
                const trendDeltaCls = c.trend === "up" ? "text-emerald-300" : c.trend === "down" ? "text-rose-300" : "text-slate-300";
                const isClone = i >= cities.length;
                return (
                  <figure key={i} className={`shrink-0 w-72 ${isClone ? "" : "group"}`} aria-hidden={isClone ? true : undefined}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/15 bg-white/5">
                      <img className={`absolute inset-0 w-full h-full object-cover opacity-80 ${isClone ? "" : "group-hover:opacity-100 transition-opacity duration-500"}`} src={`https://images.unsplash.com/photo-${c.id}?q=80&w=900&auto=format&fit=crop`} alt={isClone ? "" : `${c.city} skyline`} loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-transparent"></div>
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-2xl">{c.flag}</span>
                        <span className={`px-2 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-wider border ${trendCls}`}>{c.delta}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                        <span className="text-xs uppercase tracking-widest text-white/70">{c.city} · {c.status}</span>
                        <span className="font-sans font-bold text-white text-2xl tracking-tight">{c.pair}</span>
                        <div className="px-3 py-2 rounded-xl glass-high-contrast flex items-baseline justify-between border border-white/20">
                          <span className="font-mono text-white text-lg tabular-nums">{c.rate}</span>
                          <span className={`text-[10px] uppercase tracking-widest ${trendDeltaCls}`}>{c.trend === "flat" ? "REF" : "24h"}</span>
                        </div>
                      </div>
                    </div>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section: In Your Hand (3 alternating image+content rows) */}
        <section id="hand" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">— Product</h2>
              <h3 className="text-3xl md:text-4xl font-bold font-sans text-white mb-4">In your hand, in three places.</h3>
              <p className="text-slate-300 text-lg">The card, the dashboard, the alerts. Each one designed to disappear.</p>
            </div>
            <div className="flex flex-col gap-16 lg:gap-24">

              {/* Row 1: Card */}
              <article className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <div className="lg:col-span-7 relative h-[360px] lg:h-[440px] glass-high-contrast rounded-3xl border border-white/15 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 30%, rgba(45,212,191,0.18) 0%, transparent 60%)" }}></div>
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 20% 80%, rgba(168,85,247,0.15) 0%, transparent 60%)" }}></div>
                  <div className="relative aspect-[1.586/1] w-[300px] sm:w-[360px] rounded-2xl border border-white/30 overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] transform rotate-[-3deg]" style={{ background: "radial-gradient(circle at 18% 20%, rgba(45,212,191,0.30), transparent 35%), radial-gradient(circle at 90% 90%, rgba(168,85,247,0.20), transparent 40%), linear-gradient(135deg, #0c1c34 0%, #101b34 60%, #060c1e 100%)" }}>
                    <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: "linear-gradient(115deg, transparent 60%, rgba(255,255,255,0.06) 60.5%, transparent 64%)" }}></div>
                    <div className="absolute top-5 right-5 w-7 h-7 rounded-md bg-gradient-to-tr from-amber-200 to-amber-500 shadow-inner border border-amber-300/50"></div>
                    <div className="absolute top-5 left-5 flex items-center gap-1.5">
                      <i data-lucide="gem" className="text-white w-5 h-5"></i>
                      <span className="font-sans font-bold text-white text-sm tracking-tight">ClearBank</span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2">
                      <div className="font-mono text-white tracking-[0.2em] text-base sm:text-lg tabular-nums">4920 **** **** 3819</div>
                      <div className="flex items-baseline justify-between text-white/90">
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase tracking-widest opacity-70">Holder</span>
                          <span className="text-xs font-bold tracking-wide">SOPHIA REYNOLDS</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] uppercase tracking-widest opacity-70">Expires</span>
                          <span className="text-xs font-bold tracking-wide">08/29</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full glass text-xs font-bold uppercase tracking-widest text-white border border-white/20">— I · The Card</span>
                </div>
                <div className="lg:col-span-5 space-y-5">
                  <h4 className="text-2xl md:text-3xl font-bold font-sans text-white">A card that makes the table quiet.</h4>
                  <p className="text-slate-300 leading-relaxed">Stainless steel, brushed not buffed. The chip recessed flush. No marketing on the front; we save that for our website. Tap, insert, swipe — the order in which most other cards forget to feel.</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-teal-400"></i> 22 g · weighted, not heavy</li>
                    <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-teal-400"></i> Virtual issued in 0.8 seconds</li>
                    <li className="flex items-center gap-2"><i data-lucide="check" className="w-4 h-4 text-teal-400"></i> Replaceable in-app, free, twice a year</li>
                  </ul>
                </div>
              </article>

              {/* Row 2: Dashboard (reverse) */}
              <article className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <div className="lg:col-span-5 lg:order-1 order-2 space-y-5">
                  <h4 className="text-2xl md:text-3xl font-bold font-sans text-white">A dashboard that closes itself.</h4>
                  <p className="text-slate-300 leading-relaxed">Real-time net worth, projected month-end, six categories sorted by deviation. The whole view fits on a single screen and is gone in eight seconds. Most banking apps mistake density for intelligence; we don't.</p>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      { l: "Net",   v: "$84,210", cls: "text-white" },
                      { l: "Δ MoM", v: "+4.8%",   cls: "text-emerald-300" },
                      { l: "Cash",  v: "$12,450", cls: "text-white" },
                    ].map(s => (
                      <div key={s.l} className="px-3 py-2 rounded-xl glass border border-white/15">
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{s.l}</div>
                        <div className={`font-mono ${s.cls} tabular-nums`}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-7 lg:order-2 order-1 relative h-[360px] lg:h-[440px] glass-high-contrast rounded-3xl border border-white/15 p-6 overflow-hidden">
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.18) 0%, transparent 55%)" }}></div>
                  <span className="absolute top-5 right-5 px-3 py-1.5 rounded-full glass text-xs font-bold uppercase tracking-widest text-white border border-white/20">— II · Dashboard</span>
                  <div className="relative h-full flex flex-col gap-4">
                    <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400">Total Balance</span>
                        <span className="text-3xl font-bold text-white font-sans tabular-nums">$96,660.00</span>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold tabular-nums">+$4,210 · MTD</span>
                    </div>
                    <div className="flex items-end gap-1.5 h-28 mt-1">
                      {[
                        { cls: "bg-teal-500/15", h: "30%" },
                        { cls: "bg-teal-500/30", h: "45%" },
                        { cls: "bg-teal-500/40", h: "38%" },
                        { cls: "bg-teal-500/55", h: "60%" },
                        { cls: "bg-teal-500/70", h: "52%" },
                        { cls: "bg-teal-500/80", h: "78%" },
                        { cls: "bg-teal-400",     h: "90%" },
                        { cls: "bg-teal-300 shadow-[0_0_18px_rgba(45,212,191,0.6)]", h: "100%" },
                      ].map((b, j) => <div key={j} className={`flex-1 ${b.cls} rounded-t`} style={{ height: b.h }}></div>)}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center"><i data-lucide="coffee" className="w-4 h-4 text-rose-300"></i></div>
                        <div className="flex-1 flex flex-col"><span className="text-xs text-slate-300">Caffè Nero</span><span className="text-[10px] text-slate-500">11:42</span></div>
                        <span className="font-mono text-white text-xs tabular-nums">−$4.50</span>
                      </div>
                      <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"><i data-lucide="arrow-down-left" className="w-4 h-4 text-emerald-300"></i></div>
                        <div className="flex-1 flex flex-col"><span className="text-xs text-slate-300">Salary · Acme</span><span className="text-[10px] text-slate-500">07:00</span></div>
                        <span className="font-mono text-emerald-300 text-xs tabular-nums">+$4,210</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Row 3: Alerts */}
              <article className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <div className="lg:col-span-7 relative h-[360px] lg:h-[440px] glass-high-contrast rounded-3xl border border-white/15 p-6 overflow-hidden">
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 80%, rgba(168,85,247,0.20) 0%, transparent 60%)" }}></div>
                  <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full glass text-xs font-bold uppercase tracking-widest text-white border border-white/20">— III · Alerts</span>
                  <div className="relative h-full flex flex-col gap-3 pt-12">
                    {[
                      { icon: "check-circle-2", iconCls: "text-emerald-300", iconBg: "bg-emerald-500/15 border-emerald-400/30", title: "Card frozen",          time: "just now", body: "Travel mode active until 14 May. Tap to undo.", muted: false },
                      { icon: "globe",          iconCls: "text-blue-300",    iconBg: "bg-blue-500/15 border-blue-400/30",       title: "USD → JPY locked",     time: "2 min",    body: "Rate held at 154.32 for next 60 minutes.",       muted: false },
                      { icon: "pie-chart",      iconCls: "text-purple-300",  iconBg: "bg-purple-500/15 border-purple-400/30",   title: "Subscription found",   time: "12 min",   body: "Annual Photoshelter, $89.99 — sound right?",     muted: false },
                      { icon: "zap",            iconCls: "text-slate-300",   iconBg: "bg-white/5 border-white/15",              title: "Quiet hours · 22:00 — 07:00", time: "setting", body: "Only fraud and security alerts will wake you.", muted: true  },
                    ].map((n, j) => (
                      <div key={j} className={`rounded-xl glass border border-white/15 p-4 flex items-center gap-4 shadow-lg${n.muted ? " opacity-70" : ""}`}>
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${n.iconBg}`}><i data-lucide={n.icon} className={`w-5 h-5 ${n.iconCls}`}></i></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="font-sans font-bold text-white text-sm">{n.title}</span>
                            <span className="text-[10px] text-slate-400 tabular-nums shrink-0">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">{n.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-5">
                  <h4 className="text-2xl md:text-3xl font-bold font-sans text-white">Alerts that earn the buzz.</h4>
                  <p className="text-slate-300 leading-relaxed">We surface what costs you money or saves your time — fraud, locked rates, recurring charges, location anomalies — and stay quiet about everything else. Your home screen is yours, not ours.</p>
                  <div className="flex items-center gap-3 pt-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-full glass border border-white/15 text-xs uppercase tracking-widest text-slate-300">Fraud · 0.04s detection</span>
                    <span className="px-3 py-1.5 rounded-full glass border border-white/15 text-xs uppercase tracking-widest text-slate-300">Quiet hours · default on</span>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* Section: Pricing (3-tier glass cards) */}
        <section id="pricing" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">— Pricing</h2>
              <h3 className="text-3xl md:text-4xl font-bold font-sans text-white mb-4">Transparent, like the rest.</h3>
              <p className="text-slate-300 text-lg">Three tiers. Cancel any time. No tier upgrades you to a new tier without telling you first.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">

              <div className="glass p-8 rounded-3xl flex flex-col gap-5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-white text-xl">Free</span>
                  <span className="text-xs uppercase tracking-widest text-slate-400">— Get started</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold font-sans text-white tabular-nums">$0</span>
                  <span className="text-slate-400 text-sm">/ month</span>
                </div>
                <p className="text-slate-300 text-sm">Everything you need to replace your high-street bank.</p>
                <ul className="flex flex-col gap-3 text-sm text-slate-300 border-t border-white/10 pt-5">
                  {["Virtual + physical card", "Real-time interbank FX", "5 free withdrawals / month", "Email support"].map(li => (
                    <li key={li} className="flex items-start gap-2"><i data-lucide="check" className="w-4 h-4 text-teal-400 mt-0.5 shrink-0"></i> {li}</li>
                  ))}
                </ul>
                <button className="mt-auto w-full py-3 rounded-full glass border border-white/20 hover:bg-white/10 text-white font-bold text-sm transition-all">Start free</button>
              </div>

              <div className="glass-high-contrast clear-tier-featured p-8 rounded-3xl flex flex-col gap-5 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_0_18px_rgba(45,212,191,0.55)]">Most popular</span>
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-white text-xl">Plus</span>
                  <span className="text-xs uppercase tracking-widest text-teal-300">— For travellers</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold font-sans bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400 text-transparent bg-clip-text tabular-nums">$8</span>
                  <span className="text-slate-300 text-sm">/ month</span>
                </div>
                <p className="text-slate-200 text-sm">Everything in Free, with the rough edges sanded down.</p>
                <ul className="flex flex-col gap-3 text-sm text-white/90 border-t border-white/15 pt-5">
                  {["Unlimited free withdrawals", "30+ multi-currency vaults", "Travel insurance · 60 days", "Priority chat · < 2 min", "1.4% on uninvested cash"].map(li => (
                    <li key={li} className="flex items-start gap-2"><i data-lucide="check" className="w-4 h-4 text-teal-300 mt-0.5 shrink-0"></i> {li}</li>
                  ))}
                </ul>
                <button className="mt-auto w-full py-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(45,212,191,0.45)] hover:scale-[1.02] transition-all">Choose Plus</button>
              </div>

              <div className="glass p-8 rounded-3xl flex flex-col gap-5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-white text-xl">Premium</span>
                  <span className="text-xs uppercase tracking-widest text-slate-400">— For advisors</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold font-sans text-white tabular-nums">$24</span>
                  <span className="text-slate-400 text-sm">/ month</span>
                </div>
                <p className="text-slate-300 text-sm">For people whose money has people of its own.</p>
                <ul className="flex flex-col gap-3 text-sm text-slate-300 border-t border-white/10 pt-5">
                  {["Everything in Plus", "Stainless steel \"Glass\" card", "Concierge · 24/7 human", "Tax export · CSV / OFX / API", "2.6% on uninvested cash"].map(li => (
                    <li key={li} className="flex items-start gap-2"><i data-lucide="check" className="w-4 h-4 text-teal-400 mt-0.5 shrink-0"></i> {li}</li>
                  ))}
                </ul>
                <button className="mt-auto w-full py-3 rounded-full glass border border-white/20 hover:bg-white/10 text-white font-bold text-sm transition-all">Choose Premium</button>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center mt-8">Prices in USD. EU/UK pricing local-equivalent — exact figures inside the app.</p>
          </div>
        </section>

        {/* Section: By Invitation (premium pillars) */}
        <section id="premium" className="py-24 relative">
          <div className="absolute inset-x-0 top-1/3 -translate-y-1/2 mx-auto w-[60%] h-72 bg-gradient-to-r from-amber-300/10 via-amber-400/15 to-amber-300/10 blur-[100px] pointer-events-none -z-0"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/30 bg-gradient-to-r from-amber-300/15 to-amber-200/5 text-amber-200 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">— By Invitation</span>
              <h3 className="text-4xl md:text-5xl font-extrabold font-sans text-white mb-5 leading-[1.1]">For people whose money has people of its own.</h3>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto">A quiet tier inside Premium. Four pillars built on the same glass; reserved for the 2% of accounts whose ledger needs a name on the door.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
              {premiumPillars.map(p => (
                <div key={p.title} className="glass-high-contrast rounded-3xl border border-amber-300/20 p-6 md:p-7 flex flex-col group hover:border-amber-300/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300/20 to-amber-500/10 border border-amber-300/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <i data-lucide={p.icon} className="w-6 h-6 text-amber-200"></i>
                  </div>
                  <h4 className="font-sans font-bold text-white text-xl mb-3">{p.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{p.body}</p>
                  <div className="mt-auto pt-5 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-widest text-amber-200/70">
                    <span>{p.meta}</span>
                    <span>↗</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 text-center mt-10 uppercase tracking-widest">Available on Premium · invitation extended after first quarter on the platform</p>
          </div>
        </section>

        {/* Section: FAQ */}
        <section id="faq" className="py-20 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">— Asked often</h2>
              <h3 className="text-3xl md:text-4xl font-bold font-sans text-white mb-4">Five answers, in advance.</h3>
            </div>
            <div className="glass-high-contrast rounded-3xl border border-white/15 divide-y divide-white/10 overflow-hidden">
              {faqs.map(f => (
                <details key={f.q} className="clear-faq group p-6 md:p-8">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer">
                    <h4 className="text-lg md:text-xl font-bold font-sans text-white">{f.q}</h4>
                    <i data-lucide="chevron-down" className="clear-chevron w-5 h-5 text-teal-300 mt-1 shrink-0"></i>
                  </summary>
                  <p className="text-slate-300 mt-4 max-w-prose leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto glass-high-contrast rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold font-sans mb-6">Ready to see clearly?</h2>
              <p className="text-lg text-slate-300 mb-10">Join 2.5 million users who have upgraded their financial life. Download ClearBank today.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-200 transition-colors w-full sm:w-auto justify-center">
                  <i data-lucide="apple" className="fill-current w-6 h-6"></i>
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase leading-none">Download on the</div>
                    <div className="text-lg font-bold leading-none">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-transparent border border-white/30 text-white hover:bg-white/10 transition-colors w-full sm:w-auto justify-center">
                  <i data-lucide="play" className="fill-current w-6 h-6"></i>
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase leading-none">Get it on</div>
                    <div className="text-lg font-bold leading-none">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#020617]/50 backdrop-blur-md pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2 lg:col-span-2">
                <a href="#" className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center">
                    <i data-lucide="gem" className="w-3 h-3 text-white"></i>
                  </div>
                  <span className="font-sans font-bold text-xl text-white">ClearBank</span>
                </a>
                <p className="text-slate-400 text-sm max-w-xs mb-6">Making finance transparent, accessible, and beautiful for everyone, everywhere.</p>
                <div className="flex gap-4">
                  {socials.map(s => (
                    <a key={s} href="#" className="text-slate-400 hover:text-white transition-colors"><i data-lucide={s} className="w-5 h-5"></i></a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {productLinks.map(l => <li key={l}><a href="#" className="hover:text-teal-400 transition-colors">{l}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {companyLinks.map(l => <li key={l}><a href="#" className="hover:text-teal-400 transition-colors">{l}</a></li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {legalLinks.map(l => <li key={l}><a href="#" className="hover:text-teal-400 transition-colors">{l}</a></li>)}
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
              <p>&copy; 2024 ClearBank Financial Technologies. All rights reserved.</p>
              <div className="flex items-center gap-1 mt-2 md:mt-0">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
