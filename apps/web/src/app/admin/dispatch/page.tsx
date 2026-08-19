"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface AssignedStaff {
  assignmentId: string;
  staffId: string;
  name: string;
  role: string;
  specialty?: string | null;
  isActive: boolean;
  isParticipating: boolean;
  hasElevatedAccess: boolean;
  assignedAt: string;
  unassignedAt?: string | null;
  reassignmentReason?: string | null;
}

interface VisitOverview {
  id: string;
  bookingId: string;
  status: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  customerIntakeNotes?: string | null;
  enRouteAt?: string | null;
  inProgressAt?: string | null;
  completedAt?: string | null;
  completedByStaffId?: string | null;
  completedByName?: string | null;
  staffNotes?: string | null;
  customerSummary?: string | null;
  assignedStaff: AssignedStaff[];
}

interface StaffOption {
  id: string;
  name: string;
  role: string;
  specialty?: string | null;
  isActive: boolean;
}

export default function AdminDispatchPage() {
  const router = useRouter();
  const [visits, setVisits] = useState<VisitOverview[]>([]);
  const [allStaff, setAllStaff] = useState<StaffOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Assign modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [targetVisitId, setTargetVisitId] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");

  // Reassign modal state
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignVisit, setReassignVisit] = useState<VisitOverview | null>(null);
  const [removeStaffId, setRemoveStaffId] = useState("");
  const [addStaffId, setAddStaffId] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  const [reassigning, setReassigning] = useState(false);
  const [reassignError, setReassignError] = useState("");

  const fetchData = async () => {
    try {
      // 1. Fetch visits overview
      const visitsRes = await fetch(`${API_BASE}/admin/visits`, { credentials: "include" });
      if (visitsRes.status === 401 || visitsRes.status === 403) {
        router.push("/staff/login");
        return;
      }
      const visitsData = await visitsRes.json();
      if (visitsData.success) {
        setVisits(visitsData.data || []);
      }

      // 2. Fetch staff list
      const staffRes = await fetch(`${API_BASE}/admin/staff`, { credentials: "include" });
      const staffData = await staffRes.json();
      if (staffData.success) {
        setAllStaff(staffData.data || []);
      }
    } catch {
      setError("Network error loading dispatch dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAssign = (visitId: string) => {
    setTargetVisitId(visitId);
    setSelectedStaffIds([]);
    setAssignError("");
    setShowAssignModal(true);
  };

  const handleConfirmAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaffIds.length === 0) return;
    setAssigning(true);
    setAssignError("");

    try {
      const res = await fetch(`${API_BASE}/admin/visits/${targetVisitId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ staffIds: selectedStaffIds }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowAssignModal(false);
        setSuccessMessage("Staff assigned to visit successfully.");
        await fetchData();
      } else {
        setAssignError(data.error || "Failed to assign staff");
      }
    } catch {
      setAssignError("Network error assigning staff");
    } finally {
      setAssigning(false);
    }
  };

  const handleOpenReassign = (visit: VisitOverview) => {
    setReassignVisit(visit);
    const activeStaff = visit.assignedStaff.filter((s) => s.isActive);
    setRemoveStaffId(activeStaff[0]?.staffId || "");
    setAddStaffId("");
    setReassignReason("");
    setReassignError("");
    setShowReassignModal(true);
  };

  const handleConfirmReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignVisit || !removeStaffId || !addStaffId || !reassignReason) return;
    setReassigning(true);
    setReassignError("");

    try {
      const res = await fetch(`${API_BASE}/admin/visits/${reassignVisit.id}/reassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          removeStaffId,
          addStaffId,
          reason: reassignReason,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowReassignModal(false);
        setSuccessMessage("Visit caregiver reassigned successfully with audit record.");
        await fetchData();
      } else {
        setReassignError(data.error || "Failed to reassign visit staff");
      }
    } catch {
      setReassignError("Network error reassigning visit staff");
    } finally {
      setReassigning(false);
    }
  };

  const handleToggleElevatedAccess = async (visitId: string, staffId: string, currentAccess: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/admin/visits/${visitId}/assignments/${staffId}/access`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hasElevatedAccess: !currentAccess }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`Elevated access ${!currentAccess ? "granted" : "revoked"} for caregiver on this visit.`);
        await fetchData();
      } else {
        setError(data.error || "Failed to update elevated access");
      }
    } catch {
      setError("Network error updating elevated access");
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

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading dispatch overview...</div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={styles.badge}>Operations Hub</span>
              <Link href="/admin/staff" style={styles.navLink}>
                Staff Directory & Onboarding →
              </Link>
            </div>
            <h1 style={styles.title}>Visit Dispatch & Care Coordination</h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/staff/schedule" style={styles.caregiverViewBtn}>
              Caregiver Schedule View
            </Link>
          </div>
        </div>
      </header>

      {successMessage && (
        <div style={styles.successBanner}>
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} style={styles.dismissBtn}>×</button>
        </div>
      )}

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Service & Patient</th>
              <th style={styles.th}>Scheduled Time</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Assigned Caregivers</th>
              <th style={styles.th}>Dispatch Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => {
              const activeAssignments = visit.assignedStaff.filter((s) => s.isActive);
              const isTerminal = visit.status === "COMPLETED" || visit.status === "CANCELLED";
              const isProgress = visit.status === "IN_PROGRESS";

              return (
                <tr key={visit.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{visit.serviceName}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                      Patient: <strong>{visit.customerName}</strong> ({visit.customerEmail})
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.15rem" }}>
                      {visit.addressCity}, {visit.addressState}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{formatDateTime(visit.startTime)}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      Duration: {Math.round((new Date(visit.endTime).getTime() - new Date(visit.startTime).getTime()) / 60000)}m
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusPill}>{visit.status}</span>
                  </td>
                  <td style={styles.td}>
                    {activeAssignments.length === 0 ? (
                      <span style={{ color: "#e11d48", fontWeight: 600, fontSize: "0.8125rem" }}>
                        ⚠️ Unassigned
                      </span>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {activeAssignments.map((staff) => (
                          <div key={staff.assignmentId} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{staff.name}</span>
                            <button
                              onClick={() => handleToggleElevatedAccess(visit.id, staff.staffId, staff.hasElevatedAccess)}
                              title={staff.hasElevatedAccess ? "Revoke direct patient email access" : "Grant direct patient email access"}
                              style={{
                                ...styles.accessPill,
                                backgroundColor: staff.hasElevatedAccess ? "#ccfbf1" : "#f1f5f9",
                                color: staff.hasElevatedAccess ? "#0f766e" : "#64748b",
                              }}
                            >
                              {staff.hasElevatedAccess ? "🔓 Elevated Access" : "🔒 Standard"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>
                    {!isTerminal && (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleOpenAssign(visit.id)}
                          style={styles.assignBtn}
                        >
                          + Assign Staff
                        </button>
                        {!isProgress && activeAssignments.length > 0 && (
                          <button
                            onClick={() => handleOpenReassign(visit)}
                            style={styles.reassignBtn}
                          >
                            Reassign
                          </button>
                        )}
                      </div>
                    )}
                    {isTerminal && <span style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>Closed</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Assign Staff Modal */}
      {showAssignModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Assign Caregivers to Visit</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                style={styles.closeBtn}
                disabled={assigning}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAssign}>
              <div style={styles.modalBody}>
                {assignError && <div style={styles.errorBanner}>{assignError}</div>}
                <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "#64748b" }}>
                  Select one or more active staff members to assign to this visit.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {allStaff
                    .filter((s) => s.isActive)
                    .map((staff) => (
                      <label key={staff.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                        <input
                          type="checkbox"
                          checked={selectedStaffIds.includes(staff.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStaffIds([...selectedStaffIds, staff.id]);
                            } else {
                              setSelectedStaffIds(selectedStaffIds.filter((id) => id !== staff.id));
                            }
                          }}
                        />
                        <span>
                          <strong>{staff.name}</strong> ({staff.specialty || "Caregiver"})
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  disabled={assigning}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedStaffIds.length === 0 || assigning}
                  style={styles.confirmBtn}
                >
                  {assigning ? "Assigning..." : "Confirm Staff Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {showReassignModal && reassignVisit && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Reassign Visit Caregiver</h2>
              <button
                onClick={() => setShowReassignModal(false)}
                style={styles.closeBtn}
                disabled={reassigning}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReassign}>
              <div style={styles.modalBody}>
                {reassignError && <div style={styles.errorBanner}>{reassignError}</div>}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Caregiver to Remove *</label>
                  <select
                    required
                    value={removeStaffId}
                    onChange={(e) => setRemoveStaffId(e.target.value)}
                    style={styles.select}
                  >
                    {reassignVisit.assignedStaff
                      .filter((s) => s.isActive)
                      .map((s) => (
                        <option key={s.staffId} value={s.staffId}>
                          {s.name} ({s.specialty || "Caregiver"})
                        </option>
                      ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Replacement Caregiver *</label>
                  <select
                    required
                    value={addStaffId}
                    onChange={(e) => setAddStaffId(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select replacement caregiver...</option>
                    {allStaff
                      .filter((s) => s.isActive && s.id !== removeStaffId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.specialty || "Caregiver"})
                        </option>
                      ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Reassignment Reason * (Recorded in Audit Trail)</label>
                  <input
                    required
                    type="text"
                    value={reassignReason}
                    onChange={(e) => setReassignReason(e.target.value)}
                    placeholder="E.g., Caregiver schedule conflict, vehicle breakdown..."
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowReassignModal(false)}
                  disabled={reassigning}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!removeStaffId || !addStaffId || !reassignReason || reassigning}
                  style={styles.confirmBtn}
                >
                  {reassigning ? "Reassigning..." : "Confirm Reassignment"}
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
    maxWidth: "1200px",
    margin: "0 auto 1.5rem",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badge: {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  navLink: {
    fontSize: "0.8125rem",
    color: "#0f766e",
    fontWeight: 600,
    textDecoration: "none",
  },
  title: {
    margin: "0.5rem 0 0",
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  caregiverViewBtn: {
    padding: "0.625rem 1rem",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#334155",
    textDecoration: "none",
  },
  card: {
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    textAlign: "left" as const,
  },
  th: {
    padding: "1rem 1.25rem",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "1rem 1.25rem",
    fontSize: "0.875rem",
    color: "#334155",
    verticalAlign: "top",
  },
  statusPill: {
    display: "inline-block",
    padding: "0.25rem 0.625rem",
    borderRadius: "9999px",
    backgroundColor: "#f1f5f9",
    color: "#334155",
    fontWeight: 700,
    fontSize: "0.75rem",
  },
  accessPill: {
    padding: "0.15rem 0.4rem",
    borderRadius: "4px",
    border: "none",
    fontSize: "0.6875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  assignBtn: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    backgroundColor: "#f0fdfa",
    border: "1px solid #ccfbf1",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.8125rem",
    cursor: "pointer",
  },
  reassignBtn: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    color: "#b45309",
    fontWeight: 600,
    fontSize: "0.8125rem",
    cursor: "pointer",
  },
  successBanner: {
    maxWidth: "1200px",
    margin: "0 auto 1.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    color: "#065f46",
    fontSize: "0.875rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dismissBtn: {
    background: "none",
    border: "none",
    color: "#065f46",
    fontSize: "1.25rem",
    cursor: "pointer",
  },
  errorBanner: {
    maxWidth: "1200px",
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
    maxWidth: "500px",
    width: "100%",
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
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#64748b",
  },
  modalBody: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  label: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#1e293b",
  },
  input: {
    padding: "0.625rem 0.875rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
  },
  select: {
    padding: "0.625rem 0.875rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    backgroundColor: "#ffffff",
  },
  modalFooter: {
    padding: "1.25rem 1.5rem",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
  },
  cancelBtn: {
    padding: "0.625rem 1rem",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  confirmBtn: {
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
