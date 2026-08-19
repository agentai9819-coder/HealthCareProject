"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface BookingSummary {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  appointmentSlotId: string;
  startTime: string;
  endTime: string;
  status: string;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_postal_code: string | null;
  created_at: string;
}

export function BookingsListContent() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"UPCOMING" | "PAST" | "CANCELLED">("UPCOMING");

  useEffect(() => {
    fetch(`${API_BASE}/bookings`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("UNAUTHORIZED");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setBookings(data.data || []);
        } else {
          setError(data.error || "Failed to load bookings");
        }
      })
      .catch((err) => {
        if (err.message === "UNAUTHORIZED") {
          setError("Please sign in to view your appointments");
        } else {
          setError("Network error. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return styles.badgeConfirmed;
      case "CANCELLED":
        return styles.badgeCancelled;
      case "COMPLETED":
        return styles.badgeCompleted;
      default:
        return styles.badgeDefault;
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) =>
      (b.status === "CONFIRMED" || b.status === "PENDING") &&
      new Date(b.startTime) > now
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.startTime) <= now && b.status !== "CANCELLED"
  );
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

  const filteredBookings =
    filter === "UPCOMING"
      ? upcomingBookings
      : filter === "PAST"
      ? pastBookings
      : cancelledBookings;

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading your appointments...</div>
      </main>
    );
  }

  if (error && error.includes("sign in")) {
    return (
      <main style={styles.main}>
        <div style={styles.cardEmpty}>
          <h2 style={styles.emptyTitle}>Sign in required</h2>
          <p style={styles.emptyText}>You need to be signed in to view and manage your bookings.</p>
          <Link href="/auth/login" style={styles.primaryButton}>
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>My Appointments</h1>
            <p style={styles.subtitle}>View and manage your healthcare visits</p>
          </div>
          <Link href="/services" style={styles.primaryButton}>
            Book New Service
          </Link>
        </header>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.filterBar}>
          <button
            onClick={() => setFilter("UPCOMING")}
            style={{
              ...styles.filterTab,
              ...(filter === "UPCOMING" ? styles.filterTabActive : {}),
            }}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setFilter("PAST")}
            style={{
              ...styles.filterTab,
              ...(filter === "PAST" ? styles.filterTabActive : {}),
            }}
          >
            Past ({pastBookings.length})
          </button>
          <button
            onClick={() => setFilter("CANCELLED")}
            style={{
              ...styles.filterTab,
              ...(filter === "CANCELLED" ? styles.filterTabActive : {}),
            }}
          >
            Cancelled ({cancelledBookings.length})
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div style={styles.cardEmpty}>
            <div style={styles.emptyIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 style={styles.emptyTitle}>
              {filter === "UPCOMING"
                ? "No upcoming appointments"
                : filter === "PAST"
                ? "No past appointments"
                : "No cancelled appointments"}
            </h3>
            <p style={styles.emptyText}>
              {filter === "UPCOMING"
                ? "You have no upcoming appointments scheduled. Book a visit with one of our healthcare professionals."
                : filter === "PAST"
                ? "You have no completed or past appointment records."
                : "You have no cancelled appointments."}
            </p>
            {filter === "UPCOMING" && (
              <Link href="/services" style={styles.primaryButton}>
                Schedule an Appointment
              </Link>
            )}
          </div>
        ) : (
          <div style={styles.list}>
            {filteredBookings.map((b) => (
              <div key={b.id} style={styles.bookingCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.serviceName}>{b.serviceName}</span>
                    <span style={styles.bookingRef}>Ref: #{b.id.slice(0, 8)}</span>
                  </div>
                  <span style={{ ...styles.badge, ...getStatusBadgeStyle(b.status) }}>
                    {b.status}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <div style={styles.iconWrapper}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <div style={styles.infoLabel}>Scheduled Time</div>
                      <div style={styles.infoValue}>{formatDateTime(b.startTime)}</div>
                    </div>
                  </div>

                  {b.address_street && (
                    <div style={styles.infoRow}>
                      <div style={styles.iconWrapper}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <div style={styles.infoLabel}>Location</div>
                        <div style={styles.infoValue}>
                          {b.address_street}, {b.address_city}, {b.address_state} {b.address_postal_code}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.bookedDate}>
                    Booked on {new Date(b.created_at).toLocaleDateString()}
                  </span>
                  <Link href={`/booking/view/${b.id}`} style={styles.detailsButton}>
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "calc(100vh - 65px)",
    padding: "2rem 1.5rem",
  },
  container: {
    maxWidth: "840px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.9375rem",
    color: "#64748b",
    margin: "0.25rem 0 0 0",
  },
  primaryButton: {
    display: "inline-block",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    padding: "0.625rem 1.25rem",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.9375rem",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  },
  error: {
    padding: "0.875rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    marginBottom: "1.5rem",
    fontSize: "0.9375rem",
  },
  loading: {
    textAlign: "center",
    padding: "4rem 0",
    color: "#64748b",
    fontSize: "1.125rem",
  },
  filterBar: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "0.5rem",
  },
  filterTab: {
    padding: "0.4rem 0.85rem",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    color: "#64748b",
    fontWeight: 500,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  filterTabActive: {
    backgroundColor: "#f0fdfa",
    color: "#0f766e",
    fontWeight: 600,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  bookingCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fafafa",
  },
  serviceName: {
    fontWeight: 700,
    fontSize: "1.0625rem",
    color: "#0f172a",
    display: "block",
  },
  bookingRef: {
    fontSize: "0.8125rem",
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  badge: {
    padding: "0.25rem 0.625rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  badgeConfirmed: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  badgeCancelled: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  badgeCompleted: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
  },
  badgeDefault: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
  },
  cardBody: {
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  },
  iconWrapper: {
    color: "#0f766e",
    marginTop: "0.125rem",
  },
  infoLabel: {
    fontSize: "0.75rem",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: 600,
    letterSpacing: "0.025em",
  },
  infoValue: {
    fontSize: "0.9375rem",
    color: "#1e293b",
    fontWeight: 500,
  },
  cardFooter: {
    padding: "0.875rem 1.25rem",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bookedDate: {
    fontSize: "0.8125rem",
    color: "#94a3b8",
  },
  detailsButton: {
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.875rem",
    textDecoration: "none",
  },
  cardEmpty: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "3rem 2rem",
    textAlign: "center",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
  },
  emptyIcon: {
    color: "#94a3b8",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 0.5rem 0",
  },
  emptyText: {
    fontSize: "0.9375rem",
    color: "#64748b",
    margin: "0 0 1.5rem 0",
  },
};
