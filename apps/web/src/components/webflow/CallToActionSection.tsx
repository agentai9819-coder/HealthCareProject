"use client";

import Link from "next/link";

export function CallToActionSection() {
  return (
    <section className="wf-cta-section">
      <div className="wf-container">
        <div className="wf-cta-card">
          <div className="wf-cta-subtitle">Healthcare Solutions</div>
          <div className="wf-cta-content-row">
            <h2 className="wf-cta-title">
              Your health is our <br />
              <span className="wf-cta-highlight">Top priority</span>
            </h2>
            <Link href="/services" className="wf-cta-circle-btn">
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbf8_arrow-up-right-round.svg"
                alt="Book Consultation"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
