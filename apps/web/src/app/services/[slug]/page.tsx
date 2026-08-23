import Link from "next/link";
import { findServiceBySlug, getServiceSlug, getServicesCatalog, DEFAULT_SERVICES } from "../../../lib/services";
import { servicesEnrichmentMap, defaultEnrichment } from "../../../content/marketing/services";

export const revalidate = 3600;

export async function generateStaticParams() {
  return DEFAULT_SERVICES.map((s) => ({
    slug: getServiceSlug(s),
  }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const services = await getServicesCatalog();
  const service = findServiceBySlug(services, slug);

  if (!service) {
    return (
      <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: "480px", textAlign: "center", padding: "40px", borderRadius: "24px", backgroundColor: "#080808", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "0 0 12px" }}>
            Service Not Found
          </h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 24px" }}>
            The requested clinical care service could not be located in our active directory.
          </p>
          <Link href="/services" className="sp-btn-primary">
            <span>← Return to Services Directory</span>
          </Link>
        </div>
      </main>
    );
  }

  const enrichment = servicesEnrichmentMap[slug] || defaultEnrichment;
  const formattedPrice = Number(service.price).toLocaleString("en-IN");

  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      {/* Dark Cinematic Breadcrumb & Hero */}
      <section className="sp-section" style={{ padding: "80px 0 60px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="sp-container">
          <div style={{ marginBottom: "20px" }}>
            <Link href="/services" style={{ fontSize: "13px", color: "#ff8c52", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span>← Back to All Clinical Services</span>
            </Link>
          </div>

          <div style={{ maxWidth: "860px" }}>
            <span className="sp-kicker">{enrichment.category} · {service.durationMinutes} Mins Bedside Visit</span>
            <h1 className="sp-section-title" style={{ textAlign: "left", margin: "10px 0 16px" }}>
              {service.name}
            </h1>
            <p className="sp-section-desc" style={{ textAlign: "left" }}>
              {service.description || enrichment.shortSummary}
            </p>
          </div>
        </div>
      </section>

      {/* Light Cream Detailed Protocol Section */}
      <section className="light-services-section" style={{ padding: "90px 0" }}>
        <div className="light-services-container">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 340px", gap: "48px", alignItems: "flex-start" }}>
            {/* Left: Comprehensive Clinical Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {/* Overview */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  padding: "36px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                }}
              >
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "0 0 14px" }}>
                  Clinical Overview & Objectives
                </h2>
                <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, margin: 0 }}>
                  {enrichment.shortSummary}
                </p>
              </div>

              {/* What's Included */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  padding: "36px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                }}
              >
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "0 0 18px" }}>
                  What’s Included in Every Visit
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {enrichment.whatsIncluded.map((item, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "#334155" }}>
                      <span style={{ color: "#ff6b2c", fontWeight: 800, fontSize: "16px" }}>✓</span>
                      <span style={{ lineHeight: 1.55 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who It's For & Preparation */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "22px",
                    padding: "30px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "0 0 14px" }}>
                    Who This Care Is For
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {enrichment.whoItsFor.map((item, idx) => (
                      <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#475569" }}>
                        <span style={{ color: "#ea580c" }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "22px",
                    padding: "30px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "0 0 14px" }}>
                    Preparation Before Visit
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {enrichment.preparationTips.map((item, idx) => (
                      <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#475569" }}>
                        <span style={{ color: "#ea580c" }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Sticky Booking Box */}
            <aside
              style={{
                position: "sticky",
                top: "90px",
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "32px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 14px 40px rgba(0, 0, 0, 0.06)",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>
                Total Visit Fee
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 800, color: "#0f172a", margin: "8px 0" }}>
                ₹{formattedPrice}
              </div>
              <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, display: "block", marginBottom: "20px" }}>
                Incl. Single-Use Sterile Kit & GST
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", marginBottom: "24px", borderTop: "1px solid #f1f5f9", paddingTop: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#334155" }}>
                  <span style={{ color: "#ff6b2c" }}>✓</span>
                  <span>100% Licensed B.Sc/GNM/BPT</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#334155" }}>
                  <span style={{ color: "#ff6b2c" }}>✓</span>
                  <span>Avg 45 Mins Doorstep Arrival</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#334155" }}>
                  <span style={{ color: "#ff6b2c" }}>✓</span>
                  <span>ABHA-Linked Visit Summary</span>
                </div>
              </div>

              <Link
                href={`/booking/select-slot?serviceId=${service.id}`}
                className="sp-btn-primary"
                style={{ width: "100%", justifyContent: "center", minHeight: "48px", fontSize: "14px", marginBottom: "12px" }}
              >
                <span>Schedule This Service</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <a
                href="tel:+911140506070"
                style={{ fontSize: "12px", color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px" }}
              >
                <span>Questions? Call 24/7 Desk</span>
              </a>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
