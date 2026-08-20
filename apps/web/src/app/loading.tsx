export default function Loading() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid rgba(52, 211, 153, 0.15)",
          borderTopColor: "#34d399",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#94a3b8",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Loading Clinical Observatory...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
