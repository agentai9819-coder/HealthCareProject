"use client";

export function ExpertiseSection() {
  return (
    <section className="wf-expertise-section">
      <div className="wf-container">
        <div className="wf-expertise-grid">
          {/* 1. Large Clinical Masterclass Card */}
          <div className="wf-podcast-card">
            <div className="wf-badge-row">
              <span className="wf-podcast-badge">
                <span className="wf-badge-dot" /> Clinical Guidance
              </span>
            </div>

            <h3 className="wf-podcast-title">
              In-Home Recovery &amp; <br />
              Infection Control
            </h3>
            <p className="wf-podcast-desc">
              Watch our Medical Director explain sterile protocol maintenance, vital sign red flags, and safe caregiver coordination for post-discharge recovery.
            </p>

            <div className="wf-podcast-play-wrap">
              <a
                href="https://youtube.com/watch?v=EgHqIcKM9Vk"
                target="_blank"
                rel="noreferrer"
                className="wf-video-play-btn"
                aria-label="Play Clinical Guidance Video"
              >
                <img
                  src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbba_video.png"
                  alt="Play Video"
                />
              </a>
            </div>

            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbbb_fruits.png"
              alt=""
              className="wf-podcast-fruits-img"
            />
          </div>

          {/* 2. Right Side Grid (Live Tele-Desk + Experience Counters) */}
          <div className="wf-expertise-right-grid">
            {/* Live Care Tele-Desk Card */}
            <div className="wf-live-event-card">
              <div className="wf-badge-row">
                <span className="wf-live-badge">
                  <span className="wf-badge-dot" /> 24/7 Care Desk
                </span>
              </div>
              <h4 className="wf-live-title">Rapid Nurse Dispatch &amp; Tele-Oversight</h4>
              <div className="wf-live-time">Average 45-Min Arrival · Delhi NCR &amp; Mumbai</div>
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbf6_video-conference%20(1)%201.svg"
                alt=""
                className="wf-live-icon"
              />
            </div>

            {/* Counter 1: Years Experience */}
            <div className="wf-counter-card">
              <div className="wf-counter-number">08</div>
              <div className="wf-counter-label">Years Clinical Rigor</div>
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbbc_surface1.svg"
                alt=""
                className="wf-counter-icon"
              />
            </div>

            {/* Counter 2: Indian Families Supported */}
            <div className="wf-counter-card wf-counter-alt">
              <div className="wf-counter-number">8</div>
              <div className="wf-counter-label">Years Clinical Excellence</div>
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbbd_happy.svg"
                alt=""
                className="wf-counter-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
