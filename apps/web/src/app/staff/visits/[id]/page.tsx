"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface AssignedStaff {
  staffId: string;
  name: string;
  specialty?: string | null;
  isActive: boolean;
  isParticipating: boolean;
}

interface VisitDetail {
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
  staffNotes?: string | null;
  customerSummary?: string | null;
  assignedStaff: AssignedStaff[];
}

export default function StaffVisitExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const visitId = params.id as string;

  const [visit, setVisit] = useState<VisitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  // Completion modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [staffNotes, setStaffNotes] = useState("");
  const [customerSummary, setCustomerSummary] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [completing, setCompleting] = useState(false);
  const [completionError, setCompletionError] = useState("");

  const fetchVisit = async () => {
    try {
      const res = await fetch(`${API_BASE}/staff/visits/${visitId}`, {
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/staff/login");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setVisit(data.data);
        const activeStaffIds = (data.data.assignedStaff || [])
          .filter((s: AssignedStaff) => s.isActive)
          .map((s: AssignedStaff) => s.staffId);
        setSelectedParticipants(activeStaffIds);
      } else {
        setError(data.error || "Visit not found");
      }
    } catch {
      setError("Network error loading visit details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visitId) {
      fetchVisit();
    }
  }, [visitId]);

  const handleStatusTransition = async (targetStatus: "EN_ROUTE" | "IN_PROGRESS") => {
    if (!visit) return;
    const previousStatus = visit.status;

    // Optimistic UI Update: advance status immediately
    setVisit({ ...visit, status: targetStatus });
    setError("");

    try {
      const res = await fetch(`${API_BASE}/staff/visits/${visitId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: targetStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback on server error
        setVisit((curr) => curr ? { ...curr, status: previousStatus } : curr);
        setError(data.error || `Failed to transition status to ${targetStatus}. Reverted.`);
      }
    } catch {
      // Rollback on network failure
      setVisit((curr) => curr ? { ...curr, status: previousStatus } : curr);
      setError("Network error transitioning status. Reverted.");
    }
  };

  const handleCompleteVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompleting(true);
    setCompletionError("");

    try {
      const res = await fetch(`${API_BASE}/staff/visits/${visitId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          staffNotes,
          customerSummary,
          participatingStaffIds: selectedParticipants,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowCompleteModal(false);
        await fetchVisit();
      } else {
        setCompletionError(data.error || "Failed to complete visit");
      }
    } catch {
      setCompletionError("Network error completing visit");
    } finally {
      setCompleting(false);
    }
  };

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return "N/A";
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading visit details...</div>
      </main>
    );
  }

  if (error && !visit) {
    return (
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>Visit Unavailable</h1>
          <p style={styles.errorBanner}>{error}</p>
          <Link href="/staff/schedule" style={styles.backButton}>
            ← Back to Schedule
          </Link>
        </div>
      </main>
    );
  }

  if (!visit) return null;

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Link href="/staff/schedule" style={styles.backButton}>
          ← Back to Schedule
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
          <div>
            <h1 style={styles.title}>{visit.serviceName}</h1>
            <span style={styles.bookingRef}>Booking Ref: #{visit.bookingId.slice(0, 8)}</span>
          </div>
          <span style={styles.statusPill}>{visit.status}</span>
        </div>
      </header>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.card}>
        {/* Step Progression Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressStep}>
            <div style={{ ...styles.stepCircle, ...(visit.status !== "CANCELLED" ? styles.stepCircleActive : {}) }}>1</div>
            <span style={styles.stepLabel}>Confirmed</span>
          </div>
          <div style={styles.progressLine} />
          <div style={styles.progressStep}>
            <div
              style={{
                ...styles.stepCircle,
                ...(visit.status === "EN_ROUTE" || visit.status === "IN_PROGRESS" || visit.status === "COMPLETED"
                  ? styles.stepCircleActive
                  : {}),
              }}
            >
              2
            </div>
            <span style={styles.stepLabel}>En Route</span>
          </div>
          <div style={styles.progressLine} />
          <div style={styles.progressStep}>
            <div
              style={{
                ...styles.stepCircle,
                ...(visit.status === "IN_PROGRESS" || visit.status === "COMPLETED" ? styles.stepCircleActive : {}),
              }}
            >
              3
            </div>
            <span style={styles.stepLabel}>In Progress</span>
          </div>
          <div style={styles.progressLine} />
          <div style={styles.progressStep}>
            <div style={{ ...styles.stepCircle, ...(visit.status === "COMPLETED" ? styles.stepCircleActive : {}) }}>4</div>
            <span style={styles.stepLabel}>Completed</span>
          </div>
        </div>

        {/* Patient & Location Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Patient Information</h2>
          <div style={styles.infoGrid}>
            <div>
              <span style={styles.label}>Patient Name</span>
              <p style={styles.value}>{visit.customerName}</p>
            </div>
            <div>
              <span style={styles.label}>Scheduled Window</span>
              <p style={styles.value}>
                {formatDateTime(visit.startTime)} - {formatDateTime(visit.endTime)}
              </p>
            </div>
            {visit.hasElevatedAccess && visit.customerEmail && (
              <div>
                <span style={styles.label}>Direct Patient Email (Elevated Access)</span>
                <p style={styles.value}>{visit.customerEmail}</p>
              </div>
            )}
            <div>
              <span style={styles.label}>Service Address</span>
              <p style={styles.value}>
                {visit.addressStreet}, {visit.addressCity}, {visit.addressState} {visit.addressPostalCode}
              </p>
            </div>
          </div>
        </div>

        {/* Intake Notes */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Customer Intake & Access Instructions</h2>
          {visit.customerIntakeNotes ? (
            <div style={styles.intakeCard}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#0f766e", lineHeight: 1.5 }}>
                {visit.customerIntakeNotes}
              </p>
            </div>
          ) : (
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
              No special intake or entry instructions provided by patient.
            </p>
          )}
        </div>

        {/* Assigned Team */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Care Team</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {visit.assignedStaff.map((staff) => (
              <span key={staff.staffId} style={styles.staffTag}>
                {staff.name} {staff.specialty ? `(${staff.specialty})` : ""}
                {staff.isParticipating && <strong style={{ color: "#0f766e" }}> • Participated</strong>}
              </span>
            ))}
          </div>
        </div>

        {/* Operational Actions */}
        {visit.status === "CONFIRMED" && (
          <div style={styles.actionSection}>
            <button
              onClick={() => handleStatusTransition("EN_ROUTE")}
              disabled={transitioning}
              style={styles.primaryActionButton}
            >
              {transitioning ? "Updating..." : "🚗 Start Travel (Mark En Route)"}
            </button>
          </div>
        )}

        {visit.status === "EN_ROUTE" && (
          <div style={styles.actionSection}>
            <button
              onClick={() => handleStatusTransition("IN_PROGRESS")}
              disabled={transitioning}
              style={styles.primaryActionButton}
            >
              {transitioning ? "Updating..." : "📍 Arrived On-Site (Start Care)"}
            </button>
          </div>
        )}

        {visit.status === "IN_PROGRESS" && (
          <div style={styles.actionSection}>
            <button
              onClick={() => setShowCompleteModal(true)}
              style={styles.completeActionButton}
            >
              ✓ Complete Visit & Submit Clinical Notes
            </button>
          </div>
        )}

        {/* Completed Record View */}
        {visit.status === "COMPLETED" && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Completed Visit Record</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={styles.notesBox}>
                <span style={styles.notesLabel}>Internal Care Notes (Clinical / Staff Only):</span>
                <p style={styles.notesText}>{visit.staffNotes || "No internal notes recorded."}</p>
              </div>

              <div style={{ ...styles.notesBox, backgroundColor: "#f0fdfa", borderColor: "#ccfbf1" }}>
                <span style={{ ...styles.notesLabel, color: "#0f766e" }}>
                  Customer Care Summary (Shared with Patient):
                </span>
                <p style={{ ...styles.notesText, color: "#134e4a" }}>
                  {visit.customerSummary || "No customer summary recorded."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {showCompleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Complete Care Visit</h2>
              <button
                onClick={() => setShowCompleteModal(false)}
                style={styles.modalCloseButton}
                disabled={completing}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteVisit}>
              <div style={styles.modalBody}>
                {completionError && <div style={styles.errorBanner}>{completionError}</div>}

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    Internal Clinical Notes <span style={{ color: "#b91c1c" }}>*</span>
                    <span style={styles.fieldHint}>
                      (Internal operational documentation for staff/admin only. NEVER shared with patient).
                    </span>
                  </label>
                  <textarea
                    required
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    rows={4}
                    placeholder="Document vitals, clinical observations, caregiver actions..."
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    Customer Care Summary <span style={{ color: "#b91c1c" }}>*</span>
                    <span style={styles.fieldHint}>
                      (Sanitized recap visible to patient and family in their booking record).
                    </span>
                  </label>
                  <textarea
                    required
                    value={customerSummary}
                    onChange={(e) => setCustomerSummary(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="E.g., Routine health check completed. Blood pressure within normal range..."
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Participating Staff</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {visit.assignedStaff
                      .filter((s) => s.isActive)
                      .map((s) => (
                        <label key={s.staffId} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(s.staffId)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedParticipants([...selectedParticipants, s.staffId]);
                              } else {
                                setSelectedParticipants(selectedParticipants.filter((id) => id !== s.staffId));
                              }
                            }}
                          />
                          <span>{s.name} ({s.specialty || "Caregiver"})</span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  disabled={completing}
                  style={styles.modalCancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completing}
                  style={styles.modalConfirmButton}
                >
                  {completing ? "Submitting..." : "Complete & Finalize"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    maxWidth: "800px",
    margin: "0 auto 1.5rem",
  },
  backButton: {
    fontSize: "0.875rem",
    color: "#0f766e",
    textDecoration: "none",
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  bookingRef: {
    fontSize: "0.8125rem",
    color: "#64748b",
    fontFamily: "monospace",
  },
  statusPill: {
    padding: "0.375rem 0.875rem",
    borderRadius: "9999px",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase",
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.5rem 2rem",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  progressStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.375rem",
  },
  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#cbd5e1",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.875rem",
  },
  stepCircleActive: {
    backgroundColor: "#0f766e",
  },
  stepLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#475569",
  },
  progressLine: {
    flex: 1,
    height: "2px",
    backgroundColor: "#e2e8f0",
    margin: "0 0.5rem 1.25rem",
  },
  section: {
    padding: "1.5rem 2rem",
    borderBottom: "1px solid #f1f5f9",
  },
  sectionTitle: {
    margin: "0 0 1rem",
    fontSize: "0.875rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748b",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
  },
  label: {
    fontSize: "0.75rem",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  value: {
    margin: "0.25rem 0 0",
    fontSize: "0.95rem",
    color: "#1e293b",
    fontWeight: 500,
  },
  intakeCard: {
    padding: "1rem",
    backgroundColor: "#f0fdfa",
    borderRadius: "8px",
    border: "1px solid #ccfbf1",
  },
  staffTag: {
    padding: "0.375rem 0.75rem",
    backgroundColor: "#f1f5f9",
    borderRadius: "6px",
    fontSize: "0.8125rem",
    color: "#334155",
  },
  actionSection: {
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  primaryActionButton: {
    padding: "1rem 2rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  completeActionButton: {
    padding: "1rem 2rem",
    backgroundColor: "#166534",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  notesBox: {
    padding: "1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  notesLabel: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    marginBottom: "0.375rem",
  },
  notesText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#1e293b",
    lineHeight: 1.5,
  },
  errorBanner: {
    maxWidth: "800px",
    margin: "0 auto 1.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    fontSize: "0.875rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  modalCloseButton: {
    background: "none",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#64748b",
  },
  modalBody: {
    padding: "1.5rem",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  formLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#1e293b",
  },
  fieldHint: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 400,
    color: "#64748b",
    marginTop: "0.15rem",
  },
  textarea: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  modalFooter: {
    padding: "1.25rem 1.5rem",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
  },
  modalCancelButton: {
    padding: "0.625rem 1rem",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  modalConfirmButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    color: "#64748b",
  },
};
