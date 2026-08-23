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
                  stroke="#ff6b2c"
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
    gap: "0.85rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  faqCard: {
    backgroundColor: "#080808",
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  questionButton: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 1.5rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    gap: "1rem",
  },
  questionText: {
    fontFamily: "var(--font-display)",
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#f8fafc",
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  answerPanel: {
    padding: "0 1.5rem 1.25rem 1.5rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.04)",
  },
  answerText: {
    fontSize: "0.95rem",
    color: "#94a3b8",
    lineHeight: 1.65,
    margin: 0,
  },
};
