import React from "react";

const FAQPage = () => {
  return (
    <div className="faq-page">
      <div className="container">
        <h1>Frequently Asked Questions</h1>

        <section className="faq-section">
          <div className="faq-item">
            <h3>❓ How do I donate to a student?</h3>
            <p>
              Browse student campaigns, click "Support [Name]" on any student
              card, choose your donation amount, and complete payment via
              M-Pesa, card, or bank transfer.
            </p>
          </div>

          <div className="faq-item">
            <h3> Is my donation secure?</h3>
            <p>
              Yes, we use encrypted payment processing, verified student
              profiles, and secure banking partnerships. All transactions are
              protected.
            </p>
          </div>

          <div className="faq-item">
            <h3> Can I track how my donation is used?</h3>
            <p>
              Absolutely! Students provide regular updates, academic progress
              reports, and you'll receive notifications about their
              achievements.
            </p>
          </div>

          <div className="faq-item">
            <h3> How are students verified?</h3>
            <p>
              All students undergo verification including academic records
              review, school confirmation, and financial need assessment before
              campaigns go live.
            </p>
          </div>

          <div className="faq-item">
            <h3> What payment methods do you accept?</h3>
            <p>
              We accept M-Pesa, Visa/Mastercard, and direct bank transfers from
              major Kenyan banks including KCB, Equity, Co-operative, and Absa.
            </p>
          </div>

          <div className="faq-item">
            <h3> How do I create a student campaign?</h3>
            <p>
              Sign up as a student, complete your profile with academic details,
              upload required documents, and submit for verification. Approved
              campaigns go live within 24-48 hours.
            </p>
          </div>

          <div className="faq-item">
            <h3> What happens when a campaign reaches its goal?</h3>
            <p>
              Funds are disbursed directly to the educational institution.
              Students can create new campaigns for subsequent terms or academic
              years if needed.
            </p>
          </div>

          <div className="faq-item">
            <h3> How do I get updates about students I've supported?</h3>
            <p>
              You'll receive email updates when students post progress reports,
              achieve milestones, or graduate. You can also check their campaign
              pages anytime.
            </p>
          </div>

          <div className="faq-item">
            <h3> Can I get a refund?</h3>
            <p>
              Refunds are processed within 7 days if a campaign is found to be
              fraudulent. Otherwise, donations are final as they directly
              support student education.
            </p>
          </div>

          <div className="faq-item">
            <h3> What is ElimuFund's success rate?</h3>
            <p>
              Over 98% of our verified students successfully complete their
              education with donor support. We maintain strict verification to
              ensure genuine need.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQPage;
