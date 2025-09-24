import React from "react";

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>Transforming Lives Through Education</h1>
          <p>
            Bridging the gap between dreams and reality, one student at a time
            with your Donation.
          </p>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="element graduation"></div>
            <div className="element book"></div>
            <div className="element lightbulb"></div>
            <div className="element heart"></div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Mission Section */}
        <section className="mission-section">
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="underline"></div>
          </div>
          <div className="mission-content">
            <div className="mission-text">
              <p className="lead">
                ElimuFund exists to democratize education by creating
                transparent, direct connections between students in need and
                compassionate donors worldwide.
              </p>
              <p>
                We believe that financial barriers should never prevent
                brilliant minds from achieving their educational goals. Through
                our platform, we've revolutionized how educational funding works
                - making it transparent, accountable, and impactful.
              </p>
            </div>
            <div className="mission-visual">
              <div className="circle-stats">
                <div className="circle">
                  <span className="number">100%</span>
                  <span className="label">Transparent</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact & Aspirations */}
        <section className="impact-section">
          <div className="section-header">
            <h2>Our Global Impact & Aspirations</h2>
            <div className="underline"></div>
          </div>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-icon"></div>
              <div className="impact-number">500,000+</div>
              <div className="impact-label">Students Funded</div>
              <div className="impact-description">
                Aspiring to support students across East Africa by 2030
              </div>
            </div>
            <div className="impact-card">
              <div className="impact-icon"></div>
              <div className="impact-number">90%+</div>
              <div className="impact-label">Success Rate</div>
              <div className="impact-description">
                Targeting high completion rates for funded students
              </div>
            </div>
            <div className="impact-card">
              <div className="impact-icon"></div>
              <div className="impact-number">50,000+</div>
              <div className="impact-label">Active Donors</div>
              <div className="impact-description">
                Building a global community of supporters and change-makers
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="partners-section">
          <div className="section-header">
            <h2>Our Partners</h2>
            <div className="underline"></div>
          </div>
          <div className="partners-grid">
            <div className="partner-card">M-Pesa</div>
            <div className="partner-card">Visa / Mastercard</div>
            <div className="partner-card">NGOs & Nonprofits</div>
            <div className="partner-card">Schools & Alumni Associations</div>
            <div className="partner-card">Community Organizations</div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <div className="underline"></div>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"></div>
              <h3>Transparency</h3>
              <p>
                Every donation is tracked and reported with complete visibility
                into fund usage.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon"></div>
              <h3>Trust</h3>
              <p>
                All students are verified through rigorous background checks and
                academic validation.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon"></div>
              <h3>Impact</h3>
              <p>
                We measure success by the lives transformed and communities
                uplifted through education.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon"></div>
              <h3>Security & Trust</h3>
              <p>
                Every donation is processed securely through audited platforms,
                ensuring funds reach verified students safely and transparently.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
