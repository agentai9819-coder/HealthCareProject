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
          <span style={styles.badgeDot} />
          <span>Patient & Family Access</span>
        </div>

        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>Access your home healthcare bookings & clinical records</p>

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <Link href="/auth/forgot-password" style={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>
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

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            <span>{loading ? "Signing in..." : "Sign In to Portal →"}</span>
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
    <Suspense fallback={<div style={{ color: "#64748b", textAlign: "center", padding: "80px 20px" }} role="status">Loading sign in portal...</div>}>
      <LoginForm />
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
  forgotLink: {
    fontSize: "0.825rem",
    color: "#252b61",
    textDecoration: "none",
    fontWeight: 600,
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
  },
  error: {
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "12px",
    color: "#b91c1c",
    fontSize: "0.875rem",
    marginBottom: "0.5rem",
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