"use client";

import { useState } from "react";
import Link from "next/link";
import { contactContent } from "../../content/marketing/contact";

export default function ContactPage() {
  const { header, channels, serviceAreasNotice, emergencyNotice } = contactContent;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceInterest: "Home Health Assessment",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={styles.main}>
      {/* Header */}
      <section style={styles.headerSection}>
        <div style={styles.container}>
          <span style={styles.badge}>{header.badge}</span>
          <h1 style={styles.title}>{header.title}</h1>
          <p style={styles.subtitle}>{header.subtitle}</p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section style={styles.contentSection}>
        <div style={styles.container}>
          <div style={styles.grid}>
            {/* Left: Contact Form */}
            <div style={styles.formCard}>
              <h2 style={styles.cardHeading}>Send Our Care Team a Message</h2>
              <p style={styles.cardSubtext}>
                Fill out the form below and a care coordinator will contact you directly to answer your questions.
              </p>

              {submitted ? (
                <div style={styles.successBox}>
                  <div style={styles.successIcon}>✓</div>
                  <h3 style={styles.successTitle}>Inquiry Received</h3>
                  <p style={styles.successText}>
                    Thank you for reaching out. A HomeCare clinical coordinator will review your request and contact you within 1 business day.
                  </p>
                  <button onClick={() => setSubmitted(false)} style={styles.resetButton}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label htmlFor="contact-name" style={styles.label}>
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label htmlFor="contact-email" style={styles.label}>
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label htmlFor="contact-phone" style={styles.label}>
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="contact-service" style={styles.label}>
                      Service of Interest
                    </label>
                    <select
                      id="contact-service"
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      style={styles.select}
                    >
                      <option value="Home Health Assessment">Home Health Assessment</option>
                      <option value="Physical Therapy & Mobility">Physical Therapy & Mobility</option>
                      <option value="Wound Care & Dressing">Wound Care & Dressing</option>
                      <option value="General Inquiry">General Inquiry / Other</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="contact-message" style={styles.label}>
                      How can we help? *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details about your care needs or questions..."
                      style={styles.textarea}
                    />
                  </div>

                  <button type="submit" style={styles.submitButton}>
                    Submit Care Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Right: Contact Information & Channels */}
            <div style={styles.infoCol}>
              <div style={styles.channelsCard}>
                <h2 style={styles.channelsTitle}>Direct Contact Channels</h2>
                <div style={styles.channelList}>
                  {channels.map((ch, idx) => (
                    <div key={idx} style={styles.channelItem}>
                      <div style={styles.channelIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {ch.icon === "phone" && (
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          )}
                          {ch.icon === "mail" && (
                            <>
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </>
                          )}
                          {ch.icon === "map-pin" && (
                            <>
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </>
                          )}
                        </svg>
                      </div>
                      <div>
                        <h3 style={styles.chTitle}>{ch.title}</h3>
                        <p style={styles.chValue}>{ch.value}</p>
                        <p style={styles.chSub}>{ch.subtext}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas Box */}
              <div style={styles.areaBox}>
                <h3 style={styles.areaTitle}>{serviceAreasNotice.title}</h3>
                <p style={styles.areaText}>{serviceAreasNotice.summary}</p>
                <Link href={serviceAreasNotice.cta.href} style={styles.areaLink}>
                  {serviceAreasNotice.cta.text} →
                </Link>
              </div>

              {/* Emergency Guidance Box */}
              <div style={styles.emergencyCard}>
                <h3 style={styles.emergencyTitle}>{emergencyNotice.title}</h3>
                <p style={styles.emergencyText}>{emergencyNotice.text}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  headerSection: {
    backgroundColor: "#ffffff",
    padding: "4.5rem 1.5rem 3.5rem",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)",
    textAlign: "center",
  },
  container: {
    maxWidth: "1120px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "0.35rem 0.85rem",
    borderRadius: "9999px",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "clamp(2rem, 4vw, 2.75rem)",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 1rem 0",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#475569",
    lineHeight: 1.6,
    maxWidth: "720px",
    margin: "0 auto",
  },
  contentSection: {
    padding: "4.5rem 1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "3rem",
    alignItems: "flex-start",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    padding: "2.5rem",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
  },
  cardHeading: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 0.5rem 0",
  },
  cardSubtext: {
    fontSize: "0.9375rem",
    color: "#64748b",
    lineHeight: 1.5,
    margin: "0 0 2rem 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#334155",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9375rem",
    color: "#0f172a",
    outline: "none",
  },
  select: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9375rem",
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },
  textarea: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9375rem",
    color: "#0f172a",
    fontFamily: "inherit",
    resize: "vertical",
  },
  submitButton: {
    marginTop: "0.5rem",
    padding: "0.875rem",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  successBox: {
    backgroundColor: "#f0fdfa",
    border: "1px solid #ccfbf1",
    borderRadius: "12px",
    padding: "2rem",
    textAlign: "center",
  },
  successIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#0f766e",
    color: "#ffffff",
    fontSize: "1.5rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
  },
  successTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f766e",
    margin: "0 0 0.5rem 0",
  },
  successText: {
    fontSize: "0.9375rem",
    color: "#334155",
    lineHeight: 1.5,
    margin: "0 0 1.5rem 0",
  },
  resetButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ffffff",
    border: "1px solid #0f766e",
    color: "#0f766e",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  infoCol: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  channelsCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    padding: "2rem",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
  },
  channelsTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 1.5rem 0",
  },
  channelList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  channelItem: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  channelIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "#f0fdfa",
    color: "#0f766e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chTitle: {
    fontSize: "0.9375rem",
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 0.25rem 0",
  },
  chValue: {
    fontSize: "0.875rem",
    color: "#0f766e",
    fontWeight: 600,
    margin: "0 0 0.25rem 0",
  },
  chSub: {
    fontSize: "0.8125rem",
    color: "#64748b",
    margin: 0,
  },
  areaBox: {
    backgroundColor: "#f0fdfa",
    border: "1px solid #ccfbf1",
    borderRadius: "14px",
    padding: "1.75rem",
  },
  areaTitle: {
    fontSize: "1.0625rem",
    fontWeight: 700,
    color: "#0f766e",
    margin: "0 0 0.5rem 0",
  },
  areaText: {
    fontSize: "0.875rem",
    color: "#334155",
    lineHeight: 1.5,
    margin: "0 0 1rem 0",
  },
  areaLink: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#0f766e",
    textDecoration: "none",
  },
  emergencyCard: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "14px",
    padding: "1.5rem",
  },
  emergencyTitle: {
    fontSize: "0.9375rem",
    fontWeight: 700,
    color: "#92400e",
    margin: "0 0 0.35rem 0",
  },
  emergencyText: {
    fontSize: "0.875rem",
    color: "#b45309",
    lineHeight: 1.5,
    margin: 0,
  },
};
