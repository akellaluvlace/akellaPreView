// Hoisted data — keeps the render tree shallow and mirrors the HTML structure.

const RECENT_WORK = [
  {
    plate: 'Plate · 01',
    title: 'Crown reduction · Mature oak',
    meta: 'Rathmines · 6 hr · 2-person crew',
    src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85&auto=format&fit=crop',
    alt: 'Mature oak crown reduction in a Dublin garden',
    width: 'w-72',
    aspect: 'aspect-[4/5]',
  },
  {
    plate: 'Plate · 02',
    title: 'Boundary hedge · 42 m',
    meta: 'Ranelagh · 1 day · 3-person crew',
    src: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1000&q=85&auto=format&fit=crop',
    alt: 'Boundary hedge being trimmed and reshaped',
    width: 'w-80',
    aspect: 'aspect-[4/3]',
  },
  {
    plate: 'Plate · 03',
    title: 'Sycamore stump grind',
    meta: 'Drumcondra · 3 hr · 1-person crew',
    src: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=900&q=85&auto=format&fit=crop',
    alt: 'Stump grinder finishing a sycamore stump',
    width: 'w-72',
    aspect: 'aspect-[4/5]',
  },
  {
    plate: 'Plate · 04 — Emergency',
    title: 'Storm ash · failed limb',
    meta: 'Glasnevin · 2 hr · 24h call-out',
    src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=85&auto=format&fit=crop',
    alt: 'Storm-damaged ash branch removed by a tree surgery team',
    width: 'w-96',
    aspect: 'aspect-[16/10]',
  },
  {
    plate: 'Plate · 05',
    title: 'Garden clearance · 90 m²',
    meta: 'Phibsboro · 1.5 days · 4-person crew',
    src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85&auto=format&fit=crop',
    alt: 'Garden clearance crew loading green waste into a chipper',
    width: 'w-72',
    aspect: 'aspect-[3/4]',
  },
  {
    plate: 'Plate · 06',
    title: 'Beech dead-wooding',
    meta: 'Sandymount · 5 hr · 2-person crew',
    src: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=1000&q=85&auto=format&fit=crop',
    alt: 'Dead-wooding a beech tree above a residential lane',
    width: 'w-80',
    aspect: 'aspect-[4/3]',
  },
  {
    plate: 'Plate · 07',
    title: 'Hedgerow planting · 24 m',
    meta: 'Clontarf · 1 day · 2-person crew',
    src: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=900&q=85&auto=format&fit=crop',
    alt: 'Newly planted hedgerow along a stone garden wall',
    width: 'w-72',
    aspect: 'aspect-[4/5]',
  },
  {
    plate: 'Plate · 08',
    title: 'Estate walk-through',
    meta: 'Howth · 4 hr · 5-year client',
    src: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1000&q=85&auto=format&fit=crop',
    alt: 'Final walk-through of a freshly cleared back garden',
    width: 'w-80',
    aspect: 'aspect-[16/10]',
  },
];

const SERVICES = [
  { icon: 'content_cut', title: 'Tree Surgery', body: 'Pruning, shaping, and complete removal of dangerous or overgrown trees by certified professionals.', emergency: false },
  { icon: 'grass', title: 'Hedge Trimming', body: 'Precision trimming and reshaping of all hedge types, from small domestic borders to large boundary lines.', emergency: false },
  { icon: 'park', title: 'Stump Removal', body: 'Complete grinding and extraction of tree stumps, leaving your ground ready for replanting or landscaping.', emergency: false },
  { icon: 'yard', title: 'Garden Clearance', body: 'Comprehensive clearing of overgrown gardens, removing green waste, debris, and unwanted vegetation.', emergency: false },
  { icon: 'nature', title: 'Crown Reduction', body: "Reducing the overall size of a tree's canopy while maintaining its natural shape and structural integrity.", emergency: false },
  { icon: 'warning', title: 'Emergency Care', body: '24/7 rapid response for storm damage, fallen branches, or immediately hazardous trees.', emergency: true },
];

const SERVICE_LINES = [
  {
    line: 'Line · 01',
    chipBg: 'bg-[#EBE2C9]/95',
    chipText: 'text-primary-container',
    eyebrow: 'Tree Surgery · NPTC certified',
    headline: 'Sectional dismantle & precision pruning',
    body: 'Roped, rigged and rope-access work on mature hardwoods, conifers and storm-damaged specimens. Every cut planned to BS 3998. Permits and TPO checks handled by us before we arrive.',
    metricA: { label: 'From', value: '€420' },
    metricB: { label: 'Lead time', value: '5–10 days' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnb_DqbdBB1-thIY3q-IF5Cd3sRmeNuC7-o-07nnzokBnjYGnVblsXaeuSjEQG7qh5zQVP8JaQkP-FdGhaEAEGxdOCGjqRUMVGGzp1IRvceV3l2eJysj-V-JWgZGTmDh3nEboJyOZuJLu0bJ6N5XxFN7gOEZjL_0Uvru8M8_Lf47uz305ZST_5-aEGF9bPHjMao4YvZQPpTE2IjAEWbHu0W0XoNDzv3ALs04kD0Jzo-l0sWT1Hbhaehgjl0jdEwybchDqt_sCta2jd',
    alt: 'Climbing arborist sectional dismantle of a large hardwood',
    reverse: false,
  },
  {
    line: 'Line · 02',
    chipBg: 'bg-[#EBE2C9]/95',
    chipText: 'text-primary-container',
    eyebrow: 'Garden Maintenance · Year-round',
    headline: 'Hedge architecture & seasonal restoration',
    body: 'Reshaping overgrown beech, laurel and yew hedges to their original line. Petrol shears for height; battery shears at finish for a clean editorial face. Green waste removed in our own chipper.',
    metricA: { label: 'From', value: '€180' },
    metricB: { label: 'Lead time', value: '3–7 days' },
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400&q=85&auto=format&fit=crop',
    alt: 'Battery hedge shears finishing a long boundary hedge',
    reverse: true,
  },
  {
    line: 'Line · 03 · 24 h',
    chipBg: 'bg-error',
    chipText: 'text-on-error',
    eyebrow: 'Emergency · 087 123 4567',
    headline: 'Storm response & hazard make-safe',
    body: 'Two-person make-safe crew on call across Dublin city and county, year-round. Average on-site time 92 minutes. Insurance paperwork begun before we leave the site.',
    metricA: { label: 'Call-out', value: '€220' },
    metricB: { label: 'Response', value: '≤ 2 hr' },
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1400&q=85&auto=format&fit=crop',
    alt: 'Storm-damaged beech limb being safely lowered to the ground',
    reverse: false,
  },
];

const PROCESS_STEPS = [
  {
    status: 'done',
    label: 'Step 01 · Day 1',
    title: 'Site survey',
    body: 'On-site visit, photo log, TPO & conservation checks. Free for jobs under €2 000.',
    icon: 'check_circle',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=85&auto=format&fit=crop',
    alt: 'Arborist surveying a mature urban tree with a clipboard',
  },
  {
    status: 'done',
    label: 'Step 02 · Day 2–3',
    title: 'Quote & method',
    body: 'Itemised quote, BS 3998 method statement, RAMS document and proof of insurance.',
    icon: 'description',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=85&auto=format&fit=crop',
    alt: 'Method statement and risk assessment paperwork on a workbench',
  },
  {
    status: 'current',
    label: 'Step 03 · Day 5–14',
    title: 'Crew on site',
    body: 'Two- to four-person crew, dedicated job lead. Neighbours notified the evening before.',
    icon: null,
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=85&auto=format&fit=crop',
    alt: 'Crew working as a team in a Dublin garden',
  },
  {
    status: 'upcoming',
    label: 'Step 04 · Same day',
    title: 'Clear & finish',
    body: 'Green waste chipped on site, hard-surface power-washed, ground left tidier than we found it.',
    icon: 'construction',
    image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600&q=85&auto=format&fit=crop',
    alt: 'Crew chipper unloading green waste at end of day',
  },
  {
    status: 'upcoming',
    label: 'Step 05 · Sign-off',
    title: 'Walk-through',
    body: 'After-photos, written care plan and 6-month follow-up note diarised the same evening.',
    icon: 'task_alt',
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=85&auto=format&fit=crop',
    alt: 'Final garden after sign-off, looking neat and finished',
  },
];

// Pre-computed step-circle styles to avoid dynamic Tailwind interpolation (M.14 / K.11).
const STEP_CIRCLE_BY_STATUS = {
  done: 'bg-primary-container border-2 border-primary-container text-tertiary-fixed shadow-md',
  current: 'bg-[#F9D648] border-2 border-primary-container shadow-md',
  upcoming: 'bg-[#ECE2CE] border-2 border-on-surface-variant/30 text-on-surface-variant',
};
const STEP_LABEL_BY_STATUS = {
  done: 'text-primary-container/70',
  current: 'text-primary-container',
  upcoming: 'text-on-surface-variant',
};

const CREW = [
  {
    name: 'Liam Doyle',
    role: 'Climbing arborist · 14 yrs',
    cert: 'NPTC CS30/31/38/39 · First-aid at height',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=85&auto=format&fit=crop',
    alt: 'Liam Doyle, lead climbing arborist',
    chip: { label: 'Lead', bg: 'bg-[#F9D648]', text: 'text-primary-container' },
  },
  {
    name: 'Aoife Ní Bhriain',
    role: 'Ground-crew lead · 9 yrs',
    cert: 'Chipper-op certified · LANTRA-trained',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&auto=format&fit=crop',
    alt: 'Aoife Ní Bhriain, ground crew lead',
    chip: null,
  },
  {
    name: 'Daragh Murphy',
    role: 'Hedge architect · 11 yrs',
    cert: 'Specialist in heritage yew & box',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85&auto=format&fit=crop',
    alt: 'Daragh Murphy, hedge architect',
    chip: null,
  },
  {
    name: 'Niamh Kelly',
    role: 'Surveys & scheduling · 7 yrs',
    cert: 'Your first call · TPO paperwork',
    image: 'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=900&q=85&auto=format&fit=crop',
    alt: 'Niamh Kelly, scheduling and surveys',
    chip: { label: 'Office', bg: 'bg-tertiary-fixed', text: 'text-primary-container' },
  },
];

const TESTIMONIALS = [
  {
    featured: false,
    body: "A storm dropped half a sycamore onto our shed at midnight. Liam's crew were on the lane by 1am, made-safe by 3am, full removal the following morning. Every step explained.",
    name: "Maeve O'Connor",
    meta: 'Glasnevin · Storm response · 2024',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=300&q=85&auto=format&fit=crop',
    alt: "Maeve O'Connor portrait",
  },
  {
    featured: true,
    body: "A 50-metre boundary hedge that hadn't been touched in eight years. Daragh restored a clean editorial line in two days — neighbours have asked us who did it.",
    name: 'Cormac Walsh',
    meta: 'Sandymount · Hedge restoration · 2024',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=300&q=85&auto=format&fit=crop',
    alt: 'Cormac Walsh portrait',
  },
  {
    featured: false,
    body: 'A protected oak with a bark wound and rot pocket. Niamh handled the council paperwork; the crew did a careful crown reduction. Three years on, the canopy looks fuller than ever.',
    name: 'Sinead Reilly',
    meta: 'Rathmines · TPO oak · 2021',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=85&auto=format&fit=crop',
    alt: 'Sinead Reilly portrait',
  },
];

const FAQ = [
  {
    q: 'Are you fully insured for work over my property?',
    a: "Yes — €6.5 m public liability and €13 m employer's liability cover, with current certificates from AXA. We email both before any job starts; many heritage and council clients require them on file.",
  },
  {
    q: 'My tree might be protected — what do I do?',
    a: "Don't lift a saw. Send us the address and we'll check the council TPO register and conservation-area mapping for free. If a permit is needed, we draft and submit it on your behalf — average 4-week turnaround.",
  },
  {
    q: 'Do you do emergency work outside office hours?',
    a: 'Yes, 24 hours, 365 days, across Dublin city and county. Average on-site time is 92 minutes. Storm-Éowyn week (Jan 2025) we ran 71 call-outs in 4 days; ring 087 123 4567 day or night.',
  },
  {
    q: 'What happens to the green waste?',
    a: "All chip goes to Bord na Móna's compost facility in Kildare. Larger logs are split for our firewood programme — we donate ~30 cubic metres a year to community groups in Dublin 1, 7 and 8.",
  },
  {
    q: "What's the lead time for non-emergency work?",
    a: "5–10 working days for surgery and clearance, 3–7 days for hedge work. We hold one short-notice slot every Friday for time-critical jobs that aren't emergencies — sale completions, insurance assessments, and the like.",
  },
];

function MarqueeFigure({ tile, hidden }) {
  return (
    <figure
      aria-hidden={hidden ? 'true' : undefined}
      className={`relative ${tile.width} ${tile.aspect} rounded-xl overflow-hidden bg-primary-container/10 shrink-0`}
    >
      <img alt={hidden ? '' : tile.alt} className="absolute inset-0 w-full h-full object-cover" src={tile.src} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2621]/85 via-[#1A2621]/10 to-transparent"></div>
      <figcaption className="absolute inset-x-4 bottom-4 flex flex-col gap-1 text-[#EBE2C9]">
        <span className="font-label-bold text-label-bold tracking-[0.18em] uppercase text-[#F9D648]">{tile.plate}</span>
        <span className="font-headline-sm text-headline-sm leading-tight">{tile.title}</span>
        <span className="font-caption text-caption opacity-80 tabular-nums">{tile.meta}</span>
      </figcaption>
    </figure>
  );
}

function LocalServicesBusiness() {
  return (
    <>
      {/* head */}
      <title>Dublin Tree &amp; Garden</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                "primary": "#153328",
                "error": "#ba1a1a",
                "surface-tint": "#466558",
                "primary-fixed": "#c8eada",
                "secondary-fixed-dim": "#ccc6b5",
                "on-surface": "#1f1b12",
                "surface-container-high": "#efe7d7",
                "on-primary": "#ffffff",
                "tertiary-fixed": "#ffdfa0",
                "on-error": "#ffffff",
                "inverse-on-surface": "#f8f0e0",
                "tertiary-container": "#584000",
                "primary-fixed-dim": "#adcebe",
                "on-tertiary-container": "#d9aa41",
                "outline": "#727974",
                "inverse-primary": "#adcebe",
                "on-tertiary-fixed-variant": "#5c4300",
                "on-primary-fixed": "#012016",
                "surface-bright": "#fff8ef",
                "on-secondary-fixed": "#1e1c11",
                "secondary": "#625e50",
                "background": "#fff8ef",
                "on-surface-variant": "#414845",
                "surface-container-highest": "#eae2d2",
                "secondary-fixed": "#e9e2d0",
                "on-background": "#1f1b12",
                "on-secondary-fixed-variant": "#4a473a",
                "surface-variant": "#eae2d2",
                "secondary-container": "#e9e2d0",
                "error-container": "#ffdad6",
                "surface-dim": "#e1d9ca",
                "outline-variant": "#c1c8c3",
                "tertiary-fixed-dim": "#f0bf54",
                "on-secondary": "#ffffff",
                "tertiary": "#3c2b00",
                "surface-container": "#f5eddd",
                "on-error-container": "#93000a",
                "surface-container-low": "#fbf3e3",
                "on-tertiary-fixed": "#261a00",
                "on-primary-container": "#98b9a9",
                "on-secondary-container": "#686456",
                "inverse-surface": "#343026",
                "on-primary-fixed-variant": "#2f4d41",
                "surface-container-lowest": "#ffffff",
                "on-tertiary": "#ffffff",
                "surface": "#fff8ef",
                "primary-container": "#2c4a3e"
              },
              "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
              },
              "spacing": {
                "lg": "40px",
                "container-max": "1280px",
                "md": "24px",
                "sm": "16px",
                "gutter": "24px",
                "xs": "8px",
                "xl": "64px",
                "base": "4px"
              },
              "fontFamily": {
                "body-lg": ["Inter"],
                "caption": ["Inter"],
                "body-md": ["Inter"],
                "headline-sm": ["Inter"],
                "display-lg": ["Inter"],
                "display-md": ["Inter"],
                "label-bold": ["Inter"]
              },
              "fontSize": {
                "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "caption": ["12px", { "lineHeight": "1.4", "fontWeight": "400" }],
                "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "headline-sm": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }],
                "display-lg": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "display-md": ["36px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700" }],
                "label-bold": ["14px", { "lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600" }]
              }
            }
          }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined[data-weight="fill"] {
            font-variation-settings: 'FILL' 1;
        }
        html, body { overflow-x: clip; }
        .full-bleed {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
            max-width: none;
        }
        .work-marquee-track {
            display: flex;
            gap: 20px;
            width: max-content;
            animation: work-marquee-x 55s linear infinite;
        }
        .work-marquee-track:hover { animation-play-state: paused; }
        @keyframes work-marquee-x {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 10px)); }
        }
        @keyframes timeline-pulse {
            0%, 100% { opacity: 0.7; box-shadow: 0 0 0 0 rgba(44, 74, 62, 0.45); }
            50%      { opacity: 1;   box-shadow: 0 0 0 9px rgba(44, 74, 62, 0); }
        }
        .timeline-pulse-dot { animation: timeline-pulse 2.4s ease-in-out infinite; }
        .dtg-faq summary::-webkit-details-marker { display: none; }
        .dtg-faq summary { list-style: none; cursor: pointer; }
        .dtg-faq summary .dtg-chevron { transition: transform 250ms ease; }
        .dtg-faq[open] summary .dtg-chevron { transform: rotate(45deg); }
        .crew-frame { box-shadow: 0 1px 0 rgba(44, 74, 62, 0.15), 0 18px 40px -22px rgba(44, 74, 62, 0.45); }
        @media (prefers-reduced-motion: reduce) {
            .work-marquee-track { animation: none; }
            .timeline-pulse-dot { animation: none; }
            .dtg-faq summary .dtg-chevron { transition: none; }
        }
` }} />

      {/* HTML had <html class="light"> + body classes — wrapped here */}
      <div className="bg-background text-on-background font-body-md text-body-md antialiased pt-24">

        {/* TopNavBar */}
        <nav className="fixed top-0 w-full z-50 bg-[#EBE2C9] dark:bg-[#1A2621] text-[#2C4A3E] dark:text-[#EBE2C9] font-sans antialiased tracking-tight border-b border-[#2C4A3E]/10 dark:border-[#EBE2C9]/10">
          <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
            <div className="text-xl font-black text-[#2C4A3E] dark:text-[#EBE2C9] uppercase">Dublin Tree &amp; Garden</div>
            <div className="hidden md:flex gap-8 items-center">
              <a className="text-[#2C4A3E] dark:text-[#F9D648] font-bold border-b-2 border-[#F9D648] pb-1 hover:text-[#2C4A3E] dark:hover:text-[#F9D648] transition-colors duration-200" href="#">Services</a>
              <a className="text-[#2C4A3E]/80 dark:text-[#EBE2C9]/80 font-medium hover:text-[#2C4A3E] dark:hover:text-[#F9D648] transition-colors duration-200" href="#">Reviews</a>
              <a className="text-[#2C4A3E]/80 dark:text-[#EBE2C9]/80 font-medium hover:text-[#2C4A3E] dark:hover:text-[#F9D648] transition-colors duration-200" href="#">About</a>
              <a className="text-[#2C4A3E]/80 dark:text-[#EBE2C9]/80 font-medium hover:text-[#2C4A3E] dark:hover:text-[#F9D648] transition-colors duration-200" href="#">Contact</a>
            </div>
            <div className="font-label-bold text-label-bold text-primary-container bg-tertiary-fixed px-sm py-xs rounded-full hidden md:block">01 234 5678</div>
            <button className="md:hidden">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-container-max mx-auto px-gutter py-xl mt-lg">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div className="flex flex-col gap-md">
              <h1 className="font-display-lg text-display-lg text-primary-container">Dublin's trusted tree surgeons since 2012</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">Professional tree care and garden maintenance by fully insured, NPTC certified experts. Serving Dublin city and county with precision and care.</p>
              <div className="flex gap-sm mt-sm">
                <button className="bg-tertiary-fixed text-primary-container font-label-bold text-label-bold px-md py-sm rounded-full hover:opacity-90 transition-opacity">Get a quote</button>
                <button className="border-2 border-primary-container text-primary-container font-label-bold text-label-bold px-md py-sm rounded-full hover:bg-surface-variant transition-colors flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">call</span> 01 234 5678
                </button>
              </div>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                alt="Professional arborist in safety gear working high in a mature tree with sunlight filtering through leaves"
                className="object-cover w-full h-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnb_DqbdBB1-thIY3q-IF5Cd3sRmeNuC7-o-07nnzokBnjYGnVblsXaeuSjEQG7qh5zQVP8JaQkP-FdGhaEAEGxdOCGjqRUMVGGzp1IRvceV3l2eJysj-V-JWgZGTmDh3nEboJyOZuJLu0bJ6N5XxFN7gOEZjL_0Uvru8M8_Lf47uz305ZST_5-aEGF9bPHjMao4YvZQPpTE2IjAEWbHu0W0XoNDzv3ALs04kD0Jzo-l0sWT1Hbhaehgjl0jdEwybchDqt_sCta2jd"
              />
              <div className="absolute inset-0 border border-primary-container/10 rounded-xl pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Trust Row */}
        <section className="bg-surface-variant py-md border-y border-surface-container-high">
          <div className="max-w-container-max mx-auto px-gutter flex flex-wrap justify-center gap-xl items-center opacity-70">
            <div className="flex items-center gap-xs font-label-bold text-label-bold text-primary-container">
              <span className="material-symbols-outlined" data-weight="fill">verified</span> Fully Insured
            </div>
            <div className="flex items-center gap-xs font-label-bold text-label-bold text-primary-container">
              <span className="material-symbols-outlined" data-weight="fill">forest</span> Tree Council Member
            </div>
            <div className="flex items-center gap-xs font-label-bold text-label-bold text-primary-container">
              <span className="material-symbols-outlined" data-weight="fill">workspace_premium</span> NPTC Certified
            </div>
            <div className="flex items-center gap-xs font-label-bold text-label-bold text-primary-container">
              <span className="material-symbols-outlined" data-weight="fill">eco</span> Environmentally Conscious
            </div>
          </div>
        </section>

        {/* Recent Work — paused-on-hover marquee strip of completed jobs */}
        <section className="full-bleed py-xl overflow-hidden" style={{ backgroundColor: '#ECE2CE' }}>
          <div className="max-w-container-max mx-auto px-gutter mb-lg flex items-end justify-between gap-md flex-wrap">
            <div>
              <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-primary-container/70">— II · Field Log</span>
              <h2 className="font-display-md text-display-md text-primary-container mt-xs">Recent work across Dublin</h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Eight jobs from the last quarter. Hover to pause; each plate logs the tree, the borough, and the crew time.</p>
          </div>
          <div className="overflow-hidden py-2">
            <div className="work-marquee-track">
              {RECENT_WORK.map((tile, i) => (
                <MarqueeFigure key={`work-a-${i}`} tile={tile} hidden={false} />
              ))}
              {RECENT_WORK.map((tile, i) => (
                <MarqueeFigure key={`work-b-${i}`} tile={tile} hidden={true} />
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="max-w-container-max mx-auto px-gutter py-xl">
          <h2 className="font-display-md text-display-md text-primary-container text-center mb-xl">Our Expert Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-md">
            {SERVICES.map((s, i) => (
              <div
                key={`svc-${i}`}
                className={`bg-[#EBE2C9] p-lg rounded-xl flex flex-col gap-sm${s.emergency ? ' border-2 border-primary-container/20' : ''}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm ${s.emergency ? 'bg-error text-on-error' : 'bg-primary-container text-tertiary-fixed'}`}
                >
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary-container">{s.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Service Catalogue — 3 alternating image+content rows (asymmetric 7/5) */}
        <section className="max-w-container-max mx-auto px-gutter py-xl">
          <div className="flex items-end justify-between gap-md flex-wrap mb-lg">
            <div>
              <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-primary-container/70">— IV · Service Catalogue</span>
              <h2 className="font-display-md text-display-md text-primary-container mt-xs max-w-2xl">A close look at three of our most-booked service lines</h2>
            </div>
            <a className="font-label-bold text-label-bold uppercase tracking-[0.18em] text-primary-container border-b-2 border-[#F9D648] pb-1 hover:opacity-80 transition-opacity" href="#">View full catalogue →</a>
          </div>
          <div className="flex flex-col gap-xl mt-md">
            {SERVICE_LINES.map((row, i) => (
              <article key={`svcline-${i}`} className="grid grid-cols-1 md:grid-cols-12 gap-lg items-center">
                <figure className={`md:col-span-7 relative aspect-[4/3] rounded-xl overflow-hidden bg-primary-container/10${row.reverse ? ' md:order-2' : ''}`}>
                  <img alt={row.alt} className="absolute inset-0 w-full h-full object-cover" src={row.image} />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full ${row.chipBg} ${row.chipText} font-label-bold text-label-bold uppercase tracking-[0.18em]`}>
                    {row.line}
                  </span>
                </figure>
                <div className={`md:col-span-5 flex flex-col gap-sm${row.reverse ? ' md:order-1' : ''}`}>
                  <span className="font-label-bold text-label-bold uppercase tracking-[0.2em] text-primary-container/70">{row.eyebrow}</span>
                  <h3 className="font-display-md text-display-md text-primary-container leading-tight">{row.headline}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{row.body}</p>
                  <dl className="grid grid-cols-2 gap-sm pt-sm border-t border-surface-container-high">
                    <div>
                      <dt className="font-caption text-caption uppercase tracking-widest text-on-surface-variant">{row.metricA.label}</dt>
                      <dd className="font-headline-sm text-headline-sm text-primary-container tabular-nums">{row.metricA.value}</dd>
                    </div>
                    <div>
                      <dt className="font-caption text-caption uppercase tracking-widest text-on-surface-variant">{row.metricB.label}</dt>
                      <dd className="font-headline-sm text-headline-sm text-primary-container tabular-nums">{row.metricB.value}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Process Timeline — 5 horizontal milestones */}
        <section className="full-bleed py-xl overflow-hidden" style={{ backgroundColor: '#ECE2CE' }}>
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="flex items-end justify-between gap-md flex-wrap mb-lg">
              <div>
                <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-primary-container/70">— V · Process</span>
                <h2 className="font-display-md text-display-md text-primary-container mt-xs max-w-2xl">From first survey to final walk-through, in five steps</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Same crew leader from quote to sign-off. Every job photographed before, during and after — full record sent to you the same evening.</p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-5 gap-lg relative mt-lg">
              <div aria-hidden="true" className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px bg-gradient-to-r from-primary-container/0 via-primary-container/40 to-primary-container/0"></div>
              {PROCESS_STEPS.map((step, i) => (
                <li key={`step-${i}`} className="flex flex-col gap-sm relative z-10">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${STEP_CIRCLE_BY_STATUS[step.status]}`}>
                    {step.status === 'current' ? (
                      <span aria-hidden="true" className="w-3 h-3 rounded-full bg-primary-container timeline-pulse-dot"></span>
                    ) : (
                      <span className="material-symbols-outlined" data-weight={step.status === 'done' ? 'fill' : undefined}>{step.icon}</span>
                    )}
                  </div>
                  <span className={`font-label-bold text-label-bold tracking-[0.18em] uppercase tabular-nums ${STEP_LABEL_BY_STATUS[step.status]}`}>{step.label}</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary-container">{step.title}</h3>
                  <p className="font-caption text-caption text-on-surface-variant">{step.body}</p>
                  <figure className="relative aspect-[4/3] rounded-lg overflow-hidden mt-sm">
                    <img alt={step.alt} className="absolute inset-0 w-full h-full object-cover" src={step.image} />
                  </figure>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Crew — 4-column tradesperson portrait grid */}
        <section className="max-w-container-max mx-auto px-gutter py-xl">
          <div className="flex items-end justify-between gap-md flex-wrap mb-lg">
            <div>
              <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-primary-container/70">— VI · The Crew</span>
              <h2 className="font-display-md text-display-md text-primary-container mt-xs max-w-2xl">Tradespeople, not subcontractors</h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Twelve full-time staff. Combined 84 years of arboriculture experience. Each tree-surgery crew runs with at least one NPTC-certified climber on the rope.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mt-md">
            {CREW.map((c, i) => (
              <figure key={`crew-${i}`} className="flex flex-col gap-sm">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden crew-frame bg-primary-container/10">
                  <img alt={c.alt} className="absolute inset-0 w-full h-full object-cover" src={c.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2621]/70 to-transparent"></div>
                  {c.chip && (
                    <span className={`absolute top-3 left-3 px-2 py-1 rounded-full ${c.chip.bg} ${c.chip.text} font-label-bold text-label-bold uppercase tracking-[0.18em]`}>
                      {c.chip.label}
                    </span>
                  )}
                </div>
                <figcaption className="flex flex-col gap-1">
                  <span className="font-headline-sm text-headline-sm text-primary-container">{c.name}</span>
                  <span className="font-label-bold text-label-bold uppercase tracking-[0.2em] text-on-surface-variant">{c.role}</span>
                  <span className="font-caption text-caption text-on-surface-variant">{c.cert}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Testimonials — 3-card row with quote + portrait + neighbourhood chip */}
        <section className="full-bleed py-xl overflow-hidden" style={{ backgroundColor: '#ECE2CE' }}>
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="flex items-end justify-between gap-md flex-wrap mb-lg">
              <div>
                <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-primary-container/70">— VII · From the Garden Gate</span>
                <h2 className="font-display-md text-display-md text-primary-container mt-xs max-w-2xl">"They left the place tidier than they found it."</h2>
              </div>
              <div className="flex items-center gap-xs font-label-bold text-label-bold text-primary-container">
                <span className="material-symbols-outlined" data-weight="fill">forest</span>
                <span className="tabular-nums">4.94 / 5 · 218 verified jobs</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-md">
              {TESTIMONIALS.map((t, i) => (
                <article
                  key={`test-${i}`}
                  className={`flex flex-col gap-md p-lg rounded-xl ${t.featured ? 'bg-primary-container text-[#EBE2C9] border-2 border-[#F9D648]' : 'bg-[#fff8ef] border border-primary-container/10'}`}
                >
                  <span
                    className={`material-symbols-outlined ${t.featured ? 'text-[#F9D648]' : 'text-tertiary-fixed-dim'}`}
                    data-weight="fill"
                    style={{ fontSize: '36px' }}
                  >
                    format_quote
                  </span>
                  <p className={`font-body-lg text-body-lg leading-snug ${t.featured ? '' : 'text-primary-container'}`}>{t.body}</p>
                  <figure className={`flex items-center gap-sm pt-sm mt-auto border-t ${t.featured ? 'border-[#EBE2C9]/20' : 'border-surface-container-high'}`}>
                    <div className={`relative w-14 h-14 rounded-full overflow-hidden shrink-0 ${t.featured ? 'bg-[#EBE2C9]/10' : 'bg-primary-container/10'}`}>
                      <img alt={t.alt} className="absolute inset-0 w-full h-full object-cover" src={t.image} />
                    </div>
                    <figcaption className="flex flex-col">
                      <span className={`font-headline-sm text-headline-sm ${t.featured ? '' : 'text-primary-container'}`}>{t.name}</span>
                      <span className={`font-caption text-caption uppercase tracking-[0.2em] ${t.featured ? 'opacity-80' : 'text-on-surface-variant'}`}>{t.meta}</span>
                    </figcaption>
                  </figure>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — native <details> accordion */}
        <section className="max-w-container-max mx-auto px-gutter py-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
            <div className="md:col-span-4">
              <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-primary-container/70">— VIII · Frequently asked</span>
              <h2 className="font-display-md text-display-md text-primary-container mt-xs">Things people ask before booking</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Can't see your question? Niamh in the office answers every email within the working day.</p>
              <a className="inline-flex items-center gap-xs mt-md font-label-bold text-label-bold uppercase tracking-[0.18em] text-primary-container border-b-2 border-[#F9D648] pb-1 hover:opacity-80 transition-opacity" href="#">
                <span className="material-symbols-outlined text-sm">call</span> 01 234 5678
              </a>
            </div>
            <div className="md:col-span-8 divide-y divide-surface-container-high border-t border-b border-surface-container-high">
              {FAQ.map((row, i) => (
                <details key={`faq-${i}`} className="dtg-faq group p-md">
                  <summary className="flex items-center justify-between gap-md py-2">
                    <h3 className="font-headline-sm text-headline-sm text-primary-container">{row.q}</h3>
                    <span className="dtg-chevron material-symbols-outlined text-primary-container shrink-0">add</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant pt-sm pr-lg">{row.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2C4A3E] dark:bg-[#0D1411] text-[#EBE2C9] font-sans text-sm tracking-wide w-full mt-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 py-16">
          <div className="flex flex-col gap-md">
            <div className="text-lg font-bold text-[#F9D648]">Dublin Tree &amp; Garden</div>
            <p className="text-[#EBE2C9]/70">© 2024 Dublin Tree &amp; Garden. Fully Insured &amp; Certified Tree Care.</p>
          </div>
          <div className="flex flex-col gap-sm">
            <a className="text-[#F9D648] font-semibold hover:text-[#F9D648] transition-all" href="#">Phone: 01 234 5678</a>
            <a className="text-[#EBE2C9]/70 hover:text-[#F9D648] transition-all" href="#">Emergency: 087 123 4567</a>
            <a className="text-[#EBE2C9]/70 hover:text-[#F9D648] transition-all" href="#">info@dublintree.ie</a>
            <a className="text-[#EBE2C9]/70 hover:text-[#F9D648] transition-all" href="#">Service Areas</a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LocalServicesBusiness;
