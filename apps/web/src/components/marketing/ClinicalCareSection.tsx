import Link from "next/link";
import Image from "next/image";

export function ClinicalCareSection() {
  const standards = [
    {
      title: "100% Sealed Single-Use Consumables",
      desc: "Every cannula, dressing, and syringe kit is opened exclusively at your bedside from tamper-sealed packaging.",
    },
    {
      title: "Active Physician Tele-Desk Oversight",
      desc: "Bedside vitals and medication titration are monitored by consulting physicians via encrypted telemetry.",
    },
    {
      title: "NMC & INC Registered Clinicians",
      desc: "Only hospital-experienced Registered Nurses and Certified Physiotherapists are dispatched to your home.",
    },
    {
      title: "Instant ABHA-Linked Care Summaries",
      desc: "Comprehensive clinical reports are dispatched digitally to family members and doctors within 30 minutes.",
    },
  ];

  return (
    <section className="sp-section" aria-labelledby="clinical-standards-title">
      <div className="sp-container">
        <div className="sp-standards-layout">
          <div className="sp-standards-content">
            <span className="sp-kicker">The Clinical Standard</span>
            <h2 id="clinical-standards-title" className="sp-section-title">
              Hospital precision, <br />
              <span className="sp-gradient-text">in the sanctuary of your home.</span>
            </h2>
            <p className="sp-section-desc">
              We eliminate the stress and infection risk of hospital waiting rooms by bringing ICU-grade clinical rigor, sterile consumables, and unhurried bedside care directly to you.
            </p>

            <div className="sp-standards-grid">
              {standards.map((s, idx) => (
                <div className="sp-standard-item" key={idx}>
                  <div className="sp-standard-dot" />
                  <div>
                    <h3 className="sp-standard-title">{s.title}</h3>
                    <p className="sp-standard-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "32px" }}>
              <Link href="/about" className="sp-btn-secondary">
                <span>Read Full Clinical Protocol</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="sp-standards-visual">
            <div className="sp-visual-frame">
              <Image
                src="/assets/images/about-img.png"
                alt="Clinical In-Home Examination and Sterile Care"
                width={540}
                height={400}
                quality={90}
                loading="lazy"
                className="sp-visual-img"
              />
              <div className="sp-visual-badge">
                <span className="sp-beacon-dot" />
                <span>Supervisory Doctor Tele-Desk Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
