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

      // Emit high-speed micro sparks only during fast movement over open space
      if (!isHoveringInteractive && Math.random() > 0.4 && particles.length < 20) {
        const speed = Math.random() * 2 + 0.5;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.06 + 0.04, // Fast clean decay
          size: Math.random() * 1.8 + 1,
          color: "255, 107, 44",
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
          target.closest("[role='button']") ||
          target.closest(".sp-btn-primary") ||
          target.closest(".light-book-btn");

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
      // Snappy high-frequency lerp (0.35 speed for immediate response)
      ringX += (mouseX - ringX) * 0.35;
      ringY += (mouseY - ringY) * 0.35;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      // Render lightweight ambient glow and sparks
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient background aura (never overlays buttons)
      if (mouseX > 0 && mouseY > 0 && !isHoveringInteractive) {
        const aura = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 140);
        aura.addColorStop(0, "rgba(255, 107, 44, 0.06)");
        aura.addColorStop(0.6, "rgba(251, 191, 36, 0.015)");
        aura.addColorStop(1, "rgba(255, 107, 44, 0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 140, 0, Math.PI * 2);
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
        ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.8})`;
        ctx.fill();
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
      {/* 1. Ambient Particle & Aura Canvas (Background Layer) */}
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

      {/* 2. Instant 0ms Core Laser Dot (Zero Lag, Perfectly Centered) */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovered ? "4px" : "6px",
          height: isHovered ? "4px" : "6px",
          marginLeft: isHovered ? "-2px" : "-3px",
          marginTop: isHovered ? "-2px" : "-3px",
          backgroundColor: "#ff6b2c",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          boxShadow: isHovered ? "0 0 6px #ff6b2c" : "0 0 10px #ff6b2c, 0 0 16px #fbbf24",
          opacity: isVisible ? 1 : 0,
          transition: "width 0.15s ease, height 0.15s ease, margin 0.15s ease, opacity 0.2s ease",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      {/* 3. Creative Precision Reticle Ring (100% Crystal-Clear, ZERO Blur, ZERO Text Obstruction) */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          // Over buttons: contracts into a sharp 18px precision ring; in open space: 34px smooth halo
          width: isHovered ? "18px" : "34px",
          height: isHovered ? "18px" : "34px",
          borderRadius: "50%",
          // 100% Transparent interior with NO backdrop blur at all!
          backgroundColor: "transparent",
          backdropFilter: "none",
          border: isHovered
            ? "1.5px solid #ff6b2c"
            : "1px solid rgba(255, 107, 44, 0.4)",
          boxShadow: isHovered
            ? "0 0 12px rgba(255, 107, 44, 0.5), inset 0 0 6px rgba(255, 107, 44, 0.25)"
            : "0 0 8px rgba(255, 107, 44, 0.15)",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: "width 0.18s cubic-bezier(0.16, 1, 0.3, 1), height 0.18s cubic-bezier(0.16, 1, 0.3, 1), border 0.18s ease, box-shadow 0.18s ease, opacity 0.2s ease",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
    </>
  );
}
