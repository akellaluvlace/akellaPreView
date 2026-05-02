export default function T46TravelTour() {
  const navLinks = [
    { label: "Expeditions", href: "#", active: true },
    { label: "Our Story", href: "#" },
    { label: "Journal", href: "#" },
    { label: "Contact", href: "#" }
  ];

  const itinerary = [
    {
      title: "Days 1-3: The Golden Circle",
      desc: "Reykjavík, Thingvellir, Geysir, Gullfoss",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6Hzb3_Bvu_-zgCjKiVWFJ0DATgOYaTj-dBnwYYq5XP61N5vzC_Lcel-_TQvOYnTOqA2vd5VglNgPKeMTAhbzNaSF50g1Q4c1TI5kR_LOef_8l8UVRmNaUSvKSHds3bHHPOFDLfn2DXb2LSOPRTbd_dfywRcH6gPPMlGhlh8Oat1XO-ziUO-T-2L4W4gnTJmoeN1ggx3cxfyl5ezaYUH8WUcmgsj7SWXDFHzAo2a-6H5aGrlUuienzwvLwiuhz0aXALk63ekQ958",
      alt: "Powerful waterfall Gullfoss in Iceland cascading down rocky tiers under moody skies"
    },
    {
      title: "Day 4: Jökulsárlón Glacier Lagoon",
      desc: "Navigate between ancient icebergs calving from the Breiðamerkurjökull glacier on a private zodiac tour.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjq9OIF3hPLZeP01dp_g6J37nLYMxmG5EcUw2pfwyUB2q2x5ONXHrxqlvUM_Rsj88uECUoqwUcgMPXfdE2_UFQorGQ1Vug_XIBvMQCklZMHSGfNpDAvg6hIbXXlY_vzl9PmR_dx_HcsU3FNxGyszFZUb-sz0F4eZMwrASljh1NgpDoKGlOhYsQrPVvSBNofEd1CwcC_TOkJwhXww27_gOb3RznPOPFvXqSC6qel1WLjqq2InuKdaUsss-Rbg_YmIDnQXoWXO85CiY",
      alt: "Large blue icebergs floating in a still glacial lagoon in Iceland under a cloudy sky"
    }
  ];

  const included = [
    "Domestic Flights & Airport Transfers",
    "Premium 4x4 Transportation",
    "9 Nights in Luxury Wilderness Lodges",
    "All Meals (Curated Local Cuisine)",
    "Specialized Expedition Gear"
  ];

  const galleryImgs = [
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjQmopSdgBFNZ2Phll494y9JN1GAZv_6S5ZwYXQdhRE5JBSGVrLat-wqmHYzGNpe8I9J0Uw0S-bsh1hO2nQIFiEQaSKKIfYU3G_NmmEb0EMRKDHUX5AHo0NPJpgg1peMlbPdKB-GpRbCtdbjgvvRkPwSVJPb3blyGnoj0CEBTW3FUbN9X3ct7KeflXbrzP0Vj8OVfOdhcGRw63YfrVQdM2vDh85nojao1qIckP0cfV5MVTrtHaU53GN0lYUC8zJEn6PkYWM9fFrKo", alt: "Black sand beach in Iceland with white crashing waves and dark jagged rocks" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs6QMXDPoYaTMXPJlALCQM7bSr9XOAugXsi3iWluSnhtF_cu3u8RF7ZrDb2BfpEss1GVJno36P1BxvkADzcqvQXFc0SyDkS1ISAEzmLN5W36hYJQabqm8Vi8zDtGdugQmgcfo1WS5ou8oyvTIlSGUl2Rctjt3svcwYbo5328gHFHoW3XF06jKQYFaS1u1Dd3NthtaNjabk0PYW-J2HxWItkNtEbmeg2jo8nVUjuGLcMGmT-d18APaubb3qqy6deCxP-Y_t8Art-Cg", alt: "Vibrant green aurora borealis dancing over snowy mountains and a calm lake" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzAGxjQeCpTKes_XqsitYqVrE6QXmCWHm2mLqf3B0ubwjuPllsEmX22fTEARam9V9QH2qi3SpU3zEGV3yshyXPP7JZZ8Ugcotv8wemLZeYYXLUuVl43IbjnqUC71g69xt_yzwBBqdJcwU7fb89M8TuEFeFEZh0KnE_JioYlJA-akq3wwxEh1lAuTRVpSCrYIlc3J-tzK7-MPDgTJ0mK9PCQ-cldPtquAL1fKZfuwrujS3tiYKmW37EBJr4F4z3nFeUtqehpJZdusA", alt: "Dramatic wide shot of Skogafoss waterfall with a tiny figure for scale against green cliffs" }
  ];

  const tiers = [
    { title: "Solo Explorer", price: "$5,400", cta: "Select", popular: false },
    { title: "Couple / Shared", price: "$9,800", cta: "Select", popular: true },
    { title: "Private Group", price: "From $24,000", cta: "Inquire", popular: false }
  ];

  const footerLinks = ["FAQ", "Insurance", "Terms of Service", "Privacy", "Contact"];

  const stops = [
    { num: "01", name: "Hvalfjörður", coord: "64.36° N · whaling cove", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDC4gXqP0gK25UIo1OvdQ6dMnZgM8Lm7kvs6o9q8kOqFrUT1HE-s4Pap5De30nkKf2wlccoRzVoPD1UtHyybmjHc1m9VSLg09vGPSioNSOM2RXG4R7Ubv6uwlbEDpShQaTNd5y6irHYDXsb__5jQvlhB-VTAxkHGQT0U5uE49ZdFpVUj3gnTTvSttilSM4vECB_PxsrADdWmqgB5rhN9Uk724Xelwp6Vo_IFCp8PHBcCDy3H7AraMpt28mqT5_qxupUpmAXDdui6B8", alt: "Hvalfjörður fjord with low cloud and dark water" },
    { num: "02", name: "Akranes Light", coord: "64.32° N · headland beacon", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjQmopSdgBFNZ2Phll494y9JN1GAZv_6S5ZwYXQdhRE5JBSGVrLat-wqmHYzGNpe8I9J0Uw0S-bsh1hO2nQIFiEQaSKKIfYU3G_NmmEb0EMRKDHUX5AHo0NPJpgg1peMlbPdKB-GpRbCtdbjgvvRkPwSVJPb3blyGnoj0CEBTW3FUbN9X3ct7KeflXbrzP0Vj8OVfOdhcGRw63YfrVQdM2vDh85nojao1qIckP0cfV5MVTrtHaU53GN0lYUC8zJEn6PkYWM9fFrKo", alt: "Akranes lighthouse on basalt headland" },
    { num: "03", name: "Borgarfjörður", coord: "64.54° N · cold-river bend", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6Hzb3_Bvu_-zgCjKiVWFJ0DATgOYaTj-dBnwYYq5XP61N5vzC_Lcel-_TQvOYnTOqA2vd5VglNgPKeMTAhbzNaSF50g1Q4c1TI5kR_LOef_8l8UVRmNaUSvKSHds3bHHPOFDLfn2DXb2LSOPRTbd_dfywRcH6gPPMlGhlh8Oat1XO-ziUO-T-2L4W4gnTJmoeN1ggx3cxfyl5ezaYUH8WUcmgsj7SWXDFHzAo2a-6H5aGrlUuienzwvLwiuhz0aXALk63ekQ958", alt: "Borgarfjörður dawn with low fog over green tundra" },
    { num: "04", name: "Snæfellsnes", coord: "64.81° N · glacier crown", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjq9OIF3hPLZeP01dp_g6J37nLYMxmG5EcUw2pfwyUB2q2x5ONXHrxqlvUM_Rsj88uECUoqwUcgMPXfdE2_UFQorGQ1Vug_XIBvMQCklZMHSGfNpDAvg6hIbXXlY_vzl9PmR_dx_HcsU3FNxGyszFZUb-sz0F4eZMwrASljh1NgpDoKGlOhYsQrPVvSBNofEd1CwcC_TOkJwhXww27_gOb3RznPOPFvXqSC6qel1WLjqq2InuKdaUsss-Rbg_YmIDnQXoWXO85CiY", alt: "Snæfellsjökull glacier crown rising over a black-sand peninsula" },
    { num: "05", name: "Vatnsnes", coord: "65.34° N · seal lookout", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs6QMXDPoYaTMXPJlALCQM7bSr9XOAugXsi3iWluSnhtF_cu3u8RF7ZrDb2BfpEss1GVJno36P1BxvkADzcqvQXFc0SyDkS1ISAEzmLN5W36hYJQabqm8Vi8zDtGdugQmgcfo1WS5ou8oyvTIlSGUl2Rctjt3svcwYbo5328gHFHoW3XF06jKQYFaS1u1Dd3NthtaNjabk0PYW-J2HxWItkNtEbmeg2jo8nVUjuGLcMGmT-d18APaubb3qqy6deCxP-Y_t8Art-Cg", alt: "North coast tundra with lichen and standing pools" },
    { num: "06", name: "Mývatn Caldera", coord: "65.59° N · midge-lake", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjq9OIF3hPLZeP01dp_g6J37nLYMxmG5EcUw2pfwyUB2q2x5ONXHrxqlvUM_Rsj88uECUoqwUcgMPXfdE2_UFQorGQ1Vug_XIBvMQCklZMHSGfNpDAvg6hIbXXlY_vzl9PmR_dx_HcsU3FNxGyszFZUb-sz0F4eZMwrASljh1NgpDoKGlOhYsQrPVvSBNofEd1CwcC_TOkJwhXww27_gOb3RznPOPFvXqSC6qel1WLjqq2InuKdaUsss-Rbg_YmIDnQXoWXO85CiY", alt: "Mývatn caldera lake with steam vents along basalt rim" },
    { num: "07", name: "Berufjörður", coord: "64.74° N · cliff & thread", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzAGxjQeCpTKes_XqsitYqVrE6QXmCWHm2mLqf3B0ubwjuPllsEmX22fTEARam9V9QH2qi3SpU3zEGV3yshyXPP7JZZ8Ugcotv8wemLZeYYXLUuVl43IbjnqUC71g69xt_yzwBBqdJcwU7fb89M8TuEFeFEZh0KnE_JioYlJA-akq3wwxEh1lAuTRVpSCrYIlc3J-tzK7-MPDgTJ0mK9PCQ-cldPtquAL1fKZfuwrujS3tiYKmW37EBJr4F4z3nFeUtqehpJZdusA", alt: "East fjord cliff face with cascading thread waterfall" },
    { num: "08", name: "Höfn Tarn", coord: "64.25° N · final tarn", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjQmopSdgBFNZ2Phll494y9JN1GAZv_6S5ZwYXQdhRE5JBSGVrLat-wqmHYzGNpe8I9J0Uw0S-bsh1hO2nQIFiEQaSKKIfYU3G_NmmEb0EMRKDHUX5AHo0NPJpgg1peMlbPdKB-GpRbCtdbjgvvRkPwSVJPb3blyGnoj0CEBTW3FUbN9X3ct7KeflXbrzP0Vj8OVfOdhcGRw63YfrVQdM2vDh85nojao1qIckP0cfV5MVTrtHaU53GN0lYUC8zJEn6PkYWM9fFrKo", alt: "Industrial harbour and machinery near Höfn coast" }
  ];

  const kit = [
    {
      num: "01",
      title: "Vehicle · 4×4 with studded tires",
      body: "A modified Toyota Land Cruiser 70-series, lifted three inches, on 33-inch studded winter tires changed before the first freeze. The cabin holds four with full kit and a 90-litre fridge under the rear bench. We carry two spares, a second 65-litre jerry of diesel, and a hand-cranked winch with a fifteen-metre tree-strap. The vehicle is not a luxury — it is the difference between a closed F-road meaning detour and meaning bivouac. Tires get checked at every stop. The driver rotates twice a day so no one is ever piloting tired."
    },
    {
      num: "02",
      title: "Sleep · roof-tent or guesthouse stops",
      body: "Six of the ten nights are spent in a hard-shell roof-tent rated to minus eighteen, pitched on the vehicle's roof in under ninety seconds. The remaining four nights are pre-booked in family-run guesthouses in Akureyri, Egilsstaðir, Vík and Borgarnes. The mattress is thirteen centimetres of high-density foam and we provide down quilts, merino liners, sheepskin underlayers and silk pillowcases. You bring nothing for the bed beyond preference. We do not camp wild — every overnight has a permit and a host who knows we are coming."
    },
    {
      num: "03",
      title: "Cook · Trangia plus 5-litre jerry",
      body: "Lunches and most breakfasts are field-cooked on a twin-burner Trangia running on bioethanol from a sealed five-litre jerry stored in the rear hatch. Dinners alternate between guesthouse kitchens and a folding teak table set under the awning when weather permits. Menus lean on smoked Arctic char, lamb shoulder slow-braised the morning before, rye flatbreads from a baker in Hveragerði, skyr with crowberries, hot black coffee from a moka pot, and a single shot of Brennivín after sundown. Vegetarian and shellfish-free menus are pre-arranged at booking and never feel like an afterthought."
    },
    {
      num: "04",
      title: "Comms · sat beacon, no cell in interior",
      body: "From day five through day eight we are out of cellular reach for hours at a stretch. Each guest carries a Garmin inReach Mini paired to a personal phone over Bluetooth, with a daily check-in slot pre-set to the same time. The lead vehicle carries an Iridium 9575 sat-phone, a marine-band VHF, and a paper logbook of every overnight contact for the trip. We file a daily flight-plan with Icelandic SAR before leaving each guesthouse. Family at home gets a one-line \"okay\" pin on a private map twice a day, no app required."
    },
    {
      num: "05",
      title: "Layers · four-piece, fourteen-day rotation",
      body: "A fitted four-piece layer kit ships to your home two weeks before departure for sizing, then travels with us. Base is a 200-gram merino long-sleeve and tights from an Icelandic mill in Mosfellsbær. Mid is a 600-fill goose-down hooded sweater. Shell is a three-layer Gore-Tex Pro jacket with pit zips and salopette pants. Accents are two pairs of merino socks per day, glove liners, an outer mitt, a buff, and a wool watch cap. Everything except the shell rotates daily through the vehicle's tumble-dryer setup at each guesthouse. You will not be cold and you will not be wet."
    }
  ];

  const seeRows = [
    {
      label: "Glacier · I",
      title: "Vatnajökull, day 7",
      tag: "Day 07 · 64.41°N 16.66°W",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDC4gXqP0gK25UIo1OvdQ6dMnZgM8Lm7kvs6o9q8kOqFrUT1HE-s4Pap5De30nkKf2wlccoRzVoPD1UtHyybmjHc1m9VSLg09vGPSioNSOM2RXG4R7Ubv6uwlbEDpShQaTNd5y6irHYDXsb__5jQvlhB-VTAxkHGQT0U5uE49ZdFpVUj3gnTTvSttilSM4vECB_PxsrADdWmqgB5rhN9Uk724Xelwp6Vo_IFCp8PHBcCDy3H7AraMpt28mqT5_qxupUpmAXDdui6B8",
      alt: "Vatnajökull glacier tongue split by a moraine ridge under low overcast",
      body: "Vatnajökull is Europe's largest temperate glacier and you do not see it so much as feel it pull at the air pressure. We park at the south margin where Skaftafellsjökull tongues into the moraine, lace crampons, and walk an hour onto blue ice carved with millimetre-precise meltwater channels. Your guide reads the surface like a tidal chart — where the crevasses sing thin, where they snap shut, where to listen for the calving fronts a kilometre east. Most groups spend ninety minutes on ice. We give you four hours, with hot lemon tea waiting at the truck.",
      reverse: false
    },
    {
      label: "Caldera · II",
      title: "Mývatn, day 9",
      tag: "Day 09 · 65.59°N 16.99°W",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjq9OIF3hPLZeP01dp_g6J37nLYMxmG5EcUw2pfwyUB2q2x5ONXHrxqlvUM_Rsj88uECUoqwUcgMPXfdE2_UFQorGQ1Vug_XIBvMQCklZMHSGfNpDAvg6hIbXXlY_vzl9PmR_dx_HcsU3FNxGyszFZUb-sz0F4eZMwrASljh1NgpDoKGlOhYsQrPVvSBNofEd1CwcC_TOkJwhXww27_gOb3RznPOPFvXqSC6qel1WLjqq2InuKdaUsss-Rbg_YmIDnQXoWXO85CiY",
      alt: "Mývatn caldera with low cloud over basalt pseudo-craters at sunset",
      body: "Mývatn is a shallow caldera lake bored by a basaltic eruption two thousand years ago and held by a rim of pseudo-craters that rise like snare drums from the shoreline. We circle counter-clockwise, hike the rim of Hverfjall in the late afternoon when the light goes copper, and finish with a forty-minute soak at the Mývatn Nature Baths above the geothermal field. Steam rises off the surface in vertical columns when the wind drops below three knots. The hosts there know the expedition by name and reserve the far pool for our group.",
      reverse: true
    },
    {
      label: "Fjord · III",
      title: "East Fjord seal colony, day 11",
      tag: "Day 11 · 64.74°N 14.30°W",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjQmopSdgBFNZ2Phll494y9JN1GAZv_6S5ZwYXQdhRE5JBSGVrLat-wqmHYzGNpe8I9J0Uw0S-bsh1hO2nQIFiEQaSKKIfYU3G_NmmEb0EMRKDHUX5AHo0NPJpgg1peMlbPdKB-GpRbCtdbjgvvRkPwSVJPb3blyGnoj0CEBTW3FUbN9X3ct7KeflXbrzP0Vj8OVfOdhcGRw63YfrVQdM2vDh85nojao1qIckP0cfV5MVTrtHaU53GN0lYUC8zJEn6PkYWM9fFrKo",
      alt: "East Fjord cliff with cold sea and distant seal colony rocks",
      body: "By day eleven the road has thinned to a single switchbacked lane along Berufjörður, and the harbour seals have hauled out on the rock spurs at the mouth of the fjord. We approach by sea-kayak with a marine biologist who has been counting this colony for nineteen years. The protocol is strict — no closer than forty metres, no flash, voices at half. Most of the four-hour window is spent floating, drifting, watching mothers and pups roll over and back into the water. Lunch is hot chowder and rye bread from a thermos held between knees.",
      reverse: false
    }
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Serif:wght@400;500&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "background": "#f9f9ff", "on-background": "#111c2c",
                "surface": "#f9f9ff", "surface-bright": "#f9f9ff", "surface-dim": "#cfdaf1", "surface-variant": "#d8e3fa",
                "surface-container-lowest": "#ffffff", "surface-container-low": "#f0f3ff", "surface-container": "#e7eeff", "surface-container-high": "#dee8ff", "surface-container-highest": "#d8e3fa",
                "on-surface": "#111c2c", "on-surface-variant": "#43474c",
                "primary": "#03192a", "on-primary": "#ffffff", "primary-container": "#1a2e40", "on-primary-container": "#8296ab", "primary-fixed": "#d0e5fd", "primary-fixed-dim": "#b4c9e0", "on-primary-fixed": "#071d2e", "on-primary-fixed-variant": "#35495c",
                "secondary": "#625e50", "on-secondary": "#ffffff", "secondary-container": "#e9e2d0", "on-secondary-container": "#686456", "secondary-fixed": "#e9e2d0", "secondary-fixed-dim": "#ccc6b5", "on-secondary-fixed": "#1e1c11", "on-secondary-fixed-variant": "#4a473a",
                "tertiary": "#001d0f", "on-tertiary": "#ffffff", "tertiary-container": "#00341e", "on-tertiary-container": "#35a771", "tertiary-fixed": "#8bf8bc", "tertiary-fixed-dim": "#6edba1", "on-tertiary-fixed": "#002111", "on-tertiary-fixed-variant": "#005232",
                "error": "#ba1a1a", "on-error": "#ffffff", "error-container": "#ffdad6", "on-error-container": "#93000a",
                "outline": "#74777d", "outline-variant": "#c3c7cd", "surface-tint": "#4d6074", "inverse-surface": "#263142", "inverse-on-surface": "#ebf1ff", "inverse-primary": "#b4c9e0"
              },
              spacing: {
                unit: "8px",
                "container-max": "1280px",
                "margin-edge": "64px",
                gutter: "32px",
                "section-gap": "128px"
              },
              fontFamily: {
                "headline-sm": ["Noto Serif"],
                "headline-md": ["Noto Serif"],
                "headline-lg": ["Noto Serif"],
                "display-hero": ["Noto Serif"],
                "body-lg": ["Inter"],
                "body-md": ["Inter"],
                "label-caps": ["Inter"],
                button: ["Inter"]
              },
              fontSize: {
                "headline-sm": ["24px", { lineHeight: "1.4", fontWeight: "500" }],
                "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "400" }],
                "headline-lg": ["48px", { lineHeight: "1.2", fontWeight: "400" }],
                "display-hero": ["72px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
                "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
                button: ["14px", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "500" }]
              }
            }
          }
        };
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .glacier-shadow {
          box-shadow: 0 10px 40px -10px rgba(3, 25, 42, 0.15);
        }
      ` }} />

      <div className="light bg-[#F4EDDB] text-on-background antialiased selection:bg-tertiary-fixed-dim selection:text-tertiary-container">
        {/* TopAppBar */}
        <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-xl dark:bg-slate-950/20 border-b border-slate-900/10 dark:border-slate-50/10 ease-in-out duration-300">
          <div className="flex justify-between items-center px-8 md:px-16 py-8 w-full max-w-container-max mx-auto">
            <a className="text-2xl font-serif tracking-tighter text-slate-900 dark:text-slate-50 font-display-hero" href="#">Northward</a>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className={
                    l.active
                      ? "font-serif text-xs uppercase tracking-[0.2em] font-medium text-slate-900 dark:text-slate-50 border-b-2 border-emerald-500 pb-1"
                      : "font-serif text-xs uppercase tracking-[0.2em] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 hover:text-emerald-600 transition-colors duration-500"
                  }
                >
                  {l.label}
                </a>
              ))}
            </div>
            <button className="bg-primary text-on-primary font-button text-button px-6 py-3 rounded hover:bg-primary-container transition-colors duration-300">Reserve Now</button>
          </div>
        </nav>

        <main>
          {/* Hero */}
          <section className="relative h-screen w-full flex items-center justify-center">
            <div className="absolute inset-0 z-0">
              <img alt="Dramatic Icelandic glacier valley with steep dark mountains and overcast moody sky" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC4gXqP0gK25UIo1OvdQ6dMnZgM8Lm7kvs6o9q8kOqFrUT1HE-s4Pap5De30nkKf2wlccoRzVoPD1UtHyybmjHc1m9VSLg09vGPSioNSOM2RXG4R7Ubv6uwlbEDpShQaTNd5y6irHYDXsb__5jQvlhB-VTAxkHGQT0U5uE49ZdFpVUj3gnTTvSttilSM4vECB_PxsrADdWmqgB5rhN9Uk724Xelwp6Vo_IFCp8PHBcCDy3H7AraMpt28mqT5_qxupUpmAXDdui6B8" />
              <div className="absolute inset-0 bg-primary/30" />
            </div>
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-24">
              <h1 className="font-display-hero text-display-hero text-on-primary mb-6 drop-shadow-lg">The Ring Road, Ten Days</h1>
              <p className="font-body-lg text-body-lg text-on-primary/90 mb-2">Reykjavík to Reykjavík, September 2026</p>
              <p className="font-body-lg text-body-lg text-on-primary/90 mb-8">Dates: Sept 12 - 21 • From $5,400</p>
              <button className="bg-tertiary-fixed-dim text-tertiary-container font-button text-button px-8 py-4 rounded hover:bg-tertiary-fixed transition-colors duration-300">Reserve my spot</button>
            </div>
          </section>

          {/* Trip Overview Map */}
          <section className="py-section-gap px-margin-edge max-w-container-max mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              <div className="lg:col-span-4">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-6">The Route</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8">Circumnavigate the raw beauty of Iceland. From the geothermal wonders of the Golden Circle to the desolate, breathtaking East Fjords, this route covers the island's most iconic landscapes.</p>
              </div>
              <div className="lg:col-span-8 bg-surface p-4 rounded-xl glacier-shadow">
                <img alt="Minimalist map of Iceland showing a circular route with destination pins" className="w-full h-auto rounded-lg grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD05TaTDYnXPY6Q3pcmmzSiydrBLU3d_WnjU6qlZGqJOo62IYMelnt2_u7U6NC7BlrzzJtfo240Jwqcqy2YDpWH5WgNsATevvffErPyiZ-6sitRAm0-3Q07mUt5uoux9kIzN_5MzF354kJ54Y2RNhUANsmSja33n_2PkQcCI06esdds-LtZaJBY8Ew7nPMcnM_p6aANOeop1-lPhZHHeViS4d1AABt5zsdt90g2d98htmPwg61oxmUweTSeAnFfO1f_z7oxbLnDsJc" />
              </div>
            </div>
          </section>

          {/* Day by Day Itinerary */}
          <section className="py-section-gap px-margin-edge bg-surface-container-low">
            <div className="max-w-container-max mx-auto">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-16 text-center">Day by Day</h2>
              <div className="space-y-8">
                {itinerary.map(d => (
                  <div key={d.title} className="flex flex-col md:flex-row gap-8 bg-[#F4EDDB] p-8 rounded-xl glacier-shadow">
                    <div className="md:w-1/3">
                      <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{d.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{d.desc}</p>
                    </div>
                    <div className="md:w-2/3">
                      <img alt={d.alt} className="w-full h-64 object-cover rounded-lg mb-4" src={d.img} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What's Included & Guide */}
          <section className="py-section-gap px-margin-edge max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-12">What's Included</h2>
              <ul className="space-y-6">
                {included.map(item => (
                  <li key={item} className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="font-body-lg text-body-lg text-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-12">Meet Your Guide</h2>
              <div className="bg-surface p-8 rounded-xl glacier-shadow flex flex-col md:flex-row gap-8 items-center">
                <img alt="Professional portrait of a rugged expedition guide in outdoor gear standing in an icy landscape" className="w-48 h-48 object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0Cn3Q7vSBQhZTTxwZLBhn9suf9gRMD_SJZDq65S53EC_8bEr8YAeiqbxKizP9D3BGJ7jqgJXuTGMeczlp63J_RaoKhcEnG_Z2vJZeQJrrGxoZ9D50RObjnrLZW95HFklqeyepZsrG6kTg1eiI5q5qaSfHI24HhSJc5zteflhwNapNLa7sLIO1A_aKdtBoUrwUTUlk5H3oy2VQ7S_PMM5KPr4_9n553sCTvqZiLL3wxaS9c_wEA1NEtS_7VVJ-EhjXrlN8-5H3FZg" />
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Erik, Expedition Lead</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">With over 15 years of trekking the Icelandic Highlands, Erik brings unparalleled local knowledge and a passion for raw, untouched landscapes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="py-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {galleryImgs.map(g => (
                <img key={g.alt} alt={g.alt} className="w-full h-80 object-cover" src={g.src} />
              ))}
            </div>
          </section>

          {/* On the road · Static stops strip (NEW) */}
          <section className="py-section-gap px-margin-edge max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-[0.25em] mb-3">Field map · 02</p>
                <h2 className="font-headline-lg text-headline-lg text-primary">On the road · stops 01–08</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Eight standing stops along the ring road. Each has been scouted in mid-September, the same window your expedition will run. Tile order matches drive order — start at Hvalfjörður, end at the final tarn before Reykjavík.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {stops.map(s => (
                <figure key={s.num} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg bg-primary-fixed-dim/15 relative">
                    <img alt={s.alt} className="w-full h-full object-cover mix-blend-luminosity" src={s.img} />
                    <div className="absolute inset-0 bg-primary-fixed-dim/15 mix-blend-overlay pointer-events-none" />
                  </div>
                  <figcaption className="mt-3">
                    <p className="font-label-caps text-label-caps text-on-tertiary-container tabular-nums uppercase">Stop {s.num}</p>
                    <p className="font-headline-sm text-headline-sm italic text-primary mt-1 leading-tight" style={{ fontSize: "18px" }}>{s.name}</p>
                    <p className="font-body-md text-on-surface-variant mt-1" style={{ fontSize: "13px" }}>{s.coord}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* What's in the kit · sticky-photo + scrolling text (NEW) */}
          <section className="py-section-gap px-margin-edge max-w-container-max mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-5">
                <div className="md:sticky md:top-32 md:self-start">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl glacier-shadow bg-surface-container">
                    <img alt="Expedition kit laid out on a slate floor inside the truck before the first morning" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs6QMXDPoYaTMXPJlALCQM7bSr9XOAugXsi3iWluSnhtF_cu3u8RF7ZrDb2BfpEss1GVJno36P1BxvkADzcqvQXFc0SyDkS1ISAEzmLN5W36hYJQabqm8Vi8zDtGdugQmgcfo1WS5ou8oyvTIlSGUl2Rctjt3svcwYbo5328gHFHoW3XF06jKQYFaS1u1Dd3NthtaNjabk0PYW-J2HxWItkNtEbmeg2jo8nVUjuGLcMGmT-d18APaubb3qqy6deCxP-Y_t8Art-Cg" />
                    <div className="absolute inset-0 bg-primary/15 mix-blend-multiply pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
                      <p className="font-label-caps text-label-caps text-on-primary uppercase tracking-[0.3em] drop-shadow-[0_2px_8px_rgba(3,25,42,0.85)]">Kit · 14 days</p>
                      <span className="font-label-caps text-label-caps text-on-primary/80 uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(3,25,42,0.85)]">PLATE · II</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7">
                <p className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-[0.25em] mb-3">Field manifest · 03</p>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-3">What's in the kit</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-12 max-w-xl">Each Northward expedition is built around a five-piece kit philosophy. We obsess over redundancy where it matters and shave grams everywhere it does not. What follows is the full inventory you will be travelling with — vehicle, sleep, cook, comms, and layers — and the rationale behind each call.</p>
                <ol className="space-y-10">
                  {kit.map(k => (
                    <li key={k.num} className="border-t border-outline-variant/40 pt-8">
                      <div className="flex items-baseline gap-4 mb-3">
                        <span className="font-label-caps text-label-caps text-on-tertiary-container tabular-nums">{k.num}</span>
                        <h3 className="font-headline-sm text-headline-sm text-primary">{k.title}</h3>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface">{k.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* What you'll see · alt rows (NEW) */}
          <section className="py-section-gap px-margin-edge max-w-container-max mx-auto">
            <div className="mb-16 max-w-2xl">
              <p className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-[0.25em] mb-3">Field record · 04</p>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-4">What you'll see</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Three landscapes from the second week — the days the road quiets and the country starts to read like a geological essay. Each entry is a place you will stand in for at least three hours, with time built in for the weather to change its mind.</p>
            </div>
            <div className="space-y-24">
              {seeRows.map(r => (
                <article key={r.title} className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
                  <div className={r.reverse ? "md:col-span-5 md:order-1" : "md:col-span-7"}>
                    {r.reverse ? (
                      <>
                        <p className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-[0.2em] mb-3">{r.label}</p>
                        <h3 className="font-headline-md text-headline-md text-primary mb-4 italic">{r.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface">{r.body}</p>
                      </>
                    ) : (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl glacier-shadow">
                        <img alt={r.alt} className="w-full h-full object-cover" src={r.img} />
                        <div className="absolute inset-0 bg-primary/25 mix-blend-multiply pointer-events-none" />
                        <div className="absolute bottom-4 left-4 bg-background/85 backdrop-blur px-3 py-1 rounded-full">
                          <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest tabular-nums">{r.tag}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={r.reverse ? "md:col-span-7 md:order-2" : "md:col-span-5"}>
                    {r.reverse ? (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl glacier-shadow">
                        <img alt={r.alt} className="w-full h-full object-cover" src={r.img} />
                        <div className="absolute inset-0 bg-primary/25 mix-blend-multiply pointer-events-none" />
                        <div className="absolute bottom-4 right-4 bg-background/85 backdrop-blur px-3 py-1 rounded-full">
                          <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest tabular-nums">{r.tag}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-label-caps text-label-caps text-on-tertiary-container uppercase tracking-[0.2em] mb-3">{r.label}</p>
                        <h3 className="font-headline-md text-headline-md text-primary mb-4 italic">{r.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface">{r.body}</p>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Reserve CTA */}
          <section className="py-section-gap px-margin-edge bg-primary text-on-primary">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-headline-lg text-headline-lg mb-8">Secure Your Place</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {tiers.map(t => (
                  <div key={t.title} className={`${t.popular ? "border border-tertiary-fixed-dim" : "border border-on-primary/20"} p-8 rounded-lg relative`}>
                    {t.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary-fixed-dim text-tertiary-container font-label-caps text-label-caps px-3 py-1 rounded-full">POPULAR</div>
                    )}
                    <h3 className="font-headline-sm text-headline-sm mb-4">{t.title}</h3>
                    <p className="font-body-lg text-body-lg mb-6">{t.price}</p>
                    <button className={
                      t.popular
                        ? "w-full bg-tertiary-fixed-dim text-tertiary-container font-button text-button px-6 py-3 rounded hover:bg-tertiary-fixed transition-colors duration-300"
                        : "w-full border border-on-primary text-on-primary font-button text-button px-6 py-3 rounded hover:bg-on-primary hover:text-primary transition-colors duration-300"
                    }>
                      {t.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#F4EDDB] dark:bg-slate-950 w-full mt-32 border-t border-slate-900/5 dark:border-slate-50/5">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-24 flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <div className="text-xl font-serif text-slate-900 dark:text-slate-50 mb-8">Northward</div>
              <p className="font-serif text-[10px] uppercase tracking-widest leading-loose text-slate-900 dark:text-slate-300">© 2026 Northward Expeditions. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-8">
              {footerLinks.map(l => (
                <a key={l} className="font-serif text-[10px] uppercase tracking-widest leading-loose text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:opacity-70 transition-opacity" href="#">{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
