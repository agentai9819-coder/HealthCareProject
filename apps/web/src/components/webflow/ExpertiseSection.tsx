"use client";

export function ExpertiseSection() {
  return (
    <section className="wf-expertise-section">
      <div className="wf-container">
        <div className="wf-expertise-grid">
          {/* 1. Large Podcast Card */}
          <div className="wf-podcast-card">
            <div className="wf-badge-row">
              <span className="wf-podcast-badge">
                <span className="wf-badge-dot" /> Podcast
              </span>
            </div>

            <h3 className="wf-podcast-title">
              Nutrition and <br />
              Mental Health
            </h3>
            <p className="wf-podcast-desc">
              The role of clinical nutrition in preventing and managing chronic conditions, cognitive vitality, and metabolic health.
            </p>

            <div className="wf-podcast-play-wrap">
              <a
                href="https://youtube.com/watch?v=EgHqIcKM9Vk"
                target="_blank"
                rel="noreferrer"
                className="wf-video-play-btn"
              >
                <img
                  src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbba_video.png"
                  alt="Play Podcast"
                />
              </a>
            </div>

            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbbb_fruits.png"
              alt=""
              className="wf-podcast-fruits-img"
            />
          </div>

          {/* 2. Right Side Grid (Live Event + 2 Stats Cards) */}
          <div className="wf-expertise-right-grid">
            {/* Live Event Card */}
            <div className="wf-live-event-card">
              <div className="wf-badge-row">
                <span className="wf-live-badge">
                  <span className="wf-badge-dot" /> Live Event
                </span>
              </div>
              <h4 className="wf-live-title">Healthy Habits for a Strong Heart</h4>
              <div className="wf-live-time">Upcoming · 08:00 PM IST</div>
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbf6_video-conference%20(1)%201.svg"
                alt=""
                className="wf-live-icon"
              />
            </div>

            {/* Counter 1: Years Experience */}
            <div className="wf-counter-card">
              <div className="wf-counter-number">08</div>
              <div className="wf-counter-label">Years Experience</div>
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbbc_surface1.svg"
                alt=""
                className="wf-counter-icon"
              />
            </div>

            {/* Counter 2: Happy Customers */}
            <div className="wf-counter-card wf-counter-alt">
              <div className="wf-counter-number">120k+</div>
              <div className="wf-counter-label">Happy Patients</div>
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
