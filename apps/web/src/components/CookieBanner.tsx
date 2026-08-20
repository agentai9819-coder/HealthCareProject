"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem("veridian_cookie_consent");
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  if (!mounted || accepted) return null;

  const handleAccept = () => {
    localStorage.setItem("veridian_cookie_consent", "accepted");
    setAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem("veridian_cookie_consent", "declined");
    setAccepted(true);
  };

  return (
    <aside
      aria-label="Cookie consent banner"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        maxWidth: "460px",
        backgroundColor: "rgba(14, 24, 21, 0.95)",
        border: "1px solid rgba(52, 211, 153, 0.3)",
        borderRadius: "18px",
        padding: "18px 20px",
        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(20px)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#34d399" }} />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#f6f7f3" }}>
          Patient Privacy & Essential Cookies
        </span>
      </div>
      <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.5 }}>
        We use essential cookies to maintain secure clinical sessions, remember appointment preferences, and ensure HIPAA data protection standards.{" "}
        <Link href="/privacy" style={{ color: "#34d399", textDecoration: "underline" }}>
          Read Privacy Policy
        </Link>
        .
      </p>
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
        <button
          type="button"
          onClick={handleAccept}
          className="shimmer-button"
          style={{
            flex: 1,
            minHeight: "34px",
            padding: "0 14px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <span>Accept Essential</span>
        </button>
        <button
          type="button"
          onClick={handleDecline}
          style={{
            padding: "0 14px",
            minHeight: "34px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#cbd5e1",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "999px",
            cursor: "pointer",
          }}
        >
          Decline
        </button>
      </div>
    </aside>
  );
}
