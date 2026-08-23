"use client";

import Link from "next/link";

export function BlogSection() {
  return (
    <section className="wf-blog-section">
      <div className="wf-container">
        <div className="wf-block-header">
          <h2 className="wf-block-title">
            Read Top Articles From <br />
            Health Experts
          </h2>
          <Link href="/services" className="wf-view-all-link dark">
            <span>Read All Blogs</span>
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbda_arrow-right-02-round.png"
              alt=""
            />
          </Link>
        </div>

        <div className="wf-blog-grid">
          {/* Article 1 */}
          <div className="wf-blog-card">
            <span className="wf-blog-tag">Clinical Guide</span>
            <div className="wf-blog-images-stack">
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbdd_Rectangle%204279.png"
                alt=""
                className="wf-blog-thumb"
              />
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbdb_Rectangle%204280.png"
                alt=""
                className="wf-blog-thumb center"
              />
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbdc_Rectangle%204278.png"
                alt=""
                className="wf-blog-thumb"
              />
            </div>
            <h3 className="wf-blog-article-title">
              In-Home Post-Surgical Wound Management: Best Practices & Sterile Protocols
            </h3>
          </div>

          {/* Article 2 */}
          <div className="wf-blog-card wf-blog-card-highlight">
            <div className="wf-blog-content-side">
              <span className="wf-blog-tag">Healthy Lifestyle</span>
              <h3 className="wf-blog-article-title">
                Your Ultimate Guide to Preventive Health, Vitals Tracking & Longevity
              </h3>

              <Link href="/services" className="wf-blog-cta-btn">
                <span>Book Consultation</span>
                <img
                  src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdb8b_arrow.svg"
                  alt=""
                />
              </Link>
            </div>

            <div className="wf-blog-img-side">
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbde_Group%201171275639.png"
                alt="Health Guide"
                className="wf-blog-hero-thumb"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
