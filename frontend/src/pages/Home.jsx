import React from "react";
import { Link } from "react-router-dom";
import { Shield, Home as HomeIcon, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const featuredProperties = [
    {
      id: "featured-1",
      title: "Luxury 3BHK",
      description: "Spacious family home with easy access to transit and premium amenities.",
      price: "42,000",
      location: "Jubilee Hills, Telangana",
      type: "Apartment"
    },
    {
      id: "featured-2",
      title: "Modern Studio",
      description: "Fully furnished high-end studio with clubhouse and pool access.",
      price: "28,000",
      location: "Gachibowli, Telangana",
      type: "Apartment"
    },
    {
      id: "featured-3",
      title: "Premium 2BHK",
      description: "Comfortable and light-filled 2BHK suitable for families and professionals.",
      price: "36,000",
      location: "Whitefield, Karnataka",
      type: "Independent House"
    }
  ];

  const popularStates = [
    { name: "Andhra Pradesh", image: "https://picsum.photos/seed/AndhraPradesh/900/600" },
    { name: "Arunachal Pradesh", image: "https://picsum.photos/seed/ArunachalPradesh/900/600" },
    { name: "Assam", image: "https://picsum.photos/seed/Assam/900/600" },
    { name: "Bihar", image: "https://picsum.photos/seed/Bihar/900/600" },
    { name: "Chhattisgarh", image: "https://picsum.photos/seed/Chhattisgarh/900/600" },
    { name: "Delhi", image: "https://picsum.photos/seed/Delhi/900/600" },
    { name: "Goa", image: "https://picsum.photos/seed/Goa/900/600" },
    { name: "Gujarat", image: "https://picsum.photos/seed/Gujarat/900/600" },
    { name: "Haryana", image: "https://picsum.photos/seed/Haryana/900/600" },
    { name: "Himachal Pradesh", image: "https://picsum.photos/seed/HimachalPradesh/900/600" },
    { name: "Jharkhand", image: "https://picsum.photos/seed/Jharkhand/900/600" },
    { name: "Karnataka", image: "https://picsum.photos/seed/Karnataka/900/600" },
    { name: "Kerala", image: "https://picsum.photos/seed/Kerala/900/600" },
    { name: "Madhya Pradesh", image: "https://picsum.photos/seed/MadhyaPradesh/900/600" },
    { name: "Maharashtra", image: "https://picsum.photos/seed/Maharashtra/900/600" },
    { name: "Manipur", image: "https://picsum.photos/seed/Manipur/900/600" },
    { name: "Meghalaya", image: "https://picsum.photos/seed/Meghalaya/900/600" },
    { name: "Mizoram", image: "https://picsum.photos/seed/Mizoram/900/600" },
    { name: "Nagaland", image: "https://picsum.photos/seed/Nagaland/900/600" },
    { name: "Odisha", image: "https://picsum.photos/seed/Odisha/900/600" },
    { name: "Punjab", image: "https://picsum.photos/seed/Punjab/900/600" },
    { name: "Rajasthan", image: "https://picsum.photos/seed/Rajasthan/900/600" },
    { name: "Sikkim", image: "https://picsum.photos/seed/Sikkim/900/600" },
    { name: "Tamil Nadu", image: "https://picsum.photos/seed/TamilNadu/900/600" },
    { name: "Telangana", image: "https://picsum.photos/seed/Telangana/900/600" },
    { name: "Tripura", image: "https://picsum.photos/seed/Tripura/900/600" },
    { name: "Uttar Pradesh", image: "https://picsum.photos/seed/UttarPradesh/900/600" },
    { name: "Uttarakhand", image: "https://picsum.photos/seed/Uttarakhand/900/600" },
    { name: "West Bengal", image: "https://picsum.photos/seed/WestBengal/900/600" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="hero-content-wrap">
          <div className="container hero-container">
            <span className="hero-badge">Direct Owner Connections • Verified Listings</span>
            <h1>Find Your Perfect Rental Home</h1>
            <p>
              Discover luxury villas, apartments, and independent houses across prime neighborhoods
              with zero mediator hassle.
            </p>
            <div className="hero-actions">
              <Link to="/properties" className="btn btn-primary">
                Browse Properties <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary">
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-subtitle">Handpicked Rentals</span>
              <h2>Featured Properties</h2>
            </div>
            <Link to="/properties" className="view-all-link">
              View all listings <ArrowRight size={16} />
            </Link>
          </div>

          <div className="featured-grid">
            {featuredProperties.map((prop) => (
              <article key={prop.id} className="featured-card">
                <div className="card-tag">{prop.type}</div>
                <div className="card-img-placeholder">
                  <HomeIcon size={40} className="icon-glow" />
                </div>
                <div className="card-body">
                  <h3>{prop.title}</h3>
                  <p className="card-loc">{prop.location}</p>
                  <p className="card-desc">{prop.description}</p>
                  <div className="card-footer">
                    <span className="card-price">Rs. {prop.price} <small>/ mo</small></span>
                    <Link to={`/properties?area=${encodeURIComponent(prop.location)}`} className="card-btn">
                      Explore
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-center-header">
            <span className="section-subtitle">What We Offer</span>
            <h2>Simplifying Home Rentals</h2>
            <p>We operate across India, helping owners manage listings and tenants find verified homes seamlessly.</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-wrap">
                <Shield size={28} />
              </div>
              <h3>100% Verified Listings</h3>
              <p>We check addresses, specifications, and owners to prevent fraudulent activity and protect renters.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrap">
                <HomeIcon size={28} />
              </div>
              <h3>Direct Owner Deals</h3>
              <p>No middlemen means no high brokerage charges. Connect directly with owners via phone and email.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-wrap">
                <CheckCircle size={28} />
              </div>
              <h3>Flexible Visit Bookings</h3>
              <p>Schedule visits instantly via our automated system. Choose a date and confirm requests in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="states-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-subtitle">Available Locations</span>
              <h2>Explore Properties by State</h2>
            </div>
          </div>

          <div className="states-grid">
            {popularStates.map((state, idx) => (
              <Link
                key={idx}
                to={`/properties?area=${encodeURIComponent(state.name)}`}
                className="state-card"
              >
                <img
                  src={state.image}
                  alt={state.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/900x600?text=${encodeURIComponent(state.name)}`;
                  }}
                />
                <div className="state-overlay">
                  <h3>{state.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container about-container">
          <div className="about-content">
            <span className="section-subtitle">Our Story</span>
            <h2>About Nestora Connect</h2>
            <p>
              Nestora Connect was founded with a clear vision: to make house hunting transparent, 
              direct, and completely stress-free. By eliminating intermediaries and brokerages, 
              we connect property owners directly with prospective tenants across all Indian states.
            </p>
            <p>
              We prioritize verification, security, and ease of communication. Whether you are 
              looking to rent a cozy studio apartment or list a luxury garden villa, Nestora Connect 
              provides the premium tools and verified channels to make it happen seamlessly.
            </p>
          </div>
          <div className="about-visual">
            <div className="visual-card-glass">
              <span className="glass-number">0%</span>
              <span className="glass-label">Brokerage Fee</span>
            </div>
            <div className="visual-card-glass">
              <span className="glass-number">100%</span>
              <span className="glass-label">Verified Owners</span>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CSS for Home Page only */}
      <style>{`
        /* Hero Section styles */
        .hero-section {
          position: relative;
          min-height: 80vh;
          background: url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80") center/cover no-repeat;
          display: flex;
          align-items: center;
          color: white;
          overflow: hidden;
          margin-bottom: 4rem;
        }
        
        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, rgba(8, 30, 50, 0.88) 0%, rgba(8, 30, 50, 0.4) 100%);
          z-index: 1;
        }

        .hero-content-wrap {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .hero-badge {
          background: rgba(10, 108, 106, 0.3);
          border: 1px solid rgba(10, 108, 106, 0.5);
          backdrop-filter: blur(8px);
          padding: 0.5rem 1.2rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          color: #2dd4bf;
          text-transform: uppercase;
        }

        .hero-section h1 {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          color: white;
          max-width: 800px;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .hero-section p {
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          color: #cbd5e1;
          max-width: 600px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        /* Section Headings */
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
        }

        .section-subtitle {
          color: var(--primary-light);
          font-weight: 800;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 0.5rem;
        }

        .section-center-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 3.5rem;
        }

        .section-center-header p {
          color: var(--text-muted);
          margin-top: 0.8rem;
          font-size: 1.1rem;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          color: var(--primary);
        }

        .view-all-link:hover {
          color: var(--primary-dark);
          transform: translateX(3px);
        }

        /* Featured Grid */
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }

        .featured-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
        }

        .featured-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .card-tag {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(18, 57, 91, 0.9);
          backdrop-filter: blur(4px);
          color: white;
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          z-index: 2;
        }

        .card-img-placeholder {
          height: 200px;
          background: linear-gradient(135deg, #0e2b42 0%, #16466b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2dd4bf;
        }

        .icon-glow {
          filter: drop-shadow(0 0 10px rgba(45, 212, 191, 0.4));
        }

        .card-body {
          padding: 1.5rem;
        }

        .card-body h3 {
          font-size: 1.25rem;
          margin-bottom: 0.4rem;
        }

        .card-loc {
          color: var(--text-muted);
          font-size: 0.92rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .card-desc {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          min-height: 4.5 line;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }

        .card-price {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary);
        }

        .card-price small {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .card-btn {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--secondary);
          transition: color var(--transition-fast);
        }

        .card-btn:hover {
          color: var(--primary);
        }

        /* Services Section */
        .services-section {
          background: linear-gradient(180deg, var(--surface) 0%, rgba(243, 247, 251, 0.6) 100%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 5rem 0;
          margin-bottom: 5rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
        }

        .service-card {
          text-align: center;
          padding: 2.5rem 2rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }

        .service-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--bg);
          color: var(--primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 10px rgba(10, 108, 106, 0.1);
        }

        .service-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.8rem;
        }

        .service-card p {
          color: var(--text-muted);
          font-size: 0.96rem;
          line-height: 1.6;
        }

        /* States Section */
        .states-section {
          padding-bottom: 5rem;
        }

        .states-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .state-card {
          position: relative;
          height: 200px;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
        }

        .state-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .state-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(8, 30, 50, 0.1) 0%, rgba(8, 30, 50, 0.85) 100%);
          display: flex;
          align-items: flex-end;
          padding: 1.2rem;
          z-index: 1;
        }

        .state-card h3 {
          color: white;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .state-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .state-card:hover img {
          transform: scale(1.08);
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 65vh;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .hero-actions .btn {
            width: 100%;
          }
          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .services-section {
            padding: 3.5rem 0;
          }
        }

        /* About Section styles */
        .about-section {
          padding: 5rem 0;
          background: linear-gradient(180deg, rgba(243, 247, 251, 0.6) 0%, var(--surface) 100%);
          border-top: 1px solid var(--border);
        }

        .about-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
        }

        .about-content h2 {
          font-size: 2.2rem;
          color: var(--secondary-dark);
          margin-bottom: 1.2rem;
        }

        .about-content p {
          color: var(--text-muted);
          line-height: 1.8;
          font-size: 1.05rem;
          margin-bottom: 1.2rem;
        }

        .about-visual {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .visual-card-glass {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: var(--shadow-md);
          border-radius: var(--radius-md);
          padding: 2.5rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }

        .visual-card-glass:hover {
          transform: translateY(-5px);
          border-color: var(--primary-light);
        }

        .glass-number {
          display: block;
          font-family: "Outfit", sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .glass-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--secondary-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .about-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .about-visual {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
