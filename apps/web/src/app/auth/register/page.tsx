"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register for home healthcare services</p>

        {success && (
          <div style={styles.success}>
            Registration successful!{" "}
            <a href={loginLink} style={styles.link}>
              Sign in
            </a>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.fieldGroup}>
              <div style={styles.field}>
                <label htmlFor="firstName" style={styles.label}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  autoComplete="given-name"
                />
              </div>
              <div style={styles.field}>
                <label htmlFor="lastName" style={styles.label}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                autoComplete="email"
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
                minLength={8}
                style={styles.input}
                autoComplete="new-password"
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        <p style={styles.footer}>
          Already have an account?{" "}
          <a href={loginLink} style={styles.link}>
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={styles.main}>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    backgroundColor: "#f5f7fa",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "2.5rem",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  title: {
    margin: "0 0 0.5rem",
    fontSize: "1.75rem",
    fontWeight: 600,
    color: "#1a2a3a",
  },
  subtitle: {
    margin: "0 0 2rem",
    fontSize: "1rem",
    color: "#5a6a7a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  fieldGroup: {
    display: "flex",
    gap: "1rem",
  },
  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#3a4a5a",
  },
  input: {
    padding: "0.625rem 0.875rem",
    fontSize: "1rem",
    border: "1px solid #d0d8e0",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "white",
  },
  error: {
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    fontSize: "0.875rem",
  },
  success: {
    padding: "0.75rem 1rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    color: "#166534",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "white",
    backgroundColor: "#2a7f8f",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  footer: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#5a6a7a",
  },
  link: {
    color: "#2a7f8f",
    textDecoration: "none",
    fontWeight: 500,
  },
};