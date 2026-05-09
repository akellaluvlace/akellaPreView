const STAGES = [
  {
    n: "I",
    label: "Constellation",
    title: "twelve satellites at 510 km.",
    body: "A sun-synchronous configuration of twelve identical platforms threads the polar terminator on a four-day repeat cycle, returning to any point on the planet within ninety-six hours. Each platform carries a redundant pair of star trackers, a thermal-stabilised payload bench, and an x-band downlink rated to 320 megabits per second over our network of fourteen ground stations. The constellation is sized for resilience: the loss of any single satellite costs us less than nine percent of revisit cadence, and on-orbit spares are pre-positioned for a six-week replacement window.",
  },
  {
    n: "II",
    label: "Sensor",
    title: "pushbroom hyperspectral, 96 bands.",
    body: "The primary instrument is a custom pushbroom hyperspectral imager covering 400 to 2500 nanometres across ninety-six contiguous bands at thirty-metre ground sample distance. Critically, the spectral response of every flight unit is measured before launch in our certified optics laboratory and re-validated monthly using lunar calibration passes. We publish the per-satellite spectral response functions and noise-equivalent radiance figures alongside every data release, so any third party can reproduce our atmospheric correction from raw L1 inputs without trusting our pipeline as a black box.",
  },
  {
    n: "III",
    label: "Pipeline",
    title: "L1 to L2 atmospheric correction.",
    body: "Raw radiance frames are downlinked, time-aligned to GPS, and pushed through a deterministic correction pipeline that removes Rayleigh scattering, aerosol attenuation, water-vapour absorption, and adjacency effects. The pipeline is open source, version-pinned, and runs in a reproducible container so anyone can re-derive Level-2 surface reflectance from our published Level-1 archive byte-for-byte. Every L2 observation includes the exact pipeline commit hash, the ancillary atmospheric model versions used, and a per-pixel uncertainty estimate propagated from instrument noise plus model variance.",
  },
  {
    n: "IV",
    label: "Audit trail",
    title: "every observation cryptographically attested.",
    body: "When a Level-2 observation is finalised it is hashed together with its provenance metadata — satellite identifier, capture timestamp, pipeline commit, ancillary dataset versions, and processor signature — and the resulting digest is anchored to a public ledger inside a Merkle batch published every fifteen minutes. Counterparties verifying our data download the batch root, recompute the leaf hash from the observation they hold, and confirm membership in milliseconds. The trail is monotonic and append-only: an observation cannot be silently revised without producing a divergent ledger record that any auditor can immediately detect.",
  },
  {
    n: "V",
    label: "Replication",
    title: "anyone can rebuild the chain.",
    body: "The chain is engineered to be paranoid-friendly. Every link — calibration files, pipeline container image, ancillary atmospheric model, ledger batch root — is mirrored across three independent storage providers and a pair of academic archives, indexed by content hash so any byte-level corruption is immediately detectable. A counterparty who does not trust our infrastructure can pull raw L1 from any mirror, run our open pipeline in a clean container, and re-derive the L2 archive byte-for-byte. We have committed publicly to maintaining the archive for fifty years, with custodianship falling to a named foundation in the event the company is wound up.",
  },
];

const VERIFY_FIELDS = [
  { k: "Notebook", v: "verify-ledger.ipynb" },
  { k: "Container", v: "meridian/pipeline:2.4.1" },
  { k: "Mirrors", v: "3 commercial · 2 academic" },
  { k: "Custody", v: "Open Climate Trust · 50y" },
];

const CALIB_FIELDS = [
  { k: "Bands measured", v: "96 · all units" },
  { k: "Lunar passes / mo", v: "3.0 ± 0.4" },
  { k: "NEdL @ 2.2 µm", v: "0.18 W/m²/sr/µm" },
  { k: "Pointing knowledge", v: "< 4.2 arcsec, 1σ" },
];

const NETWORK_FIELDS = [
  { k: "Pass cadence", v: "96 / day" },
  { k: "Daily downlink", v: "38.4 TB" },
  { k: "Latency · L1 ready", v: "19 min · median" },
  { k: "Uptime · 90d", v: "99.94%" },
];

const LEDGER_ROWS = [
  { h: "0xA4F8 … 3BE2", t: "14:03 UTC" },
  { h: "0x91DC … 7711", t: "13:48 UTC" },
  { h: "0x5E2A … 0C19", t: "13:33 UTC" },
  { h: "0xBB07 … F4A6", t: "13:18 UTC" },
  { h: "0x7732 … 8E40", t: "13:03 UTC" },
];

const STRIP_STATS = [
  { k: "Constellation", v: "12 satellites" },
  { k: "Revisit", v: "4-day cycle" },
  { k: "Resolution", v: "30m GSD" },
  { k: "Throughput", v: "2.4M obs / day" },
];

const DOCTRINE = [
  {
    n: "I",
    title: "Independence",
    body: "Operated outside any single state's geopolitical pressure. Our governance is structured as a Swiss verein with co-equal voting weight from a coalition of central banks, sovereign wealth desks, and accredited research universities; no single signatory may veto a publication or compel withholding of an observation. The constellation, ground stations, and pipeline run on infrastructure distributed across four jurisdictions specifically to prevent unilateral coercion. Every governance change is itself a public record on the same ledger our observations are anchored to, so the rules of the game are auditable on the same terms as the data they shape.",
  },
  {
    n: "II",
    title: "Verifiability",
    body: "Zero-knowledge attestations on every observation. Each Level-2 record carries a succinct cryptographic proof that it was generated by the published, version-pinned pipeline running over the published Level-1 inputs, without exposing the raw radiance frames before our embargo window expires. Counterparties needing real-time access — climate-linked debt issuers, regulators, integrity councils — can verify provenance and authorship in milliseconds; counterparties needing to reproduce can pull the L1 archive thirty days later and re-derive the same number themselves. We trade no secret sauce for the right to be opaque.",
  },
  {
    n: "III",
    title: "Reproducibility",
    body: "Raw Level-1 data is released thirty days after capture under a CC0 dedication, alongside the exact pipeline container image and ancillary atmospheric model versions used to derive every published Level-2 product. A research group with a workstation and a few hundred gigabytes of storage can reconstruct any observation in the archive byte-for-byte and challenge our number with their own. We treat reproducibility as an obligation, not a marketing claim — most of the science we cite in our white papers was funded by grants we never wrote, on data we eventually released and forgot we owned.",
  },
];

const SPEC_ROWS = [
  { k: "Sample frequency", v: "96-hour revisit, global" },
  { k: "Atmospheric model", v: "6SV2.1 · build 4.7.3" },
  { k: "Accuracy class", v: "±2.4% at 99% CI" },
  { k: "Publication cadence", v: "L2 quarter-hourly · L1 T+30d" },
];

const FAQS = [
  {
    q: "Who funds MERIDIAN?",
    a: "A tiered subscription model funded by central banks, sovereign wealth desks, multilateral development institutions, and accredited research universities. No single signatory contributes more than fourteen percent of operating revenue, no fossil-fuel-linked underwriter is permitted as a primary subscriber, and our funder roster is published quarterly alongside our governance minutes. Catalytic launch capital came from a five-year grant from a coalition of European climate foundations; that grant is now repaid and the verein operates on subscription revenue alone.",
  },
  {
    q: "Why satellite over ground stations?",
    a: "Ground networks cover, generously, one part in ten thousand of the global biomass surface. Their measurements are precise where they exist and silent everywhere else; the regression that bridges the gap is doing the actual planetary inventory work, not the plots. A constellation reverses that proportion: every pixel is observed every four days, with quantified uncertainty, and ground plots become validation campaigns rather than the foundation of the estimate. Both layers complement each other — but only one can claim continuous global coverage, and only one is auditable from anywhere on Earth.",
  },
  {
    q: "What's the latency from observation to API?",
    a: "Median end-to-end latency from photon arrival at the sensor to a query-able Level-2 observation is fifty-four minutes. That includes downlink wait time at our distributed ground network, atmospheric correction, ledger anchoring at the next fifteen-minute Merkle batch, and CDN propagation. Worst-case latency for high-priority sites under our institutional tier is contractually capped at three hours, with automatic credits if we breach. Bulk archival queries against the historical record return in milliseconds because they are pre-indexed at ingestion.",
  },
  {
    q: "Can we audit your atmospheric model?",
    a: "Yes, and we expect you to. We use a forked, version-pinned 6SV2.1 vector radiative transfer model with a documented coupling to our pre-launch optics calibration measurements; the source is mirrored to a public repository under a permissive licence and every release tag is signed. Our institutional tier includes two on-site days per quarter with our calibration scientists at the Reykjavík ground segment, full read access to our model regression tests, and a standing invitation to publish dissenting validation results — at our cost — in any peer-reviewed journal of the auditor's choice.",
  },
  {
    q: "Do you cover boreal forests?",
    a: "Boreal coverage is the design centre of the constellation, not a corner case. Our sun-synchronous orbits are tilted to maximise dwell time over latitudes between fifty and seventy degrees north, where most of the planet's standing biomass and most of the data void coexist. We accept the tradeoff of slightly reduced equatorial revisit in exchange. Polar-night gaps are bridged with active SAR cross-validation from a partner constellation; you will see those secondary observations clearly flagged in our metadata, never silently substituted into the optical record.",
  },
  {
    q: "How do you treat cloud-occluded pixels?",
    a: "Cloud-occluded pixels are masked at the L1 stage by a multi-band cloud and shadow detector, and the mask is published as a separate raster alongside the surface reflectance product. We do not interpolate biomass under clouds. Our published timeseries explicitly carries gaps; the uncertainty envelope grows with the gap length and is recorded in metadata. If a counterparty needs a gap-filled product for downstream modelling we provide one as a clearly labelled derived dataset, never as part of the primary measurement record. The discipline matters: silent gap-filling is the single most common way \"measurement\" products quietly become estimates.",
  },
  {
    q: "What's the unit price for institutional access?",
    a: "Pricing is a single subscription tier scaled by query volume and SLA priority, not a per-observation menu. Standard institutional tier starts at four hundred and twenty thousand euros per annum and includes unrestricted L2 archive access, real-time API ingest at the published latency targets, two on-site audit days per quarter, and inclusion in the funder governance circle on a non-voting basis. Voting governance seats become available to subscribers above the one-million-euro threshold who also commit to the public funder roster. We publish the rate card on request; we do not negotiate it.",
  },
];

const PHASES = [
  {
    n: "01",
    stage: "Orbit",
    kicker: "Constellation",
    title: "twelve satellites threading the polar terminator.",
    body: "A sun-synchronous configuration of twelve identical platforms returns to any point on Earth on a four-day repeat cycle, sized for resilience and pre-positioned for a six-week replacement window if a unit fails on orbit.",
    highlights: [
      "Twelve identical platforms · 510 km altitude · 4-day revisit cycle",
      "Redundant star trackers · thermal-stabilised payload bench",
      "X-band downlink, 320 Mbit/s across 14 ground stations",
    ],
    metric: { label: "Daily passes · constellation", value: "96 / day" },
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB5oYz1DY64ciGw8MN-FcSWK-VQL-8nGWvmBR32J-XXTnNie8-J7_EDUIwg7gn4Aed6pvseJ92jaKkSZjqm1DbwmVg37Tu2o_aLc4XoRnpFlG_SsIiNCCDGUG-JmjlhumH2-vzbi7ReyMAQFYS0LMGhtVZBLP_YPWsWjqox-F-PEDdzi6ZCXpO617Nj-48cON4wsfA5vuf7jsTK2EXOx1HBxb-Vr25SsYaixFP7eTeD0BkIJrJTbtT2o9K8i1yxNFvY4blxZhzC-c",
    lbl: "Live telemetry",
    l1: "Pass · MER-07 · 14:03 UTC",
    l2: "Altitude 510.4 km · drift < 0.3%",
  },
  {
    n: "02",
    stage: "Sense",
    kicker: "Hyperspectral",
    title: "ninety-six bands resolve the canopy.",
    body: "A pushbroom hyperspectral imager covers 400–2500 nm across ninety-six contiguous bands at thirty-metre ground sample distance — and we publish the per-satellite spectral response so anyone can redo our atmospheric correction without trusting our pipeline.",
    highlights: [
      "Ninety-six bands · 30 m GSD · pushbroom",
      "Lunar calibration monthly · NEdL @ 2.2 µm = 0.18 W/m²/sr/µm",
      "Spectral response published per flight unit",
    ],
    metric: { label: "Daily downlink · constellation", value: "38.4 TB" },
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCngw7_9s1FH707SGiKQ-IXrImKN_khHCCT-NmOz3txxyTabj9sI2wbE_kbVMvzHV4LRm5fp4PRIf1XGgJaQLxGfGw7thuTYHURlkBSTPkFG-e8gdfBrCwWuNsQjGqbtfdam1pwOkyO7MD3qcSpRzCcbjR6vnh3-tXdM2mCnGj-wrphOoKkC5nbHTcrXwyA_jhsz79h7h8lANEl6ZEkpWo26CHLarY8ShTGUv8Spe1oxj6hu-kJrX4VWjiKSteI1X7bZSwo3gl1D9A",
    lbl: "Canopy resolution",
    l1: "0.3 m / pixel · 04°24'N 61°35'W",
    l2: "Atmospheric correction · L2 ready",
  },
  {
    n: "03",
    stage: "Quantify",
    kicker: "Carbon density",
    title: "biomass converted to attested CO₂e.",
    body: "Optical, SAR, and LiDAR streams converge through a deterministic, version-pinned pipeline that publishes the exact commit hash and ancillary atmospheric model versions alongside every observation, with per-pixel uncertainty propagated from instrument noise plus model variance.",
    highlights: [
      "Deterministic open-source pipeline · reproducible container",
      "Per-pixel uncertainty propagated end-to-end",
      "L1 → L2 latency 19 min · median",
    ],
    metric: { label: "Carbon density · this scene", value: "2,340 tCO₂e/km²" },
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=85&auto=format&fit=crop",
    lbl: "Confidence",
    l1: "99.7% · 95% CI ± 4.1 tCO₂e/km²",
    l2: "Pipeline · meridian/pipeline:2.4.1",
  },
  {
    n: "04",
    stage: "Anchor & Stream",
    kicker: "Cryptographic ledger",
    title: "every observation hashed, anchored, streamed.",
    body: "When a Level-2 observation is finalised it is hashed with its provenance metadata and the resulting digest is anchored to a public Merkle batch every fifteen minutes — counterparties verify membership in milliseconds and the trail is monotonic and append-only.",
    highlights: [
      "Merkle batch every 15 min · membership proof < 12 ms",
      "Append-only · mirrored across 3 commercial · 2 academic archives",
      "REST + WebSocket parity · SDKs in Python / Go / Node",
    ],
    metric: { label: "Uptime · 90-day", value: "99.94%" },
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=85&auto=format&fit=crop",
    lbl: "Anchored on-chain",
    l1: "0xA4F8 … 3BE2 · batch 19,420,118",
    l2: "Verified · 14:03 UTC · custody Open Climate Trust",
  },
];

export default function T10SplitScreen() {
  const [activePhase, setActivePhase] = React.useState(0);
  const phaseRefs = React.useRef([]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        entries.forEach((e) => {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        });
        if (best) {
          const idx = Number(best.target.getAttribute("data-phase-idx"));
          if (!Number.isNaN(idx)) setActivePhase(idx);
        }
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    phaseRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const active = PHASES[activePhase] || PHASES[0];
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,300;400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "background": "#0B1830",
                "on-background": "#dee3e7",
                "primary": "#5DD3FF",
                "surface-elevated": "#162542",
                "on-surface-variant": "#bdc8cf",
                "primary-container": "#5dd3ff",
                "surface-container": "#1b2023"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              fontFamily: {
                "headline-md": ["Newsreader"], "data-mono": ["Inter"], "label-caps": ["Inter"],
                "display-xl": ["Newsreader"], "headline-lg": ["Newsreader"], "body-md": ["Inter"], "body-lg": ["Inter"]
              },
              fontSize: {
                "headline-md": ["clamp(1.625rem, 3vw + 1rem, 2rem)", { lineHeight: "1.3", fontWeight: "400" }],
                "data-mono": ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "500" }],
                "label-caps": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "600" }],
                "display-xl": ["clamp(2.25rem, 5vw + 1.5rem, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" }],
                "headline-lg": ["clamp(1.75rem, 4vw + 1rem, 3rem)", { lineHeight: "1.2", fontWeight: "400" }],
                "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
                "body-lg": ["clamp(1rem, 1.5vw + 0.8rem, 1.25rem)", { lineHeight: "1.6", letterSpacing: "-0.01em", fontWeight: "400" }]
              }
            }
          }
        }
      ` }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
        }
        section { scroll-margin-top: 5rem; }
        .topographic-bg {
          background-size: 200px 200px;
        }
        .glass-panel { background: rgba(11, 24, 48, 0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(93, 211, 255, 0.15); }
        .glow-hover:hover { box-shadow: 0 0 8px rgba(93, 211, 255, 0.5); border-color: rgba(93, 211, 255, 1); }
        .meridian-faq-item summary::-webkit-details-marker { display: none; }
        .meridian-faq-item summary { list-style: none; }
        .meridian-faq-item .meridian-chevron { transition: transform 250ms ease; }
        .meridian-faq-item[open] summary .meridian-chevron { transform: rotate(90deg); }
        @media (prefers-reduced-motion: reduce) {
          .meridian-faq-item .meridian-chevron { transition: none; }
        }
      ` }} />

      <div className="bg-background text-on-background antialiased selection:bg-primary/30 selection:text-primary dark">
        <div id="scroll-progress" className="fixed top-0 left-0 h-[2px] bg-primary z-[60] transition-[width] duration-75" style={{ width: "0%" }} role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}></div>

        <nav className="fixed top-0 w-full z-50 bg-background/85 backdrop-blur-md border-b border-primary/15">
          <div className="flex justify-between items-center gap-3 px-4 py-4 max-w-[1440px] mx-auto sm:px-6 sm:py-5 md:px-8 md:py-6">
            <div className="text-lg font-headline-md font-light tracking-widest text-primary sm:text-xl md:text-2xl">MERIDIAN</div>
            <div className="hidden md:flex items-center gap-8">
              <a className="text-primary border-b border-primary pb-1 font-body-md text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm" href="#" aria-current="page">Platform</a>
              {["Solutions", "Data Integrity", "Journal"].map(l => (
                <a key={l} className="text-slate-300 hover:text-primary active:text-primary/80 transition-colors font-body-md text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm" href="#">{l}</a>
              ))}
            </div>
            <button type="button" className="px-4 py-2 bg-primary text-background font-label-caps text-[10px] rounded-sm hover:bg-primary/90 active:bg-primary/80 transition-colors uppercase sm:px-6 sm:text-label-caps focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <span className="sm:hidden">Access</span>
              <span className="hidden sm:inline">Request Access</span>
            </button>
          </div>
        </nav>

        <main>
          <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-background/60 z-10"></div>
            <img alt="Satellite view of Earth" className="absolute inset-0 w-full h-full object-cover z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB5oYz1DY64ciGw8MN-FcSWK-VQL-8nGWvmBR32J-XXTnNie8-J7_EDUIwg7gn4Aed6pvseJ92jaKkSZjqm1DbwmVg37Tu2o_aLc4XoRnpFlG_SsIiNCCDGUG-JmjlhumH2-vzbi7ReyMAQFYS0LMGhtVZBLP_YPWsWjqox-F-PEDdzi6ZCXpO617Nj-48cON4wsfA5vuf7jsTK2EXOx1HBxb-Vr25SsYaixFP7eTeD0BkIJrJTbtT2o9K8i1yxNFvY4blxZhzC-c" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" />
            <div className="relative z-20 text-center max-w-4xl px-5 flex flex-col items-center">
              <p className="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em] mb-4 sm:mb-6">Planetary Intelligence</p>
              <h1 className="font-display-xl text-display-xl text-on-background mb-6 text-balance sm:mb-8">The Truth,<br />Measured from Orbit.</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[65ch] text-pretty mx-auto mb-8 sm:mb-12">Verifiable, precise, and independent carbon measurement telemetry for institutional climate action.</p>
              <button type="button" className="border border-primary text-primary px-6 py-3 rounded-sm font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/10 active:bg-primary/20 transition-all glow-hover sm:px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Explore Platform</button>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-center animate-bounce sm:bottom-12">
              <p className="font-data-mono text-[10px] leading-none text-primary/70 uppercase mb-2 whitespace-nowrap">Scroll to Deploy</p>
              <span className="material-symbols-outlined text-primary/70 leading-none" aria-hidden="true">arrow_downward</span>
            </div>
          </section>

          <section className="relative bg-background border-t border-primary/15">
            <div className="hidden md:flex max-w-[1440px] mx-auto">
              <div className="md:w-[40%] md:border-r md:border-primary/15 relative z-20">
                {PHASES.map((p, i) => (
                  <article key={p.n} ref={(el) => { phaseRefs.current[i] = el; }} data-phase-idx={i} className="min-h-[140dvh] flex items-center px-6 py-16 sm:px-10 md:px-12">
                    <div className="max-w-[58ch] w-full">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="font-data-mono text-primary text-xs uppercase tracking-widest tabular-nums">Phase {p.n}</span>
                        <span className="h-px w-10 bg-primary/40" aria-hidden="true"></span>
                        <span className="font-data-mono text-on-surface-variant text-[10px] uppercase tracking-widest">{p.stage}</span>
                      </div>
                      <h2 className="font-headline-lg text-headline-lg text-on-background leading-tight text-balance">
                        <em className="font-headline-lg font-light italic">{p.kicker}</em> — {p.title}
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-5 sm:mt-7 text-pretty">{p.body}</p>
                      <ul className="mt-7 flex flex-col gap-3">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-3">
                            <span className="font-data-mono text-primary text-xs leading-relaxed shrink-0 mt-1" aria-hidden="true">→</span>
                            <span className="font-body-md text-body-md text-on-background text-pretty">{h}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 flex items-end gap-5 border-t border-primary/15 pt-5 flex-wrap">
                        <div>
                          <p className="font-data-mono text-[10px] text-primary uppercase tracking-widest mb-1.5">{p.metric.label}</p>
                          <p className="font-headline-md text-headline-md text-on-background tabular-nums leading-none">{p.metric.value}</p>
                        </div>
                        <a className="ml-auto inline-flex items-center gap-2 font-data-mono text-xs uppercase tracking-widest text-primary hover:text-on-background transition-colors" href="#">
                          <span>Read methodology</span>
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="md:w-[60%] bg-surface-elevated relative">
                <div className="h-[100dvh] sticky top-0 overflow-hidden">
                  {PHASES.map((p, i) => (
                    <img
                      key={p.n}
                      alt=""
                      role="presentation"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${i === activePhase ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                      src={p.img}
                      width="1200"
                      height="1500"
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ))}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoOTMsIDIxMSwgMjU1LCAwLjIpIi8+PC9zdmc+')] z-10 pointer-events-none" aria-hidden="true"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/15 z-10 pointer-events-none" aria-hidden="true"></div>
                  <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                    {PHASES.map((p, i) => (
                      <span key={p.n} className={`h-px transition-all duration-500 ${i === activePhase ? "bg-primary w-10" : "bg-primary/30 w-5"}`} aria-hidden="true"></span>
                    ))}
                    <span className="font-data-mono text-[10px] text-primary uppercase tracking-widest tabular-nums ml-2">{active.n} / {String(PHASES.length).padStart(2, "0")}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 glass-panel p-3 z-20 max-w-[260px] sm:bottom-8 sm:right-8 sm:p-4 sm:max-w-xs transition-opacity duration-500" key={active.n}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
                      <span className="font-data-mono text-[10px] text-primary uppercase tracking-widest">{active.lbl}</span>
                    </div>
                    <p className="font-data-mono text-xs text-on-background sm:text-sm tabular-nums">{active.l1}</p>
                    <p className="font-data-mono text-[10px] text-on-surface-variant mt-1 sm:text-xs tabular-nums">{active.l2}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:hidden">
              {PHASES.map((p, i) => (
                <article key={p.n} className={i < PHASES.length - 1 ? "border-b border-primary/15" : ""}>
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-elevated">
                    <img alt={p.title} className="absolute inset-0 w-full h-full object-cover" src={p.img} width="800" height="1000" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoOTMsIDIxMSwgMjU1LCAwLjIpIi8+PC9zdmc+')] z-10" aria-hidden="true"></div>
                    <div className="absolute bottom-4 right-4 glass-panel p-3 z-20 max-w-[220px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
                        <span className="font-data-mono text-[10px] text-primary uppercase">{p.lbl}</span>
                      </div>
                      <p className="font-data-mono text-xs text-on-background tabular-nums">{p.l1}</p>
                      <p className="font-data-mono text-[10px] text-on-surface-variant mt-1 tabular-nums">{p.l2}</p>
                    </div>
                  </div>
                  <div className="px-6 py-12 sm:px-10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-data-mono text-primary text-xs uppercase tracking-widest tabular-nums">Phase {p.n}</span>
                      <span className="h-px w-8 bg-primary/40" aria-hidden="true"></span>
                      <span className="font-data-mono text-on-surface-variant text-[10px] uppercase tracking-widest">{p.stage}</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-on-background leading-tight text-balance">
                      <em className="font-headline-lg font-light italic">{p.kicker}</em> — {p.title}
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-4 text-pretty max-w-[65ch]">{p.body}</p>
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3">
                          <span className="font-data-mono text-primary text-xs shrink-0 mt-1" aria-hidden="true">→</span>
                          <span className="font-body-md text-body-md text-on-background text-pretty">{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 border-t border-primary/15 pt-4">
                      <p className="font-data-mono text-[10px] text-primary uppercase tracking-widest mb-1.5">{p.metric.label}</p>
                      <p className="font-headline-md text-headline-md text-on-background tabular-nums leading-none">{p.metric.value}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="py-16 bg-background border-t border-primary/10 relative topographic-bg sm:py-24 md:py-32" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25, 50 50 T 100 50 M0 75 Q 25 50, 50 75 T 100 75 M0 25 Q 25 0, 50 25 T 100 25' fill='none' stroke='rgba(93, 211, 255, 0.05)' stroke-width='0.5'/%3E%3C/svg%3E\")" }}>
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12">
              <div className="text-center mb-12 sm:mb-16 md:mb-24">
                <h2 className="font-headline-md text-headline-md leading-tight text-on-background mb-4 text-balance">Planetary Scale. Precision Accuracy.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[65ch] text-pretty mx-auto">Our models are trained on continuous satellite ingestion, providing the most accurate carbon baseline in existence.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-16">
                <div className="glass-panel p-6 text-center rounded-sm sm:p-10 md:p-12">
                  <p className="font-data-mono text-primary text-sm uppercase tracking-widest mb-4 sm:mb-6">Coverage Area</p>
                  <p className="font-display-xl text-display-xl leading-none text-primary mb-2 tabular-nums">2.4B<span className="text-2xl font-headline-md ml-2 sm:text-3xl md:text-headline-md">+</span></p>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">Acres Monitored Daily</p>
                </div>
                <div className="glass-panel p-6 text-center rounded-sm sm:p-10 md:p-12">
                  <p className="font-data-mono text-primary text-sm uppercase tracking-widest mb-4 sm:mb-6">Model Confidence</p>
                  <p className="font-display-xl text-display-xl leading-none text-primary mb-2 tabular-nums">99.7<span className="text-2xl font-headline-md sm:text-3xl md:text-headline-md">%</span></p>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">Verification Accuracy</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-background border-t border-primary/10 sm:py-24 md:py-32 relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12">
              <div className="mb-12 sm:mb-16 md:mb-20 max-w-[720px]">
                <span className="font-data-mono text-primary text-xs uppercase tracking-widest block mb-3">DOSSIER · 04</span>
                <h2 className="font-headline-md text-headline-md leading-tight text-on-background mb-4 text-balance">In orbit. The measurement chain, end to end.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[65ch] text-pretty">From silicon photodiodes 510 kilometres above the equator to a cryptographically attested observation in your API response — every link in the chain is documented, replicated, and independently auditable.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                <div className="md:col-span-5 flex flex-col gap-6 md:gap-8 h-full md:justify-between">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-primary/15 bg-surface-elevated">
                    <img alt="Macro photograph of a satellite payload sensor circuit board, dense traces and chip packages, treated cyan" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80" src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&auto=format&fit=crop" width="1200" height="1600" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-primary/12 mix-blend-overlay z-10" aria-hidden="true"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent z-20" aria-hidden="true"></div>
                    <div className="absolute top-4 left-4 z-30 glass-panel px-3 py-2">
                      <p className="font-data-mono text-[10px] text-primary uppercase tracking-widest tabular-nums">PAYLOAD · MER-07</p>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-30 glass-panel p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
                        <span className="font-data-mono text-[10px] text-primary uppercase tracking-widest">Hyperspectral Imager</span>
                      </div>
                      <p className="font-data-mono text-xs text-on-background tabular-nums">96-band pushbroom · 30m GSD</p>
                      <p className="font-data-mono text-[10px] text-on-surface-variant mt-1 tabular-nums">Calibrated 02:14 UTC · drift &lt; 0.3%</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-sm border border-primary/15 bg-surface-elevated/70 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <span className="font-data-mono text-[10px] text-primary uppercase tracking-widest">Pre-flight · calibration</span>
                      <span className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest tabular-nums">Bench · OPT-04</span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-5 gap-y-3">
                      {CALIB_FIELDS.map(f => (
                        <div key={f.k}>
                          <dt className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{f.k}</dt>
                          <dd className="font-data-mono text-sm text-on-background tabular-nums">{f.v}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="font-data-mono text-[10px] text-on-surface-variant mt-4 pt-3 border-t border-primary/10">Re-validated monthly. Last update logged 02:14 UTC, 28-Apr-2026.</p>
                  </div>
                  <div className="relative aspect-video overflow-hidden rounded-sm border border-primary/15 bg-surface-elevated">
                    <img alt="Ground-station data hall, rack rows receding into perspective with cyan instrument indicators" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=85&auto=format&fit=crop" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-primary/12 mix-blend-overlay z-10" aria-hidden="true"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent z-20" aria-hidden="true"></div>
                    <div className="absolute top-3 left-3 z-30 glass-panel px-2 py-1">
                      <p className="font-data-mono text-[10px] text-primary uppercase tracking-widest tabular-nums">DC · TROMSØ-2</p>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 z-30 glass-panel p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
                        <span className="font-data-mono text-[10px] text-primary uppercase tracking-widest">L1 Pipeline</span>
                      </div>
                      <p className="font-data-mono text-[11px] text-on-background tabular-nums">2.4 TB ingested · last 24h</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-sm border border-primary/15 bg-surface-elevated/70 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <span className="font-data-mono text-[10px] text-primary uppercase tracking-widest">Ground network</span>
                      <span className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest tabular-nums">14 stations · 6 ops centres</span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-5 gap-y-3">
                      {NETWORK_FIELDS.map(f => (
                        <div key={f.k}>
                          <dt className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{f.k}</dt>
                          <dd className="font-data-mono text-sm text-on-background tabular-nums">{f.v}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="font-data-mono text-[10px] text-on-surface-variant mt-4 pt-3 border-t border-primary/10">X-band downlink redundant across 3 stations per pass · pipeline triggers on first complete frame.</p>
                  </div>
                  <div className="relative overflow-hidden rounded-sm border border-primary/15 bg-surface-elevated/70 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
                        <span className="font-data-mono text-[10px] text-primary uppercase tracking-widest">Live ledger</span>
                      </div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest tabular-nums">Batch · 19,420,118</span>
                    </div>
                    <ul className="flex flex-col divide-y divide-primary/10">
                      {LEDGER_ROWS.map(r => (
                        <li key={r.h} className="py-2.5 flex items-baseline justify-between gap-3">
                          <span className="font-data-mono text-[11px] text-on-background tabular-nums">{r.h}</span>
                          <span className="font-data-mono text-[10px] text-on-surface-variant tabular-nums">{r.t}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest tabular-nums mt-4 pt-3 border-t border-primary/10">Append-only · 15-min cadence · audited monthly by Open Climate Trust</p>
                  </div>
                </div>
                <ol className="md:col-span-7 flex flex-col gap-12 md:gap-16">
                  {STAGES.map(s => (
                    <li key={s.n}>
                      <span className="font-data-mono text-primary text-xs uppercase tracking-widest block mb-2 tabular-nums">STAGE · {s.n}</span>
                      <h3 className="font-headline-md text-headline-md text-on-background leading-tight mb-4 text-balance"><em className="font-headline-md font-light italic">{s.label}</em> — {s.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant text-pretty max-w-[65ch]">{s.body}</p>
                    </li>
                  ))}
                  <li>
                    <div className="rounded-sm border border-primary/20 bg-surface-elevated/60 p-5 sm:p-6">
                      <span className="font-data-mono text-primary text-xs uppercase tracking-widest block mb-3 tabular-nums">VERIFY · YOURSELF</span>
                      <h4 className="font-headline-sm text-on-background leading-tight mb-3 text-balance">Pull a sample observation, recompute the hash, check the ledger.</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant text-pretty mb-5 max-w-[60ch]">A reproducible Jupyter notebook walks the entire chain end-to-end on a single representative L2 observation. Runs in under four minutes on a laptop.</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-5">
                        {VERIFY_FIELDS.map(f => (
                          <div key={f.k}>
                            <p className="font-data-mono text-[10px] text-primary uppercase tracking-widest mb-1">{f.k}</p>
                            <p className="font-data-mono text-xs text-on-background tabular-nums">{f.v}</p>
                          </div>
                        ))}
                      </div>
                      <a className="inline-flex items-center gap-2 font-data-mono text-xs uppercase tracking-widest text-primary hover:text-on-background transition-colors" href="#"><span>Open the notebook</span><span aria-hidden="true">→</span></a>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <section className="py-16 bg-background border-t border-primary/10 sm:py-24 md:py-32 relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 mb-10 sm:mb-12">
              <div className="max-w-[720px]">
                <span className="font-data-mono text-primary text-xs uppercase tracking-widest block mb-3">METHODOLOGY · 05</span>
                <h2 className="font-headline-md text-headline-md leading-tight text-on-background mb-4 text-balance">Measurement, not estimate.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[65ch] text-pretty">Most carbon "measurement" is statistical estimate dressed up — a regression on plot samples, projected to a continent. We disagree, and we have the orbital infrastructure to prove the difference.</p>
              </div>
            </div>
            <div className="border-y border-primary/15 bg-surface-elevated/50">
              <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 py-4 sm:py-5">
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-center md:text-left">
                  {STRIP_STATS.map(s => (
                    <li key={s.k} className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">{s.k}</span>
                      <span className="font-data-mono text-data-mono text-on-background tabular-nums mt-1">{s.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative w-screen ml-[calc(50%-50vw)] aspect-[21/9] overflow-hidden bg-surface-elevated">
              <img alt="Wide angle interior of an institutional ground-station data hall, rack rows receding into perspective with cyan instrument indicators" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-75" src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=2400&q=85&auto=format&fit=crop" width="2400" height="1029" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-primary/15 mix-blend-overlay" aria-hidden="true"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-background/80" aria-hidden="true"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" aria-hidden="true"></div>
              <div className="absolute inset-0 flex items-end">
                <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-8 md:px-12 pb-8 sm:pb-10 md:pb-14">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <p className="font-headline-lg text-headline-lg text-on-background max-w-[18ch] leading-tight text-balance">A live ground-station hall, ingesting orbit.</p>
                    <p className="font-data-mono text-[10px] text-primary uppercase tracking-widest tabular-nums max-w-[28ch]">Photographic record · ground segment hall, Reykjavík facility · winter operations</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-y border-primary/15 bg-surface-elevated/50">
              <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 py-3">
                <p className="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-widest tabular-nums text-center md:text-left">FRAME 21:9 · F/4 · 35MM EQUIV · ISO 800 · CAPTURED 14:03 UTC · PROCESS L2 · PUBLISHED CC0</p>
              </div>
            </div>
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 mt-10 sm:mt-14 md:mt-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-[1100px]">
                <p className="font-body-md text-body-md text-on-surface-variant text-pretty max-w-[65ch]">Every credit, every offset, every regulatory disclosure ultimately rests on a number — and that number is almost always a model output, not an observation. National inventories interpolate between sparse forest plots; voluntary registries trust on-the-ground audits that are themselves spot checks; satellite vendors regress against the same plot networks and call the result measurement. The chain of trust collapses into a handful of researchers and the assumptions baked into thirty-year-old allometric equations.</p>
                <p className="font-body-md text-body-md text-on-surface-variant text-pretty max-w-[65ch]">Direct measurement is qualitatively different. Our hyperspectral instruments respond to actual photons reflecting from actual canopy at thirty-metre resolution, every four days, on every continent. The atmospheric correction is reproducible and the inversion to biomass uses physics, not regression. Where ground truth exists we agree with it within the published uncertainty envelope. Where ground truth does not exist — most of the boreal north, the inland Amazon, equatorial Africa — we are simply the only continuous record. That distinction is the entire product.</p>
              </div>
            </div>
          </section>

          <section className="py-16 bg-surface-elevated border-t border-primary/10 sm:py-24 md:py-32">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12">
              <div className="mb-12 sm:mb-16 md:mb-20 max-w-[720px]">
                <span className="font-data-mono text-primary text-xs uppercase tracking-widest block mb-3">DOCTRINE · 06</span>
                <h2 className="font-headline-md text-headline-md leading-tight text-on-background mb-4 text-balance">Methodology, declared in writing.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[65ch] text-pretty">A methodology that cannot be inspected, contested, and reproduced is not a methodology — it is a marketing document. The three commitments below are the foundation of MERIDIAN's institutional contract and the reason we publish, not just announce.</p>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-16 sm:mb-20 md:mb-24">
                {DOCTRINE.map(d => (
                  <li key={d.n} className="border-l border-primary/20 pl-6 md:pl-8">
                    <span className="font-display-xl text-display-xl leading-none text-primary block mb-4 tabular-nums">{d.n}</span>
                    <h3 className="font-headline-md text-headline-md text-on-background leading-tight mb-4"><em className="font-headline-md font-light italic">{d.title}</em></h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-pretty">{d.body}</p>
                  </li>
                ))}
              </ol>
              <div className="border-t border-primary/15 pt-10 sm:pt-12">
                <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-6">Specification Sheet</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 max-w-[900px]">
                  {SPEC_ROWS.map(r => (
                    <div key={r.k} className="flex justify-between border-b border-primary/10 pb-3">
                      <dt className="font-body-md text-body-md text-on-surface-variant">{r.k}</dt>
                      <dd className="font-data-mono text-data-mono text-on-background tabular-nums">{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section className="py-16 bg-[#0a1530] border-t border-primary/10 sm:py-24 md:py-32 relative">
            <div className="max-w-[1100px] mx-auto px-5 sm:px-8 md:px-12">
              <div className="mb-10 sm:mb-12 md:mb-16">
                <span className="font-data-mono text-primary text-xs uppercase tracking-widest block mb-3">DOSSIER · 07</span>
                <h2 className="font-headline-md text-headline-md leading-tight text-on-background mb-4 text-balance">Questions, asked and answered.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[65ch] text-pretty">Seven questions that recur in every institutional procurement conversation we have. Answers below; full technical appendix on request under standard NDA.</p>
              </div>
              <div className="meridian-faq divide-y divide-primary/15 border-y border-primary/15">
                {FAQS.map(f => (
                  <details key={f.q} className="meridian-faq-item group p-5 sm:p-6">
                    <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                      <h3 className="font-body-lg text-body-lg text-on-background font-medium pr-4">{f.q}</h3>
                      <span className="meridian-chevron material-symbols-outlined text-primary shrink-0 leading-none mt-1" aria-hidden="true">chevron_right</span>
                    </summary>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-[65ch] text-pretty">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-surface-elevated border-t border-primary/10 sm:py-24 md:py-32">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12">
              <div className="mb-10 sm:mb-14 md:mb-20">
                <h2 className="font-headline-md text-headline-md leading-tight text-on-background text-balance">The Meridian Protocol</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-[1px] bg-primary/20 z-0"></div>
                {[
                  { icon: "satellite_alt", title: "01 / Ingest", body: "Continuous optical, SAR, and LiDAR data collection from multiple satellite constellations." },
                  { icon: "data_usage", title: "02 / Analyze", body: "Proprietary AI models calculate biomass, canopy density, and carbon equivalence." },
                  { icon: "verified_user", title: "03 / Verify", body: "Data is anchored to a public ledger, providing immutable proof of carbon state." },
                ].map(p => (
                  <article key={p.title} className="relative z-10 glass-panel p-8 rounded-sm">
                    <div className="w-16 h-16 rounded-sm bg-background border border-primary/30 flex items-center justify-center mb-8 mx-auto md:mx-0">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">{p.icon}</span>
                    </div>
                    <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest mb-4">{p.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-pretty max-w-[65ch]">{p.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full py-10 border-t border-primary/15 bg-slate-950 sm:py-12">
          <div className="flex flex-col items-center gap-6 px-5 max-w-[1440px] mx-auto sm:px-8 sm:gap-8 md:px-12 md:flex-row md:justify-between">
            <div className="text-lg font-headline-md text-primary">MERIDIAN</div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {["Network Status", "Privacy Framework", "Institutional Access", "Press Kit"].map(l => (
                <a key={l} className="font-label-caps text-xs tracking-widest uppercase text-slate-500 hover:text-primary active:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-sm" href="#">{l}</a>
              ))}
            </div>
            <div className="font-label-caps text-xs tracking-widest uppercase text-slate-500 text-center max-w-xs md:text-right">
              © 2024 MERIDIAN. ALL SATELLITE TELEMETRY IS VERIFIED VIA INDEPENDENT PROTOCOLS.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
