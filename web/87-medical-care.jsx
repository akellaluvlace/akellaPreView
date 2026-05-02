const PRACTITIONERS = [
  {
    specialty: "General Practice",
    name: "Dr. Aoife Fitzgerald",
    creds: "MB BCh BAO · MICGP · 14 yrs",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=85&auto=format&fit=crop",
    alt: "Dr. Aoife Fitzgerald, lead general practitioner, in clinical attire",
  },
  {
    specialty: "Women's Health",
    name: "Dr. Marcus Chen",
    creds: "MRCOG · DFSRH · 11 yrs",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=85&auto=format&fit=crop",
    alt: "Dr. Marcus Chen, women's health specialist, smiling warmly in office setting",
  },
  {
    specialty: "Paediatrics",
    name: "Dr. Niamh O'Brien",
    creds: "MRCPI(Paeds) · IBCLC · 9 yrs",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=85&auto=format&fit=crop",
    alt: "Dr. Niamh O'Brien, paediatrician, with stethoscope around neck in bright examination room",
  },
  {
    specialty: "Mental Health",
    name: "Dr. Jonathan Walsh",
    creds: "MRCPsych · CBT · 16 yrs",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=85&auto=format&fit=crop",
    alt: "Dr. Jonathan Walsh, mental health specialist, in a softly-lit consultation room",
  },
];

const CLINIC_ROOMS = [
  {
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&q=85&auto=format&fit=crop",
    alt: "Sun-lit reception lounge with soft sage walls and a low timber bench",
    altThumb: "Reception lounge thumbnail",
    delay: "0s",
  },
  {
    img: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1400&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&q=85&auto=format&fit=crop",
    alt: "Bright general consultation room with natural wood furnishings and indoor plants",
    altThumb: "Consultation room thumbnail",
    delay: "4s",
  },
  {
    img: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1400&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=85&auto=format&fit=crop",
    alt: "Calming paediatric examination corner with warm tones and a child-friendly reading nook",
    altThumb: "Paediatric corner thumbnail",
    delay: "8s",
  },
  {
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1400&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=85&auto=format&fit=crop",
    alt: "Quiet treatment room with linen curtains, soft chair and warm lighting",
    altThumb: "Treatment room thumbnail",
    delay: "12s",
  },
];

const SPECIALTIES = [
  {
    n: "No. 01 · Cardiology",
    title: "Heart health, made approachable",
    body: "In-clinic ECG, blood pressure ambulatory tracking, and lifestyle programmes for primary and secondary cardiovascular prevention — supported by direct referral pathways to Mater consultants.",
    bullets: ["24-hour ECG & ambulatory BP", "Cholesterol & risk panels", "Cardiac rehab pathway"],
    img: "https://images.unsplash.com/photo-1631563019676-dade0dbdb8fc?w=1400&q=85&auto=format&fit=crop",
    alt: "Cardiologist studying an ECG readout on a high-resolution display",
    reverse: false,
  },
  {
    n: "No. 02 · Dermatology",
    title: "Skin assessment without the wait",
    body: "Full-body mole mapping, dermoscopy, minor surgical excision, and treatment plans for acne, eczema, psoriasis and rosacea — most concerns reviewed within 5 working days.",
    bullets: ["Digital mole mapping", "In-clinic minor procedures", "Same-week pathology turnaround"],
    img: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1400&q=85&auto=format&fit=crop",
    alt: "Dermatologist examining patient skin with a dermatoscope under cool, even light",
    reverse: true,
  },
  {
    n: "No. 03 · Musculoskeletal",
    title: "Movement, restored steadily",
    body: "Joint & back assessments, in-clinic ultrasound-guided injections, and a partnered physiotherapy programme — designed to return you to full activity without unnecessary imaging or waiting lists.",
    bullets: ["Ultrasound-guided injections", "6-week physio programmes", "Sports & injury rehab"],
    img: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=1400&q=85&auto=format&fit=crop",
    alt: "Physiotherapist guiding a patient through a recovery exercise in a sun-lit movement studio",
    reverse: false,
  },
];

const JOURNEY = [
  {
    step: "Step 01",
    title: "Inquiry",
    body: "Online or by phone, in under 90 seconds. No referral needed.",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=85&auto=format&fit=crop",
    alt: "Patient using a phone to book a clinic appointment",
    status: "done",
  },
  {
    step: "Step 02",
    title: "Consultation",
    body: "A 30-minute conversation. We listen, examine, and explain.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=85&auto=format&fit=crop",
    alt: "Doctor and patient in conversation during consultation",
    status: "done",
  },
  {
    step: "Step 03 · Live",
    title: "Personal Plan",
    body: "Co-created with your practitioner. Sent to your portal within 24 hours.",
    img: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&q=85&auto=format&fit=crop",
    alt: "Care plan being prepared on a tablet in a consultation room",
    status: "current",
  },
  {
    step: "Step 04",
    title: "Treatment",
    body: "In-clinic procedures, medication, or onward referral — coordinated end-to-end.",
    img: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=600&q=85&auto=format&fit=crop",
    alt: "Treatment instruments laid out neatly on a clinical surface",
    status: "upcoming",
  },
  {
    step: "Step 05",
    title: "Follow-up",
    body: "A scheduled check-in by your practitioner — every plan ends with a review.",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=85&auto=format&fit=crop",
    alt: "A practitioner reviewing notes with a patient at a follow-up appointment",
    status: "upcoming",
  },
];

const STORIES = [
  {
    name: "Sarah M.",
    program: "Cardiology · 2 yrs",
    quote: "Wellbrook caught my arrhythmia the first week. Two years on, I'm running again. They explain everything — and they don't rush.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=85&auto=format&fit=crop&crop=faces",
    alt: "Portrait of Sarah M., patient",
  },
  {
    name: "Daniel O.",
    program: "General · 4 yrs",
    quote: "Same-day actually means same-day. I had a sore throat at 9am, was seen by 11, prescription in hand by noon. That never used to happen.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=85&auto=format&fit=crop&crop=faces",
    alt: "Portrait of Daniel O., patient",
  },
  {
    name: "Helena R.",
    program: "Paediatrics · 6 yrs",
    quote: "Both kids actually look forward to going. Dr. O'Brien remembers the smallest details — what they're reading, who their best friend is. It matters.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=85&auto=format&fit=crop&crop=faces",
    alt: "Portrait of Helena R., patient",
  },
];

const FAQS = [
  {
    q: "Do I need a referral to be seen?",
    a: "No referral is required for general practice or any of our specialty programmes. Walk-ins are welcome between 8am and 6pm; same-day slots typically open at 7am for that day.",
  },
  {
    q: "Which insurance providers do you accept?",
    a: "VHI, Laya, Irish Life Health and HSF — direct settlement on most consultations. We provide an itemised receipt for any out-of-pocket fees so you can claim back in minutes.",
  },
  {
    q: "How quickly can I get test results?",
    a: "Standard blood work returns in 24–48 hours via your patient portal. Pathology and imaging are usually back within 5 working days; urgent results trigger a same-day phone call from your practitioner.",
  },
  {
    q: "Do you offer telehealth consultations?",
    a: "Yes — repeat-prescription reviews, mental health follow-ups and many general consultations can be done by secure video call. Booking flow is identical; just choose \"video\" instead of \"in-clinic\".",
  },
  {
    q: "Is there parking on site?",
    a: "Six on-site spaces (one accessible) plus the public lot at Wellington Place two minutes away. Pearse Street DART is a 6-minute walk; bicycle parking is covered, secured and at street level.",
  },
];

function MedicalCare() {
  return (
    <>
      {/* head */}
      <title>Wellbrook Clinic | Modern Care, Same-Day Appointments</title>
      <meta name="description" content="Wellbrook Clinic offers modern, comprehensive healthcare with same-day appointments in a calm, welcoming environment in the heart of Dublin." />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        "sage": "#EFF4EE",
                        "pine": "#2D4A3D",
                        "offwhite": "#F9F6F0",
                        "terracotta": "#C97A5A",
                        "surface": "#f6fbf5",
                        "on-surface": "#171d19",
                        "on-surface-variant": "#424844",
                        "primary-container": "#2d4a3d",
                        "on-primary": "#ffffff"
                    },
                    fontFamily: {
                        "headline-sm": ["Manrope", "sans-serif"],
                        "display-md": ["Manrope", "sans-serif"],
                        "display-lg": ["Manrope", "sans-serif"],
                        "headline-lg": ["Manrope", "sans-serif"],
                        "body-sm": ["Inter", "sans-serif"],
                        "label-caps": ["Inter", "sans-serif"],
                        "body-lg": ["Inter", "sans-serif"],
                        "body-md": ["Inter", "sans-serif"]
                    },
                    fontSize: {
                        "headline-sm": ["clamp(1.125rem, 1vw + 1rem, 1.25rem)", { lineHeight: "1.4", fontWeight: "600" }],
                        "display-md": ["clamp(1.75rem, 3vw + 1rem, 2.25rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
                        "display-lg": ["clamp(2.25rem, 4vw + 1rem, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
                        "headline-lg": ["clamp(1.25rem, 2vw + 1rem, 1.5rem)", { lineHeight: "1.4", fontWeight: "600" }],
                        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
                        "label-caps": ["0.75rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700", textTransform: "uppercase" }],
                        "body-lg": ["clamp(1rem, 1vw + 0.875rem, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }],
                        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }]
                    }
                }
            }
        }
` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { overflow-x: clip; }
        .full-bleed {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
            max-width: none;
        }
        @media (prefers-reduced-motion: no-preference) {
            html { scroll-behavior: smooth; }
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .shadow-soft {
            box-shadow: 0px 4px 20px rgba(45, 74, 61, 0.05);
        }
        .shadow-soft-hover:hover {
            box-shadow: 0px 12px 30px rgba(45, 74, 61, 0.08);
        }
        ::selection {
            background-color: rgba(201, 122, 90, 0.2);
            color: #2D4A3D;
        }
        @keyframes clinic-fade {
            0%, 4%   { opacity: 0; filter: blur(16px) saturate(0.85); transform: scale(1.04); }
            8%, 22%  { opacity: 1; filter: blur(0)    saturate(1);    transform: scale(1); }
            26%, 100%{ opacity: 0; filter: blur(16px) saturate(0.85); transform: scale(1.04); }
        }
        .clinic-cycle-img {
            animation: clinic-fade 16s linear infinite;
            opacity: 0;
            filter: blur(16px) saturate(0.85);
            transform: scale(1.04);
            will-change: opacity, filter, transform;
        }
        @keyframes clinic-indicator {
            0%, 4%   { opacity: 0.25; }
            8%, 22%  { opacity: 1; }
            26%, 100%{ opacity: 0.25; }
        }
        .clinic-indicator { animation: clinic-indicator 16s linear infinite; }
        @keyframes clinic-scrub {
            0%   { transform: scaleX(0); }
            100% { transform: scaleX(1); }
        }
        .clinic-scrub-bar { animation: clinic-scrub 16s linear infinite; transform-origin: left; }

        @keyframes wb-pulse {
            0%, 100% { opacity: 0.7; box-shadow: 0 0 0 0 rgba(201, 122, 90, 0.4); }
            50%      { opacity: 1;   box-shadow: 0 0 0 10px rgba(201, 122, 90, 0); }
        }
        .wb-pulse { animation: wb-pulse 2.6s ease-in-out infinite; }

        .wb-faq summary::-webkit-details-marker { display: none; }
        .wb-faq summary { list-style: none; cursor: pointer; }
        .wb-faq summary .wb-chevron { transition: transform 250ms ease; }
        .wb-faq[open] summary .wb-chevron { transform: rotate(180deg); }

        @media (prefers-reduced-motion: reduce) {
            .clinic-cycle-img,
            .clinic-indicator,
            .clinic-scrub-bar,
            .wb-pulse {
                animation: none !important;
            }
            .clinic-cycle-img:first-of-type {
                opacity: 1;
                filter: none;
                transform: none;
            }
            .wb-faq summary .wb-chevron { transition: none; }
        }
` }} />

      {/* body wrapper */}
      <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">

        {/* TopNavBar */}
        <header className="bg-sage/95 backdrop-blur-sm sticky top-0 z-50 border-b border-pine/10 transition-colors duration-300">
          <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1200px] mx-auto">
            <a href="/" className="text-xl md:text-2xl font-bold text-pine tracking-tighter hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-sage rounded-sm">
              Wellbrook Clinic
            </a>

            <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
              <a href="#services" className="text-pine border-b-2 border-terracotta pb-1 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm transition-all" aria-current="page">Services</a>
              <a href="#practitioners" className="text-pine/70 hover:text-pine font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm transition-colors duration-200">Practitioners</a>
              <a href="#patient-info" className="text-pine/70 hover:text-pine font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm transition-colors duration-200">Patient Info</a>
              <a href="#contact" className="text-pine/70 hover:text-pine font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm transition-colors duration-200">Contact</a>
            </nav>

            <div className="flex items-center gap-6">
              <a href="tel:+35312345678" className="text-pine font-semibold hidden lg:inline-flex hover:text-terracotta transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-sm">+353 1 234 5678</a>
              <a href="#book" className="bg-terracotta text-white px-5 py-2.5 rounded-lg font-label-caps tracking-wider hover:bg-[#b86b4d] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-sage transition-all shadow-sm">
                <span className="hidden sm:inline">Book Appointment</span>
                <span className="sm:hidden">Book</span>
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1">

          {/* Hero */}
          <section id="book" className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center scroll-margin-top-32">
            <div className="flex flex-col gap-8 md:gap-10">
              <div className="max-w-prose">
                <h1 className="font-display-lg text-pine mb-6 text-balance">Modern care, same-day appointments</h1>
                <p className="font-body-lg text-pine/80 text-pretty leading-relaxed">Experience clinical excellence in a calm, welcoming environment right in the heart of Dublin. Our dedicated team provides personalized, compassionate care tailored to your unique needs, ensuring your health is always our priority.</p>
              </div>

              <div className="bg-offwhite p-6 md:p-8 rounded-xl shadow-soft border border-pine/5">
                <h2 className="font-headline-sm text-pine mb-6 text-balance">Request a Visit</h2>
                <form className="flex flex-col gap-5" action="#" method="POST">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="appointment-date" className="font-label-caps text-pine/70">Select Date</label>
                    <input id="appointment-date" name="appointment-date" className="w-full border border-pine/20 rounded-lg p-3 bg-transparent text-pine placeholder:text-pine/40 transition-colors hover:border-pine/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:border-transparent tabular-nums cursor-pointer" type="date" required aria-required="true" />
                  </div>
                  <button type="submit" className="bg-terracotta text-white py-3.5 px-6 rounded-lg font-label-caps tracking-wider mt-2 hover:bg-[#b86b4d] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite transition-all w-full flex items-center justify-center gap-2 group shadow-sm">
                    Submit Request
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-square shadow-soft w-full bg-pine/5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZnH_x-o_hSMI_Y-esqv6g1uXsBwC8T_tuYSqaOTIAbJzHiTCw_cAq5LZ6--8EmB2a8Qj1SISQSnuYd9k49-mSRHO0EhXf0AP8U5mDqi7jLcodghjpKyKVTIlthPykjKgLAMlLDZFv3X_n9j0fWi24t0dBUh2By_Gps89Xg-fMHV6qcNLpt-ioD6bfVUyR8tuK9phvggMOdn6yEf5uBrHPN0ytgO6YFAWSLQc3G9Z_tpYIscfwkAY0aclXNsRAWLvH5e2KhB4FG28"
                alt="Warm, inviting medical clinic waiting area with soft sage walls, comfortable light wood chairs, and natural sunlight"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                width="600"
                height="600"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </section>

          {/* Practitioners — 4-column portrait grid */}
          <section id="practitioners" className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 scroll-margin-top-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
              <div className="max-w-2xl">
                <span className="font-label-caps text-terracotta block mb-3">Our Team</span>
                <h2 className="font-display-md text-pine text-balance">Doctors who listen first</h2>
              </div>
              <p className="font-body-md text-pine/70 max-w-md text-pretty leading-relaxed">A small, tight-knit clinical team — every practitioner is a partner in your long-term care, not a referral.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {PRACTITIONERS.map((p) => (
                <article key={p.name} className="group flex flex-col gap-4">
                  <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-pine/5 shadow-soft shadow-soft-hover transition-all duration-300">
                    <img src={p.img} alt={p.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] grayscale-[20%] group-hover:grayscale-0" width="600" height="750" loading="lazy" decoding="async" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-terracotta">{p.specialty}</span>
                    <h3 className="font-headline-sm text-pine">{p.name}</h3>
                    <p className="font-body-sm text-pine/60">{p.creds}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Services */}
          <section id="services" className="bg-sage py-16 md:py-24 scroll-margin-top-20">
            <div className="max-w-[1200px] mx-auto px-6">
              <h2 className="font-display-md text-pine mb-10 md:mb-14 text-center text-balance">Comprehensive Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

                <article className="bg-offwhite p-6 md:p-8 rounded-xl shadow-soft shadow-soft-hover border border-pine/5 transition-all duration-300 group flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pine/5 flex items-center justify-center text-terracotta group-hover:scale-110 group-hover:bg-terracotta/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-[28px]" aria-hidden="true">stethoscope</span>
                  </div>
                  <h3 className="font-headline-sm text-pine text-balance mt-2">General Consultations</h3>
                  <p className="font-body-md text-pine/70 text-pretty leading-relaxed">Comprehensive health checks, routine blood work, and ongoing care for patients of all ages.</p>
                </article>

                <article className="bg-offwhite p-6 md:p-8 rounded-xl shadow-soft shadow-soft-hover border border-pine/5 transition-all duration-300 group flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pine/5 flex items-center justify-center text-terracotta group-hover:scale-110 group-hover:bg-terracotta/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-[28px]" aria-hidden="true">pregnant_woman</span>
                  </div>
                  <h3 className="font-headline-sm text-pine text-balance mt-2">Women's Health</h3>
                  <p className="font-body-md text-pine/70 text-pretty leading-relaxed">Specialized, confidential care including family planning, fertility advice, and preventative screenings.</p>
                </article>

                <article className="bg-offwhite p-6 md:p-8 rounded-xl shadow-soft shadow-soft-hover border border-pine/5 transition-all duration-300 group flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pine/5 flex items-center justify-center text-terracotta group-hover:scale-110 group-hover:bg-terracotta/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-[28px]" aria-hidden="true">man</span>
                  </div>
                  <h3 className="font-headline-sm text-pine text-balance mt-2">Men's Health</h3>
                  <p className="font-body-md text-pine/70 text-pretty leading-relaxed">Proactive preventative care, cardiovascular screening, and specialized treatments tailored for men's well-being.</p>
                </article>

                <article className="bg-offwhite p-6 md:p-8 rounded-xl shadow-soft shadow-soft-hover border border-pine/5 transition-all duration-300 group flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pine/5 flex items-center justify-center text-terracotta group-hover:scale-110 group-hover:bg-terracotta/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-[28px]" aria-hidden="true">child_care</span>
                  </div>
                  <h3 className="font-headline-sm text-pine text-balance mt-2">Pediatrics</h3>
                  <p className="font-body-md text-pine/70 text-pretty leading-relaxed">Gentle, expert care for infants, children, and teens in a reassuring and child-friendly environment.</p>
                </article>

                <article className="bg-offwhite p-6 md:p-8 rounded-xl shadow-soft shadow-soft-hover border border-pine/5 transition-all duration-300 group flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pine/5 flex items-center justify-center text-terracotta group-hover:scale-110 group-hover:bg-terracotta/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-[28px]" aria-hidden="true">vaccines</span>
                  </div>
                  <h3 className="font-headline-sm text-pine text-balance mt-2">Vaccinations</h3>
                  <p className="font-body-md text-pine/70 text-pretty leading-relaxed">Routine seasonal immunizations, childhood vaccine schedules, and comprehensive travel health preparations.</p>
                </article>

                <article className="bg-offwhite p-6 md:p-8 rounded-xl shadow-soft shadow-soft-hover border border-pine/5 transition-all duration-300 group flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-pine/5 flex items-center justify-center text-terracotta group-hover:scale-110 group-hover:bg-terracotta/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-[28px]" aria-hidden="true">psychology</span>
                  </div>
                  <h3 className="font-headline-sm text-pine text-balance mt-2">Mental Health</h3>
                  <p className="font-body-md text-pine/70 text-pretty leading-relaxed">Compassionate, discreet support, counseling services, and specialist referrals for your mental wellbeing.</p>
                </article>

              </div>
            </div>
          </section>

          {/* Inside the Clinic — sticky rail + auto-cycling image */}
          <section id="inside" className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 scroll-margin-top-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
              <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
                <span className="font-label-caps text-terracotta block mb-3">Inside the Clinic</span>
                <h2 className="font-display-md text-pine mb-5 text-balance">A space designed to slow you down</h2>
                <p className="font-body-md text-pine/70 leading-relaxed text-pretty mb-8 max-w-md">Soft daylight, warm timber, and quiet rooms. Every space at Wellbrook is built around the patient experience — from the reading nook by reception to the natural light over each examination chair.</p>
                <div className="flex items-center gap-4 max-w-sm mb-8">
                  <div className="flex-1 h-px bg-pine/20 relative overflow-hidden">
                    <div className="absolute inset-0 origin-left bg-terracotta clinic-scrub-bar h-px"></div>
                  </div>
                  <span className="font-label-caps text-pine/60 tabular-nums">04 rooms · 16s loop</span>
                </div>
                <a href="#book" className="inline-flex items-center gap-2 border border-pine/20 text-pine px-5 py-3 rounded-lg font-label-caps tracking-wider hover:border-terracotta hover:text-terracotta transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta">
                  Book a Tour
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
                </a>
              </div>
              <div className="md:col-span-7">
                <div className="relative w-full aspect-[4/5] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-soft bg-pine/5">
                  {CLINIC_ROOMS.map((r) => (
                    <img key={r.delay} className="clinic-cycle-img absolute inset-0 w-full h-full object-cover" style={{ animationDelay: r.delay }} src={r.img} alt={r.alt} width="1400" height="1050" loading="lazy" decoding="async" />
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {CLINIC_ROOMS.map((r) => (
                    <div key={`t-${r.delay}`} className="clinic-indicator rounded-lg overflow-hidden aspect-[4/3] bg-pine/5" style={{ animationDelay: r.delay }}>
                      <img src={r.thumb} alt={r.altThumb} className="w-full h-full object-cover" width="320" height="240" loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Specialties — 3 alternating image+content rows */}
          <section id="specialties" className="full-bleed py-16 md:py-24" style={{ backgroundColor: "#ECEFE9" }}>
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="text-center mb-14">
                <span className="font-label-caps text-terracotta block mb-3">Specialty Programs</span>
                <h2 className="font-display-md text-pine text-balance">Care, deepened where it matters</h2>
              </div>
              <div className="flex flex-col gap-16 md:gap-24">
                {SPECIALTIES.map((s) => (
                  <article key={s.title} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <figure className={`md:col-span-7 rounded-2xl overflow-hidden aspect-[4/3] bg-pine/5 shadow-soft ${s.reverse ? "md:order-2" : ""}`}>
                      <img src={s.img} alt={s.alt} className="w-full h-full object-cover" width="1400" height="1050" loading="lazy" decoding="async" />
                    </figure>
                    <div className={`md:col-span-5 flex flex-col gap-4 ${s.reverse ? "md:order-1" : ""}`}>
                      <span className="font-label-caps text-terracotta">{s.n}</span>
                      <h3 className="font-headline-lg text-pine text-balance">{s.title}</h3>
                      <p className="font-body-md text-pine/70 leading-relaxed text-pretty">{s.body}</p>
                      <ul className="flex flex-col gap-2 mt-2 font-body-sm text-pine/70">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-terracotta" aria-hidden="true">check</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Patient Journey — 5-step horizontal roadmap */}
          <section id="journey" className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 scroll-margin-top-20">
            <div className="text-center mb-14">
              <span className="font-label-caps text-terracotta block mb-3">Your Journey</span>
              <h2 className="font-display-md text-pine text-balance">From inquiry to follow-up, in five steps</h2>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6 relative">
              <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-pine/0 via-pine/30 to-pine/0" aria-hidden="true"></div>
              {JOURNEY.map((j) => {
                const circle =
                  j.status === "current"
                    ? "w-14 h-14 rounded-full bg-terracotta/20 border-2 border-terracotta flex items-center justify-center z-10 bg-offwhite"
                    : j.status === "done"
                    ? "w-14 h-14 rounded-full bg-pine/10 border-2 border-pine flex items-center justify-center z-10 bg-offwhite"
                    : "w-14 h-14 rounded-full bg-offwhite border-2 border-pine/30 flex items-center justify-center z-10";
                const stepCaps = j.status === "upcoming" ? "font-label-caps text-pine/50 tabular-nums" : "font-label-caps text-terracotta tabular-nums";
                return (
                  <li key={j.step} className="flex flex-col items-start gap-3 relative">
                    <div className={circle}>
                      {j.status === "current" ? (
                        <span className="w-3 h-3 rounded-full bg-terracotta wb-pulse" aria-hidden="true"></span>
                      ) : j.status === "done" ? (
                        <span className="material-symbols-outlined text-pine" aria-hidden="true">check_circle</span>
                      ) : (
                        <span className="material-symbols-outlined text-pine/50" aria-hidden="true">{j.step.startsWith("Step 05") ? "flag" : "schedule"}</span>
                      )}
                    </div>
                    <span className={stepCaps}>{j.step}</span>
                    <h3 className="font-headline-sm text-pine">{j.title}</h3>
                    <p className="font-body-sm text-pine/70 leading-relaxed">{j.body}</p>
                    <div className="mt-2 rounded-lg overflow-hidden aspect-[4/3] w-full bg-pine/5">
                      <img src={j.img} alt={j.alt} className="w-full h-full object-cover" width="500" height="375" loading="lazy" decoding="async" />
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Stories from Patients — tinted full-bleed band */}
          <section id="stories" className="full-bleed py-16 md:py-24" style={{ backgroundColor: "#2D4A3D" }}>
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
                <div className="max-w-xl">
                  <span className="font-label-caps text-terracotta block mb-3">Patient Stories</span>
                  <h2 className="font-display-md text-offwhite text-balance">Care, in their own words</h2>
                </div>
                <p className="font-body-md text-offwhite/70 max-w-md text-pretty leading-relaxed">From first-time visitors to families who've been with us for a decade — the throughline is the same: feeling heard.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {STORIES.map((s) => (
                  <figure key={s.name} className="bg-offwhite/5 backdrop-blur-sm border border-offwhite/10 rounded-2xl p-6 md:p-8 flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-offwhite/10 shrink-0">
                        <img src={s.img} alt={s.alt} className="w-full h-full object-cover" width="120" height="120" loading="lazy" decoding="async" />
                      </div>
                      <div className="flex flex-col">
                        <cite className="not-italic font-headline-sm text-offwhite">{s.name}</cite>
                        <span className="font-label-caps text-terracotta">{s.program}</span>
                      </div>
                    </div>
                    <blockquote className="font-body-md text-offwhite/85 leading-relaxed italic text-pretty">"{s.quote}"</blockquote>
                    <span className="inline-flex items-center gap-1 text-xs font-label-caps text-offwhite/50 self-start border-t border-offwhite/10 pt-3 mt-auto">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">verified</span> Verified Patient
                    </span>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ — details accordion */}
          <section id="patient-info" className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 scroll-margin-top-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
              <div className="md:col-span-5">
                <span className="font-label-caps text-terracotta block mb-3">Patient Info</span>
                <h2 className="font-display-md text-pine mb-5 text-balance">Common questions, answered plainly</h2>
                <p className="font-body-md text-pine/70 leading-relaxed text-pretty mb-8">If you don't see your question here, our admin team replies to every email within one working day.</p>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-pine/5 shadow-soft">
                  <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=85&auto=format&fit=crop" alt="Patient at the clinic reception desk being greeted by friendly staff" className="w-full h-full object-cover" width="700" height="875" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="md:col-span-7 flex flex-col divide-y divide-pine/10 border-t border-b border-pine/10">
                {FAQS.map((f) => (
                  <details key={f.q} className="wb-faq group py-5 md:py-6">
                    <summary className="flex items-start justify-between gap-6 cursor-pointer">
                      <h3 className="font-headline-sm text-pine pr-2">{f.q}</h3>
                      <span className="wb-chevron material-symbols-outlined text-pine/60 shrink-0 mt-0.5" aria-hidden="true">expand_more</span>
                    </summary>
                    <p className="font-body-md text-pine/70 leading-relaxed text-pretty mt-4 pr-12">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-pine text-offwhite py-16 md:py-20 border-t border-pine/90">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 px-6 max-w-[1200px] mx-auto">

            <div className="flex flex-col gap-4 sm:col-span-2 md:col-span-1">
              <span className="font-['Manrope'] text-xl font-bold text-offwhite tracking-tighter">Wellbrook Clinic</span>
              <p className="text-offwhite/70 text-sm leading-relaxed max-w-xs text-pretty">Clinical excellence in the heart of Dublin. Providing compassionate, comprehensive healthcare for you and your family.</p>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="font-label-caps text-terracotta">Clinic</h4>
              <nav className="flex flex-col gap-3" aria-label="Footer Clinic Links">
                <a href="#" className="text-offwhite/70 hover:text-offwhite transition-colors duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta w-fit rounded-sm">Our Practitioners</a>
                <a href="#" className="text-offwhite/70 hover:text-offwhite transition-colors duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta w-fit rounded-sm">Patient Portal</a>
                <a href="#" className="text-offwhite/70 hover:text-offwhite transition-colors duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta w-fit rounded-sm">Careers</a>
              </nav>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="font-label-caps text-terracotta">Support</h4>
              <nav className="flex flex-col gap-3" aria-label="Footer Support Links">
                <a href="#" className="text-offwhite/70 hover:text-offwhite transition-colors duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta w-fit rounded-sm">Opening Hours</a>
                <a href="#" className="text-offwhite/70 hover:text-offwhite transition-colors duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta w-fit rounded-sm">Emergency Line</a>
                <a href="#" className="text-offwhite/70 hover:text-offwhite transition-colors duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta w-fit rounded-sm">Privacy Policy</a>
              </nav>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="font-label-caps text-terracotta">Contact</h4>
              <address className="not-italic flex flex-col gap-3 text-sm text-offwhite/70">
                <p>123 Wellness Way<br />Dublin 2, D02 X4Y5</p>
                <a href="tel:+35312345678" className="hover:text-offwhite transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta w-fit rounded-sm tabular-nums mt-1">+353 1 234 5678</a>
                <a href="mailto:hello@wellbrook.ie" className="hover:text-offwhite transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta w-fit rounded-sm">hello@wellbrook.ie</a>
              </address>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-offwhite/10 px-6 max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-offwhite/50">
            <p>© 2024 Wellbrook Clinic. All rights reserved.</p>
            <p>Designed with patient care in mind.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default MedicalCare;
