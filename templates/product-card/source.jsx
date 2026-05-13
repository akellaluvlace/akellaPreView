const KF_CSS = `
.marquee-track { display: flex; gap: 24px; width: max-content; }
@keyframes kf-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12px)); } }
.kf-marquee { animation: kf-marquee 60s linear infinite; }
.kf-marquee-wrap:hover .kf-marquee { animation-play-state: paused; }
.kf-faq summary::-webkit-details-marker { display: none; }
.kf-faq summary { list-style: none; }
.kf-faq summary .kf-chevron { transition: transform 250ms ease; }
.kf-faq[open] summary .kf-chevron { transform: rotate(180deg); }
@media (prefers-reduced-motion: reduce) {
  .kf-marquee { animation: none; }
  .kf-faq summary .kf-chevron { transition: none; }
}
`;

const COLORS = [
  { name: "Sand", hex: "#D8CBB4" },
  { name: "Ink", hex: "#1E1E1E" },
  { name: "Coral", hex: "#FF6B4A" },
  { name: "Moss", hex: "#5E6E4A" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

const GALLERY_THUMBS = [
  { src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=900&q=85&auto=format&fit=crop", caption: "02 — Studio", aspect: "aspect-[4/5]" },
  { src: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=900&q=85&auto=format&fit=crop", caption: "03 — Window", aspect: "aspect-square" },
];

const FABRIC_SPECS = [
  { label: "Weight", value: "280gsm" },
  { label: "Construction", value: "Tubular knit" },
  { label: "Origin", value: "Aegean, Türkiye" },
  { label: "Dyed", value: "Porto, PT" },
];

const FABRIC_TILES = [
  { src: "https://images.unsplash.com/photo-1619239635762-8132f6dba51c?w=900&q=85&auto=format&fit=crop", alt: "Fabric texture — close", caption: "Weave · 24/2", offset: "" },
  { src: "https://images.unsplash.com/photo-1569909115134-a0426936c879?w=900&q=85&auto=format&fit=crop", alt: "Fabric texture — folded", caption: "Lot · 042 / Sand", offset: "mt-8" },
];

const SIZE_ROWS = [
  { label: "Chest",    values: [52, 55, 58, 61, 64] },
  { label: "Length",   values: [66, 68, 70, 72, 74] },
  { label: "Shoulder", values: [46, 48, 50, 52, 54] },
  { label: "Sleeve",   values: [21, 22, 23, 24, 25] },
];

const FIT_MODELS = [
  { src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=700&q=85&auto=format&fit=crop", alt: "On model — XS", caption: "XS · 168cm" },
  { src: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=700&q=85&auto=format&fit=crop", alt: "On model — S",  caption: "S · 174cm" },
  { src: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=700&q=85&auto=format&fit=crop", alt: "On model — M",  caption: "M · 181cm" },
  { src: "https://images.unsplash.com/photo-1762341124796-530c0085f7d8?w=700&q=85&auto=format&fit=crop", alt: "On model — L",  caption: "L · 187cm" },
];

const SOURCING = [
  {
    src: "https://images.unsplash.com/photo-1643766883805-829d9ad95c42?w=900&q=85&auto=format&fit=crop",
    alt: "Cotton field, Aegean",
    phase: "Phase 01 · Fibre",
    title: "Aegean cotton",
    body: "Rain-fed, single-origin lots from a co-op in İzmir. We buy the same blend every season — boring on purpose.",
    place: "İzmir · Türkiye",
  },
  {
    src: "https://images.unsplash.com/photo-1758269664127-1f744a56e06c?w=900&q=85&auto=format&fit=crop",
    alt: "Dye house, Porto",
    phase: "Phase 02 · Dye",
    title: "Garment-dyed in Porto",
    body: "A 12-vat dye house using mineral pigments and water reclaimed off the Douro. Each colour is mixed lot by lot.",
    place: "Porto · Portugal",
  },
  {
    src: "https://images.unsplash.com/photo-1758269664127-1f744a56e06c?w=900&q=85&auto=format&fit=crop",
    alt: "Workshop, Lisbon",
    phase: "Phase 03 · Stitch",
    title: "Stitched in Lisbon",
    body: "A 12-person atelier in Marvila. We share a cup of bica every Friday and review every piece that ships that week.",
    place: "Lisbon · Portugal",
  },
];

const CARE_NOTES = [
  { numeral: "I",   title: "First wash",       body: "Cold, inside-out, alone or with darks. The dye is set but the first wash will lift any loose pigment. Air dry flat." },
  { numeral: "II",  title: "Long-term care",   body: "Wash less than you think — every 3-4 wears is fine. Skip the dryer. Sun-fade is part of the look; we lean into it." },
  { numeral: "III", title: "Repair, on us",    body: "Send the tee back, postage prepaid, and we'll patch holes, replace seams, or re-dye it for $0. We'd rather mend than ship a new one." },
  { numeral: "IV",  title: "End of life",      body: "When it's done, send it back. We shred it for insulation batting, and you get $25 off the next one. The cotton stays in circulation; the carbon doesn't." },
];

const REVIEWS = [
  {
    avatar: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=200&q=85&auto=format&fit=crop",
    name: "Maren K.",
    meta: "Sand · M · Worn 11mo",
    quote: "Eleven months in, mine looks better than the day it arrived. The Sand has gone toward bone. I bought two more.",
  },
  {
    avatar: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=200&q=85&auto=format&fit=crop",
    name: "J. Pereira",
    meta: "Ink · L · Worn 6mo",
    quote: "Heavy enough to feel like a sweatshirt, soft enough to sleep in. The Ink hasn't faded an inch in the wash. Worth every dollar.",
  },
  {
    avatar: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=200&q=85&auto=format&fit=crop",
    name: "Sasha R.",
    meta: "Moss · S · Worn 4mo",
    quote: "The Moss is the colour every brand tries for and never lands. Boxy fit hits exactly right at the hip. Repair offer is the kicker.",
  },
];

const RELATED = [
  { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=85&auto=format&fit=crop", alt: "Model wearing the Loomed Crewneck",  name: "Loomed Crewneck",  meta: "$148 · 4 colours" },
  { src: "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=700&q=85&auto=format&fit=crop", alt: "Model with the Brass Belt No. 02",   name: "Brass Belt No. 02", meta: "$92 · One size" },
  { src: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=700&q=85&auto=format&fit=crop", alt: "Model wearing the Wide-leg Trouser", name: "Wide-leg Trouser",  meta: "$184 · Sand · Ink" },
  { src: "https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=700&q=85&auto=format&fit=crop", alt: "Model wearing the Linen Overshirt",  name: "Linen Overshirt",   meta: "$168 · 3 colours" },
  { src: "https://images.unsplash.com/photo-1776275758873-31603dd06112?w=700&q=85&auto=format&fit=crop", alt: "Model in the Boxer Hood",            name: "Boxer Hood",        meta: "$198 · Coal · Sand" },
  { src: "https://images.unsplash.com/photo-1758600587391-338f5376b7ed?w=700&q=85&auto=format&fit=crop", alt: "Model with the Field Tote",          name: "Field Tote",        meta: "$78 · Natural" },
  { src: "https://images.unsplash.com/photo-1762341124796-530c0085f7d8?w=700&q=85&auto=format&fit=crop", alt: "Model wearing the House Scarf",      name: "House Scarf",       meta: "$64 · 2 colours" },
];

const FAQ = [
  { q: "How much will it shrink?",        a: "Roughly 6% across length and chest after the first wash, then it stops. We size the tee anticipating that — your \"post-wash\" measurements are what's on the chart." },
  { q: "Pre-wash before I wear it?",      a: "Up to you. The tee is garment-dyed and pre-shrunk, so you can wear it straight from the box. A first cold wash will lift any residual indigo if you bought Ink — recommended if you're pairing with light pants right away." },
  { q: "Can I exchange size?",            a: "30 days, free both ways inside the EU + US. Email size@kinfolk.studio with your order number; we ship the new size before the old one even leaves your post office." },
  { q: "Do you restock sold-out colours?", a: "Sand, Ink, and Moss are seasonal core colours — we restock those quarterly. Coral is a one-off we made 240 of and won't repeat. If a colour is sold out, the email-when-back form is honest: it goes out to that list first." },
  { q: "Is the dye fade intentional?",    a: "Yes. Garment-dyeing leaves the pigment on the surface of the fibre, not driven into the core like reactive dyes. The result is a tee that fades along the seams and high-wear spots in the way a 1990s heavyweight used to. It's the look." },
];

const FOOTER_NOTES = [
  { label: "Shipping",  body: "Free over $100 worldwide. Delivered in 3-6 working days." },
  { label: "Care code", body: "Cold wash · Air dry · Cool iron inside-out · No bleach." },
  { label: "Studio",    body: "Kinfolk Studio · Lisbon · MMXXIV. Made in lots of 240." },
];

function ProductCard() {
  const [selectedColor, setSelectedColor] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState(2);
  const [added, setAdded] = React.useState(false);

  function handleAdd() {
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  const marqueeTiles = [...RELATED, ...RELATED];

  return (
    <div className="bg-stone-50 font-sans text-stone-900">
      <style dangerouslySetInnerHTML={{ __html: KF_CSS }} />

      <section className="relative py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-start">
          <div className="relative overflow-hidden rounded-3xl bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
              alt="Heavyweight cotton tee"
              className="aspect-square w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-700">
              New drop
            </span>
          </div>

          <div className="md:pt-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
              Kinfolk Studio
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Heavyweight Cotton Tee
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-2xl font-semibold">$68</p>
              <p className="text-sm text-stone-500 line-through">$89</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Save $21
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-stone-600">
              <span className="text-amber-500" aria-hidden>★★★★★</span>
              <span>4.9 · 284 reviews</span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-stone-700">
              A 280gsm midweight staple, cut boxy and built to soften with every wash.
              Garment-dyed in small runs, so each piece is a little different.
            </p>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-sm">
                <p className="font-medium text-stone-900">
                  Color: <span className="text-stone-600">{COLORS[selectedColor].name}</span>
                </p>
              </div>
              <div className="flex gap-3">
                {COLORS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(i)}
                    aria-label={c.name}
                    className={
                      "h-10 w-10 rounded-full border-2 transition " +
                      (i === selectedColor
                        ? "border-stone-900 scale-110"
                        : "border-stone-200 hover:border-stone-400")
                    }
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-2 text-sm font-medium text-stone-900">Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(i)}
                    className={
                      "h-11 min-w-[52px] rounded-full border px-4 text-sm font-medium transition " +
                      (i === selectedSize
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 text-stone-700 hover:border-stone-400")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="mt-10 w-full rounded-full bg-stone-900 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition hover:bg-stone-800"
            >
              {added ? "Added to cart ✓" : "Add to cart — $68"}
            </button>

            <p className="mt-3 text-center text-xs text-stone-500">
              Free shipping over $100 · 30-day returns
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28" style={{ backgroundColor: "#ECE6DA" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-2 mb-12 md:mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-500">Plate I · Worn in</p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">See it on.</h2>
            <p className="max-w-xl text-base leading-relaxed text-stone-700">Three weeks, four bodies, available light only. The tee softens, slumps, settles. We didn't iron anything.</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            <div className="md:col-span-7 flex flex-col gap-6">
              <figure className="relative overflow-hidden rounded-3xl bg-stone-200">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1400&q=85&auto=format&fit=crop" alt="Editorial portrait — morning light" className="w-full aspect-[4/5] object-cover" />
                <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">01 — Morning</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Plate · I</span>
                </figcaption>
              </figure>

              {/* Editorial caption card — fills the gap between the Morning image and the right column's bottom */}
              <aside className="rounded-3xl border border-stone-300 bg-stone-50 p-6 md:p-7 flex flex-col gap-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-600">Notes from the shoot</p>
                <p className="font-serif italic text-xl leading-snug text-stone-900 max-w-prose">"By day three the tee had taken the shape of whoever wore it last. We stopped ironing it on day one."</p>
                <div className="flex items-baseline justify-between gap-3 border-t border-stone-200 pt-3 text-[10px] uppercase tracking-[0.25em] text-stone-500">
                  <span>Editor · Mae K. · Lisbon</span>
                  <span className="text-stone-700">Available light · 6500K</span>
                </div>
              </aside>
            </div>

            <div className="md:col-span-5 flex flex-col gap-6 md:mt-12">
              {GALLERY_THUMBS.map((t) => (
                <figure key={t.caption} className="relative overflow-hidden rounded-3xl bg-stone-200">
                  <img src={t.src} alt={t.caption} className={`w-full ${t.aspect} object-cover`} />
                  <figcaption className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">{t.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          <div className="md:col-span-6 flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-500">Plate II · Material</p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">280gsm midweight, garment-dyed.</h2>
            <p className="text-base leading-relaxed text-stone-700">Long-staple Aegean cotton, ringspun and combed twice. We knit the body in a single loomed tube — no side seam — then wash, dye, and tumble it before it ever touches a label. The fabric loses ~6% over the first month and stops there.</p>
            <p className="text-base leading-relaxed text-stone-700">Each colour is mixed by hand in 80kg lots. Two of those lots will never look identical, and we don't try to fake it. The Sand you receive is the Sand we made the week your order printed.</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-stone-200 pt-6 text-sm">
              {FABRIC_SPECS.map((s) => (
                <div key={s.label}>
                  <dt className="text-stone-500">{s.label}</dt>
                  <dd className="text-stone-900 font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="md:col-span-6 grid grid-cols-2 gap-4 md:gap-5">
            {FABRIC_TILES.map((t) => (
              <figure key={t.caption} className={`relative overflow-hidden rounded-3xl bg-stone-100 aspect-[3/4] ${t.offset}`}>
                <img src={t.src} alt={t.alt} className="w-full h-full object-cover grayscale contrast-110" />
                <figcaption className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">{t.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28" style={{ backgroundColor: "#ECE6DA" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-2 mb-10 md:mb-14">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-500">Plate III · Fit</p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">Boxy, not loose.</h2>
            <p className="max-w-xl text-base leading-relaxed text-stone-700">Slightly cropped. Wide shoulder. Square hem. Take your usual size for the cut we shoot it in; size up one for the relaxed look.</p>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-stone-50">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="px-5 py-4 text-left font-medium uppercase tracking-[0.2em] text-xs">Measure (cm)</th>
                  {SIZES.map((s) => (
                    <th key={s} className="px-5 py-4 text-center font-medium">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {SIZE_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="px-5 py-4 font-medium text-stone-900">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={
                          "px-5 py-4 text-center tabular-nums " +
                          (i === 2 ? "text-stone-900 font-semibold" : "text-stone-700")
                        }
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {FIT_MODELS.map((m) => (
              <figure key={m.caption} className="relative overflow-hidden rounded-2xl bg-stone-100 aspect-[3/4]">
                <img src={m.src} alt={m.alt} className="w-full h-full object-cover" />
                <figcaption className="absolute bottom-2 left-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">{m.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-2 mb-12 md:mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-500">Plate IV · Sourcing</p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">Made small, made near.</h2>
            <p className="max-w-2xl text-base leading-relaxed text-stone-700">Three workshops, three cities, one shipping container. We visit each twice a year and carry a sample bolt back ourselves.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOURCING.map((s) => (
              <article key={s.title} className="flex flex-col gap-5 rounded-3xl border border-stone-200 bg-stone-50 p-6">
                <figure className="relative overflow-hidden rounded-2xl bg-stone-100 aspect-[4/3]">
                  <img src={s.src} alt={s.alt} className="w-full h-full object-cover grayscale contrast-110" />
                </figure>
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500">{s.phase}</p>
                <h3 className="font-serif text-2xl tracking-tight text-stone-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-stone-700">{s.body}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500 border-t border-stone-200 pt-4">{s.place}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28" style={{ backgroundColor: "#ECE6DA" }}>
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-stretch">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-12 md:self-start">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-500 mb-3">Plate V · Care</p>
              <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900 mb-6">Wear it. Wash it. Repair it.</h2>
              <figure className="relative overflow-hidden rounded-3xl bg-stone-100 aspect-[3/4]">
                <img src="https://images.unsplash.com/photo-1759719441268-7d807f21a4ea?w=1000&q=85&auto=format&fit=crop" alt="Linen on a line" className="w-full h-full object-cover" />
                <figcaption className="absolute bottom-4 left-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">Hung indoors · 22°C</figcaption>
              </figure>
            </div>
          </div>
          <div className="md:col-span-7 flex flex-col gap-8 md:h-full md:justify-between">
            <ol className="divide-y divide-stone-300 border-t border-b border-stone-300">
              {CARE_NOTES.map((n) => (
                <li key={n.numeral} className="py-8 grid grid-cols-12 gap-4 items-start">
                  <span className="col-span-2 md:col-span-1 text-amber-600 font-serif text-2xl tabular-nums">{n.numeral}</span>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="text-xl font-semibold text-stone-900">{n.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-stone-700">{n.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Service desk panel — pins to bottom to align with sticky image */}
            <aside className="rounded-3xl border border-stone-300 bg-stone-50 p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-600">Service desk</p>
                <h3 className="font-serif text-2xl text-stone-900 leading-snug">A tee should outlive the order it shipped on.</h3>
                <p className="text-sm leading-relaxed text-stone-700 max-w-md">Send any Kinfolk tee back at any time — postage prepaid. We&apos;ll patch it, re-dye it, or recycle the cotton into the next batch. Three options, one promise.</p>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Repairs · Year One</span>
                <span className="font-serif text-3xl text-stone-900 tabular-nums">412</span>
                <a href="#" className="inline-flex items-center justify-center rounded-full bg-stone-900 text-white px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-stone-800 transition shadow-sm">Start a repair</a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-500">Plate VI · Owners</p>
              <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">Owners &amp; operators.</h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-700">
              <span className="text-amber-500" aria-hidden>★★★★★</span>
              <span className="tabular-nums">4.9 from 284 reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <article key={r.name} className="flex flex-col gap-5 rounded-3xl border border-stone-200 bg-stone-50 p-7">
                <div className="flex items-center gap-4">
                  <span className="block h-14 w-14 overflow-hidden rounded-full bg-stone-200">
                    <img src={r.avatar} alt={r.name} className="h-full w-full object-cover" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-stone-900">{r.name}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{r.meta}</p>
                  </div>
                </div>
                <span className="text-amber-500 text-sm" aria-hidden>★★★★★</span>
                <blockquote className="font-serif italic text-lg leading-relaxed text-stone-800">&ldquo;{r.quote}&rdquo;</blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "#1c1917" }}>
        <div className="mx-auto max-w-6xl px-6 mb-10 md:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-400">Plate VII · From the studio</p>
          <div className="mt-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-50">Other things we made.</h2>
            <a href="#" className="text-sm uppercase tracking-[0.25em] text-stone-300 hover:text-white border-b border-stone-700 pb-1 self-start md:self-end">View entire studio →</a>
          </div>
        </div>
        <div className="kf-marquee-wrap overflow-hidden py-3">
          <div className="marquee-track kf-marquee">
            {marqueeTiles.map((r, i) => (
              <a key={`${r.name}-${i}`} href="#" className="group block w-72 shrink-0">
                <figure className="relative overflow-hidden rounded-2xl bg-stone-800 aspect-[4/5]">
                  <img src={r.src} alt={r.alt} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                </figure>
                <p className="mt-3 text-base font-medium text-stone-50">{r.name}</p>
                <p className="text-sm text-stone-400">{r.meta}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col gap-2 mb-10 md:mb-14">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-500">Plate VIII · Questions</p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-stone-900">Things you've asked.</h2>
          </div>
          <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
            {FAQ.map((row) => (
              <details key={row.q} className="kf-faq group py-6 px-1">
                <summary className="flex items-start justify-between gap-6 cursor-pointer">
                  <h3 className="text-lg md:text-xl font-medium text-stone-900">{row.q}</h3>
                  <span className="kf-chevron text-stone-500 mt-1 shrink-0" aria-hidden>▾</span>
                </summary>
                <p className="mt-4 text-base leading-relaxed text-stone-700">{row.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-stone-200 pt-10 text-sm text-stone-600">
            {FOOTER_NOTES.map((n) => (
              <div key={n.label}>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-2">{n.label}</p>
                <p>{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductCard;
