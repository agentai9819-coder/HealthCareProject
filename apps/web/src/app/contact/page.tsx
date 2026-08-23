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
    serviceInterest: "Skilled Bedside Nursing",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      {/* Dark Cinematic Header */}
      <section className="sp-section" style={{ padding: "90px 0 70px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="sp-container">
          <div className="sp-section-header" style={{ marginBottom: "0" }}>
            <span className="sp-kicker">{header.badge}</span>
            <h1 className="sp-section-title">
              {header.title.split(":")[0]}: <br />
              <span className="sp-gradient-text">{header.title.split(":")[1] || "Clinical Concierge Support."}</span>
            </h1>
            <p className="sp-section-desc">{header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Light Cream Form & Contact Channels Section */}
      <section className="light-services-section" style={{ padding: "90px 0" }}>
        <div className="light-services-container">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "48px", alignItems: "flex-start" }}>
            {/* Left: Contact Form Card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "40px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
                Send Our Care Team a Message
              </h2>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 28px" }}>
                Fill out the form below and a clinical care coordinator will contact you directly to answer your questions.
              </p>

              {submitted ? (
                <div style={{ padding: "32px", borderRadius: "18px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#22c55e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, margin: "0 auto 16px" }}>
                    ✓
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "#166534", margin: "0 0 8px" }}>
                    Inquiry Received
                  </h3>
                  <p style={{ fontSize: "14px", color: "#15803d", margin: "0 0 20px", lineHeight: 1.6 }}>
                    Thank you for reaching out. A Veridian Care clinical coordinator will review your request and contact you within 30 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="light-book-btn"
                    style={{ margin: "0 auto", cursor: "pointer", border: "none" }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label htmlFor="contact-name" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ananya Deshmukh"
                      style={{ width: "100%", height: "46px", padding: "0 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#0f172a", outline: "none" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label htmlFor="contact-email" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        style={{ width: "100%", height: "46px", padding: "0 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#0f172a", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                        Phone Number *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        style={{ width: "100%", height: "46px", padding: "0 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#0f172a", outline: "none" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-service" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                      Service of Interest
                    </label>
                    <select
                      id="contact-service"
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      style={{ width: "100%", height: "46px", padding: "0 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#0f172a", outline: "none", backgroundColor: "#fff" }}
                    >
                      <option value="Skilled Bedside Nursing">Skilled Bedside Nursing & IV Infusion</option>
                      <option value="Post-Surgical Recovery">Post-Surgical Hospital Recovery</option>
                      <option value="Physical & Neuro Rehab">Physical & Neuro Rehabilitation</option>
                      <option value="Elder Wellness Check">Elder Wellness & Vitals Check</option>
                      <option value="General Inquiry">General Clinical Inquiry / Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                      How can we assist your family? *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details about your clinical needs or questions..."
                      style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#0f172a", outline: "none", resize: "vertical" }}
                    />
                  </div>

                  <button type="submit" className="sp-btn-primary" style={{ width: "100%", justifyContent: "center", minHeight: "48px" }}>
                    <span>Submit Clinical Inquiry</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              )}
            </div>

            {/* Right: Direct Channels & Information */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  padding: "32px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                }}
              >
                <span className="light-kicker">Direct Contact Channels</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "16px" }}>
                  {channels.map((ch, idx) => (
                    <div key={idx} style={{ paddingBottom: "14px", borderBottom: idx < channels.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ea580c", fontFamily: "var(--font-mono)" }}>
                        {ch.title}
                      </span>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: "3px 0" }}>
                        {ch.value}
                      </div>
                      <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                        {ch.subtext}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  padding: "32px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                }}
              >
                <span className="light-kicker">Active Coverage Hubs</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "8px 0 10px" }}>
                  {serviceAreasNotice.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, margin: "0 0 16px" }}>
                  {serviceAreasNotice.summary}
                </p>
                <Link href="/service-areas" style={{ fontSize: "13px", color: "#ea580c", fontWeight: 700, textDecoration: "none" }}>
                  View All Metropolitan Coverage Zones →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Emergency Notice */}
      <section className="sp-section" style={{ padding: "80px 0" }}>
        <div className="sp-container">
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              backgroundColor: "#080808",
              borderRadius: "24px",
              padding: "36px",
              border: "1px solid rgba(255, 107, 44, 0.3)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
            }}
          >
            <span className="sp-kicker">Emergency Governance</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: "8px 0 12px" }}>
              {emergencyNotice.title}
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
              {emergencyNotice.text}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
