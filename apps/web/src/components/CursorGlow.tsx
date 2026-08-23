"use client";

import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch desktop environments
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHoveringInteractive = false;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
      color: string;
    }[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant 0ms update for inner laser dot (zero lag)
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Emit high-speed sparks only during active movement
      if (Math.random() > 0.35 && particles.length < 24) {
        const speed = Math.random() * 2 + 0.5;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.05 + 0.03, // Fast clean decay
          size: Math.random() * 2.2 + 1.2,
          color: Math.random() > 0.3 ? "255, 107, 44" : "251, 191, 36",
        });
      }

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea") ||
          target.closest(".sp-card") ||
          target.closest(".service-catalog-row") ||
          target.closest("[role='button']");

        if (Boolean(isClickable) !== isHoveringInteractive) {
          isHoveringInteractive = Boolean(isClickable);
          setIsHovered(isHoveringInteractive);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let animationId: number;

    const renderLoop = () => {
      // Snappy high-frequency lerp (0.32 speed for immediate, elastic snap)
      ringX += (mouseX - ringX) * 0.32;
      ringY += (mouseY - ringY) * 0.32;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
        isHoveringInteractive ? 1.7 : 1
      })`;

      // Render lightweight high-speed sparks
      ctx.clearRect(0, 0, width, height);

      // Ambient subtle spotlight aura on canvas
      if (mouseX > 0 && mouseY > 0) {
        const aura = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 160);
        aura.addColorStop(0, "rgba(255, 107, 44, 0.08)");
        aura.addColorStop(0.5, "rgba(251, 191, 36, 0.02)");
        aura.addColorStop(1, "rgba(255, 107, 44, 0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.9})`;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(renderLoop);
    };

    animationId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      {/* 1. Hardware Accelerated Ambient Particle & Aura Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9997,
        }}
        aria-hidden="true"
      />

      {/* 2. Instant 0ms Core Laser Dot (Centered directly at cursor tip) */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          backgroundColor: "#ff6b2c",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          boxShadow: "0 0 10px #ff6b2c, 0 0 20px #fbbf24",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      {/* 3. Snappy Luxury Spring Follower Ring (Dynamic Hover Morph) */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovered ? "46px" : "34px",
          height: isHovered ? "46px" : "34px",
          borderRadius: "50%",
          border: isHovered
            ? "1.5px solid rgba(255, 107, 44, 0.9)"
            : "1px solid rgba(255, 180, 120, 0.5)",
          backgroundColor: isHovered
            ? "rgba(255, 107, 44, 0.1)"
            : "rgba(255, 107, 44, 0.02)",
          backdropFilter: isHovered ? "blur(2px)" : "none",
          pointerEvents: "none",
          zIndex: 9998,
          boxShadow: isHovered
            ? "0 0 24px rgba(255, 107, 44, 0.35), inset 0 0 12px rgba(255, 107, 44, 0.2)"
            : "0 0 12px rgba(255, 107, 44, 0.15)",
          opacity: isVisible ? 1 : 0,
          transition: "width 0.2s ease, height 0.2s ease, border 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
    </>
  );
}
