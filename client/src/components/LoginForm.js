import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values) => {
    console.log("Login submitted:", values);
    // TODO: Connect to backend API
    login({ email: values.email, role: "donor" });
    navigate("/donor-dashboard");
  };

  return (
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
          <Field
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
          />
          <ErrorMessage
            name="password"
            component="div"
            className="error-message"
          />
        </div>
        <button type="submit" className="form-button">
          Sign In
        </button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
