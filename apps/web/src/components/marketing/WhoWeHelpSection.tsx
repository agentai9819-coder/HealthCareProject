"use client";

import { useState } from "react";
import Link from "next/link";

const pathways = [
  {
    id: "post-op",
    title: "Post-Hospital Discharge",
    subtitle: "For patients transitioning home after surgery or ICU stay.",
    protocol: "Wound inspection, drain care, medication review, and recovery milestone monitoring under physician supervision.",
    badge: "Surgical Recovery",
    duration: "1–4 Weeks Protocol",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: "chronic",
    title: "Elderly & Chronic Disease Care",
    subtitle: "For seniors managing hypertension, diabetes, cardiac or renal conditions.",
    protocol: "Comprehensive bedside vitals, portable 12-lead ECG, blood glucose charting, and continuous family caregiver updates.",
    badge: "Geriatric Concierge",
    duration: "Ongoing Care Plans",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "rehab",
    title: "Neuro & Orthopedic Rehabilitation",
    subtitle: "For stroke survivors, joint replacement, and mobility restoration.",
    protocol: "One-on-one physiotherapy by certified BPT clinicians focusing on balance, gait training, and neuromuscular re-education.",
    badge: "Physical Therapy",
    duration: "Daily or Bi-Weekly",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "palliative",
    title: "Comfort & Palliative Support",
    subtitle: "For individuals needing compassionate pain and symptom management at home.",
    protocol: "Non-invasive symptom relief, catheter management, oxygen therapy coordination, and respectful family guidance.",
    badge: "Compassionate Care",
    duration: "Dedicated Care",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export function WhoWeHelpSection() {
  const [activeTab, setActiveTab] = useState("post-op");

  return (
    <section style={styles.section} aria-labelledby="who-we-help-title">
      <div style={styles.container}>
        <div style={styles.header}>
          <span className="section-kicker" style={{ justifyContent: "center" }}>
            Tailored Clinical Pathways
          </span>
          <h2 id="who-we-help-title" className="section-heading" style={{ margin: "16px auto", textAlign: "center" }}>
            Specialized Care Designed Around Your Life
          </h2>
          <p style={styles.subtitle}>
            Every patient is unique. Our clinical pathways combine verified hospital-grade practitioners with customized in-home protocols.
          </p>
        </div>

        <div style={styles.grid}>
          {pathways.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <div
                key={item.id}
                className="service-card"
                style={{
                  ...styles.card,
                  borderColor: isSelected ? "var(--color-emerald)" : "rgba(226, 232, 240, 0.9)",
                  boxShadow: isSelected ? "0 16px 36px -10px rgba(16, 185, 129, 0.15)" : "0 8px 24px -8px rgba(15, 23, 42, 0.05)",
                }}
                onClick={() => setActiveTab(item.id)}
              >
                <div style={styles.cardTop}>
                  <div style={styles.iconCircle}>
                    {item.icon}
                  </div>
                  <span style={styles.cardTag}>{item.badge}</span>
                </div>

                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardSubtitle}>{item.subtitle}</p>

                <div style={styles.protocolBox}>
                  <strong style={{ display: "block", fontSize: "11px", color: "#047857", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                    Clinical Protocol
                  </strong>
                  <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: 1.55 }}>
                    {item.protocol}
                  </p>
                </div>

                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid rgba(226, 232, 240, 0.8)" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 700 }}>{item.duration}</span>
                  <Link
                    href="/services"
                    style={{ fontSize: "13px", color: "#059669", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>View Pathway</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: "95px 0",
    position: "relative",
    background: "#f8fafc",
  },
  container: {
    maxWidth: "1320px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    maxWidth: "760px",
    margin: "0 auto 3.5rem",
  },
  subtitle: {
    fontSize: "15px",
    color: "#475569",
    lineHeight: 1.65,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  iconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "#ecfdf5",
    color: "#059669",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTag: {
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#047857",
    backgroundColor: "#ecfdf5",
    padding: "3px 8px",
    borderRadius: "6px",
    border: "1px solid rgba(16, 185, 129, 0.2)",
  },
  cardTitle: {
    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
    fontSize: "1.25rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 0.5rem 0",
    lineHeight: 1.3,
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "#475569",
    lineHeight: 1.5,
    margin: "0 0 1.25rem 0",
  },
  protocolBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    borderRadius: "14px",
    padding: "14px 16px",
    marginBottom: "1.25rem",
  },
};
