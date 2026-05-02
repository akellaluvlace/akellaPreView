const catalogTiles = [
  { code: "CCX-014 · MAINBOARD", alt: "green circuit board macro showing surface-mount components and routed traces", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-022 · IO-CARD", alt: "dense rack of dark server hardware with thin status LEDs", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-031 · CHASSIS", alt: "brushed alloy chassis render with directional studio light", src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-040 · NODE", alt: "abstract render of a compute node with cool ambient lighting", src: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-052 · DAUGHTERBOARD", alt: "exploded view of internal driver components and neodymium magnet", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuACam0gFnN6-Hw0DqJytztuQtNZDhP0ceGCpuHhCNWOy27wz3ZQNrfizI02HzA2_8joIExgjub2IjKLMgi0_cSgtpwYg2SQUQm2dXjVvgUTgkhgB1xncqg-jpRR2mGD6KuTH0XKryS9n6ZtlMGRzFPJBpHfeikJB-52UaNzQRZDg1ZErc1BUbagGfPiW_5VV-k2FsKgy0vKc8qoXGZ5rC-Z7zBxlzcH-NxcTiXJwAqqCPK13X-_2i-mIx9_0lKv-cbePZx4dQxKo_c8" },
  { code: "CCX-061 · BACKPLANE", alt: "charging case open showing internal contact pins", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw10ReBYqFIKlUu7U-ExZtQUxrfcaJckJIt3t4kvv_ao0YbK2hRSL12YRcImF1r_vUKULcU4Yn8rcTsL-4pipCP_9jFOKlEt8Ge30n_TUFhPgjZU_JhOLOJMOoS3JbxwAy1GZqp3TS_1zwgKTbVH_BqM9T7qzat492KcDbpjCdChJNzcsNS41BQWCAmin426D-X_z45R2rKgqe2BjSubZwrwY6LVc9jxMKrQAEVjqrVGVTBbPDI_UR5dVfLXfkJG4NXQh61B1_xETY" },
  { code: "CCX-073 · BRACKET", alt: "ergonomic side profile silhouette of single earbud", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBINHzQictP4DGvOeaGxRD-T0Js9OBdIYfLa7vncDeDP6AFWs4G4F2jHW4TfrsYItnd9xee6e_yJMDm73vbEjzPd5khV_wpyAIOa2O-QbeM40z5Joc5Q5GGujEWDC5pPinXPLenIM_3UIaRDUlqmpaa-MFiOGOOWznjI-_-stVkmT3Hgd_Fo-nRCX9BgeKf5fc8JrpAT3f4AvAXunOvqgnLLaC9Qx-DtlqdA0addGWB6jpPJn-rGXrru57zGn8bTXhYEAOhWVp3tHhS" },
  { code: "CCX-088 · CABLE-KIT", alt: "silicone ear tips in three sizes laid out on dark grid", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs6QcsqECwJ49_mxM06l7sl5_A420KkkaNj3LUS-ZV6a6lcMlafk923t1V_ZP4UkGFej0_JuNlLi-aSNRpmEY5EdV-pHCv9dkV8Mj3posArJyPT89uHoA8sAeg3XOR-xS0QGRs_57sZYGiyY7vFJyhS6ihQdIXH0qedau4Jj7NWi4EVothYFAbVfUuRA3b6_LNye5ni31ZyMBABOtvGYjnwUfcwvpO7ljh_zX2JDK0qff18RSc-D2YXPQDXpIDngp2zITKorPlDSjB" },
  { code: "CCX-094 · MEZZANINE", alt: "hero earbud product render in studio black backdrop", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDptAtMrltAolM9WnqaY51PYKeiR4h2c8pcNJ2daNHcQS0sVfxM-mgrZ6UoFp6sNjB6bDyPLg9UIyc7DLz8y6B8zRC5BqBKocsujs3Jw4PvXuhAFGO9wwJ5GAuxg4BM-WC6wwf5kzexDmtfQNHaa4xisxGOfuC-2AM3HCFYmiaIE--DFRZAN3q8yviwpOYfLSGgKMNZ3YjtutW-79CX4X2Jvb3Q8BnDxbcjLqc6Td452aNrtBPKjxPkhGyRlem3zTOe4PMVP_ow6LBO", hideOnMobile: true },
  { code: "CCX-100 · PSU-MOD", alt: "earbud resting in charging cradle with status indicator", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuUSelse5xFB3Guj2gvEJaT37TEHcx2i0phUUVOnE27lNz9nkycVgi9p6tyB5dkH3eBCM-d5v9fDpAuv0jD0H--mDkTKBxHAw6qeWPX9aGKCGKXWOUz8Drv413MUK2xxEdY9drF23Cy78lbEMdTqLaHjKCUMsMdhL3nQD9r9YCDIwDGf4gXacmKZrURVWozXuxkh_R0u2iMIwMKv-Y0Jw-nZ0xa-xHUE1KeMQ1RIw_n96AEU-PtVOtVGxVe-33F--ir_ChHKnywtIP", hideOnMobile: true },
  { code: "CCX-108 · ANTENNA", alt: "abstract glowing geometric sphere render — antenna emitter reference", src: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-115 · LED-ARRAY", alt: "iridescent chromatic surface texture — LED array reference", src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-122 · DRIVER-MAG", alt: "abstract mechanical heart render — driver-magnet reference", src: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-129 · POWER-CELL", alt: "vintage tech product render with detailed depth of field", src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-136 · SHIELD-AL", alt: "abstract hovering enclosure render with mechanical detail", src: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&q=70&auto=format&fit=crop" },
  { code: "CCX-143 · TAP-ZONE", alt: "charging cradle re-cropped as tap-zone render", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuUSelse5xFB3Guj2gvEJaT37TEHcx2i0phUUVOnE27lNz9nkycVgi9p6tyB5dkH3eBCM-d5v9fDpAuv0jD0H--mDkTKBxHAw6qeWPX9aGKCGKXWOUz8Drv413MUK2xxEdY9drF23Cy78lbEMdTqLaHjKCUMsMdhL3nQD9r9YCDIwDGf4gXacmKZrURVWozXuxkh_R0u2iMIwMKv-Y0Jw-nZ0xa-xHUE1KeMQ1RIw_n96AEU-PtVOtVGxVe-33F--ir_ChHKnywtIP", filter: "saturate-150 hue-rotate-[200deg]", pos: "30% 70%" },
];

const insideSteps = [
  { num: "01", tag: "Substrate", primary: true, headline: "6-layer FR-4 with controlled impedance", body: "Every Circuit Core X mainboard begins on a six-layer FR-4 substrate cured to a glass transition above 170 degrees Celsius, with copper weights stepped from one ounce on signal planes to two ounces on the inner power pours. We specify controlled impedance of fifty ohms single-ended and one hundred ohms differential on every high-speed pair, and the fab house verifies it on coupons attached to each panel before they ship. The result is a board that does not flex, does not delaminate at reflow, and does not surprise you on the bench three months in. Boards that fail the impedance window get scrapped, not patched." },
  { num: "02", tag: "Power", headline: "Isolated 12V / 5V / 3.3V rails", body: "Power on the X is split across three independently regulated rails — twelve volts for motor and high-current peripherals, five volts for legacy logic, three-point-three for the SoC and memory island. Each rail has its own buck converter, its own ferrite bead, and its own ground-stitching back to the star point under the main connector. Rails are sequenced through a dedicated PMIC so the SoC never sees a brownout during cold start, and every output is monitored by a window comparator that latches a fault flag the moment voltage drifts more than three percent. You see it on the diagnostic header before your code ever notices." },
  { num: "03", tag: "Routing", headline: "12-mil signal trace, length-matched pairs", body: "High-speed routing is held to a twelve-mil minimum trace width, with length-matching tolerance of plus-or-minus five mils across every differential pair on the DDR and PCIe busses. Vias are back-drilled on the long stubs to keep reflections below the eye-mask threshold at three gigatransfers per second, and we run a full eye-diagram sweep on a sample from every panel. Sensitive analog lines route on inner layers between two solid grounds, with no vias and no via-stitching closer than thirty mils. The board layout file is published alongside the schematic so you can audit every choice before you commit it to a production run." },
  { num: "04", tag: "Test", headline: "Burn-in @ 70°C for 168 hours", body: "Every assembled board sits in a thermal chamber at seventy degrees Celsius for one hundred sixty-eight straight hours — a full week — running a synthetic load that exercises CPU, DRAM, both PCIe lanes, and all four power rails simultaneously. The chamber logs voltage, current, and case temperature once per second, and any board that drifts outside its envelope is pulled and triaged on the spot. Boards that pass exit with a serialized burn-in report you can pull from our portal by serial number for the lifetime of the unit. We do not ship anything that has not earned its serial number on the bench." },
];

const altRows = [
  { fig: "FIG.A — CLOCK", tag: "Clock", headline: "1.6 GHz dual-core, ±20 ppm reference", body: "The X clocks at one-point-six gigahertz on each of two ARM Cortex cores, fed from a temperature-compensated crystal oscillator with twenty parts-per-million stability across the full minus-twenty to seventy-degree industrial range. Jitter at the SoC pin is measured below three picoseconds RMS on a sample from every production lot, and the reference is buffered through a fanout chip so radio peripherals never share a noisy clock node with the digital fabric. If your application is doing closed-loop control or precision timestamping, you do not have to fight your own oscillator on top of everything else.", src: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=900&q=80&auto=format&fit=crop", alt: "industrial machinery panels with bolts and brushed alloy under cool indoor light", imageLeft: true },
  { fig: "FIG.B — IO", tag: "I/O", headline: "48 GPIO, 4 UART, 2 SPI, 6 I²C, native CAN", body: "Forty-eight GPIO pins, every single one of them three-point-three-volt level-shifted with ESD protection rated for eight kilovolts of contact discharge. Four hardware UARTs, two SPI masters with chip-select multiplexing for up to sixteen targets, six I-squared-C buses with separate pull-up domains, and a native CAN-FD controller wired straight to a high-speed transceiver. None of it is bit-banged, none of it depends on the SoC's internal voltage rails surviving a shorted peripheral. Pin headers stay in the same physical location across every revision so harnesses you build today still drop in three years from now.", src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80&auto=format&fit=crop", alt: "server hardware rack with backplane connectors and parallel I/O cards", imageLeft: false },
  { fig: "FIG.C — THERMAL", tag: "Thermal", headline: "−20°C to +70°C, fanless to 5W sustained", body: "Operating range runs from minus-twenty to plus-seventy degrees Celsius without throttling, with a five-watt sustained dissipation envelope that the X holds purely through copper pour and a stamped aluminum heatspreader — no fan, no fluid, no moving parts at all. Junction temperature is monitored on-die at twenty-hertz and reported on the diagnostic UART, so you can watch your worst-case thermal headroom in real time and design your enclosure to match. The board has been qualified in twelve-hour soak tests at both extremes and survives thermal cycling between them at one cycle every six minutes for five hundred cycles.", src: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=900&q=80&auto=format&fit=crop", alt: "server room with cool blue indicator lights along racks suggesting thermal stability", imageLeft: true },
];

const faqEntries = [
  { num: "Q.01", q: "What's the warranty?", a: "Every Circuit Core X ships with a five-year limited hardware warranty covering manufacturing defects, solder failures, and component-out-of-spec conditions confirmed against the burn-in report. RMA turnaround is typically eight working days from receipt at our Rotterdam depot, and any board that fails inside the first ninety days is replaced with a new unit at our cost. Boards damaged by ESD, reverse polarity on the power input, or a customer-side firmware flash that bricks the bootloader are out of warranty but eligible for our flat-rate repair service." },
  { num: "Q.02", q: "Lead time?", a: "Single-unit and small-quantity orders ship from inventory in twenty-four hours, with tracking dispatched same-day if the order is placed before fifteen-hundred Central European Time. Quantities above one hundred units are quoted with a four to six-week lead time depending on whether your build is on the standard chassis finish or a custom panel SKU. We hold roughly nine hundred units in stock at any given moment across our three depots, and we never accept an order we cannot ship — the cart will refuse rather than backorder." },
  { num: "Q.03", q: "Trade-in policy?", a: "Returning a working previous-generation Circuit Core X — including the original v1 board — earns you a flat trade-in credit of forty US dollars per unit toward any new-generation order placed within ninety days of the trade-in shipment being received and verified. Boards must power on, pass our automated diagnostic suite, and arrive in their factory anti-static bag. Cosmetic wear on the chassis is fine; missing standoffs or chewed connectors are not. Credits stack across multiple units in a single order with no upper limit, and we will not put a limit on it next year either." },
  { num: "Q.04", q: "Do you support BYO repair?", a: "Yes — every Circuit Core X ships with full schematics, a board-layout PDF, a populated bill of materials with manufacturer part numbers, and a downloadable test-point map keyed to the silkscreen reference designators. We sell common service spares — connectors, the power-input MOSFET, the boot flash — at parts cost plus shipping. A self-repair never voids your warranty as long as the original burn-in serial is still readable on the chassis tag. We will not ship you a tamper sticker. Field-repair beats waiting nine days for an RMA in most production scenarios." },
  { num: "Q.05", q: "Bulk discounts?", a: "Order tiers kick in at twenty-five units, fifty units, one hundred units, and five hundred units, with discounts of five, eight, twelve, and seventeen percent against the unit list price respectively. The discount applies automatically at checkout — there is no quote process for standard configurations, and you do not need to email a sales team to unlock it. Orders above five hundred units are negotiated directly with engineering, since at that volume we are typically discussing custom chassis, custom firmware defaults, or a private SKU with its own burn-in profile, and a discount conversation belongs in the same room." },
  { num: "Q.06", q: "Compatibility with v1?", a: "Pin-compatible across the main forty-pin header, including power, ground, and all GPIO assignments — a v1 harness drops onto an X with no rework. The auxiliary high-speed connector changed from a sixteen-pin FFC to a twenty-pin SMT board-to-board on the X to support PCIe Gen3, so any peripheral that used the old FFC port needs an adapter board which we sell for nineteen US dollars. Firmware running on a v1 binary boots on an X but will not see the new IO map until you update — the migration guide in the documentation covers every register that moved." },
  { num: "Q.07", q: "Open-source firmware?", a: "The full firmware tree — bootloader, hardware abstraction layer, drivers, diagnostic suite — is published under the Apache 2.0 license on our public repository, with signed release tags matching every shipped revision. The hardware secure-element key is the only proprietary component, because it is provisioned per-unit at the factory; everything else is yours to fork, audit, and rebuild. We accept upstream pull requests and merge them on a two-week cadence. There is no separate \"enterprise\" branch with extra features — the public tree is the production tree, and we ship from it." },
  { num: "Q.08", q: "RoHS status?", a: "Every Circuit Core X is RoHS-3 compliant by default — lead-free SAC305 solder, halogen-free FR-4, and component selection that meets EU directive 2015/863 across all ten restricted substances. We hold the certificate of compliance on file per production lot and supply it on request to any commercial buyer. REACH SVHC declarations are reviewed quarterly against the latest candidate list, and we proactively reformulate when a flagged substance enters the watchlist rather than waiting for an enforcement deadline. Customers in regulated medical or aerospace contexts can request the lot-level certificate at the time of order." },
];

export default function T14TechGadgetStore() {
  const navLinks = [
    { label: "Specs", active: true },
    { label: "Engineered" },
    { label: "Compare" },
    { label: "Support" },
  ];
  const thumbs = [
    { selected: true, alt: "close up of matte black earbud charging case slightly open revealing internal contact pins, dark studio lighting", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw10ReBYqFIKlUu7U-ExZtQUxrfcaJckJIt3t4kvv_ao0YbK2hRSL12YRcImF1r_vUKULcU4Yn8rcTsL-4pipCP_9jFOKlEt8Ge30n_TUFhPgjZU_JhOLOJMOoS3JbxwAy1GZqp3TS_1zwgKTbVH_BqM9T7qzat492KcDbpjCdChJNzcsNS41BQWCAmin426D-X_z45R2rKgqe2BjSubZwrwY6LVc9jxMKrQAEVjqrVGVTBbPDI_UR5dVfLXfkJG4NXQh61B1_xETY" },
    { alt: "macro exploded view rendering of earbud internal driver components and neodymium magnet, metallic textures, blueprint style", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuACam0gFnN6-Hw0DqJytztuQtNZDhP0ceGCpuHhCNWOy27wz3ZQNrfizI02HzA2_8joIExgjub2IjKLMgi0_cSgtpwYg2SQUQm2dXjVvgUTgkhgB1xncqg-jpRR2mGD6KuTH0XKryS9n6ZtlMGRzFPJBpHfeikJB-52UaNzQRZDg1ZErc1BUbagGfPiW_5VV-k2FsKgy0vKc8qoXGZ5rC-Z7zBxlzcH-NxcTiXJwAqqCPK13X-_2i-mIx9_0lKv-cbePZx4dQxKo_c8" },
    { alt: "close up of silicone ear tips in three different sizes laid out mathematically on a dark grid surface", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs6QcsqECwJ49_mxM06l7sl5_A420KkkaNj3LUS-ZV6a6lcMlafk923t1V_ZP4UkGFej0_JuNlLi-aSNRpmEY5EdV-pHCv9dkV8Mj3posArJyPT89uHoA8sAeg3XOR-xS0QGRs_57sZYGiyY7vFJyhS6ihQdIXH0qedau4Jj7NWi4EVothYFAbVfUuRA3b6_LNye5ni31ZyMBABOtvGYjnwUfcwvpO7ljh_zX2JDK0qff18RSc-D2YXPQDXpIDngp2zITKorPlDSjB" },
    { alt: "perfect side profile silhouette of a single earbud demonstrating ergonomic curve against pure black background", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBINHzQictP4DGvOeaGxRD-T0Js9OBdIYfLa7vncDeDP6AFWs4G4F2jHW4TfrsYItnd9xee6e_yJMDm73vbEjzPd5khV_wpyAIOa2O-QbeM40z5Joc5Q5GGujEWDC5pPinXPLenIM_3UIaRDUlqmpaa-MFiOGOOWznjI-_-stVkmT3Hgd_Fo-nRCX9BgeKf5fc8JrpAT3f4AvAXunOvqgnLLaC9Qx-DtlqdA0addGWB6jpPJn-rGXrru57zGn8bTXhYEAOhWVp3tHhS" },
    { alt: "earbud resting in charging cradle with glowing status indicator light, dark moody lighting", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuUSelse5xFB3Guj2gvEJaT37TEHcx2i0phUUVOnE27lNz9nkycVgi9p6tyB5dkH3eBCM-d5v9fDpAuv0jD0H--mDkTKBxHAw6qeWPX9aGKCGKXWOUz8Drv413MUK2xxEdY9drF23Cy78lbEMdTqLaHjKCUMsMdhL3nQD9r9YCDIwDGf4gXacmKZrURVWozXuxkh_R0u2iMIwMKv-Y0Jw-nZ0xa-xHUE1KeMQ1RIw_n96AEU-PtVOtVGxVe-33F--ir_ChHKnywtIP" },
  ];
  const colors = [
    { name: "OBSIDIAN", hex: "#1A1A1C", checked: true },
    { name: "TITANIUM", hex: "#8C8D91" },
    { name: "COBALT", hex: "#1E2E4A" },
  ];
  const sizes = [
    { label: "S" },
    { label: "M", checked: true },
    { label: "L" },
  ];
  const trustBadges = [
    { icon: "local_shipping", label: "Ships in 24h" },
    { icon: "high_quality", label: "Hi-Res Audio", border: true },
    { icon: "water_drop", label: "IP67 Rated" },
  ];
  const specs = [
    { label: "Endurance", value: "48hr", primary: true },
    { label: "Durability", value: "IP67" },
    { label: "Acoustics", value: "12mm" },
    { label: "Protocol", value: "BT 5.3" },
    { label: "Isolation", value: "35dB", primary: true },
    { label: "Resolution", value: "96kHz" },
    { label: "Velocity", value: "15min" },
    { label: "Array", value: "6 Mic" },
  ];
  const compareRows = [
    { metric: "Driver Size", us: "12mm Neodymium", a: "10mm", b: "11mm", c: "8mm Dual" },
    { metric: "Active Noise Cancellation", us: "35dB Adaptive", usPrimary: true, a: "30dB Standard", b: "32dB Standard", c: "N/A" },
    { metric: "Total Battery Life", us: "48 Hours", a: "36 Hours", b: "24 Hours", c: "40 Hours" },
    { metric: "Water Resistance", us: "IP67", a: "IPX4", b: "IP55", c: "IPX4" },
    { metric: "Codec Support", us: "LDAC, aptX Lossless", a: "AAC, SBC", b: "LDAC, AAC", c: "aptX, AAC" },
  ];
  const footerLinks = ["Privacy Policy", "Technical Warranty", "Certifications", "Contact"];
  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script type="text/plain" dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "secondary-container": "#47494c", "outline-variant": "#424754",
                "secondary": "#c6c6ca", "on-secondary": "#2f3034", "primary": "#adc6ff",
                "surface-variant": "#353437", "on-primary-container": "#00285d",
                "tertiary": "#c8c5cb", "outline": "#8c909f", "on-surface": "#e5e1e4",
                "on-surface-variant": "#c2c6d6", "surface-container": "#201f21",
                "on-primary": "#002e6a", "background": "#131315",
                "surface-container-lowest": "#0e0e10", "surface": "#131315",
                "surface-container-high": "#2a2a2c", "surface-container-low": "#1b1b1d",
                "on-background": "#e5e1e4", "error": "#ffb4ab",
                "primary-container": "#4d8eff"
              },
              borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
              spacing: { "margin": "48px", "stack-sm": "8px", "stack-md": "16px", "stack-lg": "32px", "unit": "4px", "container-max": "1440px", "gutter": "24px" },
              fontFamily: {
                "body-md": ["Inter"], "headline-lg": ["Inter"], "display-xl": ["Inter"],
                "spec-value": ["Space Grotesk"], "spec-code": ["Space Grotesk"]
              },
              fontSize: {
                "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
                "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
                "display-xl": ["72px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
                "spec-value": ["18px", { lineHeight: "1.2", fontWeight: "700" }],
                "spec-code": ["14px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }]
              }
            }
          }
        }
      ` }} />

      <div className="bg-surface-container-lowest text-on-surface font-body-md text-body-md antialiased pt-24 selection:bg-primary-container selection:text-on-primary-container dark">
        <header className="bg-zinc-950 fixed top-0 w-full border-b border-zinc-800 z-50">
          <div className="flex justify-between items-center gap-3 px-4 py-4 max-w-[1440px] mx-auto w-full sm:px-6 md:px-8">
            <div className="text-base font-black tracking-tighter text-white uppercase sm:text-xl">CIRCUIT</div>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(l => (
                <a key={l.label} className={l.active
                  ? "font-inter uppercase tracking-widest text-[11px] font-semibold text-blue-500 border-b border-blue-500 pb-1 active:scale-95 duration-100"
                  : "font-inter uppercase tracking-widest text-[11px] font-semibold text-zinc-400 hover:text-blue-400 transition-all duration-200 active:scale-95"
                } href="#">{l.label}</a>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <button type="button" className="text-zinc-400 hover:text-blue-400 transition-all duration-200 active:scale-95">
                <span className="material-symbols-outlined">shopping_cart</span>
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="max-w-container-max mx-auto px-4 py-10 sm:px-6 sm:py-16 md:px-margin md:py-margin">
            <div className="grid grid-cols-12 gap-6 sm:gap-gutter">
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-stack-sm">
                <div className="w-full aspect-[4/3] bg-surface-container relative border border-outline-variant flex items-center justify-center overflow-hidden" style={{ background: "radial-gradient(circle at center, #201f21 0%, #0e0e10 100%)" }}>
                  <img alt="Circuit Core X" className="object-contain w-3/4 h-3/4 z-10 filter drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDptAtMrltAolM9WnqaY51PYKeiR4h2c8pcNJ2daNHcQS0sVfxM-mgrZ6UoFp6sNjB6bDyPLg9UIyc7DLz8y6B8zRC5BqBKocsujs3Jw4PvXuhAFGO9wwJ5GAuxg4BM-WC6wwf5kzexDmtfQNHaa4xisxGOfuC-2AM3HCFYmiaIE--DFRZAN3q8yviwpOYfLSGgKMNZ3YjtutW-79CX4X2Jvb3Q8BnDxbcjLqc6Td452aNrtBPKjxPkhGyRlem3zTOe4PMVP_ow6LBO" />
                  <div className="absolute top-4 left-4 font-spec-code text-spec-code text-secondary opacity-50">SCN-01: ISO_VIEW</div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-spec-code text-spec-code text-primary opacity-80 uppercase text-[10px]">Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-stack-sm">
                  {thumbs.map((t, i) => (
                    <button key={i} type="button" className={t.selected
                      ? "aspect-square bg-surface border-2 border-primary overflow-hidden flex items-center justify-center p-2"
                      : "aspect-square bg-surface border border-outline-variant overflow-hidden flex items-center justify-center p-2 hover:border-outline transition-colors"
                    }>
                      <img alt={t.alt} className={t.selected ? "object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity" : "object-cover w-full h-full opacity-50 hover:opacity-100 transition-opacity"} src={t.src} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5 flex flex-col pt-stack-md lg:pl-stack-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-spec-code text-spec-code text-primary tracking-widest uppercase">MODEL NO: C-X-2024</span>
                </div>
                <h1 className="font-display-xl text-[40px] text-on-surface mb-stack-sm uppercase leading-none sm:text-[56px] md:text-display-xl">CIRCUIT CORE X</h1>
                <div className="flex items-baseline gap-4 mb-8 border-b border-outline-variant pb-stack-md sm:mb-margin">
                  <span className="font-spec-value text-spec-value text-on-surface text-2xl tracking-tight sm:text-3xl">$249.00</span>
                  <span className="font-spec-code text-spec-code text-secondary">USD</span>
                </div>
                <div className="flex flex-col gap-stack-lg">
                  <div>
                    <div className="flex justify-between items-baseline mb-stack-sm">
                      <span className="font-spec-code text-spec-code text-on-surface uppercase">1. Chassis Finish</span>
                      <span className="font-spec-code text-spec-code text-secondary text-[10px]">OBSIDIAN SELECTED</span>
                    </div>
                    <div className="flex gap-4">
                      {colors.map(c => (
                        <label key={c.name} className="cursor-pointer relative group">
                          <input defaultChecked={c.checked} className="sr-only peer" name="color" type="radio" />
                          <div className="w-12 h-12 border-2 border-outline-variant peer-checked:border-primary transition-colors" style={{ backgroundColor: c.hex }}></div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-spec-code text-[10px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{c.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-baseline mb-stack-sm">
                      <span className="font-spec-code text-spec-code text-on-surface uppercase">2. Tip Fitment</span>
                      <span className="font-spec-code text-spec-code text-primary text-[10px] hover:underline cursor-pointer">SIZING GUIDE</span>
                    </div>
                    <div className="grid grid-cols-3 gap-unit">
                      {sizes.map(s => (
                        <label key={s.label} className="cursor-pointer">
                          <input defaultChecked={s.checked} className="sr-only peer" name="size" type="radio" />
                          <div className="py-3 text-center border border-outline-variant bg-surface-container peer-checked:bg-surface-container-high peer-checked:border-primary font-spec-code text-spec-code text-secondary peer-checked:text-on-surface transition-all hover:bg-surface-container-high">{s.label}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-stack-md pt-stack-md border-t border-outline-variant">
                    <div className="flex gap-unit mb-stack-md">
                      <div className="w-16 border border-outline-variant flex items-center justify-center bg-surface-container">
                        <span className="font-spec-code text-spec-code text-on-surface">01</span>
                      </div>
                      <button type="button" className="flex-1 bg-primary text-on-primary font-spec-code uppercase py-4 tracking-widest font-bold hover:bg-primary-container transition-colors shadow-[0_0_15px_rgba(173,198,255,0.2)]">
                        Initialize Order
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-4 bg-surface-container-low border border-outline-variant px-4">
                      {trustBadges.map(b => (
                        <div key={b.label} className={b.border ? "flex flex-col items-center gap-1 text-center border-x border-outline-variant" : "flex flex-col items-center gap-1 text-center"}>
                          <span className="material-symbols-outlined text-secondary text-sm">{b.icon}</span>
                          <span className="font-spec-code text-[10px] text-secondary uppercase">{b.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-outline-variant bg-surface mt-10 sm:mt-margin">
            <div className="max-w-container-max mx-auto px-4 py-10 sm:px-6 sm:py-16 md:px-margin md:py-margin">
              <div className="flex items-center gap-4 mb-8 sm:mb-stack-lg">
                <h2 className="font-headline-lg text-[22px] text-on-surface uppercase sm:text-[28px] md:text-headline-lg">Core Specifications</h2>
                <div className="flex-1 h-px bg-outline-variant"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-gutter">
                {specs.map(s => (
                  <div key={s.label} className={s.primary
                    ? "bg-surface-container p-stack-md border-l-2 border-primary flex flex-col justify-end min-h-[140px] hover:bg-surface-container-high transition-colors"
                    : "bg-surface-container p-stack-md border-l-2 border-outline-variant flex flex-col justify-end min-h-[140px] hover:bg-surface-container-high transition-colors"
                  }>
                    <div className="font-spec-code text-spec-code text-secondary mb-2 uppercase">{s.label}</div>
                    <div className="font-spec-value text-2xl text-on-surface tracking-tight sm:text-3xl md:text-4xl">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-container-max mx-auto px-4 py-10 mt-10 sm:px-6 sm:py-16 sm:mt-margin md:px-margin md:py-margin">
            <h2 className="font-headline-lg text-[22px] text-on-surface uppercase mb-8 sm:text-[28px] sm:mb-stack-lg md:text-headline-lg">Data Matrix Comparison</h2>
            <div className="w-full overflow-x-auto border border-outline-variant bg-surface-container">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline text-secondary">
                    <th className="p-stack-md font-spec-code text-spec-code uppercase font-normal">Metric</th>
                    <th className="p-stack-md font-spec-code text-spec-code uppercase text-primary border-l border-primary bg-[#1A1A24]">Circuit Core X</th>
                    <th className="p-stack-md font-spec-code text-spec-code uppercase font-normal border-l border-outline-variant">Competitor A</th>
                    <th className="p-stack-md font-spec-code text-spec-code uppercase font-normal border-l border-outline-variant">Competitor B</th>
                    <th className="p-stack-md font-spec-code text-spec-code uppercase font-normal border-l border-outline-variant">Competitor C</th>
                  </tr>
                </thead>
                <tbody className="font-spec-value text-[14px]">
                  {compareRows.map((row, i) => (
                    <tr key={row.metric} className={i % 2 === 0 ? "border-b border-outline-variant bg-surface" : "border-b border-outline-variant bg-surface-container-low"}>
                      <td className="p-stack-md text-secondary font-spec-code">{row.metric}</td>
                      <td className={row.usPrimary ? "p-stack-md text-primary border-l border-primary bg-[#1A1A24]" : "p-stack-md text-on-surface border-l border-primary bg-[#1A1A24]"}>{row.us}</td>
                      <td className="p-stack-md text-secondary border-l border-outline-variant">{row.a}</td>
                      <td className="p-stack-md text-secondary border-l border-outline-variant">{row.b}</td>
                      <td className="p-stack-md text-secondary border-l border-outline-variant">{row.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Catalog · in stock — STATIC SIDE-BY-SIDE GRID (no animation, no marquee). */}
          <section className="max-w-container-max mx-auto px-4 py-10 mt-10 sm:px-6 sm:py-16 sm:mt-margin md:px-margin md:py-margin">
            <div className="flex items-center gap-4 mb-8 sm:mb-stack-lg">
              <h2 className="font-headline-lg text-[22px] text-on-surface uppercase sm:text-[28px] md:text-headline-lg">Catalog · In Stock</h2>
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="font-spec-code text-spec-code text-secondary uppercase tracking-widest hidden sm:inline">16 SKUs · ships in 24h</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {catalogTiles.map(t => (
                <div key={t.code} className={t.hideOnMobile
                  ? "relative aspect-square bg-surface-container border border-outline-variant overflow-hidden group hidden sm:block"
                  : "relative aspect-square bg-surface-container border border-outline-variant overflow-hidden group"
                }>
                  <img alt={t.alt} className={`absolute inset-0 w-full h-full object-cover ${t.filter || "mix-blend-luminosity"}`} style={t.pos ? { objectPosition: t.pos } : undefined} src={t.src} />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                  <div className="absolute top-2 left-2 right-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="font-spec-code text-[9px] text-on-surface uppercase tracking-widest">{t.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Inside the Circuit Core X — sticky-photo + scrolling text walkthrough (NOVEL #8). */}
          <section className="max-w-container-max mx-auto px-4 py-10 mt-10 sm:px-6 sm:py-16 sm:mt-margin md:px-margin md:py-margin">
            <div className="flex items-center gap-4 mb-8 sm:mb-stack-lg">
              <h2 className="font-headline-lg text-[22px] text-on-surface uppercase sm:text-[28px] md:text-headline-lg">Inside the Circuit Core X</h2>
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="font-spec-code text-spec-code text-secondary uppercase tracking-widest hidden sm:inline">04 stages · engineering log</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-32 aspect-[4/5] bg-surface-container border border-outline-variant overflow-hidden relative">
                  <img alt="green circuit board macro showing surface-mount components and routed traces under directional light" className="absolute inset-0 w-full h-full object-cover grayscale contrast-110" src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop" />
                  <div className="absolute inset-0 bg-primary/15 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-surface/70 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 font-spec-code text-spec-code text-on-surface opacity-80">CCX · MACRO 01:24</div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-baseline justify-between">
                    <span className="font-spec-code text-spec-code text-on-surface uppercase">PCB · 6-LAYER FR-4</span>
                    <span className="font-spec-code text-[10px] text-secondary tracking-widest">REV. D / LOT 0294</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-stack-lg">
                {insideSteps.map(step => (
                  <div key={step.num} className={step.primary ? "border-l-2 border-primary pl-6" : "border-l-2 border-outline-variant pl-6"}>
                    <div className="flex items-baseline gap-3 mb-stack-sm">
                      <span className="font-spec-code text-spec-code text-primary tracking-widest">{step.num}</span>
                      <span className="font-spec-code text-spec-code text-secondary uppercase tracking-widest">{step.tag}</span>
                    </div>
                    <h3 className="font-headline-lg text-[20px] text-on-surface mb-stack-sm uppercase sm:text-[24px]">{step.headline}</h3>
                    <p className="text-on-surface-variant leading-relaxed">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Specs that matter — alt-rows (3 rows, alternating sides) (NOVEL #M.1.2). */}
          <section className="bg-surface mt-10 border-y border-outline-variant sm:mt-margin">
            <div className="max-w-container-max mx-auto px-4 py-10 sm:px-6 sm:py-16 md:px-margin md:py-margin">
              <div className="flex items-center gap-4 mb-8 sm:mb-stack-lg">
                <h2 className="font-headline-lg text-[22px] text-on-surface uppercase sm:text-[28px] md:text-headline-lg">Specs That Matter</h2>
                <div className="flex-1 h-px bg-outline-variant"></div>
                <span className="font-spec-code text-spec-code text-secondary uppercase tracking-widest hidden sm:inline">03 of 12 · primary</span>
              </div>
              <div className="flex flex-col gap-stack-lg">
                {altRows.map(row => (
                  <div key={row.fig} className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-center">
                    <div className={row.imageLeft
                      ? "lg:col-span-6 aspect-[4/3] bg-surface-container border border-outline-variant overflow-hidden relative"
                      : "lg:col-span-6 aspect-[4/3] bg-surface-container border border-outline-variant overflow-hidden relative lg:order-2 order-1"
                    }>
                      <img alt={row.alt} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity" src={row.src} />
                      <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                      <div className="absolute top-4 left-4 font-spec-code text-spec-code text-on-surface opacity-80">{row.fig}</div>
                    </div>
                    <div className={row.imageLeft
                      ? "lg:col-span-6 flex flex-col gap-stack-sm"
                      : "lg:col-span-6 flex flex-col gap-stack-sm lg:order-1 order-2"
                    }>
                      <span className="font-spec-code text-spec-code text-primary tracking-widest uppercase">{row.tag}</span>
                      <h3 className="font-headline-lg text-[22px] text-on-surface uppercase sm:text-[26px]">{row.headline}</h3>
                      <p className="text-on-surface-variant leading-relaxed">{row.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: In the wild — half-full-bleed image escaping right edge (NOVEL #7). */}
          <section className="max-w-container-max mx-auto px-4 py-10 mt-10 sm:px-6 sm:py-16 sm:mt-margin md:px-margin md:py-margin overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">
              <div className="flex flex-col gap-stack-md pr-4">
                <span className="font-spec-code text-spec-code text-primary tracking-widest uppercase">Field deployment</span>
                <h2 className="font-headline-lg text-[22px] text-on-surface uppercase sm:text-[28px] md:text-headline-lg">In the wild</h2>
                <p className="text-on-surface-variant leading-relaxed">Circuit Core X boards are running today in colocation cages from Frankfurt to Singapore, sitting under load on the lower rails of customer racks where the temperature swings ten degrees over the course of a workday. They handle ingest from in-line sensors, drive serial fan-out for control systems, and bridge legacy RS-485 networks to modern message busses without a microcontroller in front of them. Operators tell us the thing they value most is the predictability — five years of board-level revisions and not one incompatible pinout, which means a unit ordered today drops into a chassis that was specified in 2021.</p>
                <p className="text-on-surface-variant leading-relaxed">Outside the data center, the X shows up in embedded enclosures bolted to factory-floor machinery, in field-deployed weather shelters running on solar with battery backup, and on the prototyping benches of every engineering team that has gotten tired of fighting their dev kit. The same hardware, the same firmware tree, the same diagnostic UART. Because we do not ship a "consumer" SKU and an "industrial" SKU and hope you pick correctly — every board off the line passes the same burn-in, ships with the same documentation bundle, and earns the same five-year warranty.</p>
                <div className="flex items-center gap-4 pt-stack-sm">
                  <span className="font-spec-code text-spec-code text-secondary uppercase tracking-widest">Active deployments</span>
                  <span className="font-spec-value text-2xl text-on-surface tracking-tight">12,400+</span>
                </div>
              </div>
              <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[480px] mr-[calc(50%-50vw)] bg-surface-container border-l border-y border-outline-variant overflow-hidden">
                <img alt="server room corridor with parallel racks and cool blue indicator lights stretching into the distance" className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity" src="https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1600&q=80&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-primary/12 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-surface/40 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 font-spec-code text-spec-code text-on-surface opacity-80">SCN-04: SITE_LOG</div>
                <div className="absolute bottom-4 left-4 right-4 flex items-baseline justify-between">
                  <span className="font-spec-code text-spec-code text-on-surface uppercase">DC-FRA-04 · RACK 12B</span>
                  <span className="font-spec-code text-[10px] text-secondary tracking-widest">2026-04-30 · 23:04 UTC</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: FAQ accordion — 8 Q&A pairs hardware-store specific (§M.7). */}
          <section className="max-w-container-max mx-auto px-4 py-10 mt-10 sm:px-6 sm:py-16 sm:mt-margin md:px-margin md:py-margin">
            <div className="flex items-center gap-4 mb-8 sm:mb-stack-lg">
              <h2 className="font-headline-lg text-[22px] text-on-surface uppercase sm:text-[28px] md:text-headline-lg">Field Questions</h2>
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="font-spec-code text-spec-code text-secondary uppercase tracking-widest hidden sm:inline">08 entries · v2.1</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md">
              {faqEntries.map(f => (
                <details key={f.num} className="group bg-surface-container border-l-2 border-outline-variant hover:border-primary transition-colors">
                  <summary className="flex items-baseline justify-between gap-4 px-stack-md py-stack-md cursor-pointer list-none">
                    <span className="flex items-baseline gap-3">
                      <span className="font-spec-code text-spec-code text-primary tracking-widest">{f.num}</span>
                      <span className="font-headline-lg text-[16px] text-on-surface uppercase sm:text-[18px]">{f.q}</span>
                    </span>
                    <span className="material-symbols-outlined text-secondary group-open:rotate-45 transition-transform">add</span>
                  </summary>
                  <div className="px-stack-md pb-stack-md text-on-surface-variant leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </section>
        </main>

        <footer className="bg-black w-full border-t border-zinc-900 mt-16 sm:mt-20">
          <div className="flex flex-col md:flex-row justify-between items-center px-4 py-10 max-w-7xl mx-auto w-full gap-6 sm:px-6 sm:py-12 sm:gap-8 md:px-8">
            <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest">CIRCUIT</div>
            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map(l => (
                <a key={l} className="font-mono uppercase text-[10px] tracking-tight text-zinc-600 hover:text-blue-500 transition-colors hover:opacity-80" href="#">{l}</a>
              ))}
            </nav>
            <div className="font-mono uppercase text-[10px] tracking-tight text-zinc-600">© 2024 CIRCUIT ENGINEERING. ALL RIGHTS RESERVED.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
