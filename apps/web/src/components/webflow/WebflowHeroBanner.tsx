"use client";

import Link from "next/link";

export function WebflowHeroBanner() {
  return (
    <section className="wf-banner-section">
      <div className="wf-banner-container">
        <div className="wf-banner-card">
          {/* Top Headline + Floating Badge Badges */}
          <div className="wf-banner-top">
            <div className="wf-banner-title-wrap">
              <h1 className="wf-banner-big-text">Healthcare</h1>
            </div>

            <div className="wf-banner-tags-wrap">
              <div className="wf-banner-tag-pill">
                <img
                  src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbce_test%20icon.svg"
                  alt=""
                  className="wf-tag-icon"
                />
                <span>Reduce HbA1c</span>
              </div>

              <div className="wf-banner-tag-pill">
                <img
                  src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbcf_test%20icon%2002.svg"
                  alt=""
                  className="wf-tag-icon"
                />
                <span>No more medications</span>
              </div>
            </div>
          </div>

          {/* Central Cutout Doctor Image Overlapping Typography */}
          <div className="wf-banner-doctor-wrap">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbd0_Doctor%20Banner.png"
              alt="Doctor Specialist"
              className="wf-banner-doctor-img"
            />
          </div>

          {/* Bottom Content (Paragraph + Consultation Button) */}
          <div className="wf-banner-bottom">
            <p className="wf-banner-paragraph">
              REVOLUTIONIZING IN-HOME CLINICAL CARE WITH VERIFIED SPECIALISTS, HOSPITAL-GRADE PROTOCOLS & REAL-TIME TELE-OVERSIGHT.
            </p>

            <div className="wf-banner-btn-group">
              <Link href="/services" className="wf-consultation-btn">
                <div className="wf-btn-arrow-left">
                  <img
                    src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdb8b_arrow.svg"
                    alt=""
                  />
                </div>
                <span className="wf-btn-text">Book Consultation</span>
                <div className="wf-btn-arrow-right">
                  <img
                    src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdb8b_arrow.svg"
                    alt=""
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
