import { whyUsContent } from "../../content/marketing/whyUs";
import { CallToActionSection } from "../../components/webflow/CallToActionSection";

export default function WhyUsPage() {
  const { header, pillars, emergencyNotice } = whyUsContent;

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

      {/* Clinical Pillars Grid */}
      <section className="wf-container" style={{ paddingTop: "24px", paddingBottom: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {pillars.map((pillar, idx) => (
            <article key={idx} className="wf-detail-box" style={{ padding: "32px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: "#e8effd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#252b61",
                  marginBottom: "16px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="wf-detail-heading" style={{ fontSize: "18px", margin: "0 0 10px" }}>
                {pillar.title}
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Emergency Protocol Box */}
      <section className="wf-container" style={{ paddingBottom: "40px" }}>
        <div className="wf-detail-box" style={{ background: "#252b61", color: "#ffffff", border: "none" }}>
          <span className="wf-new-badge" style={{ marginBottom: "12px", display: "inline-block" }}>
            Emergency Protocol
          </span>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: "0 0 10px" }}>
            {emergencyNotice.title}
          </h2>
          <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
            {emergencyNotice.description}
          </p>
        </div>
      </section>

      <CallToActionSection />
    </main>
  );
}
