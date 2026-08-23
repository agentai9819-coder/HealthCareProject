"use client";

import { useState } from "react";
import Link from "next/link";

export function WebflowNavbar() {
  const [selectedLocation, setSelectedLocation] = useState("Delhi NCR");
  const [locationOpen, setLocationOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const locations = ["Delhi NCR", "Mumbai MMR", "Bengaluru", "Hyderabad", "Pune", "Chennai"];

  const specialties = [
    { title: "Critical Care Nursing", doctors: "34 Licensed RNs Available", href: "/services/critical-care-nursing", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbaa_005-neurology.svg" },
    { title: "Post-Op Wound Care", doctors: "28 Specialists Available", href: "/services/wound-care-and-dressing", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba7_knee.svg" },
    { title: "Physical Therapy & Rehab", doctors: "42 Certified PTs Available", href: "/services/physical-therapy-session", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbab_006-obesity.svg" },
    { title: "Geriatric & Elder Vitality", doctors: "22 Care Leads Available", href: "/services/geriatric-vitality", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbac_015-shoulder.svg" },
    { title: "In-Home Health Assessment", doctors: "Same-Day Dispatch", href: "/services/home-health-assessment", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba8_011-headache.svg" },
    { title: "Physician Tele-Consultation", doctors: "15 MD Specialists Online", href: "/services/teleconsultation", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba9_008-neck.svg" },
  ];

  return (
    <header className="wf-navbar-section">
      <div className="wf-navbar-container">
        {/* Brand Logo */}
        <Link href="/" className="wf-brand-logo" aria-label="Veridian Care Home">
          <div className="wf-brand-badge">
            <span className="wf-brand-main">VERIDIAN</span>
            <span className="wf-brand-sub">CARE</span>
          </div>
        </Link>

        <div className="wf-nav-divider" />

        {/* Location Dropdown */}
        <div className="wf-location-wrapper">
          <div className="wf-location-label">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbd1_location-01.svg"
              alt=""
              className="wf-loc-icon"
            />
            <span className="wf-loc-text-sub">Care Hub</span>
          </div>
          <button
            type="button"
            className="wf-location-btn"
            onClick={() => setLocationOpen(!locationOpen)}
            aria-expanded={locationOpen}
          >
            <span>{selectedLocation}</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" style={{ marginLeft: "4px" }}>
              <path d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z" />
            </svg>
          </button>

          {locationOpen && (
            <div className="wf-dropdown-menu">
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className="wf-dropdown-item"
                  onClick={() => {
                    setSelectedLocation(loc);
                    setLocationOpen(false);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real Search Bar */}
        <form
          className="wf-search-wrapper"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              window.location.href = `/services?q=${encodeURIComponent(searchQuery)}`;
            }
          }}
        >
          <div className="wf-search-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.125 13.125L16.5 16.5" stroke="#252B61" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 8.25C15 4.52208 11.9779 1.5 8.25 1.5C4.52208 1.5 1.5 4.52208 1.5 8.25C1.5 11.9779 4.52208 15 8.25 15C11.9779 15 15 11.9779 15 8.25Z" stroke="#252B61" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            type="text"
            className="wf-search-input"
            placeholder="Search nursing, physiotherapy, doctor visits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Clinical Services Mega Dropdown */}
        <div className="wf-services-mega-wrap">
          <span className="wf-new-badge">NABH</span>
          <button
            type="button"
            className="wf-services-btn"
            onClick={() => setServicesOpen(!servicesOpen)}
            aria-expanded={servicesOpen}
          >
            <span>Clinical Services</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z" />
            </svg>
          </button>

          {servicesOpen && (
            <div className="wf-mega-menu">
              <div className="wf-mega-title">Verified In-Home Clinical Programs</div>
              <div className="wf-mega-grid">
                {specialties.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="wf-mega-item"
                    onClick={() => setServicesOpen(false)}
                  >
                    <img src={item.icon} alt="" className="wf-mega-icon" />
                    <div>
                      <div className="wf-mega-item-name">{item.title}</div>
                      <div className="wf-mega-item-count">{item.doctors}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nav Right (Why Us, Pricing/Services, Portal Login) */}
        <div className="wf-nav-right">
          <Link href="/services" className="wf-nav-link">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb2_discount.svg"
              alt=""
              className="wf-nav-action-icon"
            />
            <span>All Packages</span>
          </Link>

          <Link href="/why-us" className="wf-nav-link">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbaf_shopping-cart-02.svg"
              alt=""
              className="wf-nav-action-icon"
            />
            <span>Clinical Standards</span>
          </Link>

          <Link href="/auth/login" className="wf-nav-link">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb1_user.svg"
              alt=""
              className="wf-nav-action-icon"
            />
            <span>Patient Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
