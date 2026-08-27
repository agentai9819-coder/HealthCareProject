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
              Your email address has been successfully verified! You can now access your full clinical account.
            </div>
            <Link
              href="/auth/login"
              style={styles.submitBtn}
            >
              <span>Continue to Sign In →</span>
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
                  style={styles.submitBtn}
                >
                  <span>{loading ? "Verifying..." : "Verify Email Token →"}</span>
                </button>
              </form>
            )}

            {tokenFromUrl && loading && (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#252b61", fontWeight: 600 }}>
                Verifying your clinical security token...
              </div>
            )}

            <div style={{ marginTop: "2rem", borderTop: "1.5px solid #f1f5f9", paddingTop: "1.5rem" }}>
              <h2 style={{ fontSize: "1rem", color: "#252b61", marginBottom: "0.4rem", fontWeight: 700 }}>
                Need a new verification link?
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
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
                  style={{
                    minHeight: "44px",
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: 700,
                    borderRadius: "14px",
                    backgroundColor: "#f1f5f9",
                    color: "#252b61",
                    border: "1.5px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
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
        <div style={{ color: "#64748b", textAlign: "center", padding: "80px 20px" }} role="status">
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
    minHeight: "85vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1.5rem 6rem 1.5rem",
    backgroundColor: "#f8fafc",
    backgroundImage: "radial-gradient(at 50% 0%, rgba(37, 43, 97, 0.05) 0px, transparent 60%)",
    position: "relative",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "2.75rem 2.5rem",
    backgroundColor: "#ffffff",
    border: "1.5px solid #eef2f6",
    borderRadius: "28px",
    boxShadow: "0 20px 45px -12px rgba(37, 43, 97, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)",
  },
  headerBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "999px",
    backgroundColor: "rgba(37, 43, 97, 0.06)",
    border: "1px solid rgba(37, 43, 97, 0.12)",
    color: "#252b61",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: "18px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#ff6b2c",
    display: "inline-block",
  },
  title: {
    margin: "0 0 0.4rem",
    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
    fontSize: "2rem",
    fontWeight: 800,
    color: "#252b61",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    margin: "0 0 1.75rem",
    fontSize: "0.95rem",
    color: "#64748b",
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
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#1e293b",
  },
  input: {
    padding: "0.85rem 1rem",
    fontSize: "0.95rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background-color 0.2s",
  },
  submitBtn: {
    minHeight: "48px",
    width: "100%",
    marginTop: "8px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#ffffff",
    background: "linear-gradient(135deg, #ff6b2c 0%, #ff5500 100%)",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 8px 20px -4px rgba(255, 107, 44, 0.35)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  error: {
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "12px",
    color: "#b91c1c",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  success: {
    padding: "0.85rem 1rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #dcfce7",
    borderRadius: "12px",
    color: "#15803d",
    fontSize: "0.9rem",
    marginBottom: "1.25rem",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "1.75rem",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#64748b",
  },
  link: {
    color: "#ff6b2c",
    textDecoration: "none",
    fontWeight: 700,
  },
};
