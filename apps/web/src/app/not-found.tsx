import Link from "next/link";

export const metadata = {
  title: "404 — Clinical Page Not Found | Veridian Care",
  description: "The requested clinical page could not be located in our healthcare network.",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "540px",
          width: "100%",
          textAlign: "center",
          padding: "48px 36px",
          backgroundColor: "rgba(18, 30, 27, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "20px",
          }}
        >
          <span>Error 404</span>
          <span>•</span>
          <span>Route Unresolved</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display, 'Outfit', sans-serif)",
            fontSize: "clamp(32px, 5vw, 44px)",
            fontWeight: 800,
            color: "#f6f7f3",
            lineHeight: 1.15,
            letterSpacing: "-0.04em",
            margin: "0 0 16px 0",
          }}
        >
          Clinical Destination Not Found
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "15px",
            lineHeight: 1.6,
            margin: "0 0 32px 0",
          }}
        >
          The page or care record you are trying to reach is unavailable or has been relocated within our clinical observatory.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            className="shimmer-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 24px",
              minHeight: "46px",
              borderRadius: "999px",
              color: "#052e16",
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0 20px",
              minHeight: "46px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "#f6f7f3",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <span>View Services Hub</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
