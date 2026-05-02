export default function T09VideoBackgroundStyle() {
  const sanctuaries = [
    { name: "Lofoten", country: "Norway", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnx-sHAOBs8uWv5DFisKGn1oR9bLKT-anKZN4fzzkapr4vbyyQq1VE0EDWdl6bg_fD847eVmIIaprCMQwfe11jKLiMWMWGy4nyXJ1LjCaGrdaSVB5ESsUIUVgPutvW_QWfR13cr8QpuynLgU5ptX-Qte7o0I98rYt2zxrA7--l2wHsAn3_QsPtov0TUHE44A_6fuzKfbihPvrx4zYExxzNvCe4-v2DmIbYpYwbOu7nYMKjaQlF342BQCeMm1qYsIZq6zE5QpI_rA" },
    { name: "Kyoto", country: "Japan", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgIyg0EG1XY9d6WcMBKB9sKOxgI-qNtfkMdVQ2OoC2uQ7TnOcvNDf34cXO7qRGj95pjjtIbf25XNXq7P-aWGtiZ04mV4ZE_MfSb0Xc-jVggqO5zqmFhnO0--x8crOOckwgpf_RTzMm0TQdUtmOeKH0zkldGam3uWfnYONRQl6bMo5azGd-ISO0d-jnmtmP2DvjxcO5R9P_0Rb06vCaJbLzE4jwd1yb1IMBucpyFBWRw_0ISlICipD3RG7ZSaMWotnJcTwz8vanng" },
    { name: "Patagonia", country: "Chile", bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJp2hCXlAUMKTgv1-3w257sq4hXKEN07CH7XrnfFD61hGrCtN6HdIiqZJgFUEIsFnPRFV6NqiYrEvjGOZ7T8vSiYAd31PND_0kRrpZIDDko3qeXiy_iN5ckgq5Pdi4OfmRzcUBi0kILFOmo3p1-nKNI3BY9xqbie_xS25QCNNVRMX73Tg5KA3MtmqU7aBD1PjP3sKjFhVAT1IntcffgJaUU83_ljYqEAuZKZgXlI0dydbUZkEMKEaS1Q6R7hLES9D47qJnpz1Z-Q" },
  ];
  const features = [
    { icon: "wifi_tethering", title: "Uncompromised Connectivity", body: "Enterprise-grade fiber or satellite arrays ensure synchronous video and heavy data loads from the world's most remote edges." },
    { icon: "chair_alt", title: "Dedicated Studios", body: "Acoustically treated private workspaces featuring ergonomic seating, ambient lighting control, and expansive views." },
    { icon: "groups", title: "Curated Cohorts", body: "Residencies are limited to small groups of vetted professionals, fostering serendipitous connection without forced networking." },
    { icon: "spa", title: "Integrated Wellness", body: "Access to thermal baths, guided movement practices, and hyper-local, nutritionally optimized culinary programs." },
  ];
  const URL_HERO_COASTLINE = "https://lh3.googleusercontent.com/aida-public/AB6AXuD8P1iAOle7ZNxNzwYqt1uZlX1cSCF8aJT01CLypBQXOyWZ4zWr7NIZK0ysK1Jf3J73cdzX995X19VfM6d_O0Ksls3F-ueN4ZHBEDQLWysNV82paKmxYspAezQJ6fT6EygVDLJLpfPlDYy83uRmEUvxCO1ZvgOoSS5EIw0KAiPbUOgV1FQrzGAgd27nDMRWYFSXAM_zjGEV9uwYF4tDrYnaJ56T-DaVNC_tDIW7-dexggapfNujPsqr1DXotXNGI-xjOa9sn8A_jg";
  const URL_LOFOTEN = "https://lh3.googleusercontent.com/aida-public/AB6AXuBnx-sHAOBs8uWv5DFisKGn1oR9bLKT-anKZN4fzzkapr4vbyyQq1VE0EDWdl6bg_fD847eVmIIaprCMQwfe11jKLiMWMWGy4nyXJ1LjCaGrdaSVB5ESsUIUVgPutvW_QWfR13cr8QpuynLgU5ptX-Qte7o0I98rYt2zxrA7--l2wHsAn3_QsPtov0TUHE44A_6fuzKfbihPvrx4zYExxzNvCe4-v2DmIbYpYwbOu7nYMKjaQlF342BQCeMm1qYsIZq6zE5QpI_rA";
  const URL_KYOTO = "https://lh3.googleusercontent.com/aida-public/AB6AXuAgIyg0EG1XY9d6WcMBKB9sKOxgI-qNtfkMdVQ2OoC2uQ7TnOcvNDf34cXO7qRGj95pjjtIbf25XNXq7P-aWGtiZ04mV4ZE_MfSb0Xc-jVggqO5zqmFhnO0--x8crOOckwgpf_RTzMm0TQdUtmOeKH0zkldGam3uWfnYONRQl6bMo5azGd-ISO0d-jnmtmP2DvjxcO5R9P_0Rb06vCaJbLzE4jwd1yb1IMBucpyFBWRw_0ISlICipD3RG7ZSaMWotnJcTwz8vanng";
  const URL_PATAGONIA = "https://lh3.googleusercontent.com/aida-public/AB6AXuDJp2hCXlAUMKTgv1-3w257sq4hXKEN07CH7XrnfFD61hGrCtN6HdIiqZJgFUEIsFnPRFV6NqiYrEvjGOZ7T8vSiYAd31PND_0kRrpZIDDko3qeXiy_iN5ckgq5Pdi4OfmRzcUBi0kILFOmo3p1-nKNI3BY9xqbie_xS25QCNNVRMX73Tg5KA3MtmqU7aBD1PjP3sKjFhVAT1IntcffgJaUU83_ljYqEAuZKZgXlI0dydbUZkEMKEaS1Q6R7hLES9D47qJnpz1Z-Q";
  const URL_AUTHOR_PORTRAIT = "https://lh3.googleusercontent.com/aida-public/AB6AXuB6Qd6X0_Y2dyvAA26T3b6IBXcDzGjCYOELjNPgBMRCj0iSsKdhwZNJcW_YT5WVVHNmXoj9jUcCRbaejA3_KsT-MMEb6YOo-U7ztIJ_aG3rGNXCj9a9sDoWCfpAfZQQl-QgMFIGAia5a7GbfV4USOEkBW3Sk12OUyhTSoSxlspwh5YPhqDeyk5VqpY917Oh_x2DrXkdV8y1gf9pBSMc9QJmrBc4QGE4hHGIjFZcRmaFySn2Rv2ocf7IaX1RRiJQu2ySn9ZkF4XmXg";
  const URL_FOOTER_PINES = "https://lh3.googleusercontent.com/aida-public/AB6AXuDC0yx38aLEkeM8xmadAm_56lwja3_BIC7qs-ujCuqjvK3laS00hzKAMAUu0iNpYUowZdRWVre8ExAS-uBVAuzsz3WAWU_-gHLG3kQOZTIrsMmmJ6WIXAILfxRtFQgPhrjFbidzbVfVArLcHdvZtVEo584xDWfk-ovhguB2VUbq5IbEH6SR6EHT05VaSNxamYUQTy6WGNe1nO5YaHnmwL3cZioEy-vRoJ7f9QjL8pG2AxTJmFti5MOU3JXgHRiQsWSzN2Ukaa3vGQ";
  const properties = [
    { code: "STILL · 014", place: "Inverness", region: "N", img: URL_HERO_COASTLINE, treat: "", pos: "50% 35%" },
    { code: "STILL · 022", place: "Argolida", region: "GR", img: URL_KYOTO, treat: "sepia-[0.15]", pos: "50% 50%" },
    { code: "STILL · 031", place: "Fjordane", region: "NO", img: URL_LOFOTEN, treat: "", pos: "50% 50%" },
    { code: "STILL · 037", place: "Kvarner", region: "HR", img: URL_FOOTER_PINES, treat: "sepia-[0.2]", pos: "50% 50%" },
    { code: "STILL · 044", place: "Otago", region: "NZ", img: URL_PATAGONIA, treat: "", pos: "50% 50%" },
    { code: "STILL · 051", place: "Tasman", region: "AU", img: URL_HERO_COASTLINE, treat: "sepia-[0.25]", pos: "30% 60%" },
    { code: "STILL · 058", place: "Algarve", region: "PT", img: URL_KYOTO, treat: "grayscale-[0.3]", pos: "70% 50%" },
    { code: "STILL · 066", place: "Yakushima", region: "JP", img: URL_LOFOTEN, treat: "grayscale-[0.4]", pos: "30% 40%" },
  ];
  const weekDays = [
    { tag: "Day 01", title: "Arrival, low key", body: "You arrive on a soft schedule between four and seven. There is no front desk, no clipboard, no scripted welcome. The caretaker will already have lit the wood stove, drawn back the linen drapes, and laid out a small supper of cured meats, sourdough, and a single bottle of something local. We ask nothing of you on the first night except that you sleep when your body wants to. Most guests describe the first evening as the moment the engine begins to wind down." },
    { tag: "Day 02-03", title: "Slow mornings, deep work", body: "The studios open at six but most members do not surface until eight or nine. The chef sets out a long, generous breakfast that holds for two hours. Connectivity is fast and the desks are large. We have found that the second and third mornings are when the heaviest cognitive work tends to happen, the writing-of-the-thing rather than the talking-around-it. Afternoons are unstructured. Walk, swim, read, sleep. The library is stocked with first editions and reading lamps." },
    { tag: "Day 04", title: "House supper, candles", body: "On the fourth night the chef cooks a long-form dinner for the entire house. Eight courses, paired wines, and a single, slow rhythm to the evening. Conversations tend to find their proper depth around course three. We do not enforce any formal structure but we have noticed that members often choose this evening to share what they are actually working on, what they are stuck on, and what they came here to think through. The room holds whatever it needs to hold." },
    { tag: "Day 05-06", title: "Outings or quiet", body: "Days five and six are deliberately optional. Some members request a half-day excursion with one of our local guides — a forager, a sailor, a cellist, a stonemason — and we arrange it with no fuss and no minimum group size. Others choose to go inward, to keep the studio door closed and to surface only for meals. Either is correct. The week is engineered to let you trust your own pacing rather than asking you to perform a curriculum." },
    { tag: "Day 07", title: "Departure, unhurried", body: "Departures are arranged for any time you choose, from a six-in-the-morning car to a three-in-the-afternoon lift to the next station. The caretaker prepares a small parcel for the journey: bread, a wedge of hard cheese, fruit, a thermos. We do not run an exit interview. We simply ask that, when you are ready, you write us a letter from wherever you go next. Some members write within a week. Some write a year later. Both are welcome." },
  ];
  const includedRows = [
    {
      title: "Hosted by two",
      kicker: "Private chef · resident caretaker",
      body: "Each property is staffed by a private chef and a live-in caretaker for the duration of your residency, and only for you and your party. The chef sources from within a forty-kilometre radius wherever the geography allows it, and the caretaker handles every logistical question — laundry returned overnight, fires laid before dawn, a car arranged for an unscheduled outing — so that no member has to switch out of the work-and-rest rhythm to negotiate a household.",
      img: URL_AUTHOR_PORTRAIT
    },
    {
      title: "All meals, all spirits",
      kicker: "Three meals a day · open cellar",
      body: "The membership covers every meal, every snack between meals, and an open cellar of considered wines and spirits. Breakfast is laid out for two hours, lunch is taken whenever you want it, and the chef cooks a proper dinner each evening with a more elaborate house supper on the fourth night. Dietary restrictions are handled in advance through a short form, and we adjust without ceremony — vegan, coeliac, halal, kosher, low-fodmap, allergen-aware are all routine.",
      img: URL_PATAGONIA
    },
    {
      title: "Excursions on request",
      kicker: "Guides arranged · no minimums",
      body: "Outside the four walls of the property, we maintain a small directory of trusted local guides — a forager in Argolida, a sea kayaker in Fjordane, a cellist in Kyoto, a stonemason in Inverness — and we will arrange a half-day or full-day excursion at your request. There is no minimum group size and no upcharge beyond the guide's own fee, which is billed at cost. Members can also request to skip every excursion and never leave the grounds, and the staff will not raise it again.",
      img: URL_FOOTER_PINES
    },
  ];
  const offSeasonQuotes = [
    { quote: "I came in November expecting silence and got something better than silence. The chef built a week of menus around what was actually growing on the headland, the caretaker lit a fire at four every afternoon, and on day five I finally finished the chapter that had been stuck for nine months.", name: "Ines Aaltonen", role: "Novelist · 2024 residency" },
    { quote: "The week ran exactly the way they describe it on paper, which is rarer than it sounds. No one made me perform connection. No one made me perform productivity. I worked for three mornings and did absolutely nothing for four afternoons and the project I came to think through finally clicked into place.", name: "Marcus Lindqvist", role: "Founder · 2023 residency" },
    { quote: "It was the first holiday in a decade where I did not feel I was being charged for the privilege of being managed. The caretaker remembered I do not eat shellfish on the first night and never raised it again. Small things, repeatedly, for seven days. That is the entire trick.", name: "Aoife Ní Bhriain", role: "Architect · 2024 residency" },
  ];
  const faqs = [
    { q: "How do I become a member?", a: "Membership is by application and personal introduction. Existing members can introduce up to two new applicants per calendar year, and applications without a member sponsor are reviewed once a quarter from our waitlist. The application is a short written form and a thirty-minute call. We accept roughly one in nine applications across the year. We are not optimising for volume." },
    { q: "What is the booking calendar?", a: "Each property opens for booking exactly one calendar year ahead, on a rolling basis, the first Monday of each month. Members in good standing are entitled to one residency of up to ten nights per year and may request a second residency from the standby pool. Most properties are fully booked within forty-eight hours of release; we hold back roughly fifteen percent of nights for late requests." },
    { q: "Are dietary restrictions handled?", a: "Yes, in advance and without ceremony. The booking form includes a section on diet, allergens, and intolerances, and the chef builds the week's menus around your party's actual constraints rather than offering a parallel menu. Vegan, coeliac, halal, kosher, low-fodmap, allergen-aware are all routine. We do not handle elective requests for off-cuisine ingredients we cannot source locally." },
    { q: "Can I bring children?", a: "Five of our properties are configured for children of any age, four are configured for children twelve and over, and three are adults-only. The caretaker is not a babysitter, but local sitters can be arranged through the same directory we use for guides, billed at cost. Children are welcomed at the house supper on day four and at every meal otherwise." },
    { q: "Pet policy?", a: "Dogs are welcome at six of the properties on advance notice, with a small additional cleaning fee billed at cost. We ask that owners bring their own bedding and that dogs are not left unattended in shared rooms. Cats and other pets are handled case by case. Service animals are welcome at every property without notice and without any additional fee." },
    { q: "Insurance and cancellation?", a: "We strongly recommend a standard travel-insurance policy for medical and trip-interruption coverage; we do not sell or resell insurance ourselves. Cancellations more than sixty days out are refunded in full. Cancellations between sixty and fourteen days out are credited to a future residency. Cancellations within fourteen days are not refundable, though we will work to fill the slot from standby and credit you the proceeds." },
    { q: "How do I contact a host?", a: "Each booking confirmation includes a direct line and an SMS thread for the caretaker assigned to your residency. The line is staffed for the full duration of your stay including overnight emergencies, and we ask that members route everything through that single thread rather than calling the head office. The chef is reachable through the caretaker, not directly, to keep the kitchen calm." },
    { q: "Are off-property excursions extra?", a: "Yes, but only at the guide's own cost, which we bill straight through with no markup. A half-day forager walk in Argolida is currently around eighty euros per party. A full-day sail in Fjordane is around four hundred. We publish the guide list and current rates in the welcome binder at each property and update them quarterly." },
  ];
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Serif:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "on-primary-container": "#788398",
                "surface": "#081422",
                "secondary-container": "#4a4942",
                "surface-container-lowest": "#040f1c",
                "tertiary": "#e1c387",
                "surface-container-low": "#111c2a",
                "secondary-fixed-dim": "#cac6bd",
                "error-container": "#93000a",
                "on-primary-fixed": "#111c2d",
                "inverse-primary": "#545f73",
                "error": "#ffb4ab",
                "surface-container-high": "#202b39",
                "primary": "#bcc7de",
                "primary-container": "#0f1a2b",
                "background": "#081422",
                "on-tertiary": "#3f2e00",
                "on-secondary": "#31312a",
                "on-background": "#d8e3f7",
                "on-primary-fixed-variant": "#3c475a",
                "on-error-container": "#ffdad6",
                "outline-variant": "#45474c",
                "on-tertiary-fixed-variant": "#584414",
                "on-tertiary-container": "#997f4a",
                "surface-dim": "#081422",
                "on-secondary-fixed": "#1c1c16",
                "on-secondary-container": "#bbb8af",
                "surface-bright": "#2f3a49",
                "primary-fixed-dim": "#bcc7de",
                "tertiary-fixed": "#fedfa0",
                "secondary": "#cac6bd",
                "on-primary": "#263143",
                "on-secondary-fixed-variant": "#484740",
                "tertiary-fixed-dim": "#e1c387",
                "on-surface-variant": "#c5c6cd",
                "outline": "#8f9097",
                "surface-container": "#15202e",
                "tertiary-container": "#231800",
                "surface-variant": "#2a3544",
                "surface-tint": "#bcc7de",
                "on-error": "#690005",
                "primary-fixed": "#d8e3fb",
                "surface-container-highest": "#2a3544",
                "inverse-on-surface": "#263140",
                "on-tertiary-fixed": "#261a00",
                "on-surface": "#d8e3f7",
                "inverse-surface": "#d8e3f7",
                "secondary-fixed": "#e6e2d8"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "section-gap": "160px", "margin-safe": "80px", "gutter": "32px", "element-gap": "24px", "unit": "8px" },
              fontFamily: {
                "body-md": ["inter"], "label-caps": ["inter"],
                "display": ["notoSerif"], "h3": ["notoSerif"], "h2": ["notoSerif"], "h1": ["notoSerif"],
                "body-lg": ["inter"]
              },
              fontSize: {
                "body-md": ["16px", { lineHeight: "1.6", letterSpacing: "0.01em", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "1.2", letterSpacing: "0.15em", fontWeight: "600" }],
                "display": ["84px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
                "h3": ["24px", { lineHeight: "1.4", letterSpacing: "0em", fontWeight: "400" }],
                "h2": ["32px", { lineHeight: "1.3", letterSpacing: "0em", fontWeight: "400" }],
                "h1": ["48px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "1.6", letterSpacing: "0.01em", fontWeight: "400" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #081422; color: #d8e3f7; }
      ` }} />

      <div className="antialiased font-body-md text-body-md overflow-x-hidden selection:bg-tertiary selection:text-on-tertiary dark">
        <header className="fixed top-0 w-full z-50 bg-[#0F1A2B]/80 dark:bg-slate-950/80 backdrop-blur-[30px] border-b border-white/5 dark:border-white/10 shadow-[inset_0_-1px_0_0_rgba(230,213,184,0.1)]">
          <div className="flex justify-between items-center w-full px-4 py-4 max-w-[1440px] mx-auto gap-3 sm:px-8 sm:py-6 md:px-20 md:py-8">
            <div className="text-xl font-serif italic text-white dark:text-slate-50 sm:text-2xl">Still</div>
            <nav className="hidden md:flex items-center space-x-12">
              <a className="font-label-caps text-label-caps uppercase text-slate-400 dark:text-slate-500 hover:text-[#E6D5B8] transition-all duration-500 ease-in-out cursor-pointer" href="#">Retreats</a>
              <a className="font-label-caps text-label-caps uppercase text-slate-400 dark:text-slate-500 hover:text-[#E6D5B8] transition-all duration-500 ease-in-out cursor-pointer" href="#">About</a>
              <a className="font-label-caps text-label-caps uppercase text-slate-400 dark:text-slate-500 hover:text-[#E6D5B8] transition-all duration-500 ease-in-out cursor-pointer" href="#">Journal</a>
            </nav>
            <button className="bg-tertiary text-on-tertiary px-4 py-2 rounded font-label-caps text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity sm:px-6 sm:py-3 sm:text-label-caps md:px-8">Book Now</button>
          </div>
        </header>

        <section className="relative w-full min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden sm:pt-24">
          <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8P1iAOle7ZNxNzwYqt1uZlX1cSCF8aJT01CLypBQXOyWZ4zWr7NIZK0ysK1Jf3J73cdzX995X19VfM6d_O0Ksls3F-ueN4ZHBEDQLWysNV82paKmxYspAezQJ6fT6EygVDLJLpfPlDYy83uRmEUvxCO1ZvgOoSS5EIw0KAiPbUOgV1FQrzGAgd27nDMRWYFSXAM_zjGEV9uwYF4tDrYnaJ56T-DaVNC_tDIW7-dexggapfNujPsqr1DXotXNGI-xjOa9sn8A_jg')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute inset-0 bg-background/20 mix-blend-multiply"></div>
          </div>
          <div className="relative z-10 text-center flex flex-col items-center px-5 max-w-[800px] mx-auto mt-12 sm:mt-16 md:mt-20">
            <h1 className="font-display text-[36px] leading-[1.1] text-on-surface mb-6 opacity-90 drop-shadow-lg sm:text-[48px] sm:mb-8 md:text-[72px] lg:text-display">The Luxury of Finding Space</h1>
            <p className="font-body-lg text-base text-on-surface mb-8 max-w-[500px] sm:text-body-lg sm:mb-12">A curated collection of remote sanctuaries designed for deep work, profound rest, and intentional living.</p>
            <a className="border border-secondary text-on-surface px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary hover:text-on-tertiary hover:border-tertiary transition-all duration-300 sm:px-10 sm:py-4" href="#">Explore Membership</a>
          </div>
        </section>

        <section className="py-20 px-5 max-w-[1440px] mx-auto sm:py-28 sm:px-8 md:py-section-gap md:px-margin-safe">
          <div className="flex flex-col items-start gap-3 mb-8 sm:flex-row sm:justify-between sm:items-end sm:gap-6 md:mb-element-gap">
            <h2 className="font-h2 text-[26px] leading-tight text-on-surface italic sm:text-[32px] md:text-h2">Curated Sanctuaries</h2>
            <a className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest hover:opacity-80 transition-opacity" href="#">View All Destinations</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {sanctuaries.map(s => (
              <a key={s.name} className="group relative aspect-square overflow-hidden block bg-surface-container" href="#">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url('${s.bg}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 border border-white/5 group-hover:border-tertiary/30 transition-colors duration-500"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="font-h3 text-h3 text-on-surface mb-1">{s.name}</h3>
                  <p className="font-label-caps text-label-caps text-secondary tracking-widest">{s.country}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="py-20 px-5 bg-surface-container-low flex flex-col items-center justify-center text-center sm:py-28 sm:px-8 md:py-section-gap md:px-margin-safe">
          <div className="max-w-[800px] mx-auto">
            <span className="material-symbols-outlined text-tertiary/50 text-4xl mb-6 block sm:mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <blockquote className="font-h1 text-[26px] leading-snug text-on-surface italic mb-10 sm:text-[36px] sm:mb-12 md:text-h1">
              "In silence, we find our most profound work. True focus requires the deliberate exclusion of the unnecessary."
            </blockquote>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border border-surface-variant">
                <img alt="Author" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6Qd6X0_Y2dyvAA26T3b6IBXcDzGjCYOELjNPgBMRCj0iSsKdhwZNJcW_YT5WVVHNmXoj9jUcCRbaejA3_KsT-MMEb6YOo-U7ztIJ_aG3rGNXCj9a9sDoWCfpAfZQQl-QgMFIGAia5a7GbfV4USOEkBW3Sk12OUyhTSoSxlspwh5YPhqDeyk5VqpY917Oh_x2DrXkdV8y1gf9pBSMc9QJmrBc4QGE4hHGIjFZcRmaFySn2Rv2ocf7IaX1RRiJQu2ySn9ZkF4XmXg" />
              </div>
              <cite className="not-italic">
                <div className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">Elias Thorne</div>
                <div className="font-body-md text-body-md text-secondary mt-1 text-sm">Founding Member</div>
              </cite>
            </div>
          </div>
        </section>

        <section className="py-20 px-5 max-w-[1440px] mx-auto sm:py-28 sm:px-8 md:py-section-gap md:px-margin-safe">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-4 lg:col-start-1 pt-4">
              <h2 className="font-h2 text-[26px] leading-tight text-on-surface mb-6 sm:text-[32px] md:text-h2">The Standard</h2>
              <p className="font-body-md text-body-md text-on-surface max-w-sm">Every Still location is engineered to remove friction, blending uncompromising technological infrastructure with restorative natural environments.</p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-16 gap-x-12">
                {features.map(f => (
                  <div key={f.title} className="border-t border-white/10 pt-6">
                    <span className="material-symbols-outlined text-tertiary mb-4 block text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>{f.icon}</span>
                    <h4 className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest mb-3">{f.title}</h4>
                    <p className="font-body-md text-body-md text-on-surface text-sm">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-5 max-w-[1440px] mx-auto sm:py-28 sm:px-8 md:py-section-gap md:px-margin-safe">
          <div className="flex flex-col items-start gap-3 mb-8 sm:flex-row sm:justify-between sm:items-end sm:gap-6 md:mb-element-gap">
            <h2 className="font-h2 text-[26px] leading-tight text-on-surface italic sm:text-[32px] md:text-h2">Properties · current portfolio</h2>
            <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest">Eight active · twelve planned</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {properties.map(p => (
              <div key={p.code} className="group relative aspect-square overflow-hidden bg-surface-container">
                <img alt={p.place} className={`absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90 ${p.treat || ""}`} style={{ objectPosition: p.pos || "50% 50%" }} src={p.img} />
                <div className="absolute inset-0 bg-tertiary/15 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent"></div>
                <div className="absolute inset-0 border border-white/5 group-hover:border-tertiary/30 transition-colors duration-500"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-label-caps text-[10px] text-tertiary uppercase tracking-widest mb-1">{p.code}</p>
                  <h3 className="font-h3 text-[15px] text-on-surface italic leading-tight">{p.place}<span className="text-secondary not-italic font-label-caps text-[10px] tracking-widest ml-2">{p.region}</span></h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-5 max-w-[1440px] mx-auto sm:py-28 sm:px-8 md:py-section-gap md:px-margin-safe">
          <div className="mb-12 md:mb-16">
            <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-4">A typical week</p>
            <h2 className="font-h2 text-[26px] leading-tight text-on-surface italic max-w-2xl sm:text-[32px] md:text-h2">Seven days, deliberately under-programmed</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-5 lg:col-start-1">
              <div className="lg:sticky lg:top-32 flex flex-col gap-6">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container">
                  <img alt="House interior in low light" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-95" src={URL_KYOTO} />
                  <div className="absolute inset-0 bg-tertiary/10 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-2">Argolida house</p>
                    <p className="font-h3 text-h3 text-on-surface italic">Late afternoon, fourth day</p>
                  </div>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                  <img alt="Pine grove west of the house at dusk" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90" src={URL_FOOTER_PINES} />
                  <div className="absolute inset-0 bg-tertiary/12 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-2">Pine grove · west of the house</p>
                    <p className="font-h3 text-[20px] text-on-surface italic leading-snug">Dusk on day six, after the long supper</p>
                  </div>
                </div>
                <div className="relative aspect-square overflow-hidden bg-surface-container">
                  <img alt="Coastline view from the upstairs window, day five" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90" style={{ objectPosition: "50% 60%" }} src={URL_HERO_COASTLINE} />
                  <div className="absolute inset-0 bg-tertiary/10 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-2">From the window</p>
                    <p className="font-h3 text-[20px] text-on-surface italic leading-snug">Coast, day five — first light</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-7">
              <div className="flex flex-col gap-12 md:gap-16">
                {weekDays.map(d => (
                  <div key={d.tag} className="border-t border-outline-variant/40 pt-6">
                    <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-3">{d.tag}</p>
                    <h3 className="font-h3 text-h3 text-on-surface italic mb-4">{d.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface text-[15px] leading-relaxed">{d.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-5 bg-surface-container-low sm:py-28 sm:px-8 md:py-section-gap md:px-margin-safe">
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-12 md:mb-16 max-w-2xl">
              <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-4">What is included</p>
              <h2 className="font-h2 text-[26px] leading-tight text-on-surface italic sm:text-[32px] md:text-h2">Hosted, fed, supported. No upsell.</h2>
            </div>
            <div className="flex flex-col gap-16 md:gap-24">
              {includedRows.map((r, i) => (
                <div key={r.title} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                  <div className={"lg:col-span-7 " + (i % 2 === 1 ? "lg:col-start-6 lg:row-start-1" : "lg:col-start-1")}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                      <img alt={r.title} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90" src={r.img} />
                      <div className="absolute inset-0 bg-tertiary/10 mix-blend-overlay"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 border border-white/5"></div>
                    </div>
                  </div>
                  <div className={"lg:col-span-4 " + (i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-9")}>
                    <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-3">{r.kicker}</p>
                    <h3 className="font-h2 text-[24px] leading-tight text-on-surface italic mb-5 sm:text-[28px]">{r.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface text-[15px] leading-relaxed">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-5 max-w-[1440px] mx-auto sm:py-28 sm:px-8 md:py-section-gap md:px-margin-safe overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
            <div className="lg:col-span-6 lg:col-start-1 order-2 lg:order-1">
              <div className="bg-surface-container-low p-8 md:p-12 h-full flex flex-col gap-10">
                <div>
                  <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-3">In the off-season</p>
                  <h2 className="font-h2 text-[26px] leading-tight text-on-surface italic sm:text-[32px] md:text-h2">Letters, after the fact</h2>
                </div>
                <div className="flex flex-col gap-10">
                  {offSeasonQuotes.map(q => (
                    <figure key={q.name} className="border-t border-outline-variant/40 pt-6">
                      <blockquote className="font-h3 text-[18px] leading-snug text-on-surface italic mb-4">&ldquo;{q.quote}&rdquo;</blockquote>
                      <figcaption>
                        <div className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">{q.name}</div>
                        <div className="font-body-md text-body-md text-on-surface text-sm mt-1">{q.role}</div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2 lg:mr-[calc(50%-50vw)]">
              <div className="relative h-[420px] sm:h-[520px] lg:h-full overflow-hidden bg-surface-container">
                <img alt="Editorial portrait, off-season" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-95 grayscale-[0.4]" src={URL_LOFOTEN} />
                <div className="absolute inset-0 bg-tertiary/10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/30"></div>
                <div className="absolute inset-0 border border-white/5"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-5 bg-surface-container sm:py-28 sm:px-8 md:py-section-gap md:px-margin-safe">
          <div className="max-w-[1100px] mx-auto">
            <div className="mb-12 md:mb-16">
              <p className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest mb-4">Frequently asked</p>
              <h2 className="font-h2 text-[26px] leading-tight text-on-surface italic sm:text-[32px] md:text-h2">Eight questions that come up</h2>
            </div>
            <div className="flex flex-col">
              {faqs.map((f, i) => (
                <details key={f.q} className="group border-t border-outline-variant/40 py-6" open={i === 0}>
                  <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                    <h3 className="font-h3 text-[18px] leading-snug text-on-surface italic sm:text-[20px]">{f.q}</h3>
                    <span className="material-symbols-outlined text-tertiary text-2xl shrink-0 transition-transform duration-300 group-open:rotate-90" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface text-[15px] leading-relaxed mt-4 max-w-3xl">{f.a}</p>
                </details>
              ))}
              <div className="border-t border-outline-variant/40"></div>
            </div>
          </div>
        </section>

        <div className="relative w-full overflow-hidden bg-background">
          <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDC0yx38aLEkeM8xmadAm_56lwja3_BIC7qs-ujCuqjvK3laS00hzKAMAUu0iNpYUowZdRWVre8ExAS-uBVAuzsz3WAWU_-gHLG3kQOZTIrsMmmJ6WIXAILfxRtFQgPhrjFbidzbVfVArLcHdvZtVEo584xDWfk-ovhguB2VUbq5IbEH6SR6EHT05VaSNxamYUQTy6WGNe1nO5YaHnmwL3cZioEy-vRoJ7f9QjL8pG2AxTJmFti5MOU3JXgHRiQsWSzN2Ukaa3vGQ')" }}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-[#0F1A2B]"></div>
          </div>
          <div className="relative z-10 py-20 flex flex-col items-center text-center px-5 sm:py-28 sm:px-8 md:py-section-gap">
            <h2 className="font-display text-[36px] leading-[1.1] text-on-surface mb-6 sm:text-[48px] md:text-[72px] lg:text-display">Return to Stillness</h2>
            <p className="font-body-md text-body-md text-on-surface mb-10 max-w-md sm:mb-12">Membership is currently by application. Join the waitlist to be notified when allocations become available.</p>
            <form className="w-full max-w-md flex flex-col gap-6">
              <div className="relative">
                <input className="block w-full px-0 py-3 bg-transparent border-0 border-b border-secondary/50 focus:border-tertiary focus:ring-0 text-on-surface font-body-md peer transition-colors" id="email" placeholder=" " required type="email" />
                <label className="absolute top-3 left-0 font-label-caps text-label-caps text-secondary uppercase tracking-widest transition-all duration-300 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-tertiary peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-secondary/70" htmlFor="email">Email Address</label>
              </div>
              <button className="w-full bg-tertiary text-on-tertiary py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary-fixed transition-colors mt-4" type="submit">Join the Waitlist</button>
            </form>
          </div>
          <footer className="relative z-10 w-full mt-20 border-t border-white/5 bg-[#0F1A2B] dark:bg-slate-950 pointer-events-auto sm:mt-32 md:mt-40">
            <div className="max-w-[1440px] mx-auto px-5 py-10 flex flex-col items-center gap-8 sm:px-8 sm:py-16 sm:gap-10 md:px-20 md:py-24 md:gap-12">
              <div className="text-xl font-serif text-white dark:text-slate-50">Still</div>
              <nav className="flex flex-wrap justify-center gap-6 sm:gap-8">
                <a className="font-serif text-sm tracking-wide text-slate-500 hover:text-white hover:opacity-80 transition-opacity" href="#">Privacy Policy</a>
                <a className="font-serif text-sm tracking-wide text-slate-500 hover:text-white hover:opacity-80 transition-opacity" href="#">Terms of Service</a>
                <a className="font-serif text-sm tracking-wide text-slate-500 hover:text-white hover:opacity-80 transition-opacity" href="#">Contact</a>
                <a className="font-serif text-sm tracking-wide text-slate-500 hover:text-white hover:opacity-80 transition-opacity" href="#">Instagram</a>
              </nav>
              <p className="font-serif text-sm tracking-wide text-slate-400">© 2024 Still Retreats. The Luxury of Space.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
