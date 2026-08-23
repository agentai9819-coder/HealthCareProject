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
    <div className="faq-accordion-wrap">
      {displayItems.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `faq-btn-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={index} className={`faq-accordion-card ${isOpen ? "open" : ""}`}>
            <button
              id={buttonId}
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="faq-accordion-trigger"
            >
              <span className="faq-accordion-q">{item.question}</span>
              <span className="faq-plus-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="faq-accordion-panel">
                <p className="faq-accordion-ans">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
