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

import { DEFAULT_SERVICES, getServiceSlug } from "../../../lib/services";

const generateFallbackSlots = (): Slot[] => {
  const now = new Date();
  const slots: Slot[] = [];

  const addSlot = (id: string, daysAhead: number, hours: number, minutes: number) => {
    const s = new Date(now);
    s.setDate(s.getDate() + daysAhead);
    s.setHours(hours, minutes, 0, 0);
    const e = new Date(s.getTime() + 60 * 60 * 1000);
    slots.push({ id, startTime: s.toISOString(), endTime: e.toISOString(), isAvailable: true });
  };

  addSlot("slot-today-1", 0, 15, 30);
  addSlot("slot-today-2", 0, 17, 15);
  addSlot("slot-tomorrow-1", 1, 9, 0);
  addSlot("slot-tomorrow-2", 1, 11, 30);
  addSlot("slot-tomorrow-3", 1, 15, 0);
  addSlot("slot-nextday-1", 2, 10, 0);
  addSlot("slot-nextday-2", 2, 14, 30);

  return slots;
};

export function SelectSlotPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get("serviceId") || searchParams.get("service");
  const rebookFrom = searchParams.get("rebookFrom");
  const [service, setService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      // Default to first catalog service if none provided
      const defaultService = DEFAULT_SERVICES[0];
      setService(defaultService);
      setSlots(generateFallbackSlots());
      setLoading(false);
      return;
    }

    const fallbackService =
      DEFAULT_SERVICES.find((s) => s.id === serviceId || getServiceSlug(s) === serviceId) || DEFAULT_SERVICES[0];

    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const [serviceRes, slotsRes] = await Promise.all([
          fetch(`${API_BASE}/services`, { signal: controller.signal }),
          fetch(`${API_BASE}/bookings/slots?serviceId=${serviceId}`, { signal: controller.signal }),
        ]);

        clearTimeout(timeoutId);

        const serviceData = await serviceRes.json();
        const slotsData = await slotsRes.json();

        if (serviceData.success && Array.isArray(serviceData.data)) {
          const found = serviceData.data.find(
            (s: Service) => s.id === serviceId || getServiceSlug(s) === serviceId
          );
          setService(found || fallbackService);
        } else {
          setService(fallbackService);
        }

        if (slotsData.success && Array.isArray(slotsData.data) && slotsData.data.length > 0) {
          setSlots(slotsData.data);
        } else {
          setSlots(generateFallbackSlots());
        }
      } catch {
        // Smooth offline/standalone fallback
        setService(fallbackService);
        setSlots(generateFallbackSlots());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
  };

  const handleContinue = () => {
    if (!selectedSlotId || !serviceId) return;
    const rebookParam = rebookFrom ? `&rebookFrom=${encodeURIComponent(rebookFrom)}` : "";
    router.push(`/booking/confirm?serviceId=${serviceId}&slotId=${selectedSlotId}${rebookParam}`);
  };

  const formatSlotTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div style={styles.loading}>Loading clinical appointment slots...</div>;
  }

  if (error) {
    return (
      <main style={styles.main}>
        <div style={styles.errorBox}>
          <p>{error}</p>
          <Link href="/services" style={styles.backLink}>
            ← Browse Available Services
          </Link>
        </div>
      </main>
    );
  }

  const formattedPrice = service ? Number(service.price).toLocaleString("en-IN") : "";

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <div style={styles.badge}>
          <span className="live-dot" />
          <span>Step 2 • Slot Selection</span>
        </div>
        <h1 style={styles.title}>Select In-Home Visit Time</h1>
        {service && (
          <p style={styles.subtitle}>
            {service.name} • {service.durationMinutes} minutes • ₹{formattedPrice}
          </p>
        )}
      </div>

      {slots.length === 0 ? (
        <div style={styles.empty}>
          <p>No appointment slots available for this service right now.</p>
          <p style={styles.emptyHint}>Please check back later or choose another clinical service.</p>
          <Link href="/services" style={styles.backLink}>
            ← Back to Healthcare Services
          </Link>
        </div>
      ) : (
        <div style={styles.list}>
          {slots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => slot.isAvailable && handleSelectSlot(slot.id)}
                disabled={!slot.isAvailable}
                style={{
                  ...styles.slot,
                  ...(isSelected ? styles.slotSelected : {}),
                  ...(!slot.isAvailable ? styles.slotUnavailable : {}),
                }}
                aria-pressed={isSelected}
              >
                <div style={styles.slotTime}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.icon}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{formatSlotTime(slot.startTime)}</span>
                </div>
                <span
                  style={{
                    ...styles.slotStatus,
                    ...(slot.isAvailable ? styles.available : styles.unavailable),
                  }}
                >
                  {slot.isAvailable ? "Available" : "Booked"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {selectedSlotId && (
        <div style={styles.continueBar}>
          <button type="button" onClick={handleContinue} className="shimmer-button" style={styles.continueButton}>
            <span>Continue to Confirmation →</span>
          </button>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "80vh",
    padding: "3rem 1.5rem 6rem 1.5rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 12px",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    border: "1px solid rgba(52, 211, 153, 0.25)",
    color: "#a7f3d0",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "16px",
  },
  title: {
    margin: "0 0 0.5rem",
    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
    fontSize: "clamp(26px, 4vw, 36px)",
    fontWeight: 800,
    color: "#f6f7f3",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    margin: 0,
    fontSize: "1.05rem",
    color: "#34d399",
    fontWeight: 600,
  },
  errorBox: {
    textAlign: "center",
    padding: "3rem 2rem",
    backgroundColor: "rgba(18, 30, 27, 0.8)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "20px",
    color: "#fca5a5",
  },
  backLink: {
    display: "inline-block",
    marginTop: "1rem",
    color: "#34d399",
    textDecoration: "none",
    fontWeight: 600,
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "rgba(18, 30, 27, 0.8)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#cbd5e1",
  },
  emptyHint: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: "#94a3b8",
  },
  list: {
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.85rem",
  },
  slot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.1rem 1.35rem",
    backgroundColor: "rgba(18, 30, 27, 0.75)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "14px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    backdropFilter: "blur(16px)",
    color: "#f8fafc",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  slotSelected: {
    borderColor: "#34d399",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    boxShadow: "0 0 0 2px rgba(52, 211, 153, 0.4)",
  },
  slotUnavailable: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  slotTime: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#f8fafc",
  },
  icon: {
    color: "#34d399",
    flexShrink: 0,
  },
  slotStatus: {
    fontSize: "0.8rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  available: {
    color: "#34d399",
  },
  unavailable: {
    color: "#ef4444",
  },
  continueBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "1.25rem 2rem",
    backgroundColor: "rgba(8, 13, 12, 0.95)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(52, 211, 153, 0.25)",
    display: "flex",
    justifyContent: "center",
    zIndex: 100,
  },
  continueButton: {
    padding: "0.875rem 2.5rem",
    fontSize: "1rem",
    fontWeight: 700,
    minWidth: "280px",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    color: "#94a3b8",
    fontSize: "1rem",
  },
};