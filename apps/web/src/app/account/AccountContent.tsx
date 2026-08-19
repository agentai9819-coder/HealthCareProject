"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface CustomerNameObj {
  firstName: string;
  lastName: string;
}

interface CustomerProfileData {
  id: string;
  name: CustomerNameObj | string;
  email: string;
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export function AccountContent() {
  const router = useRouter();

  // Profile state
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Address state
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [addressSuccess, setAddressSuccess] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressSaving, setAddressSaving] = useState(false);

  // Address form fields
  const [labelInput, setLabelInput] = useState("Home");
  const [streetInput, setStreetInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [postalCodeInput, setPostalCodeInput] = useState("");
  const [isDefaultInput, setIsDefaultInput] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API_BASE}/customers/me/addresses`, {
        credentials: "include",
      });
      if (res.status === 401) {
        setIsUnauthorized(true);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data || []);
      }
    } catch {
      setAddressError("Failed to load saved addresses.");
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE}/customers/me`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          setIsUnauthorized(true);
          throw new Error("UNAUTHORIZED");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          const cust = data.data;
          setProfile(cust);

          let fName = "";
          let lName = "";
          if (typeof cust.name === "object" && cust.name !== null) {
            fName = cust.name.firstName || "";
            lName = cust.name.lastName || "";
          } else if (typeof cust.name === "string") {
            const parts = cust.name.split(" ");
            fName = parts[0] || "";
            lName = parts.slice(1).join(" ") || "";
          }
          setFirstName(fName);
          setLastName(lName);
          setInitialFirstName(fName);
          setInitialLastName(lName);
          fetchAddresses();
        } else {
          setProfileError(data.error || "Failed to load profile");
        }
      })
      .catch((err) => {
        if (err.message !== "UNAUTHORIZED") {
          setProfileError("Network error. Please try again.");
        }
      })
      .finally(() => setProfileLoading(false));
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!firstName.trim() || !lastName.trim()) {
      setProfileError("First name and last name are required.");
      return;
    }

    setProfileSaving(true);
    try {
      const res = await fetch(`${API_BASE}/customers/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Failed to update profile");
        return;
      }

      setProfile(data.data);
      setInitialFirstName(firstName.trim());
      setInitialLastName(lastName.trim());
      setProfileSuccess("Profile updated successfully!");
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileCancel = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setProfileError("");
    setProfileSuccess("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch(`${API_BASE}/customers/me/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password");
        return;
      }

      setPasswordSuccess(
        data.message || "Password updated successfully. Redirecting to login..."
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch {
      setPasswordError("Network error. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setLabelInput("Home");
    setStreetInput("");
    setCityInput("");
    setStateInput("");
    setPostalCodeInput("");
    setIsDefaultInput(addresses.length === 0);
    setAddressError("");
    setAddressSuccess("");
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setLabelInput(addr.label);
    setStreetInput(addr.street);
    setCityInput(addr.city);
    setStateInput(addr.state);
    setPostalCodeInput(addr.postalCode);
    setIsDefaultInput(addr.isDefault);
    setAddressError("");
    setAddressSuccess("");
    setAddressModalOpen(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");
    setAddressSuccess("");

    if (!streetInput.trim() || !cityInput.trim() || !stateInput.trim() || !postalCodeInput.trim()) {
      setAddressError("Street, City, State, and Postal Code are required.");
      return;
    }

    if (stateInput.trim().length !== 2) {
      setAddressError("State must be a 2-letter state code (e.g. NY).");
      return;
    }

    setAddressSaving(true);

    try {
      const isEditing = Boolean(editingAddressId);
      const url = isEditing
        ? `${API_BASE}/customers/me/addresses/${editingAddressId}`
        : `${API_BASE}/customers/me/addresses`;
      const method = isEditing ? "PATCH" : "POST";

      const payload: Record<string, unknown> = {
        label: labelInput.trim() || "Home",
        street: streetInput.trim(),
        city: cityInput.trim(),
        state: stateInput.trim().toUpperCase(),
        postalCode: postalCodeInput.trim(),
      };

      if (!isEditing || isDefaultInput !== undefined) {
        payload.isDefault = isDefaultInput;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setAddressError(data.error || "Failed to save address");
        return;
      }

      setAddressSuccess(isEditing ? "Address updated successfully!" : "Address added successfully!");
      setAddressModalOpen(false);
      fetchAddresses();
    } catch {
      setAddressError("Network error. Please try again.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSetDefault = async (addrId: string) => {
    setAddressError("");
    setAddressSuccess("");
    try {
      const res = await fetch(`${API_BASE}/customers/me/addresses/${addrId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isDefault: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAddressError(data.error || "Failed to set default address");
        return;
      }

      setAddressSuccess("Default address updated successfully!");
      fetchAddresses();
    } catch {
      setAddressError("Network error. Please try again.");
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!window.confirm("Are you sure you want to delete this saved address?")) {
      return;
    }

    setAddressError("");
    setAddressSuccess("");
    try {
      const res = await fetch(`${API_BASE}/customers/me/addresses/${addrId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setAddressError(data.error || "Failed to delete address");
        return;
      }

      setAddressSuccess("Address deleted successfully!");
      fetchAddresses();
    } catch {
      setAddressError("Network error. Please try again.");
    }
  };

  if (profileLoading) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>Loading your account settings...</div>
      </main>
    );
  }

  if (isUnauthorized) {
    return (
      <main style={styles.main}>
        <div style={styles.cardEmpty}>
          <div style={styles.emptyIcon}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 style={styles.emptyTitle}>Sign in required</h2>
          <p style={styles.emptyText}>
            Please sign in to access your account settings.
          </p>
          <Link href="/auth/login" style={styles.primaryButton}>
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const isProfileDirty =
    firstName.trim() !== initialFirstName ||
    lastName.trim() !== initialLastName;

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Account Settings</h1>
          <p style={styles.subtitle}>
            Manage your personal profile information, saved addresses, and security preferences
          </p>
        </header>

        <div style={styles.cardsGrid}>
          {/* Profile Information */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 style={styles.cardTitle}>Profile Information</h2>
                <p style={styles.cardSubtitle}>
                  Update your name and view account details
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} style={styles.cardBody}>
              {profileError && (
                <div style={styles.errorAlert}>{profileError}</div>
              )}
              {profileSuccess && (
                <div style={styles.successAlert}>{profileSuccess}</div>
              )}

              <div style={styles.fieldRow}>
                <div style={styles.field}>
                  <label htmlFor="firstName" style={styles.label}>
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setProfileError("");
                      setProfileSuccess("");
                    }}
                    required
                    maxLength={50}
                    style={styles.input}
                    autoComplete="given-name"
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="lastName" style={styles.label}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setProfileError("");
                      setProfileSuccess("");
                    }}
                    required
                    maxLength={50}
                    style={styles.input}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div style={styles.field}>
                <div style={styles.labelRow}>
                  <label htmlFor="email" style={styles.label}>
                    Email Address
                  </label>
                  <span style={styles.readOnlyBadge}>Read-only</span>
                </div>
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  style={{ ...styles.input, ...styles.inputDisabled }}
                />
                <span style={styles.helperText}>
                  Email address is permanently linked to your account and cannot
                  be modified.
                </span>
              </div>

              <div style={styles.buttonRow}>
                {isProfileDirty && (
                  <button
                    type="button"
                    onClick={handleProfileCancel}
                    disabled={profileSaving}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={profileSaving || !isProfileDirty}
                  style={{
                    ...styles.primaryButton,
                    ...(!isProfileDirty ? styles.buttonDisabled : {}),
                  }}
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Saved Service Addresses */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={styles.cardTitle}>Saved Service Addresses</h2>
                <p style={styles.cardSubtitle}>
                  Manage care visit addresses for faster appointment booking
                </p>
              </div>
              <button
                type="button"
                onClick={openNewAddressModal}
                style={styles.primaryButton}
              >
                + Add Address
              </button>
            </div>

            <div style={styles.cardBody}>
              {addressError && (
                <div style={styles.errorAlert}>{addressError}</div>
              )}
              {addressSuccess && (
                <div style={styles.successAlert}>{addressSuccess}</div>
              )}

              {addressesLoading ? (
                <div style={styles.helperText}>Loading saved addresses...</div>
              ) : addresses.length === 0 ? (
                <div style={styles.emptyAddressBox}>
                  <p style={{ margin: 0, color: "#64748b" }}>
                    No saved addresses found. Add an address to simplify your care visit bookings.
                  </p>
                </div>
              ) : (
                <div style={styles.addressList}>
                  {addresses.map((addr) => (
                    <div key={addr.id} style={styles.addressCard}>
                      <div style={styles.addressHeader}>
                        <div style={styles.addressBadgeRow}>
                          <span style={styles.labelBadge}>{addr.label}</span>
                          {addr.isDefault && (
                            <span style={styles.defaultBadge}>Default</span>
                          )}
                        </div>
                        <div style={styles.addressActions}>
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(addr.id)}
                              style={styles.actionLink}
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditAddressModal(addr)}
                            style={styles.actionLink}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            style={styles.deleteActionLink}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div style={styles.addressText}>
                        <div>{addr.street}</div>
                        <div>
                          {addr.city}, {addr.state} {addr.postalCode}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add / Edit Address Form Modal */}
          {addressModalOpen && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>
                  {editingAddressId ? "Edit Saved Address" : "Add New Saved Address"}
                </h3>
                <form onSubmit={handleAddressSubmit} style={styles.modalForm}>
                  <div style={styles.field}>
                    <label style={styles.label}>Address Label</label>
                    <input
                      type="text"
                      value={labelInput}
                      onChange={(e) => setLabelInput(e.target.value)}
                      placeholder="e.g. Home, Work, Parents"
                      maxLength={50}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Street Address</label>
                    <input
                      type="text"
                      value={streetInput}
                      onChange={(e) => setStreetInput(e.target.value)}
                      placeholder="e.g. 100 Broadway"
                      required
                      maxLength={200}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.fieldRow}>
                    <div style={{ ...styles.field, flex: 2 }}>
                      <label style={styles.label}>City</label>
                      <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        placeholder="e.g. New York"
                        required
                        maxLength={100}
                        style={styles.input}
                      />
                    </div>
                    <div style={{ ...styles.field, flex: 1 }}>
                      <label style={styles.label}>State (2-letter)</label>
                      <input
                        type="text"
                        value={stateInput}
                        onChange={(e) => setStateInput(e.target.value.toUpperCase())}
                        placeholder="NY"
                        required
                        maxLength={2}
                        style={styles.input}
                      />
                    </div>
                    <div style={{ ...styles.field, flex: 1 }}>
                      <label style={styles.label}>ZIP Code</label>
                      <input
                        type="text"
                        value={postalCodeInput}
                        onChange={(e) => setPostalCodeInput(e.target.value)}
                        placeholder="10001"
                        required
                        maxLength={20}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.checkboxRow}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={isDefaultInput}
                        onChange={(e) => setIsDefaultInput(e.target.checked)}
                        disabled={addresses.length === 0 || (editingAddressId !== null && addresses.find(a => a.id === editingAddressId)?.isDefault)}
                      />
                      <span style={{ fontSize: "0.875rem", color: "#334155" }}>
                        Set as default service address
                      </span>
                    </label>
                  </div>

                  <div style={styles.buttonRow}>
                    <button
                      type="button"
                      onClick={() => setAddressModalOpen(false)}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addressSaving}
                      style={styles.primaryButton}
                    >
                      {addressSaving ? "Saving..." : editingAddressId ? "Save Changes" : "Add Address"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Security & Credentials */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h2 style={styles.cardTitle}>Security & Credentials</h2>
                <p style={styles.cardSubtitle}>
                  Change your password to keep your account secure
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} style={styles.cardBody}>
              {passwordError && (
                <div style={styles.errorAlert}>{passwordError}</div>
              )}
              {passwordSuccess && (
                <div style={styles.successAlert}>{passwordSuccess}</div>
              )}

              <div style={styles.field}>
                <label htmlFor="currentPassword" style={styles.label}>
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                  style={styles.input}
                  autoComplete="current-password"
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="newPassword" style={styles.label}>
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                  minLength={8}
                  style={styles.input}
                  autoComplete="new-password"
                />
                <span style={styles.helperText}>
                  Minimum 8 characters. Must be different from your current
                  password.
                </span>
              </div>

              <div style={styles.field}>
                <label htmlFor="confirmPassword" style={styles.label}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                  style={styles.input}
                  autoComplete="new-password"
                />
              </div>

              <div style={styles.buttonRow}>
                <button
                  type="submit"
                  disabled={
                    passwordSaving ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  style={{
                    ...styles.primaryButton,
                    ...(!currentPassword || !newPassword || !confirmPassword
                      ? styles.buttonDisabled
                      : {}),
                  }}
                >
                  {passwordSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "calc(100vh - 65px)",
    padding: "2.5rem 1.5rem",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.375rem 0",
  },
  subtitle: {
    fontSize: "0.9375rem",
    color: "#64748b",
    margin: 0,
  },
  cardsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1.75rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    backgroundColor: "#fafafa",
  },
  cardIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "#f0fdfa",
    color: "#0f766e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.125rem 0",
  },
  cardSubtitle: {
    fontSize: "0.8125rem",
    color: "#64748b",
    margin: 0,
  },
  cardBody: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  fieldRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  field: {
    flex: 1,
    minWidth: "220px",
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#334155",
  },
  readOnlyBadge: {
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    padding: "0.125rem 0.5rem",
    borderRadius: "4px",
  },
  input: {
    padding: "0.625rem 0.875rem",
    fontSize: "0.9375rem",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  inputDisabled: {
    backgroundColor: "#f8fafc",
    color: "#64748b",
    cursor: "not-allowed",
    borderColor: "#e2e8f0",
  },
  helperText: {
    fontSize: "0.8125rem",
    color: "#64748b",
    marginTop: "0.125rem",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "0.75rem",
    marginTop: "0.5rem",
  },
  primaryButton: {
    backgroundColor: "#0f766e",
    color: "#ffffff",
    padding: "0.625rem 1.25rem",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.9375rem",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.15s",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    color: "#475569",
    padding: "0.625rem 1.25rem",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.9375rem",
    border: "1px solid #cbd5e1",
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  errorAlert: {
    padding: "0.875rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#b91c1c",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  successAlert: {
    padding: "0.875rem 1rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    color: "#15803d",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  loading: {
    textAlign: "center",
    padding: "4rem 0",
    color: "#64748b",
    fontSize: "1.125rem",
  },
  cardEmpty: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "3rem 2rem",
    textAlign: "center",
    maxWidth: "500px",
    margin: "3rem auto",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
  },
  emptyIcon: {
    color: "#94a3b8",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 0.5rem 0",
  },
  emptyText: {
    fontSize: "0.9375rem",
    color: "#64748b",
    margin: "0 0 1.5rem 0",
  },
  emptyAddressBox: {
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px dashed #cbd5e1",
    backgroundColor: "#f8fafc",
    textAlign: "center",
  },
  addressList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  addressCard: {
    padding: "1rem 1.25rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  addressHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressBadgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  labelBadge: {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  defaultBadge: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#0f766e",
    backgroundColor: "#ccfbf1",
    padding: "0.125rem 0.5rem",
    borderRadius: "9999px",
  },
  addressActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  actionLink: {
    background: "none",
    border: "none",
    color: "#0f766e",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
  },
  deleteActionLink: {
    background: "none",
    border: "none",
    color: "#b91c1c",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
  },
  addressText: {
    fontSize: "0.9375rem",
    color: "#334155",
    lineHeight: 1.4,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "1.75rem",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 1.25rem 0",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  checkboxRow: {
    marginTop: "0.25rem",
  },
};
