"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function WebflowNavbar() {
  const [selectedLocation, setSelectedLocation] = useState("Delhi NCR");
  const [locationOpen, setLocationOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const locations = ["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "USA", "New York"];

  const specialties = [
    { title: "Medicine & Nephrology", doctors: "20 Doctors Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba7_knee.svg" },
    { title: "Cardiology", doctors: "40 Doctors Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba8_011-headache.svg" },
    { title: "Pulmonology Medicine", doctors: "17 Doctors Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdba9_008-neck.svg" },
    { title: "General Surgery", doctors: "10 Doctors Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbaa_005-neurology.svg" },
    { title: "Orthopedic Surgery", doctors: "28 Doctors Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbab_006-obesity.svg" },
    { title: "Spine Surgery", doctors: "14 Doctors Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbac_015-shoulder.svg" },
    { title: "Neuro Surgery", doctors: "14 Doctors Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbad_033-eye.svg" },
    { title: "Pediatric Care", doctors: "18 Doctors Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbd2_016-head.png" },
    { title: "Nutrition & Dietetics", doctors: "12 Specialists Available", icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbd5_020-disability.png" },
  ];

  return (
    <header className="wf-navbar-section">
      <div className="wf-navbar-container">
        {/* 1. Left: Brand Logo */}
        <Link href="/" className="wf-brand-logo">
          <img
            src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdb83_logo.svg"
            alt="Veridian Care"
            className="wf-logo-img"
          />
        </Link>

        <div className="wf-nav-divider" />

        {/* 2. Location Dropdown */}
        <div className="wf-location-wrapper">
          <div className="wf-location-label">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbd1_location-01.svg"
              alt=""
              className="wf-loc-icon"
            />
            <span className="wf-loc-text-sub">Select Location</span>
          </div>
          <button
            type="button"
            className="wf-location-btn"
            onClick={() => setLocationOpen(!locationOpen)}
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

        {/* 3. Search Bar */}
        <div className="wf-search-wrapper">
          <div className="wf-search-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.125 13.125L16.5 16.5" stroke="#252B61" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 8.25C15 4.52208 11.9779 1.5 8.25 1.5C4.52208 1.5 1.5 4.52208 1.5 8.25C1.5 11.9779 4.52208 15 8.25 15C11.9779 15 15 11.9779 15 8.25Z" stroke="#252B61" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            type="text"
            className="wf-search-input"
            placeholder="Medicine and healthcare items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 4. Healthcare Services with 'New' badge */}
        <div className="wf-services-mega-wrap">
          <span className="wf-new-badge">New</span>
          <button
            type="button"
            className="wf-services-btn"
            onClick={() => setServicesOpen(!servicesOpen)}
          >
            <span>Healthcare Services</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z" />
            </svg>
          </button>

          {servicesOpen && (
            <div className="wf-mega-menu">
              <div className="wf-mega-title">Our Healthcare Services</div>
              <div className="wf-mega-grid">
                {specialties.map((item, idx) => (
                  <Link
                    key={idx}
                    href="/services"
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

        {/* 5. Right Action Links (Offers, Cart, Login) */}
        <div className="wf-nav-right">
          <Link href="/services" className="wf-nav-link">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb2_discount.svg"
              alt=""
              className="wf-nav-action-icon"
            />
            <span>Offers</span>
          </Link>

          <Link href="/account" className="wf-nav-link">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbaf_shopping-cart-02.svg"
              alt=""
              className="wf-nav-action-icon"
            />
            <span>Cart</span>
          </Link>

          <Link href="/auth/login" className="wf-nav-link">
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb1_user.svg"
              alt=""
              className="wf-nav-action-icon"
            />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
