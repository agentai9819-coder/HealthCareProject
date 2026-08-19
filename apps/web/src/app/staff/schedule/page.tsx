"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface StaffVisit {
  id: string;
  bookingId: string;
  status: string;
  customerName: string;
  customerEmail?: string | null;
  serviceName: string;
  serviceDuration: number;
  startTime: string;
  endTime: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  customerIntakeNotes?: string | null;
  hasElevatedAccess: boolean;
  enRouteAt?: string | null;
  inProgressAt?: string | null;
  completedAt?: string | null;
  customerSummary?: string | null;
}

interface StaffProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty?: string | null;
}

export default function StaffSchedulePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [visits, setVisits] = useState<StaffVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      // 1. Fetch Staff Me Profile
      const profileRes = await fetch(`${API_BASE}/staff/me`, { credentials: "include" });
      if (profileRes.status === 401 || profileRes.status === 403) {
        router.push("/staff/login");
        return;
      }
      const profileData = await profileRes.json();
      if (profileData.success) {
        setProfile(profileData.data);
      }

      // 2. Fetch Assigned Visits
      const visitsRes = await fetch(`${API_BASE}/staff/visits`, { credentials: "include" });
      const visitsData = await visitsRes.json();
      if (visitsData.success) {
        setVisits(visitsData.data || []);
      } else {
        setError(visitsData.error || "Failed to load visits schedule");
      }
    } catch {
      setError("Network error loading schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/staff/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/staff/login");
    } catch {
      router.push("/staff/login");
    }
  };

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const filteredVisits = visits.filter((v) => {
    if (statusFilter === "ALL") return true;
    return v.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return { label: "Confirmed", bg: "#dcfce7", color: "#166534" };
      case "EN_ROUTE":
        return { label: "En Route", bg: "#fef9c3", color: "#854d0e" };
      case "IN_PROGRESS":
        return { label: "In Progress", bg: "#e0e7ff", color: "#3730a3" };
      case "COMPLETED":
        return { label: "Completed", bg: "#dbeafe", color: "#1e40af" };
      case "CANCELLED":
        return { label: "Cancelled", bg: "#fee2e2", color: "#991b1b" };
      default:
        return { label: status, bg: "#f1f5f9", color: "#475569" };
    }
  };

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading schedule...</div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <span style={styles.headerBadge}>Caregiver Portal</span>
            <h1 style={styles.title}>Assigned Visits Schedule</h1>
            {profile && (
              <p style={styles.welcomeText}>
                Caregiver: <strong>{profile.name}</strong> ({profile.specialty || "General Care"}) • {profile.email}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {profile?.role === "ADMIN" && (
              <Link href="/admin/dispatch" style={styles.adminSwitchButton}>
                Operations Dispatch
              </Link>
            )}
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div style={styles.filterRow}>
          {["ALL", "CONFIRMED", "EN_ROUTE", "IN_PROGRESS", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                ...styles.filterPill,
                ...(statusFilter === st ? styles.filterPillActive : {}),
              }}
            >
              {st === "ALL" ? "All Visits" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </header>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.container}>
        {filteredVisits.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>
              No assigned visits matching this filter.
            </p>
            <p style={{ margin: "0.5rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>
              When operations dispatch assigns you to a home visit, it will appear here.
            </p>
          </div>
        ) : (
          <div style={styles.visitGrid}>
            {filteredVisits.map((visit) => {
              const badge = getStatusBadge(visit.status);

              return (
                <div key={visit.id} style={styles.visitCard}>
                  <div style={styles.cardHeader}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                        {formatDateTime(visit.startTime)}
                      </span>
                      <h2 style={styles.cardTitle}>{visit.serviceName}</h2>
                    </div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Patient:</span>
                      <span style={styles.infoValue}>
                        <strong>{visit.customerName}</strong>
                        {visit.customerEmail && ` (${visit.customerEmail})`}
                      </span>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Address:</span>
                      <span style={styles.infoValue}>
                        {visit.addressStreet}, {visit.addressCity}, {visit.addressState} {visit.addressPostalCode}
                      </span>
                    </div>

                    {visit.customerIntakeNotes && (
                      <div style={styles.intakeBox}>
                        <span style={styles.intakeLabel}>Intake Notes:</span>
                        <p style={styles.intakeText}>{visit.customerIntakeNotes}</p>
                      </div>
                    )}
                  </div>

                  <div style={styles.cardFooter}>
                    <Link href={`/staff/visits/${visit.id}`} style={styles.actionButton}>
                      {visit.status === "COMPLETED" ? "View Visit Record →" : "Execute Visit →"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "2rem",
  },
  header: {
    maxWidth: "1000px",
    margin: "0 auto 2rem",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
  },
  headerBadge: {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: "0.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  welcomeText: {
    margin: "0.25rem 0 0",
    fontSize: "0.875rem",
    color: "#64748b",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
  },
  adminSwitchButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#0f766e",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#ffffff",
    textDecoration: "none",
  },
  filterRow: {
    display: "flex",
    gap: "0.5rem",
    overflowX: "auto",
    paddingBottom: "0.5rem",
  },
  filterPill: {
    padding: "0.4rem 0.875rem",
    borderRadius: "9999px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: "#64748b",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  filterPillActive: {
    backgroundColor: "#0f766e",
    borderColor: "#0f766e",
    color: "#ffffff",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  errorBanner: {
    maxWidth: "1000px",
    margin: "0 auto 1.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    fontSize: "0.875rem",
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "3rem 2rem",
    textAlign: "center" as const,
    border: "1px solid #e2e8f0",
  },
  visitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.25rem",
  },
  visitCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    padding: "1.25rem",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    margin: "0.25rem 0 0",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  statusBadge: {
    padding: "0.25rem 0.625rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  cardBody: {
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    flex: 1,
  },
  infoRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.15rem",
    fontSize: "0.875rem",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  infoValue: {
    color: "#1e293b",
    lineHeight: 1.4,
  },
  intakeBox: {
    marginTop: "0.5rem",
    padding: "0.75rem",
    backgroundColor: "#f8fafc",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },
  intakeLabel: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#0f766e",
    textTransform: "uppercase",
    marginBottom: "0.25rem",
  },
  intakeText: {
    margin: 0,
    fontSize: "0.8125rem",
    color: "#334155",
    lineHeight: 1.4,
  },
  cardFooter: {
    padding: "1rem 1.25rem",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #f1f5f9",
  },
  actionButton: {
    display: "block",
    textAlign: "center" as const,
    padding: "0.625rem 1rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 600,
    textDecoration: "none",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    color: "#64748b",
  },
};
