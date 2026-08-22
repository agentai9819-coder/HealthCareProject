import Link from "next/link";
import { homeContent } from "../../content/marketing/home";

export function CtaBanner() {
  const { finalCta } = homeContent;

  return (
    <section style={styles.ctaSection} aria-label="Book In-Home Care Now">
      <div style={styles.container}>
        <span className="section-kicker" style={{ justifyContent: "center", marginBottom: "1rem" }}>
          Immediate & Scheduled In-Home Care
        </span>
        <h2 style={styles.headline}>{finalCta.headline}</h2>
        <p style={styles.subtitle}>{finalCta.subtitle}</p>

        <div style={styles.buttonGroup}>
          <Link href={finalCta.primaryCta.href} className="shimmer-button" style={styles.primaryButton}>
            <span>{finalCta.primaryCta.text}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a href="tel:+911140506070" style={styles.secondaryButton}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Call 24/7 Desk: +91 (11) 4050-6070</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  ctaSection: {
    padding: "6rem 1.5rem",
    textAlign: "center",
    position: "relative",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  },
  container: {
    maxWidth: "840px",
    margin: "0 auto",
  },
  headline: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(2rem, 4vw, 2.75rem)",
    fontWeight: 800,
    color: "#f8fafc",
    margin: "0 0 1rem 0",
    letterSpacing: "-0.035em",
    lineHeight: 1.15,
  },
  subtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: 1.65,
    margin: "0 0 2.5rem 0",
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0 26px",
    minHeight: "48px",
    fontSize: "14px",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#f8fafc",
    padding: "0 22px",
    minHeight: "48px",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "14px",
    textDecoration: "none",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    transition: "all 0.15s ease",
  },
};
