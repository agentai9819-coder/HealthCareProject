"use client";

import { useState } from "react";
import Link from "next/link";

interface CareMatch {
  serviceId: string;
  name: string;
  slug: string;
  price: string;
  duration: string;
  badge: string;
  description: string;
  checklist: string[];
}

const careMatches: Record<string, CareMatch> = {
  "post-surgery": {
    serviceId: "post-surgery",
    name: "Post-Surgical Hospital Recovery",
    slug: "services",
    price: "₹2,499",
    duration: "60–90 Mins",
    badge: "Hospital Grade",
    description: "Specialized in-home nursing following hospital discharge or surgery with continuous surgeon & physician tele-desk.",
    checklist: [
      "Surgical site inspection & sterile wound dressing",
      "Drain management, catheter care & stitch observation",
      "Vitals monitoring & real-time digital charting",
    ],
  },
  "iv-wound": {
    serviceId: "skilled-nursing",
    name: "Skilled Bedside Nursing Visit",
    slug: "home-health-assessment",
    price: "₹1,499",
    duration: "45–60 Mins",
    badge: "Most Requested",
    description: "Hospital-trained Registered Nurse (B.Sc / GNM) dispatched for IV medications, sterile injections, and complex wound care.",
    checklist: [
      "Sterile IV cannula insertion & saline infusion",
      "Aseptic dressing for diabetic / bed sore ulcers",
      "ABHA-linked physician visit summary report",
    ],
  },
  "physiotherapy": {
    serviceId: "physiotherapy",
    name: "In-Home Physical & Neuro Rehab",
    slug: "services",
    price: "₹1,900",
    duration: "60 Mins",
    badge: "BPT Certified",
    description: "One-on-one physiotherapy delivered by certified BPT clinicians for mobility restoration, stroke rehab, or post-fracture recovery.",
    checklist: [
      "Neuromuscular re-education & gait training",
      "Joint mobilization & active/passive resistance",
      "Bedside fall-prevention & posture assessment",
    ],
  },
  "elder-vitals": {
    serviceId: "elder-wellness",
    name: "Elder Wellness & Companion Visit",
    slug: "services",
    price: "₹1,299",
    duration: "45 Mins",
    badge: "Preventive Care",
    description: "Comprehensive in-home preventive health check for elderly parents with portable ECG, vitals monitoring, and companion review.",
    checklist: [
      "12-Lead portable ECG & blood glucose test",
      "Multi-parameter vitals & medication review",
      "Digital report synced directly to family caregivers",
    ],
  },
};

export function ServiceFinder() {
  const [selectedRecipient, setSelectedRecipient] = useState<string>("parent");
  const [selectedNeed, setSelectedNeed] = useState<string>("iv-wound");

  const currentMatch = careMatches[selectedNeed] || careMatches["iv-wound"];

  return (
    <section id="care-finder" className="sp-section" aria-labelledby="care-finder-title">
      <div className="sp-container">
        <div className="sp-section-header">
          <span className="sp-kicker">Interactive Service Guide</span>
          <h2 id="care-finder-title" className="sp-section-title">
            Not sure which service you need? <br />
            <span className="sp-gradient-text">Find your clinical match in 1 minute.</span>
          </h2>
          <p className="sp-section-desc">
            Select your situation below to immediately see the recommended clinical protocol, practitioner qualification, and transparent visit fee.
          </p>
        </div>

        <div className="sp-finder-card">
          <div className="sp-finder-controls">
            {/* Step 1: Who needs care? */}
            <div className="sp-filter-group">
              <label className="sp-filter-label">1. Who is the care for?</label>
              <div className="sp-choice-grid">
                {[
                  { id: "parent", label: "Elderly Parent", sub: "At-home senior" },
                  { id: "patient", label: "Post-Op Patient", sub: "Recent hospital discharge" },
                  { id: "self", label: "Myself / Family", sub: "Acute medical care" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`sp-choice-btn ${selectedRecipient === item.id ? "active" : ""}`}
                    onClick={() => setSelectedRecipient(item.id)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: What is the primary clinical requirement? */}
            <div className="sp-filter-group" style={{ marginTop: "24px" }}>
              <label className="sp-filter-label">2. What is the primary clinical need?</label>
              <div className="sp-choice-grid">
                {[
                  { id: "iv-wound", label: "IV & Sterile Wound Care", sub: "Injections, infusions, dressing" },
                  { id: "post-surgery", label: "Post-Surgery Recovery", sub: "Drains, stitches, telemetry" },
                  { id: "physiotherapy", label: "Physical Rehabilitation", sub: "Neuro, stroke, mobility rehab" },
                  { id: "elder-vitals", label: "Elder Vitals & ECG Check", sub: "Preventive monitoring, review" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`sp-choice-btn ${selectedNeed === item.id ? "active" : ""}`}
                    onClick={() => setSelectedNeed(item.id)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Program Result Box */}
          <div className="sp-finder-result">
            <div className="sp-result-badge">Recommended Program</div>
            <h3 className="sp-result-title">{currentMatch.name}</h3>
            <p className="sp-result-desc">{currentMatch.description}</p>

            <div className="sp-result-meta">
              <div>
                <span className="sp-meta-kicker">Visit Fee (All-Inclusive)</span>
                <span className="sp-meta-price">{currentMatch.price}</span>
              </div>
              <div>
                <span className="sp-meta-kicker">Estimated Duration</span>
                <span className="sp-meta-val">{currentMatch.duration}</span>
              </div>
            </div>

            <ul className="sp-result-checklist">
              {currentMatch.checklist.map((item, idx) => (
                <li key={idx}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "24px" }}>
              <Link href={`/booking/select-slot?serviceId=${currentMatch.serviceId}`} className="sp-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <span>Schedule This Service</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
