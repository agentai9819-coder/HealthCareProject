"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on desktop/devices with a mouse cursor
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse coordinates & lerped trail
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 150);

      // Add dynamic micro spark particles on movement
      if (Math.random() > 0.4 && particles.length < 35) {
        particles.push({
          x: targetX + (Math.random() - 0.5) * 16,
          y: targetY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 1,
          decay: Math.random() * 0.03 + 0.02,
          size: Math.random() * 2.5 + 1,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const particles: { x: number; y: number; vx: number; vy: number; life: number; decay: number; size: number }[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp towards cursor
      mouseX += (targetX - mouseX) * 0.14;
      mouseY += (targetY - mouseY) * 0.14;

      // 1. Draw Subtle Ambient Spotlight Aura around Cursor
      const auraGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 280);
      auraGradient.addColorStop(0, "rgba(255, 107, 44, 0.12)");
      auraGradient.addColorStop(0.35, "rgba(245, 158, 11, 0.05)");
      auraGradient.addColorStop(0.7, "rgba(251, 191, 36, 0.015)");
      auraGradient.addColorStop(1, "rgba(255, 107, 44, 0)");

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 280, 0, Math.PI * 2);
      ctx.fillStyle = auraGradient;
      ctx.fill();

      // 2. Draw Subtle Core Halo Ring
      const coreGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 35);
      coreGradient.addColorStop(0, "rgba(255, 140, 60, 0.25)");
      coreGradient.addColorStop(1, "rgba(255, 107, 44, 0)");

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 35, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // 3. Render and Update Trailing Spark Particles
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
        ctx.fillStyle = `rgba(255, 180, 90, ${p.life * 0.8})`;
        ctx.shadowColor = "rgba(255, 107, 44, 0.9)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(moveTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,
      }}
      aria-hidden="true"
    />
  );
}
