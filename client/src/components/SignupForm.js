import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const SignupForm = () => {
	const { signup } = useAuth();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
			.oneOf(["donor", "student", "admin"], "Please select a user type")
			.required("User type is required"),
		agreeToTerms: Yup.boolean()
			.oneOf([true], "You must agree to the Terms & Conditions")
			.required("You must agree to the Terms & Conditions"),
	});

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		try {
			console.log("Form submitted with values:", values);

			// Call API to create user
			await signup({
				fullName: values.fullName,
				email: values.email,
				password: values.password,
				userType: values.userType,
			});

			// Navigate based on user type
			if (values.userType === "student") {
				navigate("/student-dashboard");
			} else {
				navigate("/donor-dashboard");
			}
		} catch (error) {
			console.error("Signup failed:", error);
			setFieldError(
				"email",
				error.message || "Signup failed. Please try again.",
			);
		} finally {
			setSubmitting(false);
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
				agreeToTerms: false,
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
										{showPassword ? "🙈" : "👁️"}
									</button>
								</div>
								{meta.touched && meta.error && (
									<span className="error-message">{meta.error}</span>
								)}
							</div>
						)}
					</Field>
				</div>
				<div className="form-group">
					<Field name="confirmPassword">
						{({ field, meta }) => (
							<div className="password-input-group">
								<div className="password-input-wrapper">
									<input
										type={showConfirmPassword ? "text" : "password"}
										name={field.name}
										placeholder="Confirm Password"
										value={field.value}
										onChange={field.onChange}
										className={`form-input ${
											meta.touched && meta.error ? "error" : ""
										}`}
									/>
									<button
										type="button"
										className="password-toggle"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? "🙈" : "👁️"}
									</button>
								</div>
								{meta.touched && meta.error && (
									<span className="error-message">{meta.error}</span>
								)}
							</div>
						)}
					</Field>
				</div>
				<div className="form-group">
					<Field as="select" name="userType" className="form-input">
						<option value="donor">I want to donate</option>
						<option value="student">I need educational support</option>
						<option value="admin">I am an administrator</option>
					</Field>
					<ErrorMessage
						name="userType"
						component="div"
						className="error-message"
					/>
				</div>
				<div className="terms-agreement">
					<label className="checkbox-label">
						<Field type="checkbox" name="agreeToTerms" />
						<span className="checkmark"></span>I agree to the{" "}
						<a href="/terms" target="_blank" rel="noopener noreferrer">
							Terms & Conditions
						</a>{" "}
						and{" "}
						<a href="/privacy" target="_blank" rel="noopener noreferrer">
							Privacy Policy
						</a>
					</label>
					<ErrorMessage
						name="agreeToTerms"
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
