"use client";

import { useState } from "react";
import Link from "next/link";
import { faqsContent } from "../../content/marketing/faqs";
import { FaqAccordion } from "../../components/marketing/FaqAccordion";

export default function FaqsPage() {
  const { header, categories, faqs } = faqsContent;
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs =
    selectedCategory === "All"
      ? faqs
      : faqs.filter((item) => item.category === selectedCategory);

  return (
    <main className="wf-subpage-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Subpage Navy Banner */}
      <section className="wf-banner-section" style={{ padding: "24px 0 32px" }}>
        <div className="wf-container">
          <div className="wf-subpage-hero-card">
            <div className="wf-badge-row">
              <span className="wf-podcast-badge" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#ffffff" }}>
                <span className="wf-badge-dot" /> {header.badge}
              </span>
            </div>
            <h1 className="wf-subpage-title">{header.title}</h1>
            <p className="wf-subpage-desc">{header.subtitle}</p>

            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "24px" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    backgroundColor: selectedCategory === cat ? "#ff6b2c" : "rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    border: "none",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="wf-container" style={{ paddingTop: "24px", paddingBottom: "40px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <FaqAccordion items={filteredFaqs} />
        </div>
      </section>

      {/* Still Have Questions Card */}
      <section className="wf-container" style={{ paddingBottom: "40px" }}>
        <div className="wf-detail-box" style={{ background: "#252b61", color: "#ffffff", border: "none", maxWidth: "860px", margin: "0 auto", padding: "40px", textAlign: "center" }}>
          <span className="wf-new-badge" style={{ marginBottom: "12px", display: "inline-block" }}>
            24/7 Clinical Coordination
          </span>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: "0 0 10px" }}>
            Still have questions about our in-home clinical care?
          </h2>
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6, margin: "0 auto 24px", maxWidth: "560px" }}>
            Our care coordination team is available to assist you with scheduling inquiries, clinician credentials, or doctor tele-desk details.
          </p>
          <Link
            href="/contact"
            className="wf-consultation-btn"
            style={{ background: "#ffffff", color: "#252b61", display: "inline-flex", textDecoration: "none" }}
          >
            <span>Contact Care Concierge</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
