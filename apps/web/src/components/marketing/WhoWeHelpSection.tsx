import { homeContent } from "../../content/marketing/home";

export function WhoWeHelpSection() {
  const { whoWeHelp } = homeContent;

  return (
    <section style={styles.section} aria-labelledby="who-we-help-title">
      <div style={styles.container}>
        <div style={styles.header}>
          <span className="section-kicker" style={{ justifyContent: "center" }}>
            Tailored Clinical Pathways
          </span>
          <h2 id="who-we-help-title" className="section-heading" style={{ margin: "14px 0" }}>
            {whoWeHelp.sectionTitle}
          </h2>
          <p style={styles.subtitle}>{whoWeHelp.sectionSubtitle}</p>
        </div>

        <div style={styles.grid}>
          {whoWeHelp.personas.map((item, idx) => (
            <div key={idx} className="service-card" style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.iconCircle}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                    {item.icon === "activity" && <path d="M22 12h-4l-3 9L9 3l-3 9H2" />}
                    {item.icon === "heart" && (
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    )}
                    {item.icon === "shield" && (
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    )}
                    {item.icon === "users" && (
                      <>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </>
                    )}
                  </svg>
                </div>
                <span style={styles.cardTag}>Clinical Protocol</span>
              </div>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: "80px 0",
    position: "relative",
  },
  container: {
    maxWidth: "1320px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    maxWidth: "740px",
    margin: "0 auto 3.5rem",
  },
  subtitle: {
    fontFamily: "var(--font-sans, sans-serif)",
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: 1.65,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  iconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    color: "#34d399",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTag: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#a7f3d0",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
    border: "1px solid rgba(16, 185, 129, 0.2)",
  },
  cardTitle: {
    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#f8fafc",
    margin: "0 0 0.75rem 0",
    lineHeight: 1.3,
  },
  cardDesc: {
    fontFamily: "var(--font-sans, sans-serif)",
    fontSize: "0.925rem",
    color: "#94a3b8",
    lineHeight: 1.6,
    margin: 0,
  },
};
