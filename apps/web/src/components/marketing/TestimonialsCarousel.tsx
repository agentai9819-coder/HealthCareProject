"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Story {
  id: string;
  quote: string;
  author: string;
  role: string;
  city: string;
  rating: number;
  badge: string;
  avatar: string;
  verifiedProcedure: string;
}

const stories: Story[] = [
  {
    id: "story-1",
    quote:
      "Following my total knee replacement, hospital outpatient visits were excruciating. Having an INC-registered nurse and certified physiotherapist come directly to my home in South Delhi within 45 minutes of booking made my recovery peaceful and infection-free.",
    author: "Ananya Deshmukh",
    role: "Patient · Post-Op Knee Arthroplasty",
    city: "New Delhi",
    rating: 5,
    badge: "Verified Patient",
    avatar: "/assets/images/avatar/avatar-1.jpg",
    verifiedProcedure: "Post-Surgical Nursing & Mobility Rehab",
  },
  {
    id: "story-2",
    quote:
      "My 82-year-old mother needed regular sterile IV antibiotic infusions and wound dressing. The practitioner arrived in full clinical attire, unsealed the sterile kit in front of us, and synced her vitals to the doctor's tele-desk in real time.",
    author: "Rajiv K. Singhania",
    role: "Family Coordinator & Son",
    city: "Bengaluru",
    rating: 5,
    badge: "Family Caregiver",
    avatar: "/assets/images/avatar/avatar-2.jpg",
    verifiedProcedure: "Sterile IV Infusion & Vitals Telemetry",
  },
  {
    id: "story-3",
    quote:
      "As an orthopedic surgeon, I frequently recommend Veridian Care for post-discharge home recovery. Their bedside clinical documentation is hospital-grade, and their adherence to aseptic protocols matches our inpatient wards.",
    author: "Dr. Vikramaditya Rao, MS (Ortho)",
    role: "Consulting Senior Orthopedic Surgeon",
    city: "Mumbai",
    rating: 5,
    badge: "Physician Partner",
    avatar: "/assets/images/avatar/avatar-3.jpg",
    verifiedProcedure: "Clinical Tele-Desk Oversight",
  },
  {
    id: "story-4",
    quote:
      "After my stroke, traveling for neuromuscular therapy was exhausting. The daily physiotherapy sessions at home helped me regain walking independence in six weeks. Transparent INR pricing with zero hidden charges.",
    author: "Col. Sanjeev Malhotra (Retd.)",
    role: "Patient · Neurological Rehabilitation",
    city: "Hyderabad",
    rating: 5,
    badge: "Verified Patient",
    avatar: "/assets/images/avatar/avatar-4.jpg",
    verifiedProcedure: "Neuro Physiotherapy & Gait Training",
  },
  {
    id: "story-5",
    quote:
      "Managing chronic diabetic ulcers at home was overwhelming until we booked Veridian Care. The registered nurse followed sterile protocols with single-use packs, saving my father from frequent hospital admissions.",
    author: "Meera Nair",
    role: "Daughter & Primary Caregiver",
    city: "Bengaluru",
    rating: 5,
    badge: "Verified Caregiver",
    avatar: "/assets/images/avatar/avatar-5.jpg",
    verifiedProcedure: "Aseptic Diabetic Wound Care",
  },
];

export function TestimonialsCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateProgress = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      const current = el.scrollLeft;
      setProgress((current / maxScroll) * 100);
      setCanScrollLeft(current > 10);
      setCanScrollRight(current < maxScroll - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => el.removeEventListener("scroll", updateProgress);
  }, []);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollOffset = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollOffset : scrollOffset,
      behavior: "smooth",
    });
  };

  return (
    <section className="stories-section" aria-labelledby="stories-heading">
      <div className="stories-container">
        {/* Header with Navigation Controls */}
        <div className="stories-head">
          <div>
            <span className="stories-kicker">Patient & Clinician Proof</span>
            <h2 id="stories-heading" className="stories-title">
              Loved by patients, <br />
              <span>trusted by hospital surgeons.</span>
            </h2>
            <p className="stories-desc">
              Over 14,800+ in-home clinical visits delivered with a 4.96 ★ quality rating across major metropolitan cities.
            </p>
          </div>

          <div className="stories-controls">
            <button
              type="button"
              className="carousel-btn"
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel-btn"
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="stories-track" ref={scrollRef}>
          {stories.map((story) => (
            <article className="story-card" key={story.id}>
              <div className="story-card-top">
                <div className="story-rating">
                  {"★".repeat(story.rating)}
                  <span className="story-badge">{story.badge}</span>
                </div>
                <span className="story-procedure">{story.verifiedProcedure}</span>
              </div>

              <blockquote className="story-quote">
                &ldquo;{story.quote}&rdquo;
              </blockquote>

              <div className="story-author-row">
                <div className="story-avatar-wrap">
                  <Image
                    src={story.avatar}
                    alt={story.author}
                    width={48}
                    height={48}
                    className="story-avatar"
                  />
                </div>
                <div>
                  <h4 className="story-author-name">{story.author}</h4>
                  <p className="story-author-role">
                    {story.role} · <strong>{story.city}</strong>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Minimalist Line Progress Bar (Lines, Not Dots) */}
        <div className="carousel-progress-wrapper" aria-hidden="true">
          <div className="carousel-progress-track">
            <div
              className="carousel-progress-fill"
              style={{ width: `${Math.max(15, progress)}%` }}
            />
          </div>
          <span className="carousel-progress-label">
            Drag or scroll horizontally to explore verified stories
          </span>
        </div>
      </div>
    </section>
  );
}
