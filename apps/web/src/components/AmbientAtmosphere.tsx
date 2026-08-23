"use client";

export function AmbientAtmosphere() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* Zero-repaint lightweight static ambient gradient backdrop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255, 107, 44, 0.08) 0%, rgba(251, 191, 36, 0.02) 40%, transparent 75%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
