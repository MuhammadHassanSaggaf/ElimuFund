import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiService from "../services/api";

const DonationForm = ({ student }) => {
	const [donationSuccess, setDonationSuccess] = useState(false);
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [availableStudents] = useState([]);
	const [excessAmount] = useState(0);

	const validationSchema = Yup.object({
		amount: Yup.number()
			.positive("Amount must be positive")
			.required("Donation amount is required"),
		paymentMethod: Yup.string().required("Please select a payment method"),
		phoneNumber: Yup.string().when("paymentMethod", {
			is: "mpesa",
			then: (schema) =>
				schema
					.required("Phone number is required")
					.matches(/^254[0-9]{9}$/, "Enter valid number (254XXXXXXXXX)"),
			otherwise: (schema) => schema.notRequired(),
		}),
		selectedBank: Yup.string().when("paymentMethod", {
			is: "bank",
			then: (schema) => schema.required("Please select a bank"),
			otherwise: (schema) => schema.notRequired(),
		}),
		anonymous: Yup.boolean(),
	});

	const handleSubmit = async (values) => {
		try {
			const donationAmount = Number(values.amount);

			// Call API to create donation
			await apiService.createDonation({
				student_id: student.id,
				amount: donationAmount,
				anonymous: values.anonymous || false,
				message: values.message || "",
				paymentMethod: values.paymentMethod || "mpesa",
			});

			setDonationSuccess(true);

			// Refresh the page to show updated amounts
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		} catch (error) {
			console.error("Donation failed:", error);
			alert("Donation failed: " + error.message);
		}
	};

	const handleTransfer = (selectedStudent) => {
		// Update the recipient student's data
		const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
		const updatedStudents = allStudents.map((s) =>
			s.id === selectedStudent.id
				? { ...s, amount_raised: (s.amount_raised || 0) + excessAmount }
				: s,
		);
		localStorage.setItem("students", JSON.stringify(updatedStudents));

		const storedDummy = JSON.parse(
			localStorage.getItem("dummyStudents") || "[]",
		);
		const updatedDummy = storedDummy.map((s) =>
			s.id === selectedStudent.id
				? { ...s, amount_raised: (s.amount_raised || 0) + excessAmount }
				: s,
		);
		localStorage.setItem("dummyStudents", JSON.stringify(updatedDummy));

		setShowTransferModal(false);
		setDonationSuccess(true);
		alert(
			`KSh ${excessAmount.toLocaleString()} has been transferred to help ${
				selectedStudent.full_name
			}!`,
		);
	};

	const skipTransfer = () => {
		setShowTransferModal(false);
		setDonationSuccess(true);
	};

	const isGoalReached = student?.amount_raised >= student?.fee_amount;

	// If goal already reached, show transfer interface directly
	if (isGoalReached && !showTransferModal) {
		const otherStudents = JSON.parse(localStorage.getItem("students") || "[]")
			.concat(JSON.parse(localStorage.getItem("dummyStudents") || "[]"))
			.filter(
				(s) => s.id !== student.id && (s.amount_raised || 0) < s.fee_amount,
			);

		return (
			<div className="transfer-interface">
				<div className="goal-achieved-header">
					<h2>Goal Achieved!</h2>
					<p>
						{student.full_name} has reached their funding goal of KSh{" "}
						{student.fee_amount.toLocaleString()}
					</p>
					<p>Choose a student to transfer funds to:</p>
				</div>
				<div className="student-list">
					{otherStudents.map((s) => {
						const remaining = s.fee_amount - (s.amount_raised || 0);
						return (
							<div
								key={s.id}
								className="student-option"
								onClick={() => {
									const transferAmount = prompt(
										`How much would you like to transfer to ${s.full_name}?`,
										"1000",
									);
									if (transferAmount && Number(transferAmount) > 0) {
										// Update both sender (reset to goal) and recipient (add funds)
										const allStudents = JSON.parse(
											localStorage.getItem("students") || "[]",
										);
										const updatedStudents = allStudents.map((st) => {
											if (st.id === student.id) {
												// Reset sender to exactly their goal amount
												return { ...st, amount_raised: st.fee_amount };
											} else if (st.id === s.id) {
												// Add to recipient
												return {
													...st,
													amount_raised:
														(st.amount_raised || 0) + Number(transferAmount),
												};
											}
											return st;
										});
										localStorage.setItem(
											"students",
											JSON.stringify(updatedStudents),
										);

										const dummyStudents = JSON.parse(
											localStorage.getItem("dummyStudents") || "[]",
										);
										const updatedDummy = dummyStudents.map((st) => {
											if (st.id === student.id) {
												// Reset sender to exactly their goal amount
												return { ...st, amount_raised: st.fee_amount };
											} else if (st.id === s.id) {
												// Add to recipient
												return {
													...st,
													amount_raised:
														(st.amount_raised || 0) + Number(transferAmount),
												};
											}
											return st;
										});
										localStorage.setItem(
											"dummyStudents",
											JSON.stringify(updatedDummy),
										);

										alert(
											`KSh ${Number(
												transferAmount,
											).toLocaleString()} transferred to ${s.full_name}!`,
										);

										// Force page refresh to show changes
										setTimeout(() => {
											window.location.reload();
										}, 1000);
									}
								}}
							>
								<div className="student-name">{s.full_name}</div>
								<div className="student-need">
									Needs: KSh {remaining.toLocaleString()}
								</div>
								<div className="student-school">{s.school_name}</div>
							</div>
						);
					})}
				</div>
				<button
					className="back-btn"
					onClick={() => (window.location.href = "/campaigns")}
				>
					Back to Campaigns
				</button>
			</div>
		);
	}

	if (donationSuccess) {
		return (
			<div className="donation-success">
				<div className="success-icon"></div>
				<h3>Thank You for Your Donation!</h3>
				<p>
					Your generous contribution will make a real difference in{" "}
					{student.full_name}'s education journey.
				</p>
				<p>
					You will receive a confirmation email shortly with your donation
					receipt.
				</p>
				<div className="success-actions">
					<button
						className="btn-primary"
						onClick={() => (window.location.href = "/")}
					>
						Back to Home
					</button>
					<button
						className="btn-secondary"
						onClick={() => window.location.reload()}
					>
						Make Another Donation
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="premium-donation-container">
			<div className="donation-header">
				<div className="student-info">
					<h3>Support {student.full_name}</h3>
					{isGoalReached ? (
						<div className="goal-reached">
							<p>Goal Reached! Donations will help other students.</p>
						</div>
					) : (
						<div className="funding-progress">
							<div className="progress-bar">
								<div
									className="progress-fill"
									style={{
										width: `${Math.min(
											100,
											((student?.amount_raised || 0) /
												(student?.fee_amount || 1)) *
												100,
										)}%`,
									}}
								></div>
							</div>
							<div className="progress-text">
								<span className="raised">
									KSh {(student?.amount_raised || 0).toLocaleString()} raised
								</span>
								<span className="goal">
									of KSh {(student?.fee_amount || 0).toLocaleString()} goal
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			<Formik
				initialValues={{
					amount: "",
					paymentMethod: "mpesa",
					phoneNumber: "",
					selectedBank: "",
					anonymous: false,
				}}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ setFieldValue, values, errors, touched }) => (
					<Form className="donation-form">
						<div className="donation-sections">
							{/* Amount Selection */}
							<div className="donation-section">
								<h4>Donation Amount</h4>
								<div className="custom-amount-section">
									<label>Enter donation amount</label>
									<div className="amount-input-group">
										<span className="currency">KSh</span>
										<Field
											type="number"
											name="amount"
											placeholder="Enter amount"
											className={`amount-input ${
												touched.amount && errors.amount ? "error" : ""
											}`}
										/>
									</div>
									<ErrorMessage
										name="amount"
										component="div"
										className="error"
									/>
								</div>
							</div>

							{/* Payment Method */}
							<div className="donation-section">
								<h4>Payment Method</h4>
								<div className="payment-options">
									<Field name="paymentMethod">
										{({ field }) => (
											<>
												{[
													{
														value: "mpesa",
														icon: "",
														name: "M-Pesa",
														desc: "Mobile money",
													},
													{
														value: "card",
														icon: "",
														name: "Card",
														desc: "Visa/Mastercard",
													},
													{
														value: "bank",
														icon: "",
														name: "Bank",
														desc: "Direct transfer",
													},
												].map((method) => (
													<label
														key={method.value}
														className={`payment-method ${
															field.value === method.value ? "selected" : ""
														}`}
													>
														<input
															type="radio"
															{...field}
															value={method.value}
															checked={field.value === method.value}
														/>
														<div className="method-content">
															<div className="method-icon">{method.icon}</div>
															<div className="method-info">
																<span className="method-name">
																	{method.name}
																</span>
																<span className="method-desc">
																	{method.desc}
																</span>
															</div>
														</div>
													</label>
												))}
											</>
										)}
									</Field>
									<ErrorMessage
										name="paymentMethod"
										component="div"
										className="error"
									/>
								</div>

								{/* M-Pesa Phone Number - Show only when M-Pesa is selected */}
								{values.paymentMethod === "mpesa" && (
									<div className="phone-input">
										<label>M-Pesa Phone Number</label>
										<Field
											type="tel"
											name="phoneNumber"
											placeholder="254712345678"
											className={`phone-field ${
												touched.phoneNumber && errors.phoneNumber ? "error" : ""
											}`}
										/>
										<ErrorMessage
											name="phoneNumber"
											component="div"
											className="error"
										/>
										<small className="input-hint">
											You'll receive an M-Pesa prompt on this number
										</small>
									</div>
								)}

								{/* Bank Selection - Show only when bank is selected */}
								{values.paymentMethod === "bank" && (
									<div className="bank-selection">
										<label>Select Bank</label>
										<Field
											as="select"
											name="selectedBank"
											className={`bank-select ${
												touched.selectedBank && errors.selectedBank
													? "error"
													: ""
											}`}
										>
											<option value="">Choose your bank</option>
											<option value="kbc">KBC Bank</option>
											<option value="cooperative">Cooperative Bank</option>
											<option value="equity">Equity Bank</option>
											<option value="absa">Absa Bank</option>
										</Field>
										<ErrorMessage
											name="selectedBank"
											component="div"
											className="error"
										/>
									</div>
								)}
							</div>

							{/* Privacy Options */}
							<div className="donation-section">
								<div className="privacy-options">
									<label className="privacy-toggle">
										<Field type="checkbox" name="anonymous" />
										<span className="toggle-slider"></span>
										<div className="privacy-info">
											<span className="privacy-title">Anonymous Donation</span>
											<span className="privacy-desc">
												Your name won't be shown publicly
											</span>
										</div>
									</label>
								</div>
							</div>
						</div>

						<div className="donation-summary">
							<div className="summary-card">
								<div className="summary-header">
									<h4>Donation Summary</h4>
								</div>
								<div className="summary-details">
									<div className="summary-row">
										<span>Donation Amount:</span>
										<span className="amount">
											KSh{" "}
											{values.amount
												? Number(values.amount).toLocaleString()
												: "0"}
										</span>
									</div>
									<div className="summary-row">
										<span>Platform Fee (5%):</span>
										<span className="fee">
											KSh{" "}
											{values.amount
												? Math.round(
														Number(values.amount) * 0.05,
												  ).toLocaleString()
												: "0"}
										</span>
									</div>
									<div className="summary-row total">
										<span>Total:</span>
										<span className="total-amount">
											KSh{" "}
											{values.amount
												? Math.round(
														Number(values.amount) * 1.05,
												  ).toLocaleString()
												: "0"}
										</span>
									</div>
								</div>
							</div>

							<button
								type="submit"
								className="premium-donate-btn"
								disabled={
									!values.amount ||
									(values.paymentMethod === "mpesa" && !values.phoneNumber) ||
									(values.paymentMethod === "bank" && !values.selectedBank)
								}
							>
								<span className="btn-icon"></span>
								<span>
									Donate KSh{" "}
									{values.amount ? Number(values.amount).toLocaleString() : "0"}
								</span>
							</button>

							<div className="security-badge">
								<span className="security-icon"></span>
								<span>Secured by 256-bit SSL encryption</span>
							</div>
						</div>
					</Form>
				)}
			</Formik>

			{showTransferModal && (
				<div className="transfer-modal">
					<div className="modal-content">
						<h3>Goal Reached!</h3>
						<p>
							Choose a student to transfer KSh {excessAmount.toLocaleString()}{" "}
							to:
						</p>
						<div className="student-list">
							{availableStudents.map((s) => {
								const remaining = s.fee_amount - (s.amount_raised || 0);
								return (
									<div
										key={s.id}
										className="student-option"
										onClick={() => handleTransfer(s)}
									>
										<div className="student-name">{s.full_name}</div>
										<div className="student-need">
											Needs: KSh {remaining.toLocaleString()}
										</div>
										<div className="student-school">{s.school_name}</div>
									</div>
								);
							})}
						</div>
						<button className="skip-btn" onClick={skipTransfer}>
							Skip Transfer
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DonationForm;
