import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Join ElimuFund</h1>
          <p>
            Be part of a community that believes in transparent education
            funding
          </p>
        </div>
        <div className="auth-form">
          <SignupForm />
          <div className="auth-switch">
            Already have an account? <Link to="/login" className="link-btn">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
