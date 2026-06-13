import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronRight, LayoutDashboard, Home as HomeIcon } from "lucide-react";

// Page imports
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddProperty from "./pages/AddProperty";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NavigationHeader({ session, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile navigation menu on routing change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand">
          <HomeIcon size={20} className="brand-icon" />
          <span>Nestora Connect</span>
        </Link>

        {/* Mobile menu toggle */}
        <button 
          className="nav-mobile-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation list */}
        <nav className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Main menu">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/properties" className={({ isActive }) => isActive ? "active" : ""}>
            Properties
          </NavLink>
          <a href="/#services">Services</a>
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>

          {/* Conditional rendering for Login vs Dashboard */}
          {session ? (
            <div className="nav-session-actions">
              <button onClick={onLogout} className="btn-logout-header" title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">
              Sign In
            </Link>
          )}
        </nav>
      </div>

      <style>{`
        .nav-mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--secondary);
          cursor: pointer;
        }

        .brand-icon {
          color: var(--primary);
        }

        .nav-session-actions {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .btn-logout-header {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-logout-header:hover {
          background: var(--error-bg);
          color: var(--error);
          border-color: #f8c2c2;
        }

        @media (max-width: 768px) {
          .nav-mobile-toggle {
            display: block;
          }

          .site-nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 1.5rem 4%;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 1.25rem;
            box-shadow: var(--shadow-md);
            transform: scaleY(0);
            transform-origin: top;
            opacity: 0;
            pointer-events: none;
            transition: all var(--transition-fast);
          }

          .site-nav.open {
            transform: scaleY(1);
            opacity: 1;
            pointer-events: auto;
          }

          .nav-session-actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }

          .btn-logout-header {
            width: 100%;
            height: auto;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            border-color: #f8c2c2;
            background: var(--error-bg);
            color: var(--error);
            flex-direction: row;
            gap: 0.5rem;
          }

          .btn-logout-header::before {
            content: "Logout";
            font-weight: 700;
            font-size: 0.95rem;
          }

          .btn-login {
            width: 100%;
            border-radius: var(--radius-md);
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </header>
  );
}

function MainAppLayout() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  const syncSession = () => {
    try {
      const sessionStr = localStorage.getItem("ownerSession");
      if (sessionStr) {
        setSession(JSON.parse(sessionStr));
      } else {
        setSession(null);
      }
    } catch (_err) {
      setSession(null);
    }
  };

  useEffect(() => {
    syncSession();
    // Watch for login/logout across storage events
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ownerSession");
    setSession(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <div className="main-layout-root">
      <NavigationHeader session={session} onLogout={handleLogout} />

      <main className="app-main-viewport">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/add-property" element={<AddProperty />} />
        </Routes>
      </main>

      {/* Shared Footer */}
      <footer className="site-footer" id="contact">
        <div className="container footer-content-wrapper">
          <div className="footer-left-col">
            <h3>Nestora Connect</h3>
            <p>Simplifying the search for verified rentals, connecting owners and tenants directly.</p>
          </div>
          <div className="footer-right-col">
            <span className="contact-heading">Contact Support</span>
            <p className="contact-detail-row">manikantavaraprasadvanga00@gmail.com</p>
            <p className="contact-detail-row">+91 95502 19092</p>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <div className="container bottom-bar-inner">
            <p>© {new Date().getFullYear()} Nestora Connect. All rights reserved.</p>
            <p className="credit-text">Crafted with Visual Excellence</p>
          </div>
        </div>
      </footer>

      <style>{`
        .main-layout-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .app-main-viewport {
          flex-grow: 1;
        }

        /* Footer Custom Premium Styling */
        .site-footer {
          margin-top: auto;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 3.5rem;
        }

        .footer-content-wrapper {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2.5rem;
          padding-bottom: 3rem;
        }

        .footer-left-col h3 {
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
        }

        .footer-left-col p {
          color: #94a3b8;
          max-width: 450px;
          line-height: 1.6;
        }

        .footer-right-col {
          display: flex;
          flex-direction: column;
        }

        .contact-heading {
          display: block;
          font-family: "Outfit", sans-serif;
          font-weight: 700;
          color: #2dd4bf;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1.5px;
          margin-bottom: 0.8rem;
        }

        .contact-detail-row {
          color: #cbd5e1;
          margin-bottom: 0.4rem;
        }

        .footer-bottom-bar {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 1.5rem 0;
          font-size: 0.9rem;
          color: #64748b;
        }

        .bottom-bar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .credit-text {
          color: #475569;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .footer-content-wrapper {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .bottom-bar-inner {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainAppLayout />
    </Router>
  );
}
