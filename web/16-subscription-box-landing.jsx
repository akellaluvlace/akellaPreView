const navLinks = ["How it works", "Plans", "This Month"];
const footerLinksA = ["How it works", "Plans", "This Month"];
const footerLinksB = ["Sustainability", "Our Farms", "Privacy"];

// Marquee tile data — verified §D.1 IDs only.
const boxTiles = [
  { num: "01", name: "Heirloom tomatoes", farm: "Owl Stream Farm", weight: "800 g", src: "https://images.unsplash.com/photo-1758221055853-479a0de23e66?w=900&q=85&auto=format&fit=crop", grad: "linear-gradient(160deg, rgba(179,39,37,0.18) 0%, transparent 55%, rgba(68,103,56,0.22) 100%)", alt: "Warm-toned still life evoking heirloom tomato cluster on linen" },
  { num: "02", name: "Bronze fennel", farm: "Wren Hollow", weight: "1 bunch", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop", grad: "linear-gradient(160deg, rgba(122,85,0,0.30) 0%, transparent 50%, rgba(68,103,56,0.30) 100%)", alt: "Cropped architectural facade tinted warm-cream as a textural produce stand-in" },
  { num: "03", name: "Tuscan kale", farm: "Cedar & Sage", weight: "600 g", src: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop", grad: "linear-gradient(160deg, rgba(179,39,37,0.32) 0%, transparent 60%, rgba(122,85,0,0.18) 100%)", alt: "Brutalist concrete texture cropped tight, recoloured warm-cream and red" },
  { num: "04", name: "Sungold tomatoes", farm: "Owl Stream Farm", weight: "500 g", src: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&q=85&auto=format&fit=crop", grad: "linear-gradient(160deg, rgba(68,103,56,0.32) 0%, transparent 60%, rgba(179,39,37,0.18) 100%)", alt: "Stone wall texture warm-cream tinted" },
  { num: "05", name: "Roasting carrots", farm: "Hare's Field", weight: "1 kg", src: "https://images.unsplash.com/photo-1618488373960-404fe668e524?w=900&q=85&auto=format&fit=crop", grad: "linear-gradient(160deg, rgba(122,85,0,0.28) 0%, transparent 55%, rgba(68,103,56,0.30) 100%)", alt: "Concrete texture cropped, warm-tinted" },
  { num: "06", name: "Pink lady apples", farm: "Bramble & Nine", weight: "6 ct", src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop", grad: "linear-gradient(160deg, rgba(179,39,37,0.30) 0%, transparent 60%, rgba(122,85,0,0.20) 100%)", alt: "Architectural cluster warm-tinted" },
  { num: "07", name: "Marigold squash", farm: "Wren Hollow", weight: "1.4 kg", src: "https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=900&q=85&auto=format&fit=crop", grad: "linear-gradient(160deg, rgba(68,103,56,0.30) 0%, transparent 55%, rgba(179,39,37,0.18) 100%)", alt: "Concrete and clay texture, warm-cream tint" },
  { num: "08", name: "Field rocket", farm: "Cedar & Sage", weight: "220 g", src: "https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=900&q=85&auto=format&fit=crop", grad: "linear-gradient(160deg, rgba(122,85,0,0.30) 0%, transparent 55%, rgba(68,103,56,0.22) 100%)", alt: "Architectural detail warm-tinted" },
  { num: "09", name: "Black mission figs", farm: "Bramble & Nine", weight: "350 g", src: "https://images.unsplash.com/photo-1758221055853-479a0de23e66?w=900&q=85&auto=format&fit=crop&sat=-15", grad: "linear-gradient(160deg, rgba(179,39,37,0.22) 0%, transparent 60%, rgba(122,85,0,0.28) 100%)", alt: "Brass apothecary still life as warm-toned harvest stand-in" },
  { num: "10", name: "Soft farm eggs", farm: "Hare's Field", weight: "6 ct", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop&sat=-10", grad: "linear-gradient(160deg, rgba(68,103,56,0.34) 0%, transparent 55%, rgba(179,39,37,0.16) 100%)", alt: "Concrete cluster warm-tinted" }
];

const arrivalSteps = [
  {
    day: "Tue.",
    step: "Step 01",
    title: "Harvest",
    body: "Tuesday begins before the dew lifts. Four growers — Owl Stream, Wren Hollow, Cedar & Sage, Hare's Field — walk their rows with shallow basket-trolleys, cutting only what is at peak. Tomatoes are picked still warm from the vine, kale below the topmost three leaves so the plant keeps producing. Nothing is washed at the field. Heritage varieties travel separately in linen-lined crates to keep their skins from bruising. By eleven the entire week's inventory is at the cooperative shed, weighed, sorted, and labelled with the grower's signature on every crate so we never lose track of who pulled what."
  },
  {
    day: "Wed.",
    step: "Step 02",
    title: "Cold-pack",
    body: "Wednesday is the slow day. Each box is hand-packed in a single, unhurried session at the shed: heavy roots first along the floor of the carton, leafy greens cradled in butcher's paper at the top so nothing crushes them, herbs and figs rest in their own divided tray. Two re-usable wool liners go between the floor and the produce — wool stays cool longer than thermo-foam and we get the liners back when the next box ships. A printed weekly note is slipped under the lid, hand-stamped with the box number and the names of the people who packed it. No plastic, no foam, no air-pillows."
  },
  {
    day: "Thu.",
    step: "Step 03",
    title: "Out for delivery",
    body: "Thursday morning the first refrigerated van leaves at 04:30 with a sleep-eyed driver and a route printed on cream card. We use small electric vans across the metro — never freight pallets — because the boxes need to be hand-carried, not forklift-jolted. You'll receive a text the moment the van leaves the shed and a second one ten minutes from your address. If you've left a cooler bag on the porch we'll transfer the box into it. If not, we knock, wait, and slide the box into the shaded side of your stoop. The whole trip from shed to doorstep is capped at six hours."
  },
  {
    day: "Fri.",
    step: "Step 04",
    title: "On your table",
    body: "Friday is when it stops being logistics and starts being dinner. Inside the box you'll find a hand-folded recipe card, a roasted-tomato sauce template that scales from two to eight, and a small printed map of which farms grew which item. Most subscribers tell us the first thing they do is unwrap the herbs and let the kitchen smell of fennel and basil for an hour. The wool liners and crate go back into the empty box; we collect it on next week's run. A small ritual that we hope makes the rest of the weekend feel a little more deliberate, a little less transactional."
  }
];

const tiers = [
  { name: "Solo", meta: "1–2 people · $34/wk", popular: false },
  { name: "Family", meta: "3–5 people · $58/wk", popular: true },
  { name: "Studio", meta: "6+ people · $92/wk", popular: false }
];

// Each row: [solo, family, studio]; tone optional ("muted" | "accent")
const tierRows = [
  { spec: "Portion size", values: ["~3 kg", "~6 kg", "~10 kg"] },
  { spec: "Vegetables", values: ["5 varieties", "8 varieties", "11 varieties"] },
  { spec: "Fruit", values: ["2 varieties", "3 varieties", "5 varieties"] },
  { spec: "Herbs", values: ["1 bunch", "2 bunches", "3 bunches"] },
  { spec: "Eggs", values: ["Add-on", "6 ct included", "12 ct included"], tones: ["muted", "accent", "accent"] },
  { spec: "Swaps allowed", values: ["2 / box", "3 / box", "5 / box"] },
  { spec: "Freeze allowed", values: ["Yes · 2 weeks", "Yes · unlimited", "Yes · unlimited"], tones: ["accent", "accent", "accent"] },
  { spec: "Delivery window", values: ["Fri 14:00–18:00", "Fri 13:00–19:00", "Fri 11:00–19:00"] }
];

// Three farmer profiles. row index even -> image left; odd -> image right.
const farms = [
  {
    label: "Owl Stream Farm · I",
    estLabel: "Est. 1998",
    eyebrow: "— Margaret Pace",
    title: "Owl Stream Farm · Veronica Valley",
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85&auto=format&fit=crop",
    overlay: "linear-gradient(135deg, rgba(255,248,247,0.30) 0%, transparent 50%, rgba(122,85,0,0.30) 100%)",
    multiply: "linear-gradient(160deg, rgba(179,39,37,0.18) 0%, transparent 55%, rgba(68,103,56,0.18) 100%)",
    p1: "Margaret started Owl Stream on three acres of leased orchard ground after her father's tobacco farm gave out. Twenty-six years later she runs forty-eight acres of nightshade — fifty-one tomato cultivars, twelve eggplants, a small experimental ground for breeding her own paste varieties. Her saved-seed library is the largest cooperative member's, and most of the heirloom tomatoes you'll see this autumn are grown from her grandmother's lines.",
    p2: "She still walks every row by hand on harvest mornings. Her dog Ledger walks behind her. The two of them are usually the first humans the produce ever sees once it's left the vine — and you can taste, we think, the absence of forklifts and freight depots in every Friday's box."
  },
  {
    label: "Cedar & Sage · II",
    estLabel: "Est. 2007",
    eyebrow: "— Theo & Salomé Vance",
    title: "Cedar & Sage · Hollow Brook",
    src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1200&q=85&auto=format&fit=crop",
    overlay: "linear-gradient(135deg, rgba(255,248,247,0.30) 0%, transparent 50%, rgba(68,103,56,0.34) 100%)",
    multiply: "linear-gradient(160deg, rgba(179,39,37,0.16) 0%, transparent 55%, rgba(122,85,0,0.18) 100%)",
    p1: "Theo and Salomé came to Hollow Brook by way of two failed restaurant ventures and a season cooking on a Greek freighter. They grow leafy greens, brassicas, and the most insistently aromatic herbs in the cooperative — the rocket has a peppery edge that's made it into more than one chef's spec sheet, and their bronze fennel is the reason a particular pastry kitchen calls every Friday at 14:02 sharp.",
    p2: "They tend their fields in the Italian market-garden way: tight beds, narrow paths, every square metre planted with three rotations a year. Soil is amended only with their own compost. They are, between them, the cooperative's quietest growers and its most consistent — every Tuesday harvest from May to first frost, never once a missed crate."
  },
  {
    label: "Bramble & Nine · III",
    estLabel: "Est. 2014",
    eyebrow: "— Jules & Iris Bramble",
    title: "Bramble & Nine · Linnet Ridge",
    src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&q=85&auto=format&fit=crop",
    overlay: "linear-gradient(135deg, rgba(255,248,247,0.30) 0%, transparent 50%, rgba(179,39,37,0.30) 100%)",
    multiply: "linear-gradient(160deg, rgba(122,85,0,0.18) 0%, transparent 55%, rgba(68,103,56,0.20) 100%)",
    p1: "Jules grew up on the orchard. Iris arrived from a horticulture programme in 2014, married him, and never left. Together they manage one hundred and ninety stone-fruit trees, the cooperative's only fig grove, and a small but very serious quince corner that yields a hundred and twenty kilos a year and disappears into one box-week of November jam.",
    p2: "They harvest in pairs — one shaking, one catching. The fig grove is picked at dawn because the fruit splits its skin in heat. Their black mission and brown turkey figs are the most fragile thing we ever ship, and the reason wool liners exist on Wednesday packing day."
  }
];

const faqs = [
  { q: "What if I'm allergic to something?", a: "Tell us at sign-up and we'll permanently exclude that ingredient from your boxes. The kitchen at the shed handles every allergen ever grown in the cooperative — including nuts and celery — so we can't promise zero cross-contact, but we can promise zero of the allergen itself in your specific carton. The weekly note will list any swaps we made on your behalf, and you'll always have one extra free swap that month for any oversight." },
  { q: "Can I skip a week?", a: "Yes — through the dashboard, by reply to the Sunday email, or by texting the number on the box flap. The cut-off is Sunday 23:59 the week of delivery; after that the produce has already been pulled from the field with your name on it. You can skip a single week, a fortnight, or pause indefinitely. We'll never auto-charge a missed week." },
  { q: "Do you deliver outside the metro area?", a: "Right now we cap delivery at a sixty-mile radius from the shed. Beyond that the six-hour shed-to-door window stops being achievable and the produce loses the thing we're paying so much attention to keep. We have a small waiting list for two adjacent towns and we'll quietly expand by one corridor each spring; if you're in either, reach out and we'll add you." },
  { q: "What happens if produce arrives bruised?", a: "Send a photo to the box-flap text number within forty-eight hours of delivery. We'll credit the affected item to the next box and, depending on what failed, slip an extra of that variety into your following carton. We don't ask you to send anything back — that's wasteful, and it usually means the photograph already told us everything we needed to know about how to talk to the grower." },
  { q: "Are the farms certified organic?", a: "Three of the four cooperative members hold full organic certification; one operates organically but has chosen not to certify because the annual paperwork would force a price rise we'd rather not pass on. We publish full grower spec sheets — soil amendment, pest practice, water source — on the inside of every box. If certification matters to you specifically, the dashboard lets you exclude the uncertified farm from your boxes." },
  { q: "Can I gift a subscription?", a: "Yes, in four-, eight-, twelve-, or twenty-six-week blocks. The first delivery includes a printed greeting card you can write at checkout, plus a small jar of preserved heritage tomatoes from Owl Stream as a welcome. The recipient never sees the price, only the start and end dates, and they can pause or extend exactly as a normal subscriber would. We do not auto-renew gift subscriptions when they end." },
  { q: "How does winter availability work?", a: "December through February the boxes lean heavier on roots, brassicas, stored fruit, and the cooperative's preserved larder — black-pepper-pickled apples, smoked salt, jars of summer's crushed tomatoes. The headcount drops slightly so the price drops with it. We don't import to fill the gap; we'd rather the box read honestly as winter food. Studio subscribers receive a small bottle of pressed apple from Bramble & Nine in every February box." }
];

// Pre-computed static class strings for tone (per §K.11/§M.14).
const toneCls = {
  muted: "text-on-surface-variant",
  accent: "text-secondary",
  default: ""
};

export default function T16SubscriptionBoxLanding() {
  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fff8f7", "on-background": "#261816", "surface": "#fff8f7", "on-surface": "#261816", "on-surface-variant": "#5a413e", "primary": "#b32725", "on-primary": "#ffffff", "primary-container": "#d6413a", "secondary": "#446738", "secondary-container": "#c2ebaf", "tertiary": "#7a5500", "outline": "#8e706d", "outline-variant": "#e2beba", "surface-variant": "#f7dcd9", "surface-container-low": "#fff0ee", "surface-container": "#ffe9e6", "surface-container-high": "#fde2df", "surface-tint": "#b32825"
          },
          spacing: { "stack-lg": "32px", "stack-md": "16px", "container-max": "1280px" },
          fontFamily: {
            "body-lg": ["Inter"], "body-md": ["Inter"], "label-sm": ["Inter"],
            "headline-md": ["Noto Serif"], "headline-lg": ["Noto Serif"], "display-xl": ["Noto Serif"]
          },
          fontSize: {
            "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
            "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
            "label-sm": ["14px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "600" }],
            "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
            "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
            "display-xl": ["48px", { lineHeight: "1.1", fontWeight: "700" }]
          }
        }
      }
    }
  `;

  // Pure CSS only (no SVG data URLs in body-injected JSX <style>, per §A traps).
  const css = `
    html, body { overflow-x: clip; }
    .full-bleed {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      max-width: none;
    }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    .text-shadow-ambient { text-shadow: 0 4px 12px rgba(214, 65, 58, 0.15); }
    @keyframes heroDrift {
      0%   { transform: scale(1.04) translate3d(0, 0, 0); }
      100% { transform: scale(1.08) translate3d(-1.2%, -0.8%, 0); }
    }
    .marquee-strip {
      animation: marquee-x 64s linear infinite;
      width: max-content;
      display: flex;
      gap: 18px;
    }
    .marquee-strip:hover { animation-play-state: paused; }
    @keyframes marquee-x {
      0%   { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 9px)); }
    }
    .farm-faq summary::-webkit-details-marker { display: none; }
    .farm-faq summary { list-style: none; }
    .farm-faq summary .farm-chevron { transition: transform 250ms ease; }
    .farm-faq[open] summary .farm-chevron { transform: rotate(45deg); }
    @media (prefers-reduced-motion: reduce) {
      .marquee-strip { animation: none; }
      .farm-faq summary .farm-chevron { transition: none; }
    }
  `;

  // Render one marquee tile; aria-hidden flag for the duplicate copy.
  const renderTile = (t, idx, hidden) => (
    <figure
      key={`${hidden ? "d-" : "o-"}${idx}`}
      aria-hidden={hidden ? "true" : undefined}
      className="w-72 shrink-0 bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-[0_2px_12px_rgba(179,39,37,0.06)]"
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <img alt={hidden ? "" : "Produce still life"} className="w-full h-full object-cover sepia-[60%] saturate-[1.5] contrast-110 brightness-95" src={t.src} />
        <div className="absolute inset-0 mix-blend-multiply" style={{ background: t.grad }}></div>
        <span className="absolute top-3 left-3 bg-primary text-on-primary font-label-sm uppercase tracking-wider px-2 py-0.5 rounded">№ {t.num}</span>
      </div>
      <figcaption className="p-4">
        <p className="font-headline-md italic text-[20px] leading-tight text-on-background">{t.name}</p>
        <p className="font-body-md text-sm text-on-surface-variant mt-1">{t.farm} · {t.weight}</p>
      </figcaption>
    </figure>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Serif:ital,wght@0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden">
        {/* Existing content block 1: nav, wrapped for section parity. */}
        <section aria-label="Top navigation">
          <nav className="bg-[#fdfcfb] sticky top-0 w-full z-50 border-b border-stone-200 shadow-sm">
            <div className="flex justify-between items-center gap-3 px-4 py-3 max-w-7xl mx-auto sm:px-6 sm:py-4 md:px-8">
              <a className="text-xl font-black font-serif text-[#D6413A] tracking-tight sm:text-2xl" href="#">Harvest</a>
              <div className="hidden md:flex space-x-8 items-center">
                {navLinks.map((l) => (
                  <a key={l} href="#" className="text-stone-600 hover:text-[#D6413A] transition-colors font-serif text-lg font-medium hover:bg-stone-50 duration-300 px-3 py-1 rounded-md">{l}</a>
                ))}
              </div>
              <button className="bg-primary-container text-on-primary rounded-full px-4 py-2 text-xs font-label-sm hover:opacity-90 scale-95 active:scale-100 transition-transform sm:px-6 sm:text-label-sm">Subscribe</button>
            </div>
          </nav>
        </section>

        {/* Existing content block 2: hero, wrapped for section parity. */}
        <section aria-label="Hero">
          <header className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img alt="Hero background" className="w-full h-full object-cover scale-[1.04] motion-safe:animate-[heroDrift_22s_ease-in-out_infinite_alternate]" style={{ filter: "contrast(1.08) saturate(1.18) brightness(0.96)" }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiE7zjWjGJUS0sWC0UmDpQrCYLQQx2gY2mvJXT9djBIU9WddM6Ney3OXc3qEux4NnMFat7bvrQaW5eWBCxJZFTObJuQ6spdBNNS_ku-XZL20krW4SN1HVEQoVGs1eUFiZerFnL8WAUWOhpbAoo2k5M9OR5usIOUxcpMVddBO6Fig73e1LqjZ0OAnww2JSkNLMGgrWQl5nZ4s_vT41hoei4IP82k09DF2tjZO77_ZZ9al4cwic7keRt2OIaWy8--HFBG3pGTIH96MU" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/60"></div>
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px 80px rgba(0,0,0,0.45)" }}></div>
            </div>
            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
              <h1 className="font-display-xl text-[32px] leading-[1.1] text-white mb-6 sm:text-[48px] sm:mb-stack-lg md:text-[72px] md:leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
                Dinner, but better,<br />every month.
              </h1>
              <p className="font-body-lg text-base text-white/90 mb-8 max-w-3xl mx-auto sm:text-body-lg sm:mb-stack-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                Rooted in Generous Seasonality. We deliver peak-season ingredients, chef-crafted recipes, and a touch of culinary magic straight to your door.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button className="w-full sm:w-auto px-6 py-3 rounded-full border-2 border-white/80 text-white font-label-sm text-label-sm backdrop-blur-sm hover:bg-white/15 transition-colors sm:px-8 sm:py-4">See this month&apos;s box</button>
                <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm shadow-[0_8px_24px_rgba(214,65,58,0.45)] hover:opacity-90 transition-opacity sm:px-8 sm:py-4">Subscribe</button>
              </div>
            </div>
          </header>
        </section>

        {/* NEW Section 1: This Week's Box. Cinema strip marquee (NOVEL #11). */}
        <section aria-label="This week's box" className="full-bleed bg-surface-container-low py-20 md:py-28 overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 mb-10 md:mb-14">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-3xl">
                <span className="font-label-sm text-secondary uppercase tracking-[0.2em]">— Box № 47 · Week of October 14</span>
                <h2 className="font-headline-lg text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-on-background mt-3">
                  This week&apos;s box.
                </h2>
                <p className="font-body-md text-on-surface-variant mt-4 max-w-2xl">
                  Ten growers. Forty-three crates. Hand-picked by Tuesday morning, on your kitchen counter by Friday night. Every variety below is what&apos;s actually peaking in the fields right now — substitutions are rare, and we&apos;ll always tell you in the weekly note when one happens.
                </p>
              </div>
              <div className="flex gap-2 self-start md:self-end">
                <span className="px-3 py-1 border border-secondary/40 rounded-full font-label-sm text-secondary uppercase tracking-wider">Pause to inspect</span>
                <span className="px-3 py-1 border border-primary/30 rounded-full font-label-sm text-primary uppercase tracking-wider">Hover · pause</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden relative">
            <div className="marquee-strip pl-4">
              {boxTiles.map((t, i) => renderTile(t, i, false))}
              {boxTiles.map((t, i) => renderTile(t, i, true))}
            </div>
          </div>
        </section>

        {/* NEW Section 2: How the box arrives. Sticky-photo + scrolling text (NOVEL #8). */}
        <section aria-label="How the box arrives" className="py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="max-w-3xl mb-12 md:mb-20">
              <span className="font-label-sm text-secondary uppercase tracking-[0.2em]">— II · The weekly ritual</span>
              <h2 className="font-headline-lg text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-on-background mt-3">
                How the box arrives.
              </h2>
              <p className="font-body-md text-on-surface-variant mt-4 max-w-2xl">
                Four quiet days between the field and your kitchen. Nothing rushed, nothing held in cold storage longer than the produce wants. Here&apos;s the sequence we walk every single week — printed on the inside of every box flap.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
              <div className="md:col-span-5">
                <div className="md:sticky md:top-32 md:self-start flex flex-col gap-6">
                  <div>
                    <div className="aspect-[4/5] relative rounded-xl overflow-hidden border border-outline-variant shadow-[0_8px_32px_rgba(179,39,37,0.10)]">
                      <img alt="Architectural facade tinted as ritual portrait" className="w-full h-full object-cover sepia-[60%] saturate-[1.5] contrast-110 brightness-95" src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85&auto=format&fit=crop" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,248,247,0.10) 0%, transparent 30%, rgba(68,103,56,0.40) 100%)" }} />
                      <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(160deg, rgba(179,39,37,0.18) 0%, transparent 55%, rgba(122,85,0,0.28) 100%)" }} />
                      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                        <span className="font-label-sm text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Plate · I</span>
                        <span className="font-label-sm text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">04 days · 12 hands</span>
                      </div>
                    </div>
                    <p className="font-body-md text-sm text-on-surface-variant italic mt-4 max-w-sm">The cooperative loading shed at Wren Hollow, photographed at 04:50 the morning before any box ships.</p>
                  </div>
                  <div>
                    <div className="aspect-[4/3] relative rounded-xl overflow-hidden border border-outline-variant shadow-[0_8px_32px_rgba(179,39,37,0.10)]">
                      <img alt="Hand-packing layer in butcher's paper, Wednesday afternoon" className="w-full h-full object-cover sepia-[60%] saturate-[1.5] contrast-110 brightness-95" src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=1200&q=85&auto=format&fit=crop" />
                      <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(160deg, rgba(122,85,0,0.32) 0%, transparent 55%, rgba(68,103,56,0.30) 100%)" }} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(20,15,8,0.45) 100%)" }} />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="font-label-sm text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Plate · II</span>
                        <span className="font-label-sm text-white/80 uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">14:20 · Wed</span>
                      </div>
                    </div>
                    <p className="font-body-md text-sm text-on-surface-variant italic mt-3 max-w-sm">Wool liners, butcher&apos;s paper, hand-stamped weekly note tucked under the lid.</p>
                  </div>
                  <div>
                    <div className="aspect-[4/3] relative rounded-xl overflow-hidden border border-outline-variant shadow-[0_8px_32px_rgba(179,39,37,0.10)]">
                      <img alt="Refrigerated electric van leaving the shed at 04:30 Thursday" className="w-full h-full object-cover sepia-[55%] saturate-[1.45] contrast-110 brightness-95" src="https://images.unsplash.com/photo-1766604106308-58b6d0d676bf?w=1200&q=85&auto=format&fit=crop" />
                      <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(160deg, rgba(68,103,56,0.32) 0%, transparent 55%, rgba(179,39,37,0.22) 100%)" }} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(20,15,8,0.45) 100%)" }} />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="font-label-sm text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Plate · III</span>
                        <span className="font-label-sm text-white/80 uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">04:30 · Thu</span>
                      </div>
                    </div>
                    <p className="font-body-md text-sm text-on-surface-variant italic mt-3 max-w-sm">First electric van pulls out · cream-card route on the dash · six-hour cap from shed to stoop.</p>
                  </div>
                </div>
              </div>
              <ol className="md:col-span-7 flex flex-col divide-y divide-outline-variant border-t border-b border-outline-variant">
                {arrivalSteps.map((s) => (
                  <li key={s.step} className="py-8 grid grid-cols-12 gap-4">
                    <div className="col-span-12 sm:col-span-3 flex flex-col">
                      <span className="font-headline-md italic text-secondary text-[28px] leading-none">{s.day}</span>
                      <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mt-2">{s.step}</span>
                    </div>
                    <div className="col-span-12 sm:col-span-9">
                      <h3 className="font-headline-md text-[22px] text-on-background mb-2">{s.title}</h3>
                      <p className="font-body-md text-on-surface-variant">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* NEW Section 3: Box options — 3-tier comparison <table>. */}
        <section aria-label="Box options" className="full-bleed bg-surface-container py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="max-w-3xl mb-12 md:mb-16">
              <span className="font-label-sm text-secondary uppercase tracking-[0.2em]">— III · Pick a portion</span>
              <h2 className="font-headline-lg text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-on-background mt-3">
                Box options.
              </h2>
              <p className="font-body-md text-on-surface-variant mt-4 max-w-2xl">
                Three sizes, all the same growers, all the same Friday window. The right tier is the one your fridge can actually hold without anything wilting before Wednesday — that, in our experience, is the most honest test.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <aside className="lg:col-span-4 flex flex-col gap-5">
                <div className="relative rounded-xl overflow-hidden border border-outline-variant shadow-[0_8px_32px_rgba(179,39,37,0.10)] flex-1 min-h-[480px] lg:min-h-0">
                  <img alt="Cooperative cold-pack room at dawn, hand-tinted as harvest still" className="absolute inset-0 w-full h-full object-cover sepia-[60%] saturate-[1.5] contrast-110 brightness-95" src="https://images.unsplash.com/photo-1762215781547-2ac20ed42cd1?w=1200&q=85&auto=format&fit=crop" />
                  <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(160deg, rgba(122,85,0,0.32) 0%, transparent 55%, rgba(68,103,56,0.34) 100%)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(20,15,8,0.45) 100%)" }} />
                  <div className="absolute top-5 left-5 right-5 flex items-baseline justify-between">
                    <span className="font-label-sm text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Plate · II</span>
                    <span className="font-label-sm text-white/80 uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">04:50 · Wed</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2">
                    <span className="font-headline-md italic text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">Cold-pack room</span>
                    <span className="font-body-md text-sm text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Wren Hollow · co-op shed</span>
                  </div>
                </div>
                <div className="border border-outline-variant rounded-xl p-5 bg-surface-container-low">
                  <span className="font-label-sm text-secondary uppercase tracking-[0.2em] block mb-3">— Honest test</span>
                  <p className="font-body-md text-sm text-on-surface-variant italic leading-relaxed">"The right tier is the one your fridge can actually hold without anything wilting before Wednesday."</p>
                </div>
              </aside>
              <div className="lg:col-span-8 overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="font-label-sm uppercase tracking-wider text-on-surface-variant px-5 py-5">Spec</th>
                      {tiers.map((t) => (
                        <th key={t.name} className={`px-5 py-5 ${t.popular ? "bg-surface-container-high" : ""}`}>
                          <div className="flex flex-col gap-2">
                            {t.popular ? (
                              <span className="inline-flex self-start bg-primary text-on-primary font-label-sm uppercase tracking-wider px-2 py-1 text-[10px] rounded">Most popular</span>
                            ) : (
                              <span className="inline-flex self-start font-label-sm uppercase tracking-wider text-on-surface-variant/0 px-2 py-1 text-[10px]">·</span>
                            )}
                            <span className="font-headline-md italic text-[22px] text-on-background">{t.name}</span>
                            <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">{t.meta}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-body-md">
                    {tierRows.map((row, ri) => {
                      const isLast = ri === tierRows.length - 1;
                      return (
                        <tr key={row.spec} className={isLast ? "" : "border-b border-outline-variant"}>
                          <td className="px-5 py-4 font-label-sm uppercase tracking-wider text-on-surface-variant">{row.spec}</td>
                          {row.values.map((v, ci) => {
                            const popular = tiers[ci].popular;
                            const tone = (row.tones && row.tones[ci]) || "default";
                            const cls = `px-5 py-4 ${popular ? "bg-surface-container-high" : ""} ${toneCls[tone]}`.trim();
                            return <td key={ci} className={cls}>{v}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="font-body-md text-on-surface-variant max-w-3xl mt-8 italic">
              Everything is flexible — pause without notice, skip a week, swap a tier in either direction with no fee. The only ask we make is that you let us know by the Sunday before delivery. After that the produce has already been pulled from the soil with your name on it, and we&apos;d rather it ends up on your table than in the cooperative&apos;s compost. Studio subscribers can split the box between two households at no extra cost; we&apos;ll deliver to two addresses on the same route.
            </p>
          </div>
        </section>

        {/* NEW Section 4: From the farms. 3 alternating 7/5 rows. */}
        <section aria-label="From the farms" className="py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="max-w-3xl mb-12 md:mb-20">
              <span className="font-label-sm text-secondary uppercase tracking-[0.2em]">— IV · The growers</span>
              <h2 className="font-headline-lg text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-on-background mt-3">
                From the farms.
              </h2>
              <p className="font-body-md text-on-surface-variant mt-4 max-w-2xl">
                Four cooperative members, eleven seasonal contributors, every box. Below: the three growers we work with most often. None advertise, none have a website, none are certified anything — they show up at the shed with crates and a clipboard, and that, at this point, is enough.
              </p>
            </div>
            <div className="flex flex-col gap-16 md:gap-24">
              {farms.map((f, idx) => {
                const imageRight = idx % 2 === 1;
                const imageColCls = imageRight ? "md:col-span-5 md:order-2" : "md:col-span-7";
                const textColCls = imageRight ? "md:col-span-7 md:order-1" : "md:col-span-5";
                return (
                  <article key={f.title} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className={imageColCls}>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant relative">
                        <img alt="Farmer portrait grayscale" className="w-full h-full object-cover grayscale" src={f.src} />
                        <div className="absolute inset-0" style={{ background: f.overlay }}></div>
                        <div className="absolute inset-0 mix-blend-multiply" style={{ background: f.multiply }}></div>
                        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                          <span className="font-label-sm text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{f.label}</span>
                          <span className="font-label-sm text-white/80 uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{f.estLabel}</span>
                        </div>
                      </div>
                    </div>
                    <div className={textColCls}>
                      <span className="font-label-sm text-secondary uppercase tracking-[0.2em]">{f.eyebrow}</span>
                      <h3 className="font-headline-md text-[26px] md:text-[28px] mt-3 mb-4">{f.title}</h3>
                      <p className="font-body-md text-on-surface-variant mb-4">{f.p1}</p>
                      <p className="font-body-md text-on-surface-variant">{f.p2}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* NEW Section 5: FAQ accordion. 7 Q&A pairs (§M.7 add-variant). */}
        <section aria-label="Frequently asked" className="full-bleed bg-surface-container-low py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
              <div className="md:col-span-4">
                <span className="font-label-sm text-secondary uppercase tracking-[0.2em]">— V · Frequently asked</span>
                <h2 className="font-headline-lg text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-on-background mt-3">
                  Questions, answered slowly.
                </h2>
                <p className="font-body-md text-on-surface-variant mt-4 max-w-md">
                  We don&apos;t run a chatbot and we&apos;d rather you didn&apos;t have to write to us at all. Below: the seven questions every new subscriber asks, in roughly the order they ask them.
                </p>
                <a href="#" className="inline-flex items-center gap-2 mt-6 font-label-sm text-primary uppercase tracking-wider hover:underline underline-offset-4">
                  Still curious? Write to us
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </a>
              </div>
              <div className="md:col-span-8 divide-y divide-outline-variant border-t border-b border-outline-variant">
                {faqs.map((f) => (
                  <details key={f.q} className="farm-faq group py-6 px-2">
                    <summary className="cursor-pointer flex justify-between items-start gap-4">
                      <h3 className="font-headline-md text-[20px] md:text-[22px] text-on-background">{f.q}</h3>
                      <span className="farm-chevron material-symbols-outlined text-primary shrink-0">add</span>
                    </summary>
                    <p className="font-body-md text-on-surface-variant mt-4 pr-8">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Existing content block 3: footer, wrapped for section parity. */}
        <section aria-label="Footer">
          <footer className="bg-stone-100 w-full py-10 px-4 border-t border-stone-200 sm:py-12 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <div>
                <a className="text-xl font-bold font-serif text-[#486B3B] mb-4 block" href="#">Harvest</a>
                <p className="font-serif text-sm text-stone-500 opacity-80 hover:opacity-100 transition-opacity">© 2024 Harvest Box. Rooted in Generous Seasonality.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 font-serif text-sm">
                  {footerLinksA.map((l) => (
                    <a key={l} href="#" className="text-stone-500 hover:underline decoration-[#D6413A] underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">{l}</a>
                  ))}
                </div>
                <div className="flex flex-col gap-2 font-serif text-sm">
                  {footerLinksB.map((l) => (
                    <a key={l} href="#" className="text-stone-500 hover:underline decoration-[#D6413A] underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">{l}</a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}
