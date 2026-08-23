"use client";

import { useState } from "react";
import Link from "next/link";

export function DoctorAppointmentSection() {
  const tabs = [
    { id: "nursing", label: "Critical Care Nursing", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbaa_005-neurology.svg" },
    { id: "ortho", label: "Orthopedic Rehab", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba7_knee.svg" },
    { id: "neuro", label: "Neurology Care", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba8_011-headache.svg" },
    { id: "physio", label: "Physiotherapy", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbab_006-obesity.svg" },
    { id: "geriatric", label: "Elder Vitality", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbac_015-shoulder.svg" },
    { id: "cardio", label: "Cardiac Wellness", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba9_008-neck.svg" },
  ];

  const [activeTab, setActiveTab] = useState("nursing");

  const doctors = [
    {
      name: "Sister Priya Sharma, B.Sc RN",
      role: "Lead Critical Care Nurse (INC #38192)",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbee_Gradient%202-3.png",
      rating: "4.9 ★ (140+ home visits)",
      hospital: "Delhi NCR Metro Care Hub",
      serviceSlug: "critical-care-nursing",
    },
    {
      name: "Dr. Arvind Rao, BPT, MPT",
      role: "Senior Orthopedic Physiotherapist",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbef_Gradient%202-1.png",
      rating: "4.9 ★ (210+ recovery cases)",
      hospital: "Indiranagar Bengaluru Hub",
      serviceSlug: "physical-therapy-session",
    },
    {
      name: "Sister Neha Mukherjee, RN",
      role: "Senior Wound Management Specialist",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbed_Gradient%202-2.png",
      rating: "4.8 ★ (95 surgical recoveries)",
      hospital: "Bandra Mumbai Hub",
      serviceSlug: "wound-care-and-dressing",
    },
    {
      name: "Dr. Vikramaditya Sen, MD",
      role: "Supervising Tele-Physician",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbec_Gradient%202.png",
      rating: "5.0 ★ (180+ clinical reviews)",
      hospital: "Veridian National Oversight Board",
      serviceSlug: "home-health-assessment",
    },
  ];

  return (
    <section className="wf-doctor-tabs-section">
      <div className="wf-container">
        <div className="wf-section-header">
          <h2 className="wf-section-title">
            Book an In-Home Visit with <br />
            State-Licensed Clinicians
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
                <Link href={`/services/${doc.serviceSlug}`} className="wf-doctor-book-action">
                  <span>Book Appointment</span>
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
