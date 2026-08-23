"use client";

import Link from "next/link";

export function BlogSection() {
  return (
    <section className="wf-blog-section">
      <div className="wf-container">
        <div className="wf-block-header">
          <h2 className="wf-block-title">
            Read Clinical Guides From <br />
            Our Medical Directorate
          </h2>
          <Link href="/services" className="wf-view-all-link dark">
            <span>Read All Guides</span>
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbda_arrow-right-02-round.png"
              alt=""
            />
          </Link>
        </div>

        <div className="wf-blog-grid">
          {/* Article 1 */}
          <div className="wf-blog-card">
            <span className="wf-blog-tag">Post-Op Recovery</span>
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
              In-Home Post-Surgical Wound Management: Best Practices &amp; Sterile Protocols
            </h3>
          </div>

          {/* Article 2 */}
          <div className="wf-blog-card wf-blog-card-highlight">
            <div className="wf-blog-content-side">
              <span className="wf-blog-tag">Geriatric Vitality</span>
              <h3 className="wf-blog-article-title">
                Your Complete Guide to In-Home Senior Care, Fall Prevention &amp; Medication Reconciliation
              </h3>

              <Link href="/services" className="wf-blog-cta-btn">
                <span>Book In-Home Care</span>
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
