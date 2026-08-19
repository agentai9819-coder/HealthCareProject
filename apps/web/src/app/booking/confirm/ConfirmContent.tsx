"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | string;
}

interface FormData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CustomerAddress {
  id: string;
  customerId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export function ConfirmPageContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const slotId = searchParams.get("slotId");
  const rebookFrom = searchParams.get("rebookFrom");

  const [service, setService] = useState<Service | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("custom");

  const [formData, setFormData] = useState<FormData>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId || !slotId) {
      setError("Missing service or appointment slot");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${API_BASE}/services/${serviceId}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_BASE}/services/${serviceId}/slots`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_BASE}/customers/me/addresses`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : { success: false, data: [] }))
        .catch(() => ({ success: false, data: [] })),
    ])
      .then(([serviceRes, slotsRes, addressesRes]) => {
        if (serviceRes.success) {
          setService(serviceRes.data);
        } else {
          setError(serviceRes.error || "Failed to load service");
        }
        if (slotsRes.success) {
          const foundSlot = slotsRes.data.find((s: Slot) => s.id === slotId);
          if (foundSlot) {
            setSlot(foundSlot);
          } else {
            setError("Appointment slot not found");
          }
        } else {
          setError(slotsRes.error || "Failed to load appointment slot");
        }

        if (addressesRes.success && Array.isArray(addressesRes.data) && addressesRes.data.length > 0) {
          const addrs: CustomerAddress[] = addressesRes.data;
          setSavedAddresses(addrs);
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setFormData({
              street: defaultAddr.street,
              city: defaultAddr.city,
              state: defaultAddr.state,
              postalCode: defaultAddr.postalCode,
            });
          }
        }
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, [serviceId, slotId]);

  const handleSavedAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    setError("");

    if (addrId === "custom") {
      setFormData({
        street: "",
        city: "",
        state: "",
        postalCode: "",
      });
      return;
    }

    const found = savedAddresses.find((a) => a.id === addrId);
    if (found) {
      setFormData({
        street: found.street,
        city: found.city,
        state: found.state,
        postalCode: found.postalCode,
      });
    }
  };

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const buildReturnUrl = () => {
      const query = `/booking/confirm?serviceId=${encodeURIComponent(serviceId || "")}&slotId=${encodeURIComponent(slotId || "")}${
        rebookFrom ? `&rebookFrom=${encodeURIComponent(rebookFrom)}` : ""
      }`;
      return `/auth/login?returnUrl=${encodeURIComponent(query)}`;
    };

    try {
      if (rebookFrom) {
        if (selectedAddressId === "custom" || !selectedAddressId) {
          setError("Please select a saved address from your address book to rebook.");
          setSubmitting(false);
          return;
        }

        const res = await fetch(`${API_BASE}/bookings/${rebookFrom}/rebook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            appointmentSlotId: slotId,
            addressId: selectedAddressId,
          }),
        });

        if (res.status === 401) {
          window.location.href = buildReturnUrl();
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Rebooking failed");
          return;
        }

        setBookingId(data.data.id);
        setSuccess(true);
        return;
      }

      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          serviceId,
          appointmentSlotId: slotId,
          address: formData,
        }),
      });

      if (res.status === 401) {
        window.location.href = buildReturnUrl();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Booking failed");
        return;
      }

      setBookingId(data.data.id);
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading...</div>
      </main>
    );
  }

  if (success && bookingId) {
    return (
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 style={styles.successTitle}>Booking Confirmed</h1>
          <p style={styles.successText}>Your appointment has been scheduled successfully.</p>
          <div style={styles.bookingRef}>Booking Reference: <strong>{bookingId}</strong></div>
          <Link href={`/booking/view/${bookingId}`} style={styles.viewButton}>
            View Booking Details
          </Link>
          <Link href="/services" style={styles.backLinkBottom}>
            Book Another Service
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Link href={`/booking/select-slot?serviceId=${serviceId}`} style={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
        <h1 style={styles.title}>Confirm Booking</h1>
      </header>

      {service && slot && (
        <div style={styles.summaryCard}>
          <h2 style={styles.summaryTitle}>{service.name}</h2>
          <div style={styles.summaryMeta}>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.icon}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatDateTime(slot.startTime)}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.icon}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              ₹{Number(service.price).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.sectionTitle}>Service Address</h2>
        <p style={styles.sectionHint}>Where should our healthcare professional visit?</p>

        {savedAddresses.length > 0 && (
          <div style={styles.savedAddressesContainer}>
            <label style={styles.label}>Select Saved Address</label>
            <div style={styles.savedAddressList}>
              {savedAddresses.map((addr) => (
                <label key={addr.id} style={{
                  ...styles.savedAddressItem,
                  ...(selectedAddressId === addr.id ? styles.savedAddressItemSelected : {})
                }}>
                  <input
                    type="radio"
                    name="savedAddressRadio"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => handleSavedAddressSelect(addr.id)}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a2a3a", fontSize: "0.875rem" }}>
                      {addr.label} {addr.isDefault && <span style={styles.defaultBadge}>Default</span>}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "#5a6a7a" }}>
                      {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                    </div>
                  </div>
                </label>
              ))}

              <label style={{
                ...styles.savedAddressItem,
                ...(selectedAddressId === "custom" ? styles.savedAddressItemSelected : {})
              }}>
                <input
                  type="radio"
                  name="savedAddressRadio"
                  value="custom"
                  checked={selectedAddressId === "custom"}
                  onChange={() => handleSavedAddressSelect("custom")}
                />
                <div>
                  <div style={{ fontWeight: 600, color: "#1a2a3a", fontSize: "0.875rem" }}>
                    Enter custom address
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#5a6a7a" }}>
                    Type a new address manually
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        <div style={styles.field}>
          <label htmlFor="street" style={styles.label}>Street Address</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="123 Main Street"
          />
        </div>

        <div style={styles.fieldGroup}>
          <div style={styles.field}>
            <label htmlFor="city" style={styles.label}>City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="City"
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="state" style={styles.label}>State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              maxLength={2}
              style={styles.input}
              placeholder="CA"
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="postalCode" style={styles.label}>ZIP Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="90210"
            />
          </div>
        </div>

        <button type="submit" disabled={submitting} style={styles.submitButton}>
          {submitting ? "Confirming..." : "Confirm Booking"}
        </button>
      </form>
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
    maxWidth: "520px",
    margin: "0 auto 1.5rem",
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
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1a2a3a",
  },
  card: {
    maxWidth: "520px",
    margin: "3rem auto",
    padding: "3rem 2rem",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  successIcon: {
    display: "inline-flex",
    marginBottom: "1rem",
    color: "#166534",
  },
  successTitle: {
    margin: "0 0 0.5rem",
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1a2a3a",
  },
  successText: {
    margin: "0 0 1.5rem",
    fontSize: "1rem",
    color: "#5a6a7a",
  },
  bookingRef: {
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "#f5f7fa",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#3a4a5a",
  },
  viewButton: {
    display: "block",
    marginBottom: "1rem",
    padding: "0.875rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "white",
    backgroundColor: "#2a7f8f",
    borderRadius: "10px",
    textDecoration: "none",
    textAlign: "center",
  },
  backLinkBottom: {
    display: "block",
    padding: "0.75rem 1.5rem",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#2a7f8f",
    textDecoration: "none",
    textAlign: "center",
  },
  summaryCard: {
    maxWidth: "520px",
    margin: "0 auto 1.5rem",
    padding: "1.25rem",
    backgroundColor: "white",
    border: "1px solid #e8edf2",
    borderRadius: "10px",
  },
  summaryTitle: {
    margin: "0 0 0.75rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#1a2a3a",
  },
  summaryMeta: {
    display: "flex",
    gap: "1.5rem",
    fontSize: "0.9rem",
    color: "#5a6a7a",
  },
  icon: {
    display: "inline-block",
    marginRight: "0.375rem",
    verticalAlign: "middle",
    color: "#2a7f8f",
  },
  form: {
    maxWidth: "520px",
    margin: "0 auto",
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e8edf2",
  },
  error: {
    maxWidth: "520px",
    margin: "0 auto 1.5rem",
    padding: "1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
  },
  sectionTitle: {
    margin: "0 0 0.25rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#1a2a3a",
  },
  sectionHint: {
    margin: "0 0 1.25rem",
    fontSize: "0.875rem",
    color: "#5a6a7a",
  },
  savedAddressesContainer: {
    marginBottom: "1.25rem",
    paddingBottom: "1.25rem",
    borderBottom: "1px solid #e8edf2",
  },
  savedAddressList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  savedAddressItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #d0d8e0",
    backgroundColor: "#fafbfc",
    cursor: "pointer",
  },
  savedAddressItemSelected: {
    borderColor: "#2a7f8f",
    backgroundColor: "#f0fdfa",
  },
  defaultBadge: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#0f766e",
    backgroundColor: "#ccfbf1",
    padding: "0.125rem 0.375rem",
    borderRadius: "4px",
    marginLeft: "0.375rem",
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
  submitButton: {
    marginTop: "1.5rem",
    width: "100%",
    padding: "0.875rem 1rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "white",
    backgroundColor: "#2a7f8f",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    color: "#5a6a7a",
  },
};