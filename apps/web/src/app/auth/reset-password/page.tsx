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
              style={styles.submitBtn}
            >
              <span>{loading ? "Updating password..." : "Update Password →"}</span>
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
        <div style={{ color: "#64748b", textAlign: "center", padding: "80px 20px" }} role="status">
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
    gap: "1.25rem",
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
