import Link from "next/link";
import { API_BASE } from "../../lib/api";
import { Service, getServiceSlug, DEFAULT_SERVICES } from "../../lib/services";
import { servicesEnrichmentMap, defaultEnrichment } from "../../content/marketing/services";

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

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main style={styles.main}>
      {/* Header Banner */}
      <section style={styles.headerSection}>
        <div style={styles.headerContainer}>
          <span style={styles.badge}>Healthcare Services Hub</span>
          <h1 style={styles.title}>In-Home Healthcare Services</h1>
          <p style={styles.subtitle}>
            Explore our specialized clinical offerings delivered by licensed nurses and certified therapists.
            Transparent upfront pricing, individualized care plans, and dignified care in the comfort of your home.
          </p>
          <div style={styles.trustPillRow}>
            <div style={styles.trustPill}>
              <span style={styles.pillCheck}>✓</span> State-Licensed RNs & PTs
            </div>
            <div style={styles.trustPill}>
              <span style={styles.pillCheck}>✓</span> Transparent Pricing
            </div>
            <div style={styles.trustPill}>
              <span style={styles.pillCheck}>✓</span> Same-Day / Scheduled Slots
            </div>
            <div style={styles.trustPill}>
              <span style={styles.pillCheck}>✓</span> Patient Care Summaries
            </div>
          </div>
        </div>
      </section>

      {/* Services Content */}
      <section style={styles.contentSection}>
        <div style={styles.container}>
          {services.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>Our healthcare services catalog is currently updating. Please check back shortly.</p>
            </div>
          ) : (
            <div style={styles.servicesList}>
              {services.map((service) => {
                const slug = getServiceSlug(service);
                const enrichment = servicesEnrichmentMap[slug] || defaultEnrichment;
                const formattedPrice = Number(service.price).toFixed(2);

                return (
                  <article key={service.id} style={styles.serviceRow}>
                    <div style={styles.serviceMain}>
                      <div style={styles.categoryRow}>
                        <span style={styles.categoryBadge}>{enrichment.category}</span>
                        <div style={styles.metaBadge}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{service.durationMinutes} Minutes</span>
                        </div>
                      </div>

                      <h2 style={styles.serviceName}>{service.name}</h2>

                      <p style={styles.serviceDescription}>
                        {service.description || enrichment.shortSummary}
                      </p>

                      <div style={styles.detailsGrid}>
                        <div style={styles.detailCol}>
                          <h3 style={styles.detailTitle}>What's Included</h3>
                          <ul style={styles.bulletList}>
                            {enrichment.whatsIncluded.map((item, idx) => (
                              <li key={idx} style={styles.bulletItem}>
                                <span style={styles.bulletIcon}>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div style={styles.detailCol}>
                          <h3 style={styles.detailTitle}>Who This Care Is For</h3>
                          <ul style={styles.bulletList}>
                            {enrichment.whoItsFor.map((item, idx) => (
                              <li key={idx} style={styles.bulletItem}>
                                <span style={styles.bulletIcon}>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div style={styles.serviceSidebar}>
                      <div style={styles.priceContainer}>
                        <span style={styles.priceLabel}>Standard Visit Fee</span>
                        <span style={styles.priceAmount}>₹{formattedPrice}</span>
                        <span style={styles.priceSubtext}>Transparent rate • Itemized receipt</span>
                      </div>

                      <div style={styles.ctaGroup}>
                        <Link
                          href={`/booking/select-slot?serviceId=${service.id}`}
                          style={styles.bookCta}
                        >
                          Select Appointment Slot
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <Link href={`/services/${slug}`} style={styles.detailsCta}>
                          Detailed Overview
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Questions / Contact Box */}
      <section style={styles.helpSection}>
        <div style={styles.helpContainer}>
          <div style={styles.helpContent}>
            <h2 style={styles.helpTitle}>Not sure which service is right for you?</h2>
            <p style={styles.helpText}>
              Our care coordination team can help evaluate your clinical needs, discuss scheduling options, and answer any questions.
            </p>
          </div>
          <Link href="/contact" style={styles.helpButton}>
            Contact Care Coordination
          </Link>
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
  headerSection: {
    backgroundColor: "#ffffff",
    padding: "4rem 1.5rem 3.5rem",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)",
  },
  headerContainer: {
    maxWidth: "960px",
    margin: "0 auto",
    textAlign: "center",
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
    margin: "0 auto 2rem",
  },
  trustPillRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.75rem 1.5rem",
  },
  trustPill: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#334155",
    backgroundColor: "#ffffff",
    padding: "0.4rem 0.85rem",
    borderRadius: "20px",
    border: "1px solid #cbd5e1",
  },
  pillCheck: {
    color: "#0f766e",
    fontWeight: 700,
  },
  contentSection: {
    padding: "4rem 1.5rem",
  },
  container: {
    maxWidth: "1120px",
    margin: "0 auto",
  },
  servicesList: {
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
  },
  serviceRow: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
    display: "flex",
    flexWrap: "wrap",
    overflow: "hidden",
  },
  serviceMain: {
    flex: "1 1 600px",
    padding: "2.5rem",
  },
  categoryRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },
  categoryBadge: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#0f766e",
    backgroundColor: "#f0fdfa",
    padding: "0.3rem 0.75rem",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  metaBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    fontSize: "0.8125rem",
    color: "#64748b",
    fontWeight: 500,
  },
  serviceName: {
    fontSize: "1.625rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.875rem 0",
    letterSpacing: "-0.02em",
  },
  serviceDescription: {
    fontSize: "1rem",
    color: "#475569",
    lineHeight: 1.6,
    marginBottom: "2rem",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.75rem",
  },
  detailCol: {
    backgroundColor: "#fafbfc",
    padding: "1.25rem 1.5rem",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
  },
  detailTitle: {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    margin: "0 0 0.75rem 0",
  },
  bulletList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  bulletItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#475569",
    lineHeight: 1.45,
  },
  bulletIcon: {
    color: "#0f766e",
    fontWeight: 700,
  },
  serviceSidebar: {
    flex: "1 1 280px",
    backgroundColor: "#fafbfc",
    borderLeft: "1px solid #e2e8f0",
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  priceContainer: {
    marginBottom: "2rem",
  },
  priceLabel: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "0.35rem",
  },
  priceAmount: {
    fontSize: "2.25rem",
    fontWeight: 800,
    color: "#0f172a",
    display: "block",
    marginBottom: "0.35rem",
  },
  priceSubtext: {
    fontSize: "0.8125rem",
    color: "#64748b",
  },
  ctaGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  bookCta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.9375rem",
    padding: "0.85rem 1.25rem",
    borderRadius: "10px",
    textDecoration: "none",
    boxShadow: "0 2px 8px rgba(15, 118, 110, 0.2)",
    textAlign: "center",
  },
  detailsCta: {
    display: "block",
    textAlign: "center",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "0.75rem 1.25rem",
    borderRadius: "10px",
    textDecoration: "none",
    border: "1px solid #cbd5e1",
  },
  helpSection: {
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    padding: "3.5rem 1.5rem",
  },
  helpContainer: {
    maxWidth: "960px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2rem",
  },
  helpContent: {
    flex: "1 1 500px",
  },
  helpTitle: {
    fontSize: "1.375rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.5rem 0",
  },
  helpText: {
    fontSize: "0.9375rem",
    color: "#64748b",
    lineHeight: 1.5,
    margin: 0,
  },
  helpButton: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#ffffff",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.9375rem",
    borderRadius: "8px",
    textDecoration: "none",
    border: "1.5px solid #0f766e",
  },
  emptyBox: {
    textAlign: "center",
    padding: "4rem",
    color: "#64748b",
  },
};