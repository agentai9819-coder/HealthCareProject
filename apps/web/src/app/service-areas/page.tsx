import Link from "next/link";
import { CtaBanner } from "../../components/marketing/CtaBanner";

export default function ServiceAreasPage() {
  return (
    <main style={styles.main}>
      {/* Header */}
      <section style={styles.headerSection}>
        <div style={styles.container}>
          <span style={styles.badge}>Regional Care Coverage</span>
          <h1 style={styles.title}>Service Areas & Coverage Directory</h1>
          <p style={styles.subtitle}>
            Our licensed Registered Nurses and Certified Physical Therapists provide scheduled in-home healthcare visits throughout our designated metropolitan service radius.
          </p>
        </div>
      </section>

      {/* Coverage Overview */}
      <section style={styles.contentSection}>
        <div style={styles.container}>
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h2 style={styles.cardTitle}>Tier-1 Metros & Care Corridors</h2>
              <p style={styles.cardDesc}>
                We provide hospital-grade clinical visits directly to residential homes, apartment communities, and senior living residences across major Indian metropolitan clusters.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                <div style={styles.placeholderBox}>
                  <span style={styles.placeholderLabel}>Delhi NCR</span>
                  <p style={styles.placeholderText}>South Delhi, Gurugram (Golf Course / Cyber City), Noida & Dwarka</p>
                </div>
                <div style={styles.placeholderBox}>
                  <span style={styles.placeholderLabel}>Bengaluru</span>
                  <p style={styles.placeholderText}>Koramangala, Indiranagar, Whitefield, HSR Layout & Jayanagar</p>
                </div>
                <div style={styles.placeholderBox}>
                  <span style={styles.placeholderLabel}>Mumbai MMR</span>
                  <p style={styles.placeholderText}>South Mumbai, Bandra, Juhu, Powai, Thane & Navi Mumbai</p>
                </div>
                <div style={styles.placeholderBox}>
                  <span style={styles.placeholderLabel}>Hyderabad & Pune</span>
                  <p style={styles.placeholderText}>Jubilee Hills, Gachibowli, Koregaon Park & Kalyani Nagar</p>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h2 style={styles.cardTitle}>How to Verify Your PIN Code</h2>
              <p style={styles.cardDesc}>
                When scheduling an appointment, enter your 6-digit Indian PIN code (e.g. 110001, 560034, 400050) during slot selection. Our clinical dispatch radar calculates clinician ETA in real-time.
              </p>
              <div style={{ ...styles.placeholderBox, marginBottom: "20px" }}>
                <span style={styles.placeholderLabel}>Same-Day Dispatch:</span>
                <p style={styles.placeholderText}>
                  Available for requests submitted before 2:00 PM IST across all primary coverage sectors.
                </p>
              </div>
              <Link href="/services" style={styles.actionButton}>
                Browse Services & Check Slots →
              </Link>
            </div>
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
  contentSection: {
    padding: "4.5rem 1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "2.5rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "2.5rem",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
  },
  iconCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#f0fdfa",
    color: "#0f766e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.25rem",
  },
  cardTitle: {
    fontSize: "1.375rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.75rem 0",
  },
  cardDesc: {
    fontSize: "0.9375rem",
    color: "#475569",
    lineHeight: 1.6,
    margin: "0 0 1.5rem 0",
  },
  placeholderBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
  },
  placeholderLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    display: "block",
    marginBottom: "0.25rem",
  },
  placeholderText: {
    fontSize: "0.875rem",
    color: "#334155",
    margin: 0,
    lineHeight: 1.5,
  },
  actionButton: {
    display: "inline-block",
    padding: "0.75rem 1.25rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9375rem",
  },
};
