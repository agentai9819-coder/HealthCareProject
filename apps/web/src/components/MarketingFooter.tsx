import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="light-footer" aria-label="Website Footer">
      {/* Emergency Guidance Banner */}
      <div className="light-emergency-banner">
        <div className="light-emergency-inner">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span>
            <strong>Emergency Medical Guidance:</strong> If you are experiencing a critical or life-threatening emergency, please dial <strong>112</strong> or <strong>108 (Ambulance)</strong> immediately. Veridian Care provides scheduled and same-day home clinical visits and is not an acute emergency trauma dispatch service.
          </span>
        </div>
      </div>

      <div className="light-footer-main">
        <div className="light-footer-grid">
          {/* Brand Column */}
          <div className="light-footer-brand-col">
            <Link className="light-brand" href="/" aria-label="Veridian Care home">
              <div className="light-brand-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2.5">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
              <span className="light-brand-copy">
                <b>VERIDIAN</b>
                <span>CARE</span>
              </span>
            </Link>
            <p className="light-footer-desc">
              Hospital-grade in-home clinical nursing and rehabilitation across Delhi NCR, Mumbai, Bengaluru, Pune, and Hyderabad. Delivering clinical rigor, sterile consumables, and continuous physician oversight directly to your doorstep.
            </p>

            <div className="light-social-links">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="light-social-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="light-social-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="light-social-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Clinical Programs */}
          <div>
            <h3 className="light-footer-heading">Clinical Programs</h3>
            <div className="light-footer-links">
              <Link href="/services">Skilled Bedside Nursing</Link>
              <Link href="/services">Post-Surgical Recovery</Link>
              <Link href="/services">Physical & Neuro Rehab</Link>
              <Link href="/services">Elder Wellness Evaluation</Link>
              <Link href="/services">Sterile Wound & IV Care</Link>
            </div>
          </div>

          {/* Column 3: Patient Access */}
          <div>
            <h3 className="light-footer-heading">Patient Access</h3>
            <div className="light-footer-links">
              <Link href="/auth/login">Patient Portal Login</Link>
              <Link href="/auth/register">Create Family Account</Link>
              <Link href="/staff/login">Clinician Desk</Link>
              <Link href="/bookings">Track Active Dispatch</Link>
              <a href="tel:+911140506070">24/7 Hotline: +91 (11) 4050-6070</a>
            </div>
          </div>

          {/* Column 4: Trust & Compliance */}
          <div>
            <h3 className="light-footer-heading">Trust & Governance</h3>
            <div className="light-footer-links">
              <Link href="/about">Clinical Governance</Link>
              <Link href="/why-us">Practitioner Licensure</Link>
              <Link href="/faqs">Frequently Asked Questions</Link>
              <Link href="/contact">Contact Support</Link>
              <Link href="/privacy">Privacy & Health Data Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Compliance & Badges */}
        <div className="light-footer-bottom">
          <div className="light-footer-copy">
            <span>© 2026 Veridian Care Network Pvt. Ltd. All rights reserved.</span>
            <div className="light-footer-legal">
              <Link href="/privacy">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms">Terms of Service</Link>
              <span>•</span>
              <Link href="/contact">ABHA Redressal</Link>
            </div>
          </div>

          <div className="light-compliance-seals">
            <span className="light-seal">NABH CLINICAL GUIDELINES</span>
            <span className="light-seal">100% INC & NMC VERIFIED</span>
            <span className="light-seal">DISHA HEALTH DATA ENCRYPTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
