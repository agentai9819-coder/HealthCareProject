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
            <span>Delhi NCR & Metro clinical network online</span>
          </div>
          <a className="hotline" href="tel:+911140506070" aria-label="Call clinical support at +91 11 4050 6070">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Clinical support: +91 (11) 4050-6070</span>
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

          {/* Desktop Navigation Links */}
          <nav className="nav-links desktop-nav" aria-label="Primary navigation">
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

          {/* Desktop Auth & CTAs */}
          <div className="desktop-auth" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2.5">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </header>

        {/* Mobile Slide-Down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div className="mobile-drawer-content">
              <nav className="mobile-nav-links">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`mobile-nav-item ${isActive ? "active" : ""}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  );
                })}
              </nav>

              <div className="mobile-drawer-divider" />

              <div className="mobile-drawer-auth">
                {customer ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                      <span style={{ fontSize: "14px", color: "#94a3b8" }}>Signed in as:</span>
                      <Link
                        href="/account"
                        style={{ color: "#a7f3d0", fontWeight: 700, textDecoration: "none", fontSize: "14px" }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {getDisplayName(customer.name)}
                      </Link>
                    </div>
                    <Link
                      href="/bookings"
                      className="mobile-drawer-btn secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>My Bookings</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="mobile-drawer-btn logout"
                    >
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Link
                      href="/auth/login"
                      className="mobile-drawer-btn secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Patient Sign In</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="mobile-drawer-btn secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>Create Patient Account</span>
                    </Link>
                  </div>
                )}

                <Link
                  href="/services"
                  className="shimmer-button"
                  style={{ width: "100%", justifyContent: "center", minHeight: "46px", marginTop: "12px", fontSize: "14px" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Book In-Home Care</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <a
                  href="tel:+911140506070"
                  className="mobile-hotline-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Clinical Hotline: +91 (11) 4050-6070</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
