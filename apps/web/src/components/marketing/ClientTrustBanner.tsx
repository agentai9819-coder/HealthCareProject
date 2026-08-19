export function ClientTrustBanner() {
  const logos = [
    { src: "/assets/images/client-logo/logo-1.svg", alt: "Healthcare Partner 1" },
    { src: "/assets/images/client-logo/logo-2.svg", alt: "Healthcare Partner 2" },
    { src: "/assets/images/client-logo/logo-3.svg", alt: "Healthcare Partner 3" },
    { src: "/assets/images/client-logo/logo-4.svg", alt: "Healthcare Partner 4" },
  ];

  return (
    <section style={styles.section} aria-label="Trust and Clinical Partners">
      <div style={styles.container}>
        <div style={styles.inner}>
          <div style={styles.textColumn}>
            <span style={styles.badge}>Clinical Compliance</span>
            <h3 style={styles.title}>Trusted Clinical Care Network</h3>
            <p style={styles.desc}>
              Complying with state healthcare regulations, HIPAA privacy standards, and supervisory nursing protocols.
            </p>
          </div>

          <div style={styles.logosGrid}>
            {logos.map((logo, idx) => (
              <div key={idx} style={styles.logoWrapper}>
                <img src={logo.src} alt={logo.alt} style={styles.logoImg} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    backgroundColor: "#f8fafc",
    padding: "2.75rem 1.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
  },
  inner: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "2rem",
  },
  textColumn: {
    maxWidth: "420px",
  },
  badge: {
    display: "inline-block",
    fontSize: "0.6875rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#0f766e",
    backgroundColor: "#ccfbf1",
    padding: "0.2rem 0.55rem",
    borderRadius: "4px",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.35rem 0",
  },
  desc: {
    fontSize: "0.875rem",
    color: "#64748b",
    lineHeight: 1.5,
    margin: 0,
  },
  logosGrid: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "2.5rem 3.5rem",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    height: "28px",
    width: "auto",
    opacity: 0.7,
    filter: "grayscale(100%)",
    transition: "opacity 0.2s ease, filter 0.2s ease",
  },
};
