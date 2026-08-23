import Link from "next/link";
import { Service, getServiceSlug, getServicesCatalog } from "../../lib/services";

const curatedPrograms = [
  {
    id: "nursing",
    name: "Skilled Bedside Nursing & IV Therapy",
    slug: "home-health-assessment",
    tag: "Hospital Standard",
    badge: "INC / NMC Registered",
    price: "₹1,499",
    duration: "45–60 Mins",
    description: "In-home administration of IV medications, sterile fluid infusions, catheter care, and aseptic wound dressings by hospital-experienced nurses.",
    highlights: ["Sterile IV cannula insertion & saline infusion", "Complex diabetic / surgical wound dressing", "Real-time vitals telemetry & physician charting"],
  },
  {
    id: "post-surgery",
    name: "Post-Surgical Hospital Recovery",
    slug: "services",
    tag: "ICU Standard",
    badge: "Specialized Care",
    price: "₹2,499",
    duration: "60–90 Mins",
    description: "Carefully structured bedside nursing following hospital discharge or major surgery. Active drain monitoring, suture checks, and doctor tele-desk.",
    highlights: ["Surgical drain emptying & incision monitoring", "Medication titration & pain scale charting", "Direct emergency escalation hotline"],
  },
  {
    id: "rehab",
    name: "Physical & Neurological Rehabilitation",
    slug: "services",
    tag: "BPT Certified",
    badge: "Motor Recovery",
    price: "₹1,900",
    duration: "60 Mins",
    description: "One-on-one physiotherapy delivered by certified BPT clinicians for stroke recovery, joint replacement mobilization, and fall-prevention training.",
    highlights: ["Neuromuscular re-education & gait restoration", "Orthopedic joint mobilization & exercise therapy", "Home ergonomic safety & mobility audit"],
  },
  {
    id: "wellness",
    name: "Elder Wellness & Companion Evaluation",
    slug: "services",
    tag: "Preventive Care",
    badge: "Senior Concierge",
    price: "₹1,299",
    duration: "45 Mins",
    description: "Comprehensive in-home preventive health evaluation for elderly family members, including 12-lead portable ECG, capillary glucose, and medication review.",
    highlights: ["12-Lead portable ECG & blood glucose test", "Comprehensive chronic medication audit", "Direct care update synced to family caregivers"],
  },
];

export async function FeaturedServicesSection() {
  const dbServices = await getServicesCatalog();

  return (
    <section id="care-guide" className="sp-section" aria-labelledby="services-title">
      <div className="sp-container">
        <div className="sp-section-header">
          <span className="sp-kicker">Clinical Programs</span>
          <h2 id="services-title" className="sp-section-title">
            Hospital-grade care, <br />
            <span className="sp-gradient-text">curated for every recovery milestone.</span>
          </h2>
          <p className="sp-section-desc">
            All visits are delivered by verified hospital-trained clinicians with single-use sterile consumables, transparent pricing, and real-time physician oversight.
          </p>
        </div>

        <div className="sp-programs-grid">
          {curatedPrograms.map((prog) => (
            <article className="sp-program-card" key={prog.id}>
              <div className="sp-card-header">
                <div className="sp-card-tags">
                  <span className="sp-tag-amber">{prog.tag}</span>
                  <span className="sp-tag-muted">{prog.badge}</span>
                </div>
                <div className="sp-card-price">
                  <strong>{prog.price}</strong>
                  <span>{prog.duration}</span>
                </div>
              </div>

              <h3 className="sp-card-title">{prog.name}</h3>
              <p className="sp-card-desc">{prog.description}</p>

              <ul className="sp-card-checklist">
                {prog.highlights.map((h, idx) => (
                  <li key={idx}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="sp-card-footer">
                <Link href={`/services/${prog.slug}`} className="sp-card-link">
                  <span>View Clinical Details</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link href="/services" className="sp-btn-primary" style={{ padding: "0 18px", minHeight: "40px", fontSize: "12px" }}>
                  <span>Book Visit</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
