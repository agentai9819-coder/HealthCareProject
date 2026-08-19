import Link from "next/link";
import { API_BASE } from "../../lib/api";
import { Service, getServiceSlug } from "../../lib/services";

const fallbackServices = [
  {
    id: "nursing-default",
    title: "Skilled Nursing",
    copy: "Focused, clinically directed visits for complex care needs at home.",
    price: "₹2,400",
    slug: "home-health-assessment",
    items: ["Vitals and symptom assessment", "Medication reconciliation", "Care-plan update for family"],
  },
  {
    id: "postop-default",
    title: "Post-Op Recovery",
    copy: "A composed recovery check-in with clear surgical aftercare guidance.",
    price: "₹2,800",
    slug: "services",
    items: ["Incision and dressing review", "Mobility and pain check", "Recovery milestone briefing"],
  },
  {
    id: "pt-default",
    title: "Physical Therapy",
    copy: "Personalized mobility support designed around the spaces you live in.",
    price: "₹2,600",
    slug: "services",
    items: ["Functional movement screen", "Guided therapeutic exercise", "Home-safety recommendations"],
  },
  {
    id: "wellness-default",
    title: "Elder Wellness",
    copy: "A restorative wellness visit that brings reassurance to everyday care.",
    price: "₹1,900",
    slug: "services",
    items: ["Wellness and hydration review", "Fall-risk observation", "Family caregiver guidance"],
  },
];

async function getFeaturedServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_BASE}/services`, { next: { revalidate: 60 } });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.error("Failed to fetch featured services on server:", err);
  }
  return [];
}

export async function FeaturedServicesSection() {
  const dbServices = await getFeaturedServices();

  return (
    <section id="services" className="services-section" aria-labelledby="services-title">
      <div className="services-head">
        <div>
          <span className="section-kicker">Concierge clinical services</span>
          <h2 id="services-title" className="section-heading">
            In-Home Healthcare Services & Transparent Pricing
          </h2>
        </div>
        <p className="services-note">
          Every service includes a 60-minute in-home visit, clinically appropriate bedside care, and a concise follow-up record.
        </p>
      </div>

      <div className="service-grid">
        {dbServices.length > 0
          ? dbServices.map((service) => {
              const slug = getServiceSlug(service);
              const formattedPrice = Number(service.price).toLocaleString("en-IN");

              return (
                <article className="service-card" key={service.id}>
                  <span className="service-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </span>
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-copy">{service.description || "Hospital-standard in-home clinical visit."}</p>
                  <div className="price-row">
                    <span className="duration-tag">{service.durationMinutes} Mins Visit</span>
                    <span className="price">
                      ₹{formattedPrice} <small>upfront</small>
                    </span>
                  </div>
                  <ul className="care-list">
                    <li>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Vitals and clinical bedside evaluation</span>
                    </li>
                    <li>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Medication & treatment administration</span>
                    </li>
                    <li>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Physician & family care continuity notes</span>
                    </li>
                  </ul>
                  <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", paddingTop: "14px" }}>
                    <Link
                      href={`/services/${slug}`}
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#d1fae5",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        borderRadius: "8px",
                        textDecoration: "none",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      Details
                    </Link>
                    <Link
                      href={`/booking/select-slot?serviceId=${service.id}`}
                      className="shimmer-button"
                      style={{ minHeight: "34px", padding: "0 10px", fontSize: "11px" }}
                    >
                      <span>Book Slot</span>
                    </Link>
                  </div>
                </article>
              );
            })
          : fallbackServices.map((service) => (
              <article className="service-card" key={service.title}>
                <span className="service-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </span>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-copy">{service.copy}</p>
                <div className="price-row">
                  <span className="duration-tag">60 Mins Visit</span>
                  <span className="price">
                    {service.price} <small>upfront</small>
                  </span>
                </div>
                <ul className="care-list">
                  {service.items.map((item) => (
                    <li key={item}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", paddingTop: "14px" }}>
                  <Link
                    href={`/services/${service.slug}`}
                    style={{
                      textAlign: "center",
                      padding: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#d1fae5",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      borderRadius: "8px",
                      textDecoration: "none",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    Details
                  </Link>
                  <Link
                    href="/services"
                    className="shimmer-button"
                    style={{ minHeight: "34px", padding: "0 10px", fontSize: "11px" }}
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
