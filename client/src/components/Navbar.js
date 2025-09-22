import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          ElimuFund
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Campaigns
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link signup-btn">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/donor-dashboard" className="nav-link">
                Dashboard
              </Link>
              <button onClick={logout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
