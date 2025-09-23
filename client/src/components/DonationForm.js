import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const DonationForm = ({ student }) => {
  const validationSchema = Yup.object({
    amount: Yup.number()
      .positive("Amount must be positive")
      .required("Donation amount is required"),
    paymentMethod: Yup.string().required("Please select a payment method"),
    anonymous: Yup.boolean(),
  });

  const handleSubmit = (values) => {
    console.log("Donation submitted:", values);
    // TODO: Connect to backend API
  };

  const suggestedAmounts = [1000, 2500, 5000, 10000];
  const remainingAmount = student?.fee_amount && student?.amount_raised 
    ? student.fee_amount - student.amount_raised 
    : 0;

  return (
    <div className="donation-form-container">
      <h3>Support {student.full_name}</h3>
      <p>Remaining amount needed: KSh {remainingAmount.toLocaleString()}</p>

      <Formik
        initialValues={{ amount: "", paymentMethod: "mpesa", anonymous: false }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="donation-form">
            <div className="suggested-amounts">
              {suggestedAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`amount-btn ${
                    Number(values.amount) === amount ? "selected" : ""
                  }`}
                  onClick={() => setFieldValue("amount", amount)}
                >
                  KSh {amount.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="form-group">
              <Field
                type="number"
                name="amount"
                placeholder="Custom amount"
                className="form-input"
              />
              <ErrorMessage
                name="amount"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <Field as="select" name="paymentMethod" className="form-input">
                <option value="mpesa">M-Pesa</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank">Bank Transfer</option>
              </Field>
              <ErrorMessage
                name="paymentMethod"
                component="div"
                className="error-message"
              />
            </div>

            <div className="checkbox-group">
              <label>
                <Field type="checkbox" name="anonymous" />
                Make this donation anonymous
              </label>
            </div>

            <button type="submit" className="form-button donation-btn">
              Donate KSh{" "}
              {values.amount ? Number(values.amount).toLocaleString() : "0"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DonationForm;
