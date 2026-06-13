import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Bed, Bath, ArrowRight } from "lucide-react";
import { API_BASE, getImageUrl } from "../config";


export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search filter states
  const [area, setArea] = useState(searchParams.get("area") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [budget, setBudget] = useState(searchParams.get("budget") || "");

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackProperties = [
    {
      _id: "fallback-1",
      propertyName: "Luxury Garden Villa",
      propertyType: "Villa",
      location: "Jubilee Hills, Hyderabad",
      rentPrice: "145000",
      bedrooms: 4,
      bathrooms: 4,
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"],
      phoneNumber: "+91 98765 43210",
      email: "owner1@gmail.com",
      description: "This elegant garden villa offers spacious living areas, premium finishes, natural light, and a calm residential setting."
    },
    {
      _id: "fallback-2",
      propertyName: "Skyline Family Apartment",
      propertyType: "Apartment",
      location: "Gachibowli, Hyderabad",
      rentPrice: "48000",
      bedrooms: 3,
      bathrooms: 2,
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80"],
      phoneNumber: "+91 91234 56789",
      email: "owner2@gmail.com",
      description: "A bright apartment in the heart of Gachibowli with modern finishes and easy access to local amenities."
    },
    {
      _id: "fallback-3",
      propertyName: "Lakeview Premium Penthouse",
      propertyType: "Penthouse",
      location: "Banjara Hills, Hyderabad",
      rentPrice: "82000",
      bedrooms: 3,
      bathrooms: 3,
      images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"],
      phoneNumber: "+91 99876 54321",
      email: "owner3@gmail.com",
      description: "A premium penthouse with lake views, spacious interiors, and upscale dining and entertainment nearby."
    }
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal"
  ];

  useEffect(() => {
    // Route guard check: must be logged in to view properties list
    const sessionStr = localStorage.getItem("ownerSession");
    if (!sessionStr) {
      navigate("/login?redirect=properties");
      return;
    }

    // Sync filter state variables with search parameters when URL change occurs
    setArea(searchParams.get("area") || "");
    setType(searchParams.get("type") || "");
    setBudget(searchParams.get("budget") || "");

    async function fetchProperties() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/properties`);
        if (!response.ok) {
          throw new Error("Failed to load properties");
        }
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error("Fetch properties error, loading fallbacks:", err);
        setProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (area.trim()) params.set("area", area.trim());
    if (type) params.set("type", type);
    if (budget) params.set("budget", budget);
    setSearchParams(params);
  };

  const getPriceValue = (priceText) => {
    return Number(String(priceText).replace(/[^0-9]/g, ""));
  };

  const matchesBudget = (price, filter) => {
    if (!filter) return true;
    const numericPrice = getPriceValue(price);
    if (filter === "Below 20,000") return numericPrice < 20000;
    if (filter === "20,000 - 40,000") return numericPrice >= 20000 && numericPrice <= 40000;
    if (filter === "Above 40,000") return numericPrice > 40000;
    return true;
  };

  const filteredProperties = properties.filter((property) => {
    const title = (property.propertyName || "").toLowerCase();
    const location = (property.location || "").toLowerCase();
    const description = (property.description || "").toLowerCase();
    const state = (property.state || "").toLowerCase();
    const city = (property.city || "").toLowerCase();
    const pType = (property.propertyType || "").toLowerCase();

    const areaFilterVal = (searchParams.get("area") || "").toLowerCase().trim();
    const typeFilterVal = (searchParams.get("type") || "").toLowerCase().trim();
    const budgetFilterVal = searchParams.get("budget") || "";

    const areaMatch = !areaFilterVal || 
                      title.includes(areaFilterVal) || 
                      location.includes(areaFilterVal) || 
                      description.includes(areaFilterVal) ||
                      state.includes(areaFilterVal) ||
                      city.includes(areaFilterVal);

    // Normalize select values ('villa', 'apartment', etc.) to match option labels
    const normPType = pType.replace("-", " ");
    const normFilterType = typeFilterVal.replace("-", " ");
    const typeMatch = !typeFilterVal || normPType.includes(normFilterType) || normFilterType.includes(normPType);

    const budgetMatch = matchesBudget(property.rentPrice, budgetFilterVal);

    return areaMatch && typeMatch && budgetMatch;
  });

  const getPropertyImage = (property) => {
    if (Array.isArray(property.images) && property.images.length > 0) {
      return getImageUrl(property.images[0]);
    }
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
  };

  const getActiveFiltersText = () => {
    const filters = [];
    const areaFilter = searchParams.get("area");
    const typeFilter = searchParams.get("type");
    const budgetFilter = searchParams.get("budget");

    if (areaFilter) filters.push(`in "${areaFilter}"`);
    if (typeFilter) filters.push(`type: ${typeFilter}`);
    if (budgetFilter) filters.push(`budget: ${budgetFilter}`);

    if (filters.length === 0) return "Showing all available properties";
    return `Filtered by: ${filters.join(", ")}`;
  };

  return (
    <div className="properties-page container">
      {/* Page Header */}
      <header className="properties-header">
        <h1>Rental Properties</h1>
        <p>Explore premium apartments, villas, and penthouses. Direct contact with verified owners.</p>
      </header>

      {/* Search Bar */}
      <section className="search-bar-section">
        <form onSubmit={handleSearchSubmit} className="search-bar-form">
          <div className="search-input-group">
            <div className="input-icon-wrap">
              <Search size={18} className="search-icon" />
            </div>
            <input
              type="text"
              placeholder="City, location, or state..."
              list="areas-list"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              aria-label="Search by location"
            />
            <datalist id="areas-list">
              {indianStates.map((state, index) => (
                <option key={index} value={state} />
              ))}
            </datalist>
          </div>

          <div className="search-select-group">
            <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type">
              <option value="">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Independent House">Independent House</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Farmhouse">Farmhouse</option>
            </select>
          </div>

          <div className="search-select-group">
            <select value={budget} onChange={(e) => setBudget(e.target.value)} aria-label="Budget">
              <option value="">Budget Limit</option>
              <option value="Below 20,000">Below 20,000</option>
              <option value="20,000 - 40,000">20,000 - 40,000</option>
              <option value="Above 40,000">Above 40,000</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary search-btn">
            Search
          </button>
        </form>
      </section>

      {/* Active Search Summary */}
      <div className="filter-summary-row">
        <p className="filter-text">{getActiveFiltersText()}</p>
        <span className="results-count">
          {filteredProperties.length} {filteredProperties.length === 1 ? "listing" : "listings"} found
        </span>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="no-results-panel">
          <h3>No Properties Match Your Search</h3>
          <p>Try resetting filters, searching a different state, or adjusting your budget.</p>
          <button 
            onClick={() => {
              setArea("");
              setType("");
              setBudget("");
              setSearchParams({});
            }}
            className="btn btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <article key={property._id} className="property-item-card">
              <div className="card-image-wrap">
                <img
                  src={getPropertyImage(property)}
                  alt={property.propertyName || "Property Listing"}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
                  }}
                />
                <span className="type-badge">{property.propertyType || "Property"}</span>
              </div>
              
              <div className="card-content">
                <div className="card-top">
                  <h3>{property.propertyName}</h3>
                  <div className="card-location-row">
                    <MapPin size={15} />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="card-middle">
                  <div className="card-feature">
                    <Bed size={16} />
                    <span>{property.bedrooms || "--"} Bed</span>
                  </div>
                  <div className="card-feature">
                    <Bath size={16} />
                    <span>{property.bathrooms || "--"} Bath</span>
                  </div>
                </div>

                <div className="card-bottom-row">
                  <div className="price-tag">
                    Rs. {Number(property.rentPrice).toLocaleString("en-IN")}
                    <span className="price-period"> / mo</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/property/${property._id}`)}
                    className="btn btn-secondary view-details-btn"
                  >
                    Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <style>{`
        .properties-page {
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .properties-header {
          margin-bottom: 2rem;
        }

        .properties-header h1 {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          margin-bottom: 0.5rem;
        }

        .properties-header p {
          color: var(--text-muted);
          font-size: 1.05rem;
          max-width: 600px;
        }

        /* Search Bar styling */
        .search-bar-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          margin-bottom: 2rem;
        }

        .search-bar-form {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr auto;
          gap: 1rem;
          align-items: center;
        }

        .search-input-group {
          position: relative;
        }

        .input-icon-wrap {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .search-input-group input {
          padding-left: 2.75rem;
        }

        .search-btn {
          height: 100%;
          min-height: 48px;
        }

        /* Filter Summary */
        .filter-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-weight: 600;
          color: var(--secondary-light);
        }

        .filter-text {
          font-size: 0.95rem;
        }

        .results-count {
          background: rgba(10, 108, 106, 0.08);
          color: var(--primary);
          padding: 0.25rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
        }

        /* Properties Grid */
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .property-item-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
        }

        .property-item-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: #cbdbe5;
        }

        .card-image-wrap {
          position: relative;
          aspect-ratio: 4 / 3;
          background: #e2e8f0;
          overflow: hidden;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .property-item-card:hover .card-image-wrap img {
          transform: scale(1.05);
        }

        .type-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: var(--surface-glass);
          backdrop-filter: blur(4px);
          color: var(--primary);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-top {
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .card-top h3 {
          font-size: 1.15rem;
          margin-bottom: 0.35rem;
          color: var(--secondary);
          line-height: 1.3;
        }

        .card-location-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 600;
        }

        .card-middle {
          display: flex;
          gap: 1rem;
          padding: 0.8rem 0;
          border-top: 1px dashed var(--border);
          border-bottom: 1px dashed var(--border);
          margin-bottom: 1.25rem;
        }

        .card-feature {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #4b5563;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .card-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .price-tag {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
        }

        .price-period {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .view-details-btn {
          padding: 0.5rem 0.9rem;
          font-size: 0.88rem;
        }

        /* Loading / No results panel */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          color: var(--text-muted);
          gap: 1rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-results-panel {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surface);
          border: 1px dashed var(--border);
          border-radius: var(--radius-md);
        }

        .no-results-panel h3 {
          margin-bottom: 0.5rem;
        }

        .no-results-panel p {
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .search-bar-form {
            grid-template-columns: 1fr 1fr;
          }
          .search-btn {
            grid-column: span 2;
          }
        }

        @media (max-width: 560px) {
          .search-bar-form {
            grid-template-columns: 1fr;
          }
          .search-btn {
            grid-column: auto;
          }
        }
      `}</style>
    </div>
  );
}
