import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>ElimuFund</h4>
          <p>Empowering education through transparency and trust</p>
        </div>
        <div className="footer-section">
          <h5>Quick Links</h5>
          <Link to="/" className="footer-link">
            Browse Students
          </Link>
          <Link to="/how-it-works" className="footer-link">
            How It Works
          </Link>
          <Link to="/about" className="footer-link">
            About Us
          </Link>
        </div>
        <div className="footer-section">
          <h5>Support</h5>
          <Link to="/contact" className="footer-link">
            Contact Us
          </Link>
          <Link to="/faq" className="footer-link">
            FAQ
          </Link>
          <Link to="/terms" className="footer-link">
            Terms & Conditions
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 ElimuFund. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
