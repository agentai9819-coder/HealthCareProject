import Link from "next/link";
import { CallToActionSection } from "../../components/webflow/CallToActionSection";

export default function ServiceAreasPage() {
  const hubs = [
    {
      city: "Delhi NCR Care Hub",
      dispatchTime: "Avg 45 Mins Dispatch",
      coverage: "Active practitioner coverage across South Delhi (Defence Colony, GK, Vasant Vihar), Gurugram (Golf Course Rd, Cyber City, DLF Phase 1–5), Noida, and Dwarka.",
      link: "/services?city=delhi",
      btnText: "Book in Delhi NCR",
    },
    {
      city: "Bengaluru Care Hub",
      dispatchTime: "Avg 40 Mins Dispatch",
      coverage: "Dedicated clinical teams deployed across Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar, and Sadashivanagar.",
      link: "/services?city=bengaluru",
      btnText: "Book in Bengaluru",
    },
    {
      city: "Mumbai MMR Care Hub",
      dispatchTime: "Avg 42 Mins Dispatch",
      coverage: "Full coverage across South Mumbai, Bandra West, BKC, Juhu, Andheri, Powai, Thane, and Navi Mumbai residential sectors.",
      link: "/services?city=mumbai",
      btnText: "Book in Mumbai",
    },
    {
      city: "Hyderabad Care Hub",
      dispatchTime: "Avg 45 Mins Dispatch",
      coverage: "Rapid response nursing and physiotherapy coverage across Banjara Hills, Jubilee Hills, Gachibowli, Hitec City, and Madhapur.",
      link: "/services?city=hyderabad",
      btnText: "Book in Hyderabad",
    },
  ];

  return (
    <main className="wf-subpage-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Subpage Navy Banner */}
      <section className="wf-banner-section" style={{ padding: "24px 0 32px" }}>
        <div className="wf-container">
          <div className="wf-subpage-hero-card">
            <div className="wf-badge-row">
              <span className="wf-podcast-badge" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#ffffff" }}>
                <span className="wf-badge-dot" /> Regional Care Network
              </span>
            </div>
            <h1 className="wf-subpage-title">
              Metropolitan Service Areas &amp; Clinical Corridors
            </h1>
            <p className="wf-subpage-desc">
              Our verified Registered Nurses and Certified Physiotherapists provide rapid 45-minute and scheduled in-home clinical visits across top Tier-1 Indian metropolitan clusters.
            </p>
          </div>
        </div>
      </section>

      {/* Hub Cards Grid */}
      <section className="wf-container" style={{ paddingTop: "24px", paddingBottom: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {hubs.map((hub, idx) => (
            <article key={idx} className="wf-detail-box" style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
              <span className="wf-new-badge" style={{ background: "#252b61", alignSelf: "flex-start", marginBottom: "14px" }}>
                {hub.dispatchTime}
              </span>
              <h2 className="wf-detail-heading" style={{ fontSize: "20px", margin: "0 0 10px" }}>
                {hub.city}
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: "0 0 20px" }}>
                {hub.coverage}
              </p>

              <Link
                href={hub.link}
                className="wf-doctor-book-action"
                style={{ marginTop: "auto", textDecoration: "none", alignSelf: "flex-start" }}
              >
                <span>{hub.btnText}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CallToActionSection />
    </main>
  );
}
