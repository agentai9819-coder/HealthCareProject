import { whyUsContent } from "../../content/marketing/whyUs";
import { CtaBanner } from "../../components/marketing/CtaBanner";

export default function WhyUsPage() {
  const { header, pillars, emergencyNotice } = whyUsContent;

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

      {/* Pillars Grid */}
      <section style={styles.pillarsSection}>
        <div style={styles.container}>
          <div style={styles.grid}>
            {pillars.map((pillar, idx) => (
              <div key={idx} style={styles.card}>
                <div style={styles.iconCircle}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 style={styles.cardTitle}>{pillar.title}</h2>
                <p style={styles.cardDesc}>{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section style={styles.safetySection}>
        <div style={styles.container}>
          <div style={styles.safetyCard}>
            <h2 style={styles.safetyTitle}>{emergencyNotice.title}</h2>
            <p style={styles.safetyDesc}>{emergencyNotice.description}</p>
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
    maxWidth: "1080px",
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
    maxWidth: "760px",
    margin: "0 auto",
  },
  pillarsSection: {
    padding: "4.5rem 1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "2.25rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
  },
  iconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.25rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.75rem 0",
  },
  cardDesc: {
    fontSize: "0.9375rem",
    color: "#475569",
    lineHeight: 1.6,
    margin: 0,
  },
  safetySection: {
    padding: "0 1.5rem 4.5rem",
  },
  safetyCard: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "16px",
    padding: "2.25rem",
  },
  safetyTitle: {
    fontSize: "1.1875rem",
    fontWeight: 700,
    color: "#92400e",
    margin: "0 0 0.5rem 0",
  },
  safetyDesc: {
    fontSize: "0.9375rem",
    color: "#b45309",
    lineHeight: 1.6,
    margin: 0,
  },
};
