import Link from "next/link";
import { howItWorksContent } from "../../content/marketing/howItWorks";
import { CtaBanner } from "../../components/marketing/CtaBanner";

export default function HowItWorksPage() {
  const { header, steps, safetyNotice } = howItWorksContent;

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

      {/* Steps List */}
      <section style={styles.stepsSection}>
        <div style={styles.container}>
          <div style={styles.stepsList}>
            {steps.map((step, idx) => (
              <div key={idx} style={styles.stepCard}>
                <div style={styles.stepNumberCol}>
                  <div style={styles.numberCircle}>{step.number}</div>
                </div>
                <div style={styles.stepBody}>
                  <h2 style={styles.stepTitle}>{step.title}</h2>
                  <p style={styles.stepSummary}>{step.summary}</p>
                  <ul style={styles.detailList}>
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} style={styles.detailItem}>
                        <span style={styles.check}>✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section style={styles.safetySection}>
        <div style={styles.container}>
          <div style={styles.safetyBox}>
            <h2 style={styles.safetyTitle}>{safetyNotice.title}</h2>
            <p style={styles.safetyText}>{safetyNotice.content}</p>
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
  stepsSection: {
    padding: "4.5rem 1.5rem",
  },
  stepsList: {
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
  },
  stepCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    padding: "2.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    alignItems: "flex-start",
  },
  stepNumberCol: {
    flexShrink: 0,
  },
  numberCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    fontSize: "1.375rem",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    fontSize: "1.375rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.5rem 0",
  },
  stepSummary: {
    fontSize: "1.0625rem",
    color: "#0f766e",
    fontWeight: 500,
    margin: "0 0 1.25rem 0",
  },
  detailList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  detailItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.625rem",
    fontSize: "0.9375rem",
    color: "#334155",
    lineHeight: 1.5,
  },
  check: {
    color: "#0f766e",
    fontWeight: 700,
    flexShrink: 0,
  },
  safetySection: {
    padding: "0 1.5rem 4rem",
  },
  safetyBox: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "14px",
    padding: "2rem",
  },
  safetyTitle: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#92400e",
    margin: "0 0 0.5rem 0",
  },
  safetyText: {
    fontSize: "0.9375rem",
    color: "#b45309",
    lineHeight: 1.6,
    margin: 0,
  },
};
