"use client";

import { useState } from "react";
import Link from "next/link";

const specialties = [
  {
    id: "nursing",
    name: "Skilled Nursing",
    sub: "Clinical visit",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
  },
  {
    id: "therapy",
    name: "Physical Therapy",
    sub: "Recovery session",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "postop",
    name: "Post-Op Care",
    sub: "At-home support",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: "wellness",
    name: "Elder Wellness",
    sub: "Preventive visit",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const timeSlots = ["Today · 3:30 PM", "Today · 5:15 PM", "Tomorrow · 9:00 AM"];

export function HeroSection() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("nursing");
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-intro">
          <div className="eyebrow fade-in">
            <span className="live-dot" />
            <span>State-Licensed Clinical Care Network</span>
            <span>•</span>
            <span>Springfield</span>
          </div>

          <h1 id="hero-title" className="fade-in delay-1">
            Compassionate, Expert Healthcare in the Comfort of Your Home
          </h1>

          <p className="hero-description fade-in delay-2">
            Private, clinically coordinated visits led by licensed registered nurses and certified physical therapists—so the people you love can receive focused hospital-grade care without leaving home.
          </p>
        </div>

        <aside className="hero-aside fade-in delay-3" aria-label="Current dispatch availability">
          <span className="aside-label">Current dispatch window</span>
          <span className="aside-big">Today, from 3:30 PM</span>
          <p className="aside-caption">Live availability is verified by our clinical coordination desk.</p>
        </aside>
      </div>

      {/* Direct Interactive Booking Console */}
      <section id="care-console" className="booking-console" aria-labelledby="booking-title">
        <div className="console-top">
          <div>
            <p className="console-kicker">Direct booking console</p>
            <h2 id="booking-title" className="console-title">Select the care your home needs today.</h2>
          </div>
          <div className="on-call">
            <span className="live-dot" />
            <span>12 clinicians on call</span>
            <span>•</span>
            <span>Updated now</span>
          </div>
        </div>

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
                <span className="specialty-icon">{specialty.icon}</span>
                <span className="specialty-name">{specialty.name}</span>
                <span className="specialty-sub">{specialty.sub}</span>
                <span className="selection-check">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        <div className="console-bottom">
          <div className="time-list" aria-label="Available appointment times">
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

          <div className="hero-btn-group" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/services"
              className="shimmer-button book-button"
            >
              <span>Book In-Home Care</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/how-it-works"
              className="hero-secondary-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "0 16px",
                minHeight: "44px",
                borderRadius: "999px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#f6f7f3",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <span>How It Works</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Ribbon */}
      <div className="metrics-ribbon" aria-label="Veridian Care quality metrics">
        <div className="metric">
          <span className="metric-value">100% Licensed RNs</span>
          <span className="metric-label">State-Licensed Registered Nurses</span>
        </div>
        <div className="metric">
          <span className="metric-value">4.98★ Quality Score</span>
          <span className="metric-label">Care excellence</span>
        </div>
        <div className="metric">
          <span className="metric-value">Same-Day Dispatch</span>
          <span className="metric-label">When available</span>
        </div>
        <div className="metric">
          <span className="metric-value">HIPAA Compliant</span>
          <span className="metric-label">Privacy by design</span>
        </div>
      </div>
    </section>
  );
}
