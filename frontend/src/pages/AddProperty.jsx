import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, ArrowLeft, Upload, FileText, CheckCircle2 } from "lucide-react";
import { API_BASE } from "../config";


export default function AddProperty() {
  const navigate = useNavigate();
  const [ownerSession, setOwnerSession] = useState(null);

  // Form Field States
  const [propertyName, setPropertyName] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [village, setVillage] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState(null); // FileList

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Route guard check
    const sessionStr = localStorage.getItem("ownerSession");
    if (!sessionStr) {
      navigate("/login");
      return;
    }
    const session = JSON.parse(sessionStr);
    if (session.userType !== "owner") {
      navigate("/login");
      return;
    }
    setOwnerSession(session);
    
    // Auto-fill owner email and make it read-only
    setEmail(session.email || "");
    setOwnerName(session.fullName || "");
  }, [navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("property-name", propertyName);
    formData.append("location", location);
    formData.append("state", state);
    formData.append("pincode", pincode);
    formData.append("district", district);
    formData.append("city", city);
    formData.append("village", village);
    formData.append("house-number", houseNumber);
    formData.append("street", street);
    formData.append("property-type", propertyType);
    formData.append("rent-price", rentPrice);
    formData.append("ownerName", ownerName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("email", email);
    formData.append("bedrooms", bedrooms);
    formData.append("bathrooms", bathrooms);
    formData.append("description", description);

    // Pre-fill owner email logic from legacy script.js
    if (ownerSession && ownerSession.email) {
      formData.set("ownerEmail", ownerSession.email);
    }

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        // Express multer expects 'house-images' or 'images' fields
        formData.append("house-images", images[i]);
      }
    }

    try {
      const response = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to submit property listing.");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/owner-dashboard");
      }, 1500);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to add property.");
    } finally {
      setLoading(false);
    }
  };

  if (!ownerSession) {
    return null; // Don't render if redirecting
  }

  return (
    <div className="add-property-page container">
      {/* Top Navbar */}
      <nav className="add-navbar" aria-label="Add navbar">
        <Link to="/owner-dashboard" className="brand-link">
          <Building2 size={20} />
          <span>Nestora Owner</span>
        </Link>
        <Link to="/owner-dashboard" className="back-dashboard-link">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </nav>

      {/* Main Form Shell */}
      <div className="form-card-shell">
        <header className="form-card-header">
          <h1>Add Property Listing</h1>
          <p>Provide comprehensive address details, specifications, and upload real photos to list your property.</p>
        </header>

        {success ? (
          <div className="form-success-overlay">
            <CheckCircle2 size={56} className="success-icon" />
            <h2>Listing Created Successfully!</h2>
            <p>Redirecting you back to your owner dashboard workspace...</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="add-property-form" enctype="multipart/form-data">
            <div className="form-grid">
              {/* Property Name */}
              <div className="form-group full-width">
                <label htmlFor="prop-name">Property Name</label>
                <input
                  type="text"
                  id="prop-name"
                  placeholder="Luxury Garden Villa"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  required
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="prop-loc">Location Area</label>
                <input
                  type="text"
                  id="prop-loc"
                  placeholder="e.g. Jubilee Hills, Hyderabad"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* State */}
              <div className="form-group">
                <label htmlFor="prop-state">State</label>
                <input
                  type="text"
                  id="prop-state"
                  placeholder="e.g. Telangana"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label htmlFor="prop-pin">Pin Code</label>
                <input
                  type="text"
                  id="prop-pin"
                  placeholder="500033"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>

              {/* District */}
              <div className="form-group">
                <label htmlFor="prop-dist">District</label>
                <input
                  type="text"
                  id="prop-dist"
                  placeholder="e.g. Hyderabad"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label htmlFor="prop-city">City</label>
                <input
                  type="text"
                  id="prop-city"
                  placeholder="e.g. Hyderabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              {/* Village */}
              <div className="form-group">
                <label htmlFor="prop-vil">Village (Optional)</label>
                <input
                  type="text"
                  id="prop-vil"
                  placeholder="e.g. Nanakramguda"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>

              {/* House Number */}
              <div className="form-group">
                <label htmlFor="prop-house">House Number</label>
                <input
                  type="text"
                  id="prop-house"
                  placeholder="Flat No 402, Block A"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  required
                />
              </div>

              {/* Street */}
              <div className="form-group">
                <label htmlFor="prop-street">Street Name</label>
                <input
                  type="text"
                  id="prop-street"
                  placeholder="Road No 10"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>

              {/* Property Type */}
              <div className="form-group">
                <label htmlFor="prop-type">Property Type</label>
                <select
                  id="prop-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="independent-house">Independent House</option>
                  <option value="farmhouse">Farmhouse</option>
                </select>
              </div>

              {/* Rent Price */}
              <div className="form-group">
                <label htmlFor="prop-price">Monthly Rent (Rs.)</label>
                <input
                  type="number"
                  id="prop-price"
                  placeholder="e.g. 75000"
                  min="0"
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                  required
                />
              </div>

              {/* Owner Name */}
              <div className="form-group">
                <label htmlFor="prop-owner">Owner Full Name</label>
                <input
                  type="text"
                  id="prop-owner"
                  placeholder="Enter full name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>

              {/* Owner Phone */}
              <div className="form-group">
                <label htmlFor="prop-phone">Owner Contact Phone</label>
                <input
                  type="tel"
                  id="prop-phone"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              {/* Owner Email */}
              <div className="form-group full-width">
                <label htmlFor="prop-email">Owner Email (Gmail)</label>
                <input
                  type="email"
                  id="prop-email"
                  value={email}
                  readOnly
                  className="read-only-input"
                  title="Your account email address"
                />
              </div>

              {/* Bedrooms */}
              <div className="form-group">
                <label htmlFor="prop-beds">Bedrooms Count</label>
                <input
                  type="number"
                  id="prop-beds"
                  placeholder="3"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  required
                />
              </div>

              {/* Bathrooms */}
              <div className="form-group">
                <label htmlFor="prop-baths">Bathrooms Count</label>
                <input
                  type="number"
                  id="prop-baths"
                  placeholder="2"
                  min="0"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label htmlFor="prop-desc">Property Description</label>
                <textarea
                  id="prop-desc"
                  placeholder="Describe details regarding furnishings, amenities, parking space, nearby schools/IT parks, and deposit rules."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Image upload */}
              <div className="form-group full-width">
                <label htmlFor="prop-images">Upload House Photos</label>
                <div className="file-uploader-box">
                  <Upload size={32} className="upload-icon" />
                  <span>Click to select files, or drag photos here</span>
                  <input
                    type="file"
                    id="prop-images"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    required
                  />
                </div>
                {images && images.length > 0 && (
                  <div className="upload-preview-summary">
                    <FileText size={16} />
                    <span>{images.length} {images.length === 1 ? "photo" : "photos"} selected</span>
                  </div>
                )}
                <span className="upload-note">Select one or multiple photos (exterior view, rooms, bathrooms, etc.)</span>
              </div>
            </div>

            <div className="submit-button-row">
              <button type="submit" disabled={loading} className="btn btn-primary submit-listing-btn">
                {loading ? "Publishing listing..." : "Publish Listing"}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .add-property-page {
          padding-top: 1.5rem;
          padding-bottom: 4rem;
        }

        .add-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.8rem;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: "Outfit", sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--secondary);
        }

        .back-dashboard-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.95rem;
        }

        .back-dashboard-link:hover {
          text-decoration: underline;
        }

        /* Form Card */
        .form-card-shell {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .form-card-header {
          padding: 2.2rem;
          color: white;
          background: linear-gradient(105deg, var(--secondary-dark) 0%, var(--primary-dark) 100%);
        }

        .form-card-header h1 {
          color: white;
          font-size: 2.1rem;
          margin-bottom: 0.5rem;
        }

        .form-card-header p {
          color: #cbd5e1;
          font-size: 1.02rem;
          max-width: 650px;
        }

        .add-property-form {
          padding: 2.2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .read-only-input {
          background: #f1f5f9;
          color: var(--text-muted);
          border-color: var(--border);
          cursor: not-allowed;
        }

        /* File Upload */
        .file-uploader-box {
          border: 2px dashed var(--border);
          background: var(--surface-soft);
          border-radius: var(--radius-md);
          padding: 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          cursor: pointer;
          position: relative;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .file-uploader-box:hover {
          border-color: var(--primary);
          background: #f0fdfa;
          color: var(--primary);
        }

        .file-uploader-box input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .upload-icon {
          color: #94a3b8;
        }

        .file-uploader-box:hover .upload-icon {
          color: var(--primary);
        }

        .upload-preview-summary {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.5rem;
          color: var(--success);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .upload-note {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .submit-button-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
        }

        .submit-listing-btn {
          min-width: 200px;
          min-height: 48px;
        }

        /* Success screen overlay */
        .form-success-overlay {
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
        }

        .success-icon {
          color: var(--success);
        }

        .form-success-overlay h2 {
          color: var(--secondary-dark);
          font-size: 1.8rem;
        }

        .form-success-overlay p {
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .form-card-header,
          .add-property-form {
            padding: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .full-width {
            grid-column: auto;
          }

          .submit-button-row {
            justify-content: stretch;
          }

          .submit-listing-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
