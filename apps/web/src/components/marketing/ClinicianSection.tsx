export function ClinicianSection() {
  return (
    <section id="clinician" className="clinician-section" aria-labelledby="clinician-title">
      <div className="clinician-layout">
        <div>
          <span className="section-kicker">The person behind the plan</span>
          <h2 id="clinician-title" className="section-heading">
            Human expertise, with the clinical rigor your care deserves.
          </h2>
          <p className="section-body">
            Every visit is shaped by real clinical judgment, respectful in-home conduct, and an exact record of what happens next. Your care is never an anonymous dispatch.
          </p>

          <div className="clinician-proof">
            <span className="proof-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>State license verified</span>
            </span>

            <span className="proof-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m18 2 4 4" />
                <path d="m17 7 3-3" />
                <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
                <path d="m9 11 4 4" />
                <path d="m5 19-3 3" />
                <path d="m14 4 6 6" />
              </svg>
              <span>Sterile kit certified</span>
            </span>

            <span className="proof-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
              <span>Identity checked</span>
            </span>
          </div>
        </div>

        <div className="portrait-frame">
          <div className="portrait-glow" aria-hidden="true" />
          <div className="portrait-card">
            <img
              className="portrait-image"
              src="/assets/images/dr-img.png"
              alt="David Vance, a registered nurse"
            />
            <div className="license-tag">
              <small>Verified profile</small>
              <b>State Lic. #RN-88492</b>
            </div>
            <div className="profile-caption">
              <div>
                <p className="person-name">David Vance, RN</p>
                <p className="person-meta">Lead clinician · Acute & post-op care</p>
              </div>
              <span className="verified-badge" aria-label="Verified clinician">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
