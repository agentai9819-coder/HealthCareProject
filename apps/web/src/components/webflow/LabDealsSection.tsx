"use client";

import Link from "next/link";

export function LabDealsSection() {
  const labTests = [
    {
      title: "Imaging tests",
      desc: "Imaging tests, such as X-rays, CT scans, and MRIs",
      salePrice: "₹1,299",
      regPrice: "₹2,499",
      discount: "50% Off",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbae_007-back.svg",
    },
    {
      title: "MRI & CT Scan",
      desc: "High-resolution diagnostics with doorstep radiologist pickup",
      salePrice: "₹3,499",
      regPrice: "₹6,000",
      discount: "45% Off",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb4_01-headache.svg",
    },
    {
      title: "Orthopedists Tests",
      desc: "Orthopedists diagnose and treat back and joint mobility",
      salePrice: "₹1,499",
      regPrice: "₹2,800",
      discount: "48% Off",
      icon: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb5_018-arm.svg",
    },
  ];

  const products = [
    {
      title: "Dietary Supplement Health Products",
      category: "Nutrition",
      rating: "4.5",
      price: "₹1,499",
      origPrice: "₹2,200",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb7_PRODUCT%20IMAGE.png",
      discount: "30% Off",
    },
    {
      title: "Nitrile Sterile Medical Gloves (100 pcs)",
      category: "Healthcare",
      rating: "4.8",
      price: "₹899",
      origPrice: "₹1,200",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbf0_PRODUCT%20IMAGE021.png",
      discount: "25% Off",
    },
    {
      title: "Women's Multi-Vitamins & Biotin Complex",
      category: "Medicine",
      rating: "4.9",
      price: "₹1,899",
      origPrice: "₹2,999",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbf2_PRODUCT%20IMAGE.png",
      discount: "35% Off",
    },
    {
      title: "Hospital-Grade Antibacterial Sanitizer Pack",
      category: "Wellness",
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
        {/* 1. Lab Tests Grid */}
        <div className="wf-lab-tests-block">
          <div className="wf-block-header">
            <h2 className="wf-block-title">
              Frequently Booked <br />
              Lab Tests
            </h2>
            <Link href="/services" className="wf-view-all-link">
              <span>View All Lab Tests</span>
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbb3_arrow%20white%2002.svg"
                alt=""
              />
            </Link>
          </div>

          <div className="wf-lab-cards-grid">
            {labTests.map((test, idx) => (
              <div key={idx} className="wf-lab-card">
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
            ))}
          </div>
        </div>

        {/* 2. Today's Best Deals Grid */}
        <div className="wf-best-deals-block">
          <div className="wf-block-header">
            <h2 className="wf-block-title">
              Today&apos;s Best Deals <br />
              For You!
            </h2>
            <Link href="/services" className="wf-view-all-link">
              <span>See All Products</span>
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
                    <button type="button" className="wf-add-cart-btn">
                      + Add to Cart
                    </button>
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
