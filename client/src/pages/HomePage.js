import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Empowering Dreams Through Education</h1>
          <p>
            Connect with students who need your support to achieve their
            educational goals. Every donation creates a lasting impact.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <h3>2,500+</h3>
            <p>Students Funded</p>
          </div>
          <div className="stat">
            <h3>$2.8M+</h3>
            <p>Raised</p>
          </div>
          <div className="stat">
            <h3>98%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose ElimuFund?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>100% Transparent</h3>
              <p>Track every donation and see real academic progress reports</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Verified Students</h3>
              <p>All students undergo rigorous verification processes</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Secure Payments</h3>
              <p>Bank-level security for all transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Join thousands of donors who are changing lives through education
          </p>
          <Link to="/campaigns" className="btn-primary">
            Start Supporting Students
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
