import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Shield, Key, Mail, AlertTriangle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  
  const [loginType, setLoginType] = useState("customer"); // 'customer' or 'owner'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          "login-type": loginType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Invalid login credentials.");
        }
        throw new Error(data.message || "Login failed.");
      }

      // Save session for both customer and owner
      localStorage.setItem("ownerSession", JSON.stringify({
        email: data.user.email,
        fullName: data.user.fullName,
        userType: data.user.userType || loginType,
        loginTime: new Date().toISOString()
      }));

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect");

      if (loginType === "owner") {
        // Redirect to Owner Dashboard or redirect parameter
        navigate(redirect ? `/${redirect}` : "/owner-dashboard");
      } else {
        // Redirection for Customer
        navigate(redirect ? `/${redirect}` : "/properties");
      }
      
      // Trigger a window event to force header re-render
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      if (err.message === "Failed to fetch") {
        setErrorMsg("Unable to connect to the server. Check if the backend is running.");
      } else {
        setErrorMsg(err.message || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-split-container">
        {/* Left Side: Dynamic Image Panel */}
        <section className="login-visual-panel" aria-label="Visual panel">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <span className="brand-badge">Nestora Connect</span>
            <h1>Find your next home.</h1>
            <p>
              Log in to manage property visits, save favorite listings, and unlock direct owner connections.
            </p>
          </div>
        </section>

        {/* Right Side: Form Panel */}
        <section className="login-form-panel" aria-label="Login form">
          <div className="login-card-shell">
            <span className="login-brand-title">Nestora Connect</span>
            <h2>Welcome back</h2>
            <p className="login-subtitle">Choose account type and enter credentials to log in.</p>

            {errorMsg && (
              <div className="alert alert-error">
                <AlertTriangle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="login-form">
              {/* Login Type Selector */}
              <div className="login-selector-group">
                <span className="selector-label">Login Type</span>
                <div className="login-selectors">
                  <label className={`login-selector-card ${loginType === "customer" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="login-type"
                      value="customer"
                      checked={loginType === "customer"}
                      onChange={() => setLoginType("customer")}
                    />
                    <User size={16} />
                    <span>Customer</span>
                  </label>

                  <label className={`login-selector-card ${loginType === "owner" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="login-type"
                      value="owner"
                      checked={loginType === "owner"}
                      onChange={() => setLoginType("owner")}
                    />
                    <Shield size={16} />
                    <span>Property Owner</span>
                  </label>
                </div>
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon-left" />
                  <input
                    type="email"
                    id="login-email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="login-pass">Password</label>
                <div className="input-with-icon">
                  <Key size={18} className="input-icon-left" />
                  <input
                    type="password"
                    id="login-pass"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary login-action-btn">
                {loading ? "Authenticating..." : "Login to Account"}
              </button>
            </form>

            <p className="signup-redirect-text">
              New to Nestora Connect? <Link to="/register">Create a new account</Link>
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: stretch;
        }

        .login-split-container {
          width: 100%;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
        }

        /* Visual side panel styling */
        .login-visual-panel {
          position: relative;
          background: url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85") center/cover no-repeat;
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

        .login-visual-panel h1 {
          color: white;
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 1.1;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }

        .login-visual-panel p {
          color: #cbd5e1;
          font-size: 1.05rem;
          line-height: 1.6;
        }

        /* Form side panel styling */
        .login-form-panel {
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3.5rem 2.5rem;
        }

        .login-card-shell {
          width: min(100%, 420px);
        }

        .login-brand-title {
          font-family: "Outfit", sans-serif;
          font-size: 0.9rem;
          font-weight: 950;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 2px;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .login-card-shell h2 {
          font-size: 2.2rem;
          color: var(--secondary-dark);
          line-height: 1.1;
          margin-bottom: 0.4rem;
        }

        .login-subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        /* Form grouping */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .login-selector-group {
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

        .login-selectors {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .login-selector-card {
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

        .login-selector-card input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .login-selector-card:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .login-selector-card.selected {
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

        .login-action-btn {
          width: 100%;
          min-height: 48px;
          margin-top: 0.5rem;
        }

        .signup-redirect-text {
          margin-top: 2rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .signup-redirect-text a {
          color: var(--primary);
          font-weight: 700;
        }

        .signup-redirect-text a:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .login-split-container {
            grid-template-columns: 1fr;
          }
          
          .login-visual-panel {
            min-height: 35vh;
            padding: 2.5rem;
          }

          .login-form-panel {
            padding: 3rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
