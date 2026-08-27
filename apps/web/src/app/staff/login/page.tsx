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
            <span style={styles.badgeDot} />
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
              placeholder="e.g. nurse@veridiancare.in"
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
            style={styles.submitBtn}
          >
            <span>{loading ? "Authenticating..." : "Sign In to Operations →"}</span>
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
  header: {
    textAlign: "center",
    marginBottom: "1.75rem",
  },
  badge: {
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
    marginBottom: "16px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#252b61",
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
    margin: 0,
    fontSize: "0.95rem",
    color: "#64748b",
    lineHeight: 1.5,
  },
  errorBanner: {
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "12px",
    color: "#b91c1c",
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
    background: "linear-gradient(135deg, #252b61 0%, #171a44 100%)",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 8px 20px -4px rgba(37, 43, 97, 0.35)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  footer: {
    marginTop: "2rem",
    textAlign: "center",
    borderTop: "1.5px solid #f1f5f9",
    paddingTop: "1.25rem",
  },
  customerLink: {
    fontSize: "0.875rem",
    color: "#ff6b2c",
    textDecoration: "none",
    fontWeight: 700,
  },
};
