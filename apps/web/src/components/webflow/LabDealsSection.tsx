"use client";

import Link from "next/link";

export function LabDealsSection() {
  const labTests = [
    {
      title: "In-Home Health Assessment",
      desc: "Complete head-to-toe vitals check, medication safety audit, and fall-risk evaluation.",
      salePrice: "₹1,499",
      regPrice: "₹2,999",
      discount: "50% Off",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbae_007-back.svg",
      slug: "home-health-assessment",
    },
    {
      title: "Post-Op Wound Dressing",
      desc: "Sterile single-use surgical dressing, aseptic cleansing, and infection surveillance.",
      salePrice: "₹1,900",
      regPrice: "₹3,200",
      discount: "40% Off",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb4_01-headache.svg",
      slug: "wound-care-and-dressing",
    },
    {
      title: "Physical Therapy & Rehab",
      desc: "Targeted mobility, gait training, and personalized strength recovery by certified PTs.",
      salePrice: "₹2,499",
      regPrice: "₹4,000",
      discount: "38% Off",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb5_018-arm.svg",
      slug: "physical-therapy-session",
    },
  ];

  const products = [
    {
      title: "Nitrile Sterile Medical Gloves (100 pcs)",
      category: "Clinical Consumable",
      rating: "4.9",
      price: "₹899",
      origPrice: "₹1,200",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbf0_PRODUCT%20IMAGE021.png",
      discount: "25% Off",
    },
    {
      title: "Digital Fingertip Pulse Oximeter & Monitor",
      category: "Diagnostic Device",
      rating: "4.8",
      price: "₹1,499",
      origPrice: "₹2,200",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb7_PRODUCT%20IMAGE.png",
      discount: "30% Off",
    },
    {
      title: "Hospital-Grade Sterile Wound Dressing Pack",
      category: "Sterile Kit",
      rating: "5.0",
      price: "₹1,899",
      origPrice: "₹2,800",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbf2_PRODUCT%20IMAGE.png",
      discount: "32% Off",
    },
    {
      title: "Bedside Clinician Infection-Control PPE Set",
      category: "Hygiene",
      rating: "4.7",
      price: "₹549",
      origPrice: "₹799",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbf1_PRODU.png",
      discount: "30% Off",
    },
  ];

  return (
    <section className="wf-lab-deals-section">
      <div className="wf-container">
        {/* 1. Frequently Booked Clinical Packages */}
        <div className="wf-lab-tests-block">
          <div className="wf-block-header">
            <h2 className="wf-block-title">
              Frequently Booked <br />
              Clinical Packages
            </h2>
            <Link href="/services" className="wf-view-all-link">
              <span>View All Programs</span>
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb3_arrow%20white%2002.svg"
                alt=""
              />
            </Link>
          </div>

          <div className="wf-lab-cards-grid">
            {labTests.map((test, idx) => (
              <Link key={idx} href={`/services/${test.slug}`} className="wf-lab-card-link" style={{ textDecoration: "none" }}>
                <div className="wf-lab-card">
                  <div className="wf-lab-card-top">
                    <span className="wf-discount-badge">{test.discount}</span>
                    <h3 className="wf-lab-test-title">{test.title}</h3>
                    <p className="wf-lab-test-desc">{test.desc}</p>
                  </div>
                  <div className="wf-lab-price-row">
                    <div className="wf-prices">
                      <span className="wf-sale-price">{test.salePrice}</span>
                      <span className="wf-reg-price">{test.regPrice}</span>
                    </div>
                    <img src={test.icon} alt="" className="wf-lab-icon" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. Sterile Consumables & Medical Kits */}
        <div className="wf-best-deals-block">
          <div className="wf-block-header">
            <h2 className="wf-block-title">
              Bedside Sterile Kits &amp; <br />
              Diagnostic Supplies
            </h2>
            <Link href="/services" className="wf-view-all-link">
              <span>Explore All Supplies</span>
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb3_arrow%20white%2002.svg"
                alt=""
              />
            </Link>
          </div>

          <div className="wf-products-grid">
            {products.map((prod, idx) => (
              <div key={idx} className="wf-product-card">
                <div className="wf-product-img-wrap">
                  <img src={prod.image} alt={prod.title} className="wf-product-img" />
                  <span className="wf-product-discount-tag">{prod.discount}</span>
                </div>

                <div className="wf-product-details">
                  <div className="wf-prod-meta-row">
                    <span className="wf-prod-cat">{prod.category}</span>
                    <span className="wf-prod-rating">★ {prod.rating}</span>
                  </div>

                  <h3 className="wf-prod-title">{prod.title}</h3>

                  <div className="wf-prod-bottom-row">
                    <Link href="/services" className="wf-add-cart-btn" style={{ textDecoration: "none" }}>
                      + Add to Visit
                    </Link>
                    <div className="wf-prod-price-wrap">
                      <span className="wf-prod-price">{prod.price}</span>
                      <span className="wf-prod-orig">{prod.origPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
