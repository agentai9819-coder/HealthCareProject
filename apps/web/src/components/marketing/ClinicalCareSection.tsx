import Link from "next/link";

const clinicalProtocols = [
  {
    id: "sterile",
    title: "100% Sealed Single-Use Consumables",
    category: "Aseptic Protocol",
    description: "Every cannula, dressing, and syringe kit is opened exclusively at your bedside from serialized, tamper-evident packs.",
    badge: "NABH Invariant",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "tele-desk",
    title: "Active Physician Tele-Desk Supervision",
    category: "Doctor Oversight",
    description: "Senior consulting physicians monitor bedside vital telemetry, evaluate progress notes, and approve medication titration.",
    badge: "Real-Time Oversight",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "credentials",
    title: "NMC & State Nursing Council Verified",
    category: "Verified Clinicians",
    description: "Every visit is delivered by hospital-experienced B.Sc / GNM Registered Nurses or BPT Physiotherapists with 3-tier background verification.",
    badge: "100% Licensed",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2">
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
  {
    id: "abha-sync",
    title: "Instant ABHA-Linked Care Summaries",
    category: "Digital EHR Privacy",
    description: "Comprehensive visit notes, vitals charts, and follow-up directives synced directly to family caregivers and treating physicians.",
    badge: "DISHA Compliant",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
      </svg>
    ),
  },
];

export function ClinicalCareSection() {
  return (
    <section className="dark-protocol-section" aria-labelledby="standards-heading">
      <div className="dark-protocol-container">
        <div className="dark-protocol-head">
          <span className="dark-protocol-kicker">The Hospital Standard</span>
          <h2 id="standards-heading" className="dark-protocol-title">
            Hospital precision, <br />
            <span className="gradient-text-amber">in the sanctuary of your home.</span>
          </h2>
          <p className="dark-protocol-desc">
            We eliminate the infection risks, stress, and long wait times of outpatient clinics by deploying inpatient-standard nursing and therapy directly to your bedside.
          </p>
        </div>

        {/* Edge-to-Edge Image/Feature Cards with Text Overlays at the bottom */}
        <div className="visual-card-grid">
          {clinicalProtocols.map((item) => (
            <article className="visual-feature-card" key={item.id}>
              <div className="visual-card-glow" aria-hidden="true" />
              <div className="visual-card-top">
                <div className="visual-card-icon">{item.icon}</div>
                <span className="visual-card-badge">{item.badge}</span>
              </div>

              <div className="visual-card-overlay">
                <span className="visual-card-category">{item.category}</span>
                <h3 className="visual-card-title">{item.title}</h3>
                <p className="visual-card-desc">{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="dark-protocol-footer">
          <Link href="/about" className="sp-btn-secondary">
            <span>Explore Complete Clinical Governance</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
