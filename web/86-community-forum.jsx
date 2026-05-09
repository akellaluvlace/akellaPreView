export default function T86CommunityForum() {
  const navLinks = ["Channels", "Members", "Events", "About"];

  const avatars = [
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-pLS3e1j-bjqHvw5OXZBP4IB_vczrq7BStevA3hVYVR2LU33D0eJtp8J-wxXkXWE9deOcN2sFRLyw-ROeUfiKlzfN7XUb2HUBpplSrBq2F3YZ8z7g0zfmQpY9nJ8VSPdNVTtSy4MMQT94wwS2MMWKIZWTgtLIW8wkJ-eeZLotNzWTQCgh1NqHxWiiqdf4JlVBkNR_hQKb-XvJLZcCyOxQ0Ag04RQMc2wrXX8szUJiNd4Z0wWnd9-APuK5TtQK6PctMVw1ndRycMFA", alt: "Portrait of a young indie musician holding a guitar in a cozy studio setting", z: "z-0" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7UP9ounZD9-m_qrPLiHyidWqDvslTh9rJW6Du2K-8wCcxLpWYH1FUWTn-rUTDFS4PD0-T53R4_QmIllZB4gVcjRYA6vu14_gEojF_ywgJCjzCrCq1bx97h9VYxShLrwQJ2ai0nej76F1W_ZzJqHOzfVXJV8UdcIlhKXvzu7nLD9bt5GOSAv3YiLHZFk8HhaDZvk9tvMorz8J34QCB0OF_QTBH07gH0B0pqhLhj_FBniTGyuFbQB4-HXGc03JKLFwYr1pSBVXgGZR", alt: "Female producer at a mixing desk with soft warm lighting", z: "z-[1]" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsA6AYPllkL6C2wkCertY73FXOvnB5w6X38HLOtJyWvy2tw40jw075AJ71tiiyFTs1lr9CULstAMG-JWdTGn-XM2KgW1_FhyBL2TN5aPbPefePVa2YV04798Pxl3tzr2KCoOE1AxdRfIzptOWDFM4QSeFRo8KCnnDW8qsuuppQL00Ov22ObqP1ad6DjC2hKzc7tWYO1_yuuQz06s95g1uj3CiQW7TnQzdGuO3MJt2OBylOlC0D0uXLDbp6u4ETkW8gC9GdXJ0w22lX", alt: "Drummer mid-performance with stage lighting", z: "z-[2]" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDN2QJapphWwEYTDqSnzVw7__I9-67xJv_FO_6dGWijikNw6GIGeRtPRqqdYqoHNb66oK4M6afBLu7MLup133mV3luOfXJ6YevRLOV58JxR2f8gFZvuTElgjuHydCx5Axl4AwL_OrEPS3k3Vc15VUkG9grkAOAbo7ch6af-WEC-k64xLyg4DziVthrozf3BU73KN27y8yVcr2qPJNzTibWXPnueyB1Xg7GFlsNC5IU7vZszXWWCpBJ-aSi8ssdG6pymQGZq-lZ815gx", alt: "Singer-songwriter with acoustic guitar in a sunlit room", z: "z-[3]" },
  ];

  const channels = [
    { icon: "graphic_eq", iconBg: "bg-primary text-on-primary",                              tag: "High traffic",  tagCls: "text-secondary bg-secondary-fixed",                title: "Mixing & Mastering", body: "Critique threads on works-in-progress. Reference tracks, plugin chains, low-end advice.",        members: "412 members", lastDot: "bg-secondary",         last: "2 min ago" },
    { icon: "edit_note",  iconBg: "bg-secondary text-on-secondary",                          tag: "Weekly prompt", tagCls: "text-tertiary bg-tertiary-fixed",                  title: "Songwriting",        body: "Lyric workshops, melody clinics, and a gentle Sunday prompt that's been running for 38 weeks.", members: "298 members", lastDot: "bg-secondary",         last: "14 min ago" },
    { icon: "tune",       iconBg: "bg-tertiary text-on-tertiary",                            tag: "Always on",     tagCls: "text-on-surface-variant bg-surface-container",     title: "Gear Talk",          body: "Tape vs digital, $40 mic shoot-outs, and the eternal debate about Yamaha NS-10s.",              members: "521 members", lastDot: "bg-secondary",         last: "47 min ago" },
    { icon: "album",      iconBg: "bg-primary-container text-primary-fixed",                 tag: "Release week",  tagCls: "text-on-surface-variant bg-surface-container",     title: "Releases",           body: "Roll-out playbooks, distro deals, and members listening to each other's first-week numbers.",   members: "186 members", lastDot: "bg-secondary",         last: "1 hr ago" },
    { icon: "groups",     iconBg: "bg-secondary-container text-on-secondary-container",      tag: "Open call",     tagCls: "text-on-surface-variant bg-surface-container",     title: "Collaborations",     body: "Looking-for-a-vocalist threads, beat-trade marketplace, and split-sheet templates.",            members: "340 members", lastDot: "bg-secondary",         last: "3 hr ago" },
    { icon: "stage",      iconBg: "bg-tertiary-fixed-dim text-on-tertiary-fixed",            tag: "Quieter",       tagCls: "text-on-surface-variant bg-surface-container",     title: "Live Shows",         body: "Tour-route swaps, venue notes, and the room-share spreadsheet for under-200-cap rooms.",        members: "154 members", lastDot: "bg-on-surface-variant/50", last: "Yesterday" },
  ];

  const spotlights = [
    { num: "No. 01", chip: "bg-tertiary-fixed text-on-tertiary-fixed",          name: "Iris Halberg",   meta: "Folk · Stockholm",   src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-pLS3e1j-bjqHvw5OXZBP4IB_vczrq7BStevA3hVYVR2LU33D0eJtp8J-wxXkXWE9deOcN2sFRLyw-ROeUfiKlzfN7XUb2HUBpplSrBq2F3YZ8z7g0zfmQpY9nJ8VSPdNVTtSy4MMQT94wwS2MMWKIZWTgtLIW8wkJ-eeZLotNzWTQCgh1NqHxWiiqdf4JlVBkNR_hQKb-XvJLZcCyOxQ0Ag04RQMc2wrXX8szUJiNd4Z0wWnd9-APuK5TtQK6PctMVw1ndRycMFA", alt: "Portrait of a young indie musician holding a guitar in a cozy studio setting", flip: "" },
    { num: "No. 02", chip: "bg-secondary-container text-on-secondary-container", name: "Maya Chen",      meta: "Producer · Brooklyn", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7UP9ounZD9-m_qrPLiHyidWqDvslTh9rJW6Du2K-8wCcxLpWYH1FUWTn-rUTDFS4PD0-T53R4_QmIllZB4gVcjRYA6vu14_gEojF_ywgJCjzCrCq1bx97h9VYxShLrwQJ2ai0nej76F1W_ZzJqHOzfVXJV8UdcIlhKXvzu7nLD9bt5GOSAv3YiLHZFk8HhaDZvk9tvMorz8J34QCB0OF_QTBH07gH0B0pqhLhj_FBniTGyuFbQB4-HXGc03JKLFwYr1pSBVXgGZR", alt: "Female producer at a mixing desk with soft warm lighting", flip: "" },
    { num: "No. 03", chip: "bg-primary-fixed text-on-primary-fixed",            name: "Theo Okafor",    meta: "Drums · Lagos",       src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsA6AYPllkL6C2wkCertY73FXOvnB5w6X38HLOtJyWvy2tw40jw075AJ71tiiyFTs1lr9CULstAMG-JWdTGn-XM2KgW1_FhyBL2TN5aPbPefePVa2YV04798Pxl3tzr2KCoOE1AxdRfIzptOWDFM4QSeFRo8KCnnDW8qsuuppQL00Ov22ObqP1ad6DjC2hKzc7tWYO1_yuuQz06s95g1uj3CiQW7TnQzdGuO3MJt2OBylOlC0D0uXLDbp6u4ETkW8gC9GdXJ0w22lX", alt: "Drummer mid-performance with stage lighting", flip: "" },
    { num: "No. 04", chip: "bg-tertiary-fixed text-on-tertiary-fixed",          name: "Saoirse Daly",   meta: "Singer · Galway",     src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDN2QJapphWwEYTDqSnzVw7__I9-67xJv_FO_6dGWijikNw6GIGeRtPRqqdYqoHNb66oK4M6afBLu7MLup133mV3luOfXJ6YevRLOV58JxR2f8gFZvuTElgjuHydCx5Axl4AwL_OrEPS3k3Vc15VUkG9grkAOAbo7ch6af-WEC-k64xLyg4DziVthrozf3BU73KN27y8yVcr2qPJNzTibWXPnueyB1Xg7GFlsNC5IU7vZszXWWCpBJ-aSi8ssdG6pymQGZq-lZ815gx", alt: "Singer-songwriter with acoustic guitar in a sunlit room", flip: "" },
    { num: "No. 05", chip: "bg-secondary-container text-on-secondary-container", name: "Andre Solano",   meta: "Bass · Lima",         src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-pLS3e1j-bjqHvw5OXZBP4IB_vczrq7BStevA3hVYVR2LU33D0eJtp8J-wxXkXWE9deOcN2sFRLyw-ROeUfiKlzfN7XUb2HUBpplSrBq2F3YZ8z7g0zfmQpY9nJ8VSPdNVTtSy4MMQT94wwS2MMWKIZWTgtLIW8wkJ-eeZLotNzWTQCgh1NqHxWiiqdf4JlVBkNR_hQKb-XvJLZcCyOxQ0Ag04RQMc2wrXX8szUJiNd4Z0wWnd9-APuK5TtQK6PctMVw1ndRycMFA", alt: "Portrait of a young indie musician holding a guitar in a cozy studio setting", flip: " -scale-x-100" },
  ];

  const events = [
    { mo: "May", day: "14", tag: "Live · Zoom",   tagCls: "text-secondary bg-secondary-fixed",                  title: "Mix Critique Night",         body: "Bring an unfinished mix. Six members get 8 minutes each with the room. Hosted by Maya Chen.",       footL: "19:00 · CET", footR: "RSVP open",       footRCls: "text-secondary" },
    { mo: "May", day: "21", tag: "Async · Sun",   tagCls: "text-on-surface-variant bg-surface-container",       title: "Sunday Songwriting Prompt",  body: "Two-line prompt drops at 09:00. Members post a 60-second voice memo by Wednesday. Week 39.",        footL: "All week",    footR: "Channel: Songwriting", footRCls: "" },
    { mo: "Jun", day: "04", tag: "Workshop",      tagCls: "text-secondary bg-secondary-fixed",                  title: "Distro 101 with Saoirse",    body: "Practical Q&A on cutting deals with the major DSPs without losing your soul or your splits.",       footL: "17:00 · GMT", footR: "12 / 30 spots",   footRCls: "text-secondary" },
    { mo: "Jun", day: "22", tag: "In person",     tagCls: "text-on-surface-variant bg-surface-container",       title: "Members' Night · Berlin",    body: "Four members on the bill at a 120-cap room in Neukölln. Drinks before, low-key after.",            footL: "21:00 · CET", footR: "€8 · members free", footRCls: "" },
  ];

  const principles = [
    { rule: "border-tertiary-fixed",    title: "Vouch to enter.", body: "Every member is sponsored by an existing one. Spam doesn't have a route in." },
    { rule: "border-secondary-container", title: "No public posts.", body: "Nothing here is indexed. There is no profile to optimise. There is no follower count to chase." },
    { rule: "border-primary-fixed-dim", title: "One subscription.", body: "$19/mo, no tiers, no upsells. Pays for the events, the moderation, and exactly one full-time human." },
  ];

  const trustedLogos = [
    { slug: "notion", name: "Notion" },
    { slug: "discord", name: "Discord" },
    { slug: "figma", name: "Figma" },
    { slug: "framer", name: "Framer" },
    { slug: "webflow", name: "Webflow" },
    { slug: "intercom", name: "Intercom" },
    { slug: "linear", name: "Linear" },
    { slug: "substack", name: "Substack" },
  ];

  const pillars = [
    { numeral: "I.",   icon: "verified",       title: "Quality threads, by design.",                  body: "Every thread starts with a stake — a question, a draft, a problem worth fifteen minutes. Replies that aren't useful get folded under a \"more\" tab. The signal stays loud because the noise has nowhere to live.", meta: "Curated daily",          featured: true  },
    { numeral: "II.",  icon: "shield",         title: "No-noise policy, signed at the door.",         body: "No \"first!\" replies. No screenshot dunks. No outrage threads about other forums. The four-line code-of-conduct is short on purpose — every member ticks it on the way in and three moderators read every flag.", meta: "3 strikes · 0 saved",     featured: false },
    { numeral: "III.", icon: "support_agent",  title: "Senior moderators, paid.",                     body: "Three people are paid to read every thread on a rotating schedule — a working producer, a touring drummer, a label A&R. They reply to feedback within the day and they vote on every member who applies.",  meta: "Mods on call · 09—21 GMT", featured: false },
    { numeral: "IV.",  icon: "psychology",     title: "Real-name optional, vouching mandatory.",      body: "Pick any handle you like. The only thing required is a vouch from a member already inside, and a single line on what you're working on. Anonymity is fine. Hiding the work isn't — that's how trust gets built.", meta: "1 vouch · 1 line · entry", featured: false },
  ];

  const footerLinks = ["Privacy", "Terms", "Support", "Contact"];

  const tailwindConfig = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "tertiary-container": "#c6a847", "tertiary-fixed": "#ffe084", "secondary-fixed-dim": "#ffb4a3",
            "surface-variant": "#e2e3e0", "primary": "#013626", "surface-container": "#edeeeb",
            "surface": "#f9faf6", "tertiary": "#735c00", "on-tertiary-fixed": "#231b00",
            "secondary-fixed": "#ffdad2", "error-container": "#ffdad6", "on-primary-fixed-variant": "#204f3d",
            "on-primary": "#ffffff", "on-error-container": "#93000a", "surface-bright": "#f9faf6",
            "outline-variant": "#c0c9c2", "surface-container-high": "#e7e8e5", "on-tertiary": "#ffffff",
            "secondary-container": "#fe876c", "on-surface": "#1a1c1a", "surface-container-lowest": "#ffffff",
            "inverse-surface": "#2e312f", "primary-container": "#1e4d3b", "outline": "#717974",
            "on-secondary-container": "#73200d", "primary-fixed-dim": "#a0d1b9", "on-surface-variant": "#414944",
            "on-secondary-fixed-variant": "#802915", "on-secondary-fixed": "#3d0600", "inverse-on-surface": "#f0f1ee",
            "surface-container-highest": "#e2e3e0", "surface-tint": "#396754", "on-tertiary-fixed-variant": "#574500",
            "secondary": "#a0402a", "inverse-primary": "#a0d1b9", "primary-fixed": "#bbeed5",
            "surface-container-low": "#f3f4f1", "surface-dim": "#d9dad7", "on-tertiary-container": "#4e3d00",
            "on-background": "#1a1c1a", "on-secondary": "#ffffff", "on-primary-fixed": "#002115",
            "background": "#f9faf6", "tertiary-fixed-dim": "#e4c45f", "on-error": "#ffffff",
            "on-primary-container": "#8cbda6", "error": "#ba1a1a"
          },
          borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
          spacing: { "stack-sm": "12px", "margin-page": "40px", "stack-lg": "48px", "gutter": "24px", "stack-md": "24px", "unit": "8px", "container-max": "1280px" },
          fontFamily: {
            "body-md": ["Inter", "sans-serif"], "h2": ["Plus Jakarta Sans", "sans-serif"],
            "h1": ["Plus Jakarta Sans", "sans-serif"], "h3": ["Plus Jakarta Sans", "sans-serif"],
            "body-lg": ["Inter", "sans-serif"], "label-caps": ["Inter", "sans-serif"]
          },
          fontSize: {
            "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
            "h2": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
            "h1": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
            "h3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
            "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
            "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700" }]
          }
        }
      }
    }
  `;

  const styles = `
    ::selection { background-color: #bbeed5; color: #002115; }
    .dark ::selection { background-color: #1e4d3b; color: #bbeed5; }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto !important; }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    h1, h2, h3, h4, h5, h6 { text-wrap: balance; }
    p { text-wrap: pretty; }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;
    }
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="light scroll-smooth bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col pt-20">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 z-[60] bg-primary text-on-primary px-6 py-3 rounded-full font-medium shadow-lg outline-none ring-2 ring-primary ring-offset-2 ring-offset-background transition-all">
          Skip to main content
        </a>

        <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-900/5 dark:border-emerald-100/10 shadow-[0_4px_20px_-10px_rgba(30,77,59,0.08)] bg-[#fdfcf8]/80 dark:bg-emerald-950/80 backdrop-blur-md">
          <nav aria-label="Main Navigation" className="max-w-[1440px] mx-auto flex justify-between items-center px-4 md:px-8 h-20">
            <div className="flex items-center gap-4">
              <button aria-label="Open Mobile Menu" aria-expanded="false" className="md:hidden flex items-center justify-center text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50/50 dark:hover:bg-emerald-800/30 transition-all duration-300 p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95">
                <span className="material-symbols-outlined" aria-hidden="true">menu</span>
              </button>
              <a href="/" aria-label="The Green Room Home" className="text-xl md:text-2xl font-bold tracking-tighter text-emerald-900 dark:text-emerald-50 font-h2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-shadow">
                The Green Room
              </a>
            </div>

            <div className="hidden md:flex space-x-6 font-['Plus_Jakarta_Sans'] font-medium text-sm tracking-tight">
              {navLinks.map(label => (
                <a key={label} href="#" className="text-emerald-800/70 dark:text-emerald-100/70 hover:text-emerald-900 dark:hover:text-emerald-50 transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-800/30 duration-300 px-3 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{label}</a>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button aria-label="Notifications" className="hidden sm:flex items-center justify-center text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50/50 dark:hover:bg-emerald-800/30 transition-all duration-300 p-2 rounded-full active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
              </button>
              <button aria-label="Account Menu" className="hidden sm:flex items-center justify-center text-emerald-900 dark:text-emerald-50 hover:bg-emerald-50/50 dark:hover:bg-emerald-800/30 transition-all duration-300 p-2 rounded-full active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="material-symbols-outlined" aria-hidden="true">account_circle</span>
              </button>
              <button className="bg-primary text-on-primary px-5 md:px-6 py-2.5 rounded-full font-label-caps uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95 duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfcf8]">
                Join
              </button>
            </div>
          </nav>
        </header>

        <main id="main-content" className="flex-grow flex flex-col items-center w-full scroll-mt-20">
          <section aria-labelledby="hero-title" className="w-full max-w-container-max mx-auto px-4 md:px-8 py-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
            <span className="inline-flex items-center justify-center bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1.5 rounded-full font-label-caps mb-6 md:mb-8 uppercase tracking-widest shadow-sm">
              Est. 2024
            </span>

            <h1 id="hero-title" className="font-h1 text-[clamp(2.5rem,5vw,3rem)] md:text-h1 leading-tight text-primary max-w-4xl mb-stack-md text-balance">
              A private community for indie musicians
            </h1>

            <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant max-w-[65ch] mb-stack-lg text-pretty">
              Connect with producers, share mixes, find collaborators, and build your career alongside 1,200+ dedicated independent artists.
            </p>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 mb-16 justify-center items-center">
              <button className="w-full sm:w-auto bg-secondary-container text-on-secondary-container px-8 py-4 rounded-full font-h3 text-lg hover:bg-secondary hover:text-on-secondary transition-all shadow-sm hover:shadow-md active:scale-95 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background tabular-nums">
                Join for $19/mo
              </button>
              <button className="w-full sm:w-auto bg-surface text-primary border border-outline-variant px-8 py-4 rounded-full font-h3 text-lg hover:bg-surface-variant transition-colors active:scale-95 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                See what's inside
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex -space-x-4 p-2 relative">
                {avatars.map(a => (
                  <img key={a.src} alt={a.alt} width="48" height="48" loading="lazy" decoding="async"
                    className={`w-12 h-12 rounded-full border-2 border-surface object-cover shadow-sm relative transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:z-30 ${a.z}`}
                    src={a.src} />
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center font-label-caps text-on-surface-variant shadow-sm z-10 relative tabular-nums select-none">
                  +1.2k
                </div>
              </div>
              <p className="font-body-md text-on-surface-variant text-sm md:text-base tabular-nums">Join 1,240 active members</p>
            </div>
          </section>

          {/* Channels — full-bleed mint */}
          <section aria-labelledby="channels-title" className="w-full py-20 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#bbeed5" }}>
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <span className="font-label-caps uppercase tracking-widest text-primary mb-3 inline-block">[ Channels · 06 ]</span>
                  <h2 id="channels-title" className="font-h1 text-h2 md:text-h1 text-primary mb-2 text-balance">Six rooms. One quiet door.</h2>
                </div>
                <p className="font-body-md text-on-primary-fixed-variant max-w-md md:text-right">Every channel is invite-and-vouch. Members trade work, not noise. Last-active stamps refresh on the minute.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {channels.map(c => (
                  <article key={c.title} className="bg-surface rounded-xl p-6 shadow-[0_4px_20px_-10px_rgba(1,54,38,0.18)] hover:shadow-[0_8px_30px_-10px_rgba(1,54,38,0.25)] hover:-translate-y-1 transition-all flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.iconBg}`}><span className="material-symbols-outlined">{c.icon}</span></div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${c.tagCls}`}>{c.tag}</span>
                    </div>
                    <h3 className="font-h3 text-h3 text-primary mb-2">{c.title}</h3>
                    <p className="font-body-md text-on-surface-variant text-sm mb-5 flex-grow">{c.body}</p>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant pt-4 border-t border-outline-variant">
                      <span className="tabular-nums">{c.members}</span>
                      <span className="flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${c.lastDot}`}></span> {c.last}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Trusted by — surface tone, between Channels and Spotlight */}
          <section aria-labelledby="trusted-title" className="w-full py-20 md:py-24 px-4 md:px-8 bg-surface">
            <div className="max-w-container-max mx-auto">
              <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                <span className="font-label-caps uppercase tracking-widest text-secondary block mb-8 md:mb-10">— Members at</span>
                <h2 id="trusted-title" className="font-h1 text-h2 md:text-h1 text-primary text-balance mb-4">A community of 12,000+ builders.</h2>
                <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">Members ship at companies you've heard of and ones you haven't. The good ones don't lead with the logo.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-8 items-center justify-items-center">
                {trustedLogos.map(b => (
                  <img key={b.slug} src={`https://cdn.simpleicons.org/${b.slug}/013626`} alt={b.name} loading="lazy" className="h-7 md:h-8 opacity-70 hover:opacity-100 transition-opacity" />
                ))}
              </div>
              <p className="text-center font-label-caps uppercase tracking-widest text-on-surface-variant mt-12 text-[11px] tabular-nums">+ 240 active threads · 47 host servers · MMXXII — present</p>
            </div>
          </section>

          {/* Member Spotlight — full-bleed deep emerald (image strip) */}
          <section aria-labelledby="spotlight-title" className="w-full py-20 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#1e4d3b", backgroundImage: "radial-gradient(circle at 15% 20%, rgba(187,238,213,0.08), transparent 40%), radial-gradient(circle at 85% 80%, rgba(254,135,108,0.08), transparent 45%)" }}>
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <span className="font-label-caps uppercase tracking-widest text-tertiary-fixed mb-3 inline-block">[ Member Spotlight · Vol. 14 ]</span>
                  <h2 id="spotlight-title" className="font-h1 text-h2 md:text-h1 text-on-primary mb-2 text-balance">Five members worth knowing.</h2>
                </div>
                <p className="font-body-md text-primary-fixed-dim max-w-md md:text-right">Featured weekly. The kind of folks who reply to your demo within an hour and have a good reason for the snare being too loud.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {spotlights.map(s => (
                  <figure key={s.name} className="group relative rounded-xl overflow-hidden bg-primary aspect-[3/4]">
                    <img alt={s.alt} className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500${s.flip}`} src={s.src} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                    <span className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${s.chip}`}>{s.num}</span>
                    <figcaption className="absolute bottom-4 left-4 right-4 text-on-primary">
                      <p className="font-h3 font-bold text-base leading-tight">{s.name}</p>
                      <p className="text-[11px] uppercase tracking-widest text-primary-fixed-dim mt-1">{s.meta}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="text-center font-label-caps uppercase tracking-widest text-primary-fixed-dim mt-10 text-[11px]">Photographs · Member portraits · Vol. 14, May 2026</p>
            </div>
          </section>

          {/* Premium 2x2 — Why members stay */}
          <section aria-labelledby="premium-title" className="w-full py-20 md:py-28 px-4 md:px-8 bg-surface-container-low">
            <div className="max-w-container-max mx-auto">
              <div className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
                <span className="font-label-caps uppercase tracking-widest text-secondary block mb-8 md:mb-10">[ Why members stay · 04 pillars ]</span>
                <h2 id="premium-title" className="font-h1 text-h2 md:text-h1 text-primary text-balance mb-4">Built like a private kitchen.</h2>
                <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">Four pillars hold it up. Each one is the answer to a complaint we had about every other forum we ever loved and quit.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">
                {pillars.map(p => (
                  <article key={p.title} className={`relative bg-surface rounded-xl p-8 md:p-10 flex flex-col gap-5 group hover:-translate-y-1 transition-all duration-300 ${p.featured ? "ring-2 ring-primary shadow-[0_8px_30px_-12px_rgba(1,54,38,0.18)]" : "shadow-[0_4px_20px_-12px_rgba(1,54,38,0.15)] hover:shadow-[0_12px_30px_-12px_rgba(1,54,38,0.22)]"}`}>
                    {p.featured && <span className="absolute -top-3 right-6 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Lead pillar</span>}
                    <div className="flex items-start justify-between">
                      <span className="font-h1 italic text-3xl text-secondary tracking-tight">{p.numeral}</span>
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: "28px" }}>{p.icon}</span>
                    </div>
                    <h3 className="font-h3 text-2xl md:text-3xl text-primary leading-tight">{p.title}</h3>
                    <p className="font-body-md text-on-surface-variant text-sm md:text-base flex-grow">{p.body}</p>
                    <div className="pt-5 border-t border-outline-variant flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">{p.meta}</span>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Upcoming Events — full-bleed mustard */}
          <section aria-labelledby="events-title" className="w-full py-20 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#ffe084" }}>
            <div className="max-w-container-max mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <span className="font-label-caps uppercase tracking-widest text-on-tertiary-fixed mb-3 inline-block">[ Calendar · May–Jun 2026 ]</span>
                  <h2 id="events-title" className="font-h1 text-h2 md:text-h1 text-on-tertiary-fixed mb-2 text-balance">Four things on the calendar.</h2>
                </div>
                <p className="font-body-md text-on-tertiary-fixed/80 max-w-md md:text-right">All events run on community time. Recordings stay available for a month, then they're gone.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {events.map(e => (
                  <article key={e.title} className="bg-surface rounded-xl p-6 flex flex-col gap-4 shadow-[0_6px_20px_-10px_rgba(115,92,0,0.4)] hover:-translate-y-1 transition-transform">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 rounded-xl bg-on-tertiary-fixed text-tertiary-fixed flex flex-col items-center justify-center leading-none">
                        <span className="text-[10px] font-bold uppercase tracking-widest">{e.mo}</span>
                        <span className="font-h2 text-2xl font-bold tabular-nums">{e.day}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${e.tagCls}`}>{e.tag}</span>
                    </div>
                    <h3 className="font-h3 text-lg text-primary leading-tight">{e.title}</h3>
                    <p className="font-body-md text-on-surface-variant text-sm flex-grow">{e.body}</p>
                    <div className="pt-4 border-t border-outline-variant flex justify-between items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      <span className="tabular-nums">{e.footL}</span>
                      <span className={e.footRCls}>{e.footR}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Image + Content A: image LEFT, content RIGHT */}
          <section aria-labelledby="gather-title" className="w-full py-20 md:py-28 px-4 md:px-8 bg-surface">
            <div className="max-w-container-max mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
                <div className="md:col-span-7 aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-xl shadow-[0_12px_40px_-20px_rgba(1,54,38,0.35)]">
                  <img alt="A small collaborative workspace — laptop, notebook, hands gesturing mid-conversation" loading="lazy" decoding="async" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&q=80&auto=format&fit=crop" />
                </div>
                <div className="md:col-span-5 flex flex-col gap-5 justify-center">
                  <span className="font-label-caps uppercase tracking-widest text-secondary block mb-2">[ How it feels · 01 ]</span>
                  <h2 id="gather-title" className="font-h1 text-h2 md:text-[2.5rem] text-primary leading-tight text-balance">Where the builders gather.</h2>
                  <p className="font-body-md text-on-surface-variant">Most threads start with a half-finished thing. A track that's almost mixed. A song that doesn't land. A live set that's missing something. The room reads it, says the useful part, and goes back to its own work — the way a small studio share would, if it were honest about its blind spots.</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <button className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-caps uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95 duration-200 shadow-sm">Tour the channels</button>
                    <a href="#" className="text-secondary font-h3 text-sm hover:underline underline-offset-4 decoration-2">Read a thread sample &rarr;</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Image + Content B: image RIGHT, content LEFT (alternating) */}
          <section aria-labelledby="people-title" className="w-full py-20 md:py-28 px-4 md:px-8 bg-surface-container-low">
            <div className="max-w-container-max mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
                <div className="md:col-span-5 md:order-1 flex flex-col gap-5 justify-center">
                  <span className="font-label-caps uppercase tracking-widest text-secondary block mb-2">[ How it feels · 02 ]</span>
                  <h2 id="people-title" className="font-h1 text-h2 md:text-[2.5rem] text-primary leading-tight text-balance">Find your people. Quietly.</h2>
                  <p className="font-body-md text-on-surface-variant">Members come from twenty-eight countries and most of them never post on the open internet. The reason is the same in every interview we run — they wanted somewhere small enough to remember the names of the people they were talking to, and big enough that someone always had a useful answer.</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <button className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-caps uppercase tracking-widest hover:bg-primary-container transition-colors active:scale-95 duration-200 shadow-sm">Meet the members</button>
                    <a href="#" className="text-secondary font-h3 text-sm hover:underline underline-offset-4 decoration-2">Apply with one vouch &rarr;</a>
                  </div>
                </div>
                <div className="md:col-span-7 md:order-2 aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-xl shadow-[0_12px_40px_-20px_rgba(1,54,38,0.35)]">
                  <img alt="A community member portrait — soft natural light, contemplative posture" loading="lazy" decoding="async" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1776275758873-31603dd06112?w=1400&q=80&auto=format&fit=crop" />
                </div>
              </div>
            </div>
          </section>

          {/* Manifesto — full-bleed deep emerald */}
          <section aria-labelledby="manifesto-title" className="w-full py-24 md:py-32 px-4 md:px-8 relative overflow-hidden" style={{ backgroundColor: "#013626" }}>
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(254,135,108,0.15), transparent 40%), radial-gradient(circle at 15% 80%, rgba(187,238,213,0.1), transparent 50%)" }} />
            <div className="relative max-w-4xl mx-auto text-center">
              <span className="font-label-caps uppercase tracking-widest text-tertiary-fixed mb-6 inline-block">[ Manifesto · Founding letter ]</span>
              <h2 id="manifesto-title" className="font-h1 text-3xl md:text-5xl lg:text-6xl text-on-primary leading-tight text-balance mb-12">
                Why we built it like a private kitchen, <span className="italic text-secondary-container">not a stadium.</span>
              </h2>
              <blockquote className="text-lg md:text-xl text-primary-fixed-dim italic leading-relaxed max-w-3xl mx-auto mb-10 border-l-4 border-secondary-container pl-6 md:pl-8 text-left">
                "Every public musician forum I tried in the last five years became three things: a self-promotion wall, a beginner support line, and a fight about reverb. The Green Room is the room I actually wanted &mdash; small, vouched, and honest about how unglamorous most of this work is."
              </blockquote>
              <p className="text-sm uppercase tracking-[0.3em] text-tertiary-fixed mb-16">— Eli Hartman, founder · Jan 2024</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                {principles.map(p => (
                  <div key={p.title} className={`border-t-2 ${p.rule} pt-5`}>
                    <p className="font-h3 text-lg text-on-primary mb-2">{p.title}</p>
                    <p className="font-body-md text-primary-fixed-dim text-sm">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full border-t border-emerald-800 dark:border-emerald-900 bg-emerald-900 dark:bg-black text-emerald-50 mt-auto">
          <div className="w-full py-12 md:py-16 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 max-w-[1440px] mx-auto">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-xl font-bold text-emerald-50 font-['Plus_Jakarta_Sans']">The Green Room</span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-emerald-200/80 text-center md:text-left text-balance">
                © 2024 The Green Room. Built for the independent artist.
              </span>
            </div>

            <nav aria-label="Footer Links" className="flex flex-wrap justify-center gap-4 md:gap-6 font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-emerald-200/80">
              {footerLinks.map(label => (
                <a key={label} className="hover:text-emerald-50 hover:underline decoration-orange-400/80 underline-offset-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-sm px-1 py-0.5" href="#">{label}</a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
