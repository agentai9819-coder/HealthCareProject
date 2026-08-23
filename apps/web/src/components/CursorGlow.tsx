"use client";

import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop/devices with a precise mouse
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHoveringInteractive = false;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Direct 0ms GPU transform for inner laser dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Fast check for interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea") ||
          target.closest("[role='button']") ||
          target.closest(".sp-btn-primary") ||
          target.closest(".light-book-btn")
        );

        if (isClickable !== isHoveringInteractive) {
          isHoveringInteractive = isClickable;
          setIsHovered(isClickable);
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Fast GPU-interpolated ring loop (Zero Canvas, Pure Compositor Thread)
    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.38;
      ringY += (mouseY - ringY) * 0.38;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      animId = requestAnimationFrame(updateRing);
    };

    animId = requestAnimationFrame(updateRing);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      {/* 1. Instant 0ms Core Laser Dot (Zero Lag) */}
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

      {/* 2. Snappy Transparent Precision Reticle Ring (Zero Blur, Zero Lag, 100% Crisp) */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovered ? "18px" : "32px",
          height: isHovered ? "18px" : "32px",
          borderRadius: "50%",
          backgroundColor: "transparent",
          border: isHovered
            ? "1.5px solid #ff6b2c"
            : "1px solid rgba(255, 107, 44, 0.4)",
          boxShadow: isHovered
            ? "0 0 10px rgba(255, 107, 44, 0.5)"
            : "0 0 8px rgba(255, 107, 44, 0.15)",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: "width 0.15s cubic-bezier(0.16, 1, 0.3, 1), height 0.15s cubic-bezier(0.16, 1, 0.3, 1), border 0.15s ease, opacity 0.2s ease",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
    </>
  );
}
