import Link from "next/link";
import Image from "next/image";

export function ClinicalCareSection() {
  const points = [
    {
      title: "100% Sealed Single-Use Sterile Kits",
      desc: "Every procedure uses tamper-evident sealed consumable kits opened exclusively at your bedside.",
      badge: "Infection Control",
    },
    {
      title: "Digital Vitals & Telemetry Telemetry",
      desc: "Instant multi-parameter monitoring: blood pressure, pulse oximetry, capillary glucose & temperature.",
      badge: "Real-Time Telemetry",
    },
    {
      title: "Active Physician Tele-Supervision",
      desc: "Continuous physician oversight via encrypted digital charting with immediate escalation protocols.",
      badge: "Doctor Oversight",
    },
    {
      title: "ABHA & DISHA Aligned Care Summary",
      desc: "Comprehensive digital visit report dispatched to you and your authorized family care coordinators within 30 minutes.",
      badge: "Digital Health",
    },
  ];

  return (
    <section style={styles.section} aria-labelledby="clinical-care-heading">
      <div style={styles.container}>
        <div style={styles.row}>
          {/* Left Column: Glass Medical Graphic & Live Telemetry Badge */}
          <div style={styles.imageColumn}>
            <div style={styles.imageWrapper}>
              <Image
                src="/assets/images/about-img.png"
                alt="Clinical In-Home Examination and Sterile Care"
                width={540}
                height={400}
                quality={85}
                loading="lazy"
                style={styles.image}
              />
              <div style={styles.imageBadge}>
                <div style={styles.badgePulse} />
                <span style={styles.badgeText}>Live Supervisory Physician Tele-Desk Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Checklist */}
          <div style={styles.contentColumn}>
            <span className="section-kicker">Hospital-Grade Clinical Standards</span>
            <h2 id="clinical-care-heading" className="section-heading" style={{ margin: "16px 0" }}>
              Hospital-Quality Precision, Delivered to Your Living Room
            </h2>
            <p style={styles.lead}>
              We eliminate the anxiety of hospital waiting rooms and clinic commutes. Verified, hospital-trained Registered Nurses and Certified Physiotherapists bring clinical rigor, advanced monitoring, and calm reassurance to your bedside.
            </p>

            <div style={styles.pointsList}>
              {points.map((pt, idx) => (
                <div key={idx} style={styles.pointItem}>
                  <div style={styles.pointIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={styles.pointTitle}>{pt.title}</h3>
                      <span style={styles.pointBadge}>{pt.badge}</span>
                    </div>
                    <p style={styles.pointDesc}>{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.ctaRow}>
              <Link href="/services" className="shimmer-button" style={{ minHeight: "44px", padding: "0 22px" }}>
                <span>Explore Clinical Services</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/about" style={styles.secondaryBtn}>
                <span>Our Clinical Standard</span>
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
    padding: "95px 0",
    position: "relative",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    background: "linear-gradient(180deg, rgba(6, 11, 14, 0) 0%, rgba(12, 20, 26, 0.4) 100%)",
  },
  container: {
    maxWidth: "1320px",
    margin: "0 auto",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "4rem 3.5rem",
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
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(12, 20, 26, 0.8)",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
    objectFit: "cover",
    opacity: 0.9,
  },
  imageBadge: {
    position: "absolute",
    bottom: "1.25rem",
    left: "1.25rem",
    right: "1.25rem",
    backgroundColor: "rgba(6, 11, 14, 0.88)",
    backdropFilter: "blur(12px)",
    borderRadius: "14px",
    padding: "0.65rem 1rem",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  badgePulse: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#38bdf8",
    boxShadow: "0 0 10px #38bdf8",
    flexShrink: 0,
  },
  badgeText: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#f8fafc",
  },
  contentColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  lead: {
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: 1.7,
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
    padding: "14px 16px",
    borderRadius: "16px",
    backgroundColor: "rgba(14, 23, 42, 0.75)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  pointIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "0.1rem",
  },
  pointTitle: {
    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
    fontSize: "15px",
    fontWeight: 800,
    color: "#ffffff",
    margin: 0,
  },
  pointBadge: {
    fontSize: "9px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#38bdf8",
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid rgba(56, 189, 248, 0.25)",
  },
  pointDesc: {
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: 1.5,
    margin: "4px 0 0 0",
  },
  ctaRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 18px",
    minHeight: "44px",
    borderRadius: "999px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    transition: "all 0.18s ease",
  },
};
