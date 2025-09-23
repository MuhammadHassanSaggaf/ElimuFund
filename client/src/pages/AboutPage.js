import React from "react";

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About ElimuFund</h1>
        <div className="about-content">
          <section className="mission">
            <h2>Our Mission</h2>
            <p>
              ElimuFund is dedicated to making quality education accessible to all students, 
              regardless of their financial background. We connect generous donors with 
              students who need educational support to achieve their academic dreams.
            </p>
          </section>
          
          <section className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps">
              <div className="step">
                <h3>1. Students Apply</h3>
                <p>Students create profiles and submit their educational funding needs.</p>
              </div>
              <div className="step">
                <h3>2. Donors Browse</h3>
                <p>Donors explore student profiles and choose who to support.</p>
              </div>
              <div className="step">
                <h3>3. Direct Impact</h3>
                <p>Funds go directly to educational expenses, creating real change.</p>
              </div>
            </div>
          </section>

          <section className="impact">
            <h2>Our Impact</h2>
            <div className="stats">
              <div className="stat">
                <h3>500+</h3>
                <p>Students Supported</p>
              </div>
              <div className="stat">
                <h3>$250K+</h3>
                <p>Funds Raised</p>
              </div>
              <div className="stat">
                <h3>95%</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;