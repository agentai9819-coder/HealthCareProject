export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Following my total knee replacement, traveling to physical therapy was painful and exhausting. Having certified therapists come directly to my home sped up my recovery dramatically.",
      author: "Eleanor Martinez",
      role: "Patient • Post-Surgical Rehabilitation",
      avatar: "/assets/images/avatar/avatar-1.jpg",
      rating: 5,
    },
    {
      quote:
        "The nursing staff managed my father's surgical dressing changes and vitals with utmost professionalism. The transparent visit summaries gave our family complete peace of mind.",
      author: "Robert Chen",
      role: "Family Care Coordinator • Wound Care",
      avatar: "/assets/images/avatar/avatar-2.jpg",
      rating: 5,
    },
    {
      quote:
        "The clinician assessment was thorough, respectful, and reassuring. They helped us identify home fall hazards and coordinated ongoing mobility exercises.",
      author: "Sarah Jenkins",
      role: "Patient • Elder Wellness & Mobility",
      avatar: "/assets/images/avatar/avatar-3.jpg",
      rating: 5,
    },
  ];

  return (
    <section style={styles.section} aria-labelledby="testimonials-heading">
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>Patient Experiences</span>
          <h2 id="testimonials-heading" style={styles.title}>
            Trusted by Patients & Families Across the Community
          </h2>
          <p style={styles.subtitle}>
            Read verified feedback from patients and family coordinators who rely on our licensed clinicians for in-home care.
          </p>
        </div>

        <div style={styles.grid}>
          {testimonials.map((item, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.quoteIcon}>
                <svg width="32" height="24" viewBox="0 0 43 30" fill="none">
                  <path
                    d="M4.25 30L10 20C7.25 20 4.89583 19.0208 2.9375 17.0625C0.979167 15.1042 0 12.75 0 10C0 7.25 0.979167 4.89583 2.9375 2.9375C4.89583 0.979167 7.25 0 10 0C12.75 0 15.1042 0.979167 17.0625 2.9375C19.0208 4.89583 20 7.25 20 10C20 10.9583 19.8854 11.8438 19.6562 12.6562C19.4271 13.4688 19.0833 14.25 18.625 15L10 30H4.25ZM26.75 30L32.5 20C29.75 20 27.3958 19.0208 25.4375 17.0625C23.4792 15.1042 22.5 12.75 22.5 10C22.5 7.25 23.4792 4.89583 25.4375 2.9375C27.3958 0.979167 29.75 0 32.5 0C35.25 0 37.6042 0.979167 39.5625 2.9375C41.5208 4.89583 42.5 7.25 42.5 10C42.5 10.9583 42.3854 11.8438 42.1562 12.6562C41.9271 13.4688 41.5833 14.25 41.125 15L32.5 30H26.75Z"
                    fill="#0EA5E9"
                    fillOpacity="0.2"
                  />
                </svg>
              </div>

              <p style={styles.quoteText}>&ldquo;{item.quote}&rdquo;</p>

              <div style={styles.authorRow}>
                <img src={item.avatar} alt={item.author} style={styles.avatar} />
                <div>
                  <div style={styles.authorName}>{item.author}</div>
                  <div style={styles.authorRole}>{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: "5.5rem 1.5rem",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    maxWidth: "760px",
    margin: "0 auto 3.5rem",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#f0fdfa",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.8125rem",
    padding: "0.35rem 0.85rem",
    borderRadius: "9999px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.75rem",
    border: "1px solid #ccfbf1",
  },
  title: {
    fontSize: "clamp(1.875rem, 3.8vw, 2.5rem)",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 1rem 0",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "1.0625rem",
    color: "#64748b",
    lineHeight: 1.65,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.75rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2.25rem 2rem",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  quoteIcon: {
    marginBottom: "1rem",
  },
  quoteText: {
    fontSize: "0.95rem",
    color: "#334155",
    lineHeight: 1.65,
    fontStyle: "italic",
    margin: "0 0 1.75rem 0",
    flexGrow: 1,
  },
  authorRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.875rem",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "1.25rem",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccfbf1",
  },
  authorName: {
    fontSize: "0.9375rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  authorRole: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginTop: "0.15rem",
  },
};
