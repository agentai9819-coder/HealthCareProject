"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function StickyPromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky banner after scrolling 300px down
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <aside className="sticky-promo-bar" aria-label="Live Dispatch & Promotional Notice">
      <div className="sticky-promo-inner">
        <div className="sticky-promo-left">
          <span className="sticky-pulse-dot" />
          <div className="sticky-promo-text">
            <div className="sticky-promo-headline">
              <strong>Live In-Home Dispatch Active:</strong>{" "}
              <span>Same-Day & 45-Min Arrival Available Today</span>
            </div>
            <div className="sticky-promo-sub">
              Visits from <strong>₹1,299</strong> · 100% Single-Use Sterile Kits · Verified INC/NMC Clinicians
            </div>
          </div>
        </div>

        <div className="sticky-promo-actions">
          <Link href="/services" className="sticky-promo-cta">
            <span>Book Visit Now</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            type="button"
            className="sticky-promo-close"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
