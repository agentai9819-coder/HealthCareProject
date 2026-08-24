import Link from "next/link";
import { getServiceSlug, getServicesCatalog } from "../../lib/services";
import { servicesEnrichmentMap, defaultEnrichment } from "../../content/marketing/services";

export const revalidate = 3600;

export default async function ServicesPage() {
  const services = await getServicesCatalog();

  return (
    <main className="wf-subpage-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* 1. Subpage Navy Header Banner */}
      <section className="wf-banner-section" style={{ padding: "24px 0 32px" }}>
        <div className="wf-container">
          <div className="wf-subpage-hero-card">
            <div className="wf-badge-row">
              <span className="wf-podcast-badge" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#ffffff" }}>
                <span className="wf-badge-dot" /> Verified Clinical Directory
              </span>
            </div>
            <h1 className="wf-subpage-title">
              Hospital-Grade In-Home Clinical Programs
            </h1>
            <p className="wf-subpage-desc">
              Explore specialized clinical nursing, post-surgical recovery, physical rehabilitation, and elder wellness programs delivered by state-licensed clinicians.
            </p>

            <div className="wf-banner-tags-wrap" style={{ justifyContent: "flex-start", marginTop: "24px" }}>
              <div className="wf-banner-tag-pill">
                <span>100% INC &amp; NMC Verified Clinicians</span>
              </div>
              <div className="wf-banner-tag-pill">
                <span>Tamper-Sealed Bedside Kits</span>
              </div>
              <div className="wf-banner-tag-pill">
                <span>Transparent Upfront INR Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Catalog Grid */}
      <section className="wf-container" style={{ paddingTop: "20px" }}>
        {services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            <p>Our healthcare services catalog is currently updating. Please check back shortly.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {services.map((service) => {
              const slug = getServiceSlug(service);
              const enrichment = servicesEnrichmentMap[slug] || defaultEnrichment;
              const formattedPrice = Number(service.price).toLocaleString("en-IN");

              return (
                <article
                  key={service.id}
                  className="wf-service-row-card"
                >
                  <div className="wf-service-row-main">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                      <span className="wf-new-badge" style={{ background: "#252b61" }}>{enrichment.category}</span>
                      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                        ⏱ {service.durationMinutes} Minutes Visit
                      </span>
                    </div>

                    <h2 className="wf-service-row-title">
                      {service.name}
                    </h2>

                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: "0 0 20px" }}>
                      {service.description || enrichment.shortSummary}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                      <div>
                        <strong style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#252b61", display: "block", marginBottom: "6px" }}>
                          ✓ What&apos;s Included:
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                          {enrichment.whatsIncluded.slice(0, 2).map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#252b61", display: "block", marginBottom: "6px" }}>
                          👤 Suitable For:
                        </strong>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                          {enrichment.whoItsFor.slice(0, 2).map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Booking Action */}
                  <div className="wf-service-row-sidebar">
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                      All-Inclusive Home Visit
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#252b61", margin: "4px 0" }}>
                      ₹{formattedPrice}
                    </div>
                    <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700, marginBottom: "16px" }}>
                      ✓ Includes Sterile Consumables &amp; GST
                    </div>

                    <Link
                      href={`/services/${slug}`}
                      className="wf-doctor-book-action"
                      style={{ width: "100%", textAlign: "center", textDecoration: "none" }}
                    >
                      <span>Book Appointment</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}