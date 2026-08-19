import Link from "next/link";

export function TrustQualitySection() {
  return (
    <section className="care-detail" aria-labelledby="detail-title">
      <div className="care-detail-card">
        <div className="care-detail-photo" aria-hidden="true" />
        <div className="care-detail-content">
          <span className="section-kicker">Why Choose HomeCare Clinical Standards</span>
          <h3 id="detail-title">
            Clinical attention that respects the feeling of home.
          </h3>
          <p>
            We pair exacting clinical protocol with unhurried human presence—providing Rigorous Background Vetting, hospital-standard Infection-Control Standards, and diagnostic continuity that make an at-home visit feel considered from arrival to follow-up.
          </p>
          <Link className="care-detail-link" href="/services">
            <span>Explore all available care services</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
