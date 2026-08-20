import Link from "next/link";
import { homeContent } from "../../content/marketing/home";

export function CtaBanner() {
  const { finalCta } = homeContent;

  return (
    <section style={styles.ctaSection} aria-label="Book In-Home Care Now">
      <div style={styles.container}>
        <div className="section-kicker" style={{ justifyContent: "center", marginBottom: "1rem" }}>
          Direct In-Home Care Access
        </div>
        <h2 style={styles.headline}>{finalCta.headline}</h2>
        <p style={styles.subtitle}>{finalCta.subtitle}</p>
        <div style={styles.buttonGroup}>
          <Link href={finalCta.primaryCta.href} className="shimmer-button" style={styles.primaryButton}>
            <span>{finalCta.primaryCta.text}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href={finalCta.secondaryCta.href} style={styles.secondaryButton}>
            <span>{finalCta.secondaryCta.text}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  ctaSection: {
    backgroundColor: "#080d0c",
    color: "#ffffff",
    padding: "6rem 1.5rem",
    textAlign: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    position: "relative",
  },
  container: {
    maxWidth: "820px",
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
    fontSize: "1.0625rem",
    color: "#98a49e",
    lineHeight: 1.6,
    margin: "0 0 2.5rem 0",
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0 24px",
    minHeight: "46px",
    fontSize: "14px",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#f8fafc",
    padding: "0 22px",
    minHeight: "46px",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "14px",
    textDecoration: "none",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
};
