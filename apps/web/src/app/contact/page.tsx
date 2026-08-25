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
    serviceInterest: "Critical Care Nursing",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="wf-subpage-wrapper" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Subpage Navy Banner */}
      <section className="wf-banner-section" style={{ padding: "24px 0 32px" }}>
        <div className="wf-container">
          <div className="wf-subpage-hero-card">
            <div className="wf-badge-row">
              <span className="wf-podcast-badge" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#ffffff" }}>
                <span className="wf-badge-dot" /> {header.badge}
              </span>
            </div>
            <h1 className="wf-subpage-title">{header.title}</h1>
            <p className="wf-subpage-desc">{header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Form & Contact Channels */}
      <section className="wf-container" style={{ paddingTop: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "36px", alignItems: "flex-start" }}>
          {/* Contact Form Card */}
          <div className="wf-detail-box" style={{ padding: "40px" }}>
            <h2 className="wf-detail-heading" style={{ fontSize: "22px", margin: "0 0 8px" }}>
              Send Our Clinical Coordination Team a Message
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: "0 0 24px" }}>
              Fill out the form below and a clinical care coordinator will contact you directly within 30 minutes.
            </p>

            {submitted ? (
              <div style={{ padding: "32px", borderRadius: "18px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#22c55e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, margin: "0 auto 16px" }}>
                  ✓
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#166534", margin: "0 0 8px" }}>
                  Inquiry Received
                </h3>
                <p style={{ fontSize: "14px", color: "#15803d", margin: "0 0 20px", lineHeight: 1.6 }}>
                  Thank you for reaching out. A Veridian Care clinical coordinator will review your request and contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="wf-doctor-book-action"
                  style={{ margin: "0 auto", cursor: "pointer", border: "none", display: "inline-block" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#252b61", marginBottom: "6px" }}>
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Deshmukh"
                    className="wf-search-input"
                    style={{ borderRadius: "12px", background: "#ffffff", paddingLeft: "16px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label htmlFor="contact-email" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#252b61", marginBottom: "6px" }}>
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="wf-search-input"
                      style={{ borderRadius: "12px", background: "#ffffff", paddingLeft: "16px" }}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#252b61", marginBottom: "6px" }}>
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="wf-search-input"
                      style={{ borderRadius: "12px", background: "#ffffff", paddingLeft: "16px" }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-service" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#252b61", marginBottom: "6px" }}>
                    Service of Interest
                  </label>
                  <select
                    id="contact-service"
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="wf-search-input"
                    style={{ borderRadius: "12px", background: "#ffffff", paddingLeft: "16px" }}
                  >
                    <option value="Critical Care Nursing">Critical Care &amp; ICU Nursing</option>
                    <option value="Post-Op Wound Dressing">Post-Operative Wound Dressing</option>
                    <option value="Physical Therapy">Physical Therapy &amp; Rehab</option>
                    <option value="Elder Care">Geriatric &amp; Elder Care</option>
                    <option value="Health Assessment">In-Home Health Assessment</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#252b61", marginBottom: "6px" }}>
                    Care Details / Medical Needs
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe patient condition, preferred visit timing, or special clinical instructions..."
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#1e293b", resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="wf-consultation-btn"
                  style={{ background: "#252b61", color: "#ffffff", border: "none", cursor: "pointer", justifyContent: "center", width: "100%", padding: "14px" }}
                >
                  <span>Submit Care Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact Channels Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="wf-detail-box" style={{ padding: "32px" }}>
              <h3 className="wf-detail-heading" style={{ fontSize: "18px", margin: "0 0 16px" }}>
                Direct Care Coordination Channels
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#e8effd", display: "flex", alignItems: "center", justifyContent: "center", color: "#252b61", flexShrink: 0 }}>
                    📞
                  </div>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#252b61", display: "block" }}>24/7 Clinical Hotline</strong>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0" }}>1800-VERIDIAN / +91 11 4000 8900</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#f4eefd", display: "flex", alignItems: "center", justifyContent: "center", color: "#252b61", flexShrink: 0 }}>
                    ✉️
                  </div>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#252b61", display: "block" }}>Clinical Concierge Email</strong>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0" }}>care@veridiancare.in</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#fef6ee", display: "flex", alignItems: "center", justifyContent: "center", color: "#252b61", flexShrink: 0 }}>
                    📍
                  </div>
                  <div>
                    <strong style={{ fontSize: "14px", color: "#252b61", display: "block" }}>Metro Care Dispatch Hubs</strong>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0" }}>Delhi NCR · Mumbai · Bengaluru · Hyderabad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="wf-detail-box" style={{ background: "#252b61", color: "#ffffff", border: "none", padding: "28px" }}>
              <span className="wf-new-badge" style={{ marginBottom: "10px", display: "inline-block" }}>
                Emergency Notice
              </span>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: "0 0 8px" }}>
                {emergencyNotice.title}
              </h4>
              <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5, margin: 0 }}>
                {emergencyNotice.text}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
