import React from "react";

const HowItWorksPage = () => {
  return (
    <div className="how-it-works-page">
      {/* Hero Section */}
      <div className="how-hero">
        <div className="hero-content">
          <h1>How ElimuFund Works</h1>
          <p>Simple, transparent, and effective educational funding in 4 easy steps</p>
        </div>
      </div>

      <div className="container">
        {/* How It Works */}
        <section className="how-it-works">
          <div className="section-header">
            <h2>Our Process</h2>
            <div className="underline"></div>
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-icon">📝</div>
              <div className="step-number">01</div>
              <h3>Student Registration</h3>
              <p>Students create detailed profiles showcasing their academic goals, financial needs, and personal stories.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-icon">🔍</div>
              <div className="step-number">02</div>
              <h3>Donor Discovery</h3>
              <p>Donors browse verified student profiles and choose campaigns that resonate with their values.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-icon">💰</div>
              <div className="step-number">03</div>
              <h3>Secure Funding</h3>
              <p>Donations are processed securely and transferred directly to educational institutions.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-icon">📊</div>
              <div className="step-number">04</div>
              <h3>Progress Tracking</h3>
              <p>Donors receive regular updates on academic progress and fund utilization.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorksPage;