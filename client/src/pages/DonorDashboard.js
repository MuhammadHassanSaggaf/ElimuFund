import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../context/AuthContext";

import apiService from "../services/api";

const DonorDashboard = () => {

	const { user } = useAuth();
	const [allStudents, setAllStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadStudents = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await apiService.getStudents(true); // Get verified students
				const transformedStudents = response.students.map((student) =>
					apiService.transformStudentData(student),
				);
				setAllStudents(transformedStudents);
			} catch (err) {
				console.error("Error loading students:", err);
				setError("Failed to load students");
				setAllStudents([]);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			loadStudents();
		}
	}, [user]);

	const studentsNeedingHelp = allStudents.filter(
		(s) => (s.amount_raised || 0) < s.fee_amount,
	);
	const totalStudents = allStudents.length;
	const totalFundingNeeded = studentsNeedingHelp.reduce(
		(sum, s) => sum + (s.fee_amount - (s.amount_raised || 0)),
		0,
	);

	if (loading) {
		return (
			<div className="dashboard-page">
				<div className="dashboard-header">
					<h1>Loading...</h1>
					<p>Please wait while we fetch the latest student campaigns</p>
				</div>
				<div style={{ textAlign: "center", padding: "40px" }}>
					<div className="loading-spinner">⏳</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="dashboard-page">
				<div className="dashboard-header">
					<h1>Error</h1>
					<p>{error}</p>
				</div>
				<div style={{ textAlign: "center", padding: "40px" }}>
					<button
						onClick={() => window.location.reload()}
						style={{
							padding: "10px 20px",
							background: "#007bff",
							color: "white",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer",
						}}
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="dashboard-page">
			<div className="dashboard-header">
				<h1>Students Who Need Help</h1>
				<p>Find students to support in their educational journey</p>
			</div>

			<div className="dashboard-stats">
				<div className="stat-card">
					<h3>Students Needing Help</h3>
					<p className="stat-number">{studentsNeedingHelp.length}</p>
				</div>
				<div className="stat-card">
					<h3>Total Students</h3>
					<p className="stat-number">{totalStudents}</p>
				</div>
				<div className="stat-card">
					<h3>Funding Needed</h3>
					<p className="stat-number">
						KSh {totalFundingNeeded.toLocaleString()}
					</p>
				</div>
			</div>

			<div className="dashboard-section">
				<h2>Students Who Need Your Help</h2>
				<div className="students-grid">
					{studentsNeedingHelp.length === 0 ? (
						<p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
							No students need help at the moment
						</p>
					) : (
						studentsNeedingHelp.map((student) => {
							const amountRaised = student.amount_raised || 0;
							const goalAmount = student.fee_amount || 0;
							const progressPercentage =
								goalAmount > 0
									? Math.round((amountRaised / goalAmount) * 100)
									: 0;
							const amountNeeded = goalAmount - amountRaised;

							return (
								<Link
									key={student.id}
									to={`/campaign/${student.id}`}
									className="student-help-card"
									style={{
										textDecoration: "none",
										color: "inherit",
										display: "block",
										margin: "20px 0",
										padding: "20px",
										border: "1px solid #ddd",
										borderRadius: "10px",
										cursor: "pointer",
									}}
								>
									<div className="student-info">
										<h4>{student.full_name}</h4>
										<p>🏫 {student.school_name}</p>
										<p>📚 {student.academic_level}</p>
									</div>
									<div className="funding-info">
										<ProgressBar percentage={progressPercentage} />
										<p>{progressPercentage}% funded</p>
										<p>KSh {amountRaised.toLocaleString()} raised</p>
										<p>Needs KSh {amountNeeded.toLocaleString()}</p>
									</div>
									<div
										style={{
											background: "#007bff",
											color: "white",
											padding: "10px",
											borderRadius: "5px",
											textAlign: "center",
											marginTop: "10px",
										}}
									>
										💰 Help {student.full_name.split(" ")[0]}
									</div>
								</Link>
							);
						})
					)}
				</div>
			</div>
		</div>
	);

};

export default DonorDashboard;
