"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Superpower 3D Glowing Amber Orbital Wave Engine with Depth Perspective & Interactive Parallax
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 750;
    };

    window.addEventListener("resize", handleResize);

    // Mouse Parallax
    let targetRotX = 0.25;
    let targetRotY = 0;
    let currentRotX = 0.25;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / width - 0.5;
      const ny = (e.clientY - rect.top) / height - 0.5;
      targetRotY = nx * 0.8;
      targetRotX = 0.25 + ny * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Generate 3D Ambient Starfield
    const stars: { x: number; y: number; z: number; size: number; alpha: number; speed: number }[] = [];
    const starCount = 180;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1400,
        y: (Math.random() - 0.5) * 800,
        z: (Math.random() - 0.5) * 1200,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        speed: (Math.random() * 0.4 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    let time = 0;
    const focalLength = 450;
    const cameraDistance = 550;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.015;
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      const centerX = width / 2;
      const centerY = height * 0.52;

      // 1. Draw 3D Ambient Stars with Depth
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= star.speed;
        if (star.z < -600) star.z = 600;
        if (star.z > 600) star.z = -600;

        // Apply rotation
        const cosY = Math.cos(currentRotY * 0.3);
        const sinY = Math.sin(currentRotY * 0.3);
        const rx = star.x * cosY - star.z * sinY;
        const rz = star.x * sinY + star.z * cosY;

        const scale = focalLength / (cameraDistance + rz);
        if (scale > 0) {
          const sx = centerX + rx * scale;
          const sy = centerY + star.y * scale;

          if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
            const starAlpha = Math.min(1, Math.max(0.1, (star.alpha * scale * 1.5)));
            ctx.beginPath();
            ctx.arc(sx, sy, Math.max(0.6, star.size * scale), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 180, 100, ${starAlpha * 0.6})`;
            ctx.fill();
          }
        }
      }

      // 2. Render 3D Helical Amber Ribbon (Superpower Longevity Wave)
      const numRings = 3;
      const steps = 140;

      for (let r = 0; r < numRings; r++) {
        const ribbonPoints: { sx: number; sy: number; z: number; alpha: number; scale: number }[] = [];
        const ringOffset = (r * Math.PI * 2) / numRings;
        const radiusX = 360 + r * 30;
        const radiusY = 120 + r * 15;
        const radiusZ = 280 + r * 20;

        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2 + time * 0.8 + ringOffset;
          const wave = Math.sin(theta * 3 + time * 1.5) * 45;

          // 3D Point in space
          const px = Math.cos(theta) * radiusX;
          const py = Math.sin(theta * 2 + time * 0.5) * 35 + Math.sin(theta) * radiusY + wave;
          const pz = Math.sin(theta) * radiusZ;

          // Rotate 3D point around X and Y axes
          const cosX = Math.cos(currentRotX);
          const sinX = Math.sin(currentRotX);
          const cosY = Math.cos(currentRotY);
          const sinY = Math.sin(currentRotY);

          // Y-axis rotation
          const x1 = px * cosY - pz * sinY;
          const z1 = px * sinY + pz * cosY;

          // X-axis rotation
          const y2 = py * cosX - z1 * sinX;
          const z2 = py * sinX + z1 * cosX;

          // 3D Perspective Projection
          const scale = focalLength / (cameraDistance + z2);
          const sx = centerX + x1 * scale;
          const sy = centerY + y2 * scale;

          // Depth-based brightness
          const depthNorm = (z2 + 350) / 700; // 0 = back, 1 = front
          const alpha = Math.max(0.08, Math.min(0.95, depthNorm * 0.9));

          ribbonPoints.push({ sx, sy, z: z2, alpha, scale });
        }

        // Draw Continuous Glowing Spline Line
        ctx.beginPath();
        for (let i = 0; i < ribbonPoints.length; i++) {
          const pt = ribbonPoints[i];
          if (i === 0) {
            ctx.moveTo(pt.sx, pt.sy);
          } else {
            ctx.lineTo(pt.sx, pt.sy);
          }
        }

        const ribbonGradient = ctx.createLinearGradient(centerX - 300, 0, centerX + 300, 0);
        ribbonGradient.addColorStop(0, "rgba(255, 107, 44, 0.1)");
        ribbonGradient.addColorStop(0.5, "rgba(255, 140, 50, 0.85)");
        ribbonGradient.addColorStop(1, "rgba(251, 191, 36, 0.2)");

        ctx.strokeStyle = ribbonGradient;
        ctx.lineWidth = r === 0 ? 3.5 : 1.8;
        ctx.shadowColor = "rgba(255, 107, 44, 0.85)";
        ctx.shadowBlur = r === 0 ? 28 : 14;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Luminous 3D Particle Beads along the Ribbon
        for (let i = 0; i < ribbonPoints.length; i += 7) {
          const pt = ribbonPoints[i];
          const isFront = pt.z > 0;
          const beadSize = (isFront ? 3.2 : 1.6) * pt.scale;

          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, beadSize, 0, Math.PI * 2);
          ctx.fillStyle = isFront
            ? `rgba(255, 220, 150, ${pt.alpha})`
            : `rgba(255, 107, 44, ${pt.alpha * 0.6})`;
          ctx.shadowColor = "rgba(255, 107, 44, 1)";
          ctx.shadowBlur = isFront ? 16 : 4;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="sp-hero" aria-labelledby="hero-title">
      {/* 3D Interactive Glowing Amber Orbit Canvas */}
      <canvas
        ref={canvasRef}
        className="sp-3d-canvas"
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
