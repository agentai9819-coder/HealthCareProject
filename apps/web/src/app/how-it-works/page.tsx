import Link from "next/link";
import { howItWorksContent } from "../../content/marketing/howItWorks";
import { CtaBanner } from "../../components/marketing/CtaBanner";

export default function HowItWorksPage() {
  const { header, steps, safetyNotice } = howItWorksContent;

  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      {/* Dark Cinematic Header */}
      <section className="sp-section" style={{ padding: "90px 0 70px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="sp-container">
          <div className="sp-section-header" style={{ marginBottom: "0" }}>
            <span className="sp-kicker">{header.badge}</span>
            <h1 className="sp-section-title">
              {header.title.split(":")[0]}: <br />
              <span className="sp-gradient-text">{header.title.split(":")[1] || "From First Call to Bedside Care."}</span>
            </h1>
            <p className="sp-section-desc">{header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Light Cream Steps Section */}
      <section className="light-services-section" style={{ padding: "90px 0" }}>
        <div className="light-services-container">
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "920px", margin: "0 auto" }}>
            {steps.map((step, idx) => (
              <article
                key={idx}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  padding: "36px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: "28px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "20px",
                    backgroundColor: "#ffedd5",
                    border: "1px solid #fdba74",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#ea580c",
                  }}
                >
                  {step.number}
                </div>

                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
                    {step.title}
                  </h2>
                  <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.65, margin: "0 0 18px" }}>
                    {step.summary}
                  </p>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} style={{ display: "flex", alignItems: "flex-start", gap: "9px", fontSize: "13px", color: "#334155" }}>
                        <span style={{ color: "#ff6b2c", fontWeight: 800 }}>✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Safety & Protocol Notice */}
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
            <span className="sp-kicker">Clinical Governance</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "8px 0 14px" }}>
              {safetyNotice.title}
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 24px" }}>
              {safetyNotice.content}
            </p>
            <Link href="/services" className="sp-btn-primary">
              <span>Schedule an In-Home Visit</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
