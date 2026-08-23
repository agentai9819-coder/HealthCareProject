import { whyUsContent } from "../../content/marketing/whyUs";
import { CtaBanner } from "../../components/marketing/CtaBanner";

export default function WhyUsPage() {
  const { header, pillars, emergencyNotice } = whyUsContent;

  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      {/* Dark Cinematic Header */}
      <section className="sp-section" style={{ padding: "90px 0 70px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="sp-container">
          <div className="sp-section-header" style={{ marginBottom: "0" }}>
            <span className="sp-kicker">{header.badge}</span>
            <h1 className="sp-section-title">
              {header.title.split(":")[0]}: <br />
              <span className="sp-gradient-text">{header.title.split(":")[1] || "Clinical Rigor & Unwavering Trust."}</span>
            </h1>
            <p className="sp-section-desc">{header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Light Cream Pillars Grid Section */}
      <section className="light-services-section" style={{ padding: "90px 0" }}>
        <div className="light-services-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
            {pillars.map((pillar, idx) => (
              <article
                key={idx}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  padding: "36px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    backgroundColor: "#ffedd5",
                    border: "1px solid #fdba74",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ea580c",
                    marginBottom: "20px",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>
                  {pillar.title}
                </h2>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65, margin: 0 }}>
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Governance & Emergency Notice */}
      <section className="sp-section" style={{ padding: "80px 0" }}>
        <div className="sp-container">
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              backgroundColor: "#080808",
              borderRadius: "24px",
              padding: "36px",
              border: "1px solid rgba(255, 107, 44, 0.3)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
            }}
          >
            <span className="sp-kicker">Emergency Governance</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: "8px 0 12px" }}>
              {emergencyNotice.title}
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
              {emergencyNotice.description}
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
