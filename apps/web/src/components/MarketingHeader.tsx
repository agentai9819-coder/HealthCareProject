"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE } from "../lib/api";

interface CustomerMe {
  id: string;
  name: string | { firstName?: string; lastName?: string };
  email: string;
}

export function MarketingHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerMe | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 300);
    fetch(`${API_BASE}/customers/me`, { credentials: "include", signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCustomer(data.data);
        } else {
          setCustomer(null);
        }
      })
      .catch(() => setCustomer(null))
      .finally(() => clearTimeout(timer));

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/customers/logout`, {
        method: "POST",
        credentials: "include",
      });
      setCustomer(null);
      router.push("/auth/login");
    } catch (err) {
      console.error("Customer logout error:", err);
    }
  };

  const getDisplayName = (name: CustomerMe["name"]) => {
    if (!name) return "Account";
    if (typeof name === "string") return name.split(" ")[0] || "Account";
    return name.firstName || "Account";
  };

  const navLinks = [
    { href: "/services", label: "Care services" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/why-us", label: "Our clinicians" },
    { href: "/about", label: "About" },
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top Clinical Radar Dispatch Bar */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="status-line">
            <span className="live-dot" />
            <strong>Live dispatch radar</strong>
            <span>Springfield clinical network online</span>
          </div>
          <a className="hotline" href="tel:5550192834" aria-label="Call clinical support at 555 019 2834">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Clinical support (555) 019-2834</span>
          </a>
        </div>
      </div>

      {/* Floating Glassmorphic Navigation Header */}
      <div className="page-frame nav-wrap">
        <header className="nav-glass">
          <Link href="/" className="brand" aria-label="Veridian Care home">
            <div className="brand-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <span className="brand-copy">
              <b>VERIDIAN</b>
              <span>CARE</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive ? "active" : ""}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {customer ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link
                  href="/bookings"
                  style={{
                    color: "#10b981",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  My Bookings
                </Link>
                <Link
                  href="/account"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "#a7f3d0",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    textDecoration: "none",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {getDisplayName(customer.name)}
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link
                  href="/auth/login"
                  style={{
                    color: "#b9c3be",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "13px",
                    padding: "6px 10px",
                  }}
                >
                  Sign In
                </Link>
                <Link href="/services" className="shimmer-button">
                  <span>Book Care</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </header>
      </div>
    </>
  );
}
