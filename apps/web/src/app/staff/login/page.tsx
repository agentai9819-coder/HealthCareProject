"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

export default function StaffLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
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
      const res = await fetch(`${API_BASE}/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      if (data.data?.role === "admin") {
        router.push("/admin/dispatch");
      } else {
        router.push("/staff/schedule");
      }
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>
            <span className="live-dot" />
            <span>Clinical Staff & Admin Gateway</span>
          </div>
          <h1 style={styles.title}>Clinician Portal</h1>
          <p style={styles.subtitle}>
            Authorized clinical care team and operations access
          </p>
        </div>

        {error && (
          <div role="alert" style={styles.errorBanner}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Professional Clinical Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. nurse@springfield-health.org"
              required
              style={styles.input}
              autoComplete="email"
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
              placeholder="Enter your security credential"
              required
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="shimmer-button"
            style={{ width: "100%", minHeight: "46px", marginTop: "8px", fontSize: "14px" }}
          >
            <span>{loading ? "Authenticating..." : "Sign In to Operations"}</span>
          </button>
        </form>

        <div style={styles.footer}>
          <Link href="/auth/login" style={styles.customerLink}>
            ← Switch to Patient & Family Sign In
          </Link>
        </div>
      </div>
    </main>
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
    backgroundColor: "rgba(18, 30, 27, 0.8)",
    borderRadius: "24px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "2rem",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 12px",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    border: "1px solid rgba(52, 211, 153, 0.25)",
    color: "#a7f3d0",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
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
    margin: 0,
    fontSize: "0.95rem",
    color: "#94a3b8",
    lineHeight: 1.5,
  },
  errorBanner: {
    padding: "0.75rem 1rem",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    color: "#fca5a5",
    fontSize: "0.875rem",
    marginBottom: "1.25rem",
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
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    fontSize: "0.95rem",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#f8fafc",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  footer: {
    marginTop: "2rem",
    textAlign: "center" as const,
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    paddingTop: "1.25rem",
  },
  customerLink: {
    fontSize: "0.875rem",
    color: "#34d399",
    textDecoration: "none",
    fontWeight: 600,
  },
};
