import Link from "next/link";
import { getServicesCatalog } from "../../lib/services";

const curatedPrograms = [
  {
    id: "nursing",
    name: "Skilled Bedside Nursing & IV Infusion",
    slug: "home-health-assessment",
    tag: "Hospital Grade",
    badge: "INC / NMC Registered",
    price: "₹1,499",
    duration: "45–60 Mins",
    description: "In-home administration of IV medications, sterile fluid infusions, catheter insertion, and complex wound dressing by hospital-experienced nurses.",
    highlights: ["Sterile IV cannula insertion & saline infusion", "Diabetic ulcer & complex surgical dressing", "Real-time vitals telemetry & doctor sync"],
  },
  {
    id: "post-surgery",
    name: "Post-Surgical Hospital Recovery",
    slug: "services",
    tag: "ICU Standard",
    badge: "Specialized Care",
    price: "₹2,499",
    duration: "60–90 Mins",
    description: "Carefully structured bedside nursing following hospital discharge or surgery. Active drain monitoring, stitch inspection, and doctor tele-desk.",
    highlights: ["Surgical drain emptying & incision monitoring", "Medication titration & pain scale charting", "Direct emergency physician hotline"],
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
    description: "Comprehensive in-home preventive health check for elderly family members, including 12-lead portable ECG, blood glucose, and medication review.",
    highlights: ["12-Lead portable ECG & capillary glucose test", "Comprehensive chronic medication audit", "Direct care update synced to family caregivers"],
  },
];

export async function FeaturedServicesSection() {
  const dbServices = await getServicesCatalog();

  return (
    <section id="care-guide" className="light-services-section" aria-labelledby="services-title">
      <div className="light-services-container">
        <div className="light-services-head">
          <div>
            <span className="light-kicker">Curated Clinical Programs</span>
            <h2 id="services-title" className="light-title">
              Hospital-Grade In-Home Services, <br />
              <span className="light-title-accent">Curated for Every Recovery Milestone.</span>
            </h2>
          </div>
          <p className="light-desc">
            All visits are delivered by verified hospital-trained clinicians with single-use sterile consumables, transparent upfront INR pricing, and real-time physician oversight.
          </p>
        </div>

        {/* 4 Edge-to-Edge Image/Content Program Cards */}
        <div className="light-programs-grid">
          {curatedPrograms.map((prog) => (
            <article className="light-program-card" key={prog.id}>
              <div className="light-card-top">
                <div className="light-card-tags">
                  <span className="light-tag-pill">{prog.tag}</span>
                  <span className="light-tag-sub">{prog.badge}</span>
                </div>
                <div className="light-card-price">
                  <strong>{prog.price}</strong>
                  <span>{prog.duration}</span>
                </div>
              </div>

              <h3 className="light-card-name">{prog.name}</h3>
              <p className="light-card-summary">{prog.description}</p>

              <ul className="light-card-checklist">
                {prog.highlights.map((h, idx) => (
                  <li key={idx}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="light-card-footer">
                <Link href={`/services/${prog.slug}`} className="light-detail-link">
                  <span>View Full Protocol</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link href="/services" className="light-book-btn">
                  <span>Book Visit</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
