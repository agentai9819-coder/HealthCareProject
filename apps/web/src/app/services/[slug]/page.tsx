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
      <main className="wf-subpage-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: "480px", textAlign: "center", padding: "40px", borderRadius: "28px", backgroundColor: "#ffffff", border: "1px solid #eef2f6", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 800, color: "#252b61", margin: "0 0 12px" }}>
            Service Not Found
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px" }}>
            The requested clinical care service could not be located in our active directory.
          </p>
          <Link href="/services" className="wf-consultation-btn" style={{ background: "#252b61", color: "#ffffff", justifyContent: "center" }}>
            <span>← Return to Services Directory</span>
          </Link>
        </div>
      </main>
    );
  }

  const enrichment = servicesEnrichmentMap[slug] || defaultEnrichment;
  const formattedPrice = Number(service.price).toLocaleString("en-IN");

  return (
    <main className="wf-subpage-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Subpage Navy Banner */}
      <section className="wf-banner-section" style={{ padding: "24px 0 32px" }}>
        <div className="wf-container">
          <div className="wf-subpage-hero-card">
            <div style={{ marginBottom: "16px" }}>
              <Link href="/services" style={{ fontSize: "13px", color: "#ffffff", fontWeight: 700, textDecoration: "none", opacity: 0.9 }}>
                ← Back to All Clinical Services
              </Link>
            </div>

            <div className="wf-badge-row">
              <span className="wf-podcast-badge" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#ffffff" }}>
                <span className="wf-badge-dot" /> {enrichment.category} · {service.durationMinutes} Mins Visit
              </span>
            </div>

            <h1 className="wf-subpage-title">{service.name}</h1>
            <p className="wf-subpage-desc">{service.description || enrichment.shortSummary}</p>
          </div>
        </div>
      </section>

      {/* Detailed Clinical Protocol & Sticky Booking Sidebar */}
      <section className="wf-container" style={{ paddingTop: "24px" }}>
        <div className="wf-service-detail-grid">
          {/* Left Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Overview */}
            <div className="wf-detail-box">
              <h2 className="wf-detail-heading">Clinical Overview &amp; Objectives</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>
                {enrichment.shortSummary}
              </p>
            </div>

            {/* What's Included */}
            <div className="wf-detail-box">
              <h2 className="wf-detail-heading">What&apos;s Included in Your Home Visit</h2>
              <ul className="wf-detail-checklist">
                {enrichment.whatsIncluded.map((item, idx) => (
                  <li key={idx}>
                    <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suitable For */}
            <div className="wf-detail-box">
              <h2 className="wf-detail-heading">Who This Service Is For</h2>
              <ul className="wf-detail-checklist">
                {enrichment.whoItsFor.map((item, idx) => (
                  <li key={idx}>
                    <span style={{ color: "#252b61", fontWeight: 900 }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pre-Visit Preparation */}
            <div className="wf-detail-box">
              <h2 className="wf-detail-heading">Pre-Visit Patient Instructions</h2>
              <ul className="wf-detail-checklist">
                {enrichment.preparationTips.map((tip, idx) => (
                  <li key={idx}>
                    <span style={{ color: "#ff6b2c", fontWeight: 900 }}>→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Sticky Booking Card */}
          <aside className="wf-detail-sticky-sidebar">
            <div className="wf-sticky-booking-card">
              <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
                Bedside Appointment
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#252b61", margin: "6px 0" }}>
                ₹{formattedPrice}
              </div>
              <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700, marginBottom: "20px" }}>
                ✓ Includes Sterile PPE &amp; Consumables
              </div>

              <div style={{ borderTop: "1px solid #eef2f6", paddingTop: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#475569", marginBottom: "8px" }}>
                  <span>Visit Duration</span>
                  <strong>{service.durationMinutes} Minutes</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#475569", marginBottom: "8px" }}>
                  <span>Clinician Level</span>
                  <strong>Verified RN / PT</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#475569" }}>
                  <span>Supervision</span>
                  <strong>Doctor Tele-Oversight</strong>
                </div>
              </div>

              <Link
                href={`/auth/login?redirect=/services/${slug}`}
                className="wf-doctor-book-action"
                style={{ width: "100%", textAlign: "center", textDecoration: "none", padding: "12px" }}
              >
                <span>Proceed to Schedule Visit</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
