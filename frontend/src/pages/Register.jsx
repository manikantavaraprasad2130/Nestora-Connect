import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Shield, Key, Mail, Phone, FileText, AlertTriangle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("customer"); // 'customer' or 'owner'

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "full-name": fullName,
          email,
          mobile,
          password,
          "confirm-password": confirmPassword,
          "user-type": userType
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-split-container">
        {/* Left Side: Visual intro panel */}
        <section className="register-visual-panel" aria-label="Visual intro">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <span className="brand-badge">Nestora Connect</span>
            <h1>Start your rental journey with confidence.</h1>
            <p>
              Create your account to discover rentals, list properties, and schedule visits across neighborhoods.
            </p>
          </div>
        </section>

        {/* Right Side: Form Panel */}
        <section className="register-form-panel" aria-label="Registration form">
          <div className="register-card-shell">
            <span className="register-brand-title">Nestora Connect</span>
            <h2>Create account</h2>
            <p className="register-subtitle">Register as a customer or owner to manage listings.</p>

            {errorMsg && (
              <div className="alert alert-error">
                <AlertTriangle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="register-form">
              <div className="form-grid">
                {/* Full Name */}
                <div className="form-group full-width">
                  <label htmlFor="reg-name">Full Name</label>
                  <div className="input-with-icon">
                    <FileText size={18} className="input-icon-left" />
                    <input
                      type="text"
                      id="reg-name"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="reg-email">Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon-left" />
                    <input
                      type="email"
                      id="reg-email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="form-group">
                  <label htmlFor="reg-mobile">Mobile Number</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon-left" />
                    <input
                      type="tel"
                      id="reg-mobile"
                      placeholder="+91 98765 43210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-group">
                  <label htmlFor="reg-pass">Password</label>
                  <div className="input-with-icon">
                    <Key size={18} className="input-icon-left" />
                    <input
                      type="password"
                      id="reg-pass"
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="reg-confirm">Confirm Password</label>
                  <div className="input-with-icon">
                    <Key size={18} className="input-icon-left" />
                    <input
                      type="password"
                      id="reg-confirm"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* User Type Group */}
              <div className="user-type-selector-group">
                <span className="selector-label">User Type</span>
                <div className="type-selectors">
                  <label className={`type-selector-card ${userType === "customer" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="user-type"
                      value="customer"
                      checked={userType === "customer"}
                      onChange={() => setUserType("customer")}
                    />
                    <User size={16} />
                    <span>Customer</span>
                  </label>

                  <label className={`type-selector-card ${userType === "owner" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="user-type"
                      value="owner"
                      checked={userType === "owner"}
                      onChange={() => setUserType("owner")}
                    />
                    <Shield size={16} />
                    <span>Owner</span>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary register-action-btn">
                {loading ? "Creating Account..." : "Register Account"}
              </button>
            </form>

            <p className="login-redirect-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: stretch;
        }

        .register-split-container {
          width: 100%;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
        }

        /* Visual side panel styling */
        .register-visual-panel {
          position: relative;
          background: url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85") center/cover no-repeat;
          display: flex;
          align-items: flex-end;
          padding: 4rem;
          color: white;
        }

        .visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(8, 25, 41, 0.15) 0%, rgba(8, 25, 41, 0.8) 100%);
          z-index: 1;
        }

        .visual-content {
          position: relative;
          z-index: 2;
          max-width: 500px;
        }

        .brand-badge {
          font-family: "Outfit", sans-serif;
          font-size: 0.9rem;
          font-weight: 800;
          color: #2dd4bf;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .register-visual-panel h1 {
          color: white;
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 1.1;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }

        .register-visual-panel p {
          color: #cbd5e1;
          font-size: 1.05rem;
          line-height: 1.6;
        }

        /* Form side panel styling */
        .register-form-panel {
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3.5rem 2.5rem;
        }

        .register-card-shell {
          width: min(100%, 520px);
        }

        .register-brand-title {
          font-family: "Outfit", sans-serif;
          font-size: 0.9rem;
          font-weight: 950;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 2px;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .register-card-shell h2 {
          font-size: 2.2rem;
          color: var(--secondary-dark);
          line-height: 1.1;
          margin-bottom: 0.4rem;
        }

        .register-subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        /* Form grouping */
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .user-type-selector-group {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .selector-label {
          display: block;
          font-family: "Outfit", sans-serif;
          font-weight: 700;
          color: var(--secondary);
          font-size: 0.92rem;
          margin-bottom: 0.6rem;
        }

        .type-selectors {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .type-selector-card {
          border: 1px solid var(--border);
          background: var(--surface-soft);
          border-radius: var(--radius-sm);
          padding: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .type-selector-card input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .type-selector-card:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .type-selector-card.selected {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        /* Input field with icon wrap */
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon-left {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon input {
          padding-left: 2.75rem;
        }

        .register-action-btn {
          width: 100%;
          min-height: 48px;
          margin-top: 0.5rem;
        }

        .login-redirect-text {
          margin-top: 2rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .login-redirect-text a {
          color: var(--primary);
          font-weight: 700;
        }

        .login-redirect-text a:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .register-split-container {
            grid-template-columns: 1fr;
          }
          
          .register-visual-panel {
            min-height: 35vh;
            padding: 2.5rem;
          }

          .register-form-panel {
            padding: 3rem 1.5rem;
          }
        }

        @media (max-width: 560px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: auto;
          }
        }
      `}</style>
    </div>
  );
}
