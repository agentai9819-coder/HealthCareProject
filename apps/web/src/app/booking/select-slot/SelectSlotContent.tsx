"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | string;
}

export function SelectSlotPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get("serviceId");
  const rebookFrom = searchParams.get("rebookFrom");
  const [service, setService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setError("No service selected");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${API_BASE}/services/${serviceId}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_BASE}/services/${serviceId}/slots`, { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([serviceRes, slotsRes]) => {
        if (serviceRes.success) {
          setService(serviceRes.data);
        } else {
          setError(serviceRes.error || "Failed to load service");
        }
        if (slotsRes.success) {
          setSlots(slotsRes.data);
        } else {
          setError(slotsRes.error || "Failed to load appointment slots");
        }
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, [serviceId]);

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

  const handleContinue = () => {
    if (selectedSlotId && serviceId) {
      const url = `/booking/confirm?serviceId=${serviceId}&slotId=${selectedSlotId}${
        rebookFrom ? `&rebookFrom=${encodeURIComponent(rebookFrom)}` : ""
      }`;
      router.push(url);
    }
  };

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Link href="/services" style={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Services
        </Link>
        {service && (
          <div>
            <h1 style={styles.title}>{service.name}</h1>
            <p style={styles.subtitle}>Select an available appointment slot</p>
          </div>
        )}
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {service && slots.length === 0 && (
        <div style={styles.empty}>
          <p>No available appointments for this service.</p>
          <p style={styles.emptyHint}>Please check back later or contact us.</p>
        </div>
      )}

      <div style={styles.list}>
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setSelectedSlotId(slot.id)}
            disabled={!slot.isAvailable}
            style={{
              ...styles.slot,
              ...(selectedSlotId === slot.id ? styles.slotSelected : {}),
              ...(!slot.isAvailable ? styles.slotUnavailable : {}),
            }}
          >
            <div style={styles.slotTime}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.icon}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{formatDateTime(slot.startTime)} - {new Date(slot.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
            </div>
            <div style={styles.slotStatus}>
              {slot.isAvailable ? (
                <span style={styles.available}>Available</span>
              ) : (
                <span style={styles.unavailable}>Booked</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedSlotId && (
        <div style={styles.continueBar}>
          <button onClick={handleContinue} style={styles.continueButton}>
            Continue to Confirmation
          </button>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    padding: "2rem",
    backgroundColor: "#f5f7fa",
  },
  header: {
    maxWidth: "600px",
    margin: "0 auto 2rem",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    marginBottom: "1rem",
    fontSize: "0.875rem",
    color: "#5a6a7a",
    textDecoration: "none",
  },
  title: {
    margin: "0 0 0.25rem",
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1a2a3a",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#5a6a7a",
  },
  error: {
    maxWidth: "600px",
    margin: "0 auto 1.5rem",
    padding: "1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
  },
  empty: {
    maxWidth: "600px",
    margin: "3rem auto",
    textAlign: "center",
    color: "#5a6a7a",
  },
  emptyHint: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: "#8a9aa8",
  },
  list: {
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  slot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.25rem",
    backgroundColor: "white",
    border: "1px solid #e8edf2",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
    textAlign: "left",
    width: "100%",
  },
  slotSelected: {
    borderColor: "#2a7f8f",
    boxShadow: "0 0 0 3px rgba(42, 127, 143, 0.15)",
  },
  slotUnavailable: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  slotTime: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
    color: "#1a2a3a",
  },
  icon: {
    color: "#2a7f8f",
    flexShrink: 0,
  },
  slotStatus: {
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  available: {
    color: "#166534",
  },
  unavailable: {
    color: "#b91c1c",
  },
  continueBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "1rem 2rem",
    backgroundColor: "rgba(245, 247, 250, 0.95)",
    backdropFilter: "blur(8px)",
    borderTop: "1px solid #e8edf2",
    display: "flex",
    justifyContent: "center",
    maxWidth: "600px",
    margin: "0 auto",
    borderRadius: "10px 10px 0 0",
    zIndex: 100,
  },
  continueButton: {
    padding: "0.875rem 2rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "white",
    backgroundColor: "#2a7f8f",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    minWidth: "240px",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    color: "#5a6a7a",
  },
};