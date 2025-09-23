import React from "react";

const SupportPage = () => {
  return (
    <div className="support-page">
      <div className="container">
        <div className="page-header">
          <h1>Support & Contact</h1>
          <p>We're here to help you make a difference in students' lives</p>
        </div>
        
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h3>Email Support</h3>
            <p className="contact-detail">support@elimufund.org</p>
            <p className="contact-time">Response time: 24-48 hours</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3>Phone Support</h3>
            <p className="contact-detail">+254 700 123 456</p>
            <p className="contact-time">Mon-Fri: 9AM-5PM EAT</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon">💬</div>
            <h3>Live Chat</h3>
            <p className="contact-detail">Available on website</p>
            <p className="contact-time">Mon-Fri: 9AM-5PM EAT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;