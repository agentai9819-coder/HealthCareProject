"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName?: string;
  serviceDurationMinutes?: number;
  appointmentSlotId: string;
  startTime?: string;
  endTime?: string;
  status: string;
  customerIntakeNotes?: string | null;
  customerSummary?: string | null;
  completedAt?: string | null;
  visitStatus?: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_postal_code: string | null;
  created_at: string;
}

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface SavedAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export function ViewBookingContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(false);

  // Reschedule state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  // Change Address state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [changingAddress, setChangingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Customer Intake Notes modal state
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [intakeText, setIntakeText] = useState("");
  const [updatingIntake, setUpdatingIntake] = useState(false);
  const [intakeError, setIntakeError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const fetchBooking = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setBooking(data.data);
        setIntakeText(data.data.customerIntakeNotes || "");
      } else {
        setError(data.error || "Booking not found");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingId) {
      setError("Invalid booking ID");
      setLoading(false);
      return;
    }
    fetchBooking();
  }, [bookingId]);

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return styles.statusConfirmed;
      case "PENDING":
        return styles.statusPending;
      case "CANCELLED":
        return styles.statusCancelled;
      case "COMPLETED":
        return styles.statusCompleted;
      default:
        return styles.statusDefault;
    }
  };

  const handleOpenReschedule = async () => {
    if (!booking) return;
    setRescheduleError("");
    setSelectedSlotId("");
    setShowRescheduleModal(true);
    setLoadingSlots(true);

    try {
      const res = await fetch(`${API_BASE}/services/${booking.serviceId}/slots`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAvailableSlots(data.data || []);
      } else {
        setRescheduleError(data.error || "Failed to load appointment slots.");
      }
    } catch {
      setRescheduleError("Network error loading appointment slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedSlotId || !booking) return;
    setRescheduling(true);
    setRescheduleError("");

    try {
      const res = await fetch(`${API_BASE}/bookings/${booking.id}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newAppointmentSlotId: selectedSlotId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await fetchBooking();
        setShowRescheduleModal(false);
        setSuccessMessage("Appointment rescheduled successfully.");
      } else if (res.status === 409) {
        setRescheduleError("Selected slot is no longer available. Please choose another time.");
      } else if (res.status === 404) {
        setError(data.error || "Booking not found.");
        setShowRescheduleModal(false);
      } else {
        setRescheduleError(data.error || "Failed to reschedule booking.");
      }
    } catch {
      setRescheduleError("Network error. Failed to reschedule booking.");
    } finally {
      setRescheduling(false);
    }
  };

  const handleOpenChangeAddress = async () => {
    if (!booking) return;
    setAddressError("");
    setSelectedAddressId("");
    setShowAddressModal(true);
    setLoadingAddresses(true);

    try {
      const res = await fetch(`${API_BASE}/customers/me/addresses`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const addrs: SavedAddress[] = data.data || [];
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (addrs.length > 0) {
          setSelectedAddressId(addrs[0].id);
        }
      } else {
        setAddressError(data.error || "Failed to load saved addresses.");
      }
    } catch {
      setAddressError("Network error loading saved addresses.");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSelectSavedAddress = async (addr: SavedAddress) => {
    if (!booking) return;
    const previousAddress = {
      address_street: booking.address_street,
      address_city: booking.address_city,
      address_state: booking.address_state,
      address_postal_code: booking.address_postal_code,
    };

    // Optimistic UI Update: update instantly
    setBooking({
      ...booking,
      address_street: addr.street,
      address_city: addr.city,
      address_state: addr.state,
      address_postal_code: addr.postalCode,
    });
    setShowAddressModal(false);
    setSuccessMessage("Appointment address updated successfully.");
    setAddressError("");

    try {
      const res = await fetch(`${API_BASE}/bookings/${booking.id}/address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ addressId: addr.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Rollback on error
        setBooking((curr) => curr ? { ...curr, ...previousAddress } : curr);
        setAddressError(data.error || "Failed to update address. Changes rolled back.");
        setShowAddressModal(true);
        setSuccessMessage("");
      }
    } catch {
      // Rollback on network failure
      setBooking((curr) => curr ? { ...curr, ...previousAddress } : curr);
      setAddressError("Network error. Failed to update address. Changes rolled back.");
      setShowAddressModal(true);
      setSuccessMessage("");
    }
  };

  const handleConfirmChangeAddress = async () => {
    if (!selectedAddressId || !booking) return;
    const addr = savedAddresses.find((a) => a.id === selectedAddressId);
    if (addr) {
      await handleSelectSavedAddress(addr);
    }
  };

  const handleSaveIntakeNotes = async () => {
    if (!booking) return;
    const previousNotes = booking.customerIntakeNotes;

    // Optimistic UI Update: apply text immediately
    setBooking({ ...booking, customerIntakeNotes: intakeText });
    setShowIntakeModal(false);
    setSuccessMessage("Pre-visit intake notes updated successfully.");
    setIntakeError("");

    try {
      const res = await fetch(`${API_BASE}/bookings/${booking.id}/intake`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ intakeNotes: intakeText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Rollback on server error
        setBooking((curr) => curr ? { ...curr, customerIntakeNotes: previousNotes } : curr);
        setIntakeError(data.error || "Failed to update intake notes. Changes rolled back.");
        setShowIntakeModal(true);
        setSuccessMessage("");
      }
    } catch {
      // Rollback on network failure
      setBooking((curr) => curr ? { ...curr, customerIntakeNotes: previousNotes } : curr);
      setIntakeError("Network error. Failed to update intake notes. Changes rolled back.");
      setShowIntakeModal(true);
      setSuccessMessage("");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCanceling(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setBooking((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
        setSuccessMessage("Booking cancelled successfully.");
      } else {
        alert(data.error || "Failed to cancel booking");
      }
    } catch {
      alert("Network error. Failed to cancel booking.");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading booking...</div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>Booking Not Found</h1>
          {error && <p style={styles.error}>{error}</p>}
          <Link href="/services" style={styles.backLink}>
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  const now = new Date();
  const appointmentTime = booking.startTime ? new Date(booking.startTime) : null;
  const isFuture = appointmentTime ? appointmentTime > now : true;
  const isEligibleForModification =
    (booking.status === "CONFIRMED" || booking.status === "PENDING") && isFuture;
  const isEligibleForRebook =
    booking.status === "COMPLETED" || booking.status === "CANCELLED";

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Link href="/bookings" style={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Appointments
        </Link>
        <h1 style={styles.title}>Booking Details</h1>
      </header>

      {successMessage && (
        <div style={styles.successBanner}>
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            style={styles.closeAlertButton}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.statusRow}>
          <div>
            <h2 style={styles.bookingTitle}>
              {booking.serviceName || `Booking #${booking.id.slice(0, 8)}`}
            </h2>
            <span style={styles.bookingRefSub}>Ref: #{booking.id.slice(0, 8)}</span>
          </div>
          <span style={{ ...styles.statusBadge, ...getStatusStyle(booking.status) }}>
            {booking.status}
          </span>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Appointment Details</h3>
          {booking.serviceName && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Healthcare Service</span>
              <span style={styles.detailValue}>{booking.serviceName}</span>
            </div>
          )}
          {booking.serviceDurationMinutes && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Duration</span>
              <span style={styles.detailValue}>{booking.serviceDurationMinutes} minutes</span>
            </div>
          )}
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Scheduled Time</span>
            <span style={styles.detailValue}>
              {booking.startTime ? formatDateTime(booking.startTime) : formatDateTime(booking.created_at)}
            </span>
          </div>
          {booking.completedAt && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Completed On</span>
              <span style={styles.detailValue}>{formatDateTime(booking.completedAt)}</span>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={styles.sectionTitle}>Service Location</h3>
            {isEligibleForModification && (
              <button
                type="button"
                onClick={handleOpenChangeAddress}
                style={styles.inlineActionLink}
              >
                Change Address
              </button>
            )}
          </div>
          {booking.address_street ? (
            <address style={styles.address}>
              <div>{booking.address_street}</div>
              <div>
                {booking.address_city}, {booking.address_state} {booking.address_postal_code}
              </div>
            </address>
          ) : (
            <p style={styles.noAddress}>No address on file</p>
          )}
        </div>

        {/* Pre-Visit Intake Notes Section */}
        <div style={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={styles.sectionTitle}>Intake & Access Notes</h3>
            {isEligibleForModification && (
              <button
                type="button"
                onClick={() => {
                  setIntakeText(booking.customerIntakeNotes || "");
                  setIntakeError("");
                  setShowIntakeModal(true);
                }}
                style={styles.inlineActionLink}
              >
                {booking.customerIntakeNotes ? "Edit Notes" : "+ Add Notes"}
              </button>
            )}
          </div>
          {booking.customerIntakeNotes ? (
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#1a2a3a", lineHeight: 1.5 }}>
              {booking.customerIntakeNotes}
            </p>
          ) : (
            <p style={styles.noAddress}>No special access instructions or care notes provided.</p>
          )}
        </div>

        {/* Completed Care Summary Section */}
        {booking.status === "COMPLETED" && booking.customerSummary && (
          <div style={{ ...styles.section, backgroundColor: "#f0fdfa", borderLeft: "4px solid #0f766e" }}>
            <h3 style={{ ...styles.sectionTitle, color: "#0f766e" }}>Visit Care Summary</h3>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#134e4a", lineHeight: 1.6 }}>
              {booking.customerSummary}
            </p>
          </div>
        )}

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Booking Summary</h3>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Booking Reference</span>
            <span style={{ ...styles.detailValue, fontFamily: "monospace", fontSize: "0.875rem" }}>
              {booking.id}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Booked On</span>
            <span style={styles.detailValue}>{formatDateTime(booking.created_at)}</span>
          </div>
        </div>

        <div style={styles.actions}>
          {isEligibleForModification && (
            <>
              <button
                onClick={handleOpenReschedule}
                style={styles.rescheduleButton}
              >
                Reschedule Appointment
              </button>
              <button
                onClick={handleOpenChangeAddress}
                style={styles.addressButton}
              >
                Change Appointment Address
              </button>
              <button
                onClick={handleCancel}
                disabled={canceling}
                style={styles.cancelButton}
              >
                {canceling ? "Cancelling..." : "Cancel Booking"}
              </button>
            </>
          )}

          {isEligibleForRebook && (
            <Link
              href={`/booking/select-slot?serviceId=${booking.serviceId}&rebookFrom=${booking.id}`}
              style={styles.rebookButton}
            >
              Rebook This Service
            </Link>
          )}
        </div>
      </div>

      {/* Intake Notes Modal */}
      {showIntakeModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Pre-Visit Intake & Access Notes</h2>
              <button
                onClick={() => setShowIntakeModal(false)}
                style={styles.modalCloseButton}
                disabled={updatingIntake}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <p style={styles.modalSubtitle}>
                Provide entry instructions, gate codes, pet info, or care preferences for the visiting caregiver.
              </p>

              {intakeError && <div style={styles.modalError}>{intakeError}</div>}

              <textarea
                value={intakeText}
                onChange={(e) => setIntakeText(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="E.g., Gate code is #1234, ring doorbell, small dog inside..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem", textAlign: "right" }}>
                {intakeText.length}/1000 characters
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowIntakeModal(false)}
                disabled={updatingIntake}
                style={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveIntakeNotes}
                disabled={updatingIntake}
                style={styles.modalConfirmButton}
              >
                {updatingIntake ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Reschedule Appointment</h2>
              <button
                onClick={() => setShowRescheduleModal(false)}
                style={styles.modalCloseButton}
                disabled={rescheduling}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <p style={styles.modalSubtitle}>
                Select an alternative time slot for your appointment.
              </p>

              {rescheduleError && (
                <div style={styles.modalError}>
                  {rescheduleError}
                </div>
              )}

              {loadingSlots ? (
                <div style={styles.slotsLoading}>Loading available times...</div>
              ) : availableSlots.length === 0 ? (
                <div style={styles.noSlots}>No alternative slots currently available.</div>
              ) : (
                <div style={styles.slotsList}>
                  {availableSlots.map((slot) => {
                    const isCurrent = slot.id === booking.appointmentSlotId;
                    const isSelected = selectedSlotId === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => !isCurrent && setSelectedSlotId(slot.id)}
                        disabled={isCurrent || rescheduling}
                        style={{
                          ...styles.slotCard,
                          ...(isSelected ? styles.slotCardSelected : {}),
                          ...(isCurrent ? styles.slotCardCurrent : {}),
                        }}
                      >
                        <div style={styles.slotTimeText}>
                          {formatDateTime(slot.startTime)}
                        </div>
                        {isCurrent && (
                          <span style={styles.currentSlotBadge}>Current Time</span>
                        )}
                        {isSelected && (
                          <span style={styles.selectedCheckmark}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                disabled={rescheduling}
                style={styles.modalCancelButton}
              >
                Keep Current Time
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={!selectedSlotId || rescheduling}
                style={{
                  ...styles.modalConfirmButton,
                  ...(!selectedSlotId || rescheduling ? styles.modalButtonDisabled : {}),
                }}
              >
                {rescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Change Appointment Address</h2>
              <button
                onClick={() => setShowAddressModal(false)}
                style={styles.modalCloseButton}
                disabled={changingAddress}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <p style={styles.modalSubtitle}>
                Select an address from your saved address book for this visit.
              </p>

              {addressError && (
                <div style={styles.modalError}>
                  {addressError}
                </div>
              )}

              {loadingAddresses ? (
                <div style={styles.slotsLoading}>Loading saved addresses...</div>
              ) : savedAddresses.length === 0 ? (
                <div style={styles.noSlots}>
                  No saved addresses found. Please add an address in your profile first.
                </div>
              ) : (
                <div style={styles.slotsList}>
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;

                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => setSelectedAddressId(addr.id)}
                        disabled={changingAddress}
                        style={{
                          ...styles.slotCard,
                          ...(isSelected ? styles.slotCardSelected : {}),
                        }}
                      >
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1a2a3a" }}>
                            {addr.label} {addr.isDefault && <span style={styles.currentSlotBadge}>Default</span>}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#5a6a7a", marginTop: "0.25rem" }}>
                            {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                          </div>
                        </div>
                        {isSelected && (
                          <span style={styles.selectedCheckmark}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                disabled={changingAddress}
                style={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmChangeAddress}
                disabled={!selectedAddressId || changingAddress}
                style={{
                  ...styles.modalConfirmButton,
                  ...(!selectedAddressId || changingAddress ? styles.modalButtonDisabled : {}),
                }}
              >
                {changingAddress ? "Updating..." : "Update Address"}
              </button>
            </div>
          </div>
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
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e8edf2",
    overflow: "hidden",
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #e8edf2",
  },
  bookingTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#1a2a3a",
  },
  statusBadge: {
    padding: "0.375rem 0.875rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderRadius: "9999px",
  },
  statusConfirmed: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusPending: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
  },
  statusCancelled: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
  },
  statusCompleted: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  statusDefault: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
  },
  section: {
    padding: "1.5rem",
    borderBottom: "1px solid #e8edf2",
  },
  sectionTitle: {
    margin: "0 0 1rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#5a6a7a",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    fontSize: "0.95rem",
  },
  detailLabel: {
    color: "#5a6a7a",
  },
  detailValue: {
    color: "#1a2a3a",
    fontWeight: 500,
    textAlign: "right",
  },
  address: {
    fontStyle: "normal",
    fontSize: "0.95rem",
    color: "#1a2a3a",
    lineHeight: 1.6,
  },
  noAddress: {
    margin: 0,
    fontSize: "0.95rem",
    color: "#8a9aa8",
  },
  actions: {
    padding: "1.5rem",
    borderTop: "1px solid #e8edf2",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  rescheduleButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#2563eb",
    border: "1px solid #1d4ed8",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  addressButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#0f766e",
    backgroundColor: "#f0fdfa",
    border: "1px solid #99f6e4",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  rebookButton: {
    display: "block",
    textAlign: "center" as const,
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#0f766e",
    border: "1px solid #0d9488",
    borderRadius: "8px",
    textDecoration: "none",
    boxSizing: "border-box" as const,
    cursor: "pointer",
  },
  inlineActionLink: {
    background: "none",
    border: "none",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.8125rem",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
  },
  bookingRefSub: {
    fontSize: "0.8125rem",
    color: "#64748b",
    fontFamily: "monospace",
    display: "block",
    marginTop: "0.25rem",
  },
  cancelButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#b91c1c",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  successBanner: {
    maxWidth: "600px",
    margin: "0 auto 1.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    color: "#065f46",
    fontSize: "0.95rem",
    fontWeight: 500,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeAlertButton: {
    background: "none",
    border: "none",
    fontSize: "1.25rem",
    color: "#065f46",
    cursor: "pointer",
    padding: "0 0.25rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    maxWidth: "500px",
    width: "100%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #e8edf2",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#1a2a3a",
  },
  modalCloseButton: {
    background: "none",
    border: "none",
    fontSize: "1rem",
    color: "#5a6a7a",
    cursor: "pointer",
    padding: "0.25rem",
  },
  modalBody: {
    padding: "1.5rem",
    overflowY: "auto",
  },
  modalSubtitle: {
    margin: "0 0 1rem",
    fontSize: "0.95rem",
    color: "#5a6a7a",
  },
  modalError: {
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  slotsLoading: {
    padding: "2rem",
    textAlign: "center",
    color: "#5a6a7a",
    fontSize: "0.95rem",
  },
  noSlots: {
    padding: "2rem",
    textAlign: "center",
    color: "#5a6a7a",
    fontSize: "0.95rem",
  },
  slotsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    maxHeight: "260px",
    overflowY: "auto",
  },
  slotCard: {
    padding: "0.875rem 1rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s, background-color 0.15s",
  },
  slotCardSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  slotCardCurrent: {
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  slotTimeText: {
    fontSize: "0.95rem",
    color: "#1a2a3a",
    fontWeight: 500,
  },
  currentSlotBadge: {
    fontSize: "0.75rem",
    padding: "0.2rem 0.5rem",
    borderRadius: "9999px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    fontWeight: 600,
  },
  selectedCheckmark: {
    color: "#2563eb",
    fontWeight: 700,
    fontSize: "1.1rem",
  },
  modalFooter: {
    padding: "1.25rem 1.5rem",
    borderTop: "1px solid #e8edf2",
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    backgroundColor: "#fafafa",
  },
  modalCancelButton: {
    padding: "0.625rem 1rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#374151",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
  },
  modalConfirmButton: {
    padding: "0.625rem 1.25rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#2563eb",
    border: "1px solid #1d4ed8",
    borderRadius: "6px",
    cursor: "pointer",
  },
  modalButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    color: "#5a6a7a",
  },
  error: {
    marginBottom: "1rem",
    color: "#b91c1c",
  },
};