import { aboutContent } from "../../content/marketing/about";
import { CtaBanner } from "../../components/marketing/CtaBanner";

export default function AboutPage() {
  const { header, mission, values, clinicianStandards } = aboutContent;

  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      {/* Dark Cinematic Header */}
      <section className="sp-section" style={{ padding: "90px 0 70px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="sp-container">
          <div className="sp-section-header" style={{ marginBottom: "0" }}>
            <span className="sp-kicker">{header.badge}</span>
            <h1 className="sp-section-title">
              {header.title.split(":")[0]}: <br />
              <span className="sp-gradient-text">{header.title.split(":")[1] || "Clinical Excellence at Your Bedside."}</span>
            </h1>
            <p className="sp-section-desc">{header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Light Cream Mission & Values Section */}
      <section className="light-services-section" style={{ padding: "90px 0" }}>
        <div className="light-services-container">
          <div style={{ maxWidth: "860px", margin: "0 auto 60px", textAlign: "center" }}>
            <span className="light-kicker">Our Core Mission</span>
            <h2 className="light-title" style={{ marginBottom: "18px" }}>{mission.title}</h2>
            <p className="light-desc" style={{ marginBottom: "14px" }}>{mission.paragraph1}</p>
            <p className="light-desc">{mission.paragraph2}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {values.map((val, idx) => (
              <article
                key={idx}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "22px",
                  padding: "32px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: "#ea580c", display: "block", marginBottom: "8px" }}>
                  0{idx + 1} / PRINCIPLE
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
                  {val.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  {val.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Clinician Standards Section */}
      <section className="sp-section" style={{ padding: "90px 0" }}>
        <div className="sp-container">
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              backgroundColor: "#080808",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid rgba(255, 107, 44, 0.3)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
            }}
          >
            <span className="sp-kicker">NABH Aligned Practice</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "8px 0 16px" }}>
              {clinicianStandards.title}
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.65, margin: "0 0 24px" }}>
              We hold our clinical team to rigorous standards to ensure safe, trustworthy, and effective care:
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {clinicianStandards.points.map((pt, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <span style={{ color: "#ff6b2c", fontWeight: 800 }}>✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
