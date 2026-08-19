"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.data.staff.role === "ADMIN") {
          router.push("/admin/dispatch");
        } else {
          router.push("/staff/schedule");
        }
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>Healthcare Staff Portal</div>
          <h1 style={styles.title}>Staff & Operations Sign In</h1>
          <p style={styles.subtitle}>
            Sign in to access your visit schedule, clinical execution, or operations dispatch.
          </p>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Staff Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="caregiver@healthcare.local"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Signing in..." : "Sign In to Staff Portal"}
          </button>
        </form>

        <div style={styles.footer}>
          <Link href="/auth/login" style={styles.customerLink}>
            ← Switch to Customer Portal Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdfa",
    padding: "1.5rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 10px 25px -5px rgba(15, 118, 110, 0.1), 0 8px 10px -6px rgba(15, 118, 110, 0.05)",
    border: "1px solid #ccfbf1",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "2rem",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.75rem",
  },
  title: {
    margin: "0 0 0.5rem",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#134e4a",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.875rem",
    color: "#5eead4",
    lineHeight: 1.5,
  },
  errorBanner: {
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#1e293b",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  submitButton: {
    padding: "0.875rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "0.5rem",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  footer: {
    marginTop: "2rem",
    textAlign: "center" as const,
    borderTop: "1px solid #f1f5f9",
    paddingTop: "1.25rem",
  },
  customerLink: {
    fontSize: "0.875rem",
    color: "#0f766e",
    textDecoration: "none",
    fontWeight: 500,
  },
};
