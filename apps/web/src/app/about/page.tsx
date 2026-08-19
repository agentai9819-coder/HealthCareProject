import { aboutContent } from "../../content/marketing/about";
import { CtaBanner } from "../../components/marketing/CtaBanner";

export default function AboutPage() {
  const { header, mission, values, clinicianStandards } = aboutContent;

  return (
    <main style={styles.main}>
      {/* Header */}
      <section style={styles.headerSection}>
        <div style={styles.container}>
          <span style={styles.badge}>{header.badge}</span>
          <h1 style={styles.title}>{header.title}</h1>
          <p style={styles.subtitle}>{header.subtitle}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={styles.missionSection}>
        <div style={styles.container}>
          <div style={styles.missionCard}>
            <h2 style={styles.sectionTitle}>{mission.title}</h2>
            <p style={styles.missionParagraph}>{mission.paragraph1}</p>
            <p style={styles.missionParagraph}>{mission.paragraph2}</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={styles.valuesSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Core Values</h2>
            <p style={styles.sectionSubtitle}>The principles that guide our clinical practice and bedside care every day.</p>
          </div>
          <div style={styles.valuesGrid}>
            {values.map((val, idx) => (
              <div key={idx} style={styles.valueCard}>
                <h3 style={styles.valueTitle}>{val.title}</h3>
                <p style={styles.valueDesc}>{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinician Standards */}
      <section style={styles.standardsSection}>
        <div style={styles.container}>
          <div style={styles.standardsCard}>
            <h2 style={styles.sectionTitle}>{clinicianStandards.title}</h2>
            <p style={styles.standardsSub}>
              We hold our clinical team to rigorous standards to ensure safe, trustworthy, and effective care:
            </p>
            <ul style={styles.standardsList}>
              {clinicianStandards.points.map((pt, idx) => (
                <li key={idx} style={styles.standardItem}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBanner />
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  headerSection: {
    backgroundColor: "#ffffff",
    padding: "4.5rem 1.5rem 3.5rem",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)",
    textAlign: "center",
  },
  container: {
    maxWidth: "960px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "0.35rem 0.85rem",
    borderRadius: "9999px",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "clamp(2rem, 4vw, 2.75rem)",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 1rem 0",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#475569",
    lineHeight: 1.6,
    maxWidth: "720px",
    margin: "0 auto",
  },
  missionSection: {
    padding: "4rem 1.5rem",
  },
  missionCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    padding: "3rem",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
  },
  sectionTitle: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 1.25rem 0",
    letterSpacing: "-0.02em",
  },
  missionParagraph: {
    fontSize: "1.0625rem",
    color: "#334155",
    lineHeight: 1.7,
    margin: "0 0 1.25rem 0",
  },
  valuesSection: {
    padding: "2rem 1.5rem 4rem",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  sectionSubtitle: {
    fontSize: "1.0625rem",
    color: "#64748b",
    margin: "0.5rem 0 0 0",
  },
  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "2rem",
  },
  valueCard: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "2rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
  },
  valueTitle: {
    fontSize: "1.1875rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.75rem 0",
  },
  valueDesc: {
    fontSize: "0.9375rem",
    color: "#475569",
    lineHeight: 1.6,
    margin: 0,
  },
  standardsSection: {
    padding: "0 1.5rem 4rem",
  },
  standardsCard: {
    backgroundColor: "#f0fdfa",
    borderRadius: "18px",
    border: "1px solid #ccfbf1",
    padding: "3rem",
  },
  standardsSub: {
    fontSize: "1rem",
    color: "#475569",
    marginBottom: "1.5rem",
  },
  standardsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
  },
  standardItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#0f172a",
  },
  checkIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    fontSize: "0.8125rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};
