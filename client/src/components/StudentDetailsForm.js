import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const StudentDetailsForm = ({ onSubmit, initialValues = {} }) => {

	const validationSchema = Yup.object({
		full_name: Yup.string().required("Full name is required"),
		academic_level: Yup.string().required("Education level is required"),
		school_name: Yup.string().required("School/Institution name is required"),
		fee_amount: Yup.number()
			.positive("Amount must be positive")
			.required("Fee amount is required"),
		story: Yup.string()
			.min(50, "Story must be at least 50 characters")
			.required("Personal story is required"),
		profile_image: Yup.string().optional(),
	});

	const defaultValues = {
		full_name: "",
		academic_level: "",
		school_name: "",
		fee_amount: "",
		story: "",
		profile_image: "",
		...initialValues,
	};

	// Function to calculate form completion percentage
	const calculateProgress = (values) => {
		const requiredFields = ['full_name', 'academic_level', 'school_name', 'fee_amount', 'story'];
		const completedFields = requiredFields.filter(field => {
			const value = values[field];
			if (field === 'story') {
				return value && value.length >= 50;
			}
			return value && value.toString().trim() !== '';
		});
		return Math.round((completedFields.length / requiredFields.length) * 100);
	};

	return (
		<div className="enhanced-form-container">
			<Formik
				initialValues={defaultValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ values, errors, touched, setFieldValue }) => {
					const progressPercentage = calculateProgress(values);
					
					return (
						<>
							<div className="form-progress">
								<div className="progress-bar">
									<div 
										className="progress-fill"
										style={{ width: `${progressPercentage}%` }}
									></div>
								</div>
								<span className="progress-text">
									{progressPercentage === 100 ? 'Profile Complete!' : `Complete your profile (${progressPercentage}%)`}
								</span>
							</div>

							<div className="form-header">
								<div className="header-icon"></div>
								<h1>Student Profile</h1>
								<p>Help donors understand your educational journey</p>
							</div>
						<Form className="enhanced-form">
							<div className="form-sections">
								{/* Personal Information */}
								<div className="form-section">
									<h3>Personal Information</h3>
									<div className="form-grid">
										<div className="form-field">
											<label>Full Name</label>
											<Field
												type="text"
												name="full_name"
												placeholder="Your full name"
												className={
													touched.full_name && errors.full_name ? "error" : ""
												}
											/>
											<ErrorMessage
												name="full_name"
												component="div"
												className="error"
											/>
										</div>

										<div className="form-field">
											<label>Education Level</label>
											<Field
												as="select"
												name="academic_level"
												className={
													touched.academic_level && errors.academic_level
														? "error"
														: ""
												}
											>
												<option value="">Select Level</option>
												<option value="primary">Primary School</option>
												<option value="secondary">Secondary School</option>
												<option value="university">University/College</option>
											</Field>
											<ErrorMessage
												name="academic_level"
												component="div"
												className="error"
											/>
										</div>

										<div className="form-field">
											<label>School/Institution Name</label>
											<Field
												type="text"
												name="school_name"
												placeholder="School or University name"
												className={
													touched.school_name && errors.school_name
														? "error"
														: ""
												}
											/>
											<ErrorMessage
												name="school_name"
												component="div"
												className="error"
											/>
										</div>

										<div className="form-field">
											<label>Fee Amount (KSh)</label>
											<Field
												type="number"
												name="fee_amount"
												placeholder="Amount needed"
												className={
													touched.fee_amount && errors.fee_amount ? "error" : ""
												}
											/>
											<ErrorMessage
												name="fee_amount"
												component="div"
												className="error"
											/>
										</div>
									</div>
								</div>

								{/* Story Section */}
								<div className="form-section">
									<h3>Tell Your Story</h3>
									<div className="form-field full-width">
										<label>Personal Story</label>
										<Field
											as="textarea"
											name="story"
											placeholder="Share your educational journey, goals, and why you need support. This should be at least 50 characters long..."
											rows="5"
											className={touched.story && errors.story ? "error" : ""}
										/>
										<small className="field-hint">
											Be authentic and specific about your aspirations. Minimum
											50 characters.
										</small>
										<ErrorMessage
											name="story"
											component="div"
											className="error"
										/>
									</div>

									<div className="form-field full-width">
										<label>Profile Image URL (Optional)</label>
										<Field
											type="url"
											name="profile_image"
											placeholder="https://example.com/your-photo.jpg"
											className={
												touched.profile_image && errors.profile_image
													? "error"
													: ""
											}
										/>
										<small className="field-hint">
											Optional: URL to your profile photo
										</small>
										<ErrorMessage
											name="profile_image"
											component="div"
											className="error"
										/>
									</div>
								</div>
							</div>

							<button type="submit" className="submit-button">
								Submit Profile
							</button>
						</Form>
						</>
					);
				}}
			</Formik>
		</div>
	);

 
};

export default StudentDetailsForm;
