"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE } from "../lib/api";

interface StaffMe {
  id: string;
  name: string;
  email: string;
  role: "STAFF" | "ADMIN";
}

export function PortalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMe | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/staff/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setStaff(data.data);
        } else {
          setStaff(null);
        }
      })
      .catch(() => setStaff(null));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/staff/logout`, {
        method: "POST",
        credentials: "include",
      });
      setStaff(null);
      router.push("/staff/login");
    } catch (err) {
      console.error("Staff logout error:", err);
    }
  };

  const isAdmin = staff?.role === "ADMIN";

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.left}>
          <Link href={isAdmin ? "/admin/dispatch" : "/staff/schedule"} style={styles.brand}>
            <div style={styles.logoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <span style={styles.brandName}>HomeCare Operations</span>
          </Link>

          {staff && (
            <nav style={styles.nav}>
              {isAdmin ? (
                <>
                  <Link
                    href="/admin/dispatch"
                    style={{
                      ...styles.navLink,
                      ...(pathname.startsWith("/admin/dispatch") ? styles.navLinkActive : {}),
                    }}
                  >
                    Dispatch Hub
                  </Link>
                  <Link
                    href="/admin/staff"
                    style={{
                      ...styles.navLink,
                      ...(pathname.startsWith("/admin/staff") ? styles.navLinkActive : {}),
                    }}
                  >
                    Staff Directory
                  </Link>
                </>
              ) : (
                <Link
                  href="/staff/schedule"
                  style={{
                    ...styles.navLink,
                    ...(pathname.startsWith("/staff/schedule") ? styles.navLinkActive : {}),
                  }}
                >
                  My Daily Schedule
                </Link>
              )}
            </nav>
          )}
        </div>

        <div style={styles.right}>
          {staff ? (
            <div style={styles.authGroup}>
              <span style={styles.userBadge}>
                {staff.name} ({staff.role})
              </span>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Log Out
              </button>
            </div>
          ) : (
            <Link href="/" style={styles.publicSiteLink}>
              ← Public Website
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    borderBottom: "1px solid #1e293b",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0.625rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "1.125rem",
  },
  logoIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    letterSpacing: "-0.025em",
    fontWeight: 700,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  navLink: {
    textDecoration: "none",
    color: "#94a3b8",
    fontWeight: 500,
    fontSize: "0.875rem",
    padding: "0.35rem 0.65rem",
    borderRadius: "6px",
    transition: "color 0.15s",
  },
  navLinkActive: {
    color: "#2dd4bf",
    backgroundColor: "#1e293b",
    fontWeight: 600,
  },
  right: {
    display: "flex",
    alignItems: "center",
  },
  authGroup: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userBadge: {
    fontSize: "0.8125rem",
    color: "#cbd5e1",
    backgroundColor: "#1e293b",
    padding: "0.3rem 0.65rem",
    borderRadius: "6px",
  },
  logoutButton: {
    padding: "0.35rem 0.75rem",
    backgroundColor: "#334155",
    border: "none",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "0.8125rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  publicSiteLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.8125rem",
  },
};
