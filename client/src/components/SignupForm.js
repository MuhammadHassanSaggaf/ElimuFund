import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const SignupForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    userType: Yup.string()
      .oneOf(["donor", "student"], "Please select a user type")
      .required("User type is required"),
  });

  const handleSubmit = (values) => {
    console.log("Signup submitted:", values);
    // TODO: Connect to backend API
    login({ email: values.email, role: values.userType, name: values.fullName });
    
    if (values.userType === "student") {
      navigate("/student-dashboard");
    } else {
      navigate("/donor-dashboard");
    }
  };

  return (
    <Formik
      initialValues={{
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "donor",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="auth-form">
        <div className="form-group">
          <Field
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="form-input"
          />
          <ErrorMessage
            name="fullName"
            component="div"
            className="error-message"
          />
        </div>
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
        <div className="form-group">
          <Field
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="form-input"
          />
          <ErrorMessage
            name="confirmPassword"
            component="div"
            className="error-message"
          />
        </div>
        <div className="form-group">
          <Field as="select" name="userType" className="form-input">
            <option value="donor">I want to donate</option>
            <option value="student">I need educational support</option>
          </Field>
          <ErrorMessage
            name="userType"
            component="div"
            className="error-message"
          />
        </div>
        <button type="submit" className="form-button">
          Create Account
        </button>
      </Form>
    </Formik>
  );
};

export default SignupForm;
