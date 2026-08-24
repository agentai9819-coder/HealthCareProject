import { howItWorksContent } from "../../content/marketing/howItWorks";
import { CallToActionSection } from "../../components/webflow/CallToActionSection";

export default function HowItWorksPage() {
  const { header, steps, safetyNotice } = howItWorksContent;

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

      {/* 4 Steps Timeline Section */}
      <section className="wf-container" style={{ paddingTop: "24px", paddingBottom: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "920px", margin: "0 auto" }}>
          {steps.map((step, idx) => (
            <article
              key={idx}
              className="wf-detail-box"
              style={{
                padding: "36px",
                display: "grid",
                gridTemplateColumns: "70px 1fr",
                gap: "24px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  backgroundColor: "#e8effd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#252b61",
                }}
              >
                {step.number}
              </div>

              <div>
                <h2 className="wf-detail-heading" style={{ fontSize: "20px", margin: "0 0 8px" }}>
                  {step.title}
                </h2>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.65, margin: "0 0 16px" }}>
                  {step.summary}
                </p>

                <ul className="wf-detail-checklist">
                  {step.details.map((detail, dIdx) => (
                    <li key={dIdx}>
                      <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Safety & Protocol Box */}
      <section className="wf-container" style={{ paddingBottom: "40px" }}>
        <div className="wf-detail-box" style={{ background: "#252b61", color: "#ffffff", border: "none", maxWidth: "920px", margin: "0 auto", padding: "36px" }}>
          <span className="wf-new-badge" style={{ marginBottom: "12px", display: "inline-block" }}>
            Clinical Safety
          </span>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", margin: "0 0 12px" }}>
            {safetyNotice.title}
          </h2>
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
            {safetyNotice.content}
          </p>
        </div>
      </section>

      <CallToActionSection />
    </main>
  );
}
