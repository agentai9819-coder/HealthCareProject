import Link from "next/link";
import { CtaBanner } from "../../components/marketing/CtaBanner";

export default function ServiceAreasPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      {/* Dark Cinematic Header */}
      <section className="sp-section" style={{ padding: "90px 0 70px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="sp-container">
          <div className="sp-section-header" style={{ marginBottom: "0" }}>
            <span className="sp-kicker">Regional Care Network</span>
            <h1 className="sp-section-title">
              Metropolitan Service Areas & <br />
              <span className="sp-gradient-text">Active Clinical Corridors.</span>
            </h1>
            <p className="sp-section-desc">
              Our verified Registered Nurses and Certified Physiotherapists provide rapid 45-minute and scheduled in-home clinical visits across top Tier-1 Indian metropolitan clusters.
            </p>
          </div>
        </div>
      </section>

      {/* Light Cream Coverage Hubs Section */}
      <section className="light-services-section" style={{ padding: "90px 0" }}>
        <div className="light-services-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
            {/* Delhi NCR */}
            <article
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "36px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
              }}
            >
              <span className="light-tag-pill">Avg 45 Mins Dispatch</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "14px 0 10px" }}>
                Delhi NCR Care Hub
              </h2>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 18px" }}>
                Active practitioner coverage across South Delhi (Defence Colony, GK, Vasant Vihar), Gurugram (Golf Course Rd, Cyber City, DLF Phase 1–5), Noida, and Dwarka.
              </p>
              <Link href="/services?city=delhi" className="light-book-btn">
                <span>Book in Delhi NCR</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </article>

            {/* Bengaluru */}
            <article
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "36px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
              }}
            >
              <span className="light-tag-pill">Avg 40 Mins Dispatch</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "14px 0 10px" }}>
                Bengaluru Care Hub
              </h2>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 18px" }}>
                Dedicated clinical teams deployed across Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar, and Sadashivanagar.
              </p>
              <Link href="/services?city=bengaluru" className="light-book-btn">
                <span>Book in Bengaluru</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </article>

            {/* Mumbai */}
            <article
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "36px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
              }}
            >
              <span className="light-tag-pill">Avg 42 Mins Dispatch</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "14px 0 10px" }}>
                Mumbai MMR Care Hub
              </h2>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 18px" }}>
                Full coverage across South Mumbai, Bandra West, BKC, Juhu, Andheri, Powai, Thane, and Navi Mumbai residential sectors.
              </p>
              <Link href="/services?city=mumbai" className="light-book-btn">
                <span>Book in Mumbai</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
