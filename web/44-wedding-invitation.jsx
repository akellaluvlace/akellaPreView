export default function T44WeddingInvitation() {
  const navLinks = [
    { label: "Our Story", href: "#our-story", active: true },
    { label: "The Day", href: "#the-day" },
    { label: "Travel", href: "#travel" },
    { label: "Registry", href: "#registry" },
    { label: "Gallery", href: "#gallery" }
  ];

  const schedule = [
    { time: "4:00 PM", title: "Ceremony", note: "Please arrive by 3:45 PM. The ceremony will take place in the conservatory." },
    { time: "5:00 PM", title: "Cocktails", note: "Drinks and light bites on the terrace overlooking the gardens." },
    { time: "6:30 PM", title: "Dinner", note: "A family-style feast in the main hall." },
    { time: "8:30 PM", title: "Dancing", note: "Music, dessert, and celebrations until late." }
  ];

  const dayGrid = [
    { caption: "The Chapel", alt: "The chapel", overlay: "bg-primary-fixed-dim/25", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&q=80" },
    { caption: "First Look", alt: "The couple", overlay: "bg-primary-fixed-dim/15", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOtsdLW3lPeNipqZ7On12BgQtEj_aJD6yfO99WRRolYRboYOErF6gWJf5tU33Gex-gV7Y4QDNBZRyKYEQuaTzjx8KogELWRAN--NBcMuY_S-uFAhhbCMgdB1zRqoaFr9i5GKJmNgCyi1yTVt6pray9MGbp67plq2UCfmRmYnIvYbxCDfBHQjkuvHPjGeX91Af2nb1qHDW28nP_lG50h4dlQzElVhH1ork0nHVnMC6UpuauQZ-h2m7PZcecXrdAakIedgGg_8kSAZU" },
    { caption: "The Orchard Walk", alt: "Orchard path", overlay: "bg-primary-fixed-dim/25", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80" },
    { caption: "A Guest, Arriving", alt: "A guest", overlay: "bg-primary-fixed-dim/20", img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=600&q=80" },
    { caption: "The Long Table", alt: "Long table", overlay: "bg-primary-fixed-dim/30", img: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=600&q=80" },
    { caption: "Last Light, the Hall", alt: "Last light", overlay: "bg-primary-fixed-dim/25", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80" }
  ];

  const hotels = [
    { name: "The Valley Inn", note: "A boutique hotel just 10 minutes from the venue. Shuttle service will be provided.", cta: "Book Room", bg: "bg-surface-container" },
    { name: "Riverside Estate", note: "Luxury accommodations offering a relaxing weekend retreat.", cta: "View Website", bg: "bg-surface" }
  ];

  const attendingOptions = [
    { value: "yes", label: "Joyfully Accepts" },
    { value: "no", label: "Regretfully Declines" }
  ];

  const footerLinks = [
    { label: "Privacy", href: "#" },
    { label: "Contact Us", href: "#" }
  ];

  const archive = [
    { caption: "Edinburgh · 2018", alt: "Edinburgh 2018", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=400&q=80" },
    { caption: "Rome · 2019", alt: "Rome 2019", img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=400&q=80" },
    { caption: "Cork · 2020", alt: "Cork 2020", img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=80" },
    { caption: "Lisbon · 2021", alt: "Lisbon 2021", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80" },
    { caption: "Donegal · 2022", alt: "Donegal 2022", img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=400&q=80" },
    { caption: "Paris · 2023", alt: "Paris 2023", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80" },
    { caption: "Wicklow · 2024", alt: "Wicklow 2024", img: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?auto=format&fit=crop&w=400&q=80" },
    { caption: "Glendalough · 2025", alt: "Glendalough 2025", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80" }
  ];

  const storyChapters = [
    {
      kicker: "Chapter one",
      title: "A bookshop in Edinburgh",
      body: "It started, as small things often do, with a spilled flat white on a shelf of paperback poetry. Eoin had flown in for a weekend lecture and was hunting for a battered first edition. Marlowe was killing two hours before a train and found a quiet corner instead. The apology lasted nine seconds; the conversation that followed lasted six hours, two coffees, a walk along the Water of Leith, and a missed train south. Neither of us has been able to point to the exact moment something changed. We just remember walking back into the bookshop near closing time and realising the day had moved on without us. We exchanged numbers in the doorway and pretended it was a casual thing."
    },
    {
      kicker: "Chapter two",
      title: "One slow year apart",
      body: "Then real life intervened. Marlowe took a teaching post in Galway. Eoin took a fellowship year in Berlin. There were emails — long, careful, occasionally too witty for their own good — but no plan. We told ourselves the quiet was a kindness; that whatever this was, it deserved more than a series of stolen weekends and end-of-month airfare. In hindsight that year was useful. It taught us how to be honest by post, how to argue gently across timezones, how to want without grasping. By the following spring we were both quietly tired of the cleverness of being apart, and we admitted it in almost exactly the same week, in almost exactly the same words."
    },
    {
      kicker: "Chapter three",
      title: "An honest weekend in Rome",
      body: "Rome was meant to be neutral ground. Three days, no expectations, separate hotels — the kind of plan you write when you are pretending not to be afraid. We ate too much carbonara, walked the Aventine in silence at sunset, and on Sunday morning, in a small church near the river that neither of us could later find again, Eoin said the unsayable thing first. Marlowe said the second unsayable thing on the plane home. By the time we landed in Dublin we were not the same two people who had flown out, and the year of carefully measured emails was over for good. We moved in together six weeks later, with one suitcase each and a slightly absurd philodendron."
    },
    {
      kicker: "Chapter four",
      title: "A small kitchen, a real plan",
      body: "The proposal happened, prosaically and perfectly, at the kitchen table of our flat in Stoneybatter on a Tuesday in November. There was no ring yet, no candles, no speech. There was a half-eaten Thai takeaway, a kettle that needed descaling, and Eoin asking quietly whether we should make it a real plan. Marlowe said yes before the question was finished. We did not tell anyone for three days because we wanted, just once, to keep something entirely between ourselves. When we finally did call our families, both mothers cried, both fathers asked about the venue, and the dog ate part of the takeaway container. That feels, in retrospect, like the truest possible beginning."
    }
  ];

  const dayMovements = [
    {
      time: "2pm",
      title: "Ceremony, the orchard chapel",
      body: "Doors open at 1.30 — please be seated by ten to two so the celebrant can begin on the hour. The chapel sits at the south end of the orchard and seats about ninety; pews are unreserved apart from immediate family. The ceremony is short, mostly in plain English, with one reading and one piece of music. There will be no order of service printed; we wanted everyone simply present. Confetti is dried lavender from the kitchen garden, in baskets at the door — feel free to throw it generously. After we walk out, please follow us back along the orchard path to the lawn for drinks.",
      img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80",
      alt: "Orchard chapel"
    },
    {
      time: "4pm",
      title: "Drinks on the lawn",
      body: "If the day is fine, we will spill out across the south lawn until about half six. Expect Wicklow gin, an Irish sparkling, a non-alcoholic pear and rosemary cordial that we are very proud of, and small things on toast. There is a stone wall along the west edge that catches the light beautifully around five — we will be wandering between groups, so do please grab us. A small jazz trio will be set up under the elm. Family photographs will happen briefly here too, painlessly we hope; we will round people up rather than print a list. If it rains, the same drinks move into the long barn, which is just as good and slightly warmer.",
      img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1400&q=80",
      alt: "Lawn drinks"
    },
    {
      time: "7pm",
      title: "Long dinner, no speeches before tarte tatin",
      body: "Dinner is served at seven sharp at one long table in the barn — no top table, no place cards beyond your section, just find your name in the seating plan at the door. The menu is five courses, paced slowly, with a real intermission between the main and dessert so people can move chairs and talk to someone new. We have asked the kindest of our friends to keep speeches short, warm, and strictly after tarte tatin has been served. Wine is generous; water is plentiful; please flag any allergy on the RSVP form below and the kitchen will handle it discreetly. Music starts at half ten in the same room.",
      img: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=1400&q=80",
      alt: "Long table dinner"
    }
  ];

  const faq = [
    {
      q: "Plus-ones?",
      a: "If your invitation lists a plus-one by name, that name is on the seating plan and we are very happy to see them. If your invitation lists only your name, we have not extended a plus-one — please do not feel hurt, the venue is small and we have had to draw the line in places that occasionally felt unkind. We promise the table you are seated at will be full of people you would actually want to spend an evening with, and if it is not, we will swap your card discreetly between courses."
    },
    {
      q: "Children welcome?",
      a: "Children of named family members are very welcome and will have their own quieter corner of the barn with food, books and a small staff member to keep an eye on things. Outside of that, we have asked friends to take the day as a small holiday from parenting if at all possible. There is a list of three trusted local sitters in the welcome pack; the Glendalough Hotel will also arrange a sitter on request with twenty-four hours notice. Please ask us, not awkwardly later but now, if anything is unclear."
    },
    {
      q: "Dress code?",
      a: "Garden formal — that is, dress as if you are about to be photographed standing on a lawn. Long dresses are easy on the grass, suits do not need to be three-piece, and warm colours read better than black against the orchard. Both of us will be in shades of cream and dust. Please bring something with sleeves for the evening, the barn cools after sundown. Heels on grass tend to suffer; flats are entirely encouraged. If you would like to wear black, please do — we are not superstitious, only suggesting."
    },
    {
      q: "Gifts policy?",
      a: "Your presence really is the present. We have lived together for seven years and have everything we need in the way of plates and bowls. If you would still like to mark the day, we have set up a small honeyfund for a slow honeymoon along the west coast of Scotland next May, and a tiny match-fund for a Wicklow tree-planting cooperative we like — both linked from the registry page. There is no expected amount, and a card and a kind note count, equally and forever, as a wedding gift in this house."
    },
    {
      q: "Are you registered anywhere?",
      a: "Only the two soft funds described above — honeymoon and tree-planting — and a very short list of three small items at a Dublin homewares shop, which our families asked us to put together. We did not feel comfortable with a long department-store registry; it would not represent who we are or how we live. Both registries accept any currency. If you would prefer to give something handmade, written or grown, that would mean more than anything bought, and we will treasure it for years. Truly, do not feel obliged."
    },
    {
      q: "Travel reimbursement?",
      a: "For a small number of guests travelling from very far away, we have put aside a quiet hardship fund — please write to either of us privately if a flight or accommodation cost would otherwise prevent you from being there. There is no application form and no awkward conversation, just a short message and we will sort it. The coaches from Dublin and the on-day minibus loop are entirely free to all guests and require no booking. Anyone driving from elsewhere on the island can claim petrol back at the door if they would like to."
    }
  ];

  const inputClass =
    "w-full border-0 border-b border-outline/30 bg-transparent px-0 py-2 font-form-input text-form-input text-on-background focus:ring-0 focus:border-on-background transition-colors placeholder:text-outline";

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "background": "#fef9f1", "on-background": "#1d1c17",
                "surface": "#fef9f1", "surface-bright": "#fef9f1", "surface-dim": "#ded9d2", "surface-variant": "#e7e2da",
                "surface-container-lowest": "#ffffff", "surface-container-low": "#f8f3eb", "surface-container": "#f2ede5", "surface-container-high": "#ece8e0", "surface-container-highest": "#e7e2da",
                "on-surface": "#1d1c17", "on-surface-variant": "#4d453f",
                "primary": "#6a5c51", "on-primary": "#ffffff", "primary-container": "#e8d5c7", "on-primary-container": "#695b50", "primary-fixed": "#f2dfd1", "primary-fixed-dim": "#d5c3b6", "on-primary-fixed": "#231a11", "on-primary-fixed-variant": "#51443a",
                "secondary": "#566253", "on-secondary": "#ffffff", "secondary-container": "#d6e4d1", "on-secondary-container": "#5a6657", "secondary-fixed": "#d9e6d3", "secondary-fixed-dim": "#bdcab8", "on-secondary-fixed": "#131e13", "on-secondary-fixed-variant": "#3e4a3c",
                "tertiary": "#615e59", "on-tertiary": "#ffffff", "tertiary-container": "#ddd8d2", "on-tertiary-container": "#615e59", "tertiary-fixed": "#e7e2db", "tertiary-fixed-dim": "#cbc6c0", "on-tertiary-fixed": "#1d1b18", "on-tertiary-fixed-variant": "#494642",
                "error": "#ba1a1a", "on-error": "#ffffff", "error-container": "#ffdad6", "on-error-container": "#93000a",
                "outline": "#7f756e", "outline-variant": "#d1c4bc", "surface-tint": "#6a5c51", "inverse-surface": "#32302b", "inverse-on-surface": "#f5f0e8", "inverse-primary": "#d5c3b6"
              },
              spacing: {
                gutter: "24px",
                "margin-edge": "40px",
                "container-max": "1280px",
                unit: "8px",
                "section-gap": "120px"
              },
              fontFamily: {
                "h1-editorial": ["Newsreader", "serif"],
                "h2-editorial": ["Newsreader", "serif"],
                "display-names": ["Newsreader", "serif"],
                "body-lg": ["Inter", "sans-serif"],
                "body-md": ["Inter", "sans-serif"],
                "form-input": ["Inter", "sans-serif"],
                "label-caps": ["Inter", "sans-serif"]
              },
              fontSize: {
                "h1-editorial": ["48px", { lineHeight: "56px", fontWeight: "400" }],
                "h2-editorial": ["32px", { lineHeight: "40px", fontWeight: "400" }],
                "display-names": ["84px", { lineHeight: "92px", fontWeight: "300" }],
                "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "form-input": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "600" }]
              }
            }
          }
        };
      ` }} />

      <div className="scroll-smooth bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
        {/* TopAppBar */}
        <header className="fixed top-0 w-full z-50 bg-[#E8D5C7]/80 backdrop-blur-md dark:bg-stone-900/80 border-b border-stone-900/10 dark:border-stone-100/10 transition-colors">
          <div className="flex justify-between items-center w-full px-8 py-6 md:px-16 container mx-auto max-w-container-max">
            <a className="text-2xl font-serif italic text-stone-900 dark:text-stone-100 font-h2-editorial hover:opacity-70 transition-opacity duration-300" href="#">E&amp;M</a>
            <nav className="hidden md:flex items-center space-x-8 font-serif italic tracking-wide">
              {navLinks.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className={
                    l.active
                      ? "text-stone-900 dark:text-stone-100 border-b border-stone-900 dark:border-stone-100 pb-1 hover:opacity-70 transition-opacity duration-300"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  }
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <a className="bg-on-background text-background px-6 py-2 font-label-caps uppercase hover:opacity-80 transition-opacity duration-300" href="#rsvp">RSVP</a>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section className="relative h-screen w-full flex items-end pb-24 md:pb-32 px-8 md:px-16 overflow-hidden">
            <div className="absolute inset-0 z-0 bg-surface-variant">
              <img alt="Editorial portrait" className="w-full h-full object-cover object-center opacity-100" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1900&q=80" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90" />
              <div className="absolute inset-0 bg-primary-fixed-dim/15 mix-blend-multiply" />
            </div>
            <div className="relative z-10 w-full max-w-container-max mx-auto flex flex-col items-start space-y-6">
              <h1 className="font-display-names text-display-names text-on-background italic leading-none max-w-3xl">Eoin &amp; Marlowe</h1>
              <p className="font-h2-editorial text-h2-editorial text-on-background opacity-90">September 14, 2026</p>
              <a className="mt-12 flex items-center space-x-2 text-on-background opacity-70 hover:opacity-100 transition-opacity group" href="#our-story">
                <span className="font-label-caps text-label-caps uppercase tracking-widest">Scroll</span>
                <span className="material-symbols-outlined font-light transform group-hover:translate-y-1 transition-transform">arrow_downward</span>
              </a>
            </div>
          </section>

          {/* Our Story */}
          <section id="our-story" className="py-section-gap px-8 md:px-16 max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-4">Our Story</h2>
              <div className="w-12 h-px bg-outline mx-auto opacity-30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-center">
              <div className="md:col-span-4 flex flex-col justify-center">
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 text-justify">
                  It began with a spilled coffee in a crowded bookstore. Eoin was looking for a rare first edition, and Marlowe was just trying to stay awake after a long flight. What started as an awkward apology turned into hours of conversation about everything and nothing.
                </p>
              </div>
              <div className="md:col-span-4 flex justify-center py-8 md:py-0 relative">
                <div className="relative w-full aspect-[3/4] max-w-sm">
                  <div className="absolute inset-0 bg-primary-container translate-x-4 translate-y-4" />
                  <img alt="Our story" className="relative z-10 w-full h-full object-cover border border-outline/20 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOtsdLW3lPeNipqZ7On12BgQtEj_aJD6yfO99WRRolYRboYOErF6gWJf5tU33Gex-gV7Y4QDNBZRyKYEQuaTzjx8KogELWRAN--NBcMuY_S-uFAhhbCMgdB1zRqoaFr9i5GKJmNgCyi1yTVt6pray9MGbp67plq2UCfmRmYnIvYbxCDfBHQjkuvHPjGeX91Af2nb1qHDW28nP_lG50h4dlQzElVhH1ork0nHVnMC6UpuauQZ-h2m7PZcecXrdAakIedgGg_8kSAZU" />
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col justify-center">
                <p className="font-body-lg text-body-lg text-on-surface-variant text-justify">
                  Six years later, through career changes, cross-country moves, and adopting a dog with too much energy, that conversation hasn't stopped. We are thrilled to gather our favorite people in one place to celebrate the next chapter of our lives together.
                </p>
              </div>
            </div>
          </section>

          {/* The Day */}
          <section id="the-day" className="py-section-gap px-8 md:px-16 bg-surface-container-low">
            <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-7">
                <div className="mb-12">
                  <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-4">The Day</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">Saturday, September 14, 2026</p>
                  <p className="font-h2-editorial text-h2-editorial text-on-background mt-4">The Glass House</p>
                  <div className="w-12 h-px bg-outline opacity-30 mt-8" />
                </div>
                <div className="space-y-8">
                  {schedule.map((s, i) => (
                    <div key={s.time} className={`flex flex-col md:flex-row items-baseline gap-4 md:gap-12 ${i < schedule.length - 1 ? "pb-8 border-b border-outline/10" : ""}`}>
                      <div className="w-32 flex-shrink-0 font-label-caps text-label-caps text-on-surface-variant">{s.time}</div>
                      <div>
                        <h3 className="font-h2-editorial text-2xl text-on-background mb-2">{s.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">{s.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                {dayGrid.map(g => (
                  <figure key={g.caption} className="relative aspect-[4/5] overflow-hidden rounded-xl border border-outline/20 bg-surface-container">
                    <img alt={g.alt} className="w-full h-full object-cover" src={g.img} />
                    <div className={`absolute inset-0 mix-blend-multiply ${g.overlay}`} />
                    <figcaption className="absolute bottom-2 left-3 right-3 font-h2-editorial italic text-[11px] text-surface bg-on-background/55 backdrop-blur-sm px-2 py-1 rounded">{g.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Travel & Stay */}
          <section id="travel" className="py-section-gap px-8 md:px-16 max-w-container-max mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-8">Travel &amp; Stay</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">We have reserved a block of rooms at two local hotels for your convenience. Please book early, as September is a busy season in the valley.</p>
                <div className="space-y-12">
                  {hotels.map(h => (
                    <div key={h.name} className={`p-6 ${h.bg} border border-outline/10 hover:border-outline/30 transition-colors`}>
                      <h3 className="font-h2-editorial text-2xl text-on-background mb-2">{h.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-4">{h.note}</p>
                      <a className="inline-block border-b border-on-background font-label-caps text-label-caps uppercase pb-1 hover:opacity-70 transition-opacity" href="#">{h.cta}</a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[600px] bg-surface-variant relative border border-outline/20">
                <img alt="Map" className="w-full h-full object-cover opacity-80 mix-blend-multiply grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgzT43cst6biS6eda87byMobhzr5mzHuKwnn7ZaxH-SCsY6A8bdcQCOvw8g_p16sajfNdGzNFx398adHcUhZZ28fcJrx5gtBePyNboi5nGbXda-jqexUULQo3HEvcUZ00HMQRKcZkcd5esz3QFVHeJDZ2AuwddE9WmxwGPYNr2p7Z2ruy93wqtouM5yFa44Ty9luUdQFP05Yp79olG1-NNL6O9m9sIKFokXODa-t95ulDlpSxncmPamuQurIRkPpobbsqaZj-oQOw" />
                <div className="absolute inset-0 bg-secondary/10" />
              </div>
            </div>
          </section>

          {/* How we met · a small archive (STATIC IMAGE STRIP) */}
          <section id="archive" className="py-section-gap px-8 md:px-16 bg-surface-container-low">
            <div className="max-w-container-max mx-auto">
              <div className="text-center mb-16">
                <p className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-4">A small archive</p>
                <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-4">How we met</h2>
                <div className="w-12 h-px bg-outline mx-auto opacity-30" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {archive.map(a => (
                  <figure key={a.caption} className="relative">
                    <div className="aspect-square overflow-hidden border border-outline/20 bg-surface-container">
                      <img alt={a.alt} className="w-full h-full object-cover grayscale" src={a.img} />
                      <div className="absolute inset-0 bg-primary-fixed-dim/20 mix-blend-overlay" />
                    </div>
                    <figcaption className="font-h2-editorial italic text-xs text-on-surface-variant pt-2 tracking-wide">{a.caption}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="font-h2-editorial italic text-on-surface-variant text-center mt-12 max-w-2xl mx-auto">Eight years, eight places, one slow conversation that never quite ended. The full album lives at the venue — these eight are the postcards we kept.</p>
            </div>
          </section>

          {/* The story (sticky-photo + scrolling text) */}
          <section id="the-story" className="py-section-gap px-8 md:px-16">
            <div className="max-w-container-max mx-auto">
              <div className="text-center mb-20">
                <p className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-4">In four chapters</p>
                <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-4">The story</h2>
                <div className="w-12 h-px bg-outline mx-auto opacity-30" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <aside className="lg:col-span-5">
                  <div className="lg:sticky lg:top-32">
                    <div className="relative w-full aspect-[3/4] overflow-hidden border border-outline/20 bg-surface-container">
                      <img alt="A portrait" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOtsdLW3lPeNipqZ7On12BgQtEj_aJD6yfO99WRRolYRboYOErF6gWJf5tU33Gex-gV7Y4QDNBZRyKYEQuaTzjx8KogELWRAN--NBcMuY_S-uFAhhbCMgdB1zRqoaFr9i5GKJmNgCyi1yTVt6pray9MGbp67plq2UCfmRmYnIvYbxCDfBHQjkuvHPjGeX91Af2nb1qHDW28nP_lG50h4dlQzElVhH1ork0nHVnMC6UpuauQZ-h2m7PZcecXrdAakIedgGg_8kSAZU" />
                      <div className="absolute inset-0 bg-primary-fixed-dim/10 mix-blend-multiply" />
                    </div>
                    <p className="font-h2-editorial italic text-on-surface-variant text-sm pt-4">A photo of us, taken by a stranger on the morning we agreed.</p>
                  </div>
                </aside>
                <div className="lg:col-span-7 space-y-16">
                  {storyChapters.map(c => (
                    <article key={c.title}>
                      <p className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-3">{c.kicker}</p>
                      <h3 className="font-h2-editorial text-h2-editorial italic text-on-background mb-6">{c.title}</h3>
                      <p className="font-body-lg text-body-lg text-on-surface-variant text-justify">{c.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* The day · 14th September (alternating rows) */}
          <section id="the-day-detail" className="py-section-gap px-8 md:px-16 bg-surface-container-low">
            <div className="max-w-container-max mx-auto">
              <div className="text-center mb-20">
                <p className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-4">14th September, in three movements</p>
                <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-4">The day</h2>
                <div className="w-12 h-px bg-outline mx-auto opacity-30" />
              </div>
              <div className="space-y-20">
                {dayMovements.map((m, i) => {
                  const imageLeft = i % 2 === 0;
                  return (
                    <div key={m.time} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                      <div className={imageLeft ? "lg:col-span-7 order-2 lg:order-1" : "lg:col-span-7 lg:order-2"}>
                        <div className="aspect-[4/3] overflow-hidden border border-outline/20 bg-surface-container">
                          <img alt={m.alt} className="w-full h-full object-cover" src={m.img} />
                        </div>
                      </div>
                      <div className={imageLeft ? "lg:col-span-5 order-1 lg:order-2" : "lg:col-span-5 lg:order-1"}>
                        <p className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-3">{m.time}</p>
                        <h3 className="font-h2-editorial text-h2-editorial italic text-on-background mb-6">{m.title}</h3>
                        <p className="font-body-lg text-body-lg text-on-surface-variant text-justify">{m.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Travel & stay — Co. Wicklow (half-full-bleed image) */}
          <section id="travel-wicklow" className="py-section-gap pl-8 md:pl-16 pr-0 overflow-hidden">
            <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="pr-8 md:pr-16 lg:pr-0 max-w-xl">
                <p className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-4">Co. Wicklow · September</p>
                <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-10">Getting here</h2>
                <div className="space-y-8">
                  <p className="font-body-lg text-body-lg text-on-surface-variant text-justify">Most guests will fly into Dublin Airport, which sits about ninety minutes north of the venue by road. We have arranged two coaches from a central pickup point in Ballsbridge at midday on the Saturday — the route runs Dublin → Bray → Glendalough → on-site, with one stop for tea, and you do not need to book; just turn up. If you are driving yourself, the easier route is the M11 to Newtownmountkennedy, then the local road west into the valley; expect the last fifteen minutes to be slow, narrow, and very pretty.</p>
                  <p className="font-body-lg text-body-lg text-on-surface-variant text-justify">For accommodation we have ringfenced rooms at two places. The Glendalough Hotel is in the village itself, walking distance from a lake and good for guests travelling without a car. Brookwood House is a smaller country guesthouse three miles from the venue with a garden, eight rooms and an excellent breakfast — book this if you would like a quieter morning. Both are listed below with our shared booking codes; please do not delay, as both fill quickly in early September. There are also two pubs in the village renting a small number of rooms above the bar — message us for the names.</p>
                  <p className="font-body-lg text-body-lg text-on-surface-variant text-justify">On the day itself, we will run a small minibus loop between the two hotels and the venue, starting at one in the afternoon and finishing at one in the morning. There is no need to taxi. The venue gates close at midnight for the neighbours but the bar runs until two, and we have set aside a few simple bunks in the long barn for anyone who would prefer to stay on-site rather than make the journey back. If you have access requirements of any kind, please tell us on the RSVP and we will arrange whatever is needed in advance.</p>
                </div>
              </div>
              <div className="relative h-[420px] sm:h-[560px] lg:h-[680px] w-full lg:-mr-16">
                <img alt="Wicklow valley" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1900&q=80" />
                <div className="absolute inset-0 bg-primary-fixed-dim/15 mix-blend-multiply" />
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 bg-surface/90 backdrop-blur-sm border border-outline/20 p-5 sm:p-6 max-w-md">
                  <p className="font-h2-editorial italic text-on-background text-base sm:text-lg leading-snug">Brookwood Estate — Co. Wicklow</p>
                  <p className="font-body-md text-body-md text-on-surface-variant pt-2">Roughly 90 minutes from Dublin Airport. Coach from Ballsbridge at midday, Saturday 14th.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="py-section-gap px-8 md:px-16">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <p className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-4">Before you ask</p>
                <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-4">A few honest answers</h2>
                <div className="w-12 h-px bg-outline mx-auto opacity-30" />
              </div>
              <div className="divide-y divide-outline/15 border-t border-b border-outline/15">
                {faq.map(item => (
                  <details key={item.q} className="group py-6">
                    <summary className="flex justify-between items-baseline gap-6 cursor-pointer list-none">
                      <span className="font-h2-editorial italic text-on-background text-xl">{item.q}</span>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="font-body-lg text-body-lg text-on-surface-variant pt-4 text-justify">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP Form */}
          <section id="rsvp" className="py-section-gap px-8 md:px-16 bg-surface-container-high">
            <div className="max-w-3xl mx-auto bg-surface p-8 md:p-16 border border-outline/10 shadow-sm">
              <div className="text-center mb-12">
                <h2 className="font-h1-editorial text-h1-editorial italic text-on-background mb-4">RSVP</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Please reply by August 1st, 2026</p>
              </div>
              <form className="space-y-8">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="name">Guest Name(s)</label>
                  <input id="name" name="name" type="text" placeholder="Enter your full name" className={inputClass} />
                </div>
                <div className="pt-4">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-4">Will you be attending?</label>
                  <div className="flex gap-8">
                    {attendingOptions.map(o => (
                      <label key={o.value} className="flex items-center space-x-3 cursor-pointer group">
                        <input type="radio" name="attending" value={o.value} className="form-radio h-5 w-5 text-on-background border-outline/30 focus:ring-on-background focus:ring-offset-surface" />
                        <span className="font-body-md text-body-md text-on-background group-hover:opacity-80">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-4">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="dietary">Dietary Restrictions</label>
                  <input id="dietary" name="dietary" type="text" placeholder="Any allergies or preferences?" className={inputClass} />
                </div>
                <div className="pt-4">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="message">A Note for the Couple</label>
                  <textarea id="message" name="message" rows={3} placeholder="Optional" className={`${inputClass} resize-none`} />
                </div>
                <div className="pt-8 text-center">
                  <button type="submit" className="bg-on-background text-background px-12 py-4 font-label-caps text-label-caps uppercase hover:opacity-90 transition-opacity w-full md:w-auto">Send RSVP</button>
                </div>
              </form>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-20 px-8 bg-[#E8D5C7] dark:bg-stone-950 border-t border-stone-900/10 dark:border-stone-100/10 flex flex-col items-center justify-center space-y-8 text-center">
          <div className="font-serif italic text-lg text-stone-900 dark:text-stone-100 mb-4 font-h2-editorial">E&amp;M</div>
          <p className="font-serif text-sm uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-8">© 2024 Eoin &amp; Marlowe. Crafted with love.</p>
          <div className="flex space-x-6 font-serif text-sm uppercase tracking-widest">
            {footerLinks.map(l => (
              <a key={l.label} className="text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors" href={l.href}>{l.label}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
