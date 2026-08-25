"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

function RegisterForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/customers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: { firstName: formData.firstName, lastName: formData.lastName },
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginLink = returnUrl
    ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
    : "/auth/login";

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.headerBadge}>
          <span className="live-dot" />
          <span>Patient & Family Portal</span>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register for private in-home healthcare services</p>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        {success ? (
          <div>
            <div style={styles.success}>
              Registration successful! You can now sign in to your clinical account.
            </div>
            <Link href={loginLink} className="shimmer-button" style={{ width: "100%", justifyContent: "center", display: "inline-flex", minHeight: "44px" }}>
              <span>Proceed to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <div style={styles.field}>
                <label htmlFor="firstName" style={styles.label}>
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  autoComplete="given-name"
                  placeholder="e.g. Jane"
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="lastName" style={styles.label}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  autoComplete="family-name"
                  placeholder="e.g. Smith"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                autoComplete="email"
                placeholder="jane.smith@example.com"
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
                autoComplete="new-password"
                placeholder="Re-enter password"
              />
            </div>

            <button type="submit" disabled={loading} className="shimmer-button" style={{ minHeight: "46px", width: "100%", marginTop: "8px", fontSize: "14px" }}>
              <span>{loading ? "Creating account..." : "Create Account"}</span>
            </button>
          </form>
        )}

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link href={loginLink} style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ color: "#94a3b8", textAlign: "center", padding: "80px 20px" }} role="status">Loading registration portal...</div>}>
      <RegisterForm />
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
    maxWidth: "460px",
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
    width: "100%",
    boxSizing: "border-box",
  },
  fieldGroup: {
    display: "flex",
    gap: "0.875rem",
    width: "100%",
    boxSizing: "border-box",
  },
  field: {
    flex: "1 1 0%",
    minWidth: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    boxSizing: "border-box",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#cbd5e1",
  },
  input: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "0.75rem 0.875rem",
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