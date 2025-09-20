import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src="/api/placeholder/500/400" alt="Students graduating" />
          <div className="auth-overlay">
            <h2>Join ElimuFund</h2>
            <p>
              Be part of a community that believes in transparent education
              funding
            </p>
          </div>
        </div>
        <div className="auth-form-container">
          <h1>Create Your Account</h1>
          <p>
            Join us in making quality education accessible to every deserving
            student
          </p>
          <SignupForm />
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
