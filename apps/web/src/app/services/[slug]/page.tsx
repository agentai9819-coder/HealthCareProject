import Link from "next/link";
import { API_BASE } from "../../../lib/api";
import { Service, findServiceBySlug, DEFAULT_SERVICES } from "../../../lib/services";
import { servicesEnrichmentMap, defaultEnrichment } from "../../../content/marketing/services";

async function getServices(): Promise<Service[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/services`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (_err) {
    // API offline during static build time, use default catalog
  }
  return DEFAULT_SERVICES;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const services = await getServices();
  const service = findServiceBySlug(services, slug);

  if (!service) {
    return (
      <main style={styles.errorMain}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 style={styles.errorTitle}>Service Not Found</h1>
          <p style={styles.errorText}>
            The requested healthcare service could not be located in our active service catalog.
          </p>
          <Link href="/services" style={styles.backButton}>
            ← Return to Services Directory
          </Link>
        </div>
      </main>
    );
  }

  const enrichment = servicesEnrichmentMap[slug] || defaultEnrichment;
  const formattedPrice = Number(service.price).toFixed(2);

  return (
    <main style={styles.main}>
      {/* Breadcrumb & Navigation */}
      <div style={styles.breadcrumbBar}>
        <div style={styles.container}>
          <Link href="/services" style={styles.breadcrumbLink}>
            ← Back to All Healthcare Services
          </Link>
        </div>
      </div>

      {/* Hero Service Overview */}
      <section style={styles.heroSection}>
        <div style={styles.container}>
          <div style={styles.heroGrid}>
            <div style={styles.heroContent}>
              <span style={styles.categoryBadge}>{enrichment.category}</span>
              <h1 style={styles.serviceTitle}>{service.name}</h1>
              <p style={styles.serviceDesc}>
                {service.description || enrichment.shortSummary}
              </p>

              <div style={styles.pillRow}>
                <div style={styles.pill}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{service.durationMinutes} Minutes Visit</span>
                </div>
                <div style={styles.pill}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>State-Licensed Clinician</span>
                </div>
                <div style={styles.pill}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  <span>In-Home Delivery</span>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div style={styles.bookingBox}>
              <span style={styles.boxLabel}>Transparent Upfront Rate</span>
              <div style={styles.boxPrice}>₹{formattedPrice}</div>
              <p style={styles.boxSubtext}>
                Includes full clinical examination, supplies, vital checks, and written care summary.
              </p>
              <Link
                href={`/booking/select-slot?serviceId=${service.id}`}
                style={styles.bookCtaBtn}
              >
                Select Appointment Slot
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <span style={styles.secureText}>🔒 No advance prepayment required to browse slots</span>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Details */}
      <section style={styles.detailsSection}>
        <div style={styles.container}>
          <div style={styles.detailsLayout}>
            {/* What's Included */}
            <div style={styles.detailCard}>
              <h2 style={styles.cardHeader}>What Is Included in This Visit</h2>
              <ul style={styles.checkList}>
                {enrichment.whatsIncluded.map((item, idx) => (
                  <li key={idx} style={styles.checkItem}>
                    <div style={styles.checkIcon}>✓</div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who It's For */}
            <div style={styles.detailCard}>
              <h2 style={styles.cardHeader}>Who This Care Is Recommended For</h2>
              <ul style={styles.checkList}>
                {enrichment.whoItsFor.map((item, idx) => (
                  <li key={idx} style={styles.checkItem}>
                    <div style={styles.checkIcon}>✓</div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Tips */}
            <div style={styles.detailCard}>
              <h2 style={styles.cardHeader}>How to Prepare for Your Clinician's Arrival</h2>
              <ul style={styles.checkList}>
                {enrichment.preparationTips.map((item, idx) => (
                  <li key={idx} style={styles.checkItem}>
                    <div style={styles.checkIcon}>✓</div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section style={styles.safetySection}>
        <div style={styles.container}>
          <div style={styles.safetyBanner}>
            <div style={styles.safetyIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 style={styles.safetyTitle}>Scheduled Non-Emergency Care Notice</h3>
              <p style={styles.safetyText}>
                This service is designed for scheduled in-home clinical assessments and recovery. If you are experiencing acute medical distress or an emergency, call 911 immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  breadcrumbBar: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "0.75rem 1.5rem",
  },
  container: {
    maxWidth: "1080px",
    margin: "0 auto",
  },
  breadcrumbLink: {
    color: "#0f766e",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  heroSection: {
    backgroundColor: "#ffffff",
    padding: "3.5rem 1.5rem 4rem",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)",
  },
  heroGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "3rem",
    alignItems: "flex-start",
  },
  heroContent: {
    flex: "1 1 540px",
  },
  categoryBadge: {
    display: "inline-block",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.75rem",
    padding: "0.3rem 0.75rem",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "1rem",
  },
  serviceTitle: {
    fontSize: "clamp(2rem, 4vw, 2.75rem)",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 1rem 0",
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
  },
  serviceDesc: {
    fontSize: "1.125rem",
    color: "#475569",
    lineHeight: 1.6,
    marginBottom: "2rem",
  },
  pillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#334155",
    backgroundColor: "#f1f5f9",
    padding: "0.4rem 0.85rem",
    borderRadius: "8px",
  },
  bookingBox: {
    flex: "1 1 320px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #ccfbf1",
    padding: "2.25rem",
    boxShadow: "0 8px 24px rgba(15, 118, 110, 0.08)",
  },
  boxLabel: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "0.35rem",
  },
  boxPrice: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "0.75rem",
  },
  boxSubtext: {
    fontSize: "0.875rem",
    color: "#64748b",
    lineHeight: 1.5,
    marginBottom: "1.75rem",
  },
  bookCtaBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "1rem",
    padding: "0.875rem 1.5rem",
    borderRadius: "10px",
    textDecoration: "none",
    boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
    marginBottom: "0.875rem",
  },
  secureText: {
    fontSize: "0.75rem",
    color: "#64748b",
    display: "block",
    textAlign: "center",
  },
  detailsSection: {
    padding: "4rem 1.5rem",
  },
  detailsLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  detailCard: {
    backgroundColor: "#ffffff",
    padding: "2.25rem",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
  },
  cardHeader: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 1.25rem 0",
  },
  checkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
  },
  checkItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    fontSize: "0.9375rem",
    color: "#334155",
    lineHeight: 1.5,
  },
  checkIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    fontSize: "0.75rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "0.125rem",
  },
  safetySection: {
    padding: "0 1.5rem 4rem",
  },
  safetyBanner: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "12px",
    padding: "1.5rem 1.75rem",
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  safetyIcon: {
    color: "#d97706",
    flexShrink: 0,
    marginTop: "0.125rem",
  },
  safetyTitle: {
    fontSize: "0.9375rem",
    fontWeight: 700,
    color: "#92400e",
    margin: "0 0 0.25rem 0",
  },
  safetyText: {
    fontSize: "0.875rem",
    color: "#b45309",
    margin: 0,
    lineHeight: 1.5,
  },
  errorMain: {
    minHeight: "70vh",
    padding: "4rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorCard: {
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "2.5rem",
    border: "1px solid #e2e8f0",
    textAlign: "center",
  },
  errorIcon: {
    color: "#d97706",
    marginBottom: "1rem",
  },
  errorTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.5rem 0",
  },
  errorText: {
    fontSize: "0.9375rem",
    color: "#64748b",
    lineHeight: 1.5,
    marginBottom: "1.5rem",
  },
  backButton: {
    display: "inline-block",
    padding: "0.65rem 1.25rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
};
