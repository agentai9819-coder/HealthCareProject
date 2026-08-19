"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminStaffPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Create staff modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone, setPhone] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/staff`, { credentials: "include" });
      if (res.status === 401 || res.status === 403) {
        router.push("/staff/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStaffList(data.data || []);
      } else {
        setError(data.error || "Failed to load staff members");
      }
    } catch {
      setError("Network error loading staff list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleToggleStatus = async (staffId: string, currentStatus: boolean) => {
    const actionName = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${actionName} this staff member?`)) return;

    try {
      const res = await fetch(`${API_BASE}/admin/staff/${staffId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`Staff member successfully ${currentStatus ? "deactivated" : "activated"}.`);
        await fetchStaff();
      } else {
        setError(data.error || `Failed to ${actionName} staff member`);
      }
    } catch {
      setError(`Network error trying to ${actionName} staff member`);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch(`${API_BASE}/admin/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          specialty: specialty || undefined,
          phone: phone || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowCreateModal(false);
        setName("");
        setEmail("");
        setPassword("");
        setSpecialty("");
        setPhone("");
        setSuccessMessage("Staff account created successfully.");
        await fetchStaff();
      } else {
        setCreateError(data.error || "Failed to create staff account");
      }
    } catch {
      setCreateError("Network error creating staff account");
    } finally {
      setCreating(false);
    }
  };

  const handleExportXLSX = () => {
    window.location.href = `${API_BASE}/admin/staff/export/history`;
  };

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading staff directory...</div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={styles.badge}>Admin Operations</span>
              <Link href="/admin/dispatch" style={styles.navLink}>
                Dispatch Dashboard →
              </Link>
            </div>
            <h1 style={styles.title}>Staff Directory & Administration</h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={handleExportXLSX} style={styles.exportButton}>
              📊 Export Staff History (.XLSX)
            </button>
            <button onClick={() => setShowCreateModal(true)} style={styles.createButton}>
              + Add Caregiver
            </button>
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
              <th style={styles.th}>Name & Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Specialty</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((member) => (
              <tr key={member.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{member.name}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{member.email}</div>
                </td>
                <td style={styles.td}>
                  <span style={styles.roleTag}>{member.role}</span>
                </td>
                <td style={styles.td}>{member.specialty || "General Care"}</td>
                <td style={styles.td}>{member.phone || "—"}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusTag,
                      backgroundColor: member.isActive ? "#dcfce7" : "#fee2e2",
                      color: member.isActive ? "#166534" : "#991b1b",
                    }}
                  >
                    {member.isActive ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleToggleStatus(member.id, member.isActive)}
                    style={{
                      ...styles.actionBtn,
                      color: member.isActive ? "#b91c1c" : "#0f766e",
                      borderColor: member.isActive ? "#fecaca" : "#ccfbf1",
                      backgroundColor: member.isActive ? "#fef2f2" : "#f0fdfa",
                    }}
                  >
                    {member.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Onboard New Staff Member</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={styles.closeBtn}
                disabled={creating}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff}>
              <div style={styles.modalBody}>
                {createError && <div style={styles.errorBanner}>{createError}</div>}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe, RN"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@healthcare.local"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Initial Password * (min 8 chars)</label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Clinical Specialty / Role</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="E.g., Pediatric Nursing, Physical Therapy"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={styles.confirmBtn}
                >
                  {creating ? "Creating..." : "Create Staff Account"}
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
    maxWidth: "1100px",
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
  exportButton: {
    padding: "0.625rem 1rem",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#334155",
    cursor: "pointer",
  },
  createButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  card: {
    maxWidth: "1100px",
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
  },
  roleTag: {
    padding: "0.2rem 0.5rem",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  statusTag: {
    padding: "0.25rem 0.625rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  actionBtn: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  successBanner: {
    maxWidth: "1100px",
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
    maxWidth: "1100px",
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
