"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

const ALLOWED_RETURN_PREFIXES = [
  "/booking/confirm",
  "/booking/select-slot",
  "/services",
  "/bookings",
];

function getSafeReturnUrl(rawUrl: string | null): string {
  if (!rawUrl) return "/services";
  try {
    const decoded = decodeURIComponent(rawUrl);
    if (!decoded.startsWith("/") || decoded.startsWith("//")) {
      return "/services";
    }
    const path = decoded.split("?")[0];
    const isAllowed = ALLOWED_RETURN_PREFIXES.some((prefix) => path === prefix);
    return isAllowed ? decoded : "/services";
  } catch {
    return "/services";
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const [formData, setFormData] = useState({ identifier: "", password: "" });
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
      const res = await fetch(`${API_BASE}/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const target = getSafeReturnUrl(returnUrl);
      router.push(target);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const registerLink = returnUrl
    ? `/auth/register?returnUrl=${encodeURIComponent(returnUrl)}`
    : "/auth/register";

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.headerBadge}>
          <span className="live-dot" />
          <span>Patient & Family Access</span>
        </div>

        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>Access your home healthcare bookings & records</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div role="alert" style={styles.error}>{error}</div>}

          <div style={styles.field}>
            <label htmlFor="identifier" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="email"
              placeholder="name@example.com"
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="shimmer-button" style={{ minHeight: "46px", width: "100%", marginTop: "8px", fontSize: "14px" }}>
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link href={registerLink} style={styles.link}>
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ color: "#94a3b8", textAlign: "center", padding: "80px 20px" }}>Loading sign in portal...</div>}>
      <LoginForm />
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
    marginBottom: "0.5rem",
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