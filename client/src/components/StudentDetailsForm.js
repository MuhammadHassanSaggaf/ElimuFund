import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const StudentDetailsForm = ({ onSubmit, initialValues = {} }) => {
  const validationSchema = Yup.object({
    institution: Yup.string().required("Institution name is required"),
    course: Yup.string().required("Course/Program is required"),
    yearOfStudy: Yup.string().required("Year of study is required"),
    expectedGraduation: Yup.date().required("Expected graduation date is required"),
    fundingNeeded: Yup.number()
      .positive("Amount must be positive")
      .required("Funding amount is required"),
    purpose: Yup.string().required("Purpose of funding is required"),
    academicRecord: Yup.string().required("Academic record is required"),
    personalStatement: Yup.string()
      .min(100, "Personal statement must be at least 100 characters")
      .required("Personal statement is required"),
  });

  const defaultValues = {
    institution: "",
    course: "",
    yearOfStudy: "",
    expectedGraduation: "",
    fundingNeeded: "",
    purpose: "",
    academicRecord: "",
    personalStatement: "",
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="student-details-form">
        <h2>Student Profile Details</h2>
        
        <div className="form-group">
          <Field
            type="text"
            name="institution"
            placeholder="Institution/University Name"
            className="form-input"
          />
          <ErrorMessage name="institution" component="div" className="error-message" />
        </div>

        <div className="form-group">
          <Field
            type="text"
            name="course"
            placeholder="Course/Program"
            className="form-input"
          />
          <ErrorMessage name="course" component="div" className="error-message" />
        </div>

        <div className="form-group">
          <Field as="select" name="yearOfStudy" className="form-input">
            <option value="">Select Year of Study</option>
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3">Third Year</option>
            <option value="4">Fourth Year</option>
            <option value="graduate">Graduate Studies</option>
          </Field>
          <ErrorMessage name="yearOfStudy" component="div" className="error-message" />
        </div>

        <div className="form-group">
          <Field
            type="date"
            name="expectedGraduation"
            className="form-input"
          />
          <ErrorMessage name="expectedGraduation" component="div" className="error-message" />
        </div>

        <div className="form-group">
          <Field
            type="number"
            name="fundingNeeded"
            placeholder="Funding Amount Needed ($)"
            className="form-input"
            min="0"
            step="0.01"
          />
          <ErrorMessage name="fundingNeeded" component="div" className="error-message" />
        </div>

        <div className="form-group">
          <Field as="select" name="purpose" className="form-input">
            <option value="">Purpose of Funding</option>
            <option value="tuition">Tuition Fees</option>
            <option value="books">Books & Materials</option>
            <option value="accommodation">Accommodation</option>
            <option value="living">Living Expenses</option>
            <option value="equipment">Equipment/Technology</option>
            <option value="other">Other</option>
          </Field>
          <ErrorMessage name="purpose" component="div" className="error-message" />
        </div>

        <div className="form-group">
          <Field
            type="text"
            name="academicRecord"
            placeholder="Academic Record/GPA"
            className="form-input"
          />
          <ErrorMessage name="academicRecord" component="div" className="error-message" />
        </div>

        <div className="form-group">
          <Field
            as="textarea"
            name="personalStatement"
            placeholder="Personal Statement (Tell your story, goals, and why you need support)"
            className="form-textarea"
            rows="6"
          />
          <ErrorMessage name="personalStatement" component="div" className="error-message" />
        </div>

        <button type="submit" className="form-button">
          Save Profile
        </button>
      </Form>
    </Formik>
  );
};

export default StudentDetailsForm;