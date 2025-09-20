import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src="/api/placeholder/500/400" alt="Students learning" />
          <div className="auth-overlay">
            <h2>Welcome Back</h2>
            <p>Continue supporting students achieve their dreams</p>
          </div>
        </div>
        <div className="auth-form-container">
          <h1>Sign In to ElimuFund</h1>
          <p>
            Access your dashboard and track the progress of students you support
          </p>
          <LoginForm />
          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
