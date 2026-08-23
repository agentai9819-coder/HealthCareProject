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
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      {/* Dark Cinematic Header */}
      <section className="sp-section" style={{ padding: "90px 0 60px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="sp-container">
          <div className="sp-section-header" style={{ marginBottom: "32px" }}>
            <span className="sp-kicker">{header.badge}</span>
            <h1 className="sp-section-title">
              Frequently Asked <br />
              <span className="sp-gradient-text">Clinical Questions.</span>
            </h1>
            <p className="sp-section-desc">{header.subtitle}</p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  backgroundColor: selectedCategory === cat ? "#ff6b2c" : "rgba(255, 255, 255, 0.05)",
                  color: selectedCategory === cat ? "#ffffff" : "#94a3b8",
                  border: selectedCategory === cat ? "1px solid #ff6b2c" : "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Light Cream Accordion Section */}
      <section className="light-services-section" style={{ padding: "90px 0" }}>
        <div className="light-services-container">
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <FaqAccordion items={filteredFaqs} />
          </div>
        </div>
      </section>

      {/* Dark Still Have Questions Box */}
      <section className="sp-section" style={{ padding: "80px 0" }}>
        <div className="sp-container">
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              backgroundColor: "#080808",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid rgba(255, 107, 44, 0.3)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
              textAlign: "center",
            }}
          >
            <span className="sp-kicker">24/7 Clinical Coordination</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "8px 0 12px" }}>
              Still have questions about our in-home care?
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.65, margin: "0 auto 28px", maxWidth: "600px" }}>
              Our care coordination team is available to assist you with scheduling inquiries, doctor tele-desk details, or clinician matching.
            </p>
            <Link href="/contact" className="sp-btn-primary">
              <span>Contact Care Concierge</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
