"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function StickyMobileCta() {
  const pathname = usePathname();

  // Hide on auth, admin, and staff pages where bottom bar isn't needed
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/booking/select-slot") ||
    pathname.startsWith("/booking/confirm")
  ) {
    return null;
  }

  return (
    <div
      className="mobile-sticky-cta"
      aria-label="Mobile quick care booking bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: "rgba(8, 13, 12, 0.95)",
        borderTop: "1px solid rgba(52, 211, 153, 0.25)",
        padding: "10px 16px max(10px, env(safe-area-inset-bottom))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.6)",
        transform: "translateZ(0)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "11px", color: "#34d399", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="live-dot" style={{ width: "6px", height: "6px" }} />
          <span>Dispatch Available</span>
        </span>
        <span style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: 600 }}>
          Today from 3:30 PM
        </span>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <a
          href="tel:5550192834"
          aria-label="Call clinical desk"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#f6f7f3",
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        <Link
          href="/services"
          className="shimmer-button"
          style={{
            minHeight: "38px",
            padding: "0 16px",
            fontSize: "13px",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>Book Visit</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
