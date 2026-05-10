// Hoisted data — keeps the render tree shallow and mirrors the HTML structure.

// Image-context cleanup 2026-05-06: original RECENT_WORK + PROCESS_STEPS images were all
// architectural §D.1 mismatches (concrete stair as "oak crown reduction", camels as
// "sycamore stump grind", brick wall as "beech dead-wooding", etc.). Replaced with
// outdoor/tree-themed Unsplash IDs (user-authorized expansion beyond §D.1) plus the
// existing aida-public arborist images.
const HERO_ARBORIST = "https://lh3.googleusercontent.com/aida-public/AB6AXuCnb_DqbdBB1-thIY3q-IF5Cd3sRmeNuC7-o-07nnzokBnjYGnVblsXaeuSjEQG7qh5zQVP8JaQkP-FdGhaEAEGxdOCGjqRUMVGGzp1IRvceV3l2eJysj-V-JWgZGTmDh3nEboJyOZuJLu0bJ6N5XxFN7gOEZjL_0Uvru8M8_Lf47uz305ZST_5-aEGF9bPHjMao4YvZQPpTE2IjAEWbHu0W0XoNDzv3ALs04kD0Jzo-l0sWT1Hbhaehgjl0jdEwybchDqt_sCta2jd";
const TREE_OAK     = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1100&q=85&auto=format&fit=crop";
const TREE_FOREST  = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1100&q=85&auto=format&fit=crop";
const TREE_PATH    = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1100&q=85&auto=format&fit=crop";
const TREE_FIELD   = "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1100&q=85&auto=format&fit=crop";
const TREE_LOGS    = "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1100&q=85&auto=format&fit=crop";
const TREE_LEAVES  = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1100&q=85&auto=format&fit=crop";
const TREE_HEDGE   = "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1100&q=85&auto=format&fit=crop";

const RECENT_WORK = [
  {
    plate: 'Plate · 01',
    title: 'Crown reduction · Mature oak',
    meta: 'Rathmines · 6 hr · 2-person crew',
    src: HERO_ARBORIST,
    alt: 'Climbing arborist mid-canopy on a mature oak — Rathmines crown reduction',
    width: 'w-72',
    aspect: 'aspect-[4/5]',
  },
  {
    plate: 'Plate · 02',
    title: 'Boundary hedge · 42 m',
    meta: 'Ranelagh · 1 day · 3-person crew',
    src: TREE_HEDGE,
    alt: 'Long boundary hedge mid-trim — battery shears finishing the editorial face',
    width: 'w-80',
    aspect: 'aspect-[4/3]',
  },
  {
    plate: 'Plate · 03',
    title: 'Sycamore stump grind',
    meta: 'Drumcondra · 3 hr · 1-person crew',
    src: TREE_LOGS,
    alt: 'Cut sycamore rounds stacked beside the stump — grind finishing in Drumcondra',
    width: 'w-72',
    aspect: 'aspect-[4/5]',
  },
  {
    plate: 'Plate · 04 — Emergency',
    title: 'Storm ash · failed limb',
    meta: 'Glasnevin · 2 hr · 24h call-out',
    src: TREE_OAK,
    alt: 'Storm-damaged ash limb cleared — emergency call-out, Glasnevin',
    width: 'w-96',
    aspect: 'aspect-[16/10]',
  },
  {
    plate: 'Plate · 05',
    title: 'Garden clearance · 90 m²',
    meta: 'Phibsboro · 1.5 days · 4-person crew',
    src: TREE_FIELD,
    alt: 'Cleared garden after a 90 m² overgrowth removal — Phibsboro back garden',
    width: 'w-72',
    aspect: 'aspect-[3/4]',
  },
  {
    plate: 'Plate · 06',
    title: 'Beech dead-wooding',
    meta: 'Sandymount · 5 hr · 2-person crew',
    src: TREE_LEAVES,
    alt: 'Beech canopy mid-dead-wooding — Sandymount residential lane',
    width: 'w-80',
    aspect: 'aspect-[4/3]',
  },
  {
    plate: 'Plate · 07',
    title: 'Hedgerow planting · 24 m',
    meta: 'Clontarf · 1 day · 2-person crew',
    src: TREE_FOREST,
    alt: 'Mature trees along the Clontarf hedgerow — newly planted reinforcement',
    width: 'w-72',
    aspect: 'aspect-[4/5]',
  },
  {
    plate: 'Plate · 08',
    title: 'Estate walk-through',
    meta: 'Howth · 4 hr · 5-year client',
    src: TREE_PATH,
    alt: 'Estate walk-through path under the canopy — Howth, 5-year client',
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
    image: TREE_HEDGE,
    alt: 'Long boundary hedge mid-trim — battery shears finishing the editorial face',
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
    image: TREE_OAK,
    alt: 'Storm-damaged beech limb being safely lowered to the ground after make-safe',
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
    image: TREE_OAK,
    alt: 'Mature urban tree on the day of the site survey — first photo of the job log',
  },
  {
    status: 'done',
    label: 'Step 02 · Day 2–3',
    title: 'Quote & method',
    body: 'Itemised quote, BS 3998 method statement, RAMS document and proof of insurance.',
    icon: 'description',
    image: TREE_LOGS,
    alt: 'Cut log stack at the yard — method statement scoped against the volume',
  },
  {
    status: 'current',
    label: 'Step 03 · Day 5–14',
    title: 'Crew on site',
    body: 'Two- to four-person crew, dedicated job lead. Neighbours notified the evening before.',
    icon: null,
    image: HERO_ARBORIST,
    alt: 'Climbing arborist on the rope with the crew working below — Dublin garden in mid-job',
  },
  {
    status: 'upcoming',
    label: 'Step 04 · Same day',
    title: 'Clear & finish',
    body: 'Green waste chipped on site, hard-surface power-washed, ground left tidier than we found it.',
    icon: 'construction',
    image: TREE_LEAVES,
    alt: 'Cleared canopy at end of day — green waste chipped, hard surface power-washed',
  },
  {
    status: 'upcoming',
    label: 'Step 05 · Sign-off',
    title: 'Walk-through',
    body: 'After-photos, written care plan and 6-month follow-up note diarised the same evening.',
    icon: 'task_alt',
    image: TREE_FIELD,
    alt: 'Final garden after sign-off — quiet space, written care plan in the inbox',
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
    image: 'https://images.unsplash.com/photo-1767175620484-1ed37931a0d1?w=900&q=85&auto=format&fit=crop',
    alt: 'Liam Doyle, lead climbing arborist',
    chip: { label: 'Lead', bg: 'bg-[#F9D648]', text: 'text-primary-container' },
  },
  {
    name: 'Aoife Ní Bhriain',
    role: 'Ground-crew lead · 9 yrs',
    cert: 'Chipper-op certified · LANTRA-trained',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85&auto=format&fit=crop',
    alt: 'Aoife Ní Bhriain, ground crew lead',
    chip: null,
  },
  {
    name: 'Daragh Murphy',
    role: 'Hedge architect · 11 yrs',
    cert: 'Specialist in heritage yew & box',
    image: 'https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?w=900&q=85&auto=format&fit=crop',
    alt: 'Daragh Murphy, hedge architect',
    chip: null,
  },
  {
    name: 'Niamh Kelly',
    role: 'Surveys & scheduling · 7 yrs',
    cert: 'Your first call · TPO paperwork',
    image: 'https://images.unsplash.com/photo-1762341124796-530c0085f7d8?w=900&q=85&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=85&auto=format&fit=crop',
    alt: "Maeve O'Connor portrait",
  },
  {
    featured: true,
    body: "A 50-metre boundary hedge that hadn't been touched in eight years. Daragh restored a clean editorial line in two days — neighbours have asked us who did it.",
    name: 'Cormac Walsh',
    meta: 'Sandymount · Hedge restoration · 2024',
    image: 'https://images.unsplash.com/photo-1776275758873-31603dd06112?w=300&q=85&auto=format&fit=crop',
    alt: 'Cormac Walsh portrait',
  },
  {
    featured: false,
    body: 'A protected oak with a bark wound and rot pocket. Niamh handled the council paperwork; the crew did a careful crown reduction. Three years on, the canopy looks fuller than ever.',
    name: 'Sinead Reilly',
    meta: 'Rathmines · TPO oak · 2021',
    image: 'https://images.unsplash.com/photo-1776275758873-31603dd06112?w=300&q=85&auto=format&fit=crop',
    alt: 'Sinead Reilly portrait',
  },
];

// Featured-in / audited-by row — real consumer-facing brand marks via simpleicons.org CDN.
// Hex 2c4a3e matches the primary-container token so icons read as muted forest green.
const FEATURED_BRANDS = [
  { name: "Yelp",         slug: "yelp",         sub: "Local listings" },
  { name: "Trustpilot",   slug: "trustpilot",   sub: "Reviews" },
  { name: "Google",       slug: "google",       sub: "Business" },
  { name: "The Guardian", slug: "theguardian",  sub: "Local Press" },
];

// Sustainability Commitment — 4-card premium section between Crew and Testimonials.
// Each card: inline SVG icon (line 1.5, 24×24, currentColor), tag, title, body, footnote.
const SUSTAINABILITY = [
  {
    tag: "Compact · I",
    title: "FSC-certified disposal",
    body: "Every load of green waste tracked to the Bord na Móna composting facility in Kildare. Larger logs split, seasoned twelve months, and donated to the firewood programme.",
    foot: "30 m³ donated per year",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />,
  },
  {
    tag: "Compact · II",
    title: "Wildlife-first pruning",
    body: "No major work between March and August unless a tree is structurally unsafe — we delay non-urgent jobs across nesting season. Birds run the calendar in spring.",
    foot: "Mar — Aug · nesting protocol",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />,
  },
  {
    tag: "Compact · III",
    title: "Heritage tree register",
    body: "Every protected oak, lime and beech we encounter is logged into our internal heritage register. We share the dataset annually with the Tree Council of Ireland — open data, no fee.",
    foot: "412 trees in the register",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />,
  },
  {
    tag: "Compact · IV",
    title: "Local apprenticeship",
    body: "One paid apprentice hour funded by every job we ship. Currently four apprentices on the books — three Irish, one Ukrainian. NPTC-track training inside two years.",
    foot: "4 apprentices in training",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />,
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

        {/* Featured-in / audited-by row — real brand marks via simpleicons.org CDN. */}
        <section className="max-w-container-max mx-auto px-gutter pt-lg pb-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-md">
            <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-primary-container/70 shrink-0">— Audited &amp; reviewed by</span>
            <div className="flex flex-wrap items-center gap-x-lg gap-y-md md:flex-1 md:justify-end">
              {FEATURED_BRANDS.map((b) => (
                <span key={b.slug} className="group inline-flex items-center gap-3 text-primary-container/80 hover:text-primary-container transition-colors">
                  <img src={`https://cdn.simpleicons.org/${b.slug}/2c4a3e`} alt={`${b.name} logo`} width="22" height="22" loading="lazy" decoding="async" className="w-5 h-5 md:w-6 md:h-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="flex flex-col leading-tight">
                    <span className="font-display-md text-base md:text-lg tracking-tight">{b.name}</span>
                    <span className="font-caption text-[10px] uppercase tracking-widest text-on-surface-variant">{b.sub}</span>
                  </span>
                </span>
              ))}
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
              {/* Solid connector line spanning circle 1 center to circle 5 center.
                  Each circle is w-14 (56px) at the LEFT of its grid column; left-7 +
                  right-[18%] anchors the line to circle centers. Solid bg-primary-container/40
                  (no gradient fade) so the strip reads continuous through every step. */}
              <div aria-hidden="true" className="hidden md:block absolute top-7 left-7 right-[18%] h-px bg-primary-container/40"></div>
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

        {/* Sustainability Compact — 4-card premium section between Crew and Testimonials.
            Each card has an inline SVG icon, Roman tag, title, body, and footer metric. */}
        <section className="full-bleed py-xl overflow-hidden bg-primary-container text-[#EBE2C9] border-y border-[#F9D648]/15">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="flex items-end justify-between gap-md flex-wrap mb-lg pb-md border-b border-[#EBE2C9]/15">
              <div className="max-w-xl">
                <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-[#F9D648]">— VII · Sustainability Compact</span>
                <h2 className="font-display-md text-display-md text-[#EBE2C9] mt-xs">Four compacts every job ships with</h2>
              </div>
              <p className="font-body-md text-body-md text-[#EBE2C9]/70 max-w-md">Sealed when we walk on site. Audited annually with the Tree Council of Ireland and posted to our public ledger every spring.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {SUSTAINABILITY.map((c) => (
                <article key={c.tag} className="bg-[#EBE2C9]/[0.04] border border-[#EBE2C9]/15 rounded-xl p-lg flex flex-col gap-sm hover:bg-[#EBE2C9]/[0.08] hover:border-[#F9D648]/40 transition-colors min-h-[260px]">
                  <div className="flex items-center justify-between mb-xs">
                    <span className="w-12 h-12 border border-[#EBE2C9]/30 flex items-center justify-center text-[#F9D648] rounded-lg">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{c.icon}</svg>
                    </span>
                    <span className="font-label-bold text-label-bold uppercase tracking-[0.2em] text-[#EBE2C9]/60 tabular-nums">{c.tag}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-[#EBE2C9]">{c.title}</h3>
                  <p className="font-body-md text-body-md text-[#EBE2C9]/75 leading-relaxed">{c.body}</p>
                  <div className="mt-auto pt-md border-t border-[#EBE2C9]/15 flex items-center justify-between">
                    <span className="font-label-bold text-label-bold uppercase tracking-[0.18em] text-[#F9D648]">{c.foot}</span>
                    <span className="font-caption text-caption uppercase tracking-widest text-[#EBE2C9]/40">In effect</span>
                  </div>
                </article>
              ))}
            </div>
            <p className="text-center mt-lg font-label-bold text-label-bold uppercase tracking-[0.2em] text-[#EBE2C9]/50">Audited 2024 by the Tree Council of Ireland · Public ledger published each spring</p>
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
