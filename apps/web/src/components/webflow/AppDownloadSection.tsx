"use client";

import Link from "next/link";

export function AppDownloadSection() {
  return (
    <section className="wf-download-section">
      <div className="wf-container">
        <div className="wf-download-grid">
          {/* Left Mockup Card */}
          <div className="wf-download-preview-card">
            <div className="wf-brand-badge" style={{ marginBottom: "20px" }}>
              <span className="wf-brand-main" style={{ color: "#ffffff" }}>VERIDIAN</span>
              <span className="wf-brand-sub" style={{ color: "#ff6b2c" }}>APP</span>
            </div>

            <div className="wf-mockup-stack">
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbc4_Featured%20services.png"
                alt="Featured Services"
                className="wf-floating-card-left"
              />
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbc5_mobile%20mockup.png"
                alt="Mobile App"
                className="wf-floating-phone"
              />
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbc6_Doctor%20list%20cards.png"
                alt="Doctor List Cards"
                className="wf-floating-card-right"
              />
            </div>
          </div>

          {/* Right CTA Card with Store Badges */}
          <div className="wf-download-cta-card">
            <div className="wf-app-screen-group-wrap">
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbc9_screen%20group.png"
                alt="App Screens"
                className="wf-app-screen-group"
              />
            </div>

            <h3 className="wf-download-headline">
              Download the <span className="wf-text-gradient">Veridian Care App</span> for Live Nurse Tracking &amp; Digital Vitals
            </h3>

            <div className="wf-store-badges-row">
              <Link href="/services" className="wf-store-badge-link">
                <img
                  src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbc8_Button.png"
                  alt="Download on App Store"
                  className="wf-store-badge-img"
                />
              </Link>
              <Link href="/services" className="wf-store-badge-link">
                <img
                  src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbc7_play%20store.png"
                  alt="Get it on Google Play"
                  className="wf-store-badge-img"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
