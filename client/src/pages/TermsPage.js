import React from "react";

const TermsPage = () => {
  return (
    <div className="terms-page">
      {/* Hero Section */}
      <div className="terms-hero">
        <div className="hero-content">
          <h1>Terms & Conditions</h1>
          <p>Please read these terms carefully before using ElimuFund</p>
        </div>
      </div>

      <div className="container">
        <div className="terms-content">
          <div className="terms-nav">
            <h3>Quick Navigation</h3>
            <ul>
              <li><a href="#acceptance">Acceptance of Terms</a></li>
              <li><a href="#purpose">Platform Purpose</a></li>
              <li><a href="#responsibilities">User Responsibilities</a></li>
              <li><a href="#payment">Payment Terms</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#disputes">Dispute Resolution</a></li>
            </ul>
          </div>

          <div className="terms-sections">
            <section id="acceptance" className="terms-section">
              <div className="section-number">01</div>
              <h2>Acceptance of Terms</h2>
              <p>By accessing and using ElimuFund's platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>
            </section>

            <section id="purpose" className="terms-section">
              <div className="section-number">02</div>
              <h2>Platform Purpose</h2>
              <p>ElimuFund is an educational crowdfunding platform that connects generous donors with students seeking financial assistance for their education. Our mission is to make quality education accessible through transparent, secure, and accountable funding processes.</p>
            </section>

            <section id="responsibilities" className="terms-section">
              <div className="section-number">03</div>
              <h2>User Responsibilities</h2>
              
              <div className="responsibility-cards">
                <div className="responsibility-card donor">
                  <h3>👥 For Donors</h3>
                  <ul>
                    <li>Provide accurate payment information</li>
                    <li>Understand that donations are voluntary and non-refundable</li>
                    <li>Respect student privacy and confidentiality</li>
                    <li>Report any suspicious or fraudulent activity</li>
                    <li>Use the platform in accordance with applicable laws</li>
                  </ul>
                </div>
                
                <div className="responsibility-card student">
                  <h3>🎓 For Students</h3>
                  <ul>
                    <li>Provide truthful and accurate information</li>
                    <li>Use funds exclusively for stated educational purposes</li>
                    <li>Provide regular progress updates to donors</li>
                    <li>Submit required academic documentation</li>
                    <li>Maintain academic standards as specified</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="payment" className="terms-section">
              <div className="section-number">04</div>
              <h2>Payment Terms</h2>
              <div className="payment-info">
                <div className="payment-card">
                  <h4>💳 Processing</h4>
                  <p>All donations are processed through secure, encrypted payment gateways to ensure the safety of your financial information.</p>
                </div>
                <div className="payment-card">
                  <h4>💰 Platform Fee</h4>
                  <p>ElimuFund charges a 5% platform fee on all donations to cover operational costs, payment processing, and platform maintenance.</p>
                </div>
                <div className="payment-card">
                  <h4>🔒 Security</h4>
                  <p>We employ industry-standard security measures to protect all financial transactions and personal data.</p>
                </div>
              </div>
            </section>

            <section id="privacy" className="terms-section">
              <div className="section-number">05</div>
              <h2>Privacy Policy</h2>
              <p>We are committed to protecting your privacy and personal information. We collect only necessary information to facilitate the funding process and will never share your data with third parties without your explicit consent, except as required by law.</p>
            </section>

            <section id="disputes" className="terms-section">
              <div className="section-number">06</div>
              <h2>Dispute Resolution</h2>
              <p>In the event of any disputes or concerns, please contact our support team first. We are committed to resolving issues fairly and promptly through mediation. If necessary, disputes will be resolved through binding arbitration in accordance with applicable laws.</p>
            </section>
          </div>
        </div>
        
        <div className="terms-footer">
          <p className="last-updated">📅 Last updated: January 2024</p>
          <p className="contact-info">Questions? Contact us at <a href="mailto:legal@elimufund.org">legal@elimufund.org</a></p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;