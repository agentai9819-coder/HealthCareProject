"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface CityHub {
  id: string;
  name: string;
  dispatchTime: string;
  cliniciansOnline: number;
  activeZone: string;
}

const cityHubs: CityHub[] = [
  { id: "delhi", name: "Delhi NCR", dispatchTime: "45 mins", cliniciansOnline: 14, activeZone: "South Ext, Gurgaon & Noida" },
  { id: "bengaluru", name: "Bengaluru", dispatchTime: "40 mins", cliniciansOnline: 11, activeZone: "Indiranagar, Koramangala & Whitefield" },
  { id: "mumbai", name: "Mumbai", dispatchTime: "42 mins", cliniciansOnline: 12, activeZone: "Bandra, BKC & South Mumbai" },
  { id: "hyderabad", name: "Hyderabad", dispatchTime: "50 mins", cliniciansOnline: 8, activeZone: "Jubilee Hills & Hitec City" },
];

const specialties = [
  {
    id: "nursing",
    name: "Skilled Nursing",
    sub: "IV therapy, sterile wound dressing & catheter care",
    price: "₹1,499",
    tag: "Hospital Grade",
    duration: "45–60 mins",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
  },
  {
    id: "therapy",
    name: "Physical Therapy",
    sub: "Neuro rehab, ortho mobilization & post-fracture",
    price: "₹1,900",
    tag: "BPT Certified",
    duration: "60 mins",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "postop",
    name: "Post-Surgical Care",
    sub: "Drain care, suture monitoring & vitals telemetry",
    price: "₹2,499",
    tag: "ICU Standard",
    duration: "60–90 mins",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: "wellness",
    name: "Elder Wellness Check",
    sub: "12-lead ECG, blood glucose, fall-risk & companion",
    price: "₹1,299",
    tag: "Preventive Care",
    duration: "45 mins",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeHub = cityHubs.find((c) => c.id === selectedCity) || cityHubs[0];
  const activeSpec = specialties.find((s) => s.id === selectedSpecialty) || specialties[0];

  // Interactive 3D Medical Radar Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 650;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes simulating clinical telemetry network
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
    const nodeCount = Math.min(28, Math.floor(width / 45));

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar focal coordinate center
      const centerX = width * 0.82;
      const centerY = height * 0.38;

      // Draw subtle radar sweep pulse
      angle += 0.008;
      const radarRadius = Math.min(width * 0.25, 220);

      // Concentric telemetry rings
      for (let r = 50; r <= radarRadius; r += 55) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(16, 185, 129, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Rotating radar beam
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      const gradient = ctx.createLinearGradient(0, 0, radarRadius, 0);
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radarRadius, -0.25, 0);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // Draw connected telemetry nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${node.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* Interactive Medical Telemetry Canvas */}
      <canvas
        ref={canvasRef}
        className="hero-radar-canvas"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.85,
        }}
        aria-hidden="true"
      />

      <div className="hero-grid" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-intro">
          <div className="eyebrow fade-in">
            <span className="live-dot" />
            <span>NABH Aligned Clinical Protocol</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>ABHA Digital Health Connected</span>
          </div>

          <h1 id="hero-title" className="fade-in delay-1">
            Hospital-Grade Clinical Care, <em>Restored at Your Doorstep.</em>
          </h1>

          <p className="hero-description fade-in delay-2">
            Verified Registered Nurses (B.Sc / GNM) and Certified Physiotherapists dispatched to your home. Single-use sterile kits, transparent INR pricing, and continuous physician oversight.
          </p>

          {/* Quick Credential Badges */}
          <div className="hero-trust-badges fade-in delay-2" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
            <span style={styles.trustPill}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>100% NMC & INC Registered Clinicians</span>
            </span>
            <span style={styles.trustPill}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Avg {activeHub.dispatchTime} Doorstep Arrival</span>
            </span>
            <span style={styles.trustPill}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tamper-Sealed Consumable Kits</span>
            </span>
          </div>
        </div>

        {/* Live Dispatch Window Radar Aside */}
        <aside className="hero-aside fade-in delay-3" aria-label="Live dispatch status">
          <span className="aside-label">Live Dispatch Window</span>
          <span className="aside-big">{activeHub.name} · {activeHub.dispatchTime}</span>
          <p className="aside-caption">
            <strong>{activeHub.cliniciansOnline} licensed practitioners</strong> on active dispatch across {activeHub.activeZone}.
          </p>
        </aside>
      </div>

      {/* Direct Interactive Care Dispatch Console */}
      <section id="care-console" className="booking-console" aria-labelledby="booking-title" style={{ position: "relative", zIndex: 3 }}>
        <div className="console-top">
          <div>
            <p className="console-kicker">Live Care Dispatch Console</p>
            <h2 id="booking-title" className="console-title">Configure your in-home clinical visit</h2>
          </div>

          {/* City Hub Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginRight: "4px" }}>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-display)" }}>{specialty.price}</span>
                  <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>{specialty.duration}</span>
                </div>
                <span className="selection-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="3">
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
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", marginRight: "6px" }}>
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

          <div className="hero-btn-group" style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ marginRight: "10px" }}>
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em" }}>
                Total Visit Fee
              </div>
              <div style={{ fontSize: "19px", fontWeight: 800, color: "#f8fafc", fontFamily: "var(--font-display)" }}>
                {activeSpec.price} <span style={{ fontSize: "11px", fontWeight: 600, color: "#34d399" }}>incl. GST</span>
              </div>
            </div>

            <Link
              href={`/services?specialty=${selectedSpecialty}&city=${selectedCity}`}
              className="shimmer-button book-button"
            >
              <span>Schedule {activeSpec.name}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
    gap: "7px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#cbd5e1",
    padding: "6px 12px",
    borderRadius: "999px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  cityChip: {
    padding: "6px 14px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#94a3b8",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  cityChipActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    color: "#a7f3d0",
    borderColor: "rgba(52, 211, 153, 0.5)",
    boxShadow: "0 0 16px rgba(16, 185, 129, 0.25)",
  },
  cardTag: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#a7f3d0",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "3px 8px",
    borderRadius: "6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 18px",
    minHeight: "44px",
    borderRadius: "999px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    transition: "all 0.18s ease",
  },
};
