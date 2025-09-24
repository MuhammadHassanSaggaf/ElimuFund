import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const StudentDetailsForm = ({ onSubmit, initialValues = {} }) => {
  const validationSchema = Yup.object({
    institution: Yup.string().required("Institution name is required"),
    educationLevel: Yup.string().required("Education level is required"),
    course: Yup.string().when('educationLevel', {
      is: 'primary', 
      then: (schema) => schema.required('Class/Stream is required'),
      otherwise: (schema) => schema.required('Course/Program is required')
    }),
    yearOfStudy: Yup.string().when('educationLevel', {
      is: 'primary',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required('Year of study is required')
    }),
    expectedGraduation: Yup.date().required("Expected graduation date is required"),
    fundingNeeded: Yup.number()
      .positive("Amount must be positive")
      .required("Funding amount is required"),
    purpose: Yup.string().required("Purpose of funding is required"),
    academicRecord: Yup.string().required("Academic record is required"),
    personalStatement: Yup.string()
      .required("Personal statement is required"),
  });

  const defaultValues = {
    institution: "",
    educationLevel: "",
    course: "",
    yearOfStudy: "",
    expectedGraduation: "",
    fundingNeeded: "",
    purpose: "",
    academicRecord: "",
    personalStatement: "",
    profileImage: "",
    ...initialValues,
  };

  return (
    <div className="enhanced-form-container">
      <div className="form-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <span className="progress-text">Complete your profile</span>
      </div>
      
      <div className="form-header">
        <div className="header-icon">🎓</div>
        <h1>Student Profile</h1>
        <p>Help donors understand your educational journey</p>
      </div>

      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => {
          const getYearOptions = () => {
            switch(values.educationLevel) {
              case 'primary':
                return [
                  { value: 'grade1', label: 'Grade 1' },
                  { value: 'grade2', label: 'Grade 2' },
                  { value: 'grade3', label: 'Grade 3' },
                  { value: 'grade4', label: 'Grade 4' },
                  { value: 'grade5', label: 'Grade 5' },
                  { value: 'grade6', label: 'Grade 6' },
                  { value: 'grade7', label: 'Grade 7' },
                  { value: 'grade8', label: 'Grade 8' }
                ];
              case 'secondary':
                return [
                  { value: 'form1', label: 'Form 1' },
                  { value: 'form2', label: 'Form 2' },
                  { value: 'form3', label: 'Form 3' },
                  { value: 'form4', label: 'Form 4' }
                ];
              case 'university':
                return [
                  { value: 'year1', label: 'First Year' },
                  { value: 'year2', label: 'Second Year' },
                  { value: 'year3', label: 'Third Year' },
                  { value: 'year4', label: 'Fourth Year' },
                  { value: 'graduate', label: 'Graduate Studies' }
                ];
              default:
                return [];
            }
          };
          
          const getPurposeOptions = () => {
            switch(values.educationLevel) {
              case 'primary':
                return [
                  { value: 'school_fees', label: '📖 School Fees' },
                  { value: 'uniform', label: '👕 School Uniform' },
                  { value: 'books', label: '📚 Books & Stationery' },
                  { value: 'meals', label: '🍽️ School Meals' },
                  { value: 'transport', label: '🚌 Transport' }
                ];
              case 'secondary':
                return [
                  { value: 'school_fees', label: '📖 School Fees' },
                  { value: 'boarding', label: '🏠 Boarding Fees' },
                  { value: 'books', label: '📚 Books & Materials' },
                  { value: 'uniform', label: '👕 School Uniform' },
                  { value: 'exam_fees', label: '📝 Exam Fees' }
                ];
              case 'university':
                return [
                  { value: 'tuition', label: '📖 Tuition Fees' },
                  { value: 'accommodation', label: '🏠 Accommodation' },
                  { value: 'books', label: '📚 Books & Materials' },
                  { value: 'living', label: '🍽️ Living Expenses' },
                  { value: 'equipment', label: '💻 Equipment/Technology' },
                  { value: 'graduation', label: '🎓 Graduation Expenses' }
                ];
              default:
                return [
                  { value: 'other', label: '📋 Other' }
                ];
            }
          };

          return (
          <Form className="enhanced-form">
            <div className="form-sections">
              {/* Personal Information */}
              <div className="form-section">
                <h3>👤 Personal Information</h3>
                <div className="form-grid">
              <div className="form-field">
                <label>Education Level</label>
                <Field 
                  as="select" 
                  name="educationLevel" 
                  className={touched.educationLevel && errors.educationLevel ? 'error' : ''}
                  onChange={(e) => {
                    setFieldValue('educationLevel', e.target.value);
                    setFieldValue('yearOfStudy', '');
                  }}
                >
                  <option value="">Select Level</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="university">University/College</option>
                </Field>
                <ErrorMessage name="educationLevel" component="div" className="error" />
              </div>

              <div className="form-field">
                <label>Institution</label>
                <Field
                  type="text"
                  name="institution"
                  placeholder="School/University name"
                  className={touched.institution && errors.institution ? 'error' : ''}
                />
                <ErrorMessage name="institution" component="div" className="error" />
              </div>

              <div className="form-field">
                <label>
                  {values.educationLevel === 'primary' ? 'Class/Stream' : 
                   values.educationLevel === 'secondary' ? 'Stream/Track' : 'Course/Program'}
                </label>
                <Field
                  type="text"
                  name="course"
                  placeholder={
                    values.educationLevel === 'primary' ? 'e.g., Class 5A' :
                    values.educationLevel === 'secondary' ? 'e.g., Science, Arts, Technical' :
                    'Your course or program'
                  }
                  className={touched.course && errors.course ? 'error' : ''}
                />
                <ErrorMessage name="course" component="div" className="error" />
              </div>

              {values.educationLevel !== 'primary' && (
                <div className="form-field">
                  <label>{values.educationLevel === 'secondary' ? 'Form' : 'Year'}</label>
                  <Field as="select" name="yearOfStudy" className={touched.yearOfStudy && errors.yearOfStudy ? 'error' : ''}>
                    <option value="">Select {values.educationLevel === 'secondary' ? 'Form' : 'Year'}</option>
                    {getYearOptions().map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="yearOfStudy" component="div" className="error" />
                </div>
              )}

              <div className="form-field">
                <label>
                  {values.educationLevel === 'primary' ? 'KPSEA Exam Date' :
                   values.educationLevel === 'secondary' ? 'KCSE Exam Date' :
                   'Expected Graduation'}
                </label>
                <Field
                  type="date"
                  name="expectedGraduation"
                  className={touched.expectedGraduation && errors.expectedGraduation ? 'error' : ''}
                />
                <ErrorMessage name="expectedGraduation" component="div" className="error" />
              </div>

              <div className="form-field">
                <label>Academic Record</label>
                <Field
                  type="text"
                  name="academicRecord"
                  placeholder="GPA or grade average"
                  className={touched.academicRecord && errors.academicRecord ? 'error' : ''}
                />
                <ErrorMessage name="academicRecord" component="div" className="error" />
              </div>

              <div className="form-field">
                <label>Funding Needed ($)</label>
                <Field
                  type="number"
                  name="fundingNeeded"
                  placeholder="Amount needed"
                  className={touched.fundingNeeded && errors.fundingNeeded ? 'error' : ''}
                />
                <ErrorMessage name="fundingNeeded" component="div" className="error" />
              </div>

              <div className="form-field">
                <label>Purpose</label>
                <Field 
                  as="select" 
                  name="purpose" 
                  className={touched.purpose && errors.purpose ? 'error' : ''}
                  onChange={(e) => setFieldValue('purpose', e.target.value)}
                >
                  <option value="">Select Purpose</option>
                  {getPurposeOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Field>
                <ErrorMessage name="purpose" component="div" className="error" />
              </div>

                </div>
              </div>

              {/* Academic Information */}
              <div className="form-section">
                <h3>📚 Academic Information</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Academic Record</label>
                    <Field
                      type="text"
                      name="academicRecord"
                      placeholder="GPA or grade average"
                      className={touched.academicRecord && errors.academicRecord ? 'error' : ''}
                    />
                    <ErrorMessage name="academicRecord" component="div" className="error" />
                  </div>
                  
                  <div className="form-field">
                    <label>Expected Graduation</label>
                    <Field
                      type="date"
                      name="expectedGraduation"
                      className={touched.expectedGraduation && errors.expectedGraduation ? 'error' : ''}
                    />
                    <ErrorMessage name="expectedGraduation" component="div" className="error" />
                  </div>
                </div>
              </div>

              {/* Funding Information */}
              <div className="form-section">
                <h3>💰 Funding Details</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Funding Needed ($)</label>
                    <Field
                      type="number"
                      name="fundingNeeded"
                      placeholder="Amount needed"
                      className={touched.fundingNeeded && errors.fundingNeeded ? 'error' : ''}
                    />
                    <ErrorMessage name="fundingNeeded" component="div" className="error" />
                  </div>

                  <div className="form-field">
                    <label>Purpose</label>
                    <Field 
                      as="select" 
                      name="purpose" 
                      className={touched.purpose && errors.purpose ? 'error' : ''}
                      onChange={(e) => setFieldValue('purpose', e.target.value)}
                    >
                      <option value="">Select Purpose</option>
                      {getPurposeOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="purpose" component="div" className="error" />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <h3>✍️ Tell Your Story</h3>


                <div className="form-field full-width">
                  <label>Personal Statement</label>
                  <Field
                    as="textarea"
                    name="personalStatement"
                    placeholder="Share your educational journey, goals, and why you need support..."
                    rows="5"
                    className={touched.personalStatement && errors.personalStatement ? 'error' : ''}
                  />
                  <small className="field-hint">Be authentic and specific about your aspirations</small>
                  <ErrorMessage name="personalStatement" component="div" className="error" />
                </div>
                
                <div className="form-field full-width">
                  <label>Supporting Documents</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFieldValue('documents', e.target.files)}
                    className="file-input"
                  />
                  <small className="field-hint">Upload transcripts, school ID, or fee structure (PDF, JPG, PNG)</small>
                </div>
              </div>
            </div>

            <div className="form-submit-section">
              <button 
                type="submit" 
                className="submit-button"
                style={{
                  background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)',
                  color: '#FFFFFF',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '24px',
                  boxShadow: '0 8px 25px rgba(139, 69, 19, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                📝 Submit Profile
              </button>
            </div>
          </Form>
        )}}
      </Formik>
    </div>
  );
};

export default StudentDetailsForm;