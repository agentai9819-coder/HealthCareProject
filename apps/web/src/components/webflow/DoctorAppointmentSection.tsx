"use client";

import { useState } from "react";
import Link from "next/link";

export function DoctorAppointmentSection() {
  const tabs = [
    { id: "ortho", label: "Orthopedists", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba7_knee.svg" },
    { id: "obesity", label: "Obesity", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbab_006-obesity.svg" },
    { id: "neck", label: "Neck pain", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba9_008-neck.svg" },
    { id: "neuro", label: "Neurology", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbaa_005-neurology.svg" },
    { id: "headache", label: "Headache", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba8_011-headache.svg" },
    { id: "shoulder", label: "Shoulder", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbac_015-shoulder.svg" },
    { id: "eye", label: "Eye care", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbad_033-eye.svg" },
  ];

  const [activeTab, setActiveTab] = useState("ortho");

  const doctors = [
    {
      name: "Dr. Jen Gunter",
      role: "Senior Neurologist",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbee_Gradient%202-3.png",
      rating: "4.9 ★ (120+ reviews)",
      hospital: "NABH Clinical Associate",
    },
    {
      name: "Dr. Sanjana Gupta",
      role: "Consultant Psychiatrist",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbed_Gradient%202-2.png",
      rating: "4.8 ★ (95 reviews)",
      hospital: "Apex Neuro Care",
    },
    {
      name: "Dr. Sherry Ross",
      role: "Lead Gynecologist",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbec_Gradient%202.png",
      rating: "5.0 ★ (160+ reviews)",
      hospital: "Women's Wellness Hub",
    },
    {
      name: "Dr. Arvind Mehta",
      role: "Orthopedic Surgeon",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbef_Gradient%202-1.png",
      rating: "4.9 ★ (210+ reviews)",
      hospital: "Metro Joint Replacement",
    },
  ];

  return (
    <section className="wf-doctor-tabs-section">
      <div className="wf-container">
        <div className="wf-section-header">
          <h2 className="wf-section-title">
            Book an appointment for an <br />
            in-clinic consultation
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="wf-tabs-bar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`wf-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <img src={tab.icon} alt="" className="wf-tab-icon" />
            </button>
          ))}
        </div>

        {/* Doctor Cards Grid */}
        <div className="wf-doctor-grid">
          {doctors.map((doc, idx) => (
            <div key={idx} className="wf-doctor-card">
              <div className="wf-doctor-img-wrap">
                <img src={doc.image} alt={doc.name} className="wf-doctor-img" />
              </div>
              <div className="wf-doctor-info">
                <h3 className="wf-doctor-name">{doc.name}</h3>
                <div className="wf-doctor-role">{doc.role}</div>
                <div className="wf-doctor-meta">
                  <span>{doc.hospital}</span>
                  <span className="wf-doctor-rating">{doc.rating}</span>
                </div>
                <Link href="/services" className="wf-doctor-book-action">
                  <span>Book Consultation</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
