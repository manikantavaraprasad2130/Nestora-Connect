import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Building2, LogOut, Edit3, Trash2, X, CheckCircle, Info, Phone, Mail } from "lucide-react";
import { API_BASE } from "../config";


export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [ownerSession, setOwnerSession] = useState(null);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeProperty, setActiveProperty] = useState(null);

  // Edit Form Fields
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editVillage, setEditVillage] = useState("");
  const [editHouseNumber, setEditHouseNumber] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editPropertyType, setEditPropertyType] = useState("");
  const [editOwnerName, setEditOwnerName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBedrooms, setEditBedrooms] = useState("");
  const [editBathrooms, setEditBathrooms] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [editLoading, setEditLoading] = useState(false);

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

    async function loadOwnerProperties() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/properties`, {
          cache: "no-store"
        });
        if (!response.ok) {
          throw new Error("Unable to retrieve listings.");
        }
        const allProperties = await response.json();
        
        // Filter properties that belong to this owner email
        const ownerEmailLower = session.email.toLowerCase();
        const filtered = allProperties.filter((property) => {
          const emails = [];
          if (property.ownerEmail) {
            if (Array.isArray(property.ownerEmail)) emails.push(...property.ownerEmail);
            else if (typeof property.ownerEmail === "string") emails.push(property.ownerEmail);
          }
          if (property.email) {
            if (Array.isArray(property.email)) emails.push(...property.email);
            else if (typeof property.email === "string") emails.push(property.email);
          }
          return emails.some((email) => email.toLowerCase().trim() === ownerEmailLower);
        });

        setProperties(filtered);
      } catch (err) {
        console.error("Dashboard properties load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOwnerProperties();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ownerSession");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const handleDeleteProperty = async (property) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${property.propertyName || "this property"}"?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE}/api/properties/${property._id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Deletion failed.");
      }
      
      // Update local state listing
      setProperties(properties.filter((item) => item._id !== property._id));
      alert("Property deleted successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete property.");
    }
  };

  const handleOpenEditModal = (property) => {
    setActiveProperty(property);
    
    // Set edit fields
    setEditName(property.propertyName || "");
    setEditLocation(property.location || "");
    setEditState(property.state || "");
    setEditPincode(property.pincode || "");
    setEditDistrict(property.district || "");
    setEditCity(property.city || "");
    setEditVillage(property.village || "");
    setEditHouseNumber(property.houseNumber || property["house-number"] || "");
    setEditStreet(property.street || "");
    setEditPropertyType(property.propertyType || "");
    setEditOwnerName(property.ownerName || "");
    setEditPhone(property.phoneNumber || "");
    
    // Format email values
    let emailVal = "";
    if (Array.isArray(property.email)) {
      emailVal = property.email.join(", ");
    } else {
      emailVal = property.email || "";
    }
    setEditEmail(emailVal);
    
    setEditBedrooms(property.bedrooms || "");
    setEditBathrooms(property.bathrooms || "");
    setEditDescription(property.description || "");
    setEditPrice(property.rentPrice || "");

    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const updates = {
      propertyName: editName,
      location: editLocation,
      state: editState,
      pincode: editPincode,
      district: editDistrict,
      city: editCity,
      village: editVillage,
      houseNumber: editHouseNumber,
      street: editStreet,
      propertyType: editPropertyType,
      ownerName: editOwnerName,
      phoneNumber: editPhone,
      email: editEmail,
      bedrooms: editBedrooms ? Number(editBedrooms) : "",
      bathrooms: editBathrooms ? Number(editBathrooms) : "",
      description: editDescription,
      rentPrice: editPrice
    };

    try {
      const response = await fetch(`${API_BASE}/api/properties/${activeProperty._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update property.");
      }

      // Update properties list state
      setProperties(properties.map((item) => {
        if (item._id === activeProperty._id) {
          return {
            ...item,
            ...updates,
            // Match backend serialization fields if needed
            email: editEmail.includes(",") ? editEmail.split(",").map((s) => s.trim()) : editEmail
          };
        }
        return item;
      }));

      setIsEditOpen(false);
      alert("Property details updated successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update property details.");
    } finally {
      setEditLoading(false);
    }
  };

  const getAddressSummary = (prop) => {
    const parts = [];
    const houseNumber = prop.houseNumber || prop["house-number"];
    const street = prop.street;
    const city = prop.city;
    const state = prop.state;

    if (houseNumber) parts.push(`House No: ${houseNumber}`);
    if (street) parts.push(street);
    if (city) parts.push(city);
    if (state) parts.push(state);

    return parts.join(", ") || prop.location || "N/A";
  };

  // Helper values for dashboard stats
  const totalProperties = properties.length;
  const activeListings = properties.filter((p) => p.status !== "inactive").length;
  const totalViews = properties.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const totalInquiries = properties.reduce((sum, p) => sum + (Number(p.inquiries) || 0), 0);

  if (!ownerSession) {
    return null; // Don't render anything if loading redirect
  }

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-grid-layout">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-brand-box">
            <Building2 size={24} />
            <h2>Nestora Owner</h2>
          </div>
          
          <nav className="sidebar-menu" aria-label="Sidebar navigation">
            <button className="sidebar-menu-item active">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => navigate("/add-property")} className="sidebar-menu-item">
              <PlusCircle size={18} />
              <span>Add Property</span>
            </button>
            <button onClick={handleLogout} className="sidebar-menu-item logout-btn-item">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Workspace Area */}
        <main className="dashboard-workspace">
          <header className="workspace-header">
            <div>
              <h1>Dashboard Overview</h1>
              <p>Welcome back, <strong>{ownerSession.fullName}</strong>. Manage your listing portfolio.</p>
            </div>
            <button onClick={() => navigate("/add-property")} className="btn btn-primary">
              <PlusCircle size={18} /> Add Property
            </button>
          </header>

          {/* Stats Row */}
          <section className="stats-row" aria-label="Analytics overview">
            <article className="stat-card">
              <span className="stat-label">Total Properties</span>
              <span className="stat-value">{totalProperties}</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Active Listings</span>
              <span className="stat-value">{activeListings}</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Total Views</span>
              <span className="stat-value">{totalViews}</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">Enquiries Received</span>
              <span className="stat-value">{totalInquiries}</span>
            </article>
          </section>

          {/* Listings Table Section */}
          <section className="listings-table-card">
            <div className="table-header-row">
              <h2>My Properties Portfolio</h2>
            </div>

            {loading ? (
              <div className="loading-state-box">
                <div className="spinner"></div>
                <p>Loading your listings...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="empty-portfolio-box">
                <Building2 size={48} className="empty-icon" />
                <h3>No Properties Listed Yet</h3>
                <p>Add properties using the registration form to list them on Nestora Connect.</p>
                <button onClick={() => navigate("/add-property")} className="btn btn-primary" style={{ marginTop: "1rem" }}>
                  List Your First Property
                </button>
              </div>
            ) : (
              <div className="table-responsive-wrapper">
                <table className="listings-table">
                  <thead>
                    <tr>
                      <th>Property Details</th>
                      <th>Full Address</th>
                      <th>Pricing</th>
                      <th>Contact Info</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="table-property-cell">
                            <span className="table-prop-name">{item.propertyName}</span>
                            <span className="table-prop-type">{item.propertyType} • {item.bedrooms || "--"} BHK</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-address-cell">
                            <p>{getAddressSummary(item)}</p>
                          </div>
                        </td>
                        <td>
                          <span className="table-price-tag">Rs. {Number(item.rentPrice).toLocaleString("en-IN")}/mo</span>
                        </td>
                        <td>
                          <div className="table-contact-cell">
                            <span className="contact-detail"><Phone size={12} /> {item.phoneNumber}</span>
                            <span className="contact-detail"><Mail size={12} /> {Array.isArray(item.email) ? item.email.join(", ") : item.email}</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            <button onClick={() => handleOpenEditModal(item)} className="action-circle-btn edit-btn" title="Edit Listing">
                              <Edit3 size={15} />
                            </button>
                            <button onClick={() => handleDeleteProperty(item)} className="action-circle-btn delete-btn" title="Delete Listing">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Edit Property Modal Dialog */}
      {isEditOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditOpen(false)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Property Details</h2>
              <button onClick={() => setIsEditOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit} className="dashboard-edit-form">
                <div className="edit-form-grid">
                  <div className="form-group full-width">
                    <label>Property Name</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Location Area</label>
                    <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" value={editState} onChange={(e) => setEditState(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>District</label>
                    <input type="text" value={editDistrict} onChange={(e) => setEditDistrict(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Village</label>
                    <input type="text" value={editVillage} onChange={(e) => setEditVillage(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Pin Code</label>
                    <input type="text" value={editPincode} onChange={(e) => setEditPincode(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>House Number</label>
                    <input type="text" value={editHouseNumber} onChange={(e) => setEditHouseNumber(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Street</label>
                    <input type="text" value={editStreet} onChange={(e) => setEditStreet(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Property Type</label>
                    <select value={editPropertyType} onChange={(e) => setEditPropertyType(e.target.value)} required>
                      <option value="">Select type</option>
                      <option value="villa">Villa</option>
                      <option value="apartment">Apartment</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="independent-house">Independent House</option>
                      <option value="farmhouse">Farmhouse</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Monthly Rent</label>
                    <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Owner Full Name</label>
                    <input type="text" value={editOwnerName} onChange={(e) => setEditOwnerName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                  </div>
                  <div className="form-group full-width">
                    <label>Contact Gmail</label>
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="owner@gmail.com" />
                  </div>
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <input type="number" value={editBedrooms} onChange={(e) => setEditBedrooms(e.target.value)} min="0" />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms</label>
                    <input type="number" value={editBathrooms} onChange={(e) => setEditBathrooms(e.target.value)} min="0" />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows="4"></textarea>
                  </div>
                </div>

                <div className="edit-form-actions">
                  <button type="button" onClick={() => setIsEditOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={editLoading} className="btn btn-primary">
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-page-container {
          min-height: 100vh;
          background: #f1f5f9;
        }

        .dashboard-grid-layout {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          min-height: 100vh;
        }

        /* Sidebar navigation */
        .dashboard-sidebar {
          background: var(--secondary-dark);
          color: white;
          padding: 2rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .sidebar-brand-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
        }

        .sidebar-brand-box h2 {
          font-size: 1.25rem;
          color: white;
          font-weight: 800;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-menu-item {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
          color: #94a3b8;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all var(--transition-fast);
        }

        .sidebar-menu-item:hover,
        .sidebar-menu-item.active {
          color: white;
          background: var(--primary);
        }

        .logout-btn-item {
          margin-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 1.5rem;
          border-radius: 0;
        }

        .logout-btn-item:hover {
          background: var(--error);
        }

        /* Workspace main area */
        .dashboard-workspace {
          padding: 2.5rem;
          overflow-y: auto;
        }

        .workspace-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .workspace-header h1 {
          font-size: 2rem;
          color: var(--secondary);
          margin-bottom: 0.25rem;
        }

        .workspace-header p {
          color: var(--text-muted);
        }

        /* Stats Blocks */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .stat-label {
          display: block;
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: var(--secondary-dark);
          line-height: 1;
        }

        /* Listings Portfolio Table Card */
        .listings-table-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .table-header-row {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .table-header-row h2 {
          font-size: 1.25rem;
          color: var(--secondary);
        }

        .table-responsive-wrapper {
          overflow-x: auto;
          width: 100%;
        }

        .listings-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 800px;
        }

        .listings-table th {
          background: #f8fafc;
          padding: 1rem 1.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border);
        }

        .listings-table td {
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        .table-property-cell {
          display: flex;
          flex-direction: column;
        }

        .table-prop-name {
          font-weight: 800;
          font-size: 1rem;
          color: var(--secondary-dark);
        }

        .table-prop-type {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .table-address-cell p {
          max-width: 250px;
          font-size: 0.92rem;
          color: #4b5563;
          line-height: 1.4;
        }

        .table-price-tag {
          font-size: 1rem;
          font-weight: 800;
          color: var(--primary);
        }

        .table-contact-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.88rem;
          color: #4b5563;
        }

        .contact-detail {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .table-actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .action-circle-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .action-circle-btn.edit-btn {
          background: white;
          color: var(--secondary);
        }

        .action-circle-btn.edit-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--surface-soft);
        }

        .action-circle-btn.delete-btn {
          background: var(--error-bg);
          color: var(--error);
          border-color: #f8c2c2;
        }

        .action-circle-btn.delete-btn:hover {
          background: var(--error);
          color: white;
          border-color: var(--error);
        }

        /* Modal styling overrides */
        .modal-wide {
          width: min(760px, 100%);
        }

        .edit-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .edit-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
          border-top: 1px solid var(--border);
          padding-top: 1.25rem;
        }

        /* Empty & Loading states */
        .loading-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 0;
          color: var(--text-muted);
          gap: 0.75rem;
        }

        .empty-portfolio-box {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
        }

        .empty-icon {
          color: #94a3b8;
          margin-bottom: 1rem;
        }

        .empty-portfolio-box h3 {
          color: var(--secondary);
          margin-bottom: 0.25rem;
        }

        @media (max-width: 1050px) {
          .stats-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 820px) {
          .dashboard-grid-layout {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            padding: 1.25rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: auto;
            min-height: auto;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }

          .sidebar-brand-box {
            margin-bottom: 0;
          }

          .sidebar-menu {
            flex-direction: row;
            gap: 0.4rem;
          }

          .sidebar-menu-item {
            padding: 0.5rem 0.8rem;
            font-size: 0.85rem;
          }

          .logout-btn-item {
            margin-top: 0;
            border-top: none;
            padding-top: 0.5rem;
          }

          .dashboard-workspace {
            padding: 1.5rem;
          }

          .edit-form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: auto;
          }
        }

        @media (max-width: 560px) {
          .stats-row {
            grid-template-columns: 1fr;
          }
          
          .workspace-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
