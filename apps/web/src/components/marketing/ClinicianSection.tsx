import Image from "next/image";

export function ClinicianSection() {
  return (
    <section id="clinician" className="clinician-section" aria-labelledby="clinician-title">
      <div className="clinician-layout">
        <div>
          <span className="section-kicker">- 02 / Clinician Rigor & Licensure</span>
          <h2 id="clinician-title" className="section-heading">
            Experienced Hospital Practitioners, <em>Dedicated to Your Home.</em>
          </h2>
          <p className="section-body">
            Every in-home visit is conducted by a fully licensed, hospital-trained Registered Nurse or Certified Physiotherapist with years of intensive care and inpatient ward experience. Never unverified care.
          </p>

          <div className="clinician-proof">
            <span className="proof-chip">
              <span style={{ color: "#f59e0b", fontFamily: "var(--font-mono)", fontWeight: 700, marginRight: "4px" }}>01</span>
              <span>NMC & INC Verified</span>
            </span>

            <span className="proof-chip">
              <span style={{ color: "#f59e0b", fontFamily: "var(--font-mono)", fontWeight: 700, marginRight: "4px" }}>02</span>
              <span>Single-Use Sterile Kits</span>
            </span>

            <span className="proof-chip">
              <span style={{ color: "#f59e0b", fontFamily: "var(--font-mono)", fontWeight: 700, marginRight: "4px" }}>03</span>
              <span>100% Police Verified</span>
            </span>
          </div>
        </div>

        <div className="portrait-frame">
          <div className="portrait-glow" aria-hidden="true" />
          <div className="portrait-card">
            <Image
              className="portrait-image"
              src="/assets/images/dr-img.png"
              alt="David Vance, Lead Clinical Specialist"
              width={440}
              height={440}
              quality={85}
              loading="lazy"
            />
            <div className="license-tag">
              <small style={{ fontFamily: "var(--font-mono)" }}>Index № CL-8429</small>
              <b>INC Reg. #DL-RN-48291</b>
            </div>
            <div className="profile-caption">
              <div>
                <p className="person-name">David Vance, B.Sc Nursing</p>
                <p className="person-meta">Lead Clinician · 8+ Yrs ICU & Post-Op Experience</p>
              </div>
              <span className="verified-badge" aria-label="Verified clinician">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
