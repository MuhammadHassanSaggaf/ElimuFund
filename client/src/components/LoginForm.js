import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const user = existingUsers.find((u) => u.email === values.email);

      if (!user) {
        setFieldError(
          "email",
          "No account found with this email. Please sign up first."
        );
        return;
      }

      // Login with correct user role
      login({ email: values.email, role: user.role, name: user.name });

      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/donor-dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setFieldError("email", "Login failed. Please try again.");
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="auth-form">
          <div className="form-group">
            <Field
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-input"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="error-message"
            />
          </div>
          <div className="form-group">
            <Field name="password">
              {({ field, meta }) => (
                <div className="password-input-group">
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name={field.name}
                      placeholder="Password"
                      value={field.value}
                      onChange={field.onChange}
                      className={`form-input ${
                        meta.touched && meta.error ? "error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "^" : "-"}
                    </button>
                  </div>
                  {meta.touched && meta.error && (
                    <span className="error-message">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>
          </div>
          <button type="submit" className="form-button">
            Sign In
          </button>
          <div className="forgot-password-link">
            <button
              type="button"
              className="link-btn"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>
        </Form>
      </Formik>

      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <p>Enter your email to receive reset instructions</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="form-input"
            />
            {resetMessage && <p className="reset-message">{resetMessage}</p>}
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  if (resetEmail) {
                    setResetMessage(
                      "Password reset instructions sent to your email!"
                    );
                    setTimeout(() => {
                      setShowForgotPassword(false);
                      setResetMessage("");
                      setResetEmail("");
                    }, 2000);
                  } else {
                    setResetMessage("Please enter your email address");
                  }
                }}
              >
                Send Reset Link
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetMessage("");
                  setResetEmail("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
