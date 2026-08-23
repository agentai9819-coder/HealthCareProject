"use client";

import Link from "next/link";

export function TreatmentCategoriesSection() {
  const categories = [
    {
      title: "Critical Care Nursing",
      subtitle: "INC Registered Nurses · ICU Support",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdb94_phone.svg",
      bgClass: "wf-cat-blue",
      href: "/services/critical-care-nursing",
    },
    {
      title: "Post-Op Wound Care",
      subtitle: "Sterile single-use dressing kits",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbd9_user.png",
      bgClass: "wf-cat-purple",
      href: "/services/wound-care-and-dressing",
    },
    {
      title: "Physiotherapy & Rehab",
      subtitle: "Certified PTs · Joint & Stroke Recovery",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbd8_medichine.png",
      bgClass: "wf-cat-coral",
      href: "/services/physical-therapy-session",
    },
    {
      title: "In-Home Assessment",
      subtitle: "Head-to-toe vital & fall-risk evaluation",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbd7_test%20tube.png",
      bgClass: "wf-cat-orange",
      href: "/services/home-health-assessment",
    },
  ];

  return (
    <section className="wf-treatment-section">
      <div className="wf-container">
        <div className="wf-treatment-grid">
          {categories.map((cat, idx) => (
            <div key={idx} className={`wf-treatment-card ${cat.bgClass}`}>
              <div className="wf-treatment-content">
                <h3 className="wf-treatment-title">{cat.title}</h3>
                <p className="wf-treatment-subtitle">{cat.subtitle}</p>
              </div>

              <Link href={cat.href} className="wf-treatment-book-btn">
                <span className="wf-treatment-btn-text">Book Visit</span>
                <div className="wf-treatment-btn-arrow">
                  <img
                    src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdb93_arrow%20white.svg"
                    alt=""
                  />
                </div>
              </Link>

              <img src={cat.icon} alt="" className="wf-treatment-corner-icon" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
