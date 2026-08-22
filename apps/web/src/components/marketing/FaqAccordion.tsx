"use client";

import { useState } from "react";
import { FaqItem } from "../../content/marketing/faqs";

interface FaqAccordionProps {
  items: FaqItem[];
  limit?: number;
}

export function FaqAccordion({ items, limit }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const displayItems = limit ? items.slice(0, limit) : items;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.accordionContainer}>
      {displayItems.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `faq-btn-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={index} style={styles.faqCard}>
            <button
              id={buttonId}
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              style={styles.questionButton}
            >
              <span style={styles.questionText}>{item.question}</span>
              <span style={styles.iconWrapper}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} style={styles.answerPanel}>
                <p style={styles.answerText}>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  accordionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
    maxWidth: "840px",
    margin: "0 auto",
  },
  faqCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    border: "1px solid rgba(226, 232, 240, 0.9)",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
    transition: "border-color 0.2s ease",
  },
  questionButton: {
    width: "100%",
    padding: "1.25rem 1.5rem",
    backgroundColor: "transparent",
    border: "none",
    textAlign: "left",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    color: "#0f172a",
    fontSize: "1rem",
    fontWeight: 700,
    gap: "1rem",
  },
  questionText: {
    lineHeight: 1.4,
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  answerPanel: {
    padding: "0 1.5rem 1.25rem 1.5rem",
    borderTop: "1px solid rgba(226, 232, 240, 0.7)",
  },
  answerText: {
    margin: "0.85rem 0 0 0",
    color: "#475569",
    fontSize: "0.9375rem",
    lineHeight: 1.65,
  },
};
