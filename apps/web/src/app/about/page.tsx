import { aboutContent } from "../../content/marketing/about";
import { CallToActionSection } from "../../components/webflow/CallToActionSection";

export default function AboutPage() {
  const { header, mission, values, clinicianStandards } = aboutContent;

  return (
    <main className="wf-subpage-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Subpage Navy Banner */}
      <section className="wf-banner-section" style={{ padding: "24px 0 32px" }}>
        <div className="wf-container">
          <div className="wf-subpage-hero-card">
            <div className="wf-badge-row">
              <span className="wf-podcast-badge" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#ffffff" }}>
                <span className="wf-badge-dot" /> {header.badge}
              </span>
            </div>
            <h1 className="wf-subpage-title">{header.title}</h1>
            <p className="wf-subpage-desc">{header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Mission & Principles Grid */}
      <section className="wf-container" style={{ paddingTop: "24px", paddingBottom: "40px" }}>
        <div className="wf-detail-box" style={{ marginBottom: "32px", padding: "40px" }}>
          <span className="wf-new-badge" style={{ background: "#252b61", marginBottom: "12px", display: "inline-block" }}>
            Our Mission
          </span>
          <h2 className="wf-detail-heading" style={{ fontSize: "24px", margin: "0 0 16px" }}>{mission.title}</h2>
          <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "12px" }}>{mission.paragraph1}</p>
          <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, margin: 0 }}>{mission.paragraph2}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {values.map((val, idx) => (
            <article key={idx} className="wf-detail-box" style={{ padding: "28px" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#ff6b2c", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                0{idx + 1} / PRINCIPLE
              </span>
              <h3 className="wf-detail-heading" style={{ fontSize: "18px", margin: "0 0 10px" }}>
                {val.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                {val.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Clinician Standards Box */}
      <section className="wf-container" style={{ paddingBottom: "40px" }}>
        <div className="wf-detail-box" style={{ background: "#252b61", color: "#ffffff", border: "none", padding: "40px" }}>
          <span className="wf-new-badge" style={{ marginBottom: "14px", display: "inline-block" }}>
            NABH Aligned Standards
          </span>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: "0 0 14px" }}>
            {clinicianStandards.title}
          </h2>
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.65, margin: "0 0 20px" }}>
            We hold our clinical care team to rigorous vetting and infection-control standards:
          </p>
          <ul className="wf-detail-checklist">
            {clinicianStandards.points.map((pt, idx) => (
              <li key={idx}>
                <span style={{ color: "#ff6b2c", fontWeight: 900 }}>✓</span>
                <span style={{ color: "#f1f5f9" }}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CallToActionSection />
    </main>
  );
}
