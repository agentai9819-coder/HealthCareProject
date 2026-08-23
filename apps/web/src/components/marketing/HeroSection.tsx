"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cinematic 3D Glowing Amber Energy Wave (Superpower-inspired)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 700);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 700;
    };

    window.addEventListener("resize", handleResize);

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      t += 0.012;

      // Draw flowing multi-layer luminous amber spline curves
      const curves = [
        { color: "rgba(255, 107, 44, 0.4)", width: 3, freq: 0.002, speed: 0.8, amp: 90, phase: 0 },
        { color: "rgba(245, 158, 11, 0.25)", width: 2, freq: 0.003, speed: 1.2, amp: 120, phase: 1.5 },
        { color: "rgba(251, 191, 36, 0.15)", width: 1.5, freq: 0.0015, speed: 0.6, amp: 70, phase: 3 },
      ];

      curves.forEach((c) => {
        ctx.beginPath();
        const startY = height * 0.55;

        for (let x = 0; x <= width; x += 15) {
          const y = startY + Math.sin(x * c.freq + t * c.speed + c.phase) * c.amp + Math.cos(x * 0.001 - t * 0.5) * 40;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = c.color;
        ctx.lineWidth = c.width;
        ctx.shadowColor = "rgba(255, 107, 44, 0.8)";
        ctx.shadowBlur = 25;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="sp-hero" aria-labelledby="hero-title">
      {/* 3D Glowing Amber Ribbon Background */}
      <canvas
        ref={canvasRef}
        className="sp-energy-canvas"
        aria-hidden="true"
      />

      <div className="sp-hero-container">
        {/* Subtle Pill Tag */}
        <div className="sp-badge fade-in">
          <span className="sp-beacon-dot" />
          <span>NABH Aligned In-Home Clinical Care</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span>Delhi NCR · Mumbai · Bengaluru · Hyderabad</span>
        </div>

        {/* Cinematic Main Headline */}
        <h1 id="hero-title" className="sp-title fade-in delay-1">
          The Next Era of Hospital Care, <br />
          <span className="sp-gradient-text">Delivered to Your Home.</span>
        </h1>

        {/* Clean, Reassuring Subtitle */}
        <p className="sp-subtitle fade-in delay-2">
          Verified Registered Nurses and Certified Physiotherapists dispatched to your doorstep. Hospital-grade sterile kits, transparent INR pricing, and real-time physician oversight.
        </p>

        {/* Clean 2-Button Action Bar */}
        <div className="sp-action-group fade-in delay-3">
          <Link href="#care-guide" className="sp-btn-primary">
            <span>Explore Clinical Programs</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <Link href="#care-finder" className="sp-btn-secondary">
            <span>Care Match Assessment (1 Min)</span>
          </Link>
        </div>

        {/* Minimalist Trust Ribbon */}
        <div className="sp-trust-ribbon fade-in delay-3">
          <div className="sp-trust-item">
            <strong>100% Verified</strong>
            <span>NMC & INC Registered Nurses</span>
          </div>
          <div className="sp-trust-sep" />
          <div className="sp-trust-item">
            <strong>Avg 45 Mins</strong>
            <span>Rapid Doorstep Dispatch</span>
          </div>
          <div className="sp-trust-sep" />
          <div className="sp-trust-item">
            <strong>Single-Use Kits</strong>
            <span>Tamper-Sealed Bedside Consumables</span>
          </div>
          <div className="sp-trust-sep" />
          <div className="sp-trust-item">
            <strong>ABHA & DISHA</strong>
            <span>Encrypted Health Privacy</span>
          </div>
        </div>
      </div>
    </section>
  );
}
