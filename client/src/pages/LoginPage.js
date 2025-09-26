import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Continue supporting students achieve their dreams</p>
        </div>
        <div className="auth-form">
          <LoginForm />
          <div className="auth-switch">
            Don't have an account? <Link to="/signup" className="link-btn">Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
