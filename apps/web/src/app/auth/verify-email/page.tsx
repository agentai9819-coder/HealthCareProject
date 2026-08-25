"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [resendEmail, setResendEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (tokenToVerify: string) => {
    if (!tokenToVerify.trim()) {
      setError("Please provide a valid verification token.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/customers/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: tokenToVerify.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email verification failed");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenFromUrl) {
      handleVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResendSuccess("");
    setResending(true);

    try {
      const res = await fetch(`${API_BASE}/customers/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: resendEmail.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend verification link");
        return;
      }

      setResendSuccess(
        data.message || "If an account exists with this email, a verification link has been sent."
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.headerBadge}>
          <span className="live-dot" />
          <span>Patient Identity Verification</span>
        </div>

        <h1 style={styles.title}>Email Verification</h1>
        <p style={styles.subtitle}>
          Verify your email address to confirm your healthcare account and secure your appointments.
        </p>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        {success ? (
          <div>
            <div style={styles.success}>
              Your email address has been successfully verified! You have full access to your healthcare records.
            </div>
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
              <span>Continue to Sign In</span>
            </Link>
          </div>
        ) : (
          <div>
            {!tokenFromUrl && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify(token);
                }}
                style={styles.form}
              >
                <div style={styles.field}>
                  <label htmlFor="token" style={styles.label}>
                    Verification Token
                  </label>
                  <input
                    type="text"
                    id="token"
                    name="token"
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      setError("");
                    }}
                    required
                    style={styles.input}
                    placeholder="Enter your verification token"
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
                  <span>{loading ? "Verifying..." : "Verify Email"}</span>
                </button>
              </form>
            )}

            {tokenFromUrl && loading && (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#a7f3d0" }}>
                Verifying your email token...
              </div>
            )}

            <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
              <h2 style={{ fontSize: "1rem", color: "#f8fafc", marginBottom: "0.5rem", fontWeight: 700 }}>
                Need a new verification link?
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1rem" }}>
                Enter your email address to receive a fresh verification link.
              </p>

              {resendSuccess && (
                <div style={styles.success}>{resendSuccess}</div>
              )}

              <form onSubmit={handleResend} style={styles.form}>
                <div style={styles.field}>
                  <input
                    type="email"
                    name="resendEmail"
                    value={resendEmail}
                    onChange={(e) => {
                      setResendEmail(e.target.value);
                      setError("");
                      setResendSuccess("");
                    }}
                    required
                    style={styles.input}
                    placeholder="Registered email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resending}
                  className="secondary-button"
                  style={{
                    minHeight: "40px",
                    width: "100%",
                    fontSize: "13px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#f8fafc",
                    border: "1px solid rgba(255,255,255,0.15)",
                    cursor: "pointer",
                  }}
                >
                  {resending ? "Sending link..." : "Resend Verification Link"}
                </button>
              </form>
            </div>
          </div>
        )}

        <p style={styles.footer}>
          Already verified?{" "}
          <Link href="/auth/login" style={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ color: "#94a3b8", textAlign: "center", padding: "80px 20px", role: "status" }}>
          Loading email verification portal...
        </div>
      }
    >
      <VerifyEmailForm />
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
    gap: "1rem",
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
    marginBottom: "1.25rem",
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
