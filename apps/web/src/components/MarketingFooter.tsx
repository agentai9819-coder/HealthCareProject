import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="footer">
      {/* Red Emergency Disclaimer Banner */}
      <div className="emergency-banner">
        <div className="emergency-inner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span>
            <strong>Emergency Medical Guidance:</strong> If you are experiencing a life-threatening emergency, call 911 immediately. Veridian Care is not an emergency response service.
          </span>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-grid">
          <div>
            <Link className="brand" href="/" aria-label="Veridian Care home">
              <div className="brand-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
              <span className="brand-copy">
                <b>VERIDIAN</b>
                <span>CARE</span>
              </span>
            </Link>
            <p className="footer-about">
              Private, licensed in-home clinical care for the moments that deserve both medical expertise and compassionate attention.
            </p>
          </div>

          <div>
            <h3 className="footer-heading">Care Access</h3>
            <div className="footer-links">
              <Link href="/services">Book In-Home Care</Link>
              <Link href="/services">Care services</Link>
              <a href="tel:5550192834">Clinical support</a>
              <Link href="/how-it-works">How It Works</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Patient Portal</h3>
            <div className="footer-links">
              <Link href="/auth/login">Patient Login</Link>
              <Link href="/auth/register">Create Account</Link>
              <Link href="/staff/login">Clinician Portal</Link>
              <Link href="/bookings">My Bookings</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Company & Trust</h3>
            <div className="footer-links">
              <Link href="/about">About Veridian Care</Link>
              <Link href="/why-us">Why Choose Us</Link>
              <Link href="/faqs">Frequently Asked Questions</Link>
              <Link href="/contact">Contact Support</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Veridian Care Network • All Rights Reserved</span>
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#94a3b8" }}>
            <Link href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>Terms of Service</Link>
          </div>
          <div className="compliance-row">
            <span className="compliance-seal">HIPAA COMPLIANT</span>
            <span className="compliance-seal">STATE LICENSED</span>
            <span className="compliance-seal">CLINICAL OVERSIGHT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
