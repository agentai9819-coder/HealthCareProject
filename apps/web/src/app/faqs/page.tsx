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
    <main style={styles.main}>
      {/* Header */}
      <section style={styles.headerSection}>
        <div style={styles.container}>
          <span style={styles.badge}>{header.badge}</span>
          <h1 style={styles.title}>{header.title}</h1>
          <p style={styles.subtitle}>{header.subtitle}</p>

          {/* Category Filter Pills */}
          <div style={styles.categoryPillRow}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.categoryPill,
                  ...(selectedCategory === cat ? styles.categoryPillActive : {}),
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section style={styles.faqsSection}>
        <div style={styles.container}>
          <FaqAccordion items={filteredFaqs} />
        </div>
      </section>

      {/* Still Have Questions Box */}
      <section style={styles.contactPromptSection}>
        <div style={styles.container}>
          <div style={styles.promptCard}>
            <h2 style={styles.promptTitle}>Still have questions about our care?</h2>
            <p style={styles.promptText}>
              Our care coordination team is available to assist you with scheduling questions, service details, or clinician matching.
            </p>
            <Link href="/contact" style={styles.contactBtn}>
              Contact Our Care Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  headerSection: {
    backgroundColor: "#ffffff",
    padding: "4.5rem 1.5rem 3rem",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)",
    textAlign: "center",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "0.35rem 0.85rem",
    borderRadius: "9999px",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "clamp(2rem, 4vw, 2.75rem)",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 1rem 0",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#475569",
    lineHeight: 1.6,
    maxWidth: "680px",
    margin: "0 auto 2.5rem",
  },
  categoryPillRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.75rem",
  },
  categoryPill: {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    color: "#475569",
    padding: "0.5rem 1rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  categoryPillActive: {
    backgroundColor: "#0f766e",
    borderColor: "#0f766e",
    color: "#ffffff",
    fontWeight: 600,
  },
  faqsSection: {
    padding: "4rem 1.5rem",
  },
  contactPromptSection: {
    padding: "0 1.5rem 5rem",
  },
  promptCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "3rem",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
  },
  promptTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.75rem 0",
  },
  promptText: {
    fontSize: "1rem",
    color: "#64748b",
    lineHeight: 1.6,
    maxWidth: "560px",
    margin: "0 auto 2rem",
  },
  contactBtn: {
    display: "inline-block",
    padding: "0.75rem 1.75rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9375rem",
  },
};
