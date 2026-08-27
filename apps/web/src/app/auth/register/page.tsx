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
          <span style={styles.badgeDot} />
          <span>Patient & Family Portal</span>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register for verified in-home clinical care & records</p>

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
            <Link href={loginLink} style={styles.submitBtn}>
              <span>Proceed to Sign In →</span>
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

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              <span>{loading ? "Creating account..." : "Create Clinical Account →"}</span>
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
    <Suspense fallback={<div style={{ color: "#64748b", textAlign: "center", padding: "80px 20px" }} role="status">Loading registration portal...</div>}>
      <RegisterForm />
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
    maxWidth: "480px",
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
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#1e293b",
  },
  input: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
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