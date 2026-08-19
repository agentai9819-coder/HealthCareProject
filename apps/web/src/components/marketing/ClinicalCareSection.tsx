import Link from "next/link";

export function ClinicalCareSection() {
  const points = [
    {
      title: "Integrated Vitals & Assessment",
      desc: "Comprehensive blood pressure, pulse oximetry, glucose, and cardiopulmonary evaluation on every visit.",
    },
    {
      title: "Sterile Bedside Clinical Protocols",
      desc: "Strict aseptic techniques for surgical dressing changes, catheter maintenance, and wound therapy.",
    },
    {
      title: "Mobility & Fall-Risk Evaluation",
      desc: "Licensed physical therapy protocols tailored to home recovery, safe transfers, and functional rehabilitation.",
    },
    {
      title: "Transparent Care Continuity",
      desc: "Instant post-visit patient summaries provided directly to you and your authorized family care coordinators.",
    },
  ];

  return (
    <section style={styles.section} aria-labelledby="clinical-care-heading">
      <div style={styles.container}>
        <div style={styles.row}>
          {/* Left Column: Rich Medical Graphic */}
          <div style={styles.imageColumn}>
            <div style={styles.imageWrapper}>
              <img
                src="/assets/images/about-img.png"
                alt="Clinical In-Home Examination and Care"
                style={styles.image}
              />
              <div style={styles.imageBadge}>
                <div style={styles.badgePulse} />
                <span style={styles.badgeText}>Supervisory Nursing Oversight</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Checklist */}
          <div style={styles.contentColumn}>
            <span style={styles.pillBadge}>Hospital-Grade Clinical Standards</span>
            <h2 id="clinical-care-heading" style={styles.heading}>
              Hospital-Quality Precision, Delivered to Your Living Room
            </h2>
            <p style={styles.lead}>
              We eliminate the stress of clinic commutes. Our state-licensed nurses and certified physical therapists bring clinical rigor, advanced monitoring, and compassionate care directly to your bedside.
            </p>

            <div style={styles.pointsList}>
              {points.map((pt, idx) => (
                <div key={idx} style={styles.pointItem}>
                  <div style={styles.pointIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={styles.pointTitle}>{pt.title}</h3>
                    <p style={styles.pointDesc}>{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.ctaRow}>
              <Link href="/services" style={styles.primaryBtn}>
                Explore All Clinical Services
              </Link>
              <Link href="/about" style={styles.secondaryBtn}>
                Learn About Our Care Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: "6rem 1.5rem",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "4rem 3rem",
    alignItems: "center",
  },
  imageColumn: {
    display: "flex",
    justifyContent: "center",
  },
  imageWrapper: {
    position: "relative",
    maxWidth: "540px",
    width: "100%",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.1), 0 2px 10px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
    objectFit: "cover",
  },
  imageBadge: {
    position: "absolute",
    bottom: "1.5rem",
    left: "1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    borderRadius: "9999px",
    padding: "0.5rem 1.15rem",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ccfbf1",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  badgePulse: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
  },
  badgeText: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#0f766e",
  },
  contentColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  pillBadge: {
    display: "inline-block",
    backgroundColor: "#f0fdfa",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.8125rem",
    padding: "0.35rem 0.85rem",
    borderRadius: "9999px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "1rem",
    border: "1px solid #ccfbf1",
  },
  heading: {
    fontSize: "clamp(2rem, 3.8vw, 2.75rem)",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.2,
    margin: "0 0 1.25rem 0",
    letterSpacing: "-0.03em",
  },
  lead: {
    fontSize: "1.0625rem",
    color: "#475569",
    lineHeight: 1.65,
    margin: "0 0 2rem 0",
  },
  pointsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    marginBottom: "2.5rem",
    width: "100%",
  },
  pointItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  pointIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "#f0fdfa",
    border: "1px solid #ccfbf1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "0.15rem",
  },
  pointTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.25rem 0",
  },
  pointDesc: {
    fontSize: "0.875rem",
    color: "#64748b",
    lineHeight: 1.5,
    margin: 0,
  },
  ctaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
  },
  primaryBtn: {
    backgroundColor: "#0f766e",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.9375rem",
    padding: "0.8rem 1.65rem",
    borderRadius: "10px",
    textDecoration: "none",
    boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
  },
  secondaryBtn: {
    backgroundColor: "#ffffff",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.9375rem",
    padding: "0.8rem 1.65rem",
    borderRadius: "10px",
    textDecoration: "none",
    border: "1.5px solid #cbd5e1",
  },
};
