import Link from "next/link";
import { Service, getServiceSlug, getServicesCatalog } from "../../lib/services";

const fallbackServices = [
  {
    id: "nursing-default",
    title: "Skilled Nursing Care",
    copy: "Hospital-grade bedside nursing including sterile wound management, IV infusion, and vital telemetry.",
    price: "₹1,499",
    duration: "45–60 Mins",
    tag: "Most Requested",
    slug: "home-health-assessment",
    items: ["Sterile IV cannula insertion & infusion", "Complex post-op dressing & drain care", "ABHA-linked physician care summary"],
  },
  {
    id: "postop-default",
    title: "Post-Surgical Recovery",
    copy: "Composed post-operative nursing and mobility supervision following hospital discharge.",
    price: "₹2,499",
    duration: "60–90 Mins",
    tag: "Hospital Grade",
    slug: "services",
    items: ["Surgical site observation & stitch check", "Medication reconciliation & vitals tracking", "Immediate physician escalation desk"],
  },
  {
    id: "pt-default",
    title: "In-Home Physiotherapy",
    copy: "Personalized orthopedic and neurological rehabilitation delivered by certified BPT physiotherapists.",
    price: "₹1,900",
    duration: "60 Mins",
    tag: "BPT Certified",
    slug: "services",
    items: ["Neuro-rehab & stroke motor recovery", "Post-fracture joint mobilization", "Home ergonomic & fall-safety audit"],
  },
  {
    id: "wellness-default",
    title: "Elder Wellness & Vitals",
    copy: "Proactive clinical evaluation and companion wellness visit for elderly family members.",
    price: "₹1,299",
    duration: "45 Mins",
    tag: "Preventive Care",
    slug: "services",
    items: ["12-lead portable ECG & blood glucose", "Comprehensive medication review", "Family caregiver briefing & digital report"],
  },
];

export async function FeaturedServicesSection() {
  const dbServices = await getServicesCatalog();

  return (
    <section id="services" className="services-section" aria-labelledby="services-title">
      <div className="services-head">
        <div>
          <span className="section-kicker">Concierge Clinical Services</span>
          <h2 id="services-title" className="section-heading">
            Hospital Procedures, Delivered in the Calm of Home.
          </h2>
        </div>
        <p className="services-note">
          Every visit is conducted by a verified, hospital-trained practitioner using single-use sterile consumables and real-time doctor oversight.
        </p>
      </div>

      <div className="service-grid">
        {dbServices.length > 0
          ? dbServices.map((service) => {
              const slug = getServiceSlug(service);
              const formattedPrice = Number(service.price).toLocaleString("en-IN");

              return (
                <article className="service-card" key={service.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <span className="service-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                    </span>
                    <span style={styles.tag}>Clinical Protocol</span>
                  </div>

                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-copy">{service.description || "Hospital-standard in-home clinical visit with single-use sterile kit."}</p>

                  <div className="price-row">
                    <span className="duration-tag">{service.durationMinutes} Mins Visit</span>
                    <span className="price">
                      ₹{formattedPrice} <small style={{ fontSize: "11px", color: "#94a3b8" }}>upfront</small>
                    </span>
                  </div>

                  <ul className="care-list">
                    <li>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Vitals & bedside clinical evaluation</span>
                    </li>
                    <li>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Medication & sterile treatment protocol</span>
                    </li>
                    <li>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>ABHA-linked care report for family</span>
                    </li>
                  </ul>

                  <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "10px", paddingTop: "16px" }}>
                    <Link
                      href={`/services/${slug}`}
                      style={styles.detailBtn}
                    >
                      Protocol
                    </Link>
                    <Link
                      href={`/booking/select-slot?serviceId=${service.id}`}
                      className="shimmer-button"
                      style={{ minHeight: "42px", padding: "0 14px", fontSize: "12px", justifyContent: "center" }}
                    >
                      <span>Book Slot</span>
                    </Link>
                  </div>
                </article>
              );
            })
          : fallbackServices.map((service) => (
              <article className="service-card" key={service.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <span className="service-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </span>
                  <span style={styles.tag}>{service.tag}</span>
                </div>

                <h3 className="service-title">{service.title}</h3>
                <p className="service-copy">{service.copy}</p>

                <div className="price-row">
                  <span className="duration-tag">{service.duration}</span>
                  <span className="price">
                    {service.price} <small style={{ fontSize: "11px", color: "#94a3b8" }}>upfront</small>
                  </span>
                </div>

                <ul className="care-list">
                  {service.items.map((item) => (
                    <li key={item}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "10px", paddingTop: "16px" }}>
                  <Link
                    href={`/services/${service.slug}`}
                    style={styles.detailBtn}
                  >
                    Protocol
                  </Link>
                  <Link
                    href="/services"
                    className="shimmer-button"
                    style={{ minHeight: "42px", padding: "0 14px", fontSize: "12px", justifyContent: "center" }}
                  >
                    <span>Book Slot</span>
                  </Link>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tag: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#a7f3d0",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    padding: "3px 8px",
    borderRadius: "6px",
  },
  detailBtn: {
    textAlign: "center",
    padding: "0 10px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#cbd5e1",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "999px",
    textDecoration: "none",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    minHeight: "42px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.18s ease",
  },
};
