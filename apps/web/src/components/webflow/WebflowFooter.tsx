"use client";

import Link from "next/link";

export function WebflowFooter() {
  return (
    <footer className="wf-footer-section">
      <div className="wf-container">
        <div className="wf-footer-top-grid">
          {/* Col 1: Brand & Emergency Disclaimer */}
          <div className="wf-footer-col">
            <div className="wf-brand-badge" style={{ marginBottom: "16px" }}>
              <span className="wf-brand-main" style={{ color: "#ffffff" }}>VERIDIAN</span>
              <span className="wf-brand-sub" style={{ color: "#ff6b2c" }}>CARE</span>
            </div>
            <p className="wf-footer-about-text">
              NABH-aligned in-home clinical care, registered nursing, and physician tele-oversight across Delhi NCR, Mumbai, Bengaluru, and Hyderabad.
            </p>
            <div className="wf-emergency-pill">
              <span>Medical Emergency: Call 112 / 108 immediately</span>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="wf-footer-col">
            <h4 className="wf-footer-heading">Company</h4>
            <ul className="wf-footer-list">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Clinical Services</Link></li>
              <li><Link href="/why-us">Why Veridian</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/contact">Care Desk</Link></li>
            </ul>
          </div>

          {/* Col 3: Clinical Care */}
          <div className="wf-footer-col">
            <h4 className="wf-footer-heading">Clinical Care</h4>
            <ul className="wf-footer-list">
              <li><Link href="/services/critical-care-nursing">Critical Care Nursing</Link></li>
              <li><Link href="/services/geriatric-vitality">Geriatric &amp; Palliative Care</Link></li>
              <li><Link href="/services/wound-care-and-dressing">Post-Op Wound Dressing</Link></li>
              <li><Link href="/services/physical-therapy-session">Physiotherapy &amp; Rehab</Link></li>
              <li><Link href="/service-areas">Metro Service Hubs</Link></li>
            </ul>
          </div>

          {/* Col 4: Support & Legal */}
          <div className="wf-footer-col">
            <h4 className="wf-footer-heading">Support &amp; Privacy</h4>
            <ul className="wf-footer-list">
              <li><Link href="/faqs">Frequently Asked Questions</Link></li>
              <li><Link href="/why-us">DISHA &amp; ABHA Data Privacy</Link></li>
              <li><Link href="/services">Standard Pricing (INR)</Link></li>
              <li><Link href="/auth/login">Clinician Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="wf-footer-bottom-row">
          <div className="wf-footer-copy">
            © {new Date().getFullYear()} Veridian Care India. All clinical protocols aligned with NABH &amp; INC standards.
          </div>
          <div className="wf-footer-links">
            <span>24/7 National Care Desk: 1800-VERIDIAN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
