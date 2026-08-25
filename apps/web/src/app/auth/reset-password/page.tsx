"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Please provide a valid password reset token.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/customers/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: token.trim(),
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Password reset failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
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

        <h1 style={styles.title}>Set New Password</h1>
        <p style={styles.subtitle}>Create a strong, unique password for your healthcare account</p>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        {success ? (
          <div>
            <div style={styles.success}>
              Your password has been successfully reset! Redirecting to sign in...
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
              <span>Proceed to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {!tokenFromUrl && (
              <div style={styles.field}>
                <label htmlFor="token" style={styles.label}>
                  Reset Token
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
                  placeholder="Paste your 64-character reset token"
                />
              </div>
            )}

            <div style={styles.field}>
              <label htmlFor="newPassword" style={styles.label}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                style={styles.input}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
                autoComplete="new-password"
                placeholder="Re-enter your new password"
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
              <span>{loading ? "Updating password..." : "Update Password"}</span>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div style={{ color: "#94a3b8", textAlign: "center", padding: "80px 20px" }} role="status">
          Loading password reset portal...
        </div>
      }
    >
      <ResetPasswordForm />
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
