"use client";

import { useState, Suspense } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/customers/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to process request");
        return;
      }

      setMessage(
        data.message ||
          "If an account exists with this email, password reset instructions have been sent."
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.headerBadge}>
          <span className="live-dot" />
          <span>Security & Account Recovery</span>
        </div>

        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>
          Enter your registered email address and we'll send you a secure 15-minute password reset link.
        </p>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        {message ? (
          <div>
            <div style={styles.success}>{message}</div>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Please check your inbox (and spam folder) for the verification link. The link expires in 15 minutes for your clinical data protection.
            </p>
            <Link
              href="/auth/login"
              className="shimmer-button"
              style={{
                width: "100%",
                justifyContent: "center",
                display: "inline-flex",
                minHeight: "44px",
              }}
            >
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label htmlFor="email" style={styles.label}>
                Registered Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                style={styles.input}
                autoComplete="email"
                placeholder="name@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="shimmer-button"
              style={{
                minHeight: "46px",
                width: "100%",
                marginTop: "8px",
                fontSize: "14px",
              }}
            >
              <span>{loading ? "Sending reset link..." : "Send Reset Link"}</span>
            </button>
          </form>
        )}

        <p style={styles.footer}>
          Remember your password?{" "}
          <Link href="/auth/login" style={styles.link}>
            Back to Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div style={{ color: "#94a3b8", textAlign: "center", padding: "80px 20px" }}>
          Loading recovery portal...
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1.5rem 6rem 1.5rem",
    position: "relative",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "2.5rem",
    backgroundColor: "rgba(18, 30, 27, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
  },
  headerBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 12px",
    borderRadius: "999px",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    border: "1px solid rgba(52, 211, 153, 0.25)",
    color: "#a7f3d0",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  title: {
    margin: "0 0 0.5rem",
    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
    fontSize: "1.85rem",
    fontWeight: 800,
    color: "#f6f7f3",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    margin: "0 0 1.75rem",
    fontSize: "0.95rem",
    color: "#94a3b8",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#cbd5e1",
  },
  input: {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "10px",
    outline: "none",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#f8fafc",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  error: {
    padding: "0.75rem 1rem",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    color: "#fca5a5",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  success: {
    padding: "0.85rem 1rem",
    backgroundColor: "rgba(52, 211, 153, 0.12)",
    border: "1px solid rgba(52, 211, 153, 0.3)",
    borderRadius: "10px",
    color: "#a7f3d0",
    fontSize: "0.9rem",
    marginBottom: "1rem",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "1.75rem",
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#94a3b8",
  },
  link: {
    color: "#34d399",
    textDecoration: "none",
    fontWeight: 600,
  },
};
