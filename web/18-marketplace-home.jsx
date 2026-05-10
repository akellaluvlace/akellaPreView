export default function T18MarketplaceHome() {
  const navLinks = [
    { label: "Discover", active: true },
    { label: "Artists" },
    { label: "Collections" },
    { label: "Sell" }
  ];

  const categories = ["Painting", "Photography", "Sculpture", "Print"];

  const categoryRows = [
    {
      eyebrow: "Painting",
      title: "Oil, acrylic, watercolour and beyond",
      body: "Original works from studios in Brooklyn, Mexico City, and Berlin. Stretched canvas, framed and unframed paper, and limited-run editions — each piece signed and numbered by the maker.",
      count: "328 pieces",
      cta: "Browse Painting",
      plate: "Plate · I",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1400&q=85&auto=format&fit=crop",
      alt: "Painting category",
      reverse: false
    },
    {
      eyebrow: "Photography",
      title: "Editions printed by hand",
      body: "Silver gelatin, archival pigment, and platinum-palladium prints made in the photographer's own darkroom or studio. Every print arrives with a signed certificate of authenticity and edition note.",
      count: "214 pieces",
      cta: "Browse Photography",
      plate: "Plate · II",
      img: "https://images.unsplash.com/photo-1609530142110-7af0a038c723?w=1400&q=85&auto=format&fit=crop",
      alt: "Architectural photography example — the kind of editions printed by hand and framed in our studios",
      reverse: true
    },
    {
      eyebrow: "Sculpture & Ceramics",
      title: "Vessels, forms and cast objects",
      body: "Hand-thrown stoneware, slip-cast porcelain, bronze and resin pieces from independent ceramicists and sculptors. Shipped in bespoke crating with full provenance and artist notes on materials and process.",
      count: "142 pieces",
      cta: "Browse Sculpture",
      plate: "Plate · III",
      img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1400&q=85&auto=format&fit=crop",
      alt: "Sculpture and ceramics category",
      reverse: false
    }
  ];

  const artworks = [
    { title: "Oceanic Drift", artist: "Elena Rust", price: "$1,200", alt: "Abstract fluid painting", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAErnygMgi566PaEws1N6ESTtFLVACcmR9lMd2xZ-jwiepcHATjDOTNWnZQaGkYXWMfyLGmt7Rt7JGROhQqsbLwsAKaZQ0I_Uf5scb-JHFire9TtosmSouZT1Wljmrrx3RliDUfmMhN_MFha0x4oE32mLCpkAo7auYBRDYReJGl5O12TPpxB3xT5hsxOHvHL5PXW2ELJt9XZtzEYyMv8lafv223MZnCsuRIwbZ5GEnAd3GwjVTXAkyCbfoIAkJsOLuqS6lI9Sc47kA" },
    { title: "Quiet Moment", artist: "Marcus Chen", price: "$850", alt: "Minimalist portrait painting", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIKUwG-jdAg506XrOUuAGuswkEp45qEeQo7eaK97FgpjGEI3b8wRvFgpN9-UdA6jSz34wgdoOJI-slfDR0GoOcVnJtLTX0_433Y_jKAC9oC23dic3oA-ycdDff-jkTCc8FhMcPRUulMUmgogJgn25ppPsaIUwa52C9JZ7_iRR5IKcpMZa_TJhi9_BgaLwR4IWj9xu_uXeuFTibvR_W6qjDy8QMI0ubFJckPZbJS-3-mL5B9jEBJPocD66tXIEvkIJip3ett3ge5MA" },
    { title: "Structure 04", artist: "David Alis", price: "$450", alt: "Black and white architectural photography", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCGZ0Dg-03hhqcceNk9t65-eaR1S9yoOJ7F-4QbJpYh7rq9MHcvLrrE0El-G0v3cN8Cvs_hUQ66jB86l97uywfY7YcQzrvCbZjiDp9kEuMhtzydu4MnfUWHT32_jcG2E_uP1dRRR0whBdiv6nKWsqsxqjdd-p1yDKgS_LgaihJLfujICp9GWMi_OZUcTjZd2GwSBwbZKzKd1sONJXIHqSE8uWjj9yy7i0vezqBfKE-BJ18LVsl5ASX7n0fx16ryw8fwiatnA5tcQI" },
    { title: "Vessel II", artist: "Sarah Jenkins", price: "$2,100", alt: "Ceramic sculpture", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIEJhhh8zBtoxKgpPWQ-5u-7S7Q3HiyEWvhujzmNusPeryaVNT8RsGBTSpCq5vE6zsGlQs_ShY-MJtBc2TtrvVj6J-7flUPJgLxQvmMuAL9OSDczFZs5iv1C7Z1D1fofdh2Dhq7p3SZ_LUqPefr5-8qY-x86oKjXNCxv0kGhL9slJE0BdoNH8Xi4CmEl7rWN63ellMiZE2SxzvHMoXXUaQ6u7miLzeafpD9pFsShhO7fNzi57_LUjT5rH8pXsPQEcgd08DSf_QStU" }
  ];

  // Pre-computed static class strings for marquee tile widths/aspects
  // (per playbook §K.11 / §M.14 — no dynamic Tailwind interpolation in .map()).
  const TILE_PORTRAIT = "shrink-0 w-72 aspect-[3/4] relative overflow-hidden rounded-lg bg-surface-container";
  const TILE_LANDSCAPE_S = "shrink-0 w-80 aspect-[16/10] relative overflow-hidden rounded-lg bg-surface-container";
  const TILE_LANDSCAPE_L = "shrink-0 w-96 aspect-[16/10] relative overflow-hidden rounded-lg bg-surface-container";

  const makers = [
    { name: "Elena Rust", city: "Brooklyn, NY · Painter", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&auto=format&fit=crop", cls: TILE_PORTRAIT, w: 900 },
    { name: "Marcus Chen", city: "Mexico City · Photographer", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1100&q=85&auto=format&fit=crop", cls: TILE_LANDSCAPE_S, w: 1100 },
    { name: "Sarah Jenkins", city: "Lisbon · Ceramicist", img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=900&q=85&auto=format&fit=crop", cls: TILE_PORTRAIT, w: 900 },
    { name: "David Alis", city: "Berlin · Photographer", img: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1300&q=85&auto=format&fit=crop", cls: TILE_LANDSCAPE_L, w: 1300 },
    { name: "Ana Vidal", city: "São Paulo · Printmaker", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85&auto=format&fit=crop", cls: TILE_PORTRAIT, w: 900 },
    { name: "Yuki Watanabe", city: "Kyoto · Painter", img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1100&q=85&auto=format&fit=crop", cls: TILE_LANDSCAPE_S, w: 1100 },
    { name: "Theo Marin", city: "Marseille · Sculptor", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85&auto=format&fit=crop", cls: TILE_PORTRAIT, w: 900 },
    { name: "Imani Cole", city: "Detroit · Mixed Media", img: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=1100&q=85&auto=format&fit=crop", cls: TILE_LANDSCAPE_S, w: 1100 }
  ];

  // Steps — image-context cleanup 2026-05-06: original src list was all §D.1 architectural
  // photos (concrete stair, brick wall, brutalist corridor, facade window, cornice) which
  // don't fit "Browse / Match / Order / Delivered / Reviewed" narrative. Swapped to
  // aida-public artwork images already loaded by this template — duplicates the Featured
  // grid intentionally so the user sees the same pieces journey through the system.
  const HERO_GALLERY_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAT9kWRvhxUymNClB5PHfVgNEFdi8Ya0idZqk5JZxM_5MwFbJU5zeB3PHuKBeXYT13gVfEhkvS58fycoPB3wOgkX-OFzb6P2qBhS3C1HItK2-nC0UUWoHrUuhKD_jfJBwDhygFIbCX4AF_v1KAiUsTrsEnYToUhPZbCjlZuNYnBl_PZW6YIzXhVsDxs8moQCGpVl7hnh0p3y5b2HlvHmjZvItzv0FcZoxMTg61ye_np97z2Dri52XL5YFkDhEHnRezbMqZXpq4Vu-E";
  const steps = [
    {
      n: "Step · 01",
      title: "Browse",
      body: "Filter by medium, palette, price, and edition. Save what you love to a private viewing room.",
      icon: "check_circle",
      ringCls: "w-14 h-14 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center mb-4",
      iconCls: "material-symbols-outlined text-secondary",
      eyebrowCls: "font-label-sm text-label-sm uppercase tracking-widest text-secondary tabular-nums",
      img: HERO_GALLERY_IMG,
      alt: "An abstract gallery wall — what you encounter when you start browsing the Commons catalogue"
    },
    {
      n: "Step · 02",
      title: "Match",
      body: "Use the room mock-up to see scale and tone in your space before you commit.",
      icon: "favorite",
      ringCls: "w-14 h-14 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center mb-4",
      iconCls: "material-symbols-outlined text-secondary",
      eyebrowCls: "font-label-sm text-label-sm uppercase tracking-widest text-secondary tabular-nums",
      img: artworks[1].src,
      alt: "A minimalist portrait painting — the kind of piece collectors return to once they've found the right room"
    },
    {
      n: "Step · 03 · Now",
      title: "Order",
      body: "Secure checkout, escrow until delivery, and 14-day collector returns on every piece.",
      icon: null,
      pulse: true,
      ringCls: "w-14 h-14 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center mb-4",
      iconCls: "",
      eyebrowCls: "font-label-sm text-label-sm uppercase tracking-widest text-secondary tabular-nums",
      img: artworks[0].src,
      alt: "An abstract painting in escrow — the moment between commit and dispatch"
    },
    {
      n: "Step · 04",
      title: "Delivered",
      body: "Bespoke crating from the studio, fully insured, tracked to your door anywhere worldwide.",
      icon: "local_shipping",
      ringCls: "w-14 h-14 rounded-full bg-background border-2 border-on-surface-variant/30 flex items-center justify-center mb-4",
      iconCls: "material-symbols-outlined text-on-surface-variant",
      eyebrowCls: "font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant tabular-nums",
      img: artworks[3].src,
      alt: "A delivered ceramic vessel, unwrapped from its bespoke crate and sitting in its new room"
    },
    {
      n: "Step · 05",
      title: "Reviewed",
      body: "Share a note with the artist. Every studio reads what their collectors send back.",
      icon: "reviews",
      ringCls: "w-14 h-14 rounded-full bg-background border-2 border-on-surface-variant/30 flex items-center justify-center mb-4",
      iconCls: "material-symbols-outlined text-on-surface-variant",
      eyebrowCls: "font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant tabular-nums",
      img: artworks[2].src,
      alt: "An architectural photograph hung on a collector's wall — where the artist note finds its reader"
    }
  ];

  const stories = [
    {
      name: "Marisol Ortega",
      meta: "Collector · Madrid",
      portrait: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=300&q=85&auto=format&fit=crop",
      portraitAlt: "Half-profile portrait of a woman in soft natural light against a cream wall",
      quote: "It arrived crated like a museum loan and the artist had handwritten a note about the colour she chose. That's not a transaction — that's a small ceremony.",
      piece: "\"Quiet Moment\"",
      year: "2024"
    },
    {
      name: "Felix Albright",
      meta: "Collector · Copenhagen",
      portrait: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=85&auto=format&fit=crop",
      portraitAlt: "Three-quarter portrait of a man in a wool coat against a textured wall, soft side light",
      quote: "I've bought from auction houses for years. The difference here is the artist replies — and the print I ordered for my study now has a little story attached to it.",
      piece: "\"Structure 04\"",
      year: "2023"
    },
    {
      name: "Priya Singh",
      meta: "Collector · Toronto",
      portrait: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=300&q=85&auto=format&fit=crop",
      portraitAlt: "Portrait of a woman with cropped hair beside a south-facing window in an art-filled apartment",
      quote: "The vessel I bought lived on a shelf for a year before I figured out where it really belonged. Sarah told me to take my time — that kind of patience is rare.",
      piece: "\"Vessel II\"",
      year: "2024"
    }
  ];

  const faqs = [
    { q: "Are all the works original?", a: "Yes. Every painting, sculpture, and ceramic on Commons is a one-of-one or part of a numbered edition signed by the artist. Each piece ships with a certificate of authenticity." },
    { q: "How does shipping work internationally?", a: "Studios pack and crate from their own workspace. We coordinate fully insured pickup, customs paperwork, and door-to-door tracking — typically 5–14 working days depending on origin." },
    { q: "Can I return a piece if it doesn't suit the room?", a: "14-day collector returns are standard. Funds stay in escrow until you confirm — if you change your mind, the studio receives the work back in its original crating with shipping covered by us." },
    { q: "How much of the price reaches the artist?", a: "82% of the listed price goes directly to the studio. The remaining 18% covers payment processing, escrow, customs handling, and the curatorial team. No hidden buyer's premium." },
    { q: "Do you commission new work?", a: "A handful of our studios accept private commissions. Reach out through the curator inbox with your reference imagery and timeline — we'll only forward briefs the studios are likely to accept." }
  ];

  const ctaStats = [
    { label: "Studios", value: "240+" },
    { label: "Avg. payout", value: "82%" },
    { label: "First sale", value: "~21 d" }
  ];

  const footerLinks = ["About", "Terms of Service", "Privacy Policy", "Contact", "Press", "Shipping & Returns"];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#fbf9f8", "on-background": "#1b1c1c", "surface": "#fbf9f8", "on-surface": "#1b1c1c", "on-surface-variant": "#444748", "surface-container": "#efeded", "surface-container-highest": "#e4e2e2", "surface-container-low": "#f5f3f3", "primary": "#010101", "on-primary": "#ffffff", "outline": "#747878", "outline-variant": "#c4c7c7", "secondary": "#795900", "secondary-container": "#fccb5d", "on-secondary-container": "#735500", "secondary-fixed": "#ffdf9f", "error": "#ba1a1a", "inverse-surface": "#303031"
          },
          borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
          spacing: { "margin-edge": "48px", "section-gap": "80px", "container-max": "1440px", "gutter": "24px" },
          fontFamily: {
            "display-xl": ["Noto Serif"], "headline-lg": ["Noto Serif"], "headline-md": ["Noto Serif"],
            "label-sm": ["Inter"], "body-md": ["Inter"], "body-lg": ["Inter"]
          },
          fontSize: {
            "display-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
            "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "400" }],
            "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "400" }],
            "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
            "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
            "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }]
          }
        }
      }
    }
  `;

  // Custom CSS — only declares things Tailwind doesn't express:
  // .full-bleed utility, marquee keyframe, pulse keyframe, FAQ
  // chevron rotation, and Material Symbols font-variation. No
  // background-color / color / etc. that conflicts with utilities.
  const css = `
    html, body { overflow-x: clip; }
    .full-bleed {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      max-width: none;
    }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    .makers-track {
      display: flex;
      gap: 20px;
      width: max-content;
      animation: makers-marquee 60s linear infinite;
    }
    .makers-track:hover { animation-play-state: paused; }
    @keyframes makers-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 10px)); }
    }
    .commons-faq summary::-webkit-details-marker { display: none; }
    .commons-faq summary { list-style: none; cursor: pointer; }
    .commons-faq summary .commons-chevron { transition: transform 250ms ease; }
    .commons-faq[open] summary .commons-chevron { transform: rotate(180deg); }
    @keyframes commons-pulse {
      0%, 100% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(121, 89, 0, 0.45); }
      50%      { opacity: 1;   box-shadow: 0 0 0 8px rgba(121, 89, 0, 0); }
    }
    .commons-pulse-dot { animation: commons-pulse 2.4s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .makers-track { animation: none; }
      .commons-pulse-dot { animation: none; }
      .commons-faq summary .commons-chevron { transition: none; }
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="bg-background text-on-background font-body-md text-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        <nav className="bg-white text-stone-900 font-serif text-base tracking-tight w-full top-0 z-50 border-b border-stone-200 opacity-90 active:opacity-100 transition-opacity">
          <div className="flex justify-between items-center gap-3 px-4 py-4 max-w-[1440px] mx-auto w-full sm:px-6 sm:py-5 md:px-10 md:py-6">
            <a className="text-lg font-serif tracking-widest uppercase text-stone-900 hover:text-stone-900 transition-colors duration-500 sm:text-xl md:text-2xl" href="#">Commons</a>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((l) => (
                <a key={l.label} href="#" className={l.active ? "text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-900 transition-colors duration-500" : "text-stone-500 hover:text-stone-900 transition-colors duration-500"}>{l.label}</a>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              <button aria-label="person" className="hover:text-stone-900 transition-colors duration-500">
                <span className="material-symbols-outlined">person</span>
              </button>
              <button aria-label="shopping_cart" className="hover:text-stone-900 transition-colors duration-500">
                <span className="material-symbols-outlined">shopping_cart</span>
              </button>
            </div>
          </div>
        </nav>

        <main>
          {/* Hero */}
          <section className="relative w-full min-h-[520px] md:h-[600px] flex items-center justify-center bg-surface-container-highest overflow-hidden py-16 md:py-0">
            <img alt="Abstract art gallery interior" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT9kWRvhxUymNClB5PHfVgNEFdi8Ya0idZqk5JZxM_5MwFbJU5zeB3PHuKBeXYT13gVfEhkvS58fycoPB3wOgkX-OFzb6P2qBhS3C1HItK2-nC0UUWoHrUuhKD_jfJBwDhygFIbCX4AF_v1KAiUsTrsEnYToUhPZbCjlZuNYnBl_PZW6YIzXhVsDxs8moQCGpVl7hnh0p3y5b2HlvHmjZvItzv0FcZoxMTg61ye_np97z2Dri52XL5YFkDhEHnRezbMqZXpq4Vu-E" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="relative z-10 text-center px-4 w-full max-w-4xl sm:px-6 md:px-margin-edge">
              <h1 className="font-display-xl text-[30px] leading-[1.1] text-primary mb-6 tracking-tight sm:text-[44px] sm:mb-8 md:text-display-xl">Original art from independent studios</h1>
              <div className="max-w-2xl mx-auto bg-surface p-2 rounded-lg border border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center flex-1 w-full">
                  <span className="material-symbols-outlined text-on-surface-variant ml-3 mr-2">search</span>
                  <input className="w-full bg-transparent border-none focus:ring-0 text-body-md font-body-md placeholder:text-on-surface-variant py-3 px-1 sm:text-body-lg sm:font-body-lg sm:py-4 sm:px-2" placeholder="Search artists, styles, mediums" type="text" />
                </div>
                <button className="bg-primary text-on-primary px-6 py-3 rounded font-label-sm text-label-sm tracking-widest uppercase hover:bg-inverse-surface transition-colors mt-2 sm:mt-0 sm:px-8 sm:py-4">Search</button>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6 sm:gap-3 sm:mt-8 md:gap-4">
                {categories.map((c) => (
                  <button key={c} className="px-4 py-2 border border-outline rounded-full font-body-md text-sm bg-surface hover:bg-surface-container transition-colors sm:px-6 sm:text-body-md">{c}</button>
                ))}
              </div>
            </div>
          </section>

          {/* Categories — alternating image+content rows (no bento) */}
          <section className="max-w-container-max mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-margin-edge md:py-section-gap">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 sm:mb-14 gap-3 md:gap-0">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">— 01 · Categories</span>
                <h2 className="font-headline-lg text-[26px] leading-tight text-primary mt-3 sm:text-[30px] md:text-headline-lg">Browse the collection by craft</h2>
              </div>
              <a className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface hover:text-on-surface-variant underline underline-offset-4 decoration-1" href="#">All Categories</a>
            </div>
            <div className="flex flex-col gap-12 md:gap-20">
              {categoryRows.map((row) => (
                <div key={row.eyebrow} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center">
                  <figure className={`md:col-span-7 relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container ${row.reverse ? "md:order-1" : ""}`}>
                    <img alt={row.alt} className="absolute inset-0 w-full h-full object-cover" src={row.img} />
                    <span className="absolute top-5 left-5 bg-surface/90 backdrop-blur px-3 py-1 font-label-sm text-label-sm uppercase tracking-widest text-primary">{row.plate}</span>
                  </figure>
                  <div className={`md:col-span-5 ${row.reverse ? "md:order-2" : ""}`}>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">{row.eyebrow}</span>
                    <h3 className="font-headline-md text-[22px] leading-tight text-primary mt-3 mb-4 sm:text-[26px] md:text-headline-md">{row.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">{row.body}</p>
                    <div className="flex items-center gap-5">
                      <span className="inline-flex items-center gap-2 px-3 py-1 border border-outline-variant rounded-full font-label-sm text-label-sm uppercase tracking-widest text-on-surface">{row.count}</span>
                      <a className="inline-flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors" href="#">{row.cta} <span className="material-symbols-outlined text-base">arrow_forward</span></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured this week */}
          <section className="max-w-container-max mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-margin-edge md:py-section-gap">
            <div className="flex justify-between items-end mb-8 sm:mb-12">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">— 02 · This week</span>
                <h2 className="font-headline-lg text-[22px] leading-tight text-primary mt-3 sm:text-[26px] md:text-headline-lg">Featured this week</h2>
              </div>
              <a className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface hover:text-on-surface-variant underline underline-offset-4 decoration-1" href="#">View All</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {artworks.map((a) => (
                <div key={a.title} className="group cursor-pointer">
                  <div className="relative bg-surface-container p-4 mb-4 rounded aspect-[3/4] overflow-hidden">
                    <img alt={a.alt} className="w-full h-full object-cover shadow-sm transition-transform duration-700 group-hover:scale-105" src={a.src} />
                    <button aria-label="favorite" className="absolute top-6 right-6 p-2 rounded-full bg-surface/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity text-on-surface hover:text-error">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-base leading-tight text-primary mb-1 sm:text-headline-md">{a.title}</h3>
                      <p className="font-body-md text-xs text-on-surface-variant sm:text-body-md">{a.artist}</p>
                    </div>
                    <p className="font-body-lg text-sm text-primary sm:text-body-lg">{a.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sellers / Makers — paused-on-hover marquee */}
          <section className="full-bleed py-16 sm:py-20 md:py-section-gap" style={{ backgroundColor: "#f3ede4" }}>
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-edge mb-10 sm:mb-14">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-0">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">— 03 · The Makers</span>
                  <h2 className="font-headline-lg text-[26px] leading-tight text-primary mt-3 sm:text-[30px] md:text-headline-lg">Studios you'll be supporting</h2>
                </div>
                <a className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface hover:text-on-surface-variant underline underline-offset-4 decoration-1" href="#">All Makers</a>
              </div>
            </div>
            <div className="overflow-hidden py-3">
              <div className="makers-track">
                {makers.map((m) => (
                  <figure key={`a-${m.name}`} className={m.cls}>
                    <img alt="Maker portrait" className="absolute inset-0 w-full h-full object-cover grayscale" src={m.img} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <figcaption className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-headline-md text-lg leading-tight drop-shadow">{m.name}</p>
                      <p className="font-label-sm text-label-sm uppercase tracking-widest opacity-90">{m.city}</p>
                    </figcaption>
                  </figure>
                ))}
                {makers.map((m) => (
                  <figure key={`b-${m.name}`} aria-hidden="true" className={m.cls}>
                    <img alt="" className="absolute inset-0 w-full h-full object-cover grayscale" src={m.img} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <figcaption className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-headline-md text-lg leading-tight drop-shadow">{m.name}</p>
                      <p className="font-label-sm text-label-sm uppercase tracking-widest opacity-90">{m.city}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works — 5-step horizontal roadmap */}
          <section className="max-w-container-max mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-margin-edge md:py-section-gap">
            <div className="mb-10 sm:mb-14">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">— 04 · How it works</span>
              <h2 className="font-headline-lg text-[26px] leading-tight text-primary mt-3 sm:text-[30px] md:text-headline-lg">From your screen to your wall</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-2xl">Five quiet steps. We move slowly so the artists don't have to.</p>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative">
              {/* Solid connector line spanning circle 1 center to circle 5 center.
                  Each circle is w-14 (56px) at the LEFT of its grid column; with 5 cols the
                  circles sit at ~2% / ~21% / ~50% / ~79% / ~98% of li width × col positions.
                  Using lg:left-7 + arbitrary lg:right-[18%] anchors the line from circle 1
                  center exactly to circle 5 center. Solid bg-secondary/40 (no gradient fade)
                  so the strip reads continuous through every step. */}
              <div aria-hidden="true" className="hidden lg:block absolute top-7 left-7 right-[18%] h-px bg-secondary/40"></div>
              {steps.map((s) => (
                <li key={s.title} className="relative z-10">
                  <div className={s.ringCls}>
                    {s.pulse ? (
                      <span className="w-3 h-3 rounded-full bg-secondary commons-pulse-dot" aria-hidden="true"></span>
                    ) : (
                      <span className={s.iconCls}>{s.icon}</span>
                    )}
                  </div>
                  <figure className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container mb-4">
                    <img alt={s.alt} className="absolute inset-0 w-full h-full object-cover" src={s.img} />
                  </figure>
                  <span className={s.eyebrowCls}>{s.n}</span>
                  <h3 className="font-headline-md text-lg leading-tight text-primary mt-2 sm:text-headline-md">{s.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Stories — 3-column quote cards on tinted band */}
          <section className="full-bleed py-16 sm:py-20 md:py-section-gap" style={{ backgroundColor: "#ece2ce" }}>
            <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-edge">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 sm:mb-14 gap-3 md:gap-0">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">— 05 · Letters</span>
                  <h2 className="font-headline-lg text-[26px] leading-tight text-primary mt-3 sm:text-[30px] md:text-headline-lg">Stories from the marketplace</h2>
                </div>
                <a className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface hover:text-on-surface-variant underline underline-offset-4 decoration-1" href="#">Read all letters</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6">
                {stories.map((s) => (
                  <figure key={s.name} className="bg-background border border-outline-variant rounded-lg p-6 sm:p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0">
                        <img alt={s.portraitAlt} className="w-full h-full object-cover" src={s.portrait} />
                      </div>
                      <div>
                        <p className="font-headline-md text-base leading-tight text-primary">{s.name}</p>
                        <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mt-1">{s.meta}</p>
                      </div>
                    </div>
                    <blockquote className="font-headline-md text-lg leading-snug text-primary italic flex-1">"{s.quote}"</blockquote>
                    <div className="mt-6 pt-4 border-t border-outline-variant flex items-center justify-between">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">{s.piece}</span>
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">{s.year}</span>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ — native <details> accordion */}
          <section className="max-w-container-max mx-auto px-4 py-16 sm:px-6 sm:py-20 md:px-margin-edge md:py-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">— 06 · Questions</span>
                <h2 className="font-headline-lg text-[26px] leading-tight text-primary mt-3 sm:text-[30px] md:text-headline-lg">Things collectors ask</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-sm">Everything about provenance, shipping, returns and supporting the studios you buy from.</p>
                <a className="inline-flex items-center gap-2 mt-6 font-label-sm text-label-sm uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors" href="#">Speak to a curator <span className="material-symbols-outlined text-base">arrow_forward</span></a>
              </div>
              <div className="md:col-span-8 divide-y divide-outline-variant border-t border-b border-outline-variant">
                {faqs.map((f) => (
                  <details key={f.q} className="commons-faq group p-5">
                    <summary className="flex items-center justify-between gap-4">
                      <h3 className="font-headline-md text-base leading-tight text-primary sm:text-lg md:text-headline-md">{f.q}</h3>
                      <span className="commons-chevron material-symbols-outlined text-on-surface-variant">expand_more</span>
                    </summary>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-2xl">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Open a Shop CTA — full-bleed photographic backdrop */}
          <section className="full-bleed relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img alt="Studio backdrop" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1569091791842-7cfb64e04797?w=2200&q=85&auto=format&fit=crop" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/80"></div>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 30% 80%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)" }}></div>
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 90% 10%, rgba(252,203,93,0.18) 0%, transparent 60%)" }}></div>
            </div>
            <div className="relative z-10 max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-edge py-20 sm:py-28 md:py-32">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 border border-white/30 rounded-full font-label-sm text-label-sm uppercase tracking-widest text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container commons-pulse-dot"></span>
                  Applications open · Spring '25
                </span>
                <h2 className="font-display-xl text-[34px] leading-[1.05] text-white tracking-tight mt-6 sm:text-[48px] md:text-[60px] drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]">Open a shop on Commons.</h2>
                <p className="font-body-lg text-body-md text-white/90 max-w-xl mt-5 sm:text-body-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">For independent studios making original work in any medium. Curated onboarding, transparent splits, and a buyer base who reads the artist note before they read the price.</p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a className="bg-secondary-container text-on-secondary-container px-7 py-4 rounded font-label-sm text-label-sm tracking-widest uppercase hover:bg-secondary-fixed transition-colors" href="#">Apply to open a shop</a>
                  <a className="text-white border border-white/40 px-7 py-4 rounded font-label-sm text-label-sm tracking-widest uppercase hover:bg-white/10 transition-colors" href="#">See seller terms</a>
                </div>
                <dl className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 border-t border-white/20 pt-8 max-w-xl">
                  {ctaStats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-label-sm text-label-sm uppercase tracking-widest text-white/70">{s.label}</dt>
                      <dd className="font-display-xl text-[28px] leading-tight text-white tabular-nums mt-1 sm:text-[32px]">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-white text-stone-900 font-sans text-xs uppercase tracking-widest w-full border-t border-stone-200 ease-in-out duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center px-4 py-10 max-w-[1440px] mx-auto w-full gap-6 sm:px-6 sm:py-12 md:px-10 md:gap-0">
            <div className="text-lg font-serif tracking-widest uppercase text-stone-900 mb-6 md:mb-0">Commons</div>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 mb-6 md:mb-0">
              {footerLinks.map((l) => (
                <a key={l} href="#" className="text-stone-400 hover:text-stone-900 underline decoration-1 underline-offset-4">{l}</a>
              ))}
            </div>
            <div className="text-stone-400 text-[10px]">© 2024 Commons Marketplace. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
