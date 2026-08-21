"use client";

import { useState } from "react";
import Link from "next/link";

interface CityHub {
  id: string;
  name: string;
  dispatchTime: string;
  cliniciansOnline: number;
}

const cityHubs: CityHub[] = [
  { id: "delhi", name: "Delhi NCR", dispatchTime: "45 mins", cliniciansOnline: 14 },
  { id: "bengaluru", name: "Bengaluru", dispatchTime: "40 mins", cliniciansOnline: 11 },
  { id: "mumbai", name: "Mumbai", dispatchTime: "42 mins", cliniciansOnline: 12 },
  { id: "hyderabad", name: "Hyderabad", dispatchTime: "50 mins", cliniciansOnline: 8 },
];

const specialties = [
  {
    id: "nursing",
    name: "Skilled Nursing",
    sub: "Wound dress, IV, catheter & vitals",
    price: "₹1,499",
    tag: "Most Requested",
    duration: "45–60 mins",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
  },
  {
    id: "therapy",
    name: "Physical Therapy",
    sub: "Stroke, ortho & post-fracture rehab",
    price: "₹1,900",
    tag: "BPT Certified",
    duration: "60 mins",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "postop",
    name: "Post-Surgical Care",
    sub: "Drain care, suture monitoring & meds",
    price: "₹2,499",
    tag: "Hospital Grade",
    duration: "60–90 mins",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: "wellness",
    name: "Elder Wellness Check",
    sub: "Comprehensive vitals, ECG & companion",
    price: "₹1,299",
    tag: "Preventive Care",
    duration: "45 mins",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const timeSlots = ["Today · 3:30 PM", "Today · 5:15 PM", "Tomorrow · 9:00 AM", "Tomorrow · 2:00 PM"];

export function HeroSection() {
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [selectedSpecialty, setSelectedSpecialty] = useState("nursing");
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);

  const activeHub = cityHubs.find((c) => c.id === selectedCity) || cityHubs[0];
  const activeSpec = specialties.find((s) => s.id === selectedSpecialty) || specialties[0];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-intro">
          <div className="eyebrow fade-in">
            <span className="live-dot" />
            <span>NABH Protocol Care Network</span>
            <span>•</span>
            <span>ABHA Digital Health Aligned</span>
          </div>

          <h1 id="hero-title" className="fade-in delay-1">
            Hospital-Grade Clinical Healthcare, <em>Delivered at Home.</em>
          </h1>

          <p className="hero-description fade-in delay-2">
            Verified Registered Nurses (B.Sc / GNM) and Certified Physiotherapists dispatched to your doorstep. Transparent pricing, sterile single-use kits, and continuous physician oversight.
          </p>

          {/* Quick Credential Badges */}
          <div className="hero-trust-badges fade-in delay-2" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "20px" }}>
            <span style={styles.trustPill}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>100% NMC & INC Registered Clinicians</span>
            </span>
            <span style={styles.trustPill}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Avg {activeHub.dispatchTime} Doorstep Arrival</span>
            </span>
          </div>
        </div>

        {/* Dispatch Window Aside */}
        <aside className="hero-aside fade-in delay-3" aria-label="Live dispatch status">
          <span className="aside-label">Live Dispatch Window</span>
          <span className="aside-big">{activeHub.name} · {activeHub.dispatchTime}</span>
          <p className="aside-caption">
            {activeHub.cliniciansOnline} licensed practitioners currently on active duty in {activeHub.name}.
          </p>
        </aside>
      </div>

      {/* Direct Interactive Booking Console */}
      <section id="care-console" className="booking-console" aria-labelledby="booking-title">
        <div className="console-top">
          <div>
            <p className="console-kicker">Live Care Dispatch Console</p>
            <h2 id="booking-title" className="console-title">Configure your in-home clinical visit</h2>
          </div>

          {/* City Hub Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Coverage:
            </span>
            {cityHubs.map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => setSelectedCity(hub.id)}
                style={{
                  ...styles.cityChip,
                  ...(selectedCity === hub.id ? styles.cityChipActive : {}),
                }}
              >
                {hub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Specialty Selector Grid */}
        <div className="specialty-grid">
          {specialties.map((specialty) => {
            const active = selectedSpecialty === specialty.id;
            return (
              <button
                key={specialty.id}
                type="button"
                className={`specialty-card ${active ? "active" : ""}`}
                onClick={() => setSelectedSpecialty(specialty.id)}
                aria-pressed={active}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                  <span className="specialty-icon">{specialty.icon}</span>
                  <span style={styles.cardTag}>{specialty.tag}</span>
                </div>
                <span className="specialty-name">{specialty.name}</span>
                <span className="specialty-sub">{specialty.sub}</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#34d399" }}>{specialty.price}</span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{specialty.duration}</span>
                </div>
                <span className="selection-check">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        {/* Console Summary & Actions */}
        <div className="console-bottom">
          <div className="time-list" aria-label="Available appointment times">
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", marginRight: "4px" }}>
              Slot:
            </span>
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`time-chip ${selectedTime === time ? "active" : ""}`}
                aria-pressed={selectedTime === time}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="hero-btn-group" style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ marginRight: "8px" }}>
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em" }}>
                Total Visit Fee
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#f8fafc" }}>
                {activeSpec.price} <span style={{ fontSize: "11px", fontWeight: 500, color: "#a7f3d0" }}>incl. GST</span>
              </div>
            </div>

            <Link
              href={`/services?specialty=${selectedSpecialty}&city=${selectedCity}`}
              className="shimmer-button book-button"
            >
              <span>Schedule {activeSpec.name}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/how-it-works"
              style={styles.secondaryBtn}
            >
              <span>Care Protocol</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Ribbon */}
      <div className="metrics-ribbon" aria-label="Veridian Care quality metrics">
        <div className="metric">
          <span className="metric-value">14,800+</span>
          <span className="metric-label">In-Home Visits Delivered</span>
        </div>
        <div className="metric">
          <span className="metric-value">100% Verified</span>
          <span className="metric-label">NMC & INC Registered Nurses</span>
        </div>
        <div className="metric">
          <span className="metric-value">4.96 ★</span>
          <span className="metric-label">Patient Clinical Rating</span>
        </div>
        <div className="metric">
          <span className="metric-value">DISHA / ABHA</span>
          <span className="metric-label">Indian Health Data Privacy</span>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  trustPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#cbd5e1",
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  cityChip: {
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#94a3b8",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  cityChipActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    color: "#a7f3d0",
    borderColor: "rgba(52, 211, 153, 0.4)",
  },
  cardTag: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#a7f3d0",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    padding: "2px 8px",
    borderRadius: "4px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    minHeight: "42px",
    borderRadius: "999px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.15s ease",
  },
};
