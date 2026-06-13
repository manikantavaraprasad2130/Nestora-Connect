import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, User, Calendar, Check, ArrowLeft, Info, Eye } from "lucide-react";
import { API_BASE, getImageUrl } from "../config";


export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal control states
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);

  // Visit Booking Form state
  const [visitorName, setVisitorName] = useState("");
  const [visitorMobile, setVisitorMobile] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitSuccess, setVisitSuccess] = useState(false);
  const [visitLoading, setVisitLoading] = useState(false);

  // Fallback items if direct matching fails
  const fallbackProperties = [
    {
      _id: "fallback-1",
      propertyName: "Luxury Garden Villa",
      propertyType: "Villa",
      location: "Jubilee Hills, Hyderabad",
      rentPrice: "145000",
      bedrooms: 4,
      bathrooms: 4,
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"],
      phoneNumber: "+91 98765 43210",
      email: "owner1@gmail.com",
      ownerName: "Rajesh Kumar",
      description: "This elegant garden villa offers spacious living areas, premium finishes, natural light, and a calm residential setting.",
      state: "Telangana",
      city: "Hyderabad",
      district: "Hyderabad",
      pincode: "500033",
      houseNumber: "Flat 402",
      street: "Road No. 10"
    },
    {
      _id: "fallback-2",
      propertyName: "Skyline Family Apartment",
      propertyType: "Apartment",
      location: "Gachibowli, Hyderabad",
      rentPrice: "48000",
      bedrooms: 3,
      bathrooms: 2,
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85"],
      phoneNumber: "+91 91234 56789",
      email: "owner2@gmail.com",
      ownerName: "Ananya Reddy",
      description: "A bright apartment in the heart of Gachibowli with modern finishes and easy access to local amenities.",
      state: "Telangana",
      city: "Hyderabad",
      district: "Rangareddy",
      pincode: "500032",
      houseNumber: "Block B-701",
      street: "ISB Road"
    },
    {
      _id: "fallback-3",
      propertyName: "Lakeview Premium Penthouse",
      propertyType: "Penthouse",
      location: "Banjara Hills, Hyderabad",
      rentPrice: "82000",
      bedrooms: 3,
      bathrooms: 3,
      images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"],
      phoneNumber: "+91 99876 54321",
      email: "owner3@gmail.com",
      ownerName: "Sanjay Verma",
      description: "A premium penthouse with lake views, spacious interiors, and upscale dining and entertainment nearby.",
      state: "Telangana",
      city: "Hyderabad",
      district: "Hyderabad",
      pincode: "500034",
      houseNumber: "Penthouse A",
      street: "Road No. 2"
    }
  ];

  const backupImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85"
  ];

  useEffect(() => {
    // Route guard check: must be logged in to view property details
    const sessionStr = localStorage.getItem("ownerSession");
    if (!sessionStr) {
      navigate(`/login?redirect=property/${id}`);
      return;
    }

    async function getProperty() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/properties/${id}`);
        if (!response.ok) {
          throw new Error("Property not found");
        }
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        console.error("Failed to load property details, matching fallbacks:", err);
        const match = fallbackProperties.find((p) => p._id === id);
        if (match) {
          setProperty(match);
        } else {
          setError("Property not found");
        }
      } finally {
        setLoading(false);
      }
    }

    getProperty();
  }, [id, navigate]);

  const handleBookVisitSubmit = async (e) => {
    e.preventDefault();
    setVisitLoading(true);
    setVisitSuccess(false);

    try {
      const response = await fetch(`${API_BASE}/api/visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          propertyId: id,
          visitorName,
          visitorMobile,
          visitDate
        })
      });

      if (!response.ok) {
        throw new Error("Unable to submit visit booking request.");
      }

      setVisitSuccess(true);
      setVisitorName("");
      setVisitorMobile("");
      setVisitDate("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit request.");
    } finally {
      setVisitLoading(false);
    }
  };

  const getFullAddressString = (prop) => {
    const parts = [];
    const houseNumber = prop.houseNumber || prop["house-number"];
    const street = prop.street;
    const village = prop.village;
    const city = prop.city;
    const district = prop.district;
    const state = prop.state;
    const pincode = prop.pincode;

    if (houseNumber) parts.push(`House No. ${houseNumber}`);
    if (street) parts.push(street);
    if (village) parts.push(village);
    if (city) parts.push(city);
    if (district) parts.push(district);
    if (state) parts.push(state);
    if (pincode) parts.push(pincode);

    return parts.join(", ") || prop.location || "Address not fully entered.";
  };

  if (loading) {
    return (
      <div className="detail-loading-state container">
        <div className="spinner"></div>
        <p>Retrieving property information...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="detail-error-state container">
        <h2>Property Not Found</h2>
        <p>The listing you are searching for does not exist or has been removed.</p>
        <Link to="/properties" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Back to Listings
        </Link>
      </div>
    );
  }

  // Build display images arrays
  const displayImages = [];
  if (Array.isArray(property.images) && property.images.length > 0) {
    property.images.forEach((img) => {
      displayImages.push(getImageUrl(img));
    });
  }

  // Supplement missing images from backup list
  while (displayImages.length < 5) {
    displayImages.push(backupImages[displayImages.length]);
  }

  return (
    <div className="property-details-page container">
      {/* Back Link Header */}
      <nav className="details-navbar" aria-label="Details navigation">
        <Link to="/properties" className="back-link">
          <ArrowLeft size={16} /> Back to Properties
        </Link>
      </nav>

      {/* Grid Gallery */}
      <section className="detail-gallery" aria-label="Property gallery">
        <div className="gallery-primary">
          <img src={displayImages[0]} alt="Primary interior view" />
        </div>
        <div className="gallery-secondary-col">
          <img src={displayImages[1]} alt="Accessory detail 1" />
          <img src={displayImages[2]} alt="Accessory detail 2" />
        </div>
        <div className="gallery-secondary-col">
          <img src={displayImages[3]} alt="Accessory detail 3" />
          <img src={displayImages[4]} alt="Accessory detail 4" />
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="details-layout">
        {/* Left Panel: Specifications */}
        <article className="left-info-panel">
          <div className="title-section">
            <span className="type-badge-inline">{property.propertyType || "Property"}</span>
            <h1>{property.propertyName || "Untitled Property"}</h1>
            <p className="location-row">
              <MapPin size={18} /> {property.location}
            </p>
          </div>

          {/* Key Quick Info Row */}
          <div className="quick-metrics-row">
            <div className="metric-box">
              <span className="metric-label">Monthly Rent</span>
              <span className="metric-val">Rs. {Number(property.rentPrice).toLocaleString("en-IN")}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Bedrooms</span>
              <span className="metric-val">{property.bedrooms || "--"} BHK</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Bathrooms</span>
              <span className="metric-val">{property.bathrooms || "--"} Bath</span>
            </div>
          </div>

          {/* Description */}
          <section className="spec-section">
            <h2>Description</h2>
            <p className="description-text">
              {property.description || "No specific descriptive information was uploaded for this property."}
            </p>
          </section>

          {/* Full address breakdown */}
          <section className="spec-section">
            <h2>Property Location & Address</h2>
            <div className="address-display-box">
              <p className="main-address-text">{getFullAddressString(property)}</p>
              <div className="address-grid">
                {property.houseNumber || property["house-number"] ? (
                  <div className="address-item"><strong>House No:</strong> {property.houseNumber || property["house-number"]}</div>
                ) : null}
                {property.street ? (
                  <div className="address-item"><strong>Street:</strong> {property.street}</div>
                ) : null}
                {property.village ? (
                  <div className="address-item"><strong>Village:</strong> {property.village}</div>
                ) : null}
                {property.city ? (
                  <div className="address-item"><strong>City:</strong> {property.city}</div>
                ) : null}
                {property.district ? (
                  <div className="address-item"><strong>District:</strong> {property.district}</div>
                ) : null}
                {property.state ? (
                  <div className="address-item"><strong>State:</strong> {property.state}</div>
                ) : null}
                {property.pincode ? (
                  <div className="address-item"><strong>PIN Code:</strong> {property.pincode}</div>
                ) : null}
              </div>
            </div>
          </section>

          {/* Full specification table */}
          <section className="spec-section">
            <h2>All Specifications</h2>
            <div className="specs-list-grid">
              <div className="spec-item">
                <span className="spec-key">Listing Name</span>
                <span className="spec-value">{property.propertyName}</span>
              </div>
              <div className="spec-item">
                <span className="spec-key">Property Type</span>
                <span className="spec-value">{property.propertyType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-key">City / Locality</span>
                <span className="spec-value">{property.location}</span>
              </div>
              <div className="spec-item">
                <span className="spec-key">Bedrooms</span>
                <span className="spec-value">{property.bedrooms || "Not specified"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-key">Bathrooms</span>
                <span className="spec-value">{property.bathrooms || "Not specified"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-key">Pricing Scheme</span>
                <span className="spec-value">Rs. {Number(property.rentPrice).toLocaleString("en-IN")} / month</span>
              </div>
            </div>
          </section>
        </article>

        {/* Right Side Panel: Contact / Operations card */}
        <aside className="right-action-sidebar">
          <div className="sidebar-pricing-card">
            <span className="sidebar-label">Rent Price</span>
            <h3>Rs. {Number(property.rentPrice).toLocaleString("en-IN")} <small>/ month</small></h3>
            
            <div className="owner-summary-box">
              <div className="owner-icon-wrap">
                <User size={24} />
              </div>
              <div>
                <span className="owner-title">Property Owner</span>
                <p className="owner-name">{property.ownerName || "Private Landlord"}</p>
              </div>
            </div>

            <div className="sidebar-buttons">
              <button onClick={() => setIsContactOpen(true)} className="btn btn-primary full-width-btn">
                Contact Owner
              </button>
              <button onClick={() => { setIsVisitOpen(true); setVisitSuccess(false); }} className="btn btn-secondary full-width-btn">
                Book Property Visit
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal 1: Contact Owner Modal */}
      {isContactOpen && (
        <div className="modal-backdrop" onClick={() => setIsContactOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Owner Contact Information</h2>
              <button onClick={() => setIsContactOpen(false)} className="modal-close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="contact-details-list">
                <div className="contact-details-item">
                  <User size={18} className="modal-icon" />
                  <div>
                    <strong>Name</strong>
                    <p>{property.ownerName || "Private Landlord"}</p>
                  </div>
                </div>
                <div className="contact-details-item">
                  <Phone size={18} className="modal-icon" />
                  <div>
                    <strong>Phone Number</strong>
                    <p>{property.phoneNumber || "Not provided"}</p>
                  </div>
                </div>
                <div className="contact-details-item">
                  <Mail size={18} className="modal-icon" />
                  <div>
                    <strong>Email Address</strong>
                    <p>{property.email || "Not provided"}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsContactOpen(false)} className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Book Visit Modal */}
      {isVisitOpen && (
        <div className="modal-backdrop" onClick={() => setIsVisitOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Property Visit</h2>
              <button onClick={() => setIsVisitOpen(false)} className="modal-close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              {visitSuccess ? (
                <div className="alert alert-success" style={{ flexDirection: "column", gap: "0.5rem", padding: "1.5rem" }}>
                  <Check size={32} />
                  <p style={{ fontSize: "1.1rem" }}>Booking Request Submitted!</p>
                  <span style={{ fontSize: "0.88rem", fontWeight: "normal", textAlign: "center" }}>
                    The owner will review your details and contact you to confirm the time.
                  </span>
                  <button 
                    onClick={() => setIsVisitOpen(false)} 
                    className="btn btn-primary" 
                    style={{ width: "100%", marginTop: "1.2rem" }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookVisitSubmit} className="visit-booking-form">
                  <div className="form-group">
                    <label htmlFor="vis-name">Full Name</label>
                    <input
                      type="text"
                      id="vis-name"
                      placeholder="Enter your name"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vis-mobile">Mobile Number</label>
                    <input
                      type="tel"
                      id="vis-mobile"
                      placeholder="+91 98765 43210"
                      value={visitorMobile}
                      onChange={(e) => setVisitorMobile(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vis-date">Visit Date</label>
                    <input
                      type="date"
                      id="vis-date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={visitLoading}
                    className="btn btn-primary confirm-booking-btn"
                  >
                    {visitLoading ? "Booking..." : "Confirm Schedule Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .property-details-page {
          padding-top: 1.5rem;
          padding-bottom: 4rem;
        }

        .details-navbar {
          margin-bottom: 1.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.95rem;
        }

        .back-link:hover {
          color: var(--primary-dark);
        }

        /* Detail Gallery Styling */
        .detail-gallery {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 0.8rem;
          height: 380px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          margin-bottom: 2.5rem;
          background: #e2e8f0;
        }

        .detail-gallery img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .detail-gallery img:hover {
          transform: scale(1.02);
        }

        .gallery-primary {
          grid-column: span 1;
          height: 100%;
        }

        .gallery-secondary-col {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          height: 100%;
        }

        .gallery-secondary-col img {
          height: calc(50% - 0.4rem);
        }

        /* Layout panels */
        .details-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 350px;
          gap: 2rem;
          align-items: start;
        }

        .left-info-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2.2rem;
          box-shadow: var(--shadow-sm);
        }

        .title-section {
          margin-bottom: 1.8rem;
        }

        .type-badge-inline {
          display: inline-block;
          background: rgba(10, 108, 106, 0.08);
          color: var(--primary);
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.6rem;
        }

        .left-info-panel h1 {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          color: var(--secondary-dark);
          line-height: 1.15;
          margin-bottom: 0.5rem;
        }

        .location-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-muted);
          font-size: 1.05rem;
          font-weight: 600;
        }

        /* Metrics boxes */
        .quick-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 2rem;
        }

        .metric-box {
          text-align: center;
          border-right: 1px dashed var(--border);
        }

        .metric-box:last-child {
          border-right: none;
        }

        .metric-label {
          display: block;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .metric-val {
          color: var(--primary);
          font-size: 1.25rem;
          font-weight: 800;
        }

        /* Sections inside description */
        .spec-section {
          border-top: 1px solid var(--border);
          padding-top: 1.8rem;
          margin-top: 1.8rem;
        }

        .spec-section h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--secondary);
        }

        .description-text {
          color: #4b5563;
          line-height: 1.8;
          font-size: 1.02rem;
        }

        /* Address display */
        .address-display-box {
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }

        .main-address-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--secondary-light);
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.75rem;
        }

        .address-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.8rem;
        }

        .address-item {
          font-size: 0.95rem;
          color: #4b5563;
        }

        /* Specifications key/values */
        .specs-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .spec-item {
          display: flex;
          flex-direction: column;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.8rem 1rem;
        }

        .spec-key {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 0.2rem;
        }

        .spec-value {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--secondary-dark);
        }

        /* Right Actions Card */
        .right-action-sidebar {
          position: sticky;
          top: 100px;
        }

        .sidebar-pricing-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.8rem;
          box-shadow: var(--shadow-md);
        }

        .sidebar-label {
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .sidebar-pricing-card h3 {
          font-size: 1.8rem;
          color: var(--primary);
          margin-bottom: 1.5rem;
          font-weight: 800;
        }

        .sidebar-pricing-card h3 small {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .owner-summary-box {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          margin-bottom: 1.8rem;
        }

        .owner-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(10, 108, 106, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .owner-title {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
        }

        .owner-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--secondary);
        }

        .sidebar-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .full-width-btn {
          width: 100%;
          min-height: 46px;
        }

        /* Modal Contact Owner */
        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-details-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }

        .modal-icon {
          color: var(--primary);
        }

        .contact-details-item strong {
          font-size: 0.85rem;
          color: var(--text-muted);
          display: block;
        }

        .contact-details-item p {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--secondary-dark);
        }

        /* Booking Form */
        .visit-booking-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .confirm-booking-btn {
          width: 100%;
          min-height: 46px;
          margin-top: 0.5rem;
        }

        /* Loading / Error states */
        .detail-loading-state,
        .detail-error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
          gap: 1rem;
        }

        @media (max-width: 900px) {
          .detail-gallery {
            grid-template-columns: 1fr;
            grid-template-rows: 250px 140px;
            height: auto;
          }
          
          .gallery-primary {
            height: 250px;
          }
          
          .gallery-secondary-col {
            flex-direction: row;
            height: 140px;
          }

          .gallery-secondary-col img {
            width: calc(50% - 0.4rem);
            height: 100%;
          }

          .details-layout {
            grid-template-columns: 1fr;
          }
          
          .right-action-sidebar {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
