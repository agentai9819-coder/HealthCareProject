import Link from "next/link";
import { getServiceSlug, getServicesCatalog } from "../../lib/services";
import { servicesEnrichmentMap, defaultEnrichment } from "../../content/marketing/services";

export const revalidate = 3600;

export default async function ServicesPage() {
  const services = await getServicesCatalog();

  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      {/* Dark Cinematic Hero Section */}
      <section className="sp-section" style={{ padding: "90px 0 70px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="sp-container">
          <div className="sp-section-header" style={{ marginBottom: "30px" }}>
            <span className="sp-kicker">Clinical Directory</span>
            <h1 className="sp-section-title">
              Hospital-Grade In-Home Services, <br />
              <span className="sp-gradient-text">Delivered with Clinical Rigor.</span>
            </h1>
            <p className="sp-section-desc">
              Explore specialized clinical nursing, post-surgical recovery, physical rehabilitation, and elder wellness programs delivered directly to your doorstep.
            </p>
          </div>

          <div className="sp-trust-ribbon" style={{ margin: "0 auto", maxWidth: "880px" }}>
            <div className="sp-trust-item">
              <strong>100% INC & NMC</strong>
              <span>State Verified Clinicians</span>
            </div>
            <div className="sp-trust-sep" />
            <div className="sp-trust-item">
              <strong>Single-Use Kits</strong>
              <span>Tamper-Sealed Consumables</span>
            </div>
            <div className="sp-trust-sep" />
            <div className="sp-trust-item">
              <strong>Transparent INR</strong>
              <span>All-Inclusive Upfront Pricing</span>
            </div>
            <div className="sp-trust-sep" />
            <div className="sp-trust-item">
              <strong>Physician Desk</strong>
              <span>Continuous Tele-Supervision</span>
            </div>
          </div>
        </div>
      </section>

      {/* Light Cream / High-Contrast Services Catalog Section */}
      <section className="light-services-section" style={{ padding: "90px 0" }}>
        <div className="light-services-container">
          {services.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <p>Our healthcare services catalog is currently updating. Please check back shortly.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {services.map((service) => {
                const slug = getServiceSlug(service);
                const enrichment = servicesEnrichmentMap[slug] || defaultEnrichment;
                const formattedPrice = Number(service.price).toLocaleString("en-IN");

                return (
                  <article
                    key={service.id}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "24px",
                      padding: "36px",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      boxShadow: "0 12px 36px rgba(0, 0, 0, 0.04)",
                      display: "grid",
                      gridTemplateColumns: "1fr 300px",
                      gap: "36px",
                      alignItems: "center",
                    }}
                    className="service-catalog-row"
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                        <span className="light-tag-pill">{enrichment.category}</span>
                        <span className="light-tag-sub">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "4px", verticalAlign: "middle" }}>
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {service.durationMinutes} Minutes Visit
                        </span>
                      </div>

                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
                        {service.name}
                      </h2>

                      <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.65, margin: "0 0 24px" }}>
                        {service.description || enrichment.shortSummary}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                        <div>
                          <h3 style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ea580c", margin: "0 0 8px", fontFamily: "var(--font-mono)" }}>
                            Clinical Protocol Includes
                          </h3>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                            {enrichment.whatsIncluded.slice(0, 3).map((item, idx) => (
                              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#334155" }}>
                                <span style={{ color: "#ff6b2c", fontWeight: 800 }}>✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", margin: "0 0 8px", fontFamily: "var(--font-mono)" }}>
                            Patient Fit
                          </h3>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                            {enrichment.whoItsFor.slice(0, 3).map((item, idx) => (
                              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#475569" }}>
                                <span style={{ color: "#94a3b8" }}>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Booking Card Sidebar */}
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "20px",
                        padding: "26px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>
                        Standard In-Home Visit Fee
                      </span>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 800, color: "#0f172a", margin: "6px 0" }}>
                        ₹{formattedPrice}
                      </div>
                      <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, marginBottom: "18px" }}>
                        All-Inclusive · Incl. Sterile Kit & GST
                      </span>

                      <Link
                        href={`/booking/select-slot?serviceId=${service.id}`}
                        className="sp-btn-primary"
                        style={{ width: "100%", justifyContent: "center", minHeight: "44px", fontSize: "13px", marginBottom: "10px" }}
                      >
                        <span>Schedule Visit</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>

                      <Link
                        href={`/services/${slug}`}
                        style={{ fontSize: "13px", color: "#ea580c", fontWeight: 700, textDecoration: "none" }}
                      >
                        View Full Clinical Protocol →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}